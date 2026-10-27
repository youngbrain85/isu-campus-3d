"""장비(A-701/702 + A-704 일람표)와 도면에 그려진 가구(FF&E) 추출.

A-701/702 는 색칠된 평면이다: 장비 = 연두색 채움, 가구 = 하늘색 채움 (둘 다 주사선 사각형 조각으로 그려져 있어
벡터 대신 렌더한 래스터에서 색으로 뽑는다). 장비 태그 'E087' 은 네모 칸 + 검은 지시선 + 화살촉으로 장비를 가리킨다:
태그 칸에 붙은 검은 연결 성분을 따라가 가장 먼 픽셀 = 화살 끝 → 그 점이 든(또는 가장 가까운) 연두색 덩어리 = 장비 외곽.
A-704 일람표에는 크기가 없다 → 평면 외곽이 발자국, 높이는 종류별 기본값.
좌표 = 로컬 ft (sheet.py 참조). 도면 폴더는 읽기만 한다.
"""
import math
import re

import fitz
import numpy as np
from scipy import ndimage
from shapely.geometry import MultiPoint, Point, Polygon

from .sheet import Sheet, sheet_path

FPP = 0.05                                  # ft / px
EXTENT = (-15.0, -82.0, 280.0, 140.0)       # x0, z0, x1, z1 (2층 브리지까지)
TAG_RE = re.compile(r'^E0{0,2}\d{2,3}[a-c]?X?$')
GREENS = [(213, 228, 194), (227, 237, 214)]
BLUE = (147, 197, 232)
COUNTER_H = 2.93                            # A-501: 캐비닛 2'-10" + 상판
CLASSES = ['CIVIL ENGINEERING', 'MECHANICAL ENGINEERING', 'AUTOMOTIVE', 'AVIATION', 'ROBOTICS',
           'CONSTRUCTION MANAGEMENT', 'ENVIRONMENTAL SYSTEMS', 'HUMAN FACTORS', 'INTERIOR ARCH DESIGN',
           'SAFETY MANAGEMENT', 'CATERING KITCHEN']

# 설명 키워드 → (종류, 높이 ft). 위에서부터 처음 맞는 것.
EQUIP_TYPES = [
    (r'VEHICLE-TRUCK', 'truck', 7.5), (r'VEHICLE', 'car', 4.8), (r'DRAGSTER', 'dragster', 3.5),
    (r'TWO POST LIFT', 'lift2', 12.0), (r'4 POST LIFT', 'lift4', 6.5), (r'DYNO', 'dyno', 4.0),
    (r'STORAGE AND RETRIEVAL', 'asrs', 7.0), (r'CONVEYOR', 'conveyor', 3.0),
    (r'ROBOT|FMS|ASSEMBLY AND QC', 'robot_cell', 5.5), (r'3D PRINTER', 'printer3d', 2.5),
    (r'HOOD', 'hood', 7.5), (r'BOOTH', 'booth', 7.5), (r'PLOTTER', 'plotter', 3.6),
    (r'LASER CUTTER', 'laser_cutter', 3.5), (r'TV MONITOR', 'tv_stand', 5.5), (r'COOLING TOWER', 'tower', 6.0),
    (r'MINI FRIDGE', 'fridge', 2.8), (r'REFRIGERATOR', 'fridge', 6.0), (r'MICROWAVE', 'microwave', 1.0),
    (r'LIGHT TABLE|iPLAN TABLE|LIGHT BOX', 'light_table', 3.0), (r'TOOL BOX', 'tool_cabinet', 3.5),
    (r'WIND TUNNEL|HYDRAULICS BENCH|FLUID|HYDRO|AIR CONDITIONING|HEAT PUMP|GEOTHERMAL|SOLAR|CHILLER|REYNOLDS|ENGINEERING SCIENCE',
     'trainer', 4.5),
    (r'SAW|DRILL|GRINDER|NAILER|DRIVER|SANDER|WRENCH|HAMMER|SAWZALL|HOLE HAWG|JIGSAW', 'tool', 0.8),
    (r'.', 'machine', 4.0),
]


