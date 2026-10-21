// John W. Moore Welcome Center — former Home Economics Building (Miller, Vrydagh & Miller, 1955)
// 치수 근거 (도면 세트 "Home Ec 1955 originals", 1/8" = 1'-0", 2012 년 Welcome Center 전환 시 외피는 1955 그대로):
//   sheet 1 Plot Plan, sheet 3 First Floor Plan, sheet 4 Second Floor Plan + Roof Plans, sheet 5 Elevations & Sections,
//   sheet 6 Wall Sections (4/6 사무동 벽단면: 4'-0" 지붕 돌출 + 경사 스터코 소핏, 창 3'-0" 창대/6'-1¾" 창높이), sheet 7 디테일
//   sheet 3: 사무동 85'-8¼" × 33' (12' 베이 × 7), 입구 23'-9" (현관문 J 는 전면에서 7'-7" 후퇴, 포치 깊이 13'-11¼"),
//            2층 블록 61'-8½" × 110'-9" (전면이 사무동 전면보다 6'-2" 돌출), 1층 서측부: 라운지 남벽 x=83', 여자화장실 20'-5"×14',
//            계단실 베이 17'-6" × 18'-7½" (서측 끝, 2층), 테라스 담장 72'-8¼"(서) + 71.5'(남), 1'-0" 두께, 옥외 오븐(10'-0" 대각)
//   sheet 5: 지면 101'-0", 1st FL 101'-10"(=y 0), 2nd FL 115'-2"(=13.33), 2층 지붕 25'-11½" + 알루미늄 파시아 → 26.4,
//            1층 지붕 파시아 상단 11.0, 창 타입 A 3'-10⅜"×6'-1⅛" (12' 베이 = 3창, 피치 4.0'), A1 ×8'-1⅛", A2/F ×4'-7", G 환기구 1'-6",
//            B 고정유리+알루미늄(계단 3, 10'-0" M.O. 2층 높이), C 커튼월(북측, 4'-0" 패널 × 27 = 108'), D/E 유리블록(서측), 평지붕(tar & gravel)
//
// ■ 입면 창 배치 (로컬 프레임: 평면도 기준 x = 오른쪽(= 북), z = 아래(= 동, 전면). 원점 = 사무동 전면 남동 모서리, y = 1층 바닥 = 지면)
//   [동측 사무동 전면 z=0, x 0..85.7]  A 창 21개, 피치 4.0', x 1.0 + 4i (유리폭 3.86), 창대 3.0 / 상단 9.1, 레일 4.5·7.0,
//        석재 창대, 4' 지붕 돌출 + 경사 스터코 소핏(벽 9.3 → 처마 10.3), 알루미늄 파시아 10.3..11.0, 전면 화단 3'-0" (석재 갓돌 +0.55)
//   [동측 입구 z=-7.6, x 85.7..109.45]  J 전면 유리벽 전폭, 2짝문 2조(x 92.5..97.8, 99.5..104.8) + 트랜섬 7.0..8.7, 포치 지붕(캐노피) z=+4 까지
//   [동측 2층 블록 z=+6.2, x 109.45..171.15]  면벽돌 무창. 계단 3 유리 B x 110.5..120.5, y 0..25.5 (패널 13.3..15.3, 23.0..25.5, 멀리언 3등분, 레일 3.8·7.4)
//   [북측 x=171.15, z 6.2..-104.5]  커튼월 C 27 패널 × 4' (z 4.9..-103.1), 양끝 벽돌 1.3'. 수직: 패널 0..3.3 / 호퍼 3.3..4.4 / 유리 4.4..12.2 (레일 9.65)
//        / 패널 12.2..16.8 / 호퍼 16.8..18.3 / 유리 18.3..23.3 / 패널 23.3..25.5. 12' 마다 구조 멀리언.
//   [서측 2층 블록 z=-104.5, x 92.5..171.15]  면벽돌. D 유리블록 x 111.5..121 (1층 0.3..9.8, 2층 13.3..23.0), E 유리블록 x 124.2..145.8 y 16.6..23.0
//        (하단 호퍼 6개 16.6..18.1), 계단실 서측 출입문 x 93.3..99.3 (6'-0" M.O., 문 + 사이드라이트), 지붕 스커틀·굴뚝(spark arrestor)
//   [서측 여자화장실 z=-104.5, x 72.7..93.1]  A 창 5개 x 73.1 + 4i, 4' 돌출 소핏
//   [남측 2층 블록 x=109.45, z -86..6.2]  2층 창띠 12개 (F A2 F F A2 F F A2 F F A2 F) z -67.5 + 4i, y 17.2..21.8. 1층은 로비/라운지와 접함
//   [남측 라운지 x=83, z -90.5..-33]  문 B1 z -81.8..-78.8, A1 창 10개 z -79 + 4i (y 0.9..9.0, 레일 2.4·5.85), 문 B1 z -37.9..-34.9, 4' 소핏
//   [남측 여자화장실 x=72.7, z -104.5..-90.5]  G 호퍼 환기구 2개 (3.86 × 1.5, y 7.3..8.8), 석재 창대
//   [남측 사무동 끝벽 x=0, z -33..0]  면벽돌, 문 B z -17.7..-14.7 (7'-0") + 콘크리트 플랫폼 5'×5'-4"
//   [서측 사무동 배면 z=-33, x 0..83]  A 창 20개 x 1.0 + 4i, 문 B1 x 45.3..48.3 (i=11 모듈, 트랜섬 7..9.1), 4' 소핏
//   [계단실 베이 2층 x 92.5..109.45, z -104.5..-86]  동면 z=-86 에 공기 그릴 x 93.1..97.8, y 20.6..24.8
//   [지붕]  1층: C-48 스카이돔 2개 (x 90.5·100, z -15.3), 루프벤트 4, 2층: S-3636 스카이돔 4개 (x 130, z -62.5/-53.3/-40.7/-26.2),
//        루프벤트(대형 4.4² x119 z-83, 직사각 2개 z-94), 굴뚝 2'×2' (x 122.5, z -97) → y 30.5, 스커틀 (x 95.8, z -102.3)
import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

