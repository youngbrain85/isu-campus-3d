// 운동 시설 레이어: 소프트볼장(St. John Softball Complex), 테니스·피클볼 단지, 동측 유소년 야구장 2면, 축구 연습장,
// Price Field(잔디 연습장), 모래 비치발리볼 코트.
// 데이터: assets/sports.json (tools/sports_data.py, OSM 외곽선) + 아래 상수(Esri z20/z19 위성에서 계측, scratch/sports/*.png).
// 단위 ft, X=동, Z=남, Y=위. 관람석·더그아웃·기록실 같은 건물은 buildings/minor_bldgs.js 에 있다.
//
// 위성 판독 요약
//  · St. John 소프트볼장: 내야 전체가 흙(스킨 내야) + 투수 서클 → 야구장이 아니라 소프트볼장 (OSM sport=baseball 은 오기).
//    홈 (-951, -1232), 1루선 방위 -7°(동쪽에서 약간 북), 펜스 거리 좌 195 / 중 200 / 우 182 ft, 워닝트랙 약 12 ft.
//    흙 구역은 투수판(43 ft) 중심 반경 68 ft 호 + 파울 지역(1루 쪽 30 ft, 3루 쪽 25 ft, 홈 뒤 30 ft). 외야 펜스는 짙은 녹색
//    패드 + 노란 상단 캡, 파울 쪽은 체인링크. 불펜 2 곳(3루 쪽 북측 띠, 1루 쪽 남동) 인조잔디 + 청색 매트.
//  · 테니스: 하늘색 코트 6 + 피클볼 6, 남색 포장 구획 3, 구획 둘레 방풍막(짙은 녹색) 펜스.
//  · Price Field: 다이아몬드 없음, 마른 잔디 연습장.
//  · 동측 타원 운동장: 홈이 서쪽 가운데에서 등을 맞댄 유소년 다이아몬드 2 면(잔디 내야, 마운드·홈·베이스만 흙), V 자 백스톱,
//    외야 펜스(OSM 외곽선), 조명탑.
//  · 축구 연습장 (x 1290..1620): 서쪽 끝에 골대가 보이는 잔디 구장 → 110 × 50 yd 라인.
import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import { capGeometry, sideGeometry } from './geom.js';

const Y0 = 0.14;                         // 경기장 바닥면 (잔디 기본면 0, 도로 0.15 과 비슷한 층)
const rad = d => d * Math.PI / 180;

