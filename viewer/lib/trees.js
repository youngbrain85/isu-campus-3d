// 수목(교차 빌보드 수관 + 원통 줄기, 인스턴스) 과 풀 포기(인스턴스 스프라이트)
import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

/** list: [[x, z, height_ft, variant, source, crown_r_ft], ...] */
export function buildTrees(list, tex, M) {
  const G = new THREE.Group(); G.name = 'trees';
  const atlas = tex('leaves.png'); atlas.wrapS = atlas.wrapT = THREE.ClampToEdgeWrapping;
  // 수관 빌보드: 아틀라스 그림의 줄기 부분(아래 20%)은 쓰지 않고 수관만 (y 0.2..1 → 0..1)
  const a = new THREE.PlaneGeometry(1, 0.8); a.translate(0, 0.6, 0);
  const b = a.clone(); b.rotateY(Math.PI / 2);
  const c = a.clone(); c.rotateY(Math.PI / 4); const d = a.clone(); d.rotateY(-Math.PI / 4);
  const crown = BufferGeometryUtils.mergeGeometries([a, b, c, d]);
  const cuv = crown.attributes.uv; for (let i = 0; i < cuv.count; i++) cuv.setY(i, 0.2 + cuv.getY(i) * 0.8);
  const byVar = [[], [], []];
  for (const t of list) byVar[(t[3] || 0) % 3].push(t);
  const mtx = new THREE.Matrix4(), q = new THREE.Quaternion(), p = new THREE.Vector3(), s = new THREE.Vector3(), axis = new THREE.Vector3(0, 1, 0);
  byVar.forEach((arr, k) => {
    if (!arr.length) return;
    const map = atlas.clone(); map.repeat.set(1 / 3, 1); map.offset.set(k / 3, 0); map.needsUpdate = true;
    const mat = new THREE.MeshStandardMaterial({ map, alphaTest: 0.5, side: THREE.DoubleSide, roughness: 0.9, color: 0xffffff });
    const im = new THREE.InstancedMesh(crown, mat, arr.length);
    arr.forEach((t, i) => {
      const h = t[2] || 30, r = t[5] || h * 0.4;
      const rot = ((t[0] * 7.3 + t[1] * 3.1) % 6.283);
      p.set(t[0], 0, t[1]); q.setFromAxisAngle(axis, rot); s.set(r * 2.1, h, r * 2.1);
      mtx.compose(p, q, s); im.setMatrixAt(i, mtx);
      const hv = ((t[0] * 12.9898 + t[1] * 78.233) % 1 + 1) % 1;
      im.setColorAt(i, new THREE.Color().setHSL(0.24 + (hv - 0.5) * 0.05, 0.4 + hv * 0.25, 0.4 + (hv - 0.5) * 0.12));
    });
    im.castShadow = true; im.receiveShadow = false;
    im.customDepthMaterial = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map, alphaTest: 0.5, side: THREE.DoubleSide });
    im.name = 'trees_' + k; G.add(im);
  });
  // 줄기
  const trunk = new THREE.CylinderGeometry(0.35, 0.55, 1, 7); trunk.translate(0, 0.5, 0);
  const tm = new THREE.InstancedMesh(trunk, M ? M.bark : new THREE.MeshStandardMaterial({ color: 0x5a4632 }), list.length);
  list.forEach((t, i) => {
    const h = t[2] || 30, r = t[5] || h * 0.4; const th = h * 0.45;
    p.set(t[0], 0, t[1]); q.identity(); s.set(Math.max(1, r * 0.09), th, Math.max(1, r * 0.09));
    mtx.compose(p, q, s); tm.setMatrixAt(i, mtx);
  });
  tm.castShadow = true; tm.name = 'trunks'; G.add(tm);
  return G;
}

/** list: [[x, z], ...] → 풀 포기 교차 빌보드 (각 2 장) */
export function buildGrassTufts(list, tex) {
  const map = tex('grass_tuft.png'); map.wrapS = map.wrapT = THREE.ClampToEdgeWrapping;
  const a = new THREE.PlaneGeometry(1, 1); a.translate(0, 0.5, 0); const b = a.clone(); b.rotateY(Math.PI / 2);
  const geo = BufferGeometryUtils.mergeGeometries([a, b]);
  const mat = new THREE.MeshStandardMaterial({ map, alphaTest: 0.45, side: THREE.DoubleSide, roughness: 1, color: 0x9fb07a });
  const im = new THREE.InstancedMesh(geo, mat, list.length);
  const mtx = new THREE.Matrix4(), q = new THREE.Quaternion(), p = new THREE.Vector3(), s = new THREE.Vector3(), axis = new THREE.Vector3(0, 1, 0);
  let seed = 11; const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  list.forEach((t, i) => {
    const w = 1.6 + rnd() * 1.4, h = 0.6 + rnd() * 0.7;
    p.set(t[0], -0.1, t[1]); q.setFromAxisAngle(axis, rnd() * 6.28); s.set(w, h, w);
    mtx.compose(p, q, s); im.setMatrixAt(i, mtx);
  });
  im.castShadow = false; im.name = 'grass_tufts';
  return im;
}
