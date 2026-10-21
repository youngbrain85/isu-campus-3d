// ISU Parking Garage / Cherry Street Garage (1층 Terre Haute Transit 버스 터미널) — 사진·위성 기반 모델 (도면 없음)
// 근거: Street View vp74 (Cherry St, 남측 차로에서 북향 000/045/315), Esri z20·z19 위성.
//   층수: 지상 1층(버스 터미널·주차 진출입, 층고 14 ft) + 주차 데크 3개층(층고 10.5 ft) + 옥상 주차 데크 = 5 레벨.
//     데크 슬래브 y = 14 / 24.5 / 35 / 45.5, 코니스 상단 52.5 ft. (site.json h 60.7 은 모서리 계단탑 지붕 높이에 해당)
//   재료: 기둥(2.5×2.5 ft)·1층 스팬드럴·최상층 아치벽 = 붉은 벽돌, 기둥 하부 4.5 ft 러스티케이션 석재(cast stone),
//     데크 스팬드럴 = 황갈색 프리캐스트 패널(3.5 ft), 슬래브 단부 프리캐스트, 코니스 프리캐스트.
//   입면 리듬: 베이 ≈17.5 ft (남 6·북 6·서 16·동 14 베이). 최상층은 베이마다 반원 아치(폭 12 ft, 스프링 44.5, 정점 50.5)
//     — 아치 안쪽으로 옥상 데크 슬래브·스팬드럴이 보임(사진 vp74_315).
//   남면 1층: 전체 개방(버스 진입 + PARK/EXIT 차량 진출입), 상부 벽돌 스팬드럴(9.5~12.5) 위아래 프리캐스트 띠.
//   계단탑: 남동·북동 모서리(위성: 적갈색 피라미드 지붕 ≈25×27 ft). 벽돌, 도로면(남/동, 북/동)에 2층~4층 큰 창(10×7)
//     + 1층 반원 아치창(폭 11, 정점 15.5), 층마다 프리캐스트 띠, 코니스 54~55.5, 피라미드 지붕 정점 67 ft (vp74_045).
//   옥상: 위성에 보이는 중앙 램프 슬롯 2개(x 1092~1102, z 982~1052 / 1121~1159) 를 슬래브 개구 + 낮은 난간으로 표현.
//   사진에 없어 가정한 것: 서·북·동면 1층(벽돌 낮은 담 4 ft + 개방), 램프 경사면 자체, 남서 모서리(사진 vp74_315 원경의
//     탑처럼 보이는 것은 위성에 지붕이 없어 인접 건물로 판단), 계단탑의 가려진 면 창.
import * as THREE from 'three';

export const meta = {
  id: 'garage', name: 'ISU Parking Garage (Cherry Street Garage / Terre Haute Transit)', osm: 'way/545275306',
  anchor: [0, 0], rotation: 0, height: 67,
  preset: { pos: [1250, 170, 1470], tgt: [1097, 15, 1073] },
  sheets: 'Street View vp74 (2019), Esri imagery z20/z19',
};

const UP = new THREE.Vector3(0, 1, 0);
const X0 = 1034, X1 = 1158, Z0 = 931.3, Z1 = 1216;           // 본체 외곽 (ft)
const DECK = [14, 24.5, 35, 45.5];                             // 데크 슬래브 상단
const SLAB = 1.5, SPAN = 3.5, PIER = 2.5;
const ARCH0 = 38.5, SPRING = 44.5, CORN = 50.5, TOP = 52.5;    // 아치벽 하단 / 스프링 / 코니스 하단 / 상단
const SE = { x0: 1139.8, x1: 1164.3, z0: 1194.5, z1: 1222.4, street: ['S', 'E'] };
const NE = { x0: 1136.8, x1: 1163.2, z0: 926.6, z1: 952.8, street: ['N', 'E'] };

const rect = (x0, z0, x1, z1) => [[x0, z0], [x0, z1], [x1, z1], [x1, z0]];   // CCW (site 규약)

