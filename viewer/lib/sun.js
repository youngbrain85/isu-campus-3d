// 하늘 + 태양광 + 그림자 (캐스케이드 그림자 맵, CSM).
// · 기존: 그림자 맵 1 장(4096²)이 캠퍼스 전체(3,400 ft)를 덮어 1 텍셀 ≈ 0.8 ft → 가까이서 그림자가 뭉개졌다.
//   CSM 은 카메라에서 가까운 구간부터 그림자 맵을 따로 써서 근경은 촘촘하고 원경은 성기게 덮는다.
// · 태양 방위는 나침반 기준(0 = 북, 90 = 동, 180 = 남). 월드는 X = 동, Z = 남, Y = 위.
//   (이전 코드는 setFromSphericalCoords 에 방위를 그대로 넣어 태양이 북북서에 놓였다 — 북반구 중위도에서는 불가능)
// · CSM 은 재질 셰이더를 onBeforeCompile 로 고친다. 잔디 기본면처럼 이미 onBeforeCompile 이 있는 재질은 이어 붙인다.
import * as THREE from 'three';
import { Sky } from 'three/addons/objects/Sky.js';
import { CSM } from 'three/addons/csm/CSM.js';

/** 나침반 방위·고도(도) → 태양 쪽 단위 벡터 (월드) */
export function sunVector(elevDeg, azDeg, out = new THREE.Vector3()) {
  const e = THREE.MathUtils.degToRad(elevDeg), a = THREE.MathUtils.degToRad(azDeg);
  return out.set(Math.cos(e) * Math.sin(a), Math.sin(e), -Math.cos(e) * Math.cos(a));
}

export function makeSun(renderer, scene, camera, { low = false } = {}) {
  const sky = new Sky(); sky.scale.setScalar(60000); sky.name = 'sky'; scene.add(sky);
  const u = sky.material.uniforms;
  u.turbidity.value = 4; u.rayleigh.value = 1.6; u.mieCoefficient.value = 0.004; u.mieDirectionalG.value = 0.85;
  const pmrem = new THREE.PMREMGenerator(renderer);
  const hemi = new THREE.HemisphereLight(0xbfd4ee, 0x6a7a4a, 0.55); scene.add(hemi);

  // 캐스케이드: 4 단, 최대 5,000 ft. lightMargin 은 키 큰 건물(타워 ~150 ft)·카메라 밖 그림자 투사체를 담도록 넉넉히.
  const csm = new CSM({
    camera, parent: scene, cascades: low ? 3 : 4, maxFar: 5000, mode: 'practical',
    shadowMapSize: low ? 1024 : 2048, lightDirection: new THREE.Vector3(0, -1, 0),
    lightIntensity: 2.6, lightNear: 1, lightFar: 12000, lightMargin: 1500, shadowBias: -0.00002,
  });
  csm.fade = true;
  for (const l of csm.lights) { l.color.set(0xfff2dd); l.shadow.normalBias = 0.6; l.shadow.radius = 2; }

  const state = { elev: 48, az: 205, shadows: true };
  const v = new THREE.Vector3();
  let envRT = null;
  const api = {
    csm, sky, hemi, state,
    /** 태양 위치 설정 (고도·나침반 방위, 도). 하늘·환경광·그림자 방향을 함께 갱신 */
    setSun(elevDeg, azDeg) {
      state.elev = elevDeg; state.az = azDeg;
      sunVector(elevDeg, azDeg, v);
      u.sunPosition.value.copy(v);
      csm.lightDirection.copy(v).multiplyScalar(-1);
      if (envRT) envRT.dispose();
      envRT = pmrem.fromScene(sky, 0.02); scene.environment = envRT.texture; scene.environmentIntensity = 0.5;
    },
    setShadows(on) { state.shadows = on; for (const l of csm.lights) l.castShadow = on; },
    /** 장면의 표준 재질 전부에 CSM 셰이더 적용 (기존 onBeforeCompile 은 앞에 이어 붙임) */
    setupMaterials(root) {
      const seen = new Set();
      root.traverse(o => {
        if (!o.material) return;
        for (const m of Array.isArray(o.material) ? o.material : [o.material]) {
          if (seen.has(m) || m.isShaderMaterial || !(m.isMeshStandardMaterial || m.isMeshLambertMaterial || m.isMeshPhongMaterial)) continue;
          seen.add(m);
          const prev = m.onBeforeCompile, prevKey = m.customProgramCacheKey;
          csm.setupMaterial(m);
          const csmFn = m.onBeforeCompile;
          if (prev && prev !== THREE.Material.prototype.onBeforeCompile) {
            m.onBeforeCompile = (sh, r) => { prev.call(m, sh, r); csmFn.call(m, sh, r); };
            m.customProgramCacheKey = () => (prevKey ? prevKey.call(m) : '') + '|csm';
          }
          m.needsUpdate = true;
        }
      });
      return seen.size;
    },
    update() { csm.update(); },
    resize() { csm.updateFrustums(); },
  };
  api.setSun(state.elev, state.az);
  return api;
}
