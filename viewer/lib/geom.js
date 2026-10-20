// 기하 헬퍼. 단위 피트, 월드 X=동, Y=위, Z=남.
// 폴리곤은 [[x,z],...] 이며 위에서 봤을 때(동=오른쪽, 북=위) 반시계(CCW)여야 한다 — build_site.py 가 보장.
import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

const UP = new THREE.Vector3(0, 1, 0);

/** (x,z) 폴리곤 → 2D Shape (x, -z). rotateX(-90°) 하면 다시 (x, 0, z) 평면에 윗면 법선 +y 로 놓인다. */
export function shapeOf(poly, holes = []) {
  const s = new THREE.Shape(poly.map(p => new THREE.Vector2(p[0], -p[1])));
  for (const h of holes) s.holes.push(new THREE.Path(h.map(p => new THREE.Vector2(p[0], -p[1]))));
  return s;
}

/** 2D(x,-z) ShapeGeometry 를 수평면으로 눕혀 높이 y 에 놓는다 (윗면 법선 +y). UV = (x,z)*uvScale */
export function capGeometry(poly, holes, y, uvScale = 1 / 24) {
  const g = new THREE.ShapeGeometry(shapeOf(poly, holes));
  g.rotateX(-Math.PI / 2);
  g.translate(0, y, 0);
  const uv = g.attributes.uv, pos = g.attributes.position;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, pos.getX(i) * uvScale, pos.getZ(i) * uvScale);
  return g;
}

/** 폴리곤 둘레를 따라 벽면 띠를 만든다. u = 둘레 거리*uvU, v = 높이*uvV. 바깥 법선. */
export function sideGeometry(poly, y0, y1, uvU = 1 / 24, uvV = 1 / 12, closed = true) {
  const pos = [], nor = [], uv = [], idx = [];
  let s = 0;
  const n = poly.length, m = closed ? n : n - 1;
  for (let i = 0; i < m; i++) {
    const a = poly[i], b = poly[(i + 1) % n];
    const dx = b[0] - a[0], dz = b[1] - a[1], len = Math.hypot(dx, dz) || 1e-6;
    const nx = -dz / len, nz = dx / len;          // CCW(동-북 평면) 에서 진행 방향의 오른쪽 = 바깥
    const base = pos.length / 3;
    pos.push(a[0], y0, a[1], b[0], y0, b[1], b[0], y1, b[1], a[0], y1, a[1]);
    for (let k = 0; k < 4; k++) nor.push(nx, 0, nz);
    uv.push(s * uvU, y0 * uvV, (s + len) * uvU, y0 * uvV, (s + len) * uvU, y1 * uvV, s * uvU, y1 * uvV);
    idx.push(base, base + 1, base + 2, base, base + 2, base + 3);
    s += len;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  return g;
}

/** 폴리곤 압출: {sides, top} 두 BufferGeometry. */
export function extrudePoly(poly, holes, h, { y0 = 0, uvU = 1 / 24, uvV = 1 / 12 } = {}) {
  const parts = [sideGeometry(poly, y0, y0 + h, uvU, uvV)];
  for (const hole of holes || []) parts.push(sideGeometry([...hole].reverse(), y0, y0 + h, uvU, uvV));
  const sides = parts.length > 1 ? BufferGeometryUtils.mergeGeometries(parts) : parts[0];
  const top = capGeometry(poly, holes || [], y0 + h);
  return { sides, top };
}

/** 중심 (x, y+h/2, z) 박스. ry = y축 회전(rad). 반환: BufferGeometry (월드 변환 적용됨) */
export function box(w, h, d, x, y, z, { ry = 0 } = {}) {
  const g = new THREE.BoxGeometry(w, h, d);
  const m = new THREE.Matrix4().makeRotationY(ry); m.setPosition(x, y + h / 2, z);
  g.applyMatrix4(m);
  // UV 를 피트 기준으로: 박스 각 면 u,v 를 실제 치수로 스케일
  const uv = g.attributes.uv;
  const dims = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];   // +x,-x,+y,-y,+z,-z 면 순서
  for (let f = 0; f < 6; f++) for (let k = 0; k < 4; k++) { const i = f * 4 + k; uv.setXY(i, uv.getX(i) * dims[f][0] / 24, uv.getY(i) * dims[f][1] / 12); }
  return g;
}

export function cylinder(r, h, x, y, z, seg = 16) {
  const g = new THREE.CylinderGeometry(r, r, h, seg); g.translate(x, y + h / 2, z); return g;
}

/**
 * 벽 한 장: p0→p1 (CCW 규약, 안쪽이 진행 방향 왼쪽) 를 y0..y1 로 세운다. openings = [{s,e,b,t}] 는
 * 벽 시작점으로부터의 거리 s..e, 바닥 b..t(절대 높이) 의 직사각 개구. 법선은 바깥.
 */
