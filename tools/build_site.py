#!/usr/bin/env python3
"""OSM + buildings.csv + Esri 모자이크 → viewer/assets/site.json, 지면 타일, 수목·잔디 데이터 (캠퍼스 구역만).

site.json 좌표: 로컬 평면 피트, x=동, z=남. 폴리곤은 위에서 봤을 때 반시계(CCW), 닫는 점 제거.
범위 CLIP = 3rd St ~ 9th St, Tippecanoe St ~ Cherry St (ISU 메인 캠퍼스).
"""
import csv, json, math, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass
sys.path.insert(0, str(Path(__file__).resolve().parent))
import geo, vegetation
Image.MAX_IMAGE_PIXELS = None

ROOT = Path(__file__).resolve().parent.parent
DATA, OUT = ROOT / "data", ROOT / "viewer" / "assets"
CLIP = (-1250.0, -1600.0, 1700.0, 1330.0)        # x0, z0, x1, z1 (ft): 3rd St 서측 ~ 9th St 동측, Tippecanoe ~ Cherry St 남측
TILES, TILE_PX = 2, 2048                          # 위성 오버레이 타일 (선택 표시용)
CORE = (-420.0, -1480.0, 1190.0, 520.0)           # 벽돌 포장 보도 구역: 5th–8th St, Tippecanoe–Eagle St (스트리트뷰 확인)

ROAD_W = {"trunk": 48, "primary": 44, "secondary": 40, "tertiary": 34, "residential": 30, "unclassified": 26,
          "service": 18, "living_street": 24, "footway": 7, "cycleway": 8, "path": 6, "pedestrian": 14, "steps": 6}
PATH_KINDS = ("footway", "cycleway", "path", "steps", "pedestrian")


def road_width(tags):
    hw = tags.get("highway")
    if hw not in ROAD_W:
        return None
    if hw == "service" and tags.get("service") in ("parking_aisle", "driveway"):
        return 16.0
    return float(ROAD_W[hw])


def classify_wall(row):
    """벽 재질 분류: facts 메모 → 용도 → 연대 순으로 판단"""
    n = (row.get("notes", "") + " " + row.get("name", "")).lower()
    if "glass" in n or "curtain" in n:
        return "glass"
    if "metal" in n:
        return "metal"
    if "limestone" in n and "brick" not in n:
        return "limestone"
    if "precast" in n or row.get("building") in ("parking", "garage"):
        return "precast"
    if "tan brick" in n or "buff brick" in n:
        return "brick_tan"
    if "brick" in n:
        return "brick_red"
    if row.get("building") in ("industrial", "warehouse", "service", "shed", "roof"):
        return "concrete"
    y = int(row["year"]) if str(row.get("year", "")).isdigit() else None
    if y is None:
        return "brick_brown" if row.get("building") in ("university", "dormitory") else "brick_tan"
    if y < 1960:
        return "brick_red"
    if y < 1990:
        return "brick_brown"
    return "brick_red"


def signed_area(poly):
    """(x, -z) 평면에서의 부호 면적: 위에서 봤을 때 반시계 = 양수"""
    a = 0.0
    for i in range(len(poly)):
        x0, z0 = poly[i]; x1, z1 = poly[(i + 1) % len(poly)]
        a += x0 * (-z1) - x1 * (-z0)
    return a / 2


def ring_to_local(ring):
    pts = [list(geo.ll_to_xz(p[1], p[0])) for p in ring]
    if len(pts) > 1 and math.dist(pts[0], pts[-1]) < 0.01:
        pts.pop()
    if signed_area(pts) < 0:
        pts.reverse()
    return [[round(x, 2), round(z, 2)] for x, z in pts]


def inside(p, rect=CLIP):
    return rect[0] <= p[0] <= rect[2] and rect[1] <= p[1] <= rect[3]


def centroid(poly):
    return [sum(p[0] for p in poly) / len(poly), sum(p[1] for p in poly) / len(poly)]


def clip_line(pts, rect=CLIP):
    """폴리라인을 사각형 안쪽 구간들로 분할 (바깥 점만 제거)"""
    runs, cur = [], []
    for p in pts:
        if inside(p, rect):
            cur.append(p)
        elif cur:
            runs.append(cur); cur = []
    if cur:
        runs.append(cur)
    return [r for r in runs if len(r) >= 2]


