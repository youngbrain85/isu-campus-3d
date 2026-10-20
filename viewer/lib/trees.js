// 인스턴스 스프라이트 수목 (교차 빌보드 2장, 잎 아틀라스 3종)
import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

/** list: [[x, z, height_ft, variant, source], ...] */
export function buildTrees(list, tex) {
  const G = new THREE.Group(); G.name = 'trees';
  const atlas = tex('leaves.png'); atlas.wrapS = atlas.wrapT = THREE.ClampToEdgeWrapping;
  const a = new THREE.PlaneGeometry(1, 1); a.translate(0, 0.5, 0);
  const b = a.clone(); b.rotateY(Math.PI / 2);
  const geo = BufferGeometryUtils.mergeGeometries([a, b]);
  const byVar = [[], [], []];
  for (const t of list) byVar[(t[3] || 0) % 3].push(t);
  const mtx = new THREE.Matrix4(), q = new THREE.Quaternion(), p = new THREE.Vector3(), s = new THREE.Vector3(), axis = new THREE.Vector3(0, 1, 0);
  byVar.forEach((arr, k) => {
    if (!arr.length) return;
    const map = atlas.clone(); map.repeat.set(1 / 3, 1); map.offset.set(k / 3, 0); map.needsUpdate = true;
    const mat = new THREE.MeshStandardMaterial({ map, alphaTest: 0.5, side: THREE.DoubleSide, roughness: 0.9, color: 0xffffff });
    const im = new THREE.InstancedMesh(geo, mat, arr.length);
    arr.forEach((t, i) => {
      const h = t[2] || 30; const rot = ((t[0] * 7.3 + t[1] * 3.1) % 6.283);
      p.set(t[0], -0.5, t[1]); q.setFromAxisAngle(axis, rot); s.set(h * 0.9, h, h * 0.9);
      mtx.compose(p, q, s); im.setMatrixAt(i, mtx);
      const hv = ((t[0] * 12.9898 + t[1] * 78.233) % 1 + 1) % 1;
      im.setColorAt(i, new THREE.Color().setHSL(0.25 + (hv - 0.5) * 0.06, 0.45 + hv * 0.25, 0.42 + (hv - 0.5) * 0.12));
    });
    im.castShadow = true; im.receiveShadow = false;
    im.customDepthMaterial = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map, alphaTest: 0.5, side: THREE.DoubleSide });
    im.name = 'trees_' + k; G.add(im);
  });
  return G;
}
