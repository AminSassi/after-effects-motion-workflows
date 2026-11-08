// lib3d — tiny deterministic 3D motion-graphics engine (SVG out, resvg render).
// Repo rules baked in: doc17 3-tone shading, doc18 line boil @12fps, doc12 grain, doc09 continuous camera, doc08 springs/offsets.
import fs from 'fs';
import { Resvg } from '@resvg/resvg-js';
import { feature } from 'topojson-client';
import opentype from 'opentype.js';

export const W = 1920, H = 1080, FPS = 25;
import { fileURLToPath } from 'url';
export const TOOLS = fileURLToPath(new URL('./', import.meta.url));
const LOCALF = TOOLS + 'fonts/';
const FD = fs.existsSync(LOCALF + 'Inter-Bold.otf') ? LOCALF : '/usr/share/fonts/opentype/inter/';
const MD = fs.existsSync(LOCALF + 'DejaVuSansMono.ttf') ? LOCALF : '/usr/share/fonts/truetype/dejavu/';
export const FONTS = ['Regular', 'Medium', 'SemiBold', 'Bold', 'ExtraBold', 'Black'].map(w => FD + `Inter-${w}.otf`).concat([MD + 'DejaVuSansMono.ttf', MD + 'DejaVuSansMono-Bold.ttf']);
export const C = { bg: '#090B0E', bg2: '#0E1116', text: '#F2F2F2', sub: '#9AA4B2', tele: '#5C7C99', red: '#E5484D', amber: '#F5A524', blue: '#5B8DEF', land: '#1C222A', landHi: '#3B1416', landAl: '#1B2A3D' };
// ---------- math / easing ----------
export const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const pr = (t, a, b) => cl((t - a) / (b - a));
export const lerp = (a, b, k) => a + (b - a) * k;
export const L3 = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];
export const expo = x => x >= 1 ? 1 : 1 - Math.pow(2, -10 * x);
export const expoIn = x => x <= 0 ? 0 : Math.pow(2, 10 * x - 10);
export const inOut = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
export const sine = x => -(Math.cos(Math.PI * x) - 1) / 2;
export const spring = (t, t0, dur = 0.55) => { const d = t - t0; if (d <= 0) return 0; const x = d / dur; return cl(1 - Math.exp(-6.5 * x) * Math.cos(x * 7.2), -0.2, 1.12); };
export const rnd = n => { const x = Math.sin(n * 12.9898) * 43758.5453; return x - Math.floor(x); };
export const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
export const mixc = (c1, c2, k) => { const h = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16)); const a = h(c1), b = h(c2); return '#' + a.map((v, i) => Math.round(lerp(v, b[i], cl(k))).toString(16).padStart(2, '0')).join(''); };
export const shadeHex = (c, f) => mixc(c, f > 1 ? '#FFFFFF' : '#000000', f > 1 ? f - 1 : 1 - f);
// keyframed value: keys [[t, v, ease?], ...] (v number or array)
export function kf(t, keys) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) if (t <= keys[i][0]) { const [t0, v0] = keys[i - 1], [t1, v1, e] = keys[i]; const k = (e || inOut)(pr(t, t0, t1)); return Array.isArray(v0) ? v0.map((v, j) => lerp(v, v1[j], k)) : lerp(v0, v1, k); }
  return keys[keys.length - 1][1];
}
// ---------- text ----------
const FM = {}; [[400, 'Regular'], [500, 'Medium'], [600, 'SemiBold'], [700, 'Bold'], [800, 'ExtraBold'], [900, 'Black']].forEach(([w, n]) => FM[w] = opentype.parse(fs.readFileSync(FD + `Inter-${n}.otf`).buffer));
export const tw = (s, size, w = 700, ls = 0) => { const f = FM[w] || FM[700]; let a = 0; for (const ch of s) a += f.charToGlyph(ch).advanceWidth || 0; return a * size / f.unitsPerEm + ls * s.length; };
export const TXT = (x, y, s, o = {}) => `<text x="${x}" y="${y}" fill="${o.fill || C.text}" font-family="Inter" font-weight="${o.w || 800}" font-size="${o.size || 40}" text-anchor="${o.a || 'start'}" letter-spacing="${o.ls || 0}" opacity="${o.op ?? 1}">${esc(s)}</text>`;
export const MONO = (x, y, s, o = {}) => `<text x="${x}" y="${y}" fill="${o.fill || C.tele}" font-family="DejaVu Sans Mono" font-weight="${o.w || 400}" font-size="${o.size || 18}" text-anchor="${o.a || 'start'}" letter-spacing="${o.ls || 1}" opacity="${o.op ?? 1}">${esc(s)}</text>`;
// two-tone kinetic word reveal (doc07)
export function words(t, list, x, y, size, w, t0, stag, o = {}) {
  let out = '', cx = x; const sp = tw(' ', size, w) + (o.ls || 0); const widths = list.map(s => tw(s, size, w, o.ls || 0)); const total = widths.reduce((a, b) => a + b, 0) + sp * (list.length - 1);
  if (o.a === 'middle') cx = x - total / 2;
  list.forEach((wd, i) => { const st = t0 + i * stag; const k = spring(t, st, 0.5); const op = cl(pr(t, st, st + 0.15)); if (op <= 0) { cx += widths[i] + sp; return; }
    const col = (o.keep || []).includes(i) ? (o.keepCol || C.amber) : mixc(o.acc || C.red, o.fill || C.text, pr(t, st + 0.05, st + 0.45));
    out += `<text x="${cx}" y="${y + (1 - cl(k, 0, 1.2)) * size * 0.8}" fill="${col}" font-family="Inter" font-weight="${w}" font-size="${size}" letter-spacing="${o.ls || 0}" opacity="${op}">${esc(wd)}</text>`; cx += widths[i] + sp; });
  return out;
}
// ---------- camera ----------
export class Cam {
  constructor(pos, target, fov = 40) { this.set(pos, target, fov); }
  set(pos, target, fov = 40, roll = 0) {
    this.pos = pos; this.target = target; this.f = (H / 2) / Math.tan(fov * Math.PI / 360); this.roll = roll;
    const f = norm(sub(target, pos)); let r = norm(cross(f, [0, 0, 1])); if (!isFinite(r[0])) r = [1, 0, 0]; const u = cross(r, f);
    const cr = Math.cos(roll), sr = Math.sin(roll);
    this.fw = f; this.r = add(mul(r, cr), mul(u, sr)); this.u = add(mul(u, cr), mul(r, -sr));
    return this;
  }
  p(q) { const d = sub(q, this.pos); const z = dot(d, this.fw); const x = dot(d, this.r), y = dot(d, this.u); const zz = Math.max(z, 0.01); return [W / 2 + this.f * x / zz, H / 2 - this.f * y / zz, z, this.f / zz]; }
}
export const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
export const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
export const norm = a => { const m = Math.hypot(...a) || 1; return [a[0] / m, a[1] / m, a[2] / m]; };
// orbit helper: camera around target at yaw/pitch (deg), distance
export const orbit = (target, yaw, pitch, dist) => { const y = yaw * Math.PI / 180, p = pitch * Math.PI / 180; return [target[0] + Math.cos(p) * Math.cos(y) * dist, target[1] + Math.cos(p) * Math.sin(y) * dist, target[2] + Math.sin(p) * dist]; };

