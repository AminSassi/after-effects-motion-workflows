// Minute 1 renderer — pure function of time: frame(t) -> SVG -> PNG.
// Upgraded with Playfair Display (editorial serif), Montserrat (geometric sans), Consolas (telemetry mono),
// archival Nagasaki & White House photos, and ZERO tilted rubber-stamp boxes.
import fs from 'fs';
import { Resvg } from '@resvg/resvg-js';
import opentype from 'opentype.js';
import { geoMercator, geoNaturalEarth1 } from 'd3-geo';

const W = 1920, H = 1080, FPS = 25;
const UF = 'C:/Users/PC/AppData/Local/Microsoft/Windows/Fonts/';
const WF = 'C:/Windows/Fonts/';
export const FONTFILES = [
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

const FM = {
  400: opentype.parse(fs.readFileSync(UF + 'Montserrat-Regular.ttf').buffer),
  500: opentype.parse(fs.readFileSync(UF + 'Montserrat-Medium.ttf').buffer),
  600: opentype.parse(fs.readFileSync(UF + 'Montserrat-SemiBold.ttf').buffer),
  700: opentype.parse(fs.readFileSync(UF + 'Montserrat-Bold.ttf').buffer),
  800: opentype.parse(fs.readFileSync(UF + 'Montserrat-ExtraBold.ttf').buffer),
  900: opentype.parse(fs.readFileSync(UF + 'Montserrat-Black.ttf').buffer),
};

const tw = (s, size, w = 700, ls = 0) => {
  const f = FM[w] || FM[700];
  let a = 0;
  for (const ch of s) a += f.charToGlyph(ch).advanceWidth || 0;
  return (a * size) / f.unitsPerEm + ls * s.length;
};

const C = {
  bg: '#080A0E',
  panel: '#10141B',
  line: '#263040',
  text: '#F4F1EA',
  sub: '#9AA6B8',
  dim: '#5A6678',
  red: '#E5484D',
  redDark: '#3A1114',
  amber: '#F5A524',
  amberDark: '#382409',
  blue: '#5B8DEF',
  blueDark: '#122238',
};

const b64 = (f, mime = 'image/png') => `data:${mime};base64,` + fs.readFileSync(f).toString('base64');
const IMG = {
  m04: b64('../02_ASSETS/maps/M04_dominoes_world_base.png'),
  m10: b64('../02_ASSETS/maps/M10_world_taboo_1945_base.png'),
  m01: b64('../02_ASSETS/maps/M01_iran_overview_base.png'),
};
const PH = {
  nagasaki: fs.existsSync('../02_ASSETS/photos/ND_P_nagasaki.jpg') ? b64('../02_ASSETS/photos/ND_P_nagasaki.jpg', 'image/jpeg') : null,
  whitehouse: fs.existsSync('../02_ASSETS/photos/ND_P_whitehouse.jpg') ? b64('../02_ASSETS/photos/ND_P_whitehouse.jpg', 'image/jpeg') : null,
};

// ---------- easing / physics ----------
const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const pr = (t, a, b) => cl((t - a) / (b - a));
const expo = x => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));
const inOut = x => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const expoIn = x => (x <= 0 ? 0 : Math.pow(2, 10 * x - 10));
const spring = (t, t0, dur = 0.55) => {
  const d = t - t0;
  if (d <= 0) return 0;
  const x = d / dur;
  return cl(1 - Math.exp(-6.5 * x) * Math.cos(x * 7.2), -0.2, 1.12);
};
const lerp = (a, b, k) => a + (b - a) * k;
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

const T = (x, y, s, o = {}) =>
  `<text x="${x}" y="${y}" fill="${o.fill || C.text}" font-family="${o.ff || 'Montserrat'}" font-style="${o.it ? 'italic' : 'normal'}" font-weight="${o.w || 700}" font-size="${o.size || 40}" text-anchor="${o.a || 'start'}" letter-spacing="${o.ls || 0}" opacity="${o.op ?? 1}">${esc(s)}</text>`;
const M = (x, y, s, o = {}) => T(x, y, s, { ...o, ff: 'Consolas', w: o.w || 700, ls: o.ls ?? 2 });
const SR = (x, y, s, o = {}) => T(x, y, s, { ...o, ff: 'Playfair Display', w: o.w || 900 });

let fid = 0;
const defs = [];
const blur = (sx, sy) => {
  if (sx < 0.3 && sy < 0.3) return '';
  const id = 'b' + fid++;
  defs.push(`<filter id="${id}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="${sx.toFixed(2)} ${sy.toFixed(2)}"/></filter>`);
  return `filter="url(#${id})"`;
};
const mix = (c1, c2, k) => {
  const h = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
  const a = h(c1), b = h(c2);
  return '#' + a.map((v, i) => Math.round(lerp(v, b[i], k)).toString(16).padStart(2, '0')).join('');
};

