# 14 — The 15 Motion Design Styles: Architecture & AE Translation Matrix 🌐✨

A production-grade translation bridge mapping the **15 code-generated motion design styles** from [Vincentwei1021/mg-styles-15](https://github.com/Vincentwei1021/mg-styles-15) directly into **Adobe After Effects layer stacks, ExtendScript rigs, native effect pipelines, and prompt schemas**.

---

## 1. Executive Summary & Paradigm Shift

`mg-styles-15` demonstrated that any distinct motion design style can be synthesized purely through algorithmic rules, mathematical easing, and procedural shaders. 

In this repository, we translate those code-native parameters into **After Effects native equivalents**:
- WebGL vertex/fragment shaders ➔ **AE Compound Effects & Adjustment Layers** (CC Glass, Displacement Maps, Roughen Edges, Turbulent Displace).
- JavaScript `requestAnimationFrame` render loops ➔ **Native AE Expressions** (`wiggle`, `valueAtTime`, dampened harmonic springs).
- Programmatic Canvas/SVG draw calls ➔ **Procedural Shape Layer paths & ExtendScript JSX generators**.
- Web Audio API procedural synthesis ➔ **Tactile SFX frequency palettes & cue sheet alignment**.

---

## 2. The 15 Motion Styles Master Matrix

| # | Style Name | Target FPS | Visual DNA & Framing | Primary AE Native Effect Stack | Color Palette Key | SFX Audio Signature |
| :- | :--- | :- | :--- | :--- | :--- | :--- |
| **01** | **Cel Animation / Line Boil** | `12.0` | Hand-drawn wobble, textured ink edges, organic timing | `Posterize Time(12)` + `Roughen Edges` + `Turbulent Displace` | Gouache, parchment, rich black `#1A1A1A` | Paper shuffle, scratchy pencil, dry tap |
| **02** | **Isometric (2.5D)** | `60.0` | True axonometric perspective, architectural precision | `SSR Rig (Scale 86.6%, Skew ±30°, Rot ±30°)` or Ortho Camera | Slate, mint `#00F0FF`, deep navy `#0B132B` | Hydraulic hiss, pneumatic click, cube clack |
| **03** | **Flat Vector** | `60.0` | Clean geometry, bold contrast, minimal gradients, zero bevels | Shape Layers + `Trim Paths` + `Inertial Spring Expression` | Bold primaries: `#FF5722`, `#2196F3`, `#4CAF50` | Pop, soft wood tap, airy whoosh |
| **04** | **Line Art (Monoline)** | `60.0` | Single-stroke weight vector drawings, self-drawing paths | `Trim Paths` (Start/End offset) + `Add Round Corners` | Monochromatic ink `#111111` on bone white `#F8F9FA` | Pencil stroke, rapid marker squeak |
| **05** | **3D Render & Depth** | `60.0` | Volumetric lighting, metallic reflections, physical depth | Cinema 4D / Advanced 3D Engine + `Depth of Field` + `CC Light Sweep` | Metallic chrome, deep graphite, hyper-gold | Heavy thud, sub-bass drop, servo whine |
| **06** | **Shape Morph (Apple)** | `60.0` | Decoupled rounded rectangles, continuous fluid continuity | Decoupled Rect Path `Size` + `Master Spring Expression` | Apple White `#FFFFFF`, Clean Gray `#F5F5F7`, Action Blue | Tactile haptic tap, glass click, soft pop |
| **07** | **Sticker Explainer** | `30.0` | Die-cut white border strokes, peel-off curl, drop shadow | `Layer Styles (Stroke: White 12px)` + `CC Page Turn` + `Drop Shadow` | Pastel punch: Canary `#FFE600`, Coral `#FF5E57` | Vinyl peel, tape stick, playful boing |
| **08** | **Cyberpunk HUD / FUI** | `60.0` | Sci-Fi telemetry, holographic reticles, data streams | `Radial Shape Dashes` + `Linear Wipe` + `Glow` + `Colorama` | Cyan `#00F0FF`, Amber `#FFB300`, Void `#05070D` | Digital telemetry chirp, glitch blip, static |
| **09** | **Collage & Parallax (Vox)** | `15.0` | Archival cutouts, torn paper edges, multiplane 3D camera | `L.A.R.P. 3D Camera Rig` + `Posterize Time(15)` + `CC Cylinder` | Sepia, newspaper newsprint, desaturated archival | Heavy typewriter, 35mm projector click |
| **10** | **Aurora & Glassmorphism** | `60.0` | Frosted glass refraction, diffuse chromatic gradients | `Fast Box Blur` + `CC Glass` + `Turbulent Noise (Smooth)` | Ethereal violet `#8A2BE2`, turquoise `#00FFA3` | Ambient shimmer, crystalline chime, breath |
| **11** | **Geometric Bauhaus** | `30.0` | Asymmetric balance, primary shapes (circle, triangle, rect) | Shape Layers + Decoupled Keyframes + Strict Modular Grids | Bauhaus Red `#D72638`, Ochre `#F5B700`, Blue `#1B4994` | Staccato wood block, geometric snap |
| **12** | **80s Synthwave (Retro)** | `30.0` | Wireframe horizons, neon magenta grid, VHS scanline tracking | `Grid` + `3D Plane Tilt` + `Wave Warp` + `Bad TV / Scanline` | Neon Magenta `#FF007F`, Electric Purple `#9B00E8` | Analog synth chord, tape reel start, snare |
| **13** | **Pixel Art & Stream** | `15.0 / 30.0` | Quantized block pixels, crisp edges, zero antialiasing | `Mosaic` (e.g. 120x68) + `Find Edges` + `Minimax` | 8-bit / 16-bit PICO-8 or GameBoy palette | 8-bit coin pickup, bitcrush bleep, square-wave |
| **14** | **Liquid Motion & Metaball** | `30.0` | Viscous fluid droplets, organic surface tension merge | `Fast Box Blur (40px)` + `Levels (Alpha Min/Max clipping)` | Molten orange `#FF6B35`, Slime `#00F5D4` | Wet squish, water drop plink, suction snap |
| **15** | **Variety Captions (Show Edit)** | `60.0` | Punchy anime/variety show subtitle stickers, impact zooms | `Text Animators (Scale overshoot)` + `Wiggle(3, 10)` + `Glow` | Comic Yellow `#FFEA00`, Bold Red, White stroke | Impact slam, cartoon whistle, laugh-track ding |

---

## 3. Translation Blueprint: From Code to After Effects

### Paradigm 1: Shader-Based Blurring & Thresholding (Liquid Metaballs)
In web code (Canvas/WebGL):
```javascript
// WebGL Fragment Shader: Clamping smoothstep on alpha distance field
float dist = length(uv - center);
float alpha = smoothstep(radius - 0.05, radius + 0.05, dist);
```
In After Effects native pipeline:
1. Place multiple shape layers or circles on the timeline.
2. Add an **Adjustment Layer** over all fluid elements.
3. Apply `ADBE Gaussian Blur 2` or `ADBE Fast Blur` (Blurriness: `40 px`).
4. Apply `ADBE Levels2` (Channel: `Alpha`):
   - **Input Black (Alpha)**: `125`
   - **Input White (Alpha)**: `135`
5. *Result*: The blurred overlapping gradient tails collapse into a razor-sharp, dynamic viscous fluid neck when droplets approach each other!

---

### Paradigm 2: Algorithmic Noise & Line Boil
In web code (p5.js / Three.js):
```javascript
// Procedural line jitter
let noiseVal = noise(x * 0.05, y * 0.05, frameCount * 0.2);
vertex(x + noiseVal * 4.0, y + noiseVal * 4.0);
```
In After Effects native pipeline:
1. Apply `ADBE Posterize Time` to the layer (Set `Frame Rate = 12.0`).
2. Apply `ADBE Roughen Edges`:
   - Edge Type: `Roughen Color` or `Roughen`
   - Border: `3 - 6 px`
   - Scale: `40 px`
   - Evolution: `wiggle(6, 180)`
3. Apply `ADBE Turbulent Displace`:
   - Amount: `4`
   - Size: `15`
   - Evolution: `wiggle(6, 360)`
4. *Result*: Perfect authentic cel animation jitter without manual frame drawing!

---

### Paradigm 3: 2.5D Isometric Math vs. SSR Projection
In web code (Three.js OrthographicCamera):
```javascript
camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 1, 1000);
camera.position.set(200, 200, 200);
camera.lookAt(0, 0, 0);
```
In After Effects native pipeline (The SSR Transformation Formula):
- **Top Face**:
  - `Scale`: `[100, 86.602]` %
  - `Skew`: `+30°` (Skew Axis: `0°`)
  - `Rotation`: `-30°`
- **Left Face**:
  - `Scale`: `[100, 86.602]` %
  - `Skew`: `-30°` (Skew Axis: `0°`)
  - `Rotation`: `-30°`
- **Right Face**:
  - `Scale`: `[100, 86.602]` %
  - `Skew`: `+30°` (Skew Axis: `0°`)
  - `Rotation`: `+30°`

---

## 4. AI Prompt Architecture for After Effects Synthesis

To instruct LLMs (Claude, Gemini, GPT) or autonomous MCP agents to assemble scenes matching any of the 15 styles in After Effects, use the following standardized prompt schema:

```markdown
SYSTEM INSTRUCTION: You are an autonomous Motion Director building an Adobe After Effects project via ExtendScript/MCP.

STYLE SPECIFICATION:
- Style ID: [Insert Style # from Matrix, e.g. Style 08 Cyberpunk HUD]
- Master Frame Rate: [e.g. 60.0 fps]
- Aspect Ratio: [1080x1920 9:16 Vertical Reel | 1920x1080 16:9]
- Anchor Palette: Primary [Hex], Secondary [Hex], Base [Hex]

STRUCTURAL COMPOSITION RULES:
1. Hierarchy: Center Subject Controller Null -> Nested Child Shape Layers -> Secondary HUD Elements.
2. Timing & Easing: Apply [Spring Bounce | ValueAtTime Offset | Linear Telemetry Ticker].
3. Native Effect Stack: Apply [Exact AE ADBE effect match names].
4. SFX Sync Points: Place cue markers on frames [F12, F24, F38] with matching audio frequency profile.
```

---

## 5. Cross-Reference Navigation

- **Cyberpunk HUD Playbook**: [docs/15-cyberpunk-hud-workflows.md](15-cyberpunk-hud-workflows.md)
- **Liquid Motion & Metaball Playbook**: [docs/16-liquid-motion-and-metaballs.md](16-liquid-motion-and-metaballs.md)
- **Isometric 2.5D Rigging Playbook**: [docs/17-isometric-2-5d-motion-rigging.md](17-isometric-2-5d-motion-rigging.md)
- **Cel Animation & Line Boil Playbook**: [docs/18-cel-animation-line-boil.md](18-cel-animation-line-boil.md)
- **Apple-Style Morphing**: [docs/08-apple-style-motion-graphics.md](08-apple-style-motion-graphics.md)
- **Vox/Documentary Parallax**: [docs/09-documentary-motion-and-3d-parallax.md](09-documentary-motion-and-3d-parallax.md)
- **Kinetic Pixel Workflow**: [docs/10-kinetic-pixel-style-workflow.md](10-kinetic-pixel-style-workflow.md)
