// Fairbanks Hall (1906, 옛 Emeline Fairbanks Memorial Library — Terre Haute 공공도서관) — 사진·위성 기반 모델 (도면 없음)
// 근거: Street View vp45 (N 7th St, 264/309/354 — 동측 입면·입구 계단), vp46 (7th & Eagle, 220 — 북측 입면), Esri z20 위성.
// ■ 층수: 높은 지하층(반지하, 창 1.0~4.5) + 주층(Piano nobile, 창 9.0~21.5) = 2 층. 사진 비례(사람 키 기준 0.08 ft/px):
//   지하층 ≈ 5.3 ft, 주층 ≈ 17 ft, 코니스 상단 ≈ 27~28 ft → 수경대(water table) 5.5~6.5, 프리즈 22~25.5,
//   모딜리온 코니스 25.5~28.5 (2.2 ft 돌출), 블로킹 코스(파라펫) 28.5~30.5, 힙지붕(회색 슬레이트) 28.5 에서 시작.
// ■ 재료: 인디애나 석회석 전면, 주층·지하층 모두 수평 러스티케이션(1.33 ft 간격 홈), 창틀 = 어두운 금속/목재.
// ■ 창 리듬: 각 베이 = 2 분할 + 상부 트랜섬(17 ft) 의 큰 창 7 ft 폭, 석재 문틀(아키트레이브) + 키스톤, 아래 지하층 창 2 개.
//   동면 남·북 날개 각 2 베이(vp45_264/309), 북면 3 베이 + 북서 날개 1 베이(vp46_220), 서·남면은 같은 리듬으로 가정.
// ■ 입구: 동측 중앙 파빌리온(x 778→787, z 615.5~662) — 안쪽으로 6 ft 들어간 포치에 이오니아식 원기둥 2 개(in antis)
//   + 양끝 필라스터, 포치 뒤 2 짝 문 + 트랜섬. 파빌리온 위 낮은 삼각 페디먼트(가정: 위성은 동쪽으로 힙 끝 지붕).
//   계단: 파빌리온 앞 단(top 7.5) 에서 남·북 양쪽으로 내려가는 석재 계단 + 금속 난간(vp45_309/354: 남쪽으로 내려가는 계단).
// ■ 지붕(위성): 본 힙지붕 x 727~773 (용마루 남북 x 750, z 606~676), 서측 저힙 x 701~727, 동측 파빌리온 쪽 교차 힙(z 618~659).
// ■ 가정: 서·남면 창 배치, 페디먼트 형태, 계단 북쪽 날개(대칭 가정).
import * as THREE from 'three';

const VIEW_ALT = /[?&]v=alt/.test(import.meta.url);
export const meta = {
  id: 'fairbanks', name: 'Fairbanks Hall', osm: 'way/545265788',
  anchor: [0, 0], rotation: 0, height: 42,
  preset: VIEW_ALT ? { pos: [520, 170, 520], tgt: [742, 12, 640] } : { pos: [990, 180, 740], tgt: [745, 10, 640] },
  sheets: 'Street View vp45 (2019), vp46 (2023); Esri imagery z20/z19',
};

