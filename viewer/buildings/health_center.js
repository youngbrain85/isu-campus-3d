// Student Health Center / Sycamore Center for Wellness (Ewing Miller, 1971) — 사진·위성 기반
// 근거: Street View vp43 (5th St 서측, 동북동을 봄 → 서측 입면/주출입구), vp44 (북서측에서 남남동을 봄 → 북·서측 매스),
//       Esri z20 (겨울, 그림자 북북동) / z19 (여름) 위성. 현재 입구 표지판은 "College of Health and Human Services".
// 층수: 사진상 지상 3개 레벨 (1층 = 후퇴한 암색 유리 + 상부 2개 층 세로 슬롯창). 자료(building_facts)는 2층이라 되어 있으나
//       사진 비례(창 높이 : 층고)로 3레벨 36 ft 로 모델링. 층고: 1층 13 ft (후퇴 유리 0..10, 콘크리트 띠 10..13), 2층 13..24.5, 3층 24.5..33, 파라펫 33..36.
// 재질: 적갈색 혼합 벽돌(brick_red, 짙은 헤더 섞임) 매스 + 회색 노출 콘크리트(concrete) 매스가 번갈아 맞물리는 1970 년대 브루탈리즘.
//   - 서측 입면 남쪽 85 ft (x=-317.5, z -764..-679): 콘크리트 판 + 돌출 핀 4개 + 핀 옆 세로 슬롯창(4 ft, 2·3층), 1층은 6 ft 후퇴한
//     암색 유리 커튼월 (북단 z≈-752..-745 에 유리 쌍문 주출입구), 남서 모서리 벽돌 피어 (vp43_117).
//   - 서측 1층 벽돌 블록 [W] (x -349..-317.5, z -816..-764): 14 ft, 회색 프리캐스트 갓돌, 무창, 북면에 출입문 (vp43_072, vp44_158).
//   - [W] 뒤 본동 서면 (z -808..-764) 은 무창 벽돌 (vp43_072), 북서 돌출 벽돌 매스 (x -317.5..-309.5).
//   - 북서부 서면 (x=-309.5, z -855..-808): 콘크리트 판 + 핀 + 슬롯창 2개 (vp44_113), 북면은 벽돌 + 끝단 세로 유리 슬롯.
//   - 북측 돌출부 (x -287.5..-257.4, z -868..-855): 본동과 같은 높이 (위성 파라펫 연속).
// 볼륨 (위성 판독): 본동 36 ft / 동측 저층 윙 [E1] (x -257..-237, z -855..-813) 과 [E2] (x -265..-237, z -765..-679) 16 ft
//   (겨울 영상에서 본동 그림자가 윙 지붕 전체를 덮음) / 동측 중간부 (z -813..-765) 는 본동 높이 (밝은 지붕·파라펫) /
//   지붕 L 자형 콘크리트 펜트하우스 (+9 ft) / 남측 현관 돌출부 (x -313..-284, z -679..-673) 12 ft.
// 가정 (사진 없음): 동면·남면 전체, 동측 윙의 창 (벽돌 + 펀치창 가정), 남측 현관 (유리 + 콘크리트 캐노피 가정), 지붕 설비 위치는 위성.
import * as THREE from 'three';

export const meta = {
  id: 'health', name: 'Student Health Center (Sycamore Center for Wellness)', osm: 'way/545265769',
  anchor: [0, 0], rotation: 0, height: 45,
  preset: { pos: [-640, 170, -960], tgt: [-285, 15, -770] },
  sheets: 'Street View (vp43 5th St, vp44), Esri imagery z20/z19',
};