export const meta = {
  id: 'welcome', name: 'John W. Moore Welcome Center', osm: 'way/461428310',
  anchor: [-76.4, 404.16], rotation: -89.654,   // tools/fit_footprint.py 결과 (RMS 2.8 ft)
  height: 27,
  preset: { pos: [130, 120, 470], tgt: [-126, 8, 318] },
  sheets: 'Home Economics Building 1955: sheets 1, 3, 4, 5, 6, 7',
};

// ---- 주요 치수 (ft, 1층 바닥 = 지면 = 0)
const XB0 = 109.45, XB1 = 171.15;            // 2층 블록 남/북 면
const ZF = 6.2, ZW = -104.5;                  // 2층 블록 전면(동)/배면(서)
const XBAR = 85.7, ZBAR = -33;                // 사무동 북단 / 배면
const ZDOOR = -7.6, ZPORCH = 4.0;             // 입구 유리벽 / 포치(1층 지붕) 전면 처마
const XLNG = 83.0, XWT = 72.7, ZWT = -90.5;   // 라운지 남벽, 여자화장실 남벽, 여자화장실 남단
const XST = 92.5, ZST = -86.0;                // 계단실 베이(2층) 남면 / 동면
const H1W = 9.4, H1S = 10.3, H1R = 11.0;      // 1층 띠창 벽 상단, 처마(파시아 하단), 지붕 상단
const H2W = 25.5, H2R = 26.4;                 // 2층 벽 상단(파시아 하단), 지붕 상단
const OV = 4.0, OV1 = 1.0;                    // 4' 돌출(경사 소핏) / 1' 돌출
const Y0 = -1.0;                              // 벽 하단 (지면 아래로 여유)

export const outline = [[0, 0], [XBAR, 0], [XB0, 0], [XB0, ZF], [XB1, ZF], [XB1, ZW], [XWT, ZW], [XWT, ZWT], [XLNG, ZWT], [XLNG, ZBAR], [0, ZBAR]];

