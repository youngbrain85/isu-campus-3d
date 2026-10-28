"""2 단계 실내 내용물: 장비·캐비닛·위생기구·가구를 ted_interior.json 의 층마다 붙인다.

  floors[].equipment  — A-701/702 태그 장비 (A-704 일람표 설명) + 태그 없는 연두 덩어리
  floors[].casework   — 평면의 카운터/아일랜드(검은 실선 사각형) + A-501 벽걸이(마커보드·모니터) + 카운터 싱크
  floors[].fixtures   — 변기·소변기·세면기 (A-100/101/102)
  floors[].furniture  — A-701/702 하늘색 가구 + 가구가 안 그려진 방의 추정 배치(estimated: true)
항목 = {type, x, z, rot, w, d, h, y0?, label?, tag?, estimated?, room, src}. y0 = 층 바닥에서 밑면까지(낮은 로비 영역 보정 포함).

단독 실행:  python -I tools/ted/contents.py   (기존 JSON 에 덧씌움, 1~2 분) — build.py 도 끝에 add_contents() 를 부른다.
도면 폴더는 읽기만 한다.
"""
import json
import math
import re
import sys
import time
from collections import Counter
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from shapely.geometry import Point, Polygon            # noqa: E402
from shapely.ops import unary_union                   # noqa: E402
from shapely.strtree import STRtree                   # noqa: E402

from ted import equipment as EQ, casework as CW, fixtures as FX, furnish as FU, stairs as ST   # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'viewer' / 'assets' / 'ted_interior.json'
SHEETS = {'LOWER': (None, 'A-100'), 'FIRST': ('A-701', 'A-101'), 'SECOND': ('A-702', 'A-102')}
WALL_TOL = 0.25                      # 벽 파고듦 허용 (ft) — 시험 기준 0.3 보다 여유 (JSON 반올림)
STORAGE = re.compile(r'STORAGE|LIBRARY')
SEAT_STOOL = re.compile(r'LAB|WORKSHOP|MAKER|KITCHEN')


def _poly(p):
    g = Polygon(p).buffer(0)
    return g


def _wall_union(floor):
    ws = []
    for w in floor['walls']:
        try:
            g = Polygon(w['poly'], w.get('holes') or []).buffer(0)
        except Exception:
            continue
        if g.area > 0:
            ws.append(g)
    return ws


def penetration(item, W):
    """항목 발자국이 벽에 파고든 깊이가 WALL_TOL 을 넘는가 (발자국을 WALL_TOL 만큼 줄여도 벽과 겹치면 넘는 것)"""
    g = EQ.rect_poly(item)
    inner = g.buffer(-WALL_TOL, join_style=2)
    return (not inner.is_empty) and inner.intersects(W)


def fix_walls(item, W, room_poly, can_shrink=True):
    """벽에서 밀어내기(최대 1.5 ft) → 그래도 겹치면 줄이기. 성공하면 True"""
    for _ in range(12):
        if not penetration(item, W):
            return True
        g = EQ.rect_poly(item)
        inter = g.intersection(W)
        if inter.is_empty:
            return True
        c, ic = g.centroid, inter.centroid
        vx, vz = c.x - ic.x, c.y - ic.y
        n = math.hypot(vx, vz)
        if n < 1e-6:
            # 방 중심 쪽으로
            rc = room_poly.representative_point()
            vx, vz = rc.x - c.x, rc.y - c.y
            n = math.hypot(vx, vz) or 1
        item['x'] += vx / n * 0.15
        item['z'] += vz / n * 0.15
    for _ in range(8):
        if not penetration(item, W):
            return True
        if not can_shrink:
            break
        item['w'] *= 0.85
        item['d'] *= 0.85
    return not penetration(item, W)