export function build(M, G) {
  const parts = [];
  const brick = M.brick_red, stone = M.limestone;
  const tan = M.precast.clone(); tan.color = new THREE.Color(1.07, 0.98, 0.82);          // 황갈색 프리캐스트
  const terracotta = new THREE.MeshStandardMaterial({ color: 0x874436, roughness: 0.9 });
  const inner = M.dark;

  // ---- 외곽 벽 구간 (CCW): 서 → 남 → 동(탑 사이) → 북. 각 구간 [p0, p1, 베이 수]
  const walls = [
    [[X0, Z0], [X0, Z1], 16],                  // 서면 (남향 진행)
    [[X0, Z1], [SE.x0, Z1], 6],                // 남면 (동향)
    [[X1, SE.z0], [X1, NE.z1], 14],            // 동면 (북향, 두 탑 사이)
    [[NE.x0, Z0], [X0, Z0], 6],                // 북면 (서향)
  ];
  for (const [p0, p1, nb] of walls) {
    const dx = p1[0] - p0[0], dz = p1[1] - p0[1], len = Math.hypot(dx, dz);
    const ex = [dx / len, dz / len], ez = [-dz / len, dx / len];       // ez = 바깥
    const pitch = len / nb;
    const south = p0[1] === Z1 && p1[1] === Z1;
    // 기둥 + 석재 기초 (각 베이 시작점; 마지막 끝점은 다음 벽의 첫 기둥 또는 탑)
    for (let i = 0; i <= nb; i++) {
      if (i === nb && !(south)) continue;                       // 남면 끝(탑 접합부)만 추가
      const s = Math.min(Math.max(i * pitch, PIER / 2), len - PIER / 2);
      const cx = p0[0] + ex[0] * s - ez[0] * PIER / 2, cz = p0[1] + ex[1] * s - ez[1] * PIER / 2;
      parts.push({ geom: G.box(PIER, CORN - 4.5, PIER, cx, 4.5, cz), mat: brick });
      parts.push({ geom: G.box(PIER + 0.6, 4.5, PIER + 0.6, cx, 0, cz), mat: stone });
    }
    // 1층: 남면은 전체 개방, 그 외는 벽돌 낮은 담(4 ft) + 석재 갓돌
    if (!south) {
      parts.push({ geom: G.sideGeometry([p0, p1], 0, 3.7, 1 / 24, 1 / 12, false), mat: brick });
      parts.push({ geom: G.box(len, 0.4, 1.4, (p0[0] + p1[0]) / 2 - ez[0] * 0.5, 3.7, (p0[1] + p1[1]) / 2 - ez[1] * 0.5, { ry: -Math.atan2(dz, dx) }), mat: stone });
    }
    // 1층 상부 벽돌 스팬드럴 (9.5~12.5) + 아래 프리캐스트 띠 (9.0~9.5)
    parts.push({ geom: G.sideGeometry([p0, p1], 9.5, DECK[0] - SLAB, 1 / 24, 1 / 12, false), mat: brick });
    parts.push({ geom: G.box(len, 0.5, 1.2, (p0[0] + p1[0]) / 2 - ez[0] * 0.5, 9.0, (p0[1] + p1[1]) / 2 - ez[1] * 0.5, { ry: -Math.atan2(dz, dx) }), mat: tan });
    // 데크 2·3·4 스팬드럴 (프리캐스트) — 슬래브 단부는 슬래브 박스가 담당
    for (let k = 0; k < 3; k++) parts.push({ geom: G.sideGeometry([p0, p1], DECK[k], DECK[k] + SPAN, 1 / 24, 1 / 12, false), mat: tan });
    // 최상층 아치벽 (벽돌, 베이마다 반원 아치 개구)
    const shape = new THREE.Shape([new THREE.Vector2(0, ARCH0), new THREE.Vector2(len, ARCH0), new THREE.Vector2(len, CORN), new THREE.Vector2(0, CORN)]);
    for (let i = 0; i < nb; i++) {
      const c = (i + 0.5) * pitch, r = Math.min(6, (pitch - PIER - 2) / 2);
      shape.holes.push(archPath(c - r, c + r, ARCH0, SPRING + (6 - r)));
    }
    parts.push({ geom: planeGeom(shape, p0, p1, 0), mat: brick });
    // 코니스 (프리캐스트, 0.5 ft 돌출)
    parts.push({ geom: G.box(len + 1, TOP - CORN, 1.8, (p0[0] + p1[0]) / 2 - ez[0] * 0.4, CORN, (p0[1] + p1[1]) / 2 - ez[1] * 0.4, { ry: -Math.atan2(dz, dx) }), mat: tan });
  }

  // ---- 데크 슬래브 (프리캐스트, 1.5 ft) + 안쪽 어두운 면(개방 층 내부 표현)
  const main = rect(X0, Z0, X1, Z1);
  for (let k = 0; k < 3; k++) {
    const e = G.extrudePoly(main, [], SLAB, { y0: DECK[k] - SLAB });
    parts.push({ geom: e.sides, mat: M.precast }); parts.push({ geom: e.top, mat: M.concrete, cast: false });
  }
  // 옥상 데크: 1 ft 후퇴 (아치 안쪽으로 보임), 램프 슬롯 2개 개구 + 낮은 난간
  const roofPoly = rect(X0 + 1, Z0 + 1, X1 - 1, Z1 - 1);
  const slots = [rect(1092, 982, 1102, 1052), rect(1092, 1121, 1102, 1159)].map(h => [...h].reverse());   // 구멍은 CW
  const re = G.extrudePoly(roofPoly, slots, SLAB, { y0: DECK[3] - SLAB });
  parts.push({ geom: re.sides, mat: M.precast }); parts.push({ geom: re.top, mat: M.concrete, cast: false });
  parts.push({ geom: G.sideGeometry(roofPoly, DECK[3], DECK[3] + 3, 1 / 24, 1 / 12, true), mat: tan });          // 옥상 스팬드럴
  for (const h of slots) {
    const hr = [...h].reverse();
    parts.push({ geom: G.sideGeometry(G.offsetPoly(hr, -0.8), DECK[3], DECK[3] + 3.2, 1 / 24, 1 / 12, true), mat: tan });
    parts.push({ geom: G.sideGeometry(h, DECK[3] - 12, DECK[3] - SLAB, 1 / 24, 1 / 12, true), mat: inner, cast: false });   // CW → 법선이 구멍 안쪽
  }
  // 층별 내부 어두운 면 (외곽에서 10 ft 안쪽, 슬래브 사이)
  const innerPoly = G.offsetPoly(main, 10);
  const lv = [0, ...DECK];
  for (let k = 0; k < 4; k++) parts.push({ geom: G.sideGeometry(innerPoly, lv[k], lv[k + 1] - SLAB, 1 / 24, 1 / 12, true), mat: inner, cast: false });

  // ---- 남면 1층 차량 진출입 부스 2개 + 연석
  for (const x of [1046, 1058]) parts.push({ geom: G.box(4, 8, 7, x, 0, Z1 - 8), mat: M.trim });
  parts.push({ geom: G.box(X1 - X0, 0.5, 1, (X0 + X1) / 2, 0, Z1 - 0.5), mat: M.curb, cast: false });

  // ---- 모서리 계단탑
  for (const T of [SE, NE]) tower(parts, T, M, G, brick, stone, tan, terracotta);

  const grp = new THREE.Group();
  for (const m of G.mergeByMaterial(parts)) grp.add(m);
  return grp;
}

