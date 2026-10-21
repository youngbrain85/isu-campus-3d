// Sycamore Towers 기숙사 단지 — Mills / Blumberg / Rhoads / Cromwell Hall (12층 타워 4동, 1964–65) + 2층 다이닝 커먼스 기단
// 사진·위성 기반 모델 (도면 없음). 근거: Street View vp2·vp3(Blumberg), vp6·vp7(Cromwell), vp8·vp9(Rhoads), vp10·vp11(Mills),
//   vp12·vp13(커먼스), Esri z20(겨울)·z19(여름) 위성. 타워는 하나의 함수 tower() 로 만들고 각 OSM 풋프린트 모서리에 그대로 맞춘다.
//
// ■ 타워 (4동 거의 동일)
//   층수: 지상 1층(높은 필로티형 기단) + 기준층 11개 = 12층. 기단: 백색 프리캐스트 기둥(2.6 ft 각, 상부 캐피털) 0..14.5 ft,
//     그 위 프리캐스트 띠(바닥판 단부) 14.5..19.5 ft. 기준층 층고 9.4 ft (사진 비례: 층 피치 ≈ 기단 높이/2.1), 최상층 머리띠 + 파라펫 125.5 ft.
//     (vp7_329 확대: 기둥 330px : 띠 125px : 층 피치 220px → 14.3 : 5.4 : 9.5 ft. vp11_187 정면: 기단 21 ft + 11.2 층)
//   긴 면(남·북): 백색 프리캐스트 "에그크레이트" 격자. 창 피치 ≈ 3.95 ft (Mills 북면 정면 사진에서 동측 날개 60 ft 에 창 15개,
//     서측 35.6 ft 에 8~9개). 창마다 깊은 개구(깊이 1.5 ft): 아래는 바깥으로 기울어진 경사 스팬드럴(2.3 ft), 위는 수평 헤드 소핏,
//     좌우는 벌어진(splayed) 잼, 개구 전면폭 2.75 ft / 유리폭 1.9 ft, 유리 높이 4.9 ft. 층마다 헤드 위 평탄 띠 2.2 ft.
//   바깥쪽 긴 면 1곳에 전층 유리 커튼월 띠(폭 ≈ 27 ft, 2층~지붕 위 130 ft, 층마다 스팬드럴 띠·수직 멀리언 ≈ 4.5 ft):
//     Mills 북면 = OSM 풋프린트의 3 ft 돌출부(x −502.4..−475.2), Rhoads 북면 x −645.4..−618.2 (Mills 의 거울상, vp9_175 로 확인),
//     Blumberg 남면 x −503..−478, Cromwell 남면 x −646..−624 (z20 위성에서 남면 유리 띠 위치 측정). 안쪽(커먼스 쪽) 면은 격자만.
//   짧은 면(동·서): 적갈색 벽돌 무창 벽. 중앙에 OSM 의 6 ft × 16.6 ft 오목부 = 계단실: 벽돌이 지면까지 내려오고 층간(계단참) 높이에
//     작은 창 2개씩(흰 프리캐스트 테두리) 세로 한 줄 (vp2_302, vp7_329). 기단 띠(프리캐스트)는 짧은 면에도 둘러진다.
//   1층: 기둥 뒤로 3.5 ft 후퇴한 유리 커튼(하부 유리 0.3..8.0, 연녹색 스팬드럴 8.0..9.8, 상부 유리 9.8..14.5, 멀리언 5 ft),
//     긴 면 6베이(≈20 ft, Mills 정면 사진의 기둥 간격) — 남측 타워 남면 모서리 쪽 2베이 앞에 회색 금속 루버 스크린(높이 7 ft).
//   지붕: 평지붕(123 ft), 파라펫 125.5, 파라펫 위 난간(기둥 8 ft 간격 + 상부 레일, vp11_187), 중앙 기계실/펜트하우스 80 × 28 ft
//     [항공사진으로 수정] 높이 12.5 ft 반투명 패널 스크린 박스 (sycamore_towers/f 야경에서 내부 조명으로 빛나는 격자 상자; 비교
//     scratch/aerial/sycamore_towers.png), 커튼월 띠는 지붕 위로 유리 랜턴(깊이 12 ft)으로 올라감.
//   가정: 긴 안쪽 면에도 같은 격자, 사진에 없는 1층 출입구 위치(유리면에 포함), 계단실 창의 정확한 높이(층 사이 중간으로 둠).
//
// ■ 다이닝 커먼스 기단 (way/283611919, 1965)
//   타워 4동 사이를 채우는 낮은 매스. 서면 사진(vp12_103/058): 벽돌 기초(0..3.5 ft, 반지하층 채광 영역) 위 프리캐스트 패널 벽
//     (주층 바닥 +3.5 ft, 벽 상단 15.5 ft), 약 10 ft 간격 프리캐스트 피laster + 액자형 패널, 일부 베이에 좁고 긴 창 2개씩,
//     계단(4단) + 출입문. 뒤쪽 중앙부는 한 단 높은 볼륨(19.5 ft) — 사진에서 서측 벽 뒤로 보이는 높은 파라펫, 위성의 지붕 단차선 z≈540/652.
//   지붕: 백색 멤브레인, 위성에서 읽은 옥상 기계설비(덕트·유닛) 박스. 타워와 맞닿는 모서리는 벽을 생략(타워 내부).
//   가정: 동·북·남면은 서면과 같은 패널 벽(사진 없음), 오목부(6 ft) 안쪽은 유리 출입구.
import * as THREE from 'three';

