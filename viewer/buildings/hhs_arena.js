// Health and Human Services Building / ISU Arena (1962 체육관·아레나 + 2016 Health Professions 증축) — 사진·위성 기반
// 근거: Street View vp75 (5th St, (-376,-205) 에서 서쪽), vp76 (Chestnut St, (-663,164) 에서 북쪽), Esri z20/z19 위성.
// 볼륨 분할 (위성 지붕 색·그림자·설비 배치로 읽음, OSM 외곽선은 유지):
//   [A] 아레나 홀 (남, x -693..-424, z -45..125): 처마 35 ft, 남북 방향 접이식 콘크리트 박공 지붕 7 스팬(각 38.4 ft, 용마루 42 ft).
//       남·동·서면 = 적갈색 벽돌(brick_brown) + 4.3 ft 간격 수평 줄눈 밴드 7단, 하부 5 ft 노출골재 콘크리트 기단 + 백색 프리캐스트 필라스터(스팬 경계마다),
//       모서리 석회석 피어 7 ft. 남서 모서리 지하 램프(벽돌 옹벽) + 프리캐스트 테두리 지상창 22×7 ft (vp76_009/324).
//   [J] 체육관 블록 (x -637..-446, z -154..-45): 2층 28 ft, 벽돌, 지붕에 설비 다수 + 중앙 펜트하우스(위성).
//   [H] 리브 프리캐스트 블록 (x -637..-477, z -245..-154): 2층 28 ft, 상부 10 ft 는 수직 리브 프리캐스트 패널 (vp75_238).
//   [E1] 5th St 1층 유리 윙 (x -477..-440, z -245..-39): 14 ft, 연속 띠창(멀리언 4 ft) + 백색 파시아 (vp75_238/283).
//   [D] 입구 드럼 (z -257..-245): 곡면 벽돌 r 8 ft, 16 ft, 남쪽에 유리 쌍문 (vp75_283/328).
//   [E2] 드럼 북쪽 1층 유리 윙 (x -477..-441, z -350..-257): 13 ft (vp75_328).
//   [G] 2층 벽돌 블록 (x -628..-477, z -294..-245): 28 ft, 좁은 세로창, 지붕 천창 3개.
//   [F] 4층 커튼월 블록 (x -641..-477, z -377..-294): 48 ft, 동면 3단 유리 밴드 + 최상층 암회색 메탈 (vp75_283/328 배경).
//   [P] 2016 증축 입구 (x -441..-426, z -394..-350 돌출 + 광장): 탄 프리캐스트, 유리 로비, 석회석 사인월.
//   [C] 서측 2층 스트립 (x -768..-690, z -520..-288): 28 ft, 벽돌 (사진 없음 → 가정).
//   [L] 남서 사선 연결동 (pts 46..4): 1층 14 ft 벽돌 (가정).
//   [B] 2016 증축 남동 블록 (x -512..-421, z -520..-431): 3층 46 ft, 탄 프리캐스트 + 2층 높이 유리 밴드 (vp75_328 원경).
//   [Dd] 중앙 블록 (x -641..-512, z -520..-431): 36 ft 벽돌 (사진 없음 → 가정).
//   [Q] 1층 기계실 지붕 (x -690..-641, z -520..-378): 16 ft (위성에 설비 다수).
//   [S] 1층 복도 스트립 (x -679..-421, z -408..-377): 16 ft 백색 지붕.
//   [N] 북측 증축 홀 (x -775..-421, z -711..-520): 40 ft, 탄 프리캐스트 + 상부 유리 밴드 (사진 없음 → vp77_211 원경의 탄 박스 참고).
//   가정: 북·서면은 사진이 없어 재질·창 리듬을 추정. 층고 12–14 ft. 아레나 접이판 지붕 경사 0.36.
// ■ 항공사진 대조 (ISU 가상투어 드론 파노라마 college_of_health_and_human_services/f = 서면 전체, indiana_state_university/r,
//   sycamore_towers/b; 비교 scratch/aerial/hhs_arena.png): [C] 북쪽 129 ft 를 4층 60 ft 벽돌 블록(1층 석회석, 세로 쌍창, 통유리 계단창,
//   어두운 펜트하우스)으로, 그 남쪽 35 ft 를 4층 유리 커튼월로 고침. [N] 은 서면 크림 석회석 + 세로 핀 유리 커튼월, 북·동면 금빛 황갈 골강판 + 벽돌 피어.
//   아레나 7 스팬 접이판 지붕·[J] 옥상 설비는 사진과 일치.
import * as THREE from 'three';

