// Student Recreation Center — Hastings+Chivetta, 프로젝트 2817 (2007 시공도, 2009 준공)
// 치수 근거 (도면 세트 "Student Rec Ctr Record Drawings", 평면 1/16" = 1'-0", 스캔 도면이라 눈으로 읽음):
//   A2.01/A2.02 1·2층 참조 평면: 열 그리드 1→18.1 = 320' (베이 21'-4" 기본, 10'-8"/19'-4" 등), 행 그리드 A2→M = 280'
//     (D~K 30' 베이, C·D 20', B→A6 11'-8", A6→A2 18'-4"), 외벽은 그리드 바깥 2'-0". 북쪽 화살표 = 평면 아래쪽.
//     SW 모서리 자연채광 수영장(leisure pool)의 원호 커튼월: 중심 (193,137), 반경 106' (위성영상 대조로 보정), 메인 출입구
//     vestibule 145 = 그리드 11~10 남측, 남/북 캐노피 그리드 15~13.
//   A2.03 지붕 평면: 체육관(3-court gym, 그리드 17~12 × 행 D~K) 박공 3":12" 남북 용마루, 피트니스(그리드 8~1 × 행 F~H)
//     박공 3":12" 동서 용마루, 나머지 평지붕(막 방수) 코핑 EL 131'-8"~132'-0", 냉동기 마당(chiller yard) 그리드 4~2 행 H8~K.
//   A4.01 외부 입면: 1층 100'-0", 2층 114'-0", 난간 상단 132'-0"(일반)·136'-0"(체육관 처마), 벽돌 베이스 + 금속 복합패널 상부.
//   A4.03~A4.05 건물 단면: 체육관 상부 철골 135'-9½", 최고점 147'-8"; 피트니스 상부 철골 129'-0", 최고점 145'-8";
//     MAC gym 상부 조적 131'-8"; 북서쪽 행 M~L 1층부 난간 114'-0".
// 로컬 프레임: 평면도 기준 x = 오른쪽(= 서), z = 아래(= 북). 원점 = 그리드 18.1 / 행 A2 교차점. y = 0 = 1층 바닥(100'-0").
import * as THREE from 'three';

export const meta = {
  id: 'rec', name: 'Student Recreation Center', osm: 'way/544686559',
  anchor: [395.39, -977.84], rotation: 179.535,   // tools/fit_footprint.py 결과 (RMS 4.8 ft)
  height: 47.7,
  preset: { pos: [120, 170, -720], tgt: [240, 10, -1080] },
  sheets: '2817 A2.01, A2.02, A2.03, A4.01, A4.03, A4.04, A4.05 (+ esri 위성영상 대조)',
};

const H2 = 32, H1 = 14;                      // 2층부 난간 상단, 1층부 난간 상단 (ft)
const GYM = { x0: 17, x1: 123.33, z0: 70, z1: 250, eave: 36, ridge: 47.7 };     // 3-court gymnasium
const FIT = { x0: 174.67, x1: 321, z0: 128, z1: 192, eave: 38, ridge: 45.7 };   // fitness center (2층)
const CHILL = [[263, 210], [263, 246], [293, 246], [293, 210]];                // 냉동기 마당 (평면 CCW, 지붕 구멍)

// 원호 커튼월 (SW 모서리): 중심 (193,137) r=106, -90° → -4.9°
const ARC = [[193.0, 31.0], [208.7, 32.2], [224.0, 35.6], [238.7, 41.4], [252.4, 49.2], [264.7, 58.9], [275.5, 70.4], [284.4, 83.3], [291.4, 97.5], [296.1, 112.5], [298.6, 128.0]];

// 외곽선 (평면에서 CCW, (x,-z) 면적 양수). 변 종류: b=벽돌+창, g=유리 커튼월, p=민벽돌
const EDGES = [
  [[16.67, 18.33], 'p'], [[-2, 18.33], 'b'], [[-2, 70], 'p'], [[6, 70], 'p'], [[6, 97.5], 'p'], [[17, 97.5], 'b'], [[17, 220], 'p'],
  [[6, 220], 'p'], [[6, 248], 'p'], [[17, 248], 'p'], [[17, 281], 'b'],                                     // 동측 → 북측 2층부
  [[153, 281], 'p'], [[153, 260.67], 'b'],                                                                   // 북서 1층부 경계 (2층부 외곽)
  [[302, 260.67], 'b'], [[302, 192], 'p'], [[321, 192], 'b'], [[321, 128], 'p'], [[302, 128], 'p'],
  ...[...ARC].reverse().map(p => [p, 'g']),                                                                  // 원호 (북→남) + 남측 커튼월
  [[153, 32], 'g'], [[153, -12], 'g'], [[125, -12], 'g'], [[125, -2], 'b'], [[16.67, -2], 'p'],              // 출입 vestibule, 사무동 남측
];
export const outline = [[16.67, 18.33], [-2, 18.33], [-2, 70], [6, 70], [6, 97.5], [17, 97.5], [17, 220], [6, 220], [6, 248], [17, 248], [17, 281], [302, 281], [302, 192], [321, 192], [321, 128], [302, 128],
  ...[...ARC].reverse(), [153, 32], [153, -12], [125, -12], [125, -2], [16.67, -2]];

