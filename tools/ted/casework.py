"""캐비닛·카운터(평면의 닫힌 검은 실선 사각형) + A-501 실내입면의 벽걸이 항목(마커보드 VDS-01, 모니터).

평면(A-701/702 = A-101/102 바탕): 실험대 아일랜드와 벽 카운터는 검은 실선(점선 아님)으로 닫힌 사각형이다
(벽 쪽 카운터는 벽 마감선이 한 변). 검은 실선만 래스터로 그려 닫힌 빈 영역을 찾고, 짧은 변 1.4~5 ft · 긴 변 ≥ 2.5 ft ·
직사각형도 ≥ 0.9 인 것 = 카운터. 영역 안의 작은 닫힌 구멍(1~4 ft²) = 싱크.
A-501: 하부장 2'-10" + 상판 → 카운터 윗면 2.93 ft. 벽걸이 항목은 방 번호 + 벽 방향 + 입면 치수로 놓는다.
"""
import math
import re

import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage
from shapely.geometry import Point, Polygon, box

from .sheet import Sheet, sheet_path
from .equipment import rect_of, rect_poly, EXTENT, COUNTER_H

FPP = 0.05
ROOM_OK = re.compile(r'LAB|CLASS|WORKSHOP|MAKER|KITCHEN|OFFICE|LIBRARY|HOTELING|STORAGE|CONF|BREAKOUT')


class _R:
    def __init__(self, fpp, x0, z0):
        self.fpp, self.x0, self.z0 = fpp, x0, z0


def _segments(sheet):
    """검은 실선(점선 제외) 중 축에 나란한 선분 → (H: [(z, x0, x1)], V: [(x, z0, z1)]) 로컬 ft"""
    H, V = [], []
    for dr in sheet.page.get_drawings():
        if dr['type'] not in ('s', 'fs'):
            continue
        col = dr.get('color')
        if not col or max(col) > 0.05 or (dr.get('dashes') and dr['dashes'] not in ('[] 0', '[] 0.0')):
            continue
        segs = []
        for it in dr['items']:
            if it[0] == 'l':
                segs.append((it[1] * sheet.M, it[2] * sheet.M))
            elif it[0] == 're':
                r = it[1]
                q = [p * sheet.M for p in (r.tl, r.tr, r.br, r.bl)]
                segs += list(zip(q, q[1:] + q[:1]))
        for p, q in segs:
            (x0, z0), (x1, z1) = sheet.to_local(p.x, p.y), sheet.to_local(q.x, q.y)
            L = math.hypot(x1 - x0, z1 - z0)
            if L < 0.25:
                continue
            if abs(z1 - z0) < 0.02 * L:
                H.append(((z0 + z1) / 2, min(x0, x1), max(x0, x1)))
            elif abs(x1 - x0) < 0.02 * L:
                V.append(((x0 + x1) / 2, min(z0, z1), max(z0, z1)))
    return H, V


def _merge(lines, tol=0.06):
    """같은 좌표(±tol)의 선분 구간 합치기 → {좌표: [(a, b)...]} (구간은 겹침/맞닿음만 합침)"""
    out = []
    for c, a, b in sorted(lines):
        if out and abs(out[-1][0] - c) <= tol:
            out[-1][1].append((a, b))
        else:
            out.append([c, [(a, b)]])
    res = []
    for c, iv in out:
        iv.sort()
        m = [list(iv[0])]
        for a, b in iv[1:]:
            if a <= m[-1][1] + 0.05:
                m[-1][1] = max(m[-1][1], b)
            else:
                m.append([a, b])
        res.append((c, [tuple(x) for x in m]))
    return res


def _cover(iv, a, b):
    """구간 목록이 [a, b] 를 덮는 비율"""
    t = sum(max(0.0, min(b, y) - max(a, x)) for x, y in iv)
    return t / max(b - a, 1e-6)


