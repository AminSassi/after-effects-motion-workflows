# Nuclear Taboo / NUCLEAR_DOMINO — 9-min code-rendered 3D documentary

Verion Story geopolitics documentary (Nov 2026). Every motion-graphics shot is rendered by Node scripts
(SVG → PNG → H.264), not inside After Effects, then placed on Premiere V3 through the Premiere MCP.

**Read first:** [`docs/25-documentary-client-notes-and-lib3d-lessons.md`](../../docs/25-documentary-client-notes-and-lib3d-lessons.md):
every note from the owner and the fix that worked. Most of the value is there.
`PROJECT_PLAN_handoff.md` is the full original handoff, covering editorial rules, the style system, Premiere structure and the status log.

## Final timeline (V3, 25 fps, 1080p; timeline = VO time + 3.72 s)

| Clip | Script | VO T0 (s) | Frames | Timeline on V3 |
|---|---|---|---|---|
| ND_M1_3D_v6 | m1_3d.mjs | 0 | 1525 | 3.72–64.72 |
| ND_A2_3D_v3 | act2.mjs | 61.00 | 1657 | 64.72–131.00 |
| mountain (V2) | scene_mountain.mjs | 127.29 | — | 131.00–148.76 |
| ND_A3_3D_v3 | act3.mjs | 145.05 | 2660 | 148.76–255.16 |
| ND_A4_3D_v3 | act4.mjs | 251.45 | 2700 | 255.16–363.16 |
| ND_A5_3D_v3 | act5.mjs | 359.45 | 2323 | 363.16–456.08 |
| ND_A6_3D_v4 | act6.mjs | 452.35 | 2301 | 456.08–548.08 |

Frame index for a VO time t: `(t − T0) × 25`.

## Files (`tools/`)

| File | What it is |
|---|---|
| `lib3d.mjs` | The engine: painter's-sort SVG 3D (Scene, Cam, kf, box/prism/cyl, S.group, worldMap, arc3, marker{flag}, flagSVG/faceSVG, tornPhotoSVG/tornPhoto3D/tornCard2D, paperNote, words (two-tone reveal, real Inter metrics), shock, missile, flyArc, terrain, crt, metaballs, network, shards, chapter, grain/vignette, `cli`) |
| `render.mjs` | Parallel renderer: `node render.mjs <script> <tag> <frames> <out.mp4> [workers] [from] [to]`. Chunks of 100 frames per child process, skips existing frames, encodes edit-friendly H.264 (High@4.1, GOP 25) |
| `glbphone.mjs` | Software rasterizer for a phone GLB. Textures the real `Front_Screen` mesh with perspective-correct UVs + mips (`texFromSVG`, `phoneLayer`) |
| `wh3d.mjs` | Detailed White House (portico, colonnades, pediments, balustrade, flag). Pattern for any landmark |
| `m1_3d.mjs`, `act2–6.mjs` | One script per act; each exports frames via `cli(frame, T0, tag)` |
| `scene_mountain.mjs` | First drawn 2.5D proof (mountain cutaway + GBU-57) |
| `minute1.mjs`, `maps.mjs`, `graphics.mjs`, `base_maps.mjs`, `render_scenes.mjs` | v1 2D engine + 4K map/graphic stills (superseded by lib3d, kept for reference) |
| `check_lane.mjs` | Verifies every point of a ship/sea path is in water, not on land |
| `commons_find.mjs`, `fetch_assets.mjs`, `fetch_more.mjs` | Wikimedia Commons search + download with licence JSON per file |
| `build_sfx.mjs` | SFX master track builder |
| `make_grain.mjs` | Regenerates `grain_0..2.png` (not committed, 3.5 MB each) |
| `place.jsx` | Premiere ExtendScript placement of a cut list |
| `photos/*.json`, `SOURCES_*.md` | Licence/credit records for every flag, portrait and photo used |
| `fonts/` | Inter (OFL) + DejaVu Sans Mono (free licence) |

## Run it

```bash
cd tools
npm i
node make_grain.mjs
# put a phone GLB at tools/models/iphone18_burgundy.glb (not committed: third-party model)
# put photos at tools/photos/ND_P_*.jpg, ND_F_*.png, ND_L_*.jpg (use fetch_assets.mjs / commons_find.mjs)
node act4.mjs stills 279.9 313.5 320     # check single frames first -> stills_a4/
node render.mjs act4.mjs a4 2700 ../ND_A4_3D_v4.mp4 4
```

Re-render one shot only: move its `frames_<tag>/f_XXXXX.png` range into `frames_<tag>_oldN/`, then re-run
the same render command. It renders just the missing frames and re-encodes.

Some older scripts (`base_maps`, `build_sfx`, `graphics`, `maps`, `minute1`) still have absolute
`C:/Users/PC/...` paths; edit them for a new project.
