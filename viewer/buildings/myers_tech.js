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
// ※ (구) 평면만으로 추정했던 층고 1층 15', 2·3층 14', 계단탑 +10' 등은 아래 '사진 보정' 값으로 대체됨.
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
//
// ★ 사진 보정 (2026-10, Street View: scratch/sv/461428304 vp16 (Cherry St), 사용자 포토스피어 P1..P4 = scratch/myers/photo/*.jpg
//   P1 Cherry St 212동 앞, P2 Cherry St 남동 모서리, P3 동측 원형 자전거 광장, P4 북측 광장 정면; Esri z19/z20 영상):
//   · 층고: 1층 16.5' (P3 동측 정면 fo30 사진에서 층간 148 px = 14' 로 환산), 2층 바닥 16.5, 3층 30.5, 지붕 44.5, 프리캐스트 코니스 43..47.
//   · 재료: 적갈색 혼합 벽돌 (주황-적색 + 진갈색 아이언스팟), 프리캐스트 = 밝은 베이지-회색.
//     1층 머리의 두꺼운 프리캐스트 띠 (12..16.5, 다이아몬드 장식) 가 건물 전체를 두름; 바닥 0..2.5 프리캐스트 베이스.
//   · 2·3층 창: 리본창 (창대 +3, 유리 높이 5.5') + 바로 위 연속 프리캐스트 머리띠 (+8.5..+10.3) + 창 양끝 "귀" 블록,
//     리본 중간에 짙은 원형 기둥(실린더) 이 유리면 앞에 드러남. 유리는 짙은 반사 유리, 멀리언 짙은 브론즈.
//   · 1층 창: 펀치창 (창대 +3, 머리 +11.5, 가운데 멀리언 + 2/3 높이 트랜섬), 남측 212 동·남서동·북측.
//   · 박공 유리 계단탑 (평면만으로는 몰랐던 것): 북측 주출입구 탑 (넓은 유리 베이 + 동쪽 낮은 유리 베이, 박공 2개, 다이아몬드 장식,
//     지면에 세그먼트 아치 출입구), 남측 탑 (x 125..143, 아치 출입구), 동측 S3 탑 (동향 박공), 서측 S1 탑 (서향 박공, 사진 없음 → 동측과 같게 가정).
//     처마 ≈ 53..55', 용마루 ≈ 61..64.5' (P4 사진 각도 계산), 유리 상단은 세그먼트 아치, 층마다 가로재.
//   · 남측 (Cherry St): 동쪽 절반 1층은 2층 아래로 후퇴한 열주 (원형 짙은 기둥, 강당 벽은 완만한 곡면, 무창), 보도 쪽에 철제 난간 (메시 패널).
//     평면 추정의 강당 앞 동심원 테라스 계단 5단은 사진·영상에 없음 → 삭제.
//   · 동측 출입구: 프리캐스트 캐노피 띠 (건물명 사인) + 그 위 2층 높이의 1/4 원통 유리 볼트 (R ≈ 9').
//   ※ 사진에 안 보이는 부분 (서측 브리지 주변, 북서 단층동 세부, 옥상 기계실 높이) 은 평면 + 영상 추정 유지.
// 로컬 프레임: 평면도 기준 x = 오른쪽(= 동), z = 아래(= 남). 원점 = 본동 북서 모서리. 북측 화살표 = 평면 위 → rotation ≈ 0.
import * as THREE from 'three';

export const meta = {
  id: 'myers', name: 'John T. Myers Technology Center', osm: 'way/461428304',
  anchor: [312.11, 1094.57], rotation: -0.302,   // tools/fit_footprint.py 결과 (RMS 1.09 ft)
  height: 65,
  preset: { pos: [610, 185, 775], tgt: [430, 10, 1150] },
  sheets: 'Myers Tech Master Set 2007: sheets 342 (lower level), 343 (1st), 344 (2nd), 345 (3rd), 346 (4th/roof); Street View photospheres (Cherry St, 7th St plaza, north quad); Esri imagery for roof',
};

// 층 높이 (ft, 1층 바닥 = 0) — 사진 계측
const H1 = 16.5, H2 = 30.5, H3 = 44.5, TOP = 47, PAR = TOP - H3, PH = 9, HW = 16.5;
const BAND0 = 12;            // 1층 머리 프리캐스트 띠 하단
const E = 234.7;   // 본동 동측 벽 x
const MULL = 5;    // 리본창 멀리언 피치 (사진: 큰 판유리)

// 3층 본동 외곽 (OSM 피팅용). 평면 기준 반시계 (남변 → 동변 → 북변 → 서변)
export const outline = [[0, 130], [125, 130], [125, 127], [143, 127], [143, 121], [E, 121], [E, 46], [245, 46], [245, 31.5], [E, 31.5], [E, 0],
  [145.5, 0], [145.5, -4], [124.5, -4], [124.5, 0], [0, 0], [0, 20], [-12, 20], [-12, 76], [0, 76]];

// 강당 1층 남벽: 사진상 2층 벽면 (y=121) 뒤로 후퇴한 거의 평탄한 곡면 → 2차 베지어 (146,116) - (181,119) - (216,116), 이어서 x 230 까지 직선
function hallPts(n = 14) {
  const a = [146, 116], c = [181, 119], b = [216, 116], pts = [];
  for (let i = 0; i <= n; i++) { const t = i / n, u = 1 - t; pts.push([u * u * a[0] + 2 * u * t * c[0] + t * t * b[0], u * u * a[1] + 2 * u * t * c[1] + t * t * b[1]]); }
  return pts;
}

