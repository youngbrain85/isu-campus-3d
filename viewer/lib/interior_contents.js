// 실내 내용물 (2 단계): floors[].equipment / casework / fixtures / furniture → 종류별 InstancedMesh.
// 각 종류는 단위 상자 [-0.5,0.5]×[0,1]×[-0.5,0.5] 안의 저폴리 부품 모형(템플릿)이고, 항목마다 (x, y, z, rot, w, h, d) 로 늘려 놓는다.
// 모형 로컬 +x = 항목 w 방향, 로컬 -z = 앞(의자는 앉는 사람이 보는 쪽, 변기·세면기는 방 쪽), +z = 뒤(벽 쪽).
// 바닥 마감 윗면 = 층 y + 0.45 (interior.js 의 cap 높이) → 모든 항목은 그 위에 놓인다.
import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

const F = 0.45;
const M = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.7, ...o });
export const MATS = {
  laminate: M(0xd8d0bf, { roughness: 0.55 }), metal: M(0x5b6066, { roughness: 0.45, metalness: 0.6 }),
  chrome: M(0xb9bec4, { roughness: 0.25, metalness: 0.9 }), fabric: M(0x34506e, { roughness: 0.95 }),
  fabric2: M(0x6f8160, { roughness: 0.95 }), cabinet: M(0xcfc9bc, { roughness: 0.6 }), epoxy: M(0x2a2b2d, { roughness: 0.35 }),
  screen: M(0x101215, { roughness: 0.25, metalness: 0.2 }), white: M(0xf4f4f1, { roughness: 0.3 }), porcelain: M(0xf2f2ef, { roughness: 0.2 }),
  steel: M(0xa7adb3, { roughness: 0.35, metalness: 0.8 }), equip: M(0xa9b3ae, { roughness: 0.55, metalness: 0.2 }),
  equipDark: M(0x3e4447, { roughness: 0.5, metalness: 0.3 }), safety: M(0xe0b330, { roughness: 0.5 }), wood: M(0xb48a5c, { roughness: 0.6 }),
  carBody: M(0xffffff, { roughness: 0.35, metalness: 0.4 }), tire: M(0x1c1c1c, { roughness: 0.9 }), glass: M(0x3a4f5c, { roughness: 0.1, metalness: 0.3 }),
  cabDoor: M(0xbdb6a8, { roughness: 0.5 }), plinth: M(0x2e2f31, { roughness: 0.8 }),
  robot: M(0xe8e8e2, { roughness: 0.45 }), robotAccent: M(0x2f6fb5, { roughness: 0.45 }), shelf: M(0x7d8389, { roughness: 0.5, metalness: 0.5 }),
};
for (const [k, m] of Object.entries(MATS)) m.name = 'int_c_' + k;

