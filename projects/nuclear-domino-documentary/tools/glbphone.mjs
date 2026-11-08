// Software rasterizer for the iPhone GLB (Amin's mockup) → RGBA PNG layer that sits in the lib3d SVG scene.
// z-buffer, 2x supersampling over the phone's screen-space bbox, Gouraud lighting with a studio env for metal/gloss.
import fs from 'fs';
import zlib from 'zlib';
import { TOOLS, FONTS } from './lib3d.mjs';
import { Resvg } from '@resvg/resvg-js';

const GLB = TOOLS + 'models/iphone18_burgundy.glb';
const SKIP = new Set(['Front_Cam_Glass', 'Back_Cam_Glass', 'Gradient']); // transparent glass skipped; Front_Screen is textured with our screen content
let MODEL = null;
function load() {
  if (MODEL) return MODEL;
  const buf = fs.readFileSync(GLB); const jl = buf.readUInt32LE(12); const J = JSON.parse(buf.slice(20, 20 + jl).toString()); const bin = buf.slice(20 + jl + 8);
  const read = (ai) => { const a = J.accessors[ai], bv = J.bufferViews[a.bufferView]; const n = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4 }[a.type]; const off = (bv.byteOffset || 0) + (a.byteOffset || 0);
    const cs = { 5126: 4, 5125: 4, 5123: 2, 5121: 1 }[a.componentType]; const stride = bv.byteStride || cs * n; const out = new Float64Array(a.count * n);
    for (let i = 0; i < a.count; i++) for (let k = 0; k < n; k++) { const o = off + i * stride + k * cs; out[i * n + k] = a.componentType === 5126 ? bin.readFloatLE(o) : a.componentType === 5125 ? bin.readUInt32LE(o) : a.componentType === 5123 ? bin.readUInt16LE(o) : bin.readUInt8(o); }
    return out; };
  const P = [], N = [], COL = [], META = [];
  J.nodes.forEach(nd => { if (nd.mesh == null) return; const m = J.meshes[nd.mesh]; if (SKIP.has(m.name)) return;
    m.primitives.forEach(pr => { const mat = J.materials[pr.material] || {}; const pb = mat.pbrMetallicRoughness || {}; const bc = pb.baseColorFactor || [0.5, 0.5, 0.5, 1];
      if (mat.alphaMode === 'BLEND' && bc[3] < 0.5 && m.name !== 'Front_Screen') return;
      const pos = read(pr.attributes.POSITION), nor = pr.attributes.NORMAL != null ? read(pr.attributes.NORMAL) : null; const idx = pr.indices != null ? read(pr.indices) : Array.from({ length: pos.length / 3 }, (_, i) => i);
      const srgb = c => Math.pow(Math.max(0, c), 1 / 2.2);
      const meta = { screen: m.name === 'Front_Screen', col: [srgb(bc[0]), srgb(bc[1]), srgb(bc[2])], metal: pb.metallicFactor ?? 1, rough: pb.roughnessFactor ?? 1, name: mat.name };
      for (let i = 0; i < idx.length; i++) { const v = idx[i]; P.push(pos[v * 3], pos[v * 3 + 1], pos[v * 3 + 2]); if (nor) N.push(nor[v * 3], nor[v * 3 + 1], nor[v * 3 + 2]); else N.push(0, 0, 1); }
      META.push([P.length / 9, meta]); }); });
  MODEL = { P: Float64Array.from(P), N: Float64Array.from(N), META };
  return MODEL;
}
// screen rectangle (model coords, metres) from the Front_Screen mesh bbox
export const SCREEN = { x0: -0.0372, x1: 0.0372, y0: 0.0018, y1: 0.1612, z: 0.0043, r: 0.0071 };
export const PHONE_H = 0.163;
// studio environment: soft top light, dim floor, warm/cool side bands — gives chrome/glass believable highlights
const env = (r) => { const up = r[2], side = r[0]; return 0.10 + 0.85 * Math.pow(Math.max(0, up), 3) + 0.35 * Math.pow(Math.max(0, side), 6) + 0.18 * Math.pow(Math.max(0, -side), 8); };
const L = (() => { const v = [-0.45, -0.6, 0.66]; const m = Math.hypot(...v); return v.map(x => x / m); })();
// cam: lib3d Cam; toWorld(p[3]) → world point; toWorldN(n[3]) → world normal (rotation only)
export function renderPhone(cam, toWorld, toWorldN, o = {}) {
  const M = load(); const nv = M.P.length / 3; const SS = 2;
  const sx = new Float64Array(nv), sy = new Float64Array(nv), sz = new Float64Array(nv), cr = new Float64Array(nv), cg = new Float64Array(nv), cb = new Float64Array(nv);
  let minx = 1e9, miny = 1e9, maxx = -1e9, maxy = -1e9; let mi = 0, mEnd = M.META[0][0], meta = M.META[0][1];
  for (let v = 0; v < nv; v++) {
    const t3 = Math.floor(v / 3); while (t3 >= mEnd && mi < M.META.length - 1) { mi++; mEnd = M.META[mi][0]; meta = M.META[mi][1]; }
    const w = toWorld([M.P[v * 3], M.P[v * 3 + 1], M.P[v * 3 + 2]]); const p = cam.p(w); sx[v] = p[0]; sy[v] = p[1]; sz[v] = p[2];
    if (p[2] > 0.5) { minx = Math.min(minx, p[0]); maxx = Math.max(maxx, p[0]); miny = Math.min(miny, p[1]); maxy = Math.max(maxy, p[1]); }
    let n = toWorldN([M.N[v * 3], M.N[v * 3 + 1], M.N[v * 3 + 2]]); const vd = [cam.pos[0] - w[0], cam.pos[1] - w[1], cam.pos[2] - w[2]]; const vm = Math.hypot(...vd); const V = vd.map(x => x / vm);
    if (n[0] * V[0] + n[1] * V[1] + n[2] * V[2] < 0) n = n.map(x => -x);
    const ndl = Math.max(0, n[0] * L[0] + n[1] * L[1] + n[2] * L[2]); const nv2 = n[0] * V[0] + n[1] * V[1] + n[2] * V[2];
    const R = [2 * nv2 * n[0] - V[0], 2 * nv2 * n[1] - V[1], 2 * nv2 * n[2] - V[2]]; const H = [L[0] + V[0], L[1] + V[1], L[2] + V[2]]; const hm = Math.hypot(...H);
    const spec = Math.pow(Math.max(0, (n[0] * H[0] + n[1] * H[1] + n[2] * H[2]) / hm), 8 + (1 - meta.rough) * 120) * (1 - meta.rough * 0.8);
    const fres = Math.pow(1 - Math.max(0, nv2), 4); const e = env(R);
    const c = meta.col; const k = meta.metal;
    for (let ch = 0; ch < 3; ch++) { const dif = c[ch] * (0.22 + 0.9 * ndl); const met = c[ch] * (0.35 + 2.4 * e) + spec * 0.9; let val = dif * (1 - k) + met * k + spec * (1 - k) * 0.6 + fres * 0.08 * (1 - meta.rough);
      (ch === 0 ? cr : ch === 1 ? cg : cb)[v] = Math.min(1, val); }
  }
  if (!(maxx > minx)) return null;
  // screen texture: perspective-correct UVs from model x/y over the screen rect, mip chain for minification
  const tex = o.tex ? mips(o.tex) : null; const scrTri = new Uint8Array(nv / 3); { let mi2 = 0; for (let t = 0; t < nv / 3; t++) { while (t >= M.META[mi2][0] && mi2 < M.META.length - 1) mi2++; scrTri[t] = M.META[mi2][1].screen ? 1 : 0; } }
  const pad = 4; const bx = Math.max(0, Math.floor(minx) - pad), by = Math.max(0, Math.floor(miny) - pad), ex = Math.min(1920, Math.ceil(maxx) + pad), ey = Math.min(1080, Math.ceil(maxy) + pad);
  const W = (ex - bx), Hh = (ey - by); if (W <= 0 || Hh <= 0) return null; const BW = W * SS, BH = Hh * SS;
  const zBias = 0.0006 * (o.scale || 1); // screen sits on the front glass plane: win z-ties against Front_Panel
  const zb = new Float32Array(BW * BH).fill(1e9), col = new Float32Array(BW * BH * 3), cov = new Uint8Array(BW * BH);
  for (let t = 0; t < nv; t += 3) {
    const a = t, b = t + 1, c = t + 2; if (sz[a] < 0.5 || sz[b] < 0.5 || sz[c] < 0.5) continue;
    const x0 = (sx[a] - bx) * SS, y0 = (sy[a] - by) * SS, x1 = (sx[b] - bx) * SS, y1 = (sy[b] - by) * SS, x2 = (sx[c] - bx) * SS, y2 = (sy[c] - by) * SS;
    const area = (x1 - x0) * (y2 - y0) - (x2 - x0) * (y1 - y0); if (Math.abs(area) < 1e-9) continue;
    const isS = tex && scrTri[t / 3]; let U, Vv, lvl;
    if (isS) { const uv = v => [(M.P[v * 3] - SCREEN.x0) / (SCREEN.x1 - SCREEN.x0) * tex[0].w, (SCREEN.y1 - M.P[v * 3 + 1]) / (SCREEN.y1 - SCREEN.y0) * tex[0].h];
      U = [uv(a), uv(b), uv(c)]; const ta = Math.abs((U[1][0] - U[0][0]) * (U[2][1] - U[0][1]) - (U[2][0] - U[0][0]) * (U[1][1] - U[0][1]));
      lvl = Math.max(0, Math.min(tex.length - 1, Math.floor(0.5 * Math.log2(Math.max(1e-9, ta / Math.abs(area))) + 0.3))); }
    const mnx = Math.max(0, Math.floor(Math.min(x0, x1, x2))), mxx = Math.min(BW - 1, Math.ceil(Math.max(x0, x1, x2))), mny = Math.max(0, Math.floor(Math.min(y0, y1, y2))), mxy = Math.min(BH - 1, Math.ceil(Math.max(y0, y1, y2)));
    for (let y = mny; y <= mxy; y++) { const py = y + 0.5; for (let x = mnx; x <= mxx; x++) { const px = x + 0.5;
      const w0 = ((x1 - px) * (y2 - py) - (x2 - px) * (y1 - py)) / area, w1 = ((x2 - px) * (y0 - py) - (x0 - px) * (y2 - py)) / area, w2 = 1 - w0 - w1;
      if (w0 < 0 || w1 < 0 || w2 < 0) continue; const z = w0 * sz[a] + w1 * sz[b] + w2 * sz[c] - (isS ? zBias : 0); const i = y * BW + x; if (z >= zb[i]) continue; zb[i] = z; cov[i] = 1;
      let r0 = w0 * cr[a] + w1 * cr[b] + w2 * cr[c], g0 = w0 * cg[a] + w1 * cg[b] + w2 * cg[c], b0 = w0 * cb[a] + w1 * cb[b] + w2 * cb[c];
      if (isS) { const q0 = w0 / sz[a], q1 = w1 / sz[b], q2 = w2 / sz[c], qs = q0 + q1 + q2; const u = (q0 * U[0][0] + q1 * U[1][0] + q2 * U[2][0]) / qs, vv = (q0 * U[0][1] + q1 * U[1][1] + q2 * U[2][1]) / qs;
        const T = sample(tex[lvl], u / (1 << lvl), vv / (1 << lvl)); const al = T[3] * (o.texOp ?? 1); const gl = Math.min(1, (r0 + g0 + b0) / 3) * 0.12; // faint glass reflection on top
        r0 = T[0] * al + r0 * (1 - al) * 0.25 + gl; g0 = T[1] * al + g0 * (1 - al) * 0.25 + gl; b0 = T[2] * al + b0 * (1 - al) * 0.25 + gl; }
      col[i * 3] = Math.min(1, r0); col[i * 3 + 1] = Math.min(1, g0); col[i * 3 + 2] = Math.min(1, b0); } }
  }
  // downsample → RGBA rows with filter byte
  const raw = Buffer.alloc((W * 4 + 1) * Hh);
  for (let y = 0; y < Hh; y++) { raw[y * (W * 4 + 1)] = 0; for (let x = 0; x < W; x++) { let r = 0, g = 0, b2 = 0, a = 0;
    for (let j = 0; j < SS; j++) for (let k = 0; k < SS; k++) { const i = (y * SS + j) * BW + x * SS + k; if (cov[i]) { r += col[i * 3]; g += col[i * 3 + 1]; b2 += col[i * 3 + 2]; a++; } }
    const o2 = y * (W * 4 + 1) + 1 + x * 4; if (a) { raw[o2] = Math.round(r / a * 255); raw[o2 + 1] = Math.round(g / a * 255); raw[o2 + 2] = Math.round(b2 / a * 255); raw[o2 + 3] = Math.round(a / (SS * SS) * 255); } } }
  const png = encodePNG(W, Hh, raw);
  return { png, x: bx, y: by, w: W, h: Hh, depth: (() => { let s = 0, n = 0; for (let v = 0; v < nv; v += 97) { s += sz[v]; n++; } return s / n; })() };
}
// texture helpers: tex = { w, h, d: Float32Array RGBA 0..1 (straight alpha) }
function mips(t0) { if (t0._m) return t0._m; const L = [t0]; let t = t0; while (t.w > 32 && t.h > 32) { const w = t.w >> 1, h = t.h >> 1, d = new Float32Array(w * h * 4);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) for (let k = 0; k < 4; k++) { const s = (yy, xx) => t.d[((y * 2 + yy) * t.w + x * 2 + xx) * 4 + k]; d[(y * w + x) * 4 + k] = (s(0, 0) + s(0, 1) + s(1, 0) + s(1, 1)) / 4; }
  t = { w, h, d }; L.push(t); } t0._m = L; return L; }
