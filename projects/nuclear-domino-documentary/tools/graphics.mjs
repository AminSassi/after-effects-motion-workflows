// High-craft Documentary Graphics Generator (3840x2160 4K) — Multi-font Editorial + Tactical Telemetry
// Uses Playfair Display (editorial serif), Montserrat (architectural sans), and Consolas (telemetry mono).
import fs from 'fs';
import { Resvg } from '@resvg/resvg-js';

const W = 3840, H = 2160;
const UF = 'C:/Users/PC/AppData/Local/Microsoft/Windows/Fonts/';
const WF = 'C:/Windows/Fonts/';
const FONT = [
  UF + 'Montserrat-Regular.ttf',
  UF + 'Montserrat-Medium.ttf',
  UF + 'Montserrat-SemiBold.ttf',
  UF + 'Montserrat-Bold.ttf',
  UF + 'Montserrat-ExtraBold.ttf',
  UF + 'Montserrat-Black.ttf',
  UF + 'PlayfairDisplay-Regular.ttf',
  UF + 'PlayfairDisplay-Bold.ttf',
  UF + 'PlayfairDisplay-Black.ttf',
  UF + 'PlayfairDisplay-Italic.ttf',
  UF + 'PlayfairDisplay-BoldItalic.ttf',
  WF + 'consola.ttf',
  WF + 'consolab.ttf',
].filter(f => fs.existsSync(f));

const C = {
  bg: '#080A0E',
  bgWarm: '#0C0A09',
  panel: '#10141B',
  panelHi: '#161C26',
  paper: '#EDE8DF',
  ink: '#121417',
  line: '#263040',
  lineDim: '#171E29',
  text: '#F4F1EA',
  sub: '#9AA6B8',
  dim: '#5A6678',
  red: '#E5484D',
  redDark: '#3A1114',
  amber: '#F5A524',
  amberDark: '#382409',
  blue: '#5B8DEF',
  blueDark: '#122238',
  green: '#3DD68C',
};

const out = process.argv[2] || '../02_ASSETS/graphics';
fs.mkdirSync(out, { recursive: true });

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const T = (x, y, s, o = {}) =>
  `<text x="${x}" y="${y}" fill="${o.fill || C.text}" font-family="${o.ff || 'Montserrat'}" font-style="${o.it ? 'italic' : 'normal'}" font-weight="${o.w || 700}" font-size="${o.size || 72}" text-anchor="${o.a || 'start'}" letter-spacing="${o.ls || 0}" opacity="${o.op ?? 1}">${esc(s)}</text>`;
const M = (x, y, s, o = {}) => T(x, y, s, { ...o, ff: 'Consolas', w: o.w || 700, ls: o.ls ?? 3 });
const S = (x, y, s, o = {}) => T(x, y, s, { ...o, ff: 'Playfair Display', w: o.w || 700 });

function backdrop(accent = C.blue, warm = false) {
  let b = `<defs>
    <radialGradient id="bgGlow" cx="50%" cy="42%" r="68%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.11"/>
      <stop offset="55%" stop-color="${warm ? '#14110E' : '#0B0F17'}" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#05070A" stop-opacity="0.95"/>
    </radialGradient>
    <pattern id="grid" width="120" height="120" patternUnits="userSpaceOnUse">
      <path d="M 120 0 L 0 0 0 120" fill="none" stroke="#18202C" stroke-width="1.5" opacity="0.55"/>
      <circle cx="0" cy="0" r="2" fill="#2A3648" opacity="0.6"/>
    </pattern>
    <pattern id="scan" width="8" height="8" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="8" y2="0" stroke="#ffffff" stroke-width="1" opacity="0.018"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="${warm ? C.bgWarm : C.bg}"/>
  <rect width="100%" height="100%" fill="url(#grid)"/>
  <rect width="100%" height="100%" fill="url(#bgGlow)"/>
  <rect width="100%" height="100%" fill="url(#scan)"/>`;
  // Corner architectural registration marks
  const m = 110, l = 36;
  b += `<path d="M${m},${m + l} L${m},${m} L${m + l},${m} M${W - m - l},${m} L${W - m},${m} L${W - m},${m + l} M${m},${H - m - l} L${m},${H - m} L${m + l},${H - m} M${W - m - l},${H - m} L${W - m},${H - m} L${W - m},${H - m - l}" fill="none" stroke="${C.line}" stroke-width="3" opacity="0.8"/>`;
  return b;
}

function headerBlock(kicker, title, sub, accent = C.red, rightCode = 'VERION // GEOPOLITICAL DOSSIER') {
  let b = `<rect x="180" y="150" width="10" height="190" fill="${accent}"/>`;
  b += M(216, 182, kicker.toUpperCase(), { size: 32, fill: accent, ls: 6 });
  b += S(216, 272, title, { size: 92, w: 900, fill: C.text, ls: 1 });
  b += T(216, 334, sub, { size: 42, w: 500, fill: C.sub });
  b += M(W - 180, 182, rightCode, { size: 28, fill: C.dim, a: 'end', ls: 4 });
  b += `<line x1="180" y1="376" x2="${W - 180}" y2="376" stroke="${C.line}" stroke-width="2" opacity="0.7"/>`;
  return b;
}

const srcLine = t => M(W - 180, H - 125, t, { size: 28, w: 400, fill: C.dim, a: 'end', ls: 1 });

