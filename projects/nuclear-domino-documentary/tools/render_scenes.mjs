// Multi-threaded 1080p25 Scene Renderer for Nuclear Taboo
// Renders ND_TIMER_v1.mp4, ND_PLANA_v1.mp4, ND_PETROV_v1.mp4, ND_CLOCK_v1.mp4, and ND_MINUTE1_v1.mp4
import fs from 'fs';
import path from 'path';
import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';
import { execFileSync } from 'child_process';
import { Resvg } from '@resvg/resvg-js';
import { frame as minute1Frame, FONTFILES } from './minute1.mjs';

const W = 1920, H = 1080, FPS = 25;
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
  green: '#3DD68C',
};

const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const pr = (t, a, b) => cl((t - a) / (b - a));
const expo = x => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));
const inOut = x => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const spring = (t, t0, dur = 0.55) => {
  const d = t - t0;
  if (d <= 0) return 0;
  const x = d / dur;
  return cl(1 - Math.exp(-6.5 * x) * Math.cos(x * 7.2), -0.2, 1.12);
};
const lerp = (a, b, k) => a + (b - a) * k;
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const T = (x, y, s, o = {}) =>
  `<text x="${x}" y="${y}" fill="${o.fill || C.text}" font-family="${o.ff || 'Montserrat'}" font-style="${o.it ? 'italic' : 'normal'}" font-weight="${o.w || 700}" font-size="${o.size || 36}" text-anchor="${o.a || 'start'}" letter-spacing="${o.ls || 0}" opacity="${o.op ?? 1}">${esc(s)}</text>`;
const M = (x, y, s, o = {}) => T(x, y, s, { ...o, ff: 'Consolas', w: o.w || 700, ls: o.ls ?? 2 });
const SR = (x, y, s, o = {}) => T(x, y, s, { ...o, ff: 'Playfair Display', w: o.w || 900 });

