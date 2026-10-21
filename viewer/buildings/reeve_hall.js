// Reeve Hall — "North Residence Hall" (CSO Architects, 입찰도서 2012-08-31, 2014 개관). 동·서 동일(거울상) 2개 동.
// 치수 근거 (도면 세트 "Reeve Hall Record Drawings / 5 arch_full.pdf", 1/8" = 1'-0", 벡터 PDF → 창 사각형 좌표 추출):
//   A100 (p2) 배치도: 동/서 건물은 North 6th St 축에 대해 거울상. E2·E3 가 6th St 쪽(서) 척추, E1·E4 날개가 동쪽으로 뻗음.
//   A111 (p10) 1층 전체 평면: 전체 길이 227'-10½" (21'-1¼"+17'-4"+71'-4"+8'-4"+71'-4"+17'-4"+21'-1¼"), 전체 깊이 136'-10¾"
//     (2'+14'-9¼"+10'-8"+11'-8"+16'-10¾" = 56' 척추부 + 날개 71'-4" + 계단 돌출 9'-6¾"), 날개 폭 48' (13'-4"+21'-4"+13'-4"),
//     현관 베이 4'+8'-8"+4' = 16'-8" (날개 27'-4"+16'-8"+27'-4" 중앙), 브리즈웨이 8'-4", 로비 블록 x 21.1..38.44 × z 16.77..56,
//     계단/엘리베이터 탑 z 27.44..39.1 (11'-8" 베이), 척추 유닛 깊이 47' (z 2..49). 포켓(x 38.44..50 × z 49..56)은 외부.
//   A201/A202/A203 (p37/38/39) 입면: FIRST 0', SECOND 12'-0", THIRD 22'-0", FOURTH 32'-0", TOP MASONRY 34'-0", B/O SOFFIT 40'-11¾",
//     TRUSS BRG 41'-6", ATTIC 42'-9", ELEV. TRUSS BRG 46'-6" (현관 파빌리온·로비 탑·브리즈웨이 탑 상단). 5/12 아스팔트 슁글 모임지붕.
//     외벽: 면벽돌 0..34' (기단 8" soldier course 2'-4"..3'-0", 2층 석회암 띠 profile 2a/2b 13'-4"..14'-8", 34' rowlock+석회암 profile 4),
//     34'..41' 섬유시멘트 패널(07 46 00-G) + 트림보드(07 46 00-C), 처마 소핏 41'..파시아 43'. 로비 블록·계단 돌출부·브리즈웨이 탑은 전면 패널.
//   A116 (p16) 지붕 평면: 유닛 모임지붕(척추 용마루 x 방향, 날개 z 방향), 현관 파빌리온 모임지붕이 본체 지붕에 밸리로 합류,
//     로비 블록 평지붕 + 탑 모임지붕, 브리즈웨이 평지붕(ROOF ACCESS HATCH), 지붕창(도머, 항목 12) 척추 안뜰쪽·날개 안뜰쪽 각 1,
//     계단 돌출부 평지붕. A310 (p42) 단면, A350/A351 (p43/46) 벽 단면·확대 입면, A370 (p51) 석회암 프로파일.
//
// 입면 창 배치 (E1+E2 절반, 로컬 좌표; 나머지 절반·서측 건물은 거울상). 창 A = 3'-4"×5'-4" 케이스먼트, 창대 = 층 바닥+2'-8",
//   창 B = 1층 3'-4"×7'-0" (창대 3', 상부 트랜섬 8'-4"..10', 석회암 머리), 창 C = 파빌리온 5'-4"×5'-4" (고정 사이드라이트),
//   4층 창 A 는 5'-2" 폭 트림보드 둘레. D = 출입문 3'-6"×7'-6"+트랜섬(10'), DD = 기계실 양개 철문 6'-4"×7'-4"+루버.
//   척추 서측 (z=2, A201 West):   x 105.1, 96.1, 87.1 | 파빌리온 65.77..82.44 | 61.1, 52.1, 43.1 — 1층 B, 2~4층 A (9' 간격)
//   척추 동측 (z=49, A202 East): x 52.2 (1층 창+루버), 61.8 (D), 74.1 (-), 86.4 (D), 96.1 (DD), 105.1 (루버 3'-4"×4') — 2~4층 A
//   척추 남단 (x=38.44, z 2..16.77): 창 없음, 4층 패널 3등분
//   로비 서측 (z=16.77): x 26.0 — 1층 B, 2~4층 A; 전면 패널 + 트림
//   로비 남측 (x=21.1): z 19.8 (B/A), 33.3 (석회암 포털 z 27.44..39.1 + 문 D, 2~4층 A), 46.8 (B/A); 상부 탑 z 27.44..39.1
//   포켓 (x=38.44, z 49..56): 문 3'×7' + 루버 트랜섬
//   날개 남측 (x=0, A201 South): z 60.7, 69.7, 78.7 | 파빌리온 83.33..100 | 104.7, 113.7, 122.7 — 1층 B, 2~4층 A
//   날개 안뜰측 (x=50, A203 Unit Rear): z 60.66 (D), 69.67 (B+루버 트랜섬), 79.33 (D), 91.67 (2~4층만), 104.0 (D),
//     루버 6'-4"×7' z 105.66..112.0, 113.67 (B+루버), 122.66 (B) — 2~4층 A; 지붕창 z 91.67
//   날개 동단 (z=127.33): 창 없음; 계단 돌출부 동측 (z=136.9): x 26.0 — 1층 B, 2~4층 A; 남측면 (x=15.33) 문 1개
//   날개 서측 (z=56, x 0..21.1): 창 없음, 4층 패널 3등분
//   파빌리온 정면: 벽돌 필라스터 4' 양측, 중앙 8'-8" 패널 스트립 (C 창 2~4층, 스팬드럴), 1층 석회암 포털 + 양개문 6'×8'+트랜섬,
//     41'-6" 석회암 코니스, 42'-3"..46'-6" 패널 (중앙 루버 7'-10"×3'-4", 양측 소창), 파시아 46'-6"..47'-6", 모임지붕 5/12
//   브리즈웨이 탑 (x 109.77..118.1): 서측 문 3'-4"×10'(트랜섬) + 2~4층 A, 동측 2~4층 A, 상단 46'-6" 캡. 안뜰 기계마당 6' 펜스.
// 로컬 프레임: A111 평면 기준 x = 오른쪽(= 북), z = 아래(= 동). 원점 = E1 날개 외벽(남) × 척추 외곽 치수선(서; 벽면은 z=2).
// 첫 번째 인스턴스 = way/544686556 (site.json 명칭 'West' 이나 실제 세계좌표상 동쪽 건물 = 도면의 EAST BUILDING).
// 두 번째 인스턴스 = way/1348752763: z → -z 거울상 좌표로 다시 생성(폴리곤 방향 반전 → 법선 유지) 후 로컬 오프셋 배치.
import * as THREE from 'three';