function svg(body, bg = true, accent = C.blue, warm = false) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${bg ? backdrop(accent, warm) : ''}${body}</svg>`;
}

function render(s, name) {
  fs.writeFileSync(`${out}/${name}.svg`, s);
  fs.writeFileSync(
    `${out}/${name}.png`,
    new Resvg(s, { font: { fontFiles: FONT, loadSystemFonts: false, defaultFontFamily: 'Montserrat' } }).render().asPng()
  );
}

function wrap(str, n) {
  const w = str.split(' ');
  const L = [];
  let l = '';
  for (const x of w) {
    if ((l + ' ' + x).trim().length > n) {
      L.push(l.trim());
      l = x;
    } else l += ' ' + x;
  }
  if (l.trim()) L.push(l.trim());
  return L;
}

// ============================================================================
// 1. G01 — Depth Cross-Section (Geological & Ballistic Cutaway)
// ============================================================================
{
  let b = headerBlock('SUBSURFACE BALLISTIC ANALYSIS // KUH-E KOLANG GAZ LA', 'How Deep Is Pickaxe Mountain?', 'Estimated tunnel depth vs. maximum US conventional bunker-buster penetration', C.amber, 'LAT 33°42′18″N · LON 51°43′12″E');
  const top = 740, mpx = 10.5;
  const y = m => top + m * mpx;
  // Mountain silhouette above surface
  b += `<path d="M180,${top} L680,${top - 110} L1180,${top - 240} L1620,${top - 290} L2180,${top - 330} L2740,${top - 260} L3260,${top - 130} L3660,${top} Z" fill="#1A1815" stroke="#4A4035" stroke-width="4"/>`;
  // Subsurface granite strata layers
  const strata = [
    [top, y(25), '#161412'],
    [y(25), y(50), '#131110'],
    [y(50), y(75), '#100E0D'],
    [y(75), y(115), '#0C0B0A'],
  ];
  strata.forEach(([y0, y1, col], idx) => {
    b += `<rect x="180" y="${y0}" width="${W - 360}" height="${y1 - y0}" fill="${col}"/>`;
    for (let sx = 220; sx < W - 220; sx += 180) {
      b += `<line x1="${sx}" y1="${y0 + 18}" x2="${sx + 70}" y2="${y0 + 18}" stroke="#25211D" stroke-width="2"/>`;
    }
  });
  // Surface horizon line
  b += `<line x1="180" y1="${top}" x2="${W - 180}" y2="${top}" stroke="${C.amber}" stroke-width="3" stroke-dasharray="18 12" opacity="0.75"/>`;
  b += M(210, top - 22, 'SURFACE DATUM · 0 METERS (SOLID GRANITE RIDGE)', { size: 30, fill: C.amber });

  // Depth ruler on left & right
  for (let m = 20; m <= 100; m += 20) {
    b += `<line x1="180" y1="${y(m)}" x2="${W - 180}" y2="${y(m)}" stroke="#242B35" stroke-width="2" stroke-dasharray="6 14"/>`;
    b += M(210, y(m) - 14, `-${m}m (${Math.round(m * 3.281)} ft)`, { size: 32, fill: C.sub });
  }

  // GBU-57 MOP Penetration Shaft (Left-Center)
  const bx = 1120;
  b += `<rect x="${bx - 90}" y="${top - 180}" width="180" height="${180 + 60 * mpx}" fill="${C.blue}" opacity="0.14"/>`;
  b += `<line x1="${bx}" y1="${top - 220}" x2="${bx}" y2="${y(60) - 25}" stroke="${C.blue}" stroke-width="14"/>`;
  b += `<polygon points="${bx - 36},${y(60) - 45} ${bx + 36},${y(60) - 45} ${bx},${y(60) + 10}" fill="${C.blue}"/>`;
  // Detonation shockwave rings at -60m
  b += `<circle cx="${bx}" cy="${y(60)}" r="46" fill="none" stroke="${C.blue}" stroke-width="5"/>`;
  b += `<circle cx="${bx}" cy="${y(60)}" r="88" fill="none" stroke="${C.blue}" stroke-width="3" stroke-dasharray="12 10" opacity="0.7"/>`;
  // Callout box for GBU-57
  b += `<rect x="${bx + 130}" y="${y(60) - 135}" width="920" height="185" fill="${C.blueDark}" stroke="${C.blue}" stroke-width="3"/>`;
  b += M(bx + 165, y(60) - 80, 'US GBU-57A/B MASSIVE ORDNANCE PENETRATOR', { size: 32, fill: C.blue });
  b += T(bx + 165, y(60) - 20, 'Max Penetration: ≈60 m (200 ft)', { size: 50, w: 800, fill: C.text });
  b += T(bx + 165, y(60) + 28, '13,600 kg conventional bunker buster limit', { size: 34, w: 500, fill: C.sub });

  // Unreached granite gap indicator (-60m to -80m)
  b += `<line x1="2260" y1="${y(60)}" x2="2260" y2="${y(80)}" stroke="${C.red}" stroke-width="6"/>`;
  b += `<line x1="2235" y1="${y(60)}" x2="2285" y2="${y(60)}" stroke="${C.red}" stroke-width="6"/>`;
  b += `<line x1="2235" y1="${y(80)}" x2="2285" y2="${y(80)}" stroke="${C.red}" stroke-width="6"/>`;
  b += M(2210, y(71), '20–40m SOLID GRANITE BUFFER', { size: 30, fill: C.red, a: 'end' });

  // Pickaxe Mountain Underground Halls (-80m to -100m)
  const hx = 2340, hw = 1180;
  b += `<rect x="${hx}" y="${y(80)}" width="${hw}" height="${20 * mpx}" fill="${C.amberDark}" stroke="${C.amber}" stroke-width="5"/>`;
  for (let i = 1; i < 5; i++) {
    b += `<line x1="${hx + (hw * i) / 5}" y1="${y(80)}" x2="${hx + (hw * i) / 5}" y2="${y(100)}" stroke="${C.amber}" stroke-width="3" opacity="0.5"/>`;
  }
  b += M(hx + hw / 2, y(80) - 70, 'ESTIMATED PICKAXE MOUNTAIN HALLS (4 TUNNEL ENTRANCES)', { size: 32, fill: C.amber, a: 'middle' });
  b += T(hx + hw / 2, y(80) - 18, '80–100 m Deep (260–330 ft) · Never Inspected by IAEA', { size: 42, w: 700, fill: C.text, a: 'middle' });
  b += M(hx + hw / 2, y(92), 'CENTRIFUGE ASSEMBLY / STORAGE CHAMBERS (UNCONFIRMED)', { size: 30, fill: C.amber, a: 'middle' });

  // Carlson 300 ft claim line (-91.4m)
  b += `<line x1="480" y1="${y(91.4)}" x2="${hx - 30}" y2="${y(91.4)}" stroke="${C.red}" stroke-width="5" stroke-dasharray="22 14"/>`;
  b += M(500, y(91.4) - 20, 'CARLSON POST CLAIM: "300 FEET OF SOLID GRANITE" (≈91.4m)', { size: 32, fill: C.red });

  b += srcLine('SOURCES: JAMES MARTIN CNS VIA AP (2023) · CSIS SATELLITE ANALYSIS (2026) · ILLUSTRATIVE VERTICAL PROFILE');
  render(svg(b, true, C.amber, true), 'G01_depth_crosssection');
}

// ============================================================================
// 2. G02 — Iran's 60% Enriched Uranium Stockpile
// ============================================================================
{
  let b = headerBlock('IAEA VERIFICATION SAFEGUARDS // FISSILE MATERIAL LEDGER', "Iran's 60% Enriched Uranium Stockpile", 'Reported inventory prior to the June 2025 strikes vs. theoretical weapons threshold', C.amber, 'REPORT REF: GOV/2025/MAY-SEP');

  // Left Card: Enrichment Ladder (3.67% -> 20% -> 60% -> 90%)
  b += `<rect x="180" y="450" width="1180" height="1280" fill="${C.panel}" stroke="${C.line}" stroke-width="3"/>`;
  b += M(240, 530, 'ISOTOPE ENRICHMENT LADDER (U-235 PURITY)', { size: 32, fill: C.amber });
  const steps = [
    ['3.67%', '2015 JCPOA Civil Power Limit', 180, C.blue],
    ['20.0%', 'Research Reactor / Medical Isotope Level', 380, C.blue],
    ['60.0%', 'Iran Stockpile Before June 2025 Strikes', 820, C.amber],
    ['90.0%', 'Weapons-Grade Threshold (Short Step)', 1040, C.red],
  ];
  steps.forEach(([pct, desc, bw, col], i) => {
    const sy = 640 + i * 265;
    b += S(240, sy, pct, { size: 84, w: 900, fill: col });
    b += T(560, sy - 24, desc, { size: 36, w: 600, fill: C.text });
    b += `<rect x="240" y="${sy + 28}" width="1040" height="36" fill="#18202C"/>`;
    b += `<rect x="240" y="${sy + 28}" width="${bw}" height="36" fill="${col}"/>`;
  });

  // Right Panel: 440.9 kg Stockpile vs 42 kg Significant Quantity
  b += `<rect x="1440" y="450" width="2220" height="1280" fill="${C.panel}" stroke="${C.line}" stroke-width="3"/>`;
  b += M(1520, 530, 'STOCKPILE MASS COMPARISON (60% ENRICHED UF6)', { size: 32, fill: C.sub });

  // 10-Canister visual grid representing ~440.9 kg (each canister ~42-44 kg)
  b += S(1520, 675, '440.9 kg', { size: 120, w: 900, fill: C.amber });
  b += T(2080, 635, 'Total 60% U-235 Inventory', { size: 52, w: 700, fill: C.text });
  b += T(2080, 690, 'Verified by IAEA inspectors prior to June 2025 strikes ("more than 400 kg")', { size: 36, w: 500, fill: C.sub });

  // Draw 10 uranium cylinder icons — first one highlighted in crimson as 42 kg = 1 bomb
  for (let i = 0; i < 10; i++) {
    const cx = 1530 + i * 205, cy = 790, cw = 165, ch = 360;
    const isBomb = i === 0;
    const col = isBomb ? C.red : C.amber;
    const fillCol = isBomb ? C.redDark : C.amberDark;
    b += `<rect x="${cx}" y="${cy}" width="${cw}" height="${ch}" rx="18" fill="${fillCol}" stroke="${col}" stroke-width="${isBomb ? 6 : 3}"/>`;
    b += `<line x1="${cx + 25}" y1="${cy + 60}" x2="${cx + cw - 25}" y2="${cy + 60}" stroke="${col}" stroke-width="3" opacity="0.65"/>`;
    b += `<line x1="${cx + 25}" y1="${cy + ch - 60}" x2="${cx + cw - 25}" y2="${cy + ch - 60}" stroke="${col}" stroke-width="3" opacity="0.65"/>`;
    b += M(cx + cw / 2, cy + ch / 2 + 12, isBomb ? '≈42 kg' : '44 kg', { size: 34, fill: col, a: 'middle' });
    b += M(cx + cw / 2, cy + ch + 48, isBomb ? '1 BOMB EQ.' : `UNIT ${String(i + 1).padStart(2, '0')}`, { size: 24, fill: isBomb ? C.red : C.dim, a: 'middle' });
  }

  // Callout for 42 kg threshold
  b += `<rect x="1520" y="1260" width="2060" height="210" fill="${C.redDark}" stroke="${C.red}" stroke-width="3"/>`;
  b += S(1570, 1385, '≈42 kg', { size: 92, w: 900, fill: C.red });
  b += M(1960, 1335, 'IAEA SIGNIFICANT QUANTITY YARDSTICK', { size: 30, fill: C.red });
  b += T(1960, 1395, 'Enough, in theory, for ONE nuclear weapon if further enriched to 90%', { size: 44, w: 700, fill: C.text });

  // Verified Context Bar at bottom of right panel
  b += `<rect x="1520" y="1510" width="2060" height="160" fill="#0C131F" stroke="${C.blue}" stroke-width="3"/>`;
  b += M(1570, 1568, 'INTELLIGENCE CONSENSUS // ON THE RECORD', { size: 28, fill: C.blue });
  b += T(1570, 1625, 'Neither the IAEA nor US intelligence believes Iran has had an active weapons program since 2003.', { size: 38, w: 600, fill: C.text });

  b += srcLine('SOURCES: IAEA VERIFICATION REPORTS (MAY & SEPT 2025) VIA ASSOCIATED PRESS · ARMS CONTROL ASSOCIATION');
  render(svg(b, true, C.amber), 'G02_uranium_stockpile');
}

// ============================================================================
// 3. G03 — Plan A Board + Phase Cards
// ============================================================================
{
  let b = headerBlock('WAR-GAME SIMULATION // PRINCETON PROGRAM ON SCIENCE & GLOBAL SECURITY', 'Plan A: NATO–Russia Escalation Model', 'Immediate blast and thermal casualties in the first 5 hours — before radioactive fallout', C.red, 'MODEL: NUKEMAP / SGS (2019)');
  const phases = [
    ['01 // TACTICAL EXCHANGE', 'FIRST 3 HOURS', '2.6M', 'Immediate Casualties', '300 warheads strike military & command targets across Europe', C.amber, '#23190B'],
    ['02 // STRATEGIC FORCE', '+45 MINUTES', '3.4M', 'Additional Casualties', 'ICBM & SLBM salvos hit nuclear forces in Russia and the US', C.amber, '#29150D'],
    ['03 // COUNTERVALUE', 'FINAL 45 MINUTES', '85.3M', 'Urban Casualties', 'Up to 10 warheads per city target political & economic centers', C.red, '#2E0F12'],
    ['04 // TOTAL TOLL', 'UNDER 5 HOURS', '91.5M', '34.1M Dead · 57.4M Injured', 'Immediate casualties only — excludes long-term global fallout', C.red, '#3D0C11'],
  ];
  phases.forEach((p, i) => {
    const x = 180 + i * 885, y = 470, w = 825, h = 1320;
    const isTotal = i === 3;
    let card = `<g>`;
    card += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${p[6]}" stroke="${p[5]}" stroke-width="${isTotal ? 6 : 3}"/>`;
    card += `<rect x="${x}" y="${y}" width="${w}" height="12" fill="${p[5]}"/>`;
    card += M(x + 54, y + 96, p[0], { size: 32, fill: p[5], ls: 4 });
    card += `<rect x="${x + 54}" y="${y + 135}" width="${w - 108}" height="64" fill="#0B0E14" stroke="${C.line}" stroke-width="2"/>`;
    card += M(x + 80, y + 178, `WINDOW: ${p[1]}`, { size: 30, fill: C.text });
    card += S(x + 54, y + 470, p[2], { size: 176, w: 900, fill: isTotal ? C.red : C.text });
    card += T(x + 54, y + 560, p[3], { size: 44, w: 700, fill: p[5] });
    card += `<line x1="${x + 54}" y1="${y + 630}" x2="${x + w - 54}" y2="${y + 630}" stroke="${C.line}" stroke-width="2"/>`;
    wrap(p[4], 28).forEach((ln, j) => {
      card += T(x + 54, y + 720 + j * 58, ln, { size: 40, w: 500, fill: C.sub });
    });
    // Escalation bar at bottom of card
    const barFill = [0.18, 0.38, 0.88, 1.0][i];
    card += M(x + 54, y + h - 130, `ESCALATION INTENSITY: ${Math.round(barFill * 100)}%`, { size: 26, fill: C.dim });
    card += `<rect x="${x + 54}" y="${y + h - 100}" width="${w - 108}" height="24" fill="#090C10"/>`;
    card += `<rect x="${x + 54}" y="${y + h - 100}" width="${(w - 108) * barFill}" height="24" fill="${p[5]}"/>`;
    card += `</g>`;
    b += card;
    render(svg(card, false), `G03_planA_phase${i + 1}_card_alpha`);
  });
  b += srcLine('SOURCE: PRINCETON PROGRAM ON SCIENCE & GLOBAL SECURITY, "PLAN A" SIMULATION (SEPT 2019)');
  render(svg(b, true, C.red), 'G03_planA_board');
}

