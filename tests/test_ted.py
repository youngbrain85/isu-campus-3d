import sys, pathlib
import pytest
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / "tools"))
from ted.sheet import Sheet, sheet_path, ARCH

pytestmark = pytest.mark.skipif(not ARCH.exists(), reason="cTED drawings not available on this machine")


@pytest.mark.parametrize("sheet", ["A-100", "A-101", "A-102", "A-131", "A-132"])
def test_grid_fit(sheet):
    s = Sheet(sheet_path(sheet)).fit_grid()
    assert s.grid_residual_ft < 0.6
    assert abs(abs(s.ax) - 1 / 9) < 0.002          # 1/8" = 1'-0" → 9 pt/ft


# ── Task 3: 벽·문 ──
from ted.walls import wall_mask, wall_polys, find_doors, door_schedule, floor_of_mark
from ted.sheet import building_outline

_cache = {}


def _floor(sheet, floor):
    if (sheet, floor) not in _cache:
        s = Sheet(sheet_path(sheet)).fit_grid()
        m, o, _ = wall_mask(s, with_image=False, clip=building_outline(floor, 3))
        _cache[(sheet, floor)] = (s, m, o)
    return _cache[(sheet, floor)]


def test_wall_mask_covers_e15_exterior_wall():
    s, m, (x0, z0) = _floor('A-101', 'FIRST')
    c = int((228 - x0) / 0.125)
    rows = range(int((70 - z0) / 0.125), int((134 - z0) / 0.125))
    # E15 (x≈228) 의 벽 띠가 z 70..134 의 대부분(오버헤드 도어 제외)에서 ±1.5 ft 안에 있다
    hit = sum(m[r, c - 12:c + 13].any() for r in rows)
    assert hit / len(rows) > 0.9


def test_wall_mask_dyno_partitions():
    # DYNO 133/133A/135 칸막이 (x 131, 141, 151 부근, z 127..136)
    s, m, (x0, z0) = _floor('A-101', 'FIRST')
    for x in (130.9, 140.9, 150.9):
        c = int((x - x0) / 0.125)
        assert m[int((131 - z0) / 0.125), c - 4:c + 5].any(), x


def test_wall_polys_area():
    s, m, o = _floor('A-101', 'FIRST')
    P = wall_polys(m, o)
    assert 2500 < sum(p.area for p in P) < 4500
    assert all(p.is_valid for p in P)


@pytest.mark.parametrize("sheet,floor", [("A-101", "FIRST"), ("A-102", "SECOND")])
def test_door_count_matches_schedule(sheet, floor):
    sch = door_schedule()
    marks = [k for k in sch if floor_of_mark(k) == floor]
    s, m, o = _floor(sheet, floor)
    doors = find_doors(s, sch, floor, m, o)
    assert abs(len(doors) - len(marks)) <= 0.1 * len(marks), (len(doors), len(marks))
    tagged = {d.get('tag') for d in doors}
    assert len(set(marks) & tagged) >= 0.95 * len(marks)


# ── Task 2: 방 ──
from ted.rooms import find_rooms, room_labels
from shapely.geometry import Point


def _rooms(sheet, floor):
    key = ('rooms', sheet, floor)
    if key not in _cache:
        s, m, o = _floor(sheet, floor)
        doors = find_doors(s, door_schedule(), floor, m, o)
        _cache[key] = find_rooms(s, m, o, doors=doors, outline=building_outline(floor, 2))
    return _cache[key]


@pytest.mark.parametrize("sheet,floor,lo,hi", [("A-101", "FIRST", 40, 80), ("A-102", "SECOND", 38, 90)])
def test_room_counts(sheet, floor, lo, hi):
    R = _rooms(sheet, floor)
    labeled = [r for r in R if r['number']]
    assert len(labeled) >= lo and len(R) <= hi, (len(labeled), len(R))
    # 평면의 방 번호 라벨은 모두 방이 된다
    s = _floor(sheet, floor)[0]
    L = room_labels(s, building_outline(floor, 2))
    assert len(labeled) == len(L)


