# ISU Campus 3D Model Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Three.js campus viewer, GLB and renders described in `docs/superpowers/specs/2026-10-20-isu-campus-3d-design.md`.

**Architecture:** Python tools turn OSM + imagery + buildings.csv into `viewer/assets/site.json`, ground tiles and procedural textures. `viewer/app.js` builds the scene from `site.json` (ground, roads, areas, trees, extruded mass buildings) and calls one ES module per drawing-based building (`viewer/buildings/*.js`). Playwright renders presets and exports the GLB.

**Tech Stack:** Python 3.9 (numpy, Pillow, scipy, shapely, PyMuPDF), Three.js 0.170.0 from jsDelivr (importmap), Node 22 + Playwright (local chromium), gh CLI.

## Global Constraints

- Units feet, world X = east, Y = up, Z = south; origin lat 39.4710 / lon −87.4100; ground plane y = 0.
- UI text English. Code comments Korean (CLAUDE.md), identifiers English.
- Drawings folder `D:\Projects\Drawings\ISU Files` is read-only; never copy drawings into the repo. Render pages to the session scratchpad only.
- Files > 100 MB never enter git (GitHub Release assets instead). `data/imagery/esri_z20.png` is git-ignored (Release `data-v1`).
- Three.js r170 ES modules via jsDelivr CDN in `viewer/index.html`; `index_local.html` uses `./node_modules/three/`.
- Windows console is cp949: every Python script prints only ASCII or calls `sys.stdout.reconfigure(encoding="utf-8")`.
- Commit after each task; push after each stage (site+mass+viewer, each detailed building, viewer/deploy).
- Reference implementation to copy patterns from: `D:\Projects\white-oak-lake-dams-3d` (`viewer/app.js`, `tools/*`).

---

## File structure

| Path | Responsibility |
|---|---|
| `tools/geo.py` | lat/lon ↔ local feet, Web-Mercator pixel maths (shared by tools and tests) |
| `tools/build_site.py` | OSM + buildings.csv + imagery → `viewer/assets/site.json`, `ground_*.jpg`, roof colours, imagery trees |
| `tools/gen_textures.py` | procedural tileable textures into `viewer/assets/` |
| `tools/fit_footprint.py` | rigid fit of a drawing outline to an OSM footprint → anchor, rotation, residual |
| `tools/render_sheet.py` | render a drawing page / clip to PNG in the scratchpad at given dpi (modelling aid) |
| `tools/build.py`, `tools/index_template.html` | produce `viewer/index.html`, `index_local.html`, `index_artifact.html` |
| `tools/shot.mjs` | Playwright headless renders + GLB export |
| `tests/test_geo.py`, `tests/test_build_site.py`, `tests/test_fit_footprint.py` | pytest unit tests for the Python tools |
| `viewer/lib/geom.js` | geometry helpers (extrude polygon with per-wall UVs, wall with openings, box, cylinder, roof) |
| `viewer/lib/materials.js` | material library built from the texture assets |
| `viewer/lib/ground.js` | ground tiles, roads, parking/grass areas |
| `viewer/lib/mass.js` | mass buildings from `site.json` |
| `viewer/lib/trees.js` | instanced tree sprites |
| `viewer/lib/labels.js` | building-name sprites |
| `viewer/buildings/index.js` | registry of detailed-building modules |
| `viewer/buildings/<name>.js` | one module per detailed building |
| `viewer/app.js` | scene assembly, presets, HUD wiring, GLB export |
| `package.json` | playwright + http-server dev dependencies |
| `README.md`, `index.html` (root redirect) | docs and Pages entry |

---

### Task 1: Geo helpers and project scaffolding

**Files:**
- Create: `tools/geo.py`, `tests/test_geo.py`, `package.json`, `viewer/assets/.gitkeep`
- Modify: `.gitignore` (add `viewer/node_modules/`, `shots/`)

**Interfaces:**
- Produces: `geo.ORIGIN = (39.4710, -87.4100)`; `geo.ll_to_xz(lat, lon) -> (x_ft, z_ft)`; `geo.xz_to_ll(x, z) -> (lat, lon)`; `geo.merc_px(lat, lon, zoom) -> (px, py)` (global tile pixels); `geo.MosaicBounds(json_path)` with `.px_of(lat, lon) -> (col, row)` for a stitched mosaic.

- [ ] **Step 1: Write the failing tests**

```python
# tests/test_geo.py
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `python -m pytest tests/test_geo.py -q`
Expected: FAIL with `ModuleNotFoundError: No module named 'geo'`

- [ ] **Step 3: Implement `tools/geo.py`**

```python
#!/usr/bin/env python3
"""위경도 ↔ 로컬 평면(피트) 변환과 Web-Mercator 타일 픽셀 계산. 원점은 캠퍼스 중심."""
import json, math

ORIGIN = (39.4710, -87.4100)          # (lat, lon)
FT_PER_M = 3.28083989501312
M_PER_DEG_LAT = 110540.0
M_PER_DEG_LON = 111320.0 * math.cos(math.radians(ORIGIN[0]))

def ll_to_xz(lat, lon):
    """(lat, lon) → (x east ft, z south ft)"""
    x = (lon - ORIGIN[1]) * M_PER_DEG_LON * FT_PER_M
    z = -(lat - ORIGIN[0]) * M_PER_DEG_LAT * FT_PER_M
    return (x, z)

def xz_to_ll(x, z):
    lon = ORIGIN[1] + x / FT_PER_M / M_PER_DEG_LON
    lat = ORIGIN[0] - z / FT_PER_M / M_PER_DEG_LAT
    return (lat, lon)

def merc_px(lat, lon, zoom):
    """전역 Web-Mercator 픽셀 좌표 (256px 타일 기준)"""
    n = 2 ** zoom * 256
    px = (lon + 180.0) / 360.0 * n
    py = (1 - math.log(math.tan(math.radians(lat)) + 1 / math.cos(math.radians(lat))) / math.pi) / 2 * n
    return (px, py)

