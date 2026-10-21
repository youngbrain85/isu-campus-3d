// Erickson · Pickerl · Burford Hall (6th St 남서 블록 기숙사 3동) — 스트리트뷰 + 위성 기반 모델 (도면 없음)
// 근거 사진: scratch/sv/545265797 (Pickerl, vp55 5th St (-372,391) / vp56 Chestnut (-373,173)),
//   545265798 (Erickson, vp57 (-372,803) / vp58), 545265799 (Burford, vp59 (-372,803)), 545265800 (vp61·62), 461428313 (vp31·32),
//   461428314 (vp33). 위성: scratch/res_halls_6th/sat_all.png (z20 겨울), z19 여름 그림자.
// ■ 층수·높이 (사진): 세 동 모두 1층 회색 베이스(프리캐스트/스터코, 큰 창·벽등) + 위 5개 층 = 6층.
//   (building_facts 의 3~4층 추정은 사진과 다름 → 사진 우선.) 1층 13 ft, 위층 9.75 ft(기숙사) → 지붕 61.75, 파라펫 64.25.
//   위성 그림자 길이(겨울 z20: Pickerl 북측 ≈75 ft, Erickson 북측 ≈77 ft) 도 세 동이 거의 같은 높이임을 지지.
// ■ Pickerl Hall (L자: 북측 동 x -319..-179 z 408..445 + 서측 동 x -319..-281 z 445..569):
//   북서 모서리 = 적벽돌 블록(x -319..-281, z 408..458), 사진 vp55_130/vp61_105/vp31_115: 모서리 유리 베이(서면 17 ft × 북면 20 ft,
//   2~6층, 층마다 검은 스팬드럴), 1층은 유리 로비가 5 ft 들어가 있고 모서리에 원형 콘크리트 기둥(지름 3 ft).
//   벽돌 블록 북면은 무창(줌 vp56_161), 서면은 유리 베이 남쪽에 쌍창 2열. 벽돌 블록은 지붕이 ≈9 ft 더 높음(vp56_161, 줌 확인).
//   남단(x -319..-281, z 532..569)도 무창 남면의 높은 벽돌 블록(vp57_007 줌). 나머지 = 분홍빛 황갈색 EIFS + 적갈색 필라스터
//   (베이 ≈13 ft 마다 1개, 2층~파라펫), 베이마다 쌍창(5.6×4.6 ft, 검은 프레임, 가운데 멀리언).
//   안뜰 쪽 작은 돌출(x -281..-259 z 445..464, OSM) = 1층 유리 현관(가정).
// ■ Burford Hall (L자: 서측 동 x -282..-245 z 688..845 + 남측 동 x -245..-141 z 810..845):
//   서면 북쪽 100 ft(z 688..788) = 황갈색 EIFS + 필라스터, 1층 회색 베이스(큰 창 + 벽등) — vp57_052, vp59_041, vp33_092.
//   남서 블록(z 788..845) = 적벽돌, 쌍창 (vp57_097). 서측 앞의 박공(모임) 지붕 벽돌 창고는 별도 OSM 건물(way/1464442449).
//   남서 블록 높이·남측 동 마감은 사진에 없음 → 블록은 같은 높이, 남측 동은 서측 동과 같은 EIFS 로 가정.
// ■ Erickson Hall (L자: 북측 동 x -233..-69 z 547..587 + 동측 동 x -109..-72 z 587..690):
//   vp57_007 줌: 서단 = 무창 적벽돌 끝벽 + 밝은 황백색 EIFS(필라스터 없음) 쌍창. 나머지 면은 사진에 없음 → 같은 마감 가정,
//   끝벽(서·동·남단) = 무창 벽돌. 남측 x -133..-110 z 586..611 돌출(OSM) = 1층 라운지(위성에서 낮은 밝은 지붕).
// ■ 지붕(위성): 평지붕 + 파라펫, 배기/환기 소형 유닛이 동 중심선을 따라 줄지어 있음.
// ■ 가정: 안뜰 쪽 입면, 출입구 위치(Burford 동측 안뜰 중앙, Erickson 라운지), 벽돌 블록 높이(Burford), 끝벽 무창.
import * as THREE from 'three';

