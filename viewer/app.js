// Indiana State University main campus – 3D viewer
// 단위 피트. 월드 X=동, Y=위, Z=남. 원점 = 캠퍼스 중심 (39.4710, -87.4100).
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Sky } from 'three/addons/objects/Sky.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import * as G from './lib/geom.js';
import { makeMaterials } from './lib/materials.js';
import { buildGround, buildSchematic } from './lib/ground.js';
import { buildMasses } from './lib/mass.js';
import { buildTrees } from './lib/trees.js';
import { buildLabels } from './lib/labels.js';
import { MODULES } from './buildings/index.js';

const ASSET = (window.ASSET_BASE || 'assets/');
const params = new URLSearchParams(location.search);
const SHOT = params.get('shot');           // 헤드리스 스크린샷 모드 (프리셋 이름)
const LOW = params.get('low') === '1';

// ------------------------------------------------------------------ renderer / scene
const canvas = document.getElementById('c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: !!SHOT, powerPreference: 'high-performance' });
renderer.setPixelRatio(SHOT ? 1 : Math.min(devicePixelRatio, 1.5));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.95;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0xdde6ee, 0.00007);

const camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 2, 30000);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true; controls.dampingFactor = 0.08;
controls.maxPolarAngle = Math.PI * 0.495;
controls.minDistance = 15; controls.maxDistance = 9000;

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

// ------------------------------------------------------------------ sky / lights
function setupSkyAndLights() {
  const sky = new Sky(); sky.scale.setScalar(60000); sky.name = 'sky'; scene.add(sky);
  const sun = new THREE.Vector3();
  const elev = 48, az = 205;    // 오후 남남서 태양
  sun.setFromSphericalCoords(1, THREE.MathUtils.degToRad(90 - elev), THREE.MathUtils.degToRad(az));
  sky.material.uniforms.sunPosition.value.copy(sun);
  sky.material.uniforms.turbidity.value = 4; sky.material.uniforms.rayleigh.value = 1.6;
  sky.material.uniforms.mieCoefficient.value = 0.004; sky.material.uniforms.mieDirectionalG.value = 0.85;
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(sky, 0.02).texture;
  scene.environmentIntensity = 0.5;
  const dir = new THREE.DirectionalLight(0xfff2dd, 2.6);
  dir.position.copy(sun).multiplyScalar(6000);
  dir.castShadow = true;
  dir.shadow.mapSize.set(LOW ? 2048 : 4096, LOW ? 2048 : 4096);
  const sc = dir.shadow.camera; sc.left = -1700; sc.right = 1700; sc.top = 1700; sc.bottom = -1700; sc.near = 2000; sc.far = 10000;
  dir.shadow.bias = -0.0003; dir.shadow.normalBias = 1.2; dir.shadow.radius = 2;
  dir.target.position.set(0, 0, 0); scene.add(dir.target); scene.add(dir);
  scene.add(new THREE.HemisphereLight(0xbfd4ee, 0x6a7a4a, 0.55));
  return dir;
}

// ------------------------------------------------------------------ view presets (world ft)
const PRESETS = {
  campus: { pos: [-700, 2000, 2600], tgt: [0, 0, -150] },
};
// 건물 OSM id 로 프리셋 생성: 중심에서 방위 azDeg(0=남쪽에서 바라봄, 시계방향) 방향으로 dist 만큼 떨어져 높이 elev 에서 바라봄
function lookAtBuilding(site, id, { dist = 420, elev = 180, azDeg = 0, tgtY = 20 } = {}) {
  const b = site.buildings.find(x => x.id === id);
  if (!b) return PRESETS.campus;
  const c = G.centroid(b.poly), a = azDeg * Math.PI / 180;
  return { pos: [c[0] + Math.sin(a) * dist, elev, c[1] + Math.cos(a) * dist], tgt: [c[0], tgtY, c[1]] };
}
function applyPreset(name) {
  const p = PRESETS[name] || PRESETS.campus;
  camera.position.set(...p.pos); controls.target.set(...p.tgt); controls.update();
}

