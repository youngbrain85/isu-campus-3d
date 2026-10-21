#!/usr/bin/env python3
"""건물 클릭 정보 패널용 데이터 → viewer/assets/info.json

입력: data/building_facts.csv (조사표), data/buildings.csv (OSM 병합 목록), viewer/buildings/*.js (모듈 meta: 이름, 높이, 근거),
      viewer/assets/site.json (캠퍼스 범위 내 건물 id)
출력: { "<osm id>": {name, map_no, year, storeys, height_ft, model, sources, notes, module} }
  model = "Construction drawings" | "Street View photos + satellite imagery" | "Satellite imagery"
"""
import csv, json, re, sys
from pathlib import Path

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass
ROOT = Path(__file__).resolve().parent.parent
site = json.load(open(ROOT / "viewer/assets/site.json"))
facts = {r["osm_id"]: r for r in csv.DictReader(open(ROOT / "data/building_facts.csv", encoding="utf-8"))}
rows = {r["osm_id"]: r for r in csv.DictReader(open(ROOT / "data/buildings.csv", encoding="utf-8"))}

# 모듈 meta 파싱 (osm, extraIds, name, height, sheets)
mods = {}
for f in sorted((ROOT / "viewer/buildings").glob("*.js")):
    if f.name == "index.js":
        continue
    s = f.read_text(encoding="utf-8")
    m = re.search(r"export const meta\s*=\s*\{(.*?)\n\};", s, re.S)
    if not m:
        continue
    body = m.group(1)
    g = lambda k: (re.search(k + r":\s*'([^']*)'", body) or [None, ""])[1]
    osm = g("osm")
    extra = re.findall(r"(?:way|relation)/\d+", (re.search(r"extraIds:\s*\[([^\]]*)\]", body) or [None, ""])[1] or "")
    h = re.search(r"height:\s*([\d.]+)", body)
    drawing = "fit_footprint" in s or "RMS" in body
    sheets = g("sheets")
    for oid in [osm] + extra:
        mods[oid] = {"module": f.name, "mod_name": g("name"), "height": float(h.group(1)) if h else None,
                     "drawing": drawing, "sheets": sheets, "shared": len(extra) > 0}

reg = set(re.findall(r"'((?:way|relation)/\d+)'", (ROOT / "viewer/buildings/index.js").read_text(encoding="utf-8")))
active = set()
for oid, m in mods.items():
    pass
for f in sorted((ROOT / "viewer/buildings").glob("*.js")):
    s = f.read_text(encoding="utf-8")
    o = re.search(r"osm:\s*'((?:way|relation)/\d+)'", s)
    if o and o.group(1) in reg:
        active.add(o.group(1))
        ex = re.search(r"extraIds:\s*\[([^\]]*)\]", s)
        if ex:
            active |= set(re.findall(r"(?:way|relation)/\d+", ex.group(1)))

HANGUL = re.compile(r"[ㄱ-힝][^,;)]*")
def clean(t):
    t = HANGUL.sub("", t or "")
    t = re.sub(r"\(\+[^)]*\)", "", t)          # 괄호 안 보충 메모 제거
    t = re.sub(r"\(\s*[+,]?\s*\)", "", t)
    t = re.sub(r"\s*\(\+\s*$", "", t)
    return re.sub(r"\s{2,}", " ", t).strip(" ,;(")

out = {}
for b in site["buildings"]:
    oid = b["id"]; fct = facts.get(oid, {}); row = rows.get(oid, {}); md = mods.get(oid) if oid in active else None
    name = fct.get("name") or row.get("name") or b.get("name") or ""
    if not name and md and not md["shared"]:
        name = md["mod_name"]
    if md and md["drawing"]:
        model = "Construction drawings"
    elif md and "Street View" in md["sheets"] and "no usable Street View" not in md["sheets"] and "no Street View" not in md["sheets"]:
        model = "Street View photos + satellite imagery"
    elif md:
        model = "Satellite imagery (no usable Street View)"
    else:
        model = "OpenStreetMap footprint (simple mass)"
    storeys = fct.get("levels") or row.get("levels") or ""
    height = md["height"] if md and md["height"] and not md["shared"] else (round(float(row["height_m"]) * 3.28084) if row.get("height_m") else None)
    out[oid] = {
        "name": name or "Unnamed building",
        "map_no": fct.get("map_no", ""),
        "year": fct.get("year", ""),
        "storeys": storeys,
        "height_ft": height,
        "model": model,
        "sources": clean(md["sheets"]) if md else "OpenStreetMap",
        "notes": "" if (md and not md["drawing"]) else clean(fct.get("notes", "")),
        "module": md["module"] if md else "",
    }
json.dump(out, open(ROOT / "viewer/assets/info.json", "w", encoding="utf-8"), ensure_ascii=False, indent=0)
print(len(out), "buildings ->", ROOT / "viewer/assets/info.json")
print(sum(1 for v in out.values() if v["name"] != "Unnamed building"), "named")
