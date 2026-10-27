"""방 라벨(번호·이름·면적 글자)과 방 다각형.

라벨: 평면의 방 번호 = 9.6 pt 가로 글자 '\\d{3}[A-Z]?' (네모 칸 안), 그 바로 위에 가운데 맞춘 이름 줄들,
      아래에 '182 SF' 같은 면적 글자(있으면).
다각형: 벽 마스크의 빈 공간에서 문 개구부를 문 현(chord)으로 막은 뒤 연결 성분을 나누고, 라벨 점이 든 성분 = 방.
      한 성분에 라벨이 둘 이상이면(열린 평면) 라벨에서 측지 거리로 가까운 쪽에 나눠 준다(watershed).
"""
import re
import numpy as np
from scipy import ndimage
from PIL import Image, ImageDraw

NUM_RE = re.compile(r'^\d{3}[A-Z]?$')
NAME_RE = re.compile(r"^[A-Z][A-Z.&/'\-]*$|^/$|^&$")
NOT_NAME = re.compile(r'^([A-Z]{1,2}\d|[A-Z]-\d|\d)|^(UP|DN|ALIGN|TYP\.?|SIM\.?|EQ|EXIST\.?)$')
LABEL_H = 9.6


def _lines(words, gap=0.35):
    """같은 높이(z)의 글자끼리 줄로 묶기 → [(z, [word...])] (z 오름차순)"""
    out = []
    for w in sorted(words, key=lambda w: w['z']):
        if out and abs(out[-1][0] - w['z']) < gap:
            out[-1][1].append(w)
        else:
            out.append([w['z'], [w]])
    return out


def room_labels(sheet, outline=None):
    """[{number, name, x, z, area_label}] — outline(shapely) 이 있으면 그 안의 라벨만"""
    W = []
    for t, X, Y, h, r in sheet.words:
        if abs(h - LABEL_H) > 0.4 or r.height > r.width * 1.3 and len(t) > 1:
            continue
        x, z = sheet.to_local(X, Y)
        (ax, az), (bx, bz) = sheet.to_local(r.x0, r.y0), sheet.to_local(r.x1, r.y1)
        W.append({'t': t, 'x': x, 'z': z, 'x0': min(ax, bx), 'x1': max(ax, bx)})
    if outline is not None:
        from shapely.geometry import Point
        W = [w for w in W if outline.contains(Point(w['x'], w['z']))]
    names = [w for w in W if NAME_RE.match(w['t']) and not NOT_NAME.match(w['t'])]
    out = []
    for n in W:
        if not NUM_RE.match(n['t']):
            continue
        # 이름: 번호 위로 1.6 ft 이내 줄부터 연속된 줄들, 각 줄에서 번호 중심을 덮는 글자 덩어리
        cand = [w for w in names if abs(w['x'] - n['x']) < 14 and n['z'] - 7 < w['z'] < n['z'] - 0.4]
        lines = _lines(cand)[::-1]
        z_prev, parts = n['z'], []
        for z, ws in lines:
            if z_prev - z > 1.7:
                break
            ws = sorted(ws, key=lambda w: w['x'])
            groups, g = [], [ws[0]]
            for w in ws[1:]:
                if w['x0'] - g[-1]['x1'] < 1.0:
                    g.append(w)
                else:
                    groups.append(g); g = [w]
            groups.append(g)
            hit = [g for g in groups if g[0]['x0'] - 1.0 <= n['x'] <= g[-1]['x1'] + 1.0
                   and abs((g[0]['x0'] + g[-1]['x1']) / 2 - n['x']) < 2.5]
            if not hit:
                continue                    # 옆 방 이름 줄 — 건너뛰고 더 위를 본다
            parts.insert(0, ' '.join(w['t'] for w in hit[0]))
            z_prev = z
        # 면적: 번호 바로 아래 '123 SF'
        area = None
        below = [w for w in sheet_words_small(sheet) if abs(w['x'] - n['x']) < 3 and 0.4 < w['z'] - n['z'] < 2.0]
        for i, w in enumerate(below):
            if w['t'] == 'SF':
                num = [v for v in below if re.match(r'^[\d,]+$', v['t']) and abs(v['z'] - w['z']) < 0.3 and v['x'] < w['x']]
                if num:
                    area = int(max(num, key=lambda v: v['x'])['t'].replace(',', ''))
        out.append({'number': n['t'], 'name': ' '.join(parts).replace(' / ', '/'), 'x': n['x'], 'z': n['z'], 'area_label': area})
    # 같은 자리 중복만 제거 (도면에 같은 번호가 두 방에 붙은 경우는 둘 다 둔다, 예: A-102 의 223)
    uniq = []
    for r in out:
        if not any(u['number'] == r['number'] and abs(u['x'] - r['x']) + abs(u['z'] - r['z']) < 3 for u in uniq):
            uniq.append(r)
    return uniq