export const meta = {
  id: 'reshalls', name: 'Erickson, Pickerl & Burford Halls', osm: 'way/545265798', extraIds: ['way/545265797', 'way/545265799'],
  anchor: [0, 0], rotation: 0, height: 73,
  preset: { pos: [-610, 190, 560], tgt: [-210, 20, 630] },
  sheets: 'Street View vp31-33, vp55-59, vp61-62 (2019), Esri imagery z20/z19',
};

const G0 = 13, FH = 9.75, NUP = 5, ROOF = G0 + NUP * FH, TOP = ROOF + 2.5;   // 61.75 / 64.25
const ROOF_B = 70.5, TOP_B = 73;                                             // Pickerl 벽돌 블록
const LOWTOP = 16;                                                            // AEC 저층부 파라펫 높이 근사 (그 위부터 노출)

export function build(M, G) {
  const parts = [];
  const K = makeKit(M, G, parts);
  const mk = (c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.9 });
  const tanP = mk(0xcfae94), pilP = mk(0x95675a), tanE = mk(0xdbcfba), base = mk(0xbdbab3), cope = mk(0xd3cdc3);
  const brick = M.brick_red;

  // ------------------------------------------------------------ 입면 생성기
  // style: 'tan' (EIFS+필라스터), 'tanE' (밝은 EIFS, 필라스터 없음), 'brick' (벽돌+창), 'blank' (무창 벽돌)
  function face(a, b, style, { y0 = -1, top = TOP, nb = 0, groundWin = (i) => true, upWin = (i, f) => true, ops = [], ops0 = [] } = {}) {
    const d = K.dir(a, b), L = d.L;
    if (!nb) nb = Math.max(1, Math.round(L / 13));
    const cs = K.centers(L, nb, 1.0, 1.0);
    const wo = { frame: M.dark, muls: [2.8] };
    if (style === 'blank') { K.wall(a, b, y0, top, ops, brick); return; }
    const isTan = style === 'tan' || style === 'tanE';
    const upMat = style === 'tan' ? tanP : style === 'tanE' ? tanE : brick;
    // 1층
    const gOps = [...ops0];
    if (y0 < G0 - 1) {
      cs.forEach((c, i) => { if (groundWin(i)) gOps.push(K.win(a, b, c - 3.2, c + 3.2, 3.2, 9.4, { ...wo, muls: [3.2], rev: isTan ? base : brick })); });
      K.wall(a, b, y0, G0, gOps, isTan ? base : brick);
      if (isTan) {
        K.wbox(a, b, -0.05, L + 0.05, G0 - 0.6, G0 + 0.5, -0.05, 0.35, base, false);      // 베이스 상단 띠
        cs.forEach((c, i) => { if (i % 2 === 1 && groundWin(i)) K.wbox(a, b, c + 3.9, c + 4.4, 8.0, 9.0, 0, 0.35, M.white, false); });   // 벽등
      }
    }
    // 위층
    const uOps = [...ops], yU = Math.max(y0, G0);
    for (let f = 0; f < NUP; f++) {
      const yb = G0 + f * FH + 2.6, yt = yb + 4.6;
      if (yb < yU + 0.5 || yt > top - 1) continue;
      cs.forEach((c, i) => { if (upWin(i, f)) uOps.push(K.win(a, b, c - 2.8, c + 2.8, yb, yt, { ...wo, rev: upMat })); });
    }
    K.wall(a, b, yU, top, uOps, upMat);
    if (style === 'tan') {                                                       // 필라스터: 베이 경계마다
      const p = (L - 2) / nb;
      for (let k = 0; k <= nb; k++) {
        const s = 1.0 + p * k, s0 = Math.max(0, s - 1.1), s1 = Math.min(L, s + 1.1);
        K.wbox(a, b, s0, s1, Math.max(yU, G0 + 0.5), top, -0.05, 0.3, pilP, false);
      }
    }
  }
  const roofOf = (poly, y, top, par, cp = cope) => K.roof(poly, y, top, { par, cope: cp, mat: M.roof_membrane, copeW: 1.4 });
  const vents = (list, y) => { for (const [x, z] of list) K.unit(x, z, 1.6, 1.6, y, 3, M.metal); };

  // ================================================================ PICKERL HALL
  {
    // --- 북서 벽돌 블록 (x -319..-281, z 408..458), 지붕 70.5
    const nwA = [-319, 408], nwB = [-319, 458], nwC = [-281, 458], nwD = [-281, 408];
    // 서면: 유리 베이 s 0..17 (2~6층), 1층 로비 s 0..32 (0..17 은 5 ft 후퇴, 17..32 는 평면 유리), 쌍창 2열 (s 24, 39)
    {
      const ops = [{ s: 0, e: 17, b: G0, t: ROOF }];
      for (let f = 0; f < NUP; f++) { const yb = G0 + f * FH + 2.6; for (const c of [25, 39]) ops.push(K.win(nwA, nwB, c - 2.8, c + 2.8, yb, yb + 4.6, { frame: M.dark, muls: [2.8], rev: brick })); }
      const ops0 = [{ s: 0, e: 17, b: -1, t: G0 }];
      ops0.push(K.win(nwA, nwB, 17.5, 32, 0, 11.5, { frame: M.dark, muls: [3.6, 7.2, 10.8], rails: [8.0], rev: brick }));
      K.door(nwA, nwB, 21.0, 27.0, 8.0, { inset: 0.25 });
      K.wall(nwA, nwB, -1, G0, ops0, brick);
      K.wall(nwA, nwB, G0, TOP_B, ops, brick);
      curtain(nwA, nwB, 0, 17);
    }
    // 북면 (x -281 → -319): 유리 베이 s 18..38, 나머지 무창 벽돌, 1층 로비 후퇴 s 18..38
    {
      K.wall(nwD, nwA, -1, G0, [{ s: 18, e: 38, b: -1, t: G0 }], brick);
      K.wall(nwD, nwA, G0, TOP_B, [{ s: 18, e: 38, b: G0, t: ROOF }], brick);
      curtain(nwD, nwA, 18, 38);
    }
    // 로비 후퇴부: 유리면 2개 + 측벽 + 천장 + 모서리 원형 기둥
    {
      const gl = (p, q) => K.win(p, q, 0, Math.hypot(q[0] - p[0], q[1] - p[1]), 0, G0, { inset: 0, frame: M.dark, muls: [4, 8, 12], rails: [8.5], fw: 0.25 });
      gl([-299, 413], [-314, 413]); gl([-314, 413], [-314, 425]);
      K.door([-299, 413], [-314, 413], 5, 11, 8.0, { inset: -0.15 });
      K.P(K.quad([-299, 0, 408], [-299, 0, 413], [-299, G0, 413], [-299, G0, 408], [-1, 0, 0]), brick);
      K.P(K.quad([-319, 0, 425], [-314, 0, 425], [-314, G0, 425], [-319, G0, 425], [0, 0, -1]), brick);
      K.cap([[-319, 408], [-319, 425], [-314, 425], [-314, 413], [-299, 413], [-299, 408]], G0, M.white, true);
      K.P(G.cylinder(1.5, G0, -317.6, 0, 409.4, 20), M.concrete);
      K.cap([[-321, 404], [-321, 445], [-309, 445], [-309, 413], [-290, 413], [-290, 404]], 0.06, M.walk);   // 앞 포장(벽돌 포장 광장)
    }
    face(nwC, nwD, 'blank', { y0: ROOF, top: TOP_B });                                    // 동면 (탄 지붕 위만)
    face(nwB, nwC, 'blank', { y0: ROOF, top: TOP_B });                                    // 남면 (서측 동 지붕 위)
    K.wbox(nwB, nwC, -0.2, 38.2, G0 - 0.6, G0 + 0.5, -0.05, 0.35, base, false);
    roofOf([nwA, nwB, nwC, nwD], ROOF_B, TOP_B, brick, M.limestone);

    // --- 북측 동 EIFS (x -281..-178.8, z 408..445)
    const nA = [-281, 408], nB = [-281, 445], nC = [-178.8, 445], nD = [-178.8, 408];
    face(nD, nA, 'tan', { nb: 8 });
    face(nC, nD, 'blank');                                                                 // 동단 끝벽
    face(nB, nC, 'tan', { nb: 8 });                                                        // 안뜰 면
    roofOf([nA, nB, nC, nD], ROOF, TOP, tanP);
    // --- 서측 동 EIFS (x -319..-281, z 458..532)
    const wA = [-319, 458], wB = [-319, 532], wC = [-281, 532], wD = [-281, 458];
    face(wA, wB, 'tan', { nb: 6 });
    face(wC, wD, 'tan', { nb: 6, groundWin: (i) => i > 0 });
    roofOf([wA, wB, wC, wD], ROOF, TOP, tanP);
    // --- 남단 벽돌 블록 (x -319..-281, z 532..568.5), 지붕 70.5
    const sA = [-319, 532], sB = [-319, 568.5], sC = [-281, 568.5], sD = [-281, 532];
    face(sA, sB, 'brick', { nb: 3, top: TOP_B, upWin: (i) => i !== 1, groundWin: (i) => i !== 1 });
    face(sB, sC, 'blank', { y0: LOWTOP, top: TOP_B });
    face(sC, sD, 'blank', { y0: 26, top: TOP_B });
    face(sD, sA, 'blank', { y0: ROOF, top: TOP_B });
    roofOf([sA, sB, sC, sD], ROOF_B, TOP_B, brick, M.limestone);
    // --- 안뜰 1층 유리 현관 (x -281..-259, z 445..464)
    {
      const a = [-281, 464], b = [-259, 464], c = [-259, 445];
      K.wall(a, b, -1, G0 + 1, [K.win(a, b, 1, 21, 0, 11, { frame: M.dark, muls: [5, 10, 15], rails: [8.2], rev: base })], base);
      K.door(a, b, 7.5, 13.5, 8.0, { inset: 0.25 });
      K.wall(b, c, -1, G0 + 1, [K.win(b, c, 1, 18, 0, 11, { frame: M.dark, muls: [4.25, 8.5, 12.75], rails: [8.2], rev: base })], base);
      roofOf([[-281, 445], a, b, c], G0, G0 + 1, base, M.white);
    }
    vents([[-300, 425], [-300, 440], [-305, 470], [-300, 500], [-300, 525], [-262, 420], [-245, 430], [-225, 425], [-205, 425], [-190, 420]], ROOF);
    K.unit(-300, 432, 8, 10, ROOF_B, 4.5, M.metal);                                      // 벽돌 블록 위 기계 유닛
    K.unit(-300, 550, 8, 10, ROOF_B, 4.5, M.metal);
  }

  // ================================================================ ERICKSON HALL
  {
    const P = [[-232.8, 548.3], [-232.7, 586.5], [-201.2, 586.3], [-109.6, 586.0], [-109.1, 690.0], [-72.3, 689.8], [-72.8, 588.2], [-68.5, 588.2], [-68.7, 547.4]];
    face(P[8], P[0], 'tanE', { nb: 13 });                                                  // 북면
    face(P[0], P[1], 'blank', { y0: 26 });                                                 // 서단 끝벽 (AEC 북블록 위)
    face(P[1], P[2], 'tanE', { y0: LOWTOP, nb: 2 });                                       // 남면 서쪽 (AEC 저층부 위)
    face(P[2], [-132.9, 585.9], 'tanE', { nb: 5 });                                        // 남면 (안뜰)
    face([-132.9, 585.9], [-109.6, 586.0], 'tanE', { y0: G0 + 1, nb: 2 });                 // 라운지 위
    face([-109.6, 586.0], [-109.6, 611.0], 'tanE', { y0: G0 + 1, nb: 2 });
    face([-109.6, 611.0], P[4], 'tanE', { nb: 6 });                                        // 동측 동 서면
    face(P[4], P[5], 'blank');                                                             // 남단 끝벽
    face(P[5], P[6], 'tanE', { nb: 8 });                                                   // 동측 동 동면
    face(P[6], P[7], 'blank');
    face(P[7], P[8], 'blank');                                                             // 북측 동 동단 끝벽
    roofOf(P, ROOF, TOP, tanE);
    // 라운지 (1층, x -132.8..-109.6, z 586..611): 유리 + 출입문 + 캐노피
    {
      const a = [-132.9, 585.9], b = [-132.7, 611.1], c = [-109.6, 611.0];
      K.wall(a, b, -1, G0 + 1, [K.win(a, b, 1, 24, 0, 11, { frame: M.dark, muls: [5.75, 11.5, 17.25], rails: [8.2], rev: base })], base);
      K.wall(b, c, -1, G0 + 1, [K.win(b, c, 1, 22, 0, 11, { frame: M.dark, muls: [5.25, 10.5, 15.75], rails: [8.2], rev: base })], base);
      K.door(b, c, 8.5, 14.5, 8.0, { inset: 0.25 });
      K.wbox(b, c, 6, 17, 10.6, 11.3, 0, 6, M.metal);
      roofOf([a, b, c, [-109.6, 586.0]], G0, G0 + 1, base, M.white);
    }
    vents([[-215, 560], [-190, 562], [-160, 560], [-140, 565], [-115, 560], [-90, 575], [-88, 610], [-88, 640], [-90, 670]], ROOF);
    K.unit(-150, 567, 10, 8, ROOF, 4.5, M.metal); K.unit(-90, 630, 8, 10, ROOF, 4.5, M.metal);
  }

  // ================================================================ BURFORD HALL
  {
    const P = [[-281.4, 845.5], [-148.0, 844.8], [-140.6, 844.8], [-140.7, 809.4], [-207.6, 809.7], [-244.0, 809.9], [-244.6, 687.7], [-282.2, 687.9]];
    const W788 = [-282.0, 788], E788 = [-244.3, 788], S245 = [-244.6, 845.3];
    face(P[7], W788, 'tan', { nb: 8 });                                                    // 서면 EIFS (z 688..788)
    face(W788, P[0], 'brick', { nb: 4 });                                                  // 서면 벽돌 블록
    face(P[0], S245, 'brick', { nb: 3 });                                                  // 남면 벽돌 블록
    face(S245, P[2], 'tan', { nb: 8 });                                                    // 남측 동 남면
    face(P[2], P[3], 'blank');                                                             // 동단 끝벽
    face(P[3], P[5], 'tan', { nb: 8 });                                                    // 남측 동 북면 (안뜰)
    face(P[5], E788, 'brick', { nb: 2 });                                                  // 벽돌 블록 동면 (안뜰)
    // 서측 동 동면 (안뜰): 중앙 출입구 + 캐노피
    {
      const L = Math.hypot(P[6][0] - E788[0], P[6][1] - E788[1]), mid = L / 2;
      K.door(E788, P[6], mid - 4, mid + 4, 8.0, { rev: base });
      face(E788, P[6], 'tan', { nb: 8, groundWin: (i) => i !== 3 && i !== 4, ops0: [{ s: mid - 4, e: mid + 4, b: -1, t: 8.0 }] });
      K.wbox(E788, P[6], mid - 7, mid + 7, 10.4, 11.2, 0, 8, M.metal);
      for (const s of [mid - 6.5, mid + 6.5]) K.wbox(E788, P[6], s - 0.3, s + 0.3, 0, 10.4, 7.2, 7.8, M.metal);
    }
    face(P[6], P[7], 'blank', { y0: LOWTOP });                                             // 북단 끝벽 (AEC 위)
    roofOf(P, ROOF, TOP, tanP);
    vents([[-262, 700], [-262, 730], [-262, 760], [-262, 800], [-262, 830], [-230, 830], [-200, 825], [-170, 830], [-150, 825]], ROOF);
    K.unit(-262, 745, 8, 10, ROOF, 4.5, M.metal); K.unit(-195, 827, 10, 8, ROOF, 4.5, M.metal);
  }

  const grp = new THREE.Group();
  for (const m of G.mergeByMaterial(parts)) grp.add(m);
  return grp;

  /** 모서리 유리 베이 (Pickerl): 벽 개구 s0..s1, 2~6층 커튼월 + 층 스팬드럴(검정) + 상부 캡 */
  function curtain(a, b, s0, s1) {
    const w = s1 - s0, nm = Math.max(2, Math.round(w / 5));
    K.win(a, b, s0, s1, G0, ROOF, { inset: 0.35, frame: M.dark, glass: M.glass, muls: Array.from({ length: nm - 1 }, (_, k) => w * (k + 1) / nm), rails: [], fw: 0.3 });
    for (let f = 0; f <= NUP; f++) { const y = G0 + f * FH; K.skin(a, b, s0, s1, y - 1.1, Math.min(ROOF, y + 1.1), -0.25, M.dark); }
  }
}

