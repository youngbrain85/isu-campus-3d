// Art Annex — 1층 창고형 건물 (사진·위성 기반)
// 근거: Street View vp77 (Spruce St, (-381,-902) 에서 서남서를 봄; 테니스장 너머 동면이 약 200 ft 거리), Esri z20(겨울)/z19(여름).
// 형태: 동서 축의 얕은 둥근 어깨 볼트(끝단은 힙) 금속 지붕을 얹은 단층 창고. 사진에서 동측 끝이 수평 처마 위로 둥근 어깨 실루엣을 보이고
//   (vp77_256), 겨울 위성에서 지붕 남쪽 경사가 북쪽보다 밝다(남향 경사) → 동서 축 볼트로 판단.
//   높이: 처마 16 ft, 정점 24 ft (사진 비례: 거리 ~200 ft, 처마 수평선 위 28 px / 정점 52 px, 카메라 8 ft).
// 볼륨 (OSM 외곽선 분할):
//   [A] 본 홀 x -714..-574.3, z -892.8..-793.6 (99 ft 스팬, 동서 끝 16 ft 는 같은 단면으로 내려오는 힙): 밝은 회색 벽(도장 블록/패널 → concrete), 벽 상부 소형 고창·환기구
//       (사진의 상단 작은 암색 사각형들), 동면 출입문 + 배기 덕트 (위성 동벽의 흰 U 자 덕트), 북면 오버헤드 도어(가정).
//   [B] 남측 린투 x -714..-624.6, z -793.6..-778.3: 골강판 지붕 (위성의 남측 줄무늬 띠), 13 → 11 ft 남향 경사.
//   [C] 남동 별동 x -624.6..-592.4, z -793.6..-758.1: 12 ft 평지붕 (회색), 블록 벽.
//   [D] 북측 돌출부 x -707.2..-668.1, z -908.8..-892.8: 14 ft 평지붕 (겨울 영상에서 본 홀 그림자가 지붕 남단에 걸림 → 본 홀보다 낮음).
//   지붕 설비: 박스형 유닛 3기 (z≈-848), 서측 가장자리 배기 벤트 열, 동측 원형 팬 (위성).
// 가정: 서·북·남면은 사진 없음 → 동면과 같은 재질·고창 리듬. 지붕 재질은 백색 금속(roof_membrane 으로 표현).
import * as THREE from 'three';

export const meta = {
  id: 'artannex', name: 'Art Annex', osm: 'way/956551298',
  anchor: [0, 0], rotation: 0, height: 24,
  preset: { pos: [-340, 150, -1100], tgt: [-644, 12, -840] },
  sheets: 'Street View (vp77 Spruce St), Esri imagery z20/z19',
};

const rect = (x0, x1, z0, z1) => [[x0, z1], [x1, z1], [x1, z0], [x0, z0]];   // CCW (위에서)
function frame(p0, p1) {
  const dx = p1[0] - p0[0], dz = p1[1] - p0[1], len = Math.hypot(dx, dz);
  const ex = [dx / len, dz / len], n = [-dz / len, dx / len];
  return { p0, p1, len, ry: -Math.atan2(dz, dx), at: (s, o = 0) => [p0[0] + ex[0] * s + n[0] * o, p0[1] + ex[1] * s + n[1] * o] };
}
function wbox(parts, F, s0, s1, y0, y1, o0, o1, mat, G, cast = true) {
  const c = F.at((s0 + s1) / 2, (o0 + o1) / 2);
  parts.push({ geom: G.box(s1 - s0, y1 - y0, o1 - o0, c[0], y0, c[1], { ry: F.ry }), mat, cast });
}
function wallOps(parts, F, y0, y1, ops, mat, M, G, { inset = 0.5 } = {}) {
  parts.push({ geom: G.wallSeg(F.p0, F.p1, y0, y1, { openings: ops }), mat });
  for (const o of ops) {
    const d = o.inset ?? inset;
    parts.push({ geom: G.sideGeometry([F.at(o.s, -d), F.at(o.e, -d)], o.b, o.t, 1 / 8, 1 / 8, false), mat: o.glass || M.dark, cast: false });
    wbox(parts, F, o.s, o.s + 0.2, o.b, o.t, -d, 0, mat, G); wbox(parts, F, o.e - 0.2, o.e, o.b, o.t, -d, 0, mat, G);
    wbox(parts, F, o.s, o.e, o.t - 0.2, o.t, -d, 0, mat, G);
  }
}
function tri(parts, a, b, c, mat) {      // 단일 삼각형 (정점 순서 = 반시계가 앞면)
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute([...a, ...b, ...c], 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute([a[0] / 24 + a[2] / 24, a[1] / 12, b[0] / 24 + b[2] / 24, b[1] / 12, c[0] / 24 + c[2] / 24, c[1] / 12], 2));
  g.computeVertexNormals();
  parts.push({ geom: g, mat });
}

