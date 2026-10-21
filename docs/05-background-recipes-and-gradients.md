# 05 — Background Recipes & Animated Gradients 🌈✨

The visual backdrop sets the emotional temperature and production polish of the entire reel. A static solid or harsh gradient looks amateur; dynamic, organic lighting elevates UI mockups to high-end SaaS product teasers.

---

## 1. The User's Animated Gradient Overlay Recipe

A fast, lightweight, purely procedural technique for luscious liquid gradient backgrounds directly inside After Effects without third-party plugins:

### Step-by-Step Recipe:

1. **Base Solid**:
   - Create a new Solid layer (`1080 x 1920`), set to a rich dark base color (e.g., `#0d0f18` or `#0a0a0c`).
2. **Circle Emitters**:
   - Create a shape layer with a clean circular path (hold `Shift` for a 1:1 symmetrical circle, size approx `500 x 500 px` to `800 x 800 px`).
   - In `Transform > Position`, Option-click (or Alt-click on Windows) the stopwatch and enter the expression:
     ```javascript
     wiggle(1, 50);
     ```
     *(This creates an organic, smooth floating motion: 1 cycle per second, 50 pixels displacement amplitude).*
3. **Palette Duplication**:
   - Duplicate the circle layer **4 to 6 times**.
   - Distribute the circles across different quadrants of the canvas (top-left, center, bottom-right, mid-left).
   - Assign complementary brand colors to each circle:
     - Circle 1: Deep Indigo / Violet (`#4F46E5` / `#6366F1`)
     - Circle 2: Electric Purple / Magenta (`#9333EA` / `#A855F7`)
     - Circle 3: Vibrant Cyan / Teal (`#06B6D4` / `#0EA5E9`)
     - Circle 4: Warm Coral / Amber accent (`#F43F5E` / `#FB923C`)
4. **The Magic Adjustment Layer**:
   - Create an **Adjustment Layer** above all circle layers.
   - Add **Gaussian Blur**:
     - `Blurriness`: `600`
     - `Dimensions`: `Horizontal and Vertical`
     - `Repeat Edge Pixels`: **Checked (`true`)** *(Prevents black edges)*
   - Add **Glow**:
     - `Glow Threshold`: `15% - 25%`
     - `Glow Radius`: `300 - 600`
     - `Glow Intensity`: `1.5 - 2.5` (or `600` depending on effect scaling mode)
   - Add **Noise** (Optional but highly recommended):
     - `Amount of Noise`: `2.5% - 5.0%`
     - `Use Color Noise`: **Unchecked (`false`)**
     - *(Noise dithers 8-bit banding and gives a high-end filmic texture).*

---

## 2. Radiant Wave Ribbon Background (`Radiant BACKGROUND.aep`)

For complex fluid waves and undulating light rays:
1. **Asset Source**: Incorporate procedural ribbon pre-comps (e.g. from `Radiant BACKGROUND.aep`) utilizing `Wave Warp`, `Turbulent Displace`, and multi-color gradient ramps.
2. **Blending Mode & Color Harmonization**:
   - Place the Radiant Ribbon pre-comp above the base dark solid.
   - Set the blend mode to **`Screen`** or **`Add`**.
   - Adjust `Hue/Saturation` or apply `Colorama` / `Tritone` to match the brand color scheme:
     - Highlights: Ice White (`#FFFFFF`)
     - Midtones: Electric Violet (`#8B5CF6`)
     - Shadows: Deep Midnight Navy (`#030712`)
3. **Handling Element Backgrounds**:
   - Ensure vector icons and logos do not carry opaque black rectangle backgrounds (`#000000`).
   - If importing raster logos with black backgrounds, set the layer blend mode to **`Screen`** or run `Extract / Unmult` to preserve transparency.