export function build(M, G) {
  const parts = [];
  // 사진 색에 맞춘 재질 (모듈 안에서만 복제·틴트)
  const brick = M.brick_red.clone(); brick.color = new THREE.Color(0xb39484);   // 사진: 진한 적갈색 벽돌 (기본 적벽돌 텍스처보다 어둡고 갈색)
  const band = M.precast.clone(); band.color = new THREE.Color(0xe4dacb);    // 베이지-회색 프리캐스트
  const pane = M.pane.clone(); pane.color = new THREE.Color(0x56616e);
  const bronze = M.dark.clone(); bronze.color = new THREE.Color(0x3b3530);
  const colm = M.dark.clone(); colm.color = new THREE.Color(0x5e534b); colm.metalness = 0.2;
  const push = (geom, mat, cast) => parts.push({ geom, mat, cast });

  // ---------------------------------------------------------------- 벽 헬퍼
  // 벽 평면 좌표 (s = p0 에서의 거리, y = 높이) → 월드 행렬. off = 바깥면에서 안쪽으로 들어간 거리 (음수 = 바깥)
  const basis = (p0, p1, off = 0) => {
    const dx = p1[0] - p0[0], dz = p1[1] - p0[1], L = Math.hypot(dx, dz);
    const ex = new THREE.Vector3(dx / L, 0, dz / L), up = new THREE.Vector3(0, 1, 0), ez = new THREE.Vector3().crossVectors(ex, up);
    const m = new THREE.Matrix4().makeBasis(ex, up, ez); m.setPosition(p0[0] - ez.x * off, 0, p0[1] - ez.z * off);
    return { m, L, ex, ez };
  };
  // 개구 윤곽: 직사각 또는 세그먼트 아치 (rise > 0 이면 t 가 아치 정점, t-rise 가 기점)
  const holePts = (o, n = 10) => {
    if (!o.rise) return [[o.s, o.b], [o.e, o.b], [o.e, o.t], [o.s, o.t]];
    const w = (o.e - o.s) / 2, r = (w * w + o.rise * o.rise) / (2 * o.rise), cy = o.t - r, cx = (o.s + o.e) / 2;
    const a0 = Math.atan2(o.t - o.rise - cy, w), pts = [[o.s, o.b], [o.e, o.b]];
    for (let i = 0; i <= n; i++) { const a = a0 + (Math.PI - 2 * a0) * i / n; pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
    return pts;
  };
  const shapeGeom = (outer, holes, p0, p1, off) => {
    const sh = new THREE.Shape(outer.map(p => new THREE.Vector2(p[0], p[1])));
    for (const h of holes) sh.holes.push(new THREE.Path(h.map(p => new THREE.Vector2(p[0], p[1]))));
    const g = new THREE.ShapeGeometry(sh);
    const uv = g.attributes.uv, pos = g.attributes.position;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, pos.getX(i) / 24, pos.getY(i) / 12);
    g.applyMatrix4(basis(p0, p1, off).m);
    return g;
  };
  const wbox = (p0, p1, s0, s1, y0, y1, off, depth, mat) => {   // 벽면 기준 박스 (off = 벽면에서 박스 중심까지 안쪽 거리, 음수 = 바깥)
    const { ex, ez } = basis(p0, p1); const s = (s0 + s1) / 2;
    const cx = p0[0] + ex.x * s - ez.x * off, cz = p0[1] + ex.z * s - ez.z * off;
    push(G.box(Math.abs(s1 - s0), y1 - y0, depth, cx, y0, cz, { ry: -Math.atan2(ex.z, ex.x) }), mat);
  };
  const wcyl = (p0, p1, s, y0, y1, off, r, mat) => { const { ex, ez } = basis(p0, p1); push(G.cylinder(r, y1 - y0, p0[0] + ex.x * s - ez.x * off, y0, p0[1] + ex.z * s - ez.z * off, 12), mat); };

  // 벽 p0→p1 (CCW, 바깥 = 진행 방향 오른쪽) 에 개구 목록을 뚫는다.
  //   specs: [{u:[a,b], b, t, kind, rise?}] — u 는 벽 축방향 절대좌표 (x 또는 z), b..t 절대 높이.
  //   kind: 'ribbon' (유리 + 멀리언 + 원형 기둥 + 창대·귀), 'win' (펀치창), 'glass' (유리벽/커튼월), 'door', 'hole'
  const wall = (p0, p1, y0, y1, specs = [], mat = brick) => {
    const dx = p1[0] - p0[0], dz = p1[1] - p0[1], L = Math.hypot(dx, dz);
    const ax = Math.abs(dx) >= Math.abs(dz) ? 0 : 1, sgn = Math.sign(p1[ax] - p0[ax]) || 1;
    const holes = [];
    for (const sp of specs) {
      let s = (sp.u[0] - p0[ax]) * sgn, e = (sp.u[1] - p0[ax]) * sgn;
      if (s > e) [s, e] = [e, s];
      s = Math.max(0, s); e = Math.min(L, e);
      if (e - s < 0.3) continue;
      const o = { s, e, b: Math.max(y0, sp.b), t: Math.min(y1, sp.t), rise: sp.rise || 0 };
      holes.push(holePts(o));
      const kind = sp.kind || 'win', hgt = o.t - o.b;
      if (kind === 'hole') continue;
      if (kind === 'door') { push(shapeGeom(holePts(o), [], p0, p1, 0.6), M.dark, false); continue; }
      push(shapeGeom(holePts(o), [], p0, p1, 0.5), pane, false);                                     // 유리면 (0.5' 안쪽)
      const pitch = kind === 'glass' ? (sp.pitch || MULL) : MULL;
      const n = Math.max(1, Math.round((e - s) / pitch));
      const top = o.t - o.rise;
      for (let k = 0; k <= n; k++) {                                                                  // 세로 멀리언 (아치 구간은 원호 아래까지)
        const sk = s + (e - s) * k / n, xr = (2 * k / n - 1);
        const tk = o.rise ? top + o.rise * Math.max(0, 1 - xr * xr) * 0.95 : o.t;
        wbox(p0, p1, sk - 0.15, sk + 0.15, o.b, tk, 0.35, 0.3, bronze);
      }
      wbox(p0, p1, s, e, o.b, o.b + 0.35, 0.35, 0.3, bronze);
      if (!o.rise) wbox(p0, p1, s, e, o.t - 0.35, o.t, 0.35, 0.3, bronze);
      if (kind === 'glass' && sp.trans) for (const ty of sp.trans) if (ty > o.b + 0.5 && ty < top) wbox(p0, p1, s, e, ty - 0.2, ty + 0.2, 0.35, 0.3, bronze);   // 층마다 가로재
      if (kind === 'win') {
        wbox(p0, p1, s, e, o.b + hgt * 0.68, o.b + hgt * 0.68 + 0.3, 0.35, 0.3, bronze);
        wbox(p0, p1, s - 0.3, e + 0.3, o.b - 0.4, o.b, -0.2, 0.7, band);                              // 프리캐스트 창대
      }
      if (kind === 'ribbon') {
        wbox(p0, p1, s, e, o.b + hgt * 0.36, o.b + hgt * 0.36 + 0.25, 0.35, 0.3, bronze);              // 가로 트랜섬 (사진: 아래 1/3)
        if (e - s > 14) {                                                                               // 짙은 원형 기둥 (리본 중간, ~26' 간격)
          const nc = Math.max(2, Math.round((e - s) / 26));
          for (let k = 1; k < nc; k++) wcyl(p0, p1, s + (e - s) * k / nc, o.b - 0.4, o.t + 0.2, -0.1, 0.75, colm);
        }
        wbox(p0, p1, s - 0.6, e + 0.6, o.b - 0.45, o.b, -0.2, 0.8, band);                              // 프리캐스트 창대
        wbox(p0, p1, s - 1.4, s, o.t - 1.6, o.t + 0.05, -0.15, 0.6, band); wbox(p0, p1, e, e + 1.4, o.t - 1.6, o.t + 0.05, -0.15, 0.6, band);   // 귀 블록
      }
    }
    push(shapeGeom([[0, y0], [L, y0], [L, y1], [0, y1]], holes, p0, p1, 0), mat);
  };
  // 리본창 사양: 층 바닥 y0 기준 창대 +3, 상단 +8.5
  const rib = (ranges, y0, b = 3, t = 8.5) => ranges.map(u => ({ u, b: y0 + b, t: y0 + t, kind: 'ribbon' }));
  const win = (ranges, b = 3, t = 11.5) => ranges.map(u => ({ u, b, t, kind: 'win' }));
  const roof = (poly, y, mat = M.roof_membrane, parapet = PAR, pmat = brick) => {
    const r = G.flatRoof(poly, y, { parapet, thick: 0.6 });
    push(r.slab, mat); if (r.parapet) push(r.parapet, pmat);
  };
  // 프리캐스트 띠: 폴리곤 둘레를 off 만큼 바깥으로 두른 띠 (+ 윗면·아랫면 링 캡)
  const bands = (poly, ys, h = 1.2, off = 0.3, closed = true, cap = true) => {
    const o = G.offsetPoly(poly, -off);
    for (const y of ys) {
      push(G.sideGeometry(o, y, y + h, 1 / 24, 1 / 12, closed), band);
      if (cap && closed) push(G.capGeometry(o, [[...poly].reverse()], y + h), band, false);
    }
  };
  // 열린 띠: 폴리곤 변 중 skip 에 없는 연속 구간마다 y0..y1 띠 (+ 윗면 스트립)
  const bandRuns = (poly, skip, y0, y1, off, cap) => {
    const n = poly.length, o = G.offsetPoly(poly, -off);
    for (let i = 0; i < n; i++) {
      if (skip.has(i)) continue;
      const j = (i + 1) % n;
      push(G.sideGeometry([o[i], o[j]], y0, y1, 1 / 24, 1 / 12, false), band);
      if (cap) { const g = new THREE.BufferGeometry(), a = poly[i], b = poly[j];
        g.setAttribute('position', new THREE.Float32BufferAttribute([a[0], y1, a[1], o[i][0], y1, o[i][1], o[j][0], y1, o[j][1], a[0], y1, a[1], o[j][0], y1, o[j][1], b[0], y1, b[1]], 3));
        g.computeVertexNormals(); if (g.attributes.normal.getY(0) < 0) { const p = g.attributes.position; for (let k = 0; k < p.count; k += 3) { const x = p.getX(k), z = p.getZ(k); p.setXYZ(k, p.getX(k + 1), y1, p.getZ(k + 1)); p.setXYZ(k + 1, x, y1, z); } g.computeVertexNormals(); }
        push(g, band, false); }
      if (y0 > 0.1) { const g = new THREE.BufferGeometry(), a = poly[i], b = poly[j];   // 아랫면 (올려다볼 때)
        g.setAttribute('position', new THREE.Float32BufferAttribute([a[0], y0, a[1], o[i][0], y0, o[i][1], o[j][0], y0, o[j][1], a[0], y0, a[1], o[j][0], y0, o[j][1], b[0], y0, b[1]], 3));
        g.computeVertexNormals(); if (g.attributes.normal.getY(0) > 0) { const p = g.attributes.position; for (let k = 0; k < p.count; k += 3) { const x = p.getX(k), z = p.getZ(k); p.setXYZ(k, p.getX(k + 1), y0, p.getZ(k + 1)); p.setXYZ(k + 1, x, y0, z); } g.computeVertexNormals(); }
        push(g, band, false); }
    }
  };
  const coping = (poly, y, off = 0.35) => { const o = G.offsetPoly(poly, -off); push(G.sideGeometry(o, y - 4, y + 0.1, 1 / 24, 1 / 12, true), band); push(G.capGeometry(o, [], y + 0.1), band); };

  // ================================================================ 2·3층 본동 (H1..TOP)
  // 2·3층: 서측부 남벽 y=76, 212 구역 x 75..125 만 y 130 까지. 서측 S1 탑 구간 (x=-12, y 48..63) 에 꼭짓점 추가
  const upper = [[75, 130], ...outline.slice(1, 18), [-12, 48], [-12, 63], [-12, 76], [75, 76]];
  // 탑 (남측 탑, S3, 북측 탑 B, S1) 과 겹치는 변 — 벽·띠를 그리지 않음 (탑 매스가 대신함)
  const SKIP = new Set([2, 3, 6, 7, 8, 11, 12, 13, 18]);
  // 각 변의 리본 범위 (축방향 절대좌표). 인덱스 = upper 변 번호 (upper[i] → upper[i+1])
  const upperGlass = {
    0: [[80, 120]],                      // y=130 (212 남벽)
    4: [[147, 162], [168, 224.5]],       // y=121 남벽
    5: [[54, 111.5]],                    // x=E 동벽 (남부)
    10: [[159, 224.5]],                  // y=0 북벽 동부 (x 145.5..156 은 북측 탑 A)
    14: [[9, 68], [81, 122]],            // y=0 북벽 서부
    19: [[64, 75]],                      // x=-12 서벽 (219E 사무실)
    20: [[6.5, 65]],                     // y=76 남벽 (서측부)
  };
  for (let i = 0; i < upper.length; i++) {
    if (SKIP.has(i)) continue;
    const a = upper[i], b = upper[(i + 1) % upper.length];
    const g = upperGlass[i] || [];
    const specs = [...rib(g, H1), ...rib(g, H2)];
    if (i === 21) specs.push({ u: [82, 85], b: H1, t: H1 + 7, kind: 'door' });                                      // 2층 옥상 출입문 (랩동 지붕으로)
    wall(a, b, H1, TOP, specs);
  }
  roof(G.offsetPoly(upper, 0.7), H3, M.roof_membrane, 0);   // 슬래브 옆면이 탑 유리 앞에 보이지 않게 안쪽으로
  bandRuns(upper, SKIP, TOP - 4, TOP + 0.1, 0.35, true);     // 프리캐스트 코니스 43..47 (+ 윗면)
  bandRuns(upper, SKIP, H1 + 8.5, H1 + 10.3, 0.3, true);     // 리본 머리 연속 띠
  bandRuns(upper, SKIP, H2 + 8.5, H2 + 10.3, 0.3, true);

  // ================================================================ 1층 외벽 (0..H1)
  const hall = hallPts();
  const w1 = [
    [[0, 130], [75, 130], win(Array.from({ length: 10 }, (_, k) => [3.5 + 7.1 * k, 7.7 + 7.1 * k]))],             // 남서동 남벽 (사진: 좁은 펀치창 10개)
    [[75, 130], [125, 130], win([[79, 90], [94, 105], [109, 120]])],                                               // 212 동 1층 (사진: 넓은 펀치창 3)
    [[125, 130], [125, 127], []],
    [[143, 121], [143, 116], []],
    [[143, 116], hall[0], []],
    [[216, 116], [230, 116], []],                                                       // P2 사진: 남벽 벽돌이 남동 모서리 기둥 근처까지 이어짐
    [[230, 116], [230, 112], []],
    [[230, 112], [216, 112], []],
    [[216, 112], [216, 76], [{ u: [78, 110], b: 1.5, t: 11.5, kind: 'glass' }]],         // 106 로비 유리벽 (동측 후퇴부 안쪽)
    [[216, 76], [E, 76], []],
    [[E, 76], [E, 46], [{ u: [66, 75], b: 0, t: 10.5, kind: 'hole' }, { u: [55, 66], b: 2, t: 11.5, kind: 'glass', pitch: 1.4 }, { u: [49, 53], b: 0, t: 7.5, kind: 'door' }]],
    [[E, 31.5], [E, 0], rib([[3, 29]], 0, 3, 11.5)],
    [[E, 0], [145.5, 0], win([[157, 163], [166, 172], [175, 181], [184, 190], [193, 199], [202, 208], [211, 217]])],
    [[124.5, 0], [62, 0], win([[77, 85], [90, 98], [103.5, 110], [112.5, 119]])],
    [[62, 0], [62, -20.8], win([[-18, -3]])],                                               // 북서동 동벽
    [[62, -20.8], [0, -20.8], win([[4.5, 11.5], [17.5, 24.5], [31.5, 38.5], [44.5, 51.5], [57.5, 61.5]])],
    [[0, -20.8], [0, 0], [{ u: [-16, -12.5], b: 0, t: 7.5, kind: 'door' }]],
    [[0, 0], [0, 20], []],
    [[0, 20], [-12, 20], []],
    [[-12, 20], [-12, 48], []],
    [[-12, 63], [-12, 76], rib([[64, 75]], 0, 3, 11.5)],
    [[-12, 76], [0, 76], []],
    [[0, 76], [0, 130], win([[84, 91], [92, 99], [104, 111], [112, 118], [119, 125]])],                            // 남서동 서벽
  ];
  for (const [a, b, specs] of w1) wall(a, b, 0, H1, specs);
  for (let i = 0; i < hall.length - 1; i++) wall(hall[i], hall[i + 1], 0, BAND0, []);       // 강당 곡면 벽 (무창)
  push(G.sideGeometry(G.offsetPoly([[143, 116], ...hall, [230, 116]], -0.3), 0, 4, 1 / 24, 1 / 12, false), band);   // 강당 벽 하부 프리캐스트 (사진: 높은 베이스 + 루버)
  for (const x of [168, 172]) push(G.box(3, 1.6, 0.2, x, 1.5, 118.0), M.dark);
  // 1층 프리캐스트 베이스 (0..2.5) 와 1층 머리 큰 띠 (12..16.5) — 본동 외곽 + 단층동
  const base1 = [[0, 130], [125, 130], [125, 127], [143, 127], [143, 116], ...hall, [230, 116], [230, 112], [216, 112], [216, 76], [E, 76], [E, 46], [245, 46], [245, 31.5], [E, 31.5], [E, 0],
    [145.5, 0], [145.5, -4], [124.5, -4], [124.5, 0], [62, 0], [62, -20.8], [0, -20.8], [0, 0], [0, 20], [-12, 20], [-12, 76], [0, 76]];
  bands(base1, [0], 2.5, 0.25, true, false);
  const bandPoly = [[0, 130], [125, 130], [125, 127], [143, 127], [143, 121], [E, 121], [E, 46], [245, 46], [245, 31.5], [E, 31.5], [E, 0],
    [145.5, 0], [145.5, -4], [124.5, -4], [124.5, 0], [62, 0], [62, -20.8], [0, -20.8], [0, 0], [0, 20], [-12, 20], [-12, 76], [0, 76]];
  bands(bandPoly, [BAND0], H1 - BAND0, 0.35);
  // 북측 주출입구 로비 유리벽 (아치 출입구 뒤 y=3)
  wall([145.5, 3], [124.5, 3], 0, BAND0, [{ u: [125, 145], b: 0.3, t: 11.5, kind: 'glass', pitch: 3 }]);
  for (const [x0, x1] of [[127.5, 133], [136, 141.5]]) { push(G.box(x1 - x0, 7.5, 0.25, (x0 + x1) / 2, 0, 2.6), M.dark); push(G.box(0.2, 7.5, 0.3, (x0 + x1) / 2, 0, 2.55), M.trim); }

  // ---- 남측 열주 (2층 아래 후퇴부): 원형 짙은 기둥 + 소핏
  push(G.box(E - 143, 0.8, 45, (E + 143) / 2, BAND0 - 0.8, 98.5), M.trim);
  for (const x of [144.8, 177, 210, 233.3]) {
    push(G.cylinder(1.1, BAND0, x, 0, 119.7, 14), colm);
    push(G.cylinder(1.35, 0.6, x, BAND0 - 1.4, 119.7, 14), colm);
    push(G.box(2.6, 0.5, 2.6, x, 0, 119.7), band);
  }

  // ---- 단층부 지붕: 북서동, 남서 랩동(+ 가운데 올라간 부분) — 지붕 = 큰 띠 상단 (16.5) + 낮은 프리캐스트 캡
  roof([[0, 0], [62, 0], [62, -20.8], [0, -20.8]], HW, M.roof_membrane, 0.8, band);
  const sw = [[0, 130], [75, 130], [75, 76], [0, 76]];
  roof(sw, HW, M.roof_membrane, 0.8, band);
  const swHi = [[20, 124], [72, 124], [72, 88], [20, 88]];
  push(G.sideGeometry(swHi, HW, HW + 5, 1 / 24, 1 / 12, true), brick); roof(swHi, HW + 5, M.roof_membrane, 0.8, band);
  for (const [x, z] of [[18.5, 93.5], [35.5, 93.5], [43.5, 93.5], [25.5, 105.5], [35.5, 105.5], [44.5, 105.5]]) push(G.box(3, 1.5, 3, x, HW + 5, z), M.metal);   // 옥상 해치

  // ---- 남측 보도변 철제 난간 (메시 패널 → 레일 3줄 + 기둥 8' 간격) 과 낮은 프리캐스트 연석
  const rail = (x0, x1, z) => {
    push(G.box(x1 - x0, 0.5, 0.8, (x0 + x1) / 2, 0, z), band, false);
    for (const y of [0.9, 2.2, 3.5]) push(G.box(x1 - x0, 0.15, 0.15, (x0 + x1) / 2, y, z), bronze, false);
    const n = Math.max(1, Math.round((x1 - x0) / 8));
    for (let k = 0; k <= n; k++) push(G.box(0.2, 3.6, 0.2, x0 + (x1 - x0) * k / n, 0, z), bronze, false);
  };
  rail(-1, 124, 135); rail(146, 214, 124);

  // ---- 북측 실외기 3대, 서측 장비 패드
  for (const [x0, x1] of [[76, 82], [89, 95], [96, 101]]) push(G.box(x1 - x0, 3, 4.5, (x0 + x1) / 2, 0, -2.5), M.metal);
  push(G.box(2.5, 4, 10, -8.5, 0, 90), M.metal); push(G.box(2.5, 4, 5, -8.5, 0, 112.5), M.metal);

  // ---- 동측 출입구: 전실 134 (x E..243, y 66..75) + 프리캐스트 캐노피 띠 (사인) + 그 위 1/4 원통 유리 볼트
  {
    const v = [[E, 75], [243, 75], [243, 66], [E, 66]];
    const vs = [[{ u: [67, 74], b: 0.5, t: 11, kind: 'glass', pitch: 3 }], [{ u: [67.5, 73.5], b: 0, t: 7.5, kind: 'door' }, { u: [67, 74], b: 7.6, t: 11, kind: 'glass', pitch: 3 }], [{ u: [67, 74], b: 0.5, t: 11, kind: 'glass', pitch: 3 }]];
    for (let i = 0; i < 3; i++) wall(v[i], v[i + 1], 0, BAND0, vs[i]);
    const X1 = 243.5, Z0 = 47, Z1 = 75, V0 = 56;   // 캐노피 띠는 평면대로 y 47..75, 유리 볼트는 사진상 더 좁음 (y 56..75)
    push(G.box(X1 - E, H1 - BAND0, Z1 - Z0, (E + X1) / 2, BAND0, (Z0 + Z1) / 2), band);                  // 캐노피 띠 (12..16.5)
    for (const z of [48.5, 64.5]) push(G.box(2, BAND0, 2, X1 - 1, 0, z), brick);                           // 벽돌 피어
    push(G.box(0.3, 1.4, 18, X1 + 0.16, 13.6, 61), M.dark);                                                 // 건물명 사인 (짙은 글자 띠)
    const R = 9, n = 8, y0 = H1;                                                                            // 유리 볼트: 축 = z, 중심 (E, H1)
    const quad = (a, b, c, d, mat) => {
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute([...a, ...b, ...c, ...a, ...c, ...d], 3));
      g.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1], 2)); g.computeVertexNormals();
      push(g, mat, false);
    };
    for (let k = 0; k < n; k++) {
      const a0 = Math.PI / 2 * k / n, a1 = Math.PI / 2 * (k + 1) / n;
      const q0 = [E + R * Math.cos(a0), y0 + R * Math.sin(a0)], q1 = [E + R * Math.cos(a1), y0 + R * Math.sin(a1)];
      quad([q0[0], q0[1], Z1], [q0[0], q0[1], V0], [q1[0], q1[1], V0], [q1[0], q1[1], Z1], pane);          // 바깥 법선
      push(G.box(0.3, 0.3, Z1 - V0, q1[0], q1[1] - 0.15, (V0 + Z1) / 2), bronze);                          // 가로 리브
    }
    for (let z = V0; z <= Z1 + 0.01; z += (Z1 - V0) / 7) for (let k = 0; k < n; k++) {                      // 아치 리브
      const a = Math.PI / 2 * (k + 0.5) / n; push(G.box(0.3, R * Math.PI / 2 / n, 0.3, E + R * Math.cos(a), y0 + R * Math.sin(a) - R * Math.PI / 4 / n, z), bronze);
    }
    for (const [z, sg] of [[V0, -1], [Z1, 1]]) {                                                            // 볼트 양끝 1/4 원판 유리
      const pos = [];
      for (let k = 0; k < n; k++) {
        const a0 = Math.PI / 2 * k / n, a1 = Math.PI / 2 * (k + 1) / n;
        const t = [[E, y0, z], [E + R * Math.cos(a0), y0 + R * Math.sin(a0), z], [E + R * Math.cos(a1), y0 + R * Math.sin(a1), z]];
        if (sg < 0) t.reverse();
        for (const p of t) pos.push(...p);
      }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(new Array(pos.length / 3 * 2).fill(0), 2)); g.computeVertexNormals();
      push(g, pane, false);
    }
  }
  // ---- 남동 테라스 (x 216..240, y 76..112, +2' 단) + 플랜터 벽 + 곡면 외부계단 (평면; 사진에서는 관목에 가려 일부만 보임)
  {
    const C = [240.5, 98], R0 = 1.5, R1 = 12.5, a0 = -165 * Math.PI / 180, a1 = -95 * Math.PI / 180, n = 4;
    const sect = (ra, rb, s0, s1, k = 6) => {
      const ring = [];
      for (let i = 0; i <= k; i++) { const a = s0 + (s1 - s0) * i / k; ring.push([C[0] + ra * Math.cos(a), C[1] + ra * Math.sin(a)]); }
      for (let i = k; i >= 0; i--) { const a = s0 + (s1 - s0) * i / k; ring.push([C[0] + rb * Math.cos(a), C[1] + rb * Math.sin(a)]); }
      return ring;
    };
    const t = [[216, 112], [240, 112], [240, 76], [216, 76]];
    const wedge = sect(0.01, R1 + 0.3, a0, a1, 12);
    push(G.capGeometry(t, [wedge.slice().reverse()], 2.0), M.walk, false);
    push(G.sideGeometry(t, 0, 2.0, 1 / 24, 1 / 12, true), M.concrete, false);
    push(G.sideGeometry(wedge.slice().reverse(), 0, 2.0, 1 / 24, 1 / 12, true), M.concrete, false);
    push(G.box(3, 3.0, 8, 241.5, 0, 80), brick); push(G.box(3, 3.0, 15, 241.5, 0, 104.5), brick);
    push(G.box(27.5, 3.0, 3, 229.5, 0, 110.5), brick);
    push(G.box(3, 2.6, 3, C[0], 0, C[1]), brick);
    for (let i = 0; i < n; i++) {
      const s0 = a0 + (a1 - a0) * i / n, s1 = a0 + (a1 - a0) * (i + 1) / n, y = 2.0 - 0.5 * (i + 1);
      if (y <= 0) continue;
      const ring = sect(R0, R1, s0, s1);
      push(G.capGeometry(ring, [], y), M.walk, false); push(G.sideGeometry(ring, 0, y, 1 / 24, 1 / 12, true), M.concrete, false);
    }
  }
  // ---- 서측 브리지 접속부 (Technology Building 모듈의 브리지가 x=-12, y≈35 에서 끝남 → 짧은 접속 스터브)
  {
    const d = [-0.848, 0.529], c = [-12 + d[0] * 1.5, 35 + d[1] * 1.5], ry = -Math.atan2(d[1], d[0]);
    push(G.box(3.2, 1.2, 10.6, c[0], 17.4, c[1], { ry }), M.metal);
    push(G.box(3.2, 9.4, 10.2, c[0], 18.6, c[1], { ry }), M.glass, false);
    push(G.box(3.2, 2.0, 10.6, c[0], 28, c[1], { ry }), M.metal);
  }

  // ================================================================ 박공 유리 계단탑 (사진)
  // rect = [x0, x1, z0, z1], face = 'n'|'s'|'e'|'w' (박공·유리 면), eave/ridge 높이, glass = [{u, b, t, rise}] (면 축 절대좌표)
  const mk = (arr) => { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(arr, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(arr.filter((_, i) => i % 3 !== 1).map(v => v / 24), 2)); g.computeVertexNormals(); return g; };
  const flip = (arr) => { const o = []; for (let i = 0; i < arr.length; i += 9) o.push(...arr.slice(i + 3, i + 6), ...arr.slice(i, i + 3), ...arr.slice(i + 6, i + 9)); return o; };
  const gableTower = ({ rect, face, eave, ridge, glass, arch, sideGlass }) => {
    const [x0, x1, z0, z1] = rect;
    const poly = [[x0, z1], [x1, z1], [x1, z0], [x0, z0]];          // CCW
    const edges = { s: [poly[0], poly[1]], e: [poly[1], poly[2]], n: [poly[2], poly[3]], w: [poly[3], poly[0]] };
    for (const k of ['s', 'e', 'n', 'w']) {
      const [a, b] = edges[k]; const specs = [];
      if (k === face) {
        for (const gl of glass) {
          const tr = []; for (let y = gl.b + 6.6; y < gl.t - gl.rise - 1; y += 6.6) tr.push(y);           // 가로 멀리언 ~6.6' 간격 (사진)
          specs.push({ u: gl.u, b: gl.b, t: gl.t, rise: gl.rise, kind: 'glass', pitch: gl.pitch || 3.2, trans: tr });
          const [ea, eb] = edges[k], axk = Math.abs(eb[0] - ea[0]) >= Math.abs(eb[1] - ea[1]) ? 0 : 1, sgk = Math.sign(eb[axk] - ea[axk]);
          const s0 = (gl.u[0] - ea[axk]) * sgk, s1 = (gl.u[1] - ea[axk]) * sgk, lo = Math.min(s0, s1), hi = Math.max(s0, s1);
          for (const y of [H1, H2, H3]) for (const [q0, q1] of [[lo - 2.2, lo], [hi, hi + 2.2]]) wbox(ea, eb, q0, q1, y - 0.5, y + 0.9, -0.25, 0.7, band);   // 피어의 프리캐스트 블록
        }
        if (arch) specs.push({ u: arch.u, b: 0, t: arch.t, rise: arch.rise, kind: 'hole' });
      }
      if (sideGlass && sideGlass[k]) specs.push({ ...sideGlass[k], kind: 'glass', pitch: 3, trans: [H2 + 0.5] });
      wall(a, b, 0, eave, specs);
    }
    // 아치 출입구: 프리캐스트 아치 테두리 + 안쪽 어두운 문 (2' 후퇴)
    if (arch) {
      const [a, b] = edges[face];
      const ax = Math.abs(b[0] - a[0]) >= Math.abs(b[1] - a[1]) ? 0 : 1, sg = Math.sign(b[ax] - a[ax]);
      const o = { s: (arch.u[0] - a[ax]) * sg, e: (arch.u[1] - a[ax]) * sg, b: 0, t: arch.t, rise: arch.rise }; if (o.s > o.e) [o.s, o.e] = [o.e, o.s];
      const outer = holePts({ ...o, s: o.s - 1.2, e: o.e + 1.2, t: o.t + 1.2, rise: o.rise + 0.4 });
      push(shapeGeom(outer, [holePts(o)], a, b, -0.3), band);
      push(shapeGeom(holePts(o), [], a, b, 2.5), pane, false);
      for (let k = 0; k <= 4; k++) wbox(a, b, o.s + (o.e - o.s) * k / 4 - 0.2, o.s + (o.e - o.s) * k / 4 + 0.2, 0, o.t - o.rise, 2.3, 0.3, bronze);
      wbox(a, b, o.s, o.e, 8, 8.4, 2.3, 0.3, bronze);
      wbox(a, b, o.s, o.e, 0, 0.02, 1.25, 2.5, M.walk);
    }
    // 박공: 앞·뒤 삼각 벽 (벽돌) + 지붕 경사 (짙은 금속) + 프리캐스트 코핑, 다이아몬드 장식
    const ns = face === 'n' || face === 's';
    const [ua, ub] = ns ? [x0, x1] : [z0, z1];
    const [va, vb] = ns ? [z0, z1] : [x0, x1];
    const um = (ua + ub) / 2;
    const P = (u, v, y) => ns ? [u, y, v] : [v, y, u];
    const tri = [], slope = [];
    for (const v of [va, vb]) tri.push(...P(ua, v, eave), ...P(ub, v, eave), ...P(um, v, ridge));
    slope.push(...P(ua, va, eave), ...P(um, va, ridge), ...P(um, vb, ridge), ...P(ua, va, eave), ...P(um, vb, ridge), ...P(ua, vb, eave));
    slope.push(...P(ub, va, eave), ...P(ub, vb, eave), ...P(um, vb, ridge), ...P(ub, va, eave), ...P(um, vb, ridge), ...P(um, va, ridge));
    const mkV = (arr) => { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(arr, 3)); const uv = []; for (let i = 0; i < arr.length; i += 3) uv.push((ns ? arr[i] : arr[i + 2]) / 24, arr[i + 1] / 12); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.computeVertexNormals(); return g; };
    push(mkV(tri), brick); push(mkV(flip(tri)), brick);       // 양면
    push(mk(slope), M.roof_dark); push(mk(flip(slope)), M.roof_dark);
    const fv = face === 'n' || face === 'w' ? va : vb;       // 박공 앞면 v
    const fo = face === 'n' || face === 'w' ? -1 : 1;        // 앞면 바깥 방향 (v 축)
    const L = Math.hypot(um - ua, ridge - eave), ang = Math.atan2(ridge - eave, um - ua);
    for (const v of [va, vb]) for (const sgn of [1, -1]) {   // 코핑 (경사변 따라)
      const g = new THREE.BoxGeometry(L + 1.0, 0.9, 1.6);
      const m = new THREE.Matrix4().makeRotationZ(sgn * ang);
      if (!ns) m.premultiply(new THREE.Matrix4().makeRotationY(-Math.PI / 2));
      const cu = sgn > 0 ? (ua + um) / 2 : (um + ub) / 2, c = P(cu, v, (eave + ridge) / 2 + 0.3);
      m.setPosition(c[0], c[1], c[2]); g.applyMatrix4(m); push(g, band);
    }
    bands(poly, [eave - 1.5], 1.5, 0.3);                      // 처마 프리캐스트 띠
    { const g = new THREE.BoxGeometry(2.6, 2.6, 0.5); const m = new THREE.Matrix4().makeRotationZ(Math.PI / 4); if (!ns) m.premultiply(new THREE.Matrix4().makeRotationY(Math.PI / 2));
      const c = P(um, fv + fo * 0.3, eave + (ridge - eave) * 0.4); m.setPosition(c[0], c[1], c[2]); g.applyMatrix4(m); push(g, band); }
  };
  // 북측 주출입구 탑 B (돌출 베이, 넓은 유리 + 아치 출입구) 와 동쪽의 낮은 탑 A (좁은 유리, P4 사진에서 왼쪽 = 동)
  gableTower({ rect: [124.5, 145.5, -4, 14], face: 'n', eave: 57, ridge: 66.5, arch: { u: [127.5, 142.5], t: 12, rise: 2.5 },
    glass: [{ u: [127, 143], b: H1 + 0.5, t: 54, rise: 2.5 }] });
  gableTower({ rect: [145.5, 156, -1, 14], face: 'n', eave: 55, ridge: 62.5,
    glass: [{ u: [147.5, 154], b: H1 + 0.5, t: 52.5, rise: 2 }] });
  // 남측 탑 (x 125..143, 정면 y=127): 넓은 유리 + 아치 출입구, 동측 옆면 유리 슬롯
  gableTower({ rect: [125, 143, 108, 127], face: 's', eave: 54, ridge: 62.5, arch: { u: [128.5, 139.5], t: 12, rise: 2.5 },
    glass: [{ u: [128, 140], b: H1 + 0.5, t: 50, rise: 2.5 }], sideGlass: { e: { u: [121.8, 125.6], b: H1 + 0.5, t: 48 } } });
  // 동측 S3 탑 (x 222..245, y 31.5..46): 동향 박공
  gableTower({ rect: [222, 245, 31.5, 46], face: 'e', eave: 54, ridge: 61.5,
    glass: [{ u: [33.5, 44], b: H1 + 0.5, t: 50, rise: 2.5 }] });
  // 서측 S1 탑 (x -12..10, y 48..63): 서향 박공 (사진 없음 → S3 와 같게)
  gableTower({ rect: [-12, 10, 48, 63], face: 'w', eave: 54, ridge: 61.5,
    glass: [{ u: [50, 61], b: H1 + 0.5, t: 50, rise: 2.5 }] });

  // ================================================================ 옥상: 기계실 401·402, 상부 아트리움 403/워크웨이 404 (천창)
  const ph = (poly, h, mat = brick, par = 0.8, y0 = H3) => { push(G.sideGeometry(poly, y0, H3 + h, 1 / 24, 1 / 12, true), mat); roof(poly, H3 + h, M.roof_membrane, par, band); };
  ph([[126, 47], [146, 47], [146, 14], [126, 14]], PH);                 // P4 사진: 북측 탑 양옆으로 기계실이 보이지 않음 → 탑 뒤 범위로 축소
  ph([[126, 108], [146, 108], [146, 88], [126, 88]], PH);
  ph([[126, 88], [150, 88], [150, 47], [126, 47]], 7, brick, 0.6);
  for (let k = 0; k < 6; k++) { const z0 = 48 + 5 * k; push(G.gableRoof([[128, z0 + 5], [148, z0 + 5], [148, z0], [128, z0]], H3 + 7.2, 0.6, 0), M.glass, false); }   // 리지형 천창
  push(G.box(20.6, 0.4, 30.6, 138, H3 + 6.8, 63), M.dark);
  for (const [x, z] of [[136, 20], [136, 33], [136, 93], [136, 102]]) push(G.box(8, 3, 6, x, H3 + PH, z), M.metal);
  push(G.box(12, 5, 10, 216, H3, 19), M.metal); push(G.box(8, 4, 8, 174, H3, 26), M.metal);   // 옥상 유닛 (영상)
  for (const [x0, z0, x1, z1] of [[2, 2, 10, 10], [100, 18, 108, 26], [212, 1, 220, 9], [225, 110, 233, 118], [116, 112, 124, 120], [12, 67, 20, 75]])
    push(G.box(x1 - x0, 0.15, z1 - z0, (x0 + x1) / 2, H3, (z0 + z1) / 2), M.walk, false);

  const grp = new THREE.Group();
  for (const m of G.mergeByMaterial(parts)) grp.add(m);
  return grp;
}
