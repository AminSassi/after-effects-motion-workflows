# 20 — Blender 3D Product Rendering & Agent Skills Pipeline

How to prepare, animate, QA, and export 3D product renders in Blender for seamless integration into After Effects motion workflows.

This architecture integrates two battle-tested agent skill suites:
1. **[EL4CTEO/blender-skills](https://github.com/EL4CTEO/blender-skills)** (`vendor/el4cteo-blender-skills`): Comprehensive Blender 5.x production pipeline, modern `bpy` API patterns, PBR materials, and automated mesh QA diagnostics.
2. **[kevinbadi/blender-skills](https://github.com/kevinbadi/blender-skills)** (`vendor/blender-skills`): Product showcase camera rigs (turntable, slow-zoom, dolly-rotate, crane-shot, loops) and automated studio lighting polish.

---

## 💡 The 0xCodio Problem & Solution

In his viral thread ([@0xCodio/status/2109275834984915150](https://x.com/0xCodio/status/2109275834984915150)), 0xCodio highlighted the two fatal failure modes when AI agents interact with Blender:

1. **API Hallucination & Version Drift**: LLMs default to deprecated 2.8x / 3.x `bpy` code (e.g. outdated node socket names, matrix multiplication syntax, layer collection access), breaking in Blender 4.x/5.x.
2. **Invisible Geometry Errors**: A rendered frame might look acceptable from one distance, but underlying non-manifold edges, flipped normals, degenerate zero-area faces, or overlapping UVs silently corrupt shadow rendering, refraction, and downstream pipelines.

### The Solution in This Repo
- **Version-Pinned Patterns**: We use `vendor/el4cteo-blender-skills/skills/blender-core/` for validated Blender 5.x execution helpers (`run_in_blender.py` and `_bpyx.py`).
- **Pre-Render Automated QA**: Every 3D model passes `qa_check.py` before any camera trajectory or final render is queued.

---

## 🎬 End-to-End Product-to-Ad Pipeline

```mermaid
flowchart TD
    A["Raw 3D Asset (CAD / GLB / Blend)"] --> B["blender-product-polish<br/>Clean materials & 4-point studio lighting"]
    B --> C["blender-asset-qa<br/>(qa_check.py)<br/>Detect inverted normals & manifold errors"]
    C --> D["Camera Animation Skill<br/>(turntable / slow-zoom / crane-shot / orbit)"]
    D --> E["Render: ProRes 4444 + Alpha<br/>(1080x1920 or 2160x3840 @ 60fps)"]
    E --> F["AE Pipeline<br/>(dental_product_ad_builder.jsx)<br/>Auto-import, card popups & VO captions"]
```

---

## 🛠️ Key Skills Reference

### 1. Product Polish & Lighting (`vendor/blender-skills`)
- **`product-polish`**: Strips noisy, low-resolution normal maps from raw AI/CAD models, applies a sleek clearcoat/glass material, configures 4-point studio lighting (Key, Fill, Rim, Bounce), and switches viewport to real-time EEVEE ray tracing.
- **`turntable`**: Procedural 360° camera orbit around product bounding box. Starts front-facing, seamless loop, transparent background.
- **`slow-zoom`**: Macro push-in focusing on hero details (e.g., syringe tip, printed box serials).
- **`dolly-rotate` & `crane-shot`**: Sweeping low-to-high dynamic product unveils.

### 2. Core API & Automated QA (`vendor/el4cteo-blender-skills`)
- **`blender-core`**: Headless Python script runner with robust error reporting:
  ```bash
  python vendor/el4cteo-blender-skills/skills/blender-core/scripts/run_in_blender.py --script your_script.py --blend scene.blend
  ```
- **`blender-asset-qa`**: Automated mesh diagnostic script:
  ```bash
  python vendor/el4cteo-blender-skills/skills/blender-asset-qa/scripts/qa_check.py --input model.glb
  ```
  Scans for:
  - Non-manifold edges & vertices
  - Inverted / inconsistent face normals
  - Degenerate / zero-area faces
  - Overlapping UV islands & texel density variance
- **`blender-lighting-lookdev` & `blender-pbr-materials`**: Physically accurate dielectric / metallic PBR shader builder.

---

## 📐 Dental / Product Render Specifications for After Effects

When rendering 3D assets in Blender intended for the `dental_product_ad_builder.jsx` workflow:

| Spec | Setting | Why |
|---|---|---|
| **Format** | QuickTime `.mov` | Direct AE native ingestion |
| **Video Codec** | Apple ProRes 4444 (`prores_ks` profile 4) | High color depth with lossless alpha |
| **Color Mode** | RGBA | Preserves transparent background |
| **Alpha Mode** | Premultiplied (default) or Straight | Handled automatically by AE importer |
| **Resolution** | `1080x1920` (vertical 9:16) or `2160x3840` (turntables) | Crisp scaling in 9:16 mobile ads |
| **Frame Rate** | `60.0 fps` | Smooth mobile playback and slow-down headroom |
| **Turntables** | Hold last frame or loop | Compatible with builder's time-remapping hold |
