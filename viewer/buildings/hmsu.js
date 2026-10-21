// Hulman Memorial Student Union 단지 (way/544820727) + Dede Activity Center (way/1348635036) + HMSU 서측 타워 (way/1464442481)
// 근거: Street View vp20 (N 5th St, (-376,-205) 부근에서 049/094/139 방향 — HMSU 입구 파빌리온·타워 3동·저층부),
//       vp80 = vp21 (5th St & Chestnut, (-373,173) 에서 005/050/095 — Dede 서면·남서 모서리), vp42 (Spruce St, 원경으로 북측 타워 2동),
//       Esri z20(겨울, 0.38 ft/px)·z19(여름) 위성 — 지붕 형태, 기복변위(높은 동은 지붕이 북서로 밀려 보임)와 그림자로 높이 판단.
// ※ scratch/sv/461428306 (Science) 의 vp20 사진은 실제로 HMSU 를, vp21 사진은 Dede 를 찍은 것이다.
// ※ 브리프의 "탄색 벽돌 타워"와 달리 사진의 HMSU 타워는 적갈색 벽돌 + 백색 프리캐스트 수직 핀이다 (사진 우선).
//
// ■ OSM 외곽선 way/544820727 의 볼륨 분할 (회전 프레임 u = 29.6° (동남동), v = 119.6° (남남서), 원점 = OSM 점 30 (-340.24,-430.66))
//   [TW] 북서 타워 u 0..72.4, v -92..0 — 10층 (1층 14 ft + 9 × 9.6 ft = 100.4, 코핑 103.2). vp20_049: 남남서면 왼쪽 21 ft 는 무창 적갈색 벽돌,
//        나머지는 탄색 프리캐스트 격자 (베이 ≈10.3 ft, 창 2연 / 무창 패널 / 창 2연 반복, 층마다 깊은 스팬드럴 밴드). 지붕: 백색 절판(지그재그)
//        스크린 + 기계실 + 레이돔(흰 구) + 안테나 2개. 1층은 유리 + 백색 밴드. 동측 코어(u 72..87) · 북동 계단 돌출부는 벽돌.
//        (위치·형태상 Statesman Towers 서동으로 보이지만 OSM 상 HMSU 외곽선에 포함되어 함께 모델링)
//   [TE] 북동 타워 u 151..240, v -147..-64 — TW 와 동일 설계 (vp20_049 중앙 원경, vp42_180 원경). 지붕 스크린, 동측 계단 돌출부.
//   [HX] 육각 홀: 중심 (-261.5,-328), 외접반경 62 ft (OSM 점 32–35 와 일치). 벽돌 드럼 21 ft + 고창 띠 + 백색 깊은 처마(4.5 ft) 파시아 21–25,
//        육각뿔 지붕(위성: 꼭짓점→중심 리브) + 중앙 육각 랜턴(r 13). vp20_049 중앙 저층 건물.
//   [ST] 남동 타워 u 255..309, v -41..121 (54 × 162 ft) — vp20_049 우측·vp20_094 파빌리온 뒤: 1층 유리(3 ft 후퇴, 백색 소핏 15 ft) +
//        8개 층 (9.6 ft) 적갈색 벽돌 + 백색 수직 핀, 창 기둥/벽돌 패널 교대, 양쪽에 넓은 백색 피어와 검은 유리 계단 슬롯, 상부 백색 코니스 띠
//        (91.8–94.8) + 3 ft 후퇴한 다락층(백색 포스트) + 청색 금속 모임지붕 (위성 보라/청색, 용마루 ≈111).
//   [PD] 저층 연결부 (나머지 외곽선): 22 ft, 벽돌 + 고창 + 백색 파시아. 남측 홀 (x -232..-172, z -276..-206) 은 위성의 어두운 모임지붕.
// ■ way/1464442481 (무명, x -345..-183, z -200..-139 = 162 × 61 ft) = [WT] 서측 타워: 위성에서 ST 와 같은 청색 모임지붕 + 백색 핀 남면이
//   기복변위로 보이고 여름 영상에서 북쪽 광장에 긴 그림자 → 고층. vp20_094/139 오른쪽 근경 타워 (1층 유리 위 캔틸레버 소핏). 1 + 7 층 + 다락 (가정: 위성
//   변위가 ST 의 약 0.8 배). 북측 돌출 계단실 (x -300..-284.5).
//   입구 파빌리온 (x -321..-275, z -232..-202, 외곽선 밖 광장; 5th St 동측 보도 x -351..-344 바로 뒤): 석회석 피어·프리즈 "DEDE ACTIVITY CENTER" + 박공 페디먼트 "HULMAN MEMORIAL
//   STUDENT UNION", 서쪽으로 2단 계단(중간 참) + 벽돌 측벽/중앙 분리벽 + 금속 난간, 보도변 벽돌 화단(석회석 갓돌). 뒤편 1층 로비 (x -275..-234,
//   z -272..-206, 위성의 어두운 평지붕) 서면은 검은 유리 + 백색 파시아.
// ■ Dede Activity Center (way/1348635036, 1990): 22 ft. vp80_005/050: 하부 3.5 ft 콘크리트 기단, 적갈색 벽돌, 15.5–18 ft 에 3.5 ft 돌출 백색 처마
//   파시아, 그 위 벽돌 파라펫(22 ft). 서면(5th St)은 1층이 6 ft 들어간 로지아 (17 ft 간격 벽돌 피어, 검은 유리), 남단 30 ft 는 무창 벽돌 + 모서리 피어.
//   남동 곡면(분수 광장을 향한 반경 161 ft 오목 호, 중심 (-95,175)) = 유리 커튼월 15.5 ft + 위성의 8 ft 폭 백색 띠 지붕, 그 안쪽 본체 벽은 22 ft.
//   로툰다 (중심 (-205.5,52.5), r 25): 유리 하부 + 벽돌 + 지붕 위로 솟은 고창 드럼(30.5), [항공사진 수정] 드럼 안은 열린 고리(낮은 원형 지붕 +
//   원형 천창). [항공사진 수정] 지붕 중앙 = 유리 고창 + 청색 금속지붕 옥상 박스 50 × 32 ft, 지붕 = 짙은 회갈색 자갈 (isu/r, fountain/f;
//   비교 scratch/aerial/hmsu.png). (이전: 청색 피라미드 천창 50 × 51 ft
//   (-208,-62), 설비 다수. 동·북면은 사진 없음 → 서면과 같은 로지아/벽돌로 가정.
// 가정·미확인: 북측 두 타워의 북·동면 패턴(사진 원경만), WT 층수, 저층 연결부 창 배치, Dede 동·북면, 파빌리온 뒤 로비의 범위.
import * as THREE from 'three';

