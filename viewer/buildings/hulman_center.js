// Hulman Center — ISU 아레나 (Sverdrup & Parcel, 입찰도면 1971-01-08, 준공 1973; 2018–2020 전면 개보수(RATIO): 수직 금속패널 외피 + 남측 전면 유리 로비)
// 치수 근거 (도면 세트 "Hulman Center Record Drawings", 1/16" = 1'-0" 평면 · 1/8" = 1'-0" 단면 · 1/4"~3" 상세):
//   A3 (TEMP004) 1층 평면: 원 외곽 다각형 306'-4" × 254'-4", 외부 계단탑 17'-2" 각, 서측 입구 돌출 18'-7" × 50'-0"; 북측 화살표 = 평면 오른쪽
//   A5 (TEMP006) 3층(콘코스=지면) 평면: 외주 기둥 열 간격 24'-3" 표준, 출입구 베이 34'-3", 출입 전실 폭 17'-0"·문 10'-6" (J열),
//     모서리 파빌리온 68'-4" × 65'-4"; 서비스 빌딩 61'-0" × 76'-6" 은 북측 외주에서 ≈25' 밖 → 현 직사각 외피 밖(위성에도 없음) → 미모델
//   A7 (TEMP008) 지붕 평면: 중앙 펜트하우스 = 44' × 14' 박스 2동(간격 6'), 외주 RD(지붕배수) 16개소, 루프 스커틀, 지붕은 외주→중앙 SLOPE
//   A11–A13 (TEMP012–014) 단면: Level 1 EL 75'-6", Level 2 EL 88'-0", Level 3 EL 100'-6" = 콘코스(지면 EL 100'-0"), 트러스 깊이 20'-0";
//     계단탑 A–H 후면 입면: 어깨 EL 167'-3"~168'-1", A44/A46 탑 상단 EL 178'-0"(G·B) / 194'-8"(A·E) — 2020 개보수 후 위성에는 탑이 보이지 않음(외피 내부로 흡수) → 미모델
//   A36/A37 (TEMP037/038) 외벽 단면: 상부 외벽 = 단열 금속패널(트러스 깊이 20'), 하부 = 노출 콘크리트 + 알루미늄 창벽, 지붕 끝 금속 파시아
//   A40 (TEMP041) 창벽 상세 A39-A/E/C: FIN. GRADE EL 100'-0", FIN. FL EL 100'-6", 콘크리트 커브 상단(창대) EL 101'-6" (7½"+4½"),
//     ¼" 판유리 창벽 창대→보 하단 8'-0"(바닥 기준 9'-0"), 콘크리트 보 하단 EL 109'-6" / 상단 EL 113'-6"(4'-0" 깊이, 유리면에서 6" 돌출, 하단 3"/3" 모따기 + 물끊기),
//     기둥면(FACE OF COL.) 유리 안쪽 2'-3"(출입구 베이에서는 벽면 내 노출), 알루미늄 문 + 상부 트랜섬, 문지방 4" 알루미늄, 외부 보도는 "SLOPE UP TO 100'-6""
//   A42 (TEMP043) 입구·계단 입면 A42-F(1/4"): 창벽 라이트 폭 ≈3'-1"~3'-6", 문 339/340 3'-6" 단짝문 × 3 = 10'-6", 머리 7'-0" + 트랜섬 → 9'-0";
//     기둥 폭 3'-4"; 창벽 철판 상단 EL 171'-11⅝"; 지붕 데크 지지 EL 180'-10⅛" (지면 +80.8')
//   A44/A46 (TEMP045/047) 계단탑 평면·단면: 탑 15'-3" × 18'-7", 엘리베이터 기계실 EL 158', 상단 EL 178'~194'-8" (위 참조)
//   A63/A64 (TEMP064/065) 서비스 빌딩: 외피 밖 → 미모델 (위 참조)
// 2020 개보수 후 외형(esri z20 위성 + RATIO 설명 "sycamore 를 연상시키는 수직 금속 외피가 전면 유리 커튼월 위에 뜬다"):
//   293' × 333' 직사각 박스, 남측(Cherry St) 전면 유리 로비 157' × 43', 서측(8th St) 돌출 전실 68' × 7.5',
//   지붕 평탄(막) + 중앙 펜트하우스 2동, 옥상 설비 8기(12' × 17', 서·동 2열 × 4행), 모서리·변 중앙 루프 해치 8개소,
//   남측 광장: 로비 양옆 사다리꼴 식재대, 잔디 패널 4개, 포장 광장 ≈140' 깊이
// 로컬 프레임: 평면도 기준 x = 오른쪽(= 북), z = 아래(= 동, 9th St 쪽). 원점 = 본체 직사각형 중심, y = 0 = 지면 EL 100'-0" (콘코스 바닥 +0.5').
//
// 입면 창 배치 (기단층 = 콘코스 창벽, 4개 입면 공통, A5 기둥 열 + A40/A42 창벽):
//   북 (Eagle St, 길이 292.4'): 모서리 벽 7.8' | 기둥 3'-4" | 베이 24'-3" × 5 | 출입구 베이 34'-3" (중앙 3짝문 10'-6" + 양측 사이드라이트) | 베이 × 5 | 모서리 7.8'
//     각 베이: 커브 0~1.5', 유리 1.5~9.5' (라이트 폭 ≈3.49' × 6, 알루미늄 멀리언 3"), 트랜섬 레일 +7.5', 콘크리트 보 9.5~13.5'
//   서 (8th St, 332.6'): 모서리 3.7' | 베이 24'-3" × 6 | 출입구 베이 34'-3" (돌출 전실 68.2' 뒤 → 전실 전면에 3짝문) | 베이 × 6 | 모서리 3.7'
//   남 (Cherry St, 332.6'): 서측과 동일 격자이나 z −74.3'~82.4' 구간은 유리 로비(30') 뒤 → 로비 유리벽 (라이트 5.26' × 30, 수평 10.5'/20.5')
//   동 (9th St, 332.6'): 서측과 동일 격자, 중앙 출입구 베이에 3짝문
//   상부 (13.5'~83'): 금속패널 + 수직 핀 6' 피치(깊이 0.8/1.3/1.0 교대), 클리어스토리 유리띠 58'~70', 파라펫 81'~83'
import * as THREE from 'three';

