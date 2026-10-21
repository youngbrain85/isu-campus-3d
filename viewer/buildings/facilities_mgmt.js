// ISU Facilities Management (9th St 동쪽, Sycamore St 남쪽 — 정비동/창고, "Facilities Management" 간판)
// 근거: Google Street View 2022-10 (924 Sycamore St 에서 ESE 방향 = 북면·서측 저층부; 995 Sycamore St 에서 SW 방향 = 동면 오버헤드 도어
//       + 파란 차양 + 간판), Esri z20/z19 위성 (scratch/facilities_mgmt/sat_z20.png)
//
// ■ 매스 (위성 지붕 판독, 4개 볼륨 + 캐노피):
//   - 서측 창고동 x 1757–1858, z -401…-201: 저경사 맞배 금속 지붕(용마루 남북, 처마 15 / 용마루 19), 용마루에 터빈 환기구 3
//   - 동측 본동 x 1858–1960, z -403…-180: 평지붕(회색 멤브레인) 22 ft — 위성에서 북쪽 그림자가 가장 긺, 사진에서도 가장 높음
//   - 남측동 x 1761–1934, z -180…-119: 검정 평지붕 16 ft, 원형 환기구
//   - 연결부 x 1766–1858, z -201…-181: 검정 평지붕 14 ft
//   - 동측 하역 캐노피 x 1959–1983, z -258…-222: 강관 기둥 위 평판 13 ft
// ■ 외벽: 백색 도장 콘크리트 블록(CMU) 전면, 무장식. 창은 작고 드묾 (어두운 금속 차양 붙은 사무실 창 — 북면 사진),
//   동면(주차장): 갈색 오버헤드 도어 12×12 다수, 철제 문, 파란 천 차양, 간판판. 남면(작업 마당): 오버헤드 도어 3.
// ■ 가정: 서면(골목)·남면은 사진 없음 → 위성의 차량 진입 위치에 오버헤드 도어, 서면은 소형 창 + 문으로 가정.
import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

export const meta = {
  id: 'facilities', name: 'Facilities Management', osm: 'way/1245721408',
  anchor: [0, 0], rotation: 0, height: 25,
  preset: { pos: [2130, 150, -590], tgt: [1870, 10, -260] },
  sheets: 'Street View 2022-10, Esri imagery',
};