class MosaicBounds:
    """collect_isu_data.py 가 저장한 bounds JSON 으로 모자이크 픽셀 위치를 계산"""
    def __init__(self, path):
        b = json.load(open(path))
        self.zoom = b["zoom"]; self.w = b["width_px"]; self.h = b["height_px"]
        self.x0, self.y0 = merc_px(b["north"], b["west"], self.zoom)
        self.x1, self.y1 = merc_px(b["south"], b["east"], self.zoom)
        self.north, self.south, self.west, self.east = b["north"], b["south"], b["west"], b["east"]
    def px_of(self, lat, lon):
        px, py = merc_px(lat, lon, self.zoom)
        return ((px - self.x0) / (self.x1 - self.x0) * self.w, (py - self.y0) / (self.y1 - self.y0) * self.h)
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `python -m pytest tests/test_geo.py -q`
Expected: `4 passed`

- [ ] **Step 5: Scaffolding**

`package.json`:
```json
{ "name": "isu-campus-3d", "private": true, "version": "0.1.0",
  "scripts": { "serve": "http-server viewer -p 8765 -s -c-1", "shot": "node tools/shot.mjs" },
  "devDependencies": { "playwright": "^1.50.0", "http-server": "^14.1.1", "three": "0.170.0" } }
```
Run `npm install` (installs three locally for `index_local.html` and Playwright; if `npx playwright install chromium` is needed the shot script will say so). Add `node_modules/` (already), `shots/` to `.gitignore`. Create empty `viewer/assets/.gitkeep`.

- [ ] **Step 6: Commit**

```bash
git add tools/geo.py tests/test_geo.py package.json package-lock.json .gitignore viewer/assets/.gitkeep
git commit -m "Geo helpers, tests and node scaffolding"
```

---

### Task 2: `tools/build_site.py` – site.json, ground tiles, trees

**Files:**
- Create: `tools/build_site.py`, `tests/test_build_site.py`
- Reads: `data/osm_buildings.geojson`, `data/osm_roads_etc.geojson`, `data/buildings.csv`, `data/imagery/esri_z19.{png,json}` (+ `esri_z20.*` when present)
- Writes: `viewer/assets/site.json`, `viewer/assets/ground_{r}_{c}.jpg` (2×2), `viewer/assets/trees.json`

**Interfaces:**
- Consumes: `geo.ll_to_xz`, `geo.MosaicBounds`
- Produces `site.json`:
```
{ "origin": [39.4710, -87.4100],
  "ground": { "extent_ft": 4800, "tiles": 2, "tile_px": 4096, "px_per_ft": 1.7067 },
  "buildings": [ { "id": "way/183426119", "name": "Hulman Center", "poly": [[x,z],...], "holes": [[[x,z],...]],
                   "h": 42.7, "levels": 3, "roof": [r,g,b], "wall": "brick_red", "detail": "drawing", "roof_shape": "flat" } ],
  "roads": [ { "pts": [[x,z],...], "w": 30.0, "kind": "road" } ],   # kind: road | path
  "areas": [ { "poly": [[x,z],...], "kind": "parking" } ],           # parking | grass | pitch | water | wood
  "trees": [ [x, z, height_ft, variant0to2, source0osm1img], ... ] }
```
Polygons are in local feet, outer ring counter-clockwise when viewed from above (x east, z south), closing point removed. Ground tile `ground_{r}_{c}.jpg` covers x ∈ [−2400 + c·2400, …], z ∈ [−2400 + r·2400, …]; pixel (0,0) is the north-west corner.
- Functions: `load_buildings(csv_path, geojson_path) -> list[dict]`; `classify_wall(row) -> str` (`brick_red|brick_brown|brick_tan|limestone|precast|metal|glass|concrete`); `roof_colour(mosaic, img, poly_ll) -> [r,g,b]`; `road_width(tags) -> float|None`; `ground_tiles(mosaic_png, bounds_json, extent, tiles, tile_px, out_dir)`; `imagery_trees(img, mosaic, building_polys, spacing_ft=25) -> list`.

- [ ] **Step 1: Write the failing tests**

```python
# tests/test_build_site.py
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
    assert bs.signed_area(poly) > 0            # CCW seen from above (x east, z south ⇒ area formula on (x, -z))

def test_site_json_schema():
    site = json.load(open(pathlib.Path(__file__).resolve().parents[1] / "viewer/assets/site.json"))
    assert len(site["buildings"]) > 350 and len(site["roads"]) > 500 and len(site["trees"]) > 500
    hul = next(b for b in site["buildings"] if b["id"] == "way/183426119")
    assert hul["detail"] == "drawing" and 30 < hul["h"] < 60 and len(hul["roof"]) == 3
    assert site["ground"]["tiles"] == 2 and site["ground"]["extent_ft"] == 4800
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `python -m pytest tests/test_build_site.py -q`
Expected: FAIL with `ModuleNotFoundError: No module named 'build_site'`

- [ ] **Step 3: Implement `tools/build_site.py`**

```python
#!/usr/bin/env python3
"""OSM + buildings.csv + Esri 모자이크 → viewer/assets/site.json, ground 타일, 수목 목록."""
import csv, json, math, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
sys.stdout.reconfigure(encoding="utf-8")
sys.path.insert(0, str(Path(__file__).resolve().parent))
import geo
Image.MAX_IMAGE_PIXELS = None

ROOT = Path(__file__).resolve().parent.parent
DATA, OUT = ROOT / "data", ROOT / "viewer" / "assets"
EXTENT, TILES, TILE_PX = 4800, 2, 4096           # 지면 4800 ft 정사각형, 2×2 타일

ROAD_W = {"trunk": 48, "primary": 48, "secondary": 40, "tertiary": 36, "residential": 30, "unclassified": 26,
          "service": 20, "living_street": 24, "footway": 8, "cycleway": 8, "path": 6, "pedestrian": 12, "steps": 6}

def road_width(tags):
    hw = tags.get("highway")
    if hw not in ROAD_W: return None
    if hw == "service" and tags.get("service") in ("parking_aisle", "driveway"): return 16
    return float(ROAD_W[hw])

