// Dede Plaza 분수 광장 (HMSU 남쪽). 근거: ISU 가상투어 드론 파노라마 fountain/f·d (2024 여름), Esri z20 겨울 영상 방사 밝기 단면.
//   중심 (-104.6, 167.8) = OSM 수면 폴리곤 중심. 반지름(ft):
//     0–12  수반 바닥 중앙의 짙은 별무늬 원판(분수 노즐부), 12–27.5 얕은 수반 (밝은 바닥), 27.5–29.8 석회석 테두리(높이 1.6)
//     29.8–44 무늬 포장 원판 (회색·베이지·갈색 블록), 44–49 짙은 회색 벽돌 띠
//   동쪽(방위 -100°..+100°, 동쪽 축 보도 폭 14 ft 로 끊김) 반원형 계단식 정원:
//     49.5–62 잔디, 62–64.5 흰 연석, 64.5–73 잔디, 73–75 연석, 75–86 짙은 벽돌 원호 보도, 86–100 콘크리트 원호 보도,
//     100–136 화단(관목), 138–152 퍼걸러 (벽돌 기둥 + 흰 마름모 격자 지붕) — 드론 사진의 반원형 트렐리스
//   물줄기: 중앙 수직 분수 1 + 테두리 안쪽에서 중심으로 휘는 아치 분수 24 (드론 사진).
// 좌표 ft, X 동, Z 남, Y 위. 방위각 a: 0 = 동, +90 = 남 (화면 z 축 방향).
import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

export const FOUNTAIN = { c: [-104.6, 167.8], rBasin: 27.5, rRim: 29.8, rPave: 44, rRing: 49, rOuter: 152, arc: [-100, 100] };
const C = FOUNTAIN.c, D2R = Math.PI / 180;

