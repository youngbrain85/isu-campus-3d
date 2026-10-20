// 헤드리스 렌더: node tools/shot.mjs <preset,...> [outdir]   (EXPORT=1 이면 첫 프리셋에서 GLB 도 저장)
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const presets = (process.argv[2] || 'campus').split(',');
const outdir = process.argv[3] || 'shots';
fs.mkdirSync(outdir, { recursive: true });
const port = 8765;
const server = spawn(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['http-server', '.', '-p', String(port), '-s', '-c-1'], { stdio: 'ignore', shell: process.platform === 'win32' });
await new Promise(r => setTimeout(r, 2000));
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'] });
try {
  for (const p of presets) {
    const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
    const logs = [];
    page.on('console', m => logs.push(m.type() + ': ' + m.text()));
    page.on('pageerror', e => logs.push('PAGEERROR: ' + e.message));
    const t0 = Date.now();
    await page.goto(`http://localhost:${port}/viewer/index_local.html?shot=${p}&low=${process.env.LOW || '0'}`, { waitUntil: 'load' });
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
    const bad = logs.filter(l => /error|PAGEERROR|TIMEOUT|status|site:/i.test(l));
    if (bad.length) console.log(bad.slice(0, 15).join('\n'));
    await page.close();
  }
} finally {
  await browser.close();
  server.kill();
}
