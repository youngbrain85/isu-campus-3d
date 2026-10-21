// 가로(스트리트) 레이어: 영상 검출 주차 차량 + 횡단보도·정지선·노면 화살표·황색 연석 + 신호등·정지 표지·도로명 표지·
// ISU 안내 표지·P 표지·소화전·벤치·휴지통·자전거 거치대·랜턴형 가로등.
// 데이터: assets/street.json (tools/street_data.py). 단위 ft, X=동, Z=남, Y=위.
// 스타일 근거: scratch/sv/* 스트리트뷰 (검은 마스트암 신호, 황색 몸체·녹색 캡 소화전, 황색 연석, 검은 랜턴 가로등, 청색 ISU 표지).
// 모든 시설은 인스턴스 또는 병합 지오메트리. 차량은 카메라 근처 NEAR_N 대만 상세 모델(LOD0), 나머지는 저폴리(LOD1).
import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

const Y_ROAD = 0.15, Y_PAINT = Y_ROAD + 0.045, CURB_H = 0.5, CURB_W = 0.6;
const NEAR_N = 140, NEAR_FT = 700;          // 상세 차량 최대 대수 / 거리

// ------------------------------------------------------------------ 공용 헬퍼
const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _p = new THREE.Vector3(), _s = new THREE.Vector3(1, 1, 1), _Y = new THREE.Vector3(0, 1, 0);
/** heading h: 로컬 +x 가 월드 (cos h, sin h) 를 향하도록 y 축 회전 (-h) */
function xform(x, y, z, h, sc = 1) { _q.setFromAxisAngle(_Y, -h); _p.set(x, y, z); _s.set(sc, sc, sc); return _m.compose(_p, _q, _s).clone(); }

function bx(w, h, d, x, y, z, { rx = 0, ry = 0, rz = 0 } = {}) {   // 중심 (x,y,z) 박스
  const g = new THREE.BoxGeometry(w, h, d);
  if (rx || ry || rz) g.applyMatrix4(new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(rx, ry, rz)));
  g.translate(x, y, z); return g;
}
function cyl(r0, r1, h, x, y, z, seg = 8, axis = 'y') {          // 바닥 중심 (x,y,z), 축 방향
  const g = new THREE.CylinderGeometry(r1, r0, h, seg);
  if (axis === 'y') g.translate(x, y + h / 2, z);
  else if (axis === 'x') { g.rotateZ(-Math.PI / 2); g.translate(x + h / 2, y, z); }
  else { g.rotateX(Math.PI / 2); g.translate(x, y, z + h / 2); }
  return g;
}
function clean(g) {                            // 병합 가능하도록 position/normal/uv(+color) 만, 비인덱스
  g = g.index ? g.toNonIndexed() : g;
  if (!g.attributes.normal) g.computeVertexNormals();
  if (!g.attributes.uv) g.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(g.attributes.position.count * 2), 2));
  for (const k of Object.keys(g.attributes)) if (!['position', 'normal', 'uv', 'color'].includes(k)) g.deleteAttribute(k);
  return g;
}
function merge(list) { const gs = list.filter(Boolean).map(clean); return gs.length ? BufferGeometryUtils.mergeGeometries(gs) : null; }
function tint(g, hex) {                        // 정점 색 지정 (trim 재질용)
  g = clean(g); const c = new THREE.Color(hex), n = g.attributes.position.count, a = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { a[i * 3] = c.r; a[i * 3 + 1] = c.g; a[i * 3 + 2] = c.b; }
  g.setAttribute('color', new THREE.Float32BufferAttribute(a, 3)); return g;
}
function tris(g) { return g ? (g.index ? g.index.count : g.attributes.position.count) / 3 : 0; }

/** list: [[x,z,h,...]] → InstancedMesh */
function instanced(geo, mat, list, y = 0, name = '', { cast = true, sc = null } = {}) {
  if (!geo || !list.length) return null;
  const im = new THREE.InstancedMesh(geo, mat, list.length);
  list.forEach((t, i) => im.setMatrixAt(i, xform(t[0], y, t[1], t[2] || 0, sc ? sc(t) : 1)));
  im.castShadow = cast; im.receiveShadow = true; im.name = name;
  im.computeBoundingSphere();
  return im;
}

function canvasTex(w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}

// ------------------------------------------------------------------ 차량 모델 (로우폴리, 유형 4종)
// 측면 윤곽 ytop(u) (u: 0=뒤, 1=앞), belt = 창 하단 높이, ybot = 차체 하단, r = 바퀴 반지름, ov = 앞뒤 오버행 (L 비율)
const CAR_TYPES = {
  sedan: { L: 15.4, W: 6.0, ybot: 0.85, belt: 3.25, r: 1.08, ov: [0.19, 0.2],
    prof: [[0, 2.3], [0.03, 2.95], [0.18, 3.15], [0.27, 3.25], [0.36, 4.45], [0.44, 4.7], [0.6, 4.7], [0.68, 4.35], [0.75, 3.35], [0.9, 3.05], [0.97, 2.8], [1, 2.2]] },
  suv: { L: 15.9, W: 6.3, ybot: 1.15, belt: 3.95, r: 1.28, ov: [0.17, 0.18],
    prof: [[0, 2.7], [0.02, 3.6], [0.05, 5.35], [0.11, 5.65], [0.6, 5.65], [0.69, 5.0], [0.76, 3.95], [0.9, 3.75], [0.98, 3.35], [1, 2.7]] },
  hatch: { L: 13.6, W: 5.8, ybot: 0.85, belt: 3.3, r: 1.02, ov: [0.15, 0.19],
    prof: [[0, 2.4], [0.02, 3.2], [0.06, 4.45], [0.13, 4.75], [0.55, 4.8], [0.66, 4.3], [0.74, 3.35], [0.9, 3.05], [0.98, 2.7], [1, 2.25]] },
  pickup: { L: 18.6, W: 6.6, ybot: 1.35, belt: 4.35, r: 1.38, ov: [0.15, 0.16],
    prof: [[0, 2.9], [0.01, 4.1], [0.35, 4.15], [0.38, 4.35], [0.41, 6.05], [0.57, 6.15], [0.64, 5.1], [0.69, 4.35], [0.9, 4.15], [0.98, 3.7], [1, 2.9]] },
};

