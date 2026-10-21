// 헤드리스 렌더: node tools/shot.mjs <preset,...> [outdir]
//   env: EXPORT=1 첫 프리셋에서 GLB 저장, PORT=서버 포트(기본 8765), MOD=buildings/foo.js 미등록 모듈 임시 로드, LOW=1 저사양
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const presets = (process.argv[2] || 'campus').split(',');
const outdir = process.argv[3] || 'shots';
fs.mkdirSync(outdir, { recursive: true });
const port = parseInt(process.env.PORT || '8765');
const server = spawn(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['http-server', '.', '-p', String(port), '-s', '-c-1'], { stdio: 'ignore', shell: process.platform === 'win32' });
// 서버가 뜰 때까지 대기 (최대 30 s)
for (let i = 0; i < 60; i++) {
  try { const r = await fetch(`http://localhost:${port}/viewer/index_local.html`); if (r.ok) break; } catch (e) {}
  await new Promise(r => setTimeout(r, 500));
}
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'] });
try {
  for (const p of presets) {
    const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
    const logs = [];
    page.on('console', m => logs.push(m.type() + ': ' + m.text()));
    page.on('pageerror', e => logs.push('PAGEERROR: ' + e.message));
    const t0 = Date.now();
    await page.goto(`http://localhost:${port}/viewer/index_local.html?shot=${p}&low=${process.env.LOW || '0'}${process.env.MOD ? '&mod=' + process.env.MOD : ''}${process.env.QS || ''}`, { waitUntil: 'load' });
    try {
      await page.waitForFunction(() => window.__ready === true || document.getElementById('status')?.textContent?.startsWith('Error'), null, { timeout: parseInt(process.env.TMO || '300000') });
    } catch (e) { logs.push('TIMEOUT waiting for __ready'); }
    logs.push('status: ' + await page.evaluate(() => document.getElementById('status')?.textContent));
    await page.screenshot({ path: path.join(outdir, `${p}.png`), timeout: 120000 });
    if (process.env.EXPORT === '1' && p === presets[0]) {
      fs.mkdirSync('model', { recursive: true });
      const [dl, size] = await Promise.all([page.waitForEvent('download', { timeout: 600000 }), page.evaluate(() => window.exportGLB())]);
      await dl.saveAs(path.join('model', 'isu_campus.glb'));
      console.log('GLB exported', (size / 1e6).toFixed(1), 'MB');
    }
    console.log(p, 'done in', ((Date.now() - t0) / 1000).toFixed(1), 's');
    const bad = logs.filter(l => /error|PAGEERROR|TIMEOUT|status|site:|cull/i.test(l));
    if (bad.length) console.log(bad.slice(0, 15).join('\n'));
    await page.close();
  }
} finally {
  await browser.close();
  server.kill();
}
