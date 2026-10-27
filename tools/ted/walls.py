"""벽·문 추출 (벡터 기반).

도면 선 규약 (A-100/101/102 공통, get_drawings 로 확인):
  · 신설 벽 절단선 = 1.32 pt 검정, 기존 벽 = 1.2 pt 회색(0.329), 포셰 벽 외곽 = 0.6 pt 회색 + 0.898 회색 채움
  · 문짝 = 0.84 pt 사각형(두께 ≈ 0.15 ft), 열림 호 = 0.36 pt 짧은 직선 조각(조각마다 별도 객체, seqno 연속)
  · 계단 디딤판 = 0.6 pt 검정, 글자·치수·가구 = 0.24/0.36 pt → 벽에서 제외
벽 = 벽 선끼리 평행·근접(0.12~1.6 ft)한 쌍 사이를 채운 띠 ∪ 포셰 채움 ∪ 벽 선 자체.
마스크 좌표: 행 = z, 열 = x, 원점 (x0, z0), 해상도 ft_per_px.
"""
import math
import re
import numpy as np
from scipy import ndimage
from PIL import Image, ImageDraw
import fitz

EXTENT = (-16.0, -82.0, 276.0, 146.0)       # 로컬 ft (x0, z0, x1, z1): 북측 증축 -76.5 ~ 남측 136.1, 동측 브리지 270.5
WALL_STYLES = {(1.32, 'k'), (1.2, 'g'), (0.6, 'g')}
POCHE = 0.898
PAIR_MIN, PAIR_MAX = 0.12, 1.6             # 벽 두께 범위 (ft)


def _style(d):
    c = d.get('color')
    if not c:
        return None
    c = c[0]
    tone = 'k' if c < 0.05 else ('g' if abs(c - 0.329) < 0.02 else 'o')
    return round(d.get('width') or 0, 2), tone


def _item_segments(sheet, it):
    """그림 항목 → 로컬 ft 선분 목록"""
    L = lambda p: sheet.to_local(*(p * sheet.M))
    k = it[0]
    if k == 'l':
        return [(L(it[1]), L(it[2]))]
    if k == 'c':                       # 베지어 → 4 조각 근사
        p0, c1, c2, p3 = it[1:5]
        pts = []
        for t in np.linspace(0, 1, 5):
            u = 1 - t
            pts.append(L(p0 * (u ** 3) + c1 * (3 * u * u * t) + c2 * (3 * u * t * t) + p3 * (t ** 3)))
        return list(zip(pts[:-1], pts[1:]))
    if k == 're':
        r = it[1]
        q = [L(r.tl), L(r.tr), L(r.br), L(r.bl)]
        return list(zip(q, q[1:] + q[:1]))
    if k == 'qu':
        qd = it[1]
        q = [L(qd.ul), L(qd.ur), L(qd.lr), L(qd.ll)]
        return list(zip(q, q[1:] + q[:1]))
    return []


def _fill_polys(sheet, d):
    """채움 경로 → 로컬 다각형 목록 (re/qu 는 각각, l 은 이어 붙인 하나의 다각형)"""
    L = lambda p: sheet.to_local(*(p * sheet.M))
    polys, cur = [], []
    for it in d['items']:
        if it[0] == 're':
            r = it[1]; polys.append([L(r.tl), L(r.tr), L(r.br), L(r.bl)])
        elif it[0] == 'qu':
            qd = it[1]; polys.append([L(qd.ul), L(qd.ur), L(qd.lr), L(qd.ll)])
        elif it[0] == 'l':
            a, b = L(it[1]), L(it[2])
            if cur and math.dist(cur[-1], a) > 1e-3:
                polys.append(cur); cur = []
            if not cur:
                cur.append(a)
            cur.append(b)
        elif it[0] == 'c':
            cur += [s[1] for s in _item_segments(sheet, it)]
    if len(cur) >= 3:
        polys.append(cur)
    return [p for p in polys if len(p) >= 3]


def drawings(sheet):
    """get_drawings 캐시"""
    if getattr(sheet, '_dr', None) is None:
        sheet._dr = sheet.page.get_drawings()
    return sheet._dr