// ============================================================================
// 4. G04 — Doomsday Clock (85 Seconds to Midnight)
// ============================================================================
{
  let b = headerBlock('BULLETIN OF THE ATOMIC SCIENTISTS // 27 JANUARY 2026', '85 Seconds to Midnight', 'The closest the Doomsday Clock has ever stood to global catastrophe', C.red, 'CLOCK STATUS: 23:58:35');
  const cx = 1320, cy = 1160, r = 640;
  b += `<circle cx="${cx}" cy="${cy}" r="${r + 45}" fill="none" stroke="${C.line}" stroke-width="2" stroke-dasharray="10 10"/>`;
  b += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#0D1118" stroke="#2D3748" stroke-width="8"/>`;
  // Danger red arc between 55m and 60m
  b += `<path d="M ${cx - r * Math.sin((85 / 3600) * 2 * Math.PI * 6)} ${cy - r * Math.cos((85 / 3600) * 2 * Math.PI * 6)} A ${r} ${r} 0 0 1 ${cx} ${cy - r} L ${cx} ${cy} Z" fill="${C.red}" opacity="0.22"/>`;
  for (let i = 0; i < 60; i++) {
    const a = (i / 60) * 2 * Math.PI;
    const isMaj = i % 5 === 0;
    const l = isMaj ? 75 : 32;
    b += `<line x1="${cx + Math.sin(a) * (r - 28)}" y1="${cy - Math.cos(a) * (r - 28)}" x2="${cx + Math.sin(a) * (r - 28 - l)}" y2="${cy - Math.cos(a) * (r - 28 - l)}" stroke="${i === 0 ? C.red : isMaj ? C.text : '#3A4659'}" stroke-width="${i === 0 ? 14 : isMaj ? 8 : 4}"/>`;
  }
  S(cx, cy - r + 175, 'XII', { size: 78, w: 900, fill: C.red, a: 'middle' });
  const sec = 85, am = -(sec / 3600) * 2 * Math.PI * 5; // exaggerated angle so 85s gap is visually clear
  const ah = -(sec / 43200) * 2 * Math.PI * 5;
  b += `<line x1="${cx}" y1="${cy}" x2="${cx + Math.sin(ah) * (r * 0.52)}" y2="${cy - Math.cos(ah) * (r * 0.52)}" stroke="${C.text}" stroke-width="26" stroke-linecap="round"/>`;
  b += `<line x1="${cx}" y1="${cy}" x2="${cx + Math.sin(am) * (r * 0.82)}" y2="${cy - Math.cos(am) * (r * 0.82)}" stroke="${C.red}" stroke-width="14" stroke-linecap="round"/>`;
  b += `<circle cx="${cx}" cy="${cy}" r="32" fill="${C.red}"/><circle cx="${cx}" cy="${cy}" r="14" fill="${C.text}"/>`;

  // Right Dossier Readout
  const rx = 2160;
  b += `<rect x="${rx}" y="540" width="1460" height="1180" fill="${C.panel}" stroke="${C.line}" stroke-width="3"/>`;
  b += M(rx + 70, 640, 'HISTORICAL PROXIMITY TO MIDNIGHT', { size: 32, fill: C.amber });
  const hist = [
    ['1947', '7 Minutes', 'Clock created after Hiroshima & Nagasaki', C.sub],
    ['1953', '2 Minutes', 'US and Soviet thermonuclear tests', C.amber],
    ['1991', '17 Minutes', 'End of Cold War · START treaty signed', C.blue],
    ['2023', '90 Seconds', 'War in Ukraine & nuclear threats', C.amber],
    ['2026', '85 Seconds', 'Record closest setting · Jan 27, 2026', C.red],
  ];
  hist.forEach(([yr, tm, d, col], i) => {
    const hy = 760 + i * 185;
    if (i === 4) b += `<rect x="${rx + 45}" y="${hy - 68}" width="1370" height="145" fill="${C.redDark}" stroke="${C.red}" stroke-width="3"/>`;
    b += S(rx + 80, hy, yr, { size: 68, w: 900, fill: col });
    b += T(rx + 320, hy - 14, tm, { size: 52, w: 800, fill: C.text });
    b += T(rx + 320, hy + 40, d, { size: 34, w: 500, fill: C.sub });
  });
  b += srcLine('SOURCE: BULLETIN OF THE ATOMIC SCIENTISTS (27 JAN 2026) · ILLUSTRATIVE CLOCK DIAGRAM');
  render(svg(b, true, C.red), 'G04_doomsday_clock_85s');
}