function words(list, x, y, size, w, times, o = {}) {
  let out = '', cx = x;
  const sp = tw(' ', size, w);
  const total = list.reduce((s, wd) => s + tw(wd, size, w, o.ls || 0), 0) + sp * (list.length - 1);
  if (o.a === 'middle') cx = x - total / 2;
  list.forEach((wd, i) => {
    const st = Array.isArray(times[0]) ? times[i][0] : times[0] + i * times[1];
    const k = spring(o.t, st, 0.5), kc = pr(o.t, st + 0.05, st + 0.45);
    const dy = (1 - cl(k, 0, 1.2)) * (o.off ?? size * 0.85);
    const op = cl(pr(o.t, st, st + 0.18));
    const col = o.keep && o.keep.includes(i) ? o.keepCol || C.red : mix(o.acc || C.red, o.fill || C.text, kc);
    out += `<text x="${cx}" y="${y + dy}" fill="${col}" font-family="${o.ff || 'Montserrat'}" font-weight="${w}" font-size="${size}" letter-spacing="${o.ls || 0}" opacity="${op}">${esc(wd)}</text>`;
    cx += tw(wd, size, w, o.ls || 0) + sp;
  });
  return out;
}

function cam(t, t0, t1, o = {}) {
  const k = expo(pr(t, t0, t0 + (o.arr || 0.45)));
  const drift = (t - t0) * (o.drift ?? 0.012);
  const s = lerp(o.s0 ?? 1.08, 1, k) + drift;
  const tilt = Math.sin((t - t0) * 0.6) * (o.tilt ?? 0.28);
  const dx = (o.dx || 0) * (1 - k);
  return `translate(${W / 2 + dx} ${H / 2}) rotate(${tilt}) scale(${s}) translate(${-W / 2} ${-H / 2})`;
}

const vignette = `<radialGradient id="vg" cx="50%" cy="48%" r="75%"><stop offset="50%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity="0.72"/></radialGradient>
<pattern id="bgGrid" width="80" height="80" patternUnits="userSpaceOnUse"><path d="M 80 0 L 0 0 0 80" fill="none" stroke="#151D28" stroke-width="1" opacity="0.5"/></pattern>`;

const pW = geoNaturalEarth1();
pW.fitExtent([[120, 120], [3720, 2040]], { type: 'Sphere' });
pW.scale(pW.scale() * 2).center([80, 33]).translate([1920, 1080]);
const PW = ll => pW(ll).map(v => v / 2);
const bb = (a, b, c, d) => ({ type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[a, b], [a, d], [c, d], [c, b], [a, b]]] } });
const pI = geoMercator().fitExtent([[120, 120], [3720, 2040]], bb(42, 23, 64, 40.5));
const PI = ll => pI(ll);
const LL = { natanz: [51.727, 33.725], moscow: [37.618, 55.756], islamabad: [73.048, 33.684], taipei: [121.565, 25.033], tehran: [51.389, 35.689], hiroshima: [132.455, 34.385] };

// Forensic Dossier X-Post Card (with Playfair serif pull-quote & integrated top telemetry bar)
function xpost(t, cx, cy, sc, hl, showStatus = false) {
  const w = 1220, h = 490, x = cx - w / 2, y = cy - h / 2;
  let s = `<g transform="translate(${cx} ${cy}) scale(${sc}) translate(${-cx} ${-cy})">`;
  s += `<rect x="${x + 12}" y="${y + 24}" width="${w}" height="${h}" fill="#000" opacity="0.65"/>`;
  s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#0B0E14" stroke="${C.line}" stroke-width="2.5"/>`;
  s += `<rect x="${x}" y="${y}" width="8" height="${h}" fill="${C.red}"/>`;
  if (showStatus) {
    const sk = cl(pr(t, 48.6, 49.0));
    s += `<g opacity="${sk}"><rect x="${x}" y="${y - 58}" width="${w}" height="46" fill="${C.redDark}" stroke="${C.red}" stroke-width="1.5"/>`;
    s += `<circle cx="${x + 28}" cy="${y - 35}" r="7" fill="${C.red}"/>`;
    s += M(x + 48, y - 28, 'VERIFICATION STATUS: UNVERIFIED CLAIM — NO OFFICIAL CONFIRMATION', { size: 17, fill: C.text, ls: 2 }) + `</g>`;
  }
  s += `<circle cx="${x + 84}" cy="${y + 88}" r="38" fill="#1B2330" stroke="${C.red}" stroke-width="2"/>` + M(x + 84, y + 99, 'TC', { size: 28, fill: C.text, a: 'middle' });
  s += T(x + 144, y + 80, 'Tucker Carlson', { size: 32, w: 800, fill: C.text }) + M(x + 144, y + 114, '@TuckerCarlson · Public Post on X', { size: 20, fill: C.sub });
  s += M(x + w - 42, y + 84, '01 NOV 2026 · 20:47 EST', { size: 20, fill: C.amber, a: 'end' });
  s += `<line x1="${x + 44}" y1="${y + 146}" x2="${x + w - 44}" y2="${y + 146}" stroke="${C.line}" stroke-width="1.5"/>`;

  const lines = [
    ['“…the', 'Trump', 'administration', 'may', 'be', 'within', 'days'],
    ['of', 'launching', 'a', 'nuclear', 'strike', 'on', 'Iran.”'],
  ];
  const size = 46, sp = tw(' ', size, 600);
  let wi = 0;
  lines.forEach((ln, li) => {
    let lx = x + 52;
    const ly = y + 235 + li * 74;
    ln.forEach(wd => {
      const wdw = tw(wd, size, 600);
      const H = hl && hl.find(r => r.i0 <= wi && wi <= r.i1);
      if (H) {
        const k = inOut(pr(t, H.t0 + (wi - H.i0) * 0.06, H.t0 + (wi - H.i0) * 0.06 + 0.25));
        if (k > 0) {
          s += `<rect x="${lx - 4}" y="${ly - 42}" width="${(wdw + sp) * k}" height="56" fill="${H.col || C.red}" opacity="0.28"/>`;
          s += `<rect x="${lx - 4}" y="${ly + 12}" width="${(wdw + sp) * k}" height="4" fill="${H.col || C.red}"/>`;
        }
      }
      s += `<text x="${lx}" y="${ly}" fill="${C.text}" font-family="Playfair Display" font-style="italic" font-weight="700" font-size="${size}">${esc(wd)}</text>`;
      lx += wdw + sp;
      wi++;
    });
  });
  s += `<line x1="${x + 44}" y1="${y + 390}" x2="${x + w - 44}" y2="${y + 390}" stroke="${C.line}" stroke-width="1.5"/>`;
  s += M(x + 44, y + 438, 'NAMED TARGET: PICKAXE MOUNTAIN (CENTRAL IRAN)', { size: 20, fill: C.amber });
  s += M(x + w - 44, y + 438, 'EXCERPT · FULL POST ≈750 WORDS', { size: 19, fill: C.dim, a: 'end' });
  s += `</g>`;
  return s;
}

