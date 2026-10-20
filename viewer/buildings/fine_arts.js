// Fine Arts Building, 649 Chestnut St — Miller & Yeager, 1940 (PWA) / arcDESIGN 2018 리노베이션 (project 17180, bid set)
// 치수 근거 (17180 - ISU FineArts - BID SET Volume 1.pdf, 1/8" = 1'-0" 평면·입면, 3/16" 단면):
//   A111 Dimension Plan – First Floor (p58): 그리드 1..12 = 190.0 .. 29.5 ft (벡터 텍스트 좌표 /9 pt·ft), 베이 16'(4–9) / 13'-5"(9–12, 1–2)
//     외벽 외면(회색 기존벽 채움 사각형 좌표): 북측 날개 북면 z=35.2, 날개 외측 x=15.4 / 203.1, 날개 남면 z=68.1,
//     본체 x=28.5..190, 본체 북면(역사 로비 면) z=66.4, 본체 남면 z=142.7, 계단실 베이 x=55.9..70.8 / 148.7..163.5
//     2018 남측 증축(커튼월) 남면 z≈150, x 86.7..150; 신설 엘리베이터 타워 x 69.8..86.7 (그리드 9–8), z 136..150
//   A114 Fourth Floor (p61): 4층 블록 x 68.4..151 (그리드 9–4), z 66.4..130.3 (F–B)
//   A160 Roof Plan (p82): 4층 위 모임지붕(기존 합성 슬레이트) 경사 3½"/12, 용마루 동서; 날개·3층·증축은 평지붕(MB/EPDM)
//   A201/A202/A203 입면 (p83–85): FIRST 0', SECOND 13', THIRD 26', FOURTH 39', ROOF BEARING 51', ROOF 53';
//     3층부 난간(석회석 코니스) 상단 ≈41.5', 2층 날개 상단 ≈32', 엘리베이터 타워 상단 ≈56', 용마루 ≈62'
//     창: 본체 1·2층 약 4.5'×7.5', 3층 5.5'×5', 4층 4.5'×5'; 북측 로비면 2층 높이 석회석 필라스터(그리드 5–8), 날개 끝면 필라스터 2개
//   A302 Building Section (p87): 지하층(lower level) 전체 지하 → 모델 생략, 1층 = y 0
// 로컬 프레임: 평면도 기준 x = 오른쪽(= 동), z = 아래(= 남). 북쪽 화살표 = 평면 위 → rotation ≈ 0.
import * as THREE from 'three';

export const meta = {
  id: 'finearts', name: 'Fine Arts Building', osm: 'way/545265789',
  anchor: [432.36, 192.32], rotation: -0.391,   // tools/fit_footprint.py 결과 (RMS 2.2 ft)
  height: 62,
  preset: { pos: [582, 190, 684], tgt: [541, 10, 284] },
  sheets: 'FineArts 17180 bid set: A111, A114, A160, A201, A202, A203, A302',
};

const F2 = 13, F3 = 26, F4 = 39;          // 층 바닥 높이 (ft)
const H3 = 41.5, HW = 32, H4 = 53, HT = 56; // 3층부 난간 상단, 2층 날개 상단, 4층 코니스 상단, 엘리베이터 타워
const RISE = 9.3;                          // 모임지붕 높이 (z 폭 64' × 3.5/12)

// 바닥 외곽선 (반시계, 평면 기준): 본체 + 남측 증축 + 북측 날개 2개
export const outline = [
  [28.5, 142.7], [69.8, 142.7], [69.8, 150], [150, 150], [150, 142.7], [190, 142.7],
  [190, 68.1], [203.1, 68.1], [203.1, 35.2], [148.7, 35.2], [148.7, 66.4], [70.8, 66.4], [70.8, 35.2],
  [15.4, 35.2], [15.4, 68.1], [28.5, 68.1],
];

