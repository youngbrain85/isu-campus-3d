// Cunningham Memorial Library (1973) — 사진·위성 기반 모델 (도면 없음). 월드 좌표(ft)로 직접 작성.
// 근거: Street View vp14 (7th St 쪽 사분면, 서향 222/267/312 — 267 에서 동측 입면 정면), Esri z20(겨울)·z19(여름) 위성.
//   (vp15 3장은 Reeve Hall 을 찍은 것이라 사용하지 않음)
// ■ 층수·높이: 지하 1층(lower level, 모델 안 함) + 지상 4층. 1층 15 ft, 2~4층 12.5 ft → 지붕 슬래브 52.5, 난간 상단 54.5.
//   사진 vp14_267 에서 지면~지붕선 ≈ 56 px(거리 ≈ 520 ft, f = 512 px) → 약 55 ft. 여름 위성 그림자(북 ≈ 23 ft)도 간호대(51 ft)와 같은 비율.
// ■ 재료: 외벽 전체가 밝은 베이지-회색 프리캐스트 콘크리트 패널(사진: 거의 무창의 큰 면). 벽돌 아님.
// ■ 입면 리듬: 무창 패널 벽 + 각 면에 깊이 8 ft · 폭 18 ft 의 수직 '슬롯'(전 층 높이 유리 커튼월, 짙은 유리·멀리언).
//   위성 지붕 외곽선의 노치로 위치 확인 — 동·서면 3개 (z ≈ -711, -645, -555), 남·북면 2개 (x ≈ 273, 381, 좌우 대칭).
//   층 경계에 얕은 띠(0.15 ft 돌출)로 패널 줄눈 표현, 슬롯 안은 층마다 어두운 스팬드럴.
// ■ 1층: 동측은 긴 열주 캐노피(way/1464442480, x 439~452, 높이 ≈ 15 ft — 사진의 밝은 수평 캐노피 + 기둥, 위성 그림자 비 0.3)
//   뒤로 1층 유리벽이 3 ft 후퇴(사진의 어두운 하부). 동측 돌출부(x 407.8~437.1, z -680~-632)는 1층 유리 로비 파빌리온,
//   지붕은 밝은 포장 테라스 + 본관 쪽 천창 띠(위성의 어두운 띠).
//   서측 입구: 위성의 파란 캔버스 차양(z -606~-578, 7 ft 돌출) + 서쪽으로 난 보도. 남측 입구: x 340~360 (보도 2개가 닿는 곳).
// ■ 지붕: 평지붕 + 2 ft 난간. 펜트하우스 2동(x 335~357 z -602~-574 h 10 / x 340~349 z -690~-662 h 7), 소형 설비,
//   신축줄눈 2줄(z -699, -577 — 위성의 밝은 선), 루프 해치 9개, 남측 슬롯 뒤 경사 천창(위성의 줄무늬 어두운 사각형).
// ■ 사진에 안 보여 가정한 것: 서·남·북면 1층 처리(무창 패널 + 입구만), 슬롯 유리 멀리언 간격(4.5 ft), 지하층 채광 없음.
//   위성 지붕은 건물 기울기 때문에 북쪽으로 ≈ 6 ft 밀려 있어 모든 위치는 6 ft 남쪽으로 보정해 OSM 외곽선에 맞춤.
import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

export const meta = {
  id: 'library', name: 'Cunningham Memorial Library', osm: 'way/349907334', extraIds: ['way/1464442480'],
  anchor: [0, 0], rotation: 0, height: 64,
  preset: { pos: [720, 175, -540], tgt: [335, 15, -630] },
  sheets: 'Street View vp14 (2019), Esri imagery z20/z19',
};