// ============================================================ 공통 헬퍼 키트 (각 건물 모듈에 동일 복사)
function kit(M, G, parts) {
  const P = (geom, mat, cast) => { if (geom) parts.push({ geom, mat, cast }); };
  const face = (p0, p1) => {
    const dx = p1[0] - p0[0], dz = p1[1] - p0[1], L = Math.hypot(dx, dz), ex = [dx / L, dz / L], ez = [-dz / L, dx / L];
    return { p0, p1, L, ex, ez, ry: -Math.atan2(dz, dx), at: (s, off = 0) => [p0[0] + ex[0] * s + ez[0] * off, p0[1] + ex[1] * s + ez[1] * off] };
  };
  /** 면을 따라 놓는 상자: s..e, 높이 b..t, 두께 d, 중심이 바깥으로 off */
  const fbox = (f, s, e, b, t, d, off, mat, cast) => { const c = f.at((s + e) / 2, off); P(G.box(e - s, t - b, d, c[0], b, c[1], { ry: f.ry }), mat, cast); };
  /** 사각형 면 4 점(3D) — desired 법선 방향으로 감기 자동 보정 */
  function quads(list, mat, cast = true) {
    const pos = [], uv = [];
    for (const q of list) {
      let [a, b, c, d, n] = q;
      const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [d[0] - a[0], d[1] - a[1], d[2] - a[2]];
      const cr = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
      if (n && cr[0] * n[0] + cr[1] * n[1] + cr[2] * n[2] < 0) { [b, d] = [d, b]; }
      const lu = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]) / 24, lv = Math.hypot(d[0] - a[0], d[1] - a[1], d[2] - a[2]) / 12;
      pos.push(...a, ...b, ...c, ...a, ...c, ...d); uv.push(0, 0, lu, 0, lu, lv, 0, 0, lu, lv, 0, lv);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    g.computeVertexNormals(); P(g, mat, cast);
  }
  /** 개구부 측벽(리빌): 면 f 의 s..e, b..t 를 안쪽 d 깊이로 */
  function reveal(f, s, e, b, t, d, mat) {
    const A = (sv, y, off) => { const p = f.at(sv, off); return [p[0], y, p[1]]; };
    const ex = [f.ex[0], 0, f.ex[1]], mx = [-f.ex[0], 0, -f.ex[1]];
    quads([
      [A(s, b, 0), A(s, b, -d), A(s, t, -d), A(s, t, 0), ex],
      [A(e, b, 0), A(e, b, -d), A(e, t, -d), A(e, t, 0), mx],
      [A(s, t, 0), A(e, t, 0), A(e, t, -d), A(s, t, -d), [0, -1, 0]],
      [A(s, b, 0), A(e, b, 0), A(e, b, -d), A(s, b, -d), [0, 1, 0]],
    ], mat, false);
  }
  /** 창: 유리(안쪽 d) + 리빌 + 멀리언/레일 + 석재 창대·인방. 반환 = wallSeg 개구 */
  function win(f, s, e, b, t, o = {}) {
    const { d = 0.6, nx = 1, rails = [], wallMat = null, sill = null, head = null, headH = 0.9, frame = M.dark, fw = 0.22, glass = M.pane } = o;
    const q0 = f.at(s, -d), q1 = f.at(e, -d);
    P(G.sideGeometry([q0, q1], b, t, 1 / (e - s), 1 / (t - b), false), glass, false);
    if (wallMat) reveal(f, s, e, b, t, d, wallMat);
    for (let i = 1; i < nx; i++) { const sm = s + (e - s) * i / nx; fbox(f, sm - fw / 2, sm + fw / 2, b, t, 0.25, -d + 0.13, frame, false); }
    for (const y of rails) fbox(f, s, e, y - fw / 2, y + fw / 2, 0.25, -d + 0.13, frame, false);
    if (sill) fbox(f, s - 0.3, e + 0.3, b - 0.35, b, 0.5, 0.1, sill, false);
    if (head) fbox(f, s - 0.4, e + 0.4, t, t + headH, 0.35, 0.05, head, false);
    return { s, e, b, t };
  }
  /** 문: 어두운 문짝(안쪽) + 리빌 + 상부 트랜섬 유리 */
  function door(f, s, e, hDoor, hHead, o = {}) {
    const { d = 0.7, wallMat = null, leaves = 2, frame = M.dark } = o;
    fbox(f, s, e, 0, hDoor, 0.2, -d, frame, false);
    for (let i = 1; i < leaves; i++) { const sm = s + (e - s) * i / leaves; fbox(f, sm - 0.06, sm + 0.06, 0, hDoor, 0.1, -d + 0.15, M.white, false); }
    if (hHead > hDoor + 0.2) win(f, s, e, hDoor, hHead, { d, frame, nx: leaves });
    if (wallMat) reveal(f, s, e, 0, hHead, d, wallMat);
    return { s, e, b: -1, t: hHead };
  }
  const wall = (f, y0, y1, ops, mat) => P(G.wallSeg(f.p0, f.p1, y0, y1, { openings: ops }), mat);
  /** 폴리곤 둘레 띠(코니스·벨트코스): out = 바깥 돌출, 윗면 포함 */
  function ring(poly, y, h, out, mat, { bottom = false, closed = true } = {}) {
    const o = G.offsetPoly(poly, -out);
    P(G.sideGeometry(o, y, y + h, 1 / 24, 1 / 12, closed), mat);
    if (closed) { P(G.capGeometry(o, [], y + h), mat); if (bottom) capDown(o, y, mat); }
  }
  function capDown(poly, y, mat) {
    const g = G.capGeometry(poly, [], 0); g.scale(1, -1, 1); g.translate(0, y, 0);
    const idx = g.index; if (idx) { const a = idx.array; for (let i = 0; i < a.length; i += 3) { const t = a[i]; a[i] = a[i + 2]; a[i + 2] = t; } }
    g.computeVertexNormals(); P(g, mat, false);
  }
  /** 아래(yB) 폴리곤 → 위(yT) 대응점 로프트 (힙·피라미드). 법선 바깥·위 */
  function loft(bot, yB, top, yT, mat) {
    const pos = [], uv = [], n = bot.length;
    for (let i = 0; i < n; i++) {
      const a = bot[i], b = bot[(i + 1) % n], ta = top[i], tb = top[(i + 1) % n], L = Math.hypot(b[0] - a[0], b[1] - a[1]);
      pos.push(a[0], yB, a[1], b[0], yB, b[1], tb[0], yT, tb[1]); uv.push(0, 0, L / 24, 0, L / 24, 1);
      if (Math.hypot(tb[0] - ta[0], tb[1] - ta[1]) > 1e-6) { pos.push(a[0], yB, a[1], tb[0], yT, tb[1], ta[0], yT, ta[1]); uv.push(0, 0, L / 24, 1, 0, 1); }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    g.computeVertexNormals(); P(g, mat);
  }
  /** 축정렬 직사각 힙지붕: x0..x1, z0..z1, 처마 yE, 경사 pitch, 처마 돌출 ov. 처마 밑면 포함 */
  function hipRoof(x0, x1, z0, z1, yE, pitch, mat, { ov = 1.0, fascia = null, flatTop = 0 } = {}) {
    x0 -= ov; x1 += ov; z0 -= ov; z1 += ov;
    const W = x1 - x0, D = z1 - z0, r = Math.min(W, D) / 2 - flatTop / 2, cx = (x0 + x1) / 2, cz = (z0 + z1) / 2;
    const bot = [[x0, z0], [x0, z1], [x1, z1], [x1, z0]];
    let top;
    if (W >= D) { const a = x0 + r, b = x1 - r, h = flatTop / 2; top = [[a, cz - h], [a, cz + h], [b, cz + h], [b, cz - h]]; }
    else { const a = z0 + r, b = z1 - r, h = flatTop / 2; top = [[cx - h, a], [cx - h, b], [cx + h, b], [cx + h, a]]; }
    const yT = yE + r * pitch;
    loft(bot, yE, top, yT, mat);
    if (flatTop > 0) P(G.capGeometry(top, [], yT), mat);
    capDown(bot, yE, fascia || mat);
    if (fascia) P(G.sideGeometry(bot, yE - 0.7, yE, 1 / 24, 1 / 12, true), fascia);
    return yT;
  }
  /** 축정렬 박공지붕 (axis 'x' = 용마루 동서, 'z' = 남북). 박공 삼각형 포함, 처마 돌출 ov, 박공 돌출 ovg */
  function gable(x0, x1, z0, z1, yE, pitch, axis, mat, { ov = 1.0, ovg = 0.5, gableMat = null, soffit = null } = {}) {
    const P3 = axis === 'x' ? (u, v, y) => [u, y, v] : (u, v, y) => [v, y, u];
    const [u0, u1, v0, v1] = axis === 'x' ? [x0 - ovg, x1 + ovg, z0 - ov, z1 + ov] : [z0 - ovg, z1 + ovg, x0 - ov, x1 + ov];
    const vm = (v0 + v1) / 2, yR = yE + (vm - v0) * pitch;
    const yEo = yE - ov * pitch;
    quads([
      [P3(u0, v0, yEo), P3(u1, v0, yEo), P3(u1, vm, yR), P3(u0, vm, yR), [0, 1, 0]],
      [P3(u0, v1, yEo), P3(u1, v1, yEo), P3(u1, vm, yR), P3(u0, vm, yR), [0, 1, 0]],
    ], mat);
    // 박공 삼각형 (벽 위 실제 벽 두께 위치 = 지붕 원래 범위)
    const [g0, g1] = axis === 'x' ? [x0, x1] : [z0, z1], [w0, w1] = axis === 'x' ? [z0, z1] : [x0, x1];
    const tri = (u, sgn) => {
      const a = P3(u, w0, yE), b = P3(u, w1, yE), c = P3(u, vm, yR);
      const pos = sgn > 0 ? [...a, ...b, ...c] : [...b, ...a, ...c];
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      g.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, (w1 - w0) / 24, 0, (w1 - w0) / 48, (yR - yE) / 12], 2));
      g.computeVertexNormals();
      // 법선이 바깥(축 방향)을 향하도록 확인
      const n = g.attributes.normal; const want = (axis === 'x' ? 0 : 2);
      const comp = want === 0 ? n.getX(0) : n.getZ(0);
      if (Math.sign(comp) !== Math.sign(u - (g0 + g1) / 2)) { const p = g.attributes.position.array; for (let k = 0; k < 3; k++) { const t = p[k]; p[k] = p[3 + k]; p[3 + k] = t; } g.computeVertexNormals(); }
      P(g, gableMat || mat);
    };
    tri(g0, -1); tri(g1, 1);
    // 처마 밑면
    if (soffit) for (const [va, vb] of [[v0, Math.min(v0 + ov, vm)], [Math.max(v1 - ov, vm), v1]]) {
      quads([[P3(u0, va, yEo + (va - v0) * pitch * (va < vm ? 1 : 0)), P3(u1, va, yEo), P3(u1, vb, yEo), P3(u0, vb, yEo), [0, -1, 0]]], soffit, false);
    }
    return yR;
  }
  return { P, face, fbox, quads, reveal, win, door, wall, ring, capDown, loft, hipRoof, gable };
}
// ============================================================ 끝: 헬퍼 키트

