// 구 간호대학 건물 (ISU School of Nursing Phase II, Ewing Miller Associates, 기록도면 1969–70)
// 8th & Chestnut 남서 모서리. OSM 에서는 way/545275293 이 "Charles E. Brown African American Cultural Center" 로 라벨되어
// 있으나 도면 외곽선이 이 폴리곤에 RMS 0.76 ft 로 일치(way/545275301 은 RMS 22 ft, 형상 불일치) → way/545275293 사용.
// 치수 근거 (도면 세트 "ISU School of Nursing Gen Const.pdf", 평면 1/8"=1'-0", 입면 1/16"=1'-0", 배치도 1"=20'):
//   sheet 1 Site Plan: 부지 140.5'×110.5', 건물 본체 111'-8"×72'-4", 남측 강의실 윙 46'×≈26' (FIN FL 495.9), 1층 FL 498'-0",
//     계단탑 내부 LANDING 496'-1½" (외부 출입문 레벨), 주변 보도 496'–497'-11"
//   sheet 3 Basement Plan: 북측 기계실 채광정(areaway) 열1~2 사이 21'-8"×4'-0" (벽 1'-0", 루버 13/3-12), 서측 채광정 5'-8"×12'-0"
//     (열 A 에서 8'-7" 남쪽, 벽 1'-0"), 동측 채광정 15'-8"×12'-0" (지하 출입 쌍문 6'-4" M.O. + 터널)
//   sheet 4 1st Floor Plan: 기둥열 1~8 @22'-0" (외벽 = 기둥열 ±10"), 열 A–B 29'-2", B–C 11'-8", C–D 30'-10",
//     계단실 No.1/No.2 가 B–C 구간에서 동·서로 6'-6" 돌출(출입문 3'-0" 은 돌출부의 북·남면, 바깥 끝에서 10"),
//     북측 로비 창벽 44'-4" (열 4·5 중심 대칭) 가 외벽선에서 5'-2" 후퇴, 열 4·5 기둥이 개구부 안에 노출:
//     2'-0" 패널 | 6'-0" 쌍문 | 3'-2" | 3'-8" | 4×EQUAL(3'-8") | 3'-8" | 3'-2" | 6'-0" 쌍문 | 2'-0" 패널
//   sheet 9 Roof Plan: 서측 계단탑 펜트하우스 (열 1 기준 서 -6'-6" ~ 동 +11'-8", B–C), MECH. OPG. ≈3'-6" 각 (x≈54.5, z≈23.3),
//     6"×4" D.S.+스플래시블록 (펜트하우스 남면 x≈3.2), 펜트하우스 동면 철제 사다리, 동측 계단실은 본체 지붕과 동일 높이
//   sheet 10 Elevations: 지하 483'-9", 1층 498'-0", 2층 510'-5¼", 3층 522'-10½", 4층 535'-3¾", 지붕 슬래브 547'-9", 계단탑 지붕 557'-1",
//     윙 지붕 509'-5¼". 1·2층은 기둥열 필라스터(≈1'-6")·2층 바닥 스팬드럴(10'-6"~12'-8")·3층 바닥 보(2'-0", 12/12-12·19/3-12)
//     가 돌출된 면, 그 사이 벽돌 인필은 후퇴. 3·4층은 평활한 상부 블록.
//   sheet 12 Wall Sections: 지붕슬래브~창 상단 4'-5¼" (→ 창 상단 545'-3¾" = +45.3'), 층 보 2'-0", 1층 창벽 착색유리 패널·9" 후퇴
//   sheet 15 Window Wall Details: 1층 창 유닛 — 상부 1'-6" 트랜섬 + 7'-11½" 본창, ¼" 브론즈 유리; 로비 창벽 문 쌍 + 트랜섬
//
// 입면 창 배치 (sheet 10, 1/16"=1'-0"; a = 벽 축 절대좌표 ft, b/t = 하단/상단 높이 ft, 1층 바닥 = 0)
//   공통: 3·4층 2개층 통창 b=24.9(3층 바닥) t=45.3; 쌍창 7'-6" (3'-6"+멀리언+3'-6", 기둥열 중심), 단창 3'-0" (모서리에서 2'-0")
//         통창 수평 프레임: 41.3, 38.6 / 4층 바닥 스팬드럴 35.5~37.4 (불투명) / 31.6, 27.9
//   북면 (동→서, Chestnut St.): 단창 [W-5,W-2]·[2,5], 쌍창 @열 7·5·4·2. 1층: 로비 개구부 x 33.67~78.0 (후퇴 창벽, 쌍문 35.67~41.67·70~76,
//         머리 10.5), 그 외 벽돌(창 없음). 2층: 창 없음. 지하: 열 1~2 사이 LOUVER BY MECH. (채광정 안)
//   남면 (서→동): 단창 [2,5]·[W-5,W-2], 쌍창 @열 2·3·6·7 (열 3·6 은 윙 위). 1·2층: 창 없음. 윙(1층, 지붕 11.44) 창 없음.
//   서면 (북→남): 단창 z [2,5]·[25.7,28.7]·[41.5,44.5]·[68,71] (계단탑 B–C 양옆 ≈1'), 1층 3등분 창 7'-6"×(0.5~10.5) @ z [2,9.5]·[21,28.5]·
//         [42,49.5]·[62.5,70]. 계단탑 면: 창 없음, 북·남면에 3'-0" 출입문.
//   동면 (남→북): 서면과 동일 배치 (대칭). 동측 계단실 돌출(지붕 높이)의 북·남면에 3'-0" 출입문. 지하 출입 쌍문은 동측 채광정 안.
// 로컬 프레임: x = 평면 오른쪽(동), z = 평면 아래(남). 원점 = 본체 북서 외곽 모서리, y=0 = 1층 바닥(498'-0") = 모델 지면.
import * as THREE from 'three';

