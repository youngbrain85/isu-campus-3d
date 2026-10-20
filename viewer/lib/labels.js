// 건물 이름 스프라이트 라벨
import * as THREE from 'three';
import { centroid } from './geom.js';

export function buildLabels(site, extraHeights = new Map()) {
  const G = new THREE.Group(); G.name = 'labels';
  for (const b of site.buildings) {
    if (!b.name || b.poly.length < 3) continue;
    const c = centroid(b.poly), h = extraHeights.get(b.id) || Math.max(8, b.h);
    const sp = makeLabel(b.name);
    sp.position.set(c[0], h + 14, c[1]);
    G.add(sp);
  }
  return G;
}

export function makeLabel(text) {
  const font = 'bold 28px system-ui, Segoe UI, sans-serif';
  const cv = document.createElement('canvas'); const ctx = cv.getContext('2d');
  ctx.font = font; const w = Math.ceil(ctx.measureText(text).width) + 28;
  cv.width = w; cv.height = 48;
  ctx.font = font; ctx.fillStyle = 'rgba(14,18,24,0.72)';
  roundRect(ctx, 0, 0, w, 48, 10); ctx.fill();
  ctx.fillStyle = '#eef2f6'; ctx.textBaseline = 'middle'; ctx.fillText(text, 14, 25);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace;
  const m = new THREE.SpriteMaterial({ map: t, transparent: true, depthTest: false });
  const s = new THREE.Sprite(m); s.scale.set(w * 0.55, 48 * 0.55, 1); s.name = 'label';
  return s;
}
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
}
