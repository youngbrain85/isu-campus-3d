// Student Recreation Center — Hastings+Chivetta, 프로젝트 2817 (2007 시공도, 2009 준공)
// 치수 근거 (도면 세트 "Student Rec Ctr Record Drawings", 평면 1/16" = 1'-0", 스캔 도면이라 눈으로 읽음):
//   A2.01/A2.02 1·2층 참조 평면: 열 그리드 1→18.1 = 320' (베이 21'-4" 기본, 10'-8"/19'-4" 등), 행 그리드 A2→M = 280'
//     (D~K 30' 베이, C·D 20', B→A6 11'-8", A6→A2 18'-4"), 외벽은 그리드 바깥 2'-0". 북쪽 화살표 = 평면 아래쪽.
//     SW 모서리 자연채광 수영장(leisure pool)의 원호 커튼월: 중심 (193,137), 반경 106' (위성영상 대조로 보정), 메인 출입구
//     vestibule 145 = 그리드 11~10 남측, 남/북 AL-44 돌출 유리 베이 그리드 15~13.
//   A2.03 지붕 평면: 체육관(3-court gym, 그리드 17~12 × 행 D~K) 박공 3":12" 남북 용마루, 피트니스(그리드 8~1 × 행 F~H)
//     박공 3":12" 동서 용마루, 나머지 평지붕(막 방수) 코핑 EL 131'-8"~132'-0", 냉동기 마당(chiller yard) 그리드 4~2 행 H8~K,
//     콩코스 상부 반투명 패널 천창(행 H~H.8, 그리드 10.8~10), 출입 vestibule 경사 지붕(slope varies, 금속 복합패널 코핑).
//   A4.01/A4.02 외부 입면 (1/16"): 1층 100'-0", 2층 114'-0", 난간 상단 132'-0"(일반)·136'-0"(체육관 처마·동측 x=6 돌출부),
//     벽돌 베이스(type A) + 중앙부 type C 벽돌 필드(특수형 벽돌 jamb type D) + 금속 복합패널 돌출 베이(AL-44/45/42)
//     + EIFS 클리어스토리 띠(피트니스 AL-50/AL-48, 체육관 박공면 AL-47/49 반투명 유리) + 원호 커튼월(type E 벽돌 필라스터·곡면 코니스).
//   A4.03~A4.05 건물 단면: 체육관 상부 철골 135'-9½", 최고점 147'-8"; 피트니스 상부 철골 129'-0", 최고점 145'-8";
//     MAC gym 상부 조적 131'-8"; 북서쪽 행 M~L 1층부 난간 114'-0".
// 로컬 프레임: 평면도 기준 x = 오른쪽(= 서), z = 아래(= 북). 원점 = 그리드 18.1 / 행 A2 교차점. y = 0 = 1층 바닥(100'-0").
//
// ───────── 입면 창 배치 (A4.01/A4.02 를 300 dpi 로 읽어 피트 눈금을 겹쳐 판독, ±1 ft) ─────────
// 높이(EL): 1층 100, 2층 114, 난간 132, 체육관 처마벽 136, 용마루 147.7 / 피트니스 처마 138, 용마루 145.7
// [남측 z=-2 (사무동, x 16.67~125)]  벽돌 A, 중앙 x 38~101 벽돌 C 필드 + jamb 스트립 1.5'
//   AL-21A/AL-21 쌍 x 23~34.5, 108~119 (상 114~121.3 / 하 100.5~109.3, 3분할)
//   AL-22 ×3 x 45.7~55.9, 65.5~77.2, 86.8~96.9 (102~109, 2×2)      AL-44 돌출 유리베이 x 52~90 (110.5~131, 유리 110.5~125, 패널 125~131, 4.5' 돌출)
//   소일저코스 114, 벽돌 밴드 B 110·120.5·128.5
// [남측 vestibule z=-12 (x 125~153)]  금속패널 타워 x 125~132 (~140.5, 슬롯창 AL-35), AL-34 커튼월 x 132~153 (100~126), 캐노피 EL 108.5
//   서측 x=153: AL-33 커튼월 z -12~32 + 캐노피.  경사 지붕 136→140.5 (slope varies)
// [남측 z≈31.5 (x 153~193)] 벽돌 A, AL-19 2층 스토어프론트 x 156.5~168.4 (100.5~124.5), AL-18A/18 쌍 x 175~187
// [원호 커튼월 (193,31)~(298.6,128)] 베이 ≈15.7' ×10: type E 필라스터 3.5' + 2층 유리 (100.5~112.3 / 114~121.6, 스팬드럴 112.3~114),
//   소일저 린텔 121.6~124.5, 벽돌 124.5~132, 곡면 코니스 131~132
// [서측 x=321 (피트니스, z 128~192)] 벽돌 A, AL-42 돌출 베이 z 137~184 (110.5~132.4, 유리 114.3~125.5, 4.5' 돌출), ML-5 루버 z 155~167 (105~109.5)
//   박공면 AL-51 반투명 유리 132~용마루, EIFS 레이크 띠
// [서측 x=302 (z 192~281)] 벽돌 A, 문 z 200.5~203.7 / 229~235(쌍) / 252.6~258.4(쌍), ML-6 루버 z 222.6~226.6 (107~109.5)
//   지붕 위: 금속패널 펜트하우스 x 289~302 z 262~281 (132~140, AL-48 EIFS 띠), 코핑 박스 z 194~205 (132~136)
// [북측 z=192 / z=128 피트니스 클리어스토리 (x 174.67~321, 132~138, EIFS)]  남: AL-50 11.5' 중심 186, 207.5, 228, 249.5, 271 + AL-48 310.5
//   북: AL-50 14' 중심 179.5, 199.5, 224, 245.5, 266 + AL-48 310.5  (창 133~136.5, 2분할)
// [북측 z=260.67 2층면 (x 153~262, 1층동 지붕 위)]  AL-40 x 164~172, 237.5~244.5 (3분할) / AL-41 x 177.5~189.5, 200.5~211, 220~232.5 (114~121.3)
// [북측 z=281 1층동 (x 153~262, 난간 114)]  AL-28 x 163~171.6 (100.5~109, 2×2), AL-29 x 178~189.5, 200.5~211 (104~109, 3분할),
//   오버헤드도어 x 220.5~232 (100~109.5), 문 x 240.8~243.7.   x 262~302 는 2층 (난간 132, 창 없음)
// [북측 z=281 2층동 (x 17~153)] 벽돌 A, 중앙 x 38~101 벽돌 C 필드
//   AL-25A 출입구 x 21~32, 108~119 (하 100~109.7 문+사이드라이트+트랜섬 / 상 114.5~122)   AL-44 돌출 베이 x 52~90 (남측과 동일)
//   ML-3 루버 x 50~62, 76~88 (106~110.5), 문 x 65~72 (100~107.5)
//   AL-26A 2층 유리 x 124~131 (100~125, 패널 125~131, 캐노피 108.5, 문)   AL-27A/27 쌍 x 136~148.5
// [동측 x=-2 (z 18.33~70)] 벽돌 A, ML-2 루버 z 37.6~48.2 (104~108.5), AL-45 출입구 z 51~67 (100~110 스토어프론트, 문 55.5~61.3)
//   + 돌출 베이 z 51~70.5 (110~131, 유리 115~125, 4' 돌출).  x=6 (z 70~97.5, 220~248) 난간 136, 문 z 71~74 / 243.6~246.8
// [동측 x=17 체육관 (z 97.5~220)] 벽돌 A, z 129~190 벽돌 C 필드; AL-21A/21 쌍 z 108.4~119.7, 138.4~150.3, 168.6~180.5, 199~211
//   처마 EIFS 띠 132~136, 박공면(남 z=70 AL-47 / 북 z=250 AL-49) 반투명 유리 132~레이크, 멀리언 ≈5.3'
// [동측 z=18.33 (x -2~16.67)] 벽돌 A, ML-1 루버 x 4~9.5 (114~121)
import * as THREE from 'three';

