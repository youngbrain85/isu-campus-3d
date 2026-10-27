"""방 라벨(번호·이름·면적 글자)과 방 다각형.

라벨: 평면의 방 번호 = 9.6 pt 가로 글자 '\\d{3}[A-Z]?' (네모 칸 안), 그 바로 위에 가운데 맞춘 이름 줄들,
      아래에 '182 SF' 같은 면적 글자(있으면).
다각형: 벽 마스크의 빈 공간에서 문 개구부를 문 현(chord)으로 막은 뒤 연결 성분을 나누고, 라벨 점이 든 성분 = 방.
      한 성분에 라벨이 둘 이상이면(열린 평면) 축에 나란한 직선으로 나눈다: 라벨 사이를 가르는 가로/세로 선 가운데
      빈 공간을 가로지르는 길이가 가장 짧은 곳(벽 끝을 이은 선·기둥열·그리드선 우선) — 사선·물결 경계는 만들지 않는다.
"""
import re
import numpy as np
from collections import Counter
from scipy import ndimage
from PIL import Image, ImageDraw

NUM_RE = re.compile(r'^\d{3}[A-Z]?$')
NAME_RE = re.compile(r"^[A-Z][A-Z.&/'\-]*$|^/$|^&$")
NOT_NAME = re.compile(r'^([A-Z]{1,2}\d|[A-Z]-\d|\d)|^(UP|DN|ALIGN|TYP\.?|SIM\.?|EQ|EXIST\.?)$')
LABEL_H = 9.6


def _lines(words, gap=0.35):
    """같은 높이(z)의 글자끼리 줄로 묶기 → [(z, [word...])] (z 오름차순)"""
    out = []
    for w in sorted(words, key=lambda w: w['z']):
        if out and abs(out[-1][0] - w['z']) < gap:
            out[-1][1].append(w)
        else:
            out.append([w['z'], [w]])
    return out


def room_labels(sheet, outline=None):
    """[{number, name, x, z, area_label}] — outline(shapely) 이 있으면 그 안의 라벨만"""
    W = []
    for t, X, Y, h, r in sheet.words:
        if abs(h - LABEL_H) > 0.4 or r.height > r.width * 1.3 and len(t) > 1:
            continue
        x, z = sheet.to_local(X, Y)
        (ax, az), (bx, bz) = sheet.to_local(r.x0, r.y0), sheet.to_local(r.x1, r.y1)
        W.append({'t': t, 'x': x, 'z': z, 'x0': min(ax, bx), 'x1': max(ax, bx)})
    if outline is not None:
        from shapely.geometry import Point
        W = [w for w in W if outline.contains(Point(w['x'], w['z']))]
    names = [w for w in W if NAME_RE.match(w['t']) and not NOT_NAME.match(w['t'])]
    out = []
    for n in W:
        if not NUM_RE.match(n['t']):
            continue
        # 이름: 번호 위로 1.6 ft 이내 줄부터 연속된 줄들, 각 줄에서 번호 중심을 덮는 글자 덩어리
        cand = [w for w in names if abs(w['x'] - n['x']) < 14 and n['z'] - 7 < w['z'] < n['z'] - 0.4]
        lines = _lines(cand)[::-1]
        z_prev, parts = n['z'], []
        for z, ws in lines:
            if z_prev - z > 1.7:
                break
            ws = sorted(ws, key=lambda w: w['x'])
            groups, g = [], [ws[0]]
            for w in ws[1:]:
                if w['x0'] - g[-1]['x1'] < 1.0:
                    g.append(w)
                else:
                    groups.append(g); g = [w]
            groups.append(g)
            hit = [g for g in groups if g[0]['x0'] - 1.0 <= n['x'] <= g[-1]['x1'] + 1.0
                   and abs((g[0]['x0'] + g[-1]['x1']) / 2 - n['x']) < 2.5]
            if not hit:
                continue                    # 옆 방 이름 줄 — 건너뛰고 더 위를 본다
            parts.insert(0, ' '.join(w['t'] for w in hit[0]))
            z_prev = z
        # 면적: 번호 바로 아래 '123 SF'
        area = None
        below = [w for w in sheet_words_small(sheet) if abs(w['x'] - n['x']) < 3 and 0.4 < w['z'] - n['z'] < 2.0]
        for i, w in enumerate(below):
            if w['t'] == 'SF':
                num = [v for v in below if re.match(r'^[\d,]+$', v['t']) and abs(v['z'] - w['z']) < 0.3 and v['x'] < w['x']]
                if num:
                    area = int(max(num, key=lambda v: v['x'])['t'].replace(',', ''))
        out.append({'number': n['t'], 'name': ' '.join(parts).replace(' / ', '/'), 'x': n['x'], 'z': n['z'], 'area_label': area})
    # 같은 자리 중복만 제거 (도면에 같은 번호가 두 방에 붙은 경우는 둘 다 둔다, 예: A-102 의 223)
    uniq = []
    for r in out:
        if not any(u['number'] == r['number'] and abs(u['x'] - r['x']) + abs(u['z'] - r['z']) < 3 for u in uniq):
            uniq.append(r)
    return uniq


