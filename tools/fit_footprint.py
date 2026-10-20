#!/usr/bin/env python3
"""도면 로컬 외곽선을 OSM footprint(로컬 평면 ft)에 강체(회전+이동) 피팅한다.

규약: world = R(rotation_deg) · local + anchor,  R = [[c, -s], [s, c]]  (viewer/lib/geom.js toWorld 와 동일)
사용: python tools/fit_footprint.py outline.json way/183426119
      outline.json = [[x, z], ...]  (도면 피트, 평면도에서 x=오른쪽, z=아래쪽)
출력: {"anchor": [x, z], "rotation": deg, "rms": ft, "n_local": .., "n_world": ..}
"""
import json, math, sys
from pathlib import Path
import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent))


def resample(poly, step=2.0):
    pts = []
    n = len(poly)
    for i in range(n):
        a, b = np.array(poly[i], float), np.array(poly[(i + 1) % n], float)
        L = np.linalg.norm(b - a)
        k = max(1, int(L / step))
        for j in range(k):
            pts.append(a + (b - a) * (j / k))
    return np.array(pts)


def nearest_on_poly(P, poly):
    """P (m,2) 각 점에서 폴리곤 변까지 가장 가까운 점 (m,2)"""
    best = None; bestd = None
    n = len(poly)
    for i in range(n):
        a, b = np.array(poly[i], float), np.array(poly[(i + 1) % n], float)
        ab = b - a; L2 = ab @ ab
        t = np.clip(((P - a) @ ab) / (L2 if L2 > 1e-9 else 1), 0, 1)
        Q = a + t[:, None] * ab
        d = np.linalg.norm(P - Q, axis=1)
        if best is None:
            best, bestd = Q, d
        else:
            m = d < bestd; best[m] = Q[m]; bestd[m] = d[m]
    return best, bestd


def kabsch2d(A, B):
    """A→B 로의 회전각(rad)과 이동: B ≈ R A + t"""
    ca, cb = A.mean(0), B.mean(0)
    H = (A - ca).T @ (B - cb)
    U, S, Vt = np.linalg.svd(H)
    d = np.sign(np.linalg.det(Vt.T @ U.T))
    D = np.diag([1, d])
    R = Vt.T @ D @ U.T
    ang = math.atan2(R[1, 0], R[0, 0])
    t = cb - R @ ca
    return ang, t


def principal_angle(P):
    c = P - P.mean(0)
    cov = c.T @ c
    w, v = np.linalg.eigh(cov)
    major = v[:, np.argmax(w)]
    return math.atan2(major[1], major[0])


def fit(local_poly, world_poly, iters=40):
    L = resample(local_poly); W = resample(world_poly)
    a0 = principal_angle(W) - principal_angle(L)
    best = None
    for k in range(4):
        ang = a0 + k * math.pi / 2
        c, s = math.cos(ang), math.sin(ang)
        R = np.array([[c, -s], [s, c]])
        t = W.mean(0) - R @ L.mean(0)
        for _ in range(iters):
            P = (R @ L.T).T + t
            Q, d = nearest_on_poly(P, world_poly)
            ang2, t2 = kabsch2d(L, Q)
            c, s = math.cos(ang2), math.sin(ang2)
            R = np.array([[c, -s], [s, c]]); t = t2; ang = ang2
        P = (R @ L.T).T + t
        _, d = nearest_on_poly(P, world_poly)
        # 양방향: world 샘플에서 local 변환본까지의 거리도 포함 (부분 일치 방지)
        Pl = [list(p) for p in P]
        _, d2 = nearest_on_poly(W, Pl)
        rms = math.sqrt((np.mean(d ** 2) + np.mean(d2 ** 2)) / 2)
        if best is None or rms < best[3]:
            best = (float(t[0]), float(t[1]), math.degrees(ang), rms)
    ax, az, deg, rms = best
    deg = (deg + 180) % 360 - 180
    return ax, az, deg, rms


def osm_poly(osm_id):
    root = Path(__file__).resolve().parent.parent
    site = json.load(open(root / "viewer" / "assets" / "site.json"))
    for b in site["buildings"]:
        if b["id"] == osm_id:
            return b["poly"]
    raise SystemExit(f"{osm_id} not in site.json")


if __name__ == "__main__":
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    local = json.load(open(sys.argv[1]))
    world = osm_poly(sys.argv[2])
    ax, az, deg, rms = fit(local, world)
    print(json.dumps({"anchor": [round(ax, 2), round(az, 2)], "rotation": round(deg, 3), "rms": round(rms, 2),
                      "n_local": len(local), "n_world": len(world)}))
