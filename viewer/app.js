// Indiana State University main campus – 3D viewer
// 단위 피트. 월드 X=동, Y=위, Z=남. 원점 = 캠퍼스 중심 (39.4710, -87.4100).
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import * as G from './lib/geom.js';
import { makeMaterials } from './lib/materials.js';
import { buildGrassBase, buildImagery, buildPaving, buildHardscape, hardscapeCover } from './lib/ground.js';
import { buildStreet } from './lib/street.js';
import { buildSports, sportsCover } from './lib/sports.js';
import { buildFountain, fountainCover } from './lib/fountain.js';
import { buildMasses } from './lib/mass.js';
import { buildTrees, buildGrassTufts } from './lib/trees.js';
import { buildLabels } from './lib/labels.js';
import { MODULES } from './buildings/index.js';
import { makePost } from './lib/post.js';
import { makeSun } from './lib/sun.js';
import { buildInterior } from './lib/interior.js';
import { sunPosition, localToDate } from './lib/solar.js';

const ASSET = (window.ASSET_BASE || 'assets/');
const params = new URLSearchParams(location.search);
const SHOT = params.get('shot');           // 헤드리스 스크린샷 모드 (프리셋 이름)
const SOLO = params.get('solo');           // ?solo=<OSM id> : 그 건물만 따로 보는 페이지 (주변 250 ft 만 잘라 보여줌)
const LOW = params.get('low') === '1';
const AO = params.get('ao') !== '0';         // ?ao=0 : 주변광 차폐 끄기 (전후 비교용)

// ------------------------------------------------------------------ renderer / scene
const canvas = document.getElementById('c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, logarithmicDepthBuffer: true, preserveDrawingBuffer: !!SHOT, powerPreference: 'high-performance' });   // 로그 깊이: 원거리 지면 레이어 z-fighting(반짝임) 방지
renderer.setPixelRatio(SHOT ? 1 : Math.min(devicePixelRatio, 1.5));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.95;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.localClippingEnabled = true;   // 실내 단면 보기 (재질별 절단면)

const scene = new THREE.Scene();
window.__scene = scene;   // 진단용
scene.fog = new THREE.FogExp2(0xdde6ee, 0.00007);

const camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 1, 30000);
const controls = new OrbitControls(camera, canvas);
window.__view = { camera, controls };   // 진단·렌더 스크립트용 (scratch/ted 의 실내 시점 렌더)
controls.enableDamping = true; controls.dampingFactor = 0.08;
controls.maxPolarAngle = Math.PI * 0.495;
controls.minDistance = 15; controls.maxDistance = 9000;
// 필요할 때만 렌더 (AO·캐스케이드 그림자로 프레임이 무거워져, 화면이 그대로일 때는 GPU 를 쉬게 한다)
let dirty = 120;
function requestRender(n = 2) { dirty = Math.max(dirty, n); }
window.__requestRender = requestRender;
controls.addEventListener('change', () => requestRender());
THREE.DefaultLoadingManager.onLoad = () => requestRender(10);
THREE.DefaultLoadingManager.onProgress = () => requestRender(4);

// ------------------------------------------------------------------ loaders
const texLoader = new THREE.TextureLoader();
function tex(name, { srgb = true, repeat = null, aniso = 8 } = {}) {
  const t = texLoader.load(ASSET + name);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  if (repeat) t.repeat.set(repeat[0], repeat[1]);
  t.anisotropy = aniso;
  return t;
}

// 하늘·태양·캐스케이드 그림자는 lib/sun.js (makeSun)

// ------------------------------------------------------------------ view presets (world ft)
const PRESETS = {
  campus: { pos: [-500, 1700, 2400], tgt: [220, 0, -150] },
  softball: { pos: [-1080, 160, -1140], tgt: [-900, 0, -1320] },   // St. John Softball Complex (홈 뒤 남서쪽 위)
  tennis: { pos: [-380, 140, -760], tgt: [-560, 0, -940] },        // 테니스·피클볼 단지 (남동쪽 위)
};
// 건물 OSM id 로 프리셋 생성: 중심에서 방위 azDeg(0=남쪽에서 바라봄, 시계방향) 방향으로 dist 만큼 떨어져 높이 elev 에서 바라봄
function lookAtBuilding(site, id, { dist = 420, elev = 180, azDeg = 0, tgtY = 20 } = {}) {
  const b = site.buildings.find(x => x.id === id);
  if (!b) return PRESETS.campus;
  const c = G.centroid(b.poly), a = azDeg * Math.PI / 180;
  return { pos: [c[0] + Math.sin(a) * dist, elev, c[1] + Math.cos(a) * dist], tgt: [c[0], tgtY, c[1]] };
}
function applyPreset(name) {
  const p = PRESETS[name] || PRESETS.campus; requestRender();
  camera.position.set(...p.pos); controls.target.set(...p.tgt); controls.update();
}

// ------------------------------------------------------------------ 건물과 겹치는 나무 제거
// 위성 판독 나무는 신축·증축(예: Technology Building 2025 증축) 자리에도 남아 있으므로, 실제 건물 형상을
// 위에서 내려다본 높이 지도(2 ft/px)를 GPU 로 한 번 렌더해 수관 중심이 건물 위/안이면 제거, 가장자리가 걸리면 수관을 줄인다.
function cullTreesUnderBuildings(list, roots, clip) {
  const res = 2, W = Math.ceil((clip[2] - clip[0]) / res), H = Math.ceil((clip[3] - clip[1]) / res);
  const rt = new THREE.WebGLRenderTarget(W, H);
  const cam = new THREE.OrthographicCamera(clip[0], clip[2], -clip[1], -clip[3], 1, 2000);
  cam.position.set(0, 1000, 0); cam.up.set(0, 0, -1); cam.lookAt(0, 0, 0);
  const mat = new THREE.ShaderMaterial({
    vertexShader: 'varying float vY; void main(){ vec4 w = modelMatrix * vec4(position,1.0); vY = w.y; gl_Position = projectionMatrix * viewMatrix * w; }',
    fragmentShader: 'varying float vY; void main(){ gl_FragColor = vec4(clamp(vY/255.0,0.0,1.0), 0.0, 0.0, 1.0); }',
    side: THREE.DoubleSide,
  });
  const tmp = new THREE.Scene(); tmp.overrideMaterial = mat;
  const parents = roots.map(r => [r, r.parent]);
  for (const r of roots) tmp.add(r);
  renderer.setRenderTarget(rt); renderer.setClearColor(0x000000, 1); renderer.clear(); renderer.render(tmp, cam); renderer.setRenderTarget(null);
  for (const [r, p] of parents) p.add(r);
  const px = new Uint8Array(W * H * 4); renderer.readRenderTargetPixels(rt, 0, 0, W, H, px); rt.dispose(); mat.dispose();
  let nz = 0; for (let i = 0; i < W * H; i++) if (px[i * 4] > 3) nz++;
  console.log('tree-cull heightmap', W, H, 'building px', nz, 'roots', roots.length);
  // 렌더 타겟 축 방향은 드라이버/three 버전에 따라 헷갈리므로, 건물 중심점(대부분 건물 위)으로 4가지 조합을 검증해 고른다
  const mk = (fx, fz) => (x, z) => {
    let i = Math.floor((x - clip[0]) / res), j = Math.floor((z - clip[1]) / res);
    if (fx) i = W - 1 - i; if (fz) j = H - 1 - j;
    if (i < 0 || j < 0 || i >= W || j >= H) return 0;
    return px[(j * W + i) * 4];
  };
  let hAt = null, best = -1;
  for (const fx of [false, true]) for (const fz of [false, true]) {
    const f = mk(fx, fz); let hit = 0;
    for (const c of (cullTreesUnderBuildings.centers || [])) if (f(c[0], c[1]) > 3) hit++;
    if (hit > best) { best = hit; hAt = f; }
  }
  console.log('tree-cull orientation hits', best, '/', (cullTreesUnderBuildings.centers || []).length);
  const out = [];
  for (const t of list) {
    const r = t[5] || 12;
    if (hAt(t[0], t[1]) > 3) continue;                                    // 중심이 건물 안/위
    let edge = 0;
    for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; edge = Math.max(edge, hAt(t[0] + Math.cos(a) * r * 0.7, t[1] + Math.sin(a) * r * 0.7)); }
    if (edge > 3) { const t2 = t.slice(); t2[5] = r * 0.55; t2[2] = Math.max(16, t[2] * 0.8); out.push(t2); }   // 벽에 걸리면 축소
    else out.push(t);
  }
  return out;
}

