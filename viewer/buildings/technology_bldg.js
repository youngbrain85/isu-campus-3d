// Technology Building (Bailey College of Engineering & Technology, Walter Scholer 1983)
// → 2024–2027 RATIO 리노베이션 "Center for Technology, Engineering and Design" (cTED) 2025 완성 형태로 모델링
// 치수 근거 (cTED Architectural set, 1/8" = 1'-0", 벡터 PDF 텍스트에서 그리드 좌표 추출):
//   A-101 1층 평면: 기존동 그리드 E1(=1)…E15 = 228'-0" (E-W), EM…EA = 136'-1" (N-S); E13 = 170', EF = 58' (NE 외부 모서리),
//     E10/E11 = 136'~138' (고베이 서측 경계); 북측 증축 그리드 2…6 = 3 × 33'-0" = 99', 전체 103'-8" (외벽 2'-4" 돌출),
//     H…E = 22'+22'+20'-6" (북측 외벽 = H + 2'-5½"); SW 신축 로비 그리드 1…3 = 34', 행 D(39')…A(131')
//   A-201/A-202 입면: FIRST 100'-0" (=0), FIRST N 98'-0", FIRST SW 95'-0", SECOND 114'-8", THIRD(기존 지붕) 129'-4",
//     ROOF 137'-4⅝", PENT. ROOF 144'-8", MT-SECOND(브리지 바닥) 117'-4⅜"; 기존 벽돌 파라펫 ≈ 131'-8", 고베이 벽돌 ≈ 125', 금속 밴드 ≈ 130'
//     기존 남·서면 슬롯창 3'-6" × 26' @ 17' 피치, 증축 북면 1층 창 4' × 10' @ ~10' 피치, 상부 커튼월 3 베이
//   A-103 지붕 평면: 기계 펜트하우스 E5-3'…E8+1.5' × EM…EH+1' (48'…103.5' × -1'…36'), 증축 F…E 구간 덕트 인클로저
//   A-301 단면: 지하층 85'-4" (지하 → 생략), 증축 2층 워크숍 천장고 ≈ 22'-8"
// 로컬 프레임: 평면 기준 x = 오른쪽(= 동), z = 아래(= 남). 원점 = 기존동 북서 모서리(E1/EM). 평면 위 = 북 → rotation ≈ 0.
// 증축(addition) 부분: 북측 증축동(x 17..119, z -74.5..0), SW 로비(x 0..35, z 39..131), 펜트하우스, 고베이 금속 밴드, 동측 브리지 재마감.
import * as THREE from 'three';

export const meta = {
  id: 'tech', name: 'Technology Building (cTED, 2025 renovation)', osm: 'way/461428305',
  anchor: [29.58, 1093.19], rotation: -0.025,   // tools/fit_footprint.py (RMS 1.41 ft)
  height: 37.4,
  preset: { pos: [-190, 115, 1415], tgt: [120, 10, 1150] },
  sheets: 'cTED A-100, A-101, A-102, A-103, A-201, A-202, A-301, AD-101',
};

// 기존동 외곽 (OSM 피팅용): 본동 + 고베이 + 동측 브리지(MT 연결)
export const outline = [[0, 0], [0, 68], [35, 68], [35, 136], [228, 136], [228, 68], [270.5, 41.5], [270.5, 31], [228, 57], [228, 58], [173, 58], [173, 0]];

const L2 = 14.67, RF_EX = 29.33, PAR_EX = 31.7;      // 2층 바닥, 기존 지붕(THIRD), 기존 파라펫
const HB_BRICK = 25, HB_TOP = 30;                    // 고베이 벽돌 상단, 금속 밴드 상단
const RF_ADD = 37.4, RF_PENT = 44.67;                // 증축 지붕, 펜트하우스 지붕
const SLOT = { rows: 1, rowH: PAR_EX, winW: 3.5, winH: 26, sill: 2.8 };   // 기존 슬롯창

