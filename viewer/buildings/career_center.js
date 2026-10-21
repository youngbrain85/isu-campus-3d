// Career Center — 위성·자료 기반 모델 (도면 없음, 이 건물이 보이는 스트리트뷰 없음)
// 근거: scratch/sv/461428311 의 vp27(5th St 사용자 포토스피어)은 Welcome Center 북서측 벽을 근접 촬영한 것이고, vp28 은
//   Chestnut St 교차로에서 나무에 가려 Career Center 가 보이지 않음 → 외관은 위성 + 일반형 가정.
//   평면: OSM 외곽 그대로 (위성 지붕 윤곽과 2~3 ft 이내). 남서측이 45° 톱니형(지그재그) 입면 — 위성에서 뚜렷함.
//   층수: 2층 (OSM/추정). 층고 14 ft → 지붕 28, 파라펫 상단 30 ft. 지붕 하나의 높이 (위성에 단차 없음).
//   재료(가정): 갈색 벽돌(site.json wall = brick_brown), 프리캐스트 갓돌·창대 띠.
//   창(가정): 남서 톱니 정면(대각선 긴 면 3개) = 층마다 연속 띠창(4 ft 멀리언), 남동향 면·동/북/서면 = 2층 펀치창 쌍(4×5.5 ft).
//   출입구(가정): 톱니 안쪽 꺾인 짧은 면 2곳 = 전면 유리 입구(캐노피), 서측 끝(x 44, z 297) 앞 포장 광장(위성에 밝은 포장).
//   지붕(위성): 평지붕 + 파라펫, 유닛 (x 100 z 296, x 142 z 306 어두운 박스, x 162 z 264, 소형 배기 다수).
import * as THREE from 'three';

export const meta = {
  id: 'career', name: 'Career Center', osm: 'way/461428311',
  anchor: [0, 0], rotation: 0, height: 36,
  preset: { pos: [-150, 140, 560], tgt: [114, 12, 280] },
  sheets: 'Esri imagery z20/z19 (no usable Street View of this building)',
};

const F = [0, 14], ROOF = 28, TOP = 30;
const POLY = [[44.2, 297.0], [71.0, 326.2], [77.6, 320.2], [103.3, 348.2], [121.5, 331.8], [128.4, 339.3], [145.5, 323.8], [184.7, 323.8], [184.5, 225.5], [152.3, 225.5], [152.3, 213.1], [80.8, 213.2], [80.8, 224.1], [66.1, 224.1], [66.1, 232.9], [55.5, 232.9], [55.6, 286.6]];

export function build(M, G) {
  const parts = [];
  const K = makeKit(M, G, parts);
  const brick = M.brick_brown, pc = M.precast;
  const n = POLY.length;
  const RIBBON = new Set([0, 2, 4]);          // 톱니 정면의 긴 대각선 면 (남서향): 띠창
  const ENTRY = new Set([1, 5]);              // 톱니 안쪽 짧은 면: 유리 입구
  for (let i = 0; i < n; i++) {
    const a = POLY[i], b = POLY[(i + 1) % n], d = K.dir(a, b), L = d.L, ops = [];
    if (RIBBON.has(i)) {
      for (const f of F) {
        const s = 2.0, e = L - 2.0, nm = Math.max(1, Math.round((e - s) / 4));
        ops.push(K.win(a, b, s, e, f + 3.0, f + 10.0, { rev: brick, frame: M.dark, muls: Array.from({ length: nm - 1 }, (_, k) => (e - s) * (k + 1) / nm), rails: [f + 7.6] }));
        K.wbox(a, b, s - 0.3, e + 0.3, f + 2.6, f + 3.0, -0.05, 0.35, pc, false);   // 프리캐스트 창대 띠
      }
    } else if (ENTRY.has(i)) {
      ops.push(K.win(a, b, 0.8, L - 0.8, 0, 26.5, { rev: brick, frame: M.dark, muls: [(L - 1.6) / 2], rails: [8.0, 13.2, 14.8] }));
      K.door(a, b, 1.2, L - 1.2, 8.0, { rev: brick });
      K.wbox(a, b, -1.0, L + 1.0, 10.0, 10.8, 0, 7.0, M.metal);            // 캐노피
    } else if (L > 11) {
      const nb = Math.max(1, Math.round(L / 11));
      for (const c of K.centers(L, nb, 1.5, 1.5)) for (const f of F) {
        if (c - 2.0 < 0.8 || c + 2.0 > L - 0.8) continue;
        ops.push(K.win(a, b, c - 2.0, c + 2.0, f + 3.5, f + 9.0, { rev: brick, sill: pc, frame: M.dark, muls: [2.0] }));
      }
    }
    // 동측 면 (i=7): 1층 서비스 문 / 북측 긴 면 (i=10): 1층 출입문 2짝
    if (i === 7) { ops.length = 0; for (const c of K.centers(L, 8, 1.5, 1.5)) for (const f of F) { if (f === 0 && c > 40 && c < 52) continue; ops.push(K.win(a, b, c - 2.0, c + 2.0, f + 3.5, f + 9.0, { rev: brick, sill: pc, frame: M.dark, muls: [2.0] })); } ops.push(K.door(a, b, 43.5, 47.5, 7.5, { leaves: 1, rev: brick })); }
    if (i === 10) { ops.length = 0; for (const c of K.centers(L, 6, 1.5, 1.5)) for (const f of F) { if (f === 0 && Math.abs(c - L / 2) < 7) continue; ops.push(K.win(a, b, c - 2.0, c + 2.0, f + 3.5, f + 9.0, { rev: brick, sill: pc, frame: M.dark, muls: [2.0] })); }
      K.door(a, b, L / 2 - 3.5, L / 2 + 3.5, 8.0, { rev: brick }); ops.push(K.win(a, b, L / 2 - 3.5, L / 2 + 3.5, 8.0, 11.0, { rev: brick, muls: [3.5] })); ops[ops.length - 1] = { s: L / 2 - 3.5, e: L / 2 + 3.5, b: 0, t: 11.0 };
      K.wbox(a, b, L / 2 - 6, L / 2 + 6, 11.4, 12.2, 0, 6.0, M.metal); }
    K.wall(a, b, -1, TOP, ops, brick);
    K.wbox(a, b, -0.1, L + 0.1, 13.2, 14.0, -0.05, 0.2, pc, false);                  // 2층 바닥 띠 (프리캐스트)
  }
  K.roof(POLY, ROOF, TOP, { par: brick, cope: pc });

  // 옥상 유닛
  for (const [x, z, w, d, h, m] of [[100, 296, 7, 5, 4, M.metal], [142, 306, 11, 6, 5, M.dark], [162, 264, 5, 6, 3.5, M.metal], [70, 262, 2, 2, 2.5, M.metal], [90, 238, 2, 2, 2, M.metal], [122, 238, 2, 2, 2, M.metal], [128, 296, 2, 2, 2.5, M.metal], [100, 305, 2, 2, 2, M.metal], [118, 322, 2, 2, 2, M.metal]]) K.unit(x, z, w, d, ROOF, h, m);
  // 서측 포장 광장 + 낮은 화단벽
  K.P(G.capGeometry([[30, 283], [32, 305], [60, 318], [70, 326.5], [44.2, 297.0], [55.6, 286.6]], [], 0.08), M.walk, false);

  const grp = new THREE.Group();
  for (const m of G.mergeByMaterial(parts)) grp.add(m);
  return grp;
}

