// Academic Enrichment Center / University Police — 스트리트뷰 + 위성 기반 모델 (도면 없음)
// 위치: Pickerl(북)·Erickson(동)·Burford(남) 기숙사 사이를 잇는 저층 연결동, 5th St 쪽(서측)에 경찰서 부분.
// 근거: vp57_007 줌(5th St, (-372,803) 에서 북향) — 남면(서비스 마당 쪽) = 1층 적벽돌 무창 벽, 상단 어두운 금속 갓돌,
//   흰 소핏의 평 캐노피(남면 서쪽, 바닥 위 ≈11 ft, 폭 ≈23 ft) 아래 후퇴 출입부, 그 앞 벽돌 차폐벽(≈6.5 ft),
//   흰 루버(s ≈31..35), 동쪽 끝 출입문. 트럭 높이 대비 벽 높이 ≈17 ft → 저층부 지붕 16, 파라펫 17.5.
//   위성 z20/z19 (scratch/aec_police/sat_fp.png): 북쪽 블록(x -282..-233, z 508..586, 북단 뾰족한 프로우 입구)은 지붕이 더 높고
//   Erickson 그림자가 그 지붕 위에 짧게 떨어짐(z19) → 2층(층고 13) 지붕 26, 파라펫 28.
//   저층부 지붕: 기계 유닛 다수, 북서쪽(x -318..-297, z 570..586) 12팬 냉각기, 어두운 박스 x -284..-264 z 622..633.
//   Burford 북단이 저층부 지붕 위로 그림자(겨울 z20)를 드리움 → 저층부 ≈1층 높이와 일치.
// 가정(사진에 없음): 5th St 쪽 서면(경찰 정문·캐노피·펀치창), 안뜰 쪽 입면(유리 창·출입구), 북 블록 2층 창 배치, 프로우 커튼월.
import * as THREE from 'three';

export const meta = {
  id: 'aec', name: 'Academic Enrichment Center / University Police', osm: 'way/545265800',
  anchor: [0, 0], rotation: 0, height: 28,
  preset: { pos: [-410, 170, 950], tgt: [-280, 10, 630] },
  sheets: 'Street View vp57 (2019), Esri imagery z20/z19',
};

const R1 = 16, T1 = 17.5, R2 = 26, T2 = 28;
// 저층부 (CCW) — 북 블록·Pickerl·Erickson·Burford 와 맞닿는 변은 벽을 세우지 않음
const LOW = [[-318.2, 568.5], [-318.1, 587.9], [-339.7, 588.0], [-339.1, 688.2], [-282.2, 687.9], [-244.6, 687.7], [-219.3, 687.6], [-219.6, 636.7], [-200.9, 636.7], [-201.2, 586.3], [-232.7, 586.5], [-281.0, 586.3], [-280.9, 568.3]];
const NB = [[-281.1, 528.5], [-281.0, 586.3], [-232.7, 586.5], [-232.8, 548.3], [-233.0, 528.5], [-246.5, 528.6], [-246.6, 517.2], [-258.8, 508.0], [-270.7, 518.2], [-270.6, 528.4]];