export const meta = {
  id: 'reeve', name: 'Reeve Hall', osm: 'way/544686556', extraIds: ['way/1348752763'],
  anchor: [32.54, -638.98], rotation: -90.029,   // fit_footprint.py: RMS 2.12 ft (way/1348752763: anchor [-28.65,-637.68], rot -89.971, RMS 2.12)
  height: 54,
  preset: { pos: [60, 230, -1180], tgt: [0, 10, -750] },
  sheets: 'Reeve Hall 5 arch_full.pdf: A100, A111, A116, A201, A202, A203, A310, A350, A351, A370',
};
const EAST_OFFSET = [-1.27, -61.19], EAST_ROT = 0.058;   // 두 번째(거울상) 인스턴스: R_w^-1·(anchor_e − anchor_w), 잔여 회전 rot_e − rot_w (deg)

const W = 227.875, F = [0, 12, 22, 32], PITCH = 5 / 12, OV = 1.5;
const TOPM = 34.0, SOFF = 41.25, EAVE = 43.0, ROOF2 = 41.0;       // 조적 상단, 소핏(벽 상단), 파시아 상단(=처마), 로비 평지붕(파시아 띠 뒤)
const TOWER = 46.5;                                                // 파빌리온·탑·브리즈웨이 벽 상단 (ELEV. TRUSS BRG)
const SILL = 2.67, AH = 5.33, AW = 3.33;                           // 창 A: 층 바닥 + 창대, 높이, 폭

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
  const ctx = mkCtx(parts, M, G, x => x, mirZ);
  // ---- 브리즈웨이 탑 (x 109.77..118.1, z 1.7..49.3, 높이 46.5): 전면 패널, 서측 문+트랜섬, 양측 2~4층 창 A, 상단 캡
  const bw = [109.6, 118.27], bz = [1.7, 49.3], bc = 113.94;   // 유닛 지붕 파시아와 동일면 회피를 위해 0.17 겹침
  const fw = mkFace(ctx, [bw[1], bz[0]], [bw[0], bz[0]]);     // 서측 (바깥 -z)
  const fe = mkFace(ctx, [bw[0], bz[1]], [bw[1], bz[1]]);     // 동측 (바깥 +z)
  for (const [f, s, door] of [[fw, bw[1] - bc, true], [fe, bc - bw[0], false]]) {
    const op = [];
    if (door) op.push([s - 1.67, s + 1.67, 0, 10]);
    for (let k = 1; k < 4; k++) op.push([s - AW / 2, s + AW / 2, F[k] + SILL, F[k] + SILL + AH]);
    f.wall(0, 3, op, M.brick_red); f.wall(3, TOWER, op, M.trim);          // wallSeg 가 개구를 벽 높이로 잘라 준다
    if (door) doorT(f, s, 3.33);
    for (let k = 1; k < 4; k++) winA(f, s, F[k] + SILL, false);
    f.box(0, 0.5, 3, TOWER, 0, 0.1, M.white); f.box(f.len - 0.5, f.len, 3, TOWER, 0, 0.1, M.white);   // 모서리 트림
    for (const y of [11.3, 21.3, 31.3]) f.box(0, f.len, y, y + 0.6, 0, 0.06, M.white);
    f.box(0, f.len, 2.33, 3.0, 0, 0.06, M.brick_brown);
  }
  for (const ln of [[[bw[0], bz[0]], [bw[0], bz[1]]], [[bw[1], bz[1]], [bw[1], bz[0]]]])                // 긴 측면 2개 (지붕 위 노출부만)
    parts.push({ geom: G.sideGeometry(ctx.P(ln), 40, TOWER, 1 / 24, 1 / 12, false), mat: M.trim });
  ctx.B(bw[0] - 0.5, bw[1] + 0.5, bz[0] - 0.5, bz[1] + 0.5, TOWER, TOWER + 0.8, M.white);      // 캡 (평지붕 겸)
  ctx.B(bw[0] + 2, bw[0] + 5, bz[0] + 20, bz[0] + 25, TOWER + 0.8, TOWER + 2.0, M.dark);          // 지붕 출입 해치
  // ---- 안뜰 기계 마당 펜스 (6' 장식 알루미늄, x 89..139 × z 49..67, 3면)
  fence(ctx, [[139, 49], [139, 67], [89, 67], [89, 49]]);
  const g = new THREE.Group();
  for (const m of G.mergeByMaterial(parts)) g.add(m);
  return g;
}