export function wallSeg(p0, p1, y0, y1, { openings = [], uvU = 1 / 24, uvV = 1 / 12 } = {}) {
  const dx = p1[0] - p0[0], dz = p1[1] - p0[1], len = Math.hypot(dx, dz);
  const shape = new THREE.Shape([new THREE.Vector2(0, y0), new THREE.Vector2(len, y0), new THREE.Vector2(len, y1), new THREE.Vector2(0, y1)]);
  for (const o of openings) {
    const s = Math.max(0, o.s), e = Math.min(len, o.e), b = Math.max(y0, o.b), t = Math.min(y1, o.t);
    if (e - s < 0.05 || t - b < 0.05) continue;
    shape.holes.push(new THREE.Path([new THREE.Vector2(s, b), new THREE.Vector2(s, t), new THREE.Vector2(e, t), new THREE.Vector2(e, b)]));
  }
  const g = new THREE.ShapeGeometry(shape);
  const uv = g.attributes.uv, pos = g.attributes.position;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, pos.getX(i) * uvU, pos.getY(i) * uvV);
  // 기저: X=진행방향, Y=위, Z=바깥(= X × Y)
  const ex = new THREE.Vector3(dx / len, 0, dz / len), ez = new THREE.Vector3().crossVectors(ex, UP);
  const m = new THREE.Matrix4().makeBasis(ex, UP, ez); m.setPosition(p0[0], 0, p0[1]);
  g.applyMatrix4(m);
  return g;
}

/**
 * 반복 창 패턴 벽. rows 층 × cols 창. 각 층: 높이 rowH, 창 winW×winH, 창대 sill. colW = 창 간격(0 이면 균등 배치).
 * 반환 {wall, glass}: wall 은 개구가 뚫린 벽, glass 는 inset 만큼 안쪽으로 들어간 유리면.
 */
export function windowGrid(p0, p1, { y0 = 0, rows, rowH, cols = 0, colW = 0, winW = 5, winH = 7, sill = 3, inset = 0.5, margin = 0, uvU = 1 / 24, uvV = 1 / 12 }) {
  const dx = p1[0] - p0[0], dz = p1[1] - p0[1], len = Math.hypot(dx, dz);
  const ex = [dx / len, dz / len], ez = [-dz / len, dx / len];          // 바깥 방향 (x,z)
  if (!cols) cols = Math.max(1, Math.floor((len - 2 * margin) / (colW || (winW + 3))));
  const pitch = (len - 2 * margin) / cols;
  const openings = [], gl = [];
  for (let r = 0; r < rows; r++) {
    const b = y0 + r * rowH + sill, t = b + winH;
    for (let c = 0; c < cols; c++) {
      const s = margin + c * pitch + (pitch - winW) / 2, e = s + winW;
      openings.push({ s, e, b, t });
      const q0 = [p0[0] + ex[0] * s - ez[0] * inset, p0[1] + ex[1] * s - ez[1] * inset];
      const q1 = [p0[0] + ex[0] * e - ez[0] * inset, p0[1] + ex[1] * e - ez[1] * inset];
      gl.push(sideGeometry([q0, q1], b, t, 1 / winW, 1 / winH, false));
    }
  }
  const wall = wallSeg(p0, p1, y0, y0 + rows * rowH, { openings, uvU, uvV });
  const glass = gl.length ? BufferGeometryUtils.mergeGeometries(gl) : null;
  return { wall, glass };
}

/** 평지붕: 슬래브 + 난간벽(두께 1 ft). 반환 {slab, parapet} */
export function flatRoof(poly, y, { parapet = 2.0, thick = 0.75, holes = [] } = {}) {
  const e = extrudePoly(poly, holes, thick, { y0: y - thick });
  const slab = BufferGeometryUtils.mergeGeometries([e.sides, e.top]);
  const parts = [];
  if (parapet > 0) {
    const n = poly.length;
    for (let i = 0; i < n; i++) {
      const a = poly[i], b = poly[(i + 1) % n];
      const dx = b[0] - a[0], dz = b[1] - a[1], len = Math.hypot(dx, dz);
      const nx = -dz / len, nz = dx / len;                                  // 바깥
      const cx = (a[0] + b[0]) / 2 - nx * 0.5, cz = (a[1] + b[1]) / 2 - nz * 0.5;
      parts.push(box(len, parapet, 1.0, cx, y, cz, { ry: -Math.atan2(dz, dx) }));
    }
  }
  return { slab, parapet: parts.length ? BufferGeometryUtils.mergeGeometries(parts) : null };
}