def _rects(A, B, gap_max=1.6):
    """A: 긴 변 방향 선들 (c, 구간), B: 직교 선들. 평행한 두 선(간격 1.4~5 ft) 사이를 직교 선(끝막음)으로 자른 사각형들.
    반환 (c0, c1, u0, u1): 긴 변 좌표 c0<c1, 길이 방향 u0<u1"""
    out = []
    Bs = sorted(B, key=lambda t: t[0])
    Bc = np.array([t[0] for t in Bs]) if Bs else np.zeros(0)
    Ac = np.array([t[0] for t in A])
    for i, (c0, iv0) in enumerate(A):
        for c1, iv1 in A[i + 1:]:
            sp = c1 - c0
            if sp < 1.4:
                continue
            if sp > 5.0:
                break
            # 끝막음 후보: 두 선 사이를 80 % 이상 잇는 직교 선
            lo, hi = np.searchsorted(Bc, [min(iv0[0][0], iv1[0][0]) - 0.1, max(iv0[-1][1], iv1[-1][1]) + 0.1])
            caps = sorted(u for u, ivb in Bs[lo:hi] if _cover(ivb, c0, c1) >= 0.8)
            caps = [u for k, u in enumerate(caps) if k == 0 or u - caps[k - 1] > 0.3]
            for u0, u1 in zip(caps, caps[1:]):
                if u1 - u0 < 2.5:
                    continue
                if _cover(iv0, u0, u1) >= 0.8 and _cover(iv1, u0, u1) >= 0.8:
                    # 가운데에 같은 방향 선이 또 지나가면(더 좁은 사각형 둘) 버림
                    m0, m1 = np.searchsorted(Ac, [c0 + 0.3, c1 - 0.3])
                    mid = [c for c, iv in A[m0:m1] if _cover(iv, u0, u1) >= 0.8]
                    if not mid:
                        out.append((c0, c1, u0, u1))
    return out


def counters(sheet_name, rooms, walls):
    """→ [{type:'base_cabinet', x,z,w,d,rot,h, room, src}]  rooms = [{no,name,poly}], walls = shapely 다각형 목록"""
    s = Sheet(sheet_path(sheet_name)).fit_grid()
    H, V = _segments(s)
    # 대상 방(실험실·교실 등) 안의 선만 — 쌍 찾기 비용을 줄인다
    from shapely.ops import unary_union
    from shapely import prepared
    zone = prepared.prep(unary_union([r['poly'].buffer(0.6) for r in rooms if ROOM_OK.search(r['name'] or '')]))
    H = [h for h in H if zone.intersects(Point((h[1] + h[2]) / 2, h[0]))]
    V = [v for v in V if zone.intersects(Point(v[0], (v[1] + v[2]) / 2))]
    Hm, Vm = _merge(H), _merge(V)
    cands = [box(u0, c0, u1, c1) for c0, c1, u0, u1 in _rects(Hm, Vm)]          # 가로로 긴 것 (z = c)
    cands += [box(c0, u0, c1, u1) for c0, c1, u0, u1 in _rects(Vm, Hm)]         # 세로로 긴 것 (x = c)
    from shapely.strtree import STRtree
    wtree = STRtree(walls)
    words = [Point(*s.to_local(X, Y)) for t, X, Y, h, r in s.words]
    wtr = STRtree(words)
    out, taken = [], []
    for g in sorted(cands, key=lambda g: g.area):
        c = g.centroid
        room = next((r for r in rooms if r['poly'].contains(c)), None)
        if room is None or not ROOM_OK.search(room['name'] or ''):
            continue
        if g.area > 0.5 * room['poly'].area:
            continue                           # 벽장 같은 좁은 방 자체
        if sum(walls[k].intersection(g).area for k in wtree.query(g)) > 0.25 * g.area:
            continue
        if any(g.buffer(-0.05).contains(words[k]) for k in wtr.query(g)):
            continue                           # 글자 든 칸(태그·라벨 상자)
        if any(t.intersection(g).area > 0.3 * min(t.area, g.area) for t in taken):
            continue
        taken.append(g)
        x0, z0, x1, z1 = g.bounds
        w, d = x1 - x0, z1 - z0
        rot = 0.0 if w >= d else -math.pi / 2
        out.append({'type': 'base_cabinet', 'x': (x0 + x1) / 2, 'z': (z0 + z1) / 2, 'w': max(w, d), 'd': min(w, d),
                    'rot': rot, 'h': COUNTER_H, 'room': room['no'], 'src': sheet_name})
    return out