/** 좌표 변환 컨텍스트: mx = x 사상, mirZ = z 거울 여부. flip = 폴리곤 방향 반전 여부 */
function mkCtx(parts, M, G, mx, mirZ) {
  const flip = mirZ !== (mx(1) < mx(0));
  const T = p => [mx(p[0]), mirZ ? -p[1] : p[1]];
  const S = (a, b) => flip ? [T(b), T(a)] : [T(a), T(b)];
  const P = pts => flip ? pts.map(T).reverse() : pts.map(T);
  const R = (x0, x1, z0, z1) => { const a = T([x0, z0]), b = T([x1, z1]); return [Math.min(a[0], b[0]), Math.max(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[1], b[1])]; };
  const B = (x0, x1, z0, z1, y0, y1, mat) => { const r = R(x0, x1, z0, z1); parts.push({ geom: G.box(r[1] - r[0], y1 - y0, r[3] - r[2], (r[0] + r[1]) / 2, y0, (r[2] + r[3]) / 2), mat }); };
  return { parts, M, G, flip, T, S, P, R, B };
}

/** 벽면 하나 (원 좌표 A→B, CCW 규약). 거리 s 는 항상 원 좌표의 A 로부터 잰다 */
function mkFace(ctx, A, B) {
  const { parts, G, S, flip } = ctx;
  const [p0, p1] = S(A, B);
  const dx = p1[0] - p0[0], dz = p1[1] - p0[1], len = Math.hypot(dx, dz);
  const ex = [dx / len, dz / len], n = [-dz / len, dx / len], ry = -Math.atan2(dz, dx);
  const cv = (s0, s1) => flip ? [len - s1, len - s0] : [s0, s1];
  const f = {
    len, p0, p1,
    /** 벽 y0..y1, openings = [[s0,s1,b,t], ...] */
    wall(y0, y1, openings, mat) {
      const op = openings.map(o => { const [a, b] = cv(o[0], o[1]); return { s: a, e: b, b: o[2], t: o[3] }; });
      parts.push({ geom: G.wallSeg(p0, p1, y0, y1, { openings: op }), mat });
    },
    /** 박스: 거리 s0..s1, 높이 y0..y1, 법선 방향 d0..d1 (양수 = 바깥) */
    box(s0, s1, y0, y1, d0, d1, mat, cast) {
      const [a, b] = cv(s0, s1), sm = (a + b) / 2, dm = (d0 + d1) / 2;
      parts.push({ geom: G.box(b - a, y1 - y0, d1 - d0, p0[0] + ex[0] * sm + n[0] * dm, y0, p0[1] + ex[1] * sm + n[1] * dm, { ry }), mat, cast });
    },
    /** 부분 벽: 거리 s0..s1 구간을 inset 만큼 안쪽 평면에 세움 (openings 는 face 원 좌표) */
    subWall(s0, s1, y0, y1, inset, openings, mat) {
      const [a, b] = cv(s0, s1);
      const q0 = [p0[0] + ex[0] * a - n[0] * inset, p0[1] + ex[1] * a - n[1] * inset];
      const q1 = [p0[0] + ex[0] * b - n[0] * inset, p0[1] + ex[1] * b - n[1] * inset];
      const op = openings.map(o => { const [u, v] = cv(o[0], o[1]); return { s: u - a, e: v - a, b: o[2], t: o[3] }; });
      parts.push({ geom: G.wallSeg(q0, q1, y0, y1, { openings: op }), mat });
    },
    /** 면 (유리 등): 벽면에서 inset 만큼 안쪽 */
    pane(s0, s1, b, t, inset, mat) {
      const [a, c] = cv(s0, s1);
      const q0 = [p0[0] + ex[0] * a - n[0] * inset, p0[1] + ex[1] * a - n[1] * inset];
      const q1 = [p0[0] + ex[0] * c - n[0] * inset, p0[1] + ex[1] * c - n[1] * inset];
      parts.push({ geom: G.sideGeometry([q0, q1], b, t, 1 / (c - a), 1 / (t - b), false), mat, cast: false });
    },
  };
  f.M = ctx.M;
  return f;
}