export const meta = {
  id: 'towers', name: 'Sycamore Towers (Mills, Blumberg, Rhoads, Cromwell Halls + dining commons)', osm: 'way/236260776',
  extraIds: ['way/236260171', 'way/236260775', 'way/236260173', 'way/283611919'],
  anchor: [0, 0], rotation: 0, height: 136,
  preset: { pos: [-290, 190, 880], tgt: [-560, 40, 595] },
  sheets: 'Street View vp2–vp13 (2019–2023), Esri imagery z20/z19',
};

// ---- 풋프린트 (viewer/assets/site.json, 월드 ft, CCW)
const FP = {
  mills: [[-538.0, 438.9], [-532.1, 438.9], [-532.0, 455.4], [-538.0, 455.5], [-537.8, 479.5], [-490.2, 479.1], [-415.5, 478.6], [-415.7, 455.1], [-421.8, 455.1], [-421.9, 438.5], [-415.6, 438.5], [-415.8, 415.2], [-475.2, 415.6], [-475.3, 412.3], [-502.4, 412.5], [-502.4, 415.6], [-538.1, 415.9]],
  blumberg: [[-534.6, 724.5], [-534.6, 731.3], [-528.7, 731.2], [-528.5, 747.8], [-534.6, 747.9], [-534.4, 771.8], [-412.1, 770.9], [-412.3, 747.5], [-418.4, 747.5], [-418.5, 730.9], [-412.3, 730.9], [-412.4, 707.7], [-487.5, 708.2], [-534.7, 708.6]],
  rhoads: [[-704.8, 440.2], [-698.9, 440.2], [-698.7, 456.8], [-704.8, 456.8], [-704.6, 480.6], [-624.5, 480.1], [-582.4, 479.8], [-582.5, 456.4], [-588.6, 456.4], [-588.7, 448.1], [-588.8, 439.9], [-582.5, 439.8], [-582.6, 416.7], [-704.9, 417.6]],
  cromwell: [[-702.5, 731.5], [-696.6, 731.5], [-696.4, 748.1], [-702.5, 748.1], [-702.3, 772.0], [-580.0, 771.1], [-580.2, 747.7], [-586.3, 747.7], [-586.4, 731.2], [-580.2, 731.1], [-580.3, 708.2], [-629.7, 708.6], [-702.6, 709.1]],
  commons: [[-488.6, 529.9], [-488.6, 521.3], [-483.2, 521.2], [-483.4, 486.3], [-490.2, 486.4], [-490.2, 479.1], [-537.8, 479.5], [-582.4, 479.8], [-624.5, 480.1], [-624.5, 487.4], [-630.4, 487.4], [-630.2, 521.4], [-624.6, 521.4], [-624.5, 530.1], [-630.7, 530.1], [-629.8, 659.7], [-624.1, 659.7], [-624.1, 668.9], [-630.0, 668.9], [-629.7, 708.6], [-580.3, 708.2], [-569.9, 708.2], [-569.8, 724.7], [-534.6, 724.5], [-534.7, 708.6], [-487.5, 708.2], [-487.8, 661.0], [-431.9, 660.6], [-432.9, 529.5]],
};
// 타워별: 커튼월 띠가 있는 면(N/S)과 x 범위 (Mills 는 풋프린트 돌출부에서 자동 검출), 금속 스크린을 둘 바깥 모서리
const TOWERS = [
  { key: 'mills', face: 'N', gx: null, screens: null },
  { key: 'rhoads', face: 'N', gx: [-645.4, -618.2], screens: null },
  { key: 'blumberg', face: 'S', gx: [-503.0, -478.0], screens: 'E' },
  { key: 'cromwell', face: 'S', gx: [-646.0, -621.0], screens: 'W' },
];

// ---- 수직 치수 (ft, 지면 = 0)
const Y_PIER = 14.5, Y_GRID = 19.5, FLR = 9.4, NFL = 11;
const Y_TOP = Y_GRID + FLR * NFL;           // 122.9 — 마지막 층 상단
const Y_PAR = 125.5, Y_ROOF = 123.0, Y_CW = 130.0;
const W_SLOPE = 2.3, W_HEAD = 7.2;          // 층 기준 경사 스팬드럴 상단(=창대) / 헤드
const DEEP = 1.25, PITCH = 3.95, OPEN = 3.0, SPLAY = 0.3, MARG = 0.6;
const INSET = 3.5;                          // 1층 유리면 후퇴

const UP = new THREE.Vector3(0, 1, 0);

