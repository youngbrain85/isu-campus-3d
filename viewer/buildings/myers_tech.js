// John T. Myers Technology Center (1997) — 평면도만 있는 세트 ("Myers Tech Master Set", 2007-10-23, 1/16" = 1'-0")
// 치수 근거 (도면 세트 D:\Projects\Drawings\ISU Files\TC Bldg, 벡터 CAD 플롯 — 입면도·단면도 없음):
//   sheet 344 Second Floor Plan (1/16", 300 dpi 렌더에서 18.75 px/ft 로 계측, 원점 = 본동 북서 모서리 외벽면):
//     본동 외곽 234.7' × 121' (동측부), 서측부 깊이 76'; 서측 돌출부(화물 EL·라운지·계단 S1) x -12..0, y 20..76;
//     동측 계단 S3 돌출 x 234.7..245, y 31.5..46; 북측 "Chair" 베이 돌출 x 126..143, y -4..0;
//     2·3층 남동 모서리 계단형 (212 남벽 y 130, 211 남벽 y 127, 랩 남벽 y 121). 기둥: x 0.8, 22.7, 48.7, 74.5, 100, 120.5, 155.6, 182, 208, 225.5.
//     ★ 외벽은 벽체 해치(조적)와 "얇은 2중선+멀리언 눈금"(유리 리본창)으로 구분됨 → 아래 "입면 창 배치" 표.
//   sheet 343 First Floor Plan (36×24 플롯, 25.06 px/ft @300 dpi, 1/16" 아님 — 북벽·동벽·212 남벽으로 보정, ±1.5 ft):
//     북서 단층동 (168/113A) x 0..62, y -20.8..0; 남서 랩동 x 0..75, y 76..130 (가운데 x 20..72, y 88..124 가 +5' 높음);
//     강당 105: 외벽 원호 (150,112)→정점(183,130)→(216,112) (R 39.25, 중심 (183,90.75)), 바깥에 동심 테라스 계단 5단;
//     북측 주출입구: 로비 100 전면 유리벽이 y=3 로 후퇴 (x 125..155), 양쪽 피어 x 124.5..126.5 / 142.5..144.5 가 y=-4 까지 돌출,
//       출입문 2쌍 (x 127.5..133, 136..141.5); 북벽 밖 실외기 3대 (x 76..82, 89..95, 96..101, y -5..0);
//     동측 출입구: 전실 134 가 x 234.7..243 (y 66..75) 로 돌출, 캐노피 (x 234.7..243.5, y 47..75, "line of canopy above");
//     남동: 1층 벽이 x=216 (유리, 106 로비) 으로 후퇴 → 2층 아래 지붕 덮인 테라스 (x 216..243, y 76..112), 기둥 (210,121.5),(229,121.5),
//       곡면 외부계단 (중심 (246,99), r 9..20), 플랜터 벽 x 240..243.
//   sheet 345 Third Floor Plan: 외벽 패턴 2층과 동일.
//   sheet 346 Fourth Floor Plan: 기계실 401 (x 126..150, y 0..47 + 베이 126..146, -4..0), 상부 아트리움 403/워크웨이 404 (x 126..150, y 47..88, 천창),
//     기계실 402 (x 126..150, y 88..128), 계단탑 S1 (x -12..10, y 48..63), S3 (x 222..245, y 31.5..46); 모서리 페이버 패드; 옥상 해치 6개 (남서동).
//   Esri 영상 (data/imagery/esri_z20.png, 0.378 ft/px; esri_z19): 옥상 RTU (x 220..232, y 14..24), (x 170..178, y 22..30), 401·402 위 소형 유닛,
//     아트리움 천창은 동서 방향 줄무늬(리지형), 강당 곡면 지붕 정점 y≈129.5.
// ※ 입면도·단면도가 없어 층고는 추정값: 1층 15', 2·3층 14' (지붕 43'), 난간벽 2', 기계실 13', 아트리움 10', 계단탑 +10', 단층동 지붕 15'.
//    리본창 높이도 추정: 창대 +3', 상단 +10' (2·3층), 1층 +3'..+11'; 멀리언 피치 3'-4" (10' 베이 ÷ 3, 평면 눈금과 일치).
//
// 입면 창 배치 (평면 벽선 판독, 좌표 = 평면 로컬 ft):
//   북 (y=0, 서→동): 2·3층 리본 [9,68] [81,126] | 베이 126..143 (정면 y=-4 리본 [127.5,141.5]) | [143,155] | 피어 155..164.5 | [164.5,224.5] | 조적 224.5..234.7
//                     1층: 창 [77,85][90,98][103.5,110][112.5,119] (x<62 는 북서동에 가려짐); 로비 유리벽 y=3 (x 125..155, 문 2쌍);
//                     [157,163][165,181][183,203][206.5,221] 리본
//   북서동 북벽 (y=-20.8): 창 7' × 5 (x 4.5, 17.5, 31.5, 44.5, 57.5); 동벽 x=62 창 [-18,-3]; 서벽 x=0 문 [-16,-12.5]
//   동 (x=234.7, 북→남): 2·3층 조적 0..46 (S3 탑 동면 유리 슬롯 y 33..44.5) | 리본 [54,111.5] | 조적 111.5..121
//                       1층: 리본 [3,29] | 문 [49,53] | 유리 [55,66] | 전실 66..75 | 조적 75..76 | (y 76..121 후퇴: 테라스)
//   남 (서→동): y=76 (x -12..75) 2·3층 리본 [6.5,65]; x=75 벽(서향) 조적 + 2층 옥상문 [82,85]; y=130 (x 75..125) 리본 [82,119] / 1층 창 [84,90][98,105][112,119];
//              y=127 (x 125..143) 리본 [128,142]; y=121 (x 143..234.7) 리본 [145.5,155] [164,224.5];
//              남서동 y=130 1층 창 [5.5,12.5][18.5,25.5][31.5,38.5][45.5,52.5][58.5,64][64.5,69]; 남서동 서벽 x=0 창 [84,99][104,125]
//   서 (x=-12, y 20..76): 조적 20..30 (화물EL) | 30..45 브리지 접속 | 계단 S1 유리 슬롯 [47,58] | 조적 60..63 | 리본 [63,75]; x=0 (y 0..20) 조적
// 로컬 프레임: 평면도 기준 x = 오른쪽(= 동), z = 아래(= 남). 원점 = 본동 북서 모서리. 북측 화살표 = 평면 위 → rotation ≈ 0.
import * as THREE from 'three';

