# cTED Interior — Phase 1 (architecture + finishes) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Walk-through interior of the Technology Building (cTED) for the lower, first and second floors — walls, door openings, rooms with names, floor/wall/ceiling finishes, ceilings with lights, stairs and elevator — in the web viewer and exportable as a metric GLB.

**Architecture:** `tools/ted/` reads the RATIO construction-set PDFs (read-only, never copied), converts sheet coordinates to the exterior module's local frame with the column grid, and writes `viewer/assets/ted_interior.json`. `viewer/buildings/technology_interior.js` turns that JSON into geometry and is added to the exterior module's group. Extraction uses rendered rasters for walls (gray poche + outlines) and PDF text/vectors for labels, doors and dimensions.

**Tech Stack:** Python 3 (PyMuPDF `fitz`, numpy, scipy.ndimage, scikit-image, shapely), Three.js r170, pytest, Playwright renders via `tools/shot.mjs`.

## Global Constraints
- Drawings folder `D:\Projects\Drawings\ISU Files` is read-only; never copy sheets into the repo (renders for checking go in `scratch/ted/`, which is not committed).
- Frame: feet; local x = east from grid E1, local z = south from grid EM; floor FIRST = 0, SECOND = 14.67, lower level = -14.67 (85'-4"). Same frame as `viewer/buildings/technology_bldg.js` (`meta.anchor`, `meta.rotation` place it in the world).
- Sheet → local: display (rotated) coordinates, 1/8" scale = 9 pt per ft; E1 at X = 336 pt, EM at Y = 1061 pt on A-101 (fit per sheet from grid bubbles; residual must be < 0.5 ft).
- If scipy/skimage import fails with a DLL error, run with `PATH="/c/Users/parkj/anaconda3/Library/bin:/c/Users/parkj/anaconda3/Library/mingw-w64/bin:/c/Users/parkj/anaconda3:$PATH"`.
- Korean code comments; English UI text. Commits end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## File structure
| File | Responsibility |
|---|---|
| `tools/ted/sheet.py` | Open a sheet, rotated words/drawings, grid fit (`Sheet.to_local`) and raster render in local frame |
| `tools/ted/rooms.py` | Room labels (number, name, area) and room polygons by flood fill of the free-space raster |
| `tools/ted/walls.py` | Wall mask → wall polygons (shapely), door openings from swing arcs |
| `tools/ted/finishes.py` | Finish codes per room (A-151/152) + schedule (A-650) → materials; ceiling heights (A-131/132) |
| `tools/ted/build.py` | Runs everything for each floor → `viewer/assets/ted_interior.json` + overlay PNGs |
| `viewer/buildings/technology_interior.js` | JSON → Three.js group (floors, walls with openings, ceilings, lights, stairs, labels) |
| `tests/test_ted.py` | Unit + data checks |

---

### Task 1: Sheet loader and grid transform
**Files:** Create `tools/ted/__init__.py`, `tools/ted/sheet.py`; Test `tests/test_ted.py`
**Produces:** `Sheet(path)`, `.words` → list of (text, x, y, h) in display pt; `.fit_grid(GRID_X, GRID_Z)` → sets affine; `.to_local(X, Y)` → (x_ft, z_ft); `.render(ft_per_px)` → (H×W×3 uint8 array, origin (x0,z0)) in local frame.
- [ ] Write test: on A-101, every grid bubble E1..E15/EM..EA maps within 0.5 ft of its known value.
```python
GRID_X = {'E1':0,'E2':17,'E3':34,'E4':36,'E5':51,'E6':68,'E7':85,'E8':102,'E9':119,'E10':136,'E11':138,'E12':153,'E13':170,'E14':194,'E15':228}
GRID_Z = {'EM':0,'EL':17,'EK':18.5,'EJ':29.5,'EH':34,'EG':39,'EF':58,'EE':68,'ED':93,'EC':102,'EBa':113,'EB':122.5,'EA':136.1}
def test_grid_fit_a101():
    s = Sheet(A101); s.fit_grid(GRID_X, GRID_Z)
    assert s.grid_residual_ft < 0.5
```
- [ ] Implement: words via `page.get_text('words')` with each rect × `page.rotation_matrix`; grid bubbles = words matching `E\d+|E[A-M]a?` with height > 10 pt (OCR of "E1" may read "EI" → alias); least squares x = a·X + b, z = c·Y + d.
- [ ] Run tests, commit.

### Task 2: Room labels and polygons
**Files:** Create `tools/ted/rooms.py`; Test `tests/test_ted.py`
**Consumes:** `Sheet`. **Produces:** `find_rooms(sheet, wall_mask, origin, ft_per_px) -> list[dict(number, name, label_xy, poly, area_ft2)]`.
- [ ] Test: A-101 yields ≥ 45 rooms with numbers 101–147 region, each polygon closed, area > 15 ft², and LOBBY 101 contains its label point.
- [ ] Implement: label = word matching `\d{3}[A-Z]?` inside a small box drawn under a name (name words directly above within 25 pt); free space = ~wall_mask, door gaps closed by drawing door chord lines (Task 3) before flood fill; `scipy.ndimage.label` → region containing label point → `skimage.measure.find_contours` → shapely polygon simplified 0.25 ft.
- [ ] Commit.

### Task 3: Walls and doors
**Files:** Create `tools/ted/walls.py`; Test `tests/test_ted.py`
**Produces:** `wall_mask(sheet, ft_per_px)` (bool array), `door_arcs(sheet) -> list[dict(hinge, radius, start, end)]`, `wall_polys(mask) -> list[shapely Polygon]`.
- [ ] Test: wall mask covers the known exterior wall line at E15 (x≈228) over z 68..136; number of door arcs on A-101 within ±10 % of door marks in the A-601 schedule for floor 1.
- [ ] Implement: render sheet at 8 px/ft; wall pixels = gray poche (215–240, low chroma) ∪ dark pixels in strokes ≥ 0.84 pt (render a copy with only thick strokes using `get_drawings` filtered by width); remove text/dimension areas (word rects dilated); morphological closing 1 px; door arcs = drawing items of type `c` whose chord ≈ radius·√2 and radius 2.5–4.5 ft → opening chord from hinge to arc end.
- [ ] Commit.

### Task 4: Finishes and ceilings
**Files:** Create `tools/ted/finishes.py`; Test `tests/test_ted.py`
**Produces:** `finish_schedule(A650) -> dict(code -> {desc, color})`, `room_finishes(sheet_finish_plan, rooms)`, `ceiling_heights(sheet_rcp, rooms) -> dict(room -> height_ft)`, `ceiling_lights(sheet_rcp) -> list[(x,z,w,d)]`.
- [ ] Test: every first-floor room gets a floor finish code present in the schedule; ceiling heights are within 7.5–30 ft.
- [ ] Implement: codes like `CPT-1`, `RF-1`, `PT-2`, `ACT-1` read from text inside each room polygon; heights from RCP text `9'-0" A.F.F.` patterns inside the room; lights = rectangles (`re` items) of 2×2 / 2×4 ft sizes on the RCP.
- [ ] Commit.

### Task 5: Build JSON for all floors + overlays
**Files:** Create `tools/ted/build.py`; Test `tests/test_ted.py`
**Produces:** `viewer/assets/ted_interior.json`:
```json
{"frame":"technology_bldg local ft","floors":[{"name":"FIRST","y":0,"height":14.67,
  "walls":[{"poly":[[x,z],...],"h":12}], "doors":[{"a":[x,z],"b":[x,z]}],
  "rooms":[{"no":"101","name":"LOBBY","poly":[[x,z],...],"area":1234,"floor":"CPT-1","wall":"PT-1","ceiling":"ACT-1","ch":10}],
  "lights":[[x,z,w,d]], "stairs":[...]}]}
```
- [ ] Test: JSON has 3 floors; room numbers on FIRST ⊇ the 52 label numbers found in Task 2; all room polygons inside the exterior outline from the module (buffer 2 ft).
- [ ] Implement + write `scratch/ted/overlay_<floor>.png` (sheet render with extracted walls red, doors blue, rooms tinted).
- [ ] Review overlays by eye; fix extraction; commit.

### Task 6: Viewer module
**Files:** Create `viewer/buildings/technology_interior.js`; Modify `viewer/buildings/technology_bldg.js` (attach interior), `viewer/app.js` (floor selector + room picking), `tools/index_template.html` (Interior floor buttons)
**Consumes:** JSON from Task 5.
- [ ] Build floors (slabs), walls extruded to `ch` with door openings cut (walls split at door chords, lintel above 7 ft), ceilings at `ch` (hidden in cutaway), lights as emissive panels, room labels (sprites), finish colours from schedule.
- [ ] Floor cutaway: buttons "Interior: Lower / First / Second / Off" hide exterior walls+roof of the building and upper floors.
- [ ] Render checks: top-down per floor vs sheet; eye-level views in Lobby 101 and Corridor 146; console clean.
- [ ] Commit, push.

### Task 7: Stairs and elevator
**Files:** Modify `tools/ted/build.py`, `viewer/buildings/technology_interior.js`
- [ ] From A-421/A-422 enlarged plans: stair boundaries, run direction, tread count (risers = floor height / 7"), landings; elevator shaft boxes.
- [ ] Render check of the lobby stair against A-421 section.
- [ ] Commit.

## Self-review
Spec phase 1 items: walls ✔ (T3), door openings ✔ (T3/T6), interior glazing → handled as wall openings with glass in T6 when the wall type is storefront (partition type text), ceilings+lights ✔ (T4/T6), stairs/elevator ✔ (T7), finishes ✔ (T4), room labels ✔ (T2/T6), lower/first/second ✔ (T5), verification overlays ✔ (T5/T6). GLB metric export is Phase 3 (separate plan).