// ---------------------------------------------------------------- 창·문 요소 (f = face, s = 중심 거리)
/** 창 A (3'-4"×5'-4"). trim = 4층 트림보드 둘레, sillHead = 석회암 창대 + soldier 머리 */
function winA(f, s, sill, sillHead, trim) {
  const M = f.M, a = s - AW / 2, b = s + AW / 2, t = sill + AH;
  f.pane(a, b, sill, t, 0.5, M.pane);
  f.box(s - 0.08, s + 0.08, sill, t, -0.45, -0.35, M.dark, false);
  f.box(a, b, sill + AH / 2 - 0.07, sill + AH / 2 + 0.07, -0.45, -0.35, M.dark, false);
  if (sillHead) { f.box(s - 2.0, s + 2.0, sill - 0.33, sill, 0, 0.15, M.limestone); f.box(s - 2.0, s + 2.0, t, t + 0.67, 0, 0.06, M.brick_brown); }
  if (trim) {
    f.box(s - 2.6, s - 1.67, sill - 0.9, t + 0.9, 0, 0.08, M.white); f.box(s + 1.67, s + 2.6, sill - 0.9, t + 0.9, 0, 0.08, M.white);
    f.box(s - 2.6, s + 2.6, sill - 0.9, sill, 0, 0.08, M.white); f.box(s - 2.6, s + 2.6, t, t + 0.9, 0, 0.08, M.white);
  }
}
/** 창 B (1층, 3'-4"×7', 창대 3', 트랜섬 8'-4"..10'). louver = 트랜섬이 루버. stone = 석회암 머리/창대 */
function winB(f, s, louver, stone = true) {
  const M = f.M, a = s - AW / 2, b = s + AW / 2;
  f.pane(a, b, 3, 8.33, 0.5, M.pane);
  if (louver) f.box(a + 0.1, b - 0.1, 8.4, 9.95, -0.4, -0.25, M.dark); else f.pane(a, b, 8.33, 10, 0.5, M.pane);
  f.box(s - 0.08, s + 0.08, 3, 8.33, -0.45, -0.35, M.dark, false);
  f.box(a, b, 8.25, 8.4, -0.45, -0.3, M.dark, false);
  if (stone) { f.box(s - 2.17, s + 2.17, 10, 10.67, 0, 0.15, M.limestone); f.box(s - 2.0, s + 2.0, 2.67, 3, 0, 0.15, M.limestone); }
}
/** 1층 창 A 크기 (3'..8'-4") + 상부 루버 */
function winAL(f, s) {
  const M = f.M, a = s - AW / 2, b = s + AW / 2;
  f.pane(a, b, 3, 8.33, 0.5, M.pane);
  f.box(s - 0.08, s + 0.08, 3, 8.33, -0.45, -0.35, M.dark, false);
  f.box(a + 0.1, b - 0.1, 8.4, 9.95, -0.4, -0.25, M.dark);
  f.box(s - 2.17, s + 2.17, 10, 10.67, 0, 0.15, M.limestone); f.box(s - 2.0, s + 2.0, 2.67, 3, 0, 0.15, M.limestone);
}
/** 출입문 + 트랜섬 (폭 w, 문 0..7.5, 트랜섬 7.5..10) — 알루미늄 스토어프론트 */
function doorT(f, s, w = 3.5, head = true) {
  const M = f.M, a = s - w / 2, b = s + w / 2;
  f.pane(a, b, 0, 7.5, 0.4, M.glass);
  f.pane(a, b, 7.5, 10, 0.4, M.pane);
  f.box(a, b, 7.4, 7.6, -0.35, -0.25, M.dark, false);
  f.box(a, a + 0.15, 0, 10, -0.35, -0.25, M.dark, false); f.box(b - 0.15, b, 0, 10, -0.35, -0.25, M.dark, false);
  if (head) f.box(s - w / 2 - 0.7, s + w / 2 + 0.7, 10, 10.67, 0, 0.15, M.limestone);
}
/** 기계실 양개 철문 6'-4"×7'-4" + 상부 루버 */
function doorDD(f, s) {
  const M = f.M, a = s - 3.17, b = s + 3.17;
  f.box(a, b, 0, 7.33, -0.4, -0.3, M.dark);
  f.box(s - 0.04, s + 0.04, 0, 7.33, -0.3, -0.26, M.white, false);
  f.box(a + 0.1, b - 0.1, 7.4, 9.95, -0.4, -0.25, M.dark);
  f.box(a - 0.5, b + 0.5, 10, 10.67, 0, 0.15, M.limestone);
}
/** 루버 개구 (폭 w, b..t) */
function louver(f, s, w, b, t) { f.box(s - w / 2 + 0.1, s + w / 2 - 0.1, b + 0.05, t - 0.05, -0.4, -0.25, f.M.dark); }
/** 파빌리온 창 C (5'-4"×5'-4", 사이드라이트) */
function winC(f, s, sill) {
  const M = f.M, a = s - 2.67, b = s + 2.67, t = sill + AH;
  f.pane(a, b, sill, t, 0.5, M.pane);
  for (const x of [s - 1.67, s + 1.67]) f.box(x - 0.08, x + 0.08, sill, t, -0.45, -0.35, M.dark, false);
  f.box(a, b, sill + AH / 2 - 0.07, sill + AH / 2 + 0.07, -0.45, -0.35, M.dark, false);
}
/** 4층 패널 구간 3등분 트림보드 (s0..s1) */
function panels3(f, s0, s1) {
  const M = f.M, w = (s1 - s0) / 3;
  for (let i = 0; i <= 3; i++) { const x = i === 0 ? s0 + 0.35 : i === 3 ? s1 - 0.35 : s0 + i * w; f.box(x - 0.2, x + 0.2, TOPM + 0.4, SOFF - 0.7, 0, 0.08, M.white); }
}
/** 벽돌 입면 공통 띠: soldier 기단, 2층 석회암 띠(2단), 34' 석회암, 패널 상·하 트림 */
function brickBands(f, s0, s1) {
  const M = f.M;
  f.box(s0, s1, 2.33, 3.0, 0, 0.06, M.brick_brown);
  f.box(s0, s1, 13.33, 14.0, 0, 0.15, M.limestone); f.box(s0, s1, 14.0, 14.67, 0, 0.25, M.limestone);
  f.box(s0, s1, 33.33, TOPM, 0, 0.2, M.limestone);
  f.box(s0, s1, TOPM, TOPM + 0.4, 0, 0.08, M.white); f.box(s0, s1, SOFF - 0.7, SOFF, 0, 0.08, M.white);
}
/** 빗물 홈통 (s 위치) */
function downspout(f, s) { f.box(s - 0.17, s + 0.17, 0, SOFF, 0.12, 0.46, f.M.white); }