def sheet_words_small(sheet):
    """면적 글자(6.6 pt) 등 작은 글자 → [{t, x, z}] (캐시)"""
    if getattr(sheet, '_small', None) is None:
        sheet._small = []
        for t, X, Y, h, r in sheet.words:
            if h < 9:
                x, z = sheet.to_local(X, Y)
                sheet._small.append({'t': t, 'x': x, 'z': z})
    return sheet._small


def close_doors(mask, origin, ft_per_px, doors, width_px=3, ext=0.9, gap=1.5):
    """문 개구부를 현(a→b, 양 끝 ext ft 연장) 선으로 막고, gap ft 보다 좁은 틈(문틀·멀리언 사이)도
    원판 닫힘 연산으로 막은 마스크 사본"""
    im = Image.fromarray((mask * 255).astype(np.uint8))
    dr = ImageDraw.Draw(im)
    P = lambda p: ((p[0] - origin[0]) / ft_per_px, (p[1] - origin[1]) / ft_per_px)
    for d in doors:
        a, b = np.array(d['a'], float), np.array(d['b'], float)
        L = np.linalg.norm(b - a)
        if L < 1e-6:
            continue
        u = (b - a) / L
        dr.line([P(a - u * ext), P(b + u * ext)], fill=255, width=width_px)
    m = np.asarray(im) > 0
    r = int(round(gap / 2 / ft_per_px))
    yy, xx = np.mgrid[-r:r + 1, -r:r + 1]
    disk = xx * xx + yy * yy <= r * r
    pad = r + 1
    mp = np.pad(m, pad)
    return ndimage.binary_closing(mp, structure=disk)[pad:-pad, pad:-pad] | m


