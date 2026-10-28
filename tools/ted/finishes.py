"""마감(바닥·걸레받이·벽)과 천장(종류·높이·조명).

· A-650 마감 일람표: 코드(PT-01, CPT-02, ACT-01 …) → 제조사·제품·색 설명 + 대표 RGB
· A-151/A-152 마감 평면: 방마다 'W / B / F' 세 줄 태그(위에 방 번호) → 벽·걸레받이·바닥 코드
  (그리드 기호가 없는 시트 → 방 번호 글자 위치를 A-101/102 와 맞춰 평행이동을 구한다)
· A-131/A-132 천장도: 'ACT-02 / 9'-0" A.F.F.' 태그 → 위치로 방에 배정,
  조명 = 회색 이중선(0.48 pt 회색 · 1.2 pt 회색, 간격 0.2~0.45 ft)의 선형 등기구와 2×2·2×4 등기구 사각형
"""
import re
import math
from collections import Counter
import numpy as np

CODE_RE = re.compile(r'^[A-Z]{1,4}-X?\d{1,2}$')
NUM_RE = re.compile(r'^\d{3}[A-Z]?$')

# Sherwin-Williams 등 일람표에 나오는 색 번호 → 대략 RGB (제조사 색견본 근사값)
SW_RGB = {'7636': (229, 226, 218), '7674': (88, 87, 85), '7649': (194, 192, 186), '9135': (126, 150, 155),
          '7067': (127, 129, 126), '6804': (83, 105, 145)}
# 코드 접두어 → (종류, 기본 RGB)
TYPE_RGB = {
    'PT': ('paint', (232, 230, 224)), 'HPC': ('epoxy paint', (229, 226, 218)), 'WC': ('wallcovering', (200, 196, 188)),
    'WP': ('wall protection', (210, 210, 205)), 'CG': ('corner guard', (215, 215, 210)), 'VDS': ('whiteboard wall', (245, 245, 245)),
    'AT': ('acoustic panel', (110, 115, 120)), 'AF': ('applied film', (230, 235, 238)), 'CT': ('ceramic tile', (196, 182, 160)),
    'GT': ('grout', (160, 160, 155)), 'CPT': ('carpet tile', (105, 105, 108)), 'EP': ('epoxy flooring', (150, 150, 146)),
    'LVT': ('luxury vinyl tile', (150, 125, 95)), 'QT': ('quarry tile', (150, 80, 60)), 'RA': ('rubber flooring', (70, 70, 72)),
    'RF': ('rubber flooring', (95, 95, 98)), 'SDT': ('static dissipative tile', (130, 130, 128)), 'TZ': ('terrazzo', (215, 212, 204)),
    'WO': ('wood flooring', (176, 138, 90)), 'RB': ('rubber base', (60, 60, 62)), 'EPB': ('epoxy base', (150, 150, 146)),
    'TZB': ('terrazzo base', (215, 212, 204)), 'QTB': ('quarry tile base', (150, 80, 60)), 'CTB': ('ceramic tile base', (196, 182, 160)),
    'WDB': ('wood base', (176, 138, 90)), 'EXPOSED': ('exposed structure (painted)', (214, 214, 210)), 'OPEN': ('open to above', (214, 214, 210)), 'ACT': ('acoustic ceiling tile', (242, 242, 238)), 'MTL': ('metal ceiling', (200, 202, 204)),
    'MT': ('metal ceiling', (200, 202, 204)), 'WD': ('wood ceiling', (181, 137, 90)), 'GWB': ('gypsum board ceiling', (240, 240, 236)),
    'WT': ('window treatment', (200, 200, 195)), 'PL': ('plastic laminate', (200, 200, 195)), 'QTZ': ('quartz', (225, 222, 215)),
    'SSM': ('solid surface', (225, 222, 215)), 'TEX': ('textile', (120, 120, 125)), 'ETR': ('existing to remain', (168, 166, 160)),
}
WORD_RGB = [('WHITE', (240, 240, 236)), ('BLACK', (40, 40, 42)), ('BLUE', (90, 110, 140)), ('GRAY', (140, 140, 140)),
            ('GREY', (140, 140, 140)), ('LATTE', (196, 176, 148)), ('OAK', (176, 138, 90)), ('CHARCOAL', (60, 60, 62))]