# ---------------------------------------------------------------- 일람표
def equipment_schedule(path=None):
    """A-704 → {tag: {desc, cls, count, mount}}"""
    s = Sheet(path or sheet_path('A-704'))
    rows = {}
    for t, X, Y, h, r in s.words:
        if TAG_RE.match(t) and X < 1200:
            line = sorted([w for w in s.words if abs(w[2] - Y) < 3.0 and w[1] > X and w[1] < 2900], key=lambda w: w[1])
            txt = ' '.join(w[0] for w in line)
            m = re.match(r'^(.*?)\s+(' + '|'.join(CLASSES) + r')?\s*(\d+)\s', txt)
            desc, cls, cnt = (m.group(1), m.group(2) or '', int(m.group(3))) if m else (txt[:40], '', 1)
            mount = next((k for k in ('FLOOR', 'COUNTER', 'TABLE', 'CABINET', 'CART', 'CHAIR') if k in txt), '')
            rows.setdefault(t, {'desc': desc.replace('�', '').strip(), 'cls': cls, 'count': cnt, 'mount': mount})
    return rows


def equip_type(desc):
    for pat, typ, h in EQUIP_TYPES:
        if re.search(pat, desc):
            return typ, h
    return 'machine', 4.0


# ---------------------------------------------------------------- 래스터
class Raster:
    """안티앨리어싱 끈 렌더(색이 정확히 나오도록) + 로컬 ↔ 픽셀 변환"""

    def __init__(self, sheet_name, extent=EXTENT, fpp=FPP):
        self.s = Sheet(sheet_path(sheet_name)).fit_grid()
        self.fpp, self.x0, self.z0 = fpp, extent[0], extent[1]
        aa = fitz.TOOLS.show_aa_level()
        fitz.TOOLS.set_aa_level(0)
        try:
            self.img = self.s.render(fpp, *extent)
        finally:
            fitz.TOOLS.set_aa_level(aa['graphics'])
        # 선(지시선·화살)용: 안티앨리어싱 켠 렌더 (끈 렌더에서는 0.24 pt 선이 군데군데 사라진다)
        self.s._full_key = None
        self.lines = self.s.render(fpp, *extent).max(axis=2)
        self.s._full = None

    def px(self, x, z):
        return (x - self.x0) / self.fpp, (z - self.z0) / self.fpp     # (col, row)

    def loc(self, col, row):
        return self.x0 + (col + 0.5) * self.fpp, self.z0 + (row + 0.5) * self.fpp

    def color(self, rgb, tol=6):
        return (np.abs(self.img.astype(int) - np.array(rgb)).max(axis=2) <= tol)


def rect_of(rows, cols, R):
    """픽셀 좌표 집합 → 최소 회전 사각형 {x,z,w,d,rot,poly} (w = 긴 변, rot = Three.js y 회전)"""
    # 픽셀 네 모서리의 볼록 껍질 → 최소 회전 사각형 (shapely MultiPoint.buffer 는 너무 느림)
    xs = R.x0 + cols * R.fpp
    zs = R.z0 + rows * R.fpp
    P = np.concatenate([np.c_[xs + dx, zs + dz] for dx in (0, R.fpp) for dz in (0, R.fpp)])
    P = np.unique(P.round(4), axis=0)
    try:
        from scipy.spatial import ConvexHull
        P = P[ConvexHull(P).vertices]
    except Exception:
        pass
    mr = MultiPoint([tuple(q) for q in P]).convex_hull.minimum_rotated_rectangle
    if mr.geom_type != 'Polygon':
        mr = mr.buffer(R.fpp / 2, join_style=2).minimum_rotated_rectangle
    c = list(mr.exterior.coords)[:4]
    e1 = np.subtract(c[1], c[0]); e2 = np.subtract(c[2], c[1])
    l1, l2 = np.hypot(*e1), np.hypot(*e2)
    long_e = e1 if l1 >= l2 else e2
    a = math.atan2(long_e[1], long_e[0])
    if a > math.pi / 2:
        a -= math.pi
    if a <= -math.pi / 2:
        a += math.pi
    cx, cz = mr.centroid.x, mr.centroid.y
    return {'x': cx, 'z': cz, 'w': max(l1, l2), 'd': min(l1, l2), 'rot': -a, 'poly': mr}


def components(mask, min_px=8):
    """연결 성분(구멍 채움) → [(rows, cols, filled_count, own_count, label_slice_info)]"""
    lab, n = ndimage.label(mask, structure=np.ones((3, 3)))
    out = []
    for i, sl in enumerate(ndimage.find_objects(lab), 1):
        if sl is None:
            continue
        sub = lab[sl] == i
        if sub.sum() < min_px:
            continue
        filled = ndimage.binary_fill_holes(sub)
        r, c = np.nonzero(filled)
        out.append({'rows': r + sl[0].start, 'cols': c + sl[1].start, 'area_px': int(filled.sum()),
                    'own_px': int(sub.sum()), 'sub': sub, 'filled': filled, 'off': (sl[0].start, sl[1].start)})
    return out


