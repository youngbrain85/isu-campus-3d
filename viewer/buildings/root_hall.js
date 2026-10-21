// Root Hall (1989) — 사진·위성 기반 모델 (도면 없음). 월드 좌표(ft)로 직접 작성.
// 근거: Street View 사용자 포토스피어 vp23 (7th St 에서 259/304/349 — 동측 입면 전체와 남동 모서리 입구), vp22_304(원경),
//   Esri z20(겨울)·z19(여름) 위성.
// ■ 형태: U 자형 평면 — 서측 윙(x 515~575), 북측 바(z -322~-414, 북서 블록은 x 496 까지·z -424 까지 돌출), 동측 윙(x 727~786).
//   가운데가 남쪽으로 열린 중정. 지붕은 위성에서 뚜렷한 스탠딩심 금속 모임지붕(hip, 5:12)이고, 깊은 북측 바는 꼭대기가
//   평지붕(여름 위성의 흰 멤브레인, z -352~-367). 북측 x 591~703 띠(z -397~-414)는 평지붕 1단(위성: 경사지붕 그림자가 떨어짐).
// ■ 층수·높이: 지상 2층 (사진에 창 2단). 처마/코핑 상단 30 ft, 모임지붕 마루 42.2 ft (= site.json h 42.7 과 일치).
//   사진 vp23_304 모서리 수직선 비율(소실 1D 호모그래피로 검증): 기단 0.146 H, 가는 띠 0.45 H, 넓은 띠 0.67 H.
//   → 석재 기단 0~4.4, 가는 띠 13.2~13.8, 2층 창대 띠 19.9~20.8, 프리캐스트 코핑 28.6~30.
// ■ 재료: 주황빛 적벽돌(brick_red), 석회석/프리캐스트 띠·기단·코핑, 짙은 브론즈 알루미늄 창, 어두운 금속 지붕.
// ■ 창 리듬 (동측 입면 사진에서 실측): 2연창(창 4.7 ft + 사이 2.6 ft)이 25.4 ft 간격, 1층 창 4.4~9.6 / 2층 창 20.8~27.8
//   (하부 호퍼 레일 22.6). 2연창 사이 간격마다 홈통(downspout)과 정사각 석재 장식 타일(1.2 ft)이 번갈아 배치.
//   1층과 2층 사이(9.6~20.8)는 무창 벽돌 + 가는 띠 — 사진 그대로.
// ■ 입구: 동측 윙 남면의 6 ft 돌출 입구 베이(x 745~769) — 후퇴한 유리 현관 + 철문, 베이 벽은 코핑 위로 3.5 ft 솟은 파라펫
//   (사진 vp23_259). 나머지 입구(서측 윙 남단 중앙, 중정 쪽 바 중앙, 북서 블록 서면)는 사진에 없어 같은 형식으로 가정.
// ■ 가정: 중정·북·서면의 창 리듬은 동측과 동일하다고 가정. 지붕 접합부는 같은 경사의 모임지붕 직사각형들을 겹쳐
//   (직교 다각형의 straight skeleton 과 같아짐) 골(valley)을 만든다.
import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

export const meta = {
  id: 'root', name: 'Root Hall', osm: 'way/461428309',
  anchor: [0, 0], rotation: 0, height: 43,
  preset: { pos: [1010, 160, -150], tgt: [645, 15, -320] },
  sheets: 'Street View vp23/vp22 (user photosphere), Esri imagery z20/z19',
};

const EAVE = 30, PITCH = 5 / 12, TOP = 42.19, OV = 1.2;
const BASE = 4.4, THIN0 = 13.2, THIN1 = 13.8, WIDE0 = 19.9, WIDE1 = 20.8, COP0 = 28.6;
const LW = [4.4, 9.6], UW = [20.8, 27.8];             // 1·2층 창 하단/상단
const WIN = 4.7, GAP = 2.6, PITCH_PAIR = 25.4;