export function build(M, G) {
  const parts = [];
  const brick = M.brick_brown, metal = M.metal;
  const P = (geom, mat, cast) => parts.push({ geom, mat, cast });
  const win = (p0, p1, opt, wallMat = brick) => { const w = G.windowGrid(p0, p1, opt); P(w.wall, wallMat); if (w.glass) P(w.glass, M.pane, false); };
  const roof = (poly, y, parapet, mat = M.roof_membrane, pmat = metal) => { const r = G.flatRoof(poly, y, { parapet, thick: 0.6 }); P(r.slab, mat); if (r.parapet) P(r.parapet, pmat); };
  const soffit = (poly, y) => P(G.capGeometry([...poly].reverse(), [], y), metal, false);

  // ===== 기존 본동 (벽돌, 2층, 지붕 129'-4") =====
  win([0, 0], [0, 39], { ...SLOT, cols: 4, margin: 3 });                           // 서면 EM..EG (4 슬롯창)
  win([35, 136], [136.5, 136], { ...SLOT, cols: 7, margin: 1.5 });                 // 남면 E4..E10 (7 슬롯창)
  P(G.sideGeometry([[136.5, 136], [136.5, 58]], HB_BRICK - 1, PAR_EX, 1 / 24, 1 / 12, false), brick);   // 고베이 위로 노출되는 동측 벽
  win([173, 58], [173, 0], { rows: 1, rowH: PAR_EX, cols: 3, winW: 4, winH: 6, sill: 3.5, margin: 6 }); // 북부 동면 (E13)
  P(G.sideGeometry([[173, 0], [119, 0]], 0, PAR_EX, 1 / 24, 1 / 12, false), brick);  // 북면 (증축 동측)
  P(G.sideGeometry([[17, 0], [0, 0]], 0, PAR_EX, 1 / 24, 1 / 12, false), brick);     // 북면 (증축 서측)
  roof([[0, 0], [0, 39], [35, 39], [35, 136], [136.5, 136], [136.5, 58], [173, 58], [173, 0]], RF_EX, PAR_EX - RF_EX, M.roof_gravel, brick);

  // ===== 기존 고베이 (자동차 실습동, x 136.5..228, z 58..136): 벽돌 25' + 금속 패널 밴드 (증축 마감) =====
  const hb = [[136.5, 58], [136.5, 136], [228, 136], [228, 58]];
  win([136.5, 136], [228, 136], { rows: 1, rowH: HB_BRICK, cols: 3, winW: 4, winH: 4, sill: 8, margin: 20 });   // 남면
  win([228, 136], [228, 58], { rows: 1, rowH: HB_BRICK, cols: 5, winW: 12, winH: 13, sill: 0.3, margin: 4 });   // 동면 전면유리 오버헤드도어 5개
  win([228, 58], [173, 58], { rows: 1, rowH: HB_BRICK, cols: 2, winW: 4, winH: 6, sill: 3.5, margin: 8 });      // 북면 (EF)
  P(G.sideGeometry(hb, HB_BRICK, HB_TOP, 1 / 24, 1 / 12, true), metal);                                       // 금속 패널 파라펫 밴드
  roof(hb, HB_BRICK + 1, 0);

  // ===== [증축] 북측 증축동 (그리드 2..6 × H..E) =====
  // 1층 기저: 벽돌 + 세로창, FIRST N = -2' (경사지)
  const bz0 = -71.5, bz1 = -25, bx0 = 17, bx1 = 119;
  win([bx1, bz0], [bx0, bz0], { y0: -2, rows: 1, rowH: L2 + 2, cols: 10, winW: 4, winH: 10, sill: 2.5, margin: 4 });   // 북면 10창
  win([bx0, bz0], [bx0, bz1], { y0: -2, rows: 1, rowH: L2 + 2, cols: 4, winW: 4, winH: 10, sill: 2.5, margin: 4 });    // 서면
  win([bx1, bz1], [bx1, bz0], { y0: -2, rows: 1, rowH: L2 + 2, cols: 4, winW: 4, winH: 10, sill: 2.5, margin: 4 });    // 동면
  // 상부 볼륨 (SECOND..ROOF): 알루미늄 복합패널 + 구조 실란트 커튼월, 기저보다 2'-4"/3' 돌출(소핏)
  const up = [[16.2, -74.5], [16.2, -25], [119.8, -25], [119.8, -74.5]];
  const CW = { y0: L2, rows: 1, rowH: RF_ADD - L2, winH: 17, sill: 3, inset: 0.4 };
  win([119.8, -74.5], [16.2, -74.5], { ...CW, cols: 3, winW: 26, margin: 6 }, metal);   // 북면 3 베이
  win([16.2, -74.5], [16.2, -25], { ...CW, cols: 2, winW: 16, margin: 5 }, metal);      // 서면 2 베이
  win([119.8, -25], [119.8, -74.5], { ...CW, cols: 2, winW: 16, margin: 5 }, metal);    // 동면 2 베이
  P(G.sideGeometry([[16.2, -25], [119.8, -25]], 28.3, RF_ADD, 1 / 24, 1 / 12, false), metal);   // 남면 (F..E 구간 지붕 위 노출부)
  soffit(up, L2);
  roof(up, RF_ADD, 1.0);
  // F..E 구간 (계단·덕트 존): 금속 패널, 지붕 128'-4" + 덕트 인클로저 135'
  P(G.sideGeometry([[17, -25], [17, 0]], 0, 28.3, 1 / 24, 1 / 12, false), metal);
  P(G.sideGeometry([[119, 0], [119, -25]], 0, 28.3, 1 / 24, 1 / 12, false), metal);
  roof([[17, -25], [17, 0], [119, 0], [119, -25]], 28.3, 0.5);
  P(G.box(92, 6.7, 17, 68, 28.3, -13.5), metal);                                 // 지붕 덕트 인클로저
  // 기계 펜트하우스 (기존 지붕 위, E5..E8 × EM..EH)
  P(G.box(55.5, RF_PENT - RF_EX, 37, 75.75, RF_EX, 17.5), metal);
  P(G.capGeometry([[48, -1], [48, 36], [103.5, 36], [103.5, -1]], [], RF_PENT + 0.01), M.roof_membrane);

  // ===== [증축] SW 로비 (그리드 1..3 × D..A): 기저 커튼월/석재, 상부 금속패널 + 수직 핀 커튼월 =====
  const lx0 = 0, lx1 = 35, lz0 = 39, lz1 = 131;
  P(G.sideGeometry([[lx0, lz0], [lx0, lz1], [lx1, lz1]], -5, L2, 1 / 24, 1 / 12, false), M.glass);   // 서·남면 기저 (FIRST SW = 95')
  P(G.box(5, 0.8, 30, -2.5, 11, 54), M.dark);                                                        // 출입구 캐노피 (서측, EG..EE)
  const lup = [[-2, lz0], [-2, 133.5], [37.5, 133.5], [37.5, lz0]];
  win([-2, lz0], [-2, 133.5], { ...CW, cols: 3, winW: 22, margin: 5 }, metal);     // 서면 3 베이
  win([-2, 133.5], [37.5, 133.5], { ...CW, cols: 1, winW: 26, margin: 5 }, metal);  // 남면
  P(G.sideGeometry([[37.5, 133.5], [37.5, lz0], [-2, lz0]], RF_EX, RF_ADD, 1 / 24, 1 / 12, false), metal);   // 동·북면 (기존 지붕 위 노출)
  P(G.sideGeometry([[37.5, 133.5], [37.5, 131]], L2, RF_EX, 1 / 24, 1 / 12, false), metal);
  soffit(lup, L2);
  roof(lup, RF_ADD, 1.0);

  // ===== 동측 연결 브리지 (MT 2층 117'-4" ↔ 고베이), 유리 + 금속 파시아 =====
  const b0 = [228, 63], b1 = [270.5, 36.5];
  const bl = Math.hypot(b1[0] - b0[0], b1[1] - b0[1]), ry = -Math.atan2(b1[1] - b0[1], b1[0] - b0[0]);
  const bc = [(b0[0] + b1[0]) / 2, (b0[1] + b1[1]) / 2];
  P(G.box(bl + 2, 1.2, 10, bc[0], 17.4, bc[1], { ry }), metal);                  // 바닥 슬래브
  P(G.box(bl + 2, 9.4, 9.6, bc[0], 18.6, bc[1], { ry }), M.glass, false);        // 유리 벽
  P(G.box(bl + 2, 2.0, 10, bc[0], 28, bc[1], { ry }), metal);                    // 파시아/지붕
  P(G.box(1.5, 17.4, 1.5, b1[0] - 4, 0, b1[1] + 2, { ry }), M.concrete);         // 기둥

  const grp = new THREE.Group();
  for (const m of G.mergeByMaterial(parts)) grp.add(m);
  return grp;
}
