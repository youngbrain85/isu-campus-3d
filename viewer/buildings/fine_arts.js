// Fine Arts Building, 649 Chestnut St — Miller & Yeager, 1940 (PWA) / arcDESIGN 2018 리노베이션 (project 17180, bid set)
// 치수 근거 (17180 - ISU FineArts - BID SET Volume 1.pdf, 1/8" = 1'-0" 평면·입면, 3/16" 단면). 벡터 텍스트·사각형 좌표를 /9 로 ft 환산.
//   A111 Dimension Plan – First Floor (p58): 그리드 1..12 = 190.0 .. 29.5 ft, 1x = 203.1, 12x = 16.4 (= 날개 끝면), 베이 16'(4–9) / 13'-5"(9–12, 1–2)
//     외벽 외면: 북측 날개 북면 z=35.2 (계단실 베이 x 148.7..163.5 / 55.9..70.8 는 z=34.3 로 0.9' 돌출, 그 안에 활꼴 석재 패널 z=33.7),
//     날개 외측 x=16.4 / 203.1, 날개 남면 z=68.1, 본체 x=28.5..190, 본체 북면(역사 로비 면) z=66.4, 본체 남면 z=142.7
//     2018 남측 증축 커튼월 남면 z=150, x 81.4..149.7; 엘리베이터 타워 x 69.8..86.5 (그리드 9–8), z 130.3..149.2
//   A114 Fourth Floor (p61) / A160 Roof Plan (p82): 4층 블록 x 68.4..151 (그리드 9–4), z 66.4..130.3 (F–B); 4층 위 모임지붕(합성 슬레이트) 3½"/12,
//     용마루 동서; 날개·3층·증축 지붕은 평지붕(MB-1/MB-2). 증축 지붕 ≈39.8' (커튼월 상단), 4층 블록 남벽은 그리드 B 로 세트백.
//   A201 Plaza North / Plaza East·West (p83), A202 South (p84), A203 West·East (p85) 입면:
//     레벨 FIRST 0', SECOND 13', THIRD 26', FOURTH 39', ROOF BEARING 51', ROOF 53'
//     석회석 기단 -1.5..2.6 / 3층부 코니스 40.45..41.6 (0.7' 돌출) + 벽돌 난간 41.6..42.8 + 금속 코핑 43.4
//     날개 코니스 29.2..30.4 + 코핑 31.0 / 4층 코니스 띠 50.1..51.0 + 처마 코니스(홈통 일체) 51..53, 처마 53', 용마루 ≈62.5'
//     엘리베이터 타워 상단 54.85 + 코핑 55.5 (석회석 베니어 남면·서면 z 142.4..149.2, 그 북측은 41.2' 위로 벽돌)
//   A302 Building Section (p87): 지하층(lower level) 전체 지하 → 모델 생략, 1층 = y 0. 증축 3층 지붕 ≈40', 4층 벽은 B 에서 상승.
//
// 입면 창 배치 (벡터 사각형 좌표, ft; 모든 창은 중앙 멀리언 2분할 + 상부 트랜섬):
//   창 높이 스택: 1F 2.55..10.94 (트랜섬 8.96) / 2F 16.67..24.17 (22.19) / 3F 본체 29.63..35.62 (33.6) / 3F 날개 위 31.01..35.62 / 4F 42.92..46.93
//   북면 날개 (z=35.2, 6.0' 창 3베이, 양옆 0.36' 석재 세로 띠 2.6..24.17, 1F–2F 사이 스팬드럴 리세스 10.94..16.67 + 1.3' 사각 장식 13.2..15.0):
//     동날개 중심 x = 194.1, 183.3, 172.5 / 서날개 47.0, 36.2, 25.5 (건물은 x=109.77 기준 좌우대칭)
//     계단실 베이: 활꼴 석재 플루트 패널 x 153.7..158.5 (서 61.0..65.8), 9.4..25.5 (그리스 키 상단 24.5..25.5); 역사 바닥 랜턴 (156.1, 30.3)/(63.4, 30.3)
//   날개 남면 (z=68.1): 4.5' 창 1베이, 중심 x = 22.2 / 197.3
//   날개 플라자 면 (x=70.8 / 148.7, z 34.3..66.4): 창 베이 z=44.0 (6' 1F+2F 스택), 출입구 베이 z=59.4 (2F 창 + 랜턴 스팬드럴 + 문 161/163 5'×7' + 그릴 트랜섬 7..11.1)
//   로비 면 (z=66.4, x 70.8..148.7): 6' 창 5베이 중심 141.7, 125.8, 109.8, 93.8, 77.8; 가운데 베이 1F 는 역사 출입구 162 (문 3.5'×6.85', 석재 틀 5.5'×11')
//     리세스 10.94..29.42 (2F 창 포함, 사각 장식 13.2..15.0 / 26.2..28.0), 3F 창 29.63..35.62, 띠 2.6..35.62
//     플루트 석회석 필라스터 4개 x = 133.8, 117.8, 101.8, 85.8 (폭 3.9, 2.6..36.9, 주두 35.2..36.9)
//   로비 면 날개 위 3F 창 (z=66.4): 4.5' 창 31.01..35.62, 중심 x = 183.3, 169.9, 156.4 / 63.1, 49.6, 36.2
//   본체 동·서면 (x=190 / 28.5): 4.5' 창 8베이 z 중심 74.9, 83.3, 91.6, 99.9, 108.2, 116.6, 124.9, 133.2 (피치 8.33), 리세스 2.6..16.56;
//     1F 창은 동면 8개 전부, 서면은 북측 5개만 (z ≤ 108.2)
//   본체 남면 (z=142.7): 서측 4베이 중심 39.4, 46.3, 53.1, 60.0 / 동측 159.6, 166.5, 173.4, 180.2 (피치 6.87), 4.5' 창 3개 층 스택
//   4층 블록: 북면 4.5' 창 5개 (x = 141.8, 125.8, 109.8, 93.8, 77.8, 창 위 석재 패널 46.9..48.9), 남면 7개 (91.1 + 8k), 서면 4개 z 73.3, 82.8, 92.3, 104.1
//     + 폐쇄 루버 z 120.4..124.9, 동면 4개 z 74.8, 87.3, 99.7, 120.7
//   커튼월 (z=150, x 81.4..149.7, 1.5..39.8): 8' 베이 = 2' 금속 기둥커버(92.9+8k) + 6' 유리; 수평: 1.5..3.9 베이스, 3.9..10.5 / 16.8..23.4 / 29.8..36.4 비전글라스,
//     14.1..16.6 / 27.1..29.6 스팬드럴 글라스, 나머지 금속 스팬드럴; 1F 서측 80.8..92.7 금속 패널, 2F·3F 85.1..94.7 루버; 동측 1F 135..149.6 석회석 + 출입구 167
//     (문 D2a 6'×7.5', 캐노피 10.7', "FINE ARTS"); 커튼월은 동면(x=150, z 143.2..150) 으로 10.7..39.8 회전
// 로컬 프레임: 평면도 기준 x = 오른쪽(= 동), z = 아래(= 남). 북쪽 화살표 = 평면 위 → rotation ≈ 0.
import * as THREE from 'three';

