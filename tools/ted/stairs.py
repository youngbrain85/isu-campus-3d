"""cTED 계단·경사로·엘리베이터 (Task 7).

출처 (읽기 전용 도면):
  A-421  로비 계단 1(G1 평면, G4 단면, H4 목재 좌석, H5/H6 난간), 로비 계단 2(B7), 로비 계단 3(F1/C1 평면, A1 단면)
  A-422  N 계단(H1/F1 평면, E1 단면), 복도 계단·경사로(A3 평면, C5/A5 단면)
  A-424/A-425  난간 상세 (GL-13 유리 난간 = 057313.C01 shoe mounted glass rail, 3'-6"; 손잡이 3'-0"/2'-10")
  A-100/A-101/A-102  계단 002/126, 메자닌 철재 계단(상세 A-423 은 도면 세트에 없음 → 평면 선에서 측정), 엘리베이터 E1

방법: 상세도의 치수 글자(“9 TR @ 11" = 8'-3"”, “10 EQ. R = 4'-10 21/32"”)와 단면의 층 높이로 챌판 수·높이를 정하고,
위치는 1/8" 평면(A-100/101/102, 그리드로 로컬 좌표에 맞춤)의 챌판 선에서 읽었다. 시험(tests/test_ted.py)이
① 상세도에 그 치수 글자가 실제로 있는지 ② 사양의 챌판 위치마다 평면에 선이 있는지 ③ 평면의 UP/DN 글자가 모두
모델 계단 위에 있는지 확인한다.

좌표: 로컬 ft (x = E1 에서 동쪽, z = EM 에서 남쪽), y = FIRST 100'-0" 기준 높이.
층계(flight): a = 첫 챌판 선(아래) 중심, b = 마지막 챌판 선 중심, risers = 챌판 수, w = 폭.
  챌판 k 는 a + k·(b-a)/(risers-1) 에 있고 높이 y0 + k·r → y0 + (k+1)·r (r = (y1-y0)/risers). 마지막 챌판 위는 계단참/바닥.
  risers = 0 이면 경사로 (a 에서 y0, b 에서 y1).
"""
import math
import re
from functools import lru_cache

from shapely.geometry import box, Point, Polygon
from shapely.ops import unary_union

from ted.sheet import Sheet, sheet_path, building_outline

# 층 높이 (A-301, A-421/A-422 단면): FIRST 100'-0" = 0
LEVELS = {'LOWER': -14.67, 'FIRST SW': -5.0, 'FIRST SW 97': -3.0, 'FIRST N': -2.0, 'FIRST': 0.0, 'SECOND': 14.67}
GUARD, HANDRAIL = 3.5, 2.83            # 3'-6" 가드, 2'-10" 손잡이 (상세에 다른 값이 없을 때)


def F(a, b, risers, w, check=()):
    return {'a': a, 'b': b, 'risers': risers, 'w': w, 'check': list(check)}


def L(x0, z0, x1, z1):
    return [(x0, z0), (x1, z0), (x1, z1), (x0, z1)]


