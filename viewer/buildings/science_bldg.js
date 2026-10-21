// Science Building (Unit I 1960 + Unit II 1968, 1989 서측 입구 증축) — 위성 기반 (Street View 없음)
// 근거: Esri z20(겨울, 0.38 ft/px)·z19(여름) 위성. scratch/sv/461428306 의 사진(vp20, vp21)은 실제로 HMSU·Dede 를 찍은 것이라
//       이 건물의 입면 사진은 없다 → 입면 재질·창 패턴은 가정 (site.json 추정 brick_brown, 1960 년대 실험동의 수평 띠창).
// ■ 볼륨 분할 (OSM 외곽선 way/461428306 유지, 점 번호는 site.json 순서)
//   [A] 본관 4층 (x 36..204, z -274..122; 층고 13.5 ft → 지붕 54, 파라펫 57.5): 위성의 남북 방향 긴 지붕 + 2 줄 덕트 스파인
//       (x 100..108 전장, x 161..168 z -274..38) + 동쪽 날개 대형 공조기 6 기 + 서·동면의 돌출 설비 샤프트(32 ft 간격, 지붕 위 흰 배기후드 —
//       위성에서 벽면 바깥 흰 'ㄷ'자와 북동으로 뻗은 규칙적인 그림자로 확인). 입면 = 갈색 벽돌 + 층마다 연속 띠창(멀리언 6 ft) + 석회석 창대 띠.
//       지붕 남쪽: 관측 돔 (중심 (137.5, 53), r 10, 흰 반구 + 드럼), 온실 2 동 — 백색 유리 박공 온실 x 97..200, z 72..87 과
//       회색 유리 온실 x 160..200, z 38..71 (위성 격자 무늬).
//   [N] 북측 동 (점 29–34, x 33..109, z -407..-314): 3층 42 ft, 남측 정사각 볼륨 (x 56..90, z -353..-314) 은 52 ft 로 솟음
//       (겨울 영상에서 북쪽에 그림자 띠) — 강당/계단식 강의실로 가정, 무창 벽돌.
//   [C] 연결동 (점 24–29, 34–40): 1층 16 ft, 유리 + 벽돌.
//   [W] 1989 서측 입구 증축 (점 0–5, x -4..36, z -137..-67): 2층 30 ft 벽돌 + 서·남면 유리 아트리움(위성의 흰 'ㄴ'자 = 8 ft 경사 유리 지붕).
//   [S] 남서 저층부 (점 8–11, x 26..100, z 37..74): 2층 28 ft. [L] 남측 연결 (x 78..100, z 21..37): 18 ft (위성에서 남측 동 그림자 안).
//   [E] 동측 입구 (점 14–21, x 203..232, z -141..-105): 1층 16 ft, 유리문 + 캐노피.
// 가정: 모든 입면 패턴·재질(사진 없음), 층고, 북측 동 높이, 증축부 유리 형태.
// ■ 항공사진 대조 (ISU 가상투어 드론 파노라마 fountain/r 근경·fountain/f, holmstedt_hall_stalker_hall/b; 비교 scratch/aerial/science_bldg.png):
//   [S] 남서부는 2층이 아니라 본관과 같은 4층, 서면 전체가 유리 커튼월(층마다 검은 수평 차양) + 앞 판석 광장.
//   지붕은 흰색이 아닌 회갈색 자갈. 관측 돔·온실·덕트 스파인·배기 스택은 사진과 일치. 벽돌은 갈색(유지).
import * as THREE from 'three';

export const meta = {
  id: 'science', name: 'Science Building', osm: 'way/461428306',
  anchor: [0, 0], rotation: 0, height: 69,
  preset: { pos: [-250, 200, 110], tgt: [110, 15, -140] },
  sheets: 'Esri imagery z20/z19 (no Street View coverage of this building)',
};

