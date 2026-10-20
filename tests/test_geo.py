import json, math, sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / "tools"))
import geo

def test_origin_maps_to_zero():
    assert geo.ll_to_xz(*geo.ORIGIN) == (0.0, 0.0)

def test_east_is_positive_x_and_south_is_positive_z():
    x, z = geo.ll_to_xz(39.4710, -87.4090)       # 0.001 deg east ≈ 282 ft
    assert 275 < x < 290 and abs(z) < 0.01
    x, z = geo.ll_to_xz(39.4700, -87.4100)       # 0.001 deg south ≈ 363 ft
    assert abs(x) < 0.01 and 355 < z < 370

def test_roundtrip():
    lat, lon = geo.xz_to_ll(*geo.ll_to_xz(39.4735, -87.4063))
    assert abs(lat - 39.4735) < 1e-9 and abs(lon + 87.4063) < 1e-9

def test_mosaic_pixel(tmp_path):
    b = {"zoom": 19, "north": 39.47754556963623, "south": 39.46429421569262,
         "west": -87.41889953613281, "east": -87.4017333984375, "width_px": 6400, "height_px": 6400}
    p = tmp_path / "b.json"; p.write_text(json.dumps(b))
    m = geo.MosaicBounds(p)
    assert m.px_of(b["north"], b["west"]) == (0.0, 0.0)
    col, row = m.px_of(b["south"], b["east"])
    assert abs(col - 6400) < 1e-6 and abs(row - 6400) < 1e-6
