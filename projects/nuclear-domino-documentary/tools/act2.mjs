// ACT 2 — VO 61.0 → 127.29 (claim, granite, date, verification, spread, disbelief, setting, Hormuz, Qeshm, Qatar, mountain intro, Midnight Hammer)
import * as L from './lib3d.mjs';
import { phoneLayer, screenWrap, texFromSVG } from './glbphone.mjs';
const { C, cl, pr, lerp, L3, expo, expoIn, inOut, sine, spring, rnd, kf, TXT, MONO, words, Cam, Scene, orbit, box, prism, cyl, worldMap, arc3, polyLen, marker, LL, frameSVG, cli, rotAxis, add, sub, mul, PH, tornCard2D, noteDrop, quad, shock, missile, flyArc, terrain, network, chapter, lower, tw, flagSVG, faceSVG } = L;
const BG = `<rect width="100%" height="100%" fill="url(#sky)"/>`;
const floor = (S, z = 0, ext = 60, st = 6) => { for (let i = -ext; i <= ext; i += st) { S.line([[i, -ext, z], [i, ext, z]], '#151A21', { sw: 1, z: 1e5 }); S.line([[-ext, i, z], [ext, i, z]], '#151A21', { sw: 1, z: 1e5 }); } };
const shots = []; const add2 = (t0, t1, fn) => shots.push({ t0, t1, fn });
const LLx = { ...LL, fordow: [50.996, 34.885], isfahan: [51.668, 32.655], oman: [57.0, 23.6], carrier: [59.4, 24.6] };
const P3 = (ll, z = 0) => [ll[0], ll[1], z];