export const meta = {
  id: 'rec', name: 'Student Recreation Center', osm: 'way/544686559',
  anchor: [395.39, -977.84], rotation: 179.535,   // tools/fit_footprint.py 결과 (RMS 4.8 ft)
  height: 47.7,
  preset: { pos: [120, 170, -720], tgt: [240, 10, -1080] },
  sheets: '2817 A2.01, A2.02, A2.03, A4.01, A4.02, A4.03, A4.04, A4.05 (+ esri 위성영상 대조)',
};

const H2 = 32, H1 = 14, H36 = 36;            // 2층부 난간 상단, 1층부 난간 상단, 136' 난간 (ft)
const GYM = { x0: 17, x1: 123.33, z0: 70, z1: 250, eave: 34.5, ridge: 47.7 };   // 3-court gymnasium (지붕면 처마 134.5, 처마벽 136)
const FIT = { x0: 174.67, x1: 321, z0: 128, z1: 192, eave: 38, ridge: 45.7 };   // fitness center (클리어스토리 132~138 + 박공)
const CHILL = [[263, 210], [263, 246], [293, 246], [293, 210]];                // 냉동기 마당 (평면 CCW, 지붕 구멍)
const WING = { x0: 153, x1: 262, z0: 260.67, z1: 281 };                        // 북서 1층동 (x 262~302 는 2층)
const VEST = { x0: 125, x1: 153, z0: -12, z1: 32, tower: 132 };                // 출입 vestibule, 금속패널 타워 x 125~132

// 원호 커튼월 (SW 모서리): 중심 (193,137) r=106, -90° → -4.9°
const ARC = [[193.0, 31.0], [208.7, 32.2], [224.0, 35.6], [238.7, 41.4], [252.4, 49.2], [264.7, 58.9], [275.5, 70.4], [284.4, 83.3], [291.4, 97.5], [296.1, 112.5], [298.6, 128.0]];

export const outline = [[16.67, 18.33], [-2, 18.33], [-2, 70], [6, 70], [6, 97.5], [17, 97.5], [17, 220], [6, 220], [6, 248], [17, 248], [17, 281], [302, 281], [302, 192], [321, 192], [321, 128], [302, 128],
  ...[...ARC].reverse(), [153, 32], [153, -12], [125, -12], [125, -2], [16.67, -2]];