export const meta = {
  id: 'hulman', name: 'Hulman Center', osm: 'way/183426119',
  anchor: [1377.59, 890.11], rotation: -90.206,   // tools/fit_footprint.py 결과 (RMS 0.82 ft)
  height: 83,
  preset: { pos: [1150, 170, 1330], tgt: [1378, 10, 890] },
  sheets: 'Hulman Center 1971 bid set: A3, A5, A7, A11, A12, A13, A36, A37, A40, A42, A44, A46, A63 (+ esri z20 위성 외형, RATIO 개보수 설명)',
};

const HX = 166.3, HZ = 146.2;            // 본체 반폭: 남북 332.6', 동서 292.4'
const FL = 0.5, SILL = 1.5, HEAD = 9.5, BT = 13.5;                    // 콘코스 바닥 / 창대(커브 상단) / 보 하단 / 보 상단 (A40)
const H_CLER0 = 58, H_CLER1 = 70, H_ROOF = 81, PAR = 2;               // 클리어스토리 띠 / 지붕 데크 (ft)
const BAY = 24.25, EBAY = 34.25, CW = 3.33, LIGHT = 3.5;              // A5 기둥 간격 / 출입구 베이 / 기둥 폭 (3'-4") / 창벽 라이트 폭
const LOBBY = { x0: -HX - 43.3, z0: -74.3, z1: 82.4, h: 30 };          // 남측 유리 로비 (위성 치수)
const BUMP = { x0: -37.6, x1: 30.6, d: 7.4, h: BT };                   // 서측 돌출 전실(8th St)

export const outline = [
  [HX, HZ], [HX, -HZ], [BUMP.x1, -HZ], [BUMP.x1, -HZ - BUMP.d], [BUMP.x0, -HZ - BUMP.d], [BUMP.x0, -HZ], [-HX, -HZ],
  [-HX, LOBBY.z0], [LOBBY.x0, LOBBY.z0], [LOBBY.x0, LOBBY.z1], [-HX, LOBBY.z1], [-HX, HZ],
];