def code_type(code):
    m = re.match(r'^([A-Z]+)', code or '')
    return TYPE_RGB.get(m.group(1) if m else '', ('unknown', (200, 200, 200)))


def finish_schedule(path=None):
    """A-650 → {code: {type, desc, color: [r,g,b]}}"""
    from .sheet import Sheet, sheet_path
    s = Sheet(path or sheet_path('A-650'))
    W = s.page.get_text('words')
    tags = sorted([w for w in W if CODE_RE.match(w[4]) and 600 < w[0] < 640], key=lambda w: w[1])
    cols = [(663, 'mfr'), (827, 'style'), (1204, 'size'), (1568, 'product'), (1675, 'color'), (1885, 'remarks'), (2100, None)]
    out = {}
    for i, t in enumerate(tags):
        y0 = t[1] - 2; y1 = tags[i + 1][1] - 2 if i + 1 < len(tags) and tags[i + 1][1] - t[1] < 60 else t[1] + 12
        f = {}
        for w in sorted(W, key=lambda w: (round(w[1]), w[0])):
            if not (y0 <= w[1] < y1) or w[0] < 655:
                continue
            for (x, k), (xn, _) in zip(cols, cols[1:]):
                if k and x - 3 <= w[0] < xn - 3:
                    f.setdefault(k, []).append(w[4])
        f = {k: ' '.join(v) for k, v in f.items()}
        code = t[4]
        typ, rgb = code_type(code)
        txt = ' '.join(f.get(k, '') for k in ('product', 'color')).upper()
        m = re.search(r'S?W\s?(\d{4})', txt)
        if m and m.group(1) in SW_RGB:
            rgb = SW_RGB[m.group(1)]
        else:
            for k, c in WORD_RGB:
                if k in f.get('color', '').upper():
                    rgb = c; break
        desc = ' '.join(v for v in (f.get('mfr'), f.get('style'), f.get('color')) if v and v not in ('-', 'N/A'))
        if code not in out:
            out[code] = {'type': typ, 'desc': desc.strip(), 'color': list(rgb)}
    return out


def material(code, schedule):
    """코드 → {code, type, desc, color} (일람표에 없으면 접두어로 추정)"""
    if not code:
        return None
    if code in schedule:
        return dict(code=code, **schedule[code])
    typ, rgb = code_type(code)
    return {'code': code, 'type': typ, 'desc': '', 'color': list(rgb)}


def room_finishes(fin_sheet, plan_sheet, rooms):
    """마감 평면 → {방 번호: {wall: [codes], base, floor}}.
    태그 위에 방 번호가 있으면 그 번호, 없으면(복도·계단 등) 태그 위치가 든 방(평면과 포셰로 맞춘 좌표)."""
    from shapely.geometry import Point
    if fin_sheet.ax is None:
        fin_sheet.align_to(plan_sheet)
    W = fin_sheet.words
    out = {}
    for f in [w for w in W if w[0] == 'F' and abs(w[3] - 9.6) < 0.5]:
        x, y = f[1], f[2]
        has = lambda ch, dy: any(w[0] == ch and abs(w[1] - x) < 2 and abs(w[2] - (y + dy)) < 3 for w in W)
        if not (has('B', -9.5) and has('W', -19)):
            continue
        row = lambda dy: [w[0] for w in sorted(W, key=lambda w: w[1]) if 15 < w[1] - x < 90 and abs(w[2] - y - dy) < 3 and w[0] != '/']
        codes = {'wall': [c for c in row(-19) if CODE_RE.match(c) or c == 'ETR'],
                 'base': next((c for c in row(-9.5) if CODE_RE.match(c) or c == 'ETR'), None),
                 'floor': next((c for c in row(0) if CODE_RE.match(c) or c == 'ETR'), None)}
        num = [w for w in W if NUM_RE.match(w[0]) and abs(w[1] - x - 21) < 15 and abs(w[2] - y + 31) < 4]
        if num:
            keys = [num[0][0]]
        else:
            lx, lz = fin_sheet.to_local(x + 20, y - 10)
            keys = [r['number'] for r in rooms if r['number'] and r['poly'].buffer(0.5).contains(Point(lx, lz))]
        for key in keys:
            if key not in out:
                out[key] = codes
    return out


