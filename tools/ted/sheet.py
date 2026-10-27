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

    def to_local(self, X, Y):
        return self.ax * X + self.bx, self.az * Y + self.bz

    def to_sheet(self, x, z):
        return (x - self.bx) / self.ax, (z - self.bz) / self.az

    def render(self, ft_per_px, x0, z0, x1, z1, **kw):
        """로컬 사각형 [x0,x1]×[z0,z1] 을 ft_per_px 해상도로 렌더 → (H, W, 3) uint8"""
        X0, Y0 = self.to_sheet(x0, z0); X1, Y1 = self.to_sheet(x1, z1)
        clip = fitz.Rect(min(X0, X1), min(Y0, Y1), max(X0, X1), max(Y0, Y1)) * ~self.M
        zoom = abs(1.0 / (self.ax * ft_per_px))      # pt → px
        pix = self.page.get_pixmap(matrix=fitz.Matrix(zoom, zoom).prerotate(self.page.rotation), clip=clip, alpha=False, **kw)
        a = np.frombuffer(pix.samples, np.uint8).reshape(pix.height, pix.width, pix.n)[..., :3]
        return a.copy()