export function build(M, G) {
  const parts = [];
  const brickA = M.brick_red, brickC = M.brick_tan, brickD = M.brick_brown, eifs = M.white, metal = M.metal;
  const push = (geom, mat, cast = true) => parts.push({ geom, mat, cast });

  // ---------- 헬퍼: 벽 방향 기저 ----------
  const basis = (p0, p1) => {
    const dx = p1[0] - p0[0], dz = p1[1] - p0[1], len = Math.hypot(dx, dz);
    return { ex: [dx / len, dz / len], n: [-dz / len, dx / len], len, ry: -Math.atan2(dz, dx) };   // n = 바깥 법선
  };
  /** 유리면 + 멀리언. q0,q1 = 유리면 양 끝 (x,z), b..t 높이, cols/rows 분할, mat 유리 재질, out = 멀리언이 놓일 바깥 방향 */
  const glaze = (q0, q1, b, t, cols, rows, mat, out, ry) => {
    push(G.sideGeometry([q0, q1], b, t, 1 / Math.hypot(q1[0] - q0[0], q1[1] - q0[1]), 1 / (t - b), false), mat, false);
    const dx = q1[0] - q0[0], dz = q1[1] - q0[1], len = Math.hypot(dx, dz), ex = [dx / len, dz / len];
    const mull = [];
    for (let c = 1; c < cols; c++) {
      const s = len * c / cols, cx = q0[0] + ex[0] * s + out[0] * 0.15, cz = q0[1] + ex[1] * s + out[1] * 0.15;
      mull.push(G.box(0.25, t - b, 0.3, cx, b, cz, { ry }));
    }
    for (let r = 1; r < rows; r++) {
      const y = b + (t - b) * r / rows, cx = q0[0] + ex[0] * len / 2 + out[0] * 0.15, cz = q0[1] + ex[1] * len / 2 + out[1] * 0.15;
      mull.push(G.box(len, 0.3, 0.3, cx, y - 0.15, cz, { ry }));
    }
    for (const m of mull) push(m, M.dark);
  };
  /**
   * 벽 한 장 + 개구. wins = [{s,e,b,t, kind:'win'|'door'|'louver'|'solid', cols, rows, mat}]
   * s..e 는 p0 로부터의 거리, b..t 절대 높이. bands = [y0,h] 목록 (0.15' 돌출 벽돌 밴드, 개구 구간은 건너뜀)
   */
  const wall = (p0, p1, y0, y1, mat, wins = [], bands = []) => {
    const { ex, n, len, ry } = basis(p0, p1);
    // 개구가 벽 가장자리에 닿으면 삼각분할이 깨지므로 0.05' 안쪽으로 조인다 (유리면은 원래 치수 유지)
    const op = wins.map(w => ({ s: Math.max(w.s, 0.05), e: Math.min(w.e, len - 0.05), b: Math.max(w.b, y0 + 0.05), t: Math.min(w.t, y1 - 0.05) }));
    push(G.wallSeg(p0, p1, y0, y1, { openings: op }), mat);
    for (const w of wins) {
      const kind = w.kind || 'win';
      const ins = kind === 'win' ? 0.5 : 0.3;
      const q = s => [p0[0] + ex[0] * s - n[0] * ins, p0[1] + ex[1] * s - n[1] * ins];
      if (kind === 'louver' || kind === 'solid') {
        push(G.sideGeometry([q(w.s), q(w.e)], w.b, w.t, 1 / 4, 1 / 4, false), w.mat || M.dark, false);
      } else {
        glaze(q(w.s), q(w.e), w.b, w.t, w.cols || 1, w.rows || 1, w.mat || M.pane, n, ry);
      }
    }
    for (const [by, bh] of bands) {
      // 개구와 겹치는 구간 제외
      const cuts = wins.filter(w => w.t > by && w.b < by + bh).map(w => [w.s, w.e]).sort((a, b) => a[0] - b[0]);
      let s = 0;
      const segs = [];
      for (const [cs, ce] of cuts) { if (cs > s + 0.3) segs.push([s, cs]); s = Math.max(s, ce); }
      if (len > s + 0.3) segs.push([s, len]);
      for (const [a, b] of segs) {
        const cx = p0[0] + ex[0] * (a + b) / 2 + n[0] * 0.075, cz = p0[1] + ex[1] * (a + b) / 2 + n[1] * 0.075;
        push(G.box(b - a, bh, 0.15, cx, by, cz, { ry }), brickD, false);
      }
    }
  };
  /** 돌출 유리 베이: 벽 p0→p1 의 s..e 구간, b..t 높이, depth 만큼 바깥으로. 전면: 유리 gb..gt, 그 외 금속패널 */
  const bay = (p0, p1, s, e, b, t, depth, gb, gt, cols, rows) => {
    const { ex, n, ry } = basis(p0, p1);
    const mid = (s + e) / 2;
    push(G.box(e - s, t - b, depth, p0[0] + ex[0] * mid + n[0] * depth / 2, b, p0[1] + ex[1] * mid + n[1] * depth / 2, { ry }), metal);
    const q = u => [p0[0] + ex[0] * u + n[0] * (depth + 0.02), p0[1] + ex[1] * u + n[1] * (depth + 0.02)];
    glaze(q(s + 0.5), q(e - 0.5), gb, gt, cols, rows, M.pane, n, ry);
  };
  /** 수직 멀리언 열 (박공 유리면 등): 벽 p0→p1 의 거리 s 에 높이 b..t */
  const stick = (p0, p1, s, b, t, out, ry) => {
    const { ex } = basis(p0, p1);
    push(G.box(0.3, t - b, 0.3, p0[0] + ex[0] * s + out[0] * 0.15, b, p0[1] + ex[1] * s + out[1] * 0.15, { ry }), M.dark);
  };
  const pairWin = (s, w) => [                                   // AL-21A/AL-21 식 상하 창 쌍 (s = 시작 거리, w = 폭)
    { s, e: s + w, b: 14, t: 21.3, cols: 3 }, { s, e: s + w, b: 0.5, t: 9.3, cols: 3, rows: 2 }];
  const BANDS2 = [[13.5, 1], [9.5, 0.7], [20, 0.7], [28, 0.7]];   // 소일저코스 114 + 벽돌 밴드 B 110/120.5/128.5
  const flat = (poly, y, holes = [], parapet = 1.0) => {
    const r = G.flatRoof(poly, y, { parapet, thick: 0.6, holes });
    push(r.slab, M.roof_membrane); if (r.parapet) push(r.parapet, M.trim);
  };

  // ======================= 남측 (z=-2 사무동) =======================
  // 벽돌 A | C 필드 x 38~101 | A — 세 장으로 나눔. s 는 x=125 에서 서→동으로 잰 거리 (s = 125 - x)
  wall([125, -2], [101, -2], 0, H2, brickA, [...pairWin(125 - 119, 11)], BANDS2);
  wall([101, -2], [38, -2], 0, H2, brickC, [
    { s: 101 - 96.9, e: 101 - 86.8, b: 2, t: 9, cols: 2, rows: 2 },        // AL-22
    { s: 101 - 77.2, e: 101 - 65.5, b: 2, t: 9, cols: 2, rows: 2 },
    { s: 101 - 55.9, e: 101 - 45.7, b: 2, t: 9, cols: 2, rows: 2 },
  ], BANDS2);
  wall([38, -2], [16.67, -2], 0, H2, brickA, [...pairWin(38 - 34.5, 11.5)], BANDS2);
  bay([125, -2], [16.67, -2], 125 - 90, 125 - 52, 10.5, 31, 4.5, 11, 25, 8, 3);                 // AL-44 돌출 유리 베이
  for (const x of [101, 36.5, 119.5, 21.5]) push(G.box(1.5, H2, 0.2, x + 0.75, 0, -2.1), brickD);   // 특수형 벽돌 jamb (type D)
  // 남동 리턴 (z=18.33, x -2~16.67: ML-1 루버) 와 x=16.67 면
  wall([16.67, 18.33], [-2, 18.33], 0, H2, brickA, [{ s: 16.67 - 9.5, e: 16.67 - 4, b: 14, t: 21, kind: 'louver' }], BANDS2);
  wall([16.67, -2], [16.67, 18.33], 0, H2, brickA, [], BANDS2);

  // ======================= 출입 vestibule (x 125~153, z -12~32) =======================
  const T = VEST.tower;
  wall([125, -12], [125, -2], 0, 40.5, metal);                                                  // 타워 동측면
  wall([153, -12], [T, -12], 0, 36, metal, [{ s: 0, e: 153 - T, b: 0, t: 26, kind: 'door', cols: 5, rows: 3 }]);   // AL-34 커튼월
  wall([T, -12], [125, -12], 0, 40.5, metal, [{ s: 2, e: 4, b: 3, t: 21, kind: 'door', cols: 1, rows: 4 }]);         // 타워 + AL-35 슬롯창
  wall([153, 32], [153, -12], 0, 36, metal, [{ s: 0, e: 44, b: 0, t: 26, kind: 'door', cols: 10, rows: 3 }]);       // AL-33 커튼월 (서측)
  push(G.box(153 - T, 0.8, 5, (153 + T) / 2, 8.2, -14.5), M.white);                             // 남측 캐노피 EL 108.5
  push(G.box(5, 0.8, 30, 155.5, 8.2, 5), M.white);                                              // 서측 캐노피
  {   // 경사 지붕 (x=153 → 125 로 136 → 140.5) + 타워 상부
    const r = { x0: 125, x1: 153, z0: -12, z1: 32 };
    const lo = 36, hi = 40.5, UP = [0, 1, 0];
    push(tri([r.x0, hi, r.z0], [r.x1, lo, r.z0], [r.x1, lo, r.z1], UP), M.roof_membrane);
    push(tri([r.x0, hi, r.z0], [r.x1, lo, r.z1], [r.x0, hi, r.z1], UP), M.roof_membrane);
    push(tri([r.x1, lo, r.z0], [r.x0, hi, r.z0], [r.x0, lo, r.z0], [0, 0, -1]), metal, false);   // 남측 삼각 측면
    push(tri([r.x0, lo, r.z1], [r.x0, hi, r.z1], [r.x1, lo, r.z1], [0, 0, 1]), metal, false);   // 북측 삼각 측면 (2층부 위)
    push(G.box(T - 125, 1, 44, (T + 125) / 2, hi, 10), metal);                                   // 타워 코핑
  }

  // ======================= 남측 z≈31.5 (x 153~193) + 원호 커튼월 =======================
  wall([193, 31], [153, 32], 0, H2, brickA, [
    { s: 193 - 168.4, e: 193 - 156.5, b: 0.5, t: 24.5, kind: 'door', cols: 3, rows: 2 },        // AL-19 2층 스토어프론트
    ...pairWin(193 - 187, 12),                                                                  // AL-18A / AL-18
  ], BANDS2);
  for (let k = ARC.length - 1; k > 0; k--) {        // 각 세그먼트 = 베이 1개: 필라스터 3.5' + 2층 유리
    const p0 = ARC[k], p1 = ARC[k - 1], { ex, n, len, ry } = basis(p0, p1);
    wall(p0, p1, 0, H2, brickA, [
      { s: 3.5, e: len - 0.3, b: 0.5, t: 12.3, kind: 'door', cols: 3, rows: 1 },
      { s: 3.5, e: len - 0.3, b: 14, t: 21.6, cols: 3, rows: 1 },
    ]);
    const mid = 3.5 + (len - 3.8) / 2;
    push(G.box(len - 3.8, 1.7, 0.4, p0[0] + ex[0] * mid + n[0] * 0.1, 12.3, p0[1] + ex[1] * mid + n[1] * 0.1, { ry }), M.dark, false);   // 스팬드럴
    push(G.box(len - 3.8, 2.9, 0.2, p0[0] + ex[0] * mid + n[0] * 0.1, 21.6, p0[1] + ex[1] * mid + n[1] * 0.1, { ry }), brickD, false);  // 소일저 린텔
    push(G.box(3.5, H2, 1.0, p0[0] + ex[0] * 1.75 + n[0] * 0.5, 0, p0[1] + ex[1] * 1.75 + n[1] * 0.5, { ry }), brickD);               // type E 필라스터
    push(G.box(len, 1.0, 0.6, p0[0] + ex[0] * len / 2 + n[0] * 0.3, 31, p0[1] + ex[1] * len / 2 + n[1] * 0.3, { ry }), brickD);         // 곡면 코니스
  }
  // 원호 서단 코니스 박스 (x 289~303, 132~136, 금속 코핑) — A4.01 남측 입면
  push(G.box(14, 4, 6, 296, H2, 125), metal);

  // ======================= 서측 =======================
  wall([321, 128], [302, 128], 0, H2, brickA, [], BANDS2);                                      // 피트니스 서블록 남면
  wall([321, 192], [321, 128], 0, H2, brickA, [{ s: 192 - 167, e: 192 - 155, b: 5, t: 9.5, kind: 'louver' }], BANDS2);   // x=321, ML-5
  bay([321, 192], [321, 128], 192 - 184, 192 - 137, 10.5, 32.4, 4.5, 14.3, 25.5, 8, 2);         // AL-42 돌출 베이
  wall([302, 192], [321, 192], 0, H2, brickA, [], BANDS2);                                      // z=192 (x 302~321)
  wall([302, 281], [302, 192], 0, H2, brickA, [
    { s: 281 - 258.4, e: 281 - 252.6, b: 0, t: 7.5, kind: 'door', cols: 2 },
    { s: 281 - 235, e: 281 - 229, b: 0, t: 7.5, kind: 'door', cols: 2 },
    { s: 281 - 203.7, e: 281 - 200.5, b: 0, t: 7.5, kind: 'solid' },
    { s: 281 - 226.6, e: 281 - 222.6, b: 7, t: 9.5, kind: 'louver' },                          // ML-6
  ], BANDS2);
  push(G.box(13, 8, 19, 295.5, H2, 271.5), metal);                                              // 북서 펜트하우스 (금속 복합패널, 132~140)
  push(G.box(10, 2.5, 1, 295.5, 33, 281.6), eifs);                                              //   북면 EIFS 띠 + AL-48
  push(G.sideGeometry([[291, 282.2], [300, 282.2]], 33.3, 36, 1 / 9, 1 / 3, false), M.pane, false);
  push(G.box(6, 4, 11, 299, H2, 199.5), metal);                                                 // 코핑 박스 z 194~205

  // ======================= 북측 =======================
  // z=281 2층동 (x 17~153): 벽돌 A | C 필드 38~101 | A.  s = x - 17 등
  wall([17, 281], [38, 281], 0, H2, brickA, [
    { s: 21 - 17, e: 32 - 17, b: 14.5, t: 22, cols: 3 },                                       // AL-25A 상부
    { s: 21 - 17, e: 32 - 17, b: 0, t: 9.7, kind: 'door', cols: 3, rows: 2 },                  // AL-25A 출입문
  ], BANDS2);
  wall([38, 281], [101, 281], 0, H2, brickC, [
    { s: 50 - 38, e: 62 - 38, b: 6, t: 10.5, kind: 'louver' }, { s: 76 - 38, e: 88 - 38, b: 6, t: 10.5, kind: 'louver' },   // ML-3
    { s: 65 - 38, e: 72 - 38, b: 0, t: 7.5, kind: 'solid' },
  ], BANDS2);
  wall([101, 281], [153, 281], 0, H2, brickA, [
    { s: 108 - 101, e: 119 - 101, b: 14.5, t: 22, cols: 3 },                                   // AL-25A (서측) 상부
    { s: 108 - 101, e: 119 - 101, b: 0, t: 9.7, kind: 'door', cols: 3, rows: 2 },
    { s: 124 - 101, e: 131 - 101, b: 0, t: 25, kind: 'door', cols: 2, rows: 3 },               // AL-26A 2층 유리
    ...pairWin(136 - 101, 12.5),                                                                // AL-27A / AL-27
  ], BANDS2);
  push(G.box(7.4, 6, 0.4, 127.5, 25, 281.2), metal);                                           // AL-26A 상부 금속패널
  push(G.box(10.6, 0.8, 4, 127.5, 8.2, 283), M.white);                                         // AL-26A 캐노피
  bay([17, 281], [153, 281], 52 - 17, 90 - 17, 10.5, 31, 4.5, 11, 25, 8, 3);                   // AL-44 돌출 유리 베이 (북)
  for (const x of [36.5, 101, 20, 32, 107, 119]) push(G.box(1.5, H2, 0.2, x + 0.75, 0, 281.1), brickD);
  // 북서 1층동 z=281 (x 153~262, 난간 114) — x 262~302 는 2층
  wall([153, 281], [262, 281], 0, H1, brickA, [
    { s: 163 - 153, e: 171.6 - 153, b: 0.5, t: 9, cols: 2, rows: 2 },                          // AL-28
    { s: 178 - 153, e: 189.5 - 153, b: 4, t: 9, cols: 3 },                                     // AL-29
    { s: 200.5 - 153, e: 211 - 153, b: 4, t: 9, cols: 3 },
    { s: 220.5 - 153, e: 232 - 153, b: 0, t: 9.5, kind: 'solid' },                            // 오버헤드 도어
    { s: 240.8 - 153, e: 243.7 - 153, b: 0, t: 7.5, kind: 'solid' },
  ], [[9.5, 0.7], [0.5, 0.5]]);
  wall([262, 281], [302, 281], 0, H2, brickA, [], BANDS2);
  wall([153, 260.67], [262, 260.67], H1, H2, brickA, [                                          // 2층면 (1층동 지붕 위)
    { s: 164 - 153, e: 172 - 153, b: 14, t: 21.3, cols: 3 },                                   // AL-40
    { s: 177.5 - 153, e: 189.5 - 153, b: 14, t: 21.3, cols: 4 },                               // AL-41
    { s: 200.5 - 153, e: 211 - 153, b: 14, t: 21.3, cols: 4 },
    { s: 220 - 153, e: 232.5 - 153, b: 14, t: 21.3, cols: 4 },
    { s: 237.5 - 153, e: 244.5 - 153, b: 14, t: 21.3, cols: 3 },
  ], [[20, 0.7], [28, 0.7]]);
  wall([153, 281], [153, 260.67], 0, H1, brickA);                                              // 1층동 서단 (x=153)
  wall([262, 260.67], [262, 281], H1, H2, brickA);                                             // 2층부 x=262 리턴 (1층동 지붕 위)

  // ======================= 동측 =======================
  wall([-2, 18.33], [-2, 70], 0, H2, brickA, [
    { s: 37.6 - 18.33, e: 48.2 - 18.33, b: 4, t: 8.5, kind: 'louver' },                        // ML-2
    { s: 51 - 18.33, e: 67 - 18.33, b: 0, t: 10, kind: 'door', cols: 4, rows: 2 },             // AL-45 1층 스토어프론트
  ], BANDS2);
  bay([-2, 18.33], [-2, 70], 51 - 18.33, 70.5 - 18.33, 10, 31, 4, 15, 25, 5, 2);               // AL-45 돌출 베이
  wall([-2, 70], [6, 70], 0, H36, brickA);                                                     // x=6 돌출부 (136)
  wall([6, 70], [6, 97.5], 0, H36, brickA, [{ s: 1, e: 4, b: 0, t: 7.5, kind: 'solid' }], BANDS2);
  wall([6, 97.5], [17, 97.5], 0, H36, brickA);
  wall([17, 97.5], [17, 129], 0, H2, brickA, [...pairWin(108.4 - 97.5, 11.3)], BANDS2);        // 체육관 동벽 (벽돌 A | C | A)
  wall([17, 129], [17, 190], 0, H2, brickC, [...pairWin(138.4 - 129, 11.9), ...pairWin(168.6 - 129, 11.9)], BANDS2);
  wall([17, 190], [17, 220], 0, H2, brickA, [...pairWin(199 - 190, 12)], BANDS2);
  for (const z of [127.5, 190, 107, 120, 197.5, 211]) push(G.box(0.2, H2, 1.5, 16.9, 0, z + 0.75), brickD);
  wall([17, 220], [6, 220], 0, H36, brickA);                                                   // x=6 돌출부 (136)
  wall([6, 220], [6, 248], 0, H36, brickA, [{ s: 243.6 - 220, e: 246.8 - 220, b: 0, t: 7.5, kind: 'solid' }], BANDS2);
  wall([6, 248], [17, 248], 0, H36, brickA);
  wall([17, 248], [17, 281], 0, H2, brickA, [], BANDS2);

  // ======================= 지붕 (2층부 막 방수 + 난간, 1층동, 돌출부 136) =======================
  const poly2 = [[16.67, 18.33], [-2, 18.33], [-2, 70], [6, 70], [6, 97.5], [17, 97.5], [17, 220], [6, 220], [6, 248], [17, 248], [17, 281],
    [153, 281], [153, 260.67], [262, 260.67], [262, 281], [302, 281], [302, 192], [321, 192], [321, 128], [302, 128],
    ...[...ARC].reverse(), [153, 32], [153, -2], [16.67, -2]];
  flat(poly2, H2 - 1, [CHILL]);
  flat([[WING.x0, WING.z0], [WING.x0, WING.z1], [WING.x1, WING.z1], [WING.x1, WING.z0]], H1 - 1);
  flat([[6, 70], [6, 97.5], [17, 97.5], [17, 70]], H36 - 1);
  flat([[6, 220], [6, 248], [17, 248], [17, 220]], H36 - 1);
  // 냉동기 마당: 지붕 구멍 안쪽 벽(남·동 2층 높이, 북·서 14' 조적 스크린월) + 바닥 + 냉동기 2대
  const ch = [...CHILL].reverse();
  for (let i = 0; i < 4; i++) {
    const a = ch[i], b = ch[(i + 1) % 4], tall = a[1] === b[1] ? a[1] === 210 : a[0] === 263;
    push(G.sideGeometry([a, b], 0, tall ? H2 : H1, 1 / 24, 1 / 12, false), brickA);
  }
  push(G.capGeometry(CHILL, [], 0.5), M.concrete, false);
  push(G.box(10, 7, 6, 278, 0.5, 222), M.dark); push(G.box(10, 7, 6, 278, 0.5, 234), M.dark);
  push(G.box(13, 2, 13, 132.5, H2, 196.5), M.glass, false);                                   // 콩코스 반투명 패널 천창 (행 H~H.8)
  push(G.box(8, 9, 7, 149, H2, 253.5), eifs);                                                 // EIFS 박스 (E5/A6.08, 동·서 입면 z≈251~257, 132~141)

  // ======================= 체육관: 처마벽 EIFS(132→136) + 3":12" 박공(남북 용마루) + 박공면 반투명 유리 =======================
  push(G.sideGeometry([[GYM.x0, GYM.z0], [GYM.x0, GYM.z1]], H2 - 0.5, H36, 1 / 24, 1 / 12, false), eifs);     // 동 처마벽
  push(G.sideGeometry([[GYM.x1, GYM.z1], [GYM.x1, GYM.z0]], H2 - 0.5, H36, 1 / 24, 1 / 12, false), eifs);     // 서 처마벽
  push(G.box(GYM.x1 - GYM.x0, 0.6, 0.8, (GYM.x0 + GYM.x1) / 2, H36, GYM.z0), M.trim);                           // 코핑
  push(G.box(GYM.x1 - GYM.x0, 0.6, 0.8, (GYM.x0 + GYM.x1) / 2, H36, GYM.z1), M.trim);
  gable(parts, GYM, 'z', M.roof_membrane, M.glass);                                                             // 박공면 = 반투명 유리 (AL-47/AL-49)
  {   // 박공면 하부 띠(132~134.5) 유리 + 멀리언 (≈5.3' 간격, 수평 136.5·141)
    const xm = (GYM.x0 + GYM.x1) / 2, half = (GYM.x1 - GYM.x0) / 2, rake = x => GYM.eave + (GYM.ridge - GYM.eave) * (1 - Math.abs(x - xm) / half);
    for (const [z, out, ry] of [[GYM.z0 - 0.1, [0, -1], 0], [GYM.z1 + 0.1, [0, 1], 0]]) {
      const p0 = out[1] < 0 ? [GYM.x1, z] : [GYM.x0, z], p1 = out[1] < 0 ? [GYM.x0, z] : [GYM.x1, z];
      push(G.sideGeometry([p0, p1], H2 - 0.5, GYM.eave, 1 / 24, 1 / 12, false), M.glass, false);
      for (let x = GYM.x0 + 5.3; x < GYM.x1 - 1; x += 5.3) stick(p0, p1, Math.abs(x - p0[0]), H2 - 0.5, rake(x), out, ry);
      for (const y of [36.5, 41]) {
        const hw = half * (1 - (y - GYM.eave) / (GYM.ridge - GYM.eave));
        push(G.box(2 * hw, 0.3, 0.3, xm, y, z + out[1] * 0.15), M.dark);
      }
    }
  }

  // ======================= 피트니스: EIFS 클리어스토리 띠(132→138, AL-50/AL-48) + 3":12" 박공(동서 용마루) =======================
  {
    const winS = [186, 207.5, 228, 249.5, 271].map(c => ({ s: FIT.x1 - c - 5.75, e: FIT.x1 - c + 5.75, b: 33, t: 36.5, cols: 2 }));
    winS.push({ s: FIT.x1 - 310.5 - 5.5, e: FIT.x1 - 310.5 + 5.5, b: 33, t: 36.5, cols: 2 });                   // AL-48
    const winN = [179.5, 199.5, 224, 245.5, 266].map(c => ({ s: c - FIT.x0 - 7, e: c - FIT.x0 + 7, b: 33, t: 36.5, cols: 3 }));
    winN.push({ s: 310.5 - FIT.x0 - 5.5, e: 310.5 - FIT.x0 + 5.5, b: 33, t: 36.5, cols: 2 });
    wall([FIT.x1, FIT.z0], [FIT.x0, FIT.z0], H2 - 0.5, FIT.eave, eifs, winS);                  // 남 처마 클리어스토리 (z=128, 서→동)
    wall([FIT.x0, FIT.z1], [FIT.x1, FIT.z1], H2 - 0.5, FIT.eave, eifs, winN);                  // 북 처마 클리어스토리 (z=192, 동→서)
    wall([FIT.x0, FIT.z0], [FIT.x0, FIT.z1], H2 - 0.5, FIT.eave, eifs);                        // 동 박공면 하부 (EIFS)
    push(G.sideGeometry([[FIT.x1, FIT.z1], [FIT.x1, FIT.z0]], H2 - 0.5, FIT.eave, 1 / 24, 1 / 12, false), M.glass, false);   // 서 박공면 AL-51
    push(G.box(FIT.x1 - FIT.x0, 0.6, 0.8, (FIT.x0 + FIT.x1) / 2, FIT.eave, FIT.z0), M.trim);
    push(G.box(FIT.x1 - FIT.x0, 0.6, 0.8, (FIT.x0 + FIT.x1) / 2, FIT.eave, FIT.z1), M.trim);
    gable(parts, FIT, 'x', M.roof_membrane, eifs, M.glass);                                       // 동단 EIFS, 서단 반투명 유리
    const zm = (FIT.z0 + FIT.z1) / 2, half = (FIT.z1 - FIT.z0) / 2, rake = z => FIT.eave + (FIT.ridge - FIT.eave) * (1 - Math.abs(z - zm) / half);
    const p0 = [FIT.x1 + 0.1, FIT.z0], p1 = [FIT.x1 + 0.1, FIT.z1];
    for (let z = FIT.z0 + 5.3; z < FIT.z1 - 1; z += 5.3) stick(p0, p1, z - FIT.z0, H2 - 0.5, rake(z), [1, 0], -Math.PI / 2);
    push(G.box(0.3, 0.3, 2 * half * (1 - 3.5 / (FIT.ridge - FIT.eave)) , FIT.x1 + 0.25, FIT.eave + 3.5, zm), M.dark);
  }

  // 원호 앞 선데크/계단 플라자 (콘크리트)
  push(G.capGeometry([[153, 32], ...ARC.map(p => [p[0] + 4, p[1] - 3]), [320, 110], [320, 20], [153, 20]].reverse(), [], 0.3), M.walk, false);

  const grp = new THREE.Group();
  for (const m of G.mergeByMaterial(parts)) grp.add(m);
  return grp;
}