// ------------------------------------------------------------------ 건물 선택
function setupPicking(site, info, roots) {
  const panel = document.getElementById('info'), body = document.getElementById('infoBody');
  if (!panel) return;
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  const polys = site.buildings.map(b => ({ id: b.id, poly: b.poly, c: G.centroid(b.poly) }));
  const inPoly = (x, z, p) => { let k = false; for (let i = 0, j = p.length - 1; i < p.length; j = i++) { const a = p[i], b = p[j]; if ((a[1] > z) !== (b[1] > z) && x < (b[0] - a[0]) * (z - a[1]) / (b[1] - a[1]) + a[0]) k = !k; } return k; };
  const nearest = (x, z) => {   // 외곽선 안이면 그 건물, 아니면 6 ft 이내 가장 가까운 외곽선(캐노피·차양 등 외곽선 밖 부속물)
    for (const p of polys) if (inPoly(x, z, p.poly)) return p.id;
    let best = null, bd = 36;
    for (const p of polys) for (let i = 0; i < p.poly.length; i++) {
      const a = p.poly[i], b = p.poly[(i + 1) % p.poly.length], dx = b[0] - a[0], dz = b[1] - a[1], L = dx * dx + dz * dz || 1;
      const t = Math.max(0, Math.min(1, ((x - a[0]) * dx + (z - a[1]) * dz) / L)), ex = a[0] + t * dx - x, ez = a[1] + t * dz - z, d = ex * ex + ez * ez;
      if (d < bd) { bd = d; best = p.id; }
    }
    return best;
  };
  // 선택 강조: 외곽선을 따라 바닥에 얇은 띠 + 꼭대기 테두리
  const hl = new THREE.Group(); hl.name = 'selection'; scene.add(hl);
  const hlMat = new THREE.LineBasicMaterial({ color: 0x7fc1ff, depthTest: false, transparent: true });
  const show = (id) => {
    hl.clear();
    const d = info[id]; if (!d) { panel.classList.remove('open'); return; }
    const p = polys.find(q => q.id === id), top = (d.height_ft || 30) + 1;
    for (const y of [0.6, top]) {
      const pts = p.poly.map(q => new THREE.Vector3(q[0], y, q[1])); pts.push(pts[0].clone());
      const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), hlMat); line.renderOrder = 10; hl.add(line);
    }
    const row = (k, v) => v !== '' && v != null ? `<dt>${k}</dt><dd>${v}</dd>` : '';
    body.innerHTML = `<h2>${esc(d.name)}</h2><span class="tag">${esc(d.model)}</span><dl>` +
      row('Campus map no.', esc(d.map_no)) + row('Built', esc(d.year)) + row('Storeys', esc(d.storeys)) +
      row('Height', d.height_ft ? Math.round(d.height_ft) + ' ft (' + Math.round(d.height_ft * 0.3048) + ' m)' : '') +
      row('Notes', esc(d.notes)) + (SOLO ? '' : row('View', `<a href="?solo=${encodeURIComponent(id)}" target="_blank" rel="noopener" style="color:var(--accent)">Open this building on its own ↗</a>`)) + row('OSM', `<a href="https://www.openstreetmap.org/${id}" target="_blank" rel="noopener" style="color:var(--accent)">${id}</a>`) +
      `</dl><div class="src"><b>Modelled from:</b> ${esc(d.sources)}</div>`;
    panel.classList.add('open'); requestRender();
  };
  const esc = (t) => String(t ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  document.getElementById('infoClose').addEventListener('click', () => { panel.classList.remove('open'); hl.clear(); requestRender(); });
  // 드래그(궤도 회전)와 클릭 구분
  let down = null;
  canvas.addEventListener('pointerdown', e => { down = [e.clientX, e.clientY]; });
  canvas.addEventListener('pointerup', e => {
    if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 5 || e.button !== 0) return;
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hits = ray.intersectObjects(roots.filter(o => o.visible), true);
    const shown = (o) => { for (; o; o = o.parent) if (!o.visible) return false; return true; };   // 부모 그룹까지 보이는 것만
    const h = hits.find(x => shown(x.object) && !x.object.isSprite);
    if (window.__interiorPick && window.__interiorPick(h)) return;
    if (!h) { panel.classList.remove('open'); hl.clear(); requestRender(); return; }
    // 벽면을 클릭한 경우 바깥으로 약간 밀린 점이 나올 수 있으므로 법선 반대로 1 ft 들어간 점으로 판정
    const pt = h.point.clone(); if (h.face) { const n = h.face.normal.clone().transformDirection(h.object.matrixWorld); pt.addScaledVector(n, -1); }
    show(nearest(pt.x, pt.z));
  });
  window.__pickBuilding = (id) => show(id);   // 테스트용
  window.__pickAt = (cx, cy) => {             // 진단용: 화면 좌표의 첫 히트
    const r = canvas.getBoundingClientRect();
    ndc.set(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1); ray.setFromCamera(ndc, camera);
    const hits = ray.intersectObjects(roots.filter(o => o.visible), true);
    const h = hits[0]; if (!h) return null;
    const pt = h.point.clone(); if (h.face) { const n = h.face.normal.clone().transformDirection(h.object.matrixWorld); pt.addScaledVector(n, -1); }
    return { hit: h.point.toArray().map(v => Math.round(v)), probe: pt.toArray().map(v => Math.round(v)), id: nearest(pt.x, pt.z) };
  };
}

