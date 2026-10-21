// Technology Building (Bailey College of Engineering & Technology, Walter Scholer 1983)
// → 2024–2027 RATIO 리노베이션 "Center for Technology, Engineering and Design" (cTED) 2025 완성 형태로 모델링
//
// 치수 근거 (cTED Architectural set, 1/8" = 1'-0", 벡터 PDF 텍스트에서 그리드·치수·레벨 추출):
//   A-101/A-102 평면: 기존동 그리드 E1(=1)…E15 = 0,17,34,36,51,68,85,102,119,136,138,153,170,194,228 (E-W),
//     EM…EA = 0, EL 17, EK 18.5, EJ 29.5, EH 34, EG/D 39, EF 58, EE 68, ED 93, EC 102, EBa 113, EB 122.5, A 131, EA 136.1 (N-S);
//     북측 증축 그리드 2,4,5,6 = 18.5, 51.5, 84.5, 117.5 / H,G,F,E = -69, -47, -25, -4.5; 증축 기저 외벽 = 그리드 ±2'-4" (16.17..119.83),
//     기저 북면 = H - 2'-5½" (-71.5). 서측 로비(WA) 그리드 1..3 = 0..31.5.
//   A-201/A-202 입면 레벨: FIRST 100'-0" (=0), FIRST N 98'-0" (-2), FIRST SW 95'-0" (-5), SECOND 114'-8" (14.67), THIRD(기존 지붕) 129'-4" (29.33),
//     ROOF 137'-4⅝" (37.39), PENT. ROOF 144'-8" (44.67), MT-SECOND(브리지) 117'-4⅜" (17.36).
//     증축 상부 금속패널 볼륨: 소핏 110'-1" (10.1) / 패널 조인트 2'-0" + 4×6'-2" + 2'-3½" → 상단 139'-1" (39.1). 기존 벽돌 파라펫 ≈ 132'-5".
//   A-103 지붕: 북측 증축 지붕 PV 8열, 서측 증축 지붕 PV 2열, F..E 구간 덕트 인클로저 2개, 기계 펜트하우스 E5-3'…E8+1' × EM-1'…EG.
//   A-203 사인: 서면 "BAILEY COLLEGE…" (B7), 서측 출입구 "INDIANA STATE UNIVERSITY" (A7), 남동 모서리 세로 "INDIANA STATE UNIVERSITY" (C7).
//   A-301 단면: 지하층 85'-4" (생략), 고베이 지붕 ≈ THIRD, 증축 2층 워크숍 지붕 = ROOF.
//
// ── 입면 창 배치 (per facade) ────────────────────────────────────────────────────────────────────────────────
// [N 입면 A-201/D2]  (왼쪽 = 동)
//   · 북측 증축(NA) 상부 볼륨 z=-76.5, x 121.45→5.45 (116'-0"): 패널 12' | 유리 12' | 짙은패널 6' | 유리 24' | 패널 12' | 짙은패널 6' | 유리 32' | 패널 12'
//     유리 12.2..36.8 (수평 멀리언 15.6/24.4/33.4, 스팬드럴 12.2..15.6 & 33.4..36.8), 수직 선스크린 핀 4' 간격, 하단 밴드 10.1..12.2, 상단 36.8..39.1
//   · NA 기저 벽돌 z=-71.5 (FIRST N -2 → 소핏 10.1): 창 4'×12' @ x 27.5, 39.5, 57.5, 69.5, 77.5, 95.5, 107.5 / 3'×12' @ 19.4, 116 (각 창 하부 석회석 블록)
//   · 기존 북벽 z=0: x 0..16.17 벽돌 2층 (파라펫 32.4); x 119.83..138 벽돌 2층 + 2층 소창 2.4'×7' @ 123.3, 131.3 + 슬롯 2.8'×21.6' @ 138.4;
//     x 138..170 CM 랩 1층 벽돌(25'); 그 뒤 z=58 2층 벽(32.4). x 170..228 (z=58) 2층 유리 복도 15.1..28.4 + 하부 벽돌 15' (x 170..203, 오버헤드도어 173.7..182)
// [S 입면 A-201/A2]  (왼쪽 = 서)
//   · 서측 증축(WA) 상부 볼륨 z=136.1, x -9.75→33.05: 패널 4'+4' | 유리 12' | 짙은패널 10' | 유리 10' | 패널 2'-9¾"  (높이 10.1..39.1)
//   · WA 기저 z=136.1: 석회석 기둥 x -1.85..0.2, 유리 커튼월 0.2..31 (석회석 플린스 -5..-2.3, 멀리언 4'), 석회석 31..33
//   · 기존 남벽 x 33..170: 슬롯창 4'×(2.6..29.9) 7개 @ x 42.5+17k (k=0..6), 중간 스팬드럴 14..17.5, 짙은 프레임 0.6'
//   · 고베이 x 170..228: 벽돌 0..25 + 금속패널 25..32.2, E13 조인트 패널 2' (171.7..173.7), 모서리 패널 217.7..225.3 + 짙은 사인패널 225.3..228 (세로 글자)
// [E 입면 A-202/A2]  (왼쪽 = 남)
//   · 고베이 x=228 z 136→68: 벽돌 0..32.2 (25' 스트링코스), 오버헤드 유리도어 10'×15.5' 5개 @ z 128.6, 117, 104.8, 92.5, 81; HM 도어 3' @ z 72
//   · EE..EF 스트립 z 68→58: 박공 캐노피 출입구 (콘크리트 기둥, 짙은 박스 17..26, 박공 →32), 양개문 z 59..65
//   · CM 랩 동벽 x=170 z 58→0 (25'): 오버헤드도어 z 7.6..18.4 ×14.5', HM 도어 z 1..4, 창 3.6'×5' @ z 27.5, 44.1 (sill 2.9)
//   · NA 기저 동면 x=119.83 z -22.5→-71.5: 양개문 6' @ z -30.6 (상부 트랜섬 → 10.1), 창 4' @ z -40.6, -53.6, 3' @ z -68.3
//   · NA 상부 동면 x=121.45 z -22.5→-76.5: 패널 12' | 유리 8' | 짙은패널 8' | 유리 24' | 패널 2'
//   · WA 상부 동면 x=33.05 (z 35.3..135.4): 기존 지붕 위 밴드 31.7..39.1 / 펜트하우스 동면 루버 2개
// [W 입면 A-202/D2]  (왼쪽 = 북)
//   · NA 상부 서면 x=5.45 z -76.5→-22.5: 패널 2' | 유리 32' | 짙은패널 6' | 유리 12' | 패널 2'
//   · NA 기저 서면 x=16.17: 창 3' @ z -68.5, 8' @ z -54.6, 4' @ z -40.6, -30.6 (FIRST N -2 → 10.1)
//   · F..E 구간 x=16.17 z -22.5→0: 성형 금속패널 -2..32.5 (창 없음)
//   · 기존 서벽 x=0 z 0→34: 슬롯창 3.8'×(2.7..30.1) 4개 @ z 6.5, 14.5, 22.5, 30.5; 신축 조인트 커버 z 34..35.9
//   · WA 상부 서면 x=-9.85 z 35.9→135.9: 패널 2' | 유리 16' | 짙은패널 10' | 유리 40' | 짙은패널 12' (BAILEY COLLEGE 사인) | 유리 12' | 패널 8'
//   · WA 기저 서면 x=-1.85: 짙은패널 z 39..42.6; 석회석 출입구 42.6..61.8 (문 3×4'-8" @ 44.6..58.6, 사인밴드 5.5..8.7); 유리 커튼월 61.8..131.4
//     (플린스 -2.3 아래 석회석, 멀리언 4'); 석회석 131.4..136.1
// 로컬 프레임: 평면 기준 x = 오른쪽(= 동), z = 아래(= 남). 원점 = 기존동 북서 모서리(E1/EM). 평면 위 = 북 → rotation ≈ 0.
import * as THREE from 'three';

