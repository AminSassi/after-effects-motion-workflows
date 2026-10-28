# 16 — Liquid Motion & Metaball Fluid Systems 💧✨

The mathematical mechanics, alpha-choke threshold pipelines, viscoelastic surface tension physics, and ExtendScript generators for organic fluid motion graphics in Adobe After Effects.

---

## 1. Visual Anatomy & The Physics Illusion

Liquid motion in 2D vector animation is characterized by **viscosity, merging drops, and dynamic surface tension snap**:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        THE LIQUID MOTION MATRIX                        │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Fluid Coalescence        │ Merging when proximity threshold crosses │
│ 2. Surface Tension Necking  │ Viscous bridge stretches before snapping │
│ 3. Elastic Droplet Rebound  │ Asymmetric squash-and-stretch upon snap  │
│ 4. Saturated Viscous Palette│ Vibrant glossy tones with dark accents   │
│ 5. Alpha-Threshold Choke    │ Compound Fast Blur + Levels clipping     │
│ 6. Wet Haptic Sound Design  │ Low-pass water plops, squishes & pops    │
└────────────────────────────────────────────────────────────────────────┘
```

### Color Palette Recommendations:
- **Molten Orange**: `#FF5E36` base, `#FFA940` highlight, `#D9381E` shadow.
- **Cyber Slime**: `#00F5D4` base, `#7B2CBF` contrast dark backdrop.
- **Electric Lavender**: `#7209B7` base, `#4CC9F0` droplets.

---

## 2. The Core Pipeline: Alpha-Choke Thresholding

The most reliable, GPU-accelerated method to create real-time fluid metaballs in After Effects without third-party plugins is the **Alpha Blur-and-Choke** technique.

### The Setup Architecture:
```
[ Top: Grade Adjustment Layer ] ➔ Fast Blur (45px) + Levels (Alpha Min 125, Max 135)
  ├── [ Shape Layer: Droplet_01 ] (Position animated with Spring Bounce)
  ├── [ Shape Layer: Droplet_02 ] (Moving across Droplet_01 path)
  └── [ Shape Layer: Hero_Vessel ] (Central reservoir shape)
[ Bottom: Background Solid ]
```

### Step-by-Step Instructions:
1. In a pre-composition (or master comp), create 2 or more shape layers containing standard circular vector paths (Fills: Solid color).
2. Animate the positions of the circles so they pass close to one another or overlap.
3. Above all fluid shape layers, create an **Adjustment Layer** named `LIQUID_ALPHA_CHOKE`.
4. Apply `ADBE Fast Blur` (or `ADBE Gaussian Blur 2`):
   - Blurriness: `40 px – 60 px`
   - Repeat Edge Pixels: **Checked**
5. Apply `ADBE Levels2`:
   - Change `Channel` from `RGB` to **`Alpha`**.
   - Set **Input Black (Alpha)**: `125` (or `0.49` normalized).
   - Set **Input White (Alpha)**: `135` (or `0.53` normalized).
6. **The Result**: As the blurred alpha halos touch, the clipped threshold creates an organic bridging neck (metaball fusion) that organically snaps when separated.

---

## 3. Viscoelastic Surface Tension & Squash-and-Stretch

When a liquid droplet detaches from a fluid mass, it undergoes rapid **asymmetric harmonic oscillation** (squashing horizontally when stretching vertically) before settling into a sphere.

### The Mathematical Formula:
$$\text{Scale}_X(t) = 100 \times \left(1 + A \cdot e^{-\gamma t} \cos(\omega t)\right)$$
$$\text{Scale}_Y(t) = 100 \times \left(1 - A \cdot e^{-\gamma t} \cos(\omega t)\right)$$

Notice the inverse sign on $\text{Scale}_Y$: volume conservation dictates that when a droplet widens horizontally, it must contract vertically.

See [expressions/liquid_surface_tension.js](file:///C:/Users/PC/.gemini/antigravity/scratch/after-effects-motion-workflows/expressions/liquid_surface_tension.js) for the complete expression.

---

## 4. Glossy Specular & Volume Highlights

To give flat liquid 3D jelly volume:

1. Duplicate the `LIQUID_ALPHA_CHOKE` pre-composition.
2. Inside the duplicate, offset the shapes by `[-8, -8]` pixels.
3. On the top duplicate layer in the master timeline:
   - Apply `ADBE Tint` (Map White to Pure White `#FFFFFF`).
   - Set Layer Blend Mode to `Screen` or `Overlay` with `40%` opacity.
   - Use `CC Glass` (Light Height: `40`, Softness: `8`) to add refractive rim reflections.

---

## 5. Procedural ExtendScript Generator

Generate a complete, ready-to-animate Liquid Metaball environment with:

`scripts/create_liquid_metaball_rig.jsx`

```javascript
// Automatically configures:
// 1. Dark high-contrast background (#0B0D17)
// 2. Automated Alpha Choke Adjustment Layer with Fast Blur & Alpha Levels
// 3. Two interactive liquid droplets with pre-rigged surface tension expressions
// 4. Center molten reservoir puddle
```
