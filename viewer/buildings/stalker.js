// Stalker Hall (1953) — 위성 기반 모델 (도면 없음, 쓸 만한 Street View 없음)
// 주의: scratch/sv/461428312 의 vp29/vp30 사진은 Chestnut·Eagle 교차로에서 찍은 것으로 Landini Center·Zorah Shrine·동쪽 건물만 보이고
//   Stalker Hall 은 500 ft 이상 떨어져 나무에 가려 보이지 않는다. 형태는 Esri z20(겨울)·z19(여름) 위성 판독 + 연도·성격으로 구성.
// ■ 평면(위성): ㄷ 자 x 229~399, z 228~314, 북쪽 가운데 중정 x 277.4~349.7, z 228.5~258 (그늘). 남측(z 314) 이 정면:
//   남면 상단에 흰 석재 창틀이 약 16 ft 간격으로 반복(사영 왜곡으로 입면 상부가 보임), 가운데 x 300~330 앞 계단(z 314~325).
// ■ 지붕(위성): 동·서 두 날개 위 아주 낮은 힙지붕(옅은 X 자 힙선, 회색), 가운데 x 296.5~327, z 273~311 에 진한 회색 힙지붕
//   (중앙 파빌리온), 중정 쪽 x 268~290, z 255~268 어두운 박스(옥상 펜트하우스), 흰 환기구 2.
// ■ 층수·높이: 3 층, 층고 13 ft (1950 년대 강의동) → 벽 상단 40, 코니스 40~41.5, 날개 힙 경사 0.22, 중앙 힙 경사 0.5.
// ■ 재료: 붉은 벽돌 + 석회석(기단, 1층 위 띠, 창대·인방, 중앙 파빌리온 모서리 퀸·입구 프론티스피스).
// ■ 창 리듬(가정): 남면 베이 피치 ≈ 8 ft (석재 틀 16 ft 간격 = 창 2 개 한 쌍), 창 4.5×6.5 (1 층 4.5×7.5), 동·서·북면 같은 리듬.
// ■ 입구: 남면 중앙(석재 프론티스피스 + 2 짝 문 + 계단 5 단), 동·서 끝면 중앙 보조 출입문.
import * as THREE from 'three';

