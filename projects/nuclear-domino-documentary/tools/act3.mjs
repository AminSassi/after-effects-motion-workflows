// ACT 3 — VO 145.05 → 251.45 (uranium, statements, CTA, nuclear taboo, wall shatters, dominoes map)
import * as L from './lib3d.mjs';
const { C, cl, pr, lerp, L3, expo, expoIn, inOut, sine, spring, rnd, kf, TXT, MONO, words, Cam, Scene, orbit, box, prism, cyl, worldMap, arc3, marker, LL, frameSVG, cli, rotAxis, add, sub, mul, PH, tornCard2D, noteDrop, paperNote, quad, shock, missile, flyArc, metaballs, shards, chapter, lower, tornPhotoSVG, flagSVG, faceSVG, FLAG, tw, esc } = L;
const BG = `<rect width="100%" height="100%" fill="url(#sky)"/>`;
const floor = (S, z = 0, ext = 60, st = 6) => { for (let i = -ext; i <= ext; i += st) { S.line([[i, -ext, z], [i, ext, z]], '#151A21', { sw: 1, z: 1e5 }); S.line([[-ext, i, z], [ext, i, z]], '#151A21', { sw: 1, z: 1e5 }); } };
const shots = []; const add2 = (t0, t1, fn) => shots.push({ t0, t1, fn });

