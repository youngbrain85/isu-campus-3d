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
/** 수평 다각형 (윗면 +y, 구멍 holes), 높이 y. UV = 월드 xz / 4 ft. 천장은 양면 재질로 아래에서도 보이게 한다 */
function cap(poly, y, holes = []) {
  const g = new THREE.ShapeGeometry(toShape(poly, holes));
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
/** 수평 방향 p0→p1 (xz) 을 따라 가는 폭 w 의 각기둥. 윗면 높이 t0→t1, 밑면 b0→b1 (양 끝에서 선형).
 *  계단 디딤판·측판·소핏·경사로·유리 난간판을 모두 이것으로 만든다 (옆면은 수직). */
function prism(p0, p1, w, t0, t1, b0, b1) {
  const dx = p1[0] - p0[0], dz = p1[1] - p0[1], L = Math.hypot(dx, dz); if (L < 1e-3) return null;
  const nx = dz / L * w / 2, nz = -dx / L * w / 2;
  const P = (p, s, y) => [p[0] + s * nx, y, p[1] + s * nz];
  // 0..3: p0 쪽 (-,아래) (+,아래) (+,위) (-,위), 4..7: p1 쪽
  const v = [P(p0, -1, b0), P(p0, 1, b0), P(p0, 1, t0), P(p0, -1, t0), P(p1, -1, b1), P(p1, 1, b1), P(p1, 1, t1), P(p1, -1, t1)];
  const c = [(p0[0] + p1[0]) / 2, (t0 + t1 + b0 + b1) / 4, (p0[1] + p1[1]) / 2];
  const q = [[0, 3, 2, 1], [4, 5, 6, 7], [3, 7, 6, 2], [0, 1, 5, 4], [1, 2, 6, 5], [0, 4, 7, 3]];
  const pos = [];
  for (const f of q) {
    // 면마다 바깥을 향하게 감기 방향을 맞춘다 (법선 · (면 중심 - 각기둥 중심) > 0)
    const A = v[f[0]], B = v[f[1]], C = v[f[2]];
    const e1 = [B[0] - A[0], B[1] - A[1], B[2] - A[2]], e2 = [C[0] - A[0], C[1] - A[1], C[2] - A[2]];
    const nn = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const fc = [0, 1, 2].map(k => f.reduce((s, i) => s + v[i][k], 0) / 4);
    const out = nn[0] * (fc[0] - c[0]) + nn[1] * (fc[1] - c[1]) + nn[2] * (fc[2] - c[2]) >= 0;
    const o = out ? f : [f[0], f[3], f[2], f[1]];
    for (const i of [o[0], o[1], o[2], o[0], o[2], o[3]]) pos.push(...v[i]);
  }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.computeVertexNormals();
  const uv = []; for (let i = 0; i < pos.length; i += 3) uv.push((pos[i] + pos[i + 2]) / 4, pos[i + 1] / 4);
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
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
  // 계단 (A-421/422/424/425): 테라조 디딤판, PT-03 도장 강재 측판, GL-13 유리 난간 + 목재 손잡이(064023.D06), 그레이팅, 목재 좌석(WD-03)
  const stairMat = {
    terrazzo: new THREE.MeshStandardMaterial({ color: 0xd8d3c7, roughness: 0.45, name: 'int_stair_terrazzo' }),
    concrete: new THREE.MeshStandardMaterial({ color: 0xa9a7a1, roughness: 0.85, name: 'int_stair_concrete' }),
    grating: new THREE.MeshStandardMaterial({ color: 0x55595e, roughness: 0.6, metalness: 0.6, name: 'int_stair_grating' }),
    wood: new THREE.MeshStandardMaterial({ color: 0xb08356, roughness: 0.7, name: 'int_stair_wood' }),
  };
  const steelMat = new THREE.MeshStandardMaterial({ color: 0x4a4d52, roughness: 0.5, metalness: 0.55, name: 'int_stair_steel' });
  const railWoodMat = new THREE.MeshStandardMaterial({ color: 0x9a6b40, roughness: 0.55, name: 'int_rail_wood' });
  const elevDoorMat = new THREE.MeshStandardMaterial({ color: 0xc4c8cc, roughness: 0.3, metalness: 0.85, name: 'int_elev_door' });
  const cabMat = new THREE.MeshStandardMaterial({ color: 0x8f8a80, roughness: 0.6, name: 'int_elev_cab' });

  const cut = new THREE.Plane(new THREE.Vector3(0, -1, 0), 1e6);   // 단면 보기 절단면 (월드 y = 상수; 건물 변환은 y 축 회전·평행이동뿐)
  for (const m of [wallMat, glassMat, doorMat, frameMat, steelMat, railWoodMat, elevDoorMat, cabMat, ...Object.values(stairMat)]) m.clippingPlanes = [cut];
  /** 계단 하나 → add(재질, 형상). flights: a(첫 챌판)·b(마지막 챌판) 중심, risers, w, y0→y1. risers 0 = 경사로.
   *  높이는 바닥 마감과 같은 +0.45 (실 바닥 마감 cap 높이) 를 더해 이어지게 한다. */
  function buildStair(st, add) {
    const tm = stairMat[st.finish] || stairMat.terrazzo, grating = st.finish === 'grating';
    const base = st.flights[0].y0;                         // 현장타설(solid) 계단은 출발 바닥까지 채운다
    const nose = grating ? 0.05 : 0.104, th = grating ? 0.12 : 0.17;   // 논슬립 돌출 1 1/4", 디딤판 두께 2"
    const F = 0.45;
    for (const f of st.flights) {
      const dx = f.b[0] - f.a[0], dz = f.b[1] - f.a[1], Ln = Math.hypot(dx, dz), ux = dx / Ln, uz = dz / Ln;
      const at = (s) => [f.a[0] + ux * s, f.a[1] + uz * s];
      if (!f.risers) {                                     // 경사로: 경사 판 (solid → 바닥까지)
        add(tm, prism(f.a, f.b, f.w, f.y0 + F, f.y1 + F, st.solid ? base : f.y0 - 0.1, st.solid ? base : f.y1 - 0.6));
        continue;
      }
      const n = f.risers, t = Ln / (n - 1), r = (f.y1 - f.y0) / n;
      for (let k = 0; k < n; k++) {
        const s0 = k * t, yTop = f.y0 + (k + 1) * r + F;
        if (k < n - 1) {                                   // 디딤판 k: 챌판 k 앞 돌출 ~ 챌판 k+1
          const p0 = at(s0 - nose), p1 = at(s0 + t);
          add(tm, prism(p0, p1, f.w, yTop, yTop, st.solid ? base : yTop - th, st.solid ? base : yTop - th));
        }
        if (!st.solid && !grating) {                       // 챌판 판 (그레이팅 계단은 챌판 없음)
          const yb = f.y0 + k * r + F, yt = (k < n - 1 ? yTop - th : yTop);
          add(tm, prism(at(s0 - 0.03), at(s0 + 0.03), f.w - 0.02, yt, yt, yb, yb));
        }
      }
      if (!st.solid) {
        // 측판 (HSS / 강판, PT-03): 디딤판 앞끝 선 + 0.25 ft, 깊이 1.1 ft, 양쪽
        const ny0 = f.y0 + r + F, ny1 = f.y1 + F, sl = (ny1 - ny0) / Ln;
        const s0 = -t * 0.8, s1 = Ln + 0.2;
        const yt0 = ny0 + sl * s0 + 0.25, yt1 = ny0 + sl * s1 + 0.25;
        for (const sd of [-1, 1]) {
          const o = sd * (f.w / 2 + 0.05), off = (p) => [p[0] + uz * o, p[1] - ux * o];
          add(steelMat, prism(off(at(s0)), off(at(s1)), 0.1, yt0, yt1, yt0 - 1.1, yt1 - 1.1));
        }
        // 소핏 판 (그레이팅 계단 제외): 챌판 아래 모서리를 잇는 경사면 아래
        if (!grating) add(steelMat, prism(at(0), at(Ln), f.w, f.y0 + F, f.y1 - r + F - th, f.y0 + F - 0.3, f.y1 - r + F - th - 0.3));
      }
    }
    for (const L of st.landings) {
      try { add(tm, extrude(L.poly, [], st.solid ? base : L.y + F - (grating ? th : 0.5), L.y + F)); } catch (e) { }
    }
    for (const R of st.rails) {
      for (let i = 0; i + 1 < R.pts.length; i++) {
        const P = R.pts[i], Q = R.pts[i + 1], p = [P[0], P[2]], q = [Q[0], Q[2]];
        const y0 = P[1] + F, y1 = Q[1] + F, h = R.h, Lr = Math.hypot(q[0] - p[0], q[1] - p[1]);
        if (R.kind === 'glass') {                         // GL-13 유리판 + 바닥 슈 + 목재 손잡이 캡
          add(glassMat, prism(p, q, 0.05, y0 + h - 0.12, y1 + h - 0.12, y0 + 0.12, y1 + 0.12));
          add(steelMat, prism(p, q, 0.22, y0 + 0.3, y1 + 0.3, y0 - 0.05, y1 - 0.05));
          add(railWoodMat, prism(p, q, 0.16, y0 + h, y1 + h, y0 + h - 0.14, y1 + h - 0.14));
        } else {
          const bar = R.kind === 'handrail' ? 0.13 : 0.12;
          add(R.kind === 'handrail' && st.kind === 'monumental' ? railWoodMat : steelMat, prism(p, q, bar, y0 + h, y1 + h, y0 + h - bar, y1 + h - bar));
          if (R.kind === 'metal') add(steelMat, prism(p, q, 0.06, y0 + h / 2, y1 + h / 2, y0 + h / 2 - 0.06, y1 + h / 2 - 0.06));
          const np = Math.max(1, Math.ceil(Lr / 4));          // 기둥(브래킷) 4 ft 이하 간격
          for (let j = 0; j <= np; j++) {
            const u = j / np, x = p[0] + (q[0] - p[0]) * u, z = p[1] + (q[1] - p[1]) * u, yy = y0 + (y1 - y0) * u;
            const pw = R.kind === 'handrail' ? 0.05 : 0.12, yb = R.kind === 'handrail' ? yy + h - 0.4 : yy;
            add(steelMat, prism([x - pw / 2, z], [x + pw / 2, z], pw, yy + h - bar, yy + h - bar, yb, yb));
          }
        }
      }
    }
  }
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
        add(w.glass ? glassMat : wallMat, extrude(w.poly, w.holes || [], w.y0 ?? y, top));   // y0: 낮은 바닥 영역(로비 95' 등)에 닿는 벽
        if (w.glass) { add(mullionMat, extrude(w.poly, [], y, y + 0.35)); add(mullionMat, extrude(w.poly, [], top - 0.25, top)); }   // 유리 하부 프레임·상부 헤드
        else { try { add(baseMat, extrude(w.poly, w.holes || [], y + 0.4, y + 0.75)); } catch (e) { } }   // 걸레받이 (고무 4")
      } catch (e) { /* 자기교차 다각형은 건너뜀 */ }
    }
    // 문: 개구부 위 인방(문 높이 ~ 층고), 문짝(열린 상태: 경첩 → 열린 끝), 문틀
    for (const d of fl.doors) {
      const dy = d.y0 ?? y;                    // 낮은 바닥의 문
      const dh = Math.min(d.h || 7, y + H - 0.5 - dy);
      add(wallMat, slab(d.a, d.b, dy + dh, y + H, 0.45));
      add(frameMat, slab(d.a, d.b, dy + dh, dy + dh + 0.25, 0.5));
      const hs = d.hinges || [], sw = d.swing || [];
      for (let i = 0; i < Math.min(hs.length, sw.length); i++) add(doorMat, slab(hs[i], sw[i], dy + 0.05, dy + dh, 0.15));
    }
    // 실: 바닥 마감, 천장, 조명, 이름표
    for (const r of fl.rooms) {
      if (!r.poly || r.poly.length < 3) continue;
      const fm = matFor(r.floor, 0xc8c2b6);
      // parts: 계단 구멍을 뺀 바닥 조각, 각자 높이 (로비 95'·97', 북측 98'). 없으면 실 다각형 그대로
      const parts = r.parts || [{ poly: r.poly, holes: [], y }];
      if (!r.open) for (const p of parts) { try { add(fm, cap(p.poly, p.y + 0.45, p.holes)); } catch (e) { } }   // 지면 레이어(주차장 0.12·보도 0.35·포장 0.37) 위. 아래로 트인 영역은 바닥 없음
      const rc = centroid(r.poly), tall = openAbove(fi, rc[0], rc[1]);
      let chv = r.ch;
      if (chv && chv < 7.5 && (r.area || 0) > 1000) chv = null;           // 큰 실의 낮은 값은 소핏(GWB 덧천장) 표기 → 실 천장 아님
      const Htot = tall ? H + data.floors[fi + 1].height : H;
      const ch = tall ? Htot - 1.5 : Math.min(chv || H - 1.5, H - 0.2);
      r._ch = ch;
      if (!r.open) for (const p of (r.cparts || [{ poly: r.poly, holes: [] }])) { try { addC(matFor(r.ceiling, 0xf0f0ec, { side: THREE.DoubleSide }), cap(p.poly, y + ch, p.holes)); } catch (e) { } }   // cparts: 위층 계단 구멍을 뺀 천장
      if ((r.no || r.name) && (r.area || 0) >= 120) {
        const s = labelSprite(r.name || 'Room', [r.no, r.area ? Math.round(r.area) + ' sf' : ''].filter(Boolean).join(' · '));
        const c = centroid(r.poly); s.position.set(c[0], y + 6, c[1]); s.visible = false; s.name = 'label'; G.add(s);
        rooms.push({ floor: fl.name, y, r, label: s });
      }
    }
    // 바닥 슬래브 (실 사이 틈·벽 아래 포함): 실 다각형 외곽을 덮는 두께 0.5 판은 단면에서만 보이므로 실 바닥 아래에 얇게
    for (const r of fl.rooms) {
      if (r.open) continue;
      for (const p of (r.parts || [{ poly: r.poly, holes: [], y }])) {
        try { add(slabMat, p.base !== undefined ? extrude(p.poly, p.holes, p.base, p.y + 0.4) : cap(p.poly, p.y + 0.4, p.holes)); } catch (e) { }   // base: 낮은 영역과의 단차 옆면을 막는 블록
      }
    }
    // 계단·경사로·계단참·난간 (VR 보행용 실제 디딤판 형상)
    for (const st of fl.stairs || []) buildStair(st, add);
    // 엘리베이터 E1: 승강로 문(스테인리스 2 짝, 닫힘), 문틀, 카
    for (const e of fl.elevators || []) {
      const [a, b] = e.door, m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      add(elevDoorMat, slab(a, m, y + 0.45, y + 7.45, 0.12)); add(elevDoorMat, slab(m, b, y + 0.45, y + 7.45, 0.12));
      add(frameMat, slab(a, b, y + 7.45, y + 7.85, 0.35));
      const dx = b[0] - a[0], dz = b[1] - a[1], Lr = Math.hypot(dx, dz), ux = dx / Lr * 0.2, uz = dz / Lr * 0.2;
      add(frameMat, slab([a[0] - ux, a[1] - uz], a, y + 0.45, y + 7.85, 0.35)); add(frameMat, slab(b, [b[0] + ux, b[1] + uz], y + 0.45, y + 7.85, 0.35));
      const xs = e.cab.map(p => p[0]), zs = e.cab.map(p => p[1]);
      const c0 = [Math.min(...xs), (Math.min(...zs) + Math.max(...zs)) / 2], c1 = [Math.max(...xs), c0[1]];
      add(cabMat, prism(c0, c1, Math.max(...zs) - Math.min(...zs), y + 8.6, y + 8.6, y + 0.45, y + 0.45));
    }
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