export const meta = {
  id: 'finearts', name: 'Fine Arts Building', osm: 'way/545265789',
  anchor: [432.36, 192.32], rotation: -0.391,   // tools/fit_footprint.py 결과 (RMS 2.2 ft)
  height: 62,
  preset: { pos: [582, 190, 684], tgt: [541, 10, 284] },
  sheets: 'FineArts 17180 bid set: A111, A114, A160, A201, A202, A203, A302',
};

// ---- 레벨·높이 (ft)
const BASE = 2.6;                              // 석회석 기단 상단
const H3W = 40.45, H3C = 41.6, H3P = 42.8, H3 = 43.4;   // 3층부: 벽 상단 / 코니스 상단 / 난간 벽돌 상단 / 코핑 상단
const HWW = 29.2, HWC = 30.4, HW = 31.0;       // 날개: 벽 상단 / 코니스 상단 / 코핑 상단
const H4W = 50.08, H4C = 51.0, ROOF = 53.0;    // 4층: 벽 상단 / 코니스 띠 상단 / 처마
const HADD = 39.8;                             // 증축 지붕(커튼월 상단)
const HT = 54.85;                              // 엘리베이터 타워 상단
const PITCH = 3.5 / 12;
const CX = 109.77;                             // 좌우 대칭축
const mir = x => 2 * CX - x;

// 창 스택 (b, t, 트랜섬)
const W1 = [2.55, 10.94, 8.96], W2 = [16.67, 24.17, 22.19], W3 = [29.63, 35.62, 33.6], W3W = [31.01, 35.62, 33.6], W4 = [42.92, 46.93, 0];

// 바닥 외곽선 (반시계, 평면 기준): 본체 + 남측 증축 + 북측 날개 2개 — 부지 모델(지면 절취)이 쓰므로 그대로 둔다
export const outline = [
  [28.5, 142.7], [69.8, 142.7], [69.8, 150], [150, 150], [150, 142.7], [190, 142.7],
  [190, 68.1], [203.1, 68.1], [203.1, 35.2], [148.7, 35.2], [148.7, 66.4], [70.8, 66.4], [70.8, 35.2],
  [15.4, 35.2], [15.4, 68.1], [28.5, 68.1],
];
// 기단용 외피 (계단실 베이 0.9' 돌출 포함, 서날개 끝 16.4)
const shell = [
  [28.5, 142.7], [69.8, 142.7], [69.8, 150], [150, 150], [150, 142.7], [190, 142.7],
  [190, 68.1], [203.1, 68.1], [203.1, 35.2], [163.5, 35.2], [163.5, 34.3], [148.7, 34.3], [148.7, 66.4],
  [70.8, 66.4], [70.8, 34.3], [55.9, 34.3], [55.9, 35.2], [16.4, 35.2], [16.4, 68.1], [28.5, 68.1],
];