function clean(g) {
  g = g.index ? g.toNonIndexed() : g;
  if (!g.attributes.normal) g.computeVertexNormals();
  if (!g.attributes.uv) g.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(g.attributes.position.count * 2), 2));
  for (const k of Object.keys(g.attributes)) if (!['position', 'normal', 'uv'].includes(k)) g.deleteAttribute(k);
  return g;
}
/** 수평 고리 띠 (r0..r1, 각 a0..a1 도), 높이 y. UV = 월드 xz / uvs */
function ringCap(r0, r1, a0, a1, y, uvs = 1 / 8, seg = 0) {
  const n = seg || Math.max(8, Math.ceil(Math.abs(a1 - a0) / 3)), pos = [], uv = [], idx = [];
  for (let i = 0; i <= n; i++) {
    const a = (a0 + (a1 - a0) * i / n) * D2R;
    for (const r of [r0, r1]) { const x = C[0] + r * Math.cos(a), z = C[1] + r * Math.sin(a); pos.push(x, y, z); uv.push(x * uvs, z * uvs); }
  }
  for (let i = 0; i < n; i++) { const k = i * 2; idx.push(k, k + 2, k + 1, k + 1, k + 2, k + 3); }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx);
  g.computeVertexNormals();
  // 위쪽(+y)을 향하도록 확인
  if (g.attributes.normal.getY(0) < 0) { const ix = g.index.array; for (let i = 0; i < ix.length; i += 3) { const t = ix[i + 1]; ix[i + 1] = ix[i + 2]; ix[i + 2] = t; } g.computeVertexNormals(); }
  return g;
}
/** 고리 모양 벽(높이 y0..y1, 반지름 r, 각 a0..a1) — 양면 재질로 쓴다 */
function ringWall(r, a0, a1, y0, y1) {
  const n = Math.max(8, Math.ceil(Math.abs(a1 - a0) / 3)), pos = [], idx = [];
  for (let i = 0; i <= n; i++) { const a = (a0 + (a1 - a0) * i / n) * D2R, x = C[0] + r * Math.cos(a), z = C[1] + r * Math.sin(a); pos.push(x, y0, z, x, y1, z); }
  for (let i = 0; i < n; i++) { const k = i * 2; idx.push(k, k + 2, k + 1, k + 1, k + 2, k + 3); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
  return g;
}
/** 연석 (단면 w × h, 반지름 rc 중심) = 윗면 + 안·바깥 벽 */
function curb(rc, w, h, a0, a1, y = 0) {
  return [ringCap(rc - w / 2, rc + w / 2, a0, a1, y + h, 1 / 4), ringWall(rc - w / 2, a0, a1, y, y + h), ringWall(rc + w / 2, a0, a1, y, y + h)];
}
/** 동쪽 축 보도(폭 14 ft) 를 피하도록 각 범위를 둘로 나눔 */
function splitAxis(r, a0, a1, half = 7) {
  const g = Math.asin(Math.min(1, half / r)) / D2R;
  return [[a0, -g], [g, a1]];
}

function paverTexture() {
  const N = 256, cv = document.createElement('canvas'); cv.width = cv.height = N;
  const x = cv.getContext('2d'), cols = ['#a39a8c', '#8b8479', '#b4a993', '#77716a', '#9a8f7c', '#bdb19c'];
  let s = 7; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
  x.fillStyle = '#6f6a63'; x.fillRect(0, 0, N, N);
  const t = 16;                          // 블록 1 장 = 16 px (텍스처 1 장 = 4 ft → 블록 0.25 ft? 아님: UV 스케일로 1 블록 ≈ 0.75 ft)
  for (let i = 0; i < N / t; i++) for (let j = 0; j < N / (t * 2); j++) {
    x.fillStyle = cols[Math.floor(r() * cols.length)];
    x.fillRect(j * t * 2 + (i % 2) * t + 1, i * t + 1, t * 2 - 2, t - 2);
  }
  const tex = new THREE.CanvasTexture(cv); tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  return tex;
}
function streakTexture() {
  // 가로(u) = 물줄기 진행 방향. 물방울 덩어리가 듬성듬성 이어지는 알파 무늬 (흰색 = 보임)
  const W = 256, H = 16, cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  const x = cv.getContext('2d'); x.fillStyle = '#262626'; x.fillRect(0, 0, W, H);   // 바탕도 옅게 보여 물줄기가 끊겨 보이지 않게
  let s = 11; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < 14; i++) {
    const cx = (i + r() * 0.5) / 14 * W, w = 4 + r() * 7, g = x.createLinearGradient(cx - w, 0, cx + w, 0);
    g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.5, `rgba(255,255,255,${0.55 + r() * 0.45})`); g.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = g; x.fillRect(cx - w, 0, 2 * w, H); x.fillRect(cx - w - W, 0, 2 * w, H); x.fillRect(cx - w + W, 0, 2 * w, H);
  }
  const t = new THREE.CanvasTexture(cv); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(2, 1);
  return t;
}
function latticeTexture() {
  const N = 128, cv = document.createElement('canvas'); cv.width = cv.height = N;
  const x = cv.getContext('2d'); x.strokeStyle = '#f1efe9'; x.lineWidth = 9;
  for (let i = -N; i <= 2 * N; i += 32) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i + N, N); x.stroke(); x.beginPath(); x.moveTo(i, N); x.lineTo(i + N, 0); x.stroke(); }
  x.lineWidth = 12; x.strokeRect(0, 0, N, N);
  const tex = new THREE.CanvasTexture(cv); tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
