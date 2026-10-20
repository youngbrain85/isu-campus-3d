// Reeve Hall — "North Residence Hall" (CSO Architects, 입찰도서 2012-08-31, 2014 개관). 동·서 동일(거울상) 2개 동.
// 치수 근거 (도면 세트 "Reeve Hall Record Drawings / 5 arch_full.pdf", 1/8" = 1'-0"):
//   A100 (p2) 배치도: 동/서 건물은 North 6th St 축에 대해 거울상. E2·E3 가 6th St 쪽(서) 척추, E1·E4 날개가 동쪽으로 뻗음.
//   A111 (p10) 1층 전체 평면: 전체 길이 227'-10½" (21'-1¼"+17'-4"+71'-4"+8'-4"+71'-4"+17'-4"+21'-1¼"), 전체 깊이 136'-10¾"
//     (2'+14'-9¼"+10'-8"+11'-8"+16'-10¾" = 56' 척추부 + 날개 71'-4" + 계단 돌출 9'-6¾"), 날개 폭 48' (13'-4"+21'-4"+13'-4"),
//     현관 베이 4'+8'-8"+4' = 16'-8", 브리즈웨이 8'-4", 계단/엘리베이터 로비 블록 그리드 2~4 (17'-4") × C~D 탑 10'-8",
//     척추 유닛 깊이 47' (z 2..49, 다목적실 뒷벽), 로비 블록 z 16.77..56.
//   A201/A202 (p37/38) 입면: FIRST 0', SECOND 12'-0", THIRD 22'-0", FOURTH 32'-0", TRUSS BRG 41'-6", ATTIC 42'-9",
//     ELEV. TRUSS BRG 46'-6"; 지붕 경사 5/12 아스팔트 슁글 모임지붕, 면벽돌 + 2층 바닥선 석회암 띠 + 4층 rowlock, 1층 soldier course,
//     창 A(casement) ≈ 3'-6"×6', 1층 B 는 상부 transom 포함. 현관 파빌리온은 본체 처마 위로 돌출된 독립 모임지붕.
//   A116 (p16) 지붕 평면: 각 유닛 모임지붕(용마루 장변 방향), 로비 블록·브리즈웨이 평지붕(EPDM) + 작은 모임지붕 탑.
// 로컬 프레임: A111 평면 기준 x = 오른쪽(= 북), z = 아래(= 동). 원점 = E1 날개 외벽(남) × 척추 외곽 치수선(서; 벽면은 z=2).
// 첫 번째 인스턴스 = way/544686556 (site.json 명칭 'West' 이나 실제 세계좌표상 동쪽 건물 = 도면의 EAST BUILDING).
// 두 번째 인스턴스 = way/1348752763: z → -z 거울상 좌표로 다시 생성(폴리곤 방향 반전 → 법선 유지) 후 로컬 오프셋 배치.
import * as THREE from 'three';

export const meta = {
  id: 'reeve', name: 'Reeve Hall', osm: 'way/544686556', extraIds: ['way/1348752763'],
  anchor: [32.54, -638.98], rotation: -90.029,   // fit_footprint.py: RMS 2.12 ft (way/1348752763: anchor [-28.65,-637.68], rot -89.971, RMS 2.12)
  height: 54,
  preset: { pos: [60, 230, -1180], tgt: [0, 10, -750] },
  sheets: 'Reeve Hall 5 arch_full.pdf: A100, A111, A116, A201, A202',
};
const EAST_OFFSET = [-1.27, -61.19], EAST_ROT = 0.058;   // 두 번째(거울상) 인스턴스: R_w^-1·(anchor_e − anchor_w), 잔여 회전 rot_e − rot_w (deg)

const W = 227.875, F = [0, 12, 22, 32, 42.75], EAVE = 43.0, PITCH = 5 / 12, OV = 1.5;

const halfL = [[38.44, 2], [38.44, 16.77], [21.1, 16.77], [21.1, 56], [0, 56], [0, 83.33], [-3.5, 83.33], [-3.5, 100], [0, 100], [0, 127.33],
  [15.33, 127.33], [15.33, 136.9], [36.67, 136.9], [36.67, 127.33], [50, 127.33], [50, 56], [38.44, 56], [38.44, 49]];
