# 25 — Documentary Owner Notes & lib3d Lessons (Nuclear Taboo, Nov 2026)

Everything learned on the 9-minute **Nuclear Taboo** documentary for Verion Story: the owner's review notes
(the most valuable part), the fix that satisfied each one, the general rule behind it, and the technical
pitfalls of the code-rendered 3D pipeline. Code: [`projects/nuclear-domino-documentary/`](../projects/nuclear-domino-documentary/).
Doc 24 is the overview of the drawn style. This doc is the field record. Where they differ, trust this one and the real code.

---

## 1. The owner's taste in 12 rules (apply these BEFORE the first render)

1. **No "AI slop" camera.** No random swoops, tilts or zooms on a wrong axis. Use one slow, motivated push or orbit per shot. Flat material (headlines, photos) gets a flat aligned grid and a gentle push.
2. **Nothing basic.** Landmarks, mountains and props need real detail (architecture, texture, scale cues). A box with a label gets rejected.
3. **Every shot must explain what the VO is saying at that moment.** A pretty 3D scene unrelated to the line gets rejected ("has nothing to do with what is being said").
4. **Use real assets:** real country **flags** next to country names, **portraits** of every leader or person mentioned, the real channel **logo**, and real device mockups. Download them (Wikimedia Commons, with licence JSON) and do not draw substitutes.
5. **Phone mockups must look like the After Effects tutorial standard.** Screen content is locked to the phone's 3D screen surface (perspective-correct, masked, with the camera cutout). Never use a flat 2D card floating over the phone.
6. **Physical correctness:** ships sail on water, missiles and rings never pass under land, objects never sink into the ground, and dominoes rest on each other with real contact.
7. **Solid, not transparent.** Translucent 3D objects read as broken.
8. **No silly metaphors.** Red blobs, levers, crystal balls and "rulebook" props were rejected. Use documented history instead (Truman 1950, Eisenhower 1954, Kennedy 1962 "considered → pulled back").
9. **Animations must explain a process.** "The ceasefire animation is not explaining anything" means showing the real border, the pressure, the line, and what happens next.
10. **Alive, not a picture.** A static mushroom-cloud image was rejected. It has to rise, roll and glow.
11. **No flicker or disappearing elements.** One photo vanishing while another flickers is an instant reject. Use fixed seeds for turbulence.
12. **When a revision is worse, roll back.** "It was better before" means restoring the earlier version exactly (reuse the old frames).

Workflow preferences: fix **per shot** and never redo the whole video. The owner sends screenshots with numbered notes. Reply with what changed per note number, and say honestly whether you only checked stills or watched it play.

---

## 2. Round 1: the 21 notes (verbatim) → fix

| # | Owner's note | Fix that shipped |
|---|---|---|
| 1, 6, 8 | "that phone scene at start i will download iphone 3d mockup use it there and align it well in the phone" / "phone scenes all will change" | Real iPhone GLB rasterized in Node (`glbphone.mjs`). First attempt: an affine overlay, rejected ("wtf is wrong with the iphone screen", "dont you know how to use iphone mockups"). Final: the X post rendered to a texture and mapped onto the GLB's `Front_Screen` mesh with perspective-correct UVs, mips and a z-bias. |
| 2 | "that whole scene didnt convince me it was better before" | Restored the earlier Nagasaki 2026→1945 counter, using the exact frames from the old render. |
| 3 | "this also suck so bad" (folders desk) | Case-status board: confirmed plan NONE / official announcement NONE / "said he would not do it", plus an official portrait. |
| 4 | "the zoom and camera movement was ai slop" (headline wall) | Flat aligned grid, one slow push. |
| 5 | "the way the calendar moved papers and numbers still visible" | The date is printed on each page, so the number leaves with the page. |
| 7 | "this mountain scene is so basic" | Mountain cross-section: depth ruler, 300 ft (91 m) line, 30-storey building ghost for scale, GBU-57 stops at 60 m. |
| 9 | "these small ships were crossing land not sea" | Real two-way Hormuz traffic lane; every point validated with `check_lane.mjs`. |
| 10 | "this scene also so basic and bad" (dossier) | Torn print of the Iran flag + "what we know" list. |
| 11 | "this 3D scene has nothing to do with what is being said" (centrifuges) | Timeline matching the VO: weapons work halted 2003 / no active programme / restart not known / Iran's "peaceful" position. |
| 12 | "this subscribe silly scene" | Real channel card: cursor clicks Subscribe + bell. Story cards with flags pass a fact/rumour scanner. |
| 13 | "very good but then one image disappeared and the other started flickering and bad zoom axis tilt" | Hiroshima/Nagasaki as flat prints, both stay on screen, no tilt. |
| 14 | "you didnt download flags and use them with country names also leaders and characters mentioned picture" | 22 flags + 9 portraits from Commons: flags on map labels, dominoes and bars; portrait lower thirds with CC credit lines. |
| 15 | "those red things were so silly and bad idea" (levers) | Truman 1950 / Eisenhower 1954 / Kennedy 1962, each "considered → pulled back". |
| 16 | "this also bad" (rulebook) | Stone tablet: "NOBODY GOES FIRST" cracks → "WASHINGTON WENT FIRST". |
| 17, 19 | "missiles and land were weird how they cross under the land" / "the circle went under the land" | Flat map land drawn as a background layer (see §4). |
| 18 | "the ceasefire animation so bad its not explaining anything" | Clashes on the real India–Pakistan border, Washington pressure arrows push the sides apart, the ceasefire line traces the border, then a nuclear-shadow phase with warhead counts. |
| 20 | "why didnt you put the world map with that action missile launches" | Second-order effects on the world map: proliferators light up with flags, rivals launch, a launch counter climbs. |
| 21 | "domino scene was weird with transparent dominos… touching each other weirdly" | Solid dominoes (`S.group` whole-object sort) resting on each other. |