function starTexture() {
  const N = 256, cv = document.createElement('canvas'); cv.width = cv.height = N;
  const x = cv.getContext('2d'); x.fillStyle = '#7d8a8f'; x.fillRect(0, 0, N, N);
  x.fillStyle = '#4b4f52'; x.beginPath();
  for (let i = 0; i < 32; i++) { const a = i / 32 * Math.PI * 2, r = i % 2 ? 0.30 : 0.45; x.lineTo(N / 2 + Math.cos(a) * r * N, N / 2 + Math.sin(a) * r * N); }
  x.fill(); x.fillStyle = '#7a3b2c'; x.beginPath(); x.arc(N / 2, N / 2, N * 0.06, 0, Math.PI * 2); x.fill();
  const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function buildFountain(M, tex) {
  const parts = new Map();
  const add = (mat, g) => { if (!parts.has(mat)) parts.set(mat, []); parts.get(mat).push(clean(g)); };
  const concrete = M.walk.clone(); concrete.color = new THREE.Color(0.86, 0.86, 0.86); concrete.name = 'fountain_concrete';
  const limestone = M.limestone, brick = M.brick_red;
  const pavers = new THREE.MeshStandardMaterial({ map: paverTexture(), roughness: 0.85, name: 'fountain_pavers' });
  const charcoal = new THREE.MeshStandardMaterial({ map: tex('asphalt.jpg'), color: 0x8a8c90, roughness: 0.9, name: 'fountain_charcoal' });
  const grass = new THREE.MeshStandardMaterial({ map: tex('grass_detail.jpg'), color: 0x8fb45f, roughness: 1, name: 'fountain_lawn' });
  grass.map = grass.map.clone(); grass.map.repeat.set(1, 1); grass.map.needsUpdate = true;
  const mulch = new THREE.MeshStandardMaterial({ color: 0x5a4636, roughness: 1, name: 'fountain_mulch' });
  const shrub = new THREE.MeshStandardMaterial({ map: tex('foliage.jpg'), color: 0x7f9f5a, roughness: 0.95, name: 'fountain_shrub' });
  const floor = new THREE.MeshStandardMaterial({ map: starTexture(), roughness: 0.7, name: 'fountain_floor' });
  const water = new THREE.MeshPhysicalMaterial({ color: 0x31505c, roughness: 0.04, metalness: 0.0, transmission: 0, transparent: true, opacity: 0.82, envMapIntensity: 1.4, name: 'fountain_water' });
  const spray = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x9aaab4, emissiveIntensity: 0.5, transparent: true, opacity: 0.85, roughness: 0.2, depthWrite: false, name: 'fountain_spray' });
  // 물줄기 애니메이션: 관(Tube)의 UV.x 는 물줄기 진행 방향 → 물방울 무늬 alphaMap 을 흘려 보낸다
  const streak = streakTexture();
  const jet = spray.clone(); jet.name = 'fountain_jets'; jet.alphaMap = streak; jet.alphaTest = 0.02; jet.opacity = 0.9;
  const column = spray.clone(); column.name = 'fountain_column'; column.alphaMap = streak.clone(); column.alphaMap.repeat.set(1, 3); column.alphaMap.needsUpdate = true; column.alphaTest = 0.02;
  water.normalMap = tex('asphalt_n.jpg', { srgb: false }); water.normalMap = water.normalMap.clone(); water.normalMap.repeat.set(6, 6); water.normalMap.needsUpdate = true; water.normalScale = new THREE.Vector2(0.25, 0.25);
  const lattice = new THREE.MeshStandardMaterial({ map: latticeTexture(), alphaTest: 0.5, transparent: false, side: THREE.DoubleSide, roughness: 0.6, name: 'fountain_lattice' });
  lattice.map.repeat.set(1, 1);
  const metal = M.dark;
  const F = FOUNTAIN, Y = 0.36;               // 보도(0.35)보다 살짝 위

  // ---- 수반
  add(floor, (() => { const g = new THREE.CircleGeometry(F.rBasin, 64); g.rotateX(-Math.PI / 2); g.translate(C[0], 0.25, C[1]); return g; })());
  add(water, (() => { const g = new THREE.CircleGeometry(F.rBasin, 64); g.rotateX(-Math.PI / 2); g.translate(C[0], 0.95, C[1]); return g; })());
  for (const g of curb((F.rBasin + F.rRim) / 2, F.rRim - F.rBasin, 1.6, -180, 180, 0)) add(limestone, g);
  // ---- 포장 원판 + 짙은 띠
  add(pavers, ringCap(F.rRim, F.rPave, -180, 180, Y, 1 / 3, 120));
  add(charcoal, ringCap(F.rPave, F.rRing, -180, 180, Y, 1 / 8, 120));
  // ---- 동쪽 계단식 정원 (축 보도에서 끊김)
  const [A0, A1] = F.arc;
  const bands = [[49.5, 62, grass], [64.5, 73, grass], [75, 86, charcoal], [86, 100, concrete], [100, 136, mulch]];
  for (const [r0, r1, mat] of bands) for (const [a, b] of splitAxis(r0, A0, A1)) add(mat, ringCap(r0, r1, a, b, mat === grass || mat === mulch ? 0.2 : Y, mat === grass ? 1 / 14 : 1 / 8));
  for (const rc of [63.25, 74, 136.8]) for (const [a, b] of splitAxis(rc, A0, A1)) for (const g of curb(rc, rc === 136.8 ? 1.6 : 2.5, 0.6, a, b)) add(concrete, g);
  // 동쪽 축 보도 (r 49 → 152, 폭 14)
  add(concrete, (() => { const g = new THREE.PlaneGeometry(F.rOuter - F.rRing + 4, 14); g.rotateX(-Math.PI / 2); g.translate(C[0] + (F.rRing + F.rOuter) / 2, Y, C[1]); return g; })());
  // 화단 관목 (원호를 따라 둥근 덩어리)
  let seed = 3; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (let a = A0 + 4; a < A1 - 3; a += 5.5) {
    if (Math.abs(a) < 6) continue;
    for (const r of [106, 118, 129]) {
      const aa = (a + (rnd() - 0.5) * 3) * D2R, rr = r + (rnd() - 0.5) * 4, s = 2.4 + rnd() * 1.8;
      const g = new THREE.IcosahedronGeometry(1, 1); g.scale(s, s * 0.7, s); g.translate(C[0] + rr * Math.cos(aa), s * 0.55, C[1] + rr * Math.sin(aa)); add(shrub, g);
    }
  }
  // ---- 퍼걸러: 벽돌 기둥(안·밖 2 열) + 석회석 캡 + 마름모 격자 지붕 + 보
  const P0 = 140, P1 = 150, PH = 10;
  for (const [a, b] of splitAxis(P0, A0, A1, 9)) {
    const n = Math.max(1, Math.round(Math.abs(b - a) / 9));
    for (let i = 0; i <= n; i++) {
      const t = (a + (b - a) * i / n) * D2R;
      for (const r of [P0, P1]) {
        const x = C[0] + r * Math.cos(t), z = C[1] + r * Math.sin(t);
        const g = new THREE.BoxGeometry(1.8, PH, 1.8); g.rotateY(-t); g.translate(x, PH / 2, z); add(brick, g);
        const c = new THREE.BoxGeometry(2.3, 0.5, 2.3); c.rotateY(-t); c.translate(x, PH + 0.25, z); add(limestone, c);
      }
    }
    add(lattice, ringCap(P0 - 1.5, P1 + 1.5, a, b, PH + 0.9, 1 / 6));
    for (const r of [P0, P1]) add(limestone, ringWall(r, a, b, PH + 0.5, PH + 1.3));
  }
  // ---- 물줄기: 중앙 수직 + 아치 24 개
  // 중앙 물줄기는 높이를 맥동시키므로 별도 메시 (아래 colMesh)
  for (let i = 0; i < 24; i++) {
    const a = i / 24 * Math.PI * 2, s = [Math.cos(a), Math.sin(a)];
    const p0 = new THREE.Vector3(C[0] + s[0] * 25.5, 1.0, C[1] + s[1] * 25.5), p2 = new THREE.Vector3(C[0] + s[0] * 13, 1.0, C[1] + s[1] * 13);
    const p1 = new THREE.Vector3(C[0] + s[0] * 19, 7.5, C[1] + s[1] * 19);
    add(jet, new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(p0, p1, p2), 14, 0.32, 6, false));
  }
  // ---- 벤치 6, 가로등 4 (포장 원판 바깥 띠 위)
  for (let i = 0; i < 6; i++) {
    const a = (i * 60 + 30) * D2R, r = 46.5, x = C[0] + r * Math.cos(a), z = C[1] + r * Math.sin(a);
    const seat = new THREE.BoxGeometry(1.6, 0.15, 6); seat.rotateY(-a); seat.translate(x, 1.5, z); add(metal, seat);
    const back = new THREE.BoxGeometry(0.15, 1.3, 6); back.rotateY(-a); back.translate(x + Math.cos(a) * 0.8, 2.2, z + Math.sin(a) * 0.8); add(metal, back);
    for (const k of [-2.5, 2.5]) { const l = new THREE.BoxGeometry(1.4, 1.5, 0.2); l.translate(0, 0.75, k); l.rotateY(-a); l.translate(x, 0, z); add(metal, l); }
  }
  for (let i = 0; i < 4; i++) {
    const a = (i * 90 + 45) * D2R, r = 48, x = C[0] + r * Math.cos(a), z = C[1] + r * Math.sin(a);
    const p = new THREE.CylinderGeometry(0.2, 0.3, 12, 8); p.translate(x, 6, z); add(metal, p);
    const h = new THREE.SphereGeometry(0.75, 10, 8); h.translate(x, 12.7, z); add(spray, h);
  }
  const G = new THREE.Group(); G.name = 'fountain';
  for (const [mat, gs] of parts) {
    const m = new THREE.Mesh(BufferGeometryUtils.mergeGeometries(gs), mat);
    m.receiveShadow = true; m.castShadow = ![water, spray, jet, grass, mulch, pavers, charcoal, floor].includes(mat); m.name = mat.name || 'fountain';
    G.add(m);
  }
  // 중앙 수직 물줄기 + 물보라 (원점 = 수면, 높이 1 단위로 만들고 scale.y 로 맥동)
  const colG = new THREE.CylinderGeometry(0.25, 0.7, 1, 10, 1, true); colG.translate(0, 0.5, 0);
  const colMesh = new THREE.Mesh(colG, column); colMesh.position.set(C[0], 0.95, C[1]); colMesh.scale.set(1, 9, 1); colMesh.name = 'fountain_column';
  const crown = new THREE.Mesh(new THREE.SphereGeometry(1.4, 12, 8), spray); crown.scale.set(1, 0.7, 1); crown.name = 'fountain_crown';
  G.add(colMesh, crown);
  /** t = 초. 물방울 무늬를 흘리고, 중앙 물줄기 높이(8.2~10 ft)를 맥동, 수면 잔물결 이동 */
  G.userData.update = (t) => {
    streak.offset.x = -t * 1.6;                       // 아치 물줄기: 테두리 → 중심 방향으로 흐름
    column.alphaMap.offset.y = -t * 2.2;              // 중앙 물줄기: 위로 솟음
    const h = 9 + 0.8 * Math.sin(t * 2.3) + 0.3 * Math.sin(t * 5.1);
    colMesh.scale.y = h; crown.position.set(C[0], 0.95 + h + 0.2, C[1]);
    const s = 1 + 0.12 * Math.sin(t * 4.7); crown.scale.set(s, 0.7 * s, s);
    water.normalMap.offset.set(t * 0.03, t * 0.021);
  };
  G.userData.update(0);
  return G;
}

/** 분수 광장이 덮는 곳 (풀 포기·나무·지면 레이어 제외용) */
export function fountainCover(x, z, margin = 0) {
  const dx = x - C[0], dz = z - C[1], r = Math.hypot(dx, dz);
  if (r < FOUNTAIN.rRing + margin) return true;
  const a = Math.atan2(dz, dx) / D2R;
  return r < FOUNTAIN.rOuter + 2 + margin && a > FOUNTAIN.arc[0] - 2 && a < FOUNTAIN.arc[1] + 2;
}