export function build(M, G) {
  const parts = [];
  const K = makeKit(M, G, parts);
  const brick = M.brick_red, coping = M.dark;
  const pwin = (a, b, c, w, yb, yt) => K.win(a, b, c - w / 2, c + w / 2, yb, yt, { frame: M.dark, muls: [w / 2], rev: brick, sill: M.limestone });

  // 일반 벽돌 면: 일정 간격 펀치창 (층별)
  function face(a, b, { y0 = -1, top = T1, pitch = 12, w = 4.5, rows = [[3.5, 9.0]], skip = () => false, ops = [] } = {}) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.round(L / pitch)), o = [...ops];
    K.centers(L, n, 2, 2).forEach((c, i) => { if (skip(i, c, L)) return; for (const [yb, yt] of rows) if (yb > y0 + 0.5) o.push(pwin(a, b, c, w, yb, yt)); });
    K.wall(a, b, y0, top, o, brick);
  }

  // ================================================================ 저층부 (1층, 지붕 16)
  const [l0, l1, l2, l3, l4, l5, l6, l7, l8, l9] = LOW;
  face(l0, l1, { skip: () => true, ops: [K.door(l0, l1, 7, 10.5, 7.5, { leaves: 1, rev: brick })] });     // 서측 좁은 면 (Pickerl 남단 옆)
  face(l1, l2, { pitch: 10 });                                                                            // 북면 (경찰 부분)
  // 서면 (5th St, x ≈ -339.5): 경찰 정문 (중앙) + 캐노피 + 펀치창
  {
    const L = Math.hypot(l3[0] - l2[0], l3[1] - l2[1]), mid = L / 2;
    K.door(l2, l3, mid - 4, mid + 4, 8.0, { rev: brick });
    const ops = [{ s: mid - 4, e: mid + 4, b: -1, t: 8.0 }, K.win(l2, l3, mid - 4, mid + 4, 8.2, 11.0, { frame: M.dark, muls: [4], rev: brick })];
    ops[1] = { s: mid - 4, e: mid + 4, b: 8.0, t: 11.0 };
    face(l2, l3, { skip: (i, c) => Math.abs(c - mid) < 9, ops });
    K.wbox(l2, l3, mid - 9, mid + 9, 11.6, 12.6, 0, 9, M.white);                     // 캐노피 (흰 소핏)
    K.wbox(l2, l3, mid - 9, mid + 9, 12.6, 13.0, 0, 9, M.metal);
    for (const s of [mid - 8.4, mid + 8.4]) { const p = K.at(l2, K.dir(l2, l3), s, 8.3); K.P(G.cylinder(0.45, 11.6, p[0], 0, p[1], 10), M.metal); }
    K.wbox(l2, l3, mid - 6, mid + 6, 0, 0.5, 0, 9, M.walk, false);
  }
  // 남면 (서비스 마당, x -339.1 → -282.2): 사진 vp57_007 그대로 — 캐노피 + 후퇴 출입부 + 차폐벽 + 루버 + 문
  {
    const a = l3, b = l4;
    const ops = [{ s: 5.0, e: 27.0, b: -1, t: 11.0 }];                                 // 후퇴부 (6 ft)
    ops.push(K.win(a, b, 31.0, 35.0, 7.5, 11.3, { inset: 0.2, frame: M.white, glass: M.metal, rails: [8.3, 9.1, 9.9, 10.6] }));   // 흰 루버
    ops.push(K.door(a, b, 50.5, 54.0, 7.5, { leaves: 1, rev: brick, frame: M.brick_brown }));
    K.wall(a, b, -1, T1, ops, brick);
    const d = K.dir(a, b), Y = (p, y) => [p[0], y, p[1]];
    const in0 = K.at(a, d, 5, -6), in1 = K.at(a, d, 27, -6);
    K.wall(in0, in1, -1, 11, [K.door(in0, in1, 8, 13, 8.0, { leaves: 1, rev: brick }), K.win(in0, in1, 15, 21, 0, 9.5, { glass: M.metal, frame: M.dark, rails: [2, 4, 6, 8] })], brick);
    K.P(K.quad(Y(K.at(a, d, 5, 0), -1), Y(K.at(a, d, 5, -6), -1), Y(K.at(a, d, 5, -6), 11), Y(K.at(a, d, 5, 0), 11), [d.ex[0], 0, d.ex[1]]), brick);
    K.P(K.quad(Y(K.at(a, d, 27, 0), -1), Y(K.at(a, d, 27, -6), -1), Y(K.at(a, d, 27, -6), 11), Y(K.at(a, d, 27, 0), 11), [-d.ex[0], 0, -d.ex[1]]), brick);
    K.wbox(a, b, 4.0, 28.0, 11.0, 11.9, -6, 6.0, M.white);                            // 평 캐노피 (후퇴부 천장 겸)
    K.wbox(a, b, 4.0, 28.0, 11.9, 12.3, -0.05, 6.0, M.metal);
    K.wbox(a, b, 1.0, 28.5, 0, 6.5, 9.0, 10.0, brick);                                  // 차폐벽
    K.wbox(a, b, 0.8, 28.7, 6.5, 6.9, 8.85, 10.15, M.limestone);
  }
  // 안뜰 쪽 (Burford·Erickson 사이): 유리 창 + 출입문
  face(l5, l6, { pitch: 10, w: 6, rows: [[3.0, 9.5]] });
  face(l6, l7, { pitch: 10, w: 6, rows: [[3.0, 9.5]] });
  face(l7, l8, { pitch: 10, w: 6, rows: [[3.0, 9.5]] });
  {
    const L = Math.hypot(l9[0] - l8[0], l9[1] - l8[1]), mid = L / 2;
    K.door(l8, l9, mid - 4, mid + 4, 8.0, { rev: brick });
    face(l8, l9, { pitch: 10, w: 6, rows: [[3.0, 9.5]], skip: (i, c) => Math.abs(c - mid) < 7, ops: [{ s: mid - 4, e: mid + 4, b: -1, t: 8.0 }] });
    K.wbox(l8, l9, mid - 6, mid + 6, 10.0, 10.8, 0, 7, M.metal);
  }
  // 저층부 지붕 (금속 갓돌)
  K.roof(LOW, R1, T1, { par: brick, cope: coping, mat: M.roof_membrane, copeW: 1.2 });

  // ================================================================ 북 블록 (2층, 지붕 26) + 프로우 입구
  const [n0, n1, n2, n3, n4, n5, n6, n7, n8, n9] = NB;
  const rows2 = [[3.0, 9.5], [16.0, 22.0]];
  K.wall(n0, n1, R1, T2, [], brick);                                                    // 서면: Pickerl 과 맞닿음 (저층부 위만, 남쪽 일부 노출)
  face(n1, n2, { y0: R1, top: T2, rows: rows2, pitch: 10, w: 5 });                      // 남면 (저층부 지붕 위 2층 창)
  face(n3, n4, { top: T2, rows: rows2, pitch: 10, w: 5 });                              // 동면 북쪽 (안뜰)
  face(n4, n5, { top: T2, rows: rows2, pitch: 10, w: 5 });                              // 북면 동쪽
  face(n8, n9, { top: T2, rows: [[16.0, 22.0]], skip: () => true });                    // 프로우 서측 짧은 면
  face(n5, n6, { top: T2, rows: [[16.0, 22.0]], skip: () => true });
  face(n9, n0, { top: T2, rows: rows2, pitch: 10, w: 5 });                              // 북면 서쪽
  for (const [a, b] of [[n6, n7], [n7, n8]]) {                                          // 프로우 대각 커튼월 2면 + 출입문
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    K.wall(a, b, -1, T2, [{ s: 0.8, e: L - 0.8, b: 0, t: R2 - 1.5 }], brick);
    K.win(a, b, 0.8, L - 0.8, 0, R2 - 1.5, { inset: 0.4, frame: M.dark, glass: M.glass, muls: [L / 4 - 0.4, L / 2 - 0.8, 3 * L / 4 - 1.2], rails: [8.5, 12.4, 13.6] });
    K.door(a, b, L / 2 - 3.5, L / 2 + 3.5, 8.0, { inset: 0.25 });
  }
  K.roof(NB, R2, T2, { par: brick, cope: coping, mat: M.roof_membrane, copeW: 1.2 });
  K.wbox(n7, n8, -1, 16.7, 13.8, 14.6, 0, 4.0, M.metal);                                 // 프로우 앞 캐노피 (북서 대각)
  K.wbox(n6, n7, -1, 16.3, 13.8, 14.6, 0, 4.0, M.metal);

  // ================================================================ 옥상 설비 (위성)
  K.unit(-307.5, 578, 21, 14, R1, 5, M.metal);                                           // 12팬 냉각기
  for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) K.P(G.cylinder(1.9, 0.6, -315 + i * 5, R1 + 5, 573.5 + j * 4.5, 14), M.dark);
  K.unit(-274, 627.5, 20, 11, R1, 5, M.dark);
  for (const [x, z, w, d, h] of [[-330, 595, 5, 4, 3], [-300, 610, 3, 3, 2.5], [-280, 612, 3, 3, 2.5], [-260, 610, 3, 3, 2.5], [-235, 605, 6, 6, 4], [-210, 614, 2, 2, 2.5], [-330, 628, 2, 2, 2.5], [-290, 672, 2, 2, 2.5], [-330, 670, 3, 4, 3], [-300, 650, 3, 3, 2.5]]) K.unit(x, z, w, d, R1, h, M.metal);
  for (const [x, z] of [[-262, 535], [-250, 535], [-262, 553], [-250, 553], [-262, 572], [-250, 572]]) K.unit(x, z, 2.5, 2.5, R2, 1.5, M.white);
  K.unit(-256, 575, 8, 8, R2, 5, M.dark);

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
