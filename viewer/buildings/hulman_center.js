// Hulman Center — ISU 아레나 (Sverdrup & Parcel, 입찰도면 1971-01-08, 준공 1973; 2018–2020 전면 개보수: 수직 금속패널 외피 + 남측 2층 유리 로비)
// 치수 근거 (도면 세트 "Hulman Center Record Drawings", 1/16" = 1'-0" 평면 · 1/8" = 1'-0" 단면):
//   A3 (TEMP004) 1층 평면: 원 외곽 다각형 306'-4" × 254'-4", 외부 계단탑 17'-2" 각, 남측 입구 돌출 18'-7" × 50'-0"; 북측 화살표 = 평면 오른쪽
//   A5 (TEMP006) 3층 평면: 모서리 파빌리온 68'-4" × 65'-4" (4개소), 3층 전체 폭 ≈ 361' × 307' (입찰안; 실제 건물은 OSM/위성 293' × 333')
//   A7 (TEMP008) 지붕 평면: 둥근 사각 지붕, 중앙 펜트하우스로 경사 상승(SLOPE), 지붕 트러스 깊이 20'-0"
//   A11–A13 (TEMP012–014) 단면: Level 1 EL 75'-6", Level 2 EL 88'-0", Level 3 EL 100'-6" = 지면(콘코스·입구),
//     Level 4 +36'-8", Level 5 +46'-8", Level 6 +56'-8", 계단탑 상단 EL 167'-3"~168'-1" (지면 +67.5')
//   A42 (TEMP043) 입구·계단 입면: 입구 보 하단 EL 109'-6" / 상단 EL 113'-6"; 창벽 철판 상단 EL 171'-11⅝"; 지붕 데크 지지 EL 180'-10⅛" (지면 +80.3')
//   A36/A37 (TEMP037/038) 외벽 단면: 상부 외벽 = 단열 금속패널(트러스 깊이 20'), 하부 = 노출 콘크리트 + 알루미늄 창벽 9'-0"
//   2020 개보수 후 외형(위성 esri z20): 293' × 333' 직사각 박스, 남측 유리 로비 157' × 43', 서측 돌출 68' × 7.5',
//     지붕 평탄(막) + 중앙 펜트하우스 36' × 45', 옥상 설비 8기(11' 각) 2열×4행
// 로컬 프레임: 평면도 기준 x = 오른쪽(= 북), z = 아래(= 동, 9th St 쪽). 원점 = 본체 직사각형 중심, y = 0 = Level 3(지면).
import * as THREE from 'three';

export const meta = {
  id: 'hulman', name: 'Hulman Center', osm: 'way/183426119',
  anchor: [1377.59, 890.11], rotation: -90.206,   // tools/fit_footprint.py 결과 (RMS 0.82 ft)
  height: 83,
  preset: { pos: [1150, 170, 1330], tgt: [1378, 10, 890] },
  sheets: 'Hulman Center 1971 bid set: A3, A5, A7, A11, A12, A13, A36, A37, A40, A42 (+ esri z20 위성 외형)',
};

const HX = 166.3, HZ = 146.2;            // 본체 반폭: 남북 332.6', 동서 292.4'
const H_BASE = 14, H_CLER0 = 58, H_CLER1 = 70, H_ROOF = 81, PAR = 2;   // 콘크리트 기단 / 클리어스토리 띠 / 지붕 데크 (ft)
const LOBBY = { x0: -HX - 43.3, z0: -74.3, z1: 82.4, h: 30 };          // 남측 유리 로비 (위성 치수)
const BUMP = { x0: -37.6, x1: 30.6, d: 7.4, h: 14 };                   // 서측 돌출(8th St)

export const outline = [
  [HX, HZ], [HX, -HZ], [BUMP.x1, -HZ], [BUMP.x1, -HZ - BUMP.d], [BUMP.x0, -HZ - BUMP.d], [BUMP.x0, -HZ], [-HX, -HZ],
  [-HX, LOBBY.z0], [LOBBY.x0, LOBBY.z0], [LOBBY.x0, LOBBY.z1], [-HX, LOBBY.z1], [-HX, HZ],
];