def roof_colour(mosaic, img, ring_ll):
    """footprint 안쪽(침식)의 중앙값 RGB"""
    pts = [mosaic.px_of(p[1], p[0]) for p in ring_ll]
    xs, ys = [p[0] for p in pts], [p[1] for p in pts]
    x0, y0 = int(max(0, min(xs))), int(max(0, min(ys)))
    x1, y1 = int(min(img.width, max(xs)) + 1), int(min(img.height, max(ys)) + 1)
    if x1 - x0 < 3 or y1 - y0 < 3:
        return [150, 150, 150]
    mask = Image.new("L", (x1 - x0, y1 - y0), 0)
    ImageDraw.Draw(mask).polygon([(x - x0, y - y0) for x, y in pts], fill=255)
    mask = mask.filter(ImageFilter.MinFilter(5))
    arr = np.asarray(img.crop((x0, y0, x1, y1))); m = np.asarray(mask) > 0
    if m.sum() < 10:
        return [150, 150, 150]
    return [int(v) for v in np.median(arr[m], axis=0)]


def ground_tiles(png, bounds_json, out_dir, rect=CLIP, tiles=TILES, tile_px=TILE_PX):
    """Web-Mercator 모자이크를 로컬 평면(피트) 격자로 재투영해 tiles×tiles JPEG 타일 저장 (위성 오버레이용)"""
    m = geo.MosaicBounds(bounds_json)
    img = np.asarray(Image.open(png).convert("RGB"))
    tw, th = (rect[2] - rect[0]) / tiles, (rect[3] - rect[1]) / tiles
    n = 2 ** m.zoom * 256
    for r in range(tiles):
        for c in range(tiles):
            xs = rect[0] + c * tw + (np.arange(tile_px, dtype=np.float64) + 0.5) * tw / tile_px
            zs = rect[1] + r * th + (np.arange(tile_px, dtype=np.float64) + 0.5) * th / tile_px
            lon = geo.ORIGIN[1] + xs / geo.FT_PER_M / geo.M_PER_DEG_LON
            lat = geo.ORIGIN[0] - zs / geo.FT_PER_M / geo.M_PER_DEG_LAT
            px = (lon + 180) / 360 * n
            py = (1 - np.log(np.tan(np.radians(lat)) + 1 / np.cos(np.radians(lat))) / np.pi) / 2 * n
            col = np.clip(((px - m.x0) / (m.x1 - m.x0) * m.w).astype(np.int32), 0, m.w - 1)
            row = np.clip(((py - m.y0) / (m.y1 - m.y0) * m.h).astype(np.int32), 0, m.h - 1)
            Image.fromarray(img[row[:, None], col[None, :]]).save(out_dir / f"ground_{r}_{c}.jpg", quality=85)
    return {"tiles": tiles, "tile_px": tile_px, "tile_w": round(tw, 2), "tile_h": round(th, 2)}


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    B = json.load(open(DATA / "osm_buildings.geojson", encoding="utf-8"))
    R = json.load(open(DATA / "osm_roads_etc.geojson", encoding="utf-8"))
    rows = {r["osm_id"]: r for r in csv.DictReader(open(DATA / "buildings.csv", encoding="utf-8"))}
    png, bj = DATA / "imagery" / "esri_z19.png", DATA / "imagery" / "esri_z19.json"
    mosaic = geo.MosaicBounds(bj); img = Image.open(png).convert("RGB")

    buildings, rings = [], []
    for f in B["features"]:
        if f["geometry"]["type"] != "Polygon":
            continue
        ring = f["geometry"]["coordinates"][0]; row = rows.get(f["id"], {})
        poly = ring_to_local(ring)
        if len(poly) < 3 or not inside(centroid(poly)):
            continue
        rings.append(ring)
        tags = f["properties"]
        buildings.append({
            "id": f["id"], "name": row.get("name", "") or tags.get("name", ""), "poly": poly,
            "holes": [ring_to_local(h)[::-1] for h in f["geometry"]["coordinates"][1:]],
            "h": round(float(row.get("height_m", 7) or 7) * geo.FT_PER_M, 1), "levels": int(row.get("levels", 2) or 2),
            "roof": roof_colour(mosaic, img, ring),
            "wall": classify_wall({**row, "building": tags.get("building", "yes")}),
            "detail": row.get("detail_level", "mass"), "roof_shape": tags.get("roof:shape", "flat"),
            "map_no": row.get("map_no", "")})

    roads, areas, trees = [], [], []
    for f in R["features"]:
        g, t = f["geometry"], f["properties"]
        if g["type"] == "LineString" and road_width(t):
            pts = [[round(v, 2) for v in geo.ll_to_xz(p[1], p[0])] for p in g["coordinates"]]
            for run in clip_line(pts):
                kind = "path" if t["highway"] in PATH_KINDS else "road"
                mid = run[len(run) // 2]
                surface = t.get("surface", "")
                if kind == "path":
                    surface = "pavers" if inside(mid, CORE) and surface in ("", "paving_stones", "paved") else "concrete"
                roads.append({"pts": run, "w": road_width(t), "kind": kind, "hw": t["highway"], "surface": surface,
                              "oneway": t.get("oneway") == "yes", "lanes": int(t["lanes"]) if str(t.get("lanes", "")).isdigit() else 0,
                              "name": t.get("name", "")})
        elif g["type"] == "Polygon":
            poly = ring_to_local(g["coordinates"][0])
            if len(poly) < 3 or not inside(centroid(poly)):
                continue
            kind = ("parking" if t.get("amenity") == "parking" else
                    "grass" if t.get("landuse") == "grass" or t.get("leisure") in ("park", "garden") else
                    "pitch" if t.get("leisure") in ("pitch", "track") else
                    "water" if t.get("natural") == "water" else
                    "wood" if t.get("natural") == "wood" else None)
            if kind == "wood":
                continue                              # 수관 폴리곤은 영상 분류로 대체
            if kind:
                areas.append({"poly": poly, "kind": kind, "parking": t.get("parking", "surface")})
        elif g["type"] == "Point" and t.get("natural") == "tree":
            x, z = geo.ll_to_xz(g["coordinates"][1], g["coordinates"][0])
            if inside((x, z)):
                trees.append([round(x, 1), round(z, 1), 34, len(trees) % 3, 0, 14])

    print("classifying vegetation ...")
    veg = vegetation.classify(png, bj, rings, CLIP)
    cells = {(int(t[0] // 12), int(t[1] // 12)) for t in trees}
    for t in veg["trees"]:
        k = (int(t[0] // 12), int(t[1] // 12))
        if not any((k[0] + i, k[1] + j) in cells for i in (-1, 0, 1) for j in (-1, 0, 1)):
            trees.append(t)
    veg["grass_mask"] = vegetation.grass_mask_from_site(veg, buildings, roads, areas, CLIP)
    tufts = vegetation.grass_tufts(veg["grass_mask"], veg["cell_ft"], veg["origin"])
    Image.fromarray(veg["grass_mask"] * 255).save(OUT / "grass_mask.png")
    Image.fromarray(veg["canopy_mask"] * 255).save(OUT / "canopy_mask.png")
    print("ground tiles from", png.name)
    gt = ground_tiles(png, bj, OUT)
    site = {"origin": list(geo.ORIGIN), "clip": list(CLIP), "core": list(CORE),
            "ground": {**gt, "grass_mask": {"file": "grass_mask.png", "cell_ft": veg["cell_ft"], "w": int(veg["grass_mask"].shape[1]), "h": int(veg["grass_mask"].shape[0])}},
            "buildings": buildings, "roads": roads, "areas": areas, "trees": trees}
    json.dump(site, open(OUT / "site.json", "w"), separators=(",", ":"))
    json.dump(trees, open(OUT / "trees.json", "w"), separators=(",", ":"))
    json.dump(tufts, open(OUT / "tufts.json", "w"), separators=(",", ":"))
    print(f"buildings {len(buildings)} roads {len(roads)} areas {len(areas)} trees {len(trees)} tufts {len(tufts)}")


if __name__ == "__main__":
    main()
