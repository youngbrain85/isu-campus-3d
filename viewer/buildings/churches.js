// 캠퍼스 구역 안의 교회·회관 6동 — 위성 지붕 형태 + 건축 일반 지식 기반 모델 (도면·스트리트뷰 사진 없음)
// 근거: Esri z20(겨울, 약간 비스듬)·z19(여름) 위성 크롭 + 20 ft 격자 (scratch/churches/*_z20.png, *_z19.png, ststephen_zoom.png).
// 공통 가정: 고딕 리바이벌 석조 교회 = 회황색 거친 석재 벽 + 밝은 석회석 트림(플린스, 창대, 드립몰딩, 박공 코핑),
//   슬레이트 회색 급경사 지붕(12:12 전후), 베이마다 2단 버트레스, 첨두(랜싯) 창 = 짙은 스테인드글라스, 붉은 목재 문.
// [1] St. Stephen's Episcopal (way/545275302): 위성에서 십자형 교차부(x≈938, z≈597 의 X 형 지붕선) 를 읽음.
//     본당 동서 박공 x 867..918 × z 582..614 (처마 22, 용마루 37.9) + 익랑 남북 x 918..956 × z 565..621 (같은 용마루),
//     7th St 쪽 남북 박공동 x 962..997 × z 565..665 (처마 24, 용마루 40, 동면 7베이·중앙 출입문, 북 박공 큰 창),
//     안뜰 쪽 동서 박공동 x 936..962 × z 639..665, 안뜰 모서리 사각 탑 18×18 ft·60 ft (총안 난간·피너클; 위성의 톱니 모양 흰 테두리를
//     총안으로 해석 — 위치 불확실), 남측 교구관 평지붕(북측 띠 2층 26 ft 어두운 지붕, 남측 20 ft 백색 지붕) + 북측 작은 박공 출입 베이.
// [2] Centenary United Methodist (way/545275295): 본당 동서 박공 x 877..976 × z 418..455 (처마 26, 용마루 44.5, 서 박공 큰 창),
//     북측 측랑 1층, 동측 성단 남북 모임지붕, 북측 거리 모서리 종탑 18×18 ft·66 ft + 첨탑(위성의 별도 사각 블록 x 958..976, z 404..420),
//     남측 교육관 2층 평지붕(갈색 벽돌, 모따기 모서리 = OSM 꼭짓점). 벽 = 적벽돌 + 석회석 트림.
// [3] Central Presbyterian (way/545275305): 위성의 십자형 X 지붕 — 동서 팔 x 878..946 (폭 54.5, 처마 26, 용마루 46.4) 과
//     남북 팔 x 913..946 (같은 용마루, 급경사). 서 박공 = 정면 (큰 첨두창 + 양쪽 출입문), 서측 모서리 1층 현관 2개(어두운 평지붕),
//     동측 2층 평지붕 부속동(백색 지붕 설비 다수), 교차부 작은 플레시(가정).
// [4] Terre Haute Masonic Temple (way/545275303): 백색 평지붕 단일 매스 89×103 ft. 위성 지붕이 동쪽으로 ≈12 ft 기울어 보이고
//     여름 영상의 서측 그림자가 넓어 4층 ≈60 ft 로 추정. 황갈 벽돌 + 석회석 기단층(14 ft)·대형 필라스터·엔타블러처·코니스,
//     서면(8th St) 정면 7베이 중앙 출입구 + 계단 + 기둥 포치(가정), 옥상 펜트하우스(위성 어두운 상자).
// [5] Zorah Shrine (way/545265778): 중앙 대강당 x 640..765 (벽 32 ft) 위 잘린 모임지붕(위성: 모서리 힙선 + 평탄 상부, 어두운 지붕)
//     + 밝은 파라펫 테두리, 서측 2층 로비동(아치 출입구 3개, 가정), 서측 모서리 1층 동 2개 + 흰 피라미드 천창(위성), 동측 1층 출입 스트립.
// [6] United Campus Ministries (way/545275294): 1층(17 ft) 평지붕 갈색 벽돌, 남서 홈에 출입구·캐노피, 천창 4 + 큰 천창(위성).
// 사진이 없어 창 개수·문 위치·탑 높이·재료 색은 모두 가정이며, 지붕 형태·볼륨 분할만 위성에서 읽었다.
// ■ 항공사진 대조 (ISU 가상투어 드론 파노라마 east_view_of_campus/b·l, indiana_state_university/f; 비교 scratch/aerial/churches.png):
//   [1] St. Stephen's: 탑은 안뜰 남쪽이 아니라 북측(Chestnut St) 익랑·동측 동 사이 — 밝은 석재 사각 탑 + 구리빛 갈색 급경사 첨탑.
//       지붕은 회색이 아니라 갈색 혼합 슬레이트. 옛 안뜰 총안 탑 자리는 26 ft 평지붕 블록으로.
//   [2] Centenary: 적벽돌 → 회색 석재. 탑은 북측 첨탑이 아니라 남동 모서리의 총안 + 높은 피너클 4 + 랜턴 석재 탑 (첨탑 없음).
//   [4] Masonic Temple: 북면 상부는 창 없는 황갈 벽돌 + 같은 벽돌 필라스터 + 움푹한 무늬 패널, 기단층은 흰 석재 + 3 연창. 흰 평지붕 확인.
import * as THREE from 'three';