export const outline = [...halfL, ...halfL.slice().reverse().map(p => [W - p[0], p[1]]),
  [162.1, 2], [162.1, -1.5], [145.44, -1.5], [145.44, 2], [82.44, 2], [82.44, -1.5], [65.77, -1.5], [65.77, 2]];

export function build(M, G) {
  const grp = new THREE.Group();
  grp.add(buildOne(M, G, false));
  const east = buildOne(M, G, true);
  east.position.set(EAST_OFFSET[0], 0, EAST_OFFSET[1]);
  east.rotation.y = -EAST_ROT * Math.PI / 180;
  grp.add(east);
  return grp;
}

const rectPoly = (x0, x1, z0, z1) => [[x0, z0], [x0, z1], [x1, z1], [x1, z0]];   // 평면상 CCW

/** 건물 1동. mirZ = true 면 z → -z 거울상 좌표로 생성 */
export function buildOne(M, G, mirZ) {
  const parts = [];
  unitHalf(parts, M, G, x => x, mirZ);          // 좌측 절반 (E1 + E2 + 로비)
  unitHalf(parts, M, G, x => W - x, !mirZ);     // 우측 절반 (E4 + E3 + 로비): x 거울상
  // ---- 브리즈웨이 (x 109.77..118.1, z 2..49): 1층 통로 개구, 상부 벽돌, 평지붕 + 엘리베이터 탑(46.5)
  const T = p => [p[0], mirZ ? -p[1] : p[1]], S = (a, b) => mirZ ? [T(b), T(a)] : [T(a), T(b)];
  const P = pts => mirZ ? pts.map(T).reverse() : pts.map(T);
  for (const [a, b] of [S([118.1, 2], [109.77, 2]), S([109.77, 49], [118.1, 49])]) {
    parts.push({ geom: G.wallSeg(a, b, 0, F[4], { openings: [{ s: 0.6, e: 7.73, b: 0, t: 11 }] }), mat: M.brick_red });
    bands(parts, M, G, a, b);
  }
  flat(parts, M, G, P(rectPoly(109.77, 118.1, 2, 49)), F[4], 1.0);
  const ez = mirZ ? [-49, -40.5] : [40.5, 49];
  parts.push({ geom: G.box(7.3, 4.75, 8.5, 113.94, F[4], (ez[0] + ez[1]) / 2), mat: M.brick_red });
  hip(parts, M, G, [110.3, 117.6, ez[0], ez[1]], F[4] + 4.75, 1.0, 'z');
  const g = new THREE.Group();
  for (const m of G.mergeByMaterial(parts)) g.add(m);
  return g;
}