// ============================================================ 공용 헬퍼 (사진 기반 모듈 4종 공통, 각 파일에 복사됨)
// 좌표: 월드 ft, x = 동, z = 남, y = 위. 벽 p0→p1 은 CCW(위에서 봄) 규약 → 진행 방향 오른쪽 = 바깥.
function kit(M, G) {
  const parts = [];
  const P = (geom, mat, cast) => { if (geom) parts.push({ geom, mat, cast }); };
  const dir = (p0, p1) => { const dx = p1[0] - p0[0], dz = p1[1] - p0[1], L = Math.hypot(dx, dz); return { u: [dx / L, dz / L], n: [-dz / L, dx / L], L, ry: -Math.atan2(dz, dx) }; };
  /** p0 에서 벽을 따라 s, 바깥으로 off (음수 = 안쪽) */
  const at = (p0, d, s, off = 0) => [p0[0] + d.u[0] * s + d.n[0] * off, p0[1] + d.u[1] * s + d.n[1] * off];
  const tint = (base, hex) => { const m = base.clone(); m.color = new THREE.Color(hex); return m; };
  const flat = (hex, rough = 0.8, metal = 0) => new THREE.MeshStandardMaterial({ color: hex, roughness: rough, metalness: metal });
  /** 4점 사각형 (A,B,C 반시계로 보이는 쪽이 앞면) */
  function quad(A, B, C, D, mat, cast = false) {
    const pos = [...A, ...B, ...C, ...A, ...C, ...D];
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    const uv = []; for (let i = 0; i < 6; i++) uv.push((pos[i * 3] + pos[i * 3 + 2]) / 24, pos[i * 3 + 1] / 12);
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    g.computeVertexNormals(); P(g, mat, cast);
  }
  /** 벽면 기준 박스: 벽을 따라 s0..s1, 높이 y0..y1, 바깥 방향 o0..o1 */
  function wbox(p0, p1, s0, s1, y0, y1, o0, o1, mat, cast) {
    const d = dir(p0, p1), c = at(p0, d, (s0 + s1) / 2, (o0 + o1) / 2);
    P(G.box(Math.abs(s1 - s0), y1 - y0, Math.abs(o1 - o0), c[0], y0, c[1], { ry: d.ry }), mat, cast);
  }
  /** 수평 박스 띠 (밴드 박스) — wbox 의 별칭 */
  const flipGeom = (g) => { const idx = g.index.array; for (let i = 0; i < idx.length; i += 3) { const t = idx[i + 1]; idx[i + 1] = idx[i + 2]; idx[i + 2] = t; } g.computeVertexNormals(); return g; };
  /** 위에서 본 부호 면적 (x, -z) — 양수 = CCW */
  const area = (r) => { let a = 0; for (let i = 0; i < r.length; i++) { const p = r[i], q = r[(i + 1) % r.length]; a += p[0] * (-q[1]) - q[0] * (-p[1]); } return a / 2; };
  const ccw = (r) => area(r) > 0 ? r : [...r].reverse();
  const cw = (r) => area(r) < 0 ? r : [...r].reverse();
  const inside = (pt, r) => { let c = false; for (let i = 0, j = r.length - 1; i < r.length; j = i++) { const a = r[i], b = r[j]; if ((a[1] > pt[1]) !== (b[1] > pt[1]) && pt[0] < (b[0] - a[0]) * (pt[1] - a[1]) / (b[1] - a[1]) + a[0]) c = !c; } return c; };
  const distToRing = (pt, r) => { let m = 1e9; for (let i = 0; i < r.length; i++) { const a = r[i], b = r[(i + 1) % r.length]; const dx = b[0] - a[0], dz = b[1] - a[1]; const t = Math.max(0, Math.min(1, ((pt[0] - a[0]) * dx + (pt[1] - a[1]) * dz) / (dx * dx + dz * dz || 1))); m = Math.min(m, Math.hypot(pt[0] - a[0] - t * dx, pt[1] - a[1] - t * dz)); } return m; };

  /**
   * 벽 한 장 + 개구부. ops: [{s, e, b, t, type, ...}]
   *  type 'win'  : 유리(inset) + 프레임/멀리언(mull = 가로 분할 수, rails = 가로대 y 목록), sill/head 재질 옵션
   *  type 'panel': 유리 대신 재질 판 (mat) — 문, 오버헤드 도어, 스팬드럴
   *  type 'void' : 어두운 깊은 개구 (아치 통로 등)
   *  모든 개구에 측벽(jamb)·상부 소핏·하부 창대면 생성 → 벽 두께감
   */
  function facade(p0, p1, y0, y1, mat, ops = []) {
    const d = dir(p0, p1);
    P(G.wallSeg(p0, p1, y0, y1, { openings: ops }), mat);
    for (const op of ops) {
      const ins = op.inset ?? 0.6, s = op.s, e = op.e, b = op.b, t = op.t;
      const A = (ss, off, y) => { const q = at(p0, d, ss, off); return [q[0], y, q[1]]; };
      const rev = op.revMat || mat;
      // 측벽 / 상부 / 하부 리빌
      quad(A(s, 0, b), A(s, -ins, b), A(s, -ins, t), A(s, 0, t), rev);
      quad(A(e, -ins, b), A(e, 0, b), A(e, 0, t), A(e, -ins, t), rev);
      quad(A(s, 0, t), A(s, -ins, t), A(e, -ins, t), A(e, 0, t), rev);
      if (b > y0 + 0.05) quad(A(s, 0, b), A(e, 0, b), A(e, -ins, b), A(s, -ins, b), rev);
      if (op.type === 'void') { P(G.sideGeometry([at(p0, d, s, -ins), at(p0, d, e, -ins)], b, t, 1 / 24, 1 / 12, false), M.dark, false); continue; }
      if (op.type === 'panel') { P(G.sideGeometry([at(p0, d, s, -ins), at(p0, d, e, -ins)], b, t, 1 / 24, 1 / 12, false), op.mat || M.dark, false); }
      else P(G.sideGeometry([at(p0, d, s, -ins), at(p0, d, e, -ins)], b, t, 1 / (e - s), 1 / (t - b), false), op.glass || M.pane, false);
      const fm = op.frame || M.dark, fw = op.fw ?? 0.22;
      const n = op.mull || 1;
      for (let k = 1; k < n; k++) { const x = s + (e - s) * k / n; wbox(p0, p1, x - fw / 2, x + fw / 2, b, t, -ins, -ins + 0.25, fm, false); }
      for (const y of op.rails || []) wbox(p0, p1, s, e, y - fw / 2, y + fw / 2, -ins, -ins + 0.25, fm, false);
      if (op.sill) wbox(p0, p1, s - 0.3, e + 0.3, b - 0.35, b, -0.1, 0.35, op.sill, false);
      if (op.head) wbox(p0, p1, s - 0.3, e + 0.3, t, t + (op.headH || 0.6), -0.1, 0.25, op.head, false);
    }
  }

  /** 링(CCW) 둘레 띠: 바깥으로 off, y0..y1 (상·하면 포함) */
  function band(ring, y0, y1, off, mat) {
    const r = ccw(ring), o = G.offsetPoly(r, -off);
    P(G.sideGeometry(o, y0, y1, 1 / 24, 1 / 12, true), mat);
    P(G.capGeometry(o, [r], y1), mat, false);
    P(flipGeom(G.capGeometry(o, [r], y0)), mat, false);
  }
  /** 벽을 따라 부분 띠 (s0..s1) */
  const bandSeg = (p0, p1, s0, s1, y0, y1, off, mat) => wbox(p0, p1, s0, s1, y0, y1, -0.2, off, mat, false);

  /** 평지붕 + 파라펫 안쪽면 + 코핑. 벽은 ytop 까지 세워져 있어야 한다. holes = 중정 링 */
  function roofFlat(ring, holes, ytop, par, roofMat, parMat, copeMat) {
    const r = ccw(ring), inner = G.offsetPoly(r, 0.8);
    const hs = (holes || []).map(h => ccw(h)), hx = hs.map(h => G.offsetPoly(h, -0.8));
    P(G.capGeometry(inner, hx, ytop - par), roofMat, false);
    P(G.sideGeometry([...inner].reverse(), ytop - par, ytop, 1 / 24, 1 / 12, true), parMat, false);
    P(G.capGeometry(r, [inner], ytop + 0.01), copeMat || parMat, false);
    hs.forEach((h, i) => {
      P(G.sideGeometry(hx[i], ytop - par, ytop, 1 / 24, 1 / 12, true), parMat, false);
      P(G.capGeometry(hx[i], [h], ytop + 0.01), copeMat || parMat, false);
    });
  }
  /** 옥상 실외기 격자: ring 안쪽, 가장자리에서 margin 이상, pitch 간격. avoid(pt) → true 면 건너뜀 */
  function rooftopUnits(ring, holes, y, { pitch = 18, margin = 8, w = 3.2, h = 3, mat = M.metal, avoid = null, jitter = 0 } = {}) {
    let xs = ring.map(p => p[0]), zs = ring.map(p => p[1]);
    const x0 = Math.min(...xs), x1 = Math.max(...xs), z0 = Math.min(...zs), z1 = Math.max(...zs);
    const geos = [];
    for (let x = x0 + margin; x < x1 - margin; x += pitch) for (let z = z0 + margin; z < z1 - margin; z += pitch) {
      const pt = [x + (jitter ? ((x * 7 + z * 13) % 5) - 2.5 : 0), z];
      if (!inside(pt, ring) || distToRing(pt, ring) < margin) continue;
      if ((holes || []).some(hh => inside(pt, hh) || distToRing(pt, hh) < margin)) continue;
      if (avoid && avoid(pt)) continue;
      geos.push(G.box(w, h, w, pt[0], y, pt[1]));
    }
    const ok = geos;
    if (ok.length) P(BufferGeometryUtils.mergeGeometries(ok), mat);
    return ok.length;
  }
  function done(name) {
    const g = new THREE.Group(); g.name = name;
    let tris = 0;
    for (const m of G.mergeByMaterial(parts)) { g.add(m); const gg = m.geometry; tris += (gg.index ? gg.index.count : gg.attributes.position.count) / 3; }
    g.userData.tris = Math.round(tris);
    console.log(name + ' tris:', Math.round(tris));
    return g;
  }
  return { parts, P, dir, at, tint, flat, quad, wbox, flipGeom, area, ccw, cw, inside, facade, band, bandSeg, roofFlat, rooftopUnits, done };
}