// 부품: [재질, cx, cy, cz, sx, sy, sz, 모양('b' 상자 | 'c' 원기둥 y축 | 'cx' 원기둥 x축)]  (단위 상자 좌표)
const B = (m, cx, cy, cz, sx, sy, sz, s = 'b') => [m, cx, cy, cz, sx, sy, sz, s];
const legs4 = (m, top, t = 0.06, inset = 0.44) => [-1, 1].flatMap(a => [-1, 1].map(b => B(m, a * inset, top / 2, b * inset, t, top, t)));
const T = {
  table: [B('laminate', 0, 0.97, 0, 1, 0.06, 1), B('metal', -0.46, 0.47, 0, 0.04, 0.94, 0.85), B('metal', 0.46, 0.47, 0, 0.04, 0.94, 0.85)],
  desk: [B('laminate', 0, 0.97, 0, 1, 0.06, 1), B('metal', -0.46, 0.47, 0, 0.04, 0.94, 0.85), B('metal', 0.46, 0.47, 0, 0.04, 0.94, 0.85), B('metal', 0, 0.6, 0.45, 0.9, 0.5, 0.03)],
  table_low: [B('wood', 0, 0.9, 0, 1, 0.2, 1), B('metal', 0, 0.4, 0, 0.3, 0.8, 0.3, 'c')],
  table_round: [B('laminate', 0, 0.97, 0, 1, 0.06, 1, 'c'), B('metal', 0, 0.48, 0, 0.1, 0.94, 0.1, 'c'), B('metal', 0, 0.02, 0, 0.6, 0.04, 0.6, 'c')],
  chair: [B('fabric', 0, 0.55, -0.05, 0.9, 0.08, 0.8), B('fabric', 0, 0.8, 0.42, 0.85, 0.42, 0.1), B('metal', 0, 0.27, 0, 0.08, 0.5, 0.08, 'c'), B('metal', 0, 0.02, 0, 0.8, 0.04, 0.8, 'c')],
  stool: [B('fabric', 0, 0.94, 0, 0.75, 0.1, 0.75, 'c'), B('chrome', 0, 0.45, 0, 0.1, 0.9, 0.1, 'c'), B('chrome', 0, 0.02, 0, 0.9, 0.04, 0.9, 'c')],
  lounge_chair: [B('fabric2', 0, 0.28, 0, 1, 0.3, 1), B('fabric2', 0, 0.65, 0.4, 1, 0.55, 0.2), B('fabric2', -0.45, 0.48, 0, 0.1, 0.25, 1), B('fabric2', 0.45, 0.48, 0, 0.1, 0.25, 1)],
  sofa: [B('fabric2', 0, 0.28, 0, 1, 0.3, 1), B('fabric2', 0, 0.65, 0.4, 1, 0.55, 0.2), B('fabric2', -0.47, 0.45, 0, 0.06, 0.3, 1), B('fabric2', 0.47, 0.45, 0, 0.06, 0.3, 1)],
  monitor: [B('screen', 0, 0.62, 0, 1, 0.72, 0.25), B('metal', 0, 0.12, 0.1, 0.1, 0.25, 0.3), B('metal', 0, 0.01, 0.1, 0.35, 0.02, 0.8)],
  shelving: [B('shelf', -0.48, 0.5, 0, 0.04, 1, 1), B('shelf', 0.48, 0.5, 0, 0.04, 1, 1), ...[0.02, 0.27, 0.52, 0.77, 0.99].map(y => B('shelf', 0, y, 0, 1, 0.02, 1))],
  base_cabinet: [B('cabinet', 0, 0.46, 0, 0.98, 0.92, 0.96), B('epoxy', 0, 0.97, 0, 1, 0.06, 1.02), B('metal', 0, 0.03, -0.42, 0.98, 0.06, 0.04)],
  // 하부장 모듈 (A-501 C8/G1…: 토킥 4" 들어감, 위 서랍 띠 + 문 2 짝, 손잡이). 높이 1 = 상판 밑까지, 앞 = 로컬 -z
  base_doors: [B('plinth', 0, 0.058, 0.05, 0.98, 0.116, 0.86), B('cabinet', 0, 0.558, 0.02, 1, 0.884, 0.96),
    B('cabDoor', 0, 0.89, -0.49, 0.97, 0.15, 0.02), B('cabDoor', -0.2475, 0.46, -0.49, 0.475, 0.64, 0.02), B('cabDoor', 0.2475, 0.46, -0.49, 0.475, 0.64, 0.02),
    B('chrome', 0, 0.89, -0.505, 0.16, 0.02, 0.02), B('chrome', -0.05, 0.7, -0.505, 0.015, 0.1, 0.02), B('chrome', 0.05, 0.7, -0.505, 0.015, 0.1, 0.02)],
  base_drawers: [B('plinth', 0, 0.058, 0.05, 0.98, 0.116, 0.86), B('cabinet', 0, 0.558, 0.02, 1, 0.884, 0.96),
    ...[0.21, 0.42, 0.63, 0.86].map((y, i) => B('cabDoor', 0, y, -0.49, 0.97, i === 3 ? 0.2 : 0.19, 0.02)),
    ...[0.24, 0.45, 0.66, 0.89].map(y => B('chrome', 0, y, -0.505, 0.2, 0.02, 0.02))],
  base_island: [B('plinth', 0, 0.058, 0, 0.98, 0.116, 0.8), B('cabinet', 0, 0.558, 0, 1, 0.884, 0.96),
    ...[-1, 1].flatMap(f => [B('cabDoor', -0.2475, 0.53, f * 0.49, 0.475, 0.78, 0.02), B('cabDoor', 0.2475, 0.53, f * 0.49, 0.475, 0.78, 0.02),
      B('chrome', -0.05, 0.8, f * 0.505, 0.015, 0.1, 0.02), B('chrome', 0.05, 0.8, f * 0.505, 0.015, 0.1, 0.02)])],
  countertop: [B('epoxy', 0, 0.5, 0, 1, 1, 1)],
  // 벽걸이 상부장 (C8 PL-01, 밑 4'-6" 위 7'-0"): 몸통 + 문 2 짝 + 아래 손잡이; 열린 선반 (창고)
  upper_cabinet: [B('cabinet', 0, 0.5, 0.02, 1, 1, 0.96), B('cabDoor', -0.2475, 0.5, -0.48, 0.475, 0.96, 0.02), B('cabDoor', 0.2475, 0.5, -0.48, 0.475, 0.96, 0.02),
    B('chrome', -0.05, 0.12, -0.5, 0.015, 0.12, 0.02), B('chrome', 0.05, 0.12, -0.5, 0.015, 0.12, 0.02)],
  wall_shelf: [B('shelf', -0.49, 0.5, 0, 0.02, 1, 1), B('shelf', 0.49, 0.5, 0, 0.02, 1, 1), B('shelf', 0, 0.5, 0.48, 1, 1, 0.03),
    ...[0.02, 0.5, 0.98].map(y => B('shelf', 0, y, 0, 1, 0.03, 1))],
  // 싱크: 상판 위 테두리 + 어두운 볼 바닥 + 수전 (상판에 묻힌 볼은 상판 상자에 가려지므로 테두리로 표시)
  sink: [B('steel', 0, 0.12, -0.46, 1, 0.24, 0.08), B('steel', 0, 0.12, 0.46, 1, 0.24, 0.08), B('steel', -0.46, 0.12, 0, 0.08, 0.24, 1), B('steel', 0.46, 0.12, 0, 0.08, 0.24, 1),
    B('equipDark', 0, 0.03, 0, 0.9, 0.06, 0.9), B('chrome', 0, 1.6, 0.45, 0.06, 2.4, 0.06, 'c'), B('chrome', 0, 2.8, 0.25, 0.06, 0.06, 0.45)],
  marker_board: [B('white', 0, 0.5, 0, 1, 1, 1), B('chrome', 0, 0.98, 0, 1.01, 0.04, 1.2), B('chrome', 0, 0.02, 0, 1.01, 0.04, 1.4)],
  wall_monitor: [B('screen', 0, 0.5, 0, 1, 1, 1)],
  toilet: [B('porcelain', 0, 0.3, -0.12, 0.85, 0.6, 0.7, 'c'), B('porcelain', 0, 0.62, 0.36, 0.95, 0.5, 0.26), B('porcelain', 0, 0.15, 0.1, 0.5, 0.3, 0.5)],
  urinal: [B('porcelain', 0, 0.62, 0.2, 0.9, 0.7, 0.6), B('chrome', 0, 0.98, 0.42, 0.1, 0.04, 0.1)],
  lavatory: [B('porcelain', 0, 0.94, -0.05, 0.8, 0.12, 0.85), B('chrome', 0, 1.0, 0.38, 0.08, 0.12, 0.08, 'c'), B('chrome', 0, 0.5, 0.42, 0.08, 0.8, 0.08, 'c')],
  drinking_fountain: [B('steel', -0.25, 0.75, 0.1, 0.48, 0.25, 0.8), B('steel', 0.25, 0.85, 0.1, 0.48, 0.25, 0.8)],
  // 장비
  car: [B('carBody', 0, 0.33, 0, 1, 0.38, 0.95), B('carBody', -0.04, 0.68, 0, 0.55, 0.32, 0.86), B('glass', -0.04, 0.68, 0, 0.56, 0.24, 0.87),
    ...[-0.32, 0.32].flatMap(a => [-0.44, 0.44].map(b => B('tire', a, 0.21, b, 0.15, 0.42, 0.1, 'cz')))],
  truck: [B('carBody', 0.1, 0.35, 0, 0.8, 0.4, 0.95), B('carBody', -0.28, 0.72, 0, 0.42, 0.4, 0.9), B('glass', -0.3, 0.75, 0, 0.43, 0.25, 0.91), B('metal', 0.18, 0.58, 0, 0.62, 0.06, 0.95),
    ...[-0.34, 0.3].flatMap(a => [-0.44, 0.44].map(b => B('tire', a, 0.17, b, 0.14, 0.34, 0.1, 'cz')))],
  dragster: [B('carBody', 0, 0.3, 0, 1, 0.12, 0.25), B('metal', 0.25, 0.45, 0, 0.18, 0.3, 0.3), B('tire', 0.38, 0.45, -0.42, 0.18, 0.9, 0.16, 'cz'), B('tire', 0.38, 0.45, 0.42, 0.18, 0.9, 0.16, 'cz'),
    B('tire', -0.45, 0.15, -0.3, 0.05, 0.3, 0.05, 'cz'), B('tire', -0.45, 0.15, 0.3, 0.05, 0.3, 0.05, 'cz')],
  lift2: [B('safety', -0.47, 0.5, 0, 0.06, 1, 0.12), B('safety', 0.47, 0.5, 0, 0.06, 1, 0.12), B('safety', 0, 0.985, 0, 1, 0.03, 0.06), B('metal', -0.3, 0.06, 0, 0.35, 0.02, 0.06), B('metal', 0.3, 0.06, 0, 0.35, 0.02, 0.06)],
  lift4: [...legs4('safety', 1, 0.05, 0.47), B('metal', 0, 0.35, -0.3, 0.95, 0.05, 0.22), B('metal', 0, 0.35, 0.3, 0.95, 0.05, 0.22), B('safety', 0, 0.97, -0.47, 1, 0.06, 0.05), B('safety', 0, 0.97, 0.47, 1, 0.06, 0.05)],
  dyno: [B('equipDark', 0, 0.12, 0, 1, 0.24, 1), B('equip', 0.3, 0.55, 0, 0.35, 0.6, 0.8), B('steel', -0.2, 0.3, 0, 0.3, 0.1, 0.8, 'cz')],
  robot_cell: [B('metal', 0, 0.2, 0, 1, 0.4, 1), B('robot', 0, 0.48, 0, 0.18, 0.16, 0.18, 'c'), B('robot', 0, 0.68, 0, 0.08, 0.3, 0.08), B('robotAccent', 0.08, 0.86, 0, 0.25, 0.06, 0.06), B('robot', 0.2, 0.82, 0, 0.05, 0.12, 0.05)],
  asrs: [B('shelf', -0.48, 0.5, 0, 0.04, 1, 1), B('shelf', 0.48, 0.5, 0, 0.04, 1, 1), ...[0.05, 0.3, 0.55, 0.8, 0.99].map(y => B('shelf', 0, y, 0, 1, 0.02, 1)), B('safety', 0, 0.5, 0, 0.04, 1, 1)],
  conveyor: [B('equipDark', 0, 0.85, 0, 1, 0.15, 1), ...legs4('metal', 0.8, 0.04, 0.46)],
  printer3d: [B('equipDark', 0, 0.5, 0, 1, 1, 1), B('glass', 0, 0.55, -0.5, 0.8, 0.7, 0.02)],
  plotter: [B('equip', 0, 0.78, 0, 1, 0.3, 0.7), B('metal', -0.45, 0.32, 0, 0.05, 0.64, 0.5), B('metal', 0.45, 0.32, 0, 0.05, 0.64, 0.5)],
  laser_cutter: [B('equipDark', 0, 0.38, 0, 1, 0.76, 1), B('equip', 0, 0.86, 0.1, 1, 0.2, 0.8), B('glass', 0, 0.86, -0.32, 0.9, 0.18, 0.02)],
  hood: [B('cabinet', 0, 0.2, 0, 1, 0.4, 1), B('epoxy', 0, 0.41, 0, 1, 0.02, 1), B('white', 0, 0.75, 0.1, 1, 0.5, 0.8), B('glass', 0, 0.62, -0.32, 0.9, 0.3, 0.02)],
  booth: [B('equip', 0, 0.5, 0, 1, 1, 1), B('glass', 0, 0.55, -0.5, 0.3, 0.25, 0.02)],
  tower: [B('equip', 0, 0.35, 0, 1, 0.7, 1), B('equip', 0, 0.8, 0, 0.8, 0.4, 0.8, 'c')],
  fridge: [B('steel', 0, 0.5, 0, 1, 1, 1)],
  microwave: [B('equipDark', 0, 0.5, 0, 1, 1, 1), B('glass', -0.1, 0.5, -0.5, 0.6, 0.6, 0.02)],
  light_table: [B('white', 0, 0.96, 0, 1, 0.08, 1), ...legs4('metal', 0.92, 0.05, 0.45)],
  tool_cabinet: [B('safety', 0, 0.5, 0, 1, 1, 1), B('metal', 0, 0.02, 0, 0.95, 0.04, 0.95)],
  tool: [B('safety', 0, 0.5, 0, 0.7, 1, 0.6), B('equipDark', 0.2, 0.4, 0, 0.3, 0.5, 0.4)],
  trainer: [B('metal', 0, 0.36, 0, 1, 0.04, 1), ...legs4('metal', 0.36, 0.04, 0.46), B('equip', 0, 0.68, 0.35, 0.95, 0.6, 0.12), B('equip', -0.2, 0.48, -0.1, 0.4, 0.2, 0.5)],
  machine: [B('equip', 0, 0.45, 0, 1, 0.9, 1), B('equipDark', 0, 0.93, 0, 0.9, 0.06, 0.9)],
  bench_unit: [B('equip', 0, 0.4, 0, 1, 0.8, 1), B('equipDark', 0.15, 0.88, 0, 0.5, 0.16, 0.6)],
  tv_stand: [B('screen', 0, 0.82, 0, 1, 0.36, 0.08), B('metal', 0, 0.35, 0, 0.06, 0.7, 0.06), B('metal', 0, 0.02, 0, 0.6, 0.04, 0.8)],
};
const ALIAS = { base_cabinet: 'base_doors' };
const CAR_COLORS = [0xb3202a, 0x2c4f86, 0xdedede, 0x2b2b2b, 0x7f8c8d];

