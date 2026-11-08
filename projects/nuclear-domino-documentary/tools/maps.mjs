// Generates layered 4K documentary maps (base PNG + transparent overlay PNG + composite FULL PNG).
// Styled with Playfair Display titles, Montserrat labels, Consolas coordinates, and tactical HUD reticles.
import fs from 'fs';
import { feature, mesh } from 'topojson-client';
import { geoMercator, geoPath, geoNaturalEarth1, geoGraticule10 } from 'd3-geo';
import { Resvg } from '@resvg/resvg-js';

const W = 3840, H = 2160;
const topo50 = JSON.parse(fs.readFileSync('node_modules/world-atlas/countries-50m.json'));
const countries = feature(topo50, topo50.objects.countries).features;
const borders = mesh(topo50, topo50.objects.countries, (a, b) => a !== b);
const land = feature(topo50, topo50.objects.land);

const C = {
  bg: '#070A0F',
  sea: '#070A0F',
  land: '#161C24',
  border: '#323C4A',
  coast: '#48566A',
  hi: '#3D1216',
  hiStroke: '#E5484D',
  blue: '#16273B',
  blueStroke: '#5B8DEF',
  text: '#F4F1EA',
  sub: '#9AA6B8',
  dim: '#5A6678',
  red: '#E5484D',
  amber: '#F5A524',
};

const UF = 'C:/Users/PC/AppData/Local/Microsoft/Windows/Fonts/';
const WF = 'C:/Windows/Fonts/';
const FONT = [
  UF + 'Montserrat-Regular.ttf',
  UF + 'Montserrat-Medium.ttf',
  UF + 'Montserrat-SemiBold.ttf',
  UF + 'Montserrat-Bold.ttf',
  UF + 'Montserrat-ExtraBold.ttf',
  UF + 'PlayfairDisplay-Bold.ttf',
  UF + 'PlayfairDisplay-Black.ttf',
  WF + 'consola.ttf',
  WF + 'consolab.ttf',
].filter(f => fs.existsSync(f));

const NATO = [8,56,100,124,191,203,208,233,246,250,276,300,348,352,380,428,440,442,499,528,807,578,616,620,642,703,705,724,752,792,826,840];
const out = process.argv[2] || '../02_ASSETS/maps';
fs.mkdirSync(out, { recursive: true });

function bboxFeature(lon0, lat0, lon1, lat1) {
  return { type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[lon0, lat0], [lon0, lat1], [lon1, lat1], [lon1, lat0], [lon0, lat0]]] } };
}
function render(svg, file) {
  fs.writeFileSync(file + '.svg', svg);
  const png = new Resvg(svg, { font: { fontFiles: FONT, loadSystemFonts: false, defaultFontFamily: 'Montserrat' }, fitTo: { mode: 'width', value: W } }).render().asPng();
  fs.writeFileSync(file + '.png', png);
}
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