/** 절반(날개 1 + 척추 유닛 1 + 로비 블록). mx = x 사상, flip = 방향 반전 여부(x 거울 XOR z 거울) */
function unitHalf(parts, M, G, mx, flip) {
  const mirZ = flip !== (mx(1) < mx(0));
  const T = p => [mx(p[0]), mirZ ? -p[1] : p[1]];
  const S = (a, b) => flip ? [T(b), T(a)] : [T(a), T(b)];
  const P = pts => flip ? pts.map(T).reverse() : pts.map(T);
  const R = (x0, x1, z0, z1) => { const a = T([x0, z0]), b = T([x1, z1]); return [Math.min(a[0], b[0]), Math.max(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[1], b[1])]; };
  const B = (w, h, d, cx, y, cz, mat) => { const c = T([cx, cz]); parts.push({ geom: G.box(w, h, d, c[0], y, c[1]), mat }); };
  const win = (a, b, colW, margin = 2.5) => { const [p0, p1] = S(a, b); facade(parts, M, G, p0, p1, colW, margin); };
  const plain = (a, b, y0, y1) => { const [p0, p1] = S(a, b); parts.push({ geom: G.sideGeometry([p0, p1], y0, y1, 1 / 24, 1 / 12, false), mat: M.brick_red }); bands(parts, M, G, p0, p1); };

  // ---- E2 척추 유닛 (x 38.44..109.77, z 2..49), 서측(z=2) 면 중앙에 현관 파빌리온
  win([109.77, 2], [82.44, 2], 9.1);  win([65.77, 2], [38.44, 2], 9.1);
  win([38.44, 2], [38.44, 16.77], 7.4, 1.5);
  win([38.44, 49], [109.77, 49], 8.9);
  hip(parts, M, G, R(38.44, 109.77, 2, 49), EAVE, OV, 'x');
  pavilion(parts, M, G, S, P, R, [65.77, 82.44, -1.5, 8], 'z', [[82.44, -1.5], [65.77, -1.5]]);
  // ---- 로비 블록 (x 21.1..38.44, z 16.77..56): 평지붕 + 계단/엘리베이터 탑 (z 27.44..39.1, 모임지붕)
  win([38.44, 16.77], [21.1, 16.77], 8.5, 2);
  win([21.1, 16.77], [21.1, 56], 6.5, 3);
  plain([38.44, 56], [38.44, 49], 0, F[4]);
  flat(parts, M, G, P(rectPoly(21.1, 38.44, 16.77, 56)), F[4], 1.0);
  B(17.34, 4.75, 11.66, 29.77, F[4], 33.27, M.brick_red);
  hip(parts, M, G, R(21.1, 38.44, 27.44, 39.1), F[4] + 4.75, 1.0, 'x');
  // ---- E1 날개 (x 0..50, z 56..127.33), 남측(x=0) 면 중앙 현관 파빌리온, 동쪽 끝 계단 돌출
  win([0, 56], [0, 83.33], 9.1);  win([0, 100], [0, 127.33], 9.1);
  win([0, 127.33], [15.33, 127.33], 7.5, 1.5);  win([36.67, 127.33], [50, 127.33], 6.5, 1.5);
  win([50, 127.33], [50, 56], 8.9);
  win([50, 56], [38.44, 56], 5.8, 1.5);  win([21.1, 56], [0, 56], 6.5, 1.5);   // 서측(z=56) 노출 구간: 로비 블록 양옆
  hip(parts, M, G, R(0, 50, 56, 127.33), EAVE, OV, 'z');
  pavilion(parts, M, G, S, P, R, [-3.5, 6, 83.33, 100], 'x', [[-3.5, 83.33], [-3.5, 100]]);
  // 계단 돌출 (x 15.33..36.67, z 127.33..136.9): 높이 40, 평지붕
  plain([15.33, 127.33], [15.33, 136.9], 0, 40);  plain([36.67, 136.9], [36.67, 127.33], 0, 40);
  win([15.33, 136.9], [36.67, 136.9], 7, 3.5);
  flat(parts, M, G, P(rectPoly(15.33, 36.67, 127.33, 136.9)), 40, 1.0);
}

/** 현관 파빌리온: rect [x0,x1,z0,z1] 벽(정면 제외 3면, y 0..46.5) + 정면(석회암 포탈·출입문·창 C) + 모임지붕(용마루 axis 방향) */
function pavilion(parts, M, G, S, P, R, rect, axis, front) {
  const [x0, x1, z0, z1] = rect, TOP = 46.5;
  const q = rectPoly(x0, x1, z0, z1);
  if (axis === 'x') q.push(q.shift());                       // 정면이 마지막(닫는) 변이 되도록 회전
  parts.push({ geom: G.sideGeometry(P(q), 0, TOP, 1 / 24, 1 / 12, false), mat: M.brick_red });
  const [p0, p1] = S(front[0], front[1]);
  const w = G.windowGrid(p0, p1, { y0: F[1], rows: 3, rowH: (TOP - F[1]) / 3, cols: 1, winW: 6, winH: 7, sill: 2.2, inset: 0.6 });
  parts.push({ geom: w.wall, mat: M.brick_red }); parts.push({ geom: w.glass, mat: M.pane, cast: false });
  const dx = p1[0] - p0[0], dz = p1[1] - p0[1], len = Math.hypot(dx, dz), nx = -dz / len, nz = dx / len, ry = -Math.atan2(dz, dx);
  const cx = (p0[0] + p1[0]) / 2, cz = (p0[1] + p1[1]) / 2;
  parts.push({ geom: G.box(len, F[1], 0.6, cx + nx * 0.1, 0, cz + nz * 0.1, { ry }), mat: M.limestone });   // 1층 석회암 포탈
  parts.push({ geom: G.box(7, 9, 0.3, cx + nx * 0.5, 0, cz + nz * 0.5, { ry }), mat: M.glass, cast: false });  // 출입문 + 사이드라이트
  hip(parts, M, G, R(x0, x1, z0, z1), TOP, 1.0, axis);
}

