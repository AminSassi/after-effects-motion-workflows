# NUCLEAR DOMINO / "Nuclear Taboo" — MASTER PROJECT PLAN & HANDOFF

Read this whole file before touching anything. It is written so any AI model (or editor) can continue the work with the same decisions, style and timings. Update the STATUS LOG at the bottom every time you finish a step.

## 0. What this project is
- Channel: Verion (YouTube, documentary / "stay on the case" outro). Creator: Amin.
- Video: ~9 min scenario documentary on Tucker Carlson's unverified 1 Nov 2026 claim of a possible US nuclear strike on Iran's Pickaxe Mountain, the nuclear taboo, and the "dominoes" (Russia, South Asia, East Asia), Plan A, Petrov 1983, Doomsday Clock.
- Editorial rule: SCENARIO, NOT PREDICTION. Always label claims: UNVERIFIED (Carlson), ON THE RECORD (official quotes), DOCUMENTED (history). Never present the Carlson claim as fact. Stay politically neutral.
- Owner preferences: chat replies in plain prose, no markdown, no empty lines between paragraphs; agent prompts go in a code box; give multiple options for copy/metadata. "Do what's better; I'll say if I dislike it."

## 1. Locations
- Project folder (Windows): C:\Users\PC\Desktop\NUCLEAR_DOMINO\
  - 00_SCRIPT\ script_full.txt (long script), Nuclear_tabooVO_original.srt, Nuclear_tabooVO_CLEAN.srt (watermark removed, Varian→Verion, Pickax→Pickaxe, NukeMap→NUKEMAP), scene_map.csv (22 scenes, VO + timeline times, visual plan, assets)
  - 01_RESEARCH\ fact_check_and_sources.md (all facts, FIX items, links)
  - 02_ASSETS\maps\ M01–M10 (each: _base = map only, _overlay = transparent labels/markers, _FULL = composite) — 3840x2160
  - 02_ASSETS\graphics\ G01–G07, G11 data graphics; Q01–Q04 quote cards (+_alpha); T01–T09 chapter titles (+_alpha); S01–S04 stamps (alpha); L01–L07 lower thirds (alpha); G03 phase cards (alpha) — all 3840x2160
  - 02_ASSETS\photos\ PHOTO_SOURCES.md + (pending) the 16 ND_P_*.jpg photos
  - 03_AFTER_EFFECTS\ (AE projects/renders go here)
  - 04_PREMIERE\ (exports of XML/EDL, notes)
  - 05_EXPORTS\ (final renders)
  - 06_TOOLS\ generator scripts: maps.mjs, graphics.mjs (Node + d3-geo + world-atlas + @resvg/resvg-js, font Inter), cut.json (cut list), place.jsx (Premiere placement ExtendScript), scenes.json
- Original media (do not move): C:\Users\PC\Downloads\ElevenLabs_2026-11-05T14_19_14 / 14_21_10 / 14_23_27 ... .mp3 (VO in 3 parts), Nuclear tabooVO.srt, C:\Users\PC\Downloads\Work\Ahmed Abida\Assets\DISCLAIMER-verion.png
- Premiere project: C:\Users\PC\Documents\Adobe\Premiere Pro\26.0\Nuclear Taboo.prproj (Premiere 26.3)

## 2. Premiere structure (main sequence)
- MAIN sequence name: "ElevenLabs_2026-11-05T14_19_14_Liam - Energetic, Social Media Creator_pre_s50_sim75_v4"  ID d8d98f54-6fe3-4cff-b9ad-41c8fd1dcb8e. 25 fps. 1920x1080 (converted from 1280x720 on 5 Nov; BACKUP stays 720p).
- BACKUP_before_Claude_edit = untouched copy made before any edit (id differs). Do not edit it.
- Tracks: V1 DISCLAIMER-verion.png 0.00–3.72 · V2 = base visuals (maps/graphics/cards/titles, gap-free 3.72–548.08) · V3 = overlays (stamps, lower thirds) · V4 = "Nested Sequence 03" = 400 caption Graphics (word captions) starting 4.20 · A2 = "Nested Sequence 01" (VO, 3 mp3 parts) starting 3.72.
- TIME RULE: timeline time = SRT/VO time + 3.72 s. Captions nest runs ~0.13 s behind VO (acceptable).
- Bin ND_ASSETS holds all imported assets. Clips are found by name prefix (e.g. "M04_").
- Motion convention (3840 px stills): base scale = 100 × (seqWidth/3840) → 50% at 1080p (33.33% at 720p). Maps/photos: slow push-in from 102% to 110% of base over the clip (at 1080p: 51 → 56.25). Graphics G*: 100% → 105% of base (to avoid edge crop). Cards Q*/T*: 100% → 103.5%. Overlays (S*, L*): static 100% of base. Keyframe times are in CLIP MEDIA TIME: key at clip.inPoint.seconds and clip.inPoint.seconds + duration (stills have inPoint 3600).

