// 캠퍼스 주변 소규모·부속 건물 42동 — 위성(Esri z20 겨울 / z19 여름) + Street View 기반
//
// ■ 식별 결과 (위성 판독 결과, 브리프의 "주택 군집" 가정과 달리 대부분이 체육시설·설비·상업 건물이었다)
//   [상업/업무]
//   752686727  Barnes & Noble (ISU 서점): 1층 높은 단층(벽 20 ft + 파라펫), 위성: 백색 평지붕 + 옥상기 10여 개, 북서 모서리 원형 탑
//              (지름 ≈ 24 ft, 청록 동판 돔), 동단 반원형 보우(유리 입구). 장변 N/S 에 상점 유리(피어 3 ft, 피치 ≈ 16 ft). 사진 없음 →
//              적벽돌 + 석회석 띠/코니스 가정.
//   545275307  Cherry Street Garage (Terre Haute Transit) 서측 증축동: 위성에 옥상 주차선 + 남서 모서리 적갈색 피라미드 지붕(계단탑).
//              vp74_315 사진 원경에 동측 본동(way/545275306, parking_garage.js)의 입면이 그대로 서쪽으로 이어지고 끝에 탑이 보임 →
//              본동과 같은 체계: 벽돌 피어(17–18 ft 베이) + 황갈색 프리캐스트 스팬드럴, 데크 14/24.5/35/45.5, 최상층 반원 아치벽,
//              코니스 52.5, 계단탑 55.5 + 피라미드 정점 ≈ 67 ft. 동면은 본동과 맞붙어 생략.
//   724476306  단층 상업동 (140 × 52 ft): 어두운 평지붕, 남측 주차장 → 남·북 상점 유리. 18 ft. 사진 없음.
//   1230759382 북쪽 끝 설비동 (냉동기 플랜트 추정): 백색 평지붕, 남측에 공랭식 냉동기 4대(아래). 그림자 길이 → 22 ft, 북동 띠 17 ft.
//              황갈색 벽돌 + 프리캐스트 띠, 남면 루버·셔터문.
//   1464102452 Ballyhoo Pizza King (vp70_009/054/324 사진): 서측 26 ft 폭 2층 적벽돌(2층 세로 아치창 4개, 청색 브래킷 코니스, 1층 청색
//              판벽 + 흰 기둥), 동측 1층 청색 판벽 + "BALLYHOO" 간판 + 청/백 줄무늬 차양 3개.
//   1464213968 ISCO Industrial Supply 창고 (vp71_096 사진 왼쪽 동): 황갈색 골강판 + 벽돌 하부(≈4 ft), 서면 원형 ISCO 간판, 남면(차로) 셔터문, 18 ft.
//   1464213967 같은 부지 남측 창고 (vp71_096 사진 오른쪽 동): 같은 외피, 북면(차로 쪽) 개방 베이 + 적색 기둥, 16 ft.
//   1464213969 / 1464213971 / 1464213970  9th St 북측 가로변 상업동 3동 (백색/베이지 평지붕). 사진 없음 → 각각 2층 24 ft 적벽돌,
//              1층 22 ft 황갈색 벽돌, 16 ft 연결동. 가로(북·동)면 상점 유리.
//   1464427782 단층 업무동 (나무 사이, 옥상 덕트): 14 ft 갈색 벽돌.
//   925504490  Carpenters Hall: 위성에서 서측 63 ft(금속 평지붕) + 동측 32 ft(평지붕 + 환기구) 2개 매스. 겨울 그림자 길이(≈ 22–25 ft,
//              B&N 그림자로 보정) 로는 3층이 아니라 2층(24 / 22 ft) 으로 판단. 동측(가로) 입구.
//   1463237099 주유소 캐노피 (위성: 늑골 패턴 지붕 + 주변 급유 차선). 하단 15.5, 상단 18.5 ft, 기둥 3개, 급유섬 3개.
//   [주택형]
//   545265780  Eugene V. Debs Museum: 1890 Queen Anne 2층 목조 (벽 21 ft, 회색 슁글 급경사 모임지붕 + 서·북·동 박공), 남·서측 L자 포치
//              (흰 기둥 + 난간). 크림색 판벽 + 흰 트림 가정 (위성: 회색 지붕, 밝은 포치 지붕).
//   1230759384 1.5층 벽돌 차고 (vp18_344 사진: 앞박공 + 반원창 + 흰 차고문 2개, 회색 슁글): 벽 11 ft, 동서 용마루 모임지붕.
//   1464442449 단층 적벽돌 부속동 (vp33_092 사진: 갈색 슁글 모임지붕, 벽 10 ft).
//   [체육시설 — Gibson 트랙 서측 스탠드 열, x≈1620]
//   1464102474 트랙 본부동 (갈색 모임지붕 3개: 동측 블록 2 + 서측 날개 1), 적벽돌 12 ft.
//   1464102470 / 1464102471 지붕 덮인 관람석 (백색 금속 박공지붕, 동쪽 트랙을 향함, 서측 벽돌 뒷벽).
//   1464102468 / 1464102469 / 1464102439 / 1464102440 / 1464102441 알루미늄 관람석 (위성: 줄무늬 좌석판). 트랙을 향함.
//   [소프트볼장, x≈-1000 z≈-1250]
//   1464201646 / 1464201649 알루미늄 관람석, 1464201650 홈플레이트 뒤 피라미드 지붕 정자(45° 회전), 1464201647 클럽하우스(어두운 박공),
//   1464201648 기록실(평지붕 + 실외기), 1464201645 평지붕 부속동, 1464201644 창고(박공), 1464201651 청색 지붕 창고.
//   [설비]
//   1464201654..57 공랭식 냉동기 4대 (위성: 2 × 4 팬, 그림자 → 높이 ≈ 10 ft), 북측 플랜트로 배관.
//   1464098140 / 144 / 145 양조장 마당의 스테인리스 원통 탱크 (140 은 겨울 그림자 위로 상단이 빛남 → 30 ft, 나머지 18 ft), 1464098146 흰 냉장 박스.
//   1464208229 농구장 옆 창고 (동서 박공, 남측 경사면 밝음), 1464201652 테니스장 기록 부스 (vp77_256 사진: 흰 작은 부스).
//
// ■ 공통 가정: 사진이 없는 면은 같은 건물의 보이는 면 규칙을 따름. 창 크기는 유형별 표준치. 높이는 위성 그림자 길이 비교(B&N ≈ 22 ft 기준).
import * as THREE from 'three';

export const meta = {
  id: 'minor', name: 'Minor & peripheral buildings (42 footprints)', osm: 'way/752686727',
  extraIds: [
    'way/724476306', 'way/1230759382', 'way/1464213969', 'way/1464102452', 'way/1464213968', 'way/1464213967',
    'way/1464427782', 'way/925504490', 'way/1464213971', 'way/1463237099', 'way/545265780', 'way/1464102474', 'way/1464201647',
    'way/1464102470', 'way/1464102471', 'way/1230759384', 'way/1464213970', 'way/1464201646', 'way/1464442449', 'way/1464102468',
    'way/1464201649', 'way/1464201650', 'way/1464201656', 'way/1464201657', 'way/1464208229', 'way/1464201655', 'way/1464201654',
    'way/1464201645', 'way/1464201648', 'way/1464098146', 'way/1464201651', 'way/1464201644', 'way/1464102439', 'way/1464102469',
    'way/1464102440', 'way/1464201652', 'way/1464102441', 'way/1464098144', 'way/1464098145', 'way/1464098140',
  ],
  anchor: [0, 0], rotation: 0, height: 67,
  preset: { pos: [-300, 170, 1640], tgt: [-560, 14, 1325] },
  sheets: 'Street View vp70 (Ballyhoo), vp71 (ISCO), vp74 (Transit garage), vp18/vp33/vp77; Esri imagery z20 (winter) / z19 (summer)',
};

