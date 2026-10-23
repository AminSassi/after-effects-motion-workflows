# 07 — Advanced Editorial Motion Techniques 🎨⚡

High-impact motion design patterns, procedural distortion rigs, tactile paper physics, kinetic typography reveals, and CRT screen texturing. Sourced and distilled from masterclass motion editing breakdowns.

---

## 1. Organic Exposure Strobe & Filmic Flicker 💡

A lightning-fast (15-second setup) procedural lighting flicker that introduces organic tension, shutter flutter, or impact anticipation without manual keyframing.

### Step-by-Step Rig:
1. Create a new **Adjustment Layer** (`Ctrl + Alt + Y` / `Cmd + Option + Y`) and place it on top of the scene or cut. Rename it to `FX_Exposure_Flicker`.
2. Add the **Exposure** effect (`Effects > Color Correction > Exposure`).
3. Alt-click (Option-click on macOS) the stopwatch on the **Exposure** property (Master Exposure).
4. Enter the expression:
   ```javascript
   // frequency: 10 times per second, amplitude: +/- 0.3 EV
   wiggle(10, 0.3);
   ```

### Parameter Tuning:
- **`frequency` (First argument)**: Controls strobe speed.
  - `8 - 12`: Natural projector flicker or tension hook.
  - `18 - 24`: Rapid strobe / electric short-circuit.
  - `2 - 4`: Slow organic ambient light breathing.
- **`amplitude` (Second argument)**: Controls flicker intensity.
  - `0.15 - 0.35`: Subtle filmic flicker (does not blow out whites).
  - `0.6 - 1.2`: High-contrast strobe for musical drop transitions.

### Ideal SFX Pairings:
- Low electric hum / ballast buzz (`-20dB`).
- Film projector mechanical whir or shutter clicks.

---

## 2. Two-Tone Kinetic Color Reveal Text Animator ✍️🔥

Reveals typography dynamically with a trailing or leading accent color as each character or word enters the frame. Replaces generic slide-ins with high-end editorial flair.

### Step-by-Step Rig:
1. Create a Text Layer (e.g. *"HIGH IMPACT EDITING"*). Center the anchor point using `sourceRectAtTime()`.
2. Twirl open the text layer, click **Animate ▶** and add:
   - **Position**: Set Y to `+180` to `+220 px` (starts below).
   - **Opacity**: Click **Add ▶ Property ▶ Opacity**, set to `0%`.
   - **Fill Color (RGB)**: Click **Add ▶ Property ▶ Fill Color ▶ RGB**, pick your dynamic accent color (e.g. Neon Emerald `#00FF88`, Electric Red `#FF3366`, or Brand Purple `#8B5CF6`).
3. Twirl open **Range Selector 1 > Advanced**:
   - **Shape**: Change from `Square` to **`Ramp Up`**. *(Crucial: this creates a smooth, continuous wave rather than a stepped jump).*
   - **Ease Low**: Set to **`85% - 100%`** for snappy deceleration.
   - **Ease High**: Set to **`20% - 35%`**.
   - **Based On**: Choose **`Characters`** for energetic rhythm or **`Words`** for punchy documentary delivery.
4. Animate the **Offset**:
   - Frame 0: Set `Offset` to **`-100%`** (Add Keyframe).
   - Frame 25–35 (at 60fps): Set `Offset` to **`100%`**.
5. Enable Motion Blur on the text layer.

### Visual Result:
Characters rise from below, illuminating vividly in your accent color during their entry phase before settling into clean, crisp white typography.

---

## 3. Shockwave Refraction & Specular Glass Ring 💥🔮

An expanding physical shockwave that actually bends and refracts pixels underneath, crowned with dynamic specular lighting reflections.

```
┌─────────────────────────────────────────────────────────────────┐
│ Adjustment Layer: "FX_Shockwave"                                │
│   - Displacement Map (Map: Circle_Gray_Precomp, Channels: Red) │
│   - CC Glass (Bump Map: Circle_Gray_Precomp, Specular: High)   │
└────────────────────────────────┬────────────────────────────────┘
                                 │ Refracts
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ Hidden Precomp: "Circle_Gray_Precomp"                           │
│   ├── Circle Shape (White stroke 130px, Size: 0 -> 2400px, Blur)│
│   └── 50% Gray Base Solid (#808080 = Zero Displacement Point)   │
└─────────────────────────────────────────────────────────────────┘
```

### The Secret: The 50% Neutral Gray Rule
In After Effects' `Displacement Map`, **50% Gray (`#808080` / RGB 128, 128, 128) produces zero displacement**. White pushes pixels in one direction, while black pulls them in the opposite direction.