function tower(parts, T, M, G, brick, stone, tan, terracotta) {
  const poly = rect(T.x0, T.z0, T.x1, T.z1);
  const faces = { W: [poly[0], poly[1]], S: [poly[1], poly[2]], E: [poly[2], poly[3]], N: [poly[3], poly[0]] };
  const H = 55.5;
  for (const [k, [p0, p1]] of Object.entries(faces)) {
    const len = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]);
    if (!T.street.includes(k)) { parts.push({ geom: G.sideGeometry([p0, p1], 0, H, 1 / 24, 1 / 12, false), mat: brick }); continue; }
    // 도로면: 1층 아치창 + 2~4층 큰 창
    const c = len / 2, aw = 11, ar = aw / 2;
    const shape = new THREE.Shape([new THREE.Vector2(0, 0), new THREE.Vector2(len, 0), new THREE.Vector2(len, H), new THREE.Vector2(0, H)]);
    shape.holes.push(archPath(c - ar, c + ar, 4.5, 15.5 - ar));
    const wins = [[16, 23], [26.5, 33.5], [37, 44]];
    for (const [b, t] of wins) shape.holes.push(new THREE.Path([new THREE.Vector2(c - 5, b), new THREE.Vector2(c - 5, t), new THREE.Vector2(c + 5, t), new THREE.Vector2(c + 5, b)]));
    parts.push({ geom: planeGeom(shape, p0, p1, 0), mat: brick });
    // 유리 (0.5 ft 후퇴) + 멀리언
    const gs = new THREE.Shape(archPath(c - ar, c + ar, 4.5, 15.5 - ar).getPoints(24));
    parts.push({ geom: planeGeom(gs, p0, p1, 0.5, 1 / 11, 1 / 11), mat: M.pane, cast: false });
    for (const [b, t] of wins) {
      parts.push({ geom: planeGeom(new THREE.Shape([new THREE.Vector2(c - 5, b), new THREE.Vector2(c + 5, b), new THREE.Vector2(c + 5, t), new THREE.Vector2(c - 5, t)]), p0, p1, 0.5, 1 / 10, 1 / 7), mat: M.pane, cast: false });
      // 창 멀리언(십자) + 프리캐스트 창대
      const mid = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2], ez = [-(p1[1] - p0[1]) / len, (p1[0] - p0[0]) / len], ry = -Math.atan2(p1[1] - p0[1], p1[0] - p0[0]);
      parts.push({ geom: G.box(0.3, t - b, 0.3, mid[0] - ez[0] * 0.3, b, mid[1] - ez[1] * 0.3, { ry }), mat: M.trim });
      parts.push({ geom: G.box(10, 0.3, 0.3, mid[0] - ez[0] * 0.3, (b + t) / 2, mid[1] - ez[1] * 0.3, { ry }), mat: M.trim });
      parts.push({ geom: G.box(11, 0.6, 1.2, mid[0] + ez[0] * 0.1, b - 0.6, mid[1] + ez[1] * 0.1, { ry }), mat: tan });
    }
  }
  // 석재 기초 4.5 ft, 층별 프리캐스트 띠, 코니스
  const ring = (y, h, d, mat) => { const o = G.offsetPoly(poly, -d); const e = G.extrudePoly(o, [], h, { y0: y }); parts.push({ geom: e.sides, mat }); parts.push({ geom: e.top, mat }); };
  ring(0, 4.5, 0.4, stone);
  for (const y of [15.5, 25.5, 36, 46.5]) ring(y, 0.8, 0.3, tan);
  ring(54, 1.5, 0.8, tan);
  // 피라미드 지붕 (처마 2 ft 돌출, 정점 67)
  const ov = 2, cx = (T.x0 + T.x1) / 2, cz = (T.z0 + T.z1) / 2;
  const base = rect(T.x0 - ov, T.z0 - ov, T.x1 + ov, T.z1 + ov);
  parts.push({ geom: loft(base, H, base.map(() => [cx, cz]), 67), mat: terracotta });
  parts.push({ geom: G.box(T.x1 - T.x0 + 2 * ov, 0.6, T.z1 - T.z0 + 2 * ov, cx, H - 0.6, cz), mat: tan });   // 처마 판
}

