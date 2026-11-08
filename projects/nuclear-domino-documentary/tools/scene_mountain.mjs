// SCENE: Pickaxe Mountain cutaway (VO 127.29–145.05). Pure function of time.
// Repo techniques: doc17 isometric (35.264° elevation, 3-tone shading, elevation bounce + floor shadow),
// doc09 continuous camera momentum, doc18 line boil @12fps, doc12 ink/paper grain, doc07 shockwave + exposure flicker.
import fs from 'fs';
import { Resvg } from '@resvg/resvg-js';
const W = 1920, H = 1080, FPS = 25;
const FD = '/usr/share/fonts/opentype/inter/';
const FONTS = ['Regular', 'Medium', 'SemiBold', 'Bold', 'ExtraBold', 'Black'].map(w => FD + `Inter-${w}.otf`).concat(['/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf', '/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf']);
const C = { bg: '#0A0C0F', text: '#F2F2F2', sub: '#9AA4B2', tele: '#5C7C99', red: '#E5484D', amber: '#F5A524', blue: '#5B8DEF' };
const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), pr = (t, a, b) => cl((t - a) / (b - a)), lerp = (a, b, k) => a + (b - a) * k;
const expo = x => x >= 1 ? 1 : 1 - Math.pow(2, -10 * x), expoIn = x => x <= 0 ? 0 : Math.pow(2, 10 * x - 10), inOut = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
const spring = (t, t0, dur = 0.55) => { const d = t - t0; if (d <= 0) return 0; const x = d / dur; return cl(1 - Math.exp(-6.5 * x) * Math.cos(x * 7.2), -0.2, 1.12); };
const rnd = n => { const x = Math.sin(n * 12.9898) * 43758.5453; return x - Math.floor(x); };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const MONO = (x, y, s, o = {}) => `<text x="${x}" y="${y}" fill="${o.fill || C.tele}" font-family="DejaVu Sans Mono" font-weight="${o.w || 400}" font-size="${o.size || 18}" text-anchor="${o.a || 'start'}" letter-spacing="${o.ls || 1}" opacity="${o.op ?? 1}">${esc(s)}</text>`;
const TXT = (x, y, s, o = {}) => `<text x="${x}" y="${y}" fill="${o.fill || C.text}" font-family="Inter" font-weight="${o.w || 800}" font-size="${o.size || 40}" text-anchor="${o.a || 'start'}" letter-spacing="${o.ls || 0}" opacity="${o.op ?? 1}">${esc(s)}</text>`;
const grain = [0, 1, 2].map(i => 'data:image/png;base64,' + fs.readFileSync(`grain_${i}.png`).toString('base64'));

// ---------- terrain (meters). x: 0..1600, y: 0..1000, z up ----------
const NX = 34, NY = 22, X0 = 0, X1 = 1600, Y0 = 0, Y1 = 1000, CUTY = 470;
function hgt(x, y) {
  const g = (cx, cy, sx, sy, a) => a * Math.exp(-((x - cx) ** 2) / (2 * sx * sx) - ((y - cy) ** 2) / (2 * sy * sy));
  let h = g(820, 470, 300, 230, 165) + g(1180, 380, 180, 160, 90) + g(450, 560, 170, 150, 70) + g(1350, 760, 160, 120, 40);
  h += (rnd(Math.round(x) * 0.13 + Math.round(y) * 0.71) - 0.5) * 10;
  const edge = Math.min(x - X0, X1 - x, y - Y0, Y1 - y); return h * cl(edge / 120) ;
}
const GX = i => lerp(X0, X1, i / NX), GY = j => lerp(Y0, Y1, j / NY);
const HG = []; for (let i = 0; i <= NX; i++) { HG[i] = []; for (let j = 0; j <= NY; j++) HG[i][j] = hgt(GX(i), GY(j)); }
const BOTTOM = -40; // slab bottom (m)
const SURF_H = hgt(850, CUTY); // surface above halls on the section plane
const HALL = { x0: 700, x1: 1000, top: SURF_H - 80, bot: SURF_H - 100 };
let PXL = 0, PXR = 1600; for (let x = 60; x < 800; x += 5) if (hgt(x, CUTY) >= HALL.bot + 10) { PXL = x; break; } for (let x = 1540; x > 900; x -= 5) if (hgt(x, CUTY) >= HALL.bot + 10) { PXR = x; break; }