def classify_wall(row):
    """벽 재질 분류: facts 메모 → 용도 → 연대 순으로 판단"""
    n = (row.get("notes", "") + " " + row.get("name", "")).lower()
    if "glass" in n or "curtain" in n or "metal" in n: return "glass" if "glass" in n else "metal"
    if "limestone" in n and "brick" not in n: return "limestone"
    if "precast" in n or row.get("building") in ("parking", "garage"): return "precast"
    if "brick" in n: return "brick_red"
    y = int(row["year"]) if str(row.get("year", "")).isdigit() else None
    if row.get("building") in ("industrial", "warehouse", "service", "shed"): return "concrete"
    if y is None: return "brick_brown" if row.get("building") in ("university", "dormitory") else "brick_tan"
    if y < 1960: return "brick_red"
    if y < 1990: return "brick_brown"
    return "brick_red"

def ring_to_local(ring):
    pts = [list(geo.ll_to_xz(p[1], p[0])) for p in ring]
    if len(pts) > 1 and math.dist(pts[0], pts[-1]) < 0.01: pts.pop()
    if signed_area(pts) < 0: pts.reverse()
    return [[round(x, 2), round(z, 2)] for x, z in pts]

def signed_area(poly):
    """(x, -z) 평면에서의 부호 면적: 위에서 봤을 때 반시계 = 양수"""
    a = 0.0
    for i in range(len(poly)):
        x0, z0 = poly[i]; x1, z1 = poly[(i + 1) % len(poly)]
        a += x0 * (-z1) - x1 * (-z0)
    return a / 2

def roof_colour(mosaic, img, ring_ll):
    """footprint 안쪽(2 px 침식)의 중앙값 RGB"""
    pts = [mosaic.px_of(p[1], p[0]) for p in ring_ll]
    xs, ys = [p[0] for p in pts], [p[1] for p in pts]
    x0, y0, x1, y1 = int(max(0, min(xs))), int(max(0, min(ys))), int(min(img.width, max(xs)) + 1), int(min(img.height, max(ys)) + 1)
    if x1 - x0 < 3 or y1 - y0 < 3: return [150, 150, 150]
    mask = Image.new("L", (x1 - x0, y1 - y0), 0)
    ImageDraw.Draw(mask).polygon([(x - x0, y - y0) for x, y in pts], fill=255)
    mask = mask.filter(ImageFilter.MinFilter(5))
    arr = np.asarray(img.crop((x0, y0, x1, y1))); m = np.asarray(mask) > 0
    if m.sum() < 10: return [150, 150, 150]
    return [int(v) for v in np.median(arr[m], axis=0)]

def ground_tiles(png, bounds_json, out_dir):
    """Web-Mercator 모자이크를 로컬 평면(피트) 격자로 재투영해 2×2 JPEG 타일 저장"""
    m = geo.MosaicBounds(bounds_json); img = np.asarray(Image.open(png).convert("RGB"))
    px_per_ft = TILE_PX * TILES / EXTENT
    for r in range(TILES):
        for c in range(TILES):
            xs = -EXTENT / 2 + (c * TILE_PX + np.arange(TILE_PX) + 0.5) / px_per_ft
            zs = -EXTENT / 2 + (r * TILE_PX + np.arange(TILE_PX) + 0.5) / px_per_ft
            X, Z = np.meshgrid(xs, zs)
            lat = geo.ORIGIN[0] - Z / geo.FT_PER_M / geo.M_PER_DEG_LAT
            lon = geo.ORIGIN[1] + X / geo.FT_PER_M / geo.M_PER_DEG_LON
            n = 2 ** m.zoom * 256
            px = (lon + 180) / 360 * n
            py = (1 - np.log(np.tan(np.radians(lat)) + 1 / np.cos(np.radians(lat))) / np.pi) / 2 * n
            col = np.clip(((px - m.x0) / (m.x1 - m.x0) * m.w).astype(int), 0, m.w - 1)
            row = np.clip(((py - m.y0) / (m.y1 - m.y0) * m.h).astype(int), 0, m.h - 1)
            Image.fromarray(img[row, col]).save(out_dir / f"ground_{r}_{c}.jpg", quality=85)
    return px_per_ft

