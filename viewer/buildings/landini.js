// Landini Center for Performing and Fine Arts (1997) — 사진·위성 기반 모델 (도면 없음)
// 근거: 이 건물 폴더에는 사진이 없지만, Normal Hall 폴더의 vp49 (N 7th St, 225/270/315 — 동측 벽돌벽·유리 출입구·프리캐스트 기단)
//   와 Stalker 폴더의 vp29_229 (Chestnut & 7th, 북동 모서리 출입구·조각상·계단식 매스), vp30_298/343 (7th & Eagle, 남동 모서리
//   큰 벽돌 박스: 프리캐스트 기단 ≈ 9.5 ft, 2/3 높이 프리캐스트 띠, 띠 위 작은 창 열), Esri z20·z19 위성.
// ■ 볼륨 (위성 z19 의 선명한 경계로 판독):
//   LOW  전체 발자국 1 단 (로비·연습실·북측 출입부) 평지붕 28 ft, 서측 부채꼴 로비(곡면 벽) — 1 층 유리 + 벽돌 피어(가정)
//   H    공연장(오디토리엄) 대각 직사각형 N(728,298) W(692,343) S(747,394) E(783,349), 지붕 44 ft — NW 변을 따라 그림자
//   E    동측 블록 x 760~785.8, z 300~406.8, 40 ft (7th St 쪽 높은 벽돌벽, vp49_315)
//   S    남측 무대 박스 x 685.9~772.3, z 379~483.5, 52 ft (vp30: 모서리 높이 ≈ 50~53 ft 로 계산) — 프리캐스트 기단 0~9.5,
//        프리캐스트 띠 33~34.6, 띠 위 작은 창(4×5.5) 열, 띠 아래 창 1~2
// ■ 재료: 주황빛 붉은 벽돌, 밝은 회베이지 프리캐스트(기단·띠·코핑), 어두운 알루미늄 프레임 유리.
// ■ 출입구: 북동 V 자 홈 2 곳(e22/e0, e2/e3) 유리 커튼월 + 캐노피(vp29_229), 동측 단차(e18) 유리 출입구 + 캐노피(vp49_270),
//   남서 쐐기(e13) 유리 출입구. 로비 위 피라미드 천창 (705, 313) — 위성의 흰 테두리 사각.
// ■ 가정: 서측 곡면 로비의 유리 비율, 북·북서 벽 창 배치, LOW 높이(북동 출입부는 실제로 약간 낮음 — 단일 28 ft 로 단순화).
import * as THREE from 'three';

