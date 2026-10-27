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
    'WDB': ('wood base', (176, 138, 90)), 'ACT': ('acoustic ceiling tile', (242, 242, 238)), 'MTL': ('metal ceiling', (200, 202, 204)),
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
            code = min(above, key=lambda w: abs(w[1] - (X - 12)))[0] if above else None
            x, z = rcp.to_local(X - 12, Y - 5)
            if code != 'XXX-01':
                out.append((x, z, code, hgt))
        elif t == 'EXPOSED':
            above = [w for w in W if 6 < Y - w[2] < 14 and abs(w[1] - X) < 25 and CODE_RE.match(w[0])]
            below = [w for w in W if 0 < w[2] - Y < 14 and abs(w[1] - X) < 30 and w[0] == 'A.F.F.']
            if below:
                continue                      # 'EXPOSED / 14'-0" A.F.F.' 는 위에서 처리
            x, z = rcp.to_local(X, Y)
            out.append((x, z, 'EXPOSED' + ('/' + above[0][0] if above else ''), None))
    return out


def room_ceilings(rcp, rooms):
    """{방 번호: {code, h, all: [(code, h)]}} — 방 다각형 안의 태그. 높이는 가장 흔한 값."""
    from shapely.geometry import Point
    tags = ceiling_tags(rcp)
    out = {}
    for r in rooms:
        if not r['number']:
            continue
        inside = [(c, h) for x, z, c, h in tags if r['poly'].contains(Point(x, z))]
        if not inside:
            continue
        hs = [h for c, h in inside if h]
        cs = [c for c, h in inside if c]
        out[r['number']] = {'code': Counter(cs).most_common(1)[0][0] if cs else None,
                            'h': Counter(hs).most_common(1)[0][0] if hs else None, 'all': inside}
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