export function build(M, G) {
  const parts = [];
  const rect = [[HX, HZ], [HX, -HZ], [-HX, -HZ], [-HX, HZ]];   // 본체 (평면 CCW: 북동 → 북서 → 남서 → 남동)

  // ---- 기단층(콘코스 창벽, A40/A42): 커브 + 유리 + 멀리언 + 노출 콘크리트 기둥 + 보 EL 109'-6"/113'-6"
  const bumpS = [HX - BUMP.x1, HX - BUMP.x0];                 // 서측 변에서 전실이 덮는 구간 (s = HX − x)
  const lobbyS = [LOBBY.z0 + HZ, LOBBY.z1 + HZ];              // 남측 변에서 로비가 덮는 구간 (s = z + HZ)
  baseStorey(parts, M, G, [HX, HZ], [HX, -HZ], { doors: true });                        // 북 (Eagle St)
  baseStorey(parts, M, G, [HX, -HZ], [-HX, -HZ], { blank: [bumpS] });                  // 서 (8th St) — 중앙은 돌출 전실
  baseStorey(parts, M, G, [-HX, -HZ], [-HX, HZ], { blank: [lobbyS] });                 // 남 (Cherry St) — 중앙은 유리 로비
  baseStorey(parts, M, G, [-HX, HZ], [HX, HZ], { doors: true });                        // 동 (9th St)

  // ---- 상부 외피 (2020): 금속패널 + 수직 핀 / 클리어스토리 띠 / 파라펫
  parts.push({ geom: G.sideGeometry(rect, BT, H_CLER0, 1 / 24, 1 / 12), mat: M.metal });
  parts.push({ geom: G.sideGeometry(rect, H_CLER0, H_CLER1, 1 / 24, 1 / 12), mat: M.glass });
  parts.push({ geom: G.sideGeometry(rect, H_CLER1, H_ROOF + PAR, 1 / 24, 1 / 12), mat: M.metal });
  fins(parts, M, G, [HX, HZ], [HX, -HZ], () => BT);
  fins(parts, M, G, [HX, -HZ], [-HX, -HZ], s => (s > bumpS[0] - 1 && s < bumpS[1] + 1) ? BUMP.h + 1.2 : BT);
  fins(parts, M, G, [-HX, -HZ], [-HX, HZ], s => (s > lobbyS[0] - 1 && s < lobbyS[1] + 1) ? LOBBY.h + 1.8 : BT);
  fins(parts, M, G, [-HX, HZ], [HX, HZ], () => BT);

  // ---- 지붕: 평탄 막지붕 + 외주에서 중앙으로 완만히 솟는 면(A7 SLOPE) + 펜트하우스 2동(A7) + 옥상 설비 8기 + 루프 해치(위성)
  const r = G.flatRoof(rect, H_ROOF, { parapet: PAR, thick: 1.0 });
  parts.push({ geom: r.slab, mat: M.roof_membrane }); parts.push({ geom: r.parapet, mat: M.metal });
  const RH = 6.0;
  const roofY = (x, z) => { const q = Math.min(1, Math.hypot(x / (HX - 4), z / (HZ - 4))); const t = 1 - q * q; return H_ROOF + 0.05 + RH * t * t; };
  parts.push({ geom: gridSurface(-HX + 1, HX - 1, -HZ + 1, HZ - 1, 28, 24, roofY), mat: M.roof_membrane });
  for (const zc of [-10, 10]) {                                                                // 펜트하우스: 44' × 14' × 11', 간격 6', 낮은 박공(장축 남북)
    const yb = roofY(0, 0) - 0.3;
    parts.push({ geom: G.box(44, 11, 14, 0, yb, zc), mat: M.metal });
    parts.push({ geom: G.gableRoof([[-22, zc - 7], [22, zc - 7], [22, zc + 7], [-22, zc + 7]], yb + 11, 0.3, 0), mat: M.roof_dark });
  }
  for (const x of [-124, -35, 24, 115]) for (const z of [-85, 91])                             // 옥상 설비 2열 × 4행 (위성: 12' × 17', 장축 남북)
    parts.push({ geom: G.box(17, 11, 12, x, roofY(x, z) - 0.4, z), mat: M.dark });
  for (const [x, z] of [[HX - 7, HZ - 7], [HX - 7, -HZ + 7], [-HX + 7, HZ - 7], [-HX + 7, -HZ + 7], [HX - 7, 0], [-HX + 7, 0], [0, HZ - 7], [0, -HZ + 7]])
    parts.push({ geom: G.box(4, 2.5, 4, x, roofY(x, z) - 0.2, z), mat: M.white });            // 루프 해치/스커틀 (A7 ROOF SCUTTLE + 위성)
  for (let i = 0; i < 16; i++) {                                                               // 지붕 배수(RD) 돔 16개소 (A7 외주)
    const t = (i + 0.5) / 16 * Math.PI * 2, x = Math.cos(t) * (HX - 12), z = Math.sin(t) * (HZ - 12);
    parts.push({ geom: G.cylinder(0.8, 0.6, x, roofY(x, z) - 0.1, z, 8), mat: M.dark, cast: false });
  }

  // ---- 남측 2층 유리 로비 (2020, Cherry St 광장 쪽): 157' × 43' × 30', 멀리언 격자, 상부 핀 파시아 + 8' 캐노피, 출입 캐노피
  lobby(parts, M, G);

  // ---- 서측 돌출 전실 (8th St): 창벽 + 중앙 3짝문, 평지붕
  const bp = [[BUMP.x1, -HZ], [BUMP.x1, -HZ - BUMP.d], [BUMP.x0, -HZ - BUMP.d], [BUMP.x0, -HZ]];
  baseStorey(parts, M, G, bp[1], bp[2], { doors: true, bay: 16.9, beamOff: 0 });
  glassStrip(parts, M, G, bp[0], bp[1]); glassStrip(parts, M, G, bp[2], bp[3]);
  const br = G.flatRoof(bp, BUMP.h, { parapet: 1.0, thick: 0.6 });
  parts.push({ geom: br.slab, mat: M.roof_membrane }); parts.push({ geom: br.parapet, mat: M.dark });

  // ---- Cherry St 광장: 포장, 로비 양옆 식재대(사다리꼴), 잔디 패널 4개, 로비 전면 디딤단
  plaza(parts, M, G);

  const grp = new THREE.Group();
  for (const m of G.mergeByMaterial(parts)) grp.add(m);
  return grp;
}

