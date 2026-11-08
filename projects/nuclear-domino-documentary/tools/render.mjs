// Cross-platform renderer: node render.mjs <script.mjs> <tag> <totalFrames> <out.mp4> [workers=8] [from=0] [to=total]
// Renders frames in parallel child processes (chunks of <=100 frames, memory-safe), then encodes H.264 with ffmpeg-static.
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import ffmpeg from 'ffmpeg-static';
const [script, tag, total, out, workers = 8, from = 0, to] = process.argv.slice(2);
const N = +total, W = +workers, F0 = +from, F1 = to != null ? +to : N;
if (!script || !tag || !N || !out) { console.log('usage: node render.mjs script.mjs tag totalFrames out.mp4 [workers] [from] [to]'); process.exit(1); }
const dir = `frames_${tag}`; fs.mkdirSync(dir, { recursive: true });
const chunks = []; for (let a = F0; a < F1; a += 100) chunks.push([a, Math.min(F1, a + 100)]);
const missing = ([a, b]) => { for (let f = a; f < b; f++) if (!fs.existsSync(path.join(dir, `f_${String(f).padStart(5, '0')}.png`))) return true; return false; };
const queue = chunks.filter(missing); let done = 0; const t0 = Date.now();
const run = c => new Promise(res => { const p = spawn(process.execPath, ['--max-old-space-size=3072', script, 'frames', c[0], c[1]], { stdio: ['ignore', 'ignore', 'pipe'] }); let err = ''; p.stderr.on('data', d => err += d); p.on('close', code => { done++; if (code) { console.log(`chunk ${c} failed: ${err.slice(-400)}`); } process.stdout.write(`\r${tag}: ${done}/${nQ} chunks · ${((Date.now() - t0) / 1000).toFixed(0)}s   `); res(code); }); });
const nQ = queue.length; console.log(`${tag}: ${nQ} chunks to render with ${W} workers`);
async function worker() { while (queue.length) await run(queue.shift()); }
await Promise.all(Array.from({ length: Math.min(W, nQ) }, worker));
const bad = chunks.filter(missing); if (bad.length) { console.log(`\nmissing frames in chunks ${bad.map(c => c[0]).join(',')} — rerun to retry`); process.exit(2); }
if (F0 !== 0 || F1 !== N) { console.log('\npartial range rendered, skipping encode'); process.exit(0); }
console.log('\nencoding', out);
const e = spawn(ffmpeg, ['-y', '-loglevel', 'error', '-framerate', '25', '-i', path.join(dir, 'f_%05d.png'), '-c:v', 'libx264', '-profile:v', 'high', '-level:v', '4.1', '-preset', 'fast', '-crf', '15', '-refs', '3', '-bf', '2', '-g', '25', '-keyint_min', '25', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], { stdio: 'inherit' });
e.on('close', c => { console.log(c ? 'encode failed' : `ok ${out} · ${((Date.now() - t0) / 60000).toFixed(1)} min`); process.exit(c); });
