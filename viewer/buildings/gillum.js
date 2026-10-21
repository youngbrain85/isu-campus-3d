// Gillum Hall (1950) — 위성·자료 기반 모델 (도면 없음, 이 건물이 보이는 스트리트뷰 없음)
// 근거: scratch/sv/461428314 의 6장 중 vp33(5th St, 서쪽 450 ft)은 Burford Hall 에 가리고, vp34(Cherry St, 2026)는
//   남쪽 신축 공사 현장만 보임 → Gillum 은 사진에 없음. 외관 패턴은 같은 1950 년대 ISU 벽돌 건물 일반형(가정),
//   평면·지붕은 Esri z20 위성(scratch/gillum/sat_fp.png) 판독.
//   [항공사진으로 수정] 층수: 4층 → 지상 3층 (14 ft, 지붕 42, 갓돌 44). 근거: ISU 가상투어 드론 파노라마 main_quad/l (동면 정면,
//   비교 scratch/aerial/gillum.png) — 벽돌 2개 층 + 석재 띠 아래 밝은 1층(기둥·큰 창). 벽돌 = 중간 갈색(적벽돌 아님),
//   동면 단창 15 열 + 중앙 북쪽 2·3층 통유리 계단창, 지붕 = 베이지 멤브레인 + 흰 금속 갓돌, 옥상 흰 펜트하우스·위성접시·AC 확인.
//   본체: OSM 직사각형 x 47..129, z 737..888 (위성 지붕 윤곽과 2 ft 이내 일치).
//   서측 반원 돌출부(OSM, 반지름 ≈ 20 ft, z 796..833): 위성에선 지붕이 밝은 포장색 → 1층 유리 로툰다(입구 홀)로 해석, 높이 15 ft.
//   서측 중앙 파빌리온 x 47..63, z 797..835: 위성에 흰 갓돌 테두리 + 동쪽 그림자 → 지붕보다 ≈6 ft 높은 계단/로비 블록.
//     석회석 마감 + 세로 창띠 3줄(가정).
//   재료(가정): 적벽돌, 석회석 기초 띠·창대·갓돌. 창(가정): ≈10.5 ft 베이마다 5.0×6.0 ft 강철 새시 (창대 = 층바닥+3).
//   출입구(가정): 서측 로툰다(주출입), 동측 중앙 석회석 프레임 출입구, 남측 서비스 문.
//   지붕(위성): 평지붕 + 파라펫, 기계 박스 x 80..88 z 783..797 (어두운 색, 높이 6), 옆 HVAC x 72..84 z 790..800,
//     박스 x 95..103 z 832..845, 원형 배기 3개 (x 82..95, z 812), 위성 접시(흰 타원, x 76 z 861), 소형 유닛.
import * as THREE from 'three';

export const meta = {
  id: 'gillum', name: 'Gillum Hall', osm: 'way/461428314',
  anchor: [0, 0], rotation: 0, height: 49,
  preset: { pos: [-250, 150, 1010], tgt: [88, 15, 812] },
  sheets: 'Esri imagery z20/z19 (no usable Street View of this building)',
};

const F = [0, 14, 28], ROOF = 42, TOP = 44, GF = 14;   // 항공사진: 지상 3 층 (4 층 아님)
const MAIN = [[47.1, 737.1], [47.5, 888.1], [128.9, 887.8], [128.5, 736.8]];
const PAV = { z0: 797, z1: 835, x1: 63, top: 48.5 };
const ROT = [[47.3, 795.8], [38.6, 796.8], [33.3, 799.8], [29.5, 803.8], [27.0, 809.1], [26.4, 816.2], [27.7, 821.4], [30.4, 826.0], [33.8, 829.2], [37.5, 831.3], [40.6, 832.4], [47.3, 832.8]];

