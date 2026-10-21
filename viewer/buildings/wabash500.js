// 500 Wabash Apartments (Wabash Ave, S 5th–6th 사이 블록, 1층 상가 + 4개 층 주거)
// 근거: Google Street View (Cameron Stephens 포토스피어 2024-06: Wabash Ave 남측에서 SE·SW 모서리 방향; Google 2026-04 "511 Wabash Ave":
//       아치 통로 블록 정면), Esri z20/z19 위성 (scratch/wabash500/sat_z20.png)
//
// ■ 매스: OSM 외곽 그대로 U 자형 (북쪽으로 열린 중정 = 지상 주차장, x -284…-94, z 1458…1539). 한 덩어리 5층 평지붕.
// ■ 층: 1층 상가/로비 0–14 (층고 14), 주거 2–5층 바닥 14 / 24.5 / 35 / 45.5 (층고 10.5), 지붕 56, 파라펫 상단 59.
//       캐스트스톤 블록은 파라펫 61.5 로 한 단 높음 (사진: 모서리·아치 블록이 스카이라인에서 튀어나옴)
// ■ 재질 (사진 판독, 입면 분절 = OSM 외곽의 요철과 일치):
//   - 돌출 베이 = 적갈색 벽돌 (M.brick_red) + 상부 어두운 금속 코니스
//   - 후퇴 베이·꺾임면 = 진회색 섬유시멘트 패널
//   - 모서리 블록 + Wabash 중앙 아치 블록(x -219…-190) = 황회색 캐스트스톤 (줄눈 석재 마감), 창 둘레 석재 창대·인방
//   - 1·2층 사이 캐스트스톤 벨트 코스, 기단 워터테이블
// ■ 창: 벽돌·회색 베이 = 2연창(폭 6, 중간 멀리언) 피치 ~11 ft, 석재 블록 = 단창 3.6 ft 피치 ~9.5 ft, 모두 어두운 프레임.
//   1층: Wabash 면과 양 측면 남쪽 끝 = 상가 유리 (피어 간격 ~16 ft, 가로대 8.6) + 벽돌 베이 위 금속 캐노피,
//   그 외 1층 = 펀치 창 + 출입문. 아치 통로(폭 14, 높이 13.5) → 중정 북쪽 벽 같은 위치에 출구.
// ■ 지붕: 백색 멤브레인, 위성의 다수 소형 실외기 격자 + 엘리베이터 오버런 2 + 계단실 1.
// ■ 가정: 중정 쪽 입면 사진 없음 → 벽돌 + 같은 창 리듬으로 가정. 아치 곡선은 상단 모서리 계단형 석재로 근사.
import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

