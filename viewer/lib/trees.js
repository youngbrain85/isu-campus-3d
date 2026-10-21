// 수목: 잎 카드 수관(투명 잎 뭉치 카드 + 어두운 심) + 줄기, 인스턴스 렌더. 활엽(둥근형/타원형) 2종 + 침엽(원뿔형) 1종.
// 풀 포기: 교차 빌보드 인스턴스.
import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

/** 시드 고정 난수 */
function rng(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

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

// ------------------------------------------------------------------ 잎 카드 수관
// 실사형 나무의 일반적인 방법: 잎 뭉치 그림(투명 배경)을 붙인 사각 카드를 수관 부피 안에 여러 장 흩뿌리고,
// 카드 법선을 수관 중심에서 바깥으로 향하게 해 덩어리처럼 음영이 지게 한다. 안쪽에는 어두운 심(core)을 넣어 비쳐 보이지 않게 한다.
// 바람: 정점 셰이더에서 높이에 비례해 흔든다 (기본 꺼짐 — 켜면 매 프레임 렌더해야 하므로 HUD 토글).

/** 잎 뭉치 텍스처 (투명 배경 위 잎 수백 장 + 잔가지). kind = 'broad' | 'needle' */
function leafTexture(kind, seed) {
  const N = 256, cv = document.createElement('canvas'); cv.width = cv.height = N;
  const g = cv.getContext('2d'), r = rng(seed);
  g.strokeStyle = 'rgba(70,52,34,0.9)'; g.lineWidth = 2;
  for (let i = 0; i < 6; i++) { g.beginPath(); g.moveTo(N / 2 + (r() - 0.5) * 40, N); g.quadraticCurveTo(r() * N, N * 0.5, r() * N, r() * N * 0.4); g.stroke(); }
  const greens = kind === 'needle' ? [[70, 104, 62], [56, 88, 52], [86, 120, 74]] : [[112, 156, 66], [94, 140, 56], [132, 172, 78], [80, 122, 50], [150, 184, 88]];
  const count = kind === 'needle' ? 900 : 420;
  for (let i = 0; i < count; i++) {
    // 가장자리일수록 성기게 (원형 분포)
    const a = r() * Math.PI * 2, d = Math.sqrt(r()) * N * 0.47, x = N / 2 + Math.cos(a) * d, y = N / 2 + Math.sin(a) * d;
    const c = greens[Math.floor(r() * greens.length)], k = 0.8 + r() * 0.4;
    g.fillStyle = `rgb(${c[0] * k | 0},${c[1] * k | 0},${c[2] * k | 0})`;
    g.save(); g.translate(x, y); g.rotate(r() * Math.PI * 2);
    g.beginPath();
    if (kind === 'needle') g.ellipse(0, 0, 7 + r() * 5, 1.2, 0, 0, Math.PI * 2);
    else g.ellipse(0, 0, 6 + r() * 4, 3 + r() * 2, 0, 0, Math.PI * 2);
    g.fill(); g.restore();
  }
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return t;
}

/** 단위 수관(높이 1, 반지름 ~0.5, 바닥 y=0) 잎 카드 지오메트리 + 심 */
function cardCrown(kind, seed) {
  const r = rng(seed), pos = [], nor = [], uv = [], idx = [];
  const cy = kind === 'oval' ? 0.52 : 0.55, rx = kind === 'oval' ? 0.40 : 0.48, ry = kind === 'oval' ? 0.48 : 0.43;
  const n = kind === 'conifer' ? 90 : 70;
  const q = new THREE.Quaternion(), e = new THREE.Euler(), v = new THREE.Vector3(), nn = new THREE.Vector3();
  for (let i = 0; i < n; i++) {
    let px, py, pz, cyy, size;
    if (kind === 'conifer') {
      // 원뿔: 아래가 넓고 위로 좁아짐
      const t = Math.pow(r(), 0.8), y = 0.12 + t * 0.85, rad = (1 - t) * 0.46 * (0.7 + r() * 0.3), a = r() * Math.PI * 2;
      px = Math.cos(a) * rad; pz = Math.sin(a) * rad; py = y; cyy = y + 0.05; size = 0.12 + (1 - t) * 0.16;
    } else {
      // 타원체 표면 근처(반지름 0.6~1.0)에 몰아서 배치 → 윤곽이 뚜렷
      const u = r() * 2 - 1, a = r() * Math.PI * 2, sq = Math.sqrt(1 - u * u), k = 0.6 + 0.4 * Math.cbrt(r());
      px = Math.cos(a) * sq * rx * k; py = cy + u * ry * k; pz = Math.sin(a) * sq * rx * k; cyy = cy; size = 0.26 + r() * 0.12;
    }
    e.set(r() * Math.PI, r() * Math.PI, r() * Math.PI); q.setFromEuler(e);
    const base = pos.length / 3;
    for (const [a, b] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
      v.set(a * size / 2, b * size / 2, 0).applyQuaternion(q);
      const X = px + v.x, Y = py + v.y, Z = pz + v.z;
      pos.push(X, Y, Z);
      nn.set(X, (Y - cyy) * 1.2, Z).normalize();          // 수관 중심 → 바깥 법선
      nor.push(nn.x, nn.y, nn.z);
      uv.push((a + 1) / 2, (b + 1) / 2);
    }
    idx.push(base, base + 1, base + 2, base, base + 2, base + 3);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  // 심: 수관보다 작은 덩어리 1 개 (어둡게) — 카드 사이로 하늘이 비쳐 보이지 않게
  let core;
  if (kind === 'conifer') { core = new THREE.ConeGeometry(0.34, 0.8, 8, 1); core.translate(0, 0.52, 0); }
  else { core = new THREE.IcosahedronGeometry(1, 1); core.scale(rx * 0.75, ry * 0.75, rx * 0.75); core.translate(0, cy, 0); }
  core.computeVertexNormals();
  return { cards: g, core };
}

/** list: [[x, z, height_ft, variant, source, crown_r_ft], ...] */
export function buildTrees(list, tex, M) {
  const G = new THREE.Group(); G.name = 'trees';
  const wind = { uTime: { value: 0 }, uWind: { value: 0 } };
  G.userData.wind = wind;
  const fol = tex('foliage.jpg');
  const kinds = ['round', 'oval', 'conifer'];
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
  const leafTex = { broad: leafTexture('broad', 11), needle: leafTexture('needle', 23) };
  kinds.forEach((kind, ki) => {
    const arr = groups[kind]; if (!arr.length) return;
    const { cards, core } = cardCrown(kind, 7 + ki * 13);
    const mat = new THREE.MeshStandardMaterial({ map: kind === 'conifer' ? leafTex.needle : leafTex.broad, alphaTest: 0.45, side: THREE.DoubleSide, roughness: 0.85 });
    mat.onBeforeCompile = (sh) => {
      sh.uniforms.uTime = wind.uTime; sh.uniforms.uWind = wind.uWind;
      sh.vertexShader = 'uniform float uTime;\nuniform float uWind;\n' + sh.vertexShader.replace('#include <begin_vertex>', `#include <begin_vertex>
        #ifdef USE_INSTANCING
          vec2 ip = instanceMatrix[3].xz;
        #else
          vec2 ip = vec2(0.0);
        #endif
        float ph = dot(ip, vec2(0.031, 0.017));
        float sw = uWind * position.y;
        transformed.x += sw * (sin(uTime * 1.3 + ph) * 0.025 + sin(uTime * 3.1 + ph * 2.0 + position.z * 9.0) * 0.012);
        transformed.z += sw * (cos(uTime * 1.1 + ph) * 0.02 + sin(uTime * 2.7 + ph + position.x * 9.0) * 0.012);`);
    };
    mat.customProgramCacheKey = () => 'tree-cards';
    const coreMat = new THREE.MeshStandardMaterial({ map: fol, roughness: 0.95, color: kind === 'conifer' ? 0x5a7654 : 0x86a062 });
    const im = new THREE.InstancedMesh(cards, mat, arr.length), ic = new THREE.InstancedMesh(core, coreMat, arr.length);
    arr.forEach((t, i) => {
      const h = t[2] || 30, cr = t[5] || h * 0.4;
      const w = kind === 'conifer' ? Math.min(cr * 2, h * 0.55) : cr * 2.0;
      const ch = kind === 'conifer' ? h : h * 0.82;            // 활엽수는 수관 아래 줄기 노출
      p.set(t[0], kind === 'conifer' ? 0 : h - ch, t[1]); q.setFromAxisAngle(axis, (t[0] * 7.3 + t[1] * 3.1) % 6.283);
      s.set(w, ch, w * (0.9 + 0.2 * ((i * 37) % 10) / 10));
      mtx.compose(p, q, s); im.setMatrixAt(i, mtx); ic.setMatrixAt(i, mtx);
      const hv = ((t[0] * 12.9898 + t[1] * 78.233) % 1 + 1) % 1;
      const col = new THREE.Color().setHSL(0.25 + (hv - 0.5) * 0.06, 0.2 + hv * 0.15, 0.78 + (hv - 0.5) * 0.12);
      im.setColorAt(i, col); ic.setColorAt(i, col.clone().multiplyScalar(0.8));
      trunks.push([t[0], t[1], kind === 'conifer' ? h * 0.25 : (h - ch) + ch * 0.35, Math.max(0.8, cr * 0.07)]);
    });
    im.castShadow = true; im.receiveShadow = true; im.name = 'trees_' + kind; G.add(im);
    ic.castShadow = true; ic.receiveShadow = true; ic.name = 'trees_' + kind + '_core'; G.add(ic);
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