export function build(M, G) {
  const parts = [];
  const brick = M.brick_red, stone = M.limestone, stucco = M.trim, fascia = M.white, frame = M.dark, panel = M.precast;
  const P = (geom, mat, cast) => parts.push({ geom, mat, cast });

  // ------------------------------------------------------------ 헬퍼
  const dir = (p0, p1) => { const dx = p1[0] - p0[0], dz = p1[1] - p0[1], L = Math.hypot(dx, dz); return { ex: [dx / L, dz / L], ez: [-dz / L, dx / L], L, ry: -Math.atan2(dz, dx) }; };
  const at = (p0, d, s, off) => [p0[0] + d.ex[0] * s - d.ez[0] * off, p0[1] + d.ex[1] * s - d.ez[1] * off];   // 시작점에서 s, 안쪽으로 off
  /** 개구에 유리(inset) + 프레임 박스 (세로 멀리언 muls = s 위치, 가로 레일 rails = y). mat 를 주면 유리 대신 그 재질 판 */
  function glazing(p0, p1, s, e, b, t, { inset = 0.5, rails = [], muls = [], mat = null, edge = true } = {}) {
    const d = dir(p0, p1);
    if (mat) { const c = at(p0, d, (s + e) / 2, inset - 0.15); P(G.box(e - s, t - b, 0.3, c[0], b, c[1], { ry: d.ry }), mat); }
    else P(G.sideGeometry([at(p0, d, s, inset), at(p0, d, e, inset)], b, t, 1 / (e - s), 1 / (t - b), false), M.pane, false);
    const fr = [];
    for (const sm of (edge ? [s, ...muls, e] : muls)) { const c = at(p0, d, sm, inset - 0.1); fr.push(G.box(0.15, t - b, 0.35, c[0], b, c[1], { ry: d.ry })); }
    for (const y of (edge ? [b, ...rails, t] : rails)) { const c = at(p0, d, (s + e) / 2, inset - 0.1); fr.push(G.box(e - s, 0.15, 0.35, c[0], y - 0.075, c[1], { ry: d.ry })); }
    if (fr.length) P(BufferGeometryUtils.mergeGeometries(fr), frame);
  }
  /** 문짝(어두운 판) + 상부 트랜섬 유리 */
  function door(p0, p1, s, e, hDoor, hHead, { inset = 0.5, leaves = 1 } = {}) {
    const d = dir(p0, p1), c = at(p0, d, (s + e) / 2, inset - 0.1);
    P(G.box(e - s, hDoor, 0.2, c[0], 0, c[1], { ry: d.ry }), frame);
    if (leaves > 1) { const m = at(p0, d, (s + e) / 2, inset - 0.25); P(G.box(0.1, hDoor, 0.1, m[0], 0, m[1], { ry: d.ry }), M.white); }
    if (hHead > hDoor + 0.2) glazing(p0, p1, s, e, hDoor, hHead, { inset });
  }
  /** 경사 소핏: 벽선 p0→p1 바깥쪽으로 depth 만큼, 벽에서 yW, 처마에서 yE. 양끝 수직 삼각형 포함 */
  function soffit(p0, p1, depth, yW, yE) {
    const d = dir(p0, p1), a = at(p0, d, 0, -depth), b = at(p0, d, d.L, -depth);
    const V = [[p0[0], yW, p0[1]], [p1[0], yW, p1[1]], [b[0], yE, b[1]], [a[0], yE, a[1]]];
    const tri = (A, B, C) => [...A, ...B, ...C];
    const pos = [
      ...tri(V[0], V[1], V[2]), ...tri(V[0], V[2], V[3]),        // 아래·바깥을 향하는 소핏면
      ...tri(V[0], V[3], [p0[0], yE, p0[1]]),                     // 시작단 삼각형 (법선 -ex)
      ...tri(V[1], [p1[0], yE, p1[1]], V[2]),                     // 끝단 삼각형 (법선 +ex)
    ];
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    const uv = []; for (let i = 0; i < pos.length / 3; i++) uv.push(pos[i * 3] / 24, pos[i * 3 + 2] / 24);
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    g.computeVertexNormals();
    P(g, stucco, false);
  }
  /** 아래를 향하는 수평면 (지붕 밑면/천장) */
  function capDown(poly, y, mat) {
    const sh = new THREE.Shape(poly.map(p => new THREE.Vector2(p[0], p[1])));
    const g = new THREE.ShapeGeometry(sh); g.rotateX(Math.PI / 2); g.translate(0, y, 0);
    const uv = g.attributes.uv, pos = g.attributes.position;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, pos.getX(i) / 24, pos.getZ(i) / 24);
    P(g, mat, false);
  }
  /** 평지붕: 파시아(측면) + 자갈 상판 + 밑면 */
  function roof(poly, yBot, yTop) {
    const e = G.extrudePoly(poly, [], yTop - yBot, { y0: yBot });
    P(e.sides, fascia); P(e.top, M.roof_gravel); capDown(poly, yBot, stucco);
  }
  const wall = (p0, p1, y0, y1, openings = []) => P(G.wallSeg(p0, p1, y0, y1, { openings }), brick);
  /** 석재 창대: 개구 s..e 아래 y 에 0.25 높이, 0.2 돌출 */
  function sill(p0, p1, s, e, y) { const d = dir(p0, p1), c = at(p0, d, (s + e) / 2, -0.1); P(G.box(e - s + 0.3, 0.25, 0.45, c[0], y - 0.25, c[1], { ry: d.ry }), stone); }

  // ============================================================ 1층 사무동 (x 0..85.7, z -33..0)
  // 전면(동) z=0: A 창 21개
  {
    const p0 = [0, 0], p1 = [XBAR, 0], ops = [];
    for (let i = 0; i < 21; i++) { const s = 1.0 + 4 * i; ops.push({ s, e: s + 3.86, b: 3.0, t: 9.1 }); glazing(p0, p1, s, s + 3.86, 3.0, 9.1, { rails: [4.5, 7.0] }); }
    wall(p0, p1, Y0, H1W, ops); sill(p0, p1, 0.8, 85.0, 3.0);
    soffit(p0, p1, OV, 9.3, H1S);
  }
  // 배면(서) z=-33: A 창 20개 + 문 B1 (x 45.3..48.3)
  {
    const p0 = [XLNG, ZBAR], p1 = [0, ZBAR], ops = [];
    for (let i = 0; i < 20; i++) {
      const x0 = 1.0 + 4 * i, s = XLNG - (x0 + 3.86), e = XLNG - x0;
      if (i === 11) { ops.push({ s, e, b: Y0 + 0.5, t: 9.1 }); door(p0, p1, s + 0.4, e - 0.4, 7.0, 9.1); continue; }
      ops.push({ s, e, b: 3.0, t: 9.1 }); glazing(p0, p1, s, e, 3.0, 9.1, { rails: [4.5, 7.0] });
    }
    wall(p0, p1, Y0, H1W, ops); sill(p0, p1, XLNG - 81.0, XLNG - 45.5, 3.0); sill(p0, p1, XLNG - 44.9, XLNG - 0.8, 3.0);
    soffit(p0, p1, OV, 9.3, H1S);
  }
  // 남측 끝벽 x=0: 문 B + 콘크리트 플랫폼
  {
    const p0 = [0, ZBAR], p1 = [0, 0], s = -17.7 - ZBAR, e = s + 3.0;
    wall(p0, p1, Y0, H1S, [{ s, e, b: Y0 + 0.5, t: 7.0 }]); door(p0, p1, s, e, 7.0, 7.0);
    P(G.box(5.4, 0.15, 5.0, -2.7, 0, -16.2), M.walk, false);
  }
  // 전면 화단 (3'-0" 폭, 석재 갓돌)
  P(G.box(XBAR, 0.55, 3.7, XBAR / 2, 0, 1.85), brick);
  P(G.box(XBAR + 0.3, 0.15, 0.7, XBAR / 2, 0.55, 0.35), stone); P(G.box(XBAR + 0.3, 0.15, 0.7, XBAR / 2, 0.55, 3.35), stone);
  P(G.box(0.7, 0.15, 3.9, 0.2, 0.55, 1.85), stone); P(G.box(0.7, 0.15, 3.9, XBAR - 0.2, 0.55, 1.85), stone);
  P(G.capGeometry([[0.5, 0.6], [XBAR - 0.5, 0.6], [XBAR - 0.5, 3.1], [0.5, 3.1]], [], 0.6), M.grass, false);

  // ============================================================ 입구 포치 (x 85.7..109.45, z -7.6..+4): 전면 유리벽 J + 측벽
  {
    const p0 = [XBAR, ZDOOR], p1 = [XB0, ZDOOR], s0 = 0.3, e0 = XB0 - XBAR - 0.3;
    // 유리벽 전체: 멀리언 (문 위치 포함), 트랜섬 레일 8.7
    const muls = [4.0, 6.8, 12.1, 13.8, 19.1, 21.0];
    glazing(p0, p1, s0, e0, Y0 + 0.5, H1S, { rails: [7.0, 8.7], muls });
    for (const [a, b] of [[6.8, 12.1], [13.8, 19.1]]) door(p0, p1, a, b, 7.0, 7.0, { leaves: 2 });
    P(G.box(0.1, H1S - Y0, 0.6, XBAR + 0.3, Y0, ZDOOR), M.white); P(G.box(0.1, H1S - Y0, 0.6, XB0 - 0.3, Y0, ZDOOR), M.white);
    P(G.box(0.7, H1S - Y0, ZPORCH - ZDOOR, XBAR + 0.35, Y0, (ZDOOR + ZPORCH) / 2), brick);      // 사무동 끝벽 연장(포치 측벽)
    P(G.capGeometry([[XBAR, ZDOOR], [XB0, ZDOOR], [XB0, ZPORCH], [XBAR, ZPORCH]], [], 0.03), M.walk, false);  // 세라믹 타일 바닥
  }

  // ============================================================ 1층 서측부: 라운지 남벽 (x=83), 여자화장실 (x 72.7..93.1, z -104.5..-90.5)
  {
    const p0 = [XLNG, ZWT], p1 = [XLNG, ZBAR], ops = [];                    // 라운지 남벽: A1 창 10개 + 문 2개
    for (const [z0, z1] of [[-81.8, -78.8], [-37.9, -34.9]]) { ops.push({ s: z0 - ZWT, e: z1 - ZWT, b: Y0 + 0.5, t: 9.0 }); door(p0, p1, z0 - ZWT, z1 - ZWT, 7.0, 9.0); }
    for (let i = 0; i < 10; i++) { const s = -79.0 + 4 * i - ZWT; ops.push({ s, e: s + 3.86, b: 0.9, t: 9.0 }); glazing(p0, p1, s, s + 3.86, 0.9, 9.0, { rails: [2.4, 5.85] }); }
    wall(p0, p1, Y0, H1W, ops); sill(p0, p1, -79.2 - ZWT, -39.0 - ZWT, 0.9);
    soffit(p0, p1, OV, 9.3, H1S);
  }
  {
    const p0 = [XWT, ZW], p1 = [XWT, ZWT], ops = [];                        // 여자화장실 남벽: G 환기구 2개
    for (const s of [2.5, 7.6]) { ops.push({ s, e: s + 3.86, b: 7.3, t: 8.8 }); glazing(p0, p1, s, s + 3.86, 7.3, 8.8); sill(p0, p1, s, s + 3.86, 7.3); }
    wall(p0, p1, Y0, H1S, ops);
  }
  {
    const p0 = [XST + 0.6, ZW], p1 = [XWT, ZW], ops = [];                   // 여자화장실 서벽: A 창 5개
    for (let i = 0; i < 5; i++) { const x0 = 73.1 + 4 * i, s = p0[0] - (x0 + 3.86), e = p0[0] - x0; ops.push({ s, e, b: 3.0, t: 9.1 }); glazing(p0, p1, s, e, 3.0, 9.1, { rails: [4.5, 7.0] }); }
    wall(p0, p1, Y0, H1W, ops); sill(p0, p1, p0[0] - 93.0, p0[0] - 72.9, 3.0);
    soffit(p0, p1, OV, 9.3, H1S);
  }
  // 1층 지붕 (4' 돌출: 사무동 전·배면, 라운지 남벽, 여자화장실 서벽 / 1' 돌출: 나머지)
  const roof1 = [[-OV1, ZPORCH], [XB0, ZPORCH], [XB0, ZST], [XST, ZST], [XST, ZW - OV], [XWT - OV1, ZW - OV], [XWT - OV1, ZWT], [XLNG - OV, ZWT], [XLNG - OV, ZBAR - OV], [-OV1, ZBAR - OV]];
  roof(roof1, H1S, H1R);
  // 1층 지붕 요소: C-48 스카이돔 2개(입구), 루프벤트
  for (const x of [90.5, 100.0]) skydome(x, -15.3, 2.0);
  for (const [x, z, w] of [[24.9, -21.6, 1.3], [83.1, -97.9, 1.3], [96.5, -58.2, 1.3], [96.5, -31.5, 1.3]]) P(G.box(w, 1.2, w, x, H1R, z), M.metal);

  // ============================================================ 2층 블록 (x 109.45..171.15, z -104.5..6.2)
  // 동측 전면 z=+6.2: 면벽돌 + 계단 3 유리 B (x 110.5..120.5, 2층 높이)
  {
    const p0 = [XB0, ZF], p1 = [XB1, ZF], d = dir(p0, p1);
    wall(p0, [110.5, ZF], Y0, H2W); wall([120.5, ZF], p1, Y0, H2W);
    const s = 110.5 - XB0, e = 120.5 - XB0;
    glazing(p0, p1, s, e, Y0 + 0.5, 13.3, { rails: [3.8, 7.4], muls: [s + 3.33, s + 6.67] });
    glazing(p0, p1, s, e, 13.3, 15.3, { mat: panel, muls: [s + 3.33, s + 6.67], edge: false });
    glazing(p0, p1, s, e, 15.3, 23.0, { muls: [s + 3.33, s + 6.67] });
    glazing(p0, p1, s, e, 23.0, H2W, { mat: panel, muls: [s + 3.33, s + 6.67], edge: false });
    const c = at(p0, d, (s + e) / 2, -0.05); P(G.box(e - s + 0.4, 0.3, 0.5, c[0], Y0 + 0.5, c[1], { ry: d.ry }), stone);   // 석재 창대·페이싱
  }
  // 북측 x=171.15: 커튼월 C (27 패널 × 4'), 양끝 벽돌 1.3'
  {
    const p0 = [XB1, ZF], p1 = [XB1, ZW], d = dir(p0, p1), s0 = 1.3, e0 = s0 + 108.0;
    wall(p0, at(p0, d, s0, 0), Y0, H2W); wall(at(p0, d, e0, 0), p1, Y0, H2W);
    const zones = [[0, 3.3, 'p'], [3.3, 4.4, 'g'], [4.4, 12.2, 'g'], [12.2, 16.8, 'p'], [16.8, 18.3, 'g'], [18.3, 23.3, 'g'], [23.3, H2W, 'p']];
    for (const [b, t, k] of zones) glazing(p0, p1, s0, e0, b, t, k === 'p' ? { mat: panel, edge: false } : { edge: false });
    // 레일 + 외곽 + 구조 멀리언(12' 마다 굵게)
    const fr = [];
    for (const y of [0, 3.3, 4.4, 9.65, 12.2, 16.8, 18.3, 23.3, H2W]) { const c = at(p0, d, (s0 + e0) / 2, 0.4); fr.push(G.box(e0 - s0, 0.15, 0.35, c[0], y - 0.075, c[1], { ry: d.ry })); }
    for (let i = 0; i <= 27; i++) { const c = at(p0, d, s0 + 4 * i, 0.35); fr.push(G.box(i % 3 === 0 ? 0.3 : 0.15, H2W, 0.45, c[0], 0, c[1], { ry: d.ry })); }
    P(BufferGeometryUtils.mergeGeometries(fr), frame);
    const c = at(p0, d, (s0 + e0) / 2, -0.05); P(G.box(e0 - s0, 0.3, 0.5, c[0], Y0 + 0.5, c[1], { ry: d.ry }), stone);   // 석재 창대
  }
  // 서측 z=-104.5: 블록 (x 171.15..109.45) D/E 유리블록 + 계단실 베이 (109.45..92.5) 출입문
  {
    const p0 = [XB1, ZW], p1 = [XB0, ZW], ops = [];
    const D = [XB1 - 121.0, XB1 - 111.5], E = [XB1 - 145.8, XB1 - 124.2];
    for (const [b, t] of [[0.3, 9.8], [13.3, 23.0]]) { ops.push({ s: D[0], e: D[1], b, t }); glazing(p0, p1, D[0], D[1], b, t, { inset: 0.3, mat: M.glass }); sill(p0, p1, D[0], D[1], b); }
    ops.push({ s: E[0], e: E[1], b: 16.6, t: 23.0 });
    glazing(p0, p1, E[0], E[1], 18.1, 23.0, { inset: 0.3, mat: M.glass, muls: [E[0] + 10.8] });
    const hm = []; for (let i = 1; i < 6; i++) hm.push(E[0] + 3.6 * i);
    glazing(p0, p1, E[0], E[1], 16.6, 18.1, { inset: 0.3, muls: hm }); sill(p0, p1, E[0], E[1], 16.6);
    wall(p0, p1, Y0, H2W, ops);
    const q0 = [XB0, ZW], q1 = [XST, ZW], s = XB0 - 99.3, e = XB0 - 93.3;        // 계단실 서측 문 (6'-0" M.O.)
    wall(q0, q1, Y0, H2W, [{ s, e, b: Y0 + 0.5, t: 7.5 }]); door(q0, q1, s, s + 3.0, 7.5, 7.5); glazing(q0, q1, s + 3.0, e, Y0 + 0.5, 7.5);
    P(G.box(6.4, 0.15, 1.6, 96.3, 0, ZW - 0.8), M.walk, false);                      // 콘크리트 문턱
  }
  // 남측 x=109.45 (z -86..6.2): 2층 창띠 12개 (F A2 F F A2 F F A2 F F A2 F), 1층부는 로비·라운지·포치에 접함
  {
    const p0 = [XB0, ZST], p1 = [XB0, ZF], ops = [];
    for (let i = 0; i < 12; i++) { const s = -67.5 + 4 * i - ZST; ops.push({ s, e: s + 3.86, b: 17.2, t: 21.8 }); glazing(p0, p1, s, s + 3.86, 17.2, 21.8, i % 3 === 1 ? { rails: [18.7] } : {}); }
    wall(p0, p1, Y0, H2W, ops); sill(p0, p1, -67.7 - ZST, -19.4 - ZST, 17.2);
  }
  // 계단실 베이 (2층, x 92.5..109.45, z -104.5..-86): 남면 + 동면(공기 그릴)
  wall([XST, ZW], [XST, ZST], Y0, H2W);
  {
    const p0 = [XST, ZST], p1 = [XB0, ZST], s = 93.1 - XST, e = 97.8 - XST;
    wall(p0, p1, Y0, H2W, [{ s, e, b: 20.6, t: 24.8 }]); glazing(p0, p1, s, e, 20.6, 24.8, { inset: 0.3, mat: frame, rails: [21.6, 22.6, 23.6] });
  }
  // 2층 지붕 (0.7' 돌출) + 지붕 요소
  const roof2 = [[XB0 - 0.7, ZF + 0.7], [XB1 + 0.7, ZF + 0.7], [XB1 + 0.7, ZW - 0.7], [XST - 0.7, ZW - 0.7], [XST - 0.7, ZST + 0.7], [XB0 - 0.7, ZST + 0.7]];
  roof(roof2, H2W, H2R);
  for (const z of [-62.5, -53.3, -40.7, -26.2]) skydome(130.0, z, 1.5);
  P(G.box(4.4, 2.0, 4.4, 119.2, H2R, -83.3), M.metal);
  for (const x of [118.6, 126.6]) P(G.box(6.3, 1.5, 2.6, x, H2R, -93.9), M.metal);
  for (const [x, z] of [[122.1, -64.4], [119.2, -57.0], [121.4, -33.2], [119.2, -28.1], [120.6, -8.7], [155.2, -1.3], [117.7, -88.5], [124.7, -81.1]]) P(G.box(1.2, 1.2, 1.2, x, H2R, z), M.metal);
  P(G.box(2.2, 3.2, 2.2, 120.6, H2R, -3.9), M.metal);
  P(G.box(2.0, 30.5 - H2R, 2.0, 122.5, H2R, -97.0), brick); P(G.box(2.6, 0.8, 2.6, 122.5, 30.5, -97.0), frame);   // 굴뚝 + spark arrestor
  P(G.box(2.6, 1.0, 3.3, 95.8, H2R, -102.3), M.metal);                                                              // 지붕 스커틀

  // ============================================================ 테라스 (서측): 담장 + 석재 갓돌 + 피어, 게이트, 옥외 오븐, 콘크리트 테라스
  {
    const wallH = 6.0;
    P(G.box(1.0, wallH, -39.0 - ZW, 0.5, 0, (ZW - 39.0) / 2), brick);                    // 남측 담장 x=0 (게이트 남쪽)
    P(G.box(1.0, wallH, 2.5, 0.5, 0, -34.25), brick);                                       // 게이트 북쪽 (z -35.5..-33)
    P(G.box(0.1, 5.0, 3.5, 0.5, 0, -37.25), frame);                                       // 게이트 (sh.2)
    P(G.box(XWT + 0.5, wallH, 1.0, (XWT + 0.5) / 2, 0, ZW + 0.5), brick);               // 서측 담장 z=-104.5
    P(G.box(1.3, 0.3, ZBAR - ZW, 0.5, wallH, (ZW + ZBAR) / 2), stone);
    P(G.box(XWT + 0.6, 0.3, 1.3, (XWT + 0.5) / 2, wallH, ZW + 0.5), stone);
    for (const z of [-104.0, -89.5, -75.0, -60.5, -46.0]) { P(G.box(1.5, wallH + 0.1, 1.5, 0.5, 0, z), brick); P(G.box(1.8, 0.3, 1.8, 0.5, wallH + 0.1, z), stone); }
    for (const x of [14.5, 29.0, 43.5, 58.0]) { P(G.box(1.5, wallH + 0.1, 1.5, x, 0, ZW + 0.5), brick); P(G.box(1.8, 0.3, 1.8, x, wallH + 0.1, ZW + 0.5), stone); }
    const r45 = Math.PI / 4;                                                                // 옥외 오븐 (대각 배치, 10'-0" 모서리에서)
    P(G.box(5.0, 3.5, 5.0, 8.0, 0, -97.0, { ry: r45 }), brick); P(G.box(5.4, 0.3, 5.4, 8.0, 3.5, -97.0, { ry: r45 }), stone);
    P(G.box(1.6, 3.0, 1.6, 8.0, 3.8, -97.0, { ry: r45 }), brick);
    P(G.capGeometry([[70.0, ZBAR], [XLNG, ZBAR], [XLNG, ZWT], [XWT, ZWT], [XWT, ZWT - 2.0], [70.0, ZWT - 2.0]], [], 0.08), M.walk, false);   // 콘크리트 테라스 띠
  }

  const grp = new THREE.Group();
  for (const m of G.mergeByMaterial(parts)) grp.add(m);
  return grp;

  // 플라스틱 스카이돔: 커브(0.5) + 반구
  function skydome(x, z, r) {
    const y = x < XB0 && z > ZST ? H1R : H2R;
    P(G.box(2 * r + 0.4, 0.5, 2 * r + 0.4, x, y, z), M.white);
    const g = new THREE.SphereGeometry(r, 10, 5, 0, Math.PI * 2, 0, Math.PI / 2); g.scale(1, 0.6, 1); g.translate(x, y + 0.5, z);
    P(g, M.pane, false);
  }
}