export const meta = {
  id: 'nursing', name: 'Former School of Nursing Building', osm: 'way/545275293',
  anchor: [1034.09, 210.49], rotation: 0.157,   // tools/fit_footprint.py 결과 (RMS 0.76 ft)
  height: 49.75,
  preset: { pos: [1330, 115, 10], tgt: [1090, 10, 250] },
  sheets: 'ISU School of Nursing Gen Const: sheets 1, 3, 4, 9, 10, 12, 15',
};

// 층 높이 (ft, 1층 바닥 = 0)
const L2 = 12.44, L3 = 24.875, L4 = 37.31, ROOF = 49.75, PENT = 59.08, WING = 11.44;
const W = 111.67, D = 72.33;                 // 본체 외곽
const ZB = 29.2, ZC = 40.9, STAIR = 6.5;     // 열 B·C, 계단실 돌출
const WX0 = 32.6, WX1 = 78.6, WZ1 = 97.8;    // 강의실 윙
const COL = { 1: 0.83, 2: 22.83, 3: 38.8, 4: 44.83, 5: 66.83, 6: 72.4, 7: 88.83, 8: 110.83 };   // 기둥열 x
const Y0 = -4.0;                             // 벽 하단 (모델 지면 아래)
const LOW = 22.6;                            // 하부 블록(1·2층 인필) 상단 = 3층 바닥 보 하단
const H1 = 10.5;                             // 1층 창·로비 개구부 상단
const INSET = 0.25;                          // 1·2층 인필 벽 후퇴량
const PIER = 1.5, CORNER = 2.1;              // 필라스터 폭, 모서리 필라스터 폭
const WB = L3, WT = 45.3;                    // 3·4층 통창 하단/상단
const LOBBY0 = 33.67, LOBBY1 = 78.0, LOBBY_D = 5.17;   // 로비 창벽 후퇴 개구부
const DOOR_H = 7.0;