function lerpProf(prof, u) {
  for (let i = 0; i < prof.length - 1; i++) if (u <= prof[i + 1][0]) { const a = prof[i], b = prof[i + 1], t = (u - a[0]) / Math.max(1e-6, b[0] - a[0]); return a[1] + (b[1] - a[1]) * t; }
  return prof[prof.length - 1][1];
}

/** 유형 → {paint, glass, trim(정점색), low} 로컬 지오메트리 (앞 = +x, 중심 원점, 바닥 y=0) */
function carGeometry(T) {
  const { L, W, ybot, belt, prof } = T;
  // 단면 스테이션: 윤곽 꺾임점 + 중간 보간
  const us = [...new Set(prof.map(p => p[0]).concat([0.1, 0.5, 0.84]))].sort((a, b) => a - b);
  const pos = [], paintIdx = [], glassIdx = [];
  const ringN = 10;
  const isCabin = (y) => y > belt + 0.3;
  for (const u of us) {
    const x = -L / 2 + u * L, yt = lerpProf(prof, u);
    const taper = 1 - 0.1 * Math.pow(Math.abs(u - 0.5) * 2, 4);           // 앞뒤 끝 둥글게
    const hw = W / 2 * taper;
    let yS, yG, gw, tw;
    if (isCabin(yt)) { yS = belt; yG = belt + 0.1; gw = 0.94; tw = 0.74; }
    else { yS = Math.max(ybot + 0.7, yt - 0.45); yG = Math.max(yS + 0.05, yt - 0.14); gw = 0.95; tw = 0.84; }
    const ring = [[-hw * 0.9, ybot], [-hw, ybot + 0.55], [-hw * 0.99, yS], [-hw * gw, yG], [-hw * tw, yt]];
    const full = ring.concat(ring.slice().reverse().map(([z, y]) => [-z, y]));
    for (const [z, y] of full) pos.push(x, y, z);
  }
  const S = us.length;
  for (let i = 0; i < S - 1; i++) {
    const ya = lerpProf(prof, us[i]), yb = lerpProf(prof, us[i + 1]);
    const cabA = isCabin(ya), cabB = isCabin(yb);
    for (let k = 0; k < ringN - 1; k++) {
      const a = i * ringN + k, b = a + 1, c = a + ringN, d = c + 1;
      // 측창: 3-4, 5-6 띠 (양 스테이션 모두 객실) / 앞·뒤 유리: 윗면 4-5 띠 중 경사 급한 구간
      const side = (k === 3 || k === 5) && cabA && cabB;
      const shield = k === 4 && (cabA || cabB) && Math.abs(yb - ya) / ((us[i + 1] - us[i]) * L) > 0.35;
      const tgt = side || shield ? glassIdx : paintIdx;
      tgt.push(a, c, b, b, c, d);
    }
  }
  // 앞뒤 마감 (부채꼴)
  for (const [s, flip] of [[0, true], [S - 1, false]]) {
    const o = s * ringN;
    for (let k = 1; k < ringN - 1; k++) flip ? paintIdx.push(o, o + k, o + k + 1) : paintIdx.push(o, o + k + 1, o + k);
  }
  const mk = (idx) => { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); const n = g.toNonIndexed(); n.computeVertexNormals(); return n; };
  let paint = mk(paintIdx), glass = mk(glassIdx);
  // 법선 방향 검사: 위쪽 면 법선이 +y 가 아니면 뒤집기 (감기 순서 실수 방지)
  const fixWinding = (g) => {
    const n = g.attributes.normal, p = g.attributes.position; let up = 0;
    for (let i = 0; i < n.count; i++) if (p.getY(i) > belt) up += n.getY(i);
    if (up < 0) { const a = p.array; for (let i = 0; i < a.length; i += 9) for (let k = 0; k < 3; k++) { const t = a[i + 3 + k]; a[i + 3 + k] = a[i + 6 + k]; a[i + 6 + k] = t; } p.needsUpdate = true; g.computeVertexNormals(); }
    return g;
  };
  paint = fixWinding(paint); glass = fixWinding(glass);
  // 부드러운 음영: 위치 기준 법선 평균 (각진 로우폴리 → 매끈한 차체)
  paint = BufferGeometryUtils.toCreasedNormals(paint, Math.PI / 4.5); glass = BufferGeometryUtils.toCreasedNormals(glass, Math.PI / 5);

  // 바퀴·휠·등화·범퍼·미러 (정점색)
  const trim = [];
  const r = T.r, wx = [L / 2 - T.ov[1] * L - r * 0.2, -L / 2 + T.ov[0] * L + r * 0.2];
  for (const x of wx) for (const sz of [-1, 1]) {
    const z = sz * (W / 2 - 0.45);
    trim.push(tint(cyl(r, r, 0.78, x, r, z - 0.39, 10, 'z'), 0x161616));                       // 타이어
    const rim = new THREE.CircleGeometry(r * 0.62, 8); if (sz < 0) rim.rotateY(Math.PI); rim.translate(x, r, z + sz * 0.4);
    trim.push(tint(rim, 0xb8bcc2));                                                                // 휠
  }
  const yHead = lerpProf(prof, 0.985) - 0.55, yTail = lerpProf(prof, 0.015) - 0.5;
  for (const sz of [-1, 1]) {
    trim.push(tint(bx(0.25, 0.45, 1.2, L / 2 - 0.12, yHead, sz * (W / 2 - 0.95)), 0xf4f1e6));     // 전조등
    trim.push(tint(bx(0.25, 0.5, 1.1, -L / 2 + 0.12, yTail, sz * (W / 2 - 0.85)), 0xa8121a));     // 후미등
    trim.push(tint(bx(0.5, 0.35, 0.18, L * 0.18, belt + 0.25, sz * (W / 2 + 0.05)), 0x1b1b1b));   // 사이드미러
  }
  trim.push(tint(bx(0.45, 0.65, W * 0.94, L / 2 - 0.1, ybot + 0.35, 0), 0x2a2b2d));              // 앞 범퍼
  trim.push(tint(bx(0.45, 0.65, W * 0.94, -L / 2 + 0.1, ybot + 0.35, 0), 0x2a2b2d));             // 뒤 범퍼
  trim.push(tint(bx(0.1, 0.55, W * 0.42, L / 2 - 0.02, yHead - 0.05, 0), 0x202020));             // 그릴
  const trimG = merge(trim);
  // LOD1: 하부 상자 + 객실 사다리꼴 (12+12 삼각형)
  // LOD1: 윗면이 좁은 육면체 하나 (12 삼각형) — 멀리서 보는 차체 실루엣
  const ytopMax = Math.max(...prof.map(p => p[1]));
  const low = new THREE.BoxGeometry(L, ytopMax - ybot * 0.6, W); low.translate(0, (ytopMax + ybot * 0.6) / 2, 0);
  { const p = low.attributes.position; for (let i = 0; i < p.count; i++) if (p.getY(i) > ytopMax - 0.01) { p.setX(i, p.getX(i) * 0.62 - L * 0.04); p.setZ(i, p.getZ(i) * 0.86); } low.computeVertexNormals(); }
  return { paint, glass, trim: trimG, low };
}

