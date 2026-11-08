// Generates a 48kHz 16-bit stereo synchronized documentary SFX track:
// C:\Users\PC\Desktop\NUCLEAR_DOMINO\02_ASSETS\ND_SFX_master.wav (548.08s)
import fs from "node:fs";
import path from "node:path";

const SR = 48000;
const DURATION = 548.08;
const TOTAL_FRAMES = Math.ceil(SR * DURATION);

const left = new Float32Array(TOTAL_FRAMES);
const right = new Float32Array(TOTAL_FRAMES);

// Deterministic PRNG for clean, repeatable noise textures
let seed = 0x9e3779b9;
function rand() {
  seed ^= seed << 13;
  seed ^= seed >>> 17;
  seed ^= seed << 5;
  return ((seed >>> 0) / 4294967296) * 2 - 1;
}

function addSample(frame, l, r = l) {
  if (frame >= 0 && frame < TOTAL_FRAMES) {
    left[frame] += l;
    right[frame] += r;
  }
}

// 1. Deep cinematic sub-bass impact + stereo air whoosh (for Chapter Titles & Act breaks)
function addChapterBoom(timeSec, gain = 0.24) {
  const start = Math.floor((timeSec - 0.18) * SR);
  const len = Math.floor(2.2 * SR);
  let lpL = 0, lpR = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    // Pre-whoosh (0..0.18s) peaking right at cut (t = 0.18s)
    const rel = t - 0.18;
    let whooshEnv = 0;
    if (rel < 0) {
      whooshEnv = Math.pow((t / 0.18), 2.2) * 0.45;
    } else {
      whooshEnv = Math.exp(-rel * 5.5) * 0.45;
    }
    const cutoff = rel < 0 ? 0.04 + 0.18 * (t / 0.18) : 0.22 * Math.exp(-rel * 3.0);
    lpL += cutoff * (rand() - lpL);
    lpR += cutoff * (rand() - lpR);

    // Sub-bass drop starting at rel >= 0 (82 Hz -> 34 Hz exponential pitch drop)
    let sub = 0;
    if (rel >= 0) {
      const freq = 34 + 48 * Math.exp(-rel * 6.5);
      const phase = 2 * Math.PI * (34 * rel + (48 / 6.5) * (1 - Math.exp(-rel * 6.5)));
      const subEnv = Math.min(1, rel / 0.012) * Math.exp(-rel * 2.1);
      const transient = Math.exp(-rel * 45) * 0.35 * Math.sin(2 * Math.PI * 140 * rel);
      sub = (Math.sin(phase) * 0.85 + transient) * subEnv;
    }

    const outL = (sub + lpL * whooshEnv) * gain;
    const outR = (sub + lpR * whooshEnv) * gain;
    addSample(start + i, outL, outR);
  }
}

// 2. Soft editorial paper / mechanical shutter transition (for Quote cards & Data graphics)
function addDossierSnap(timeSec, gain = 0.14) {
  const start = Math.floor(timeSec * SR);
  const len = Math.floor(0.28 * SR);
  let bpL = 0, bpR = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    // Double mechanical micro-click + warm low thump
    const click1 = Math.exp(-t * 140) * Math.sin(2 * Math.PI * 920 * t);
    const click2 = t > 0.028 ? Math.exp(-(t - 0.028) * 160) * Math.sin(2 * Math.PI * 1380 * (t - 0.028)) * 0.7 : 0;
    const body = Math.exp(-t * 28) * Math.sin(2 * Math.PI * 110 * t) * 0.55;
    bpL += 0.18 * (rand() - bpL);
    bpR += 0.18 * (rand() - bpR);
    const paper = Math.exp(-t * 22) * Math.min(1, t / 0.008) * 0.35;
    addSample(start + i, (click1 + click2 + body + bpL * paper) * gain, (click1 + click2 + body + bpR * paper) * gain);
  }
}