def wall_geometry(sheet):
    """벽 선분 [(A, B)], 포셰 다각형 [[(x,z),...]], 0.36 pt 가는 선 [(A, B)] (유리 칸막이 후보) — 로컬 ft"""
    segs, poche, thin = [], [], []
    for d in drawings(sheet):
        if d['type'] == 'f':
            f = d.get('fill')
            if f and abs(f[0] - POCHE) < 0.01 and abs(f[1] - POCHE) < 0.01:
                poche += _fill_polys(sheet, d)
            continue
        st = _style(d)
        if st in WALL_STYLES:
            for it in d['items']:
                for a, b in _item_segments(sheet, it):
                    if math.dist(a, b) > 0.02:
                        segs.append((a, b))
        elif st == (0.36, 'k'):
            for it in d['items']:
                if it[0] == 'l':
                    a, b = _item_segments(sheet, it)[0]
                    if math.dist(a, b) >= 2.0:
                        thin.append((a, b))
    return segs, poche, thin


def glass_quads(thin):
    """유리 칸막이·커튼월·유리 난간: 0.36 pt 긴 선(≥ 2 ft)이 0.04~0.6 ft 간격으로 평행하게 겹친 곳 (프레임 선).
    똑같은 선을 두 번 그린 경우(간격 0)는 짝으로 치지 않는다."""
    return pair_quads(thin, dmin=0.04, dmax=0.6, min_overlap=2.0, ang_tol=math.radians(0.5))


def pair_quads(segs, dmin=PAIR_MIN, dmax=PAIR_MAX, min_overlap=0.2, ang_tol=math.radians(1.5)):
    """평행하고 가까운 벽 선 쌍 사이 사각형(벽 두께 띠). 각 선분마다 가장 가까운 짝 하나만 쓴다
    (멀리 있는 다른 벽의 선과 겹쳐 방/샤프트를 채우는 것을 막기 위해)."""
    S = np.array([[a[0], a[1], b[0], b[1]] for a, b in segs if math.dist(a, b) >= 0.25], float)
    if len(S) == 0:
        return []
    d = S[:, 2:] - S[:, :2]
    L = np.hypot(d[:, 0], d[:, 1]); u = d / L[:, None]
    th = np.arctan2(u[:, 1], u[:, 0]) % np.pi
    quads = []
    for i in range(len(S)):
        dth = np.abs(th - th[i]); dth = np.minimum(dth, np.pi - dth)
        c = np.nonzero(dth < ang_tol)[0]
        c = c[c != i]
        if len(c) == 0:
            continue
        p = S[i, :2]; ui = u[i]; ni = np.array([-ui[1], ui[0]])
        # j 의 두 끝점을 i 좌표계로
        a = S[c, :2] - p; b = S[c, 2:] - p
        ta, tb = a @ ui, b @ ui; na, nb = a @ ni, b @ ni
        off = (na + nb) / 2
        lo = np.maximum(0, np.minimum(ta, tb)); hi = np.minimum(L[i], np.maximum(ta, tb))
        ok = (np.abs(off) >= dmin) & (np.abs(off) <= dmax) & (hi - lo >= min_overlap) & (np.abs(na - nb) < 0.05)
        if not ok.any():
            continue
        k = np.nonzero(ok)[0]
        # 같은 쪽에서 가장 가까운 짝만 (양쪽 각각)
        for sgn in (1, -1):
            ks = k[np.sign(off[k]) == sgn]
            if len(ks) == 0:
                continue
            o = np.abs(off[ks]); best = ks[o <= o.min() + 0.02]
            for j in best:
                p0 = p + ui * lo[j]; p1 = p + ui * hi[j]
                q1 = p1 + ni * off[j]; q0 = p0 + ni * off[j]
                quads.append([tuple(p0), tuple(p1), tuple(q1), tuple(q0)])
    return quads


def _raster(extent, ft_per_px):
    x0, z0, x1, z1 = extent
    W = int(round((x1 - x0) / ft_per_px)); H = int(round((z1 - z0) / ft_per_px))
    im = Image.new('L', (W, H), 0)
    P = lambda p: ((p[0] - x0) / ft_per_px, (p[1] - z0) / ft_per_px)
    return im, ImageDraw.Draw(im), P


