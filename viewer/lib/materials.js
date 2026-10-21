// 재질 라이브러리. tex(name, opts) 는 app.js 의 텍스처 로더.
import * as THREE from 'three';

export const WALL_KEYS = ['brick_red', 'brick_brown', 'brick_tan', 'limestone', 'precast', 'metal', 'glass', 'concrete'];

export function makeMaterials(tex) {
  const M = {};
  const std = (name, opts = {}, texOpts = {}) => new THREE.MeshStandardMaterial({ map: tex(name + '.jpg', texOpts), roughness: 0.85, metalness: 0.0, ...opts });
  for (const k of WALL_KEYS) {
    const rough = k === 'metal' ? 0.5 : k === 'glass' ? 0.2 : 0.85;
    const metal = k === 'metal' ? 0.6 : k === 'glass' ? 0.5 : 0.0;
    M[k] = std(k, { roughness: rough, metalness: metal });
    M[k + '_win'] = std(k + '_win', { roughness: rough, metalness: metal });
    if (k === 'brick_red' || k === 'brick_brown' || k === 'brick_tan') {
      M[k].normalMap = tex('brick_n.jpg', { srgb: false }); M[k].normalScale = new THREE.Vector2(0.4, 0.4);
    }
  }
  M.roof_membrane = std('roof_membrane', { roughness: 0.95 });
  M.roof_gravel = std('roof_gravel', { roughness: 1.0 });
  M.roof_dark = std('roof_dark', { roughness: 0.9 });
  M.asphalt = std('asphalt', { roughness: 0.95 }, { repeat: [1, 1] });
  M.walk = std('concrete_walk', { roughness: 0.9 });
  M.grass = std('grass_detail', { roughness: 1.0, color: 0x8fb45f });
  M.pitch = new THREE.MeshStandardMaterial({ color: 0x5a8f4a, roughness: 1.0 });
  M.water = new THREE.MeshStandardMaterial({ color: 0x3a5a70, roughness: 0.2, metalness: 0.1 });
  M.pane = new THREE.MeshPhysicalMaterial({ map: tex('window_glass.jpg'), roughness: 0.15, metalness: 0.4, envMapIntensity: 1.2, color: 0xbfd4e6 });
  M.trim = new THREE.MeshStandardMaterial({ color: 0xe9e6df, roughness: 0.8 });
  M.dark = new THREE.MeshStandardMaterial({ color: 0x3a3d42, roughness: 0.6, metalness: 0.4 });
  M.white = new THREE.MeshStandardMaterial({ color: 0xf2f1ec, roughness: 0.7 });
  M.ground_flat = new THREE.MeshStandardMaterial({ color: 0x8c9a74, roughness: 1.0 });
  M.curb = std('curb', { roughness: 0.9 });
  M.paintYellow = new THREE.MeshStandardMaterial({ color: 0xe8c23a, roughness: 0.7 });
  M.paintWhite = new THREE.MeshStandardMaterial({ color: 0xf0f0ea, roughness: 0.7 });
  M.bark = std('bark', { roughness: 0.95 });
  M._cache = new Map();
  return M;
}

/** 층수에 맞춰 창 타일이 한 층에 하나씩 반복되도록 한 벽 재질 (같은 조합은 캐시해 병합 가능하게) */
export function wallMat(M, key, levels, h) {
  if (!M[key + '_win']) key = 'brick_brown';
  const storey = Math.max(8, h / Math.max(1, levels));
  const ck = key + '@' + storey.toFixed(1);
  if (M._cache.has(ck)) return M._cache.get(ck);
  const base = M[key + '_win'];
  const m = base.clone(); m.map = base.map.clone(); m.map.needsUpdate = true;
  m.map.repeat.set(1, 12 / storey);
  if (base.normalMap) { m.normalMap = base.normalMap.clone(); m.normalMap.repeat.set(1, 12 / storey); m.normalMap.needsUpdate = true; }
  M._cache.set(ck, m);
  return m;
}

/** 지붕 재질: 영상에서 샘플한 RGB 로 밝기 계열을 고르고 색을 살짝 입힘 (양자화해 재질 수 제한) */
export function roofMat(M, rgb) {
  const lum = (rgb[0] * 0.3 + rgb[1] * 0.59 + rgb[2] * 0.11);
  const base = lum > 170 ? M.roof_membrane : lum > 100 ? M.roof_gravel : M.roof_dark;
  const q = rgb.map(v => Math.round(v / 32) * 32);
  const ck = 'roof@' + (base === M.roof_membrane ? 'm' : base === M.roof_gravel ? 'g' : 'd') + q.join(',');
  if (M._cache.has(ck)) return M._cache.get(ck);
  const m = base.clone();
  const ref = base === M.roof_membrane ? 200 : base === M.roof_gravel ? 155 : 60;
  m.color = new THREE.Color(clamp(q[0] / ref), clamp(q[1] / ref), clamp(q[2] / ref));
  M._cache.set(ck, m);
  return m;
}
const clamp = v => Math.min(1.3, Math.max(0.45, v));