const HEAD = [
  ['NEWSWEEK · ANALYSIS', 'What a US Nuclear Strike on Iran’s Pickaxe Mountain Could Look Like'],
  ['ANADOLU AGENCY · 2 NOV 2026', 'Trump could launch nuclear strike on Iran within days, commentator claims'],
  ['AL JAZEERA · 16 OCT 2026', 'Trump rules out using a nuclear bomb on Iran: Why that matters'],
  ['MIDDLE EAST EYE · 2 NOV 2026', 'Trump says he will not attack Iran after midterms'],
];
function wrapW(str, size, w, max) {
  const ws = str.split(' ');
  const L = [];
  let l = '';
  for (const x of ws) {
    const c = l ? l + ' ' + x : x;
    if (tw(c, size, w) > max && l) {
      L.push(l);
      l = x;
    } else l = c;
  }
  if (l) L.push(l);
  return L;
}
function headline(i, x, y, rot, k, op) {
  const [src, hd] = HEAD[i];
  const w = 780;
  const L = wrapW(hd, 36, 700, w - 80);
  const h = 128 + L.length * 52;
  let s = `<g transform="translate(${x} ${y}) rotate(${rot}) translate(${(1 - k) * 260} 0)" opacity="${op}">`;
  s += `<rect x="10" y="16" width="${w}" height="${h}" fill="#000" opacity="0.55"/><rect width="${w}" height="${h}" fill="#EFECE4" stroke="#C8C2B4" stroke-width="2"/>`;
  s += `<rect x="0" y="0" width="12" height="${h}" fill="${C.red}"/>` + M(36, 52, src, { size: 19, fill: '#8B1E23', ls: 3 });
  L.forEach((l, j) => (s += SR(36, 108 + j * 50, l, { size: 38, w: 900, fill: '#121418' })));
  return s + `</g>`;
}

const S = [];
const add = (t0, t1, fn) => S.push({ t0, t1, fn });

// A 0–4.31 hook: X post rises
add(0, 4.31, t => {
  const k = spring(t, 0.05, 0.7);
  const y = 550 + (1 - k) * 160;
  const sc = 0.92 + 0.08 * cl(k, 0, 1.05) + t * 0.008;
  const exitk = expoIn(pr(t, 3.95, 4.31));
  let s = `<rect width="100%" height="100%" fill="${C.bg}"/><rect width="100%" height="100%" fill="url(#bgGrid)"/>`;
  s += `<g ${blur(exitk * 30, 0)} transform="translate(${-exitk * 500} 0)" opacity="${cl(pr(t, 0.05, 0.3))}">` + xpost(t, 960, y, sc, [{ i0: 5, i1: 6, t0: 1.75, col: C.amber }, { i0: 10, i1: 13, t0: 2.6 }], false) + `</g>`;
  s += M(960, 145, 'COLD OPEN // PUBLIC DISPATCH ANALYSIS', { size: 22, fill: C.red, a: 'middle', ls: 6, op: cl(pr(t, 0.2, 0.6)) });
  s += words(['ONE', 'OF', 'THE', 'MOST', 'WATCHED', 'VOICES', 'IN', 'AMERICA'], 960, 198, 30, 800, [1.75, 0.07], { t, a: 'middle', ls: 4, off: 30, fill: C.text, acc: C.amber });
  return s + `<rect width="100%" height="100%" fill="url(#vg)"/>`;
});