export const meta = {
  id: 'churches', name: "Churches and lodges (St. Stephen's, Centenary UMC, Central Presbyterian, Masonic Temple, Zorah Shrine, UCM)",
  osm: 'way/545275302', extraIds: ['way/545275295', 'way/545275305', 'way/545275303', 'way/545265778', 'way/545275294'],
  anchor: [0, 0], rotation: 0, height: 106,
  preset: { pos: [1260, 210, 960], tgt: [950, 25, 640] },
  sheets: 'Esri imagery z20/z19 (no Street View)',
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
  if (P.gable.length && gableMat) parts.push({ geom: mk(P.gable), mat: gableMat });
  if (soffit) parts.push({ geom: downCap(bot, yB), mat: gableMat || roofMat, cast: false });
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

/** 사각 평면 경사 지붕 (hipRect, power_plant.js 와 같은 규약). axis 'x' = 동서 용마루. hip[0]/hip[1] = 서/동 (x) 또는 북/남 (z) 端. */
function hipRect(parts, x0, x1, z0, z1, yE, pitch, axis, hip, roofMat, gableMat, ov = 1.5) {
  if (axis === 'x') {
    const zm = (z0 + z1) / 2, hw = (z1 - z0) / 2 + ov, yR = yE + hw * pitch;
    const bx0 = x0 - (hip[0] ? ov : 0), bx1 = x1 + (hip[1] ? ov : 0);
    const rW = hip[0] ? (typeof hip[0] === 'number' ? hip[0] : hw) : 0, rE = hip[1] ? (typeof hip[1] === 'number' ? hip[1] : hw) : 0;
    pitchRoof(parts, [[bx0, z1 + ov], [bx1, z1 + ov], [bx1, z0 - ov], [bx0, z0 - ov]], [[bx0 + rW, zm], [bx1 - rE, zm], [bx1 - rE, zm], [bx0 + rW, zm]], yE, yR, roofMat, gableMat);
    return yR;
  }
  const xm = (x0 + x1) / 2, hw = (x1 - x0) / 2 + ov, yR = yE + hw * pitch;
  const bz0 = z0 - (hip[0] ? ov : 0), bz1 = z1 + (hip[1] ? ov : 0);
  const rN = hip[0] ? (typeof hip[0] === 'number' ? hip[0] : hw) : 0, rS = hip[1] ? (typeof hip[1] === 'number' ? hip[1] : hw) : 0;
  pitchRoof(parts, [[x0 - ov, bz1], [x1 + ov, bz1], [x1 + ov, bz0], [x0 - ov, bz0]], [[xm, bz1 - rS], [xm, bz1 - rS], [xm, bz0 + rN], [xm, bz0 + rN]], yE, yR, roofMat, gableMat);
  return yR;
}
/** 수평 띠 (폴리곤 둘레, 바깥으로 d 돌출, 윗면은 고리) */
function band(parts, G, poly, y, h, d, mat, closed = true) {
  parts.push({ geom: G.sideGeometry(G.offsetPoly(poly, -d), y, y + h, 1 / 24, 1 / 12, closed), mat });
  if (closed) parts.push({ geom: G.capGeometry(G.offsetPoly(poly, -d), [poly], y + h), mat, cast: false });
}
/** 벽면 평면 (u = p0→p1 거리, y) Shape → 월드. inset = 안쪽으로 */
function planeGeom(shape, p0, p1, inset = 0, uvU = 1 / 24, uvV = 1 / 12) {
  const dx = p1[0] - p0[0], dz = p1[1] - p0[1], len = Math.hypot(dx, dz);
  const g = new THREE.ShapeGeometry(shape, 8);
  const uv = g.attributes.uv, pos = g.attributes.position;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, pos.getX(i) * uvU, pos.getY(i) * uvV);
  const ex = new THREE.Vector3(dx / len, 0, dz / len), ez = new THREE.Vector3().crossVectors(ex, UP);
  const m = new THREE.Matrix4().makeBasis(ex, UP, ez); m.setPosition(p0[0] - ez.x * inset, 0, p0[1] - ez.z * inset);
  g.applyMatrix4(m);
  return g;
}
/** 개구 경로: k = 'lancet'(등변 첨두아치) | 'round'(반원) | 'rect'. s..e 폭, 바닥 b, 스프링 sp */
function opening(o, PathCls = THREE.Path) {
  const s = o.s - o.w / 2, e = o.s + o.w / 2, b = o.b, sp = o.sp ?? (o.b + o.h);
  const p = new PathCls(); p.moveTo(s, b); p.lineTo(s, sp);
  if (o.k === 'lancet') { p.absarc(e, sp, o.w, Math.PI, Math.PI * 2 / 3, true); p.absarc(s, sp, o.w, Math.PI / 3, 0, true); }
  else if (o.k === 'round') p.absarc(o.s, sp, o.w / 2, Math.PI, 0, true);
  else p.lineTo(e, sp);
  p.lineTo(e, b); p.closePath();
  return p;
}
/** 개구 꼭대기 높이 */
const topOf = (o) => (o.sp ?? (o.b + o.h)) + (o.k === 'lancet' ? o.w * 0.866 : o.k === 'round' ? o.w / 2 : 0);
/**
 * 벽 한 장 (윤곽 outline = [[u,y],...] 반시계, 기본 = 사각 y0..y1) + 개구(첨두/반원/사각) + 채움면(유리/문) + 창대·드립몰딩.
 * ops: {s, w, b, sp?|h, k, fill?: 'glass'|'door'|'louvre', mull?: 세로 멀리언 수}
 */
function wall(parts, M, G, p0, p1, y0, y1, mat, ops, C, outline = null) {
  const B = basis(p0, p1);
  const pts = outline || [[0, y0], [B.len, y0], [B.len, y1], [0, y1]];
  const shape = new THREE.Shape(pts.map(p => new THREE.Vector2(p[0], p[1])));
  for (const o of ops) shape.holes.push(opening(o));
  parts.push({ geom: planeGeom(shape, p0, p1, 0), mat });
  for (const o of ops) {
    const fill = o.fill === 'door' ? C.door : o.fill === 'louvre' ? M.dark : C.glass;
    const gs = new THREE.Shape(opening(o).getPoints(10));
    parts.push({ geom: planeGeom(gs, p0, p1, 0.35, 1 / o.w, 1 / (topOf(o) - o.b)), mat: fill, cast: false });
    if (o.fill !== 'door') wbox(parts, G, p0, B, o.s, o.w + 0.8, o.b - 0.45, 0.45, 0.9, 0.2, C.trim);          // 석재 창대
    const mullN = o.mull ?? (o.w >= 5 && o.fill !== 'door' && o.fill !== 'louvre' ? (o.w >= 9 ? 2 : 1) : 0);
    for (let i = 1; i <= mullN; i++) wbox(parts, G, p0, B, o.s - o.w / 2 + i * o.w / (mullN + 1), 0.35, o.b, (o.sp ?? o.b + o.h) - o.b + (o.k === 'lancet' ? o.w * 0.5 : 0), 0.3, -0.15, C.trim, false);
    if (o.fill === 'louvre') for (let y = o.b + 0.6; y < (o.sp ?? o.b + o.h); y += 0.8) wbox(parts, G, p0, B, o.s, o.w, y, 0.12, 0.25, -0.2, C.trim, false);
    // 드립 몰딩 (아치 위 석재 띠, 0.3 ft 돌출) — 개구 윤곽을 0.6 ft 키운 링
    if (o.k !== 'rect' && C.hood) {
      const big = { ...o, w: o.w + 1.2, s: o.s, sp: (o.sp ?? o.b + o.h) }, sm = o;
      const ring = new THREE.Shape(opening(big).getPoints(10));
      ring.holes.push(opening(sm));
      const g = planeGeom(ring, p0, p1, -0.25); parts.push({ geom: g, mat: C.trim, cast: false });
    }
  }
  return B;
}
/** 박공 지붕 경사선을 따르는 석재 코핑 (박공벽 위) */
function rake(parts, G, p0, p1, yE, yR, mat, w = 1.6, h = 1.0) {
  const B = basis(p0, p1), half = B.len / 2, L = Math.hypot(half, yR - yE), ang = Math.atan2(yR - yE, half);
  for (const side of [0, 1]) {
    const g = new THREE.BoxGeometry(L + 0.8, h, w);
    g.rotateZ(side ? -ang : ang);
    const u = side ? half + half / 2 : half / 2, y = (yE + yR) / 2 + h / 2;
    g.rotateY(B.ry); const c = at(p0, B, u, 0); g.translate(c[0], y, c[1]);
    parts.push({ geom: g, mat });
  }
  const k = new THREE.BoxGeometry(1.4, 2.2, 1.4); k.rotateY(B.ry); const c = at(p0, B, half, 0); k.translate(c[0], yR + 1.1, c[1]);   // 정점 십자 받침
  parts.push({ geom: k, mat });
}
/** 피라미드 (정사각 바닥 → 정점) */
function pyramid(parts, cx, cz, hw, y0, y1, mat) {
  const b = [[cx - hw, cz + hw], [cx + hw, cz + hw], [cx + hw, cz - hw], [cx - hw, cz - hw]];
  pitchRoof(parts, b, b.map(() => [cx, cz]), y0, y1, mat, mat, { soffit: false });
}