const VIEW_ALT = /[?&]v=alt/.test(import.meta.url);
export const meta = {
  id: 'landini', name: 'Landini Center for Performing and Fine Arts', osm: 'way/545265791',
  anchor: [0, 0], rotation: 0, height: 52,
  preset: VIEW_ALT ? { pos: [440, 170, 200], tgt: [720, 15, 360] } : { pos: [1060, 170, 470], tgt: [725, 15, 360] },
  sheets: 'Street View vp49 (2019), vp29/vp30 (2019, 2023); Esri imagery z20/z19',
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

const POLY = [[740.5, 262.1], [746.1, 251.4], [727.4, 236.6], [719.0, 247.0], [707.0, 237.4], [665.6, 286.2], [660.1, 295.5], [656.6, 305.6], [655.1, 317.2], [656.1, 328.9], [659.5, 340.0], [670.4, 355.1], [684.2, 363.9], [688.4, 364.7], [676.5, 379.3], [685.5, 386.4], [685.9, 483.5], [772.3, 483.2], [772.0, 406.8], [785.8, 406.8], [785.1, 256.1], [764.1, 256.1], [752.0, 271.2]];

export function build(M, G) {
  const parts = [];
  const K = kit(M, G, parts);
  const { P, face, fbox, win, wall, ring } = K;
  const brick = M.brick_red, pc = M.precast, dark = M.dark;
  const LOW = 28, HH = 44, HE = 40, HS = 52;
  const fs = POLY.map((p, i) => face(p, POLY[(i + 1) % POLY.length]));
  const sub = (f, a, b) => face(f.at(a), f.at(b));

  /** 벽돌 벽 + 프리캐스트 기단(0..base) + 코핑 */
  function brickWall(f, y1, ops = [], { base = 2.0 } = {}) {
    wall(f, -1, y1, ops, brick);
    if (base > 0) fbox(f, 0, f.L, -1, base, 0.5, 0.15, pc);
    fbox(f, -0.3, f.L + 0.3, y1 - 0.2, y1 + 0.8, 1.4, 0.2, pc);
  }
  /** 유리 커튼월 (0..top): 세로 멀리언 피치 5, 레일 */
  function curtain(f, top, rails = [8, 16]) {
    const nx = Math.max(1, Math.round(f.L / 5));
    win(f, 0.6, f.L - 0.6, 0, top, { d: 0.4, nx, rails, frame: dark, fw: 0.25 });
    return { s: 0.6, e: f.L - 0.6, b: -1, t: top };
  }
  function canopy(f, s, e, y, depth) { fbox(f, s, e, y, y + 1.0, depth, depth / 2, pc); }

  // ======================================================== LOW (외곽 벽 28 ft) — 변별 처리
  for (let i = 0; i < POLY.length; i++) {
    const f = fs[i];
    if ([15, 16, 17].includes(i)) continue;                         // S 박스 외벽 (아래)
    if (i === 19) continue;                                          // 동측 벽 (아래, E 블록 구간 분리)
    if ([22, 0, 2, 3].includes(i)) {                                 // V 자 출입 홈: 유리 0..14 + 벽돌 위
      const op = curtain(f, 14, [8]);
      brickWall(f, LOW, [op], { base: 0 });
      fbox(f, 0, f.L, 14, 15, 0.6, 0.3, pc);
      continue;
    }
    if (i >= 5 && i <= 11) {                                         // 서측 곡면 로비: 유리 0..22 + 피어
      const ops = [win(f, 1.0, f.L - 1.0, 0, 22, { d: 0.5, nx: Math.max(1, Math.round(f.L / 5)), rails: [9, 16], frame: dark })];
      ops[0].b = -1;
      brickWall(f, LOW, ops, { base: 0 });
      fbox(f, 0, f.L, 22, 23.2, 0.8, 0.3, pc);
      continue;
    }
    if (i === 13) {                                                  // 남서 쐐기 출입구
      const ops = [K.door(f, f.L / 2 - 4, f.L / 2 + 4, 8, 12, { wallMat: brick })];
      ops.push(win(f, 1.5, f.L / 2 - 5, 0.5, 12, { d: 0.5, nx: 2, rails: [8] }), win(f, f.L / 2 + 5, f.L - 1.5, 0.5, 12, { d: 0.5, nx: 2, rails: [8] }));
      brickWall(f, LOW, ops); canopy(f, f.L / 2 - 6, f.L / 2 + 6, 12.5, 5);
      continue;
    }
    // 일반 벽돌 벽 (북·북서 대각, 북동 블록 북면 등): 1 층 창(4×6) + 2 층 띠창
    const ops = [];
    if (f.L > 15) {
      const n = Math.floor(f.L / 12);
      for (let k = 0; k < n; k++) { const c = f.L * (k + 0.5) / n; ops.push(win(f, c - 2.2, c + 2.2, 3, 9, { wallMat: brick, nx: 1, sill: pc })); ops.push(win(f, c - 3.5, c + 3.5, 15.5, 20.5, { wallMat: brick, nx: 2, sill: pc })); }
    }
    brickWall(f, LOW, ops);
    fbox(f, 0, f.L, 11.5, 12.5, 0.5, 0.15, pc);
  }
  // 출입 홈 캐노피 (북동 V 2 곳)
  for (const i of [22, 2]) { const f = fs[i]; canopy(f, -2, f.L + 2, 13.5, 6); }
  // ======================================================== 동측 벽 e19 (x 785.8, z 406.8 → 256.1): 남쪽 E 블록 구간 40 ft, 북쪽 28 ft
  {
    const f = fs[19], sCut = (406.8 - 300) / (406.8 - 256.1) * f.L;
    const fa = sub(f, 0, sCut), fb = sub(f, sCut, f.L);
    const opsA = [];
    for (const c of [18, 46, 74]) opsA.push(win(fa, c - 1.6, c + 1.6, 3.5, 7.5, { wallMat: brick, sill: pc }));
    for (const c of [30, 60, 90]) opsA.push(win(fa, c - 2, c + 2, 30, 35, { wallMat: brick, sill: pc }));
    brickWall(fa, HE, opsA);
    fbox(fa, 0, fa.L, 24, 25, 0.5, 0.15, pc);
    const opsB = [];
    for (const c of [10, 30]) opsB.push(win(fb, c - 1.6, c + 1.6, 3.5, 7.5, { wallMat: brick, sill: pc }));
    brickWall(fb, LOW, opsB);
    fbox(fb, 0, fb.L, 11.5, 12.5, 0.5, 0.15, pc);
  }
  // e18 (z 406.8 남향 단차, x 772 → 785.8): 유리 출입구 + 캐노피 (vp49_270)
  {
    const f = fs[18];
    const ops = [K.door(f, 3.5, 10.5, 8, 11, { wallMat: brick })];
    ops.push(win(f, 0.8, 3.0, 0.5, 11, { d: 0.5 }), win(f, 11, 13, 0.5, 11, { d: 0.5 }));
    wall(f, -1, HE, ops, brick);
    fbox(f, -0.3, f.L + 0.3, HE - 0.2, HE + 0.8, 1.4, 0.2, pc);
    canopy(f, -1, f.L + 1, 11.5, 7);
  }

  // ======================================================== S 무대 박스 (x 685.9..772.3, z 379..483.5)
  {
    const sb = (f, nUp, low = []) => {
      const ops = [];
      for (let k = 0; k < nUp; k++) { const c = f.L * (k + 0.5) / nUp; ops.push(win(f, c - 2, c + 2, 37.5, 43, { wallMat: brick, nx: 1, sill: pc })); }
      for (const c of low) ops.push(win(f, c - 2, c + 2, 20, 26, { wallMat: brick, sill: pc }));
      wall(f, -1, HS, ops, brick);
      fbox(f, 0, f.L, -1, 9.5, 0.7, 0.2, pc);                                         // 프리캐스트 기단
      fbox(f, 0, f.L, 33, 33.7, 0.7, 0.3, pc); fbox(f, 0, f.L, 34.0, 34.6, 0.5, 0.25, pc);   // 이중 띠
      fbox(f, -0.4, f.L + 0.4, HS - 0.3, HS + 0.9, 1.6, 0.3, pc);                     // 코핑
    };
    sb(fs[15], 5, [70]);
    sb(fs[16], 5, [30]);
    sb(fs[17], 4, [40]);
    // 기단의 문 2 (서·남, 하역용)
    for (const [f, s] of [[fs[15], 40], [fs[16], 60]]) { fbox(f, s - 4, s + 4, 0, 9, 0.2, 0.05, dark); }
    // 북면 (z 379, LOW·H 지붕 위로 드러나는 부분)
    const fN = face([772.3, 379], [685.9, 379]);
    wall(fN, LOW - 0.5, HS, [], brick);
    fbox(fN, 0, fN.L, 33, 33.7, 0.7, 0.3, pc);
    fbox(fN, -0.4, fN.L + 0.4, HS - 0.3, HS + 0.9, 1.6, 0.3, pc);
    const poly = [[685.9, 379], [685.9, 483.5], [772.3, 483.2], [772.3, 379]];
    P(G.capGeometry(poly, [], HS - 1.2), M.roof_membrane);
    // 옥상: 해치·유닛 (위성 x 735 z 392), 소형 팬
    P(G.box(5, 3, 5, 735, HS - 1.2, 392), M.metal); P(G.box(8, 4, 6, 712, HS - 1.2, 440), M.metal); P(G.cylinder(1.2, 2, 752, HS - 1.2, 460, 10), M.metal);
  }
  // ======================================================== H 공연장 (대각 직사각)
  {
    const H4 = [[728, 298], [692, 343], [747, 394], [783, 349]];
    for (let i = 0; i < 4; i++) {
      const f = face(H4[i], H4[(i + 1) % 4]);
      wall(f, LOW - 0.5, HH, [], brick);
      fbox(f, 0, f.L, 36, 37, 0.6, 0.25, pc);
      fbox(f, -0.4, f.L + 0.4, HH - 0.3, HH + 0.9, 1.6, 0.3, pc);
    }
    P(G.capGeometry(H4, [], HH - 1.0), M.roof_membrane);
    P(G.box(6, 3.5, 6, 740, HH - 1.0, 340), M.metal); P(G.box(4, 2.5, 8, 725, HH - 1.0, 330), M.metal);
  }
  // ======================================================== E 동측 블록 (x 760..785.8, z 300..406.8) 북·서면 (지붕 위)
  {
    const fN = face([785.6, 300], [760, 300]), fW = face([760, 300], [760, 406.8]);
    for (const f of [fN, fW]) { wall(f, LOW - 0.5, HE, [], brick); fbox(f, -0.4, f.L + 0.4, HE - 0.2, HE + 0.8, 1.4, 0.2, pc); }
    P(G.capGeometry([[760, 300], [760, 406.8], [785.8, 406.8], [785.6, 300]], [], HE - 0.8), M.roof_gravel);
  }
  // ======================================================== LOW 지붕 + 천창
  P(G.capGeometry(POLY, [], LOW - 0.6), M.roof_gravel);
  {
    const c = [705, 313], r = 7.5, sq = [[c[0] - r, c[1] - r], [c[0] - r, c[1] + r], [c[0] + r, c[1] + r], [c[0] + r, c[1] - r]];
    P(G.sideGeometry(sq, LOW - 0.6, LOW + 1.2, 1 / 24, 1 / 12, true), pc);
    K.loft(sq, LOW + 1.2, sq.map(() => c), LOW + 6, M.pane);
  }
  for (const [x, z] of [[715, 262], [748, 245], [668, 340], [693, 300]]) P(G.box(4, 2.5, 4, x, LOW - 0.6, z), M.metal);
  for (const [x, z] of [[768, 290], [778, 292]]) P(G.box(6, 4, 5, x, LOW - 0.6, z), M.metal);
  // 북동 출입 앞 조각상 받침 + 흰 조각(vp29_229) — 위치 (752, 248) 추정
  P(G.box(4, 2.5, 4, 756, 0, 246), pc); P(G.box(1.2, 11, 3, 756, 2.5, 246, { ry: 0.5 }), M.white);

  const grp = new THREE.Group();
  for (const m of G.mergeByMaterial(parts)) grp.add(m);
  return grp;
}