# 계단 사양. flights 순서 = 올라가는 순서, landings = flights 사이 계단참(+필요하면 위·아래 바닥 띠).
# rails: (종류, 높이, 경로) — 경로 'F0+' = 0 번 층계의 +쪽(진행 방향 왼쪽→ 아래 side() 참고), 'L0:x0,z0,x1,z1' = 계단참 높이의 선분,
#        'Y:y:x0,z0,x1,z1' = 고정 높이 y 의 선분.
STAIRS = [
    {   # A-421 G1/G4: 95'-0" 로비 → 100'-0", 5 EQ R = 2'-6" ×2 (6"), 디딤판 12", 폭 14'-9 7/8", 가운데 손잡이 H6
        'id': 'lobby1', 'name': 'Lobby Stair 1', 'floor': 'FIRST', 'from': 'FIRST SW', 'to': 'FIRST', 'kind': 'monumental',
        'finish': 'terrazzo', 'open': False, 'solid': True, 'src': 'A-421 G1, G4, H5, H6; A-101',
        'flights': [F((34.09, 51.70), (38.09, 51.70), 5, 15.24, [('A-101', 5)]),
                    F((42.09, 51.70), (46.09, 51.70), 5, 15.24, [('A-101', 5)])],
        'landings': [L(38.09, 44.08, 42.09, 59.32), L(46.09, 44.08, 47.10, 59.32)],
        'rails': [('glass', GUARD, 'F0-'), ('glass', GUARD, 'L0:38.09,44.08,42.09,44.08'), ('glass', GUARD, 'F1-'),
                  ('glass', GUARD, 'F0+'), ('glass', GUARD, 'L0:38.09,59.32,42.09,59.32'), ('glass', GUARD, 'F1+'),
                  ('handrail', HANDRAIL, 'F0c'), ('handrail', HANDRAIL, 'L0:38.09,51.70,42.09,51.70'), ('handrail', HANDRAIL, 'F1c')],
        'cut': {'FIRST': [box(34.09, 44.08, 46.09, 59.32)]},
        'text': [('A-421', '4 TR @ 12"= 4\'-0"'), ('A-421', '5 TR @ 12"= 5\'-0"'), ('A-421', '5 EQ. R= 2\'-6"'),
                 ('A-421', 'LOBBY STAIR1')],
    },
    {   # A-421 H4 목재 좌석 단 (계단 1 남쪽, WD-03): 95' → 100' 4 단. 단 높이·깊이 근사 (1'-2"~1'-4" → 1'-3", 2'-6")
        'id': 'lobby1_seat', 'name': 'Lobby Stair 1 wood seating', 'floor': 'FIRST', 'from': 'FIRST SW', 'to': 'FIRST',
        'kind': 'seating', 'finish': 'wood', 'open': False, 'solid': True, 'approx': True, 'src': 'A-421 G1, H4',
        'flights': [F((34.09, 63.20), (41.59, 63.20), 4, 7.75)],
        'landings': [L(41.59, 59.32, 47.10, 67.07)],
        'rails': [('glass', GUARD, 'Y:0:41.59,67.07,47.10,67.07')],
        'cut': {'FIRST': [box(34.09, 59.32, 41.59, 67.07)]},
        'text': [('A-421', 'WOOD SEATING DETAIL')],
    },
    {   # A-421 B7: 95' → 97' 단, 4 EQ R = 2'-0" (6"), 손잡이 3 줄 (055213 파이프 난간 3'-0")
        'id': 'lobby2', 'name': 'Lobby Stair 2', 'floor': 'FIRST', 'from': 'FIRST SW', 'to': 'FIRST SW 97', 'kind': 'monumental',
        'finish': 'terrazzo', 'open': False, 'solid': True, 'src': 'A-421 B7; A-101',
        'flights': [F((15.92, 91.07), (15.92, 94.08), 4, 20.64, [('A-101', 4)])],
        'landings': [L(5.60, 94.08, 26.24, 95.08)],
        'rails': [('metal', 3.0, 'F0+'), ('metal', 3.0, 'F0-'), ('handrail', 3.0, 'F0c')],
        'cut': {'FIRST': [box(5.60, 91.07, 26.24, 94.08)]},
        'text': [('A-421', '4 EQ. R= 2\'-0"'), ('A-421', 'LOBBY STAIR 2- SECTION')],
    },
    {   # A-421 F1/C1/A1: 100'-0" → 114'-8", 9/10/11 EQ R (5.87"), 디딤판 11", 폭 5'-8", 프리캐스트 테라조, 강재 측판, GL-13 유리 난간
        'id': 'lobby3', 'name': 'Lobby Stair 3', 'floor': 'FIRST', 'from': 'FIRST', 'to': 'SECOND', 'kind': 'monumental',
        'finish': 'terrazzo', 'open': True, 'solid': False, 'src': 'A-421 F1, C1, A1; A-424 A4/G3/G5; A-101, A-102',
        'flights': [F((46.18, 63.505), (38.85, 63.505), 9, 5.63, [('A-101', 7)]),
                    F((31.33, 63.505), (23.08, 63.505), 10, 5.63, [('A-102', 10)]),
                    F((23.08, 72.82), (32.25, 72.82), 11, 5.64, [('A-102', 11)])],
        'landings': [L(31.33, 60.69, 38.85, 66.32), L(16.03, 60.69, 23.08, 75.64), L(32.25, 70.00, 33.17, 75.64)],
        'rails': [('glass', GUARD, 'F0+'), ('glass', GUARD, 'F0-'), ('glass', GUARD, 'L0:31.33,60.69,38.85,60.69'),
                  ('glass', GUARD, 'L0:31.33,66.32,38.85,66.32'), ('glass', GUARD, 'F1+'), ('glass', GUARD, 'F1-'),
                  ('glass', GUARD, 'L1:23.08,60.69,16.03,60.69'), ('glass', GUARD, 'L1:16.03,60.69,16.03,75.64'),
                  ('glass', GUARD, 'L1:16.03,75.64,23.08,75.64'), ('glass', GUARD, 'L1:23.08,66.32,23.08,70.00'),
                  ('glass', GUARD, 'F2+'), ('glass', GUARD, 'F2-')],
        'cut': {'SECOND': [box(16.03, 60.19, 33.17, 76.14)]},
        'text': [('A-421', '9 TR@ 11"= 8\'-3"'), ('A-421', '11 TR@ 11"= 10\'-1"'), ('A-421', '7\'-6 1/8"'),
                 ('A-421', '9 EQ. R= 4\'-4 13/16"'), ('A-421', '10 EQ. R= 4\'-10 21/32"'), ('A-421', '11 EQ.R= 5\'-4 17/32"'),
                 ('A-421', 'LOBBY STAIR 3- SECTION')],
    },
    {   # A-422 H1/F1/E1: 98'-0" (FIRST LEVEL N) → 114'-8", 10 EQUAL RISERS = 5'-6 11/16" ×3 (6.67"), 9 TR @ 11" = 8'-3", 계단참 6'-0"
        'id': 'n_stair', 'name': 'N Stair', 'floor': 'FIRST', 'from': 'FIRST N', 'to': 'SECOND', 'kind': 'egress',
        'finish': 'terrazzo', 'open': True, 'solid': False, 'src': 'A-422 H1, F1, E1, E5..E7; A-425 G3/G4; A-101, A-102',
        'flights': [F((67.06, -20.90), (75.31, -20.90), 10, 4.60, [('A-101', 7), ('A-102', 10)]),
                    F((81.31, -20.90), (89.56, -20.90), 10, 4.60, [('A-102', 10)]),
                    F((95.56, -20.90), (103.81, -20.90), 10, 4.60, [('A-102', 10)])],
        'landings': [L(75.31, -23.20, 81.31, -18.60), L(89.56, -23.20, 95.56, -18.60), L(103.81, -23.20, 105.81, -18.60)],
        'rails': [('glass', GUARD, 'F0+'), ('glass', GUARD, 'F0-'), ('glass', GUARD, 'L0:75.31,-23.2,81.31,-23.2'),
                  ('glass', GUARD, 'L0:75.31,-18.6,81.31,-18.6'), ('glass', GUARD, 'F1+'), ('glass', GUARD, 'F1-'),
                  ('glass', GUARD, 'L1:89.56,-23.2,95.56,-23.2'), ('glass', GUARD, 'L1:89.56,-18.6,95.56,-18.6'),
                  ('glass', GUARD, 'F2+'), ('glass', GUARD, 'F2-'),
                  # 2 층 바닥 구멍 둘레 가드 (A-422 D4/D6 railing elev at SECOND LEVEL)
                  ('glass', GUARD, 'Y:14.67:66.06,-23.7,103.81,-23.7'), ('glass', GUARD, 'Y:14.67:66.06,-18.1,103.81,-18.1'),
                  ('glass', GUARD, 'Y:14.67:66.06,-23.7,66.06,-18.1')],
        'cut': {'SECOND': [box(66.06, -23.70, 103.81, -18.10)]},
        'text': [('A-422', '9 TR @ 11"= 8\'-3"'), ('A-422', '10 EQUAL RISERS'), ('A-422', '5\'-6 11/16"'),
                 ('A-422', 'N STAIR- SECTION')],
    },
    {   # A-422 A3/C5: 98' → 100', 4 EQ R = 2'-0" (6"), 4 TR @ 12", 현장타설 콘크리트 + 테라조
        'id': 'corr_stair', 'name': 'Corridor Stair', 'floor': 'FIRST', 'from': 'FIRST N', 'to': 'FIRST', 'kind': 'monumental',
        'finish': 'terrazzo', 'open': False, 'solid': True, 'src': 'A-422 A3, C5; A-101',
        'flights': [F((56.00, -1.41), (56.00, 1.59), 4, 6.20, [('A-101', 4)])],
        'landings': [L(52.90, 1.59, 59.10, 2.59)],
        'rails': [('handrail', HANDRAIL, 'F0+'), ('handrail', 3.0, 'F0-')],
        'cut': {'FIRST': [box(52.90, -1.41, 59.10, 1.59)]},
        'text': [('A-422', '4 TR @ 12"= 4\'-0"'), ('A-422', 'CORRIDOR STAIR- SECTION')],
    },
    {   # A-422 A3/A5: 경사로 24'-0 1/2" @ 1:12, 98' → 100', 폭 ±6'-11", 서쪽 유리 가드(손잡이 감쌈), 동쪽 벽 손잡이
        'id': 'corr_ramp', 'name': 'Corridor Ramp', 'floor': 'FIRST', 'from': 'FIRST N', 'to': 'FIRST', 'kind': 'ramp',
        'finish': 'terrazzo', 'open': False, 'solid': True, 'src': 'A-422 A3, A5; A-101',
        'flights': [F((63.05, -9.60), (63.05, 14.50), 0, 6.90)],
        'landings': [L(59.60, 14.50, 66.50, 15.50)],
        'rails': [('glass', GUARD, 'F0-'), ('handrail', HANDRAIL, 'F0+')],
        'cut': {'FIRST': [box(59.60, -9.60, 66.50, 14.50)]},
        'text': [('A-422', '24\'-0 1/2"'), ('A-422', 'CORRIDOR RAMP- SECTION')],
    },
    {   # STAIR 002 (A-100) / STAIRS 126 (A-101): 85'-4" → 100'-0" 꺾인 계단. 상세 A-423 H1 은 세트에 없음 →
        # 평면 선에서: 아래 층계 10 단(동→서), 서쪽 계단참, 위 층계 16 단(서→동). 26 단 = 6.77"
        'id': 'stair126', 'name': 'Stair 002 / Stairs 126', 'floor': 'LOWER', 'from': 'LOWER', 'to': 'FIRST', 'kind': 'egress',
        'finish': 'concrete', 'open': False, 'solid': False, 'approx': True, 'src': 'A-100, A-101 (A-423 H1 not in set)',
        'flights': [F((159.68, 65.34), (151.35, 65.34), 10, 3.84, [('A-100', 7)]),
                    F((151.35, 61.25), (165.01, 61.25), 16, 4.02, [('A-101', 16)])],
        'landings': [L(147.35, 59.24, 151.35, 67.26)],
        'rails': [('handrail', HANDRAIL, 'F0+'), ('handrail', HANDRAIL, 'F0-'), ('handrail', HANDRAIL, 'L0:147.35,59.24,147.35,67.26'),
                  ('handrail', HANDRAIL, 'F1+'), ('metal', GUARD, 'F1-')],
        'cut': {'FIRST': [box(147.35, 59.24, 165.01, 67.26)]},
        'text': [],
    },
    {   # 자동차 실험실 동쪽 메자닌 철재 계단 (A-425 E5 금속 그레이팅 디딤판 + 체커 논슬립, A-425 C3 메자닌 난간 at 114'-8").
        # A-423 G1 상세 없음 → A-101/A-102 선: 16 챌판 @ 11" 간격 = 14'-8" (11" 챌판), 폭 3'-8"
        'id': 'mezz_stair', 'name': 'Mezzanine Stair', 'floor': 'FIRST', 'from': 'FIRST', 'to': 'SECOND', 'kind': 'service',
        'finish': 'grating', 'open': True, 'solid': False, 'approx': True, 'src': 'A-101, A-102, A-425 E5/C3 (A-423 G1 not in set)',
        'flights': [F((171.77, 72.425), (185.51, 72.425), 16, 3.67, [('A-102', 16)])],
        'landings': [L(185.51, 68.10, 224.10, 77.10)],    # 메자닌 바닥 (A-102: 37'-9 5/8" 난간 길이)
        'rails': [('metal', GUARD, 'F0+'), ('metal', GUARD, 'F0-'),
                  ('metal', GUARD, 'L0:186.30,77.10,224.10,77.10'), ('metal', GUARD, 'L0:185.51,74.26,185.51,77.10')],
        'cut': {},
        'text': [('A-425', 'METAL GRATING'), ('A-425', 'RAILING ELEV- MEZZANINE LEVEL')],
    },
]