/**
 * 벽돌 입면 (0..34' 벽돌, 34'..41.25' 패널). cols = [{c, f1, up}] c = 중심 거리, f1 = 1층 종류('B','BL','AL','D','DD','L4',null),
 * up = 2~4층 창 A 여부. extra = 추가 개구 [[s0,s1,b,t,kind]]
 */
function brickFacade(f, cols, { bands = true, ds = [], panelDiv = false, extra = [] } = {}) {
  const M = f.M, lo = [], hi = [];
  for (const col of cols) {
    const c = col.c;
    if (col.f1 === 'B' || col.f1 === 'BL' || col.f1 === 'AL') lo.push([c - AW / 2, c + AW / 2, 3, 10]);
    else if (col.f1 === 'D') lo.push([c - 1.75, c + 1.75, 0, 10]);
    else if (col.f1 === 'DD') lo.push([c - 3.17, c + 3.17, 0, 10]);
    else if (col.f1 === 'L4') lo.push([c - AW / 2, c + AW / 2, 6, 10]);
    if (col.up !== false) { for (const k of [1, 2]) lo.push([c - AW / 2, c + AW / 2, F[k] + SILL, F[k] + SILL + AH]); hi.push([c - AW / 2, c + AW / 2, F[3] + SILL, F[3] + SILL + AH]); }
  }
  for (const e of extra) lo.push(e.slice(0, 4));
  f.wall(0, TOPM, lo, M.brick_red);
  f.wall(TOPM, SOFF, hi, M.trim);
  for (const col of cols) {
    const c = col.c;
    if (col.f1 === 'B') winB(f, c, false); else if (col.f1 === 'BL') winB(f, c, true); else if (col.f1 === 'AL') winAL(f, c);
    else if (col.f1 === 'D') doorT(f, c); else if (col.f1 === 'DD') doorDD(f, c); else if (col.f1 === 'L4') { louver(f, c, AW, 6, 10); f.box(c - 2.17, c + 2.17, 10, 10.67, 0, 0.15, M.limestone); }
    if (col.up !== false) { winA(f, c, F[1] + SILL, true); winA(f, c, F[2] + SILL, true); winA(f, c, F[3] + SILL, false, true); }
  }
  for (const e of extra) { if (e[4] === 'L') { louver(f, (e[0] + e[1]) / 2, e[1] - e[0], e[2], e[3]); f.box(e[0] - 0.5, e[1] + 0.5, 10, 10.67, 0, 0.15, M.limestone); } }
  if (bands) brickBands(f, 0, f.len);
  if (panelDiv) panels3(f, 0, f.len);
  for (const s of ds) downspout(f, s);
}

/** 패널(섬유시멘트) 입면: 벽돌 기단 0..3', 패널 3'..top, 수직 트림(모서리·창 양옆), 층선 수평 트림 */
function panelFacade(f, cols, top, { ds = [] } = {}) {
  const M = f.M, lo = [], hi = [];
  for (const col of cols) {
    const c = col.c;
    if (col.f1 === 'B') hi.push([c - AW / 2, c + AW / 2, 3, 10]);
    else if (col.f1 === 'D') { lo.push([c - 1.75, c + 1.75, 0, 3]); hi.push([c - 1.75, c + 1.75, 3, 10]); }
    else if (col.f1 === 'D8') { lo.push([c - 1.75, c + 1.75, 0, 3]); hi.push([c - 1.75, c + 1.75, 3, 8]); }
    if (col.up !== false) for (const k of [1, 2, 3]) hi.push([c - AW / 2, c + AW / 2, F[k] + SILL, F[k] + SILL + AH]);
  }
  f.wall(0, 3, lo, M.brick_red);
  f.wall(3, top, hi, M.trim);
  f.box(0, f.len, 2.33, 3.0, 0, 0.06, M.brick_brown);
  for (const col of cols) {
    const c = col.c;
    if (col.f1 === 'B') winB(f, c, false, false);
    else if (col.f1 === 'D') doorT(f, c, 3.5, false);
    else if (col.f1 === 'D8') { f.pane(c - 1.75, c + 1.75, 0, 8, 0.4, M.glass); f.box(c - 0.06, c + 0.06, 0, 8, -0.35, -0.25, M.dark, false); }
    if (col.up !== false) for (const k of [1, 2, 3]) winA(f, c, F[k] + SILL, false);
    if (col.up !== false) for (const x of [c - 2.45, c + 2.45]) f.box(x - 0.25, x + 0.25, 3, top, 0, 0.1, M.white);
  }
  f.box(0, 0.5, 3, top, 0, 0.1, M.white); f.box(f.len - 0.5, f.len, 3, top, 0, 0.1, M.white);
  for (const y of [11.0, 21.0, 31.0]) if (y + 0.6 < top) f.box(0, f.len, y, y + 0.6, 0, 0.06, M.white);
  f.box(0, f.len, top - 0.7, top, 0, 0.12, M.white);
  for (const s of ds) downspout(f, s);
}