// ---------- scene graph: faces with depth sort ----------
export const LIGHT = norm([-0.5, -0.8, 0.9]);
export class Scene {
  constructor(cam, boil = 0) { this.cam = cam; this.items = []; this.boil = boil; }
  // face: points 3D, fill hex, opts {stroke, sw, op, shade:true, flat:false, z:biasDepth}
  face(pts3, fill, o = {}) {
    let P = pts3.map(q => this.cam.p(q));
    if (P.some(p => p[2] < 1)) { // near-plane clip (big map polygons partly behind the camera used to vanish)
      if (P.every(p => p[2] < 1)) return; const zc = q => dot(sub(q, this.cam.pos), this.cam.fw); const out = [];
      for (let i = 0; i < pts3.length; i++) { const a = pts3[i], b = pts3[(i + 1) % pts3.length], za = zc(a), zb = zc(b); if (za >= 1) out.push(a); if ((za >= 1) !== (zb >= 1)) out.push(L3(a, b, (1 - za) / (zb - za))); }
      if (out.length < 3) return; P = out.map(q => this.cam.p(q)); }
    let col = fill;
    if (o.shade !== false && pts3.length >= 3) { let n = norm(cross(sub(pts3[1], pts3[0]), sub(pts3[2], pts3[0]))); const toCam = sub(this.cam.pos, pts3[0]); if (dot(n, toCam) < 0) { if (o.cull) return; n = mul(n, -1); } const d = dot(n, LIGHT); col = shadeHex(fill, d > 0.55 ? 1.0 : d > 0.15 ? 0.8 : 0.62); }
    const depth = (o.z ?? 0) + P.reduce((s, p) => s + p[2], 0) / P.length;
    const bj = o.boil ? this.bj.bind(this) : (p => p);
    const pts = P.map(p => bj(p)).map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
    this.items.push({ depth, svg: `<polygon points="${pts}" fill="${col}" ${o.stroke ? `stroke="${o.stroke}" stroke-width="${o.sw || 1.5}" stroke-linejoin="round"` : `stroke="${col}" stroke-width="0.8"`} opacity="${o.op ?? 1}"/>` });
  }
  bj(p, k = 1) { return [p[0] + (rnd(this.boil * 7.1 + p[0] * 0.37 + p[1] * 0.11) - 0.5) * k * 2, p[1] + (rnd(this.boil * 3.3 + p[1] * 0.29 + p[0] * 0.07) - 0.5) * k * 2, p[2]]; }
  line(pts3, stroke, o = {}) { const P = pts3.map(q => this.cam.p(q)); if (P.some(p => p[2] < 1)) return; const depth = (o.z ?? -0.5) + P.reduce((s, p) => s + p[2], 0) / P.length; const d = P.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' '); this.items.push({ depth, svg: `<polyline points="${d}" fill="none" stroke="${stroke}" stroke-width="${o.sw || 2}" stroke-linecap="round" stroke-linejoin="round" ${o.dash ? `stroke-dasharray="${o.dash}"` : ''} ${o.len != null ? `stroke-dasharray="${o.len}" stroke-dashoffset="${o.off}"` : ''} opacity="${o.op ?? 1}"/>` }); }
  // raw svg anchored at 3D point (billboard). fn(x,y,scale) -> svg
  at(q, fn, o = {}) { const p = this.cam.p(q); if (p[2] < 1) return; this.items.push({ depth: (o.z ?? -1) + p[2], svg: fn(p[0], p[1], p[3]) }); }
  raw(svg, depth = 1e9) { this.items.push({ depth, svg }); }
  // draw everything fn() adds as ONE solid object sorted by its centre depth (no interleaving between neighbouring objects)
  group(center, fn, bias = 0) { const keep = this.items; this.items = []; fn(); const inner = this.out(); this.items = keep; const p = this.cam.p(center); if (p[2] < 1) return; this.items.push({ depth: p[2] + bias, svg: inner }); }
  out() { this.items.sort((a, b) => b.depth - a.depth); return this.items.map(i => i.svg).join(''); }
}
// ---------- primitives ----------
export function box(S, [x, y, z], [w, d, h], col, o = {}) {
  const v = [[x, y, z], [x + w, y, z], [x + w, y + d, z], [x, y + d, z], [x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]];
  const R = o.rot ? v.map(p => rotZ(p, o.rot, o.pivot || [x + w / 2, y + d / 2, z])) : v; const V = o.tilt ? R.map(p => rotAxis(p, o.tilt.axis, o.tilt.a, o.tilt.pivot)) : R;
  [[0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7], [4, 5, 6, 7], [0, 3, 2, 1]].forEach(f => S.face(f.map(i => V[i]), col, { ...o, cull: true }));
  return V;
}
export const rotZ = (p, a, c) => { const s = Math.sin(a), co = Math.cos(a), x = p[0] - c[0], y = p[1] - c[1]; return [c[0] + x * co - y * s, c[1] + x * s + y * co, p[2]]; };
export function rotAxis(p, axis, a, c) { // Rodrigues
  const k = norm(axis), v = sub(p, c), co = Math.cos(a), s = Math.sin(a);
  const r = add(add(mul(v, co), mul(cross(k, v), s)), mul(k, dot(k, v) * (1 - co))); return add(r, c);
}
export function prism(S, poly2, z0, h, col, o = {}) { // extrude 2D polygon
  const n = poly2.length; const bot = poly2.map(p => [p[0], p[1], z0]), top = poly2.map(p => [p[0], p[1], z0 + h]);
  for (let i = 0; i < n; i++) { const j = (i + 1) % n; S.face([bot[i], bot[j], top[j], top[i]], col, { ...o, cull: true }); }
  S.face(top, col, { ...o, z: (o.z ?? 0) - 0.01 });
}
export function cyl(S, [x, y, z], r, h, col, n = 16, o = {}) { const p = []; for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; p.push([x + Math.cos(a) * r, y + Math.sin(a) * r]); } prism(S, p, z, h, col, o); }
// ---------- world map on z=0 plane (equirectangular, 1 unit = 1 degree) ----------
const topo = JSON.parse(fs.readFileSync(new URL('./node_modules/world-atlas/countries-110m.json', import.meta.url)));
// rings crossing the antimeridian (Russia's Chukotka, Fiji…) get their western longitudes shifted +360 so they don't streak across the map
const unwrap = r => { let mn = 1e9, mx = -1e9; for (const p of r) { mn = Math.min(mn, p[0]); mx = Math.max(mx, p[0]); } return mx - mn > 300 ? r.map(p => p[0] < 0 ? [p[0] + 360, p[1]] : p) : r; };
export const COUNTRIES = feature(topo, topo.objects.countries).features.map(f => ({ id: +f.id, polys: (f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates).map(p => unwrap(p[0])) }));
const topo50 = JSON.parse(fs.readFileSync(new URL('./node_modules/world-atlas/countries-50m.json', import.meta.url)));
export const COUNTRIES50 = feature(topo50, topo50.objects.countries).features.map(f => ({ id: +f.id, polys: (f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates).map(p => unwrap(p[0])) }));
// shared border between two countries (50m): runs of consecutive vertices of A that are also vertices of B
export function sharedBorder(idA, idB) {
  const A = COUNTRIES50.find(c => c.id === idA), B = COUNTRIES50.find(c => c.id === idB); const key = p => p[0].toFixed(4) + ',' + p[1].toFixed(4);
  const set = new Set(); B.polys.forEach(r => r.forEach(p => set.add(key(p)))); const runs = [];
  A.polys.forEach(r => { let cur = []; r.forEach(p => { if (set.has(key(p))) cur.push(p); else { if (cur.length > 1) runs.push(cur); cur = []; } }); if (cur.length > 1) runs.push(cur); });
  return runs.sort((a, b) => b.length - a.length);
}
export const LL = { natanz: [51.727, 33.725], tehran: [51.389, 35.689], moscow: [37.618, 55.756], kyiv: [30.52, 50.45], islamabad: [73.048, 33.684], delhi: [77.209, 28.614], beijing: [116.4, 39.9], taipei: [121.565, 25.033], tokyo: [139.69, 35.69], hiroshima: [132.455, 34.385], nagasaki: [129.878, 32.75], washington: [-77.04, 38.9], qeshm: [55.83, 26.8], doha: [51.53, 25.29], hormuz: [56.45, 26.55], bandar: [56.27, 27.18], serpukhov: [37.43, 55.08] };
export const g3 = ([lon, lat], z = 0) => [lon, lat * 1.0, z];
// draw map: o.bbox [lon0,lat0,lon1,lat1] culls; o.hi {id:color}; o.ext {id:height}; o.hd uses 50m
export function worldMap(S, o = {}) {
  const src = o.hd ? COUNTRIES50 : COUNTRIES; const bb = o.bbox || [-180, -60, 180, 85];
  for (const c of src) {
    const col = (o.hi && o.hi[c.id]) || o.land || C.land; const h = (o.ext && o.ext[c.id]) || 0;
    for (const ring of c.polys) {
      let inb = false; for (const p of ring) if (p[0] > bb[0] && p[0] < bb[2] && p[1] > bb[1] && p[1] < bb[3]) { inb = true; break; } if (!inb) continue;
      const step = o.step || 1; const r = ring.filter((_, i) => i % step === 0);
      if (h > 0) { prism(S, r, 0, h, col, { stroke: o.edge || '#2E3742', sw: 1, shade: true }); }
      // flat land is a background layer: always behind arcs, rings, ships and markers (fixes "goes under the land")
      else S.face(r.map(p => [p[0], p[1], 0]), col, { shade: false, stroke: o.edge || '#2E3742', sw: 1, z: 2e5 });
    }
  }
}
export function arc3(a, b, h, n = 40) { const pts = []; for (let i = 0; i <= n; i++) { const k = i / n; pts.push([lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k) + Math.sin(Math.PI * k) * h]); } return pts; }
export function polyLen(S, pts) { let l = 0, prev = null; for (const q of pts) { const p = S.cam.p(q); if (prev) l += Math.hypot(p[0] - prev[0], p[1] - prev[1]); prev = p; } return l; }
export function marker(S, q, col, t, t0, label, o = {}) {
  if (t < t0) return; const k = cl(spring(t, t0, 0.45), 0, 1.15);
  S.at(q, (x, y, sc) => { const r = cl(9 * sc * (o.size || 1), 6, 16) * k; let s = `<circle cx="${x}" cy="${y}" r="${r}" fill="${col}"/>`; const ph = ((t - t0) * 0.8) % 1; s += `<circle cx="${x}" cy="${y}" r="${r + ph * 40}" fill="none" stroke="${col}" stroke-width="2" opacity="${1 - ph}"/>`;
    if (label) { const fs = o.fs || 30, fw = o.flag ? Math.round(fs * 1.5) : 0, fh = Math.round(fw * 2 / 3), gap = o.flag ? fw + 12 : 0; const lx = x + (o.left ? -r - 14 : r + 14);
      s += `<g opacity="${cl(pr(t, t0 + 0.15, t0 + 0.4))}" transform="translate(0 ${o.dy || 0})">` + (o.dy ? `<line x1="${x}" y1="${y}" x2="${x + (o.left ? -r - 8 : r + 8)}" y2="${y + o.dy}" stroke="${col}" stroke-width="1.5" transform="translate(0 ${-o.dy})"/>` : '');
      if (o.flag) { const tw2 = tw(label, fs, 800); const fx = o.left ? lx - tw2 - 12 - fw : lx; s += flagSVG(o.flag, fx, y + 10 - fs * 0.78, fw, fh); }
      s += TXT(o.left ? lx : lx + gap, y + 10, label, { size: fs, w: 800, a: o.left ? 'end' : 'start' }) + (o.sub ? MONO(o.left ? lx : lx + gap, y + 36, o.sub, { size: 15, a: o.left ? 'end' : 'start', fill: o.subCol || C.tele }) : '') + `</g>`; }
    return s; }, { z: -50 });
}
// ---------- flags & portraits (Wikimedia Commons assets in photos/) ----------
export const FLAG = k => `photos/ND_F_${k}.png`;
export const FACE = k => `photos/ND_L_${k}.jpg`;
// flat flag with soft shadow + thin border; o.wave adds a gentle cloth shading sweep
const offCanvas = (x, y, w, h) => x > W + 20 || y > H + 20 || x + w < -20 || y + h < -20 || !isFinite(x + y);
export function flagSVG(k, x, y, w, h, o = {}) {
  if (offCanvas(x, y, w, h) || (o.op ?? 1) <= 0) return ''; // resvg panics on clipped images fully outside the canvas
  const id = 'fg' + k + Math.round(x) + Math.round(y);
  return `<g opacity="${o.op ?? 1}"><rect x="${x + 3}" y="${y + 5}" width="${w}" height="${h}" rx="${o.rx ?? 3}" fill="#000" opacity="0.45"/><clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx ?? 3}"/></clipPath><g clip-path="url(#${id})"><image href="${FLAG(k)}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice"/>${o.wave != null ? `<rect x="${x + ((o.wave % 1) * 2 - 1) * w}" y="${y}" width="${w * 0.6}" height="${h}" fill="#fff" opacity="0.10"/>` : ''}</g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx ?? 3}" fill="none" stroke="#000" stroke-opacity="0.35" stroke-width="1"/></g>`;
}
// circular portrait with ring (and optional flag badge)
export function faceSVG(k, cx, cy, r, o = {}) {
  if (offCanvas(cx - r, cy - r, r * 2, r * 2)) return '';
  const id = 'fc' + k + Math.round(cx) + Math.round(cy);
  let s = `<circle cx="${cx + 3}" cy="${cy + 6}" r="${r}" fill="#000" opacity="0.5"/><clipPath id="${id}"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath><image href="${FACE(k)}" x="${cx - r}" y="${cy - r * (o.top ?? 1.0)}" width="${r * 2}" height="${r * 2.6}" preserveAspectRatio="xMidYMin slice" clip-path="url(#${id})" ${o.gray ? 'style="filter:grayscale(1)"' : ''}/><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${o.ring || C.text}" stroke-width="${o.sw || 3}"/>`;
  if (o.flag) { const fw = r * 0.78, fh = fw * 2 / 3; s += flagSVG(o.flag, cx + r * 0.42, cy + r * 0.5, fw, fh, { rx: 2 }); }
  return s;
}
// ---------- post FX ----------
const grain = [0, 1, 2].map(i => `grain_${i}.png`);
export function frameSVG(t, body, o = {}) {
  const fl = 0.02 * (Math.sin(t * 61.3) * 0.5 + Math.sin(t * 23.7) * 0.5);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs><radialGradient id="vg" cx="50%" cy="48%" r="75%"><stop offset="52%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity="0.62"/></radialGradient><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0C1015"/><stop offset="1" stop-color="#07080A"/></linearGradient></defs>${body}<rect width="100%" height="100%" fill="url(#vg)"/><image href="${grain[Math.floor(t * 12) % 3]}" width="1920" height="1080" opacity="${o.grain ?? 0.06}"/><rect width="100%" height="100%" fill="#fff" opacity="${Math.max(0, fl)}"/></svg>`;
}
// resvg (win build) panics when a fully transparent group still holds clipped images → keep it "almost" transparent instead
const safeSVG = svg => svg.replace(/opacity="(-[^"]*|0|0\.0*|-?0e[^"]*)"/g, 'opacity="0.0001"');
export const renderSVG = svg => new Resvg(safeSVG(svg), { font: { fontFiles: FONTS, loadSystemFonts: false, defaultFontFamily: 'Inter' } }).render().asPng();
// CLI helper: run(scenes, T0, name)
export function cli(frameFn, T0, tag) {
  const [, , cmd, ...a] = process.argv;
  if (cmd === 'stills') { fs.mkdirSync(`stills_${tag}`, { recursive: true }); for (const tv of a.map(Number)) fs.writeFileSync(`stills_${tag}/s_${tv}.png`, renderSVG(frameFn(tv))); console.log('ok'); }
  if (cmd === 'frames') { const d = `frames_${tag}`; fs.mkdirSync(d, { recursive: true }); for (let f = +a[0]; f < +a[1]; f++) fs.writeFileSync(`${d}/f_${String(f).padStart(5, '0')}.png`, renderSVG(frameFn(T0 + f / FPS))); console.log('frames', a[0], a[1]); }
}
// ---------- torn paper photo template ----------
// Deterministic torn edge: jagged polygon around a w x h rect, seed-specific.
export function tornPath(w, h, seed = 1, amp = 14, step = 18) {
  const pts = []; const j = (i, k) => (rnd(seed * 31.7 + i * 7.13 + k) - 0.5) * 2;
  // low-frequency wander + fine fibre noise + occasional bites (real torn paper)
  const e = (u, k) => Math.sin(u * 0.013 + seed * 2.1 + k) * amp * 0.45 + Math.sin(u * 0.041 + seed + k * 3) * amp * 0.25 + j(u, k) * amp * 0.22 + (rnd(seed * 5 + u * 0.37 + k) > 0.93 ? amp * 0.5 : 0);
  for (let x = 0; x <= w; x += step) pts.push([x, e(x, 1)]);
  for (let y = 0; y <= h; y += step) pts.push([w + e(y, 2) * 0.6, y]);
  for (let x = w; x >= 0; x -= step) pts.push([x, h - e(x, 3)]);
  for (let y = h; y >= 0; y -= step) pts.push([-e(y, 4) * 0.6, y]);
  return 'M' + pts.map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L') + ' Z';
}
// Torn photo card in local coords (w x h): paper border, torn edges, fibrous white edge, shadow, tape, grain, caption
export function tornPhotoSVG(href, w, h, o = {}) {
  const id = 'tp' + (o.seed || 1) + Math.floor(rnd(o.seed || 1) * 1e6);
  const pad = o.pad ?? 26, outer = tornPath(w, h, o.seed || 1, 18, 5), inner = tornPath(w - pad * 2, h - pad * 2 - (o.caption ? 46 : 0), (o.seed || 1) + 9, 8, 5);
  let s = `<defs><clipPath id="${id}"><path d="${inner}" transform="translate(${pad} ${pad})"/></clipPath><filter id="${id}s" x="-10%" y="-10%" width="120%" height="130%"><feGaussianBlur stdDeviation="10"/></filter></defs>`;
  s += `<path d="${outer}" fill="#000" opacity="0.55" transform="translate(10 18)" filter="url(#${id}s)"/>`;
  s += `<path d="${outer}" fill="#EDE6D6"/><path d="${outer}" fill="none" stroke="#FFFFFF" stroke-width="3" opacity="0.7"/>`;
  s += `<g clip-path="url(#${id})"><image href="${href}" x="${pad}" y="${pad}" width="${w - pad * 2}" height="${h - pad * 2 - (o.caption ? 46 : 0)}" preserveAspectRatio="xMidYMid slice" ${o.gray ? 'style="filter:grayscale(1)"' : ''}/><rect x="${pad}" y="${pad}" width="${w}" height="${h}" fill="#3A2A12" opacity="${o.sepia ?? 0.12}"/></g>`;
  s += `<path d="${inner}" transform="translate(${pad} ${pad})" fill="none" stroke="#F7F2E8" stroke-width="2.5" opacity="0.9"/>`;
  if (o.tape !== false) s += `<rect x="${w / 2 - 70}" y="-14" width="140" height="38" fill="#D8CFAF" opacity="0.82" transform="rotate(${(rnd((o.seed || 1) * 5) - 0.5) * 8} ${w / 2} 0)"/>`;
  if (o.caption) s += `<text x="${pad + 4}" y="${h - pad - 8}" fill="#2A241B" font-family="DejaVu Sans Mono" font-size="20" letter-spacing="2">${esc(o.caption)}</text>`;
  if (o.credit) s += `<text x="${w - pad - 4}" y="${h - pad - 8}" fill="#6B6152" font-family="DejaVu Sans Mono" font-size="14" text-anchor="end">${esc(o.credit)}</text>`;
  return s;
}
// place a torn photo on a 3D plane (vertical, facing -y) via affine of 3 corners
export function tornPhoto3D(S, href, center, wU, hU, o = {}) {
  const [cx, cy, cz] = center; const rot = o.rot || 0; const piv = [cx, cy, cz];
  const R = q => rot ? rotAxis(q, [0, 1, 0], rot, piv) : q;
  const P0 = S.cam.p(R([cx - wU / 2, cy, cz + hU / 2])), P1 = S.cam.p(R([cx + wU / 2, cy, cz + hU / 2])), P3 = S.cam.p(R([cx - wU / 2, cy, cz - hU / 2]));
  if (P0[2] < 1 || P1[2] < 1 || P3[2] < 1) return;
  const w = o.pw || 1000, h = Math.round(w * hU / wU);
  const A = (P1[0] - P0[0]) / w, B = (P1[1] - P0[1]) / w, Cc = (P3[0] - P0[0]) / h, D = (P3[1] - P0[1]) / h;
  S.raw(`<g transform="matrix(${A} ${B} ${Cc} ${D} ${P0[0]} ${P0[1]})" opacity="${o.op ?? 1}">${tornPhotoSVG(href, w, h, o)}</g>`, Math.min(P0[2], P1[2], P3[2]) + (o.z ?? -0.5));
}

// ===================== v3 kit =====================
export const PH = n => `photos/ND_P_${n}.jpg`;
// 2D torn photo that drops in (spring), settles rotation, slow drift (doc12 paper + doc08 spring)
export function tornCard2D(t, t0, href, x, y, w, h, o = {}) {
  if (t < t0) return ''; const k = spring(t, t0, 0.7), op = cl(pr(t, t0, t0 + 0.15));
  const out = o.t1 ? expoIn(pr(t, o.t1, o.t1 + 0.35)) : 0;
  const rot = (o.rot ?? -3) + (1 - cl(k, 0, 1.1)) * (o.spin ?? 8); const dy = (1 - cl(k, 0, 1.1)) * -120 + (t - t0) * (o.drift ?? -6) + out * 900;
  const sc = (o.s0 ?? 1.06) - (cl(k, 0, 1) * ((o.s0 ?? 1.06) - 1)) + (t - t0) * (o.push ?? 0.004);
  return `<g opacity="${op * (1 - out)}" transform="translate(${x + w / 2} ${y + h / 2 + dy}) rotate(${rot}) scale(${sc}) translate(${-w / 2} ${-h / 2})">${tornPhotoSVG(href, w, h, o)}</g>`;
}
// paper quote card (text only), torn edges
export function paperNote(w, h, lines, o = {}) {
  let s = `<path d="${tornPath(w, h, o.seed || 4, 12, 6)}" fill="#000" opacity="0.5" transform="translate(8 14)"/><path d="${tornPath(w, h, o.seed || 4, 12, 6)}" fill="${o.paper || '#EDE6D6'}"/>`;
  if (o.head) s += `<text x="40" y="62" fill="${o.headCol || '#7A1E22'}" font-family="DejaVu Sans Mono" font-size="22" letter-spacing="3">${esc(o.head)}</text>`;
  lines.forEach((l, i) => s += `<text x="40" y="${(o.head ? 130 : 80) + i * (o.lh || 58)}" fill="#15171B" font-family="Inter" font-weight="${o.w || 700}" font-size="${o.size || 46}">${esc(l)}</text>`);
  if (o.foot) s += `<text x="40" y="${h - 34}" fill="#6B6152" font-family="DejaVu Sans Mono" font-size="18" letter-spacing="2">${esc(o.foot)}</text>`;
  return s;
}
export function noteDrop(t, t0, x, y, w, h, lines, o = {}) {
  if (t < t0) return ''; const k = spring(t, t0, 0.6); const out = o.t1 ? expoIn(pr(t, o.t1, o.t1 + 0.35)) : 0;
  const rot = (o.rot ?? 2) + (1 - cl(k, 0, 1.1)) * -10;
  return `<g opacity="${cl(pr(t, t0, t0 + 0.12)) * (1 - out)}" transform="translate(${x + w / 2} ${y + h / 2 + (1 - cl(k, 0, 1.1)) * 90 + out * 700}) rotate(${rot}) translate(${-w / 2} ${-h / 2})">${paperNote(w, h, lines, o)}</g>`;
}
// map an arbitrary local-coords svg onto a 3D quad (tl, tr, bl) — screens, cards, boards
export function quad(S, tl, tr, bl, w, h, inner, o = {}) {
  const P0 = S.cam.p(tl), P1 = S.cam.p(tr), P3 = S.cam.p(bl); if (P0[2] < 1 || P1[2] < 1 || P3[2] < 1) return;
  if (o.backface !== true && (P1[0] - P0[0]) * (P3[1] - P0[1]) - (P1[1] - P0[1]) * (P3[0] - P0[0]) < 0) return;
  const A = (P1[0] - P0[0]) / w, B = (P1[1] - P0[1]) / w, Cc = (P3[0] - P0[0]) / h, D = (P3[1] - P0[1]) / h;
  S.raw(`<g transform="matrix(${A} ${B} ${Cc} ${D} ${P0[0]} ${P0[1]})" opacity="${o.op ?? 1}">${inner}</g>`, (P0[2] + P1[2] + P3[2]) / 3 + (o.z ?? -0.2));
}
// shockwave ring on ground (doc07)
export function shock(S, c, t, t0, R = 6, col = '#F2F2F2', dur = 1.2) {
  const k = pr(t, t0, t0 + dur); if (k <= 0 || k >= 1) return; const r = 0.3 + expo(k) * R; const pts = []; for (let i = 0; i <= 40; i++) { const a = i / 40 * Math.PI * 2; pts.push([c[0] + Math.cos(a) * r, c[1] + Math.sin(a) * r, (c[2] || 0) + 0.15]); }
  S.line(pts, col, { sw: 3 * (1 - k) + 0.6, op: 1 - k, z: -2 });
  if (k < 0.25) S.at(c, (x, y, sc) => `<circle cx="${x}" cy="${y}" r="${cl(sc * 1.4, 8, 60) * (1 - k * 3)}" fill="#FFF3D6" opacity="${0.9 * (1 - k * 4)}"/>`, { z: -3 });
}
// missile / bomb model along a 3D direction
export function missile(S, pos, dir, len = 3, col = '#C9CED6', o = {}) {
  const d = norm(dir); let side = norm(cross(d, [0, 0, 1])); if (!isFinite(side[0]) || Math.hypot(...side) < 0.1) side = [1, 0, 0]; const up = norm(cross(side, d)); const r = len * 0.07;
  const tip = add(pos, mul(d, len * 0.5)), tail = add(pos, mul(d, -len * 0.5)), neck = add(pos, mul(d, len * 0.25));
  const ring = (c, rr) => [0, 1, 2, 3, 4, 5].map(i => { const a = i / 6 * Math.PI * 2; return add(c, add(mul(side, Math.cos(a) * rr), mul(up, Math.sin(a) * rr))); });
  const A = ring(tail, r), B = ring(neck, r);
  for (let i = 0; i < 6; i++) { const j = (i + 1) % 6; S.face([A[i], A[j], B[j], B[i]], col, { cull: true }); S.face([B[i], B[j], tip], col, { cull: true }); }
  [0, 2, 4].forEach(i => S.face([A[i], add(A[i], mul(sub(A[i], tail), 2.2)), add(A[i], mul(d, len * 0.18))], o.fin || '#7A8594', {}));
  if (o.flame) S.at(add(tail, mul(d, -len * 0.1)), (x, y, sc) => `<circle cx="${x}" cy="${y}" r="${cl(sc * r * 2.2, 3, 30)}" fill="#F5A524" opacity="0.85"/><circle cx="${x}" cy="${y}" r="${cl(sc * r * 1.2, 2, 18)}" fill="#FFF3D6"/>`, { z: -0.1 });
}
export const pointOn = (pts, k) => { const n = pts.length - 1, f = cl(k) * n, i = Math.min(n - 1, Math.floor(f)), r = f - i; return L3(pts[i], pts[i + 1], r); };
// partial arc with head missile
export function flyArc(S, a, b, h, t, t0, dur, col = C.red, o = {}) {
  if (t < t0) return; const pts = arc3(a, b, h, 48); const k = (o.ease || inOut)(pr(t, t0, t0 + dur)); const n = Math.max(2, Math.round(k * 48));
  const fade = o.fade ? 1 - pr(t, t0 + dur + o.fade[0], t0 + dur + o.fade[1]) : 1; if (fade <= 0) return;
  S.line(pts.slice(0, n + 1), col, { sw: o.sw || 2.5, op: fade * (o.op ?? 1), z: -1 });
  if (k < 1 && o.head !== false) { const p = pointOn(pts, k), q = pointOn(pts, Math.min(1, k + 0.02)); missile(S, p, sub(q, p), o.len || 1.6, '#E8E3D8', { flame: true }); }
  if (k >= 1 && o.impact !== false) shock(S, b, t, t0 + dur, o.R || 3, col, 1.1);
}
// terrain heightfield (doc17 3-tone) centered c, size sx,sy, fn(u,v)->h (u,v in -1..1)
export function terrain(S, c, sx, sy, n, fn, col = '#8A7A65', o = {}) {
  const P = (i, j) => { const u = i / n * 2 - 1, v = j / n * 2 - 1; return [c[0] + u * sx, c[1] + v * sy, (c[2] || 0) + fn(u, v)]; };
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { const a = P(i, j), b = P(i + 1, j), d = P(i + 1, j + 1), e = P(i, j + 1); S.face([a, b, d], col, { boil: o.boil }); S.face([a, d, e], col, { boil: o.boil }); }
}
// CRT screen inner svg (doc07 TV grid + scanlines + phosphor flicker)
export function crt(t, w, h, inner, o = {}) {
  let s = `<rect width="${w}" height="${h}" rx="30" fill="${o.bg || '#06140B'}"/>${inner}`;
  for (let y = 0; y < h; y += 6) s += `<rect x="0" y="${y}" width="${w}" height="2" fill="#000" opacity="0.28"/>`;
  const roll = ((t * 0.35) % 1) * h; s += `<rect x="0" y="${roll}" width="${w}" height="60" fill="#7CFFAE" opacity="0.05"/>`;
  s += `<rect width="${w}" height="${h}" rx="30" fill="none" stroke="#000" stroke-width="40" opacity="0.5"/>`;
  return `<g opacity="${0.92 + 0.08 * Math.sin(t * 47)}">${s}</g>`;
}
// liquid metaballs (doc16): circles -> blur -> alpha threshold
export function metaballs(id, balls, col, o = {}) {
  return `<defs><filter id="${id}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${o.blur || 18}"/><feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 26 -11"/></filter></defs><g filter="url(#${id})">${balls.map(b => `<circle cx="${b[0].toFixed(1)}" cy="${b[1].toFixed(1)}" r="${b[2].toFixed(1)}" fill="${col}"/>`).join('')}</g>`;
}
// pixel stream / network (doc10): nodes + packets along edges, deterministic
export function network(S, center, R, N, t, t0, o = {}) {
  const nodes = []; for (let i = 0; i < N; i++) { const a = rnd(i * 3.1) * Math.PI * 2, e = (rnd(i * 7.7) - 0.3) * 1.2, r = R * (0.45 + rnd(i * 1.9) * 0.6); nodes.push([center[0] + Math.cos(a) * Math.cos(e) * r, center[1] + Math.sin(a) * Math.cos(e) * r, center[2] + Math.sin(e) * r * 0.6]); }
  nodes.forEach((p, i) => { const parent = i === 0 ? center : nodes[Math.floor(rnd(i * 5.3) * i)]; const st = t0 + (i / N) * (o.spread || 3); const k = expo(pr(t, st, st + 0.5)); if (k <= 0) return;
    S.line([parent, L3(parent, p, k)], o.edge || '#2E4A7A', { sw: 1.2, op: 0.8, z: 1 });
    const pk = ((t - st) * 1.4) % 1; if (k >= 1) S.at(L3(parent, p, pk), (x, y) => `<rect x="${x - 3}" y="${y - 3}" width="6" height="6" fill="${o.packet || C.amber}"/>`, { z: -1 });
    S.at(p, (x, y, sc) => `<circle cx="${x}" cy="${y}" r="${cl(sc * 0.25, 2.5, 9) * cl(spring(t, st + 0.4, 0.4), 0, 1.2)}" fill="${o.node || C.blue}"/>`, { z: -1 }); });
}
// glass shards flying out (taboo shatter)
export function shards(S, c, w, h, t, t0, n = 40, col = '#9FB7E8') {
  for (let i = 0; i < n; i++) { const u = rnd(i * 2.3) - 0.5, v = rnd(i * 4.1); const base = [c[0] + u * w, c[1], c[2] + v * h]; const s = 0.4 + rnd(i * 9) * 1.2; const k = Math.max(0, t - t0);
    const vel = [u * 6, -2 - rnd(i * 5) * 8, (rnd(i * 6) - 0.2) * 6]; const p = [base[0] + vel[0] * k, base[1] + vel[1] * k, base[2] + vel[2] * k - 4.9 * k * k * 0.6];
    const a = k * (2 + rnd(i) * 6); const tri = [[0, 0, s], [s * 0.8, 0, -s * 0.4], [-s * 0.7, 0, -s * 0.5]].map(q => add(p, rotAxis(q, [rnd(i * 3) - 0.5, rnd(i * 8) - 0.5, 1], a, [0, 0, 0])));
    S.face(tri, col, { shade: true, op: 0.55 * (1 - pr(t, t0 + 1.2, t0 + 2.2)), stroke: '#E6EEFF', sw: 1 }); }
}
// chapter title: letters spring up on a 3D plane, amber rule draws
export function chapter(t, t0, num, title, o = {}) {
  const k = expo(pr(t, t0 + 0.2, t0 + 0.9)); let s = MONO(960, 470, `CHAPTER ${num}`, { size: 22, a: 'middle', ls: 10, op: cl(pr(t, t0, t0 + 0.2)) });
  s += words(t, title.split(' '), 960, 600, o.size || 130, 900, t0 + 0.1, 0.12, { a: 'middle', ls: 6, keep: o.keep || [], keepCol: C.amber });
  s += `<rect x="${960 - 320 * k}" y="636" width="${640 * k}" height="4" fill="${C.amber}"/>`; return s;
}
// lower third; o.face = portrait key, o.flag = flag key, o.credit = small photo credit
export const lower = (t, t0, t1, name, role, o = {}) => { const lt = expo(pr(t, t0, t0 + 0.4)) * (1 - expoIn(pr(t, t1 - 0.4, t1))); if (lt <= 0) return '';
  const dx = o.face ? 138 : 0; let s = `<g opacity="${lt}" transform="translate(${(1 - lt) * -60} 0)">`;
  if (o.face) s += faceSVG(o.face, 146, 752, 58, { flag: o.flag, ring: o.ring || C.text, gray: o.gray });
  else if (o.flag) s += flagSVG(o.flag, 104, 668, 54, 36);
  s += `<rect x="${80 + dx}" y="700" width="6" height="104" fill="${o.bar || C.red}"/>` + TXT(104 + dx, 744, name, { size: 42, w: 800 }) + MONO(106 + dx, 786, role, { size: 16, ls: 2, fill: C.sub });
  if (o.credit) s += MONO(106 + dx, 812, o.credit, { size: 11, ls: 1, fill: '#4A5563' });
  return s + `</g>`; };
export const fmt = n => Math.round(n).toLocaleString('en-US');
