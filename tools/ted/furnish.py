"""도면에 가구가 없는 방의 '추정' 배치 (모든 항목 estimated: true).

A-701/702 에 가구(하늘색)가 그려진 방은 그대로 쓰고, 그려진 가구가 없는 방만 용도별 전형 배치를 만든다:
  교실 = 2 인용 탁자(5×2 ft) 줄 + 의자, 앞(교탁 벽) 을 향함 / 컴퓨터실 = 책상 줄 + 모니터 / 사무실·호텔링 = 책상 + 의자 /
  회의실 = 탁자 + 둘레 의자 / 휴게(breakout, lobby, overlook, library, skybridge) = 라운지 의자 2 + 낮은 탁자 묶음 /
  실험실·작업실 = 실험 탁자(6×2.5 ft) + 스툴.
문 앞 3.5 ft, 벽 0.5 ft(교실 앞쪽 6 ft), 기존 장비·카운터 1.5 ft 는 비운다.
"""
import math
import re

from shapely.geometry import Point, box
from shapely.ops import unary_union
from shapely import affinity

from .equipment import rect_poly

KINDS = [
    (re.compile(r'CPU|CAD|COMPUTER'), 'computer'),
    (re.compile(r'CLASSROOM|CLASSLAB|CLASS'), 'classroom'),
    (re.compile(r'CONF'), 'conference'),
    (re.compile(r'OFFICE|HOTELING'), 'office'),
    (re.compile(r'BREAKOUT|LOBBY|OVERLOOK|LIBRARY|LOUNGE|SKYBRIDGE'), 'lounge'),
    (re.compile(r'LAB|WORKSHOP|MAKER'), 'lab'),
]


def room_kind(name):
    for rx, k in KINDS:
        if rx.search(name or ''):
            return k
    return None


def _it(typ, x, z, w, d, h, rot, room, **kw):
    return {'type': typ, 'x': x, 'z': z, 'w': w, 'd': d, 'h': h, 'rot': rot, 'room': room, 'estimated': True,
            'src': 'estimated layout', **kw}


def _frame(poly, doors):
    """방의 주축 프레임: 최소 회전 사각형의 긴 변 방향 u, 앞쪽(문에서 먼 쪽) 부호"""
    mr = poly.minimum_rotated_rectangle
    c = list(mr.exterior.coords)
    e1 = (c[1][0] - c[0][0], c[1][1] - c[0][1]); e2 = (c[2][0] - c[1][0], c[2][1] - c[1][1])
    L1, L2 = math.hypot(*e1), math.hypot(*e2)
    u = (e1[0] / L1, e1[1] / L1) if L1 >= L2 else (e2[0] / L2, e2[1] / L2)
    ang = math.atan2(u[1], u[0])
    return mr.centroid, ang


