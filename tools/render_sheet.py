#!/usr/bin/env python3
"""도면 PDF 페이지(또는 일부)를 PNG 로 렌더링하는 모델링 보조 도구. 출력은 저장소 밖(scratch 폴더)에 둔다.

사용: python tools/render_sheet.py "<pdf>" <page(1-based)> [--dpi 150] [--clip x0,y0,x1,y1] [--scale 1/8] [--out name] [--outdir DIR]
  --clip  페이지 비율(0..1) 사각형
  --scale 도면 축척(인치/피트, 예: 1/8 → 1/8" = 1'-0")  → px_per_ft 출력
  --outdir 기본값: 환경변수 SHEET_OUT 또는 ./scratch/sheets
"""
import argparse, os, sys
from pathlib import Path
import fitz

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

ap = argparse.ArgumentParser()
ap.add_argument("pdf"); ap.add_argument("page", type=int)
ap.add_argument("--dpi", type=float, default=150)
ap.add_argument("--clip", default=None)
ap.add_argument("--scale", default=None)
ap.add_argument("--out", default=None)
ap.add_argument("--outdir", default=os.environ.get("SHEET_OUT", "scratch/sheets"))
a = ap.parse_args()

doc = fitz.open(a.pdf); pg = doc[a.page - 1]
w, h = pg.rect.width, pg.rect.height
clip = None
if a.clip:
    x0, y0, x1, y1 = [float(v) for v in a.clip.split(",")]
    clip = fitz.Rect(w * x0, h * y0, w * x1, h * y1)
pix = pg.get_pixmap(matrix=fitz.Matrix(a.dpi / 72, a.dpi / 72), clip=clip)
outdir = Path(a.outdir); outdir.mkdir(parents=True, exist_ok=True)
name = a.out or (Path(a.pdf).stem.replace(" ", "_") + f"_p{a.page}")
path = outdir / f"{name}.png"
pix.save(str(path))
msg = f"{path} {pix.width}x{pix.height}px dpi={a.dpi:g}"
if a.scale:
    num, den = (a.scale.split("/") + ["1"])[:2]
    inch_per_ft = float(num) / float(den)
    msg += f" px_per_ft={a.dpi * inch_per_ft:.4f} (scale {a.scale}\" = 1')"
print(msg)