const tplCache = new Map();
/** 종류 → [{mat, geom}] (재질별로 부품을 합친 단위 형상) */
function template(type) {
  if (tplCache.has(type)) return tplCache.get(type);
  const parts = T[ALIAS[type] || type] || T.machine;
  const byMat = new Map();
  for (const [m, cx, cy, cz, sx, sy, sz, s] of parts) {
    let g;
    if (s === 'c') g = new THREE.CylinderGeometry(0.5, 0.5, 1, 10, 1);
    else if (s === 'cz') { g = new THREE.CylinderGeometry(0.5, 0.5, 1, 10, 1); g.rotateX(Math.PI / 2); }
    else g = new THREE.BoxGeometry(1, 1, 1);
    g.scale(sx, sy, sz);                    // 'cz': x·y = 지름, z = 길이
    g.translate(cx, cy, cz);
    g = g.toNonIndexed(); g.deleteAttribute('uv');
    if (!byMat.has(m)) byMat.set(m, []);
    byMat.get(m).push(g);
  }
  const out = [...byMat].map(([m, gs]) => ({ mat: MATS[m], geom: BufferGeometryUtils.mergeGeometries(gs) }));
  tplCache.set(type, out);
  return out;
}

/** 한 층의 내용물 → Group (InstancedMesh 들). clip = 단면 절단면 */
export function buildContents(fl, clip) {
  const G = new THREE.Group(); G.name = 'contents';
  const all = [];
  for (const key of ['equipment', 'casework', 'fixtures', 'furniture']) for (const it of fl[key] || []) all.push([key, it]);
  const byType = new Map();
  for (const [key, it] of all) { if (!byType.has(it.type)) byType.set(it.type, []); byType.get(it.type).push(it); }
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0), s = new THREE.Vector3(), p = new THREE.Vector3();
  const col = new THREE.Color();
  for (const [type, items] of byType) {
    for (const { mat, geom } of template(type)) {
      if (clip && !mat.clippingPlanes) mat.clippingPlanes = [clip];
      const im = new THREE.InstancedMesh(geom, mat, items.length);
      im.name = 'c_' + type + '_' + mat.name;
      items.forEach((it, i) => {
        q.setFromAxisAngle(up, it.rot || 0);
        p.set(it.x, fl.y + F + (it.y0 || 0), it.z);
        s.set(Math.max(it.w, 0.05), Math.max(it.h, 0.05), Math.max(it.d, 0.05));
        im.setMatrixAt(i, m4.compose(p, q, s));
        if (mat === MATS.carBody) im.setColorAt(i, col.setHex(CAR_COLORS[i % CAR_COLORS.length]));
      });
      im.castShadow = true; im.receiveShadow = true;
      im.computeBoundingSphere();
      G.add(im);
    }
  }
  return G;
}

/** 방 번호별 내용물 요약 (정보 패널용) */
export function contentsByRoom(fl) {
  const out = {};
  for (const key of ['equipment', 'casework', 'fixtures', 'furniture']) for (const it of fl[key] || []) {
    const o = out[it.room] || (out[it.room] = { equipment: 0, casework: 0, fixtures: 0, furniture: 0, estimated: 0, tags: [] });
    o[key]++;
    if (it.estimated) o.estimated++;
    if (it.tag && o.tags.length < 6) o.tags.push(it.tag + (it.label ? ' ' + it.label : ''));
  }
  return out;
}
