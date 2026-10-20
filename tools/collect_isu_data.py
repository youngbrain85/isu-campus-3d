#!/usr/bin/env python3
"""
Indiana State University (Terre Haute, IN) – online data collection for 3D campus modelling.

Run this on your own PC (Windows: `py collect_isu_data.py`), because the cloud session that
builds the model cannot reach OpenStreetMap / Esri / Google from inside its sandbox.

What it collects into ./isu_data/ :
  1. osm_buildings.geojson   – every OSM building footprint inside the campus bbox, with name,
                               height / building:levels / roof tags when present  (Overpass API)
  2. osm_roads_etc.geojson   – roads, footways, parking, grass, water, trees (for the ground plane)
  3. imagery/esri_z19.png    – stitched Esri World Imagery (satellite) at zoom 19 + a .pgw world
                               file and bounds.json so it can be georeferenced later
  4. imagery/esri_z20.png    – same at zoom 20 (if available) for facade/roof detail
  5. streetview/<id>_<heading>.jpg – OPTIONAL. Only if you set GOOGLE_MAPS_API_KEY below or in the
                               environment: Street View Static API shots looking at each named
                               building from the nearest street, 4 headings each.
  6. buildings_index.csv     – one row per named building: osm id, name, centroid lat/lon,
                               footprint area (m²), levels, height tags – the checklist for modelling.

Requires:  pip install requests pillow
"""
import csv, json, math, os, sys, time
from pathlib import Path

try:
    import requests
    from PIL import Image
except ImportError:
    sys.exit("pip install requests pillow   (then run again)")

# ------------------------------------------------------------------ settings
# Main campus bounding box (south, west, north, east). Generous: covers 3rd St .. 9th St, Cherry St .. Tippecanoe St
BBOX = (39.4645, -87.4185, 39.4775, -87.4020)
OUT = Path("isu_data")
GOOGLE_MAPS_API_KEY = os.environ.get("GOOGLE_MAPS_API_KEY", "")   # optional
OVERPASS_URLS = ["https://overpass-api.de/api/interpreter", "https://overpass.kumi.systems/api/interpreter"]
ESRI_TILE = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
UA = {"User-Agent": "isu-campus-3d data collector (educational use)"}

(OUT / "imagery").mkdir(parents=True, exist_ok=True)
(OUT / "streetview").mkdir(parents=True, exist_ok=True)

# ------------------------------------------------------------------ 1-2. OpenStreetMap via Overpass
def overpass(query):
    for url in OVERPASS_URLS:
        for attempt in range(3):
            try:
                r = requests.post(url, data={"data": query}, headers=UA, timeout=180)
                if r.status_code == 200:
                    return r.json()
                print(f"  overpass {url} -> HTTP {r.status_code}, retrying")
            except Exception as e:
                print(f"  overpass {url} failed: {e}")
            time.sleep(5 * (attempt + 1))
    raise SystemExit("Overpass API unreachable; try again later")

def osm_to_geojson(data, want):
    """Convert Overpass JSON (with out geom) to GeoJSON features for ways/relations whose tags match `want`."""
    feats = []
    for el in data["elements"]:
        tags = el.get("tags", {})
        if not want(tags):
            continue
        if el["type"] == "way" and "geometry" in el:
            coords = [[p["lon"], p["lat"]] for p in el["geometry"]]
            closed = len(coords) > 3 and coords[0] == coords[-1]
            geom = {"type": "Polygon", "coordinates": [coords]} if closed else {"type": "LineString", "coordinates": coords}
        elif el["type"] == "relation" and "members" in el:
            outers = [[[p["lon"], p["lat"]] for p in m["geometry"]] for m in el["members"] if m.get("role") == "outer" and "geometry" in m]
            inners = [[[p["lon"], p["lat"]] for p in m["geometry"]] for m in el["members"] if m.get("role") == "inner" and "geometry" in m]
            if not outers:
                continue
            geom = {"type": "Polygon", "coordinates": outers[:1] + inners}
        elif el["type"] == "node":
            geom = {"type": "Point", "coordinates": [el["lon"], el["lat"]]}
        else:
            continue
        feats.append({"type": "Feature", "id": f'{el["type"]}/{el["id"]}', "properties": tags | {"osm_type": el["type"], "osm_id": el["id"]}, "geometry": geom})
    return {"type": "FeatureCollection", "features": feats}

s, w, n, e = BBOX
print("1/5  Downloading OSM buildings …")
q_build = f"""[out:json][timeout:180];
( way["building"]({s},{w},{n},{e}); relation["building"]({s},{w},{n},{e}); );
out geom tags;"""
buildings = osm_to_geojson(overpass(q_build), lambda t: "building" in t)
(OUT / "osm_buildings.geojson").write_text(json.dumps(buildings, indent=1))
print(f"     {len(buildings['features'])} building footprints")

print("2/5  Downloading OSM roads / paths / landuse / trees …")
q_ctx = f"""[out:json][timeout:180];
( way["highway"]({s},{w},{n},{e});
  way["amenity"="parking"]({s},{w},{n},{e});
  way["landuse"]({s},{w},{n},{e});
  way["leisure"]({s},{w},{n},{e});
  way["natural"]({s},{w},{n},{e});
  node["natural"="tree"]({s},{w},{n},{e});
  way["railway"]({s},{w},{n},{e});
  way["waterway"]({s},{w},{n},{e}); );
out geom tags;"""
ctx = osm_to_geojson(overpass(q_ctx), lambda t: True)
(OUT / "osm_roads_etc.geojson").write_text(json.dumps(ctx, indent=1))
print(f"     {len(ctx['features'])} context features")