// B 4.31–9.27 first use since 1945: counter 2026 -> 1945 over Nagasaki photo
add(4.31, 9.27, t => {
  let s = `<rect width="100%" height="100%" fill="#050608"/>`;
  if (PH.nagasaki) {
    s += `<g transform="${cam(t, 4.31, 9.27, { s0: 1.14, drift: 0.012 })}" opacity="${0.48 * cl(pr(t, 4.31, 4.7))}"><image href="${PH.nagasaki}" x="0" y="-260" width="1920" height="1600" preserveAspectRatio="xMidYMid slice"/></g>`;
  } else {
    s += `<g transform="${cam(t, 4.31, 9.27, { s0: 1.15, drift: 0.015 })}" opacity="0.65"><image href="${IMG.m10}" width="1920" height="1080"/></g>`;
  }
  s += `<rect width="100%" height="100%" fill="url(#vg)"/>`;
  s += words(['A', 'NUCLEAR', 'WEAPON', 'USED', 'IN', 'WAR'], 960, 310, 62, 900, [[4.31], [4.75], [5.0], [5.43], [5.7], [5.95]], { t, a: 'middle', ls: 3 });
  s += words(['FOR', 'THE', 'FIRST', 'TIME', 'SINCE'], 960, 395, 36, 600, [6.29, 0.16], { t, a: 'middle', ls: 6, fill: C.sub, acc: C.amber });
  const k = inOut(pr(t, 6.6, 7.9));
  const yr = Math.round(lerp(2026, 1945, k));
  const pop = spring(t, 7.27, 0.5);
  s += `<g opacity="${cl(pr(t, 6.5, 6.7))}" transform="translate(960 680) scale(${0.9 + 0.1 * cl(pop, 0, 1.1)}) translate(-960 -680)">` + SR(960, 690, String(yr), { size: 270, w: 900, a: 'middle', fill: yr === 1945 ? C.amber : C.text, ls: 4 }) + `</g>`;
  const lk = expo(pr(t, 7.9, 8.4));
  s += `<rect x="${960 - 320 * lk}" y="738" width="${640 * lk}" height="8" fill="${C.amber}"/>`;
  return s;
});

// C 9.27–12.15 White House: not the plan
add(9.27, 12.15, t => {
  let s = `<rect width="100%" height="100%" fill="${C.bg}"/>`;
  if (PH.whitehouse) {
    s += `<g transform="${cam(t, 9.27, 12.15, { s0: 1.12, dx: 90 })}" opacity="0.45"><image href="${PH.whitehouse}" width="1920" height="1080" preserveAspectRatio="xMidYMid slice"/></g>`;
  }
  s += `<rect width="100%" height="100%" fill="url(#vg)"/>`;
  s += M(960, 340, 'OFFICIAL WHITE HOUSE POSITION // ON THE RECORD', { size: 26, fill: C.blue, a: 'middle', ls: 6 });
  s += `<g transform="translate(0 ${(1 - cl(spring(t, 10.4, 0.5))) * 35})" opacity="${cl(pr(t, 10.35, 10.65))}">` + SR(960, 520, '“Not the plan.”', { size: 150, w: 900, it: true, a: 'middle', fill: C.text }) + `</g>`;
  const k = spring(t, 11.0, 0.5);
  s += `<g opacity="${cl(pr(t, 11.0, 11.2))}" transform="translate(0 ${(1 - cl(k)) * 30})"><rect x="${960 - 410}" y="600" width="820" height="72" fill="${C.blueDark}" stroke="${C.blue}" stroke-width="2"/>` + M(960, 645, 'PRESIDENT TRUMP · 15 OCT 2026: "I WOULDN’T USE NUCLEAR."', { size: 24, fill: C.text, a: 'middle', ls: 2 }) + `</g>`;
  return s;
});

