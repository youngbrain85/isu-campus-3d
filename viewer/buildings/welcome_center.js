// John W. Moore Welcome Center — former Home Economics Building (Miller, Vrydagh & Miller, 1955)
// 치수 근거 (도면 세트 "Home Ec 1955 originals", 1/8" = 1'-0"):
//   sheet 3 First Floor Plan: 전체 길이 171'-1¾" (평면 가로, 남북 방향), 1층 사무동 85'-8¼" × 약 33', 입구 23'-9",
//     2층 블록 61'-8½" × 110'-9"; 좌상단 테라스 담장 72'-8¼", 좌측 담장 1'-0" 두께
//   sheet 4 Second Floor Plan: 2층 = 우측 블록 61'-8½" 폭 + 계단실 베이 17'-6" (전체 79'-2½"), 깊이 ≈14'
//   sheet 5 Elevations: 1st FL 101'-10", 2nd FL 115'-2" (층고 13'-4"), 지면 101'-0"; 북측(우측) 입면 전면 커튼월 12' 베이 × 3 패널,
//     1층 사무동 창 A 3'-10⅜"×6'-1⅛" 띠창 + 스터코 밴드, 면벽돌 + 석재 창대, 평지붕(built-up tar & gravel) + 알루미늄 파시아
// 로컬 프레임: 평면도 기준 x = 오른쪽(= 북), z = 아래(= 동, 6th Street 쪽 전면). 원점 = 사무동 전면 좌측(남동) 모서리.
import * as THREE from 'three';

export const meta = {
  id: 'welcome', name: 'John W. Moore Welcome Center', osm: 'way/461428310',
  anchor: [-76.4, 404.16], rotation: -89.654,   // tools/fit_footprint.py 결과 (RMS 2.8 ft)
  height: 27,
  preset: { pos: [130, 120, 470], tgt: [-126, 8, 318] },
  sheets: 'Home Economics Building 1955: sheets 1, 3, 4, 5, 6',
};

const H1 = 13.5, H2 = 26.5, PAR = 1.5;   // 1층 지붕, 2층 지붕, 파시아 높이 (ft, 1층 바닥 = 0)

export const outline = [[0, 0], [85.7, 0], [107.3, 0], [107.3, 4.5], [170.3, 4.5], [170.3, -104.5], [71.8, -104.5], [71.8, -88.5], [81.8, -88.5], [81.8, -33], [0, -33]];

