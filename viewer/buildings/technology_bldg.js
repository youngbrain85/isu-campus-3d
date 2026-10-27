// Technology Building (Bailey College of Engineering & Technology, Walter Scholer 1983)
// → 2024–2027 RATIO 리노베이션 "Center for Technology, Engineering and Design" (cTED) 2025 완성 외관 (고상세)
//
// ── 치수 근거 (cTED Architectural set, 벡터 PDF 의 글자·치수 + 입면 래스터를 로컬 ft 로 맞춰 계측, scratch/ted_ext/*.py) ──
//   평면 A-101/A-102/A-103: 그리드 E1(=0)…E15(=228) / EM(=0)…EA(=136.1), 북측 증축 그리드 2,4,5,6 = 18.5..117.5, H..E = -69..-4.5.
//   입면 A-201 (N, S + 펜트하우스 G1/G3/G5/G7, 북측증축 남면 F1, 덕트 인클로저 F7/F8), A-202 (E, W + 서측증축 G2/G6):
//     1/8" = 1'-0" (9 pt/ft). 그리드 원(E2..E15 / EM..EA) 으로 수평축, 레벨선(FIRST 100'-0") 으로 높이축을 맞춤 (오차 < 0.1 ft).
//   레벨 (FIRST 100'-0" = 0): FIRST N 98'-0" (-2), FIRST SW 95'-0" (-5), SECOND 114'-8" (14.67), THIRD 129'-4" (29.33),
//     ROOF 137'-4⅝" (37.39), PENT ROOF 144'-8" (44.67), MT-SECOND 117'-4⅜" (17.36, 스카이브리지).
//   유리 A-610/A-611: EW01 (서측 로비 커튼월 96'-6½", 4' 모듈, 경사 하단 95'→98'), EW02 (출입문 14'), EW04/EW16 (기존 슬롯창
//     4'×27'-4": 비전 2.67..10 / 스팬드럴 ..15.67 / 비전 ..24.67 / 스팬드럴 ..30), EW05/EW11 (연결동 37' 전고 유리), EW06..EW09 (증축 기저
//     창 12'-0": 하부 스팬드럴 1'-2", 상부 2'-0½"), EW17 (서측 로비 남면), EW18..EW27 (상부 볼륨 커튼월: 개구 111'-3½"..135'-8", 가로
//     멀리언 114'-8" / 123'-4" / 132'-0", 4' 모듈, 수직 핀 VF A 1'-5⅞" · VF B 5⅞"), EW29..EW32 (스카이브리지), EW33/EW34..36 (프릿 GL-05).
//   상부 볼륨 패널 (074213.23.B02A = 밝은 은회색, B02B = 짙은 회색): 수평 조인트 110'-1" + 2'-0" + 4×6'-2" + 2'-3½" (10.1..39.1),
//     수직 구획은 입면 치수열 (아래 NA_*/WA_* 표). 기존 판정 오류 수정: 북면 36' 유리 (24'+12' 패널 아님), 서측증축 서면 6'/36'/20' 구획,
//     북측증축 동면 2|6|4G|16|24G|2.
//   펜트하우스 A-103 F6 평면 + G1..G7: L 자 (47.9..103.4 × -0.2..35.4 + 47.9..68.2 × 35.4..39.0), 성형 금속패널(1'-10" 리브)
//     30.7..46.3, 수평 조인트 36.6, 동면 루버 3 (9'-2", 5'-6", 7'-4"), 남면 HM 문.
//   지붕 A-103: PV (북측·서측 증축), 기존 지붕 RTU 4 + 해치, 고베이 장비, 덕트 인클로저 2 (F7/F8), 사다리 055000.C04.
//   사인 A-203: 서면 "BAILEY COLLEGE / OF ENGINEERING / AND TECHNOLOGY" (B7), 서측 출입구 위 "INDIANA STATE UNIVERSITY" (A7, 지지 튜브),
//     고베이 남동 모서리 세로 "INDIANA STATE UNIVERSITY" (C7, 21'-11⅝"). 서체 Sitka Banner → droid serif bold 로 대체.
//   벽돌 솔저 코스 띠 (입면 래스터): 기존동 0.6–2.6 / 8.0–10.0 / 15.2–17.4 / 22.6–24.8 / 30.0–32.0, 고베이 15.4–16.4 / 22.7–24.7 / 30.3–32.3.
//
// ── 지반 (grade) ── 입면의 지반선(회색 채움 상단)을 열 단위로 읽은 값 (scratch/ted_ext/grade.json):
//   서면 전체 -5.3 (95'), 남면 서단 -5.4 → 동단(E15) -1.2, 북측증축 북면 -5.4(서) → -3.2(동), 기존 북벽 -2.0..-0.9, 동면(고베이·CM 랩) -0.16,
//   북측증축 동면 -3.4..-2.2.  Civil C-300: F.F.E. 506.62 (=100'), 504.62 (98'), 501.62 (95'); N 6th St 보도 ≈ 500.0–501.4.
//   뷰어 지면은 y=0 평면이고, 이 건물의 서·남면은 6th St·Chestnut St 보도에 바로 붙어 있다 → 지면(y=0) = 서측 보도 = FIRST SW 95'-0".
//   그래서 건물 전체를 LIFT = 5 ft 올린다 (FIRST 100'-0" 는 로컬 y=0 그대로, 월드 y=5). 이렇게 하면 서측 로비(95')는 보도 높이에서 출입하고,
//   북측 증축(98')·기존동(100') 쪽 지반은 도면의 경사대로 흙 둔덕(3:1)으로 올라가며, 남면 동쪽은 노출 기초(콘크리트)로 보인다.
//   ※ Myers 브리지 접속부(myers_tech.js, 월드 17.4)는 Myers 쪽 지면 기준이므로 사선 브리지 구간을 MT-SECOND(월드 22.4)에서 접속부까지 경사시킨다.
//   ※ LIFT 는 그룹 position.y 로 적용 (app.js 의 toWorld 가 y=0 으로 놓으므로 아래 build() 끝에서 y 를 고정). 실내 모델도 같은 그룹이라 함께 올라간다.
//
// 로컬 프레임: x = 동 (E1 에서), z = 남 (EM 에서), y = 위 (FIRST = 0), 단위 ft. meta.anchor/rotation 으로 월드 배치.
import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

export const meta = {
  id: 'tech', name: 'Technology Building (cTED, 2025 renovation)', osm: 'way/461428305',
  anchor: [29.58, 1093.19], rotation: -0.025,   // tools/fit_footprint.py (RMS 1.41 ft)
  height: 45,
  elevation: 5.0,                                 // 로컬 FIRST(100'-0") 의 월드 높이 = 100' - 95' (서측 보도 = FIRST SW)
  preset: { pos: [-190, 115, 1415], tgt: [120, 10, 1150] },
  sheets: 'cTED A-101..A-103, A-201..A-203, A-301, A-321..A-326, A-610, A-611, C-300',
};

// 기존동 외곽 (OSM 피팅용): 본동 + 고베이 + 동측 브리지(MT 연결)
export const outline = [[0, 0], [0, 68], [35, 68], [35, 136], [228, 136], [228, 68], [270.5, 41.5], [270.5, 31], [228, 57], [228, 58], [173, 58], [173, 0]];

// ── 사인용 폰트 (top-level await, 실패하면 글자만 생략) ──
let FONT = null;
try {
  const u = new URL('../../fonts/droid/droid_serif_bold.typeface.json', import.meta.resolve('three/addons/loaders/FontLoader.js'));
  const r = await fetch(u);
  if (r.ok) FONT = new FontLoader().parse(await r.json());
} catch (e) { console.warn('tech: sign font not loaded', e); }

// ── 레벨 / 상수 (ft) ──
const LIFT = meta.elevation;
const BASE = -LIFT - 1.5;                              // 외벽 하단 (지면 아래)
const FN = -2, FSW = -5, L2 = 14.67, L3 = 29.33, RF = 37.39, PR = 44.67, MT2 = 17.36;
const SOF = 10.1, TOP = 39.1;                          // 증축 상부 볼륨 소핏 / 패널 상단
const JY = [10.1, 12.1, 18.27, 24.43, 30.6, 36.77, 39.1];  // 패널 수평 조인트
const CW_B = 12.1, CW_T = 35.67;                       // 상부 커튼월 보이는 범위 (개구 111'-3½"..135'-8", 하단은 패널 밴드 뒤)
const CW_H = [14.67, 23.33, 32.0];                     // 가로 멀리언 (스팬드럴 12.1..14.67, 32.0..35.67)
const PAR_EX = 32.4, PAR_HB = 32.3, PAR_CM = 24.7;     // 기존 본동 / 고베이 / CM 랩 파라펫
const BANDS_EX = [[0.6, 2.6], [8.0, 10.0], [15.2, 17.4], [22.6, 24.8], [30.0, 32.0]];
const BANDS_HB = [[15.4, 16.4], [22.7, 24.7], [30.3, 32.2]];
const EA = 136.1;
// 실제 외벽 바깥면 (A-101/A-102 포셰 계측, scratch/ted_ext/poche.py): 기존 벽돌벽은 그리드보다 ~1.45 ft 바깥
const EX_W = -1.55, EX_N = -1.65, EX_S = 137.7, HB_E = 229.7, HB_N = 66.5, CM_E = 171.75;   // (실내 모델 벽과 겹치지 않게 +0.1~0.2)
const NA_X0 = 15.9, NA_X1 = 120.1, NA_Z0 = -71.6;      // 북측 증축 기저 벽돌 바깥면
const WA_X = -9.78, WA_S = 136.4;                       // 서측 증축 상부 볼륨 서면 / 남면
const WB_X = -0.5, WB_S = 131.5, WV_X = -5.9;           // 서측 로비 커튼월 서면 / 남면, 출입 전실(석회석) 서면

// 입면 지반선 (로컬 y). [수평좌표, y] — 입면 래스터의 회색 지반 채움 상단 (scratch/ted_ext/grade.py)
const GR_N = [[-26, -6.6], [-4, -5.6], [12, -5.44], [24, -5.2], [40, -4.8], [60, -4.32], [80, -3.84], [100, -3.52], [118, -3.28], [120, -2.16], [130, -2.0], [140, -1.76], [150, -1.52], [160, -1.28], [170, -1.04], [180, -0.64], [190, -0.32], [200, 0.08], [220, 0.0], [240, -0.24], [270, -0.8]];
const GR_S = [[-24, -6.8], [-16, -5.6], [-10, -5.44], [24, -5.44], [34, -5.44], [40, -5.2], [50, -4.8], [60, -4.56], [80, -4.24], [100, -3.68], [120, -3.44], [140, -3.12], [160, -2.72], [180, -2.4], [200, -2.16], [212, -2.0], [220, -1.6], [228, -1.2]];
const GR_E = [[-90, -3.44], [-80, -3.2], [-70, -2.96], [-60, -2.72], [-50, -2.56], [-40, -2.24], [-36, -2.16], [-3, -2.16], [-1.5, -0.16], [132, -0.16], [134, -0.48], [136, -1.28], [140, -1.76], [150, -2.32]];
const lerpT = (T, v) => { if (v <= T[0][0]) return T[0][1]; for (let i = 1; i < T.length; i++) if (v <= T[i][0]) { const [a, ya] = T[i - 1], [b, yb] = T[i]; return ya + (yb - ya) * (v - a) / (b - a); } return T[T.length - 1][1]; };

