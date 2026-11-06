# 22 — Real SFX Pipeline: Openverse + earshot + real-sfx rules 🔊

How to give an After Effects film a sound design made of **real recordings**, timed from the animation itself and
checked by measurement, not by guessing. Built and proven on the Shopili OVERHAUL2 ad (117 s, 9:16, Tunisian VO).

Sources this doc distils (vendored as submodules, read them for the full detail):
- **earshot** — "ears for coding agents" (`vendor/earshot`, https://github.com/Leonxlnx/earshot): describe / match /
  rank / find / realness / timeline / critique a sound or a whole mix on CPU.
- **real-sfx** skill — Clipwing (`vendor/clipwing-skills/skills/real-sfx`,
  https://github.com/Clipwing/skills/tree/main/skills/real-sfx): the sound-design rules (real recordings only, event map,
  recipes, voice-safe mixing, thinning, self-critique).
- **Openverse API** — https://api.openverse.org/v1/ : search engine over Freesound, Wikimedia, Jamendo, ccMixter with
  licence metadata. `license=cc0` gives sounds you can ship without credit.

---

## 1. Why the old approach "sucked"

The first Shopili overhaul used 4 files for 22 cues: the same bubble pop on every chip, one cinematic boom, one riser,
one beep. That breaks every rule in doc 06 and in real-sfx:
- **repetition** (one pop everywhere) → instant fatigue;
- **no contact logic** (a coin landing in a bag sounded like a bubble);
- **trailer booms in a product film** (real-sfx blind tests: viewers call long sub drops "off topic" in UI/product films);
- **cues placed by hand** from a script, not from where the motion actually lands.

## 2. The pipeline (5 steps)

```
AE scene scripts ──(cue log)──> cues/*.json ─┐
Openverse CC0 ──(fetch)──> sfx_lib/<role>/ ──(earshot audit)──> audit.json ─┐
                                             └──> sfx_mix.py ──> SFX_TRACK.wav (+ PREVIEW_MIX.wav)
                                                       └──> earshot critique ──> fix ──> AE: one SFX layer
```

### Step 1 — Log cues from the animation itself
Every motion helper writes its own event, so sound follows the picture even after re-timing:
```js
var CUES=[], SCN="";
function cue(t,kind,info){CUES.push('{"t":'+(Math.round(t*1000)/1000)+',"kind":"'+kind+'","scene":"'+SCN+'","info":"'+String(info||"").replace(/"/g,"")+'"}');}
function slam(l,t,o){ cue(t,"slam",l.name); /* ...keys... */ }
function pop(l,t,o){  cue(t,"pop",l.name);  /* ... */ }
// device fly-ins, taps, scans, wipes, count-ups, strikes, cracks, exits all log too
function dumpCues(name){ /* write "[...]" to cues/<name>.json at the end of each build run */ }
```
Layer names in `info` (e.g. `ICO_coin`) let the mixer pick a contextual sound (a coin landing → a real coin drop).
**ExtendScript gotchas found here:** `float` is a reserved word (`o.float` → parse error "Illegal use of reserved word",
shown in a modal dialog *behind other windows* → AE silently stops running `-r` scripts); a regex like `/["\\]/g` that
lost an escape becomes a runtime `SyntaxError`. Keep `ae_dialogs.ps1` around to find and dismiss hidden AE dialogs.

### Step 2 — Fetch real sounds from Openverse
```
python scripts/fetch_openverse_audio.py --out sfx_lib --plan sfx_plan.json
```
- anonymous use works; **`page_size` above 20 returns 401** without a key;
- duration filter is in **milliseconds** (`duration` field); one-shots ≤ 1.5–4 s, risers 1–5 s;
- each file lands in `sfx_lib/<role>/` (folder = role, real-sfx index style) as 48 kHz WAV, with `manifest.json`
  holding title, creator, licence, landing URL for credits.

Plan used for the Shopili ad (23 queries → 78 files):
whoosh ("whoosh swish fast", "swoosh transition"), pop ("pop bubble", "mouth pop"), hit ("punch impact",
"wood knock thud"), click ("mouse click", "button click"), chime, bell ("service bell"), coin ("coin drop"),
cash ("cash register"), scan ("barcode scanner beep"), printer ("receipt printer"), paper ("paper rip tear",
"paper slide"), riser ("riser swell", "reverse cymbal"), marker ("marker pen scribble"), tick, camera, glass.

### Step 3 — Audit with earshot (you cannot hear: measure)
`sfx_lib/audit.py` (in `projects/shopili-overhaul2/`): per role `api.rank(files, description)` → top 4,
`api.find(file, description)` → the clean trim (start/end, head/tail not cut), `api.realness(file, start, end)`.
Rules applied:
- keep `strong` matches; drop `no match`;
- **reject "likely code-synthesized"** when the brief says real (the Openverse "chimes" were synthesized → replaced by
  a real glass-bottle ping and a real desk bell);
- names lie: "barcode scanner" queries returned nothing usable → used the user's own real beep library.

### Step 4 — Mix from the cue log (`scripts/sfx_mix_from_cues.py`)
Mapping (kind → sound, gain, anchor) — contextual, one family per action:

| Animation event | Sound | Gain | Anchor |
|---|---|---|---|
| word **slam** | rotating short wood/body/table hits | −11 dB | onset on the frame |
| word/icon **drop**, device **fly-in** | rotating whooshes (3 takes) | −15 / −11 dB | **peak** on landing (t + 0.2 / + 0.42) |
| icon/chip **pop** | 2 real mouth pops, varispeed 0/+2/−1/+1 st | −12 dB | onset |
| coin / star icon | real coin drops | −13…−15 dB | onset on landing |
| POS **tap** | real mouse click | −8 dB | peak |
| **scan** beam | real beep | −14 dB | onset |
| strike-through / word **crack** | marker stroke / paper rip | −8 / −7 dB | onset |
| **wipe** / icons sucked into logo | reverse-cymbal riser | −12 / −15 dB | **end** on the cut |
| **logo** reveal | cash-register cha-ching (on-brand for a POS) + short real low hit | −7 / −14 dB | onset |
| kitchen bell / CTA | real desk bell | −5 / −7 dB | onset |
| success states (paid, cheapest, order sent) | real glass ping | −9…−11 dB | onset |
| receipt prints | real receipt printer (1 s) | −15 dB | onset |
| **exit** | short whoosh, only in quiet spots | −20 dB | peak |

Thinning (real-sfx "one sound per significant event, not on every one"): priority order
accent > tap/scan > slam/device > drop/count > pop/fly > exit; min gap 110 ms; max 2 others within ±0.3 s;
exits only when nothing else is within 0.45 s. Shopili: **336 logged events → 163 sounds** (~14 per 10 s, the
reference density incl. music is ~15).

Mix: every source peak-normalised, gains from the table, stereo pan alternating ±0.1…0.35 (accents centred),
**voice-safe duck −3.5 dB under speech** (50 ms RMS gate at −30 dB of the VO peak), SFX bus set **9 LU under the VO**,
−1 dBFS ceiling. Output: `SFX_TRACK.wav` (goes into AE as ONE layer, no 160 audio layers) + `PREVIEW_MIX.wav`.

### Step 5 — Critique and fix
`python projects/shopili-overhaul2/ears.py critique PREVIEW_MIX.wav` (earshot without ffprobe: patches its two ffprobe
calls with soundfile). First pass on Shopili: everything in range except **nearly mono** (side −25.9 dB) and
**thin sub** → added panning and one short (≈0.5 s) real low hit under logo + CTA. Integrated loudness lands at
−16.5 LUFS with the VO peaks; master to −14 LUFS on export.

## 3. Install notes (Windows)
- earshot: `python -m venv .venv`, `pip install torch --index-url https://download.pytorch.org/whl/cpu`,
  `pip install -e earshot[mcp,llm] imageio-ffmpeg`. Needs `ffmpeg` and `ffprobe` on PATH for mp3/mp4; for WAV-only work
  use `ears.py` (soundfile patch). `imageio-ffmpeg` ships ffmpeg (copy it as `ffmpeg.exe` into a PATH folder).
- First model load is 20–60 s; batch many calls in one Python process (`from earshot import api`).

## 4. Checklist
1. Cue log written by the motion helpers (never hand-typed times).
2. Library: real recordings, per-role folders, licence manifest.
3. earshot audit: strong match + real + clean trim for every file you use.
4. Contextual mapping, rotation of takes, varispeed on repeats, thinning.
5. Voice-safe ducking, SFX 8–10 LU under the VO, −1 dBTP ceiling.
6. earshot critique → fix the flagged items → one SFX layer in AE.