// ==== KIT ====
// ---------------------------------------------------------------- 공통 헬퍼 (사진 기반 모듈 공용 사본; lib 수정 금지라 파일마다 복사)
// 벽 p0→p1 은 위에서 봐서 반시계(CCW) 진행 → 진행 방향 오른쪽 = 바깥. s = p0 에서의 거리, o = 바깥쪽 오프셋(+ 바깥, - 안쪽).
function makeKit(M, G, parts) {
  const P = (geom, mat, cast) => { if (geom) parts.push({ geom, mat, cast }); };
  const dir = (p0, p1) => { const dx = p1[0] - p0[0], dz = p1[1] - p0[1], L = Math.hypot(dx, dz); return { ex: [dx / L, dz / L], ez: [-dz / L, dx / L], L, ry: -Math.atan2(dz, dx) }; };
  const at = (p0, d, s, o = 0) => [p0[0] + d.ex[0] * s + d.ez[0] * o, p0[1] + d.ex[1] * s + d.ez[1] * o];
  const Y = (p, y) => [p[0], y, p[1]];
  /** 3D 사각형 (법선이 n 쪽을 향하도록 정렬) */
  function quad(A, B, C, D, n) {
    const u = [B[0] - A[0], B[1] - A[1], B[2] - A[2]], v = [C[0] - A[0], C[1] - A[1], C[2] - A[2]];
    const c = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
    const pts = (c[0] * n[0] + c[1] * n[1] + c[2] * n[2] >= 0) ? [A, B, C, A, C, D] : [A, C, B, A, D, C];
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pts.flat(), 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(pts.map(p => [(p[0] + p[2]) / 24, p[1] / 12]).flat(), 2));
    g.computeVertexNormals();
    return g;
  }
  /** 벽에 붙은 박스: s..e, 높이 b..t, 바깥 오프셋 o0..o1 */
  function wbox(p0, p1, s, e, b, t, o0, o1, mat, cast) {
    const d = dir(p0, p1), c = at(p0, d, (s + e) / 2, (o0 + o1) / 2);
    P(G.box(e - s, t - b, o1 - o0, c[0], b, c[1], { ry: d.ry }), mat, cast);
  }
  /** 벽면 (개구 포함) */
  const wall = (p0, p1, y0, y1, ops, mat) => P(G.wallSeg(p0, p1, y0, y1, { openings: ops || [] }), mat);
  /** 벽면 바깥에 붙인 얇은 면 (띠·필라스터 색 변화용, 두께 없음) */
  function skin(p0, p1, s, e, b, t, o, mat) { const d = dir(p0, p1); P(G.sideGeometry([at(p0, d, s, o), at(p0, d, e, o)], b, t, 1 / 24, 1 / 12, false), mat); }
  /** 창: 안쪽 inset 에 유리 + 프레임 링 + 멀리언/레일 + 4면 리빌(rev 재질) + 선택적 창대 */
  function win(p0, p1, s, e, b, t, o = {}) {
    const { inset = 0.45, fw = 0.22, muls = [], rails = [], frame = M.dark, glass = M.pane, rev = null, sill = null, sillO = 0.3, head = null } = o;
    const d = dir(p0, p1), w = e - s;
    P(G.sideGeometry([at(p0, d, s, -inset), at(p0, d, e, -inset)], b, t, 1 / w, 1 / (t - b), false), glass, false);
    P(G.wallSeg(at(p0, d, s, -inset + 0.05), at(p0, d, e, -inset + 0.05), b, t, { openings: [{ s: fw, e: w - fw, b: b + fw, t: t - fw }] }), frame, false);
    for (const m of muls) P(G.sideGeometry([at(p0, d, s + m - 0.09, -inset + 0.07), at(p0, d, s + m + 0.09, -inset + 0.07)], b, t, 1, 1, false), frame, false);
    for (const y of rails) P(G.sideGeometry([at(p0, d, s, -inset + 0.07), at(p0, d, e, -inset + 0.07)], y - 0.09, y + 0.09, 1, 1, false), frame, false);
    if (rev) {
      const s0 = at(p0, d, s, 0), s1 = at(p0, d, s, -inset), e0 = at(p0, d, e, 0), e1 = at(p0, d, e, -inset);
      P(quad(Y(s0, b), Y(s1, b), Y(s1, t), Y(s0, t), [d.ex[0], 0, d.ex[1]]), rev, false);
      P(quad(Y(e0, b), Y(e1, b), Y(e1, t), Y(e0, t), [-d.ex[0], 0, -d.ex[1]]), rev, false);
      P(quad(Y(s0, t), Y(e0, t), Y(e1, t), Y(s1, t), [0, -1, 0]), rev, false);
      P(quad(Y(s0, b), Y(e0, b), Y(e1, b), Y(s1, b), [0, 1, 0]), rev, false);
    }
    if (sill) wbox(p0, p1, s - 0.2, e + 0.2, b - 0.3, b, -0.05, sillO, sill, false);
    if (head) wbox(p0, p1, s - 0.3, e + 0.3, t, t + 0.6, -0.05, 0.12, head, false);
    return { s, e, b, t };
  }
  /** 문: 어두운 문짝 + 유리(상부) */
  function door(p0, p1, s, e, h, o = {}) {
    const { inset = 0.6, leaves = 2, glassTop = true, frame = M.dark, rev = null } = o;
    const d = dir(p0, p1), w = e - s;
    const op = win(p0, p1, s, e, 0, h, { inset, frame, rev, muls: leaves > 1 ? [w / 2] : [], rails: glassTop ? [] : [] });
    // 문짝 하부 킥플레이트
    P(G.sideGeometry([at(p0, d, s, -inset + 0.08), at(p0, d, e, -inset + 0.08)], 0, 1.0, 1, 1, false), frame, false);
    return op;
  }
  /** 수평 캡 (위 또는 아래 향함) */
  function cap(poly, y, mat, down = false) {
    const g = G.capGeometry(poly, [], y);
    if (down) { const ix = g.index.array; for (let i = 0; i < ix.length; i += 3) { const t = ix[i + 1]; ix[i + 1] = ix[i + 2]; ix[i + 2] = t; } g.computeVertexNormals(); }
    P(g, mat, !down);
  }
  /** 평지붕: 지붕면 + 파라펫(안쪽 면·윗면) + 갓돌. 바깥 벽은 호출자가 yTop 까지 세운다 */
  function roof(poly, y, yTop, { mat = M.roof_membrane, par = M.brick_red, cope = M.limestone, copeW = 1.3 } = {}) {
    cap(poly, y, mat);
    const n = poly.length;
    for (let i = 0; i < n; i++) {
      const a = poly[i], b = poly[(i + 1) % n];
      if (yTop - y > 0.3) wbox(a, b, 0.6, Math.hypot(b[0] - a[0], b[1] - a[1]) - 0.6, y, yTop - 0.3, -1.0, -0.05, par);
      wbox(a, b, -0.15, Math.hypot(b[0] - a[0], b[1] - a[1]) + 0.15, yTop - 0.3, yTop, -copeW + 0.15, 0.15, cope);
    }
  }
  /** 옥상 기계실/유닛 박스 */
  const unit = (x, z, w, d, y, h, mat = M.metal, ry = 0) => P(G.box(w, h, d, x, y, z, { ry }), mat);
  /** 균등 베이: 길이 L 을 n 등분했을 때 각 베이 중심 */
  const centers = (L, n, m0 = 0, m1 = 0) => { const p = (L - m0 - m1) / n; return Array.from({ length: n }, (_, i) => m0 + p * (i + 0.5)); };
  return { P, dir, at, Y, quad, wbox, wall, skin, win, door, cap, roof, unit, centers };
}
