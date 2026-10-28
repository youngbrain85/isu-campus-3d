"""cTED 실내 데이터 빌드: 층마다 벽·문·방·마감·천장·조명 (+ 2 단계 내용물, contents.py) → viewer/assets/ted_interior.json + scratch/ted/overlay_<층>.png

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
from ted.finishes import (finish_schedule, room_finishes, room_ceilings, ceiling_lights, material,   # noqa: E402
                          floor_hatch, wall_callouts, fill_finishes)
from collections import Counter                                      # noqa: E402
from ted import stairs as ST                                         # noqa: E402

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


# 천장 태그가 없는 방 (지시선까지 봐도): A-131/A-132 일반주기 B "INSTALL NEW CEILINGS AT +9'-0" A.F.F. UNLESS NOTED OTHERWISE.
# ALL CEILINGS TO BE ACT-02 UNLESS NOTED OTHERWISE." → ACT-02 9'-0". 단 천장도에 천장 격자 없이 구조가 보이는 곳
# (계단실·경사로·스카이브리지·옥외 마당·기계/전기실·기존 지하층)은 노출 구조. 아래 표 = 천장도 확대 렌더로 확인한 결과.
# 천장도에서 같은 해치(GWB 점묘)가 이웃 방 태그에서 이어지는 방: (층, 방) → (코드, 높이, 근거)
CEILING_CONTINUES = {('FIRST', '100'): ('GWB-X1', 10.0, 'A-131: stippled GWB field of the GWB-X1 10 ft tag at (16, 51) continues over the vestibule')}
EXPOSED_ROOMS = re.compile(r'STAIR|RAMP|SKYBRIDGE|ENCLOSURE|OVERLOOK|MECHANICAL|ELEC|IDF|MDF|MACHINE|CLASSROOM')


def _no_finish(height):
    return {'floor': None, 'base': None, 'wall': [], 'finish_src': 'default', 'ceiling': None,
            'ch': round(height - STRUCT_DEPTH, 2), 'ch_source': 'default'}


def finishes_and_ceilings(name, plan_sheet, fin, rcp_name, rooms, height):
    """방 번호 → {floor, base, wall, finish_src, ceiling, ch, ch_source}
    마감: A-151/152 태그 → 바닥 해치·강조벽 표기 → 방 종류 기본값 (finishes.fill_finishes).
    천장: A-131/132 방 안 태그 → 지시선 태그 → 일반주기 B (ACT-02, 9'-0") 또는 노출 구조(층고 - 구조 깊이)."""
    F, hatch, call = {}, {}, {}
    if fin:
        fs = Sheet(sheet_path(fin))
        F = room_finishes(fs, plan_sheet, rooms)
        hatch = floor_hatch(fs, rooms)
        call = wall_callouts(fs, rooms)
    FF = fill_finishes(rooms, F, name, hatch, call)
    C = room_ceilings(Sheet(sheet_path(rcp_name)).fit_grid(), rooms) if rcp_name else {}
    out = {}
    for r in rooms:
        no = r['number']
        f = FF.get(no, {})
        c = C.get(no, {})
        code, ch, src = c.get('code'), c.get('h'), ('rcp' if c.get('src') == 'tag' else 'rcp-leader') if c else None
        if c and code is None and ch is not None:
            code = 'ACT-02'                                       # 높이만 적힌 태그: 일반주기 B "ALL CEILINGS TO BE ACT-02 UNO"
        if ch is None and code and (code.startswith('EXPOSED') or code.startswith('AT-')):
            ch, src = round(height - STRUCT_DEPTH, 2), 'rcp'
        if code is None and (name, no) in CEILING_CONTINUES:
            code, ch, _ = CEILING_CONTINUES[(name, no)]
            src = 'rcp-continued'
        if code is None and no:
            if not rcp_name or EXPOSED_ROOMS.search(r['name'] or ''):
                code, ch, src = 'EXPOSED', round(height - STRUCT_DEPTH, 2), 'default'
            else:
                code, ch, src = 'ACT-02', 9.0, 'note'             # 일반주기 B
        if ch is None:
            ch, src = round(height - STRUCT_DEPTH, 2), src or 'default'      # 노출 구조 / 정보 없음
        out[no] = {'floor': f.get('floor'), 'base': f.get('base'), 'wall': f.get('wall', []),
                   'finish_src': f.get('src', 'default'), 'ceiling': code, 'ch': ch, 'ch_source': src}
    return out


def refresh_finishes(path=OUT):
    """기존 JSON 의 방 다각형으로 마감·천장만 다시 (빠른 반복용, 30 초). 전체 빌드와 같은 함수를 쓴다."""
    from shapely.geometry import Polygon
    data = json.loads(path.read_text(encoding='utf-8'))
    fsched = finish_schedule()
    used = set()
    for (name, y, h, plan, fin, rcp), fl in zip(FLOORS, data['floors']):
        s = Sheet(sheet_path(plan)).fit_grid()
        rooms = [{'number': r['no'], 'name': r['name'], 'poly': Polygon(r['poly']).buffer(0)} for r in fl['rooms']]
        FC = finishes_and_ceilings(name, s, fin, rcp, rooms, h)
        for jr in fl['rooms']:
            if jr['no']:
                jr.update(FC[jr['no']])
            used |= {x for x in [jr['floor'], jr['base'], jr['ceiling'], *jr['wall']] if x}
        _finish_stats(fl)
    data['materials'] = {c: material(c, fsched) for c in sorted(used)}
    path.write_text(json.dumps(data, separators=(',', ':')), encoding='utf-8')


def _finish_stats(fl):
    R = [r for r in fl['rooms'] if r['no']]
    fl['stats']['rooms_with_finish'] = sum(1 for r in fl['rooms'] if r['floor'])
    fl['stats']['rooms_with_rcp_height'] = sum(1 for r in fl['rooms'] if str(r['ch_source']).startswith('rcp'))
    fl['stats']['finish_src'] = dict(Counter(r.get('finish_src') for r in R))
    fl['stats']['ceiling_src'] = dict(Counter(r.get('ch_source') for r in R))


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
    FC = finishes_and_ceilings(name, s, fin, rcp_name, rooms, height)
    lights = []
    if rcp_name:
        rcp = Sheet(sheet_path(rcp_name)).fit_grid()
        lights = ceiling_lights(rcp, mask, origin, FT, outline=building_outline(name))
    used = set()
    jrooms = []
    for r in rooms:
        jr = {'no': r['number'], 'name': r['name'], 'poly': poly_coords(r['poly']), 'area': round(r['area_ft2']),
              'area_label': r['area_label'], 'label': r2(r['label_xy']), **FC.get(r['number'], _no_finish(height))}
        if r.get('open'):
            jr['open'] = True                       # 라벨 없는 넓은 공간 = 대개 아래층으로 트인 곳(바닥 없음)
        jrooms.append(jr)
        used |= {x for x in [jr['floor'], jr['base'], jr['ceiling'], *jr['wall']] if x}
    # 벽: 실벽 = 층고(데크까지, A-002 일반주기 B), 유리 = 접한 방 천장 높이(최댓값)
    from shapely.geometry import Point
    jwalls = []
    # 외벽은 외부 모듈(technology_bldg.js)이 그린다 → 실내 벽은 외곽선 0.7 ft 안쪽까지만 (안쪽 마감면만 남김).
    # 그대로 두면 실내 벽(흰색, 층고 전체)이 외부 벽돌·유리면과 겹쳐 밖으로 비쳐 보였다.
    inner = building_outline(name, -0.7)
    shell_band = building_outline(name).boundary.buffer(1.0)
    def _parts(g):
        g = g.intersection(inner)
        return [x for x in getattr(g, 'geoms', [g]) if x.geom_type == 'Polygon' and x.area > 0.2]
    for g0 in wall_polys(solid, origin, FT):
      for g in _parts(g0):
        jwalls.append({'poly': poly_coords(g), 'holes': [[r2(p) for p in list(h.coords)[:-1]] for h in g.interiors],
                       'h': height, 'glass': False})
    for g in wall_polys(glass, origin, FT, min_area=0.3):
        if g.intersection(shell_band).area > 0.5 * g.area:
            continue                     # 외벽 커튼월·창은 외부 모듈 몫
        near = [jr['ch'] for jr, r in zip(jrooms, rooms) if r['poly'].distance(g) < 0.6 and str(jr['ch_source']).startswith('rcp')]
        jwalls.append({'poly': poly_coords(g), 'holes': [], 'h': min(max(near), height) if near else DEFAULT_GLASS_H, 'glass': True})
    # 계단 난간·측판 선이 벽으로 잡힌 것 제거 (절반 넘게 계단 발자국 안)
    zone = ST.stair_zone(y, height)
    if ST.cuts_for(name) is not None:          # 바닥 구멍 둘레 가드도 (2 층 N 계단·로비 계단 3)
        zone = ST.cuts_for(name).buffer(0.8, join_style=2).union(zone) if zone is not None else ST.cuts_for(name).buffer(0.8, join_style=2)
    if zone is not None:
        from shapely.geometry import Polygon as _P
        def _in(w):
            g = _P(w['poly']).buffer(0)
            return g.area > 0 and g.intersection(zone).area > 0.5 * g.area
        n0 = len(jwalls)
        jwalls = [w for w in jwalls if not _in(w)]
        print(name, 'walls dropped inside stair footprints:', n0 - len(jwalls))
    # 엘리베이터 승강로 문: 평면 벽 추출이 문틀까지 막아 버리므로 개구부를 벽에서 빼고 문(인방)으로 추가
    from shapely.geometry import box as _box, Polygon as _Pe
    elev_doors = []
    for e in ST.elevators_for(name):
        (ax_, az_), (bx_, bz_) = e['door']
        if abs(ax_ - bx_) < abs(az_ - bz_):
            op = _box(ax_ - 0.8, min(az_, bz_), ax_ + 0.8, max(az_, bz_))
        else:
            op = _box(min(ax_, bx_), az_ - 0.8, max(ax_, bx_), az_ + 0.8)
        nw = []
        for w in jwalls:
            g = _Pe(w['poly'], w.get('holes') or []).buffer(0)
            if not g.intersects(op):
                nw.append(w); continue
            for part in ST._polys(g.difference(op)):
                nw.append({**w, 'poly': poly_coords(part), 'holes': [[r2(q) for q in list(h.coords)[:-1]] for h in part.interiors]})
        jwalls = nw
        elev_doors.append({'a': r2(e['door'][0]), 'b': r2(e['door'][1]), 'kind': 'elevator', 'tag': None,
                           'w': round(((ax_ - bx_) ** 2 + (az_ - bz_) ** 2) ** 0.5, 2), 'h': 7.4, 'hinges': [], 'swing': []})
    jdoors = []
    for d in doors:
        sc = dsched.get(d.get('tag'), {})
        jdoors.append({'a': r2(d['a']), 'b': r2(d['b']), 'kind': d['kind'], 'tag': d.get('tag'), 'w': d['w'],
                       'h': round(sc['h'], 2) if sc.get('h') else 7.0, 'hinges': [r2(p) for p in d['hinges']],
                       'swing': [r2(p) for p in d['swing']], **({'approx': True} if d.get('approx') else {})})
    jdoors += elev_doors
    marks = [k for k in dsched if floor_of_mark(k) == name]
    floor = {'name': name, 'y': y, 'height': height, 'sheets': [x for x in (plan, fin, rcp_name) if x],
             'walls': jwalls, 'partition_tags': partition_tags(s, building_outline(name, 2)),
             'doors': jdoors, 'rooms': jrooms, 'lights': lights, 'stairs': ST.stairs_for(name),
             'elevators': ST.elevators_for(name),
             'stats': {'rooms': len(jrooms), 'rooms_labeled': sum(1 for r in jrooms if r['no']),
                       'wall_area_ft2': round(float(solid.sum() + glass.sum()) * FT * FT),
                       'glass_area_ft2': round(float(glass.sum()) * FT * FT),
                       'doors': len(jdoors), 'door_marks_in_schedule': len(marks),
                       'doors_tagged': sum(1 for d in jdoors if d['tag'] in dsched), 'lights': len(lights),
                       'grid_residual_ft': round(s.grid_residual_ft, 3), 'seconds': round(time.time() - t0, 1)}}
    _finish_stats(floor)
    apply_levels_and_cuts(floor, rooms)
    overlay(s, name, solid, glass, origin, jdoors, rooms, lights)
    return floor, used


def apply_levels_and_cuts(floor, rooms):
    """계단 구멍(바닥 마감·슬래브 제외)과 낮은 바닥 영역(로비 95', 97', 북측 증축 98')을 반영.
    rooms[].parts = [{poly, holes, y, base?}] (base = 단차 옆면 블록 바닥), rooms[].cparts = 위층 계단 구멍을 뺀 천장,
    walls/doors[].y0 = 낮은 영역에 닿으면 그 높이부터. levels = [{name, y, polys}]."""
    from shapely.geometry import Polygon
    from shapely.ops import unary_union
    name, y = floor['name'], floor['y']
    cut = ST.cuts_for(name)
    order = [f[0] for f in FLOORS]
    up = order[order.index(name) + 1] if order.index(name) + 1 < len(order) else None
    ucut = ST.cuts_for(up) if up else None
    areas = ST.level_areas(name, [{'no': r['number'], 'poly': r['poly']} for r in rooms])
    floor['levels'] = [{'name': n, 'y': yy, 'polys': [poly_coords(p) for p in ST._polys(A)]} for n, yy, A in areas]
    pc = lambda g: {'poly': poly_coords(g), 'holes': [[r2(p) for p in list(h.coords)[:-1]] for h in g.interiors]}
    for jr, r in zip(floor['rooms'], rooms):
        g = r['poly']
        touched = (cut is not None and g.intersects(cut)) or any(g.intersects(A) for _, _, A in areas)
        if touched and not jr.get('open'):
            jr['parts'] = [{**pc(p), 'y': yy, **({'base': b} if b is not None else {})}
                           for p, yy, b in ST.room_parts(g, y, cut, areas)]
        if ucut is not None and g.intersects(ucut) and not jr.get('open'):
            jr['cparts'] = [pc(p) for p in ST._polys(g.difference(ucut))]
    if areas:
        A = unary_union([a for _, _, a in areas])
        for w in floor['walls']:
            try:
                wg = Polygon(w['poly'])
            except Exception:
                continue
            hit = [yy for _, yy, a in areas if wg.distance(a) < 0.8]
            if hit:
                w['y0'] = min(hit)
        from shapely.geometry import Point
        for d in floor['doors']:
            m = Point((d['a'][0] + d['b'][0]) / 2, (d['a'][1] + d['b'][1]) / 2)
            hit = [yy for _, yy, a in areas if a.distance(m) < 1.0]
            if hit:
                d['y0'] = min(hit)


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
            'source': 'RATIO cTED construction set 2025: A-100/101/102 plans, A-151/152 finish plans, A-131/132 RCP, A-601 door schedule, A-650 finish schedule, A-421/422/424/425 stairs, A-301 sections',
            'unmodelled': [{'sheet': a, 'xz': [b, c], 'why': d} for a, b, c, d in ST.UNMODELLED],
            'generated_by': 'tools/ted/build.py',
            'materials': mats, 'floors': floors}
    from ted.contents import add_contents                # 2 단계: 장비·캐비닛·위생기구·가구
    add_contents(data)
    OUT.write_text(json.dumps(data, separators=(',', ':')), encoding='utf-8')
    print('wrote', OUT, round(OUT.stat().st_size / 1024), 'KB')


if __name__ == '__main__':
    if '--finishes' in sys.argv:
        refresh_finishes()
    else:
        main()