/**
 * 기단층 한 변: p0→p1 (CCW, 바깥 = 진행 방향 오른쪽). A5 기둥 격자(중앙 출입구 베이 EBAY, 표준 베이 bay) 위에
 * A40 창벽(커브 0~SILL, 유리 SILL~HEAD, 멀리언, 트랜섬 레일 7.5') + 노출 콘크리트 기둥 + 보 HEAD~BT 를 놓는다.
 * blank = [[s,e]] 구간은 다른 매스(로비·전실) 뒤 → 민 콘크리트 벽.
 */
function baseStorey(parts, M, G, p0, p1, { doors = false, blank = [], bay = BAY, beamOff = 0.1 } = {}) {
  const E = edgeFrame(p0, p1), L = E.L;
  const bx = (s0, s1, y0, y1, off, dpt, mat, cast) => parts.push({ geom: ebox(G, E, s1 - s0, y1 - y0, dpt, (s0 + s1) / 2, off, y0), mat, cast });
  const half = (L - EBAY) / 2, n = Math.floor(half / bay + 1e-6), pier = half - n * bay;
  const grids = [];
  for (let k = n; k >= 0; k--) grids.push(L / 2 - EBAY / 2 - k * bay);
  for (let k = 0; k <= n; k++) grids.push(L / 2 + EBAY / 2 + k * bay);
  // 보 (A40: 유리면에서 6" 돌출, 4'-0" 깊이) — 변 전체
  bx(0, L, HEAD, BT, beamOff, 1.2, M.concrete);
  // 모서리 벽 + 기둥 (노출 콘크리트)
  bx(0, pier + CW / 2, 0, HEAD, 0, 1.0, M.concrete); bx(L - pier - CW / 2, L, 0, HEAD, 0, 1.0, M.concrete);
  for (const g of grids) bx(g - CW / 2, g + CW / 2, 0, HEAD, 0, 1.0, M.concrete);
  // 베이
  for (let i = 0; i + 1 < grids.length; i++) {
    const a = grids[i] + CW / 2, b = grids[i + 1] - CW / 2;
    if (blank.some(([s, e]) => b > s && a < e)) { bx(a, b, 0, HEAD, -0.2, 0.6, M.concrete); continue; }
    const center = Math.abs((a + b) / 2 - L / 2) < 1;
    if (doors && center) {
      const c = L / 2, dw = 10.5;                                   // 3'-6" × 3 짝 알루미늄 유리문 (A42 339/340) + 트랜섬
      windowBay(a, c - dw / 2 - 0.3); windowBay(c + dw / 2 + 0.3, b);
      parts.push({ geom: G.sideGeometry([E.P(c - dw / 2, -0.4), E.P(c + dw / 2, -0.4)], FL, HEAD, 1 / 10, 1 / 9, false), mat: M.pane, cast: false });
      bx(c - dw / 2 - 0.3, c - dw / 2, FL, HEAD, 0, 0.6, M.dark); bx(c + dw / 2, c + dw / 2 + 0.3, FL, HEAD, 0, 0.6, M.dark);
      for (const m of [-1.75, 1.75]) bx(c + m - 0.1, c + m + 0.1, FL, HEAD, 0, 0.6, M.dark);
      bx(c - dw / 2, c + dw / 2, FL + 7.0, FL + 7.3, 0, 0.6, M.dark);                      // 문 머리 7'-0"
      bx(c - dw / 2, c + dw / 2, 0, FL, 0, 1.0, M.dark);                                    // 알루미늄 문지방
      bx(c - 8, c + 8, 0, FL, 3.2, 6.0, M.walk, false);                                     // 외부 디딤판 (A42-D "SLOPE UP TO 100'-6"")
    } else windowBay(a, b);
  }
  function windowBay(a, b) {
    if (b - a < 1) return;
    bx(a, b, 0, SILL, 0, 1.0, M.concrete);                                                  // 콘크리트 커브 (A39-A: 7½"+4½")
    parts.push({ geom: G.sideGeometry([E.P(a, -0.5), E.P(b, -0.5)], SILL, HEAD, 1 / 3.5, 1 / 8, false), mat: M.pane, cast: false });
    const nL = Math.max(1, Math.round((b - a) / LIGHT));
    for (let k = 1; k < nL; k++) { const s = a + (b - a) * k / nL; bx(s - 0.125, s + 0.125, SILL, HEAD, 0, 0.6, M.dark); }
    bx(a, b, FL + 7.0, FL + 7.25, 0, 0.6, M.dark);                                          // 트랜섬 레일 (A42-F)
    bx(a, b, SILL, SILL + 0.2, 0, 0.6, M.dark); bx(a, b, HEAD - 0.25, HEAD, 0, 0.6, M.dark); // 창대·머리 프레임
  }
}

