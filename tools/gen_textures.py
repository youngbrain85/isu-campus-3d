#!/usr/bin/env python3
"""캠퍼스 모델용 절차적 타일 텍스처 생성 → viewer/assets/

벽 재질(brick_red/brick_brown/brick_tan/limestone/precast/metal/glass/concrete)은 기본 타일과
한 층 분량의 창을 구운 *_win 타일(가로 24 ft × 세로 12 ft 에 대응)을 함께 만든다.
그 외 지붕, 아스팔트, 보도 콘크리트, 잔디, 나뭇잎 스프라이트, 수피, 유리창 1장.
"""
import math, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass
OUT = Path(__file__).resolve().parent.parent / "viewer" / "assets"
OUT.mkdir(parents=True, exist_ok=True)
rng = np.random.default_rng(11)


def tile_noise(n, scales, seed=0, power=1.0):
    """타일링되는 프랙탈 노이즈 [0,1] (랜덤 격자를 wrap 업샘플링해 합산)"""
    r = np.random.default_rng(seed)
    acc = np.zeros((n, n), np.float32); wsum = 0
    for s, w in scales:
        g = r.random((s, s)).astype(np.float32)
        g = np.tile(g, (3, 3))
        im = Image.fromarray(g).resize((n * 3, n * 3), Image.BICUBIC)
        a = np.asarray(im)[n:2 * n, n:2 * n]
        acc += a * w; wsum += w
    acc /= wsum
    acc = (acc - acc.min()) / (acc.max() - acc.min() + 1e-6)
    return acc ** power


def to_normal(h, strength=2.0):
    gy, gx = np.gradient(h.astype(np.float32))
    nx = -gx * strength; ny = -gy * strength; nz = np.ones_like(h)
    l = np.sqrt(nx * nx + ny * ny + nz * nz)
    n = np.stack([nx / l, ny / l, nz / l], -1)
    return Image.fromarray(((n * 0.5 + 0.5) * 255).astype(np.uint8))


def save(img, name, q=88):
    if isinstance(img, np.ndarray):
        img = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8))
    img.save(OUT / name, quality=q)


