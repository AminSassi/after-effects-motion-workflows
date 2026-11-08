// checks candidate sea-lane points: inside land? distance to nearest coast (deg)
import { COUNTRIES50 } from './lib3d.mjs';
const inPoly = (p, r) => { let c = false; for (let i = 0, j = r.length - 1; i < r.length; j = i++) { const [xi, yi] = r[i], [xj, yj] = r[j]; if (((yi > p[1]) !== (yj > p[1])) && (p[0] < (xj - xi) * (p[1] - yi) / (yj - yi) + xi)) c = !c; } return c; };
const rings = []; COUNTRIES50.forEach(c => c.polys.forEach(r => { if (r.some(q => q[0] > 50 && q[0] < 62 && q[1] > 22 && q[1] < 30)) rings.push(r); }));
const land = p => rings.some(r => inPoly(p, r));
const dist = p => { let d = 1e9; rings.forEach(r => r.forEach(q => d = Math.min(d, Math.hypot(q[0] - p[0], q[1] - p[1])))); return d; };
const pts = JSON.parse(process.argv[2]);
pts.forEach(p => console.log(JSON.stringify(p), land(p) ? 'LAND' : 'sea ', dist(p).toFixed(3)));
