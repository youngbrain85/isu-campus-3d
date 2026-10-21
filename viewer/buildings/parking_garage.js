// ISU Parking Garage / Cherry Street Garage (1층 Terre Haute Transit 버스 터미널) — 사진·위성 기반 모델 (도면 없음)
// 범위: 본동 way/545275306 (N 8th St 따라 남북 장변) + 서측 날개 way/545275307 (Cherry St 남면을 서쪽으로 연장) = ㄱ자 평면.
// 근거: Street View vp74 (Cherry St 버스 진입로, 000/045/315), 8th St 파노라마(2024 포토스피어 + 공식 SV, 동면·북동탑),
//       Esri z20(겨울)/z19(여름) 위성 (scratch/garage_z20.png: 탑 3개 적갈색 피라미드 지붕, 옥상 주차선, 램프 슬롯).
//
// ■ 층: 지상층(버스 터미널·주차 진출입, 층고 16) + 데크 L2/L3/L4 + 옥상 데크 → 슬래브 상단 y = 16 / 26.5 / 37 / 47.5 (층고 10.5).
//   사진 비례(정면 vp74_000, 동면 파노라마): 스팬드럴 ≈ 7 ft (슬래브 아래 3 + 파라펫 4) : 개구 ≈ 3.5 ft, 1층 띠 하단 ≈ 12 ft.
//   → L2 = 벽돌 띠 12.0–19.8 (하부 석재 띠, 상부 석재 갓돌), L3·L4 = 황갈색 프리캐스트 패널 23–30 / 33.5–40.5,
//     최상층 = 벽돌 아치벽(피어 사이 분절 아치, 스프링 41, 정점 46.3 — 아치 안쪽으로 L4 패널이 보임), 옥상 파라펫 벽돌 ~51.6,
//     작은 아치 장식 띠(코벨 아케이드), 석재 코니스 52.6.
// ■ 베이(피어 중심 간격): 남면(Cherry St, SW탑 동면 x 938.9 → SE탑 서면 x 1139.8) 9칸 × 22.3 ft — vp74_315 에서 측정한 피어
//   x ≈ 1093/1069/1048/1024/1006/985/966 과 일치. 1층 피어(석재 받침)는 6·4·2번째 칸 경계만(나머지 상부 피어는 L2 띠 위에서 시작).
//   남면 1층: 동쪽 2칸(x 1095–1140) = TERRE HAUTE TRANSIT 버스 진입구(BUS ENTRY), 다음 3칸(x 1028–1095) = 승용차 진출입
//   (PARK 동쪽 진입 / EXIT 서쪽 출구, 섬 + 요금 부스 + 차단기), 서쪽 4칸 = 크림색 프리캐스트 막힌 벽.
//   동면(8th St, SE탑 북면 z 1194.5 → NE탑 남면 z 952.8) 12칸 × 20.1 ft, 1층 피어는 2칸마다(40 ft 버스 베이). 남단 첫 칸 = 터미널
//   유리 출입구(위 띠에 TERRE HAUTE 사인), 중간 = 검정 철책, 북단 칸 = 막힌 벽돌벽(파노라마). 상부 피어마다 청색 배너, 1층 피어 위 램프.
//   북·서면(사진 없음): 같은 입면 체계, 1층은 낮은 벽돌담 (가정).
// ■ 계단탑 3개(SE: 8th & Cherry, NE: 8th 북단, SW: Cherry 서단): 벽돌, 모서리 필라스터 + 석재 받침, 1층 큰 반원 아치창(석재 아치·쐐기돌),
//   2·3층 2×3 분할 큰 창 한 쌍, 4·5층 반원머리 창 한 쌍(북동탑 사진), 층마다 석재 띠, 코벨 아케이드 띠 + 코니스 60.2,
//   피라미드 지붕(테라코타) 정점 67.5. 창은 도로면 2개 면에만.
// ■ 옥상·내부: 위성 주차선(황색)에 맞춘 줄, 조명주 13개, 주차 차량. 본동 서측 모듈 x 1068–1096, z 975–1055 = 적층 램프(남→북 상승,
//   층마다 1개, 위성의 중앙 슬롯), z 1129–1169 와 날개 z 1155–1163 슬롯은 난간 두른 개구(채광정)로 가정. 더블티 리브, 내부 기둥.
// ■ 가정(사진 없음): 북·서면 1층, 날개 내부 램프, 탑의 가려진 면, 램프 실제 위치(위성 슬롯 위치만 반영).
import * as THREE from 'three';

export const meta = {
  id: 'garage', name: 'ISU Parking Garage (Cherry Street Garage / Terre Haute Transit)', osm: 'way/545275306', extraIds: ['way/545275307'],
  anchor: [0, 0], rotation: 0, height: 67.5,
  preset: { pos: [1365, 175, 1430], tgt: [1065, 18, 1110] },
  sheets: 'Street View vp74 (Cherry St), 8th St panoramas (2024), Esri imagery z20/z19',
};

const UP = new THREE.Vector3(0, 1, 0);
const LV = [0, 16, 26.5, 37, 47.5];               // 지상 + 데크 슬래브 상단
const P3 = [23, 30], P4 = [33.5, 40.5];            // 프리캐스트 패널
const SPRING = 41.0, CROWN = 46.3, PAR = 51.6, TOP = 52.6;
const rect = (x0, z0, x1, z1) => [[x0, z0], [x0, z1], [x1, z1], [x1, z0]];   // CCW (site 규약)

// 램프·슬롯 (위성)
const RAMP = { x0: 1068, x1: 1096, zS: 1055, zN: 975 };
const SLOTS = [rect(1089, 1129, 1097, 1169), rect(945, 1155, 1030, 1163)];
// 계단탑
const TOWERS = [
  { x0: 1139.8, x1: 1164.3, z0: 1194.5, z1: 1222.4, win: ['S', 'E'] },   // SE (8th & Cherry)
  { x0: 1136.8, x1: 1163.2, z0: 926.6, z1: 952.8, win: ['N', 'E'] },     // NE
  { x0: 913.7, x1: 938.9, z0: 1197.0, z1: 1222.7, win: ['S', 'W'] },     // SW
];
// 데크 평면 (탑 제외 ㄱ자, CCW)
const DECKPOLY = [[904.7, 1094.7], [905.7, 1216.2], [913.7, 1216.2], [913.7, 1197.0], [938.9, 1197.0], [938.9, 1216.2], [1139.8, 1216.2],
  [1139.8, 1194.5], [1159.0, 1194.5], [1157.0, 952.8], [1136.8, 952.8], [1136.8, 930.9], [1033.0, 931.8], [1034.4, 1093.6]];
