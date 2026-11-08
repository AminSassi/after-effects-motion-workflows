// White House (south facade, night) — detailed procedural model for minute 1, shot 3 (v2: Amin said the box version looked "so basic").
// Main residence with rusticated ground floor, pedimented state-floor windows, cornice + roof balustrade, chimneys,
// the curved South Portico (bow, 6 columns, entablature, Truman balcony, balustrade), East/West colonnade wings,
// lawn + driveway + fountain + trees as a background pass, warm uplighting and a waving flag.
import { box, prism, cyl, quad, flagSVG, rnd } from './lib3d.mjs';

const WALL = '#E8E5DE', BASE = '#CFCBC2', TRIM = '#F4F2EC', ROOF = '#5E646C', LIT = '#F6C46A', LIT2 = '#FFE2A6', DARK = '#1B2027';
const FY = -3.5; // front (south) face plane

// window on the front plane: frame + pane (+ optional cap / pediment); pane lit or dark
function win(S, x, z0, w, h, lit, cap) {
  const y = FY - 0.04;
  S.face([[x - w / 2 - 0.09, y, z0 - 0.09], [x + w / 2 + 0.09, y, z0 - 0.09], [x + w / 2 + 0.09, y, z0 + h + 0.09], [x - w / 2 - 0.09, y, z0 + h + 0.09]], TRIM, { shade: false, z: -50 });
  S.face([[x - w / 2, y - 0.01, z0], [x + w / 2, y - 0.01, z0], [x + w / 2, y - 0.01, z0 + h], [x - w / 2, y - 0.01, z0 + h]], lit ? LIT : DARK, { shade: false, z: -50.1 });
  if (lit) S.face([[x - w / 2 + 0.08, y - 0.02, z0 + 0.08], [x + w / 2 - 0.08, y - 0.02, z0 + 0.08], [x + w / 2 - 0.08, y - 0.02, z0 + h * 0.75], [x - w / 2 + 0.08, y - 0.02, z0 + h * 0.75]], LIT2, { shade: false, z: -50.2, op: 0.55 });
  S.line([[x, y - 0.03, z0], [x, y - 0.03, z0 + h]], TRIM, { sw: 1.2, z: -50.3 }); S.line([[x - w / 2, y - 0.03, z0 + h * 0.55], [x + w / 2, y - 0.03, z0 + h * 0.55]], TRIM, { sw: 1.2, z: -50.3 });
  const zt = z0 + h + 0.09;
  if (cap === 'tri') S.face([[x - w / 2 - 0.22, y - 0.06, zt], [x + w / 2 + 0.22, y - 0.06, zt], [x, y - 0.06, zt + 0.42]], TRIM, { shade: false, z: -50.3, stroke: '#BDB8AE', sw: 0.8 });
  if (cap === 'flat') S.face([[x - w / 2 - 0.2, y - 0.06, zt], [x + w / 2 + 0.2, y - 0.06, zt], [x + w / 2 + 0.2, y - 0.06, zt + 0.16], [x - w / 2 - 0.2, y - 0.06, zt + 0.16]], TRIM, { shade: false, z: -50.3, stroke: '#BDB8AE', sw: 0.8 });
}
// balustrade: posts + rail along a polyline of 2D points at height z
function balustrade(S, pts, z, h = 0.5, step = 0.32) {
  for (let i = 0; i < pts.length - 1; i++) { const [a, b] = [pts[i], pts[i + 1]]; const L = Math.hypot(b[0] - a[0], b[1] - a[1]); const n = Math.max(1, Math.round(L / step));
    for (let k = 0; k <= n; k++) { const p = [a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n]; box(S, [p[0] - 0.05, p[1] - 0.05, z], [0.1, 0.1, h], TRIM, {}); }
    S.face([[a[0], a[1], z + h], [b[0], b[1], z + h], [b[0], b[1], z + h + 0.1], [a[0], a[1], z + h + 0.1]], TRIM, { shade: false, stroke: '#CFCAC0', sw: 0.6 }); }
}
// curved band (annulus segment) — used for the portico plinth, entablature and balcony
function arcBand(S, cx, cy, r0, r1, a0, a1, z0, h, col, n = 18) {
  const P = (r, a, z) => [cx + Math.cos(a) * r, cy + Math.sin(a) * r, z];
  for (let i = 0; i < n; i++) { const a = a0 + (a1 - a0) * i / n, b = a0 + (a1 - a0) * (i + 1) / n;
    S.face([P(r1, a, z0), P(r1, b, z0), P(r1, b, z0 + h), P(r1, a, z0 + h)], col, { cull: false });
    S.face([P(r0, a, z0 + h), P(r1, a, z0 + h), P(r1, b, z0 + h), P(r0, b, z0 + h)], col, { z: 0.02 }); }
}
// low-poly tree (stacked tapered octagons)
function tree(S, x, y, s = 1, seed = 0) {
  cyl(S, [x, y, 0], 0.18 * s, 1.2 * s, '#2A2420', 6);
  const layers = [[1.0, 1.0], [1.35, 2.0], [1.15, 3.0], [0.7, 3.8]];
  layers.forEach(([r, z], i) => { const rr = r * s * (0.9 + rnd(seed + i) * 0.25); const pts = []; for (let k = 0; k < 12; k++) { const a = k / 12 * Math.PI * 2 + seed; pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]); } prism(S, pts, z * s, 0.9 * s, '#13241A', {}); });
}