export function build(M, G) {
  const parts = [];
  const K = makeKit(M, G, parts);
  // 항공사진(main_quad/l): 적벽돌이 아니라 중간 갈색 벽돌, 1층은 밝은 석재·큰 창
  const brick = M.brick_brown, stone = M.limestone;
  const WO = { rev: brick, sill: stone, frame: M.dark };

  function facade(p0, p1, nb, { m0 = 3, m1 = 3, ww = 5.0, skip = () => false, extraOps = [], s0 = 0, s1 = null } = {}) {
    const d = K.dir(p0, p1), ops = [...extraOps];
    K.centers(d.L, nb, m0, m1).forEach((cx, i) => {
      for (let f = 0; f < F.length; f++) {
        if (skip(i, f, cx)) continue;
        const b = f === 0 ? 2.5 : F[f] + 3.0, t = f === 0 ? 11.5 : F[f] + 9.5, w = f === 0 ? ww : ww - 1.2;
        ops.push(K.win(p0, p1, cx - w / 2, cx + w / 2, b, t, { ...WO, rev: f === 0 ? stone : brick, muls: f === 0 ? [w / 2] : [], rails: [b + 4.0] }));
      }
    });
    // 항공사진: 1층 = 밝은 석회석 피복 + 큰 창, 2·3층 = 갈색 벽돌 → 벽을 둘로 나눔
    K.wall(p0, p1, -1, GF, ops.filter(o => o.t <= GF + 0.01), stone);
    K.wall(p0, p1, GF, TOP, ops.filter(o => o.t > GF + 0.01).map(o => ({ ...o, b: Math.max(o.b, GF) })), brick);
    K.wbox(p0, p1, -0.1, d.L + 0.1, GF - 0.2, GF + 1.0, -0.05, 0.35, stone);   // 1층 위 석재 띠
    return d;
  }
  const [A, B, C, D] = MAIN;
  // ------------------------------------------------------------ 서측 (z 737→888): 파빌리온 구간(z 797..835)은 별도 마감
  {
    const d = K.dir(A, B), sP0 = PAV.z0 - A[1], sP1 = PAV.z1 - A[1];
    facade(A, B, 14, { skip: (i, f, cx) => cx > sP0 - 3.5 && cx < sP1 + 3.5 });
    // 파빌리온 정면: 석회석 피복 (벽 바깥 0.6) + 세로 창띠 3줄 (2~4층) — 1층은 로툰다 뒤
    // 석회석 파빌리온 면은 본 벽보다 0.6 ft 앞 → 따로 벽면을 세우고 창은 그 면 기준 0.5 안쪽(본 벽보다 앞)
    const q0 = K.at(A, d, sP0, 0.6), q1 = K.at(A, d, sP1, 0.6), ops = [];
    for (const c of [7, 19, 31]) ops.push(K.win(q0, q1, c - 2.6, c + 2.6, 15.0, 40.0, { rev: stone, frame: M.dark, muls: [2.6], rails: [21.5, 23.5, 34.5, 36.5], inset: 0.5 }));
    K.wall(q0, q1, -1, PAV.top, ops, stone);
    K.wbox(A, B, sP0 - 0.3, sP0 + 0.3, -1, PAV.top, 0, 0.6, stone); K.wbox(A, B, sP1 - 0.3, sP1 + 0.3, -1, PAV.top, 0, 0.6, stone);
  }
  // 파빌리온 상부 (지붕 위 6 ft 블록): x 47..63
  {
    const pv = [[47.1, PAV.z0], [47.1, PAV.z1], [PAV.x1, PAV.z1], [PAV.x1, PAV.z0]];
    K.wall(pv[1], pv[2], ROOF, PAV.top, [], stone); K.wall(pv[2], pv[3], ROOF, PAV.top, [], stone); K.wall(pv[3], pv[0], ROOF, PAV.top, [], stone);
    K.roof(pv, PAV.top - 1.5, PAV.top, { par: stone, cope: stone, mat: M.roof_membrane });
  }
  // ------------------------------------------------------------ 남측 (x 47→129): 7 베이, 서쪽 끝 서비스 문
  facade(B, C, 7, { skip: (i, f) => f === 0 && i === 0, extraOps: [K.door(B, C, 7, 10.5, 7.5, { leaves: 1, rev: brick })] });
  // ------------------------------------------------------------ 동측 (z 888→737): 14 베이, 중앙 출입구
  {
    const d = K.dir(C, D), mid = d.L / 2, ops = [];
    K.door(C, D, mid - 4.5, mid + 4.5, 8.5, { rev: stone });
    ops.push(K.win(C, D, mid - 4.5, mid + 4.5, 8.7, 11.5, { rev: stone, muls: [3, 6] }));
    ops[0] = { s: mid - 4.5, e: mid + 4.5, b: 0, t: 11.5 };
    // 항공사진: 동면 가운데에서 약간 북쪽(s≈85) 에 2·3 층 통유리 계단창 (폭 10)
    ops.push(K.win(C, D, 80, 90, 16.5, 39.5, { rev: brick, frame: M.dark, muls: [2.5, 5, 7.5], rails: [27.2, 28.8] }));
    facade(C, D, 14, { skip: (i, f, cx) => (f === 0 && Math.abs(cx - mid) < 7) || (f > 0 && Math.abs(cx - 85) < 6.5), extraOps: ops });
    K.wbox(C, D, mid - 6.5, mid - 5, 0, 13.5, -0.05, 1.0, stone); K.wbox(C, D, mid + 5, mid + 6.5, 0, 13.5, -0.05, 1.0, stone);
    K.wbox(C, D, mid - 6.5, mid + 6.5, 11.7, 13.5, -0.05, 1.0, stone);
    K.wbox(C, D, mid - 8, mid + 8, 12.0, 12.8, 1.0, 7.0, stone);
    for (let k = 0; k < 3; k++) K.wbox(C, D, mid - 8 + k * 0.6, mid + 8 - k * 0.6, -0.6 + k * 0.5, -0.1 + k * 0.5, 0, 8 - k * 1.2, M.walk, false);
  }
  // ------------------------------------------------------------ 북측 (x 129→47): 7 베이
  facade(D, A, 7);
  { const rm = M.roof_gravel.clone(); rm.color = new THREE.Color(0xc8b9a0); rm.name = 'gillum_roof';   // 항공사진: 베이지 멤브레인 + 흰 금속 갓돌
    K.roof(MAIN, ROOF, TOP, { par: brick, cope: M.white, mat: rm }); }

  // ------------------------------------------------------------ 서측 유리 로툰다 (1층, 15 ft)
  {
    const H = 14, T = 15.5, n = ROT.length;
    for (let i = 0; i < n - 1; i++) {
      const a = ROT[i], b = ROT[i + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1]);
      const isDoor = i === 4 || i === 5;                                   // 정서향 2 구간 = 출입문
      K.wall(a, b, -1, T, [{ s: 0.4, e: L - 0.4, b: isDoor ? 0 : 1.5, t: H - 0.6 }], stone);
      if (isDoor) { K.door(a, b, 0.4, L - 0.4, 8, { rev: stone }); K.win(a, b, 0.4, L - 0.4, 8.2, H - 0.6, { rev: stone, muls: [(L - 0.8) / 2] }); }
      else K.win(a, b, 0.4, L - 0.4, 1.5, H - 0.6, { rev: stone, muls: [(L - 0.8) / 2], rails: [8.2] });
    }
    const poly = ROT;                                                      // ROT 는 북→서→남 = CCW
    K.roof(poly, H, T, { par: stone, cope: M.white, mat: M.roof_membrane });
    for (const [x, z] of [[29.0, 803.5], [26.0, 816.2], [30.2, 826.5]]) parts.push({ geom: G.box(1.2, H, 1.2, x - 0.4, 0, z), mat: stone });
  }

  // ------------------------------------------------------------ 옥상 설비
  K.unit(84, 790, 8, 14, ROOF, 6, M.white);   // 항공사진: 흰 펜트하우스
  K.unit(78, 795, 12, 10, ROOF, 3.5, M.metal);
  K.unit(99, 838.5, 8, 13, ROOF, 6, M.white);
  for (const x of [83, 89, 95]) parts.push({ geom: G.cylinder(1.4, 2.5, x, ROOF, 812, 12), mat: M.metal });
  for (const [x, z, w, d, h] of [[68, 768, 3, 3, 2.5], [86, 759, 4, 3, 3], [119, 795, 5, 2.5, 2.5], [83, 862, 3, 2, 2.5], [105, 870, 3, 3, 2.5], [110, 760, 3, 3, 2.5]]) K.unit(x, z, w, d, ROOF, h, M.metal);
  {   // 위성 접시 (지름 8 ft, 남향 경사)
    const g = new THREE.SphereGeometry(4.5, 16, 6, 0, Math.PI * 2, 0, 0.75); g.scale(1, 0.35, 1); g.rotateX(-0.9); g.translate(76, ROOF + 5, 861);
    parts.push({ geom: g, mat: M.white }); parts.push({ geom: G.box(0.6, 4, 0.6, 76, ROOF, 861.5), mat: M.metal });
  }

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
