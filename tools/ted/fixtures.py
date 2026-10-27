"""위생기구(변기·소변기·세면기·개수대)와 음수대 — 평면(A-100/101/102)의 선 그림에서 닫힌 흰 영역의 모양으로 찾는다.

곡선이 짧은 직선 조각으로 쪼개져 있어 벡터로는 알아보기 어렵다 → 방 범위를 0.03 ft/px 로 렌더해 선으로 둘러싸인 흰 영역의
넓이·장축·단축·볼록도(solidity)로 분류한다 (A-101 남녀 화장실에서 잰 값):
  변기 안쪽 타원 ≈ 1.17 × 0.79 ft (0.72 ft²), 세면기 볼 ≈ 1.53 × 1.10 ft (1.27 ft²), 소변기 ≈ 1.75 × 0.47 ft.
방향: 변기는 장축 방향 중 벽에 가까운 쪽이 물탱크(뒤), 나머지는 가장 가까운 벽이 뒤.
"""
import math
import re

import fitz
import numpy as np
from scipy import ndimage
from shapely.geometry import Point
from shapely.ops import nearest_points, unary_union
from skimage.measure import regionprops

from .sheet import Sheet, sheet_path

FPP = 0.03
WET = re.compile(r'RESTROOM|\bRR\b|TOILET|KITCHEN|JANITOR|MOP|LOCKER')
DF_ROOMS = re.compile(r'CORRIDOR|LOBBY|VESTIBULE|BREAKOUT')


def render_clip(sheet, x0, z0, x1, z1, fpp=FPP):
    """로컬 사각형만 렌더 (전체 페이지를 0.03 ft/px 로 렌더하면 수백 MB)"""
    zoom = abs(sheet.ax / fpp)
    X0, Y0 = sheet.to_sheet(x0, z0)
    X1, Y1 = sheet.to_sheet(x1, z1)
    r = fitz.Rect(min(X0, X1), min(Y0, Y1), max(X0, X1), max(Y0, Y1))     # clip 은 화면(회전 적용) 좌표
    pix = sheet.page.get_pixmap(matrix=fitz.Matrix(zoom, zoom), clip=r, alpha=False)
    a = np.frombuffer(pix.samples, np.uint8).reshape(pix.height, pix.width, pix.n)[..., :3]
    return a


def _classify(A, maj, mn, sol):
    if 0.55 <= A <= 0.95 and 1.0 <= maj <= 1.4 and 0.65 <= mn <= 0.95 and sol >= 0.93:
        return 'toilet'
    if 0.36 <= A <= 0.5 and 0.75 <= maj <= 0.92 and 0.6 <= mn <= 0.74 and sol >= 0.95:
        return 'toilet'                     # 1 인 화장실(A-102 209/210)의 작은 변기 안쪽 기호
    if 1.0 <= A <= 1.75 and 1.3 <= maj <= 1.85 and 0.95 <= mn <= 1.35 and sol >= 0.88:
        return 'lavatory'
    if 0.42 <= A <= 0.7 and 1.5 <= maj <= 1.95 and 0.38 <= mn <= 0.56 and 0.68 <= sol <= 0.92:
        return 'urinal'
    return None


