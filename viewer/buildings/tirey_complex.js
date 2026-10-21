// Tirey Hall (1940, 옛 Tirey Memorial Union + Tilson Music Hall) / Rankin Hall (1972, 원형 프리캐스트 동) / Parsons Hall (1937)
// — 사진·위성 기반 모델 (도면 없음). 월드 좌표(ft) 로 직접 작성.
// 근거: Street View vp53 (N 7th St, 233/278/323 — NS 동 동측 입면, Rankin 원형동), vp54 (Larry Bird Ave 교차, 256/301/346 —
//   Rankin 필로티·남측동 북단), Fairbanks 쪽 vp45_264 (NS 동 북단 3층 벽돌 블록), Esri z20(겨울)·z19(여름) 위성.
//
// ■ 볼륨 구분 (위성 판독)
//   AUD  Tilson 강당 박스 x 554.6~642.9, z 610~728 (흰 멤브레인 평지붕, 난간 46 ft) + 북측 낮은 무대 뒤 z 586~610 (34 ft, 옥상기기)
//   EW   동서 날개 x 501~(NS 와 교차), z 738.4~783.6 — 2층 + 슬레이트 박공(용마루 z 761, 경사 0.65), 서단 박공벽
//   CP   중앙 파빌리온 x 576~623.3, z 728~789.6 — [항공사진 수정] 아르데코 매스 54 ft + 정면 가운데 탑(24×20, 61 ft) + 시계 + 피라미드(68 ft),
//        남측 정문 = 큰 석재 포털 (tirey_plaza/f)
//   NS   남북 날개 x 696.7~757.7, z 746~825 — 1층 캐스트스톤 피어 + 큰 창(사진), 2층 벽돌 펀치창, 다락 도머 6개, 박공(용마루 45 ft)
//        북단 3층 벽돌 블록 x 712~757.7, z 728.5~746 (평지붕 38 ft, vp45_264)
//   L1   강당·NS 사이 2층 연결부 (평지붕 27 ft)
//   RK   Rankin 원형동: 중심 (729.5, 876.6) r 42.4. 1층 필로티(높이 11 ft, 원주 12 피어) + 안쪽 유리 로비(r 27),
//        2~4층 프리캐스트 원통에 세로 슬릿창 48 개/층(폭 2.4 ft), 층 띠(스팬드럴), 파라펫 54 ft.
//        북·남 코어(프리캐스트, 54 ft), 남측 연결동 x 696~741, z 930~957 (40 ft), 서측 퍼골라(보 7 개, 13 ft)
//   PS   Parsons(남측동) x 694.5~777.5, z 957~1072 (+ 동쪽 절반은 z 930 까지) — 1층 캐스트스톤 + 큰 창, 2층 벽돌,
//        완경사 지붕(처마 25.5, 경사 0.37) 가운데 평탄 띠(x 728~745, 37.5 ft) 에 옥상기기, 북단 반박공 벽돌벽(vp54_256)
//
// ■ 층고: 1층 12.5 (캐스트스톤 피어 · 큰 창 8.5 ft), 2층 12.5~25.5 (벽돌, 창 4.2×6), 처마 25.5. Rankin 층고 13.5.
//   사진 비례: vp53_278 에서 1층 석재부 80 px : 2층 벽돌 90 px → 12.5 : 13.
// ■ 재료: 붉은 벽돌 + 석회석/캐스트스톤(1층 피어, 띠, 창대), 슬레이트(회색) 지붕, Rankin = 밝은 베이지 프리캐스트.
// ■ 가정(사진에 안 보임): EW 날개 남면·북면과 CP 정문(조지언 양식 펀치창, 석재 문틀) — 퀴드 쪽은 사진 없음.
//   강당(AUD) 서·동면의 높은 창 6 개(위성의 서측 그림자 속 창 흔적), Parsons 서·남면 창 리듬은 동면과 동일하게 가정.
//   어느 동이 Parsons/Tirey 인지 명칭 배정은 연도·양식으로 추정.
import * as THREE from 'three';