// D 12.15–16.39 24 hours later
add(12.15, 16.39, t => {
  let s = `<rect width="100%" height="100%" fill="#06080A"/><g transform="${cam(t, 12.15, 16.39, { s0: 1.06, drift: 0.02 })}" opacity="0.58"><image href="${IMG.m10}" width="1920" height="1080"/></g>`;
  const sweep = lerp(-200, 2100, pr(t, 12.4, 16.3));
  s += `<rect x="${sweep}" y="0" width="900" height="1080" fill="#000" opacity="0.45"/><line x1="${sweep}" y1="0" x2="${sweep}" y2="1080" stroke="${C.amber}" stroke-width="3" opacity="0.65"/>`;
  s += `<rect width="100%" height="100%" fill="url(#vg)"/>`;
  const k = inOut(pr(t, 13.4, 15.6));
  const secs = Math.floor(k * 86400);
  const hh = String(Math.floor(secs / 3600)).padStart(2, '0'), mm = String(Math.floor(secs / 60) % 60).padStart(2, '0'), ss = String(secs % 60).padStart(2, '0');
  const pop = spring(t, 12.3, 0.6);
  s += `<g opacity="${cl(pr(t, 12.2, 12.5))}" transform="translate(960 555) scale(${0.85 + 0.15 * cl(pop, 0, 1.1)}) translate(-960 -555)">` + M(960, 595, `T+${hh}:${mm}:${ss}`, { size: 175, w: 700, a: 'middle', fill: k >= 1 ? C.amber : C.text, ls: 4 }) + `</g>`;
  s += words(['WHAT', 'WOULD', 'THE', 'WORLD', 'LOOK', 'LIKE'], 960, 365, 38, 700, [12.55, 0.12], { t, a: 'middle', ls: 6, fill: C.sub, acc: C.amber });
  s += words(['24', 'HOURS', 'LATER?'], 960, 720, 56, 800, [[14.27], [14.5], [15.55]], { t, a: 'middle', ls: 8, keep: [0], keepCol: C.amber });
  return s;
});

// E 16.39–20.67 dominoes: first blast -> arrows
add(16.39, 20.67, t => {
  let s = `<rect width="100%" height="100%" fill="${C.bg}"/><g transform="${cam(t, 16.39, 20.67, { s0: 1.12, drift: 0.01 })}"><image href="${IMG.m04}" width="1920" height="1080"/>`;
  const o = PW(LL.natanz);
  const blast = pr(t, 17.45, 18.4);
  s += `<circle cx="${o[0]}" cy="${o[1]}" r="${10 + blast * 220}" fill="none" stroke="${C.amber}" stroke-width="${6 * (1 - blast) + 1}" opacity="${(1 - blast) * cl(pr(t, 17.4, 17.5))}"/>`;
  s += `<circle cx="${o[0]}" cy="${o[1]}" r="${12 * cl(spring(t, 17.45, 0.4), 0, 1.2)}" fill="${C.amber}"/>`;
  [[LL.moscow, 18.51, '01 · RUSSIA'], [LL.islamabad, 18.95, '02 · SOUTH ASIA'], [LL.taipei, 19.4, '03 · EAST ASIA']].forEach(([ll, t0, lb], i) => {
    const p = PW(ll);
    const mx = (o[0] + p[0]) / 2, my = (o[1] + p[1]) / 2 - Math.hypot(p[0] - o[0], p[1] - o[1]) * 0.25;
    const len = Math.hypot(p[0] - o[0], p[1] - o[1]) * 1.15;
    const k = expo(pr(t, t0, t0 + 0.6));
    s += `<path d="M${o[0]},${o[1]} Q${mx},${my} ${p[0]},${p[1]}" fill="none" stroke="${C.red}" stroke-width="4" stroke-dasharray="${len}" stroke-dashoffset="${len * (1 - k)}" stroke-linecap="round"/>`;
    const pk = spring(t, t0 + 0.5, 0.45);
    if (t > t0 + 0.5) {
      s += `<circle cx="${p[0]}" cy="${p[1]}" r="${10 * cl(pk, 0, 1.2)}" fill="${C.red}"/><circle cx="${p[0]}" cy="${p[1]}" r="${10 + 30 * pr(t, t0 + 0.5, t0 + 1.2)}" fill="none" stroke="${C.red}" stroke-width="2" opacity="${1 - pr(t, t0 + 0.5, t0 + 1.2)}"/>` + `<g opacity="${cl(pr(t, t0 + 0.55, t0 + 0.75))}">` + M(p[0] + (i === 2 ? -24 : 24), p[1] - 18, lb, { size: 28, fill: C.text, a: i === 2 ? 'end' : 'start', ls: 2 }) + `</g>`;
    }
  });
  s += `</g><rect width="100%" height="100%" fill="url(#vg)"/>`;
  s += words(['THE', 'SPARK', 'NOBODY', 'CAN', 'PUT', 'OUT?'], 120, 150, 48, 800, [[17.45], [17.9], [18.51], [19.0], [19.65], [19.8]], { t, ls: 2, keep: [1], keepCol: C.amber });
  return s;
});

