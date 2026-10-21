// 지면: 잔디 기본면 + 차도(아스팔트·경계석·차선) + 보도(벽돌 포장/콘크리트) + 주차장(아스팔트·주차선) + 가로등. (차량·가로 시설은 street.js)
// 위성영상 타일은 선택적 오버레이(기본 꺼짐). 스트리트뷰(2020–2023) 확인: 핵심부 보도 벽돌 포장, 외곽 콘크리트, 경계석, 검은 가로등.
import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import { capGeometry, mergeByMaterial, box } from './geom.js';

const Y_LOT = 0.12, Y_ROAD = 0.15, Y_PATH = 0.35, Y_LINE = 0.03, CURB_H = 0.5, CURB_W = 0.6;

/** 잔디 기본면 (범위 사각형) — 2 단계 디테일 텍스처 + 저주파 색 변이 */
export function buildGrassBase(site, M, tex) {
  const c = site.clip, w = c[2] - c[0], h = c[3] - c[1];
  // 큰 단일 사각형은 카메라 뒤까지 뻗으면 로그 깊이 보간이 깨져 아래 층이 위로 비친다 → 약 100 ft 격자로 분할
  const geo = new THREE.PlaneGeometry(w, h, Math.ceil(w / 100), Math.ceil(h / 100)); geo.rotateX(-Math.PI / 2);
  const detail = tex('grass_detail.jpg'), vari = tex('grass_var.jpg'), nrm = tex('grass_n.jpg', { srgb: false });
  const mat = new THREE.MeshStandardMaterial({ map: detail, normalMap: nrm, normalScale: new THREE.Vector2(0.35, 0.35), roughness: 1.0, color: 0x8ca65a });
  mat.map.repeat.set(w / 14, h / 14); mat.normalMap.repeat.set(w / 14, h / 14);
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.variMap = { value: vari }; sh.uniforms.variRepeat = { value: new THREE.Vector2(w / 420, h / 420) };
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <map_pars_fragment>', '#include <map_pars_fragment>\nuniform sampler2D variMap; uniform vec2 variRepeat;')
      .replace('#include <map_fragment>', `#include <map_fragment>
        vec2 vuv = vMapUv / vec2(${(w / 14).toFixed(3)}, ${(h / 14).toFixed(3)}) * variRepeat;
        vec3 vr = texture2D(variMap, vuv).rgb;
        vec3 vr2 = texture2D(variMap, vuv * 7.3 + 0.37).rgb;
        diffuseColor.rgb *= (vr * 0.9 + 0.35) * (vr2 * 0.5 + 0.7);`);
  };
  mat.customProgramCacheKey = () => 'grass-base';
  const m = new THREE.Mesh(geo, mat);
  m.position.set((c[0] + c[2]) / 2, 0, (c[1] + c[3]) / 2); m.receiveShadow = true; m.name = 'grass_base';
  // 범위 밖 지면(스커트): 범위 사각형과 겹치지 않도록 둘레 4 개 띠로 만든다. 겹치면 특정 시점에서 깊이 정밀도 문제로
  // 스커트가 잔디·아스팔트 위로 비쳐 보였다 (Scott 프리셋에서 재현). 각 띠도 격자로 분할.
  const R = 20000, bands = [[-R, -R, R, c[1]], [-R, c[3], R, R], [-R, c[1], c[0], c[3]], [c[2], c[1], R, c[3]]];
  const sk = bands.map(([x0, z0, x1, z1]) => {
    const g = new THREE.PlaneGeometry(x1 - x0, z1 - z0, Math.max(1, Math.ceil((x1 - x0) / 800)), Math.max(1, Math.ceil((z1 - z0) / 800)));
    g.rotateX(-Math.PI / 2); g.translate((x0 + x1) / 2, 0, (z0 + z1) / 2); return g;
  });
  const skirt = new THREE.Mesh(BufferGeometryUtils.mergeGeometries(sk), M.ground_flat);
  skirt.position.y = -0.05; skirt.receiveShadow = true; skirt.name = 'skirt';
  const grp = new THREE.Group(); grp.name = 'ground'; grp.add(m, skirt);
  return grp;
}