// ── 패널 구획 (입면 치수열에서 읽음). [폭, 종류('A'|'B'|'G'), 세부] — A/B: 패널 색, 세부 = 수직 조인트 폭 목록; G: 유리, 세부 = 핀 종류 ──
const NA_N = [[2, 'A'], [10, 'A', [2, 4, 2, 2]], [12, 'G', 'B'], [6, 'B', [4, 2]], [36, 'G', 'B'], [6, 'B', [4, 2]], [32, 'G', 'B'], [10, 'A', [2, 2, 4, 2]], [2, 'A']];
const NA_W = [[2, 'A'], [32, 'G', 'A'], [6, 'B', [4, 2]], [12, 'G', 'A'], [2.03, 'A']];
const NA_E = [[2, 'A'], [6, 'B', [2, 4]], [4, 'G', null], [16, 'B', [2, 4, 2, 2, 4, 2]], [24, 'G', 'A'], [2.03, 'A']];
const WA_WZ = [[2, 'A'], [16, 'G', 'A'], [6, 'B', [4, 2]], [36, 'G', 'A'], [20, 'B', [4, 2, 2, 4, 2, 2, 4]], [12, 'G', 'A'], [8.58, 'A', [4, 2, 2.58]]];
const WA_SZ = [[7.96, 'A', [2, 1.96, 4]], [12, 'G', 'A'], [10, 'B', [2, 4, 2, 2]], [4, 'B'], [4, 'G', null], [2, 'B'], [2.86, 'A']];