// F 20.67–23.93 not a prediction
add(20.67, 23.93, t => {
  let s = `<rect width="100%" height="100%" fill="${C.bg}"/><rect width="100%" height="100%" fill="url(#bgGrid)"/><g transform="${cam(t, 20.67, 23.93, { s0: 1.05 })}">`;
  s += M(960, 330, 'EDITORIAL STANDPOINT // VERION', { size: 26, fill: C.amber, a: 'middle', ls: 8 });
  s += words(['THIS', 'IS', 'NOT', 'A'], 960, 465, 68, 800, [[22.13], [22.4], [22.7], [23.05]], { t, a: 'middle', keep: [2], keepCol: C.red });
  const k = spring(t, 23.13, 0.45);
  s += `<g opacity="${cl(pr(t, 23.13, 23.25))}" transform="translate(960 650) scale(${0.9 + 0.1 * cl(k, 0, 1.1)}) translate(-960 -650)">` + SR(960, 675, 'PREDICTION', { size: 165, w: 900, a: 'middle', ls: 6 }) + `</g>`;
  const sk = expo(pr(t, 23.45, 23.8));
  s += `<rect x="${960 - 580 * sk}" y="612" width="${1160 * sk}" height="14" fill="${C.red}"/>`;
  return s + `</g><rect width="100%" height="100%" fill="url(#vg)"/>`;
});

// G 23.93–30.39 Verified Fact-Check Ledger (NO TILTED STAMP BOX!)
add(23.93, 30.39, t => {
  let s = `<rect width="100%" height="100%" fill="${C.bg}"/><rect width="100%" height="100%" fill="url(#bgGrid)"/><g transform="${cam(t, 23.93, 30.39, { s0: 1.04, drift: 0.008 })}">`;
  // Top Dossier Header instead of tilted SCENARIO box
  s += `<rect x="240" y="135" width="1440" height="90" fill="${C.amberDark}" stroke="${C.amber}" stroke-width="2.5"/>`;
  s += `<rect x="240" y="135" width="12" height="90" fill="${C.amber}"/>`;
  s += M(285, 190, 'METHODOLOGY: SCENARIO ANALYSIS — VERIFIED BASELINE FACTS', { size: 28, fill: C.amber, ls: 4 });

  const rows = [
    [24.0, '01 // PENTAGON RECORD', 'No confirmed US nuclear strike plan', 'VERIFIED ABSENT', C.red],
    [25.6, '02 // WHITE HOUSE', 'No official announcement or directive', 'VERIFIED ABSENT', C.amber],
    [27.0, '03 // PRESIDENTIAL RECORD', 'Trump: “I wouldn’t use nuclear. We don’t have to.”', 'NEWSMAX · 15 OCT', C.blue],
  ];
  rows.forEach(([t0, code, tx, badge, col], i) => {
    const k = spring(t, t0, 0.5);
    const y = 330 + i * 175;
    const x = 240 + (1 - cl(k, 0, 1.1)) * -80;
    s += `<g opacity="${cl(pr(t, t0, t0 + 0.2))}">`;
    s += `<rect x="${x}" y="${y}" width="1440" height="145" fill="${C.panel}" stroke="${C.line}" stroke-width="2"/>`;
    s += `<rect x="${x}" y="${y}" width="10" height="145" fill="${col}"/>`;
    s += M(x + 42, y + 48, code, { size: 22, fill: col, ls: 3 });
    s += SR(x + 42, y + 110, tx, { size: 44, w: 700, fill: C.text });
    s += M(x + 1405, y + 84, badge, { size: 22, fill: C.sub, a: 'end', ls: 2 });
    s += `</g>`;
  });
  return s + `</g><rect width="100%" height="100%" fill="url(#vg)"/>`;
});

// H 30.39–36.85 built from 3 sources
add(30.39, 36.85, t => {
  let s = `<rect width="100%" height="100%" fill="${C.bg}"/><rect width="100%" height="100%" fill="url(#bgGrid)"/><g transform="${cam(t, 30.39, 36.85, { s0: 1.05, drift: 0.01 })}">`;
  s += M(960, 175, 'THREE-PILLAR DOCUMENTARY FRAMEWORK', { size: 24, fill: C.amber, a: 'middle', ls: 6 });
  s += words(['A', 'SCENARIO', 'BUILT', 'FROM'], 960, 245, 48, 800, [30.4, 0.12], { t, a: 'middle', ls: 6, keep: [1], keepCol: C.amber });
  const tiles = [
    [31.23, '01 // ON THE RECORD', 'Public Statements', 'Interviews · official transcripts · posts', C.blue],
    [32.95, '02 // ARCHIVAL RECORD', 'Documented History', 'Hiroshima 1945 → Petrov 1983 → 2026', C.amber],
    [34.55, '03 // SIMULATION DATA', 'Expert War Games', 'Princeton SGS “Plan A” · NUKEMAP', C.red],
  ];
  tiles.forEach(([t0, code, a, b2, col], i) => {
    const k = spring(t, t0, 0.55);
    const x = 195 + i * 520, y = 330;
    s += `<g opacity="${cl(pr(t, t0, t0 + 0.15))}" transform="translate(${x + 245} ${y + 240}) scale(${0.88 + 0.12 * cl(k, 0, 1.1)}) translate(${-x - 245} ${-y - 240})">`;
    s += `<rect x="${x}" y="${y}" width="490" height="470" fill="${C.panel}" stroke="${col}" stroke-width="2.5"/>`;
    s += `<rect x="${x}" y="${y}" width="490" height="8" fill="${col}"/>`;
    s += M(x + 36, y + 58, code, { size: 22, fill: col, ls: 3 });
    if (i === 0) s += SR(x + 245, y + 235, '“ ”', { size: 170, w: 900, fill: col, a: 'middle' });
    if (i === 1) s += SR(x + 245, y + 215, '1945', { size: 125, w: 900, fill: C.amber, a: 'middle' });
    if (i === 2) {
      for (let r = 0; r < 4; r++)
        for (let c = 0; c < 6; c++) {
          const on = ((r * 6 + c) * 7) % 5 === 0 && t > t0 + 0.3 + (r * 6 + c) * 0.03;
          s += `<rect x="${x + 85 + c * 54}" y="${y + 95 + r * 38}" width="42" height="26" fill="${on ? C.red : '#1C2430'}"/>`;
        }
    }
    s += SR(x + 245, y + 345, a, { size: 42, w: 900, a: 'middle' }) + T(x + 245, y + 398, b2, { size: 24, w: 500, fill: C.sub, a: 'middle' }) + `</g>`;
  });
  return s + `</g><rect width="100%" height="100%" fill="url(#vg)"/>`;
});

