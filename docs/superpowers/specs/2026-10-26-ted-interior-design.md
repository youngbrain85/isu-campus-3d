# Technology Building (cTED) interior model — design

Date: 2026-10-26. Status: approved by user in chat ("응 그렇게 진행해").

## Goal
Model the interior of the Technology Building (Bailey College of Engineering & Technology, renovated as the
"ISU Center for Technology, Engineering and Design", OSM `way/461428305`) at maximum detail from the RATIO 2025
construction set, for two uses:
1. the campus web viewer (floor-by-floor cutaway, click a room for its name/area);
2. VR walking on the Omni One treadmill through Unreal (metric GLB with walkable floors and collision walls).

The user calls this building "Technology Annex".

## Source drawings (read-only, never copied into the repo)
`D:\Projects\Drawings\ISU Files\cTED building plans\cTED ArchStructCivil drawings\Architectural\` — vector PDFs with text, 1/8" = 1'-0".

| Need | Sheets |
|---|---|
| Floor plans (walls, doors, rooms) | A-100 lower, A-101 first, A-102 second |
| Partition types (wall thickness/height) | A-002 |
| Ceiling heights, lights | A-131, A-132 |
| Finishes | A-151, A-152, A-650, A-651 |
| Stairs, elevators | A-421, A-422, A-424, A-425 |
| Doors | A-601 |
| Glazing | A-610, A-611 (exterior already modelled) |
| Casework | A-501 |
| Equipment | A-701, A-702, A-704 |
| Levels | A-301 sections, A-201/202 elevations (FIRST 100'-0", SECOND 114'-8", lower level 85'-4") |

## Approach
Automatic extraction from PDF vectors and text, then per-room review against the drawing.

- `tools/ted_extract.py` reads the sheets and writes `data/ted_interior.json`:
  floors → rooms (number, name, polygon, area, finish codes, ceiling height), walls (centre line, thickness, height,
  partition type), doors (position, width, swing, type), stairs, elevators, ceiling lights, equipment, casework.
- Sheet coordinates map to the existing exterior module's local frame (grid E1/EM origin, feet) using the column
  grid lines, which are labelled text in every plan. The exterior module `viewer/buildings/technology_bldg.js`
  already uses this frame, so interior and exterior line up.
- `viewer/buildings/technology_interior.js` builds the 3D interior from that JSON and is attached to the
  exterior module's group.

## Phases
1. **Architecture and finishes** for lower, first and second floors: walls, door openings (doors shown open),
   interior glazing, ceilings with lights, stairs and elevator shafts, floor/wall/ceiling finishes per room,
   room labels.
2. **Equipment, casework, furniture**: equipment from A-701/702/704, casework from A-501 elevations. General
   furniture is not in the architectural set; typical layouts per room type are added and marked as estimated.
3. **Use**: web viewer floor cutaway with room picking; metric GLB export with separate `walkable` and
   `collision` layers for Unreal/Omni One.

## Verification
- Overlay images of extracted walls/doors/rooms on the rendered sheet for every floor.
- Automated checks: room count and room numbers match the plan labels; door count matches A-601; every room
  polygon is closed and inside the exterior outline; floors align with the exterior at the grid lines.
- Renders of each floor (cutaway, top-down and eye level) compared with the sheets.

## Assumptions
- The model shows the 2025 renovated state; where the built building differs and no photo exists, the drawings win.
- Doors are modelled open so VR walking is not blocked.
- Furniture not shown in the drawings is estimated and labelled as such in the room info.