// ---------- projection: yaw 45°, elevation e (90 = top-down satellite, 35.264 = iso) ----------
let P = { e: 35.264, s: 0.62, cx: 960, cy: 600, yaw: 45 }; const ZX = 2.6; // vertical exaggeration (labelled not to scale)
function proj(x, y, z) {
  const yr = P.yaw * Math.PI / 180, er = P.e * Math.PI / 180;
  const xc = x - 800, yc = y - 500;
  const u = xc * Math.cos(yr) - yc * Math.sin(yr);
  const v = xc * Math.sin(yr) + yc * Math.cos(yr);
  return [P.cx + u * P.s, P.cy + (v * Math.sin(er) - z * ZX * Math.cos(er)) * P.s];
}
let BOIL = 0; // line boil seed (12 fps)
const bj = (p, k = 1.1) => [p[0] + (rnd(BOIL * 7.1 + p[0] * 0.37 + p[1] * 0.11) - 0.5) * k * 2, p[1] + (rnd(BOIL * 3.3 + p[1] * 0.29 + p[0] * 0.07) - 0.5) * k * 2];
const pts = arr => arr.map(p => p.map(v => v.toFixed(1)).join(',')).join(' ');
// 3-tone shading (doc17): light / mid / dark stepped from lambert
const L = (() => { const v = [-0.45, -0.75, 0.75]; const n = Math.hypot(...v); return v.map(a => a / n); })();
const ROCK = ['#B9A88F', '#8A7A65', '#57493B'];
function shade(a, b, c) {
  const u = [b[0] - a[0], b[1] - a[1], (b[2] - a[2]) * ZX], v = [c[0] - a[0], c[1] - a[1], (c[2] - a[2]) * ZX];
  let n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]; const m = Math.hypot(...n) || 1; n = n.map(x => x / m); if (n[2] < 0) n = n.map(x => -x);
  const d = n[0] * L[0] + n[1] * L[1] + n[2] * L[2]; return d > 0.62 ? ROCK[0] : d > 0.3 ? ROCK[1] : ROCK[2];
}
function terrain(t, part, off, op, wave0) {
  // part: 'back' (y<=CUTY) or 'front'; off: y offset (cutaway slide)
  let tris = [];
  for (let i = 0; i < NX; i++) for (let j = 0; j < NY; j++) {
    const y0 = GY(j), y1 = GY(j + 1); if (part === 'back' && y0 >= CUTY) continue; if (part === 'front' && y1 <= CUTY) continue;
    const A = [GX(i), y0, HG[i][j]], B = [GX(i + 1), y0, HG[i + 1][j]], Cc = [GX(i + 1), y1, HG[i + 1][j + 1]], D = [GX(i), y1, HG[i][j + 1]];
    const delay = wave0 + (i + j) * 0.025; // 1-frame cascade (doc08 micro offsets)
    const rise = cl(spring(t, delay, 0.5), 0, 1.1);
    for (const tri of [[A, B, Cc], [A, Cc, D]]) tris.push({ tri, rise, depth: (tri[0][0] + tri[0][1] + tri[1][0] + tri[1][1] + tri[2][0] + tri[2][1]) / 3 });
  }
  tris.sort((a, b) => a.depth - b.depth);
  let s = `<g opacity="${op}">`;
  for (const { tri, rise } of tris) {
    const q = tri.map(p => bj(proj(p[0], p[1] + off, p[2] * rise)));
    const col = shade(...tri);
    s += `<polygon points="${pts(q)}" fill="${col}" stroke="${col}" stroke-width="1.2" stroke-linejoin="round"/>`;
  }
  return s + `</g>`;
}
function slabSide(off, op) {
  // visible slab faces: x = X1 (right) and y = Y1 (front) or cut plane handled separately
  let s = '';
  const right = []; for (let j = NY; j >= 0; j--) right.push([X1, GY(j) + off, HG[NX][j]]); right.push([X1, Y0 + off, BOTTOM], [X1, Y1 + off, BOTTOM]);
  const front = []; for (let i = 0; i <= NX; i++) front.push([GX(i), Y1 + off, HG[i][NY]]); front.push([X1, Y1 + off, BOTTOM], [X0, Y1 + off, BOTTOM]);
  s += `<polygon points="${pts(right.map(p => bj(proj(...p))))}" fill="#3E352B" stroke="#1B1F25" stroke-width="1.5"/>`;
  s += `<polygon points="${pts(front.map(p => bj(proj(...p))))}" fill="#5E5142" stroke="#1B1F25" stroke-width="1.5"/>`;
  return `<g opacity="${op}">${s}</g>`;
}
function section(t) {
  // cut face on plane y = CUTY: terrain profile down to BOTTOM, strata, tunnels, halls
  const prof = []; for (let i = 0; i <= NX * 4; i++) { const x = lerp(X0, X1, i / (NX * 4)); prof.push([x, CUTY, hgt(x, CUTY)]); }
  const poly = prof.concat([[X1, CUTY, BOTTOM], [X0, CUTY, BOTTOM]]);
  let s = `<polygon points="${pts(poly.map(p => bj(proj(...p), 0.8)))}" fill="#2E2721" stroke="#E8DCC8" stroke-width="2.5"/>`;
  // strata (wavy lines in plane)
  for (let k = 1; k < 9; k++) { const zz = BOTTOM + k * 26; const line = []; for (let i = 0; i <= 40; i++) { const x = lerp(X0, X1, i / 40); const zs = zz + Math.sin(x * 0.01 + k) * 6; if (zs < hgt(x, CUTY) - 4) line.push(bj(proj(x, CUTY, zs), 0.6)); } if (line.length > 1) s += `<polyline points="${pts(line)}" fill="none" stroke="#42382E" stroke-width="1.5"/>`; }
  return s;
}
const plane = (x, z) => proj(x, CUTY, z);
function pathLen(ps) { let l = 0; for (let i = 1; i < ps.length; i++) l += Math.hypot(ps[i][0] - ps[i - 1][0], ps[i][1] - ps[i - 1][1]); return l; }
function tunnels(t) {
  let s = '';
  const e1 = [[PXL, hgt(PXL, CUTY) - 2], [PXL + 60, HALL.bot + 9], [700, HALL.bot + 6]];
  const e2 = [[PXR, hgt(PXR, CUTY) - 2], [PXR - 60, HALL.bot + 9], [1000, HALL.bot + 6]];
  [[e1, 128.93], [e2, 129.3]].forEach(([e, t0]) => {
    const ps = e.map(p => bj(plane(p[0], p[1]), 0.7)); const len = pathLen(ps); const k = expo(pr(t, t0, t0 + 1.0));
    s += `<polyline points="${pts(ps)}" fill="none" stroke="#0B0D10" stroke-width="16" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="${len}" stroke-dashoffset="${len * (1 - k)}"/>`;
    s += `<polyline points="${pts(ps)}" fill="none" stroke="${C.amber}" stroke-width="2" stroke-dasharray="${len}" stroke-dashoffset="${len * (1 - k)}" opacity="0.8"/>`;
    if (k > 0.05) { const p0 = ps[0]; s += `<circle cx="${p0[0]}" cy="${p0[1]}" r="7" fill="${C.amber}"/>`; }
  });
  // halls
  const hk = expo(pr(t, 129.9, 130.6));
  if (hk > 0) {
    const hp = [[HALL.x0, HALL.top], [HALL.x0 + (HALL.x1 - HALL.x0) * hk, HALL.top], [HALL.x0 + (HALL.x1 - HALL.x0) * hk, HALL.bot], [HALL.x0, HALL.bot]].map(p => bj(plane(...p), 0.7));
    const q = t > 140.17; const blink = q ? 0.55 + 0.45 * Math.sin(t * 6) : 1;
    s += `<polygon points="${pts(hp)}" fill="${q ? '#140F05' : '#3A2A0A'}" stroke="${C.amber}" stroke-width="2.5" stroke-dasharray="${q ? '8 6' : '0'}" opacity="${blink}"/>`;
    for (let i = 1; i < 6 && hk > 0.9 && !q; i++) { const a = plane(HALL.x0 + i * 50, HALL.top - 3), b = plane(HALL.x0 + i * 50, HALL.bot + 3); s += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${C.amber}" stroke-width="1" opacity="0.5"/>`; }
    if (q) { const c = plane((HALL.x0 + HALL.x1) / 2, (HALL.top + HALL.bot) / 2); s += TXT(c[0], c[1] + 16, '?', { size: 46, w: 900, fill: C.amber, a: 'middle', op: cl(pr(t, 140.3, 140.6)) }); }
  }
  return s;
}
function ruler(t) {
  if (t < 129.6) return '';
  const xr = 1150, base = plane(xr, SURF_H); let s = '';
  const k = expo(pr(t, 129.6, 130.4));
  const top = plane(xr, SURF_H), bot = plane(xr, SURF_H - 100 * k);
  s += `<line x1="${top[0]}" y1="${top[1]}" x2="${bot[0]}" y2="${bot[1]}" stroke="${C.text}" stroke-width="1.5"/>`;
  for (let m = 0; m <= 100 * k; m += 10) { const p = plane(xr, SURF_H - m); s += `<line x1="${p[0]}" y1="${p[1]}" x2="${p[0] + (m % 20 ? 8 : 16)}" y2="${p[1]}" stroke="${C.text}" stroke-width="1.2"/>`; if (m % 20 === 0) s += MONO(p[0] + 24, p[1] + 6, `-${m} m`, { size: 15, fill: m >= 80 ? C.amber : C.tele }); }
  return s;
}
function bomb(t) {
  // drop 132.47–135.6, impact 135.6, drill to -60 m by 137.4
  if (t < 132.3) return '';
  const xb = 850, sx = SURF_H; let s = '';
  const dk = expoIn(pr(t, 133.9, 135.6)); const zAir = lerp(SURF_H + 520, SURF_H, dk);
  const drill = inOut(pr(t, 135.6, 137.4)); const z = t < 135.6 ? zAir : SURF_H - 60 * drill;
  const app = cl(pr(t, 132.3, 132.6));
  // trail (motion blur feel)
  if (t < 135.6 && dk > 0.05) { const a = proj(xb, CUTY - 2, zAir + 140 * dk), b = proj(xb, CUTY - 2, zAir); s += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${C.blue}" stroke-width="10" opacity="0.18"/>`; }
  if (t >= 135.6) { const a = plane(xb, SURF_H), b = plane(xb, z); s += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#0B0D10" stroke-width="10"/><line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${C.blue}" stroke-width="2"/>`; }
  const p = proj(xb, CUTY - 2, z); const sc = 0.9;
  s += `<g opacity="${app}" transform="translate(${p[0]} ${p[1]}) scale(${sc})"><path d="M-9 -78 L9 -78 L9 -10 L0 8 L-9 -10 Z" fill="${C.blue}"/><path d="M-9 -78 L-18 -94 L18 -94 L9 -78 Z" fill="#3B5FA8"/></g>`;
  if (t < 135.6) s += MONO(p[0] + 26, p[1] - 40, 'GBU-57 · 30,000 lb', { size: 16, fill: C.blue, op: app });
  else s += MONO(p[0] + 20, p[1] + 4, `-${Math.round(60 * drill)} m`, { size: 18, w: 700, fill: C.blue });
  // impact shockwave ellipse on surface (doc07) + flash
  if (t > 135.6 && t < 137.2) { const k = pr(t, 135.6, 137.2); const rr = 40 + k * 260; const ring = []; for (let i = 0; i <= 48; i++) { const a = i / 48 * Math.PI * 2; ring.push(proj(xb + Math.cos(a) * rr, CUTY - Math.abs(Math.sin(a)) * rr * 0.9, hgt(xb + Math.cos(a) * rr, CUTY - Math.abs(Math.sin(a)) * rr * 0.9) + 2)); } s += `<polyline points="${pts(ring)}" fill="none" stroke="${C.text}" stroke-width="${3 * (1 - k) + 0.5}" opacity="${1 - k}"/>`; }
  // gap bracket 60 -> 80 m
  if (t > 137.6) { const g = expo(pr(t, 137.6, 138.3)); const a = plane(xb - 40, SURF_H - 60), b = plane(xb - 40, SURF_H - 60 - 20 * g); s += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${C.red}" stroke-width="3"/><line x1="${a[0] - 8}" y1="${a[1]}" x2="${a[0] + 8}" y2="${a[1]}" stroke="${C.red}" stroke-width="3"/>` + (g > 0.95 ? `<line x1="${b[0] - 8}" y1="${b[1]}" x2="${b[0] + 8}" y2="${b[1]}" stroke="${C.red}" stroke-width="3"/>` + MONO(a[0] - 18, (a[1] + b[1]) / 2 + 6, '≥20 m GRANITE LEFT', { size: 16, w: 700, fill: C.red, a: 'end' }) : ''); }
  return s;
}
function padlock(t) {
  if (t < 141.0) return ''; const p = plane(PXL, hgt(PXL, CUTY) + 30); const k = cl(spring(t, 141.0, 0.45), 0, 1.15);
  return `<g transform="translate(${p[0]} ${p[1] - 30}) scale(${k})"><rect x="-16" y="-4" width="32" height="26" rx="4" fill="${C.text}"/><path d="M-10 -4 V-14 a10 10 0 0 1 20 0 V-4" fill="none" stroke="${C.text}" stroke-width="4"/></g>` + MONO(p[0] + 30, p[1] - 30, 'IAEA · NO ACCESS', { size: 16, w: 700, fill: C.text, op: cl(pr(t, 141.2, 141.4)) });
}

export function frame(t) {
  BOIL = Math.floor(t * 12); // doc18: boil on twos
  // camera (doc09): satellite top-down -> isometric tilt, continuous drift, whip-in scale
  const tilt = inOut(pr(t, 127.4, 129.2));
  P.e = lerp(89.5, 30, tilt); P.yaw = lerp(40, 14, tilt) - pr(t, 129.2, 145.05) * 6;
  P.s = lerp(0.62, 0.98, expo(pr(t, 127.3, 129.4))) + (t - 127.3) * 0.004 - (t > 142.19 ? expo(pr(t, 142.19, 145.0)) * 0.07 : 0);
  P.cx = 1010 + Math.sin((t - 127.3) * 0.25) * 30; P.cy = lerp(540, 700, tilt);
  // bomb follow: slight camera push during drill
  if (t > 135.4 && t < 139) P.s += 0.03 * Math.sin(pr(t, 135.4, 139) * Math.PI);
  const cut = expoIn(pr(t, 128.7, 129.6)); // front half slides away
  let s = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="100%" height="100%" fill="${C.bg}"/>`;
  // floor shadow (doc17 elevation)
  const sh = [[X0, Y0], [X1, Y0], [X1, Y1], [X0, Y1]].map(p => proj(p[0], p[1], BOTTOM - 6));
  s += `<polygon points="${pts(sh)}" fill="#000" opacity="0.35" transform="translate(0 18)"/>`;
  // satellite grid overlay early
  if (tilt < 1) { s += `<g opacity="${(1 - tilt) * 0.5}">`; for (let i = 0; i <= 16; i++) { const a = proj(i * 100, Y0, 0), b = proj(i * 100, Y1, 0); s += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${C.blue}" stroke-width="1"/>`; } for (let j = 0; j <= 10; j++) { const a = proj(X0, j * 100, 0), b = proj(X1, j * 100, 0); s += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${C.blue}" stroke-width="1"/>`; } s += `</g>`; }
  s += terrain(t, 'back', 0, 1, 127.3);
  if (cut > 0) s += section(t) + tunnels(t) + ruler(t);
  if (cut < 1) s += slabSide(cut * 900, 1 - cut) + terrain(t, 'front', cut * 900, 1 - cut, 127.3);
  s += bomb(t) + padlock(t);
  // satellite-phase entrance markers (tunnel portals seen from above)
  if (tilt < 0.9) [[PXL, CUTY], [PXR, CUTY], [PXL + 40, CUTY + 90], [PXR - 30, CUTY - 80]].forEach(([x, y], i) => { const p = proj(x, y, hgt(x, y)); const k = cl(spring(t, 127.5 + i * 0.12, 0.4), 0, 1.15); s += `<rect x="${p[0] - 12 * k}" y="${p[1] - 12 * k}" width="${24 * k}" height="${24 * k}" fill="none" stroke="${C.amber}" stroke-width="2" opacity="${1 - tilt}"/>`; });
  // micro labels (HUD 70% micro-scale rule)
  s += MONO(80, 70, t < 129 ? 'SATELLITE VIEW · TUNNEL PORTALS' : 'CUTAWAY · ILLUSTRATIVE · NOT TO SCALE', { size: 16, ls: 3 });
  s += MONO(80, 96, 'KUH-E KOLANG GAZ LA · ≈2 km S OF NATANZ', { size: 16, ls: 3, fill: '#3E4A57' });
  if (t > 128.93) { const k = expo(pr(t, 128.93, 129.6)); s += `<g opacity="${k}" transform="translate(${(1 - k) * -30} 0)">` + TXT(80, 190, 'EST. 80–100 m', { size: 64, w: 900, fill: C.amber }) + MONO(84, 226, 'TUNNEL DEPTH · JAMES MARTIN CNS VIA AP · CSIS: UNCONFIRMED', { size: 15, ls: 2 }) + `</g>`; }
  if (t > 136.53) { const k = expo(pr(t, 136.53, 137.2)); s += `<g opacity="${k}" transform="translate(${(1 - k) * -30} 0)">` + TXT(80, 300, 'GBU-57 ≈ 60 m', { size: 52, w: 900, fill: C.blue }) + MONO(84, 332, '≈200 FT · DEEPEST US CONVENTIONAL BOMB', { size: 15, ls: 2 }) + `</g>`; }
  if (t > 142.19) { const k = expo(pr(t, 142.6, 143.4)); s += `<g opacity="${k}">` + TXT(1840, 190, 'WHAT IS DOWN THERE?', { size: 52, w: 900, a: 'end' }) + `</g>`; }
  // flash on impact (doc07 exposure)
  const fl = pr(t, 135.6, 135.9); if (fl > 0 && fl < 1) s += `<rect width="100%" height="100%" fill="#fff" opacity="${0.18 * (1 - fl)}"/>`;
  // vignette + paper/ink grain @12fps (doc12)
  s += `<defs><radialGradient id="vg" cx="50%" cy="48%" r="75%"><stop offset="55%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity="0.6"/></radialGradient></defs><rect width="100%" height="100%" fill="url(#vg)"/>`;
  s += `<image href="${grain[BOIL % 3]}" width="1920" height="1080" opacity="0.07"/>`;
  return s + `</svg>`;
}
export const render = t => new Resvg(frame(t), { font: { fontFiles: FONTS, loadSystemFonts: false, defaultFontFamily: 'Inter' } }).render().asPng();
const T0 = 127.29, T1 = 145.05;
if (process.argv[2] === 'stills') { fs.mkdirSync('stills_m', { recursive: true }); for (const tv of process.argv.slice(3).map(Number)) fs.writeFileSync(`stills_m/s_${tv}.png`, render(tv)); console.log('ok'); }
if (process.argv[2] === 'frames') { fs.mkdirSync('frames_m', { recursive: true }); const a = +process.argv[3], b = +process.argv[4]; for (let f = a; f < b; f++) fs.writeFileSync(`frames_m/f_${String(f).padStart(5, '0')}.png`, render(T0 + f / FPS)); console.log('frames', a, b); }
