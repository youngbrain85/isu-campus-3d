// New Theater (1979) — 사진·위성 기반
// 근거: Street View vp37 (N 7th St, (810,-824) 에서 서쪽을 봄 → 동측 주출입면, 약 190–250 ft), Esri z20(겨울)/z19(여름).
//   (vp38 사진은 위치가 어긋나 이 건물이 보이지 않음 — Rec Center/Reeve Hall 이 찍힘.)
// 판독:
//   - 객석동 [A] (x 488.5..610.6, z -863..-778.3): 백색 금속 "둥근 힙" 지붕 — 처마 18 ft 에서 둥근 어깨로 올라가 평탄한 정상부 (27 ft).
//     z19 위성에서 정상 평탄부 경계선 x≈509/589, z≈-858/-800 → 사방 약 21 ft 폭의 곡면 경사. 사진 vp37_272 의 둥근 실루엣과 일치.
//     벽: 회색 노출 콘크리트. 동면은 상부 7 ft 콘크리트 파시아 띠(11..18) 아래로 로비 유리면이 6 ft 후퇴(사진의 어두운 하부), 기둥 열.
//   - 동측 출입 돌출부 [E] (x 610.6..621.9, z -843.2..-815.2): 평지붕 18 ft, 상부 흰색 사인 밴드("Theater" 청색 글자), 그 아래
//     콘크리트 피어 3개 사이 유리 쌍문 2 조 (vp37_272/227).
//   - 북측 후면동 [B] (x 488.6..610.2, z -888.9..-863): 평지붕(회갈색 자갈), 위성에서 다른 지붕재·경계선. 겨울 그림자 길이(약 14 ft)
//     가 객석 처마보다 짧은 높이를 시사 → 16 ft. 무대 상부 플라이 타워는 위성 그림자·지붕 어디에도 보이지 않음 → 없음으로 모델링
//     (building_facts 의 "fly tower" 는 추정 메모였음).
//   - 북측 설비 마당 (x 558..612, z -912..-889): 8 ft 스크린 벽 + 실외기 (위성), 북동 모서리 모따기.
//   - 지붕 설비: 객석 정상부 원형 환기구 2 + 박스 1 (위성 z≈-835).
// 가정: 서·남면, 후면동의 문/개구부는 사진 없음 → 콘크리트 벽 + 출입문 몇 개.
import * as THREE from 'three';

export const meta = {
  id: 'theater', name: 'New Theater', osm: 'way/544686558',
  anchor: [0, 0], rotation: 0, height: 27,
  preset: { pos: [880, 150, -990], tgt: [552, 12, -834] },
  sheets: 'Street View (vp37 N 7th St), Esri imagery z20/z19',
};

