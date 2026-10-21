// 서비스 건물 2동 — 사진·위성 기반 모델 (도면 없음)
// [1] Recycle Center (way/545275297, 9th St 동측, x 1579..1712, z -344..-251)
//   근거: Esri z20(겨울)·z19(여름) 위성만 사용. Street View vp70 (Chestnut St, 남쪽 470 ft) 은 Ballyhoo 건물에 가려
//     이 건물이 보이지 않음 → 입면은 전부 가정.
//   볼륨: 북측 동(z -344..-300, x 1579..1712) = 갈색 골강판 저경사 박공(동서 용마루 z≈-322, 위성에서 남/북 경사면 명암 차와
//     용마루 선의 볼트 점열로 읽음) 의 금속 창고, 처마 16 ft · 용마루 19.7 ft (2:12).
//     남측 동(z -300..-251, x 1580..1679) = 백색 멤브레인 평지붕(위성 RGB ≈ 250) 1층 벽돌 블록, 파라펫 상단 16 ft.
//   재료(가정): 남측 동 = 갈색 벽돌 + 콘크리트 기초, 북측 동 = 베이지 골 금속패널 + 하부 4 ft 벽돌 허리벽.
//   입면(가정): 서면(9th St) 남측 동에 유리문+창 3개(사무/접수), 북측 동 동면(마당)에 오버헤드 도어 2개,
//     남면(재활용 수거함이 놓인 마당, 위성의 파란 카트 열) 에 오버헤드 도어 1개 + 출입문. 옥상 소형 배기구 2개(위성 점).
// [2] University Grounds / Maintenance Department (way/1464427781, 8th St·Spruce St 북서 모서리, x 1116..1209, z -1241..-1191)
//   근거: Street View vp84 (1244,-1157) 의 261/306/351 방향 3장 + Esri z20/z19.
//   층수 2, 층고 13 ft, 파라펫(코핑) 상단 27 ft (문 높이 7 ft 대비 벽 높이 ≈ 3.8배, 창 2단).
//   재료: 버프(황갈)색 벽돌 전면, 하부 2.5 ft 회색 콘크리트 기단 띠, 상단 짙은 갈색 금속 코핑, 짙은 갈색 홈통(남면 3개).
//   창: 4 × 5 ft 짙은 프레임 펀치창. 하단 창대 6.5 ft, 상단 창대 18.3 ft (사진 비례).
//     남면(e3): 창 2열(x≈1138, 1188) × 2단, 출입문 1개(x≈1156), 남동 모서리 근처 1층 루버(x≈1203). 홈통 x≈1128, 1164, 1195.
//     동면(e0, 8th St 쪽): 창 2열(z≈-1203, -1216) × 2단.
//   지붕: 짙은 회색 평지붕, 북서 모서리 근처 RTU(위성 밝은 회색 박스 8×10 ft), 배기구 6개(위성 흰 점), 남동 모서리 소형 배기통(사진).
//   가정(사진에 없음): 서면(주차장 쪽) 창 3열 × 2단 + 출입문, 북면(작업 마당) 오버헤드 도어 2개 + 출입문.
//     사진 원경의 시계탑 건물은 Power Plant(power_plant.js) 로 따로 모델링.
import * as THREE from 'three';

export const meta = {
  id: 'service', name: 'Recycle Center + University Grounds / Maintenance', osm: 'way/545275297', extraIds: ['way/1464427781'],
  anchor: [0, 0], rotation: 0, height: 27.5,
  preset: { pos: [1880, 150, -40], tgt: [1645, 10, -298] },
  sheets: 'Street View vp84 (2019), Esri imagery z20/z19',
};

