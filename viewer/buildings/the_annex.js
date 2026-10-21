// The Annex (학생 아파트, US 41 / N 3rd St 서측, 중정 2개를 둔 5층 블록)
// 근거: Google Street View (Cameron Stephens 포토스피어 2024-06, 3rd St 동측 보도에서 WNW 방향 = 동면 전체), Esri z20/z19 위성
//       (scratch/the_annex/sat_z20.png: 중정 2개의 모따기 모서리, 옥상 실외기 열, 북쪽 그림자 길이 → 5층)
//   * site.json 의 levels 2 / h 23 은 과소 — 사진상 1층 벽돌 + 4개 층 패널 = 5층.
//
// ■ 매스: OSM relation 외곽 + 중정 2개(모따기 모서리) 그대로, 단일 높이 평지붕.
// ■ 층: 1층 0–12 (황갈색 벽돌), 2–5층 바닥 12 / 22 / 32 / 42 (층고 10), 지붕 52, 파라펫 상단 54.5 (어두운 금속 코핑)
// ■ 재질 (사진): 1층 = 황갈색 벽돌(M.brick_tan) + 캐스트스톤 벨트(y 12); 2–5층 = 섬유시멘트 패널, 백색 / 중회색 구간이
//   ~45–50 ft 마다 교대, 구간 경계에 세로 파란 띠(폭 2 ft, 12–54.5). 중정면은 백색 패널.
// ■ 창: 12 ft 모듈마다 2연창(각 ~3 ft, 사이 1 ft 패널) — 백색 프레임, 1층은 단창 5 ft. 백색 구간 중앙마다 발코니 1열
//   (2–5층 슬래브 + 어두운 철제 난간, 발코니 문) + 최상부 어두운 금속 캐노피 (사진의 검은 처마 박스).
// ■ 출입구: 북면 중앙 유리 로비 + 캐노피 (위성: 북측 진입로·광장) — 사진 없음, 가정.
// ■ 지붕: 백색 멤브레인, 위성의 실외기 열(2개씩) 격자.
// ■ 가정: 북·서·남면과 중정면은 사진 없음 → 동면과 같은 구성 반복.
import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

