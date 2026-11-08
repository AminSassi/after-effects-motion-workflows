// ACT 4 — VO 251.45 → 359.45 (three dominoes: Russia, South Asia, East Asia; wobble; like CTA)
import * as L from './lib3d.mjs';
const { C, cl, pr, lerp, L3, expo, expoIn, inOut, sine, spring, rnd, kf, TXT, MONO, words, Cam, Scene, orbit, box, cyl, worldMap, arc3, marker, LL, frameSVG, cli, rotAxis, add, sub, mul, PH, tornCard2D, noteDrop, paperNote, quad, shock, missile, flyArc, network, chapter, lower, fmt, tw, flagSVG, faceSVG, sharedBorder } = L;
const BG = `<rect width="100%" height="100%" fill="url(#sky)"/>`;
const floor = (S, z = 0, ext = 60, st = 6) => { for (let i = -ext; i <= ext; i += st) { S.line([[i, -ext, z], [i, ext, z]], '#151A21', { sw: 1, z: 1e5 }); S.line([[-ext, i, z], [ext, i, z]], '#151A21', { sw: 1, z: 1e5 }); } };
const shots = []; const add2 = (t0, t1, fn) => shots.push({ t0, t1, fn });
const LX = { ...LL, nurkhan: [73.099, 33.616], lahore: [74.34, 31.55], seoul: [126.98, 37.57], pyongyang: [125.75, 39.03], guam: [144.79, 13.44], govA: [10, 50], govB: [35, 32] };
const P3 = (ll, z = 0) => [ll[0], ll[1], z];
const dash = (S, a, b, h, col, k, o = {}) => { const pts = arc3(a, b, h, 40); const n = Math.round(cl(k) * 40); for (let i = 0; i < n; i += 2) S.line([pts[i], pts[Math.min(i + 1, n)]], col, { sw: o.sw || 2.5, op: o.op ?? 1, z: -1 }); };
function domino(S, base, h, col, o = {}) { const w = 3.2, d = 1.3; box(S, [base[0] - w / 2, base[1] - d / 2, 0], [w, d, h], col, { tilt: o.tilt ? { axis: [1, 0, 0], a: o.tilt, pivot: [base[0], base[1] + d / 2, 0] } : null, stroke: o.stroke, sw: 1 }); }
// domino map — camera dives toward the active domino
const DOM = [[LL.natanz, 'IRAN', ['iran']], [LL.moscow, '1 · RUSSIA', ['russia']], [LL.islamabad, '2 · SOUTH ASIA', ['india', 'pakistan']], [LL.taipei, '3 · EAST ASIA', ['china', 'taiwan']]];
function dominoMap(t, t0, t1, idx) {
  const f = DOM[idx][0]; const k = inOut(pr(t, t0, t1));
  const tg = L3([80, 38, 3], [f[0], f[1], 4], k); const cam = new Cam(orbit(tg, lerp(-95, -88, k), lerp(32, 48, k), lerp(115, 50, k)), tg, 42);
  const S = new Scene(cam, Math.floor(t * 12)); worldMap(S, { bbox: [10, 0, 160, 72], land: '#161C23', hi: { 364: '#3B1416', [[0, 643, 586, 158][idx]]: '#3B2A10', ...(idx === 2 ? { 356: '#3B2A10' } : {}) } });
  DOM.forEach(([ll, lab, fl], i) => { const act = i === idx; S.group([ll[0], ll[1], 4.5], () => domino(S, ll, 9, act ? C.amber : i === 0 ? '#7A3A3C' : '#B9B4AA', { tilt: act ? Math.sin((t - t0) * 9) * 0.06 * Math.exp(-(t - t0) * 0.8) : 0 }));
    S.at([ll[0], ll[1], 11.5], (x, y) => { const fw = act ? 60 : 40, fh = fw * 2 / 3; return fl.map((f, j) => flagSVG(f, x - fl.length * (fw + 6) / 2 + j * (fw + 6), y - fh - (act ? 30 : 22), fw, fh)).join('') + MONO(x, y, lab, { size: act ? 24 : 16, w: 700, a: 'middle', fill: act ? C.amber : C.sub, ls: 3 }); }, { z: -5 }); });
  return S;
}
// D1 251.45–253.09 domino 1
add2(251.45, 253.09, t => { const S = dominoMap(t, 251.45, 253.09, 1); return BG + S.out() + words(t, ['THE', 'FIRST', 'DOMINO'], 110, 150, 52, 900, 251.5, 0.15, { keep: [1], keepCol: C.amber }); });
// D2 253.09–261.41 the claim: Moscow → two governments → Ukraine (dashed, fades)
add2(253.09, 261.41, t => {
  const tg = [30, 46, 0]; const cam = new Cam(orbit(tg, kf(t, [[253.09, -100], [261.41, -82, sine]]), kf(t, [[253.09, 50], [261.41, 42]]), kf(t, [[253.09, 70], [261.41, 58]])), tg, 40);
  const S = new Scene(cam, Math.floor(t * 12)); worldMap(S, { bbox: [-10, 25, 60, 70], land: '#161C23', hi: { 643: '#3B2A10', 804: '#1B2A3D', 364: '#3B1416' } });
  const gone = pr(t, 261.0, 261.4); const col = t > 261.41 - 0.4 ? '#5B6573' : C.amber;
  marker(S, P3(LL.moscow), C.amber, t, 253.3, 'MOSCOW', { fs: 26, flag: 'russia' });
  [[LX.govA, 255.2, 'GOVERNMENT A'], [LX.govB, 255.7, 'GOVERNMENT B']].forEach(([g, t0, lab]) => { dash(S, P3(LL.moscow), P3(g), 6, col, expo(pr(t, t0, t0 + 0.9)), { op: 1 - gone * 0.6 }); if (t > t0 + 0.7) S.at(P3(g), (x, y) => `<rect x="${x - 70}" y="${y - 20}" width="140" height="40" rx="6" fill="#12161C" stroke="${C.sub}" stroke-width="1.5"/>` + MONO(x, y + 6, lab, { size: 14, a: 'middle', fill: C.sub, ls: 2 }), { z: -40 }); });
  if (t > 258.9) dash(S, P3(LL.moscow), P3(LL.kyiv), 4, col === C.amber ? C.red : col, expo(pr(t, 258.9, 259.9)), { sw: 3.5 });
  if (t > 259.6) marker(S, P3(LL.kyiv), C.blue, t, 259.6, 'UKRAINE', { fs: 24, left: true, flag: 'ukraine' });
  let s = BG + S.out();
  s += lower(t, 253.2, 260.6, 'Tucker Carlson', 'COMMENTATOR · CLAIM MADE ON HIS SHOW', { face: 'carlson', flag: 'usa', credit: 'PHOTO: GAGE SKIDMORE · CC BY-SA 2.0' });
  s += words(t, ['A', 'CLAIM:', 'STRIKE', 'IRAN', '→', 'NUCLEAR', 'USE', 'IN', 'UKRAINE'], 110, 150, 40, 800, 256.5, 0.18, { keep: [5, 6], keepCol: C.red });
  if (t > 261.0) { const k = expo(pr(t, 261.0, 261.4)); s += `<g opacity="${k}"><rect x="110" y="180" width="${tw('CLAIM · NOT VERIFIED', 22, 400, 4) + 44}" height="44" rx="22" fill="none" stroke="${C.sub}" stroke-width="1.5"/>` + MONO(132, 210, 'CLAIM · NOT VERIFIED', { size: 22, ls: 4, fill: C.text }) + `</g>`; }
  return s;
});
// D3 261.41–265.85 documented rhetoric: documents fly in and stack
add2(261.41, 265.85, t => {
  const tg = [0, 0, 1]; const cam = new Cam(orbit(tg, kf(t, [[261.41, -110], [265.85, -80, sine]]), kf(t, [[261.41, 55], [265.85, 40]]), kf(t, [[261.41, 30], [265.85, 22]])), tg, 40);
  const S = new Scene(cam, Math.floor(t * 12)); floor(S, 0, 40, 4);
  const heads = ['TRANSCRIPT', 'STATEMENT', 'TELEGRAM POST', 'INTERVIEW', 'STATE MEDIA'];
  heads.forEach((h, i) => { const t0 = 261.6 + i * 0.35; const k = cl(spring(t, t0, 0.6), 0, 1.05); if (k <= 0) return; const z = 0.05 + i * 0.12 + (1 - k) * 12; const off = [Math.sin(i * 2.1) * 1.2, Math.cos(i * 1.7) * 0.9, z]; const rot = (rnd(i) - 0.5) * 0.5 + (1 - k) * 2;
    const c = [off[0], off[1], z]; const R = p => rotAxis(p, [0, 0, 1], rot, c);
    quad(S, R(add(c, [-4, 3, 0])), R(add(c, [4, 3, 0])), R(add(c, [-4, -3, 0])), 800, 600, `<rect width="800" height="600" fill="#EDE6D6"/><rect width="800" height="600" fill="none" stroke="#B8AE98" stroke-width="4"/><text x="50" y="90" fill="#7A1E22" font-family="DejaVu Sans Mono" font-size="34" letter-spacing="5">${h}</text>${[0, 1, 2, 3, 4, 5].map(j => `<rect x="50" y="${150 + j * 62}" width="${640 - rnd(i * 9 + j) * 260}" height="20" fill="#C9C0AC"/>`).join('')}`, { z: -i * 0.3 }); });
  return BG + S.out() + words(t, ['DOCUMENTED', 'RHETORIC'], 110, 150, 56, 900, 263.35, 0.3, { keep: [0], keepCol: C.blue }) + (t > 264.77 ? words(t, ['IS', 'ALARMING'], 110, 220, 56, 900, 264.77, 0.25, { keep: [1], keepCol: C.red }) : '');
});
// D4 265.85–274.27 Kremlin torn photo + Medvedev paraphrase note + correction strip
add2(265.85, 274.27, t => {
  let s = BG + `<rect width="100%" height="100%" fill="#0B0D11"/>`;
  s += tornCard2D(t, 265.9, PH('kremlin'), 1010, 170, 800, 540, { seed: 71, rot: 3, caption: 'THE KREMLIN · MOSCOW', credit: 'WIKIMEDIA COMMONS · CC BY-SA', push: 0.006 });
  s += noteDrop(t, 267.03, 110, 230, 860, 400, ['Other countries could give', 'Iran nuclear warheads.'], { head: '22 JUNE 2025 · PARAPHRASE', size: 50, lh: 76, seed: 72, rot: -2.5, foot: 'D. MEDVEDEV · AFTER THE US STRIKES' });
  if (t > 271.2) { const k = expo(pr(t, 271.2, 271.8)); s += `<g transform="translate(110 ${700}) rotate(-1.5)"><rect width="${860 * k}" height="78" fill="${C.amber}"/>` + `<g opacity="${cl(pr(t, 271.6, 271.9))}">` + TXT(30, 52, 'LATER CLARIFIED: RUSSIA WOULD NOT', { size: 34, w: 900, fill: '#15171B' }) + `</g></g>`; }
  s += lower(t, 266.4, 271.1, 'Dmitry Medvedev', 'DEPUTY CHAIR · RUSSIAN SECURITY COUNCIL', { face: 'medvedev', flag: 'russia', credit: 'PHOTO: KREMLIN.RU · CC BY 4.0' });
  return s;
});
// D5 274.27–279.81 largest arsenal: 3D stockpile bars (FAS 2025 est.)
const ST = [['RUSSIA', 5459, 'russia'], ['USA', 5177, 'usa'], ['CHINA', 600, 'china'], ['FRANCE', 290, 'france'], ['UK', 225, 'uk'], ['INDIA', 180, 'india'], ['PAKISTAN', 170, 'pakistan'], ['ISRAEL', 90, 'israel'], ['N. KOREA', 50, 'nkorea']];
add2(274.27, 279.81, t => {
  const tg = [6.5, 0, 3]; const cam = new Cam(orbit(tg, kf(t, [[274.27, -118], [279.81, -100, sine]]), kf(t, [[274.27, 24], [279.81, 18]]), kf(t, [[274.27, 36], [279.81, 32]])), tg, 40);
  const S = new Scene(cam, Math.floor(t * 12)); floor(S, 0, 40, 2);
  ST.forEach(([n, v, fl], i) => { const t0 = 274.6 + i * 0.12; const k = cl(spring(t, t0, 0.8), 0, 1.04); const h = Math.max(0.05, v / 5459 * 8 * k); const x = i * 2.2; S.group([x, 0, h / 2], () => box(S, [x - 0.7, -0.7, 0], [1.4, 1.4, h], i === 0 ? C.red : i === 1 ? C.blue : '#5B6573', {}));
    S.at([x, -1.6, 0], (px, py) => flagSVG(fl, px - 21, py + 30, 42, 28) + MONO(px, py + 18, n, { size: 14, a: 'middle', fill: C.sub, ls: 1 }), { z: -9 }); S.at([x, 0, h + 0.7], (px, py) => TXT(px, py, fmt(v * k), { size: i < 2 ? 30 : 20, w: 800, a: 'middle', op: cl(pr(t, t0 + 0.2, t0 + 0.5)) }), { z: -9 }); });
  let s = BG + S.out();
  s += words(t, ["EARTH'S", 'LARGEST', 'NUCLEAR', 'ARSENAL'], 110, 150, 48, 900, 274.9, 0.15, { keep: [1], keepCol: C.red }) + MONO(110, 196, 'ESTIMATED WARHEADS · FAS 2025', { size: 18, ls: 3, op: cl(pr(t, 275, 275.3)) });
  if (t > 278.15) s += `<g opacity="${expo(pr(t, 278.15, 278.5))}"><rect x="1150" y="140" width="660" height="80" rx="8" fill="#12161C" stroke="${C.red}" stroke-width="2"/>` + TXT(1480, 194, '“WASHINGTON WENT FIRST”', { size: 34, w: 900, a: 'middle', fill: C.red }) + `</g>`;
  return s;
});
// D6 279.81–283.53 v2 (Amin: toy rocket "silly", missile bottom vanished on zoom) — the real thing: RS-24 Yars launcher photo, cold grade, slow steady push; counter stays 0
add2(279.81, 283.53, t => {
  const k = (t - 279.81) / 3.72; const sc = 1.04 + 0.05 * sine(k), dx = -30 * sine(k);
  let s = `<rect width="100%" height="100%" fill="#07090C"/><defs><filter id="yg"><feColorMatrix type="matrix" values="0.55 0.3 0.1 0 0  0.25 0.55 0.15 0 0  0.25 0.3 0.45 0 0  0 0 0 1 0"/><feComponentTransfer><feFuncR type="linear" slope="0.8" intercept="-0.02"/><feFuncG type="linear" slope="0.82" intercept="-0.02"/><feFuncB type="linear" slope="0.9" intercept="0"/></feComponentTransfer></filter>`
    + `<linearGradient id="yfade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#07090C" stop-opacity="0.92"/><stop offset="0.42" stop-color="#07090C" stop-opacity="0.15"/><stop offset="1" stop-color="#07090C" stop-opacity="0.35"/></linearGradient><linearGradient id="yfadeV" x1="0" y1="0" x2="0" y2="1"><stop offset="0.6" stop-color="#07090C" stop-opacity="0"/><stop offset="1" stop-color="#07090C" stop-opacity="0.85"/></linearGradient></defs>`;
  s += `<g opacity="${cl(pr(t, 279.81, 280.1))}" transform="translate(960 540) scale(${sc}) translate(${-960 + dx} -540)"><image href="${PH('yars')}" x="0" y="-40" width="1920" height="1280" preserveAspectRatio="xMidYMid slice" filter="url(#yg)"/></g>`;
  s += `<rect width="100%" height="100%" fill="url(#yfade)"/><rect width="100%" height="100%" fill="url(#yfadeV)"/>`;
  if (t > 280.9) { const lk = expo(pr(t, 280.9, 281.4)); s += `<g opacity="${lk}"><line x1="760" y1="420" x2="${760 - 140 * lk}" y2="330" stroke="${C.text}" stroke-width="2"/><circle cx="760" cy="420" r="7" fill="${C.red}"/>` + flagSVG('russia', 470, 252, 60, 40) + TXT(546, 285, 'RS-24 YARS', { size: 34, w: 900 }) + MONO(472, 318, 'ROAD-MOBILE NUCLEAR ICBM', { size: 15, ls: 3, fill: C.sub }) + `</g>`; }
  s += `<g transform="translate(1390 640)"><rect x="0" y="0" width="420" height="200" rx="10" fill="#0E1116" fill-opacity="0.85" stroke="#2A313B" stroke-width="2"/>` + MONO(30, 50, 'MISSILES LAUNCHED', { size: 18, ls: 4 }) + TXT(30, 160, '0', { size: 110, w: 900, fill: C.text }) + `<circle cx="380" cy="40" r="7" fill="${Math.floor(t * 2) % 2 ? C.red : '#3A1416'}"/></g>`;
  s += words(t, ['NO', 'MISSILE', 'NEEDED'], 110, 150, 56, 900, 280.2, 0.25, { keep: [0], keepCol: C.blue });
  s += MONO(1860, 1040, 'PHOTO: DMITRIY FOMIN · CC BY 2.0', { size: 12, a: 'end', fill: '#6B7684' });
  return s;
});
// D7 283.53–286.73 rewrite global rules: book page, rule struck and rewritten
// D7 v2 (Amin: paper rulebook "bad") — the unwritten rule carved in stone cracks; Moscow re-writes it in red
const CRACK = (() => { const pts = [[1180, 250]]; for (let i = 1; i <= 14; i++) pts.push([1180 - i * 52 + (rnd(i * 3.3) - 0.5) * 60, 250 + i * 46 + (rnd(i * 7.1) - 0.5) * 40]); return pts; })();
add2(283.53, 286.73, t => {
  const push = 1 + (t - 283.53) * 0.012; const ck = expo(pr(t, 284.5, 285.1)), wr = pr(t, 285.2, 286.3), shake = t > 284.5 && t < 284.8 ? Math.sin(t * 90) * 4 : 0;
  let s = BG + `<defs><linearGradient id="stn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5E636B"/><stop offset="1" stop-color="#34383E"/></linearGradient></defs>`;
  s += `<g transform="translate(${960 + shake} 560) scale(${push}) translate(-960 -560)">`;
  s += `<ellipse cx="960" cy="985" rx="520" ry="40" fill="#000" opacity="0.55"/><path d="M560 960 L560 330 Q560 170 960 170 Q1360 170 1360 330 L1360 960 Z" fill="url(#stn)" stroke="#6E747C" stroke-width="3"/>`;
  for (let i = 0; i < 160; i++) s += `<circle cx="${580 + rnd(i * 2.1) * 760}" cy="${200 + rnd(i * 4.7) * 740}" r="${1 + rnd(i) * 2.5}" fill="${rnd(i * 9) > 0.5 ? '#767C85' : '#2A2D32'}" opacity="0.5"/>`;
  const eng = (y, txt, size, op) => `<g opacity="${op}"><text x="960" y="${y + 3}" fill="#868C95" font-family="Inter" font-weight="900" font-size="${size}" text-anchor="middle" letter-spacing="4">${txt}</text><text x="960" y="${y}" fill="#1E2125" font-family="Inter" font-weight="900" font-size="${size}" text-anchor="middle" letter-spacing="4">${txt}</text></g>`;
  s += `<text x="960" y="290" fill="#1E2125" font-family="DejaVu Sans Mono" font-size="26" letter-spacing="8" text-anchor="middle">THE RULE · SINCE 1945</text>`;
  s += eng(470, 'NOBODY', 120, 1 - wr * 0.85) + eng(610, 'GOES FIRST.', 104, 1 - wr * 0.85);
  if (ck > 0) { const n = Math.max(2, Math.round(ck * CRACK.length)); const d = CRACK.slice(0, n).map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(0) + ' ' + p[1].toFixed(0)).join(' '); s += `<clipPath id="tabc"><path d="M560 960 L560 330 Q560 170 960 170 Q1360 170 1360 330 L1360 960 Z"/></clipPath><g clip-path="url(#tabc)"><path d="${d}" fill="none" stroke="#0B0C0E" stroke-width="7" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#8C929B" stroke-width="1.5" transform="translate(3 2)" opacity="0.6"/>`;
    for (let i = 2; i < n; i += 3) { const p = CRACK[i]; s += `<path d="M${p[0]} ${p[1]} l${(rnd(i) - 0.5) * 90} ${30 + rnd(i * 5) * 40}" stroke="#0B0C0E" stroke-width="3" fill="none"/>`; } s += `</g>`; }
  if (wr > 0) { const a = 'WASHINGTON'.slice(0, Math.ceil(pr(wr, 0, 0.55) * 10)), b = 'WENT FIRST.'.slice(0, Math.ceil(pr(wr, 0.5, 1) * 11)); s += `<text x="960" y="770" fill="${C.red}" font-family="Inter" font-weight="900" font-style="italic" font-size="78" text-anchor="middle" transform="rotate(-3 960 770)">${a}</text><text x="960" y="860" fill="${C.red}" font-family="Inter" font-weight="900" font-style="italic" font-size="78" text-anchor="middle" transform="rotate(-3 960 860)">${b}</text>`; }
  s += `</g>`;
  if (t > 285.2) { const k = cl(spring(t, 285.2, 0.5), 0, 1.1); s += `<g opacity="${cl(pr(t, 285.2, 285.4))}" transform="translate(${(1 - cl(k)) * 60} 0)"><rect x="1450" y="420" width="360" height="150" rx="14" fill="#0E1116" stroke="${C.red}" stroke-width="2"/>` + flagSVG('russia', 1480, 446, 84, 56) + MONO(1586, 470, "MOSCOW'S", { size: 16, ls: 3, fill: C.sub }) + TXT(1586, 504, 'NEW RULE', { size: 30, w: 900, fill: C.red }) + MONO(1480, 548, 'IF WASHINGTON STRIKES FIRST', { size: 13, ls: 2, fill: C.sub }) + `</g>`; }
  return s + words(t, ['REWRITE', 'THE', 'RULES'], 110, 150, 56, 900, 284.3, 0.2, { keep: [0], keepCol: C.red });
});
// (old paper-book version kept for reference, unused)
const rulebookUnused = (t => {
  const tg = [0, 0, 0]; const cam = new Cam(orbit(tg, kf(t, [[283.53, -96], [286.73, -86]]), kf(t, [[283.53, 62], [286.73, 54]]), kf(t, [[283.53, 24], [286.73, 19]])), tg, 40);
  const S = new Scene(cam, Math.floor(t * 12)); floor(S, 0, 40, 4);
  box(S, [-8.4, -5.4, 0], [16.8, 10.8, 0.6], '#3A1E1E', {});
  const strike = expo(pr(t, 284.6, 285.1)), hand = pr(t, 285.2, 286.2);
  const page = (x0, inner) => quad(S, [x0, 5, 0.62], [x0 + 8, 5, 0.62], [x0, -5, 0.62], 800, 1000, `<rect width="800" height="1000" fill="#EDE6D6"/>${inner}`, { z: -5 });
  page(-8.2, `<text x="60" y="110" fill="#7A1E22" font-family="DejaVu Sans Mono" font-size="30" letter-spacing="5">GLOBAL RULES</text><text x="60" y="230" fill="#15171B" font-family="Inter" font-weight="900" font-size="54">§1 NOBODY</text><text x="60" y="300" fill="#15171B" font-family="Inter" font-weight="900" font-size="54">GOES FIRST.</text><rect x="50" y="250" width="${560 * strike}" height="10" fill="${C.red}"/>${[0, 1, 2, 3, 4].map(j => `<rect x="60" y="${420 + j * 70}" width="${600 - j * 70}" height="20" fill="#C9C0AC"/>`).join('')}`);
  page(0.2, `<g opacity="${hand > 0 ? 1 : 0}"><text x="60" y="230" fill="${C.red}" font-family="Inter" font-weight="800" font-style="italic" font-size="58" clip-path="none">${'THEY WENT'.slice(0, Math.ceil(hand * 9))}</text><text x="60" y="310" fill="${C.red}" font-family="Inter" font-weight="800" font-style="italic" font-size="58">${hand > 0.6 ? 'FIRST.'.slice(0, Math.ceil((hand - 0.6) / 0.4 * 6)) : ''}</text></g>`);
  return BG + S.out() + words(t, ['REWRITE', 'THE', 'RULES'], 110, 150, 56, 900, 284.3, 0.2, { keep: [0], keepCol: C.red });
});
void rulebookUnused;
// D8 286.73–289.21 domino 2
add2(286.73, 289.21, t => { const S = dominoMap(t, 286.73, 289.21, 2); return BG + S.out() + words(t, ['THE', 'SECOND', 'DOMINO'], 110, 150, 52, 900, 286.8, 0.15, { keep: [1], keepCol: C.amber }); });
// South Asia map (hd)
function saScene(t, cam) { const S = new Scene(cam, Math.floor(t * 12)); worldMap(S, { hd: true, bbox: [60, 18, 85, 40], land: '#161C23', hi: { 356: '#1B2A3D', 586: '#2A2416' } }); return S; }
// D9 289.21–301.47 May 2025: strikes; Nur Khan, 10 km to Islamabad, near nuclear command
add2(289.21, 301.47, t => {
  const tg = L3([74, 30, 0], [73.07, 33.65, 0], inOut(pr(t, 293.6, 296.4))); const d = kf(t, [[289.21, 28], [293.6, 22], [296.4, 4.2, inOut], [301.47, 3.4]]);
  const cam = new Cam(orbit(tg, kf(t, [[289.21, -100], [301.47, -84]]), kf(t, [[289.21, 55], [301.47, 62]]), d), tg, 40);
  const S = saScene(t, cam);
  if (t < 296.5) [[[77.2, 28.6], [74.3, 31.5], 290.2], [[76.5, 30.5], [72.4, 32.1], 290.6], [[75.0, 32.7], [73.1, 33.6], 294.25], [[77.5, 29.0], [71.5, 30.2], 291.0]].forEach(([a, b, t0], i) => flyArc(S, P3(a), P3(b), 1.4, t, t0, 0.9, C.red, { len: 0.5, R: 0.8, fade: [1.2, 1.8] }));
  if (t > 295.2) marker(S, P3(LX.nurkhan), C.red, t, 295.2, 'NUR KHAN AIR BASE', { fs: 26, sub: 'RAWALPINDI', dy: 30, flag: 'pakistan' });
  if (t > 296.3) { const k = expo(pr(t, 296.3, 297.3)); const r = 0.09; const pts = []; for (let i = 0; i <= 60; i++) { const a = i / 60 * Math.PI * 2 * k; pts.push([LX.nurkhan[0] + Math.cos(a) * r, LX.nurkhan[1] + Math.sin(a) * r, 0.01]); } S.line(pts, C.amber, { sw: 2, z: -2 }); marker(S, P3(LL.islamabad), C.blue, t, 296.9, 'ISLAMABAD', { fs: 26, left: true, dy: -30 }); }
  let s = BG + S.out();
  s += words(t, ['MAY', '2025'], 110, 150, 56, 900, 289.3, 0.2, { keep: [1], keepCol: C.amber }) + MONO(110, 196, 'INDIA ↔ PAKISTAN · WORST FIGHTING IN DECADES', { size: 18, ls: 3, op: cl(pr(t, 290.9, 291.2)) });
  s += flagSVG('india', 110, 222, 60, 40, { op: cl(pr(t, 290.9, 291.2)) }) + flagSVG('pakistan', 182, 222, 60, 40, { op: cl(pr(t, 291.05, 291.35)) });
  if (t > 296.3) s += `<g opacity="${cl(pr(t, 296.3, 296.6))}"><rect x="1450" y="130" width="360" height="110" rx="8" fill="#0E1116" stroke="${C.amber}" stroke-width="2"/>` + TXT(1630, 196, `${Math.round(10 * expo(pr(t, 296.3, 297.3)))} km`, { size: 54, w: 900, a: 'middle', fill: C.amber }) + MONO(1630, 228, 'TO ISLAMABAD', { size: 15, a: 'middle', ls: 3 }) + `</g>`;
  if (t > 299.3) s += `<g opacity="${cl(pr(t, 299.3, 299.6))}"><rect x="1450" y="260" width="360" height="56" rx="28" fill="none" stroke="${C.red}" stroke-width="2"/>` + MONO(1630, 296, 'NEAR NUCLEAR COMMAND', { size: 17, a: 'middle', ls: 3, fill: C.red }) + `</g>`;
  return s;
});
// D10 301.47–307.59 command authority (reported), 8–12 minute flight
add2(301.47, 307.59, t => {
  const tg = [73.5, 31, 0]; const cam = new Cam(orbit(tg, kf(t, [[301.47, -92], [307.59, -84]]), kf(t, [[301.47, 50], [307.59, 44]]), kf(t, [[301.47, 20], [307.59, 17]])), tg, 40);
  const S = saScene(t, cam);
  flyArc(S, P3(LX.lahore), P3(LL.delhi), 4, t, 304.4, 2.6, C.red, { len: 0.8, impact: false });
  flyArc(S, P3(LL.delhi), P3(LL.islamabad), 4.5, t, 304.9, 2.6, C.red, { len: 0.8, impact: false });
  marker(S, P3(LL.islamabad), C.amber, t, 301.6, 'ISLAMABAD', { fs: 24, left: true, flag: 'pakistan' }); marker(S, P3(LL.delhi), C.blue, t, 301.8, 'NEW DELHI', { fs: 24, flag: 'india' });
  let s = BG + S.out();
  s += `<g opacity="${cl(pr(t, 301.6, 301.9))}"><rect x="110" y="120" width="${tw('NUCLEAR COMMAND AUTHORITY', 36, 900) + 160}" height="140" rx="10" fill="#0E1116" stroke="#2A313B" stroke-width="2"/>` + flagSVG('pakistan', 136, 150, 78, 52) + TXT(240, 178, 'NUCLEAR COMMAND AUTHORITY', { size: 36, w: 900 }) + MONO(240, 226, 'REPORTEDLY CONVENED · PAKISTAN DENIED IT', { size: 17, ls: 3, fill: C.amber }) + `</g>`;
  if (t > 304.27) { const m = lerp(0, 12, pr(t, 304.4, 307.4)); s += `<g opacity="${cl(pr(t, 304.27, 304.5))}"><rect x="1430" y="770" width="380" height="110" rx="8" fill="#0E1116" stroke="${C.red}" stroke-width="2"/>` + MONO(1460, 808, 'FLIGHT TIME', { size: 16, ls: 4 }) + TXT(1460, 862, `${String(Math.floor(m)).padStart(2, '0')}:${String(Math.floor((m % 1) * 60)).padStart(2, '0')}`, { size: 46, w: 900, fill: C.red }) + MONO(1780, 862, '8–12 MIN', { size: 18, a: 'end', fill: C.amber, ls: 2 }) + `</g>`; }
  return s;
});
// D11 307.59–318.89 ceasefire under US pressure; then the nuclear shadow
// D11 v2 (Amin: ceasefire "not explaining anything", circle went under the land)
// A: clashes across the REAL India–Pakistan border stop → Washington pressure arrows → ceasefire line traces the border
// B: "limited wars under the nuclear shadow": a mushroom-cloud shadow rises behind the map, small clashes flicker along the border under it
const IPB = (() => { const runs = sharedBorder(586, 356); return runs.length ? runs[0] : [[74.5, 37], [75.8, 28.5]]; })();
const IPBlen = IPB.length;
const borderAt = k => IPB[Math.min(IPBlen - 1, Math.max(0, Math.round(k * (IPBlen - 1))))];
// v3 (Amin: bomb shadow "looks like a picture, not alive") — rising stem, toroidal rolling cap, boiling edges (turbulence re-seeded per frame), ember glow at the base
function mushroom(cx, base, s, op, t, age) {
  const g = expo(cl(age / 1.8)), rise = (420 * g + 30 * age) * s; const capY = base - rise - 120 * g * s; const capR = (150 + 70 * g + 6 * age) * s;
  const seed = 5; // fixed: re-seeding per frame flickers; the rolling puffs carry the motion
  let d = `<defs><radialGradient id="mush" cx="50%" cy="35%" r="65%"><stop offset="0" stop-color="#5A2222"/><stop offset="0.55" stop-color="#2A1214"/><stop offset="1" stop-color="#07080A"/></radialGradient><radialGradient id="mushG" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#FF7A3D" stop-opacity="0.55"/><stop offset="1" stop-color="#FF7A3D" stop-opacity="0"/></radialGradient>`
    + `<filter id="mushB" x="-40%" y="-40%" width="180%" height="180%"><feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="3" seed="${seed}" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="${46 * s}" xChannelSelector="R" yChannelSelector="G" result="d"/><feGaussianBlur in="d" stdDeviation="${5 * s}"/></filter></defs>`;
  d += `<g opacity="${op}" filter="url(#mushB)" fill="url(#mush)">`;
  const sw = Math.sin(t * 1.3) * 8 * s;
  d += `<path d="M${cx - 70 * s} ${base} Q${cx - 30 * s + sw} ${base - rise * 0.55} ${cx - 55 * s + sw} ${capY + 40 * s} L${cx + 55 * s + sw} ${capY + 40 * s} Q${cx + 30 * s + sw} ${base - rise * 0.55} ${cx + 70 * s} ${base} Z"/>`;
  for (let i = 0; i < 16; i++) { const ph = i / 16 * Math.PI * 2 + t * 1.6; const ring = (i % 2 ? 1 : 0.82) * capR; const x = cx + sw + Math.cos(i * 2.39) * ring * 0.92; const y = capY + Math.sin(ph) * 46 * s - 30 * s; const r = (70 + 22 * Math.cos(ph)) * s * (0.8 + 0.2 * g);
    d += `<circle cx="${x}" cy="${y}" r="${r}"/>`; }
  d += `<ellipse cx="${cx + sw}" cy="${capY - 70 * s}" rx="${capR * 0.75}" ry="${95 * s}"/></g>`;
  d += `<ellipse cx="${cx + sw}" cy="${capY + 40 * s}" rx="${capR * 1.35 * (0.9 + 0.1 * g)}" ry="${30 * s}" fill="none" stroke="#C9B9B0" stroke-width="${3 * s}" opacity="${op * 0.25 * g}" filter="url(#mushB)"/>`;
  d += `<ellipse cx="${cx}" cy="${base}" rx="${260 * s}" ry="${60 * s}" fill="url(#mushG)" opacity="${op * (0.4 + 0.15 * Math.sin(t * 9))}"/>`;
  return d;
}
add2(307.59, 318.89, t => {
  const tg = [73.0, 30.6, 0]; const cam = new Cam(orbit(tg, kf(t, [[307.59, -92], [318.89, -86, sine]]), kf(t, [[307.59, 58], [318.89, 52]]), kf(t, [[307.59, 22], [318.89, 25]])), tg, 40);
  const sh = expo(pr(t, 313.0, 314.6)); // shadow phase
  let mush = ''; if (sh > 0) { const P = cam.p([...borderAt(0.5), 0]); mush = mushroom(P[0], P[1] + 30, 0.62, 0.85 * Math.min(1, sh * 1.4), t, t - 313.0); }
  const pre = BG;
  const S = new Scene(cam, Math.floor(t * 12)); worldMap(S, { hd: true, bbox: [60, 18, 85, 40], land: '#161C23', hi: { 356: '#1B2A3D', 586: '#2A2416' } });
  if (sh > 0) S.face([[50, 10, 0.01], [95, 10, 0.01], [95, 45, 0.01], [50, 45, 0.01]], '#000', { shade: false, op: 0.35 * sh, z: 1e5 });
  marker(S, P3(LL.islamabad), C.amber, t, 307.7, 'ISLAMABAD', { fs: 22, left: true, flag: 'pakistan' }); marker(S, P3(LL.delhi), C.blue, t, 307.8, 'NEW DELHI', { fs: 22, flag: 'india' });
  // A1: exchange of fire across the border (stops when the ceasefire draws)
  if (t < 309.6) for (let i = 0; i < 8; i++) { const t0 = 307.6 + i * 0.22; const b = borderAt(0.15 + rnd(i * 3) * 0.7); const dir = i % 2 ? 1 : -1; const a = [b[0] + dir * 1.6, b[1] + (rnd(i) - 0.5) * 1.2], c = [b[0] - dir * 1.4, b[1] + (rnd(i * 5) - 0.5) * 1.2]; flyArc(S, [a[0], a[1], 0.05], [c[0], c[1], 0.05], 0.7, t, t0, 0.55, i % 2 ? C.red : C.blue, { len: 0.35, R: 0.5, sw: 2, fade: [0.1, 0.5] }); }
  // A2: the ceasefire line = the actual border, drawn with a glow
  const lk = expo(pr(t, 308.4, 309.6)); if (lk > 0) { const pts = IPB.slice(0, Math.max(2, Math.round(lk * IPBlen))).map(p => [p[0], p[1], 0.05]); S.line(pts, '#F2F2F2', { sw: 9, op: 0.12 * (1 - 0.6 * sh), z: -3 }); S.line(pts, '#F2F2F2', { sw: 3, op: 1 - 0.5 * sh, z: -3.1 }); }
  // B: limited clashes along the border, under the shadow
  let s = pre + S.out() + mush;
  if (t > 315.2) for (let i = 0; i < 10; i++) { const t0 = 315.2 + i * 0.33; const b = borderAt(0.1 + rnd(i * 7.7) * 0.8); const ph = (t - t0) % 1.6; if (t > t0 && ph < 0.7) { const P = cam.p([b[0], b[1], 0.06]); s += `<circle cx="${P[0]}" cy="${P[1]}" r="${4 + ph * 26}" fill="none" stroke="${C.amber}" stroke-width="2" opacity="${1 - ph / 0.7}"/><circle cx="${P[0]}" cy="${P[1]}" r="5" fill="${C.amber}" opacity="${1 - ph / 0.7}"/>`; } }
  if (t > 315.4) { const P = cam.p([...borderAt(0.8), 0]); s += `<g opacity="${cl(pr(t, 315.4, 315.7))}">` + MONO(P[0] + 30, P[1] + 50, 'LIMITED CONVENTIONAL CLASHES', { size: 16, ls: 3, fill: C.amber }) + `</g>`; }
  // Washington pressure: flag card + arrows to both capitals
  if (t > 309.4 && sh < 1) { const k = cl(spring(t, 309.4, 0.5), 0, 1.1), op = cl(pr(t, 309.4, 309.7)) * (1 - sh); const I = cam.p(P3(LL.islamabad)), D = cam.p(P3(LL.delhi)); const cx = 960, cy = 205;
    const arr = (P, d) => { const ak = expo(pr(t, 309.7 + d, 310.5 + d)); const mx = (cx + P[0]) / 2 + (P[0] < cx ? -80 : 80), my = (cy + P[1]) / 2 - 40; const ex = lerp(cx, P[0], ak), ey = lerp(cy + 60, P[1] - 30, ak); return `<path d="M${cx} ${cy + 60} Q${mx} ${my} ${ex} ${ey}" fill="none" stroke="${C.blue}" stroke-width="4" stroke-dasharray="14 9" opacity="${ak}"/>` + (ak > 0.95 ? `<circle cx="${ex}" cy="${ey}" r="9" fill="${C.blue}"/>` : ''); };
    s += `<g opacity="${op}">` + arr(I, 0) + arr(D, 0.2) + `<g transform="translate(${cx} ${cy}) scale(${0.9 + 0.1 * cl(k)})"><rect x="-190" y="-56" width="380" height="112" rx="14" fill="#0E1116" stroke="${C.blue}" stroke-width="2"/>` + flagSVG('usa', -170, -32, 90, 60) + TXT(-62, -2, 'WASHINGTON', { size: 30, w: 900 }) + MONO(-60, 30, 'HEAVY PRESSURE', { size: 16, ls: 3, fill: C.blue }) + `</g></g>`; }
  if (t > 309.7 && sh < 1) { const P = cam.p([...borderAt(0.55), 0]); s += `<g opacity="${cl(pr(t, 309.7, 310.0)) * (1 - sh)}"><rect x="${P[0] + 24}" y="${P[1] - 24}" width="300" height="48" rx="24" fill="#0E1116" stroke="#F2F2F2" stroke-width="2"/>` + MONO(P[0] + 174, P[1] + 7, 'CEASEFIRE · MAY 2025', { size: 17, a: 'middle', ls: 3, fill: C.text }) + `</g>`; }
  if (t > 311.0 && sh < 1) s += `<g opacity="${cl(pr(t, 311.0, 311.3)) * (1 - sh)}"><rect x="110" y="230" width="${tw('DRIVEN BY FEAR OF ESCALATION', 18, 400, 3) + 48}" height="52" rx="26" fill="none" stroke="${C.amber}" stroke-width="2"/>` + MONO(134, 263, 'DRIVEN BY FEAR OF ESCALATION', { size: 18, ls: 3, fill: C.amber }) + `</g>`;
  s += words(t, ['CEASEFIRE'], 110, 150, 56, 900, 307.7, 0, {}) + MONO(110, 196, 'AFTER HEAVY US PRESSURE', { size: 18, ls: 3, fill: C.blue, op: cl(pr(t, 309.4, 309.7)) * (1 - sh) });
  if (t > 313.05) s += `<g opacity="${cl(pr(t, 313.05, 313.4))}">` + TXT(1810, 150, 'LIMITED WARS', { size: 44, w: 900, a: 'end' }) + TXT(1810, 205, 'UNDER THE NUCLEAR SHADOW', { size: 30, w: 800, a: 'end', fill: C.amber }) + MONO(1810, 240, 'ANALYSTS WARN', { size: 16, a: 'end', ls: 3 }) + `</g>`;
  if (t > 314.4) [['india', 'INDIA', '≈180'], ['pakistan', 'PAKISTAN', '≈170']].forEach(([f, n, v], i) => { const t0 = 314.4 + i * 0.3; if (t < t0) return; const k = cl(spring(t, t0, 0.5), 0, 1.1); const x = 1430, y = 760 + i * 110; s += `<g opacity="${cl(pr(t, t0, t0 + 0.2))}" transform="translate(${(1 - cl(k)) * 50} 0)"><rect x="${x}" y="${y}" width="380" height="90" rx="12" fill="#0E1116" stroke="#2A313B" stroke-width="2"/>` + flagSVG(f, x + 20, y + 22, 66, 44) + MONO(x + 104, y + 38, n, { size: 15, ls: 3, fill: C.sub }) + TXT(x + 104, y + 74, `${v} WARHEADS`, { size: 28, w: 900, fill: C.red }) + `</g>`; });
  if (t > 315.0) s += MONO(1810, 990, 'ESTIMATES · FAS 2025', { size: 12, a: 'end', ls: 2, fill: '#4A5563', op: cl(pr(t, 315, 315.3)) });
  return s;
});
// (old version kept for reference, unused)
const ceasefireUnused = (t => {
  const tg = [73.5, 31, 0]; const cam = new Cam(orbit(tg, kf(t, [[307.59, -84], [318.89, -100, sine]]), kf(t, [[307.59, 44], [318.89, 36]]), kf(t, [[307.59, 18], [318.89, 22]])), tg, 40);
  const S = saScene(t, cam);
  const lk = expo(pr(t, 307.8, 308.8)); const pts = []; for (let i = 0; i <= 40; i++) { const k = i / 40; pts.push([lerp(70.5, 75.8, k), lerp(37, 28.5, k) + Math.sin(k * 12 + t * 3) * 0.08 * (t < 313 ? 1 : 0.3), 0.3]); } S.line(pts.slice(0, Math.round(lk * 40) + 1), C.text, { sw: 3, z: -3 });
  if (t > 309.4 && t < 313.5) for (let i = 0; i < 3; i++) { const k = expo(pr(t, 309.5 + i * 0.25, 310.4 + i * 0.25)); const a = [72 + i * 1.6, 40, 6], b = [72 + i * 1.6, 34, 1.5]; S.line([a, L3(a, b, k)], C.blue, { sw: 3, op: 1 - pr(t, 312.8, 313.5), z: -4 }); }
  if (t > 313) { const k = expo(pr(t, 313.2, 315)); const R = 7 * k; const ring = []; for (let i = 0; i <= 48; i++) { const a = i / 48 * Math.PI * 2; ring.push([73.5 + Math.cos(a) * R, 31 + Math.sin(a) * R * 0.85, 0.2]); } S.face(ring, '#000', { shade: false, op: 0.55, z: -1 }); S.line(ring, '#3A4350', { sw: 1.5, z: -1.5 });
    if (t > 315.4) for (let i = 0; i < 6; i++) { const t0 = 315.4 + i * 0.45; const a = [71 + rnd(i) * 5, 29 + rnd(i * 3) * 4], b = [71 + rnd(i * 7) * 5, 29 + rnd(i * 5) * 4]; flyArc(S, P3(a), P3(b), 0.6, t, t0, 0.6, C.amber, { head: false, R: 0.5, sw: 2 }); } }
  let s = BG + S.out();
  s += words(t, ['CEASEFIRE'], 110, 150, 56, 900, 307.7, 0, {}) + MONO(110, 196, 'AFTER HEAVY US PRESSURE', { size: 18, ls: 3, fill: C.blue, op: cl(pr(t, 309.4, 309.7)) });
  if (t > 313.05) s += `<g opacity="${cl(pr(t, 313.05, 313.4))}">` + TXT(1810, 150, 'LIMITED WARS', { size: 44, w: 900, a: 'end' }) + TXT(1810, 205, 'UNDER THE NUCLEAR SHADOW', { size: 30, w: 800, a: 'end', fill: C.amber }) + MONO(1810, 240, 'ANALYSTS WARN', { size: 16, a: 'end', ls: 3 }) + `</g>`;
  return s;
});
void ceasefireUnused;
// D12 318.89–321.89 v2 (Amin: blue cube "silly") — world map: a strike arc leaves Washington toward Iran and halts at a glowing red wall, THE LINE (no nuclear use since 1945)
add2(318.89, 321.89, t => {
  const tg = [-12, 33, 0]; const cam = new Cam(orbit(tg, kf(t, [[318.89, -100], [321.89, -94, sine]]), kf(t, [[318.89, 62], [321.89, 58]]), kf(t, [[318.89, 168], [321.89, 156, sine]])), tg, 40);
  const G = new Scene(cam, 0), S = new Scene(cam, Math.floor(t * 12));
  worldMap(G, { bbox: [-110, 0, 75, 65], land: '#161C23', hi: { 840: '#1B2A3D', 364: '#3B1416' } });
  marker(S, P3(LL.washington, 0.3), C.blue, t, 318.95, 'WASHINGTON', { fs: 26, flag: 'usa', left: true });
  marker(S, P3(LL.tehran, 0.3), C.red, t, 319.1, 'TEHRAN', { fs: 26, flag: 'iran' });
  // THE LINE: glowing red barrier across the Atlantic at 30°W (ground stripe + low translucent wall + bright top edge)
  const WX = -30, Y0 = 8, Y1 = 58, wk = expo(pr(t, 319.2, 319.8)), H = 4 * wk, pulse = t > 320.75 ? Math.exp(-(t - 320.75) * 3) : 0;
  const ym = Y0 + (Y1 - Y0) * wk;
  G.face([[WX - 1.6, Y0, 0.02], [WX + 1.6, Y0, 0.02], [WX + 1.6, ym, 0.02], [WX - 1.6, ym, 0.02]], C.red, { shade: false, op: 0.12 + 0.2 * pulse });
  for (let i = 0; i < 14; i++) { const y0 = Y0 + i * (Y1 - Y0) / 14, y1 = y0 + (Y1 - Y0) / 14; if (y0 > ym) break; S.face([[WX, y0, 0.05], [WX, Math.min(y1, ym), 0.05], [WX, Math.min(y1, ym), H], [WX, y0, H]], C.red, { shade: false, op: 0.22 + 0.3 * pulse, z: 0, cull: false }); }
  S.line([[WX, Y0, H], [WX, ym, H]], '#FF8A8D', { sw: 3 + 5 * pulse, z: -1 }); S.line([[WX, Y0, 0.05], [WX, ym, 0.05]], C.red, { sw: 4, z: -1 });
  if (t > 319.5) S.at([WX, Y0 - 1.5, 0], (x, y) => `<g opacity="${cl(pr(t, 319.5, 319.8))}">` + TXT(x, y + 34, 'THE LINE', { size: 30, w: 900, a: 'middle', fill: '#FF6B6F', ls: 4 }) + MONO(x, y + 62, 'NO NUCLEAR USE SINCE 1945', { size: 16, a: 'middle', ls: 3, fill: '#FF8A8D' }) + `</g>`, { z: -60 });
  // strike arc from Washington: grows and halts right at the barrier
  const pts = arc3(P3(LL.washington, 0.3), P3(LL.tehran, 0.3), 22, 80); const stop = pts.findIndex(p => p[0] >= WX - 0.6);
  const ak = expo(pr(t, 319.6, 320.75)); const n = Math.max(2, Math.round(ak * stop));
  if (t > 319.6) { const seg = pts.slice(0, n); S.line(seg, C.blue, { sw: 12, op: 0.15, z: -2 }); S.line(seg, '#8FB3FF', { sw: 4, z: -2.1 });
    const hd = seg[seg.length - 1]; S.at(hd, (x, y) => `<circle cx="${x}" cy="${y}" r="${9 + 5 * pulse + Math.sin(t * 14) * 1.5}" fill="#DCE7FF"/><circle cx="${x}" cy="${y}" r="${22 + 34 * pulse}" fill="none" stroke="#FF8A8D" stroke-width="2" opacity="${0.3 + 0.6 * pulse}"/>`, { z: -70 });
    // ghost of the rest of the path (where it would go if it crossed)
    if (t > 320.75) { const rest = pts.slice(stop); for (let i = 0; i < rest.length - 1; i += 3) S.line([rest[i], rest[Math.min(i + 1, rest.length - 1)]], '#8FB3FF', { sw: 2, op: 0.35 * cl(pr(t, 320.8, 321.2)), z: -2 }); } }
  return BG + G.out() + S.out() + words(t, ['WHAT', 'IF', 'WASHINGTON', 'CROSSES', 'FIRST?'], 110, 150, 52, 900, 319.0, 0.15, { keep: [3], keepCol: C.red });
});
// D13 321.89–324.13 domino 3
add2(321.89, 324.13, t => { const S = dominoMap(t, 321.89, 324.13, 3); return BG + S.out() + words(t, ['THE', 'THIRD', 'DOMINO'], 110, 150, 52, 900, 321.95, 0.15, { keep: [1], keepCol: C.amber }); });
// East Asia
function eaScene(t, cam, hi = {}) { const S = new Scene(cam, Math.floor(t * 12)); worldMap(S, { hd: true, bbox: [105, 15, 150, 46], land: '#161C23', hi: { 156: '#2A1A1A', 158: '#1B2A3D', 392: '#1B2A3D', 410: '#1B2A3D', ...hi } }); return S; }
// D14 324.13–331.11 Taiwan Strait crises; 1950s readiness gauge
add2(324.13, 331.11, t => {
  const tg = [120.5, 25, 0]; const cam = new Cam(orbit(tg, kf(t, [[324.13, -100], [331.11, -80, sine]]), kf(t, [[324.13, 50], [331.11, 44]]), kf(t, [[324.13, 26], [331.11, 18]])), tg, 40);
  const S = eaScene(t, cam);
  marker(S, P3(LL.taipei), C.blue, t, 324.4, 'TAIWAN', { fs: 26, flag: 'taiwan' }); marker(S, P3([118.3, 24.45]), C.red, t, 325.3, 'STRAIT', { fs: 22, left: true, sub: '1954–55 · 1958 CRISES' });
  let s = BG + S.out();
  s += tornCard2D(t, 324.3, PH('taiwan_strait'), 1180, 140, 620, 400, { seed: 81, rot: 2.5, caption: 'TAIWAN STRAIT', credit: 'WIKIMEDIA COMMONS', t1: 327.2 });
  if (t > 327.35) { const lv = Math.round(5 - 3 * expo(pr(t, 329.0, 330.2))); s += `<g transform="translate(1240 180)" opacity="${cl(pr(t, 327.35, 327.7))}">` + MONO(0, 0, 'NUCLEAR READINESS · 1950s', { size: 18, ls: 3 }) + [5, 4, 3, 2, 1].map((n, i) => { const on = n >= lv; return `<rect x="${i * 112}" y="24" width="100" height="${120 + i * 40}" transform="translate(0 ${160 - i * 40})" rx="6" fill="${on ? (n <= 2 ? C.red : C.amber) : '#1B2027'}"/>`; }).join('') + MONO(0, 380, 'RAISED · ILLUSTRATIVE SCALE', { size: 14, ls: 2, fill: '#5C7C99' }) + `</g>`; }
  s += words(t, ['NUCLEAR', 'CRISES', 'BEFORE'], 110, 150, 52, 900, 325.2, 0.2, { keep: [0], keepCol: C.red });
  return s;
});
// D15 331.11–338.13 Eisenhower paraphrase note
add2(331.11, 338.13, t => {
  let s = BG + `<rect width="100%" height="100%" fill="#0B0D11"/>`;
  s += noteDrop(t, 331.2, 170, 210, 1000, 420, ['Using nuclear weapons crosses', 'a completely different line.'], { head: 'PRIVATELY · 1950s · PARAPHRASE', size: 52, lh: 80, seed: 91, rot: -2, foot: 'PRESIDENT DWIGHT D. EISENHOWER' });
  s += lower(t, 331.4, 337.8, 'Dwight D. Eisenhower', 'PRESIDENT OF THE UNITED STATES · 1953–61', { face: 'eisenhower', flag: 'usa', credit: 'PHOTO: WHITE HOUSE · PD' });
  return s;
});
// D16 338.13–345.29 the umbrella: dome over allies flickers; everyone recalculates
add2(338.13, 345.29, t => {
  const tg = [128, 31, 2]; const cam = new Cam(orbit(tg, kf(t, [[338.13, -100], [345.29, -76, sine]]), kf(t, [[338.13, 34], [345.29, 28]]), kf(t, [[338.13, 52], [345.29, 46]])), tg, 40);
  const S = eaScene(t, cam);
  [[LL.beijing, 'CHINA', C.red, 339.2, 'china'], [LL.taipei, 'TAIWAN', C.blue, 339.5, 'taiwan'], [LL.tokyo, 'JAPAN', C.blue, 340.0, 'japan'], [LX.seoul, 'S. KOREA', C.blue, 341.5, 'skorea']].forEach(([ll, n, c, t0, f]) => marker(S, P3(ll), c, t, t0, n, { fs: 22, flag: f }));
  if (t > 341.6) { const k = expo(pr(t, 341.6, 342.8)); const fl = t > 343.3 ? (Math.floor(t * 14) % 3 ? 0.35 : 0.08) : 0.22; const c = [131, 30, 0], R = 10 * k;
    for (let j = 0; j < 6; j++) { const e0 = j / 6 * Math.PI / 2, e1 = (j + 1) / 6 * Math.PI / 2; for (let i = 0; i < 18; i++) { const a0 = i / 18 * Math.PI * 2, a1 = (i + 1) / 18 * Math.PI * 2; const P = (a, e) => [c[0] + Math.cos(a) * Math.cos(e) * R, c[1] + Math.sin(a) * Math.cos(e) * R, Math.sin(e) * R * 0.7]; S.face([P(a0, e0), P(a1, e0), P(a1, e1), P(a0, e1)], '#5B8DEF', { shade: false, op: fl * 0.4, stroke: '#9FB7E8', sw: 0.5, z: -6 }); } } }
  let s = BG + S.out();
  if (t > 341.57) s += MONO(110, 196, 'THE AMERICAN UMBRELLA', { size: 20, ls: 4, fill: C.blue, op: cl(pr(t, 341.6, 341.9)) });
  s += words(t, ['EVERYONE', 'RECALCULATES'], 110, 150, 56, 900, 338.3, 0.25, { keep: [1], keepCol: C.amber });
  if (t > 342.85) s += `<g opacity="${cl(pr(t, 342.85, 343.1))}"><rect x="1550" y="130" width="260" height="56" rx="28" fill="none" stroke="${C.amber}" stroke-width="2"/>` + MONO(1680, 166, 'OVERNIGHT', { size: 20, a: 'middle', ls: 4, fill: C.amber }) + `</g>`;
  return s;
});
// D17 345.29–350.95 the danger of dominoes: only one must wobble
add2(345.29, 350.95, t => {
  const tg = [6, 0, 2.5]; const cam = new Cam(orbit(tg, kf(t, [[345.29, -140], [350.95, -112, sine]]), kf(t, [[345.29, 16], [350.95, 12]]), kf(t, [[345.29, 30], [350.95, 22]])), tg, 40);
  const S = new Scene(cam, Math.floor(t * 12)); floor(S, 0, 40, 3);
  for (let i = 0; i < 9; i++) { const x = i * 2.4; const wob = i === 0 && t > 349.15 ? Math.sin((t - 349.15) * 10) * 0.14 * (1 - 0.3 * pr(t, 349.15, 350.9)) : 0; S.group([x, 0, 2.5], () => box(S, [x - 0.3, -1.4, 0], [0.6, 2.8, 5], i === 0 ? C.amber : '#B9B4AA', { tilt: wob ? { axis: [0, 1, 0], a: wob, pivot: [x + 0.3, 0, 0] } : null, stroke: '#2A2F37', sw: 1 })); }
  let s = BG + S.out();
  s += words(t, ['THEY', "DON'T", 'ALL', 'NEED', 'TO', 'FALL'], 110, 150, 48, 900, 346.6, 0.15, { keep: [1], keepCol: C.blue });
  if (t > 349.15) s += words(t, ['ONLY', 'ONE', 'MUST', 'WOBBLE'], 110, 220, 56, 900, 349.15, 0.2, { keep: [3], keepCol: C.amber });
  return s;
});
// D18 350.95–359.45 like CTA + the question
add2(350.95, 359.45, t => {
  let s = BG; const k = cl(spring(t, 351.2, 0.6), 0, 1.1);
  const tap = t > 354.0 ? cl(spring(t, 354.0, 0.45), 0, 1.2) : 0; const liked = t > 354.0;
  s += `<g opacity="${cl(pr(t, 351.0, 351.3)) * (1 - pr(t, 355.7, 356))}" transform="translate(960 420) scale(${k * (1 + 0.15 * Math.sin(tap * Math.PI))}) rotate(${liked ? -10 * Math.sin(tap * Math.PI) : 0})"><circle r="150" fill="${liked ? C.blue : '#1B2027'}"/><path d="M-60 10 h34 v86 h-34 z M-16 96 h86 q20 0 24-20 l18-62 q6-24-18-24 h-58 l10-44 q4-26-20-30 l-12 0 l-30 70 z" fill="${C.text}"/></g>`;
  if (liked) for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2, r = 160 + expo(pr(t, 354, 354.8)) * 120; s += `<circle cx="${960 + Math.cos(a) * r}" cy="${420 + Math.sin(a) * r}" r="6" fill="${i % 2 ? C.amber : C.blue}" opacity="${1 - pr(t, 354.4, 355.4)}"/>`; }
  s += `<g opacity="${cl(pr(t, 351.0, 351.3)) * (1 - pr(t, 355.7, 356))}">` + TXT(960, 690, 'LIKE · COMMENT', { size: 44, w: 900, a: 'middle', ls: 6 }) + `</g>`;
  if (t > 355.97) { s += words(t, ['CAN', 'THE', 'NUCLEAR', 'TABOO', 'HOLD?'], 960, 380, 76, 900, 355.97, 0.12, { a: 'middle', keep: [3], keepCol: C.amber });
    if (t > 357.03) s += words(t, ['OR', 'HAS', 'IT', 'BEGUN', 'TO', 'ERODE?'], 960, 480, 76, 900, 357.03, 0.12, { a: 'middle', keep: [5], keepCol: C.red });
    const v = expo(pr(t, 358.3, 359.3)); s += `<g opacity="${cl(pr(t, 358.2, 358.5))}"><rect x="560" y="560" width="800" height="12" rx="6" fill="#1B2027"/><rect x="560" y="560" width="${400 * v}" height="12" rx="6" fill="${C.blue}"/><rect x="${1360 - 400 * v}" y="560" width="${400 * v}" height="12" rx="6" fill="${C.red}"/>` + MONO(560, 610, 'IT HOLDS', { size: 18, fill: C.blue, ls: 4 }) + MONO(1360, 610, 'IT ERODES', { size: 18, a: 'end', fill: C.red, ls: 4 }) + `</g>`; }
  return s;
});

export function frame(t) { const sh = shots.find(s => t >= s.t0 && t < s.t1) || shots[shots.length - 1]; return frameSVG(t, sh.fn(t)); }
cli(frame, 251.45, 'a4');
