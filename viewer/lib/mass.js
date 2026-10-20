// OSM 외곽선 × 층수 기반 매스 건물
import * as THREE from 'three';
import { extrudePoly, gableRoof, mergeByMaterial, centroid } from './geom.js';
import { wallMat, roofMat } from './materials.js';

/** site.buildings 중 skipIds 에 없는 것을 압출해 재질별로 병합. 반환 {group, byId} */
export function buildMasses(site, M, skipIds = new Set()) {
  const parts = [], byId = new Map();
  let tris = 0;
  for (const b of site.buildings) {
    if (skipIds.has(b.id) || b.poly.length < 3) continue;
    const h = Math.max(8, b.h);
    let e;
    try { e = extrudePoly(b.poly, b.holes, h); } catch (err) { continue; }
    const wm = wallMat(M, b.wall, b.levels, h);
    parts.push({ geom: e.sides, mat: wm });
    if (b.roof_shape === 'gabled' || b.roof_shape === 'hipped') {
      const c = centroid(b.poly); const axis = mainAxisDeg(b.poly);
      parts.push({ geom: gableRoof(b.poly, h, 0.45, axis), mat: roofMat(M, b.roof) });
      parts.push({ geom: e.top, mat: roofMat(M, b.roof) });
    } else {
      parts.push({ geom: e.top, mat: roofMat(M, b.roof) });
    }
    tris += e.sides.index ? e.sides.index.count / 3 : e.sides.attributes.position.count / 3;
    byId.set(b.id, { c: centroid(b.poly), h, name: b.name });
  }
  const group = new THREE.Group(); group.name = 'masses';
  for (const m of mergeByMaterial(parts)) group.add(m);
  return { group, byId, tris };
}

/** 가장 긴 변의 방향(도) */
function mainAxisDeg(poly) {
  let best = 0, bl = -1;
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length];
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (l > bl) { bl = l; best = Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI; }
  }
  return best;
}