// ==== KIT ====
// ---------------------------------------------------------------- 공통 헬퍼 (사진 기반 모듈 공용 사본; lib 수정 금지라 파일마다 복사)
// 벽 p0→p1 은 위에서 봐서 반시계(CCW) 진행 → 진행 방향 오른쪽 = 바깥. s = p0 에서의 거리, o = 바깥쪽 오프셋(+ 바깥, - 안쪽).
function makeKit(M, G, parts) {
  const P = (geom, mat, cast) => { if (geom) parts.push({ geom, mat, cast }); };
  const dir = (p0, p1) => { const dx = p1[0] - p0[0], dz = p1[1] - p0[1], L = Math.hypot(dx, dz); return { ex: [dx / L, dz / L], ez: [-dz / L, dx / L], L, ry: -Math.atan2(dz, dx) }; };
  const at = (p0, d, s, o = 0) => [p0[0] + d.ex[0] * s + d.ez[0] * o, p0[1] + d.ex[1] * s + d.ez[1] * o];
  const Y = (p, y) => [p[0], y, p[1]];
  /** 3D 사각형 (법선이 n 쪽을 향하도록 정렬) */
  function quad(A, B, C, D, n) {
    const u = [B[0] - A[0], B[1] - A[1], B[2] - A[2]], v = [C[0] - A[0], C[1] - A[1], C[2] - A[2]];
    const c = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
    const pts = (c[0] * n[0] + c[1] * n[1] + c[2] * n[2] >= 0) ? [A, B, C, A, C, D] : [A, C, B, A, D, C];
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pts.flat(), 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(pts.map(p => [(p[0] + p[2]) / 24, p[1] / 12]).flat(), 2));
    g.computeVertexNormals();
    return g;
  }
  /** 벽에 붙은 박스: s..e, 높이 b..t, 바깥 오프셋 o0..o1 */
  function wbox(p0, p1, s, e, b, t, o0, o1, mat, cast) {
    const d = dir(p0, p1), c = at(p0, d, (s + e) / 2, (o0 + o1) / 2);
    P(G.box(e - s, t - b, o1 - o0, c[0], b, c[1], { ry: d.ry }), mat, cast);
  }
  /** 벽면 (개구 포함) */
  const wall = (p0, p1, y0, y1, ops, mat) => P(G.wallSeg(p0, p1, y0, y1, { openings: ops || [] }), mat);
  /** 벽면 바깥에 붙인 얇은 면 (띠·필라스터 색 변화용, 두께 없음) */
  function skin(p0, p1, s, e, b, t, o, mat) { const d = dir(p0, p1); P(G.sideGeometry([at(p0, d, s, o), at(p0, d, e, o)], b, t, 1 / 24, 1 / 12, false), mat); }
  /** 창: 안쪽 inset 에 유리 + 프레임 링 + 멀리언/레일 + 4면 리빌(rev 재질) + 선택적 창대 */
  function win(p0, p1, s, e, b, t, o = {}) {
    const { inset = 0.45, fw = 0.22, muls = [], rails = [], frame = M.dark, glass = M.pane, rev = null, sill = null, sillO = 0.3, head = null } = o;
    const d = dir(p0, p1), w = e - s;
    P(G.sideGeometry([at(p0, d, s, -inset), at(p0, d, e, -inset)], b, t, 1 / w, 1 / (t - b), false), glass, false);
    P(G.wallSeg(at(p0, d, s, -inset + 0.05), at(p0, d, e, -inset + 0.05), b, t, { openings: [{ s: fw, e: w - fw, b: b + fw, t: t - fw }] }), frame, false);
    for (const m of muls) P(G.sideGeometry([at(p0, d, s + m - 0.09, -inset + 0.07), at(p0, d, s + m + 0.09, -inset + 0.07)], b, t, 1, 1, false), frame, false);
    for (const y of rails) P(G.sideGeometry([at(p0, d, s, -inset + 0.07), at(p0, d, e, -inset + 0.07)], y - 0.09, y + 0.09, 1, 1, false), frame, false);
    if (rev) {
      const s0 = at(p0, d, s, 0), s1 = at(p0, d, s, -inset), e0 = at(p0, d, e, 0), e1 = at(p0, d, e, -inset);
      P(quad(Y(s0, b), Y(s1, b), Y(s1, t), Y(s0, t), [d.ex[0], 0, d.ex[1]]), rev, false);
      P(quad(Y(e0, b), Y(e1, b), Y(e1, t), Y(e0, t), [-d.ex[0], 0, -d.ex[1]]), rev, false);
      P(quad(Y(s0, t), Y(e0, t), Y(e1, t), Y(s1, t), [0, -1, 0]), rev, false);
      P(quad(Y(s0, b), Y(e0, b), Y(e1, b), Y(s1, b), [0, 1, 0]), rev, false);
    }
    if (sill) wbox(p0, p1, s - 0.2, e + 0.2, b - 0.3, b, -0.05, sillO, sill, false);
    if (head) wbox(p0, p1, s - 0.3, e + 0.3, t, t + 0.6, -0.05, 0.12, head, false);
    return { s, e, b, t };
  }
  /** 문: 어두운 문짝 + 유리(상부) */
  function door(p0, p1, s, e, h, o = {}) {
    const { inset = 0.6, leaves = 2, glassTop = true, frame = M.dark, rev = null } = o;
    const d = dir(p0, p1), w = e - s;
    const op = win(p0, p1, s, e, 0, h, { inset, frame, rev, muls: leaves > 1 ? [w / 2] : [], rails: glassTop ? [] : [] });
    // 문짝 하부 킥플레이트
    P(G.sideGeometry([at(p0, d, s, -inset + 0.08), at(p0, d, e, -inset + 0.08)], 0, 1.0, 1, 1, false), frame, false);
    return op;
  }
  /** 수평 캡 (위 또는 아래 향함) */
  function cap(poly, y, mat, down = false) {
    const g = G.capGeometry(poly, [], y);
    if (down) { const ix = g.index.array; for (let i = 0; i < ix.length; i += 3) { const t = ix[i + 1]; ix[i + 1] = ix[i + 2]; ix[i + 2] = t; } g.computeVertexNormals(); }
    P(g, mat, !down);
  }
  /** 평지붕: 지붕면 + 파라펫(안쪽 면·윗면) + 갓돌. 바깥 벽은 호출자가 yTop 까지 세운다 */
  function roof(poly, y, yTop, { mat = M.roof_membrane, par = M.brick_red, cope = M.limestone, copeW = 1.3 } = {}) {
    cap(poly, y, mat);
    const n = poly.length;
    for (let i = 0; i < n; i++) {
      const a = poly[i], b = poly[(i + 1) % n];
      if (yTop - y > 0.3) wbox(a, b, 0.6, Math.hypot(b[0] - a[0], b[1] - a[1]) - 0.6, y, yTop - 0.3, -1.0, -0.05, par);
      wbox(a, b, -0.15, Math.hypot(b[0] - a[0], b[1] - a[1]) + 0.15, yTop - 0.3, yTop, -copeW + 0.15, 0.15, cope);
    }
  }
  /** 옥상 기계실/유닛 박스 */
  const unit = (x, z, w, d, y, h, mat = M.metal, ry = 0) => P(G.box(w, h, d, x, y, z, { ry }), mat);
  /** 균등 베이: 길이 L 을 n 등분했을 때 각 베이 중심 */
  const centers = (L, n, m0 = 0, m1 = 0) => { const p = (L - m0 - m1) / n; return Array.from({ length: n }, (_, i) => m0 + p * (i + 0.5)); };
  return { P, dir, at, Y, quad, wbox, wall, skin, win, door, cap, roof, unit, centers };
}