### Step-by-Step Rig:
1. **Create the Displacement Precomp**:
   - Create a 50% Gray Solid (`#808080`), name it `Gray_Base_50%`.
   - Create a Shape Layer with an Ellipse:
     - **Fill**: Disabled (`None`).
     - **Stroke**: White (`#FFFFFF`), Width: `120 - 150 px`.
     - Keyframe **Size**: `0 px` at start to `2200+ px` over 15 to 20 frames.
     - Add **Fast Box Blur** (Radius: `25 - 40`) to feather the inner and outer stroke contours.
   - Select both layers, precompose them (`Ctrl + Shift + C`), name it `MAP_Shockwave_Precomp`, and hide its visibility (`eye` icon off).
2. **Apply the Refraction & Glass Effects**:
   - Create a new Adjustment Layer above your footage or UI cards named `FX_Shockwave`.
   - Add **Displacement Map**:
     - `Displacement Map Layer`: `MAP_Shockwave_Precomp` (set source to *Effects & Masks*).
     - `Use For Horizontal / Vertical`: Set to `Luminance` or `Red`.
     - `Max Horizontal / Vertical Displacement`: `30 to 60 px`.
   - Add **CC Glass**:
     - `Surface > Bump Map`: `MAP_Shockwave_Precomp`.
     - `Surface > Softness`: `12.0`.
     - `Surface > Height`: `25.0`.
     - `Shading > Specular`: Bump up to `80 - 100` for a sharp, glistening glass crest.

### Ideal SFX Pairings:
- Sub-bass boom impact (`Soft bass boom`) + fast whip whoosh (`Fast swoosh 1`).

---

## 4. Tactile Paper Peel / Page Curl & Jitter (Ars Active 5 Style) 📄✨

The viral tactile paper aesthetic: a document or UI card whose corner organically curls and flutters with physical weight, matched drop shadows, and stop-motion playback.

### Step-by-Step Rig:
1. **The Peeling Paper**:
   - Place a paper or document asset with a transparent background.
   - Apply **CC Page Turn** (`Effects > Distort > CC Page Turn`):
     - `Controls`: Bottom Right Corner (or top right).
     - `Fold Radius`: `80 - 110`.
     - Alt-click **Fold Position** stopwatch and apply:
       ```javascript
       wiggle(5, 180);
       ```
2. **Synchronized Dynamic Shadow**:
   - Duplicate the paper layer and place it directly beneath the original. Rename to `Paper_Shadow`.
   - Delete CC Page Turn from the shadow layer.
   - Apply **Fill** (`Effects > Generate > Fill`) and set color to **Black** (`#000000`).
   - Apply **Fast Box Blur** (Radius: `30 - 45`) for realistic ambient diffusion.
   - Apply **Bezier Warp**:
     - Alt-click the vertex corresponding to the folding corner (e.g. `Bottom Right Vertex`).
     - Apply the **exact same wiggle expression**:
       ```javascript
       wiggle(5, 180);
       ```
     - Squeeze the inner bezier handles inward so the shadow hugs the paper fold tightly.
     - Set layer Opacity to `40% - 50%`.
3. **Compound Movement**:
   - Precompose the paper + shadow into `Rig_Paper_Card`.
   - Set the Anchor Point to the opposite stationary corner/edge.
   - Add organic rotation flutter:
     ```javascript
     wiggle(2, 1.5);
     ```
4. **Stop-Motion Frame Treatment**:
   - Add an Adjustment Layer with **Posterize Time** set to **`12 fps`** or **`17 fps`**.
   - This removes digital 60fps smoothness and delivers authentic paper stop-motion texture.

### Ideal SFX Pairings:
- `Paper rustle 1` & `Fast paper rustle 2` aligned with peak curl frames.

---

## 5. Micro-Dot CRT Television Texture Matrix 📺🔬

A procedural dot-matrix overlay that eliminates flat digital rendering, adds depth, and mimics high-end broadcast display tubes.

### Step-by-Step Rig:
1. Create a top-level Adjustment Layer named `FX_CRT_Micro_Grid`.
2. Set layer Blend Mode to **`Overlay`** (or `Soft Light`).
3. Apply the **Grid** effect (`Effects > Generate > Grid`):
   - **Size From**: Change from *Corner Point* to **`Width Slider`**.
   - **Width**: Set to **`6.0`**.
   - **Border**: Set to **`6.2`** (creates fine rectangular micro-cells).
   - **Feather**: Set Horizontal to **`1.0`**, Vertical to **`1.0`**.
   - **Invert Grid**: **Checked (`true`)** *(reverses grid to black aperture dots)*.
   - **Color**: Pure Black (`#000000`).
4. Set the Adjustment Layer Opacity to **`35% - 50%`**.

### Optional Enhancements:
- Stack a subtle chromatic aberration (RGB split via `Shift Channels` or lens distortion) at `0.8 - 1.2 px`.
- Add filmic monochromatic grain (`Noise` at `2%`).