// 3. Tactical radar / sonar ping (for Maps M01..M10)
function addRadarPing(timeSec, freq = 1320, gain = 0.11, pan = 0) {
  const start = Math.floor(timeSec * SR);
  const len = Math.floor(1.15 * SR);
  const gainL = gain * Math.cos(((pan + 1) * Math.PI) / 4);
  const gainR = gain * Math.sin(((pan + 1) * Math.PI) / 4);
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const env = Math.min(1, t / 0.004) * Math.exp(-t * 4.2);
    const harmonic = Math.exp(-t * 14) * 0.25 * Math.sin(2 * Math.PI * freq * 2 * t);
    const sig = (Math.sin(2 * Math.PI * freq * t) + harmonic) * env;
    addSample(start + i, sig * gainL, sig * gainR);
  }
}

// 4. Precision quartz / mechanical tick (for timelines, missile timer, Plan A counters)
function addTick(timeSec, freq = 2200, gain = 0.09, pan = 0) {
  const start = Math.floor(timeSec * SR);
  const len = Math.floor(0.045 * SR);
  const gainL = gain * Math.cos(((pan + 1) * Math.PI) / 4);
  const gainR = gain * Math.sin(((pan + 1) * Math.PI) / 4);
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const env = Math.exp(-t * 180);
    const sig = (Math.sin(2 * Math.PI * freq * t) * 0.75 + rand() * 0.25) * env;
    addSample(start + i, sig * gainL, sig * gainR);
  }
}

// 5. Heavy mechanical clock escapement tick-tock (for Doomsday Clock 456.08-469.96s)
function addClockEscapement(timeSec, isTock = false, gain = 0.16) {
  const start = Math.floor(timeSec * SR);
  const len = Math.floor(0.16 * SR);
  const f1 = isTock ? 680 : 820;
  const f2 = isTock ? 1940 : 2320;
  const pan = isTock ? 0.18 : -0.18;
  const gainL = gain * Math.cos(((pan + 1) * Math.PI) / 4);
  const gainR = gain * Math.sin(((pan + 1) * Math.PI) / 4);
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const primary = Math.exp(-t * 95) * Math.sin(2 * Math.PI * f1 * t);
    const metal = Math.exp(-t * 160) * Math.sin(2 * Math.PI * f2 * t) * 0.6;
    const subClick = t > 0.018 ? Math.exp(-(t - 0.018) * 130) * Math.sin(2 * Math.PI * (f1 * 1.4) * (t - 0.018)) * 0.45 : 0;
    const sig = primary + metal + subClick;
    addSample(start + i, sig * gainL, sig * gainR);
  }
}

// 6. Soviet 1983 Oko CRT terminal warning beep (for Petrov 430.80-451.20s)
function addSovietTerminalBeep(timeSec, freq = 980, dur = 0.18, gain = 0.12) {
  const start = Math.floor(timeSec * SR);
  const len = Math.floor(dur * SR);
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const env = Math.min(1, t / 0.006) * Math.min(1, (dur - t) / 0.015);
    // Slightly saturated square-ish CRT piezo tone (fundamental + 3rd harmonic)
    const wave = Math.sin(2 * Math.PI * freq * t) * 0.8 + Math.sin(2 * Math.PI * freq * 3 * t) * 0.18;
    addSample(start + i, wave * env * gain, wave * env * gain);
  }
}

// ============================================================================
// POPULATE TIMELINE CUES (Synced to 25fps Premiere Sequence)
// ============================================================================

// Cold Open & Minute 1 internal act transitions
addChapterBoom(3.72, 0.22);   // Cold Open start
addDossierSnap(6.20, 0.12);   // X post card lock-in
addChapterBoom(14.72, 0.18);  // Act II: Nagasaki 1945 archival reveal
addRadarPing(20.90, 1280, 0.12, -0.15); // Pickaxe Mountain crosshair lock
addRadarPing(22.40, 1280, 0.09, 0.15);
addDossierSnap(27.72, 0.14);  // Act III: 60% -> 90% enrichment cascade
for (let k = 0; k < 5; k++) {
  addTick(28.40 + k * 0.45, 1850 + k * 140, 0.07, (k - 2) * 0.15);
}

