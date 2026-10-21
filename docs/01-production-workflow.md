# 01 — End-to-End Production Workflow 🔄

A reproducible, professional workflow for turning client briefs and voiceovers into high-retention 9:16 Instagram Reels and SaaS product launch videos.

```
┌─────────────────┐     ┌──────────────────────┐     ┌─────────────────────┐
│ 1. Brief & Copy │ ──> │ 2. Storyboard & Beats │ ──> │ 3. AE Scene Assembly │
└─────────────────┘     └──────────────────────┘     └─────────────────────┘
                                                                │
                                                                ▼
┌─────────────────┐     ┌──────────────────────┐     ┌─────────────────────┐
│ 6. Repo Log     │ <── │ 5. Render & Review   │ <── │ 4. SFX Sync & Audio │
└─────────────────┘     └──────────────────────┘     └─────────────────────┘
```

---

## Phase 1: Brief & Copywriting
1. **Define the Core Promise**: What does the product solve in one sentence?
2. **Structure the Voiceover (4-Beat Structure)**:
   - **Beat 1: The Hook (0–4s)**: Disrupt the scroll, introduce the central tension.
   - **Beat 2: The Agitation / Problem (4–15s)**: Visualize the friction (spreadsheets, messy files, lost time).
   - **Beat 3: The Solution / Mechanism (15–40s)**: Show the tool in action (clean UI, automated flows, smart search).
   - **Beat 4: The Climax / CTA (40–55s)**: Payoff, transformation, social proof, and call to action.
3. **Dialect & Cadence**:
   - For regional or bilingual audiences (e.g. Tunisian Arabic + French + English tech terms), keep the tone conversational yet authoritative.
   - Match sentence length to visual scene cuts: each visual idea needs minimum **1.5 to 2.5 seconds** of screen time to be comprehended.

---

## Phase 2: Storyboarding
1. Break down the script into numbered scenes (e.g., 10 to 14 scenes for a 45–60s video).
2. For each scene, specify:
   - **Timecode window** (e.g., `00:00 - 00:03.50`).
   - **Visual layout**: Hero asset, supporting cards, typography hierarchy.
   - **Motion intent**: Camera push, card stagger, slide-up reveal, highlight wipe.
   - **Audio / SFX cues**: Keyboard clack, notification ping, whoosh riser, impact thud.
3. Keep the storyboard flexible: treat it as a structural guide, not a rigid constraint. Allow motion design decisions to elevate the narrative.

---

## Phase 3: After Effects Scene Assembly
1. **Master Composition Setup**:
   - Resolution: `1080 x 1920` (9:16 vertical).
   - Frame Rate: `60 fps` for buttery-smooth motion curves and UI animations.
   - Color Space: Rec.709 16-bit or 32-bit float to eliminate gradient banding.
2. **Modular Scene Pre-Comps**:
   - Keep each scene in its own pre-comp (`s01_hook`, `s02_problem`, etc.) or assemble sequentially with clean master control nulls.
   - Use dedicated Camera or Parent Nulls for smooth push-ins (`Scale: 100% -> 106%`, `Position: slight drift`).
3. **Background Layering**:
   - Never leave frame 0 black or static.
   - Use dynamic animated gradient overlays (wiggle + blur + glow) or looping wave ribbons (`Radiant BACKGROUND.aep`).
   - Set blend mode to `Screen`, `Add`, or `Overlay` with opacity between `35%` and `65%`.

---

## Phase 4: Sound Design & Synchronization
1. **Never rely on music alone**: Ambient backing track should sit at `-16dB` to `-18dB`, leaving voiceover clear at `-6dB` to `-3dB`.
2. **Sync on the initial impact frame**:
   - Align UI pop/snap sounds exactly with the first frame of movement or when the easing curve peaks.
   - Match keyboard typing sounds to text character animators.
   - Pair mouse clicks with button depress states.
3. **SFX Diversity Rule**:
   - Never use the same generic pop sound more than twice in a row.
   - Alternate between soft swooshes, wooden/mechanical clicks, paper unfolds, sub-bass drops, and crystalline chimes.

---

## Phase 5: Export & Color Grading
1. Check for edge bleed and transparency artifacts.
2. In Fast Blur or Gaussian Blur effects on adjustment layers, ensure `Repeat Edge Pixels` is enabled to eliminate dark vignette borders.
3. Render via Adobe Media Encoder using H.264 (CBR or VBR 2-pass at 25–35 Mbps) with AAC audio at 320 kbps.

---

## Phase 6: Knowledge Loop & Git Logging
1. Identify any new expressions, workflow speedups, or bug fixes developed during the project.
2. Record the script, storyboard, and SFX cue sheet under `projects/`.
3. Commit and push the updates back to this repository.