/** 위성영상 오버레이 (선택) */
export function buildImagery(site, tex) {
  const g = site.ground, c = site.clip;
  const grp = new THREE.Group(); grp.name = 'imagery'; grp.userData.tiles = [];
  for (let r = 0; r < g.tiles; r++) for (let cc = 0; cc < g.tiles; cc++) {
    const t = tex(`ground_${r}_${cc}.jpg`, { aniso: 16 }); t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
    grp.userData.tiles.push({ tex: t, x0: c[0] + cc * g.tile_w, z0: c[1] + r * g.tile_h, w: g.tile_w, h: g.tile_h });
    const geo = new THREE.PlaneGeometry(g.tile_w, g.tile_h); geo.rotateX(-Math.PI / 2);
    const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: t, roughness: 1.0, transparent: true, opacity: 0.85, depthWrite: false }));
    m.position.set(c[0] + (cc + 0.5) * g.tile_w, 0.6, c[1] + (r + 0.5) * g.tile_h); m.name = `imagery_${r}_${cc}`;
    grp.add(m);
  }
  return grp;
}

/** 차도·보도·주차장·차선·경계석·주차 차량 */
export function buildPaving(site, M, tex) {
  const parts = [];
  const roads = [], paths = { pavers: [], concrete: [] }, curbs = [], yellow = [], white = [], lots = [], stripes = [];
  for (const r of site.roads) {
    if (r.kind === 'road') {
      roads.push(ribbon(r.pts, r.w, Y_ROAD));
      if (r.hw !== 'service') {
        for (const side of [-1, 1]) curbs.push(curbRibbon(r.pts, r.w / 2 + CURB_W / 2, side));
        if (!r.oneway && r.w >= 30) yellow.push(dashed(r.pts, 0, 0.5, 10, 20, Y_ROAD + Y_LINE));       // 중앙 황색 파선
        if (r.oneway && (r.lanes >= 2 || r.w >= 40)) {                                                  // 일방통행 다차선: 백색 파선
          const n = Math.max(2, r.lanes || Math.round(r.w / 12));
          for (let k = 1; k < n; k++) white.push(dashed(r.pts, -r.w / 2 + k * r.w / n, 0.4, 10, 20, Y_ROAD + Y_LINE));
        }
        if (r.hw === 'primary' || r.hw === 'trunk' || r.hw === 'secondary') for (const side of [-1, 1]) white.push(dashed(r.pts, side * (r.w / 2 - 1.2), 0.4, 1e6, 0, Y_ROAD + Y_LINE));
      }
    } else {
      (r.surface === 'pavers' ? paths.pavers : paths.concrete).push(ribbon(r.pts, r.w, Y_PATH));
    }
  }
  for (const a of site.areas) {
    if (a.poly.length < 3) continue;
    try {
      if (a.kind === 'parking') { lots.push(capGeometry(a.poly, [], Y_LOT, 1 / 24)); stripes.push(...lotStripes(a.poly)); }
      else if (a.kind === 'pitch') parts.push({ geom: capGeometry(a.poly, [], 0.1, 1 / 24), mat: M.pitch, cast: false });
      else if (a.kind === 'water') parts.push({ geom: capGeometry(a.poly, [], 0.05, 1 / 24), mat: M.water, cast: false });
    } catch (e) { /* 자기교차 등 */ }
  }
  const asphalt = M.asphalt.clone(); asphalt.normalMap = tex('asphalt_n.jpg', { srgb: false }); asphalt.normalScale = new THREE.Vector2(0.3, 0.3);
  const lotMat = asphalt.clone(); lotMat.color = new THREE.Color(0x9a9a98);
  const pavers = new THREE.MeshStandardMaterial({ map: tex('pavers.jpg'), roughness: 0.9, color: 0xd9c4b0 }); pavers.map.repeat.set(1, 1);
  if (roads.length) parts.push({ geom: BufferGeometryUtils.mergeGeometries(roads), mat: asphalt, cast: false, name: 'roads' });
  if (lots.length) parts.push({ geom: BufferGeometryUtils.mergeGeometries(lots), mat: lotMat, cast: false, name: 'lots' });
  if (paths.pavers.length) parts.push({ geom: BufferGeometryUtils.mergeGeometries(paths.pavers.map(g => scaleUV(g, 24 / 10.7))), mat: pavers, cast: false, name: 'paths_pavers' });
  if (paths.concrete.length) parts.push({ geom: BufferGeometryUtils.mergeGeometries(paths.concrete.map(g => scaleUV(g, 24 / 5))), mat: M.walk, cast: false, name: 'paths_concrete' });
  if (curbs.length) parts.push({ geom: BufferGeometryUtils.mergeGeometries(curbs), mat: M.curb, cast: false, name: 'curbs' });
  if (yellow.length) parts.push({ geom: BufferGeometryUtils.mergeGeometries(yellow), mat: M.paintYellow, cast: false, name: 'lines_yellow' });
  if (white.length || stripes.length) parts.push({ geom: BufferGeometryUtils.mergeGeometries([...white, ...stripes]), mat: M.paintWhite, cast: false, name: 'lines_white' });
  const grp = new THREE.Group(); grp.name = 'paving';
  for (const m of mergeByMaterial(parts)) grp.add(m);
  // 주차 차량은 viewer/lib/street.js (영상 검출 위치, tools/street_data.py) 에서 배치
  grp.add(buildLamps(site, M));
  return grp;
}