# A-501 실내입면: (방, 벽 방향, 항목들[(종류, 왼끝 기준 중심 오프셋 ft 또는 'C'(가운데)/'Q1'/'Q3', 폭, 높이, 바닥 높이)], 입면 기호)
# 입면의 왼쪽 = 벽을 바라볼 때 왼쪽 (남쪽 벽을 보면 왼쪽 = 동쪽).
WALL_ITEMS = [
    ('106', 'S', [('marker_board', 'C-4', 8.0, 4.0, 3.0), ('marker_board', 'C+4', 8.0, 4.0, 3.0)], 'F1'),
    ('105', 'S', [('marker_board', 'C-4', 8.0, 4.0, 3.0), ('marker_board', 'C+4', 8.0, 4.0, 3.0),
                  ('wall_monitor', 'Q1', 6.2, 3.6, 3.2), ('wall_monitor', 'Q3', 6.2, 3.6, 3.2)], 'C5'),
    ('145', 'E', [('wall_monitor', 7.0, 5.8, 3.4, 3.3), ('wall_monitor', -7.0, 5.8, 3.4, 3.3)], 'B1'),
    ('145', 'S', [('wall_monitor', 10.0, 5.8, 3.4, 3.3), ('wall_monitor', -10.0, 5.8, 3.4, 3.3)], 'B3'),
    ('207', 'W', [('wall_monitor', 'C', 4.0, 2.3, 3.35)], 'A1'),
    ('208', 'E', [('wall_monitor', 'C', 4.0, 2.3, 3.35)], 'A2'),
    ('206', 'W', [('wall_monitor', 'C', 4.0, 2.3, 3.35)], 'A3'),
]
DIRS = {'N': (0, -1), 'S': (0, 1), 'E': (1, 0), 'W': (-1, 0)}


def _wall_edge(poly, side):
    """방 다각형에서 그 방향(바깥 법선)으로 가장 멀리 있는 긴 변 → (a, b) (입면 왼쪽 → 오른쪽 순서)"""
    nx, nz = DIRS[side]
    pts = list(poly.exterior.coords)
    best, score = None, -1e9
    for a, b in zip(pts, pts[1:]):
        L = math.dist(a, b)
        if L < 4:
            continue
        ex, ez = (b[0] - a[0]) / L, (b[1] - a[1]) / L
        if abs(ex * nx + ez * nz) > 0.2:
            continue                           # 그 방향을 향한 변이 아님
        sc = ((a[0] + b[0]) / 2 * nx + (a[1] + b[1]) / 2 * nz) + 0.02 * L
        if sc > score:
            best, score = (a, b), sc
    a, b = best
    # 왼쪽 → 오른쪽: 벽을 바라보면(법선 n 방향) 오른쪽 = n × up = (-nz, nx) 쪽... 로컬 (x, z) 에서 오른쪽 벡터 = (-nz, nx)
    rx, rz = -nz, nx
    if (b[0] - a[0]) * rx + (b[1] - a[1]) * rz < 0:
        a, b = b, a
    return a, b


def wall_items(rooms_by_no):
    out = []
    for no, side, items, tag in WALL_ITEMS:
        r = rooms_by_no.get(no)
        if r is None:
            continue
        a, b = _wall_edge(r['poly'], side)
        L = math.dist(a, b)
        ex, ez = (b[0] - a[0]) / L, (b[1] - a[1]) / L
        nx, nz = DIRS[side]
        for typ, off, w, h, y0 in items:
            if isinstance(off, str):
                if off.startswith('C'):
                    t = L / 2 + (float(off[1:]) if len(off) > 1 else 0)
                else:                          # C5: 벽 끝과 마커보드(가운데 16 ft) 사이 가운데
                    m = (L / 2 - 8.0) / 2
                    t = m if off == 'Q1' else L - m
            else:
                t = off if off >= 0 else L + off
            d = 0.12 if typ == 'wall_monitor' else 0.06
            x, z = a[0] + ex * t - nx * (d / 2 + 0.02), a[1] + ez * t - nz * (d / 2 + 0.02)
            rot = -math.atan2(ez, ex)
            out.append({'type': typ, 'x': x, 'z': z, 'w': w, 'd': d, 'rot': rot, 'h': h, 'y0': y0,
                        'room': no, 'src': f'A-501 {tag}', 'label': 'VDS-01 marker board' if typ == 'marker_board' else 'Monitor'})
    return out


# ── 마무리 2: 벽걸이 상부장(평면 점선) + 하부장 모듈·상판 ──
# A-501 C8 (ELECT LAB, NORTH, 1/4"): 하부장 2'-10" 모듈(문 2 짝), SSM-01 상판, 토킥 4", 상부장 PL-01 밑 4'-6" ~ 위 7'-0"
# (2'-6"), 깊이 = 평면 점선까지(105: 약 1'-0"). 평면에서 상부장(머리 위 물체)은 점선 = 짧은 실선 조각(대시)이 일정 간격으로 이어진 선.
UPPER_Y0, UPPER_H = 4.5, 2.5
TOE_H, TOP_T, TOP_OVER = 0.33, 0.08, 0.08          # 토킥 4", 상판 1" (EP-03 / SSM-01), 앞 내밀기 1"
MODULE = 2.83                                       # 2'-10" (C8; 실험대 입면 G1~D5 의 3'-0" / 2'-6" 모듈과 비슷)


