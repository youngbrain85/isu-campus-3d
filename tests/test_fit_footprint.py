import sys, pathlib, math
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / "tools"))
import fit_footprint as ff


def rot(p, deg):
    c, s = math.cos(math.radians(deg)), math.sin(math.radians(deg))
    return [c * p[0] - s * p[1], s * p[0] + c * p[1]]


def test_recovers_known_transform():
    local = [[0, 0], [200, 0], [200, 80], [120, 80], [120, 140], [0, 140]]
    truth = (350.0, -220.0, 23.0)
    world = [[rot(p, truth[2])[0] + truth[0], rot(p, truth[2])[1] + truth[1]] for p in local]
    ax, az, deg, rms = ff.fit(local, world)
    assert abs(ax - truth[0]) < 1.0 and abs(az - truth[1]) < 1.0 and abs(deg - truth[2]) < 0.5 and rms < 0.5


def test_recovers_large_rotation_with_noise():
    local = [[0, 0], [300, 0], [300, 120], [180, 120], [180, 60], [0, 60]]   # 비대칭 (직사각형은 180° 모호)
    truth = (-900.0, 410.0, -97.0)
    world = [[rot(p, truth[2])[0] + truth[0] + (0.8 if i % 2 else -0.8), rot(p, truth[2])[1] + truth[1]] for i, p in enumerate(local)]
    ax, az, deg, rms = ff.fit(local, world)
    assert abs(ax - truth[0]) < 2.5 and abs(az - truth[1]) < 2.5 and abs(((deg - truth[2]) + 180) % 360 - 180) < 1.0 and rms < 2.0