// ============================================================================
// 5. G05 & G06 — Investigative Timelines (Zero Edge Clipping, Safe Margin x=440..3400)
// ============================================================================
function timeline(name, kicker, title, sub, items, srcTxt, accent = C.amber) {
  let b = headerBlock(kicker, title, sub, accent);
  const y = 1150, x0 = 460, x1 = W - 460;
  // Glowing timeline spine
  b += `<line x1="${x0 - 80}" y1="${y}" x2="${x1 + 80}" y2="${y}" stroke="${C.line}" stroke-width="10"/>`;
  b += `<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="${accent}" stroke-width="4" opacity="0.8"/>`;

  items.forEach((it, i) => {
    const x = x0 + ((x1 - x0) * i) / (items.length - 1);
    const up = i % 2 === 0;
    const col = it[2] || C.text;
    const stemY = up ? y - 160 : y + 160;
    const cardW = 460, cardH = 310;
    const cardX = Math.max(190, Math.min(W - 190 - cardW, x - cardW / 2));
    const cardY = up ? y - 160 - cardH : y + 160;

    b += `<line x1="${x}" y1="${y}" x2="${x}" y2="${stemY}" stroke="${col}" stroke-width="4"/>`;
    b += `<circle cx="${x}" cy="${y}" r="26" fill="${C.bg}" stroke="${col}" stroke-width="7"/>`;
    b += `<circle cx="${x}" cy="${y}" r="11" fill="${col}"/>`;

    b += `<rect x="${cardX}" y="${cardY}" width="${cardW}" height="${cardH}" fill="${C.panel}" stroke="${col === C.text ? C.line : col}" stroke-width="3"/>`;
    b += `<rect x="${cardX}" y="${cardY}" width="${cardW}" height="8" fill="${col}"/>`;
    b += S(cardX + 32, cardY + 76, it[0], { size: 52, w: 900, fill: col });
    wrap(it[1], 24).forEach((l, j) => {
      b += T(cardX + 32, cardY + 145 + j * 48, l, { size: 34, w: 500, fill: C.text });
    });
  });
  b += srcLine(srcTxt);
  render(svg(b, true, accent), name);
}