function baseSvg(body, accent = C.red, tv = 0) {
  const drift = 1 + tv * 0.0025;
  const fl = 0.016 * (Math.sin(tv * 53.1) * 0.5 + Math.sin(tv * 21.9) * 0.5);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <defs>
      <radialGradient id="glow" cx="50%" cy="45%" r="70%">
        <stop offset="0%" stop-color="${accent}" stop-opacity="0.12"/>
        <stop offset="60%" stop-color="#0A0E15" stop-opacity="0.5"/>
        <stop offset="100%" stop-color="#040609" stop-opacity="0.96"/>
      </radialGradient>
      <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
        <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#161F2C" stroke-width="1" opacity="0.55"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="${C.bg}"/>
    <rect width="100%" height="100%" fill="url(#grid)"/>
    <rect width="100%" height="100%" fill="url(#glow)"/>
    <g transform="translate(960 540) scale(${drift.toFixed(4)}) translate(-960 -540)">${body}</g>
    <rect width="100%" height="100%" fill="#fff" opacity="${Math.max(0, fl).toFixed(4)}"/>
  </svg>`;
}

// ============================================================================
// SCENE 1: ND_TIMER_v1 (3.32s, 308.00–311.32s) — South Asia 8–12 Min Flight Timer
// ============================================================================
function timerFrame(t) {
  const k = inOut(pr(t, 0.15, 2.8));
  const totalSec = lerp(12 * 60, 8 * 60, k);
  const mm = String(Math.floor(totalSec / 60)).padStart(2, '0');
  const ss = String(Math.floor(totalSec % 60)).padStart(2, '0');
  const cs = String(Math.floor((totalSec * 100) % 100)).padStart(2, '0');

  let b = `<rect x="90" y="75" width="7" height="95" fill="${C.red}"/>`;
  b += M(114, 98, 'SOUTH ASIA BALLISTIC TELEMETRY // RAWALPINDI ↔ NEW DELHI', { size: 17, fill: C.amber, ls: 3 });
  b += SR(114, 145, 'Zero Warning Window', { size: 46, w: 900, fill: C.text });
  b += M(W - 90, 98, 'RANGE: ≈680 KM · MACH 6–8', { size: 16, fill: C.dim, a: 'end', ls: 2 });

  // Main Radar & Countdown Panel
  b += `<rect x="90" y="205" width="1740" height="760" fill="${C.panel}" stroke="${C.red}" stroke-width="2.5"/>`;
  // Ballistic arc across background of panel
  const arcK = expo(pr(t, 0.05, 1.8));
  const x0 = 260, y0 = 740, x1 = 1660, y1 = 740;
  b += `<line x1="${x0}" y1="${y0}" x2="${x1}" y2="${y1}" stroke="${C.line}" stroke-width="2" stroke-dasharray="8 8"/>`;
  b += `<path d="M${x0},${y0} Q960,230 ${x1},${y1}" fill="none" stroke="${C.red}" stroke-width="4" stroke-dasharray="1700" stroke-dashoffset="${1700 * (1 - arcK)}"/>`;
  b += `<circle cx="${x0}" cy="${y0}" r="12" fill="${C.amber}"/><circle cx="${x0}" cy="${y0}" r="${14 + (t * 35) % 45}" fill="none" stroke="${C.amber}" stroke-width="2" opacity="${1 - ((t * 35) % 45) / 45}"/>`;
  b += M(x0, y0 + 42, 'RAWALPINDI / NUR KHAN', { size: 20, fill: C.amber, a: 'middle' });
  b += `<circle cx="${x1}" cy="${y1}" r="12" fill="${C.blue}"/><circle cx="${x1}" cy="${y1}" r="${14 + ((t * 35 + 20) % 45)}" fill="none" stroke="${C.blue}" stroke-width="2" opacity="${1 - (((t * 35 + 20) % 45) / 45)}"/>`;
  b += M(x1, y1 + 42, 'NEW DELHI COMMAND', { size: 20, fill: C.blue, a: 'middle' });

  // Center Countdown Readout
  b += M(960, 325, 'BALLISTIC FLIGHT TIME // DETECTION TO IMPACT', { size: 22, fill: C.amber, a: 'middle', ls: 5 });
  b += SR(960, 565, '08 – 12', { size: 215, w: 900, fill: C.red, a: 'middle' });
  b += M(960, 645, 'MINUTES TOTAL DECISION WINDOW', { size: 32, fill: C.text, a: 'middle', ls: 8 });

  // Live ticking telemetry badge
  b += `<rect x="650" y="700" width="620" height="74" fill="${C.redDark}" stroke="${C.red}" stroke-width="2"/>`;
  b += M(960, 748, `SIMULATED T-MINUS // ${mm}:${ss}.${cs}`, { size: 30, fill: C.amber, a: 'middle', ls: 3 });

  b += M(960, 915, 'NUR KHAN AIR BASE LIES 10 KM FROM ISLAMABAD & PAKISTAN NUCLEAR COMMAND AUTHORITY', { size: 19, fill: C.sub, a: 'middle' });
  return baseSvg(b, C.red, t);
}

