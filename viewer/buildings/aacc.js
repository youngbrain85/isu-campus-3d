// way/545275301 — 사진·위성 기반 모델 (도면 없음)
// 주의: building_facts.csv 는 이 폴리곤을 "Charles E. Brown African American Cultural Center (1993, 2층)" 로 두지만,
//   Street View vp71 (8th St, 남서쪽에서 006/051/096) 은 이 footprint 에 'ISCO Industrial Supply Co.' 간판이 붙은
//   1층 창고(황갈색 골 금속패널 + 갈색 벽돌 허리벽)를 보여준다 (nursing_bldg.js 머리말도 같은 OSM 라벨 혼선을 기록).
//   따라서 사진대로 모델링한다. 메타 이름은 등록 키 유지를 위해 OSM/CSV 명칭을 따르고 사진 명칭을 병기.
// 근거:
//   층수 1, 처마 높이 19 ft (사진 속 사람 키 대비 ≈3.5배), 중앙 모니터(채광 상부) +4.5 ft (vp71_051 뒤편에 보이는 단차).
//   재료: 허리벽 갈색 벽돌 4 ft, 그 위 황갈색 수직 골 금속패널, 처마 흰색 얇은 파시아, 옥상 백색 멤브레인(위성 RGB 254/253/251).
//   본체 x 1226~1365, z 197~300 (위성에서 흰 지붕 범위) + 남측 윙 x 1227~1258, z 300~367 (어두운 지붕, 처마 동일)
//   + 본체 남면 동쪽의 낮은 부속(점 3~6, x 1275~1342, z 300~318, 14 ft) — 사진에 안 보여 금속 창고로 가정.
//   창: 서면(8th St)·남면에 창 없음(사진). 간판(흰 원판)은 윙 서면 남단 근처 13 ft 높이.
//   가정: 동면(마당 쪽) 오버헤드 도어 2개 + 출입문, 모니터 위치·폭(x 1262~1330), 지붕 거의 평탄(저경사 박공을 평지붕으로).
import * as THREE from 'three';

export const meta = {
  id: 'aacc', name: 'ISCO warehouse (OSM/CSV: Charles E. Brown African American Cultural Center)', osm: 'way/545275301',
  anchor: [0, 0], rotation: 0, height: 23.5,
  preset: { pos: [1020, 140, 560], tgt: [1296, 12, 282] },
  sheets: 'Street View vp71 (2019), Esri imagery z20/z19',
};

const rect = (x0, z0, x1, z1) => [[x0, z0], [x0, z1], [x1, z1], [x1, z0]];
const EAVE = 19, WAIN = 4;