## 3. Style system (keep consistent)
- Background #0A0C0F · panel #12161C · lines #2A323D · text #F2F2F2 · sub #9AA4B2 · dim #5B6573
- Accents: red #E5484D (threat/Iran/Russia/unverified) · amber #F5A524 (target/Pickaxe/scenario) · blue #5B8DEF (US/allies/on the record)
- Font: Inter (700 titles, 500 body). Titles top-left at x=160,y=250 (4K). Source line bottom-right, 34 px dim.
- Maps: Natural Earth via world-atlas 50m, Mercator for regions, Natural Earth projection for world; highlight fill #3B1416 stroke red, allies #1B2A3D stroke blue. Markers = dot + ring, label bold + gray subline.
- Banned: fake screenshots of real posts, photos of real people (use lower thirds), glows, template looks. No Natanz satellite photos (commercial, licensed).

## 4. Tool facts learned (important for any agent)
- Premiere MCP (premiere-pro): works. execute_extendscript is the power tool. export_frame tool FAILS (EvalScript error) → use QE: app.enableQE(); qe.project.getActiveSequence().exportFramePNG(timecodeString, "C:\\path\\name") (no extension).
- clone_sequence ignores newName and makes the CLONE active → always re-open the main sequence after (app.project.openSequence("d8d98f54-...")).
- track.overwriteClip(projectItem, seconds) then set clip.end = Time to trim. Find the new clip by matching start time.
- After Effects MCP (after-effects): run-script runs only PREDEFINED script names (getProjectInfo etc., see get-help) and is queued: call run-script, then get-results. Has create-composition, apply-effect, set-effect-keyframe, setLayerKeyframe, setLayerExpression, add-marker. No confirmed arbitrary eval or import → for AE work either test custom scripts first or run JSX via File > Scripts in AE.
- Cloud sandbox: shell can reach npm/GitHub only; Wikimedia blocked from shell. Photos were fetched via the built-in browser (Commons API + blob download) into the user's Downloads (agent has NO access to Downloads; user moves files). Agent has read/write access to Desktop via device tools.
- Repo with motion rules: https://github.com/AminSassi/after-effects-motion-workflows (SKILL.md router; docs 22 tool mapping, 23 Premiere handoff, 24 HTML motion).

## 5. Fact fixes to apply in VO/captions (from research)
- "On election day he said there was no rush" → Axios interview was Mon 2 Nov (eve of 3 Nov midterms): say "On the eve of the election".
- "Pakistan's nuclear command authority was summoned" → "was reportedly summoned" (Pakistan denied it).
- VO pronounces Verion as "Varian" (3 places: ~3:20, ~8:38, ~9:01 VO) → regenerate those ElevenLabs lines.
- Plan A first phase is 2.6 M (VO says 2.5 M) — graphic uses source figure.