/**
 * 고딕 홀 (본당/익랑): 직사각 x0..x1 × z0..z1, axis 'x' = 동서 용마루. E = 처마, pitch = 경사.
 * sides: {S,N,E,W}: 각 면 설정 { skip?, bays?, win?: {w,b,sp}, door?: [s...] } — 박공면에는 큰 창 gwin {w,b,sp,s?}
 */
function gothicHall(parts, M, G, C, o) {
  const { x0, x1, z0, z1, axis, E, pitch } = o;
  const ov = o.ov ?? 1.2;
  const hw = (axis === 'x' ? z1 - z0 : x1 - x0) / 2, R = E + hw * pitch;
  const edges = { S: [[x0, z1], [x1, z1]], E: [[x1, z1], [x1, z0]], N: [[x1, z0], [x0, z0]], W: [[x0, z0], [x0, z1]] };
  const gableSides = axis === 'x' ? ['W', 'E'] : ['N', 'S'];
  for (const [k, [p0, p1]] of Object.entries(edges)) {
    const cfg = (o.sides || {})[k] || {};
    if (cfg.skip) continue;
    const B = basis(p0, p1);
    const isGable = gableSides.includes(k) && !(o.hip || {})[k];
    const y0 = cfg.y0 ?? 0;
    const ops = [];
    if (isGable) {
      const gw = cfg.gwin; if (gw) ops.push({ s: gw.s ?? B.len / 2, w: gw.w, b: gw.b, sp: gw.sp, k: gw.k || 'lancet', mull: gw.mull });
      for (const d of cfg.doors || []) ops.push({ s: d, w: 5, b: 0, sp: 8, k: 'lancet', fill: 'door' });
      for (const w of cfg.wins || []) ops.push({ s: w, w: 3.5, b: 6, sp: E - 6, k: 'lancet' });
      let outline = [[0, y0], [B.len, y0], [B.len, E], [B.len / 2, R], [0, E]];
      if (y0 >= E) { const ua = (y0 - E) / pitch; outline = [[ua, y0], [B.len - ua, y0], [B.len / 2, R]]; }
      wall(parts, M, G, p0, p1, y0, E, C.wall, ops, C, outline);
      rake(parts, G, at(p0, B, 0, 0.1), at(p0, B, B.len, 0.1), E, R + 0.4, C.trim);
      // 박공 상부 원창 (장미창) — 큰 창이 없을 때
      if (!gw && cfg.rose !== false) { const c = at(p0, B, B.len / 2, 0.3); const d = new THREE.CircleGeometry(Math.min(4, (R - E) * 0.3), 20); d.rotateY(B.ry); d.translate(c[0], E + (R - E) * 0.4, c[1]); parts.push({ geom: d, mat: C.glass, cast: false }); }
    } else {
      const n = cfg.bays ?? Math.max(1, Math.round(B.len / 13)), pitchB = B.len / n;
      const win = cfg.win || { w: 3.5, b: 6, sp: E - 5.5 };
      for (let i = 0; i < n; i++) {
        const s = (i + 0.5) * pitchB;
        if ((cfg.doors || []).includes(i)) ops.push({ s, w: 5, b: 0, sp: 8, k: 'lancet', fill: 'door' });
        else if (!(cfg.blank || []).includes(i)) ops.push({ s, w: win.w, b: win.b, sp: win.sp, k: win.k || 'lancet' });
      }
      wall(parts, M, G, p0, p1, y0, E, C.wall, ops, C);
      // 버트레스 (베이 경계 + 양 끝), 2단
      if (o.buttress !== false && cfg.buttress !== false) for (let i = 0; i <= n; i++) {
        const s = Math.min(Math.max(i * pitchB, 1.4), B.len - 1.4);
        wbox(parts, G, p0, B, s, 2.6, y0, (E - y0) * 0.55, 2.4, 1.2, C.wall);
        wbox(parts, G, p0, B, s, 2.2, y0 + (E - y0) * 0.55, (E - y0) * 0.35, 1.5, 0.75, C.wall);
        wbox(parts, G, p0, B, s, 2.4, y0 + (E - y0) * 0.55 - 0.4, 0.4, 2.6, 1.3, C.trim);
        wbox(parts, G, p0, B, s, 2.4, y0 + (E - y0) * 0.9 - 0.4, 0.4, 1.7, 0.85, C.trim);
      }
      wbox(parts, G, p0, B, B.len / 2, B.len + 0.6, E - 1.0, 1.0, 1.0, 0.4, C.trim);     // 처마 코니스
    }
    wbox(parts, G, p0, B, B.len / 2, B.len + 0.6, 0, 2.5, 0.6, 0.3, C.trim);              // 기단(플린스)
  }
  // 지붕: 긴 변만 처마 돌출, 박공端은 벽면에서 끝 (hip 端은 돌출)
  const H = o.hip || {};
  if (axis === 'x') {
    const zm = (z0 + z1) / 2, bx0 = x0 - (H.W ? ov : 0), bx1 = x1 + (H.E ? ov : 0), r = hw + ov;
    pitchRoof(parts, [[bx0, z1 + ov], [bx1, z1 + ov], [bx1, z0 - ov], [bx0, z0 - ov]],
      [[bx0 + (H.W ? r : 0), zm], [bx1 - (H.E ? r : 0), zm], [bx1 - (H.E ? r : 0), zm], [bx0 + (H.W ? r : 0), zm]], E - ov * pitch, R, C.roof, null);
    if (o.ridgeCrest !== false && !H.W && !H.E) parts.push({ geom: G.box(x1 - x0, 0.5, 0.6, (x0 + x1) / 2, R - 0.1, zm), mat: C.trim });
  } else {
    const xm = (x0 + x1) / 2, bz0 = z0 - (H.N ? ov : 0), bz1 = z1 + (H.S ? ov : 0), r = hw + ov;
    pitchRoof(parts, [[x0 - ov, bz1], [x1 + ov, bz1], [x1 + ov, bz0], [x0 - ov, bz0]],
      [[xm, bz1 - (H.S ? r : 0)], [xm, bz1 - (H.S ? r : 0)], [xm, bz0 + (H.N ? r : 0)], [xm, bz0 + (H.N ? r : 0)]], E - ov * pitch, R, C.roof, null);
    if (o.ridgeCrest !== false && !H.N && !H.S) parts.push({ geom: G.box(0.6, 0.5, z1 - z0, xm, R - 0.1, (z0 + z1) / 2), mat: C.trim });
  }
  return R;
}

