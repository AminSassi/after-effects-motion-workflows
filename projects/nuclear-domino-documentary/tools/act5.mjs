// ACT 5 — VO 359.45 → 452.35 (Plan A simulation, one missile vs one mountain, second-order effects, Petrov 1983)
import * as L from './lib3d.mjs';
const { C, cl, pr, lerp, L3, expo, expoIn, inOut, sine, spring, rnd, kf, TXT, MONO, words, Cam, Scene, orbit, box, cyl, worldMap, arc3, marker, LL, frameSVG, cli, rotAxis, add, sub, mul, PH, tornCard2D, noteDrop, quad, shock, missile, flyArc, terrain, network, crt, chapter, lower, fmt, tw, flagSVG, faceSVG, mixc } = L;
const BG = `<rect width="100%" height="100%" fill="url(#sky)"/>`;
const floor = (S, z = 0, ext = 60, st = 6) => { for (let i = -ext; i <= ext; i += st) { S.line([[i, -ext, z], [i, ext, z]], '#151A21', { sw: 1, z: 1e5 }); S.line([[-ext, i, z], [ext, i, z]], '#151A21', { sw: 1, z: 1e5 }); } };
const shots = []; const add2 = (t0, t1, fn) => shots.push({ t0, t1, fn });
const P3 = (ll, z = 0) => [ll[0], ll[1], z];
const NATO = [840, 124, 826, 250, 276, 380, 724, 620, 528, 56, 616, 203, 703, 348, 642, 100, 300, 792, 208, 578, 233, 428, 440, 191, 705, 8, 499, 807, 246, 752, 442];
const hiEU = (k = 1) => { const h = {}; NATO.forEach(id => h[id] = '#1B2A3D'); h[643] = '#3B1416'; h[112] = '#2A1A1A'; return h; };
const KAL = [20.5, 54.7];
const counter = (x, y, v, lab, col, o = {}) => `<g transform="translate(${x} ${y})">` + MONO(0, 0, lab, { size: o.ls || 17, ls: 3 }) + TXT(0, (o.size || 84) * 0.95 + 8, o.txt || v, { size: o.size || 84, w: 900, fill: col }) + `</g>`;
// E1 359.45–368.33 Princeton 2019: Plan A simulation
add2(359.45, 368.33, t => {
  let s = BG + `<rect width="100%" height="100%" fill="#0B0D11"/>`;
  s += tornCard2D(t, 359.6, PH('princeton'), 110, 270, 760, 500, { seed: 101, rot: -2.5, caption: 'PRINCETON UNIVERSITY', credit: 'WIKIMEDIA COMMONS', push: 0.005 });
  const k = cl(spring(t, 361.63, 0.6), 0, 1.1);
  if (t > 361.63) { s += `<g opacity="${cl(pr(t, 361.63, 361.9))}" transform="translate(1010 ${220 + (1 - cl(k)) * 40})"><rect width="800" height="480" rx="14" fill="#0E1116" stroke="#2A313B" stroke-width="2"/>` + MONO(40, 60, 'SCIENCE & GLOBAL SECURITY · 2019', { size: 17, ls: 3 }) + TXT(40, 170, 'PLAN A', { size: 110, w: 900, fill: C.text }) + MONO(40, 220, 'SIMULATED NATO–RUSSIA ESCALATION', { size: 18, ls: 2, fill: C.sub });
    const lines = [[363.35, 'MODEL · NATO vs RUSSIA'], [365.31, 'ESCALATION LADDER · 5 HOURS'], [367.23, 'BLAST DATA · NUKEMAP']];
    lines.forEach(([t0, l], i) => { if (t < t0) return; const n = Math.ceil(pr(t, t0, t0 + 0.6) * l.length); s += `<rect x="40" y="${280 + i * 56}" width="14" height="14" fill="${C.amber}"/>` + MONO(72, 294 + i * 56, l.slice(0, n) + (n < l.length && Math.floor(t * 8) % 2 ? '▌' : ''), { size: 20, fill: C.text, ls: 1 }); });
    s += `</g>`; }
  s += words(t, ['IN', '2019,', 'RESEARCHERS', 'BUILT'], 110, 150, 48, 900, 359.5, 0.15, { keep: [1], keepCol: C.amber });
  return s;
});
// Europe stage
function eu(t, cam) { const S = new Scene(cam, Math.floor(t * 12)); worldMap(S, { bbox: [-12, 34, 60, 70], land: '#161C23', hi: hiEU() }); return S; }
const EUP = n => Array.from({ length: n }, (_, i) => [[-2 + rnd(i * 3.3) * 26, 43 + rnd(i * 5.1) * 13], [24 + rnd(i * 2.7) * 30, 45 + rnd(i * 7.9) * 13]]);
const TAC = EUP(90);
// E2 368.33–373.07 conventional war in Europe; tactical warning shot
add2(368.33, 373.07, t => {
  const tg = [22, 52, 0]; const cam = new Cam(orbit(tg, kf(t, [[368.33, -100], [373.07, -88, sine]]), kf(t, [[368.33, 48], [373.07, 40]]), kf(t, [[368.33, 62], [373.07, 50]])), tg, 40);
  const S = eu(t, cam);
  for (let i = 0; i < 18; i++) { const t0 = 368.6 + i * 0.12; const ph = (t - t0) % 1.1; if (t > t0 && ph < 0.5) { const p = [20 + rnd(i * 4) * 14, 48 + rnd(i * 6) * 8, 0.1]; S.at(p, (x, y) => `<circle cx="${x}" cy="${y}" r="${4 + ph * 14}" fill="none" stroke="${C.amber}" stroke-width="1.5" opacity="${1 - ph * 2}"/>`, { z: -3 }); } }
  flyArc(S, P3(KAL), P3([14, 53.5]), 3, t, 370.9, 1.0, C.red, { len: 1, R: 3 });
  let s = BG + S.out();
  s += words(t, ['CONVENTIONAL', 'WAR', 'IN', 'EUROPE'], 110, 150, 48, 900, 368.4, 0.15, { keep: [0], keepCol: C.amber });
  if (t > 370.91) s += words(t, ['THEN:', 'A', 'TACTICAL', 'WARNING', 'SHOT'], 110, 210, 40, 800, 370.91, 0.12, { keep: [2, 3], keepCol: C.red });
  s += `<g opacity="${cl(pr(t, 368.6, 368.9))}">` + flagSVG('nato', 1580, 74, 54, 36) + MONO(1650, 100, 'NATO', { size: 18, fill: C.blue, ls: 4 }) + flagSVG('russia', 1580, 124, 54, 36) + MONO(1650, 150, 'RUSSIA', { size: 18, fill: C.red, ls: 4 }) + `</g>`;
  return s;
});
// E3 373.07–379.09 hundreds of warheads within 3 hours → ≈2.6M casualties
add2(373.07, 379.09, t => {
  const tg = [24, 50, 0]; const cam = new Cam(orbit(tg, kf(t, [[373.07, -92], [379.09, -78, sine]]), kf(t, [[373.07, 40], [379.09, 34]]), kf(t, [[373.07, 56], [379.09, 66]])), tg, 40);
  const S = eu(t, cam);
  TAC.forEach(([a, b], i) => { const t0 = 373.1 + rnd(i * 11) * 3.6; const [s0, e0] = i % 2 ? [b, a] : [a, b]; flyArc(S, P3(s0), P3(e0), 2 + rnd(i) * 3, t, t0, 0.8, i % 2 ? C.red : C.blue, { len: 0.6, R: 1.4, sw: 1.6, op: 0.85 }); });
  let s = BG + S.out();
  const v = lerp(0, 2.6, inOut(pr(t, 373.5, 378.0)));
  s += `<g opacity="${cl(pr(t, 373.2, 373.5))}"><rect x="1330" y="110" width="480" height="270" rx="12" fill="#0E1116" opacity="0.92" stroke="#2A313B" stroke-width="2"/>` + MONO(1360, 150, `T+ ${Math.floor(lerp(0, 3, pr(t, 373.1, 378.6)))}:${String(Math.floor(lerp(0, 180, pr(t, 373.1, 378.6)) % 60)).padStart(2, '0')} HRS`, { size: 18, ls: 3, fill: C.amber }) + TXT(1360, 260, `${v.toFixed(1)}M`, { size: 96, w: 900, fill: C.red }) + MONO(1360, 300, 'CASUALTIES · TACTICAL PHASE', { size: 16, ls: 3 }) + MONO(1360, 345, 'PLAN A ESTIMATE ≈2.6M', { size: 14, ls: 2, fill: '#5C7C99' }) + `</g>`;
  s += words(t, ['HUNDREDS', 'OF', 'WARHEADS'], 110, 150, 52, 900, 373.5, 0.15, { keep: [0], keepCol: C.red });
  return s;
});
// E4 379.09–383.09 strategic strikes (45 minutes)
add2(379.09, 383.09, t => {
  const tg = [-20, 50, 0]; const cam = new Cam(orbit(tg, kf(t, [[379.09, -96], [383.09, -88]]), kf(t, [[379.09, 56], [383.09, 52]]), kf(t, [[379.09, 150], [383.09, 165]])), tg, 40);
  const S = new Scene(cam, Math.floor(t * 12)); const hi = hiEU(); worldMap(S, { bbox: [-130, 20, 90, 75], land: '#161C23', hi });
  for (let i = 0; i < 40; i++) { const us = [-120 + rnd(i * 3) * 45, 32 + rnd(i * 7) * 15], ru = [30 + rnd(i * 5) * 55, 50 + rnd(i * 9) * 12]; const [a, b] = i % 2 ? [us, ru] : [ru, us]; flyArc(S, P3(a), P3(b), 22 + rnd(i) * 8, t, 379.2 + rnd(i * 13) * 2.4, 1.2, i % 2 ? C.blue : C.red, { len: 2.2, R: 3, sw: 1.6 }); }
  let s = BG + S.out();
  s += words(t, ['STRATEGIC', 'STRIKES'], 110, 150, 52, 900, 379.2, 0.2, { keep: [0], keepCol: C.red }) + MONO(110, 196, 'NEXT 45 MINUTES', { size: 18, ls: 3, fill: C.amber, op: cl(pr(t, 379.4, 379.7)) });
  s += `<g opacity="${cl(pr(t, 379.2, 379.5))}"><rect x="1330" y="110" width="480" height="200" rx="12" fill="#0E1116" opacity="0.92" stroke="#2A313B" stroke-width="2"/>` + TXT(1360, 230, `${lerp(2.6, 3.4, inOut(pr(t, 379.5, 382.6))).toFixed(1)}M`, { size: 96, w: 900, fill: C.red }) + MONO(1360, 275, 'CASUALTIES · RISING', { size: 16, ls: 3 }) + `</g>`;
  return s;
});
// E5 383.09–394.15 under five hours: 34.1M dead + 57.4M injured = 91.5M (before fallout)
add2(383.09, 394.15, t => {
  const tg = [0, 0, 2]; const cam = new Cam(orbit(tg, kf(t, [[383.09, -120], [394.15, -95, sine]]), kf(t, [[383.09, 40], [394.15, 32]]), kf(t, [[383.09, 42], [394.15, 36]])), tg, 40);
  const S = new Scene(cam, Math.floor(t * 12)); floor(S, 0, 40, 2);
  const dead = inOut(pr(t, 384.77, 386.9)), inj = inOut(pr(t, 386.17, 388.6));
  for (let i = 0; i < 100; i++) { const x = (i % 10) * 1.1 - 10.5, y = Math.floor(i / 10) * 1.1 - 5; const h = (i < 34 ? dead : i < 91 ? inj : 0) > (i < 34 ? i / 34 : (i - 34) / 57) ? 0.6 : 0; const col = i < 34 ? C.red : i < 91 ? C.amber : '#1B2027'; box(S, [x, y, 0], [0.9, 0.9, Math.max(0.05, h * cl(spring(t, 384.8 + (i < 34 ? i * 0.04 : 386.2 - 384.8 + (i - 34) * 0.03), 0.5), 0, 1.1))], col, {}); }
  let s = BG + S.out();
  s += MONO(110, 130, 'PLAN A · UNDER FIVE HOURS · 1 BLOCK ≈ 1 MILLION', { size: 17, ls: 3, op: cl(pr(t, 383.2, 383.5)) });
  if (t > 384.77) s += counter(1300, 150, 0, 'DEAD', C.red, { txt: `${(34.1 * dead).toFixed(1)}M` });
  if (t > 386.17) s += counter(1300, 330, 0, 'INJURED', C.amber, { txt: `${(57.4 * inj).toFixed(1)}M` });
  if (t > 389.69) { const k = expo(pr(t, 389.69, 390.3)); s += `<rect x="1300" y="520" width="${500 * k}" height="3" fill="${C.text}"/>` + counter(1300, 560, 0, 'TOTAL CASUALTIES', C.text, { txt: `${(91.5 * expo(pr(t, 389.7, 391.2))).toFixed(1)}M`, size: 110 }); }
  if (t > 392.0) s += `<g opacity="${cl(pr(t, 392.0, 392.3))}"><rect x="1300" y="720" width="500" height="56" rx="28" fill="none" stroke="${C.sub}" stroke-width="2"/>` + MONO(1550, 756, 'BEFORE FALLOUT IS COUNTED', { size: 18, a: 'middle', ls: 3, fill: C.text }) + `</g>`;
  return s;
});
// E6 394.15–399.73 almost no room to stop: a stop button that does nothing
// E6 v2 (Amin: red cylinder button "silly and bad") — the Plan A escalation clock races forward; a cursor keeps hitting STOP and nothing happens
const CUR = (x, y, press) => `<g transform="translate(${x} ${y}) scale(${press ? 0.88 : 1})"><path d="M0 0 L0 38 L10 29 L17 45 L24 42 L17 26 L30 26 Z" fill="#F2F2F2" stroke="#0B0D10" stroke-width="2.5" stroke-linejoin="round"/></g>`;
add2(394.15, 399.73, t => {
  let s = BG; const X0 = 170, X1 = 1750, Y = 640;
  const steps = [[0.00, 'WARNING SHOT', 'ONE TACTICAL WEAPON', '#F5A524'], [0.30, 'TACTICAL WAR', 'HUNDREDS OF WARHEADS · ≈2.6M', C.red], [0.62, 'STRATEGIC STRIKES', 'CITIES · NEXT 45 MINUTES', C.red], [0.92, '≈91.5 MILLION', 'DEAD + INJURED · UNDER 5 HOURS', '#FF6B6F']];
  const hrs = ['T+0', 'FIRST 3 H', 'NEXT 45 MIN', 'UNDER 5 H'];
  // playhead races: slow start, then accelerates (the ladder speeds up)
  const ph = cl(Math.pow(pr(t, 394.5, 399.3), 1.35)); const px = lerp(X0, X1, ph);
  const ak = expo(pr(t, 394.2, 394.7));
  s += `<rect x="${X0}" y="${Y - 3}" width="${(X1 - X0) * ak}" height="6" rx="3" fill="#232A33"/><rect x="${X0}" y="${Y - 3}" width="${px - X0}" height="6" rx="3" fill="${C.red}"/>`;
  s += `<rect x="${X0}" y="${Y - 14}" width="${px - X0}" height="28" fill="${C.red}" opacity="0.08"/>`;
  steps.forEach(([u, lab, sub, col], i) => { const x = lerp(X0, X1, u); const on = ph >= u - 0.002; const k = on ? cl(spring(t, 394.5 + Math.pow(u, 1 / 1.35) * 4.8, 0.45), 0, 1.1) : 0;
    s += `<circle cx="${x}" cy="${Y}" r="${on ? 14 : 9}" fill="${on ? col : '#0E1116'}" stroke="${on ? col : '#3A4350'}" stroke-width="3"/>` + MONO(x, Y + 52, hrs[i], { size: 16, a: i === 3 ? 'end' : 'start', ls: 3, fill: on ? C.text : '#4A5563' });
    if (on) { const up = i % 2 ? 1 : -1; const ty = Y - 70 - (i % 2) * 120; s += `<g opacity="${cl(k)}" transform="translate(0 ${(1 - cl(k)) * 20})"><line x1="${x}" y1="${Y - 16}" x2="${x}" y2="${ty + 18}" stroke="${col}" stroke-width="2"/>` + TXT(x + (i === 3 ? 0 : 0), ty, lab, { size: i === 3 ? 46 : 34, w: 900, a: i === 3 ? 'end' : 'start', fill: col }) + MONO(x, ty - (i === 3 ? 56 : 44), sub, { size: 14, a: i === 3 ? 'end' : 'start', ls: 2, fill: C.sub }) + `</g>`;
      if (k < 1 && k > 0) s += `<circle cx="${x}" cy="${Y}" r="${14 + (1 - cl(k)) * 40}" fill="none" stroke="${col}" stroke-width="2" opacity="${cl(k) * 0.8}"/>`; } });
  // playhead
  s += `<line x1="${px}" y1="${Y - 30}" x2="${px}" y2="${Y + 30}" stroke="#F2F2F2" stroke-width="3"/><circle cx="${px}" cy="${Y}" r="6" fill="#F2F2F2"/>`;
  // STOP button rides above the playhead; cursor clicks it three times, nothing stops
  const clicks = [396.6, 397.6, 398.4]; const press = clicks.some(c => t > c && t < c + 0.14);
  const bx = Math.min(px, X1 - 120), by = 830;
  const lastClick = clicks.filter(c => t > c).pop();
  s += `<g transform="translate(${bx} ${by}) scale(${press ? 0.94 : 1})"><rect x="-110" y="-38" width="220" height="76" rx="38" fill="${press ? '#7A1E22' : '#0E1116'}" stroke="${C.red}" stroke-width="3"/>` + TXT(0, 13, 'STOP', { size: 34, w: 900, a: 'middle', fill: press ? '#F2F2F2' : C.red, ls: 6 }) + `</g>`;
  if (lastClick) { const rk = pr(t, lastClick, lastClick + 0.5); if (rk < 1) s += `<rect x="${bx - 110 - rk * 30}" y="${by - 38 - rk * 30}" width="${220 + rk * 60}" height="${76 + rk * 60}" rx="${38 + rk * 30}" fill="none" stroke="${C.red}" stroke-width="2" opacity="${1 - rk}"/>`;
    s += MONO(bx, by - 62, 'NO RESPONSE', { size: 18, a: 'middle', ls: 4, fill: C.red, op: (Math.floor(t * 6) % 2 ? 1 : 0.35) * cl(pr(t, lastClick, lastClick + 0.1)) }); }
  if (t > 396.0) { // cursor: glides to the button, clicks, chases it as it moves
    const target = [bx + 18, by + 6]; const ck = expo(pr(t, 396.0, 396.5)); const cx = lerp(1500, target[0], ck), cy = lerp(1010, target[1], ck);
    s += CUR(cx, cy, press); }
  s += MONO(X0, 1000, 'PLAN A · PRINCETON SIMULATION · ESCALATION LADDER', { size: 16, ls: 3, fill: C.tele, op: cl(pr(t, 394.3, 394.6)) });
  s += words(t, ['ONCE', 'LOOSED…'], 110, 150, 56, 900, 394.2, 0.3, {}) + (t > 396.07 ? words(t, ['ALMOST', 'NO', 'ROOM', 'TO', 'STOP'], 110, 220, 44, 800, 396.07, 0.18, { keep: [4], keepCol: C.red }) : '');
  return s;
});