/** 층별 창 그리드 (1층 12', 2·3층 10', 4층 10.75') + 석회암 띠. p0→p1 CCW 세그먼트 */
function facade(parts, M, G, p0, p1, colW, margin) {
  const spec = [[0, 12, 3.6, 8.5, 2.2], [12, 10, 3.6, 6, 3], [22, 10, 3.6, 6, 3], [32, 10.75, 3.6, 6, 3]];
  for (const [y0, h, ww, wh, sill] of spec) {
    const w = G.windowGrid(p0, p1, { y0, rows: 1, rowH: h, colW, winW: ww, winH: wh, sill, margin, inset: 0.5 });
    parts.push({ geom: w.wall, mat: M.brick_red }); parts.push({ geom: w.glass, mat: M.pane, cast: false });
  }
  bands(parts, M, G, p0, p1);
}

/** 석회암 띠(2층 바닥선) + rowlock(4층) + soldier(기단) */
function bands(parts, M, G, p0, p1) {
  const dx = p1[0] - p0[0], dz = p1[1] - p0[1], len = Math.hypot(dx, dz), nx = -dz / len, nz = dx / len;
  const cx = (p0[0] + p1[0]) / 2, cz = (p0[1] + p1[1]) / 2, ry = -Math.atan2(dz, dx);
  for (const [y, h, d] of [[11.4, 0.8, 0.25], [31.6, 0.5, 0.15], [2.3, 0.7, 0.1]])
    parts.push({ geom: G.box(len, h, d + 0.2, cx + nx * d / 2, y, cz + nz * d / 2, { ry }), mat: M.limestone });
}

/** 평지붕 + 난간 코핑 */
function flat(parts, M, G, poly, y, parapet) {
  const r = G.flatRoof(poly, y, { parapet, thick: 0.6 });
  parts.push({ geom: r.slab, mat: M.roof_membrane });
  if (r.parapet) parts.push({ geom: r.parapet, mat: M.limestone });
}

/** 모임지붕(hip): rect [x0,x1,z0,z1] 을 ov 만큼 넓힌 처마, 용마루 axis('x'|'z') 방향, 경사 PITCH. 처마 밑 파시아 슬래브 포함 */
function hip(parts, M, G, rect, yE, ov, axis) {
  const [x0, x1, z0, z1] = [rect[0] - ov, rect[1] + ov, rect[2] - ov, rect[3] + ov];
  const along = axis === 'x', L0 = along ? x0 : z0, L1 = along ? x1 : z1, S0 = along ? z0 : x0, S1 = along ? z1 : x1;
  const half = (S1 - S0) / 2, yR = yE + half * PITCH, sm = (S0 + S1) / 2, mid = (L0 + L1) / 2;
  const r0 = Math.min(L0 + half, mid), r1 = Math.max(L1 - half, mid);
  const V = (l, s, y) => along ? [l, y, s] : [s, y, l];
  const A = V(L0, S0, yE), Bp = V(L1, S0, yE), C = V(L1, S1, yE), D = V(L0, S1, yE), R0 = V(r0, sm, yR), R1 = V(r1, sm, yR);
  const cen = [(x0 + x1) / 2, yE, (z0 + z1) / 2], pos = [], uv = [];
  const tri = (a, b, c) => {
    const n = new THREE.Vector3().crossVectors(new THREE.Vector3(b[0] - a[0], b[1] - a[1], b[2] - a[2]), new THREE.Vector3(c[0] - a[0], c[1] - a[1], c[2] - a[2]));
    const m = [(a[0] + b[0] + c[0]) / 3 - cen[0], (a[1] + b[1] + c[1]) / 3 - cen[1], (a[2] + b[2] + c[2]) / 3 - cen[2]];
    if (n.x * m[0] + n.y * m[1] + n.z * m[2] < 0) [b, c] = [c, b];   // 바깥 법선 보장
    pos.push(...a, ...b, ...c);
    for (const v of [a, b, c]) uv.push((v[0] + v[2]) / 24, v[1] / 12);
  };
  tri(A, Bp, R1); tri(A, R1, R0); tri(C, D, R0); tri(C, R0, R1); tri(Bp, C, R1); tri(D, A, R0);
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.computeVertexNormals();
  parts.push({ geom: g, mat: M.roof_dark });
  parts.push({ geom: G.box(x1 - x0, 1.0, z1 - z0, (x0 + x1) / 2, yE - 1.0, (z0 + z1) / 2), mat: M.trim });   // 처마 파시아/소핏
}