export function build(M, G) {
  const parts = [];
  const brick = M.brick_red, stone = M.limestone;
  const P = (geom, mat, cast = true) => parts.push({ geom, mat, cast });
  const wall = (p0, p1, y0, y1, mat = brick) => new Wall(G, M, parts, p0, p1, y0, y1, mat);
  /** 벽 선분 바깥으로 돌출한 띠 (코니스·코핑). d0..d1 = 벽면 기준 깊이(바깥 +). 모서리가 닫히도록 양끝을 d1 만큼 연장 */
  const band = (p0, p1, y0, y1, d0, d1, mat, ext = d1) => {
    const dx = p1[0] - p0[0], dz = p1[1] - p0[1], len = Math.hypot(dx, dz), ex = [dx / len, dz / len], ez = [-dz / len, dx / len];
    const sm = len / 2, dm = (d0 + d1) / 2;
    P(G.box(len + 2 * ext, y1 - y0, d1 - d0, p0[0] + ex[0] * sm + ez[0] * dm, y0, p0[1] + ex[1] * sm + ez[1] * dm, { ry: -Math.atan2(dz, dx) }), mat);
  };
  /** 3층부 난간: 코니스 + 벽돌 난간 + 금속 코핑 */
  const parapet3 = (p0, p1) => {
    band(p0, p1, H3W, H3C, -1.0, 0.7, stone);
    band(p0, p1, H3C, H3P, -1.0, 0.05, brick, 0.05);
    band(p0, p1, H3P, H3, -1.1, 0.3, M.trim);
  };
  const parapetW = (p0, p1) => { band(p0, p1, HWW, HWC, -1.0, 0.7, stone); band(p0, p1, HWC, HW, -1.0, 0.3, M.trim); };

  // ======================================================================
  // 본체 3층부 (x 28.5..190, z 66.4..142.7)
  // ======================================================================
  // ---- 북면 (로비 면 + 날개 위 3층): CCW 진행은 동→서
  {
    const w = wall([190, 66.4], [28.5, 66.4], BASE, H3W);
    for (const x of [183.3, 169.9, 156.4]) { w.win(x, 4.49, W3W); w.win(mir(x), 4.49, W3W); }
    const bays = [141.74, 125.76, 109.77, 93.77, 77.78];
    for (const x of bays) lobbyBay(w, x, Math.abs(x - CX) < 0.1);
    for (const x of [133.8, 117.8, 101.8, 85.8]) {                               // 플루트 필라스터 + 주두
      w.box(x - 1.95, x + 1.95, BASE, 35.2, 0, 0.8, stone);
      w.box(x - 2.25, x + 2.25, 35.2, 36.9, 0, 1.0, stone);
      w.box(x - 2.2, x + 2.2, BASE, BASE + 0.6, 0, 0.9, stone);
    }
    w.finish();
  }
  // ---- 서면 (x=28.5): 북→남. 1F 창은 북측 5베이만
  {
    const w = wall([28.5, 66.4], [28.5, 142.7], BASE, H3W);
    const zs = [74.9, 83.26, 91.58, 99.91, 108.23, 116.56, 124.9, 133.22];
    zs.forEach((z, i) => sideBay(w, z, i < 5));
    w.box(140.7, 142.7, BASE, H3W, 0, 0.5, brick);                                   // 모서리 피어
    w.finish();
  }
  // ---- 동면 (x=190): 남→북
  {
    const w = wall([190, 142.7], [190, 66.4], BASE, H3W);
    for (const z of [74.9, 83.26, 91.58, 99.91, 108.23, 116.56, 124.9, 133.22]) sideBay(w, z, true);
    w.box(140.7, 142.7, BASE, H3W, 0, 0.5, brick);
    w.finish();
  }
  // ---- 남면 (z=142.7): 서측 x 28.5..69.8, 동측 150..190 (가운데는 증축 뒤)
  {
    const w = wall([28.5, 142.7], [69.8, 142.7], BASE, H3W);
    for (const x of [39.35, 46.25, 53.1, 59.95]) sideBay(w, x, true);
    w.finish();
    const e = wall([150, 142.7], [190, 142.7], BASE, H3W);
    for (const x of [39.35, 46.25, 53.1, 59.95]) sideBay(e, mir(x), true);
    e.finish();
  }
  // ---- 3층 지붕 (증축 구간 x 69.8..150, z>130.3 제외) + 난간
  const roof3 = [[28.5, 142.7], [69.8, 142.7], [69.8, 130.3], [150, 130.3], [150, 142.7], [190, 142.7], [190, 66.4], [28.5, 66.4]];
  P(G.flatRoof(roof3, H3C - 0.6, { parapet: 0, thick: 0.6 }).slab, M.roof_membrane, false);
  parapet3([190, 66.4], [28.5, 66.4]); parapet3([28.5, 66.4], [28.5, 142.7]);
  parapet3([28.5, 142.7], [69.8, 142.7]); parapet3([150, 142.7], [190, 142.7]); parapet3([190, 142.7], [190, 66.4]);
  P(G.box(1.0, H3 - HADD, 12.4, 149.5, HADD, 136.5), brick);                      // 증축 지붕 ↔ 3층 지붕 단차 벽 (x=150, z 130.3..142.7)

  // ======================================================================
  // 북측 2층 날개 (동: x 148.7..203.1, 서: 16.4..70.8; z 35.2..68.1) — 서날개는 동날개를 x=109.77 기준 미러
  // ======================================================================
  for (const side of [1, -1]) {
    const X = x => side > 0 ? x : mir(x);
    // 북면 본 구간 (z=35.2, x 163.5..203.1)
    {
      const w = side > 0 ? wall([203.1, 35.2], [163.5, 35.2], BASE, HWW) : wall([X(163.5), 35.2], [X(203.1), 35.2], BASE, HWW);
      for (const x of [194.08, 183.3, 172.53]) wingBay(w, X(x), 6.0);
      w.finish();
    }
    // 계단실 베이 (z=34.3, x 148.7..163.5) + 측면 리턴 + 활꼴 석재 패널
    {
      const w = side > 0 ? wall([163.5, 34.3], [148.7, 34.3], BASE, HWW) : wall([X(148.7), 34.3], [X(163.5), 34.3], BASE, HWW);
      const c = X(156.1);
      w.box(c - 2.4, c + 2.4, 9.4, 24.5, 0, 0.6, stone);                           // 플루트 패널 (활꼴 → 박스)
      for (let i = -3; i <= 3; i++) w.box(c + i * 0.65 - 0.12, c + i * 0.65 + 0.12, 9.6, 24.3, 0.6, 0.72, M.trim);   // 플루트
      w.box(c - 2.6, c + 2.6, 24.5, 25.5, 0, 0.75, stone);                          // 그리스 키 상단
      w.box(c - 2.6, c + 2.6, 9.0, 9.4, 0, 0.75, stone);
      w.finish();
      P(G.box(0.1, HWW - BASE, 0.9, X(163.45), BASE, 34.75), brick);                   // 계단실 베이 측면 리턴 (0.9')
      lantern(G, M, parts, c, 30.3);
    }
    // 날개 끝면 (x=203.1 / 16.4): 창 없음, 플루트 필라스터 2개 + 모서리 피어
    {
      const w = side > 0 ? wall([203.1, 68.1], [203.1, 35.2], BASE, HWW) : wall([16.4, 35.2], [16.4, 68.1], BASE, HWW);
      for (const z of [41.15, 61.45]) {
        w.box(z - 1.35, z + 1.35, 1.5, 23.2, 0, 0.8, stone);
        w.box(z - 1.6, z + 1.6, 23.2, 25.5, 0, 1.0, stone);
        w.box(z - 1.6, z + 1.6, 1.5, 2.1, 0, 0.9, stone);
      }
      w.box(35.2, 37.2, BASE, HWW, 0, 0.5, brick); w.box(66.1, 68.1, BASE, HWW, 0, 0.5, brick);
      w.finish();
    }
    // 날개 남면 (z=68.1, x 190..203.1 / 16.4..28.5): 4.5' 창 1베이
    {
      const w = side > 0 ? wall([190, 68.1], [203.1, 68.1], BASE, HWW) : wall([16.4, 68.1], [28.5, 68.1], BASE, HWW);
      wingBay(w, X(197.3), 4.49);
      w.finish();
    }
    // 플라자 면 (x=148.7 서향 / x=70.8 동향; z 34.3..66.4)
    {
      const w = side > 0 ? wall([148.7, 34.3], [148.7, 66.4], BASE, HWW) : wall([70.8, 66.4], [70.8, 34.3], BASE, HWW);
      // 창 베이 z=44.0: 띠 + 1F 창 + 스팬드럴 리세스 + 2F 창
      wingBay(w, 44.0, 6.0);
      // 출입구 베이 z=59.4: 2F 창, 스팬드럴(랜턴) 리세스 11.1..16.6, 문 + 그릴 트랜섬
      w.strip(59.4 - 3.36, 59.4 + 3.36, BASE, 24.17);
      w.win(59.4, 6.0, W2);
      const r = w.recess(59.4 - 3.0, 59.4 + 3.0, 11.1, 16.6, 0.3); r.finish();
      w.hole(59.4 - 2.5, 59.4 + 2.5, 0, 11.1);
      w.box(59.4 - 2.5, 59.4 + 2.5, 0, 7.0, -0.6, -0.5, M.dark);                      // 문 161/163
      w.box(59.4 - 0.1, 59.4 + 0.1, 0, 7.0, -0.5, -0.4, M.trim);
      w.pane(59.4 - 2.5, 59.4 + 2.5, 7.1, 11.1, 0.5);                                 // 그릴 트랜섬
      for (let i = 0; i < 4; i++) w.box(59.4 - 2.5, 59.4 + 2.5, 7.1 + i * 1.0, 7.3 + i * 1.0, -0.45, -0.3, M.dark);
      w.box(59.4 - 2.6, 59.4 + 2.6, 7.0, 7.3, -0.5, 0.1, stone);
      w.box(59.4 - 2.9, 59.4 + 2.9, 11.1, 11.6, -0.5, 0.3, stone);
      w.finish();
    }
    // 날개 지붕 + 난간
    const wing = side > 0 ? [[148.7, 68.1], [203.1, 68.1], [203.1, 35.2], [163.5, 35.2], [163.5, 34.3], [148.7, 34.3]]
      : [[16.4, 68.1], [70.8, 68.1], [70.8, 34.3], [55.9, 34.3], [55.9, 35.2], [16.4, 35.2]];
    P(G.flatRoof(wing, HWC - 0.6, { parapet: 0, thick: 0.6 }).slab, M.roof_membrane, false);
    if (side > 0) {
      parapetW([203.1, 35.2], [163.5, 35.2]); parapetW([163.5, 34.3], [148.7, 34.3]); parapetW([203.1, 68.1], [203.1, 35.2]);
      parapetW([190, 68.1], [203.1, 68.1]); parapetW([148.7, 34.3], [148.7, 66.4]);
    } else {
      parapetW([55.9, 35.2], [16.4, 35.2]); parapetW([70.8, 34.3], [55.9, 34.3]); parapetW([16.4, 35.2], [16.4, 68.1]);
      parapetW([16.4, 68.1], [28.5, 68.1]); parapetW([70.8, 66.4], [70.8, 34.3]);
    }
  }
  // ---- 플라자 (계단실 사이 북측 테라스; 부지 지면은 y=0 평면이므로 0.3' 올린 포장 + 연석)
  P(G.capGeometry([[60, 66.4], [160, 66.4], [160, 28.5], [60, 28.5]], [], 0.3), M.walk, false);
  P(G.box(100, 0.3, 0.4, 110, 0, 28.7), M.curb); P(G.box(0.4, 0.3, 38, 60.2, 0, 47.5), M.curb); P(G.box(0.4, 0.3, 38, 159.8, 0, 47.5), M.curb);

  // ======================================================================
  // 4층 블록 (x 68.4..151, z 66.4..130.3) + 코니스 + 모임지붕
  // ======================================================================
  const blk4 = [[68.4, 130.3], [151, 130.3], [151, 66.4], [68.4, 66.4]];
  {
    const n = wall([151, 66.4], [68.4, 66.4], H3C - 0.6, H4W);
    for (const x of [141.75, 125.76, 109.76, 93.77, 77.79]) { n.win(x, 4.51, W4); n.box(x - 2.25, x + 2.25, 46.93, 48.9, 0, 0.15, stone); }
    n.finish();
    const s = wall([68.4, 130.3], [151, 130.3], HADD, H4W);
    for (let k = 0; k < 7; k++) s.win(91.09 + 8 * k, 4.51, W4);
    s.finish();
    const w = wall([68.4, 66.4], [68.4, 130.3], H3C - 0.6, H4W);
    for (const z of [73.3, 82.8, 92.3, 104.1]) w.win(z, 4.51, W4);
    w.hole(120.4, 124.9, 42.92, 48.9); w.pane(120.4, 124.9, 42.92, 48.9, 0.3, M.dark);     // 폐쇄 루버 (블랙 플레이트)
    w.finish();
    const e = wall([151, 130.3], [151, 66.4], H3C - 0.6, H4W);
    for (const z of [74.8, 87.3, 99.7, 120.7]) e.win(z, 4.51, W4);
    e.finish();
  }
  for (let i = 0; i < 4; i++) { band(blk4[i], blk4[(i + 1) % 4], H4W, H4C, 0, 0.5, stone); }
  { const e = G.extrudePoly(G.offsetPoly(blk4, -1.5), [], ROOF - H4C, { y0: H4C }); P(e.sides, stone); P(e.top, stone); }   // 처마 코니스(홈통 일체)
  P(hipRoof(68.4 - 1.6, 151 + 1.6, 66.4 - 1.6, 130.3 + 1.6, ROOF, (31.95 + 1.6) * PITCH), M.roof_dark);

  // ======================================================================
  // 2018 남측 증축: 커튼월 (z=150) + 동면 리턴 + 출입구 167 + 엘리베이터 타워
  // ======================================================================
  curtainWall(G, M, parts);
  // 증축 지붕 (MB-1) x 86.5..150, z 130.3..150 — 커튼월 상단 높이
  P(G.box(63.5, 0.6, 19.7, 118.25, HADD - 0.6, 140.15), M.roof_membrane, false);
  P(G.box(68.6, 0.6, 0.6, 115.9, HADD - 0.2, 150.0), M.metal);                              // 지붕 가장자리 금속 (17)
  // 엘리베이터 타워: 석회석 (x 69.8..81.4 × z 142.4..149.2, 전층) + 벽돌 (x 69.8..86.5 × z 130.3..142.4 / 81.4..86.5 × 142.4..149.2, 41.2' 위)
  P(G.box(11.6, HT + 1.5, 6.8, 75.6, -1.5, 145.8), stone);
  P(G.box(16.7, HT - 41.2, 11.8, 78.15, 41.2, 136.5), brick);
  P(G.box(5.1, HT - 41.2, 6.8, 83.95, 41.2, 145.8), brick);
  P(G.box(17.3, 0.6, 19.5, 78.15, HT, 139.75), M.metal);                                    // 금속 코핑 (17)
  P(G.box(0.3, 5.5, 3.5, 86.65, 43.0, 136.8), M.dark);                                      // 옥상 출입문 463B (동면)
  P(G.box(0.4, 10, 1.4, 86.7, 45, 131.2), M.metal);                                         // 알루미늄 사다리 (19)

  // ======================================================================
  // 석회석 기단 (지면 ~ 2.6 ft)
  // ======================================================================
  P(G.sideGeometry(G.offsetPoly(shell, -0.15), -1.5, BASE, 1 / 24, 1 / 12, true), stone);

  const grp = new THREE.Group();
  for (const m of G.mergeByMaterial(parts)) grp.add(m);
  return grp;

  // ---------------------------------------------------------------- 베이 타입
  /** 날개 창 베이 (북면·남면·플라자 면): 양옆 석재 세로 띠, 1F 창, 스팬드럴 리세스(사각 장식), 2F 창 */
  function wingBay(w, c, ww) {
    const h = ww / 2;
    w.strip(c - h - 0.36, c + h + 0.36, BASE, W2[1]);
    w.win(c, ww, W1);
    const r = w.recess(c - h, c + h, W1[1], W2[0], 0.3);
    r.box(c - 0.65, c + 0.65, 13.2, 15.0, 0, 0.1, stone);
    r.finish();
    w.win(c, ww, W2);
  }
  /** 로비 면 6' 베이: 띠 2.6..35.62, 1F 창(또는 역사 출입구 162), 리세스 10.94..29.42 (2F 창 + 사각 장식 2개), 3F 창 */
  function lobbyBay(w, c, door) {
    w.strip(c - 3.7, c + 3.7, BASE, W3[1]);
    if (door) {
      w.box(c - 2.75, c + 2.75, 0, 11.0, 0, 0.6, stone);                                   // 석재 틀
      w.box(c - 2.95, c + 2.95, 10.4, 11.0, 0, 0.8, stone);
      w.box(c - 1.75, c + 1.75, 0, 6.85, 0.6, 0.75, M.dark);                                // 문 162
      w.box(c - 0.08, c + 0.08, 0, 6.85, 0.75, 0.82, M.trim);
      w.box(c - 1.75, c + 1.75, 7.1, 10.1, 0.6, 0.7, M.pane);                                // 트랜섬 그릴
      w.box(c - 0.5, c + 0.5, 12.0, 14.0, 0, 0.5, M.dark);                                   // 벽 랜턴
    } else w.win(c, 6.0, W1);
    const r = w.recess(c - 3.0, c + 3.0, W1[1], 29.42, 0.3);
    r.win(c, 6.0, W2);
    r.box(c - 0.65, c + 0.65, 13.2, 15.0, 0, 0.1, stone);
    r.box(c - 0.6, c + 0.6, 26.2, 28.0, 0, 0.1, stone);
    r.finish();
    w.win(c, 6.0, W3);
  }
  /** 본체 측면·남면 4.5' 베이: 리세스 2.6..16.56 (1F 창 + 사각 장식), 2F 창, 3F 창 */
  function sideBay(w, c, has1F) {
    const r = w.recess(c - 2.245, c + 2.245, BASE, 16.56, 0.3);
    if (has1F) r.win(c, 4.49, W1, 0.25);
    r.box(c - 0.65, c + 0.65, 13.2, 15.0, 0, 0.1, stone);
    r.finish();
    w.win(c, 4.49, W2);
    w.win(c, 4.49, W3);
  }
}

