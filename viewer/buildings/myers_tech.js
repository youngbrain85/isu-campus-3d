// John T. Myers Technology Center (1997) — 평면도만 있는 세트 ("Myers Tech Master Set", 2007-10-23, 1/16" = 1'-0")
// 치수 근거 (도면 세트 D:\Projects\Drawings\ISU Files\TC Bldg, 벡터 CAD 플롯, 문자층 없음 → 벽선을 격자로 계측):
//   sheet 344 Second Floor Plan / 345 Third Floor Plan: 본동(3층) 외곽 234.7' × 121' (동측부), 서측부는 깊이 76' (y 0..76);
//     서측 돌출부(화물 EL·라운지·계단 S1) 12' × 56' (y 20..76), 동측 계단 S3 돌출 10.3' × 14.5' (y 31.5..46),
//     북측 "Chair" 베이 돌출 4' × 17' (x 126..143), 2·3층 남동 모서리 계단형 (212 남벽 y 130, 211 남벽 y 127, 랩 남벽 y 121),
//     기둥 간격 10' (북측 창 피치 근거).
//   sheet 343 First Floor Plan (36×24 플롯 — 격자 계측상 6.27 pt/ft, 1/16" 아님): 1층 남서 랩동 x 0..75, y 76..130 (1층),
//     북서 동 (168/113A) x 0..72, y -20..0 (1층), 강당 105 곡면 남벽 (x 150..205, 최대 y ≈ 129) + 곡면 테라스 계단,
//     북측 주출입구 로비 100 (x ≈ 100..125), 동측 출입구 "line of canopy above" (x 234.7, y 46..70).
//   sheet 342 Lower Level Plan: 지하층(그라운드 이하, 모델 생략 — 남측 window well 만 생략).
//   sheet 346 Fourth Floor Plan: 옥상 기계실 401 (x 126..146, y -4..47), 상부 아트리움/워크웨이 403·404 (x 126..150, y 47..88, 천창),
//     기계실 402 (x 126..146, y 88..128), 계단탑 S1 (x -12..10, y 48..63), S3 (x 222..245, y 31.5..46); 4층 연면적 4,750 sf.
// ※ 입면도·단면도가 없어 층고는 추정값: 1층 15', 2·3층 14' (지붕 43'), 난간벽 2', 기계실 13', 계단탑 +10', 단층동 지붕 15'.
// 로컬 프레임: 평면도 기준 x = 오른쪽(= 동), z = 아래(= 남). 원점 = 본동 북서 모서리. 북측 화살표 = 평면 위 → rotation ≈ 0.
import * as THREE from 'three';

export const meta = {
  id: 'myers', name: 'John T. Myers Technology Center', osm: 'way/461428304',
  anchor: [312.11, 1094.57], rotation: -0.302,   // tools/fit_footprint.py 결과 (RMS 1.09 ft)
  height: 56,
  preset: { pos: [610, 185, 775], tgt: [430, 10, 1150] },
  sheets: 'Myers Tech Master Set 2007: sheets 342 (lower level), 343 (1st), 344 (2nd), 345 (3rd), 346 (4th/roof)',
};

// 추정 층고 (ft, 1층 바닥 = 0)
const H1 = 15, H2 = 29, H3 = 43, PAR = 2, PH = 13, ST = 10, HW = 15;
const E = 234.7;   // 본동 동측 벽 x

// 3층 본동 외곽 (OSM 피팅용). 평면 기준 반시계 (남변 → 동변 → 북변 → 서변)
export const outline = [[0, 130], [125, 130], [125, 127], [143, 127], [143, 121], [E, 121], [E, 46], [245, 46], [245, 31.5], [E, 31.5], [E, 0],
  [143, 0], [143, -4], [126, -4], [126, 0], [0, 0], [0, 20], [-12, 20], [-12, 76], [0, 76]];

// 강당 곡면 남벽: (150,121) → 바닥점 (177.5,129) → (205,121) 의 원호
function arcPts(n = 12) {
  const c = 55, s = 8, R = (c * c / 4 + s * s) / (2 * s), cx = 177.5, cz = 121 + s - R;
  const a0 = Math.atan2(121 - cz, 150 - cx), a1 = Math.atan2(121 - cz, 205 - cx);
  const pts = [];
  for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; pts.push([cx + R * Math.cos(a), cz + R * Math.sin(a)]); }
  return pts;   // 서쪽 끝에서 동쪽 끝으로 (남쪽으로 볼록)
}