def layout_room(room, doors, obstacles):
    """room = {no,name,poly}; doors = [shapely 선/점 버퍼], obstacles = shapely → 추정 가구 목록"""
    kind = room_kind(room['name'])
    if kind is None:
        return []
    poly = room['poly']
    keep_out = unary_union([d.buffer(3.5) for d in doors] + [o.buffer(1.5) for o in obstacles]) if (doors or obstacles) else None
    inner = poly.buffer(-0.5, join_style=2)
    if inner.is_empty:
        return []
    c, ang = _frame(poly, doors)
    # 방을 주축에 맞춰 돌린 좌표계에서 격자 배치 → 다시 돌린다
    R = lambda g: affinity.rotate(g, -ang, origin=c, use_radians=True)
    Rb = lambda g: affinity.rotate(g, ang, origin=c, use_radians=True)
    ip = R(inner)
    x0, z0, x1, z1 = ip.bounds
    # 앞쪽(교탁) = 문 중심에서 먼 쪽 (돌린 좌표의 x 방향 끝)
    front = +1
    if doors:
        dc = R(unary_union(doors)).centroid
        front = -1 if dc.x > (x0 + x1) / 2 else +1
    out = []

    def place(typ, cx, cz, w, d, h, face, **kw):
        """돌린 좌표 (cx, cz), face = 의자/책상이 바라보는 방향 (돌린 좌표 x 부호) → 원래 좌표 항목"""
        g = box(cx - w / 2, cz - d / 2, cx + w / 2, cz + d / 2)
        if not ip.contains(g):
            return False
        gb = Rb(g)
        if keep_out is not None and gb.intersects(keep_out):
            return False
        if any(rect_poly(o).intersects(gb) for o in out):
            return False
        p = Rb(Point(cx, cz))
        # 항목 로컬 -z(앞) 이 face 방향을 보게: 돌린 좌표에서 (face, 0) → 원래 좌표 각 ang
        a = ang + (0 if face > 0 else math.pi)
        vx, vz = math.cos(a), math.sin(a)
        rot = math.atan2(-vx, -vz)
        out.append(_it(typ, p.x, p.y, d, w, h, rot, room['no'], **kw))     # 항목 로컬 x = 돌린 좌표 z 방향
        return True

    if kind in ('classroom', 'computer', 'lab'):
        tw, td, step_z = (5.0, 2.0, 5.5) if kind == 'classroom' else (5.0, 2.5, 5.5) if kind == 'computer' else (6.0, 2.5, 6.5)
        first = 6.0 if kind != 'lab' else 3.0               # 앞쪽 여유(교탁·화이트보드)
        aisle = 4.0
        xs = []
        x = (x1 - first - td / 2) if front > 0 else (x0 + first + td / 2)
        while (x0 + td) < x < (x1 - td):
            xs.append(x)
            x -= front * step_z
        for xr in xs:
            z = z0 + aisle / 2 + tw / 2
            while z + tw / 2 < z1 - aisle / 2 + 0.01:
                if place('table' if kind != 'computer' else 'desk', xr, z, td, tw, 2.5, front):
                    # 의자 2 개 (책상 뒤, 앞을 바라봄)
                    for k in (-1, 1):
                        cz = z + k * tw / 4
                        cx = xr - front * (td / 2 + 1.0)
                        place('stool' if kind == 'lab' else 'chair', cx, cz, 1.8, 1.8, 2.1 if kind == 'lab' else 2.8, front)
                        if kind == 'computer':
                            g = Rb(Point(xr + front * 0.6, cz))
                            out.append(_it('monitor', g.x, g.y, 1.8, 0.25, 1.4, out[-1]['rot'] if out else 0, room['no'], y0=2.5))
                z += tw + 0.5 if kind != 'lab' else tw + aisle
    elif kind == 'office':
        cx = x1 - 1.5 if front > 0 else x0 + 1.5
        if place('desk', cx, (z0 + z1) / 2, 2.5, 5.0, 2.5, -front):
            place('chair', cx - front * 2.4, (z0 + z1) / 2, 1.8, 1.8, 2.8, front)
    elif kind == 'conference':
        L = min(x1 - x0 - 6, 14); W = min(z1 - z0 - 6, 4.0)
        if L > 4 and W > 2.5:
            mx, mz = (x0 + x1) / 2, (z0 + z1) / 2
            if place('table', mx, mz, L, W, 2.5, 1):
                n = max(1, int(L // 2.5))
                for k in range(n):
                    px = mx - L / 2 + (k + 0.5) * L / n
                    place('chair', px, mz - W / 2 - 1.0, 1.8, 1.8, 2.8, 1)
                    place('chair', px, mz + W / 2 + 1.0, 1.8, 1.8, 2.8, 1)
    elif kind == 'lounge':
        gx, gz = 8.0, 8.0
        x = x0 + 4.0
        while x < x1 - 3.5:
            z = z0 + 4.0
            while z < z1 - 3.5:
                if place('table_low', x, z, 2.0, 2.0, 1.4, 1):
                    place('lounge_chair', x - 2.6, z, 2.5, 2.5, 2.6, 1)
                    place('lounge_chair', x + 2.6, z, 2.5, 2.5, 2.6, -1)
                z += gz
            x += gx
    return out
