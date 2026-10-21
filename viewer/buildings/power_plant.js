// Power Plant (ISU 중앙 열원/발전 플랜트, 2001, 9th St·Tippecanoe 부근) — 위성 + 원경 사진 기반 모델 (도면 없음)
// 근거: Esri z20(겨울, 비스듬히 기울어짐)·z19(여름, 거의 수직) 위성 크롭 (scratch/power/grid_*.png, wide_z19.png),
//   Street View vp84 (8th St·Spruce St, Grounds 건물 너머 원경) 의 261/306 방향 사진 확대 (scratch/power/z261_plant.png, z306_plant.png):
//   주황빛 적갈 벽돌 + 황갈 프리캐스트 띠(물끊기·층간·처마 프리즈), 회색 강판 모임지붕, 2층 모서리 큰 짙은 창,
//   모서리 벽돌 피어·루버 사이에 시계판이 있는 시계탑 + 짙은 슬레이트 만사드 캡 + 꼭대기 연도(굴뚝 겸용 시계탑).
// 볼륨 (OSM 외곽선 유지, 위성 지붕선으로 분할):
//   [N] 북측 동 x 907..991, z -1440..-1290: 처마 30 ft, 남북 용마루(x≈949, 4:12 → 44.5 ft), 북端 가파른 모임(위성 얕은 V).
//       서측 경사 도머 5개 (z -1418/-1393/-1367/-1341/-1316, 앞면 루버), 동측 경사 도머 2개, 용마루 환기탑 4개 (위성 어두운 상자).
//   [H] 높은 홀 x 991..1027, z -1380..-1302: 평지붕 52 ft (위성: 어두운 평지붕, 서측 북측 동 지붕 위로 그림자), 세로 긴 창(가정).
//   [S] 남측 동 x 897..1027, z -1290..-1216: 2층 처마 28 ft, 동서 용마루 모임지붕 (4:12, 용마루 40.8 ft).
//   [E] 동측 동 x 983..1027, z -1302..-1201: 처마 28, 남북 용마루, 남端 모임 (위성 삼각면).
//   [V] 서측 현관 x 890..907, z -1286..-1266: 1층 14 ft 모임지붕 + 유리 출입구 (가정).
//   [A] 동측 별동 x 1027..1054, z -1302..-1268: 1층 평지붕 16 ft, 원형 환기팬 (위성), 오버헤드 도어 (가정).
//   [T] 시계탑 20×20 ft, 중심 (950,-1270) — 위성에서 밝은 회색 정사각 상부 + 연도 3개(원), 사진 비례로
//       시계단 50..66 ft, 엔타블러처, 만사드 2단 68..78 ft, 연도 상단 ≈82 ft. (위성 기울기 때문에 위치 ±5 ft)
//   남측 마당: 벽돌 담장 6 ft + 발전기/변압기 박스 (위성 z19).
//   가정: 창 리듬(층고 13.5, 1층 5×6.5, 2층 9×8.5 ft), 출입구 위치, 높은 홀 높이(52 ft)·창, "냉각탑" 은 위성에서
//   별도 구조물이 보이지 않아 용마루 환기탑으로 해석.
import * as THREE from 'three';

export const meta = {
  id: 'power', name: 'Power Plant', osm: 'way/545266789',
  anchor: [0, 0], rotation: 0, height: 82,
  preset: { pos: [1250, 180, -1010], tgt: [965, 25, -1320] },
  sheets: 'Esri imagery z20/z19, Street View vp84 (2019, distant)',
};

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

/** 사각 평면의 경사 지붕 (축 'x' = 동서 용마루, 'z' = 남북 용마루). hip = [시작端, 끝端] 이 true 면 모임(힙), false 면 박공.
 *  ov = 처마 돌출 (박공 끝은 돌출 없음). 반환: 용마루 높이 */