// A1 61.0–63.45 claim vs denial: HUD reticle locks on Pickaxe (doc15)
add2(61.0, 63.45, t => {
  const tg = P3(LL.natanz); const cam = new Cam(orbit(tg, kf(t, [[61, -95], [63.45, -82, sine]]), kf(t, [[61, 38], [63.45, 30]]), kf(t, [[61, 14], [63.45, 11]])), tg, 40);
  const S = new Scene(cam, 0); worldMap(S, { hd: true, bbox: [44, 27, 60, 40], land: '#161C23', hi: { 364: '#3B1416' }, ext: { 364: 0.6 } });
  marker(S, P3(LL.natanz, 0.7), C.amber, t, 60.0, null, { size: 1.4 });
  let s = BG + S.out();
  const c = cam.p(P3(LL.natanz, 0.7)); const k = cl(spring(t, 61.05, 0.6), 0, 1.1);
  s += `<g transform="translate(${c[0]} ${c[1]}) scale(${0.6 + 0.4 * k}) rotate(${t * 20})"><circle r="150" fill="none" stroke="${C.blue}" stroke-width="1.5" stroke-dasharray="118 118"/><circle r="120" fill="none" stroke="#F2F2F2" stroke-width="1" stroke-dasharray="2 12" opacity="0.7"/></g><g transform="translate(${c[0]} ${c[1]}) rotate(${-t * 30})"><circle r="92" fill="none" stroke="${C.amber}" stroke-width="3" stroke-dasharray="40 22"/></g>`;
  const call = (t0, y, lab, val, col, fl) => { if (t < t0) return ''; const kk = expo(pr(t, t0, t0 + 0.4)); const fx = fl ? 62 : 0; return `<path d="M${c[0] + 150} ${c[1]} L${c[0] + 150 + 120 * kk} ${y}" stroke="${col}" stroke-width="1.5" fill="none"/>` + `<g opacity="${kk}">` + (fl ? flagSVG(fl, c[0] + 290, y - 22, 48, 32) : '') + MONO(c[0] + 290 + fx, y - 8, lab, { size: 16, ls: 3, fill: L.C.tele }) + TXT(c[0] + 290 + fx, y + 30, val, { size: 34, w: 800, fill: col }) + `</g>`; };
  s += call(61.1, c[1] - 120, 'ISRAELI INTELLIGENCE · CLAIM', 'Enrichment restarted', C.red, 'israel') + call(62.0, c[1] + 40, 'IRAN', 'Denies any activity', C.blue, 'iran') + call(62.6, c[1] + 190, 'IAEA INSPECTORS', 'Never inside', C.amber);
  return s;
});
// A2 v2 (Amin: the stacked box was "so basic") — illustrated mountain cross-section: granite texture, depth ruler,
// 300 ft = 91 m line at the suspected halls, a 30-storey building ghost for scale, a penetrator that drives in and stops.
const GR = { top: 262, px: 6.0, ix: 1060 }; // surface y at impact, px per metre, impact x
const prof = x => GR.top + 190 * (1 - Math.exp(-(((x - GR.ix) / 420) ** 2))) + 40 * Math.sin(x * 0.006) * (1 - Math.exp(-(((x - GR.ix) / 260) ** 2)));
const SPECK = Array.from({ length: 1400 }, (_, i) => [rnd(i * 1.7) * 1920, 200 + rnd(i * 3.1) * 900, 1 + rnd(i * 5.3) * 3.2, ['#A39789', '#5C524A', '#C2B1A3', '#3F3932', '#8C7F72'][Math.floor(rnd(i * 7.9) * 5)]]);
function granite(t) {
  let mt = 'M0 1080 L0 ' + prof(0).toFixed(1); for (let x = 0; x <= 1920; x += 20) mt += ` L${x} ${prof(x).toFixed(1)}`; mt += ' L1920 1080 Z';
  let s = `<defs><linearGradient id="grz" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7B6F62"/><stop offset="1" stop-color="#3A332D"/></linearGradient><clipPath id="mtc"><path d="${mt}"/></clipPath></defs>`;
  // far range (parallax layer)
  let far = 'M0 1080'; for (let x = 0; x <= 1920; x += 40) far += ` L${x} ${(300 + 90 * Math.sin(x * 0.004 + 1) + 40 * Math.sin(x * 0.011)).toFixed(1)}`; s += `<path d="${far} L1920 1080 Z" fill="#141A21"/>`;
  s += `<path d="${mt}" fill="url(#grz)"/><g clip-path="url(#mtc)">`;
  SPECK.forEach(([x, y, r, c]) => { if (y > prof(x) + 6) s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="${c}" opacity="0.55"/>`; });
  for (let i = 0; i < 9; i++) { let d = `M${-40} ${(420 + i * 80 + rnd(i) * 30).toFixed(0)}`; for (let x = 0; x <= 1960; x += 60) d += ` L${x} ${(420 + i * 80 + Math.sin(x * 0.004 + i) * 22 + rnd(i * 9 + x) * 8).toFixed(1)}`; s += `<path d="${d}" fill="none" stroke="#2C2621" stroke-width="1.5" opacity="0.45"/>`; }
  s += `</g><path d="${mt.replace(/ L1920 1080 Z$/, '').replace(/^M0 1080 L/, 'M')}" fill="none" stroke="#A89A8A" stroke-width="3"/>`;
  return s;
}
function bomb2D(x, y, sc = 1) { return `<g transform="translate(${x} ${y}) scale(${sc})"><path d="M-11 -110 L11 -110 L11 -20 Q11 6 0 22 Q-11 6 -11 -20 Z" fill="#C9CED6"/><path d="M-11 -110 L-26 -128 L-11 -92 Z M11 -110 L26 -128 L11 -92 Z" fill="#7A8594"/><rect x="-11" y="-60" width="22" height="6" fill="#5B8DEF"/></g>`; }
add2(63.45, 68.97, t => {
  const sc = 1 + (t - 63.45) * 0.012; const D = m => GR.top + m * GR.px; // depth (m) → y
  let s = BG + `<g transform="translate(${GR.ix} 560) scale(${sc}) translate(${-GR.ix} -560)">` + granite(t);
  // suspected halls at 80–100 m (faint, unknown)
  s += `<rect x="${GR.ix - 230}" y="${D(84)}" width="460" height="${16 * GR.px}" rx="22" fill="#0B0D10" stroke="#3A4350" stroke-width="2" stroke-dasharray="10 8" opacity="0.92"/>` + `<text x="${GR.ix}" y="${D(94) + 4}" fill="#5C7C99" font-family="DejaVu Sans Mono" font-size="20" letter-spacing="4" text-anchor="middle">SUSPECTED HALLS · ?</text>`;
  // 30-storey building ghost for scale (91 m)
  const gk = expo(pr(t, 66.3, 67.1)); if (gk > 0) { const bx = 560, bw = 150, by = D(0), bh = 91 * GR.px * gk; s += `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" fill="#F2F2F2" opacity="0.06" stroke="#F2F2F2" stroke-width="2" stroke-dasharray="8 6"/>`; for (let f = 1; f < 30; f++) if (f * 3.03 * GR.px < bh) s += `<line x1="${bx}" y1="${by + f * 3.03 * GR.px}" x2="${bx + bw}" y2="${by + f * 3.03 * GR.px}" stroke="#F2F2F2" stroke-width="1" opacity="0.18"/>`;
    s += `<g opacity="${pr(gk, 0.6, 1)}">` + MONO(bx + bw / 2, by + bh + 34, '≈ 30-STOREY BUILDING', { size: 16, a: 'middle', ls: 2, fill: C.text }) + `</g>`; }
  // 300 ft line at 91 m
  const pk = expo(pr(t, 66.07, 66.8)); if (pk > 0) { s += `<line x1="${400}" y1="${D(91)}" x2="${400 + 1180 * pk}" y2="${D(91)}" stroke="${C.red}" stroke-width="3" stroke-dasharray="14 8"/>`; if (pk > 0.5) s += `<g opacity="${pr(pk, 0.5, 1)}">` + TXT(110, D(91) + 12, '300 FT ≈ 91 m', { size: 34, w: 900, fill: C.red }) + `</g>`; }
  // depth ruler
  const rx = 1620; s += `<line x1="${rx}" y1="${D(0)}" x2="${rx}" y2="${D(100)}" stroke="#E8E3D8" stroke-width="2" opacity="${cl(pr(t, 63.6, 64.0))}"/>`;
  for (let m = 0; m <= 100; m += 10) s += `<line x1="${rx}" y1="${D(m)}" x2="${rx + (m % 50 ? 14 : 24)}" y2="${D(m)}" stroke="#E8E3D8" stroke-width="2" opacity="${cl(pr(t, 63.6 + m * 0.006, 64.0 + m * 0.006))}"/>` + (m % 20 === 0 ? MONO(rx + 34, D(m) + 6, `${m} m`, { size: 16, fill: '#C9C2B6', op: cl(pr(t, 63.7 + m * 0.006, 64.1 + m * 0.006)) }) : '');
  s += `<line x1="${GR.ix + 40}" y1="${D(0)}" x2="${rx}" y2="${D(0)}" stroke="#E8E3D8" stroke-width="1" stroke-dasharray="4 6" opacity="0.5"/>`;
  // penetrator: falls, hits at 65.6, drives to 60 m by 66.6, cracks + dust
  const fall = expoIn(pr(t, 64.6, 65.6)), drive = expo(pr(t, 65.6, 66.6)); const by2 = t < 65.6 ? lerp(-260, D(0), fall) : lerp(D(0), D(60), drive);
  if (t > 65.6) s += `<g clip-path="url(#mtc)"><rect x="${GR.ix - 13}" y="${D(0)}" width="26" height="${by2 - D(0)}" fill="#14110E"/></g>`;
  s += bomb2D(GR.ix, by2, 1.15);
  if (t > 65.6) { const k = pr(t, 65.6, 66.8); for (let i = 0; i < 26; i++) { const a = -Math.PI * (0.1 + rnd(i * 3) * 0.8), v = 60 + rnd(i * 5) * 260; const x = GR.ix + Math.cos(a) * v * k, y = D(0) + Math.sin(a) * v * k + 300 * k * k; s += `<circle cx="${x}" cy="${y}" r="${2 + rnd(i) * 5}" fill="#A39789" opacity="${1 - k}"/>`; } if (k < 0.3) s += `<circle cx="${GR.ix}" cy="${D(0)}" r="${40 + k * 300}" fill="#FFF3D6" opacity="${0.6 * (1 - k / 0.3)}"/>`; }
  if (t > 66.6) { const k = expo(pr(t, 66.6, 67.3)); for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI * 2 + rnd(i) * 0.5; let d = `M${GR.ix} ${D(60) + 20}`; let x = GR.ix, y = D(60) + 20; for (let j = 1; j <= 5; j++) { const r = 18 * j * k; x = GR.ix + Math.cos(a + (rnd(i * 7 + j) - 0.5) * 0.6) * r; y = D(60) + 20 + Math.sin(a + (rnd(i * 3 + j) - 0.5) * 0.6) * r; d += ` L${x.toFixed(1)} ${y.toFixed(1)}`; } s += `<path d="${d}" fill="none" stroke="#1A1612" stroke-width="2.5"/>`; } }
  if (t > 66.4) { const k = expo(pr(t, 66.4, 66.8)); s += `<g opacity="${k}"><line x1="${GR.ix + 40}" y1="${D(60)}" x2="${GR.ix + 160}" y2="${D(60)}" stroke="${C.blue}" stroke-width="2"/>` + TXT(GR.ix + 172, D(60) + 10, 'GBU-57 STOPS ≈ 60 m', { size: 26, w: 800, fill: '#9FB7E8' }) + `</g>`; }
  s += `</g>`;
  s += words(t, ['NO', 'CONVENTIONAL', 'WEAPON', 'CAN', 'PUNCH', 'THROUGH'], 110, 140, 44, 800, 64.37, 0.3, { ls: 2, keep: [4], keepCol: C.red });
  if (t > 67.0) s += words(t, ['300', 'FT', 'OF', 'SOLID', 'GRANITE'], 110, 196, 30, 800, 67.0, 0.12, { ls: 3, keep: [3, 4], keepCol: '#C2B1A3', fill: C.sub });
  s += MONO(1810, 1040, 'ILLUSTRATIVE CROSS-SECTION · DEPTHS TO SCALE, TERRAIN NOT', { size: 13, a: 'end', ls: 2, fill: '#4A5563' });
  return s;
});
// (old box version kept for reference, unused)
const graniteBoxUnused = (t => {
  const tg = [0, 0, -6]; const cam = new Cam(orbit(tg, kf(t, [[63.45, -70], [68.97, -96, sine]]), kf(t, [[63.45, 22], [68.97, 12]]), kf(t, [[63.45, 52, expo], [64.3, 40], [68.97, 36]])), tg, 40);
  const S = new Scene(cam, Math.floor(t * 12)); floor(S, 0.01, 40);
  const cols = ['#8A7A65', '#7A6B58', '#6B5E4D', '#5E5244', '#52483C'];
  const cut = expo(pr(t, 64.0, 64.9));
  for (let i = 0; i < 5; i++) { const z0 = -16 + i * 3.2; box(S, [-6, 0, z0], [12, 6, 3.2], cols[4 - i], { boil: true, stroke: '#1B1F25', sw: 1 });
    S.face([[-6, -0.01, z0], [6, -0.01, z0], [6, -0.01, z0 + 3.2], [-6, -0.01, z0 + 3.2]], L.shadeHex(cols[4 - i], 0.55), { shade: false, stroke: '#E8DCC8', sw: 1.2, z: 0.6 }); }
  { const fr = 1 - cut; if (fr > 0) box(S, [-6, -6 - (1 - fr) * 14, -16], [12, 6, 16], '#7A6B58', { op: fr, stroke: '#1B1F25', sw: 1 }); }
  // 300 ft plane at depth 9.1 (scale 1 unit = 10 m) visible as red slab edge
  const pk = expo(pr(t, 66.07, 66.8)); if (pk > 0) { S.line([[-6.05, -0.06, -9.1], [-6.05 + 12.1 * pk, -0.06, -9.1]], C.red, { sw: 3, dash: '10 6', z: -5 }); S.line([[-6.05, -0.06, -9.1], [-6.05, 6.05 * pk, -9.1]], C.red, { sw: 3, dash: '10 6', z: -5 }); }
  // bomb: falls 64.37 → hits 65.6 → drives to -6 (60 m) by 66.6
  const fall = expoIn(pr(t, 64.4, 65.6)), drive = inOut(pr(t, 65.6, 66.7)); const zb = t < 65.6 ? lerp(18, 0, fall) : -6 * drive;
  missile(S, [0.5, -0.3, zb + 1.6], [0, 0, -1], 3.4, '#5B8DEF');
  if (t > 65.6) { S.line([[0.5, -0.3, 0.1], [0.5, -0.3, zb]], '#0B0D10', { sw: 6, z: -4 }); shock(S, [0.5, 3, 0.02], t, 65.6, 7, '#F2F2F2', 1.2); }
  let s = BG + S.out();
  s += words(t, ['NO', 'CONVENTIONAL', 'WEAPON', 'CAN', 'PUNCH', 'THROUGH'], 110, 140, 44, 800, 64.37, 0.3, { ls: 2, keep: [4], keepCol: C.red });
  if (t > 64.9) s += MONO(110, 190, 'GRANITE · 1 BLOCK = 32 m · ILLUSTRATIVE', { size: 15, ls: 3, op: cl(pr(t, 64.9, 65.2)) });
  if (t > 66.4) { const p = cam.p([0.5, -0.3, -6]); s += `<g opacity="${cl(pr(t, 66.4, 66.7))}">` + MONO(p[0] + 30, p[1], 'GBU-57 · STOPS ≈60 m', { size: 18, w: 700, fill: C.blue }) + `</g>`; }
  if (pk > 0.6) { const p = cam.p([-6.05, -0.06, -9.1]); s += MONO(p[0] - 14, p[1] + 26, '"300 FT OF SOLID GRANITE" ≈ 91 m', { size: 17, w: 700, fill: C.red, a: 'end', op: cl(pr(t, 66.5, 66.8)) }); }
  return s;
});
void graniteBoxUnused;
// A3 68.97–73.51 a row of seven day-blocks, Nov 7 rises
add2(68.97, 73.51, t => {
  const tg = [kf(t, [[68.97, -6], [73.51, 6]]), 0, 1.5]; const cam = new Cam(orbit(tg, -100 + Math.sin(t * 0.5) * 6, 24, kf(t, [[68.97, 34, expo], [69.6, 26], [73.51, 24]])), tg, 40);
  const S = new Scene(cam, Math.floor(t * 12)); floor(S, 0, 50, 4);
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  for (let i = 0; i < 7; i++) { const x = -12 + i * 4, last = i === 6; const e = cl(spring(t, 69.1 + i * 0.1, 0.45), 0, 1.1); const lift = last ? expo(pr(t, 71.35, 72.0)) * 2.4 : 0;
    box(S, [x - 1.6, -1, lift], [3.2, 2, 3.6 * e], last && t > 71.35 ? '#3A2A0A' : '#1C222A', { stroke: last && t > 71.35 ? C.amber : '#2A323D', sw: 1.4 });
    quad(S, [x - 1.6, -1.02, lift + 3.6 * e], [x + 1.6, -1.02, lift + 3.6 * e], [x - 1.6, -1.02, lift], 320, 360, `<text x="160" y="80" fill="${last && t > 71.35 ? C.amber : '#5C7C99'}" font-family="DejaVu Sans Mono" font-size="40" text-anchor="middle" letter-spacing="6">${days[i]}</text><text x="160" y="270" fill="${last && t > 71.35 ? C.amber : (i ? '#3A4350' : '#F2F2F2')}" font-family="Inter" font-weight="900" font-size="170" text-anchor="middle">${i + 1}</text>`);
    if (last && t > 71.35) S.face([[x - 2.2, -1.6, 0.02], [x + 2.2, -1.6, 0.02], [x + 2.2, 1.6, 0.02], [x - 2.2, 1.6, 0.02]], '#000', { shade: false, op: 0.4, z: 2 }); }
  let s = BG + S.out();
  s += MONO(110, 120, 'NOVEMBER 2026', { size: 20, ls: 6, op: cl(pr(t, 69.0, 69.3)) });
  s += words(t, ['AS', 'EARLY', 'AS', 'NOVEMBER', '7'], 960, 880 - 40, 56, 900, 70.81, 0.17, { a: 'middle', keep: [4] });
  return s;
});
// A4 73.51–78.71 verification bay: phone under scan beam, telemetry
function phoneScreen() { return `<rect width="720" height="1400" rx="60" fill="#000"/><text x="360" y="110" fill="#E7E9EA" font-family="Inter" font-weight="800" font-size="34" text-anchor="middle">Post</text><circle cx="90" cy="250" r="48" fill="#333639"/><text x="90" y="263" fill="#E7E9EA" font-family="Inter" font-weight="700" font-size="34" text-anchor="middle">TC</text><text x="160" y="240" fill="#E7E9EA" font-family="Inter" font-weight="800" font-size="36">Tucker Carlson</text><text x="160" y="284" fill="#71767B" font-size="30" font-family="Inter">@TuckerCarlson</text>` + ['…the Trump administration', 'may be within days of', 'launching a nuclear', 'strike on Iran.'].map((l, i) => `<text x="44" y="${420 + i * 76}" fill="#E7E9EA" font-family="Inter" font-size="52">${l}</text>`).join('') + `<text x="44" y="760" fill="#71767B" font-family="Inter" font-size="30">8:47 PM · Nov 1, 2026</text>`; }
// v2: Amin's iPhone GLB (glbphone.mjs) with the post mapped onto its screen
function phone(S, c, ang = 0) { const R = q => rotAxis(q, [0, 0, 1], ang, [0, 0, 0]); phoneLayer(S, c, 14, R, { tag: 'a2', tex: A2TEX || (A2TEX = texFromSVG(screenWrap(phoneScreen(), { id: 'a2' }))) }); }
let A2TEX = null;
function phoneOldBox(S, c, ang = 0) { const [x, y, z] = c; const w = 7.2, d = 0.7, h = 14; const pv = [x, y, z]; const R = p => rotAxis(p, [0, 0, 1], ang, pv);
  box(S, [x - w / 2, y - d / 2, z], [w, d, h], '#1A1D22', { rot: ang, pivot: pv });
  quad(S, R([x - w / 2 + 0.35, y - d / 2 - 0.02, z + h - 0.35]), R([x + w / 2 - 0.35, y - d / 2 - 0.02, z + h - 0.35]), R([x - w / 2 + 0.35, y - d / 2 - 0.02, z + 0.35]), 720, 1400, phoneScreen(), { z: -0.6 }); }