def snap_into_room(item, rooms, maxd=4.0):
    """중심이 방 밖이면 가장 가까운 방 안쪽 점으로 옮긴다 → 방 번호 또는 None"""
    p = Point(item['x'], item['z'])
    for r in rooms:
        if r['poly'].contains(p):
            return r
    best, bd = None, maxd
    for r in rooms:
        d = r['poly'].distance(p)
        if d < bd:
            best, bd = r, d
    if best is None:
        return None
    inner = best['poly'].buffer(-min(0.8, max(item['w'], item['d']) / 2), join_style=2)
    if inner.is_empty:
        inner = best['poly'].buffer(-0.2)
    if inner.is_empty:
        return None
    from shapely.ops import nearest_points
    q = nearest_points(inner, p)[0]
    item['x'], item['z'] = q.x, q.y
    return best


def _level_y0(floor):
    """낮은 바닥 영역(로비 95'/97' 등) → [(shapely, 층 기준 높이)]"""
    out = []
    for L in floor.get('levels') or []:
        g = unary_union([_poly(p) for p in L['polys']])
        out.append((g, L['y'] - floor['y']))
    return out


def _clean(it):
    o = {'type': it['type'], 'x': round(it['x'], 2), 'z': round(it['z'], 2), 'rot': round(it.get('rot', 0.0), 3),
         'w': round(it['w'], 2), 'd': round(it['d'], 2), 'h': round(it['h'], 2)}
    if it.get('y0'):
        o['y0'] = round(it['y0'], 2)
    for k in ('label', 'tag', 'room', 'src'):
        if it.get(k) is not None:
            o[k] = it[k]
    if it.get('estimated'):
        o['estimated'] = True
    return o


def refine_furniture(fu, names):
    for f in fu:
        n = names.get(f.get('room'), '')
        if STORAGE.search(n) and f['type'] in ('table', 'desk') and f['d'] <= 2.6:
            f['type'], f['h'] = 'shelving', 7.0
        if f['type'] == 'stool' and not SEAT_STOOL.search(n):
            f['type'], f['h'] = 'chair', 2.8
        if f['type'] == 'chair' and SEAT_STOOL.search(n) and max(f['w'], f['d']) <= 1.7:
            f['type'], f['h'] = 'stool', 2.1
    return fu