/** 커튼월 (남면 z=150, x 81.4..149.7) + 동면 리턴 (x=150, z 143.2..150) + 출입구 167 + 서측 금속 패널/루버 */
function curtainWall(G, M, parts) {
  const P = (geom, mat, cast = true) => parts.push({ geom, mat, cast });
  const z = 150, zi = z - 0.45;
  const span = (x0, x1, y0, y1, mat, d = 0) => P(G.box(x1 - x0, y1 - y0, 0.25, (x0 + x1) / 2, y0, zi + d), mat, false);
  // 수평 구역: [y0, y1, 종류]
  const rows = [[1.48, 3.88, 'sp'], [3.88, 10.48, 'gl'], [10.48, 14.08, 'sp'], [14.08, 16.58, 'sg'], [16.58, 16.78, 'sp'], [16.78, 23.38, 'gl'],
    [23.38, 27.08, 'sp'], [27.08, 29.58, 'sg'], [29.58, 29.78, 'sp'], [29.78, 36.38, 'gl'], [36.38, HADD, 'sp']];
  const matOf = k => k === 'gl' ? M.glass : k === 'sg' ? M.pane : M.metal;
  // 세로 구역: 서측 좁은 유리 81.4..92.89, 이후 [2' 기둥커버][6' 유리] × 7, 동단 148.81..149.7
  const cols = [[81.4, 92.89, 'g']];
  for (let k = 0; k < 7; k++) { const s = 92.89 + 8 * k; cols.push([s, s + 2.0, 'm'], [s + 2.0, Math.min(s + 8.0, 148.81), 'g']); }
  cols.push([148.81, 149.7, 'm']);
  for (const [x0, x1, kind] of cols) {
    if (kind === 'm') { P(G.box(x1 - x0, HADD - 1.48, 0.6, (x0 + x1) / 2, 1.48, z - 0.3), M.metal); continue; }
    for (const [y0, y1, k] of rows) {
      if (y0 < 10.69 && x0 >= 134.9) continue;                                            // 출입구 구역
      if (y0 < 10.69 && x1 <= 92.9) { continue; }                                            // 서측 1F 금속 패널 구역
      span(x0, x1, y0, y1, matOf(k));
    }
    // 수평 멀리언
    for (const y of [3.88, 10.48, 14.08, 16.58, 23.38, 27.08, 29.58, 36.38]) if (!(y < 10.69 && (x0 >= 134.9 || x1 <= 92.9))) P(G.box(x1 - x0, 0.25, 0.3, (x0 + x1) / 2, y - 0.12, z - 0.15), M.dark);
  }
  // 1F 서측 금속 패널 (80.8..92.7, 0.86..10.69) + 2F·3F 루버 (85.1..94.7)
  P(G.box(11.9, 9.83, 0.5, 86.75, 0.86, z - 0.25), M.precast);
  for (const [y0, y1] of [[16.78, 23.38], [29.78, 36.38]]) {
    P(G.box(9.6, y1 - y0, 0.3, 89.9, y0, z - 0.1), M.metal);
    for (let y = y0 + 0.5; y < y1; y += 0.5) P(G.box(9.6, 0.12, 0.15, 89.9, y, z + 0.05), M.dark, false);
  }
  // 출입구 167: 석회석 베니어 벽 134.99..149.6 (0..10.69), 문 D2a 6'×7.5' (중심 142.3), 캐노피 10.69
  P(G.box(14.6, 10.69 + 1.5, 0.6, 142.3, -1.5, z - 0.3), M.limestone);
  P(G.box(6.0, 7.5, 0.2, 142.3, 0, z + 0.25), M.glass, false);
  P(G.box(0.15, 7.5, 0.3, 142.3, 0, z + 0.3), M.dark); P(G.box(6.3, 0.3, 0.3, 142.3, 7.5, z + 0.3), M.dark);
  P(G.box(0.15, 7.5, 0.3, 139.3, 0, z + 0.3), M.dark); P(G.box(0.15, 7.5, 0.3, 145.3, 0, z + 0.3), M.dark);
  P(G.box(14.6, 0.6, 5.5, 142.3, 10.69, z + 2.75), M.dark);                                   // 캐노피 (FINE ARTS 사인)
  P(G.box(13.0, 0.9, 0.15, 142.3, 11.3, z + 5.4), M.trim);
  // 동면 리턴 (x=150, z 143.2..150): 1F 석회석 베이스, 2F·3F 커튼월 2패널 (4.72 + 2.81)
  P(G.box(0.6, 10.69 + 1.5, 6.8, 149.75, -1.5, 146.6), M.limestone);
  for (const [z0, z1] of [[143.2, 147.9], [148.0, 150.0]]) for (const [y0, y1, k] of rows) if (y0 >= 10.48) P(G.box(0.25, y1 - y0, z1 - z0, 149.65, y0, (z0 + z1) / 2), matOf(k), false);
  P(G.box(0.5, HADD - 10.69, 0.3, 149.75, 10.69, 147.95), M.dark);
  for (const y of [14.08, 16.58, 23.38, 27.08, 29.58, 36.38]) P(G.box(0.3, 0.25, 6.8, 149.8, y - 0.12, 146.6), M.dark);
}