export const meta = {
  id: 'myers', name: 'John T. Myers Technology Center', osm: 'way/461428304',
  anchor: [312.11, 1094.57], rotation: -0.302,   // tools/fit_footprint.py 결과 (RMS 1.09 ft)
  height: 56,
  preset: { pos: [610, 185, 775], tgt: [430, 10, 1150] },
  sheets: 'Myers Tech Master Set 2007: sheets 342 (lower level), 343 (1st), 344 (2nd), 345 (3rd), 346 (4th/roof); Esri imagery for roof',
};

// 추정 층고 (ft, 1층 바닥 = 0)
const H1 = 15, H2 = 29, H3 = 43, PAR = 2, PH = 13, ST = 10, HW = 15;
const E = 234.7;   // 본동 동측 벽 x
const MULL = 10 / 3;   // 리본창 멀리언 피치 3'-4"

// 3층 본동 외곽 (OSM 피팅용). 평면 기준 반시계 (남변 → 동변 → 북변 → 서변)
export const outline = [[0, 130], [125, 130], [125, 127], [143, 127], [143, 121], [E, 121], [E, 46], [245, 46], [245, 31.5], [E, 31.5], [E, 0],
  [145.5, 0], [145.5, -4], [124.5, -4], [124.5, 0], [0, 0], [0, 20], [-12, 20], [-12, 76], [0, 76]];

