# 17 — Isometric 2.5D Motion Rigging & Projection Systems 📐✨

Architectural standards, the Scale-Skew-Rotate (SSR) mathematical proof, true 3D axonometric camera rigs, elevation bounce physics, and ExtendScript generators for isometric 2.5D motion design in Adobe After Effects.

---

## 1. Visual Anatomy & Axonometric Geometry

Isometric motion design represents 3D objects on a 2D plane without perspective vanishing points (parallel lines never converge):

```
┌────────────────────────────────────────────────────────────────────────┐
│                       THE ISOMETRIC 2.5D MATRIX                        │
├────────────────────────────────────────────────────────────────────────┤
│ 1. True 120° Angle Symmetry │ Equal visual weight across 3 planes.     │
│ 2. 60.0 FPS Master Canvas   │ Silky mechanical & architectural sliding.│
│ 3. 3-Tone Shading Model     │ Top (Highlight), Left (Mid), Right (Dark)│
│ 4. Vertical Z-Axis Elevation│ Elevating blocks off ground plane.       │
│ 5. SSR Transformation Math  │ 86.602% vertical scale + ±30° shear/rot. │
│ 6. Mechanical Haptic Audio  │ Pneumatic hiss, cube clack, slide clicks.│
└────────────────────────────────────────────────────────────────────────┘
```

### The 3-Tone Shading Model:
Because isometric art has no true 3D raytraced lighting, visual depth is created by strict tonal values:
- **Top Face (Sky/Light Source)**: $100\%$ Base Color (e.g., `#00E5FF` Cyan or `#FFFFFF`).
- **Left Face (Ambient Fill)**: $80\% - 85\%$ Base Color (e.g., `#00B4D8`).
- **Right Face (Cast Shadow)**: $60\% - 70\%$ Base Color (e.g., `#0077B6`).

---

## 2. The Mathematical Proof of SSR (Scale, Skew, Rotate)

The classic 2D vector method for generating distortion-free isometric planes without enabling 3D layers is the **SSR method**:

### Why $86.602\%$?
An isometric cube projected onto a 2D plane compresses along the vertical axis by $\cos(30^\circ)$:
$$\cos(30^\circ) = \frac{\sqrt{3}}{2} \approx 0.8660254 \implies 86.602\%$$

### The Exact Transformation Parameters:

| Plane Face | Scale $[X, Y]$ | Skew Angle | Skew Axis | Rotation |
| :--- | :--- | :--- | :--- | :--- |
| **Top Face** | `[100%, 86.602%]` | `+30.0°` | `0.0°` | `-30.0°` |
| **Left Face** | `[100%, 86.602%]` | `-30.0°` | `0.0°` | `-30.0°` |
| **Right Face** | `[100%, 86.602%]` | `+30.0°` | `0.0°` | `+30.0°` |

---

## 3. Method 2: The True 3D Axonometric Camera Rig

If you prefer building in native 3D space with 3D Shape Layers:

1. Create a **Two-Node Camera** in After Effects:
   - Type: `Two-Node Camera`
   - Focal Length: `135 mm` or `200 mm` (telephoto to flatten perspective).
2. Set Camera Transform Angles:
   - **X Rotation (Tilt)**: `35.264°` ($\arcsin(\tan(30^\circ))$)
   - **Y Rotation (Pan)**: `45.0°`
   - **Z Rotation**: `0.0°`
3. Push Camera Position far back on the Z-axis ($Z = -10,000$) and increase Zoom ($10,000$) to eliminate all perspective distortion and achieve true orthographic projection!

---

## 4. Vertical Z-Axis Elevation & Drop Shadow

To animate blocks elevating, floating, or clicking into place:

1. Parent all 3 faces (`Top`, `Left`, `Right`) to an `ISOMETRIC_BLOCK_CTRL` 2D Null.
2. Under the cube, create an **Isometric Shadow Layer** on the floor (Top Face geometry tinted to `#0A0E1A` with `40%` opacity).
3. When the cube elevates along the vertical Y-axis:
   - Cube Null moves up: `Y = Y - 120 px`.
   - Shadow layer stays pinned to the floor, but its `Scale` decreases slightly (`100% ➔ 80%`) and `Opacity` decreases (`40% ➔ 20%`).
4. Apply the [`master_spring_bounce.js`](file:///C:/Users/PC/.gemini/antigravity/scratch/after-effects-motion-workflows/expressions/master_spring_bounce.js) expression to the cube's vertical position so it lands with a crisp, physical click!

---

## 5. Procedural ExtendScript Generator

Build a complete 3-sided isometric cube with pre-calculated SSR transformations and elevation null controller in one click:

`scripts/create_isometric_cube_rig.jsx`

```javascript
// Automatically configures:
// 1. Soft isometric studio backdrop (#0F172A)
// 2. ISOMETRIC_CUBE_CTRL master parent null
// 3. Top Face with 86.602% scale, +30° skew, -30° rotation
// 4. Left Face with 86.602% scale, -30° skew, -30° rotation (shaded)
// 5. Right Face with 86.602% scale, +30° skew, +30° rotation (dark shaded)
// 6. Dynamic ground contact shadow linked to cube elevation
```