// 입면: p0→p1 (CCW, 바깥 = 진행 오른쪽), n 칸, 양끝 (corner|tower), 1층 피어 칸 경계, 1층 구성
const FACADES = [
  { id: 'W2', p0: [904.7, 1094.7], p1: [905.7, 1216.2], n: 6, ends: ['corner', 'corner'], gp: [2, 4], ground: [[0, 6, 'low']] },
  { id: 'S', p0: [938.9, 1216.2], p1: [1139.8, 1216.2], n: 9, ends: ['tower', 'tower'], gp: [2, 4, 7], ground: [[0, 4, 'enclosed'], [4, 7, 'park'], [7, 9, 'bus']], street: true },
  { id: 'E', p0: [1159.0, 1194.5], p1: [1157.0, 952.8], n: 12, ends: ['tower', 'tower'], gp: [2, 4, 6, 8, 10], ground: [[0, 2, 'terminal'], [2, 10, 'fence'], [10, 12, 'brick']], street: true },
  { id: 'N', p0: [1136.8, 930.9], p1: [1033.0, 931.8], n: 5, ends: ['tower', 'corner'], gp: [1, 3], ground: [[0, 1, 'low'], [1, 3, 'open'], [3, 5, 'low']] },
  { id: 'W', p0: [1033.0, 931.8], p1: [1034.4, 1093.6], n: 8, ends: ['corner', 'corner'], gp: [2, 4, 6], ground: [[0, 8, 'low']] },
  { id: 'N2', p0: [1034.4, 1093.6], p1: [904.7, 1094.7], n: 6, ends: ['corner', 'corner'], gp: [2, 4], ground: [[0, 6, 'low']] },
];