// ------------------------------------------------------------------ 헬퍼
function clean(g) {
  g = g.index ? g.toNonIndexed() : g;
  if (!g.attributes.normal) g.computeVertexNormals();
  if (!g.attributes.uv) g.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(g.attributes.position.count * 2), 2));
  for (const k of Object.keys(g.attributes)) if (!['position', 'normal', 'uv'].includes(k)) g.deleteAttribute(k);
  return g;
}
/** 재질별로 지오메트리를 모아 메시로 */
function bucket() {
  const m = new Map();
  return {
    add(mat, g) { if (!g) return; if (!m.has(mat)) m.set(mat, []); m.get(mat).push(clean(g)); },
    meshes(cast = new Set()) {
      const out = [];
      for (const [mat, gs] of m) {
        const mesh = new THREE.Mesh(BufferGeometryUtils.mergeGeometries(gs), mat);
        mesh.receiveShadow = true; mesh.castShadow = cast.has(mat); mesh.name = mat.name || 'sports';
        out.push(mesh);
      }
      return out;
    },
  };
}
/** 수평 띠 (p0→p1, 폭 w, 높이 y) */
function strip(p0, p1, w, y) {
  const dx = p1[0] - p0[0], dz = p1[1] - p0[1], L = Math.hypot(dx, dz) || 1, nx = -dz / L * w / 2, nz = dx / L * w / 2;
  return capGeometry([[p0[0] + nx, p0[1] + nz], [p1[0] + nx, p1[1] + nz], [p1[0] - nx, p1[1] - nz], [p0[0] - nx, p0[1] - nz]], [], y, 1 / 8);
}
/** 원/호 둘레 선 (중심 c, 반경 r, 각 a0..a1 rad, 폭 w) */
function ringLine(c, r, w, y, a0 = 0, a1 = Math.PI * 2, n = 48) {
  const gs = [];
  for (let i = 0; i < n; i++) {
    const t0 = a0 + (a1 - a0) * i / n, t1 = a0 + (a1 - a0) * (i + 1) / n;
    gs.push(clean(strip([c[0] + Math.cos(t0) * r, c[1] + Math.sin(t0) * r], [c[0] + Math.cos(t1) * r, c[1] + Math.sin(t1) * r], w, y)));
  }
  return BufferGeometryUtils.mergeGeometries(gs);
}
function disc(c, r, y, n = 32) {
  const p = []; for (let i = 0; i < n; i++) { const t = -i / n * Math.PI * 2; p.push([c[0] + Math.cos(t) * r, c[1] + Math.sin(t) * r]); }
  return capGeometry(p, [], y, 1 / 8);
}
function post(x, z, h, r = 0.15, y = 0, seg = 6) { const g = new THREE.CylinderGeometry(r, r, h, seg); g.translate(x, y + h / 2, z); return g; }
function bx(w, h, d, x, y, z, ry = 0) { const g = new THREE.BoxGeometry(w, h, d); g.rotateY(ry); g.translate(x, y + h / 2, z); return g; }
/** 폴리라인을 따라 세운 수직 막 (펜스 망·방풍막). closed = 닫힌 둘레 */
function curtain(pts, y0, y1, closed = false, uv = 1 / 2) { return sideGeometry(pts, y0, y1, uv, uv, closed); }
/** 폴리라인을 따라 일정 간격으로 기둥 */
function postsAlong(pts, step, h, r, closed = false) {
  const gs = [], n = pts.length, m = closed ? n : n - 1;
  for (let i = 0; i < m; i++) {
    const a = pts[i], b = pts[(i + 1) % n], L = Math.hypot(b[0] - a[0], b[1] - a[1]), k = Math.max(1, Math.round(L / step));
    for (let j = 0; j < k; j++) gs.push(clean(post(a[0] + (b[0] - a[0]) * j / k, a[1] + (b[1] - a[1]) * j / k, h, r)));
  }
  if (!closed) { const e = pts[n - 1]; gs.push(clean(post(e[0], e[1], h, r))); }
  return BufferGeometryUtils.mergeGeometries(gs);
}
/** 폴리곤의 최소 외접 사각형(가장 긴 변 방향) → 중심, 장축 단위벡터, 길이, 폭 */
function obb(poly) {
  let best = null;
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length], L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (L < 1) continue;
    const u = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], v = [-u[1], u[0]];
    let u0 = 1e9, u1 = -1e9, v0 = 1e9, v1 = -1e9;
    for (const p of poly) { const pu = p[0] * u[0] + p[1] * u[1], pv = p[0] * v[0] + p[1] * v[1]; u0 = Math.min(u0, pu); u1 = Math.max(u1, pu); v0 = Math.min(v0, pv); v1 = Math.max(v1, pv); }
    const area = (u1 - u0) * (v1 - v0);
    if (!best || area < best.area) best = { area, u, v, u0, u1, v0, v1 };
  }
  let { u, v, u0, u1, v0, v1 } = best;
  if (v1 - v0 > u1 - u0) { [u, v] = [v, [-u[0], -u[1]]]; [u0, u1, v0, v1] = [v0, v1, -u1, -u0]; }   // u = 장축
  const cu = (u0 + u1) / 2, cv = (v0 + v1) / 2;
  return { c: [u[0] * cu + v[0] * cv, u[1] * cu + v[1] * cv], u, v, len: u1 - u0, wid: v1 - v0 };
}
/** 사각형 로컬 좌표 (장축 s, 단축 t; 중심 0) → 월드 */
const at = (o, s, t) => [o.c[0] + o.u[0] * s + o.v[0] * t, o.c[1] + o.u[1] * s + o.v[1] * t];

/** 볼록 껍질 (monotone chain) */
function hull(pts) {
  const p = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]), cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo = [], up = [];
  for (const q of p) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
  for (const q of p.reverse()) { while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
  return lo.slice(0, -1).concat(up.slice(0, -1));
}