/** 박공지붕: r = {x0,x1,z0,z1,eave,ridge}, axis = 용마루 방향('x' 동서 | 'z' 남북). geom.js gableRoof 는 감김이 뒤집혀 있어 자체 구현.
 *  matEnd0/matEnd1 = 두 박공면 재질 (axis 'z': 남/북, axis 'x': 동/서) */
function gable(parts, r, axis, matRoof, matEnd0, matEnd1 = matEnd0) {
  const { x0, x1, z0, z1, eave: e, ridge: h } = r, xm = (x0 + x1) / 2, zm = (z0 + z1) / 2, UP = [0, 1, 0];
  const R = (a, b, c) => parts.push({ geom: tri(a, b, c, UP), mat: matRoof });
  if (axis === 'z') {        // 용마루 x = xm, z0..z1
    R([x0, e, z0], [x0, e, z1], [xm, h, z1]); R([x0, e, z0], [xm, h, z1], [xm, h, z0]);
    R([x1, e, z0], [xm, h, z0], [xm, h, z1]); R([x1, e, z0], [xm, h, z1], [x1, e, z1]);
    parts.push({ geom: tri([x0, e, z0 - 0.1], [x1, e, z0 - 0.1], [xm, h, z0 - 0.1], [0, 0, -1]), mat: matEnd0, cast: false });
    parts.push({ geom: tri([x0, e, z1 + 0.1], [x1, e, z1 + 0.1], [xm, h, z1 + 0.1], [0, 0, 1]), mat: matEnd1, cast: false });
  } else {                   // 용마루 z = zm, x0..x1
    R([x0, e, z0], [x1, e, z0], [x1, h, zm]); R([x0, e, z0], [x1, h, zm], [x0, h, zm]);
    R([x0, e, z1], [x0, h, zm], [x1, h, zm]); R([x0, e, z1], [x1, h, zm], [x1, e, z1]);
    parts.push({ geom: tri([x0 - 0.1, e, z0], [x0 - 0.1, e, z1], [x0 - 0.1, h, zm], [-1, 0, 0]), mat: matEnd0, cast: false });
    parts.push({ geom: tri([x1 + 0.1, e, z0], [x1 + 0.1, e, z1], [x1 + 0.1, h, zm], [1, 0, 0]), mat: matEnd1, cast: false });
  }
}

/** 삼각형 1장. n = 바깥 법선 방향 — 감김 순서를 그에 맞춘다 */
function tri(a, b, c, n) {
  const ab = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], ac = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
  const cr = [ab[1] * ac[2] - ab[2] * ac[1], ab[2] * ac[0] - ab[0] * ac[2], ab[0] * ac[1] - ab[1] * ac[0]];
  if (cr[0] * n[0] + cr[1] * n[1] + cr[2] * n[2] < 0) [b, c] = [c, b];
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute([...a, ...b, ...c], 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, 4, 0, 2, 1], 2));
  g.computeVertexNormals();
  return g;
}
