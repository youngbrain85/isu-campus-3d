#!/usr/bin/env python3
"""가로(스트리트) 레이어 데이터 → viewer/assets/street.json

1. 주차 차량: Esri z20(겨울, 0.38 ft/px, 낙엽 후라 차량이 잘 보임) 영상에서 주차장 폴리곤 안과 차도 연석 차선의
   차량(약 6×15 ft 덩어리)을 검출 → 위치·방향(장축)·길이·영상 색.  z20 범위 밖은 z19(여름) 사용.
   검출이 거의 없는 주차장만 무작위 채움(fill=1).
2. 교차로: 비-service 차도 폴리라인끼리의 교차점 (간선끼리 = 신호, 그 외 = 정지 표지).
3. 횡단보도: OSM footway=crossing 선 + 교차로 각 진입부(중복 제거), 정지선.
4. 가로 시설: 소화전(~300 ft), 도로명 표지, P 표지(주차장 입구), 안내 표지, 벤치·휴지통(벽돌 보도), 자전거 거치대, 황색 연석 구간, 노면 화살표.

좌표: 로컬 평면 ft (x 동, z 남). heading = 차량/시설 장축의 방향각 atan2(dz, dx) (rad).
실행:  python tools/street_data.py [--debug]   (--debug: scratch/street/ 에 검출 오버레이 PNG 저장)
"""
import json, math, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass
sys.path.insert(0, str(Path(__file__).resolve().parent))
import geo

Image.MAX_IMAGE_PIXELS = None
ROOT = Path(__file__).resolve().parent.parent
DATA, OUT, DBG = ROOT / "data", ROOT / "viewer" / "assets", ROOT / "scratch" / "street"
ARTERIAL = ("trunk", "primary", "secondary", "tertiary")
STREET = ARTERIAL + ("residential", "unclassified", "living_street")


# ============================================================================ 영상
class Ortho:
    """모자이크 + 로컬 ft 좌표 변환. crop(x0,z0,x1,z1) → (RGB float 배열, ft→px 함수)"""

    def __init__(self, z):
        self.m = geo.MosaicBounds(DATA / "imagery" / f"esri_z{z}.json")
        self.img = Image.open(DATA / "imagery" / f"esri_z{z}.png").convert("RGB")
        self.ft_per_px = (self.m.east - self.m.west) * geo.M_PER_DEG_LON * geo.FT_PER_M / self.m.w
        x0, z0 = geo.ll_to_xz(self.m.north, self.m.west); x1, z1 = geo.ll_to_xz(self.m.south, self.m.east)
        self.rect = (x0, z0, x1, z1)

    def covers(self, x0, z0, x1, z1):
        r = self.rect
        return x0 >= r[0] and z0 >= r[1] and x1 <= r[2] and z1 <= r[3]

    def px(self, x, z):
        return self.m.px_of(*geo.xz_to_ll(x, z))

    def crop(self, x0, z0, x1, z1):
        a = self.px(x0, z0); b = self.px(x1, z1)
        c0, r0 = int(math.floor(a[0])), int(math.floor(a[1]))
        c1, r1 = int(math.ceil(b[0])), int(math.ceil(b[1]))
        arr = np.asarray(self.img.crop((c0, r0, c1, r1))).astype(np.float32)
        # 국소적으로 선형: ft → crop px (메르카토르 왜곡은 수백 ft 범위에서 무시 가능)
        sx = (b[0] - a[0]) / (x1 - x0); sz = (b[1] - a[1]) / (z1 - z0)
        f = lambda x, z: ((np.asarray(x) - x0) * sx + (a[0] - c0), (np.asarray(z) - z0) * sz + (a[1] - r0))
        return arr, f


def car_mask(arr, ft_per_px, valid):
    """차량 픽셀 마스크: 국소 포장면(배경)과 밝기·채도·질감이 다른 픽셀. 주차선·나뭇가지 같은 가는 구조는 열림 연산으로 제거."""
    R, G, B = arr[..., 0], arr[..., 1], arr[..., 2]
    lum = (R + G + B) / 3
    mx, mn = np.maximum(np.maximum(R, G), B), np.minimum(np.minimum(R, G), B)
    chroma = mx - mn
    # 배경 = 유효 영역 안 저채도 픽셀의 국소 중앙값 (50 ft 창, 1/4 해상도로 계산)
    k = 4
    small = lum[::k, ::k].copy(); vs = (valid & (chroma < 22))[::k, ::k]
    fill = np.median(small[vs]) if vs.any() else np.median(small)
    win = max(5, int(50 / ft_per_px / k)) | 1
    med = ndimage.generic_filter(np.nan_to_num(small, nan=fill), np.median, size=win, mode="nearest") if small.size < 40000 else \
        ndimage.median_filter(np.nan_to_num(small, nan=fill), size=win, mode="nearest")
    bg = ndimage.zoom(med, k, order=1)[:lum.shape[0], :lum.shape[1]]
    if bg.shape != lum.shape:
        bg = np.pad(bg, ((0, lum.shape[0] - bg.shape[0]), (0, lum.shape[1] - bg.shape[1])), mode="edge")
    # 갈색(화단 멀칭·마른 잔디) = 차량 아님: r>g>b 이고 r-g, g-b 가 비슷하게 작음
    brown = (R > G) & (G > B) & (R - G < 30) & (G - B > 8) & (G - B < 45) & (lum > 70) & (lum < 175)
    # 질감: 국소 기울기 에너지 (어두운 차량이 어두운 아스팔트 위에 있을 때 경계·유리 반사로 구분)
    gx = ndimage.sobel(lum, 1); gy = ndimage.sobel(lum, 0)
    grad = ndimage.uniform_filter(np.hypot(gx, gy), size=max(3, int(2.0 / ft_per_px)))
    diff = np.abs(lum - bg)
    m = ((diff > 26) | ((chroma > 38) & ~brown) | (grad > 70)) & valid & ~(brown & (diff < 45))
    r = max(1, int(round(0.9 / ft_per_px)))           # 반지름 ~0.9 ft 원판 → 주차선(0.4 ft)·가지 제거
    st = np.hypot(*np.mgrid[-r:r + 1, -r:r + 1]) <= r
    m = ndimage.binary_opening(m, structure=st)
    m = ndimage.binary_closing(m, structure=st)
    return m