def _height(tokens):
    t = ' '.join(tokens).replace('’', "'")
    m = re.search(r"(\d+)'\s*-\s*(\d+)(?:\s+(\d+)/(\d+))?", t)
    if not m:
        return None
    v = int(m.group(1)) + int(m.group(2)) / 12
    if m.group(3):
        v += int(m.group(3)) / int(m.group(4)) / 12
    return round(v, 3)


def ceiling_tags(rcp):
    """천장 태그 → [(x, z, code, height_ft | None)] (로컬 ft). 'PT-03 / EXPOSED' = 노출 천장(높이 없음)."""
    W = rcp.words
    out = []
    for t, X, Y, h, r in W:
        if t == 'A.F.F.':
            line = sorted([w for w in W if abs(w[2] - Y) < 3 and 0 < X - w[1] < 45 and w[0] != 'A.F.F.'], key=lambda w: w[1])
            hgt = _height([w[0] for w in line])
            above = [w for w in W if 6 < Y - w[2] < 14 and abs(w[1] - (X - 12)) < 25 and (CODE_RE.match(w[0]) or w[0] in ('EXPOSED', 'OPEN'))]
            if not above:      # 배플 천장(AT-03) 처럼 코드와 높이 사이에 화살표가 끼어 멀리 떨어진 태그 (A-131 복도 146)
                above = [w for w in W if 14 <= Y - w[2] < 40 and abs(w[1] - (X - 12)) < 12 and CODE_RE.match(w[0])
                         and not any(v[0] == 'A.F.F.' and 0 < v[2] - w[2] < Y - w[2] - 3 and abs(v[1] - X) < 30 for v in W)]
            cw = min(above, key=lambda w: abs(w[1] - (X - 12))) if above else None
            code = cw[0] if cw else None
            x, z = rcp.to_local(X - 12, Y - 5)
            if code != 'XXX-01':
                out.append((x, z, code, hgt, _wbox(rcp, line + [w for w in W if w[0] == 'A.F.F.' and w[1] == X and w[2] == Y] + ([cw] if cw else []))))
        elif t == 'EXPOSED':
            above = [w for w in W if 6 < Y - w[2] < 14 and abs(w[1] - X) < 25 and CODE_RE.match(w[0])]
            below = [w for w in W if 0 < w[2] - Y < 14 and abs(w[1] - X) < 30 and w[0] == 'A.F.F.']
            if below:
                continue                      # 'EXPOSED / 14'-0" A.F.F.' 는 위에서 처리
            x, z = rcp.to_local(X, Y)
            out.append((x, z, 'EXPOSED' + ('/' + above[0][0] if above else ''), None,
                        _wbox(rcp, [w for w in W if w[0] == 'EXPOSED' and w[1] == X and w[2] == Y] + above[:1])))
    return out


def _wbox(sheet, words, pad=0.45):
    """글자들의 로컬 ft 경계 상자 (+여백: 태그 테두리)"""
    xs, zs = [], []
    for w in words:
        r = w[4]
        for X, Y in ((r.x0, r.y0), (r.x1, r.y1)):
            x, z = sheet.to_local(X, Y)
            xs.append(x); zs.append(z)
    return (min(xs) - pad, min(zs) - pad, max(xs) + pad, max(zs) + pad)