export function build(M, G) {
  const parts = [];
  const brick = M.brick_red, trim = M.trim;

  // ---- 1층 사무동 (x 0..85.7, z -33..0): 면벽돌, 전면·배면 띠창 + 스터코 밴드
  const bar = [[0, 0], [85.7, 0], [85.7, -33], [0, -33]];
  parts.push({ geom: G.sideGeometry([[85.7, 0], [85.7, -33]], 0, H1, 1 / 24, 1 / 12, false), mat: brick });   // 동쪽 끝? (실제 입구와 접함)
  parts.push({ geom: G.sideGeometry([[0, -33], [0, 0]], 0, H1, 1 / 24, 1 / 12, false), mat: brick });            // 남측 끝벽
  for (const [p0, p1] of [[[0, 0], [85.7, 0]], [[85.7, -33], [0, -33]]]) {                                    // 전면(동) / 배면(서) 띠창
    const w = G.windowGrid(p0, p1, { y0: 0, rows: 1, rowH: H1, colW: 4.0, winW: 3.6, winH: 6.1, sill: 3.4, margin: 2 });
    parts.push({ geom: w.wall, mat: brick }); parts.push({ geom: w.glass, mat: M.pane, cast: false });
    parts.push({ geom: G.box(85.7, 2.4, 0.3, 42.85, 10.2, p0[1] + (p0[1] === 0 ? 0.15 : -0.15)), mat: trim });  // 스터코 밴드
  }
  roof(parts, bar, H1, M, G);
  // 전면 화단(planter box) + 돌 갓돌
  parts.push({ geom: G.box(85.7, 2.0, 3.0, 42.85, 0, 1.6), mat: M.limestone });

  // ---- 입구 로비 (x 85.7..107.3, z -33..0): 1층, 전면 고정유리 + 알루미늄, 상부 2층 계단탑 유리
  const lobby = [[85.7, 0], [107.3, 0], [107.3, -33], [85.7, -33]];
  parts.push({ geom: G.sideGeometry([[85.7, 0], [107.3, 0]], 0, H1, 1 / 24, 1 / 12, false), mat: M.glass });   // 전면 유리벽
  parts.push({ geom: G.sideGeometry([[107.3, -33], [85.7, -33]], 0, H1, 1 / 24, 1 / 12, false), mat: brick });
  roof(parts, lobby, H1, M, G);
  // 캐노피 (출입구 위, 전면으로 6 ft 돌출)
  parts.push({ geom: G.box(21.6, 0.8, 7, 96.5, 9.6, 3.0), mat: M.white });

  // ---- 2층 블록 (x 107.3..170.3, z -104.5..4.5) + 1층 서측 라운지 (x 81.8..107.3, z -104.5..-33) + 여자화장실 돌출(x 71.8..81.8, z -104.5..-88.5)
  const west1 = [[81.8, -33], [107.3, -33], [107.3, -104.5], [71.8, -104.5], [71.8, -88.5], [81.8, -88.5]];
  // 1층 서측부 벽 (남: z=-33 면은 사무동/로비와 접하므로 x 81.8..85.7 구간만 노출)
  parts.push({ geom: G.sideGeometry([[71.8, -104.5], [71.8, -88.5]], 0, H1, 1 / 24, 1 / 12, false), mat: brick });
  parts.push({ geom: G.sideGeometry([[71.8, -88.5], [81.8, -88.5]], 0, H1, 1 / 24, 1 / 12, false), mat: brick });
  {
    const w = G.windowGrid([81.8, -88.5], [81.8, -33], { y0: 0, rows: 1, rowH: H1, colW: 4.0, winW: 3.6, winH: 6.1, sill: 3.4, margin: 3 });  // 테라스 쪽 (서) 띠창
    parts.push({ geom: w.wall, mat: brick }); parts.push({ geom: w.glass, mat: M.pane, cast: false });
  }
  parts.push({ geom: G.sideGeometry([[107.3, -104.5], [71.8, -104.5]], 0, H1, 1 / 24, 1 / 12, false), mat: brick });  // 배면(서) 1층
  roof(parts, west1, H1, M, G);

  const blk = [[107.3, 4.5], [170.3, 4.5], [170.3, -104.5], [107.3, -104.5]];
  // 전면(동, z=4.5): 좌측 12 ft 는 2층 높이 유리 계단탑, 나머지 면벽돌 + 2층 창
  parts.push({ geom: G.sideGeometry([[107.3, 4.5], [119.3, 4.5]], 0, H2, 1 / 24, 1 / 12, false), mat: M.glass });
  {
    const w = G.windowGrid([119.3, 4.5], [170.3, 4.5], { y0: 0, rows: 2, rowH: H2 / 2, colW: 12, winW: 7, winH: 5, sill: 4, margin: 3 });
    parts.push({ geom: w.wall, mat: brick }); parts.push({ geom: w.glass, mat: M.pane, cast: false });
  }
  // 북측(x=170.3): 2층 전면 커튼월 (12' 베이, 유리 + 단열패널)
  parts.push({ geom: G.sideGeometry([[170.3, 4.5], [170.3, -104.5]], 0, H2, 1 / 24, 1 / 12, false), mat: M.glass });
  // 배면(서, z=-104.5): 면벽돌 + 유리블록/창
  {
    const w = G.windowGrid([170.3, -104.5], [107.3, -104.5], { y0: 0, rows: 2, rowH: H2 / 2, colW: 12, winW: 8, winH: 5.5, sill: 3.5, margin: 4 });
    parts.push({ geom: w.wall, mat: brick }); parts.push({ geom: w.glass, mat: M.pane, cast: false });
  }
  // 남측(x=107.3): 1층은 로비·라운지와 접함 → 2층 부분만 노출 (z -33..4.5 는 로비 위, -104.5..-33 은 1층 라운지 위)
  {
    const w = G.windowGrid([107.3, -104.5], [107.3, 4.5], { y0: H1, rows: 1, rowH: H2 - H1, colW: 6, winW: 3.8, winH: 4.6, sill: 3.5, margin: 4 });
    parts.push({ geom: w.wall, mat: brick }); parts.push({ geom: w.glass, mat: M.pane, cast: false });
  }
  roof(parts, blk, H2, M, G);
  // 2층 계단실 베이 (x 91.1..108.6, z -104.5..-90.5) — 1층 지붕 위에 올라앉음
  const stair = [[91.1, -90.5], [108.6, -90.5], [108.6, -104.5], [91.1, -104.5]];
  for (let i = 0; i < 4; i++) parts.push({ geom: G.sideGeometry([stair[i], stair[(i + 1) % 4]], H1, H2, 1 / 24, 1 / 12, false), mat: brick });
  roof(parts, stair, H2, M, G);

  // ---- 테라스 담장 (면벽돌, 석재 갓돌): 좌측 x=0 (z -104.5..-33), 상단 z=-104.5 (x 0..71.8)
  parts.push({ geom: G.box(1.0, 6.0, 71.5, 0.5, 0, -68.75), mat: brick });
  parts.push({ geom: G.box(71.8, 6.0, 1.0, 35.9, 0, -104.0), mat: brick });
  parts.push({ geom: G.box(1.3, 0.3, 71.5, 0.5, 6.0, -68.75), mat: M.limestone });
  parts.push({ geom: G.box(71.8, 0.3, 1.3, 35.9, 6.0, -104.0), mat: M.limestone });
  // 테라스 콘크리트 바닥
  parts.push({ geom: G.capGeometry([[1, -33], [81.8, -33], [81.8, -88.5], [71.8, -88.5], [71.8, -103.5], [1, -103.5]], [], 0.3), mat: M.walk, cast: false });

  const grp = new THREE.Group();
  for (const m of G.mergeByMaterial(parts)) grp.add(m);
  return grp;
}

function roof(parts, poly, y, M, G) {
  const r = G.flatRoof(poly, y, { parapet: 1.5, thick: 0.6 });
  parts.push({ geom: r.slab, mat: M.roof_gravel });
  if (r.parapet) parts.push({ geom: r.parapet, mat: M.trim });
}