export const meta = {
  id: 'hhs', name: 'Health and Human Services Building / Arena', osm: 'way/752686738',
  anchor: [0, 0], rotation: 0, height: 72,
  preset: { pos: [-210, 190, 230], tgt: [-560, 15, -180] },
  sheets: 'Street View 2019-2023 (vp75, vp76), Esri imagery z20/z19',
};

// ---- 공통 헬퍼 -------------------------------------------------------------------------------
const rect = (x0, x1, z0, z1) => [[x0, z1], [x1, z1], [x1, z0], [x0, z0]];   // CCW (위에서 봤을 때): 남서→남동→북동→북서
function roofOf(parts, poly, y, M, G, { mat, parapet = 1.5 } = {}) {
  const r = G.flatRoof(poly, y, { parapet, thick: 0.6 });
  parts.push({ geom: r.slab, mat: mat || M.roof_gravel });
  if (r.parapet) parts.push({ geom: r.parapet, mat: M.trim });
}
/** 사각 볼륨: 4면 벽 (face 콜백이 재질/치환을 결정) + 평지붕 */
function block(parts, poly, y0, y1, M, G, { mat, roof, parapet = 1.5, skip = [] } = {}) {
  const n = poly.length;
  for (let i = 0; i < n; i++) {
    if (skip.includes(i)) continue;
    parts.push({ geom: G.sideGeometry([poly[i], poly[(i + 1) % n]], y0, y1, 1 / 24, 1 / 12, false), mat });
  }
  roofOf(parts, poly, y1, M, G, { mat: roof, parapet });
}
/** 띠창 벽: p0→p1 CCW, 창 한 줄 + 위아래 벽 */
function ribbon(parts, p0, p1, y0, y1, M, G, { sill = 2.5, head = 1.8, mullion = 4, wall = null, margin = 0.5 } = {}) {
  const w = G.windowGrid(p0, p1, { y0, rows: 1, rowH: y1 - y0, colW: mullion, winW: mullion - 0.35, winH: y1 - y0 - sill - head, sill, margin, inset: 0.3 });
  parts.push({ geom: w.wall, mat: wall || M.trim }); if (w.glass) parts.push({ geom: w.glass, mat: M.pane, cast: false });
}
/** 기둥/멀리언 박스 (p0→p1 방향 벽의 바깥면에 붙음) */
function strip(parts, p0, p1, y, h, depth, mat, G, offset = 0) {
  const dx = p1[0] - p0[0], dz = p1[1] - p0[1], len = Math.hypot(dx, dz);
  const nx = -dz / len, nz = dx / len;                       // 바깥 법선
  const cx = (p0[0] + p1[0]) / 2 + nx * (offset + depth / 2), cz = (p0[1] + p1[1]) / 2 + nz * (offset + depth / 2);
  parts.push({ geom: G.box(len, h, depth, cx, y, cz, { ry: -Math.atan2(dz, dx) }), mat });
}
/** 벽면의 위치 s (p0 로부터) 에 폭 w 의 피어 */
function pier(parts, p0, p1, s, w, y, h, depth, mat, G, offset = 0) {
  const dx = p1[0] - p0[0], dz = p1[1] - p0[1], len = Math.hypot(dx, dz);
  const ex = dx / len, ez = dz / len, nx = -ez, nz = ex;
  const cx = p0[0] + ex * s + nx * (offset + depth / 2), cz = p0[1] + ez * s + nz * (offset + depth / 2);
  parts.push({ geom: G.box(w, h, depth, cx, y, cz, { ry: -Math.atan2(dz, dx) }), mat });
}