# ---------------------------------------------------------------- 장비
def _leader_tip(R, dark_d, rect_pt):
    """태그 칸 네 변 가운데에서 바깥으로 광선을 쏴(법선 ±70°) 검은 픽셀이 끊기지 않는 가장 긴 줄 = 지시선.
    그 끝 = 화살 끝 → (x, z) 또는 None. (지시선이 검은 캐비닛 외곽선에 닿아도 직선만 따라가므로 새지 않는다)"""
    s = R.s
    (ax, az), (bx, bz) = s.to_local(rect_pt.x0, rect_pt.y0), s.to_local(rect_pt.x1, rect_pt.y1)
    tx0, tx1, tz0, tz1 = min(ax, bx), max(ax, bx), min(az, bz), max(az, bz)
    cx, cz = (tx0 + tx1) / 2, (tz0 + tz1) / 2
    starts = []                                 # 칸 테두리는 글자에서 0~0.45 ft 떨어져 있다 → 여러 간격에서 시작
    for pad in (0.12, 0.25, 0.38, 0.5, 0.65):
        for o in np.arange(-0.3, 0.31, 0.05):   # 지시선은 변 가운데에서 조금 비켜 붙는다
            starts += [((tx0 - pad, cz + o), math.pi), ((tx1 + pad, cz + o), 0.0)]
        for o in np.arange(-0.6, 0.61, 0.1):
            starts += [((cx + o, tz0 - pad), -math.pi / 2), ((cx + o, tz1 + pad), math.pi / 2)]
    H, W = dark_d.shape
    best, blen = None, 0.0
    step = R.fpp * 0.5
    for (sx, sz), base in starts:
        for da in np.radians(np.arange(-70, 71, 2)):
            a = base + da
            ux, uz = math.cos(a), math.sin(a)
            n = 0
            while True:
                x, z = sx + ux * n * step, sz + uz * n * step
                c, r = R.px(x, z)
                c, r = int(c), int(r)
                if not (0 <= r < H and 0 <= c < W) or not dark_d[r, c] or n * step > 30:
                    break
                n += 1
            L = n * step
            if L > blen:
                best, blen = (sx + ux * L, sz + uz * L), L
    if blen < 0.6:
        return None
    return best