const area = p => { let a = 0; for (let i = 0; i < p.length; i++) { const q = p[i], r = p[(i + 1) % p.length]; a += r[0] * q[1] - q[0] * r[1]; } return a / 2; };
const ccw = p => (area(p) > 0 ? p : [...p].reverse());
const rectXZ = (x0, x1, z0, z1) => ccw([[x0, z0], [x1, z0], [x1, z1], [x0, z1]]);
const SP = [[37.24, -137.01], [-3.69, -136.76], [-3.52, -109.6], [3.04, -109.63], [3.27, -67.67], [35.61, -67.89], [36.14, 21.4], [77.59, 21.14], [77.67, 36.52], [25.66, 36.81], [25.88, 73.91], [77.36, 73.62], [77.64, 122.36], [204.6, 121.64], [203.22, -118.95], [218.33, -119.03], [218.41, -105.35], [232.17, -105.43], [231.97, -140.53], [212.46, -140.42], [212.52, -130.27], [203.47, -130.23], [203.41, -137.74], [202.63, -274.03], [89.01, -273.41], [88.92, -286.79], [101.86, -286.87], [101.78, -303.08], [91.91, -303.04], [91.85, -314.54], [108.88, -314.65], [108.35, -407.45], [33.3, -407.02], [33.83, -313.45], [76.63, -313.7], [76.71, -303.77], [61.6, -303.66], [61.69, -287.74], [66.71, -287.77], [66.73, -281.9], [66.79, -273.41], [36.48, -273.23]];
const pick = idx => idx.map(i => (typeof i === 'number' ? SP[i] : i));