const VIEW_ALT = /[?&]v=alt/.test(import.meta.url);      // 미리보기용: ?v=alt 로 불러오면 반대편(서측) 프리셋
export const meta = {
  id: 'tirey', name: 'Tirey Hall / Rankin Hall / Parsons Hall', osm: 'way/545265796',
  anchor: [0, 0], rotation: 0, height: 72,
  preset: VIEW_ALT ? { pos: [380, 170, 960], tgt: [660, 15, 830] } : { pos: [1060, 160, 930], tgt: [690, 15, 830] },
  sheets: 'Street View vp53/vp54 (2019, 2023), vp45; Esri imagery z20/z19',
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
  const { P, face, fbox, win, door, wall, ring, gable, quads } = K;
  const brick = M.brick_red, stone = M.limestone, pc = M.precast, dark = M.dark;
  const slate = M.roof_gravel.clone(); slate.color = new THREE.Color(0x8f949e);     // 회색 슬레이트 (사진: 중간 회색)
  const castStone = M.limestone;

  // 층 높이
  const G1 = 12.5, EAVE = 25.5;
  // 표준 벽돌 입면 (EW/CP/NS 북블록 등 조지언 펀치창): f 면, 베이 피치로 창 배치. skip = 생략할 s 구간들
  function georgianFacade(f, { y1 = EAVE, pitch = 12.5, w = 4.2, rows = [[3.6, 10.2], [15.4, 22.2]], skip = [], margin = 4, mat = brick, extra = [] } = {}) {
    const ops = [...extra];
    const n = Math.max(1, Math.floor((f.L - 2 * margin) / pitch));
    const p = (f.L - 2 * margin) / n;
    for (let i = 0; i < n; i++) {
      const c = margin + p * (i + 0.5);
      if (skip.some(([a, b]) => c > a && c < b)) continue;
      for (const [b, t] of rows) ops.push(win(f, c - w / 2, c + w / 2, b, t, { wallMat: mat, nx: 2, rails: [(b + t) / 2 + 0.6], sill: stone, head: stone, headH: 0.7 }));
    }
    wall(f, -1, y1, ops, mat);
    return ops;
  }
  /** 사진형 입면 (NS 동측·Parsons): 1층 캐스트스톤 피어 + 큰 창, 2층 벽돌 펀치창 */
  function storefrontFacade(f, { pitch = 16, margin = 1.5, skip = [], doors = [] } = {}) {
    const n = Math.max(1, Math.round((f.L - 2 * margin) / pitch)), p = (f.L - 2 * margin) / n;
    const opsG = [], ops2 = [];
    for (let i = 0; i < n; i++) {
      const c = margin + p * (i + 0.5);
      if (skip.some(([a, b]) => c > a && c < b)) continue;
      const hw = (p - 4.2) / 2;                                   // 피어 폭 4.2
      if (doors.includes(i)) opsG.push(K.door(f, c - 3.2, c + 3.2, 7.5, 10.6, { wallMat: castStone }));
      else opsG.push(win(f, c - hw, c + hw, 2.2, 10.6, { d: 0.8, wallMat: castStone, nx: 2, rails: [8.6] }));
      ops2.push(win(f, c - 2.1, c + 2.1, 15.6, 22.0, { wallMat: brick, nx: 2, rails: [18.8], sill: stone, head: stone, headH: 0.6 }));
    }
    wall(f, -1, G1, opsG, castStone);
    wall(f, G1, EAVE, ops2, brick);
    fbox(f, 0, f.L, G1 - 0.2, G1 + 0.6, 0.6, 0.15, stone);          // 1층 상부 석재 띠
    fbox(f, 0, f.L, -1, 0.6, 0.8, 0.2, stone);                       // 석재 기단
  }

  // ======================================================== AUD: Tilson 강당 (x 554.6..642.9, z 586.1..728.3)
  {
    const X0 = 554.6, X1 = 642.9, ZN = 586.1, ZM = 610, ZS = 728.3, HA = 46, HN = 34;
    // 본 홀: 서·동면 높은 창 6 개 (14~34 ft), 석재 기단·띠, 상부 석재 코니스
    const tall = (f, s0, s1) => {
      const ops = [], n = 6, p = (s1 - s0) / n;
      for (let i = 0; i < n; i++) { const c = s0 + p * (i + 0.5); ops.push(win(f, c - 3, c + 3, 14, 32, { wallMat: brick, nx: 3, rails: [20, 26], sill: stone, head: stone, headH: 1.2 })); }
      return ops;
    };
    const fW = face([X0, ZM], [X0, ZS]), fE = face([X1, ZS], [X1, ZM]);
    wall(fW, -1, HA, [...tall(fW, 6, fW.L - 12), K.door(fW, fW.L - 9, fW.L - 3, 8, 10, { wallMat: brick })], brick);
    wall(fE, -1, HA, tall(fE, 12, fE.L - 6), brick);
    const fNa = face([X1, ZM], [X0, ZM]);                              // 북면 상부 (북측 저층부 위)
    wall(fNa, HN - 1, HA, [], brick);
    // 북측 저층부 (무대 뒤): 서·북·동 면, 2 층 창
    for (const f of [face([X0, ZN], [X0, ZM]), face([X1, ZM], [X1, ZN])]) georgianFacade(f, { y1: HN, pitch: 11, margin: 3, rows: [[3.6, 10.2], [16.4, 23.2]] });
    georgianFacade(face([X1, ZN], [X0, ZN]), { y1: HN, pitch: 12, rows: [[3.6, 10.2], [16.4, 23.2]], extra: [K.door(face([X1, ZN], [X0, ZN]), 40, 46, 8, 8, { wallMat: brick })] });
    // 남면(z 728.3) 은 CP 북블록·EW 와 접함 → CP 보다 높은 부분만
    wall(face([X0, ZS], [X1, ZS]), 36, HA, [], brick);
    // 석재 기단, 띠, 코니스, 파라펫
    const polyA = rectCCW(X0, ZM, X1, ZS), polyN = rectCCW(X0, ZN, X1, ZM);
    ring(rectCCW(X0, ZN, X1, ZS), -1, 3.0, 0.3, stone);
    ring(polyA, 12.6, 0.8, 0.25, stone); ring(polyA, HA - 2.2, 1.4, 0.6, stone, { bottom: true });
    P(G.capGeometry(polyA, [], HA - 0.6), M.roof_membrane);
    ring(polyA, HA - 0.8, 1.0, 0.0, stone);
    ring(polyN, HN - 1.2, 1.2, 0.4, stone);
    P(G.capGeometry(polyN, [], HN - 0.3), M.roof_gravel);
    // 옥상: 흡배기 유닛 (위성: 강당 중앙선 x≈598 에 원형 팬 5 개), 북측 저층 지붕 유닛 4 개
    for (const z of [628, 645, 662, 680, 700]) P(G.cylinder(1.8, 2.2, 598, HA - 0.6, z, 12), M.metal);
    for (const x of [575, 590, 605, 620]) P(G.box(7, 4, 7, x, HN - 0.3, 598), M.metal);
  }

  // ======================================================== CP: 중앙 파빌리온 (x 576..623.3, z 728.3..789.6) + 탑
  // [항공사진으로 수정] tirey_plaza/f (남측 광장 정면 사진, 비교 scratch/aerial/tirey_complex.png): 파빌리온은 3층 41 ft 가 아니라
  //   날개 처마(25.5) 의 2 배가 넘는 아르데코 매스 — 측부 파라펫 54 ft, 정면 가운데 24 ft 폭 탑이 61 ft 까지 솟고 시계 + 슬레이트
  //   피라미드(68 ft) + 청동 피니얼. 1층 가운데 석재 포털(폭 24, 높이 27, 반쯤 내려간 출입구 + 양쪽 계단), 포털 위 3 연창 2 단,
  //   양쪽 베이는 2~4층 통 세로 창띠, 벽돌 피어가 파라펫 위로 돌출.
  {
    const X0 = 576, X1 = 623.3, ZN = 728.3, ZS = 789.6, H = 54, TT = 61;
    const fS = face([X0, ZS], [X1, ZS]), fE = face([X1, ZS], [X1, 783.6]), fW = face([X0, 783.6], [X0, ZS]);
    const ops = [];
    const cx = fS.L / 2;
    ops.push(K.door(fS, cx - 4, cx + 4, 9, 12, { wallMat: stone }));
    fbox(fS, cx - 12, cx + 12, -1, 27, 1.4, 0.5, stone);              // 석재 포털 (돌출)
    fbox(fS, cx - 12.6, cx + 12.6, 25.5, 27.2, 2.0, 0.8, stone);       // 포털 갓
    for (const c of [cx - 5.5, cx, cx + 5.5]) fbox(fS, c - 1.6, c + 1.6, 16, 24, 0.3, 1.25, dark, false);   // 포털 상부 3 연창 (석재 안)
    for (const c of [cx - 14, cx + 14]) ops.push(win(fS, c - 2.2, c + 2.2, 3.6, 10.2, { wallMat: brick, nx: 2, rails: [7.5], sill: stone, head: stone }));
    for (const c of [cx - 14.5, cx + 14.5]) ops.push(win(fS, c - 1.4, c + 1.4, 15, 46, { wallMat: brick, nx: 1, rails: [26, 36], sill: stone }));   // 통 세로 창띠
    for (const c of [cx - 5.5, cx, cx + 5.5]) for (const [b0, t0] of [[30, 37], [40.5, 47]]) ops.push(win(fS, c - 1.9, c + 1.9, b0, t0, { wallMat: brick, nx: 2, sill: stone }));
    for (const c of [cx - 9, cx + 9]) fbox(fS, c - 1.2, c + 1.2, 27, H + 1.5, 0.8, 0.4, brick);     // 벽돌 피어 (파라펫 위 돌출)
    for (const c of [cx - 9, cx + 9]) for (const y of [36.5, 47.5]) fbox(fS, c - 1.3, c + 1.3, y, y + 2.5, 0.9, 0.45, stone);   // 피어 석재 블록
    wall(fS, -1, H, ops, brick);
    for (const f of [fE, fW]) wall(f, -1, H, [win(f, 1.2, 4.6, 17.4, 24.6, { wallMat: brick, sill: stone })], brick);
    wall(face([X0, ZN], [X0, 783.6]), 20, H, [], brick);
    wall(face([X1, 783.6], [X1, ZN]), 20, H, [], brick);
    wall(face([X1, ZN], [X0, ZN]), 44, H, [], brick);
    const poly = rectCCW(X0, ZN, X1, ZS);
    ring(poly, -1, 2.6, 0.3, stone); ring(poly, 12.6, 0.8, 0.25, stone);
    ring(poly, H - 1.6, 1.6, 0.5, stone, { bottom: true });
    P(G.capGeometry(poly, [], H - 0.8), M.roof_gravel);
    // 남측 계단 (포털 앞, 양쪽으로 갈라짐)
    for (let i = 0; i < 3; i++) P(G.box(24, 0.5, 3, X0 + cx, i * 0.5 - 0.5, ZS + 6 - i * 2), stone);
    // 정면 탑: 폭 24, 깊이 20 (x 587.6..611.6, z 769.6..789.6), H → 61 + 시계 + 피라미드 68
    const tx0 = X0 + cx - 12, tx1 = X0 + cx + 12, tz0 = ZS - 20, tz1 = ZS + 0.3;
    const tp = rectCCW(tx0, tz0, tx1, tz1), tc = [(tx0 + tx1) / 2, (tz0 + tz1) / 2];
    for (let i = 0; i < 4; i++) { const f = face(tp[i], tp[(i + 1) % 4]); wall(f, H - 1, TT, [], brick); }
    ring(tp, TT - 1.2, 1.2, 0.5, stone);
    { const d = new THREE.CircleGeometry(3.2, 24); d.translate(tc[0], 56.5, tz1 + 0.05); P(d, stone, false);
      const h1 = new THREE.CircleGeometry(2.6, 24); h1.translate(tc[0], 56.5, tz1 + 0.1); P(h1, dark, false); }
    K.loft(G.offsetPoly(tp, -1.0), TT, tp.map(() => tc), 68, slate);
    P(G.cylinder(0.35, 4, tc[0], 68, tc[1], 6), M.metal);
  }

  // ======================================================== EW 날개 (x 501..576 / 623.3..~697, z 738.4..783.6)
  {
    const ZN = 738.4, ZS = 783.6;
    // 서측 부분
    georgianFacade(face([501.1, ZS], [576, ZS]), { pitch: 12.4 });                     // 남면
    georgianFacade(face([563.4, ZN], [501.1, ZN]), { pitch: 12.4 });                   // 북면
    const fWg = face([501.1, ZN], [501.1, ZS]);                                         // 서측 박공벽
    georgianFacade(fWg, { pitch: 14.5 });
    fbox(fWg, 19.9, 25.3, 28.5, 34.0, 0.4, 0.2, stone); fbox(fWg, 20.5, 24.7, 29.1, 33.4, 0.3, 0.35, dark);   // 박공 환기창(루버)
    // 동측 부분 남면 (x 623.3..696.7): 가운데 측면 출입문
    const fS2 = face([623.3, ZS], [696.7, ZS]);
    georgianFacade(fS2, { pitch: 12.2, skip: [[33, 41]], extra: [K.door(fS2, 33.7, 39.7, 8, 10.5, { wallMat: brick })] });
    fbox(fS2, 32.4, 41.0, 10.5, 11.6, 3.5, 1.6, stone);                                // 문 위 석재 캐노피
    for (const [a, b] of [[501.1, 576], [623.3, 696.7]]) {
      const poly = rectCCW(a, ZN, b, ZS);
      ring(poly, -1, 2.6, 0.3, stone); ring(poly, G1 - 0.1, 0.8, 0.25, stone);
      ring(poly, EAVE - 0.8, 1.0, 0.9, M.white, { bottom: true });                        // 흰 목재 코니스
    }
    // 박공지붕 (용마루 z 761, 경사 0.65): 서측은 CP 서벽까지, 동측은 NS 지붕 속으로 x 720 까지
    gable(501.1, 576, ZN, ZS, EAVE, 0.65, 'x', slate, { ov: 1.2, gableMat: brick });
    gable(623.3, 720, ZN, ZS, EAVE, 0.65, 'x', slate, { ov: 1.2, gableMat: brick });
    // 북측 지붕 환기구 2 (위성)
    for (const x of [652, 659]) P(G.cylinder(1.0, 1.5, x, 33.5, 750, 10), M.metal);
    // 서측 굴뚝(박공 끝) 없음 — 위성 미확인
  }

  // ======================================================== L1: 강당·NS 사이 2 층 연결부 (평지붕 27 ft)
  {
    const H = 27;
    const poly = [[642.9, 710.4], [642.9, 738.4], [712, 738.4], [712, 728.5], [737.9, 728.5], [737.9, 717.5], [684.2, 717.5], [684.2, 694.5], [651.2, 694.4], [651.2, 710.4]];
    // 외벽: 북면 조각들 (CW 순서 그대로 쓰면 안쪽이 바깥 → 바깥 법선이 되도록 CCW 로)
    const ccw = [...poly].reverse();
    // 위 poly 는 시계방향? 부호 면적으로 판정
    let A = 0; for (let i = 0; i < poly.length; i++) { const a = poly[i], b = poly[(i + 1) % poly.length]; A += a[0] * (-b[1]) - b[0] * (-a[1]); }
    const pl = A > 0 ? poly : ccw;
    for (let i = 0; i < pl.length; i++) {
      const a = pl[i], b = pl[(i + 1) % pl.length];
      const f = face(a, b);
      // 강당 동벽·EW 북벽·NS 북블록과 접하는 변은 건너뜀
      if ((Math.abs(a[0] - 642.9) < 0.2 && Math.abs(b[0] - 642.9) < 0.2) || (Math.abs(a[1] - 738.4) < 0.2 && Math.abs(b[1] - 738.4) < 0.2)) continue;
      if (Math.abs(a[0] - 712) < 0.2 && Math.abs(b[0] - 712) < 0.2) continue;
      if (Math.abs(a[1] - 728.5) < 0.2 && Math.abs(b[1] - 728.5) < 0.2) continue;
      if (f.L > 14) georgianFacade(f, { y1: H, pitch: 11, margin: 2.5, rows: [[3.6, 10.2], [15.4, 22.2]] });
      else wall(f, -1, H, [], brick);
    }
    ring(pl, -1, 2.6, 0.3, stone);
    ring(pl, H - 1.6, 1.6, 0.5, stone);
    P(G.capGeometry(pl, [], H - 0.4), M.roof_gravel);
    // 옥상 기기 (위성: x 700~735, z 719~727 흰 유닛 3 개 / x 660 z 705 1 개)
    for (const x of [703, 716, 729]) P(G.box(8, 4.5, 6, x, H - 0.4, 723), M.metal);
    P(G.box(6, 3.5, 6, 664, H - 0.4, 706), M.metal);
  }

  // ======================================================== NS 날개 (x 696.7..757.7, z 728.5..825.2)
  {
    const XW = 696.7, XE = 757.7, ZB = 746, ZS = 825.2;
    // 북단 3층 벽돌 블록 x 712..757.7, z 728.5..746 (평지붕 38)
    {
      const H = 38, poly = rectCCW(712, 728.5, XE, ZB);
      const fN = face([XE, 728.5], [712, 728.5]), fE = face([XE, ZB], [XE, 728.5]);
      const rows = [[3.6, 10.2], [15.4, 22.2], [28.0, 33.6]];
      georgianFacade(fN, { y1: H, pitch: 11.5, margin: 3, rows: [[15.4, 22.2], [28.0, 33.6]] });
      georgianFacade(fE, { y1: H, pitch: 8.7, margin: 4, rows });
      wall(face([712, 728.5], [712, ZB]), 26, H, [], brick);
      wall(face([712, ZB], [XE, ZB]), 30, H, [], brick);
      ring(poly, -1, 2.6, 0.3, stone); ring(poly, G1 - 0.1, 0.8, 0.25, stone);
      ring(poly, H - 1.6, 1.6, 0.5, stone);
      P(G.capGeometry(poly, [], H - 0.4), M.roof_gravel);
    }
    // 동측 입면 (사진 vp53_278/323): 베이 6, 1층 캐스트스톤 피어 + 큰 창, 2층 펀치창, 도머 6
    const fE = face([XE, ZS], [XE, ZB]);
    storefrontFacade(fE, { pitch: 13.2, doors: [3] });
    // 서측 입면 (EW 날개 남쪽~스트립 북단만 노출: z 783.6..795.5) + 남면 일부(x 741.3..757.7, z 825.2: 원형동 북코어 옆)
    const fW = face([XW, 783.6], [XW, 795.5]);
    wall(fW, -1, EAVE, [win(fW, 4, 8.2, 15.6, 22, { wallMat: brick, nx: 2, sill: stone })], brick);
    const fS = face([741.3, ZS], [XE, ZS]);
    wall(fS, -1, EAVE, [win(fS, 5, 9.2, 15.6, 22, { wallMat: brick, nx: 2, sill: stone }), win(fS, 5, 11, 2.2, 10.6, { wallMat: castStone, nx: 2 })], brick);
    fbox(fS, 0, fS.L, G1 - 0.2, G1 + 0.6, 0.6, 0.15, stone);
    ring(rectCCW(XW, ZB, XE, ZS), EAVE - 0.8, 1.0, 0.9, M.white, { bottom: true });
    // 박공지붕 남북 (용마루 x 727.2, 경사 0.65 → 45.3 ft), 남단 박공은 원형동 코어 쪽 — 벽돌 박공
    gable(XW, XE, ZB - 0.5, ZS, EAVE, 0.65, 'z', slate, { ov: 1.2, gableMat: brick });
    // 도머 (동측 경사면, 베이마다): 앞벽 x 754.6, 폭 5.6, 창 3.4×4.6, 소형 박공지붕
    const nB = 6, p = (ZS - ZB - 3) / nB;
    for (let i = 0; i < nB; i++) {
      const zc = ZB + 1.5 + p * (i + 0.5), xf = XE - 3.1, yb = EAVE + 3.1 * 0.65;
      const fD = face([xf, zc + 2.8], [xf, zc - 2.8]);
      P(G.wallSeg(fD.p0, fD.p1, yb - 0.5, yb + 6.2, { openings: [win(fD, 1.1, 4.5, yb + 0.8, yb + 5.4, { nx: 2, rails: [yb + 3.6], frame: M.white })] }), M.white);
      const back = 739;
      quads([
        [[xf, yb - 0.5, zc - 2.8], [back, yb - 0.5, zc - 2.8], [back, yb + 6.2, zc - 2.8], [xf, yb + 6.2, zc - 2.8], [0, 0, -1]],
        [[xf, yb - 0.5, zc + 2.8], [back, yb - 0.5, zc + 2.8], [back, yb + 6.2, zc + 2.8], [xf, yb + 6.2, zc + 2.8], [0, 0, 1]],
      ], slate);
      gable(back, xf + 0.4, zc - 2.8, zc + 2.8, yb + 6.2, 0.9, 'x', slate, { ov: 0.35, ovg: 0.0, gableMat: M.white });
    }
    // 서측 경사면 도머 없음 (위성), 환기구
    P(G.box(2.5, 3, 2.5, 712, 36, 790), brick);
  }

  // ======================================================== 서측 스트립 + 퍼골라 (x 670.7..696.7, z 795.5..957.4)
  {
    // 북쪽 1층 블록 z 795.5..822 (평지붕 14)
    const poly = rectCCW(670.7, 795.5, 696.7, 822);
    const fW = face([670.7, 795.5], [670.7, 822]), fN = face([696.7, 795.5], [670.7, 795.5]), fS = face([670.7, 822], [696.7, 822]);
    wall(fW, -1, 14, [win(fW, 3, 23, 2.0, 10.5, { wallMat: castStone, nx: 5, d: 0.8 })], castStone);
    wall(fN, -1, 14, [win(fN, 4, 9, 3.6, 10.2, { wallMat: brick, nx: 2, sill: stone })], brick);
    wall(fS, -1, 14, [K.door(fS, 9, 17, 8, 10.5, { wallMat: castStone, leaves: 2 })], castStone);
    ring(poly, 12.8, 1.4, 0.4, stone);
    P(G.capGeometry(poly, [], 13.8), M.roof_gravel);
    // 퍼골라: 서측 기둥열 x 672.5 (보마다), 보 x 671..697, 서측 테두리 보
    const beams = [841, 860, 878, 897, 913, 930, 948];
    for (const z of beams) {
      P(G.box(1.6, 11.6, 1.6, 672.5, 0, z), pc);
      P(G.box(26, 1.6, 1.4, 684, 11.6, z), pc);
    }
    P(G.box(1.4, 1.6, 957 - 822, 671.6, 11.6, (822 + 957) / 2), pc);
    // 포장 (퍼골라 밑)
    P(G.capGeometry(rectCCW(670.7, 822, 696, 957.4), [], 0.05), M.walk, false);
  }

  // ======================================================== RK: Rankin Hall 원형동
  {
    const C = [729.5, 876.6], R = 42.4, N = 48, F1 = 11, FH = 13.5, TOP = 54;
    const ring2 = (r, n = N) => { const a = []; for (let i = 0; i < n; i++) { const t = -i / n * Math.PI * 2; a.push([C[0] + r * Math.cos(t), C[1] + r * Math.sin(t)]); } return a; };
    // 각도 증가 방향: t = -2πi/N → (x, z) 에서 z 감소(북쪽) 방향으로 돌아감 = 위에서 볼 때 반시계 → CCW 확인
    const circ = ring2(R);
    // 2~4층 원통: 세그먼트마다 층별 슬릿창 1 개
    for (let i = 0; i < N; i++) {
      const f = face(circ[i], circ[(i + 1) % N]), ops = [];
      for (let k = 0; k < 3; k++) {
        const y0 = F1 + k * FH;
        ops.push(win(f, f.L / 2 - 1.2, f.L / 2 + 1.2, y0 + 3.2, y0 + FH - 0.6, { d: 1.2, wallMat: pc, glass: M.pane, frame: dark }));
      }
      wall(f, F1 - 2.5, TOP, ops, pc);
    }
    // 층 스팬드럴 띠 (살짝 돌출) + 파라펫 코핑
    for (let k = 0; k < 3; k++) ring(circ, F1 + k * FH - 0.3, 0.6, 0.35, pc);
    ring(circ, TOP - 0.6, 0.8, 0.4, pc);
    P(G.capGeometry(G.offsetPoly(circ, 0.5), [], TOP - 2.5), M.roof_gravel);
    K.capDown(circ, F1 - 2.5, pc);                                                   // 필로티 위 밑면
    // 1층 필로티: 원주 피어 12 개 (4×2.6), 안쪽 유리 로비 r 27 (멀리언 24)
    for (let i = 0; i < 12; i++) {
      const t = (i + 0.5) / 12 * Math.PI * 2, x = C[0] + (R - 1.6) * Math.cos(t), z = C[1] + (R - 1.6) * Math.sin(t);
      P(G.box(4.2, F1 - 2.5, 2.6, x, 0, z, { ry: -t + Math.PI / 2 }), pc);
    }
    const lob = ring2(27, 24);
    for (let i = 0; i < 24; i++) {
      const f = face(lob[i], lob[(i + 1) % 24]);
      P(G.sideGeometry([f.p0, f.p1], 0, F1 - 2.5, 1 / f.L, 1 / 9, false), M.pane, false);
      fbox(f, -0.15, 0.15, 0, F1 - 2.5, 0.3, 0, dark, false);
      if (i % 6 === 1) K.door(f, 0.8, f.L - 0.8, 7.5, 7.5, { wallMat: dark, leaves: 2, d: 0.2 });
    }
    // 옥상: 해치 2, 원형 팬
    P(G.box(4, 3, 7, 721, TOP - 2.5, 843), M.metal); P(G.box(4, 3, 6, 721, TOP - 2.5, 908), M.metal); P(G.cylinder(1.2, 1.5, 733, TOP - 2.5, 869, 10), M.metal);
    // 북·남 코어 (프리캐스트, 세로 슬릿 1 줄)
    for (const [x0, z0, x1, z1] of [[708, 818, 741.3, 838], [705, 912, 741.1, 932]]) {
      const poly = rectCCW(x0, z0, x1, z1);
      for (let i = 0; i < 4; i++) {
        const f = face(poly[i], poly[(i + 1) % 4]);
        const ops = [];
        if (f.L > 25) for (let k = 0; k < 3; k++) ops.push(win(f, f.L / 2 - 1.2, f.L / 2 + 1.2, F1 + k * FH + 3.2, F1 + (k + 1) * FH - 0.6, { d: 1.2, wallMat: pc }));
        wall(f, -1, TOP, ops, pc);
      }
      for (let k = 0; k < 3; k++) ring(poly, F1 + k * FH - 0.3, 0.6, 0.35, pc);
      ring(poly, TOP - 0.6, 0.8, 0.4, pc);
      P(G.capGeometry(poly, [], TOP - 2.5), M.roof_gravel);
    }
    // 남측 연결동 x 696..741, z 930..957.4 (프리캐스트, 40 ft, 슬릿창)
    {
      const poly = rectCCW(694.3, 932, 741.1, 957.3), H = 40;
      for (let i = 0; i < 4; i++) {
        const f = face(poly[i], poly[(i + 1) % 4]), ops = [];
        const n = Math.floor(f.L / 5.5);
        for (let j = 0; j < n; j++) { const c = (j + 0.5) * f.L / n; for (let k = 0; k < 2; k++) ops.push(win(f, c - 1.2, c + 1.2, F1 + k * FH + 3.2, F1 + (k + 1) * FH - 0.6, { d: 1.0, wallMat: pc })); }
        if (i === 0) ops.push(K.door(f, 8, 14, 8, 9.5, { wallMat: pc }));
        wall(f, -1, H, ops, pc);
      }
      for (let k = 0; k < 3; k++) ring(poly, F1 + k * FH - 0.3, 0.6, 0.35, pc);
      ring(poly, H - 0.6, 0.8, 0.4, pc);
      P(G.capGeometry(poly, [], H - 2), M.roof_gravel);
      P(G.box(3, 2.5, 3, 707, H - 2, 923), M.metal);
    }
  }

  // ======================================================== PS: Parsons Hall (남측동) x 694.5..777.5, z 930/957..1072
  {
    const XW = 694.6, XE = 777.5, ZN = 957.3, ZNE = 930, ZS = 1072, XM = 741.1;
    storefrontFacade(face([XE, ZS], [XE, ZNE]), { pitch: 15.8, doors: [4] });           // 동면 (vp54 방향)
    storefrontFacade(face([XW, ZN], [XW, ZS]), { pitch: 15.8, doors: [3] });            // 서면 (가정)
    const fS = face([XW, ZS], [XE, ZS]);
    storefrontFacade(fS, { pitch: 13.8, skip: [[32, 51]] });
    // 남면 중앙 출입구 (위성: x 728~745 어두운 돌출) — 석재 포털 + 2짝문
    {
      const f = face([728, ZS + 2.5], [746, ZS + 2.5]);
      wall(f, -1, 14, [K.door(f, 4.5, 13.5, 8, 11, { wallMat: castStone })], castStone);
      for (const x of [728.15, 745.85]) P(G.box(0.3, 15, 2.5, x, -1, ZS + 1.25), castStone);
      P(G.capGeometry(rectCCW(728, ZS, 746, ZS + 2.5), [], 14), castStone);
      fbox(f, -0.5, 18.5, 13.5, 15, 1.2, 0.3, stone);
    }
    // 북단 동쪽 절반 (x 741.1..777.5, z 930): 반박공 벽돌벽 (vp54_256)
    const fN = face([XE, ZNE], [XM, ZNE]);
    {
      const opsG = [win(fN, 9, 17, 2.2, 10.6, { d: 0.8, wallMat: castStone, nx: 2, rails: [8.6] }), win(fN, 22, 30, 2.2, 10.6, { d: 0.8, wallMat: castStone, nx: 2, rails: [8.6] })];
      wall(fN, -1, G1, opsG, castStone);
      wall(fN, G1, EAVE, [win(fN, 11, 15, 15.6, 22, { wallMat: brick, nx: 2, sill: stone, head: stone }), win(fN, 24, 28, 15.6, 22, { wallMat: brick, nx: 2, sill: stone, head: stone })], brick);
      fbox(fN, 0, fN.L, G1 - 0.2, G1 + 0.6, 0.6, 0.15, stone);
      // 반박공 삼각 (x 741.1 쪽이 높음 37.5 → x 777.5 처마 25.5)
      quads([[[XM, EAVE, ZNE], [XE, EAVE, ZNE], [745, 37.5, ZNE], [XM, 37.5, ZNE], [0, 0, -1]]], brick);
      // 연결동 북벽 위로 남는 부분: 연결동 동벽(x 741.1) 은 RK 블록에서 처리
    }
    // 연결동 남쪽 PS 북벽 (x 694.6..741.1, z 957.3) — 연결동(40 ft) 에 가려짐, 처마 위 박공만
    // 지붕: 경사 0.37 양쪽, 가운데 평탄 띠 x 728..745 (37.5 ft) — 남북 축
    const pitch = 0.37, yTop = EAVE + (728 - XW) * pitch;
    const ov = 1.2;
    const roofW = [[XW - ov, EAVE - ov * pitch], [728, yTop]], roofE = [[745, yTop], [XE + ov, EAVE - ov * pitch]];
    const zA = ZN - 0.5, zB = ZS + ov, zA2 = ZNE - 0.5;
    quads([
      [[roofW[0][0], roofW[0][1], zA], [roofW[0][0], roofW[0][1], zB], [728, yTop, zB], [728, yTop, zA], [0, 1, 0]],
      [[745, yTop, zA2], [745, yTop, zB], [roofE[1][0], roofE[1][1], zB], [roofE[1][0], roofE[1][1], zA2], [0, 1, 0]],
    ], slate);
    P(G.capGeometry(rectCCW(728, zA, 745, zB), [], yTop - 0.3), M.roof_gravel);
    P(G.capGeometry(rectCCW(741.1, zA2, 745, zA), [], yTop - 0.3), M.roof_gravel);
    // 남측 박공면 (지붕 단면 막기) + 평탄부 파라펫
    quads([
      [[XW, EAVE, ZS], [728, EAVE, ZS], [728, yTop, ZS], [728, yTop, ZS], [0, 0, 1]],
      [[745, EAVE, ZS], [XE, EAVE, ZS], [745, yTop, ZS], [745, yTop, ZS], [0, 0, 1]],
      [[728, EAVE, ZS], [745, EAVE, ZS], [745, yTop + 1, ZS], [728, yTop + 1, ZS], [0, 0, 1]],
    ], brick);
    fbox(face([728, zA], [728, zB]), 0, zB - zA, yTop - 0.3, yTop + 1.2, 0.6, -0.3, M.metal);
    fbox(face([745, zB], [745, zA2]), 0, zB - zA2, yTop - 0.3, yTop + 1.2, 0.6, -0.3, M.metal);
    // 흰 처마 코니스
    for (const f of [face([XW, ZN], [XW, ZS]), face([XE, ZS], [XE, ZNE])]) fbox(f, -1, f.L + 1, EAVE - 0.8, EAVE, 1.6, 0.6, M.white);
    // 옥상기기 (위성: 평탄 띠 위 x 730..742, z 965..1050)
    for (const [z, w, h] of [[970, 9, 4], [982, 9, 4], [996, 10, 5], [1007, 10, 5], [1020, 8, 4], [1042, 8, 4]]) P(G.box(w, h, 7, 736.5, yTop - 0.3, z), M.metal);
    P(G.cylinder(2.5, 1.5, 735, yTop - 0.3, 960, 12), M.metal);
    // 북단 앞 낮은 담·잔디 (vp54_256)
    P(G.box(1.2, 3.2, 26, 781, 0, 942), castStone);
  }

  const grp = new THREE.Group();
  for (const m of G.mergeByMaterial(parts)) grp.add(m);
  return grp;
}
