// Condit House (1860, 이탈리아네이트 주택 — ISU 총장 관저) — 위성 + 일반 자료 기반 모델 (도면 없음)
// 주의: scratch/sv/545265807 의 vp64 사진 3 장은 Cherry St·Bayh Way 교차로에서 Technology Building 모서리만 보이고
//   Condit House 는 나무·건물에 가려 보이지 않는다. 형태는 Esri z20 위성 판독 + 이탈리아네이트 양식 일반형.
// ■ 평면(위성): 본채 x 265.8~320.2, z 954.8~991 (54×36, 힙지붕, 굴뚝 그림자 2), 북측 중앙 돌출 x 283~302.8, z 947~955
//   (정면 = 북쪽, 2 층 돌출 베이), 뒤채 x 283~313, z 991~1035.7 (힙지붕), 뒤채 동측 2 층 베이창 x 313~316.4, z 996.8~1016.7
//   (위성에서 청록색 = 동판 지붕), 남측 1 층 뒤 포치 x 288.5~308.2, z 1035.7~1043.5.
// ■ 층수·높이: 2 층, 층고 13.5 (이탈리아네이트 높은 층) + 석조 기초 2.5 → 처마 28.5, 브래킷 코니스(2.5 ft 돌출),
//   본채 힙 경사 0.35 (정점 ≈ 35). [항공사진으로 수정] 쿠폴라 없음, 정면 돌출부 = 북향 박공(페디먼트), 지붕 = 밝은 회색 슁글.
//   근거: ISU 가상투어 드론 파노라마 main_quad/b (북측 정면 근경, 비교 scratch/aerial/condit_house.png) — 붉은 벽돌, 흰 코니스·창틀,
//   진녹색 덧문, 굵은 벽돌 굴뚝, 뒤채 회색 힙지붕은 모델과 일치.
// ■ 재료: 붉은 벽돌, 흰 목재 트림(코니스·브래킷·창 후드·포치), 석회석 기초·창대, 진녹색 덧문, 회색 지붕(아스팔트 슁글/슬레이트).
// ■ 창: 긴 2-over-2 창 (1 층 3.2×8.6, 2 층 3.2×7.6), 흰 아치형 후드 대신 사각 후드 + 키스톤, 덧문.
// ■ 정면 포치(가정): 북측 돌출부 앞 1 층 포치 26×7 (흰 기둥 4, 평지붕 + 난간) — 이탈리아네이트 일반형.
import * as THREE from 'three';