const rect = (x0, x1, z0, z1) => [[x0, z1], [x1, z1], [x1, z0], [x0, z0]];   // CCW (위에서): 남서, 남동, 북동, 북서
function frame(p0, p1) {
  const dx = p1[0] - p0[0], dz = p1[1] - p0[1], len = Math.hypot(dx, dz);
  const ex = [dx / len, dz / len], n = [-dz / len, dx / len];
  return { p0, p1, len, ry: -Math.atan2(dz, dx), at: (s, o = 0) => [p0[0] + ex[0] * s + n[0] * o, p0[1] + ex[1] * s + n[1] * o] };
}
function wbox(parts, F, s0, s1, y0, y1, o0, o1, mat, G, cast = true) {
  const c = F.at((s0 + s1) / 2, (o0 + o1) / 2);
  parts.push({ geom: G.box(s1 - s0, y1 - y0, o1 - o0, c[0], y0, c[1], { ry: F.ry }), mat, cast });
}
function wallOps(parts, F, y0, y1, ops, mat, M, G, { inset = 0.5 } = {}) {
  parts.push({ geom: G.wallSeg(F.p0, F.p1, y0, y1, { openings: ops }), mat });
  for (const o of ops) {
    const d = o.inset ?? inset;
    parts.push({ geom: G.sideGeometry([F.at(o.s, -d), F.at(o.e, -d)], o.b, o.t, 1 / 8, 1 / 8, false), mat: o.glass || M.dark, cast: false });
    wbox(parts, F, o.s, o.s + 0.2, o.b, o.t, -d, 0, mat, G); wbox(parts, F, o.e - 0.2, o.e, o.b, o.t, -d, 0, mat, G);
    wbox(parts, F, o.s, o.e, o.t - 0.2, o.t, -d, 0, mat, G);
  }
}
/** 둥근 어깨 힙 지붕 (평탄 정상부 포함) 높이장. 벽 외곽 + 돌출 ov, 경사 폭 w (사방). 반환 {top, under} */
function roundHip(x0, x1, z0, z1, eave, rise, w, ov) {
  const xa = x0 - ov, xb = x1 + ov, za = z0 - ov, zb = z1 + ov, W = w + ov;
  const side = (a, b) => {   // 경사부는 촘촘히, 정상부는 한 칸
    const out = []; const N = 7;
    for (let i = 0; i <= N; i++) out.push(a + W * (i / N) ** 0.75);
    for (let i = N; i >= 0; i--) out.push(b - W * (i / N) ** 0.75);
    return out;
  };
  const xs = side(xa, xb), zs = side(za, zb);
  const H = (x, z) => {
    const tx = Math.max(0, Math.max(xa + W - x, x - (xb - W)) / W), tz = Math.max(0, Math.max(za + W - z, z - (zb - W)) / W);
    const t = Math.min(1, Math.max(tx, tz));
    return eave - 0.3 + rise * Math.pow(1 - t * t, 0.55);
  };
  const pos = [], uv = [];
  for (let i = 0; i < xs.length - 1; i++) for (let k = 0; k < zs.length - 1; k++) {
    const P = (a, b) => [xs[a], H(xs[a], zs[b]), zs[b]];
    const A = P(i, k), B = P(i + 1, k), C = P(i + 1, k + 1), D = P(i, k + 1);
    pos.push(...A, ...D, ...C, ...A, ...C, ...B);
    for (const q of [A, D, C, A, C, B]) uv.push(q[0] / 3, q[2] / 24);       // 세로 방향 줄(심) 느낌
  }
  const mk = p => { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.computeVertexNormals(); return g; };
  const pu = [];
  for (let i = 0; i < pos.length; i += 9) pu.push(pos[i], pos[i + 1] - 0.3, pos[i + 2], pos[i + 6], pos[i + 7] - 0.3, pos[i + 8], pos[i + 3], pos[i + 4] - 0.3, pos[i + 5]);
  return { top: mk(pos), under: mk(pu), H };
}