// ---- 헬퍼 ----
const UP = new THREE.Vector3(0, 1, 0);
/** 벽 p0→p1 의 기저: ex = 진행, ez = 바깥 법선, len, ry */
function basis(p0, p1) {
  const dx = p1[0] - p0[0], dz = p1[1] - p0[1], len = Math.hypot(dx, dz);
  return { ex: [dx / len, dz / len], ez: [-dz / len, dx / len], len, ry: -Math.atan2(dz, dx) };
}
/** 벽면 위 점 (s, 바깥으로 o) */
function at(p0, B, s, o = 0) { return [p0[0] + B.ex[0] * s + B.ez[0] * o, p0[1] + B.ex[1] * s + B.ez[1] * o]; }
/** 벽면에 붙는 박스: s 중심, 폭 w, 높이 y..y+h, 두께 d, 바깥으로 o 만큼 (o = 박스 중심) */
function wbox(parts, G, p0, B, s, w, y, h, d, o, mat, cast = true) {
  const c = at(p0, B, s, o);
  parts.push({ geom: G.box(w, h, d, c[0], y, c[1], { ry: B.ry }), mat, cast });
}
/**
 * 개구가 있는 벽 한 장. ops: [{s, w, b, h, k}] k = 'win' | 'door' | 'ovh'(오버헤드) | 'louvre' | 'store'(유리문)
 * 개구 안쪽 inset 위치에 채움면(유리/문짝), 창에는 프리캐스트 창대 + 짙은 프레임.
 */
function face(parts, M, G, p0, p1, y0, y1, mat, ops, { sillMat = null, frame = null } = {}) {
  const B = basis(p0, p1);
  parts.push({ geom: G.wallSeg(p0, p1, y0, y1, { openings: ops.map(o => ({ s: o.s - o.w / 2, e: o.s + o.w / 2, b: o.b, t: o.b + o.h })) }), mat });
  const fr = frame || M.dark;
  for (const o of ops) {
    const q0 = at(p0, B, o.s - o.w / 2, -0.45), q1 = at(p0, B, o.s + o.w / 2, -0.45);
    const fill = o.k === 'win' || o.k === 'store' ? M.pane : o.k === 'ovh' ? M.trim : o.k === 'louvre' ? M.metal : M.dark;
    parts.push({ geom: G.sideGeometry([q0, q1], o.b, o.b + o.h, 1 / o.w, 1 / o.h, false), mat: fill, cast: false });
    // 개구 옆면(리빌) — 벽 두께 표현
    for (const ss of [o.s - o.w / 2, o.s + o.w / 2]) wbox(parts, G, p0, B, ss, 0.12, o.b, o.h, 0.45, -0.22, fr, false);
    wbox(parts, G, p0, B, o.s, o.w, o.b + o.h - 0.12, 0.12, 0.45, -0.22, fr, false);
    if (o.k === 'win') {
      wbox(parts, G, p0, B, o.s, o.w + 0.6, o.b - 0.35, 0.35, 0.7, 0.1, sillMat || M.precast);        // 창대
      wbox(parts, G, p0, B, o.s, 0.15, o.b, o.h, 0.15, -0.35, fr, false);                               // 세로 멀리언
    } else if (o.k === 'store') {
      for (const f of [-0.25, 0, 0.25]) wbox(parts, G, p0, B, o.s + f * o.w, 0.25, o.b, o.h, 0.25, -0.3, fr, false);
      wbox(parts, G, p0, B, o.s, o.w, o.b + o.h - 2, 0.25, 0.25, -0.3, fr, false);                       // 트랜섬
    } else if (o.k === 'ovh') {
      for (let y = o.b + 2; y < o.b + o.h - 0.5; y += 2) wbox(parts, G, p0, B, o.s, o.w - 0.2, y, 0.12, 0.1, -0.4, M.metal, false);   // 패널 줄눈
    } else if (o.k === 'louvre') {
      for (let y = o.b + 0.3; y < o.b + o.h; y += 0.4) wbox(parts, G, p0, B, o.s, o.w - 0.1, y, 0.08, 0.2, -0.35, M.dark, false);
    }
    if (o.k === 'door' || o.k === 'store' || o.k === 'ovh') wbox(parts, G, p0, B, o.s, o.w + 3, 0, 0.4, 4, 2, M.walk, false);   // 문 앞 패드
  }
  return B;
}
/**
 * 경사 지붕 로프트: bot(처마 폴리곤, CCW) → top(같은 개수, 용마루 점들) 을 잇는다. 수직면(박공)은 gableMat.
 * 법선은 바깥·위. 아래면(처마 밑) 은 capGeometry 로 따로 막는다.
 */