// ------------------------------------------------------------------ 재질
function textures() {
  // 체인링크: 투명 배경 위 마름모 철망 (2 ft 타일 하나에 4 × 4 칸)
  const cv = document.createElement('canvas'); cv.width = cv.height = 64;
  const x = cv.getContext('2d'); x.strokeStyle = 'rgba(70,74,78,0.95)'; x.lineWidth = 2.2;
  for (let i = -64; i <= 128; i += 16) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i + 64, 64); x.stroke(); x.beginPath(); x.moveTo(i, 64); x.lineTo(i + 64, 0); x.stroke(); }
  const chain = new THREE.CanvasTexture(cv); chain.wrapS = chain.wrapT = THREE.RepeatWrapping; chain.anisotropy = 8; chain.colorSpace = THREE.SRGBColorSpace;
  // 그물(백스톱·테니스 네트): 사각 격자
  const cn = document.createElement('canvas'); cn.width = cn.height = 32;
  const y = cn.getContext('2d'); y.strokeStyle = 'rgba(25,25,25,0.9)'; y.lineWidth = 2;
  for (let i = 0; i <= 32; i += 8) { y.beginPath(); y.moveTo(i, 0); y.lineTo(i, 32); y.stroke(); y.beginPath(); y.moveTo(0, i); y.lineTo(32, i); y.stroke(); }
  const net = new THREE.CanvasTexture(cn); net.wrapS = net.wrapT = THREE.RepeatWrapping; net.colorSpace = THREE.SRGBColorSpace;
  // 외야 잔디 깎은 줄무늬 (밝음/어두움 교대) — 15 ft 폭
  const cs = document.createElement('canvas'); cs.width = 64; cs.height = 4;
  const z = cs.getContext('2d'); z.fillStyle = '#5f9a45'; z.fillRect(0, 0, 32, 4); z.fillStyle = '#4f8639'; z.fillRect(32, 0, 32, 4);
  const stripe = new THREE.CanvasTexture(cs); stripe.wrapS = stripe.wrapT = THREE.RepeatWrapping; stripe.colorSpace = THREE.SRGBColorSpace;
  return { chain, net, stripe };
}

export function buildSports(data, M, tex) {
  const T = textures();
  const grassTex = tex('grass_detail.jpg');
  const mat = {
    turfStripe: Object.assign(new THREE.MeshStandardMaterial({ map: T.stripe, roughness: 0.95 }), { name: 'sports_turf' }),
    turf: Object.assign(new THREE.MeshStandardMaterial({ map: grassTex, color: 0x7fbf5a, roughness: 1 }), { name: 'sports_grass' }),
    dryGrass: Object.assign(new THREE.MeshStandardMaterial({ map: grassTex, color: 0xb4b27a, roughness: 1 }), { name: 'sports_dry_grass' }),
    dirt: Object.assign(new THREE.MeshStandardMaterial({ color: 0xb4774f, roughness: 1 }), { name: 'sports_dirt' }),
    track: Object.assign(new THREE.MeshStandardMaterial({ color: 0x9c6446, roughness: 1 }), { name: 'sports_warning_track' }),
    artTurf: Object.assign(new THREE.MeshStandardMaterial({ color: 0x3f8c4a, roughness: 0.9 }), { name: 'sports_art_turf' }),
    mat: Object.assign(new THREE.MeshStandardMaterial({ color: 0x3d5ea8, roughness: 0.9 }), { name: 'sports_blue_mat' }),
    court: Object.assign(new THREE.MeshStandardMaterial({ color: 0x4f86c6, roughness: 0.75 }), { name: 'sports_court' }),
    courtOut: Object.assign(new THREE.MeshStandardMaterial({ color: 0x23365f, roughness: 0.8 }), { name: 'sports_court_surround' }),
    sand: Object.assign(new THREE.MeshStandardMaterial({ color: 0xd8c497, roughness: 1 }), { name: 'sports_sand' }),
    line: Object.assign(new THREE.MeshStandardMaterial({ color: 0xf4f4ef, roughness: 0.6 }), { name: 'sports_lines' }),
    pad: Object.assign(new THREE.MeshStandardMaterial({ color: 0x1f3d2c, roughness: 0.8 }), { name: 'sports_fence_pad' }),
    yellow: Object.assign(new THREE.MeshStandardMaterial({ color: 0xf2c418, roughness: 0.5 }), { name: 'sports_yellow' }),
    windscreen: Object.assign(new THREE.MeshStandardMaterial({ color: 0x1d3a2a, roughness: 0.9, side: THREE.DoubleSide }), { name: 'sports_windscreen' }),
    metal: Object.assign(new THREE.MeshStandardMaterial({ color: 0x55595d, roughness: 0.5, metalness: 0.6 }), { name: 'sports_metal' }),
    chain: Object.assign(new THREE.MeshStandardMaterial({ map: T.chain, transparent: true, alphaTest: 0.05, depthWrite: false, side: THREE.DoubleSide, roughness: 0.6, metalness: 0.4 }), { name: 'sports_chainlink' }),
    net: Object.assign(new THREE.MeshStandardMaterial({ map: T.net, transparent: true, alphaTest: 0.05, depthWrite: false, side: THREE.DoubleSide, roughness: 0.8 }), { name: 'sports_net' }),
    lamp: Object.assign(new THREE.MeshStandardMaterial({ color: 0xe8e8e0, emissive: 0x666655, roughness: 0.4 }), { name: 'sports_lamp' }),
  };
  const B = bucket();
  const fields = data.fields || [];
  const find = (pred) => fields.find(pred);

  softball(B, mat, T);
  tennis(B, mat, T, data);
  const price = find(f => f.name === 'Price Field');
  if (price) B.add(mat.dryGrass, capGeometry(price.poly, [], Y0 - 0.04, 1 / 24));
  eastDiamonds(B, mat, T, fields.filter(f => !f.name && f.sport === 'baseball'));
  const soccer = find(f => !f.name && !f.sport);
  if (soccer) soccerField(B, mat, soccer.poly);
  for (const p of data.volley || []) volleyCourt(B, mat, p);

  // 반복 텍스처 스케일: 체인링크 2 ft 타일, 그물 1 ft
  const G = new THREE.Group(); G.name = 'sports';
  for (const m of B.meshes(new Set([mat.pad, mat.metal, mat.windscreen, mat.yellow, mat.lamp]))) G.add(m);
  return G;
}