const VIEW_ALT = /[?&]v=alt/.test(import.meta.url);
export const meta = {
  id: 'stalker', name: 'Stalker Hall', osm: 'way/461428312',
  anchor: [0, 0], rotation: 0, height: 50,
  preset: VIEW_ALT ? { pos: [470, 160, 20], tgt: [314, 12, 271] } : { pos: [200, 160, 620], tgt: [314, 12, 271] },
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

const POLY = [[229.2, 228.8], [229.7, 314.2], [398.8, 313.2], [398.3, 228.0], [349.6, 228.3], [349.8, 258.0], [277.6, 258.5], [277.4, 228.6]];

export function build(M, G) {
  const parts = [];
  const K = kit(M, G, parts);
  const { P, face, fbox, win, wall, ring } = K;
  const brick = M.brick_red, ls = M.limestone, dark = M.dark;
  const roofGray = M.roof_gravel.clone(); roofGray.color = new THREE.Color(0xa9a59c);
  const slate = M.roof_gravel.clone(); slate.color = new THREE.Color(0x6f747d);
  const F = 13, WTOP = 40, EAVE = 41.5;
  const rows = [[3.2, 10.7], [16.3, 22.8], [29.3, 35.8]];

  /** 벽돌 입면: 베이 피치 pitch, 창 w, 층별 rows. skip 구간, 문(doors: s 중심) */
  function facade(f, { pitch = 8.2, w = 4.4, margin = 3.5, skip = [], doors = [], noWall = false } = {}) {
    const ops = [];
    const n = Math.max(1, Math.round((f.L - 2 * margin) / pitch)), p = (f.L - 2 * margin) / n;
    for (let i = 0; i < n; i++) {
      const c = margin + p * (i + 0.5);
      if (skip.some(([a, b]) => c > a && c < b)) continue;
      const isDoor = doors.some(d => Math.abs(d - c) < p / 2);
      for (let r = 0; r < 3; r++) {
        const [b, t] = rows[r];
        if (r === 0 && isDoor) {
          ops.push(K.door(f, c - 3, c + 3, 7.5, 10.7, { wallMat: ls }));
          fbox(f, c - 4.2, c + 4.2, 10.7, 11.9, 1.0, 0.4, ls);
          continue;
        }
        ops.push(win(f, c - w / 2, c + w / 2, b, t, { wallMat: brick, nx: 2, rails: [(b + t) / 2 + 0.5], sill: ls, head: ls, headH: 0.8 }));
      }
    }
    if (!noWall) wall(f, -1, WTOP, ops, brick);
    return ops;
  }

  // ---- 외벽: 변 0 서(남향 진행), 1 남(정면), 2 동, 3 북동 날개 북면, 4 중정 동벽, 5 중정 남벽, 6 중정 서벽, 7 북서 날개 북면
  const fs = POLY.map((p, i) => face(p, POLY[(i + 1) % POLY.length]));
  facade(fs[0], { doors: [fs[0].L / 2] });
  const fS = fs[1], cS = fS.L / 2;
  {
    const opsS = facade(fS, { skip: [[cS - 15.5, cS + 15.5]], noWall: true });
    for (const [a, c] of [[0, cS - 15.5], [cS + 15.5, fS.L]]) wall(face(fS.at(a), fS.at(c)), -1, WTOP, opsS.filter(o => o.s >= a && o.e <= c).map(o => ({ ...o, s: o.s - a, e: o.e - a })), brick);
  }
  facade(fs[2], { doors: [fs[2].L / 2] });
  facade(fs[3], { pitch: 8.5 });
  facade(fs[4], { pitch: 8.5, margin: 2.5 });
  facade(fs[5], { pitch: 8.2, doors: [fs[5].L / 2] });
  facade(fs[6], { pitch: 8.5, margin: 2.5 });
  facade(fs[7], { pitch: 8.5 });
  // ---- 남측 중앙 파빌리온 (x 296.5..327, 31 ft): 석재 프론티스피스(필라스터 4 + 엔타블러처 + 페디먼트 없는 파라펫), 문, 2·3 층 창 3
  {
    const s0 = cS - 15.5, s1 = cS + 15.5, ops = [];
    ops.push(K.door(fS, cS - 3.5, cS + 3.5, 8, 11.5, { wallMat: ls }));
    for (const dc of [-9, 9]) ops.push(win(fS, cS + dc - 2.2, cS + dc + 2.2, rows[0][0], rows[0][1], { wallMat: ls, nx: 2, rails: [7.5], sill: ls }));
    for (const dc of [-9, 0, 9]) for (const r of [1, 2]) ops.push(win(fS, cS + dc - 2.4, cS + dc + 2.4, rows[r][0], rows[r][1], { wallMat: brick, nx: 2, rails: [rows[r][0] + 3.8], sill: ls, head: ls, headH: 0.8 }));
    // 이 구간 벽은 facade 에서 skip → 여기서 다시 세움 (s0..s1 만): 별도 face
    const f = face(fS.at(s0), fS.at(s1));
    wall(f, -1, WTOP, ops.map(o => ({ ...o, s: o.s - s0, e: o.e - s0 })), brick);
    // 위 win/door 는 fS 기준으로 이미 배치됨 (같은 평면) — 벽만 f 로 다시 세움
    fbox(fS, s0 - 0.2, s0 + 2.0, -1, WTOP, 0.5, 0.2, ls); fbox(fS, s1 - 2.0, s1 + 0.2, -1, WTOP, 0.5, 0.2, ls);   // 파빌리온 모서리 석재 띠
    for (const s of [cS - 6.5, cS + 6.5]) fbox(fS, s - 0.9, s + 0.9, 0, 13.5, 0.8, 0.35, ls);                      // 문 양옆 필라스터
    fbox(fS, cS - 8, cS + 8, 12.5, 14.6, 1.2, 0.5, ls);                                                               // 엔타블러처
    fbox(fS, cS - 6, cS + 6, 14.6, 15.4, 0.6, 0.3, ls);
    // 계단 5 단 + 측벽
    for (let k = 0; k < 4; k++) P(G.box(20 - k * 0, 0.45 * (4 - k), 1.2, 313.2 + 0, 0, 314.3 + 0.6 + k * 1.2), ls);
    for (const x of [302.2, 324.2]) P(G.box(1.2, 2.2, 6, x, 0, 317.2), ls);
  }
  // ---- 띠·코니스
  ring(POLY, -1, 2.8, 0.3, ls);                         // 석회석 기단
  ring(POLY, F - 0.2, 0.7, 0.2, ls);                    // 1 층 위 띠
  ring(POLY, WTOP - 0.4, 0.9, 0.3, ls);                 // 상부 띠
  ring(POLY, WTOP + 0.5, 1.0, 1.4, M.white, { bottom: true });   // 처마 코니스
  // ---- 지붕: 서·동 날개 저경사 힙 + 중앙 힙(진한 회색) + 평탄 연결부
  // 중정(x 277.4~349.7, z 228.5~258) 위는 비워 둠: 날개마다 남북 힙 + 남측 막대 힙으로 분할
  K.hipRoof(229.5, 277.4, 228.6, 313.9, EAVE, 0.22, roofGray, { ov: 0.8 });
  K.hipRoof(262, 296.5, 258.5, 313.9, EAVE, 0.22, roofGray, { ov: 0.8 });
  K.hipRoof(349.7, 398.6, 228.1, 313.4, EAVE, 0.22, roofGray, { ov: 0.8 });
  K.hipRoof(327, 364, 258.2, 313.4, EAVE, 0.22, roofGray, { ov: 0.8 });
  P(G.capGeometry([[296.5, 258.3], [296.5, 313.8], [327, 313.6], [327, 258.2]], [], EAVE + 0.2), roofGray);
  K.hipRoof(296.5, 327, 273, 311, EAVE + 0.2, 0.5, slate, { ov: 0.6 });
  // 펜트하우스 (x 268..290, z 255..268) — 날개 힙과 겹침, 벽돌 + 루버
  {
    const poly = [[268.5, 255.5], [268.5, 268], [290, 268], [290, 255.5]];
    for (let i = 0; i < 4; i++) { const f = face(poly[i], poly[(i + 1) % 4]); wall(f, EAVE, EAVE + 8, i === 3 ? [win(f, 4, 17, EAVE + 2, EAVE + 6, { glass: dark, nx: 4 })] : [], brick); }
    ring(poly, EAVE + 7.5, 0.6, 0.3, ls); P(G.capGeometry(poly, [], EAVE + 8.1), M.roof_membrane);
  }
  for (const [x, z] of [[276, 236], [361, 236]]) P(G.cylinder(1.0, 2.2, x, EAVE + 3, z, 10), M.metal);

  const grp = new THREE.Group();
  for (const m of G.mergeByMaterial(parts)) grp.add(m);
  return grp;
}