def room_ceilings(rcp, rooms):
    """{방 번호: {code, h, all: [(code, h)]}} — 방 다각형 안의 태그. 높이는 가장 흔한 값."""
    from shapely.geometry import Point
    tags = ceiling_tags(rcp)
    led = ceiling_leaders(rcp, tags)               # 태그 번호 → 지시선 점 [(x, z)]
    code_only = [(t, *rcp.to_local(X, Y)) for t, X, Y, h, r in rcp.words if re.match(r'^AT-\d{2}$', t)
                 and not any(abs(t2[0] - rcp.to_local(X, Y)[0]) < 1.5 and abs(t2[1] - rcp.to_local(X, Y)[1]) < 1.5 for t2 in tags)]
    out = {}
    for r in rooms:
        if not r['number']:
            continue
        # 지시선 달린 태그는 상자가 놓인 방(대개 복도)이 아니라 점이 있는 방의 것
        inside = [(c, h) for i, (x, z, c, h, b) in enumerate(tags) if r['poly'].contains(Point(x, z)) and
                  (i not in led or any(r['poly'].contains(Point(p)) for p in led[i]))]
        src = 'tag'
        if not inside:
            # 배플 등 높이 없는 코드만 적힌 태그 (A-132 201C 'AT-04')
            inside = [(t, None) for t, x, z in code_only if r['poly'].contains(Point(x, z))]
        if not inside:
            inside = [(tags[i][2], tags[i][3]) for i, pts in led.items()
                      if any(r['poly'].contains(Point(p)) for p in pts)]
            src = 'leader'
        if not inside:
            continue
        hs = [h for c, h in inside if h]
        cs = [c for c, h in inside if c]
        out[r['number']] = {'code': Counter(cs).most_common(1)[0][0] if cs else None,
                            'h': Counter(hs).most_common(1)[0][0] if hs else None, 'all': inside, 'src': src}
    return out


LIGHT_STYLES = {(0.48, 'g'), (1.2, 'g')}


def ceiling_lights(rcp, wall_mask=None, origin=None, ft_per_px=0.125, outline=None):
    """천장도의 등기구 → [[x, z, w, d]] (로컬 ft, 축 정렬 사각형의 중심·x폭·z폭).
    선형 등기구 = 회색 평행 이중선 간격 0.2~0.45 ft·길이 ≥ 1.5 ft, 2×2/2×4 = 0.48 pt 회색 사각형(간격 1.8~2.1 ft).
    평면 벽 마스크 위에 놓인 것(벽을 같은 회색으로 그린 경우)은 버린다."""
    from .walls import drawings, _style, _item_segments, pair_quads
    segs = {k: [] for k in LIGHT_STYLES}
    for d in drawings(rcp):
        st = _style(d)
        if d['type'] != 'f' and st in LIGHT_STYLES:
            for it in d['items']:
                segs[st] += _item_segments(rcp, it)
    quads = pair_quads(segs[(0.48, 'g')] + segs[(1.2, 'g')], dmin=0.2, dmax=0.45, min_overlap=1.5)
    quads += [q for q in pair_quads(segs[(0.48, 'g')], dmin=1.8, dmax=2.1, min_overlap=1.8)]
    out = []
    for q in quads:
        q = np.array(q)
        x0, z0 = q.min(0); x1, z1 = q.max(0)
        w, dd = x1 - x0, z1 - z0
        if min(w, dd) < 0.15 or max(w, dd) > 40 or (min(w, dd) > 0.5 and max(w, dd) > 4.5):
            continue
        cx, cz = (x0 + x1) / 2, (z0 + z1) / 2
        if any(abs(cx - o[0]) < 0.3 and abs(cz - o[1]) < 0.3 for o in out):
            continue
        if wall_mask is not None:
            c = int((cx - origin[0]) / ft_per_px); r = int((cz - origin[1]) / ft_per_px)
            if 0 <= r < wall_mask.shape[0] and 0 <= c < wall_mask.shape[1] and wall_mask[r, c]:
                continue
        if outline is not None:
            from shapely.geometry import Point
            if not outline.contains(Point(cx, cz)):
                continue
        out.append([round(cx, 2), round(cz, 2), round(w, 2), round(dd, 2)])
    return out