export const meta = {
  id: 'hmsu', name: 'Hulman Memorial Student Union / Dede Activity Center', osm: 'way/544820727',
  extraIds: ['way/1348635036', 'way/1464442481'],
  anchor: [0, 0], rotation: 0, height: 125,
  preset: { pos: [-640, 200, -40], tgt: [-215, 30, -230] },
  sheets: 'Street View vp20, vp80/vp21, vp42; Esri imagery z20/z19',
};

// ---- 회전 프레임 (HMSU 타워 군)
const TH = 29.6 * Math.PI / 180, CT = Math.cos(TH), SN = Math.sin(TH);
const O = [-340.24, -430.66];
const W = (u, v) => [O[0] + u * CT - v * SN, O[1] + u * SN + v * CT];
const area = p => { let a = 0; for (let i = 0; i < p.length; i++) { const q = p[i], r = p[(i + 1) % p.length]; a += r[0] * q[1] - q[0] * r[1]; } return a / 2; };
const ccw = p => (area(p) > 0 ? p : [...p].reverse());
const rectUV = (u0, u1, v0, v1) => ccw([W(u0, v0), W(u1, v0), W(u1, v1), W(u0, v1)]);
const rectXZ = (x0, x1, z0, z1) => ccw([[x0, z0], [x1, z0], [x1, z1], [x0, z1]]);

// OSM 외곽선 (site.json 과 동일, CCW)
const HM = [[-232.79, -200.12], [-183.37, -200.81], [-177.59, -200.05], [-133.5, -173.75], [-94.59, -238.05], [-50.13, -311.6], [-97.32, -339.74], [-127.49, -289.84], [-201.02, -333.69], [-203.78, -340.14], [-189.09, -345.95], [-163.13, -391.35], [-105.95, -359.11], [-98.87, -371.51], [-86.13, -364.33], [-81.87, -371.8], [-94.0, -378.66], [-83.82, -396.43], [-58.98, -439.91], [-122.39, -475.67], [-136.2, -483.43], [-177.05, -412.02], [-204.03, -428.23], [-232.82, -445.57], [-218.67, -468.82], [-230.71, -475.6], [-223.63, -487.96], [-232.09, -492.75], [-239.64, -479.51], [-294.59, -510.49], [-340.24, -430.66], [-277.2, -395.12], [-292.0, -381.92], [-323.74, -330.1], [-295.01, -273.7], [-233.16, -273.99]];
const DD = [[-216.61, 75.8], [-210.8, 77.43], [-204.8, 77.68], [-198.88, 76.56], [-193.41, 74.09], [-188.64, 70.43], [-184.84, 65.79], [-182.24, 60.42], [-180.94, 54.58], [-181.03, 48.6], [-182.52, 42.83], [-183.99, 40.04], [-172.82, 33.26], [-151.57, 24.33], [-129.21, 18.68], [-106.23, 16.36], [-89.8, 15.41], [-90.39, -91.97], [-90.64, -141.26], [-182.61, -140.28], [-310.94, -138.9], [-310.72, -100.1], [-336.71, -99.95], [-335.36, 144.49], [-254.44, 144.01], [-251.43, 128.89], [-245.03, 110.58], [-236.34, 93.24], [-225.52, 77.1], [-221.82, 72.93]];

