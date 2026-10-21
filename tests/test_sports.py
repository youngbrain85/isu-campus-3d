import json, math, pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]


def _dims(poly):
    # 가장 긴 변 방향 기준 외접 사각형의 (길이, 폭)
    best = None
    for i in range(len(poly)):
        a, b = poly[i], poly[(i + 1) % len(poly)]
        L = math.dist(a, b)
        if L < 1:
            continue
        u = ((b[0] - a[0]) / L, (b[1] - a[1]) / L); v = (-u[1], u[0])
        pu = [p[0] * u[0] + p[1] * u[1] for p in poly]; pv = [p[0] * v[0] + p[1] * v[1] for p in poly]
        d = (max(pu) - min(pu), max(pv) - min(pv))
        if best is None or d[0] * d[1] < best[0] * best[1]:
            best = d
    return max(best), min(best)


def test_sports_json_courts():
    d = json.load(open(ROOT / "viewer/assets/sports.json"))
    # 위성 판독: 테니스 6 면, 피클볼 6 면, 남색 구획 3, 비치발리볼 2
    assert len(d["tennis"]) == 6 and len(d["pickleball"]) == 6 and len(d["blocks"]) == 3 and len(d["volley"]) == 2
    for p in d["tennis"]:
        L, W = _dims(p)
        assert abs(L - 78) < 3 and abs(W - 36) < 3          # 복식 코트 78 × 36 ft
    for p in d["pickleball"]:
        L, W = _dims(p)
        assert abs(L - 44) < 3 and abs(W - 20) < 3          # 피클볼 44 × 20 ft
    names = {f["name"] for f in d["fields"]}
    assert "St. John Softball Complex" in names and "Price Field" in names