def _clean(m, ft_per_px, min_area=1.0):
    m = ndimage.binary_closing(m, structure=np.ones((3, 3)))
    lab, n = ndimage.label(m)
    if n:
        sizes = ndimage.sum(m, lab, range(1, n + 1)) * ft_per_px * ft_per_px
        keep = np.zeros(n + 1, bool); keep[1:] = sizes >= min_area
        m = keep[lab]
    return m


def wall_layers(sheet, ft_per_px=0.125, extent=EXTENT, clip=None):
    """벽 래스터 두 겹: solid (벽·기둥) 과 glass (유리 칸막이·커튼월·유리 난간, solid 와 겹치지 않음).
    clip = 로컬 다각형(shapely) — 그 밖(시트의 다른 상세도 등)은 지운다."""
    x0, z0, x1, z1 = extent
    segs, poche, thin = wall_geometry(sheet)
    im, dr, P = _raster(extent, ft_per_px)
    for poly in poche:
        dr.polygon([P(p) for p in poly], fill=255)
    for q in pair_quads(segs):
        dr.polygon([P(p) for p in q], fill=255)
    for a, b in segs:
        dr.line([P(a), P(b)], fill=255, width=2)
    solid = _clean(np.asarray(im) > 0, ft_per_px)
    im, dr, P = _raster(extent, ft_per_px)
    for q in glass_quads(thin):
        dr.polygon([P(p) for p in q], fill=255)
    glass = np.asarray(im) > 0
    glass = ndimage.binary_dilation(glass, structure=np.ones((2, 2))) & ~solid
    glass = _clean(glass, ft_per_px, 0.5) & ~solid
    if clip is not None:
        im, dr, P = _raster(extent, ft_per_px)
        for g in getattr(clip, 'geoms', [clip]):
            dr.polygon([P(p) for p in g.exterior.coords], fill=255)
        inside = np.asarray(im) > 0
        solid &= inside; glass &= inside
    return {'solid': solid, 'glass': glass, 'origin': (x0, z0), 'ft_per_px': ft_per_px}


def wall_mask(sheet, ft_per_px=0.125, extent=EXTENT, with_image=True, clip=None):
    """벽 래스터 (solid ∪ glass). 반환 (mask bool[H,W], (x0, z0), 도면 렌더 RGB 또는 None)"""
    L = wall_layers(sheet, ft_per_px, extent, clip)
    img = sheet.render(ft_per_px, *extent) if with_image else None
    return L['solid'] | L['glass'], L['origin'], img


def wall_polys(mask, origin, ft_per_px=0.125, simplify=0.15, min_area=1.0):
    """마스크 → shapely 다각형 목록 (구멍 포함). 1 화소 두께 홑선(유리 칸막이 표시 등)은
    열림 연산으로 떼어 낸 뒤 다각형화한다."""
    from rasterio import features
    from affine import Affine
    from shapely.geometry import shape
    m = ndimage.binary_opening(mask, structure=np.ones((2, 2)))
    tr = Affine(ft_per_px, 0, origin[0], 0, ft_per_px, origin[1])
    out = []
    for geom, val in features.shapes(m.astype(np.uint8), mask=m, transform=tr):
        if val != 1:
            continue
        g = shape(geom).simplify(simplify, preserve_topology=True)
        if g.area >= min_area and g.is_valid:
            out.append(g)
    return out


# ───────────────────────────────── 문 ─────────────────────────────────

def _fit_circle(P):
    x, z = P[:, 0], P[:, 1]
    A = np.c_[2 * x, 2 * z, np.ones(len(x))]
    (cx, cz, c), *_ = np.linalg.lstsq(A, x * x + z * z, rcond=None)
    r = math.sqrt(max(c + cx * cx + cz * cz, 0))
    return cx, cz, r, float(np.abs(np.hypot(x - cx, z - cz) - r).max())


ARC_STYLES = {(0.36, 'k'), (0.24, 'k'), (0.24, 'g'), (0.36, 'g')}