function pitchRoof(parts, bot, top, yB, yT, roofMat, gableMat, { soffit = true } = {}) {
  const n = bot.length;
  const P = { roof: [], gable: [] };
  for (let i = 0; i < n; i++) {
    const a = bot[i], b = bot[(i + 1) % n], ta = top[i], tb = top[(i + 1) % n];
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const nx = -(b[1] - a[1]) / L, nz = (b[0] - a[0]) / L;
    const off = Math.max(Math.abs((ta[0] - a[0]) * nx + (ta[1] - a[1]) * nz), Math.abs((tb[0] - a[0]) * nx + (tb[1] - a[1]) * nz));
    const tgt = off < 0.05 ? P.gable : P.roof;
    tgt.push([a[0], yB, a[1], b[0], yB, b[1], tb[0], yT, tb[1]]);
    if (Math.hypot(tb[0] - ta[0], tb[1] - ta[1]) > 1e-6) tgt.push([a[0], yB, a[1], tb[0], yT, tb[1], ta[0], yT, ta[1]]);
  }
  const mk = (tris) => {
    const pos = [], uv = [];
    for (const t of tris) {
      pos.push(...t);
      // 피트 기반 UV: 수평 거리(u) × 높이/경사 거리(v)
      for (let k = 0; k < 3; k++) uv.push((t[k * 3] + t[k * 3 + 2]) / 24, t[k * 3 + 1] / 12);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    g.computeVertexNormals();
    return g;
  };
  if (P.roof.length) parts.push({ geom: mk(P.roof), mat: roofMat });
  if (P.gable.length) parts.push({ geom: mk(P.gable), mat: gableMat });
  if (soffit) parts.push({ geom: downCap(bot, yB), mat: gableMat, cast: false });
}
/** 아래를 향하는 수평면 (처마 밑·캐노피 밑) */
function downCap(poly, y) {
  const g = new THREE.ShapeGeometry(new THREE.Shape(poly.map(p => new THREE.Vector2(p[0], -p[1]))));
  g.rotateX(-Math.PI / 2); g.translate(0, y, 0);
  const idx = g.index.array; for (let i = 0; i < idx.length; i += 3) { const t = idx[i + 1]; idx[i + 1] = idx[i + 2]; idx[i + 2] = t; }
  const nr = g.attributes.normal; for (let i = 0; i < nr.count; i++) nr.setY(i, -nr.getY(i));
  return g;
}
const rectCCW = (x0, x1, z0, z1) => [[x0, z1], [x1, z1], [x1, z0], [x0, z0]];   // 남서→남동→북동→북서 (위에서 CCW)

export function build(M, G) {
  const parts = [];
  recycleCenter(parts, M, G);
  groundsBldg(parts, M, G);
  const grp = new THREE.Group();
  for (const m of G.mergeByMaterial(parts)) grp.add(m);
  return grp;
}

// ================= [1] Recycle Center =================
function recycleCenter(parts, M, G) {
  const brick = M.brick_brown;
  const panel = M.metal.clone(); panel.color = new THREE.Color(1.25, 1.17, 1.0); panel.roughness = 0.6; panel.metalness = 0.25;   // 베이지 골강판
  const roofBrown = M.metal.clone(); roofBrown.color = new THREE.Color(0.62, 0.42, 0.32); roofBrown.roughness = 0.7; roofBrown.metalness = 0.2;   // 갈색 강판 지붕
  const coping = M.dark;
  // ---- 남측 동 (평지붕 벽돌) — OSM 꼭짓점 사용
  const S = [[1580.2, -251.4], [1679.2, -252.4], [1678.7, -300.3], [1579.7, -300.3]];   // CCW: 남서→남동→북동→북서
  const PH = 16;
  // e0 남면: 오버헤드 도어 1 + 출입문 + 창 2
  face(parts, M, G, S[0], S[1], 0, PH, brick, [
    { s: 22, w: 5, b: 3, h: 4, k: 'win' }, { s: 34, w: 3.5, b: 0, h: 7.5, k: 'door' },
    { s: 62, w: 12, b: 0, h: 12, k: 'ovh' }, { s: 84, w: 5, b: 3, h: 4, k: 'win' },
  ]);
  // e1 동면(남측 동 동쪽 끝, 마당): 출입문 1
  face(parts, M, G, S[1], S[2], 0, PH, brick, [{ s: 30, w: 3.5, b: 0, h: 7.5, k: 'door' }]);
  // e3 서면(9th St): 유리 출입문(가운데) + 창 3
  face(parts, M, G, S[3], S[0], 0, PH, brick, [
    { s: 8, w: 6, b: 3, h: 5, k: 'win' }, { s: 18, w: 6, b: 3, h: 5, k: 'win' },
    { s: 30, w: 7, b: 0, h: 9, k: 'store' }, { s: 41, w: 6, b: 3, h: 5, k: 'win' },
  ]);
  // 출입 캐노피 (서면, 금속 차양)
  { const B = basis(S[3], S[0]); wbox(parts, G, S[3], B, 30, 12, 9.6, 0.6, 5, 2.5, coping); }
  // 기단 띠 + 평지붕 + 금속 코핑
  parts.push({ geom: G.sideGeometry(G.offsetPoly(S, -0.15), 0, 1.2, 1 / 24, 1 / 12, true), mat: M.concrete });
  const r = G.flatRoof(S, PH, { parapet: 0, thick: 0.8 });
  parts.push({ geom: r.slab, mat: M.roof_membrane });
  parts.push({ geom: G.sideGeometry(G.offsetPoly(S, -0.25), PH - 0.6, PH + 0.3, 1 / 24, 1 / 12, true), mat: coping });
  parts.push({ geom: G.sideGeometry(G.offsetPoly(S, 0.6), PH, PH + 0.3, 1 / 24, 1 / 12, true), mat: coping });   // 코핑 안쪽 면 (파라펫 표현)
  for (const [x, z] of [[1600, -282], [1650, -275]]) parts.push({ geom: G.cylinder(1.0, 2.5, x, PH, z, 10), mat: M.metal });   // 옥상 배기구
  parts.push({ geom: G.box(6, 3.5, 5, 1662, PH, -290), mat: M.metal });        // 소형 RTU (위성 점)

  // ---- 북측 동 (금속 창고, 박공) — OSM 꼭짓점
  const N = [[1579.7, -300.3], [1711.6, -300.6], [1711.1, -344.4], [1579.3, -343.1]];   // 남서→남동→북동→북서
  const EAVE = 16, RIDGE = 16 + 22 * 2 / 12, WAIN = 4;
  const nOps = [
    [], // e0 남면 — 서쪽은 남측 동과 붙음, 동쪽 노출 구간(x 1679..1712) 에 출입문
    [{ s: 12, w: 12, b: WAIN - 4, h: 12, k: 'ovh' }, { s: 30, w: 12, b: 0, h: 12, k: 'ovh' }],   // e1 동면
    [{ s: 30, w: 3.5, b: 0, h: 7.5, k: 'door' }, { s: 80, w: 3.5, b: 0, h: 7.5, k: 'door' }],      // e2 북면 (주차장)
    [{ s: 22, w: 5, b: 4.5, h: 4, k: 'win' }],                                                      // e3 서면 (9th St)
  ];
  for (let i = 0; i < 4; i++) {
    let p0 = N[i], p1 = N[(i + 1) % 4];
    let ops = nOps[i];
    if (i === 0) { p0 = [1679, -300.4]; ops = [{ s: 18, w: 3.5, b: 0, h: 7.5, k: 'door' }]; }        // 남측 동 지붕 위는 아래에서 따로
    // 허리벽 벽돌 (문 구간은 개구)
    const wops = ops.filter(o => o.b < WAIN).map(o => ({ ...o }));
    const B = basis(p0, p1);
    parts.push({ geom: G.wallSeg(p0, p1, 0, WAIN, { openings: wops.map(o => ({ s: o.s - o.w / 2, e: o.s + o.w / 2, b: 0, t: WAIN })) }), mat: brick });
    face(parts, M, G, p0, p1, WAIN, EAVE, panel, ops.map(o => ({ ...o })));
    wbox(parts, G, p0, B, B.len / 2, B.len, WAIN, 0.25, 0.4, 0.1, M.trim);       // 허리벽 플래싱
  }
  // 남측 동 지붕 위로 드러나는 북측 동 남벽 (x 1580..1679, y 16..16.3) 은 무시 (처마 높이 동일)
  // 박공 지붕: 남·북 처마 1.2 ft 돌출, 동·서는 벽면에서 박공 삼각형 (금속패널)
  const roofPoly = [[1579.5, -299.1], [1711.6, -299.4], [1711.4, -345.6], [1579.3, -344.3]];
  const zm = -322.2;
  pitchRoof(parts, roofPoly, [[1579.5, zm], [1711.5, zm], [1711.5, zm], [1579.4, zm]], EAVE, RIDGE, roofBrown, panel);
  // 처마 파시아 (흰색)
  parts.push({ geom: G.sideGeometry(roofPoly, EAVE - 0.7, EAVE, 1 / 24, 1 / 12, true), mat: M.white });
  // 용마루 캡 + 용마루 배기구(위성 점열)
  parts.push({ geom: G.box(134.7, 0.4, 1.2, 1645.4, RIDGE - 0.05, -322.2), mat: roofBrown });
  for (let x = 1590; x < 1710; x += 16) parts.push({ geom: G.cylinder(0.6, 1.2, x, RIDGE - 0.3, -322.2, 8), mat: M.metal });
  // 마당 쪽 재활용 수거 카트 열 (위성의 파란 점, 남측) — 낮은 박스
  const blue = new THREE.MeshStandardMaterial({ color: 0x2d5fb0, roughness: 0.7 });
  for (let i = 0; i < 6; i++) for (let j = 0; j < 3; j++) parts.push({ geom: G.box(3.2, 3.8, 3.2, 1665 + i * 4.2, 0, -246 + j * 4), mat: blue });
}

// ================= [2] Grounds / Maintenance =================
function groundsBldg(parts, M, G) {
  const brick = M.brick_tan.clone(); brick.color = new THREE.Color(1.08, 0.93, 0.78);   // 사진의 주황빛 버프 벽돌
  const TOP = 27, BASE = 2.5;
  const P = [[1209.2, -1192.4], [1208.4, -1242.0], [1116.1, -1240.5], [1116.9, -1190.9]];   // OSM: 남동→북동→북서→남서 (CCW)
  const S1 = 6.5, S2 = 18.3, WH = 4.8, WW = 4;
  const win = (s) => [{ s, w: WW, b: S1, h: WH, k: 'win' }, { s, w: WW, b: S2, h: WH, k: 'win' }];
  const ops = [
    /* e0 동면 (남→북) */[...win(10.6), ...win(23.6)],
    /* e1 북면 (동→서) */[{ s: 22, w: 12, b: BASE, h: 11.5, k: 'ovh' }, { s: 40, w: 12, b: BASE, h: 11.5, k: 'ovh' }, { s: 56, w: 3.5, b: BASE, h: 7.2, k: 'door' }, ...win(72), ...win(84)],
    /* e2 서면 (북→남) */[...win(10), ...win(25), { s: 33, w: 3.5, b: BASE, h: 7.2, k: 'door' }, ...win(40)],
    /* e3 남면 (서→동) */[...win(21), { s: 39, w: 3.5, b: BASE, h: 7.2, k: 'door' }, ...win(71), { s: 86, w: 2.4, b: 7.2, h: 1.8, k: 'louvre' }],
  ];
  // 오버헤드 도어/문은 기단 띠까지 뚫는다 → 기단을 벽마다 개구 포함 wallSeg 로
  for (let i = 0; i < 4; i++) {
    const p0 = P[i], p1 = P[(i + 1) % 4];
    const B = face(parts, M, G, p0, p1, BASE, TOP, brick, ops[i].map(o => o.k === 'win' || o.k === 'louvre' ? o : { ...o, b: 0, h: o.h + BASE }));
    const low = ops[i].filter(o => o.k !== 'win' && o.k !== 'louvre').map(o => ({ s: o.s - o.w / 2, e: o.s + o.w / 2, b: 0, t: BASE }));
    // 기단: 0.15 ft 돌출된 회색 콘크리트 띠
    const q0 = at(p0, B, -0.15, 0.15), q1 = at(p0, B, B.len + 0.15, 0.15);
    parts.push({ geom: G.wallSeg(q0, q1, 0, BASE, { openings: low.map(o => ({ ...o, s: o.s + 0.15, e: o.e + 0.15 })) }), mat: M.concrete });
    wbox(parts, G, p0, B, B.len / 2, B.len + 0.3, BASE, 0.2, 0.35, 0.05, M.concrete);       // 기단 갓
    // 코핑 (짙은 갈색 금속, 0.25 돌출)
    wbox(parts, G, p0, B, B.len / 2, B.len + 0.5, TOP - 0.6, 0.6, 1.2, -0.35, M.dark);
  }
  // 남면 홈통 3개 (짙은 갈색)
  { const B = basis(P[3], P[0]); for (const s of [11, 47, 78]) wbox(parts, G, P[3], B, s, 0.45, 0.5, TOP - 1, 0.45, 0.25, M.dark); }
  { const B = basis(P[1], P[2]); for (const s of [8, 64]) wbox(parts, G, P[1], B, s, 0.45, 0.5, TOP - 1, 0.45, 0.25, M.dark); }
  // 지붕 (짙은 회색) + 파라펫 안쪽
  const r = G.flatRoof(P, TOP - 1.2, { parapet: 0, thick: 0.6 });
  parts.push({ geom: r.slab, mat: M.roof_dark });
  parts.push({ geom: G.sideGeometry([...G.offsetPoly(P, 0.9)].reverse(), TOP - 1.2, TOP, 1 / 24, 1 / 12, true), mat: M.dark, cast: false });
  // RTU (북서), 배기구 6, 남동 배기통
  parts.push({ geom: G.box(8, 4, 10, 1123, TOP - 1.2, -1230), mat: M.metal });
  parts.push({ geom: G.box(8.4, 0.3, 10.4, 1123, TOP + 2.8, -1230), mat: M.trim });
  for (const [x, z] of [[1132, -1236], [1167, -1236], [1162, -1218], [1205, -1224], [1205, -1200], [1121, -1216]])
    parts.push({ geom: G.cylinder(0.7, 1.6, x, TOP - 1.2, z, 8), mat: M.white });
  parts.push({ geom: G.cylinder(0.45, 4, 1203, TOP - 1.2, -1196, 8), mat: M.metal });
  // 남면 보도 + 북측 작업 마당 콘크리트 에이프런
  parts.push({ geom: G.capGeometry(rectCCW(1112, 1214, -1191, -1185), [], 0.12), mat: M.walk, cast: false });
  parts.push({ geom: G.capGeometry(rectCCW(1116, 1209, -1262, -1241.5), [], 0.1), mat: M.walk, cast: false });
}