// ------------------------------------------------------------------ St. John 소프트볼장
function softball(B, mat) {
  const H = [-951, -1232], AZ = rad(-7);
  const e1 = [Math.cos(AZ), Math.sin(AZ)], e3 = [Math.cos(AZ - Math.PI / 2), Math.sin(AZ - Math.PI / 2)];
  const W = (u, v) => [H[0] + e1[0] * u + e3[0] * v, H[1] + e1[1] * u + e3[1] * v];   // u = 1루선, v = 3루선
  const fenceR = t => (t < 0.5 ? 195 + (200 - 195) * t / 0.5 : 200 + (182 - 200) * (t - 0.5) / 0.5);   // t: 0 = 3루선, 1 = 1루선
  const arc = (rf, n = 40) => { const p = []; for (let i = 0; i <= n; i++) { const t = i / n, a = Math.PI / 2 * (1 - t); p.push(W(Math.cos(a) * rf(t), Math.sin(a) * rf(t))); } return p; };   // 3루선 → 1루선
  const fence = arc(fenceR), inner = arc(t => fenceR(t) - 12);
  // 페어 지역 잔디 (줄무늬) = 홈 + 워닝트랙 안쪽 호
  B.add(mat.turfStripe, capGeometry([H, ...inner.slice().reverse()], [], Y0 - 0.02, 1 / 30));
  // 워닝트랙 (펜스 ~ 펜스-12 ft)
  B.add(mat.track, capGeometry([...fence, ...inner.slice().reverse()], [], Y0 - 0.02, 1 / 8));
  // 파울 지역 잔디 띠 (3루 쪽 25 ft, 1루 쪽 30 ft, 펜스 선까지)
  B.add(mat.turf, capGeometry([W(0, 91), W(0, fenceR(0)), W(-25, fenceR(0)), W(-25, 91)], [], Y0 - 0.03, 1 / 24));
  B.add(mat.turf, capGeometry([W(91, 0), W(fenceR(1), 0), W(fenceR(1), -30), W(91, -30)], [], Y0 - 0.03, 1 / 24));
  // 스킨 내야: 투수판 중심 반경 68 ft 호 + 파울 지역 + 홈 뒤
  const P = W(43 * Math.SQRT1_2, 43 * Math.SQRT1_2), sk = [];
  const c = [43 * Math.SQRT1_2, 43 * Math.SQRT1_2], R = 68, s0 = c[0] + Math.sqrt(R * R - c[1] * c[1]);   // 선 위 교점 (≈ 91 ft)
  const aV = Math.atan2(s0 - c[1], 0 - c[0]), aU = Math.atan2(0 - c[1], s0 - c[0]);
  for (let i = 0; i <= 30; i++) { const a = aV + (aU - aV) * i / 30; sk.push(W(c[0] + Math.cos(a) * R, c[1] + Math.sin(a) * R)); }
  sk.push(W(s0, -30), W(0, -30));
  for (let i = 1; i < 12; i++) { const a = -Math.PI / 2 - Math.PI / 2 * i / 12; sk.push(W(Math.cos(a) * 30, Math.sin(a) * 30)); }
  sk.push(W(-30, 0), W(-25, s0));
  B.add(mat.dirt, capGeometry(sk, [], Y0 + 0.02, 1 / 8));
  // 라인: 파울선, 배터 박스, 투수 서클(반경 8 ft), 코치 박스 생략
  const yl = Y0 + 0.06;
  B.add(mat.line, strip(W(0, 0), W(fenceR(1), 0), 0.3, yl));
  B.add(mat.line, strip(W(0, 0), W(0, fenceR(0)), 0.3, yl));
  B.add(mat.line, ringLine(P, 8, 0.3, yl));
  for (const s of [-1, 1]) {   // 배터 박스 3 × 7 ft, 홈 양옆 (1루-3루 대각 직각 방향)
    const d = [Math.SQRT1_2 * s, -Math.SQRT1_2 * s], f = [Math.SQRT1_2, Math.SQRT1_2];
    const cbx = [d[0] * 3.2, d[1] * 3.2], q = (a, b) => W(cbx[0] + d[0] * a + f[0] * b, cbx[1] + d[1] * a + f[1] * b);
    const box = [q(-1.5, -3.5), q(1.5, -3.5), q(1.5, 3.5), q(-1.5, 3.5)];
    for (let i = 0; i < 4; i++) B.add(mat.line, strip(box[i], box[(i + 1) % 4], 0.25, yl));
  }
  // 홈플레이트(오각형) · 베이스(60 ft) · 투수판
  { const f = [Math.SQRT1_2, Math.SQRT1_2], sd = [Math.SQRT1_2, -Math.SQRT1_2], q = (a, b) => W(f[0] * a + sd[0] * b, f[1] * a + sd[1] * b);
    B.add(mat.line, capGeometry([q(0, 0), q(0.6, 0.6), q(1.4, 0.6), q(1.4, -0.6), q(0.6, -0.6)], [], yl + 0.02, 1)); }
  for (const [u, v] of [[60, 0], [60, 60], [0, 60]]) { const p = W(u, v); B.add(mat.line, bx(1.25, 0.25, 1.25, p[0], Y0, p[1], -AZ)); }
  B.add(mat.line, bx(2, 0.1, 0.5, P[0], Y0 + 0.02, P[1], -(AZ - Math.PI / 4)));
  // 외야 펜스: 짙은 녹색 패드 8 ft + 노란 상단 캡, 펜스 기둥
  B.add(mat.pad, curtain(fence, 0, 8, false));
  B.add(mat.yellow, curtain(fence.map(p => p), 8, 8.5, false));
  B.add(mat.metal, postsAlong(fence, 10, 8.6, 0.2));
  // 노란 파울폴 (높이 25 ft)
  for (const p of [fence[0], fence[fence.length - 1]]) { B.add(mat.yellow, post(p[0], p[1], 25, 0.35, 0, 8)); B.add(mat.yellow, bx(0.2, 12, 2.5, p[0], 12, p[1], -AZ)); }
  // 파울 지역 측면 체인링크 (8 ft): 3루 쪽 v = -25 선, 1루 쪽 u = -30 선
  const side3 = [W(-25, fenceR(0) + 0.5), W(-25, 70)], side1 = [W(fenceR(1) + 0.5, -30), W(75, -30)];
  for (const s of [side3, side1]) { B.add(mat.chain, curtain(s, 0, 8, false)); B.add(mat.metal, postsAlong(s, 10, 8.2, 0.15)); }
  // 백스톱: 홈 뒤 반경 30 ft 호, 그물 24 ft + 아래 패드 3 ft + 기둥
  const bs = []; for (let i = 0; i <= 12; i++) { const a = -Math.PI / 2 - Math.PI / 2 * i / 12 + rad(-15) + rad(30) * i / 12; bs.push(W(Math.cos(a) * 31, Math.sin(a) * 31)); }
  B.add(mat.net, curtain(bs, 3, 24, false));
  B.add(mat.pad, curtain(bs, 0, 3, false));
  B.add(mat.metal, postsAlong([bs[0], bs[4], bs[8], bs[12]], 100, 25, 0.3));
  // 불펜 2 곳: 인조잔디 + 청색 매트 + 체인링크
  const pens = [[[-998, -1427], [-980, -1427], [-980, -1325], [-998, -1325]], [[-859, -1195], [-798, -1195], [-798, -1163], [-859, -1163]]];
  for (const pn of pens) {
    B.add(mat.artTurf, capGeometry(pn, [], Y0, 1 / 8));
    const cx = (pn[0][0] + pn[2][0]) / 2, cz = (pn[0][1] + pn[2][1]) / 2, long = Math.abs(pn[2][1] - pn[0][1]) > Math.abs(pn[2][0] - pn[0][0]);
    const mw = long ? 10 : 30, md = long ? 30 : 10;
    B.add(mat.mat, capGeometry([[cx - mw / 2, cz - md / 2], [cx + mw / 2, cz - md / 2], [cx + mw / 2, cz + md / 2], [cx - mw / 2, cz + md / 2]], [], Y0 + 0.04, 1 / 8));
    B.add(mat.chain, curtain(pn, 0, 8, true)); B.add(mat.metal, postsAlong(pn, 10, 8.2, 0.15, true));
  }
}