export const outline = [[0, 0], [0, ZB], [-STAIR, ZB], [-STAIR, ZC], [0, ZC], [0, D], [WX0, D], [WX0, WZ1], [WX1, WZ1], [WX1, D],
  [W, D], [W, ZC], [W + STAIR, ZC], [W + STAIR, ZB], [W, ZB], [W, 0]];

/** 벽 세그먼트 프레임: p0→p1 (CCW, 바깥 = 진행방향 오른쪽). a = 벽 축 절대좌표(동서벽 x, 남북벽 z), depth = 안쪽으로 */
function seg(p0, p1) {
  const dx = p1[0] - p0[0], dz = p1[1] - p0[1], len = Math.hypot(dx, dz);
  const ex = [dx / len, dz / len], n = [-dz / len, dx / len];
  const horiz = Math.abs(dx) > Math.abs(dz), start = horiz ? p0[0] : p0[1], dir = Math.sign(horiz ? dx : dz);
  const S = {
    p0, p1, len, ex, n, ry: -Math.atan2(dz, dx),
    a0: horiz ? p0[0] : p0[1], a1: horiz ? p1[0] : p1[1],     // 시작/끝점의 축좌표
    s: a => (a - start) * dir,
    pt: (a, depth = 0) => { const k = (a - start) * dir; return [p0[0] + ex[0] * k - n[0] * depth, p0[1] + ex[1] * k - n[1] * depth]; },
    inset: d => seg([p0[0] - n[0] * d, p0[1] - n[1] * d], [p1[0] - n[0] * d, p1[1] - n[1] * d]),
  };
  return S;
}

/** 세그먼트를 따라 놓인 박스: a0..a1 × y0..y1, 바깥면이 depthOut (안쪽 +) 에, 두께 thick 안쪽으로 */
function bar(parts, G, mat, S, a0, a1, y0, y1, depthOut, thick, cast = true) {
  const c = S.pt((a0 + a1) / 2, depthOut + thick / 2);
  parts.push({ geom: G.box(Math.abs(a1 - a0), y1 - y0, thick, c[0], y0, c[1], { ry: S.ry }), mat, cast });
}

/** 유리면 (벽면에서 inset 만큼 안쪽) */
function pane(parts, M, G, S, a0, a1, b, t, inset = 0.5) {
  const [lo, hi] = S.s(a0) < S.s(a1) ? [a0, a1] : [a1, a0];
  const q0 = S.pt(lo, inset), q1 = S.pt(hi, inset);
  parts.push({ geom: G.sideGeometry([q0, q1], b, t, 1 / Math.abs(a1 - a0), 1 / (t - b), false), mat: M.pane, cast: false });
}

/** 개구부가 있는 외벽 한 장. opens: [{a0,a1,b,t, fill?}] fill: 'win' 유리(기본) | 'none' | 'door' | 'louver' */
function wall(parts, M, G, S, y0, y1, opens = [], mat = M.brick_brown) {
  const openings = [];
  for (const o of opens) {
    const s0 = S.s(o.a0), s1 = S.s(o.a1);
    openings.push({ s: Math.min(s0, s1), e: Math.max(s0, s1), b: o.b, t: o.t });
    const fill = o.fill || 'win';
    if (fill === 'win') pane(parts, M, G, S, o.a0, o.a1, o.b, o.t, o.inset ?? 0.5);
    else if (fill === 'door') bar(parts, G, M.dark, S, o.a0, o.a1, o.b, o.t, 0.4, 0.15);
    else if (fill === 'louver') bar(parts, G, M.metal, S, o.a0, o.a1, o.b, o.t, 0.3, 0.2, false);
  }
  parts.push({ geom: G.wallSeg(S.p0, S.p1, y0, y1, { openings }), mat });
}