def sheet_words_small(sheet):
    """면적 글자(6.6 pt) 등 작은 글자 → [{t, x, z}] (캐시)"""
    if getattr(sheet, '_small', None) is None:
        sheet._small = []
        for t, X, Y, h, r in sheet.words:
            if h < 9:
                x, z = sheet.to_local(X, Y)
                sheet._small.append({'t': t, 'x': x, 'z': z})
    return sheet._small


def close_doors(mask, origin, ft_per_px, doors, width_px=3, ext=0.9, gap=1.5):
    """문 개구부를 현(a→b, 양 끝 ext ft 연장) 선으로 막고, gap ft 보다 좁은 틈(문틀·멀리언 사이)도
    원판 닫힘 연산으로 막은 마스크 사본"""
    im = Image.fromarray((mask * 255).astype(np.uint8))
    dr = ImageDraw.Draw(im)
    P = lambda p: ((p[0] - origin[0]) / ft_per_px, (p[1] - origin[1]) / ft_per_px)
    for d in doors:
        a, b = np.array(d['a'], float), np.array(d['b'], float)
        L = np.linalg.norm(b - a)
        if L < 1e-6:
            continue
        u = (b - a) / L
        dr.line([P(a - u * ext), P(b + u * ext)], fill=255, width=width_px)
    m = np.asarray(im) > 0
    r = int(round(gap / 2 / ft_per_px))
    yy, xx = np.mgrid[-r:r + 1, -r:r + 1]
    disk = xx * xx + yy * yy <= r * r
    pad = r + 1
    mp = np.pad(m, pad)
    return ndimage.binary_closing(mp, structure=disk)[pad:-pad, pad:-pad] | m


def _runs(v):
    """1 차원 bool 배열의 True 구간 [(a, b)] (b 미포함)"""
    d = np.diff(np.r_[0, v.astype(np.int8), 0])
    return list(zip(np.nonzero(d == 1)[0], np.nonzero(d == -1)[0]))