// ------------------------------------------------------------------ 테니스·피클볼
function courtLines(B, mat, o, kind, y) {
  const L = kind === 'tennis' ? 78 : 44, Wd = kind === 'tennis' ? 36 : 20, l = (a, b) => B.add(mat.line, strip(at(o, a[0], a[1]), at(o, b[0], b[1]), 0.18, y));
  const h = L / 2, w = Wd / 2;
  l([-h, -w], [h, -w]); l([-h, w], [h, w]); l([-h, -w], [-h, w]); l([h, -w], [h, w]);
  if (kind === 'tennis') {
    const sw = 13.5; l([-h, -sw], [h, -sw]); l([-h, sw], [h, sw]);                 // 단식 사이드라인 (27 ft)
    l([-21, -sw], [-21, sw]); l([21, -sw], [21, sw]); l([-21, 0], [21, 0]);         // 서비스라인·센터 서비스라인
    l([-h, 0], [-h + 0.6, 0]); l([h - 0.6, 0], [h, 0]);                             // 센터 마크
  } else {
    l([-7, -w], [-7, w]); l([7, -w], [7, w]); l([-h, 0], [-7, 0]); l([7, 0], [h, 0]); // 키친(7 ft)·센터라인
  }
  // 네트: 기둥 (코트 밖 3 ft / 피클볼 1 ft) + 그물 + 흰 테이프
  const ext = kind === 'tennis' ? w + 3 : w + 1, nh = kind === 'tennis' ? 3.5 : 3.0;
  const a = at(o, 0, -ext), b = at(o, 0, ext);
  B.add(mat.metal, post(a[0], a[1], nh + 0.1, 0.12)); B.add(mat.metal, post(b[0], b[1], nh + 0.1, 0.12));
  B.add(mat.net, curtain([a, b], 0.3, nh - 0.2, false, 1));
  B.add(mat.line, curtain([a, b], nh - 0.2, nh, false));
}
function tennis(B, mat, T, data) {
  for (const p of data.blocks || []) {
    B.add(mat.courtOut, capGeometry(p, [], Y0 - 0.02, 1 / 24));
    // 구획 둘레 펜스: 체인링크 10 ft + 방풍막(아래 9 ft, 짙은 녹색)
    B.add(mat.windscreen, curtain(p, 0, 9, true)); B.add(mat.chain, curtain(p, 9, 10.5, true)); B.add(mat.metal, postsAlong(p, 10, 10.6, 0.12, true));
  }
  for (const p of data.tennis || []) { const o = obb(p); B.add(mat.court, capGeometry(p, [], Y0 + 0.02, 1 / 24)); courtLines(B, mat, o, 'tennis', Y0 + 0.06); }
  for (const p of data.pickleball || []) { const o = obb(p); B.add(mat.court, capGeometry(p, [], Y0 + 0.02, 1 / 24)); courtLines(B, mat, o, 'pickle', Y0 + 0.06); }
}