timeline(
  'G05_timeline_2025_2026',
  'CHRONOLOGY OF ESCALATION // 2025–2026',
  'How We Got Here',
  'Verified military & diplomatic events surrounding an unverified claim',
  [
    ['Jun 2025', 'Operation Midnight Hammer strikes Fordow, Natanz, Isfahan'],
    ['Feb 2026', 'US & Israeli strikes on Iran trigger regional war'],
    ['Spring 2026', 'Naval & missile clashes in the Strait of Hormuz'],
    ['15 Oct', 'Trump on Newsmax: "I wouldn\'t use nuclear"', C.blue],
    ['1 Nov', 'Carlson X post claims strike within days (unverified)', C.red],
    ['2 Nov', 'US hits Qeshm · Trump says "no rush" in Axios interview', C.blue],
    ['3 Nov', 'US midterm elections held nationwide'],
    ['7 Nov?', 'Earliest possible date alleged in Carlson post', C.amber],
  ],
  'SOURCES: CNN, REUTERS, AXIOS, AL JAZEERA, ANADOLU AGENCY, NEWSMAX INTERVIEW (15 OCT 2026)',
  C.red
);

timeline(
  'G06_taboo_timeline_1945_2026',
  'EIGHT DECADES OF RESTRAINT // 1945–2026',
  'The Nuclear Taboo',
  'Crises where nuclear weapons were considered — and never used',
  [
    ['Aug 1945', 'US atomic bombings of Hiroshima & Nagasaki', C.amber],
    ['1950–53', 'Korean War: tactical nuclear options rejected'],
    ['1954–58', 'Taiwan Strait crises: Eisenhower pulls back'],
    ['1964', 'LBJ: "19 perilous years" without loosing the atom', C.blue],
    ['1965–73', 'Vietnam War: massive bombing, zero nuclear use'],
    ['Sep 1983', 'Stanislav Petrov blocks Soviet false alarm', C.red],
    ['1991', 'Gulf War: conventional precision replaces nuclear'],
    ['Jan 2026', 'Doomsday Clock reaches 85 seconds to midnight', C.red],
  ],
  'SOURCES: NINA TANNENWALD, "THE NUCLEAR TABOO" · AMERICAN PRESIDENCY PROJECT · BULLETIN OF THE ATOMIC SCIENTISTS',
  C.amber
);

// ============================================================================
// 6. G07 — South Asia Ballistic Flight Timer (8–12 Minutes)
// ============================================================================
{
  let b = headerBlock('SOUTH ASIA BALLISTIC TELEMETRY // RAWALPINDI ↔ NEW DELHI', 'Zero Decision Window', 'Approximate ballistic missile flight time between India and Pakistan', C.red, 'RANGE: ≈680 KM · MACH 6–8');
  b += `<rect x="420" y="520" width="3000" height="1220" fill="${C.panel}" stroke="${C.red}" stroke-width="4"/>`;
  b += M(1920, 660, 'ESTIMATED BALLISTIC TIME OF FLIGHT // LAUNCH TO IMPACT', { size: 38, fill: C.amber, a: 'middle', ls: 8 });
  b += S(1920, 1180, '08:00 – 12:00', { size: 340, w: 900, fill: C.red, a: 'middle' });
  b += M(1920, 1340, 'MINUTES FROM DETECTION TO DETONATION', { size: 54, fill: C.text, a: 'middle', ls: 12 });
  b += `<line x1="720" y1="1440" x2="3120" y2="1440" stroke="${C.line}" stroke-width="3"/>`;
  b += M(1920, 1540, 'NUR KHAN AIR BASE (RAWALPINDI) IS 10 KM FROM ISLAMABAD & PAKISTAN STRATEGIC PLANS DIVISION', { size: 32, fill: C.sub, a: 'middle' });
  b += srcLine('SOURCE: BALLISTIC TRAJECTORY ESTIMATES CITED BY ARMS CONTROL & SOUTH ASIA SECURITY ANALYSTS');
  render(svg(b, true, C.red), 'G07_missile_timer');
}