/** 절반(날개 1 + 척추 유닛 1 + 로비 블록). mx = x 사상, flip = 방향 반전 여부(x 거울 XOR z 거울) */
function unitHalf(parts, M, G, mx, flip) {
  const mirZ = flip !== (mx(1) < mx(0));
  const ctx = mkCtx(parts, M, G, mx, mirZ);
  const { S, P, R, B } = ctx;
  const face = (A, Bp) => mkFace(ctx, A, Bp);
  const col = (c, f1, up) => ({ c, f1, up });

  // ---- E2 척추 유닛 (x 38.44..109.77, z 2..49)
  //  서측 (z=2): 3+3 창, 중앙 파빌리온
  brickFacade(face([109.77, 2], [82.44, 2]), [col(4.67, 'B'), col(13.67, 'B'), col(22.67, 'B')], { ds: [1.0] });
  brickFacade(face([65.77, 2], [38.44, 2]), [col(4.67, 'B'), col(13.67, 'B'), col(22.67, 'B')], { ds: [26.4] });
  //  남단 (x=38.44, z 2..16.77): 민벽돌 + 4층 패널 3등분
  brickFacade(face([38.44, 2], [38.44, 16.77]), [], { panelDiv: true });
  //  동측 안뜰 (z=49): x 52.2 창+루버, 61.8 문, 74.1 (2~4층만), 86.4 문, 96.1 기계실 양개문, 105.1 루버
  brickFacade(face([38.44, 49], [109.77, 49]),
    [col(52.2 - 38.44, 'AL'), col(61.8 - 38.44, 'D'), col(74.1 - 38.44, null), col(86.4 - 38.44, 'D'), col(96.1 - 38.44, 'DD'), col(105.1 - 38.44, 'L4')],
    { ds: [12.5, 70.3] });
  hip(ctx, R(38.44, 109.77 - OV, 2, 49), EAVE, OV, 'x');
  pavilion(ctx, [65.77, 82.44, -1.5, 8], 'z', [[82.44, -1.5], [65.77, -1.5]]);
  dormer(ctx, [71.5, 76.7, 44.1, 48.1], 'z');                         // 지붕창 (안뜰쪽 경사면, 파빌리온 축)
  ridgeVent(ctx, [61.94, 84.77, 25.5, 25.5], EAVE + 25 * PITCH, 'x');

  // ---- 로비 블록 (x 21.1..38.44, z 16.77..56): 전면 패널, 평지붕 + 계단/엘리베이터 탑 (z 27.44..39.1)
  panelFacade(face([38.44, 16.77], [21.1, 16.77]), [col(38.44 - 26.0, 'B')], SOFF, { ds: [0.8] });
  {
    const f = face([21.1, 16.77], [21.1, 56]);
    panelFacade(f, [col(19.8 - 16.77, 'B'), col(33.3 - 16.77, 'D'), col(46.8 - 16.77, 'B')], SOFF);
    // 석회암 포털 (탑 베이 z 27.44..39.1, 0..11'), 문 양옆 필라스터
    const s0 = 27.44 - 16.77, s1 = 39.1 - 16.77, c = 33.3 - 16.77;
    f.box(s0, c - 1.9, 0, 11, 0, 0.5, M.limestone); f.box(c + 1.9, s1, 0, 11, 0, 0.5, M.limestone);
    f.box(c - 1.9, c + 1.9, 10, 11, 0, 0.5, M.limestone);
  }
  brickFacade(face([38.44, 56], [38.44, 49]), [], { extra: [[2.0, 5.0, 0, 7.33], [2.0, 6.93, 7.33, 10, 'L']] });   // 포켓: 문 + 루버 트랜섬
  {
    const f = face([38.44, 56], [38.44, 49]);
    f.pane(2.0, 5.0, 0, 7.33, 0.4, M.glass); f.box(2.0, 2.15, 0, 7.33, -0.35, -0.25, M.dark, false);
  }
  flat(ctx, P(rectPoly(21.1, 38.44, 16.77, 56)), ROOF2, 0);
  for (const [a, b] of [S([38.44, 16.77], [21.1, 16.77]), S([21.1, 16.77], [21.1, 56])]) fasciaStrip(ctx, a, b);
  B(21.1, 38.44, 27.44, 39.1, ROOF2, TOWER, M.trim);                     // 탑 벽체
  hip(ctx, R(21.1, 38.44, 27.44, 39.1), TOWER + 1.0, 1.0, 'x', 1.0);     // 탑 파시아 46.5..47.5 + 모임지붕

  // ---- E1 날개 (x 0..50, z 56..127.33), 남측(x=0) 면 중앙 현관 파빌리온, 동쪽 끝 계단 돌출
  brickFacade(face([0, 56], [0, 83.33]), [col(4.7, 'B'), col(13.7, 'B'), col(22.7, 'B')], { ds: [1.0] });
  brickFacade(face([0, 100], [0, 127.33]), [col(4.7, 'B'), col(13.7, 'B'), col(22.7, 'B')], { ds: [26.3] });
  brickFacade(face([0, 127.33], [15.33, 127.33]), [], { panelDiv: true, ds: [1.0] });
  brickFacade(face([36.67, 127.33], [50, 127.33]), [], { panelDiv: true, ds: [12.3] });
  //  안뜰측 (x=50, A203 Unit Rear): 7열, 1층 문/루버 트랜섬/대형 루버
  brickFacade(face([50, 127.33], [50, 56]),
    [col(127.33 - 122.66, 'B'), col(127.33 - 113.67, 'BL'), col(127.33 - 104.0, 'D'), col(127.33 - 91.67, null), col(127.33 - 79.33, 'D'), col(127.33 - 69.67, 'BL'), col(127.33 - 60.66, 'D')],
    { extra: [[127.33 - 112.0, 127.33 - 105.66, 3, 10, 'L']], ds: [1.0, 70.3] });
  brickFacade(face([50, 56], [38.44, 56]), []);                           // 포켓 측 (내부 모서리)
  brickFacade(face([21.1, 56], [0, 56]), [], { panelDiv: true, ds: [20.1] });
  hip(ctx, R(0, 50, 56, 127.33), EAVE, OV, 'z');
  pavilion(ctx, [-3.5, 6, 83.33, 100], 'x', [[-3.5, 83.33], [-3.5, 100]]);
  dormer(ctx, [45.1, 49.1, 89.07, 94.27], 'x');
  ridgeVent(ctx, [25, 25, 81.0, 102.33], EAVE + 26.5 * PITCH, 'z');
  // 계단 돌출 (x 15.33..36.67, z 127.33..136.9): 전면 패널, 높이 40.5, 평지붕 + 코니스
  const ST = 40.5;
  panelFacade(face([15.33, 136.9], [36.67, 136.9]), [col(26.0 - 15.33, 'B')], ST, { ds: [0.9, 20.4] });
  panelFacade(face([15.33, 127.33], [15.33, 136.9]), [col(4.78, 'D8', false)], ST);
  panelFacade(face([36.67, 136.9], [36.67, 127.33]), [], ST);
  flat(ctx, P(rectPoly(15.33, 36.67, 127.33, 136.9)), ST, 0);
  B(15.33 - 0.3, 36.67 + 0.3, 127.33, 136.9 + 0.3, ST - 0.3, ST + 0.4, M.white);   // 코니스/코핑
}