def dashed_lines(sheet, min_len=2.0, min_n=4):
    """검은 0.24 pt 짧은 조각(0.08~1.2 ft)이 0.04~0.7 ft 간격으로 4 개 이상 이어진 축 방향 점선 → [(ori, c, u0, u1)] 로컬 ft.
    ori 'H' = z = c 인 가로선(x: u0..u1), 'V' = x = c 인 세로선."""
    from collections import defaultdict
    Hs, Vs = defaultdict(list), defaultdict(list)
    for dr in sheet.page.get_drawings():
        c = dr.get('color')
        if dr['type'] == 'f' or not c or max(c) > 0.12 or abs((dr.get('width') or 0) - 0.24) > 0.01:
            continue
        for it in dr['items']:
            if it[0] != 'l':
                continue
            a, b = sheet.to_local(*(it[1] * sheet.M)), sheet.to_local(*(it[2] * sheet.M))
            L = math.dist(a, b)
            if not 0.08 <= L <= 1.2:
                continue
            if abs(a[1] - b[1]) < 0.01:
                Hs[round((a[1] + b[1]) / 2, 2)].append((min(a[0], b[0]), max(a[0], b[0])))
            elif abs(a[0] - b[0]) < 0.01:
                Vs[round((a[0] + b[0]) / 2, 2)].append((min(a[1], b[1]), max(a[1], b[1])))
    out = []
    for ori, D in (('H', Hs), ('V', Vs)):
        for c, iv in D.items():
            iv.sort()
            cur = [iv[0]]
            for u in iv[1:] + [(1e9, 1e9)]:
                g = u[0] - cur[-1][1]
                if 0.04 <= g <= 0.7:
                    cur.append(u)
                elif g < 0.04:
                    cur[-1] = (cur[-1][0], max(cur[-1][1], u[1]))
                else:
                    if len(cur) >= min_n and cur[-1][1] - cur[0][0] >= min_len:
                        out.append((ori, c, cur[0][0], cur[-1][1]))
                    cur = [u]
    return out


def upper_cabinets(plan, rooms, walls, counters=()):
    """평면 점선 중 벽과 나란하고 벽에서 0.8~1.6 ft 떨어진 것(상부장 앞면) → upper_cabinet / wall_shelf 항목.
    천장 소핏·장비 숨은선 같은 거짓 양성을 줄이려고 캐비닛 방(ROOM_OK)이고, 아래에 하부장이 있거나
    끝에 벽까지 닿는 점선 마구리가 있을 때만. 창고(STORAGE)는 문 없는 선반(wall_shelf)."""
    from shapely.ops import unary_union
    from .equipment import rect_poly
    s = Sheet(sheet_path(plan)).fit_grid()
    W = unary_union(list(walls))
    D = dashed_lines(s)
    short = dashed_lines(s, min_len=0.6, min_n=2)    # 마구리 (벽에서 앞면까지 1~1.6 ft)
    Dv = [d for d in short if d[0] == 'V']
    Dh = [d for d in short if d[0] == 'H']
    cpolys = [rect_poly(c) for c in counters if c['type'] == 'base_cabinet']
    out = []
    for ori, c, u0, u1 in D:
        mid = ((u0 + u1) / 2, c) if ori == 'H' else (c, (u0 + u1) / 2)
        room = next((r for r in rooms if r['poly'].contains(Point(mid))), None)
        if room is None or not ROOM_OK.search(room['name'] or ''):
            continue
        best = None
        for sg in (1, -1):                            # 벽 쪽 거리: 선의 1/4·1/2·3/4 지점에서 같은 쪽 벽까지
            ds = []
            for f in (0.25, 0.5, 0.75):
                u = u0 + (u1 - u0) * f
                for t in [k / 20 for k in range(2, 40)]:
                    p = Point(u, c + sg * t) if ori == 'H' else Point(c + sg * t, u)
                    if W.distance(p) < 0.03:
                        ds.append(t)
                        break
            if len(ds) == 3 and max(ds) - min(ds) < 0.2 and 0.8 <= sum(ds) / 3 <= 1.6:
                best = (sg, sum(ds) / 3)
        if best is None:
            continue
        sg, depth = best
        lo, hi = min(c, c + sg * depth), max(c, c + sg * depth)
        body = box(u0, lo, u1, hi) if ori == 'H' else box(lo, u0, hi, u1)
        over = any(cp.intersection(body).area > 0.3 * body.area for cp in cpolys)
        caps = Dv if ori == 'H' else Dh
        capped = any(min(abs(c2 - u0), abs(c2 - u1)) < 0.2 and a2 - 0.2 <= lo and hi <= b2 + 0.2 for o2, c2, a2, b2 in caps)
        if not (over or capped):
            continue
        if any(o['body'].intersection(body).area > 0.5 * body.area for o in out):
            continue                                  # 겹쳐 그린 같은 선
        x0, z0, x1, z1 = body.bounds
        back = (0, sg) if ori == 'H' else (sg, 0)     # 뒤 = 벽 쪽 (로컬 +z → (sin rot, cos rot))
        typ = 'wall_shelf' if 'STORAGE' in (room['name'] or '') else 'upper_cabinet'
        out.append({'type': typ, 'x': (x0 + x1) / 2, 'z': (z0 + z1) / 2, 'w': u1 - u0, 'd': depth,
                    'rot': math.atan2(back[0], back[1]), 'h': UPPER_H, 'y0': UPPER_Y0, 'room': room['no'], 'body': body,
                    'src': f'{plan} dashed outline; heights A-501 C8',
                    'label': 'Wall-hung upper cabinet' if typ == 'upper_cabinet' else 'Wall-hung open shelving'})
    for o in out:
        del o['body']
    return out


