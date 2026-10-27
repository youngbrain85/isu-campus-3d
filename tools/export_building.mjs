// VR 용 단일 건물 GLB 내보내기: node tools/export_building.mjs [osm id] [group name] [out]
//   기본: Technology Building (cTED) → model/ted_vr.glb (단위 m, WALKABLE / COLLISION / VISUAL 노드)
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
const [id = 'way/461428305', grp = 'bldg_tech', out = 'model/ted_vr.glb'] = process.argv.slice(2);
const port = parseInt(process.env.PORT || '8790');
const server = spawn(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['http-server', '.', '-p', String(port), '-s', '-c-1'], { stdio: 'ignore', shell: process.platform === 'win32' });
for (let i = 0; i < 60; i++) { try { if ((await fetch(`http://localhost:${port}/viewer/index_local.html`)).ok) break; } catch (e) {} await new Promise(r => setTimeout(r, 500)); }
const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
try {
  const p = await b.newPage({ acceptDownloads: true });
  await p.goto(`http://localhost:${port}/viewer/index_local.html?solo=${encodeURIComponent(id)}&shot=tech`);
  await p.waitForFunction(() => window.__ready === true, null, { timeout: 300000 });
  const [dl, info] = await Promise.all([p.waitForEvent('download', { timeout: 600000 }), p.evaluate((g) => window.exportBuildingGLB(g), grp)]);
  fs.mkdirSync('model', { recursive: true }); await dl.saveAs(out);
  console.log(out, (info.size / 1e6).toFixed(1), 'MB', JSON.stringify(info.counts));
} finally { await b.close(); server.kill(); }