export function build(M, G) {
  const phPanel = M.precast.clone(); phPanel.color = new THREE.Color(1.12, 1.1, 1.0); phPanel.emissive = new THREE.Color(0x2a2618); phPanel.name = 'towers_ph_panel';   // 반투명 스크린 패널
  const parts = [];
  const P = (geom, mat, cast) => parts.push({ geom, mat, cast });
  const precast = M.precast.clone(); precast.color = new THREE.Color(1.13, 1.11, 1.07);
  const brick = M.brick_red;
  const spandrel = new THREE.MeshStandardMaterial({ color: 0xb7c8bf, roughness: 0.5, metalness: 0.2 });
  const cwBand = new THREE.MeshStandardMaterial({ color: 0x9fb4c4, roughness: 0.4, metalness: 0.3 });
  const frame = new THREE.MeshStandardMaterial({ color: 0xc9ccce, roughness: 0.5, metalness: 0.4 });
  const screen = M.metal;

  // ------------------------------------------------------------ 사각형 누적기 (재질별 비인덱스 삼각형)
  const acc = new Map();
  const buf = mat => { if (!acc.has(mat)) acc.set(mat, { pos: [], uv: [], cast: true }); return acc.get(mat); };
  /** 사각형 a,b,c,d (둘레 순서). hint = 바깥 법선 방향 [x,y,z] — 감김을 자동 보정. uvs 생략 시 평면 투영 */
  function quad(mat, a, b, c, d, hint, uvs) {
    const ab = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], ac = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
    const n = [ab[1] * ac[2] - ab[2] * ac[1], ab[2] * ac[0] - ab[0] * ac[2], ab[0] * ac[1] - ab[1] * ac[0]];
    let V = [a, b, c, d], U = uvs;
    if (n[0] * hint[0] + n[1] * hint[1] + n[2] * hint[2] < 0) { V = [a, d, c, b]; if (U) U = [U[0], U[3], U[2], U[1]]; }
    if (!U) {
      if (Math.abs(hint[1]) > 0.7 * Math.hypot(hint[0], hint[1], hint[2])) U = V.map(p => [p[0] / 24, p[2] / 24]);
      else { const L = Math.hypot(hint[0], hint[2]) || 1, tx = hint[2] / L, tz = -hint[0] / L; U = V.map(p => [(p[0] * tx + p[2] * tz) / 24, p[1] / 12]); }
    }
    const B = buf(mat);
    for (const i of [0, 1, 2, 0, 2, 3]) { B.pos.push(...V[i]); B.uv.push(...U[i]); }
  }
  // 모서리 프레임: 2D 선분 p0→p1 에서 s(진행), o(바깥 +), y
  const frameOf = (p0, p1) => {
    const dx = p1[0] - p0[0], dz = p1[1] - p0[1], L = Math.hypot(dx, dz);
    const ex = [dx / L, dz / L], n = [-dz / L, dx / L];
    return { p0, p1, L, ex, n, ry: -Math.atan2(dz, dx), hint: [n[0], 0, n[1]], ehint: [ex[0], 0, ex[1]],
      P: (s, o, y) => [p0[0] + ex[0] * s + n[0] * o, y, p0[1] + ex[1] * s + n[1] * o],
      Q: (s, o) => [p0[0] + ex[0] * s + n[0] * o, p0[1] + ex[1] * s + n[1] * o] };
  };
  /** 수직 면 띠: 선분 s0..s1, 바깥오프셋 o, 높이 y0..y1 */
  const vrect = (mat, f, s0, s1, o, y0, y1, uvs) => quad(mat, f.P(s0, o, y0), f.P(s1, o, y0), f.P(s1, o, y1), f.P(s0, o, y1), f.hint, uvs);
  const boxOn = (mat, f, s, o, y, w, h, d) => { const c = f.Q(s, o); P(G.box(w, h, d, c[0], y, c[1], { ry: f.ry }), mat); };

  // ------------------------------------------------------------ 폴리곤 유틸
  function mergeCollinear(poly) {
    let pts = poly.slice(), changed = true;
    while (changed) {
      changed = false;
      for (let i = 0; i < pts.length; i++) {
        const a = pts[(i - 1 + pts.length) % pts.length], b = pts[i], c = pts[(i + 1) % pts.length];
        const u = [b[0] - a[0], b[1] - a[1]], v = [c[0] - b[0], c[1] - b[1]];
        const lu = Math.hypot(...u), lv = Math.hypot(...v);
        if (lu < 0.3 || lv < 0.3 || (Math.abs(u[0] * v[1] - u[1] * v[0]) / (lu * lv) < 0.03 && u[0] * v[0] + u[1] * v[1] > 0)) { pts.splice(i, 1); changed = true; break; }
      }
    }
    return pts;
  }
  const lineX = (a, b, c, d) => {          // 두 직선(a-b, c-d) 교점
    const r = [b[0] - a[0], b[1] - a[1]], s = [d[0] - c[0], d[1] - c[1]], den = r[0] * s[1] - r[1] * s[0];
    if (Math.abs(den) < 1e-9) return [b[0], b[1]];
    const t = ((c[0] - a[0]) * s[1] - (c[1] - a[1]) * s[0]) / den;
    return [a[0] + r[0] * t, a[1] + r[1] * t];
  };

  // ============================================================ 타워
  function tower(spec) {
    let poly = mergeCollinear(FP[spec.key]);
    // 주축 = 가장 긴 변
    let ax = [1, 0], best = 0;
    for (let i = 0; i < poly.length; i++) { const a = poly[i], b = poly[(i + 1) % poly.length], L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (L > best) { best = L; ax = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]; } }
    // 얕은 돌출부(≤ 4.5 ft) 검출 → 제거하고 커튼월 띠로 기록
    let bump = null;
    for (let i = 0; i < poly.length && !bump; i++) {
      const n = poly.length, A = poly[i], B = poly[(i + 1) % n], C = poly[(i + 2) % n], D = poly[(i + 3) % n];
      const lab = Math.hypot(B[0] - A[0], B[1] - A[1]), lbc = Math.hypot(C[0] - B[0], C[1] - B[1]), lcd = Math.hypot(D[0] - C[0], D[1] - C[1]);
      if (lab < 4.5 && lcd < 4.5 && lbc > 15) {
        const dx = D[0] - A[0], dz = D[1] - A[1], L = Math.hypot(dx, dz), nn = [-dz / L, dx / L];
        const out = (B[0] - A[0]) * nn[0] + (B[1] - A[1]) * nn[1];
        if (out > 1) { bump = { B, C, out }; poly = poly.filter(p => p !== B && p !== C); }
      }
    }
    poly = mergeCollinear(poly);
    const n = poly.length;
    const proj = p => p[0] * ax[0] + p[1] * ax[1];
    const pmin = Math.min(...poly.map(proj)), pmax = Math.max(...poly.map(proj));
    // 변 분류
    const E = [];
    for (let i = 0; i < n; i++) {
      const f = frameOf(poly[i], poly[(i + 1) % n]);
      const par = Math.abs(f.ex[0] * ax[0] + f.ex[1] * ax[1]) > 0.7;
      let type;
      if (par) type = f.L > 30 ? 'long' : 'rside';
      else { const pm = proj([(f.p0[0] + f.p1[0]) / 2, (f.p0[1] + f.p1[1]) / 2]); type = (pm - pmin < 2 || pmax - pm < 2) ? 'end' : 'rback'; }
      E.push({ f, type });
    }
    for (let i = 0; i < n; i++) { E[i].prev = E[(i - 1 + n) % n]; E[i].next = E[(i + 1) % n]; }

    // 커튼월 띠 (긴 면 위 s0..s1, 오프셋 off)
    for (const e of E) {
      if (e.type !== 'long') continue;
      const north = e.f.n[1] < 0;
      if ((spec.face === 'N') !== north) continue;
      if (bump) {
        const s0 = (bump.B[0] - e.f.p0[0]) * e.f.ex[0] + (bump.B[1] - e.f.p0[1]) * e.f.ex[1];
        const s1 = (bump.C[0] - e.f.p0[0]) * e.f.ex[0] + (bump.C[1] - e.f.p0[1]) * e.f.ex[1];
        if (Math.min(s0, s1) > 0 && Math.max(s0, s1) < e.f.L) e.cw = { s0: Math.min(s0, s1), s1: Math.max(s0, s1), off: bump.out };
      } else if (spec.gx) {
        const sx = x => (x - e.f.p0[0]) / e.f.ex[0];
        const a = sx(spec.gx[0]), b = sx(spec.gx[1]);
        e.cw = { s0: Math.min(a, b), s1: Math.max(a, b), off: -0.4 };
      }
    }

    // ---------------- 기준층 격자 (긴 면)
    function grid(f, a, b) {
      const span = b - a - 2 * MARG, nb = Math.max(1, Math.round(span / PITCH)), pt = span / nb;
      const cols = []; for (let i = 0; i < nb; i++) { const c = a + MARG + (i + 0.5) * pt; cols.push([c - OPEN / 2, c + OPEN / 2]); }
      for (let k = 0; k < NFL; k++) {
        const y = Y_GRID + k * FLR, ys = y + W_SLOPE, yh = y + W_HEAD;
        // 핀(창 사이 전면) + 양끝 여백
        let s = a;
        for (const [l, r] of cols) { vrect(precast, f, s, l, 0, y, yh); s = r; }
        vrect(precast, f, s, b, 0, y, yh);
        // 헤드 위 평탄 띠 (마지막 층은 파라펫까지)
        vrect(precast, f, a, b, 0, yh, k === NFL - 1 ? Y_PAR : y + FLR);
        for (const [l, r] of cols) {
          const li = l + SPLAY, ri = r - SPLAY;
          // 경사 스팬드럴: 전면 하단 → 안쪽 창대
          quad(precast, f.P(l, 0, y), f.P(r, 0, y), f.P(ri, -DEEP, ys), f.P(li, -DEEP, ys), [f.n[0], 0.7, f.n[1]]);
          // 잼(좌·우) — 아래 모서리는 경사면과 공유
          quad(precast, f.P(l, 0, y), f.P(l, 0, yh), f.P(li, -DEEP, yh), f.P(li, -DEEP, ys), [f.ex[0] + f.n[0] * 0.3, 0, f.ex[1] + f.n[1] * 0.3]);
          quad(precast, f.P(r, 0, y), f.P(r, 0, yh), f.P(ri, -DEEP, yh), f.P(ri, -DEEP, ys), [-f.ex[0] + f.n[0] * 0.3, 0, -f.ex[1] + f.n[1] * 0.3]);
          // 헤드 소핏 (아래 향함)
          quad(precast, f.P(l, 0, yh), f.P(r, 0, yh), f.P(ri, -DEEP, yh), f.P(li, -DEEP, yh), [0, -1, 0]);
          // 유리
          quad(M.pane, f.P(li, -DEEP, ys), f.P(ri, -DEEP, ys), f.P(ri, -DEEP, yh), f.P(li, -DEEP, yh), f.hint, [[0, 0], [1, 0], [1, 1], [0, 1]]);
        }
      }
    }
    // ---------------- 커튼월 띠
    function curtain(f, cw) {
      const { s0, s1, off } = cw, yb = off > 0 ? Y_PIER : Y_GRID;
      if (off > 0) {
        // 돌출부: 앞면·옆면 하부 띠(프리캐스트), 밑면 소핏
        vrect(precast, f, s0, s1, off, Y_PIER, Y_GRID);
        quad(precast, f.P(s0, 0, Y_PIER), f.P(s0, off, Y_PIER), f.P(s0, off, Y_GRID), f.P(s0, 0, Y_GRID), [-f.ex[0], 0, -f.ex[1]]);
        quad(precast, f.P(s1, 0, Y_PIER), f.P(s1, off, Y_PIER), f.P(s1, off, Y_GRID), f.P(s1, 0, Y_GRID), f.ehint);
        quad(precast, f.P(s0, 0, Y_PIER), f.P(s1, 0, Y_PIER), f.P(s1, off, Y_PIER), f.P(s0, off, Y_PIER), [0, -1, 0]);
      } else {
        vrect(precast, f, s0, s1, 0, Y_PIER, Y_GRID);
      }
      // 앞면 유리 + 층별 스팬드럴 띠 + 멀리언
      const w = s1 - s0;
      vrect(M.glass, f, s0, s1, off, Y_GRID, Y_CW, [[0, Y_GRID / 12], [w / 24, Y_GRID / 12], [w / 24, Y_CW / 12], [0, Y_CW / 12]].map(u => u));
      for (let k = 0; k <= NFL; k++) { const y = Y_GRID + k * FLR - 0.6; vrect(cwBand, f, s0, s1, off + 0.12, y, y + 1.1); }
      const nm = Math.max(2, Math.round(w / 4.5));
      for (let i = 0; i <= nm; i++) { const s = s0 + i * w / nm; vrect(frame, f, s - 0.15, s + 0.15, off + 0.2, Y_GRID, Y_CW); }
      // 옆면
      const oIn = -12;
      const lo = off > 0 ? 0 : off;
      if (off > 0) {
        quad(M.glass, f.P(s0, 0, Y_GRID), f.P(s0, off, Y_GRID), f.P(s0, off, Y_CW), f.P(s0, 0, Y_CW), [-f.ex[0], 0, -f.ex[1]]);
        quad(M.glass, f.P(s1, 0, Y_GRID), f.P(s1, off, Y_GRID), f.P(s1, off, Y_CW), f.P(s1, 0, Y_CW), f.ehint);
      } else {
        quad(precast, f.P(s0, 0, Y_GRID), f.P(s0, off, Y_GRID), f.P(s0, off, Y_PAR), f.P(s0, 0, Y_PAR), f.ehint);
        quad(precast, f.P(s1, 0, Y_GRID), f.P(s1, off, Y_GRID), f.P(s1, off, Y_PAR), f.P(s1, 0, Y_PAR), [-f.ex[0], 0, -f.ex[1]]);
      }
      // 지붕 위 랜턴 (옆·뒤 유리/금속, 상판)
      quad(M.glass, f.P(s0, oIn, Y_ROOF), f.P(s0, lo, Y_ROOF), f.P(s0, lo, Y_CW), f.P(s0, oIn, Y_CW), [-f.ex[0], 0, -f.ex[1]]);
      quad(M.glass, f.P(s1, oIn, Y_ROOF), f.P(s1, lo, Y_ROOF), f.P(s1, lo, Y_CW), f.P(s1, oIn, Y_CW), f.ehint);
      quad(M.metal, f.P(s0, oIn, Y_ROOF), f.P(s1, oIn, Y_ROOF), f.P(s1, oIn, Y_CW), f.P(s0, oIn, Y_CW), [-f.n[0], 0, -f.n[1]]);
      quad(M.metal, f.P(s0 - 0.3, oIn, Y_CW), f.P(s1 + 0.3, oIn, Y_CW), f.P(s1 + 0.3, off + 0.3, Y_CW), f.P(s0 - 0.3, off + 0.3, Y_CW), [0, 1, 0]);
    }

    // ---------------- 1층 후퇴 유리면 폴리곤 (긴 면·짧은 면은 INSET 만큼, 계단실 오목부 벽은 제자리)
    const dOf = e => (e.type === 'long' || e.type === 'end') ? INSET : 0;
    const off2 = (e, d) => [[e.f.p0[0] - e.f.n[0] * d, e.f.p0[1] - e.f.n[1] * d], [e.f.p1[0] - e.f.n[0] * d, e.f.p1[1] - e.f.n[1] * d]];
    const inner = E.map(e => { const [a, b] = off2(e.prev, dOf(e.prev)), [c, d] = off2(e, dOf(e)); return lineX(a, b, c, d); });

    for (let i = 0; i < n; i++) {
      const e = E[i], f = e.f;
      const gi = frameOf(inner[i], inner[(i + 1) % n]);
      if (e.type === 'long' || e.type === 'end') {
        // 1층 유리 커튼
        const L = gi.L;
        quad(M.dark, gi.P(0, 0, 0), gi.P(L, 0, 0), gi.P(L, 0, 0.3), gi.P(0, 0, 0.3), gi.hint);
        vrect(M.pane, gi, 0, L, 0, 0.3, 8.0, [[0, 0], [L / 5, 0], [L / 5, 1], [0, 1]]);
        vrect(spandrel, gi, 0, L, 0, 8.0, 9.8);
        vrect(M.pane, gi, 0, L, 0, 9.8, Y_PIER, [[0, 0], [L / 5, 0], [L / 5, 1], [0, 1]]);
        const nm = Math.max(1, Math.round(L / 5));
        for (let k = 0; k <= nm; k++) vrect(frame, gi, k * L / nm - 0.12, k * L / nm + 0.12, 0.1, 0.3, Y_PIER);
        for (const y of [8.0, 9.8]) vrect(frame, gi, 0, L, 0.1, y - 0.1, y + 0.1);
        // 소핏 (기단 띠 밑면)
        quad(precast, [f.p0[0], Y_PIER, f.p0[1]], [f.p1[0], Y_PIER, f.p1[1]], [inner[(i + 1) % n][0], Y_PIER, inner[(i + 1) % n][1]], [inner[i][0], Y_PIER, inner[i][1]], [0, -1, 0]);
        // 기단 띠
        if (!e.cw || e.cw.off < 0) vrect(precast, f, 0, f.L, 0, Y_PIER, Y_GRID);
        else { vrect(precast, f, 0, e.cw.s0, 0, Y_PIER, Y_GRID); vrect(precast, f, e.cw.s1, f.L, 0, Y_PIER, Y_GRID); }
      } else {
        // 계단실 오목부 벽: 지면부터 벽돌 (뒷벽은 아래에서 창과 함께)
        if (e.type === 'rside') quad(brick, gi.P(0, 0, 0), gi.P(gi.L, 0, 0), gi.P(gi.L, 0, Y_PIER), gi.P(0, 0, Y_PIER), gi.hint);
      }

      if (e.type === 'long') {
        // 기둥 6베이
        const nbay = 6;
        for (let k = 0; k <= nbay; k++) {
          const corner = k === 0 || k === nbay, w = corner ? INSET : 2.6;
          const s = corner ? (k === 0 ? w / 2 : f.L - w / 2) : k * f.L / nbay;
          boxOn(precast, f, s, -INSET / 2, 0, w, Y_PIER - 1.2, INSET);
          boxOn(precast, f, s, -INSET / 2, Y_PIER - 1.2, w + 0.6, 1.2, INSET + 0.6);
        }
        // 금속 스크린 (남측 타워의 바깥 모서리 쪽 2베이)
        if (spec.screens && f.n[1] > 0) {
          for (let k = 0; k < 2; k++) {
            const atEnd = (spec.screens === 'E') === (f.ex[0] > 0);
            const bi = atEnd ? nbay - 1 - k : k, s = (bi + 0.5) * f.L / nbay;
            boxOn(screen, f, s, 2.5, 0, f.L / nbay - 4, 7.0, 0.3);
            for (const ds of [-1, 1]) boxOn(M.dark, f, s + ds * (f.L / nbay - 4) / 2, 2.5, 0, 0.35, 7.2, 0.35);
          }
        }
        // 기준층
        if (e.cw) { grid(f, 0, e.cw.s0); grid(f, e.cw.s1, f.L); curtain(f, e.cw); }
        else grid(f, 0, f.L);
      } else if (e.type === 'end') {
        vrect(brick, f, 0, f.L, 0, Y_GRID, Y_PAR);
        // 오목부 쪽 끝의 기둥
        const s = e.next.type === 'rside' ? f.L - 1.3 : 1.3;
        if (e.next.type === 'rside' || e.prev.type === 'rside') {
          boxOn(precast, f, s, -INSET / 2, 0, 2.6, Y_PIER - 1.2, INSET);
          boxOn(precast, f, s, -INSET / 2, Y_PIER - 1.2, 3.2, 1.2, INSET + 0.6);
        }
      } else if (e.type === 'rside') {
        vrect(brick, f, 0, f.L, 0, Y_PIER, Y_PAR);
      } else if (e.type === 'rback') {
        // 계단실 뒷벽: 층간 높이 창 2개씩 + 1층 창
        const ops = [], c = f.L / 2, ww = 2.4, gap = 1.4;
        const lv = [[8.5, 11.5]]; for (let k = 0; k < NFL; k++) { const yb = Y_GRID + k * FLR - 3.4; lv.push([yb, yb + 4.0]); }
        for (const [b, t] of lv) for (const sgn of [-1, 1]) {
          const s0 = c + sgn * (gap / 2 + ww / 2) - ww / 2, s1 = s0 + ww;
          ops.push({ s: s0, e: s1, b, t });
          const r = 0.45;
          quad(M.white, f.P(s0, 0, b), f.P(s1, 0, b), f.P(s1, -r, b), f.P(s0, -r, b), [0, 1, 0]);
          quad(M.white, f.P(s0, 0, t), f.P(s1, 0, t), f.P(s1, -r, t), f.P(s0, -r, t), [0, -1, 0]);
          quad(M.white, f.P(s0, 0, b), f.P(s0, 0, t), f.P(s0, -r, t), f.P(s0, -r, b), f.ehint);
          quad(M.white, f.P(s1, 0, b), f.P(s1, 0, t), f.P(s1, -r, t), f.P(s1, -r, b), [-f.ex[0], 0, -f.ex[1]]);
          quad(M.pane, f.P(s0, -r, b), f.P(s1, -r, b), f.P(s1, -r, t), f.P(s0, -r, t), f.hint, [[0, 0], [1, 0], [1, 1], [0, 1]]);
          // 흰 창대
          boxOn(M.white, f, (s0 + s1) / 2, 0.1, b - 0.3, ww + 0.5, 0.3, 0.5);
        }
        P(G.wallSeg(f.p0, f.p1, 0, Y_PAR, { openings: ops }), brick);
      }
    }

    // ---------------- 지붕: 슬래브, 파라펫 안쪽면·상단, 난간, 펜트하우스
    P(G.capGeometry(poly, [], Y_ROOF), M.roof_membrane, false);
    const inP = G.offsetPoly(poly, 0.8);
    P(G.sideGeometry([...inP].reverse(), Y_ROOF, Y_PAR), precast, false);
    P(G.capGeometry(poly, [inP], Y_PAR), precast, false);
    for (const e of E) {
      const f = e.f, np = Math.max(1, Math.round(f.L / 8));
      for (let k = 0; k <= np; k++) {
        const s = Math.min(Math.max(k * f.L / np, 0.6), f.L - 0.6);
        if (e.cw && s > e.cw.s0 - 0.5 && s < e.cw.s1 + 0.5) continue;
        boxOn(frame, f, s, -0.5, Y_PAR, 0.25, 3.5, 0.25);
      }
      const rails = e.cw ? [[0, e.cw.s0], [e.cw.s1, f.L]] : [[0, f.L]];
      for (const [a, b] of rails) if (b - a > 1) { boxOn(frame, f, (a + b) / 2, -0.5, Y_PAR + 3.3, b - a, 0.2, 0.2); boxOn(frame, f, (a + b) / 2, -0.5, Y_PAR + 1.7, b - a, 0.12, 0.12); }
    }
    // 펜트하우스 (주축 방향 80 × 28, 중심 = 본체 중심)
    const cx = poly.reduce((s, p) => s + p[0], 0) / n, cz = poly.reduce((s, p) => s + p[1], 0) / n;
    const ry = -Math.atan2(ax[1], ax[0]);
    // 항공사진(sycamore_towers/f 야경, isu/r): 펜트하우스는 어두운 금속 상자가 아니라 반투명 패널(폴리카보네이트형) 스크린 박스 —
    //   밤에 내부 조명으로 빛남, 세로 멀리언 ≈ 4 ft, 높이 ≈ 13 ft, 위 가는 흰 테두리.
    P(G.box(79, 12.5, 27, cx, Y_ROOF, cz, { ry }), phPanel);
    P(G.box(80, 0.6, 28, cx, Y_ROOF + 12.5, cz, { ry }), M.white);
    for (const [L, W, axis] of [[80, 28, 0], [28, 80, 1]]) {
      const nm = Math.round(L / 4);
      for (let k = 0; k <= nm; k++) {
        const t = -L / 2 + k * L / nm;
        for (const sg of [-1, 1]) {
          const u = axis === 0 ? t : sg * (W / 2 - 0.2), v = axis === 0 ? sg * (W / 2 - 0.2) : t;   // u = 주축, v = 직교축
          const q = [cx + ax[0] * u - ax[1] * v, cz + ax[1] * u + ax[0] * v];
          P(G.box(0.35, 12.5, 0.35, q[0], Y_ROOF, q[1], { ry }), M.white, false);
        }
      }
    }
  }
  for (const t of TOWERS) tower(t);

  // ============================================================ 다이닝 커먼스
  {
    const poly = mergeCollinear(FP.commons);
    const towerPolys = ['mills', 'blumberg', 'rhoads', 'cromwell'].map(k => FP[k]);
    const segDist = (p, a, b) => {
      const dx = b[0] - a[0], dz = b[1] - a[1], L2 = dx * dx + dz * dz;
      const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dz) / L2));
      return Math.hypot(p[0] - a[0] - dx * t, p[1] - a[1] - dz * t);
    };
    const shared = (a, b) => {
      for (const s of [0.25, 0.5, 0.75]) {
        const m = [a[0] + (b[0] - a[0]) * s, a[1] + (b[1] - a[1]) * s];
        let ok = false;
        for (const tp of towerPolys) for (let i = 0; i < tp.length && !ok; i++) if (segDist(m, tp[i], tp[(i + 1) % tp.length]) < 1.5) ok = true;
        if (!ok) return false;
      }
      return true;
    };
    const Y_B = 3.5, Y_W = 15.5, Y_R = 15.0;
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i], b = poly[(i + 1) % poly.length];
      if (shared(a, b)) continue;
      const f = frameOf(a, b), L = f.L;
      const west = f.n[0] < -0.7;
      // 벽돌 기초 (반지하 채광)
      vrect(brick, f, 0, L, 0, 0, Y_B);
      const ops = [];
      if (L > 6.5 && L < 11) {
        // 오목부 안 출입구: 유리 + 문
        ops.push({ s: 0.8, e: L - 0.8, b: Y_B, t: 12.0 });
        vrect(M.pane, f, 0.8, L - 0.8, -0.4, Y_B, 12.0, [[0, 0], [(L - 1.6) / 4, 0], [(L - 1.6) / 4, 1], [0, 1]]);
        for (const s of [0.8, L / 2 - 1.5, L / 2 + 1.5, L - 0.8]) vrect(frame, f, s - 0.12, s + 0.12, -0.3, Y_B, 12.0);
        vrect(M.dark, f, L / 2 - 1.5, L / 2 + 1.5, -0.25, Y_B, Y_B + 7.0);
        vrect(frame, f, 0.8, L - 0.8, -0.3, Y_B + 7.0, Y_B + 7.3);
        boxOn(M.walk, f, L / 2, 2.5, 0, L, Y_B - 0.5, 5.0);           // 진입 단(램프)
      } else if (L >= 11) {
        const nb = Math.max(1, Math.round(L / 10)), pt = L / nb;
        for (let k = 0; k <= nb; k++) {
          const s = Math.min(Math.max(k * pt, 0.7), L - 0.7);
          boxOn(precast, f, s, 0.35, Y_B, 1.4, Y_W - Y_B, 0.7);
        }
        for (let k = 0; k < nb; k++) {
          const c = (k + 0.5) * pt, wP = pt - 2.6;
          // 서면 z 566..640: 좁고 긴 창 2개 / 문 + 계단(z≈562)
          const pc = f.Q(c, 0);
          if (west && pc[1] > 556 && pc[1] < 568) {
            ops.push({ s: c - 1.6, e: c + 1.6, b: Y_B, t: Y_B + 7.5 });
            vrect(M.dark, f, c - 1.6, c + 1.6, -0.4, Y_B, Y_B + 7.5);
            vrect(frame, f, c - 0.06, c + 0.06, -0.3, Y_B, Y_B + 7.5);
            boxOn(M.walk, f, c, 1.5, 0, 5.5, Y_B, 3.0);                                   // 계단참
            for (let st = 0; st < 4; st++) boxOn(M.walk, f, c, 3.5 + (4 - st) * 1.0, 0, 5.5, Y_B * (st + 1) / 5, 1.0);
            for (const ds of [-2.9, 2.9]) {                                                   // 금속 난간: 기둥 3 + 상부 레일
              for (const o of [0.6, 3.5, 6.4]) boxOn(M.dark, f, c + ds, o, o > 3 ? Y_B * (1 - (o - 3) / 4.5) : Y_B, 0.15, 3.2, 0.15);
              const r0 = f.P(c + ds, 0.6, Y_B + 3.2), r1 = f.P(c + ds, 6.4, Y_B * 0.36 + 3.2);
              const len = Math.hypot(r1[0] - r0[0], r1[1] - r0[1], r1[2] - r0[2]);
              const g = G.box(0.15, 0.15, len, 0, -0.075, 0);
              g.applyMatrix4(new THREE.Matrix4().lookAt(new THREE.Vector3(...r1), new THREE.Vector3(...r0), UP).setPosition((r0[0] + r1[0]) / 2, (r0[1] + r1[1]) / 2, (r0[2] + r1[2]) / 2));
              P(g, M.dark);
            }
          } else if (west && pc[1] > 568 && pc[1] < 642) {
            for (const ds of [-1.6, 1.6]) {
              const s0 = c + ds - 1.1, s1 = c + ds + 1.1;
              ops.push({ s: s0, e: s1, b: Y_B + 1.5, t: Y_B + 10.0 });
              vrect(M.pane, f, s0, s1, -0.5, Y_B + 1.5, Y_B + 10.0, [[0, 0], [1, 0], [1, 1], [0, 1]]);
              quad(precast, f.P(s0, 0, Y_B + 1.5), f.P(s1, 0, Y_B + 1.5), f.P(s1, -0.5, Y_B + 1.5), f.P(s0, -0.5, Y_B + 1.5), [0, 1, 0]);
              quad(precast, f.P(s0, 0, Y_B + 10), f.P(s1, 0, Y_B + 10), f.P(s1, -0.5, Y_B + 10), f.P(s0, -0.5, Y_B + 10), [0, -1, 0]);
            }
          } else if (wP > 2) {
            // 액자형 패널 (살짝 돌출)
            boxOn(precast, f, c, 0.15, Y_B + 1.2, wP, Y_W - Y_B - 3.0, 0.3);
          }
        }
      }
      P(G.wallSeg(a, b, Y_B, Y_W, { openings: ops }), precast);
      // 코핑
      boxOn(precast, f, L / 2, 0.1, Y_W - 0.7, L + 0.4, 0.8, 1.4);
    }
    P(G.capGeometry(poly, [], Y_R), M.roof_membrane, false);
    // 중앙 높은 볼륨 (다이닝 홀)
    const rect = (x0, z0, x1, z1) => [[x0, z0], [x0, z1], [x1, z1], [x1, z0]];
    const hall = rect(-618, 540, -442, 652);
    const ex = G.extrudePoly(hall, [], 19.5 - Y_R + 0.5, { y0: Y_R - 0.5 });
    P(ex.sides, precast); P(ex.top, M.roof_membrane, false);
    for (let i = 0; i < 4; i++) { const f = frameOf(hall[i], hall[(i + 1) % 4]); boxOn(precast, f, f.L / 2, 0.1, 19.0, f.L + 0.6, 0.7, 1.2); }
    // 옥상 설비 (z20 위성에서 읽은 위치)
    const unit = (x0, z0, x1, z1, h, y0 = Y_R) => P(G.box(x1 - x0, h, z1 - z0, (x0 + x1) / 2, y0, (z0 + z1) / 2), M.metal);
    unit(-584, 506, -575, 514, 4); unit(-538, 504, -529, 512, 4); unit(-515, 495, -506, 503, 4.5);
    unit(-596, 602, -553, 611, 3.5, 19.5); unit(-541, 587, -536, 627, 3.5, 19.5); unit(-541, 583, -511, 591, 3.5, 19.5);
    unit(-474, 532, -467, 580, 5, 19.5); unit(-458, 532, -451, 580, 5, 19.5); unit(-474, 548, -451, 553, 4, 19.5);
    unit(-587, 670, -579, 678, 4); unit(-538, 670, -530, 678, 4); unit(-515, 681, -508, 689, 4);
  }

  // ============================================================ 단지 외곽 벽돌 낮은 담 (vp3_080·vp6_067·vp8_117·vp12_058)
  {
    const wall = (pts, h = 3.0) => {
      for (let i = 0; i + 1 < pts.length; i++) {
        const f = frameOf(pts[i], pts[i + 1]);
        boxOn(brick, f, f.L / 2, 0, 0, f.L + 1.0, h, 1.0);
        boxOn(precast, f, f.L / 2, 0, h, f.L + 1.2, 0.25, 1.25);
      }
    };
    wall([[-698, 778], [-715, 778], [-715, 712]]);                      // Cromwell 서측 화단
    wall([[-700, 412], [-717, 412], [-717, 540], [-636, 540]], 3.5);     // Rhoads 서측 + 남서 잔디 테라스
  }

  // ---- 누적기 → 지오메트리
  for (const [mat, B] of acc) {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(B.pos, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(B.uv, 2));
    g.computeVertexNormals();
    parts.push({ geom: g, mat, cast: mat !== M.pane && mat !== M.glass });
  }
  const grp = new THREE.Group();
  for (const m of G.mergeByMaterial(parts)) grp.add(m);
  return grp;
}
