import sys, pathlib
import pytest
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / "tools"))
from ted.sheet import Sheet, sheet_path, ARCH

pytestmark = pytest.mark.skipif(not ARCH.exists(), reason="cTED drawings not available on this machine")


@pytest.mark.parametrize("sheet", ["A-100", "A-101", "A-102", "A-131", "A-132"])
def test_grid_fit(sheet):
    s = Sheet(sheet_path(sheet)).fit_grid()
    assert s.grid_residual_ft < 0.6
    assert abs(abs(s.ax) - 1 / 9) < 0.002          # 1/8" = 1'-0" → 9 pt/ft
