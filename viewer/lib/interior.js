// 실내 모델: assets/ted_interior.json (tools/ted/build.py — cTED 2025 시공 도면 A-100/101/102, A-131/132, A-151/152, A-650)
// → 층별 그룹 (바닥 마감·벽·유리벽·문짝·인방·천장·조명·실 이름표).
// 좌표 = 외부 모듈(technology_bldg.js) 로컬 프레임 (ft, x 동, z 남, FIRST 바닥 = 0). 외부 그룹의 자식으로 붙여 같은 변환을 쓴다.
// 단면 보기: setFloor(name) → 외부 껍데기·위층을 숨기고 해당 층 천장을 숨김. setFloor(null) → 원래대로.
import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

const NL = String.fromCharCode(10);
const toShape = (poly, holes = []) => {
  const s = new THREE.Shape(poly.map(p => new THREE.Vector2(p[0], -p[1])));
  for (const h of holes) s.holes.push(new THREE.Path(h.map(p => new THREE.Vector2(p[0], -p[1]))));
  return s;
};
/** 수평 다각형 (윗면 +y), 높이 y. UV = 월드 xz / 4 ft. 천장은 양면 재질로 아래에서도 보이게 한다 */
function cap(poly, y) {
  const g = new THREE.ShapeGeometry(toShape(poly));
  g.rotateX(-Math.PI / 2); g.translate(0, y, 0);
  const uv = g.attributes.uv, pos = g.attributes.position;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, pos.getX(i) / 4, pos.getZ(i) / 4);
  return g;
}
/** 벽 다각형(구멍 포함)을 y0..y1 로 압출 */
function extrude(poly, holes, y0, y1) {
  const g = new THREE.ExtrudeGeometry(toShape(poly, holes), { depth: y1 - y0, bevelEnabled: false });
  g.rotateX(-Math.PI / 2); g.translate(0, y0, 0);
  const uv = g.attributes.uv, pos = g.attributes.position;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, (pos.getX(i) + pos.getZ(i)) / 4, pos.getY(i) / 4);
  return g;
}
/** 두 점 사이 수직 판 (두께 t, y0..y1) */
function slab(a, b, y0, y1, t) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (L < 0.05) return null;
  const g = new THREE.BoxGeometry(L, y1 - y0, t);
  g.rotateY(-Math.atan2(b[1] - a[1], b[0] - a[0]));
  g.translate((a[0] + b[0]) / 2, (y0 + y1) / 2, (a[1] + b[1]) / 2);
  return g;
}
function clean(g) {
  g = g.index ? g.toNonIndexed() : g;
  if (!g.attributes.normal) g.computeVertexNormals();
  for (const k of Object.keys(g.attributes)) if (!['position', 'normal', 'uv'].includes(k)) g.deleteAttribute(k);
  return g;
}
function labelSprite(text, sub) {
  const cv = document.createElement('canvas'); cv.width = 512; cv.height = 128;
  const x = cv.getContext('2d');
  x.fillStyle = 'rgba(20,24,30,0.72)'; x.beginPath(); x.roundRect(4, 4, 504, 120, 18); x.fill();
  x.fillStyle = '#fff'; x.textAlign = 'center'; x.font = '600 40px Segoe UI, Arial'; x.fillText(text.slice(0, 26), 256, 58);
  x.fillStyle = '#b8c4d4'; x.font = '30px Segoe UI, Arial'; x.fillText(sub, 256, 100);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, depthTest: false, transparent: true }));
  s.scale.set(24, 6, 1); s.renderOrder = 20;
  return s;
}
const centroid = (poly) => { let a = 0, cx = 0, cz = 0; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const f = poly[j][0] * poly[i][1] - poly[i][0] * poly[j][1]; a += f; cx += (poly[j][0] + poly[i][0]) * f; cz += (poly[j][1] + poly[i][1]) * f; } return a ? [cx / (3 * a), cz / (3 * a)] : poly[0]; };
const pip = (p, x, z) => { let c = false; for (let i = 0, j = p.length - 1; i < p.length; j = i++) { const a = p[i], b = p[j]; if ((a[1] > z) !== (b[1] > z) && x < (b[0] - a[0]) * (z - a[1]) / (b[1] - a[1]) + a[0]) c = !c; } return c; };

