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
│   └── 09-documentary-motion-and-3d-parallax.md # Vox/documentary 15fps, 3D parallax & camera chaining
├── expressions/
│   ├── apple_text_drop_selector.js           # Apple kinetic text drop Expression Selector
│   ├── depth_rack_focus.js                   # Dynamic 3D camera auto-focus tracking expression
│   ├── flicker_and_exposure.js               # Organic shutter/strobe exposure expression
│   ├── inertial_bounce_overshoot.js          # Physics spring rebound & overshoot expression
│   ├── master_spring_bounce.js               # Refined Apple UI spring bounce formula
│   ├── tactile_paper_curl.js                 # Ars Active 5 paper curl & shadow sync expression
│   ├── turbulent_fog_evolution.js            # Atmospheric drifting fog evolution expression
│   └── value_at_time_offset.js               # Secondary follower lag via valueAtTime()
├── templates/
│   ├── script-and-storyboard-template.md      # Template for scripting 12-scene motion videos
│   └── scene-breakdown-template.json         # JSON schema for AE automation pipelines
├── scripts/
│   ├── animated_gradient_overlay.jsx         # ExtendScript generator for wiggle gradient overlays
│   ├── center_and_fit_asset.jsx              # ExtendScript for smart layer centering & padding
│   ├── create_apple_morph_comp.jsx           # Automated 60fps Apple morphing setup generator
│   ├── create_curved_paper_cylinder.jsx      # 3D curved paper cylinder rig (CC Cylinder)
│   ├── create_documentary_camera_rig.jsx     # Automated 15fps chained 3D camera rig & grade
│   ├── create_exposure_flicker.jsx           # ExtendScript for exposure flicker adjustment layers
│   ├── create_shockwave_displacement.jsx     # ExtendScript rig for shockwave refraction + CC Glass
│   └── create_tv_grid_texture.jsx            # ExtendScript generator for CRT micro-dot TV overlays
└── projects/
    └── saas-launch-reel-55s/
        ├── project-breakdown.md              # Deep dive into the 55.5s SaaS launch reel
        ├── script-tunisian-arabic.md         # Full script & transcription
        ├── storyboard-12-scenes.md           # 12-scene visual storyboard & layer map
        └── sfx-cue-sheet.md                  # SFX synchronization cue sheet
```

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
- **After Effects MCP Automation** for headless composition assembly
- **Adobe Media Encoder** for high-bitrate H.264/MP4 delivery
- **Audition / Premiere Pro** for multi-track audio mastering

---

## 📝 Updating This Knowledge Base

Whenever a new motion project is initiated:
1. Create a new subfolder under `projects/` (e.g. `projects/my-new-reel/`).
2. Populate the storyboard, script, and SFX cue sheets from the `templates/` directory.
3. If new After Effects techniques or gradient recipes were discovered, update the relevant guide in `docs/` or add a new ExtendScript utility in `scripts/`.
4. Commit and push back to GitHub.