@pytest.mark.parametrize("sheet,floor", [("A-101", "FIRST"), ("A-102", "SECOND")])
def test_room_polygons_closed_inside_outline(sheet, floor):
    out = building_outline(floor, 2.01)
    for r in _rooms(sheet, floor):
        g = r['poly']
        assert g.is_valid and g.geom_type == 'Polygon'
        assert g.exterior.is_closed
        assert g.area > 8
        assert out.contains(g), r['number']


def test_lobby_contains_label():
    R = {r['number']: r for r in _rooms('A-101', 'FIRST')}
    assert R['101']['name'] == 'LOBBY'
    assert R['101']['poly'].contains(Point(R['101']['label_xy']))
    assert 'AUTOMOTIVE' in R['127']['name']


def test_room_areas_match_labels_second_floor():
    # A-102 는 방마다 '1234 SF' 면적 글자가 있다 → 열린 평면(복도·브레이크아웃) 말고는 ±20 % 안이어야
    R = [r for r in _rooms('A-102', 'SECOND') if r['area_label']]
    ok = [r for r in R if abs(r['area_ft2'] / r['area_label'] - 1) <= 0.2]
    assert len(ok) >= 0.6 * len(R), (len(ok), len(R))


def test_enclosure_124c_is_a_room():
    R = {r['number']: r for r in _rooms('A-101', 'FIRST')}
    assert '124C' in R and 250 < R['124C']['area_ft2'] < 400


@pytest.mark.parametrize("sheet,floor", [("A-101", "FIRST"), ("A-102", "SECOND")])
def test_room_boundaries_axis_aligned(sheet, floor):
    # 열린 평면 분할은 축에 나란한 직선만 — 4 ft 넘는 비스듬한 변은 실제 사선 벽(스카이브리지)뿐
    import math
    bad = []
    for r in _rooms(sheet, floor):
        if r['number'] == '250':
            continue
        c = list(r['poly'].exterior.coords)
        for a, b in zip(c, c[1:]):
            ang = math.degrees(math.atan2(b[1] - a[1], b[0] - a[0])) % 90
            if math.dist(a, b) > 4 and 3 < ang < 87:
                bad.append((r['number'], a, b))
    assert len(bad) <= 2, bad


# ── Task 4: 마감·천장 ──
from ted.finishes import finish_schedule, room_finishes, room_ceilings, ceiling_lights


def test_finish_schedule_decoded():
    sch = finish_schedule()
    assert len(sch) > 60
    assert sch['PT-02']['color'] == [88, 87, 85]           # SW7674 Peppercorn
    assert 'TECHZONE' in sch['ACT-02']['desc']
    assert sch['CPT-01']['type'] == 'carpet tile'


@pytest.mark.parametrize("plan,fin,floor", [("A-101", "A-151", "FIRST"), ("A-102", "A-152", "SECOND")])
def test_room_floor_finishes_in_schedule(plan, fin, floor):
    sch = finish_schedule()
    s = _floor(plan, floor)[0]
    R = _rooms(plan, floor)
    F = room_finishes(Sheet(sheet_path(fin)), s, R)
    labeled = [r['number'] for r in R if r['number']]
    assert len([n for n in labeled if n in F]) >= 0.7 * len(labeled)
    for n, f in F.items():
        assert f['floor'] in sch or f['floor'] == 'ETR', (n, f)


@pytest.mark.parametrize("plan,rcp,floor", [("A-101", "A-131", "FIRST"), ("A-102", "A-132", "SECOND")])
def test_ceiling_heights_and_lights(plan, rcp, floor):
    R = _rooms(plan, floor)
    r = Sheet(sheet_path(rcp)).fit_grid()
    C = room_ceilings(r, R)
    hs = [c['h'] for c in C.values() if c['h']]
    assert len(C) >= 0.7 * len([x for x in R if x['number']])
    assert hs and all(6.5 <= h <= 30 for h in hs)
    s, m, o = _floor(plan, floor)
    L = ceiling_lights(r, m, o, outline=building_outline(floor))
    assert len(L) > 50


