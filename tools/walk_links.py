#!/usr/bin/env python3
"""건물 입구 보도 연결: OSM 보도 선이 건물 앞에서 끊긴 곳(다른 선과 이어지지 않은 끝점이 건물 외벽 1~25 ft 앞)을
외벽의 가장 가까운 점까지 연장한다. viewer/assets/site.json 의 roads[] 를 고치고, 고친 끝점 목록을 출력한다.
여러 번 실행해도 결과가 같다 (연장된 끝점은 외벽 위에 있어 다시 처리되지 않음).
검증: scratch/links/*.png (위성 z20 위에 연장 구간 표시) 를 스트리트뷰·위성으로 확인.
"""
import json, sys
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
ASSET = ROOT / "viewer/assets"


def _nearest_on_poly(p, poly):
    """점 p 에서 폴리곤 외곽선의 최근접점과 거리"""
    best = (1e18, None, False)
    n = len(poly)
    for i in range(n):
        a, b = poly[i], poly[(i + 1) % n]
        dx, dz = b[0] - a[0], b[1] - a[1]; L2 = dx * dx + dz * dz or 1e-9
        t = max(0.0, min(1.0, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dz) / L2))
        q = (a[0] + t * dx, a[1] + t * dz); d2 = (q[0] - p[0]) ** 2 + (q[1] - p[1]) ** 2
        if d2 < best[0]:
            # 직각 판정: 최근접점이 변 내부이고, 보도 끝점→벽 방향이 벽 법선과 35° 이내
            L = L2 ** 0.5; vx, vz = q[0] - p[0], q[1] - p[1]; vl = (vx * vx + vz * vz) ** 0.5 or 1e-9
            cosn = abs(vx * (-dz) + vz * dx) / (vl * L)
            best = (d2, q, 0.03 < t < 0.97 and cosn > 0.82)
    return best[0] ** 0.5, best[1], best[2]


def _inside(p, poly):
    c = False
    for i in range(len(poly)):
        a, b = poly[i], poly[i - 1]
        if (a[1] > p[1]) != (b[1] > p[1]) and p[0] < (b[0] - a[0]) * (p[1] - a[1]) / (b[1] - a[1]) + a[0]:
            c = not c
    return c


def connect_entrances(site, max_gap=25.0):
    """OSM 보도 선이 건물 입구 앞에서 끊긴 곳(끝점이 건물 외벽에서 0.5~max_gap ft, 다른 보도와 이어지지 않음)을
    외벽 최근접점까지 연장한다. 반환: 연장한 개수. 이미 연장된 끝점은 거리 0 이라 다시 처리되지 않는다(멱등)."""
    paths = [r for r in site["roads"] if r["kind"] != "road"]
    ends = [(tuple(r["pts"][0]), tuple(r["pts"][-1])) for r in paths]
    allpts = [tuple(p) for r in site["roads"] for p in r["pts"]]
    blds = [(b["poly"], (min(q[0] for q in b["poly"]), max(q[0] for q in b["poly"]), min(q[1] for q in b["poly"]), max(q[1] for q in b["poly"])))
            for b in site["buildings"]]
    n = 0; added = []
    for r, (s0, s1) in zip(paths, ends):
        for which, p in ((0, s0), (-1, s1)):
            # 다른 선과 이어진 끝점(3 ft 이내에 다른 점이 있는 경우)은 건드리지 않는다
            if sum(1 for q in allpts if abs(q[0] - p[0]) < 3 and abs(q[1] - p[1]) < 3) > 1:
                continue
            best = (max_gap, None)
            for poly, (x0, x1, z0, z1) in blds:
                if p[0] < x0 - max_gap or p[0] > x1 + max_gap or p[1] < z0 - max_gap or p[1] > z1 + max_gap:
                    continue
                if _inside(p, poly):
                    best = (0, None); break
                d, q, perp = _nearest_on_poly(p, poly)
                # 최근접점이 벽 모서리(꼭짓점)면 대각선으로 모서리에 붙는 연결이 되므로 제외 — 입구는 벽면에 직각으로 닿는다
                if perp and 1.0 < d < best[0]:
                    best = (d, q)
            if best[1] is not None:
                q = [round(best[1][0], 1), round(best[1][1], 1)]
                if which == 0: r["pts"].insert(0, q)
                else: r["pts"].append(q)
                n += 1; added.append((list(p), q))
    return n, added


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    site = json.load(open(ASSET / "site.json"))
    n, added = connect_entrances(site)
    json.dump(site, open(ASSET / "site.json", "w"), separators=(",", ":"))
    json.dump(added, open(ROOT / "scratch/links_added.json", "w"))
    print("walkways extended to building walls:", n)


if __name__ == "__main__":
    main()