/** 짧은 창벽 띠(전실 측면 등): 커브 + 유리 + 멀리언 + 보 */
function glassStrip(parts, M, G, p0, p1) {
  const E = edgeFrame(p0, p1), L = E.L;
  const bx = (s0, s1, y0, y1, off, dpt, mat) => parts.push({ geom: ebox(G, E, s1 - s0, y1 - y0, dpt, (s0 + s1) / 2, off, y0), mat });
  bx(0, L, 0, SILL, 0, 1.0, M.concrete); bx(0, L, HEAD, BT, 0, 1.0, M.concrete);
  parts.push({ geom: G.sideGeometry([E.P(0, -0.5), E.P(L, -0.5)], SILL, HEAD, 1 / 3.5, 1 / 8, false), mat: M.pane, cast: false });
  const nL = Math.max(1, Math.round(L / LIGHT));
  for (let k = 1; k < nL; k++) { const s = L * k / nL; bx(s - 0.125, s + 0.125, SILL, HEAD, 0, 0.6, M.dark); }
  bx(0, L, FL + 7.0, FL + 7.25, 0, 0.6, M.dark);
}

/** 상부 외피 수직 핀: 6' 피치, 깊이 0.8/1.3/1.0 교대 (sycamore 패턴). y0(s) 는 시작 높이(로비·전실 위에서는 그 지붕 위부터) */
function fins(parts, M, G, p0, p1, y0of) {
  const E = edgeFrame(p0, p1), L = E.L, top = H_ROOF + PAR;
  const dep = [0.8, 1.3, 1.0, 0.8, 1.6, 1.0, 1.3, 0.8];
  let k = 0;
  for (let s = 3; s < L - 2; s += 6, k++) {
    const d = dep[k % dep.length], y0 = y0of(s);
    parts.push({ geom: ebox(G, E, 0.5, top - y0, d, s, d / 2 - 0.05, y0), mat: M.white });
  }
}