export function build(M, G) {
  const parts = [];
  const P = (geom, mat, cast) => { if (geom) parts.push({ geom, mat, cast }); };
  const cached = (k, f) => { if (!M._cache.has(k)) M._cache.set(k, f()); return M._cache.get(k); };
  const ghWhite = cached('sci_gh_white', () => new THREE.MeshStandardMaterial({ color: 0xe8ece9, roughness: 0.35, metalness: 0.1, transparent: true, opacity: 0.92 }));
  const ghGlass = cached('sci_gh_glass', () => new THREE.MeshStandardMaterial({ color: 0x9fb0b8, roughness: 0.15, metalness: 0.4 }));
  const brick = M.brick_brown, ls = M.limestone, wh = M.white;

  // ---------------------------------------------------------------- 헬퍼
  const E = (p0, p1) => { const dx = p1[0] - p0[0], dz = p1[1] - p0[1], L = Math.hypot(dx, dz); return { ex: [dx / L, dz / L], n: [-dz / L, dx / L], L, ry: -Math.atan2(dz, dx) }; };
  const at = (p0, e, s, off) => [p0[0] + e.ex[0] * s + e.n[0] * off, p0[1] + e.ex[1] * s + e.n[1] * off];
  function bx(p0, p1, s0, s1, y0, y1, off, depth, mat) { const e = E(p0, p1), c = at(p0, e, (s0 + s1) / 2, off + depth / 2); P(G.box(s1 - s0, y1 - y0, depth, c[0], y0, c[1], { ry: e.ry }), mat); }
  function pane(p0, p1, s0, s1, y0, y1, inset, mat = M.pane) { const e = E(p0, p1); P(G.sideGeometry([at(p0, e, s0, -inset), at(p0, e, s1, -inset)], y0, y1, 1 / Math.max(1, s1 - s0), 1 / Math.max(1, y1 - y0), false), mat, false); }
  const wall = (p0, p1, y0, y1, ops, mat) => P(G.wallSeg(p0, p1, y0, y1, { openings: ops || [] }), mat);
  const edges = poly => poly.map((p, i) => [p, poly[(i + 1) % poly.length]]);
  function tris(list, mat) {
    const pos = [];
    for (const [a, b, c] of list) { const ux = b[0] - a[0], uz = b[2] - a[2], vx = c[0] - a[0], vz = c[2] - a[2]; if (uz * vx - ux * vz < 0) pos.push(...a, ...c, ...b); else pos.push(...a, ...b, ...c); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    const uv = []; for (let i = 0; i < pos.length / 3; i++) uv.push(pos[i * 3] / 8, pos[i * 3 + 2] / 8);
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.computeVertexNormals(); P(g, mat);
  }
  /** 축정렬 박공 (용마루 x 방향) 유리 온실: 측벽 유리 + 경사 유리 + 박공 삼각 + 백색 프레임 */
  function greenhouse(x0, x1, z0, z1, y0, eave, ridge, mat) {
    const r = rectXZ(x0, x1, z0, z1), zm = (z0 + z1) / 2;
    P(G.sideGeometry(r, y0, eave, 1 / 6, 1 / 6), mat, false);
    tris([[[x0, eave, z0], [x1, eave, z0], [x1, ridge, zm]], [[x0, eave, z0], [x1, ridge, zm], [x0, ridge, zm]],
      [[x0, eave, z1], [x1, ridge, zm], [x1, eave, z1]], [[x0, eave, z1], [x0, ridge, zm], [x1, ridge, zm]]], mat);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute([x0, eave, z0, x0, eave, z1, x0, ridge, zm, x1, eave, z1, x1, eave, z0, x1, ridge, zm], 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, 1, 0, 0.5, 1, 0, 0, 1, 0, 0.5, 1], 2)); g.computeVertexNormals(); P(g, mat, false);
    for (let x = x0; x <= x1 + 0.01; x += 6) { P(G.box(0.3, eave - y0, 0.3, x, y0, z0), wh); P(G.box(0.3, eave - y0, 0.3, x, y0, z1), wh); }
    P(G.box(x1 - x0, 0.4, 0.4, (x0 + x1) / 2, ridge - 0.2, zm), wh);
    P(G.box(x1 - x0 + 1, 1.2, z1 - z0 + 1, (x0 + x1) / 2, y0, zm), M.concrete);
  }
  /** 연속 띠창 입면: floors = [[바닥 y, 창대, 창머리], ...], margin = 양끝 벽돌 */
  function ribbon(p0, p1, y0, y1, floors, { margin = 3, mull = 6, mat = brick, sillBand = true } = {}) {
    const e = E(p0, p1), L = e.L, ops = [];
    if (L < 2 * margin + 4) { wall(p0, p1, y0, y1, [], mat); return; }
    const n = Math.max(1, Math.round((L - 2 * margin) / mull)), w = (L - 2 * margin) / n;
    for (const [, sb, hd] of floors) {
      ops.push({ s: margin, e: L - margin, b: sb, t: hd });
      pane(p0, p1, margin, L - margin, sb, hd, 0.45);
      for (let i = 1; i < n; i++) bx(p0, p1, margin + i * w - 0.18, margin + i * w + 0.18, sb, hd, -0.45, 0.4, M.dark);
      if (sillBand) bx(p0, p1, margin - 0.6, L - margin + 0.6, sb - 0.7, sb, 0, 0.35, ls);
    }
    wall(p0, p1, y0, y1, ops, mat);
  }
  function coping(poly, y0, y1, mat, out = 0.4, inIn = 1.0) { for (const [a, b] of edges(poly)) bx(a, b, 0, E(a, b).L, y0, y1, -inIn, inIn + out, mat); }
  // 항공사진(fountain/r 근경): 지붕 = 회갈색 자갈 (사진 평균 ≈ (150,137,119)) — 기본 roof_gravel 보다 어둡고 따뜻함
  const gravel = cached('sci_gravel', () => { const m = M.roof_gravel.clone(); m.color = new THREE.Color(0.92, 0.84, 0.74); return m; });
  const cap = (poly, y, mat = gravel) => P(G.capGeometry(poly, [], y), mat);
  /** 외곽선 블록: skip(edgeIndex) 인 변은 벽 생략 (다른 볼륨과 맞닿음) */
  function block(poly, H, floors, { skip = () => false, roofMat = gravel, par = 2.8, mull = 6, margin = 3 } = {}) {
    poly.forEach((p0, i) => { const p1 = poly[(i + 1) % poly.length]; if (!skip(p0, p1)) ribbon(p0, p1, 0, H, floors, { mull, margin }); });
    cap(poly, H - 0.2, roofMat);
    coping(poly, H, H + par, ls, 0.35, 1.0);
  }
  const fl = (n, fh, h1 = fh) => Array.from({ length: n }, (_, k) => { const y = k === 0 ? 0 : h1 + (k - 1) * fh; return [y, y + 3.0, y + Math.min(8.2, (k === 0 ? h1 : fh) - 3.4)]; });
  const near = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]) < 0.05;
  const onLine = (p0, p1, test) => test(p0) && test(p1);

  // ================================================================ [A] 본관 4층
  const H4 = 54;
  const A = ccw(pick([5, 6, [100, 21.2], [100, 73.6], 11, 12, 13, 14, 22, 23, 24, 40, 41, 0]));
  block(A, H4, fl(4, 13.5), {
    skip: (p0, p1) => onLine(p0, p1, p => Math.abs(p[0] - 36) < 1.5 && p[1] > -137.5 && p[1] < -67.5)                // 서측 증축과 맞닿음
      || (Math.abs(p0[1] - p1[1]) < 1 && Math.abs(p0[1] + 273.4) < 1 && Math.min(p0[0], p1[0]) > 60 && Math.max(p0[0], p1[0]) < 95) // (연결동 위는 아래에서 별도)
  });
  // 북면 중 연결동(1층)이 붙는 구간 (x 66.8..89) 은 16 ft 위만
  ribbon([89.01, -273.41], [66.79, -273.41], 16, H4, fl(4, 13.5).slice(1), { margin: 1 });
  // 서·동면 설비 샤프트 (6 × 4 ft, 지붕 위 6 ft + 흰 배기후드)
  const shafts = [[36.3, -230, -1], [36.3, -198, -1], [36.3, -166, -1], [203.0, -262, 1], [203.0, -232, 1], [203.0, -200, 1], [203.0, -168, 1]];
  for (const [x, z, sgn] of shafts) {
    const cx = x + sgn * 2;
    P(G.box(4, H4 + 6, 6, cx, 0, z), brick);
    P(G.box(4.8, 0.5, 6.8, cx, H4 + 6, z), ls);
    P(G.box(4.2, 2.5, 5.2, cx - sgn * 0.5, H4 + 6.5, z), wh);
  }
  // 덕트 스파인 (금속), 교차 덕트, 공조기
  P(G.box(8, 5, 395, 104, H4, -76), M.metal);
  P(G.box(7, 4.5, 312, 164.5, H4, -118), M.metal);
  for (const z of [-250, -215, -185, -150, -115, -80, -45, -15]) P(G.box(56, 2.5, 3, 132, H4 + 1.5, z), M.metal);
  for (const z of [-235, -196, -150, -100, -55, -18]) P(G.box(3.2, 2.2, 4, 182, H4 + 2, z), M.metal);
  for (const [z0, z1] of [[-252, -236], [-198, -182], [-152, -134], [-84, -60], [-58, -42], [-26, -6]]) P(G.box(26, 8, z1 - z0, 186, H4, (z0 + z1) / 2), M.concrete);
  for (const [x, z] of [[60, -250], [75, -210], [55, -170], [80, -120], [60, -80], [72, -40], [130, -230], [140, -170], [128, -110], [145, -40], [52, -5]]) P(G.box(7, 4, 5, x, H4, z), M.metal);
  for (const [x, z] of [[118, -260], [118, -200], [118, -140], [150, -260], [150, -95]]) P(G.cylinder(1.2, 9, x, H4, z, 8), M.metal);   // 배기 스택
  // 관측 돔
  P(G.cylinder(10.6, 6, 137.5, H4, 53, 24), wh);
  { const d = new THREE.SphereGeometry(10.2, 24, 10, 0, Math.PI * 2, 0, Math.PI / 2); d.translate(137.5, H4 + 6, 53); P(d, M.paintWhite); }
  P(G.box(1.5, 0.3, 20.6, 137.5, H4 + 6 + 9.6, 53), M.dark);   // 돔 슬릿
  // 온실 2 동
  greenhouse(97, 200, 72, 87, H4, H4 + 8, H4 + 12.5, ghWhite);
  greenhouse(160, 200, 38, 71, H4, H4 + 9, H4 + 15, ghGlass);

  // ================================================================ [N] 북측 동 3층 + 솟은 정사각 볼륨
  const N = ccw(pick([33, 34, 29, 30, 31, 32]));
  block(N, 42, fl(3, 13.5), { skip: (p0, p1) => near(p0, SP[34]) && near(p1, SP[29]) || near(p1, SP[34]) && near(p0, SP[29]) });
  ribbon(SP[34], SP[29], 16, 42, fl(3, 13.5).slice(1), { margin: 1 });   // 연결동 위 남면
  {
    const r = rectXZ(56, 90, -353, -313.9), ex = G.extrudePoly(r, [], 10, { y0: 42 });
    P(ex.sides, brick); cap(r, 52, M.roof_gravel); coping(r, 52, 53.5, ls);
  }
  for (const [x, z] of [[45, -390], [95, -390], [70, -375]]) P(G.box(8, 5, 6, x, 42, z), M.metal);

  // ================================================================ [C] 연결동 1층
  {
    const C = ccw(pick([24, 25, 26, 27, 28, 29, 34, 35, 36, 37, 38, 39, 40]));
    C.forEach((p0, i) => {
      const p1 = C[(i + 1) % C.length], e = E(p0, p1);
      const shared = (Math.abs(p0[1] + 273.4) < 0.5 && Math.abs(p1[1] + 273.4) < 0.5) || (Math.abs(p0[1] + 314.1) < 0.6 && Math.abs(p1[1] + 314.1) < 0.6);
      if (shared || e.L < 0.5) return;
      if (e.L > 8) { const o = { s: 1.5, e: e.L - 1.5, b: 0.3, t: 11 }; wall(p0, p1, 0, 16, [o], brick); pane(p0, p1, o.s, o.e, o.b, o.t, 0.6); bx(p0, p1, 1.5, e.L - 1.5, 7.6, 7.9, -0.6, 0.4, M.dark); }
      else wall(p0, p1, 0, 16, [], brick);
    });
    cap(C, 15.8, M.roof_membrane); coping(C, 16, 17.5, ls, 0.3, 0.8);
  }

  // ================================================================ [W] 1989 서측 입구 증축
  {
    const Wp = ccw(pick([0, 1, 2, 3, 4, 5]));
    const atr = 8;   // 서·남면 유리 아트리움 깊이
    Wp.forEach((p0, i) => {
      const p1 = Wp[(i + 1) % Wp.length], e = E(p0, p1);
      if (Math.abs(p0[0] - 36) < 1.5 && Math.abs(p1[0] - 36) < 1.5) return;      // 본관과 공유
      const glassFace = e.n[0] < -0.9 || e.n[1] > 0.9;                           // 서면 / 남면
      if (glassFace && e.L > 20) {
        pane(p0, p1, 0, e.L, 0, 24, 0.2);
        const n = Math.round(e.L / 5); for (let k = 0; k <= n; k++) bx(p0, p1, Math.max(0, k * e.L / n - 0.25), Math.min(e.L, k * e.L / n + 0.25), 0, 24, -0.2, 0.5, wh);
        for (const y of [8, 12, 16, 20]) bx(p0, p1, 0, e.L, y - 0.2, y + 0.2, -0.2, 0.5, wh);
        bx(p0, p1, -0.3, e.L + 0.3, 23.8, 24.6, -0.3, 1.0, wh);
        // 경사 유리 지붕 (외곽 24 → 안쪽 30)
        const a = at(p0, e, 0, 0), b = at(p0, e, e.L, 0), c = at(p0, e, e.L, -atr), d = at(p0, e, 0, -atr);
        tris([[[a[0], 24.6, a[1]], [b[0], 24.6, b[1]], [c[0], 30, c[1]]], [[a[0], 24.6, a[1]], [c[0], 30, c[1]], [d[0], 30, d[1]]]], ghWhite);
        // 문 (서면 중앙)
        if (e.n[0] < -0.9) bx(p0, p1, e.L / 2 - 6, e.L / 2 + 6, 0, 9, -0.1, 0.4, M.dark);
        // 캐노피
        if (e.n[0] < -0.9) bx(p0, p1, e.L / 2 - 10, e.L / 2 + 10, 10, 11, 0, 8, wh);
      } else ribbon(p0, p1, 0, 30, fl(2, 14), { margin: 2 });
    });
    // 아트리움 안쪽 벽 (24..30 은 경사 지붕 아래 가려짐) → 본체 상부 다각형 = 서·남측을 atr 만큼 안으로
    const inner = ccw([[3.27 + atr, -67.67 - atr], [35.61, -67.89 - atr], [37.24, -137.01], [-3.69 + atr, -136.76], [-3.52 + atr, -109.6], [3.04 + atr, -109.63]]);
    cap(Wp, 24.4, M.roof_membrane);
    const ex = G.extrudePoly(inner, [], 6, { y0: 24.4 }); P(ex.sides, brick);
    cap(inner, 30.2, M.roof_gravel); coping(inner, 30.2, 31.6, ls, 0.3, 0.8);
  }

  // ================================================================ [S] 남서부 (항공사진으로 수정: 2층 → 4층) + [L] 남측 연결
  //   fountain/r 근경: 이 블록은 본관과 같은 4층 높이이고, 서면(x≈25.8, 37 ft) 전체가 유리 커튼월 —
  //   층마다 검은 수평 차양(1.5 ft 돌출) + 검은 멀리언 5 ft, 양끝 벽돌 피어. 앞(서측)은 밝은 회색 판석 광장 + 내려가는 계단.
  {
    const S = ccw(pick([8, 9, 10, 11, [100, 73.6], [100, 36.5]]));
    const isWest = (p0, p1) => Math.abs(p0[0] - 25.8) < 0.5 && Math.abs(p1[0] - 25.8) < 0.5;
    block(S, H4, fl(4, 13.5), { skip: (p0, p1) => isWest(p0, p1) || (Math.abs(p0[0] - 100) < 0.5 && Math.abs(p1[0] - 100) < 0.5) || (Math.abs(p0[1] - 73.6) < 0.5 && Math.abs(p1[1] - 73.6) < 0.5 && Math.min(p0[0], p1[0]) > 76) });
    const w0 = SP[10], w1 = SP[9];   // 서면: 북(z 36.8)→남(z 73.9) 이 바깥(서)을 향하도록 CCW 순서로 고름
    const [a, b] = area([[w0[0], w0[1]], [w1[0], w1[1]], [60, 55]]) > 0 ? [w0, w1] : [w1, w0];
    const e = E(a, b), m = 3.5;
    wall(a, b, 0, H4, [{ s: m, e: e.L - m, b: 0.3, t: H4 - 2 }], brick);
    pane(a, b, m, e.L - m, 0.3, H4 - 2, 0.8);
    const nm = Math.round((e.L - 2 * m) / 5);
    for (let k = 0; k <= nm; k++) { const c = m + k * (e.L - 2 * m) / nm; bx(a, b, c - 0.2, c + 0.2, 0.3, H4 - 2, -0.8, 0.6, M.dark); }
    for (let f = 0; f < 4; f++) { const y = f === 0 ? 10.5 : 13.5 * f + 10.5; bx(a, b, m, e.L - m, y, y + 0.5, -0.6, 2.1, M.dark); bx(a, b, m, e.L - m, 13.5 * (f + 1) - 0.6, 13.5 * (f + 1) + 0.4, -0.8, 0.7, M.dark); }
    bx(a, b, m + 8, e.L - m - 8, 9.5, 10.2, 0, 5, M.dark);   // 출입 캐노피
    // 광장 판석 (서측 50 × 40 ft, 밝은 회색)
    P(G.capGeometry(ccw(rectXZ(-12, 25.6, 30, 80)), [], 0.12), cached('sci_pavers', () => { const m2 = M.walk.clone(); m2.color = new THREE.Color(1.08, 1.08, 1.1); return m2; }), false);
    const Lk = rectXZ(77.6, 100, 21.2, 36.5);
    Lk.forEach((p0, i) => { const p1 = Lk[(i + 1) % 4], e = E(p0, p1); if (e.n[0] < -0.9) ribbon(p0, p1, 0, 18, [[0, 3, 10]], { margin: 2 }); });
    cap(Lk, 18, M.roof_gravel); coping(Lk, 18, 19.5, ls, 0.3, 0.8);
  }

  // ================================================================ [E] 동측 입구 1층
  {
    const Eb = ccw(pick([14, 15, 16, 17, 18, 19, 20, 21]));
    Eb.forEach((p0, i) => {
      const p1 = Eb[(i + 1) % Eb.length], e = E(p0, p1);
      if (Math.abs(p0[0] - 203.3) < 0.5 && Math.abs(p1[0] - 203.3) < 0.5) return;
      if (e.n[0] > 0.9 && e.L > 20) { const o = { s: 3, e: e.L - 3, b: 0.2, t: 11 }; wall(p0, p1, 0, 16, [o], brick); pane(p0, p1, o.s, o.e, o.b, o.t, 0.6); bx(p0, p1, e.L / 2 - 5, e.L / 2 + 5, 0, 8, -0.4, 0.3, M.dark); bx(p0, p1, 1, e.L - 1, 11.5, 12.5, 0, 6, wh); }
      else wall(p0, p1, 0, 16, [], brick);
    });
    cap(Eb, 15.8, M.roof_membrane); coping(Eb, 16, 17.5, ls, 0.3, 0.8);
  }

  const grp = new THREE.Group();
  for (const m of G.mergeByMaterial(parts)) grp.add(m);
  return grp;
}