// ---- 헬퍼 ----
/** 벽면 평면 좌표(u = p0→p1 거리, y) 의 Shape 를 세워 월드에 놓는다. inset: 안쪽으로 밀기 (ft). */
function planeGeom(shape, p0, p1, inset = 0, uvU = 1 / 24, uvV = 1 / 12) {
  const dx = p1[0] - p0[0], dz = p1[1] - p0[1], len = Math.hypot(dx, dz);
  const g = new THREE.ShapeGeometry(shape, 12);
  const uv = g.attributes.uv, pos = g.attributes.position;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, pos.getX(i) * uvU, pos.getY(i) * uvV);
  const ex = new THREE.Vector3(dx / len, 0, dz / len), ez = new THREE.Vector3().crossVectors(ex, UP);
  const m = new THREE.Matrix4().makeBasis(ex, UP, ez); m.setPosition(p0[0] - ez.x * inset, 0, p0[1] - ez.z * inset);
  g.applyMatrix4(m);
  return g;
}
/** 반원 아치 상부 개구 경로: s..e, 바닥 b, 스프링 라인 spring (반지름 = (e-s)/2) */
function archPath(s, e, b, spring) {
  const r = (e - s) / 2, cx = (s + e) / 2;
  const p = new THREE.Path(); p.moveTo(s, b); p.lineTo(s, spring); p.absarc(cx, spring, r, Math.PI, 0, true); p.lineTo(e, b); p.closePath();
  return p;
}
/** 아래 폴리곤(yB) → 위 폴리곤(yT, 같은 개수·대응) 을 잇는 면 (피라미드/힙/만사드). 법선 바깥·위. */
function loft(bot, yB, top, yT) {
  const pos = [], uv = [], n = bot.length;
  for (let i = 0; i < n; i++) {
    const a = bot[i], b = bot[(i + 1) % n], ta = top[i], tb = top[(i + 1) % n];
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    pos.push(a[0], yB, a[1], b[0], yB, b[1], tb[0], yT, tb[1]); uv.push(0, 0, L / 24, 0, L / 24, 1);
    if (Math.hypot(tb[0] - ta[0], tb[1] - ta[1]) > 1e-6) { pos.push(a[0], yB, a[1], tb[0], yT, tb[1], ta[0], yT, ta[1]); uv.push(0, 0, L / 24, 1, 0, 1); }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.computeVertexNormals();
  return g;
}