// ============================================================================
// 7. Q01–Q04 — Forensic Dossier & Broadcast Transcript Quote Cards (NO TILTED STAMPS!)
// ============================================================================
// Q01: Carlson X Post Dossier Cutout (Integrated Unverified Status Header)
function makeQ01() {
  let b = headerBlock('PRIMARY CLAIM ANALYSIS // SOCIAL MEDIA DISPATCH', 'Tucker Carlson · Post on X', 'Published Sunday, November 1, 2026 at 8:47 p.m. ET (≈750-word post)', C.red, 'STATUS: UNVERIFIED');
  // Top verification alert banner (replaces ugly tilted stamp!)
  b += `<rect x="340" y="470" width="3160" height="110" fill="${C.redDark}" stroke="${C.red}" stroke-width="3"/>`;
  b += `<circle cx="410" cy="525" r="16" fill="${C.red}"/>`;
  b += M(455, 537, 'VERIFICATION STATUS: UNVERIFIED CLAIM — NO SUPPORTING DOCUMENTS OR PENTAGON CONFIRMATION', { size: 34, fill: C.text, ls: 3 });

  // Forensic X-post dossier card
  b += `<rect x="340" y="620" width="3160" height="1120" fill="#0B0E13" stroke="${C.line}" stroke-width="4"/>`;
  // Author header inside card
  b += `<circle cx="510" cy="790" r="76" fill="#1F2733" stroke="${C.red}" stroke-width="3"/>`;
  b += M(510, 812, 'TC', { size: 54, fill: C.text, a: 'middle' });
  b += T(630, 775, 'Tucker Carlson', { size: 64, w: 800, fill: C.text });
  b += M(630, 838, '@TuckerCarlson · Commentator & Former Broadcast Host', { size: 36, fill: C.sub });
  b += M(3360, 785, '01 NOV 2026 · 20:47 EST', { size: 36, fill: C.amber, a: 'end' });
  b += `<line x1="430" y1="910" x2="3410" y2="910" stroke="${C.line}" stroke-width="2"/>`;

  // Highlight bars behind key phrases
  b += `<rect x="1920" y="1025" width="760" height="115" fill="${C.amber}" opacity="0.24"/>`;
  b += `<rect x="1920" y="1135" width="760" height="6" fill="${C.amber}"/>`;
  b += `<rect x="920" y="1195" width="1440" height="115" fill="${C.red}" opacity="0.25"/>`;
  b += `<rect x="920" y="1305" width="1440" height="6" fill="${C.red}"/>`;

  b += S(450, 1110, '“…the Trump administration may be within days', { size: 96, w: 700, it: true, fill: C.text });
  b += S(450, 1280, 'of launching a nuclear strike on Iran.”', { size: 96, w: 700, it: true, fill: C.text });

  // Bottom forensic metadata strip
  b += `<line x1="430" y1="1470" x2="3410" y2="1470" stroke="${C.line}" stroke-width="2"/>`;
  b += M(450, 1555, 'NAMED TARGET: PICKAXE MOUNTAIN (KUH-E KOLANG GAZ LA)', { size: 34, fill: C.amber });
  b += M(3390, 1555, 'ALLEGED WINDOW: AS EARLY AS NOV 7, 2026', { size: 34, fill: C.red, a: 'end' });
  b += M(450, 1635, 'CITED REASONING: 300 FT GRANITE DEPTH BEYOND CONVENTIONAL BUNKER-BUSTERS', { size: 32, fill: C.sub });

  b += srcLine('RECONSTRUCTED EXCERPT FROM PUBLIC POST ON X (1 NOV 2026) · REPORTED AS UNVERIFIED BY MAJOR OUTLETS');
  render(svg(b, true, C.red), 'Q01_carlson_post');
  render(svg(b, false), 'Q01_carlson_post_alpha');
}
makeQ01();

function makeTranscriptQuote(name, kicker, who, role, when, quoteLines, highlightWord, statusLabel, accent) {
  let b = headerBlock(kicker, who, `${role} · ${when}`, accent, statusLabel);
  // Main Editorial Pull-Quote Canvas
  b += `<rect x="260" y="480" width="3320" height="1240" fill="${C.panel}" stroke="${C.line}" stroke-width="3"/>`;
  b += `<rect x="260" y="480" width="20" height="1240" fill="${accent}"/>`;
  // Top metadata bar
  b += `<rect x="360" y="560" width="680" height="72" fill="${accent === C.blue ? C.blueDark : C.amberDark}" stroke="${accent}" stroke-width="2"/>`;
  b += M(395, 608, `● ${statusLabel}`, { size: 32, fill: accent, ls: 4 });
  b += M(3480, 608, when.toUpperCase(), { size: 32, fill: C.sub, a: 'end' });

  // Giant decorative editorial serif quotation mark
  b += S(350, 960, '“', { size: 360, w: 900, fill: accent, op: 0.22 });

  quoteLines.forEach((ln, i) => {
    b += S(460, 880 + i * 145, ln, { size: 102, w: 700, it: true, fill: C.text });
  });

  // Audio waveform / verification strip at bottom of card
  b += `<line x1="360" y1="1430" x2="3480" y2="1430" stroke="${C.line}" stroke-width="2"/>`;
  for (let wx = 380; wx < 1800; wx += 22) {
    const wh = 16 + Math.abs(Math.sin(wx * 0.13) * Math.cos(wx * 0.07)) * 75;
    b += `<rect x="${wx}" y="${1555 - wh / 2}" width="10" height="${wh}" fill="${accent}" opacity="0.65"/>`;
  }
  b += M(1880, 1568, `VERIFIED PUBLIC STATEMENT // ${highlightWord}`, { size: 34, fill: accent });
  b += srcLine(`SOURCE: ${when.toUpperCase()} · OFFICIAL PUBLIC RECORD`);
  render(svg(b, true, accent), name);
  render(svg(b, false), name + '_alpha');
}

makeTranscriptQuote(
  'Q02_trump_oct15',
  'WHITE HOUSE RECORD // PRESIDENTIAL INTERVIEW',
  'President Donald Trump',
  'President of the United States',
  'Newsmax Interview · 15 October 2026',
  ['“I wouldn’t use nuclear.', 'We don’t have to.”'],
  'DIRECT REJECTION OF NUCLEAR USE',
  'ON THE RECORD · VERIFIED',
  C.blue
);

makeTranscriptQuote(
  'Q03_trump_axios',
  'WHITE HOUSE RECORD // EVE OF MIDTERM ELECTIONS',
  'President Donald Trump',
  'President of the United States',
  'Axios Interview · Released 2 November 2026',
  ['“One way or the other, we will', 'do something, but there is no rush.”'],
  'SAID "NO" TO MAJOR POST-ELECTION ATTACK',
  'ON THE RECORD · VERIFIED',
  C.blue
);