// G = background scene (lawn, drive, uplight pools) — always behind; S = building + props
export function whiteHouse(S, G, t) {
  // lawn + driveway ellipse + fountain basin outline
  G.face([[-60, -60, 0], [60, -60, 0], [60, 30, 0], [-60, 30, 0]], '#0B130E', { shade: false });
  const ring = (r0, r1, cy, col, sq = 0.55) => { for (let i = 0; i < 48; i++) { const a = i / 48 * Math.PI * 2, b = (i + 1) / 48 * Math.PI * 2; G.face([[Math.cos(a) * r0, cy + Math.sin(a) * r0 * sq, 0.01], [Math.cos(b) * r0, cy + Math.sin(b) * r0 * sq, 0.01], [Math.cos(b) * r1, cy + Math.sin(b) * r1 * sq, 0.01], [Math.cos(a) * r1, cy + Math.sin(a) * r1 * sq, 0.01]], col, { shade: false }); } };
  ring(13, 14.2, -14, '#262A2E', 0.62); ring(0, 2.2, -14, '#16201A', 0.62);
  G.face([[-9.5, -3.6, 0.02], [9.5, -3.6, 0.02], [9.5, -5.2, 0.02], [-9.5, -5.2, 0.02]], '#2E3236', { shade: false }); // terrace
  // warm uplight pools on the ground in front of the facade
  for (let i = -4; i <= 4; i++) G.at([i * 2.1, -4.4, 0], (x, y, sc) => `<ellipse cx="${x}" cy="${y}" rx="${sc * 1.6}" ry="${sc * 0.55}" fill="url(#whUp)" opacity="0.55"/>`);

  // ---- main residence (one depth group: its own facade details always draw on top of its walls) ----
  S.group([0, 0, 3], () => {
  box(S, [-9, FY, 0], [18, 7, 1.8], BASE, {});                     // rusticated ground floor
  for (let k = 1; k < 4; k++) S.line([[-9, FY - 0.02, k * 0.45], [-3.9, FY - 0.02, k * 0.45]], '#B5B0A6', { sw: 0.8, z: -40 }), S.line([[3.9, FY - 0.02, k * 0.45], [9, FY - 0.02, k * 0.45]], '#B5B0A6', { sw: 0.8, z: -40 });
  box(S, [-9, FY, 1.8], [18, 7, 4.2], WALL, {});                    // state + second floor
  box(S, [-9.1, FY - 0.08, 1.75], [18.2, 7.16, 0.14], TRIM, {});     // string course
  box(S, [-9.25, FY - 0.25, 6.0], [18.5, 7.5, 0.4], TRIM, {});      // cornice
  box(S, [-8.6, FY + 0.5, 6.4], [17.2, 6, 0.55], ROOF, {});         // low roof
  [[-6.2, 0.6], [-2.6, 2.2], [2.6, 2.2], [6.2, 0.6]].forEach(([x, y]) => box(S, [x - 0.35, y - 0.25, 6.4], [0.7, 0.5, 1.3], WALL, {})); // chimneys
  // pilasters between bays
  [-8.85, -5.4, -3.95, 3.95, 5.4, 8.85].forEach(x => box(S, [x - 0.12, FY - 0.1, 1.9], [0.24, 0.1, 4.1], TRIM, { z: -45 }));
  // windows: 3 bays each side of the portico, 3 storeys
  const bays = [-7.95, -6.65, -4.7, 4.7, 6.65, 7.95];
  bays.forEach((x, i) => {
    win(S, x, 0.45, 0.62, 0.9, i % 2 === 0, null);                               // ground floor
    win(S, x, 2.25, 0.72, 1.75, i !== 1, i % 2 ? 'flat' : 'tri');               // state floor (alternating pediments)
    win(S, x, 4.55, 0.66, 1.05, i === 0 || i === 3 || i === 5, null);           // second floor
  });
  balustrade(S, [[-9.2, FY - 0.15], [9.2, FY - 0.15]], 6.4, 0.5, 0.36);          // roof balustrade
  }, 0);

  // ---- South Portico: bow + 6 columns + entablature + balcony ----
  const cx = 0, cy = FY, A0 = Math.PI, A1 = Math.PI * 2;
  arcBand(S, cx, cy, 0, 4.0, A0, A1, 0, 1.8, BASE, 24);                          // ground-level plinth
  arcBand(S, cx, cy, 0, 2.6, A0, A1, 1.8, 4.2, WALL, 24);                        // bow (Blue Room)
  [-0.5, 0, 0.5].forEach((da, i) => { const a = Math.PI * 1.5 + da; const x = cx + Math.cos(a) * 2.62, y = cy + Math.sin(a) * 2.62; const nx = -Math.sin(a), ny = Math.cos(a), w = 0.36;
    S.face([[x - nx * w, y - ny * w, 2.25], [x + nx * w, y + ny * w, 2.25], [x + nx * w, y + ny * w, 3.95], [x - nx * w, y - ny * w, 3.95]], i === 1 ? LIT2 : LIT, { shade: false, z: -0.1 });
    S.face([[x - nx * w, y - ny * w, 4.55], [x + nx * w, y + ny * w, 4.55], [x + nx * w, y + ny * w, 5.5], [x - nx * w, y - ny * w, 5.5]], i === 1 ? LIT : DARK, { shade: false, z: -0.1 }); });
  for (let i = 0; i < 6; i++) { const a = A0 + 0.32 + (A1 - A0 - 0.64) * i / 5; const x = cx + Math.cos(a) * 3.55, y = cy + Math.sin(a) * 3.55;
    cyl(S, [x, y, 1.8], 0.3, 0.18, TRIM, 12); cyl(S, [x, y, 1.98], 0.22, 3.62, '#F7F5F0', 12); box(S, [x - 0.3, y - 0.3, 5.6], [0.6, 0.6, 0.2], TRIM, {}); }
  arcBand(S, cx, cy, 3.1, 3.95, A0, A1, 5.8, 0.55, TRIM, 24);                    // entablature
  arcBand(S, cx, cy, 2.6, 3.3, A0, A1, 3.95, 0.12, TRIM, 24);                    // Truman balcony slab
  const arcPts = (r, n) => Array.from({ length: n + 1 }, (_, i) => { const a = A0 + (A1 - A0) * i / n; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]; });
  balustrade(S, arcPts(3.25, 16), 4.07, 0.45, 0.3);                              // balcony railing
  balustrade(S, arcPts(3.85, 16), 6.35, 0.45, 0.34);                             // roof balustrade on the portico
  // steps down to the lawn (two flanking stairs)
  [-1, 1].forEach(sg => { for (let k = 0; k < 6; k++) box(S, [sg * 4.1 - (sg > 0 ? 0 : 2.2), FY - 1.6 - k * 0.32, 0], [2.2, 0.32, 1.8 - k * 0.3], BASE, {}); });

  // ---- East / West wings (low colonnades) ----
  [-1, 1].forEach(sg => { const x0 = sg > 0 ? 9.6 : -18.6;
    box(S, [x0, -1.5, 0], [9, 4.5, 2.4], WALL, {}); box(S, [x0 - 0.1, -1.6, 2.4], [9.2, 4.7, 0.25], TRIM, {});
    for (let k = 0; k < 9; k++) { const x = x0 + 0.5 + k * 1.0; cyl(S, [x, -2.3, 0], 0.13, 2.4, '#F2F0EA', 8); }
    box(S, [x0, -2.55, 2.4], [9, 1.1, 0.22], TRIM, {});
    for (let k = 0; k < 8; k++) { const x = x0 + 1.0 + k * 1.0; S.face([[x - 0.22, -1.53, 0.5], [x + 0.22, -1.53, 0.5], [x + 0.22, -1.53, 1.6], [x - 0.22, -1.53, 1.6]], (k + (sg > 0 ? 1 : 0)) % 3 ? LIT : DARK, { shade: false, z: -0.05 }); } });

  // ---- fountain, trees ----
  [[-15, -8, 1.2], [-21, -4, 1.4], [15, -8, 1.2], [21, -4, 1.4], [-11, -19, 1.0], [11, -19, 1.0], [-26, 2, 1.6], [26, 2, 1.6]].forEach(([x, y, s], i) => tree(S, x, y, s, i * 1.7));

  // ---- flag on the roof (waving, strip-mapped) ----
  cyl(S, [0, 0.4, 6.95], 0.05, 3.6, '#C8CDD3', 6);
  const W = 2.6, H = 1.6, N = 10, z1 = 10.4;
  for (let j = 0; j < N; j++) { const u0 = j / N, u1 = (j + 1) / N; const wy = u => Math.sin(u * 5 - t * 7) * 0.22 * u;
    const tl = [W * u0, 0.4 + wy(u0), z1], tr = [W * u1, 0.4 + wy(u1), z1], bl = [W * u0, 0.4 + wy(u0), z1 - H];
    const lw = 300 / N; quad(S, tl, tr, bl, lw, 185, `<defs><clipPath id="whf${j}"><rect width="${lw + 0.6}" height="185"/></clipPath></defs><g clip-path="url(#whf${j})"><g transform="translate(${-j * lw} 0)">${flagSVG('usa', 0, 0, 300, 185)}</g><rect width="${lw + 0.6}" height="185" fill="#000" opacity="${0.18 - 0.18 * Math.cos(u0 * 5 - t * 7)}"/></g>`, { backface: true, z: -0.2 }); }
}
export const WH_DEFS = `<defs><radialGradient id="whUp"><stop offset="0" stop-color="#FFD9A0" stop-opacity="0.55"/><stop offset="1" stop-color="#FFD9A0" stop-opacity="0"/></radialGradient><radialGradient id="whSky" cx="50%" cy="38%" r="60%"><stop offset="0" stop-color="#1B2433"/><stop offset="1" stop-color="#07090C" stop-opacity="0"/></radialGradient></defs>`;