export function build(M, G) {
  const parts = [];
  const brick = M.brick_red, band = M.precast;
  const push = (geom, mat, cast) => parts.push({ geom, mat, cast });

  // 벽 한 변: 1층(0..H1) + 2·3층(H1..H3) 펀치창 입면. opts.g1=false 면 1층 생략(단층동에 가려짐), rows=상층 창 열 수
  const facade = (p0, p1, { g1 = true, up = true, colW = 10, winW = 6, margin = 2 } = {}) => {
    if (g1) {
      const w = G.windowGrid(p0, p1, { y0: 0, rows: 1, rowH: H1, colW, winW, winH: 7, sill: 3.5, margin });
      push(w.wall, brick); if (w.glass) push(w.glass, M.pane, false);
    }
    if (up) {
      const w = G.windowGrid(p0, p1, { y0: H1, rows: 2, rowH: 14, colW, winW, winH: 6, sill: 3.5, margin });
      push(w.wall, brick); if (w.glass) push(w.glass, M.pane, false);
    }
  };
  const blank = (p0, p1, y0, y1, mat = brick) => push(G.sideGeometry([p0, p1], y0, y1, 1 / 24, 1 / 12, false), mat);
  const roof = (poly, y, mat = M.roof_membrane, parapet = PAR) => {
    const r = G.flatRoof(poly, y, { parapet, thick: 0.6 });
    push(r.slab, mat); if (r.parapet) push(r.parapet, band);
  };
  // 프리캐스트 띠: 폴리곤 둘레를 0.3' 바깥으로 두른 띠
  const bands = (poly, ys, h = 1.2) => { const o = G.offsetPoly(poly, -0.3); for (const y of ys) push(G.sideGeometry(o, y, y + h, 1 / 24, 1 / 12, true), band); };

  // ---- 본동 2·3층 외곽 (U) 와 1층 외곽 (G1)
  const upper = [[75, 130], ...outline.slice(1, -1), [75, 76]];   // 2·3층: 서측부 남벽 y=76, 212 구역 x 75..125 만 y 130 까지
  // 2·3층 벽: 각 변에 상층 창. 1층은 아래 G1 에서 따로.
  for (let i = 0; i < upper.length; i++) {
    const a = upper[i], b = upper[(i + 1) % upper.length];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (len < 12) blank(a, b, H1, H3);                // 짧은 변(돌출부 측벽)은 창 없음
    else facade(a, b, { g1: false });
  }
  roof(upper, H3);
  bands(upper, [H1 - 1.2, H2 - 1.2, H3 - 2.2]);

  // 1층 외곽: 본동 + 북서 단층동 + 남서 랩동 + 강당 곡면. 각 변을 용도별로.
  const arc = arcPts();
  const g1 = [[0, 130], [125, 130], [125, 127], [143, 127], [143, 121], [150, 121], ...arc.slice(1, -1), [205, 121], [E, 121], [E, 70], [E, 46], [245, 46], [245, 31.5], [E, 31.5], [E, 0],
    [143, 0], [143, -4], [126, -4], [126, 0], [98, 0], [72, 0], [72, -20], [0, -20], [0, 20], [-12, 20], [-12, 76], [0, 76]];
  for (let i = 0; i < g1.length; i++) {
    const a = g1[i], b = g1[(i + 1) % g1.length];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const key = a[0] + ',' + a[1];
    if (key === E + ',70') { blank(a, b, 0, H1, M.glass); continue; }                // 동측 출입구 (캐노피 아래 유리)
    if (key === '126,0') { blank(a, b, 0, H1, M.glass); continue; }                 // 북측 주출입구 로비 100 전면 유리
    if (a[1] > 121.5 && b[1] > 121.5 && a[0] > 149 && b[0] < 206) { blank(a, b, 0, H1); continue; }   // 강당 곡면 벽 (무창)
    if (len < 12) { blank(a, b, 0, H1); continue; }
    facade(a, b, { up: false });
  }
  // 단층부 지붕: 북서동, 남서 랩동(+ 가운데 올라간 부분), 강당 곡면 슬리버
  roof([[0, 0], [0, -20], [72, -20], [72, 0]], HW, M.roof_membrane, 1.5);
  const sw = [[0, 130], [75, 130], [75, 76], [0, 76]];
  roof(sw, HW, M.roof_membrane, 1.5);
  const swHi = [[20, 124], [72, 124], [72, 88], [20, 88]];
  push(G.sideGeometry(swHi, HW, HW + 5, 1 / 24, 1 / 12, true), brick); roof(swHi, HW + 5, M.roof_membrane, 0.8);
  roof([[150, 121], ...arc.slice(1, -1), [205, 121]], HW, M.roof_membrane, 1.5);
  // 강당 앞 곡면 테라스 계단 (지면, 8' 폭 띠)
  {
    const outer = arcPts(12).map(p => [177.5 + (p[0] - 177.5) * 1.17, 121 + (p[1] - 121) * 1.9]);
    const terr = [...arcPts(12), ...outer.reverse()];
    push(G.capGeometry(terr, [], 1.2), M.walk, false);
    push(G.sideGeometry(terr, 0, 1.2, 1 / 24, 1 / 12, true), M.concrete);
  }
  // 북측 주출입구 캐노피, 동측 출입구 캐노피
  push(G.box(30, 1.0, 8, 112, 12, -4), M.metal);
  push(G.box(8, 1.0, 26, E + 4, 12, 58), M.metal);

  // ---- 옥상: 기계실 401·402, 상부 아트리움/워크웨이 403·404 (천창), 계단탑 S1·S3
  const ph = (poly, h, mat = brick) => { push(G.sideGeometry(poly, H3, H3 + h, 1 / 24, 1 / 12, true), mat); roof(poly, H3 + h, M.roof_membrane, 0.8); };
  ph([[126, 47], [146, 47], [146, -4], [126, -4]], PH);
  ph([[126, 128], [146, 128], [146, 88], [126, 88]], PH);
  ph([[126, 88], [150, 88], [150, 47], [126, 47]], 10);
  push(G.box(14, 3, 36, 135.5, H3 + 10, 67.5), M.glass, false);                     // 아트리움 천창
  ph([[-12, 63], [10, 63], [10, 48], [-12, 48]], ST);
  ph([[222, 46], [245, 46], [245, 31.5], [222, 31.5]], ST);

  const grp = new THREE.Group();
  for (const m of G.mergeByMaterial(parts)) grp.add(m);
  return grp;
}