def _arc_runs(sheet, tol=0.03, gap=0.4):
    """열림 호 후보: 0.24/0.36 pt 짧은 조각을 seqno 순서대로 끝점이 이어지는 동안 한 줄로 묶는다 → [[(x,z),...]].
    점선 호(지하층 기존 문)는 조각 사이가 비므로 seqno 차 ≤ 3, 끝점 간격 ≤ gap ft 까지 잇는다."""
    runs, cur, last_seq, last_end, last_st = [], [], None, None, None
    def close():
        nonlocal cur
        if cur:
            runs.append((cur, last_st))
        cur = []
    for d in drawings(sheet):
        st = _style(d)
        if d['type'] == 'f' or st not in ARC_STYLES:
            continue
        segs = [sg for it in d['items'] for sg in _item_segments(sheet, it)]
        for a, b in segs:
            Lg = math.dist(a, b)
            if not (0.05 <= Lg <= 1.3):
                continue
            if cur and st == last_st and d['seqno'] - last_seq <= 3:
                da, db = math.dist(last_end, a), math.dist(last_end, b)
                lim = tol if d['seqno'] - last_seq <= 1 else gap
                if min(da, db) < lim or (min(da, db) < gap and len(cur) >= 2):
                    nxt = b if da <= db else a
                    cur.append(nxt); last_end = nxt; last_seq = d['seqno']; continue
            close()
            cur = [a, b]; last_end = b; last_seq = d['seqno']; last_st = st
    close()
    return [r for r in runs if len(r[0]) >= 4]


def _leaf_segments(sheet):
    """문짝 후보 선: 0.84 pt (신설), 0.6 pt 회색 (기존), 0.24 pt (가는 선으로 그린 문)"""
    out = []
    for d in drawings(sheet):
        if d['type'] != 'f' and _style(d) in {(0.84, 'k'), (0.6, 'g'), (0.24, 'k'), (0.24, 'g')}:
            for it in d['items']:
                for a, b in _item_segments(sheet, it):
                    if math.dist(a, b) <= 4.8:
                        out.append((a, b))
    return out


def door_arcs(sheet, rmin=1.2, rmax=4.6):
    """문 열림 호 → [{hinge, r, open, closed}] (로컬 ft).
    open = 문짝(0.84 pt) 끝이 닿는 호 끝, closed = 닫힌 위치(벽 개구부 반대쪽 끝)."""
    leaves = _leaf_segments(sheet)
    LE = np.array([[a[0], a[1], b[0], b[1]] for a, b in leaves], float) if leaves else np.zeros((0, 4))
    out = []
    for run, st in _arc_runs(sheet):
        P = np.array(run, float)
        try:
            cx, cz, r, err = _fit_circle(P)
        except np.linalg.LinAlgError:
            continue
        if not (rmin <= r <= rmax) or err > 0.06 * r:
            continue
        ends = [P[0], P[-1]]
        a0 = math.atan2(ends[0][1] - cz, ends[0][0] - cx); a1 = math.atan2(ends[1][1] - cz, ends[1][0] - cx)
        sweep = abs((a1 - a0 + math.pi) % (2 * math.pi) - math.pi)
        if not (math.radians(40) < sweep < math.radians(120)):
            continue
        # 문짝: 경첩에서 호 끝으로 가는 방향의 0.84 선분이 있는 쪽이 열린 끝
        h = np.array([cx, cz])
        score = []
        for e in ends:
            v = (e - h) / r
            if len(LE):
                A, B = LE[:, :2] - h, LE[:, 2:] - h
                # 선분의 두 끝이 경첩-호끝 선 가까이(수직거리 < 0.35 ft) 있고 반지름 범위 안
                pa = np.abs(A[:, 0] * v[1] - A[:, 1] * v[0]); pb = np.abs(B[:, 0] * v[1] - B[:, 1] * v[0])
                ta, tb = A @ v, B @ v
                ok = (pa < 0.35) & (pb < 0.35) & (np.maximum(ta, tb) > 0.5 * r) & (np.minimum(ta, tb) > -0.4) & (np.maximum(ta, tb) < r + 0.4)
                score.append(int(ok.sum()))
            else:
                score.append(0)
        oi = 0 if score[0] >= score[1] else 1
        out.append({'hinge': (float(cx), float(cz)), 'r': float(r),
                    'open': (float(ends[oi][0]), float(ends[oi][1])),
                    'closed': (float(ends[1 - oi][0]), float(ends[1 - oi][1])),
                    'leaf': score[oi] > 0, 'style': st})
    # 같은 호가 두 번 그려진 경우 제거
    uniq = []
    for a in out:
        if not any(math.dist(a['hinge'], b['hinge']) < 0.2 and math.dist(a['closed'], b['closed']) < 0.2 for b in uniq):
            uniq.append(a)
    return uniq