# 엘리베이터 E1 (A-101/A-102 같은 위치): 승강로 안쪽, 동쪽 벽 문(3'-6"), 카. 1·2 층 정지 (A-100 은 기계실 004 만)
ELEVATORS = [{'id': 'E1', 'floors': ['FIRST', 'SECOND'], 'poly': L(48.90, 30.75, 58.50, 38.25),
              'door': [(58.90, 32.00), (58.90, 35.50)], 'cab': L(49.75, 31.55, 57.90, 36.95), 'src': 'A-101, A-102'}]

# FIRST 바닥의 낮은 영역 (A-301 A2/D2, A-421 G4/B7, A-422 C5): (이름, y, 대상 실 번호(None = 모두), 영역)
SUB_LEVELS = {'FIRST': [
    ('FIRST SW', -5.0, {'100', '101'}, box(-12, 29, 34.09, 91.07)),       # 로비·전실 95'-0"
    ('FIRST SW 97', -3.0, {'101', '102'}, box(-12, 94.08, 34.09, 140)),   # 로비 남쪽 단 + 102 (계단 2 위, 97'-0")
    ('FIRST N', -2.0, None, box(5.45, -76.5, 121.45, -1.41)),             # 북측 증축 98'-0"
]}

# 평면의 UP/DN 중 모델하지 않은 것 (시트, x, z, 이유)
UNMODELLED = [
    ('A-101', 50.8, 71.2, 'lobby ramps (A-421 B4/A4/A7, A-422 A1/B1/C1): several 1:12 ramps between 95/97/98\'-7"/100\', not modelled yet'),
    ('A-102', 170.9, 63.0, 'bridge access ramp 200D (A-422 C7/A7) to the skybridge, not modelled yet'),
    ('A-102', 100.2, 49.9, 'ship\'s ladder to the roof penthouse (A-102 note), out of interior scope'),
]


