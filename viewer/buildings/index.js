// 도면 기반 상세 건물 모듈 레지스트리. 키 = OSM id (site.json 의 buildings[].id). 매스 생성 시 이 건물들은 건너뛴다.
export const MODULES = {
  'way/461428310': () => import('./welcome_center.js'),
  'way/545275293': () => import('./nursing_bldg.js'),
};
