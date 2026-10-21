// Scott College of Business — Federal Hall (옛 미국 우체국·연방법원 청사, 1933–35 PWA Moderne, 2012 ISU 리노베이션)
// OSM way/640437205 는 "Highland Quarters apartments" 로 태그되어 있으나, Street View 로 확인한 결과 이 footprint 는
//   7th St(동) × Cherry St(북) 모서리의 석회석 연방 청사 = Federal Hall (주소 30 N 7th St) 이다. 아파트가 아님.
// 근거: Google Street View (Joseph Danzer 포토스피어 2020-06: Cherry St 북면 정면·NE 모서리; Google 2023-06: 7th St 동면 "30 N 7th St";
//       Google 2026-04 워크: 남측 2012 유리 증축부), ISU 투어 'scott_college_of_business' 파노라마(내부 아르데코 로비 — 외관 정보 없음),
//       Esri z20/z19 위성 (scratch/scott_business/sat_z20.png)
//
// ■ 매스 (위성 판독)
//   - 3층 본체: 북측 Cherry St 바 + 동·서 날개(폭 32 ft, 남측 끝까지) + 중앙 블록(남쪽으로 x 629–724 돌출, z 1390) → C/E 자형
//   - 남측 저층부 (옛 우편 작업장): 2층 높이 34 ft, 본체 날개 사이 빈 곳, 남면은 x 708–752 만 노출
//   - 2012 유리 증축부: 남측 띠 (z 1413–1424.5) 높이 30 ft, 커튼월 + 상부 백색 패널·루버, 남측 플라자 출입구
// ■ 높이: 화강석 기단 0–5 (1층 바닥 = +5, 계단으로 진입), 1층 창 6–18, 2층 21.5–30.5, 3층 33.5–43 (층고 ~13.5),
//         코니스 43–44.6, 무창 애틱 44.6–54 (사진 비율: 애틱 ≈ 입면 높이의 1/5)
// ■ 재질: 인디애나 석회석 전면(M.limestone), 화강석 기단, 층간 알루미늄 스팬드럴(어두운 회색), 밝은 은색 창틀(교체 창호)
// ■ 창 패턴: 필라스터 사이 1–3층 연속 수직 창띠 (베이 ~9.6 ft, 창폭 60%), 3분할 + 층별 가로대.
//   모서리 파빌리온(32 ft)은 창띠 2개 + 애틱에 독수리 명판(정사각 석판으로 근사). 북면 중앙 16 베이, 동면 중앙 5 베이.
// ■ 출입구: 7th St(동면) 중앙 3 베이 = 청동 현관문 + 8단 석재 계단 + 측벽 (사진의 계단·난간 위치), 남측 증축부 자동문 + 캐노피
// ■ 지붕: 평지붕 멤브레인, 파라펫 = 애틱 상단 코핑, 기계실 펜트하우스 3 (위성), 실외기.
// ■ 가정: 서면(주차장 쪽)은 북면과 같은 구성으로 가정(사진 없음). 필라스터 플루팅·조각 장식은 생략. 내부 중정면은 3층 펀치 창.
import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