// E7 399.73–405.89 Pickaxe isn't Plan A: one weapon, one mountain
add2(399.73, 405.89, t => {
  const tg = [0, 0, 3]; const cam = new Cam(orbit(tg, kf(t, [[399.73, -70], [405.89, -110, sine]]), kf(t, [[399.73, 24], [405.89, 20]]), kf(t, [[399.73, 36], [405.89, 30]])), tg, 40);
  const S = new Scene(cam, Math.floor(t * 12)); floor(S, 0, 40, 3);
  terrain(S, [0, 0, 0], 9, 7, 16, (u, v) => Math.max(0, 6.5 * Math.exp(-(u * u * 2.2 + v * v * 2.6)) + 1.2 * Math.exp(-((u - 0.5) ** 2 * 6 + (v + 0.3) ** 2 * 6))), '#8A7A65', { boil: true });
  flyArc(S, [-30, 10, 2], [0, 0, 6.6], 10, t, 403.07, 1.9, C.amber, { len: 1.6, R: 4, ease: x => x });
  let s = BG + S.out();
  s += words(t, ['NOT', 'PLAN', 'A'], 110, 150, 56, 900, 400.73, 0.2, { keep: [0], keepCol: C.blue });
  if (t > 403.07) s += `<g opacity="${cl(pr(t, 403.07, 403.4))}">` + TXT(1810, 150, '1 WEAPON', { size: 60, w: 900, a: 'end', fill: C.amber }) + TXT(1810, 220, '1 MOUNTAIN', { size: 60, w: 900, a: 'end' }) + MONO(1810, 260, 'PICKAXE MOUNTAIN · NATANZ', { size: 16, a: 'end', ls: 3 }) + `</g>`;
  return s;
});
// E8 405.89–416.65 second-order effects: proliferation network, limits gone, "just another tool"
// E8 v2 (Amin: "why didn't you put the world map with that action, missile launches") — second-order effects on the world map:
// first strike ripples out from Iran → would-be proliferators light up (flags) → rival pairs launch → launches everywhere ("just another tool")
const PROL = [[408.5, [46.7, 24.7], 'SAUDI ARABIA', 'saudi', 682], [408.9, [32.85, 39.93], 'TURKEY', 'turkey', 792], [409.3, [31.24, 30.04], 'EGYPT', 'egypt', 818], [409.8, [126.98, 37.57], 'SOUTH KOREA', 'skorea', 410], [410.2, [139.69, 35.69], 'JAPAN', 'japan', 392]];
const RIV = [[411.2, [73.05, 33.68], [77.2, 28.6]], [411.45, [37.62, 55.76], [30.52, 50.45]], [411.7, [116.4, 39.9], [121.56, 25.03]], [411.95, [125.75, 39.03], [126.98, 37.57]], [412.2, [77.2, 28.6], [73.05, 33.68]]];
const TOOL = Array.from({ length: 34 }, (_, i) => { const r = RIV[i % 4]; const j = (k, s) => [k[0] + (rnd(i * s) - 0.5) * 5, k[1] + (rnd(i * s + 1) - 0.5) * 4]; return [412.6 + rnd(i * 13) * 3.4, j(i % 2 ? r[1] : r[2], 3.1), j(i % 2 ? r[2] : r[1], 7.3)]; });
add2(405.89, 416.65, t => {
  const tg = [kf(t, [[405.89, 58], [416.65, 84]]), 34, 0]; const cam = new Cam(orbit(tg, kf(t, [[405.89, -96], [416.65, -86, sine]]), kf(t, [[405.89, 52], [416.65, 44]]), kf(t, [[405.89, 135], [416.65, 128]])), tg, 40);
  const hi = { 364: '#3B1416' }; PROL.forEach(([t0, , , , id]) => { if (t > t0) hi[id] = mixc('#161C23', '#4A3510', cl(pr(t, t0, t0 + 0.5))); });
  const S = new Scene(cam, 0); worldMap(S, { bbox: [-20, -5, 160, 72], land: '#161C23', hi });
  // first strike ripples
  [406.0, 406.5, 407.0].forEach(t0 => { const k = pr(t, t0, t0 + 2.6); if (k > 0 && k < 1) { const r = 2 + expo(k) * 55, pts = []; for (let i = 0; i <= 64; i++) { const a = i / 64 * Math.PI * 2; pts.push([LL.natanz[0] + Math.cos(a) * r, LL.natanz[1] + Math.sin(a) * r * 0.8, 0.1]); } S.line(pts, C.red, { sw: 2.5 * (1 - k) + 0.5, op: 0.9 * (1 - k), z: -2 }); } });
  marker(S, P3(LL.natanz), C.red, t, 405.95, 'FIRST STRIKE', { fs: 20, sub: 'IRAN', subCol: C.red, flag: 'iran' });
  PROL.forEach(([t0, ll, n, f]) => marker(S, P3(ll), C.amber, t, t0, n, { fs: 18, flag: f, left: ll[0] < 50 }));
  RIV.forEach(([t0, a, b]) => flyArc(S, P3(a, 0.2), P3(b, 0.2), 3, t, t0, 0.9, C.red, { len: 1.6, R: 2.2, sw: 2.2, fade: [1.4, 2.6] }));
  TOOL.forEach(([t0, a, b], i) => flyArc(S, P3(a, 0.2), P3(b, 0.2), 2 + rnd(i) * 3, t, t0, 0.8, i % 3 ? C.red : C.amber, { len: 1.2, R: 1.6, sw: 1.6, op: 0.85, fade: [0.6, 1.6] }));
  let s = BG + S.out();
  if (t > 412.6) { const n = TOOL.filter(([t0]) => t > t0).length + RIV.filter(([t0]) => t > t0).length; s += `<g opacity="${cl(pr(t, 412.6, 412.9))}"><rect x="1410" y="130" width="400" height="140" rx="12" fill="#0E1116" opacity="0.92" stroke="${C.red}" stroke-width="2"/>` + MONO(1440, 172, 'NUCLEAR USE · ILLUSTRATIVE', { size: 15, ls: 3 }) + TXT(1440, 248, `${n} LAUNCHES`, { size: 54, w: 900, fill: C.red }) + `</g>`; }
  s += words(t, ['SECOND-ORDER', 'EFFECTS'], 110, 150, 56, 900, 405.95, 0.25, { keep: [0], keepCol: C.amber });
  [[408.41, 'NATIONS BUILD THEIR OWN BOMB'], [411.13, 'RIVALS DECIDE LIMITS ARE GONE'], [412.53, 'NUCLEAR USE → “JUST ANOTHER TOOL”']].forEach(([t0, l], i) => { if (t < t0) return; const k = expo(pr(t, t0, t0 + 0.5)); s += `<g opacity="${k}" transform="translate(${(1 - k) * 40} 0)"><rect x="1210" y="${600 + i * 84}" width="600" height="64" rx="8" fill="#0E1116" opacity="0.9" stroke="${i === 2 ? C.red : '#2A313B'}" stroke-width="2"/>` + MONO(1236, 640 + i * 84, `0${i + 1}`, { size: 18, fill: C.amber }) + TXT(1290, 642 + i * 84, l, { size: 24, w: 800 }) + `</g>`; });
  return s;
});
// E9 416.65–419.77 chapter 04
add2(416.65, 419.77, t => { const ex = pr(t, 419.4, 419.77); return `<rect width="100%" height="100%" fill="#07090C"/><g opacity="${1 - ex}">` + chapter(t, 416.65, '04', 'THE HUMAN FACTOR', { keep: [1, 2], size: 110 }) + MONO(960, 720, 'ACCIDENTAL ESCALATION', { size: 22, a: 'middle', ls: 8, fill: C.red, op: cl(pr(t, 417.8, 418.2)) }) + `</g>`; });
// E10 419.77–427.09 26 Sept 1983: Serpukhov-15 bunker outside Moscow (cutaway)
add2(419.77, 427.09, t => {
  const k = inOut(pr(t, 422.6, 425.2));
  const tg = L3([37.5, 55.4, 0], [37.43, 55.08, -0.4], k); const cam = new Cam(orbit(tg, kf(t, [[419.77, -100], [427.09, -70, sine]]), kf(t, [[419.77, 60], [425.2, 28], [427.09, 24]]), kf(t, [[419.77, 14], [425.2, 3.2, inOut], [427.09, 2.8]])), tg, 40);
  const S = new Scene(cam, Math.floor(t * 12)); worldMap(S, { hd: true, bbox: [30, 50, 45, 60], land: '#161C23', hi: { 643: '#1E2229' } });
  if (t < 423.4) marker(S, P3(LL.moscow), C.sub, t, 420.0, 'MOSCOW', { fs: 22 });
  if (t > 423.5) { const c = LL.serpukhov; const e = cl(spring(t, 423.5, 0.6), 0, 1.05);
    box(S, [c[0] - 0.5, c[1] - 0.3, -0.8 * e], [1.0, 0.6, 0.8 * e], '#1B2027', { stroke: '#3A4350', sw: 1 }); box(S, [c[0] - 0.42, c[1] - 0.25, -0.75 * e], [0.84, 0.5, 0.05], '#2A313B', {});
    for (let i = 0; i < 3; i++) box(S, [c[0] - 0.35 + i * 0.26, c[1] + 0.12, -0.7 * e], [0.18, 0.08, 0.22 * e], '#3A4350', {});
    S.at([c[0], c[1], 0.15], (x, y) => MONO(x, y - 20, 'SERPUKHOV-15 · BUNKER', { size: 18, a: 'middle', fill: C.amber, ls: 3 }), { z: -30 });
    S.at([c[0] - 0.1, c[1], -0.5 * e], (x, y, sc) => `<rect x="${x - sc * 0.06}" y="${y - sc * 0.08}" width="${sc * 0.1}" height="${sc * 0.07}" fill="#7CFFAE" opacity="${0.6 + 0.4 * Math.sin(t * 9)}"/>`, { z: -10 }); }
  else marker(S, P3(LL.serpukhov), C.amber, t, 421.5, 'SERPUKHOV-15', { fs: 22, sub: 'SECRET EARLY-WARNING BUNKER', subCol: C.amber, left: true, flag: 'ussr' });
  let s = BG + S.out();
  s += `<g opacity="${cl(pr(t, 419.8, 420.1))}">` + TXT(110, 190, '26 SEPT 1983', { size: 72, w: 900, fill: C.amber }) + `</g>`;
  s += lower(t, 422.25, 426.8, 'Stanislav Petrov', 'LT. COLONEL · SOVIET AIR DEFENCE FORCES', { face: 'petrov', flag: 'ussr', credit: 'PHOTO: QUEERY-54 · CC BY-SA 4.0 (2016)' });
  return s;
});
// E11 427.09–432.89 early-warning CRT: 1 launch, then 4 more (doc07 TV grid)
add2(427.09, 432.89, t => {
  const n = t > 431.17 ? Math.min(5, 1 + Math.floor((t - 431.17) / 0.3)) : t > 428.43 ? 1 : 0;
  let inner = ''; for (let x = 0; x <= 1400; x += 100) inner += `<line x1="${x}" y1="0" x2="${x}" y2="760" stroke="#0F3A22" stroke-width="1"/>`; for (let y = 0; y <= 760; y += 100) inner += `<line x1="0" y1="${y}" x2="1400" y2="${y}" stroke="#0F3A22" stroke-width="1"/>`;
  inner += `<path d="M120 520 Q 400 300 700 360 T 1300 300" fill="none" stroke="#1C6B3E" stroke-width="2"/>`;
  for (let i = 0; i < n; i++) { const x = 240 + i * 60, y = 540 - i * 18; inner += `<circle cx="${x}" cy="${y}" r="10" fill="#7CFFAE"/><circle cx="${x}" cy="${y}" r="${10 + ((t * 1.2 + i * 0.2) % 1) * 40}" fill="none" stroke="#7CFFAE" stroke-width="2" opacity="${1 - (t * 1.2 + i * 0.2) % 1}"/>`; }
  inner += `<text x="60" y="80" fill="#7CFFAE" font-family="DejaVu Sans Mono" font-size="34" letter-spacing="4">OKO · EARLY WARNING</text>`;
  if (n) inner += `<text x="60" y="700" fill="${Math.floor(t * 3) % 2 ? '#FF6B6B' : '#7CFFAE'}" font-family="DejaVu Sans Mono" font-weight="700" font-size="54" letter-spacing="8">LAUNCH · ${n} MISSILE${n > 1 ? 'S' : ''}</text>`;
  const sc = lerp(1.0, 1.08, pr(t, 427.09, 432.89));
  let s = BG + `<g transform="translate(960 560) scale(${sc}) translate(-700 -380)">` + crt(t, 1400, 760, inner) + `</g>`;
  s += MONO(110, 130, 'ILLUSTRATIVE RECONSTRUCTION', { size: 16, ls: 3 });
  return s;
});
// E12 432.89–436.17 tension after KAL 007 (Sept 1, 1983)
add2(432.89, 436.17, t => {
  let s = BG; const v = expo(pr(t, 433.2, 435.0)) * 0.92 + Math.sin(t * 20) * 0.01;
  s += `<rect x="460" y="560" width="1000" height="40" rx="20" fill="#1B2027"/><rect x="460" y="560" width="${1000 * v}" height="40" rx="20" fill="${v > 0.7 ? C.red : C.amber}"/>`;
  ['LOW', 'HIGH', 'PEAK'].forEach((l, i) => s += MONO(460 + i * 500, 650, l, { size: 18, a: ['start', 'middle', 'end'][i], ls: 4 }));
  s += MONO(960, 500, 'COLD WAR TENSION', { size: 20, a: 'middle', ls: 6 }) + words(t, ['AFTER', 'KOREAN', 'AIR', 'LINES', 'FLIGHT', '007'], 960, 360, 56, 900, 433.0, 0.12, { a: 'middle', keep: [5], keepCol: C.red }) + MONO(960, 420, 'SHOT DOWN BY THE USSR · 1 SEPT 1983', { size: 18, a: 'middle', ls: 3, op: cl(pr(t, 434.0, 434.3)) });
  return s;
});
// E13 436.17–443.71 procedure: report up the chain — Petrov hesitates; 5 missiles ≠ first strike
add2(436.17, 443.71, t => {
  const tg = [6, 0, 2]; const cam = new Cam(orbit(tg, kf(t, [[436.17, -110], [443.71, -86, sine]]), kf(t, [[436.17, 30], [443.71, 24]]), kf(t, [[436.17, 30], [443.71, 26]])), tg, 40);
  const S = new Scene(cam, Math.floor(t * 12)); floor(S, 0, 40, 3);
  const nodes = [['PETROV', 0, C.amber], ['COMMAND', 6, '#3A4350'], ['GENERAL STAFF', 12, '#3A4350'], ['LEADERSHIP', 18, '#3A4350']];
  nodes.forEach(([n, x, c], i) => { box(S, [x - 1.2, -1.2, 0], [2.4, 2.4, 1.2 + i * 0.8], c, {}); S.at([x, 0, 2.4 + i * 0.8], (px, py) => MONO(px, py, n, { size: 16, a: 'middle', fill: i ? C.sub : C.amber, ls: 2 }), { z: -9 }); if (i) S.line([[x - 4.8, 0, 0.6], [x - 1.2, 0, 0.6]], '#2A313B', { sw: 3, z: -2 }); });
  const pk = (t > 437.0 ? cl(((t - 437.0) * 0.9) % 1) : 0) * 0.6; S.at([1.2 + pk * 3.6, 0, 0.6], (x, y) => `<rect x="${x - 7}" y="${y - 7}" width="14" height="14" fill="${C.red}" opacity="${t > 437 ? 1 - pk / 0.6 : 0}"/>`, { z: -3 });
  let s = BG + S.out();
  s += words(t, ['PROCEDURE:', 'REPORT', 'IT', 'UP'], 110, 150, 48, 900, 436.2, 0.15, { keep: [0], keepCol: C.sub });
  if (t > 438.85) { s += words(t, ['PETROV', 'HESITATED'], 110, 214, 56, 900, 438.85, 0.25, { keep: [1], keepCol: C.amber }); const el = t - 438.85; s += `<g opacity="${cl(pr(t, 438.85, 439.1))}" transform="translate(1660 200)"><circle r="80" fill="#0E1116" stroke="#2A313B" stroke-width="3"/><line x1="0" y1="0" x2="${Math.sin(el * 1.3) * 64}" y2="${-Math.cos(el * 1.3) * 64}" stroke="${C.amber}" stroke-width="5" stroke-linecap="round"/><circle r="7" fill="${C.amber}"/></g>`; }
  if (t > 440.27) s += `<g opacity="${cl(pr(t, 440.27, 440.6))}"><rect x="1210" y="620" width="600" height="150" rx="10" fill="#0E1116" stroke="#2A313B" stroke-width="2"/>` + TXT(1250, 700, '5', { size: 64, w: 900, fill: C.red }) + MONO(1250, 740, 'DETECTED', { size: 15, ls: 3 }) + TXT(1500, 700, '≠', { size: 64, w: 900, fill: C.text, a: 'middle' }) + TXT(1770, 700, '100s', { size: 64, w: 900, fill: C.text, a: 'end' }) + MONO(1770, 740, 'IN A REAL FIRST STRIKE', { size: 15, a: 'end', ls: 2 }) + `</g>`;
  return s;
});
// E14 443.71–452.35 false alarm: sunlight off high clouds fooled a satellite; public 15 years later
// E14 v2 (Amin: ellipse clouds + satellite "basic and bad") — Earth's limb from orbit at dawn: textured high clouds, the sun's glint off their tops
// travels up to the Soviet early-warning satellite; its sensor screen reads LAUNCH, then the truth: SUN GLINT
function earthLimb(t) {
  const R = 2400, cx = 960 + (t - 443.71) * -6, cy = 640 + R; const rot = (t - 443.71) * 0.25;
  let s = `<defs><radialGradient id="elA" cx="50%" cy="50%" r="50%"><stop offset="0.975" stop-color="#5B8DEF" stop-opacity="0"/><stop offset="0.988" stop-color="#7FB0FF" stop-opacity="0.9"/><stop offset="1" stop-color="#7FB0FF" stop-opacity="0"/></radialGradient>
    <linearGradient id="elE" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1F3554"/><stop offset="0.35" stop-color="#0E1A2C"/><stop offset="0.7" stop-color="#060A12"/></linearGradient>
    <radialGradient id="elSun" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#FFF6E0"/><stop offset="0.12" stop-color="#FFD9A0" stop-opacity="0.85"/><stop offset="0.5" stop-color="#FF9E5A" stop-opacity="0.18"/><stop offset="1" stop-color="#FF9E5A" stop-opacity="0"/></radialGradient>
    <filter id="elC" x="-10%" y="-50%" width="120%" height="200%"><feTurbulence type="fractalNoise" baseFrequency="0.006 0.03" numOctaves="5" seed="11" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 3.2 -1.45" result="c"/><feComposite in="c" in2="SourceGraphic" operator="in"/></filter>
    <clipPath id="elClip"><circle cx="${cx}" cy="${cy}" r="${R}"/></clipPath></defs>`;
  s += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#elE)"/>`;
  // cloud deck: turbulence-textured band hugging the limb, slowly rotating with the planet
  s += `<g clip-path="url(#elClip)"><g transform="rotate(${rot} ${cx} ${cy})"><rect x="${cx - 1500}" y="${cy - R - 20}" width="3000" height="420" fill="#fff" filter="url(#elC)" opacity="0.55"/></g>`;
  s += `<rect x="0" y="${cy - R}" width="1920" height="600" fill="url(#elE)" opacity="0.35"/></g>`;
  s += `<circle cx="${cx}" cy="${cy}" r="${R * 1.012}" fill="url(#elA)"/>`;
  return { s, horizonY: x => cy - Math.sqrt(Math.max(0, R * R - (x - cx) * (x - cx))) };
}
function satellite(x, y, sc, t) {
  const p = 4 * sc; let g = `<g transform="translate(${x} ${y}) rotate(${-8 + Math.sin(t * 0.6) * 1.5}) scale(${sc})">`;
  const panel = (dx) => { let q = `<g transform="translate(${dx} -34)"><rect width="200" height="68" fill="#16284A" stroke="#7FA6E6" stroke-width="2"/>`; for (let i = 1; i < 8; i++) q += `<line x1="${i * 25}" y1="0" x2="${i * 25}" y2="68" stroke="#3B5C99" stroke-width="1.5"/>`; q += `<line x1="0" y1="34" x2="200" y2="34" stroke="#3B5C99" stroke-width="1.5"/><rect width="200" height="68" fill="url(#satGl)" opacity="0.5"/></g>`; return q; };
  g += `<defs><linearGradient id="satGl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.35"/><stop offset="0.5" stop-color="#fff" stop-opacity="0"/></linearGradient><linearGradient id="foil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F3D27A"/><stop offset="0.5" stop-color="#B8862E"/><stop offset="1" stop-color="#E8C066"/></linearGradient></defs>`;
  g += `<rect x="-60" y="-3" width="40" height="6" fill="#9AA4B2"/><rect x="20" y="-3" width="40" height="6" fill="#9AA4B2"/>` + panel(-260) + panel(60);
  g += `<rect x="-24" y="-46" width="48" height="92" rx="6" fill="url(#foil)"/><rect x="-24" y="-46" width="48" height="92" rx="6" fill="none" stroke="#6B4E16" stroke-width="2"/>`;
  g += `<path d="M-14 -46 L-20 -78 L20 -78 L14 -46 Z" fill="#C8CDD3"/><ellipse cx="0" cy="-80" rx="22" ry="7" fill="#1B2027" stroke="#9AA4B2" stroke-width="2"/>`; // telescope looking down/back at Earth
  return g + `</g>`;
}
add2(443.71, 452.35, t => {
  let s = `<rect width="100%" height="100%" fill="#04060A"/>`;
  for (let i = 0; i < 90; i++) s += `<circle cx="${rnd(i * 3.7) * 1920}" cy="${rnd(i * 5.3) * 560}" r="${0.6 + rnd(i) * 1.3}" fill="#fff" opacity="${0.25 + rnd(i * 9) * 0.5}"/>`;
  const E = earthLimb(t); s += E.s;
  // sun just over the limb (left), lens bloom
  const sx = 330, sy = E.horizonY(330) - 10; s += `<circle cx="${sx}" cy="${sy}" r="420" fill="url(#elSun)"/><circle cx="${sx}" cy="${sy}" r="16" fill="#FFFBF0"/>`;
  // glint spot on the cloud tops, rays sun → glint → satellite
  const gx = 900, gy = E.horizonY(900) + 70, sat = [1500, 300];
  const gk = pr(t, 445.45, 446.3), rk = pr(t, 446.3, 447.0);
  if (gk > 0) { const e = expo(gk); s += `<line x1="${sx}" y1="${sy}" x2="${lerp(sx, gx, e)}" y2="${lerp(sy, gy, e)}" stroke="#FFE2A3" stroke-width="2.5" opacity="0.8"/>`;
    if (gk >= 1) { const f = 1 + 0.25 * Math.sin(t * 13); s += `<g transform="translate(${gx} ${gy})" opacity="${0.95}"><circle r="${60 * f}" fill="url(#elSun)"/><path d="M-90 0 L90 0 M0 -40 L0 40" stroke="#FFF6E0" stroke-width="2" opacity="0.8"/></g>`;
      const e2 = expo(rk); s += `<line x1="${gx}" y1="${gy}" x2="${lerp(gx, sat[0], e2)}" y2="${lerp(gy, sat[1] + 40, e2)}" stroke="#FFE2A3" stroke-width="2.5" opacity="0.8"/>`; } }
  s += satellite(sat[0] + Math.sin(t * 0.5) * 6, sat[1] + (t - 443.71) * -2, 0.8, t) + MONO(sat[0], sat[1] + 120, 'SOVIET EARLY-WARNING SATELLITE', { size: 14, a: 'middle', ls: 3, fill: C.sub });
  // sensor screen: the satellite's view — LAUNCH, then the truth
  if (t > 446.6) { const k = cl(spring(t, 446.6, 0.5), 0, 1.1), x = 110, y = 300, w = 440, h = 280; const truth = t > 448.2;
    s += `<g opacity="${cl(pr(t, 446.6, 446.8))}" transform="translate(${x} ${y + (1 - cl(k)) * 30})"><rect width="${w}" height="${h}" rx="10" fill="#06100B" stroke="#2F6B45" stroke-width="2"/>`;
    for (let i = 0; i < 12; i++) s += `<line x1="0" y1="${i * 25}" x2="${w}" y2="${i * 25}" stroke="#0E2418" stroke-width="1"/>`;
    s += MONO(20, 34, 'OKO SENSOR · 26 SEP 1983', { size: 14, ls: 2, fill: '#5FD08A' });
    const bl = (i) => { const bx = 120 + i * 60, by = 170 + (i % 2) * 30; const on = Math.floor(t * 4 + i) % 2; return `<circle cx="${bx}" cy="${by}" r="${truth ? 10 : 7}" fill="${truth ? '#FFE2A3' : '#5FD08A'}" opacity="${truth ? 0.9 : on ? 1 : 0.4}"/>`; };
    for (let i = 0; i < 5; i++) s += bl(i);
    s += truth ? TXT(20, h - 30, 'SUN GLINT', { size: 40, w: 900, fill: '#FFE2A3' }) : TXT(20, h - 30, '5 × LAUNCH', { size: 40, w: 900, fill: (Math.floor(t * 6) % 2 ? '#E5484D' : '#7A1E22') });
    s += `</g>`; }
  if (t < 444.3) s += words(t, ['HE', 'WAITED.'], 960, 200, 66, 900, 443.71, 0.15, { a: 'middle', keep: [1], keepCol: C.amber });
  if (t > 444.21) { const k = cl(spring(t, 444.21, 0.5), 0, 1.1); s += `<g opacity="${cl(pr(t, 444.21, 444.4))}" transform="translate(960 150) scale(${0.9 + 0.1 * k}) translate(-960 -150)">` + TXT(960, 175, 'FALSE ALARM', { size: 72, w: 900, a: 'middle', fill: '#F2F2F2', ls: 6 }) + `<rect x="${960 - 290}" y="196" width="580" height="4" fill="${C.blue}"/></g>`; }
  if (t > 445.45) s += MONO(960, 240, 'SUNLIGHT REFLECTING OFF HIGH-ALTITUDE CLOUDS', { size: 18, a: 'middle', ls: 3, fill: '#FFE2A3', op: cl(pr(t, 445.45, 445.8)) });
  if (t > 449.47) s += `<g opacity="${cl(pr(t, 449.47, 449.8))}">` + TXT(1810, 860, `${Math.round(lerp(1983, 1998, inOut(pr(t, 449.5, 451.2))))}`, { size: 90, w: 900, a: 'end', fill: C.amber }) + MONO(1810, 900, 'THE WORLD FINDS OUT · 15 YEARS LATER', { size: 16, a: 'end', ls: 3, fill: C.text }) + `</g>`;
  return s;
});

export function frame(t) { const sh = shots.find(s => t >= s.t0 && t < s.t1) || shots[shots.length - 1]; return frameSVG(t, sh.fn(t)); }
cli(frame, 359.45, 'a5');