# ── 기하 ──
def _dir(fl):
    (ax, az), (bx, bz) = fl['a'], fl['b']
    Ln = math.hypot(bx - ax, bz - az)
    return (bx - ax) / Ln, (bz - az) / Ln, Ln


def side_pt(fl, p, side):
    """층계 중심선 위 점 p 를 폭 방향으로 이동. side +1 = 진행 방향 왼쪽(오른손 좌표 x→z 에서 (dz,-dx)), 0 = 중심"""
    dx, dz, _ = _dir(fl)
    o = side * fl['w'] / 2
    return p[0] + dz * o, p[1] - dx * o


def flight_rail(fl, side):
    a, b = side_pt(fl, fl['a'], side), side_pt(fl, fl['b'], side)
    if fl['risers']:
        r = (fl['y1'] - fl['y0']) / fl['risers']
        return [[a[0], fl['y0'] + r, a[1]], [b[0], fl['y1'], b[1]]]          # 디딤판 앞끝 선
    return [[a[0], fl['y0'], a[1]], [b[0], fl['y1'], b[1]]]


def build_stair(st):
    """사양 → JSON (flights 에 y0/y1, landings 에 y, rails 3D 점)"""
    y_from, y_to = LEVELS[st['from']], LEVELS[st['to']]
    fls = st['flights']
    n = sum(f['risers'] for f in fls)
    out = []
    y = y_from
    for f in fls:
        if f['risers']:
            y1 = y + (y_to - y_from) * f['risers'] / n
        else:
            y1 = y_to                                    # 경사로 하나뿐
        out.append({'a': [round(f['a'][0], 3), round(f['a'][1], 3)], 'b': [round(f['b'][0], 3), round(f['b'][1], 3)],
                    'w': f['w'], 'y0': round(y, 4), 'y1': round(y1, 4), 'risers': f['risers'],
                    'tread': round(math.dist(f['a'], f['b']) / (f['risers'] - 1), 4) if f['risers'] > 1 else None})
        y = y1
    # 계단참 높이: 끝나는 층계의 y1 과 맞는 것 — 사양 순서대로 flights 사이(마지막은 도착 바닥)
    lands = []
    for i, poly in enumerate(st['landings']):
        g = Polygon(poly)
        # 이 계단참에 닿는(1 ft 안) 층계 끝 중 가장 가까운 것의 높이
        best = None
        for f in out:
            for p, yy in ((f['b'], f['y1']), (f['a'], f['y0'])):
                dd = g.distance(Point(p))
                if best is None or dd < best[0] - 1e-6 or (abs(dd - best[0]) < 1e-6 and yy > best[1]):
                    best = (dd, yy)
        lands.append({'poly': [[round(x, 3), round(z, 3)] for x, z in poly], 'y': round(best[1], 4)})
    rails = []
    for kind, h, path in st['rails']:
        if path.startswith('F'):
            i, s = int(path[1]), path[2]
            pts = flight_rail(out[i], {'+': 1, '-': -1, 'c': 0}[s])
        elif path.startswith('L'):
            i, c = path[1:].split(':')
            x0, z0, x1, z1 = map(float, c.split(','))
            yy = lands[int(i)]['y']
            pts = [[x0, yy, z0], [x1, yy, z1]]
        else:                                            # 'Y:y:x0,z0,x1,z1'
            _, yy, c = path.split(':')
            x0, z0, x1, z1 = map(float, c.split(','))
            pts = [[x0, float(yy), z0], [x1, float(yy), z1]]
        rails.append({'pts': [[round(v, 3) for v in p] for p in pts], 'h': h, 'kind': kind})
    return {'id': st['id'], 'name': st['name'], 'kind': st['kind'], 'finish': st['finish'], 'open': st['open'],
            'solid': st['solid'], 'from': st['from'], 'to': st['to'], 'src': st['src'],
            **({'approx': True} if st.get('approx') else {}),
            'flights': out, 'landings': lands, 'rails': rails}