## 3. Round 2 notes → fix

| Owner's note | Fix |
|---|---|
| Channel logo supplied | Real logo clipped into the subscribe-card avatar and the end card (no "VERION" text placeholder). |
| "you didnt fix the dominos look how they are beneath the ground and weird" | Platform moved to a separate background Scene. An exact contact solver bisects each tip angle until domino i's top-front corner touches the back face of i+1. |
| "make the white house better it looks so basic" | `wh3d.mjs`: South Portico (6 columns, Truman balcony, balustrades, steps), window pediments, cornice, roof balustrade, chimneys, colonnade wings, lawn and driveway ring, uplights, a waving US flag. A fountain was removed because it clashed with the text. |
| "this prediction scene sucks" | Ink-filtered paper forecast (WHEN / TARGET / SOURCE / BACKED BY) with a "NOT A PREDICTION" stamp slam. No invented stats (a fake "93% certainty" was removed). |
| "this looks silly and bad" (scenario cubes) | Evidence board: three torn photos (public statements / documented history / expert war games) with pins and red strings converging on a "SCENARIO" tag. |
| "when the camera zoomed in a part from the bottom of missile disappeared weirdly" | Replaced with a real RS-24 Yars photo (CC BY, credited), a slow push and "MISSILES LAUNCHED 0". |
| "this shadow of bomb is silly and looks like a picture not an alive animation" | Procedural mushroom: rising stem, 16 puffs rolling on a torus, condensation ring, ember glow, turbulence with a **fixed seed**. |
| Washington cube / "crosses the line" | World map with Washington and Tehran markers + flags, a red "THE LINE · NO NUCLEAR USE SINCE 1945" barrier, a blue arc stops at the wall, then a dashed ghost path. |
| STOP button | Plan A escalation timeline with an accelerating playhead. A STOP pill follows it, the cursor clicks it 3×, and the label reads "NO RESPONSE". |
| False-alarm satellite with ellipse clouds | Earth limb with a turbulence cloud deck, atmosphere rim, sun, a glint and rays from sun → glint → satellite. Detailed satellite, and an OKO screen showing "5 × LAUNCH" → "SUN GLINT". |

---

## 4. lib3d engine pitfalls (painter's-algorithm SVG 3D)

- **Big faces sort over small objects on them.** Ground slabs, platforms and walls cover things standing on them. Fix: draw ground/platforms in a **separate background Scene `G`** and output `BG + G.out() + S.out()`.
- **Buildings lose facade details behind their own walls.** Wrap the building in `S.group([...], ..., bias)` and put windows and caps at a strong negative z bias (≈ −40 to −50).
- **Map land must be a background layer.** Otherwise arcs, rings and ships sort "under the land".
- **Near-plane clipping:** without it, big countries vanish at low camera angles. **Antimeridian unwrap:** without it, Russia renders as a streak.
- **Whole-object depth sort** (`Scene.group`) is what makes dominoes look solid.
- **resvg safety:** never emit fully transparent or completely off-screen clipped images, because resvg can choke on them.
- **Turbulence filters:** a per-frame seed flickers. Use a fixed seed and animate the geometry instead.
- **Phone screens:** interpolate UVs perspective-correctly (`u/w`, `v/w`, `1/w`) and add a mip chain and a small z-bias so the screen wins over the bezel. An affine mapping visibly swims.
- **Text over captions:** keep on-screen words out of the bottom caption band; delete bottom slogans that duplicate the subtitles.
- Check stills at the exact problem timestamps (`node actN.mjs stills t1 t2…`) before any full render.

## 5. Rendering on a 16 GB PC

- **3–5 workers max.** 9 workers got the render killed for low memory twice. Close **After Effects** during renders; Premiere can stay open.
- 100-frame chunks per child process with `--max-old-space-size=3072`. Long single processes run out of memory.
- `render.mjs` skips frames already on disk, so a killed render resumes for free. To redo one shot, move its frame range to `frames_<tag>_oldN/` (don't delete it; it's your rollback for "it was better before").
- Keep `.bak_vN` copies of a script before each revision round.
- Encode for editing: H.264 High@4.1, GOP 25, `yuv420p`, `+faststart` (see doc 23 for why).

## 6. Premiere MCP handoff

- The bridge uses port **8097**, and only one MCP server instance can own it. A stale copy from another Claude window (for example the desktop app) blocks it: quit that app, or kill its process, then reopen **Window → Extensions → MCP Bridge**.
- Low RAM drops the bridge panel. Ask the owner to reopen it, then check `get_connection_status`.
- Place renders with `import_media` → `overwrite_clip_to_timeline` (trackIndex 2 = V3) → `save_project`. Put new full-frame renders on an **empty track above** the owner's manual edit so their work stays underneath as a fallback.
- `get_timeline_clips` can report `enabled:false` wrongly, so verify with `execute_extendscript`. Its `export_frame` failed; use QE `exportFramePNG` instead.
- Always re-read the timeline before placing, because the owner may have edited by hand in between.

## 7. Editorial rules for geopolitics scripts

- **A scenario, never a prediction.** Label every claim: UNVERIFIED / ON THE RECORD / DOCUMENTED. Paraphrases get no quote marks. Write "reportedly convened, X denied it".
- Never invent numbers or stats for visual effect.
- Credit CC BY/BY-SA images on screen (small line under the lower third) and log each source in a `SOURCES_*.md`.
- Use the VO's own figures, or correct the graphic to the source figure and note the difference.