// ============================================================================
// SCENE 2: ND_PLANA_v1 (21.08s, 376.80–397.88s) — Princeton Plan A Counter
// ============================================================================
function planAFrame(t) {
  let b = `<rect x="85" y="65" width="7" height="100" fill="${C.red}"/>`;
  b += M(110, 88, 'WAR-GAME SIMULATION // PRINCETON PROGRAM ON SCIENCE & GLOBAL SECURITY', { size: 16, fill: C.red, ls: 3 });
  b += SR(110, 136, 'Plan A: NATO–Russia Escalation Model', { size: 46, w: 900, fill: C.text });
  b += T(110, 166, 'Immediate blast and thermal casualties in the first 5 hours — before radioactive fallout', { size: 21, w: 500, fill: C.sub });

  const phases = [
    { t0: 0.1, countEnd: 3.2, title: '01 // TACTICAL', win: 'FIRST 3 HOURS', target: 2.6, unit: 'M', sub: 'Immediate Casualties', desc: ['300 warheads hit military', '& command targets in Europe'], col: C.amber, bg: '#1E160B', bar: 0.22 },
    { t0: 5.5, countEnd: 8.2, title: '02 // STRATEGIC', win: '+45 MINUTES', target: 3.4, unit: 'M', sub: 'Additional Casualties', desc: ['ICBM & SLBM salvos strike', 'US and Russian nuclear forces'], col: C.amber, bg: '#24130C', bar: 0.45 },
    { t0: 9.2, countEnd: 12.2, title: '03 // COUNTERVALUE', win: 'FINAL 45 MINUTES', target: 85.3, unit: 'M', sub: 'Urban Casualties', desc: ['Up to 10 warheads per city', 'hit major population centers'], col: C.red, bg: '#2B0D10', bar: 0.88 },
    { t0: 12.4, countEnd: 15.6, title: '04 // TOTAL TOLL', win: 'UNDER 5 HOURS', target: 91.5, unit: 'M', sub: '34.1M Dead · 57.4M Injured', desc: ['Immediate casualties only —', 'before global fallout'], col: C.red, bg: '#3B0A0F', bar: 1.0 },
  ];

  phases.forEach((p, i) => {
    const active = t >= p.t0;
    const pop = spring(t, p.t0, 0.55);
    const ck = inOut(pr(t, p.t0 + 0.15, p.countEnd));
    const val = active ? (p.target * ck).toFixed(1) : '0.0';
    const x = 85 + i * 445, y = 215 + (active ? (1 - cl(pop, 0, 1.08)) * 50 : 60);
    const w = 418, h = 665;
    const op = active ? cl(pr(t, p.t0, p.t0 + 0.25)) : 0.22;
    const isTotal = i === 3;

    b += `<g opacity="${op.toFixed(3)}">`;
    b += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${active ? p.bg : '#0C1017'}" stroke="${active ? p.col : C.line}" stroke-width="${isTotal && active ? 4 : 2}"/>`;
    b += `<rect x="${x}" y="${y}" width="${w}" height="8" fill="${active ? p.col : C.line}"/>`;
    b += M(x + 28, y + 52, p.title, { size: 18, fill: active ? p.col : C.dim, ls: 2 });
    b += `<rect x="${x + 28}" y="${y + 72}" width="${w - 56}" height="36" fill="#080B10" stroke="${C.line}" stroke-width="1.5"/>`;
    b += M(x + 42, y + 96, `WINDOW: ${p.win}`, { size: 16, fill: C.text });

    b += SR(x + 28, y + 255, `${val}${p.unit}`, { size: 92, w: 900, fill: isTotal ? C.red : C.text });
    b += T(x + 28, y + 305, p.sub, { size: 23, w: 700, fill: p.col });
    b += `<line x1="${x + 28}" y1="${y + 340}" x2="${x + w - 28}" y2="${y + 340}" stroke="${C.line}" stroke-width="1.5"/>`;
    p.desc.forEach((ln, j) => {
      b += T(x + 28, y + 390 + j * 34, ln, { size: 21, w: 500, fill: C.sub });
    });

    const bf = active ? p.bar * ck : 0;
    b += M(x + 28, y + h - 72, `ESCALATION INTENSITY: ${Math.round(bf * 100)}%`, { size: 15, fill: C.sub });
    b += `<rect x="${x + 28}" y="${y + h - 52}" width="${w - 56}" height="14" fill="#07090D"/>`;
    b += `<rect x="${x + 28}" y="${y + h - 52}" width="${(w - 56) * bf}" height="14" fill="${p.col}"/>`;
    b += `</g>`;
  });

  // Bottom master cumulative casualty bar
  const totK =
    t < 5.5
      ? pr(t, 0.2, 3.2) * (2.6 / 91.5)
      : t < 9.2
      ? (2.6 + pr(t, 5.5, 8.2) * 3.4) / 91.5
      : (6.0 + pr(t, 9.2, 15.0) * 85.5) / 91.5;
  const curCas = Math.round(totK * 91500000).toLocaleString('en-US');
  b += `<rect x="85" y="905" width="1750" height="75" fill="#0C1017" stroke="${C.line}" stroke-width="2"/>`;
  b += `<rect x="85" y="905" width="${1750 * cl(totK)}" height="75" fill="${C.red}" opacity="0.28"/>`;
  b += M(115, 952, `CUMULATIVE SIMULATED CASUALTIES: ${curCas}`, { size: 26, fill: C.text, ls: 2 });
  b += M(1805, 952, 'PRINCETON SGS / NUKEMAP (2019)', { size: 18, fill: C.sub, a: 'end' });

  return baseSvg(b, C.red, t);
}