// ---- 공통 헬퍼 -------------------------------------------------------------------------------
const rect = (x0, x1, z0, z1) => [[x0, z1], [x1, z1], [x1, z0], [x0, z0]];   // CCW (위에서): 남서→남동→북동→북서
/** 벽 프레임: p0→p1 (CCW 진행), 바깥 법선 n. at(s, o) = 벽 시작점에서 s, 바깥으로 o 떨어진 점 */
function frame(p0, p1) {
  const dx = p1[0] - p0[0], dz = p1[1] - p0[1], len = Math.hypot(dx, dz);
  const ex = [dx / len, dz / len], n = [-dz / len, dx / len];
  return { p0, p1, len, ry: -Math.atan2(dz, dx), at: (s, o = 0) => [p0[0] + ex[0] * s + n[0] * o, p0[1] + ex[1] * s + n[1] * o] };
}
/** 벽면 기준 박스: 벽 방향 s0..s1, 높이 y0..y1, 바깥 오프셋 o0..o1 */
function wbox(parts, F, s0, s1, y0, y1, o0, o1, mat, G, cast = true) {
  const c = F.at((s0 + s1) / 2, (o0 + o1) / 2);
  parts.push({ geom: G.box(s1 - s0, y1 - y0, o1 - o0, c[0], y0, c[1], { ry: F.ry }), mat, cast });
}
/** 개구부가 있는 벽 + 후퇴 유리 + 측벽(jamb). ops = [{s,e,b,t, glass?:mat, inset?}] */
function wallOps(parts, F, y0, y1, ops, mat, M, G, { inset = 0.8 } = {}) {
  parts.push({ geom: G.wallSeg(F.p0, F.p1, y0, y1, { openings: ops }), mat });
  for (const o of ops) {
    const d = o.inset ?? inset;
    const q0 = F.at(o.s, -d), q1 = F.at(o.e, -d);
    parts.push({ geom: G.sideGeometry([q0, q1], o.b, o.t, 1 / 8, 1 / 8, false), mat: o.glass || M.pane, cast: false });
    wbox(parts, F, o.s, o.s + 0.2, o.b, o.t, -d, 0, mat, G); wbox(parts, F, o.e - 0.2, o.e, o.b, o.t, -d, 0, mat, G);
    wbox(parts, F, o.s, o.e, o.t - 0.2, o.t, -d, 0, mat, G); wbox(parts, F, o.s, o.e, o.b, o.b + 0.2, -d, 0, mat, G);
  }
}
function plain(parts, F, y0, y1, mat, G) { parts.push({ geom: G.sideGeometry([F.p0, F.p1], y0, y1, 1 / 24, 1 / 12, false), mat }); }
function roofOf(parts, poly, y, M, G, { mat, parapet = 1.5, cap } = {}) {
  const r = G.flatRoof(poly, y, { parapet, thick: 0.6 });
  parts.push({ geom: r.slab, mat: mat || M.roof_gravel });
  if (r.parapet) parts.push({ geom: r.parapet, mat: cap || M.trim });
}
/** 폴리곤 둘레에 갓돌(코핑) 띠: 벽 바깥으로 out 돌출, 높이 h */
function coping(parts, poly, y, h, out, mat, G, skip = []) {
  for (let i = 0; i < poly.length; i++) {
    if (skip.includes(i)) continue;
    const F = frame(poly[i], poly[(i + 1) % poly.length]);
    wbox(parts, F, -out, F.len + out, y, y + h, -1.0, out, mat, G);
  }
}

// 층 레벨
const L1 = 13, L2W0 = 13.0, L2W1 = 22.0, L3W0 = 24.5, L3W1 = 33.0, TOP = 36;
/** 콘크리트 슬롯창 베이: 2·3층 창 + 그 사이 암색 스팬드럴 (같은 개구 안) */
function slotOps(s, w, M) {
  return [{ s, e: s + w, b: L2W0, t: L3W1, glass: M.pane, inset: 1.5 }];
}
function slotSpandrel(parts, F, s, w, M, G, conc) {   // 슬롯 안 층간 콘크리트 스팬드럴 + 멀리언 (폭 5 ft 이상이면 중앙 멀리언)
  wbox(parts, F, s, s + w, L2W1, L3W0, -1.5, 0, conc || M.concrete, G);
  for (const t of (w >= 5 ? [w / 2] : [])) wbox(parts, F, s + t - 0.2, s + t + 0.2, L2W0, L3W1, -1.4, -1.1, M.dark, G, false);
  for (const y of [L2W0 + 3.0, L3W0 + 3.0]) wbox(parts, F, s, s + w, y, y + 0.2, -1.4, -1.2, M.dark, G, false);   // 하부 고정창 레일
}
/** 콘크리트 판 사이 세로 줄눈 */
function joints(parts, F, list, y0, y1, M, G) { for (const s of list) wbox(parts, F, s - 0.1, s + 0.1, y0, y1, -0.05, 0.03, M.dark, G, false); }

