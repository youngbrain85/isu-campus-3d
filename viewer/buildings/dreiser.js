// Dreiser Hall (1950) — 위성·자료 기반 모델 (도면 없음, 스트리트뷰에 본 건물이 찍힌 사진 없음)
// 근거: scratch/sv/461428313 의 6장(vp31·vp32, 5th St 와 Chestnut St)은 모두 서쪽 400~600 ft 거리에서 찍혀
//   Pickerl Hall·나무에 가려 Dreiser 자체는 보이지 않음 → 외관 패턴은 같은 시기(1950~55) ISU 벽돌 건물(Welcome Center 1955,
//   Gillum 1950)의 일반형을 따름. 평면·지붕은 Esri z20(겨울)/z19(여름) 위성 판독(scratch/dreiser/sat_fp.png).
//   층수: 3층 (building_facts: 1950, OSM building:levels=3). 층고 14 ft → 지붕 42, 파라펫 상단 44.5 ft.
//   본체: OSM 외곽 중 x 25..128, z 536..687 (남서 모서리 20×10 ft 노치 포함) — 위성 지붕 윤곽과 일치.
//     OSM 의 서측 띠(x 15..25, z 510..600) 와 북서 x 15..49 z 510..537 은 위성에서 지면(보도·포장)으로 보여 제외.
//   북측 부속동: x 49..70, z 516..537 (위성에서 밝은 테두리의 낮은 사각 지붕, 본체 그림자 안) → 1층 14 ft 벽돌, 하역문.
//   [항공사진으로 수정] 재료: ISU 가상투어 드론 파노라마 main_quad/l (동면, 비교 scratch/aerial/dreiser.png) — 중간 갈색 벽돌
//   (적벽돌 아님) 2·3층 + 1층 밝은 석재 피복·큰 창, 흰 금속 갓돌, 짙은 갈색 멤브레인 지붕, 동면 가운데 왼쪽 2·3층 통유리 계단창,
//   옥상 = 북서 모서리 벽돌 펜트하우스 + 중앙 긴 어두운 기계 하우징 + 원형 환기구 2 (위성 판독과 일치).
//   창(가정): 각 면 ~10 ft 베이마다 강철 새시 창 5.0×6.5 ft (창대 = 층바닥+3), 중앙 멀리언 + 상부 레일.
//   출입구(가정): 동측 중앙(정면, 캠퍼스 내부 방향) 석회석 프레임 2짝문×2 + 캐노피, 남서 노치 남면 출입문, 북측 서비스문.
//   지붕(위성): 평지붕(밝은 멤브레인) + 파라펫. 서측 펜트하우스 x 30..48 z 560..581 (그림자로 ≈10 ft),
//     중앙 어두운 기계 하우징 x 79..89 z 588..640 (원형 팬 2개), 남서 천창 2개 x 35..48 z 640..675, 소형 배기 유닛 다수.
import * as THREE from 'three';

export const meta = {
  id: 'dreiser', name: 'Dreiser Hall', osm: 'way/461428313',
  anchor: [0, 0], rotation: 0, height: 53,
  preset: { pos: [440, 150, 640], tgt: [76, 15, 610] },
  sheets: 'Esri imagery z20/z19 (no usable Street View of this building)',
};

const F = [0, 14, 28], ROOF = 42, TOP = 44.5, GF = 14;
const MAIN = [[25.4, 537.2], [26.3, 677.1], [46.6, 676.9], [46.8, 687.3], [127.9, 686.3], [126.1, 536.0]];
const ANNEX = [[49.2, 516.3], [49.3, 537.0], [70.1, 536.7], [69.8, 516.1]];

