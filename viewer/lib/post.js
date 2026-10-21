// 후처리 체인: N8AO 주변광 차폐(AO) → 출력(톤매핑·sRGB) → SMAA 안티앨리어싱.
// · AO 는 건물 모서리·처마 밑·나무 아래·주차 차량 밑에 접촉 음영을 만든다 (지금 화면이 "장난감처럼" 보이던 가장 큰 원인).
// · three.js 기본 GTAOPass 는 로그 깊이 버퍼를 지원하지 않는다. 이 뷰어는 원거리 지면 z-fighting 방지를 위해 로그 깊이를 쓰므로,
//   로그 깊이를 자동 감지하는 N8AO 를 쓴다 (https://github.com/N8python/n8ao).
// · AO 를 쓰면 하드웨어 MSAA 가 적용되지 않으므로 마지막에 SMAA 를 둔다.
// · 단위는 ft. aoRadius 는 월드 반경(ft).
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { SMAAPass } from 'three/addons/postprocessing/SMAAPass.js';
import { N8AOPass } from 'n8ao';

export function makePost(renderer, scene, camera, { ao = true, low = false } = {}) {
  const w = innerWidth, h = innerHeight, pr = renderer.getPixelRatio();
  // HDR 중간 버퍼 (톤매핑은 OutputPass 에서)
  const rt = new THREE.WebGLRenderTarget(w * pr, h * pr, { type: THREE.HalfFloatType });
  const composer = new EffectComposer(renderer, rt);
  const aoPass = new N8AOPass(scene, camera, w, h);         // RenderPass 를 대신한다 (장면 렌더 + AO)
  const cfg = aoPass.configuration;
  cfg.aoRadius = 20.0;           // ft: 건물 모서리·처마·나무·차량 밑 접촉 음영 크기 (8 ft 는 400 ft 거리 시점에서 거의 안 보였음)
  cfg.distanceFalloff = 1.0;
  cfg.intensity = 4.0;
  cfg.color = new THREE.Color(0x101418);
  cfg.gammaCorrection = false;   // 다음 OutputPass 가 톤매핑·sRGB 변환
  cfg.halfRes = low;             // 저사양: 반해상도 AO
  aoPass.setQualityMode(low ? 'Low' : 'Medium');
  composer.addPass(aoPass);
  composer.addPass(new OutputPass());
  const smaa = new SMAAPass(w * pr, h * pr);
  composer.addPass(smaa);

  const api = {
    composer, aoPass,
    enabled: ao,
    setAO(v) { api.enabled = v; cfg.intensity = v ? 4.0 : 0.0; cfg.aoRadius = v ? 20.0 : 0.01; },
    render() { composer.render(); },
    setSize(W, H) { composer.setSize(W, H); aoPass.setSize(W, H); smaa.setSize(W * pr, H * pr); },
  };
  api.setAO(ao);
  return api;
}