// 유형: 영상 길이 측정은 ±2 ft 오차라 확률만 기울인다 (미국 중서부 대학 주차장 구성: 승용 40%, SUV 38%, 해치 12%, 픽업 10%)
function carType(len, k) {
  if (len >= 19) return k < 0.45 ? 'pickup' : 'suv';
  if (len >= 17) return k < 0.2 ? 'pickup' : k < 0.65 ? 'suv' : 'sedan';
  if (len < 13) return k < 0.45 ? 'hatch' : 'sedan';
  return k < 0.45 ? 'sedan' : k < 0.82 ? 'suv' : k < 0.94 ? 'hatch' : 'pickup';
}
function hash(x, z) { const s = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453; return s - Math.floor(s); }

function buildCars(list, stats) {
  const G = new THREE.Group(); G.name = 'cars';
  if (!list.length) return { group: G, update: () => {} };
  const paintMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0.15, roughness: 0.42, clearcoat: 1.0, clearcoatRoughness: 0.1, envMapIntensity: 0.8 });
  const glassMat = new THREE.MeshPhysicalMaterial({ color: 0x05070a, metalness: 0.0, roughness: 0.08, envMapIntensity: 0.55, clearcoat: 1, clearcoatRoughness: 0.03 });
  const trimMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.55, metalness: 0.25 });
  const lowMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.2, roughness: 0.5 });
  const types = Object.keys(CAR_TYPES), geos = {};
  for (const t of types) geos[t] = carGeometry(CAR_TYPES[t]);
  stats.car_tris = Object.fromEntries(types.map(t => [t, tris(geos[t].paint) + tris(geos[t].glass) + tris(geos[t].trim)]));
  stats.car_low_tris = tris(geos.sedan.low);
  // 차량 목록: 위치·방향·색·유형·크기
  const cars = list.map(c => {
    const k = hash(c[0], c[1]), type = carType(c[3], k), T = CAR_TYPES[type];
    let h = c[2] + (hash(c[1], c[0]) < 0.5 ? Math.PI : 0);
    // 영상 색: 그림자/대기 영향으로 탁하므로 채도·명암을 약간 복원하고 sRGB→선형
    const col = new THREE.Color().setRGB(c[4] / 255, c[5] / 255, c[6] / 255, THREE.SRGBColorSpace);
    // 영상의 황록 색조(겨울 대기) 제거: 채도 낮은 색은 무채색(흰·은·회·검)으로, 유채색은 채도 보강
    const chroma = Math.max(c[4], c[5], c[6]) - Math.min(c[4], c[5], c[6]);
    const hsl = {}; col.getHSL(hsl);
    if (chroma < 34) { hsl.s = 0.02; hsl.h = 0.6; } else hsl.s = Math.min(0.85, hsl.s * 1.3);
    hsl.l = Math.min(0.88, hsl.l);
    col.setHSL(hsl.h, hsl.s, hsl.l);
    const sc = THREE.MathUtils.clamp(c[3] / T.L, 0.9, 1.1);
    return { x: c[0], z: c[1], h, type, col, sc, i: -1 };
  });
  // LOD0 (유형별 3 메시) + LOD1 (전체 1 메시)
  const hi = {};
  for (const t of types) {
    const n = cars.filter(c => c.type === t).length; if (!n) continue;
    const cap = Math.min(n, NEAR_N);
    const mk = (g, m, col) => { const im = new THREE.InstancedMesh(g, m, cap); im.count = 0; im.frustumCulled = false; im.castShadow = true; im.receiveShadow = true; im.name = 'car_' + t; if (col) im.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(cap * 3), 3); G.add(im); return im; };
    hi[t] = { paint: mk(geos[t].paint, paintMat, true), glass: mk(geos[t].glass, glassMat), trim: mk(geos[t].trim, trimMat) };
  }
  const lowG = merge([geos.sedan.low]);
  const low = new THREE.InstancedMesh(lowG, lowMat, cars.length); low.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(cars.length * 3), 3);
  low.frustumCulled = false; low.castShadow = true; low.receiveShadow = true; low.name = 'cars_lod1'; G.add(low);
  const ms = cars.map(c => xform(c.x, Y_ROAD - 0.03, c.z, c.h).multiply(new THREE.Matrix4().makeScale(c.sc, 1, 1)));   // 길이만 영상 측정에 맞춤 (폭은 고정 → 옆 차와 겹침 방지)
  const lowMs = cars.map(c => { const T = CAR_TYPES[c.type]; const m = xform(c.x, Y_ROAD - 0.03, c.z, c.h, 1); return m.multiply(new THREE.Matrix4().makeScale(T.L / 15.4 * c.sc, (Math.max(...T.prof.map(p => p[1])) / 4.7), T.W / 6.0)); });
  let last = null;
  const v = new THREE.Vector3();
  function update(cam) {
    if (last && last.distanceToSquared(cam.position) < 400) return;      // 20 ft 이상 움직였을 때만
    last = cam.position.clone();
    const cp = cam.position, d = cars.map((c, i) => [(c.x - cp.x) ** 2 + (c.z - cp.z) ** 2 + cp.y * cp.y * 0.25, i]).sort((a, b) => a[0] - b[0]);
    const near = new Set(); const per = {};
    for (const [dd, i] of d) {
      if (dd > NEAR_FT * NEAR_FT) break;
      const t = cars[i].type; per[t] = per[t] || 0;
      if (!hi[t] || per[t] >= hi[t].paint.instanceMatrix.count) continue;
      if (near.size >= NEAR_N) break;
      near.add(i); per[t]++;
    }
    for (const t in hi) for (const k of ['paint', 'glass', 'trim']) hi[t][k].count = 0;
    let nl = 0;
    cars.forEach((c, i) => {
      if (near.has(i)) {
        const H = hi[c.type], j = H.paint.count;
        for (const k of ['paint', 'glass', 'trim']) { H[k].setMatrixAt(j, ms[i]); H[k].count = j + 1; H[k].instanceMatrix.needsUpdate = true; }
        H.paint.setColorAt(j, c.col); H.paint.instanceColor.needsUpdate = true;
      } else { low.setMatrixAt(nl, lowMs[i]); low.setColorAt(nl, c.col); nl++; }
    });
    low.count = nl; low.instanceMatrix.needsUpdate = true; low.instanceColor.needsUpdate = true;
    stats.cars_near = near.size;
  }
  low.onBeforeRender = (r, s, cam) => update(cam);
  return { group: G, update };
}