export function build(M, G) {
  const parts = [];
  const brick = M.brick_red;
  const poly2 = EDGES.map(e => e[0]);

  // ---- 2층부 외벽 (벽돌 베이스 + 2단 창 / 원호·출입부 커튼월)
  for (let i = 0; i < EDGES.length; i++) {
    const [p0, kind] = EDGES[i], p1 = EDGES[(i + 1) % EDGES.length][0];
    const len = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]);
    if (kind === 'g') {
      parts.push({ geom: G.sideGeometry([p0, p1], 0, H2, 1 / 24, 1 / 12, false), mat: M.glass });
      if (len > 12) parts.push({ geom: pilaster(G, p0, p1, H2), mat: brick });            // 원호 커튼월 벽돌 필라스터
    } else if (kind === 'b' && len > 24) {
      const w = G.windowGrid(p0, p1, { y0: 0, rows: 2, rowH: 16, colW: 10.67, winW: 6.5, winH: 6, sill: 4, margin: 4 });
      parts.push({ geom: w.wall, mat: brick }); parts.push({ geom: w.glass, mat: M.pane, cast: false });
    } else {
      parts.push({ geom: G.sideGeometry([p0, p1], 0, H2, 1 / 24, 1 / 12, false), mat: brick });
    }
  }
  roof(parts, poly2, H2, M, G, [CHILL]);
  // 냉동기 마당: 지붕 구멍 안쪽 벽(남·동 2층 높이, 북·서 14' 스크린월) + 바닥
  const ch = [...CHILL].reverse();                                   // 안쪽을 향하는 법선
  for (let i = 0; i < 4; i++) {
    const a = ch[i], b = ch[(i + 1) % 4], tall = a[1] === b[1] ? a[1] === 210 : a[0] === 263;
    parts.push({ geom: G.sideGeometry([a, b], 0, tall ? H2 : H1, 1 / 24, 1 / 12, false), mat: brick });
  }
  parts.push({ geom: G.capGeometry(CHILL, [], 0.5), mat: M.concrete, cast: false });
  parts.push({ geom: G.box(10, 7, 6, 278, 0.5, 222), mat: M.dark }); parts.push({ geom: G.box(10, 7, 6, 278, 0.5, 234), mat: M.dark });   // 냉동기

  // ---- 북서 1층부 (행 L~M, 그리드 10~2): 벽돌 + 1단 창
  const nw = [[153, 260.67], [153, 281], [302, 281], [302, 260.67]];
  {
    const w = G.windowGrid([153, 281], [302, 281], { y0: 0, rows: 1, rowH: H1, colW: 10.67, winW: 6, winH: 5, sill: 4, margin: 6 });
    parts.push({ geom: w.wall, mat: brick }); parts.push({ geom: w.glass, mat: M.pane, cast: false });
  }
  parts.push({ geom: G.sideGeometry([[302, 281], [302, 260.67]], 0, H1, 1 / 24, 1 / 12, false), mat: brick });
  roof(parts, nw, H1, M, G);

  // ---- 체육관: 2층부 지붕 위 금속패널 처마벽(32→36) + 3":12" 박공(남북 용마루) + 양 박공면 반투명 유리
  const gym = [[GYM.x0, GYM.z0], [GYM.x0, GYM.z1], [GYM.x1, GYM.z1], [GYM.x1, GYM.z0]];       // 평면 CCW
  parts.push({ geom: G.sideGeometry(gym, H2 - 0.5, GYM.eave, 1 / 24, 1 / 12), mat: M.metal });
  gable(parts, GYM, 'z', M.metal, M.glass);                      // 박공면 = 반투명 유리 (A4.01 'insulating translucent glass')

  // ---- 피트니스 센터: 클리어스토리 유리띠(32→38) + 3":12" 박공(동서 용마루), 박공면 금속패널
  const fit = [[FIT.x0, FIT.z0], [FIT.x0, FIT.z1], [FIT.x1, FIT.z1], [FIT.x1, FIT.z0]];
  parts.push({ geom: G.sideGeometry(fit, H2 - 0.5, FIT.eave, 1 / 24, 1 / 12), mat: M.glass, cast: false });
  gable(parts, FIT, 'x', M.metal, M.metal);

  // ---- 출입 타워(그리드 11~10.8, 금속패널, 140'-6") · 캐노피(남 그리드 15~13, 북 동일) · 콩코스 지붕 채광
  parts.push({ geom: G.box(14, 9, 22, 141, H2, -1), mat: M.metal });
  parts.push({ geom: G.box(40, 1, 7, 74, 13, -5.5), mat: M.white });
  parts.push({ geom: G.box(40, 1, 7, 74, 13, 284.5), mat: M.white });
  parts.push({ geom: G.box(8, 1, 90, 128.5, H2 - 0.5, 150), mat: M.glass, cast: false });    // 콩코스 상부 띠 채광창 (A2.03 translucent panel skylight)
  parts.push({ geom: G.box(12, 6, 16, 60, H2, 265), mat: M.metal });                          // 북측 블록 기계실 펜트하우스
  // 원호 앞 선데크/계단 플라자 (콘크리트)
  parts.push({ geom: G.capGeometry([[153, 32], ...ARC.map(p => [p[0] + 4, p[1] - 3]), [320, 110], [320, 20], [153, 20]].reverse(), [], 0.3), mat: M.walk, cast: false });

  const grp = new THREE.Group();
  for (const m of G.mergeByMaterial(parts)) grp.add(m);
  return grp;
}