export function build(M, G) {
  const parts = [];
  const brick = M.brick_brown;
  const metal = M.metal.clone(); metal.color = new THREE.Color(1.42, 1.30, 1.00); metal.roughness = 0.55; metal.metalness = 0.25;   // 황갈색 패널
  const white = M.white;

  const main = rect(1226, 197, 1365, 300);
  const wing = rect(1227, 300, 1258, 367);
  const shed = rect(1275, 300, 1342, 318);
  const monitor = rect(1262, 205, 1330, 295);

  // 금속 창고 벽 (허리벽 벽돌 + 금속패널) + 파시아 + 평지붕
  const volume = (poly, h, roofMat, doors = []) => {
    const n = poly.length;
    for (let i = 0; i < n; i++) {
      const p0 = poly[i], p1 = poly[(i + 1) % n];
      parts.push({ geom: G.sideGeometry([p0, p1], 0, WAIN, 1 / 24, 1 / 12, false), mat: brick });
      const ops = doors.filter(d => d.edge === i).map(d => ({ s: d.s, e: d.s + d.w, b: WAIN, t: d.h }));
      parts.push({ geom: G.wallSeg(p0, p1, WAIN, h, { openings: ops }), mat: metal });
      // 벽돌 허리벽 상단 띠 (금속 플래싱)
      const dx = p1[0] - p0[0], dz = p1[1] - p0[1], len = Math.hypot(dx, dz), ez = [-dz / len, dx / len];
      parts.push({ geom: G.box(len, 0.3, 0.5, (p0[0] + p1[0]) / 2 + ez[0] * 0.15, WAIN, (p0[1] + p1[1]) / 2 + ez[1] * 0.15, { ry: -Math.atan2(dz, dx) }), mat: white });
      for (const d of doors.filter(d => d.edge === i)) {   // 문: 어두운 패널 (0.4 ft 후퇴), 허리벽 부분도 뚫림
        const q0 = [p0[0] + dx / len * d.s - ez[0] * 0.4, p0[1] + dz / len * d.s - ez[1] * 0.4], q1 = [p0[0] + dx / len * (d.s + d.w) - ez[0] * 0.4, p0[1] + dz / len * (d.s + d.w) - ez[1] * 0.4];
        parts.push({ geom: G.sideGeometry([q0, q1], 0, d.h, 1 / 24, 1 / 12, false), mat: M.dark });
        parts.push({ geom: G.box(d.w, 0.5, 0.8, (q0[0] + q1[0]) / 2 + ez[0] * 0.2, 0, (q0[1] + q1[1]) / 2 + ez[1] * 0.2, { ry: -Math.atan2(dz, dx) }), mat: M.walk, cast: false });
      }
    }
    const e = G.extrudePoly(G.offsetPoly(poly, -0.5), [], 0.8, { y0: h - 0.8 });          // 처마 파시아 (흰색, 0.5 ft 돌출)
    parts.push({ geom: e.sides, mat: white }); parts.push({ geom: e.top, mat: roofMat, cast: false });
  };
  // 본체: 동면(edge 2, 남→북 진행) 오버헤드 도어 2개, 남면 동쪽 구간 출입문
  volume(main, EAVE, M.roof_membrane, [
    { edge: 2, s: 25, w: 12, h: 12 }, { edge: 2, s: 55, w: 12, h: 12 }, { edge: 1, s: 1342 - 1226 + 8, w: 3.5, h: 7.5 },
  ]);
  volume(wing, EAVE, M.roof_dark, []);
  volume(shed, 14, M.roof_dark, [{ edge: 1, s: 20, w: 10, h: 10 }]);
  // 허리벽 아래 콘크리트 기초 띠
  for (const poly of [main, wing, shed]) parts.push({ geom: G.sideGeometry(G.offsetPoly(poly, -0.2), 0, 0.8, 1 / 24, 1 / 12, true), mat: M.concrete });

  // 중앙 모니터 (채광 상부): 금속패널 + 상단 2 ft 반투명(흰색) 띠, 평지붕
  parts.push({ geom: G.sideGeometry(monitor, EAVE - 0.5, EAVE + 2.5, 1 / 24, 1 / 12, true), mat: metal });
  parts.push({ geom: G.sideGeometry(monitor, EAVE + 2.5, EAVE + 4.5, 1 / 24, 1 / 12, true), mat: white });
  const me = G.extrudePoly(G.offsetPoly(monitor, -0.4), [], 0.6, { y0: EAVE + 4.5 - 0.6 });
  parts.push({ geom: me.sides, mat: white }); parts.push({ geom: me.top, mat: M.roof_membrane, cast: false });

  // 옥상 소형 설비 2개 (위성 본체 중앙의 작은 점)
  for (const [x, z] of [[1262, 243], [1312, 243]]) parts.push({ geom: G.cylinder(1.2, 2.5, x, EAVE, z, 10), mat: M.dark });

  // ISCO 간판: 윙 서면(x=1227) 남단 근처, 흰 원판 r=3 (중심 y 13)
  const sign = new THREE.CylinderGeometry(3, 3, 0.3, 24); sign.rotateZ(Math.PI / 2); sign.translate(1227 - 0.2, 13, 357);
  parts.push({ geom: sign, mat: white });

  // 보도·진입로 콘크리트 (윙 서측 및 남측 차로 입구)
  parts.push({ geom: G.capGeometry(rect(1215, 300, 1227, 372), [], 0.15), mat: M.walk, cast: false });

  const grp = new THREE.Group();
  for (const m of G.mergeByMaterial(parts)) grp.add(m);
  return grp;
}
