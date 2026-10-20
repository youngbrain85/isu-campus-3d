// 구 간호대학 건물 (ISU School of Nursing Phase II, Ewing Miller Associates, 기록도면 1969–70)
// 8th & Chestnut 남서 모서리. OSM 에서는 way/545275293 이 "Charles E. Brown African American Cultural Center" 로 라벨되어
// 있으나 도면 외곽선이 이 폴리곤에 RMS 0.76 ft 로 일치(way/545275301 은 RMS 22 ft, 형상 불일치) → way/545275293 사용.
// 치수 근거 (도면 세트 "ISU School of Nursing Gen Const.pdf", 평면 1/8"=1'-0", 입면 1/16"=1'-0", 배치도 1"=20'):
//   sheet 1 Site Plan: 부지 140.5'×110.5', 건물 본체 111'-8"×72'-4", 남측 강의실 윙 46'×≈26' (FIN FL 495.9), 1층 FL 498'-0"
//   sheet 4 1st Floor Plan: 기둥열 1~8 @22'-0" (전체 111'-8", 외벽 = 기둥열 ±10"), 열 A–B 29'-2", B–C 11'-8", C–D 30'-10"
//     (전체 72'-4"), 계단실 No.1/No.2 가 B–C 구간에서 동·서로 6'-6" 돌출, 강의실 44'-4" 폭 (열 3–6) 남측 돌출, 북측 중앙 로비 출입구 2개
//   sheet 9 Roof Plan: 서측 계단탑 펜트하우스 (열 1 기준 서 -6'-6" ~ 동 +11'-8", B–C), 동측 계단실은 본체 지붕과 동일 높이
//   sheet 10 Elevations: 지하 483'-9", 1층 498'-0", 2층 510'-5¼", 3층 522'-10½", 4층 535'-3¾", 지붕 슬래브 547'-9", 계단탑 지붕 557'-1",
//     윙 지붕 509'-5¼"; 3·4층 2개층 통창 (7' 폭 쌍창, 기둥열 중심, 끝단 3' 단창), 1·2층 면벽돌(1층 동·서면 7'×10' 창 4개, 북면 출입문 2개)
// 로컬 프레임: x = 평면 오른쪽(동), z = 평면 아래(남). 원점 = 본체 북서 외곽 모서리, y=0 = 1층 바닥(498'-0").
import * as THREE from 'three';

export const meta = {
  id: 'nursing', name: 'Former School of Nursing Building', osm: 'way/545275293',
  anchor: [1034.09, 210.49], rotation: 0.157,   // tools/fit_footprint.py 결과 (RMS 0.76 ft)
  height: 49.75,
  preset: { pos: [1330, 115, 10], tgt: [1090, 10, 250] },
  sheets: 'ISU School of Nursing Gen Const: sheets 1, 4, 9, 10',
};

// 층 높이 (ft, 1층 바닥 = 0)
const L2 = 12.44, L3 = 24.875, L4 = 37.31, ROOF = 49.75, PENT = 59.08, WING = 11.44;
const W = 111.67, D = 72.33;                 // 본체 외곽
const ZB = 29.2, ZC = 40.9, STAIR = 6.5;     // 열 B·C, 계단실 돌출
const WX0 = 32.6, WX1 = 78.6, WZ1 = 97.8;    // 강의실 윙
const COLS = [0.83, 22.83, 44.83, 66.83, 88.83, 110.83];   // 기둥열 1,2,4,5,7,8 (x)
const WB = 24.0, WT = 45.0;                  // 3·4층 통창 하단/상단

export const outline = [[0, 0], [0, ZB], [-STAIR, ZB], [-STAIR, ZC], [0, ZC], [0, D], [WX0, D], [WX0, WZ1], [WX1, WZ1], [WX1, D],
  [W, D], [W, ZC], [W + STAIR, ZC], [W + STAIR, ZB], [W, ZB], [W, 0]];

