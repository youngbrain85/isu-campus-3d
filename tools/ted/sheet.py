"""cTED 도면 시트 로더: 회전된 화면 좌표의 글자/도형, 그리드 기준 로컬 좌표 변환, 로컬 좌표계 래스터 렌더.

로컬 좌표 = viewer/buildings/technology_bldg.js 와 같은 프레임 (ft, x = 그리드 E1 에서 동쪽, z = 그리드 EM 에서 남쪽).
도면 폴더는 읽기 전용 — 여기서는 읽기만 한다.
"""
import re
from pathlib import Path
import numpy as np
import fitz

ARCH = Path(r"D:\Projects\Drawings\ISU Files\cTED building plans\cTED ArchStructCivil drawings\Architectural")
GRID_X = {'E1': 0, 'E2': 17, 'E3': 34, 'E4': 36, 'E5': 51, 'E6': 68, 'E7': 85, 'E8': 102, 'E9': 119, 'E10': 136,
          'E11': 138, 'E12': 153, 'E13': 170, 'E14': 194, 'E15': 228}
GRID_Z = {'EM': 0, 'EL': 17, 'EK': 18.5, 'EJ': 29.5, 'EH': 34, 'EG': 39, 'EF': 58, 'EE': 68, 'ED': 93, 'EC': 102,
          'EBa': 113, 'EB': 122.5, 'EA': 136.1}
ALIAS = {'EI': 'E1'}        # 글자 추출에서 "E1" 이 "EI" 로 읽힘


def sheet_path(prefix):
    """'A-101' → 해당 PDF 경로"""
    hits = sorted(ARCH.glob(prefix + '-*.pdf'))
    if not hits:
        raise FileNotFoundError(prefix)
    return hits[-1]