/** 사각 탑: x0..x0+w, z0..z0+w, 몸통 높이 h, top = 'battlement' | 'spire' | 'pyramid'. doorSide = 'S'|'W'|... */
function tower(parts, M, G, C, o) {
  const { x0, z0, w, h } = o, x1 = x0 + w, z1 = z0 + w, cx = x0 + w / 2, cz = z0 + w / 2;
  const P = [[x0, z1], [x1, z1], [x1, z0], [x0, z0]];
  const sideKeys = ['S', 'E', 'N', 'W'];
  const belB = h - 15, belT = h - 4;                                                 // 종루 개구
  for (let i = 0; i < 4; i++) {
    const p0 = P[i], p1 = P[(i + 1) % 4], k = sideKeys[i];
    const ops = [{ s: w / 2, w: Math.min(5, w * 0.3), b: belB, sp: belT - Math.min(5, w * 0.3) * 0.866, k: 'lancet', fill: 'louvre' }];
    if (k === o.doorSide) ops.push({ s: w / 2, w: 6, b: 0, sp: 9, k: 'lancet', fill: 'door' });
    else if (o.midWin !== false && !(o.hidden || []).includes(k)) ops.push({ s: w / 2, w: 3, b: 14, sp: 19, k: 'lancet' });
    if (o.midWin !== false && !(o.hidden || []).includes(k)) ops.push({ s: w / 2, w: 2.5, b: belB - 12, sp: belB - 8, k: 'lancet' });
    wall(parts, M, G, p0, p1, 0, h, C.wall, ops, C);
    if (o.clock && k !== 'N') {
      const B = basis(p0, p1), c = at(p0, B, w / 2, 0.35);
      const d = new THREE.CircleGeometry(2.6, 24); d.rotateY(B.ry); d.translate(c[0], belB - 4.5, c[1]); parts.push({ geom: d, mat: M.white, cast: false });
    }
  }
  // 모서리 버트레스 (각 모서리 두 방향), 띠
  for (const [x, z, dx, dz] of [[x0, z1, -1, 1], [x1, z1, 1, 1], [x1, z0, 1, -1], [x0, z0, -1, -1]]) {
    for (const [ax, az] of [[dx, 0], [0, dz]]) {
      parts.push({ geom: G.box(ax ? 2.4 : 2.2, h * 0.7, az ? 2.4 : 2.2, x + ax * 1.2 - (ax ? 0 : dx * -1.1) * 0, 0, z + az * 1.2 - (az ? 0 : dz * -1.1) * 0), mat: C.wall });
    }
  }
  band(parts, G, P, 0, 2.5, 0.4, C.trim);
  band(parts, G, P, belB - 1.2, 0.8, 0.35, C.trim);
  band(parts, G, P, h - 1.2, 1.2, 0.6, C.trim);
  parts.push({ geom: G.capGeometry(P, [], h - 0.2), mat: C.roofFlat || M.roof_dark, cast: false });
  if (o.top === 'battlement') {
    // 난간 + 총안 (merlon) + 모서리 피너클
    parts.push({ geom: G.sideGeometry(G.offsetPoly(P, -0.4), h, h + 2.2, 1 / 24, 1 / 12, true), mat: C.wall });
    parts.push({ geom: G.sideGeometry([...G.offsetPoly(P, 0.8)].reverse(), h - 0.2, h + 2.2, 1 / 24, 1 / 12, true), mat: C.wall, cast: false });
    const n = Math.max(3, Math.round(w / 3.2));
    for (let i = 0; i < 4; i++) {
      const p0 = G.offsetPoly(P, -0.4)[i], p1 = G.offsetPoly(P, -0.4)[(i + 1) % 4], B = basis(p0, p1);
      for (let j = 1; j < n; j++) wbox(parts, G, p0, B, j * B.len / n, B.len / n * 0.5, h + 2.2, 1.6, 1.3, -0.6, C.wall);
    }
    for (const [x, z] of G.offsetPoly(P, -0.6)) {
      parts.push({ geom: G.box(2.4, 5, 2.4, x, h, z), mat: C.wall });
      pyramid(parts, x, z, 1.3, h + 5, h + 10, C.trim);
    }
  } else {
    // 첨탑 (spire) 또는 낮은 피라미드 지붕: 처마 돌출 0.8
    const ht = o.top === 'spire' ? w * 2.0 : w * 0.55;
    pyramid(parts, cx, cz, w / 2 + 0.8, h, h + ht, C.spire || C.roof);
    if (o.top === 'spire') {   // 스파이어 기단 모서리 피너클
      for (const [x, z] of G.offsetPoly(P, -0.3)) pyramid(parts, x, z, 1.1, h, h + 7, C.trim);
    }
    // 십자가
    parts.push({ geom: G.box(0.3, 4, 0.3, cx, h + ht, cz), mat: C.metal || M.dark });
    parts.push({ geom: G.box(2.2, 0.3, 0.3, cx, h + ht + 2.6, cz), mat: C.metal || M.dark });
  }
}
/** 평지붕 박스 (rect/폴리곤) + 사각 창 2단 + 코핑/파라펫 */
function flatBlock(parts, M, G, C, poly, H, o = {}) {
  const n = poly.length;
  for (let i = 0; i < n; i++) {
    const p0 = poly[i], p1 = poly[(i + 1) % n], B = basis(p0, p1);
    if ((o.skip || []).includes(i)) continue;
    const ops = [];
    const rows = o.rows ?? Math.max(1, Math.floor((H - 2) / 12));
    const bay = o.bay ?? 9;
    const cnt = B.len > 6 ? Math.max(1, Math.floor(B.len / bay)) : 0;
    const doorAt = (o.doors || {})[i] || [];
    for (let r = 0; r < rows && !(o.blankEdges || []).includes(i); r++) for (let j = 0; j < cnt; j++) {
      const s = (j + 0.5) * B.len / cnt;
      if (r === 0 && doorAt.some(d => Math.abs(d - s) < 3 + (o.winW ?? 4) / 2 + 0.6)) continue;   // 문과 겹치는 1층 창 생략
      ops.push({ s, w: o.winW ?? 4, b: (o.sill ?? 3.5) + r * (o.storey ?? 12), h: o.winH ?? 5.5, k: o.winK || 'rect' });
    }
    for (const d of doorAt) ops.push({ s: d, w: 6, b: 0, h: 8, k: o.doorK || 'rect', fill: 'door' });
    wall(parts, M, G, p0, p1, 0, H, o.wall || C.wall, ops, { ...C, hood: false });
  }
  band(parts, G, poly, 0, 2.2, 0.25, C.trim);
  band(parts, G, poly, H - 0.2, 0.7, 0.35, C.trim);                         // 코핑
  const r = G.flatRoof(poly, H - 1.4, { parapet: 0, thick: 0.6 });
  parts.push({ geom: r.slab, mat: o.roof || M.roof_membrane });
  parts.push({ geom: G.sideGeometry([...G.offsetPoly(poly, 0.7)].reverse(), H - 1.4, H + 0.5, 1 / 24, 1 / 12, true), mat: o.wall || C.wall, cast: false });
}
const R4 = (x0, x1, z0, z1) => [[x0, z1], [x1, z1], [x1, z0], [x0, z0]];