export function build(M, G) {
  const parts = [];
  const rect = [[HX, HZ], [HX, -HZ], [-HX, -HZ], [-HX, HZ]];   // 본체 (평면 CCW: 북동 → 북서 → 남서 → 남동)

  // ---- 본체 외벽: 기단(프리캐스트 + 콘코스 창벽) / 금속패널 / 클리어스토리 유리띠 / 금속패널
  const edges = [
    [[HX, HZ], [HX, -HZ], true],                  // 북 (Eagle St)
    [[HX, -HZ], [BUMP.x1, -HZ], true], [[BUMP.x1, -HZ], [BUMP.x0, -HZ], false], [[BUMP.x0, -HZ], [-HX, -HZ], true],   // 서 (8th St)
    [[-HX, -HZ], [-HX, LOBBY.z0], true], [[-HX, LOBBY.z0], [-HX, LOBBY.z1], false], [[-HX, LOBBY.z1], [-HX, HZ], true], // 남 (Cherry St)
    [[-HX, HZ], [HX, HZ], true],                  // 동 (9th St)
  ];
  for (const [p0, p1, win] of edges) {
    if (win) {   // 기단: 콘코스 알루미늄 창벽 (A40: 창 높이 9'-0", 창대 1'), 24' 피치
      const w = G.windowGrid(p0, p1, { y0: 0, rows: 1, rowH: H_BASE, colW: 24, winW: 16, winH: 9, sill: 1.5, inset: 0.6, margin: 6 });
      parts.push({ geom: w.wall, mat: M.precast }); parts.push({ geom: w.glass, mat: M.pane, cast: false });
    } else parts.push({ geom: G.sideGeometry([p0, p1], 0, H_BASE, 1 / 24, 1 / 12, false), mat: M.precast });
  }
  parts.push({ geom: G.sideGeometry(rect, H_BASE, H_CLER0, 1 / 24, 1 / 12), mat: M.metal });           // 수직 금속패널 (2020)
  parts.push({ geom: G.sideGeometry(rect, H_CLER0, H_CLER1, 1 / 24, 1 / 12), mat: M.glass });          // 클리어스토리 띠
  parts.push({ geom: G.sideGeometry(rect, H_CLER1, H_ROOF + PAR, 1 / 24, 1 / 12), mat: M.metal });     // 상부 패널 + 파라펫
  parts.push({ geom: G.box(2 * HX + 2, 1.0, 1.0, 0, H_BASE, -HZ - 0.5), mat: M.dark });                  // 기단 상부 띠 (서)
  parts.push({ geom: G.box(2 * HX + 2, 1.0, 1.0, 0, H_BASE, HZ + 0.5), mat: M.dark });                   // (동)
  parts.push({ geom: G.box(1.0, 1.0, 2 * HZ + 2, HX + 0.5, H_BASE, 0), mat: M.dark });                   // (북)
  parts.push({ geom: G.box(1.0, 1.0, 2 * HZ + 2, -HX - 0.5, H_BASE, 0), mat: M.dark });                  // (남)

  // ---- 지붕: 평탄 막지붕 + 보울 위 완만히 솟은 중앙부(A7 SLOPE, 트러스 상현 ≈ +6') + 펜트하우스 + 옥상 설비
  const r = G.flatRoof(rect, H_ROOF, { parapet: PAR, thick: 1.0 });
  parts.push({ geom: r.slab, mat: M.roof_membrane }); parts.push({ geom: r.parapet, mat: M.metal });
  // 지붕면: A11–A13 단면의 트러스 상현이 외주에서 중앙 펜트하우스로 완만히 올라감(A7 "SLOPE") → 매끄러운 타원형 돔(격자 메시), 중앙 +6'
  const RH = 6.0;
  const roofY = (x, z) => { const r = Math.min(1, Math.hypot(x / (HX - 4), z / (HZ - 4))); const t = 1 - r * r; return H_ROOF + 0.05 + RH * t * t; };
  parts.push({ geom: gridSurface(-HX + 1, HX - 1, -HZ + 1, HZ - 1, 28, 24, roofY), mat: M.roof_membrane });
  parts.push({ geom: G.box(45, 14, 36, 0, roofY(0, 0) - 0.3, 0), mat: M.metal });                      // 중앙 펜트하우스 (HVAC)
  for (const x of [-124, -35, 24, 115]) for (const z of [-85, 91])                                        // 옥상 설비 2열 × 4행 (위성)
    parts.push({ geom: G.box(11, 9, 11, x, roofY(x, z) - 0.4, z), mat: M.dark });

  // ---- 남측 2층 유리 로비 (2020, Cherry St 광장 쪽): 157' × 43' × 30', 전면 캐노피
  const lob = [[-HX, LOBBY.z0], [LOBBY.x0, LOBBY.z0], [LOBBY.x0, LOBBY.z1], [-HX, LOBBY.z1]];
  parts.push({ geom: G.sideGeometry(lob, 0, LOBBY.h - 2, 1 / 24, 1 / 12, false), mat: M.glass });       // 3면 유리 (북면은 본체와 접함)
  parts.push({ geom: G.sideGeometry(lob, LOBBY.h - 2, LOBBY.h + 1.5, 1 / 24, 1 / 12, false), mat: M.white }); // 파시아
  const lr = G.flatRoof(lob, LOBBY.h, { parapet: 0, thick: 0.8 });
  parts.push({ geom: lr.slab, mat: M.roof_membrane });
  parts.push({ geom: G.box(10, 1.2, LOBBY.z1 - LOBBY.z0 + 6, LOBBY.x0 - 5, LOBBY.h - 2, (LOBBY.z0 + LOBBY.z1) / 2), mat: M.white }); // 상부 캐노피
  parts.push({ geom: G.box(12, 1.0, 60, LOBBY.x0 - 6, 13, (LOBBY.z0 + LOBBY.z1) / 2), mat: M.dark });   // 출입구 캐노피 (+13')
  for (let i = 0; i < 4; i++) parts.push({ geom: G.box(1, 13, 1, LOBBY.x0 - 11, 0, (LOBBY.z0 + LOBBY.z1) / 2 - 27 + i * 18), mat: M.dark });
  // 로비 전면 광장 포장
  parts.push({ geom: G.capGeometry([[LOBBY.x0 - 1, LOBBY.z0 - 40], [LOBBY.x0 - 1, LOBBY.z1 + 40], [LOBBY.x0 - 90, LOBBY.z1 + 40], [LOBBY.x0 - 90, LOBBY.z0 - 40]], [], 0.15), mat: M.walk, cast: false });

  // ---- 서측 돌출부 (8th St 쪽 출입 전실, 1층)
  const bp = [[BUMP.x1, -HZ], [BUMP.x1, -HZ - BUMP.d], [BUMP.x0, -HZ - BUMP.d], [BUMP.x0, -HZ]];
  parts.push({ geom: G.sideGeometry(bp, 0, BUMP.h, 1 / 24, 1 / 12, false), mat: M.glass });
  const br = G.flatRoof(bp, BUMP.h, { parapet: 1, thick: 0.6 });
  parts.push({ geom: br.slab, mat: M.roof_membrane }); parts.push({ geom: br.parapet, mat: M.dark });

  const grp = new THREE.Group();
  for (const m of G.mergeByMaterial(parts)) grp.add(m);
  return grp;
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

/** 초타원 폴리곤 (a = x 반축, b = z 반축), 평면 CCW ((x,-z) 양의 면적) */
function superEllipse(a, b, n) {
  const pts = [], e = 2 / 3.2;
  for (let i = 0; i < n; i++) {
    const t = -2 * Math.PI * i / n, c = Math.cos(t), s = Math.sin(t);
    pts.push([a * Math.sign(c) * Math.pow(Math.abs(c), e), b * Math.sign(s) * Math.pow(Math.abs(s), e)]);
  }
  return pts;
}

/** 두 폴리곤(같은 정점 수) 사이의 경사 띠: outer(y0) → inner(y1) */
function slopeBand(outer, inner, y0, y1) {
  const pos = [], uv = [], n = outer.length;
  for (let i = 0; i < n; i++) {
    const a = outer[i], b = outer[(i + 1) % n], c = inner[(i + 1) % n], d = inner[i];
    const q = [[a[0], y0, a[1]], [b[0], y0, b[1]], [c[0], y1, c[1]], [d[0], y1, d[1]]];
    pos.push(...q[0], ...q[1], ...q[2], ...q[0], ...q[2], ...q[3]);   // 법선 = 위·바깥쪽
    uv.push(0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.computeVertexNormals();
  return g;
}
