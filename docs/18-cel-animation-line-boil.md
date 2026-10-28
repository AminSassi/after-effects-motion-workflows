# 18 — Cel Animation & Line Boil Simulation ✏️📄

The procedural alchemy, frame decimation mechanics, organic edge roughening, and ExtendScript generators for authentic 12fps/8fps hand-drawn cel animation in Adobe After Effects.

---

## 1. Visual Anatomy & The Hand-Drawn Illusion

Traditional cel animation feels alive because no two hand-drawn frames are ever mathematically identical. The microscopic imperfections in paper tooth, ink flow, and wrist tremors produce a rhythmic flutter known as **Line Boil**:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        THE CEL & LINE BOIL MATRIX                      │
├────────────────────────────────────────────────────────────────────────┤
│ 1. 12.0 / 8.0 FPS Decimation│ "On Twos" (12fps) or "On Threes" (8fps)  │
│ 2. Edge Micro-Displacement  │ Procedural roughening with noise seed    │
│ 3. Interior Fill Boil       │ Subtle turbulent drift across flat fills │
│ 4. Hard Edge Dropped Shadow │ Offset 100% opacity hard shadow block    │
│ 5. Paper Grain Absorption   │ Multiply paper texture overlay (#F4EEDD) │
│ 6. Scratchy Tactile Audio   │ Pencil friction, dry marker squeak, page │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. The 4-Stage Procedural Line Boil Pipeline

To give vector shape layers or clean typography the exact look of an artist tracing frames on a light table:

### Stage 1: Frame Rate Decimation (`Posterize Time`)
Hand-drawn animation is drawn "on twos" (12 distinct drawings per second on a 24fps master) or "on threes" (8 fps).
- Apply `ADBE Posterize Time`:
  - **Frame Rate**: `12.0` (or `8.0` for rough sketchbook style).
  - *Rule*: Place this effect at the **very top** or **very bottom** of the layer's effect stack so all noise evolutions update strictly at 12 fps.

### Stage 2: Edge Contour Roughening (`Roughen Edges`)
- Apply `ADBE Roughen Edges`:
  - Edge Type: `Roughen Color` or `Roughen`
  - Border: `3.0 px – 5.0 px`
  - Edge Sharpness: `0.7`
  - Fractal Scale: `30 px – 50 px`
  - **Evolution Expression**:
    ```javascript
    // Evolution jumps randomly every frame at 12fps
    posterizeTime(12);
    random(0, 1000);
    ```

### Stage 3: Low-Frequency Vector Wobble (`Turbulent Displace`)
While `Roughen Edges` provides high-frequency ink grain, `Turbulent Displace` simulates the artist's hand tracing variance across larger curves:
- Apply `ADBE Turbulent Displace`:
  - Displacement: `Turbulent`
  - Amount: `3.0 – 6.0` (subtle; heavy amounts warp geometry unrecognizably)
  - Size: `20 px – 35 px`
  - **Evolution Expression**:
    ```javascript
    posterizeTime(12);
    time * 360;
    ```

### Stage 4: Tactile Paper Composite
- Place an authentic textured paper scan (or procedural noise solid) at the top of the timeline.
- Set its Blend Mode to **`Multiply`** or **`Color Burn`** at `25% – 35%` opacity.

---

## 3. The One-Click ExtendScript Applicator

Select any vector, text, or pre-comp layer and run:

`scripts/apply_cel_line_boil.jsx`

This script instantly binds:
1. `Posterize Time` locked to 12.0 fps.
2. `Roughen Edges` with 12fps randomized evolution.
3. `Turbulent Displace` with synchronized phase drift.
4. Clean reset parameters to prevent distortion blowout.