// ------------------------------------------------------------------ GLB export
async function exportGLB() {
  const exp = new GLTFExporter();
  const clone = scene.clone(true);
  const toReplace = [];
  clone.traverse(o => { if (o.isInstancedMesh) toReplace.push(o); });
  for (const im of toReplace) {   // 인스턴스 → 병합 지오메트리
    const geos = []; const mtx = new THREE.Matrix4();
    for (let i = 0; i < im.count; i++) { im.getMatrixAt(i, mtx); const g = im.geometry.clone(); g.applyMatrix4(mtx); geos.push(g); }
    const mesh = new THREE.Mesh(BufferGeometryUtils.mergeGeometries(geos), im.material); mesh.name = im.name;
    im.parent.add(mesh); im.parent.remove(im);
  }
  const drop = []; clone.traverse(o => { if (o.name === 'sky' || o.name === 'skirt' || o.name === 'labels' || o.isSprite || o.isLight) drop.push(o); });
  drop.forEach(o => o.parent && o.parent.remove(o));
  const result = await new Promise((res, rej) => exp.parse(clone, res, rej, { binary: true, onlyVisible: true, maxTextureSize: 2048 }));
  const blob = new Blob([result], { type: 'model/gltf-binary' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'isu_campus.glb'; a.click();
  return blob.size;
}
window.exportGLB = exportGLB;

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
  const groundImg = buildGround(site, M, tex); scene.add(groundImg);
  const schematic = buildSchematic(site, M); schematic.visible = false; scene.add(schematic);
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
  const masses = buildMasses(site, M, detailedIds); scene.add(masses.group);
  const detailHeights = new Map();
  for (const [id, mod] of loaded) {
    say('Building detailed model: ' + mod.meta.name);
    try {
      const grp = mod.build(M, G);
      G.toWorld(grp, mod.meta.anchor, mod.meta.rotation);
      grp.name = 'bldg_' + mod.meta.id; scene.add(grp);
      if (mod.meta.preset) PRESETS[mod.meta.id] = mod.meta.preset;
      if (mod.meta.height) detailHeights.set(id, mod.meta.height);
      for (const extra of mod.meta.extraIds || []) detailHeights.set(extra, mod.meta.height || 40);
    } catch (e) { console.error('module failed', id, e); }
  }
  say('Placing trees…');
  const treeList = LOW ? site.trees.filter((_, i) => i % 2 === 0) : site.trees;
  const trees = buildTrees(treeList, tex); scene.add(trees);
  const labels = buildLabels(site, detailHeights); labels.visible = false; scene.add(labels);
  const sun = setupSkyAndLights();

  // UI
  document.querySelectorAll('[data-view]').forEach(b => b.addEventListener('click', () => applyPreset(b.dataset.view)));
  const tg = (id, fn) => { const el = document.getElementById(id); if (el) { el.addEventListener('change', () => fn(el.checked)); fn(el.checked); } };
  tg('tgTrees', v => { trees.visible = v; });
  tg('tgMass', v => { masses.group.visible = v; });
  tg('tgLabels', v => { labels.visible = v; });
  tg('tgGround', v => { groundImg.visible = v; schematic.visible = !v; });
  tg('tgShadow', v => { sun.castShadow = v; renderer.shadowMap.needsUpdate = true; });
  const exBtn = document.getElementById('btnExport');
  if (exBtn) exBtn.addEventListener('click', async () => { exBtn.textContent = 'Exporting…'; const n = await exportGLB(); exBtn.textContent = 'GLB exported (' + (n / 1e6).toFixed(1) + ' MB)'; });
  const hud = document.getElementById('hud'), hudBtn = document.getElementById('hudToggle');
  if (hud && hudBtn) hudBtn.addEventListener('click', () => { hud.classList.toggle('collapsed'); hudBtn.textContent = hud.classList.contains('collapsed') ? '▸' : '▾'; });

  console.log('site:', site.buildings.length, 'buildings,', masses.byId.size, 'masses,', detailedIds.size, 'detailed,', treeList.length, 'trees, mass tris', masses.tris);
  applyPreset(SHOT || 'campus');
  if (SHOT) { const h = document.getElementById('hud'); if (h) h.classList.add('collapsed'); }   // 렌더용: HUD 접기
  say('');
  const loader = document.getElementById('loader'); if (loader) loader.style.display = 'none';

  let frames = 0;
  function animate() {
    controls.update();
    if (camera.position.y < 6) camera.position.y = 6;
    renderer.render(scene, camera);
    frames++;
    if (frames === 3) window.__ready = true;
    if (!SHOT || frames < 6) requestAnimationFrame(animate);
  }
  if (SHOT) await new Promise(r => setTimeout(r, 3000));   // 텍스처 로딩 대기
  animate();
}
addEventListener('resize', () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); });
main().catch(e => { console.error(e); const s = document.getElementById('status'); if (s) s.textContent = 'Error: ' + e.message; });
