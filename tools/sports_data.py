#!/usr/bin/env python3
"""운동 시설 외곽선 → viewer/assets/sports.json (viewer/lib/sports.js 가 사용)

OSM leisure=pitch/stadium 폴리곤을 로컬 ft 좌표로 바꿔 종목별로 나눈다.
  tennis / pickleball : 코트 외곽 (OSM 이 위성과 ±1 ft 일치)
  blocks              : 테니스 단지의 남색 포장 구획 (leisure=stadium)
  volley              : 모래 비치발리볼 코트
  fields              : 그 밖의 경기장 (소프트볼, 야구, 축구 연습장, Price Field) — name/sport 태그 포함
캠퍼스 범위(site.json clip) 밖은 버린다. 다이아몬드 방향·펜스 거리 등은 위성에서 잰 값으로 sports.js 에 있다.
"""
import json, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
import geo

clip = json.load(open(ROOT / "viewer/assets/site.json"))["clip"]
d = json.load(open(ROOT / "data/osm_roads_etc.geojson", encoding="utf-8"))
out = {"tennis": [], "pickleball": [], "blocks": [], "volley": [], "fields": []}
for f in d["features"]:
    t, g = f["properties"], f["geometry"]
    if g["type"] != "Polygon" or t.get("leisure") not in ("pitch", "stadium"):
        continue
    pts = [[round(v, 1) for v in geo.ll_to_xz(c[1], c[0])] for c in g["coordinates"][0][:-1]]
    cx = sum(p[0] for p in pts) / len(pts); cz = sum(p[1] for p in pts) / len(pts)
    if not (clip[0] <= cx <= clip[2] and clip[1] <= cz <= clip[3]):
        continue
    sp = t.get("sport", "")
    if sp == "tennis": out["tennis"].append(pts)
    elif sp == "pickleball": out["pickleball"].append(pts)
    elif sp == "beachvolleyball": out["volley"].append(pts)
    elif t.get("leisure") == "stadium" and -700 < cx < -400 and cz < -600: out["blocks"].append(pts)
    elif t.get("leisure") == "pitch":
        out["fields"].append({"name": t.get("name", ""), "sport": sp, "poly": pts})
json.dump(out, open(ROOT / "viewer/assets/sports.json", "w"), separators=(",", ":"))
print({k: len(v) for k, v in out.items()})
