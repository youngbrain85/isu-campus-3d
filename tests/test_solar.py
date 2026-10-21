import json, pathlib, shutil, subprocess, tempfile
import pytest

ROOT = pathlib.Path(__file__).resolve().parents[1]

# 기대값: mourner/suncalc 1.9.0 으로 계산한 값 (39.471 N, 87.410 W, 테르호트 현지 시각)
CASES = [
    ("2026-06-21", 13.75, 73.91, 174.5),   # 하지 남중 (EDT, UTC-4)
    ("2026-12-21", 12.75, 27.09, 179.2),   # 동지 남중 (EST, UTC-5)
    ("2026-03-20", 9.0, 11.85, 100.2),
    ("2026-09-22", 17.5, 25.14, 247.6),
    ("2026-01-15", 15.0, 23.21, 210.7),
]


@pytest.mark.skipif(shutil.which("node") is None, reason="node not installed")
def test_solar_matches_suncalc():
    src = (ROOT / "viewer/lib/solar.js").read_text(encoding="utf-8")
    with tempfile.TemporaryDirectory() as d:
        (pathlib.Path(d) / "solar.mjs").write_text(src, encoding="utf-8")
        script = "import {sunPosition, localToDate} from './solar.mjs';" \
                 f"const C={json.dumps([c[:2] for c in CASES])};" \
                 "console.log(JSON.stringify(C.map(([d,h])=>sunPosition(localToDate(d,h),39.471,-87.410))));"
        (pathlib.Path(d) / "t.mjs").write_text(script, encoding="utf-8")
        out = json.loads(subprocess.check_output(["node", "t.mjs"], cwd=d, text=True))
    for (ymd, h, elev, az), r in zip(CASES, out):
        assert abs(r["elev"] - elev) < 0.02 and abs(r["az"] - az) < 0.1, (ymd, h, r)
