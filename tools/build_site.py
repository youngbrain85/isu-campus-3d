#!/usr/bin/env python3
"""OSM + buildings.csv + Esri 모자이크 → viewer/assets/site.json, ground 타일, 수목 목록.

site.json 좌표: 로컬 평면 피트, x=동, z=남. 폴리곤은 위에서 봤을 때 반시계(CCW), 닫는 점 제거.
ground_{r}_{c}.jpg: EXTENT ft 정사각형을 TILES×TILES 로 나눈 타일, 픽셀 (0,0)=북서 모서리.
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
import geo
Image.MAX_IMAGE_PIXELS = None

ROOT = Path(__file__).resolve().parent.parent
DATA, OUT = ROOT / "data", ROOT / "viewer" / "assets"
EXTENT, TILES, TILE_PX = 4800, 2, 4096           # 지면 4800 ft 정사각형, 2×2 타일

ROAD_W = {"trunk": 48, "primary": 48, "secondary": 40, "tertiary": 36, "residential": 30, "unclassified": 26,
          "service": 20, "living_street": 24, "footway": 8, "cycleway": 8, "path": 6, "pedestrian": 12, "steps": 6}
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


def ground_tiles(png, bounds_json, out_dir, extent=EXTENT, tiles=TILES, tile_px=TILE_PX):
    """Web-Mercator 모자이크를 로컬 평면(피트) 격자로 재투영해 tiles×tiles JPEG 타일 저장 (행 청크 처리로 메모리 절약)"""
    m = geo.MosaicBounds(bounds_json)
    img = np.asarray(Image.open(png).convert("RGB"))
    px_per_ft = tile_px * tiles / extent
    n = 2 ** m.zoom * 256
    chunk = 512
    for r in range(tiles):
        for c in range(tiles):
            out = np.empty((tile_px, tile_px, 3), np.uint8)
            xs = -extent / 2 + (c * tile_px + np.arange(tile_px, dtype=np.float64) + 0.5) / px_per_ft
            lon = geo.ORIGIN[1] + xs / geo.FT_PER_M / geo.M_PER_DEG_LON
            px = (lon + 180) / 360 * n
            col = np.clip(((px - m.x0) / (m.x1 - m.x0) * m.w).astype(np.int32), 0, m.w - 1)
            for y0 in range(0, tile_px, chunk):
                zs = -extent / 2 + (r * tile_px + np.arange(y0, y0 + chunk, dtype=np.float64) + 0.5) / px_per_ft
                lat = geo.ORIGIN[0] - zs / geo.FT_PER_M / geo.M_PER_DEG_LAT
                py = (1 - np.log(np.tan(np.radians(lat)) + 1 / np.cos(np.radians(lat))) / np.pi) / 2 * n
                row = np.clip(((py - m.y0) / (m.y1 - m.y0) * m.h).astype(np.int32), 0, m.h - 1)
                out[y0:y0 + chunk] = img[row[:, None], col[None, :]]
            Image.fromarray(out).save(out_dir / f"ground_{r}_{c}.jpg", quality=85)
    return px_per_ft


def imagery_trees(png, bounds_json, building_rings_ll, spacing_ft=25, extent=EXTENT):
    """위성영상 녹색 분류로 수목 위치 추출 (건물 내부 제외, 격자 간격 spacing_ft)"""
    m = geo.MosaicBounds(bounds_json)
    im = Image.open(png).convert("RGB")
    scale = 4
    small = im.resize((im.width // scale, im.height // scale), Image.BILINEAR)
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
                lat, lon = m.ll_of((x + step / 2) * scale, (y + step / 2) * scale)
                xl, zl = geo.ll_to_xz(lat, lon)
                if abs(xl) < extent / 2 and abs(zl) < extent / 2:
                    out.append([round(xl + rng.uniform(-6, 6), 1), round(zl + rng.uniform(-6, 6), 1),
                                int(rng.uniform(22, 42)), int(rng.integers(0, 3)), 1])
    return out


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    B = json.load(open(DATA / "osm_buildings.geojson", encoding="utf-8"))
    R = json.load(open(DATA / "osm_roads_etc.geojson", encoding="utf-8"))
    rows = {r["osm_id"]: r for r in csv.DictReader(open(DATA / "buildings.csv", encoding="utf-8"))}
    # 기본은 z19(여름 촬영, 녹색). z20 은 더 선명하지만 겨울 촬영분이라 --z20 옵션으로만 사용
    z20 = DATA / "imagery" / "esri_z20.png"
    if "--z20" in sys.argv and z20.exists():
        png, bj = z20, DATA / "imagery" / "esri_z20.json"
    else:
        png, bj = DATA / "imagery" / "esri_z19.png", DATA / "imagery" / "esri_z19.json"
    mosaic = geo.MosaicBounds(bj); img = Image.open(png).convert("RGB")
    buildings, rings = [], []
    for f in B["features"]:
        if f["geometry"]["type"] != "Polygon":
            continue
        ring = f["geometry"]["coordinates"][0]; row = rows.get(f["id"], {})
        rings.append(ring)
        poly = ring_to_local(ring)
        if len(poly) < 3:
            continue
        tags = f["properties"]
        buildings.append({
            "id": f["id"], "name": row.get("name", "") or tags.get("name", ""), "poly": poly,
            "holes": [ring_to_local(h)[::-1] for h in f["geometry"]["coordinates"][1:]],
            "h": round(float(row.get("height_m", 7) or 7) * geo.FT_PER_M, 1), "levels": int(row.get("levels", 2) or 2),
            "roof": roof_colour(mosaic, img, ring),
            "wall": classify_wall({**row, "building": tags.get("building", "yes")}),
            "detail": row.get("detail_level", "mass"), "roof_shape": tags.get("roof:shape", "flat")})
    roads, areas, trees = [], [], []
    for f in R["features"]:
        g, t = f["geometry"], f["properties"]
        if g["type"] == "LineString" and road_width(t):
            roads.append({"pts": [[round(v, 2) for v in geo.ll_to_xz(p[1], p[0])] for p in g["coordinates"]],
                          "w": road_width(t), "kind": "path" if t["highway"] in PATH_KINDS else "road"})
        elif g["type"] == "Polygon":
            kind = ("parking" if t.get("amenity") == "parking" else
                    "grass" if t.get("landuse") == "grass" or t.get("leisure") in ("park", "garden") else
                    "pitch" if t.get("leisure") in ("pitch", "track") else
                    "water" if t.get("natural") == "water" else
                    "wood" if t.get("natural") == "wood" else None)
            if kind == "wood":
                # OSM 에는 개별 수관이 natural=wood 폴리곤으로 그려져 있음 → 작은 것은 나무 1그루로 변환
                poly = ring_to_local(g["coordinates"][0]); a = abs(signed_area(poly))
                if a < 3000 and len(poly) >= 3:
                    cx = sum(q[0] for q in poly) / len(poly); cz = sum(q[1] for q in poly) / len(poly)
                    trees.append([round(cx, 1), round(cz, 1), int(min(50, max(18, 1.4 * math.sqrt(a)))), len(trees) % 3, 2])
                continue
            if kind:
                areas.append({"poly": ring_to_local(g["coordinates"][0]), "kind": kind})
        elif g["type"] == "Point" and t.get("natural") == "tree":
            x, z = geo.ll_to_xz(g["coordinates"][1], g["coordinates"][0])
            trees.append([round(x, 1), round(z, 1), 32, len(trees) % 3, 0])
    img_trees = imagery_trees(DATA / "imagery" / "esri_z19.png", DATA / "imagery" / "esri_z19.json", rings)
    # OSM 나무와 15 ft 이내로 겹치는 영상 추출 나무는 제거
    cells = {(int(t[0] // 15), int(t[1] // 15)) for t in trees}
    for t in img_trees:
        cx, cz = int(t[0] // 15), int(t[1] // 15)
        if not any((cx + i, cz + j) in cells for i in (-1, 0, 1) for j in (-1, 0, 1)):
            trees.append(t)
    print("ground tiles from", png.name)
    px_per_ft = ground_tiles(png, bj, OUT)
    site = {"origin": list(geo.ORIGIN),
            "ground": {"extent_ft": EXTENT, "tiles": TILES, "tile_px": TILE_PX, "px_per_ft": round(px_per_ft, 4)},
            "buildings": buildings, "roads": roads, "areas": areas, "trees": trees}
    json.dump(site, open(OUT / "site.json", "w"), separators=(",", ":"))
    json.dump(trees, open(OUT / "trees.json", "w"), separators=(",", ":"))
    print(f"buildings {len(buildings)} roads {len(roads)} areas {len(areas)} trees {len(trees)} ground px/ft {px_per_ft:.3f}")


if __name__ == "__main__":
    main()
