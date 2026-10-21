// 도면 기반 상세 건물 모듈 레지스트리. 키 = OSM id (site.json 의 buildings[].id). 매스 생성 시 이 건물들은 건너뛴다.
export const MODULES = {
  'way/461428310': () => import('./welcome_center.js'),
  'way/545275293': () => import('./nursing_bldg.js'),
  'way/461428304': () => import('./myers_tech.js'),
  'way/461428305': () => import('./technology_bldg.js'),
  'way/183426119': () => import('./hulman_center.js'),
  'way/545265789': () => import('./fine_arts.js'),
  'way/544686556': () => import('./reeve_hall.js'),
  'way/544686559': () => import('./rec_center.js'),   // extraIds: way/1348752763 (mirrored twin)
  // 사진(스트리트뷰)·위성 기반 모델 — 월드 좌표로 직접 작성 (anchor 0, rotation 0)
  'way/752686738': () => import('./hhs_arena.js'),
  'way/545275306': () => import('./parking_garage.js'),
  'way/545275301': () => import('./aacc.js'),
  'way/236260776': () => import('./sycamore_towers.js'),
  'way/461428313': () => import('./dreiser.js'),
  'way/461428314': () => import('./gillum.js'),
  'way/461428311': () => import('./career_center.js'),
  'way/545265800': () => import('./aec_police.js'),
  'way/545265798': () => import('./res_halls_6th.js'),
  'way/545275297': () => import('./service_bldgs.js'),
  'way/545266789': () => import('./power_plant.js'),
  'way/545275302': () => import('./churches.js'),
};