// ------------------------------------------------------------------ GLB export
async function exportGLB() {
  const exp = new GLTFExporter();
  const clone = scene.clone(true);
  const toReplace = [];
  clone.traverse(o => { if (o.isInstancedMesh) toReplace.push(o); });
  // 내보내기용 단순 수관: 화면용 울퉁불퉁 수관(덩어리 9 개)은 나무 1,800 그루 × 병합 시 100 MB 이상이 되므로 구 1 개 / 원뿔 1 개로 대체
  const proxy = {
    trees_round: (() => { const g = new THREE.IcosahedronGeometry(0.5, 1); g.translate(0, 0.5, 0); return g; })(),
    trees_oval: (() => { const g = new THREE.IcosahedronGeometry(0.5, 1); g.scale(0.9, 1, 0.9); g.translate(0, 0.5, 0); return g; })(),
    trees_conifer: (() => { const g = new THREE.ConeGeometry(0.46, 0.85, 8); g.translate(0, 0.72, 0); return g; })(),
  };
  for (const im of toReplace) {   // 인스턴스 → 병합 지오메트리
    if (!im.count || im.name === 'grass_tufts' || im.name.endsWith('_core')) { im.parent.remove(im); continue; }   // 빈 인스턴스(차량 LOD 등)·풀 포기·수관 심은 제외 (수관은 단순 대체물로)
    const base = proxy[im.name] || im.geometry;
    const geos = []; const mtx = new THREE.Matrix4();
    for (let i = 0; i < im.count; i++) { im.getMatrixAt(i, mtx); const g = base.clone(); for (const k of Object.keys(g.attributes)) if (!['position', 'normal', 'uv'].includes(k)) g.deleteAttribute(k); g.applyMatrix4(mtx); geos.push(g.index ? g.toNonIndexed() : g); }
    const mesh = new THREE.Mesh(BufferGeometryUtils.mergeGeometries(geos), im.material); mesh.name = im.name;
    im.parent.add(mesh); im.parent.remove(im);
  }
  const drop = []; clone.traverse(o => { if (o.name === 'sky' || o.name === 'skirt' || o.name === 'labels' || o.isSprite || o.isLight) drop.push(o); });
  drop.forEach(o => o.parent && o.parent.remove(o));
  // 비인덱스 메시는 같은 정점을 합쳐 인덱스화 (용량 약 1/2~1/3)
  clone.traverse(o => { if (o.isMesh && !o.geometry.index) { try { o.geometry = BufferGeometryUtils.mergeVertices(o.geometry, 1e-3); } catch (e) {} } });
  const result = await new Promise((res, rej) => exp.parse(clone, res, rej, { binary: true, onlyVisible: true, maxTextureSize: 2048 }));
  const blob = new Blob([result], { type: 'model/gltf-binary' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'isu_campus.glb'; a.click();
  return blob.size;
}
window.exportGLB = exportGLB;

// ------------------------------------------------------------------ VR 용 단일 건물 GLB (Unreal / Omni One)
// 단위 m, Y-up(glTF 표준, Unreal 가져오기 시 Z-up 으로 변환됨). 건물 + 반경 r ft 지면 원판.
// 노드 구분: WALKABLE (바닥·계단·지면 — 이동 가능), COLLISION (벽·유리·외관·장비·가구·난간 — 충돌), VISUAL (천장·조명 — 충돌 없음).
// 원점 = 건물 대표점 바닥(FIRST 100'-0" 의 지반 쪽, 서측 보도 95'-0" 가 y = 0).
async function exportBuildingGLB(groupName = 'bldg_tech', r = 220) {
  const src = scene.getObjectByName(groupName); if (!src) throw new Error('no ' + groupName);
  if (src.userData && src.children) { const it = src.getObjectByName('interior'); if (it && it.userData.setFloor) it.userData.setFloor(null); }
  src.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(src), c = box.getCenter(new THREE.Vector3());
  const FT = 0.3048, root = new THREE.Group(); root.name = 'ISU_' + groupName.replace('bldg_', '');
  const cats = { WALKABLE: new THREE.Group(), COLLISION: new THREE.Group(), VISUAL: new THREE.Group() };
  for (const [k, g] of Object.entries(cats)) { g.name = k; root.add(g); }
  const classify = (o) => {
    const n = ((o.material && o.material.name) || '') + ' ' + o.name;
    for (let p = o; p; p = p.parent) if (p.name === 'ceiling') return 'VISUAL';
    if (/int_light/.test(n)) return 'VISUAL';
    if (/int_slab|int_stair_(terrazzo|concrete|wood|grating)|int_landing|int_ramp_|int_mezz_/.test(n)) return 'WALKABLE';   // 경사로·메자닌 바닥도 보행면
    if (/^int_/.test(o.material && o.material.name || '') && !/int_(wall|glass|mullion|frame|door|base|rail|stair_steel|elev|c_)/.test(n)) return 'WALKABLE';   // 실 바닥 마감 (재질 이름 = 마감 코드)
    return 'COLLISION';
  };
  const M4 = new THREE.Matrix4().makeTranslation(-c.x, 0, -c.z).premultiply(new THREE.Matrix4().makeScale(FT, FT, FT));
  let n = 0;
  src.traverse(o => {
    if (!o.isMesh || o.isSprite || !o.geometry) return;
    for (let p = o; p; p = p.parent) if (!p.visible) return;
    const geos = [];
    if (o.isInstancedMesh) { const m = new THREE.Matrix4(); for (let i = 0; i < o.count; i++) { o.getMatrixAt(i, m); const g = o.geometry.clone(); g.applyMatrix4(new THREE.Matrix4().multiplyMatrices(o.matrixWorld, m)); geos.push(g); } }
    else { const g = o.geometry.clone(); g.applyMatrix4(o.matrixWorld); geos.push(g); }
    for (const g of geos) { for (const k of Object.keys(g.attributes)) if (!['position', 'normal', 'uv'].includes(k)) g.deleteAttribute(k); }
    const g = geos.length > 1 ? BufferGeometryUtils.mergeGeometries(geos.map(x => x.index ? x.toNonIndexed() : x)) : geos[0];
    if (!g) return;
    g.applyMatrix4(M4);
    const mat = o.material.clone(); mat.clippingPlanes = null;
    const mesh = new THREE.Mesh(g, mat); mesh.name = (o.name || mat.name || 'mesh') + '_' + (n++);
    cats[classify(o)].add(mesh);
  });
  // 지면 원판 (건물 주변 이동용)
  const disc = new THREE.Mesh(new THREE.CircleGeometry(r * FT, 64).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0x7f9a5a, roughness: 1, name: 'ground' }));
  disc.name = 'ground'; disc.position.y = -0.01; cats.WALKABLE.add(disc);
  root.userData = { units: 'metres', note: 'WALKABLE = floors/stairs/ground, COLLISION = walls/glass/exterior/equipment, VISUAL = ceilings/lights' };
  const exp = new GLTFExporter();
  const result = await new Promise((res, rej) => exp.parse(root, res, rej, { binary: true, maxTextureSize: 2048 }));
  const blob = new Blob([result], { type: 'model/gltf-binary' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = root.name + '_vr.glb'; a.click();
  return { size: blob.size, counts: Object.fromEntries(Object.entries(cats).map(([k, g]) => [k, g.children.length])) };
}
window.exportBuildingGLB = exportBuildingGLB;

// ------------------------------------------------------------------ 태양 위치 (날짜·시각 → 실제 태양 고도·방위)
// 기준점 = 좌표 원점 (39.471 N, 87.410 W). ?sun=YYYY-MM-DDTHH:MM 로 지정, 렌더(?shot)는 재현성을 위해 하지 오후 3 시가 기본.
const LAT = 39.471, LON = -87.410, TZ = 'America/Indiana/Indianapolis';
function setupSunUI(sun) {
  const dateEl = document.getElementById('sunDate'), timeEl = document.getElementById('sunTime'), label = document.getElementById('sunLabel');
  const todayLocal = () => new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(new Date());
  const q = params.get('sun');
  let ymd = SHOT ? '2026-06-21' : todayLocal(), hours = 15;
  if (q && /^\d{4}-\d{2}-\d{2}T\d{1,2}:\d{2}$/.test(q)) { const [d, t] = q.split('T'); ymd = d; hours = +t.split(':')[0] + +t.split(':')[1] / 60; }
  const state = { ymd, hours };
  const fmt = h => { const H = Math.floor(h), M = Math.round((h - H) * 60); return `${((H + 11) % 12) + 1}:${String(M).padStart(2, '0')} ${H < 12 ? 'AM' : 'PM'}`; };
  const compass = a => ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.round(a / 45) % 8];
  let pending = false;
  function apply() {
    pending = false;
    const p = sunPosition(localToDate(state.ymd, state.hours, TZ), LAT, LON);
    sun.setSun(p.elev, p.az); requestRender();
    if (label) label.textContent = `${state.ymd} ${fmt(state.hours)} · sun ${p.elev.toFixed(0)}° high, ${compass(p.az)} (${p.az.toFixed(0)}°)${p.elev < 0 ? ' · below horizon' : ''}`;
  }
  const schedule = () => { if (!pending) { pending = true; requestAnimationFrame(apply); } };   // 슬라이더 드래그 중 환경광 재계산을 프레임당 1 회로
  if (dateEl) { dateEl.value = state.ymd; dateEl.addEventListener('input', () => { if (dateEl.value) { state.ymd = dateEl.value; schedule(); } }); }
  if (timeEl) { timeEl.value = state.hours; timeEl.addEventListener('input', () => { state.hours = +timeEl.value; schedule(); }); }
  const now = document.getElementById('sunNow');
  if (now) now.addEventListener('click', () => {
    const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: TZ, hourCycle: 'h23', hour: '2-digit', minute: '2-digit' }).formatToParts(new Date()).map(x => [x.type, x.value]));
    state.ymd = todayLocal(); state.hours = Math.min(21, Math.max(5, +p.hour + +p.minute / 60));
    if (dateEl) dateEl.value = state.ymd; if (timeEl) timeEl.value = state.hours; schedule();
  });
  const play = document.getElementById('sunPlay'); let timer = null;
  if (play) play.addEventListener('click', () => {
    if (timer) { clearInterval(timer); timer = null; play.textContent = '▶'; return; }
    if (state.hours >= 21) state.hours = 5;
    play.textContent = '❚❚';
    timer = setInterval(() => {
      state.hours = Math.min(21, state.hours + 0.1); if (timeEl) timeEl.value = state.hours; schedule();
      if (state.hours >= 21) { clearInterval(timer); timer = null; play.textContent = '▶'; }
    }, 60);
  });
  apply();
}