export function build(M, G) {
  const parts = [];
  const P = (geom, mat, cast) => { if (geom) parts.push({ geom, mat, cast }); };
  const cached = (k, f) => { if (!M._cache.has(k)) M._cache.set(k, f()); return M._cache.get(k); };
  const blue = cached('hmsu_blue', () => new THREE.MeshStandardMaterial({ color: 0x3d5a8e, roughness: 0.55, metalness: 0.35 }));
  const skyGlass = cached('hmsu_skyglass', () => new THREE.MeshStandardMaterial({ color: 0x7f9ec6, roughness: 0.2, metalness: 0.5 }));
  const darkGlass = cached('hmsu_darkglass', () => new THREE.MeshStandardMaterial({ color: 0x23272d, roughness: 0.15, metalness: 0.6 }));
  const tint = (k, base, col) => cached(k, () => { const m = base.clone(); m.color = new THREE.Color(col); return m; });
  const pc = tint('hmsu_pc_tan', M.precast, 0xe0cfae), pcBand = tint('hmsu_pc_band', M.precast, 0xb9a47f);   // 탄색 프리캐스트 (사진)
  const brickT = M.brick_brown, brickD = M.brick_red, wh = M.white, ls = M.limestone;

  // ---------------------------------------------------------------- 헬퍼
  const E = (p0, p1) => { const dx = p1[0] - p0[0], dz = p1[1] - p0[1], L = Math.hypot(dx, dz); return { ex: [dx / L, dz / L], n: [-dz / L, dx / L], L, ry: -Math.atan2(dz, dx) }; };
  const at = (p0, e, s, off) => [p0[0] + e.ex[0] * s + e.n[0] * off, p0[1] + e.ex[1] * s + e.n[1] * off];
  /** 벽선 p0→p1 의 s0..s1, y0..y1 에 박스. off = 벽면에서 바깥쪽 시작 오프셋(음수 = 안쪽), depth = 바깥 방향 두께 */
  function bx(p0, p1, s0, s1, y0, y1, off, depth, mat) {
    const e = E(p0, p1), c = at(p0, e, (s0 + s1) / 2, off + depth / 2);
    P(G.box(s1 - s0, y1 - y0, depth, c[0], y0, c[1], { ry: e.ry }), mat);
  }
  function pane(p0, p1, s0, s1, y0, y1, inset, mat = M.pane) {
    const e = E(p0, p1);
    P(G.sideGeometry([at(p0, e, s0, -inset), at(p0, e, s1, -inset)], y0, y1, 1 / Math.max(1, s1 - s0), 1 / Math.max(1, y1 - y0), false), mat, false);
  }
  const wall = (p0, p1, y0, y1, ops, mat) => P(G.wallSeg(p0, p1, y0, y1, { openings: ops || [] }), mat);
  const edges = poly => poly.map((p, i) => [p, poly[(i + 1) % poly.length]]);
  function capDown(poly, y, mat) {
    const sh = new THREE.Shape(poly.map(p => new THREE.Vector2(p[0], p[1])));
    const g = new THREE.ShapeGeometry(sh); g.rotateX(Math.PI / 2); g.translate(0, y, 0);
    const uv = g.attributes.uv, pos = g.attributes.position;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, pos.getX(i) / 24, pos.getZ(i) / 24);
    P(g, mat, false);
  }
  /** 삼각형 목록 → 윗면 법선(+y)이 되도록 정렬한 지오메트리 */
  function tris(list, mat, cast) {
    const pos = [];
    for (const [a, b, c] of list) {
      const ux = b[0] - a[0], uz = b[2] - a[2], vx = c[0] - a[0], vz = c[2] - a[2];
      if (uz * vx - ux * vz < 0) pos.push(...a, ...c, ...b); else pos.push(...a, ...b, ...c);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    const uv = []; for (let i = 0; i < pos.length / 3; i++) uv.push(pos[i * 3] / 12, pos[i * 3 + 2] / 12);
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    g.computeVertexNormals();
    P(g, mat, cast);
  }
  /** 사각형 모임지붕: r = 네 모서리(순서대로), 처마 yE, 상승 rise */
  function hip(r, yE, rise, mat) {
    const c = [(r[0][0] + r[2][0]) / 2, (r[0][1] + r[2][1]) / 2];
    const a = Math.hypot(r[1][0] - r[0][0], r[1][1] - r[0][1]), b = Math.hypot(r[2][0] - r[1][0], r[2][1] - r[1][1]);
    const [p, q, L, S] = a >= b ? [r[0], r[1], a, b] : [r[1], r[2], b, a];
    const d = [(q[0] - p[0]) / L, (q[1] - p[1]) / L], k = Math.max(0, L / 2 - S / 2), yR = yE + rise;
    const R1 = [c[0] + d[0] * k, yR, c[1] + d[1] * k], R2 = [c[0] - d[0] * k, yR, c[1] - d[1] * k];
    const near = pt => (Math.hypot(pt[0] - R1[0], pt[1] - R1[2]) < Math.hypot(pt[0] - R2[0], pt[1] - R2[2]) ? R1 : R2);
    const T = [];
    for (let i = 0; i < 4; i++) {
      const A = r[i], B = r[(i + 1) % 4], ra = near(A), rb = near(B), a3 = [A[0], yE, A[1]], b3 = [B[0], yE, B[1]];
      if (ra === rb) T.push([a3, b3, ra]); else { T.push([a3, b3, rb]); T.push([a3, rb, ra]); }
    }
    tris(T, mat);
  }
  /** 다각형 뿔 지붕: outer 다각형 (yE) → inner 다각형 (yT) (같은 꼭짓점 수) */
  function frustum(outer, yE, inner, yT, mat) {
    const T = [];
    for (let i = 0; i < outer.length; i++) {
      const j = (i + 1) % outer.length;
      const a = [outer[i][0], yE, outer[i][1]], b = [outer[j][0], yE, outer[j][1]], c = [inner[j][0], yT, inner[j][1]], d = [inner[i][0], yT, inner[i][1]];
      T.push([a, b, c]); T.push([a, c, d]);
    }
    tris(T, mat);
  }
  const roofCap = (poly, y, mat = M.roof_gravel, holes = []) => P(G.capGeometry(poly, holes, y), mat);
  /** 파라펫 코핑: 다각형 둘레에 y0..y1, 벽면 안쪽 inIn ~ 바깥 out 범위 박스 */
  function coping(poly, y0, y1, mat, out = 0.4, inIn = 1.0) { for (const [a, b] of edges(poly)) bx(a, b, 0, E(a, b).L, y0, y1, -inIn, inIn + out, mat); }

  // ================================================================ [TW][TE] 프리캐스트 격자 타워 (10층)
  const S_H1 = 14, S_FH = 9.6, S_NF = 9, S_TOP = S_H1 + S_FH * S_NF;   // 100.4
  function gridTower(poly, { radome = null } = {}) {
    for (const [p0, p1] of edges(poly)) {
      const L = E(p0, p1).L;
      // 벽돌 구간: 72 ft 이하 면은 왼쪽(시작) 21 ft, 긴 면은 양끝 11 ft
      const segs = L < 80 ? [['b', 0, 21], ['g', 21, L]] : [['b', 0, 11], ['g', 11, L - 11], ['b', L - 11, L]];
      for (const [t, a, b] of segs) {
        if (t === 'b') continue;
        const Lg = b - a, nb = Math.max(1, Math.round(Lg / 10.4)), bw = Lg / nb, ops = [];
        for (let k = 0; k < S_NF; k++) {
          const fy = S_H1 + k * S_FH;
          for (let i = 0; i < nb; i++) {
            if (i % 3 === 1) continue;                                  // 무창 패널 베이
            const s = a + i * bw + 0.8, e = a + (i + 1) * bw - 0.8;
            ops.push({ s, e, b: fy + 3.4, t: fy + 8.4 });
            bx(p0, p1, (s + e) / 2 - 0.18, (s + e) / 2 + 0.18, fy + 3.4, fy + 8.4, -0.5, 0.45, pc);   // 2연 창 중간 멀리언
          }
          // 깊은 스팬드럴 밴드 (창 머리 ~ 다음 층 창대)
        }
        for (let k = -1; k < S_NF; k++) {
          const fy = S_H1 + k * S_FH, y0 = Math.max(S_H1, fy + 8.4), y1 = Math.min(S_TOP, fy + 13.0);
          if (y1 > y0 + 0.2) bx(p0, p1, a, b, y0, y1, 0, 0.6, pcBand);
        }
        for (let i = 0; i <= nb; i++) { const s = a + i * bw; bx(p0, p1, s - 0.35, s + 0.35, S_H1, S_TOP, 0, 0.95, pc); }   // 수직 핀
        // 격자 벽면 (14..TOP) + 유리
        // wallSeg 는 p0 기준 전체 길이에서 개구를 뚫으므로, 격자 구간만 별도 선분으로 만든다
        const e = E(p0, p1), q0 = at(p0, e, a, 0), q1 = at(p0, e, b, 0);
        wall(q0, q1, S_H1, S_TOP, ops.map(o => ({ s: o.s - a, e: o.e - a, b: o.b, t: o.t })), pc);
        for (const o of ops) pane(q0, q1, o.s - a, o.e - a, o.b, o.t, 0.5);
        // 1층: 유리 + 백색 밴드 + 기둥
        pane(q0, q1, 0, b - a, 0, 11.5, 1.5);
        bx(p0, p1, a, b, 11.5, S_H1, -1.6, 2.6, wh);
        for (let i = 0; i <= nb; i += 1) { const s = Math.min(b - 0.8, Math.max(a + 0.8, a + i * bw)); bx(p0, p1, s - 0.8, s + 0.8, 0, 11.5, -1.6, 1.6, pc); }
      }
    }
    // 벽돌 구간 (전체 높이 무창)
    for (const [p0, p1] of edges(poly)) {
      const L = E(p0, p1).L, e = E(p0, p1);
      const bs = L < 80 ? [[0, 21]] : [[0, 11], [L - 11, L]];
      for (const [a, b] of bs) wall(at(p0, e, a, 0), at(p0, e, b, 0), 0, S_TOP, [], brickT);
    }
    // 코핑 + 지붕
    coping(poly, S_TOP, S_TOP + 2.8, pc, 0.6, 1.0);
    roofCap(poly, S_TOP + 0.6, M.roof_gravel);
    // 지붕 기계실 + 백색 절판 스크린 (오프셋 7 ft 링)
    const ring = G.offsetPoly(poly, 7), pent = G.offsetPoly(poly, 15);
    { const ex = G.extrudePoly(pent, [], 9, { y0: S_TOP + 0.6 }); P(ex.sides, M.concrete); P(ex.top, M.roof_membrane); }
    for (const [a, b] of edges(ring)) {
      const e = E(a, b), n = Math.max(2, Math.round(e.L / 3.2));
      for (let i = 0; i < n; i++) {
        const c = at(a, e, (i + 0.5) * e.L / n, 0);
        P(G.box(e.L / n * 1.08, 6.5, 0.3, c[0], S_TOP + 3.2, c[1], { ry: e.ry + (i % 2 ? 0.42 : -0.42) }), wh);
      }
    }
    if (radome) {
      const [rx, rz] = radome;
      P(G.cylinder(2.2, 9, rx, S_TOP + 0.6, rz, 10), M.metal);
      const sph = new THREE.SphereGeometry(7.5, 18, 12); sph.translate(rx, S_TOP + 16, rz); P(sph, wh);
      for (const [dx, dz, h] of [[22, -18, 26], [30, 6, 20]]) P(G.cylinder(0.35, h, rx + dx, S_TOP + 0.6, rz + dz, 6), M.metal);
    }
  }
  const TW = rectUV(0, 72.4, -92, 0), TE = rectUV(151.2, 240, -147, -64.4);
  gridTower(TW, { radome: W(20, -58) });
  gridTower(TE);
  // 코어·계단 돌출부 (벽돌, 지붕 위 5 ft)
  for (const r of [rectUV(72.4, 86.9, -93.2, -66), rectUV(63.4, 73.1, -107.4, -92), rectUV(240, 253.7, -76.4, -67.8)]) {
    const ex = G.extrudePoly(r, [], S_TOP + 6, {}); P(ex.sides, brickT); P(ex.top, M.roof_membrane);
    coping(r, S_TOP + 6, S_TOP + 6.6, pc, 0.3, 0.6);
  }

  // ================================================================ [ST][WT] 적갈색 벽돌 + 백색 핀 타워 (청색 모임지붕)
  // 긴 면 모듈 (합 162 ft): b = 벽돌 패널, w = 창 기둥, P = 넓은 백색 피어, s = 검은 유리 계단 슬롯
  const LONG = [['b', 7], ['w', 6], ['P', 6], ['w', 6], ['s', 4], ...Array.from({ length: 7 }, () => [['w', 6], ['b', 8]]).flat(), ['w', 6], ['s', 4], ['w', 6], ['P', 6], ['w', 6], ['b', 7]];
  const SHORT = [['b', 6], ['w', 6], ['b', 7], ['w', 6], ['b', 6], ['w', 6], ['b', 7], ['w', 6], ['b', 6]];
  function finTower(poly, nF) {
    const H1 = 15, FH = 9.6, TOPW = H1 + FH * nF, CORN = TOPW + 3, ATT = CORN + 8.5;
    for (const [p0, p1] of edges(poly)) {
      const e = E(p0, p1), L = e.L, seq = L > 100 ? LONG : SHORT, sum = seq.reduce((t, m) => t + m[1], 0), k = L / sum;
      const ops = []; let s = 0, prev = null;
      for (const [t, w0] of seq) {
        const w = w0 * k, a = s, b = s + w;
        if (t === 'w') for (let f = 0; f < nF; f++) {
          const fy = H1 + f * FH, o = { s: a + 0.75, e: b - 0.75, b: fy + 2.8, t: fy + 7.3 };
          ops.push(o); pane(p0, p1, o.s, o.e, o.b, o.t, 0.45);
          bx(p0, p1, (a + b) / 2 - 0.15, (a + b) / 2 + 0.15, o.b, o.t, -0.45, 0.4, wh);
          bx(p0, p1, o.s - 0.1, o.e + 0.1, o.b - 0.35, o.b, 0, 0.35, ls);              // 창대
        }
        if (t === 's') {
          ops.push({ s: a + 0.4, e: b - 0.4, b: H1 + 0.6, t: TOPW - 0.6 });
          pane(p0, p1, a + 0.4, b - 0.4, H1 + 0.6, TOPW - 0.6, 0.6, darkGlass);
          for (let f = 1; f < nF; f++) bx(p0, p1, a + 0.4, b - 0.4, H1 + f * FH - 0.2, H1 + f * FH + 0.2, -0.6, 0.5, wh);
        }
        if (t === 'P') bx(p0, p1, a, b, H1, TOPW, 0, 0.7, wh);
        if (prev && prev !== t && t !== 'P' && prev !== 'P') bx(p0, p1, a - 0.45, a + 0.45, H1, TOPW, 0, 1.0, wh);   // 얇은 백색 핀
        prev = t; s = b;
      }
      // 모서리 핀
      bx(p0, p1, 0, 1.3, H1, TOPW, 0, 1.0, wh); bx(p0, p1, L - 1.3, L, H1, TOPW, 0, 1.0, wh);
      wall(p0, p1, H1, TOPW, ops, brickD);
      // 코니스 띠
      bx(p0, p1, -1.0, L + 1.0, TOPW, CORN, -1.0, 2.5, wh);
      // 1층: 3 ft 후퇴 유리 + 멀리언 + 기둥 + 소핏 파시아
      bx(p0, p1, -0.2, L + 0.2, H1 - 0.8, H1 + 0.3, -0.3, 1.0, wh);
      for (const c of [0.8, L - 0.8]) bx(p0, p1, c - 0.8, c + 0.8, 0, H1 - 0.8, -1.6, 1.6, wh);
      const nC = Math.round(L / 27); for (let i = 1; i < nC; i++) { const c = i * L / nC; bx(p0, p1, c - 0.8, c + 0.8, 0, H1 - 0.8, -1.6, 1.6, wh); }
    }
    const inner = G.offsetPoly(poly, 3);
    for (const [p0, p1] of edges(inner)) {
      const e = E(p0, p1); pane(p0, p1, 0, e.L, 0, H1 - 0.8, 0, M.pane);
      const n = Math.round(e.L / 6); for (let i = 1; i < n; i++) bx(p0, p1, i * e.L / n - 0.15, i * e.L / n + 0.15, 0, H1 - 0.8, -0.1, 0.35, M.dark);
      bx(p0, p1, 0, e.L, 9.5, 9.8, -0.1, 0.35, M.dark);
    }
    capDown(poly, H1 - 0.8, wh);
    // 다락층 (3 ft 후퇴) + 백색 포스트 + 청색 모임지붕
    const att = G.offsetPoly(poly, 3);
    for (const [p0, p1] of edges(att)) {
      const e = E(p0, p1); wall(p0, p1, CORN, ATT, [], brickD);
      const n = Math.max(2, Math.round(e.L / 9)); for (let i = 0; i <= n; i++) { const c = Math.min(e.L - 0.5, Math.max(0.5, i * e.L / n)); bx(p0, p1, c - 0.5, c + 0.5, CORN, ATT, 0, 0.5, wh); }
      for (let i = 0; i < n; i += 2) bx(p0, p1, i * e.L / n + 2, (i + 1) * e.L / n - 2, CORN + 2.5, CORN + 6.5, -0.2, 0.3, darkGlass);
    }
    roofCap(poly, CORN, wh, [att]);
    const ov = G.offsetPoly(att, -1.5);
    hip(ov, ATT, 7.5, blue);
    return { TOPW, ATT };
  }
  const STp = rectUV(255, 309, -41, 121);
  finTower(STp, 8);
  const WTp = rectXZ(-344.9, -182.9, -200.0, -138.9);
  finTower(WTp, 7);
  { // WT 북측 계단실 (x -300..-284.5, z -217..-200)
    const r = rectXZ(-300.06, -284.5, -216.8, -199.0), ex = G.extrudePoly(r, [], 15 + 9.6 * 7 + 6, {}); P(ex.sides, brickD); P(ex.top, M.roof_membrane);
    coping(r, 15 + 9.6 * 7 + 6, 15 + 9.6 * 7 + 6.6, wh, 0.3, 0.6);
  }

  // ================================================================ [HX] 육각 홀
  {
    const C = [-261.5, -328], R = 62, hx = r => ccw([0, 1, 2, 3, 4, 5].map(k => [C[0] + r * Math.cos(k * Math.PI / 3), C[1] + r * Math.sin(k * Math.PI / 3)]));
    const outer = hx(R);
    for (const [p0, p1] of edges(outer)) {
      const e = E(p0, p1), L = e.L, ops = [];
      const n = Math.floor((L - 8) / 5);
      for (let i = 0; i < n; i++) { const s = 4 + i * (L - 8) / n + 0.9; ops.push({ s, e: s + (L - 8) / n - 1.8, b: 17.6, t: 20.3 }); }
      for (const s of [L * 0.3 - 4, L * 0.7 - 4]) ops.push({ s, e: s + 8, b: 2.5, t: 10 });
      wall(p0, p1, 0, 21, ops, brickT);
      for (const o of ops) pane(p0, p1, o.s, o.e, o.b, o.t, 0.5, o.b < 5 ? darkGlass : M.pane);
      bx(p0, p1, -1.0, L + 1.0, 21, 24.5, -0.5, 5.0, wh);                       // 깊은 백색 처마 파시아
      bx(p0, p1, 0, 2.6, 0, 21, -1.0, 1.6, wh);                                   // 꼭짓점 백색 기둥
    }
    const eave = hx(R + 4.4), lan = hx(13);
    frustum(eave, 24.5, lan, 33.5, M.roof_membrane);
    for (const [p0, p1] of edges(lan)) { const e = E(p0, p1); pane(p0, p1, 0, e.L, 33.5, 37.5, 0); bx(p0, p1, -0.3, e.L + 0.3, 37.5, 38.6, -0.5, 1.2, wh); }
    roofCap(lan, 38.6, M.roof_membrane);
    // 리브 (꼭짓점 → 랜턴)
    for (let k = 0; k < 6; k++) {
      const a = eave[k], b = lan[k], dx = b[0] - a[0], dz = b[1] - a[1], L = Math.hypot(dx, dz), sl = Math.atan2(9, L);
      const g = new THREE.BoxGeometry(Math.hypot(L, 9), 0.6, 0.8); g.rotateZ(sl);
      g.applyMatrix4(new THREE.Matrix4().makeRotationY(-Math.atan2(dz, dx))); g.translate((a[0] + b[0]) / 2, 29.3, (a[1] + b[1]) / 2); P(g, wh);
    }
  }

  // ================================================================ [PD] 저층 연결부 (OSM 외곽선 전체 22 ft, 노출 변만 벽)
  {
    const H = 22;
    roofCap(HM, H, M.roof_gravel);
    for (const i of [1, 7, 8, 9, 10, 11, 12, 21, 22, 35]) {
      const p0 = HM[i], p1 = HM[(i + 1) % HM.length], L = E(p0, p1).L, ops = [];
      const nc = Math.floor((L - 4) / 4.5);
      for (let k = 0; k < nc; k++) { const s = 2 + k * (L - 4) / nc + 0.8; ops.push({ s, e: s + (L - 4) / nc - 1.6, b: 15.4, t: 18.0 }); }
      const nw = Math.floor(L / 13);
      for (let k = 0; k < nw; k++) { const s = (k + 0.5) * L / nw - 3; ops.push({ s, e: s + 6, b: 2.5, t: 10.5 }); }
      wall(p0, p1, 0, 19, ops, brickT);
      for (const o of ops) pane(p0, p1, o.s, o.e, o.b, o.t, 0.5);
      bx(p0, p1, -0.5, L + 0.5, 19, H + 0.3, -0.5, 4.0, wh);
    }
    // 남측 홀의 어두운 모임지붕 (위성)
    hip(rectXZ(-232, -172, -276, -206), H, 11, M.roof_dark);
  }

  // ================================================================ 입구 파빌리온 + 로비 + 계단 + 화단 (5th St)
  {
    const FL = 4.5, x0 = -321, x1 = -275, z0 = -232, z1 = -202, zc = (z0 + z1) / 2;
    // 로비 (뒤편 1층)
    const lob = rectXZ(-275, -234, -272, -206);
    for (const [p0, p1] of edges(lob)) {
      const e = E(p0, p1);
      if (Math.abs(e.n[0] + 1) < 0.01) {   // 서면: 검은 유리 + 백색 기둥
        pane(p0, p1, 0, e.L, 0, 12, 0.8, darkGlass);
        for (let s = 0; s <= e.L; s += 11) bx(p0, p1, Math.max(0, s - 0.7), Math.min(e.L, s + 0.7), 0, 12, -0.8, 1.4, wh);
        wall(p0, p1, 12, 16, [], brickT);
      } else wall(p0, p1, 0, 16, [], brickT);
      bx(p0, p1, -0.5, e.L + 0.5, 13, 16.4, -0.5, 2.5, wh);
    }
    roofCap(lob, 16, M.roof_gravel);
    // 파빌리온 바닥 기단
    P(G.box(x1 - x0, FL, z1 - z0, (x0 + x1) / 2, 0, zc), M.concrete);
    // 석회석 피어 (전면 4개) + 측벽
    for (const z of [z0 + 1.75, z1 - 1.75]) P(G.box(3.5, 12, 3.5, x0 + 1.75, FL, z), ls);
    P(G.box(1.6, 11, 1.6, x0 + 9.2, FL, zc), ls);
    P(G.box(x1 - x0 - 3, 12, 1.5, (x0 + 3 + x1) / 2, FL, z0 + 0.75), ls); P(G.box(x1 - x0 - 3, 12, 1.5, (x0 + 3 + x1) / 2, FL, z1 - 0.75), ls);
    // 입구 유리문 (전면에서 10 ft 후퇴)
    P(G.sideGeometry([[x0 + 10, z0 + 1.5], [x0 + 10, z1 - 1.5]], FL, FL + 11, 1 / 27, 1 / 11, false), darkGlass, false);
    for (let z = z0 + 1.5; z <= z1 - 1.5; z += 4.5) P(G.box(0.4, 11, 0.4, x0 + 9.9, FL, z), M.metal);
    // 프리즈 (DEDE ACTIVITY CENTER) + 처마 + 페디먼트 (HULMAN MEMORIAL STUDENT UNION)
    const yF = FL + 12, yC = yF + 5, yR = yC + 7.5;
    P(G.box(x1 - x0, 5, z1 - z0 + 1, (x0 + x1) / 2, yF, zc), ls);
    P(G.box(2.2, 0.8, z1 - z0 + 2, x0 - 0.3, yC - 0.8, zc), ls);
    capDown(rectXZ(x0, x0 + 10, z0 + 1.5, z1 - 1.5), yF, ls);
    // 글자 (어두운 얕은 박스 줄)
    for (let i = 0; i < 20; i++) if (i !== 4 && i !== 13) P(G.box(0.08, 0.9, 0.5, x0 - 0.04, yF + 1.9, z0 + 6.4 + i * 0.9), M.dark);   // DEDE ACTIVITY CENTER
    for (let i = 0; i < 16; i++) if (i !== 6) P(G.box(0.08, 0.75, 0.45, x0 - 0.04, yC + 2.5, z0 + 8.2 + i * 0.85), M.dark);           // HULMAN MEMORIAL
    for (let i = 0; i < 13; i++) if (i !== 7) P(G.box(0.08, 0.75, 0.45, x0 - 0.04, yC + 1.2, z0 + 9.6 + i * 0.85), M.dark);           // STUDENT UNION
    // 박공: 페디먼트 삼각형(석회석) + 지붕 경사면
    const g = new THREE.BufferGeometry();
    const tri = [x0, yC, z0, x0, yC, z1, x0, yR, zc, x1, yC, z1, x1, yC, z0, x1, yR, zc];
    g.setAttribute('position', new THREE.Float32BufferAttribute(tri, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, 1, 0, 0.5, 1, 0, 0, 1, 0, 0.5, 1], 2)); g.computeVertexNormals(); P(g, ls);
    tris([[[x0 - 0.8, yC, z0 - 0.8], [x1, yC, z0 - 0.8], [x1, yR + 0.3, zc]], [[x0 - 0.8, yC, z0 - 0.8], [x1, yR + 0.3, zc], [x0 - 0.8, yR + 0.3, zc]],
      [[x0 - 0.8, yC, z1 + 0.8], [x1, yR + 0.3, zc], [x1, yC, z1 + 0.8]], [[x0 - 0.8, yC, z1 + 0.8], [x0 - 0.8, yR + 0.3, zc], [x1, yR + 0.3, zc]]], M.roof_dark);
    // 계단 2단 (보도 동쪽 x -344 → 참 -333..-327 → 바닥 -321), 폭 z -228..-206
    const sz0 = -228, sz1 = -206, szc = (sz0 + sz1) / 2;
    for (let i = 0; i < 4; i++) P(G.box(1.5, (i + 1) * 0.56, sz1 - sz0, -344 + 0.75 + i * 1.5, 0, szc), M.concrete);
    P(G.box(6, 2.25, sz1 - sz0, -335, 0, szc), M.concrete);
    for (let i = 0; i < 4; i++) P(G.box(1.5, 2.25 + (i + 1) * 0.56, sz1 - sz0, -332 + 0.75 + i * 1.5, 0, szc), M.concrete);
    P(G.box(5, FL, sz1 - sz0, -323.5, 0, szc), M.concrete);
    for (const z of [sz0 - 0.8, szc, sz1 + 0.8]) {   // 벽돌 측벽/중앙 분리벽 + 석회석 갓돌
      P(G.box(23, 2.8, 1.5, -332.5, 0, z), brickD); P(G.box(12, 2.2, 1.5, -327, 2.8, z), brickD);
      P(G.box(23.4, 0.35, 1.9, -332.5, 2.8, z), ls); P(G.box(12.4, 0.35, 1.9, -327, 5.0, z), ls);
    }
    for (const z of [sz0 + 1.2, szc - 1.2, szc + 1.2, sz1 - 1.2]) {   // 금속 난간 (단별 수평 레일 + 기둥)
      P(G.box(6, 0.15, 0.15, -341, 3.6, z), M.metal); P(G.box(6, 0.15, 0.15, -329, 5.8, z), M.metal);
      for (const x of [-344, -338, -332, -326]) P(G.box(0.15, 3.4, 0.15, x, x < -336 ? 0.6 : 2.6, z), M.metal);
    }
    // 북측 램프 옹벽 + 난간
    P(G.box(30, 2.5, 1.2, -325, 0, -244), brickD); P(G.box(30, 0.15, 0.15, -325, 3.4, -244), M.metal);
    // 보도변 벽돌 화단 (북·남), 석회석 갓돌 + 화초
    for (const [za, zb] of [[-262, -233], [-201, -150]]) {
      P(G.box(6, 2.3, zb - za, -355, 0, (za + zb) / 2), brickD);
      P(G.box(6.4, 0.3, zb - za + 0.4, -355, 2.3, (za + zb) / 2), ls);
      P(G.box(5, 0.35, zb - za - 1, -355, 2.35, (za + zb) / 2), M.grass, false);
    }
  }

  // ================================================================ Dede Activity Center
  {
    const dedeRoof = tint('dede_roof', M.roof_gravel, 0x6c6253);
    const H = 22, HB = 15.5, AC = [-95, 175], DR = [-205.5, 52.5], RR = 25;
    const push = (p, d) => { const dx = p[0] - AC[0], dz = p[1] - AC[1], L = Math.hypot(dx, dz); return [p[0] + dx / L * d, p[1] + dz / L * d]; };
    const arcE = [11, 12, 13, 14, 15, 16], arcW = [24, 25, 26, 27, 28, 29];
    // 본체 상부 다각형: 곡면 호를 8 ft 안쪽(광장 반대쪽)으로 민 것
    const up = [];
    for (let i = 0; i < DD.length; i++) up.push((arcE.includes(i) && i !== 11) || arcW.includes(i) ? push(DD[i], 8) : DD[i]);
    const upper = ccw(up);
    // 항공사진(isu/r, fountain/f): Dede 지붕 = 짙은 회갈색 자갈 (사진 평균 ≈ (102,92,78))
    roofCap(upper, H, dedeRoof);
    // 곡면 띠 (유리 커튼월 + 백색 평지붕)
    const bandE = ccw([...[11, 12, 13, 14, 15, 16].map(i => DD[i]), ...[16, 15, 14, 13, 12].map(i => push(DD[i], 8))]);
    const bandW = ccw([...[24, 25, 26, 27, 28, 29].map(i => DD[i]), ...[29, 28, 27, 26, 25, 24].map(i => push(DD[i], 8))]);
    for (const band of [bandE, bandW]) roofCap(band, HB, wh);
    const curtain = (p0, p1) => {
      const e = E(p0, p1), n = Math.max(1, Math.round(e.L / 6));
      pane(p0, p1, 0, e.L, 0, HB - 1.2, 0.3);
      for (let i = 0; i <= n; i++) bx(p0, p1, Math.max(0, i * e.L / n - 0.2), Math.min(e.L, i * e.L / n + 0.2), 0, HB - 1.2, -0.3, 0.5, M.dark);
      bx(p0, p1, 0, e.L, 9.8, 10.2, -0.3, 0.5, M.dark);
      bx(p0, p1, -0.3, e.L + 0.3, HB - 1.2, HB + 0.4, -0.2, 1.4, wh);
    };
    for (let k = 0; k < 5; k++) { curtain(DD[arcE[k]], DD[arcE[k + 1]]); curtain(DD[arcW[k]], DD[arcW[k + 1]]); }
    // 본체 벽: 변별 처리
    const solid = (p0, p1, y0, { base = true, piers = 0 } = {}) => {
      const e = E(p0, p1);
      wall(p0, p1, y0, H, [], brickD);
      if (base && y0 < 1) bx(p0, p1, 0, e.L, 0, 3.5, 0, 0.12, M.concrete);
      if (piers) { const n = Math.max(1, Math.round(e.L / piers)); for (let i = 0; i <= n; i++) { const c = Math.min(e.L - 1.25, Math.max(1.25, i * e.L / n)); bx(p0, p1, c - 1.25, c + 1.25, 0, 15.5, 0, 0.6, brickD); } }
    };
    const fascia = (p0, p1) => { const e = E(p0, p1); bx(p0, p1, -0.3, e.L + 0.3, 15.5, 18, -0.2, 3.7, wh); bx(p0, p1, -0.2, e.L + 0.2, H, H + 0.45, -1.0, 1.25, ls); };
    const loggia = (p0, p1, sA, sB) => {   // sA..sB 구간 1층 로지아 (6 ft 후퇴, 17 ft 피어 간격)
      const e = E(p0, p1), n = Math.max(1, Math.round((sB - sA) / 17)), w = (sB - sA) / n;
      wall(p0, p1, 11, H, [], brickD);
      if (sA > 0.1) wall(p0, at(p0, e, sA, 0), 0, 11, [], brickD);
      if (sB < e.L - 0.1) wall(at(p0, e, sB, 0), p1, 0, 11, [], brickD);
      pane(p0, p1, sA, sB, 0.2, 10.8, 6, darkGlass);
      for (let i = 0; i <= n; i++) { const c = Math.min(sB - 1.5, Math.max(sA + 1.5, sA + i * w)); bx(p0, p1, c - 1.5, c + 1.5, 0, 11, -6, 6, brickD); bx(p0, p1, c - 1.5, c + 1.5, 0, 3.5, 0, 0.12, M.concrete); }
      bx(p0, p1, sA, sB, 10.7, 11, -6, 6, M.trim);
      for (let i = 0; i < n; i++) { const c = sA + (i + 0.5) * w; bx(p0, p1, c - 3, c + 3, 0.2, 8.0, -6.2, 0.3, M.dark); }   // 출입문
      if (sA > 0.1) bx(p0, p1, 0, sA, 0, 3.5, 0, 0.12, M.concrete);
      if (sB < e.L - 0.1) bx(p0, p1, sB, e.L, 0, 3.5, 0, 0.12, M.concrete);
    };
    const n = upper.length;
    for (let i = 0; i < n; i++) {
      const p0 = upper[i], p1 = upper[(i + 1) % n], e = E(p0, p1);
      const isOrig = j => Math.hypot(p0[0] - DD[j][0], p0[1] - DD[j][1]) < 0.01;
      const isOrig1 = j => Math.hypot(p1[0] - DD[j][0], p1[1] - DD[j][1]) < 0.01;
      if (e.L < 0.5) continue;
      // 로툰다 둘레(0..11) 는 드럼이 덮음
      if ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].some(j => isOrig(j)) && [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].some(j => isOrig1(j))) continue;
      if (isOrig(19) && isOrig1(20)) continue;                       // WT 남면과 공유
      if (isOrig(22) && isOrig1(23)) { loggia(p0, p1, 10, e.L - 30); fascia(p0, p1); continue; }   // 서면 5th St
      if (isOrig(17) && isOrig1(18) || isOrig1(17)) { loggia(p0, p1, 8, e.L - 8); fascia(p0, p1); continue; }                        // 동면 (가정)
      if (isOrig(23)) { solid(p0, p1, 0, { piers: 27 }); fascia(p0, p1); continue; }                                                // 남면
      if (isOrig(18) || isOrig(20) || isOrig(21)) { solid(p0, p1, 0, { piers: 30 }); fascia(p0, p1); continue; }                    // 북면·노치
      // 곡면 안쪽 벽 (띠 지붕 위 15.5..22)
      wall(p0, p1, HB, H, [], brickD); bx(p0, p1, -0.2, e.L + 0.2, H, H + 0.45, -1.0, 1.25, ls);
    }
    // 띠 끝단 벽 (남면 24→24', 동단 16→16')
    for (const [a, b] of [[push(DD[24], 8), DD[24]], [DD[16], push(DD[16], 8)]]) {
      const pp = area([a, b, DD[20]]) > 0 ? [a, b] : [b, a];
      wall(pp[0], pp[1], 0, HB, [], brickD);
    }
    // 로툰다: 하부 유리 + 벽돌 + 고창 드럼 + 유리 원뿔
    const circ = (r, seg = 32) => ccw(Array.from({ length: seg }, (_, k) => [DR[0] + r * Math.cos(k * 2 * Math.PI / seg), DR[1] + r * Math.sin(k * 2 * Math.PI / seg)]));
    const c0 = circ(RR);
    P(G.sideGeometry(c0, 0, HB - 1.2, 1 / 6, 1 / (HB - 1.2)), M.pane, false);
    P(G.sideGeometry(circ(RR + 0.4), HB - 1.2, HB + 1.0), wh);
    P(G.sideGeometry(c0, HB + 1.0, H + 0.5), brickD);
    P(G.sideGeometry(circ(RR - 1.5), H + 0.5, 29), M.pane, false);
    P(G.sideGeometry(circ(RR - 1.1), 29, 30.5), wh);
    roofCap(circ(RR - 1.1), 30.5, wh, [circ(RR - 3)]);   // 드럼 윗면 흰 고리
    for (const [a, b] of edges(c0)) { const e = E(a, b); bx(a, b, -0.25, 0.25, 0, HB - 1.2, -0.1, 0.5, M.dark); void e; }
    for (const [a, b] of edges(circ(RR - 1.5))) bx(a, b, -0.3, 0.3, H + 0.5, 29, -0.1, 0.6, wh);
    // 항공사진: 드럼 위는 원뿔이 아니라 열린 고리 — 드럼 안쪽으로 낮은 원형 지붕(24 ft) + 가운데 원형 천창
    P(G.sideGeometry([...circ(RR - 3)].reverse(), 24, 30.5), brickD, false);
    roofCap(circ(RR - 3), 24, dedeRoof, [circ(9)]);
    P(G.sideGeometry(circ(9), 24, 25.5), wh); frustum(circ(9), 25.5, circ(3), 28, skyGlass);
    // 지붕 중앙 청색 피라미드 천창 + 설비
    // 항공사진(isu/r 근경): 피라미드 천창이 아니라 유리 고창 측벽 + 청색 금속 평지붕(낮은 모임)의 옥상 박스 (≈ 50 × 32 ft, 높이 ≈ 10 ft)
    const sq = rectXZ(-233, -183, -78, -46);
    { const ex = G.extrudePoly(sq, [], 1.5, { y0: H }); P(ex.sides, M.trim); }
    { const ex = G.extrudePoly(sq, [], 7.5, { y0: H + 1.5 }); P(ex.sides, darkGlass, false); }
    for (const [a, b] of edges(sq)) { const e = E(a, b), nn = Math.max(1, Math.round(e.L / 5)); for (let k = 0; k <= nn; k++) { const c = Math.min(e.L - 0.2, Math.max(0.2, k * e.L / nn)); bx(a, b, c - 0.2, c + 0.2, H + 1.5, H + 9, -0.1, 0.3, M.dark); } }
    const sqo = G.offsetPoly(sq, -1.5);
    { const ex = G.extrudePoly(sqo, [], 0.8, { y0: H + 9 }); P(ex.sides, blue); }
    hip(sqo, H + 9.8, 2.2, blue);
    for (const [x, z, w, d] of [[-300, -118, 8, 5], [-292, -62, 6, 6], [-276, -20, 10, 5], [-252, -96, 6, 4], [-244, 8, 8, 6], [-162, -112, 10, 6], [-150, -30, 6, 6], [-128, -82, 8, 5], [-118, -10, 6, 4], [-292, 58, 8, 6], [-270, 104, 6, 5], [-172, -126, 6, 4], [-310, 20, 5, 5], [-140, -128, 7, 5]])
      P(G.box(w, 4.5, d, x, H, z), M.metal);
  }

  const grp = new THREE.Group();
  for (const m of G.mergeByMaterial(parts)) grp.add(m);
  return grp;
}