export function buildInterior(data, M, tex) {
  const mats = new Map();
  const matFor = (code, fallback, opts = {}) => {
    const key = (code || '-') + '|' + fallback + '|' + JSON.stringify(opts);
    if (mats.has(key)) return mats.get(key);
    const m = data.materials[code];
    const c = m && m.color ? new THREE.Color().setRGB(m.color[0] / 255, m.color[1] / 255, m.color[2] / 255, THREE.SRGBColorSpace) : new THREE.Color(fallback);   // 마감표 색은 sRGB
    const t = (m && m.type) || '';
    const mm = new THREE.MeshStandardMaterial({ color: c, roughness: /tile|epoxy|sealed|polished/i.test(t) ? 0.45 : 0.85, ...opts });
    if (/carpet/i.test(t)) mm.roughness = 1.0;
    mm.name = 'int_' + (code || fallback);
    mats.set(key, mm); return mm;
  };
  const wallMat = new THREE.MeshStandardMaterial({ color: 0xd6d1c7, roughness: 0.92, name: 'int_wall' });   // 도장 벽 (마감표 PT 계열 웜그레이)
  const glassMat = new THREE.MeshPhysicalMaterial({ color: 0x9fb8bf, roughness: 0.04, metalness: 0.1, transparent: true, opacity: 0.12, depthWrite: false, side: THREE.DoubleSide, envMapIntensity: 1.2, name: 'int_glass' });   // 유리 칸막이: 여러 장 겹쳐도 뿌옇지 않게 투명도 낮춤
  const mullionMat = new THREE.MeshStandardMaterial({ color: 0x2f3236, roughness: 0.4, metalness: 0.6, name: 'int_mullion' });
  const baseMat = new THREE.MeshStandardMaterial({ color: 0x3a3a3c, roughness: 0.8, name: 'int_base', polygonOffset: true, polygonOffsetFactor: -1 });
  const doorMat = new THREE.MeshStandardMaterial({ color: 0x9c7a55, roughness: 0.6, name: 'int_door' });
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x3b3f45, roughness: 0.5, metalness: 0.5, name: 'int_frame' });
  const lightMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xfff6e0, emissiveIntensity: 0.9, name: 'int_light' });
  const slabMat = new THREE.MeshStandardMaterial({ color: 0xb9b6ae, roughness: 0.9, name: 'int_slab' });

  const cut = new THREE.Plane(new THREE.Vector3(0, -1, 0), 1e6);   // 단면 보기 절단면 (월드 y = 상수; 건물 변환은 y 축 회전·평행이동뿐)
  for (const m of [wallMat, glassMat, doorMat, frameMat]) m.clippingPlanes = [cut];
  const root = new THREE.Group(); root.name = 'interior';
  const floors = {}, rooms = [];
  // 2 개 층 높이 공간: 위층에서 '아래로 트인'(open) 영역 아래의 실은 천장이 위층까지 (고베이·아트리움)
  const openAbove = (fi, x, z) => { const up = data.floors[fi + 1]; return !!up && up.rooms.some(r => r.open && r.poly && pip(r.poly, x, z)); };
  for (let fi = 0; fi < data.floors.length; fi++) {
    const fl = data.floors[fi];
    const y = fl.y, H = fl.height;
    const G = new THREE.Group(); G.name = 'floor_' + fl.name;
    const parts = new Map(); const add = (m, g) => { if (!g) return; if (!parts.has(m)) parts.set(m, []); parts.get(m).push(clean(g)); };
    const ceil = new Map(); const addC = (m, g) => { if (!g) return; if (!ceil.has(m)) ceil.set(m, []); ceil.get(m).push(clean(g)); };
    // 벽
    for (const w of fl.walls) {
      try {
        const top = y + Math.min(w.h || H, H);
        add(w.glass ? glassMat : wallMat, extrude(w.poly, w.holes || [], y, top));
        if (w.glass) { add(mullionMat, extrude(w.poly, [], y, y + 0.35)); add(mullionMat, extrude(w.poly, [], top - 0.25, top)); }   // 유리 하부 프레임·상부 헤드
        else { try { add(baseMat, extrude(w.poly, w.holes || [], y + 0.4, y + 0.75)); } catch (e) { } }   // 걸레받이 (고무 4")
      } catch (e) { /* 자기교차 다각형은 건너뜀 */ }
    }
    // 문: 개구부 위 인방(문 높이 ~ 층고), 문짝(열린 상태: 경첩 → 열린 끝), 문틀
    for (const d of fl.doors) {
      const dh = Math.min(d.h || 7, H - 0.5);
      add(wallMat, slab(d.a, d.b, y + dh, y + H, 0.45));
      add(frameMat, slab(d.a, d.b, y + dh, y + dh + 0.25, 0.5));
      const hs = d.hinges || [], sw = d.swing || [];
      for (let i = 0; i < Math.min(hs.length, sw.length); i++) add(doorMat, slab(hs[i], sw[i], y + 0.05, y + dh, 0.15));
    }
    // 실: 바닥 마감, 천장, 조명, 이름표
    for (const r of fl.rooms) {
      if (!r.poly || r.poly.length < 3) continue;
      const fm = matFor(r.floor, 0xc8c2b6);
      if (!r.open) { try { add(fm, cap(r.poly, y + 0.45)); } catch (e) { } }   // 지면 레이어(주차장 0.12·보도 0.35·포장 0.37) 위. 아래로 트인 영역은 바닥 없음
      const rc = centroid(r.poly), tall = openAbove(fi, rc[0], rc[1]);
      let chv = r.ch;
      if (chv && chv < 7.5 && (r.area || 0) > 1000) chv = null;           // 큰 실의 낮은 값은 소핏(GWB 덧천장) 표기 → 실 천장 아님
      const Htot = tall ? H + data.floors[fi + 1].height : H;
      const ch = tall ? Htot - 1.5 : Math.min(chv || H - 1.5, H - 0.2);
      r._ch = ch;
      if (!r.open) { try { addC(matFor(r.ceiling, 0xf0f0ec, { side: THREE.DoubleSide }), cap(r.poly, y + ch)); } catch (e) { } }
      if ((r.no || r.name) && (r.area || 0) >= 120) {
        const s = labelSprite(r.name || 'Room', [r.no, r.area ? Math.round(r.area) + ' sf' : ''].filter(Boolean).join(' · '));
        const c = centroid(r.poly); s.position.set(c[0], y + 6, c[1]); s.visible = false; s.name = 'label'; G.add(s);
        rooms.push({ floor: fl.name, y, r, label: s });
      }
    }
    // 바닥 슬래브 (실 사이 틈·벽 아래 포함): 실 다각형 외곽을 덮는 두께 0.5 판은 단면에서만 보이므로 실 바닥 아래에 얇게
    for (const r of fl.rooms) { if (!r.open) { try { add(slabMat, cap(r.poly, y + 0.4)); } catch (e) { } } }
    for (const L of fl.lights || []) {
      const [x, z, w, d] = L; const room = fl.rooms.find(r => r.poly && pip(r.poly, x, z));
      const ch = room && room._ch ? room._ch : H - 1.5;
      const g = new THREE.BoxGeometry(Math.max(w, 0.3), 0.08, Math.max(d, 0.3)); g.translate(x, y + ch - 0.06, z); addC(lightMat, g);
    }
    for (const [m, gs] of parts) { const mesh = new THREE.Mesh(BufferGeometryUtils.mergeGeometries(gs), m); mesh.castShadow = m !== glassMat; mesh.receiveShadow = true; mesh.name = m.name; G.add(mesh); }
    const C = new THREE.Group(); C.name = 'ceiling';
    for (const [m, gs] of ceil) { const mesh = new THREE.Mesh(BufferGeometryUtils.mergeGeometries(gs), m); mesh.receiveShadow = true; mesh.name = m.name; C.add(mesh); }
    G.add(C);
    floors[fl.name] = { group: G, y, H, ceiling: C };
    root.add(G);
  }
  // 실내는 하늘 환경광(PMREM)을 그대로 받으면 하얗게 날아가므로 줄인다 (실내는 천장 조명·창으로 밝다는 가정)
  root.traverse(o => { if (o.isMesh && o.material && o.material.envMapIntensity !== undefined && o.material !== lightMat) o.material.envMapIntensity = o.material === glassMat ? 1.2 : 0.3; });
  root.userData = { floors, rooms, order: data.floors.map(f => f.name), materials: data.materials };
  /** 층 선택: null = 원래대로(모두 보임, 천장 보임, 이름표 숨김) */
  root.userData.setFloor = (name) => {
    const ord = root.userData.order, k = name ? ord.indexOf(name) : -1;
    const wy = new THREE.Vector3(); root.getWorldPosition(wy);   // 건물 그룹이 지반에 맞춰 올라가 있음 (technology_bldg.js meta.elevation)
    cut.constant = name ? wy.y + floors[name].y + 8.5 : 1e6;   // 선택 층 바닥 + 8.5 ft 에서 벽을 자름 (월드 y)
    ord.forEach((n, i) => {
      const f = floors[n];
      f.group.visible = !name || i <= k;
      f.ceiling.visible = !name || i < k;
      for (const c of f.group.children) if (c.name === 'label') c.visible = !!name && i === k;
    });
  };
  /** 로컬 좌표 (x, z) 와 층 이름 → 실 */
  root.userData.roomAt = (floor, x, z) => rooms.find(o => o.floor === floor && pip(o.r.poly, x, z));
  return root;
}