/** 3·4층 2개층 통창 (프레임 M.dark): dbl = 7'-6" 쌍창, 아니면 3'-0" 단창 */
function upperWindow(parts, M, G, S, a0, a1, dbl) {
  const f = 0.25, dep = 0.3;
  pane(parts, M, G, S, a0, a1, WB, WT, 0.5);
  bar(parts, G, M.dark, S, a0, a0 + f, WB, WT, dep, f);                 // 좌우 잼
  bar(parts, G, M.dark, S, a1 - f, a1, WB, WT, dep, f);
  bar(parts, G, M.dark, S, a0, a1, WT - f, WT, dep, f);                 // 머리
  bar(parts, G, M.dark, S, a0, a1, WB, WB + 0.3, dep, f);               // 창대
  for (const y of [41.3, 38.6, 31.6, 27.9]) bar(parts, G, M.dark, S, a0, a1, y - 0.1, y + 0.1, dep, 0.2);   // 수평 레일
  bar(parts, G, M.dark, S, a0, a1, 35.5, 37.4, dep, 0.25);               // 4층 바닥 스팬드럴 패널
  if (dbl) bar(parts, G, M.dark, S, (a0 + a1) / 2 - 0.25, (a0 + a1) / 2 + 0.25, WB, WT, dep, 0.3);   // 중앙 멀리언
}

/** 1층 3등분 창 7'-6" × (0.5~10.5), 트랜섬 8.7 (sheet 15 13/4-15) */
function lowerWindow(parts, M, G, S, a0, a1) {
  const f = 0.25, dep = 0.3, b = 0.5, t = H1;
  pane(parts, M, G, S, a0, a1, b, t, 0.5);
  const lo = Math.min(a0, a1), hi = Math.max(a0, a1);
  bar(parts, G, M.dark, S, lo, lo + f, b, t, dep, f);
  bar(parts, G, M.dark, S, hi - f, hi, b, t, dep, f);
  bar(parts, G, M.dark, S, lo, hi, t - f, t, dep, f);
  bar(parts, G, M.dark, S, lo, hi, b, b + 0.3, dep, f);
  for (const a of [lo + 3.3, lo + 5.4]) bar(parts, G, M.dark, S, a - 0.1, a + 0.1, b, t, dep, 0.2);   // 멀리언
  bar(parts, G, M.dark, S, lo, hi, 8.6, 8.8, dep, 0.2);                                                // 트랜섬 바
}

/** 하부 블록 벽 (인필은 INSET 후퇴): 벽 + 필라스터(piers: a 중심 목록) + 2층 바닥 스팬드럴 띠 + 모서리 필라스터 */
function lowerBlock(parts, M, G, S, y0, opens, { piers = [], corner0 = false, corner1 = false, band = true, wins = [] } = {}) {
  const Si = S.inset(INSET);
  // 창 개구부 (인필 면 위)
  const list = [...opens];
  for (const w of wins) list.push({ a0: w[0], a1: w[1], b: 0.5, t: H1, fill: 'none' });
  wall(parts, M, G, Si, y0, LOW, list);
  for (const w of wins) lowerWindow(parts, M, G, Si, w[0], w[1]);
  const brick = M.brick_brown, depthOut = -0.05, thick = INSET + 0.3;
  for (const a of piers) bar(parts, G, brick, S, a - PIER / 2, a + PIER / 2, y0, LOW, depthOut, thick);
  const sg = Math.sign(S.a1 - S.a0);
  if (corner0) bar(parts, G, brick, S, S.a0, S.a0 + sg * CORNER, y0, LOW, depthOut, thick);
  if (corner1) bar(parts, G, brick, S, S.a1, S.a1 - sg * CORNER, y0, LOW, depthOut, thick);
  if (band) bar(parts, G, brick, S, S.a0, S.a1, H1, 12.7, 0, INSET + 0.3);   // 2층 바닥 스팬드럴 (10'-6"~12'-8")
}

/** 상부 블록 (3·4층, 평활): 통창 목록 wins = [[a0,a1,dbl]] */
function upperBlock(parts, M, G, S, wins) {
  wall(parts, M, G, S, LOW, ROOF, wins.map(w => ({ a0: w[0], a1: w[1], b: WB, t: WT, fill: 'none' })));
  for (const w of wins) upperWindow(parts, M, G, S, w[0], w[1], w[2]);
}

