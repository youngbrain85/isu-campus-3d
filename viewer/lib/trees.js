// 수목: 3D 수관(울퉁불퉁한 구 덩어리 여러 개 병합) + 줄기, 인스턴스 렌더. 활엽(둥근형/타원형) 2종 + 침엽(원뿔형) 1종.
// 풀 포기: 교차 빌보드 인스턴스.
import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

/** 시드 고정 난수 */
function rng(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

/** 단위 수관(높이 1, 반지름 ~0.5): 덩어리 구 여러 개를 노이즈 변형 후 병합. 바닥 y=0 기준 줄기 위에 얹힘 */
function crownGeometry(kind, seed) {
  const r = rng(seed); const parts = [];
  if (kind === 'conifer') {
    for (let k = 0; k < 4; k++) {                      // 층층이 쌓인 원뿔
      const h = 0.42 - k * 0.06, rad = 0.46 - k * 0.1;
      const g = new THREE.ConeGeometry(rad, h, 9, 2); g.translate(0, 0.3 + k * 0.17 + h / 2, 0); parts.push(g);
    }
  } else {
    const n = kind === 'oval' ? 6 : 7;
    const top = kind === 'oval' ? 0.95 : 0.88;
    parts.push(lumpy(0.36, 0, 0.62, 0, r));             // 중심 덩어리
    for (let k = 0; k < n; k++) {
      const a = (k / n) * Math.PI * 2 + r() * 0.6, rad = kind === 'oval' ? 0.2 : 0.27;
      const y = 0.45 + r() * (top - 0.6), s = 0.2 + r() * 0.1;
      parts.push(lumpy(s, Math.cos(a) * rad, y, Math.sin(a) * rad, r));
    }
    parts.push(lumpy(0.22, 0, top - 0.12, 0, r));      // 꼭대기
  }
  const g = BufferGeometryUtils.mergeGeometries(parts.map(p => p.index ? p.toNonIndexed() : p));
  // 수관 UV: 구면 투영 (잎 텍스처 반복)
  const pos = g.attributes.position, uv = new Float32Array(pos.count * 2);
  for (let i = 0; i < pos.count; i++) { uv[i * 2] = Math.atan2(pos.getZ(i), pos.getX(i)) * 1.2; uv[i * 2 + 1] = pos.getY(i) * 3; }
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  g.computeVertexNormals();
  return g;
}
function lumpy(s, x, y, z, r) {
  const g = new THREE.IcosahedronGeometry(s, 1);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const vx = p.getX(i), vy = p.getY(i), vz = p.getZ(i);
    const k = 1 + (Math.sin(vx * 23 + r() * 6) * Math.cos(vz * 19) + Math.sin(vy * 17)) * 0.08;
    p.setXYZ(i, vx * k + x, vy * k * 0.9 + y, vz * k + z);
  }
  return g;
}

/** list: [[x, z, height_ft, variant, source, crown_r_ft], ...] */
export function buildTrees(list, tex, M) {
  const G = new THREE.Group(); G.name = 'trees';
  const fol = tex('foliage.jpg'), foln = tex('foliage_n.jpg', { srgb: false });
  const kinds = ['round', 'oval', 'conifer'];
  // 종류 배정: 영상 검출 나무 중 수관이 작고(<9 ft) 키 큰 것 일부를 침엽수로, 나머지 variant 로 둥근형/타원형
  const groups = { round: [], oval: [], conifer: [] };
  for (const t of list) {
    const h = t[2] || 30, cr = t[5] || h * 0.4, hv = Math.abs(Math.sin(t[0] * 12.9898 + t[1] * 78.233)) % 1;
    const kind = (cr < 10 && hv < 0.35) ? 'conifer' : ((t[3] || 0) % 2 ? 'oval' : 'round');
    groups[kind].push(t);
  }
  const mtx = new THREE.Matrix4(), q = new THREE.Quaternion(), p = new THREE.Vector3(), s = new THREE.Vector3(), axis = new THREE.Vector3(0, 1, 0);
  const trunkGeo = new THREE.CylinderGeometry(0.32, 0.5, 1, 7); trunkGeo.translate(0, 0.5, 0);
  const trunkMat = M ? M.bark : new THREE.MeshStandardMaterial({ color: 0x5a4632 });
  const trunks = [];
  kinds.forEach((kind, ki) => {
    const arr = groups[kind]; if (!arr.length) return;
    const geo = crownGeometry(kind, 7 + ki * 13);
    const mat = new THREE.MeshStandardMaterial({ map: fol, normalMap: foln, normalScale: new THREE.Vector2(0.8, 0.8), roughness: 0.92, color: kind === 'conifer' ? 0x7f9a74 : 0xffffff });
    const im = new THREE.InstancedMesh(geo, mat, arr.length);
    arr.forEach((t, i) => {
      const h = t[2] || 30, cr = t[5] || h * 0.4;
      const w = kind === 'conifer' ? Math.min(cr * 2, h * 0.55) : cr * 2.0;
      const ch = kind === 'conifer' ? h : h * 0.82;            // 활엽수는 수관 아래 줄기 노출
      p.set(t[0], kind === 'conifer' ? 0 : h - ch, t[1]); q.setFromAxisAngle(axis, (t[0] * 7.3 + t[1] * 3.1) % 6.283);
      s.set(w, ch, w * (0.9 + 0.2 * ((i * 37) % 10) / 10));
      mtx.compose(p, q, s); im.setMatrixAt(i, mtx);
      const hv = ((t[0] * 12.9898 + t[1] * 78.233) % 1 + 1) % 1;
      im.setColorAt(i, new THREE.Color().setHSL(0.25 + (hv - 0.5) * 0.06, 0.35 + hv * 0.25, 0.55 + (hv - 0.5) * 0.18));
      trunks.push([t[0], t[1], kind === 'conifer' ? h * 0.25 : (h - ch) + ch * 0.35, Math.max(0.8, cr * 0.07)]);
    });
    im.castShadow = true; im.receiveShadow = true; im.name = 'trees_' + kind; G.add(im);
  });
  const tm = new THREE.InstancedMesh(trunkGeo, trunkMat, trunks.length);
  trunks.forEach((t, i) => { p.set(t[0], 0, t[1]); q.identity(); s.set(t[3], t[2], t[3]); mtx.compose(p, q, s); tm.setMatrixAt(i, mtx); });
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
  const r = rng(11);
  list.forEach((t, i) => {
    const w = 1.6 + r() * 1.4, h = 0.6 + r() * 0.7;
    p.set(t[0], -0.1, t[1]); q.setFromAxisAngle(axis, r() * 6.28); s.set(w, h, w);
    mtx.compose(p, q, s); im.setMatrixAt(i, mtx);
  });
  im.castShadow = false; im.name = 'grass_tufts';
  return im;
}