def extract(sheet_name, rooms, schedule):
    """→ (equipment, furniture, debug)  rooms = [{no,name,poly(shapely)}]"""
    R = Raster(sheet_name)
    img = R.img
    dark_d = ndimage.binary_dilation(R.lines < 150, np.ones((3, 3)))     # 1 px 사선 끊김 허용
    green = np.zeros(dark_d.shape, bool)
    for g in GREENS:
        green |= R.color(g)
    # 연두 덩어리 (글자·외곽선 구멍 채움). 아주 가는 틈은 이어 붙인다.
    green = ndimage.binary_closing(green, np.ones((3, 3)), iterations=1)
    gcomps = [c for c in components(green, 40)]
    for c in gcomps:
        c.update(rect_of(c['rows'], c['cols'], R))
        c['area'] = c['area_px'] * R.fpp ** 2
    room_of = _room_finder(rooms)
    equipment, debug = [], []
    used = {}
    tags = [(t, X, Y, r) for t, X, Y, h, r in R.s.words if TAG_RE.match(t) and abs(h - 9.6) < 0.5]
    for t, X, Y, r in tags:
        x, z = R.s.to_local(X, Y)
        if not (EXTENT[0] < x < EXTENT[2] and EXTENT[1] < z < EXTENT[3]):
            continue
        tip = _leader_tip(R, dark_d, r)
        ref = tip or (x, z)
        best, bd = None, 1e9
        for i, c in enumerate(gcomps):
            d = c['poly'].distance(Point(ref))
            if d < bd:
                best, bd = i, d
        lim = 1.5 if tip else 6.0
        sc = schedule.get(t) or schedule.get(t.rstrip('X')) or {}
        desc = sc.get('desc', '')
        typ, h = equip_type(desc)
        it = {'tag': t, 'label': desc.title() if desc else t, 'type': typ, 'src': sheet_name}
        if best is not None and bd <= lim:
            used.setdefault(best, []).append(it)
        else:
            # 외곽선 없는 장비(캐비닛 안 공구·카운터 위 소형): 화살 끝에 기본 크기로
            w, d = (1.4, 1.0) if typ == 'tool' else (2.0, 1.6)
            it.update({'x': ref[0], 'z': ref[1], 'w': w, 'd': d, 'rot': 0.0, 'outline': False})
            equipment.append(_finish_equipment(it, h, sc))
        debug.append((t, (x, z), tip, best if bd <= lim else None))
    # 같은 덩어리를 여러 태그가 가리키면 긴 축을 따라 n 등분
    for gi, items in used.items():
        c = gcomps[gi]
        n = len(items)
        ux, uz = math.cos(-c['rot']), math.sin(-c['rot'])
        for k, it in enumerate(sorted(items, key=lambda q: q['tag'])):
            off = (k + 0.5) / n * c['w'] - c['w'] / 2
            it.update({'x': c['x'] + ux * off, 'z': c['z'] + uz * off, 'w': c['w'] / n, 'd': c['d'], 'rot': c['rot'], 'outline': True})
            sc = schedule.get(it['tag']) or {}
            equipment.append(_finish_equipment(it, equip_type(sc.get('desc', ''))[1], sc))
    # 태그 없는 연두 덩어리(일람표 'NOTag' 등): 1 ft² 넘는 것만
    for gi, c in enumerate(gcomps):
        if gi in used or c['area'] < 1.0:
            continue
        equipment.append(_finish_equipment({'tag': None, 'label': 'Equipment (untagged)', 'type': 'machine', 'src': sheet_name,
                                            'x': c['x'], 'z': c['z'], 'w': c['w'], 'd': c['d'], 'rot': c['rot'], 'outline': True},
                                           3.5, {}))
    for e in equipment:
        e['room'] = room_of(e['x'], e['z'])
    furniture = drawn_furniture(R, room_of, rooms)
    for f in furniture:
        f['src'] = sheet_name
    return equipment, furniture, {'tags': len(tags), 'debug': debug, 'green': gcomps, 'R': R}


def _finish_equipment(it, h, sc):
    mount = sc.get('mount', '')
    area = it['w'] * it['d']
    y0 = 0.0
    if it['type'] in ('tool', 'microwave') or (mount in ('COUNTER', 'TABLE', 'CABINET') and area < 12 and it['type'] not in ('fridge', 'light_table')):
        y0 = COUNTER_H                       # 카운터/작업대 위
        if it['type'] not in ('tool', 'microwave', 'printer3d'):
            it['type'] = 'bench_unit'
            h = min(2.0, 0.8 + 0.25 * max(it['w'], it['d']))
    elif it['type'] == 'machine' and area < 4:
        h = 3.5
    it['h'] = round(h, 2)
    if y0:
        it['y0'] = y0
    return it


def _room_finder(rooms):
    def f(x, z):
        p = Point(x, z)
        for r in rooms:
            if r['poly'].contains(p):
                return r['no'] or None
        return None
    return f


# ---------------------------------------------------------------- 가구 (도면에 그려진 것)
LOUNGE_RE = re.compile(r'BREAKOUT|LOBBY|OVERLOOK|LIBRARY|LOUNGE')