# ── Task 5: JSON ──
import json
from shapely.geometry import Polygon

JSON_PATH = pathlib.Path(__file__).resolve().parents[1] / 'viewer' / 'assets' / 'ted_interior.json'


@pytest.fixture(scope='module')
def ted_json():
    if not JSON_PATH.exists():
        pytest.skip('run tools/ted/build.py first')
    return json.loads(JSON_PATH.read_text(encoding='utf-8'))


def test_json_schema(ted_json):
    d = ted_json
    assert {'frame', 'materials', 'floors'} <= d.keys()
    assert [f['name'] for f in d['floors']] == ['LOWER', 'FIRST', 'SECOND']
    for f in d['floors']:
        assert {'name', 'y', 'height', 'walls', 'doors', 'rooms', 'lights', 'stairs', 'partition_tags'} <= f.keys()
        for w in f['walls']:
            assert {'poly', 'h', 'glass'} <= w.keys() and len(w['poly']) >= 3 and 6 < w['h'] <= 15
        for dr in f['doors']:
            assert {'a', 'b', 'kind', 'w', 'h'} <= dr.keys()
        for r in f['rooms']:
            assert {'no', 'name', 'poly', 'area', 'floor', 'base', 'wall', 'ceiling', 'ch'} <= r.keys()
            assert 6.5 <= r['ch'] <= 30
            for c in [r['floor'], r['base'], r['ceiling'], *r['wall']]:
                assert c is None or c in d['materials']
        for l in f['lights']:
            assert len(l) == 4
    assert all(len(m['color']) == 3 for m in d['materials'].values())


@pytest.mark.parametrize("i,floor", [(1, 'FIRST'), (2, 'SECOND')])
def test_json_rooms_inside_outline_and_doors(ted_json, i, floor):
    f = ted_json['floors'][i]
    out = building_outline(floor, 2.01)
    for r in f['rooms']:
        assert out.contains(Polygon(r['poly'])), r['no']
    st = f['stats']
    assert abs(st['doors'] - st['door_marks_in_schedule']) <= 0.1 * st['door_marks_in_schedule']


def test_json_first_floor_room_numbers(ted_json):
    nums = {r['no'] for r in ted_json['floors'][1]['rooms']}
    for n in ('100', '101', '102', '104A', '109A', '124C', '127', '136', '145', '146', '147', '148'):
        assert n in nums


# ── Task 7: 계단·엘리베이터 ──
import math as _math

LEVEL_Y = {'LOWER': -14.67, 'FIRST SW': -5.0, 'FIRST SW 97': -3.0, 'FIRST N': -2.0, 'FIRST': 0.0, 'SECOND': 14.67}


def _all_stairs(d):
    return [(f, s) for f in d['floors'] for s in f.get('stairs', [])]


def test_stairs_inventory(ted_json):
    # A-421/A-422 상세 제목 + 평면 실명(STAIR 002 / STAIRS 126) + 메자닌 계단 → 모두 모델에 있고, 시작 층에 속한다
    ids = {s['id']: f['name'] for f, s in _all_stairs(ted_json)}
    want = {'lobby1': 'FIRST', 'lobby1_seat': 'FIRST', 'lobby2': 'FIRST', 'lobby3': 'FIRST', 'n_stair': 'FIRST',
            'corr_stair': 'FIRST', 'corr_ramp': 'FIRST', 'stair126': 'LOWER', 'mezz_stair': 'FIRST'}
    for k, fl in want.items():
        assert ids.get(k) == fl, (k, ids.get(k))


def test_stair_titles_on_sheets_are_modelled(ted_json):
    from ted.stairs import sheet_titles
    names = ' '.join(s['name'].upper() for _, s in _all_stairs(ted_json))
    T = sheet_titles()                   # 'LOBBY STAIR 1', 'N STAIR', 'CORRIDOR STAIR', ...
    assert len(T) >= 5
    for t in T:
        assert t in names, t