/** 둥근 어깨 힙 볼트 높이장 지붕. 벽 외곽 (x0..x1, z0..z1) + 처마 돌출 ov. endLen = 끝단(동서) 경사 길이.
 *  반환 {top (위 법선), under (아래 법선, 0.3 ft 아래)} */
function roundHip(x0, x1, z0, z1, eave, rise, endLen, ov) {
  const xa = x0 - ov, xb = x1 + ov, za = z0 - ov, zb = z1 + ov;
  const zc = (za + zb) / 2, hz = (zb - za) / 2;
  const xs = [], zs = [];
  const NE = 6, NZ = 20;
  for (let i = 0; i <= NE; i++) xs.push(xa + (endLen + ov) * (i / NE) ** 0.8);
  for (let i = NE; i >= 0; i--) xs.push(xb - (endLen + ov) * (i / NE) ** 0.8);
  for (let k = 0; k <= NZ; k++) zs.push(zc + hz * Math.sign(k - NZ / 2) * Math.abs((k - NZ / 2) / (NZ / 2)) ** 0.8);
  const H = (x, z) => {
    const tz = Math.abs(z - zc) / hz;
    const tx = Math.max(0, Math.max(xa + endLen + ov - x, x - (xb - endLen - ov)) / (endLen + ov));
    const t = Math.min(1, Math.max(tz, tx));
    return eave - 0.3 + rise * Math.pow(1 - t * t, 0.6);
  };
  const pos = [], uv = [];
  for (let i = 0; i < xs.length - 1; i++) for (let k = 0; k < zs.length - 1; k++) {
    const P = (a, b) => [xs[a], H(xs[a], zs[b]), zs[b]];
    const A = P(i, k), B = P(i + 1, k), C = P(i + 1, k + 1), D = P(i, k + 1);
    pos.push(...A, ...D, ...C, ...A, ...C, ...B);
    for (const q of [A, D, C, A, C, B]) uv.push(q[0] / 24, q[2] / 12);
  }
  const top = new THREE.BufferGeometry();
  top.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  top.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  top.computeVertexNormals();
  const pu = [];
  for (let i = 0; i < pos.length; i += 9) pu.push(pos[i], pos[i + 1] - 0.3, pos[i + 2], pos[i + 6], pos[i + 7] - 0.3, pos[i + 8], pos[i + 3], pos[i + 4] - 0.3, pos[i + 5]);
  const under = new THREE.BufferGeometry();
  under.setAttribute('position', new THREE.Float32BufferAttribute(pu, 3));
  under.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  under.computeVertexNormals();
  return { top, under };
}