def find_fixtures(plan, rooms, walls):
    """plan = 'A-101' 등, rooms = [{no,name,poly}], walls = shapely 다각형 목록 → [{type,x,z,w,d,rot,h,room,src}]"""
    s = Sheet(sheet_path(plan)).fit_grid()
    W = unary_union(walls) if walls else None
    words = [s.to_local(X, Y) for t, X, Y, h, r in s.words]
    out = []
    for r in rooms:
        name = r['name'] or ''
        wet, df = bool(WET.search(name)), bool(DF_ROOMS.search(name))
        if not (wet or df):
            continue
        x0, z0, x1, z1 = r['poly'].buffer(0.5).bounds
        img = render_clip(s, x0, z0, x1, z1)
        sx, sz = (x1 - x0) / img.shape[1], (z1 - z0) / img.shape[0]
        small_circles = []
        regs = []
        # 1 층 기구는 검은 선, 2 층은 회색 선 → 두 문턱(170: 회색까지 선, 235: 순백만 빈 곳)으로 모두 보고 겹치면 하나만
        for thr in (170, 235):
            lab, n = ndimage.label(img.min(axis=2) > thr)
            for p in regionprops(lab):
                A = p.area * sx * sz
                if not (0.15 < A < 5):
                    continue
                cy, cx = p.centroid
                x, z = x0 + (cx + 0.5) * sx, z0 + (cy + 0.5) * sz
                if not r['poly'].buffer(0.6).contains(Point(x, z)):
                    continue
                b0, b1, b2, b3 = p.bbox
                bx0, bz0, bx1, bz1 = x0 + b1 * sx, z0 + b0 * sz, x0 + b3 * sx, z0 + b2 * sz
                if any(bx0 <= wx <= bx1 and bz0 <= wz <= bz1 for wx, wz in words):
                    continue                   # 글자 든 칸 (방 번호 상자 등)
                maj, mn = p.major_axis_length * sx, p.minor_axis_length * sx
                regs.append((x, z, A, maj, mn, p.solidity, p.orientation, p))
                if 0.18 <= A <= 0.32 and 0.5 <= mn <= maj <= 0.7 and p.solidity > 0.93:
                    small_circles.append((x, z))
        found = []
        for x, z, A, maj, mn, sol, ori, p in regs:
            typ = _classify(A, maj, mn, sol) if wet else None
            if df and 3.0 <= A <= 4.6 and 3.7 <= maj <= 4.7 and 1.15 <= mn <= 1.65:
                if sum(1 for q in small_circles if math.dist(q, (x, z)) < 2.4) >= 2:
                    typ = 'drinking_fountain'
            if typ is None or any(math.dist((x, z), f) < 0.8 for f in found):
                continue
            found.append((x, z))
            # 뒤(벽) 방향
            if typ == 'toilet':
                ax_ = (math.sin(ori), math.cos(ori))            # (dx, dz) 장축
                c1, c2 = Point(x + ax_[0], z + ax_[1]), Point(x - ax_[0], z - ax_[1])
                back = ax_ if (W is None or W.distance(c1) <= W.distance(c2)) else (-ax_[0], -ax_[1])
            else:
                if W is None:
                    back = (0.0, 1.0)
                else:
                    q = nearest_points(Point(x, z), W)[1]
                    v = (q.x - x, q.y - z)
                    n_ = math.hypot(*v) or 1.0
                    back = (v[0] / n_, v[1] / n_)
                    # 축에 맞춤 (벽은 대개 축 방향)
                    back = (round(back[0]), 0.0) if abs(back[0]) > abs(back[1]) else (0.0, float(round(back[1]) or 1))
            w, d, h, shift = {'toilet': (1.6, 2.4, 2.6, 0.35), 'urinal': (1.5, 1.2, 2.0, 0.1), 'lavatory': (1.9, 1.7, 2.8, 0.2),
                              'drinking_fountain': (3.6, 1.5, 3.3, 0.0)}[typ]
            out.append({'type': typ, 'x': x + back[0] * shift, 'z': z + back[1] * shift, 'w': w, 'd': d,
                        'rot': math.atan2(back[0], back[1]), 'h': h, 'room': r['no'], 'src': plan})
    return out


def counter_sinks(plan, counters):
    """카운터(base_cabinet) 안의 개수대: 렌더한 카운터 안의 네모난 흰 영역(0.8~3 ft², 볼록) → sink"""
    s = Sheet(sheet_path(plan)).fit_grid()
    out = []
    for c in counters:
        if c['type'] != 'base_cabinet':
            continue
        hw = max(c['w'], c['d']) / 2 + 0.2
        x0, z0, x1, z1 = c['x'] - hw, c['z'] - hw, c['x'] + hw, c['z'] + hw
        img = render_clip(s, x0, z0, x1, z1)
        white = img.min(axis=2) > 235
        lab, n = ndimage.label(white)
        sx, sz = (x1 - x0) / img.shape[1], (z1 - z0) / img.shape[0]
        from .equipment import rect_poly
        g = rect_poly(c).buffer(-0.2)
        for p in regionprops(lab):
            A = p.area * sx * sz
            if not (0.6 <= A <= 3.0 and p.solidity > 0.9):
                continue
            maj, mn = p.major_axis_length * sx, p.minor_axis_length * sx
            if maj > 2.2 or mn < 0.7:
                continue
            cy, cx = p.centroid
            x, z = x0 + (cx + 0.5) * sx, z0 + (cy + 0.5) * sz
            if not g.contains(Point(x, z)):
                continue
            # 싱크 기호 = 안에 배수구 원(작은 닫힌 영역)이 있다 → 구멍 있는 영역만
            if p.euler_number >= 1:
                continue
            out.append({'type': 'sink', 'x': x, 'z': z, 'w': round(min(maj, 2.0), 2), 'd': round(min(mn, 1.6), 2),
                        'rot': c['rot'], 'h': 0.15, 'y0': c['h'], 'room': c['room'], 'src': plan})
    return out


# 모양 분류가 놓친 기구 (도면에는 있음; 좌표는 확대 렌더에서 잰 값, ft). (층, 방, 종류, x, z, rot)
MEASURED = [
    ('FIRST', '120', 'toilet', 80.7, 39.5, math.pi / 2),      # A-101 남자 화장실 위쪽 장애인 칸 (물탱크 = 동쪽 배관벽)
    ('SECOND', '209', 'toilet', 81.9, -5.0, 0.0),             # A-102 1 인 화장실 (물탱크 = 남쪽)
    ('SECOND', '241', 'urinal', 76.5, 44.4, math.pi / 2),     # A-102 남자 화장실 위쪽 소변기
]
SIZES = {'toilet': (1.6, 2.4, 2.6), 'urinal': (1.5, 1.2, 2.0), 'lavatory': (1.9, 1.7, 2.8)}


def measured(floor, plan):
    out = []
    for fl, room, typ, x, z, rot in MEASURED:
        if fl == floor:
            w, d, h = SIZES[typ]
            out.append({'type': typ, 'x': x, 'z': z, 'w': w, 'd': d, 'rot': rot, 'h': h, 'room': room, 'src': plan + ' (measured)'})
    return out