// ============================================================================
// SCENE 3: ND_PETROV_v1 (20.40s, 430.80–451.20s) — 1983 Soviet Oko CRT Console
// ============================================================================
function petrovFrame(t) {
  const isFalseAlarm = t >= 15.8;
  const isStrike = t >= 3.8 && !isFalseAlarm;
  const mainCol = isFalseAlarm ? C.green : C.red;

  // How many missiles detected so far (1 at 0.8s, then 2, 3, 4, 5 between 3.4s and 5.2s)
  const mTimes = [0.8, 3.4, 3.9, 4.4, 4.9];
  const mCount = mTimes.filter(mt => t >= mt).length;

  let b = `<rect x="90" y="65" width="1740" height="920" rx="26" fill="#050B07" stroke="#1E3F29" stroke-width="4"/>`;
  b += `<rect x="115" y="90" width="1690" height="870" rx="16" fill="#030805" stroke="#285E3A" stroke-width="2"/>`;

  // Left Polar Radar Scope
  const rcx = 515, rcy = 515, rr = 300;
  for (let r = 75; r <= rr; r += 75) {
    b += `<circle cx="${rcx}" cy="${rcy}" r="${r}" fill="none" stroke="#133620" stroke-width="2"/>`;
  }
  b += `<line x1="${rcx - rr}" y1="${rcy}" x2="${rcx + rr}" y2="${rcy}" stroke="#133620" stroke-width="2"/>`;
  b += `<line x1="${rcx}" y1="${rcy - rr}" x2="${rcx}" y2="${rcy + rr}" stroke="#133620" stroke-width="2"/>`;

  // Rotating Radar Sweep Line
  const ang = (t * 1.35) % (Math.PI * 2);
  const sx = rcx + Math.cos(ang) * rr, sy = rcy + Math.sin(ang) * rr;
  b += `<line x1="${rcx}" y1="${rcy}" x2="${sx}" y2="${sy}" stroke="${C.green}" stroke-width="3" opacity="0.75"/>`;

  // 5 Missile Tracks on Polar Scope
  mTimes.forEach((mt, i) => {
    if (t < mt) return;
    const prog = cl((t - mt) / 6.0);
    const tx = rcx - 140 + i * 30, ty = rcy - 165 + (i % 2) * 26;
    const ex = lerp(tx, rcx + 95, prog), ey = lerp(ty, rcy + 90, prog);
    const col = isFalseAlarm ? C.amber : C.red;
    b += `<path d="M${tx},${ty} Q${rcx + 20},${rcy - 60} ${ex},${ey}" fill="none" stroke="${col}" stroke-width="3" stroke-dasharray="8 6"/>`;
    b += `<circle cx="${tx}" cy="${ty}" r="7" fill="${col}"/>`;
    const pulse = ((t - mt) * 2.2) % 1;
    b += `<circle cx="${tx}" cy="${ty}" r="${7 + pulse * 24}" fill="none" stroke="${col}" stroke-width="2" opacity="${1 - pulse}"/>`;
  });
  b += M(rcx, rcy + rr + 42, 'OKO SATELLITE // MOLNIYA ORBIT SECTOR 04', { size: 17, fill: C.green, a: 'middle' });
  b += M(rcx, rcy + rr + 68, `WARHEAD TRACKS LOCKED: 0${mCount} / 05`, { size: 20, fill: isFalseAlarm ? C.amber : C.red, a: 'middle' });

  // Right Command Terminal Readout
  const rx = 900;
  b += M(rx, 155, 'СЕРПУХОВ-15 // SERPUKHOV-15 EARLY-WARNING BUNKER', { size: 22, fill: C.green, ls: 3 });
  b += M(rx, 190, '26 SEPT 1983 · 00:15 MSK · DUTY OFFICER: LT. COL. S. PETROV', { size: 18, fill: '#2D8A56' });

  // Main Flashing Alert Box
  const flash = isFalseAlarm ? 1 : 0.78 + 0.22 * Math.sin(t * 14);
  b += `<g opacity="${flash.toFixed(3)}">`;
  b += `<rect x="${rx}" y="225" width="845" height="195" fill="${isFalseAlarm ? '#072212' : '#2A080C'}" stroke="${mainCol}" stroke-width="3.5"/>`;
  const topAlert = isFalseAlarm
    ? 'ОТБОЙ ТРЕВОГИ // SATELLITE ANOMALY RESOLVED'
    : isStrike
    ? 'ВЫСШАЯ ТРЕВОГА // RELIABILITY: HIGHEST'
    : 'СИГНАЛ ТРЕВОГИ // INITIAL LAUNCH DETECTED';
  const bigAlert = isFalseAlarm ? 'FALSE ALARM' : isStrike ? 'MISSILE STRIKE' : 'LAUNCH · 01';
  b += M(rx + 422, 278, topAlert, { size: 21, fill: isFalseAlarm ? C.green : C.amber, a: 'middle', ls: 4 });
  b += M(rx + 422, 378, bigAlert, { size: 78, fill: mainCol, a: 'middle', ls: 6 });
  b += `</g>`;

  // 5 Individual Missile Track Boxes (1 -> 2 -> 3 -> 4 -> 5)
  for (let i = 0; i < 5; i++) {
    const locked = t >= mTimes[i];
    const bx = rx + i * 172, by = 450, bw = 156, bh = 125;
    const bCol = !locked ? '#1A3826' : isFalseAlarm ? C.amber : C.red;
    b += `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" fill="${locked ? (isFalseAlarm ? '#221807' : '#1E070A') : '#06110A'}" stroke="${bCol}" stroke-width="2.5"/>`;
    b += M(bx + bw / 2, by + 42, `TRACK 0${i + 1}`, { size: 17, fill: locked ? C.amber : '#2D6A44', a: 'middle' });
    b += M(bx + bw / 2, by + 92, locked ? (isFalseAlarm ? 'GLINT' : 'LOCKED') : 'SCAN', { size: 26, fill: bCol, a: 'middle' });
  }

  // Ground Radar & Petrov Hesitation Verification Panel
  const pActive = t >= 8.2;
  b += `<rect x="${rx}" y="605" width="845" height="290" fill="${pActive ? '#071810' : '#050D08'}" stroke="${pActive ? C.green : '#1A3826'}" stroke-width="2.5"/>`;
  b += M(rx + 32, 652, 'GROUND RADAR CROSS-CHECK // HORIZON VERIFICATION', { size: 20, fill: C.green, ls: 2 });
  if (t < 8.2) {
    b += M(rx + 32, 715, 'SOVIET DOCTRINE: REPORT IMMEDIATELY TO GENERAL STAFF', { size: 21, fill: C.amber });
    b += M(rx + 32, 765, 'WINDOW FOR RETALIATORY LAUNCH DECISION: < 10 MINUTES', { size: 19, fill: C.sub });
  } else if (!isFalseAlarm) {
    b += M(rx + 32, 715, 'PETROV ASSESSMENT: US FIRST STRIKE WOULD BE 1,000+ MISSILES, NOT 5', { size: 19, fill: C.text });
    b += M(rx + 32, 765, 'SOVIET GROUND RADAR: 0 CONTACTS DETECTED ON HORIZON', { size: 21, fill: C.amber });
    b += M(rx + 32, 815, 'STATUS: OFFICER HESITATES — HOLDING REPORT', { size: 21, fill: C.green });
  } else {
    b += M(rx + 32, 715, 'CONFIRMED: 0 CONTACTS ON SOVIET GROUND RADAR', { size: 22, fill: C.green });
    b += M(rx + 32, 765, 'CAUSE: SUNLIGHT REFLECTING OFF HIGH-ALTITUDE CLOUDS', { size: 20, fill: C.amber });
    b += M(rx + 32, 815, 'DECISION LOGGED: FALSE ALARM — RETALIATION AVERTED', { size: 21, fill: C.text });
  }

  return baseSvg(b, isFalseAlarm ? C.green : C.red, t);
}

