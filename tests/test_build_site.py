import sys, pathlib, json
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / "tools"))
import build_site as bs


def test_road_width_table():
    assert bs.road_width({"highway": "primary"}) == 48
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
    assert len(site["buildings"]) > 350 and len(site["roads"]) > 500 and len(site["trees"]) > 500
    hul = next(b for b in site["buildings"] if b["id"] == "way/183426119")
    assert hul["detail"] == "drawing" and 30 < hul["h"] < 60 and len(hul["roof"]) == 3
    assert site["ground"]["tiles"] == 2 and site["ground"]["extent_ft"] == 4800