export function build(M, G) {
  const parts = [];
  const brick = M.brick_red;
  // 사진의 노출 콘크리트는 공용 concrete 텍스처보다 한 톤 어두운 회색 → 같은 텍스처에 색 곱 (모듈 전용 재질)
  const conc = M.concrete.clone(); conc.color.setRGB(0.70, 0.70, 0.68); conc.name = 'concrete_hc';

  // ================= [W] 서측 1층 벽돌 블록 (14 ft, 무창, 회색 갓돌) =================
  {
    const W = [[-348.9, -764.4], [-317.5, -764.4], [-317.5, -803.3], [-321.6, -803.3], [-321.6, -816.1], [-348.9, -816.1]];
    const H = 14;
    for (let i = 0; i < W.length; i++) {
      if (i === 1) continue;                                   // 동면은 본동과 맞닿음
      const F = frame(W[i], W[(i + 1) % W.length]);
      if (i === 4) {                                           // 북면 (z=-816.1, x -321.6 → -348.9): 유리 출입문 + 사이드라이트
        wallOps(parts, F, 0, H, [{ s: 10, e: 17, b: 0, t: 8.5, glass: M.glass, inset: 0.6 }], brick, M, G);
        wbox(parts, F, 13.4, 13.6, 0, 8.5, -0.5, -0.3, M.dark, G, false);
        wbox(parts, F, 9.5, 17.5, 8.5, 9.2, 0, 2.5, M.precast, G);                 // 문 위 작은 캐노피
        wbox(parts, F, 6, 21, -0.4, 0.2, 0, 6, M.walk, G, false);                  // 출입 패드
      } else plain(parts, F, 0, H, brick, G);
    }
    roofOf(parts, W, H, M, G, { parapet: 0.8 });
    coping(parts, W, H - 0.1, 0.9, 0.35, M.precast, G, [1]);
    // 서면 벽부 조명 + 환기구 (vp43_072)
    const Fs = frame(W[0], W[1]);
    wbox(parts, Fs, 25.5, 26.3, 9.5, 10.3, 0, 0.6, M.dark, G);
    for (const [x, z] of [[-338, -783], [-333, -783], [-328, -783]]) parts.push({ geom: G.box(3, 2.5, 3, x, H, z), mat: M.metal });
  }

  // ================= [M] 본동 (36 ft) =================
  const Mp = [[-317.5, -807.8], [-317.5, -679.2], [-265, -679.2], [-265, -765], [-236.7, -765], [-236.7, -813], [-257.4, -813],
    [-257.4, -867.9], [-287.5, -867.9], [-287.5, -854.7], [-309.5, -854.7], [-309.5, -807.8]];
  roofOf(parts, Mp, TOP, M, G, { parapet: 1.2, mat: M.roof_gravel });
  coping(parts, Mp, TOP - 0.2, 0.8, 0.3, M.precast, G);

  // --- 서측 주입면 (x=-317.5, z -764.4 → -679.2): 콘크리트 + 핀 + 슬롯 + 후퇴 1층 유리 ---
  {
    const F = frame([-317.5, -764.4], [-317.5, -679.2]);   // len 85.2, 바깥 = 서
    const slots = [[3.0, 3.6], [24.0, 6.4], [45.5, 6.4], [66.0, 6.4]];   // [슬롯 시작, 폭]: 북단 1열, 나머지 2열 창 (vp43_117), 슬롯 북쪽에 핀
    const ops = slots.flatMap(([s, w]) => slotOps(s, w, M));
    wallOps(parts, F, 10, TOP, ops, conc, M, G);
    for (const [s, w] of slots) {
      slotSpandrel(parts, F, s, w, M, G, conc);
      wbox(parts, F, s - 2.2, s, 0, TOP + 0.6, 0, 1.6, conc, G);            // 돌출 핀 (바닥까지 = 1층 기둥)
    }
    joints(parts, F, [15.5, 37.5, 59, 77.5], 10, TOP, M, G);
    wbox(parts, F, 83.2, 85.2, 0, TOP + 0.6, 0, 1.6, brick, G);              // 남서 모서리 벽돌 피어
    wbox(parts, F, 0, F.len, 9.6, 10.2, -0.2, 0.25, conc, G);               // 1층 상부 띠 하단 물끊기
    // 1층 후퇴 유리벽 (6 ft 안쪽) + 멀리언 + 주출입구
    const Fi = frame(F.at(0, -6), F.at(F.len, -6));
    parts.push({ geom: G.sideGeometry([Fi.p0, Fi.p1], 0, 10, 1 / 6, 1 / 10, false), mat: M.glass, cast: false });
    for (let s = 2; s < F.len; s += 5) wbox(parts, Fi, s - 0.15, s + 0.15, 0, 10, 0, 0.3, M.dark, G, false);
    wbox(parts, Fi, 0, F.len, 7.6, 7.9, 0, 0.3, M.dark, G, false);           // 트랜섬 바
    wbox(parts, Fi, 12, 19, 0, 7.6, 0, 0.4, M.dark, G, false);              // 출입문 프레임(암색)
    wbox(parts, Fi, 12.3, 18.7, 0.3, 7.3, 0.2, 0.5, M.glass, G, false);
    wbox(parts, F, 0, F.len, 9.6, 10, -6, 0, conc, G);                        // 후퇴부 소핏 (아래에서 보임)
    // 후퇴부 측벽 (북·남 끝)
    wbox(parts, F, -0.5, 0, 0, 10, -6, 0, conc, G); wbox(parts, F, F.len - 2, F.len, 0, 10, -6, 0, brick, G);
    // 입구 앞 포장 + 낮은 화단 턱
    wbox(parts, F, 8, 23, -0.4, 0.15, 0, 20, M.walk, G, false);
    wbox(parts, F, 24, 80, 0, 1.2, 0.5, 5.5, M.concrete, G);
  }
  // --- 본동 서면 북쪽 (x=-317.5, z -807.8 → -764.4): 무창 벽돌 ([W] 위로 노출) ---
  plain(parts, frame([-317.5, -807.8], [-317.5, -764.4]), 0, TOP, brick, G);
  // --- 북서 돌출 벽돌 매스의 북면 (z=-807.8, x -309.5 → -317.5) ---
  plain(parts, frame([-309.5, -807.8], [-317.5, -807.8]), 0, TOP, brick, G);
  // --- 북서부 서면 (x=-309.5, z -854.7 → -807.8): 콘크리트 + 핀 + 슬롯 2 (vp44_113) ---
  {
    const F = frame([-309.5, -854.7], [-309.5, -807.8]);   // len 46.9, 바깥 = 서
    const slots = [2.5, 25.0];
    wallOps(parts, F, 0, TOP, slots.flatMap(s => slotOps(s, 4.0, M)), conc, M, G);
    for (const s of slots) slotSpandrel(parts, F, s, 4.0, M, G, conc);
    wbox(parts, F, -0.5, 2.5, 0, TOP + 0.6, 0, 1.6, conc, G);               // 북서 모서리 핀 (가장 높아 보이는 모서리)
    wbox(parts, F, 22.5, 25.0, 0, TOP + 0.6, 0, 1.6, conc, G);
    wbox(parts, F, 6.5, 22.5, 0, 0.6, 0, 0.6, conc, G);                       // 기단 걸레받이
    wbox(parts, F, 31, 37, 0, 8.2, -0.4, 0.05, M.dark, G, false);             // 1층 측문 (금속문)
  }
  // --- 북면 (z=-854.7, x -287.5 → -309.5): 벽돌 + 끝단 세로 유리 슬롯 ---
  {
    const F = frame([-287.5, -854.7], [-309.5, -854.7]);   // len 22, 바깥 = 북
    wallOps(parts, F, 0, TOP, [{ s: 3.0, e: 6.0, b: 3, t: L3W1, glass: M.pane, inset: 1.0 }], brick, M, G);
    wbox(parts, F, 3.0, 6.0, L2W1 - 9.5, L2W1 - 8.5, -0.9, -0.7, M.dark, G, false);
    wbox(parts, F, 3.0, 6.0, L2W1, L3W0, -0.9, -0.7, M.dark, G, false);
  }
  // --- 북측 돌출부 서면 (x=-287.5, z -867.9 → -854.7): 콘크리트 + 슬롯 ---
  {
    const F = frame([-287.5, -867.9], [-287.5, -854.7]);
    wallOps(parts, F, 0, TOP, slotOps(7.5, 4.0, M), conc, M, G);
    slotSpandrel(parts, F, 7.5, 4.0, M, G, conc);
    wbox(parts, F, -0.5, 1.8, 0, TOP + 0.6, 0, 1.6, conc, G);
  }
  // --- 북측 돌출부 북면 (z=-867.9, x -257.4 → -287.5): 벽돌 + 슬롯 2 (2·3층) + 1층 출입문 ---
  {
    const F = frame([-257.4, -867.9], [-287.5, -867.9]);   // len 30.1, 바깥 = 북
    const ops = [{ s: 4, e: 8, b: L2W0, t: L3W1, glass: M.pane, inset: 1.0 }, { s: 22, e: 26, b: L2W0, t: L3W1, glass: M.pane, inset: 1.0 },
      { s: 12, e: 18, b: 0, t: 8.5, glass: M.glass, inset: 0.8 }];
    wallOps(parts, F, 0, TOP, ops, brick, M, G);
    for (const s of [4, 22]) wbox(parts, F, s, s + 4, L2W1, L3W0, -0.9, -0.7, M.dark, G, false);
    wbox(parts, F, 11, 19, 8.5, 9.3, 0, 4, M.concrete, G);                    // 출입 캐노피
    wbox(parts, F, 9, 21, -0.4, 0.15, 0, 8, M.walk, G, false);
  }
  // --- 동측 면들 (사진 없음 → 벽돌 + 슬롯창 가정) ---
  {
    // 북측 돌출부 동면 (x=-257.4, z -813 → -867.9): [E1] 위 16..36 노출, 북쪽 끝 13 ft 는 지상부터
    const F = frame([-257.4, -813], [-257.4, -867.9]);     // len 54.9, 바깥 = 동
    wallOps(parts, F, 0, TOP, [{ s: 47, e: 51, b: L2W0, t: L3W1, inset: 1.0 }, { s: 20, e: 24, b: 18, t: L3W1, inset: 1.0 }], brick, M, G);
    // 동측 중간부 (z -813..-765) 의 북면 / 동면 / 남면
    plain(parts, frame([-236.7, -813], [-257.4, -813]), 16, TOP, brick, G);
    const Fe = frame([-236.7, -765], [-236.7, -813]);       // len 48, 바깥 = 동
    const ops = [];
    for (const s of [6, 18, 30, 42]) ops.push({ s: s - 2, e: s + 2, b: L2W0, t: L3W1, inset: 1.0 }, { s: s - 2, e: s + 2, b: 3, t: 10, inset: 1.0 });
    wallOps(parts, Fe, 0, TOP, ops, brick, M, G);
    for (const s of [6, 18, 30, 42]) wbox(parts, Fe, s - 2, s + 2, L2W1, L3W0, -0.9, -0.7, M.dark, G, false);
    plain(parts, frame([-265, -765], [-236.7, -765]), 16, TOP, brick, G);
    // 남측부 동면 (x=-265, z -679.2 → -765): [E2] 위 16..36
    const Fs = frame([-265, -679.2], [-265, -765]);         // len 85.8
    const ops2 = [];
    for (let s = 8; s < 82; s += 14) ops2.push({ s, e: s + 4, b: 18, t: L3W1, inset: 1.0 });
    wallOps(parts, Fs, 16, TOP, ops2, conc, M, G);
    for (let s = 8; s < 82; s += 14) wbox(parts, Fs, s, s + 4, L2W1, L3W0, -0.9, -0.7, M.dark, G, false);
  }
  // --- 남면 (z=-679.2, x -317.5 → -265): 벽돌 + 콘크리트 슬롯 (가정) ---
  {
    const F = frame([-317.5, -679.2], [-265, -679.2]);     // len 52.5, 바깥 = 남
    const slots = [10, 26, 42];
    wallOps(parts, F, 0, TOP, slots.flatMap(s => slotOps(s, 4.0, M)), brick, M, G);
    for (const s of slots) { slotSpandrel(parts, F, s, 4.0, M, G, conc); wbox(parts, F, s - 1.2, s + 5.2, 0, TOP + 0.6, 0, 0.5, conc, G); }
  }

  // ================= [V] 남측 현관 돌출부 (12 ft, 유리 + 콘크리트 캐노피 가정) =================
  {
    const V = rect(-312.7, -283.8, -679.2, -673.3);
    const Fs = frame(V[0], V[1]);                            // 남면
    parts.push({ geom: G.sideGeometry([V[0], V[1]], 0, 10, 1 / 6, 1 / 10, false), mat: M.glass, cast: false });
    for (let s = 0; s <= Fs.len + 0.01; s += Fs.len / 6) wbox(parts, Fs, s - 0.15, s + 0.15, 0, 10, 0, 0.3, M.dark, G, false);
    plain(parts, frame(V[1], V[2]), 0, 10, conc, G); plain(parts, frame(V[3], V[0]), 0, 10, conc, G);
    parts.push({ geom: G.box(33, 2, 9, -298.25, 10, -675.5), mat: conc });                // 캐노피 슬래브(돌출)
    parts.push({ geom: G.capGeometry(rect(-316, -280, -673.3, -662), [], 0.15, 1 / 8), mat: M.walk, cast: false });
  }

  // ================= [E1] [E2] 동측 1층 윙 (16 ft, 벽돌 + 펀치창 가정) =================
  for (const [poly, skip] of [[rect(-257.4, -236.7, -854.7, -813), [0, 3]], [rect(-265, -236.7, -765, -679.2), [2, 3]]]) {
    for (let i = 0; i < 4; i++) {
      if (skip.includes(i)) continue;
      const F = frame(poly[i], poly[(i + 1) % 4]);
      const ops = [];
      const n = Math.floor((F.len - 6) / 10);
      for (let k = 0; k < n; k++) { const s = 3 + (F.len - 6) * (k + 0.5) / n - 2.5; ops.push({ s, e: s + 5, b: 3.5, t: 10, inset: 0.6 }); }
      wallOps(parts, F, 0, 16, ops, brick, M, G);
    }
    roofOf(parts, poly, 16, M, G, { parapet: 1.0, mat: M.roof_gravel });
    coping(parts, poly, 15.9, 0.7, 0.3, M.precast, G, skip);
  }
  // 윙 지붕 천창 (위성의 밝은 점)
  for (const [x, z] of [[-247, -845], [-247, -828], [-251, -750], [-251, -730], [-251, -710], [-251, -692]]) parts.push({ geom: G.box(4, 1.2, 4, x, 16, z), mat: M.glass, cast: false });

  // ================= 지붕: L 자 콘크리트 펜트하우스 + 설비 =================
  {
    const P = [[-289.6, -788], [-278.3, -788], [-278.3, -774], [-268, -774], [-268, -806.5], [-289.6, -806.5]];
    for (let i = 0; i < P.length; i++) plain(parts, frame(P[i], P[(i + 1) % P.length]), TOP, TOP + 9, conc, G);
    roofOf(parts, P, TOP + 9, M, G, { parapet: 0.6, mat: M.roof_membrane, cap: M.precast });
    // 루버 (펜트하우스 남·서면)
    const Fl = frame(P[0], P[1]);
    for (let s = 1; s < Fl.len - 1; s += 0.9) wbox(parts, Fl, s, s + 0.25, TOP + 2, TOP + 7, 0, 0.3, M.dark, G, false);
  }
  parts.push({ geom: G.box(9.5, 4.5, 6, -267, TOP, -840), mat: M.metal });                       // 북측 설비
  for (const [x, z] of [[-290, -843], [-290, -828], [-298, -760], [-292, -738], [-298, -712], [-284, -708], [-299, -838], [-275, -759]])
    parts.push({ geom: G.box(2.5, 2.5, 2.5, x, TOP, z), mat: M.metal });                          // 배기 벤트
  for (const [x, z] of [[-305, -742], [-300, -742]]) parts.push({ geom: G.box(4, 3, 4, x, TOP, z), mat: M.metal });

  const grp = new THREE.Group();
  for (const m of G.mergeByMaterial(parts)) grp.add(m);
  return grp;
}