export function build(M, G) {
  const parts = [];
  const wall = M.concrete;
  const X0 = -714, X1 = -574.3, Z0 = -892.8, Z1 = -793.6, EAVE = 16, RISE = 8;
  const zc = (Z0 + Z1) / 2, half = (Z1 - Z0) / 2;

  // ================= [A] 본 홀 =================
  // 지붕: 둥근 어깨의 "힙 볼트" — 동서 끝도 같은 단면으로 내려옴 (사진에서 동측 끝벽 상단이 수평 처마선이고 그 위가 전부 흰 지붕,
  //       z19 위성에서 동·서 끝 15 ft 띠가 다른 경사로 보임). 높이장 y = EAVE + RISE·(1 − max(tz, tx)²)^0.6
  {
    const hv = roundHip(X0, X1, Z0, Z1, EAVE, RISE, 16, 1.2);
    parts.push({ geom: hv.top, mat: M.roof_membrane });
    parts.push({ geom: hv.under, mat: M.metal, cast: false });
    for (const z of [Z0 - 1.0, Z1 + 1.0]) parts.push({ geom: G.box(X1 - X0 + 2.4, 0.6, 0.6, (X0 + X1) / 2, EAVE - 0.7, z), mat: M.trim });   // 홈통
    for (const x of [X0 - 1.0, X1 + 1.0]) parts.push({ geom: G.box(0.6, 0.6, Z1 - Z0 + 2.4, x, EAVE - 0.7, (Z0 + Z1) / 2), mat: M.trim });
  }
  {
    const A = rect(X0, X1, Z0, Z1);   // SW, SE, NE, NW
    // 남면 (z=Z1): 서측 63% 는 린투에 가림 → 상부(13..16)만 고창
    const Fs = frame(A[0], A[1]);
    const opsS = []; for (let s = 8; s < Fs.len - 4; s += 18) opsS.push({ s, e: s + 3.5, b: 13.4, t: 15.2 });
    wallOps(parts, Fs, 0, EAVE, opsS, wall, M, G);
    // 동면 (x=X1, z Z1 → Z0): 문, 덕트, 상부 소형 개구 (vp77_256)
    const Fe = frame(A[1], A[2]);
    const opsE = [{ s: 30, e: 33.5, b: 0, t: 7.2, glass: M.dark, inset: 0.3 }];
    for (const s of [8, 26, 46, 64, 82]) opsE.push({ s, e: s + 3.2, b: 12.6, t: 14.8 });
    wallOps(parts, Fe, 0, EAVE, opsE, wall, M, G);
    wbox(parts, Fe, 29.5, 34, 7.2, 7.8, 0, 2.5, M.metal, G);                          // 문 위 소형 캐노피
    wbox(parts, Fe, 47, 49.5, 0, 22, 0, 2.5, M.metal, G);                             // 배기 덕트 (지붕까지)
    wbox(parts, Fe, 44, 52, 0, 0.2, 0, 5, M.walk, G, false);
    // 북면 (z=Z0, x X1 → X0): 오버헤드 도어 2 + 고창 (가정), 북측 돌출부 [D] 구간 포함
    const Fn = frame(A[2], A[3]);
    const opsN = [{ s: 20, e: 32, b: 0, t: 12, glass: M.metal, inset: 0.4 }, { s: 50, e: 62, b: 0, t: 12, glass: M.metal, inset: 0.4 }];
    for (let s = 8; s < 92; s += 18) if (s < 18 || s > 64) opsN.push({ s, e: s + 3.5, b: 13.4, t: 15.2 });
    wallOps(parts, Fn, 0, EAVE, opsN, wall, M, G);
    for (const s of [20, 50]) for (let y = 1.5; y < 12; y += 1.5) wbox(parts, Fn, s, s + 12, y, y + 0.12, -0.4, -0.3, M.dark, G, false);   // 도어 패널 줄
    for (const s of [20, 50]) wbox(parts, Fn, s - 3, s + 15, -0.4, 0.15, 0, 14, M.walk, G, false);                              // 앞 콘크리트 에이프런
    // 서면 (x=X0, z Z0 → Z1)
    const Fw = frame(A[3], A[0]);
    const opsW = [{ s: 70, e: 73.5, b: 0, t: 7.2, glass: M.dark, inset: 0.3 }];
    for (const s of [10, 28, 46, 82]) opsW.push({ s, e: s + 3.2, b: 12.6, t: 14.8 });
    wallOps(parts, Fw, 0, EAVE, opsW, wall, M, G);
  }

  // ================= [B] 남측 린투 (골강판 지붕) =================
  {
    const xa = -714, xb = -624.6, za = Z1, zb = -778.3, yA = 13, yB = 11;
    const g = new THREE.BufferGeometry();
    const A = [xa - 0.8, yA, za], B = [xb + 0.8, yA, za], C = [xb + 0.8, yB, zb + 1], D = [xa - 0.8, yB, zb + 1];
    g.setAttribute('position', new THREE.Float32BufferAttribute([...A, ...D, ...C, ...A, ...C, ...B], 3));
    const L = (xb - xa) / 2, W = (zb - za) / 6;
    g.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, 0, W, L, W, 0, 0, L, W, L, 0], 2));
    g.computeVertexNormals();
    parts.push({ geom: g, mat: M.metal });
    // 벽: 남(z=zb) 서(x=xa) 동(x=xb)
    const Fs = frame([xa, zb], [xb, zb]);
    const ops = [{ s: 12, e: 15.5, b: 0, t: 7.2, glass: M.dark, inset: 0.3 }, { s: 40, e: 50, b: 0, t: 9, glass: M.metal, inset: 0.4 }];
    for (const s of [25, 60, 75]) ops.push({ s, e: s + 4, b: 5, t: 8, glass: M.pane });
    wallOps(parts, Fs, 0, yB, ops, wall, M, G);
    for (let y = 1.5; y < 9; y += 1.5) wbox(parts, Fs, 40, 50, y, y + 0.12, -0.4, -0.3, M.dark, G, false);
    parts.push({ geom: G.sideGeometry([[xa, za], [xa, zb]], 0, yB, 1 / 24, 1 / 12, false), mat: wall });
    tri(parts, [xa, yB, zb], [xa, yA, za], [xa, yB, za], wall);
    parts.push({ geom: G.sideGeometry([[xb, zb], [xb, za]], 0, yB, 1 / 24, 1 / 12, false), mat: wall });
    tri(parts, [xb, yB, zb], [xb, yB, za], [xb, yA, za], wall);
    parts.push({ geom: G.box(xb - xa, 0.5, 0.6, (xa + xb) / 2, yB - 0.5, zb + 1.2), mat: M.trim });   // 홈통
  }

  // ================= [C] 남동 별동 (12 ft 평지붕) =================
  {
    const C = rect(-624.6, -592.4, -793.6, -758.1);
    for (let i = 0; i < 4; i++) {
      if (i === 2) continue;                                           // 북면은 본 홀과 접함
      const F = frame(C[i], C[(i + 1) % 4]);
      const ops = i === 0 ? [{ s: 6, e: 16, b: 0, t: 9.5, glass: M.metal, inset: 0.4 }, { s: 22, e: 25.5, b: 0, t: 7.2, glass: M.dark, inset: 0.3 }]
        : i === 1 ? [{ s: 10, e: 14, b: 5, t: 8, glass: M.pane }, { s: 22, e: 26, b: 5, t: 8, glass: M.pane }] : [{ s: 15, e: 18.5, b: 0, t: 7.2, glass: M.dark, inset: 0.3 }];
      wallOps(parts, F, 0, 12, ops, wall, M, G);
      if (i === 0) for (let y = 1.5; y < 9.5; y += 1.5) wbox(parts, F, 6, 16, y, y + 0.12, -0.4, -0.3, M.dark, G, false);
    }
    const r = G.flatRoof(C, 12, { parapet: 0.8, thick: 0.6 });
    parts.push({ geom: r.slab, mat: M.roof_gravel }); parts.push({ geom: r.parapet, mat: M.trim });
    parts.push({ geom: G.box(6, 3, 5, -606, 12, -775), mat: M.metal });
  }

  // ================= [D] 북측 돌출부 (14 ft) =================
  {
    const D = rect(-707.2, -668.1, -908.8, Z0);
    for (let i = 1; i < 4; i++) {
      const F = frame(D[i], D[(i + 1) % 4]);
      const ops = i === 2 ? [{ s: 8, e: 11.5, b: 0, t: 7.2, glass: M.dark, inset: 0.3 }, { s: 20, e: 30, b: 0, t: 10, glass: M.metal, inset: 0.4 }] : [];
      wallOps(parts, F, 0, 14, ops, wall, M, G);
    }
    const r = G.flatRoof(D, 14, { parapet: 0.8, thick: 0.6 });
    parts.push({ geom: r.slab, mat: M.roof_membrane }); parts.push({ geom: r.parapet, mat: M.trim });
  }

  // ================= 지붕 설비 (위성) =================
  const yAt = z => { const v = (z - zc) / (half + 1.2); return EAVE + RISE * Math.pow(Math.max(0, 1 - v * v), 0.6); };
  for (const x of [-685.3, -645.7, -605.1]) parts.push({ geom: G.box(6.5, 3.5, 5.5, x, yAt(-847.6) - 0.3, -847.6), mat: M.metal });
  for (const z of [-880, -872, -864, -856, -848]) parts.push({ geom: G.cylinder(0.6, 3, -709, yAt(z) - 0.5, z, 8), mat: M.metal });
  parts.push({ geom: G.cylinder(2.2, 2.5, -597, yAt(-838) - 0.3, -838, 12), mat: M.metal });
  for (const [x, z] of [[-640, -880], [-616, -815], [-693, -825], [-680, -815]]) parts.push({ geom: G.cylinder(0.5, 2, x, yAt(z) - 0.3, z, 6), mat: M.metal });

  const grp = new THREE.Group();
  for (const m of G.mergeByMaterial(parts)) grp.add(m);
  return grp;
}
