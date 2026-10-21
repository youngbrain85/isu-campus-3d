// Chestnut Building (지도 43) — 사진·위성 기반 모델 (도면 없음). 월드 좌표(ft)로 직접 작성.
// 근거: Street View vp5 (N 7th St, 082/127/172 — 서측 입면 전체와 북쪽 무창 매스), Esri z20(겨울)·z19(여름) 위성.
// ■ 층수·높이: 지상 2층 (높은 층고). 사진 vp5_127 근경 수직선 비율로 난간 상단 36 ft 기준:
//   콘크리트 기단 0~6 (반지하 채광 없음), 1층 창 6.5~16.5, 2층 창 21~29.5, 파라펫 갓돌 35.3~36.
// ■ 재료: 짙은 적갈색 벽돌(brick_brown), 석회석 창 둘레(퀸 블록식 들쭉날쭉한 측면 + 인방·창대), 회색 콘크리트 기단, 석재 갓돌.
// ■ 창: 대형 다분할 스틸 창. 1층 = 3연창(창 1개 3.3 ft × 3) 큰 격자창(트랜섬 13.6 + 가로살 4줄), 2층 = 같은 폭의 3연창
//   (가로살 24.0·26.6). 서측 입면 사진 순서: 모서리 근처 단창 → 3연창 반복(≈ 21 ft 간격) → 단창. 다른 면도 같은 규칙으로 가정.
// ■ 평면 (위성): 남측 본관 x 903~1112, z -84~104 (남면 가운데 x 939~1076 은 11 ft 후퇴 — 주출입구 면),
//   북쪽으로 서·동 윙(z -147 까지)과 가운데 윙(x 979~1043) 사이에 좁은 채광정 2개(x 958~979 / 1043~1056, z -141~-84, 지면까지 열림),
//   맨 북쪽 블록 x 958~1056, z -194~-147 은 무창 벽돌 + 석재 띠 2줄(사진 vp5_082 왼쪽의 뒤로 물러난 매스) + 콘크리트 기단·출입문.
// ■ 지붕: 평지붕(어두운 멤브레인) + 난간. 본관 중앙 아트리움 위 3×3 피라미드 천창(위성의 파란 유리, x 976~1040, z -61~3)과
//   그 둘레의 높인 연석 플랫폼, 남쪽 기계 펜트하우스(x 985~1030, z 18~42), 가운데 윙 북단의 높인 부분(x 980~1042, z -166~-141),
//   소형 옥상 설비들(위성 위치).
// ■ 가정: 동·남·채광정 면의 창 배치(사진 없음), 남측 주출입구 형태, 서측 남단 앞 콘크리트 담(사진 vp5_127 오른쪽 끝)의 정확한 위치.
import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

export const meta = {
  id: 'chestnut', name: 'Chestnut Building', osm: 'way/236260172',
  anchor: [0, 0], rotation: 0, height: 45,
  preset: { pos: [650, 150, 80], tgt: [1005, 15, -40] },
  sheets: 'Street View vp5 (2019), Esri imagery z20/z19',
};

const H = 36, ROOFY = 33.6, BASE = 6;
const LOW = [6.5, 16.5], UP = [21, 29.5];
const LW = 3.3, MUL = 0.45;
// 외곽 (site.json 폴리곤 정리, CCW)
const POLY = [[939.3, 103.6], [939.3, 92.7], [1076, 92.1], [1076, 103.1], [1112.6, 103], [1111.6, -147.2], [1055.7, -147], [1055.5, -194],
  [958.3, -193.7], [958.5, -146.6], [902.6, -146.4], [903.6, 103.8]];
const WELLS = [[958.5, 979, -141, -84], [1043, 1055.6, -141, -84]];
const NBLOCK = [6, 7, 8];                                // 북쪽 무창 블록의 변 (POLY 인덱스)