const X0 = 248, X1 = 407.8, ZN = -743.6, ZS = -516.9;
const FL = [0, 15, 27.5, 40], ROOF = 52.5, PAR = 54.5;
const SW = 18, SD = 8;                                  // 슬롯 폭 / 깊이
const SLOT_EW = [-711, -645, -555], SLOT_NS = [273, 381];
const PAV = { x0: X1, x1: 437.1, z0: -680.5, z1: -632.5, h: 16 };
const ARC = { x0: 439.0, x1: 451.7, z0: -766.3, z1: -523.9, h: 15 };

export function build(M, G) {
  const parts = [];
  const P = (geom, mat, cast) => { if (geom) parts.push({ geom, mat, cast }); };
  const panel = M.precast.clone(); panel.color = new THREE.Color(0.96, 0.92, 0.84);       // 밝은 베이지 프리캐스트
  const blue = new THREE.MeshStandardMaterial({ color: 0x1f4f9a, roughness: 0.8 });
  const frame = M.dark, glassM = M.pane;

  const dir = (p0, p1) => { const dx = p1[0] - p0[0], dz = p1[1] - p0[1], L = Math.hypot(dx, dz); return { ex: [dx / L, dz / L], ez: [-dz / L, dx / L], L, ry: -Math.atan2(dz, dx) }; };
  const at = (p0, d, s, off) => [p0[0] + d.ex[0] * s - d.ez[0] * off, p0[1] + d.ex[1] * s - d.ez[1] * off];   // off>0 = 안쪽
  /** 벽을 따라 놓는 박스: s0..s1, y0..y1, 바깥 out / 안쪽 inn 두께 */
  const slab = (p0, p1, s0, s1, y0, y1, out, inn, mat, cast) => { const d = dir(p0, p1); const c = at(p0, d, (s0 + s1) / 2, (inn - out) / 2); P(G.box(s1 - s0, y1 - y0, out + inn, c[0], y0, c[1], { ry: d.ry }), mat, cast); };
  /** 유리 + 프레임 (welcome_center.js 와 같은 방식) + 개구부 측면 리빌 */
  function glazing(p0, p1, s, e, b, t, { inset = 0.5, rails = [], muls = [], reveal = true } = {}) {
    const d = dir(p0, p1);
    P(G.sideGeometry([at(p0, d, s, inset), at(p0, d, e, inset)], b, t, 1 / Math.max(1, e - s), 1 / Math.max(1, t - b), false), glassM, false);
    const fr = [];
    for (const sm of [s, ...muls, e]) { const c = at(p0, d, sm, inset - 0.1); fr.push(G.box(0.18, t - b, 0.3, c[0], b, c[1], { ry: d.ry })); }
    for (const y of [b, ...rails, t]) { const c = at(p0, d, (s + e) / 2, inset - 0.1); fr.push(G.box(e - s, 0.18, 0.3, c[0], y - 0.09, c[1], { ry: d.ry })); }
    P(BufferGeometryUtils.mergeGeometries(fr), frame);
    if (reveal && inset > 0.3) {
      const r = [];
      for (const sm of [s, e]) { const c = at(p0, d, sm, inset / 2); r.push(G.box(0.12, t - b, inset, c[0], b, c[1], { ry: d.ry })); }
      const c = at(p0, d, (s + e) / 2, inset / 2); r.push(G.box(e - s, 0.12, inset, c[0], t - 0.06, c[1], { ry: d.ry }));
      P(BufferGeometryUtils.mergeGeometries(r), panel);
    }
  }
  const range = (a, b, step) => { const o = []; for (let v = a + step; v < b - 0.5; v += step) o.push(v); return o; };

  // ------------------------------------------------------------ 외곽선 (슬롯 노치 포함, CCW: NW → SW → SE → NE)
  const pts = [], types = [];
  const add = (p, t) => { pts.push(p); types.push(t); };   // types[i] = pts[i] → pts[i+1] 변의 종류
  add([X0, ZN], 'face');
  for (const c of SLOT_EW) { add([X0, c - SW / 2], 'ret'); add([X0 + SD, c - SW / 2], 'glass'); add([X0 + SD, c + SW / 2], 'ret'); add([X0, c + SW / 2], 'face'); }
  add([X0, ZS], 'face');
  for (const c of SLOT_NS) { add([c - SW / 2, ZS], 'ret'); add([c - SW / 2, ZS - SD], 'glass'); add([c + SW / 2, ZS - SD], 'ret'); add([c + SW / 2, ZS], 'face'); }
  add([X1, ZS], 'face');
  for (const c of [...SLOT_EW].reverse()) { add([X1, c + SW / 2], 'ret'); add([X1 - SD, c + SW / 2], 'glass'); add([X1 - SD, c - SW / 2], 'ret'); add([X1, c - SW / 2], 'face'); }
  add([X1, ZN], 'face');
  for (const c of [...SLOT_NS].reverse()) { add([c + SW / 2, ZN], 'ret'); add([c + SW / 2, ZN + SD], 'glass'); add([c - SW / 2, ZN + SD], 'ret'); add([c - SW / 2, ZN], 'face'); }

  for (let i = 0; i < pts.length; i++) {
    const p0 = pts[i], p1 = pts[(i + 1) % pts.length], t = types[i], d = dir(p0, p1), L = d.L;
    if (t === 'glass') {
      // 슬롯 커튼월: 전 층 유리, 층마다 스팬드럴
      glazing(p0, p1, 0, L, 0, ROOF, { inset: 0.4, muls: range(0, L, 4.5), rails: [7.5, 21, 33.5, 46], reveal: false });
      for (const f of FL.slice(1).concat([ROOF])) slab(p0, p1, 0.1, L - 0.1, f - 1.6, f - 0.1, -0.2, 0.5, frame);
      continue;
    }
    if (t === 'ret') { P(G.wallSeg(p0, p1, -1, ROOF, {}), panel); continue; }
    // ---- 패널 벽면: 어느 면인지 판정
    const east = Math.abs(p0[0] - X1) < 0.1 && Math.abs(p1[0] - X1) < 0.1;
    const west = Math.abs(p0[0] - X0) < 0.1 && Math.abs(p1[0] - X0) < 0.1;
    const south = Math.abs(p0[1] - ZS) < 0.1 && Math.abs(p1[1] - ZS) < 0.1;
    const north = Math.abs(p0[1] - ZN) < 0.1 && Math.abs(p1[1] - ZN) < 0.1;
    const ops = [];
    if (east) {
      // 1층 후퇴 유리벽 (열주 캐노피 뒤). 동측 파빌리온 구간은 파빌리온이 덮으므로 제외
      let s0 = 2, s1 = L - 2;
      const sA = p0[1] - PAV.z1, sB = p0[1] - PAV.z0;                       // 파빌리온이 덮는 s 구간
      if (sA < s1 && sB > s0) { if (sA > L / 2) s1 = Math.min(s1, sA - 1); else s0 = Math.max(s0, sB + 1); }
      if (s1 - s0 > 4) {
        ops.push({ s: s0, e: s1, b: 0.3, t: 12 });
        glazing(p0, p1, s0, s1, 0.3, 12, { inset: 3, muls: range(s0, s1, 5), rails: [8.5] });
        for (let s = s0 + 10; s < s1 - 3; s += 20) slab(p0, p1, s - 0.9, s + 0.9, 0, 12, 0, 1.8, panel);   // 1층 기둥
      }
    }
    if (west && p0[1] < -636 && p1[1] > -564) {
      // 서측 입구 (z -606..-578): 유리 출입구 + 파란 차양
      const s0 = -606 - p0[1], s1 = -578 - p0[1];
      ops.push({ s: s0, e: s1, b: 0, t: 10 });
      glazing(p0, p1, s0, s1, 0, 10, { inset: 1.5, muls: range(s0, s1, 4), rails: [7.5] });
      slab(p0, p1, s0 - 0.5, s1 + 0.5, 10.2, 11.4, 7, 0, blue);
      for (const s of [s0 + 0.3, s1 - 0.3]) slab(p0, p1, s - 0.15, s + 0.15, 0, 10.2, 6.8, -6.5, M.dark);   // 차양 기둥
    }
    if (south && p0[0] > 280 && p1[0] < 375) {
      const s0 = 340 - p0[0], s1 = 360 - p0[0];
      ops.push({ s: s0, e: s1, b: 0, t: 10.5 });
      glazing(p0, p1, s0, s1, 0, 10.5, { inset: 1.5, muls: range(s0, s1, 4), rails: [8] });
      slab(p0, p1, s0 - 2, s1 + 2, 10.8, 12.3, 6, 0, panel);
    }
    if (north && p0[0] < 375 && p1[0] > 280) {
      const s0 = p0[0] - 330, s1 = p0[0] - 320;                        // 북면은 서향 진행
      ops.push({ s: s0, e: s1, b: 0, t: 9 });
      slab(p0, p1, s0, s1, 0, 9, -0.6, 0.8, M.dark);
    }
    P(G.wallSeg(p0, p1, -1, ROOF, { openings: ops }), panel);
    // 층 경계 줄눈 띠 + 기단
    for (const f of FL.slice(1)) slab(p0, p1, 0, L, f - 0.3, f + 0.3, 0.15, 0, panel);
    slab(p0, p1, 0, L, -0.5, 1.2, 0.2, 0, M.concrete);
  }
  // ------------------------------------------------------------ 지붕
  const r = G.flatRoof(pts, ROOF, { parapet: PAR - ROOF, thick: 0.75 });
  P(r.slab, M.roof_gravel); P(r.parapet, panel);
  // 난간 갓돌(밝은 띠): 외곽선을 따라 얇은 상판
  for (let i = 0; i < pts.length; i++) {
    const p0 = pts[i], p1 = pts[(i + 1) % pts.length], d = dir(p0, p1);
    slab(p0, p1, 0, d.L, PAR, PAR + 0.25, 0.25, 1.1, M.trim);
  }
  // 펜트하우스·설비 (위성, 6 ft 남쪽 보정)
  const boxXZ = (x0, x1, z0, z1, y0, h, mat) => P(G.box(x1 - x0, h, z1 - z0, (x0 + x1) / 2, y0, (z0 + z1) / 2), mat);
  boxXZ(335, 357, -602, -574, ROOF, 10, panel); boxXZ(334.5, 357.5, -602.5, -573.5, ROOF + 10, 0.6, M.trim);
  boxXZ(340, 349, -690, -662, ROOF, 7, panel); boxXZ(339.6, 349.4, -690.4, -661.6, ROOF + 7, 0.5, M.trim);
  P(G.cylinder(2.3, 4, 352, ROOF, -669, 14), M.metal);
  boxXZ(315, 321, -611, -603, ROOF, 4.5, M.metal);
  boxXZ(358, 364, -600, -594, ROOF, 3.5, M.metal);
  for (const x of [270, 323, 376]) for (const z of [-717, -653, -560]) boxXZ(x - 1.5, x + 1.5, z - 1.5, z + 1.5, ROOF, 1.4, M.metal);
  boxXZ(259, 263, -684, -680, ROOF, 1.8, M.metal);                                   // 루프 해치
  for (const z of [-699, -577]) boxXZ(X0 + 1, X1 - 1, z - 0.7, z + 0.7, ROOF, 0.7, M.trim);   // 신축줄눈 커버
  // 남측 슬롯 뒤 경사 천창 (지붕 위 린투 유리)
  for (const c of SLOT_NS) {
    const z0 = ZS - SD - 8, z1 = ZS - SD, x0 = c - SW / 2 + 0.5, x1 = c + SW / 2 - 0.5;
    const g = new THREE.BufferGeometry();
    const v = [[x0, ROOF + 4, z0], [x1, ROOF + 4, z0], [x1, ROOF, z1], [x0, ROOF, z1]];
    g.setAttribute('position', new THREE.Float32BufferAttribute([...v[0], ...v[3], ...v[2], ...v[0], ...v[2], ...v[1]], 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0], 2)); g.computeVertexNormals();
    P(g, glassM, false);
    for (const x of [x0, x1]) { const t = new THREE.BufferGeometry(); const tv = [[x, ROOF, z0], [x, ROOF + 4, z0], [x, ROOF, z1]];
      t.setAttribute('position', new THREE.Float32BufferAttribute(x === x0 ? [...tv[0], ...tv[2], ...tv[1]] : [...tv[0], ...tv[1], ...tv[2]], 3)); t.computeVertexNormals(); P(t, frame); }
    boxXZ(x0, x1, z0 - 0.3, z0, ROOF, 4, frame);
  }

  // ------------------------------------------------------------ 동측 유리 로비 파빌리온 (1층, 높이 16)
  {
    const { x0, x1, z0, z1, h } = PAV;
    const walls = [[[x0, z1], [x1, z1]], [[x1, z1], [x1, z0]], [[x1, z0], [x0, z0]]];   // 남·동·북 (CCW 진행)
    for (const [p0, p1] of walls) {
      const L = dir(p0, p1).L;
      glazing(p0, p1, 0.8, L - 0.8, 0, h - 3, { inset: 0.6, muls: range(0.8, L - 0.8, 5), rails: [8.5], reveal: false });
      slab(p0, p1, 0, L, h - 3, h, 0.3, 0.6, panel);                          // 프리캐스트 파시아
      for (const s of [0.4, L - 0.4]) slab(p0, p1, s - 0.4, s + 0.4, 0, h - 3, 0.2, 0.6, panel);
    }
    // 동쪽 정면 출입문 (2쌍)
    const pe0 = [x1, z1], pe1 = [x1, z0];
    for (const s of [14, 26]) slab(pe0, pe1, s, s + 6, 0, 8, -0.1, 0.4, frame);
    // 지붕: 밝은 포장 테라스 + 본관 쪽 천창 띠 + 낮은 난간
    const roofPoly = [[x0, z0], [x0, z1], [x1, z1], [x1, z0]];
    const rr = G.flatRoof(roofPoly, h, { parapet: 1.2, thick: 0.8 });
    P(rr.slab, M.walk); P(rr.parapet, panel);
    boxXZ(x0 + 0.5, x0 + 11, z0 + 2, z1 - 2, h, 1.8, glassM);
    boxXZ(x0 + 0.3, x0 + 11.2, z0 + 1.8, z1 - 1.8, h + 1.8, 0.2, frame);
    for (const [zx] of [[z0 + 8], [z1 - 8]]) boxXZ(x1 - 9, x1 - 4, zx - 2.5, zx + 2.5, h, 2, panel);   // 테라스 화분
  }

  // ------------------------------------------------------------ 동측 열주 캐노피 (way/1464442480)
  {
    const { x0, x1, z0, z1, h } = ARC;
    boxXZ(x0 - 0.3, x1 + 0.3, z0 - 0.3, z1 + 0.3, h - 1.8, 1.8, panel);          // 처마 슬래브
    boxXZ(x0, x1, z0, z1, h, 0.15, M.roof_membrane);
    const n = 12, pitch = (z1 - z0 - 4) / (n - 1);
    for (let k = 0; k < n; k++) { const z = z0 + 2 + k * pitch; for (const x of [x0 + 0.9, x1 - 0.9]) P(G.box(1.6, h - 1.8, 1.6, x, 0, z), panel); }
  }

  const grp = new THREE.Group();
  for (const m of G.mergeByMaterial(parts)) grp.add(m);
  return grp;
}