export const meta = {
  id: 'tech', name: 'Technology Building (cTED, 2025 renovation)', osm: 'way/461428305',
  anchor: [29.58, 1093.19], rotation: -0.025,   // tools/fit_footprint.py (RMS 1.41 ft)
  height: 45,
  preset: { pos: [-190, 115, 1415], tgt: [120, 10, 1150] },
  sheets: 'cTED A-101, A-102, A-103, A-201, A-202, A-203, A-301, A-321…A-326, A-350…A-353',
};

// 기존동 외곽 (OSM 피팅용): 본동 + 고베이 + 동측 브리지(MT 연결)
export const outline = [[0, 0], [0, 68], [35, 68], [35, 136], [228, 136], [228, 68], [270.5, 41.5], [270.5, 31], [228, 57], [228, 58], [173, 58], [173, 0]];

// ── 레벨 (ft, FIRST 100'-0" = 0) ──
const BASE = -6.5;                                   // 외벽 하단 (지반 아래)
const L2 = 14.67, RF_EX = 29.33, PAR_EX = 32.4;      // SECOND, THIRD(기존 지붕), 기존 벽돌 파라펫
const SOFFIT = 10.1, RF_ADD = 37.39, TOP_ADD = 39.1; // 증축 볼륨 소핏 / ROOF / 패널 상단
const J = [12.2, 18.3, 24.4, 30.6, 36.8];            // 6'-2" 패널 조인트
const SP_LO = 15.6, SP_HI = 33.4;                    // 스팬드럴 유리 경계
const PENT_TOP = 45.1, PENT_RIB = 35.4;              // 펜트하우스 스크린 상단, 성형패널 시작
const HB_TOP = 32.2, HB_STRING = 25;                 // 고베이 파라펫, 스트링코스
const BR_BOT = 15.1, BR_FL = 17.36, BR_G0 = 19, BR_G1 = 26.2, BR_TOP = 28.4;   // 브리지