const POLY = {
  '752686727': [[-673.3, 1297.4], [-677.8, 1299.2], [-681.8, 1303.6], [-683.5, 1308.5], [-683.9, 1315.9], [-683.6, 1367.3], [-457.3, 1366.0], [-457.4, 1349.2], [-450.7, 1349.1], [-446.2, 1341.0], [-444.5, 1331.9], [-445.1, 1325.3], [-447.3, 1319.0], [-450.9, 1313.4], [-457.6, 1313.4], [-457.7, 1295.7], [-666.4, 1296.8]],
  '545275307': [[1034.4, 1093.6], [904.7, 1094.7], [905.7, 1216.2], [913.7, 1216.1], [913.7, 1222.7], [938.9, 1222.5], [938.8, 1217.3], [1035.5, 1216.5]],
  '724476306': [[-176.6, 1347.7], [-37.6, 1345.9], [-38.2, 1295.4], [-177.2, 1297.2]],
  '1230759382': [[-713.7, -1463.5], [-594.8, -1463.9], [-595.1, -1526.8], [-663.4, -1526.6], [-663.4, -1517.5], [-713.9, -1517.3]],
  '1464213969': [[1529.8, 270.0], [1529.0, 192.9], [1449.7, 193.7], [1449.7, 197.8], [1450.5, 270.9]],
  '1464102452': [[1589.3, 135.7], [1647.1, 134.9], [1646.1, 53.7], [1588.2, 54.5]],
  '1464213968': [[1226.4, 422.6], [1365.9, 421.6], [1365.7, 389.2], [1226.2, 390.1]],
  '1464213967': [[1240.1, 454.2], [1231.6, 454.4], [1231.8, 465.8], [1241.1, 465.6], [1241.2, 470.4], [1255.2, 470.1], [1255.4, 481.0], [1341.3, 479.5], [1340.6, 436.5], [1239.9, 438.4]],
  '1464427782': [[1129.4, -657.8], [1128.6, -700.2], [1030.6, -698.4], [1031.5, -655.9]],
  '925504490': [[-1267.0, 1055.6], [-1267.0, 1098.6], [-1172.4, 1098.7], [-1172.4, 1055.7]],
  '1464213971': [[1384.2, 271.5], [1435.7, 271.0], [1435.3, 233.7], [1434.9, 196.3], [1383.5, 196.8]],
  '1463237099': [[-1230.7, 316.5], [-1202.7, 316.5], [-1202.7, 233.6], [-1230.7, 233.6]],
  '545265780': [[1242.4, -344.4], [1242.3, -327.4], [1238.1, -327.4], [1238.0, -303.3], [1270.0, -303.0], [1270.1, -309.5], [1282.1, -309.4], [1282.2, -321.9], [1300.2, -321.8], [1300.3, -344.4], [1292.3, -344.4], [1292.3, -348.2], [1266.3, -348.3], [1266.2, -344.2]],
  '1464102474': [[1610.9, -814.6], [1605.4, -814.5], [1605.5, -798.3], [1596.3, -798.3], [1584.7, -798.2], [1584.9, -778.6], [1596.5, -778.6], [1605.6, -778.7], [1605.7, -765.2], [1610.3, -765.2], [1632.9, -765.4], [1632.6, -814.7]],
  '1464201647': [[-945.6, -1160.4], [-886.2, -1155.2], [-883.8, -1181.8], [-943.2, -1187.1]],
  '1464102470': [[1610.3, -765.2], [1610.8, -705.7], [1633.3, -705.8], [1632.9, -765.4]],
  '1464102471': [[1632.6, -814.7], [1632.2, -871.4], [1610.5, -871.2], [1610.9, -814.6]],
  '1230759384': [[214.6, 1053.8], [255.0, 1054.0], [255.2, 1030.4], [214.8, 1030.0]],
  '1464213970': [[1450.5, 270.9], [1449.7, 197.8], [1438.7, 197.9], [1439.1, 233.6], [1435.3, 233.7], [1435.7, 271.0]],
  '1464201646': [[-1006.4, -1234.5], [-1001.3, -1273.3], [-1024.3, -1276.3], [-1029.4, -1237.5]],
  '1464442449': [[-289.0, 813.6], [-289.2, 788.4], [-325.0, 788.6], [-324.9, 813.8]],
  '1464102468': [[1616.7, -877.6], [1636.6, -877.4], [1637.1, -921.6], [1617.1, -921.8]],
  '1464201649': [[-950.2, -1188.8], [-949.0, -1198.1], [-947.6, -1208.7], [-984.9, -1213.4], [-987.4, -1193.5]],
  '1464201650': [[-1015.0, -1186.2], [-995.2, -1203.6], [-1012.4, -1222.9], [-1032.2, -1205.5]],
  '1464201656': [[-677.2, -1392.9], [-659.6, -1393.1], [-659.9, -1429.0], [-677.5, -1428.9]],
  '1464201657': [[-704.8, -1391.9], [-688.1, -1392.0], [-688.5, -1429.8], [-705.1, -1429.7]],
  '1464208229': [[-823.9, 494.3], [-824.1, 475.6], [-857.4, 475.9], [-857.2, 494.7]],
  '1464201655': [[-646.0, -1393.7], [-629.5, -1393.8], [-629.9, -1430.2], [-646.4, -1430.0]],
  '1464201654': [[-618.8, -1393.5], [-603.0, -1393.6], [-603.4, -1430.2], [-619.1, -1430.0]],
  '1464201645': [[-996.1, -1277.2], [-991.8, -1312.3], [-1004.0, -1313.8], [-1008.4, -1278.7]],
  '1464201648': [[-913.0, -1193.6], [-911.6, -1204.1], [-947.6, -1208.7], [-949.0, -1198.1]],
  '1464098146': [[1616.6, 1138.8], [1636.6, 1138.8], [1636.6, 1121.7], [1616.6, 1121.7]],
  '1464201651': [[-1029.2, -1112.6], [-1014.2, -1110.8], [-1011.7, -1131.5], [-1026.7, -1133.2]],
  '1464201644': [[-1023.9, -1344.8], [-1010.0, -1344.0], [-1008.8, -1362.8], [-1022.8, -1363.6]],
  '1464102439': [[1618.5, -1086.0], [1629.0, -1082.9], [1635.7, -1105.2], [1625.2, -1108.3]],
  '1464102469': [[1626.0, -659.6], [1635.7, -659.7], [1635.5, -686.2], [1625.8, -686.1]],
  '1464102440': [[1623.2, -1075.0], [1622.3, -1049.9], [1631.5, -1049.5], [1632.5, -1074.7]],
  '1464201652': [[-564.3, -926.4], [-564.5, -940.1], [-578.5, -939.9], [-578.3, -926.2]],
  '1464102441': [[1678.8, -460.5], [1684.0, -466.2], [1665.8, -482.4], [1660.6, -476.6]],
  '1464098144': [[1686.3, 1141.4], [1690.8, 1141.8], [1694.7, 1139.4], [1696.4, 1135.2], [1695.3, 1130.9], [1691.9, 1127.9], [1687.4, 1127.6], [1683.5, 1129.9], [1681.8, 1134.1], [1682.8, 1138.5]],
  '1464098145': [[1671.0, 1141.7], [1675.5, 1142.0], [1679.4, 1139.7], [1681.1, 1135.5], [1680.1, 1131.1], [1676.6, 1128.2], [1672.1, 1127.8], [1668.2, 1130.2], [1666.5, 1134.3], [1667.5, 1138.7]],
  '1464098140': [[1670.1, 1124.7], [1674.6, 1125.1], [1678.5, 1122.7], [1680.2, 1118.6], [1679.2, 1114.2], [1675.8, 1111.2], [1671.2, 1110.9], [1667.3, 1113.2], [1665.6, 1117.4], [1666.6, 1121.8]],
};

// ============================================================ 기본 헬퍼
const DIRS = { N: [0, -1], S: [0, 1], E: [1, 0], W: [-1, 0] };
function frame(a, b) {
  const dx = b[0] - a[0], dz = b[1] - a[1], len = Math.hypot(dx, dz);
  const ex = [dx / len, dz / len], n = [-dz / len, dx / len];      // n = 바깥 법선 (site.json 폴리곤 규약)
  return { a, b, len, ex, n, ry: -Math.atan2(dz, dx), at: (s, o = 0) => [a[0] + ex[0] * s + n[0] * o, a[1] + ex[1] * s + n[1] * o] };
}
const faces = (poly) => poly.map((p, i) => frame(p, poly[(i + 1) % poly.length]));
const facing = (F, d) => d && (Array.isArray(d) ? d : [d]).some(k => F.n[0] * DIRS[k][0] + F.n[1] * DIRS[k][1] > 0.7);
const area = (poly) => { let s = 0; for (let i = 0; i < poly.length; i++) { const a = poly[i], b = poly[(i + 1) % poly.length]; s += a[0] * b[1] - b[0] * a[1]; } return s / 2; };
const ccw = (poly) => (area(poly) > 0 ? [...poly].reverse() : poly);   // site.json 규약 = (x,z) 부호 면적 음수
const rect = (x0, x1, z0, z1) => [[x0, z1], [x1, z1], [x1, z0], [x0, z0]];
const cen = (poly) => { let x = 0, z = 0; for (const p of poly) { x += p[0]; z += p[1]; } return [x / poly.length, z / poly.length]; };
function longAxis(poly) {
  let best = 0, ang = 0;
  for (const F of faces(poly)) if (F.len > best) { best = F.len; ang = Math.atan2(F.ex[1], F.ex[0]) * 180 / Math.PI; }
  return ang;
}
/** 축 axisDeg(u 방향) 기준 방향 상자. W(u,v) → [x,z] */
function obb(poly, axisDeg) {
  const A = axisDeg * Math.PI / 180, c = Math.cos(A), s = Math.sin(A);
  let u0 = 1e9, u1 = -1e9, v0 = 1e9, v1 = -1e9;
  for (const p of poly) { const u = p[0] * c + p[1] * s, v = -p[0] * s + p[1] * c; u0 = Math.min(u0, u); u1 = Math.max(u1, u); v0 = Math.min(v0, v); v1 = Math.max(v1, v); }
  return { u0, u1, v0, v1, A, c, s, L: u1 - u0, D: v1 - v0, cu: (u0 + u1) / 2, cv: (v0 + v1) / 2, W: (u, v) => [u * c - v * s, u * s + v * c], du: [c, s], dv: [-s, c] };
}

/** 삼각형 묶음 → BufferGeometry. 각 삼각형은 ref(중심) 에서 바깥으로 법선이 향하게 정렬 */
class Tris {
  constructor() { this.pos = []; }
  add(A, B, C, ref) {   // ref: [x,y,z] 기준점(법선이 기준점 반대쪽을 향함) 또는 {dir:[x,y,z]}
    const u = [B[0] - A[0], B[1] - A[1], B[2] - A[2]], v = [C[0] - A[0], C[1] - A[1], C[2] - A[2]];
    const n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
    const d = ref.dir || [(A[0] + B[0] + C[0]) / 3 - ref[0], (A[1] + B[1] + C[1]) / 3 - ref[1], (A[2] + B[2] + C[2]) / 3 - ref[2]];
    if (n[0] * d[0] + n[1] * d[1] + n[2] * d[2] < 0) this.pos.push(...A, ...C, ...B); else this.pos.push(...A, ...B, ...C);
  }
  quad(A, B, C, D, ref) { this.add(A, B, C, ref); this.add(A, C, D, ref); }
  both(A, B, C) { this.pos.push(...A, ...B, ...C, ...A, ...C, ...B); }
  geom() {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.pos, 3));
    g.computeVertexNormals();
    const nor = g.attributes.normal, uv = [];
    for (let i = 0; i < this.pos.length / 3; i++) {
      const x = this.pos[i * 3], y = this.pos[i * 3 + 1], z = this.pos[i * 3 + 2];
      if (Math.abs(nor.getY(i)) > 0.6) uv.push(x / 12, z / 12);
      else uv.push((Math.abs(nor.getX(i)) > Math.abs(nor.getZ(i)) ? z : x) / 24, y / 12);
    }
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    return g;
  }
}