export function build(M, G) {
  const parts = [];
  const P = (geom, mat, cast) => { if (geom) parts.push({ geom, mat, cast }); };
  const brick = M.brick_brown.clone(); brick.color = new THREE.Color(0.78, 0.6, 0.55);   // 사진의 짙은 적갈색
  const stone = M.limestone, frame = M.dark;
  const darkRoof = new THREE.MeshStandardMaterial({ color: 0x3c3f44, roughness: 0.95 });
  const skyGlass = new THREE.MeshStandardMaterial({ color: 0x3f86a8, roughness: 0.25, metalness: 0.35 });

  const dir = (p0, p1) => { const dx = p1[0] - p0[0], dz = p1[1] - p0[1], L = Math.hypot(dx, dz); return { ex: [dx / L, dz / L], ez: [-dz / L, dx / L], L, ry: -Math.atan2(dz, dx) }; };
  const at = (p0, d, s, off) => [p0[0] + d.ex[0] * s - d.ez[0] * off, p0[1] + d.ex[1] * s - d.ez[1] * off];
  const bx = (p0, d, s0, s1, y0, y1, out, inn) => { const c = at(p0, d, (s0 + s1) / 2, (inn - out) / 2); return G.box(s1 - s0, y1 - y0, out + inn, c[0], y0, c[1], { ry: d.ry }); };
  const slab = (p0, p1, s0, s1, y0, y1, out, inn, mat) => { if (s1 - s0 < 0.05) return; P(bx(p0, dir(p0, p1), s0, s1, y0, y1, out, inn), mat); };

  /** 다분할 스틸 창 그룹: nl 개 창, 중심 c, 행 [b,t], 가로살 hs. quoin = 석재 퀸 블록 둘레 */
  function group(p0, p1, c, nl, [b, t], hs, quoin = true) {
    const d = dir(p0, p1), W = nl * LW + (nl - 1) * MUL, s = c - W / 2, e = c + W / 2, inset = 0.7;
    P(G.sideGeometry([at(p0, d, s, inset), at(p0, d, e, inset)], b, t, 1 / LW, 1 / (t - b), false), M.pane, false);
    const fr = [];
    fr.push(bx(p0, d, s, s + 0.2, b, t, -inset + 0.3, inset), bx(p0, d, e - 0.2, e, b, t, -inset + 0.3, inset));       // 외곽 프레임
    for (let k = 0; k < nl - 1; k++) { const x = s + (k + 1) * LW + k * MUL; fr.push(bx(p0, d, x, x + MUL, b, t, -inset + 0.3, inset)); }   // 멀리언
    for (let k = 0; k < nl; k++) { const x = s + k * (LW + MUL) + LW / 2; fr.push(bx(p0, d, x - 0.06, x + 0.06, b, t, -inset + 0.15, inset)); }
    for (const y of [b, ...hs, t]) fr.push(bx(p0, d, s, e, y - 0.07, y + 0.07, -inset + 0.15, inset));
    P(BufferGeometryUtils.mergeGeometries(fr), frame);
    // 개구부 측면 리빌
    P(BufferGeometryUtils.mergeGeometries([bx(p0, d, s - 0.1, s, b, t, 0, inset), bx(p0, d, e, e + 0.1, b, t, 0, inset), bx(p0, d, s, e, t - 0.1, t, 0, inset)]), stone);
    if (quoin) {
      const q = [];
      const n = Math.max(3, Math.round((t - b) / 1.6)), hb = (t - b) / n;
      for (let k = 0; k < n; k++) { const w = k % 2 ? 0.8 : 1.4, y = b + k * hb;
        q.push(bx(p0, d, s - w, s, y + 0.04, y + hb - 0.04, 0.12, 0.05), bx(p0, d, e, e + w, y + 0.04, y + hb - 0.04, 0.12, 0.05)); }
      q.push(bx(p0, d, s - 1.4, e + 1.4, t, t + 0.9, 0.15, 0.05));                 // 인방
      q.push(bx(p0, d, s - 0.6, e + 0.6, b - 0.45, b, 0.3, 0.05));                 // 창대
      P(BufferGeometryUtils.mergeGeometries(q), stone);
    }
    return { s, e, b, t };
  }
  /** 변 하나에 창 배치: 단창 양끝 + 3연창 반복 */
  function layout(L) {
    const g = [];
    if (L >= 44) {
      g.push([8, 1], [L - 8, 1]);
      const n = Math.max(1, Math.round((L - 36) / 21) + 1), p = n > 1 ? (L - 40) / (n - 1) : 0;
      for (let k = 0; k < n; k++) g.push([n > 1 ? 20 + k * p : L / 2, 3]);
    } else if (L >= 20) g.push([L / 2, 3]);
    else if (L >= 9) g.push([L / 2, 1]);
    return g;
  }

  // ------------------------------------------------------------ 외벽
  const n = POLY.length;
  for (let i = 0; i < n; i++) {
    const p0 = POLY[i], p1 = POLY[(i + 1) % n], d = dir(p0, p1), L = d.L;
    const ops = [];
    let gaps = [];
    if (NBLOCK.includes(i)) {
      // 북쪽 무창 블록: 석재 띠 2줄, 서면(변 8 의 반대쪽은 9)… 출입문은 서쪽 면에서 처리
      for (const y of [25.5, 31]) slab(p0, p1, 0, L, y, y + 0.7, 0.2, 0.1, stone);
    } else {
      const isSouthMain = i === 1;                                        // 후퇴한 남면 (x 939~1076)
      for (const [c, nl] of layout(L)) {
        const doorHere = isSouthMain && Math.abs(c - L / 2) < 12;
        ops.push(group(p0, p1, c, nl, UP, [24.0, 26.6]));
        if (!doorHere) ops.push(group(p0, p1, c, nl, LOW, [8.3, 10.1, 11.9, 13.6, 15.0]));
      }
      if (isSouthMain) {
        // 주출입구: 석재 문틀 + 유리문 2조 + 트랜섬
        const c = L / 2, s0 = c - 7, s1 = c + 7;
        ops.push({ s: s0, e: s1, b: 0, t: 16.5 }); gaps = [[s0 - 1.5, s1 + 1.5]];
        group(p0, p1, c, 3, [0, 16.5], [8.5, 13.6], true);
        for (const s of [s0 + 1, c + 0.5]) slab(p0, p1, s, s + 5.5, 0, 8.3, -0.6, 0.9, frame);
        slab(p0, p1, s0 - 3, s1 + 3, 17.4, 18.6, 1.2, 0.1, stone);               // 캐노피형 석재 코니스
        slab(p0, p1, s0 - 5, s1 + 5, -0.1, 0.45, 10, 0, M.walk);                      // 현관 단
      }
    }
    P(G.wallSeg(p0, p1, BASE, H - 0.7, { openings: ops.filter(o => o.t > BASE) }), brick);
    // 기단 (콘크리트): 출입문 구간은 끊김
    const cuts = [[0, 0], ...gaps, [L, L]];
    for (let k = 0; k < cuts.length - 1; k++) slab(p0, p1, cuts[k][1], cuts[k + 1][0], -0.5, BASE, 0.3, 0.2, M.concrete);
    slab(p0, p1, -0.3, L + 0.3, H - 0.7, H, 0.3, 1.2, stone);                       // 갓돌
  }
  // 북쪽 블록 서면 출입문 (변 8: (958.3,-193.7)→(958.5,-146.6), 사진 vp5_082)
  { const p0 = POLY[8], p1 = POLY[9]; slab(p0, p1, 30, 36, 0, 8, -0.2, 0.5, frame); slab(p0, p1, 29.5, 36.5, 8, 8.5, 0.3, 0.1, M.concrete); }

  // ------------------------------------------------------------ 채광정 (지면까지 열린 좁은 중정): 안쪽 벽 + 단창
  for (const [x0, x1, z0, z1] of WELLS) {
    const pts = [[x0, z0], [x1, z0], [x1, z1], [x0, z1]];          // CW (위에서) → 법선이 정 안쪽을 향함
    for (let k = 0; k < 4; k++) {
      const p0 = pts[k], p1 = pts[(k + 1) % 4], L = dir(p0, p1).L, ops = [];
      if (L > 30) for (let c = 9; c < L - 6; c += 12) for (const row of [LOW, UP]) ops.push(group(p0, p1, c, 1, row, row === LOW ? [13.6] : [26.6], false));
      P(G.wallSeg(p0, p1, -0.5, H - 0.7, { openings: ops }), brick);
      slab(p0, p1, 0, L, -0.5, 1.5, 0.15, 0.1, M.concrete);
      slab(p0, p1, -0.3, L + 0.3, H - 0.7, H, 0.3, 1.2, stone);
    }
    P(G.box(x1 - x0, 0.1, z1 - z0, (x0 + x1) / 2, 0.05, (z0 + z1) / 2), M.walk, false);
  }

  // ------------------------------------------------------------ 지붕
  const holes = WELLS.map(([x0, x1, z0, z1]) => [[x0, z0], [x1, z0], [x1, z1], [x0, z1]]);   // 구멍 = CW
  const r = G.flatRoof(POLY, ROOFY, { parapet: 0, thick: 0.6, holes });
  P(r.slab, darkRoof);
  // 난간 안쪽면 (외곽 + 채광정)
  P(G.sideGeometry(G.offsetPoly(POLY, 1.0).slice().reverse(), ROOFY, H - 0.7, 1 / 24, 1 / 12, true), brick);
  for (const h of holes) P(G.sideGeometry(G.offsetPoly([...h].reverse(), -1.0), ROOFY, H - 0.7, 1 / 24, 1 / 12, true), brick);
  const boxXZ = (x0, x1, z0, z1, y0, h, mat) => P(G.box(x1 - x0, h, z1 - z0, (x0 + x1) / 2, y0, (z0 + z1) / 2), mat);
  // 아트리움 천창: 높인 플랫폼 + 3×3 피라미드
  boxXZ(970, 1047, -72, 16, ROOFY, 2.4, M.precast);
  const SX = [976, 997.3, 1018.7], SZ = [-61, -39.7, -18.3], SC = 21.3, YP = ROOFY + 2.4;
  const pyr = [];
  for (const x of SX) for (const z of SZ) {
    const a = [x + 1, z + 1], b = [x + SC - 1, z + SC - 1], m = [(a[0] + b[0]) / 2, YP + 4.5, (a[1] + b[1]) / 2];
    const q = [[a[0], YP, a[1]], [a[0], YP, b[1]], [b[0], YP, b[1]], [b[0], YP, a[1]]];
    for (let k = 0; k < 4; k++) pyr.push(...q[k], ...m, ...q[(k + 1) % 4]);
    boxXZ(x + 0.4, x + SC - 0.4, z + 0.4, z + SC - 0.4, YP, 0.5, frame);
  }
  { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pyr, 3)); g.computeVertexNormals();
    if (g.attributes.normal.getY(0) < 0) { const p = g.attributes.position; for (let k = 0; k < p.count; k += 3) for (const c of ['X', 'Y', 'Z']) { const t = p['get' + c](k + 1); p['set' + c](k + 1, p['get' + c](k + 2)); p['set' + c](k + 2, t); } g.computeVertexNormals(); }
    P(g, skyGlass, false); }
  boxXZ(989, 995, -70, -66, YP, 2.5, M.white); boxXZ(1020, 1026, -70, -66, YP, 2.5, M.white);
  // 기계 펜트하우스 + 가운데 윙 북단 높인 부분
  boxXZ(985, 1030, 18, 42, ROOFY, 9, darkRoof); boxXZ(984.6, 1030.4, 17.6, 42.4, ROOFY + 9, 0.5, stone);
  boxXZ(980, 1042, -166, -141, ROOFY, 5.5, brick); boxXZ(979.6, 1042.4, -166.4, -140.6, ROOFY + 5.5, 0.5, stone);
  boxXZ(990, 997, -160, -154, ROOFY + 6, 2.5, M.white); boxXZ(1023, 1030, -160, -154, ROOFY + 6, 2.5, M.white);
  // 소형 설비 (위성)
  for (const [x, z, w, d] of [[930, -128, 4, 9], [941, -128, 4, 9], [935, -110, 7, 4], [1080, -128, 4, 9], [1091, -128, 4, 9], [1084, -110, 7, 4],
    [1064, 47, 4, 4], [1072, 47, 4, 4], [946, 52, 6, 4], [968, 52, 6, 4], [1000, 52, 6, 4], [1024, 52, 6, 4], [1046, 52, 6, 4], [1068, -40, 5, 5], [935, -40, 5, 5], [935, 20, 5, 5]])
    boxXZ(x - w / 2, x + w / 2, z - d / 2, z + d / 2, ROOFY, 3, M.metal);
  for (const [x, z] of [[985, -186], [997, -186], [1010, -186], [1030, -183]]) P(G.cylinder(2, 3, x, ROOFY, z, 12), M.metal);

  // ------------------------------------------------------------ 서측 남단 앞 콘크리트 담 + 철문 (사진 vp5_127)
  boxXZ(892.5, 893.5, 38, 72, 0, 3.6, M.concrete); boxXZ(892.5, 903, 71, 72, 0, 3.6, M.concrete); boxXZ(892.5, 903, 37.5, 38.5, 0, 3.6, M.concrete);
  boxXZ(892.7, 893.3, 50, 56, 0, 3.4, frame);

  const grp = new THREE.Group();
  for (const m of G.mergeByMaterial(parts)) grp.add(m);
  return grp;
}