const VIEW_ALT = /[?&]v=alt/.test(import.meta.url);
export const meta = {
  id: 'condit', name: 'Condit House', osm: 'way/545265807',
  anchor: [0, 0], rotation: 0, height: 42,
  preset: VIEW_ALT ? { pos: [470, 130, 1190], tgt: [293, 12, 993] } : { pos: [140, 130, 790], tgt: [293, 12, 990] },
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

const rectCCW = (x0, z0, x1, z1) => [[x0, z0], [x0, z1], [x1, z1], [x1, z0]];

export function build(M, G) {
  const parts = [];
  const K = kit(M, G, parts);
  const { P, face, fbox, win, wall, ring } = K;
  const brick = M.brick_red, ls = M.limestone, wt = M.white, dark = M.dark;
  const roofM = M.roof_gravel.clone(); roofM.color = new THREE.Color(0xa2a6ab);   // 항공사진(main_quad/b): 밝은 회색 슁글
  const copper = new THREE.MeshStandardMaterial({ color: 0x6f9e93, roughness: 0.6, metalness: 0.3 });
  const shutter = new THREE.MeshStandardMaterial({ color: 0x2f4a36, roughness: 0.8 });
  const FND = 2.5, F2 = 16, EAVE = 28.5;
  const R1 = [4.6, 13.2], R2 = [18.2, 25.8];

  /** 이탈리아네이트 창: 유리 2-over-2 + 흰 후드·키스톤 + 석재 창대 + 덧문 */
  function iwin(f, c, [b, t], ops) {
    ops.push(win(f, c - 1.6, c + 1.6, b, t, { d: 0.5, wallMat: brick, nx: 2, rails: [(b + t) / 2], frame: wt, fw: 0.18 }));
    fbox(f, c - 2.1, c + 2.1, t + 0.2, t + 1.1, 0.5, 0.2, wt);          // 후드
    fbox(f, c - 0.35, c + 0.35, t - 0.1, t + 1.4, 0.6, 0.25, wt);       // 키스톤
    fbox(f, c - 2.0, c + 2.0, b - 0.35, b, 0.6, 0.25, ls);              // 창대
    for (const sg of [-1, 1]) fbox(f, c + sg * 2.45 - 0.75, c + sg * 2.45 + 0.75, b, t, 0.12, 0.08, shutter, false);   // 덧문
  }
  /** 벽돌 면 + 창 위치 목록(s 중심) per 층 */
  function bwall(f, y1, c1 = [], c2 = [], extra = []) {
    const ops = [...extra];
    for (const c of c1) iwin(f, c, R1, ops);
    for (const c of c2) iwin(f, c, R2, ops);
    wall(f, -1, y1, ops, brick);
    fbox(f, 0, f.L, -1, FND, 0.4, 0.15, ls);                            // 석조 기초
  }
  /** 브래킷 코니스: 흰 띠 + 처마판 + 쌍 브래킷 */
  function cornice(poly, y, ov) {
    ring(poly, y - 1.6, 1.6, 0.25, wt);
    for (let i = 0; i < poly.length; i++) {
      const f = face(poly[i], poly[(i + 1) % poly.length]), n = Math.max(1, Math.round(f.L / 4.5));
      for (let k = 0; k <= n; k++) { const s = Math.min(Math.max(f.L * k / n, 0.6), f.L - 0.6); for (const d of [-0.45, 0.45]) fbox(f, s + d - 0.2, s + d + 0.2, y - 1.6, y, ov - 0.2, (ov - 0.2) / 2, wt, false); }
    }
  }

  // ======================================================== 본채 (x 265.8..320.2, z 954.8..991)
  const X0 = 265.8, X1 = 320.2, Z0 = 954.8, Z1 = 991, PX0 = 283, PX1 = 302.8, PZ = 947;
  {
    // 북면 (정면): 돌출부 양옆 각 2 창 / 돌출부 정면: 문 + 2 층 창 2 / 돌출부 측면
    const fNW = face([PX0, Z0], [X0, Z0]), fNE = face([X1, Z0], [PX1, Z0]);
    bwall(fNW, EAVE, [5.0, 12.2], [5.0, 12.2]);
    bwall(fNE, EAVE, [5.2, 12.2], [5.2, 12.2]);
    const fP = face([PX1, PZ], [PX0, PZ]), fPe = face([PX1, Z0], [PX1, PZ]), fPw = face([PX0, PZ], [PX0, Z0]);
    const cp = fP.L / 2;
    const dop = K.door(fP, cp - 2.6, cp + 2.6, FND + 8.5, FND + 11, { wallMat: brick, leaves: 2 });
    fbox(fP, cp - 3.6, cp + 3.6, FND + 11, FND + 12.2, 0.6, 0.25, wt);
    bwall(fP, EAVE, [cp - 6.5, cp + 6.5], [cp - 4.2, cp + 4.2], [{ ...dop, b: FND - 0.1 }]);
    for (const f of [fPe, fPw]) bwall(f, EAVE, [], []);
    // 서·동면 3 창, 남면(뒤채 양옆) 각 2 창
    bwall(face([X0, Z0], [X0, Z1]), EAVE, [7, 18, 29], [7, 18, 29]);
    bwall(face([X1, Z1], [X1, Z0]), EAVE, [7, 18, 29], [7, 18, 29]);
    bwall(face([X0, Z1], [283, Z1]), EAVE, [5.5, 12], [5.5, 12]);
    bwall(face([313, Z1], [X1, Z1]), EAVE, [3.6], [3.6]);
    // 층 사이 흰 띠 없음(이탈리아네이트 벽돌 평면) — 석재 수평 띠 대신 2 층 창대선
    const outline = [[X0, Z0], [X0, Z1], [X1, Z1], [X1, Z0], [PX1, Z0], [PX1, PZ], [PX0, PZ], [PX0, Z0]];
    cornice(outline, EAVE, 2.5);
    // 힙지붕 (본채) + 돌출부 작은 힙 + 쿠폴라
    const top = K.hipRoof(X0, X1, Z0, Z1, EAVE, 0.35, roofM, { ov: 2.5, fascia: wt });
    // 항공사진(main_quad/b, 북측 정면): 정면 돌출부 지붕은 힙이 아니라 북쪽으로 박공(페디먼트)을 내민 박공지붕, 지붕 위 쿠폴라 없음
    K.gable(PX0, PX1, PZ, Z0 + 8, EAVE, 0.45, 'z', roofM, { ov: 2.5, ovg: 1.5, gableMat: wt });
    void top;
    // 굴뚝 2 (위성 그림자: 서측 x 277 z 962, 동측 x 310 z 975) — 벽돌 + 갓
    for (const [x, z] of [[277, 962], [310, 975]]) { P(G.box(3.2, 41 - 20, 2.4, x, 20, z), brick); P(G.box(3.8, 0.8, 3.0, x, 41, z), brick); }
  }
  // ======================================================== 뒤채 (x 283..313, z 991..1035.7) + 동측 베이 + 뒤 포치
  {
    const WX0 = 283, WX1 = 313, WZ1 = 1035.7;
    bwall(face([WX0, Z1], [WX0, WZ1]), EAVE, [8, 20, 33], [8, 20, 33]);
    bwall(face([WX0, WZ1], [WX1, WZ1]), EAVE, [7], [7, 23], [K.door(face([WX0, WZ1], [WX1, WZ1]), 19, 23.5, FND + 7.5, FND + 9.5, { wallMat: brick })]);
    const fE = face([WX1, WZ1], [WX1, Z1]);
    bwall(fE, EAVE, [8], [8, 41.5]);
    // 2 층 베이창 x 313..316.4, z 996.8..1016.7 (각진 3 면 대신 사각 + 모서리 깎기 없음) — 동판 힙지붕
    const by = [[313, 996.8], [313, 1016.7], [316.4, 1016.7], [316.4, 996.8]];
    const fbE = face(by[2], by[3]);
    bwall(fbE, EAVE, [3.5, 10, 16.4], [3.5, 10, 16.4]);
    for (const f of [face(by[1], by[2]), face(by[3], by[0])]) wall(f, -1, EAVE, [], brick);
    cornice(by, EAVE, 1.5);
    const wTop = K.hipRoof(WX0, WX1, Z1 - 4, WZ1, EAVE, 0.35, roofM, { ov: 2.5, fascia: wt });
    K.hipRoof(313, 316.4, 996.8, 1016.7, EAVE, 0.6, copper, { ov: 1.5, fascia: wt });
    cornice(rectCCW(WX0, Z1, WX1, WZ1), EAVE, 2.5);
    P(G.box(3, 40 - 20, 2.4, 297, 20, 1006), brick); P(G.box(3.6, 0.8, 3.0, 297, 40, 1006), brick);
    // 뒤 포치 (1 층, 흰 기둥 4 + 평지붕 + 난간)
    const PZ0 = WZ1, PZ1 = 1043.5, px0 = 288.5, px1 = 308.2;
    P(G.box(px1 - px0, FND, PZ1 - PZ0, (px0 + px1) / 2, 0, (PZ0 + PZ1) / 2), ls);
    for (const x of [px0 + 0.5, px0 + 7, px1 - 7, px1 - 0.5]) P(G.box(0.8, 9, 0.8, x, FND, PZ1 - 0.5), wt);
    P(G.box(px1 - px0 + 1, 1.0, PZ1 - PZ0 + 1, (px0 + px1) / 2, FND + 9, (PZ0 + PZ1) / 2), wt);
    P(G.box(px1 - px0 - 1, 0.25, 0.2, (px0 + px1) / 2, FND + 3, PZ1 - 0.5), wt);
    void wTop;
  }
  // ======================================================== 정면 포치 (x 280..306, z 940..947) — 가정
  {
    const x0 = 280, x1 = 306, z0 = 940, z1 = PZ;
    P(G.box(x1 - x0, FND - 0.1, z1 - z0, (x0 + x1) / 2, 0, (z0 + z1) / 2), ls);
    for (const x of [x0 + 0.6, x0 + 9, x1 - 9, x1 - 0.6]) { P(G.box(1.0, 0.8, 1.0, x, FND, z0 + 0.6), wt); P(G.cylinder(0.4, 9.2, x, FND + 0.8, z0 + 0.6, 10), wt); P(G.box(1.2, 0.6, 1.2, x, FND + 10, z0 + 0.6), wt); }
    const rp = rectCCW(x0 - 0.8, z0 - 0.8, x1 + 0.8, z1);
    ring(rp, FND + 10.6, 1.2, 0, wt, { bottom: true });
    P(G.capGeometry(rp, [], FND + 11.8), roofM);
    // 지붕 위 난간 (기둥 + 상하 레일)
    for (const [a, b] of [[[x0 - 0.6, z0 - 0.6], [x1 + 0.6, z0 - 0.6]], [[x0 - 0.6, z0 - 0.6], [x0 - 0.6, z1]], [[x1 + 0.6, z0 - 0.6], [x1 + 0.6, z1]]]) {
      const f = face(a, b);
      fbox(f, 0, f.L, FND + 14.2, FND + 14.6, 0.4, 0, wt, false); fbox(f, 0, f.L, FND + 12.0, FND + 12.3, 0.4, 0, wt, false);
      const n = Math.floor(f.L / 1.2); for (let k = 0; k <= n; k++) fbox(f, k * f.L / n - 0.12, k * f.L / n + 0.12, FND + 12.3, FND + 14.2, 0.24, 0, wt, false);
    }
    // 포치 앞 계단
    for (let k = 0; k < 3; k++) P(G.box(8, FND - 0.1 - k * 0.8, 1.0, (x0 + x1) / 2, 0, z0 - 0.5 - k * 1.0), ls);
  }

  const grp = new THREE.Group();
  for (const m of G.mergeByMaterial(parts)) grp.add(m);
  return grp;
}