// B1 v2 (Amin: dossier box "basic and bad") — the other side: Iran's flag as a torn print + the three things we know (previews the next beats)
add2(145.05, 147.91, t => {
  const push = 1 + (t - 145.05) * 0.01; let s = BG + `<g transform="translate(960 560) scale(${push}) translate(-960 -560)">`;
  s += tornCard2D(t, 145.1, FLAG('iran'), 150, 250, 760, 520, { seed: 151, rot: -2.5, caption: 'ISLAMIC REPUBLIC OF IRAN', credit: 'FLAG · PD', s0: 1.1, sepia: 0.06 });
  [[145.55, '01', 'THE URANIUM'], [146.05, '02', 'THE WEAPONS PROGRAM'], [146.55, '03', 'THE OFFICIAL LINE']].forEach(([t0, n, l], i) => { if (t < t0) return; const k = cl(spring(t, t0, 0.5), 0, 1.1); const y = 420 + i * 120;
    s += `<g opacity="${cl(pr(t, t0, t0 + 0.2))}" transform="translate(${(1 - cl(k)) * 70} 0)"><rect x="1030" y="${y - 62}" width="760" height="96" rx="12" fill="#0E1116" stroke="#232A33" stroke-width="2"/>` + MONO(1066, y - 2, n, { size: 22, fill: C.amber, ls: 2 }) + TXT(1130, y + 2, l, { size: 38, w: 900 }) + `</g>`; });
  s += `</g>` + MONO(1030, 300, 'WHAT WE KNOW', { size: 22, ls: 8, fill: C.sub, op: cl(pr(t, 145.3, 145.6)) });
  return s + words(t, ['THE', 'OTHER', 'SIDE'], 960, 140, 44, 800, 145.35, 0.2, { a: 'middle', ls: 6, keep: [1] });
});
// B2 147.91–157.51 IAEA + glass cylinder fills to 440.9 kg
add2(147.91, 157.51, t => {
  const tg = [0, 0, 5]; const cam = new Cam(orbit(tg, kf(t, [[147.91, -110], [157.51, -78, sine]]), kf(t, [[147.91, 18], [157.51, 10]]), kf(t, [[147.91, 34, expo], [148.6, 26], [157.51, 24]])), tg, 40);
  const S = new Scene(cam, Math.floor(t * 12)); floor(S, 0, 40, 4);
  cyl(S, [0, 0, 0], 3.4, 0.6, '#2A2F37', 24);
  const lvl = inOut(pr(t, 152.5, 156.4)) * 9; if (lvl > 0.05) cyl(S, [0, 0, 0.6], 2.75, lvl, '#C98A1E', 24);
  // glass (transparent faces)
  for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2, b = (i + 1) / 24 * Math.PI * 2; const r = 2.9; S.face([[Math.cos(a) * r, Math.sin(a) * r, 0.6], [Math.cos(b) * r, Math.sin(b) * r, 0.6], [Math.cos(b) * r, Math.sin(b) * r, 10.6], [Math.cos(a) * r, Math.sin(a) * r, 10.6]], '#9FB7E8', { op: 0.12, stroke: '#9FB7E8', sw: 0.6, z: -1 }); }
  for (let i = 0; i < 14; i++) { const ph = ((t * 0.5 + rnd(i)) % 1); if (lvl > 1) S.at([Math.cos(i) * 1.8 * rnd(i * 3), Math.sin(i) * 1.8 * rnd(i * 5), 0.8 + ph * lvl], (x, y, sc) => `<circle cx="${x}" cy="${y}" r="${cl(sc * 0.12, 1.5, 6)}" fill="#FFE2A3" opacity="${0.7 * (1 - ph)}"/>`, { z: -2 }); }
  let s = BG + S.out();
  s += tornCard2D(t, 148.2, PH('iaea'), 110, 220, 560, 380, { seed: 23, rot: -3, caption: 'IAEA · VIENNA', credit: 'IAEA IMAGEBANK · CC BY-SA', t1: 152.0 });
  const kg = 440.9 * inOut(pr(t, 152.5, 156.4));
  if (t > 152.3) s += `<g opacity="${cl(pr(t, 152.3, 152.6))}">` + TXT(1240, 470, `${kg.toFixed(1)} kg`, { size: 110, w: 900, fill: C.amber }) + MONO(1244, 520, '60% ENRICHED URANIUM · BEFORE JUNE 2025', { size: 18, ls: 3 }) + MONO(1244, 552, 'IAEA REPORT · "OVER 400 KG"', { size: 16, ls: 3, fill: C.tele }) + `</g>`;
  s += words(t, ['INTERNATIONAL', 'ATOMIC', 'ENERGY', 'AGENCY'], 110, 150, 42, 800, 149.91, 0.35, {});
  return s;
});
// B3 157.51–163.67 liquid splits into ~10 drops (metaballs, doc16); one = one bomb (in theory)
add2(157.51, 163.67, t => {
  let s = BG; const k = inOut(pr(t, 157.8, 159.6)); const balls = [];
  for (let i = 0; i < 10; i++) { const tx = 360 + i * 135, ty = 560; const x = lerp(960, tx, k), y = lerp(560, ty, k) + Math.sin(t * 2 + i) * 6 * k; const r = lerp(150 - i * 2, 52, k); balls.push([x, y, r]); }
  s += metaballs('mb', balls, '#C98A1E', { blur: 16 });
  const hk = spring(t, 160.4, 0.5); if (t > 160.4) s += `<circle cx="${360}" cy="560" r="${80 * cl(hk, 0, 1.1)}" fill="none" stroke="${C.red}" stroke-width="4"/>` + `<g opacity="${cl(pr(t, 160.6, 160.9))}">` + TXT(360, 700, '≈42 kg', { size: 64, w: 900, a: 'middle', fill: C.red }) + MONO(360, 740, 'ONE BOMB — IN THEORY', { size: 18, a: 'middle', ls: 3, fill: C.text }) + MONO(360, 770, 'IF REFINED TO WEAPONS GRADE', { size: 15, a: 'middle', ls: 2 }) + `</g>`;
  s += MONO(960, 340, 'IAEA YARDSTICK · "SIGNIFICANT QUANTITY"', { size: 18, a: 'middle', ls: 4, op: cl(pr(t, 158.0, 158.3)) });
  s += words(t, ['ABOUT', '42', 'KILOGRAMS'], 960, 260, 56, 900, 157.51, 0.25, { a: 'middle', keep: [1] });
  return s;
});
// B4 163.67–175.69 idle centrifuge hall · no weapons program since 2003 · Iran: peaceful
// B4 v2 (Amin: centrifuge hall "nothing to do with what is being said") — the assessment as a timeline:
// weapons work → halted 2003 → no active program (assessment) → enrichment restart: not known; Iran: peaceful.
add2(163.67, 175.69, t => {
  const X = y => 170 + (y - 1995) / 32 * 1580, Y = 700; const push = 1 + (t - 163.67) * 0.003;
  let s = BG + `<g transform="translate(960 600) scale(${push}) translate(-960 -600)">`;
  // sources
  [[163.9, 'IAEA', null, C.text], [164.5, 'WESTERN INTELLIGENCE', ['usa', 'uk'], C.text]].forEach(([t0, lab, fl, col], i) => { if (t < t0) return; const k = cl(spring(t, t0, 0.5), 0, 1.1); const x = 110 + i * 136; const w = tw(lab, 18, 400, 3) + (fl ? 130 : 50);
    s += `<g opacity="${cl(pr(t, t0, t0 + 0.2))}" transform="translate(0 ${(1 - cl(k)) * 20})"><rect x="${x}" y="250" width="${w}" height="54" rx="27" fill="#0E1116" stroke="#2A313B" stroke-width="2"/>` + (fl ? fl.map((f, j) => flagSVG(f, x + 20 + j * 50, 263, 42, 28)).join('') : '') + MONO(x + (fl ? 122 : 25), 285, lab, { size: 18, ls: 3, fill: col }) + `</g>`; });
  // axis
  const ax = expo(pr(t, 164.2, 165.4)); s += `<line x1="${X(1995)}" y1="${Y}" x2="${X(1995) + (X(2027) - X(1995)) * ax}" y2="${Y}" stroke="#3A4350" stroke-width="3"/>`;
  for (let y = 1995; y <= 2025; y += 5) if (X(y) <= X(1995) + (X(2027) - X(1995)) * ax) s += `<line x1="${X(y)}" y1="${Y}" x2="${X(y)}" y2="${Y + 14}" stroke="#5C6573" stroke-width="2"/>` + MONO(X(y), Y + 44, String(y), { size: 17, a: 'middle', fill: '#6B7787' });
  // weapons work bar, halted 2003
  const wk = expo(pr(t, 165.6, 166.8)); if (wk > 0) { s += `<rect x="${X(1999)}" y="${Y - 120}" width="${(X(2003) - X(1999)) * wk}" height="44" rx="6" fill="${C.red}" opacity="0.85"/>` + MONO(X(1999), Y - 136, 'COORDINATED WEAPONS WORK', { size: 16, ls: 2, fill: C.red, op: wk });
    if (t > 166.9) { const k = cl(spring(t, 166.9, 0.45), 0, 1.15); s += `<g transform="translate(${X(2003)} ${Y - 98}) scale(${k})"><circle r="26" fill="${C.bg}" stroke="${C.text}" stroke-width="3"/><rect x="-10" y="-10" width="20" height="20" fill="${C.text}"/></g>` + TXT(X(2003) + 40, Y - 88, 'HALTED · 2003', { size: 30, w: 900, fill: C.text, op: cl(pr(t, 167.0, 167.3)) }); } }
  // no active program since (assessment) — dashed blue track to today
  const nk = inOut(pr(t, 167.6, 169.2)); if (nk > 0) s += `<line x1="${X(2003)}" y1="${Y - 30}" x2="${X(2003) + (X(2026) - X(2003)) * nk}" y2="${Y - 30}" stroke="${C.blue}" stroke-width="5" stroke-dasharray="16 10"/>` + MONO(X(2008), Y - 50, 'NO ACTIVE WEAPONS PROGRAM · ASSESSMENT', { size: 16, ls: 2, fill: C.blue, op: pr(nk, 0.3, 0.7) });
  // enrichment restart: not known
  if (t > 169.6) { const k = cl(spring(t, 169.6, 0.5), 0, 1.1); const x = X(2025.6); s += `<g opacity="${cl(pr(t, 169.6, 169.8))}"><line x1="${x}" y1="${Y - 30}" x2="${x}" y2="${Y - 200}" stroke="${C.amber}" stroke-width="2" stroke-dasharray="4 6"/><g transform="translate(${x} ${Y - 236}) scale(${k})"><circle r="34" fill="#1A1408" stroke="${C.amber}" stroke-width="3"/>` + TXT(0, 15, '?', { size: 44, w: 900, a: 'middle', fill: C.amber }) + `</g>` + TXT(x - 52, Y - 228, 'ENRICHMENT RESTARTED?', { size: 30, w: 900, a: 'end', fill: C.amber }) + MONO(x - 52, Y - 196, 'NOT KNOWN', { size: 18, a: 'end', ls: 4, fill: C.amber }) + `</g>`; }
  s += `</g>`;
  s += words(t, ['NO', 'ACTIVE', 'WEAPONS', 'PROGRAM', 'SINCE', '2003'], 110, 200, 52, 900, 166.5, 0.35, { keep: [5], keepCol: C.blue });
  if (t > 173.21) { const k = spring(t, 173.21, 0.5); s += `<g opacity="${cl(pr(t, 173.21, 173.4))}" transform="translate(0 ${(1 - cl(k)) * 30})"><rect x="1150" y="800" width="670" height="110" rx="55" fill="#12161C" stroke="${C.red}" stroke-width="2"/>` + flagSVG('iran', 1186, 832, 70, 46) + TXT(1276, 870, 'Iran: “peaceful program”', { size: 36, w: 800 }) + `</g>`; }
  return s;
});
// B5 175.69–193.99 the president: three hanging notes on a line
const NOTES = [[177.43, '15 OCT 2026 · NEWSMAX', ['“I wouldn’t use', 'nuclear.”'], C.blue], [181.87, '2 NOV 2026 · REPORTERS', ['Post-election attack?', '“No.”'], C.blue], [186.89, '2 NOV 2026 · AXIOS (ELECTION EVE)', ['“One way or the other,', 'we will do something,', 'but there is no rush.”'], C.red]];
add2(175.69, 193.99, t => {
  const tx = kf(t, [[175.69, -18], [178.5, -12], [183.5, 0], [188.5, 12], [193.99, 14]]); const tg = [tx, 0, 6];
  const cam = new Cam(add(tg, [Math.sin(t * 0.3) * 2, -24, 1.5]), tg, 40);
  const S = new Scene(cam, Math.floor(t * 12));
  S.line([[-30, 0.3, 11], [30, 0.3, 11]], '#9AA4B2', { sw: 1.5 });
  quad(S, [-26, 0.5, 11], [-14, 0.5, 11], [-26, 0.5, 2], 1200, 900, tornPhotoSVG(PH('whitehouse'), 1200, 900, { seed: 31, caption: 'THE WHITE HOUSE', credit: 'PD' }), { op: cl(pr(t, 175.8, 176.2)) });
  NOTES.forEach(([t0, head, lines, col], i) => { if (t < t0 - 0.2) return; const x = -6 + i * 12; const sw = Math.sin((t - t0) * 4) * 0.12 * Math.exp(-(t - t0) * 1.2); const drop = (1 - cl(spring(t, t0 - 0.2, 0.6), 0, 1.1)) * 6; const piv = [x, 0, 11];
    const R = p => rotAxis(add(p, [0, 0, drop]), [0, 1, 0], sw, piv);
    quad(S, R([x - 5, 0, 10.4]), R([x + 5, 0, 10.4]), R([x - 5, 0, 5.6]), 1000, 480, paperNote(1000, 480, lines, { head, size: 78, lh: 100, seed: 40 + i, headCol: col === C.red ? '#7A1E22' : '#1E3A7A' }));
    S.at(R([x, -0.1, 10.9]), (px, py, sc) => `<rect x="${px - sc * 0.4}" y="${py - sc * 0.6}" width="${sc * 0.8}" height="${sc * 1.1}" rx="3" fill="#9AA4B2"/>`, { z: -3 }); });
  let s = BG + S.out();
  s += words(t, ['WHAT', 'DOES', 'THE', 'PRESIDENT', 'SAY?'], 110, 140, 46, 800, 175.69, 0.2, { keep: [3], keepCol: C.blue });
  return s;
});
// B6 193.99–196.97 contradictory signals: gauge needle swings
add2(193.99, 196.97, t => {
  let s = BG; const cx = 960, cy = 700, R = 380;
  s += `<path d="M${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}" fill="none" stroke="#1F252D" stroke-width="40"/>`;
  s += `<path d="M${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx} ${cy - R}" fill="none" stroke="${C.blue}" stroke-width="6" opacity="0.7"/><path d="M${cx} ${cy - R} A ${R} ${R} 0 0 1 ${cx + R} ${cy}" fill="none" stroke="${C.red}" stroke-width="6" opacity="0.7"/>`;
  for (let i = 0; i <= 20; i++) { const a = Math.PI + i / 20 * Math.PI; s += `<line x1="${cx + Math.cos(a) * (R - 30)}" y1="${cy + Math.sin(a) * (R - 30)}" x2="${cx + Math.cos(a) * (R - (i % 5 ? 50 : 70))}" y2="${cy + Math.sin(a) * (R - (i % 5 ? 50 : 70))}" stroke="#5B6573" stroke-width="2"/>`; }
  const v = 0.5 + 0.42 * Math.sin((t - 194) * 5.5) * Math.exp(-(t - 194) * 0.25); const a = Math.PI + v * Math.PI;
  s += `<line x1="${cx}" y1="${cy}" x2="${cx + Math.cos(a) * (R - 60)}" y2="${cy + Math.sin(a) * (R - 60)}" stroke="${C.text}" stroke-width="6" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="18" fill="${C.text}"/>`;
  s += TXT(cx - R, cy + 60, '“WOULDN’T USE NUCLEAR”', { size: 26, w: 800, fill: C.blue }) + TXT(cx + R, cy + 60, '“WILL DO SOMETHING”', { size: 26, w: 800, fill: C.red, a: 'end' });
  s += words(t, ['CONTRADICTORY', 'SIGNALS'], 960, 170, 64, 900, 194.2, 0.3, { a: 'middle', keep: [0] });
  return s;
});
// B7 196.97–209.19 CTA: fact/rumor sorting + subscribe button + bell
// B7 v2 (Amin: subscribe scene "silly") — channel header with a real cursor click + bell, then weekly stories pass a fact/rumor scanner
const STORIES = [['iran', 'usa', 'Strike-date claim', 0], ['iran', null, 'IAEA stockpile report', 1], ['russia', 'ukraine', '“Secret deal” post', 0], ['qatar', 'iran', 'Ceasefire talks', 1], ['china', 'taiwan', 'Leaked war plan', 0], ['india', 'pakistan', 'Ceasefire held', 1]];
const cursor = (x, y, press) => `<g transform="translate(${x} ${y}) scale(${press ? 0.9 : 1})"><path d="M0 0 L0 38 L10 29 L17 45 L24 42 L17 26 L30 26 Z" fill="#F2F2F2" stroke="#0B0D10" stroke-width="2.5" stroke-linejoin="round"/></g>`;
add2(196.97, 209.19, t => {
  let s = BG; const out = pr(t, 205.5, 205.95);
  // channel header: arrives centered, then rises to the top when the stories start
  const up = inOut(pr(t, 200.6, 201.4)); const hy = lerp(430, 150, up), hs = lerp(1, 0.78, up);
  const hk = cl(spring(t, 197.05, 0.6), 0, 1.1); const subd = t > 199.0;
  if (out < 1) { s += `<g opacity="${cl(pr(t, 197.0, 197.3)) * (1 - out)}" transform="translate(960 ${hy}) scale(${hs * (0.92 + 0.08 * cl(hk))}) translate(-960 -100)">`;
  s += `<rect x="410" y="0" width="1100" height="200" rx="28" fill="#0E1116" stroke="#232A33" stroke-width="2"/><defs><clipPath id="lgc"><circle cx="520" cy="100" r="66"/></clipPath></defs><image href="photos/verion_logo.png" x="448" y="28" width="144" height="144" clip-path="url(#lgc)"/><circle cx="520" cy="100" r="66" fill="none" stroke="${C.amber}" stroke-width="3"/>`;
  s += TXT(612, 92, 'Verion Story', { size: 54, w: 900, ls: 2 }) + MONO(616, 136, 'MYSTERY · TRUE CRIME', { size: 16, ls: 4, fill: C.sub });
  const press = t > 198.85 && t < 199.05; const bw = subd ? 290 : 270;
  s += `<g transform="translate(1290 100) scale(${press ? 0.94 : 1})"><rect x="${-bw / 2}" y="-38" width="${bw}" height="76" rx="38" fill="${subd ? '#272C33' : C.text}"/>` + TXT(subd ? 14 : 0, 12, subd ? 'Subscribed' : 'Subscribe', { size: 30, w: 800, a: 'middle', fill: subd ? C.text : '#0B0D10' }) + (subd ? `<path d="M-118 0 L-106 12 L-86 -12" fill="none" stroke="${C.text}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>` : '') + `</g>`;
  if (t > 199.0) { const rk = pr(t, 199.0, 199.6); s += `<circle cx="1290" cy="100" r="${40 + rk * 120}" fill="none" stroke="${C.text}" stroke-width="3" opacity="${1 - rk}"/>`; }
  const ring = t > 199.7 ? Math.sin((t - 199.7) * 28) * 16 * Math.exp(-(t - 199.7) * 2.6) : 0; const bellOn = t > 199.7;
  s += `<g transform="translate(1462 100) rotate(${ring})"><path d="M-20 14 Q-20 -24 0 -26 Q20 -24 20 14 L26 20 L-26 20 Z" fill="${bellOn ? C.amber : '#5B6573'}"/><circle cx="0" cy="27" r="6" fill="${bellOn ? C.amber : '#5B6573'}"/>${bellOn ? `<circle cx="18" cy="-20" r="8" fill="${C.red}"/>` : ''}</g>`;
  s += `</g>`; }
  // cursor path → Subscribe (click) → bell (click) → leaves
  if (t > 197.6 && t < 200.7) { const p = kf(t, [[197.6, [1700, 900]], [198.8, [1300, 450], inOut], [199.4, [1300, 450]], [199.65, [1470, 445], inOut], [200.0, [1470, 445]], [200.6, [1800, 1000], expoIn]]); s += cursor(p[0], p[1], (t > 198.8 && t < 199.0) || (t > 199.62 && t < 199.8)); }
  // weekly stories through the scanner
  if (t > 201.2 && out < 1) { const sx = 960; s += `<g opacity="${1 - out}">`;
    s += `<rect x="${sx - 3}" y="380" width="6" height="560" fill="${C.text}" opacity="0.5"/><rect x="${sx - 40}" y="380" width="80" height="560" fill="url(#scanG)"/>` + `<defs><linearGradient id="scanG"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.5" stop-color="#fff" stop-opacity="0.08"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>`;
    s += MONO(1840, 470, 'VERIFIED FACT', { size: 20, a: 'end', ls: 4, fill: C.blue, op: cl(pr(t, 203.2, 203.5)) }) + MONO(1840, 860, 'RUMOR', { size: 20, a: 'end', ls: 4, fill: C.red, op: cl(pr(t, 204.3, 204.6)) });
    s += MONO(110, 470, 'EVERY WEEK', { size: 20, ls: 6, fill: C.sub, op: cl(pr(t, 201.3, 201.6)) });
    STORIES.forEach(([f1, f2, lab, fact], i) => { const ts = 201.35 + i * 0.55; if (t < ts) return; const x = -340 + (t - ts) * 760; const k = inOut(pr(x, sx - 160, sx + 120)); const y = 610 + k * (fact ? -120 : 140); const done = x > sx - 20;
      const col = !done ? '#2A313B' : fact ? C.blue : C.red; const dim = done && !fact ? 0.55 : 1;
      s += `<g transform="translate(${x} ${y})" opacity="${dim}"><rect x="0" y="-48" width="390" height="96" rx="14" fill="#0E1116" stroke="${col}" stroke-width="2.5"/>` + flagSVG(f1, 18, -30, 48, 32) + (f2 ? flagSVG(f2, 18, 4, 48, 32) : '') + TXT(84, 10, lab, { size: 24, w: 800 }) + (done ? (fact ? `<path d="M352 -2 L360 8 L374 -10" fill="none" stroke="${C.blue}" stroke-width="4" stroke-linecap="round"/>` : `<line x1="84" y1="2" x2="${84 + tw(lab, 24, 800)}" y2="2" stroke="${C.red}" stroke-width="3"/>`) : '') + `</g>`; });
    s += `</g>`; }
  if (t > 205.93) s += words(t, ['THE', 'HARDEST', 'PART', 'IS', 'STILL', 'AHEAD'], 960, 560, 72, 900, 205.93, 0.18, { a: 'middle', keep: [1], keepCol: C.red });
  return s;
});
// (old 3D boxes version kept for reference, unused)
const subscribeUnused = (t => {
  const tg = [0, 0, 3]; const cam = new Cam(orbit(tg, kf(t, [[196.97, -100], [205.9, -80], [209.19, -90, inOut]]), kf(t, [[196.97, 30], [205.9, 24], [209.19, 8, inOut]]), kf(t, [[196.97, 34], [205.9, 30], [209.19, 20, expoIn]])), tg, 40);
  const S = new Scene(cam, Math.floor(t * 12)); floor(S, 0, 40, 4);
  box(S, [-12, -3, 0], [7, 6, 2.2], '#1B2A3D', { stroke: C.blue, sw: 1.2 }); box(S, [5, -3, 0], [7, 6, 2.2], '#3B1416', { stroke: C.red, sw: 1.2 });
  for (let i = 0; i < 10; i++) { const t0 = 200.73 + i * 0.42; const k = pr(t, t0, t0 + 0.9); if (k <= 0) continue; const fact = rnd(i * 7) > 0.45; const tgt = fact ? [-8.5, 0, 2.3] : [8.5, 0, 2.3]; const st = [0, 0, 9]; const p = [lerp(st[0], tgt[0], inOut(k)), 0, lerp(st[2], tgt[2], inOut(k)) + Math.sin(k * Math.PI) * 4];
    if (k < 1) box(S, [p[0] - 1.1, p[1] - 0.05, p[2]], [2.2, 0.1, 1.4], fact ? '#C9D6EE' : '#EECBCB', { tilt: { axis: [0, 1, 0], a: k * 3, pivot: p } }); }
  S.at([-8.5, -3, 2.6], (x, y) => MONO(x, y, 'VERIFIED FACT', { size: 18, w: 700, a: 'middle', fill: C.blue, ls: 3 }), { z: -5 }); S.at([8.5, -3, 2.6], (x, y) => MONO(x, y, 'RUMOR', { size: 18, w: 700, a: 'middle', fill: C.red, ls: 3 }), { z: -5 });
  let s = BG + S.out();
  const pk = spring(t, 198.6, 0.4); const press = t > 199.3 && t < 199.55 ? 0.92 : 1;
  s += `<g opacity="${cl(pr(t, 197.2, 197.5)) * (1 - pr(t, 205.6, 206))}" transform="translate(960 300) scale(${(0.8 + 0.2 * cl(spring(t, 197.2, 0.5), 0, 1.1)) * press}) translate(-960 -300)"><rect x="740" y="250" width="440" height="100" rx="50" fill="${t > 199.4 ? '#272C33' : C.red}"/>` + TXT(960, 316, t > 199.4 ? 'SUBSCRIBED' : 'SUBSCRIBE', { size: 40, w: 800, a: 'middle', ls: 2 });
  const ring = t > 199.9 ? Math.sin((t - 199.9) * 30) * 18 * Math.exp(-(t - 199.9) * 3) : 0;
  s += `<g transform="translate(1240 300) rotate(${ring})"><path d="M-26 18 Q-26 -28 0 -30 Q26 -28 26 18 Z" fill="${t > 199.9 ? C.amber : '#5B6573'}"/><circle cx="0" cy="26" r="7" fill="${t > 199.9 ? C.amber : '#5B6573'}"/></g></g>`;
  s += TXT(960, 200, 'VERION', { size: 72, w: 900, a: 'middle', ls: 18, op: cl(pr(t, 197.0, 197.3)) * (1 - pr(t, 205.6, 206)) });
  if (t > 205.93) s += words(t, ['THE', 'HARDEST', 'PART', 'IS', 'STILL', 'AHEAD'], 960, 170, 64, 900, 205.93, 0.18, { a: 'middle', keep: [1], keepCol: C.red });
  return s;
});
void subscribeUnused;
// B8 209.19–210.97 chapter 03
add2(209.19, 210.97, t => { const ex = pr(t, 210.7, 210.97); return `<rect width="100%" height="100%" fill="#07090C"/><g opacity="${1 - ex}">` + chapter(t, 209.19, '03', 'THE NUCLEAR TABOO', { keep: [1, 2], size: 110 }) + `</g>`; });
// B9 210.97–215.61 Hiroshima & Nagasaki torn photos on a dark board (3D)
// B9 v2 (Amin: one image disappeared, the other flickered, bad zoom/tilt) — two flat torn prints, both stay on screen,
// one constant push about the centre. No 3D, no tilt, no depth sorting.
add2(210.97, 215.61, t => {
  const push = 1 + (t - 210.97) * 0.008; let s = BG + `<g transform="translate(960 560) scale(${push}) translate(-960 -560)">`;
  s += tornCard2D(t, 211.1, PH('hiroshima'), 150, 205, 760, 830, { seed: 50, rot: -2.5, gray: true, caption: 'HIROSHIMA · 6 AUG 1945', credit: 'US NATIONAL ARCHIVES · PD', sepia: 0.18, drift: 0, push: 0 });
  s += tornCard2D(t, 212.6, PH('nagasaki'), 1010, 205, 760, 830, { seed: 51, rot: 2.5, gray: true, caption: 'NAGASAKI · 9 AUG 1945', credit: 'US NATIONAL ARCHIVES · PD', sepia: 0.18, drift: 0, push: 0 });
  s += `</g>`;
  return s + words(t, ['1945'], 110, 150, 72, 900, 210.97, 0, { keep: [0] });
});
// B10 215.61–230.45 80-year ribbon: Korea, Vietnam tonnage, Gulf War, pulled back
add2(215.61, 230.45, t => {
  const yr = kf(t, [[215.61, 1938], [219.6, 1947], [220.6, 1952, inOut], [221.4, 1963, inOut], [224.2, 1970], [225.3, 1990, inOut], [226.3, 1968, inOut], [230.45, 1966]]);
  const back = kf(t, [[225.4, 1], [226.4, 1.75, inOut], [230.45, 1.85]]);
  const X = y => (y - 1945) * 1.2; const tg = [X(yr), 1, 1.5]; const cam = new Cam(add(tg, [-7 * back, -24 * back, 11 * back]), tg, 42);
  const S = new Scene(cam, Math.floor(t * 12));
  S.face([[X(1945), -1.2, 0], [X(2026), -1.2, 0], [X(2026), 1.2, 0], [X(1945), 1.2, 0]], '#141920', { shade: false, z: 30 });
  for (let y = 1945; y <= 2026; y++) { const big = y % 10 === 0; S.line([[X(y), -1.2, 0.02], [X(y), big ? -2 : -1.6, 0.02]], big ? '#9AA4B2' : '#3A4350', { sw: big ? 2 : 1, z: 20 }); if (big) S.at([X(y), -2.6, 0.02], (x, yy) => MONO(x, yy, String(y), { size: 16, a: 'middle', fill: '#5C7C99' }), { z: 5 }); }
  const fill = expo(pr(t, 215.7, 219.6)); S.face([[X(1945), -0.3, 0.03], [X(1945 + 81 * fill), -0.3, 0.03], [X(1945 + 81 * fill), 0.3, 0.03], [X(1945), 0.3, 0.03]], C.amber, { shade: false, z: 10 });
  const ev = [[1950, 'KOREA', 220.07], [1965, 'VIETNAM', 221.2], [1991, 'GULF WAR', 224.99]];
  ev.forEach(([y, n, t0]) => { const e = cl(spring(t, t0, 0.5), 0, 1.1); if (e <= 0) return; box(S, [X(y) - 0.6, -0.6, 0], [1.2, 1.2, 3 * e], '#1C222A', { stroke: '#9AA4B2', sw: 1 }); S.at([X(y), 0, 3.4 * e + 0.6], (x, yy) => TXT(x, yy, n, { size: 26, w: 800, a: 'middle' }) + MONO(x, yy + 26, 'NOT USED', { size: 15, a: 'middle', fill: C.blue, ls: 3 }), { z: -5 }); });
  if (t > 222.2) for (let i = 0; i < 30; i++) { const e = cl(spring(t, 222.2 + i * 0.05, 0.4), 0, 1.1); if (e > 0) box(S, [X(1966) + (i % 6) * 0.5, 2 + Math.floor(i / 6) * 0.5, 0], [0.4, 0.4, 0.4 * e], '#5B4A2E', {}); }
  if (t > 222.6) S.at([X(1967.5), 4.8, 0.6], (x, y) => MONO(x, y, '■ = 1 HIROSHIMA-SCALE BOMB TONNAGE (ILLUSTRATIVE)', { size: 14, ls: 1, fill: C.amber }), { z: -6 });
  // v2 (Amin: red levers "silly") — documented moments when leaders considered it and pulled back: portrait cards tied to their year
  const MOM = [[226.2, 1950, 'truman', 'Harry S. Truman', 'KOREA · 1950'], [226.9, 1954, 'eisenhower', 'Dwight D. Eisenhower', 'DIEN BIEN PHU · 1954'], [227.6, 1962, 'kennedy', 'John F. Kennedy', 'CUBA · 1962']];
  let s = BG + S.out();
  MOM.forEach(([t0, y, face, name, ev], i) => { if (t < t0) return; const k = cl(spring(t, t0, 0.55), 0, 1.1), op = cl(pr(t, t0, t0 + 0.25)); const cx = 360 + i * 600, cy = 410; const p = cam.p([X(y), 0, 0.05]);
    const pull = expo(pr(t, t0 + 0.9, t0 + 1.5));
    s += `<g opacity="${op}"><line x1="${cx}" y1="${cy + 92}" x2="${p[0]}" y2="${p[1]}" stroke="#9AA4B2" stroke-width="1.5" stroke-dasharray="5 6"/><circle cx="${p[0]}" cy="${p[1]}" r="7" fill="${C.blue}"/></g>`;
    s += `<g opacity="${op}" transform="translate(${cx} ${cy + (1 - cl(k)) * 40}) scale(${0.9 + 0.1 * cl(k, 0, 1.1)})"><rect x="-250" y="-92" width="500" height="184" rx="16" fill="#0E1116" stroke="#2A313B" stroke-width="2"/>` + faceSVG(face, -168, 0, 62, { flag: 'usa', ring: '#9AA4B2' }) +
      TXT(-86, -26, name, { size: 27, w: 800 }) + MONO(-84, 6, ev, { size: 16, ls: 2, fill: C.sub }) + MONO(-84, 50, 'CONSIDERED', { size: 15, ls: 3, fill: C.red }) + `<g opacity="${pull}">` + MONO(46, 50, '→ PULLED BACK', { size: 15, ls: 3, fill: C.blue }) + `</g></g>`; });
  s += MONO(110, 130, 'NO NATION HAS USED A NUCLEAR WEAPON IN WAR', { size: 18, ls: 3, op: cl(pr(t, 215.7, 216)) }) + TXT(110, 200, `${Math.round(lerp(0, 81, fill))} YEARS`, { size: 64, w: 900, fill: C.amber });
  if (t > 225.89) s += words(t, ['CONSIDERED', '—', 'AND', 'PULLED', 'BACK'], 110, 270, 40, 800, 225.89, 0.3, { keep: [3, 4], keepCol: C.blue });
  return s;
});
// B11 230.45–237.19 LBJ 1964 note
add2(230.45, 237.19, t => {
  let s = BG + `<rect width="100%" height="100%" fill="#0D0F12"/>`;
  const c = Math.round(lerp(0, 19, inOut(pr(t, 232.5, 234.0))));
  s += TXT(1460, 560, String(c), { size: 300, w: 900, a: 'middle', fill: C.amber, op: cl(pr(t, 232.5, 232.7)) }) + MONO(1460, 620, 'YEARS · 1945 → 1964', { size: 20, a: 'middle', ls: 4, op: cl(pr(t, 232.5, 232.7)) });
  s += noteDrop(t, 230.6, 160, 170, 940, 420, ['“nineteen peril-filled years”', 'no nation “loosed the atom”'], { head: 'DETROIT · 7 SEPT 1964', size: 54, lh: 84, seed: 61, foot: 'LYNDON B. JOHNSON · AMERICAN PRESIDENCY PROJECT', rot: -2 });
  s += lower(t, 230.6, 236.9, 'Lyndon B. Johnson', 'PRESIDENT OF THE UNITED STATES · 1964', { face: 'lbj', flag: 'usa', credit: 'PHOTO: ARNOLD NEWMAN · WHITE HOUSE · PD' });
  return s;
});
// B12 237.19–244.97 the taboo: a glass wall rises around the map; three layers etched
// B13 244.97–247.71 the wall shatters
function wallScene(t, shatter) {
  const tg = [50, 35, 6]; const cam = new Cam(orbit(tg, kf(t, [[237.19, -100], [247.71, -70, sine]]), kf(t, [[237.19, 30], [247.71, 18]]), kf(t, [[237.19, 110], [244.9, 80], [247.71, 70]])), tg, 40);
  const S = new Scene(cam, Math.floor(t * 12)); worldMap(S, { bbox: [-10, 0, 120, 70], land: '#161C23', hi: { 364: '#3B1416' } });
  const h = 14 * cl(spring(t, 237.4, 0.9), 0, 1.05);
  if (!shatter) { const op = 0.16; S.face([[15, 20, 0], [85, 20, 0], [85, 20, h], [15, 20, h]], '#9FB7E8', { shade: false, op, stroke: '#CFE0FF', sw: 1.5, z: -10 });
    for (let i = 0; i < 12; i++) S.line([[15 + i * 6, 20, 0], [15 + i * 6 + 3, 20, h]], '#CFE0FF', { sw: 0.8, op: 0.25, z: -11 });
    [[240.0, 'MORAL', 0.3], [241.9, 'POLITICAL', 0.55], [243.0, 'MILITARY', 0.8]].forEach(([t0, lab, f]) => { if (t < t0) return; const k = expo(pr(t, t0, t0 + 0.5)); S.line([[15, 19.9, h * f], [15 + 70 * k, 19.9, h * f]], C.amber, { sw: 2, z: -12 }); S.at([16, 19.8, h * f + 0.6], (x, y) => MONO(x, y, lab, { size: 20, w: 700, fill: C.amber, ls: 6, op: k }), { z: -13 }); });
  } else { shards(S, [50, 20, 7], 70, 14, t, 245.3, 70); shock(S, [50, 20, 0.2], t, 245.3, 30, C.red, 1.6); }
  return S;
}
add2(237.19, 244.97, t => { const S = wallScene(t, false); return BG + S.out() + words(t, ['AN', 'INVISIBLE', 'WALL'], 110, 150, 56, 900, 238.4, 0.25, { keep: [1] }) + MONO(110, 200, 'POLITICAL SCIENTISTS: “THE NUCLEAR TABOO”', { size: 18, ls: 3, op: cl(pr(t, 237.3, 237.6)) }); });
add2(244.97, 247.71, t => { const S = wallScene(t, t > 245.3); const fl = pr(t, 245.3, 245.6); return BG + S.out() + (fl > 0 && fl < 1 ? `<rect width="100%" height="100%" fill="#fff" opacity="${0.25 * (1 - fl)}"/>` : '') + words(t, ['A', 'FIRST', 'STRIKE', 'SHATTERS', 'IT'], 110, 150, 56, 900, 245.0, 0.2, { keep: [3], keepCol: C.red }); });
// B14 247.71–251.45 map of the dominoes: blocks rise in three regions
function domino(S, base, h, col, tilt = 0) { const w = 3.2, d = 1.3; box(S, [base[0] - w / 2, base[1] - d / 2, 0], [w, d, h], col, { tilt: tilt ? { axis: [1, 0, 0], a: tilt, pivot: [base[0], base[1], 0] } : null }); }
add2(247.71, 251.45, t => {
  const tg = [80, 38, 3]; const cam = new Cam(orbit(tg, kf(t, [[247.71, -110], [251.45, -85, sine]]), kf(t, [[247.71, 40], [251.45, 22]]), kf(t, [[247.71, 130], [251.45, 95]])), tg, 42);
  const S = new Scene(cam, Math.floor(t * 12)); worldMap(S, { bbox: [20, 0, 150, 70], land: '#161C23', hi: { 364: '#3B1416', 643: '#1B2A3D', 586: '#1B2A3D', 356: '#1B2A3D', 156: '#1B2A3D', 158: '#1B2A3D', 392: '#1B2A3D' } });
  [[LL.natanz, 247.9, 'IRAN', C.amber, ['iran']], [LL.moscow, 248.6, '1 · RUSSIA', '#E8E3D8', ['russia']], [LL.islamabad, 249.2, '2 · SOUTH ASIA', '#E8E3D8', ['india', 'pakistan']], [LL.taipei, 249.8, '3 · EAST ASIA', '#E8E3D8', ['china', 'taiwan']]].forEach(([ll, t0, lab, col, fl], i) => { const h = 13 * cl(spring(t, t0, 0.5), 0, 1.1); if (h < 0.05) return; S.group([ll[0], ll[1], h / 2], () => domino(S, ll, h, col)); S.at([ll[0], ll[1], h + 3], (x, y) => fl.map((f, j) => flagSVG(f, x - fl.length * 27 + j * 54 + 2, y - 58, 50, 33)).join('') + MONO(x, y, lab, { size: 18, w: 700, a: 'middle', fill: i ? C.text : C.amber, ls: 3, op: cl(pr(t, t0, t0 + 0.3)) }), { z: -5 }); });
  return BG + S.out() + words(t, ['A', 'MAP', 'OF', 'THE', 'DOMINOES'], 110, 150, 52, 900, 248.4, 0.15, { keep: [4] });
});

export function frame(t) { const sh = shots.find(s => t >= s.t0 && t < s.t1) || shots[shots.length - 1]; return frameSVG(t, sh.fn(t)); }
cli(frame, 145.05, 'a3');