// I 36.85–45.17 headlines collage -> UNTHINKABLE
add(36.85, 45.17, t => {
  let s = `<rect width="100%" height="100%" fill="#090C10"/><rect width="100%" height="100%" fill="url(#bgGrid)"/>`;
  const pan = (t - 36.85) * -14;
  const dim = pr(t, 42.4, 43.2);
  s += `<g transform="translate(${pan} 0)" ${blur(dim * 8, dim * 8)} opacity="${1 - dim * 0.72}">`;
  const P = [[36.95, 140, 120, -1.8], [37.9, 980, 150, 1.4], [39.2, 240, 510, 1.1], [40.3, 1020, 540, -1.5]];
  P.forEach(([t0, x, y, r], i) => {
    const k = expo(pr(t, t0, t0 + 0.55));
    s += headline(i, x, y, r, k, cl(pr(t, t0, t0 + 0.15)));
  });
  s += `</g>`;
  if (t > 42.3) {
    s += words(['WHAT', 'IF', 'IT', 'STOPS', 'BEING'], 960, 445, 42, 700, [42.4, 0.1], { t, a: 'middle', ls: 6, fill: C.sub, acc: C.amber });
  }
  const k = spring(t, 43.89, 0.5);
  const op = cl(pr(t, 43.89, 44.0));
  s += `<g opacity="${op}" transform="translate(960 610) scale(${0.85 + 0.15 * cl(k, 0, 1.1)}) translate(-960 -610)">` + SR(960, 635, 'UNTHINKABLE', { size: 156, w: 900, a: 'middle', fill: C.red, ls: 4 }) + `</g>`;
  return s + `<rect width="100%" height="100%" fill="url(#vg)"/>` + M(70, 65, 'PRESS ARCHIVE // OCT–NOV 2026', { size: 20, fill: C.amber, ls: 4 });
});

// J 45.17–48.29 Sunday Nov 1
add(45.17, 48.29, t => {
  let s = `<rect width="100%" height="100%" fill="${C.bg}"/><rect width="100%" height="100%" fill="url(#bgGrid)"/><g transform="${cam(t, 45.17, 48.29, { s0: 1.06 })}">`;
  const days = ['THU · OCT 29', 'FRI · OCT 30', 'SAT · OCT 31', 'SUN · NOV 1'];
  const k = inOut(pr(t, 45.3, 46.6));
  const idx = Math.min(3, Math.floor(k * 3.999));
  const roll = (k * 3.999) % 1;
  const yo = idx < 3 ? -roll * 40 : 0;
  s += `<rect x="510" y="290" width="900" height="310" fill="${C.panel}" stroke="${C.line}" stroke-width="3"/>`;
  s += `<rect x="510" y="290" width="900" height="10" fill="${C.red}"/>`;
  s += SR(960, 470 + yo, days[idx], { size: 108, w: 900, a: 'middle', fill: idx === 3 ? C.text : C.sub, op: 1 - (idx < 3 ? roll * 0.6 : 0) });
  const c = spring(t, 46.7, 0.5);
  s += `<g opacity="${cl(pr(t, 46.7, 46.9))}" transform="translate(0 ${(1 - cl(c)) * 30})">` + M(960, 560, 'CHRONOLOGY // 2026', { size: 28, a: 'middle', fill: C.sub, ls: 8 }) + M(960, 710, '20:47 EST (8:47 PM)', { size: 84, a: 'middle', fill: C.red, ls: 4 }) + `</g>`;
  s += words(['IT', 'STARTED', 'LATE', 'ON'], 960, 235, 30, 700, [45.2, 0.1], { t, a: 'middle', ls: 8, fill: C.sub, acc: C.sub });
  return s + `</g><rect width="100%" height="100%" fill="url(#vg)"/>`;
});

