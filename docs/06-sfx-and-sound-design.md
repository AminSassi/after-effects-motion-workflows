# 06 — Sound Design & The 18-Piece SFX Palette 🔊🎧

Sound design is 50% of the viewer's perceived production quality. A reel with stock music alone feels sterile. Synchronized, tactile audio cues ground abstract digital animations in physical reality.

---

## 1. The Cardinal Rule: Avoid Repetitive SFX Fatigue

- **The Pop Spam Trap**: Using the same wooden bubble pop on every text card, button reveal, and transition creates instant monotony and cheapens the video.
- **The Solution: Contextual Sound Assignment**:
  Different UI actions must have distinct acoustic textures:
  - Text typing -> Mechanical keyboard clacks.
  - Buttons / Switches -> Crisp tactile mouse clicks or soft thuds.
  - Cards sliding in -> Velvet paper rustle or low air whooshes.
  - Status success / Checkmarks -> Delicate glass bell or crystalline chime.
  - Major scene changes -> Atmospheric sub-drop or cinematic riser.

---

## 2. The 18-Piece SFX Production Palette

Our curated SFX library structure for SaaS reels (sourced from `#D:\Work\EDITS\Some assets`):

| Category | Sound Name | Acoustic Character | Primary Use Case |
| :--- | :--- | :--- | :--- |
| **Tactile & Paper** | `Fast paper rustle 1` | Crisp parchment slide | Rapid card carousel / quick swipe |
| | `Fast paper rustle 2` | Snappy folder fold | Secondary card transitions |
| | `Paper rustle 1` | Natural document slide | Document upload / spreadsheet appearance |
| | `Paper rustle 2` | Heavier card stock rustle | Detailed report / contract reveal |
| **Mechanical & UI** | `Keyboard enter` | Decisive mechanical switch | Form submit / search query execution |
| | `Single keyboard type 1` | Cherry MX Blue click | First character input |
| | `Single keyboard type 2` | Soft mechanical clack | Variable character typing cadence |
| | `Single mouse click` | Precise omron microswitch | Button click / link activation |
| | `Heavy mouse click` | Weighted desktop mouse click | Primary CTA press / modal confirmation |
| | `Switch click` | Crisp toggle click | Light/dark mode toggle / filter switch |
| **Motion & Swells** | `Air whoosh` | Light, breathy passing air | Subtle floating badge arrival |
| | `Fast swoosh 1` | Sharp high-frequency whip | Fast slide-in from canvas edge |
| | `Fast swoosh 2` | Aerodynamic dart whoosh | Metric counter swipe |
| | `Clean low sub whoosh` | Deep bass transition | Scene-to-scene master camera wipe |
| **Tonal & Impacts** | `Soft bass boom` | Warm low-end 60Hz punch | Major hook impact / logo reveal |
| | `UI notification bell` | Bright glass sine chime | New task assigned / notification toast |
| | `Success check chime` | Ascending harmonic interval | Goal reached / invoice paid badge |
| | `Pencil scribble` | Tactile graphite on paper | Signature field / note-taking mockup |

---

## 3. Synchronization Rules (Sub-Frame Timing)

1. **Pre-Roll Leading Cues**:
   - For fast whooshes or risers, start the audio cue **2 to 4 frames before** the visual card lands on screen. The audio crescendo should peak exactly on the contact frame.
2. **Impact Alignment**:
   - Clicks, clacks, and booms must align with the exact frame the visual element reaches scale 100% (or the apex of its overshoot).
3. **Decay Separation**:
   - Leave breathing room between heavy acoustic hits. If a typewriter sequence triggers 4 clacks, keep the volume lower (`-12dB`) so it doesn't mask the voiceover.
