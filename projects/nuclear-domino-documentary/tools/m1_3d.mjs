// MINUTE 1 — full 3D drawn version (VO 0–61 s)
import { phoneLayer, screenWrap, texFromSVG } from './glbphone.mjs';
import { quad } from './lib3d.mjs';
import { whiteHouse as whiteHouse2, WH_DEFS } from './wh3d.mjs';
import { tw, C, cl, pr, lerp, L3, expo, expoIn, inOut, sine, spring, rnd, esc, mixc, kf, TXT, MONO, words, Cam, Scene, orbit, box, prism, cyl, worldMap, arc3, polyLen, marker, LL, frameSVG, cli, rotAxis, add, rotZ, flagSVG, faceSVG, tornCard2D, tornPhotoSVG, PH, FACE, lower, paperNote } from './lib3d.mjs';

const X = { bg: '#000000', border: '#2F3336', text: '#E7E9EA', sub: '#71767B', blue: '#1D9BF0' };
// ---- phone screen content (local 720x1400) ----
function postScreen(t, hl) {
  let s = `<rect width="720" height="1400" rx="60" fill="${X.bg}"/>`;
  s += `<text x="360" y="110" fill="${X.text}" font-family="Inter" font-weight="800" font-size="34" text-anchor="middle">Post</text><line x1="0" y1="150" x2="720" y2="150" stroke="${X.border}" stroke-width="2"/>`;
  s += `<circle cx="90" cy="250" r="48" fill="#333639"/><text x="90" y="263" fill="${X.text}" font-family="Inter" font-weight="700" font-size="34" text-anchor="middle">TC</text>`;
  s += `<text x="160" y="240" fill="${X.text}" font-family="Inter" font-weight="800" font-size="36">Tucker Carlson</text><text x="160" y="284" fill="${X.sub}" font-family="Inter" font-weight="400" font-size="30">@TuckerCarlson</text>`;
  const lines = [['…the', 'Trump', 'administration'], ['may', 'be', 'within', 'days', 'of'], ['launching', 'a', 'nuclear'], ['strike', 'on', 'Iran.']];
  let wi = 0; const fs = 48, sp = tw(" ", 48, 400);
  lines.forEach((ln, li) => { let x = 44; const y = 420 + li * 76; ln.forEach(wd => { const w = tw(wd, 48, 400); const H = hl.find(r => r.i0 <= wi && wi <= r.i1); if (H) { const k = inOut(pr(t, H.t0 + (wi - H.i0) * 0.07, H.t0 + (wi - H.i0) * 0.07 + 0.25)); if (k > 0) s += `<rect x="${x - 6}" y="${y - 46}" width="${(w + 14) * k}" height="62" rx="8" fill="${H.col}" opacity="0.35"/>`; } s += `<text x="${x}" y="${y}" fill="${X.text}" font-family="Inter" font-weight="400" font-size="${fs}">${esc(wd)}</text>`; x += w + sp; wi++; }); });
  s += `<text x="44" y="760" fill="${X.sub}" font-family="Inter" font-weight="400" font-size="30">8:47 PM · Nov 1, 2026</text><line x1="44" y1="800" x2="676" y2="800" stroke="${X.border}" stroke-width="2"/>`;
  s += `<text x="44" y="860" fill="${X.sub}" font-family="Inter" font-weight="400" font-size="26">Excerpt · full post ≈750 words</text>`;
  for (let i = 0; i < 4; i++) s += `<rect x="44" y="${940 + i * 90}" width="${560 - i * 90}" height="22" rx="11" fill="#16181C"/>`;
  return s;
}
// v2: Amin's iPhone 18 Pro Max (burgundy) GLB, rendered by glbphone.mjs; the X post is mapped onto the model's screen
function phone(S, t, pos, yaw, tiltX, hl, screenOp = 1) {
  const [x, y, z] = pos, h = 14; const piv = [x, y, z + h / 2];
  const R = q => { const p = [x + q[0], y + q[1], z + q[2]]; const r = rotAxis(rotAxis(p, [0, 0, 1], yaw, piv), [Math.cos(yaw), Math.sin(yaw), 0], tiltX, piv); return [r[0] - x, r[1] - y, r[2] - z]; };
  // screen content is rasterised onto the model's own Front_Screen mesh (perspective-correct), so it stays locked to the glass at any angle
  const tex = texFromSVG(screenWrap(postScreen(t, hl), { id: 'm1' }));
  phoneLayer(S, [x, y, z], h, R, { tag: 'm1', tex, texOp: screenOp });
}
function phoneOldBox(S, t, pos, yaw, tiltX, hl, screenOp = 1) {
  // phone body as box rotated around Z (yaw) and tilted; screen mapped by affine of 3 projected corners
  const [x, y, z] = pos, w = 7.2, d = 0.7, h = 14;
  const piv = [x, y, z + h / 2];
  const T = p => rotAxis(rotAxis(p, [0, 0, 1], yaw, piv), [Math.cos(yaw), Math.sin(yaw), 0], tiltX, piv);
  const v = [[x - w / 2, y - d / 2, z], [x + w / 2, y - d / 2, z], [x + w / 2, y + d / 2, z], [x - w / 2, y + d / 2, z], [x - w / 2, y - d / 2, z + h], [x + w / 2, y - d / 2, z + h], [x + w / 2, y + d / 2, z + h], [x - w / 2, y + d / 2, z + h]].map(T);
  [[1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7], [4, 5, 6, 7], [0, 3, 2, 1]].forEach(f => S.face(f.map(i => v[i]), '#1A1D22', { cull: true }));
  S.face([v[0], v[1], v[5], v[4]], '#050607', { shade: false, z: 0.5, stroke: '#3A3F47', sw: 2 });
  // screen corners (front face y-d/2), inset
  const ins = 0.35; const tl = T([x - w / 2 + ins, y - d / 2 - 0.01, z + h - ins]), tr = T([x + w / 2 - ins, y - d / 2 - 0.01, z + h - ins]), bl = T([x - w / 2 + ins, y - d / 2 - 0.01, z + ins]);
  const P0 = S.cam.p(tl), P1 = S.cam.p(tr), P3 = S.cam.p(bl);
  const a = (P1[0] - P0[0]) / 720, b = (P1[1] - P0[1]) / 720, c = (P3[0] - P0[0]) / 1400, dd = (P3[1] - P0[1]) / 1400;
  S.raw(`<g transform="matrix(${a} ${b} ${c} ${dd} ${P0[0]} ${P0[1]})" opacity="${screenOp}">${postScreen(t, hl)}</g>`, P0[2] - 0.6);
  return { P0, P1, P3 };
}
function floor(S, z = 0, ext = 60, col = '#0F1318') { for (let i = -ext; i <= ext; i += 6) { S.line([[i, -ext, z], [i, ext, z]], '#161B22', { sw: 1, z: 1e5 }); S.line([[-ext, i, z], [ext, i, z]], '#161B22', { sw: 1, z: 1e5 }); } }
const BG = `<rect width="100%" height="100%" fill="url(#sky)"/>`;
const shots = [];
const add2 = (t0, t1, fn) => shots.push({ t0, t1, fn });

