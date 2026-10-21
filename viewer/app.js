// Indiana State University main campus – 3D viewer
// 단위 피트. 월드 X=동, Y=위, Z=남. 원점 = 캠퍼스 중심 (39.4710, -87.4100).
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Sky } from 'three/addons/objects/Sky.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import * as G from './lib/geom.js';
import { makeMaterials } from './lib/materials.js';
import { buildGrassBase, buildImagery, buildPaving } from './lib/ground.js';
import { buildStreet } from './lib/street.js';
import { buildMasses } from './lib/mass.js';
import { buildTrees, buildGrassTufts } from './lib/trees.js';
import { buildLabels } from './lib/labels.js';
import { MODULES } from './buildings/index.js';

const ASSET = (window.ASSET_BASE || 'assets/');
const params = new URLSearchParams(location.search);
const SHOT = params.get('shot');           // 헤드리스 스크린샷 모드 (프리셋 이름)
const LOW = params.get('low') === '1';

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

const scene = new THREE.Scene();
window.__scene = scene;   // 진단용
scene.fog = new THREE.FogExp2(0xdde6ee, 0.00007);

const camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 1, 30000);
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
  campus: { pos: [-500, 1700, 2400], tgt: [220, 0, -150] },
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
      row('Notes', esc(d.notes)) + row('OSM', `<a href="https://www.openstreetmap.org/${id}" target="_blank" rel="noopener" style="color:var(--accent)">${id}</a>`) +
      `</dl><div class="src"><b>Modelled from:</b> ${esc(d.sources)}</div>`;
    panel.classList.add('open');
  };
  const esc = (t) => String(t ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  document.getElementById('infoClose').addEventListener('click', () => { panel.classList.remove('open'); hl.clear(); });
  // 드래그(궤도 회전)와 클릭 구분
  let down = null;
  canvas.addEventListener('pointerdown', e => { down = [e.clientX, e.clientY]; });
  canvas.addEventListener('pointerup', e => {
    if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 5 || e.button !== 0) return;
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hits = ray.intersectObjects(roots.filter(o => o.visible), true);
    const h = hits.find(x => x.object.visible && !x.object.isSprite);
    if (!h) { panel.classList.remove('open'); hl.clear(); return; }
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
  const ground = buildGrassBase(site, M, tex); scene.add(ground);
  const imagery = buildImagery(site, tex); imagery.visible = false; scene.add(imagery);
  const paving = buildPaving(site, M, tex); scene.add(paving);
  // 가로 레이어: 영상 검출 주차 차량, 횡단보도·정지선·화살표·황색 연석, 신호·표지·소화전·벤치 등 (tools/street_data.py → street.json)
  let street = null;
  try {
    const sj = await (await fetch(ASSET + 'street.json')).json();
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
  const masses = buildMasses(site, M, detailedIds, null); scene.add(masses.group);   // 지붕: 절차적 재질 (위성 텍스처는 흐릿해서 사용 안 함)
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
  const buildingRoots = scene.children.filter(o => o.name === 'masses' || o.name.startsWith('bldg_'));
  cullTreesUnderBuildings.centers = site.buildings.map(b => G.centroid(b.poly));
  const culled = cullTreesUnderBuildings(site.trees, buildingRoots, site.clip);
  console.log('trees culled by buildings:', site.trees.length - culled.length);
  const treeList = LOW ? culled.filter((_, i) => i % 2 === 0) : culled;
  const trees = buildTrees(treeList, tex, M); scene.add(trees);
  const tuftList = await (await fetch(ASSET + 'tufts.json')).json();
  const tufts = buildGrassTufts(LOW ? tuftList.filter((_, i) => i % 2 === 0) : tuftList, tex); scene.add(tufts);
  const labels = buildLabels(site, detailHeights); labels.visible = false; scene.add(labels);
  const sun = setupSkyAndLights();

  // ---- 건물 클릭 → 오른쪽 정보 패널
  // 여러 건물을 한 모듈로 병합한 경우(교회, 타워, 소형 건물)도 구분되도록, 맞은 지점을 지면에 투영해 OSM 외곽선으로 판정한다
  const info = await (await fetch(ASSET + 'info.json')).json();
  setupPicking(site, info, buildingRoots);

  // UI
  document.querySelectorAll('[data-view]').forEach(b => b.addEventListener('click', () => applyPreset(b.dataset.view)));
  const tg = (id, fn) => { const el = document.getElementById(id); if (el) { el.addEventListener('change', () => fn(el.checked)); fn(el.checked); } };
  tg('tgTrees', v => { trees.visible = v; });
  tg('tgMass', v => { masses.group.visible = v; });
  tg('tgLabels', v => { labels.visible = v; });
  tg('tgGround', v => { imagery.visible = v; });
  tg('tgGrass', v => { tufts.visible = v; });
  tg('tgShadow', v => { sun.castShadow = v; renderer.shadowMap.needsUpdate = true; });
  const exBtn = document.getElementById('btnExport');
  if (exBtn) exBtn.addEventListener('click', async () => { exBtn.textContent = 'Exporting…'; const n = await exportGLB(); exBtn.textContent = 'GLB exported (' + (n / 1e6).toFixed(1) + ' MB)'; });
  const hud = document.getElementById('hud'), hudBtn = document.getElementById('hudToggle');
  if (hud && hudBtn) hudBtn.addEventListener('click', () => { hud.classList.toggle('collapsed'); hudBtn.textContent = hud.classList.contains('collapsed') ? '▸' : '▾'; });

  console.log('site:', site.buildings.length, 'buildings,', masses.byId.size, 'masses,', detailedIds.size, 'detailed,', treeList.length, 'trees, mass tris', masses.tris);
  applyPreset(SHOT || 'campus');
  const camQ = params.get('cam');      // ?cam=px,py,pz,tx,ty,tz (거리 눈높이 렌더 등 임의 시점)
  if (camQ) { const v = camQ.split(',').map(Number); camera.position.set(v[0], v[1], v[2]); controls.target.set(v[3], v[4], v[5]); if (v[6]) { camera.fov = v[6]; camera.updateProjectionMatrix(); } controls.update(); }
  if (street) street.userData.updateCars(camera);
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
