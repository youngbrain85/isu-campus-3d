"""cTED 실내 데이터 빌드: 층마다 벽·문·방·마감·천장·조명 → viewer/assets/ted_interior.json + scratch/ted/overlay_<층>.png

실행:  python -I tools/ted/build.py   (저장소 루트에서; scipy DLL 오류 시 anaconda Library/bin 을 PATH 에)
좌표 = technology_bldg.js 로컬 프레임 (ft, x = 그리드 E1 에서 동쪽, z = 그리드 EM 에서 남쪽), y = 층 바닥 높이 (FIRST = 0).
도면 폴더는 읽기만 한다.
"""
import json
import re
import sys
import time
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from ted.sheet import Sheet, sheet_path, building_outline          # noqa: E402
from ted.walls import wall_layers, wall_polys, find_doors, door_schedule, floor_of_mark   # noqa: E402
from ted.rooms import find_rooms                                     # noqa: E402
from ted.finishes import finish_schedule, room_finishes, room_ceilings, ceiling_lights, material   # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'viewer' / 'assets' / 'ted_interior.json'
SCRATCH = ROOT / 'scratch' / 'ted'
FT = 0.125

FLOORS = [
    # 이름, 바닥 높이, 층고(위층 바닥까지), 평면, 마감 평면, 천장도
    ('LOWER', -14.67, 14.67, 'A-100', None, None),
    ('FIRST', 0.0, 14.67, 'A-101', 'A-151', 'A-131'),
    ('SECOND', 14.67, 14.66, 'A-102', 'A-152', 'A-132'),
]
TAG_RE = re.compile(r'^([SMG]\d+[A-Z]{0,2})((?:\.[A-Z0-9]+)*)$')
DEFAULT_GLASS_H = 9.0          # 천장 정보가 없을 때 유리 칸막이 높이
STRUCT_DEPTH = 1.5             # 노출 천장: 층고 - 구조 깊이


def partition_tags(sheet, outline):
    """평면의 칸막이 기호 'S6A.D.A' → [{type, xy, h_code}] (A-002: 둘째 마디 = 높이 코드 D 데크 / C 천장 / P 천장+6\" / 숫자 인치)"""
    from shapely.geometry import Point
    out = []
    for t, X, Y, h, r in sheet.words:
        m = TAG_RE.match(t)
        if not m or not re.match(r'^[SMG]\d', t):
            continue
        x, z = sheet.to_local(X, Y)
        if not outline.contains(Point(x, z)):
            continue
        parts = t.split('.')
        code = parts[1] if len(parts) > 1 and re.match(r'^(D|C|P|V|\d+)$', parts[1]) else 'D'   # 표기 없으면 일반주기 B: 데크까지
        out.append({'type': t, 'xy': [round(x, 2), round(z, 2)], 'h_code': code})
    return out


def r2(p):
    return [round(float(p[0]), 2), round(float(p[1]), 2)]


def poly_coords(g):
    return [r2(p) for p in list(g.exterior.coords)[:-1]]


def build_floor(name, y, height, plan, fin, rcp_name, dsched, fsched):
    t0 = time.time()
    s = Sheet(sheet_path(plan)).fit_grid()
    clip = building_outline(name, 3)
    L = wall_layers(s, FT, clip=clip)
    solid, glass, origin = L['solid'], L['glass'], L['origin']
    mask = solid | glass
    doors = find_doors(s, dsched, name, mask, origin, FT)
    rooms = find_rooms(s, mask, origin, FT, doors=doors, outline=building_outline(name, 2))
    F = room_finishes(Sheet(sheet_path(fin)), s, rooms) if fin else {}
    C, lights = {}, []
    if rcp_name:
        rcp = Sheet(sheet_path(rcp_name)).fit_grid()
        C = room_ceilings(rcp, rooms)
        lights = ceiling_lights(rcp, mask, origin, FT, outline=building_outline(name))
    used = set()
    jrooms = []
    for r in rooms:
        f = F.get(r['number'], {})
        c = C.get(r['number'], {})
        ch, src = c.get('h'), 'rcp'
        if ch is None:
            ch, src = round(height - STRUCT_DEPTH, 2), 'default'       # 노출 구조 / 정보 없음
        jr = {'no': r['number'], 'name': r['name'], 'poly': poly_coords(r['poly']), 'area': round(r['area_ft2']),
              'area_label': r['area_label'], 'label': r2(r['label_xy']),
              'floor': f.get('floor'), 'base': f.get('base'), 'wall': f.get('wall', []),
              'ceiling': c.get('code'), 'ch': ch, 'ch_source': src}
        if r.get('open'):
            jr['open'] = True                       # 라벨 없는 넓은 공간 = 대개 아래층으로 트인 곳(바닥 없음)
        jrooms.append(jr)
        used |= {x for x in [jr['floor'], jr['base'], jr['ceiling'], *jr['wall']] if x}
    # 벽: 실벽 = 층고(데크까지, A-002 일반주기 B), 유리 = 접한 방 천장 높이(최댓값)
    from shapely.geometry import Point
    jwalls = []
    for g in wall_polys(solid, origin, FT):
        jwalls.append({'poly': poly_coords(g), 'holes': [[r2(p) for p in list(h.coords)[:-1]] for h in g.interiors],
                       'h': height, 'glass': False})
    for g in wall_polys(glass, origin, FT, min_area=0.3):
        near = [jr['ch'] for jr, r in zip(jrooms, rooms) if r['poly'].distance(g) < 0.6 and jr['ch_source'] == 'rcp']
        jwalls.append({'poly': poly_coords(g), 'holes': [], 'h': min(max(near), height) if near else DEFAULT_GLASS_H, 'glass': True})
    jdoors = []
    for d in doors:
        sc = dsched.get(d.get('tag'), {})
        jdoors.append({'a': r2(d['a']), 'b': r2(d['b']), 'kind': d['kind'], 'tag': d.get('tag'), 'w': d['w'],
                       'h': round(sc['h'], 2) if sc.get('h') else 7.0, 'hinges': [r2(p) for p in d['hinges']],
                       'swing': [r2(p) for p in d['swing']], **({'approx': True} if d.get('approx') else {})})
    marks = [k for k in dsched if floor_of_mark(k) == name]
    floor = {'name': name, 'y': y, 'height': height, 'sheets': [x for x in (plan, fin, rcp_name) if x],
             'walls': jwalls, 'partition_tags': partition_tags(s, building_outline(name, 2)),
             'doors': jdoors, 'rooms': jrooms, 'lights': lights, 'stairs': [],
             'stats': {'rooms': len(jrooms), 'rooms_labeled': sum(1 for r in jrooms if r['no']),
                       'wall_area_ft2': round(float(solid.sum() + glass.sum()) * FT * FT),
                       'glass_area_ft2': round(float(glass.sum()) * FT * FT),
                       'doors': len(jdoors), 'door_marks_in_schedule': len(marks),
                       'doors_tagged': sum(1 for d in jdoors if d['tag'] in dsched), 'lights': len(lights),
                       'rooms_with_finish': sum(1 for r in jrooms if r['floor']),
                       'rooms_with_rcp_height': sum(1 for r in jrooms if r['ch_source'] == 'rcp'),
                       'grid_residual_ft': round(s.grid_residual_ft, 3), 'seconds': round(time.time() - t0, 1)}}
    overlay(s, name, solid, glass, origin, jdoors, rooms, lights)
    return floor, used