// 외곽 (site.json 폴리곤 정리, CCW)
const POLY = [[515.2, -208.2], [575, -208.5], [574.3, -322.1], [727.2, -323.1], [727.7, -249.8], [745, -249.9], [745.1, -244.2],
  [768.8, -244.3], [768.8, -250.4], [786.3, -250.5], [785.5, -382.9], [737.4, -382.6], [737.3, -396.8], [703.2, -396.5], [703.1, -414],
  [590.9, -413.3], [590.9, -424.4], [495.9, -423.9], [496.2, -375.1], [514.2, -375.2]];
const BAY = [5, 6, 7];                                  // 입구 베이 변 (POLY 인덱스)
// 입구: 변 인덱스 → {s 중심, kind}
const DOORS = { 0: { c: 'mid', kind: 'glass' }, 2: { c: 'mid', kind: 'glass' }, 17: { c: 'mid', kind: 'glass' }, 6: { c: 16, kind: 'bay' } };

export function build(M, G) {
  const parts = [];
  const P = (geom, mat, cast) => { if (geom) parts.push({ geom, mat, cast }); };
  const brick = M.brick_red, stone = M.limestone, frame = M.dark;
  const metal = new THREE.MeshStandardMaterial({ color: 0x323a3d, roughness: 0.6, metalness: 0.3 });
  const pre = M.precast;

  const dir = (p0, p1) => { const dx = p1[0] - p0[0], dz = p1[1] - p0[1], L = Math.hypot(dx, dz); return { ex: [dx / L, dz / L], ez: [-dz / L, dx / L], L, ry: -Math.atan2(dz, dx) }; };
  const at = (p0, d, s, off) => [p0[0] + d.ex[0] * s - d.ez[0] * off, p0[1] + d.ex[1] * s - d.ez[1] * off];
  const slab = (p0, p1, s0, s1, y0, y1, out, inn, mat, cast) => { if (s1 - s0 < 0.05) return; const d = dir(p0, p1); const c = at(p0, d, (s0 + s1) / 2, (inn - out) / 2); P(G.box(s1 - s0, y1 - y0, out + inn, c[0], y0, c[1], { ry: d.ry }), mat, cast); };
  function glazing(p0, p1, s, e, b, t, { inset = 0.6, rails = [], muls = [], revealMat = brick } = {}) {
    const d = dir(p0, p1);
    P(G.sideGeometry([at(p0, d, s, inset), at(p0, d, e, inset)], b, t, 1 / Math.max(1, e - s), 1 / Math.max(1, t - b), false), M.pane, false);
    const fr = [];
    for (const sm of [s, ...muls, e]) { const c = at(p0, d, sm, inset - 0.1); fr.push(G.box(0.2, t - b, 0.3, c[0], b, c[1], { ry: d.ry })); }
    for (const y of [b, ...rails, t]) { const c = at(p0, d, (s + e) / 2, inset - 0.1); fr.push(G.box(e - s, 0.2, 0.3, c[0], y - 0.1, c[1], { ry: d.ry })); }
    P(BufferGeometryUtils.mergeGeometries(fr), frame);
    const r = [];
    for (const sm of [s, e]) { const c = at(p0, d, sm, inset / 2); r.push(G.box(0.1, t - b, inset, c[0], b, c[1], { ry: d.ry })); }
    { const c = at(p0, d, (s + e) / 2, inset / 2); r.push(G.box(e - s, 0.1, inset, c[0], t - 0.05, c[1], { ry: d.ry })); }
    P(BufferGeometryUtils.mergeGeometries(r), revealMat);
  }

  // ------------------------------------------------------------ 벽
  const n = POLY.length;
  for (let i = 0; i < n; i++) {
    const p0 = POLY[i], p1 = POLY[(i + 1) % n], d = dir(p0, p1), L = d.L;
    const isBay = BAY.includes(i);
    const top = isBay ? 33.5 : EAVE;
    const ops = [], gaps = [];                         // gaps: 기단 띠를 끊을 구간 (문)
    // 2연창 배치
    let np = isBay ? 0 : L >= 20 ? Math.max(1, Math.round((L - 6) / PITCH_PAIR)) : (L >= 15 && !isBay ? 1 : 0);
    while (np > 1 && (L - (np - 1) * PITCH_PAIR) / 2 < 7) np--;
    const c0 = (L - (np - 1) * PITCH_PAIR) / 2;
    const door = DOORS[i];
    const doorC = door ? (door.c === 'mid' ? L / 2 : door.c) : null;
    for (let k = 0; k < np; k++) {
      const c = c0 + k * PITCH_PAIR;
      const skipLower = doorC !== null && Math.abs(c - doorC) < PITCH_PAIR / 2;
      for (const s of [c - GAP / 2 - WIN, c + GAP / 2]) {
        ops.push({ s, e: s + WIN, b: UW[0], t: UW[1] });
        glazing(p0, p1, s, s + WIN, UW[0], UW[1], { rails: [22.6] });
        if (!skipLower && L >= 20) { ops.push({ s, e: s + WIN, b: LW[0], t: LW[1] }); glazing(p0, p1, s, s + WIN, LW[0], LW[1]); }
      }
      // 사이 간격: 홈통 / 장식 타일 교대
      if (k < np - 1) {
        const g = c + PITCH_PAIR / 2;
        if (k % 2 === 0) slab(p0, p1, g - 0.25, g + 0.25, 0, EAVE - 0.6, 0.55, -0.05, frame);
        else for (const y of [7.4, 24.8]) slab(p0, p1, g - 0.6, g + 0.6, y, y + 1.2, 0.08, 0.1, stone);
      }
    }
    if (np && c0 > 12) for (const g of [4.4, L - 4.4]) for (const y of [7.4, 24.8]) slab(p0, p1, g - 0.6, g + 0.6, y, y + 1.2, 0.08, 0.1, stone);
    // 입구
    if (door && door.kind === 'glass') {
      const s0 = doorC - 6, s1 = doorC + 6;
      ops.push({ s: s0, e: s1, b: 0, t: 10.5 }); gaps.push([s0, s1]);
      glazing(p0, p1, s0, s1, 0, 10.5, { inset: 3.5, muls: [s0 + 3, doorC, s1 - 3], rails: [8], revealMat: stone });
      slab(p0, p1, s0 - 1, s1 + 1, 10.5, 12, 0.35, 0.1, stone);                 // 석재 인방
    }
    if (door && door.kind === 'bay') {
      // 입구 베이 남면: 후퇴 유리 현관(8 ft) + 철문 (사진 vp23_259)
      const g0 = 9.5, g1 = 18.5;
      ops.push({ s: g0, e: g1, b: 0, t: 10.8 }); gaps.push([g0, g1]);
      glazing(p0, p1, g0, g1, 0, 10.8, { inset: 4, muls: [g0 + 3, g1 - 3], rails: [7.6], revealMat: brick });
      ops.push({ s: 2.5, e: 6.2, b: 0, t: 7.2 }); gaps.push([2.5, 6.2]);
      slab(p0, p1, 2.5, 6.2, 0, 7.2, -0.3, 0.6, frame);
    }
    P(G.wallSeg(p0, p1, -1, top, { openings: ops }), brick);
    // 띠: 기단(문 구간 제외) / 가는 띠 / 창대 띠 / 코핑
    const cuts = [[0, 0], ...gaps.sort((a, b) => a[0] - b[0]), [L, L]];
    for (let k = 0; k < cuts.length - 1; k++) slab(p0, p1, cuts[k][1], cuts[k + 1][0], -0.5, BASE, 0.25, 0.1, stone);
    slab(p0, p1, 0, L, THIN0, THIN1, 0.15, 0.1, stone);
    slab(p0, p1, 0, L, WIDE0, WIDE1, 0.3, 0.1, stone);
    slab(p0, p1, 0, L, COP0, EAVE, 0.4, 0.1, pre);
    if (isBay) slab(p0, p1, -0.4, L + 0.4, 32.6, 33.9, 0.45, 0.6, pre);       // 베이 파라펫 갓돌
  }
  // 입구 베이 지붕
  P(G.box(23.7, 0.6, 6.4, 757, 32.4, -247.3), M.roof_membrane);

  // ------------------------------------------------------------ 모임지붕 (겹친 직사각 frustum 들 = straight skeleton)
  function hip(x0, x1, z0, z1) {
    const X0 = x0 - OV, X1 = x1 + OV, Z0 = z0 - OV, Z1 = z1 + OV, yE = EAVE - OV * PITCH;
    const run = (TOP - yE) / PITCH, r = Math.min(run, (X1 - X0) / 2, (Z1 - Z0) / 2), yT = yE + r * PITCH;
    const a = [[X0, Z0], [X0, Z1], [X1, Z1], [X1, Z0]];                     // 처마 (CCW)
    const b = [[X0 + r, Z0 + r], [X0 + r, Z1 - r], [X1 - r, Z1 - r], [X1 - r, Z0 + r]];   // 상부
    const pos = [];
    for (let k = 0; k < 4; k++) {
      const A = [a[k][0], yE, a[k][1]], B = [a[(k + 1) % 4][0], yE, a[(k + 1) % 4][1]];
      const C = [b[(k + 1) % 4][0], yT, b[(k + 1) % 4][1]], D = [b[k][0], yT, b[k][1]];
      pos.push(...A, ...C, ...B, ...A, ...D, ...C);                           // 바깥·위를 향하도록
    }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    const uv = []; for (let k = 0; k < pos.length; k += 3) uv.push((pos[k] + pos[k + 2]) / 6, pos[k + 1] / 3);
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.computeVertexNormals();
    // 법선 검사: 아래를 향하면 뒤집기
    if (g.attributes.normal.getY(0) < 0) { const p = g.attributes.position; for (let k = 0; k < p.count; k += 3) { for (const c of ['X', 'Y', 'Z']) { const t = p['get' + c](k + 1); p['set' + c](k + 1, p['get' + c](k + 2)); p['set' + c](k + 2, t); } } g.computeVertexNormals(); }
    P(g, metal);
    const w = (X1 - X0) - 2 * r, dd = (Z1 - Z0) - 2 * r;
    if (w > 0.1 && dd > 0.1) P(G.capGeometry(b, [], yT + 0.02), M.roof_membrane);
    // 처마 홈통(파시아) + 소핏
    const fas = [];
    fas.push(G.box(X1 - X0, 0.6, 0.35, (X0 + X1) / 2, yE - 0.5, Z0), G.box(X1 - X0, 0.6, 0.35, (X0 + X1) / 2, yE - 0.5, Z1));
    fas.push(G.box(0.35, 0.6, Z1 - Z0, X0, yE - 0.5, (Z0 + Z1) / 2), G.box(0.35, 0.6, Z1 - Z0, X1, yE - 0.5, (Z0 + Z1) / 2));
    P(BufferGeometryUtils.mergeGeometries(fas), metal);
    P(G.box(X1 - X0, 0.1, Z1 - Z0, (X0 + X1) / 2, yE - 0.15, (Z0 + Z1) / 2), pre, false);
  }
  hip(515.2, 574.6, -383, -208.4);          // 서측 윙 (북단은 바 안으로)
  hip(496, 590.9, -424.2, -375.1);          // 북서 블록
  hip(574.6, 737.4, -396.8, -322.5);        // 북측 바 (꼭대기 평지붕)
  hip(727.5, 786, -383, -250.2);            // 동측 윙
  // 북측 평지붕 띠 (x 591~703, z -397~-414)
  { const r = G.flatRoof([[591.2, -413.8], [591.2, -396.8], [703.1, -396.8], [703.1, -413.8]], EAVE, { parapet: 1.0, thick: 0.6 });
    P(r.slab, M.roof_gravel); P(r.parapet, pre); }
  // 평지붕 위 환기구·소형 설비
  for (const [x, z] of [[690, -357], [698, -362], [628, -360]]) P(G.cylinder(1.1, 2.2, x, TOP, z, 10), M.metal);
  P(G.box(6, 3, 4, 655, TOP, -359), M.metal);

  const grp = new THREE.Group();
  for (const m of G.mergeByMaterial(parts)) grp.add(m);
  return grp;
}