/** 개구부가 있는 외벽 한 장. opens: [{a0,a1,b,t,mull?}] — a = 벽 축 방향의 절대 좌표(동서벽은 x, 남북벽은 z) */
function facade(parts, M, G, p0, p1, y0, y1, opens = []) {
  const dx = p1[0] - p0[0], dz = p1[1] - p0[1], len = Math.hypot(dx, dz);
  const ex = [dx / len, dz / len], nx = -dz / len, nz = dx / len;          // 진행 방향, 바깥 법선
  const horiz = Math.abs(dx) > Math.abs(dz), start = horiz ? p0[0] : p0[1], dir = horiz ? Math.sign(dx) : Math.sign(dz);
  const openings = [];
  for (const o of opens) {
    const s0 = (o.a0 - start) * dir, s1 = (o.a1 - start) * dir, s = Math.min(s0, s1), e = Math.max(s0, s1);
    openings.push({ s, e, b: o.b, t: o.t });
    const q = k => [p0[0] + ex[0] * k - nx * 0.5, p0[1] + ex[1] * k - nz * 0.5];
    parts.push({ geom: G.sideGeometry([q(s), q(e)], o.b, o.t, 1 / (e - s), 1 / (o.t - o.b), false), mat: M.pane, cast: false });
    if (o.mull) {   // 쌍창 중앙 멀리언 + 4층 바닥선 스팬드럴
      const c = q((s + e) / 2);
      parts.push({ geom: G.box(0.6, o.t - o.b, 0.4, c[0], o.b, c[1], { ry: -Math.atan2(dz, dx) }), mat: M.dark });
      parts.push({ geom: G.box(e - s, 1.6, 0.4, c[0], L4 - 1.0, c[1], { ry: -Math.atan2(dz, dx) }), mat: M.dark });
    }
  }
  parts.push({ geom: G.wallSeg(p0, p1, y0, y1, { openings }), mat: M.brick_brown });
}