def overlay(s, name, solid, glass, origin, doors, rooms, lights):
    """검증용: 도면 + 벽(빨강)·유리(청록)·문(파랑, 열림 초록)·방(색 칠 + 번호/이름)·조명(노랑)"""
    from PIL import Image, ImageDraw
    x0, z0 = origin
    img = s.render(FT, x0, z0, x0 + solid.shape[1] * FT, z0 + solid.shape[0] * FT)
    im = Image.fromarray(img).convert('RGBA')
    ov = Image.new('RGBA', im.size, (0, 0, 0, 0)); d = ImageDraw.Draw(ov)
    P = lambda p: ((p[0] - x0) / FT, (p[1] - z0) / FT)
    rng = np.random.default_rng(7)
    for r in rooms:
        col = tuple(int(v) for v in rng.integers(70, 230, 3))
        d.polygon([P(p) for p in r['poly'].exterior.coords], fill=col + (70,), outline=(0, 0, 0, 200))
    a = np.zeros(solid.shape + (4,), np.uint8)
    a[solid] = (230, 0, 0, 150); a[glass] = (0, 190, 210, 170)
    ov = Image.alpha_composite(ov, Image.fromarray(a))
    d = ImageDraw.Draw(ov)
    for x, z, w, dd in lights:
        d.rectangle([P((x - w / 2, z - dd / 2)), P((x + w / 2, z + dd / 2))], fill=(255, 210, 0, 220))
    for dr in doors:
        d.line([P(dr['a']), P(dr['b'])], fill=(0, 0, 255, 255) if not dr.get('approx') else (200, 0, 200, 255), width=4)
        for h, o in zip(dr['hinges'], dr['swing']):
            d.line([P(h), P(o)], fill=(0, 160, 0, 255), width=2)
    for r in rooms:
        if r['number']:
            x, z = P(r['label_xy'])
            d.text((x - 20, z + 8), f"{r['number']} {r['name'][:18]}", fill=(0, 0, 120, 255))
    out = Image.alpha_composite(im, ov).convert('RGB')
    SCRATCH.mkdir(parents=True, exist_ok=True)
    out.save(SCRATCH / f'overlay_{name}.png')


def main():
    dsched = door_schedule()
    fsched = finish_schedule()
    floors, used = [], set()
    for name, y, h, plan, fin, rcp in FLOORS:
        f, u = build_floor(name, y, h, plan, fin, rcp, dsched, fsched)
        floors.append(f); used |= u
        print(name, json.dumps(f['stats']))
    mats = {c: material(c, fsched) for c in sorted(used)}
    data = {'frame': 'technology_bldg local ft (x east from grid E1, z south from grid EM, y up from FIRST 100\'-0")',
            'source': 'RATIO cTED construction set 2025: A-100/101/102 plans, A-151/152 finish plans, A-131/132 RCP, A-601 door schedule, A-650 finish schedule',
            'generated_by': 'tools/ted/build.py',
            'materials': mats, 'floors': floors}
    OUT.write_text(json.dumps(data, separators=(',', ':')), encoding='utf-8')
    print('wrote', OUT, round(OUT.stat().st_size / 1024), 'KB')


if __name__ == '__main__':
    main()