export const meta = {
  id: 'annex', name: 'The Annex', osm: 'relation/11267893',
  anchor: [0, 0], rotation: 0, height: 62,
  preset: { pos: [-985, 160, 850], tgt: [-1317, 15, 590] },
  sheets: 'Street View 2024-06, Esri imagery',
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

const OUTER = [[-1452.4, 500.6], [-1460.6, 500.6], [-1459.8, 698.8], [-1436.9, 698.7], [-1436.8, 704.0], [-1181.3, 703.0], [-1181.4, 678.7], [-1173.0, 678.6], [-1173.8, 475.8], [-1452.5, 476.9]];
const HOLES = [
  [[-1295.0, 541.1], [-1295.1, 538.0], [-1282.2, 524.7], [-1279.2, 524.7], [-1279.2, 529.7], [-1240.2, 529.9], [-1240.2, 524.2], [-1235.3, 524.2], [-1223.0, 536.5], [-1223.2, 540.9], [-1228.7, 540.7], [-1228.5, 637.8], [-1223.4, 637.8], [-1223.4, 642.0], [-1234.4, 653.9], [-1239.4, 654.0], [-1239.3, 648.5], [-1277.8, 648.4], [-1277.8, 654.6], [-1282.5, 654.6], [-1295.1, 642.7], [-1295.2, 638.4], [-1288.3, 638.5], [-1289.6, 540.9]],
  [[-1411.3, 541.1], [-1411.4, 538.0], [-1398.5, 524.7], [-1395.4, 524.7], [-1395.5, 529.7], [-1356.4, 530.0], [-1356.5, 524.2], [-1351.6, 524.2], [-1339.2, 536.5], [-1339.4, 540.9], [-1344.9, 540.7], [-1344.7, 637.8], [-1339.6, 637.9], [-1339.6, 642.0], [-1350.6, 654.0], [-1355.7, 654.0], [-1355.6, 648.5], [-1394.1, 648.4], [-1394.0, 654.6], [-1398.8, 654.6], [-1411.4, 642.7], [-1411.4, 638.4], [-1404.6, 638.5], [-1405.8, 540.9]],
];

export function build(M, G) {
  const K = kit(M, G), { P, wbox, facade, band, roofFlat, rooftopUnits, tint, flat, dir, at, ccw, cw } = K;
  const brick = M.brick_tan;
  const white = flat(0xe9e9e5, 0.8), grey = flat(0x9c9e9f, 0.8), blue = flat(0x2c5d9c, 0.7);
  const dark = flat(0x2f3134, 0.55, 0.4), frameW = flat(0xf4f4f0, 0.6), stoneC = tint(M.precast, 0xf3e6d2);
  const FL = [12, 22, 32, 42], TOP = 54.5, GR = 12;
  let sec = 0;                                    // 백색/회색 교대 카운터 (건물 전체 연속)

  /** 한 변: 1층 벽돌 + 상부 패널 구간들 */
  function edge(p0, p1, { court = false, entrance = false } = {}) {
    const d = dir(p0, p1), L = d.L;
    // ---- 1층 (벽돌)
    const gops = [];
    if (L >= 8) {
      const cnt = Math.max(1, Math.round(L / 12)), p = L / cnt;
      for (let j = 0; j < cnt; j++) {
        const c = (j + 0.5) * p;
        if (entrance && Math.abs(c - L / 2) < 13) continue;
        gops.push({ s: c - 2.5, e: c + 2.5, b: 2.6, t: 9.0, type: 'win', mull: 2, frame: frameW, inset: 0.5, sill: stoneC });
      }
      if (entrance) {
        gops.push({ s: L / 2 - 11, e: L / 2 + 11, b: 0, t: 10.5, type: 'win', mull: 6, rails: [8.2], frame: dark, inset: 0.8 });
        wbox(p0, p1, L / 2 - 14, L / 2 + 14, 10.8, 11.8, 0, 9, dark);                       // 캐노피
        for (const s of [L / 2 - 13, L / 2 + 13]) { const q = at(p0, d, s, 8.4); P(G.cylinder(0.35, 10.8, q[0], 0, q[1], 8), dark); }
      }
    }
    facade(p0, p1, -1, GR, brick, gops);
    // ---- 상부 패널 구간
    const nsec = court ? 1 : Math.max(1, Math.round(L / 48)), sl = L / nsec;
    for (let k = 0; k < nsec; k++) {
      const s0 = k * sl, s1 = (k + 1) * sl, q0 = at(p0, d, s0), q1 = at(p0, d, s1);
      const isWhite = court || (sec++ % 2 === 0), mat = isWhite ? white : grey;
      const ops = [];
      const balc = !court && isWhite && sl > 30;
      if (sl >= 8) {
        const cnt = Math.max(1, Math.round(sl / 12)), p = sl / cnt;
        for (let j = 0; j < cnt; j++) {
          const c = (j + 0.5) * p;
          const isB = balc && j === Math.floor(cnt / 2);
          for (const fl of FL) {
            if (isB && fl > GR) ops.push({ s: c - 3, e: c + 3, b: fl + 0.3, t: fl + 7.6, type: 'win', mull: 3, rails: [fl + 6.4], frame: dark, inset: 0.6 });
            else if (sl < 10) ops.push({ s: c - 1.5, e: c + 1.5, b: fl + 2.6, t: fl + 7.6, type: 'win', mull: 1, frame: frameW, inset: 0.4 });
            else ops.push({ s: c - 3.6, e: c + 3.6, b: fl + 2.6, t: fl + 7.6, type: 'win', mull: 2, fw: 1.2, frame: frameW, inset: 0.4 });
          }
          if (isB) {
            for (const fl of FL.slice(1)) {
              wbox(q0, q1, c - 4, c + 4, fl - 0.5, fl, 0, 4.5, M.concrete);                 // 슬래브
              wbox(q0, q1, c - 4, c + 4, fl, fl + 3.5, 4.3, 4.5, dark, false);              // 정면 난간
              wbox(q0, q1, c - 4, c - 3.8, fl, fl + 3.5, 0, 4.5, dark, false); wbox(q0, q1, c + 3.8, c + 4, fl, fl + 3.5, 0, 4.5, dark, false);
            }
            wbox(q0, q1, c - 5, c + 5, 51.5, 53.2, 0, 4.8, dark);                           // 최상부 캐노피
          }
        }
      }
      facade(q0, q1, GR, TOP, mat, ops);
      if (!court && k > 0) wbox(p0, p1, s0 - 1, s0 + 1, GR, TOP, 0, 0.3, blue, false);   // 구간 경계 파란 띠
    }
  }
  const outer = ccw(OUTER);
  for (let i = 0; i < outer.length; i++) {
    const p0 = outer[i], p1 = outer[(i + 1) % outer.length];
    const north = Math.abs(p0[1] - 475.8) < 2 && Math.abs(p1[1] - 476.9) < 2;
    edge(p0, p1, { entrance: north });
  }
  for (const h of HOLES) { const r = cw(h); for (let i = 0; i < r.length; i++) edge(r[i], r[(i + 1) % r.length], { court: true }); }
  band(outer, GR - 0.6, GR + 0.4, 0.3, stoneC);                       // 1·2층 사이 벨트
  for (const h of HOLES) {                                              // 중정 벨트 (중정 쪽으로 돌출)
    const r = cw(h);
    for (let i = 0; i < r.length; i++) { const a = r[i], b = r[(i + 1) % r.length]; wbox(a, b, 0, dir(a, b).L, GR - 0.6, GR + 0.4, 0, 0.3, stoneC, false); }
  }
  band(outer, TOP - 1.2, TOP, 0.25, dark);                              // 금속 코핑
  roofFlat(outer, HOLES, TOP, 2.5, M.roof_membrane, white, dark);
  rooftopUnits(outer, HOLES, TOP - 2.5, { pitch: 15, margin: 9, w: 2.8, h: 2.6, mat: M.metal });
  for (const [x, z] of [[-1317, 520], [-1317, 660], [-1440, 590], [-1195, 590]]) { P(G.box(12, 10, 14, x, TOP - 2.5, z), white); P(G.box(13, 0.6, 15, x, TOP + 7.5, z), dark, false); }
  return K.done('the_annex');
}