# ── 지시선(leader) 태그 ──
def leader_dots(sheet, dmin=3.0, dmax=6.5):
    """검은 채움 원(지시선 끝 점, 지름 3~6.5 pt) 중심 → [(x, z)] 로컬 ft"""
    from .walls import drawings
    out = []
    for d in drawings(sheet):
        f = d.get('fill')
        if d['type'] not in ('f', 'fs') or not f or max(f) > 0.1:
            continue
        if not any(it[0] == 'c' for it in d['items']):
            continue
        r = d['rect'] * sheet.M
        if dmin <= r.width <= dmax and dmin <= r.height <= dmax:
            out.append(sheet.to_local((r.x0 + r.x1) / 2, (r.y0 + r.y1) / 2))
    return out


def _black_segments(sheet):
    from .walls import drawings
    if getattr(sheet, '_blk', None) is None:
        seg = []
        for d in drawings(sheet):
            c = d.get('color')
            if d['type'] == 'f' or not c or max(c) > 0.05:
                continue
            for it in d['items']:
                if it[0] == 'l':
                    a, b = sheet.to_local(*(it[1] * sheet.M)), sheet.to_local(*(it[2] * sheet.M))
                    if math.dist(a, b) > 0.05:
                        seg.append((a, b))
        sheet._blk = seg
    return sheet._blk


def leader_ends(sheet, dots=None, tol=0.35, hops=4):
    """점 → 지시선을 따라간 반대쪽 끝 [(점, 끝)] (꺾인 지시선은 hops 번까지 이어 감)"""
    segs = _black_segments(sheet)
    from shapely.strtree import STRtree
    from shapely.geometry import Point, LineString
    lines = [LineString(s) for s in segs]
    tree = STRtree(lines)
    out = []
    for p in (dots if dots is not None else leader_dots(sheet)):
        best = None
        for k in tree.query(Point(p).buffer(tol)):
            a, b = segs[k]
            for u, v in ((a, b), (b, a)):
                if math.dist(u, p) < tol and math.dist(v, p) > 0.8:
                    end, prev = v, u
                    for _ in range(hops):        # 이어진 선분(끝점 0.08 ft 안, 진행 방향이 꺾여도 됨)
                        nxt = None
                        for j in tree.query(Point(end).buffer(0.08)):
                            c, e = segs[j]
                            for s0, s1 in ((c, e), (e, c)):
                                if math.dist(s0, end) < 0.08 and math.dist(s1, prev) > 0.3 and math.dist(s1, end) > 0.3:
                                    nxt = (s0, s1)
                        if nxt is None:
                            break
                        prev, end = end, nxt[1]
                    if best is None or math.dist(end, p) > math.dist(best, p):
                        best = end
        if best is not None:
            out.append((p, best))
    return out


def ceiling_leaders(rcp, tags=None):
    """천장 태그 중 지시선(검은 점 → 선 → 태그 상자)이 달린 것 → {태그 번호: [점 (x, z)]}"""
    tags = tags if tags is not None else ceiling_tags(rcp)
    out = {}
    for p, e in leader_ends(rcp):
        best, bd = None, 0.6
        for i, t in enumerate(tags):
            x0, z0, x1, z1 = t[4]
            d = math.hypot(max(x0 - e[0], 0, e[0] - x1), max(z0 - e[1], 0, e[1] - z1))
            if d < bd:
                best, bd = i, d
        if best is not None:
            # 점이 상자 안이면 지시선이 아님 (상자 안 장식)
            x0, z0, x1, z1 = tags[best][4]
            if not (x0 <= p[0] <= x1 and z0 <= p[1] <= z1):
                out.setdefault(best, []).append(p)
    return out


# ── 태그 없는 방의 마감 채우기 ──
# 마감 평면의 바닥 해치(선 색·모듈)로 재료 종류를 알아낸다 (태그 있는 방에서 확인한 대응):
#   0.65 회색 1 ft 격자            → 자기질 타일 (화장실·NMR; 일람표의 바닥 타일은 CT-01 12x24 하나뿐)
#   0.33 회색 1×4 ft 엇갈림         → 카펫 타일 12x48 (CPT-01/02/03 모두 같은 해치 → 코드는 가장 가까운 태그 방의 CPT)
#   0.33 회색 2×2 ft 격자           → 고무 바닥 (RF-01/02, 같은 방법)
#   'CJ'(조절 줄눈)·B4/A-651(테라조 줄눈 상세) 표기 → 테라조 TZ-01
HATCH_TILE, HATCH_GRAY = (0.65, 0.65, 0.65), (0.33, 0.33, 0.33)
WALL_CODE = re.compile(r'^(PT|WC|WP|HPC|AT|AF|VDS)-\d{2}$')
BASE_FOR = {'TZ': 'TZB-01', 'CT': 'CTB-01', 'CPT': 'RB-01', 'RF': 'RB-01', 'EP': 'EPB-01', 'SDT': 'RB-01', 'LVT': 'RB-01',
            'WO': 'RB-01', 'ETR': 'ETR'}