def stairs_for(floor):
    return [build_stair(s) for s in STAIRS if s['floor'] == floor]


def elevators_for(floor):
    return [{'id': e['id'], 'poly': [list(p) for p in e['poly']], 'door': [list(p) for p in e['door']],
             'cab': [list(p) for p in e['cab']], 'src': e['src']} for e in ELEVATORS if floor in e['floors']]


def cuts_for(floor):
    """그 층 바닥 마감·슬래브에서 뺄 계단 구멍 (shapely)"""
    g = [c for s in STAIRS for c in s.get('cut', {}).get(floor, [])]
    return unary_union(g) if g else None


def level_areas(floor, rooms):
    """[(이름, y, shapely 영역)] — rooms: [{'no', 'poly'(shapely)}]"""
    out = []
    for name, y, nos, reg in SUB_LEVELS.get(floor, []):
        parts = [r['poly'].intersection(reg) for r in rooms if (nos is None or r['no'] in nos)]
        g = unary_union([p for p in parts if not p.is_empty]) if parts else None
        if g is not None and not g.is_empty:
            out.append((name, y, g.buffer(0.05).buffer(-0.05)))
    return out


def _polys(g):
    return [p for p in getattr(g, 'geoms', [g]) if p.geom_type == 'Polygon' and p.area > 0.3]