/** 채광정(areaway) 피트: 외곽 x0..x1 × z0..z1, 벽 1 ft, 상단 curbTop, 바닥 floorY */
function areaway(parts, M, G, x0, x1, z0, z1, skip, curbTop = 0.4, floorY = -13) {
  const h = curbTop - floorY, t = 1.0;
  if (skip !== 'N') parts.push({ geom: G.box(x1 - x0, h, t, (x0 + x1) / 2, floorY, z0 + t / 2), mat: M.concrete });
  if (skip !== 'S') parts.push({ geom: G.box(x1 - x0, h, t, (x0 + x1) / 2, floorY, z1 - t / 2), mat: M.concrete });
  if (skip !== 'W') parts.push({ geom: G.box(t, h, z1 - z0, x0 + t / 2, floorY, (z0 + z1) / 2), mat: M.concrete });
  if (skip !== 'E') parts.push({ geom: G.box(t, h, z1 - z0, x1 - t / 2, floorY, (z0 + z1) / 2), mat: M.concrete });
  parts.push({ geom: G.box(x1 - x0, 0.5, z1 - z0, (x0 + x1) / 2, floorY - 0.5, (z0 + z1) / 2), mat: M.concrete, cast: false });
  // 노출 3면 파이프 난간 (3'-6", 기둥 ≈6' 간격)
  const rail = (ax, bx, az, bz) => {
    const L = Math.hypot(bx - ax, bz - az), nseg = Math.max(1, Math.round(L / 6));
    for (let i = 0; i <= nseg; i++) { const k = i / nseg; parts.push({ geom: G.box(0.15, 3.5, 0.15, ax + (bx - ax) * k, curbTop, az + (bz - az) * k), mat: M.metal }); }
    const c = [(ax + bx) / 2, (az + bz) / 2], ry = -Math.atan2(bz - az, bx - ax);
    for (const y of [1.6, 3.35]) parts.push({ geom: G.box(L, 0.15, 0.15, c[0], curbTop + y, c[1], { ry }), mat: M.metal });
  };
  const m = t / 2;
  if (skip !== 'N') rail(x0 + m, x1 - m, z0 + m, z0 + m);
  if (skip !== 'S') rail(x0 + m, x1 - m, z1 - m, z1 - m);
  if (skip !== 'W') rail(x0 + m, x0 + m, z0 + m, z1 - m);
  if (skip !== 'E') rail(x1 - m, x1 - m, z0 + m, z1 - m);
  // 건물 쪽(skip 면)은 지하 기초벽 (벽 하단 Y0 아래 구간)
  const fh = Y0 - floorY, ft = 0.6;
  if (skip === 'S') parts.push({ geom: G.box(x1 - x0, fh, ft, (x0 + x1) / 2, floorY, z1 + ft / 2), mat: M.concrete });
  if (skip === 'N') parts.push({ geom: G.box(x1 - x0, fh, ft, (x0 + x1) / 2, floorY, z0 - ft / 2), mat: M.concrete });
  if (skip === 'E') parts.push({ geom: G.box(ft, fh, z1 - z0, x1 + ft / 2, floorY, (z0 + z1) / 2), mat: M.concrete });
  if (skip === 'W') parts.push({ geom: G.box(ft, fh, z1 - z0, x0 - ft / 2, floorY, (z0 + z1) / 2), mat: M.concrete });
}