export function build(M, G) {
  const parts = [];
  const brick = M.brick_red, stone = M.limestone;
  const win = (p0, p1, o) => { const w = G.windowGrid(p0, p1, o); parts.push({ geom: w.wall, mat: brick }); if (w.glass) parts.push({ geom: w.glass, mat: M.pane, cast: false }); };
  const wall = (p0, p1, y0, y1) => parts.push({ geom: G.sideGeometry([p0, p1], y0, y1, 1 / 24, 1 / 12, false), mat: brick });
  const cornice = (poly, yTop, band = 2.5) => {   // 석회석 코니스 띠(0.7' 돌출) + 평지붕 슬래브
    const e = G.extrudePoly(G.offsetPoly(poly, -0.7), [], band, { y0: yTop - band });
    parts.push({ geom: e.sides, mat: stone }); parts.push({ geom: e.top, mat: stone });
    parts.push({ geom: G.flatRoof(poly, yTop - band, { parapet: 0, thick: 0.6 }).slab, mat: M.roof_membrane });
  };

  // ---- 본체 3층부 (x 28.5..190, z 66.4..142.7) + 남측 증축 지붕 (z..150)
  const main3 = [[28.5, 142.7], [190, 142.7], [190, 66.4], [28.5, 66.4]];
  const roof3 = [[28.5, 142.7], [69.8, 142.7], [69.8, 150], [150, 150], [150, 142.7], [190, 142.7], [190, 66.4], [28.5, 66.4]];
  const bands = [[0, F2, 7.5, 2.5], [F2, F3, 7.0, 2.5], [F3, H3, 5.0, 3.5]];   // [y0, y1, 창높이, 창대]
  for (const [y0, y1, wh, sill] of bands) {
    win([28.5, 142.7], [69.8, 142.7], { y0, rows: 1, rowH: y1 - y0, cols: 4, winW: 4.5, winH: wh, sill, margin: 8 });   // 남면 서측
    win([150, 142.7], [190, 142.7], { y0, rows: 1, rowH: y1 - y0, cols: 4, winW: 4.5, winH: wh, sill, margin: 7 });     // 남면 동측
    win([190, 142.7], [190, 66.4], { y0, rows: 1, rowH: y1 - y0, cols: 8, winW: 4.5, winH: wh, sill, margin: 4 });      // 동면
    win([28.5, 66.4], [28.5, 142.7], { y0, rows: 1, rowH: y1 - y0, cols: 8, winW: 4.5, winH: wh, sill, margin: 4 });    // 서면
  }
  // 북면: 3층 띠는 전체 길이(날개 지붕 위로 노출), 1·2층은 계단실 베이 사이 로비 면만 노출
  win([190, 66.4], [28.5, 66.4], { y0: F3, rows: 1, rowH: H3 - F3, cols: 11, winW: 5.5, winH: 5, sill: 3.5, margin: 8 });
  win([148.7, 66.4], [70.8, 66.4], { y0: 0, rows: 1, rowH: F2, cols: 5, winW: 6, winH: 8, sill: 2.5, margin: 1 });
  win([148.7, 66.4], [70.8, 66.4], { y0: F2, rows: 1, rowH: F3 - F2, cols: 5, winW: 6, winH: 7.5, sill: 2.5, margin: 1 });
  for (const x of [85.8, 101.8, 117.8, 133.8]) parts.push({ geom: G.box(3.5, 26, 1.0, x, F2, 66.2), mat: stone });   // 2층 높이 필라스터
  parts.push({ geom: G.box(9, 10.5, 0.8, 109.8, 0, 66.1), mat: stone });                                             // 역사 입구 162 석재 틀
  parts.push({ geom: G.box(7, 9, 0.4, 109.8, 0, 65.9), mat: M.dark, cast: false });
  wall([69.8, 142.7], [69.8, 150], 0, H3);                                                                           // 증축 서면(타워 뒤)
  cornice(roof3, H3);

  // ---- 2018 남측 증축: 알루미늄 커튼월 (x 86.7..150, z=150) + 동면, 입구 캐노피
  parts.push({ geom: G.sideGeometry([[86.7, 150], [150, 150], [150, 142.7]], 0, F4, 1 / 24, 1 / 12, false), mat: M.glass, cast: false });
  parts.push({ geom: G.box(63.3, 1.2, 0.6, 118.35, F2 - 0.6, 150.2), mat: M.dark });   // 2층 바닥 스팬드럴 띠
  parts.push({ geom: G.box(14, 0.8, 5, 142, 10.5, 152.6), mat: M.dark });              // 입구 캐노피 (vestibule 167)
  // 신설 엘리베이터 타워 (석회석 베니어), 그리드 9–8
  parts.push({ geom: G.box(16.9, HT, 14, 78.25, 0, 143), mat: stone });
  parts.push({ geom: G.box(17.5, 0.6, 14.6, 78.25, HT, 143), mat: M.metal });

  // ---- 북측 2층 날개 (서: x 15.4..70.8, 동: x 148.7..203.1; z 35.2..68.1)
  const wingW = [[15.4, 68.1], [70.8, 68.1], [70.8, 35.2], [15.4, 35.2]];
  const wingE = [[148.7, 68.1], [203.1, 68.1], [203.1, 35.2], [148.7, 35.2]];
  const wb = [[0, F2, 7.5, 2.5], [F2, F3, 7.0, 2.5]];
  for (const [y0, y1, wh, sill] of wb) {
    win([55.9, 35.2], [15.4, 35.2], { y0, rows: 1, rowH: y1 - y0, cols: 3, winW: 5.5, winH: wh, sill, margin: 4 });     // 서날개 북면
    win([203.1, 35.2], [163.5, 35.2], { y0, rows: 1, rowH: y1 - y0, cols: 3, winW: 5.5, winH: wh, sill, margin: 4 });   // 동날개 북면
    win([15.4, 68.1], [28.5, 68.1], { y0, rows: 1, rowH: y1 - y0, cols: 1, winW: 5, winH: wh, sill });                   // 날개 끝 남면
    win([190, 68.1], [203.1, 68.1], { y0, rows: 1, rowH: y1 - y0, cols: 1, winW: 5, winH: wh, sill });
    win([70.8, 66.4], [70.8, 35.2], { y0, rows: 1, rowH: y1 - y0, cols: 2, winW: 5, winH: wh, sill, margin: 4 });        // 플라자 쪽 계단실 면
    win([148.7, 35.2], [148.7, 66.4], { y0, rows: 1, rowH: y1 - y0, cols: 2, winW: 5, winH: wh, sill, margin: 4 });
  }
  // 계단실 베이 북면: 2층 높이 세로 창
  win([70.8, 35.2], [55.9, 35.2], { y0: 0, rows: 1, rowH: F3, cols: 1, winW: 3.5, winH: 20, sill: 3 });
  win([163.5, 35.2], [148.7, 35.2], { y0: 0, rows: 1, rowH: F3, cols: 1, winW: 3.5, winH: 20, sill: 3 });
  // 날개 끝면(동·서): 창 없음 + 석회석 필라스터 2개, 플라자 출입구(163/161)
  wall([15.4, 35.2], [15.4, 68.1], 0, F3); wall([203.1, 68.1], [203.1, 35.2], 0, F3);
  for (const z of [41.4, 61.5]) { parts.push({ geom: G.box(1.0, 26, 3.5, 15.2, 1, z), mat: stone }); parts.push({ geom: G.box(1.0, 26, 3.5, 203.3, 1, z), mat: stone }); }
  for (const x of [70.9, 148.6]) { parts.push({ geom: G.box(0.8, 9.5, 8, x, 0, 50.8), mat: stone }); parts.push({ geom: G.box(0.4, 8.5, 6, x + (x < 100 ? 0.3 : -0.3), 0, 50.8), mat: M.dark, cast: false }); }
  for (const w of [wingW, wingE]) { parts.push({ geom: G.sideGeometry(w, F3, HW, 1 / 24, 1 / 12, true), mat: brick }); cornice(w, HW); }
  // 플라자 (계단실 사이 북측 테라스)
  parts.push({ geom: G.capGeometry([[70.8, 66.4], [148.7, 66.4], [148.7, 48], [70.8, 48]], [], 0.3), mat: M.walk, cast: false });

  // ---- 4층 블록 (x 68.4..151, z 66.4..130.3) + 석회석 코니스 + 모임지붕
  const blk4 = [[68.4, 130.3], [151, 130.3], [151, 66.4], [68.4, 66.4]];
  win([151, 66.4], [68.4, 66.4], { y0: F4, rows: 1, rowH: H4 - F4, cols: 5, winW: 4.5, winH: 5, sill: 3.5, margin: 3 });
  win([68.4, 130.3], [151, 130.3], { y0: F4, rows: 1, rowH: H4 - F4, cols: 7, winW: 4.5, winH: 4.5, sill: 3.5, margin: 8 });
  win([151, 130.3], [151, 66.4], { y0: F4, rows: 1, rowH: H4 - F4, cols: 4, winW: 4.5, winH: 5, sill: 3.5, margin: 6 });
  win([68.4, 66.4], [68.4, 130.3], { y0: F4, rows: 1, rowH: H4 - F4, cols: 4, winW: 4.5, winH: 5, sill: 3.5, margin: 6 });
  { const e = G.extrudePoly(G.offsetPoly(blk4, -0.8), [], 2.5, { y0: H4 - 2.5 }); parts.push({ geom: e.sides, mat: stone }); parts.push({ geom: e.top, mat: stone }); }
  parts.push({ geom: hipRoof(67.6, 151.8, 65.6, 131.1, H4, RISE), mat: M.roof_dark });

  // ---- 석회석 기단 (지면 ~ 2.5 ft)
  parts.push({ geom: G.sideGeometry(G.offsetPoly(outline, -0.15), -1.5, 2.5, 1 / 24, 1 / 12, true), mat: stone });

  const grp = new THREE.Group();
  for (const m of G.mergeByMaterial(parts)) grp.add(m);
  return grp;
}