// ------------------------------------------------------------------ 단독 건물 보기 (?solo=<OSM id>)
function setupSolo(site, mod) {
  // 단독 보기 = Revit 3D 뷰처럼 건물만: 배경(지면·도로·나무·다른 건물·하늘) 없이 밝은 단색 배경 + 그림자 받는 바닥판.
  // 오른쪽 세로 크롭 바(위·아래 두 손잡이)로 높이(Z, 월드 y) 구간만 잘라 본다 = Revit 단면 상자의 위/아래 면.
  const grp = mod ? scene.getObjectByName('bldg_' + mod.meta.id) : null;
  if (!grp) { console.warn('solo: building not found', SOLO); return; }
  for (const o of [...scene.children]) {
    if (o === grp || o.isLight || (o.parent === scene && o.type === 'Object3D' && scene.children.some(l => l.isDirectionalLight && l.target === o))) continue;
    o.visible = false;
  }
  scene.fog = null;
  scene.background = new THREE.Color(0xe9ecef);
  grp.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(grp), c = box.getCenter(new THREE.Vector3()), sz = box.getSize(new THREE.Vector3());
  // 그림자 받는 바닥판 (그림자만 보임) + 옅은 격자 (10 ft)
  const R = Math.max(sz.x, sz.z) * 0.75;
  const shadowPlane = new THREE.Mesh(new THREE.PlaneGeometry(R * 3, R * 3).rotateX(-Math.PI / 2), new THREE.ShadowMaterial({ opacity: 0.22 }));
  shadowPlane.position.set(c.x, box.min.y + 0.02, c.z); shadowPlane.receiveShadow = true; shadowPlane.name = 'solo_floor'; scene.add(shadowPlane);
  const grid = new THREE.GridHelper(Math.ceil(R * 2.4 / 10) * 10, Math.ceil(R * 2.4 / 10), 0xb9bec4, 0xd5d9dd);
  grid.position.set(c.x, box.min.y + 0.03, c.z); grid.material.transparent = true; grid.material.opacity = 0.6; scene.add(grid);
  // 높이 크롭: 위 면(아래쪽만 남김) + 아래 면(위쪽만 남김). 모든 재질에 추가 (실내 단면 절단면과 함께 동작)
  renderer.localClippingEnabled = true;
  const top = new THREE.Plane(new THREE.Vector3(0, -1, 0), box.max.y + 1), bot = new THREE.Plane(new THREE.Vector3(0, 1, 0), -(box.min.y - 1));
  grp.traverse(o => {
    if (!o.material) return;
    for (const mt of Array.isArray(o.material) ? o.material : [o.material]) { mt.clippingPlanes = [...(mt.clippingPlanes || []).filter(p => p !== top && p !== bot), top, bot]; mt.clipShadows = true; mt.needsUpdate = true; }
  });
  // 크롭 바 UI
  const y0 = box.min.y, y1 = box.max.y, fmt = (v) => Math.max(0, v - y0).toFixed(1) + ' ft';
  const ui = document.createElement('div'); ui.id = 'cropbar';
  ui.innerHTML = `<style>
    #cropbar{position:fixed;right:16px;top:50%;transform:translateY(-50%);background:var(--panel);backdrop-filter:blur(8px);border:1px solid var(--border);border-radius:12px;padding:10px 8px;color:var(--fg);font-size:11px;display:flex;flex-direction:column;align-items:center;gap:6px;z-index:5}
    #cropbar .bar{position:relative;height:56vh;width:96px}
    #cropbar input[type=range]{position:absolute;left:70%;top:50%;width:56vh;transform:translate(-50%,-50%) rotate(-90deg);margin:0;background:transparent;pointer-events:none;-webkit-appearance:none;appearance:none;accent-color:var(--accent)}
    #cropbar input[type=range]::-webkit-slider-thumb{pointer-events:auto}
    #cropbar input[type=range]::-moz-range-thumb{pointer-events:auto}
    #cropbar .lv{position:absolute;left:0;font-size:10px;color:var(--muted);white-space:nowrap;transform:translateY(50%);pointer-events:none}
    #info.open ~ #cropbar{right:372px}   /* 정보 패널(폭 340)이 열리면 그 왼쪽으로 */
    @media (max-width:640px){#cropbar{top:auto;bottom:16px;transform:none} #cropbar .bar{height:30vh} #cropbar input[type=range]{width:30vh} #info.open ~ #cropbar{right:16px;bottom:calc(45vh + 24px)}}
    #cropbar button{background:rgba(255,255,255,0.08);color:var(--fg);border:1px solid var(--border);border-radius:6px;font-size:11px;padding:2px 6px;cursor:pointer}
  </style>
  <b>Height crop</b><span id="cropTopV"></span>
  <div class="bar"><input type="range" id="cropTop" min="${y0}" max="${y1}" step="0.25" value="${y1}" aria-label="Crop top">
  <input type="range" id="cropBot" min="${y0}" max="${y1}" step="0.25" value="${y0}" aria-label="Crop bottom"></div>
  <span id="cropBotV"></span><button id="cropReset">Reset</button>`;
  document.body.appendChild(ui);
  // 층 레벨 눈금 (실내 모델이 있으면 층 바닥 높이)
  const bar = ui.querySelector('.bar'), it = grp.getObjectByName('interior');
  if (it && it.userData.floors) {
    const wy = new THREE.Vector3(); it.getWorldPosition(wy);
    for (const [n, f] of Object.entries(it.userData.floors)) {
      const v = wy.y + f.y; if (v < y0 || v > y1) continue;
      const l = document.createElement('div'); l.className = 'lv'; l.style.bottom = ((v - y0) / (y1 - y0) * 100) + '%'; l.textContent = n.toLowerCase() + ' —'; bar.appendChild(l);
    }
  }
  const tI = ui.querySelector('#cropTop'), bI = ui.querySelector('#cropBot');
  const apply = () => {
    let t = +tI.value, b = +bI.value; if (b > t - 1) { if (document.activeElement === bI) b = t - 1; else t = b + 1; tI.value = t; bI.value = b; }
    top.constant = t; bot.constant = -b;
    ui.querySelector('#cropTopV').textContent = '▲ ' + fmt(t); ui.querySelector('#cropBotV').textContent = '▼ ' + fmt(b);
    requestRender(2);
  };
  tI.addEventListener('input', apply); bI.addEventListener('input', apply);
  ui.querySelector('#cropReset').addEventListener('click', () => { tI.value = y1; bI.value = y0; apply(); });
  window.__soloCrop = (t, b) => { if (t != null) tI.value = y0 + t; if (b != null) bI.value = y0 + b; apply(); };   // 테스트용 (건물 바닥 기준 ft)
  const setCrop = (t, b) => { tI.value = t == null ? y1 : t; bI.value = b == null ? y0 : b; apply(); };
  apply();
  // 카메라: 건물 전체가 보이는 남서쪽 위 3/4 시점
  const r = Math.max(sz.x, sz.z);
  const dist = (r * 0.62) / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));   // 건물 폭이 화면에 들어오는 거리
  const dir = new THREE.Vector3(-0.62, 0.48, 0.62).normalize();
  const resetView = (keepCam) => { setCrop(null, null); if (!keepCam) { camera.position.copy(c).addScaledVector(dir, dist); controls.target.copy(c); controls.update(); } };
  resetView();
  controls.maxDistance = r * 4; controls.update();
  setupSoloTree(grp, mod, setCrop, resetView);
  const name = (mod && mod.meta.name) || SOLO;
  const tt = document.querySelector('#hud h1 span'); if (tt) tt.innerHTML = '<a href="./" style="color:var(--accent);text-decoration:none">← Campus</a> · ' + name.replace(/[&<>]/g, '');
  document.title = name + ' – ISU 3D';
  // 단독 보기에서 의미 없는 캠퍼스용 메뉴 숨김 (프리셋·토글·햇빛은 유지)
  const ib = document.querySelector('[data-interior]'); if (ib && !(mod && mod.meta.id === 'tech')) { ib.parentElement.style.display = 'none'; ib.parentElement.previousElementSibling.style.display = 'none'; }
  requestRender(10);
}

