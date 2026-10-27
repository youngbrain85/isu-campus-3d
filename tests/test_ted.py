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