function sample(t, u, v) { const x = Math.min(t.w - 1.001, Math.max(0, u - 0.5)), y = Math.min(t.h - 1.001, Math.max(0, v - 0.5)); const ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy; const o = [0, 0, 0, 0];
  for (let k = 0; k < 4; k++) { const p = (yy, xx) => t.d[((iy + yy) * t.w + ix + xx) * 4 + k]; o[k] = (p(0, 0) * (1 - fx) + p(0, 1) * fx) * (1 - fy) + (p(1, 0) * (1 - fx) + p(1, 1) * fx) * fy; } return o; }
export function texFromSVG(inner, w = SCR_W, h = SCR_H) { const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${inner}</svg>`;
  const img = new Resvg(svg, { font: { fontFiles: FONTS, loadSystemFonts: false, defaultFontFamily: 'Inter' } }).render(); const px = img.pixels; const d = new Float32Array(img.width * img.height * 4);
  for (let i = 0; i < px.length; i++) d[i] = px[i] / 255; return { w: img.width, h: img.height, d }; }
const crcT = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
const crc = b => { let c = 0xFFFFFFFF; for (const x of b) c = crcT[(c ^ x) & 255] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; };
const chunk = (type, data) => { const len = Buffer.alloc(4); len.writeUInt32BE(data.length); const td = Buffer.concat([Buffer.from(type), data]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([len, td, c]); };
function encodePNG(w, h, raw) { const ih = Buffer.alloc(13); ih.writeUInt32BE(w, 0); ih.writeUInt32BE(h, 4); ih[8] = 8; ih[9] = 6; ih[10] = 0; ih[11] = 0; ih[12] = 0;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ih), chunk('IDAT', zlib.deflateSync(raw, { level: 3 })), chunk('IEND', Buffer.alloc(0))]); }
// screen content wrapper: 720x1542 local px (matches the model's screen aspect), rounded corners, status bar, Dynamic Island
export const SCR_W = 720, SCR_H = 1542;
export function screenWrap(inner, o = {}) {
  return `<defs><clipPath id="scrc${o.id || ''}"><rect width="${SCR_W}" height="${SCR_H}" rx="70"/></clipPath></defs><g clip-path="url(#scrc${o.id || ''})"><rect width="${SCR_W}" height="${SCR_H}" fill="#000"/><g transform="translate(0 72)">${inner}</g>` +
    `<text x="92" y="66" fill="#F2F2F2" font-family="Inter" font-weight="700" font-size="32">${o.time || '8:47'}</text>` +
    `<g fill="#F2F2F2"><rect x="540" y="44" width="7" height="14" rx="2"/><rect x="551" y="40" width="7" height="18" rx="2"/><rect x="562" y="36" width="7" height="22" rx="2"/><rect x="573" y="32" width="7" height="26" rx="2"/>` +
    `<rect x="598" y="34" width="50" height="24" rx="7" fill="none" stroke="#F2F2F2" stroke-width="2.5"/><rect x="602" y="38" width="34" height="16" rx="4"/><rect x="650" y="42" width="4" height="8" rx="2"/></g>` +
    `<rect x="250" y="20" width="220" height="64" rx="32" fill="#000"/><circle cx="440" cy="52" r="11" fill="#0B0E1A"/>` +
    `<rect x="${SCR_W / 2 - 120}" y="${SCR_H - 26}" width="240" height="9" rx="4.5" fill="#F2F2F2" opacity="0.8"/>` +
    `<rect width="${SCR_W}" height="${SCR_H}" fill="url(#scrGl)" opacity="0.10"/><defs><linearGradient id="scrGl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="0.45" stop-color="#fff" stop-opacity="0"/></linearGradient></defs></g>`;
}
// lib3d helper: place the phone (model y-up, screen facing +z) in a lib3d scene.
// base = world point under the phone's bottom-centre, hWorld = phone height in world units, R = rotation fn applied to world offsets
export function phoneLayer(S, base, hWorld, R, o = {}) {
  const s = hWorld / PHONE_H; const toW = p => { const q = R([p[0] * s, -p[2] * s, p[1] * s]); return [base[0] + q[0], base[1] + q[1], base[2] + q[2]]; };
  const toN = n => { const q = R([n[0], -n[2], n[1]]); const m = Math.hypot(...q) || 1; return q.map(x => x / m); };
  const r = renderPhone(S.cam, toW, toN, { ...o, scale: s }); if (!r) return null;
  fs.mkdirSync(TOOLS + 'phone_cache/', { recursive: true }); const f = `phone_cache/${o.tag || 'p'}_${process.pid}_${Math.round(Math.random() * 1e9)}.png`; fs.writeFileSync(TOOLS + f, r.png);
  S.raw(`<image href="${f}" x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" opacity="${o.op ?? 1}"/>`, r.depth + (o.z ?? 0));
  const sc = SCREEN, z = sc.z + 0.0003; return { tl: toW([sc.x0, sc.y1, z]), tr: toW([sc.x1, sc.y1, z]), bl: toW([sc.x0, sc.y0, z]), depth: r.depth, file: f };
}
