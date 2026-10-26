# 10 — Kinetic Pixel Style Workflow (PR & AE) 👾✨

A complete masterclass workflow for achieving the minimal, high-contrast, cinematic "Pixel Style" that makes modern tech and motion design videos look expensive and studio-crafted.

---

## 1. Visual Anatomy of the Style

1. **Clean Subject Dominance**:
   - The subject (hero typography, UI card, or product interface) is immediately identifiable.
   - Secondary animations and decorative graphics **only support** the primary subject, never clutter it.
2. **Deep Contrast & Vibrant Saturation**:
   - Shadows are deep and true black; highlights are luminous.
   - Saturated colors are pushed cleanly without looking washed out.
3. **Photographic Leading Lines**:
   - Animations function like leading lines in photography.
   - One motion event directly triggers and guides the eye into the next event (e.g. Hero Word pops → Glow spikes → Pixel streams shoot along vectors → UI cards stagger into place).
4. **The Anchor Color Rule**:
   - The single bold accent color chosen for the hero keyword (e.g. Electric Red `#FF3333`, Acid Lime `#A3E635`, or Cyan `#00F0FF`) **must be the exact same hex code** used for the kinetic pixel trails and UI highlights. This anchors the frame into one cohesive visual identity.

---

## 2. Text & Composition Setup

### Font & Hierarchy:
- **Font**: Clean geometric sans-serif (e.g., `Inter`, `Interim`, or `Cabinet Grotesk` — clean Apple/Linear aesthetic).
- **Triangular Composition**:
  - **Top / Eyebrow**: Small, tracked-out uppercase category label (e.g., `HOW TO ANIMATE`).
  - **Middle / Anchor**: Giant, oversized Hero Keyword in bold/black weight with accent color.
  - **Bottom / Sub-phrase**: Medium weight, slightly smaller text balancing the composition.

### Kinetic Animation Recipes:
- **By-Word Drop Entrance**:
  - Animate text by **Word** (not individual characters or full lines).
  - Position: Starts offset vertically (Y: -40 to -80 px) and drops into position.
  - Opacity: 0% → 100%.
  - Motion Blur: Active.
- **Value-Graph Scale Bounce (Hero Keyword)**:
  - Do not use simple ease for the hero word; craft an **overshoot bounce** in the **Value Graph**:
    - Keyframe 1 (0 frames): Scale `0%`
    - Keyframe 2 (8–10 frames): Scale `115%` (overshoot)
    - Keyframe 3 (14 frames): Scale `96%` (undershoot)
    - Keyframe 4 (18–20 frames): Scale `100%` (settle)
  - Result: Punchy, tactile snap.
- **Hero Glow Pulse**:
  - Add `Deep Glow` (or native `ADBE Glo2`).
  - Animate Exposure / Intensity: Keyframe 0 at `0`, spikes to `1.5 – 2.0` exactly when the hero word scales to maximum overshoot, then quickly decays back to `0.2` subtle ambient glow.

---

## 3. UI Cards with Continuous Rasterization & Beveled Glow Edges

When creating floating video or screenshot cards:
1. **Card Base**: Rounded rectangle shape layer (`Video_Base_Shape`) with generous corner radius (`40–60 px`).
2. **Track Matte Pre-Comp**:
   - In a dedicated pre-comp, duplicate the shape layer below the footage.
   - Set the video/screenshot layer track matte to the shape layer (`Alpha Matte`).
3. **Internal Edge Bevel**:
   - Add an Adjustment Layer inside the pre-comp above the background shape.
   - Apply `ADBE Gaussian Blur 2` (Blurriness: `20–30 px`, Repeat Edge Pixels checked).
4. **Continuous Rasterization**:
   - In the master scene, toggle the **Continuous Rasterize / Collapse Transformations** button (`*`) on the pre-comp layer to keep vector edges razor-sharp at any scale.
5. **Card Entrance Transitions**:
   - Scale: `0% → 100%` with smooth speed-graph ease (`F9`, speed peak pulled to ~80%).
   - Blur + Exposure flash: Add `Gaussian Blur` (starts at `25 px`, decays to `0`) and `Exposure` (starts at `+2.0`, decays to `0.0`) so the card flashes and snaps into focus.

---

## 4. The Kinetic Pixel Stream Recipe 👾

The signature effect of the style: glowing digital pixel trails that zip across the screen along dynamic paths behind foreground UI cards.

### Layer Stack & Recipe:
1. **Draw Paths**:
   - Select the **Pen Tool** (`G`) with no layers selected.
   - Set Fill to `None`.
   - Set Stroke to `Solid Color`, width `8–14 px` (matching the hero accent color).
   - Draw dynamic leading lines (horizontal dashes, 45-degree angle turns, or smooth bezier arcs) wrapping around cards.
2. **Trim Paths**:
   - Add `Trim Paths` to the shape layer.
   - Keyframe **End**: `0% → 100%` over 12–16 frames.
   - Keyframe **Start**: Starts moving 4 frames after End from `0% → 100%`.
   - Easing: Easy-Ease (`F9`) and pull speed handles to front-load the velocity.
3. **The Pixelizer Stack (The Magic Step)**:
   - Apply **Turbulent Displace** (`ADBE Turbulent Displace`):
     - Amount: `15–30`
     - Size: `10–20`
     - Gives the path subtle organic scattering and broken segments.
   - Apply **Mosaic** (`ADBE Mosaic`):
     - Horizontal Blocks: `100–160` (adjust based on comp width)
     - Vertical Blocks: `60–100`
     - Sharp Colors: `Checked`
     - Instantly quantizes the smooth stroked path into crisp, retro-futuristic digital pixels.
4. **Depth Layering**:
   - Always place the Pixel Stream layers **behind** the foreground UI cards and text, but **above** the ambient background.
   - Duplicate the pixel shape layer (`Ctrl+D`), reposition or mirror paths in both directions.

---

## 5. Master Camera Framing (2D Master Null Push)

1. Create a Master Controller Null (`Master_2D_Null`).
2. Parent all active scene layers (text, cards, pixel streams) to this Null.
3. Animate `Position` and `Scale`:
   - Start zoomed tight on the primary focal point (e.g. `Scale: 140%`).
   - Zoom out to `Scale: 100%` over 24 frames.
   - **Speed Graph**: Front-loaded explosive zoom at frame 0, easing out into a slow, continuous micro-drift (`100% → 102%`) throughout the scene duration.
4. **Feathered Edge Mask (No Cutoff Borders)**:
   - When pulling back from extreme zooms, background edges may reveal the comp boundary.
   - Add a solid matching the background, double-click the Rectangle tool to add a layer-sized mask, decrease `Mask Expansion` slightly, and set `Mask Feather` to `80–120 px` for seamless ambient falloff.

---

## 6. Sound Design Rule: "Every Move Gets a Sound"

Visually complete edits feel hollow without tactile sound design:
- **Master Zoom-Out / Camera Transition**: Low-end airy whoosh / riser (`SFX_Cool_Whoosh` or `SFX_Whoosh_Airy`).
- **Word / Text Pop**: Mechanical keyboard clack or crisp pop (`SFX_UI_Click_Designed_Pop` or `SFX_Keyboard_Enter`).
- **Hero Accent Glow Spike**: Laser sweep or soft tonal confirmation (`SFX_Laser_Sweep`).
- **Card Entrance**: Crisp UI plastic thud (`SFX_UI_Click_Plastic`).
- **Pixel Stream Zip**: Fast subtle data chirp / data glitch (`SFX_Data_05` / `SFX_Data_06`).