export function build(M, G) {
  const parts = [];
  const brick = M.brick_brown;
  const single = (c) => [c - 1.5, c + 1.5, false], dbl = (c) => [c - 3.75, c + 3.75, true];
  const upperEW = [single(3.5), single(ZB - 2.5), single(ZC + 2.1), single(D - 2.8)];     // z 축
  const lowerEW = [[2.0, 9.5], [21.0, 28.5], [42.0, 49.5], [62.5, 70.0]];
  const S = {};

  // ================= 서측면 (북→남) =================
  S.wA = seg([0, 0], [0, ZB]);
  lowerBlock(parts, M, G, S.wA, Y0, [], { corner0: true, wins: lowerEW.slice(0, 2) });
  upperBlock(parts, M, G, S.wA, upperEW.slice(0, 2));
  S.wD = seg([0, ZC], [0, D]);
  lowerBlock(parts, M, G, S.wD, Y0, [], { corner1: true, wins: lowerEW.slice(2) });
  upperBlock(parts, M, G, S.wD, upperEW.slice(2));
  // 서측 계단탑 (지면~펜트하우스 지붕), 북·남면 출입문 3'-0" (바깥 끝에서 10")
  const doorW = { a0: -STAIR + 0.8, a1: -STAIR + 3.8, b: 0, t: DOOR_H, fill: 'door' };
  wall(parts, M, G, seg([0.3, ZB], [-STAIR, ZB]), Y0, PENT, [doorW]);   // 0.3 = 인필 후퇴면까지 연장
  wall(parts, M, G, seg([-STAIR, ZB], [-STAIR, ZC]), Y0, PENT);
  wall(parts, M, G, seg([-STAIR, ZC], [0.3, ZC]), Y0, PENT, [doorW]);

  // ================= 남측면 (서→동) =================
  S.sW = seg([0, D], [WX0, D]);
  lowerBlock(parts, M, G, S.sW, Y0, [], { corner0: true, piers: [COL[2]] });
  upperBlock(parts, M, G, S.sW, [single(3.5), dbl(COL[2])]);
  S.sM = seg([WX0, D], [WX1, D]);     // 윙 위
  lowerBlock(parts, M, G, S.sM, WING, [], { piers: [COL[3], COL[6]] });
  upperBlock(parts, M, G, S.sM, [dbl(COL[3]), dbl(COL[6])]);
  S.sE = seg([WX1, D], [W, D]);
  lowerBlock(parts, M, G, S.sE, Y0, [], { corner1: true, piers: [COL[7]] });
  upperBlock(parts, M, G, S.sE, [dbl(COL[7]), single(W - 3.5)]);

  // ================= 동측면 (남→북) =================
  S.eD = seg([W, D], [W, ZC]);
  lowerBlock(parts, M, G, S.eD, Y0, [], { corner0: true, wins: lowerEW.slice(2) });
  upperBlock(parts, M, G, S.eD, upperEW.slice(2));
  S.eA = seg([W, ZB], [W, 0]);
  lowerBlock(parts, M, G, S.eA, Y0, [], { corner1: true, wins: lowerEW.slice(0, 2) });
  upperBlock(parts, M, G, S.eA, upperEW.slice(0, 2));
  // 동측 계단실 돌출 (지붕 높이까지), 북·남면 출입문
  const doorE = { a0: W + STAIR - 3.8, a1: W + STAIR - 0.8, b: 0, t: DOOR_H, fill: 'door' };
  wall(parts, M, G, seg([W - 0.3, ZC], [W + STAIR, ZC]), Y0, ROOF, [doorE]);
  wall(parts, M, G, seg([W + STAIR, ZC], [W + STAIR, ZB]), Y0, ROOF);
  wall(parts, M, G, seg([W + STAIR, ZB], [W - 0.3, ZB]), Y0, ROOF, [doorE]);

  // ================= 북측면 (동→서, Chestnut St. 정면) =================
  S.n = seg([W, 0], [0, 0]);
  lowerBlock(parts, M, G, S.n, Y0, [
    { a0: LOBBY1, a1: LOBBY0, b: Y0, t: H1, fill: 'none' },                    // 로비 후퇴 개구부
    { a0: COL[2] - 0.3, a1: COL[1], b: -12.5, t: -0.6, fill: 'louver' },        // 지하 기계실 루버 (채광정 안)
  ], { corner0: true, corner1: true, piers: [COL[7], COL[2]] });
  upperBlock(parts, M, G, S.n, [single(W - 3.5), dbl(COL[7]), dbl(COL[5]), dbl(COL[4]), dbl(COL[2]), single(3.5)]);
  lobby(parts, M, G);

  // ================= 지붕 =================
  const mainRoof = [[0, 0], [0, ZB], [-STAIR, ZB], [-STAIR, ZC], [0, ZC], [0, D], [W, D], [W, ZC], [W + STAIR, ZC], [W + STAIR, ZB], [W, ZB], [W, 0]];
  roof(parts, mainRoof, ROOF, 1.0, M, G);
  const pent = [[-STAIR, ZB], [-STAIR, ZC], [11.7, ZC], [11.7, ZB]];
  parts.push({ geom: G.sideGeometry([[0.3, ZC], [11.7, ZC], [11.7, ZB], [0.3, ZB]], ROOF, PENT, 1 / 24, 1 / 12, false), mat: brick });   // x<0 구간은 계단탑 벽이 담당
  roof(parts, pent, PENT, 0.5, M, G);
  // MECH. OPG. 환기 커브 (roof plan 1/9-9, 위치는 기계도면 기준 근사)
  parts.push({ geom: G.box(3.5, 1.5, 3.5, 54.5, ROOF, 23.3), mat: M.metal });
  parts.push({ geom: G.box(4.0, 0.6, 4.0, 54.5, ROOF + 1.5, 23.3), mat: M.dark });
  // 펜트하우스 남면 6"×4" 선홈통 + 스플래시블록, 동면 철제 사다리
  parts.push({ geom: G.box(0.5, PENT - ROOF - 0.3, 0.35, 3.2, ROOF, ZC + 0.2), mat: M.metal });
  parts.push({ geom: G.box(1.5, 0.3, 2.0, 3.2, ROOF, ZC + 1.2), mat: M.concrete });
  for (const z of [34.6, 36.1]) parts.push({ geom: G.box(0.15, PENT - ROOF + 1.5, 0.15, 11.7 + 0.5, ROOF, z), mat: M.metal });
  for (let y = ROOF + 1; y < PENT; y += 1.2) parts.push({ geom: G.box(0.12, 0.12, 1.5, 11.7 + 0.5, y, 35.35), mat: M.metal });

  // ================= 남측 강의실 윙 (1층, 경사 바닥 강의실, 창 없음) =================
  wall(parts, M, G, seg([WX0, D - 0.3], [WX0, WZ1]), Y0, WING);
  wall(parts, M, G, seg([WX0, WZ1], [WX1, WZ1]), Y0, WING);
  wall(parts, M, G, seg([WX1, WZ1], [WX1, D - 0.3]), Y0, WING);
  roof(parts, [[WX0, D], [WX0, WZ1], [WX1, WZ1], [WX1, D]], WING, 0.8, M, G);

  // ================= 채광정 (sheet 3): 북 21'-8"×4'-0", 서 5'-8"×12'-0", 동 15'-8"×12'-0" (벽 1'-0") =================
  areaway(parts, M, G, COL[1] - 1.0, COL[2] + 0.7, -5.0, 0.25, 'S');
  areaway(parts, M, G, -7.7, 0.25, 9.4, 23.4, 'E');
  areaway(parts, M, G, W - 0.25, W + 16.7, 9.4, 22.1, 'W');
  // 지하 출입 쌍문 (동측 채광정 안, 6'-4" M.O. + 트랜섬) — 동면 지하 벽에
  bar(parts, G, M.dark, S.eA, 12.4, 18.8, -13.0, -4.5, 0.3, 0.2, false);

  // ================= 북측 보도 (배치도: 건물~Chestnut 보도 사이 14'-0" 콘크리트) =================
  parts.push({ geom: G.box(W + 2 * STAIR + 4, 0.12, 9.0, W / 2, -0.1, -9.5), mat: M.walk, cast: false });
  parts.push({ geom: G.box(W - COL[2] - 1.0, 0.12, 5.0, (W + COL[2] + 1.0) / 2, -0.1, -2.5), mat: M.walk, cast: false });

  const grp = new THREE.Group();
  for (const m of G.mergeByMaterial(parts)) grp.add(m);
  return grp;
}