export function build(M, G) {
  const parts = [];
  // ---- 재료 ----
  const stone = M.limestone.clone(); stone.color = new THREE.Color(0.86, 0.82, 0.74);            // 회황색 거친 석재
  const stoneTrim = M.limestone.clone(); stoneTrim.color = new THREE.Color(1.02, 0.99, 0.92);     // 밝은 석회석 트림
  const slate = new THREE.MeshStandardMaterial({ color: 0x55585e, roughness: 0.85 });            // 슬레이트 지붕 (위성 회색)
  const slateDark = new THREE.MeshStandardMaterial({ color: 0x3e4146, roughness: 0.85 });
  const stained = new THREE.MeshStandardMaterial({ color: 0x34465a, roughness: 0.25, metalness: 0.35 });   // 스테인드글라스 외관
  const door = new THREE.MeshStandardMaterial({ color: 0x6b2a22, roughness: 0.6 });               // 붉은 목재 문
  const metal = M.dark;
  const CS = { wall: stone, trim: stoneTrim, roof: slate, glass: stained, door, hood: true, spire: slateDark, metal };

  // 항공사진(east_view_of_campus/b·l, indiana_state_university/f): St. Stephen's 지붕 = 갈색·회갈색 혼합 슬레이트, 첨탑 = 구리빛 갈색
  const slateBrown = new THREE.MeshStandardMaterial({ color: 0x7d6a5d, roughness: 0.85 });
  const copper = new THREE.MeshStandardMaterial({ color: 0x8c5a33, roughness: 0.55, metalness: 0.35 });
  stStephens(parts, M, G, { ...CS, roof: slateBrown, spire: copper });
  // 항공사진: Centenary 는 적벽돌이 아니라 회색 거친 석재 (탑·본당 모두)
  centenary(parts, M, G, CS, M.brick_brown);
  presbyterian(parts, M, G, CS, M.brick_brown);
  masonic(parts, M, G, { ...CS, wall: M.brick_tan, glass: M.pane, hood: false });
  zorah(parts, M, G, { ...CS, wall: M.brick_tan, glass: M.pane, hood: false, roof: slateDark });
  ucm(parts, M, G, { ...CS, wall: M.brick_brown, glass: M.pane, hood: false });

  const grp = new THREE.Group();
  for (const m of G.mergeByMaterial(parts)) grp.add(m);
  return grp;
}