// All 9 Chapter Titles (T01 - T09)
const chapterTimes = [
  48.35,  // T01: THE NUCLEAR DOMINO
  117.00, // T02: ACT I - HOW WE GOT HERE
  212.92, // T03: ACT II - THE TABOO
  255.16, // T04: ACT III - THE DOMINOES
  290.44, // T05: DOCTRINE CHANGE
  325.60, // T06: TAIWAN STRAIT
  363.16, // T07: ACT IV - THE MECHANISM
  420.36, // T08: STANISLAV PETROV
  492.64, // T09: ACT V - WHAT THIS MEANS
];
for (const t of chapterTimes) {
  addChapterBoom(t, 0.24);
}

// Quote Dossiers & Data Graphics
const dossierTimes = [
  64.72,  // Q01 Carlson post
  72.80,  // L01 Lower third
  82.52,  // Q02 Trump Truth Social
  94.68,  // G05 Timeline 2025-2026
  158.92, // G01 Centrifuge cascade
  166.96, // Q03 Grossi quote
  176.28, // G02 Uranium stockpile
  192.48, // G08 Pickaxe mountain diagram
  201.36, // G09 Bunker buster comparison
  226.44, // Q04 Tannenwald quote
  239.00, // G06 81-year taboo timeline
  257.32, // Q01 reprise
  292.60, // G10 Russia threshold
  475.16, // G12 New START expired
  504.88, // Q01 closing reprise
];
for (const t of dossierTimes) {
  addDossierSnap(t, 0.13);
}

// Subtle node ticks across G05 (94.68s) and G06 (239.00s) timelines
for (let i = 0; i < 6; i++) {
  addTick(95.10 + i * 0.65, 2100 + i * 80, 0.065, -0.3 + i * 0.12);
}
for (let i = 0; i < 7; i++) {
  addTick(239.50 + i * 1.40, 1950 + i * 60, 0.06, -0.35 + i * 0.11);
}

// Strategic Maps (M01 - M10)
const mapCues = [
  [100.32, 1340], // M01 Hormuz
  [112.84, 1340], // M01 Hormuz reprise
  [155.16, 1420], // M02 Iran sites
  [183.72, 1420], // M02 Iran sites
  [269.80, 1260], // M03 Israel Dimona
  [283.52, 1180], // M04 Russia domino
  [311.32, 1240], // M05 Pakistan/India
  [334.84, 1300], // M06 China/Taiwan
  [348.56, 1360], // M07 North Korea
  [357.20, 1120], // M08 All 9 nuclear states
  [403.44, 1220], // M09 NATO
  [482.56, 1120], // M08 All 9 states reprise
  [519.12, 1280], // M10 Three paths
];
for (const [t, freq] of mapCues) {
  addRadarPing(t + 0.08, freq, 0.11, -0.12);
  addRadarPing(t + 1.45, freq * 1.25, 0.065, 0.18);
}

// Archival Photo subtle shutter swells
const photoTimes = [105.20, 108.16, 123.88, 127.16, 148.76, 214.68, 278.00, 327.48, 374.64, 397.88, 497.04, 501.52, 527.96];
for (const t of photoTimes) {
  addDossierSnap(t, 0.08);
}

// SCENE 1: ND_TIMER_v1 (308.00 - 311.32s) -> Rapid 300s launch decision countdown
addDossierSnap(308.00, 0.15);
for (let t = 308.08; t < 311.25; t += 0.20) {
  const progress = (t - 308.00) / 3.32;
  addTick(t, 2400 + progress * 600, 0.085, Math.sin(progress * Math.PI * 4) * 0.25);
}

// SCENE 2: ND_PLANA_v1 (376.80 - 397.88s) -> Princeton Plan A escalation pulses & casualty counter ticks
addChapterBoom(376.80, 0.19);
// Phase I, II, III lock snaps
addRadarPing(377.40, 1080, 0.10, -0.2);
addRadarPing(383.80, 960, 0.11, 0.0);
addRadarPing(390.40, 840, 0.13, 0.2);
// Rapid telemetry counter ticks as casualties climb to 91.5M
for (let t = 378.0; t < 396.2; t += 0.32) {
  addTick(t, 1750 + ((t - 378) * 35), 0.055, ((Math.floor(t * 3) % 3) - 1) * 0.2);
}