/** 북측 로비: 5'-2" 후퇴 창벽 (44'-4", 브론즈 유리), 쌍문 2개소 + 트랜섬, 노출 기둥 열 4·5, 천장(2층 슬래브 하부), 바닥 */
function lobby(parts, M, G) {
  const z = LOBBY_D, x0 = LOBBY0, x1 = LOBBY1, mid = (x0 + x1) / 2, len = x1 - x0;
  // 창벽 유리 (북향)
  parts.push({ geom: G.sideGeometry([[x1, z], [x0, z]], 0, H1, 1 / 24, 1 / H1, false), mat: M.pane, cast: false });
  // 멀리언 (평면 분할: 2'-0" | 6'-0" | 3'-2" | 3'-8" | 4×3'-8" | 3'-8" | 3'-2" | 6'-0" | 2'-0")
  const joints = [x0, x0 + 2, x0 + 8, COL[4], COL[4] + 3.67, COL[4] + 7.33, COL[4] + 11, COL[4] + 14.67, COL[5], COL[5] + 3.17, COL[5] + 9.17, x1];
  for (const x of joints) parts.push({ geom: G.box(0.25, H1, 0.3, x, 0, z), mat: M.dark });
  parts.push({ geom: G.box(len, 0.3, 0.3, mid, H1 - 0.3, z), mat: M.dark });        // 머리
  parts.push({ geom: G.box(len, 0.5, 0.3, mid, 0, z), mat: M.dark });               // 하부 레일
  for (const [d0, d1] of [[x0 + 2, x0 + 8], [COL[5] + 3.17, COL[5] + 9.17]]) {     // 쌍문: 트랜섬 바, 중앙 스타일, 킥플레이트
    const c = (d0 + d1) / 2;
    parts.push({ geom: G.box(d1 - d0, 0.25, 0.3, c, DOOR_H, z), mat: M.dark });
    parts.push({ geom: G.box(0.2, DOOR_H, 0.3, c, 0, z), mat: M.dark });
    parts.push({ geom: G.box(d1 - d0, 0.8, 0.3, c, 0.5, z), mat: M.dark });
  }
  for (const [p0, p1] of [[x0, x0 + 2], [x1 - 2, x1]])                               // 2'-0" 불투명 패널
    parts.push({ geom: G.box(p1 - p0, H1, 0.15, (p0 + p1) / 2, 0, z + 0.1), mat: M.dark });
  // 후퇴부 측벽 (벽돌), 천장, 바닥
  parts.push({ geom: G.wallSeg([x0, z], [x0, INSET], 0, H1), mat: M.brick_brown });
  parts.push({ geom: G.wallSeg([x1, INSET], [x1, z], 0, H1), mat: M.brick_brown });
  parts.push({ geom: G.box(len, 0.3, z - INSET, mid, H1, (z + INSET) / 2), mat: M.paintWhite, cast: false });
  parts.push({ geom: G.box(len, 0.2, z - 0.3, mid, -0.15, (z + 0.3) / 2), mat: M.walk, cast: false });
  // 노출 기둥 열 4·5 (1'-4" 각, 외벽선 위)
  for (const x of [COL[4], COL[5]]) parts.push({ geom: G.box(1.3, H1 - Y0, 1.3, x, Y0, 0.65), mat: M.brick_brown });
}

function roof(parts, poly, y, parapet, M, G) {
  const r = G.flatRoof(poly, y, { parapet, thick: 0.6 });
  parts.push({ geom: r.slab, mat: M.roof_membrane });
  if (r.parapet) parts.push({ geom: r.parapet, mat: M.concrete });
}