// Q04: Medvedev Two-Part Dispatch + Walkback
{
  let b = headerBlock('RUSSIAN SECURITY COUNCIL // RHETORIC VS. CLARIFICATION', 'Dmitry Medvedev', 'Deputy Chairman, Security Council of Russia · Post on X (22 June 2025)', C.amber, 'DOCUMENTED STATEMENT');
  b += `<rect x="260" y="480" width="3320" height="840" fill="${C.panel}" stroke="${C.line}" stroke-width="3"/>`;
  b += `<rect x="260" y="480" width="18" height="840" fill="${C.red}"/>`;
  b += M(340, 575, 'INITIAL POST AFTER US STRIKES ON IRAN // 22 JUNE 2025', { size: 32, fill: C.red });
  b += S(340, 760, '“A number of countries are ready to directly', { size: 94, w: 700, it: true, fill: C.text });
  b += S(340, 895, 'supply Iran with their own nuclear warheads.”', { size: 94, w: 700, it: true, fill: C.text });
  b += M(340, 1180, 'CONTEXT: POSTED IMMEDIATELY AFTER OPERATION MIDNIGHT HAMMER', { size: 32, fill: C.sub });

  // Subsequent Walkback Box below
  b += `<rect x="260" y="1390" width="3320" height="340" fill="${C.amberDark}" stroke="${C.amber}" stroke-width="4"/>`;
  b += M(340, 1485, 'SUBSEQUENT CLARIFICATION // WALKED BACK ON THE RECORD', { size: 34, fill: C.amber });
  b += T(340, 1585, 'Medvedev later clarified Russia had no intention of supplying nuclear warheads to Iran.', { size: 52, w: 700, fill: C.text });
  b += srcLine('SOURCE: DMITRY MEDVEDEV PUBLIC POSTS ON X (JUNE 2025) & SUBSEQUENT CLARIFICATION');
  render(svg(b, true, C.amber), 'Q04_medvedev');
  render(svg(b, false), 'Q04_medvedev_alpha');
}

// ============================================================================
// 8. S01–S04 Status Badges (Sleek Horizontal HUD Tags — NO TILTED RUBBER STAMPS)
// ============================================================================
function statusBadge(name, label, sub, col, darkCol) {
  const b = `<g>
    <rect x="2560" y="140" width="1100" height="140" fill="${darkCol}" stroke="${col}" stroke-width="4"/>
    <rect x="2560" y="140" width="18" height="140" fill="${col}"/>
    <circle cx="2635" cy="210" r="14" fill="${col}"/>
    ${M(2675, 202, label, { size: 42, fill: C.text, ls: 6 })}
    ${M(2675, 250, sub, { size: 24, fill: col, ls: 3 })}
  </g>`;
  render(svg(b, false), name);
}
statusBadge('S01_stamp_UNVERIFIED', 'UNVERIFIED CLAIM', 'NO OFFICIAL CONFIRMATION', C.red, C.redDark);
statusBadge('S02_stamp_DOCUMENTED', 'DOCUMENTED RECORD', 'VERIFIED HISTORICAL SOURCE', C.blue, C.blueDark);
statusBadge('S03_stamp_SCENARIO', 'SCENARIO ANALYSIS', 'NOT A PREDICTION OR PLAN', C.amber, C.amberDark);
statusBadge('S04_stamp_FALSE_ALARM', 'FALSE ALARM CONFIRMED', 'SOLAR GLINT ON CLOUDS · 1983', C.amber, C.amberDark);

// ============================================================================
// 9. L01–L07 Lower Thirds (Positioned at y=1380 so they NEVER touch captions!)
// ============================================================================
function lower(name, a, b2, code = 'SUBJECT ID // ON RECORD', accent = C.red) {
  const w = Math.max(a.length * 52, b2.length * 31) + 260;
  const y = 1380;
  let b = `<g>
    <rect x="180" y="${y}" width="${w}" height="250" fill="#0A0E15" opacity="0.94" stroke="${C.line}" stroke-width="3"/>
    <rect x="180" y="${y}" width="16" height="250" fill="${accent}"/>
    <line x1="196" y1="${y + 62}" x2="${180 + w}" y2="${y + 62}" stroke="${C.line}" stroke-width="2"/>
    ${M(235, y + 44, code, { size: 26, fill: accent, ls: 5 })}
    ${S(235, y + 148, a, { size: 76, w: 900, fill: C.text })}
    ${T(235, y + 212, b2, { size: 40, w: 500, fill: C.sub })}
  </g>`;
  render(svg(b, false), name);
}
lower('L01_lower_tucker_carlson', 'Tucker Carlson', 'Political Commentator · Former Broadcast Host', 'SOURCE // PUBLIC POST ON X', C.red);
lower('L02_lower_trump', 'Donald J. Trump', 'President of the United States', 'ON THE RECORD // WHITE HOUSE', C.blue);
lower('L03_lower_medvedev', 'Dmitry Medvedev', 'Deputy Chairman, Security Council of Russia', 'MOSCOW // SECURITY COUNCIL', C.amber);
lower('L04_lower_petrov', 'Lt. Col. Stanislav Petrov', 'Soviet Air Defence Forces Duty Officer · 1983', 'SERPUKHOV-15 // 26 SEPT 1983', C.amber);
lower('L05_lower_lbj', 'Lyndon B. Johnson', '36th President of the United States · Sept 1964', 'ARCHIVAL RECORD // 1964 CAMPAIGN', C.blue);
lower('L06_lower_eisenhower', 'Dwight D. Eisenhower', '34th President of the United States · 1950s', 'DECLASSIFIED RECORD // TAIWAN STRAIT', C.blue);
lower('L07_lower_scenario', 'Scenario Analysis — Not a Prediction', 'Synthesized from public statements, history & Princeton war games', 'EDITORIAL METHODOLOGY // VERION', C.amber);

