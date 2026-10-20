#!/usr/bin/env python3
"""
도면 폴더(D:\\Projects\\Drawings\\ISU Files, 읽기 전용)를 훑어 파일 단위 목록을 만든다.

출력: data/drawings_files.csv
  set         : 최상위 폴더(= 건물/프로젝트)
  path        : 폴더 기준 상대 경로
  pages       : PDF 페이지 수
  sheet_in    : 첫 페이지 크기 (inch, 가로x세로)
  text        : vector(텍스트 추출 가능) / scan(래스터, 텍스트 없음) / n/a
  size_mb     : 파일 크기

사용:  python tools/inventory_drawings.py ["D:/Projects/Drawings/ISU Files"]
사람이 읽는 요약(data/drawings_inventory.md)은 이 CSV와 시트 썸네일 육안 확인을 바탕으로 따로 작성했다.
"""
import csv, os, sys
from pathlib import Path

try:
    import fitz  # PyMuPDF
except ImportError:
    sys.exit("pip install pymupdf")

ROOT = Path(sys.argv[1] if len(sys.argv) > 1 else r"D:\Projects\Drawings\ISU Files")
OUT = Path(__file__).resolve().parent.parent / "data" / "drawings_files.csv"
SKIP_DIRS = {"isu_data"}            # 이 폴더에 있던 온라인 수집 결과물은 도면이 아님
SKIP_EXT = {".icloud"}              # iCloud 미다운로드 스텁

rows = []
for p in sorted(ROOT.rglob("*")):
    if not p.is_file():
        continue
    rel = p.relative_to(ROOT)
    if rel.parts[0] in SKIP_DIRS or p.suffix.lower() in SKIP_EXT:
        continue
    row = {"set": rel.parts[0] if len(rel.parts) > 1 else "(root)", "path": rel.as_posix(),
           "pages": "", "sheet_in": "", "text": "n/a", "size_mb": round(p.stat().st_size / 1e6, 2)}
    if p.suffix.lower() == ".pdf":
        try:
            d = fitz.open(p)
            pg = d[0]
            row["pages"] = len(d)
            row["sheet_in"] = f"{pg.rect.width / 72:.0f}x{pg.rect.height / 72:.0f}"
            chars = sum(len(d[i].get_text()) for i in range(min(3, len(d))))
            row["text"] = "vector" if chars > 200 else "scan"
        except Exception as e:  # 손상 파일 등
            row["text"] = f"error: {e}"
    rows.append(row)

OUT.parent.mkdir(parents=True, exist_ok=True)
with open(OUT, "w", newline="", encoding="utf-8") as fh:
    w = csv.DictWriter(fh, fieldnames=list(rows[0].keys()))
    w.writeheader(); w.writerows(rows)

by_set = {}
for r in rows:
    s = by_set.setdefault(r["set"], {"files": 0, "pages": 0, "mb": 0.0})
    s["files"] += 1; s["pages"] += int(r["pages"] or 0); s["mb"] += r["size_mb"]
for k, v in by_set.items():
    print(f'{k:48} files={v["files"]:4} pages={v["pages"]:4} {v["mb"]:8.1f} MB')
print(f"-> {OUT} ({len(rows)} files)")
