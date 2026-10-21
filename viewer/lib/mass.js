// OSM 외곽선 × 층수 기반 매스 건물
import * as THREE from 'three';
import { extrudePoly, gableRoof, mergeByMaterial, centroid } from './geom.js';
import { wallMat, roofMat } from './materials.js';

/**
 * site.buildings 중 skipIds 에 없는 것을 압출해 재질별로 병합. 반환 {group, byId, tris}
 * tiles: buildGround() 가 만든 지면 타일 목록 — 있으면 지붕에 위성영상(건물 위치의 실제 옥상)을 평면 투영해 입힌다.
 */
export function buildMasses(site, M, skipIds = new Set(), tiles = null) {
  const parts = [], byId = new Map();
  let tris = 0;
  const roofTileMat = new Map();   // 타일 → 지붕 재질 (타일당 1개)
  for (const b of site.buildings) {
    if (skipIds.has(b.id) || b.poly.length < 3) continue;
    const h = Math.max(8, b.h);
    let e;
    try { e = extrudePoly(b.poly, b.holes, h); } catch (err) { continue; }
    const wm = wallMat(M, b.wall, b.levels, h);
    parts.push({ geom: e.sides, mat: wm });
    const c = centroid(b.poly);
    const gabled = b.roof_shape === 'gabled' || b.roof_shape === 'hipped';
    const roofGeoms = gabled ? [gableRoof(b.poly, h, 0.45, mainAxisDeg(b.poly)), e.top] : [e.top];
    const tile = tiles ? tileAt(tiles, c) : null;
    if (tile) {
      if (!roofTileMat.has(tile)) roofTileMat.set(tile, new THREE.MeshStandardMaterial({ map: tile.tex, roughness: 1.0, metalness: 0 }));
      for (const g of roofGeoms) { planarUV(g, tile); parts.push({ geom: g, mat: roofTileMat.get(tile) }); }
    } else {
      for (const g of roofGeoms) parts.push({ geom: g, mat: roofMat(M, b.roof) });
    }
    tris += e.sides.index ? e.sides.index.count / 3 : e.sides.attributes.position.count / 3;
    byId.set(b.id, { c, h, name: b.name });
  }
  const group = new THREE.Group(); group.name = 'masses';
  for (const m of mergeByMaterial(parts)) group.add(m);
  return { group, byId, tris };
}

/** 월드 (x,z) → 타일 텍스처 UV (u 동쪽+, v 북쪽+ = PlaneGeometry 규약과 동일) */
function planarUV(g, tile) {
  const pos = g.attributes.position;
  const uv = new Float32Array(pos.count * 2);
  for (let i = 0; i < pos.count; i++) {
    uv[i * 2] = (pos.getX(i) - tile.x0) / tile.w;
    uv[i * 2 + 1] = 1 - (pos.getZ(i) - tile.z0) / tile.h;
  }
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
}

function tileAt(tiles, c) {
  for (const t of tiles) if (c[0] >= t.x0 && c[0] < t.x0 + t.w && c[1] >= t.z0 && c[1] < t.z0 + t.h) return t;
  return null;
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