function hipRect(parts, x0, x1, z0, z1, yE, pitch, axis, hip, roofMat, gableMat, ov = 1.5) {
  if (axis === 'x') {
    const zm = (z0 + z1) / 2, hw = (z1 - z0) / 2 + ov, yR = yE + hw * pitch;
    const bx0 = x0 - (hip[0] ? ov : 0), bx1 = x1 + (hip[1] ? ov : 0);
    const rW = hip[0] ? (typeof hip[0] === 'number' ? hip[0] : hw) : 0, rE = hip[1] ? (typeof hip[1] === 'number' ? hip[1] : hw) : 0;
    const bot = [[bx0, z1 + ov], [bx1, z1 + ov], [bx1, z0 - ov], [bx0, z0 - ov]];
    pitchRoof(parts, bot, [[bx0 + rW, zm], [bx1 - rE, zm], [bx1 - rE, zm], [bx0 + rW, zm]], yE, yR, roofMat, gableMat);
    return yR;
  }
  const xm = (x0 + x1) / 2, hw = (x1 - x0) / 2 + ov, yR = yE + hw * pitch;
  const bz0 = z0 - (hip[0] ? ov : 0), bz1 = z1 + (hip[1] ? ov : 0);          // hip[0] = 북端, hip[1] = 남端
  const rN = hip[0] ? (typeof hip[0] === 'number' ? hip[0] : hw) : 0, rS = hip[1] ? (typeof hip[1] === 'number' ? hip[1] : hw) : 0;
  const bot = [[x0 - ov, bz1], [x1 + ov, bz1], [x1 + ov, bz0], [x0 - ov, bz0]];
  pitchRoof(parts, bot, [[xm, bz1 - rS], [xm, bz1 - rS], [xm, bz0 + rN], [xm, bz0 + rN]], yE, yR, roofMat, gableMat);
  return yR;
}
/** 수평 띠 (폴리곤 둘레, 바깥으로 d 돌출) */
function band(parts, G, poly, y, h, d, mat, closed = true) {
  parts.push({ geom: G.sideGeometry(G.offsetPoly(poly, -d), y, y + h, 1 / 24, 1 / 12, closed), mat });
  if (h > 0 && closed) parts.push({ geom: G.capGeometry(G.offsetPoly(poly, -d), [poly], y + h), mat, cast: false });   // 윗면은 고리 모양만
}