// ------------------------------------------------------------------ 노면 표시
function quad(cx, cz, h, len, wid, y) {    // 중심, 장축 방향 h, 길이 len(장축) × 폭 wid 수평 사각형
  const c = Math.cos(h), s = Math.sin(h), px = -s, pz = c;
  const P = [[-len / 2, -wid / 2], [len / 2, -wid / 2], [len / 2, wid / 2], [-len / 2, wid / 2]].map(([u, v]) => [cx + c * u + px * v, y, cz + s * u + pz * v]);
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute([...P[0], ...P[2], ...P[1], ...P[0], ...P[3], ...P[2]], 3));
  g.computeVertexNormals();
  if (g.attributes.normal.getY(0) < 0) { const a = g.attributes.position.array; for (let i = 0; i < a.length; i += 9) for (let k = 0; k < 3; k++) { const t = a[i + 3 + k]; a[i + 3 + k] = a[i + 6 + k]; a[i + 6 + k] = t; } g.computeVertexNormals(); }
  return g;
}

function arrowShape(kind) {     // 로컬: 진행 방향 +x, 길이 ~16 ft (MUTCD 표준 화살표 축약)
  const s = new THREE.Shape();
  const stem = (x0, x1) => { s.moveTo(x0, -0.35); s.lineTo(x1, -0.35); s.lineTo(x1, 0.35); s.lineTo(x0, 0.35); s.lineTo(x0, -0.35); };
  const shapes = [];
  const head = (x, y, ang) => {        // 꼭지 (x,y), 방향 ang
    const h = new THREE.Shape(), c = Math.cos(ang), sn = Math.sin(ang), P = (u, v) => [x + c * u - sn * v, y + sn * u + c * v];
    const pts = [P(0, 0), P(-4, 1.5), P(-4, 0.4), P(-4, -0.4), P(-4, -1.5)];
    h.moveTo(...pts[0]); h.lineTo(...pts[1]); h.lineTo(...pts[4]); h.lineTo(...pts[0]); shapes.push(h);
  };
  const rect = (x0, y0, x1, y1) => { const r = new THREE.Shape(); r.moveTo(x0, y0); r.lineTo(x1, y0); r.lineTo(x1, y1); r.lineTo(x0, y1); r.lineTo(x0, y0); shapes.push(r); };
  if (kind === 'straight' || kind === 'left_straight' || kind === 'right_straight') { rect(-8, -0.35, 4, 0.35); head(8, 0, 0); }
  if (kind === 'left' || kind === 'left_straight') { if (kind === 'left') rect(-8, -0.35, -1, 0.35); rect(-1.35, -0.35, -0.65, 3.0); head(-1, 6.5, Math.PI / 2 + 0.25); }
  if (kind === 'right_straight') { rect(-1.35, -3.0, -0.65, 0.35); head(-1, -6.5, -Math.PI / 2 - 0.25); }
  void stem;
  // Shape 평면 (x, y) → 지면 (x, -?) : 진행 방향 오른쪽 = 화면 아래(+z). shape y(왼쪽 양수) → z = -y
  const g = merge(shapes.map(sh => new THREE.ShapeGeometry(sh)));
  g.rotateX(-Math.PI / 2);         // (x, y) → (x, 0, -y)
  return g;
}

