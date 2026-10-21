import sys, pathlib, json
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / "tools"))
import build_site as bs


def test_road_width_table():
    assert bs.road_width({"highway": "primary"}) == 44
    assert bs.road_width({"highway": "residential"}) == 30
    assert bs.road_width({"highway": "footway"}) == 8
    assert bs.road_width({"highway": "service", "service": "parking_aisle"}) == 16
    assert bs.road_width({"landuse": "grass"}) is None


def test_classify_wall_by_facts_and_era():
    assert bs.classify_wall({"name": "Reeve Hall (West)", "year": "2014", "building": "residential", "notes": "brick with limestone trim"}) == "brick_red"
    assert bs.classify_wall({"name": "Chestnut Building", "year": "", "building": "yes", "notes": "dark glass/metal office block"}) == "glass"
    assert bs.classify_wall({"name": "Normal Hall", "year": "1909", "building": "university", "notes": "limestone; dome"}) == "limestone"
    assert bs.classify_wall({"name": "", "year": "", "building": "parking", "notes": ""}) == "precast"
    assert bs.classify_wall({"name": "Root Hall", "year": "1989", "building": "university", "notes": ""}) == "brick_brown"


def test_poly_orientation_and_closing():
    ring = [[-87.41, 39.471], [-87.409, 39.471], [-87.409, 39.472], [-87.41, 39.472], [-87.41, 39.471]]
    poly = bs.ring_to_local(ring)
    assert len(poly) == 4                      # closing point dropped
    assert bs.signed_area(poly) > 0            # CCW seen from above


def test_site_json_schema():
    site = json.load(open(pathlib.Path(__file__).resolve().parents[1] / "viewer/assets/site.json"))
    # 캠퍼스 구역(3rd–9th St, Tippecanoe–Cherry St)만 포함
    assert 80 <= len(site["buildings"]) <= 120 and len(site["roads"]) > 400 and len(site["trees"]) > 1000
    x0, z0, x1, z1 = site["clip"]
    for b in site["buildings"]:
        cx = sum(p[0] for p in b["poly"]) / len(b["poly"]); cz = sum(p[1] for p in b["poly"]) / len(b["poly"])
        assert x0 <= cx <= x1 and z0 <= cz <= z1
    hul = next(b for b in site["buildings"] if b["id"] == "way/183426119")
    assert hul["detail"] == "drawing" and len(hul["roof"]) == 3
    # 같은 수관에 중복된 나무가 없어야 함 (3 ft 이내 쌍 없음)
    import math
    T = sorted(site["trees"])
    assert all(math.dist(T[i][:2], T[i + 1][:2]) >= 3 for i in range(len(T) - 1))