/** 남측 유리 로비 + 캐노피 */
function lobby(parts, M, G) {
  const { x0, z0, z1, h } = LOBBY, zc = (z0 + z1) / 2;
  const lob = [[-HX, z0], [x0, z0], [x0, z1], [-HX, z1]];                   // 3면 (북면은 본체와 접함)
  parts.push({ geom: G.sideGeometry(lob, 0, FL, 1 / 24, 1 / 12, false), mat: M.concrete });            // 바닥 커브
  parts.push({ geom: G.sideGeometry(lob, FL, h - 2, 1 / 5.25, 1 / 10, false), mat: M.pane, cast: false }); // 유리 3면
  for (let i = 0; i < 3; i++) {                                                                         // 멀리언 격자
    const E = edgeFrame(lob[i], lob[i + 1]), L = E.L, nL = Math.round(L / 5.25);
    const bx = (s0, s1, y0, y1, off, dpt, mat) => parts.push({ geom: ebox(G, E, s1 - s0, y1 - y0, dpt, (s0 + s1) / 2, off, y0), mat });
    for (let k = 0; k <= nL; k++) { const s = L * k / nL; bx(s - 0.2, s + 0.2, FL, h - 2, 0.1, 0.7, M.dark); }
    for (const y of [10.5, 20.5]) bx(0, L, y - 0.15, y + 0.15, 0.1, 0.7, M.dark);
    bx(0, L, h - 2.3, h - 2, 0.1, 0.7, M.dark);
    if (i === 1) {                                                                                      // 전면 중앙 출입문: 6' 양짝문 × 3
      for (const dc of [-9, 0, 9]) {
        const c = L / 2 + dc;
        bx(c - 3.3, c - 3.0, FL, FL + 7.6, 0.2, 0.9, M.dark); bx(c + 3.0, c + 3.3, FL, FL + 7.6, 0.2, 0.9, M.dark);
        bx(c - 3.3, c + 3.3, FL + 7.3, FL + 7.6, 0.2, 0.9, M.dark); bx(c - 0.1, c + 0.1, FL, FL + 7.3, 0.2, 0.9, M.dark);
      }
    }
  }
  // 지붕: 전면 8' 캐노피 포함 슬래브 + 핀 파시아 (금속패널 + 수직 핀 3' 피치)
  const ext = [[-HX, z0], [x0 - 8, z0], [x0 - 8, z1], [-HX, z1]];
  const lr = G.flatRoof(ext, h, { parapet: 0, thick: 1.5 });
  parts.push({ geom: lr.slab, mat: M.roof_membrane });
  parts.push({ geom: G.sideGeometry(ext, h - 2.2, h + 1.5, 1 / 24, 1 / 12, false), mat: M.metal });
  for (let i = 0; i < 3; i++) {
    const E = edgeFrame(ext[i], ext[i + 1]);
    for (let s = 1.5; s < E.L - 1; s += 3) parts.push({ geom: ebox(G, E, 0.4, 3.7, 0.5, s, 0.25, h - 2.2), mat: M.white });
  }
  parts.push({ geom: G.box(8, 0.3, z1 - z0, x0 - 4, h - 2.2, zc), mat: M.white, cast: false });        // 캐노피 하부 소핏
  // 출입구 캐노피 (+12', 50' 폭) + 기둥 2
  parts.push({ geom: G.box(10, 1.0, 50, x0 - 5, 12, zc), mat: M.dark });
  for (const dz of [-21, 21]) parts.push({ geom: G.box(0.8, 12, 0.8, x0 - 9.5, 0, zc + dz), mat: M.dark });
}