export function build(M, G) {
  const parts = [];
  const brick = M.brick_red.clone(); brick.color = new THREE.Color(1.05, 0.86, 0.74);                 // 주황빛 적갈 벽돌 (사진)
  const tan = M.precast.clone(); tan.color = new THREE.Color(1.08, 1.0, 0.84);                         // 황갈 프리캐스트 띠
  const roofM = M.metal.clone(); roofM.color = new THREE.Color(0.52, 0.52, 0.52); roofM.roughness = 0.65; roofM.metalness = 0.3;   // 회색 강판 지붕
  const slate = M.metal.clone(); slate.color = new THREE.Color(0.30, 0.30, 0.33); slate.roughness = 0.7; slate.metalness = 0.2;   // 시계탑 만사드
  const EAVE = 28, P4 = 4 / 12;
  const win = (s, w, b, h) => ({ s, w, b, h, k: 'win' });

  // ---------- 벽체: 각 볼륨의 외곽 벽을 OSM 꼭짓점 구간별로 ----------
  // 2층 벽 (0..EAVE): 1층 창 b 3.5 h 6.5, 2층 큰 창 b 15.5 h 8.5 (사진: 2층 모서리의 큰 짙은 창)
  const twoStorey = (p0, p1, bays, { door = null, big = true } = {}) => {
    const B = basis(p0, p1), ops = [];
    const n = Math.max(1, Math.round(B.len / bays)), pitch = B.len / n;
    for (let i = 0; i < n; i++) {
      const s = (i + 0.5) * pitch;
      if (door !== null && i === door) ops.push({ s, w: 6, b: 0, h: 8, k: 'store' });
      else if (pitch > 9) ops.push(win(s, Math.min(5, pitch - 4), 3.5, 6.5));
      if (pitch > 9) ops.push(win(s, big ? Math.min(9, pitch - 5) : 5, 15.5, 8.5));
    }
    face(parts, M, G, p0, p1, 0, EAVE, brick, ops, { sillMat: tan });
  };
  const P = [[907.8, -1440.4], [906.8, -1285.8], [890.1, -1285.9], [890.0, -1266.1], [897.6, -1266.1], [897.3, -1215.9], [982.7, -1215.4], [982.6, -1201.7],
    [1027.3, -1201.4], [1027.7, -1267.7], [1054.0, -1267.5], [1054.2, -1301.7], [1026.7, -1301.9], [1027.2, -1379.7], [990.7, -1379.9], [991.1, -1439.8]];
  // 외곽 구간 (OSM 순서 = CCW). 서측 현관(1→2→3→4) 과 동측 별동(9→10→11→12), 높은 홀(12→13→14) 은 따로.
  const NW = [906.8, -1290], SWc = [897.6, -1290];
  twoStorey(P[0], NW, 21);                           // 서면 북측 동
  face(parts, M, G, NW, SWc, 0, EAVE, brick, [win(4.6, 4, 15.5, 8.5)], { sillMat: tan });   // 남측 동 북서 모서리 짧은 북면
  face(parts, M, G, SWc, [897.6, -1285.9], 0, EAVE, brick, []);                              // 현관 북쪽 짧은 서면
  face(parts, M, G, [897.6, -1285.9], P[4], 14, EAVE, brick, [win(10, 8, 15.5, 8.5)], { sillMat: tan });   // 현관 지붕 위 서면
  twoStorey(P[4], P[5], 17);                         // 서면 남측 동
  twoStorey(P[5], P[6], 17, { door: 2 });            // 남면 (중앙 유리 출입구)
  twoStorey(P[6], P[7], 13);                         // 동측 동 남단 서면 짧은 구간
  twoStorey(P[7], P[8], 15);                         // 동측 동 남면 (모임지붕 끝)
  twoStorey(P[8], P[9], 16.5);                       // 동측 동 동면 남쪽
  twoStorey(P[14], P[15], 20);                       // 북측 동 동면 (높은 홀 북쪽)
  twoStorey(P[15], P[0], 21);                        // 북면
  // 북측 동은 처마 30 ft: 28..30 구간 보충 띠 벽돌
  for (const [a, b] of [[P[0], NW], [P[14], P[15]], [P[15], P[0]]]) parts.push({ geom: G.sideGeometry([a, b], EAVE, 30, 1 / 24, 1 / 12, false), mat: brick });
  // 동측 동: 별동 위(16..28) 와 높은 홀 아래로 가려지는 구간
  parts.push({ geom: G.sideGeometry([P[9], [1027.5, -1301.8]], 16, EAVE, 1 / 24, 1 / 12, false), mat: brick });
  // 띠: 기초 수평띠(물끊기 3 ft), 층간 띠 13.5 ft, 처마 프리즈 25.5..27 (황갈 프리캐스트)
  const outline2 = [P[0], NW, SWc, P[4], P[5], P[6], P[7], P[8], P[9], [1027.5, -1301.8], P[13], P[14], P[15]];
  band(parts, G, outline2, 0, 3, 0.25, tan);
  band(parts, G, outline2, 13.2, 0.9, 0.25, tan);
  band(parts, G, outline2, 25.3, 1.4, 0.2, tan);

  // ---------- 서측 현관 (1층, 모임지붕) ----------
  {
    const V = [[890.1, -1266.1], [906.8, -1266.1], [906.8, -1285.8], [890.1, -1285.9]];
    face(parts, M, G, P[1], P[2], 0, 14, brick, []);
    face(parts, M, G, P[2], P[3], 0, 14, brick, [{ s: 9.9, w: 7, b: 0, h: 9, k: 'store' }]);
    face(parts, M, G, P[3], P[4], 0, 14, brick, []);
    band(parts, G, V, 0, 3, 0.25, tan, false);
    band(parts, G, V, 12, 1.2, 0.2, tan, false);
    hipRect(parts, 890.1, 906.8, -1285.9, -1266.1, 14, P4, 'z', [true, true], roofM, brick, 1.2);
  }
  // ---------- 동측 별동 (1층 평지붕 16 ft) ----------
  {
    face(parts, M, G, P[9], P[10], 0, 16, brick, [{ s: 14, w: 10, b: 0, h: 10, k: 'ovh' }]);
    face(parts, M, G, P[10], P[11], 0, 16, brick, [{ s: 10, w: 3.5, b: 0, h: 7.5, k: 'door' }, { s: 24, w: 2.5, b: 9, h: 2.5, k: 'louvre' }]);
    face(parts, M, G, P[11], P[12], 0, 16, brick, [{ s: 14, w: 6, b: 6, h: 4, k: 'louvre' }]);
    const A = [P[9], P[10], P[11], P[12]];
    band(parts, G, A, 0, 3, 0.25, tan, false);
    const r = G.flatRoof([[1027.5, -1267.7], P[10], P[11], [1027.5, -1301.8]], 16, { parapet: 1.5, thick: 0.6 });
    parts.push({ geom: r.slab, mat: M.roof_dark }); parts.push({ geom: r.parapet, mat: tan });
    parts.push({ geom: G.cylinder(2.2, 2.5, 1041, 16, -1285, 14), mat: M.metal });                     // 환기팬 (위성 원형)
  }
  // ---------- 높은 홀 (보일러/냉동기 홀, 평지붕 52 ft) ----------
  {
    const H = 52, Hp = [[990.7, -1301.9], [1026.7, -1301.9], [1027.2, -1379.7], [990.7, -1379.9]];
    // 동면: 세로 긴 창 4개 (3층 높이), 북면: 세로 창 2개 — 가정
    const tall = (n, len, w) => Array.from({ length: n }, (_, i) => ({ s: (i + 0.5) * len / n, w, b: 18, h: 26, k: 'win' }));
    face(parts, M, G, Hp[1], Hp[2], 0, H, brick, [...tall(4, 77.8, 5), { s: 66, w: 12, b: 0, h: 14, k: 'ovh' }], { sillMat: tan });
    face(parts, M, G, Hp[2], Hp[3], 0, H, brick, [...tall(2, 36.5, 5), { s: 18, w: 3.5, b: 0, h: 7.5, k: 'door' }], { sillMat: tan });
    face(parts, M, G, Hp[3], Hp[0], 29, H, brick, []);                               // 서면: 북측 동 처마 위 노출 부분
    face(parts, M, G, Hp[0], Hp[1], EAVE, H, brick, []);                              // 남면: 동측 동 지붕 위
    band(parts, G, Hp, 0, 3, 0.25, tan);
    band(parts, G, Hp, 30, 1.0, 0.25, tan);
    band(parts, G, Hp, 44.5, 1.0, 0.25, tan);
    band(parts, G, Hp, H - 1.4, 1.6, 0.35, tan);                                    // 코니스
    const r = G.flatRoof(Hp, H - 1.2, { parapet: 0, thick: 0.8 });
    parts.push({ geom: G.sideGeometry([...G.offsetPoly(Hp, 0.8)].reverse(), H - 1.2, H + 0.2, 1 / 24, 1 / 12, true), mat: tan, cast: false });   // 파라펫 안쪽
    parts.push({ geom: r.slab, mat: M.roof_dark });
    // 옥상 설비 (위성: 중앙 부근 작은 장치 2개 + 남단 배기구)
    parts.push({ geom: G.box(8, 4, 6, 1008, H - 1.2, -1340), mat: M.metal });
    parts.push({ geom: G.box(5, 3, 5, 1012, H - 1.2, -1312), mat: M.metal });
    for (const z of [-1306, -1310]) parts.push({ geom: G.cylinder(0.8, 3, 1020, H - 1.2, z, 8), mat: M.metal });
  }

  // ---------- 지붕 ----------
  // 북측 동: 남북 용마루(x≈949), 처마 30, 4:12, 북端 가파른 모임(위성의 얕은 V), 남端은 남측 동 지붕 속으로
  const yRN = hipRect(parts, 907, 991, -1440.2, -1258, 30, P4, 'z', [10, false], roofM, brick, 1.5);
  // 남측 동 (동서 용마루, 서端 모임, 동端 모임) + 동측 동 (남북 용마루, 남端 모임)
  hipRect(parts, 897.4, 1027.4, -1290, -1215.8, EAVE, P4, 'x', [true, true], roofM, brick, 1.5);
  hipRect(parts, 982.7, 1027.4, -1304, -1201.6, EAVE, P4, 'z', [false, true], roofM, brick, 1.5);
  // 처마 파시아 (황갈)
  // 북측 동 지붕창(도머) — 서측 경사 5개, 동측 경사 2개: 앞면 루버, 박공 지붕
  const dormer = (zc, side) => {
    const xw = side < 0 ? 907 : 991, dir = side < 0 ? 1 : -1;            // dir: 벽 → 용마루 방향 (+x 또는 -x)
    const yAt = (x) => 30 + Math.abs(x - xw) * P4;
    const xf = xw + dir * 2, hw = 6, yE = 36, yR = 39.5;
    const xEave = xw + dir * (yE - 30) / P4, xRidge = xw + dir * (yR - 30) / P4;
    // 앞면 (루버) + 박공 삼각형
    const Bf = side < 0 ? [[xf, zc - hw], [xf, zc + hw]] : [[xf, zc + hw], [xf, zc - hw]];
    face(parts, M, G, Bf[0], Bf[1], yAt(xf), yE, roofM, [{ s: hw, w: 8, b: yAt(xf) + 0.6, h: yE - yAt(xf) - 1.2, k: 'louvre' }]);
    const tri = (a, b, c, mat) => { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute([...a, ...b, ...c], 3)); g.computeVertexNormals(); parts.push({ geom: g, mat }); };
    const L = side < 0 ? 1 : -1;
    tri([xf, yE, zc - L * hw], [xf, yE, zc + L * hw], [xf, yR, zc], roofM);           // 앞 박공
    // 옆 볼(cheek) 삼각형
    tri([xf, yE, zc - L * hw * -1], [xf, yAt(xf), zc - L * hw * -1], [xEave, yE, zc - L * hw * -1], roofM);
    tri([xf, yAt(xf), zc + L * hw * -1], [xf, yE, zc + L * hw * -1], [xEave, yE, zc + L * hw * -1], roofM);
    // 도머 지붕 두 면 (0.6 ft 처마)
    const e = 0.6;
    const q = (a, b, c, d) => { tri(a, b, c, roofM); tri(a, c, d, roofM); };
    const s1 = [[xf - dir * e, yE - 0.2, zc + hw + e], [xEave + dir * 1, yE - 0.2, zc + hw + e], [xRidge, yR, zc], [xf - dir * e, yR, zc]];
    const s2 = [[xf - dir * e, yR, zc], [xRidge, yR, zc], [xEave + dir * 1, yE - 0.2, zc - hw - e], [xf - dir * e, yE - 0.2, zc - hw - e]];
    if (side < 0) { q(...s1); q(...s2); } else { q(s1[3], s1[2], s1[1], s1[0]); q(s2[3], s2[2], s2[1], s2[0]); }
  };
  for (const z of [-1418, -1393, -1367, -1341, -1316]) dormer(z, -1);
  for (const z of [-1418, -1393]) dormer(z, 1);
  // 용마루 환기탑 4개 (위성의 어두운 상자) — 루버 벽 + 낮은 모임 캡
  for (const z of [-1415, -1390, -1365, -1340]) {
    const x0 = 944, x1 = 954, z0 = z - 4, z1 = z + 4, y0 = yRN - 2.5, y1 = yRN + 4;
    const V = [[x0, z1], [x1, z1], [x1, z0], [x0, z0]];
    for (let i = 0; i < 4; i++) face(parts, M, G, V[i], V[(i + 1) % 4], y0, y1, M.metal, [{ s: i % 2 ? 4 : 5, w: i % 2 ? 6 : 8, b: y0 + 2.5, h: 3.2, k: 'louvre' }]);
    hipRect(parts, x0, x1, z0, z1, y1, 0.5, 'z', [true, true], slate, slate, 0.8);
  }

  // ---------- 시계탑 (굴뚝 겸용) ----------
  {
    const cx = 950, cz = -1270, hw = 10, Y1 = 50, Yc = 66;
    const T = [[cx - hw, cz + hw], [cx + hw, cz + hw], [cx + hw, cz - hw], [cx - hw, cz - hw]];
    // 몸통 (벽돌) — 지붕 위로 노출
    for (let i = 0; i < 4; i++) parts.push({ geom: G.sideGeometry([T[i], T[(i + 1) % 4]], 30, Y1, 1 / 24, 1 / 12, false), mat: brick });
    band(parts, G, T, 44, 1, 0.3, tan);
    band(parts, G, T, Y1, 1.2, 0.4, tan);
    // 시계 단 (Y1..Yc): 모서리 벽돌 피어 3.5 ft + 사이 어두운 루버 개구, 중앙 시계판
    for (let i = 0; i < 4; i++) {
      const p0 = T[i], p1 = T[(i + 1) % 4];
      face(parts, M, G, p0, p1, Y1 + 1.2, Yc, brick, [{ s: 5.5, w: 3.6, b: Y1 + 3, h: 10, k: 'louvre' }, { s: 14.5, w: 3.6, b: Y1 + 3, h: 10, k: 'louvre' }]);
      const B = basis(p0, p1);
      wbox(parts, G, p0, B, 10, 8.2, Y1 + 5.6, 7.4, 0.4, 0.2, tan);                        // 시계 바탕 (석재)
      const c = at(p0, B, 10, 0.45);
      const disk = new THREE.CylinderGeometry(3.3, 3.3, 0.25, 28); disk.rotateX(Math.PI / 2); disk.rotateY(B.ry); disk.translate(c[0], Y1 + 9.3, c[1]);
      parts.push({ geom: disk, mat: M.white });
      const ring = new THREE.TorusGeometry(3.35, 0.18, 6, 28); ring.rotateY(B.ry); ring.translate(c[0], Y1 + 9.3, c[1]);
      parts.push({ geom: ring, mat: M.dark });
      // 시곗바늘 (10:10)
      for (const [ang, L] of [[Math.PI * 0.85, 2.0], [Math.PI * 0.15, 2.8]]) {
        const hnd = new THREE.BoxGeometry(L, 0.22, 0.1); hnd.translate(L / 2, 0, 0); hnd.rotateZ(ang); hnd.rotateY(B.ry);
        const c2 = at(p0, B, 10, 0.62); hnd.translate(c2[0], Y1 + 9.3, c2[1]); parts.push({ geom: hnd, mat: M.dark });
      }
    }
    // 엔타블러처 (황갈, 돌출) + 만사드 (곡률 근사 2단) + 평탄 상부 + 연도 3개
    band(parts, G, T, Yc, 1.5, 1.0, tan);
    band(parts, G, T, Yc + 1.5, 0.6, 1.6, tan);
    const ring = (o) => [[cx - hw - o, cz + hw + o], [cx + hw + o, cz + hw + o], [cx + hw + o, cz - hw - o], [cx - hw - o, cz - hw - o]];
    pitchRoof(parts, ring(1.2), ring(-1.5), Yc + 2.1, Yc + 7.5, slate, slate, { soffit: false });
    pitchRoof(parts, ring(-1.5), ring(-4.5), Yc + 7.5, Yc + 12, slate, slate, { soffit: false });
    parts.push({ geom: G.capGeometry(ring(-4.5), [], Yc + 12), mat: M.metal });
    for (const [dx, dz] of [[-2, -1.5], [2, -1.5], [0, 2]]) parts.push({ geom: G.cylinder(0.9, 3.5, cx + dx, Yc + 12, cz + dz, 12), mat: M.metal });
  }

  // ---------- 남측 마당: 벽돌 담장 + 발전기/변압기 박스 ----------
  {
    const W = [[906, -1196], [982.6, -1196]];
    for (const [a, b] of [[[906, -1215.9], [906, -1196]], [[906, -1196], [982.6, -1196]]]) {
      const B = basis(a, b); wbox(parts, G, a, B, B.len / 2, B.len, 0, 6, 1, 0, brick); wbox(parts, G, a, B, B.len / 2, B.len + 0.4, 6, 0.4, 1.4, 0, tan);
    }
    parts.push({ geom: G.box(20, 7, 10, 946, 0, -1205), mat: M.dark });
    parts.push({ geom: G.box(20.4, 0.3, 10.4, 946, 7, -1205), mat: M.metal });
    void W;
  }

  const grp = new THREE.Group();
  for (const m of G.mergeByMaterial(parts)) grp.add(m);
  return grp;
}