def _front_side(c, W):
    """하부장 앞쪽 결정: 로컬 ±z 가장자리 중 벽(0.45 ft 안)에 붙은 쪽을 뒤로. → 0 (그대로) | pi (뒤집기) | None (양면 아일랜드)"""
    hits = []
    ux, uz = math.cos(c['rot']), -math.sin(c['rot'])
    for sg in (1, -1):
        bx, bz = math.sin(c['rot']) * sg, math.cos(c['rot']) * sg
        ok = 0
        for f in (-0.35, 0, 0.35):
            p = Point(c['x'] + bx * (c['d'] / 2 + 0.15) + ux * f * c['w'], c['z'] + bz * (c['d'] / 2 + 0.15) + uz * f * c['w'])
            ok += W.distance(p) < 0.45
        hits.append(ok >= 2)
    if hits[0] and not hits[1]:
        return 0.0
    if hits[1] and not hits[0]:
        return math.pi
    return None


def detail_counters(casework, walls):
    """base_cabinet(카운터 사각형) → 모듈 하부장(base_doors / base_drawers / base_island; 상판 아래까지) + countertop.
    모듈 폭 = 길이를 2'-10" 에 가장 가까운 수로 등분. 벽 카운터는 앞(로컬 -z)이 방 쪽, 아일랜드는 양면 문.
    상판: 앞 1" 내밀기(아일랜드는 사방), 두께 1"."""
    from shapely.ops import unary_union
    W = unary_union(list(walls))
    out = []
    for c in casework:
        if c['type'] != 'base_cabinet':
            out.append(c)
            continue
        flip = _front_side(c, W)
        rot = c['rot'] + (flip or 0.0)
        island = flip is None
        L = c['w']
        n = max(1, round(L / MODULE))
        mw = L / n
        ux, uz = math.cos(rot), -math.sin(rot)
        body_h = c['h'] - TOP_T
        for k in range(n):
            off = -L / 2 + mw * (k + 0.5)
            typ = 'base_island' if island else ('base_drawers' if k % 3 == 1 else 'base_doors')
            out.append({**c, 'type': typ, 'x': c['x'] + ux * off, 'z': c['z'] + uz * off, 'w': mw, 'rot': rot,
                        'h': body_h, 'label': 'Base cabinet (A-501 lab casework)'})
        fx, fz = -math.sin(rot), -math.cos(rot)          # 앞 방향
        sh = 0 if island else TOP_OVER / 2
        out.append({**c, 'type': 'countertop', 'x': c['x'] + fx * sh, 'z': c['z'] + fz * sh, 'w': L + (0.08 if island else 0),
                    'd': c['d'] + (TOP_OVER * 2 if island else TOP_OVER), 'rot': rot, 'h': TOP_T, 'y0': (c.get('y0') or 0) + body_h,
                    'label': 'Countertop (EP-03 epoxy resin / SSM-01)'})
    return out