// ============================================================================
// SCENE 4: ND_CLOCK_v1 (13.88s, 456.08–469.96s) — Doomsday Clock Ticking to 85s
// ============================================================================
function clockFrame(t) {
  let b = `<rect x="90" y="65" width="7" height="100" fill="${C.red}"/>`;
  b += M(115, 88, 'BULLETIN OF THE ATOMIC SCIENTISTS // 27 JANUARY 2026', { size: 16, fill: C.red, ls: 3 });
  b += SR(115, 138, '85 Seconds to Midnight', { size: 48, w: 900, fill: C.text });
  b += T(115, 168, 'The closest the Doomsday Clock has ever stood in its 79-year history', { size: 21, w: 500, fill: C.sub });

  // Clock ticks down from 90s to 85s between t=4.5s and t=9.5s (1 tick per second)
  const tickProg = cl((t - 4.5) / 5.0);
  const curSec = Math.round(lerp(90, 85, tickProg));
  const cx = 560, cy = 585, r = 340;

  b += `<circle cx="${cx}" cy="${cy}" r="${r + 24}" fill="none" stroke="${C.line}" stroke-width="1.5" stroke-dasharray="6 6"/>`;
  b += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#0C1017" stroke="#2D3748" stroke-width="5"/>`;

  const am = -(curSec / 3600) * 2 * Math.PI * 5;
  const ah = -(curSec / 43200) * 2 * Math.PI * 5;
  b += `<path d="M ${cx + Math.sin(am) * r} ${cy - Math.cos(am) * r} A ${r} ${r} 0 0 1 ${cx} ${cy - r} L ${cx} ${cy} Z" fill="${C.red}" opacity="0.24"/>`;

  for (let i = 0; i < 60; i++) {
    const a = (i / 60) * 2 * Math.PI;
    const isMaj = i % 5 === 0;
    const l = isMaj ? 42 : 18;
    b += `<line x1="${cx + Math.sin(a) * (r - 14)}" y1="${cy - Math.cos(a) * (r - 14)}" x2="${cx + Math.sin(a) * (r - 14 - l)}" y2="${cy - Math.cos(a) * (r - 14 - l)}" stroke="${i === 0 ? C.red : isMaj ? C.text : '#3A4659'}" stroke-width="${i === 0 ? 8 : isMaj ? 4 : 2}"/>`;
  }
  b += SR(cx, cy - r + 105, 'XII', { size: 46, w: 900, fill: C.red, a: 'middle' });
  b += `<line x1="${cx}" y1="${cy}" x2="${cx + Math.sin(ah) * (r * 0.52)}" y2="${cy - Math.cos(ah) * (r * 0.52)}" stroke="${C.text}" stroke-width="14" stroke-linecap="round"/>`;
  b += `<line x1="${cx}" y1="${cy}" x2="${cx + Math.sin(am) * (r * 0.82)}" y2="${cy - Math.cos(am) * (r * 0.82)}" stroke="${C.red}" stroke-width="8" stroke-linecap="round"/>`;
  b += `<circle cx="${cx}" cy="${cy}" r="18" fill="${C.red}"/><circle cx="${cx}" cy="${cy}" r="8" fill="${C.text}"/>`;

  if (curSec === 85) {
    const p = ((t - 9.5) * 1.2) % 1;
    if (p > 0) b += `<circle cx="${cx}" cy="${cy - r + 20}" r="${12 + p * 90}" fill="none" stroke="${C.red}" stroke-width="3" opacity="${1 - p}"/>`;
  }

  // Digital Countdown Readout under Clock
  b += `<rect x="${cx - 210}" y="${cy + r - 65}" width="420" height="72" fill="${C.redDark}" stroke="${C.red}" stroke-width="2.5"/>`;
  b += M(cx, cy + r - 18, `T-MINUS 00:01:${String(curSec - 60).padStart(2, '0')} (${curSec}s)`, { size: 28, fill: C.text, a: 'middle', ls: 2 });

  // Right Historical Timeline Panel
  const rx = 1020;
  b += `<rect x="${rx}" y="235" width="800" height="700" fill="${C.panel}" stroke="${C.line}" stroke-width="2"/>`;
  b += M(rx + 40, 290, 'HISTORICAL PROXIMITY TO MIDNIGHT', { size: 19, fill: C.amber, ls: 3 });
  const hist = [
    [0.4, '1947', '7 Minutes', 'Post-Hiroshima founding setting', C.sub],
    [1.2, '1953', '2 Minutes', 'US & Soviet H-bomb tests', C.amber],
    [2.0, '1991', '17 Minutes', 'Cold War ends · START treaty', C.blue],
    [3.0, '2023', '90 Seconds', 'Ukraine war & nuclear threats', C.amber],
    [5.0, '2026', '85 Seconds', 'Closest ever recorded (Jan 27, 2026)', C.red],
  ];
  hist.forEach(([t0, yr, tm, d, col], i) => {
    const op = cl(pr(t, t0, t0 + 0.4));
    const hy = 365 + i * 112;
    b += `<g opacity="${op.toFixed(3)}">`;
    if (i === 4) b += `<rect x="${rx + 24}" y="${hy - 42}" width="752" height="92" fill="${C.redDark}" stroke="${C.red}" stroke-width="2"/>`;
    b += SR(rx + 45, hy, yr, { size: 42, w: 900, fill: col });
    b += T(rx + 195, hy - 8, tm, { size: 30, w: 800, fill: C.text });
    b += T(rx + 195, hy + 24, d, { size: 20, w: 500, fill: C.sub });
    b += `</g>`;
  });

  return baseSvg(b, C.red, t);
}

