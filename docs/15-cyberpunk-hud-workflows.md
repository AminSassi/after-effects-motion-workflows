# 15 — Cyberpunk HUD & FUI Motion Systems 🤖⚡

Architectural mechanics, procedural radial reticles, telemetry data streams, optical chromatic aberration, and ExtendScript generators for futuristic Sci-Fi Interfaces and Cyberpunk HUDs in Adobe After Effects.

---

## 1. Visual Anatomy of the Cyberpunk HUD Style

Cyberpunk and Fantasy User Interfaces (FUI) rely on dense, functional visual complexity layered over high-contrast negative space:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        THE CYBERPUNK HUD MATRIX                        │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Deep Void Canvas         │ Carbon void base (#05070D / #0A0E17).    │
│ 2. 60.0 FPS Master Canvas   │ Essential for high-frequency scanlines.  │
│ 3. Electric Dual Accents    │ Electric Cyan (#00F0FF) & Amber (#FFB300)│
│ 4. Concentric Geometry      │ Nested radial dials, crosshairs & ticks. │
│ 5. Telemetry & Data Streams │ Hexadecimal offsets & coordinate tickers.│
│ 6. Optical Post-Grade       │ Unmult glow, chromatic split & scanlines.│
└────────────────────────────────────────────────────────────────────────┘
```

### Color Palette & Visual Rules:
- **Base Canvas**: Ultra-dark tinted navy `#05070D` (avoids pure flat black `#000000` to allow subtle ambient glow falloff).
- **Primary HUD Stroke**: Electric Cyan `#00F0FF` (1–2 px stroke weight; never thick chunky outlines).
- **Warning / Alert Accent**: Cyberpunk Amber/Gold `#FFB300` or Hot Magenta `#FF007F`.
- **Secondary Telemetry / Coordinates**: Muted Ice Blue `#5C7C99` at `40% – 60%` opacity.
- **Rule of Scale**: 70% of UI elements must be micro-scale (micro-dashes, coordinate pairs, degree ticks, bracket frames) to create an illusion of massive technological sophistication.

---

## 2. Procedural Radial Reticle Construction

A professional HUD reticle is built from concentric shape layer paths with alternating rotational directions and dash patterns.

### The Concentric Ring Stack:
1. **Outer Bracket Ring**:
   - Ellipse Path (Radius: `450 px`, Stroke: `1.5 px`, Cyan `#00F0FF`).
   - Add **Trim Paths**:
     - End: `25%`
     - Offset: Rotated by `45°` so brackets frame the 4 quadrants.
2. **Precision Degree Ring**:
   - Ellipse Path (Radius: `420 px`, Stroke: `1.0 px`, White `#FFFFFF`).
   - In Stroke settings, open `Dashes`:
     - Dash: `2 px`
     - Gap: `12 px`
     - Offset Expression: `time * 15` (slow continuous clockwise crawl).
3. **Inner Segmented Dial**:
   - Ellipse Path (Radius: `360 px`, Stroke: `4.0 px`, Amber `#FFB300`).
   - In Stroke settings:
     - Dash: `60 px`
     - Gap: `30 px`
     - Offset Expression: `time * -25` (counter-clockwise opposing motion).
4. **Targeting Crosshair (Center Anchor)**:
   - 4-point crosshair lines with a center hollow circle (Radius `18 px`).
   - Position tracking parented to target coordinate null.

---

## 3. Dynamic Telemetry & Coordinate Tickers

Rather than static numbers, live telemetry data gives HUDs organic computational life.

### Telemetry Expression Architecture:
Apply this expression to the `Source Text` property of a text layer (using monospace fonts like `Share Tech Mono`, `JetBrains Mono`, or `Consolas`):

```javascript
// Dynamic Cyberpunk Telemetry Stream
var rate = 18; // updates 18 times per second
var t = Math.floor(time * rate);
seedRandom(t, true);

var hexChars = "0123456789ABCDEF";
var blockA = "";
var blockB = "";

for (var i = 0; i < 4; i++) {
    blockA += hexChars[Math.floor(random(0, 16))];
    blockB += hexChars[Math.floor(random(0, 16))];
}

var lat = (34.0522 + random(-0.008, 0.008)).toFixed(4);
var lon = (-118.2437 + random(-0.008, 0.008)).toFixed(4);
var alt = Math.floor(1240 + random(-25, 45));

"SYS_LOC: " + lat + "°N " + lon + "°W\n" +
"SEC_HEX: [" + blockA + " : " + blockB + "]\n" +
"ALT_MTR: " + alt + "m // LOCK_ACQ";
```

See [expressions/hud_telemetry_counter.js](file:///C:/Users/PC/.gemini/antigravity/scratch/after-effects-motion-workflows/expressions/hud_telemetry_counter.js) for the standalone production expression.

---

## 4. Optical CRT & Hologram Post-Processing Stack

To transform sterile vector lines into an authentic optical holographic HUD display:

1. **Layer 1: Glow / Holographic Bleed (Adjustment Layer)**:
   - Add `ADBE Glo2` (Deep Glow or native Glow):
     - Glow Threshold: `75%`
     - Glow Radius: `25 px`
     - Glow Intensity: `0.8`
   - Add duplicate Glow for wide ambient haze:
     - Glow Radius: `150 px`
     - Glow Intensity: `0.35`
2. **Layer 2: CRT Scanline Raster (Solid with Venetian Blinds)**:
   - Create a Solid layer, set blend mode to `Overlay` or `Soft Light` (Opacity: `15%`).
   - Apply `ADBE Venetian Blinds`:
     - Transition Completion: `20%`
     - Direction: `90°` (Horizontal lines)
     - Width: `4 px`
     - Feather: `1 px`
3. **Layer 3: Chromatic Aberration & Lens Distortion (Adjustment Layer)**:
   - Apply `ADBE Optics Compensation`:
     - Field of View: `18.0`
     - Reverse Lens Distortion: **Checked** (adds subtle edge bowing).
   - Apply RGB Shift (or 3-layer channel separation: Red, Green, Blue shifted by $\pm 2$ px horizontally at edges).

---

## 5. Procedural ExtendScript Generator

Run the automated rig generator to build a complete ready-to-animate Cyberpunk HUD composition with a single click:

`scripts/create_cyberpunk_hud_rig.jsx`

```javascript
// Generates:
// 1. BG_Void solid (#05070D)
// 2. HUD_MASTER_NULL controller
// 3. 4-ring concentric shape layer with opposing rotations and dashed metrics
// 4. Center Crosshairs with pulsating reticle
// 5. Monospace Live Telemetry Text Layer driven by procedural expressions
// 6. Hologram Grade adjustment layer with dual-stage glow and scanline raster
```