def test_every_plan_up_dn_is_a_modelled_stair(ted_json):
    # 평면 A-100/101/102 의 UP/DN 글자는 (제외 목록 말고는) 모델 계단·경사로 발자국에서 4 ft 안
    from ted.stairs import plan_arrows, UNMODELLED
    from shapely.geometry import Point, box
    from shapely.ops import unary_union
    foot = []
    for f, s in _all_stairs(ted_json):
        for fl in s['flights']:
            (ax, az), (bx, bz), w = fl['a'], fl['b'], fl['w']
            foot.append(box(min(ax, bx), min(az, bz), max(ax, bx), max(az, bz)).buffer(w / 2))
    F = unary_union(foot)
    arrows = plan_arrows()
    assert len(arrows) >= 15
    miss = []
    for sheet, t, x, z in arrows:
        if any(sheet == us and abs(x - ux) < 3 and abs(z - uz) < 3 for us, ux, uz, _ in UNMODELLED):
            continue
        if F.distance(Point(x, z)) > 4:
            miss.append((sheet, t, round(x, 1), round(z, 1)))
    assert not miss, miss


def test_riser_heights(ted_json):
    for f, s in _all_stairs(ted_json):
        for fl in s['flights']:
            if not fl['risers']:
                continue                                    # 경사로
            r = (fl['y1'] - fl['y0']) / fl['risers'] * 12
            if s.get('kind') == 'egress':
                assert 6.5 <= r <= 7.75, (s['id'], r)      # 피난 계단: 6.5"~7.75"
            elif s.get('kind') == 'service':
                assert 10.5 <= r <= 11.5, (s['id'], r)      # 메자닌 철재 계단 11"
            elif s.get('kind') == 'seating':
                assert 14 <= r <= 16, (s['id'], r)          # 목재 좌석 단
            else:
                assert 5.5 <= r <= 7.75, (s['id'], r)       # 로비 기념 계단: 도면 5.87"·6"


def test_known_riser_counts(ted_json):
    S = {s['id']: s for _, s in _all_stairs(ted_json)}
    cnt = lambda k: [fl['risers'] for fl in S[k]['flights']]
    assert cnt('lobby3') == [9, 10, 11]                 # A-421 A1: 9/10/11 EQ R
    assert cnt('n_stair') == [10, 10, 10]               # A-422 E1: 10 EQUAL RISERS ×3
    assert cnt('lobby1') == [5, 5]                      # A-421 G4: 5 EQ R ×2
    assert cnt('lobby2') == [4] and cnt('corr_stair') == [4]
    assert abs(S['lobby3']['flights'][0]['y1'] * 12 / 9 - 5.867) < 0.01


def test_flights_connect_levels(ted_json):
    for f, s in _all_stairs(ted_json):
        fls = s['flights']
        assert abs(fls[0]['y0'] - LEVEL_Y[s['from']]) < 0.1, s['id']
        assert abs(fls[-1]['y1'] - LEVEL_Y[s['to']]) < 0.1, s['id']
        if s['from'] == f['name']:
            assert abs(fls[0]['y0'] - f['y']) < 0.1
        for p, q in zip(fls, fls[1:]):
            assert abs(p['y1'] - q['y0']) < 0.01, s['id']
            assert any(abs(L['y'] - p['y1']) < 0.01 for L in s['landings']), s['id']   # 계단참이 잇는다
        for fl in fls:
            if fl['risers'] > 1:
                L = _math.dist(fl['a'], fl['b']) / (fl['risers'] - 1)
                assert 0.8 <= L <= 2.6, (s['id'], L)                                  # 디딤판 깊이


def test_flights_match_plan_riser_lines():
    # 사양의 챌판 위치가 평면(A-100/101/102) 선과 일치 (평면에 보이는 만큼)
    from ted.stairs import STAIRS, plan_riser_hits
    n = 0
    for st in STAIRS:
        for i, fl in enumerate(st['flights']):
            for sheet, need in fl.get('check', []):
                hit = plan_riser_hits(sheet, st, i)
                assert hit >= need, (st['id'], i, sheet, hit, need)
                n += 1
    assert n >= 10