// 1) 0–4.31 phone with the post, camera orbit + dolly
add2(0, 4.31, t => {
  const cam = new Cam(orbit([0, 0, 7], kf(t, [[0, -112], [4.31, -95, sine]]), kf(t, [[0, 18], [4.31, 9, sine]]), kf(t, [[0, 46, expo], [1.2, 30], [4.31, 26, sine]])), [0, 0, 7], 38);
  const S = new Scene(cam, Math.floor(t * 12)); floor(S, 0);
  const rise = cl(spring(t, 0.05, 0.8), 0, 1.08);
  phone(S, t, [0, 0, -14 + 14 * rise], 0, 0, [{ i0: 5, i1: 6, t0: 1.75, col: C.amber }, { i0: 9, i1: 12, t0: 2.6, col: C.red }]);
  let s = BG + S.out();
  s += words(t, ['ONE', 'OF', 'THE', 'MOST', 'WATCHED', 'VOICES', 'IN', 'AMERICA'], 960, 120, 28, 800, 1.75, 0.07, { a: 'middle', ls: 4, fill: C.sub });
  s += MONO(1860, 60, 'RECONSTRUCTED FROM A PUBLIC POST ON X', { size: 15, a: 'end', ls: 2, fill: '#3E4A57' });
  return s;
});
// 2) 4.31–9.27 Amin preferred the earlier version: 2026→1945 counter over the Nagasaki photo (frames from ND_MINUTE1_v2.mp4)
shots.push({ t0: 4.31, t1: 9.27, raw: true, fn: t => { const f = cl(Math.round(t * 25), 100, 240); return `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080"><image href="m1v1/f_${String(f).padStart(5, '0')}.png" width="1920" height="1080"/></svg>`; } });
// (old corridor-of-years version kept below for reference, not used)
const YEARS = [2026, 2020, 2010, 2001, 1991, 1983, 1973, 1962, 1950, 1945];
const corridorUnused = (t => {
  const yc = kf(t, [[4.31, -6], [6.3, 10, inOut], [7.9, 52, inOut], [9.27, 54.5, sine]]);
  const cx = kf(t, [[4.31, 11], [7.6, 8], [9.27, 1.5, sine]]); const cam = new Cam([cx, yc - 16, kf(t, [[4.31, 7], [9.27, 4.5]])], [kf(t, [[4.31, 0], [9.27, 0]]), yc + 8, 3.4], 42, Math.sin(t * 0.7) * 0.02);
  const S = new Scene(cam, Math.floor(t * 12)); floor(S, 0, 80);
  YEARS.forEach((yr, i) => {
    const y = i * 6, last = yr === 1945; const col = last ? '#2A1D08' : '#151A20';
    const camY = yc - 16; const ang = last ? 0 : -expo(pr(camY, y - 22, y - 12)) * 1.45; const pv = [-4, y, 0];
    box(S, [-4, y, 0], [8, 0.4, 7], col, { stroke: last ? C.amber : '#2A323D', sw: 1.5, rot: ang, pivot: pv });
    const R = q => rotZ(q, ang, pv);
    const P0 = S.cam.p(R([-4, y - 0.02, 7])), P1 = S.cam.p(R([4, y - 0.02, 7])), P3 = S.cam.p(R([-4, y - 0.02, 0]));
    if (P0[2] > 1 && P1[2] > 1 && P3[2] > 1 && P1[0] - P0[0] > 4) { const A = (P1[0] - P0[0]) / 800, B = (P1[1] - P0[1]) / 800, Cc = (P3[0] - P0[0]) / 700, D = (P3[1] - P0[1]) / 700;
      S.raw(`<g transform="matrix(${A} ${B} ${Cc} ${D} ${P0[0]} ${P0[1]})"><text x="400" y="440" fill="${last ? C.amber : '#3A4350'}" font-family="Inter" font-weight="900" font-size="250" text-anchor="middle">${yr}</text>${last ? `<text x="400" y="560" fill="${C.amber}" font-family="DejaVu Sans Mono" font-size="34" text-anchor="middle" letter-spacing="6">HIROSHIMA · NAGASAKI</text>` : ''}</g>`, Math.min(P0[2], P1[2], P3[2]) - 0.3); }
  });
  let s = BG + S.out();
  s += words(t, ['A', 'NUCLEAR', 'WEAPON', 'USED', 'IN', 'WAR'], 960, 140, 54, 900, 4.4, 0.25, { a: 'middle', ls: 2 });
  s += words(t, ['FOR', 'THE', 'FIRST', 'TIME', 'SINCE', '1945'], 960, 200, 30, 700, 6.29, 0.2, { a: 'middle', ls: 6, fill: C.sub, acc: C.amber, keep: [5] });
  return s;
});
void corridorUnused;
// 3) 9.27–12.15 drawn White House at night
function whiteHouse(S) {
  const wall = '#C9CCD1';
  box(S, [-12, -3, 0], [24, 6, 5], wall, {}); box(S, [-12.4, -3.3, 5], [24.8, 6.6, 0.6], '#E3E5E8', {});
  prism(S, [[-4, -3.3], [4, -3.3], [4, -6.2], [-4, -6.2]], 0, 0.6, '#D7DADF', {});
  for (let i = 0; i < 6; i++) cyl(S, [-3.3 + i * 1.32, -5.8, 0.6], 0.32, 4.4, '#ECEEF1', 10);
  box(S, [-4.2, -6.5, 5], [8.4, 3.4, 0.8], '#E3E5E8', {});
  prism(S, [[-4.2, -6.5], [4.2, -6.5], [0, -6.5]], 5.8, 0.1, '#E3E5E8', {});
  for (let r = 0; r < 2; r++) for (let i = 0; i < 8; i++) { const x = -11 + i * 1.3 + (i > 3 ? 8.2 : 0); if (x > 11) continue; box(S, [x, -3.05, 1 + r * 2.1], [0.7, 0.05, 1.2], r ? '#F5C66B' : '#2A2F37', { shade: false }); }
  cyl(S, [0, 0, 5.6], 0.08, 4, '#9AA4B2', 6);
}
add2(9.27, 12.15, t => {
  const cam = new Cam(orbit([0, -2, 3.5], kf(t, [[9.27, -70], [12.15, -88, sine]]), kf(t, [[9.27, 8], [12.15, 14, sine]]), kf(t, [[9.27, 46, expo], [10, 38], [12.15, 34]])), [0, -2, 3.5], 40);
  const S = new Scene(cam, Math.floor(t * 12)); const G = new Scene(cam, Math.floor(t * 12)); whiteHouse2(S, G, t);
  let s = BG + WH_DEFS + `<rect width="100%" height="100%" fill="url(#whSky)"/>` + G.out() + S.out();
  s += flagSVG('usa', 960 - 228, 116, 42, 28) + MONO(985, 140, 'WHITE HOUSE POSITION', { size: 20, a: 'middle', fill: C.blue, ls: 6 });
  s += words(t, ['Not', 'the', 'plan.'], 960, 900 - 40, 96, 800, 10.41, 0.45, { a: 'middle', acc: C.blue });
  if (t > 11.0) s += `<g opacity="${cl(pr(t, 11.0, 11.2))}">` + MONO(960, 935, 'TRUMP · NEWSMAX · 15 OCT 2026: “I WOULDN’T USE NUCLEAR.”', { size: 18, a: 'middle', fill: C.sub, ls: 2 }) + `</g>`;
  return s;
});
// 4) 12.15–16.39 night world map, terminator sweep, T+ clock
add2(12.15, 16.39, t => {
  const tg = [60, 30, 0]; const cam = new Cam(orbit(tg, kf(t, [[12.15, -95], [16.39, -80, sine]]), kf(t, [[12.15, 62], [16.39, 48, sine]]), kf(t, [[12.15, 210, expo], [13, 190], [16.39, 175]])), tg, 40);
  const S = new Scene(cam, 0); worldMap(S, { bbox: [-20, -40, 160, 75], land: '#161C23', hi: { 364: '#3B1416' } });
  const sw = lerp(-30, 160, pr(t, 12.4, 16.3)); S.face([[sw - 60, -50, 0.3], [sw, -50, 0.3], [sw, 80, 0.3], [sw - 60, 80, 0.3]], '#000000', { shade: false, op: 0.55, z: -1 }); S.line([[sw, -50, 0.4], [sw, 80, 0.4]], C.amber, { sw: 2, op: 0.6 });
  let s = BG + S.out();
  const k = inOut(pr(t, 13.4, 15.6)); const secs = Math.floor(k * 86400); const f2 = n => String(n).padStart(2, '0');
  const pop = spring(t, 12.3, 0.6);
  s += `<g opacity="${cl(pr(t, 12.2, 12.5))}" transform="translate(960 560) scale(${0.85 + 0.15 * cl(pop, 0, 1.1)}) translate(-960 -560)">` + TXT(960, 600, `T+${f2(Math.floor(secs / 3600))}:${f2(Math.floor(secs / 60) % 60)}:${f2(secs % 60)}`, { size: 150, w: 800, a: 'middle', fill: k >= 1 ? C.amber : C.text, ls: 4 }) + `</g>`;
  s += words(t, ['WHAT', 'WOULD', 'THE', 'WORLD', 'LOOK', 'LIKE'], 960, 400, 34, 700, 12.55, 0.12, { a: 'middle', ls: 6, fill: C.sub, acc: C.amber });
  s += words(t, ['24', 'HOURS', 'LATER?'], 960, 700, 46, 800, 14.27, 0.3, { a: 'middle', ls: 8, keep: [0] });
  return s;
});
// 5) 16.39–20.67 3D dominoes standing on the map
function domino(S, base, h, col, tilt, dir, label) {
  const w = 3.2, d = 1.3; const piv = [base[0], base[1], 0];
  const v = box(S, [base[0] - w / 2, base[1] - d / 2, 0], [w, d, h], col, { tilt: tilt ? { axis: dir, a: tilt, pivot: piv } : null });
  // pips on front face center
  const center = rotAxis([base[0], base[1] - d / 2 - 0.02, h * 0.72], dir, tilt || 0, piv), c2 = rotAxis([base[0], base[1] - d / 2 - 0.02, h * 0.3], dir, tilt || 0, piv);
  S.at(center, (x, y, sc) => `<circle cx="${x}" cy="${y}" r="${sc * 0.36}" fill="#0A0C0F"/>`, { z: -0.3 }); S.at(c2, (x, y, sc) => `<circle cx="${x - sc * 0.35}" cy="${y}" r="${sc * 0.36}" fill="#0A0C0F"/><circle cx="${x + sc * 0.7}" cy="${y}" r="${sc * 0.36}" fill="#0A0C0F"/>`, { z: -0.3 });
}
add2(16.39, 20.67, t => {
  const tg = [82, 38, 4]; const cam = new Cam(orbit(tg, kf(t, [[16.39, -104], [20.67, -78, sine]]), kf(t, [[16.39, 14], [20.67, 24, sine]]), kf(t, [[16.39, 110, expo], [17.2, 86], [20.67, 80]])), tg, 42);
  const S = new Scene(cam, Math.floor(t * 12)); worldMap(S, { bbox: [20, 0, 150, 70], land: '#161C23', hi: { 364: '#3B1416', 643: '#1B2A3D', 586: '#1B2A3D', 356: '#1B2A3D', 156: '#1B2A3D', 158: '#1B2A3D' } });
  const pts = [[LL.natanz, 17.45, 'IRAN', C.amber, ['iran']], [LL.moscow, 18.51, 'RUSSIA', '#E8E3D8', ['russia']], [LL.islamabad, 18.95, 'SOUTH ASIA', '#E8E3D8', ['india', 'pakistan']], [LL.taipei, 19.4, 'EAST ASIA', '#E8E3D8', ['china', 'taiwan']]];
  pts.forEach(([ll, t0, lab, col, fl], i) => {
    if (t > t0) S.at([ll[0], ll[1], 13 * cl(spring(t, t0 - 0.6, 0.5), 0, 1.1) + 3], (x, y) => fl.map((f, j) => flagSVG(f, x - fl.length * 27 + j * 54 + 2, y - 62, 50, 33, { op: cl(pr(t, t0, t0 + 0.3)) })).join(''), { z: -6 });
    const rise = cl(spring(t, t0 - 0.6, 0.5), 0, 1.1); const h = 13 * rise; if (h <= 0.05) return;
    let tilt = 0, dir = [1, 0, 0];
    if (i === 0) tilt = -0.22 * sine(pr(t, 17.6, 18.3)) + 0.06 * Math.sin(t * 6) * pr(t, 18.3, 20.6);
    else if (t > t0 + 0.4) tilt = 0.1 * Math.sin((t - t0) * 7) * Math.exp(-(t - t0) * 0.9);
    domino(S, [ll[0], ll[1]], h, col, tilt, dir);
    S.at([ll[0], ll[1], h + 3], (x, y) => MONO(x, y, lab, { size: 18, w: 700, a: 'middle', fill: i ? C.text : C.amber, ls: 3, op: cl(pr(t, t0, t0 + 0.3)) }), { z: -5 });
    if (i > 0 && t > t0 - 0.2) { const a = arc3([LL.natanz[0], LL.natanz[1], 13], [ll[0], ll[1], 13], 12); const len = polyLen(S, a); const k = expo(pr(t, t0 - 0.2, t0 + 0.5)); S.line(a, C.red, { sw: 3, len, off: len * (1 - k), z: -3 }); }
  });
  let s = BG + S.out();
  s += words(t, ['THE', 'SPARK', 'NOBODY', 'CAN', 'PUT', 'OUT?'], 110, 150, 46, 800, 17.45, 0.35, { ls: 2, keep: [1] });
  return s;
});
// 6) 20.67–23.93 v2 (Amin: crystal ball "sucks") — a PREDICTION document drops in; a red ink stamp slams NOT A PREDICTION onto it
const INK = `<filter id="ink" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.6 1.45" result="m"/><feComposite in="SourceGraphic" in2="m" operator="in" result="c"/><feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="3" result="w"/><feDisplacementMap in="c" in2="w" scale="5" xChannelSelector="R" yChannelSelector="G"/></filter>`;
add2(20.67, 23.93, t => {
  let s = BG + `<defs>${INK}</defs>`;
  const T0 = 23.13, hit = t >= T0 + 0.11; const sh = hit ? Math.exp(-(t - T0 - 0.11) * 9) : 0; const jx = sh * 14 * Math.sin(t * 90), jy = sh * 10 * Math.cos(t * 77);
  const k = cl(spring(t, 20.72, 0.7), 0, 1.1); const push = 1 + (t - 20.67) * 0.006;
  // document
  const W = 980, H = 600, x0 = 960 - W / 2, y0 = 300;
  let d = paperNote(W, H, [], { seed: 61, paper: '#EEE8DA' });
  d += `<text x="48" y="72" fill="#7A1E22" font-family="DejaVu Sans Mono" font-size="22" letter-spacing="4">FORECAST · NUCLEAR STRIKE ON IRAN</text><line x1="48" y1="96" x2="${W - 48}" y2="96" stroke="#B9B09C" stroke-width="2"/>`;
  d += `<text x="48" y="170" fill="#15171B" font-family="Inter" font-weight="900" font-size="64">PREDICTION</text>`;
  const rows = [['WHEN', 'Within days'], ['TARGET', 'Iran'], ['SOURCE', 'A public post on X'], ['BACKED BY', 'No named sources']];
  rows.forEach(([a1, b1], i) => { const rk = cl(pr(t, 21.0 + i * 0.3, 21.3 + i * 0.3)); d += `<g opacity="${rk}"><text x="48" y="${250 + i * 70}" fill="#6B6152" font-family="DejaVu Sans Mono" font-size="20" letter-spacing="3">${a1}</text><text x="250" y="${250 + i * 70}" fill="#15171B" font-family="Inter" font-weight="700" font-size="34">${esc(b1)}</text></g>`; });
  s += `<g transform="translate(${960 + jx} ${600 + jy + (1 - cl(k)) * -140}) rotate(${-1.5 + (1 - cl(k)) * 6}) scale(${push}) translate(${-960} ${-600})"><g transform="translate(${x0} ${y0})">${d}</g>`;
  // stamp: slams down (scale 2.4 -> 1), ink texture, tiny splatter
  if (t > T0) { const sk = expoIn(pr(t, T0, T0 + 0.11)); const sc = lerp(2.4, 1, sk), op = cl(pr(t, T0, T0 + 0.05));
    let st = `<g filter="url(#ink)"><rect x="-420" y="-80" width="840" height="160" rx="14" fill="none" stroke="#C8302F" stroke-width="12"/><rect x="-398" y="-58" width="796" height="116" rx="8" fill="none" stroke="#C8302F" stroke-width="4"/><text x="0" y="24" fill="#C8302F" font-family="Inter" font-weight="900" font-size="66" text-anchor="middle" letter-spacing="3">NOT A PREDICTION</text></g>`;
    if (hit) for (let i = 0; i < 14; i++) { const a = rnd(i * 3.1) * Math.PI * 2, r = 380 + rnd(i * 7) * 120; st += `<circle cx="${Math.cos(a) * r}" cy="${Math.sin(a) * r * 0.45}" r="${2 + rnd(i) * 5}" fill="#C8302F" opacity="0.8"/>`; }
    s += `<g opacity="${op}" transform="translate(960 640) rotate(-9) scale(${sc})">${st}</g>`; }
  s += `</g>`;
  s += MONO(960, 140, 'LET ME BE CLEAR', { size: 22, a: 'middle', ls: 8, fill: C.text, op: cl(pr(t, 20.7, 20.9)) });
  return s;
});
// 7) 23.93–30.39 desk: empty folders + microphone
function folder(S, x, y, open, label, t) {
  box(S, [x - 3, y - 2, 0], [6, 4, 0.25], '#C9A86B', {}); // bottom
  const piv = [x, y + 2, 0.25]; const lidA = -open * 1.9;
  box(S, [x - 3, y - 2, 0.25], [6, 4, 0.12], '#D9BA7E', { tilt: { axis: [1, 0, 0], a: lidA, pivot: piv } });
  S.at([x, y - 2.3, 0.3], (px, py, sc) => MONO(px, py + 24, label, { size: Math.max(12, sc * 0.55), a: 'middle', fill: C.text, ls: 2 }), { z: -2 });
}
// v2 (Amin: folders/desk "sucks"): clean case-status board + the president's official portrait. Flat 2D, slow steady push, no tilt.
function statusRow(t, t0, y, label, value, col, icon, sub) {
  if (t < t0) return ''; const k = cl(spring(t, t0, 0.55), 0, 1.1), op = cl(pr(t, t0, t0 + 0.2)); const n = Math.ceil(pr(t, t0 + 0.3, t0 + 0.7) * value.length);
  const ik = expo(pr(t, t0 + 0.55, t0 + 0.95)), ix = 1010, iy = y + 66;
  let s = `<g opacity="${op}" transform="translate(${(1 - cl(k, 0, 1)) * 90} 0)"><rect x="110" y="${y}" width="980" height="132" rx="14" fill="#0E1116" stroke="#232A33" stroke-width="2"/><rect x="110" y="${y}" width="8" height="132" rx="4" fill="${col}"/>`;
  s += MONO(150, y + 44, label, { size: 18, ls: 4, fill: C.sub }) + TXT(150, y + 106, value.slice(0, n), { size: 50, w: 900, fill: col });
  s += `<circle cx="${ix}" cy="${iy}" r="30" fill="none" stroke="${col}" stroke-width="4" stroke-dasharray="${189 * ik} 189" transform="rotate(-90 ${ix} ${iy})"/>`;
  if (ik > 0.6) s += icon === 'x' ? `<path d="M${ix - 12} ${iy - 12} L${ix + 12} ${iy + 12} M${ix + 12} ${iy - 12} L${ix - 12} ${iy + 12}" stroke="${col}" stroke-width="5" stroke-linecap="round" opacity="${pr(ik, 0.6, 1)}"/>` : `<path d="M${ix - 13} ${iy + 1} L${ix - 4} ${iy + 11} L${ix + 14} ${iy - 10}" fill="none" stroke="${col}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" opacity="${pr(ik, 0.6, 1)}"/>`;
  if (sub) s += MONO(940, y + 44, sub, { size: 15, a: 'end', ls: 2, fill: C.tele, op: cl(pr(t, t0 + 0.7, t0 + 1.0)) });
  return s + `</g>`;
}
add2(23.93, 30.39, t => {
  const push = 1 + (t - 23.93) * 0.005;
  let s = BG + `<g transform="translate(960 540) scale(${push}) translate(-960 -540)">`;
  s += statusRow(t, 24.25, 300, 'CONFIRMED PLAN', 'NONE', C.red, 'x');
  s += statusRow(t, 25.2, 465, 'OFFICIAL ANNOUNCEMENT', 'NONE', C.red, 'x');
  s += statusRow(t, 26.55, 630, 'THE PRESIDENT, PUBLICLY', 'Said he would not do it', C.blue, 'check', '15 OCT 2026');
  s += tornCard2D(t, 26.35, FACE('trump'), 1250, 230, 520, 640, { seed: 211, rot: 2.5, caption: 'PRESIDENT DONALD TRUMP', credit: 'WHITE HOUSE · PD', s0: 1.08, drift: -3 });
  if (t > 26.6) s += flagSVG('usa', 1278, 205, 78, 52, { op: cl(pr(t, 26.6, 26.9)) });
  s += `</g>`;
  s += MONO(110, 110, 'FILE STATUS', { size: 18, ls: 4 }) + words(t, ['SCENARIO'], 108, 180, 64, 900, 24.0, 0, { keep: [0], ls: 6 });
  return s;
});
// 8) 30.39–36.85 v2 (Amin: three cubes "silly and bad") — the evidence board: three real torn photos pinned up, red string to the SCENARIO tag
add2(30.39, 36.85, t => {
  const push = 1 + (t - 30.39) * 0.005; let s = BG + `<g transform="translate(960 560) scale(${push}) translate(-960 -560)">`;
  const tag = [960, 905];
  const P = [[31.23, 120, 330, -4, FACE('trump'), 'PUBLIC STATEMENTS', C.blue, 'TRUMP · NEWSMAX · 15 OCT 2026', '“I wouldn’t use nuclear.”', 'WHITE HOUSE · PD'],
             [32.95, 715, 300, 2, PH('hiroshima'), 'DOCUMENTED HISTORY', '#E8E3D8', 'HIROSHIMA · 6 AUGUST 1945', 'The only wartime use', 'US ARMY · PD'],
             [34.55, 1310, 330, 3.5, PH('princeton'), 'EXPERT WAR GAMES', C.red, 'PRINCETON · “PLAN A” · 2019', 'Escalation simulation', 'PRINCETON SGS']];
  // strings first (behind the cards)
  P.forEach(([t0, x, y]) => { const k = expo(pr(t, 35.5, 36.1)); if (k <= 0) return; const ax = x + 245, ay = y + 8; const ex = lerp(ax, tag[0], k), ey = lerp(ay, tag[1] - 40, k); s += `<path d="M${ax} ${ay} Q${(ax + ex) / 2} ${Math.max(ay, ey) + 60} ${ex} ${ey}" fill="none" stroke="#B3262B" stroke-width="3"/>`; });
  P.forEach(([t0, x, y, rot, href, lab, col, sub, quote, cred], i) => { if (t < t0) return;
    s += tornCard2D(t, t0, href, x, y, 490, 400, { seed: 300 + i * 17, rot, caption: lab, credit: cred, drift: -2, s0: 1.1 });
    const k = cl(spring(t, t0 + 0.35, 0.5), 0, 1.1), op = cl(pr(t, t0 + 0.35, t0 + 0.55));
    s += `<g opacity="${op}" transform="translate(${x + 20} ${y + 425 + (1 - cl(k)) * 20}) rotate(${rot * 0.4})"><rect width="450" height="96" rx="6" fill="#0E1116" stroke="${col}" stroke-width="2"/><rect width="8" height="96" rx="3" fill="${col}"/>` + MONO(26, 34, sub, { size: 15, ls: 2, fill: col === '#E8E3D8' ? C.sub : col }) + TXT(26, 74, quote, { size: 28, w: 800 }) + `</g>`;
    s += `<circle cx="${x + 245}" cy="${y + 8}" r="11" fill="#B3262B" opacity="${cl(pr(t, t0 + 0.25, t0 + 0.4))}"/><circle cx="${x + 241}" cy="${y + 4}" r="4" fill="#F2B5B5" opacity="${cl(pr(t, t0 + 0.25, t0 + 0.4))}"/>`; });
  if (t > 35.9) { const k = cl(spring(t, 35.9, 0.5), 0, 1.1); s += `<g opacity="${cl(pr(t, 35.9, 36.1))}" transform="translate(${tag[0]} ${tag[1]}) scale(${0.85 + 0.15 * cl(k)})"><rect x="-190" y="-40" width="380" height="80" rx="8" fill="${C.amber}"/>` + TXT(0, 18, 'SCENARIO', { size: 46, w: 900, a: 'middle', fill: '#0B0D10', ls: 6 }) + `</g>`; }
  s += `</g>` + words(t, ['A', 'SCENARIO', 'BUILT', 'FROM'], 960, 130, 44, 800, 30.4, 0.15, { a: 'middle', ls: 6, keep: [1] });
  return s;
});
// 9) 36.85–45.17 headline wall in 3D, dolly through
const HEAD = [['NEWSWEEK', 'What a US Nuclear Strike on Iran’s', 'Pickaxe Mountain Could Look Like'], ['ANADOLU AGENCY · 2 NOV 2026', 'Trump could launch nuclear strike on', 'Iran within days, commentator claims'], ['AL JAZEERA · 16 OCT 2026', 'Trump rules out using a nuclear bomb', 'on Iran: Why that matters'], ['MIDDLE EAST EYE · 2 NOV 2026', 'Trump says he will not attack Iran', 'after midterms']];
function card(S, c, i, t, t0) {
  const k = expo(pr(t, t0, t0 + 0.6)); if (k <= 0) return; const z0 = c[2] + (1 - k) * -4;
  const P0 = S.cam.p([c[0], c[1], z0 + 3.2]), P1 = S.cam.p([c[0] + 9, c[1], z0 + 3.2]), P3 = S.cam.p([c[0], c[1], z0]);
  const a = (P1[0] - P0[0]) / 900, b = (P1[1] - P0[1]) / 900, cc = (P3[0] - P0[0]) / 320, d = (P3[1] - P0[1]) / 320;
  const [src, l1, l2] = HEAD[i];
  S.raw(`<g transform="matrix(${a} ${b} ${cc} ${d} ${P0[0]} ${P0[1]})" opacity="${k}"><rect width="900" height="320" rx="12" fill="#F4F1EA"/><rect width="12" height="320" fill="${C.red}"/><text x="48" y="80" fill="#7A1E22" font-family="Inter" font-weight="800" font-size="24" letter-spacing="3">${esc(src)}</text><text x="48" y="160" fill="#111317" font-family="Inter" font-weight="700" font-size="44">${esc(l1)}</text><text x="48" y="220" fill="#111317" font-family="Inter" font-weight="700" font-size="44">${esc(l2)}</text></g>`, P0[2] - 5);
}
// v2 (Amin: zoom/camera move was "AI slop"): flat aligned 2x2 grid, cards rise in, one slow constant push. No dolly, no tilt.
function headCard(i, x, y, w, h) {
  const [src, l1, l2] = HEAD[i]; const fs = Math.min(42, (w - 110) / Math.max(tw(l1, 1, 700), tw(l2, 1, 700)));
  let s = `<rect x="${x + 6}" y="${y + 10}" width="${w}" height="${h}" rx="10" fill="#000" opacity="0.45"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="#F4F1EA"/><rect x="${x}" y="${y}" width="10" height="${h}" rx="3" fill="${C.red}"/>`;
  s += `<text x="${x + 48}" y="${y + 64}" fill="#7A1E22" font-family="Inter" font-weight="800" font-size="22" letter-spacing="3">${esc(src)}</text><line x1="${x + 48}" y1="${y + 88}" x2="${x + w - 40}" y2="${y + 88}" stroke="#D6CFBF" stroke-width="2"/>`;
  s += `<text x="${x + 48}" y="${y + 150}" fill="#111317" font-family="Inter" font-weight="700" font-size="${fs}">${esc(l1)}</text><text x="${x + 48}" y="${y + 150 + fs * 1.25}" fill="#111317" font-family="Inter" font-weight="700" font-size="${fs}">${esc(l2)}</text>`;
  for (let j = 0; j < 2; j++) s += `<rect x="${x + 48}" y="${y + h - 62 + j * 26}" width="${(w - 140) * (1 - j * 0.35)}" height="12" rx="6" fill="#DDD6C6"/>`;
  return s;
}
add2(36.85, 45.17, t => {
  const g = 1 + (t - 36.85) * 0.007; const dk = pr(t, 42.5, 43.3);
  let s = BG + `<g transform="translate(960 585) scale(${g}) translate(-960 -585)" opacity="${1 - dk * 0.72}">`;
  const cells = [[110, 250], [990, 250], [110, 620], [990, 620]];
  [36.95, 37.9, 39.2, 40.3].forEach((t0, i) => { if (t < t0) return; const k = cl(spring(t, t0, 0.6), 0, 1.1); s += `<g opacity="${cl(pr(t, t0, t0 + 0.2))}" transform="translate(0 ${(1 - cl(k, 0, 1.1)) * 80})">` + headCard(i, cells[i][0], cells[i][1], 820, 330) + `</g>`; });
  s += `</g>`;
  s += MONO(960, 150, 'NEWSROOMS · GOVERNMENT OFFICES', { size: 20, a: 'middle', ls: 6, op: cl(pr(t, 37.9, 38.1)) * (1 - dk) });
  if (t > 42.4) s += words(t, ['WHAT', 'IF', 'IT', 'STOPS', 'BEING'], 960, 470, 40, 700, 42.42, 0.1, { a: 'middle', ls: 6, fill: C.sub, acc: C.sub });
  if (t > 43.89) { const k = spring(t, 43.89, 0.5); s += `<g opacity="${cl(pr(t, 43.89, 44))}" transform="translate(960 610) scale(${0.85 + 0.15 * cl(k, 0, 1.1)}) translate(-960 -610)">` + TXT(960, 640, 'UNTHINKABLE', { size: 150, w: 900, a: 'middle', fill: C.red, ls: 6 }) + `</g>`; }
  return s + MONO(60, 60, 'HEADLINES · OCT–NOV 2026', { size: 15, ls: 2, fill: '#3E4A57' });
});
// 10) 45.17–48.29 flip calendar 3D
// v2 (Amin: page moved but numbers stayed visible): tear-off desk calendar where each date is printed ON its page,
// so the flipping page carries its own date away. Flat 2D, page hinge at the binding, perspective by scaleY(cos) + widening.
const CAL = [['THURSDAY', '29', 'OCTOBER'], ['FRIDAY', '30', 'OCTOBER'], ['SATURDAY', '31', 'OCTOBER'], ['SUNDAY', '1', 'NOVEMBER']];
function calPage(d, w, h, hot) {
  const [dw, dn, mo] = d;
  return `<rect width="${w}" height="${h}" rx="18" fill="#F1ECE2"/><path d="M0 18 Q0 0 18 0 H${w - 18} Q${w} 0 ${w} 18 V130 H0 Z" fill="${hot ? C.red : '#B8322F'}"/>` +
    `<text x="${w / 2}" y="88" fill="#FFF6EC" font-family="Inter" font-weight="900" font-size="46" letter-spacing="10" text-anchor="middle">${mo}</text>` +
    `<text x="${w / 2}" y="${h * 0.7}" fill="#111317" font-family="Inter" font-weight="900" font-size="${h * 0.5}" text-anchor="middle">${dn}</text>` +
    `<text x="${w / 2}" y="${h - 46}" fill="#7A1E22" font-family="DejaVu Sans Mono" font-size="30" letter-spacing="8" text-anchor="middle">${dw}</text>`;
}
add2(45.17, 48.29, t => {
  const w = 600, h = 560, x0 = 960 - w / 2, y0 = 250; const push = 1 + (t - 45.17) * 0.012;
  const k = inOut(pr(t, 45.3, 46.6)) * 3; const idx = Math.min(3, Math.floor(k)); const fr = idx < 3 ? k - idx : 0;
  let s = BG + `<g transform="translate(960 520) scale(${push}) translate(-960 -520)">`;
  s += `<ellipse cx="960" cy="${y0 + h + 40}" rx="380" ry="34" fill="#000" opacity="0.5"/>`;
  for (let i = 4; i >= 1; i--) s += `<rect x="${x0 + i * 1.5}" y="${y0 + i * 7}" width="${w - i * 3}" height="${h}" rx="18" fill="${mixc('#D9D2C4', '#9A9386', i / 4)}"/>`; // page stack thickness
  const under = fr > 0 ? idx + 1 : idx; s += `<g transform="translate(${x0} ${y0})">${calPage(CAL[under], w, h, under === 3)}</g>`;
  if (fr > 0) { const a = fr * Math.PI, c = Math.cos(a), wid = 1 + 0.07 * Math.sin(a);
    if (c > 0) s += `<g transform="translate(960 ${y0}) scale(${wid} ${c}) translate(${-w / 2} 0)">${calPage(CAL[idx], w, h, false)}<rect width="${w}" height="${h}" rx="18" fill="#000" opacity="${0.35 * Math.sin(a)}"/></g>`;
    else s += `<g transform="translate(960 ${y0}) scale(${wid} ${c}) translate(${-w / 2} 0)" opacity="${1 - pr(fr, 0.55, 0.85)}"><rect width="${w}" height="${h}" rx="18" fill="#CFC7B8"/><rect width="${w}" height="${h}" rx="18" fill="#000" opacity="${0.25 * Math.sin(a)}"/></g>`; }
  s += `<rect x="${x0 - 14}" y="${y0 - 26}" width="${w + 28}" height="40" rx="10" fill="#1C222A"/>`; for (let i = 0; i < 8; i++) s += `<rect x="${x0 + 40 + i * 74}" y="${y0 - 40}" width="14" height="44" rx="7" fill="#9AA4B2"/>`;
  s += `</g>`;
  if (t > 46.7) { const c = spring(t, 46.7, 0.5); s += `<g opacity="${cl(pr(t, 46.7, 46.9))}" transform="translate(0 ${(1 - cl(c)) * 30})">` + TXT(960, 930, '8:47 PM ET · 2026', { size: 60, w: 800, a: 'middle', fill: C.red, ls: 4 }) + `</g>`; }
  s += MONO(960, 120, 'IT STARTED LATE ON', { size: 20, a: 'middle', ls: 8, op: cl(pr(t, 45.2, 45.4)) });
  return s;
});
// 11) 48.29–56.99 phone close: highlights, tags
add2(48.29, 56.99, t => {
  const cam = new Cam(orbit([0, 0, 8], kf(t, [[48.29, -70], [56.99, -98, sine]]), kf(t, [[48.29, 4], [56.99, 10]]), kf(t, [[48.29, 34, expo], [49.2, 22], [55.9, 19], [56.6, 60, expoIn]])), [0, 0, 8], 38);
  const S = new Scene(cam, Math.floor(t * 12)); floor(S, 0, 40);
  phone(S, t, [0, 0, 1], 0, 0, [{ i0: 5, i1: 6, t0: 52.81, col: C.amber }, { i0: 9, i1: 12, t0: 55.03, col: C.red }]);
  let s = BG + S.out();
  s += lower(t, 48.4, 52.6, 'Tucker Carlson', 'COMMENTATOR · FORMER FOX NEWS HOST', { face: 'carlson', flag: 'usa', credit: 'PHOTO: GAGE SKIDMORE · CC BY-SA 2.0' });
  if (t > 50.43) { const k = cl(spring(t, 50.43, 0.5), 0, 1.1); s += `<g opacity="${cl(pr(t, 50.43, 50.6)) * (1 - pr(t, 55.8, 56.1))}" transform="translate(${(1 - cl(k)) * 60} 0)"><rect x="1330" y="250" width="500" height="150" rx="14" fill="#0E1116" stroke="${C.red}" stroke-width="2"/>` + faceSVG('netanyahu', 1405, 325, 52, { flag: 'israel', ring: C.red }) + MONO(1480, 296, 'CLAIM · “ISRAELI PRESSURE”', { size: 15, ls: 2, fill: C.red }) + TXT(1480, 342, 'Benjamin Netanyahu', { size: 28, w: 800 }) + MONO(1480, 372, 'ISRAELI PRIME MINISTER', { size: 13, ls: 2, fill: C.sub }) + MONO(1820, 392, 'PHOTO: AVI OHAYON · CC BY-SA 3.0', { size: 9, a: 'end', fill: '#4A5563' }) + `</g>`; }
  if (t > 53.6) s += `<g opacity="${cl(pr(t, 53.6, 53.8))}">` + MONO(1840, 400, 'SOURCE · UNNAMED OBSERVERS', { size: 18, a: 'end', ls: 3, fill: C.amber }) + `</g>`;
  if (t > 55.99) { const k = spring(t, 55.99, 0.45); s += `<rect width="100%" height="100%" fill="#07080A" opacity="${cl(pr(t, 55.99, 56.3)) * 0.8}"/><g opacity="${cl(pr(t, 55.99, 56.1))}" transform="translate(960 520) scale(${0.85 + 0.15 * cl(k, 0, 1.1)}) translate(-960 -520)">` + TXT(960, 560, 'THE TARGET?', { size: 130, w: 900, a: 'middle', ls: 6 }) + `</g>`; }
  return s + MONO(1860, 60, 'RECONSTRUCTED FROM A PUBLIC POST ON X', { size: 15, a: 'end', ls: 2, fill: '#3E4A57' });
});
// 12) 56.99–61.0 fly over Iran to Pickaxe
add2(56.99, 61.0, t => {
  const tg = [LL.natanz[0], LL.natanz[1], 0];
  const cam = new Cam(orbit(tg, kf(t, [[56.99, -120], [61, -95, sine]]), kf(t, [[56.99, 70], [61, 38, inOut]]), kf(t, [[56.99, 60], [59.8, 16, inOut], [61, 14]])), tg, 40);
  const S = new Scene(cam, 0); worldMap(S, { hd: true, bbox: [40, 22, 66, 42], land: '#161C23', hi: { 364: '#3B1416' }, ext: { 364: 0.6 } });
  marker(S, [LL.tehran[0], LL.tehran[1], 0.7], C.red, t, 58.2, 'Tehran', { fs: 26, flag: 'iran' });
  marker(S, [LL.natanz[0], LL.natanz[1], 0.7], C.amber, t, 57.45, 'Pickaxe Mountain', { fs: 40, sub: 'CENTRAL IRAN · NEXT TO NATANZ', subCol: C.amber, size: 1.4 });
  let s = BG + S.out();
  if (t > 59.2) s += `<g opacity="${cl(pr(t, 59.2, 59.4))}">` + MONO(110, 150, 'ISRAELI INTEL (CLAIM) · ENRICHMENT RESTARTED', { size: 18, ls: 3, fill: C.red }) + `</g>`;
  return s;
});

shots.sort((a, b) => a.t0 - b.t0);
export function frame(t) { const sh = shots.find(s => t >= s.t0 && t < s.t1) || shots[shots.length - 1]; return sh.raw ? sh.fn(t) : frameSVG(t, sh.fn(t)); }
cli(frame, 0, 'm1');