function buildMarkings(S, M, stats) {
  const white = [], yellowCurb = [];
  for (const [x, z, h, span, depth] of S.crosswalks) {
    // 대륙식(사다리): 차도 진행 방향과 평행한 2 ft 막대, 4 ft 간격, 길이 depth
    const n = Math.max(2, Math.floor((span - 2) / 4));
    const px = -Math.sin(h), pz = Math.cos(h);
    for (let k = 0; k < n; k++) { const o = -((n - 1) * 4) / 2 + k * 4; white.push(quad(x + px * o, z + pz * o, h, depth, 2.0, Y_PAINT)); }
  }
  for (const [x, z, h, len] of S.stopbars) white.push(quad(x, z, h, 1.5, len, Y_PAINT));
  const arrows = {};
  for (const [x, z, h, kind] of S.arrows) {
    arrows[kind] = arrows[kind] || arrowShape(kind);
    const g = arrows[kind].clone(); g.applyMatrix4(xform(x, Y_PAINT, z, h)); white.push(g);
  }
  // 황색 연석: 경계석 윗면+양 옆면을 덮는 띠 (직선 구간은 점 병합)
  for (const line of S.yellow_curbs) {
    const P = simplify(line);
    for (let i = 0; i < P.length - 1; i++) {
      const a = P[i], b = P[i + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (L < 0.3) continue;
      const h = Math.atan2(b[1] - a[1], b[0] - a[0]);
      const g = new THREE.BoxGeometry(L + 0.05, CURB_H + 0.04, CURB_W + 0.05, 1, 1, 1);
      g.translate(0, (Y_ROAD - 0.1) + (CURB_H + 0.04) / 2 - 0.01, 0);
      g.applyMatrix4(xform((a[0] + b[0]) / 2, 0, (a[1] + b[1]) / 2, h));
      yellowCurb.push(g);
    }
  }
  const G = new THREE.Group(); G.name = 'markings';
  const wg = merge(white), yg = merge(yellowCurb);
  const paintW = M.paintWhite.clone(); paintW.polygonOffset = true; paintW.polygonOffsetFactor = -2; paintW.polygonOffsetUnits = -2;
  if (wg) { const m = new THREE.Mesh(wg, paintW); m.name = 'crosswalks_stopbars_arrows'; m.receiveShadow = true; G.add(m); }
  const yMat = new THREE.MeshStandardMaterial({ color: 0xe7b416, roughness: 0.75 });
  if (yg) { const m = new THREE.Mesh(yg, yMat); m.name = 'yellow_curbs'; m.receiveShadow = true; G.add(m); }
  stats.markings_tris = tris(wg) + tris(yg);
  return G;
}
function simplify(P) {              // 방향 변화 < 2° 인 중간점 제거
  if (P.length < 3) return P;
  const out = [P[0]];
  for (let i = 1; i < P.length - 1; i++) {
    const a = out[out.length - 1], b = P[i], c = P[i + 1];
    const h1 = Math.atan2(b[1] - a[1], b[0] - a[0]), h2 = Math.atan2(c[1] - b[1], c[0] - b[0]);
    if (Math.abs(Math.atan2(Math.sin(h2 - h1), Math.cos(h2 - h1))) > 0.035) out.push(b);
  }
  out.push(P[P.length - 1]); return out;
}

// ------------------------------------------------------------------ 표지 텍스처
function stopTex() {
  return canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h);
    g.save(); g.translate(w / 2, h / 2); g.fillStyle = '#c4161c';
    g.beginPath(); for (let k = 0; k < 8; k++) { const a = Math.PI / 8 + k * Math.PI / 4; g.lineTo(Math.cos(a) * 118, Math.sin(a) * 118); } g.fill();
    g.fillStyle = '#fff'; g.font = 'bold 74px Arial, Helvetica, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('STOP', 0, 4); g.restore();
  });
}
function nameAtlas(names) {
  const rows = Math.max(1, names.length), H = 64;
  const tex = canvasTex(512, rows * H, (g, w) => {
    names.forEach((n, i) => {
      g.fillStyle = '#0b6b3a'; g.fillRect(0, i * H, w, H);
      g.strokeStyle = '#ffffff'; g.lineWidth = 4; g.strokeRect(4, i * H + 4, w - 8, H - 8);
      g.fillStyle = '#fff'; g.font = 'bold 34px Arial, Helvetica, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText(shortName(n).toUpperCase(), w / 2, i * H + H / 2 + 2);
    });
  });
  return { tex, rows };
}
function shortName(n) { return n.replace(/^North /, 'N ').replace(/ Street$/, ' St').replace(/ Avenue$/, ' Ave'); }
function wayTex() {
  return canvasTex(256, 512, (g, w, h) => {
    g.fillStyle = '#0a3a8c'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#fff'; g.fillRect(0, 0, w, 8);
    g.font = 'bold 30px Arial, Helvetica, sans-serif'; g.textAlign = 'left'; g.textBaseline = 'top';
    g.fillText('INDIANA', 20, 28); g.fillText('STATE', 20, 62); g.fillText('UNIVERSITY', 20, 96);
    g.fillRect(20, 140, w - 40, 3);
    g.font = '24px Arial, Helvetica, sans-serif';
    ['← Library', '→ HMSU', '↑ Normal Hall', '← Parking', '→ Hulman Ctr'].forEach((t, i) => g.fillText(t, 20, 165 + i * 52));
  });
}
function parkTex() {
  return canvasTex(256, 512, (g, w, h) => {
    g.fillStyle = '#123f9c'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#fff'; g.beginPath(); g.arc(w / 2, 96, 76, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#d0202a'; g.beginPath(); g.arc(w / 2, 96, 66, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#fff'; g.font = 'bold 104px Arial, Helvetica, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('P', w / 2, 102);
    g.font = 'bold 38px Arial, Helvetica, sans-serif'; g.textAlign = 'left'; g.textBaseline = 'top';
    g.fillText('ISU', 22, 200); g.fillText('Parking', 22, 242);
    g.font = '22px Arial, Helvetica, sans-serif'; g.fillText('Permit parking', 22, 300); g.fillText('enforced', 22, 328); g.fillText('7am - 5pm', 22, 356);
  });
}