function roof(parts, poly, y, M, G, holes = []) {
  const r = G.flatRoof(poly, y, { parapet: 1.5, thick: 0.6, holes });
  parts.push({ geom: r.slab, mat: M.roof_membrane });
  if (r.parapet) parts.push({ geom: r.parapet, mat: M.trim });
}

/** 커튼월 구간 시작점에 벽돌 필라스터(2'×1.2') */
function pilaster(G, p0, p1, h) {
  const dx = p1[0] - p0[0], dz = p1[1] - p0[1], len = Math.hypot(dx, dz);
  const nx = -dz / len, nz = dx / len;                                // 바깥 법선
  return G.box(2, h, 1.2, p0[0] + nx * 0.3, 0, p0[1] + nz * 0.3, { ry: -Math.atan2(dz, dx) });
}

/** 박공지붕: r = {x0,x1,z0,z1,eave,ridge}, axis = 용마루 방향('x' 동서 | 'z' 남북). geom.js gableRoof 는 감김이 뒤집혀 있어 자체 구현. */
function gable(parts, r, axis, matRoof, matEnd) {
  const { x0, x1, z0, z1, eave: e, ridge: h } = r, xm = (x0 + x1) / 2, zm = (z0 + z1) / 2, UP = [0, 1, 0];
  const R = (a, b, c) => parts.push({ geom: tri(a, b, c, UP), mat: matRoof });
  if (axis === 'z') {        // 용마루 x = xm, z0..z1
    R([x0, e, z0], [x0, e, z1], [xm, h, z1]); R([x0, e, z0], [xm, h, z1], [xm, h, z0]);
    R([x1, e, z0], [xm, h, z0], [xm, h, z1]); R([x1, e, z0], [xm, h, z1], [x1, e, z1]);
    parts.push({ geom: tri([x0, e, z0 - 0.1], [x1, e, z0 - 0.1], [xm, h, z0 - 0.1], [0, 0, -1]), mat: matEnd, cast: false });
    parts.push({ geom: tri([x0, e, z1 + 0.1], [x1, e, z1 + 0.1], [xm, h, z1 + 0.1], [0, 0, 1]), mat: matEnd, cast: false });
  } else {                   // 용마루 z = zm, x0..x1
    R([x0, e, z0], [x1, e, z0], [x1, h, zm]); R([x0, e, z0], [x1, h, zm], [x0, h, zm]);
    R([x0, e, z1], [x0, h, zm], [x1, h, zm]); R([x0, e, z1], [x1, h, zm], [x1, e, z1]);
    parts.push({ geom: tri([x0 - 0.1, e, z0], [x0 - 0.1, e, z1], [x0 - 0.1, h, zm], [-1, 0, 0]), mat: matEnd, cast: false });
    parts.push({ geom: tri([x1 + 0.1, e, z0], [x1 + 0.1, e, z1], [x1 + 0.1, h, zm], [1, 0, 0]), mat: matEnd, cast: false });
  }
}

/** 삼각형 1장. n = 바깥 법선 방향 — 감김 순서를 그에 맞춘다 */
function tri(a, b, c, n) {
  const ab = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], ac = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
  const cr = [ab[1] * ac[2] - ab[2] * ac[1], ab[2] * ac[0] - ab[0] * ac[2], ab[0] * ac[1] - ab[1] * ac[0]];
  if (cr[0] * n[0] + cr[1] * n[1] + cr[2] * n[2] < 0) [b, c] = [c, b];
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute([...a, ...b, ...c], 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, 4, 0, 2, 1], 2));
  g.computeVertexNormals();
  return g;
}