def stall_line_field(arr, ft_per_px, valid):
    """주차선(가는 밝은 선) 방향장: 반환 (cos2θ, sin2θ) 배열 × 일관도. θ = 선 방향(px 좌표, x 오른쪽 y 아래).
    주차칸 구획선은 차량 장축과 평행하므로 차량 방향의 사전 정보가 된다."""
    lum = arr.mean(axis=2)
    k = max(3, int(round(2.0 / ft_per_px)) | 1)
    th = lum - ndimage.grey_opening(lum, size=(k, k))
    line = ((th > 22) & valid).astype(np.float32)
    gx = ndimage.sobel(ndimage.gaussian_filter(line, 1.0), 1); gy = ndimage.sobel(ndimage.gaussian_filter(line, 1.0), 0)
    sg = 12.0 / ft_per_px
    Jxx = ndimage.gaussian_filter(gx * gx, sg); Jyy = ndimage.gaussian_filter(gy * gy, sg); Jxy = ndimage.gaussian_filter(gx * gy, sg)
    # 기울기 주방향 φ: tan2φ = 2Jxy/(Jxx-Jyy); 선 방향 = φ+90° → cos2θ = -cos2φ
    den = np.hypot(Jxx - Jyy, 2 * Jxy) + 1e-6
    coh = den / (Jxx + Jyy + 1e-6)
    c2 = -(Jxx - Jyy) / den; s2 = -(2 * Jxy) / den
    return c2 * coh, s2 * coh


def rect_offsets(L, W, step):
    us = np.arange(-L / 2 + step / 2, L / 2, step); vs = np.arange(-W / 2 + step / 2, W / 2, step)
    U, V = np.meshgrid(us, vs); return U.ravel(), V.ravel()


def rect_scores(mask, f, cx, cz, hd, L, W, step=0.8):
    """중심 (cx,cz), 방향 hd 의 L×W 직사각형 안 마스크 비율 (벡터화)"""
    U, V = rect_offsets(L, W, step)
    c, s = np.cos(hd)[:, None], np.sin(hd)[:, None]
    X = cx[:, None] + U[None] * c - V[None] * s
    Z = cz[:, None] + U[None] * s + V[None] * c
    px, py = f(X, Z)
    px = np.clip(np.round(px).astype(int), 0, mask.shape[1] - 1); py = np.clip(np.round(py).astype(int), 0, mask.shape[0] - 1)
    return mask[py, px].mean(axis=1)


def ring_score(mask, f, cx, cz, hd, L, W):
    """차량 앞뒤 끝(장축 방향 바깥 2 ft 띠)의 마스크 비율 — 낮아야 독립된 한 대"""
    out = []
    for sgn in (-1, 1):
        ox = cx + np.cos(hd) * sgn * (L / 2 + 2.0); oz = cz + np.sin(hd) * sgn * (L / 2 + 2.0)
        out.append(rect_scores(mask, f, ox, oz, hd, 2.5, W * 0.8))
    return np.minimum(out[0], out[1])


def sample_colour(arr, mask, f, x, z, hd, L=11, W=4.5):
    U, V = rect_offsets(L, W, 0.6)
    X = x + U * math.cos(hd) - V * math.sin(hd); Z = z + U * math.sin(hd) + V * math.cos(hd)
    px, py = f(X, Z)
    px = np.clip(np.round(px).astype(int), 0, arr.shape[1] - 1); py = np.clip(np.round(py).astype(int), 0, arr.shape[0] - 1)
    rgb = arr[py, px]; mm = mask[py, px]
    if mm.sum() > 8:
        rgb = rgb[mm]
    lum = rgb.mean(axis=1)
    # 지붕(가운데) 색: 밝기 상위 60% 의 중앙값 → 유리·그림자 영향 감소
    sel = rgb[lum >= np.percentile(lum, 40)]
    return [int(v) for v in np.median(sel, axis=0)]


def measure_length(mask, f, x, z, hd, W=5.0):
    """장축을 따라 마스크가 이어지는 길이 (ft, 12–21)"""
    ts = np.arange(-12, 12.01, 0.5)
    sc = rect_scores(mask, f, x + np.cos(hd) * ts, z + np.sin(hd) * ts, np.full(ts.shape, hd), 0.6, W)
    on = sc > 0.45; c = len(ts) // 2
    if not on[c]:
        return 15.0
    a = c
    while a > 0 and on[a - 1]:
        a -= 1
    b = c
    while b < len(ts) - 1 and on[b + 1]:
        b += 1
    return float(np.clip((b - a + 1) * 0.5, 12, 21))


def poly_mask(shape, f, poly, holes=()):
    im = Image.new("L", (shape[1], shape[0]), 0); d = ImageDraw.Draw(im)
    pts = lambda P: [tuple(map(float, f(p[0], p[1]))) for p in P]
    d.polygon(pts(poly), fill=255)
    for h in holes:
        d.polygon(pts(h), fill=0)
    return np.asarray(im) > 0


def lot_axis(poly):
    best, bl = 0.0, -1
    for i in range(len(poly)):
        a, b = poly[i], poly[(i + 1) % len(poly)]
        l = math.dist(a, b)
        if l > bl:
            bl, best = l, math.atan2(b[1] - a[1], b[0] - a[0])
    return best


def nms(cands, accepted=None):
    """cands: [(score, x, z, hd)] 점수순 → 방향 직사각형 겹침 억제 (폭 5.2 ft, 길이 13 ft 이내 중심 금지)"""
    acc = list(accepted or [])
    out = []
    for sc, x, z, hd in sorted(cands, key=lambda t: -t[0]):
        ok = True
        for (ax, az, ah) in acc:
            dx, dz = x - ax, z - az
            if dx * dx + dz * dz > 400:
                continue
            u = abs(dx * math.cos(ah) + dz * math.sin(ah)); v = abs(-dx * math.sin(ah) + dz * math.cos(ah))
            u2 = abs(dx * math.cos(hd) + dz * math.sin(hd)); v2 = abs(-dx * math.sin(hd) + dz * math.cos(hd))
            if (u < 13.0 and v < 7.0) or (u2 < 13.0 and v2 < 7.0):
                ok = False; break
        if ok:
            acc.append((x, z, hd)); out.append((sc, x, z, hd))
    return out