export function build(M, G) {
  const parts = [];
  const P = (geom, mat, cast = true) => { if (geom) parts.push({ geom, mat, cast }); };
  // ---------------------------------------------------------- 재질 (모듈 전용 색 재질)
  const tint = (base, hex, name) => { const m = base.clone(); m.color = new THREE.Color(hex); m.name = name; return m; };
  const C = {
    cream: tint(M.precast, 0xf1e6c2, 'siding_cream'),
    blue: tint(M.precast, 0x2f62c4, 'siding_blue'),
    tanMetal: tint(M.precast, 0xd9c79c, 'metal_tan'),
    block: tint(M.precast, 0xd8d2c4, 'block_tan'),
    paintW: tint(M.precast, 0xf4f3ee, 'paint_white'),
    unit: tint(M.precast, 0xc4c8c6, 'unit_grey'),
    shBrown: tint(M.roof_membrane, 0x8a6e58, 'shingle_brown'),
    shGrey: tint(M.roof_membrane, 0x7d848c, 'shingle_grey'),
    mWhite: tint(M.roof_membrane, 0xf0f0ec, 'metalroof_white'),
    mBlue: tint(M.roof_membrane, 0x5c7fc0, 'metalroof_blue'),
    mGrey: tint(M.roof_dark, 0x8a8f94, 'metalroof_grey'),
    redRoof: tint(M.roof_dark, 0xc0604c, 'roof_red'),
    awn: new THREE.MeshStandardMaterial({ color: 0x3c68cc, roughness: 0.8, side: THREE.DoubleSide, name: 'awning_blue' }),
    copper: new THREE.MeshStandardMaterial({ color: 0x86bfae, roughness: 0.55, metalness: 0.3, name: 'copper_green' }),
    steel: new THREE.MeshStandardMaterial({ color: 0xd4d8dc, roughness: 0.3, metalness: 0.75, name: 'stainless' }),
    alum: new THREE.MeshStandardMaterial({ color: 0xc8ccd0, roughness: 0.45, metalness: 0.6, name: 'aluminum' }),
    red: new THREE.MeshStandardMaterial({ color: 0x9c2f26, roughness: 0.7, name: 'paint_red' }),
    interior: new THREE.MeshStandardMaterial({ color: 0x2a2c2f, roughness: 0.95, name: 'interior_dark' }),
    sign: new THREE.MeshStandardMaterial({ color: 0xf6f4ea, roughness: 0.6, name: 'sign_white' }),
  };
  const WALL = { brick_red: M.brick_red, brick_tan: M.brick_tan, brick_brown: M.brick_brown, cream: C.cream, block: C.block, paintW: C.paintW, tanMetal: C.tanMetal, blue: C.blue, precast: M.precast };

  // ---------------------------------------------------------- 저수준 부품
  const wbox = (F, s0, s1, y0, y1, o0, o1, mat, cast = true) => {
    const c = F.at((s0 + s1) / 2, (o0 + o1) / 2);
    P(G.box(s1 - s0, y1 - y0, o1 - o0, c[0], y0, c[1], { ry: F.ry }), mat, cast);
  };
  const wall = (F, y0, y1, ops, mat) => P(G.wallSeg(F.a, F.b, y0, y1, { openings: ops }), mat);
  const pane = (F, s, e, b, t, inset = 0.4, mat = M.pane) => P(G.sideGeometry([F.at(s, -inset), F.at(e, -inset)], b, t, 1 / Math.max(1, e - s), 1 / Math.max(1, t - b), false), mat, false);
  const bandAll = (poly, y0, y1, o0, o1, mat) => { for (const F of faces(poly)) wbox(F, -Math.max(0, o1), F.len + Math.max(0, o1), y0, y1, o0, o1, mat); };
  /** 창 열: F 위 rows 층. 반환 openings. skip = [[s0,s1]] 은 비움 */
  function windowRow(F, ops, { y0 = 0, rows = 1, sh = 10, w = 3, h = 5, sill = 3, sp = 9, margin = 3, trim = M.white, inset = 0.4, skip = [], head = true, maxN = 99 }) {
    let n = Math.min(maxN, Math.floor((F.len - 2 * margin) / sp));
    if (n < 1) { if (F.len >= w + 2 * Math.min(margin, 1.5) + 0.5) n = 1; else return; }
    const pitch = (F.len - 2 * margin) / n;
    for (let k = 0; k < n; k++) {
      const c = n === 1 ? F.len / 2 : margin + (k + 0.5) * pitch;
      if (skip.some(([a, b]) => c + w / 2 > a && c - w / 2 < b)) continue;
      for (let r = 0; r < rows; r++) {
        const b = y0 + r * sh + sill, t = b + h;
        ops.push({ s: c - w / 2, e: c + w / 2, b, t });
        pane(F, c - w / 2, c + w / 2, b, t, inset);
        if (trim) {
          wbox(F, c - w / 2 - 0.25, c + w / 2 + 0.25, b - 0.3, b, -inset, 0.2, trim, false);
          if (head) wbox(F, c - w / 2 - 0.25, c + w / 2 + 0.25, t, t + 0.35, -0.05, 0.12, trim, false);
        }
      }
    }
  }
  function door(F, ops, s, w, h, { y0 = 0, mat = M.dark, inset = 0.3, trim = null } = {}) {
    ops.push({ s: s - w / 2, e: s + w / 2, b: y0 - 0.5, t: y0 + h });
    wbox(F, s - w / 2, s + w / 2, y0, y0 + h, -inset - 0.15, -inset, mat, false);
    if (trim) { wbox(F, s - w / 2 - 0.3, s - w / 2, y0, y0 + h + 0.3, -0.05, 0.15, trim, false); wbox(F, s + w / 2, s + w / 2 + 0.3, y0, y0 + h + 0.3, -0.05, 0.15, trim, false); wbox(F, s - w / 2 - 0.3, s + w / 2 + 0.3, y0 + h, y0 + h + 0.35, -0.05, 0.15, trim, false); }
  }
  /** 상점 유리 베이: 피어 pier, 유리 b..t, 트랜섬 레일 */
  function storefront(F, ops, { b = 1.2, t = 11, pitch = 14, pier = 2, margin = 1.5, transom = null, doorEvery = 0, sill = M.precast }) {
    const n = Math.max(1, Math.round((F.len - 2 * margin) / pitch)), p = (F.len - 2 * margin) / n;
    for (let k = 0; k < n; k++) {
      const s = margin + k * p + pier / 2, e = margin + (k + 1) * p - pier / 2;
      if (e - s < 2) continue;
      const isDoor = doorEvery && (k % doorEvery === Math.floor(doorEvery / 2));
      ops.push({ s, e, b: isDoor ? -0.5 : b, t });
      pane(F, s, e, isDoor ? 0 : b, t, 0.5);
      const fr = [];
      if (transom) wbox(F, s, e, transom - 0.12, transom + 0.12, -0.5, -0.3, M.dark, false);
      if (isDoor) { const m = (s + e) / 2; wbox(F, m - 3, m + 3, 0, 7.2, -0.6, -0.45, M.dark, false); wbox(F, m - 0.08, m + 0.08, 0, 7.2, -0.45, -0.35, M.dark, false); }
      else if (sill) wbox(F, s - 0.1, e + 0.1, b - 0.25, b, -0.5, 0.15, sill, false);
      if (e - s > 9) wbox(F, (s + e) / 2 - 0.12, (s + e) / 2 + 0.12, isDoor ? 7.2 : b, t, -0.5, -0.3, M.dark, false);
    }
  }
  const cyl = (r, h, x, y, z, mat, seg = 16, rt = r) => { const g = new THREE.CylinderGeometry(rt, r, h, seg); g.translate(x, y + h / 2, z); P(g, mat); };
  function pipe(a, b, r, mat) {   // a,b = [x,y,z]
    const d = new THREE.Vector3(b[0] - a[0], b[1] - a[1], b[2] - a[2]), L = d.length();
    const g = new THREE.CylinderGeometry(r, r, L, 8);
    g.applyMatrix4(new THREE.Matrix4().makeRotationFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize())));
    g.translate((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2);
    P(g, mat);
  }

  // ---------------------------------------------------------- 경사지붕 (방향 상자 위 hip / gable / pyramid)
  function pitched(poly, { kind = 'hip', yE, pitch = 0.5, ov = 1.2, axis = null, mat, wallMat = null, soffit = M.white, fascia = M.white }) {
    const B = obb(poly, axis ?? longAxis(poly));
    const half = B.D / 2, vm = B.cv, yR = yE + half * pitch, y2 = yE - ov * pitch;
    const ua = B.u0 - ov, ub = B.u1 + ov, va = B.v0 - ov, vb = B.v1 + ov;
    const Q = (u, v, y) => { const p = B.W(u, v); return [p[0], y, p[1]]; };
    const c0 = B.W(B.cu, vm), low = [c0[0], yE - 60, c0[1]], mid = [c0[0], yE, c0[1]];
    const T = new Tris();
    if (kind === 'gable') {
      T.quad(Q(ua, va, y2), Q(ub, va, y2), Q(ub, vm, yR), Q(ua, vm, yR), low);
      T.quad(Q(ua, vb, y2), Q(ub, vb, y2), Q(ub, vm, yR), Q(ua, vm, yR), low);
      if (wallMat) {
        const W = new Tris();
        for (const u of [B.u0, B.u1]) W.add(Q(u, B.v0, yE), Q(u, B.v1, yE), Q(u, vm, yR), mid);
        P(W.geom(), wallMat);
      }
      // 박공 측 바지보드(트림)
      if (fascia) { const Fz = new Tris(); for (const u of [ua, ub]) for (const [v1, v2] of [[va, vm], [vb, vm]]) { const A = Q(u, v1, y2), Bp = Q(u, v2, yR); Fz.both(A, Bp, [Bp[0], Bp[1] - 0.6, Bp[2]]); Fz.both(A, [Bp[0], Bp[1] - 0.6, Bp[2]], [A[0], A[1] - 0.6, A[2]]); } P(Fz.geom(), fascia, false); }
    } else {
      let r0 = B.u0 + half, r1 = B.u1 - half;
      if (kind === 'pyr' || r0 > r1) r0 = r1 = B.cu;
      T.quad(Q(ua, va, y2), Q(ub, va, y2), Q(r1, vm, yR), Q(r0, vm, yR), low);
      T.quad(Q(ua, vb, y2), Q(ub, vb, y2), Q(r1, vm, yR), Q(r0, vm, yR), low);
      T.add(Q(ua, va, y2), Q(ua, vb, y2), Q(r0, vm, yR), low);
      T.add(Q(ub, va, y2), Q(ub, vb, y2), Q(r1, vm, yR), low);
      if (kind === 'pyr' && B.L > B.D + 0.5) {   // 직사각 피라미드 → 끝 경사가 다름 (hip 공식이 이미 처리)
      }
    }
    P(T.geom(), mat);
    if (ov > 0.2 && soffit) { const S = new Tris(); S.quad(Q(ua, va, y2 - 0.05), Q(ub, va, y2 - 0.05), Q(ub, vb, y2 - 0.05), Q(ua, vb, y2 - 0.05), { dir: [0, -1, 0] }); P(S.geom(), soffit, false); }
    if (ov > 0.2 && fascia) {   // 처마 파시아
      const Fz = new Tris();
      for (const v of [va, vb]) { const A = Q(ua, v, y2), Bq = Q(ub, v, y2); Fz.both(A, Bq, [Bq[0], y2 - 0.6, Bq[2]]); Fz.both(A, [Bq[0], y2 - 0.6, Bq[2]], [A[0], y2 - 0.6, A[2]]); }
      if (kind !== 'gable') for (const u of [ua, ub]) { const A = Q(u, va, y2), Bq = Q(u, vb, y2); Fz.both(A, Bq, [Bq[0], y2 - 0.6, Bq[2]]); Fz.both(A, [Bq[0], y2 - 0.6, Bq[2]], [A[0], y2 - 0.6, A[2]]); }
      P(Fz.geom(), fascia, false);
    }
    return { yR, B };
  }

  // ---------------------------------------------------------- 평지붕 + 파라펫 + 코핑
  function flatTop(poly, y, { par = 2, mat, roof = M.roof_membrane, coping = M.precast, units = 0, seed = 1 }) {
    const r = G.flatRoof(poly, y, { parapet: par, thick: 0.6 });
    P(r.slab, roof);
    if (r.parapet) P(r.parapet, mat);
    if (coping) for (const F of faces(poly)) wbox(F, -0.15, F.len + 0.15, y + par, y + par + 0.35, -1.15, 0.15, coping);
    if (units) {   // 옥상 설비 (결정적 의사난수 배치)
      const B = obb(poly, longAxis(poly));
      let q = seed * 9301 + 49297;
      const rnd = () => { q = (q * 9301 + 49297) % 233280; return q / 233280; };
      for (let i = 0; i < units; i++) {
        const u = B.u0 + 8 + rnd() * Math.max(1, B.L - 16), v = B.v0 + 6 + rnd() * Math.max(1, B.D - 12), p = B.W(u, v);
        const w = 4 + rnd() * 4, d = 3 + rnd() * 3, h = 2.5 + rnd() * 2;
        P(G.box(w, h, d, p[0], y, p[1], { ry: -B.A }), C.unit);
      }
    }
  }

  // ---------------------------------------------------------- 일반 건물 유형
  /** 평지붕 상업/업무동. s: {h, par, wall, roof, store:[dir], storeT, win:{...}, doors:[dir], band:[y0,y1,mat], units} */
  function commercial(poly, s) {
    const wm = WALL[s.wall] || s.wall, H = s.h;
    for (const F of faces(poly)) {
      const ops = [];
      if (F.len < 3) { wall(F, 0, H, ops, wm); continue; }
      if (facing(F, s.store) && F.len > 10) {
        storefront(F, ops, { b: 1.4, t: s.storeT || 10.5, pitch: s.pitch || 14, transom: (s.storeT || 10.5) - 2.2, doorEvery: F.len > 40 ? 4 : 2 });
        if (s.win && (s.win.rows || 1) > 0 && s.upper) windowRow(F, ops, { ...s.win, y0: s.upper, rows: s.upperRows || 1 });
      } else if (s.win) {
        const dz = facing(F, s.doors) && F.len > 12 ? [[F.len / 2 - 3, F.len / 2 + 3]] : [];
        windowRow(F, ops, { ...s.win, skip: dz });
        if (dz.length) door(F, ops, F.len / 2, 6, 7.5, { trim: M.precast });
      } else if (facing(F, s.doors) && F.len > 10) door(F, ops, F.len / 2, 3.4, 7.2);
      wall(F, 0, H, ops, wm);
    }
    if (s.band) for (const [y0, y1, m] of s.band) bandAll(poly, y0, y1, -0.05, 0.25, m);
    if (s.base !== false) bandAll(poly, 0, 1.2, -0.05, 0.2, s.baseMat || M.precast);
    flatTop(poly, H, { par: s.par ?? 2, mat: wm, roof: s.roof || M.roof_membrane, coping: s.coping ?? M.precast, units: s.units || 0, seed: s.seed || 1 });
  }

  /** 주택/부속동: 벽 + 창 + 문 + 경사지붕. s: {eave, storeys, sh, wall, roofKind, pitch, axis, roofMat, front, win, garage, found} */
  function house(poly, s) {
    const wm = WALL[s.wall] || s.wall, E = s.eave, rows = s.storeys || 1, sh = s.sh || E / rows;
    for (const F of faces(poly)) {
      const ops = [];
      if (F.len >= 6 && s.win !== null) {
        const skip = [];
        if (facing(F, s.front)) {
          if (s.garage) {
            const n = s.garage, gw = 8.5, tot = n * gw + (n - 1) * 2, s0 = (F.len - tot) / 2;
            for (let k = 0; k < n; k++) { const c = s0 + k * (gw + 2) + gw / 2; door(F, ops, c, gw, 7.8, { mat: M.white, inset: 0.4, trim: M.white }); skip.push([c - gw / 2 - 1, c + gw / 2 + 1]); }
          } else if (s.door !== false) { const c = s.doorAt ? F.len * s.doorAt : F.len / 2; door(F, ops, c, 3.2, 7, { trim: M.white, y0: s.floorY || 0 }); skip.push([c - 3, c + 3]); }
        } else if (facing(F, s.side) && F.len > 8) { const c = F.len * 0.3; door(F, ops, c, 3, 7, { trim: M.white }); skip.push([c - 2.5, c + 2.5]); }
        if (s.win !== false) windowRow(F, ops, { rows, sh, w: 2.8, h: 4.8, sill: 2.8 + (s.floorY || 0), sp: 7.5, margin: 2.5, trim: M.white, ...(s.win || {}), skip: s.garage && facing(F, s.front) ? [[-1e9, 1e9]] : skip });
      }
      wall(F, 0, E, ops, wm);
    }
    if (s.found !== false) bandAll(poly, 0, s.floorY || 1.0, -0.02, 0.18, M.concrete);
    return pitched(poly, { kind: s.roofKind || 'gable', yE: E, pitch: s.pitch ?? 0.5, ov: s.ov ?? 1.2, axis: s.axis ?? null, mat: s.roofMat || M.roof_dark, wallMat: wm, fascia: s.fascia ?? M.white, soffit: s.soffit ?? M.white });
  }

  /** 금속 창고: 벽돌 하부 + 황갈색 골강판, 개방 베이(open) / 셔터문(roll) */
  function industrial(poly, s) {
    const H = s.h;
    for (const F of faces(poly)) {
      const ops = [];
      if (facing(F, s.open) && F.len > 30) {
        const n = Math.round((F.len - 4) / 22), p = (F.len - 4) / n;
        for (let k = 0; k < n; k++) {
          const a = 2 + k * p + 0.6, b = 2 + (k + 1) * p - 0.6; ops.push({ s: a, e: b, b: -0.5, t: H - 3 });
          wbox(F, b, b + 1.2, 0, H - 3, -1.2, 0, C.red);                     // 적색 강재 기둥
        }
        P(G.sideGeometry([F.at(0.5, -14), F.at(F.len - 0.5, -14)], 0, H - 1, 1 / 24, 1 / 12, false), C.interior, false);   // 내부 배경
        wbox(F, 0, F.len, H - 3.6, H - 3, -1.2, 0.05, C.red, false);         // 개구 상부 보
      } else if (facing(F, s.roll) && F.len > 30) {
        for (const f of [0.3, 0.7]) { const c = F.len * f; door(F, ops, c, 12, 12, { mat: C.unit, inset: 0.4 }); wbox(F, c - 6.4, c + 6.4, 12, 13.2, -0.1, 0.5, C.unit); }
        door(F, ops, F.len * 0.5, 3.2, 7.2, { mat: M.dark });
      } else if (facing(F, s.doors) && F.len > 10) door(F, ops, F.len / 2, 3.2, 7.2, { mat: M.dark });
      wall(F, 0, s.wainscot ?? 4, ops, M.brick_red);
      wall(F, s.wainscot ?? 4, H, ops, C.tanMetal);
      wbox(F, -0.1, F.len + 0.1, (s.wainscot ?? 4) - 0.2, (s.wainscot ?? 4), -0.05, 0.3, C.tanMetal, false);    // 하부 물끊기
    }
    flatTop(poly, H, { par: 0.8, mat: C.tanMetal, roof: s.roof || M.roof_dark, coping: M.white, units: s.units || 0, seed: s.seed || 3 });
  }

  /** 알루미늄 관람석. face = 관중이 바라보는 나침 방위(도). covered = {eave, roofMat} */
  function bleacher(poly, { face, rise = 1.0, tread = 2.2, front = 1.2, rail = true, covered = null }) {
    const B = obb(poly, longAxis(poly));
    const th = face * Math.PI / 180, f = [Math.sin(th), -Math.cos(th)];
    const sg = (B.dv[0] * f[0] + B.dv[1] * f[1]) > 0 ? 1 : -1;
    const vF = sg > 0 ? B.v1 : B.v0;                  // 앞(경기장 쪽) 가장자리 v
    const back = covered ? 3 : 0.6;                   // 뒤쪽 여유 (덮인 스탠드는 통로)
    const nR = Math.max(2, Math.floor((B.D - back) / tread)), L = B.L - 0.8;
    const ry = -B.A;
    const at = (u, vr) => B.W(u, vF - sg * vr);       // vr = 앞에서 뒤로의 거리
    for (let k = 0; k < nR; k++) {
      const y = front + k * rise, vr = k * tread;
      let p = at(B.cu, vr + 0.6); P(G.box(L, 0.16, 1.1, p[0], y - 0.16, p[1], { ry }), C.alum);                       // 발판
      p = at(B.cu, vr + 1.65); P(G.box(L, 0.14, 0.95, p[0], y + 1.25, p[1], { ry }), C.alum);                          // 좌석
      p = at(B.cu, vr + 1.15); P(G.box(L, rise, 0.08, p[0], y - 0.16 + 0.0, p[1], { ry }), M.dark, false);            // 챌판(어두운 틈)
    }
    // 측판(계단형 프로파일) — 양끝 + 12 ft 마다
    const yTop = front + (nR - 1) * rise + 1.4, vEnd = nR * tread;
    const prof = [[0, 0], [0, front]];
    for (let k = 0; k < nR; k++) { const y = front + k * rise; prof.push([k * tread + tread, y]); if (k < nR - 1) prof.push([k * tread + tread, y + rise]); }
    prof.push([vEnd, 0]);
    const tri = THREE.ShapeUtils.triangulateShape(prof.map(([a, b]) => new THREE.Vector2(a, b)), []);
    const nS = Math.max(2, Math.round(L / 12) + 1), T = new Tris();
    for (let i = 0; i < nS; i++) {
      const u = B.u0 + 0.5 + (B.L - 1) * i / (nS - 1);
      const V = prof.map(([vr, y]) => { const p = at(u, vr); return [p[0], y - 0.2, p[1]]; });
      for (const [a, b, c] of tri) T.both(V[a], V[b], V[c]);
    }
    P(T.geom(), covered ? M.brick_red : M.dark);
    if (rail && !covered) {   // 뒤 난간
      const p = at(B.cu, vEnd - 0.2); P(G.box(L, 0.18, 0.18, p[0], yTop + 2.2, p[1], { ry }), C.alum);
      for (let i = 0; i < nS; i++) { const q = at(B.u0 + 0.5 + (B.L - 1) * i / (nS - 1), vEnd - 0.2); P(G.box(0.15, yTop + 2.4, 0.15, q[0], 0, q[1]), C.alum); }
    }
    if (covered) {
      const E = covered.eave;
      // 뒷벽 + 측벽 (벽돌), 앞쪽 기둥
      for (const F of faces(poly)) {
        const d = F.n[0] * f[0] + F.n[1] * f[1];
        if (d < -0.7) { const ops = []; windowRow(F, ops, { w: 3, h: 2, sill: E - 4, sp: 12, trim: null }); wall(F, 0, E, ops, M.brick_red); }   // 뒷벽 + 환기창
        else if (Math.abs(d) < 0.3) wall(F, 0, E, [{ s: 2.5, e: F.len - 2.5, b: yTop + 1.5, t: E - 1 }], M.brick_red);                         // 측벽 (상부 개방)
        else { const n = Math.max(2, Math.round(F.len / 15)); for (let i = 0; i <= n; i++) { const s = 0.6 + (F.len - 1.2) * i / n; wbox(F, s - 0.35, s + 0.35, 0, E, -0.9, -0.2, M.white); } wbox(F, 0, F.len, E - 1.2, E, -0.9, 0.1, M.white); }
      }
      pitched(poly, { kind: 'gable', yE: E, pitch: 0.22, ov: 1.5, mat: covered.roofMat || C.mWhite, wallMat: M.white });
    }
  }

  // =========================================================== 개별 건물
  const R = (id) => POLY[id];

  // ---- Barnes & Noble (ISU 서점)
  {
    const poly = R('752686727'), H = 20, wm = M.brick_red, lime = M.limestone;
    for (const F of faces(poly)) {
      const ops = [];
      if (F.len > 40) {          // 장변: 상점 유리 베이 + 석회석 인방
        const n = Math.round((F.len - 6) / 16), p = (F.len - 6) / n;
        for (let k = 0; k < n; k++) {
          const s = 3 + k * p + 1.6, e = 3 + (k + 1) * p - 1.6, isDoor = facing(F, 'S') ? k % 5 === 2 : k % 7 === 3;
          ops.push({ s, e, b: isDoor ? -0.5 : 2.2, t: 12.5 }); pane(F, s, e, isDoor ? 0 : 2.2, 12.5, 0.6);
          wbox(F, s, e, 9.6, 9.85, -0.6, -0.4, M.dark, false);
          wbox(F, (s + e) / 2 - 0.1, (s + e) / 2 + 0.1, isDoor ? 7.5 : 2.2, 12.5, -0.6, -0.4, M.dark, false);
          if (isDoor) { wbox(F, (s + e) / 2 - 3, (s + e) / 2 + 3, 0, 7.5, -0.75, -0.6, M.dark, false); wbox(F, s - 1, e + 1, 10, 10.6, 0, 4.5, M.dark); }   // 입구 캐노피
          else wbox(F, s - 0.2, e + 0.2, 1.9, 2.2, -0.6, 0.25, lime, false);
          wbox(F, s - 0.6, e + 0.6, 12.5, 13.6, -0.05, 0.3, lime, false);   // 석회석 인방
        }
      } else if (F.len > 15) {   // 단변 (서·동 끝벽): 창 2–3개
        windowRow(F, ops, { w: 5, h: 9, sill: 3, sp: 14, margin: 3, trim: lime, inset: 0.6 });
      } else {                   // 곡면 분절 (북서 모서리, 동측 보우): 전면 유리
        ops.push({ s: 0.25, e: F.len - 0.25, b: 0.8, t: 15.5 }); pane(F, 0.25, F.len - 0.25, 0.8, 15.5, 0.5);
        wbox(F, 0, F.len, 15.5, 16.0, -0.5, 0.1, lime, false);
      }
      wall(F, 0, H, ops, wm);
    }
    bandAll(poly, 0, 0.8, -0.05, 0.3, lime);              // 석회석 기단
    bandAll(poly, 16.8, 17.4, -0.05, 0.25, lime);          // 띠
    bandAll(poly, H - 0.4, H + 0.9, -0.05, 0.9, lime);     // 코니스
    flatTop(poly, H, { par: 2.6, mat: wm, roof: M.roof_membrane, coping: lime });
    for (const [x, z, w, d] of [[-640, 1320, 10, 6], [-612, 1340, 8, 5], [-585, 1318, 9, 6], [-560, 1342, 8, 5], [-532, 1322, 10, 6], [-505, 1340, 8, 5], [-480, 1320, 7, 5], [-625, 1352, 6, 4], [-545, 1305, 6, 4]]) P(G.box(w, 4, d, x, H, z), C.unit);
    // 북서 원형 탑: 드럼(창) + 청록 동판 돔 + 랜턴
    const cx = -667.5, cz = 1314.0, r = 12;
    cyl(r, 30 - H, cx, H, cz, wm, 28);
    const Tw = new Tris();
    for (let i = 0; i < 8; i++) {
      const a0 = (i + 0.3) / 8 * Math.PI * 2, a1 = (i + 0.7) / 8 * Math.PI * 2, rr = r + 0.03;
      const A = [cx + rr * Math.cos(a0), H + 2.5, cz + rr * Math.sin(a0)], Bq = [cx + rr * Math.cos(a1), H + 2.5, cz + rr * Math.sin(a1)];
      Tw.quad(A, Bq, [Bq[0], H + 8.5, Bq[2]], [A[0], H + 8.5, A[2]], [cx, H + 5, cz]);
    }
    P(Tw.geom(), M.pane, false);
    cyl(r + 0.9, 1.3, cx, 29.4, cz, lime, 28);
    const dome = new THREE.SphereGeometry(r + 0.4, 24, 8, 0, Math.PI * 2, 0, Math.PI / 2); dome.scale(1, 0.75, 1); dome.translate(cx, 30.7, cz); P(dome, C.copper);
    cyl(1.6, 3.5, cx, 30.7 + (r + 0.4) * 0.75 - 0.5, cz, C.copper, 10);
    cyl(0.25, 3, cx, 30.7 + (r + 0.4) * 0.75 + 3, cz, M.dark, 6);
  }

  // ---- Cherry Street Garage 서측 증축동 (545275307) — 동측 본동(way/545275306, parking_garage.js)과 같은 입면 체계
  //   (vp74_315 원경: 같은 벽돌 피어 + 황갈색 스팬드럴 + 최상층 반원 아치벽이 서쪽으로 이어지고 끝에 계단탑).
  //   데크 14 / 24.5 / 35 / 45.5, 아치벽 38.5–50.5 (스프링 44.5, 반경 ≤ 6), 코니스 50.5–52.5. 동면(x≈1034)은 본동과 맞붙어 생략.
  //   남서 계단탑: 위성의 적갈색 피라미드 지붕 → 벽 55.5, 코니스 54–55.5, 정점 ≈ 67 (본동 탑과 동일).
  if (false) {   // 서측 증축동은 parking_garage.js 에서 본동과 하나의 입면 체계로 모델링 (중복 방지)
    const X0 = 904.9, X1 = 1034.0, Z0 = 1094.2, Z1 = 1216.3;
    const MR = rect(X0, X1, Z0, Z1), TW = rect(913.7, 938.9, 1196.0, 1222.6);
    const DECK = [14, 24.5, 35, 45.5], SLAB = 1.5, SPAN = 3.5, PIER = 2.5, ARCH0 = 38.5, SPRING = 44.5, CORN = 50.5, TOP = 52.5;
    const brick = M.brick_red, stone = M.limestone, tan = tint(M.precast, 0xffe8c8, 'precast_tan2'), terracotta = tint(M.roof_membrane, 0x874436, 'terracotta');
    tan.color = new THREE.Color(1.07, 0.98, 0.82);
    /** 벽면 평면 (Shape: x = 진행거리, y = 높이) → F 위치에 세움. inset 만큼 안쪽 */
    const planeOn = (F, shape, inset = 0, mat = brick, cast = true) => {
      const g = new THREE.ShapeGeometry(shape, 8), uv = g.attributes.uv, pos = g.attributes.position;
      for (let i = 0; i < uv.count; i++) uv.setXY(i, pos.getX(i) / 24, pos.getY(i) / 12);
      const ex = new THREE.Vector3(F.ex[0], 0, F.ex[1]), up = new THREE.Vector3(0, 1, 0), ez = new THREE.Vector3().crossVectors(ex, up);
      const o = F.at(0, -inset);
      g.applyMatrix4(new THREE.Matrix4().makeBasis(ex, up, ez).setPosition(o[0], 0, o[1]));
      P(g, mat, cast);
    };
    const archPath = (s, e, b, spring) => { const r = (e - s) / 2, h = new THREE.Path(); h.moveTo(s, b); h.lineTo(e, b); h.lineTo(e, spring); h.absarc(s + r, spring, r, 0, Math.PI, false); h.lineTo(s, b); return h; };
    const tw0 = 913.7 - X0, tw1 = 938.9 - X0;      // 남면에서 계단탑이 차지하는 구간 (s)
    for (const [F, nb] of [[frame(MR[0], MR[1]), 7], [frame(MR[2], MR[3]), 7], [frame(MR[3], MR[0]), 7]]) {   // 남, 북, 서
      const pitch = F.len / nb, south = facing(F, 'S');
      for (let i = 0; i <= nb; i++) {
        const s = Math.min(Math.max(i * pitch, PIER / 2), F.len - PIER / 2);
        if (south && s > tw0 - 1 && s < tw1 + 1) continue;
        wbox(F, s - PIER / 2, s + PIER / 2, 4.5, CORN, -PIER, 0, brick); wbox(F, s - PIER / 2 - 0.3, s + PIER / 2 + 0.3, 0, 4.5, -PIER - 0.3, 0.3, stone);
      }
      const s0 = south ? tw1 : 0;   // 남면은 계단탑 동쪽부터
      const Fw = frame(F.at(s0), F.b);
      if (!south) { P(G.sideGeometry([Fw.a, Fw.b], 0, 3.7, 1 / 24, 1 / 12, false), brick); wbox(Fw, 0, Fw.len, 3.7, 4.1, -1.2, 0.2, stone); }
      P(G.sideGeometry([Fw.a, Fw.b], 9.5, DECK[0] - SLAB, 1 / 24, 1 / 12, false), brick);
      wbox(Fw, 0, Fw.len, 9.0, 9.5, -1.0, 0.2, tan);
      for (let k = 0; k < 3; k++) P(G.sideGeometry([Fw.a, Fw.b], DECK[k], DECK[k] + SPAN, 1 / 24, 1 / 12, false), tan);
      const shape = new THREE.Shape([new THREE.Vector2(0, ARCH0), new THREE.Vector2(Fw.len, ARCH0), new THREE.Vector2(Fw.len, CORN), new THREE.Vector2(0, CORN)]);
      for (let i = 0; i < nb; i++) {
        const c = (i + 0.5) * pitch - s0, r = Math.min(6, (pitch - PIER - 2) / 2);
        if (c - r < 0.5) continue;
        shape.holes.push(archPath(c - r, c + r, ARCH0, SPRING + (6 - r)));
      }
      planeOn(Fw, shape);
      wbox(Fw, -0.5, Fw.len + 0.5, CORN, TOP, -1.3, 0.5, tan);
      if (south) wbox(Fw, 8, 60, 10.0, 12.6, 0.05, 0.4, C.sign, false);   // "TERRE HAUTE TRANSIT / BUS ENTRY" 간판 띠
    }
    // 데크 슬래브 + 옥상 데크(1 ft 후퇴) + 옥상 스팬드럴 + 층별 내부 어두운 면
    for (let k = 0; k < 3; k++) { const e = G.extrudePoly(MR, [], SLAB, { y0: DECK[k] - SLAB }); P(e.sides, M.precast); P(e.top, M.concrete, false); }
    const roofPoly = rect(X0 + 1, X1, Z0 + 1, Z1 - 1);
    { const e = G.extrudePoly(roofPoly, [], SLAB, { y0: DECK[3] - SLAB }); P(e.sides, M.precast); P(e.top, M.concrete, false); }
    for (const F of faces(roofPoly)) if (!facing(F, 'E')) P(G.sideGeometry([F.a, F.b], DECK[3], DECK[3] + 3, 1 / 24, 1 / 12, false), tan);
    const innerPoly = G.offsetPoly(MR, 10), lv = [0, ...DECK];
    for (let k = 0; k < 4; k++) P(G.sideGeometry(innerPoly, lv[k], lv[k + 1] - SLAB, 1 / 24, 1 / 12, true), M.dark, false);
    for (const zr of [1112, 1150, 1196]) for (let x = 945; x < 1030; x += 9) P(G.box(0.4, 0.05, 17, x, DECK[3], zr), M.paintWhite, false);
    for (const [x, z] of [[950, 1131], [1005, 1131], [950, 1173], [1005, 1173]]) { cyl(0.35, 20, x, DECK[3], z, M.dark, 6); P(G.box(3, 0.6, 1.2, x, DECK[3] + 20, z), M.dark); }
    // 남서 계단탑
    const TH = 55.5;
    for (const F of faces(TW)) {
      if (facing(F, ['S', 'W'])) {
        const c = F.len / 2, ar = 5.5, shape = new THREE.Shape([new THREE.Vector2(0, 0), new THREE.Vector2(F.len, 0), new THREE.Vector2(F.len, TH), new THREE.Vector2(0, TH)]);
        shape.holes.push(archPath(c - ar, c + ar, 4.5, 15.5 - ar));
        const wins = [[16, 23], [26.5, 33.5], [37, 44]];
        for (const [b, t] of wins) { shape.holes.push(new THREE.Path([new THREE.Vector2(c - 5, b), new THREE.Vector2(c - 5, t), new THREE.Vector2(c + 5, t), new THREE.Vector2(c + 5, b)])); pane(F, c - 5, c + 5, b, t, 0.5); wbox(F, c - 0.15, c + 0.15, b, t, -0.5, -0.2, M.trim, false); wbox(F, c - 5, c + 5, (b + t) / 2 - 0.15, (b + t) / 2 + 0.15, -0.5, -0.2, M.trim, false); wbox(F, c - 5.5, c + 5.5, b - 0.6, b, -0.5, 0.6, tan, false); }
        planeOn(F, shape);
        planeOn(F, new THREE.Shape(archPath(c - ar, c + ar, 4.5, 15.5 - ar).getPoints(24)), 0.5, M.pane, false);
      } else P(G.sideGeometry([F.a, F.b], 0, TH, 1 / 24, 1 / 12, false), brick);
      wbox(F, -0.3, F.len + 0.3, 0, 4.5, -0.05, 0.3, stone);
      for (const y of [14.5, 25, 35.5, 46]) wbox(F, -0.1, F.len + 0.1, y, y + 0.5, -0.05, 0.2, tan, false);
      wbox(F, -0.6, F.len + 0.6, TH - 1.5, TH, -0.05, 0.8, tan);
    }
    pitched(TW, { kind: 'pyr', yE: TH, pitch: 0.82, ov: 1.0, axis: 0, mat: terracotta, fascia: tan, soffit: tan });
  }
  // ---- 단층 상업 (724476306)
  commercial(R('724476306'), { h: 18, par: 2.5, wall: 'brick_red', roof: M.roof_dark, store: ['S', 'N'], storeT: 11, win: { w: 4, h: 5, sill: 4, sp: 14, trim: M.precast }, band: [[12.2, 12.9, M.precast]], units: 4, seed: 7 });

  // ---- 냉동기 플랜트 (1230759382)
  {
    const main = rect(-713.9, -594.9, -1517.4, -1463.6), strip = rect(-663.4, -595.1, -1526.8, -1517.4);
    for (const F of faces(main)) {
      const ops = [];
      if (facing(F, 'S')) {   // 냉동기 쪽: 루버 3 + 셔터문 2 + 출입문
        for (const f of [0.15, 0.32, 0.68, 0.85]) { const c = F.len * f; ops.push({ s: c - 5, e: c + 5, b: 9, t: 16 }); wbox(F, c - 5, c + 5, 9, 16, -0.5, -0.3, C.unit, false); for (let y = 9.5; y < 16; y += 0.8) wbox(F, c - 5, c + 5, y, y + 0.25, -0.3, -0.05, M.dark, false); }
        for (const f of [0.24, 0.6]) door(F, ops, F.len * f, 12, 12, { mat: C.unit });
        door(F, ops, F.len * 0.5, 3.4, 7.2);
      } else if (facing(F, 'W')) { door(F, ops, F.len / 2, 6, 7.5, { trim: M.precast }); windowRow(F, ops, { w: 4, h: 5, sill: 12, sp: 12, trim: M.precast, skip: [[F.len / 2 - 4, F.len / 2 + 4]] }); }
      else windowRow(F, ops, { w: 6, h: 3.5, sill: 13, sp: 14, trim: M.precast });
      wall(F, 0, 22, ops, M.brick_tan);
    }
    bandAll(main, 10.5, 11.5, -0.05, 0.2, M.precast);
    bandAll(main, 0, 1.2, -0.05, 0.2, M.precast);
    flatTop(main, 22, { par: 2, mat: M.brick_tan, roof: M.roof_membrane, coping: M.precast, units: 5, seed: 11 });
    for (const F of faces(strip)) { if (facing(F, 'S')) continue; const ops = []; if (facing(F, 'N')) windowRow(F, ops, { w: 6, h: 3.5, sill: 10, sp: 14, trim: M.precast }); wall(F, 0, 17, ops, M.brick_tan); }
    bandAll(strip, 0, 1.2, -0.05, 0.2, M.precast);
    flatTop(strip, 17, { par: 1.5, mat: M.brick_tan, roof: M.roof_gravel, coping: M.precast });
  }

  // ---- 공랭식 냉동기 4대 (1464201654..57) + 플랜트로 가는 배관
  for (const id of ['1464201654', '1464201655', '1464201656', '1464201657']) {
    const poly = R(id), B = obb(poly, 90), ry = -B.A, c = B.W(B.cu, B.cv);
    P(G.box(B.L - 1, 1.4, B.D - 1, c[0], 0, c[1], { ry }), M.concrete);                    // 패드
    P(G.box(B.L - 2, 7.4, B.D - 2.4, c[0], 1.4, c[1], { ry }), C.unit);                    // 본체
    for (const sd of [-1, 1]) { const q = B.W(B.cu, B.cv + sd * (B.D / 2 - 1.3)); P(G.box(B.L - 2.4, 5, 0.12, q[0], 2.2, q[1], { ry }), M.dark, false); }   // 측면 코일(어둡게)
    for (let i = 0; i < 4; i++) for (const sd of [-1, 1]) {
      const p = B.W(B.u0 + 1 + (B.L - 2) * (i + 0.5) / 4, B.cv + sd * 3.6);
      cyl(3.3, 1.2, p[0], 8.8, p[1], M.dark, 14); cyl(3.0, 0.1, p[0], 10.0, p[1], C.unit, 14);
    }
    const n0 = B.W(B.u0 + 1.5, B.cv - 1.5), n1 = B.W(B.u0 + 1.5, B.cv + 1.5);   // u0 = 북쪽 끝 (축 90°: u = z)
    for (const q of [n0, n1]) { pipe([q[0], 2, q[1]], [q[0], 11, q[1]], 0.55, C.unit); pipe([q[0], 11, q[1]], [q[0], 11, -1462.5], 0.55, C.unit); }
  }

  // ---- Ballyhoo Pizza King (1464102452)
  {
    const Wp = rect(1588.4, 1614.0, 54.3, 135.5), Ep = rect(1614.0, 1646.7, 54.0, 135.2);
    const brick = M.brick_red, blue = C.blue, wht = C.paintW;
    for (const F of faces(Wp)) {
      const ops1 = [], ops2 = [];
      const street = facing(F, ['S', 'W']);
      if (street) {
        windowRow(F, ops1, { w: 6, h: 5.5, sill: 3, sp: 9, margin: 3, trim: wht });
        if (facing(F, 'S')) door(F, ops1, F.len * 0.5, 3.4, 7.5, { trim: wht });
        windowRow(F, ops2, { y0: 12, w: 3.2, h: 7.8, sill: 2.4, sp: 6.3, margin: 1.5, trim: M.limestone });
        wbox(F, -0.2, F.len + 0.2, 11.3, 12.8, -0.05, 0.5, wht);           // 흰 프리즈
        for (const s of [0.3, F.len - 0.3]) wbox(F, s - 0.6, s + 0.6, 0, 11.3, -0.05, 0.4, wht);   // 모서리 흰 기둥
      } else if (facing(F, 'E')) { windowRow(F, ops2, { y0: 12, w: 3.2, h: 6, sill: 5.5, sp: 9, margin: 3, trim: M.limestone }); }
      wall(F, 0, 12, ops1, street ? blue : brick);
      wall(F, 12, 26, ops2, brick);
      wbox(F, -1.2, F.len + 1.2, 24.6, 26.4, -0.05, 1.2, blue);              // 청색 코니스
      for (let s = 1; s < F.len; s += 3.2) wbox(F, s - 0.25, s + 0.25, 23.6, 24.6, -0.05, 0.8, blue, false);   // 브래킷
    }
    flatTop(Wp, 26, { par: 0.4, mat: brick, roof: M.roof_dark, coping: blue });
    for (const F of faces(Ep)) {
      const ops = [];
      if (facing(F, 'S')) {
        windowRow(F, ops, { w: 6.5, h: 5, sill: 3, sp: 9.5, margin: 1.5, trim: wht, maxN: 3 });
        wbox(F, 4, F.len - 4, 12.3, 15.6, -0.05, 0.6, C.sign);                 // BALLYHOO 간판
      } else if (facing(F, 'E') || facing(F, 'N')) door(F, ops, F.len * 0.6, 3.4, 7.2);
      wall(F, 0, 16.5, ops, facing(F, ['S', 'E']) ? blue : M.brick_brown);
      wbox(F, -0.2, F.len + 0.2, 10.3, 11.0, -0.05, 0.4, wht, false);
    }
    flatTop(Ep, 16.5, { par: 1.0, mat: blue, roof: M.roof_dark, coping: wht, units: 2, seed: 5 });
    // 줄무늬 차양 (남면 4, 서면 2)
    const awning = (F, s, e, yT, dep = 3.2, drop = 2.4) => {
      const T = new Tris(), A = F.at(s, 0), Bq = F.at(e, 0), A2 = F.at(s, dep), B2 = F.at(e, dep);
      T.both([A[0], yT, A[1]], [Bq[0], yT, Bq[1]], [B2[0], yT - drop, B2[1]]); T.both([A[0], yT, A[1]], [B2[0], yT - drop, B2[1]], [A2[0], yT - drop, A2[1]]);
      T.both([A2[0], yT - drop, A2[1]], [B2[0], yT - drop, B2[1]], [B2[0], yT - drop - 0.8, B2[1]]); T.both([A2[0], yT - drop, A2[1]], [B2[0], yT - drop - 0.8, B2[1]], [A2[0], yT - drop - 0.8, A2[1]]);
      T.both([A[0], yT, A[1]], [A2[0], yT - drop, A2[1]], [A2[0], yT - drop - 0.8, A2[1]]); T.both([Bq[0], yT, Bq[1]], [B2[0], yT - drop, B2[1]], [B2[0], yT - drop - 0.8, B2[1]]);
      P(T.geom(), C.awn, false);
      for (let x = s + 0.9; x < e; x += 1.8) {   // 흰 줄무늬 (얇은 띠)
        const a1 = F.at(x - 0.45, 0.02), a2 = F.at(x + 0.45, 0.02), b1 = F.at(x - 0.45, dep + 0.02), b2 = F.at(x + 0.45, dep + 0.02);
        const S = new Tris(); S.both([a1[0], yT + 0.03, a1[1]], [a2[0], yT + 0.03, a2[1]], [b2[0], yT - drop + 0.03, b2[1]]); S.both([a1[0], yT + 0.03, a1[1]], [b2[0], yT - drop + 0.03, b2[1]], [b1[0], yT - drop + 0.03, b1[1]]);
        P(S.geom(), C.sign, false);
      }
    };
    const fS = frame([1588.4, 135.5], [1614.0, 135.5]), fE = frame([1614.0, 135.2], [1646.7, 135.2]);
    awning(fS, 2, 24, 11.2);
    for (const k of [0, 1, 2]) awning(fE, 1.8 + k * 10.3, 1.8 + k * 10.3 + 9.2, 10.2);
    const fW = frame([1588.4, 54.3], [1588.4, 135.5]);
    awning(fW, fW.len - 22, fW.len - 4, 11.2);
    // 철제 펜스(파티오)
    const pf = frame([1600, 141.5], [1640, 141.5]);
    wbox(pf, 0, 40, 3.3, 3.5, -0.05, 0.05, M.dark, false); for (let s = 0; s <= 40; s += 4) wbox(pf, s - 0.08, s + 0.08, 0, 3.5, -0.08, 0.08, M.dark, false);
  }

  // ---- ISCO 창고 (1464213968) + 같은 부지 창고 (1464213967)
  industrial(R('1464213968'), { h: 18, roll: 'S', doors: 'W', roof: M.roof_dark, units: 2, seed: 4 });
  industrial(R('1464213967'), { h: 16, open: 'N', doors: 'E', roof: M.roof_gravel, units: 1, seed: 6 });
  {   // ISCO 원형 간판 (서면, vp71_096)
    const F = frame([1226.4, 389.0], [1226.4, 422.5]); const p = F.at(F.len * 0.55, 0.2);
    const g = new THREE.CylinderGeometry(3.4, 3.4, 0.3, 20); g.rotateZ(Math.PI / 2); g.translate(p[0], 12, p[1]); P(g, C.red);
    const g2 = new THREE.CylinderGeometry(3.9, 3.9, 0.2, 20); g2.rotateZ(Math.PI / 2); g2.translate(p[0] + 0.1, 12, p[1]); P(g2, C.sign, false);
  }

  // ---- 9th St 가로변 3동
  commercial(R('1464213969'), { h: 24, par: 2, wall: 'brick_red', roof: M.roof_membrane, store: ['N', 'E'], storeT: 11, upper: 12.5, upperRows: 1, win: { w: 3.5, h: 6, sill: 2.5, sp: 9, trim: M.limestone }, band: [[11.6, 12.4, M.limestone]], units: 3, seed: 13 });
  commercial(R('1464213971'), { h: 22, par: 2, wall: 'brick_tan', roof: M.roof_membrane, store: ['N'], storeT: 11, upper: 12.5, upperRows: 1, win: { w: 4, h: 5.5, sill: 2.5, sp: 12, trim: M.precast }, doors: 'W', band: [[11.6, 12.4, M.precast]], units: 2, seed: 17 });
  commercial(R('1464213970'), { h: 16, par: 1.5, wall: 'brick_brown', roof: M.roof_membrane, store: ['N'], storeT: 10, win: null, units: 1, seed: 19 });

  // ---- 단층 업무동 (1464427782) + 옥상 덕트
  commercial(R('1464427782'), { h: 14, par: 1.5, wall: 'brick_brown', roof: M.roof_gravel, win: { w: 5, h: 4.5, sill: 3.5, sp: 10, trim: M.precast }, doors: ['N', 'S'], units: 3, seed: 23 });
  pipe([1045, 15.2, -690], [1080, 15.2, -672], 1.1, C.unit); pipe([1080, 15.2, -672], [1110, 15.2, -672], 1.1, C.unit);

  // ---- Carpenters Hall (925504490): 서측 63 ft 2층(금속 지붕) + 동측 32 ft 2층
  {
    const Wb = rect(-1267.0, -1204.2, 1055.6, 1098.6), Eb = rect(-1204.2, -1172.4, 1055.7, 1098.7);
    commercial(Wb, { h: 24, par: 1.0, wall: 'brick_tan', roof: C.mGrey, win: { rows: 2, sh: 11, w: 4, h: 5, sill: 3, sp: 9, trim: M.precast }, doors: 'S', band: [[10.6, 11.3, M.precast]], coping: M.white, seed: 29 });
    commercial(Eb, { h: 22, par: 1.5, wall: 'brick_tan', roof: M.roof_dark, store: ['E'], storeT: 9, upper: 11.5, upperRows: 1, win: { w: 4, h: 5, sill: 2.5, sp: 8, trim: M.precast }, doors: 'S', band: [[10.6, 11.3, M.precast]], units: 4, seed: 31 });
    const Fe = frame([-1172.4, 1098.7], [-1172.4, 1055.7]); wbox(Fe, 15, 28, 9.4, 10.1, 0, 5, M.dark);   // 동측 입구 캐노피
  }

  // ---- 주유소 캐노피 (1463237099)
  {
    const B = obb(R('1463237099'), 90), ry = -B.A, c = B.W(B.cu, B.cv);
    P(G.box(B.D, 3, B.L, c[0], 15.5, c[1], { ry: 0 }), C.paintW);
    wbox(frame([c[0] - B.D / 2, c[1] + B.L / 2], [c[0] + B.D / 2, c[1] + B.L / 2]), 0, B.D, 17.2, 17.9, 0, 0.06, C.red, false);
    wbox(frame([c[0] + B.D / 2, c[1] - B.L / 2], [c[0] - B.D / 2, c[1] - B.L / 2]), 0, B.D, 17.2, 17.9, 0, 0.06, C.red, false);
    for (const side of [-1, 1]) { const Fs = frame([c[0] + side * B.D / 2, c[1] + side * B.L / 2], [c[0] + side * B.D / 2, c[1] - side * B.L / 2]); wbox(Fs, 0, B.L, 17.2, 17.9, 0, 0.06, C.red, false); }
    for (const dz of [-27, 0, 27]) {
      P(G.box(1.6, 15.5, 1.6, c[0], 0, c[1] + dz), C.paintW);
      P(G.box(3.4, 0.6, 16, c[0], 0, c[1] + dz), M.concrete);
      for (const s of [-4.5, 4.5]) { P(G.box(2.4, 5.6, 1.6, c[0], 0.6, c[1] + dz + s), C.unit); P(G.box(2.5, 0.8, 1.7, c[0], 6.2, c[1] + dz + s), C.red); }
      cyl(0.4, 3, c[0] - 1, 0.6, c[1] + dz + 7.5, C.red, 6); cyl(0.4, 3, c[0] - 1, 0.6, c[1] + dz - 7.5, C.red, 6);
    }
  }

  // ---- Eugene V. Debs Museum (545265780): 1890 Queen Anne 2층 목조 + L자 포치
  {
    const E = 21, pit = 0.8, roofM = C.shGrey;
    const main = rect(1242.3, 1292.3, -344.4, -311.0), cross = rect(1266.3, 1292.3, -348.3, -344.4);
    const xg = rect(1268.0, 1284.0, -348.3, -309.4), wg = rect(1242.3, 1258.0, -334.0, -318.0), east = rect(1282.1, 1300.3, -344.4, -321.9);
    const sid = { eave: E, storeys: 2, sh: 10.5, wall: 'cream', roofMat: roofM, found: true, floorY: 2.2, win: { w: 2.8, h: 5.8, sill: 3.4, sp: 7.5, trim: M.white } };
    house(main, { ...sid, front: 'S', doorAt: 0.3, roofKind: 'hip', pitch: pit, axis: 0, ov: 1.5 });
    house(cross, { ...sid, win: false, door: false, roofKind: 'hip', pitch: pit, axis: 0, ov: 0.1, roofMat: roofM });
    pitched(xg, { kind: 'gable', yE: E, pitch: 0.95, ov: 1.4, axis: 90, mat: roofM, wallMat: C.cream });
    pitched(wg, { kind: 'gable', yE: E, pitch: 0.95, ov: 1.4, axis: 0, mat: roofM, wallMat: C.cream });
    house(east, { ...sid, eave: 19, roofKind: 'gable', pitch: 0.9, axis: 0, side: 'E' });
    // 박공 장식: 각 박공 꼭대기 아래 작은 창 (다락)
    for (const [x, z, ry] of [[1276, -348.6, 0], [1276, -309.1, 0], [1242.0, -326, Math.PI / 2], [1300.6, -333.2, Math.PI / 2]]) P(G.box(2.2, 3, 0.25, x, E + 3, z, { ry }), M.pane, false);
    // 포치: 바닥 데크, 흰 기둥, 난간, 낮은 모임지붕
    const porches = [rect(1238.0, 1242.3, -327.4, -303.2), rect(1242.3, 1270.0, -311.0, -303.0)];
    for (const pr of porches) {
      const B = obb(pr, 0), c = B.W(B.cu, B.cv);
      P(G.box(B.L, 2.2, B.D, c[0], 0, c[1]), M.trim);
      for (const F of faces(pr)) {
        if (F.len < 3) continue;
        const n = Math.max(1, Math.round(F.len / 7));
        for (let i = 0; i <= n; i++) { const s = Math.min(F.len - 0.3, Math.max(0.3, F.len * i / n)); wbox(F, s - 0.3, s + 0.3, 2.2, 10.2, -0.6, 0, M.white); }
        wbox(F, 0, F.len, 4.9, 5.2, -0.45, -0.15, M.white, false); wbox(F, 0, F.len, 2.5, 2.7, -0.45, -0.15, M.white, false);
        for (let s = 0.6; s < F.len; s += 0.6) wbox(F, s - 0.05, s + 0.05, 2.7, 4.9, -0.35, -0.25, M.white, false);
      }
      pitched(pr, { kind: 'hip', yE: 10.2, pitch: 0.3, ov: 0.8, axis: B.L > B.D ? 0 : 90, mat: roofM });
    }
    // 포치 계단 (서측 8th St 쪽)
    P(G.box(3, 0.7, 6, 1236.3, 0, -318), M.concrete); P(G.box(1.6, 0.7, 6, 1236.9, 0.7, -318), M.concrete); P(G.box(0.8, 0.8, 6, 1237.6, 1.4, -318), M.concrete);
    P(G.box(2.6, 7, 2.6, 1262, 28, -328), M.brick_red);   // 굴뚝 (위성 지붕 중앙)
  }

  // ---- 1.5층 벽돌 차고 (1230759384): 동서 용마루 모임지붕 + 남측 앞박공(반원창, 차고문 2)
  {
    const poly = R('1230759384');
    house(poly, { eave: 11, wall: 'brick_brown', front: 'S', garage: 2, roofKind: 'hip', pitch: 0.6, axis: 0, roofMat: C.shGrey, win: { w: 2.6, h: 4, sill: 3, sp: 9 } });
    const fg = rect(223.9, 245.9, 1046.0, 1054.6);   // 앞박공 (차고문 위, 남측 박공면)
    pitched(fg, { kind: 'gable', yE: 11, pitch: 0.7, ov: 1.0, axis: 90, mat: C.shGrey, wallMat: M.brick_brown });
    const B = obb(fg, 90); const pS = B.W(B.u1 + 0.05, B.cv);
    const lun = new THREE.CircleGeometry(2.4, 12, 0, Math.PI); lun.translate(pS[0], 13.2, pS[1] + 0.05); P(lun, M.pane, false);
    const lt = new THREE.RingGeometry(2.4, 2.8, 12, 1, 0, Math.PI); lt.translate(pS[0], 13.2, pS[1] + 0.07); P(lt, M.white, false);
  }

  // ---- 단층 벽돌 부속동 (1464442449): 갈색 슁글 모임지붕 (vp33_092)
  house(R('1464442449'), { eave: 10, wall: 'brick_red', front: 'E', roofKind: 'hip', pitch: 0.45, axis: 0, roofMat: C.shBrown, win: false, ov: 1.0 });

  // ---- 트랙 본부동 (1464102474): 적벽돌, 갈색 모임지붕 3개
  {
    const poly = R('1464102474');
    for (const F of faces(poly)) {
      const ops = [];
      if (F.len > 15) { const dz = facing(F, ['E', 'W']) ? [[F.len / 2 - 3, F.len / 2 + 3]] : []; windowRow(F, ops, { w: 4, h: 4, sill: 3.5, sp: 10, margin: 3, trim: M.precast, skip: dz }); if (dz.length) door(F, ops, F.len / 2, 6, 7.5, { trim: M.precast }); }
      wall(F, 0, 12, ops, M.brick_red);
    }
    bandAll(poly, 0, 1.0, -0.02, 0.18, M.concrete);
    pitched(rect(1605.5, 1632.9, -814.7, -790.0), { kind: 'hip', yE: 12, pitch: 0.5, ov: 1.5, axis: 0, mat: C.shBrown });
    pitched(rect(1605.5, 1632.9, -790.0, -765.3), { kind: 'hip', yE: 12, pitch: 0.5, ov: 1.5, axis: 0, mat: C.shBrown });
    pitched(rect(1584.8, 1605.6, -798.3, -778.6), { kind: 'hip', yE: 12, pitch: 0.5, ov: 1.5, axis: 0, mat: C.shBrown });
  }
  // ---- 지붕 덮인 관람석 2 + 알루미늄 관람석 (트랙)
  bleacher(R('1464102470'), { face: 90, covered: { eave: 15, roofMat: C.mWhite } });
  bleacher(R('1464102471'), { face: 90, covered: { eave: 15, roofMat: C.mWhite } });
  bleacher(R('1464102468'), { face: 90 });
  bleacher(R('1464102469'), { face: 90 });
  bleacher(R('1464102439'), { face: 90 });
  bleacher(R('1464102440'), { face: 90 });
  bleacher(R('1464102441'), { face: 40 });

  // ---- 소프트볼장
  bleacher(R('1464201646'), { face: 80 });
  bleacher(R('1464201649'), { face: 5 });
  house(R('1464201650'), { eave: 11, wall: 'brick_red', front: 'N', roofKind: 'pyr', pitch: 0.45, roofMat: C.shGrey, win: { w: 5, h: 3, sill: 5, sp: 9, trim: M.white }, ov: 1.8 });
  house(R('1464201647'), { eave: 11, wall: 'brick_tan', front: 'S', roofKind: 'gable', pitch: 0.3, roofMat: C.mGrey, win: { w: 4, h: 3, sill: 5, sp: 12, trim: M.white }, ov: 1.2 });
  commercial(R('1464201648'), { h: 12, par: 1, wall: 'block', roof: M.roof_dark, store: ['N'], storeT: 9, win: null, doors: 'S', units: 2, seed: 37, base: false });
  commercial(R('1464201645'), { h: 10, par: 0.8, wall: 'block', roof: M.roof_dark, win: { w: 3, h: 2.5, sill: 5.5, sp: 10, trim: null }, doors: 'W', units: 1, seed: 41, base: false });
  house(R('1464201644'), { eave: 9, wall: 'block', front: 'S', roofKind: 'gable', pitch: 0.4, axis: 90, roofMat: C.mGrey, win: false, ov: 0.8 });
  house(R('1464201651'), { eave: 9, wall: 'block', front: 'S', roofKind: 'gable', pitch: 0.35, axis: 90, roofMat: C.mBlue, win: false, ov: 0.8, garage: 1 });

  // ---- 농구장 옆 창고 (1464208229), 테니스 기록 부스 (1464201652)
  house(R('1464208229'), { eave: 10, wall: 'block', front: 'S', roofKind: 'gable', pitch: 0.35, axis: 0, roofMat: C.mWhite, win: { w: 3, h: 2.5, sill: 5.5, sp: 12, trim: null }, ov: 1.0, garage: 1 });
  commercial(R('1464201652'), { h: 10, par: 0.6, wall: 'paintW', roof: M.roof_dark, store: ['W'], storeT: 7.5, win: null, doors: 'E', base: false, coping: M.dark });

  // ---- 양조장 탱크 3 + 냉장 박스
  for (const [id, h] of [['1464098140', 30], ['1464098144', 18], ['1464098145', 18]]) {
    const poly = R(id), c = cen(poly); let r = 0; for (const p of poly) r += Math.hypot(p[0] - c[0], p[1] - c[1]); r = r / poly.length * 0.97;
    cyl(r, h, c[0], 0, c[1], C.steel, 20);
    cyl(r, 3, c[0], h, c[1], C.steel, 20, 0.6);
    for (const y of [h * 0.3, h * 0.65]) cyl(r + 0.15, 0.4, c[0], y, c[1], M.metal, 20);
    cyl(r + 0.2, 1, c[0], 0, c[1], M.concrete, 20);
  }
  pipe([1673, 12, 1118], [1673, 12, 1135], 0.4, C.steel); pipe([1673, 12, 1135], [1689, 12, 1135], 0.4, C.steel);
  commercial(R('1464098146'), { h: 12, par: 0.3, wall: 'paintW', roof: M.roof_membrane, win: null, doors: 'E', base: false, coping: C.paintW });

  // ============================================================ 병합
  const grp = new THREE.Group();
  for (const m of G.mergeByMaterial(parts)) grp.add(m);
  return grp;
}