function makeMap(o) {
  const proj = o.world ? geoNaturalEarth1() : geoMercator();
  proj.fitExtent([[120, 120], [W - 120, H - 120]], o.world ? { type: 'Sphere' } : bboxFeature(...o.bbox));
  if (o.world && o.scale) {
    proj.scale(proj.scale() * o.scale).center(o.center).translate([W / 2, H / 2]);
  }
  const path = geoPath(proj);
  const fillOf = id => (o.hi || []).includes(+id) ? C.hi : (o.blue || []).includes(+id) ? C.blue : C.land;
  const strokeOf = id => (o.hi || []).includes(+id) ? C.hiStroke : (o.blue || []).includes(+id) ? C.blueStroke : 'none';

  // BASE
  let base = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <defs>
      <radialGradient id="seaGlow" cx="50%" cy="48%" r="72%">
        <stop offset="0%" stop-color="#111A26"/>
        <stop offset="100%" stop-color="#05070B"/>
      </radialGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#seaGlow)"/>`;
  base += `<path d="${path(geoGraticule10())}" fill="none" stroke="#151F2C" stroke-width="2" stroke-dasharray="6 10"/>`;
  for (const f of countries) {
    const d = path(f);
    if (d) base += `<path d="${d}" fill="${fillOf(f.id)}" stroke="${strokeOf(f.id)}" stroke-width="${strokeOf(f.id) === 'none' ? 0 : 5}" stroke-linejoin="round"/>`;
  }
  base += `<path d="${path(borders)}" fill="none" stroke="${C.border}" stroke-width="2.5"/>`;
  base += `<path d="${path(land)}" fill="none" stroke="${C.coast}" stroke-width="3.5"/>`;
  // Subtle HUD frame
  base += `<rect x="90" y="90" width="${W - 180}" height="${H - 180}" fill="none" stroke="#1E2836" stroke-width="2"/>`;
  base += `</svg>`;
  render(base, `${out}/${o.name}_base`);

  // OVERLAY (transparent): country labels, points, lines, title dossier
  let ov = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`;
  for (const l of o.lines || []) {
    const [x0, y0] = proj(l.from), [x1, y1] = proj(l.to);
    if (l.arc) {
      const mx = (x0 + x1) / 2, my = (y0 + y1) / 2 - Math.hypot(x1 - x0, y1 - y0) * 0.22;
      ov += `<path d="M${x0},${y0} Q${mx},${my} ${x1},${y1}" fill="none" stroke="${l.color || C.red}" stroke-width="14" opacity="0.22" stroke-linecap="round"/>`;
      ov += `<path d="M${x0},${y0} Q${mx},${my} ${x1},${y1}" fill="none" stroke="${l.color || C.red}" stroke-width="7" stroke-dasharray="${l.dash || '0'}" stroke-linecap="round"/>`;
    } else {
      ov += `<line x1="${x0}" y1="${y0}" x2="${x1}" y2="${y1}" stroke="${l.color || C.amber}" stroke-width="5" stroke-dasharray="${l.dash || '18 14'}"/>`;
    }
    if (l.label) {
      const [lx, ly] = [(x0 + x1) / 2 + (l.dx || 0), (y0 + y1) / 2 + (l.dy || 0)];
      ov += `<text x="${lx}" y="${ly}" fill="${C.amber}" font-family="Consolas" font-weight="700" font-size="44" text-anchor="middle" paint-order="stroke" stroke="${C.bg}" stroke-width="16">${esc(l.label)}</text>`;
    }
  }
  for (const c of o.clabels || []) {
    const [x, y] = proj(c.at);
    ov += `<text x="${x}" y="${y}" fill="${c.color || C.sub}" font-family="Montserrat" font-weight="800" font-size="${c.size || 60}" letter-spacing="${(c.size || 60) * 0.28}" text-anchor="middle" opacity="0.88" paint-order="stroke" stroke="${C.bg}" stroke-width="12">${esc(c.t.toUpperCase())}</text>`;
  }
  for (const p of o.points || []) {
    const [x, y] = proj(p.at);
    const col = p.color || C.red;
    const r = p.r || 18;
    // Tactical target reticle around point
    ov += `<circle cx="${x}" cy="${y}" r="${r * 3.1}" fill="none" stroke="${col}" stroke-width="3" stroke-dasharray="10 8" opacity="0.7"/>`;
    ov += `<circle cx="${x}" cy="${y}" r="${r * 1.9}" fill="none" stroke="${col}" stroke-width="4" opacity="0.85"/>`;
    ov += `<circle cx="${x}" cy="${y}" r="${r}" fill="${col}"/>`;
    const ax = p.align === 'right' ? 'end' : 'start';
    const tx = x + (p.align === 'right' ? -r * 3.8 : r * 3.8) + (p.dx || 0);
    const ty = y + (p.dy || 0);
    ov += `<text x="${tx}" y="${ty + 18}" fill="${C.text}" font-family="Montserrat" font-weight="800" font-size="${p.size || 60}" text-anchor="${ax}" paint-order="stroke" stroke="${C.bg}" stroke-width="18">${esc(p.t)}</text>`;
    if (p.s) {
      ov += `<text x="${tx}" y="${ty + 18 + (p.size || 60) * 0.85}" fill="${col === C.amber ? C.amber : C.sub}" font-family="Consolas" font-weight="700" font-size="${(p.size || 60) * 0.54}" text-anchor="${ax}" paint-order="stroke" stroke="${C.bg}" stroke-width="14">${esc(p.s)}</text>`;
    }
  }
  if (o.title) {
    ov += `<rect x="150" y="135" width="1480" height="240" fill="#070A0F" opacity="0.88" stroke="#243040" stroke-width="3"/>`;
    ov += `<rect x="150" y="135" width="14" height="240" fill="${C.red}"/>`;
    ov += `<text x="195" y="192" fill="${C.amber}" font-family="Consolas" font-weight="700" font-size="28" letter-spacing="5">${esc(o.kicker || 'GEOSPATIAL BRIEFING // VERION')}</text>`;
    ov += `<text x="195" y="285" fill="${C.text}" font-family="Playfair Display" font-weight="900" font-size="82">${esc(o.title)}</text>`;
    if (o.sub) ov += `<text x="195" y="344" fill="${C.sub}" font-family="Montserrat" font-weight="500" font-size="38">${esc(o.sub)}</text>`;
  }
  ov += `<text x="${W - 150}" y="${H - 125}" fill="#5A6678" font-family="Consolas" font-weight="700" font-size="28" text-anchor="end">CARTOGRAPHY: NATURAL EARTH 50M · COORDINATES APPROXIMATE</text></svg>`;
  render(ov, `${out}/${o.name}_overlay`);

  // COMPOSITE FULL
  const comp = base.replace('</svg>', ov.replace(/^<svg[^>]*>/, '').replace('</svg>', '') + '</svg>');
  render(comp, `${out}/${o.name}_FULL`);
}

const P = {
  tehran: [51.389, 35.689], natanz: [51.727, 33.725], pickaxe: [51.72, 33.705], isfahan: [51.668, 32.655], qom: [50.876, 34.640], fordow: [50.996, 34.885],
  qeshm: [55.83, 26.80], bandar: [56.27, 27.18], hormuz: [56.45, 26.55], doha: [51.531, 25.285],
  moscow: [37.618, 55.756], serpukhov: [37.43, 55.08], kyiv: [30.523, 50.450], washington: [-77.037, 38.907],
  islamabad: [73.048, 33.684], nurkhan: [73.099, 33.617], delhi: [77.209, 28.614],
  beijing: [116.407, 39.904], taipei: [121.565, 25.033], tokyo: [139.692, 35.690], hiroshima: [132.455, 34.385], nagasaki: [129.878, 32.750], seoul: [126.978, 37.567], pyongyang: [125.762, 39.039],
};

makeMap({ name: 'M01_iran_overview', bbox: [42, 23, 64, 40.5], hi: [364],
  kicker: 'THEATER OVERVIEW // PERSIAN GULF & IRAN', title: 'Iran & Key Flashpoints', sub: 'Nuclear infrastructure and 2026 military engagement zones',
  points: [
    { at: P.tehran, t: 'Tehran', s: 'CAPITAL' },
    { at: P.natanz, t: 'Natanz / Pickaxe Mountain', s: '≈225 KM SOUTH OF TEHRAN', color: C.amber },
    { at: P.qeshm, t: 'Qeshm Island', s: 'US DEFENSIVE STRIKE · 2 NOV 2026', align: 'right' },
    { at: P.doha, t: 'Doha, Qatar', s: 'CEASEFIRE MEDIATION CHANNEL', color: '#5B8DEF', align: 'right' },
  ],
  clabels: [{ at: [58.6, 25.2], t: 'Strait of Hormuz', size: 42, color: '#7A8594' }, { at: [50.2, 28.2], t: 'Persian Gulf', size: 46, color: '#5B6573' }],
});
makeMap({ name: 'M02_natanz_pickaxe_locator', bbox: [49.6, 31.9, 53.6, 36.2], hi: [364],
  kicker: 'TARGET LOCATOR // ISFAHAN PROVINCE', title: 'Pickaxe Mountain', sub: 'Kuh-e Kolang Gaz La · ≈2 km south of Natanz enrichment complex',
  points: [
    { at: P.tehran, t: 'Tehran', size: 66 },
    { at: P.qom, t: 'Qom', size: 52, align: 'right' },
    { at: P.fordow, t: 'Fordow', s: 'STRUCK JUNE 2025', size: 54, color: '#7A8594' },
    { at: P.natanz, t: 'Natanz', s: 'ENRICHMENT SITE · STRUCK JUNE 2025', size: 60, color: '#7A8594', align: 'right', dy: -50 },
    { at: P.pickaxe, t: 'Pickaxe Mountain', s: 'NEVER STRUCK · NEVER INSPECTED', size: 68, color: C.amber, dy: 80 },
    { at: P.isfahan, t: 'Isfahan', size: 54 },
  ],
  lines: [{ from: P.tehran, to: P.natanz, label: '≈225 KM', dx: 170, dy: 190 }],
});
makeMap({ name: 'M03_hormuz_qeshm', bbox: [54.3, 25.2, 58.2, 27.9], hi: [364],
  kicker: 'MARITIME CHOKEPOINT // 2 NOV 2026', title: 'Strait of Hormuz', sub: 'Qeshm Island · largest island in the Persian Gulf',
  points: [
    { at: P.qeshm, t: 'Qeshm Island', s: 'US DEFENSIVE STRIKES · 2 NOV 2026', size: 68, color: C.amber },
    { at: P.bandar, t: 'Bandar Abbas', size: 54, color: '#7A8594' },
  ],
  clabels: [{ at: [56.6, 26.25], t: 'Strait of Hormuz', size: 56, color: '#7A8594' }, { at: [57.5, 27.55], t: 'IRAN', size: 84, color: '#E5484D' }, { at: [56.2, 25.6], t: 'Oman', size: 52 }],
});
makeMap({ name: 'M04_dominoes_world', world: true, scale: 2.0, center: [80, 33], hi: [364], blue: [643, 586, 356, 156, 158, 392],
  kicker: 'GLOBAL ESCALATION SCENARIO // SECOND-ORDER EFFECTS', title: 'The Nuclear Dominoes', sub: 'Three nuclear-armed flashpoints where a precedent could echo',
  points: [
    { at: P.natanz, t: 'Iran', s: 'HYPOTHETICAL FIRST STRIKE', color: C.amber, align: 'right', dy: 60 },
    { at: P.moscow, t: '1 · Russia', s: 'LARGEST NUCLEAR ARSENAL', color: '#5B8DEF' },
    { at: P.islamabad, t: '2 · South Asia', s: 'INDIA – PAKISTAN (8–12 MIN FLIGHT)', color: '#5B8DEF' },
    { at: P.taipei, t: '3 · East Asia', s: 'CHINA · TAIWAN · JAPAN', color: '#5B8DEF', align: 'right' },
  ],
  lines: [{ from: P.natanz, to: P.moscow, arc: true, color: C.red, dash: '22 16' }, { from: P.natanz, to: P.islamabad, arc: true, color: C.red, dash: '22 16' }, { from: P.natanz, to: P.taipei, arc: true, color: C.red, dash: '22 16' }],
});
makeMap({ name: 'M05_russia_ukraine', bbox: [20, 43, 50, 60], hi: [643], blue: [804],
  kicker: 'FIRST DOMINO // EASTERN EUROPE', title: 'Domino 1: Russia', sub: 'Strategic deterrence and the war in Ukraine',
  points: [{ at: P.moscow, t: 'Moscow', s: '≈5,580 NUCLEAR WARHEADS' }, { at: P.kyiv, t: 'Kyiv', color: '#5B8DEF', align: 'right' }],
  clabels: [{ at: [45, 53], t: 'Russia', size: 84, color: '#E5484D' }, { at: [32, 48.6], t: 'Ukraine', size: 66, color: '#5B8DEF' }],
});
makeMap({ name: 'M06_south_asia_nurkhan', bbox: [66, 23.5, 80.5, 36.5], hi: [586], blue: [356],
  kicker: 'SECOND DOMINO // SOUTH ASIA CRISIS', title: 'Domino 2: South Asia', sub: 'May 2025 clashes & proximity to Pakistan nuclear command',
  points: [
    { at: P.nurkhan, t: 'Nur Khan Air Base', s: 'RAWALPINDI · STRUCK MAY 2025', color: C.amber, dy: 70 },
    { at: P.islamabad, t: 'Islamabad', s: '≈10 KM FROM NUR KHAN', size: 54, dy: -70 },
    { at: P.delhi, t: 'New Delhi', color: '#5B8DEF' },
  ],
  lines: [{ from: P.delhi, to: P.islamabad, label: 'FLIGHT TIME: 8–12 MIN', dx: 120, dy: 40, dash: '18 14' }],
  clabels: [{ at: [68.5, 29.5], t: 'Pakistan', size: 76, color: '#E5484D' }, { at: [77.5, 25], t: 'India', size: 76, color: '#5B8DEF' }],
});
makeMap({ name: 'M07_east_asia', bbox: [110, 20, 145, 44], hi: [156], blue: [158, 392],
  kicker: 'THIRD DOMINO // INDO-PACIFIC', title: 'Domino 3: East Asia', sub: 'The Taiwan Strait and the US extended deterrence umbrella',
  points: [
    { at: P.beijing, t: 'Beijing' }, { at: P.taipei, t: 'Taipei', color: '#5B8DEF' }, { at: P.tokyo, t: 'Tokyo', color: '#5B8DEF' },
    { at: P.hiroshima, t: 'Hiroshima', s: '6 AUG 1945', color: C.amber, size: 50, align: 'right', dy: -40 }, { at: P.nagasaki, t: 'Nagasaki', s: '9 AUG 1945', color: C.amber, size: 50, align: 'right', dy: 40 },
  ],
  clabels: [{ at: [118.6, 23.2], t: 'Taiwan Strait', size: 42, color: '#7A8594' }, { at: [113, 33], t: 'China', size: 84, color: '#E5484D' }],
});
makeMap({ name: 'M08_planA_europe', bbox: [-12, 35, 60, 66], hi: [643, 112], blue: NATO,
  kicker: 'ESCALATION MODEL // PRINCETON SGS', title: 'Plan A: Europe Theater', sub: 'Simulated NATO–Russia tactical-to-strategic nuclear exchange',
  clabels: [{ at: [45, 58], t: 'Russia', size: 84, color: '#E5484D' }, { at: [10, 50], t: 'NATO', size: 84, color: '#5B8DEF' }],
});
makeMap({ name: 'M09_petrov_serpukhov15', bbox: [33, 53.6, 42, 57.4], hi: [643],
  kicker: 'HISTORICAL CASE STUDY // 26 SEPT 1983', title: 'Serpukhov-15 Bunker', sub: 'Soviet early-warning command center south of Moscow',
  points: [{ at: P.moscow, t: 'Moscow' }, { at: P.serpukhov, t: 'Serpukhov-15', s: 'LT. COL. STANISLAV PETROV ON DUTY', color: C.amber, dy: 60 }],
});
makeMap({ name: 'M10_world_taboo_1945', world: true, hi: [392, 840],
  kicker: 'EIGHTY YEARS SINCE NAGASAKI // 1945–2026', title: 'The Unbroken Line', sub: 'Zero nuclear weapons used in combat since August 9, 1945',
  points: [{ at: P.hiroshima, t: 'Hiroshima & Nagasaki', s: 'AUGUST 1945', color: C.amber, align: 'right' }, { at: P.washington, t: 'Washington, D.C.', color: '#5B8DEF' }],
});
console.log('All redesigned 4K maps generated successfully.');