export function build(M, G) {
  const parts = [];
  const conc = M.concrete.clone(); conc.color.setRGB(0.78, 0.78, 0.77); conc.name = 'concrete_theater';   // 사진의 중간 회색 콘크리트

  // ================= [A] 객석동 =================
  const AX0 = 488.5, AX1 = 610.6, AZ0 = -863, AZ1 = -778.3, EAVE = 18, RISE = 9;
  const A = rect(AX0, AX1, AZ0, AZ1);
  {
    const r = roundHip(AX0, AX1, AZ0, AZ1, EAVE, RISE, 21, 1.5);
    parts.push({ geom: r.top, mat: M.roof_membrane });
    parts.push({ geom: r.under, mat: M.metal, cast: false });
    // 처마 파시아 (흰 금속 띠)
    for (const [F, s0, s1] of [[frame(A[0], A[1]), -1.5, AX1 - AX0 + 1.5], [frame(A[1], A[2]), -1.5, AZ1 - AZ0 + 1.5], [frame(A[3], A[0]), -1.5, AZ1 - AZ0 + 1.5]])
      wbox(parts, F, s0, s1, EAVE - 0.9, EAVE - 0.1, 1.2, 1.6, M.trim, G);
    // 정상부 설비
    parts.push({ geom: G.cylinder(1.6, 2.5, 520, EAVE + RISE - 0.5, -836, 12), mat: M.metal });
    parts.push({ geom: G.cylinder(3.0, 3.0, 537, EAVE + RISE - 0.5, -836, 14), mat: M.metal });
    parts.push({ geom: G.box(6, 4, 8, 577, EAVE + RISE - 0.5, -836), mat: M.metal });
  }
  // 북면 (z=AZ0): 후면동 지붕(16) 위로 2 ft 노출
  parts.push({ geom: G.sideGeometry([A[2], A[3]], 0, EAVE, 1 / 24, 1 / 12, false), mat: conc });
  // 남면 (z=AZ1, x 488.5 → 610.6): 콘크리트, 비상구 2 (가정)
  {
    const F = frame(A[0], A[1]);
    wallOps(parts, F, 0, EAVE, [{ s: 20, e: 26, b: 0, t: 7.5, inset: 0.4 }, { s: 96, e: 102, b: 0, t: 7.5, inset: 0.4 }], conc, M, G);
    for (const s of [20, 96]) { wbox(parts, F, s - 1, s + 7, 7.5, 8.2, 0, 3.5, conc, G); wbox(parts, F, s - 2, s + 8, -0.4, 0.15, 0, 6, M.walk, G, false); }
    wbox(parts, F, 0, F.len, 11, 11.4, 0, 0.3, conc, G);                        // 파시아 하단선 (동면과 연속)
  }
  // 서면 (x=AX0, z AZ0 → AZ1): 콘크리트, 비상구 1 (가정)
  {
    const F = frame(A[3], A[0]);
    wallOps(parts, F, 0, EAVE, [{ s: 40, e: 46, b: 0, t: 7.5, inset: 0.4 }], conc, M, G);
    wbox(parts, F, 39, 47, 7.5, 8.2, 0, 3.5, conc, G);
    wbox(parts, F, 0, F.len, 11, 11.4, 0, 0.3, conc, G);
  }
  // 동면 (x=AX1): 상부 파시아(11..18) + 6 ft 후퇴 로비 유리 + 기둥 — 출입 돌출부 [E] 남·북 양쪽
  for (const [z0, z1] of [[AZ1, -815.2], [-843.2, AZ0]]) {
    const F = frame([AX1, z0], [AX1, z1]);                                      // 북쪽으로 진행, 바깥 = 동
    wbox(parts, F, 0, F.len, 11, EAVE, -0.6, 0, conc, G);                      // 파시아 띠 (두께 0.6)
    wbox(parts, F, 0, F.len, 10.6, 11, -6, 0, conc, G);                        // 후퇴부 소핏
    const Fi = frame(F.at(0, -6), F.at(F.len, -6));
    parts.push({ geom: G.sideGeometry([Fi.p0, Fi.p1], 0, 10.6, 1 / 6, 1 / 10, false), mat: M.glass, cast: false });
    for (let s = 2.5; s < F.len; s += 5) wbox(parts, Fi, s - 0.12, s + 0.12, 0, 10.6, 0, 0.25, M.dark, G, false);
    wbox(parts, Fi, 0, F.len, 7.8, 8.05, 0, 0.25, M.dark, G, false);
    for (let s = 1.2; s < F.len; s += F.len / Math.round(F.len / 18)) wbox(parts, F, s - 0.9, s + 0.9, 0, 11, -1.8, 0, conc, G);   // 기둥
    // 후퇴부 양끝 측벽
    wbox(parts, F, 0, 0.6, 0, 11, -6, 0, conc, G); wbox(parts, F, F.len - 0.6, F.len, 0, 11, -6, 0, conc, G);
  }
  // ================= [E] 동측 출입 돌출부 =================
  {
    const E = [[610.6, -815.2], [621.9, -815.2], [621.9, -843.2], [610.6, -843.2]];
    const Fe = frame(E[1], E[2]);                                               // 동면 (북으로 진행)
    // 사인 밴드 (흰 패널 + 청색 글자줄) 11..17.4, 위 파시아 17.4..18
    wbox(parts, Fe, -0.3, Fe.len + 0.3, 11, 17.4, 0, 0.5, M.paintWhite, G);
    wbox(parts, Fe, 9.5, 18.5, 13.4, 15.2, 0.5, 0.6, M.dark, G, false);       // "Theater" 글자 (청/암색 띠로 단순화)
    wbox(parts, Fe, 2, 7, 14.0, 15.0, 0.5, 0.6, M.dark, G, false);
    wbox(parts, Fe, 21, 26, 14.0, 15.0, 0.5, 0.6, M.dark, G, false);
    wbox(parts, Fe, -0.3, Fe.len + 0.3, 17.4, EAVE, 0, 0.5, conc, G);
    // 1층: 피어 3 + 유리 쌍문 2 조 (피어 폭 2.5)
    for (const s of [0, 12.75, 25.5]) wbox(parts, Fe, s, s + 2.5, 0, 11, 0, 0.3, conc, G);
    for (const [s0, s1] of [[2.5, 12.75], [15.25, 25.5]]) {
      wbox(parts, Fe, s0, s1, 0, 11, -1.0, -0.8, M.glass, G, false);
      for (const t of [s0 + (s1 - s0) / 4, s0 + (s1 - s0) / 2, s0 + 3 * (s1 - s0) / 4]) wbox(parts, Fe, t - 0.12, t + 0.12, 0, 11, -0.9, -0.6, M.dark, G, false);
      wbox(parts, Fe, s0, s1, 7.6, 7.9, -0.9, -0.6, M.dark, G, false);
      wbox(parts, Fe, s0, s1, 7.9, 11, -1.0, -0.9, M.dark, G, false);         // 문 위 암색 트랜섬 (사진의 어두운 상부)
    }
    parts.push({ geom: G.box(10.2, 0.4, 11.3, 616.25, 10.6, -829.2), mat: conc });   // 문 앞 소핏 (돌출부 내부)
    for (const i of [0, 2]) parts.push({ geom: G.sideGeometry([E[i], E[i + 1]], 0, EAVE, 1 / 24, 1 / 12, false), mat: conc });   // 남·북 측벽
    const r = G.flatRoof(E, EAVE + 0.2, { parapet: 0.8, thick: 0.6 });
    parts.push({ geom: r.slab, mat: M.roof_gravel }); parts.push({ geom: r.parapet, mat: M.trim });
    parts.push({ geom: G.capGeometry(rect(621.9, 640, -846, -812), [], 0.12, 1 / 8), mat: M.walk, cast: false });   // 입구 앞 포장
  }

  // ================= [B] 북측 후면동 (16 ft) =================
  {
    const B = rect(488.6, 610.2, -888.9, AZ0);
    const HB = 16;
    // 남면은 객석동과 접함 (처마 18 > 16 → 보이지 않음)
    const Fe = frame(B[1], B[2]);   // 동면
    wallOps(parts, Fe, 0, HB, [{ s: 8, e: 14, b: 0, t: 7.5, inset: 0.4 }], conc, M, G);
    const Fn = frame(B[2], B[3]);   // 북면: 하역문(무대 반입) + 출입문
    wallOps(parts, Fn, 0, HB, [{ s: 62, e: 72, b: 0, t: 12, glass: M.metal, inset: 0.4 }, { s: 82, e: 85.5, b: 0, t: 7.2, inset: 0.4 }, { s: 104, e: 107.5, b: 0, t: 7.2, inset: 0.4 }], conc, M, G);
    for (let y = 1.5; y < 12; y += 1.5) wbox(parts, Fn, 62, 72, y, y + 0.12, -0.4, -0.3, M.dark, G, false);
    wbox(parts, Fn, 58, 76, -0.4, 0.15, 0, 14, M.walk, G, false);
    const Fw = frame(B[3], B[0]);   // 서면
    wallOps(parts, Fw, 0, HB, [{ s: 10, e: 13.5, b: 0, t: 7.2, inset: 0.4 }], conc, M, G);
    const r = G.flatRoof(B, HB, { parapet: 1.0, thick: 0.6 });
    parts.push({ geom: r.slab, mat: M.roof_gravel }); parts.push({ geom: r.parapet, mat: M.trim });
    parts.push({ geom: G.box(2.5, 2, 2.5, 575, HB, -876), mat: M.metal });
    parts.push({ geom: G.box(4, 3, 4, 520, HB, -878), mat: M.metal });
  }

  // ================= 북측 설비 마당 (스크린 벽 8 ft + 실외기) =================
  {
    const Y = [[558, -888.9], [612, -888.9], [612, -904], [604, -912], [558, -912]];   // 북동 모따기
    for (let i = 0; i < Y.length; i++) {
      if (i === 0) continue;                                     // 남쪽은 건물 벽
      const a = Y[i], b = Y[(i + 1) % Y.length];
      const F = frame(a, b);
      wbox(parts, F, 0, F.len, 0, 8, -0.8, 0, M.precast, G);
    }
    parts.push({ geom: G.box(10, 6, 7, 585, 0, -900), mat: M.metal });
    parts.push({ geom: G.box(8, 7, 8, 600, 0, -899), mat: M.metal });
    parts.push({ geom: G.box(5, 4, 4, 568, 0, -902), mat: M.metal });
    parts.push({ geom: G.capGeometry(Y, [], 0.1, 1 / 8), mat: M.walk, cast: false });
  }

  const grp = new THREE.Group();
  for (const m of G.mergeByMaterial(parts)) grp.add(m);
  return grp;
}