export function build(M, G) {
  const parts = [];
  const K = makeKit(M, G, parts);
  // 항공사진(main_quad/l): 중간 갈색 벽돌 + 1층 밝은 석재 피복
  const brick = M.brick_brown, stone = M.limestone;
  const WO = { rev: brick, sill: stone, frame: M.dark };

  // 한 면: nb 베이, 층마다 창 (skip(i, f) 가 true 면 그 창 생략). extraOps = 문 등 추가 개구
  function facade(p0, p1, nb, { m0 = 3, m1 = 3, ww = 5.0, skip = () => false, extraOps = [], y1 = TOP } = {}) {
    const d = K.dir(p0, p1), ops = [...extraOps];
    for (const c of K.centers(d.L, nb, m0, m1).map((c, i) => [c, i])) {
      const [cx, i] = c;
      for (let f = 0; f < F.length; f++) {
        if (skip(i, f)) continue;
        const b = f === 0 ? 2.5 : F[f] + 3.0, t = f === 0 ? 11.8 : F[f] + 9.8, w = f === 0 ? ww : ww - 1.2;
        ops.push(K.win(p0, p1, cx - w / 2, cx + w / 2, b, t, { ...WO, rev: f === 0 ? stone : brick, muls: f === 0 ? [w / 2] : [], rails: [b + 4.4] }));
      }
    }
    // 항공사진: 1층 = 밝은 석회석 피복 + 큰 창, 2·3층 = 갈색 벽돌 → 벽을 둘로 나눔
    K.wall(p0, p1, -1, GF, ops.filter(o => o.t <= GF + 0.01), stone);
    K.wall(p0, p1, GF, y1, ops.filter(o => o.t > GF + 0.01).map(o => ({ ...o, b: Math.max(o.b, GF) })), brick);
    K.wbox(p0, p1, -0.1, d.L + 0.1, GF - 0.2, GF + 1.0, -0.05, 0.35, stone);   // 1층 위 석재 띠
    return d;
  }

  // ------------------------------------------------------------ 본체 4면 (+ 노치)
  const [A, B, C, D, E, Fp] = MAIN;
  // 서측 (x≈25.4, 북→남): 14 베이
  facade(A, B, 14);
  // 남서 노치 남면 (x 26..46.6): 출입문 (중앙) + 위층 창 2
  {
    const L = Math.hypot(C[0] - B[0], C[1] - B[1]), dO = [];
    K.door(B, C, L / 2 - 3.5, L / 2 + 3.5, 8.5, { rev: stone });
    K.win(B, C, L / 2 - 3.5, L / 2 + 3.5, 8.7, 11.6, { rev: stone, muls: [3.5] }); dO.push({ s: L / 2 - 3.5, e: L / 2 + 3.5, b: 0, t: 11.6 });
    facade(B, C, 2, { m0: 2, m1: 2, skip: (i, f) => f === 0, extraOps: dO });
    K.wbox(B, C, L / 2 - 4.6, L / 2 + 4.6, 0, 12.6, -0.05, 0.9, stone);   // 석회석 문틀 (돌출)
    K.wbox(B, C, L / 2 - 5.5, L / 2 + 5.5, 12.6, 13.4, -0.05, 5.0, stone); // 캐노피 슬래브
  }
  // 노치 서면 (짧은 면)
  K.wall(C, D, -1, TOP, [], brick);
  // 남측 (x 46.8..127.9): 8 베이
  facade(D, E, 8);
  // 동측 (z 686→536, 정면): 15 베이, 가운데 3 베이 1층 = 출입구
  {
    const L = Math.hypot(Fp[0] - E[0], Fp[1] - E[1]), mid = L / 2, ops = [];
    for (const off of [-4.2, 4.2]) {
      K.door(E, Fp, mid + off - 3.4, mid + off + 3.4, 8.5, { rev: stone });
      K.win(E, Fp, mid + off - 3.4, mid + off + 3.4, 8.7, 11.8, { rev: stone, muls: [1.7, 3.4, 5.1] });
      ops.push({ s: mid + off - 3.4, e: mid + off + 3.4, b: 0, t: 11.8 });
    }
    ops.push(K.win(E, Fp, mid - 6, mid + 6, 17.5, 37.5, { rev: stone, frame: M.dark, muls: [3, 6, 9], rails: [23.0, 27.4, 28.6, 37.0] }));
    facade(E, Fp, 15, { skip: (i, f) => (f === 0 && i >= 6 && i <= 8) || (f > 0 && i === 7), extraOps: ops });
    // 석회석 출입구 프레임 (2층 창대까지) + 캐노피 + 계단 3단
    K.wbox(E, Fp, mid - 10, mid - 8.5, 0, 16.5, -0.05, 1.2, stone);
    K.wbox(E, Fp, mid + 8.5, mid + 10, 0, 16.5, -0.05, 1.2, stone);
    K.wbox(E, Fp, mid - 10, mid + 10, 13.0, 16.5, -0.05, 1.2, stone);
    K.wbox(E, Fp, mid - 11, mid + 11, 12.2, 13.0, 1.2, 8.0, stone);        // 캐노피
    for (let k = 0; k < 3; k++) K.wbox(E, Fp, mid - 11 + k * 0.6, mid + 11 - k * 0.6, -0.6 + k * 0.5, -0.1 + k * 0.5, 0, 9 - k * 1.2, M.walk, false);
  }
  // 북측 (x 126→25.4): 10 베이; 부속동(x 49..70) 접하는 1층 창 생략, 서측 끝 서비스문
  {
    const d = K.dir(Fp, A), sAn0 = d.L - (70.1 - 25.4), sAn1 = d.L - (49.2 - 25.4);
    const ops = [K.door(Fp, A, d.L - 12, d.L - 8.5, 7.5, { leaves: 1, rev: brick })];
    const cs = K.centers(d.L, 10, 3, 3);
    facade(Fp, A, 10, { skip: (i, f) => (f === 0 && cs[i] > sAn0 - 3 && cs[i] < sAn1 + 3) || (f === 0 && cs[i] > d.L - 14), extraOps: ops });
  }
  { const rm = M.roof_dark.clone(); rm.color = new THREE.Color(1.25, 1.15, 1.05); rm.name = 'dreiser_roof';   // 항공사진: 짙은 갈회색 멤브레인 + 흰 금속 갓돌
    K.roof(MAIN, ROOF, TOP, { par: brick, cope: M.white, mat: rm }); }

  // ------------------------------------------------------------ 북측 부속동 (1층, 하역)
  {
    const [a, b, c, d] = ANNEX, H = 13, T = 14.5;
    K.wall(a, b, -1, T, [], brick);                                      // 서
    K.wall(c, d, -1, T, [], brick);                                      // 동
    const dn = K.dir(d, a), ops = [];
    ops.push(K.win(d, a, 4, 14, 0, 10, { inset: 0.5, frame: M.dark, glass: M.metal, rev: brick, rails: [2, 4, 6, 8] }));   // 오버헤드 도어
    ops.push(K.door(d, a, 16.5, 19.5, 7.5, { leaves: 1, rev: brick }));
    K.wall(d, a, -1, T, ops, brick);
    K.wbox(d, a, 2.5, 15.5, 10.4, 11.0, 0, 4.5, M.metal);                // 하역 캐노피
    K.wbox(d, a, 3, 15, -1, 3.8, 0, 6, M.concrete);                       // 하역 플랫폼
    K.roof(ANNEX, H, T, { par: brick, cope: stone, mat: M.roof_gravel });
  }

  // ------------------------------------------------------------ 옥상
  {
    const ph = [[30, 560], [30, 581], [48, 581], [48, 560]];
    for (let i = 0; i < 4; i++) K.wall(ph[i], ph[(i + 1) % 4], ROOF, ROOF + 10, i === 0 ? [K.door(ph[0], ph[1], 8, 11, ROOF + 7, { leaves: 1 })] : [], brick);
    K.wbox(ph[0], ph[1], 8, 11, ROOF, ROOF + 7, -0.3, 0, M.dark, false);
    K.roof(ph, ROOF + 10, ROOF + 11, { par: brick, cope: stone, mat: M.roof_membrane });
    K.unit(84, 614, 10, 52, ROOF, 5, M.metal);                          // 기계 하우징
    for (const z of [605, 625]) P2(G.cylinder(3.0, 1.2, 84, ROOF + 5, z, 16), M.dark);
    for (const [x, z, w, d, h] of [[68, 567, 3, 3, 2.5], [83, 566, 3.5, 3.5, 3], [103, 562, 2, 2, 2.5], [108, 568, 2.5, 2.5, 2.5], [70, 581, 3, 3, 2.5], [117, 605, 2, 2, 2.5], [117, 629, 3, 3, 3], [80, 658, 3, 3, 2.5], [80, 675, 3, 3, 2.5], [121, 645, 6, 4, 3]]) K.unit(x, z, w, d, ROOF, h, M.metal);
    for (const [z0, z1] of [[640, 653], [655, 675]]) {                   // 천창 (유리 경사 박스)
      K.unit(41.5, (z0 + z1) / 2, 13, z1 - z0, ROOF, 1.2, M.white);
      parts.push({ geom: G.gableRoof([[35.5, z0 + 0.5], [35.5, z1 - 0.5], [47.5, z1 - 0.5], [47.5, z0 + 0.5]], ROOF + 1.2, 0.35, 90), mat: M.pane, cast: false });
    }
  }
  function P2(g, m) { parts.push({ geom: g, mat: m }); }

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
