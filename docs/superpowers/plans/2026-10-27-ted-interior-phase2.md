# cTED Interior — Phase 2 (equipment, casework, fixtures, furniture) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fill the phase-1 cTED interior with the equipment, casework, plumbing fixtures and furniture shown in the construction set, plus estimated furniture where the set shows none.

**Architecture:** A new step `tools/ted/contents.py` reads the sheets (read-only) and the phase-1 floor data (rooms, walls) and adds `equipment`, `casework`, `fixtures`, `furniture` arrays to every floor of `viewer/assets/ted_interior.json`. It runs at the end of `build.py` and can also run alone on the existing JSON (`python -I tools/ted/contents.py`, ~20 s) for fast iteration. `viewer/lib/interior.js` builds low-poly instanced models per item type.

**Tech Stack:** Python 3 (PyMuPDF, numpy, scipy.ndimage, scikit-image, shapely), Three.js r170 InstancedMesh, pytest, Playwright renders (`scratch/ted/*.mjs`).

## Global Constraints
- Drawings folder `D:\Projects\Drawings\ISU Files` is read-only; renders for checking go to `scratch/ted/` (not committed).
- Frame: local ft, x east from grid E1, z south from grid EM, FIRST floor = 0 (phase-1 frame). Item rotation `rot` = Three.js rotation about +y (local +x of the model maps to plan direction (cos rot, −sin rot)).
- Korean code comments; English UI text. Commit message ends with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Do not push.
- Whole building (exterior + interior) under 400k triangles.

## Findings that shape the design
- A-701 / A-702 are coloured: **equipment = light green fill** (RGB ≈ 213,228,194 / 227,237,214), **furniture (FF&E) = blue fill** (≈ 147,197,232), both drawn as scan-line rectangles → extract by colour from the rendered sheet, not from vectors. Grid bubbles fit with residual 0.07 ft.
- Equipment tags `E\d{3}[a-c]?X?` (90 on A-701, 55 on A-702, 9.6 pt) sit in boxes with a black leader + arrowhead to the item → trace the dark connected component from the tag box; the farthest pixel is the arrow tip.
- A-704 schedule gives description, class, count, mounting (FLOOR / FIXED COUNTER / IN A CABINET / ON MONITOR CART) but **no sizes** → footprint from the drawn green outline, height from a type table.
- Casework outlines on A-701/A-702 are closed solid black 0.36 pt rectangles (lab islands e.g. 4.5 × 20.6 ft in 106, wall counters closed by the wall face). A-501 elevations give counter height (2'-10" cabinet + top) and the wall-mounted items (VDS-01 marker boards 8'×4' at 3'-0", monitors at 5'-0" / 4'-6") by room + wall direction. A-401 holds only lobby/vestibule details (no casework).
- Restroom fixtures on A-101/A-102 are tessellated line drawings; their enclosed white regions have stable signatures (toilet bowl ≈ 1.17 × 0.79 ft solid ellipse, lavatory bowl ≈ 1.53 × 1.10 ft, urinal ≈ 1.75 × 0.47 ft). Toilet partitions are already in the phase-1 wall mask.

## File structure
| File | Responsibility |
|---|---|
| `tools/ted/equipment.py` | A-704 schedule parse; colour masks → components; tag → leader tip → equipment item; blue components → furniture items (chairs grouped, monitors from desk holes) |
| `tools/ted/casework.py` | Closed black-outline counters/islands (+ sinks) from A-701/A-702; A-501 wall items (VDS, monitors) placed on the named wall of the named room |
| `tools/ted/fixtures.py` | Toilets, urinals, lavatories, drinking fountains from A-100/101/102 white-region shapes in restroom-type rooms |
| `tools/ted/furnish.py` | Estimated layouts for rooms without drawn furniture (`estimated: true`) |
| `tools/ted/contents.py` | Runs the four, snaps items inside rooms / clear of walls, writes the arrays + `stats.contents` |
| `tools/ted/build.py` | Calls `contents.add_contents(data)` before writing |
| `viewer/lib/interior.js` | Instanced low-poly models per type |
| `viewer/app.js` | Room panel line "Furniture: estimated layout" |
| `tests/test_ted.py` | Count / containment / wall-clearance / estimated-flag checks |

### Task 1: Equipment and drawn furniture (`equipment.py`)
- [ ] Test: tagged equipment on FIRST within ±5 % of the 90 tags on A-701, SECOND within ±5 % of 55 (A-702).
- [ ] Implement schedule parse, colour components, leader tracing, type table (vehicle, lift, dyno, robot cell, hood, booth, plotter, 3D printer, TV, bench-top unit, …) and furniture classes (chair, stool, lounge chair, table, desk, round table, sofa, monitor).

### Task 2: Casework (`casework.py`)
- [ ] Closed black-line regions (short side 1.4–5 ft, long ≥ 2.5 ft, rectangular) in lab/classroom/office/kitchen rooms → `base_cabinet` (counter 2.93 ft) with sinks from enclosed holes.
- [ ] A-501 wall items: 106 S (2 VDS), 105 S (2 monitors + 2 VDS), 145 E/S (monitors 7'/10' from ends), hoteling 206/207/208 monitors.

### Task 3: Fixtures (`fixtures.py`)
- [ ] Region-shape classifier inside rooms named RESTROOM / RR / KITCHENETTE; orientation from the nearest wall (tank / back to the wall); drinking fountains = bi-level alcove region with two drain circles.

### Task 4: Estimated furniture (`furnish.py`)
- [ ] Per room type (classroom rows of 2-person tables facing the teaching wall, computer lab desk rows + monitors, office desk + chair, breakout soft seating, conference table + chairs) only in rooms with no drawn furniture; keep 3 ft clear of doors and 0.5 ft from walls.

### Task 5: Integration, viewer, tests, renders
- [ ] `contents.py`, `build.py` hook, JSON arrays `{type,x,z,rot,w,d,h,y0?,label?,tag?,estimated?,src}`.
- [ ] `interior.js` instanced models; app.js panel line.
- [ ] Tests: counts, every item inside a room polygon, no item overlapping a wall polygon by > 0.3 ft, `estimated` flag on non-drawing furniture.
- [ ] Renders: FIRST/SECOND cutaways, eye-level classroom, Robotics 145, Automotive 127, restrooms, lobby; composites `scratch/ted/p2_cmp_*.png`; triangle count.
- [ ] Commit.
