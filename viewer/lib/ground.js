// 지면: 위성영상 타일, 도로 리본, 주차장/잔디 면 (영상 끄면 보이는 도식 지면)
import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import { capGeometry, mergeByMaterial } from './geom.js';

export function buildGround(site, M, tex) {
  const g = site.ground, tileFt = g.extent_ft / g.tiles;
  const grp = new THREE.Group(); grp.name = 'ground_imagery';
  for (let r = 0; r < g.tiles; r++) for (let c = 0; c < g.tiles; c++) {
    const t = tex(`ground_${r}_${c}.jpg`, { aniso: 16 });
    t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
    const geo = new THREE.PlaneGeometry(tileFt, tileFt); geo.rotateX(-Math.PI / 2);
    const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: t, roughness: 1.0, metalness: 0 }));
    m.position.set(-g.extent_ft / 2 + (c + 0.5) * tileFt, 0, -g.extent_ft / 2 + (r + 0.5) * tileFt);
    m.receiveShadow = true; m.name = `ground_${r}_${c}`;
    grp.add(m);
  }
  // 바깥 스커트
  const skirt = new THREE.Mesh(new THREE.PlaneGeometry(40000, 40000), M.ground_flat);
  skirt.rotation.x = -Math.PI / 2; skirt.position.y = -0.3; skirt.receiveShadow = true; skirt.name = 'skirt';
  grp.add(skirt);
  return grp;
}

/** 도식 지면: 평면 색 + 도로 리본 + 면. 영상 끌 때만 표시. */
export function buildSchematic(site, M) {
  const grp = new THREE.Group(); grp.name = 'ground_schematic';
  const base = new THREE.Mesh(new THREE.PlaneGeometry(site.ground.extent_ft, site.ground.extent_ft), M.ground_flat);
  base.rotation.x = -Math.PI / 2; base.position.y = 0.02; base.receiveShadow = true; grp.add(base);
  const parts = [];
  for (const a of site.areas) {
    if (a.poly.length < 3) continue;
    const mat = a.kind === 'parking' ? M.asphalt : a.kind === 'grass' ? M.grass : a.kind === 'pitch' ? M.pitch : a.kind === 'water' ? M.water : null;
    if (!mat) continue;
    try { parts.push({ geom: capGeometry(a.poly, [], 0.08, 1 / 24), mat, cast: false }); } catch (e) { /* 자기교차 폴리곤 등은 건너뜀 */ }
  }
  const roads = [], paths = [];
  for (const r of site.roads) (r.kind === 'path' ? paths : roads).push(ribbon(r.pts, r.w, r.kind === 'path' ? 0.25 : 0.15));
  if (roads.length) parts.push({ geom: BufferGeometryUtils.mergeGeometries(roads), mat: M.asphalt, cast: false, name: 'roads' });
  if (paths.length) parts.push({ geom: BufferGeometryUtils.mergeGeometries(paths), mat: M.walk, cast: false, name: 'paths' });
  for (const m of mergeByMaterial(parts)) grp.add(m);
  return grp;
}

/** 폴리라인을 폭 w 의 리본(수평면)으로. 꼭짓점에서 이등분선 오프셋(마이터). */
export function ribbon(pts, w, y) {
  const n = pts.length; if (n < 2) return new THREE.BufferGeometry();
  const pos = [], uv = [], idx = []; let s = 0;
  for (let i = 0; i < n; i++) {
    const p = pts[i], a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)];
    let tx = b[0] - a[0], tz = b[1] - a[1]; const l = Math.hypot(tx, tz) || 1; tx /= l; tz /= l;
    let nx = -tz, nz = tx, scale = 1;
    if (i > 0 && i < n - 1) {
      const d1 = norm2(p[0] - a[0], p[1] - a[1]), d2 = norm2(b[0] - p[0], b[1] - p[1]);
      const cosT = d1[0] * d2[0] + d1[1] * d2[1];
      scale = Math.min(2.0, 1 / Math.max(0.5, Math.sqrt((1 + cosT) / 2)));
    }
    if (i > 0) s += Math.hypot(p[0] - a[0], p[1] - a[1]);
    for (const k of [-1, 1]) { pos.push(p[0] + nx * k * w / 2 * scale, y, p[1] + nz * k * w / 2 * scale); uv.push((k + 1) / 2 * w / 24, s / 24); }
  }
  for (let i = 0; i < n - 1; i++) { const a = i * 2; idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx); g.computeVertexNormals();
  return g;
}
function norm2(x, z) { const l = Math.hypot(x, z) || 1; return [x / l, z / l]; }