// ================= St. Stephen's Episcopal =================
function stStephens(parts, M, G, C) {
  // [A] 본당 (동서) x 866.8..918, z 582..613.7 — 서측 박공 큰 첨두창
  gothicHall(parts, M, G, C, { x0: 866.8, x1: 918, z0: 582, z1: 613.7, axis: 'x', E: 22, pitch: 1.0,
    sides: { W: { gwin: { w: 9, b: 9, sp: 26 } }, E: { skip: true }, S: { bays: 4 }, N: { bays: 3 } } });
  // [B] 익랑 (남북) x 918..956, z 565.2..620.9 — 북 박공 큰 창, 남 박공 창은 탑 서쪽으로 치우침
  gothicHall(parts, M, G, C, { x0: 918, x1: 956, z0: 565.2, z1: 620.9, axis: 'z', E: 22, pitch: 15.85 / 19,
    sides: { N: { gwin: { w: 10, b: 9, sp: 26 } }, S: { gwin: { w: 6, b: 9, sp: 23, s: 9 }, rose: false }, W: { bays: 1, win: { w: 5, b: 7, sp: 17 } }, E: { y0: 14, bays: 4, win: { w: 3, b: 15, sp: 19 }, buttress: false } } });
  // 북서 제의실 (1층 평지붕) x 906.8..918, z 565.2..582 · 남측 현관 x 913..918, z 613.7..620.9
  flatBlock(parts, M, G, C, R4(906.8, 918, 565.2, 582), 13, { roof: M.roof_dark, skip: [0, 1], winK: 'lancet', winW: 3, rows: 1 });
  flatBlock(parts, M, G, C, R4(913, 918.2, 613.7, 620.9), 12, { roof: M.roof_dark, skip: [1, 2], rows: 0 });
  // [C] 연결부 x 956..962, z 565.3..620.9 (1층)
  flatBlock(parts, M, G, C, R4(956, 962.2, 565.3, 620.9), 14, { roof: M.roof_membrane, skip: [1, 3], rows: 1, winK: 'lancet', winW: 3 });
  // [D] 7th St 동측 동 (남북) x 962..997.5, z 565.3..664.7 — 북 박공 큰 창 + 문, 동면 버트레스 7베이
  gothicHall(parts, M, G, C, { x0: 962, x1: 997.5, z0: 565.3, z1: 664.7, axis: 'z', E: 24, pitch: 0.9,
    sides: { N: { gwin: { w: 10, b: 11, sp: 28 }, doors: [] }, S: { y0: 26.6, rose: false }, E: { bays: 7, doors: [3] }, W: { bays: 7, blank: [1, 2, 3, 4] } } });
  // [E] 중간 동 (동서) x 935.5..962, z 638.9..664.7 — 서측 박공 (안뜰 쪽)
  gothicHall(parts, M, G, C, { x0: 935.5, x1: 962, z0: 638.9, z1: 664.7, axis: 'x', E: 20, pitch: 1.0,
    sides: { W: { gwin: { w: 6, b: 7, sp: 20 } }, E: { skip: true }, S: { skip: true }, N: { skip: true } } });
  // 탑과 동측 동 사이 낮은 연결 x 953.5..962, z 620.9..638.9
  flatBlock(parts, M, G, C, R4(953.5, 962.2, 620.9, 638.9), 15, { roof: M.roof_dark, skip: [0, 1, 2, 3], rows: 0 });
  // [F] (항공사진으로 수정) 안뜰 모서리 총안 탑 → 낮은 평지붕 블록. 실제 탑은 북측 거리(Chestnut) 쪽 익랑·동측 동 사이에 있고
  //     밝은 석재 사각 탑 + 구리빛 갈색 급경사 첨탑 (east_view_of_campus/l 근경, isu/f 원경)
  flatBlock(parts, M, G, C, R4(935.5, 953.5, 620.9, 638.9), 26, { roof: M.roof_dark, skip: [1], rows: 1, winK: 'lancet', winW: 3 });
  tower(parts, M, G, { ...C, wall: C.trim }, { x0: 950, z0: 562, w: 16, h: 46, top: 'spire', doorSide: 'N', hidden: ['S'] });
  // [G] 교구관 (평지붕): 북측 띠 2층 26 ft (어두운 지붕), 남측 1.5층 20 ft (백색 멤브레인), 서측 소부속 12 ft
  flatBlock(parts, M, G, C, R4(863, 997.3, 664.7, 684), 26, { roof: M.roof_dark, skip: [], rows: 2, winK: 'lancet', winW: 3.5, winH: 5, storey: 12 });
  flatBlock(parts, M, G, C, R4(903.4, 997.3, 684, 711), 20, { roof: M.roof_membrane, skip: [2], rows: 1, winW: 5, winH: 7, doors: { 0: [47] } });
  flatBlock(parts, M, G, C, R4(863, 903.4, 684, 695.3), 18, { roof: M.roof_membrane, skip: [1, 2], rows: 1 });
  flatBlock(parts, M, G, C, R4(872.2, 903.4, 695.3, 704.5), 12, { roof: M.roof_dark, skip: [1, 2], rows: 1 });
  // 교구관 북쪽 작은 박공 (위성 x 925..950)
  gothicHall(parts, M, G, C, { x0: 926, x1: 948, z0: 660, z1: 680, axis: 'z', E: 24, pitch: 0.8, buttress: false,
    sides: { N: { gwin: { w: 5, b: 12, sp: 22 }, doors: [11] }, S: { skip: true }, E: { buttress: false, bays: 1, blank: [0] }, W: { buttress: false, bays: 1, blank: [0] } } });
  // 안뜰 원형 화단 (위성) — 낮은 석재 테두리
  const ring = new THREE.TorusGeometry(9, 0.5, 6, 32); ring.rotateX(Math.PI / 2); ring.translate(905, 0.5, 644); parts.push({ geom: ring, mat: C.trim });
}

// ================= Centenary United Methodist =================
function centenary(parts, M, G, C, brick2) {
  // 본당 (동서 박공) x 877.2..976, z 418..455, 처마 26, 12:12 → 서측 박공 큰 창
  gothicHall(parts, M, G, C, { x0: 877.2, x1: 976, z0: 418, z1: 455, axis: 'x', E: 26, pitch: 1.0,
    sides: { W: { gwin: { w: 11, b: 10, sp: 27 } }, E: { rose: false }, S: { y0: 24, buttress: false, bays: 7, blank: [0, 1, 2, 3, 4, 5, 6] }, N: { y0: 16, bays: 6, win: { w: 3.5, b: 18, sp: 22 } } } });
  // 북측 측랑 (1층, 낮은 경사) x 877.2..958, z 405.1..418
  gothicHall(parts, M, G, C, { x0: 877.2, x1: 958, z0: 405.1, z1: 418, axis: 'x', E: 16, pitch: 0.35, ridgeCrest: false,
    sides: { N: { bays: 6, win: { w: 4, b: 5, sp: 11 } }, S: { skip: true }, W: { rose: false }, E: { skip: true } } });
  // 동측 성단/익랑 (남북 용마루, 양端 모임) x 976..1001.3, z 407.6..453.6
  gothicHall(parts, M, G, C, { x0: 976, x1: 1001.3, z0: 407.6, z1: 453.6, axis: 'z', E: 26, pitch: 1.0, hip: { N: true, S: true },
    sides: { N: { gwin: null, wins: [12.6] }, S: { skip: true }, E: { bays: 3, win: { w: 5, b: 8, sp: 20 } }, W: { skip: true } } });
  // (항공사진으로 수정) 첨탑 종탑 → 북측 모서리는 낮은 현관 블록, 실제 탑은 남동 모서리(7th St 쪽)의 회색 석재 고딕 탑:
  //   총안 난간 + 모서리 높은 피너클 4 + 가운데 작은 랜턴(첨탑 없음) — east_view_of_campus/l, isu/f
  flatBlock(parts, M, G, C, R4(958, 976, 404.4, 418), 24, { roof: M.roof_dark, skip: [0], rows: 1, winK: 'lancet', winW: 3, doors: { 2: [9] }, doorK: 'lancet' });
  {
    const x0 = 977, z0 = 478, w = 18, h = 60;
    tower(parts, M, G, C, { x0, z0, w, h, top: 'battlement', doorSide: 'E', hidden: ['N'] });
    for (const [x, z] of [[x0 + 0.6, z0 + 0.6], [x0 + w - 0.6, z0 + 0.6], [x0 + w - 0.6, z0 + w - 0.6], [x0 + 0.6, z0 + w - 0.6]]) {
      parts.push({ geom: G.box(2.8, 8, 2.8, x, h + 5, z), mat: C.wall });
      pyramid(parts, x, z, 1.6, h + 13, h + 22, C.trim);
    }
    parts.push({ geom: G.box(6, 9, 6, x0 + w / 2, h, z0 + w / 2), mat: C.wall });
    pyramid(parts, x0 + w / 2, z0 + w / 2, 3.6, h + 9, h + 16, C.trim);
  }
  // 남측 교육관 (2층 평지붕 26 ft, 갈색 벽돌, 모서리 모따기) — OSM 꼭짓점
  const S = [[867, 453.7], [867.2, 484.8], [873.5, 494.2], [883.3, 497.3], [910.6, 497.1], [910.5, 486.8], [955.7, 486.5], [962.8, 496.7], [986.6, 496.5], [995.3, 490.1], [995.1, 453.6]];
  flatBlock(parts, M, G, { ...C, hood: false, glass: M.pane }, S, 24, { wall: brick2, roof: M.roof_membrane, skip: [10], rows: 2, storey: 11, sill: 3.5, winW: 5, winH: 5, bay: 10, doors: { 5: [22.6] } });
  for (const [x, z] of [[905, 470], [925, 470], [940, 468]]) parts.push({ geom: G.box(5, 3.5, 6, x, 23, z), mat: M.metal });
}