export const meta = {
  id: 'wabash500', name: '500 Wabash Apartments', osm: 'way/724476296',
  anchor: [0, 0], rotation: 0, height: 66,
  preset: { pos: [-340, 160, 1910], tgt: [-190, 15, 1527] },
  sheets: 'Street View 2024-06 / 2026-04, Esri imagery',
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

const POLY = [[-340.3, 1478.4], [-337.6, 1478.4], [-337.5, 1487.2], [-342.4, 1487.2], [-342.4, 1520.2], [-334.5, 1520.2], [-334.5, 1545.7], [-342.3, 1545.7], [-342.3, 1569.2], [-333.0, 1569.1], [-333.0, 1572.8], [-340.7, 1572.8], [-340.7, 1596.0], [-315.7, 1596.0], [-315.7, 1598.2], [-226.7, 1598.0], [-226.7, 1593.4], [-218.9, 1593.4], [-218.9, 1595.5], [-189.7, 1595.5], [-189.7, 1593.1], [-181.0, 1593.1], [-180.9, 1597.7], [-117.5, 1597.6], [-117.5, 1592.5], [-90.6, 1592.5], [-90.6, 1595.0], [-37.8, 1594.9], [-37.8, 1571.6], [-39.8, 1571.6], [-39.8, 1569.0], [-35.6, 1569.0], [-35.6, 1545.0], [-43.5, 1545.1], [-43.5, 1520.6], [-35.5, 1520.6], [-35.6, 1455.6], [-85.0, 1455.7], [-85.0, 1459.4], [-94.1, 1459.4], [-94.0, 1538.9], [-284.0, 1539.2], [-284.1, 1458.0], [-340.3, 1458.1]];

export function build(M, G) {
  const K = kit(M, G), { P, wbox, facade, band, roofFlat, rooftopUnits, tint, flat, dir } = K;
  const brick = M.brick_red;
  const stoneC = tint(M.precast, 0xf2e2cc);                 // 캐스트스톤 (황회색)
  const grey = flat(0x6f7174, 0.75);                        // 진회색 섬유시멘트
  const cornice = flat(0x3b3d40, 0.6, 0.3);
  const frame = flat(0x2e3033, 0.5, 0.4);
  const FL = [14, 24.5, 35, 45.5], TOP = 59, TOPS = 61.5;

  // 입면 분절 → 재질
  const XW = -342.4, XE = -35.5;
  function kind(p0, p1) {
    const d = dir(p0, p1), mx = (p0[0] + p1[0]) / 2, mz = (p0[1] + p1[1]) / 2;
    if (d.L < 10) return 'grey';
    if (d.n[1] > 0.7) {                                   // Wabash (남) 면
      if (mx < -315.7) return 'stone';
      if (mx < -226.7) return 'brick';
      if (mx < -218.9) return 'grey';
      if (mx < -189.7) return 'arch';
      if (mx < -181) return 'grey';
      if (mx < -117.5) return 'brick';
      if (mx < -90.6) return 'grey';
      return 'brick';
    }
    if (Math.abs(d.n[0]) > 0.7 && (mx < -330 || mx > -50)) {   // 서·동 측면
      if (mz > 1570 || mz < 1490) return 'stone';
      const outer = d.n[0] < 0 ? mx < XW + 3 : mx > XE - 3;
      return outer ? 'brick' : 'grey';
    }
    return 'brick';                                       // 북측 날개 끝·중정
  }
  const MAT = { brick, grey, stone: stoneC, arch: stoneC };
  const ARCH_X = -204.3, ARCH_W = 14, ARCH_T = 13.5;

  const n = POLY.length;
  for (let i = 0; i < n; i++) {
    const p0 = POLY[i], p1 = POLY[(i + 1) % n], d = dir(p0, p1), L = d.L, k = kind(p0, p1), mat = MAT[k];
    const ops = [];
    const mz = (p0[1] + p1[1]) / 2, mx = (p0[0] + p1[0]) / 2;
    const south = d.n[1] > 0.7, retail = south || (Math.abs(d.n[0]) > 0.7 && mz > 1565 && (mx < -330 || mx > -50));
    if (L >= 7) {
      // ---- 주거층 창 (7–10 ft 꺾임면은 단창 1개)
      const single = k === 'stone' || k === 'arch' || L < 10;
      const pitch = single ? 9.5 : 11, w = single ? 3.6 : 6.0, cnt = Math.max(1, Math.round((L - 2) / pitch)), p = L / cnt;
      for (const fl of FL) for (let j = 0; j < cnt; j++) {
        const c = (j + 0.5) * p;
        ops.push({ s: c - w / 2, e: c + w / 2, b: fl + 2.8, t: fl + 8.2, type: 'win', mull: single ? 1 : 2, rails: [fl + 6.6], frame, inset: 0.5,
          sill: k === 'grey' ? null : stoneC, head: single ? stoneC : null });
      }
      // ---- 1층
      if (k === 'arch') {
        const s0 = (ARCH_X - p0[0]) * d.u[0] - ARCH_W / 2;      // 남면은 서→동 진행
        ops.push({ s: s0, e: s0 + ARCH_W, b: -1, t: ARCH_T, type: 'void', inset: 1.5 });
        // 아치 어깨 (계단형 석재) + 아치 둘레 몰딩
        for (const [dx, dy] of [[0, 2.6], [1.2, 1.4], [2.4, 0.6]]) { wbox(p0, p1, s0, s0 + 3.6 - dx, ARCH_T - dy, ARCH_T, -1.5, 0, stoneC); wbox(p0, p1, s0 + ARCH_W - 3.6 + dx, s0 + ARCH_W, ARCH_T - dy, ARCH_T, -1.5, 0, stoneC); }
        wbox(p0, p1, s0 - 1.2, s0 + ARCH_W + 1.2, ARCH_T, ARCH_T + 1.2, 0, 0.4, stoneC);
        wbox(p0, p1, s0 - 1.2, s0, 0, ARCH_T, 0, 0.4, stoneC); wbox(p0, p1, s0 + ARCH_W, s0 + ARCH_W + 1.2, 0, ARCH_T, 0, 0.4, stoneC);
        for (const s of [2.5, L - 5.5]) ops.push({ s, e: s + 3, b: 0, t: 8.5, type: 'win', mull: 1, rails: [7.3], frame, inset: 0.5 });
      } else if (retail) {
        const cnt = Math.max(1, Math.round(L / 16)), p = L / cnt;
        for (let j = 0; j < cnt; j++) {
          const s = j * p + 1.4, e = (j + 1) * p - 1.4;
          ops.push({ s, e, b: 0.8, t: 11.6, type: 'win', mull: Math.max(2, Math.round((e - s) / 4.5)), rails: [8.6], frame, inset: 0.7 });
          if (j % 2 === 0) wbox(p0, p1, s + (e - s) / 2 - 1.6, s + (e - s) / 2 + 1.6, 0.8, 8.4, -0.68, -0.6, frame, false);   // 출입문
        }
        if (k === 'brick') wbox(p0, p1, 0.5, L - 0.5, 11.9, 12.5, 0, 3.2, cornice);                       // 상가 캐노피
      } else {
        const cnt = Math.max(1, Math.round(L / 12)), p = L / cnt;
        for (let j = 0; j < cnt; j++) {
          const c = (j + 0.5) * p;
          if (j === Math.floor(cnt / 2) && L > 40) ops.push({ s: c - 2, e: c + 2, b: 0, t: 8.5, type: 'win', mull: 1, rails: [7.2], frame, inset: 0.5 });
          else ops.push({ s: c - 2.5, e: c + 2.5, b: 3.2, t: 10.2, type: 'win', mull: 2, frame, inset: 0.5, sill: stoneC });
        }
      }
      // 중정 북벽: 아치 통로 출구
      if (Math.abs(p0[1] - 1538.9) < 1 && Math.abs(p1[1] - 1539.2) < 1) {
        const s0 = (p0[0] - ARCH_X) - ARCH_W / 2;               // 동→서 진행
        for (let q = ops.length - 1; q >= 0; q--) if (ops[q].b < 12 && ops[q].e > s0 - 1 && ops[q].s < s0 + ARCH_W + 1) ops.splice(q, 1);
        ops.push({ s: s0, e: s0 + ARCH_W, b: -1, t: ARCH_T - 1, type: 'void', inset: 1.5 });
      }
    }
    facade(p0, p1, -1, TOP, mat, ops);
    if (k === 'stone' || k === 'arch') {                      // 석재 블록: 파라펫 한 단 높임 + 석재 코니스
      wbox(p0, p1, 0, L, TOP, TOPS, -1.0, 0, stoneC);
      wbox(p0, p1, -0.3, L + 0.3, TOPS - 0.2, TOPS + 0.5, -1.2, 0.5, stoneC);
      wbox(p0, p1, 0, L, 56.2, 57.2, 0, 0.6, stoneC);
    }
    if (k === 'brick') wbox(p0, p1, -0.2, L + 0.2, 57.2, 59.2, 0, 1.1, cornice);   // 벽돌 베이 금속 코니스
  }
  band(POLY, 13.4, 14.6, 0.35, stoneC);                         // 1·2층 사이 벨트 코스
  band(POLY, -1, 1.0, 0.3, stoneC);                             // 워터테이블
  roofFlat(POLY, [], TOP, 3.0, M.roof_membrane, brick, cornice);
  for (const [x, z, w, dd] of [[-312, 1522, 12, 14], [-66, 1522, 12, 14], [-200, 1568, 10, 12]]) { P(G.box(w, 10, dd, x, TOP - 3, z), grey); P(G.box(w + 1, 0.6, dd + 1, x, TOP + 7, z), cornice, false); }
  rooftopUnits(POLY, [], TOP - 3, { pitch: 13, margin: 7, w: 2.8, h: 2.6, mat: M.metal });
  return K.done('wabash500');
}
