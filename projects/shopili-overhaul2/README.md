# Shopili OVERHAUL2 — 117 s 9:16 POS + loyalty ad (Tunisian VO)

Second overhaul of the kinetic-type Shopili ad. Three fixes asked by the client, all solved as reusable systems:

| Problem | Fix | Files |
|---|---|---|
| SFX "sucks" (4 files, same pop everywhere, trailer boom) | Real CC0 recordings from Openverse, audited with earshot, placed from the animation's own cue log, thinned, voice-safe mix, one SFX track | `../../docs/22-real-sfx-earshot-openverse-pipeline.md`, `audit.py`, `sfx_plan.json`, `../../scripts/sfx_mix_from_cues.py`, `ears.py`, `sfx_cues_resolved.json`, `sfx_credits_manifest.json` |
| Subtitles on two lines, and repeating what is already written on screen | `make_subs.py`: greedy one-line chunks (≤ 27 chars, break after `،`, no one-word lines) keeping the karaoke word times; scans the scene scripts for every on-screen text with its life and **hides a chunk when ≥ 50 % of its content words are already on screen** (Arabic normalisation: diacritics/shadda, أ/إ/آ→ا, ة→ه, prefix stems و/ب/ل/ال). 75 chunks → 24 shown, 49 hidden. Subtitle pill opacity expression = 0 when no `SUB_` layer is live | `make_subs.py` |
| Opening was "pure text", video not alive | Fluent Emoji **3D** icons (MIT, github.com/microsoft/fluentui-emoji, 256 px → Real-ESRGAN x4 anime model → 1024 px) with pop / drop / fly entrances, spring bounce, drop shadow and a slow float; an **orbit** of all business icons around the key word and around the logo (sucked into the logo on "من بلاصة وحدة"); coins raining into a money bag on "دخل", money-with-wings flying out on "خرج"; steam on the coffee; drifting dot grid (difference blend) behind every scene | `lib.jsx` (`ico`, `orbit`, `bgPattern`, `aboveBG`, cue log), `s1.jsx` |

## Lessons
- **ExtendScript reserved words**: `o.float` → "Illegal use of reserved word"; AE shows it in a modal that can sit behind
  the terminal and then silently ignores every later `AfterFX.exe -r` call. `ae_dialogs.ps1` lists, captures and
  dismisses hidden AE dialogs.
- A `.value` read on a keyed property returns the value at comp time 0 (often 0 after a pop) — use
  `valueAtTime(t,false)` when you need the settled value.
- Orbits: use an **ellipse expression** (`rx`, `ry`) instead of rotating a parent null, so icons pass above/below a
  wide Arabic word instead of crashing into its ends, and no counter-rotation is needed.
- Openverse anonymous `page_size` > 20 → HTTP 401.
- Openverse "chime" results were synthesized (earshot realness 0.06–0.08) → real glass ping / desk bell instead.
- Logging cues from the motion helpers gave 336 events; thinning by priority leaves 163 sounds, ~14 per 10 s.