MARK_RE = re.compile(r'^\d{3}[A-Z]?(-[A-Z0-9]{1,2})?$')


def door_tags(sheet, extent=EXTENT):
    """문 태그 글자 [(mark, x, z, vertical)] — 방 번호(9.6 pt 가로 글자)는 제외"""
    out = []
    for t, X, Y, h, r in sheet.words:
        if not MARK_RE.match(t):
            continue
        x, z = sheet.to_local(X, Y)
        if not (extent[0] < x < extent[2] and extent[1] < z < extent[3]):
            continue
        vertical = r.height > r.width * 1.3
        if not vertical and abs(h - 9.6) < 0.4:
            continue                                    # 방 번호
        out.append((t, x, z, vertical))
    return out


def door_schedule(path=None):
    """A-601 문 일람표 → {mark: {pair, w, w2, h, panel, frame, remarks}}"""
    from .sheet import Sheet, sheet_path
    s = Sheet(path or sheet_path('A-601'))
    W = s.page.get_text('words')
    col = [w for w in W if MARK_RE.match(w[4])]
    if not col:
        return {}
    from collections import Counter
    xc = Counter(round(w[0]) for w in col).most_common(1)[0][0]
    rows = {}
    for w in W:
        if xc - 5 < w[0] < xc + 1400:
            rows.setdefault(round((w[1] + w[3]) / 2 / 2.5), []).append(w)
    out = {}
    for k, ws in rows.items():
        ws = sorted(ws, key=lambda w: w[0])
        if not (abs(ws[0][0] - xc) < 5 and MARK_RE.match(ws[0][4])):
            continue
        toks = [w[4] for w in ws[1:]]
        pair = bool(toks) and toks[0] == 'Yes'
        if pair:
            toks = toks[1:]
        dims = [t for t in toks[:4] if re.match(r"^\d+'-\d+", t)]
        def ft(t):
            m = re.match(r"^(\d+)'-(\d+)", t)
            return int(m.group(1)) + int(m.group(2)) / 12 if m else None
        w = ft(dims[0]) if dims else None
        w2 = ft(dims[1]) if pair and len(dims) > 2 else None
        hh = ft(dims[2]) if pair and len(dims) > 2 else (ft(dims[1]) if len(dims) > 1 else None)
        panel = next((t for t in toks if t in ('F', 'FG', 'HG', 'N2', 'OH', '5')), None)
        txt = ' '.join(toks)
        out[ws[0][4]] = {'pair': pair, 'w': w, 'w2': w2, 'h': hh, 'panel': panel,
                         'sliding': 'SLIDING' in txt, 'overhead': panel == 'OH' or ('MTL' in toks and (w or 0) >= 8),
                         'existing': 'EXISTING TO REMAIN' in txt}
    return out


def floor_of_mark(mark):
    return {'0': 'LOWER', '1': 'FIRST', '2': 'SECOND', '3': 'THIRD'}.get(mark[0])