/** 모임지붕 (용마루 x 방향): x0..x1 × z0..z1 처마 높이 yE, 용마루 높이 yE+rise. 모든 면 법선 위쪽. */
function hipRoof(x0, x1, z0, z1, yE, rise) {
  const half = (z1 - z0) / 2, zm = (z0 + z1) / 2, yR = yE + rise, xr0 = x0 + half, xr1 = x1 - half;
  const faces = [
    [[x0, yE, z1], [x1, yE, z1], [xr1, yR, zm], [xr0, yR, zm]],   // 남
    [[x1, yE, z0], [x0, yE, z0], [xr0, yR, zm], [xr1, yR, zm]],   // 북
    [[x0, yE, z0], [x0, yE, z1], [xr0, yR, zm]],                  // 서
    [[x1, yE, z1], [x1, yE, z0], [xr1, yR, zm]],                  // 동
  ];
  const pos = [], uv = [];
  for (const f of faces) {
    const a = new THREE.Vector3(...f[0]), b = new THREE.Vector3(...f[1]), c = new THREE.Vector3(...f[2]);
    const n = new THREE.Vector3().subVectors(b, a).cross(new THREE.Vector3().subVectors(c, a));
    const q = n.y < 0 ? [...f].reverse() : f;
    const tris = q.length === 4 ? [[q[0], q[1], q[2]], [q[0], q[2], q[3]]] : [q];
    for (const t of tris) for (const p of t) { pos.push(...p); uv.push(p[0] / 24, p[2] / 24); }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.computeVertexNormals();
  return g;
}