/** Cherry St 광장: 포장 + 식재대 + 잔디 패널 + 로비 전면 디딤단 */
function plaza(parts, M, G) {
  const { x0, z0, z1 } = LOBBY;
  const PX = x0 - 140;                                                      // 광장 남단
  parts.push({ geom: G.capGeometry(ccw([[-HX, -HZ - 12], [PX, -HZ - 12], [PX, HZ + 12], [-HX, HZ + 12]]), [], 0.15), mat: M.walk, cast: false });
  parts.push({ geom: G.box(3, 0.25, z1 - z0 + 6, x0 - 1.5, 0.15, (z0 + z1) / 2), mat: M.walk, cast: false });   // 로비 전면 디딤단
  // 로비 양옆 사다리꼴 식재대 (위성: 건물면에서 로비 끝~모서리, 남쪽으로 40' 가며 좁아짐), 높이 1.5'
  for (const bed of [[[-HX, -HZ + 4], [-HX - 40, -HZ + 34], [-HX - 40, z0 - 4], [-HX, z0 - 4]],
                     [[-HX, HZ - 4], [-HX - 40, HZ - 34], [-HX - 40, z1 + 4], [-HX, z1 + 4]]]) {
    const e = G.extrudePoly(ccw(bed), [], 1.5, { y0: 0.15 });
    parts.push({ geom: e.sides, mat: M.concrete }); parts.push({ geom: e.top, mat: M.grass, cast: false });
  }
  // 잔디 패널 4개 (위성: 광장 양옆 2단)
  for (const [xa, xb, za, zb] of [[x0 - 17, x0 - 70, -HZ, -85], [x0 - 17, x0 - 70, 79, HZ], [x0 - 75, x0 - 125, -HZ, -62], [x0 - 75, x0 - 125, 56, HZ]]) {
    const p = ccw([[xa, za], [xb, za], [xb, zb], [xa, zb]]);
    parts.push({ geom: G.sideGeometry(p, 0.15, 0.6, 1 / 24, 1 / 12), mat: M.curb });
    parts.push({ geom: G.capGeometry(p, [], 0.6), mat: M.grass, cast: false });
  }
}

/** 변 프레임 E 위의 박스: 폭 w(변 방향) × 높이 h × 깊이 d, 변 위 거리 s, 바깥 오프셋 off, 바닥 높이 y0 */
function ebox(G, E, w, h, d, s, off, y0 = 0) {
  const [x, z] = E.P(s, off);
  return G.box(w, h, d, x, y0, z, { ry: E.ry });
}

/** 변 p0→p1 의 로컬 프레임: 길이 L, P(s, off) = 변 위 거리 s, 바깥쪽 off 의 점, ry = box 회전각 */
function edgeFrame(p0, p1) {
  const dx = p1[0] - p0[0], dz = p1[1] - p0[1], L = Math.hypot(dx, dz);
  const ex = [dx / L, dz / L], nz = [-dz / L, dx / L];
  return { L, ry: -Math.atan2(dz, dx), P: (s, off = 0) => [p0[0] + ex[0] * s + nz[0] * off, p0[1] + ex[1] * s + nz[1] * off] };
}

/** 폴리곤을 lib 규약(CCW, (x,−z) 면적 양수)으로 맞춘다 */
function ccw(poly) {
  let a = 0;
  for (let i = 0; i < poly.length; i++) { const p = poly[i], q = poly[(i + 1) % poly.length]; a += p[0] * (-q[1]) - q[0] * (-p[1]); }
  return a < 0 ? [...poly].reverse() : poly;
}

/** 높이 함수 f(x,z) 로 만든 직사각 격자 곡면 (법선 위) */
function gridSurface(x0, x1, z0, z1, nx, nz, f) {
  const pos = [], uv = [], idx = [];
  for (let j = 0; j <= nz; j++) for (let i = 0; i <= nx; i++) {
    const x = x0 + (x1 - x0) * i / nx, z = z0 + (z1 - z0) * j / nz;
    pos.push(x, f(x, z), z); uv.push(x / 24, z / 24);
  }
  for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) {
    const a = j * (nx + 1) + i, b = a + 1, c = a + nx + 1, d = c + 1;
    idx.push(a, c, b, b, c, d);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx); g.computeVertexNormals();
  return g;
}