def detect_in_region(ortho, region_poly, holes, headings, x0, z0, x1, z1, thresh=0.62, grid=1.0, line=None, min_score=0.5, dilate_ft=6.0, exclude=None):
    """region_poly 안(또는 line=(pts, offset) 의 연석 차선 위)의 차량 검출. 반환 [x, z, hd, len, r, g, b]"""
    M = 30
    arr, f = ortho.crop(x0 - M, z0 - M, x1 + M, z1 + M)
    valid = poly_mask(arr.shape, f, region_poly, holes)
    valid = ndimage.binary_dilation(valid, iterations=int(dilate_ft / ortho.ft_per_px)) if dilate_ft > 0 else valid
    if exclude is not None:
        valid &= ~exclude(arr.shape, f)
    mask = car_mask(arr, ortho.ft_per_px, valid)
    C2, S2 = stall_line_field(arr, ortho.ft_per_px, valid) if line is None else (None, None)
    if line is None:
        xs = np.arange(x0 - dilate_ft, x1 + dilate_ft, grid); zs = np.arange(z0 - dilate_ft, z1 + dilate_ft, grid)
        X, Z = np.meshgrid(xs, zs); X, Z = X.ravel(), Z.ravel()
        px, py = f(X, Z)
        px = np.clip(np.round(px).astype(int), 0, valid.shape[1] - 1); py = np.clip(np.round(py).astype(int), 0, valid.shape[0] - 1)
        keep = valid[py, px] & mask[py, px]
        X, Z = X[keep], Z[keep]
        cand = []
        for hd in headings:
            H = np.full(X.shape, hd)
            if not len(X):
                continue
            s = rect_scores(mask, f, X, Z, H, 14.0, 5.6)
            sel = s > thresh
            if not sel.any():
                continue
            ring = ring_score(mask, f, X[sel], Z[sel], H[sel], 14.0, 5.6)
            along = rect_scores(mask, f, X[sel], Z[sel], H[sel], 34.0, 3.0, 1.0)
            perp = rect_scores(mask, f, X[sel], Z[sel], H[sel] + np.pi / 2, 30.0, 3.0, 1.0)
            sc = s[sel] - 0.8 * ring + 0.5 * (perp - along)
            # 주차선 방향과의 일치도 (px 좌표계의 방향각: 동=+x, 남=+y 이므로 world hd 와 같은 부호)
            qx, qz = f(X[sel], Z[sel])
            qx = np.clip(np.round(qx).astype(int), 0, C2.shape[1] - 1); qz = np.clip(np.round(qz).astype(int), 0, C2.shape[0] - 1)
            agree = C2[qz, qx] * math.cos(2 * hd) + S2[qz, qx] * math.sin(2 * hd)
            sc = sc + 0.6 * agree
            for a, b, c in zip(X[sel], Z[sel], sc):
                cand.append((float(c), float(a), float(b), hd))
    else:
        cand = []
        for (X, Z, H) in line:
            s = rect_scores(mask, f, X, Z, H, 14.0, 5.6)
            ring = ring_score(mask, f, X, Z, H, 14.0, 5.6)
            sc = s - 0.8 * ring
            for a, b, c, h, s0 in zip(X, Z, sc, H, s):
                if s0 > thresh:
                    cand.append((float(c), float(a), float(b), float(h)))
    cand = [c for c in cand if c[0] >= min_score]
    kept = nms(cand)
    if line is None and len(kept) > 3 and len(headings) > 1:
        # 2차: 같은 열의 주차 차량은 방향이 같다 → 주변 1차 검출(25 ft 이내)의 방향 다수결과 맞는 후보만 다시 NMS
        K = np.array([[k[1], k[2], k[3], k[0]] for k in kept])
        def pref(x, z):
            d2 = (K[:, 0] - x) ** 2 + (K[:, 1] - z) ** 2
            sel = d2 < 40 * 40
            if sel.sum() < 2:
                return None
            w = K[sel, 3]
            par = np.abs(np.cos(K[sel, 2] - headings[0])) > 0.7
            a, b = w[par].sum(), w[~par].sum()
            return headings[0] if a > 1.3 * b else headings[1] if b > 1.3 * a else None
        cache = {}
        cand2 = []
        for c in cand:
            key = (int(c[1] // 8), int(c[2] // 8))
            if key not in cache:
                cache[key] = pref(key[0] * 8 + 4, key[1] * 8 + 4)
            p_ = cache[key]
            if p_ is None or abs(math.cos(c[3] - p_)) > 0.7:
                cand2.append(c)
        kept = nms(cand2)
    cars = []
    for sc, x, z, hd in kept:
        L = measure_length(mask, f, x, z, hd)
        rgb = sample_colour(arr, mask, f, x, z, hd)
        cars.append([round(x, 1), round(z, 1), round(hd, 3), round(L, 1), *rgb])
    return cars, (arr, f, valid, mask)


def debug_overlay(name, arr, f, valid, mask, cars, extra=()):
    DBG.mkdir(parents=True, exist_ok=True)
    im = Image.fromarray(arr.astype(np.uint8)).convert("RGB")
    ov = Image.new("RGBA", im.size, (0, 0, 0, 0)); d = ImageDraw.Draw(ov)
    edge = valid ^ ndimage.binary_erosion(valid, iterations=2)
    a = np.zeros((*valid.shape, 4), np.uint8); a[edge] = (0, 255, 255, 255); a[mask & valid] = (255, 0, 255, 50)
    ov = Image.alpha_composite(ov, Image.fromarray(a)); d = ImageDraw.Draw(ov)
    for c in cars:
        x, z, hd, L = c[:4]
        pts = []
        for (u, v) in ((-L / 2, -3), (L / 2, -3), (L / 2, 3), (-L / 2, 3)):
            pts.append(tuple(map(float, f(x + u * math.cos(hd) - v * math.sin(hd), z + u * math.sin(hd) + v * math.cos(hd)))))
        col = (255, 255, 0, 255) if len(c) < 8 or not c[7] else (255, 120, 0, 255)
        d.polygon(pts, outline=col)
        fx, fz = f(x + math.cos(hd) * L / 2, z + math.sin(hd) * L / 2); cx, cz = f(x, z)
        d.line([(float(cx), float(cz)), (float(fx), float(fz))], fill=col)
    out = Image.alpha_composite(im.convert("RGBA"), ov).convert("RGB")
    out.save(DBG / f"{name}.png")


def make_excluder(site):
    """건물 footprint + 보행로 리본(폭+2 ft) 마스크 생성 함수 (차량 검출에서 제외)"""
    blds = [b["poly"] for b in site["buildings"]]
    paths = [r for r in site["roads"] if r["kind"] == "path"]

    def fn(shape, f):
        im = Image.new("L", (shape[1], shape[0]), 0); d = ImageDraw.Draw(im)
        H, W = shape[:2]
        for P in blds:
            pts = [tuple(map(float, f(p[0], p[1]))) for p in P]
            if all(x < -50 or x > W + 50 for x, _ in pts) or all(y < -50 or y > H + 50 for _, y in pts):
                continue
            d.polygon(pts, fill=255)
        for r in paths:
            pts = [tuple(map(float, f(p[0], p[1]))) for p in r["pts"]]
            if all(x < -50 or x > W + 50 for x, _ in pts) or all(y < -50 or y > H + 50 for _, y in pts):
                continue
            wpx = (r["w"] + 2) * float(f(1, 0)[0] - f(0, 0)[0])
            d.line(pts, fill=255, width=max(1, int(round(wpx))))
        return np.asarray(im) > 0
    return fn


# ============================================================================ 기하 헬퍼
def point_in_poly(p, poly):
    x, z = p; ins = False; j = len(poly) - 1
    for i in range(len(poly)):
        xi, zi = poly[i]; xj, zj = poly[j]
        if (zi > z) != (zj > z) and x < (xj - xi) * (z - zi) / (zj - zi) + xi:
            ins = not ins
        j = i
    return ins


def seg_nearest(p, a, b):
    dx, dz = b[0] - a[0], b[1] - a[1]; L2 = dx * dx + dz * dz or 1e-9
    t = max(0.0, min(1.0, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dz) / L2))
    q = (a[0] + dx * t, a[1] + dz * t)
    return math.dist(p, q), q, t


def poly_dist(p, pts):
    """폴리라인 최근접: (거리, 점, 선분 index, t)"""
    best = (1e18, None, 0, 0.0)
    for i in range(len(pts) - 1):
        d, q, t = seg_nearest(p, pts[i], pts[i + 1])
        if d < best[0]:
            best = (d, q, i, t)
    return best


def seg_intersect(a, b, c, d):
    """선분 ab, cd 교점 (없으면 None)"""
    r = (b[0] - a[0], b[1] - a[1]); s = (d[0] - c[0], d[1] - c[1])
    den = r[0] * s[1] - r[1] * s[0]
    if abs(den) < 1e-9:
        return None
    t = ((c[0] - a[0]) * s[1] - (c[1] - a[1]) * s[0]) / den
    u = ((c[0] - a[0]) * r[1] - (c[1] - a[1]) * r[0]) / den
    if 0 <= t <= 1 and 0 <= u <= 1:
        return (a[0] + r[0] * t, a[1] + r[1] * t), t, u
    return None


def walk(pts, step, start=0.0):
    """폴리라인을 따라 step 간격 점 [(x, z, 방향각, 누적거리)]"""
    out = []; acc = start; s0 = 0.0
    for i in range(len(pts) - 1):
        a, b = pts[i], pts[i + 1]; L = math.dist(a, b)
        if L < 1e-6:
            continue
        h = math.atan2(b[1] - a[1], b[0] - a[0]); t = acc
        while t < L:
            out.append((a[0] + (b[0] - a[0]) * t / L, a[1] + (b[1] - a[1]) * t / L, h, s0 + t)); t += step
        acc = t - L; s0 += L
    return out


def poly_len(pts):
    return sum(math.dist(pts[i], pts[i + 1]) for i in range(len(pts) - 1))


def right_of(h):
    """진행 방향각 h 의 오른쪽 단위벡터 (x 동, z 남; 위에서 북쪽을 위로 보았을 때의 오른쪽)"""
    return (-math.sin(h), math.cos(h))


def ribbon_poly(P, w):
    L, Rr = [], []
    for i, p in enumerate(P):
        a = P[max(0, i - 1)]; b = P[min(len(P) - 1, i + 1)]
        h = math.atan2(b[1] - a[1], b[0] - a[0]); rx, rz = right_of(h)
        L.append((p[0] - rx * w / 2, p[1] - rz * w / 2)); Rr.append((p[0] + rx * w / 2, p[1] + rz * w / 2))
    return L + Rr[::-1]


# ============================================================================ 교차로
def find_intersections(streets):
    """공유 노드에서 만나는 차도(3갈래 이상) → [{x, z, arms:[{h, w, hw, name, ri, inbound, len, pts, ...}]}]"""
    nodes = {}
    for ri, r in enumerate(streets):
        for i, p in enumerate(r["pts"]):
            nodes.setdefault((round(p[0], 1), round(p[1], 1)), []).append((ri, i))
    out = []
    for k, refs in nodes.items():
        arms = []
        for ri, i in refs:
            r = streets[ri]; P = r["pts"]
            for j, sign in ((i - 1, -1), (i + 1, +1)):
                if 0 <= j < len(P):
                    q = P[j]; h = math.atan2(q[1] - P[i][1], q[0] - P[i][0])     # 갈래 방향: 노드에서 바깥으로
                    seg = P[i:] if sign > 0 else P[:i + 1][::-1]
                    inbound = not (r["oneway"] and sign > 0)                       # 일방통행: 폴리라인 순방향 = 통행 방향
                    arms.append({"h": h, "w": r["w"], "hw": r["hw"], "name": r["name"], "ri": ri, "inbound": inbound,
                                 "len": poly_len(seg), "pts": seg, "lanes": r["lanes"], "oneway": r["oneway"]})
        if len(arms) >= 3:
            out.append({"x": k[0], "z": k[1], "arms": arms})
    out.sort(key=lambda I: -len(I["arms"]))
    merged = []
    for I in out:                                    # 25 ft 이내 노드 병합
        if all(math.dist((I["x"], I["z"]), (J["x"], J["z"])) > 25 for J in merged):
            merged.append(I)
    return merged


def is_arterial(a):
    return a["hw"] in ARTERIAL


def random_fill(poly, li):
    """검출이 없는 주차장: 주차칸 격자에 35% 무작위 (예전 ground.js buildCars 와 같은 규칙)"""
    ax = lot_axis(poly); c, s = math.cos(ax), math.sin(ax)
    us = [p[0] * c + p[1] * s for p in poly]; vs = [-p[0] * s + p[1] * c for p in poly]
    u0, u1, v0, v1 = min(us), max(us), min(vs), max(vs)
    rng = np.random.default_rng(17 + li)
    toW = lambda u, v: (u * c - v * s, u * s + v * c)
    pal = [(216, 216, 216), (43, 43, 43), (140, 140, 140), (163, 32, 32), (31, 58, 110), (230, 230, 230), (90, 90, 90), (242, 242, 242)]
    out = []; v = v0 + 2
    while v + 18 < v1:
        for vv in (v, v + 42):
            if vv + 18 > v1:
                continue
            u = u0 + 8.5
            while u < u1 - 8.5:
                if rng.random() < 0.35:
                    p = toW(u, vv + 9); q0 = toW(u, vv + 1); q1 = toW(u, vv + 17)
                    if point_in_poly(q0, poly) and point_in_poly(q1, poly):
                        col = pal[int(rng.integers(len(pal)))]
                        out.append([round(p[0], 1), round(p[1], 1), round(ax + math.pi / 2 + (math.pi if rng.random() < 0.5 else 0), 3), 15.0, *col, 1, 0])
                u += 9
        v += 60
    return out


# ============================================================================ 메인
def main():
    debug = "--debug" in sys.argv
    site = json.load(open(OUT / "site.json", encoding="utf-8"))
    R = json.load(open(DATA / "osm_roads_etc.geojson", encoding="utf-8"))
    clip, core = site["clip"], site["core"]
    streets = [r for r in site["roads"] if r["kind"] == "road" and r["hw"] in STREET]
    services = [r for r in site["roads"] if r["kind"] == "road" and r["hw"] == "service"]
    paths = [r for r in site["roads"] if r["kind"] == "path"]
    lots = [a for a in site["areas"] if a["kind"] == "parking"]
    blds = [b["poly"] for b in site["buildings"]]
    in_core = lambda x, z: core[0] <= x <= core[2] and core[1] <= z <= core[3]
    in_clip = lambda x, z: clip[0] + 5 <= x <= clip[2] - 5 and clip[1] + 5 <= z <= clip[3] - 5
    in_bld = lambda x, z: any(point_in_poly((x, z), P) for P in blds)
    in_lot = lambda x, z: any(point_in_poly((x, z), a["poly"]) for a in lots)

    def near_street(x, z, extra=0.0):
        """(x,z) 가 차도 포장면(폭/2 + extra) 안이면 True"""
        for r in streets + services:
            if poly_dist((x, z), r["pts"])[0] < r["w"] / 2 + extra:
                return True
        return False

    # ---------------------------------------------------------------- 교차로 / 신호 / 정지
    inters = find_intersections(streets)
    sig_lines = []
    for f in R["features"]:
        t = f["properties"]
        if f["geometry"]["type"] == "LineString" and t.get("crossing") == "traffic_signals":
            sig_lines.append([geo.ll_to_xz(p[1], p[0]) for p in f["geometry"]["coordinates"]])
    I_out = []
    for I in inters:
        c = (I["x"], I["z"])
        if not in_clip(*c):
            continue
        names = {a["name"] or ("#%d" % a["ri"]) for a in I["arms"]}
        n_art = sum(1 for a in I["arms"] if is_arterial(a))
        near_sig = any(poly_dist(c, L)[0] < 90 for L in sig_lines)
        I["signal"] = (n_art >= 3 and len(names) >= 2) or near_sig
        I["control"] = "signal" if I["signal"] else ("stop_all" if all(not is_arterial(a) for a in I["arms"]) else "stop_minor")
        for a in I["arms"]:
            other = max([b["w"] for b in I["arms"] if abs(math.remainder(b["h"] - a["h"], math.pi)) > 0.5] or [a["w"]])
            a["cw_d"] = other / 2 + 9.0           # 교차로 중심 → 횡단보도 중심 (횡단보도 폭 10 ft + 모퉁이 여유)
            a["cross_w"] = other
        I_out.append(I)
    print(f"intersections {len(I_out)}  signal {sum(1 for I in I_out if I['signal'])}")

    crosswalks, stopbars, arrows, signals, stops, names_signs, yellow = [], [], [], [], [], [], []

    def add_crosswalk(x, z, h_road, span):
        """h_road = 차도 진행 방향각, span = 차도 폭(가로지르는 길이)"""
        if any(math.dist((x, z), (c[0], c[1])) < 18 for c in crosswalks):
            return False
        crosswalks.append([round(x, 2), round(z, 2), round(h_road, 4), round(span, 1), 10.0])
        return True

    for I in I_out:
        cx, cz = I["x"], I["z"]
        for a in I["arms"]:
            if a["len"] < a["cw_d"] + 12:
                continue
            h = a["h"]; ux, uz = math.cos(h), math.sin(h)
            add_crosswalk(cx + ux * a["cw_d"], cz + uz * a["cw_d"], h, a["w"])
            t = h + math.pi; rx, rz = right_of(t)            # 진입 차량 진행 방향과 그 오른쪽
            if a["inbound"]:
                # 정지선: 횡단보도 바깥 2 ft, 진입 차선 쪽 반폭
                d = a["cw_d"] + 7
                if a["oneway"]:
                    stopbars.append([round(cx + ux * d, 2), round(cz + uz * d, 2), round(h, 4), round(a["w"] - 2, 1), 0.0])
                else:
                    off = a["w"] / 4
                    stopbars.append([round(cx + ux * d + rx * off, 2), round(cz + uz * d + rz * off, 2), round(h, 4), round(a["w"] / 2 - 1, 1), 0.0])
                # 노면 화살표: 신호 교차로의 다차선 진입부
                n_in = (a["lanes"] or round(a["w"] / 12)) if a["oneway"] else max(1, (a["lanes"] // 2) if a["lanes"] else round(a["w"] / 24))
                if I["signal"] and n_in >= 2 and a["len"] > a["cw_d"] + 60:
                    half = a["w"] if a["oneway"] else a["w"] / 2
                    lw = half / n_in
                    for k in range(n_in):                    # k=0: 가장 왼쪽 차선
                        sx = (k + 0.5) * lw - (a["w"] / 2 if a["oneway"] else 0)
                        d2 = a["cw_d"] + 32
                        kind = "straight"
                        if k == 0 and len(I["arms"]) >= 4:
                            kind = "left_straight" if a["oneway"] else "left"
                        elif k == n_in - 1 and a["oneway"]:
                            kind = "right_straight"
                        arrows.append([round(cx + ux * d2 + rx * sx, 2), round(cz + uz * d2 + rz * sx, 2), round(t, 4), kind])
                # 신호: 건너편 오른쪽 모퉁이에 마스트암 기둥 (팔이 진입 차선 위로)
                if I["signal"]:
                    far = a["cross_w"] / 2 + 4
                    bx = cx - ux * far + rx * (a["w"] / 2 + 4); bz = cz - uz * far + rz * (a["w"] / 2 + 4)
                    for _ in range(8):                       # 기둥이 다른 차도 포장 위면 바깥(오른쪽·건너편)으로 밀기
                        if not near_street(bx, bz, 1.5):
                            break
                        bx += rx * 2.5 - ux * 1.5; bz += rz * 2.5 - uz * 1.5
                    arm_len = (a["w"] - 2) if a["oneway"] else (a["w"] / 2 + 4)
                    signals.append([round(bx, 2), round(bz, 2), round(t, 4), round(min(40, max(14, arm_len)), 1), 2 if arm_len < 22 else 3])
                # 정지 표지: 진입부 오른쪽
                elif I["control"] == "stop_all" or not is_arterial(a):
                    d = a["cw_d"] + 7
                    sx_, sz_ = cx + ux * d + rx * (a["w"] / 2 + 3), cz + uz * d + rz * (a["w"] / 2 + 3)
                    for _ in range(6):
                        if not near_street(sx_, sz_, 1.0):
                            break
                        sx_ += rx * 2; sz_ += rz * 2
                    stops.append([round(sx_, 2), round(sz_, 2), round(h, 4)])
            # 황색 연석: 모퉁이 ~ 횡단보도 너머 25 ft (양쪽)
            yellow.append({"pts": a["pts"], "s0": max(0, a["cw_d"] - 12), "s1": a["cw_d"] + 30, "w": a["w"], "sides": [-1, 1]})
        # 도로명 표지: 서로 다른 이름의 두 갈래 사이 모퉁이
        named = [a for a in sorted(I["arms"], key=lambda a: a["h"]) if a["name"]]
        if len({a["name"] for a in named}) >= 2:
            a0 = named[0]; a1 = next(b for b in named if b["name"] != a0["name"])
            hm = math.atan2(math.sin(a0["h"]) + math.sin(a1["h"]), math.cos(a0["h"]) + math.cos(a1["h"]))
            dd = max(a0["w"], a1["w"]) / 2 * 1.41 + 6
            names_signs.append([round(cx + math.cos(hm) * dd, 2), round(cz + math.sin(hm) * dd, 2), round(a0["h"], 4), round(a1["h"], 4), a0["name"], a1["name"]])

    # ---------------------------------------------------------------- OSM 횡단보도 선
    n_osm = 0
    for f in R["features"]:
        t = f["properties"]
        if f["geometry"]["type"] != "LineString" or t.get("footway") != "crossing" or t.get("crossing") == "unmarked":
            continue
        L = [geo.ll_to_xz(p[1], p[0]) for p in f["geometry"]["coordinates"]]
        hit = None
        for r in streets + services:
            P = r["pts"]
            for i in range(len(P) - 1):
                for j in range(len(L) - 1):
                    q = seg_intersect(P[i], P[i + 1], L[j], L[j + 1])
                    if q:
                        hit = (q[0], math.atan2(P[i + 1][1] - P[i][1], P[i + 1][0] - P[i][0]), r); break
                if hit:
                    break
            if hit:
                break
        if hit and in_clip(*hit[0]):
            (x, z), h, r = hit
            if add_crosswalk(x, z, h, r["w"]):
                n_osm += 1
                if r["hw"] in STREET:
                    yellow.append({"pts": r["pts"], "center": (x, z), "half": 22, "w": r["w"], "sides": [-1, 1]})
    print(f"crosswalks {len(crosswalks)} (OSM {n_osm}), stop bars {len(stopbars)}, arrows {len(arrows)}, signals {len(signals)}, stops {len(stops)}, name signs {len(names_signs)}")

    # ---------------------------------------------------------------- 주차 차량
    excl = make_excluder(site)
    o20, o19 = Ortho(20), Ortho(19)
    cars, lot_stats = [], []
    for li, a in enumerate(lots):
        poly = a["poly"]
        if a.get("parking") == "multi-storey":            # 주차 빌딩: 지상 배치 안 함 (건물 모듈 담당)
            lot_stats.append((li, "garage", 0)); continue
        xs = [p[0] for p in poly]; zs = [p[1] for p in poly]
        bb = (min(xs), min(zs), max(xs), max(zs))
        o = o20 if o20.covers(bb[0] - 40, bb[1] - 40, bb[2] + 40, bb[3] + 40) else o19
        ax = lot_axis(poly)
        det, dbg = detect_in_region(o, poly, [], [ax, ax + math.pi / 2], *bb, exclude=excl)
        det = [c for c in det if not in_bld(c[0], c[1])]
        src = 20 if o is o20 else 19
        cars.extend(c + [0, src] for c in det)
        lot_stats.append((li, f"z{src}", len(det)))
        if debug and li in (1, 9, 7, 18, 6, 0):
            debug_overlay(f"det_lot{li}", *dbg[:4], det)
        if len(det) < 3:
            cars.extend(random_fill(poly, li))
    print("lots:", " ".join(f"{i}:{s}:{n}" for i, s, n in lot_stats))
    # 연석 노상 주차: 차도 가장자리 차선(폭/2-4~5 ft)을 따라 진행 방향 직사각형
    n_curb = 0
    for ri, r in enumerate(streets):
        P = r["pts"]
        if poly_len(P) < 40:
            continue
        xs = [p[0] for p in P]; zs = [p[1] for p in P]
        bb = (min(xs) - r["w"], min(zs) - r["w"], max(xs) + r["w"], max(zs) + r["w"])
        o = o20 if o20.covers(*bb) else o19
        samples = [s for s in walk(P, 1.0) if not any(math.dist(s[:2], (I["x"], I["z"])) < 50 for I in I_out)]
        line = []
        for side in (-1, 1):
            for off in (r["w"] / 2 - 4.0, r["w"] / 2 - 5.0):
                X, Z, H = [], [], []
                for (x, z, h, s) in samples:
                    rx, rz = right_of(h)
                    X.append(x + rx * off * side); Z.append(z + rz * off * side); H.append(h)
                if X:
                    line.append((np.array(X), np.array(Z), np.array(H)))
        if not line:
            continue
        det, dbg = detect_in_region(o, ribbon_poly(P, r["w"]), [], [], *bb, line=line, thresh=0.7, min_score=0.55, dilate_ft=1.0, exclude=excl)
        det = [c for c in det if not in_lot(c[0], c[1])]
        for c in det:
            # 우측 통행: 진행 방향 오른쪽 연석의 차량은 도로 방향, 왼쪽은 반대 (일방통행은 도로 방향)
            d, q, i, t = poly_dist((c[0], c[1]), P)
            h = math.atan2(P[i + 1][1] - P[i][1], P[i + 1][0] - P[i][0]); rx, rz = right_of(h)
            side = (c[0] - q[0]) * rx + (c[1] - q[1]) * rz
            c[2] = round(h if (side > 0 or r["oneway"]) else h + math.pi, 3)
            cars.append(c + [0, 20 if o is o20 else 19, 1]); n_curb += 1
        if debug and det and r["name"] in ("North 7th Street", "Chestnut Street", "North 5th Street"):
            debug_overlay(f"det_curb_{ri}", *dbg[:4], det)
    # 중복·겹침 제거: 차량 직사각형(길이 ≤17 × 폭 6.2 ft)이 이미 채택된 차량과 12% 이상 겹치면 제거 (검출 점수순 유지)
    from shapely.geometry import Polygon
    def rect(c):
        L = min(c[3], 17.0) / 2; W = 3.1; h = c[2]; cs, sn = math.cos(h), math.sin(h)
        return Polygon([(c[0] + cs * u - sn * v, c[1] + sn * u + cs * v) for u, v in ((-L, -W), (L, -W), (L, W), (-L, W))])
    kept, grid = [], {}
    for c in sorted(cars, key=lambda c: c[7]):            # 검출(0) 우선, 무작위 채움(1) 나중
        R_ = rect(c); gx, gz = int(c[0] // 20), int(c[1] // 20)
        near = [q for i in (-1, 0, 1) for j in (-1, 0, 1) for q in grid.get((gx + i, gz + j), [])]
        if any(R_.intersection(q).area > 0.12 * R_.area for q in near):
            continue
        kept.append(c); grid.setdefault((gx, gz), []).append(R_)
    cars = kept
    # 영상 색 보정: 겨울 영상은 대기 산란으로 밝고 탁함 → 명암 늘이기 (어두운 차는 어둡게, 흰 차는 희게)
    for c in cars:
        if not c[7]:
            c[4:7] = [int(np.clip((v - 55) * 255 / 170, 8, 250)) for v in c[4:7]]
    print(f"cars {len(cars)} (curb {n_curb}, random fill {sum(1 for c in cars if c[7])})")
    curb_cars = [(c[0], c[1]) for c in cars if not in_lot(c[0], c[1])]

    # ---------------------------------------------------------------- 소화전 (~300 ft, 좌우 교대, 연석에서 3.5 ft)
    hydrants = []
    for r in streets:
        if poly_len(r["pts"]) < 120:
            continue
        side = 1
        for (x, z, h, s) in walk(r["pts"], 300.0, start=90.0):
            for sd in (side, -side):
                rx, rz = right_of(h)
                px, pz = x + rx * sd * (r["w"] / 2 + 3.5), z + rz * sd * (r["w"] / 2 + 3.5)
                if not in_clip(px, pz) or in_bld(px, pz) or in_lot(px, pz) or near_street(px, pz, 1.5):
                    continue
                if any(math.dist((px, pz), (I["x"], I["z"])) < 40 for I in I_out) or any(math.dist((px, pz), q[:2]) < 150 for q in hydrants):
                    continue
                hydrants.append([round(px, 2), round(pz, 2), round(h, 3)])
                yellow.append({"pts": r["pts"], "center": (x, z), "half": 15, "w": r["w"], "sides": [sd]})
                break
            side = -side

    # ---------------------------------------------------------------- 황색 연석: 캠퍼스 핵심부의 노상 주차 없는 구간 (스트리트뷰: 거의 모든 연석이 황색)
    for r in streets:
        P = r["pts"]
        for side in (-1, 1):
            run = None; last = 0.0
            for (x, z, h, s) in walk(P, 10.0):
                rx, rz = right_of(h)
                qx, qz = x + rx * side * (r["w"] / 2), z + rz * side * (r["w"] / 2)
                ok = in_core(x, z) and not any(math.dist((qx, qz), c) < 14 for c in curb_cars)
                if ok and run is None:
                    run = s
                elif not ok and run is not None:
                    yellow.append({"pts": P, "s0": run, "s1": s, "w": r["w"], "sides": [side]}); run = None
                last = s
            if run is not None:
                yellow.append({"pts": P, "s0": run, "s1": poly_len(P), "w": r["w"], "sides": [side]})
    ycurbs = []
    for y in yellow:
        P = y["pts"]; Ltot = poly_len(P)
        if "center" in y:
            d, q, i, t = poly_dist(y["center"], P)
            s_c = sum(math.dist(P[k], P[k + 1]) for k in range(i)) + t * math.dist(P[i], P[i + 1])
            s0, s1 = s_c - y["half"], s_c + y["half"]
        else:
            s0, s1 = y["s0"], y["s1"]
        s0, s1 = max(0.0, s0), min(Ltot, s1)
        if s1 - s0 < 3:
            continue
        pts = [(x, z, h) for (x, z, h, s) in walk(P, 3.0) if s0 <= s <= s1]
        if len(pts) < 2:
            continue
        for side in y["sides"]:
            ycurbs.append([[round(x + right_of(h)[0] * side * (y["w"] / 2 + 0.3), 2), round(z + right_of(h)[1] * side * (y["w"] / 2 + 0.3), 2)] for (x, z, h) in pts])

    # ---------------------------------------------------------------- P 표지 (주차장 입구: 차도에 닿는 service 도로 끝 중 안쪽이 주차장)
    psigns = []
    for r in services:
        P = r["pts"]
        if len(P) < 2:
            continue
        for end, nxt in ((P[0], P[1]), (P[-1], P[-2])):
            sd = min((poly_dist(end, s["pts"]) + (s,) for s in streets), key=lambda t: t[0], default=None)
            if not sd or sd[0] > sd[4]["w"] / 2 + 10:
                continue
            h = math.atan2(nxt[1] - end[1], nxt[0] - end[0])
            probe = (end[0] + math.cos(h) * 50, end[1] + math.sin(h) * 50)
            if not any(point_in_poly(probe, a["poly"]) or poly_dist(probe, a["poly"] + [a["poly"][0]])[0] < 25 for a in lots):
                continue
            d0 = sd[4]["w"] / 2 + 10
            rx, rz = right_of(h)
            px = end[0] + math.cos(h) * d0 - rx * (r["w"] / 2 + 4); pz = end[1] + math.sin(h) * d0 - rz * (r["w"] / 2 + 4)
            if in_bld(px, pz) or near_street(px, pz, 1.0) or any(math.dist((px, pz), q[:2]) < 80 for q in psigns):
                continue
            psigns.append([round(px, 2), round(pz, 2), round(h + math.pi, 3)])     # 표지 정면이 차도 쪽

    # ---------------------------------------------------------------- 안내 표지 (ISU 청색): 핵심부 교차로의 다른 모퉁이
    wayf = []
    for I in I_out:
        if not in_core(I["x"], I["z"]):
            continue
        arms = sorted(I["arms"], key=lambda a: a["h"])
        a0, a1 = arms[-1], arms[0]
        hm = math.atan2(math.sin(a0["h"]) + math.sin(a1["h"]), math.cos(a0["h"]) + math.cos(a1["h"]))
        dd = max(a0["w"], a1["w"]) / 2 * 1.41 + 9
        px, pz = I["x"] + math.cos(hm) * dd, I["z"] + math.sin(hm) * dd
        if in_bld(px, pz) or near_street(px, pz, 2):
            continue
        wayf.append([round(px, 2), round(pz, 2), round(hm, 3)])

    # ---------------------------------------------------------------- 벤치·휴지통 (벽돌 포장 보행로, ~110 ft, 좌우 교대)
    # ground.js buildLamps 와 같은 규칙의 보행로 가로등 위치 (핵심부 폭 7+ 보행로, 45 ft 시작 90 ft 간격, 가장자리 +3 ft)
    plamps = []
    for r in paths:
        if r["w"] < 7:
            continue
        mid = r["pts"][len(r["pts"]) // 2]
        if not in_core(*mid):
            continue
        for (x, z, h, s) in walk(r["pts"], 90.0, start=45.0):
            rx, rz = right_of(h)
            plamps.append((x + rx * (r["w"] / 2 + 3), z + rz * (r["w"] / 2 + 3)))
    benches, bins = [], []
    for r in paths:
        if r["surface"] != "pavers" or r["w"] < 7 or poly_len(r["pts"]) < 60:
            continue
        side = 1
        for (x, z, h, s) in walk(r["pts"], 110.0, start=40.0):
            rx, rz = right_of(h)
            px, pz = x + rx * side * (r["w"] / 2 + 2.2), z + rz * side * (r["w"] / 2 + 2.2)
            if in_bld(px, pz) or near_street(px, pz, 3) or any(math.dist((px, pz), q[:2]) < 50 for q in benches) or                     any(abs(px - q[0]) < 10 and abs(pz - q[1]) < 10 for q in plamps):
                side = -side; continue
            benches.append([round(px, 2), round(pz, 2), round(h + (math.pi if side > 0 else 0), 3)])
            bx, bz = px + math.cos(h) * 4.5, pz + math.sin(h) * 4.5
            if not in_bld(bx, bz):
                bins.append([round(bx, 2), round(bz, 2), 0.0])
            side = -side

    # ---------------------------------------------------------------- 자전거 거치대: 큰 건물의 보행로가 닿는 외벽(출입구) 옆
    racks = []
    for b in site["buildings"]:
        P = b["poly"]; n = len(P)
        area = abs(sum(P[i][0] * P[(i + 1) % n][1] - P[(i + 1) % n][0] * P[i][1] for i in range(n))) / 2
        cx = sum(p[0] for p in P) / n; cz = sum(p[1] for p in P) / n
        if area < 12000 or not in_clip(cx, cz) or b.get("h", 30) < 15:
            continue
        ring = P + [P[0]]
        best = None
        for r in paths:
            for end in (r["pts"][0], r["pts"][-1]):
                d, q, i, t = poly_dist(end, ring)
                if d < 8 and (best is None or d < best[0]):
                    best = (d, q, i)
        if not best:
            continue
        d, q, i = best
        a, c = ring[i], ring[i + 1]
        h = math.atan2(c[1] - a[1], c[0] - a[0])
        nx, nz = right_of(h)                         # CCW(위에서 반시계) 폴리곤: 진행 방향 오른쪽 = 바깥
        for sgn in (1, -1):
            px = q[0] + math.cos(h) * 14 * sgn + nx * 9; pz = q[1] + math.sin(h) * 14 * sgn + nz * 9
            if not in_bld(px, pz) and not near_street(px, pz, 4):
                racks.append([round(px, 2), round(pz, 2), round(h, 3)]); break

    # ---------------------------------------------------------------- 차도변 가로등 (핵심부, 120 ft, 양쪽)
    slamps = []
    for r in streets:
        for (x, z, h, s) in walk(r["pts"], 120.0, start=30.0):
            if not in_core(x, z):
                continue
            for sd in (-1, 1):
                rx, rz = right_of(h)
                px, pz = x + rx * sd * (r["w"] / 2 + 2.5), z + rz * sd * (r["w"] / 2 + 2.5)
                if in_bld(px, pz) or in_lot(px, pz) or near_street(px, pz, 1.0):
                    continue
                if any(math.dist((px, pz), (I["x"], I["z"])) < 30 for I in I_out) or any(math.dist((px, pz), q[:2]) < 60 for q in slamps):
                    continue
                slamps.append([round(px, 2), round(pz, 2), 0.0])

    street = {"cars": cars, "crosswalks": crosswalks, "stopbars": stopbars, "arrows": arrows,
              "signals": signals, "stops": stops, "name_signs": names_signs, "yellow_curbs": ycurbs,
              "hydrants": hydrants, "psigns": psigns, "wayfinding": wayf, "benches": benches, "bins": bins,
              "bike_racks": racks, "street_lamps": slamps,
              "intersections": [{"x": I["x"], "z": I["z"], "control": I["control"], "arms": len(I["arms"]),
                                 "names": sorted({a["name"] for a in I["arms"] if a["name"]})} for I in I_out],
              "_doc": "cars: [x,z,heading,len,r,g,b,fill,srcZoom,(headingFixed)]; crosswalks: [x,z,roadHeading,span,depth]; stopbars: [x,z,armHeading,len,0]; "
                      "arrows: [x,z,travelHeading,kind]; signals: [x,z,travelHeading,armLen,nHeads]; stops: [x,z,faceHeading]; "
                      "name_signs: [x,z,h1,h2,name1,name2]; yellow_curbs: [[x,z],...]; others: [x,z,heading]"}
    json.dump(street, open(OUT / "street.json", "w"), separators=(",", ":"))
    print(" ".join(f"{k}={len(v)}" for k, v in street.items() if isinstance(v, list)))


if __name__ == "__main__":
    main()