export function build(M, G) {
  const parts = [];
  const brick = M.brick_brown;

  // ================= [A] 아레나 홀 =================
  const AX0 = -693, AX1 = -424, AZ0 = -45, AZ1 = 125, EAVE = 35, BASE = 5, NV = 7;
  const A = rect(AX0, AX1, AZ0, AZ1);
  const vaultW = (AX1 - AX0) / NV;
  // 벽: 남(0) 동(1) 북(2, 체육관 블록 위로 노출) 서(3)
  for (let i = 0; i < 4; i++) {
    const p0 = A[i], p1 = A[(i + 1) % 4];
    parts.push({ geom: G.sideGeometry([p0, p1], 0, BASE, 1 / 24, 1 / 12, false), mat: M.concrete });   // 노출골재 기단
    parts.push({ geom: G.sideGeometry([p0, p1], BASE, EAVE, 1 / 24, 1 / 12, false), mat: brick });
    if (i === 2) continue;   // 북면은 체육관 블록에 대부분 가림 → 밴드 생략
    // 수평 줄눈 밴드 (오목 줄눈 → 가는 어두운 띠)
    for (let k = 1; k <= 7; k++) strip(parts, p0, p1, BASE + k * 4.2, 0.3, 0.12, M.dark, G);
    // 기단 프리캐스트 필라스터 (남·동·서면, 스팬 경계마다) + 상단 갓돌
    const len = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]);
    const nP = i === 0 ? NV : 4;
    for (let k = 1; k < nP; k++) pier(parts, p0, p1, len * k / nP, 2.0, 0, BASE + 0.5, 0.5, M.precast, G);
    strip(parts, p0, p1, BASE - 0.4, 0.4, 0.3, M.precast, G);
  }
  // 모서리 석회석 피어 (남동·남서, 전체 높이)
  for (const [x, z] of [[AX0 + 3.5, AZ1 - 3.5], [AX1 - 3.5, AZ1 - 3.5]]) parts.push({ geom: G.box(7.5, EAVE + 1, 7.5, x, 0, z), mat: M.limestone });
  // 남서 모서리: 지상창 (프리캐스트 테두리) + 지하 램프 옹벽
  {
    const wx0 = AX0 + 9, wx1 = wx0 + 22;
    parts.push({ geom: G.box(24, 9, 0.8, (wx0 + wx1) / 2, 1.5, AZ1 + 0.3), mat: M.precast });
    parts.push({ geom: G.box(22, 7, 0.4, (wx0 + wx1) / 2, 2.5, AZ1 + 0.6), mat: M.pane, cast: false });
    for (const [s, e] of [[wx0 + 7.3, wx0 + 7.6], [wx0 + 14.6, wx0 + 14.9]]) parts.push({ geom: G.box(e - s, 7, 0.2, (s + e) / 2, 2.5, AZ1 + 0.9), mat: M.dark });
    parts.push({ geom: G.box(24, 0.3, 0.2, (wx0 + wx1) / 2, 6.0, AZ1 + 0.9), mat: M.dark });
    // 램프: 남벽을 따라 동→서로 내려감 (옹벽 2 ft 두께, 높이 4 ft → 0)
    parts.push({ geom: G.box(34, 4, 1.5, AX0 + 18, 0, AZ1 + 9.5), mat: brick });
    parts.push({ geom: G.box(1.5, 4, 9, AX0 + 35.5, 0, AZ1 + 5), mat: brick });
    parts.push({ geom: G.box(34, 0.25, 1.8, AX0 + 18, 4, AZ1 + 9.5), mat: M.limestone });
  }
  // 서측 계단/비상구 포드 2개 (OSM 돌출부 x -707.5, z -55..-14 / 24..64): 벽돌 20 ft
  for (const [z0, z1] of [[-55.5, -13.8], [24, 64.2]]) block(parts, rect(-707.6, AX0 + 0.5, z0, z1), 0, 20, M, G, { mat: brick, skip: [1] });
  // 접이식 박공 지붕 7 스팬 (남북 용마루) + 양끝 프리캐스트 박공면
  for (let v = 0; v < NV; v++) {
    const x0 = AX0 + v * vaultW, x1 = x0 + vaultW;
    parts.push({ geom: G.gableRoof(rect(x0, x1, AZ0, AZ1), EAVE, 0.36, 90), mat: M.roof_dark });
    const xm = (x0 + x1) / 2, ridge = EAVE + (vaultW / 2) * 0.36;
    for (const [z, dir] of [[AZ1, 1], [AZ0, -1]]) {               // 박공 삼각형 (벽면에서 0.3 ft 돌출)
      const t = [[x0, EAVE - 0.5, z + dir * 0.3], [x1, EAVE - 0.5, z + dir * 0.3], [xm, ridge, z + dir * 0.3]];
      if (dir < 0) t.reverse();
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(t.flat(), 3));
      g.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, 1, 0, 0.5, 1], 2));
      g.computeVertexNormals();
      parts.push({ geom: g, mat: M.precast });
    }
    // 박공 하단 가는 클리어스토리 띠 (양끝)
    parts.push({ geom: G.box(vaultW - 4, 1.2, 0.2, xm, EAVE - 0.5, AZ1 + 0.45), mat: M.dark, cast: false });
  }

  // ================= [J] 체육관 블록 (2층, 지붕 설비) =================
  const J = rect(-637, -446, -154, AZ0);
  block(parts, J, 0, 28, M, G, { mat: brick, skip: [2] });     // 북면은 [H] 와 접함 (x -637..-477) → 동쪽 노출부만 보강
  parts.push({ geom: G.sideGeometry([[-446, -154], [-477, -154]], 0, 28, 1 / 24, 1 / 12, false), mat: brick });
  parts.push({ geom: G.box(40, 12, 26, -540, 28, -100), mat: M.precast });                                       // 중앙 펜트하우스
  for (const [x, z] of [[-610, -135], [-580, -135], [-500, -135], [-470, -135], [-610, -70], [-580, -70], [-500, -70], [-470, -70], [-560, -62], [-520, -62]])
    parts.push({ geom: G.box(8, 4.5, 6, x, 28, z), mat: M.metal });

  // ================= [H] 리브 프리캐스트 블록 (2층) =================
  const H = rect(-637, -477, -245, -154);
  block(parts, H, 0, 28, M, G, { mat: brick, skip: [1] });       // 동면(1)은 아래에서 별도
  {   // 동면: 하부 18 ft 벽돌 (1층 유리 윙에 가림), 상부 10 ft 리브 프리캐스트 + 벽돌 피어
    const p0 = [-477, -154], p1 = [-477, -245];
    parts.push({ geom: G.sideGeometry([p0, p1], 0, 18, 1 / 24, 1 / 12, false), mat: brick });
    parts.push({ geom: G.sideGeometry([p0, p1], 18, 28, 1 / 24, 1 / 12, false), mat: M.precast });
    for (let s = 0; s <= 91; s += 1.5) pier(parts, p0, p1, s + 0.75, 0.5, 18.5, 9, 0.35, M.trim, G);   // 수직 리브
    for (let s = 0; s < 91; s += 22.75) pier(parts, p0, p1, s + 11.4, 3.0, 18, 10, 0.5, brick, G);  // 벽돌 피어
  }
  for (const [x, z] of [[-600, -165], [-520, -165]]) parts.push({ geom: G.box(8, 4.5, 6, x, 28, z), mat: M.metal });

  // ================= [E1] 5th St 1층 유리 윙 + [D] 입구 드럼 + [E2] 북쪽 유리 윙 =================
  {
    const E1 = rect(-477, -440.5, -245.7, -39.2);
    ribbon(parts, [-440.5, -39.2], [-440.5, -245.7], 0, 14.5, M, G, { sill: 2.6, head: 2.4, mullion: 4.0 });   // 동면 띠창
    parts.push({ geom: G.sideGeometry([[-477, -39.2], [-440.5, -39.2]], 0, 14.5, 1 / 24, 1 / 12, false), mat: brick });   // 남쪽 끝벽
    strip(parts, [-440.5, -39.2], [-440.5, -245.7], 12.1, 2.4, 0.5, M.white, G);    // 백색 파시아
    strip(parts, [-440.5, -39.2], [-440.5, -245.7], 2.0, 0.6, 0.4, M.limestone, G); // 창대 석재
    roofOf(parts, E1, 14.5, M, G, { parapet: 0.8 });
    // 입구: 드럼 남측 유리 쌍문 (x=-440.5, z -245.7..-236)
    parts.push({ geom: G.box(0.4, 9, 9, -440.3, 0.2, -241), mat: M.glass, cast: false });
    parts.push({ geom: G.box(0.15, 8, 7, -440.0, 0, -241), mat: M.dark, cast: false });
    // 드럼 (반원기둥, 벽돌)
    parts.push({ geom: G.cylinder(8.5, 16.5, -441, 0, -251.5, 24), mat: brick });
    parts.push({ geom: G.cylinder(8.8, 0.6, -441, 16.5, -251.5, 24), mat: M.limestone });
    // 캐노피 (입구 위)
    parts.push({ geom: G.box(10, 0.8, 8, -436, 11, -238), mat: M.white });
    // [E2] 북쪽 유리 윙
    const E2 = rect(-477, -441, -350, -257.2);
    ribbon(parts, [-441, -257.2], [-441, -350], 0, 13, M, G, { sill: 2.6, head: 2.2, mullion: 4.0 });
    strip(parts, [-441, -257.2], [-441, -350], 10.8, 2.2, 0.5, M.white, G);
    parts.push({ geom: G.sideGeometry([[-441, -350], [-477, -350]], 0, 13, 1 / 24, 1 / 12, false), mat: brick });
    roofOf(parts, E2, 13, M, G, { parapet: 0.8 });
  }

  // ================= [G] 2층 벽돌 블록 (세로창) =================
  {
    const Gp = rect(-628, -477, -294, -245);
    block(parts, Gp, 0, 28, M, G, { mat: brick, skip: [1] });
    const w = G.windowGrid([-477, -245], [-477, -294], { y0: 0, rows: 2, rowH: 14, colW: 9, winW: 2.2, winH: 8, sill: 3.5, margin: 2, inset: 0.4 });
    parts.push({ geom: w.wall, mat: brick }); parts.push({ geom: w.glass, mat: M.pane, cast: false });
    for (const x of [-600, -560, -520]) parts.push({ geom: G.box(10, 2.5, 6, x, 28, -270), mat: M.glass, cast: false });   // 천창
  }

  // ================= [F] 4층 커튼월 블록 =================
  {
    const F = rect(-641, -477, -377, -294);
    block(parts, F, 0, 48, M, G, { mat: brick, skip: [1], parapet: 1.0 });
    const p0 = [-477, -294], p1 = [-477, -377];
    // 동면: 1층 벽돌(유리 윙 뒤), 2·3·4층 유리 밴드 + 스팬드럴, 최상층 암회색 메탈
    parts.push({ geom: G.sideGeometry([p0, p1], 0, 13, 1 / 24, 1 / 12, false), mat: brick });
    for (let f = 0; f < 3; f++) {
      const b = 13 + f * 11.5;
      parts.push({ geom: G.sideGeometry([p0, p1], b, b + 2.5, 1 / 24, 1 / 12, false), mat: f === 2 ? M.dark : M.precast });   // 스팬드럴
      parts.push({ geom: G.sideGeometry([p0, p1], b + 2.5, b + 11.5, 1 / 24, 1 / 12, false), mat: M.glass });
      for (let s = 5; s < 83; s += 5) pier(parts, p0, p1, s, 0.3, b + 2.5, 9, 0.3, M.dark, G);                       // 멀리언
    }
    // 최상층 메탈 패널 띠 (지붕 아래 4 ft) 및 남면 상부 메탈
    strip(parts, p0, p1, 44, 4.5, 0.3, M.dark, G);
    strip(parts, [-641, -294], [-477, -294], 44, 4.5, 0.3, M.dark, G);
    strip(parts, [-641, -294], [-477, -294], 38, 0.5, 0.3, M.dark, G);
    for (const [x, z] of [[-610, -340], [-560, -340], [-510, -340]]) parts.push({ geom: G.box(10, 5, 8, x, 48, z), mat: M.metal });
  }

  // ================= [P] 2016 증축 입구 (탄 프리캐스트 + 유리 로비) =================
  {
    const P = [[-477, -350], [-425.6, -350.1], [-425.7, -394.1], [-477, -394]];
    block(parts, P, 0, 22, M, G, { mat: M.precast, skip: [1, 3] });
    parts.push({ geom: G.sideGeometry([[-425.6, -350.1], [-425.7, -394.1]], 0, 22, 1 / 24, 1 / 12, false), mat: M.glass });
    for (let z = -355; z > -390; z -= 5) parts.push({ geom: G.box(0.3, 20, 0.3, -425.4, 0, z), mat: M.dark });
    parts.push({ geom: G.box(0.15, 9, 12, -425.3, 0, -372), mat: M.dark, cast: false });        // 쌍문 프레임
    parts.push({ geom: G.box(22, 0.9, 10, -430, 13, -372), mat: M.precast });                     // 캐노피
    parts.push({ geom: G.box(1.5, 5, 28, -412, 0, -372), mat: M.limestone });                     // 사인월 (광장)
    parts.push({ geom: G.capGeometry(rect(-425.5, -400, -400, -345), [], 0.25), mat: M.walk, cast: false });   // 광장 포장
  }

  // ================= [S] 1층 복도 스트립, [Q] 기계실 지붕, [Dd] 중앙 블록, [B] 증축 남동 블록 =================
  block(parts, rect(-679, -441, -408, -377), 0, 16, M, G, { mat: brick, roof: M.roof_membrane, skip: [2] });
  parts.push({ geom: G.sideGeometry([[-441, -408], [-434.1, -407.8]], 0, 16, 1 / 24, 1 / 12, false), mat: brick });
  block(parts, rect(-441.1, -434, -407.8, -394.1), 0, 16, M, G, { mat: brick, roof: M.roof_membrane });
  block(parts, rect(-690, -641, -520, -378), 0, 16, M, G, { mat: brick, roof: M.roof_membrane });
  for (const [x, z] of [[-675, -500], [-655, -500], [-675, -470], [-655, -470], [-675, -440], [-655, -440], [-675, -410], [-655, -410]])
    parts.push({ geom: G.box(7, 4, 7, x, 16, z), mat: M.metal });
  {   // [Dd] 중앙 블록 36 ft (벽돌, 창 없음 — 사진 없음)
    const Dd = rect(-641, -512, -520, -431);
    block(parts, Dd, 0, 36, M, G, { mat: brick });
    for (const [x, z] of [[-600, -470], [-560, -470]]) parts.push({ geom: G.box(10, 5, 8, x, 36, z), mat: M.metal });
  }
  {   // [B] 증축 남동 블록: 탄 프리캐스트, 동면·남면 2층 높이 유리 밴드 (vp75_328)
    const B = rect(-512, -422, -520, -431);
    block(parts, B, 0, 46, M, G, { mat: M.precast, roof: M.roof_membrane, parapet: 1.0 });
    for (const [p0, p1] of [[[-422, -431], [-422, -520]], [[-512, -431], [-422, -431]]]) {
      strip(parts, p0, p1, 16, 22, 0.35, M.glass, G);                     // 2·3층 유리 밴드 (돌출 0.35)
      const len = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]);
      for (let s = 5; s < len; s += 5) pier(parts, p0, p1, s, 0.35, 16, 22, 0.5, M.dark, G);
      strip(parts, p0, p1, 27, 1.2, 0.5, M.dark, G);                       // 층 스팬드럴 라인
    }
    strip(parts, [-422, -431], [-422, -520], 3, 8, 0.3, M.glass, G);        // 1층 유리
  }

  // ================= [N] 북측 증축 홀 (사진 없음 → 탄 프리캐스트 + 상부 띠창 가정) =================
  {
    const N = [[-774.2, -520], [-422.5, -520], [-422.7, -706.2], [-679.3, -705.6], [-679.3, -711.1], [-774.2, -710.9]];
    // 항공사진: 북·동면 = 금빛 황갈 골강판 패널 + 하부 벽돌 피어 (north_view_of_campus/r), 서면 = 크림 석회석 (cohhs/f)
    const goldPanel = M.metal.clone(); goldPanel.color = new THREE.Color(1.45, 1.25, 0.82); goldPanel.roughness = 0.55; goldPanel.metalness = 0.3; goldPanel.name = 'hhs_gold_panel';
    block(parts, N, 0, 40, M, G, { mat: goldPanel, roof: M.roof_membrane, parapet: 1.0 });
    parts.push({ geom: G.sideGeometry([[-774.4, -710.9], [-774.4, -520]], 0, 41, 1 / 24, 1 / 12, false), mat: M.limestone });
    for (let x = -760; x < -430; x += 24) parts.push({ geom: G.box(4, 12, 1.2, x, 0, x < -681 ? -711.6 : -706.8), mat: brick });   // 북면 하부 벽돌 피어
    for (const [p0, p1] of [[[-422.5, -520], [-422.7, -706.2]], [[-679.3, -711.1], [-774.2, -710.9]], [[-422.7, -706.2], [-679.3, -705.6]]]) {
      strip(parts, p0, p1, 26, 9, 0.3, M.glass, G);                          // 상부 띠창
      const len = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]);
      for (let s = 6; s < len; s += 6) pier(parts, p0, p1, s, 0.3, 26, 9, 0.45, M.dark, G);
      strip(parts, p0, p1, 12, 1.0, 0.3, M.dark, G);
    }
    // [항공사진] 서면(x -774): 석회석 기단 + 14..37 ft 유리 커튼월에 촘촘한 세로 핀(2 ft), 북단 30 ft 는 석회석 무창 + 세로 창 1 줄
    {
      const p0 = [-774.2, -710.9], p1 = [-774.2, -520];
      strip(parts, [p0[0], -682], p1, 14, 23, 0.3, M.glass, G);
      for (let z = -682; z <= -522; z += 2) parts.push({ geom: G.box(1.4, 23, 0.25, -774.9, 14, z), mat: M.trim });
      strip(parts, [p0[0], -682], p1, 37, 1.2, 0.8, M.trim, G);
      strip(parts, [p0[0], -704], [p0[0], -688], 12, 26, 0.25, M.glass, G);
    }
    for (const x of [-625, -560, -495]) parts.push({ geom: G.cylinder(5, 4, x, 40, -616, 16), mat: M.metal });   // 원형 설비 3기
    for (const z of [-690, -660, -630, -600, -570, -540]) parts.push({ geom: G.box(12, 3, 2, -760, 40, z), mat: M.metal });
  }

  // ================= [C] 서측 2층 스트립 + [L] 남서 사선 연결동 =================
  // [항공사진으로 수정] college_of_health_and_human_services/f (서쪽 3rd St 상공에서 동쪽을 본 사진, 비교 scratch/aerial/hhs_arena.png):
  //   [C] 의 북쪽 129 ft (z -520..-391) 는 2층 28 ft 가 아니라 4층 60 ft — 1층 석회석(0..15) + 2~4층 주황빛 황갈 벽돌, 베이마다 세로 쌍창,
  //   서면 가운데에 4층 통유리 계단창, 지붕 위 어두운 금속 펜트하우스. 그 남쪽 35 ft (z -391..-356) 는 4층 유리 커튼월 + 1층 출입 캐노피,
  //   나머지 (z -356..-320) 는 2층 28 ft 석회석 + 벽돌.
  {
    const ls = M.limestone, tanBrick = M.brick_tan.clone(); tanBrick.color = new THREE.Color(1.04, 0.78, 0.66); tanBrick.name = 'hhs_brick_c';
    const H4 = 60;
    const C4 = rect(-768, -690, -520, -391);
    // 벽 (서면은 개구 포함으로 별도)
    const wpane = (p0, p1, s0, s1, y0, y1) => { const dx = p1[0] - p0[0], dz = p1[1] - p0[1], L = Math.hypot(dx, dz), ex = dx / L, ez = dz / L, nx = -ez, nz = ex, a = [p0[0] + ex * s0 - nx * 0.5, p0[1] + ez * s0 - nz * 0.5], b = [p0[0] + ex * s1 - nx * 0.5, p0[1] + ez * s1 - nz * 0.5]; parts.push({ geom: G.sideGeometry([a, b], y0, y1, 1 / (s1 - s0), 1 / (y1 - y0), false), mat: M.pane, cast: false }); };
    const W0 = [-768, -520], W1 = [-768, -391], L = 129;
    const opsB = [], opsL = [];
    const nb = 12, bw = L / nb;
    for (let k = 0; k < nb; k++) {
      const c = (k + 0.5) * bw;
      if (k === 5 || k === 6) continue;                                    // 가운데 통유리 계단창 자리
      for (const [b0, t0] of [[18, 26.5], [32, 40.5], [46, 54.5]]) for (const d of [-1.5, 1.5]) opsB.push({ s: c + d - 1.1, e: c + d + 1.1, b: b0, t: t0 });
      opsL.push({ s: c - 3, e: c + 3, b: 3, t: 11 });
    }
    opsB.push({ s: 5 * bw + 1, e: 7 * bw - 1, b: 15.5, t: 57 });
    parts.push({ geom: G.wallSeg(W0, W1, 15, H4, { openings: opsB.map(o => ({ ...o })) }), mat: tanBrick });
    parts.push({ geom: G.wallSeg(W0, W1, 0, 15, { openings: opsL }), mat: ls });
    for (const o of [...opsB, ...opsL]) wpane(W0, W1, o.s, o.e, o.b, o.t);
    for (let k = 0; k <= 6; k++) pier(parts, W0, W1, 5 * bw + 1 + k * (2 * bw - 2) / 6, 0.3, 15.5, 41.5, 0.5, M.dark, G, -0.5);   // 계단창 멀리언
    for (const y of [29, 43]) strip(parts, [W0[0], -520 + 5 * bw + 1], [W0[0], -520 + 7 * bw - 1], y, 1.2, 0.6, M.dark, G, -0.5);
    strip(parts, W0, W1, 14.6, 1.0, 0.4, ls, G); strip(parts, W0, W1, H4 - 0.5, 1.5, 0.5, ls, G);
    for (const [a, b] of [[C4[0], C4[1]], [C4[1], C4[2]], [C4[2], C4[3]]]) {
      parts.push({ geom: G.sideGeometry([a, b], 0, 15, 1 / 24, 1 / 12, false), mat: ls });
      const w = G.windowGrid(a, b, { y0: 15, rows: 3, rowH: 15, colW: 10.75, winW: 4.4, winH: 8.5, sill: 3, margin: 4, inset: 0.4 });
      parts.push({ geom: w.wall, mat: tanBrick }); parts.push({ geom: w.glass, mat: M.pane, cast: false });
    }
    roofOf(parts, C4, H4, M, G, { parapet: 1.5 });
    parts.push({ geom: G.box(42, 11, 100, -728, H4, -455), mat: M.dark });                     // 어두운 금속 펜트하우스
    // 유리 커튼월 구간 (z -391..-356, 58 ft)
    const CG = rect(-768, -700, -391, -356);
    block(parts, CG, 0, 58, M, G, { mat: M.glass, parapet: 1.0 });
    for (let z = -391; z <= -356; z += 5) parts.push({ geom: G.box(0.5, 58, 0.6, -768.3, 0, z), mat: M.dark });
    for (const y of [15, 30, 45]) parts.push({ geom: G.box(0.6, 1.2, 35, -768.3, y, -373.5), mat: M.dark });
    parts.push({ geom: G.box(14, 1.2, 40, -775, 13, -373.5), mat: M.white });                     // 출입 캐노피
    // 남쪽 2층 (z -356..-320)
    const C2 = rect(-768, -690, -356, -320);
    block(parts, C2, 0, 28, M, G, { mat: tanBrick });
    { const w = G.windowGrid([-768, -356], [-768, -320], { y0: 0, rows: 2, rowH: 14, colW: 12, winW: 6, winH: 6, sill: 4, margin: 6, inset: 0.4 });
      parts.push({ geom: w.wall, mat: ls }); parts.push({ geom: w.glass, mat: M.pane, cast: false }); }
  }
  for (const [x, z] of [[-740, -480], [-740, -420], [-740, -360]]) parts.push({ geom: G.box(10, 4, 8, x, 28, z), mat: M.metal });
  {
    const L = [[-773.9, -319.7], [-753.9, -324.8], [-733.4, -250.1], [-684.2, -263.4], [-686.8, -272.9], [-676.8, -275.6], [-683.5, -299.7], [-690, -320]];   // OSM 순서 = CCW
    block(parts, L, 0, 14, M, G, { mat: brick });
    const w = G.windowGrid([-733.4, -250.1], [-753.9, -324.8], { y0: 0, rows: 1, rowH: 14, colW: 8, winW: 4.5, winH: 5.5, sill: 4, margin: 4, inset: 0.4 });
    parts.push({ geom: w.wall, mat: brick }); parts.push({ geom: w.glass, mat: M.pane, cast: false });
  }
  // [I] 서측 1.5층 블록 (x -702..-637, z -183..-60): 20 ft 벽돌
  block(parts, [[-697.4, AZ0], [-637, AZ0], [-637, -183.2], [-702, -183.2], [-702, -66], [-697.4, -66]], 0, 20, M, G, { mat: brick });
  {
    const w = G.windowGrid([-702, -66], [-702, -183.2], { y0: 0, rows: 1, rowH: 20, colW: 10, winW: 5, winH: 6, sill: 9, margin: 4, inset: 0.4 });
    parts.push({ geom: w.wall, mat: brick }); parts.push({ geom: w.glass, mat: M.pane, cast: false });
  }

  const grp = new THREE.Group();
  for (const m of G.mergeByMaterial(parts)) grp.add(m);
  return grp;
}