def find_doors(sheet, schedule=None, floor=None, mask=None, origin=None, ft_per_px=0.125):
    """문 개구부 목록. 각 문 = {a, b (개구부 현의 양 끝), kind, hinges, swing (열린 끝들), tag, w}.
    · 여닫이: 열림 호 하나 → a = 경첩, b = 닫힌 끝
    · 양여닫이: 닫힌 끝이 만나는 호 두 개 → a, b = 두 경첩
    · 일람표에 있으나 호가 없는 문(미닫이·오버헤드·개구부): 태그 위치를 중심으로 일람표 폭만큼, 태그 방향(세로 글자 = 세로 벽)으로"""
    arcs = door_arcs(sheet)
    if mask is not None:
        # 경첩·닫힌 끝이 벽(문틀) 가까이 있어야 문 — 치수 인출선 호, 화장실 칸막이 문 등을 걸러 낸다
        near = ndimage.binary_dilation(mask, iterations=max(1, int(round(0.6 / ft_per_px))))
        H, W = near.shape
        def at_wall(p):
            c = int((p[0] - origin[0]) / ft_per_px); r = int((p[1] - origin[1]) / ft_per_px)
            return 0 <= r < H and 0 <= c < W and bool(near[r, c])
        # 0.36 pt 검정 호 = 평면의 표준 문 표기 → 그대로. 가는 0.24 pt·회색 호는 벽 옆 + 문짝이 있을 때만
        std = lambda a: a['style'] == (0.36, 'k')
        arcs = [a for a in arcs if std(a) or (at_wall(a['hinge']) and a['leaf'])]
        closed_ok = {i: std(a) or at_wall(a['closed']) for i, a in enumerate(arcs)}
    else:
        closed_ok = {i: True for i in range(len(arcs))}
    used = set(); doors = []
    for i, a in enumerate(arcs):
        if i in used:
            continue
        mate = None
        for j in range(i + 1, len(arcs)):
            b = arcs[j]
            if j in used:
                continue
            if math.dist(a['closed'], b['closed']) < 0.35 and abs(math.dist(a['hinge'], b['hinge']) - (a['r'] + b['r'])) < 0.5:
                mate = j; break
        if mate is not None:
            b = arcs[mate]; used.add(mate)
            doors.append({'a': a['hinge'], 'b': b['hinge'], 'kind': 'pair', 'hinges': [a['hinge'], b['hinge']],
                          'swing': [a['open'], b['open']], 'w': round(a['r'] + b['r'], 2)})
        else:
            if not closed_ok[i] or a['r'] < 2.4:      # 홑문은 2'-6" 이상 (작은 호 = 화장실 칸막이·치수 인출선)
                continue
            doors.append({'a': a['hinge'], 'b': a['closed'], 'kind': 'single', 'hinges': [a['hinge']],
                          'swing': [a['open']], 'w': round(a['r'], 2)})
        used.add(i)
    # 태그 붙이기: 태그에서 가장 가까운 문(중점 기준, 6 ft 이내), 문 하나에 태그 하나
    tags = door_tags(sheet)
    if floor:
        tags = [t for t in tags if floor_of_mark(t[0]) == floor or (floor == 'LOWER' and t[0].startswith('0'))]
    mids = np.array([((d['a'][0] + d['b'][0]) / 2, (d['a'][1] + d['b'][1]) / 2) for d in doors]) if doors else np.zeros((0, 2))
    cand = []
    for ti, (t, x, z, vert) in enumerate(tags):
        if len(mids):
            dist = np.hypot(mids[:, 0] - x, mids[:, 1] - z)
            for di in np.argsort(dist)[:3]:
                if dist[di] < 6:
                    cand.append((dist[di], ti, int(di)))
    cand.sort(); tag_done = set()
    for dd, ti, di in cand:
        if ti in tag_done or 'tag' in doors[di]:
            continue
        # 같은 번호 태그가 여러 개 (방 번호 겹침 등) → 한 번만
        t = tags[ti][0]
        if any(d.get('tag') == t for d in doors):
            tag_done.add(ti); continue
        doors[di]['tag'] = t; tag_done.add(ti)
    # 호가 없는 일람표 문
    if schedule is not None and floor:
        have = {d.get('tag') for d in doors}
        for t, x, z, vert in tags:
            if t in have or t not in schedule:
                continue
            sc = schedule[t]
            w = (sc['w'] or 3) + (sc['w2'] or 0)
            kind = 'overhead' if sc['overhead'] else ('sliding' if sc['sliding'] else 'opening')
            if vert:
                a, b = (x, z - w / 2), (x, z + w / 2)
            else:
                a, b = (x - w / 2, z), (x + w / 2, z)
            a, b = _snap_tag_door(a, b, vert, mask, origin, ft_per_px)
            doors.append({'a': a, 'b': b, 'kind': kind, 'hinges': [], 'swing': [], 'w': round(w, 2), 'tag': t, 'approx': True})
            have.add(t)
    for d in doors:
        # 거의 축에 나란한 현(호 맞춤 오차 ≤ 6°)은 축에 맞춘다 — 방 경계가 비스듬해지지 않게
        (ax, az), (bx, bz) = d['a'], d['b']
        ang = math.degrees(math.atan2(bz - az, bx - ax)) % 180
        if min(ang, 180 - ang) < 6:
            m = (az + bz) / 2; d['a'], d['b'] = (ax, m), (bx, m)
        elif abs(ang - 90) < 6:
            m = (ax + bx) / 2; d['a'], d['b'] = (m, az), (m, bz)
        d['a'] = tuple(round(v, 3) for v in d['a']); d['b'] = tuple(round(v, 3) for v in d['b'])
    return doors