def drawn_furniture(R, room_of, rooms):
    blue = R.color(BLUE)
    names = {r['no']: r['name'] for r in rooms}
    comps = components(blue, 6)
    out = []
    small = np.zeros(blue.shape, bool)
    for c in comps:
        a = c['area_px'] * R.fpp ** 2
        rc = rect_of(c['rows'], c['cols'], R)
        if a >= 3.0 and rc['w'] >= 2.6:
            room = room_of(rc['x'], rc['z'])
            if room is None:
                continue
            rect_ratio = a / max(rc['w'] * rc['d'], 1e-6)
            lounge = bool(LOUNGE_RE.search(names.get(room, '')))
            if rect_ratio >= 0.8:
                typ, h = 'table', 2.5
            elif rect_ratio >= 0.68 and rc['w'] / rc['d'] < 1.2:
                typ, h = 'table_round', 2.5
            elif lounge:
                typ, h = 'sofa', 2.6
            else:
                typ, h = 'table', 2.5
            # 책상 위 모니터 = 파란 덩어리 안의 흰 구멍 (모니터 기호)
            holes = c['filled'] & ~c['sub']
            hl, hn = ndimage.label(holes)
            mons = []
            for j, hs in enumerate(ndimage.find_objects(hl), 1):
                hh = hl[hs] == j
                ha = hh.sum() * R.fpp ** 2
                if 0.25 <= ha <= 2.5:
                    r_, c_ = np.nonzero(hh)
                    hr = rect_of(r_ + hs[0].start + c['off'][0], c_ + hs[1].start + c['off'][1], R)
                    if hr['w'] <= 2.6 and hr['d'] >= 0.3:
                        mons.append(hr)
            if mons and typ == 'table':
                typ = 'desk'
            out.append(_furn(typ, rc, h, room))
            for m in mons:
                out.append({**_furn('monitor', m, 1.4, room), 'd': 0.25, 'w': round(min(max(m['w'], 1.6), 2.2), 2), 'y0': 2.5})
        else:
            r0, c0 = c['off']
            sh = c['filled'].shape
            small[r0:r0 + sh[0], c0:c0 + sh[1]] |= c['filled']
    # 의자: 작은 조각(좌판·등받이·팔걸이)을 0.2 ft 팽창으로 묶는다
    grp = ndimage.binary_dilation(small, np.ones((3, 3)), iterations=3)
    lab, n = ndimage.label(grp)
    tables = [f for f in out if f['type'] in ('table', 'desk', 'table_round')]
    for i, sl in enumerate(ndimage.find_objects(lab), 1):
        sub = (lab[sl] == i) & small[sl]
        a = sub.sum() * R.fpp ** 2
        if a < 0.6:
            continue
        r_, c_ = np.nonzero(sub)
        rc = rect_of(r_ + sl[0].start, c_ + sl[1].start, R)
        k = 1 if rc['w'] <= 3.4 else max(1, round(rc['w'] / 2.3))
        ux, uz = math.cos(-rc['rot']), math.sin(-rc['rot'])
        for j in range(k):
            off = (j + 0.5) / k * rc['w'] - rc['w'] / 2
            cx, cz, w = rc['x'] + ux * off, rc['z'] + uz * off, rc['w'] / k
            room = room_of(cx, cz)
            if room is None:
                continue
            mx = max(w, rc['d'])
            lounge = bool(LOUNGE_RE.search(names.get(room, '')))
            typ, h = ('lounge_chair', 2.6) if lounge and mx >= 2.3 else ('stool', 2.1) if mx <= 1.9 else ('chair', 2.8)
            out.append(_chair(typ, cx, cz, min(w, 2.6), min(rc['d'], 2.6), h, room, tables))
    return out


def _furn(typ, rc, h, room):
    return {'type': typ, 'x': rc['x'], 'z': rc['z'], 'w': rc['w'], 'd': rc['d'], 'rot': rc['rot'], 'h': h, 'room': room}


def _chair(typ, x, z, w, d, h, room, tables):
    """의자 앞(-z 로컬)이 가장 가까운 탁자를 보도록 회전"""
    best, bd = None, 4.0
    p = Point(x, z)
    for t in tables:
        if t['room'] != room:
            continue
        dd = abs(t['x'] - x) + abs(t['z'] - z)
        if dd < 14:
            dist = _rect_poly(t).distance(p)
            if dist < bd:
                best, bd = t, dist
    rot = 0.0
    if best is not None:
        q = _rect_poly(best).exterior.interpolate(_rect_poly(best).exterior.project(p))
        vx, vz = q.x - x, q.y - z
        n = math.hypot(vx, vz) or 1
        rot = math.atan2(-vx / n, -vz / n)
    s = max(w, d)
    return {'type': typ, 'x': x, 'z': z, 'w': s if typ != 'lounge_chair' else max(s, 2.4), 'd': s if typ != 'lounge_chair' else max(s, 2.4),
            'rot': rot, 'h': h, 'room': room}


def _rect_poly(it):
    """{x,z,w,d,rot} → shapely 다각형 (rot: Three.js y 회전; 로컬 +x → (cos, -sin))"""
    c, s = math.cos(it['rot']), math.sin(it['rot'])
    ux, uz = c, -s           # 로컬 x 방향
    vx, vz = s, c            # 로컬 z 방향 ((0,0,1) → (sin, cos))
    hw, hd = it['w'] / 2, it['d'] / 2
    return Polygon([(it['x'] + sx * hw * ux + sz * hd * vx, it['z'] + sx * hw * uz + sz * hd * vz)
                    for sx, sz in ((-1, -1), (1, -1), (1, 1), (-1, 1))])


rect_poly = _rect_poly