// SCENE 3: ND_PETROV_v1 (430.80 - 451.20s) -> 1983 Soviet Oko satellite warning screen
// Synced to the exact detection times in render_scenes.mjs:
// Detections at t = 0.8s, 3.4s, 3.9s, 4.4s, 4.9s relative to 430.80s
const petrovBase = 430.80;
addDossierSnap(petrovBase, 0.14);
addSovietTerminalBeep(petrovBase + 0.80, 1046.5, 0.22, 0.13); // Missile 1 (C6)
addSovietTerminalBeep(petrovBase + 3.40, 1046.5, 0.16, 0.13); // Missile 2
addSovietTerminalBeep(petrovBase + 3.90, 1174.7, 0.16, 0.14); // Missile 3 (D6)
addSovietTerminalBeep(petrovBase + 4.40, 1318.5, 0.16, 0.15); // Missile 4 (E6)
addSovietTerminalBeep(petrovBase + 4.90, 1568.0, 0.26, 0.16); // Missile 5 (G6 - FULL LAUNCH LOCK)
// Urgent double warning pulse after 5/5 lock
addSovietTerminalBeep(petrovBase + 5.45, 1568.0, 0.14, 0.12);
addSovietTerminalBeep(petrovBase + 5.70, 1568.0, 0.14, 0.12);
// Stand-down / false alarm resolution at 430.80 + 15.80 = 446.60s
addRadarPing(petrovBase + 15.80, 660, 0.12, 0);

// SCENE 4: ND_CLOCK_v1 (456.08 - 469.96s) -> Bulletin Doomsday Clock 85 Seconds to Midnight
addChapterBoom(456.08, 0.20);
let tickIdx = 0;
for (let t = 456.48; t < 469.60; t += 0.85) {
  addClockEscapement(t, tickIdx % 2 === 1, 0.15);
  tickIdx++;
}
// Heavy lock chime at 456.08 + 5.0 = 461.08s when the hand locks at 85 SECONDS
addChapterBoom(461.08, 0.22);
addRadarPing(461.08, 528, 0.14, 0);

// Final Nagasaki reflection & fade to black (527.96 - 548.08s)
addChapterBoom(527.96, 0.18);

// ============================================================================
// WRITE 48kHz 16-BIT STEREO PCM WAV
// ============================================================================
const outPath = path.resolve("C:/Users/PC/Desktop/NUCLEAR_DOMINO/02_ASSETS/ND_SFX_master.wav");
const dataBytes = TOTAL_FRAMES * 4; // 2 channels * 2 bytes
const buf = Buffer.allocUnsafe(44 + dataBytes);

buf.write("RIFF", 0);
buf.writeUInt32LE(36 + dataBytes, 4);
buf.write("WAVE", 8);
buf.write("fmt ", 12);
buf.writeUInt32LE(16, 16);      // PCM chunk size
buf.writeUInt16LE(1, 20);       // PCM format = 1
buf.writeUInt16LE(2, 22);       // 2 channels (stereo)
buf.writeUInt32LE(SR, 24);      // 48000 Hz
buf.writeUInt32LE(SR * 4, 28);  // byte rate
buf.writeUInt16LE(4, 32);       // block align
buf.writeUInt16LE(16, 34);      // bits per sample
buf.write("data", 36);
buf.writeUInt32LE(dataBytes, 40);

let offset = 44;
for (let i = 0; i < TOTAL_FRAMES; i++) {
  const l = Math.max(-0.95, Math.min(0.95, left[i]));
  const r = Math.max(-0.95, Math.min(0.95, right[i]));
  buf.writeInt16LE(Math.round(l * 32767), offset);
  buf.writeInt16LE(Math.round(r * 32767), offset + 2);
  offset += 4;
}

fs.writeFileSync(outPath, buf);
console.log(`Wrote ${outPath} (${(buf.length / 1024 / 1024).toFixed(1)} MB, ${DURATION}s @ ${SR}Hz stereo)`);