// 강당 곡면 남벽 (sheet 343): (150,112) → 정점 (183,130) → (216,112) 의 원호. n 등분, 서쪽 끝 → 동쪽 끝 (남쪽으로 볼록)
const ARC_C = [183, 90.75], ARC_R = 39.25;
function arcPts(n = 16, r = ARC_R) {
  const a0 = Math.atan2(112 - ARC_C[1], 150 - ARC_C[0]), a1 = Math.atan2(112 - ARC_C[1], 216 - ARC_C[0]);
  const pts = [];
  for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; pts.push([ARC_C[0] + r * Math.cos(a), ARC_C[1] + r * Math.sin(a)]); }
  return pts;
}

export function build(M, G) {
  const parts = [];
  const brick = M.brick_red, band = M.precast;
  const push = (geom, mat, cast) => parts.push({ geom, mat, cast });

  // ---------------------------------------------------------------- 벽 헬퍼
  // 벽 p0→p1 (CCW 규약, 바깥 = 진행 방향 오른쪽) 에 개구 목록을 뚫는다.
  //   specs: [{u:[a,b], b, t, kind}] — u 는 벽 축방향 절대좌표 (x 또는 z), b..t 절대 높이.
  //   kind: 'ribbon' (유리 + 멀리언 + 창대), 'win' (펀치창 + 창대), 'glass' (유리벽), 'door' (어두운 문짝), 'hole' (개구만)
  const wall = (p0, p1, y0, y1, specs = [], mat = brick) => {
    const dx = p1[0] - p0[0], dz = p1[1] - p0[1], L = Math.hypot(dx, dz);
    const ex = [dx / L, dz / L], ez = [-dz / L, dx / L];                  // ez = 바깥
    const ax = Math.abs(dx) >= Math.abs(dz) ? 0 : 1, sgn = Math.sign(p1[ax] - p0[ax]);
    const ry = -Math.atan2(dz, dx);
    const at = (s, off) => [p0[0] + ex[0] * s - ez[0] * off, p0[1] + ex[1] * s - ez[1] * off];
    const openings = [];
    for (const sp of specs) {
      let s = (sp.u[0] - p0[ax]) * sgn, e = (sp.u[1] - p0[ax]) * sgn;
      if (s > e) [s, e] = [e, s];
      s = Math.max(0, s); e = Math.min(L, e);
      if (e - s < 0.3) continue;
      openings.push({ s, e, b: sp.b, t: sp.t });
      const kind = sp.kind || 'win';
      if (kind === 'hole') continue;
      if (kind === 'door') {
        push(G.sideGeometry([at(s, 0.25), at(e, 0.25)], sp.b, sp.t, 1 / 24, 1 / 12, false), M.dark, false);
        continue;
      }
      // 유리면 (0.5' 안쪽)
      push(G.sideGeometry([at(s, 0.5), at(e, 0.5)], sp.b, sp.t, 1 / (e - s), 1 / (sp.t - sp.b), false), M.pane, false);
      if (kind === 'ribbon' || kind === 'glass') {
        // 수직 멀리언 (피치 MULL, 양 끝 포함) + 상하 프레임
        const n = Math.max(1, Math.round((e - s) / MULL));
        for (let k = 0; k <= n; k++) { const q = at(s + (e - s) * k / n, 0.35); push(G.box(0.3, sp.t - sp.b, 0.3, q[0], sp.b, q[1], { ry }), M.dark); }
        const mid = at((s + e) / 2, 0.35);
        push(G.box(e - s, 0.3, 0.3, mid[0], sp.t - 0.3, mid[1], { ry }), M.dark);
        if (kind === 'ribbon' && sp.t - sp.b > 6) push(G.box(e - s, 0.25, 0.3, mid[0], sp.b + (sp.t - sp.b) * 0.62, mid[1], { ry }), M.dark);   // 트랜섬
      } else {
        const mid = at((s + e) / 2, 0.35);
        push(G.box(0.25, sp.t - sp.b, 0.3, mid[0], sp.b, mid[1], { ry }), M.dark);                                  // 가운데 멀리언
      }
      if (kind !== 'glass') {
        const mid = at((s + e) / 2, -0.15);
        push(G.box(e - s + 0.4, 0.45, 0.7, mid[0], sp.b - 0.45, mid[1], { ry }), band);                          // 프리캐스트 창대
      }
    }
    push(G.wallSeg(p0, p1, y0, y1, { openings }), mat);
  };
  // 리본창 사양 생성: 2·3층 (y0 = 층 바닥) 창대 +3, 상단 +10
  const rib = (ranges, y0, b = 3, t = 10) => ranges.map(u => ({ u, b: y0 + b, t: y0 + t, kind: 'ribbon' }));
  const win = (ranges, b = 3, t = 11) => ranges.map(u => ({ u, b, t, kind: 'win' }));
  const roof = (poly, y, mat = M.roof_membrane, parapet = PAR, pmat = brick) => {
    const r = G.flatRoof(poly, y, { parapet, thick: 0.6 });
    push(r.slab, mat); if (r.parapet) push(r.parapet, pmat);
  };
  // 프리캐스트 띠: 폴리곤 둘레를 off 만큼 바깥으로 두른 띠 (closed)
  const bands = (poly, ys, h = 1.2, off = 0.3, closed = true) => { const o = G.offsetPoly(poly, -off); for (const y of ys) push(G.sideGeometry(o, y, y + h, 1 / 24, 1 / 12, closed), band); };
  const coping = (poly, y, off = 0.2) => { const o = G.offsetPoly(poly, -off); push(G.sideGeometry(o, y - 0.5, y + 0.1, 1 / 24, 1 / 12, true), band); push(G.capGeometry(o, [], y + 0.1), band); };

  // ================================================================ 2·3층 본동 (H1..H3)
  const upper = [[75, 130], ...outline.slice(1, -1), [75, 76]];   // 2·3층: 서측부 남벽 y=76, 212 구역 x 75..125 만 y 130 까지
  // 각 변의 유리 범위 (축방향 절대좌표). 인덱스 = upper 변 번호 (upper[i] → upper[i+1])
  const upperGlass = {
    0: [[82, 119]],                      // y=130 (212 남벽)
    2: [[128, 142]],                     // y=127
    4: [[145.5, 155], [164, 224.5]],     // y=121 남벽
    5: [[54, 111.5]],                    // x=E 동벽 (남부)
    10: [[145.5, 155], [164.5, 224.5]],  // y=0 북벽 동부
    12: [[127, 143]],                    // 베이 정면 y=-4
    14: [[9, 68], [81, 124.5]],          // y=0 북벽 서부
    17: [[63, 75]],                      // x=-12 서벽 (219E 사무실)
    18: [[6.5, 65]],                     // y=76 남벽 (서측부)
  };
  for (let i = 0; i < upper.length; i++) {
    const a = upper[i], b = upper[(i + 1) % upper.length];
    const g = upperGlass[i] || [];
    const specs = [...rib(g, H1), ...rib(g, H2)];
    if (i === 17) for (const y0 of [H1, H2]) specs.push({ u: [47, 58], b: y0 + 2, t: y0 + 12, kind: 'glass' });   // 계단 S1 유리 슬롯
    if (i === 7) specs.push({ u: [33, 44.5], b: H1 + 2, t: H3 - 1, kind: 'glass' });                              // S3 탑 동면 유리 슬롯 (2·3층; 탑 상부는 아래 별도)
    if (i === 19) specs.push({ u: [82, 85], b: H1, t: H1 + 7, kind: 'door' });                                      // 2층 옥상 출입문 (랩동 지붕으로)
    wall(a, b, H1, H3, specs);
  }
  roof(upper, H3);
  coping(upper, H3 + PAR);
  bands(upper, [H1 - 1.2, H2 - 1.2]);
  bands(upper, [H3 - 1.0], 1.0, 0.25);

  // ================================================================ 1층 외벽 (0..H1)
  // 북측 주출입구 피어 (베이 양쪽, y -4..3) 와 로비 후퇴부 천장
  push(G.box(2, H1, 7, 125.5, 0, -0.5), brick); push(G.box(2, H1, 7, 144.5, 0, -0.5), brick);
  push(G.box(31, 1.0, 7.2, 140, H1 - 1.0, -0.4), M.trim);                                   // 후퇴부 소핏 (x 124.5..155.5)
  // 1층 벽 목록: [p0, p1, specs]
  const arc = arcPts();
  const w1 = [
    [[0, 130], [75, 130], win([[5.5, 12.5], [18.5, 25.5], [31.5, 38.5], [45.5, 52.5], [58.5, 64], [64.5, 69]], 3, 10.5)],   // 남서동 남벽
    [[75, 130], [125, 130], win([[84, 90], [98, 105], [112, 119]])],
    [[125, 130], [125, 127], []],
    [[125, 127], [143, 127], rib([[128, 142]], 0, 3, 11)],
    [[143, 127], [143, 112], [{ u: [114, 122], b: 3, t: 11, kind: 'ribbon' }]],
    [[143, 112], [150, 112], []],
    [[216, 112], [216, 76], [{ u: [78, 110], b: 1.5, t: 13.5, kind: 'glass' }]],         // 106 로비 유리벽
    [[216, 76], [E, 76], []],
    [[E, 76], [E, 46], [{ u: [66, 75], b: 0, t: 10.5, kind: 'hole' }, { u: [55, 66], b: 2, t: 12, kind: 'glass' }, { u: [49, 53], b: 0, t: 7.5, kind: 'door' }]],
    [[E, 46], [245, 46], []],
    [[245, 46], [245, 31.5], []],                                                          // S3 동면 1층: 유리 슬롯은 2층부터
    [[245, 31.5], [E, 31.5], []],
    [[E, 31.5], [E, 0], rib([[3, 29]], 0, 3, 11)],
    [[E, 0], [155, 0], rib([[157, 163], [165, 181], [183, 203], [206.5, 221]], 0, 3, 11)],
    [[155, 0], [155, 3], []],
    [[155, 3], [125, 3], [{ u: [125.5, 154.5], b: 0.5, t: 12.5, kind: 'glass' }]],        // 로비 100 전면 유리벽 (후퇴)
    [[125, 3], [125, 0], []],
    [[125, 0], [62, 0], win([[77, 85], [90, 98], [103.5, 110], [112.5, 119]])],
    [[62, 0], [62, -20.8], win([[-18, -3]])],                                               // 북서동 동벽
    [[62, -20.8], [0, -20.8], win([[4.5, 11.5], [17.5, 24.5], [31.5, 38.5], [44.5, 51.5], [57.5, 61.5]])],
    [[0, -20.8], [0, 0], [{ u: [-16, -12.5], b: 0, t: 7.5, kind: 'door' }]],
    [[0, 0], [0, 20], []],
    [[0, 20], [-12, 20], []],
    [[-12, 20], [-12, 76], [{ u: [47, 58], b: 2, t: 12, kind: 'glass' }, ...rib([[61, 75]], 0, 3, 11)]],
    [[-12, 76], [0, 76], []],
    [[0, 76], [0, 130], rib([[84, 99], [104, 125]], 0, 3, 11)],                              // 남서동 서벽
  ];
  for (const [a, b, specs] of w1) wall(a, b, 0, H1, specs);
  for (let i = 0; i < arc.length - 1; i++) wall(arc[i], arc[i + 1], 0, HW, []);           // 강당 곡면 벽 (무창)
  // 북측 주출입구 문 2쌍 (유리벽 안쪽에 어두운 프레임)
  for (const [x0, x1] of [[127.5, 133], [136, 141.5]]) {
    push(G.box(x1 - x0, 7.5, 0.25, (x0 + x1) / 2, 0, 2.6), M.dark); push(G.box(0.2, 7.5, 0.3, (x0 + x1) / 2, 0, 2.55), M.trim);
  }
  // 1층 기단 (프리캐스트 베이스 코스)
  const base1 = [[0, 130], [75, 130], [125, 130], [125, 127], [143, 127], [143, 112], [150, 112], ...arc.slice(1, -1), [216, 112], [216, 76], [E, 76], [E, 46], [245, 46], [245, 31.5], [E, 31.5], [E, 0],
    [155, 0], [155, 3], [125, 3], [125, 0], [62, 0], [62, -20.8], [0, -20.8], [0, 0], [0, 20], [-12, 20], [-12, 76], [0, 76]];
  bands(base1, [0], 1.5, 0.25);
  // 2층 바닥 소핏 (남동 테라스·강당 주변 오버행 아래)
  push(G.box(E - 143, 0.8, 45, (E + 143) / 2, H1 - 0.8, 98.5), M.trim);
  push(G.box(2, H1, 2, 210, 0, 120), brick); push(G.box(2, H1, 2, 229, 0, 120), brick);     // 테라스 기둥

  // ---- 단층부 지붕: 북서동, 남서 랩동(+ 가운데 올라간 부분), 강당 곡면 슬리버
  roof([[0, 0], [62, 0], [62, -20.8], [0, -20.8]], HW, M.roof_membrane, 1.5);
  const sw = [[0, 130], [75, 130], [75, 76], [0, 76]];
  roof(sw, HW, M.roof_membrane, 1.5);
  const swHi = [[20, 124], [72, 124], [72, 88], [20, 88]];
  push(G.sideGeometry(swHi, HW, HW + 5, 1 / 24, 1 / 12, true), brick); roof(swHi, HW + 5, M.roof_membrane, 0.8);
  for (const [x, z] of [[18.5, 93.5], [35.5, 93.5], [43.5, 93.5], [25.5, 105.5], [35.5, 105.5], [44.5, 105.5]]) push(G.box(3, 1.5, 3, x, HW + 5, z), M.metal);   // 옥상 해치
  {
    const bulge = [[158.2, 121], ...arcPts(16).filter(p => p[1] > 121.2), [207.8, 121]];   // y>121 부분만 노출
    roof(bulge, HW, M.roof_membrane, 1.5);
  }
  // 강당 앞 곡면 테라스 계단 (5단, 디딤 3', 챌 0.5', 벽 쪽이 높음)
  for (let i = 0; i < 5; i++) {
    const inner = arcPts(16, ARC_R + 3 * i).reverse(), outer = arcPts(16, ARC_R + 3 * (i + 1));
    const ring = [...outer, ...inner], y = 2.5 - 0.5 * i;   // CCW: 바깥 호 서→동, 안쪽 호 동→서
    push(G.capGeometry(ring, [], y), M.walk, false);
    push(G.sideGeometry(ring, 0, y, 1 / 24, 1 / 12, true), M.concrete, false);
  }

  // ---- 북측 주출입구 앞 실외기 3대, 서측 장비 패드
  for (const [x0, x1] of [[76, 82], [89, 95], [96, 101]]) push(G.box(x1 - x0, 3, 4.5, (x0 + x1) / 2, 0, -2.5), M.metal);
  push(G.box(2.5, 4, 10, -8.5, 0, 90), M.metal); push(G.box(2.5, 4, 5, -8.5, 0, 112.5), M.metal);

  // ---- 동측 출입구: 전실 134 (돌출 유리 박스) + 캐노피 (x E..243.5, y 47..75) + 기둥
  {
    const v = [[E, 75], [243, 75], [243, 66], [E, 66]];                                  // CCW (남변 서→동)
    const vs = [[{ u: [67, 74], b: 0, t: 10, kind: 'glass' }], [{ u: [67.5, 73.5], b: 0, t: 7.5, kind: 'door' }, { u: [67, 74], b: 7.6, t: 10, kind: 'glass' }], [{ u: [67, 74], b: 0, t: 10, kind: 'glass' }]];
    for (let i = 0; i < 3; i++) wall(v[i], v[i + 1], 0, 10.5, vs[i]);
    push(G.capGeometry(v, [], 10.5), M.roof_dark);
    push(G.box(243.5 - E + 0.3, 1.0, 28, (E + 243.5) / 2, 12, 61), M.metal);                // 캐노피 슬래브
    push(G.box(243.5 - E + 0.3, 1.4, 0.4, (E + 243.5) / 2, 12.6, 75.2), M.metal); push(G.box(243.5 - E + 0.3, 1.4, 0.4, (E + 243.5) / 2, 12.6, 46.8), M.metal);
    push(G.box(0.4, 1.4, 28.8, 243.5, 12.6, 61), M.metal);                                 // 파시아
    for (const z of [49.5, 61, 72.5]) push(G.box(1, 1.2, 25, 239, 13, z), M.metal);         // 패널 보 (평면의 격자)
    push(G.box(1.2, 12, 1.2, 242.6, 0, 48.5), M.dark); push(G.box(1.2, 12, 1.2, 242.6, 0, 63), M.dark);
  }
  // ---- 남동 테라스 (x 216..240, y 76..112, +2' 단) + 플랜터 벽 + 곡면 외부계단 (테라스에서 동쪽 원형 광장으로 내려감)
  //      ※ 레벨은 추정: 평면에 "DN" 표기만 있고 단면이 없음. 지반은 평탄 메시이므로 테라스를 +2' 로 올려 계단이 보이게 함.
  {
    const C = [240.5, 98], R0 = 1.5, R1 = 12.5, a0 = -165 * Math.PI / 180, a1 = -95 * Math.PI / 180, n = 4;
    const sect = (ra, rb, s0, s1, k = 6) => {   // 부채꼴 고리 (CCW)
      const ring = [];
      for (let i = 0; i <= k; i++) { const a = s0 + (s1 - s0) * i / k; ring.push([C[0] + ra * Math.cos(a), C[1] + ra * Math.sin(a)]); }
      for (let i = k; i >= 0; i--) { const a = s0 + (s1 - s0) * i / k; ring.push([C[0] + rb * Math.cos(a), C[1] + rb * Math.sin(a)]); }
      return ring;   // -165°→-95° 는 화면상 시계방향 호 → 안쪽 호 먼저 돌면 내부가 왼쪽 = CCW
    };
    const t = [[216, 112], [240, 112], [240, 76], [216, 76]];
    const wedge = sect(0.01, R1 + 0.3, a0, a1, 12);                                     // 테라스 슬래브에서 계단 부분을 뚫는다
    push(G.capGeometry(t, [wedge.slice().reverse()], 2.0), M.walk, false);
    push(G.sideGeometry(t, 0, 2.0, 1 / 24, 1 / 12, true), M.concrete, false);
    push(G.sideGeometry(wedge.slice().reverse(), 0, 2.0, 1 / 24, 1 / 12, true), M.concrete, false);
    push(G.box(3, 3.0, 8, 241.5, 0, 80), brick); push(G.box(3, 3.0, 15, 241.5, 0, 104.5), brick);   // 동측 플랜터 벽 (계단 출구 y 84..97 비움)
    push(G.box(27.5, 3.0, 3, 229.5, 0, 110.5), brick);                                                  // 남측 플랜터 벽
    push(G.box(3, 2.6, 3, C[0], 0, C[1]), brick);                                                       // 계단 중심 뉴얼
    for (let i = 0; i < n; i++) {                                                                       // 서쪽(테라스, +2) → 북동(광장, 0) 으로 4단
      const s0 = a0 + (a1 - a0) * i / n, s1 = a0 + (a1 - a0) * (i + 1) / n, y = 2.0 - 0.5 * (i + 1);
      if (y <= 0) continue;
      const ring = sect(R0, R1, s0, s1);
      push(G.capGeometry(ring, [], y), M.walk, false); push(G.sideGeometry(ring, 0, y, 1 / 24, 1 / 12, true), M.concrete, false);
    }
    for (let k = 0; k < 7; k++) { const a = a0 + (a1 - a0) * (k + 0.5) / 7; push(G.box(0.15, 3.2, 0.15, C[0] + (R1 - 0.4) * Math.cos(a), 0.2, C[1] + (R1 - 0.4) * Math.sin(a)), M.dark); }   // 난간 지주
  }
  // ---- 서측 브리지 접속부 (Technology Building 모듈의 브리지가 x=-12, y≈35 에서 끝남 → 짧은 접속 스터브)
  {
    const d = [-0.848, 0.529], c = [-12 + d[0] * 1.5, 35 + d[1] * 1.5], ry = -Math.atan2(d[1], d[0]);
    push(G.box(3.2, 1.2, 10.6, c[0], 17.4, c[1], { ry }), M.metal);
    push(G.box(3.2, 9.4, 10.2, c[0], 18.6, c[1], { ry }), M.glass, false);
    push(G.box(3.2, 2.0, 10.6, c[0], 28, c[1], { ry }), M.metal);
  }

  // ================================================================ 옥상: 기계실 401·402, 상부 아트리움 403/워크웨이 404 (천창), 계단탑 S1·S3
  const ph = (poly, h, mat = brick, par = 0.8, y0 = H3) => { push(G.sideGeometry(poly, y0, H3 + h, 1 / 24, 1 / 12, true), mat); roof(poly, H3 + h, M.roof_membrane, par); };
  ph([[126, 47], [150, 47], [150, 0], [146, 0], [146, -4], [126, -4]], PH);
  ph([[126, 130], [146, 130], [146, 128], [150, 128], [150, 88], [126, 88]], PH);
  ph([[126, 88], [150, 88], [150, 47], [126, 47]], 10, brick, 0.6);
  // 리지형 천창 (동서 방향 리지 6줄, x 128..148, y 48..78)
  for (let k = 0; k < 6; k++) { const z0 = 48 + 5 * k; push(G.gableRoof([[128, z0 + 5], [148, z0 + 5], [148, z0], [128, z0]], H3 + 10.2, 0.6, 0), M.glass, false); }
  push(G.box(20.6, 0.4, 30.6, 138, H3 + 9.8, 63), M.dark);                                   // 천창 커브
  // 기계실 지붕 위 소형 유닛 (esri_z19), 루버 (동·서면)
  for (const [x, z] of [[140, 5], [140, 18], [140, 93], [140, 104]]) push(G.box(9, 3, 6, x, H3 + PH, z), M.metal);
  for (const [z0, z1] of [[6, 40], [92, 124]]) { push(G.box(0.3, 6, z1 - z0, 150.1, H3 + 4, (z0 + z1) / 2), M.metal); push(G.box(0.3, 6, z1 - z0, 125.9, H3 + 4, (z0 + z1) / 2), M.metal); }
  ph([[-12, 63], [10, 63], [10, 48], [-12, 48]], ST, brick, 0.8, H3 + PAR);                 // 계단탑은 난간벽 위에서 시작 (면 겹침 방지)
  ph([[222, 46], [245, 46], [245, 31.5], [222, 31.5]], ST, brick, 0.8, H3 + PAR);
  push(G.sideGeometry([[245.05, 44.5], [245.05, 33]], H3 + PAR + 0.5, H3 + ST - 1.5, 1 / 12, 1 / 12, false), M.pane, false);   // S3 탑 상부 유리 슬롯
  push(G.box(0.3, ST - PAR - 2, 0.3, 245.1, H3 + PAR + 0.5, 33), M.dark); push(G.box(0.3, ST - PAR - 2, 0.3, 245.1, H3 + PAR + 0.5, 44.5), M.dark);
  // 옥상 유닛 (영상 판독) 과 모서리 페이버 패드
  push(G.box(12, 5, 10, 226, H3, 19), M.metal); push(G.box(8, 4, 8, 174, H3, 26), M.metal);
  for (const [x0, z0, x1, z1] of [[2, 2, 10, 10], [116, 1, 124, 9], [225, 1, 233, 9], [225, 110, 233, 118], [116, 112, 124, 120], [-11, 21, -3, 29], [-11, 67, -3, 75], [2, 67, 10, 75]])
    push(G.box(x1 - x0, 0.15, z1 - z0, (x0 + x1) / 2, H3, (z0 + z1) / 2), M.walk, false);

  const grp = new THREE.Group();
  for (const m of G.mergeByMaterial(parts)) grp.add(m);
  return grp;
}