/** 현관 파빌리온: rect [x0,x1,z0,z1] (정면 = axis 쪽 바깥 변), 벽돌 필라스터 4' + 중앙 패널 스트립(창 C) + 석회암 포털 + 상부 패널·루버 + 모임지붕 */
function pavilion(ctx, rect, axis, front) {
  const { parts, M, G, P, R } = ctx;
  const [x0, x1, z0, z1] = rect;
  const q = rectPoly(x0, x1, z0, z1);
  if (axis === 'x') q.push(q.shift());                       // 정면이 마지막(닫는) 변이 되도록 회전
  parts.push({ geom: G.sideGeometry(P(q), 0, TOWER, 1 / 24, 1 / 12, false), mat: M.brick_red });   // 측면·배면 벽돌
  const f = mkFace(ctx, front[0], front[1]), L = f.len, c = L / 2;             // 16.67
  // 정면: 벽돌 필라스터(0..4, 12.67..16.67) 0..41.5, 중앙 베이(10' 위) 개구 + 문 개구 → 0.33 후퇴 패널 스트립
  f.wall(0, 41.5, [[4, L - 4, 10, 41.5], [c - 3, c + 3, 0, 10]], M.brick_red);
  const op = [];
  for (const k of [1, 2, 3]) op.push([c - 2.67, c + 2.67, F[k] + SILL, F[k] + SILL + AH]);
  f.subWall(4, L - 4, 10, 41.5, 0.33, op, M.trim);
  for (const k of [1, 2, 3]) {
    const sill = F[k] + SILL;
    f.pane(c - 2.67, c + 2.67, sill, sill + AH, 0.83, M.pane);
    for (const x of [c - 1.67, c + 1.67]) f.box(x - 0.08, x + 0.08, sill, sill + AH, -0.78, -0.68, M.dark, false);
    f.box(c - 2.67, c + 2.67, sill + AH / 2 - 0.07, sill + AH / 2 + 0.07, -0.78, -0.68, M.dark, false);
    f.box(c - 2.9, c + 2.9, sill - 0.4, sill, -0.33, -0.18, M.white); f.box(c - 2.9, c + 2.9, sill + AH, sill + AH + 0.5, -0.33, -0.18, M.white);
    if (k < 3) f.box(c - 2.67, c + 2.67, sill + AH + 0.5, F[k + 1] + SILL - 0.4, -0.33, -0.25, M.trim);     // 스팬드럴 패널
  }
  // 1층 석회암 포털 (전폭, 0..11', 0.5 돌출) + 양개문 6'×8' + 트랜섬 8'..10'
  f.box(0, c - 3, 0, 11, 0, 0.5, M.limestone); f.box(c + 3, L, 0, 11, 0, 0.5, M.limestone); f.box(c - 3, c + 3, 10, 11, 0, 0.5, M.limestone);
  f.pane(c - 3, c + 3, 0, 8, 0.1, M.glass); f.pane(c - 3, c + 3, 8, 10, 0.1, M.pane);
  f.box(c - 0.08, c + 0.08, 0, 10, -0.05, 0.05, M.dark, false); f.box(c - 3, c + 3, 7.9, 8.1, -0.05, 0.05, M.dark, false);
  f.box(c - 3, c - 2.85, 0, 10, -0.05, 0.05, M.dark, false); f.box(c + 2.85, c + 3, 0, 10, -0.05, 0.05, M.dark, false);
  for (const x of [c - 4.6, c + 4.6]) f.box(x - 0.3, x + 0.3, 7.6, 8.6, 0.5, 1.1, M.dark);          // 벽등
  // 2층 석회암 띠 (필라스터 구간), 41.5 코니스, 상부 패널 42.3..46.5 + 루버·소창
  for (const [a, b] of [[0, 4], [L - 4, L]]) { f.box(a, b, 13.33, 14.0, 0, 0.15, M.limestone); f.box(a, b, 14.0, 14.67, 0, 0.25, M.limestone); }
  f.box(0, L, 41.5, 42.3, -0.1, 0.4, M.limestone);
  f.wall(42.3, TOWER, [[c - 3.92, c + 3.92, 42.9, 45.9]], M.trim);
  louver(f, c, 7.84, 42.9, 45.9);
  for (const x of [2.0, L - 2.0]) { f.box(x - 1.15, x + 1.15, 42.85, 45.35, 0, 0.1, M.white); f.box(x - 0.95, x + 0.95, 43.05, 45.15, 0.1, 0.14, M.pane, false); }
  // 지붕: 파시아 46.5..47.5 (정면 ~ 본체 지붕면에 묻히는 지점까지), 모임지붕 용마루 axis 방향, 본체 지붕 안으로 12' 연장
  const ext = axis === 'z' ? [x0, x1, z0, z1 + 12] : [x0, x1 + 12, z0, z1];
  const fr = axis === 'z' ? [x0 - 1, x1 + 1, z0 - 1, z0 + 13] : [x0 - 1, x0 + 13, z0 - 1, z1 + 1];
  const rr = R(...fr); parts.push({ geom: G.box(rr[1] - rr[0], 1.0, rr[3] - rr[2], (rr[0] + rr[1]) / 2, TOWER, (rr[2] + rr[3]) / 2), mat: M.white });
  hip(ctx, R(...ext), TOWER + 1.0, 1.0, axis, 0);
}

