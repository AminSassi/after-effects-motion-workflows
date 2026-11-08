# 24 — Drawn Documentary Motion & The lib3d Engine 🗺️🎬

A comprehensive guide on elevating investigative documentary motion design above generic templates and "AI slop" by using bespoke 2.5D drawn cutaways, perspective 3D cameras, and the memory-safe headless `lib3d` rendering engine.

---

## 1. Escaping the "AI Slop" Trap in Documentary Motion

Audience fatigue is real. Viewers immediately spot and disengage from repetitive template patterns:
- ❌ **Tilted neon text boxes** and floating cards with arbitrary 15° angles.
- ❌ **Fake "cyberpunk" HUD stamps** (`VERIFIED`, `ALERT`, fake reticles) placed over static maps with no explanatory value.
- ❌ **Stock satellite photos** overlaid with generic pulsing circles.
- ❌ **Generic motion templates** where every point is presented as a floating card.

### The Golden Rule: Explanatory Drawn Illustrations in Motion
Every key explanatory beat must be a **custom, purpose-drawn visual explanation** (inspired by prestige editorial journalism: *Vox*, *Johnny Harris*, *Bellingcat*, *Le Monde*):
1. **Show the actual physical geometry**: If discussing an underground facility buried beneath 300 feet of granite, don't just show a map pin—draw the cross-section of the mountain, display the depth ruler, show the 30-story ghost building for human scale comparison, and illustrate the GBU-57 bomb penetrating 60 meters before stopping short of the granite cap.
2. **True 3-Tone Shading**: Give objects volume through top highlight, mid tone, and deep shadow rather than artificial outer glows or heavy drop shadows.
3. **Restrained Typography**: Text should serve purely as precision measurement labels, verified quotes, and understated headlines (using high-legibility Grotesk fonts like Inter with exact OpenType metrics).

---

## 2. The `lib3d` Headless Motion Engine

For complex 9-to-15 minute geopolitical documentaries where After Effects Dynamic Link becomes slow or unstable across hundreds of scenes, the `lib3d` engine provides a headless, deterministic, code-driven 3D animation environment using Node.js, `@resvg/resvg-js`, and `ffmpeg-static`.

### Key Engine Components:

```
06_TOOLS/
├── lib3d.mjs          # Core perspective camera, transforms, geometry, shading & map projection
├── render.mjs         # Multi-process memory-safe frame renderer & Level 4.1 H.264 encoder
├── fonts/             # Inter (Black, Bold, Medium, Regular) & DejaVuSansMono
├── models/            # 3D GLB models (e.g. mobile mockups, aircraft) projected into vector space
└── photos/            # Verified archival prints, leader portraits & flags
```

### 1. Perspective 3D Camera (`Cam`)
The camera supports continuous keyframed camera moves (orbit, azimuth, elevation, distance, and focal target) with smooth spring or cubic easing:
```javascript
const cam = new Cam({
  fov: 45,
  dist: 800,
  orbit: [-15, 25], // Azimuth, Elevation in degrees
  target: [0, 0, 0]
});
```

### 2. Depth-Sorted Polygonal 3-Tone Shading
All 3D shapes (cubes, cylinders, cutaways, dominoes, terrain blocks) project their vertices through the perspective matrix, calculate face normal dot-products with an overhead key light, and sort polygons from back-to-front before rendering:
```javascript
// Face normal shading:
const intensity = Math.max(0.2, dot(normal, lightDirection));
const fill = shadeColor(baseHex, intensity);
```

### 3. GIS Vector Projection (Natural Earth 110m / 50m)
Country borders and coastlines from Natural Earth TopoJSON are converted directly to 3D world coordinates (1 unit = 1° lon/lat) and rendered onto extruded terrestrial plates with automatic antimeridian unwrapping to prevent tearing across Russia and Alaska.

### 4. 3D GLB Model Integration
Mobile phones, reconnaissance drones, and aircraft can be loaded as `.glb` wireframes/meshes and projected seamlessly alongside flat typography and vector geometry.

---

## 3. Memory-Safe Chunked Multi-Process Rendering

Node.js processes running heavy SVG DOM construction and `@resvg` rendering will suffer from V8 heap fragmentation and OOM crashes if rendering thousands of frames in a single process.

### The Chunking Protocol:
- Divide the total scene frames into small chunks of **$\le 100$ frames**.
- Spawn isolated worker child processes (`--max-old-space-size=3072`).
- Checkpoint completed frames to disk (`frames_<tag>/f_%05d.png`).
- On script failure or cancellation, previously rendered chunks remain intact; re-running immediately resumes from the missing frame range.

```javascript
// Render chunks in parallel without heap bloat:
const chunks = [];
for (let a = F0; a < F1; a += 100) {
  chunks.push([a, Math.min(F1, a + 100)]);
}
```

---

## 4. Premiere Pro 1080p Vector Motion Caption Alignment

When converting sequence resolutions (e.g. from 720p or 4K to 1080p), word-by-word captions nested inside sub-sequences often drift vertically off-screen if scaled around their layer center.

### The Caption Anchor Rule:
To keep captions perfectly locked to their intended baseline above the lower third:
- Set **Vector Motion Anchor Point** to: `(0.5, 0.939)`
- Set **Vector Motion Position** to: `(0.5, 0.939)` (normalized coordinates)
- Apply uniform scale: `150%` (for 720p $\to$ 1080p)

Because the anchor point matches the position on the caption baseline, scaling the graphic expands the text upward into the safe zone without shifting the lower margin.