/** 폴리라인을 폭 w 의 리본(수평면)으로. 꼭짓점에서 이등분선 오프셋(마이터). offset = 중심선에서 옆으로 이동(ft) */
export function ribbon(pts, w, y, offset = 0) {
  const n = pts.length; if (n < 2) return new THREE.BufferGeometry();
  const pos = [], uv = [], idx = []; let s = 0;
  for (let i = 0; i < n; i++) {
    const p = pts[i], a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)];
    let tx = b[0] - a[0], tz = b[1] - a[1]; const l = Math.hypot(tx, tz) || 1; tx /= l; tz /= l;
    const nx = -tz, nz = tx; let scale = 1;
    if (i > 0 && i < n - 1) {
      const d1 = norm2(p[0] - a[0], p[1] - a[1]), d2 = norm2(b[0] - p[0], b[1] - p[1]);
      const cosT = d1[0] * d2[0] + d1[1] * d2[1];
      scale = Math.min(1.8, 1 / Math.max(0.55, Math.sqrt((1 + cosT) / 2)));
    }
    if (i > 0) s += Math.hypot(p[0] - a[0], p[1] - a[1]);
    for (const k of [-1, 1]) { const o = (offset + k * w / 2) * scale; pos.push(p[0] + nx * o, y, p[1] + nz * o); uv.push((k + 1) / 2 * w / 24, s / 24); }
  }
  for (let i = 0; i < n - 1; i++) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }   // 위에서 봤을 때 CCW → 법선 +y
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx); g.computeVertexNormals();
  return g;
}

/** 파선/실선: 중심선에서 offset 만큼 옆, 폭 w, 길이 dash 간격 gap. gap=0 이면 실선 */
function dashed(pts, offset, w, dash, gap, y) {
  const segs = [];
  const n = pts.length; let s = 0, on = true, left = dash;
  const out = [];
  for (let i = 0; i < n - 1; i++) {
    const a = pts[i], b = pts[i + 1]; const L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (L < 0.01) continue;
    const dx = (b[0] - a[0]) / L, dz = (b[1] - a[1]) / L, nx = -dz, nz = dx;
    let t = 0;
    while (t < L) {
      const step = Math.min(left, L - t);
      if (on) {
        const p0 = [a[0] + dx * t + nx * offset, a[1] + dz * t + nz * offset], p1 = [a[0] + dx * (t + step) + nx * offset, a[1] + dz * (t + step) + nz * offset];
        out.push(ribbon([p0, p1], w, y));
      }
      t += step; left -= step;
      if (left <= 0 && gap > 0) { on = !on; left = on ? dash : gap; }
      if (gap === 0) left = 1e9;
    }
  }
  return out.length ? BufferGeometryUtils.mergeGeometries(out) : new THREE.BufferGeometry();
}

/** 경계석: 도로 가장자리를 따라 작은 박스 연속 */
function curbRibbon(pts, offset, side) {
  const boxes = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1]; const L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (L < 0.5) continue;
    const dx = (b[0] - a[0]) / L, dz = (b[1] - a[1]) / L, nx = -dz * side * offset, nz = dx * side * offset;
    boxes.push(box(L, CURB_H, CURB_W, (a[0] + b[0]) / 2 + nx, Y_ROAD - 0.1, (a[1] + b[1]) / 2 + nz, { ry: -Math.atan2(dz, dx) }));
  }
  return boxes.length ? BufferGeometryUtils.mergeGeometries(boxes) : new THREE.BufferGeometry();
}

/** 주차장 주차선: 폴리곤의 최장변 방향을 통로 방향으로 보고, 직각 방향 9 ft 간격 18 ft 길이 백색선 (통로 24 ft 띄움) */
function lotStripes(poly) {
  const { c, s, u0, u1, v0, v1 } = obb(poly);
  const out = [];
  const inPoly = (x, z) => pointInPoly([x, z], poly);
  const toW = (u, v) => [u * c - v * s, u * s + v * c];
  // v 방향으로 [18 stall][24 aisle][18 stall] 반복, u 방향 9 ft 피치
  let v = v0 + 2;
  while (v + 18 < v1) {
    for (let u = u0 + 4; u < u1 - 4; u += 9) {
      const p0 = toW(u, v), p1 = toW(u, v + 18);
      if (inPoly(...p0) && inPoly(...p1)) out.push(ribbon([p0, p1], 0.35, Y_LOT + Y_LINE));
    }
    v += 18 + 24 + 18;
    if (v + 18 < v1) { for (let u = u0 + 4; u < u1 - 4; u += 9) { const p0 = toW(u, v - 18 - 24), p1 = toW(u, v - 24); if (inPoly(...p0) && inPoly(...p1)) out.push(ribbon([p0, p1], 0.35, Y_LOT + Y_LINE)); } }
  }
  return out;
}