// ------------------------------------------------------------------ 동측 유소년 다이아몬드 2 면 (등 맞댐)
function eastDiamonds(B, mat, T, polys) {
  // 두 면 사이 쐐기 틈까지 덮도록 두 외곽선의 볼록 껍질을 잔디로
  if (polys.length) B.add(mat.turfStripe, capGeometry(hull(polys.flatMap(f => f.poly)), [], Y0 - 0.02, 1 / 30));
  // 홈은 서쪽 가운데 백스톱 (위성 z20): 북측 면은 북동, 남측 면은 남동 방향
  const D = [{ H: [1726, -803], az: rad(0), dir: -1 }, { H: [1726, -787], az: rad(0), dir: 1 }];
  for (const d of D) {
    const e1 = [1, 0], e3 = [0, d.dir];                               // u = 동쪽 선, v = 북/남 선
    const W = (u, v) => [d.H[0] + e1[0] * u + e3[0] * v, d.H[1] + e1[1] * u + e3[1] * v];
    const s = 60, mound = W(46 * Math.SQRT1_2, 46 * Math.SQRT1_2), y = Y0 + 0.03;
    B.add(mat.dirt, disc(W(0, 0), 13, y)); B.add(mat.dirt, disc(mound, 9, y));
    for (const [u, v] of [[s, 0], [s, s], [0, s]]) { const p = W(u, v); B.add(mat.dirt, disc(p, 7, y)); B.add(mat.line, bx(1.25, 0.25, 1.25, p[0], Y0, p[1])); }
    // 베이스 사이 흙길 (폭 6 ft)
    const bp = [W(0, 0), W(s, 0), W(s, s), W(0, s)];
    for (let i = 0; i < 4; i++) B.add(mat.dirt, strip(bp[i], bp[(i + 1) % 4], 6, y - 0.01));
    B.add(mat.line, strip(W(0, 0), W(180, 0), 0.3, y + 0.03)); B.add(mat.line, strip(W(0, 0), W(0, 180), 0.3, y + 0.03));
    // V 자 백스톱 (체인링크 14 ft) + 1·3루 쪽 덕아웃 펜스 (6 ft) + 벤치
    const bs = [W(30, -16), W(-12, -12), W(-16, 30)];
    B.add(mat.chain, curtain(bs, 0, 14, false)); B.add(mat.metal, postsAlong(bs, 10, 14.2, 0.18));
    for (const run of [[W(30, -16), W(90, -16)], [W(-16, 30), W(-16, 90)]]) { B.add(mat.chain, curtain(run, 0, 6, false)); B.add(mat.metal, postsAlong(run, 10, 6.2, 0.12)); }
    for (const [a, b] of [[W(40, -19), W(60, -19)], [W(-19, 40), W(-19, 60)]]) {   // 덕아웃 벤치
      const mx = (a[0] + b[0]) / 2, mz = (a[1] + b[1]) / 2, alongX = Math.abs(b[0] - a[0]) > 1;
      B.add(mat.metal, bx(alongX ? 20 : 1.2, 1.5, alongX ? 1.2 : 20, mx, 0, mz));
    }
  }
  // 외야 펜스 (OSM 외곽선 중 홈 반대쪽 큰 호, 체인링크 6 ft + 노란 캡)
  for (const f of polys) {
    const p = f.poly, far = p.filter(q => Math.hypot(q[0] - 1726, q[1] + 795) > 140);
    if (far.length > 2) { B.add(mat.chain, curtain(far, 0, 6, false)); B.add(mat.yellow, curtain(far, 6, 6.4, false)); B.add(mat.metal, postsAlong(far, 10, 6.2, 0.12)); }
  }
  // 조명탑 (60 ft, 헤드 프레임 + 등기구 6 개) — 위성 z20 그림자 기준 위치
  for (const [x, z] of [[1730, -1055], [1698, -966], [1781, -862], [1705, -612], [1820, -565], [1794, -488], [1989, -786], [1996, -684]]) {
    B.add(mat.metal, post(x, z, 60, 0.6, 0, 8));
    B.add(mat.metal, bx(8, 0.4, 0.4, x, 60, z)); B.add(mat.metal, bx(8, 0.4, 0.4, x, 62.5, z));
    for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) B.add(mat.lamp, bx(1.6, 1.4, 0.8, x - 2.8 + i * 2.8, 59.7 + j * 2.5, z + 0.5));
  }
  // 관람석 (알루미늄 3 단) — 백스톱 북·남 1 개씩
  for (const [x, z, ry] of [[1709, -912, 0], [1709, -657, 0]]) for (let k = 0; k < 3; k++) B.add(mat.metal, bx(4 - k * 1.2, 0.9 + k * 0.9, 15, x - k * 0.6, 0, z, ry));
}