const rectCCW = (x0, z0, x1, z1) => [[x0, z0], [x0, z1], [x1, z1], [x1, z0]];
const POLY = [[699.1, 624.7], [704.4, 624.7], [704.5, 654.2], [699.4, 654.3], [699.6, 697.7], [725.0, 697.6], [725.0, 701.4], [778.4, 701.2], [778.3, 662.2], [787.2, 662.1], [787.0, 615.5], [777.9, 615.5], [777.8, 577.2], [724.5, 577.5], [724.6, 581.5], [698.9, 581.6]];

export function build(M, G) {
  const parts = [];
  const K = kit(M, G, parts);
  const { P, face, fbox, win, wall, ring, quads } = K;
  const ls = M.limestone, dark = M.dark;
  const groove = M.limestone.clone(); groove.color = new THREE.Color(0.62, 0.62, 0.6);       // 러스티케이션 홈(그늘)
  const slate = M.roof_gravel.clone(); slate.color = new THREE.Color(0x7c818a);
  const WT = 5.5, W1B = 9.0, W1T = 21.5, FR = 22, CB = 25.5, CT = 28.5, PT = 30.5, FL = 7.5;

  /** 러스티케이션: 면 f 에 1.33 ft 간격 홈(0.22 ft) — 개구 구간은 건너뜀 */
  function rustic(f, y0, y1, ops) {
    const list = [];
    for (let y = y0 + 1.1; y < y1 - 0.2; y += 1.33) {
      const cuts = ops.filter(o => y + 0.22 > o.b && y < o.t).map(o => [o.s - 0.6, o.e + 0.6]).sort((a, b) => a[0] - b[0]);
      let s = 0;
      for (const [a, b] of [...cuts, [f.L, f.L]]) {
        if (a > s + 0.3) { const A = f.at(s, 0.04), B = f.at(a, 0.04); list.push([[A[0], y, A[1]], [B[0], y, B[1]], [B[0], y + 0.22, B[1]], [A[0], y + 0.22, A[1]], [f.ez[0], 0, f.ez[1]]]); }
        s = Math.max(s, b);
      }
    }
    if (list.length) quads(list, groove, false);
  }
  /** 큰 창 베이: 주층 2 분할 + 트랜섬, 아키트레이브·키스톤·창대, 아래 지하층 창 2 */
  function bay(f, c, ops, w = 7) {
    ops.push(win(f, c - w / 2, c + w / 2, W1B, W1T, { d: 0.9, wallMat: ls, nx: 2, rails: [17], frame: dark, fw: 0.3 }));
    fbox(f, c - w / 2 - 0.9, c - w / 2, W1B - 0.2, W1T + 0.9, 0.3, 0.12, ls);            // 아키트레이브 좌·우·상
    fbox(f, c + w / 2, c + w / 2 + 0.9, W1B - 0.2, W1T + 0.9, 0.3, 0.12, ls);
    fbox(f, c - w / 2 - 0.9, c + w / 2 + 0.9, W1T, W1T + 0.9, 0.3, 0.12, ls);
    fbox(f, c - 0.6, c + 0.6, W1T - 0.2, W1T + 1.4, 0.5, 0.2, ls);                       // 키스톤
    fbox(f, c - w / 2 - 0.6, c + w / 2 + 0.6, W1B - 0.5, W1B, 0.7, 0.3, ls);             // 창대
    for (const dx of [-1.9, 1.9]) ops.push(win(f, c + dx - 1.5, c + dx + 1.5, 1.0, 4.5, { d: 0.7, wallMat: ls, nx: 2, frame: dark }));
  }

  // ---- 외벽 (변마다 베이 수 지정). 파빌리온 정면(9 번 변) 은 별도
  const nBays = { 1: 1, 3: 2, 4: 1, 6: 3, 7: 2, 11: 2, 12: 3, 14: 1, 15: 2 };
  for (let i = 0; i < POLY.length; i++) {
    const f = face(POLY[i], POLY[(i + 1) % POLY.length]), ops = [];
    if (i === 9) continue;
    const n = nBays[i] || 0;
    for (let k = 0; k < n; k++) bay(f, f.L * (k + 0.5) / n, ops, f.L / n < 12 ? 5.5 : 7);
    wall(f, -1, CT, ops, ls);
    rustic(f, 0, FR - 0.6, ops);
  }
  // ---- 동측 파빌리온 정면 (x 787, z 662.1 → 615.5): 포치 개구(가운데 21 ft) + 양쪽 창 1 개씩
  {
    const f = face(POLY[9], POLY[10]), ops = [];
    const c = f.L / 2, pw = 10.5, DEP = 6;
    bay(f, 6.6, ops, 5.5); bay(f, f.L - 6.6, ops, 5.5);
    ops.push({ s: c - pw, e: c + pw, b: FL, t: W1T + 0.6 });
    wall(f, -1, CT, ops, ls);
    rustic(f, 0, FR - 0.6, ops);
    // 포치 내부: 뒷벽(문) · 측벽 · 천장 · 바닥
    const b0 = f.at(c - pw, -DEP), b1 = f.at(c + pw, -DEP);
    const fb = face(b0, b1);
    wall(fb, FL, W1T + 0.6, [{ s: pw - 3.5, e: pw + 3.5, b: FL - 0.5, t: FL + 12 }], ls);
    K.reveal(fb, pw - 3.5, pw + 3.5, FL, FL + 12, 0.7, ls);
    // 문 높이 보정: door() 는 y=0 기준이라 포치 바닥(7.5) 만큼 올린 문짝을 따로
    fbox(fb, pw - 3.5, pw + 3.5, FL, FL + 8.5, 0.2, -0.7, dark, false);
    win(fb, pw - 3.5, pw + 3.5, FL + 8.5, FL + 12, { d: 0.7, nx: 2 });
    for (const [s, sgn] of [[c - pw, 1], [c + pw, -1]]) {
      const a = f.at(s, 0), b = f.at(s, -DEP);
      const fs = sgn > 0 ? face(a, b) : face(b, a);
      wall(fs, FL, W1T + 0.6, [], ls);
    }
    const q = [f.at(c - pw, 0), f.at(c + pw, 0), f.at(c + pw, -DEP), f.at(c - pw, -DEP)];
    K.capDown(q, W1T + 0.6, ls);
    P(G.capGeometry([q[3], q[2], q[1], q[0]].reverse(), [], FL), ls);
    // 이오니아식 원기둥 2 (in antis) + 양끝 필라스터: 받침 FL..FL+1, 기둥 r 1.15, 주두 박스, 엔타블러처는 벽이 담당
    for (const s of [c - pw / 3, c + pw / 3]) {
      const p = f.at(s, -1.4);
      P(G.box(2.9, 1.0, 2.9, p[0], FL, p[1]), ls);
      P(G.cylinder(1.15, W1T - FL - 1.8, p[0], FL + 1.0, p[1], 16), ls);
      P(G.box(3.0, 0.8, 2.4, p[0], W1T - 0.8, p[1]), ls);
      for (const ds of [-1.25, 1.25]) { const v = f.at(s + ds, -1.4); P(G.cylinder(0.45, 0.7, v[0], W1T - 0.85, v[1], 10), ls); }   // 볼류트
    }
    for (const s of [c - pw, c + pw]) fbox(f, s - 1.2 * Math.sign(c - s) - 0.6, s - 1.2 * Math.sign(c - s) + 0.6, FL, W1T + 0.6, 0.6, 0.3, ls);
    // 파빌리온 위 페디먼트 (블로킹 코스 위, 폭 26, 높이 6) + 레이킹 코니스
    const z0 = c - 13, z1 = c + 13, A = f.at(z0, 0.6), B = f.at(z1, 0.6), C = f.at(c, 0.6);
    quads([[[A[0], PT, A[1]], [B[0], PT, B[1]], [C[0], PT + 6, C[1]], [C[0], PT + 6, C[1]], [1, 0, 0]]], ls);
    for (const [S, sg] of [[A, 1], [B, -1]]) {
      const len = Math.hypot(13, 6), g = G.box(len + 0.8, 0.8, 1.6, 0, 0, 0);
      g.rotateX(0); g.rotateY(Math.PI / 2); g.translate(0, -0.4, 0);
      const ang = Math.atan2(6, 13) * sg; g.rotateX(ang);
      const mid = f.at((sg > 0 ? z0 : z1) + sg * 6.5, 0.9); g.translate(mid[0], PT + 3.2, mid[1]); P(g, ls);
    }
    // 페디먼트 뒤 막음 (서쪽 면) — 지붕 속이므로 생략. 파빌리온 측벽(짧은 변)은 위 루프에서 처리.
    // 앞 계단: 단(top FL) + 남·북 계단 15 단 + 석재 측벽 + 금속 난간
    const L0 = f.at(c - pw - 1, 0), L1 = f.at(c + pw + 1, 0);
    const zl0 = Math.min(L0[1], L1[1]), zl1 = Math.max(L0[1], L1[1]);
    P(G.box(7.5, FL, zl1 - zl0, 787.1 + 3.75, 0, (zl0 + zl1) / 2), ls);
    for (let k = 0; k < 15; k++) {
      const h = FL - (k + 1) * 0.5;
      if (h <= 0) break;
      P(G.box(6.5, h, 1.1, 787.1 + 3.75, 0, zl1 + 0.55 + k * 1.1), ls);
      P(G.box(6.5, h, 1.1, 787.1 + 3.75, 0, zl0 - 0.55 - k * 1.1), ls);
    }
    for (const [za, zb] of [[zl1, zl1 + 16], [zl0 - 16, zl0]]) {
      P(G.box(0.9, 2.5, zb - za, 795.0, 0, (za + zb) / 2), ls);                                           // 바깥 측벽 (낮은 석재)
      const rail = G.box(0.15, 0.15, Math.hypot(zb - za, FL), 0, 0, 0); const ang = Math.atan2(FL, zb - za) * (za >= zl1 ? 1 : -1);
      rail.rotateX(ang); rail.translate(791.0, FL / 2 + 3.0, (za + zb) / 2); P(rail, dark, false);
    }
    P(G.box(1.0, 3.2, 1.0, 795.0, FL, zl1), ls); P(G.box(1.0, 3.2, 1.0, 795.0, FL, zl0), ls);              // 계단 위 석재 기둥(포스트)
  }

  // ---- 수경대·프리즈 띠·코니스(모딜리온)·블로킹 코스
  ring(POLY, -1, 1.5, 0.35, ls);
  ring(POLY, WT, 1.0, 0.45, ls);
  ring(POLY, FR - 0.6, 0.6, 0.15, ls);
  ring(POLY, CB, 1.0, 0.5, ls);
  ring(POLY, CB + 1.0, 2.0, 2.2, ls, { bottom: true });
  ring(POLY, CT, PT - CT, 0.3, ls);
  // 모딜리온: 코니스 밑 2 ft 간격 (각 변)
  for (let i = 0; i < POLY.length; i++) {
    const f = face(POLY[i], POLY[(i + 1) % POLY.length]);
    if (f.L < 8) continue;
    const n = Math.floor(f.L / 2.0);
    for (let k = 0; k < n; k++) { const s = (k + 0.5) * f.L / n; fbox(f, s - 0.3, s + 0.3, CB + 0.4, CB + 1.0, 1.9, 1.1, ls, false); }
  }
  // 블로킹 코스 안쪽 지붕 바탕(평탄 링) — 힙지붕과 파라펫 사이
  P(G.capGeometry(POLY, [], CT + 0.2), slate);

  // ---- 지붕: 본 힙 x 727..773 / 서측 저힙 x 701..727 / 동측 교차 힙 (z 618..659, 동쪽 787 까지)
  K.hipRoof(727, 773, 583, 697, CT, 0.36, slate, { ov: 0 });
  K.hipRoof(701.5, 727, 584, 695, CT, 0.36, slate, { ov: 0 });
  K.hipRoof(745, 784.5, 618.5, 659, CT, 0.36, slate, { ov: 0 });
  // 지붕 위: 천창 2 (위성 x 745 z 625 / x 744 z 663 흰 점), 환기 굴뚝 (x 721 z 586)
  P(G.box(3, 1.2, 3, 745, 36.5, 625), M.metal); P(G.box(3.5, 1.4, 3.5, 731, 34, 588), M.metal);
  P(G.box(2.4, 4.5, 2.4, 712.5, CT, 593), ls);

  // ---- 주변: 북측 건물 둘레 화단 경계 (낮은 철제 울타리 — vp45_309: 지하층 창 앞 녹색 울타리)
  for (const [x0, z0, x1, z1] of [[790, 663, 790, 700], [790, 578, 790, 614]]) P(G.box(0.15, 3.0, z1 - z0, x0, 0, (z0 + z1) / 2), dark, false);

  const grp = new THREE.Group();
  for (const m of G.mergeByMaterial(parts)) grp.add(m);
  return grp;
}