def find_rooms(sheet, wall_mask, origin, ft_per_px=0.125, doors=(), outline=None, min_unlabeled=20.0,
               simplify=0.25, open_min=250.0):
    """방 목록 [{number, name, label_xy, poly (shapely), area_ft2, area_label}].
    라벨 없는 닫힌 공간(≥ min_unlabeled ft², 건물 안)은 number='' 로 덧붙인다(샤프트·계단실 등)."""
    from rasterio import features
    from affine import Affine
    from shapely.geometry import shape, Point
    from skimage.segmentation import watershed
    labels = room_labels(sheet, outline)
    closed = close_doors(wall_mask, origin, ft_per_px, doors)
    H, W = closed.shape
    if outline is not None:                     # 건물 밖은 막는다 (외벽 틈으로 바깥과 이어지지 않게)
        im = Image.new('L', (W, H), 0); dr = ImageDraw.Draw(im)
        for g in getattr(outline, 'geoms', [outline]):
            dr.polygon([((x - origin[0]) / ft_per_px, (z - origin[1]) / ft_per_px) for x, z in g.exterior.coords], fill=255)
        inside = np.asarray(im) > 0
    else:
        inside = np.ones_like(closed)
    free = ~closed & inside
    # 바깥 공간: 벽을 1 ft 부풀려(창·외벽 틈 ≤ 2 ft 를 막고) 이미지 가장자리와 이어진 빈 공간 → 다시 1 ft 키워 원래 경계까지
    k = max(1, int(round(1.0 / ft_per_px)))
    thick = ndimage.binary_dilation(closed, iterations=k)
    olab, _ = ndimage.label(~thick)
    edge = np.unique(np.r_[olab[0], olab[-1], olab[:, 0], olab[:, -1]])
    outside = np.isin(olab, edge[edge > 0]) | ~inside
    outside = ndimage.binary_dilation(outside, iterations=k + 1) & free | ~inside
    free &= ~outside
    comp, n = ndimage.label(free)
    # 라벨 → 화소 (벽 위에 있으면 1 ft 안의 가장 가까운 빈 화소)
    markers = np.zeros((H, W), np.int32)
    seeds = []
    for i, L in enumerate(labels, 1):
        c = int((L['x'] - origin[0]) / ft_per_px); r = int((L['z'] - origin[1]) / ft_per_px)
        if not (0 <= r < H and 0 <= c < W):
            continue
        if not free[r, c]:
            rr, cc = np.nonzero(free[max(r - 8, 0):r + 9, max(c - 8, 0):c + 9])
            if not len(rr):
                continue
            k = np.argmin((rr - min(r, 8)) ** 2 + (cc - min(c, 8)) ** 2)
            r, c = max(r - 8, 0) + rr[k], max(c - 8, 0) + cc[k]
        markers[r, c] = i; seeds.append((i, comp[r, c]))
    # 성분마다: 라벨 0개 → 이름 없는 공간, 1개 → 그대로, 2개 이상 → watershed 분할
    region = np.zeros((H, W), np.int32)
    by_comp = {}
    for i, cc in seeds:
        by_comp.setdefault(cc, []).append(i)
    # 라벨이 방 밖(복도·옆 방)에 적힌 작은 방: 그 번호의 문 태그('104A', '104A-1') 반대편에 라벨 없는 닫힌 공간이 있으면 그 공간이 방
    from collections import Counter
    dup = Counter(L['number'] for L in labels)
    num_id = {L['number']: i for i, L in enumerate(labels, 1) if dup[L['number']] == 1}
    comp_of = dict((i, cc) for i, cc in seeds)
    for d in doors:
        base = (d.get('tag') or '').split('-')[0]
        i = num_id.get(base)
        if i is None or i not in comp_of or len(by_comp.get(comp_of[i], [])) < 2:
            continue
        a, b = np.array(d['a'], float), np.array(d['b'], float)
        u = (b - a) / max(np.linalg.norm(b - a), 1e-6); nrm = np.array([-u[1], u[0]]); mid = (a + b) / 2
        for sgn in (1, -1):
            q = mid + sgn * nrm * 1.2
            r, c = int((q[1] - origin[1]) / ft_per_px), int((q[0] - origin[0]) / ft_per_px)
            if not (0 <= r < H and 0 <= c < W):
                continue
            cc = comp[r, c]
            if cc and cc not in by_comp and np.sum(comp == cc) * ft_per_px ** 2 >= 8:
                by_comp[comp_of[i]].remove(i)
                by_comp[cc] = [i]; comp_of[i] = cc
                markers[markers == i] = 0; markers[r, c] = i
                break
    by_comp = {k: v for k, v in by_comp.items() if v}
    objs = ndimage.find_objects(comp)
    for cc, ids in by_comp.items():
        sl = objs[cc - 1]
        sub = comp[sl] == cc
        if len(ids) == 1:
            region[sl][sub] = ids[0]
        else:
            ws = watershed(np.zeros(sub.shape), markers[sl] * sub, mask=sub)
            region[sl][sub] = ws[sub]
    nxt = len(labels) + 1
    extra = []
    border = set(np.unique(np.r_[comp[0], comp[-1], comp[:, 0], comp[:, -1]]))
    for cc in range(1, n + 1):
        if cc in by_comp or cc in border:
            continue
        sl = objs[cc - 1]; sub = comp[sl] == cc
        if sub.sum() * ft_per_px ** 2 >= min_unlabeled:
            region[sl][sub] = nxt; extra.append(nxt); nxt += 1
    tr = Affine(ft_per_px, 0, origin[0], 0, ft_per_px, origin[1])
    polys = {}
    for geom, val in features.shapes(region, mask=region > 0, transform=tr):
        g = shape(geom)
        if val not in polys or g.area > polys[int(val)].area:
            polys[int(val)] = g
    rooms = []
    for i, L in enumerate(labels, 1):
        if i not in polys:
            continue
        g = polys[i].simplify(simplify, preserve_topology=True)
        rooms.append({'number': L['number'], 'name': L['name'], 'label_xy': (L['x'], L['z']), 'poly': g,
                      'area_ft2': round(g.area, 1), 'area_label': L['area_label']})
    for k in extra:
        if k not in polys:
            continue
        g = polys[k].simplify(simplify, preserve_topology=True)
        p = g.representative_point()
        # 라벨 없는 넓은 공간 = 대개 아래층으로 트인 곳(OPEN TO BELOW: 2층 로비 위·고베이·CM 랩 위)
        rooms.append({'number': '', 'name': '', 'label_xy': (p.x, p.y), 'poly': g, 'area_ft2': round(g.area, 1), 'area_label': None,
                      'open': bool(g.area > open_min)})
    return rooms
