// Normal Hall (1909, 옛 Indiana State Normal School 도서관, NRHP) — 위성 + 일반 자료 기반 모델 (도면·사진 없음)
// 주의: scratch/sv/545265790 의 vp49 사진 3 장은 실제로는 Landini Center 동측 벽(N 7th St) 을 찍은 것이라 Normal Hall 은
//   Street View 에 보이지 않는다. 형태는 Esri z20(겨울)·z19(여름) 위성과 건물 성격(신고전주의 석회석 도서관, 스테인드글라스 돔)으로 구성.
// ■ 볼륨(위성): 본관 x 399.4~483, z 377.3~488.8 + 북측 띠 x 411.6~505, z 359.4~377.3 + 동측 증축(곡면 동벽, x 483~520, z 359~443).
//   지붕은 전체 흰 평지붕(파라펫), 본관 중앙 (440, 409) 에 팔각 유리 돔(대각 지름 ≈ 38 ft, 방사형 리브 8 개),
//   북측 띠 위 지붕창(모니터) 2 개, 동측 증축 위 옥상기기 2 개. 남측(z 489~500) 넓은 계단 + 화분 2 개 → 정면 = 남쪽.
// ■ 층수·높이: 높은 지하층(러스티케이션, 0~7.5, 창 1.5~5.0) + 주층(도서관 열람실, 8~30, 창 10.5~26.5 트랜섬 22) = 2 층,
//   엔타블러처 30~34 (코니스 2 ft 돌출), 파라펫 34~37 (본관만, 갓돌). 돔: 팔각 드럼 34~38 + 유리 팔각 돔 정점 46.
// ■ 재료: 인디애나(베드퍼드) 석회석 전면. 주층은 매끈한 마름돌 + 베이 사이 자이언트 오더 필라스터(이오니아식).
// ■ 정면(남): 가운데 36 ft 폭 로지아(깊이 8) 에 이오니아식 원기둥 4 개, 뒤 벽에 출입문 3 + 상부 창, 앞 계단 10 단 + 측벽 블록.
// ■ 가정: 창 수·필라스터 리듬(서 6 베이, 북 5 베이, 동 남측부 2 베이), 동측 증축의 좁고 긴 세로창(서고 성격), 높이 전체.
import * as THREE from 'three';