def _snap_tag_door(a, b, vert, mask, origin, ft_per_px, reach=2.5):
    """태그로 만든 개구부를 가장 가까운 벽 줄에 맞춘다: 개구부와 수직 방향으로 ±reach ft 안에서
    개구부 양 끝 바깥에 벽 화소가 가장 많은 위치로 이동."""
    if mask is None:
        return a, b
    H, W = mask.shape
    def wall_at(x, z):
        c = int((x - origin[0]) / ft_per_px); r = int((z - origin[1]) / ft_per_px)
        return 0 <= r < H and 0 <= c < W and mask[r, c]
    best, bo = -1, 0.0
    for o in np.arange(-reach, reach + 0.01, ft_per_px):
        if vert:
            s = sum(wall_at(a[0] + o, a[1] - k) + wall_at(b[0] + o, b[1] + k) for k in (0.3, 0.6, 1.0))
        else:
            s = sum(wall_at(a[0] - k, a[1] + o) + wall_at(b[0] + k, b[1] + o) for k in (0.3, 0.6, 1.0))
        if s > best or (s == best and abs(o) < abs(bo)):
            best, bo = s, o
    if vert:
        return (a[0] + bo, a[1]), (b[0] + bo, b[1])
    return (a[0], a[1] + bo), (b[0], b[1] + bo)


def thin_enclosures(sheet, min_side=8.0, max_side=60.0, tol=0.7):
    """가는 선(0.36 pt)으로만 그린 닫힌(문 하나 정도 비어도 되는) 직사각형 울타리 → [(x0, z0, x1, z1)].
    예: A-101 의 CM LAB ENCLOSURE 124C (건물 밖 펜스). 긴 가로선 둘 + 그 양 끝을 잇는 세로선 하나 이상."""
    H, V = [], []
    for d in drawings(sheet):
        if d['type'] == 'f' or _style(d) != (0.36, 'k'):
            continue
        for it in d['items']:
            if it[0] != 'l':
                continue
            (ax, az), (bx, bz) = _item_segments(sheet, it)[0]
            if abs(az - bz) < 0.05 and abs(ax - bx) >= min_side:
                H.append((min(ax, bx), max(ax, bx), (az + bz) / 2))
            elif abs(ax - bx) < 0.05 and abs(az - bz) >= min_side:
                V.append((min(az, bz), max(az, bz), (ax + bx) / 2))
    out = []
    for i, (a0, a1, za) in enumerate(H):
        for b0, b1, zb in H[i + 1:]:
            if not (min_side <= abs(zb - za) <= max_side and abs(a0 - b0) < tol and abs(a1 - b1) < tol):
                continue
            z0, z1 = sorted((za, zb))
            sides = [x for c0, c1, x in V if abs(c0 - z0) < tol and abs(c1 - z1) < tol and (abs(x - min(a0, b0)) < tol or abs(x - max(a1, b1)) < tol)]
            if sides:
                r = (round(min(a0, b0), 2), round(z0, 2), round(max(a1, b1), 2), round(z1, 2))
                if r not in out:
                    out.append(r)
    return out