// ============================================================================
// 10. T01–T09 Architectural Documentary Chapter Cards
// ============================================================================
const chapters = [
  ['T01', 'THE POST', 'CHAPTER 01 // SUNDAY, NOVEMBER 1, 2026', 'How a 750-word social media claim ignited a global debate', C.red],
  ['T02', 'THE MOUNTAIN', 'CHAPTER 02 // KUH-E KOLANG GAZ LA', '80 to 100 meters of solid granite south of Natanz', C.amber],
  ['T03', 'THE NUCLEAR TABOO', 'CHAPTER 03 // EIGHTY YEARS OF RESTRAINT', 'The invisible line no nation has crossed since August 1945', C.amber],
  ['T04', 'DOMINO 1 · RUSSIA', 'CHAPTER 04 // REWRITING THE RULES OF WAR', 'What happens when the largest nuclear arsenal points to precedent', C.red],
  ['T05', 'DOMINO 2 · SOUTH ASIA', 'CHAPTER 05 // EIGHT TO TWELVE MINUTES', 'India, Pakistan, and the shadow of May 2025 at Nur Khan', C.amber],
  ['T06', 'DOMINO 3 · EAST ASIA', 'CHAPTER 06 // THE UMBRELLA TESTED', 'The Taiwan Strait and overnight nuclear recalculation', C.blue],
  ['T07', 'PLAN A', 'CHAPTER 07 // PRINCETON ESCALATION SIMULATION', 'How a single tactical nuclear strike spirals to 91.5 million casualties', C.red],
  ['T08', 'THE HUMAN FACTOR', 'CHAPTER 08 // SERPUKHOV-15 · SEPTEMBER 26, 1983', 'When five phantom missiles locked on and one officer waited', C.amber],
  ['T09', 'WHAT HOLDS THE LINE', 'CHAPTER 09 // THE ANATOMY OF HESITATION', 'Allies, planners, memory, and the pause before the abyss', C.blue],
];
chapters.forEach(([id, title, code, sub, col]) => {
  let b = `<line x1="1920" y1="220" x2="1920" y2="680" stroke="${C.line}" stroke-width="2" stroke-dasharray="10 10"/>`;
  b += `<line x1="1920" y1="1480" x2="1920" y2="1940" stroke="${C.line}" stroke-width="2" stroke-dasharray="10 10"/>`;
  b += `<line x1="380" y1="1080" x2="860" y2="1080" stroke="${C.line}" stroke-width="2"/>`;
  b += `<line x1="2980" y1="1080" x2="3460" y2="1080" stroke="${C.line}" stroke-width="2"/>`;
  b += M(1920, 835, code, { size: 38, fill: col, a: 'middle', ls: 10 });
  b += S(1920, 1110, title, { size: 186, w: 900, fill: C.text, a: 'middle', ls: 6 });
  b += `<rect x="1480" y="1205" width="880" height="8" fill="${col}"/>`;
  b += T(1920, 1315, sub, { size: 46, w: 500, fill: C.sub, a: 'middle' });
  const fname = `${id}_chapter_${title.replace(/[^A-Z0-9]+/g, '_')}`;
  render(svg(b, true, col), fname);
  render(svg(b, false), `${fname}_alpha`);
});

// ============================================================================
// 11. G11 — 1983 Soviet Oko / Serpukhov-15 Bunker Terminal (Fallback 4K Still)
// ============================================================================
{
  let b = backdrop('#22C55E');
  // Outer Soviet CRT Console Frame
  b += `<rect x="240" y="180" width="3360" height="1800" rx="48" fill="#060D09" stroke="#1E3F29" stroke-width="8"/>`;
  b += `<rect x="300" y="240" width="3240" height="1680" rx="28" fill="#040A06" stroke="#2D6A40" stroke-width="3"/>`;
  // CRT Radar Grid on Left
  const rcx = 1060, rcy = 1080, rr = 560;
  for (let r = 140; r <= rr; r += 140) {
    b += `<circle cx="${rcx}" cy="${rcy}" r="${r}" fill="none" stroke="#143822" stroke-width="3"/>`;
  }
  b += `<line x1="${rcx - rr}" y1="${rcy}" x2="${rcx + rr}" y2="${rcy}" stroke="#143822" stroke-width="3"/>`;
  b += `<line x1="${rcx}" y1="${rcy - rr}" x2="${rcx}" y2="${rcy + rr}" stroke="#143822" stroke-width="3"/>`;
  // 5 ICBM tracks on polar scope
  for (let i = 0; i < 5; i++) {
    const tx = rcx - 260 + i * 55, ty = rcy - 290 + (i % 2) * 45;
    b += `<path d="M${tx},${ty} Q${rcx + 40},${rcy - 120} ${rcx + 180},${rcy + 160}" fill="none" stroke="${C.red}" stroke-width="4" stroke-dasharray="12 8"/>`;
    b += `<circle cx="${tx}" cy="${ty}" r="14" fill="${C.red}"/><circle cx="${tx}" cy="${ty}" r="28" fill="none" stroke="${C.red}" stroke-width="3"/>`;
  }
  b += M(rcx, rcy + rr + 65, 'POLAR ORBITAL TRACK // OKO SATELLITE SECTOR 04', { size: 30, fill: '#3DD68C', a: 'middle' });

  // Right Telemetry Panel
  const tx = 1820;
  b += M(tx, 390, 'СЕРПУХОВ-15 // SERPUKHOV-15 COMMAND BUNKER', { size: 38, fill: '#3DD68C', ls: 5 });
  b += M(tx, 455, '26 SEPT 1983 · 00:15 MSK · DUTY OFFICER: LT. COL. S. PETROV', { size: 32, fill: '#288656' });
  b += `<rect x="${tx}" y="530" width="1540" height="340" fill="#2A090C" stroke="${C.red}" stroke-width="5"/>`;
  b += M(tx + 770, 635, 'СИГНАЛ ТРЕВОГИ // SATELLITE ALERT', { size: 38, fill: C.amber, a: 'middle', ls: 6 });
  b += M(tx + 770, 800, 'MISSILE STRIKE', { size: 140, fill: C.red, a: 'middle', ls: 10 });

  // 5 Missile Lock Boxes
  for (let i = 0; i < 5; i++) {
    const bx = tx + i * 316;
    b += `<rect x="${bx}" y="940" width="290" height="220" fill="#18080A" stroke="${C.red}" stroke-width="3"/>`;
    b += M(bx + 145, 1015, `TRACK 0${i + 1}`, { size: 28, fill: C.amber, a: 'middle' });
    b += M(bx + 145, 1110, 'LOCKED', { size: 48, fill: C.red, a: 'middle' });
  }

  // Ground radar cross-check box
  b += `<rect x="${tx}" y="1230" width="1540" height="310" fill="#081A10" stroke="#3DD68C" stroke-width="4"/>`;
  b += M(tx + 50, 1315, 'GROUND RADAR CROSS-CHECK: 0 CONTACTS (CLEAR HORIZON)', { size: 36, fill: '#3DD68C' });
  b += M(tx + 50, 1395, 'PETROV ASSESSMENT: FALSE ALARM (5 MISSILES ≠ US FIRST STRIKE)', { size: 34, fill: C.text });
  b += M(tx + 50, 1475, 'CAUSE: SUNLIGHT REFLECTING OFF HIGH-ALTITUDE CLOUDS OVER MONTANA', { size: 30, fill: C.amber });

  b += srcLine('ILLUSTRATIVE RECONSTRUCTION OF 1983 SOVIET OKO EARLY-WARNING READOUT');
  render(svg(b, false), 'G11_petrov_warning_screen');
}

console.log('All redesigned 4K graphics generated successfully.');