// K 48.29–56.99 the post, highlighted in sync (NO TILTED STAMP BOX!)
add(48.29, 56.99, t => {
  let s = `<rect width="100%" height="100%" fill="${C.bg}"/><rect width="100%" height="100%" fill="url(#bgGrid)"/>`;
  const k = spring(t, 48.3, 0.7);
  const sc = 0.9 + 0.1 * cl(k, 0, 1.05) + (t - 48.3) * 0.005;
  const exitk = expoIn(pr(t, 55.95, 56.4));
  s += `<g transform="translate(0 ${exitk * 700})" opacity="${1 - exitk}" ${blur(0, exitk * 25)}>` + xpost(t, 960, 490 + (1 - cl(k)) * 140, sc, [{ i0: 5, i1: 6, t0: 52.81, col: C.amber }, { i0: 10, i1: 13, t0: 55.03 }], true) + `</g>`;
  const tq = spring(t, 55.99, 0.45);
  s += `<g opacity="${cl(pr(t, 55.99, 56.1))}" transform="translate(960 520) scale(${0.85 + 0.15 * cl(tq, 0, 1.1)}) translate(-960 -520)">` + SR(960, 560, 'THE TARGET?', { size: 140, w: 900, a: 'middle', ls: 6 }) + `</g>`;
  return s + `<rect width="100%" height="100%" fill="url(#vg)"/>`;
});

// L 56.99–61.0 zoom into Pickaxe Mountain
add(56.99, 61.0, t => {
  const p = PI(LL.natanz);
  const k = inOut(pr(t, 57.0, 59.6));
  const sc = lerp(0.5, 1.05, k);
  const cx = lerp(1920, p[0], k), cy = lerp(1080, p[1], k);
  let s = `<rect width="100%" height="100%" fill="${C.bg}"/><g transform="translate(960 540) scale(${sc}) translate(${-cx} ${-cy})"><image href="${IMG.m01}" width="3840" height="2160"/>`;
  const pk = spring(t, 57.45, 0.5);
  s += `<circle cx="${p[0]}" cy="${p[1]}" r="${((16 * cl(pk, 0, 1.2)) / sc) * 1.5}" fill="${C.amber}"/>`;
  for (let r = 0; r < 3; r++) {
    const ph = (((t - 57.45) * 0.9 + r / 3) % 1);
    if (t > 57.45) s += `<circle cx="${p[0]}" cy="${p[1]}" r="${((16 + ph * 120) / sc) * 1.5}" fill="none" stroke="${C.amber}" stroke-width="${(3 / sc) * 1.5}" opacity="${1 - ph}"/>`;
  }
  const tp = PI(LL.tehran);
  if (t > 58.2) s += `<circle cx="${tp[0]}" cy="${tp[1]}" r="${(10 / sc) * 1.5}" fill="${C.red}" opacity="${cl(pr(t, 58.2, 58.4))}"/><text x="${tp[0] + 22 / sc}" y="${tp[1] + 10 / sc}" fill="#F2F2F2" font-family="Montserrat" font-weight="700" font-size="${30 / sc}" opacity="${cl(pr(t, 58.2, 58.4))}">Tehran</text>`;
  s += `</g><rect width="100%" height="100%" fill="url(#vg)"/>`;
  s += `<g opacity="${cl(pr(t, 57.45, 57.8))}"><rect x="980" y="390" width="760" height="230" fill="#080B10" opacity="0.88" stroke="${C.amber}" stroke-width="2.5"/><rect x="980" y="390" width="10" height="230" fill="${C.amber}"/>`;
  s += M(1015, 432, 'TARGET LOCATOR // 33°42′N 51°43′E', { size: 20, fill: C.amber, ls: 3 });
  s += SR(1015, 495, 'Pickaxe Mountain', { size: 58, w: 900, fill: C.text });
  s += T(1015, 542, 'Central Iran · 2 km south of Natanz', { size: 28, w: 500, fill: C.sub });
  if (t > 59.0) s += M(1015, 590, 'ALLEGED CLAIM: ENRICHMENT RESTARTED', { size: 22, fill: C.red, ls: 2 });
  s += `</g>`;
  return s;
});

export function frame(tv) {
  fid = 0;
  defs.length = 0;
  const sc = S.find(s => tv >= s.t0 && tv < s.t1) || S[S.length - 1];
  const body = sc.fn(tv);
  const fl = 0.02 * (Math.sin(tv * 61.3) * 0.5 + Math.sin(tv * 23.7) * 0.5);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>${vignette}${defs.join('')}</defs>${body}<rect width="100%" height="100%" fill="#fff" opacity="${Math.max(0, fl)}"/></svg>`;
}
export function render(tv) {
  return new Resvg(frame(tv), { font: { fontFiles: FONTFILES, loadSystemFonts: false, defaultFontFamily: 'Montserrat' } }).render().asPng();
}