/** 지붕창(도머): rect [x0,x1,z0,z1] 박스 (EL 44..47) + 캡, 정면은 axis 쪽 큰 좌표 변 */
function dormer(ctx, rect, axis) {
  const { M, B } = ctx;
  const [x0, x1, z0, z1] = rect;
  B(x0, x1, z0, z1, 44.0, 47.0, M.trim);
  B(x0 - 0.3, x1 + 0.3, z0 - 0.3, z1 + 0.3, 47.0, 47.5, M.white);
  if (axis === 'z') B(x0 + 0.9, x1 - 0.9, z1, z1 + 0.1, 44.6, 46.5, M.dark); else B(x1, x1 + 0.1, z0 + 0.9, z1 - 0.9, 44.6, 46.5, M.dark);
}
/** 용마루 환기구 (가늘고 긴 박스) */
function ridgeVent(ctx, rect, y, axis) {
  const { M, B } = ctx;
  if (axis === 'x') B(rect[0], rect[1], rect[2] - 0.6, rect[3] + 0.6, y - 0.1, y + 0.3, M.dark); else B(rect[0] - 0.6, rect[1] + 0.6, rect[2], rect[3], y - 0.1, y + 0.3, M.dark);
}
/** 평지붕 블록 가장자리 처마 띠 (소핏/파시아 41.25..43, 0.6 돌출) — 변환된 좌표 a→b */
function fasciaStrip(ctx, a, b) {
  const { parts, M, G } = ctx;
  const dx = b[0] - a[0], dz = b[1] - a[1], len = Math.hypot(dx, dz), nx = -dz / len, nz = dx / len;
  parts.push({ geom: G.box(len + 1.2, EAVE - SOFF, 0.8, (a[0] + b[0]) / 2 + nx * 0.2, SOFF, (a[1] + b[1]) / 2 + nz * 0.2, { ry: -Math.atan2(dz, dx) }), mat: M.white });
}
/** 평지붕 (+ 난간 코핑) */
function flat(ctx, poly, y, parapet) {
  const { parts, M, G } = ctx;
  const r = G.flatRoof(poly, y, { parapet, thick: 0.6 });
  parts.push({ geom: r.slab, mat: M.roof_membrane });
  if (r.parapet) parts.push({ geom: r.parapet, mat: M.limestone });
}
/** 안뜰 펜스: 꺾은선 pts (원 좌표), 6' 높이, 레일 2단 + 피켓 0.5' 간격 */
function fence(ctx, pts) {
  const { parts, M, G, T } = ctx;
  for (let i = 0; i < pts.length - 1; i++) {
    const a = T(pts[i]), b = T(pts[i + 1]);
    const dx = b[0] - a[0], dz = b[1] - a[1], len = Math.hypot(dx, dz), ry = -Math.atan2(dz, dx);
    for (const y of [0.5, 5.5]) parts.push({ geom: G.box(len, 0.15, 0.15, (a[0] + b[0]) / 2, y, (a[1] + b[1]) / 2, { ry }), mat: M.dark });
    const n = Math.round(len / 0.5);
    for (let k = 0; k <= n; k++) { const t = k / n; parts.push({ geom: G.box(0.08, 6, 0.08, a[0] + dx * t, 0, a[1] + dz * t), mat: M.dark, cast: false }); }
  }
}

/** 모임지붕(hip): rect [x0,x1,z0,z1] 을 ov 만큼 넓힌 처마, 용마루 axis('x'|'z') 방향, 경사 PITCH. fasciaH = 처마 밑 소핏/파시아 블록 높이(0 = 없음) */
function hip(ctx, rect, yE, ov, axis, fasciaH = EAVE - SOFF) {
  const { parts, M, G } = ctx;
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
  if (fasciaH > 0) parts.push({ geom: G.box(x1 - x0, fasciaH, z1 - z0, (x0 + x1) / 2, yE - fasciaH, (z0 + z1) / 2), mat: M.white });   // 소핏 + 파시아 블록
}