def floor_contents(floor, schedule, log):
    name = floor['name']
    eq_sheet, plan = SHEETS[name]
    rooms = [{'no': r['no'], 'name': r['name'], 'poly': _poly(r['poly'])} for r in floor['rooms'] if r['no']]
    names = {r['no']: r['name'] for r in rooms}
    walls = _wall_union(floor)
    W = unary_union(walls)
    stair = ST.stair_zone(floor['y'], floor['height'])
    cut = ST.cuts_for(name)
    stairz = unary_union([g for g in (stair, cut) if g is not None]) if (stair is not None or cut is not None) else None
    t0 = time.time()
    equipment, furniture, casework = [], [], []
    if eq_sheet:
        equipment, furniture, dbg = EQ.extract(eq_sheet, rooms, schedule)
        log[name + '_tags'] = dbg['tags']
        casework = CW.counters(eq_sheet, rooms, walls)
        casework = [c for c in casework if stairz is None or not EQ.rect_poly(c).intersects(stairz.buffer(-0.3))]
        casework += CW.wall_items({r['no']: r for r in rooms})
        casework += CW.upper_cabinets(plan, rooms, walls, casework)      # 평면 점선 상부장 (A-501 C8 높이)
    fixtures = FX.find_fixtures(plan, rooms, walls) + FX.measured(name, plan)
    if casework:
        casework += FX.counter_sinks(plan, casework, end_ok={r['no'] for r in rooms if re.search(r'LAB', r['name'] or '')})
    furniture = refine_furniture(furniture, names)
    # 추정 가구: 도면 가구(탁자·책상·의자류)가 하나도 없는 방
    drawn = Counter(f['room'] for f in furniture if f['type'] not in ('monitor',))
    doors = []
    from shapely.geometry import LineString
    for d in floor['doors']:
        doors.append(LineString([d['a'], d['b']]))
    obstacles = [EQ.rect_poly(x) for x in equipment + casework + fixtures]
    est_rooms = []
    for r in rooms:
        if drawn.get(r['no'], 0) >= 2 or FU.room_kind(r['name']) is None or 'ENCLOSURE' in (r['name'] or ''):
            continue
        if r['poly'].area < 40:
            continue
        rd = [d for d in doors if d.distance(r['poly']) < 1.0]
        obs = [o for o in obstacles if o.intersects(r['poly'])]
        est = FU.layout_room(r, rd, obs)
        if est:
            furniture += est
            est_rooms.append(r['no'])
    # 정리: 방 안으로, 벽에서 떼기
    levels = _level_y0(floor)
    by_no = {r['no']: r for r in rooms}
    out = {}
    dropped = Counter()
    for key, items, keep_all in (('equipment', equipment, True), ('casework', casework, False),
                                 ('fixtures', fixtures, False), ('furniture', furniture, False)):
        res = []
        for it in items:
            r = snap_into_room(it, rooms, maxd=4.0 if keep_all else 1.0)
            if r is None:
                dropped[key] += 1
                continue
            it['room'] = r['no']
            wall_mounted = it['type'] in ('marker_board', 'wall_monitor', 'upper_cabinet', 'wall_shelf')
            ok = True
            for _ in range(3):                 # 벽에서 떼기 ↔ 방 안으로 되돌리기를 번갈아
                if not wall_mounted:
                    fix_walls(it, W, r['poly'], can_shrink=True)
                if not r['poly'].contains(Point(it['x'], it['z'])) and snap_into_room(it, [r], maxd=2.5) is None:
                    ok = False
                    break
                if wall_mounted or not penetration(it, W):
                    break
            else:
                ok = False
            if not ok and key == 'equipment' and r['poly'].contains(Point(it['x'], it['z'])):
                while penetration(it, W) and it['w'] > 0.6:      # 태그 장비는 버리지 않고 줄인다
                    it['w'] *= 0.85; it['d'] *= 0.85
                ok = not penetration(it, W)
            if not ok:
                dropped[key + '_wall'] += 1
                continue
            p = Point(it['x'], it['z'])
            for g, yy in levels:
                if g.contains(p):
                    it['y0'] = (it.get('y0') or 0) + yy
                    break
            res.append(_clean(it))
        out[key] = res
    # 카운터 사각형 → 모듈 하부장(문·서랍·토킥) + 내민 상판 (벽 정리 뒤에: 모듈이 따로 밀리지 않게)
    out['casework'] = [_clean(c) for c in CW.detail_counters(out['casework'], walls)]
    for jr in floor['rooms']:
        if jr['no'] in est_rooms:
            jr['furniture_estimated'] = True
        elif 'furniture_estimated' in jr:
            del jr['furniture_estimated']
    floor.update(out)
    floor['stats']['contents'] = {k: len(v) for k, v in out.items()}
    floor['stats']['contents'].update({'equipment_tagged': sum(1 for e in out['equipment'] if e.get('tag')),
                                       'equipment_tags_on_sheet': log.get(name + '_tags', 0),
                                       'furniture_estimated': sum(1 for f in out['furniture'] if f.get('estimated')),
                                       'estimated_rooms': est_rooms, 'dropped': dict(dropped),
                                       'seconds': round(time.time() - t0, 1)})
    return floor


def add_contents(data):
    schedule = EQ.equipment_schedule()
    log = {}
    for f in data['floors']:
        floor_contents(f, schedule, log)
        print(f['name'], 'contents', json.dumps(f['stats']['contents']))
    data['source'] = data.get('source', '').split(' | phase 2:')[0] + \
        ' | phase 2: A-701/702 equipment plans (equipment green, FF&E blue), A-704 equipment schedule, A-501 interior elevations'
    return data


def main():
    data = json.loads(OUT.read_text(encoding='utf-8'))
    add_contents(data)
    OUT.write_text(json.dumps(data, separators=(',', ':')), encoding='utf-8')
    print('wrote', OUT, round(OUT.stat().st_size / 1024), 'KB')


if __name__ == '__main__':
    main()