# ------------------------------------------------------------------ 3-4. Esri World Imagery tiles
def deg2tile(lat, lon, z):
    n = 2 ** z
    x = (lon + 180) / 360 * n
    y = (1 - math.log(math.tan(math.radians(lat)) + 1 / math.cos(math.radians(lat))) / math.pi) / 2 * n
    return x, y

def tile2deg(x, y, z):
    n = 2 ** z
    lon = x / n * 360 - 180
    lat = math.degrees(math.atan(math.sinh(math.pi * (1 - 2 * y / n))))
    return lat, lon

def fetch_imagery(z, name):
    x0, y1 = deg2tile(s, w, z); x1, y0 = deg2tile(n, e, z)
    tx0, tx1, ty0, ty1 = int(x0), int(x1), int(y0), int(y1)
    W, H = (tx1 - tx0 + 1) * 256, (ty1 - ty0 + 1) * 256
    print(f"{name}: {(tx1-tx0+1)*(ty1-ty0+1)} tiles, {W}x{H} px")
    canvas = Image.new("RGB", (W, H))
    sess = requests.Session()
    for ty in range(ty0, ty1 + 1):
        for tx in range(tx0, tx1 + 1):
            for attempt in range(3):
                try:
                    r = sess.get(ESRI_TILE.format(z=z, x=tx, y=ty), headers=UA, timeout=60)
                    if r.status_code == 200:
                        from io import BytesIO
                        canvas.paste(Image.open(BytesIO(r.content)).convert("RGB"), ((tx - tx0) * 256, (ty - ty0) * 256))
                        break
                except Exception as ex:
                    print("   tile retry", tx, ty, ex)
                time.sleep(1)
    canvas.save(OUT / "imagery" / f"{name}.png")
    lat_n, lon_w = tile2deg(tx0, ty0, z); lat_s, lon_e = tile2deg(tx1 + 1, ty1 + 1, z)
    bounds = {"zoom": z, "north": lat_n, "south": lat_s, "west": lon_w, "east": lon_e, "width_px": W, "height_px": H,
              "note": "Web-Mercator tiles; pixel rows are NOT linear in latitude. Use mercator maths or the bounds + zoom to georeference."}
    (OUT / "imagery" / f"{name}.json").write_text(json.dumps(bounds, indent=1))

print("3/5  Esri World Imagery zoom 19 …"); fetch_imagery(19, "esri_z19")
print("4/5  Esri World Imagery zoom 20 …"); fetch_imagery(20, "esri_z20")

# ------------------------------------------------------------------ 6. building index
def ring_area_m2(ring):
    # shoelace on a local equirectangular projection
    lat0 = sum(p[1] for p in ring) / len(ring)
    kx = 111320 * math.cos(math.radians(lat0)); ky = 110540
    pts = [((p[0] - ring[0][0]) * kx, (p[1] - ring[0][1]) * ky) for p in ring]
    a = 0
    for i in range(len(pts) - 1):
        a += pts[i][0] * pts[i + 1][1] - pts[i + 1][0] * pts[i][1]
    return abs(a) / 2

rows = []
for f in buildings["features"]:
    if f["geometry"]["type"] != "Polygon":
        continue
    ring = f["geometry"]["coordinates"][0]
    p = f["properties"]
    lon = sum(q[0] for q in ring) / len(ring); lat = sum(q[1] for q in ring) / len(ring)
    rows.append({"osm": f["id"], "name": p.get("name", ""), "lat": round(lat, 6), "lon": round(lon, 6),
                 "area_m2": round(ring_area_m2(ring)), "levels": p.get("building:levels", ""), "height_m": p.get("height", ""),
                 "building": p.get("building", ""), "roof": p.get("roof:shape", ""), "addr": f'{p.get("addr:housenumber","")} {p.get("addr:street","")}'.strip()})
rows.sort(key=lambda r: (-bool(r["name"]), -r["area_m2"]))
with open(OUT / "buildings_index.csv", "w", newline="", encoding="utf-8") as fh:
    wr = csv.DictWriter(fh, fieldnames=list(rows[0].keys())); wr.writeheader(); wr.writerows(rows)
print(f"5/5  buildings_index.csv: {len(rows)} footprints, {sum(1 for r in rows if r['name'])} named")

# ------------------------------------------------------------------ optional Street View
if GOOGLE_MAPS_API_KEY:
    print("Street View Static API: fetching 4 views per named building …")
    for r in rows:
        if not r["name"]:
            continue
        for heading in (0, 90, 180, 270):
            # stand ~60 m away in the opposite direction of `heading`, look toward the building
            d = 60 / 111320
            lat = r["lat"] - d * math.cos(math.radians(heading)); lon = r["lon"] - d * math.sin(math.radians(heading)) / math.cos(math.radians(r["lat"]))
            url = ("https://maps.googleapis.com/maps/api/streetview?size=640x480&fov=90&pitch=5&radius=80&source=outdoor"
                   f"&location={lat},{lon}&heading={heading}&key={GOOGLE_MAPS_API_KEY}")
            try:
                img = requests.get(url, timeout=60)
                if img.status_code == 200 and len(img.content) > 5000:
                    safe = "".join(c if c.isalnum() else "_" for c in r["name"])[:40]
                    (OUT / "streetview" / f'{safe}_{r["osm"].replace("/", "_")}_{heading}.jpg').write_bytes(img.content)
            except Exception as ex:
                print("   streetview failed", r["name"], heading, ex)
            time.sleep(0.2)
else:
    print("No GOOGLE_MAPS_API_KEY set – skipped Street View (optional).")

print(f"\nDone. Zip the '{OUT}' folder and upload it to the chat.")