export function build(M, G) {
  const parts = [];
  const brick = M.brick_brown, metal = M.metal, dark = M.dark, lime = M.limestone;
  const P = (geom, mat, cast) => parts.push({ geom, mat, cast });

  // ── 로컬 헬퍼 ─────────────────────────────────────────────────────────────────────────────
  const dir = (p0, p1) => { const dx = p1[0] - p0[0], dz = p1[1] - p0[1], len = Math.hypot(dx, dz); return { ex: [dx / len, dz / len], nx: [-dz / len, dx / len], len, ry: -Math.atan2(dz, dx) }; };
  const at = (p0, p1, s, off = 0) => { const d = dir(p0, p1); return [p0[0] + d.ex[0] * s + d.nx[0] * off, p0[1] + d.ex[1] * s + d.nx[1] * off]; };
  /** 벽 p0→p1 (CCW 규약) 의 s..e 구간을 y0..y1 로 세움. openings 는 구간 시작점 기준 거리. */
  const wall = (p0, p1, y0, y1, mat, openings = [], s = 0, e = null) => {
    const d = dir(p0, p1); if (e === null) e = d.len;
    P(G.wallSeg(at(p0, p1, s), at(p0, p1, e), y0, y1, { openings }), mat);
  };
  /** 벽면 안쪽(inset)으로 들어간 유리면 s..e × b..t */
  const pane = (p0, p1, s, e, b, t, mat = M.pane, inset = 0.5) => P(G.sideGeometry([at(p0, p1, s, -inset), at(p0, p1, e, -inset)], b, t, 1 / (e - s), 1 / (t - b), false), mat, false);
  /** 벽을 따라 정렬된 박스: 벽 방향 s..e, 높이 b..t, 법선 방향 d0..d1 (양수 = 바깥) */
  const wbox = (p0, p1, s, e, b, t, d0, d1, mat, cast) => { const d = dir(p0, p1); const c = at(p0, p1, (s + e) / 2, (d0 + d1) / 2); P(G.box(e - s, t - b, d1 - d0, c[0], b, c[1], { ry: d.ry }), mat, cast); };
  const roof = (poly, y, parapet, mat = M.roof_membrane, pmat = metal) => { const r = G.flatRoof(poly, y, { parapet, thick: 0.6 }); P(r.slab, mat); if (r.parapet) P(r.parapet, pmat); };
  const soffit = (poly, y) => P(G.capGeometry([...poly].reverse(), [], y), metal, false);

  /** 슬롯창 (기존 벽돌벽): 개구 + 짙은 프레임 + 유리(중간 스팬드럴) */
  const slot = (p0, p1, c, w, b, t) => {
    const f = 0.6;
    pane(p0, p1, c - w / 2, c + w / 2, b, 14, M.pane); pane(p0, p1, c - w / 2, c + w / 2, 14, 17.5, M.glass); pane(p0, p1, c - w / 2, c + w / 2, 17.5, t, M.pane);
    wbox(p0, p1, c - w / 2 - f, c - w / 2, b - f, t + f, -0.3, 0.1, dark); wbox(p0, p1, c + w / 2, c + w / 2 + f, b - f, t + f, -0.3, 0.1, dark);
    wbox(p0, p1, c - w / 2 - f, c + w / 2 + f, t, t + f, -0.3, 0.1, dark); wbox(p0, p1, c - w / 2 - f, c + w / 2 + f, b - f, b, -0.3, 0.1, dark);
    return { s: c - w / 2, e: c + w / 2, b, t };
  };
  /** 일반 창: 개구 + 유리 + 얇은 프레임 */
  const win = (p0, p1, c, w, b, t, mat = M.pane) => { pane(p0, p1, c - w / 2, c + w / 2, b, t, mat); wbox(p0, p1, c - w / 2 - 0.15, c + w / 2 + 0.15, t, t + 0.15, -0.3, 0.05, dark); return { s: c - w / 2, e: c + w / 2, b, t }; };
  /** 커튼월 밴드: bays = [[폭, 'p'|'d'|'g'], ...] (벽 시작점부터). 유리 베이는 gb..gt 개구 + 스팬드럴 + 멀리언 + 수직 핀. */
  const cw = (p0, p1, bays, { yb, yt, gb, gt, fin = 4, finD = 1.0, mul = [SP_LO, 24.4, SP_HI], s0 = 0 } = {}) => {
    let s = s0;
    for (const [w, k] of bays) {
      const e = s + w;
      if (k === 'g') {
        wall(p0, p1, yb, yt, metal, [{ s: 0, e: w, b: gb, t: gt }], s, e);
        pane(p0, p1, s, e, Math.max(gb, SP_LO), Math.min(gt, SP_HI), M.pane);
        if (gb < SP_LO) pane(p0, p1, s, e, gb, SP_LO, M.glass);
        if (gt > SP_HI) pane(p0, p1, s, e, SP_HI, gt, M.glass);
        for (const y of mul) if (y > gb + 0.3 && y < gt - 0.3) wbox(p0, p1, s, e, y - 0.15, y + 0.15, -0.3, 0.2, dark, false);
        for (let x = s; x <= e + 0.01; x += fin) wbox(p0, p1, Math.max(s, x - 0.25), Math.min(e, x + 0.25), gb, gt, -0.4, finD, dark);
      } else wall(p0, p1, yb, yt, k === 'd' ? dark : metal, [], s, e);
      s = e;
    }
  };
  /** 오버헤드 섹셔널 도어 (유리 패널): 짙은 패널 + 밝은 레일 격자 */
  const ohDoor = (p0, p1, c, w, b, t, glazed) => {
    pane(p0, p1, c - w / 2, c + w / 2, b, t, glazed ? M.pane : M.glass, 0.4);
    const nv = Math.round(w / 2.5), nh = Math.round((t - b) / 2.5);
    for (let i = 0; i <= nv; i++) { const x = c - w / 2 + (w * i) / nv; wbox(p0, p1, x - 0.12, x + 0.12, b, t, -0.35, -0.15, M.trim, false); }
    for (let i = 0; i <= nh; i++) { const y = b + ((t - b) * i) / nh; wbox(p0, p1, c - w / 2, c + w / 2, y - 0.12, y + 0.12, -0.35, -0.15, M.trim, false); }
    return { s: c - w / 2, e: c + w / 2, b, t };
  };
  /** 양개 유리문 + 트랜섬 */
  const door2 = (p0, p1, c, w, b, t, transomTop = null) => {
    const top = transomTop ?? t;
    pane(p0, p1, c - w / 2, c + w / 2, b, top, M.pane, 0.6);
    wbox(p0, p1, c - w / 2, c - w / 2 + 0.3, b, t, -0.7, -0.3, dark); wbox(p0, p1, c + w / 2 - 0.3, c + w / 2, b, t, -0.7, -0.3, dark);
    wbox(p0, p1, c - 0.15, c + 0.15, b, t, -0.7, -0.3, dark); wbox(p0, p1, c - w / 2, c + w / 2, t - 0.3, t, -0.7, -0.3, dark);
    wbox(p0, p1, c - w / 2, c + w / 2, b, b + 0.8, -0.7, -0.3, dark);
    return { s: c - w / 2, e: c + w / 2, b, t: top };
  };
  const letters = (p0, p1, s, e, b, t, off = 0.15) => wbox(p0, p1, s, e, b, t, off, off + 0.12, M.white, false);   // 입체 글자 (근사)

  // ════════════════════════════════════════════════════════════════════════════════════════
  // 1. 기존 본동 (벽돌 2층, 지붕 THIRD 129'-4", 파라펫 32.4)
  //    평면: (0,0)-(0,136.1)-(170,136.1)-(170,58)-(138,58)-(138,0)
  // ════════════════════════════════════════════════════════════════════════════════════════
  const EA = 136.1;
  {
    // 서벽 x=0, z 0→136 (z>35.9 는 서측 증축 박스 내부에 묻힘)
    const w0 = [0, 0], w1 = [0, EA];
    const ops = [6.5, 14.5, 22.5, 30.5].map(c => slot(w0, w1, c, 3.8, 2.7, 30.1));
    wall(w0, w1, BASE, PAR_EX, brick, ops);
    wbox(w0, w1, 34.4, 35.9, BASE, PAR_EX, 0, 0.25, dark);                   // 신축 조인트 커버 (079513.16.A00)
    // 남벽 z=136.1, x 0→170 : 슬롯창 7개 (x 33 서쪽은 WA 기저 유리로 대체 → 벽은 33 부터)
    const s0 = [0, EA], s1 = [170, EA];
    const sops = [];
    for (let k = 0; k < 7; k++) sops.push(slot(s0, s1, 42.5 + 17 * k, 4, 2.6, 29.9));
    wall(s0, s1, BASE, PAR_EX, brick, sops, 33, 170);
    // 동벽 x=170 (z 136→58: 고베이에 묻힘) → 고베이 위로 노출되는 부분만
    wall([170, EA], [170, 58], HB_TOP - 0.5, PAR_EX, brick);
    // z=58 북벽 x 170→138 (CM 랩 지붕 위 노출)
    wall([170, 58], [138, 58], 24, PAR_EX, brick);
    // 북벽 z=0, x 138→119.83 (2층) : 2층 소창 2 + 슬롯
    const n0 = [138, 0], n1 = [0, 0];
    const nops = [win(n0, n1, 138 - 131.3, 2.4, 17.6, 24.6), win(n0, n1, 138 - 123.3, 2.4, 17.6, 24.6), slot(n0, n1, 138 - 138.4 + 1.4, 2.8, 3, 24.6)];
    wall(n0, n1, BASE, PAR_EX, brick, nops, 0, 138 - 119.83);
    // 북벽 z=0, x 16.17→0 (NW 모서리, 증축 서쪽)
    wall(n0, n1, BASE, PAR_EX, brick, [], 138 - 16.17, 138);
    roof([[0, 0], [0, EA], [170, EA], [170, 58], [138, 58], [138, 0]], RF_EX, PAR_EX - RF_EX, M.roof_gravel, brick);
    // 옥상 기계 유닛 (A-103)
    P(G.box(6, 4, 6, 114, RF_EX, 63.7), metal); P(G.box(6, 4, 6, 146, RF_EX, 63.7), metal); P(G.box(8, 4.5, 6, 91.7, RF_EX, 84.4), metal);
  }

  // ── CM 랩 1층 (E11..E13 × EM..EF), 벽돌 25' ──
  {
    const e0 = [170, 58], e1 = [170, 0];           // 동벽 (자재 야드 쪽) — 오버헤드도어 + HM 도어 + 창 2
    const ops = [ohDoor(e0, e1, 58 - 13, 10.8, 0, 14.5, false), { s: 58 - 4, e: 58 - 1, b: 0, t: 7 }, win(e0, e1, 58 - 27.5, 3.6, 2.9, 8), win(e0, e1, 58 - 44.1, 3.6, 2.9, 8)];
    wall(e0, e1, BASE, HB_STRING, brick, ops);
    wbox(e0, e1, 58 - 4, 58 - 1, 0, 7, -0.4, -0.1, dark);                  // HM 도어
    wall([170, 0], [138, 0], BASE, HB_STRING, brick);                        // 북벽 z=0
    roof([[138, 0], [138, 58], [170, 58], [170, 0]], 24, 1, M.roof_membrane, brick);
  }

  // ── 자재 야드 (E13..E15 × EM..EF): CIP 콘크리트 사이트월 (x≈226) + 브리지 하부 피어 ──
  P(G.box(1.2, 10, 56, 226, BASE, 29), M.concrete);
  P(G.box(6, BR_BOT - BASE, 4, 226, BASE, 58), M.concrete);

  // ════════════════════════════════════════════════════════════════════════════════════════
  // 2. 고베이 (자동차 실습동, x 170..228 × z 68..136.1) + EE..EF 스트립 (z 58..68, 2층 유리 복도)
  // ════════════════════════════════════════════════════════════════════════════════════════
  {
    const hb = [[170, 68], [170, EA], [228, EA], [228, 68]];
    // 남면 z=136.1, x 170→228: 벽돌 0..25, 금속패널 25..32.2, E13 조인트 패널, 모서리 패널 + 사인 패널
    const s0 = [170, EA], s1 = [228, EA];
    wall(s0, s1, BASE, HB_STRING, brick, [], 3.7, 47.7);
    wall(s0, s1, HB_STRING, HB_TOP, metal, [], 3.7, 55.3);
    wall(s0, s1, BASE, HB_STRING, metal, [], 47.7, 55.3);                   // 모서리 금속패널 (A4/A-325)
    wbox(s0, s1, 0, 3.7, BASE, HB_TOP, 0, 0.2, metal);                      // E13 조인트 패널 2'(+) (A5/A-325)
    wbox(s0, s1, 55.3, 58, BASE, HB_STRING, 0, 0.3, dark);                  // 사인 패널 (074213.23.B02B)
    wbox(s0, s1, 55.3, 58, HB_STRING, HB_TOP, 0, 0.2, metal);
    letters(s0, s1, 56.3, 57.1, 3.5, 23.5, 0.3);                            // "INDIANA STATE UNIVERSITY" 세로 (C7/A-203)
    // 동면 x=228, z 136.1→68: 오버헤드 유리 도어 5 + HM 도어, 모서리 짙은 패널
    const e0 = [228, EA], e1 = [228, 68];
    const ops = [128.6, 117, 104.8, 92.5, 81].map(zc => ohDoor(e0, e1, EA - zc, 10, 0, 15.45, true));
    ops.push({ s: EA - 73.7, e: EA - 70.5, b: 0, t: 7 });
    wall(e0, e1, BASE, HB_TOP, brick, ops, 2.6, EA - 68);
    wbox(e0, e1, EA - 73.7, EA - 70.5, 0, 7, -0.4, -0.1, dark);
    wbox(e0, e1, 0, 2.6, BASE, HB_STRING, 0, 0.3, dark);
    wbox(e0, e1, 0, 2.6, HB_STRING, HB_TOP, 0, 0.2, metal);
    wbox(e0, e1, 2.6, EA - 68, HB_STRING - 0.3, HB_STRING + 0.1, 0, 0.25, M.trim);   // 25' 스트링코스
    wbox(s0, s1, 3.7, 55.3, HB_STRING - 0.3, HB_STRING + 0.1, 0, 0.25, M.trim);
    // 북면 z=68 (스트립 복도 지붕 위 노출), 서면은 본동에 묻힘
    wall([228, 68], [170, 68], BR_TOP - 0.5, HB_TOP, brick);
    roof(hb, RF_EX, HB_TOP - RF_EX, M.roof_membrane, brick);

    // EE..EF 스트립 (z 58..68): 1층 벽돌 15' + 2층 유리 복도 (스카이브리지 250) 15.1..28.4
    const st0 = [228, 58], st1 = [170, 58];
    wall(st0, st1, BASE, BR_BOT, brick, [ohDoor(st0, st1, 228 - 177.85, 8.3, 0, 11.6, false)], 228 - 203, 58);
    wall(st0, st1, BR_BOT, BR_G0, dark, [], 0, 58);                           // 하부 스팬드럴
    wall(st0, st1, BR_G0, BR_G1, metal, [{ s: 0, e: 58, b: BR_G0, t: BR_G1 }], 0, 58);
    pane(st0, st1, 0, 58, BR_G0, BR_G1, M.pane, 0.4);
    for (let x = 0; x <= 58.01; x += 4) wbox(st0, st1, x - 0.15, x + 0.15, BR_BOT, BR_G1, -0.3, 0.2, dark, false);
    wall(st0, st1, BR_G1, BR_TOP, metal, [], 0, 58);                          // 파시아
    wall([228, 68], [228, 58], BASE, HB_TOP, brick);                          // 동측 단부 벽 (박공 출입구 뒤)
    roof([[170, 58], [170, 68], [228, 68], [228, 58]], BR_TOP, 0, M.roof_membrane);
    // 박공 캐노피 출입구 (VESTIBULE 126A, 동면 z 54..68)
    P(G.box(1.5, 15.5 - BASE, 1.5, 231.2, BASE, 55), M.concrete); P(G.box(1.5, 15.5 - BASE, 1.5, 231.2, BASE, 67), M.concrete);
    P(G.box(4, 1.5, 14, 230, 15.5, 61), M.concrete);
    P(G.box(4, 9, 14, 230, 17, 61), dark);
    P(G.gableRoof([[228, 54], [228, 68], [232, 68], [232, 54]], 26, 0.86, 0), dark);
    P(G.box(3, 0.6, 10, 229.5, 8.2, 62), dark);                               // 출입문 캐노피
    pane([228, 68], [228, 58], 3, 9, 0, 8, M.pane, 0.6);                      // 양개문 (z 59..65)
    wbox([228, 68], [228, 58], 3, 3.3, 0, 8, -0.7, -0.3, dark); wbox([228, 68], [228, 58], 8.7, 9, 0, 8, -0.7, -0.3, dark);
    wbox([228, 68], [228, 58], 5.85, 6.15, 0, 8, -0.7, -0.3, dark); wbox([228, 68], [228, 58], 3, 9, 7.7, 8, -0.7, -0.3, dark);
  }

  // ════════════════════════════════════════════════════════════════════════════════════════
  // 3. [증축] 북측 증축동 (NA): 기저 벽돌 (z -71.5..-22.5, x 16.17..119.83) + 상부 복합패널/커튼월 볼륨 (z -76.5..-22.5, x 5.45..121.45)
  // ════════════════════════════════════════════════════════════════════════════════════════
  {
    const bx0 = 16.17, bx1 = 119.83, bz0 = -71.5, bz1 = -22.5, FN = -2;
    const sill = (p0, p1, c, w) => wbox(p0, p1, c - w / 2, c + w / 2, FN - 1.8, FN, -0.1, 0.15, lime);
    // 북면 z=-71.5, x 119.83→16.17
    { const p0 = [bx1, bz0], p1 = [bx0, bz0], ops = [];
      for (const [c, w] of [[19.4, 3], [27.5, 4], [39.5, 4], [57.5, 4], [69.5, 4], [77.5, 4], [95.5, 4], [107.5, 4], [116, 3]]) { ops.push(win(p0, p1, bx1 - c, w, FN, SOFFIT)); sill(p0, p1, bx1 - c, w); }
      wall(p0, p1, BASE, SOFFIT, brick, ops); }
    // 서면 x=16.17, z -71.5→-22.5
    { const p0 = [bx0, bz0], p1 = [bx0, bz1], ops = [];
      for (const [c, w] of [[-68.5, 3], [-54.6, 8], [-40.6, 4], [-30.6, 4]]) { ops.push(win(p0, p1, c - bz0, w, FN, SOFFIT)); sill(p0, p1, c - bz0, w); }
      wall(p0, p1, BASE, SOFFIT, brick, ops); }
    // 동면 x=119.83, z -22.5→-71.5 : 출입문(VESTIBULE 109) + 창 3
    { const p0 = [bx1, bz1], p1 = [bx1, bz0], ops = [];
      ops.push(door2(p0, p1, bz1 - (-30.6), 6, FN, FN + 7.5, SOFFIT));
      for (const [c, w] of [[-40.6, 4], [-53.6, 4], [-68.3, 3]]) { ops.push(win(p0, p1, bz1 - c, w, FN, SOFFIT)); sill(p0, p1, bz1 - c, w); }
      wall(p0, p1, BASE, SOFFIT, brick, ops); }

    // 상부 볼륨
    const ux0 = 5.45, ux1 = 121.45, uz0 = -76.5, uz1 = -22.5;
    const up = [[ux0, uz0], [ux0, uz1], [ux1, uz1], [ux1, uz0]];
    const O = { yb: SOFFIT, yt: TOP_ADD, gb: J[0], gt: J[4] };
    cw([ux1, uz0], [ux0, uz0], [[12, 'p'], [12, 'g'], [6, 'd'], [24, 'g'], [12, 'p'], [6, 'd'], [32, 'g'], [12, 'p']], O);        // 북면
    cw([ux0, uz0], [ux0, uz1], [[2, 'p'], [32, 'g'], [6, 'd'], [12, 'g'], [2, 'p']], O);                                            // 서면
    cw([ux1, uz1], [ux1, uz0], [[12, 'p'], [8, 'g'], [8, 'd'], [24, 'g'], [2, 'p']], O);                                            // 동면
    // 남면 z=-22.5, x 5.45→121.45: 서측 레그 12' 전높이, 중앙 F..E 지붕 위 클리어스토리 31.4..36.8, 동측 레그 2.6'
    { const p0 = [ux0, uz1], p1 = [ux1, uz1];
      wall(p0, p1, SOFFIT, TOP_ADD, metal, [], 0, 12);
      wall(p0, p1, 31.4, TOP_ADD, metal, [{ s: 0, e: 113.4 - 12, b: 31.4, t: J[4] }], 12, 113.4);
      pane(p0, p1, 12, 113.4, 31.4, J[4], M.pane);
      for (let x = 12; x <= 113.4; x += 7.24) wbox(p0, p1, x - 0.15, x + 0.15, 31.4, J[4], -0.3, 0.2, dark, false);
      wall(p0, p1, SOFFIT, TOP_ADD, metal, [], 113.4, 116); }
    soffit(up, SOFFIT);
    roof(up, RF_ADD, TOP_ADD - RF_ADD);
    // 지붕 PV 패널 (A-103) 2열 × 4행
    for (const [x0, x1] of [[15.7, 55.9], [72, 104.3]]) for (const [z0, z1] of [[-67.4, -64.7], [-62.7, -58], [-49, -44.2], [-43.4, -38.7]])
      P(G.box(x1 - x0, 0.4, z1 - z0, (x0 + x1) / 2, RF_ADD + 1.2, (z0 + z1) / 2), M.roof_dark);

    // F..E 구간 (계단·덕트 존, x 16.17..119.83 × z -22.5..0): 성형 금속패널, 지붕 31.4, 코핑 32.5, 덕트 인클로저 2
    wall([bx0, bz1], [bx0, 0], BASE, 32.5, metal);
    wall([bx1, 0], [bx1, bz1], BASE, 32.5, metal);
    roof([[bx0, bz1], [bx0, 0], [bx1, 0], [bx1, bz1]], 31.4, 1.1);
    P(G.box(6.7, 5.4, 18, 74.75, 31.4, -13.5), dark); P(G.box(6.8, 5.4, 18, 101, 31.4, -13.5), dark);
  }

  // ════════════════════════════════════════════════════════════════════════════════════════
  // 4. 기계 펜트하우스 (기존 지붕 위, x 48..103.1 × z -1.2..38.6): 복합패널 29.33..35.4 + 성형패널 스크린 35.4..45.1, 동면 루버
  // ════════════════════════════════════════════════════════════════════════════════════════
  {
    const pb = [[48, -1.2], [48, 38.6], [103.1, 38.6], [103.1, -1.2]];
    P(G.sideGeometry(pb, RF_EX, PENT_RIB, 1 / 24, 1 / 12, true), metal);
    P(G.sideGeometry(pb, PENT_RIB, PENT_TOP, 1 / 8, 1 / 12, true), M.concrete);
    P(G.capGeometry(pb, [], PENT_TOP - 0.4), M.roof_membrane);
    for (const [z0, z1] of [[14, 22], [28, 37]]) wbox([103.1, 38.6], [103.1, -1.2], 38.6 - z1, 38.6 - z0, 36, 41, 0, 0.3, dark);   // 루버 (081113.A00 hollow metal)
    wbox([103.1, -1.2], [48, -1.2], 20, 28, 36, 41, 0, 0.3, dark);                                                                   // 북면 루버
  }

  // ════════════════════════════════════════════════════════════════════════════════════════
  // 5. [증축] 서측 증축 (WA): 상부 볼륨 x -9.85..33.05 × z 35.9..136.1 (10.1..39.1; 기존 지붕 위는 31.7..39.1 밴드) + 기저
  // ════════════════════════════════════════════════════════════════════════════════════════
  {
    const wx0 = -9.85, wx1 = 33.05, wz0 = 35.9, wz1 = EA;
    const box = [[wx0, wz0], [wx0, wz1], [wx1, wz1], [wx1, wz0]];
    const O = { yb: SOFFIT, yt: TOP_ADD, gb: J[0], gt: J[4] };
    cw([wx0, wz0], [wx0, wz1], [[2, 'p'], [16, 'g'], [10, 'd'], [40, 'g'], [12, 'd'], [12, 'g'], [8, 'p']], O);                     // 서면
    cw([wx0, wz1], [wx1, wz1], [[8, 'p'], [12, 'g'], [10, 'd'], [10, 'g'], [2.9, 'p']], O);                                          // 남면
    wall([wx1, wz0], [wx0, wz0], SOFFIT, TOP_ADD, metal, [], wx1 - 2.4, wx1 - wx0);                                                   // 북면 서측 레그 (전높이)
    wall([wx1, wz0], [wx0, wz0], RF_EX + 2.4, TOP_ADD, metal, [], 0, wx1 - 2.4);                                                      // 북면 밴드 (기존 지붕 위)
    wall([wx1, wz1], [wx1, wz0], RF_EX + 2.4, TOP_ADD, metal);                                                                        // 동면 밴드 (G2/A-202)
    // "BAILEY COLLEGE OF ENGINEERING AND TECHNOLOGY" (B7/A-203) — 서면 짙은 패널 z 103.9..115.9
    for (let i = 0; i < 3; i++) letters([wx0, wz0], [wx0, wz1], 104.9 - wz0, 114.9 - wz0, 33.6 - i * 1.6, 34.6 - i * 1.6);
    soffit(box, SOFFIT);
    roof(box, RF_ADD, TOP_ADD - RF_ADD);
    for (const [x0, x1] of [[-1.7, 8.7], [13, 23.4]]) P(G.box(x1 - x0, 0.4, 62, (x0 + x1) / 2, RF_ADD + 1.2, 88), M.roof_dark);     // PV 2열 (A-103)

    // 기저 (FIRST SW -5 → 소핏 10.1), 서면 x=-1.85 z 39→136.1 / 남면 z=136.1 x -1.85→33
    const b0 = [-1.85, 39], b1 = [-1.85, EA];
    wall(b0, b1, BASE, SOFFIT, dark, [], 0, 3.6);                                                                                     // z 39..42.6 짙은 패널
    { const s = 3.6, e = 22.8;                                                                                                        // 출입구 석회석 42.6..61.8
      const ops = [{ s: 5.6 - s, e: 19.6 - s, b: -5, t: 3.5 }];
      wall(b0, b1, BASE, SOFFIT, lime, ops, s, e);
      pane(b0, b1, 5.6, 19.6, -5, 3.5, M.pane, 0.6);
      for (let i = 0; i <= 3; i++) wbox(b0, b1, 5.6 + i * 4.667 - 0.15, 5.6 + i * 4.667 + 0.15, -5, 3.5, -0.7, -0.3, dark);
      for (let i = 0; i < 3; i++) wbox(b0, b1, 5.6 + i * 4.667 + 2.33 - 0.1, 5.6 + i * 4.667 + 2.33 + 0.1, -5, 3.5, -0.7, -0.3, dark);
      wbox(b0, b1, 5.6, 19.6, 3.2, 3.5, -0.7, -0.3, dark); wbox(b0, b1, 5.6, 19.6, -5, -4.2, -0.7, -0.3, dark);
      wbox(b0, b1, s, e, 5.5, 8.7, 0, 0.15, dark);                                                                                   // 사인 밴드
      letters(b0, b1, 5.9, 19.9, 6.5, 7.6, 0.15); }                                                                                   // "INDIANA STATE UNIVERSITY" (A7/A-203)
    { const s = 22.8, e = 92.4;                                                                                                       // 유리 커튼월 61.8..131.4
      wall(b0, b1, BASE, SOFFIT, lime, [{ s: 0, e: e - s, b: -2.3, t: SOFFIT }], s, e);
      pane(b0, b1, s, e, -2.3, SOFFIT, M.pane, 0.4);
      for (let x = s; x <= e + 0.01; x += 4) wbox(b0, b1, x - 0.15, x + 0.15, -2.3, SOFFIT, -0.3, 0.1, dark, false);
      wbox(b0, b1, s, e, 4.9, 5.2, -0.3, 0.1, dark, false); }
    wall(b0, b1, BASE, SOFFIT, lime, [], 92.4, EA - 39);                                                                              // 석회석 131.4..136.1
    { const p0 = [-1.85, EA], p1 = [33, EA];                                                                                          // 남면 기저
      wall(p0, p1, BASE, SOFFIT, lime, [], 0, 2.05);
      wall(p0, p1, BASE, SOFFIT, lime, [{ s: 0, e: 32.85 - 2.05, b: -2.3, t: SOFFIT }], 2.05, 32.85);
      pane(p0, p1, 2.05, 32.85, -2.3, SOFFIT, M.pane, 0.4);
      for (let x = 2.05; x <= 32.85 + 0.01; x += 4.4) wbox(p0, p1, x - 0.15, x + 0.15, -2.3, SOFFIT, -0.3, 0.1, dark, false);
      wbox(p0, p1, 2.05, 32.85, 4.9, 5.2, -0.3, 0.1, dark, false);
      wall(p0, p1, BASE, SOFFIT, lime, [], 32.85, 34.85); }
    wall([0, 39], [-1.85, 39], BASE, SOFFIT, dark);               // 기저 북측 단부 (z=39) x 0→-1.85
  }

  // ════════════════════════════════════════════════════════════════════════════════════════
  // 6. 동측 스카이브리지 (MT-SECOND 117'-4⅜" ↔ Myers), 유리 + 금속 파시아, 콘크리트 기둥
  // ════════════════════════════════════════════════════════════════════════════════════════
  {
    const b0 = [228, 63], b1 = [270.5, 36.5];
    const bl = Math.hypot(b1[0] - b0[0], b1[1] - b0[1]), ry = -Math.atan2(b1[1] - b0[1], b1[0] - b0[0]);
    const bc = [(b0[0] + b1[0]) / 2, (b0[1] + b1[1]) / 2];
    P(G.box(bl + 2, BR_FL - BR_BOT, 10, bc[0], BR_BOT, bc[1], { ry }), metal);          // 바닥 슬래브
    P(G.box(bl + 2, BR_G0 - BR_FL, 10, bc[0], BR_FL, bc[1], { ry }), dark);              // 하부 스팬드럴
    P(G.box(bl + 2, BR_G1 - BR_G0, 9.4, bc[0], BR_G0, bc[1], { ry }), M.pane, false);    // 유리 벽
    P(G.box(bl + 2, BR_TOP - BR_G1, 10, bc[0], BR_G1, bc[1], { ry }), metal);            // 파시아/지붕
    const ex = [(b1[0] - b0[0]) / bl, (b1[1] - b0[1]) / bl], nx = [-ex[1], ex[0]];
    for (let s = 2; s < bl; s += 4) for (const side of [-4.8, 4.8]) P(G.box(0.3, BR_G1 - BR_G0, 0.5, b0[0] + ex[0] * s + nx[0] * side, BR_G0, b0[1] + ex[1] * s + nx[1] * side, { ry }), dark, false);
    P(G.box(1.5, BR_BOT - BASE, 1.5, 265, BASE, 40), M.concrete);                        // 기둥 (Myers 측)
  }

  const grp = new THREE.Group();
  for (const m of G.mergeByMaterial(parts)) grp.add(m);
  return grp;
}