/** 가로등: 핵심부 보도를 따라 90 ft 간격, 보도 가장자리에서 3 ft (검은 기둥 12 ft + 등기구) */
function buildLamps(site, M) {
  const G = new THREE.Group(); G.name = 'lamps';
  const core = site.core; const pts = [];
  for (const r of site.roads) {
    if (r.kind !== 'path' || r.w < 7) continue;
    const mid = r.pts[Math.floor(r.pts.length / 2)];
    if (!(mid[0] >= core[0] && mid[0] <= core[2] && mid[1] >= core[1] && mid[1] <= core[3])) continue;
    let acc = 45;
    for (let i = 0; i < r.pts.length - 1; i++) {
      const a = r.pts[i], b = r.pts[i + 1]; const L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (L < 0.1) continue;
      const dx = (b[0] - a[0]) / L, dz = (b[1] - a[1]) / L;
      let t = acc;
      while (t < L) { pts.push([a[0] + dx * t - dz * (r.w / 2 + 3), a[1] + dz * t + dx * (r.w / 2 + 3)]); t += 90; }
      acc = t - L;
    }
  }
  if (!pts.length) return G;
  // 스트리트뷰: 검은 받침 + 가는 기둥 + 육각 랜턴(유리) + 갓 + 꼭지 장식
  const cy = (r0, r1, h, y, seg = 8) => { const g = new THREE.CylinderGeometry(r1, r0, h, seg); g.translate(0, y + h / 2, 0); return g.toNonIndexed(); };
  const geo = BufferGeometryUtils.mergeGeometries([cy(0.5, 0.42, 1.8, 0), cy(0.24, 0.18, 10.4, 1.8), cy(0.3, 0.3, 0.4, 12.2),
    cy(0.62, 0.38, 0.25, 12.6, 6), cy(0.8, 0.12, 0.9, 14.55, 6), cy(0.05, 0.05, 0.6, 15.45, 4)]);
  const glass = cy(0.45, 0.72, 1.7, 12.85, 6);
  const dark = new THREE.MeshStandardMaterial({ color: 0x15171a, roughness: 0.45, metalness: 0.55 });
  const glassMat = new THREE.MeshStandardMaterial({ color: 0xfff3d6, emissive: 0xffe2a6, emissiveIntensity: 0.35, roughness: 0.3 });
  const im = new THREE.InstancedMesh(geo, dark, pts.length), ig = new THREE.InstancedMesh(glass, glassMat, pts.length);
  const mtx = new THREE.Matrix4();
  pts.forEach((p, i) => { mtx.makeTranslation(p[0], 0, p[1]); im.setMatrixAt(i, mtx); ig.setMatrixAt(i, mtx); });
  im.castShadow = true; im.name = 'lamps'; ig.name = 'lamp_glass'; G.add(im, ig);
  return G;
}

function obb(poly) {
  let best = 0, bl = -1;
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length]; const l = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (l > bl) { bl = l; best = Math.atan2(b[1] - a[1], b[0] - a[0]); }
  }
  const c = Math.cos(best), s = Math.sin(best);
  let u0 = 1e9, u1 = -1e9, v0 = 1e9, v1 = -1e9;
  for (const p of poly) { const u = p[0] * c + p[1] * s, v = -p[0] * s + p[1] * c; u0 = Math.min(u0, u); u1 = Math.max(u1, u); v0 = Math.min(v0, v); v1 = Math.max(v1, v); }
  return { c, s, u0, u1, v0, v1 };
}
function pointInPoly(p, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0], zi = poly[i][1], xj = poly[j][0], zj = poly[j][1];
    if (((zi > p[1]) !== (zj > p[1])) && (p[0] < (xj - xi) * (p[1] - zi) / (zj - zi) + xi)) inside = !inside;
  }
  return inside;
}
function scaleUV(g, k) { const uv = g.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * k, uv.getY(i) * k); return g; }
function norm2(x, z) { const l = Math.hypot(x, z) || 1; return [x / l, z / l]; }