def _axis_split(mask, seeds, ft_per_px, grid_rows=(), grid_cols=(), keep_ft=1.0, step=6):
    """열린 평면 나누기: 씨앗(라벨 화소)들을 가로선(행)·세로선(열)으로 재귀 분할.
    후보선 = 씨앗 사이의 모든 행/열(step 화소 간격). 그 선의 빈 공간 토막을 모두 자른 뒤, 씨앗 없는 조각은
    선 너머 이웃 조각에 다시 붙이고, 실제로 서로 다른 방을 가르는 토막만 '유효 절단'으로 남긴다.
    비용 = 유효 절단 길이 합(그리드선 위면 15 % 할인) → 벽 끝을 이은 좁은 목·기둥열이 뽑힌다. 사선 경계는 생기지 않는다."""
    out = np.zeros(mask.shape, np.int32)
    keep = int(round(keep_ft / ft_per_px))

    def on_grid(v, grid):
        return any(abs(v - g) <= 0.3 / ft_per_px for g in grid)

    def try_cut(sub, sp, axis, v):
        t = sub.copy()
        line = sub[v, :] if axis == 0 else sub[:, v]
        runs = _runs(line)
        if axis == 0:
            t[v, :] = False
        else:
            t[:, v] = False
        lab, n = ndimage.label(t)
        if n < 2:
            return None
        seeded = {}
        for i, (r, c) in sp.items():
            seeded.setdefault(lab[r, c], []).append(i)
        if len(seeded) < 2 or 0 in seeded:
            return None
        # 씨앗 없는 조각 → 선 너머 이웃 조각에 붙인다 (조각끼리는 자른 선으로만 맞닿는다)
        if axis == 0:
            A = lab[max(v - 1, 0), :]; B = lab[min(v + 1, sub.shape[0] - 1), :]
        else:
            A = lab[:, max(v - 1, 0)]; B = lab[:, min(v + 1, sub.shape[1] - 1)]
        adj = {}
        for x, y in zip(A[line], B[line]):
            if x and y and x != y:
                adj.setdefault(x, Counter())[y] += 1; adj.setdefault(y, Counter())[x] += 1
        owner = {k: k for k in seeded}
        frontier = list(seeded)
        while frontier:
            nxt = []
            for k in frontier:
                for j, _ in adj.get(k, Counter()).most_common():
                    if j not in owner:
                        owner[j] = owner[k]; nxt.append(j)
            frontier = nxt
        if len(owner) < n:
            return None
        lut = np.zeros(n + 1, np.int32)
        for k, o in owner.items():
            lut[k] = o
        fl = lut[lab]
        if len(set(owner.values())) < 2:
            return None
        cost, eff = 0, []
        for a, b in runs:
            if axis == 0:
                up = fl[max(v - 1, 0), a:b]; dn = fl[min(v + 1, sub.shape[0] - 1), a:b]
            else:
                up = fl[a:b, max(v - 1, 0)]; dn = fl[a:b, min(v + 1, sub.shape[1] - 1)]
            if np.any((up != dn) & (up > 0) & (dn > 0)):
                cost += b - a; eff.append((a, b))
        if not eff:
            return None
        return cost, eff, owner, seeded

    def rec(m, ids):
        if len(ids) == 1:
            out[m] = ids[0]; return
        rr, cc = np.nonzero(m)
        r0, r1, c0, c1 = rr.min(), rr.max() + 1, cc.min(), cc.max() + 1
        sub = m[r0:r1, c0:c1]
        sp = {i: (seeds[i][0] - r0, seeds[i][1] - c0) for i in ids}
        best = None

        def consider(axis, v):
            nonlocal best
            if any(abs(v - p[axis]) < keep for p in sp.values()):
                return
            if not (0 <= v < sub.shape[axis]):
                return
            res = try_cut(sub, sp, axis, v)
            if res is None:
                return
            g = on_grid(v + (r0 if axis == 0 else c0), grid_rows if axis == 0 else grid_cols)
            cost = res[0] * (0.85 if g else 1.0)
            if best is None or cost < best[0]:
                best = (cost, axis, v, res[1])
        # 거친 탐색(step 화소) 뒤 최선 주변 ±step 을 1 화소로 다듬기 + 그리드선 위치도 따로 시험
        for axis in (0, 1):
            vals = sorted(p[axis] for p in sp.values())
            for v in range(vals[0] + keep, vals[-1] - keep + 1, step):
                consider(axis, v)
            for gv in (grid_rows if axis == 0 else grid_cols):
                v = int(round(gv)) - (r0 if axis == 0 else c0)
                if vals[0] + keep <= v <= vals[-1] - keep:
                    consider(axis, v)
        if best is not None:
            ax_, v_ = best[1], best[2]
            for v in range(v_ - step + 1, v_ + step):
                consider(ax_, v)
        if best is not None:
            _, axis, v, eff = best
            t = sub.copy()
            for a, b in eff:
                if axis == 0:
                    t[v, a:b] = False
                else:
                    t[a:b, v] = False
            lab, n = ndimage.label(t)
            groups = {}
            for i, (r, c) in sp.items():
                groups.setdefault(lab[r, c], []).append(i)
            if len(groups) >= 2 and 0 not in groups:
                assigned = np.zeros(sub.shape, bool)
                for k, g in groups.items():
                    piece = np.zeros(m.shape, bool)
                    piece[r0:r1, c0:c1] = lab == k
                    assigned |= lab == k
                    rec(piece, g)
                return
        # 축 직선으로 못 나누면(드묾) 가장 가까운 씨앗으로
        d = np.full(m.shape, np.inf); bi = np.zeros(m.shape, np.int32)
        yy, xx = np.nonzero(m)
        for i in ids:
            dd = np.hypot(yy - seeds[i][0], xx - seeds[i][1])
            upd = dd < d[yy, xx]
            d[yy[upd], xx[upd]] = dd[upd]; bi[yy[upd], xx[upd]] = i
        out[m] = bi[m]

    rec(mask, list(seeds))
    # 자른 선 화소·씨앗 없는 조각 → 가장 가까운 배정 화소의 방
    hole = mask & (out == 0)
    if hole.any():
        idx = ndimage.distance_transform_edt(out == 0, return_distances=False, return_indices=True)
        out[hole] = out[idx[0][hole], idx[1][hole]]
    return out