def test_stair_dimension_text_on_sheets():
    from ted.stairs import STAIRS, sheet_has_text
    n = 0
    for st in STAIRS:
        for sheet, txt in st.get('text', []):
            assert sheet_has_text(sheet, txt), (st['id'], sheet, txt)
            n += 1
    assert n >= 8


def test_rails_and_landings(ted_json):
    for f, s in _all_stairs(ted_json):
        assert s['rails'], s['id']
        for r in s['rails']:
            assert len(r['pts']) >= 2 and all(len(p) == 3 for p in r['pts'])
            assert 2.5 <= r['h'] <= 3.6 and r['kind'] in ('glass', 'metal', 'handrail')
        for L in s['landings']:
            assert len(L['poly']) >= 3


def test_elevator(ted_json):
    E = {f['name']: f.get('elevators', []) for f in ted_json['floors']}
    assert len(E['FIRST']) == 1 and len(E['SECOND']) == 1
    e = E['FIRST'][0]
    xs = [p[0] for p in e['poly']]; zs = [p[1] for p in e['poly']]
    assert 47 < min(xs) < 50 and 57 < max(xs) < 60 and 29 < min(zs) < 32 and 37 < max(zs) < 40
    (ax, az), (bx, bz) = e['door']
    assert abs(ax - bx) < 0.5 and 3 < abs(az - bz) < 4.5        # 동쪽 벽 3'-6" 문


def test_floor_cut_over_stairs(ted_json):
    # 위층 바닥 마감이 계단 구멍을 덮지 않는다
    from shapely.geometry import Point, Polygon
    def covered(fl, x, z):
        for r in fl['rooms']:
            if r.get('open'):
                continue
            for p in r.get('parts') or [{'poly': r['poly'], 'holes': []}]:
                g = Polygon(p['poly'], p.get('holes', []))
                if g.is_valid and g.contains(Point(x, z)):
                    return True
        return False
    F = {f['name']: f for f in ted_json['floors']}
    assert not covered(F['SECOND'], 85, -20.9)       # N 계단 중간 계단참 위
    assert not covered(F['FIRST'], 158, 61.2)        # 126 계단 위
    assert not covered(F['FIRST'], 40, 52)           # 로비 계단 1
    assert covered(F['SECOND'], 85, -30)              # 옆 브레이크아웃 바닥은 그대로


def test_sub_levels(ted_json):
    # 로비(95'), 남측 단(97'), 북측 증축(98') 바닥은 실제 높이에
    F = {f['name']: f for f in ted_json['floors']}
    lv = {L['name']: L['y'] for L in F['FIRST']['levels']}
    assert lv == {'FIRST SW': -5.0, 'FIRST SW 97': -3.0, 'FIRST N': -2.0}
    R = {r['no']: r for r in F['FIRST']['rooms']}
    ys = {round(p['y'], 2) for p in R['101']['parts']}
    assert -5.0 in ys and 0.0 in ys
    assert {round(p['y'], 2) for p in R['148']['parts']} >= {-2.0}


# ── 2 단계: 장비·캐비닛·위생기구·가구 ──
import re as _re
from shapely.geometry import Point as _Pt, Polygon as _Pg
from shapely.ops import unary_union as _union
from ted.equipment import equipment_schedule, rect_poly, TAG_RE as _TAG_RE

_EQ_SHEETS = {'FIRST': 'A-701', 'SECOND': 'A-702'}


def test_equipment_schedule_parse():
    s = equipment_schedule()
    assert s['E082X']['desc'] == '4 POST LIFT' and s['E082X']['mount'] == 'FLOOR'
    assert s['E087']['cls'] == 'ROBOTICS'
    assert 'REFRIGERATION' in s['E008']['desc']
    assert len(s) > 120


