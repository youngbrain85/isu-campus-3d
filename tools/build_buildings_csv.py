#!/usr/bin/env python3
"""
data/buildings.csv 생성: OSM 건물 외곽선(data/osm_buildings.geojson) + 수작업 조사표(data/building_facts.csv)
+ 공식 캠퍼스 지도 번호를 합쳐 모델링용 건물 목록을 만든다.

열: name, osm_id, lat, lon, levels, height_m, year, source, detail_level, map_no, building, area_m2, roof_shape, notes

규칙
- facts 표에 있는 건물은 그 값을 우선한다 (detail_level: drawing / drawing-plan / mass+photo / mass).
- 나머지 footprint 는 OSM 태그(building:levels, height)를 쓰고, 없으면 건물 용도별 기본 층수로 추정한다 (source=estimate).
- height_m 이 비어 있으면 층수 × 층고(용도별)로 계산한다. 이 값은 뷰어에서 매스 모델 높이로 쓰인다.
"""
import csv, json, math
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "data"
B = json.load(open(ROOT / "osm_buildings.geojson", encoding="utf-8"))
facts = {r["osm_id"]: r for r in csv.DictReader(open(ROOT / "building_facts.csv", encoding="utf-8"))}

# 용도별 기본 층수와 층고(m)
DEFAULT_LEVELS = {"university": 3, "dormitory": 4, "apartments": 3, "residential": 2, "house": 2, "detached": 2,
                  "commercial": 2, "retail": 1, "office": 3, "civic": 3, "public": 2, "church": 1, "hotel": 4,
                  "parking": 4, "garage": 1, "garages": 1, "industrial": 1, "warehouse": 1, "roof": 1, "shed": 1,
                  "service": 1, "farm_auxiliary": 1, "fire_station": 2, "hospital": 3, "school": 2, "yes": 2}
STOREY_M = {"church": 9.0, "retail": 4.5, "commercial": 4.0, "university": 4.0, "civic": 4.5, "public": 4.0,
            "industrial": 6.0, "warehouse": 6.0, "parking": 3.0, "garage": 3.0, "shed": 3.0, "roof": 3.5}

def ring_area_m2(ring):
    lat0 = sum(p[1] for p in ring) / len(ring)
    kx = 111320 * math.cos(math.radians(lat0)); ky = 110540
    pts = [((p[0] - ring[0][0]) * kx, (p[1] - ring[0][1]) * ky) for p in ring]
    a = 0.0
    for i in range(len(pts) - 1):
        a += pts[i][0] * pts[i + 1][1] - pts[i + 1][0] * pts[i][1]
    return abs(a) / 2

rows = []
for f in B["features"]:
    if f["geometry"]["type"] != "Polygon":
        continue
    ring = f["geometry"]["coordinates"][0]
    p = f["properties"]
    oid = f["id"]
    lat = round(sum(q[1] for q in ring) / len(ring), 6); lon = round(sum(q[0] for q in ring) / len(ring), 6)
    btype = p.get("building", "yes")
    fact = facts.get(oid, {})
    name = fact.get("name") or p.get("name", "")
    levels = fact.get("levels") or p.get("building:levels", "")
    source = fact.get("source", "")
    if not levels:
        levels = DEFAULT_LEVELS.get(btype, 2); source = "estimate (building type default)"
    elif not fact.get("levels") and p.get("building:levels"):
        source = "OSM building:levels"
    levels = int(float(levels))
    height = fact.get("height_m") or p.get("height", "")
    if not height:
        height = round(levels * STOREY_M.get(btype, 3.5) + (1.0 if btype not in ("church",) else 0.0), 1)
        hsrc = "levels x storey height"
    else:
        height = float(height); hsrc = "published/OSM"
    rows.append({
        "name": name, "osm_id": oid, "lat": lat, "lon": lon, "levels": levels, "height_m": height,
        "year": fact.get("year", ""), "source": source + (f"; height: {hsrc}" if name else ""),
        "detail_level": fact.get("detail_level", "mass"), "map_no": fact.get("map_no", ""),
        "building": btype, "area_m2": round(ring_area_m2(ring)), "roof_shape": p.get("roof:shape", ""),
        "notes": fact.get("notes", ""),
    })

order = {"drawing": 0, "drawing-plan": 1, "mass+photo": 2, "mass": 3}
rows.sort(key=lambda r: (order[r["detail_level"]], -bool(r["name"]), -r["area_m2"]))
out = ROOT / "buildings.csv"
with open(out, "w", newline="", encoding="utf-8") as fh:
    w = csv.DictWriter(fh, fieldnames=list(rows[0].keys())); w.writeheader(); w.writerows(rows)
missing = [k for k in facts if k not in {r["osm_id"] for r in rows}]
print(f"{len(rows)} buildings -> {out}; detail counts:", {k: sum(1 for r in rows if r['detail_level'] == k) for k in order})
if missing:
    print("WARNING facts without OSM footprint:", missing)