def find_rooms(sheet, wall_mask, origin, ft_per_px=0.125, doors=(), outline=None, min_unlabeled=20.0,
               simplify=0.1, open_min=250.0):
    """방 목록 [{number, name, label_xy, poly (shapely), area_ft2, area_label}].
    라벨 없는 닫힌 공간(≥ min_unlabeled ft², 건물 안)은 number='' 로 덧붙인다(샤프트·계단실 등)."""
    from rasterio import features
    from affine import Affine
    from shapely.geometry import shape, Point
    from .sheet import GRID_X, GRID_Z
    labels = room_labels(sheet, outline)
    closed = close_doors(wall_mask, origin, ft_per_px, doors)
    H, W = closed.shape
    # 건물 밖의 가는 선 울타리(라벨 하나를 둘러싼 직사각형, 예: 124C) → 벽처럼 닫는다
    from .walls import thin_enclosures
    from .sheet import building_outline
    core = building_outline('LOWER')
    from shapely.geometry import box as _box
    im = Image.fromarray((closed * 255).astype(np.uint8)); dr = ImageDraw.Draw(im)
    for x0, z0, x1, z1 in thin_enclosures(sheet):
        b = _box(x0, z0, x1, z1)
        n_in = sum(b.contains(Point(L['x'], L['z'])) for L in labels)
        if n_in == 1 and b.intersection(core).area < 0.5 * b.area:
            P = lambda x, z: ((x - origin[0]) / ft_per_px, (z - origin[1]) / ft_per_px)
            dr.rectangle([P(x0, z0), P(x1, z1)], outline=255, width=3)
    closed = np.asarray(im) > 0
    if outline is not None:                     # 건물 밖은 막는다 (외벽 틈으로 바깥과 이어지지 않게)
        im = Image.new('L', (W, H), 0); dr = ImageDraw.Draw(im)
        for g in getattr(outline, 'geoms', [outline]):
            dr.polygon([((x - origin[0]) / ft_per_px, (z - origin[1]) / ft_per_px) for x, z in g.exterior.coords], fill=255)
        inside = np.asarray(im) > 0
    else:
        inside = np.ones_like(closed)
    free = ~closed & inside
    # 바깥 공간: 벽을 1 ft 부풀려(창·외벽 틈 ≤ 2 ft 를 막고) 이미지 가장자리와 이어진 빈 공간 → 다시 1 ft 키워 원래 경계까지
    k = max(1, int(round(1.0 / ft_per_px)))
    thick = ndimage.binary_dilation(closed, iterations=k)
    olab, _ = ndimage.label(~thick)
    edge = np.unique(np.r_[olab[0], olab[-1], olab[:, 0], olab[:, -1]])
    outside = np.isin(olab, edge[edge > 0]) | ~inside
    outside = ndimage.binary_dilation(outside, iterations=k + 1) & free | ~inside
    free &= ~outside
    comp, n = ndimage.label(free)
    # 라벨 → 화소 (벽 위에 있으면 1 ft 안의 가장 가까운 빈 화소)
    markers = np.zeros((H, W), np.int32)
    seeds = []
    for i, L in enumerate(labels, 1):
        c = int((L['x'] - origin[0]) / ft_per_px); r = int((L['z'] - origin[1]) / ft_per_px)
        if not (0 <= r < H and 0 <= c < W):
            continue
        if not free[r, c]:
            rr, cc = np.nonzero(free[max(r - 8, 0):r + 9, max(c - 8, 0):c + 9])
            if not len(rr):
                continue
            k = np.argmin((rr - min(r, 8)) ** 2 + (cc - min(c, 8)) ** 2)
            r, c = max(r - 8, 0) + rr[k], max(c - 8, 0) + cc[k]
        markers[r, c] = i; seeds.append((i, comp[r, c]))
    # 성분마다: 라벨 0개 → 이름 없는 공간, 1개 → 그대로, 2개 이상 → watershed 분할
    region = np.zeros((H, W), np.int32)
    by_comp = {}
    for i, cc in seeds:
        by_comp.setdefault(cc, []).append(i)
    # 라벨이 방 밖(복도·옆 방)에 적힌 작은 방: 그 번호의 문 태그('104A', '104A-1') 반대편에 라벨 없는 닫힌 공간이 있으면 그 공간이 방
    from collections import Counter
    dup = Counter(L['number'] for L in labels)
    num_id = {L['number']: i for i, L in enumerate(labels, 1) if dup[L['number']] == 1}
    comp_of = dict((i, cc) for i, cc in seeds)
    for d in doors:
        base = (d.get('tag') or '').split('-')[0]
        i = num_id.get(base)
        if i is None or i not in comp_of or len(by_comp.get(comp_of[i], [])) < 2:
            continue
        a, b = np.array(d['a'], float), np.array(d['b'], float)
        u = (b - a) / max(np.linalg.norm(b - a), 1e-6); nrm = np.array([-u[1], u[0]]); mid = (a + b) / 2
        for sgn in (1, -1):
            q = mid + sgn * nrm * 1.2
            r, c = int((q[1] - origin[1]) / ft_per_px), int((q[0] - origin[0]) / ft_per_px)
            if not (0 <= r < H and 0 <= c < W):
                continue
            cc = comp[r, c]
            if cc and cc not in by_comp and np.sum(comp == cc) * ft_per_px ** 2 >= 8:
                by_comp[comp_of[i]].remove(i)
                by_comp[cc] = [i]; comp_of[i] = cc
                markers[markers == i] = 0; markers[r, c] = i
                break
    by_comp = {k: v for k, v in by_comp.items() if v}
    objs = ndimage.find_objects(comp)
    for cc, ids in by_comp.items():
        sl = objs[cc - 1]
        sub = comp[sl] == cc
        if len(ids) == 1:
            region[sl][sub] = ids[0]
        else:
            pts = {i: tuple(np.argwhere(markers[sl] == i)[0]) for i in ids}
            y0, x0 = sl[0].start, sl[1].start
            gx = [(gv - origin[0]) / ft_per_px - x0 for gv in GRID_X.values()]
            gz = [(gv - origin[1]) / ft_per_px - y0 for gv in GRID_Z.values()]
            ws = _axis_split(sub, pts, ft_per_px, gz, gx)
            region[sl][sub] = ws[sub]
    nxt = len(labels) + 1
    extra = []
    border = set(np.unique(np.r_[comp[0], comp[-1], comp[:, 0], comp[:, -1]]))
    for cc in range(1, n + 1):
        if cc in by_comp or cc in border:
            continue
        sl = objs[cc - 1]; sub = comp[sl] == cc
        if sub.sum() * ft_per_px ** 2 >= min_unlabeled:
            region[sl][sub] = nxt; extra.append(nxt); nxt += 1
    tr = Affine(ft_per_px, 0, origin[0], 0, ft_per_px, origin[1])
    polys = {}
    for geom, val in features.shapes(region, mask=region > 0, transform=tr):
        g = shape(geom)
        if val not in polys or g.area > polys[int(val)].area:
            polys[int(val)] = g
    rooms = []
    for i, L in enumerate(labels, 1):
        if i not in polys:
            continue
        g = polys[i].simplify(simplify, preserve_topology=True)
        rooms.append({'number': L['number'], 'name': L['name'], 'label_xy': (L['x'], L['z']), 'poly': g,
                      'area_ft2': round(g.area, 1), 'area_label': L['area_label']})
    for k in extra:
        if k not in polys:
            continue
        g = polys[k].simplify(simplify, preserve_topology=True)
        p = g.representative_point()
        # 라벨 없는 넓은 공간 = 대개 아래층으로 트인 곳(OPEN TO BELOW: 2층 로비 위·고베이·CM 랩 위)
        rooms.append({'number': '', 'name': '', 'label_xy': (p.x, p.y), 'poly': g, 'area_ft2': round(g.area, 1), 'area_label': None,
                      'open': bool(g.area > open_min)})
    return rooms