export function build(M, G) {
  const parts = [];
  const P = (geom, mat, cast = true) => { if (geom) parts.push({ geom, mat, cast }); };

  // ── 재질 (모듈 로컬, 한 번만 생성) ──
  const X = M._tech || (M._tech = (() => {
    const S = (color, metalness, roughness, o = {}) => new THREE.MeshStandardMaterial({ color, metalness, roughness, ...o });
    const soldier = M.brick_brown.clone();                     // 솔저 코스: 벽돌 텍스처를 90° 돌림 (가로 24 ft / 세로 12 ft 타일 → 축 교환)
    const rot = (t) => { if (!t) return t; const c = t.clone(); c.center.set(0.5, 0.5); c.rotation = Math.PI / 2; c.repeat.set(2, 0.5); c.needsUpdate = true; return c; };
    soldier.map = rot(M.brick_brown.map); if (M.brick_brown.normalMap) soldier.normalMap = rot(M.brick_brown.normalMap);
    soldier.color = new THREE.Color(0.8, 0.76, 0.74);
    const brick = M.brick_brown.clone(); brick.color = new THREE.Color(0.9, 0.84, 0.8);   // "STAIN EXISTING BRICK TO CONSISTENT COLOR" — 채도를 약간 낮춤
    return {
      soldier,
      acmA: S(0xb9bdc0, 0.55, 0.36),      // 074213.23.B02A (COLOR A01) 밝은 은회색
      acmB: S(0x5d6064, 0.5, 0.42),       // 074213.23.B02B (COLOR B02) 짙은 회색
      reveal: S(0x1c1e21, 0.2, 0.8),      // 패널 조인트(리빌) 뒷면
      frame: S(0x2f3236, 0.55, 0.42),     // 커튼월 멀리언·핀·창틀 (짙은 아노다이즈)
      spandrel: S(0x2e383f, 0.65, 0.16),  // GL-02/GL-04 세라믹 스팬드럴
      frit: S(0x8c989f, 0.45, 0.28),      // GL-05 프릿 유리 (클리어스토리)
      formed: S(0xa7abae, 0.5, 0.42),     // 074213.13.A00 성형(리브) 금속패널
      formedDk: S(0x75797c, 0.5, 0.45),   // 덕트 인클로저 성형패널
      coping: S(0x8e9296, 0.55, 0.4),     // 077100.A01 코핑
      steel: S(0x4a4f55, 0.6, 0.45),
      hm: S(0x666a6e, 0.4, 0.5),          // HM 문
      alu: S(0xc9ccce, 0.7, 0.3),         // 손잡이·레일
      letters: S(0xdcdde0, 0.75, 0.25),   // 101419.A00 입체 글자
      pv: S(0x1b2738, 0.6, 0.22), pvFrame: S(0xaeb2b6, 0.7, 0.3),
      louver: S(0x575b60, 0.5, 0.45),
      ohRail: S(0xd6d8da, 0.6, 0.35),
      tpo: M.roof_membrane, lime: M.limestone, conc: M.concrete, brick, glass: M.pane, grass: M.grass, walk: M.walk,
    };
  })());

  // ── 면(facade) 헬퍼: F = {o:[x,z], t:[tx,tz]} — s = t 방향 거리, d = 바깥(법선) 방향 거리 ──
  const face = (o, t) => ({ o, t, n: [-t[1], t[0]], ry: -Math.atan2(t[1], t[0]) });
  const PT = (F, s, d = 0) => [F.o[0] + F.t[0] * s + F.n[0] * d, F.o[1] + F.t[1] * s + F.n[1] * d];
  /** 면 정렬 박스: s0..s1 × y0..y1 × d0..d1 */
  const fb = (F, s0, s1, y0, y1, d0, d1, mat, cast = true) => {
    if (s1 - s0 < 1e-3 || y1 - y0 < 1e-3 || d1 - d0 < 1e-3) return;
    const c = PT(F, (s0 + s1) / 2, (d0 + d1) / 2);
    P(G.box(s1 - s0, y1 - y0, d1 - d0, c[0], y0, c[1], { ry: F.ry }), mat, cast);
  };
  /** 바깥을 향한 평면 (d 위치) */
  const fq = (F, s0, s1, y0, y1, d, mat, cast = false) => { if (s1 - s0 > 1e-3 && y1 - y0 > 1e-3) P(G.sideGeometry([PT(F, s0, d), PT(F, s1, d)], y0, y1, 1 / 24, 1 / 12, false), mat, cast); };
  /** 안쪽을 향한 평면 (파라펫 안쪽면) */
  const fqIn = (F, s0, s1, y0, y1, d, mat) => { if (s1 - s0 > 1e-3 && y1 - y0 > 1e-3) P(G.sideGeometry([PT(F, s1, d), PT(F, s0, d)], y0, y1, 1 / 24, 1 / 12, false), mat); };
  /** 개구가 뚫린 벽면 (ops: {s0,s1,y0,y1} — 면 기준 절대 s) */
  const fwall = (F, s0, s1, y0, y1, mat, ops = [], d = 0) => P(G.wallSeg(PT(F, s0, d), PT(F, s1, d), y0, y1, { openings: ops.map(o => ({ s: o.s0 - s0, e: o.s1 - s0, b: o.y0, t: o.y1 })) }), mat);
  /** 개구 안쪽 측벽(리빌) */
  const reveal = (F, o, depth, mat) => {
    const w = 0.05;
    fb(F, o.s0, o.s0 + w, o.y0, o.y1, -depth, 0, mat, false); fb(F, o.s1 - w, o.s1, o.y0, o.y1, -depth, 0, mat, false);
    fb(F, o.s0, o.s1, o.y1 - w, o.y1, -depth, 0, mat, false); fb(F, o.s0, o.s1, o.y0, o.y0 + w, -depth, 0, mat, false);
  };
  /** [s0,s1] 에서 ops 구간을 뺀 나머지 */
  const cut = (s0, s1, ops) => {
    let segs = [[s0, s1]];
    for (const o of ops) { const nx = []; for (const [a, b] of segs) { if (o.s1 <= a || o.s0 >= b) nx.push([a, b]); else { if (o.s0 > a) nx.push([a, o.s0]); if (o.s1 < b) nx.push([o.s1, b]); } } segs = nx; }
    return segs.filter(([a, b]) => b - a > 0.05);
  };
  /** 벽돌 벽 + 개구 리빌 + 솔저 코스 띠 */
  const brickFace = (F, s0, s1, y0, y1, ops = [], bands = BANDS_EX, rd = 0.45) => {
    fwall(F, s0, s1, y0, y1, X.brick, ops);
    for (const o of ops) reveal(F, o, o.rd ?? rd, X.brick);
    for (const [b0, b1] of bands) {
      const ya = Math.max(b0, y0), yb = Math.min(b1, y1); if (yb - ya < 0.05) continue;
      for (const [a, b] of cut(s0, s1, ops.filter(o => o.y0 < yb && o.y1 > ya))) fb(F, a, b, ya, yb, 0, 0.035, X.soldier, false);
    }
  };
  /** 코핑 (벽 상단 캡, 바깥 0.15 ft 돌출) */
  const coping = (F, s0, s1, y, w = 1.15, h = 0.32) => fb(F, s0 - 0.08, s1 + 0.08, y, y + h, 0.15 - w, 0.15, X.coping);
  /** 파라펫 안쪽면 + 코핑 */
  const parapet = (F, s0, s1, yRoof, yTop, mat, th = 0.9) => { fqIn(F, s0, s1, yRoof, yTop, -th, mat); coping(F, s0, s1, yTop, th + 0.25); };
  /** 경사 상단을 가진 수직면 (노출 기초·경사 연석): pts = [[s, yTop]...] */
  const slopedFace = (F, pts, yb, d, mat) => {
    const pos = [], nor = [], uv = [];
    for (let i = 0; i + 1 < pts.length; i++) {
      const [sa, ta] = pts[i], [sb, tb] = pts[i + 1]; if (ta <= yb && tb <= yb) continue;
      const A = PT(F, sa, d), B = PT(F, sb, d);
      const v = [[A[0], yb, A[1]], [B[0], yb, B[1]], [B[0], tb, B[1]], [A[0], yb, A[1]], [B[0], tb, B[1]], [A[0], ta, A[1]]];
      const u = [[sa, yb], [sb, yb], [sb, tb], [sa, yb], [sb, tb], [sa, ta]];
      for (let k = 0; k < 6; k++) { pos.push(...v[k]); nor.push(F.n[0], 0, F.n[1]); uv.push(u[k][0] / 24, u[k][1] / 12); }
    }
    if (!pos.length) return;
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    P(g, mat);
  };
  /** 수평 캡 (윗면 또는 아랫면). poly = [[x,z]...], up = true 이면 위를 향함 */
  const cap = (poly, y, mat, up = true) => {
    let a = 0; for (let i = 0; i < poly.length; i++) { const p = poly[i], q = poly[(i + 1) % poly.length]; a += p[0] * (-q[1]) - q[0] * (-p[1]); }
    const pp = a > 0 ? poly : [...poly].reverse();
    const g = G.capGeometry(pp, [], y);                    // ShapeGeometry 는 항상 윗면(+y)
    if (!up) { g.translate(0, -y, 0); g.scale(1, -1, 1); g.translate(0, y, 0); }   // 아랫면: 거울 반전 (법선·감김 뒤집힘)
    P(g, mat, up);
  };
  const rect = (x0, z0, x1, z1) => [[x0, z0], [x1, z0], [x1, z1], [x0, z1]];
  /** 임의 회전 박스 (중심 c, 회전 오일러 [rx, ry, rz]) */
  const obox = (w, h, d, c, rot, mat, cast = true) => {
    const g = new THREE.BoxGeometry(w, h, d);
    const m = new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(rot[0], rot[1], rot[2], 'YXZ')); m.setPosition(c[0], c[1], c[2]);
    g.applyMatrix4(m); P(g, mat, cast);
  };

  /**
   * 유리 개구 (커튼월·스토어프론트). 유리면 d, 개구 s0..s1 × y0..y1.
   * vs: 수직 멀리언 s, hs: 가로 멀리언 y, sp: 스팬드럴 [[ya,yb]], fin: {depth} (모든 수직재에 수직 핀), mw: 멀리언 폭.
   */
  const glazing = (F, s0, s1, y0, y1, { vs = [], hs = [], sp = [], d = -0.45, mw = 0.21, fin = null, glass = X.glass, frameMat = X.frame, perim = true } = {}) => {
    const ys = [...new Set([y0, y1, ...hs, ...sp.flat()].filter(y => y >= y0 && y <= y1))].sort((a, b) => a - b);
    for (let i = 0; i + 1 < ys.length; i++) {
      const ym = (ys[i] + ys[i + 1]) / 2, isSp = sp.some(([a, b]) => ym > a && ym < b);
      fq(F, s0, s1, ys[i], ys[i + 1], d, isSp ? X.spandrel : glass);
    }
    if (perim) {
      fb(F, s0, s0 + mw, y0, y1, d - 0.3, d + 0.12, frameMat); fb(F, s1 - mw, s1, y0, y1, d - 0.3, d + 0.12, frameMat);
      fb(F, s0, s1, y1 - mw, y1, d - 0.3, d + 0.12, frameMat); fb(F, s0, s1, y0, y0 + mw, d - 0.3, d + 0.14, frameMat);
    }
    for (const s of vs) fb(F, s - mw / 2, s + mw / 2, y0, y1, d - 0.3, d + 0.15, frameMat);
    for (const y of hs) fb(F, s0, s1, y - mw / 2, y + mw / 2, d - 0.25, d + 0.12, frameMat, false);
    if (fin) for (const s of [s0 + 0.1, ...vs, s1 - 0.1]) fb(F, s - 0.07, s + 0.07, y0, y1, d + 0.15, d + 0.15 + fin.depth, frameMat);
  };
  /** 양개 유리문 (스토어프론트 문): 문틀·하부 레일·밀대·문턱 */
  const doors = (F, s0, s1, y0, y1, d = -0.5, leaves = 2) => {
    const lw = (s1 - s0) / leaves;
    fq(F, s0, s1, y0, y1, d - 0.05, X.glass);
    for (let i = 0; i < leaves; i++) {
      const a = s0 + i * lw, b = a + lw;
      fb(F, a, a + 0.3, y0, y1, d - 0.2, d + 0.1, X.frame); fb(F, b - 0.3, b, y0, y1, d - 0.2, d + 0.1, X.frame);
      fb(F, a, b, y1 - 0.35, y1, d - 0.2, d + 0.1, X.frame); fb(F, a, b, y0, y0 + 0.85, d - 0.2, d + 0.1, X.frame);
      fb(F, a + 0.4, b - 0.4, y0 + 3.3, y0 + 3.45, d + 0.1, d + 0.28, X.alu, false);                 // 밀대 (패닉바 바깥 손잡이)
      const hx = i % 2 === 0 ? b - 0.55 : a + 0.45; fb(F, hx, hx + 0.1, y0 + 2.6, y0 + 6.0, d + 0.1, d + 0.3, X.alu, false);   // 세로 손잡이
    }
    fb(F, s0 - 0.1, s1 + 0.1, y0 - 0.05, y0 + 0.04, d - 0.4, d + 0.4, X.alu, false);                     // 문턱
  };
  /** 오버헤드 섹셔널 도어 (풀비전 083613.A04 또는 불투명 083613.A00) */
  const ohDoor = (F, s0, s1, y0, y1, glazed = true) => {
    const d = -0.55, w = s1 - s0, h = y1 - y0;
    fq(F, s0, s1, y0, y1, d, glazed ? X.glass : X.hm);
    const nv = Math.max(2, Math.round(w / 2.6)), nh = Math.max(3, Math.round(h / 2.0));
    for (let i = 0; i <= nv; i++) { const s = s0 + w * i / nv; fb(F, s - 0.1, s + 0.1, y0, y1, d - 0.05, d + 0.1, X.ohRail, false); }
    for (let j = 0; j <= nh; j++) { const y = y0 + h * j / nh; fb(F, s0, s1, y - 0.11, y + 0.11, d - 0.05, d + 0.12, X.ohRail, false); }
    fb(F, s0 - 0.35, s0, y0, y1 + 0.35, -0.2, 0.06, X.steel); fb(F, s1, s1 + 0.35, y0, y1 + 0.35, -0.2, 0.06, X.steel);   // 문틀(강재 잼)
    fb(F, s0 - 0.35, s1 + 0.35, y1, y1 + 0.35, -0.2, 0.06, X.steel);
    fb(F, s0 - 0.6, s0 - 0.35, 0.2, 3.0, 0.0, 0.5, X.conc);                                        // 보호 볼라드 (문 양옆)
    fb(F, s1 + 0.35, s1 + 0.6, 0.2, 3.0, 0.0, 0.5, X.conc);
  };
  /** HM 문 (짙은 회색, 손잡이) */
  const hmDoor = (F, s0, s1, y0, y1) => {
    fb(F, s0, s1, y0, y1, -0.2, -0.04, X.hm); fb(F, s0 - 0.2, s0, y0, y1 + 0.2, -0.35, 0.05, X.frame); fb(F, s1, s1 + 0.2, y0, y1 + 0.2, -0.35, 0.05, X.frame);
    fb(F, s0 - 0.2, s1 + 0.2, y1, y1 + 0.2, -0.35, 0.05, X.frame); fb(F, s1 - 0.5, s1 - 0.35, y0 + 3.3, y0 + 3.5, -0.04, 0.12, X.alu, false);
  };
  /** 루버 (테두리 + 경사 날개) */
  const louver = (F, s0, s1, y0, y1) => {
    fb(F, s0, s1, y0, y1, -0.3, -0.25, X.reveal, false);
    fb(F, s0, s0 + 0.2, y0, y1, -0.3, 0.12, X.louver); fb(F, s1 - 0.2, s1, y0, y1, -0.3, 0.12, X.louver);
    fb(F, s0, s1, y1 - 0.2, y1, -0.3, 0.12, X.louver); fb(F, s0, s1, y0, y0 + 0.2, -0.3, 0.12, X.louver);
    const c0 = PT(F, (s0 + s1) / 2, -0.1);
    for (let y = y0 + 0.45; y < y1 - 0.3; y += 0.38) obox(s1 - s0 - 0.4, 0.04, 0.42, [c0[0], y, c0[1]], [0.6, F.ry, 0], X.louver, false);
  };
  /** 수직 사다리 (055000.C04): s 중심, y0..y1, 바깥 d0 */
  const ladder = (F, s, y0, y1, d0 = 0.6, goose = true) => {
    for (const ds of [-0.75, 0.75]) fb(F, s + ds - 0.05, s + ds + 0.05, y0, y1 + (goose ? 3.5 : 0), d0 - 0.05, d0 + 0.08, X.steel, false);
    for (let y = y0 + 1; y < y1; y += 1) fb(F, s - 0.75, s + 0.75, y, y + 0.06, d0 - 0.03, d0 + 0.05, X.steel, false);
    for (let y = y0 + 1.5; y < y1; y += 4) for (const ds of [-0.75, 0.75]) fb(F, s + ds - 0.03, s + ds + 0.03, y, y + 0.1, 0, d0, X.steel, false);   // 벽 고정 브래킷
    if (goose) for (const ds of [-0.75, 0.75]) fb(F, s + ds - 0.05, s + ds + 0.05, y1 + 3.4, y1 + 3.5, -2.2, d0 + 0.08, X.steel, false);   // 거위목 손잡이
  };
  /** 입체 글자 (TextGeometry): 면 F 위 s 중심, 기준선 y, 크기 size, 최대 폭 maxW, 돌출 d */
  const text = (F, str, sC, yBase, size, maxW, d = 0.15, depth = 0.1) => {
    if (!FONT) return;
    const g = new TextGeometry(str, { font: FONT, size, depth, curveSegments: 3, bevelEnabled: false });
    g.computeBoundingBox(); const bb = g.boundingBox, w = bb.max.x - bb.min.x, k = Math.min(1, maxW / w);
    g.translate(-(bb.min.x + bb.max.x) / 2, 0, 0); g.scale(k, 1, 1);
    const ex = new THREE.Vector3(F.t[0], 0, F.t[1]), ey = new THREE.Vector3(0, 1, 0), ez = new THREE.Vector3(F.n[0], 0, F.n[1]);
    const c = PT(F, sC, d); const m = new THREE.Matrix4().makeBasis(ex, ey, ez); m.setPosition(c[0], yBase, c[1]);
    g.applyMatrix4(m); P(g.index ? g.toNonIndexed() : g, X.letters);
  };

  /**
   * 증축 상부 볼륨 한 면: zones 표대로 패널(리빌 조인트) / 커튼월(1 ft 후퇴, 4' 멀리언, VF 핀) 을 만든다.
   * yb..yt 범위의 패널 행은 JY 조인트. G 구역: 하부 밴드 10.1..12.1, 유리 12.1..35.67, 상부 35.67..36.77..39.1.
   */
  const VF = { A: { depth: 1.49 + 0.3 }, B: { depth: 0.49 + 0.3 } };
  const panels = (F, s0, s1, y0, y1, sj, mat, yj = JY) => {
    const gap = 0.055, t = 0.14;
    const S = [s0]; let acc = s0; for (const w of sj || []) { acc += w; if (acc < s1 - 0.05) S.push(acc); } S.push(s1);
    const Y = [y0, ...yj.filter(y => y > y0 + 0.05 && y < y1 - 0.05), y1];
    fq(F, s0, s1, y0, y1, -t, X.reveal);
    for (let i = 0; i + 1 < S.length; i++) for (let j = 0; j + 1 < Y.length; j++) fb(F, S[i] + gap / 2, S[i + 1] - gap / 2, Y[j] + gap / 2, Y[j + 1] - gap / 2, -t, 0, mat);
  };
  const volumeFace = (F, zones, { y0 = SOF, y1 = TOP } = {}) => {
    let s = 0;
    for (const [w, k, sub] of zones) {
      const a = s, b = s + w;
      if (k === 'G') {
        const n8 = Math.max(1, Math.round(w / 8)), seg = []; for (let i = 1; i < n8; i++) seg.push(w / n8);
        panels(F, a, b, y0, CW_B, seg, X.acmA); panels(F, a, b, CW_T, y1, seg, X.acmA, [36.77]);
        const rec = 1.0;                                                    // 커튼월 후퇴 (A-321 C1: 패널면에서 ~1'-0")
        fb(F, a, a + 0.06, CW_B, CW_T, -rec, 0, X.acmA, false); fb(F, b - 0.06, b, CW_B, CW_T, -rec, 0, X.acmA, false);   // 측면 리턴
        fb(F, a, b, CW_T - 0.06, CW_T, -rec, 0, X.acmA, false); fb(F, a, b, CW_B, CW_B + 0.06, -rec, 0, X.acmA, false);
        const vs = []; for (let x = a + 4; x < b - 0.5; x += 4) vs.push(x);
        glazing(F, a + 0.06, b - 0.06, CW_B, CW_T, { vs, hs: CW_H, sp: [[CW_B, CW_H[0]], [CW_H[2], CW_T]], d: -rec, fin: sub ? VF[sub] : null, mw: 0.21 });
      } else panels(F, a, b, y0, y1, sub, k === 'B' ? X.acmB : X.acmA);
      s = b;
    }
    return s;
  };
  /** 볼륨 소핏 (아래를 향함) + 조인트 줄눈 (패널 조인트 정렬, 4 ft 간격) */
  const soffit = (x0, z0, x1, z1, y) => {
    cap(rect(x0, z0, x1, z1), y, X.acmA, false);
    for (let x = x0 + 4; x < x1 - 0.5; x += 4) P(G.box(0.06, 0.03, z1 - z0, x, y - 0.03, (z0 + z1) / 2), X.reveal, false);
    for (let z = z0 + 6.17; z < z1 - 0.5; z += 6.17) P(G.box(x1 - x0, 0.03, 0.06, (x0 + x1) / 2, y - 0.03, z), X.reveal, false);
  };
  /** PV 어레이: 직사각 범위 안에 남향 10° 경사 모듈 열 */
  const pvArray = (x0, x1, z0, z1, y, rowAlongX = true) => {
    const tilt = 10 * Math.PI / 180, depth = 3.3, pitch = 4.6;
    if (rowAlongX) {
      for (let z = z0 + depth / 2; z <= z1 - depth / 2 + 0.01; z += pitch) {
        obox(x1 - x0, 0.12, depth, [(x0 + x1) / 2, y + 1.0, z], [tilt, 0, 0], X.pv);
        for (let x = x0 + 3.3; x < x1 - 0.5; x += 3.3) obox(0.05, 0.14, depth, [x, y + 1.02, z], [tilt, 0, 0], X.pvFrame, false);
        for (const xx of [x0 + 0.5, (x0 + x1) / 2, x1 - 0.5]) { P(G.box(0.15, 1.25, 0.15, xx, y, z + depth / 2 - 0.3), X.steel, false); P(G.box(0.15, 0.7, 0.15, xx, y, z - depth / 2 + 0.3), X.steel, false); }
      }
    }
  };
  /** 옥상 장비 (RTU): 받침 + 본체 + 상부 팬 + 측면 루버 줄 */
  const rtu = (x0, x1, z0, z1, y, h = 4, fans = 1) => {
    P(G.box(x1 - x0 + 0.6, 1.0, z1 - z0 + 0.6, (x0 + x1) / 2, y, (z0 + z1) / 2), X.steel);
    P(G.box(x1 - x0, h, z1 - z0, (x0 + x1) / 2, y + 1.0, (z0 + z1) / 2), X.acmA);
    for (let i = 0; i < fans; i++) { const fx = x0 + (x1 - x0) * (i + 0.5) / fans; P(G.cylinder(Math.min(1.3, (z1 - z0) / 3), 0.35, fx, y + 1 + h, (z0 + z1) / 2, 14), X.reveal, false); }
    for (let y2 = y + 1.6; y2 < y + h; y2 += 0.5) P(G.box(0.05, 0.08, (z1 - z0) * 0.7, x1 + 0.03, y2, (z0 + z1) / 2), X.reveal, false);
  };

  // ════════════════════════════════════════════════════════════════════════════════════════
  // 1. 기존 본동 (벽돌 2층, 지붕 THIRD 129'-4", 파라펫 32.4) — 서벽 x=EX_W (z EX_N..35.9), 남벽 z=EX_S (x 33..170), 북벽 z=EX_N
  // ════════════════════════════════════════════════════════════════════════════════════════
  const slotRows = { hs: [10.0, 15.67, 24.67], sp: [[10.0, 15.67], [24.67, 30.0]] };     // EW04/EW16
  /** 기존 벽 슬롯창: 벽면 밖으로 0.75 ft 돌출한 짙은 프레임 상자 + 유리 (입면에서 프레임 그림자가 보임, 실내 모델 유리는 벽면 밖 ~0.5) */
  const slotWin = (F, s0, s1, y0, y1, extra = {}) => {
    const f = 0.33, D = 0.78;
    fb(F, s0 - f, s0, y0 - f, y1 + f, -0.45, D, X.frame); fb(F, s1, s1 + f, y0 - f, y1 + f, -0.45, D, X.frame);
    fb(F, s0, s1, y1, y1 + f, -0.45, D, X.frame); fb(F, s0, s1, y0 - f, y0, -0.45, D + 0.05, X.frame);
    glazing(F, s0, s1, y0, y1, { ...slotRows, ...extra, d: 0.62 });
  };
  {
    // 서벽 (W 입면): 슬롯창 EW04 4' × (2.67..30.0). s = z - EX_N
    const F = face([EX_W, EX_N], [0, 1]), zs = (z) => z - EX_N;
    const ops = [[4.6, 8.6], [12.5, 16.6], [20.5, 24.6], [28.6, 32.65]].map(([a, b]) => ({ s0: zs(a), s1: zs(b), y0: 2.67, y1: 30.0 }));
    brickFace(F, 0, zs(35.82), BASE, PAR_EX, ops);
    for (const o of ops) slotWin(F, o.s0, o.s1, o.y0, o.y1);
    fb(F, zs(33.9), zs(35.82), BASE, PAR_EX + 0.3, 0, 0.22, X.coping);                             // 신축 조인트 커버 079513.16.A00
    parapet(F, 0, zs(33.9), L3, PAR_EX, X.brick);
  }
  {
    // 남벽 (S 입면): 슬롯창 EW16 7 개 (유리 4' + 동쪽 2' 금속 차양 패널). s = x - 33
    const F = face([33, EX_S], [1, 0]);
    const xs = [[39.3, 45.35], [56.25, 62.35], [73.25, 79.3], [90.25, 96.3], [107.25, 113.35], [124.25, 130.3], [141.3, 147.3]];
    const ops = xs.map(([a, b]) => ({ s0: a - 33, s1: b - 33, y0: 2.67, y1: 30.0 }));
    brickFace(F, 0, 137, BASE, PAR_EX, ops);
    for (const o of ops) {
      const gEnd = o.s0 + 4.0;
      slotWin(F, o.s0, gEnd, o.y0, o.y1);
      // 2' 차양 패널 (B02A): 바깥으로 0.9 ft 돌출, 조인트 10 / 17.33 / 24.67
      panels(F, gEnd, o.s1, o.y0, o.y1, [], X.acmA, [10.0, 17.33, 24.67]);
      fb(F, gEnd + 0.33, o.s1, o.y0, o.y1, 0.0, 0.9, X.acmA); fb(F, gEnd + 0.33, o.s1, o.y1 - 0.08, o.y1, -0.45, 0.95, X.acmA, false);
    }
    parapet(F, 0, 137, L3, PAR_EX, X.brick);
    // 노출 기초: 남면 지반(도면) 아래로 보도(월드 0)까지 콘크리트 (폴리머 오버레이)
    const pts = []; for (let x = 33; x <= 170.01; x += 2) pts.push([x - 33, lerpT(GR_S, x)]);
    slopedFace(F, pts, -LIFT - 0.3, 0.12, X.conc);
    // 남벽 서단 리턴 (x=33, 서향): 로비 남면 커튼월(z 131.5) 뒤로 보이는 벽돌 (W 입면 z 131.2..137.7)
    const R = face([33, WB_S], [0, 1]);
    brickFace(R, 0, EX_S - WB_S, BASE, SOF, []); brickFace(R, WA_S - WB_S, EX_S - WB_S, SOF, PAR_EX, []);
  }
  {
    // 북벽 z=EX_N: x 120..141 (32.4) — EW33 2층 창 2, EW12 슬롯 / x EX_W..16 (NW 모서리). s = 141 - x
    const F = face([141, EX_N], [-1, 0]);
    const ops = [{ s0: 141 - 124.8, s1: 141 - 121.75, y0: 17.33, y1: 24.67 }, { s0: 141 - 132.85, s1: 141 - 129.8, y0: 17.33, y1: 24.67 },
      { s0: 141 - 140.6, s1: 141 - 137.45, y0: 2.67, y1: 24.67 }];
    brickFace(F, 0, 141 - NA_X1, BASE, PAR_EX, ops);
    glazing(F, ops[0].s0, ops[0].s1, 17.33, 24.67, { sp: [[22.67, 24.67]], d: -0.45 });
    glazing(F, ops[1].s0, ops[1].s1, 17.33, 24.67, { sp: [[22.67, 24.67]], d: -0.45 });
    slotWin(F, ops[2].s0, ops[2].s1, 2.67, 24.67, { hs: [10.0, 15.67], sp: [[10.0, 15.67]] });
    for (const o of ops.slice(0, 2)) fb(F, o.s0 - 0.15, o.s1 + 0.15, o.y0 - 0.25, o.y0, -0.1, 0.18, X.coping);
    parapet(F, 0, 141 - NA_X1, L3, PAR_EX, X.brick);
    brickFace(F, 141 - NA_X0, 141 - EX_W, BASE, PAR_EX, []);
    parapet(F, 141 - NA_X0, 141 - EX_W, L3, PAR_EX, X.brick);
  }
  {
    // 본동 동측 노출벽: z=58 (CM 랩 지붕 위, x 141..170) / x=170 (z 52.8..HB_N, 브리지·전실 위)
    const F1 = face([170, 58], [-1, 0]);
    brickFace(F1, 0, 29, PAR_CM - 1, PAR_EX, [], BANDS_EX.filter(b => b[0] > 20)); parapet(F1, 0, 29, L3, PAR_EX, X.brick);
    const F2 = face([170, HB_N], [0, -1]);
    brickFace(F2, 0, HB_N - 52.8, 14.0, PAR_EX, [], BANDS_EX.filter(b => b[0] > 14)); parapet(F2, 0, HB_N - 52.8, L3, PAR_EX, X.brick);
    // 지붕 (THIRD) — 서측 증축 상부 볼륨이 x<33.08 / z>35.82 를 덮는다
    cap([[EX_W, EX_N], [141, EX_N], [141, 58], [170, 58], [170, EX_S], [33.08, EX_S], [33.08, 35.82], [EX_W, 35.82]], L3, X.tpo);
    // 옥상 장비 (A-103): RTU 4, 해치, 배기 팬
    rtu(38.9, 44.8, 60.4, 65.6, L3, 3.6); rtu(86.6, 98.3, 65.2, 74.0, L3, 4.5, 2); rtu(112, 118, 60.4, 65.6, L3, 3.6); rtu(143.8, 150, 60.4, 65.6, L3, 3.6);
    P(G.box(2.7, 1.0, 4.4, 99.65, L3, 42.8), X.acmA);                                               // 지붕 해치 077200.C01
    for (const [x, z] of [[40, 52], [97, 52], [130, 80], [64, 100], [110, 118], [150, 100]]) P(G.cylinder(0.6, 1.4, x, L3, z, 10), X.acmA);
  }

  // ── CM 랩 1층 (x 141..CM_E × z EX_N..52.8, 벽돌 24.7 + 금속 코핑) ──
  {
    const N = face([CM_E, EX_N], [-1, 0]);                                                           // 북면 s = CM_E - x
    brickFace(N, 0, CM_E - 141, BASE, PAR_CM, [], BANDS_EX.filter(b => b[1] < 25));
    const E = face([CM_E, 52.8], [0, -1]);                                                           // 동면 s = 52.8 - z
    const zO = (z0, z1, y0, y1) => ({ s0: 52.8 - z1, s1: 52.8 - z0, y0, y1 });
    const ops = [zO(1.65, 5.0, 0, 7.2), zO(6.85, 19.15, 0, 14.0), zO(25.95, 30.0, 2.67, 8.0), zO(42.65, 46.7, 2.67, 8.0)];
    brickFace(E, 0, 52.8 - EX_N, BASE, PAR_CM, ops, BANDS_EX.filter(b => b[1] < 25));
    hmDoor(E, ops[0].s0, ops[0].s1, 0, 7.2); ohDoor(E, ops[1].s0, ops[1].s1, 0, 14.0, false);
    glazing(E, ops[2].s0, ops[2].s1, 2.67, 8.0, { d: -0.45 }); glazing(E, ops[3].s0, ops[3].s1, 2.67, 8.0, { d: -0.45 });
    for (const o of [ops[2], ops[3]]) fb(E, o.s0 - 0.2, o.s1 + 0.2, 2.42, 2.67, -0.1, 0.2, X.lime);
    for (const [F, L] of [[N, CM_E - 141], [E, 52.8 - EX_N]]) { fb(F, 0, L, PAR_CM, PAR_CM + 0.55, -1.0, 0.18, X.coping); fqIn(F, 0, L, 24.0, PAR_CM, -0.9, X.brick); }
    cap(rect(141, EX_N, CM_E, 58), 24.0, X.tpo);
  }

  // ════════════════════════════════════════════════════════════════════════════════════════
  // 2. 고베이 (자동차 실습동, x 170..HB_E × z HB_N..EX_S): 동면 벽돌 32.3 + 풀비전 OH 도어 4, 남면 벽돌 24.7 + 성형패널 25.2..32.3
  // ════════════════════════════════════════════════════════════════════════════════════════
  {
    const E = face([HB_E, EX_S], [0, -1]);                                                           // s = EX_S - z
    const zO = (z0, z1, y0, y1) => ({ s0: EX_S - z1, s1: EX_S - z0, y0, y1 });
    const doorsZ = [[124.4, 133.6], [112.4, 122.8], [100.4, 110.7], [76.4, 97.7]];
    const ops = doorsZ.map(([a, b]) => zO(a, b, 0, 15.3)); ops.push(zO(71, 74.4, 0, 7.2));
    const L = EX_S - HB_N, cw = EX_S - 133.8;                                                         // 남동 모서리 금속패널 폭 (z 133.8..EX_S)
    brickFace(E, cw, L, BASE, PAR_HB, ops, BANDS_HB);
    for (let i = 0; i < 4; i++) ohDoor(E, ops[i].s0, ops[i].s1, 0, 15.3, true);
    hmDoor(E, ops[4].s0, ops[4].s1, 0, 7.2);
    fb(E, cw, L, 24.7, 25.3, 0, 0.12, X.coping, false);                                             // 25' 금속 띠
    panels(E, 0, cw, BASE, 24.7, [], X.acmB, [6, 12.5, 19]);                                         // 남동 모서리 금속패널 (A4/A-325)
    brickFace(E, 0, cw, 24.7, PAR_HB, [], BANDS_HB);
    parapet(E, 0, L, 29.5, PAR_HB, X.brick);

    const S = face([170, EX_S], [1, 0]);                                                             // s = x - 170
    const W = HB_E - 170;
    brickFace(S, 0, 1.7, BASE, 24.7, [], BANDS_HB.filter(b => b[1] < 25));
    brickFace(S, 3.7, 47.6, BASE, 24.7, [], BANDS_HB.filter(b => b[1] < 25));
    panels(S, 1.7, 3.7, BASE, PAR_HB, [], X.acmA, [6, 12.5, 19, 24.7]);                              // E13 조인트 패널 2' (A5/A-325)
    panels(S, 47.6, W, BASE, 24.7, [4, 2, 2, 4], X.acmB, [5.5, 7.5, 14.8, 16.8]);                    // 사인 패널 (074213.23.B02B, 기존 벽 위 설치)
    fb(S, 0, W, 24.7, 25.2, 0, 0.14, X.coping, false);
    // 25.2..32.3 성형(리브) 금속패널 074213.13.A00
    fq(S, 0, W, 25.2, PAR_HB, 0, X.formed);
    for (let s = 0.5; s < W; s += 1.0) fb(S, s - 0.08, s + 0.08, 25.2, PAR_HB, 0, 0.1, X.formed, false);
    parapet(S, 0, W, 29.5, PAR_HB, X.formed);
    { const pts = []; for (let x = 170; x <= HB_E + 0.01; x += 2) pts.push([x - 170, lerpT(GR_S, x)]); slopedFace(S, pts, -LIFT - 0.3, 0.12, X.conc); }   // 노출 기초
    // 세로 사인 "INDIANA STATE UNIVERSITY" (C7/A-203): 사인 패널 x 225.6..229.6 중앙, 글자 6½", 전체 21'-11⅝"
    {
      const chars = [...'INDIANA STATE UNIVERSITY'], n = chars.length, step = 21.97 / (n - 1);
      chars.forEach((ch, i) => { if (ch !== ' ') text(S, ch, 227.6 - 170, 23.3 - i * step - 0.27, 0.6, 1.2, 0.14, 0.08); });
    }
    // 북면 z=HB_N (브리지 아래 1층 + 브리지 지붕 위) 벽돌
    const N = face([HB_E, HB_N], [-1, 0]);
    brickFace(N, 0, HB_E - 186.4, BASE, 15.0, [], BANDS_HB.filter(b => b[1] < 16));
    brickFace(N, 0, HB_E - 170, 26.0, PAR_HB, [], BANDS_HB.filter(b => b[0] > 26));
    parapet(N, 0, HB_E - 170, 29.5, PAR_HB, X.brick);
    cap(rect(170, HB_N, HB_E, EX_S), 29.5, X.tpo);
    // 지붕 장비 (A-103)
    rtu(207.6, 211.6, 76, 81.7, 29.5, 2.5); rtu(173.3, 176.4, 91.6, 96, 29.5, 2.2); rtu(180, 185.6, 100, 107, 29.5, 3.0);
    rtu(219.5, 225.2, 97, 103.7, 29.5, 2.8); rtu(220, 226, 109, 116, 29.5, 2.8); rtu(178.6, 181.5, 125.7, 134.5, 29.5, 2.0);
    P(G.cylinder(1.4, 1.2, 179.7, 29.5, 84, 16), X.acmA);
  }

  // ── 전실 126A (x CM_E..186.4 × z 52.8..HB_N, 브리지 아래 1층): 북면 EW14 스토어프론트, 동면 EW15 출입문 + 캐노피 ──
  {
    const N = face([186.4, 52.8], [-1, 0]);                                                          // s = 186.4 - x
    const o14 = { s0: 186.4 - 182.8, s1: 186.4 - 175.6, y0: 0, y1: 10.0 };
    brickFace(N, 0, 186.4 - CM_E, BASE, 14.6, [o14], BANDS_HB.filter(b => b[1] < 15));
    glazing(N, o14.s0, o14.s1, 0, 10.0, { vs: [(o14.s0 + o14.s1) / 2], hs: [7.5], d: -0.45 });
    const E = face([186.4, HB_N], [0, -1]);                                                          // s = HB_N - z
    const o15 = { s0: HB_N - 64.5, s1: HB_N - 58.0, y0: 0, y1: 10.0 };
    brickFace(E, 0, HB_N - 52.8, BASE, 14.6, [o15], BANDS_HB.filter(b => b[1] < 15));
    doors(E, o15.s0 + 0.2, o15.s1 - 0.2, 0, 7.5, -0.5); glazing(E, o15.s0, o15.s1, 7.5, 10.0, { d: -0.5 });
    fb(E, o15.s0 - 1.5, o15.s1 + 1.5, 8.6, 9.2, 0, 4.0, X.acmB);                                     // 출입문 캐노피
    fb(N, 0, 186.4 - CM_E, 14.6, 15.0, -0.9, 0.15, X.coping); fb(E, 0, HB_N - 52.8, 14.6, 15.0, -0.9, 0.15, X.coping);
    cap(rect(CM_E, 52.8, 186.4, HB_N), 14.4, X.tpo);
  }

  // ════════════════════════════════════════════════════════════════════════════════════════
  // 3. [증축] 북측 증축 (NA): 기저 벽돌 x 16.17..119.83 × z -71.5..-22.54 (FIRST N 98', 소핏 110'-1") +
  //    상부 복합패널/커튼월 볼륨 x 5.45..121.45 × z -76.57..-22.54 (10.1..39.1) + 연결동 F..E (z -22.54..0, 전고 유리 EW05/EW11)
  // ════════════════════════════════════════════════════════════════════════════════════════
  const ew06 = { sp: [[FN, FN + 1.17], [7.96, SOF]], hs: [FN + 1.17, 7.96] };
  const naWin = (F, o, mid = false) => {
    glazing(F, o.s0, o.s1, o.y0, o.y1, { ...ew06, vs: mid ? [(o.s0 + o.s1) / 2] : [], d: -0.45 });
    fb(F, o.s0 - 0.2, o.s1 + 0.2, BASE, FN, -0.06, 0.1, X.lime);                                    // 석회석 블록 (지반 → 창대)
    fb(F, o.s0 - 0.25, o.s1 + 0.25, FN - 0.3, FN, -0.06, 0.18, X.lime);                              // 창대 돌출
  };
  {
    // 북면 z=NA_Z0 (s = NA_X1 - x)
    const F = face([NA_X1, NA_Z0], [-1, 0]);
    const xs = [[17.15, 21.6], [25.45, 29.55], [37.5, 41.55], [55.45, 59.55], [63.45, 71.55], [75.5, 79.55], [93.45, 97.55], [105.5, 109.55], [114.5, 119.0]];
    const ops = xs.map(([a, b]) => ({ s0: NA_X1 - b, s1: NA_X1 - a, y0: FN, y1: SOF, rd: 0.45 }));
    brickFace(F, 0, NA_X1 - NA_X0, BASE, SOF, ops, []);
    ops.forEach((o, i) => naWin(F, o, xs[i][1] - xs[i][0] > 6));
    // 서면 x=NA_X0 (s = z - NA_Z0): 기저 창 4 + 연결동 EW05 (z -22.6..-1.5, -4.67..32.1)
    const W = face([NA_X0, NA_Z0], [0, 1]);
    const zs = [[-70.4, -66.5], [-58.6, -50.5], [-42.6, -38.5], [-32.6, -28.5]];
    const wops = zs.map(([a, b]) => ({ s0: a - NA_Z0, s1: b - NA_Z0, y0: FN, y1: SOF }));
    brickFace(W, 0, -22.54 - NA_Z0, BASE, SOF, wops, []);
    wops.forEach((o, i) => naWin(W, o, zs[i][1] - zs[i][0] > 6));
    // 동면 x=NA_X1 (s = EX_N - z): 출입문 EW10 (vestibule 109) + 창 3 + 연결동 EW11
    const E = face([NA_X1, EX_N], [0, -1]);
    const ze = [[-70.45, -66.5], [-58.6, -50.5], [-42.55, -38.45]];
    const eops = ze.map(([a, b]) => ({ s0: EX_N - b, s1: EX_N - a, y0: FN, y1: SOF }));
    const door = { s0: EX_N + 26.45, s1: EX_N + 34.6, y0: FN, y1: SOF };
    brickFace(E, EX_N + 22.54, EX_N - NA_Z0, BASE, SOF, [...eops, door], []);
    eops.forEach((o, i) => naWin(E, o, ze[i][1] - ze[i][0] > 6));
    {
      const dc = (door.s0 + door.s1) / 2;
      doors(E, dc - 3.12, dc + 3.12, FN, FN + 8.17, -0.5);
      glazing(E, door.s0, dc - 3.12, FN, SOF, { hs: [FN + 8.17], d: -0.45 }); glazing(E, dc + 3.12, door.s1, FN, SOF, { hs: [FN + 8.17], d: -0.45 });
      glazing(E, dc - 3.12, dc + 3.12, FN + 8.17, SOF, { hs: [FN + 9.92], sp: [[FN + 9.92, SOF]], d: -0.45 });
      fb(E, door.s0 - 0.3, door.s1 + 0.3, FN - 0.4, FN, -0.5, 1.5, X.conc);                          // 출입문 앞 콘크리트 턱
    }
    // 연결동 F..E: 전고 유리 (EW05 서 / EW11 동) — 스팬드럴은 층 슬래브 위치
    const ew05 = (F, s0, s1, yb) => {
      const vs = []; for (let s = s0 + 2.625; s < s1 - 0.5; s += 3.61) vs.push(s);
      glazing(F, s0, s1, yb, 32.1, { vs, hs: [-0.75, 10.0, 15.67, 23.7], sp: [[yb, -0.75], [10.0, 15.67]], d: -0.5 });
      fb(F, s0 - 0.3, s1 + 0.3, yb - 0.6, yb, -0.1, 0.15, X.lime);
      fb(F, s0 - 0.3, s1 + 0.3, BASE, yb - 0.6, -0.1, 0.05, X.conc);
    };
    ew05(W, -22.6 - NA_Z0, -1.5 - NA_Z0, -4.67);
    panels(W, -1.5 - NA_Z0, EX_N - NA_Z0, BASE, 32.1, [], X.acmA, [SOF, 20, 30]);
    panels(W, -22.54 - NA_Z0, -22.6 - NA_Z0 + 0.06, BASE, 32.1, [], X.acmA);
    ew05(E, EX_N + 1.45, EX_N + 22.55, -2.0);
    panels(E, 0, EX_N + 1.45, BASE, 32.1, [], X.acmA, [SOF, 20, 30]);
    for (const [F, a, b] of [[W, -22.54 - NA_Z0, EX_N - NA_Z0], [E, 0, EX_N + 22.54]]) { fb(F, a, b, 32.1, 32.4, -1.0, 0.15, X.coping); fqIn(F, a, b, 30.8, 32.1, -0.9, X.acmA); }
    cap(rect(NA_X0, -22.54, NA_X1, EX_N), 30.8, X.tpo);
    // 덕트 인클로저 2 (F7/F8): 성형패널 30.8..36.4, 그래블 스톱
    for (const [x0, x1] of [[71.4, 77.9], [97.7, 104.5]]) {
      const dz0 = -22.54, dz1 = -4.5;
      for (const F of [face([x0, dz0], [0, 1]), face([x1, dz1], [0, -1]), face([x0, dz1], [1, 0])]) {
        const L = F.t[0] ? x1 - x0 : dz1 - dz0;
        fq(F, 0, L, 30.8, 36.4, 0, X.formedDk); for (let s = 0.9; s < L; s += 1.83) fb(F, s - 0.07, s + 0.07, 30.8, 36.4, 0, 0.1, X.formedDk, false);
        fb(F, 0, L, 36.4, 36.7, -0.2, 0.08, X.coping);
      }
      cap(rect(x0, dz0, x1, dz1), 36.4, X.formedDk);
    }

    // ── 상부 볼륨 ──
    const UN = face([121.45, -76.57], [-1, 0]), UW = face([5.45, -76.57], [0, 1]), UE = face([121.45, -22.54], [0, -1]), US = face([5.45, -22.54], [1, 0]);
    volumeFace(UN, NA_N); volumeFace(UW, NA_W); volumeFace(UE, NA_E);
    // 남면 (F1): 서측 레그 12' 전고, 중앙 연결동 지붕 위 클리어스토리 GL-05 31.08..36.67, 동측 레그 2'-7¼"
    panels(US, 0, 12, SOF, TOP, [2, 2, 4, 2], X.acmA);
    panels(US, 113.41, 116, SOF, TOP, [], X.acmA);
    panels(US, 12, 113.41, 30.8, 31.08, [], X.acmA, []);
    { const vs = []; for (let s = 12 + 5.6; s < 113.41 - 1; s += 6.34) vs.push(s);
      glazing(US, 12, 113.41, 31.08, 36.67, { vs, d: -0.4, glass: X.frit }); }
    panels(US, 12, 113.41, 36.67, TOP, [8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8], X.acmA, [36.77]);
    ladder(US, 70.2 - 5.45, 30.8, TOP, 0.65); ladder(US, 79.2 - 5.45, 30.8, TOP, 0.65);
    // 상단: 코핑 + 지붕 + 파라펫 안쪽면
    for (const [F, L] of [[UN, 116], [UW, 54.03], [UE, 54.03], [US, 116]]) parapet(F, 0, L, RF, TOP, X.acmA, 0.9);
    cap(rect(5.45, -76.57, 121.45, -22.54), RF, X.tpo);
    soffit(5.45, -76.57, 121.45, NA_Z0, SOF); soffit(5.45, NA_Z0, NA_X0, -22.54, SOF); soffit(NA_X1, NA_Z0, 121.45, -22.54, SOF);
    // 지붕 PV (A-103) — 2열 × 4행
    for (const [x0, x1] of [[15.7, 55.9], [72, 104.3]]) for (const [z0, z1] of [[-67.4, -63.8], [-62.7, -58], [-49, -44.2], [-43.4, -38.7]]) pvArray(x0, x1, z0, z1, RF);
  }

  // ════════════════════════════════════════════════════════════════════════════════════════
  // 4. 기계 펜트하우스 (기존 지붕 위, L 자): 성형패널 30.7..46.3 (리브 1'-10"), 수평 조인트 36.6, 동면 루버 3, 남면 HM 문
  // ════════════════════════════════════════════════════════════════════════════════════════
  {
    const y0 = 30.7, yTop = 46.0, yJ = 36.6;
    const faces = [
      [face([103.4, -0.2], [-1, 0]), 55.5], [face([47.9, -0.2], [0, 1]), 39.2], [face([47.9, 39.0], [1, 0]), 20.3],
      [face([68.2, 39.0], [0, -1]), 3.6], [face([68.2, 35.4], [1, 0]), 35.2], [face([103.4, 35.4], [0, -1]), 35.6],
    ];
    for (const [F, L] of faces) {
      fq(F, 0, L, L3, yTop, 0, X.formed);
      for (let s = 0.9; s < L - 0.1; s += 1.833) fb(F, s - 0.09, s + 0.09, y0, yTop, 0, 0.13, X.formed, false);   // 리브
      fb(F, 0, L, yJ - 0.04, yJ + 0.04, -0.02, 0.15, X.reveal, false);                                         // 수평 조인트
      fb(F, 0, L, L3, y0, 0, 0.25, X.coping);                                                                   // 하부 플래싱 (TPO 턴업)
      parapet(F, 0, L, PR, yTop, X.formed, 0.6);
    }
    const E = faces[5][0];                                                         // 동면 s = 35.4 - z
    for (const [z0, z1] of [[26.2, 35.2], [15.2, 20.8], [2.6, 9.8]]) louver(E, 35.4 - z1, 35.4 - z0, 36.3, 42.5);
    hmDoor(faces[2][0], 16.7, 19.9, y0 + 1.0, y0 + 8.0);                          // 남면 HM 문 (081113.A00)
    cap([[47.9, -0.2], [103.4, -0.2], [103.4, 35.4], [68.2, 35.4], [68.2, 39.0], [47.9, 39.0]], PR, X.tpo);
    rtu(72, 80, 8, 14, PR, 2.2); rtu(86, 92, 20, 26, PR, 1.8);
  }

  // ════════════════════════════════════════════════════════════════════════════════════════
  // 5. [증축] 서측 증축 (WA): 상부 볼륨 x WA_X..33.08 × z 35.82..WA_S + 로비 기저 (FIRST SW 95'):
  //    서면 커튼월 EW01 x=WB_X (z 61.5..131.5, 하단 95'→98' 경사), 석회석 출입 전실 100 (x WV_X..WB_X × z 39.5..61.5, 문 EW02),
  //    남면 커튼월 EW17 z=WB_S (x WB_X..32), 남서 모서리 석회석 기둥.
  // ════════════════════════════════════════════════════════════════════════════════════════
  {
    const UW = face([WA_X, 35.82], [0, 1]), US = face([WA_X, WA_S], [1, 0]), UN = face([33.08, 35.82], [-1, 0]), UE = face([33.08, WA_S], [0, -1]);
    const LW = WA_S - 35.82, LS = 33.08 - WA_X;
    volumeFace(UW, WA_WZ); volumeFace(US, WA_SZ);
    // 북면: x EX_W..33.08 은 기존 지붕 위 밴드, x WA_X..EX_W 는 전고 레그 (G6) / 동면: 기존 지붕 위 밴드 (G2)
    panels(UN, 0, 33.08 - EX_W, L3 + 0.1, TOP, [8, 8, 8, 8], X.acmA, [30.6, 36.77]);
    panels(UN, 33.08 - EX_W, LS, SOF, TOP, [2, 4, 2], X.acmA);
    panels(UE, 0, WA_S - EX_S, SOF, TOP, [], X.acmA);                                                // 기존 남벽 바깥으로 나온 부분 (전고)
    panels(UE, WA_S - EX_S > 0 ? WA_S - EX_S : 0, LW, L3 + 0.1, TOP, [2.86, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8], X.acmA, [30.6, 36.77]);
    ladder(UE, LW - 3.5, L3, TOP, 0.65);
    for (const [F, L] of [[UW, LW], [US, LS], [UN, LS], [UE, LW]]) parapet(F, 0, L, RF, TOP, X.acmA, 0.9);
    cap(rect(WA_X, 35.82, 33.08, WA_S), RF, X.tpo);
    soffit(WA_X, 35.82, WB_X, WA_S, SOF); soffit(WB_X, WB_S, 33.08, WA_S, SOF);
    for (const [x0, x1] of [[-1.7, 8.7], [13, 23.4]]) pvArray(x0, x1, 57, 119, RF);
    // "BAILEY COLLEGE / OF ENGINEERING / AND TECHNOLOGY" (B7/A-203): 서면 짙은 패널 z 95.82..115.82 중앙, 9" 글자 3 줄 (11'-0⅛" 폭)
    const sc = 105.82 - 35.82;
    [['BAILEY COLLEGE', 33.7], ['OF ENGINEERING', 32.35], ['AND TECHNOLOGY', 31.0]].forEach(([t, y]) => text(UW, t, sc, y, 1.0, 11.0, 0.15, 0.1));

    // ── 로비 기저 서면 (s = z - 35.82) ──
    const zs = (z) => z - 35.82;
    const B0 = face([EX_W, 35.82], [0, 1]);                                                          // z 35.82..39.5: 기존 벽 연장선의 금속패널 (W 입면 z 36..39.8)
    panels(B0, 0, zs(39.5), BASE, SOF, [], X.acmA, [0.5, 5.5]);
    // 출입 전실 100: 석회석 (044200.A02) x WV_X..WB_X, z 39.5..61.5, 상단 6.0 (W 입면). 문 EW02 z 43.9..50.0 / 50.0..51.5 (사이드라이트) / 51.5..57.7, 높이 8'-2½"
    const VW = face([WV_X, 39.5], [0, 1]), VN = face([WB_X, 39.5], [-1, 0]), VS = face([WV_X, 61.5], [1, 0]);
    const dA = 43.9 - 39.5, dB = 57.7 - 39.5, dTop = FSW + 8.2, VT = 6.0;
    fwall(VW, 0, 22, BASE, VT, X.lime, [{ s0: dA, s1: dB, y0: FSW, y1: dTop }]);
    reveal(VW, { s0: dA, s1: dB, y0: FSW, y1: dTop }, 0.8, X.lime);
    doors(VW, dA, 50.0 - 39.5, FSW, dTop, -0.6); doors(VW, 51.5 - 39.5, dB, FSW, dTop, -0.6);
    glazing(VW, 50.0 - 39.5, 51.5 - 39.5, FSW, dTop, { d: -0.6 });
    for (const y of [FSW + 2.67, dTop, dTop + 1.4]) fb(VW, 0, 22, y - 0.025, y + 0.025, -0.02, 0.02, X.reveal, false);   // 석재 줄눈
    for (const s of [2.2, dA, dB, 19.8, 4.4 + 4.67, 4.4 + 9.33]) fb(VW, s - 0.025, s + 0.025, s === dA || s === dB ? dTop : FSW, VT, -0.02, 0.02, X.reveal, false);
    for (const [F, L] of [[VN, WB_X - WV_X], [VS, WB_X - WV_X]]) fwall(F, 0, L, BASE, VT, X.lime);
    fb(VW, -0.1, 22.1, VT, VT + 0.3, -(WB_X - WV_X), 0.12, X.coping);                               // 전실 지붕 코핑
    cap(rect(WV_X, 39.5, WB_X, 61.5), VT, X.tpo);
    // 입구 사인 "INDIANA STATE UNIVERSITY" (A7): 전실 지붕 위 지지 튜브, 9" 글자, 폭 14'-8⅝", 출입구 중앙
    { const sc2 = (dA + dB) / 2;
      text(VW, 'INDIANA STATE UNIVERSITY', sc2, VT + 0.55, 0.95, 14.72, 0.0, 0.12);
      for (let k = -2; k <= 2; k++) fb(VW, sc2 + k * 3.4 - 0.08, sc2 + k * 3.4 + 0.08, VT + 0.3, VT + 0.65, -0.25, -0.09, X.letters, false); }
    // 전실 위 (6.0..9.67) 와 북쪽 (z 39.5..61.5) 의 커튼월 EW01 상부, 4'-8" 모듈
    const B = face([WB_X, 35.82], [0, 1]);
    glazing(B, zs(39.5), zs(61.5), VT, 9.67, { vs: [43.5, 48.17, 52.83, 57.5].map(zs), d: -0.3 });
    // 커튼월 EW01 z 61.5..131.5: 4' 멀리언, 트랜섬 6.06 (95'+11'-0¾"), 하단 경사 (95' → 98')
    const cs0 = zs(61.5), cs1 = zs(WB_S);
    const sillAt = (z) => z <= 63.8 ? FSW : z >= 100.2 ? FN : FSW + (FN - FSW) * (z - 63.8) / (100.2 - 63.8);
    { const vs = []; for (let z = 65.5; z < WB_S - 0.5; z += 4) vs.push(zs(z));
      const edges = [cs0, ...vs, cs1];
      for (let i = 0; i + 1 < edges.length; i++) {                                                   // 하단이 기울어 있으므로 베이마다 하단을 잘라 붙인다
        const a = edges[i], b = edges[i + 1], yb = sillAt((a + b) / 2 + 35.82);
        glazing(B, a, b, yb, 9.67, { hs: [6.06], d: -0.3, perim: false });
        fb(B, a, b, yb, yb + 0.21, -0.6, -0.16, X.frame, false);
      }
      for (const s of edges) fb(B, s - 0.105, s + 0.105, sillAt(s + 35.82), 9.67, -0.6, -0.15, X.frame);
      fb(B, cs0, cs1, 9.46, 9.67, -0.6, -0.18, X.frame, false);
      const pts = []; for (let z = 61.5; z <= WB_S + 0.01; z += 1) pts.push([zs(z), sillAt(z)]);
      slopedFace(B, pts, BASE, 0.2, X.lime);                                                         // 석회석 기단 (044200.A03, 경사 상단)
      for (const [s, y] of pts) fb(B, s - 0.52, s + 0.52, y - 0.12, y + 0.02, -0.3, 0.26, X.lime, false);
    }
    panels(B, zs(39.5), cs1, 9.67, SOF, [], X.acmA, []);
    // ── 로비 기저 남면 z=WB_S (s = x - WB_X): EW17 커튼월 x WB_X..32 (1'-7" + 8×4'), 하단 -2 (98'), 석회석 기단 ──
    const BS = face([WB_X, WB_S], [1, 0]);
    { const vs = []; for (let x = 1.08; x < 31.5; x += 4) vs.push(x - WB_X);
      glazing(BS, 0, 32 - WB_X, FN, SOF - 0.05, { vs, hs: [6.06], d: -0.3 });
      fb(BS, 0, 32 - WB_X, BASE, FN, 0, 0.2, X.lime); fb(BS, 0, 32 - WB_X, FN - 0.25, FN, -0.3, 0.3, X.lime); }
    fb(BS, 32 - WB_X, 33 - WB_X, BASE, SOF, -0.5, 0, X.brick);
    // 남서 모서리 석회석 기둥 (S 입면 x -3.5..-0.2, 상단 6.0 + 캡)
    P(G.box(3.3, 6.0 - BASE, 4.0, -1.85, BASE, WB_S), X.lime); P(G.box(3.6, 0.3, 4.3, -1.85, 6.0, WB_S), X.lime);
  }

  // ════════════════════════════════════════════════════════════════════════════════════════
  // 6. 스카이브리지 250 (MT-SECOND 117'-4⅜"): 직선부 z 57.3..67.5 (x 170..227, 남측 = 고베이 북벽) + 사선부 → Myers.
  //    유리 EW29..EW31: GL-04 스팬드럴 2'-4¾" + GL-03 비전 (개구 10'-9½"), 기존 박공 금속 지붕 (02-A2), 강재 기둥.
  // ════════════════════════════════════════════════════════════════════════════════════════
  {
    const bot = 15.03 - 1.4, flo = MT2, g1 = 15.03 + 10.79, eave = 26.4, ridge = 31.2;
    // 직선부: 북면 유리 z 57.3 (EW29), 남측은 고베이 북벽 (z HB_N). x 170 (본동 동벽) .. 228.5
    const zN = 57.3, x1 = 228.5, rz0 = zN - 1.0, rz1 = HB_N + 0.7, hw = (rz1 - rz0) / 2, rzm = (rz0 + rz1) / 2;
    const N = face([x1, zN], [-1, 0]), LN = x1 - 170;
    { const vs = []; for (let s = 2.57; s < LN - 0.5; s += 2.57) vs.push(s);
      glazing(N, 0, LN, 15.03, g1, { vs, hs: [flo], sp: [[15.03, flo]], d: -0.3 }); }
    fb(N, 0, LN, bot, 15.03, -0.3, 0.25, X.steel);                                                  // 바닥 테두리 보
    fb(N, 0, LN, g1, eave, -0.3, 0.2, X.acmA);                                                      // 파시아
    P(G.box(LN, 0.3, HB_N - zN, (x1 + 170) / 2, bot, (zN + HB_N) / 2), X.steel);
    // 박공 지붕 (리지 x 방향, 기존 02-A2) + 스탠딩심 리브
    P(G.gableRoof(rect(170, rz0, x1 + 1, rz1), eave, (ridge - eave) / hw, 0), X.formed);
    for (let x = 171; x < x1 + 0.9; x += 1.5) for (const sg of [-1, 1]) {
      const zm = rzm + sg * hw / 2, ym = (eave + ridge) / 2;
      obox(0.07, 0.1, Math.hypot(hw, ridge - eave), [x, ym + 0.07, zm], [sg * Math.atan2(ridge - eave, hw), 0, 0], X.formed, false);
    }
    // 동단 박공 마감 (짙은 패널) — 사선부와의 접합
    { const gF = face([x1 + 1, rz1], [0, -1]);
      fq(gF, 0, rz1 - rz0, bot, eave, 0, X.acmB);
      const sh = new THREE.Shape([new THREE.Vector2(0, eave), new THREE.Vector2(rz1 - rz0, eave), new THREE.Vector2(hw, ridge)]);
      const g = new THREE.ShapeGeometry(sh); const m = new THREE.Matrix4().makeBasis(new THREE.Vector3(0, 0, -1), new THREE.Vector3(0, 1, 0), new THREE.Vector3(1, 0, 0)); m.setPosition(x1 + 1, 0, rz1); g.applyMatrix4(m); P(g, X.acmB); }
    // 기둥 (N 입면: x≈205, 228.5, 266.5)
    for (const [x, z] of [[205.5, 58.2], [227.2, 58.4]]) P(G.box(1.0, bot - BASE, 1.0, x, BASE, z), X.steel);

    // 사선부: (227, 62.4) → Myers 접속 (270.5, 36.5), 폭 10.2. Myers 쪽 지면 기준(월드 17.4)까지 바닥을 기울인다.
    const a = [227.5, rzm], b = [270.5, 36.5], L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const t = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], nrm = [-t[1], t[0]];
    const drop = (MT2 + LIFT) - 17.4;                                                                 // 접속부 높이차
    const yOff = (s) => -drop * s / L;
    const sides = [face([a[0] + nrm[0] * 5.1, a[1] + nrm[1] * 5.1], t), face([b[0] - nrm[0] * 5.1, b[1] - nrm[1] * 5.1], [-t[0], -t[1]])];
    const n = Math.ceil(L / 2.5);
    for (let i = 0; i < n; i++) {
      const s0 = (L * i) / n, s1 = (L * (i + 1)) / n, sm = (s0 + s1) / 2, dy = yOff(sm);
      for (let k = 0; k < 2; k++) {
        const F = sides[k], u0 = k ? L - s1 : s0, u1 = k ? L - s0 : s1;
        fq(F, u0, u1, 15.03 + dy, flo + dy, -0.3, X.spandrel); fq(F, u0, u1, flo + dy, g1 + dy, -0.3, X.glass);
        fb(F, u0, u0 + 0.2, 15.03 + dy, g1 + dy, -0.55, -0.15, X.frame);
        fb(F, u0, u1, flo + dy - 0.1, flo + dy + 0.1, -0.5, -0.15, X.frame, false);
        fb(F, u0, u1, bot + dy, 15.03 + dy, -0.3, 0.25, X.steel); fb(F, u0, u1, g1 + dy, eave + dy, -0.3, 0.2, X.acmA);
      }
      const c = [a[0] + t[0] * sm, a[1] + t[1] * sm], ry = -Math.atan2(t[1], t[0]);
      P(G.box(s1 - s0 + 0.02, 0.3, 10.2, c[0], bot + dy, c[1], { ry }), X.steel);
      // 박공 지붕 (리지 = 브리지 축)
      const slope = Math.atan2(ridge - eave, 5.85), hw = 5.85;
      for (const sg of [-1, 1]) {
        const cc = [c[0] + nrm[0] * sg * hw / 2, c[1] + nrm[1] * sg * hw / 2];
        obox(s1 - s0 + 0.05, 0.12, Math.hypot(hw, ridge - eave) + 0.2, [cc[0], (eave + ridge) / 2 + dy, cc[1]], [sg * slope, ry, 0], X.formed);
      }
    }
    for (const s of [3, L - 4]) { const c = [a[0] + t[0] * s, a[1] + t[1] * s];
      for (const sg of [-1, 1]) P(G.box(1.0, bot + yOff(s) - BASE, 1.0, c[0] + nrm[0] * sg * 3.8, BASE, c[1] + nrm[1] * sg * 3.8), X.steel); }
  }

  // ── CM 랩 마당 자재 보관 울타리 124C (A-101: x 175..194.3 × z 22.7..42, 스탠딩심 지붕, D6/A-404 미보유 → 높이 추정 8'/12') ──
  {
    const x0 = 176.5, x1 = 193.5, z0 = 24.6, z1 = 41.5;
    for (const [x, z] of [[x0, z0], [x1, z0], [x0, z1], [x1, z1]]) P(G.box(0.6, 12.6 - BASE, 0.6, x, BASE, z), X.steel);
    const fence = [face([x0, z0], [1, 0]), face([x1, z0], [0, 1]), face([x1, z1], [-1, 0]), face([x0, z1], [0, -1])];
    for (const F of fence) {
      const Lf = F.t[0] ? x1 - x0 : z1 - z0;
      for (const y of [0.4, 4.0, 7.8]) fb(F, 0, Lf, y, y + 0.12, -0.06, 0.06, X.steel, false);
      for (let s = 0.5; s < Lf; s += 0.6) fb(F, s - 0.03, s + 0.03, 0.2, 8.0, -0.03, 0.03, X.steel, false);
    }
    P(G.box(x1 - x0 + 2, 0.3, z1 - z0 + 2, (x0 + x1) / 2, 12.3, (z0 + z1) / 2), X.formed);
    for (let x = x0 - 0.8; x < x1 + 1; x += 1.5) P(G.box(0.07, 0.1, z1 - z0 + 2, x, 12.6, (z0 + z1) / 2), X.formed, false);
  }

  // ════════════════════════════════════════════════════════════════════════════════════════
  // 7. 지반 둔덕 (월드 y = 0 은 서측 보도 = 95'). 도면 지반이 그보다 높은 북·동쪽 벽에서 3:1 경사로 내려오는 흙/포장 면.
  // ════════════════════════════════════════════════════════════════════════════════════════
  {
    const src = [];                                                                                  // [x, z, 월드 지반고]
    const addLine = (x0, z0, x1, z1, gfn) => { const L = Math.hypot(x1 - x0, z1 - z0), n = Math.max(1, Math.ceil(L / 2)); for (let i = 0; i <= n; i++) { const x = x0 + (x1 - x0) * i / n, z = z0 + (z1 - z0) * i / n; const g = gfn(x, z) + LIFT; if (g > 0.05) src.push([x, z, g]); } };
    addLine(NA_X0, NA_Z0, NA_X1, NA_Z0, (x) => lerpT(GR_N, x));        // 북측 증축 북면
    addLine(NA_X1, NA_Z0, NA_X1, EX_N, (x, z) => lerpT(GR_E, z));      // 북측 증축 동면 + 연결동
    addLine(NA_X1, EX_N, CM_E, EX_N, (x) => lerpT(GR_N, x));           // 기존 북벽 + CM 랩
    addLine(CM_E, EX_N, CM_E, 52.8, (x, z) => lerpT(GR_E, z));         // CM 랩 동면
    addLine(CM_E, 52.8, 186.4, 52.8, (x) => lerpT(GR_N, x));           // 전실 북면
    addLine(186.4, 52.8, 186.4, HB_N, (x, z) => lerpT(GR_E, z));       // 전실 동면
    addLine(186.4, HB_N, HB_E, HB_N, (x) => lerpT(GR_N, x));           // 고베이 북면 (브리지 아래)
    addLine(HB_E, HB_N, HB_E, EX_S, (x, z) => lerpT(GR_E, z));         // 고베이 동면
    const K = 1 / 3;                                                                                  // 3:1 경사
    const inside = (x, z) => {                                                                       // 1 ft 안쪽으로 줄인 1층 외곽 안인가
      const R = [[WV_X, 35.82, 33, WB_S], [EX_W, EX_N, 170, EX_S], [141, EX_N, CM_E, 52.8], [170, 52.8, 186.4, HB_N], [170, HB_N, HB_E, EX_S], [NA_X0, NA_Z0, NA_X1, EX_N]];
      return R.some(([a, b, c, d]) => x > a + 1 && x < c - 1 && z > b + 1 && z < d - 1);
    };
    const paved = (x, z) => (x > HB_E && z > HB_N - 2 && z < EX_S + 2) || (x > CM_E && z < 52.8 && z > EX_N - 1) || (x > 186.4 && z > 52.8 && z < HB_N);
    const x0 = 10, x1 = 252, z0 = -90, z1 = 142, st = 2;
    const nx = Math.round((x1 - x0) / st), nz = Math.round((z1 - z0) / st);
    const H = new Float32Array((nx + 1) * (nz + 1));
    for (let j = 0; j <= nz; j++) for (let i = 0; i <= nx; i++) {
      const x = x0 + i * st, z = z0 + j * st; let h = 0;
      for (const [sx, sz, g] of src) { const v = g - K * Math.hypot(x - sx, z - sz); if (v > h) h = v; }
      H[j * (nx + 1) + i] = h;
    }
    // 남쪽(Chestnut St 보도)으로는 둔덕을 넘기지 않는다: z = ZCLIP 에서 자르고 콘크리트 옹벽 면으로 마감
    const ZCLIP = EX_S + 1.0, hAt = (x, z) => { const i = Math.min(nx, Math.max(0, Math.round((x - x0) / st))), j = Math.min(nz, Math.max(0, Math.round((z - z0) / st))); return H[j * (nx + 1) + i]; };
    { const F = face([HB_E, ZCLIP], [1, 0]), pts = [];
      for (let x = HB_E; x <= x1 + 0.01; x += st) pts.push([x - HB_E, hAt(x, ZCLIP - 1) - LIFT + 0.15]);
      slopedFace(F, pts, -LIFT - 0.3, 0, X.conc);
      for (let k = 0; k + 1 < pts.length; k++) if (pts[k][1] > -LIFT + 0.1) fb(F, pts[k][0], pts[k + 1][0], pts[k][1], pts[k][1] + 0.12, -0.8, 0.05, X.conc, false); }
    const geo = { grass: [], walk: [] };
    for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) {
      const k = j * (nx + 1) + i, hs = [H[k], H[k + 1], H[k + nx + 2], H[k + nx + 1]];
      if (Math.max(...hs) < 0.03) continue;
      const cx = x0 + (i + 0.5) * st, cz = z0 + (j + 0.5) * st; if (inside(cx, cz) || cz > ZCLIP) continue;
      const xa = x0 + i * st, za = z0 + j * st, Y = (h) => h - LIFT + 0.02;
      const q = [[xa, Y(hs[0]), za], [xa + st, Y(hs[1]), za], [xa + st, Y(hs[2]), za + st], [xa, Y(hs[3]), za + st]];
      (paved(cx, cz) ? geo.walk : geo.grass).push(...q[0], ...q[2], ...q[1], ...q[0], ...q[3], ...q[2]);
    }
    for (const [key, mat] of [['grass', X.grass], ['walk', X.walk]]) {
      const arr = geo[key]; if (!arr.length) continue;
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(arr, 3));
      const uv = []; for (let i = 0; i < arr.length; i += 3) uv.push(arr[i] / 14, arr[i + 2] / 14);
      g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.computeVertexNormals();
      P(g, mat, false);
    }
  }

  const grp = new THREE.Group();
  for (const m of G.mergeByMaterial(parts)) grp.add(m);
  // LIFT: app.js 의 toWorld() 가 position.y = 0 으로 놓으므로, 이 그룹의 y 는 항상 LIFT 를 돌려주게 고정한다 (실내 모델도 이 그룹의 자식).
  Object.defineProperty(grp.position, 'y', { get: () => LIFT, set: () => {}, configurable: true });
  let tris = 0; grp.traverse(o => { if (o.isMesh) tris += (o.geometry.index ? o.geometry.index.count : o.geometry.attributes.position.count) / 3; });
  grp.userData.tris = tris;
  return grp;
}