@pytest.mark.parametrize('floor', ['FIRST', 'SECOND'])
def test_equipment_count_matches_sheet_tags(ted_json, floor):
    """A-701/702 의 장비 태그 글자 수와 태그 달린 장비 항목 수가 ±5 % 안"""
    s = Sheet(sheet_path(_EQ_SHEETS[floor]))
    tags = [t for t, x, y, h, r in s.words if _TAG_RE.match(t) and abs(h - 9.6) < 0.5]
    f = next(f for f in ted_json['floors'] if f['name'] == floor)
    n = sum(1 for e in f['equipment'] if e.get('tag'))
    assert len(tags) > 40
    assert abs(n - len(tags)) <= 0.05 * len(tags), (n, len(tags))


def _items(f):
    for k in ('equipment', 'casework', 'fixtures', 'furniture'):
        for it in f.get(k, []):
            yield k, it


def test_contents_inside_rooms(ted_json):
    bad = []
    for f in ted_json['floors']:
        rooms = {r['no']: _Pg(r['poly']).buffer(0.05) for r in f['rooms'] if r['no']}
        for k, it in _items(f):
            p = _Pt(it['x'], it['z'])
            if it.get('room') not in rooms or not rooms[it['room']].contains(p):
                bad.append((f['name'], k, it['type'], it.get('room'), it['x'], it['z']))
    assert not bad, bad[:10]


def test_contents_clear_of_walls(ted_json):
    """항목 발자국이 벽 다각형에 0.3 ft 넘게 파고들지 않는다 (발자국을 0.3 ft 줄이면 벽과 안 겹침)"""
    bad = []
    for f in ted_json['floors']:
        W = _union([_Pg(w['poly'], w.get('holes') or []).buffer(0) for w in f['walls']])
        for k, it in _items(f):
            g = rect_poly(it).buffer(-0.3, join_style=2)
            if not g.is_empty and g.intersects(W):
                bad.append((f['name'], k, it['type'], it.get('room'), round(it['x'], 1), round(it['z'], 1)))
    assert not bad, bad[:10]


def test_estimated_flag_on_non_drawing_furniture(ted_json):
    est, drawn = 0, 0
    for f in ted_json['floors']:
        est_rooms = {r['no'] for r in f['rooms'] if r.get('furniture_estimated')}
        for it in f.get('furniture', []):
            if it.get('src') == 'estimated layout':
                assert it.get('estimated') is True
                assert it['room'] in est_rooms
                est += 1
            else:
                assert not it.get('estimated') and _re.match(r'A-70[12]$', it.get('src', '')), it
                drawn += 1
        for k in ('equipment', 'casework', 'fixtures'):
            assert not any(it.get('estimated') for it in f.get(k, []))
    assert est > 0 and drawn > 1000


def test_casework_and_wall_items(ted_json):
    f1 = next(f for f in ted_json['floors'] if f['name'] == 'FIRST')
    cw = f1['casework']
    for room in ('106', '107', '108'):                  # 기계·토목 실험실 아일랜드 (A-501 G/E/D 입면)
        assert any(c['type'] == 'base_cabinet' and c['room'] == room and c['w'] > 12 for c in cw), room
    assert sum(1 for c in cw if c['type'] == 'marker_board') == 4          # A-501 F1 + C5 VDS-01
    assert sum(1 for c in cw if c['type'] == 'wall_monitor' and c['room'] == '145') == 4   # A-501 B1 + B3
    assert all(abs(c['h'] - 2.93) < 0.01 for c in cw if c['type'] == 'base_cabinet')


def test_restroom_fixtures(ted_json):
    fx = {f['name']: f['fixtures'] for f in ted_json['floors']}
    cnt = lambda fl, room, t: sum(1 for x in fx[fl] if x['room'] == room and x['type'] == t)
    assert cnt('FIRST', '120', 'toilet') == 2 and cnt('FIRST', '120', 'urinal') == 2 and cnt('FIRST', '120', 'lavatory') == 3
    assert cnt('FIRST', '121', 'toilet') == 4 and cnt('FIRST', '121', 'lavatory') == 3
    assert cnt('SECOND', '240', 'toilet') == 3 and cnt('SECOND', '241', 'urinal') == 2