const SCENES = {
  timer: { dur: 3.32, out: '../03_AFTER_EFFECTS/ND_TIMER_v1.mp4', fn: timerFrame },
  plana: { dur: 21.08, out: '../03_AFTER_EFFECTS/ND_PLANA_v1.mp4', fn: planAFrame },
  petrov: { dur: 20.40, out: '../03_AFTER_EFFECTS/ND_PETROV_v1.mp4', fn: petrovFrame },
  clock: { dur: 13.88, out: '../03_AFTER_EFFECTS/ND_CLOCK_v1.mp4', fn: clockFrame },
  minute1: { dur: 61.0, out: '../03_AFTER_EFFECTS/ND_MINUTE1_v1.mp4', fn: minute1Frame },
};

if (!isMainThread) {
  const { sceneKey, frames, tmpDir } = workerData;
  const fn = SCENES[sceneKey].fn;
  for (const f of frames) {
    const svg = fn(f / FPS);
    const png = new Resvg(svg, { font: { fontFiles: FONTFILES, loadSystemFonts: false, defaultFontFamily: 'Montserrat' } }).render().asPng();
    fs.writeFileSync(path.join(tmpDir, `f_${String(f).padStart(5, '0')}.png`), png);
  }
  parentPort.postMessage('done');
} else {
  const targets = process.argv.slice(2);
  const keys = targets.length ? targets : ['timer', 'plana', 'petrov', 'clock', 'minute1'];

  for (const key of keys) {
    const sc = SCENES[key];
    const totalFrames = Math.round(sc.dur * FPS);
    const tmpDir = path.resolve(`./tmp_${key}`);
    fs.rmSync(tmpDir, { recursive: true, force: true });
    fs.mkdirSync(tmpDir, { recursive: true });

    const numWorkers = 10;
    const buckets = Array.from({ length: numWorkers }, () => []);
    for (let f = 0; f < totalFrames; f++) buckets[f % numWorkers].push(f);

    const t0 = Date.now();
    await Promise.all(
      buckets.map(
        frames =>
          new Promise((resolve, reject) => {
            const w = new Worker(new URL(import.meta.url), { workerData: { sceneKey: key, frames, tmpDir } });
            w.on('message', resolve);
            w.on('error', reject);
          })
      )
    );

    const outPath = path.resolve(sc.out);
    execFileSync('ffmpeg', [
      '-y',
      '-framerate', String(FPS),
      '-i', path.join(tmpDir, 'f_%05d.png'),
      '-c:v', 'libx264',
      '-pix_fmt', 'yuv420p',
      '-crf', '16',
      '-preset', 'fast',
      outPath,
    ], { stdio: 'ignore' });

    fs.rmSync(tmpDir, { recursive: true, force: true });
    console.log(`Rendered ${key} (${totalFrames} frames) -> ${outPath} in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  }
}