/** 역사 바닥 랜턴 (석재 받침 + 격자 유리 등체 + 캡) */
function lantern(G, M, parts, x, z) {
  const P = (geom, mat, cast = true) => parts.push({ geom, mat, cast });
  P(G.box(3.2, 0.5, 3.2, x, 0.3, z), M.limestone);
  P(G.box(2.4, 1.8, 2.4, x, 0.8, z), M.limestone);
  P(G.box(2.2, 4.4, 2.2, x, 2.6, z), M.pane, false);
  for (let i = 0; i < 4; i++) P(G.box(2.35, 0.1, 2.35, x, 3.2 + i * 1.0, z), M.dark, false);
  for (const [dx, dz] of [[-1.05, -1.05], [1.05, -1.05], [-1.05, 1.05], [1.05, 1.05]]) P(G.box(0.15, 4.4, 0.15, x + dx, 2.6, z + dz), M.dark, false);
  P(G.box(2.7, 0.5, 2.7, x, 7.0, z), M.limestone);
  P(G.box(1.6, 0.6, 1.6, x, 7.5, z), M.limestone);
}

/**
 * 벽 한 장 (축 정렬). p0→p1 은 CCW 규약(바깥 = 진행 방향 오른쪽). 좌표 c 는 벽 방향의 절대 좌표(x 또는 z).
 * win/strip/box/recess 는 벽면 기준 깊이(바깥 +)로 부속물을 배치하고, finish() 가 개구가 뚫린 벽을 생성한다.
 */