WET_RE = re.compile(r'RESTROOM|\bRR\b|TOILET')


def floor_hatch(fin_sheet, rooms):
    """{방 번호: 'tile' | 'carpet' | 'rubber' | 'terrazzo' | None} — 방 안(0.3 ft 안쪽) 해치 선으로"""
    from shapely.geometry import Point
    from shapely import prepared
    from collections import defaultdict
    from .walls import drawings
    R = [(r['number'], prepared.prep(r['poly'].buffer(-0.3)), r['poly']) for r in rooms if r['number']]
    names = {r['number']: r['name'] or '' for r in rooms}
    segs = defaultdict(list)
    for d in drawings(fin_sheet):
        if d['type'] == 'f' or (d.get('width') or 0) > 0.3:
            continue
        col = tuple(round(c, 2) for c in (d.get('color') or (0, 0, 0)))
        if col not in (HATCH_TILE, HATCH_GRAY):
            continue
        for it in d['items']:
            if it[0] != 'l':
                continue
            a, b = fin_sheet.to_local(*(it[1] * fin_sheet.M)), fin_sheet.to_local(*(it[2] * fin_sheet.M))
            L = math.dist(a, b)
            if L < 0.3:
                continue
            m = Point((a[0] + b[0]) / 2, (a[1] + b[1]) / 2)
            for no, g, _ in R:
                if g.contains(m):
                    segs[no].append((col, round(L, 1)))
                    break
    cj = [Point(*fin_sheet.to_local(X, Y)) for t, X, Y, h, r in fin_sheet.words if t in ('CJ', 'B4')]
    out = {}
    for no, g, poly in R:
        S = segs.get(no, [])
        tile = sum(1 for c, L in S if c == HATCH_TILE)
        gray = Counter(L for c, L in S if c == HATCH_GRAY)
        ng = sum(gray.values())
        kind = None
        has_cj = any(poly.buffer(0.5).contains(p) for p in cj)
        if has_cj and 'CORRIDOR' in names[no]:
            kind = 'terrazzo'               # 복도: 줄눈 표기가 우선 (다각형 끝에 걸친 이웃 카펫 해치보다)
        elif tile >= 15:
            kind = 'tile'
        elif ng >= 15 and gray[2.0] >= 0.5 * ng:
            kind = 'rubber'
        elif ng >= 15 and gray[2.0] < 0.3 * ng and gray[1.0] + gray[4.0] >= 0.25 * ng:
            kind = 'carpet'                 # 1×4 엇갈림 (짧은 방은 1.2·1.5 ft 조각이 섞임)
        elif has_cj:
            kind = 'terrazzo'
        out[no] = kind
    return out


def wall_callouts(fin_sheet, rooms):
    """마감 평면에서 방 태그(W/B/F 줄)가 아닌 벽 마감 표기(PT-02 강조벽 등) → {방 번호: [코드]}"""
    from shapely.geometry import Point
    W = fin_sheet.words
    out = {}
    for t, X, Y, h, r in W:
        if not WALL_CODE.match(t):
            continue
        if any(w[0] in ('W', 'B', 'F') and abs(w[2] - Y) < 3 and 0 < X - w[1] < 40 for w in W):
            continue                                    # 방 태그 줄
        p = Point(*fin_sheet.to_local(X, Y))
        for rr in rooms:
            if rr['number'] and rr['poly'].buffer(0.6).contains(p):
                lst = out.setdefault(rr['number'], [])
                if t not in lst:
                    lst.append(t)
    return out