class Sheet:
    def __init__(self, path):
        self.path = Path(path)
        self.doc = fitz.open(str(path))
        self.page = self.doc[0]
        self.M = self.page.rotation_matrix
        self.words = []
        for w in self.page.get_text('words'):
            r = fitz.Rect(w[:4]) * self.M
            self.words.append((w[4], (r.x0 + r.x1) / 2, (r.y0 + r.y1) / 2, r.height, r))
        self.ax = self.bx = self.az = self.bz = None
        self.grid_residual_ft = None

    def grid_bubbles(self, hmin=8.5):
        """그리드 원 안의 큰 글자. 이름 → [(X, Y)]"""
        out = {}
        for t, x, y, h, _ in self.words:
            t = ALIAS.get(t, t)
            if h > hmin and (t in GRID_X or t in GRID_Z):
                out.setdefault(t, []).append((x, y))
        return out

    def fit_grid(self, gx=GRID_X, gz=GRID_Z, scale=1 / 9):
        """x_ft = X/9 + bx, z_ft = Y/9 + bz. 축척(1/8")은 고정하고 오프셋만 중앙값으로 맞춘 뒤,
        1 ft 넘게 어긋나는 글자(다른 상세도 번호·범례 등)는 버리고 최소제곱으로 다시 맞춘다."""
        b = self.grid_bubbles()
        def fit(pairs):
            v = np.array(pairs, float)
            off = np.median(v[:, 1] - scale * v[:, 0])
            keep = np.abs(v[:, 1] - (scale * v[:, 0] + off)) < 1.0
            v = v[keep]
            a, c = np.polyfit(v[:, 0], v[:, 1], 1) if len(np.unique(v[:, 0])) > 2 else (scale, off)
            return a, c, float(np.abs(np.polyval([a, c], v[:, 0]) - v[:, 1]).max()), int(keep.sum()), len(keep)
        px = [(x, gx[k]) for k, pts in b.items() if k in gx for (x, _) in pts]
        pz = [(y, gz[k]) for k, pts in b.items() if k in gz for (_, y) in pts]
        if len(px) < 3 or len(pz) < 3:
            raise ValueError(f"{self.path.name}: grid bubbles not found (x {len(px)}, z {len(pz)})")
        self.ax, self.bx, rx, nx, tx = fit(px)
        self.az, self.bz, rz, nz, tz = fit(pz)
        self.grid_residual_ft = max(rx, rz)
        self.grid_used = (nx, tx, nz, tz)
        return self

    def _poche_rects(self):
        out = []
        for d in self.page.get_drawings():
            if d['type'] == 'f' and d.get('fill') and abs(d['fill'][0] - 0.898) < 0.01:
                for it in d['items']:
                    if it[0] == 're':
                        r = it[1] * self.M
                        if r.width * r.height > 20:
                            out.append((r.x0, r.y0, r.width, r.height))
        return out

    def align_to(self, ref):
        """그리드 기호가 없는 시트(A-151/152 마감 평면): 같은 크기의 포셰 사각형(벽·기둥)을 ref 평면과 짝지어
        평행이동 (dX, dY) 의 최빈값을 구하고, ref 의 그리드 변환을 그대로 쓴다. 잔차(ft) 를 grid_residual_ft 에."""
        a, b = ref._poche_rects(), self._poche_rects()
        d = [(x0 - X0, y0 - Y0) for x0, y0, w, h in a for X0, Y0, W, H in b if abs(w - W) < 0.05 and abs(h - H) < 0.05]
        if not d:
            raise ValueError(f"{self.path.name}: no matching poche to align with {ref.path.name}")
        d = np.array(d)
        from collections import Counter
        mode = np.array(Counter((round(x), round(y)) for x, y in d).most_common(1)[0][0], float)
        near = d[np.hypot(*(d - mode).T) < 1.5]
        dx, dy = np.median(near, axis=0)
        self.ax, self.az = ref.ax, ref.az
        self.bx, self.bz = ref.bx + ref.ax * dx, ref.bz + ref.az * dy
        self.grid_residual_ft = float(np.abs(near - (dx, dy)).max() * abs(ref.ax))
        self.grid_used = (len(near), len(d))
        return self

    def to_local(self, X, Y):
        return self.ax * X + self.bx, self.az * Y + self.bz

    def to_sheet(self, x, z):
        return (x - self.bx) / self.ax, (z - self.bz) / self.az

    def render(self, ft_per_px, x0, z0, x1, z1, **kw):
        """로컬 사각형 [x0,x1]×[z0,z1] 을 ft_per_px 해상도로 렌더 → (H, W, 3) uint8.
        get_pixmap 은 페이지 회전을 적용한 화면 좌표로 그리므로 전체를 렌더한 뒤 잘라 낸다(범위 밖은 흰색)."""
        zoom = abs(self.ax / ft_per_px)              # px per pt = (ft/pt) / (ft/px)
        key = round(zoom, 6)
        if getattr(self, '_full_key', None) != key:
            pix = self.page.get_pixmap(matrix=fitz.Matrix(zoom, zoom), alpha=False, **kw)
            self._full = np.frombuffer(pix.samples, np.uint8).reshape(pix.height, pix.width, pix.n)[..., :3].copy()
            self._full_key = key
        F = self._full
        X0, Y0 = self.to_sheet(x0, z0)
        W = int(round((x1 - x0) / ft_per_px)); H = int(round((z1 - z0) / ft_per_px))
        c0, r0 = int(round(X0 * zoom)), int(round(Y0 * zoom))
        out = np.full((H, W, 3), 255, np.uint8)
        rs, cs = max(0, r0), max(0, c0); re_, ce = min(F.shape[0], r0 + H), min(F.shape[1], c0 + W)
        if re_ > rs and ce > cs:
            out[rs - r0:re_ - r0, cs - c0:ce - c0] = F[rs:re_, cs:ce]
        return out


# 건물 외곽 (로컬 ft): technology_bldg.js 의 기존동 outline + 북측 증축(상부 볼륨 5.45..121.45 × -76.5..0) + 서측 증축(-9.85..35 × 34..136.1).
# 동측 브리지(228..270.5)는 2층에만 있다.
EXISTING = [(0, 0), (0, 68), (35, 68), (35, 136), (228, 136), (228, 68), (228, 58), (173, 58), (173, 0)]
YARD_124C = (174.98, 22.69, 194.32, 42.02)
BRIDGE = [(228, 68), (270.5, 41.5), (270.5, 31), (228, 57)]


def building_outline(floor='FIRST', buffer=0.0):
    """층별 건물 외곽 shapely 다각형"""
    from shapely.geometry import Polygon, box
    from shapely.ops import unary_union
    parts = [Polygon(EXISTING), box(5.45, -76.5, 121.45, 0), box(-9.85, 34, 35, 136.1)]
    if floor == 'FIRST':
        parts.append(box(*YARD_124C))           # CM LAB ENCLOSURE 124C: CM 랩 동쪽 바깥의 울타리 친 마당 (A-101)
    if floor == 'SECOND':
        parts.append(Polygon(BRIDGE).buffer(0.5))
    g = unary_union(parts)
    return g.buffer(buffer, join_style=2) if buffer else g