// ------------------------------------------------------------------ 축구 연습장 (110 × 50 yd)
function soccerField(B, mat, poly) {
  const o = obb(poly), L = Math.min(o.len - 8, 330), Wd = Math.min(o.wid - 8, 150), h = L / 2, w = Wd / 2, y = Y0 + 0.04;
  B.add(mat.turfStripe, capGeometry(poly, [], Y0 - 0.02, 1 / 30));
  const l = (a, b) => B.add(mat.line, strip(at(o, a[0], a[1]), at(o, b[0], b[1]), 0.4, y));
  l([-h, -w], [h, -w]); l([-h, w], [h, w]); l([-h, -w], [-h, w]); l([h, -w], [h, w]); l([0, -w], [0, w]);
  B.add(mat.line, ringLine(o.c, 30, 0.4, y));
  for (const s of [-1, 1]) {
    const g = s * h, pa = 54, pw = Math.min(66, w - 4), ga = 18, gw = 30;
    l([g, -pw], [g - s * pa, -pw]); l([g - s * pa, -pw], [g - s * pa, pw]); l([g - s * pa, pw], [g, pw]);
    l([g, -gw], [g - s * ga, -gw]); l([g - s * ga, -gw], [g - s * ga, gw]); l([g - s * ga, gw], [g, gw]);
    // 골대 24 × 8 ft (흰 프레임) + 그물
    const a = at(o, g, -12), b = at(o, g, 12), a2 = at(o, g + s * 6, -12), b2 = at(o, g + s * 6, 12);
    B.add(mat.line, post(a[0], a[1], 8, 0.2)); B.add(mat.line, post(b[0], b[1], 8, 0.2));
    B.add(mat.line, curtain([a, b], 7.8, 8.2, false));
    B.add(mat.net, curtain([a, a2, b2, b], 0, 8, false, 1));
  }
}