## 6. Remaining work, in order
1. [user] Move ND_P_*.jpg (+ ND_TEST_Nagasakibomb.jpg → rename ND_P_nagasaki.jpg) from Downloads to 02_ASSETS\photos.
2. Import photos to ND_ASSETS\PHOTOS and overwrite onto V2 at the photo slots (section 8). Same push-in motion; photos are ≤3840 wide, so compute base scale from each photo's real width (fill frame: scale = max(1920/w, 1080/h)×100, then push 102→110%).
3. After Effects inserts (render ProRes 4444 or PNG seq to 03_AFTER_EFFECTS, import, overwrite the same V2 slot): (a) Plan A counter — numbers count up per phase, cards slide in (replace clip at 376.79–397.87); (b) Dominoes map — base map + overlay, arrows draw on with trim paths, labels pop (replace 15.87–24.39, 40.57–48.35, 256.81–265.13); (c) Depth cross-section — GBU-57 arrow drives down to 60 m, Pickaxe band reveals, Carlson line draws (131.01–143.89); (d) Doomsday clock minute hand ticks to 85 s (456.07–469.97); (e) Petrov screen 1 → 5 counter flicker (430.81–451.19); (f) Map marker pulses on M02 locator.
4. Transitions: 6-frame cross dissolve or fast blur-whip between V2 clips at chapter titles only; hard cuts elsewhere (on VO sentence starts).
5. Sound design: low drone bed −20 dB under whole video; impact/whoosh on each chapter title (T01–T09 starts); typewriter tick on quote cards; stamp thud on S01/S04; clock tick under G04. Keep VO −6 to −3 dB, music −16 to −18 dB.
6. CTA slots (VO 196.97–209.19 subscribe, 350.95–359.23 like/comment, 511–524 outro): currently hold M04/M10; replace with the channel's subscribe animation if Amin has one.
7. Export: H.264 1920x1080 25 fps, ~16–20 Mbps VBR 2-pass, AAC 320 kbps → 05_EXPORTS\Nuclear_Taboo_v1.mp4. Before export: QA frame per scene via QE exportFramePNG, check captions don't collide with lower thirds/source lines.
8. Metadata (titles/description/chapters/tags) — give Amin multiple options per element. Chapters = chapter-title times minus... (use timeline times of T01–T09).

## 7. Current cut list (V2 base + V3 overlays), timeline seconds
| # | Timeline in | Timeline out | VO in | Asset (prefix) | Motion |
| :-- | :-- | :-- | :-- | :-- | :-- |
| 1 | 3.72 | 12.99 | 0.00 | M10 | push |
| 2 | 12.99 | 15.87 | 9.27 | Q02 | card |
| 3 | 15.87 | 24.39 | 12.15 | M04 | push |
| 4 | 24.39 | 30.43 | 20.67 | M10 | push |
| 5 | 30.43 | 34.11 | 26.71 | Q02 | card |
| 6 | 34.11 | 40.57 | 30.39 | G06 | push |
| 7 | 40.57 | 48.35 | 36.85 | M04 | push |
| 8 | 48.35 | 52.01 | 44.63 | T01 | card |
| 9 | 52.01 | 60.71 | 48.29 | Q01 | card |
| 10 | 60.71 | 67.17 | 56.99 | M02 | push |
| 11 | 67.17 | 72.19 | 63.45 | G01 | push |
| 12 | 72.19 | 76.19 | 68.47 | G05 | push |
| 13 | 76.19 | 90.19 | 72.47 | Q01 | card |
| 14 | 90.19 | 108.15 | 86.47 | M01 | push |
| 15 | 108.15 | 112.83 | 104.43 | M03 | push |
| 16 | 112.83 | 117.01 | 109.11 | M01 | push |
| 17 | 117.01 | 119.15 | 113.29 | T02 | card |
| 18 | 119.15 | 131.01 | 115.43 | M02 | push |
| 19 | 131.01 | 143.89 | 127.29 | G01 | push |
| 20 | 143.89 | 149.07 | 140.17 | M02 | push |
| 21 | 149.07 | 179.41 | 145.35 | G02 | push |
| 22 | 179.41 | 185.59 | 175.69 | Q02 | card |
| 23 | 185.59 | 190.61 | 181.87 | G05 | push |
| 24 | 190.61 | 200.69 | 186.89 | Q03 | card |
| 25 | 200.69 | 212.91 | 196.97 | M04 | push |
| 26 | 212.91 | 214.69 | 209.19 | T03 | card |
| 27 | 214.69 | 223.33 | 210.97 | M10 | push |
| 28 | 223.33 | 248.69 | 219.61 | G06 | push |
| 29 | 248.69 | 255.17 | 244.97 | M04 | push |
| 30 | 255.17 | 256.81 | 251.45 | T04 | card |
| 31 | 256.81 | 265.13 | 253.09 | M04 | push |
| 32 | 265.13 | 269.57 | 261.41 | Q01 | card |
| 33 | 269.57 | 277.99 | 265.85 | Q04 | card |
| 34 | 277.99 | 290.45 | 274.27 | M05 | push |
| 35 | 290.45 | 292.29 | 286.73 | T05 | card |
| 36 | 292.29 | 307.99 | 288.57 | M06 | push |
| 37 | 307.99 | 311.31 | 304.27 | G07 | card |
| 38 | 311.31 | 325.61 | 307.59 | M06 | push |
| 39 | 325.61 | 327.47 | 321.89 | T06 | card |
| 40 | 327.47 | 354.67 | 323.75 | M07 | push |
| 41 | 354.67 | 363.17 | 350.95 | M04 | push |
| 42 | 363.17 | 365.17 | 359.45 | T07 | card |
| 43 | 365.17 | 376.79 | 361.45 | M08 | push |
| 44 | 376.79 | 397.87 | 373.07 | G03 | push |
| 45 | 397.87 | 403.45 | 394.15 | M08 | push |
| 46 | 403.45 | 409.61 | 399.73 | M02 | push |
| 47 | 409.61 | 420.37 | 405.89 | M04 | push |
| 48 | 420.37 | 423.49 | 416.65 | T08 | card |
| 49 | 423.49 | 430.81 | 419.77 | M09 | push |
| 50 | 430.81 | 451.19 | 427.09 | G11 | card |
| 51 | 451.19 | 456.07 | 447.47 | M09 | push |
| 52 | 456.07 | 469.97 | 452.35 | G04 | push |
| 53 | 469.97 | 483.01 | 466.25 | Q02 | card |
| 54 | 483.01 | 488.19 | 479.29 | M02 | push |
| 55 | 488.19 | 492.63 | 484.47 | M04 | push |
| 56 | 492.63 | 494.15 | 488.91 | T09 | card |
| 57 | 494.15 | 514.87 | 490.43 | M10 | push |
| 58 | 514.87 | 519.27 | 511.15 | Q01 | card |
| 59 | 519.27 | 527.97 | 515.55 | G05 | push |
| 60 | 527.97 | 548.08 | 524.25 | M10 | push |