def imagery_trees(png, bounds_json, building_rings_ll, spacing_ft=25):
    """위성영상 녹색 분류로 수목 위치 추출 (건물 내부 제외, 격자 간격 spacing_ft)"""
    m = geo.MosaicBounds(bounds_json); im = Image.open(png).convert("RGB")
    scale = 4; small = im.resize((im.width // scale, im.height // scale), Image.BILINEAR)
    a = np.asarray(small).astype(np.float32); R, G, B = a[..., 0], a[..., 1], a[..., 2]
    veg = (G > R + 8) & (G > B + 12) & (G < 150) & (G > 40)       # 짙은 녹색 = 수관
    veg = np.asarray(Image.fromarray((veg * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.MaxFilter(5))) > 0
    mask = Image.new("L", small.size, 255)
    d = ImageDraw.Draw(mask)
    for ring in building_rings_ll:
        d.polygon([(x / scale, y / scale) for x, y in (m.px_of(p[1], p[0]) for p in ring)], fill=0)
    veg &= np.asarray(mask) > 0
    out = []; rng = np.random.default_rng(3)
    ft_per_px = (m.east - m.west) * geo.M_PER_DEG_LON * geo.FT_PER_M / m.w * scale
    step = max(1, int(spacing_ft / ft_per_px))
    for y in range(0, veg.shape[0] - step, step):
        for x in range(0, veg.shape[1] - step, step):
            blk = veg[y:y + step, x:x + step]
            if blk.mean() > 0.45:
                cy, cx = (y + step / 2) * scale, (x + step / 2) * scale
                lon = m.west + cx / m.w * (m.east - m.west)
                # 행 → 위도: mercator 역변환
                n = 2 ** m.zoom * 256; py = m.y0 + cy / m.h * (m.y1 - m.y0)
                lat = math.degrees(math.atan(math.sinh(math.pi * (1 - 2 * py / n))))
                xl, zl = geo.ll_to_xz(lat, lon)
                if abs(xl) < EXTENT / 2 and abs(zl) < EXTENT / 2:
                    out.append([round(xl + rng.uniform(-6, 6), 1), round(zl + rng.uniform(-6, 6), 1), int(rng.uniform(22, 42)), int(rng.integers(0, 3)), 1])
    return out

def main():
    OUT.mkdir(parents=True, exist_ok=True)
    B = json.load(open(DATA / "osm_buildings.geojson", encoding="utf-8"))
    R = json.load(open(DATA / "osm_roads_etc.geojson", encoding="utf-8"))
    rows = {r["osm_id"]: r for r in csv.DictReader(open(DATA / "buildings.csv", encoding="utf-8"))}
    z20 = DATA / "imagery" / "esri_z20.png"
    png, bj = (z20, DATA / "imagery" / "esri_z20.json") if z20.exists() else (DATA / "imagery" / "esri_z19.png", DATA / "imagery" / "esri_z19.json")
    mosaic = geo.MosaicBounds(bj); img = Image.open(png).convert("RGB")
    buildings, rings = [], []
    for f in B["features"]:
        if f["geometry"]["type"] != "Polygon": continue
        ring = f["geometry"]["coordinates"][0]; row = rows.get(f["id"], {})
        rings.append(ring)
        poly = ring_to_local(ring)
        if len(poly) < 3: continue
        buildings.append({"id": f["id"], "name": row.get("name", "") or f["properties"].get("name", ""), "poly": poly,
                          "holes": [ring_to_local(h)[::-1] for h in f["geometry"]["coordinates"][1:]],
                          "h": round(float(row.get("height_m", 7)) * geo.FT_PER_M, 1), "levels": int(row.get("levels", 2)),
                          "roof": roof_colour(mosaic, img, ring), "wall": classify_wall(row | {"building": f["properties"].get("building", "yes")}),
                          "detail": row.get("detail_level", "mass"), "roof_shape": f["properties"].get("roof:shape", "flat")})
    roads, areas, trees = [], [], []
    for f in R["features"]:
        g, t = f["geometry"], f["properties"]
        if g["type"] == "LineString" and road_width(t):
            roads.append({"pts": [[round(v, 2) for v in geo.ll_to_xz(p[1], p[0])] for p in g["coordinates"]], "w": road_width(t), "kind": "path" if t["highway"] in ("footway", "cycleway", "path", "steps", "pedestrian") else "road"})
        elif g["type"] == "Polygon":
            kind = ("parking" if t.get("amenity") == "parking" else "grass" if t.get("landuse") == "grass" or t.get("leisure") in ("park", "garden") else
                    "pitch" if t.get("leisure") in ("pitch", "track") else "water" if t.get("natural") == "water" else "wood" if t.get("natural") == "wood" else None)
            if kind: areas.append({"poly": ring_to_local(g["coordinates"][0]), "kind": kind})
        elif g["type"] == "Point" and t.get("natural") == "tree":
            x, z = geo.ll_to_xz(g["coordinates"][1], g["coordinates"][0]); trees.append([round(x, 1), round(z, 1), 32, len(trees) % 3, 0])
    trees += imagery_trees(DATA / "imagery" / "esri_z19.png", DATA / "imagery" / "esri_z19.json", rings)
    px_per_ft = ground_tiles(png, bj, OUT)
    site = {"origin": list(geo.ORIGIN), "ground": {"extent_ft": EXTENT, "tiles": TILES, "tile_px": TILE_PX, "px_per_ft": round(px_per_ft, 4)},
            "buildings": buildings, "roads": roads, "areas": areas, "trees": trees}
    json.dump(site, open(OUT / "site.json", "w"), separators=(",", ":"))
    print(f"buildings {len(buildings)} roads {len(roads)} areas {len(areas)} trees {len(trees)} ground px/ft {px_per_ft:.3f}")

if __name__ == "__main__":
    main()
```

- [ ] **Step 4: Run the tool, then the tests**

Run: `python -I tools/build_site.py` then `python -m pytest tests/test_build_site.py -q`
Expected: tool prints counts (buildings ≈ 404, roads > 1000, trees > 500); tests `4 passed`. Open `viewer/assets/ground_0_0.jpg` and confirm north-west quadrant shows the Rec Center and Tippecanoe St.

- [ ] **Step 5: Georeference check (manual, record in README later)**

Write a tiny scratch script that draws `site["roads"]` over the four ground tiles composed into one image and view it: road centrelines must sit on the imagery streets (< 10 ft ≈ 17 px offset).

- [ ] **Step 6: Commit**

```bash
git add tools/build_site.py tests/test_build_site.py viewer/assets/site.json viewer/assets/trees.json viewer/assets/ground_*.jpg
git commit -m "Site builder: local-frame site.json, reprojected ground tiles, imagery trees"
```

---

### Task 3: Procedural textures (`tools/gen_textures.py`)

**Files:**
- Create: `tools/gen_textures.py` (start from `D:\Projects\white-oak-lake-dams-3d\tools\gen_textures.py`: reuse `tile_noise`, `to_normal`, `save`, the grass, asphalt, leaves atlas and bark sections verbatim)
- Writes to `viewer/assets/`: `brick_red.jpg`, `brick_brown.jpg`, `brick_tan.jpg`, `limestone.jpg`, `precast.jpg`, `metal.jpg`, `glass.jpg`, `concrete.jpg`, each with `*_win.jpg` (same material with one storey of windows baked: tile = 24 ft wide × 12 ft high, window 5×7 ft every 8 ft), `brick_n.jpg`, `roof_membrane.jpg`, `roof_gravel.jpg`, `roof_dark.jpg`, `asphalt.jpg`, `concrete_walk.jpg`, `grass_detail.jpg`, `grass_n.jpg`, `leaves.png`, `bark.jpg`, `window_glass.jpg` (for detailed-building curtain walls, 1 tile = 1 pane)

**Interfaces:**
- Produces files only; `viewer/lib/materials.js` (Task 4) loads them by these exact names.

- [ ] **Step 1: Implement brick generator and window baking**

```python
def brick(n, mortar=(205, 198, 188), base=(150, 72, 52), var=18, seed=5, course=16, length=32):
    """줄눈이 있는 벽돌 타일 (n px 정사각, 1 타일 = course*? ft 는 materials.js 의 repeat 로 정함)"""
    r = np.random.default_rng(seed)
    img = np.zeros((n, n, 3), np.float32); img[:] = mortar
    for row in range(n // course):
        y0 = row * course
        off = (length // 2) if row % 2 else 0
        for col in range(-1, n // length + 1):
            x0 = col * length + off
            c = np.array(base) + r.uniform(-var, var, 3) + r.uniform(-10, 10)
            img[y0 + 1:y0 + course - 1, max(0, x0 + 1):max(0, x0 + length - 1)] = c
    noise = tile_noise(n, [(64, 0.6), (256, 1.0)], seed=seed + 1)
    img *= (0.85 + 0.3 * noise[..., None])
    return np.clip(img, 0, 255).astype(np.uint8)

def bake_windows(wall, tile_ft_w=24, tile_ft_h=12, win=(5, 7), pitch=8, sill=3, frame=(60, 62, 66), glass=(70, 95, 120)):
    """벽 타일 위에 한 층 분량의 창을 그림. 타일 가로 24 ft, 세로 12 ft 에 해당."""
    n = wall.shape[0]; img = Image.fromarray(wall.copy()); d = ImageDraw.Draw(img)
    pxw, pxh = n / tile_ft_w, n / tile_ft_h
    for k in range(int(tile_ft_w // pitch)):
        x0 = (k * pitch + (pitch - win[0]) / 2) * pxw; y1 = n - sill * pxh; y0 = y1 - win[1] * pxh
        d.rectangle([x0, y0, x0 + win[0] * pxw, y1], fill=frame)
        d.rectangle([x0 + 2, y0 + 2, x0 + win[0] * pxw - 2, y1 - 2], fill=glass)
        d.line([x0 + win[0] * pxw / 2, y0, x0 + win[0] * pxw / 2, y1], fill=frame, width=2)
    return np.asarray(img)
```
Generate: `brick_red` base (150,72,52), `brick_brown` (118,78,62), `brick_tan` (176,146,112); `limestone` = `tile_noise` blocks (course 40, length 96, base (206,198,182), mortar (190,184,172)); `precast` = smooth panel grid 48×96 px joints, base (196,192,186); `metal` = vertical ribs every 6 px, base (160,165,170); `glass` = dark blue-grey (54,70,88) with 1-px mullion grid every 64 px; `concrete` as in the reference. For each wall texture also save `<name>_win.jpg = bake_windows(tex)` (for `glass` skip baking; its grid is the window pattern). Roofs: `roof_membrane` (light grey 200 ± 8 noise), `roof_gravel` (155 ± 20 speckle), `roof_dark` (60 ± 10). `window_glass.jpg`: single pane 256² with 6-px frame.

- [ ] **Step 2: Run and inspect**

Run: `python -I tools/gen_textures.py`
Expected: prints `textures done`, 25+ files in `viewer/assets/`, each 256–1024 px, JPEG ≤ 300 kB. Open `brick_red_win.jpg` and confirm 3 windows across, mortar lines tileable at the edges.

- [ ] **Step 3: Commit**

```bash
git add tools/gen_textures.py viewer/assets/*.jpg viewer/assets/*.png
git commit -m "Procedural facade, roof, ground and vegetation textures"
```

---

### Task 4: Viewer skeleton – ground, roads, areas, mass buildings, trees, HUD

**Files:**
- Create: `viewer/lib/geom.js`, `viewer/lib/materials.js`, `viewer/lib/ground.js`, `viewer/lib/mass.js`, `viewer/lib/trees.js`, `viewer/lib/labels.js`, `viewer/buildings/index.js` (empty registry `export const MODULES = {}`), `viewer/app.js`, `tools/index_template.html`, `tools/build.py`, `tools/shot.mjs`
- Copy patterns from the reference: renderer/scene/camera/controls block (`app.js` 15–30), `tex()` loader (41–50), `setupSkyAndLights` (660–684), `applyPreset`, `exportGLB`, `main` loader/HUD wiring, `index_template.html` CSS/HUD, `build.py`, `shot.mjs` (change paths to local `node_modules/playwright` and the local chromium, port 8765, output `renders/` and `model/isu_campus.glb`).

**Interfaces (used by every building module in Task 6):**
```js
// viewer/lib/geom.js
export function extrudePoly(poly, holes, h, { y0 = 0, uvScale = 1/12 } = {})  // poly [[x,z]...] CCW; returns BufferGeometry with side UVs (u = perimeter ft * uvScale, v = height ft * uvScale) and top UV (x,z) * uvScale; roof face is a separate geometry group 1
export function box(w, h, d, x, y, z, { ry = 0 } = {})      // BufferGeometry centred at (x, y+h/2, z)
export function wallSeg(p0, p1, y0, y1, { openings = [] } = {})  // vertical quad from [x,z] p0 to p1 between y0..y1, with rectangular openings [{s, e, b, t}] (s/e distance along the wall in ft, b/t bottom/top ft) cut out; UV = ft * 1/12
export function windowGrid(p0, p1, { y0, rows, rowH, cols, colW, winW, winH, sill, inset = 0.5 })  // returns {wall: BufferGeometry (with holes), glass: BufferGeometry (panes inset)} for a repeating window pattern along the wall
export function flatRoof(poly, y, { parapet = 2.0, thick = 0.75 })  // slab + parapet geometry
export function gableRoof(poly, yEave, pitch, axisDeg)   // simple ridge roof over a rectangle
export function toWorld(group, anchor, rotationDeg)      // sets group position (anchor[0], 0, anchor[1]) and rotation.y = -rotationDeg*π/180
export function mergeByMaterial(parts)                   // parts: [{geom, mat}] → array of Meshes merged per material
// viewer/lib/materials.js
export function makeMaterials(tex) → M  // M.brick_red, M.brick_red_win, …, M.limestone, M.precast, M.metal, M.glass (MeshPhysicalMaterial, transmission 0, envMapIntensity 1.2), M.roof_membrane, M.roof_gravel, M.roof_dark, M.asphalt, M.walk, M.grass, M.water, M.pane (window glass), M.trim (white painted), M.concrete
export function wallMat(M, key, levels, h)  // returns M[key+'_win'] clone with map.repeat set so one tile = one storey (storey = h/levels) and 24 ft horizontally
// viewer/buildings/index.js
export const MODULES = { 'way/183426119': () => import('./hulman_center.js'), ... }   // keyed by OSM id (filled in Task 6)
// each building module
export const meta = { id: 'hulman', name: 'Hulman Center', osm: 'way/183426119', anchor: [x_ft, z_ft], rotation: deg, preset: { pos: [x,y,z], tgt: [x,y,z] } }
export function build(M, G) → THREE.Group   // local frame, feet, y up; G = geom.js namespace
```

- [ ] **Step 1: `viewer/lib/geom.js`**

Implement with `THREE.Shape`/`ExtrudeGeometry` for `extrudePoly` (then overwrite side UVs by walking the perimeter: for each side quad, u = cumulative length), `THREE.BoxGeometry` for `box`, manual `BufferGeometry` triangulation for `wallSeg` (use `THREE.ShapeGeometry` on a 2-D shape in the wall plane with holes, then rotate into place), `windowGrid` builds the opening list and calls `wallSeg` + pane quads, `flatRoof` = extrudePoly(h=thick) at y + a parapet ring made from `wallSeg`s, `mergeByMaterial` uses `BufferGeometryUtils.mergeGeometries` after `applyMatrix4` of each part's matrix. Every function must set `castShadow`/`receiveShadow` on meshes it returns.

- [ ] **Step 2: `viewer/lib/materials.js`** – one `MeshStandardMaterial` per asset with `roughness` 0.85 (brick/stone/precast), 0.55 (metal), `M.glass`: color 0x6b8299, roughness 0.15, metalness 0.6; `wallMat` sets `map.repeat.set(1, 1)` and `map.wrapS/T = RepeatWrapping`; the per-storey scaling is done by `extrudePoly` UVs with `uvScale = 1/12` for v and `1/24` for u (so one texture tile = 24 ft × 12 ft) and `wallMat` adjusts `map.repeat.y = 12 / storeyHeight`.

- [ ] **Step 3: `viewer/lib/ground.js`** – `buildGround(site, M, tex)`: 4 `PlaneGeometry(2400, 2400)` meshes with the ground tiles, y = 0; `buildRoads(site, M)`: for each road build a ribbon (`w` wide, y = 0.15 road / 0.25 path) with mitred joints (same ribbon code as the reference's `buildWalkway`), merged into two meshes (asphalt, walk); `buildAreas(site, M)`: `ShapeGeometry` per polygon at y = 0.08 (parking asphalt-dark, grass tint 0x7fa05a with `grass_detail` map, pitch 0x5a8f4a, water 0x3a5a70); return a Group. Road/area layers exist so the model is readable when ground imagery is toggled off.

- [ ] **Step 4: `viewer/lib/mass.js`** – `buildMasses(site, M, skipIds)`: for every building not in `skipIds`: `extrudePoly(poly, holes, h)` → side mesh with `wallMat(M, wall, levels, h)`, roof mesh with `M.roof_membrane`/`roof_gravel`/`roof_dark` chosen by roof luminance (> 170 membrane, > 100 gravel, else dark) tinted by `roof` RGB (material.color = roof RGB / 190, clamped 0.5–1.4), gabled/hipped → `gableRoof`. Merge per material key. Return Group `name='masses'` and a Map id → mesh for labels.

- [ ] **Step 5: `viewer/lib/trees.js`** – copy `buildTrees` from the reference (leaves atlas, instanced), input `site.trees` → `[x, z, h, variant]`; `viewer/lib/labels.js` – `buildLabels(site)` canvas sprites (name, 24 px, white on translucent dark) at building centroid, y = h + 12, `sizeAttenuation` true, scaled 0.6 × name length; hidden by default.

- [ ] **Step 6: `viewer/app.js`**

```js
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Sky } from 'three/addons/objects/Sky.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import * as G from './lib/geom.js';
import { makeMaterials } from './lib/materials.js';
import { buildGround, buildRoads, buildAreas } from './lib/ground.js';
import { buildMasses } from './lib/mass.js';
import { buildTrees } from './lib/trees.js';
import { buildLabels } from './lib/labels.js';
import { MODULES } from './buildings/index.js';
// renderer/scene/camera/controls, tex(), setupSkyAndLights(): copied from the reference, fog 0xdde6ee 0.00018, camera far 20000, sun elev 48 az 205, shadow camera ±1600 ft, 4096 map
const PRESETS = {
  campus:   { pos: [-900, 1900, 2300], tgt: [0, 0, -100] },
  hmsu:     { pos: [-650, 220, 120], tgt: [-470, 20, -330] },
  library:  { pos: [ 60, 180, -380], tgt: [ 70, 25, -620] },
  towers:   { pos: [-1100, 420, 700], tgt: [-620, 60, 420] },
  // detailed-building presets are added from each module's meta.preset at load time
};
async function main() {
  const site = await (await fetch(ASSET + 'site.json')).json();
  const M = makeMaterials(tex);
  scene.add(buildGround(site, M, tex), buildRoads(site, M), buildAreas(site, M));
  const detailed = Object.keys(MODULES);
  const masses = buildMasses(site, M, new Set(detailed)); scene.add(masses.group);
  for (const id of detailed) {                         // 상세 건물 모듈 로드·배치
    const mod = await MODULES[id](); const grp = mod.build(M, G); G.toWorld(grp, mod.meta.anchor, mod.meta.rotation);
    grp.name = mod.meta.id; scene.add(grp); PRESETS[mod.meta.id] = mod.meta.preset;
  }
  const trees = buildTrees(site.trees, tex); scene.add(trees);
  const labels = buildLabels(site); labels.visible = false; scene.add(labels);
  // HUD: data-view buttons, toggles tgTrees/tgMass/tgLabels/tgGround/tgShadow, btnExport, hudToggle (collapse)
  ...
}
```
`index_template.html`: title "Indiana State University – 3D Campus Model", HUD with the 12 preset buttons (`campus, hulman, rec, reeve, finearts, tech, welcome, nursing, myers, hmsu, library, towers`), 5 toggles, export button, a "▾" collapse button that toggles class `collapsed` on `#hud` (CSS hides everything but the title), legend box bottom-right ("Detailed buildings from construction drawings: … · Others: OSM footprints × storey height · Imagery: Esri World Imagery · Trees: OSM + imagery"). `tools/build.py` as reference minus the photo copying. `tools/shot.mjs`: `import { chromium } from 'playwright'`, `executablePath` omitted (use bundled), `http-server` spawned via `npx http-server viewer -p 8765 -s -c-1`, output dir arg default `renders`, GLB saved to `model/isu_campus.glb` when `EXPORT=1`, viewport 1600×900.

- [ ] **Step 7: Run in the browser**

Run: `python tools/build.py && npm run serve` → open `http://localhost:8765/index_local.html?shot=campus` in the built-in browser; read console: no errors, `H@C` style log replaced by `site: 404 buildings, N tris`. Screenshot the `campus` preset and compare with `ov_center.png` (streets and footprints must align with the ground imagery).

- [ ] **Step 8: Headless check**

Run: `node tools/shot.mjs campus,hmsu,library,towers shots`
Expected: 4 PNGs, log shows `done in` for each and no `PAGEERROR`.

- [ ] **Step 9: Commit and push (stage 3)**

```bash
git add viewer/ tools/build.py tools/index_template.html tools/shot.mjs
git commit -m "Viewer: ground imagery, roads, areas, mass buildings, trees, HUD, GLB export"
git push origin main
```

---

### Task 5: Footprint fitting tool and sheet renderer (modelling aids)

**Files:**
- Create: `tools/fit_footprint.py`, `tests/test_fit_footprint.py`, `tools/render_sheet.py`

**Interfaces:**
- `fit_footprint.fit(local_poly, osm_poly) -> (anchor_x, anchor_z, rotation_deg, rms_ft)`: finds the rigid transform `world = R(rot)·local + anchor` minimising point-to-polygon-edge distance (ICP, 30 iterations, initial rotation from the principal axes; try the 4 axis-aligned starts and keep the best). CLI: `python tools/fit_footprint.py outline.json way/183426119` prints JSON `{"anchor":[x,z],"rotation":deg,"rms":ft}` where `outline.json` is `[[x,z],...]` in the building's local frame (drawing feet, x right, z down on the plan = south when the plan's north arrow points up).
- `render_sheet.py <pdf> <page1based> [--dpi 150] [--clip x0,y0,x1,y1 (fractions)] [--out name]` writes `scratchpad/sheets/<name>.png` and prints the path and pixel size, plus `px_per_ft` when `--scale 1/8` is given (px_per_ft = dpi × scale_fraction; e.g. 150 dpi at 1/8″ = 1′ → 1.5625 px/ft... computed as dpi * (1/8) / 12 × 12 = dpi/96 per ft? – implement as `dpi * inches_per_ft` where `inches_per_ft` is the scale fraction (1/8 → 0.125), so 150 dpi × 0.125 = 18.75 px/ft).

- [ ] **Step 1: Failing test**

```python
# tests/test_fit_footprint.py
import sys, pathlib, math
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / "tools"))
import fit_footprint as ff

def rot(p, deg):
    c, s = math.cos(math.radians(deg)), math.sin(math.radians(deg)); return [c * p[0] - s * p[1], s * p[0] + c * p[1]]

def test_recovers_known_transform():
    local = [[0, 0], [200, 0], [200, 80], [120, 80], [120, 140], [0, 140]]
    truth = (350.0, -220.0, 23.0)
    world = [[rot(p, truth[2])[0] + truth[0], rot(p, truth[2])[1] + truth[1]] for p in local]
    ax, az, deg, rms = ff.fit(local, world)
    assert abs(ax - truth[0]) < 1.0 and abs(az - truth[1]) < 1.0 and abs(deg - truth[2]) < 0.5 and rms < 0.5
```

- [ ] **Step 2: Run → FAIL (`No module named 'fit_footprint'`)**

- [ ] **Step 3: Implement** – resample both polygons every 2 ft; ICP: for each local sample find the nearest point on the world polygon (segment projection), solve 2-D Procrustes (Kabsch with SVD, no scale), iterate; start from 4 rotations (principal axis angle + k·90°) and keep the lowest RMS. Rotation convention: `world = [c·x − s·z, s·x + c·z] + anchor` with `c,s` of `rotation_deg`. `render_sheet.py` uses PyMuPDF `page.get_pixmap(matrix=fitz.Matrix(dpi/72, dpi/72), clip=rect)`.

- [ ] **Step 4: Run tests → PASS; try the CLI on a square from a 1/16″ Hulman plan later in Task 6.**

- [ ] **Step 5: Commit** `git add tools/fit_footprint.py tools/render_sheet.py tests/test_fit_footprint.py && git commit -m "Footprint fitting and sheet rendering aids"`

---

### Task 6: Detailed building modules (8 sub-tasks, one commit + push each)

Common procedure for every building (repeat for each sub-task; no step may be skipped):

1. Render the listed sheets with `tools/render_sheet.py` at 150 dpi (plans) and 200 dpi (elevations) into the scratchpad; view them; write the measured values into a comment block at the top of the module (`// 치수 근거: A3 평면 1/16" — 전체 306'-4" × 254'-4", 레벨1 FL 0.0 …`).
2. Create `viewer/buildings/<name>.js` with `meta` + `build(M, G)`; model in the building's local frame (origin = a labelled grid intersection or the south-west corner, x = plan right, z = plan down, feet).
3. Write `scratch/<name>_outline.json` (the outer wall outline in local ft) and run `python tools/fit_footprint.py … <osm_id>`; paste `anchor` and `rotation` into `meta`; RMS must be < 6 ft, otherwise re-check the outline scale (most common error: wrong sheet scale).
4. Register in `viewer/buildings/index.js`; add the preset camera in `meta.preset` (eye ~250 ft away, 120 ft up, looking at the main entrance).
5. `node tools/shot.mjs <preset> shots` → view the PNG next to the satellite crop (`ov_*.png` style, 400 ft radius) and the elevation sheet; fix obvious misses (storey count, roof form, entrance side).
6. Commit `feat: <Building> detailed model (sheets …)` and push.

Sub-tasks (sheets to read; what the module must contain):

- [ ] **6a `hulman_center.js`** – A3 (level 1 plan 1/16″: overall 306′-4″ × 254′-4″, 12-sided bowl outline), A4/A5 (levels 2–3), A7 roof plan, A11–A14 sections (floor-to-floor and roof heights), A44–A49 four stair towers, A50 press box, A63 service building. Post-2020 skin: vertical metal panel (`M.metal`) on the concourse walls, south glass lobby (`M.glass`) 2 storeys, roof membrane. Model: 12-gon concourse ring, raised roof drum over the arena, four stair towers, south lobby, plaza steps.
- [ ] **6b `rec_center.js`** – A2.00 site, A2.01/A2.02 plans, A2.03 roof, A4.01/A4.02 elevations (wall heights, clerestory, curved south-west entrance glass), A4.03 sections. Brick (`brick_red`) base, metal-panel clerestory, large glazing on the curved entry, flat roofs at 2–3 heights.
- [ ] **6c `reeve_hall.js`** – one `build` producing both East and West buildings (identical, mirrored per A100: the module returns a Group with two children offset per the OSM centroids; fit each child separately). A111 plan (pods, 1/8″), A116 roof, A201/A202 elevations (storey heights, limestone bands A370, bay windows, hipped-roof dormers?), A301 section. `brick_red` + `limestone` trim, gabled roof per A116.
- [ ] **6d `fine_arts.js`** – A110–A114 dimension plans, A160 roof plan (parapets, penthouse), A201–A203 elevations (1940 brick with limestone base and cornice; 2018 storefront entries A610–A613), A301/A302 sections. 4 storeys + lower level.
- [ ] **6e `technology_bldg.js`** – A-100/A-101/A-102 plans (48×36 sheets, 1/8″), A-103 roof, A-201/A-202 elevations (levels 100′-0″, 114′-8″, 129′-4″, roof 137′-4⅝″, penthouse 144′-8″; north addition metal panel + curtain wall; existing brick), A-301 section. Note in README that the imagery shows the pre-renovation building.
- [ ] **6f `welcome_center.js`** – 1955 sheets 1 (plot plan), 3 (first floor), 4 (second floor + roof plan), 5 (elevations & sections), 6 (wall sections). Two-storey brick, flat built-up roof, partial second floor; entrance canopy.
- [ ] **6g `nursing_bldg.js`** – sheet 1 site plan (position: Chestnut north, 8th St east), 3–8 plans, 9 roof, 10 elevations (levels: 1st 498.0 ↔ y 0, 2nd 510′-5″, 3rd 522′-10″, 4th 535′-3″, roof slab 547′-9″, stair roof 557′-1″; brick spandrels, window strips), 11 sections.
- [ ] **6h `myers_tech.js`** – plans 342–346 (1/16″): trace the lower/first floor outline (curved south-east corner), second/third floors, partial fourth; storey height 14 ft (estimated, documented); brick (`brick_red`) with precast bands, flat roofs. Mark `heights estimated` in README.

---

### Task 7: Presets, renders, GLB, README, Pages

**Files:**
- Modify: `viewer/app.js` (final preset list order), `tools/index_template.html` (button labels)
- Create: `renders/*.png` (12), `model/isu_campus.glb`, `README.md` (rewrite), `index.html` (root redirect)

- [ ] **Step 1: Renders** – `node tools/shot.mjs campus,hulman,rec,reeve,finearts,tech,welcome,nursing,myers,hmsu,library,towers renders`; view all 12; each must show its building centred, no black ground, shadows present.
- [ ] **Step 2: GLB** – `EXPORT=1 node tools/shot.mjs campus renders` → `model/isu_campus.glb`; log size; if > 100 MB attach to a Release `model-v1` and git-ignore it; open in Windows 3D Viewer (via `start model\isu_campus.glb`) and screenshot once for the README.
- [ ] **Step 3: README.md (English)** – sections: overview + hero render, repository layout table, live viewer URL, running locally (`python -m http.server` in `viewer/`), regenerating assets (`pip install numpy pillow scipy shapely pymupdf`, `python tools/build_site.py`, `python tools/gen_textures.py`, `python tools/build.py`), data sources (OSM © OpenStreetMap contributors ODbL, Esri World Imagery terms, ISU campus map, ISU Sycamore Scholars archive, drawings by architect/year), **per-building detail table** (building, map no., detail level, sheets used, storeys, placement RMS, notes), coordinate frame, assumptions and limits (imagery date vs. cTED renovation, estimated heights, no Street View, no interiors, Lincoln Quad demolished), credits.
- [ ] **Step 4: Root `index.html`** – copy from the reference, title "Indiana State University 3D Campus", redirect to `viewer/`.
- [ ] **Step 5: GitHub Pages** – `gh api -X POST repos/youngbrain85/isu-campus-3d/pages -f "source[branch]=main" -f "source[path]=/"` (if it already exists use `-X PUT` with the same fields); then `gh api repos/youngbrain85/isu-campus-3d/pages` must show `"status": "built"` after a few minutes; open `https://youngbrain85.github.io/isu-campus-3d/viewer/` in the browser and confirm the campus preset loads with no console errors.
- [ ] **Step 6: Commit and push** `git add renders model README.md index.html viewer tools && git commit -m "Renders, GLB export, README and GitHub Pages deployment" && git push`.

---

## Self-review

- Spec coverage: §3 frame → Task 1/2; §4.1 → Task 2; §4.2 → Task 3/4; §4.3 → Task 5/6; §4.4 → Task 4/7; §4.5 outputs → Task 7; §5 checks → Task 2 step 5, Task 5 RMS, Task 7 steps 1–2, 5; §6 commits → each task.
- Placeholders: Task 6 contains no code because each module's content is the drawing data read during the task; the interface, procedure, acceptance (RMS < 6 ft, headless render, visual compare) and sheets are fixed. All other tasks carry code.
- Names used consistently: `extrudePoly`, `wallSeg`, `windowGrid`, `flatRoof`, `gableRoof`, `toWorld`, `mergeByMaterial`, `makeMaterials`, `wallMat`, `MODULES`, `meta`, `build(M, G)`, `site.json` keys `buildings/roads/areas/trees/ground`.