// ------------------------------------------------------------------ 단독 보기 계층 메뉴 (Revit 프로젝트 브라우저 같은 구조)
// Views (3D 전체 / 외관) · Levels (층별 단면) · Categories (분류별 표시 켜기·끄기) · Rooms (층별 실 목록 → 클릭하면 그 실로 이동 + 정보)
function setupSoloTree(grp, mod, setCrop, resetView) {
  const hud = document.getElementById('hud'); if (!hud) return;
  for (const el of [...hud.children]) if (el.tagName !== 'H1') el.style.display = 'none';
  const it = grp.getObjectByName('interior');
  // 메시 → 분류
  const FIX = /toilet|urinal|lavatory|sink|fountain|shower|partition_stall/i, CASE = /cabinet|counter|island|casework|shelf_wall|markerboard|tackboard|whiteboard|display|monitor_wall|wall_tv|reception/i,
    FURN = /chair|table|desk|stool|sofa|lounge|bench|seat|ottoman|bookcase|shelving|storage_shelf|monitor|workstation|cart|locker/i;
  const catOf = (o) => {
    let inInt = false, inCeil = false;
    for (let p = o; p && p !== grp; p = p.parent) { if (p === it) inInt = true; if (p.name === 'ceiling') inCeil = true; }
    if (!inInt) return 'exterior';
    if (inCeil) return 'ceilings';
    const n = o.name + ' ' + ((o.material && o.material.name) || '');
    if (/^c_/.test(o.name)) { const t = o.name.slice(2); return FIX.test(t) ? 'fixtures' : CASE.test(t) ? 'casework' : FURN.test(t) ? 'furniture' : 'equipment'; }
    if (/int_(stair|rail|landing|ramp|ladder|mezz)/.test(n)) return 'stairs';
    if (/int_(door|frame|elev)/.test(n)) return 'doors';
    if (/int_(wall|base|glass|mullion)/.test(n)) return 'walls';
    return 'floors';
  };
  const cats = {};
  grp.traverse(o => { if (o.isMesh && !o.isSprite) (cats[catOf(o)] = cats[catOf(o)] || []).push(o); });
  const CAT_LABEL = { exterior: 'Exterior', walls: 'Walls & glass', doors: 'Doors & elevator', floors: 'Floors & slabs', ceilings: 'Ceilings & lights',
    stairs: 'Stairs, ramps & rails', equipment: 'Equipment', casework: 'Casework', fixtures: 'Plumbing fixtures', furniture: 'Furniture' };
  const floors = it && it.userData.floors ? Object.entries(it.userData.floors) : [];
  const rooms = it && it.userData.rooms ? it.userData.rooms : [];
  const wy = new THREE.Vector3(); if (it) it.getWorldPosition(wy);
  const esc = (t) => String(t ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const box = document.createElement('div'); box.id = 'soloTree';
  let html = `<style>
    #soloTree{font-size:12px;margin-top:6px;max-height:calc(100vh - 110px);overflow:auto}
    #soloTree details{margin:2px 0} #soloTree summary{cursor:pointer;color:var(--muted);text-transform:uppercase;font-size:11px;letter-spacing:.04em;padding:3px 0}
    #soloTree .it{display:block;width:100%;text-align:left;background:none;border:0;color:var(--fg);padding:3px 6px 3px 14px;border-radius:6px;cursor:pointer;font-size:12px}
    #soloTree .it:hover{background:rgba(127,193,255,0.18)} #soloTree .it.on{background:rgba(127,193,255,0.3)}
    #soloTree label{display:flex;gap:6px;align-items:center;padding:2px 6px 2px 14px;cursor:pointer}
    #soloTree .sub{padding-left:10px} #soloTree .no{color:var(--muted);display:inline-block;min-width:38px}
  </style>
  <details open><summary>Views</summary>
    <button class="it" data-v="3d">3D – whole building</button>
    ${it ? '<button class="it" data-v="ext">3D – exterior only</button>' : ''}
  </details>`;
  if (floors.length) {
    html += '<details open><summary>Levels</summary>' + floors.slice().reverse().map(([n, f]) =>
      `<button class="it" data-lv="${n}">${n.charAt(0) + n.slice(1).toLowerCase()} level <span class="no">${(f.y >= 0 ? '+' : '') + f.y.toFixed(2)} ft</span></button>`).join('') + '</details>';
  }
  html += '<details open><summary>Categories</summary>' + Object.keys(CAT_LABEL).filter(k => cats[k]).map(k =>
    `<label><input type="checkbox" data-cat="${k}" checked> ${CAT_LABEL[k]}</label>`).join('') + '</details>';
  if (rooms.length) {
    html += '<details><summary>Rooms (' + rooms.length + ')</summary>' + floors.slice().reverse().map(([n]) => {
      const rs = rooms.filter(o => o.floor === n).sort((a, b) => String(a.r.no).localeCompare(String(b.r.no)));
      return rs.length ? `<details class="sub"><summary>${n.toLowerCase()} (${rs.length})</summary>` + rs.map(o =>
        `<button class="it" data-room="${rooms.indexOf(o)}"><span class="no">${esc(o.r.no || '–')}</span>${esc(o.r.name || 'Room')}</button>`).join('') + '</details>' : '';
    }).join('') + '</details>';
  }
  box.innerHTML = html; hud.appendChild(box);
  const mark = (el) => { box.querySelectorAll('.it').forEach(b => b.classList.toggle('on', b === el)); };
  const setCat = (k, v) => { for (const o of cats[k] || []) o.visible = v; requestRender(2); };
  box.querySelectorAll('[data-cat]').forEach(cb => cb.addEventListener('change', () => setCat(cb.dataset.cat, cb.checked)));
  const restoreCats = () => box.querySelectorAll('[data-cat]').forEach(cb => setCat(cb.dataset.cat, cb.checked));
  box.querySelectorAll('[data-v]').forEach(b => b.addEventListener('click', () => {
    mark(b); if (window.__setInterior) window.__setInterior(null);
    resetView(); restoreCats();
    if (b.dataset.v === 'ext') for (const k of Object.keys(cats)) if (k !== 'exterior') for (const o of cats[k]) o.visible = false;
    requestRender(4);
  }));
  box.querySelectorAll('[data-lv]').forEach(b => b.addEventListener('click', () => {
    mark(b); const f = it.userData.floors[b.dataset.lv];
    window.__setInterior(b.dataset.lv); restoreCats(); setCat('exterior', false); setCrop(null, null);
    resetView(true); requestRender(4);
  }));
  box.querySelectorAll('[data-room]').forEach(b => b.addEventListener('click', () => {
    mark(b); const o = rooms[+b.dataset.room];
    window.__setInterior(o.floor); restoreCats(); setCat('exterior', false);
    let cx = 0, cz = 0; for (const [x, z] of o.r.poly) { cx += x; cz += z; } cx /= o.r.poly.length; cz /= o.r.poly.length;
    const w = it.localToWorld(new THREE.Vector3(cx, o.y + 0.5, cz));
    const s = Math.sqrt(o.r.area || 400);
    controls.target.copy(w); camera.position.set(w.x - s * 0.9, w.y + s * 1.3 + 25, w.z + s * 1.1 + 15); controls.update();
    if (window.__interiorPick) window.__interiorPick({ point: w });
    requestRender(4);
  }));
}

// ------------------------------------------------------------------ main
async function main() {
  const status = document.getElementById('status');
  const say = (t) => { if (status) status.textContent = t; };
  say('Loading site data…');
  const site = await (await fetch(ASSET + 'site.json')).json();
  PRESETS.hmsu = lookAtBuilding(site, 'way/544820727', { dist: 520, elev: 220, azDeg: 150 });     // Hulman Memorial Student Union
  PRESETS.library = lookAtBuilding(site, 'way/349907334', { dist: 480, elev: 200, azDeg: 30 });   // Cunningham Memorial Library
  PRESETS.towers = lookAtBuilding(site, 'way/283611919', { dist: 700, elev: 320, azDeg: -40, tgtY: 60 }); // Sycamore Towers
  const M = makeMaterials(tex);
  say('Building ground…');
  const ground = buildGrassBase(site, M, tex); scene.add(ground);
  const imagery = buildImagery(site, tex); imagery.visible = false; scene.add(imagery);
  // 운동 시설 (소프트볼·테니스·피클볼·야구·축구·비치발리볼): 경기장 폴리곤은 sports.js 가 그리므로 지면 레이어에서는 뺀다
  let sports = null, inSports = null;
  try {
    const spj = await (await fetch(ASSET + 'sports.json')).json();
    sports = buildSports(spj, M, tex); scene.add(sports); inSports = sportsCover(spj);
    site.areas = site.areas.filter(a => a.kind !== 'pitch');
  } catch (e) { console.error('sports layer failed', e); }
  const paving = buildPaving(site, M, tex); scene.add(paving);
  const fountain = buildFountain(M, tex); scene.add(fountain);
  // 손 판독 포장면 (건물 입구 앞마당·광장·OSM 에 없는 보도) — assets/hardscape.json
  let inHard = null;
  try { const hj = await (await fetch(ASSET + 'hardscape.json')).json(); scene.add(buildHardscape(hj, M, tex)); inHard = hardscapeCover(hj); }
  catch (e) { console.warn('hardscape layer not loaded', e); }   // Dede Plaza 분수 광장 (드론 파노라마 기준)
  // 가로 레이어: 영상 검출 주차 차량, 횡단보도·정지선·화살표·황색 연석, 신호·표지·소화전·벤치 등 (tools/street_data.py → street.json)
  let street = null;
  try {
    const sj = await (await fetch(ASSET + 'street.json')).json();
    // 가로 시설·차량이 건물 외곽 안에 놓인 것 제거 (예: Technology Building 로비 안 자전거 거치대 — 건물 증축 후 OSM·영상 기준 위치가 실내가 됨)
    const bboxes = site.buildings.map(b => { let x0 = 1e9, x1 = -1e9, z0 = 1e9, z1 = -1e9; for (const [x, z] of b.poly) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); z0 = Math.min(z0, z); z1 = Math.max(z1, z); } return [x0, x1, z0, z1, b.poly]; });
    const pipB = (p, x, z) => { let c = false; for (let i = 0, j = p.length - 1; i < p.length; j = i++) { const a = p[i], b = p[j]; if ((a[1] > z) !== (b[1] > z) && x < (b[0] - a[0]) * (z - a[1]) / (b[1] - a[1]) + a[0]) c = !c; } return c; };
    const indoors = (x, z) => bboxes.some(([x0, x1, z0, z1, p]) => x > x0 && x < x1 && z > z0 && z < z1 && pipB(p, x, z));
    let dropped = 0;
    for (const k of Object.keys(sj)) {
      const v = sj[k];
      if (Array.isArray(v) && v.length && Array.isArray(v[0]) && typeof v[0][0] === 'number' && typeof v[0][1] === 'number') {
        const n = v.length; sj[k] = v.filter(q => !indoors(q[0], q[1])); dropped += n - sj[k].length;
      }
    }
    if (dropped) console.log('street items inside buildings removed:', dropped);
    street = buildStreet(site, sj, M); scene.add(street);
    console.log('street:', JSON.stringify(street.userData.stats));
  } catch (e) { console.error('street layer failed', e); }
  say('Building masses…');
  // ?mod=buildings/foo.js : 레지스트리에 없는 모듈을 임시로 추가 로드 (모델링 중 미리보기용)
  const extraMod = params.get('mod');
  if (extraMod) { const m = await import('./' + extraMod); MODULES[m.meta.osm] = () => Promise.resolve(m); }
  // 상세 건물 모듈을 먼저 모두 로드해 (extraIds 포함) 매스 생성에서 제외할 footprint 를 정한다
  const loaded = [];
  for (const id of Object.keys(MODULES)) {
    try { loaded.push([id, await MODULES[id]()]); } catch (e) { console.error('module load failed', id, e); }
  }
  const detailedIds = new Set();
  for (const [id, mod] of loaded) { detailedIds.add(id); for (const x of mod.meta.extraIds || []) detailedIds.add(x); }
  const masses = buildMasses(site, M, detailedIds, null); scene.add(masses.group);
  // 단독 보기: 대상 모듈(osm 또는 extraIds 가 SOLO)만 짓고, 매스 건물은 숨김
  const soloMod = SOLO ? (loaded.find(([id, m]) => id === SOLO || (m.meta.extraIds || []).includes(SOLO)) || [])[1] : null;
  if (SOLO) masses.group.visible = false;   // 지붕: 절차적 재질 (위성 텍스처는 흐릿해서 사용 안 함)
  const detailHeights = new Map();
  let interior = null, techGrp = null;
  for (const [id, mod] of loaded) {
    if (SOLO && mod !== soloMod) continue;
    say('Building detailed model: ' + mod.meta.name);
    try {
      const grp = mod.build(M, G);
      G.toWorld(grp, mod.meta.anchor, mod.meta.rotation);
      grp.name = 'bldg_' + mod.meta.id; scene.add(grp);
      if (mod.meta.id === 'tech') {   // Technology Building (cTED) 실내 — 시공 도면에서 추출 (tools/ted)
        try { interior = buildInterior(await (await fetch(ASSET + 'ted_interior.json')).json(), M, tex); grp.add(interior); techGrp = grp; }
        catch (e) { console.error('interior failed', e); }
      }
      if (mod.meta.preset) PRESETS[mod.meta.id] = mod.meta.preset;
      if (mod.meta.height) detailHeights.set(id, mod.meta.height);
      for (const extra of mod.meta.extraIds || []) detailHeights.set(extra, mod.meta.height || 40);
    } catch (e) { console.error('module failed', id, e); }
  }
  say('Placing trees…');
  const buildingRoots = scene.children.filter(o => o.name === 'masses' || o.name.startsWith('bldg_'));
  cullTreesUnderBuildings.centers = site.buildings.map(b => G.centroid(b.poly));
  const culled = cullTreesUnderBuildings(site.trees, buildingRoots, site.clip);
  console.log('trees culled by buildings:', site.trees.length - culled.length);
  const treeList = LOW ? culled.filter((_, i) => i % 2 === 0) : culled;
  const trees = buildTrees(treeList, tex, M); scene.add(trees);
  let tuftList = await (await fetch(ASSET + 'tufts.json')).json();
  if (inSports) tuftList = tuftList.filter(t => !inSports(t[0], t[1]));   // 코트·내야 위 풀 포기 제거
  tuftList = tuftList.filter(t => !fountainCover(t[0], t[1], 1) && !(inHard && inHard(t[0], t[1])));          // 분수 광장 포장·화단 위 풀 포기 제거
  const tufts = buildGrassTufts(LOW ? tuftList.filter((_, i) => i % 2 === 0) : tuftList, tex); scene.add(tufts);
  const labels = buildLabels(site, detailHeights); labels.visible = false; scene.add(labels);
  const sun = makeSun(renderer, scene, camera, { low: LOW });
  console.log('csm materials:', sun.setupMaterials(scene));
  setupSunUI(sun);

  // ---- 건물 클릭 → 오른쪽 정보 패널
  // 여러 건물을 한 모듈로 병합한 경우(교회, 타워, 소형 건물)도 구분되도록, 맞은 지점을 지면에 투영해 OSM 외곽선으로 판정한다
  const info = await (await fetch(ASSET + 'info.json')).json();
  setupPicking(site, info, buildingRoots);

  // 실내 단면 보기: 외부 껍데기 숨김 + 선택 층까지만 + 해당 층 천장 숨김
  let interiorFloor = null;
  const setInterior = (name) => {
    if (!interior) return;
    interiorFloor = name;
    for (const c of techGrp.children) if (c !== interior) c.visible = !name;
    interior.userData.setFloor(name);
    document.querySelectorAll('[data-interior]').forEach(b => b.classList.toggle('on', (b.dataset.interior || null) === (name || '')));
    if (name) {
      const f = interior.userData.floors[name], c = new THREE.Vector3(115, f.y, 30).applyMatrix4(techGrp.matrixWorld);
      camera.position.set(c.x - 150, c.y + 210, c.z + 230); controls.target.copy(c); controls.update();
    }
    requestRender();
  };
  document.querySelectorAll('[data-interior]').forEach(b => b.addEventListener('click', () => setInterior(b.dataset.interior || null)));
  window.__setInterior = setInterior;
  window.__interiorPick = (hit) => {     // 실내 단면 보기 중 클릭: 실 정보 표시 (true = 처리함)
    if (!interiorFloor || !hit) return false;
    const p = interior.worldToLocal(hit.point.clone());
    const o = interior.userData.roomAt(interiorFloor, p.x, p.z);
    if (!o) return false;
    const panel = document.getElementById('info'), body = document.getElementById('infoBody'), r = o.r, mt = (c) => (c && interior.userData.materials && interior.userData.materials[c]) ? interior.userData.materials[c].desc : c;
    const row = (k, v) => v ? `<dt>${k}</dt><dd>${String(v).replace(/[&<>]/g, '')}</dd>` : '';
    const cs = (interior.userData.floors[interiorFloor].contents || {})[r.no];
    // 가구: 도면(A-701/702)에 그려진 것 vs 용도별 추정 배치
    const contentsRows = (c) => !c ? (r.furniture_estimated ? row('Furniture', 'estimated layout') : '') :
      row('Furniture', c.furniture ? (r.furniture_estimated || c.estimated ? 'estimated layout' : c.furniture + ' items (drawn on A-701/702)') : (r.furniture_estimated ? 'estimated layout' : '')) +
      row('Equipment', c.equipment ? c.equipment + ' items' + (c.tags.length ? ': ' + c.tags.slice(0, 4).join(', ') + (c.equipment > 4 ? ', …' : '') : '') : '') +
      row('Casework', c.casework ? c.casework + ' items (A-501 / plan)' : '') + row('Fixtures', c.fixtures ? c.fixtures + ' items' : '');
    body.innerHTML = `<h2>${(r.name || 'Room').replace(/[&<>]/g, '')}</h2><span class="tag">Technology Building · ${interiorFloor.toLowerCase()} floor</span><dl>` +
      row('Room no.', r.no) + row('Area', r.area ? Math.round(r.area) + ' sf' + (r.area_label ? ' (drawing: ' + r.area_label + ' sf)' : '') : '') +
      row('Ceiling height', r._ch ? r._ch.toFixed(1) + ' ft' + (r._ch > 20 ? ' (double height)' : r.ch_source === 'default' || !r.ch ? ' (estimated)' : r.ch_source === 'note' ? ' (RCP general note)' : '') : '') +
      row('Floor', mt(r.floor)) + row('Wall', mt(r.wall)) + row('Ceiling', mt(r.ceiling)) +
      row('Finish source', r.finish_src && r.finish_src !== 'tag' ? r.finish_src.replace(/\+/g, ' + ').replace('default', 'room-type default') : '') + contentsRows(cs) +
      `</dl><div class="src"><b>From:</b> RATIO cTED construction set 2025 (A-100…A-102 plans, A-131/132 ceilings, A-151/152 + A-650 finishes, A-701/702 + A-704 equipment, A-501 elevations)</div>`;
    panel.classList.add('open'); requestRender(); return true;
  };

  // UI
  document.querySelectorAll('[data-view]').forEach(b => b.addEventListener('click', () => applyPreset(b.dataset.view)));
  const tg = (id, fn) => { const el = document.getElementById(id); if (el) { el.addEventListener('change', () => { fn(el.checked); requestRender(); }); fn(el.checked); } };
  tg('tgTrees', v => { trees.visible = v; });
  let windOn = false; const wind = trees.userData.wind;
  const windBox = document.getElementById('tgWind'); if (windBox && SHOT) windBox.checked = false;   // 기본 켜짐 (렌더 이미지는 재현성 위해 끔)
  tg('tgWind', v => { windOn = v; wind.uWind.value = v ? 1 : 0; });
  let fountainOn = false; const fBox = document.getElementById('tgFountain'); if (fBox && SHOT) fBox.checked = false;
  tg('tgFountain', v => { fountainOn = v; if (!v) fountain.userData.update(0); });   // 바람: 켜면 매 프레임 렌더
  tg('tgMass', v => { masses.group.visible = v; });
  tg('tgLabels', v => { labels.visible = v; });
  tg('tgGround', v => { imagery.visible = v; });
  tg('tgGrass', v => { tufts.visible = v; });
  tg('tgShadow', v => sun.setShadows(v));
  const post = makePost(renderer, scene, camera, { ao: AO, low: LOW }); window.__post = post;   // 진단용
  const aoBox = document.getElementById('tgAO'); if (aoBox) aoBox.checked = AO;
  tg('tgAO', v => post.setAO(v));
  addEventListener('resize', () => { post.setSize(innerWidth, innerHeight); sun.resize(); requestRender(); });
  const exBtn = document.getElementById('btnExport');
  if (exBtn) exBtn.addEventListener('click', async () => { exBtn.textContent = 'Exporting…'; const n = await exportGLB(); exBtn.textContent = 'GLB exported (' + (n / 1e6).toFixed(1) + ' MB)'; });
  const hud = document.getElementById('hud'), hudBtn = document.getElementById('hudToggle');
  // 메뉴는 기본으로 접혀 있다. 제목 줄(또는 버튼)을 누르면 열리고, 버튼을 다시 누르면 접힌다
  const setHud = (open) => { hud.classList.toggle('collapsed', !open); hudBtn.textContent = open ? '▾' : '▸ Menu'; hudBtn.title = open ? 'Collapse menu' : 'Open menu'; hudBtn.setAttribute('aria-expanded', String(open)); };
  if (hud && hudBtn) {
    hudBtn.addEventListener('click', (e) => { e.stopPropagation(); setHud(hud.classList.contains('collapsed')); });
    hud.querySelector('h1').addEventListener('click', () => { if (hud.classList.contains('collapsed')) setHud(true); });
  }

  console.log('site:', site.buildings.length, 'buildings,', masses.byId.size, 'masses,', detailedIds.size, 'detailed,', treeList.length, 'trees, mass tris', masses.tris);
  applyPreset(SHOT || 'campus');
  if (SOLO) setupSolo(site, soloMod);
  const camQ = params.get('cam');      // ?cam=px,py,pz,tx,ty,tz (거리 눈높이 렌더 등 임의 시점)
  if (camQ) { const v = camQ.split(',').map(Number); camera.position.set(v[0], v[1], v[2]); controls.target.set(v[3], v[4], v[5]); if (v[6]) { camera.fov = v[6]; camera.updateProjectionMatrix(); } controls.update(); }
  if (street) street.userData.updateCars(camera);
  if (SHOT) { const h = document.getElementById('hud'); if (h) h.classList.add('collapsed'); }   // 렌더용: HUD 접기
  say('');
  const loader = document.getElementById('loader'); if (loader) loader.style.display = 'none';

  let frames = 0;
  function animate() {
    controls.update();                                   // 감쇠 중이면 change 이벤트 → requestRender
    if (windOn) { wind.uTime.value = performance.now() / 1000; requestRender(1); }
    if (fountainOn) { fountain.userData.update(performance.now() / 1000); requestRender(1); }   // 분수 물줄기 애니메이션
    if (dirty > 0) {
      dirty--;
      if (camera.position.y < 6) camera.position.y = 6;
      sun.update();
      post.render();
      frames++;
      if (frames === 3) window.__ready = true;
    }
    if (!SHOT || frames < 6) requestAnimationFrame(animate);
  }
  if (SHOT) await new Promise(r => setTimeout(r, 3000));   // 텍스처 로딩 대기
  window.__renderNow = () => { controls.update(); sun.update(); post.render(); };   // 렌더 스크립트용: 프레임 루프가 멈춘 뒤 한 장 그리기
  window.__renderer = renderer;
  animate();
}
addEventListener('resize', () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); });
main().catch(e => { console.error(e); const s = document.getElementById('status'); if (s) s.textContent = 'Error: ' + e.message; });