| Overlay V3 | in | out |
| :-- | :-- | :-- |
| S03 | 24.39 | 29.72 |
| L07 | 27.65 | 33.92 |
| L01 | 52.01 | 57.22 |
| S01 | 77.23 | 82.02 |
| L02 | 179.41 | 184.62 |
| L05 | 234.17 | 240.32 |
| S01 | 265.13 | 269.32 |
| L03 | 269.57 | 275.22 |
| L04 | 423.49 | 429.72 |
| S04 | 447.93 | 453.02 |
| L02 | 469.97 | 475.22 |
| S01 | 514.87 | 519.12 |

## 8. Photo slots (overwrite onto V2 when photos arrive; timeline seconds)
| Photo | in | out | Replaces |
| :-- | :-- | :-- | :-- |
| ND_P_nagasaki | 3.72 | 8.50 | first half of M10 (cold open) |
| ND_P_hiroshima | 214.69 | 223.33 | M10 at "In 1945..." |
| ND_P_b2 | 125.00 | 131.01 | end of M02 at "Operation Midnight Hammer" |
| ND_P_midnight_hammer | 119.15 | 125.00 | start of M02 slot ("never hit when the US bombed...") — keep M02 earlier? optional |
| ND_P_mop | 137.50 | 143.89 | second half of G01 at "GBU-57" |
| ND_P_hormuz_night | 102.00 | 108.15 | M01 at "Exchanges erupted around the Strait of Hormuz" |
| ND_P_qeshm_nasa | 108.15 | 112.83 | M03 Qeshm slot |
| ND_P_iaea | 149.07 | 153.50 | start of G02 ("International Atomic Energy Agency") |
| ND_P_whitehouse | 12.99 | 15.87 | replaces Q02 at "The White House says that is not the plan" |
| ND_P_kremlin | 277.99 | 284.00 | start of M05 ("Imagine a world where the nation...") |
| ND_P_taiwan_strait | 327.47 | 334.00 | start of M07 ("Taiwan Strait has seen nuclear crises") |
| ND_P_minuteman | 371.00 | 376.79 | end of M08 ("Within three hours, hundreds of warheads") |
| ND_P_trident | 397.87 | 403.45 | M08 slot ("once nuclear weapons are loosed") |
| ND_P_princeton | 363.17 | 365.17 | after T07 (optional, 2 s) |
| ND_P_pentagon | 494.15 | 501.00 | M10 at "Planners presenting alternatives" |
| ND_P_hiroshima (again) | 501.00 | 505.50 | "the memory of Hiroshima" |
| ND_P_nagasaki (again) | 527.97 | 548.08 | closing (slow push, fade to black last 1 s) |