const VIEW_ALT = /[?&]v=alt/.test(import.meta.url);
export const meta = {
  id: 'normal', name: 'Normal Hall', osm: 'way/545265790',
  anchor: [0, 0], rotation: 0, height: 46,
  preset: VIEW_ALT ? { pos: [700, 170, 260], tgt: [455, 12, 420] } : { pos: [300, 170, 700], tgt: [450, 12, 430] },
  sheets: 'Esri imagery z20/z19 (no usable Street View of this building)',
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

const POLY = [[411.6, 377.3], [399.4, 377.3], [399.4, 488.8], [483.0, 488.8], [483.0, 443.4], [508.4, 443.4], [510.8, 436.9], [511.9, 430.6], [512.5, 423.3], [519.9, 423.4], [519.4, 405.9], [516.3, 388.7], [511.5, 373.7], [504.9, 359.4], [411.6, 359.4]];

export function build(M, G) {
  const parts = [];
  const K = kit(M, G, parts);
  const { P, face, fbox, win, wall, ring, quads } = K;
  const ls = M.limestone, dark = M.dark;
  const groove = M.limestone.clone(); groove.color = new THREE.Color(0.62, 0.62, 0.6);
  const FL = 8, WB = 10.5, WT = 26.5, EB = 30, CT = 34, PT = 37;
  /** 두 3D 점 사이 각재 */
  function beam(a, b, w, h, mat) {
    const d = new THREE.Vector3(b[0] - a[0], b[1] - a[1], b[2] - a[2]), L = d.length();
    const g = new THREE.BoxGeometry(w, L, h); const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize());
    g.applyQuaternion(q); g.translate((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2); P(g, mat);
  }
  function rustic(f, y0, y1, ops) {
    const list = [];
    for (let y = y0 + 1.1; y < y1 - 0.2; y += 1.4) {
      const cuts = ops.filter(o => y + 0.22 > o.b && y < o.t).map(o => [o.s - 0.5, o.e + 0.5]).sort((a, b) => a[0] - b[0]);
      let s = 0;
      for (const [a, b] of [...cuts, [f.L, f.L]]) {
        if (a > s + 0.3) { const A = f.at(s, 0.04), B = f.at(a, 0.04); list.push([[A[0], y, A[1]], [B[0], y, B[1]], [B[0], y + 0.22, B[1]], [A[0], y + 0.22, A[1]], [f.ez[0], 0, f.ez[1]]]); }
        s = Math.max(s, b);
      }
    }
    if (list.length) quads(list, groove, false);
  }
  /** 고전 베이: 주층 큰 창(아키트레이브 + 코니스 후드 + 창대) + 지하층 창 1 */
  function bay(f, c, ops, w = 6.5) {
    ops.push(win(f, c - w / 2, c + w / 2, WB, WT, { d: 1.0, wallMat: ls, nx: 2, rails: [22], frame: dark, fw: 0.3 }));
    fbox(f, c - w / 2 - 0.8, c - w / 2, WB, WT + 0.8, 0.3, 0.12, ls);
    fbox(f, c + w / 2, c + w / 2 + 0.8, WB, WT + 0.8, 0.3, 0.12, ls);
    fbox(f, c - w / 2 - 0.8, c + w / 2 + 0.8, WT, WT + 0.8, 0.3, 0.12, ls);
    fbox(f, c - w / 2 - 1.3, c + w / 2 + 1.3, WT + 0.8, WT + 1.5, 1.2, 0.4, ls);       // 코니스 후드
    fbox(f, c - w / 2 - 1.2, c + w / 2 + 1.2, WT + 1.5, WT + 2.6, 0.4, 0.15, ls);      // 프리즈 판
    fbox(f, c - w / 2 - 0.5, c + w / 2 + 0.5, WB - 0.5, WB, 0.8, 0.35, ls);            // 창대
    fbox(f, c - 1.0, c + 1.0, WB - 2.6, WB - 0.5, 0.25, 0.1, ls);                      // 창대 밑 받침(브래킷 판)
    ops.push(win(f, c - 2.0, c + 2.0, 1.5, 5.0, { d: 0.7, wallMat: ls, nx: 2, frame: dark }));
  }
  /** 자이언트 오더 필라스터 (FL..EB): 받침, 몸체, 주두 */
  function pilaster(f, s) {
    fbox(f, s - 1.6, s + 1.6, FL - 0.6, FL + 1.0, 0.9, 0.35, ls);
    fbox(f, s - 1.3, s + 1.3, FL + 1.0, EB - 1.2, 0.6, 0.25, ls);
    fbox(f, s - 1.7, s + 1.7, EB - 1.2, EB, 0.9, 0.4, ls);
  }

  // ---- 외벽 (변 번호별 베이 수). 2 = 남측 정면(로지아) 은 별도, 곡면 세그먼트(5~8, 10~13) 는 좁은 세로창
  const nBays = { 1: 6, 3: 2, 4: 1, 13: 5 };
  const curved = new Set([5, 6, 7, 9, 10, 11, 12]);
  for (let i = 0; i < POLY.length; i++) {
    if (i === 2) continue;
    const f = face(POLY[i], POLY[(i + 1) % POLY.length]), ops = [];
    const n = nBays[i] || 0;
    if (n) {
      const p = f.L / n;
      for (let k = 0; k < n; k++) bay(f, p * (k + 0.5), ops, p < 14 ? 5.5 : 6.5);
      for (let k = 0; k <= n; k++) pilaster(f, Math.min(Math.max(p * k, 1.7), f.L - 1.7));
    } else if (curved.has(i) && f.L > 6) {
      const m = Math.max(1, Math.floor(f.L / 6));
      for (let k = 0; k < m; k++) { const c = f.L * (k + 0.5) / m; ops.push(win(f, c - 1.4, c + 1.4, WB, WT, { d: 0.9, wallMat: ls, rails: [14.5, 18.5, 22.5], frame: dark })); fbox(f, c - 1.9, c + 1.9, WB - 0.5, WB, 0.7, 0.3, ls); }
    }
    wall(f, -1, CT, ops, ls);
    rustic(f, 0, FL - 0.8, ops);
  }
  // ---- 남측 정면 (z 488.8, x 399.4→483): 양끝 베이 1 개씩 + 가운데 로지아 36 ft (원기둥 4)
  {
    const f = face(POLY[2], POLY[3]), ops = [];
    const c = f.L / 2, hw = 18, DEP = 8;
    bay(f, 11.5, ops); bay(f, f.L - 11.5, ops);
    for (const s of [2, 21, f.L - 21, f.L - 2]) pilaster(f, s);
    ops.push({ s: c - hw, e: c + hw, b: FL, t: EB - 1.5 });
    wall(f, -1, CT, ops, ls);
    rustic(f, 0, FL - 0.8, ops);
    // 로지아 뒷벽: 문 3 (2 짝, 트랜섬) + 문 위 창 3 (반원 대신 사각 + 후드)
    const b0 = f.at(c - hw, -DEP), b1 = f.at(c + hw, -DEP), fb = face(b0, b1), bo = [];
    for (const dx of [-11, 0, 11]) {
      const s = hw + dx;
      bo.push({ s: s - 3, e: s + 3, b: FL - 0.5, t: FL + 12 });
      fbox(fb, s - 3, s + 3, FL, FL + 8.5, 0.2, -0.7, dark, false);
      fbox(fb, s - 0.06, s + 0.06, FL, FL + 8.5, 0.1, -0.55, M.white, false);
      win(fb, s - 3, s + 3, FL + 8.5, FL + 12, { d: 0.7, nx: 2 });
      K.reveal(fb, s - 3, s + 3, FL, FL + 12, 0.7, ls);
      fbox(fb, s - 3.8, s + 3.8, FL + 12, FL + 13, 0.5, 0.2, ls);
      bo.push(win(fb, s - 2.5, s + 2.5, FL + 14.5, EB - 3.5, { d: 0.7, wallMat: ls, nx: 2, frame: dark }));
    }
    wall(fb, FL, EB - 1.5, bo, ls);
    for (const [s, sgn] of [[c - hw, 1], [c + hw, -1]]) { const a = f.at(s, 0), b = f.at(s, -DEP); wall(sgn > 0 ? face(a, b) : face(b, a), FL, EB - 1.5, [], ls); }
    const q = [f.at(c - hw, 0), f.at(c + hw, 0), f.at(c + hw, -DEP), f.at(c - hw, -DEP)];
    K.capDown(q, EB - 1.5, ls); P(G.capGeometry(q, [], FL), ls);
    // 원기둥 4 (r 1.5, 받침 FL..FL+1.2, 주두 EB-1.5..EB) — 정면선에서 1.8 ft 안쪽
    for (let k = 0; k < 4; k++) {
      const s = c - hw + 36 * (k + 0.5) / 4, p = f.at(s, -1.8);
      P(G.box(3.8, 1.2, 3.8, p[0], FL, p[1]), ls);
      P(G.cylinder(1.5, EB - FL - 2.7, p[0], FL + 1.2, p[1], 16), ls);
      P(G.box(3.9, 1.5, 3.2, p[0], EB - 1.5, p[1]), ls);
      for (const ds of [-1.6, 1.6]) { const v = f.at(s + ds, -1.8); P(G.cylinder(0.55, 0.8, v[0], EB - 1.6, v[1], 10), ls); }
    }
    // 정면 계단 (x 418..464, z 488.8..499.8: 10 단) + 측벽 블록 2 + 화분(위성의 어두운 점)
    for (let k = 0; k < 10; k++) { const h = FL - k * 0.8; P(G.box(46, h, 1.1, 441.2, 0, 489.35 + k * 1.1), ls); }
    for (const x of [415.5, 466.9]) { P(G.box(5, FL + 0.6, 12, x, 0, 494.8), ls); P(G.cylinder(1.6, 2.2, x, FL + 0.6, 497.5, 12), ls); P(G.cylinder(1.4, 1.6, x, FL + 2.8, 497.5, 12), M.grass); }
    // 로지아 위 명판(어두운 글자 띠 대신 석재 판) + 블로킹
    fbox(f, c - 14, c + 14, EB + 0.6, EB + 3.0, 0.3, 0.1, ls);
  }

  // ---- 수평 띠: 기단, 지하층 상부 수경대, 엔타블러처(아키트레이브·프리즈·코니스), 파라펫(본관), 갓돌
  ring(POLY, -1, 1.4, 0.35, ls);
  ring(POLY, FL - 0.8, 1.0, 0.45, ls);
  ring(POLY, EB, 1.0, 0.35, ls);
  ring(POLY, CT - 1.4, 1.4, 2.0, ls, { bottom: true });
  // 덴틸 (코니스 밑, 1.5 ft 간격)
  for (let i = 0; i < POLY.length; i++) {
    const f = face(POLY[i], POLY[(i + 1) % POLY.length]); if (f.L < 6) continue;
    const n = Math.floor(f.L / 1.5);
    for (let k = 0; k < n; k++) { const s = (k + 0.5) * f.L / n; fbox(f, s - 0.35, s + 0.35, CT - 2.0, CT - 1.4, 1.2, 0.6, ls, false); }
  }
  // 지붕: 전체 평지붕(흰 멤브레인), 본관 파라펫 (34~37) + 갓돌, 증축부는 낮은 파라펫 1.5
  P(G.capGeometry(POLY, [], CT - 0.3), M.roof_membrane);
  for (let i = 0; i < POLY.length; i++) {
    const a = POLY[i], b = POLY[(i + 1) % POLY.length], f = face(a, b);
    const main = a[0] <= 483.01 && b[0] <= 483.01;
    const h = main ? PT : CT + 1.5;
    fbox(f, 0, f.L, CT, h, 1.0, -0.2, ls);
    fbox(f, -0.3, f.L + 0.3, h, h + 0.4, 1.5, -0.1, ls);
    if (main && f.L > 20) {                                            // 파라펫 패널(얕은 홈)
      const n = Math.floor(f.L / 8);
      for (let k = 0; k < n; k++) { const s = (k + 0.5) * f.L / n; fbox(f, s - 2.8, s + 2.8, CT + 0.7, PT - 0.7, 0.1, 0.32, groove, false); }
    }
  }
  // ---- 팔각 유리 돔 (중심 440, 409): 석재 드럼 34→38 + 유리 8 면(정점 46) + 리브 8 + 꼭대기 고리
  {
    const C = [440, 409.5], R = 19.5, n = 8, rot = Math.PI / 8;
    const oct = []; for (let i = 0; i < n; i++) { const t = -(i / n) * Math.PI * 2 + rot; oct.push([C[0] + R * Math.cos(t), C[1] + R * Math.sin(t)]); }
    P(G.sideGeometry(oct, CT - 0.3, 38, 1 / 24, 1 / 12, true), ls); ring(oct, 37.4, 0.8, 0.5, ls);
    const top = oct.map(() => C);
    K.loft(oct, 38.2, top, 46, M.pane);
    for (const p of oct) beam([p[0], 38.2, p[1]], [C[0], 46, C[1]], 0.5, 0.5, dark);
    // 중간 수평 링 (리브 사이)
    const mid = oct.map(p => [C[0] + (p[0] - C[0]) * 0.5, C[1] + (p[1] - C[1]) * 0.5]);
    for (let i = 0; i < n; i++) { const a = mid[i], b = mid[(i + 1) % n]; beam([a[0], 42.1, a[1]], [b[0], 42.1, b[1]], 0.35, 0.35, dark); }
    P(G.cylinder(1.4, 1.0, C[0], 45.6, C[1], 12), dark);
  }
  // 북측 띠 지붕 모니터(지붕창) 2 + 증축부 옥상기기 2 + 해치
  for (const [x, z, w, d] of [[424, 374, 7, 15], [439.5, 375, 10, 17]]) { P(G.box(w, 2.2, d, x, CT - 0.3, z), ls); P(G.box(w - 1, 0.3, d - 1, x, CT + 1.9, z), M.pane, false); }
  for (const [x, z] of [[493, 412], [492.5, 425]]) P(G.box(5, 3.5, 5, x, CT - 0.3, z), M.metal);
  P(G.box(4, 2, 4, 470, CT - 0.3, 378), M.metal);

  const grp = new THREE.Group();
  for (const m of G.mergeByMaterial(parts)) grp.add(m);
  return grp;
}