/** 결정적 난수 (차량 배치) */
function rng(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

export function build(M, G) {
  const parts = [];
  const P = (geom, mat, cast = true) => parts.push({ geom, mat, cast });
  // ---- 재질
  const brick = M.brick_red.clone(); brick.color = new THREE.Color(0.9, 0.74, 0.68);                // 사진의 짙은 적갈색 벽돌
  const stone = M.limestone, conc = M.concrete;
  const tan = new THREE.MeshStandardMaterial({ color: 0xd8c596, roughness: 0.85 });            // 황갈색 프리캐스트 (사진: 매끈한 면)
  const cream = M.precast.clone(); cream.color = new THREE.Color(1.08, 1.03, 0.9);               // 1층 크림색 벽
  const terracotta = new THREE.MeshStandardMaterial({ color: 0x874436, roughness: 0.85 });
  const inner = new THREE.MeshStandardMaterial({ color: 0x24262a, roughness: 0.9 });
  const metalDark = new THREE.MeshStandardMaterial({ color: 0x1e2124, roughness: 0.5, metalness: 0.5 });
  const frameWhite = new THREE.MeshStandardMaterial({ color: 0xdcdcd6, roughness: 0.5, metalness: 0.2 });
  const yellow = M.paintYellow;
  const blue = new THREE.MeshStandardMaterial({ color: 0x1f4f9a, roughness: 0.6 });
  const lampGlass = new THREE.MeshStandardMaterial({ color: 0xf4f1e6, emissive: 0x6b6250, roughness: 0.3 });
  const deckTop = conc;
  const ceil = new THREE.MeshStandardMaterial({ color: 0x57544f, roughness: 0.95 });
  const floor0 = new THREE.MeshStandardMaterial({ color: 0x4a4844, roughness: 0.95 });   // 지상층 바닥 (어두운 실내)

  // ---- 캔버스 텍스처 (사인·배너·철책·코벨 띠)
  const canvasTex = (W, H, draw, repeat) => {
    const c = document.createElement('canvas'); c.width = W; c.height = H; draw(c.getContext('2d'), W, H);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
    if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...repeat); }
    return t;
  };
  const alphaMat = (t, extra = {}) => new THREE.MeshStandardMaterial({ map: t, transparent: true, alphaTest: 0.35, roughness: 0.6, side: THREE.DoubleSide, ...extra });
  const letters = (txt, font, fill = '#f4f4f2', stroke = 'rgba(60,60,60,0.6)') => (g, W, H) => {
    g.clearRect(0, 0, W, H); g.font = font; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.lineWidth = Math.max(2, H * 0.03); g.strokeStyle = stroke; g.strokeText(txt, W / 2, H / 2 + H * 0.04); g.fillStyle = fill; g.fillText(txt, W / 2, H / 2 + H * 0.04);
  };
  const mTerre = alphaMat(canvasTex(1024, 220, (g, W, H) => {
    g.clearRect(0, 0, W, H);
    g.font = 'bold 118px Georgia, "Times New Roman", serif'; g.textAlign = 'center'; g.textBaseline = 'alphabetic';
    g.lineWidth = 4; g.strokeStyle = 'rgba(70,70,80,0.7)'; g.strokeText('TERRE HAUTE', W / 2, H - 22); g.fillStyle = '#eef0f4'; g.fillText('TERRE HAUTE', W / 2, H - 22);
    g.strokeStyle = '#e8ebf0'; g.lineWidth = 12; g.beginPath(); g.moveTo(560, H - 40); g.quadraticCurveTo(760, 10, 930, 30); g.stroke();   // 스우시
  }), { metalness: 0.3 });
  const mTransit = alphaMat(canvasTex(512, 96, letters('TRANSIT', 'bold 70px Georgia, serif', '#f0f0f0')));
  const mBusEntry = alphaMat(canvasTex(768, 96, letters('BUS ENTRY', '72px Arial, Helvetica, sans-serif', '#f6f6f6', 'rgba(90,80,60,0.5)')));
  const mPark = alphaMat(canvasTex(512, 128, letters('PARK', 'bold 104px Arial, sans-serif')));
  const mExit = alphaMat(canvasTex(512, 128, letters('EXIT', 'bold 104px Arial, sans-serif')));
  const mPsign = new THREE.MeshStandardMaterial({ roughness: 0.5, side: THREE.DoubleSide, map: canvasTex(128, 448, (g, W, H) => {
    g.fillStyle = '#1d4fa3'; g.fillRect(0, 0, W, H); g.strokeStyle = '#ffffff'; g.lineWidth = 3; g.strokeRect(4, 4, W - 8, H - 8);
    g.fillStyle = '#d8262e'; g.beginPath(); g.arc(W / 2 - 18, 60, 36, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#fff'; g.font = 'bold 56px Arial'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('P', W / 2 - 18, 62);
    g.font = 'bold 22px Arial'; g.textAlign = 'left'; ['ISU', 'Parking', 'Garage'].forEach((t, i) => g.fillText(t, 14, 132 + i * 28));
    g.font = '14px Arial'; ['$1/hr or $6/day', 'Payment Required', 'at Exit'].forEach((t, i) => g.fillText(t, 14, 230 + i * 20));
  }) });
  const mBanner = new THREE.MeshStandardMaterial({ roughness: 0.7, side: THREE.DoubleSide, map: canvasTex(64, 256, (g, W, H) => {
    g.fillStyle = '#1f4c9c'; g.fillRect(0, 0, W, H); g.strokeStyle = '#dfe8f6'; g.lineWidth = 5;
    for (let k = 0; k < 3; k++) { g.beginPath(); g.moveTo(4, 70 + k * 38); g.bezierCurveTo(24, 50 + k * 38, 40, 96 + k * 38, 60, 72 + k * 38); g.stroke(); }
    g.fillStyle = '#e9eef7'; g.fillRect(14, 196, 36, 6); g.fillRect(18, 208, 28, 4);
  }) });
  const mFence = alphaMat(canvasTex(64, 64, (g, W, H) => { g.clearRect(0, 0, W, H); g.fillStyle = '#16181a'; for (let i = 0; i < 4; i++) g.fillRect(i * 16 + 6, 0, 4, H); }, [48, 1.5]), { roughness: 0.5, metalness: 0.4 });
  const mFrieze = new THREE.MeshStandardMaterial({ roughness: 0.9, map: canvasTex(128, 96, (g, W, H) => {   // 작은 반원 아치 코벨 띠 (2.4 ft 피치)
    g.fillStyle = '#9b4f3f'; g.fillRect(0, 0, W, H);
    g.fillStyle = '#6a3127'; g.beginPath(); g.moveTo(14, H); g.lineTo(14, 52); g.arc(64, 52, 50, Math.PI, 0); g.lineTo(114, H); g.fill();
    g.strokeStyle = '#b8705c'; g.lineWidth = 6; g.beginPath(); g.arc(64, 52, 53, Math.PI, 0); g.stroke();
    g.fillStyle = '#a95a48'; g.fillRect(0, 0, W, 6);
  }, [10, 12 / 1.8]) });
  const carMats = [0xe8e8e6, 0xb9bcc0, 0x26282b, 0x8a1d1d, 0x2c4a7a, 0x6e7378, 0xd9d4c7].map(c => new THREE.MeshStandardMaterial({ color: c, roughness: 0.35, metalness: 0.5 }));
  const carGlass = new THREE.MeshStandardMaterial({ color: 0x1b2026, roughness: 0.15, metalness: 0.6 });

  // ---- 입면 좌표계 헬퍼
  const frame = (p0, p1) => {
    const dx = p1[0] - p0[0], dz = p1[1] - p0[1], len = Math.hypot(dx, dz);
    const ex = [dx / len, dz / len], ez = [-dz / len, dx / len];
    return { p0, p1, len, ex, ez, ry: -Math.atan2(dz, dx), at: (u, v) => [p0[0] + ex[0] * u + ez[0] * v, p0[1] + ex[1] * u + ez[1] * v] };
  };
  const fbox = (F, u0, u1, y0, y1, v0, v1) => { const [x, z] = F.at((u0 + u1) / 2, (v0 + v1) / 2); return G.box(u1 - u0, y1 - y0, v1 - v0, x, y0, z, { ry: F.ry }); };
  const basis = (F, v) => { const m = new THREE.Matrix4().makeBasis(new THREE.Vector3(F.ex[0], 0, F.ex[1]), UP, new THREE.Vector3(F.ez[0], 0, F.ez[1])); const o = F.at(0, v); m.setPosition(o[0], 0, o[1]); return m; };
  const fixUV = (g, su = 1 / 24, sv = 1 / 12) => { const uv = g.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * su, uv.getY(i) * sv); return g; };
  /** 입면 평면의 Shape(u, y) 를 두께 v0..v1 로 압출 */
  const fextrude = (F, shape, v0, v1, seg = 10) => { const g = new THREE.ExtrudeGeometry(shape, { depth: v1 - v0, bevelEnabled: false, curveSegments: seg }); fixUV(g); g.applyMatrix4(basis(F, v0)); return g; };
  /** 입면 평면의 Shape 를 얇은 면으로 (바깥 법선) */
  const fshape = (F, shape, v, seg = 10) => { const g = new THREE.ShapeGeometry(shape, seg); fixUV(g, 1 / 8, 1 / 8); g.applyMatrix4(basis(F, v)); return g; };
  /** 텍스처 판 (uv 0..1): 중심 u, 하단 y, 폭 w, 높이 h, v 위치 */
  const fplane = (F, u, y, w, h, v) => { const g = new THREE.PlaneGeometry(w, h); g.translate(u, y + h / 2, 0); g.applyMatrix4(basis(F, v)); return g; };
  const V2 = (x, y) => new THREE.Vector2(x, y);
  const rectShape = (u0, y0, u1, y1) => new THREE.Shape([V2(u0, y0), V2(u1, y0), V2(u1, y1), V2(u0, y1)]);
  /** 분절(또는 반원) 아치 개구: u0..u1, 하단 b, 스프링 spring, 정점 crown */
  const archPath = (u0, u1, b, spring, crown, P = THREE.Path) => {
    const w = u1 - u0, h = crown - spring, R = (w * w / 4 + h * h) / (2 * h), cx = (u0 + u1) / 2, cy = crown - R;
    const a0 = Math.atan2(spring - cy, u1 - cx);
    const p = new P(); p.moveTo(u0, b); p.lineTo(u1, b); p.lineTo(u1, spring); p.absarc(cx, cy, R, a0, Math.PI - a0, false); p.lineTo(u0, b);
    return p;
  };
  const archTopY = (u0, u1, spring, crown, u) => { const w = u1 - u0, h = crown - spring, R = (w * w / 4 + h * h) / (2 * h), cx = (u0 + u1) / 2; return crown - R + Math.sqrt(Math.max(0, R * R - (u - cx) ** 2)); };

  // =====================================================================================  입면
  for (const f of FACADES) {
    const F = frame(f.p0, f.p1), n = f.n, pitch = F.len / n, pu = i => i * pitch;
    const pierW = i => (i === 0 || i === n) ? (f.ends[i === 0 ? 0 : 1] === 'tower' ? 0 : 3.4) : (f.gp.includes(i) ? 2.8 : 2.4);
    const pierU = i => Math.min(Math.max(pu(i), pierW(i) / 2), F.len - pierW(i) / 2);
    // 피어
    for (let i = 0; i <= n; i++) {
      const w = pierW(i); if (!w) continue;
      const u = pierU(i), full = w > 2.5;
      if (full) {
        P(fbox(F, u - w / 2, u + w / 2, 4.6, PAR, -2.0, 0.6), brick);
        P(fbox(F, u - w / 2 - 0.35, u + w / 2 + 0.35, 0, 4.1, -2.4, 0.95), stone);           // 러스티케이션 석재 받침
        for (const y of [1.35, 2.7]) P(fbox(F, u - w / 2 - 0.4, u + w / 2 + 0.4, y, y + 0.12, -2.45, 1.0), inner, false);   // 줄눈
        P(fbox(F, u - w / 2 - 0.45, u + w / 2 + 0.45, 4.1, 4.6, -2.5, 1.05), stone);         // 갓돌
      } else {
        P(fbox(F, u - w / 2, u + w / 2, 19.8, PAR, -1.8, 0.45), brick);
      }
    }
    // L2 벽돌 띠 + 석재 띠/갓돌, L3·L4 프리캐스트 패널
    P(fbox(F, 0, F.len, 12.8, 19.3, -1.0, 0), brick);
    P(fbox(F, 0, F.len, 12.0, 12.8, -1.1, 0.15), stone);
    P(fbox(F, 0, F.len, 19.3, 19.8, -1.15, 0.22), stone);
    for (const [a, b] of [P3, P4]) {
      P(fbox(F, 0, F.len, a, b, -0.95, -0.35), tan);
      P(fbox(F, 0, F.len, b, b + 0.35, -1.0, -0.15), tan);
      P(fbox(F, 0, F.len, a - 0.25, a, -0.95, -0.4), inner, false);                           // 패널 하단 그늘 줄
    }
    // 최상층 아치벽 + 옥상 파라펫 (한 장, 아치 개구)
    const sh = rectShape(0, P4[1], F.len, PAR);
    for (let i = 0; i < n; i++) {
      const u0 = pierU(i) + pierW(i) / 2 + 0.6, u1 = pierU(i + 1) - pierW(i + 1) / 2 - 0.6;
      sh.holes.push(archPath(u0, u1, P4[1] + 0.35, SPRING, CROWN));
      P(fbox(F, u0 - 0.6, u0, P4[1] + 0.35, SPRING + 0.4, -1.05, 0.1), stone);   // 아치 받침(임포스트)
      P(fbox(F, u1, u1 + 0.6, P4[1] + 0.35, SPRING + 0.4, -1.05, 0.1), stone);
      P(fbox(F, (u0 + u1) / 2 - 0.55, (u0 + u1) / 2 + 0.55, CROWN - 0.2, CROWN + 1.4, -1.05, 0.15), stone);   // 쐐기돌
    }
    P(fextrude(F, sh, -1.0, 0, 12), brick);
    // 코벨 아케이드 띠 + 코니스
    P(fbox(F, 0, F.len, 49.6, 51.2, -0.2, 0.08), mFrieze);
    P(fbox(F, -0.6, F.len + 0.6, PAR, PAR + 0.4, -1.3, 0.55), stone);
    P(fbox(F, -0.8, F.len + 0.8, PAR + 0.4, TOP, -1.3, 0.85), tan);

    // 1층
    for (const [i0, i1, type] of f.ground) {
      const a = pierU(i0) + pierW(i0) / 2, b = pierU(i1) - pierW(i1) / 2;
      if (type === 'low') {
        P(fbox(F, a, b, 0, 3.2, -1.0, -0.2), brick); P(fbox(F, a, b, 3.2, 3.6, -1.1, -0.1), stone);
      } else if (type === 'enclosed') {
        P(fbox(F, a, b, 0, 12.0, -1.4, -0.8), cream);
        for (let k = 1; k < (b - a) / 10; k++) P(fbox(F, a + k * 10 - 0.08, a + k * 10 + 0.08, 0, 12, -0.82, -0.75), inner, false);   // 패널 줄눈
        P(fbox(F, a, b, 0, 0.6, -0.85, -0.55), stone);
        for (const c of [a + (b - a) * 0.3, a + (b - a) * 0.72]) { P(fbox(F, c - 1.6, c + 1.6, 0, 7.2, -0.85, -0.7), metalDark); P(fbox(F, c - 1.9, c + 1.9, 7.2, 7.6, -0.85, -0.6), stone); }
      } else if (type === 'brick') {
        P(fbox(F, a, b, 0, 12.0, -1.2, -0.4), brick);
        const c = (a + b) / 2; P(fbox(F, c - 1.6, c + 1.6, 0, 7.2, -0.45, -0.3), metalDark);
        P(fbox(F, a, b, 0, 0.6, -0.45, -0.25), stone);
      } else if (type === 'fence') {
        for (let i = i0; i < i1; i += 2) {
          const s = pierU(i) + pierW(i) / 2, e = pierU(i + 2) - pierW(i + 2) / 2;
          P(fbox(F, s, e, 0, 8.0, -1.3, -1.24), mFence, false);
          P(fbox(F, s, e, 7.8, 8.1, -1.36, -1.18), metalDark);
          for (let u = s + 8; u < e - 2; u += 8) P(fbox(F, u - 0.15, u + 0.15, 0, 8.1, -1.4, -1.1), metalDark);
        }
      } else if (type === 'terminal') {
        // 터미널 유리 출입구 (2 ft 후퇴), 출입문 2쌍, 상부 크림색 인방
        P(fbox(F, a + 0.4, b - 0.4, 0, 10.2, -3.2, -3.05), M.pane, false);
        for (let u = a + 0.4; u <= b - 0.3; u += (b - a - 0.8) / 6) P(fbox(F, u - 0.15, u + 0.15, 0, 10.2, -3.05, -2.85), metalDark);
        P(fbox(F, a + 0.4, b - 0.4, 7.6, 7.9, -3.05, -2.85), metalDark);
        P(fbox(F, a + 0.4, b - 0.4, 0, 0.5, -3.05, -2.85), metalDark);
        for (const c of [a + (b - a) * 0.36, a + (b - a) * 0.64]) P(fbox(F, c - 2.8, c + 2.8, 0, 7.6, -3.0, -2.9), carGlass);
        P(fbox(F, a, b, 10.2, 12.0, -3.4, -1.0), cream);
        P(fbox(F, a, b, 0, 12, -14, -13), inner, false);
      }
    }
    // 가로등형 벽부 램프 (도로면 1층 피어 상부) + 배너 (상부 피어) + 버스전용 표지
    if (f.street) {
      for (let i = 1; i < n; i++) {
        const u = pierU(i);
        if (f.gp.includes(i)) {
          P(fbox(F, u - 0.12, u + 0.12, 20.4, 20.7, 0.6, 1.7), metalDark);
          const [x, z] = F.at(u, 1.75);
          P(G.cylinder(0.32, 0.6, x, 20.0, z, 8), metalDark);
          const gl = new THREE.SphereGeometry(0.62, 10, 8); gl.scale(1, 1.25, 1); gl.translate(x, 21.4, z); P(gl, lampGlass, false);
          const cap = new THREE.ConeGeometry(0.55, 0.6, 8); cap.translate(x, 22.5, z); P(cap, metalDark);
          if (f.id === 'E') P(fbox(F, u - 0.6, u + 0.6, 5.0, 6.8, 0.95, 1.02), M.white, false);
        } else {
          P(fbox(F, u - 0.06, u + 0.06, 30.0, 39.9, 0.45, 0.6), metalDark);
          P(fbox(F, u - 0.06, u + 0.06, 39.7, 39.9, 0.45, 3.4), metalDark);
          P(fbox(F, u - 0.06, u + 0.06, 31.0, 31.2, 0.45, 3.4), metalDark);
          P(fbox(F, u - 0.03, u + 0.03, 31.2, 39.7, 0.7, 3.3), mBanner, false);
        }
      }
    }
    // 남면 사인
    if (f.id === 'S') {
      const U = x => x - F.p0[0];
      P(fbox(F, U(1095.5), U(1139.8), 12.0, 13.7, -1.1, 0.25), stone);                       // 버스 진입구 하부 석재 띠 (BUS ENTRY)
      P(fplane(F, U(1112.5), 12.35, 8.6, 1.08, 0.27), mBusEntry, false);
      P(fbox(F, U(1108.4), U(1125.6), 13.95, 15.25, -0.2, 0.42), stone);                     // TRANSIT 판
      P(fplane(F, U(1121.3), 14.15, 6.0, 1.0, 0.44), mTransit, false);
      P(fplane(F, U(1116.6), 15.3, 17.5, 3.75, 0.2), mTerre, false);
      P(fplane(F, U(1082), 13.35, 4.6, 1.15, 0.03), mPark, false);
      P(fplane(F, U(1048), 13.35, 3.8, 1.0, 0.03), mExit, false);
      P(fbox(F, U(1028), U(1095), 12.0, 12.6, -1.6, -0.9), inner, false);                    // 진출입구 상부 그늘
    }
    if (f.id === 'E') P(fplane(F, pu(1), 15.1, 15.0, 3.2, 0.2), mTerre, false);
  }
  // SW 탑 서쪽 짧은 남면 (x 905.7–913.7): 막힌 벽돌 모서리
  {
    const F = frame([905.7, 1216.2], [913.7, 1216.2]);
    P(fbox(F, 0, F.len, 4.6, PAR, -2.0, 0.3), brick); P(fbox(F, -0.3, F.len, 0, 4.6, -2.3, 0.6), stone);
    P(fbox(F, 0, F.len, 12.0, 12.8, -1.1, 0.4), stone); P(fbox(F, 0, F.len, 19.3, 19.8, -1.15, 0.4), stone);
    P(fbox(F, -0.6, F.len, PAR, PAR + 0.4, -1.3, 0.55), stone); P(fbox(F, -0.8, F.len, PAR + 0.4, TOP, -1.3, 0.85), tan);
  }

  // =====================================================================================  데크 · 램프 · 내부
  const slabPoly = G.offsetPoly(DECKPOLY, 1.0);
  const rampHole = rect(RAMP.x0, RAMP.zN, RAMP.x1, RAMP.zS);
  const cw = h => [...h].reverse();
  const flip = g => { const idx = g.index.array; for (let i = 0; i < idx.length; i += 3) { const t = idx[i + 1]; idx[i + 1] = idx[i + 2]; idx[i + 2] = t; } const nn = g.attributes.normal; if (nn) for (let i = 0; i < nn.count; i++) nn.setXYZ(i, -nn.getX(i), -nn.getY(i), -nn.getZ(i)); return g; };
  P(G.capGeometry(slabPoly, [], 0.12), floor0, false);                                       // 지상층 바닥
  for (let k = 1; k <= 4; k++) {
    const holes = [rampHole, ...SLOTS].map(cw);
    const e = G.extrudePoly(slabPoly, holes, 1.0, { y0: LV[k] - 1 });
    P(e.sides, conc); P(e.top, deckTop);
    P(flip(G.capGeometry(slabPoly, holes, LV[k] - 1)), ceil);
    // 램프 개구 양옆 파라펫, 슬롯 둘레 난간벽
    for (const x of [RAMP.x0 - 0.35, RAMP.x1 + 0.35]) P(G.box(0.7, 3.4, RAMP.zS - RAMP.zN, x, LV[k], (RAMP.zS + RAMP.zN) / 2), conc);
    if (k === 4) P(G.box(RAMP.x1 - RAMP.x0, 3.4, 0.7, (RAMP.x0 + RAMP.x1) / 2, LV[k], RAMP.zS + 0.35), conc);
    for (const s of SLOTS) P(G.sideGeometry(G.offsetPoly(s, -0.7), LV[k], LV[k] + 3.4, 1 / 24, 1 / 12, true), conc), P(G.sideGeometry(cw(s), LV[k], LV[k] + 3.4, 1 / 24, 1 / 12, true), conc);
    for (const s of SLOTS) P(G.extrudePoly(G.offsetPoly(s, -0.7), [cw(s)], 0.01, { y0: LV[k] + 3.4 }).top, conc);
  }
  // 적층 램프 (남단 LV[k] → 북단 LV[k+1]), 측면 연석
  for (let k = 0; k < 4; k++) {
    const L = RAMP.zS - RAMP.zN, w = RAMP.x1 - RAMP.x0, dy = LV[k + 1] - LV[k];
    const g = new THREE.BoxGeometry(w, 1, L); const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) pos.setY(i, pos.getY(i) - 0.5 + LV[k] + dy * (0.5 - pos.getZ(i) / L));
    g.translate((RAMP.x0 + RAMP.x1) / 2, 0, (RAMP.zS + RAMP.zN) / 2); g.computeVertexNormals(); fixUV(g);
    P(g, deckTop);
    for (const x of [RAMP.x0 + 0.5, RAMP.x1 - 0.5]) {
      const c = new THREE.BoxGeometry(1.0, 1.2, L); const cp = c.attributes.position;
      for (let i = 0; i < cp.count; i++) cp.setY(i, cp.getY(i) + 0.6 + LV[k] + dy * (0.5 - cp.getZ(i) / L));
      c.translate(x, 0, (RAMP.zS + RAMP.zN) / 2); c.computeVertexNormals(); P(c, conc);
    }
    // 램프 중앙 화살표 대신 황색 중앙선
    const ln = new THREE.BoxGeometry(0.4, 0.05, L - 4); const lp = ln.attributes.position;
    for (let i = 0; i < lp.count; i++) lp.setY(i, lp.getY(i) + 0.03 + LV[k] + dy * (0.5 - lp.getZ(i) / L));
    ln.translate((RAMP.x0 + RAMP.x1) / 2, 0, (RAMP.zS + RAMP.zN) / 2); ln.computeVertexNormals(); P(ln, yellow, false);
  }
  // 더블티 리브 (동서 방향, 5 ft 간격) — 데크 개구부·탑은 제외
  const ribIntervals = z => {
    let iv = [];
    if (z > 933 && z < 1215) iv.push([z < 953.5 ? 1034.6 : 1034.6, z < 953.5 ? 1136 : (z > 1194 ? 1139 : 1156)]);
    if (z > 1095.5 && z < 1215) iv.push([906.5, 1034.6]);
    if (z > 1196 && z < 1216) iv = iv.flatMap(([a, b]) => cut([a, b], 913, 939.6));
    const holes = [[RAMP.x0 - 0.7, RAMP.x1 + 0.7, RAMP.zN, RAMP.zS], [1088.3, 1097.7, 1129, 1169], [944.3, 1030.7, 1155, 1163]];
    for (const [a, b, z0, z1] of holes) if (z > z0 && z < z1) iv = iv.flatMap(s => cut(s, a, b));
    // 이어 붙이기
    iv.sort((p, q) => p[0] - q[0]); const out = [];
    for (const s of iv) { if (out.length && s[0] <= out[out.length - 1][1] + 0.1) out[out.length - 1][1] = Math.max(out[out.length - 1][1], s[1]); else out.push([...s]); }
    return out.filter(s => s[1] - s[0] > 1);
  };
  const cut = ([a, b], c, d) => (d <= a || c >= b) ? [[a, b]] : [[a, Math.min(b, c)], [Math.max(a, d), b]].filter(s => s[1] - s[0] > 0.5);
  for (let k = 1; k <= 4; k++) for (let z = 935; z < 1215; z += 5) for (const [a, b] of ribIntervals(z)) P(G.box(b - a, 2.0, 0.6, (a + b) / 2, LV[k] - 3.0, z), ceil);
  // 내부 기둥 (모듈 경계)
  for (let z = 942; z < 1212; z += 22.5) if (!(z > 1127 && z < 1171)) P(G.box(2, LV[4] - 1, 2, 1098.5, 0, z), conc);
  for (let x = 927; x < 1030; x += 21.6) P(G.box(2, LV[4] - 1, 2, x, 0, 1152.5), conc);
  // 지상층 버스 구역 안쪽 어두운 칸막이 (터미널 실내·설비실; 관통 시야 차단 — 사진상 내부는 어둡다)
  P(G.box(120, 15, 1.0, 1096, 0, 1100), inner, false);
  P(G.box(1.0, 15, 160, 1060, 0, 1020), inner, false);
  // 남면 PARK 진입구 안쪽 엘리베이터 홀 (크림색 벽 + 문)
  P(G.box(30, 12, 10, 1043, 0, 1191), cream);
  for (const x of [1036, 1050]) P(G.box(3.2, 7.2, 0.3, x, 0, 1196.1), metalDark);

  // =====================================================================================  옥상: 주차선 · 조명주
  const quads = [];
  const quad = (x0, z0, x1, z1, y) => quads.push(x0, y, z0, x0, y, z1, x1, y, z1, x0, y, z0, x1, y, z1, x1, y, z0);
  const yR = LV[4] + 0.03;
  const inRampOrSlot = (x, z) => (x > RAMP.x0 - 1 && x < RAMP.x1 + 1 && z > RAMP.zN - 1 && z < RAMP.zS + 1) || (x > 1087 && x < 1099 && z > 1127 && z < 1171) || (x > 943 && x < 1032 && z > 1153 && z < 1165);
  // 본동: 동서 방향 줄 (stall 9 ft), 4열
  for (const [x0, x1] of [[1036.5, 1054], [1078.5, 1096], [1099, 1116.5], [1138.5, 1155.5]])
    for (let z = 938; z < 1213; z += 9) {
      if (x1 > 1137 && (z > 1193 || z < 954)) continue;
      if (inRampOrSlot((x0 + x1) / 2, z)) continue;
      quad(x0, z - 0.18, x1, z + 0.18, yR);
    }
  // 날개: 남북 방향 줄, 4열
  for (const [z0, z1] of [[1096.5, 1114], [1137, 1154.5], [1163.5, 1181], [1198, 1214.5]])
    for (let x = 908; x < 1033; x += 9) {
      if (z1 > 1197 && x > 911 && x < 941) continue;
      if (inRampOrSlot(x, (z0 + z1) / 2)) continue;
      quad(x - 0.18, z0, x + 0.18, z1, yR);
    }
  { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(quads, 3)); g.computeVertexNormals(); P(g, yellow, false); }
  // 조명주 (20 ft, 쌍등)
  const poles = [[1062, 950], [1062, 1080], [1062, 1140], [1062, 1200], [1127, 965], [1127, 1035], [1127, 1105], [1127, 1180], [1044, 1010], [930, 1128], [995, 1128], [965, 1190], [1020, 1190]];
  for (const [x, z] of poles) {
    P(G.cylinder(0.9, 2.5, x, LV[4], z, 8), conc);
    P(G.cylinder(0.22, 20, x, LV[4] + 2.5, z, 6), metalDark);
    P(G.box(5.0, 0.25, 0.3, x, LV[4] + 22.2, z), metalDark);
    for (const d of [-2.4, 2.4]) P(G.box(1.6, 0.5, 1.0, x + d, LV[4] + 21.8, z), metalDark);
  }

  // =====================================================================================  차량 · 버스
  const R = rng(7);
  const car = (x, z, y, along) => {      // along: 'x' 이면 차 길이가 x 방향
    const m = carMats[Math.floor(R() * carMats.length)];
    const L = 15 + R() * 2, W = 6.1;
    const [lx, lz] = along === 'x' ? [L, W] : [W, L];
    P(G.box(lx * 0.85, 0.9, lz * 0.85, x, y, z), metalDark, false);
    P(G.box(lx, 2.2, lz, x, y + 0.75, z), m);
    const [cx, cz] = along === 'x' ? [L * 0.5, W - 0.6] : [W - 0.6, L * 0.5];
    P(G.box(cx, 1.5, cz, x, y + 2.95, z), carGlass);
  };
  // 데크별 외곽 주차열 (외벽에서 10 ft 안쪽) — 개구부로 보이는 차
  for (let k = 1; k <= 4; k++) {
    const p = k === 4 ? 0.3 : 0.55;
    for (const f of FACADES) {
      const F = frame(f.p0, f.p1);
      for (let u = 8; u < F.len - 8; u += 9) {
        if (R() > p) continue;
        const [x, z] = F.at(u, -11);
        if (inRampOrSlot(x, z)) continue;
        car(x, z, LV[k], Math.abs(F.ex[0]) > 0.7 ? 'z' : 'x');
      }
    }
  }
  // 옥상 중앙열 차량
  for (let z = 942; z < 1210; z += 9) for (const x of [1087, 1108]) if (R() < 0.22 && !inRampOrSlot(x, z)) car(x, z, LV[4], 'x');
  for (let x = 912; x < 1030; x += 9) for (const z of [1146, 1172]) if (R() < 0.25 && !inRampOrSlot(x, z)) car(x, z, LV[4], 'z');
  // 지상층: 터미널 버스 3대 (흰색 + 청색 띠)
  for (const [x, z] of [[1140, 1060], [1128, 1120], [1117, 1170]]) {
    P(G.box(8.5, 9.0, 40, x, 0.9, z), M.white);
    P(G.box(8.6, 3.0, 36, x, 5.0, z - 1), carGlass);
    P(G.box(8.6, 0.8, 40.1, x, 2.4, z), blue);
    P(G.box(7.5, 0.9, 30, x, 0, z), metalDark, false);
  }
  for (let x = 912; x < 1020; x += 9) if (R() < 0.4) car(x, 1105, 0, 'z');

  // =====================================================================================  계단탑
  for (const T of TOWERS) tower(T);

  function tower(T) {
    const H = 57.6, poly = rect(T.x0, T.z0, T.x1, T.z1);
    const faces = { W: [poly[0], poly[1]], S: [poly[1], poly[2]], E: [poly[2], poly[3]], N: [poly[3], poly[0]] };
    P(G.box(T.x1 - T.x0 - 2, H, T.z1 - T.z0 - 2, (T.x0 + T.x1) / 2, 0, (T.z0 + T.z1) / 2), inner, false);   // 내부 어둠
    for (const [k, [p0, p1]] of Object.entries(faces)) {
      const F = frame(p0, p1), L = F.len, c = L / 2;
      if (!T.win.includes(k)) { P(fbox(F, 0, L, 0, H, -1.0, 0), brick); continue; }
      const sh = rectShape(0, 0, L, H);
      const arch = [c - 8.0, c + 8.0, 2.2, 7.0, 15.0];
      sh.holes.push(archPath(...arch));
      const rw = [[c - 8.6, c - 0.6], [c + 0.6, c + 8.6]], aw = [[c - 7.0, c - 2.0], [c + 2.0, c + 7.0]];
      const rf = [[17.6, 27.1], [28.6, 38.1]], af = [[40.0, 45.4, 47.7], [49.3, 54.7, 57.0]];
      for (const [y0, y1] of rf) for (const [u0, u1] of rw) sh.holes.push(new THREE.Path([V2(u0, y0), V2(u1, y0), V2(u1, y1), V2(u0, y1)]));
      for (const [b, s, cr] of af) for (const [u0, u1] of aw) sh.holes.push(archPath(u0, u1, b, s, cr));
      P(fextrude(F, sh, -1.0, 0, 14), brick);
      // 1층 아치창: 유리 + 멀리언 + 석재 아치 테·쐐기돌·임포스트
      P(fshape(F, archPath(...arch, THREE.Shape), -0.7, 16), M.pane, false);
      for (const du of [-5.4, -2.7, 0, 2.7, 5.4]) { const u = c + du; P(fbox(F, u - 0.13, u + 0.13, 2.2, archTopY(arch[0], arch[1], 7.0, 15.0, u), -0.7, -0.45), frameWhite); }
      P(fbox(F, arch[0], arch[1], 6.9, 7.15, -0.7, -0.45), frameWhite);
      { const ring = new THREE.Shape(); ring.absarc(c, 7.0, 9.0, 0, Math.PI, false); ring.lineTo(c - 8.0, 7.0); ring.absarc(c, 7.0, 8.0, Math.PI, 0, true); ring.lineTo(c + 9.0, 7.0); P(fextrude(F, ring, -0.2, 0.3, 16), stone); }
      P(fbox(F, c - 0.75, c + 0.75, 14.6, 16.9, -0.2, 0.45), stone);
      for (const s of [-1, 1]) P(fbox(F, c + s * 8.5 - 0.8, c + s * 8.5 + 0.8, 6.4, 7.0, -0.2, 0.3), stone);
      P(fbox(F, arch[0] - 0.4, arch[1] + 0.4, 1.7, 2.2, -0.2, 0.35), stone);
      // 2·3층 사각창 (2×3 분할)
      for (const [y0, y1] of rf) for (const [u0, u1] of rw) {
        P(fbox(F, u0, u1, y0, y1, -0.7, -0.62), M.pane, false);
        const um = (u0 + u1) / 2, h = y1 - y0;
        P(fbox(F, um - 0.14, um + 0.14, y0, y1, -0.62, -0.42), frameWhite);
        for (const t of [1 / 3, 2 / 3]) P(fbox(F, u0, u1, y0 + h * t - 0.12, y0 + h * t + 0.12, -0.62, -0.42), frameWhite);
        P(fbox(F, u0 - 0.35, u1 + 0.35, y0 - 0.45, y0, -0.2, 0.35), stone);                    // 창대
      }
      // 4·5층 반원머리 창
      for (const [b, s, cr] of af) for (const [u0, u1] of aw) {
        P(fshape(F, archPath(u0, u1, b, s, cr, THREE.Shape), -0.7, 10), M.pane, false);
        const um = (u0 + u1) / 2;
        P(fbox(F, um - 0.12, um + 0.12, b, cr - 0.1, -0.62, -0.42), frameWhite);
        P(fbox(F, u0, u1, s - 0.12, s + 0.12, -0.62, -0.42), frameWhite);
        P(fbox(F, u0, u1, (b + s) / 2 - 0.1, (b + s) / 2 + 0.1, -0.62, -0.42), frameWhite);
        P(fbox(F, u0 - 0.3, u1 + 0.3, b - 0.4, b, -0.2, 0.3), stone);
        { const ring = new THREE.Shape(); const r = (u1 - u0) / 2; ring.absarc(um, s, r + 0.55, 0, Math.PI, false); ring.lineTo(um - r, s); ring.absarc(um, s, r, Math.PI, 0, true); ring.lineTo(um + r + 0.55, s); P(fextrude(F, ring, -0.1, 0.18, 10), stone); }
      }
    }
    // 모서리 필라스터 + 석재 받침
    const cx = (T.x0 + T.x1) / 2, cz = (T.z0 + T.z1) / 2;
    for (const [x, z] of poly) {
      const ix = x < cx ? 1 : -1, iz = z < cz ? 1 : -1;
      P(G.box(3.4, H - 4.6, 3.4, x + ix * 1.3, 4.6, z + iz * 1.3), brick);
      P(G.box(4.1, 4.2, 4.1, x + ix * 1.3, 0, z + iz * 1.3), stone);
      P(G.box(4.3, 0.45, 4.3, x + ix * 1.3, 4.2, z + iz * 1.3), stone);
    }
    // 석재 띠 (둘레)
    const ring = (y0, y1, d, mat) => P(G.box(T.x1 - T.x0 + 2 * d, y1 - y0, T.z1 - T.z0 + 2 * d, cx, y0, cz), mat);
    ring(0, 2.2, 0.25, stone);
    ring(14.7, 15.5, 0.55, stone); ring(16.4, 16.9, 0.5, stone); ring(27.1, 27.6, 0.5, stone); ring(38.1, 38.6, 0.5, stone); ring(48.2, 48.6, 0.5, stone);
    // 코벨 띠 + 코니스 + 피라미드 지붕
    ring(H, H + 1.5, 0.45, mFrieze);
    ring(H + 1.5, H + 2.0, 0.9, stone); ring(H + 2.0, H + 2.6, 1.5, tan);
    const ov = 2.2, yE = H + 2.6, base = rect(T.x0 - ov, T.z0 - ov, T.x1 + ov, T.z1 + ov);
    P(loft(base, yE, cx, cz, 67.5), terracotta);
    P(G.box(T.x1 - T.x0 + 2 * ov, 0.5, T.z1 - T.z0 + 2 * ov, cx, yE - 0.5, cz), tan);
  }

  // =====================================================================================  가로 요소 (Cherry St 버스 진입로)
  const yb = (x0, z0, x1, z1, h = 0.55, w = 0.6) => {    // 황색 연석 선분
    const L = Math.hypot(x1 - x0, z1 - z0); P(G.box(L, h, w, (x0 + x1) / 2, 0, (z0 + z1) / 2, { ry: -Math.atan2(z1 - z0, x1 - x0) }), yellow);
  };
  // 남면 앞 콘크리트 진입로·보도 포장 (사이트 지면이 잔디로 되어 있어 덮음), 적색 포석 띠, SE 탑 앞 화단
  P(G.box(270, 0.2, 24, 1040, 0, 1228.4), M.walk, false);
  P(G.box(18, 0.2, 18, 1170, 0, 1229), M.walk, false);
  const red = new THREE.MeshStandardMaterial({ color: 0xa4513f, roughness: 0.9 });
  for (const [x, z, w, d, r] of [[1131.5, 1223.5, 3.5, 5, 0], [1090, 1226.5, 8, 3.5, 0]]) P(G.box(w, 0.1, d, x, 0.15, z, { ry: r }), red, false);
  const hedge = new THREE.MeshStandardMaterial({ color: 0x26381f, roughness: 1 });
  P(G.box(17, 2.4, 3.2, 1152.5, 0, 1224.4), hedge);
  P(G.box(3.2, 2.4, 20, 1166.3, 0, 1205), hedge);
  P(G.box(80, 2.6, 3.0, 983, 0, 1219), hedge);
  // 버스 진입로 동측 보도 연석 (SE 탑 앞) / 서측 섬
  yb(1136.6, 1216.5, 1136.6, 1226); yb(1136.6, 1226, 1148, 1232.2);    // 이후 8th St 쪽은 가로 레이어(street.json)의 황색 연석과 이어짐
  yb(1094.3, 1217, 1094.3, 1224.5); yb(1094.3, 1224.5, 1082, 1227.5); yb(1082, 1227.5, 1030, 1228.5);
  // PARK/EXIT 섬 (부스·차단기) — 섬 2개
  for (const [x0, x1] of [[1059, 1064], [1040.5, 1044.5]]) {
    P(G.box(x1 - x0, 0.5, 26, (x0 + x1) / 2, 0, 1213), yellow);
    for (const z of [1201, 1225.5]) P(G.cylinder(0.35, 3.6, x0 + 0.5, 0.5, z, 8), yellow), P(G.cylinder(0.35, 3.6, x1 - 0.5, 0.5, z, 8), yellow);
  }
  // 요금 부스 (흰색, 창 띠) + 발권기 + 차단기 팔
  P(G.box(4.2, 7.0, 6.5, 1061.5, 0.5, 1208), M.white);
  P(G.box(4.4, 2.6, 6.7, 1061.5, 4.0, 1208), carGlass);
  P(G.box(5.0, 0.4, 7.4, 1061.5, 7.5, 1208), metalDark);
  for (const [x, z, dir] of [[1064.6, 1218, 1], [1058.4, 1213, -1], [1044.9, 1219, 1]]) {
    P(G.box(1.1, 4.4, 1.2, x, 0.5, z), metalDark);
    P(G.box(1.3, 3.8, 1.3, x - dir * 1.6, 0.5, z + 2.5), M.white);     // 발권/정산기
    P(G.box(10.5, 0.22, 0.22, x + dir * 5.4, 3.7, z), M.white);       // 차단기 팔
    for (let s = 1; s < 10; s += 2) P(G.box(0.9, 0.24, 0.24, x + dir * (s + 0.6), 3.69, z), M.paintYellow, false);
  }
  // 버스 진입로 앞 삼각형 섬
  { const tri = [[1096, 1233], [1100, 1242], [1106, 1233]]; const e = G.extrudePoly(tri, [], 0.55); P(e.sides, yellow); P(e.top, conc); }
  // 파란 P 사인 (8th & Cherry 모서리 보도)
  {
    const ry = -Math.PI / 4;
    P(G.box(2.4, 7.4, 0.5, 1141.2, 0.6, 1237, { ry }), blue);
    P(G.box(2.7, 0.6, 0.8, 1141.2, 0, 1237, { ry }), metalDark);
    for (const s of [1, -1]) {   // 판면 법선 (-0.707, 0, 0.707) = 남서향, 뒷면은 반대
      const g = new THREE.PlaneGeometry(2.3, 7.2); g.rotateY(-Math.PI / 4 + (s < 0 ? Math.PI : 0));
      g.translate(1141.2 - s * 0.27 * Math.SQRT1_2, 4.3, 1237 + s * 0.27 * Math.SQRT1_2); P(g, mPsign, false);
    }
  }

  const grp = new THREE.Group();
  for (const m of G.mergeByMaterial(parts)) grp.add(m);
  return grp;
}

/** 아래 사각형(yB) → 정점(cx, yT, cz) 피라미드. 법선 바깥·위 */
function loft(bot, yB, cx, cz, yT) {
  const pos = [], uv = [], n = bot.length;
  for (let i = 0; i < n; i++) {
    const a = bot[i], b = bot[(i + 1) % n], L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    pos.push(a[0], yB, a[1], b[0], yB, b[1], cx, yT, cz); uv.push(0, 0, L / 12, 0, L / 24, 1);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.computeVertexNormals();
  return g;
}