## 9. How to regenerate assets
- cd 06_TOOLS; npm i world-atlas@2 topojson-client d3-geo d3-geo-projection @resvg/resvg-js; node maps.mjs out/maps; node graphics.mjs out/graphics (needs Inter .otf paths — edit FONT path for Windows: C:/Windows/Fonts or a downloaded Inter).
- Edit text/labels inside those scripts; positions are in 3840x2160 px.
- Re-place everything in Premiere: run place.jsx content via execute_extendscript ONLY on an empty V2/V3 (it overwrites). Adjust scale numbers for 1080p (×1.5 of the 720p values in the file).

## 10. STATUS LOG (append newest at bottom)
- 2026-11-05 16:40 MCP bridges tested (AE + Premiere OK).
- 2026-11-05 16:45 after-effects-motion-workflows repo audited; fixes + HTML prompt library delivered as patch (not pushed; GitHub not linked).
- 2026-11-05 17:00 Research + fact-check done; 10 maps + graphics generated; Desktop folder created.
- 2026-11-05 17:12 Premiere: BACKUP_before_Claude_edit created; 42 assets imported to ND_ASSETS; 60 V2 clips + 12 V3 overlays placed (720p scales); project saved.
- 2026-11-05 17:20 Photos downloaded to user's Downloads (ND_P_*). Waiting for user to move them.
- 2026-11-05 17:25 PROJECT_PLAN.md + 06_TOOLS written to Desktop.
- 2026-11-05 17:30 Main sequence converted to 1920x1080: disclaimer scale 62→93; all V2/V3 scale keys ×1.5 (maps now 51→56.25, graphics 50.1→52.8, cards 50.1→51.9, overlays 50); Nested Sequence 03 set to 1920x1080 and each of its 400 caption Graphics got Vector Motion anchor = position = (0.5, 0.939) and scale 150 (scaling about the caption line; scaling about the center pushed captions off-frame). Verified frame at 54 s: captions crisp. Project saved.
- 2026-11-05 17:35 V3 overlays animated in Premiere: opacity 0→100 in 0.25 s, out 0.3 s; stamps (S*) scale pop 72→48→50; lower thirds (L*) slide from x 0.47→0.5 in 0.35 s. Project saved.
- 2026-11-05 17:35 AE finding: the after-effects MCP has no import, render or save tool, so AE comps cannot reach Premiere automatically. Path to use AE: (1) build comps in AE (create-composition, run-script createTextLayer/createShapeLayer, setLayerKeyframe/setLayerExpression), (2) USER saves the AE project once to 03_AFTER_EFFECTS\ND_motion.aep, (3) Premiere import_ae_comps (Dynamic Link) or user renders to 03_AFTER_EFFECTS and agent imports. Until then, animate in Premiere.
- NEXT: photos (waiting for user to move ND_P_*.jpg into 02_ASSETS\photos) → section 8 slots; then Premiere-native animation of Plan A cards (import G03_planA_phase*_card_alpha, stagger on V3 over G03 slot) and dominoes (M04_base on V2 + M04_overlay on V3 fading in); then sound design (section 6 step 5); then export.
- 2026-11-05 17:40 MINUTE 1 v1 rendered: 06_TOOLS/minute1.mjs (Node SVG frame engine, pure function of time, 25 fps, 1920x1080; resvg + opentype.js metrics; ffmpeg H.264 CRF 14) → 03_AFTER_EFFECTS/ND_MINUTE1_v1.mp4 (VO 0–61 s). Placed on V2 at 3.72–64.72 (replaces old stills); V3 overlays in that range removed (baked in). Scenes: A X-post reconstruction (X dark-mode colours #000/#E7E9EA/#71767B/#2F3336, initials avatar, no logo, no fake metrics, 14-word excerpt, label "reconstructed from a public post on X") · B 2026→1945 counter · C White House "Not the plan." + Oct 15 chip · D T+24:00:00 clock with terminator sweep · E dominoes arrows draw (Iran→Russia/S.Asia/E.Asia) · F "THIS IS NOT A PREDICTION" strike · G checklist + SCENARIO stamp · H three source tiles · I real headline cards (Newsweek, Anadolu, Al Jazeera, Middle East Eye) → UNTHINKABLE · J calendar roll SUN NOV 1 8:47 PM ET · K X post with synced highlights, ALLEGES PRESSURE tag, UNVERIFIED stamp, lower third, THE TARGET? · L zoom into Pickaxe with pulse. Motion rules from repo docs 07–09 (spring overshoot, two-tone word reveal, whip-in + drift camera, ≤1° tilt, flicker). Photos for B/C used automatically if photos/ND_P_nagasaki.jpg / ND_P_whitehouse.jpg exist in 06_TOOLS working dir → re-render frames 107–303.
- Render tip: run frames in chunks of ≤110 per node process (memory grows; a 760-frame process got OOM-killed). ~0.36 s/frame.
- WAITING: Amin's review of minute 1 before continuing with minute 2+ in the same engine (one renderer per minute, same style).
- 2026-11-05 17:50 Amin feedback on minute 1: tile text touched borders (fixed), headlines must be an aligned grid (fixed), NO rubber-stamp graphics ("AI slop"); wants DRAWN explanatory motion graphics (show the mountain, the bomb, etc.) built with the repo techniques, not text/HUD over maps.
- NEW STYLE RULE: every explanatory beat = a drawn illustration in motion (isometric/2.5D per repo doc 17, 3-tone shading, line boil @12fps doc 18, paper grain doc 12, continuous camera doc 09, shockwave/flicker doc 07). Text only as small mono labels + one headline. No stamps.
- 2026-11-05 17:55 PROOF scene rendered: 06_TOOLS/scene_mountain.mjs → 03_AFTER_EFFECTS/ND_S06_mountain_v1.mp4 (VO 127.29–145.05): satellite top-down → tilt to 2.5D cutaway (vertical ×2.6, 'not to scale' label), tunnels draw from portals to halls (80–100 m), depth ruler, GBU-57 drops, shockwave, drills to 60 m, red '≥20 m granite left' bracket, IAEA padlock, halls become '?'. Placed on V2 131.01–148.76. engine.mjs = minute 1+2 v2 (fixes applied, minute 2 scenes not yet rendered). WAITING on Amin's verdict on this proof before rebuilding minute 1 and 2 in the drawn style.
- 2026-11-05 18:00 Amin approved the drawn direction and asked for the FULL video to feel alive: animations, assets, elements, 3D camera, smooth premium.
- NEW ENGINE: 06_TOOLS/lib3d.mjs — perspective 3D camera (Cam, orbit, kf keyframes), depth-sorted shaded faces (3-tone), box/prism/cyl/rotations, 3D world map from Natural Earth 110m/50m (1 unit = 1°), arcs, markers, billboards, affine-mapped planes for screens/cards, two-tone word reveal with real Inter metrics (opentype), grain + vignette + flicker, CLI (stills/frames). Render in chunks of ≤110 frames/process, 2 processes in parallel (~0.3 s/frame).
- MINUTE 1 v2 (3D): 06_TOOLS/m1_3d.mjs → 03_AFTER_EFFECTS/ND_M1_3D_v2.mp4 (VO 0–61): phone with reconstructed X post (orbit+dolly) · corridor of year cards swinging open 2026→1945 · drawn White House · night world map with terminator + T+ clock · 3D dominoes on the map with arcs · crystal-ball forecast struck out · desk with empty folders + microphone quote · three rising evidence pillars · 3D headline wall dolly · flip calendar · phone close-up with synced highlights · fly-in over extruded Iran to Pickaxe. NOT YET PLACED in Premiere (computer disconnected at 18:15). To place: import + overwrite V2 at 3.72 (replaces ND_MINUTE1_v1).
- PHOTOS: Amin wants them moved from Downloads into 02_ASSETS/photos, MORE downloaded, and every photo shown in a custom TORN PAPER template → lib3d.tornPhotoSVG / tornPhoto3D (natural torn edge, paper border, tape, mono caption + credit, shadow, optional grayscale/sepia). Downloads access: request again via device_request_folder_access(["~/Downloads"]) — Amin explicitly asked for the move.
- NEXT ORDER: (1) reconnect → commit tools + ND_M1_3D_v2.mp4, place on V2; (2) Downloads access → move ND_P_* photos, fetch more (Hiroshima/Nagasaki aftermath, B-2 at Whiteman, carrier in Arabian Sea, Hormuz tankers, Tehran, Doha, IAEA Board, Kremlin, Rawalpindi, Taiwan Strait, Minuteman/Trident, Pentagon) via built-in browser + Commons API; (3) insert torn-paper photos into minute 1 (1945 card, White House) and all later scenes; (4) minute 2 in 3D (scene list in engine.mjs M2 section — rebuild with lib3d: X-post phone with verification scan, calendar Nov 1→7, granite drill, reaction meter, Hormuz tanker strait 3D, Qeshm strike, Doha talks) and continue minute by minute through 9:04, reusing scene_mountain for 2:07–2:25.
- 2026-11-05 23:40 Amin: "finish the video, animate practically everything, use the repo". FULL VIDEO NOW BUILT AS 6 lib3d SCRIPTS (06_TOOLS), each one MP4 in 03_AFTER_EFFECTS, all 1920x1080 25 fps, timeline position = VO time + 3.72:
  | file | script | VO range | V2 timeline in |
  | ND_M1_3D_v2.mp4 | m1_3d.mjs | 0–61.00 | 3.72 |
  | ND_A2_3D.mp4 | act2.mjs | 61.00–127.29 | 64.72 |
  | ND_S06_mountain_v1.mp4 | scene_mountain.mjs | 127.29–145.05 | 131.01 (already placed) |
  | ND_A3_3D.mp4 | act3.mjs | 145.05–251.45 | 148.77 |
  | ND_A4_3D.mp4 | act4.mjs | 251.45–359.45 | 255.17 |
  | ND_A5_3D.mp4 | act5.mjs | 359.45–452.35 | 363.17 |
  | ND_A6_3D.mp4 | act6.mjs | 452.35–544.36 | 456.07 |
  Act 2: HUD claim/denial, granite cutaway + GBU-57, 7-day calendar, verification scan, spread network, disbelief cards, Washington↔Tehran, Feb strikes + B-2 photo, Hormuz tankers + Qeshm, Doha threads, chapter 02, Natanz/Pickaxe, Midnight Hammer.
  Act 3: dossier opens, IAEA photo + glass cylinder fills to 440.9 kg, metaballs split into ~10 × 42 kg drops, idle centrifuge hall (no program since 2003, not known to have restarted), three hanging quote notes (15 Oct Newsmax / 2 Nov / Axios 2 Nov election eve), contradictory-signals gauge, subscribe + fact/rumor bins, chapter 03, Hiroshima/Nagasaki torn photos on board, 81-year ribbon (Korea, Vietnam tonnage, Gulf War, levers pulled back), LBJ 1964 note, glass wall (moral/political/military) shatters, domino map.
  Act 4: domino dives (Russia/S.Asia/E.Asia), Carlson claim dashed arcs → "CLAIM · NOT VERIFIED", documents stack, Kremlin photo + Medvedev paraphrase + correction strip, FAS 2025 stockpile bars, missile with 0 launches, rulebook rewritten, May 2025 strikes → Nur Khan 10 km ring, NCA "reportedly convened · Pakistan denied", 8–12 min flight timer, ceasefire + nuclear shadow, Washington cube crosses red line, Taiwan Strait photo + readiness bars, Eisenhower paraphrase, US umbrella dome, one domino wobbles, like CTA + vote bar.
  Act 5: Princeton photo + Plan A card, Europe NATO/Russia, warning shot, ~90 tactical arcs ≈2.6M, strategic arcs 3.4M, 100-block grid 34.1M dead + 57.4M injured = 91.5M, STOP button ignored, one weapon one mountain, proliferation network, chapter 04 THE HUMAN FACTOR, Serpukhov-15 bunker + Petrov lower third, OKO CRT 1→5 launches, KAL 007 tension bar, chain of command + hesitation clock + 5 ≠ 100s, satellite + sun glint FALSE ALARM, 1983→1998.
  Act 6: faster/shorter/higher gauges, 3D Doomsday Clock → 85 s, White House photo + question, no-evidence scan, "totally defeated" PBS paraphrase note, obliterate/Pickaxe pulses, very-unlikely-not-zero dial, wall of 4 bricks (planners/allies/Hiroshima/Petrov CRT), rumor network + hours counter, Nov 7 calendar + verified-facts chip, subscribe/bell + which-domino question, domino run at the abyss stopped by one (pause → WAIT.), end card VERION · STAY ON THE CASE.
  Render: ./render.sh actN.mjs aN FRAMES ; encode command in queue.sh. Stills check: node actN.mjs stills t1 t2 …
- PLACEMENT (when Premiere MCP Bridge panel is open): import the 6 MP4s into ND_ASSETS, overwrite V2 at the times above; delete/disable V3 overlays inside each act range (baked in); keep Amin's own manual changes — check get_timeline_clips first.
- 2026-11-06 PLACED (Claude Code): 6 lib3d MP4s imported to ND_ASSETS and placed on V3 (not V2) so Amin's manual V2 edit stays underneath as fallback: M1 3.72-64.72, A2 64.72-131.00, mountain stays on V2 131.00-148.76, A3 148.76-255.16, A4 255.16-363.16, A5 363.16-456.08, A6 456.08-548.08. V3 was already empty (old overlays gone). Project saved. Bridge note: only one premiere-pro-mcp instance can own port 8097; stale instances from other Claude windows block it (kill them, the live one rebinds within 3 s).
- 2026-11-06 REVISION ROUND (Amin's 21 notes) — rendering now runs LOCALLY on Windows (06_TOOLS): fonts in 06_TOOLS/fonts, grain_*.png via make_grain.mjs, ffmpeg-static, photos copied to 06_TOOLS/photos. Render: `node render.mjs <script> <tag> <frames> <out.mp4> [workers]` (skips frames already rendered; delete a range of frames_<tag>/ PNGs and re-run to re-render only that range). render_all.ps1 renders every act to *_v2.mp4 (M1 → ND_M1_3D_v3.mp4).
  Engine (lib3d): flat map land is a background layer (no more arcs/rings/ships "under the land"); near-plane polygon clipping (big countries no longer vanish at low camera); antimeridian unwrap (Russia streak gone); Scene.group() = whole-object depth sort (solid dominoes); flagSVG/faceSVG/marker{flag}/lower{face,flag,credit}; sharedBorder(); resvg-safety (no fully transparent/offscreen clipped images).
  Assets: 22 flags + 9 portraits from Wikimedia Commons (photos/ND_F_*.png, ND_L_*.jpg, sources in photos/SOURCES_flags_leaders.md + *.json). CC BY/BY-SA credits are printed on screen in the lower thirds.
  Fixed: (2) 2026→1945 back to the earlier Nagasaki counter (frames m1v1/ from ND_MINUTE1_v2.mp4) · (3) folders desk → case-status board + Trump portrait · (4) headline wall → flat aligned grid, slow push · (5) calendar → dates printed on the pages · (7) granite box → mountain cross-section w/ depth ruler, 300 ft line, 30-storey ghost, GBU-57 stops 60 m · (9) Hormuz ships on a checked sea lane (check_lane.mjs), US ship in the Gulf of Oman · (10) dossier → Iran flag print + what-we-know list · (11) centrifuges → assessment timeline (halted 2003 / no active program / restart not known / Iran: peaceful) · (12) subscribe → channel header + cursor click + bell, stories through fact/rumor scanner · (13) Hiroshima/Nagasaki → flat prints, no flicker/tilt · (14) flags + leader portraits throughout · (15) levers → Truman 1950 / Eisenhower 1954 / Kennedy 1962 "considered → pulled back" · (16) rulebook → stone tablet cracks, Moscow's new rule · (17)(19) land layering fixed · (18) ceasefire on the real India–Pakistan border + Washington pressure + nuclear-shadow phase w/ warhead counts · (20) second-order effects on the world map (proliferators light up, rivals launch, launch counter) · (21) domino run = contact chain, solid.
  PENDING: (1)(6)(8) phone scenes — waiting for Amin's iPhone 3D mockup PNG; then re-render m1 frames 0–108 & 1207–1425 and act2 A4/A5 range, re-encode, and swap clips on V3.
- 2026-11-06 06:20 PLACED revision round: V3 now holds ND_M1_3D_v3, ND_A2_3D_v2 (iPhone 18 GLB phones via glbphone.mjs, model in 02_ASSETS/models), ND_A3..A6_3D_v2 at the same positions; mountain clip unchanged on V2. Project saved. Renders: use <=3-5 workers (16 GB RAM; 9 workers got killed for low memory).