def room_parts(poly, floor_y, cut, areas):
    """실 바닥 조각: 계단 구멍을 빼고 낮은 영역별로 나눔 → [(Polygon, y, base)] (base = 단차 블록 바닥, 없으면 None)"""
    g = poly.difference(cut) if cut is not None else poly
    out = []
    rest = g
    for name, y, A in areas:
        part = g.intersection(A)
        for p in _polys(part):
            out.append((p, y, None))
        rest = rest.difference(A)
    low = min([y for _, y, _ in areas], default=floor_y)
    near = unary_union([A for _, _, A in areas]).buffer(1.0) if areas else None
    for p in _polys(rest):
        out.append((p, floor_y, low if (near is not None and p.intersects(near)) else None))
    return out


# ── 도면 확인용 ──
_TITLE = re.compile(r'(LOBBY STAIR ?\d|N STAIR|CORRIDOR STAIR)')


def sheet_titles():
    """A-421/A-422 상세 제목에 나오는 계단 이름 → {'LOBBY STAIR 1', 'N STAIR', ...}"""
    out = set()
    for sh in ('A-421', 'A-422'):
        txt = Sheet(sheet_path(sh)).page.get_text()
        for m in _TITLE.finditer(txt.replace('\n', ' ')):
            t = m.group(1)
            t = re.sub(r'STAIR ?(\d)', r'STAIR \1', t)
            out.add(t)
    return sorted(out)