/** 수직 표지판 패널: 로컬 +x 를 바라보는 w×h 판 (앞면 텍스처, 뒷면 금속) 을 (0,y0) 에 */
function panel(w, h, y0, thick = 0.08, uv = [0, 0, 1, 1], xoff = 0) {
  const front = new THREE.PlaneGeometry(w, h); front.rotateY(Math.PI / 2); front.translate(xoff + thick / 2, y0 + h / 2, 0);
  const u = front.attributes.uv; for (let i = 0; i < u.count; i++) u.setXY(i, uv[0] + u.getX(i) * (uv[2] - uv[0]), uv[1] + u.getY(i) * (uv[3] - uv[1]));
  const back = bx(thick, h, w, xoff, y0 + h / 2, 0);
  return { front, back };
}

// ------------------------------------------------------------------ 시설물
function buildFurniture(S, M, stats) {
  const G = new THREE.Group(); G.name = 'street_furniture';
  const black = new THREE.MeshStandardMaterial({ color: 0x15171a, roughness: 0.45, metalness: 0.55 });
  const galv = new THREE.MeshStandardMaterial({ color: 0x9a9da2, roughness: 0.5, metalness: 0.6 });
  const trimMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.5, metalness: 0.2 });
  const add = (o) => { if (o) { G.add(o); stats.furniture_tris = (stats.furniture_tris || 0) + tris(o.geometry) * (o.isInstancedMesh ? o.count : 1); stats.parts[o.name] = (o.isInstancedMesh ? o.count : 1); } };

  // --- 신호등 마스트암 (로컬: +x = 진입 차량 진행 방향, +z = 그 오른쪽; 기둥 원점, 팔은 -z 로)
  const sigByLen = new Map();
  for (const s of S.signals) { const k = Math.round(s[3] / 2) * 2 + '_' + s[4]; if (!sigByLen.has(k)) sigByLen.set(k, []); sigByLen.get(k).push(s); }
  for (const [k, list] of sigByLen) {
    const [armLen, nh] = k.split('_').map(Number);
    const poles = [cyl(0.55, 0.38, 21, 0, 0, 0, 10), cyl(0.9, 0.9, 1.2, 0, 0, 0, 8)];         // 기둥 + 기초 받침
    const arm = new THREE.CylinderGeometry(0.17, 0.3, armLen, 8); arm.rotateX(Math.PI / 2); arm.translate(0, 19.2, -armLen / 2); poles.push(arm);
    const tie = new THREE.CylinderGeometry(0.06, 0.06, Math.hypot(armLen * 0.55, 3.8), 4);
    tie.rotateX(Math.atan2(armLen * 0.55, 3.8)); tie.translate(0, 19.2 + 1.9, -armLen * 0.275); poles.push(tie);         // 보강 타이로드
    poles.push(cyl(0.45, 0.45, 2.5, 0, 9, 0.55, 6));                                                                      // 보행신호 함체
    const heads = [];
    for (let i = 0; i < nh; i++) {
      const z = -armLen + 3 + i * (armLen - 6) / Math.max(1, nh - 1) * (nh > 1 ? 1 : 0) - (nh === 1 ? 0 : 0);
      heads.push(tint(bx(1.15, 3.5, 1.15, 0, 19.2 - 2.0, z), 0x111111));                               // 신호 함체
      heads.push(tint(bx(0.08, 4.4, 2.1, 0.62, 19.2 - 2.0, z), 0x0d0d0d));                             // 배면판 (앞쪽을 향함 = -x 쪽이 운전자)
      const lens = [[0xff2a1a, 0.95], [0x4a3510, 0], [0x0d4a2a, -0.95]];
      for (const [c, dy] of lens) { const d = new THREE.CircleGeometry(0.42, 10); d.rotateY(-Math.PI / 2); d.translate(-0.6, 19.2 - 2.0 + dy, z); heads.push(tint(d, c)); }
    }
    // 보행 신호 (기둥, 교차로 쪽 면)
    heads.push(tint(bx(0.9, 1.2, 0.9, 0, 10.8, 1.1), 0x111111));
    const pg = merge(poles), hg = merge(heads);
    add(instanced(pg, black, list, 0, 'signal_poles'));
    // 신호면은 운전자(-x 방향에서 접근) 를 향해야 함 → 함체를 180° 돌려 렌즈가 -x 를 보게 이미 배치함
    add(instanced(hg, trimMat, list, 0, 'signal_heads'));
  }
  // --- 정지 표지 (로컬 +x = 표지 정면 방향)
  const stopT = stopTex();
  const oct = new THREE.CircleGeometry(1.25, 8); oct.rotateZ(Math.PI / 8); oct.rotateY(Math.PI / 2); oct.translate(0.06, 7.6, 0);
  const octBack = new THREE.CircleGeometry(1.25, 8); octBack.rotateZ(Math.PI / 8); octBack.rotateY(-Math.PI / 2); octBack.translate(-0.02, 7.6, 0);
  add(instanced(merge([oct]), new THREE.MeshStandardMaterial({ map: stopT, roughness: 0.5 }), S.stops, 0, 'stop_faces', { cast: false }));
  add(instanced(merge([cyl(0.1, 0.1, 8.9, -0.12, 0, 0, 6), octBack]), galv, S.stops, 0, 'stop_posts'));

  // --- 도로명 표지 (기둥 + 녹색 날개 2 장; 이름별 아틀라스)
  const names = [...new Set(S.name_signs.flatMap(n => [n[4], n[5]]).filter(Boolean))];
  const atlas = nameAtlas(names.length ? names : ['']);
  const blades = [], posts = [];
  for (const [x, z, h1, h2, n1, n2] of S.name_signs) {
    posts.push(cyl(0.1, 0.1, 10.2, x, 0, z, 6));
    [[h1, n1, 9.0], [h2, n2, 9.65]].forEach(([h, n, y]) => {
      const row = Math.max(0, names.indexOf(n)), v0 = 1 - (row + 1) / atlas.rows, v1 = 1 - row / atlas.rows;
      for (const flip of [0, Math.PI]) {
        const p = new THREE.PlaneGeometry(3.6, 0.55); const u = p.attributes.uv;
        for (let i = 0; i < u.count; i++) u.setXY(i, u.getX(i), v0 + u.getY(i) * (v1 - v0));
        p.applyMatrix4(new THREE.Matrix4().makeRotationY(flip)); p.translate(0, y, 0.03 * (flip ? -1 : 1));
        p.applyMatrix4(xform(x, 0, z, h)); blades.push(p);
      }
    });
  }
  if (blades.length) {
    const m = new THREE.Mesh(merge(blades), new THREE.MeshStandardMaterial({ map: atlas.tex, roughness: 0.5, side: THREE.DoubleSide })); m.name = 'street_name_blades'; add(m);
    const pm = new THREE.Mesh(merge(posts), galv); pm.name = 'street_name_posts'; pm.castShadow = true; add(pm);
  }
  // --- ISU 안내 표지 (청색 기둥형 판, 2 기둥)
  const wp = panel(2.2, 4.6, 2.2, 0.25);
  const wf = S.wayfinding.map(w => [w[0], w[1], w[2] + Math.PI]);       // 판 정면이 교차로(보도) 쪽
  add(instanced(merge([wp.front]), new THREE.MeshStandardMaterial({ map: wayTex(), roughness: 0.55 }), wf, 0, 'wayfinding_faces', { cast: false }));
  add(instanced(merge([tint(wp.back, 0x0a3a8c), tint(cyl(0.12, 0.12, 6.9, -0.05, 0, -0.85, 6), 0x0a2a66), tint(cyl(0.12, 0.12, 6.9, -0.05, 0, 0.85, 6), 0x0a2a66), tint(bx(0.4, 0.3, 2.4, 0, 6.95, 0), 0x0a2a66)]), trimMat, wf, 0, 'wayfinding_body'));
  // --- P 표지 (사진: 청색 세로 판, 단 위)
  const pp = panel(1.6, 3.6, 1.0, 0.3);
  add(instanced(merge([pp.front]), new THREE.MeshStandardMaterial({ map: parkTex(), roughness: 0.55 }), S.psigns, 0, 'psign_faces', { cast: false }));
  add(instanced(merge([tint(pp.back, 0x123f9c), tint(bx(0.5, 1.0, 1.8, 0, 0.5, 0), 0x3a3d42)]), trimMat, S.psigns, 0, 'psign_body'));
  // --- 소화전 (황색 몸체, 녹색 캡: 스트리트뷰 vp5_127)
  const hyProf = [[0, 0], [0.62, 0], [0.62, 0.25], [0.48, 0.32], [0.45, 2.1], [0.55, 2.2], [0.55, 2.38], [0.0, 2.38]].map(([r, y]) => new THREE.Vector2(r, y));
  const body = new THREE.LatheGeometry(hyProf, 8);
  const capProf = [[0.52, 2.36], [0.5, 2.62], [0.32, 2.85], [0.12, 2.95], [0.1, 3.1], [0, 3.12]].map(([r, y]) => new THREE.Vector2(r, y));
  const cap = new THREE.LatheGeometry(capProf, 8);
  const noz = [cyl(0.2, 0.2, 0.42, 0.42, 1.55, 0, 6, 'x'), cyl(0.17, 0.17, 0.38, -0.8, 1.55, 0, 6, 'x'), cyl(0.24, 0.24, 0.42, 0, 1.4, 0.4, 6, 'z')];
  add(instanced(merge([body, ...noz]), new THREE.MeshStandardMaterial({ color: 0xe8c21e, roughness: 0.5, metalness: 0.1 }), S.hydrants, 0, 'hydrant_body'));
  add(instanced(merge([cap]), new THREE.MeshStandardMaterial({ color: 0x0f5a32, roughness: 0.45, metalness: 0.15 }), S.hydrants, 0, 'hydrant_cap'));
  // --- 벤치 (검은 금속 공원 벤치; 로컬 +x = 좌석 길이, +z = 앉는 쪽 정면)
  const bench = [bx(5.6, 0.12, 1.5, 0, 1.45, 0), bx(5.6, 1.25, 0.1, 0, 2.2, -0.82, { rx: -0.18 })];
  for (const x of [-2.4, 2.4]) bench.push(bx(0.15, 2.8, 1.5, x, 1.4, -0.05));                      // 옆 프레임(다리+팔걸이)
  add(instanced(merge(bench), black, S.benches, Y_ROAD + 0.2, 'benches'));
  // --- 휴지통 (검은 원통 + 덮개)
  add(instanced(merge([cyl(1.05, 1.1, 3.2, 0, 0, 0, 8), cyl(1.15, 0.9, 0.5, 0, 3.2, 0, 8)]), black, S.bins, Y_ROAD + 0.2, 'trash_cans'));
  // --- 자전거 거치대 (역 U 자 5 개; 로컬 x = 줄 방향)
  const rack = [];
  for (let i = 0; i < 5; i++) {
    const x = -6 + i * 3;
    rack.push(bx(0.15, 2.7, 0.15, x, 1.35, -1.0), bx(0.15, 2.7, 0.15, x, 1.35, 1.0), bx(0.15, 0.15, 2.15, x, 2.7, 0));
  }
  add(instanced(merge(rack), galv, S.bike_racks, Y_ROAD + 0.2, 'bike_racks'));
  // --- 랜턴형 가로등 (검은 기둥, 사각 랜턴 헤드: 스트리트뷰)
  const lampParts = [cyl(0.55, 0.45, 2.0, 0, 0, 0, 8), cyl(0.28, 0.2, 12.5, 0, 2.0, 0, 8), cyl(0.35, 0.35, 0.5, 0, 14.2, 0, 8),
    cyl(0.75, 0.45, 0.3, 0, 14.6, 0, 6), cyl(0.95, 0.15, 1.0, 0, 17.0, 0, 6), cyl(0.06, 0.06, 0.7, 0, 18.0, 0, 4)];
  const glassG = cyl(0.55, 0.85, 2.1, 0, 14.9, 0, 6);
  const lampGlass = new THREE.MeshStandardMaterial({ color: 0xfff3d6, emissive: 0xffe2a6, emissiveIntensity: 0.35, roughness: 0.3, transparent: true, opacity: 0.92 });
  add(instanced(merge(lampParts), black, S.street_lamps, 0, 'street_lamps'));
  add(instanced(merge([glassG]), lampGlass, S.street_lamps, 0, 'street_lamp_glass', { cast: false }));
  return G;
}

/** 진입점: app.js 에서 buildPaving 다음에 호출. 반환 Group (userData.stats = 삼각형 통계) */
export function buildStreet(site, S, M) {
  const stats = { parts: {} };
  const grp = new THREE.Group(); grp.name = 'street';
  const cars = buildCars(S.cars || [], stats); grp.add(cars.group);
  grp.add(buildMarkings(S, M, stats));
  grp.add(buildFurniture(S, M, stats));
  grp.userData.stats = stats; grp.userData.updateCars = cars.update;
  return grp;
}