// ================= Central Presbyterian =================
function presbyterian(parts, M, G, C, brick2) {
  const E = 26, R = E + 27.25 * 0.75;
  // 동서 팔 x 878.3..946, z 940.4..994.9 (서 박공 큰 창 = 정면) / 남북 팔 x 913..946, z 930.9..1005 (같은 용마루 높이)
  gothicHall(parts, M, G, C, { x0: 878.3, x1: 946, z0: 940.4, z1: 994.9, axis: 'x', E, pitch: 0.75,
    sides: { W: { gwin: { w: 14, b: 9, sp: 30, mull: 3 }, doors: [12, 42.5] }, E: { y0: 26, rose: false }, N: { bays: 4, blank: [2, 3], win: { w: 4, b: 17, sp: 21 } }, S: { bays: 4, blank: [2, 3], win: { w: 4, b: 17, sp: 21 } } } });
  gothicHall(parts, M, G, C, { x0: 913, x1: 946, z0: 930.9, z1: 1005, axis: 'z', E, pitch: (R - E) / 16.5,
    sides: { N: { gwin: { w: 10, b: 9, sp: 28 } }, S: { gwin: { w: 10, b: 10, sp: 28 }, doors: [] }, W: { y0: 16, bays: 3, blank: [0, 1, 2], buttress: false }, E: { y0: 12, bays: 3, blank: [0, 1, 2], buttress: false } } });
  // 서측 모서리 현관 2개 (1층 평지붕, 첨두 출입문)
  flatBlock(parts, M, G, C, R4(892.5, 913, 930.9, 940.4), 16, { roof: M.roof_dark, skip: [0, 1], rows: 1, winK: 'lancet', winW: 3, doors: { 3: [4.7] }, doorK: 'lancet' });
  flatBlock(parts, M, G, C, R4(893.1, 913, 994.9, 1005.2), 16, { roof: M.roof_dark, skip: [1, 2], rows: 1, winK: 'lancet', winW: 3, doors: { 0: [10] }, doorK: 'lancet' });
  // 동측 부속동 (2층 평지붕, 벽돌) + 남측 현관
  flatBlock(parts, M, G, { ...C, glass: M.pane, hood: false }, [[946, 995], [1005.2, 994.4], [1004.5, 929.7], [946, 930.3]], 26, { wall: brick2, roof: M.roof_membrane, skip: [3], rows: 2, storey: 12, winW: 4.5, bay: 9 });
  flatBlock(parts, M, G, C, R4(946, 960, 995, 1004.7), 12, { roof: M.roof_dark, skip: [2, 3], rows: 0, doors: { 0: [7] } });
  // 옥상 설비 (위성)
  for (const [x, z, w, d] of [[970, 950, 8, 6], [985, 965, 6, 10], [975, 980, 8, 6], [995, 945, 5, 5]]) parts.push({ geom: G.box(w, 4, d, x, 25, z), mat: M.metal });
  // 교차부 플레시 (작은 첨탑) — 가정
  pyramid(parts, 930, 965, 2.2, R - 1, R + 14, C.spire);
  void R;
}

// ================= Masonic Temple =================
function masonic(parts, M, G, C) {
  const P = [[1019.5, 760.2], [1108.2, 760.5], [1108.5, 657.4], [1019.9, 657.1]];   // 남서→남동→북동→북서 (CCW)
  const H = 60, BASE = 14;
  const lime = C.trim;
  const tan = C.wall;
  const glassC = { ...C, glass: M.pane, hood: false };
  const panelBrick = M.brick_tan.clone(); panelBrick.color = new THREE.Color(1.1, 1.02, 0.9); panelBrick.name = 'masonic_panel';
  for (let i = 0; i < 4; i++) {
    const p0 = P[i], p1 = P[(i + 1) % 4], B = basis(p0, p1);
    const front = i === 3;                       // 서면 (8th St) 이 정면
    const nb = front ? 7 : i === 1 ? 4 : 6;
    const pitchB = B.len / nb;
    // 하부 석재 기단층 (0..14): 사각 창 + 정면 중앙 출입문
    const low = [], up = [];
    for (let j = 0; j < nb; j++) {
      const s = (j + 0.5) * pitchB;
      if (front && j === 3) low.push({ s, w: 8, b: 0, h: 10, k: 'round', fill: 'door', sp: 7 });
      else if (i === 2) { for (const d of [-2.6, 0, 2.6]) low.push({ s: s + d, w: 2.0, b: 4, h: 6, k: 'rect' }); }   // 항공사진: 북면 기단층 3 연창
      else low.push({ s, w: 4, b: 4, h: 6, k: 'rect' });
      if (i !== 1 && i !== 2) { up.push({ s, w: 6, b: 18, h: 18, k: front ? 'round' : 'rect', sp: 34 }); up.push({ s, w: 5, b: 44, h: 6, k: 'rect' }); }
    }
    wall(parts, M, G, p0, p1, 0, BASE, lime, low, glassC);
    wall(parts, M, G, p0, p1, BASE, H, tan, up, glassC);
    // 대형 필라스터 (석회석) 베이 경계, 14..52
    // 항공사진(east_view_of_campus/b 근경, 북면): 필라스터는 같은 황갈 벽돌, 상부는 무창 — 베이마다 움푹한 무늬 벽돌 패널
    const pil = (i === 2 || i === 1) ? tan : lime;
    for (let j = 0; j <= nb; j++) {
      const s = Math.min(Math.max(j * pitchB, 1.2), B.len - 1.2);
      wbox(parts, G, p0, B, s, 2.4, BASE, 38, 1.0, 0.5, pil);
      wbox(parts, G, p0, B, s, 3.0, BASE + 38, 1.2, 1.3, 0.65, pil);   // 주두
    }
    if (i === 2 || i === 1) for (let j = 0; j < nb; j++) wbox(parts, G, p0, B, (j + 0.5) * pitchB, pitchB - 5, BASE + 4, 32, 0.15, 0.02, panelBrick, false);
    // 2층 창 사이 스팬드럴 패널 (어두운) — 창 18..34 와 44..50 사이 (36..42)
    if (i !== 1 && i !== 2) for (let j = 0; j < nb; j++) wbox(parts, G, p0, B, (j + 0.5) * pitchB, 6, 38.5, 4.5, 0.3, 0.05, M.dark, false);
  }
  band(parts, G, P, 0, 3, 0.4, lime);
  band(parts, G, P, BASE, 1.5, 0.5, lime);
  band(parts, G, P, 52, 2.5, 0.9, lime);                // 엔타블러처 (프리즈)
  band(parts, G, P, 54.5, 1, 1.6, lime);                // 코니스 돌출
  band(parts, G, P, H - 0.2, 0.8, 0.3, lime);            // 파라펫 갓
  const r = G.flatRoof(P, H - 2, { parapet: 0, thick: 0.6 });
  parts.push({ geom: r.slab, mat: M.roof_membrane });
  parts.push({ geom: G.sideGeometry([...G.offsetPoly(P, 0.8)].reverse(), H - 2, H + 0.6, 1 / 24, 1 / 12, true), mat: tan, cast: false });
  // 옥상 펜트하우스 (위성: 어두운 상자) + 정면 계단·출입 포치
  parts.push({ geom: G.box(8, 10, 12, 1046, H - 2, 696), mat: tan });
  parts.push({ geom: G.box(8.8, 0.6, 12.8, 1046, H + 8, 696), mat: lime });
  const fb = basis(P[3], P[0]);
  const mid = fb.len / 2;
  for (let k = 0; k < 4; k++) wbox(parts, G, P[3], fb, mid, 20 - k * 1.5, 0, 0.6 * (k + 1), 1.5, 0.75 + (3 - k) * 1.5, lime);   // 계단
  for (const ds of [-7, 7]) wbox(parts, G, P[3], fb, mid + ds, 2.2, 0, 16, 2.2, 3.5, lime);                                           // 출입구 양옆 기둥
  wbox(parts, G, P[3], fb, mid, 18, 16, 2.2, 5, 2.5, lime);                                                                               // 캐노피 엔타블러처
}