def default_finish(name, floor_name, kind):
    """일람표·일반주기에 근거한 방 종류별 기본 마감 (도면 근거가 없을 때만; src 에 'default').
    화장실: 바닥 CT-01 (일람표 유일한 바닥 타일), 걸레받이 CTB-01 (CT-01 과 같은 'BEDROCK'),
            벽 CT-02 (벽 타일 'REFER TO ELEVATIONS' — 화장실 입면은 세트에 없음) + PT-01
    복도·전실·경사로: 테라조 TZ-01 / TZB-01 (로비·계단과 같은 계열), 그 밖의 벽: PT-01 (태그 있는 방 대부분의 바탕 도장)
    기존 지하층(A-100, 마감 평면 없음): ETR (existing to remain)"""
    n = name or ''
    if floor_name == 'LOWER':
        return {'floor': 'ETR', 'base': 'ETR', 'wall': ['ETR']}
    if 'ENCLOSURE' in n:                 # 124C: CM 랩 동쪽 바깥 울타리 마당 (A-101) — 바닥은 옥외 기존 콘크리트
        return {'floor': 'ETR', 'base': None, 'wall': ['ETR']}
    if WET_RE.search(n) or kind == 'tile':
        return {'floor': 'CT-01', 'base': 'CTB-01', 'wall': ['CT-02', 'PT-01'] if WET_RE.search(n) else ['PT-01']}
    if re.search(r'CORRIDOR|VESTIBULE|RAMP|STAIR|OVERLOOK', n):
        return {'floor': 'TZ-01', 'base': 'TZB-01', 'wall': ['PT-01']}
    return {'floor': None, 'base': None, 'wall': ['PT-01']}


def fill_finishes(rooms, F, floor_name, hatch=None, callouts=None):
    """F(마감 태그) 를 보완 → {방 번호: {floor, base, wall, src}}.
    src 조각: 'tag' (방 태그), 'hatch' (바닥 해치 + 가장 가까운 태그 방의 같은 계열 코드), 'callout' (강조벽 표기·테라조 줄눈 표기),
    'default' (방 종류 기본값 — 일람표/일반주기). 섞이면 'hatch+default' 처럼 잇는다."""
    hatch, callouts = hatch or {}, callouts or {}
    tagged = [(r, F[r['number']]) for r in rooms if r['number'] in F]

    def nearest_code(r, prefix):
        best, bd = None, 1e9
        for rr, f in tagged:
            c = f.get('floor') or ''
            if c.startswith(prefix):
                d = rr['poly'].distance(r['poly'])
                if d < bd:
                    best, bd = c, d
        return best

    out = {}
    for r in rooms:
        no = r['number']
        if not no:
            continue
        f = {'floor': None, 'base': None, 'wall': [], **F.get(no, {})}
        f['wall'] = list(f.get('wall') or [])
        src = ['tag'] if (f['floor'] or f['wall']) else []
        kind = hatch.get(no)
        d = default_finish(r['name'], floor_name, kind)
        if not f['floor']:
            code = {'tile': 'CT-01', 'terrazzo': 'TZ-01', 'carpet': nearest_code(r, 'CPT'), 'rubber': nearest_code(r, 'RF')}.get(kind)
            if code:
                f['floor'] = code
                src.append('callout' if kind == 'terrazzo' else 'hatch')
            elif d['floor']:
                f['floor'] = d['floor']
                src.append('default')
        if not f['base']:
            pre = re.match(r'^([A-Z]+)', f['floor'] or '')
            f['base'] = BASE_FOR.get(pre.group(1)) if pre else None   # 바닥에 딸린 걸레받이 (태그 방의 짝: TZ→TZB, CPT/RF→RB, EP→EPB, CT→CTB)
        if not f['wall']:
            f['wall'] = list(d['wall']) + [c for c in callouts.get(no, []) if c not in d['wall']]
            src += (['callout'] if callouts.get(no) else []) + ['default']
        f['src'] = '+'.join(dict.fromkeys(src))
        out[no] = f
    return out