# ---------------------------------------------------------------- 벽 재질
def brick(n=512, mortar=(205, 198, 188), base=(150, 72, 52), var=18, seed=5, course=16, length=32):
    """줄눈이 있는 벽돌 타일. course=켜 높이(px), length=벽돌 길이(px). 512px 타일 = 24 ft → 켜 16px = 0.75 ft(≈3켜/ft 아님, 보기용 비율)"""
    r = np.random.default_rng(seed)
    img = np.zeros((n, n, 3), np.float32); img[:] = mortar
    for row in range(n // course):
        y0 = row * course
        off = (length // 2) if row % 2 else 0
        for col in range(-1, n // length + 1):
            x0 = col * length + off
            c = np.array(base, np.float32) + r.uniform(-var, var, 3) + r.uniform(-12, 12)
            img[y0 + 1:y0 + course - 1, max(0, x0 + 1):max(0, min(n, x0 + length - 1))] = c
    noise = tile_noise(n, [(64, 0.6), (256, 1.0)], seed=seed + 1)
    img *= (0.88 + 0.24 * noise[..., None])
    return np.clip(img, 0, 255).astype(np.uint8)


def blocks(n=512, base=(206, 198, 182), mortar=(190, 184, 172), course=40, length=96, var=6, seed=9):
    """석회암/프리캐스트 패널 등 큰 블록 패턴"""
    return brick(n, mortar, base, var, seed, course, length)


def ribs(n=512, base=(160, 165, 170), period=6, seed=13):
    """수직 리브 금속 패널"""
    x = np.arange(n)
    shade = 0.82 + 0.18 * (np.sin(x / period * 2 * math.pi) * 0.5 + 0.5)
    img = np.ones((n, n, 3), np.float32) * np.array(base, np.float32)
    img *= shade[None, :, None]
    img *= (0.95 + 0.1 * tile_noise(n, [(8, 1.0), (128, 0.5)], seed=seed))[..., None]
    return np.clip(img, 0, 255).astype(np.uint8)


def curtain(n=512, glass=(54, 70, 88), mullion=(40, 44, 48), grid=64):
    """커튼월: 유리 바탕 + 멀리언 격자 (1 타일 = 24 ft × 12 ft 에 대응 → 멀리언 3 ft 간격)"""
    img = np.ones((n, n, 3), np.float32) * np.array(glass, np.float32)
    refl = tile_noise(n, [(4, 1.0), (32, 0.4)], seed=21)
    img *= (0.8 + 0.5 * refl[..., None])
    im = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)); d = ImageDraw.Draw(im)
    for k in range(0, n, grid):
        d.line([k, 0, k, n], fill=mullion, width=3); d.line([0, k, n, k], fill=mullion, width=3)
    return np.asarray(im)


def concrete(n=512, seed=1):
    base = tile_noise(n, [(4, 1.0), (8, 0.8), (32, 0.5), (128, 0.35), (256, 0.25)], seed=seed)
    spots = tile_noise(n, [(64, 1.0), (256, 0.6)], seed=seed + 1)
    col = 150 + (base - 0.5) * 40 + (spots - 0.5) * 18
    c = np.stack([col * 1.0, col * 0.99, col * 0.95], -1)
    spk = rng.random((n, n)) < 0.012
    c[spk] *= 0.75
    return np.clip(c, 0, 255).astype(np.uint8)


def bake_windows(wall, tile_ft_w=24, tile_ft_h=12, win=(5, 7), pitch=8, sill=3, frame=(60, 62, 66), glass=(70, 95, 120)):
    """벽 타일 위에 한 층 분량의 창을 그림. 타일 가로 24 ft, 세로 12 ft 에 해당."""
    n = wall.shape[0]; img = Image.fromarray(wall.copy()); d = ImageDraw.Draw(img)
    pxw, pxh = n / tile_ft_w, n / tile_ft_h
    for k in range(int(tile_ft_w // pitch)):
        x0 = (k * pitch + (pitch - win[0]) / 2) * pxw; y1 = n - sill * pxh; y0 = y1 - win[1] * pxh
        x1 = x0 + win[0] * pxw
        d.rectangle([x0, y0, x1, y1], fill=frame)
        # 유리: 위쪽은 하늘 반사(밝게), 아래는 어둡게
        for yy in range(int(y0) + 3, int(y1) - 2):
            t = (yy - y0) / (y1 - y0)
            col = tuple(int(glass[i] * (1.25 - 0.5 * t)) for i in range(3))
            d.line([x0 + 3, yy, x1 - 3, yy], fill=col)
        d.line([(x0 + x1) / 2, y0, (x0 + x1) / 2, y1], fill=frame, width=2)
        d.line([x0, (y0 + y1) / 2, x1, (y0 + y1) / 2], fill=frame, width=2)
    return np.asarray(img)


WALLS = {
    "brick_red": brick(base=(150, 72, 52), seed=5),
    "brick_brown": brick(base=(118, 78, 62), mortar=(186, 178, 168), seed=6),
    "brick_tan": brick(base=(176, 146, 112), mortar=(214, 206, 192), seed=7),
    "limestone": blocks(),
    "precast": blocks(base=(196, 192, 186), mortar=(172, 168, 162), course=96, length=128, var=3, seed=10),
    "metal": ribs(),
    "glass": curtain(),
    "concrete": concrete(),
}
for name, tex in WALLS.items():
    save(tex, f"{name}.jpg")
    save(tex if name == "glass" else bake_windows(tex), f"{name}_win.jpg")
save(to_normal(np.asarray(Image.fromarray(WALLS["brick_red"]).convert("L")).astype(np.float32) / 255.0, 1.5), "brick_n.jpg")

# ---------------------------------------------------------------- 지붕
n = 512
for name, base, amp, seed in [("roof_membrane", 200, 8, 31), ("roof_gravel", 155, 20, 32), ("roof_dark", 60, 10, 33)]:
    nz = tile_noise(n, [(16, 0.5), (128, 1.0), (512, 0.8)], seed=seed)
    v = base + (nz - 0.5) * 2 * amp
    if name == "roof_gravel":
        v += (rng.random((n, n)) < 0.05) * 25
    save(np.stack([v, v, v * 0.98], -1), f"{name}.jpg")

# ---------------------------------------------------------------- 아스팔트 / 보도 콘크리트
asf = tile_noise(256, [(8, 0.3), (64, 0.6), (256, 1.0)], seed=81)
v = 0.30 + (asf - 0.5) * 0.18
save(np.stack([v * 255, v * 255, v * 255 * 1.02], -1), "asphalt.jpg")
walk = concrete(256, seed=41).astype(np.float32) * 1.15
im = Image.fromarray(np.clip(walk, 0, 255).astype(np.uint8)); d = ImageDraw.Draw(im)
for k in range(0, 256, 128):
    d.line([k, 0, k, 256], fill=(120, 118, 112), width=2); d.line([0, k, 256, k], fill=(120, 118, 112), width=2)
save(im, "concrete_walk.jpg")

# ---------------------------------------------------------------- 잔디
g1 = tile_noise(512, [(8, 0.6), (32, 0.8), (128, 1.0), (512, 0.9)], seed=21)
g2 = tile_noise(512, [(256, 1.0)], seed=22)
v = 0.72 + (g1 - 0.5) * 0.55 + (g2 - 0.5) * 0.25
save(np.stack([v * 255 * 0.95, v * 255 * 1.0, v * 255 * 0.86], -1), "grass_detail.jpg")
save(to_normal(g1, 1.5), "grass_n.jpg")

# ---------------------------------------------------------------- 수피
bk = tile_noise(256, [(4, 0.8), (16, 1.0), (64, 0.7), (256, 0.4)], seed=51)
v = 0.35 + (bk - 0.5) * 0.5
save(np.stack([v * 255 * 0.72, v * 255 * 0.62, v * 255 * 0.52], -1), "bark.jpg")

# ---------------------------------------------------------------- 나뭇잎 스프라이트 아틀라스 (3 × 1)
W = H = 512
atlas = Image.new("RGBA", (W * 3, H), (0, 0, 0, 0))
for v_ in range(3):
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    r = np.random.default_rng(100 + v_)
    cx, cy = W / 2, H * 0.40; rx, ry = W * 0.42, H * 0.36
    tw = 22
    d.polygon([(cx - tw, H), (cx + tw, H), (cx + tw * 0.55, cy + ry * 0.2), (cx - tw * 0.55, cy + ry * 0.2)], fill=(78, 62, 48, 255))
    for k in range(5):
        ang = r.uniform(-1.0, 1.0)
        bx = cx + math.sin(ang) * rx * 0.6; by = cy - math.cos(ang) * ry * 0.5 + ry * 0.3
        d.line([(cx, cy + ry * 0.25), (bx, by)], fill=(70, 56, 44, 255), width=int(r.uniform(5, 9)))
    base_g = np.array([[66, 104, 38], [84, 124, 44], [58, 92, 36]][v_])
    lobes = [(cx, cy, rx * 0.78, ry * 0.8)]
    for k in range(6):
        a = r.uniform(0, 2 * math.pi); dd = r.uniform(0.35, 0.7)
        lobes.append((cx + math.cos(a) * rx * dd, cy + math.sin(a) * ry * dd * 0.9, rx * r.uniform(0.35, 0.55), ry * r.uniform(0.35, 0.55)))
    for (lx, ly, lrx, lry) in lobes:
        for k in range(650):
            a = r.uniform(0, 2 * math.pi); rad = math.sqrt(r.uniform(0, 1))
            x = lx + math.cos(a) * lrx * rad; y = ly + math.sin(a) * lry * rad
            if rad > 0.8 and r.random() < (rad - 0.8) / 0.2 * 0.85:
                continue
            s = r.uniform(5, 13)
            vert = (y - (cy - ry)) / (2 * ry)
            light = 0.55 + 0.75 * (1 - vert) + r.uniform(-0.18, 0.18)
            if rad < 0.5:
                light *= 0.85
            col = tuple(int(min(255, cc * light)) for cc in base_g) + (255,)
            d.ellipse([x - s, y - s * 0.65, x + s, y + s * 0.65], fill=col)
    atlas.paste(im, (v_ * W, 0))
atlas.save(OUT / "leaves.png")

# ---------------------------------------------------------------- 유리창 1장 (상세 건물용)
im = Image.new("RGB", (256, 256), (70, 95, 120)); d = ImageDraw.Draw(im)
for yy in range(256):
    t = yy / 255; d.line([0, yy, 256, yy], fill=tuple(int(c * (1.3 - 0.6 * t)) for c in (70, 95, 120)))
d.rectangle([0, 0, 255, 255], outline=(50, 52, 56), width=6)
d.line([128, 0, 128, 256], fill=(50, 52, 56), width=4); d.line([0, 128, 256, 128], fill=(50, 52, 56), width=4)
save(im, "window_glass.jpg")

print("textures done:", len(list(OUT.glob("*.jpg"))) + len(list(OUT.glob("*.png"))), "files")