@lru_cache(None)
def _norm_text(sheet):
    return re.sub(r'\s+', '', Sheet(sheet_path(sheet)).page.get_text())


def sheet_has_text(sheet, txt):
    return re.sub(r'\s+', '', txt) in _norm_text(sheet)


def plan_arrows():
    """평면의 UP / DN 글자 → [(시트, 글자, x, z)] (건물 안)"""
    out = []
    for sh, fl in (('A-100', 'LOWER'), ('A-101', 'FIRST'), ('A-102', 'SECOND')):
        s = Sheet(sheet_path(sh)).fit_grid()
        O = building_outline(fl, 2)
        for t, X, Y, h, r in s.words:
            if t in ('UP', 'DN'):
                x, z = s.to_local(X, Y)
                if O.contains(Point(x, z)):
                    out.append((sh, t, x, z))
    return out


@lru_cache(None)
def _segments(sheet):
    s = Sheet(sheet_path(sheet)).fit_grid()
    seg = []
    for d in s.page.get_drawings():
        for it in d['items']:
            if it[0] == 'l':
                a, b = it[1] * s.M, it[2] * s.M
                seg.append((*s.to_local(a.x, a.y), *s.to_local(b.x, b.y)))
    return seg


def plan_riser_hits(sheet, st, i, tol=0.12):
    """사양 st 의 i 번 층계 챌판 위치 중 평면에 (폭의 40 % 넘게 겹치는) 수직 선이 있는 개수"""
    f = st['flights'][i]
    dx, dz, Ln = _dir(f)
    n = f['risers']
    ax, az = f['a']
    hits = 0
    segs = _segments(sheet)
    for k in range(n):
        s_k = Ln * k / (n - 1)
        ok = False
        for x0, z0, x1, z1 in segs:
            sl = math.hypot(x1 - x0, z1 - z0)
            if sl < 0.3 * f['w'] or abs((x1 - x0) * dx + (z1 - z0) * dz) > 0.05 * sl:
                continue
            mx, mz = (x0 + x1) / 2 - ax, (z0 + z1) / 2 - az
            if abs(mx * dx + mz * dz - s_k) > tol:
                continue
            # 폭 방향 겹침
            p0 = (x0 - ax) * dz - (z0 - az) * dx
            p1 = (x1 - ax) * dz - (z1 - az) * dx
            lo, hi = max(min(p0, p1), -f['w'] / 2), min(max(p0, p1), f['w'] / 2)
            if hi - lo > 0.4 * f['w']:
                ok = True
                break
        hits += ok
    return hits


def stair_zone(fy, H):
    """층 바닥 fy ~ fy+H 높이 범위를 지나는 계단의 발자국(층계 폭+0.6 ft, 계단참+0.6 ft).
    평면의 유리 난간(GL-13)·측판 선이 벽 추출에서 '유리 벽'으로 잡히므로 이 안의 벽은 버린다 (난간은 계단이 그린다)."""
    from shapely.geometry import LineString
    g = []
    for s in (build_stair(x) for x in STAIRS):
        for fl in s['flights']:
            if min(fl['y0'], fl['y1']) <= fy + H - 0.5 and max(fl['y0'], fl['y1']) >= fy - 0.5:
                g.append(LineString([fl['a'], fl['b']]).buffer(fl['w'] / 2 + 0.6, cap_style=2))
        for Ld in s['landings']:
            if fy - 0.5 <= Ld['y'] <= fy + H - 0.5:
                g.append(Polygon(Ld['poly']).buffer(0.6, join_style=2))
    return unary_union(g) if g else None