// ------------------------------------------------------------------ 비치발리볼 (모래 + 네트)
function volleyCourt(B, mat, poly) {
  const o = obb(poly);
  B.add(mat.sand, capGeometry(poly, [], Y0, 1 / 8));
  const h = Math.min(26.2, o.len / 2 - 3), w = Math.min(13.1, o.wid / 2 - 2);
  const c = [at(o, -h, -w), at(o, h, -w), at(o, h, w), at(o, -h, w)];
  for (let i = 0; i < 4; i++) B.add(mat.mat, strip(c[i], c[(i + 1) % 4], 0.2, Y0 + 0.05));   // 청색 경계 테이프
  const a = at(o, 0, -w - 3), b = at(o, 0, w + 3);
  B.add(mat.metal, post(a[0], a[1], 8.5, 0.15)); B.add(mat.metal, post(b[0], b[1], 8.5, 0.15));
  B.add(mat.net, curtain([a, b], 5.0, 7.9, false, 1));
  B.add(mat.line, curtain([a, b], 7.6, 7.9, false));
}

/** 운동 시설 바닥(코트·경기장·모래) 안인지 판정하는 함수 — 풀 포기가 코트·흙 내야 위로 솟지 않도록 거르는 데 쓴다 */
export function sportsCover(data) {
  const polys = [...(data.blocks || []), ...(data.tennis || []), ...(data.pickleball || []), ...(data.volley || []), ...(data.fields || []).map(f => f.poly)];
  const boxes = polys.map(p => { let x0 = 1e9, x1 = -1e9, z0 = 1e9, z1 = -1e9; for (const q of p) { x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]); z0 = Math.min(z0, q[1]); z1 = Math.max(z1, q[1]); } return [x0 - 2, x1 + 2, z0 - 2, z1 + 2]; });
  const pip = (p, x, z) => { let c = false; for (let i = 0, j = p.length - 1; i < p.length; j = i++) { const a = p[i], b = p[j]; if ((a[1] > z) !== (b[1] > z) && x < (b[0] - a[0]) * (z - a[1]) / (b[1] - a[1]) + a[0]) c = !c; } return c; };
  return (x, z) => polys.some((p, i) => x >= boxes[i][0] && x <= boxes[i][1] && z >= boxes[i][2] && z <= boxes[i][3] && pip(p, x, z));
}