export function build(M, G) {
  const K = kit(M, G), { P, wbox, facade, roofFlat, tint, flat, dir, quad } = K;
  const cmu = M.precast.clone(); cmu.color = new THREE.Color().setRGB(1.18, 1.18, 1.2);   // 백색 도장 CMU
  const ohd = flat(0x5d4b3b, 0.7, 0.2);          // 갈색 오버헤드 도어
  const steel = flat(0x4a4d52, 0.6, 0.4);        // 철제 문·차양
  const blue = flat(0x1f5fae, 0.8);              // 파란 천 차양
  const yel = flat(0xe0b42a, 0.7), sign = flat(0x2a2d33, 0.6);
  const seam = tint(M.metal, 0xd8dada);          // 스탠딩심 금속 지붕
  const roofGrey = tint(M.roof_membrane, 0xb0aca2);
  const XM = 1857.6;                             // 서측 창고동 / 동측 본동 경계
  const HW = 15, HR = 19, HE = 22, HS = 16, HC = 14;

  // 개구부 생성기
  const OHD = (s, w = 12, h = 12) => ({ s, e: s + w, b: 0, t: h, type: 'panel', mat: ohd, inset: 0.4 });
  const DOOR = (s) => ({ s, e: s + 3.2, b: 0, t: 7.2, type: 'panel', mat: steel, inset: 0.3 });
  const WIN = (s, w = 4, b = 6.5, t = 10) => ({ s, e: s + w, b, t, type: 'win', mull: 2, frame: steel, inset: 0.4 });
  /** 벽 + 개구 + 장식: 오버헤드 도어 가로 패널선, 창 위 금속 차양 */
  function W(p0, p1, y0, y1, ops = [], { awn = true } = {}) {
    facade(p0, p1, y0, y1, cmu, ops);
    for (const o of ops) {
      if (o.mat === ohd) for (let y = 2; y < o.t; y += 2) wbox(p0, p1, o.s, o.e, y - 0.06, y + 0.06, -0.4, -0.3, steel, false);
      if (o.type === 'win' && awn) wbox(p0, p1, o.s - 0.4, o.e + 0.4, o.t + 0.3, o.t + 0.6, 0, 2.2, steel, false);
      if (o.mat === ohd) { wbox(p0, p1, o.s - 0.5, o.s - 0.1, 0, 3.5, 0, 0.6, yel, false); wbox(p0, p1, o.e + 0.1, o.e + 0.5, 0, 3.5, 0, 0.6, yel, false); }   // 보호 볼라드
    }
  }

  // ---------------- 서측 창고동 (맞배)
  const WS = [[1757.2, -401.3], [1758.8, -200.9], [XM, -200.9], [XM, -402.1]];
  W([1757.2, -401.3], [1758.8, -200.9], -1, HW, [WIN(22), DOOR(46), WIN(78), WIN(118), DOOR(140), WIN(172)]);
  W([1758.8, -200.9], [1766.1, -200.9], -1, HW);
  W([1766.1, -200.9], [XM, -200.9], HC - 0.5, HW);
  W([XM, -402.1], [1757.2, -401.3], -1, HW, [WIN(14), WIN(30), DOOR(52), WIN(72), WIN(86)]);
  P(G.gableRoof(WS, HW, (HR - HW) / 50, 90), seam);
  for (let x = 1760; x < XM; x += 2.2) P(G.box(0.15, 0.2, 202, x, HW + (HR - HW) * (1 - Math.abs(x - 1808) / 50) + 0.02, -301), seam, false);   // 리브 (근사: 용마루 높이 근처만)
  for (const z of [-342, -296, -246]) { P(G.cylinder(1.2, 1.6, 1808, HR - 0.2, z, 10), M.metal); P(G.cylinder(1.5, 0.3, 1808, HR + 1.4, z, 10), M.metal, false); }
  // 처마 홈통 (동·서)
  for (const x of [1757.6, XM - 0.4]) P(G.box(0.6, 0.6, 201, x, HW - 0.6, -301), steel, false);

  // ---------------- 동측 본동 (평지붕 22)
  const EF = [[XM, -401.9], [XM, -180.3], [1934.1, -179.7], [1959.6, -179.9], [1959.3, -221.7], [1960.5, -257.4], [1959.3, -402.9]];
  W([XM, -401.9], [XM, -180.3], HW - 1, HE);
  W([XM, -180.3], [1934.1, -179.7], HS - 0.5, HE);
  W([1934.1, -179.7], [1959.6, -179.9], -1, HE, [DOOR(10)]);
  W([1959.6, -179.9], [1959.3, -221.7], -1, HE, [OHD(14, 14, 14)]);
  W([1959.3, -221.7], [1960.5, -257.4], -1, HE, [OHD(4, 14, 14), DOOR(28)]);
  {
    const p0 = [1960.5, -257.4], p1 = [1959.3, -402.9];   // 동면 (주차장): 사진의 오버헤드 도어 열 + 파란 차양 + 간판
    W(p0, p1, -1, HE, [DOOR(10), OHD(22), DOOR(40), OHD(50), WIN(70, 5, 4, 8), OHD(84), DOOR(104), OHD(114), DOOR(132)], { awn: false });
    wbox(p0, p1, 129.5, 138.5, 7.6, 8.2, 0, 4.5, blue);                        // 파란 차양 (경사 근사: 2단)
    wbox(p0, p1, 129.5, 138.5, 8.2, 8.9, 0, 2.5, blue);
    wbox(p0, p1, 96, 110, 9.5, 12, 0, 0.25, sign);               // "Facilities Management" 간판
    wbox(p0, p1, 0, 145.5, HE - 1.2, HE, 0, 0.3, steel, false);                 // 상부 금속 캡
  }
  W([1959.3, -402.9], [XM, -402.1], -1, HE, [WIN(12, 5, 12, 15), WIN(40, 5, 12, 15), WIN(70, 5, 12, 15)], { awn: false });
  roofFlat(EF, [], HE, 1.5, roofGrey, cmu, steel);
  wbox([1959.3, -375], [XM, -375], 0, 101, HE - 1.5, HE - 1.0, -0.4, 0.4, steel, false);   // 지붕 이음 (위성의 z -375 선)
  for (const [x, z, w, d, h] of [[1918, -338, 7, 5, 4], [1905, -290, 3, 3, 2.5], [1920, -398, 4, 4, 3], [1902, -228, 3, 3, 2.5]]) P(G.box(w, h, d, x, HE - 1.5, z), M.metal);

  // ---------------- 연결부 (14) / 남측동 (16)
  W([1766.1, -200.9], [1766.3, -180.8], -1, HC, [DOOR(8)]);
  roofFlat([[1766.1, -200.9], [1766.3, -180.8], [XM, -180.5], [XM, -200.9]], [], HC, 1.0, M.roof_dark, cmu, steel);
  const SP = [[1761.1, -180.7], [1761.6, -118.6], [1934.6, -119.9], [1934.1, -179.7]];
  W([1761.1, -180.7], [1761.6, -118.6], -1, HS, [WIN(10), DOOR(26), WIN(42)]);
  W([1761.6, -118.6], [1934.6, -119.9], -1, HS, [OHD(14), OHD(40), DOOR(60), WIN(72), OHD(118), DOOR(140), WIN(150)]);
  W([1934.6, -119.9], [1934.1, -179.7], -1, HS, [OHD(20, 12, 12), DOOR(40)]);
  W([XM, -180.3], [1766.3, -180.8], HC - 0.5, HS);
  W([1766.3, -180.8], [1761.1, -180.7], -1, HS);
  roofFlat(SP, [], HS, 1.0, M.roof_dark, cmu, steel);
  P(G.box(0.3, 0.6, 61, 1908, HS - 1, -149.5), steel, false);                    // 지붕 이음 (위성)
  for (const [x, z] of [[1793, -150], [1828, -150], [1795, -191]]) P(G.cylinder(1.3, 1.6, x, HS - 1, z, 10), M.metal);

  // ---------------- 동측 하역 캐노피
  P(G.box(23.6, 0.8, 36, 1971, 12.4, -239.6), steel);
  P(G.box(23.8, 0.2, 36.2, 1971, 13.2, -239.6), tint(M.roof_membrane, 0xd9c9a8), false);
  for (const z of [-256.5, -222.8]) P(G.cylinder(0.35, 12.4, 1981.8, 0, z, 8), steel);
  return K.done('facilities_mgmt');
}