/** 박공지붕: 폴리곤의 방향 상자(axisDeg = 용마루 방향, 0 = 동서) 위에 경사 pitch(상승/수평) 지붕. */
export function gableRoof(poly, yEave, pitch = 0.5, axisDeg = 0) {
  const a = axisDeg * Math.PI / 180, c = Math.cos(a), s = Math.sin(a);
  let u0 = 1e9, u1 = -1e9, v0 = 1e9, v1 = -1e9;
  for (const p of poly) { const u = p[0] * c + p[1] * s, v = -p[0] * s + p[1] * c; u0 = Math.min(u0, u); u1 = Math.max(u1, u); v0 = Math.min(v0, v); v1 = Math.max(v1, v); }
  const half = (v1 - v0) / 2, ridge = yEave + half * pitch, vm = (v0 + v1) / 2;
  const P = (u, v, y) => [u * c - v * s, y, u * s + v * c];
  // 정점 순서: 위에서 봤을 때 반시계 → 법선이 위·바깥을 향함
  const quads = [
    [P(u0, vm, ridge), P(u1, vm, ridge), P(u1, v0, yEave), P(u0, v0, yEave)],
    [P(u1, vm, ridge), P(u0, vm, ridge), P(u0, v1, yEave), P(u1, v1, yEave)],
  ];
  const pos = [], uv = [];
  for (const q of quads) {
    pos.push(...q[0], ...q[1], ...q[2], ...q[0], ...q[2], ...q[3]);
    const L = u1 - u0, W = Math.hypot(half, half * pitch);
    uv.push(0, 0, L / 24, 0, L / 24, W / 12, 0, 0, L / 24, W / 12, 0, W / 12);
  }
  // 박공 삼각형 2개
  for (const [u, flip] of [[u0, true], [u1, false]]) {
    const t = [P(u, v0, yEave), P(u, v1, yEave), P(u, vm, ridge)];
    if (flip) t.reverse();
    pos.push(...t[0], ...t[1], ...t[2]); uv.push(0, 0, 1, 0, 0.5, 1);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.computeVertexNormals();
  return g;
}

/** 그룹을 월드에 배치: anchor [x,z], rotationDeg (fit_footprint.py 규약: world = R·local + anchor) */
export function toWorld(group, anchor, rotationDeg) {
  group.position.set(anchor[0], 0, anchor[1]);
  group.rotation.y = -rotationDeg * Math.PI / 180;
  group.updateMatrixWorld(true);
  return group;
}

/** parts: [{geom, mat, name?, cast?, receive?}] → 재질별로 병합한 Mesh 배열 */
export function mergeByMaterial(parts) {
  const byMat = new Map();
  for (const p of parts) {
    if (!p || !p.geom) continue;
    const g = p.geom.index ? p.geom.toNonIndexed() : p.geom;
    if (!g.attributes.normal) g.computeVertexNormals();
    if (!g.attributes.uv) g.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(g.attributes.position.count * 2), 2));
    for (const k of Object.keys(g.attributes)) if (!['position', 'normal', 'uv'].includes(k)) g.deleteAttribute(k);
    if (!byMat.has(p.mat)) byMat.set(p.mat, { geos: [], cast: p.cast !== false, receive: p.receive !== false, name: p.name });
    byMat.get(p.mat).geos.push(g);
  }
  const meshes = [];
  for (const [mat, e] of byMat) {
    const merged = e.geos.length === 1 ? e.geos[0] : BufferGeometryUtils.mergeGeometries(e.geos);
    const mesh = new THREE.Mesh(merged, mat);
    mesh.castShadow = e.cast; mesh.receiveShadow = e.receive; if (e.name) mesh.name = e.name;
    meshes.push(mesh);
  }
  return meshes;
}

/** 폴리곤을 d 만큼 안쪽(음수면 바깥)으로 오프셋 (단순 모서리 이등분선 방식) */
export function offsetPoly(poly, d) {
  const n = poly.length, out = [];
  for (let i = 0; i < n; i++) {
    const p = poly[(i - 1 + n) % n], q = poly[i], r = poly[(i + 1) % n];
    const n1 = norm([-(q[1] - p[1]), q[0] - p[0]]), n2 = norm([-(r[1] - q[1]), r[0] - q[0]]);   // 바깥 법선
    const bis = norm([n1[0] + n2[0], n1[1] + n2[1]]);
    const cosHalf = Math.max(0.3, bis[0] * n1[0] + bis[1] * n1[1]);
    out.push([q[0] - bis[0] * d / cosHalf, q[1] - bis[1] * d / cosHalf]);
  }
  return out;
}
function norm(v) { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l]; }

export function centroid(poly) {
  let x = 0, z = 0; for (const p of poly) { x += p[0]; z += p[1]; } return [x / poly.length, z / poly.length];
}