// ================= Zorah Shrine =================
function zorah(parts, M, G, C) {
  const lime = C.trim, brick = C.wall;
  const glassC = { ...C, glass: M.pane, hood: false };
  // 중앙 대강당 x 640..764.8, z -146.5..-14.7: 벽 32 ft + 잘린 모임지붕 (평탄 상부, 위성)
  const A = R4(640, 764.8, -146.5, -14.7), E = 32;
  for (let i = 0; i < 4; i++) {
    const p0 = A[i], p1 = A[(i + 1) % 4], B = basis(p0, p1);
    if (i === 3) { wall(parts, M, G, p0, p1, 20, E, brick, [], glassC); continue; }   // 서면: 서측 동 위로만 노출
    const n = Math.round(B.len / 15), ops = [];
    for (let j = 0; j < n; j++) { const s = (j + 0.5) * B.len / n; ops.push({ s, w: 6, b: 12, sp: 24, k: 'round' }); ops.push({ s, w: 4, b: 3, h: 5, k: 'rect' }); }
    wall(parts, M, G, p0, p1, 0, E, brick, ops, glassC);
    for (let j = 0; j <= n; j++) wbox(parts, G, p0, B, Math.min(Math.max(j * B.len / n, 1.2), B.len - 1.2), 2.4, 0, E - 3, 0.8, 0.4, brick);   // 벽기둥
  }
  band(parts, G, A, 0, 2.5, 0.3, lime);
  band(parts, G, A, 10.5, 1, 0.3, lime);
  band(parts, G, A, E - 3, 1.2, 0.5, lime);
  band(parts, G, A, E - 0.2, 1.4, 0.5, lime);            // 파라펫 갓 (위성의 밝은 테두리)
  const inner = R4(640 + 23, 764.8 - 23, -146.5 + 20, -14.7 - 20);
  pitchRoof(parts, G.offsetPoly(A, 1.2), inner, E - 0.2, E + 9, C.roof, null, { soffit: false });
  parts.push({ geom: G.capGeometry(inner, [], E + 9), mat: M.roof_dark });
  for (const x of [681, 711]) parts.push({ geom: G.box(5, 4, 5, x, E + 9, -83), mat: M.white });   // 지붕 환기창 (위성 밝은 점)
  // 서측 로비 동 x 623..660, z -122..-45: 2층 24 ft, 정면(서) 아치 출입구 3개
  flatBlock(parts, M, G, glassC, R4(623, 660, -122, -45), 24, { roof: M.roof_dark, skip: [1], rows: 2, storey: 11, winK: 'round', winW: 4, winH: 6, bay: 8, doors: { 3: [26, 38.5, 51] }, doorK: 'round' });
  // 서측 모서리 동 2 (20 ft) + 흰 피라미드 천창 (위성)
  flatBlock(parts, M, G, glassC, R4(622.8, 640, -146.4, -122), 20, { roof: M.roof_dark, skip: [0, 1], rows: 1 });
  flatBlock(parts, M, G, glassC, R4(623, 640, -45, -14.5), 20, { roof: M.roof_dark, skip: [1, 2], rows: 1 });
  pyramid(parts, 640, -140, 4, 20, 26, M.white);
  pyramid(parts, 643, -30, 4, 20, 26, M.white);
  // 동측 입구 스트립 x 764.8..772.4, z -124..-38.3 (1층 14 ft) — 출입문 2개 (위성의 계단 홈)
  flatBlock(parts, M, G, glassC, R4(764.8, 772.4, -124, -38.3), 14, { roof: M.roof_membrane, skip: [3], rows: 1, doors: { 1: [12, 67] } });
}

// ================= United Campus Ministries =================
function ucm(parts, M, G, C) {
  const P = [[898.1, 326.2], [914.1, 326.2], [914.2, 345.3], [961, 345], [960.6, 280.3], [897.8, 280.7]];
  flatBlock(parts, M, G, C, P, 17, { roof: M.roof_membrane, rows: 1, sill: 3, winW: 6, winH: 6, bay: 10, doors: { 0: [8], 1: [9.5] } });
  // 출입 캐노피 (남서 홈)
  parts.push({ geom: G.box(16, 0.8, 8, 906, 9, 330), mat: C.trim });
  // 천창 4개 + 큰 천창 (위성)
  for (const x of [915, 925, 936, 946]) parts.push({ geom: G.box(4, 1.6, 3, x, 15.6, 288), mat: M.pane });
  parts.push({ geom: G.box(16, 2.2, 7, 940, 15.6, 318), mat: M.pane });
}
