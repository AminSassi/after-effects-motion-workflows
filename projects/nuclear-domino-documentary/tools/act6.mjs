// ACT 6 — VO 452.35 → 544.36 (today, Doomsday Clock, the question, what holds the line, the rumor, CTA, the pause, end card)
import * as L from './lib3d.mjs';
const { C, cl, pr, lerp, L3, expo, expoIn, inOut, sine, spring, rnd, kf, TXT, MONO, words, Cam, Scene, orbit, box, cyl, worldMap, marker, LL, frameSVG, cli, rotAxis, add, sub, mul, PH, tornCard2D, noteDrop, quad, shock, flyArc, terrain, network, lower, tw, tornPhotoSVG, crt, flagSVG, faceSVG, FACE } = L;
const BG = `<rect width="100%" height="100%" fill="url(#sky)"/>`;
const floor = (S, z = 0, ext = 60, st = 6) => { for (let i = -ext; i <= ext; i += st) { S.line([[i, -ext, z], [i, ext, z]], '#151A21', { sw: 1, z: 1e5 }); S.line([[-ext, i, z], [ext, i, z]], '#151A21', { sw: 1, z: 1e5 }); } };
const shots = []; const add2 = (t0, t1, fn) => shots.push({ t0, t1, fn });
const P3 = (ll, z = 0) => [ll[0], ll[1], z];
function gauge(cx, cy, R, v, lab, col) { let s = `<path d="M${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}" fill="none" stroke="#1F252D" stroke-width="22"/>`; const a = Math.PI + v * Math.PI; s += `<path d="M${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + Math.cos(a) * R} ${cy + Math.sin(a) * R}" fill="none" stroke="${col}" stroke-width="22"/>`; s += `<line x1="${cx}" y1="${cy}" x2="${cx + Math.cos(a) * (R - 30)}" y2="${cy + Math.sin(a) * (R - 30)}" stroke="${C.text}" stroke-width="5" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="10" fill="${C.text}"/>`; return s + TXT(cx, cy + 70, lab, { size: 34, w: 900, a: 'middle' }); }
// F1 452.35–457.25 faster · shorter · higher
add2(452.35, 457.25, t => {
  let s = BG; [[452.6, 'FASTER', 'MISSILES', C.red], [454.35, 'SHORTER', 'WARNING WINDOWS', C.amber], [455.81, 'HIGHER', 'TENSIONS', C.red]].forEach(([t0, lab, sub2, col], i) => { if (t < t0) return; const k = cl(spring(t, t0, 0.5), 0, 1.1); const v = lab === 'SHORTER' ? 1 - 0.8 * expo(pr(t, t0, t0 + 1)) : 0.15 + 0.8 * expo(pr(t, t0, t0 + 1)); const cx = 420 + i * 540;
    s += `<g opacity="${cl(pr(t, t0, t0 + 0.2))}" transform="translate(${cx} 560) scale(${k}) translate(${-cx} -560)">` + gauge(cx, 560, 190, v + Math.sin(t * 25) * 0.005, lab, col) + MONO(cx, 670, sub2, { size: 16, a: 'middle', ls: 3 }) + `</g>`; });
  return s + words(t, ['TODAY'], 110, 150, 56, 900, 452.4, 0, { keep: [0], keepCol: C.amber });
});
// F2 457.25–466.25 Doomsday Clock → 85 seconds to midnight (3D clock face)
add2(457.25, 466.25, t => {
  const tg = [0, 0, 0]; const cam = new Cam(orbit(tg, kf(t, [[457.25, -120], [466.25, -92, sine]]), kf(t, [[457.25, 40], [466.25, 70, inOut]]), kf(t, [[457.25, 40], [466.25, 30]])), tg, 40);
  const S = new Scene(cam, Math.floor(t * 12)); floor(S, -1.2, 40, 3);
  cyl(S, [0, 0, -1.2], 8.2, 1.2, '#1B2027', 48); cyl(S, [0, 0, 0], 7.6, 0.08, '#EDE6D6', 48);
  for (let i = 0; i < 60; i++) { const a = i / 60 * Math.PI * 2; const r0 = i % 5 ? 7.0 : 6.4; S.line([[Math.sin(a) * r0, Math.cos(a) * r0, 0.1], [Math.sin(a) * 7.3, Math.cos(a) * 7.3, 0.1]], '#15171B', { sw: i % 5 ? 1.5 : 4, z: -1 }); }
  const secs = lerp(300, 85, inOut(pr(t, 460.3, 463.6))); const minA = -secs / 3600 * Math.PI * 2; const secA = -(secs % 60) / 60 * Math.PI * 2 * 0 + t * 1.2;
  const hand = (a, len, w, col, z) => { const d = [Math.sin(a), Math.cos(a), 0], s2 = [Math.cos(a), -Math.sin(a), 0]; S.face([add(mul(s2, -w), [0, 0, z]), add(mul(d, len), [0, 0, z]), add(mul(s2, w), [0, 0, z])], col, { shade: false, z: -2 }); };
  hand(minA, 6.4, 0.25, '#15171B', 0.15); hand(-secs / 43200 * Math.PI * 2, 4.2, 0.35, '#15171B', 0.18);
  if (t > 461) { const pts = []; for (let i = 0; i <= 30; i++) { const a = minA + (-minA) * i / 30; pts.push([Math.sin(a) * 5.4, Math.cos(a) * 5.4, 0.2]); } S.face([[0, 0, 0.12], ...pts], C.red, { shade: false, op: 0.55, z: -1.5 }); }
  S.at([0, 0, 0.3], (x, y) => `<circle cx="${x}" cy="${y}" r="10" fill="${C.red}"/>`, { z: -5 });
  let s = BG + S.out();
  s += MONO(110, 130, 'BULLETIN OF THE ATOMIC SCIENTISTS · JAN 2026', { size: 17, ls: 3, op: cl(pr(t, 459.3, 459.6)) }) + words(t, ['THE', 'DOOMSDAY', 'CLOCK'], 110, 200, 56, 900, 457.4, 0.2, { keep: [1], keepCol: C.red });
  if (t > 461.0) s += `<g opacity="${cl(pr(t, 461, 461.3))}">` + TXT(1810, 560, `${Math.round(secs)}`, { size: 200, w: 900, a: 'end', fill: C.red }) + MONO(1810, 610, 'SECONDS TO MIDNIGHT', { size: 20, a: 'end', ls: 4 }) + `</g>`;
  if (t > 464.0) s += `<g opacity="${cl(pr(t, 464.0, 464.3))}"><rect x="1460" y="650" width="350" height="54" rx="27" fill="none" stroke="${C.amber}" stroke-width="2"/>` + MONO(1635, 684, 'CLOSEST IN HISTORY', { size: 18, a: 'middle', ls: 3, fill: C.amber }) + `</g>`;
  return s;
});
// F3 466.25–470.75 the question
add2(466.25, 470.75, t => {
  let s = BG + `<rect width="100%" height="100%" fill="#0B0D11"/>`;
  s += tornCard2D(t, 466.3, FACE('trump'), 1250, 170, 540, 680, { seed: 121, rot: 3, caption: 'PRESIDENT DONALD TRUMP', credit: 'WHITE HOUSE · PD', push: 0.006 });
  s += flagSVG('usa', 1270, 150, 78, 52, { op: cl(pr(t, 466.6, 466.9)) });
  s += words(t, ['COULD', 'DONALD', 'TRUMP', 'BECOME'], 110, 330, 56, 900, 466.3, 0.15, {}) + words(t, ['THE', 'FIRST', 'PRESIDENT'], 110, 420, 56, 900, 467.3, 0.15, { keep: [1], keepCol: C.amber }) + words(t, ['TO', 'ORDER', 'A', 'NUCLEAR', 'STRIKE?'], 110, 510, 56, 900, 468.4, 0.15, { keep: [3, 4], keepCol: C.red }) + MONO(110, 570, 'IN THIS ERA', { size: 18, ls: 4, op: cl(pr(t, 469.5, 469.8)) });
  return s;
});
// F4 470.75–473.13 public records: no evidence of intent
add2(470.75, 473.13, t => {
  let s = BG; const k = expo(pr(t, 470.9, 471.9));
  for (let i = 0; i < 6; i++) { const y = 300 + i * 70; s += `<rect x="560" y="${y}" width="${800 * cl(k * 6 - i)}" height="24" rx="4" fill="#1B2027"/>`; }
  const sx = lerp(560, 1360, pr(t, 471.0, 472.6)); s += `<rect x="${sx - 3}" y="280" width="6" height="440" fill="${C.blue}" opacity="0.8"/>`;
  if (t > 472.0) s += `<g opacity="${cl(pr(t, 472.0, 472.3))}"><rect x="610" y="780" width="700" height="80" rx="40" fill="#0E1116" stroke="${C.blue}" stroke-width="2"/>` + TXT(960, 834, 'NO EVIDENCE OF INTENT', { size: 36, w: 900, a: 'middle', fill: C.blue }) + `</g>`;
  return s + MONO(960, 230, 'PUBLIC RECORDS', { size: 22, a: 'middle', ls: 8 });
});
// F5 473.13–479.29 "totally defeated" paraphrase
add2(473.13, 479.29, t => {
  let s = BG + `<rect width="100%" height="100%" fill="#0B0D11"/>`;
  s += noteDrop(t, 473.2, 260, 250, 1400, 400, ['Iran is totally defeated —', 'why use a nuclear weapon on top of that?'], { head: 'PBS · 23 APR 2026 · PARAPHRASE', size: 56, lh: 84, seed: 131, rot: -1.5, foot: 'PRESIDENT DONALD TRUMP' });
  s += lower(t, 473.6, 479.1, 'Donald Trump', 'PRESIDENT OF THE UNITED STATES', { face: 'trump', flag: 'usa', bar: C.blue, credit: 'PHOTO: WHITE HOUSE · PD' });
  return s;
});
// F6 479.29–484.47 yet: "obliterate" + repeated Pickaxe warnings
add2(479.29, 484.47, t => {
  const tg = [0, 0, 2.5]; const cam = new Cam(orbit(tg, kf(t, [[479.29, -110], [484.47, -80, sine]]), 26, kf(t, [[479.29, 34], [484.47, 28]])), tg, 40);
  const S = new Scene(cam, Math.floor(t * 12)); floor(S, 0, 40, 3);
  terrain(S, [0, 0, 0], 9, 7, 14, (u, v) => Math.max(0, 6 * Math.exp(-(u * u * 2.2 + v * v * 2.6))), '#8A7A65', { boil: true });
  [481.9, 482.7, 483.4].forEach((t0, i) => { if (t > t0) S.at([0, 0, 6.8], (x, y) => { const ph = pr(t, t0, t0 + 1); return `<circle cx="${x}" cy="${y}" r="${20 + ph * 140}" fill="none" stroke="${C.red}" stroke-width="3" opacity="${1 - ph}"/>`; }, { z: -10 }); });
  let s = BG + S.out();
  s += words(t, ['YET'], 110, 150, 56, 900, 479.3, 0, { keep: [0], keepCol: C.amber });
  if (t > 480.41) s += `<g opacity="${cl(pr(t, 480.41, 480.7))}"><rect x="110" y="190" width="560" height="64" rx="8" fill="#0E1116" stroke="${C.red}" stroke-width="2"/>` + TXT(140, 234, 'THREATENED TO “OBLITERATE” IRAN', { size: 26, w: 800 }) + `</g>`;
  if (t > 481.85) s += `<g opacity="${cl(pr(t, 481.85, 482.1))}"><rect x="110" y="270" width="560" height="64" rx="8" fill="#0E1116" stroke="${C.amber}" stroke-width="2"/>` + TXT(140, 314, 'REPEATED WARNINGS · PICKAXE MTN', { size: 26, w: 800 }) + `</g>`;
  return s;
});
// F7 484.47–488.91 analysts: very unlikely, not zero
add2(484.47, 488.91, t => {
  let s = BG; const cx = 960, cy = 680, R = 360; const v = lerp(0.5, 0.07, expo(pr(t, 484.8, 486.2))) + Math.sin(t * 6) * 0.006;
  s += `<path d="M${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}" fill="none" stroke="#1F252D" stroke-width="40"/>`;
  for (let i = 0; i <= 10; i++) { const a = Math.PI + i / 10 * Math.PI; s += `<line x1="${cx + Math.cos(a) * (R - 30)}" y1="${cy + Math.sin(a) * (R - 30)}" x2="${cx + Math.cos(a) * (R - 60)}" y2="${cy + Math.sin(a) * (R - 60)}" stroke="#5B6573" stroke-width="2"/>`; }
  const a = Math.PI + v * Math.PI; s += `<line x1="${cx}" y1="${cy}" x2="${cx + Math.cos(a) * (R - 70)}" y2="${cy + Math.sin(a) * (R - 70)}" stroke="${C.text}" stroke-width="6" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="16" fill="${C.text}"/>`;
  s += MONO(cx - R, cy + 50, '0', { size: 20 }) + MONO(cx + R, cy + 50, 'CERTAIN', { size: 20, a: 'end' });
  s += words(t, ['VERY', 'UNLIKELY'], 960, 220, 72, 900, 485.0, 0.2, { a: 'middle', keep: [1], keepCol: C.blue });
  if (t > 487.25) s += `<g opacity="${cl(pr(t, 487.25, 487.5))}"><rect x="810" y="270" width="300" height="56" rx="28" fill="none" stroke="${C.red}" stroke-width="2"/>` + MONO(960, 306, 'BUT NOT ZERO', { size: 20, a: 'middle', ls: 4, fill: C.red }) + `</g>`;
  return s + MONO(960, 140, 'ANALYSTS', { size: 18, a: 'middle', ls: 6 });
});
// F8 488.91–501.15 what holds the line: four bricks rebuild the wall
const BR = [[493.33, 'PLANNERS', 'ALTERNATIVES ON THE TABLE', 'pentagon'], [495.63, 'ALLIES', 'WHO WOULD NEVER FORGIVE IT', null], [497.81, 'MEMORY', 'HIROSHIMA · NAGASAKI', 'hiroshima'], [499.31, 'PEOPLE', 'LIKE PETROV, WHO HESITATED', null]];
add2(488.91, 501.15, t => {
  const tg = [0, 0, 3.5]; const cam = new Cam(orbit(tg, kf(t, [[488.91, -120], [501.15, -95, sine]]), kf(t, [[488.91, 22], [501.15, 16]]), kf(t, [[488.91, 30], [501.15, 26]])), tg, 40);
  const S = new Scene(cam, Math.floor(t * 12)); floor(S, 0, 40, 3);
  BR.forEach(([t0, lab, sub2, ph], i) => { const k = cl(spring(t, t0, 0.55), 0, 1.06); if (k <= 0) return; const x = -9 + i * 4.6, z = (1 - k) * 10;
    box(S, [x - 2.2, -0.8, z], [4.4, 1.6, 7], '#2A2F37', { stroke: '#3A4350', sw: 1 });
    const inner = ph ? tornPhotoSVG(PH(ph), 440, 300, { seed: 140 + i, gray: true, pad: 10 }) : `<rect width="440" height="300" fill="#12161C"/>` + (i === 3 ? faceSVG('petrov', 220, 150, 120, { flag: 'ussr', ring: '#7CFFAE' }) : ['uk', 'france', 'japan', 'skorea', 'nato', 'israel'].map((f, j) => flagSVG(f, 40 + (j % 3) * 128, 50 + Math.floor(j / 3) * 110, 104, 69)).join(''));
    quad(S, [x - 2, -0.82, z + 6.6], [x + 2, -0.82, z + 6.6], [x - 2, -0.82, z + 3.9], 440, 300, inner, { z: -1 });
    S.at([x, -0.85, z + 3.2], (px, py) => TXT(px, py, lab, { size: 26, w: 900, a: 'middle' }) + MONO(px, py + 26, sub2, { size: 12, a: 'middle', ls: 1, fill: C.sub }), { z: -5 });
    if (k > 0.9 && t < t0 + 0.6) shock(S, [x, 0, 0.05], t, t0 + 0.25, 4, C.amber, 0.6); });
  let s = BG + S.out();
  s += words(t, ['WHAT', 'HOLDS', 'THE', 'LINE?'], 110, 150, 56, 900, 489.0, 0.15, { keep: [3], keepCol: C.amber });
  if (t > 490.43) s += MONO(110, 200, 'THE SAME FORCES · FOR 80 YEARS', { size: 18, ls: 4, op: cl(pr(t, 490.43, 490.7)) });
  return s;
});
// F9 501.15–511.55 the real story: how fast a rumor felt plausible
add2(501.15, 511.55, t => {
  const tg = [0, 0, 4]; const cam = new Cam(orbit(tg, -90 + (t - 501.15) * 5, 18, kf(t, [[501.15, 16], [511.55, 30]])), tg, 40);
  const S = new Scene(cam, Math.floor(t * 12)); floor(S, 0, 60, 4);
  network(S, [0, 0, 4], 15, 60, t, 504.0, { spread: 5, edge: '#24364F', packet: C.red, node: C.blue });
  S.at([0, 0, 4], (x, y, sc) => `<rect x="${x - 22}" y="${y - 38}" width="44" height="76" rx="8" fill="#0E1116" stroke="${C.text}" stroke-width="3"/><rect x="${x - 16}" y="${y - 28}" width="32" height="50" fill="${C.red}" opacity="${0.5 + 0.5 * Math.sin(t * 8)}"/>`, { z: -30 });
  let s = BG + S.out();
  s += words(t, ['THE', 'REAL', 'STORY'], 110, 150, 56, 900, 501.2, 0.15, { keep: [1], keepCol: C.amber });
  if (t > 505.03) s += words(t, ['HOW', 'FAST', 'IT', 'FELT', 'PLAUSIBLE'], 110, 220, 44, 800, 505.03, 0.15, { keep: [1], keepCol: C.red });
  s += `<g opacity="${cl(pr(t, 502.7, 503.0))}"><rect x="1430" y="120" width="380" height="56" rx="28" fill="none" stroke="${C.sub}" stroke-width="2"/>` + MONO(1620, 156, 'UNVERIFIED POST ON X', { size: 18, a: 'middle', ls: 3, fill: C.text }) + `</g>`;
  if (t > 507.89) { const h = lerp(0, 48, inOut(pr(t, 508, 511))); s += `<g opacity="${cl(pr(t, 507.89, 508.2))}"><rect x="1430" y="750" width="380" height="130" rx="10" fill="#0E1116" stroke="${C.red}" stroke-width="2"/>` + MONO(1460, 790, 'RUMOR → CRISIS PREP', { size: 16, ls: 3 }) + TXT(1460, 856, `+${Math.floor(h)} HRS`, { size: 54, w: 900, fill: C.red }) + `</g>`; }
  return s;
});
// F10 511.55–517.05 tracking Nov 7: verified facts only
add2(511.55, 517.05, t => {
  const tg = [0, 0, 1]; const cam = new Cam(orbit(tg, kf(t, [[511.55, -110], [517.05, -88, sine]]), kf(t, [[511.55, 50], [517.05, 42]]), kf(t, [[511.55, 30], [517.05, 24]])), tg, 40);
  const S = new Scene(cam, Math.floor(t * 12)); floor(S, 0, 40, 3);
  for (let d = 0; d < 14; d++) { const x = -9.6 + (d % 7) * 3.2, y = d < 7 ? 2 : -1.4; const day = d + 1; const hot = day === 7; const k = cl(spring(t, 511.6 + d * 0.04, 0.5), 0, 1.05); box(S, [x - 1.4, y - 1.4, 0], [2.8, 2.8, 0.3 + (hot ? 1.4 * k * expo(pr(t, 513.65, 514.4)) : 0)], hot ? C.amber : '#1B2027', {});
    S.at([x, y, 0.4 + (hot ? 1.4 * expo(pr(t, 513.65, 514.4)) : 0)], (px, py) => TXT(px, py + 12, String(day), { size: hot ? 40 : 26, w: 900, a: 'middle', fill: hot ? '#15171B' : C.sub }), { z: -5 }); }
  let s = BG + S.out();
  s += MONO(110, 130, 'NOVEMBER 2026', { size: 18, ls: 4 }) + words(t, ['ON', 'AND', 'AFTER', 'NOVEMBER', '7'], 110, 200, 56, 900, 512.3, 0.15, { keep: [4], keepCol: C.amber });
  if (t > 515.47) s += `<g opacity="${cl(pr(t, 515.47, 515.8))}"><rect x="1410" y="130" width="400" height="64" rx="32" fill="none" stroke="${C.blue}" stroke-width="2"/>` + MONO(1610, 170, '✓ VERIFIED FACTS ONLY', { size: 20, a: 'middle', ls: 3, fill: C.blue }) + `</g>`;
  return s;
});
// F11 517.05–524.25 subscribe + bell, then "which domino worries you most?"
add2(517.05, 524.25, t => {
  let s = BG; const op = 1 - pr(t, 520.3, 520.6);
  const sub2 = t > 518.6; const k = cl(spring(t, 517.2, 0.5), 0, 1.1); const press = t > 518.4 && t < 518.62 ? 0.92 : 1;
  s += `<g opacity="${cl(pr(t, 517.1, 517.4)) * op}">` + `<g transform="translate(960 300) scale(${0.85 + 0.15 * k}) translate(-960 -300)"><defs><clipPath id="lgc6"><circle cx="960" cy="290" r="130"/></clipPath></defs><image href="photos/verion_logo.png" x="820" y="150" width="280" height="280" clip-path="url(#lgc6)"/></g>` + `<g transform="translate(960 520) scale(${(0.8 + 0.2 * k) * press}) translate(-960 -520)"><rect x="720" y="465" width="480" height="110" rx="55" fill="${sub2 ? '#272C33' : C.red}"/>` + TXT(960, 536, sub2 ? 'SUBSCRIBED' : 'SUBSCRIBE', { size: 44, w: 800, a: 'middle', ls: 2 }) + `</g>`;
  const ring = t > 519.4 ? Math.sin((t - 519.4) * 30) * 20 * Math.exp(-(t - 519.4) * 3) : 0; s += `<g transform="translate(1280 520) rotate(${ring})"><path d="M-30 20 Q-30 -32 0 -34 Q30 -32 30 20 Z" fill="${t > 519.4 ? C.amber : '#5B6573'}"/><circle cx="0" cy="30" r="8" fill="${t > 519.4 ? C.amber : '#5B6573'}"/></g></g>`;
  if (t > 520.57) { s += words(t, ['WHICH', 'DOMINO', 'WORRIES', 'YOU', 'MOST?'], 960, 300, 72, 900, 520.6, 0.15, { a: 'middle', keep: [1], keepCol: C.amber });
    [['RUSSIA', ['russia']], ['SOUTH ASIA', ['india', 'pakistan']], ['EAST ASIA', ['china', 'taiwan']]].forEach(([n, fl], i) => { const t0 = 521.4 + i * 0.25; const kk = cl(spring(t, t0, 0.5), 0, 1.1); const x = 560 + i * 400; const wob = Math.sin((t - t0) * 6 + i) * 3; s += `<g opacity="${cl(pr(t, t0, t0 + 0.2))}" transform="translate(${x} ${640 + (1 - kk) * 60}) rotate(${wob})"><rect x="-55" y="-140" width="110" height="220" rx="10" fill="#E8E3D8"/><circle cx="0" cy="-80" r="12" fill="#15171B"/><circle cx="0" cy="20" r="12" fill="#15171B"/><line x1="-40" y1="-30" x2="40" y2="-30" stroke="#15171B" stroke-width="3"/></g>` + fl.map((f, j) => flagSVG(f, x - fl.length * 33 + j * 66 + 3, 790, 60, 40, { op: cl(pr(t, t0, t0 + 0.3)) })).join('') + MONO(x, 770, `${i + 1} · ${n}`, { size: 20, a: 'middle', ls: 3, fill: C.text, op: cl(pr(t, t0, t0 + 0.3)) }); }); }
  return s;
});
// F12/F13 524.25–541.85 the abyss: dominoes run toward a cliff; doubt; a pause; one says wait — the last one holds
const NDOM = 14; const STOP = 11;
add2(524.25, 541.85, t => {
  const tg = [kf(t, [[524.25, 6], [533.7, 20, inOut], [541.85, 23]]), 0, 2]; const cam = new Cam(orbit(tg, kf(t, [[524.25, -130], [533.7, -105, inOut], [541.85, -75, sine]]), kf(t, [[524.25, 22], [533.7, 14], [541.85, 10]]), kf(t, [[524.25, 34], [533.7, 22], [541.85, 18]])), tg, 40);
  const S = new Scene(cam, Math.floor(t * 12));
  // v3 (Amin: dominoes sank under the ground) — the cliff block is its own background pass, so its big top face can never sort over the dominoes standing on it
  const G = new Scene(cam, Math.floor(t * 12));
  box(G, [-6, -6, -14], [36, 12, 14], '#14181E', { stroke: '#232A33', sw: 1 });
  for (let i = 0; i < 18; i++) G.line([[30, -6 + i * 0.7, 0], [30 + 0.5 + rnd(i) * 1.5, -6 + i * 0.7, -14]], '#232A33', { sw: 1, z: 2 });
  // v2 (Amin: transparent dominoes, touching weirdly) — contact chain: each falling domino comes to rest ON the next one
  // (angle capped by the next domino's lean + contact angle), drawn as solid objects (one depth per domino) with dark edges.
  const fallT = i => 526.0 + i * 0.42, SP = 2.2, TH = 0.6, HD = 5, LEAN = Math.asin((SP - TH) / HD);
  const ang = new Array(NDOM).fill(0);
  { const ft = fallT(STOP); let a = t > ft ? 0.32 * expo(pr(t, ft, ft + 0.3)) - 0.06 * Math.sin((t - ft) * 5) * Math.exp(-(t - ft)) : 0; if (t > 533.71) a = lerp(a, 0.2, expo(pr(t, 533.71, 534.6))); ang[STOP] = Math.max(0, a); }
  // exact contact: domino i (pivot = its front-bottom edge) may tip only until its top-front corner touches the back face of domino i+1
  const rest = (i, b) => { const pv = i * SP + TH / 2, pn = (i + 1) * SP + TH / 2; const Bx = pn - TH * Math.cos(b), Bz = TH * Math.sin(b); const nx = -Math.cos(b), nz = Math.sin(b);
    const gap = a => (pv + HD * Math.sin(a) - Bx) * nx + (HD * Math.cos(a) - Bz) * nz; let lo = 0, hi = Math.PI / 2; if (gap(hi) >= 0) return hi; for (let k = 0; k < 40; k++) { const m = (lo + hi) / 2; if (gap(m) >= 0) lo = m; else hi = m; } return lo; };
  for (let i = STOP - 1; i >= 0; i--) { const ft = fallT(i); const free = t > ft ? Math.min(Math.PI / 2, ((t - ft) * 3) ** 1.6 * 1.25) : 0; ang[i] = Math.min(free, rest(i, ang[i + 1])); }
  for (let i = NDOM - 1; i >= 0; i--) { const x = i * SP, a = ang[i];
    S.group([x + Math.sin(a) * HD / 2, 0, Math.cos(a) * HD / 2], () => box(S, [x - TH / 2, -1.4, 0], [TH, 2.8, HD], i === STOP ? C.amber : '#C9C4B8', { tilt: a ? { axis: [0, 1, 0], a, pivot: [x + TH / 2, 0, 0] } : null, stroke: '#3A3F47', sw: 1 })); }
  let s = BG + G.out() + S.out();
  s += words(t, ['AT', 'THE', 'ABYSS'], 110, 150, 52, 900, 524.4, 0.15, { keep: [2], keepCol: C.red });
  if (t > 527.71) s += words(t, ['NOT', 'RAW', 'STRENGTH'], 110, 214, 40, 800, 527.71, 0.15, { keep: [1, 2], keepCol: C.sub });
  if (t > 529.43) s += words(t, ['DOUBT.'], 110, 270, 52, 900, 529.43, 0, { keep: [0], keepCol: C.amber });
  if (t > 530.99 && t < 533.7) { const k = cl(spring(t, 530.99, 0.5), 0, 1.1); s += `<g opacity="${cl(pr(t, 530.99, 531.2)) * (1 - pr(t, 533.3, 533.7))}" transform="translate(1660 200) scale(${k})"><circle r="70" fill="none" stroke="${C.text}" stroke-width="4"/><rect x="-26" y="-36" width="16" height="72" fill="${C.text}"/><rect x="10" y="-36" width="16" height="72" fill="${C.text}"/></g>`; }
  if (t > 533.71) s += `<g opacity="${cl(pr(t, 533.71, 533.95))}">` + TXT(1810, 190, 'WAIT.', { size: 110, w: 900, a: 'end', fill: C.amber }) + `</g>`;
  if (t > 536.73) s += `<g opacity="${cl(pr(t, 536.73, 537.1))}">` + MONO(1810, 250, 'THE ONLY BARRIER BETWEEN A RUMOR', { size: 18, a: 'end', ls: 3, fill: C.text }) + MONO(1810, 280, 'AND THE FIRST DETONATION IN 80 YEARS', { size: 18, a: 'end', ls: 3, fill: C.text }) + `</g>`;
  return s;
});
// F14 541.85–544.36 end card
add2(541.85, 544.36, t => {
  let s = `<rect width="100%" height="100%" fill="#07090C"/>`; const k = expo(pr(t, 541.9, 542.6));
  s += words(t, ['VERION'], 960, 520, 150, 900, 541.9, 0, { a: 'middle', ls: 30 }) + `<rect x="${960 - 300 * k}" y="560" width="${600 * k}" height="4" fill="${C.amber}"/>`;
  if (t > 543.15) s += words(t, ['STAY', 'ON', 'THE', 'CASE'], 960, 640, 40, 800, 543.15, 0.12, { a: 'middle', ls: 10, keep: [3], keepCol: C.amber });
  return s;
});

export function frame(t) { const sh = shots.find(s => t >= s.t0 && t < s.t1) || shots[shots.length - 1]; return frameSVG(t, sh.fn(t)); }
cli(frame, 452.35, 'a6');
