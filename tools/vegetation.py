#!/usr/bin/env python3
"""위성영상(Esri z19, 여름 촬영)에서 수관·잔디를 분류해 수목 위치/크기와 잔디 마스크를 만든다.

- 수관: 식생지수(ExG) 높음 + 어두움 + 국소 명암 변화 큼(그림자·질감) -> 거리변환 피크 = 나무 1그루, 피크 거리 = 수관 반지름
- 잔디: 식생지수 높음 + 밝음 + 매끈함
- 건물 footprint(팽창) 는 제외
좌표: 로컬 평면 ft (x 동, z 남).
"""
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage
import geo

Image.MAX_IMAGE_PIXELS = None


def classify(png, bounds_json, building_rings_ll, clip):
    """clip = (x0, z0, x1, z1) 로컬 ft. 반환 dict: trees [[x, z, h, variant, source=1, crown_r]], grass_mask, canopy_mask (uint8, cell_ft 격자)"""
    m = geo.MosaicBounds(bounds_json)
    im = Image.open(png).convert("RGB")
    A = np.asarray(im).astype(np.float32)
    R, G, B = A[..., 0], A[..., 1], A[..., 2]
    ft_per_px = (m.east - m.west) * geo.M_PER_DEG_LON * geo.FT_PER_M / m.w
    bright = (R + G + B) / 3
    exg = 2 * G - R - B
    s = 3.0 * 0.756 / ft_per_px          # 창 ~2.3 ft
    m1 = ndimage.gaussian_filter(bright, s); m2 = ndimage.gaussian_filter(bright * bright, s)
    std = np.sqrt(np.maximum(m2 - m1 * m1, 0))
    veg = (exg > 18) & (G > R + 6)
    canopy = veg & (bright < 105) & (std > 7)
    grass = veg & (bright >= 95) & (std < 9)
    bmask = Image.new("L", im.size, 0); d = ImageDraw.Draw(bmask)
    for ring in building_rings_ll:
        d.polygon([m.px_of(p[1], p[0]) for p in ring], fill=255)
    bm = ndimage.binary_dilation(np.asarray(bmask) > 0, iterations=int(6 / ft_per_px))   # 건물 + 6 ft (그림자 가장자리 오검출 방지)
    canopy &= ~bm; grass &= ~bm
    canopy = ndimage.binary_opening(canopy, iterations=2)
    canopy = ndimage.binary_closing(canopy, iterations=3)
    grass = ndimage.binary_opening(grass, iterations=3) & ~canopy

    # ---- 나무: 거리변환 피크
    dt = ndimage.distance_transform_edt(canopy)
    win = max(3, int(20 / ft_per_px))
    peaks = (dt == ndimage.maximum_filter(dt, size=win)) & (dt > 5.5 / ft_per_px)
    ys, xs = np.nonzero(peaks)
    rng = np.random.default_rng(7)
    trees = []
    x0, z0, x1, z1 = clip
    for y, x in zip(ys, xs):
        lat, lon = m.ll_of(x + 0.5, y + 0.5)
        xl, zl = geo.ll_to_xz(lat, lon)
        if not (x0 <= xl <= x1 and z0 <= zl <= z1):
            continue
        r = min(float(dt[y, x]) * ft_per_px * 1.15 + 2.0, 32.0)   # 수관 반지름 (ft), 거리변환 과소평가 보정
        h = float(np.clip(r * 2.0 + 10 + rng.uniform(-4, 4), 16, 65))
        trees.append([round(xl, 1), round(zl, 1), round(h, 1), int(rng.integers(0, 3)), 1, round(r, 1)])

    # ---- 잔디/수관 마스크를 로컬 격자(cell_ft)로 재투영
    cell_ft = 3.0
    nx, nz = int((x1 - x0) / cell_ft), int((z1 - z0) / cell_ft)
    xs_ft = x0 + (np.arange(nx) + 0.5) * cell_ft
    zs_ft = z0 + (np.arange(nz) + 0.5) * cell_ft
    lon = geo.ORIGIN[1] + xs_ft / geo.FT_PER_M / geo.M_PER_DEG_LON
    lat = geo.ORIGIN[0] - zs_ft / geo.FT_PER_M / geo.M_PER_DEG_LAT
    nn = 2 ** m.zoom * 256
    px = (lon + 180) / 360 * nn
    py = (1 - np.log(np.tan(np.radians(lat)) + 1 / np.cos(np.radians(lat))) / np.pi) / 2 * nn
    col = np.clip(((px - m.x0) / (m.x1 - m.x0) * m.w).astype(np.int32), 0, m.w - 1)
    row = np.clip(((py - m.y0) / (m.y1 - m.y0) * m.h).astype(np.int32), 0, m.h - 1)
    cmask = canopy[row[:, None], col[None, :]].astype(np.uint8)
    return {"trees": trees, "canopy_mask": cmask, "cell_ft": cell_ft, "origin": (x0, z0), "ft_per_px": ft_per_px, "size": (nx, nz)}


def grass_mask_from_site(veg, buildings, roads, areas, clip):
    """잔디 = 범위 안에서 건물(+4 ft)·도로·보도·주차장·수관이 아닌 곳. 로컬 격자(cell_ft) uint8 마스크."""
    cell = veg["cell_ft"]; nx, nz = veg["size"]; x0, z0 = veg["origin"]
    im = Image.new("L", (nx, nz), 255); d = ImageDraw.Draw(im)
    P = lambda p: ((p[0] - x0) / cell, (p[1] - z0) / cell)
    for b in buildings:
        d.polygon([P(p) for p in b["poly"]], fill=0)
    for a in areas:
        if a["kind"] in ("parking", "water", "pitch"):
            d.polygon([P(p) for p in a["poly"]], fill=0)
    for r in roads:
        w = max(1, int((r["w"] + (6 if r["kind"] == "road" else 2)) / cell))
        d.line([P(p) for p in r["pts"]], fill=0, width=w)
    g = np.asarray(im) > 0
    g &= ndimage.binary_dilation(np.zeros_like(g), iterations=1) | True
    g &= ~(veg["canopy_mask"] > 0)
    g = ndimage.binary_erosion(g, iterations=1)           # 건물 가장자리 4 ft 여유
    return g.astype(np.uint8)


def grass_tufts(grass_mask, cell_ft, origin, step_ft=6.0, keep=0.5, seed=5):
    """잔디 마스크 위에 step_ft 격자로 풀 포기 위치 생성"""
    rng = np.random.default_rng(seed)
    out = []
    nz, nx = grass_mask.shape
    stride = max(1, int(step_ft / cell_ft))
    for j in range(0, nz, stride):
        z = origin[1] + (j + 0.5) * cell_ft
        for i in range(0, nx, stride):
            if grass_mask[j, i] and rng.random() < keep:
                x = origin[0] + (i + 0.5) * cell_ft
                out.append([round(x + rng.uniform(-2.5, 2.5), 1), round(z + rng.uniform(-2.5, 2.5), 1)])
    return out