export const meta = {
  id: 'scott', name: 'Scott College of Business (Federal Hall)', osm: 'way/640437205',
  anchor: [0, 0], rotation: 0, height: 63,
  preset: { pos: [960, 170, 1080], tgt: [674, 15, 1360] },
  sheets: 'Street View 2020-06 / 2023-06 / 2026-04, Esri imagery',
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
  const K = kit(M, G), { P, wbox, facade, band, roofFlat, rooftopUnits, tint, flat, dir } = K;
  // ---- 재질
  const stone = tint(M.limestone, 0xeee4d2);              // 인디애나 석회석 (따뜻한 황회색, 사진 톤)
  const granite = tint(M.concrete, 0xc4c0b8);             // 화강석 기단
  const spandrel = flat(0x3f4246, 0.5, 0.5);              // 알루미늄 스팬드럴 (어두운 회색)
  const frame = flat(0xb9bdc0, 0.5, 0.5);                 // 밝은 은색 창틀 (사진: 2012 교체 창호)
  const bronze = flat(0x4a3d30, 0.5, 0.5);                // 현관문
  const white = flat(0xeeeeea, 0.6);                      // 2012 증축 백색 금속 패널
  const silver = flat(0xc9ccce, 0.4, 0.6);

  // ---- 높이 (ft, 지면 = 0)
  const PL = 5.0;               // 화강석 기단 상단 = 1층 바닥 (계단으로 올라감)
  const W1 = [6.0, 18.0], W2 = [21.5, 30.5], W3 = [33.5, 43.0];   // 층별 창 (스팬드럴 18–21.5, 30.5–33.5)
  const CORN = 43.0, HTOP = 54.0;                         // 코니스 띠 / 애틱 상단(파라펫 코핑)
  const LOW = 34.0, ADD = 30.0;                           // 남측 저층부, 2012 유리 증축부

  // ---- 3층 본체 (C 자형 + 중앙 돌출부) — CCW
  const HI = [[565.4, 1413.0], [597, 1412.9], [597, 1369], [629, 1369], [629, 1390], [724, 1390], [724, 1369], [752, 1369],
    [752, 1412.8], [784.4, 1412.7], [783.4, 1304.4], [564.4, 1306.3]];
  const PAV = 32;               // 모서리 파빌리온 폭
  /** 수직 창띠 (1–3층 연속 개구 하나, 층간 어두운 알루미늄 스팬드럴 판을 유리 앞에) */
  function strip(p0, p1, s, e, ops, { door = false } = {}) {
    ops.push({ s, e, b: door ? PL : W1[0], t: W3[1], type: 'win', mull: 3, rails: [door ? 15.2 : 14.5, 27.5, 40], frame, inset: 1.0 });
    for (const [b, t] of [[W1[1], W2[0]], [W2[1], W3[0]]]) wbox(p0, p1, s, e, b, t, -0.95, -0.55, spandrel, false);
    if (door) wbox(p0, p1, s + 0.2, e - 0.2, PL, 15.0, -0.95, -0.75, bronze, false);
  }
  const n = HI.length;
  for (let i = 0; i < n; i++) {
    const p0 = HI[i], p1 = HI[(i + 1) % n], d = dir(p0, p1), L = d.L;
    const inner = [1, 2, 3, 4, 5, 6, 7].includes(i);          // 저층부 지붕 위로만 드러나는 안쪽 면
    const y0 = inner ? LOW - 0.5 : -1;
    const ops = [];
    const piers = [];
    if (inner) {
      // 3층 창만 (펀치 창), 피치 9.6
      const k = Math.max(1, Math.round(L / 9.6)), p = L / k;
      for (let j = 0; j < k; j++) { const c = (j + 0.5) * p; ops.push({ s: c - 2.6, e: c + 2.6, b: 35.5, t: W3[1], type: 'win', mull: 3, rails: [40], frame, inset: 1.0, sill: stone }); }
    } else {
      const pav = (i === 9 || i === 10 || i === 11) ? PAV : 0;
      const segs = [];
      if (pav) { segs.push([0, pav, 'pav']); segs.push([pav, L - pav, 'mid']); segs.push([L - pav, L, 'pav']); }
      else segs.push([0, L, 'pav']);                              // 날개 남측 끝 (32 ft) = 파빌리온과 같은 구성
      for (const [a, b, kind] of segs) {
        if (kind === 'pav') {
          for (const f of [0.3, 0.7]) { const c = a + (b - a) * f; strip(p0, p1, c - 2.3, c + 2.3, ops); }
          piers.push([a + (b - a) * 0.5 - 0.9, a + (b - a) * 0.5 + 0.9]);
          // 애틱 명판 (원형 독수리 메달리온 → 정사각 석판으로 근사)
          const c = (a + b) / 2; wbox(p0, p1, c - 3, c + 3, 45.5, 51.5, 0, 0.45, stone);
          wbox(p0, p1, c - 2.2, c + 2.2, 46.3, 50.7, 0.45, 0.7, stone);
        } else {
          const k = Math.max(1, Math.round((b - a) / 9.6)), p = (b - a) / k, w = p * 0.6;
          for (let j = 0; j < k; j++) {
            const c = a + (j + 0.5) * p;
            const door = i === 9 && j >= 1 && j <= k - 2;          // 7th St 정면 중앙 3 베이 = 현관
            strip(p0, p1, c - w / 2, c + w / 2, ops, { door });
            if (j > 0) piers.push([a + j * p - (p - w) / 2 + 0.3, a + j * p + (p - w) / 2 - 0.3]);
          }
          piers.push([a - 1.2, a + 1.2]); piers.push([b - 1.2, b + 1.2]);   // 파빌리온 경계 굵은 기둥
          // 현관 계단 + 석재 측벽
          if (i === 9) {
            const s0 = a + p * 0.9, s1 = b - p * 0.9;
            for (let st = 0; st < 8; st++) wbox(p0, p1, s0, s1, 0, (st + 1) * PL / 8, 0, 9.6 - st * 1.2, stone);
            for (const s of [s0 - 2.5, s1]) wbox(p0, p1, s, s + 2.5, 0, PL + 3.2, 0, 10.5, stone);
            // 문 위 석재 상인방 (조각 띠)
            wbox(p0, p1, s0, s1, 18.6, 20.6, 0, 0.5, stone);
          }
        }
      }
    }
    facade(p0, p1, y0, HTOP, stone, ops);
    // 필라스터 (얕은 돌출, 기단 위 ~ 코니스)
    for (const [a, b] of piers) wbox(p0, p1, a, b, PL, CORN, 0, 0.45, stone);
  }
  // 기단 / 코니스 / 애틱 상단 띠
  band(HI, -1, PL, 0.55, granite);
  band(HI, CORN, CORN + 1.6, 0.7, stone);
  band(HI, HTOP - 0.6, HTOP, 0.35, stone);
  roofFlat(HI, [], HTOP, 2.5, M.roof_membrane, stone);
  // 옥상: 엘리베이터/기계실 펜트하우스 (위성: 중앙 동쪽 직사각, 서측 소형)
  for (const [x, z, w, dd, h] of [[712, 1342, 14, 14, 9], [652, 1322, 10, 8, 6], [604, 1318, 8, 8, 5]]) {
    P(G.box(w, h, dd, x, HTOP - 2.5, z), stone);
    P(G.box(w + 0.6, 0.5, dd + 0.6, x, HTOP - 2.5 + h, z), stone, false);
  }
  rooftopUnits(HI, [], HTOP - 2.5, { pitch: 26, margin: 14, w: 4, h: 3.5, mat: M.metal });

  // ---- 남측 저층부 (옛 우편 작업장, 2층 높이, 석회석) — 남면 x 708–752 만 노출 (나머지는 증축부 뒤)
  const LO = [[597, 1412.9], [752, 1412.8], [752, 1369], [724, 1369], [724, 1390], [629, 1390], [629, 1369], [597, 1369]];
  {
    const p0 = LO[0], p1 = LO[1], L = dir(p0, p1).L, sx = 708 - 597, ops = [];
    for (let j = 0; j < 4; j++) { const c = sx + 5 + j * 10.5; for (const [b, t] of [[6, 14], [19, 27]]) ops.push({ s: c - 2.5, e: c + 2.5, b, t, type: 'win', mull: 2, rails: [b + 5], frame, inset: 0.9, sill: stone }); }
    facade(p0, p1, ADD - 0.5, LOW, stone, []);
    facade([597 + sx, 1412.85], p1, -1, ADD - 0.5, stone, ops.map(o => ({ ...o, s: o.s - sx, e: o.e - sx })));
    void L;
  }
  band(LO, LOW - 0.6, LOW, 0.3, stone);
  roofFlat(LO, [], LOW, 2.0, M.roof_membrane, stone);
  rooftopUnits(LO, [], LOW - 2, { pitch: 20, margin: 8, w: 3.5, h: 3, mat: M.metal });

  // ---- 2012 유리 증축부 (남측 플라자 입구): 커튼월 + 상부 백색 패널/루버
  const AD = [[592.8, 1412.8], [592.9, 1418.0], [656.9, 1424.5], [708.2, 1424.1], [708.0, 1413.3]];
  for (let i = 0; i < 4; i++) {
    const p0 = AD[i], p1 = AD[i + 1], L = dir(p0, p1).L;
    const ops = [{ s: 0.6, e: L - 0.6, b: 0.4, t: 25.5, type: 'win', mull: Math.max(1, Math.round(L / 5)), rails: [9.5, 13.0, 21.5], frame: silver, inset: 0.4, fw: 0.3 }];
    facade(p0, p1, -1, ADD, white, ops);
    // 상부 루버 띠
    for (const y of [26.6, 27.6, 28.6]) wbox(p0, p1, 0.6, L - 0.6, y, y + 0.25, 0, 0.3, silver, false);
    if (i === 2) {   // 남측 출입구: 2짝 자동문 + 캐노피
      const c = L / 2;
      wbox(p0, p1, c - 6, c + 6, 0, 8.5, -0.3, 0.05, flat(0x2a2c2e, 0.3, 0.6), false);
      wbox(p0, p1, c - 9, c + 9, 10.5, 11.3, 0, 7, white);
    }
  }
  roofFlat([...AD], [], ADD, 0.8, M.roof_membrane, white);
  // 플라자 (계단식 석재 단 + 난간)
  {
    const p0 = [592.9, 1418.0], p1 = [656.9, 1424.5], q0 = [656.9, 1424.5], q1 = [708.2, 1424.1];
    for (const [a, b] of [[p0, p1], [q0, q1]]) { const L = dir(a, b).L; wbox(a, b, -2, L + 2, 0, 1.2, 0, 10, M.walk, false); }
    wbox(p0, p1, -2, dir(p0, p1).L - 4, 1.2, 4.2, 9.8, 10.1, frame, false);      // 난간 (서측 램프 쪽)
  }
  return K.done('scott_business');
}