export function build(M, G) {
  const parts = [];
  const Y0 = -1.0;   // 지면(≈496') 아래로 약간 연장
  // 3·4층 통창: 기둥열 중심 7' 쌍창 + 양끝 3' 단창 (북·남면), 열 A/B/C/D 근처 3' 단창 (동·서면)
  const upperNS = [{ a0: 1.5, a1: 4.5 }, { a0: W - 4.5, a1: W - 1.5 }, ...COLS.slice(1, 5).map(x => ({ a0: x - 3.5, a1: x + 3.5, mull: true }))]
    .map(o => ({ ...o, b: WB, t: WT }));
  const upperEW = [[1.1, 4.0], [26.5, 29.4 - 0.5], [43.0, 46.0], [68.4, 71.3]].map(([a0, a1]) => ({ a0, a1, b: WB, t: WT }));
  const lowerEW = [[1.5, 8.8], [22.0, 29.0], [41.2, 48.5], [64.0, 71.3]].map(([a0, a1]) => ({ a0, a1, b: 0.5, t: 10.5 }));

  // ---- 서측면 (북→남): 계단실 돌출(펜트하우스까지) 사이로 분할
  facade(parts, M, G, [0, 0], [0, ZB], Y0, ROOF, [...upperEW.slice(0, 2), ...lowerEW.slice(0, 2)]);
  facade(parts, M, G, [0, ZB], [-STAIR, ZB], Y0, PENT);
  facade(parts, M, G, [-STAIR, ZB], [-STAIR, ZC], Y0, PENT, [{ a0: ZB + 2.5, a1: ZB + 9.2, b: 0, t: 8, }]);
  facade(parts, M, G, [-STAIR, ZC], [0, ZC], Y0, PENT);
  facade(parts, M, G, [0, ZC], [0, D], Y0, ROOF, [...upperEW.slice(2), ...lowerEW.slice(2)]);
  // ---- 남측면 (서→동): 윙 양옆 + 윙 위쪽
  facade(parts, M, G, [0, D], [WX0, D], Y0, ROOF, [{ a0: 1.5, a1: 4.5, b: WB, t: WT }, { a0: 22.83 - 3.5, a1: 22.83 + 3.5, b: WB, t: WT, mull: true }]);
  facade(parts, M, G, [WX0, D], [WX1, D], WING, ROOF, [{ a0: 39.4 - 3.5, a1: 39.4 + 3.5, b: WB, t: WT, mull: true }, { a0: 72.0 - 3.5, a1: 72.0 + 3.5, b: WB, t: WT, mull: true }]);
  facade(parts, M, G, [WX1, D], [W, D], Y0, ROOF, [{ a0: 88.83 - 3.5, a1: 88.83 + 3.5, b: WB, t: WT, mull: true }, { a0: W - 4.5, a1: W - 1.5, b: WB, t: WT }]);
  // ---- 동측면 (남→북): 계단실 No.2 돌출 (지붕 높이까지), 1층 출입문
  facade(parts, M, G, [W, D], [W, ZC], Y0, ROOF, [...upperEW.slice(2), ...lowerEW.slice(2)]);
  facade(parts, M, G, [W, ZC], [W + STAIR, ZC], Y0, ROOF);
  facade(parts, M, G, [W + STAIR, ZC], [W + STAIR, ZB], Y0, ROOF, [{ a0: ZB + 2.5, a1: ZB + 9.2, b: 0, t: 8 }]);
  facade(parts, M, G, [W + STAIR, ZB], [W, ZB], Y0, ROOF);
  facade(parts, M, G, [W, ZB], [W, 0], Y0, ROOF, [...upperEW.slice(0, 2), ...lowerEW.slice(0, 2)]);
  // ---- 북측면 (동→서, Chestnut St 정면): 3·4층 통창 + 1층 로비 출입문 2개 (유리문 + 트랜섬)
  facade(parts, M, G, [W, 0], [0, 0], Y0, ROOF, [...upperNS, { a0: 34.3, a1: 42.3, b: 0, t: 10.4 }, { a0: 69.3, a1: 77.3, b: 0, t: 10.4 }]);
  // 출입구 캐노피 (얕은 콘크리트 차양)
  for (const cx of [38.3, 73.3]) parts.push({ geom: G.box(11, 0.7, 5, cx, 10.4, -2.5), mat: M.concrete });

  // ---- 본체 지붕 (계단실 돌출 포함, 윙 제외) + 서측 계단탑 펜트하우스
  const mainRoof = [[0, 0], [0, ZB], [-STAIR, ZB], [-STAIR, ZC], [0, ZC], [0, D], [W, D], [W, ZC], [W + STAIR, ZC], [W + STAIR, ZB], [W, ZB], [W, 0]];
  roof(parts, mainRoof, ROOF, 1.0, M, G);
  const pent = [[-STAIR, ZB], [-STAIR, ZC], [11.7, ZC], [11.7, ZB]];
  parts.push({ geom: G.sideGeometry([[0, ZC], [11.7, ZC], [11.7, ZB], [0, ZB]], ROOF, PENT, 1 / 24, 1 / 12, false), mat: M.brick_brown });   // x<0 구간은 계단실 돌출벽이 담당
  roof(parts, pent, PENT, 0.5, M, G);
  // 지붕 기계 개구 (중앙) 작은 큐브
  parts.push({ geom: G.box(4, 2.5, 4, 55.8, ROOF, 36), mat: M.metal });

  // ---- 남측 강의실 윙 (1층, 경사 바닥 강의실, 창 없음)
  facade(parts, M, G, [WX0, D], [WX0, WZ1], Y0, WING);
  facade(parts, M, G, [WX0, WZ1], [WX1, WZ1], Y0, WING);
  facade(parts, M, G, [WX1, WZ1], [WX1, D], Y0, WING);
  roof(parts, [[WX0, D], [WX0, WZ1], [WX1, WZ1], [WX1, D]], WING, 0.8, M, G);

  // ---- 동·서 측면 출입 계단 랜딩 (배치도 LANDING 496'-1½")
  parts.push({ geom: G.box(5, 0.6, 10, -STAIR - 2.5, -0.6, (ZB + ZC) / 2), mat: M.walk, cast: false });
  parts.push({ geom: G.box(5, 0.6, 10, W + STAIR + 2.5, -0.6, (ZB + ZC) / 2), mat: M.walk, cast: false });

  const grp = new THREE.Group();
  for (const m of G.mergeByMaterial(parts)) grp.add(m);
  return grp;
}

function roof(parts, poly, y, parapet, M, G) {
  const r = G.flatRoof(poly, y, { parapet, thick: 0.6 });
  parts.push({ geom: r.slab, mat: M.roof_membrane });
  if (r.parapet) parts.push({ geom: r.parapet, mat: M.concrete });
}
