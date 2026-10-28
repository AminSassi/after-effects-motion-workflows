# After Effects Motion Design Workflows 🎬✨

Production-grade motion design workflows, After Effects automation patterns, ExtendScript recipes, sound design architectures, and 9:16 vertical video guidelines crafted by [Amin Sassi](https://github.com/AminSassi).

This repository serves as a **living, evolving knowledge base** that is updated and expanded with every video project, client brief, motion experiment, and automation script.

---

## 🚀 Repository Structure

```
.
├── docs/
│   ├── 01-production-workflow.md             # The end-to-end production cycle
│   ├── 02-scripting-and-storyboarding.md     # 4-beat structure & bilingual pacing
│   ├── 03-9-16-vertical-reel-rules.md        # Instagram Reel safe zones & mobile UI
│   ├── 04-ae-mcp-automation-patterns.md      # After Effects ExtendScript & MCP patterns
│   ├── 05-background-recipes-and-gradients.md# Animated gradients & Radiant background setups
│   ├── 06-sfx-and-sound-design.md            # Tactile sound design & 18-piece SFX palette
│   ├── 07-advanced-editorial-techniques.md   # Shockwaves, paper folds, TV micro-grids & flicker
│   ├── 08-apple-style-motion-graphics.md     # Apple 60fps morphing, springs, offsets & tilt
│   ├── 09-documentary-motion-and-3d-parallax.md # Vox/documentary 15fps, 3D parallax & camera chaining
│   ├── 10-kinetic-pixel-style-workflow.md    # Kinetic pixel trails, mosaic quantizer & card bevels
│   ├── 11-3d-camera-larping-method.md        # L.A.R.P. 3D camera framework & nested null chains
│   ├── 12-organic-text-texture-blending.md   # 4-effect organic ink, paper & surface texture stack
│   ├── 13-asset-and-icon-apis.md             # Headless asset APIs (Iconify, DiceBear, Picsum, Wiki)
│   ├── 14-motion-styles-matrix-15.md         # Master translation matrix for the 15 code-generated styles
│   ├── 15-cyberpunk-hud-workflows.md         # Cyberpunk/FUI telemetry, concentric reticles & scanlines
│   ├── 16-liquid-motion-and-metaballs.md     # Viscous fluid metaballs, alpha choke & surface tension
│   ├── 17-isometric-2-5d-motion-rigging.md   # Axonometric SSR math, elevation physics & 3-tone shading
│   ├── 18-cel-animation-line-boil.md         # 12fps/8fps hand-drawn line boil & organic edge flutter
│   └── 19-dental-product-ad-workflow.md      # Clean minimal 9:16 dental product ads (MCP pipeline + lessons)
├── expressions/
│   ├── apple_text_drop_selector.js           # Apple kinetic text drop Expression Selector
│   ├── depth_rack_focus.js                   # Dynamic 3D camera auto-focus tracking expression
│   ├── flicker_and_exposure.js               # Organic shutter/strobe exposure expression
│   ├── hud_telemetry_counter.js              # Cyberpunk dynamic hex & coordinate telemetry stream
│   ├── inertial_bounce_overshoot.js          # Physics spring rebound & overshoot expression
│   ├── liquid_surface_tension.js             # Viscoelastic volume-conserving droplet squash-and-stretch
│   ├── master_spring_bounce.js               # Refined Apple UI spring bounce formula
│   ├── tactile_paper_curl.js                 # Ars Active 5 paper curl & shadow sync expression
│   ├── turbulent_fog_evolution.js            # Atmospheric drifting fog evolution expression
│   └── value_at_time_offset.js               # Secondary follower lag via valueAtTime()
├── templates/
│   ├── script-and-storyboard-template.md      # Template for scripting 12-scene motion videos
│   └── scene-breakdown-template.json         # JSON schema for AE automation pipelines & asset manifests
├── scripts/
│   ├── fetch_assets.py                       # Zero-dependency CLI for Iconify, DiceBear, Logos, Photos & QR
│   ├── import_and_layout_asset.jsx           # ExtendScript auto-import, continuous rasterization & safe-fit
│   ├── animated_gradient_overlay.jsx         # ExtendScript generator for wiggle gradient overlays
│   ├── apply_cel_line_boil.jsx               # One-click 12fps line boil & organic displacement applicator
│   ├── center_and_fit_asset.jsx              # ExtendScript for smart layer centering & padding
│   ├── create_apple_morph_comp.jsx           # Automated 60fps Apple morphing setup generator
│   ├── create_curved_paper_cylinder.jsx      # 3D curved paper cylinder rig (CC Cylinder)
│   ├── create_cyberpunk_hud_rig.jsx          # Automated 60fps Cyberpunk holographic HUD reticle rig
│   ├── create_documentary_camera_rig.jsx     # Automated 15fps chained 3D camera rig & grade
│   ├── create_exposure_flicker.jsx           # ExtendScript for exposure flicker adjustment layers
│   ├── create_isometric_cube_rig.jsx         # Automated 60fps SSR isometric 2.5D cube & shadow rig
│   ├── create_liquid_metaball_rig.jsx        # Automated fluid metaball rig with alpha choke pipeline
│   ├── create_shockwave_displacement.jsx     # ExtendScript rig for shockwave refraction + CC Glass
│   ├── create_tv_grid_texture.jsx            # ExtendScript generator for CRT micro-dot TV overlays
│   ├── pixel_stream_generator.jsx            # Procedural Trim Paths + Turbulent + Mosaic generator
│   ├── 3d_camera_null_chain.jsx              # Setup L.A.R.P. 3D camera & nested null hierarchy
│   ├── apply_organic_text_texture.jsx        # Procedural ink bleed, grain & stop-motion text stack
│   ├── dental_product_ad_builder.jsx         # Config-driven product ad builder: cards, captions, headlines, end card
│   ├── transcribe_vo_words.py                # faster-whisper word timestamps for VO-synced captions
│   └── review_contact_sheet.py               # Footage overview + render QA contact sheets
└── projects/
    ├── iliner-dental-ad-v2/
    │   ├── README.md                         # i-LINER 58s ad: timeline, lessons, open items
    │   └── ad_config.jsx                     # Reference CFG for dental_product_ad_builder.jsx
    ├── iliner-dental-reel-9-16/              # v1 6-scene reel (superseded)
    └── saas-launch-reel-55s/
        ├── project-breakdown.md              # Deep dive into the 55.5s SaaS launch reel
        ├── script-tunisian-arabic.md         # Full script & transcription
        ├── storyboard-12-scenes.md           # 12-scene visual storyboard & layer map
        └── sfx-cue-sheet.md                  # SFX synchronization cue sheet
```

---

## 📦 Headless Asset & Icon Automation APIs

Autonomous agents and motion scripts can directly query, download, and style assets on-the-fly without manual browser browsing. See [docs/13-asset-and-icon-apis.md](docs/13-asset-and-icon-apis.md) for full endpoint recipes.

| Asset Type | Provider & Endpoint | Free / Keyless | CLI Command Example |
| :--- | :--- | :--- | :--- |
| **Vector Icons** | **Iconify** (`https://api.iconify.design`) | ✅ 100% Free | `python scripts/fetch_assets.py icon "solar/bell-bold" --color 00E5FF` |
| **Brand Logos** | **Simple Icons** via Iconify | ✅ 100% Free | `python scripts/fetch_assets.py logo "figma"` |
| **Avatars** | **DiceBear v9** (`https://api.dicebear.com/9.x/`) | ✅ 100% Free | `python scripts/fetch_assets.py avatar "Elena" --style lorelei --radius 50` |
| **Stock Backdrops** | **Picsum Photos** (`https://picsum.photos`) | ✅ 100% Free | `python scripts/fetch_assets.py photo --seed bg916 --width 1080 --height 1920` |
| **QR Code CTAs** | **QR Server** (`https://api.qrserver.com`) | ✅ 100% Free | `python scripts/fetch_assets.py qr "https://example.com" -o qr.svg` |
| **Documentary** | **Wikimedia Commons API** | ✅ 100% Free | `python scripts/fetch_assets.py wikimedia "Nikola Tesla" --limit 2` |

---

## 🌐 The 15 Motion Design Styles (Code to After Effects)

Inspired by the algorithmic, code-generated motion experiments in [Vincentwei1021/mg-styles-15](https://github.com/Vincentwei1021/mg-styles-15), this repository provides full After Effects architectural translations, effect stacks, and ExtendScript generators for 15 distinct motion styles. See [docs/14-motion-styles-matrix-15.md](docs/14-motion-styles-matrix-15.md) for the master translation index.

| Style | Document Guide | Key ExtendScript Rig / Expression | Target FPS |
| :--- | :--- | :--- | :--- |
| **Cyberpunk HUD / FUI** | [docs/15-cyberpunk-hud-workflows.md](docs/15-cyberpunk-hud-workflows.md) | `scripts/create_cyberpunk_hud_rig.jsx` + `hud_telemetry_counter.js` | `60.0 fps` |
| **Liquid Motion & Metaballs** | [docs/16-liquid-motion-and-metaballs.md](docs/16-liquid-motion-and-metaballs.md) | `scripts/create_liquid_metaball_rig.jsx` + `liquid_surface_tension.js` | `30.0 fps` |
| **Isometric 2.5D Rigging** | [docs/17-isometric-2-5d-motion-rigging.md](docs/17-isometric-2-5d-motion-rigging.md) | `scripts/create_isometric_cube_rig.jsx` (Exact SSR math) | `60.0 fps` |
| **Cel Animation & Line Boil** | [docs/18-cel-animation-line-boil.md](docs/18-cel-animation-line-boil.md) | `scripts/apply_cel_line_boil.jsx` (12fps procedural boil) | `12.0 fps` |
| **Apple Morphing Systems** | [docs/08-apple-style-motion-graphics.md](docs/08-apple-style-motion-graphics.md) | `scripts/create_apple_morph_comp.jsx` + `master_spring_bounce.js` | `60.0 fps` |
| **Vox/Documentary Parallax** | [docs/09-documentary-motion-and-3d-parallax.md](docs/09-documentary-motion-and-3d-parallax.md) | `scripts/create_documentary_camera_rig.jsx` + `3d_camera_null_chain.jsx` | `15.0 fps` |
| **Kinetic Pixel Systems** | [docs/10-kinetic-pixel-style-workflow.md](docs/10-kinetic-pixel-style-workflow.md) | `scripts/pixel_stream_generator.jsx` | `15/30 fps` |

---

## 🦷 Dental / Medical Product Ads (Clean · Minimal · 9:16)

Alpha 3D product renders on a soft light gradient + white pop-up explainer cards + word-synced captions,
generated end-to-end through After Effects MCP. Full guide: [docs/19-dental-product-ad-workflow.md](docs/19-dental-product-ad-workflow.md).

```js
// ae_do eval.run — new product = new config file, same builder
$.evalFile(new File(R + 'scripts/dental_product_ad_builder.jsx'));
$.evalFile(new File(R + 'projects/<product>/ad_config.jsx'));   // copy projects/iliner-dental-ad-v2/ad_config.jsx
IMPORT_ASSETS(CFG);
return BUILD_AD(CFG);
```

| Step | Tool |
| :--- | :--- |
| VO word timings | `python scripts/transcribe_vo_words.py vo.mp3 --lang fr` |
| See all clips | `python scripts/review_contact_sheet.py clips ALL_VIDEOS sheet.jpg` |
| Build / rebuild | `BUILD_AD(CFG)` (idempotent) |
| QA | `batch.run` × `render.frame` → `review_contact_sheet.py frames` |
| Deliver | H.264 – Match Render Settings – 15 Mbps |

---

## 🎯 Core Principles

1. **Editorial Motion, Not Template Flash**: Every movement has intent. Avoid gratuitous bounces and repetitive pop animations.
2. **Tactile Sound Design**: Visuals without sound feel hollow; repetitive sounds cause fatigue. Pair distinct UI actions with distinct audio signatures (mechanical keys, paper rustles, subtle whooshes, click thuds).
3. **9:16 Mobile-First Framing**: Always protect the Instagram UI overlay areas (14% top header, 20% bottom caption/audio zone, 12% right action buttons).
4. **Living Knowledge Loop**: After every video render and client delivery, distill new lessons, bug fixes, and custom expressions back into this repository.

---

## 🛠️ Tech Stack & Tooling

- **Adobe After Effects 2024 / 2025**
- **ExtendScript / JavaScript** for procedural layer generation and keyframe interpolation
- **Python 3.10+** for headless asset querying, SVG fetching, and batch scene manifests
- **After Effects MCP Automation** for headless composition assembly
- **Adobe Media Encoder** for high-bitrate H.264/MP4 delivery
- **Audition / Premiere Pro** for multi-track audio mastering

---

## 📝 Updating This Knowledge Base

Whenever a new motion project is initiated:
1. Create a new subfolder under `projects/` (e.g. `projects/my-new-reel/`).
2. Populate the storyboard, script, and SFX cue sheets from the `templates/` directory.
3. If new After Effects techniques, gradient recipes, or asset APIs were discovered, update the relevant guide in `docs/` or add a new utility in `scripts/`.
4. Commit and push back to GitHub.