class Wall {
  constructor(G, M, parts, p0, p1, y0, y1, mat) {
    this.G = G; this.M = M; this.parts = parts; this.p0 = p0; this.p1 = p1; this.y0 = y0; this.y1 = y1; this.mat = mat;
    const dx = p1[0] - p0[0], dz = p1[1] - p0[1]; this.len = Math.hypot(dx, dz);
    this.ex = [dx / this.len, dz / this.len]; this.ez = [-dz / this.len, dx / this.len]; this.ry = -Math.atan2(dz, dx);
    this.axisX = Math.abs(dx) > Math.abs(dz); this.openings = []; this.subs = [];
  }
  s(c) { return Math.abs(c - (this.axisX ? this.p0[0] : this.p0[1])); }
  c(s) { return (this.axisX ? this.p0[0] : this.p0[1]) + (this.axisX ? this.ex[0] : this.ex[1]) * s; }
  pos(s, d) { return [this.p0[0] + this.ex[0] * s + this.ez[0] * d, this.p0[1] + this.ex[1] * s + this.ez[1] * d]; }
  hole(c0, c1, b, t) { const s = this.s(c0), e = this.s(c1); this.openings.push({ s: Math.min(s, e), e: Math.max(s, e), b, t }); }
  /** 박스: 좌표 c0..c1, 높이 b..t, 깊이 d0..d1 (바깥 +) */
  box(c0, c1, b, t, d0, d1, mat, cast = true) {
    const s = (this.s(c0) + this.s(c1)) / 2, d = (d0 + d1) / 2, q = this.pos(s, d);
    this.parts.push({ geom: this.G.box(Math.abs(c1 - c0), t - b, d1 - d0, q[0], b, q[1], { ry: this.ry }), mat, cast });
  }
  /** 유리면: 벽에서 inset 만큼 안쪽 */
  pane(c0, c1, b, t, inset = 0.5, mat = this.M.pane) {
    const s0 = this.s(c0), s1 = this.s(c1), a = this.pos(Math.min(s0, s1), -inset), q = this.pos(Math.max(s0, s1), -inset);
    this.parts.push({ geom: this.G.sideGeometry([a, q], b, t, 1 / Math.abs(c1 - c0), 1 / (t - b), false), mat, cast: false });
  }
  /** 창: 중심 c, 폭 w, [b, t, 트랜섬 높이]; 개구 + 유리 + 중앙 멀리언 + 트랜섬 바 + 석재 창대 */
  win(c, w, [b, t, tr], sill = 0.3) {
    const h = w / 2; const M = this.M;
    this.hole(c - h, c + h, b, t); this.pane(c - h, c + h, b, t, 0.5);
    this.box(c - 0.1, c + 0.1, b, t, -0.45, -0.3, M.trim);
    if (tr) this.box(c - h, c + h, tr - 0.12, tr + 0.12, -0.45, -0.3, M.trim);
    this.box(c - h - 0.25, c + h + 0.25, b - 0.35, b, 0, sill, M.limestone);
  }
  /** 석재 세로 띠 (창 베이 양옆) */
  strip(c0, c1, b, t) { const lo = Math.min(c0, c1), hi = Math.max(c0, c1); this.box(lo, lo + 0.36, b, t, 0, 0.15, this.M.limestone); this.box(hi - 0.36, hi, b, t, 0, 0.15, this.M.limestone); }
  /** 리세스 패널: 개구를 뚫고 inset 만큼 들어간 하위 벽을 반환 (창·장식을 그 위에 둘 수 있음) */
  recess(c0, c1, b, t, inset) {
    this.hole(c0, c1, b, t);
    const s0 = this.s(c0), s1 = this.s(c1), a = this.pos(Math.min(s0, s1), -inset), q = this.pos(Math.max(s0, s1), -inset);
    const sub = new Wall(this.G, this.M, this.parts, a, q, b, t, this.mat);
    this.subs.push(sub); return sub;
  }
  finish() {
    this.parts.push({ geom: this.G.wallSeg(this.p0, this.p1, this.y0, this.y1, { openings: this.openings }), mat: this.mat, cast: true });
  }
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