add2(73.51, 78.71, t => {
  const tg = [0, 0, 7]; const cam = new Cam(orbit(tg, kf(t, [[73.51, -112], [78.71, -80, sine]]), 10, kf(t, [[73.51, 36, expo], [74.3, 28], [78.71, 26]])), tg, 40);
  const S = new Scene(cam, Math.floor(t * 12)); floor(S, 0, 40, 4); box(S, [-6, -3, 0], [12, 6, 0.6], '#12161C', {}); phone(S, [0, 0, 0.6]);
  // scan beam plane sweeping down (blue) then red
  [[73.6, C.blue], [75.7, C.red]].forEach(([t0, col]) => { const k = pr(t, t0, t0 + 1.0); if (k > 0 && k < 1) { const z = 15 - k * 15; S.face([[-5, -1.2, z], [5, -1.2, z], [5, -1.2, z - 1.2], [-5, -1.2, z - 1.2]], col, { shade: false, op: 0.18, z: -3 }); S.line([[-5.5, -1.25, z], [5.5, -1.25, z]], col, { sw: 2.5, z: -3.1 }); } });
  let s = BG + S.out();
  s += L.MONO(1240, 300, 'SOURCE CHECK · POST 01 NOV 2026', { size: 18, ls: 3, fill: C.blue, op: cl(pr(t, 73.6, 73.8)) });
  const rows = [[73.9, 'DOCUMENTS ATTACHED', '0', C.red], [74.6, 'NAMED SOURCES', 'NONE', C.red], [75.61, 'MAJOR OUTLETS', 'UNVERIFIED', C.amber], [76.5, 'WHITE HOUSE', 'NOT THE PLAN', C.blue]];
  rows.forEach(([t0, a, b, col], i) => { if (t < t0) return; const n = Math.floor((t - t0) * 60); const full = a + ' ' + '·'.repeat(26 - a.length) + ' '; const shown = full.slice(0, n); const y = 360 + i * 46;
    s += MONO(1240, y, shown, { size: 20, fill: '#5C7C99' }); if (n >= full.length) s += MONO(1240 + full.length * 12.04, y, (t - t0 - full.length / 60 < 0.3) ? '#'.repeat(b.length) : b, { size: 20, w: 700, fill: col }); });
  return s;
});
// A5 78.71–83.29 the spread: pixel-stream network from the phone (doc10)
add2(78.71, 83.29, t => {
  const tg = [0, 0, 7]; const cam = new Cam(orbit(tg, kf(t, [[78.71, -80], [83.29, -40, sine]]), kf(t, [[78.71, 10], [83.29, 22]]), kf(t, [[78.71, 26], [83.29, 62, inOut]])), tg, 42);
  const S = new Scene(cam, 0); floor(S, 0, 60, 6); phone(S, [0, 0, 0.6]);
  network(S, [0, 0, 8], 26, 90, t, 78.8, { spread: 3.6 });
  let s = BG + S.out();
  const v = 0.5 + 0.38 * Math.sin((t - 78.7) * 2.4) * Math.exp(-(t - 78.7) * 0.2), x = 1240, y = 300, w = 520;
  s += `<g opacity="${expo(pr(t, 78.8, 79.3))}">` + MONO(x, y, 'ONLINE REACTION', { size: 18, ls: 3 }) + `<rect x="${x}" y="${y + 20}" width="${w}" height="10" rx="5" fill="#1C2229"/><rect x="${x}" y="${y + 20}" width="${w * v}" height="10" rx="5" fill="${C.amber}"/><circle cx="${x + w * v}" cy="${y + 25}" r="9" fill="${C.text}"/>` + MONO(x, y + 62, 'DISMISSAL', { size: 16, fill: C.sub }) + MONO(x + w, y + 62, 'SHARED WIDELY', { size: 16, fill: C.sub, a: 'end' }) + `</g>`;
  if (t > 81.3) s += `<g opacity="${cl(pr(t, 81.3, 81.6))}">` + MONO(x, y + 120, 'SHARED BY JOURNALISTS · BOTH SIDES', { size: 18, ls: 2, fill: C.text }) + `</g>`;
  return s;
});
// A6 83.29–91.89 DISBELIEF → three paper cards fold in (doc07 paper fold) → ABSURD?
add2(83.29, 91.89, t => {
  const tg = [0, 0, 5]; const cam = new Cam(orbit(tg, kf(t, [[83.29, -96], [91.89, -84, sine]]), 8, kf(t, [[83.29, 40], [86.3, 34], [91.89, 30]])), tg, 40);
  const S = new Scene(cam, Math.floor(t * 12)); floor(S, 0, 40, 4);
  const cards = [[86.47, 'An American president', C.blue], [87.83, 'ordering a nuclear attack', C.red], [89.01, 'on a non-nuclear state', '#E8E3D8']];
  cards.forEach(([t0, txt, col], i) => { if (t < t0) return; const fold = 1 - expo(pr(t, t0, t0 + 0.55)); const z = 9 - i * 3.2; const piv = [-9, -0.2, z];
    const R = p => rotAxis(p, [0, 0, 1], fold * 1.5, piv); const dim = t > 90.2 ? 0.45 : 1;
    quad(S, R([-9, -0.2, z]), R([9, -0.2, z]), R([-9, -0.2, z - 2.6]), 1800, 260, `<rect width="1800" height="260" fill="#EDE6D6"/><rect width="14" height="260" fill="${col}"/><text x="60" y="170" fill="#15171B" font-family="Inter" font-weight="800" font-size="110">${txt}</text>`, { op: dim, backface: true }); });
  let s = BG + S.out();
  const op = cl(pr(t, 83.4, 83.8)) * (1 - pr(t, 86.1, 86.45)); if (op > 0) { const ls = lerp(70, 14, expo(pr(t, 83.29, 84.6))); s += `<rect width="100%" height="100%" fill="#07080A" opacity="${op * 0.6}"/>` + MONO(960, 420, 'THE LOUDEST REACTION', { size: 22, a: 'middle', ls: 8, op }) + TXT(960, 590, 'DISBELIEF', { size: 190, w: 900, a: 'middle', ls, fill: L.mixc(C.amber, C.text, pr(t, 84.5, 85.3)), op }); }
  if (t > 90.23) { const a = spring(t, 90.23, 0.45); s += `<g opacity="${cl(pr(t, 90.23, 90.35))}" transform="translate(1560 200) scale(${0.7 + 0.3 * cl(a, 0, 1.12)}) translate(-1560 -200)">` + TXT(1560, 230, 'ABSURD?', { size: 104, w: 900, a: 'middle', fill: C.red }) + `</g>`; }
  return s;
});
// A7 91.89–98.19 the setting is real: Washington ↔ Tehran arcs across the Atlantic
add2(91.89, 98.19, t => {
  const tg = [-10, 36, 0]; const cam = new Cam(orbit(tg, kf(t, [[91.89, -100], [98.19, -70, sine]]), kf(t, [[91.89, 45], [98.19, 32]]), kf(t, [[91.89, 170], [98.19, 150]])), tg, 40);
  const S = new Scene(cam, 0); worldMap(S, { bbox: [-100, 5, 75, 70], land: '#161C23', hi: { 840: '#1B2A3D', 364: '#3B1416' } });
  marker(S, P3(LL.washington), C.blue, t, 94.89, 'Washington', { fs: 26, flag: 'usa' }); marker(S, P3(LL.tehran), C.red, t, 95.4, 'Tehran', { fs: 26, flag: 'iran' });
  for (let i = 0; i < 6; i++) { const t0 = 95.6 + i * 0.42, ab = i % 2 === 0; flyArc(S, P3(ab ? LL.washington : LL.tehran, 0.3), P3(ab ? LL.tehran : LL.washington, 0.3), 26, t, t0, 1.2, ab ? C.blue : C.red, { fade: [0.2, 1.0], len: 3, R: 4 }); }
  let s = BG + S.out();
  s += words(t, ['YET', 'IT', 'SPREAD'], 960, 150, 32, 700, 91.89, 0.2, { a: 'middle', ls: 6, fill: C.sub, acc: C.sub });
  s += words(t, ['THE', 'SETTING', 'IS', 'REAL'], 960, 250, 96, 900, 92.99, 0.22, { a: 'middle', keep: [3], keepCol: C.red });
  if (t > 95.0) s += MONO(960, 300, 'TRADING BLOWS ALL YEAR · 2026', { size: 18, a: 'middle', ls: 6, op: cl(pr(t, 95.0, 95.3)) });
  return s;
});
// A8 98.19–101.47 February strikes: impacts across extruded Iran + B-2 torn photo
add2(98.19, 101.47, t => {
  const tg = [53, 32, 0]; const cam = new Cam(orbit(tg, kf(t, [[98.19, -110], [101.47, -92, sine]]), kf(t, [[98.19, 50], [101.47, 40]]), kf(t, [[98.19, 44], [101.47, 36]])), tg, 40);
  const S = new Scene(cam, 0); worldMap(S, { hd: true, bbox: [40, 22, 66, 42], land: '#161C23', hi: { 364: '#3B1416' }, ext: { 364: 0.6 } });
  [[51.4, 35.7], [51.7, 33.7], [51.0, 34.9], [51.6, 32.6], [56.3, 27.2], [48.3, 30.3], [46.3, 38.1]].forEach((ll, i) => flyArc(S, [ll[0] - 9, ll[1] + 2, 0.6], [ll[0], ll[1], 0.6], 5, t, 98.3 + i * 0.22, 0.6, C.red, { len: 1.2, R: 2.2, fade: [0.4, 1.4] }));
  let s = BG + S.out();
  s += tornCard2D(t, 98.4, PH('b2'), 1180, 520, 600, 400, { seed: 7, rot: 4, caption: 'B-2 SPIRIT', credit: 'USAF · PD', s0: 1.1 });
  s += MONO(110, 120, 'FEBRUARY 2026', { size: 22, ls: 6, fill: C.red, op: cl(pr(t, 98.2, 98.4)) }) + words(t, ['US', '&', 'ISRAELI', 'STRIKES'], 110, 190, 60, 900, 98.3, 0.15, {});
  s += flagSVG('usa', 110, 222, 66, 44, { op: cl(pr(t, 98.5, 98.8)) }) + flagSVG('israel', 190, 222, 66, 44, { op: cl(pr(t, 98.65, 98.95)) });
  return s;
});
// A9 101.47–109.11 Hormuz: tankers in the strait, Qeshm strike from the sea
// v2 (Amin: ships crossed land): real two-way lane through the strait, every waypoint checked ≥0.17° from the coast (check_lane.mjs)
const LANE = [[54.2, 26.0], [55.0, 26.05], [55.6, 26.25], [56.0, 26.4], [56.35, 26.57], [56.6, 26.35], [56.75, 26.0], [56.9, 25.7], [57.2, 25.4], [57.6, 25.1]];
const LSEG = LANE.slice(1).map((p, i) => Math.hypot(p[0] - LANE[i][0], p[1] - LANE[i][1])); const LTOT = LSEG.reduce((a, b) => a + b, 0);
function laneAt(u, side) { let d = cl(u) * LTOT, i = 0; while (i < LSEG.length - 1 && d > LSEG[i]) { d -= LSEG[i]; i++; } const a = LANE[i], b = LANE[i + 1], k = d / LSEG[i]; const dx = b[0] - a[0], dy = b[1] - a[1], m = Math.hypot(dx, dy); return { p: [a[0] + dx * k - dy / m * 0.045 * side, a[1] + dy * k + dx / m * 0.045 * side], ang: Math.atan2(dy, dx) }; }
function tanker(S, p, ang, len = 0.24) { box(S, [p[0] - len / 2, p[1] - 0.035, 0.0], [len, 0.07, 0.025], '#B8442F', { rot: ang, pivot: [p[0], p[1], 0] }); box(S, [p[0] + len * 0.28, p[1] - 0.028, 0.025], [len * 0.16, 0.056, 0.03], '#E8E3D8', { rot: ang, pivot: [p[0], p[1], 0] }); }
add2(101.47, 109.11, t => {
  const sw = inOut(pr(t, 103.8, 105.0)); const tg = L3([56.3, 26.3, 0], [55.9, 26.8, 0], sw);
  const cam = new Cam(orbit(tg, kf(t, [[101.47, -120], [104.4, -100], [109.11, -70, sine]]), kf(t, [[101.47, 40], [109.11, 30]]), kf(t, [[101.47, 16], [104.4, 11], [109.11, 9]])), tg, 40);
  const S = new Scene(cam, 0);
  S.face([[52, 22, -0.02], [62, 22, -0.02], [62, 30, -0.02], [52, 30, -0.02]], '#0B1220', { shade: false, z: 3e5 });
  worldMap(S, { hd: true, bbox: [52, 22, 62, 30], land: '#1E242C', hi: { 364: '#3B1416' }, ext: { 364: 0.06, 512: 0.04, 784: 0.04 } });
  for (let i = 0; i < 8; i++) { const out = i % 2; const ph = ((t - 101.4) * 0.035 + i / 8) % 1; const { p, ang } = laneAt(out ? ph : 1 - ph, out ? 1 : -1); tanker(S, p, out ? ang : ang + Math.PI); }
  marker(S, [55.83, 26.8, 0.07], C.red, t, 104.43, 'Qeshm Island', { fs: 26, sub: '2 NOV 2026 · "DEFENSIVE" US STRIKES', subCol: C.red, flag: 'iran' });
  const US = [57.9, 24.75]; box(S, [US[0] - 0.17, US[1] - 0.04, 0.0], [0.34, 0.08, 0.04], '#8A95A3', {}); // US warship (illustrative), open water in the Gulf of Oman
  S.at([US[0], US[1], 0.1], (x, y) => flagSVG('usa', x - 22, y + 14, 44, 29, { op: cl(pr(t, 104.6, 104.9)) }), { z: -8 });
  for (let i = 0; i < 3; i++) flyArc(S, [US[0], US[1], 0.06], [55.83 + (i - 1) * 0.08, 26.8 + (i - 1) * 0.04, 0.07], 0.9, t, 104.8 + i * 0.35, 0.9, C.red, { len: 0.12, R: 0.35, fade: [0.5, 2] });
  let s = BG + S.out();
  s += tornCard2D(t, 101.7, PH('hormuz_night'), 1220, 120, 560, 380, { seed: 11, rot: 3, caption: 'STRAIT OF HORMUZ · ISS', credit: 'NASA · PD', t1: 104.2 });
  s += tornCard2D(t, 104.6, PH('qeshm_nasa'), 1240, 140, 520, 400, { seed: 13, rot: -4, caption: 'QESHM ISLAND', credit: 'NASA · PD' });
  s += words(t, ['STRAIT', 'OF', 'HORMUZ'], 110, 150, 56, 900, 101.6, 0.15, {});
  if (t > 105.5) s += MONO(110, 200, 'US OFFICIALS: LIMITED, DEFENSIVE OPERATION', { size: 17, ls: 3, fill: C.sub, op: cl(pr(t, 105.5, 105.8)) });
  return s;
});
// A10 109.11–113.29 ceasefire tested · Qatar-led talks: threads from Doha
add2(109.11, 113.29, t => {
  const tg = [52, 29, 0]; const cam = new Cam(orbit(tg, kf(t, [[109.11, -95], [113.29, -75, sine]]), 40, kf(t, [[109.11, 34], [113.29, 28]])), tg, 40);
  const S = new Scene(cam, 0); worldMap(S, { hd: true, bbox: [38, 18, 66, 42], land: '#161C23', hi: { 364: '#3B1416', 634: '#1B2A3D' }, ext: { 364: 0.4, 634: 0.4 } });
  marker(S, [LL.doha[0], LL.doha[1], 0.5], C.blue, t, 109.3, 'Doha', { fs: 28, sub: 'QATAR-LED MEDIATION', flag: 'qatar' }); marker(S, [LL.tehran[0], LL.tehran[1], 0.5], C.red, t, 110.6, 'Tehran', { fs: 24, flag: 'iran' });
  const wob = Math.sin(t * 7) * 0.4 * (1 - pr(t, 110.2, 111.2));
  const lk = expo(pr(t, 110.8, 111.8)); if (lk > 0) { const a = arc3([LL.doha[0], LL.doha[1], 0.6], [LL.tehran[0], LL.tehran[1], 0.6], 2 + wob, 30); S.line(a.slice(0, Math.max(2, Math.round(lk * 30))), C.blue, { sw: 2.5, dash: '10 6' }); }
  const w2 = expo(pr(t, 111.6, 112.4)); if (w2 > 0) { const a = arc3([LL.doha[0], LL.doha[1], 0.6], [40, 30, 0.6], 4, 30); S.line(a.slice(0, Math.max(2, Math.round(w2 * 30))), C.blue, { sw: 2.5, dash: '10 6' }); S.at([40.5, 30, 2], (x, y) => MONO(x, y, '→ WASHINGTON', { size: 16, fill: C.blue, ls: 2, a: 'end' }), { z: -5 }); }
  let s = BG + S.out();
  let d = 'M110 210'; for (let x = 0; x <= 700; x += 10) { const amp = 18 * Math.exp(-((x - 350) ** 2) / 20000) * Math.sin(x * 0.08 + t * 9) * (t < 110.4 ? 1 : 0.3); d += ` L${110 + x} ${210 + amp}`; }
  s += `<path d="${d}" fill="none" stroke="${C.amber}" stroke-width="3" opacity="${cl(pr(t, 109.11, 109.4))}"/>` + MONO(110, 170, 'CEASEFIRE · HOLDING · TESTED · HOLDING', { size: 18, fill: C.amber, ls: 2, op: cl(pr(t, 109.11, 109.4)) });
  s += words(t, ['QATAR-LED', 'TALKS', 'CONTINUE'], 110, 300, 56, 900, 110.11, 0.4, { keep: [0], keepCol: C.blue });
  return s;
});
// A11 113.29–115.43 chapter 02
add2(113.29, 115.43, t => { const ex = pr(t, 115.1, 115.43); return `<rect width="100%" height="100%" fill="#07090C"/><g opacity="${1 - ex}" transform="translate(${-ex * 300} 0)">` + chapter(t, 113.29, '02', 'THE MOUNTAIN', { keep: [1] }) + `</g>`; });
// A12 115.43–120.15 Natanz complex + Pickaxe terrain 2 km south (iso 3-tone)
function natanzScene(S, t, t0) {
  floor(S, 0, 40, 4);
  terrain(S, [0, -6, 0], 9, 6, 16, (u, v) => Math.max(0, 7 * Math.exp(-(u * u * 2.2 + v * v * 2.6)) + 1.4 * Math.exp(-((u - 0.5) ** 2 * 6 + (v + 0.3) ** 2 * 6))), '#8A7A65', { boil: true });
  for (let i = 0; i < 8; i++) { const e = cl(spring(t, t0 + i * 0.06, 0.45), 0, 1.1); box(S, [-6 + (i % 4) * 3.2, 8 + Math.floor(i / 4) * 3, 0], [2.4, 2, (0.6 + (i % 3) * 0.4) * e], '#5E6670', {}); }
  S.line([[-7, 7, 0.05], [7, 7, 0.05], [7, 14.5, 0.05], [-7, 14.5, 0.05], [-7, 7, 0.05]], '#9AA4B2', { sw: 1.5, dash: '6 6' });
}
add2(115.43, 120.15, t => {
  const tg = [0, 2, 1.5]; const cam = new Cam(orbit(tg, kf(t, [[115.43, -140], [120.15, -110, sine]]), kf(t, [[115.43, 52], [120.15, 36]]), kf(t, [[115.43, 62, expo], [116.4, 50], [120.15, 46]])), tg, 40);
  const S = new Scene(cam, Math.floor(t * 12)); natanzScene(S, t, 115.5);
  marker(S, [0, 10.6, 2.2], '#9AA4B2', t, 116.9, 'Natanz', { fs: 28, sub: 'MAIN ENRICHMENT SITE' });
  marker(S, [0, -6, 7.6], C.amber, t, 115.6, 'Pickaxe Mountain', { fs: 34, sub: 'KUH-E KOLANG GAZ LA', subCol: C.amber, size: 1.3 });
  const dk = expo(pr(t, 117.6, 118.6)); if (dk > 0) { S.line([[9.5, -6, 0.1], [9.5, -6 + 16.6 * dk, 0.1]], C.text, { sw: 2.5, z: -3 }); if (dk > 0.9) S.at([10, 2.3, 0.2], (x, y) => MONO(x + 14, y, '≈ 2 km', { size: 20, w: 700, fill: C.text }), { z: -5 }); }
  return BG + S.out();
});
// A13 120.15–127.29 Midnight Hammer: B-2 path hits Fordow / Natanz / Isfahan; Pickaxe untouched
add2(120.15, 127.29, t => {
  const tg = [51.4, 33.8, 0]; const cam = new Cam(orbit(tg, kf(t, [[120.15, -120], [127.29, -88, sine]]), kf(t, [[120.15, 55], [127.29, 42]]), kf(t, [[120.15, 22], [124, 14], [127.29, 10, inOut]])), tg, 40);
  const S = new Scene(cam, 0); worldMap(S, { hd: true, bbox: [44, 28, 58, 39], land: '#161C23', hi: { 364: '#3B1416' }, ext: { 364: 0.5 } });
  const sites = [[LLx.fordow, 'Fordow', 121.5], [LL.natanz, 'Natanz', 122.1], [LLx.isfahan, 'Isfahan', 122.7]];
  sites.forEach(([ll, n, t0], i) => { flyArc(S, [ll[0] - 7, ll[1] + 3, 4], [ll[0], ll[1], 0.55], 2, t, t0, 0.7, C.red, { len: 0.5, R: 1.2, fade: [0.4, 3] }); marker(S, [ll[0], ll[1], 0.55], '#9AA4B2', t, t0 + 0.7, n, { fs: 22, sub: 'HIT · JUNE 2025', subCol: C.red, left: i === 1, dy: [0, -50, 40][i] }); });
  marker(S, [LL.natanz[0] - 0.01, LL.natanz[1] - 0.02, 0.55], C.amber, t, 123.6, 'Pickaxe Mountain', { fs: 26, sub: 'NEVER HIT', subCol: C.amber, dy: 34, left: true });
  let s = BG + S.out();
  s += tornCard2D(t, 120.3, PH('midnight_hammer'), 1180, 110, 620, 420, { seed: 17, rot: 3, caption: 'OPERATION MIDNIGHT HAMMER · JUNE 2025', credit: 'US DoD · PD', t1: 124.2 });
  s += tornCard2D(t, 124.4, PH('mop'), 1300, 120, 440, 560, { seed: 19, rot: -3, caption: 'GBU-57 TEST DROP', credit: 'USAF · PD' });
  s += flagSVG('usa', 110, 214, 60, 40, { op: cl(pr(t, 124.2, 124.5)) });
  s += MONO(110, 120, 'JUNE 2025', { size: 22, ls: 6, fill: C.red, op: cl(pr(t, 120.2, 120.4)) }) + words(t, ['OPERATION', 'MIDNIGHT', 'HAMMER'], 110, 190, 58, 900, 125.15 - 1.2, 0.18, {});
  return s;
});

export function frame(t) { const sh = shots.find(s => t >= s.t0 && t < s.t1) || shots[shots.length - 1]; return frameSVG(t, sh.fn(t)); }
cli(frame, 61.0, 'a2');
