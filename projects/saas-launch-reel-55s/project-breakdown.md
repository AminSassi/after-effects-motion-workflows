# Project Breakdown: 55.5s SaaS Launch Reel 🚀

A comprehensive case study of the production, motion direction, background iteration, sound design, and After Effects assembly for our flagship 55.5-second vertical SaaS launch reel.

---

## 1. Project Specs

- **Client / Product**: PG Pro Archives (SaaS Archiving & Document Management Platform)
- **Format**: 9:16 Vertical (`1080 x 1920 px`)
- **Frame Rate**: `60.0 fps`
- **Total Duration**: `55.50 seconds` (3330 frames)
- **Audio Language**: Tunisian Arabic (Derja) + French & English Tech Terminology
- **Voiceover Character**: Conversational, dynamic, problem-solver cadence
- **Primary Tooling**: Adobe After Effects 2025, ExtendScript, Media Encoder

---

## 2. Iteration Milestones & Creative Breakthroughs

### Milestone 1: The Hook Exploration
- Initial brief called for a gripping opening to stop mobile scroll immediately.
- Explored dynamic typography reveals with scale-up impacts.
- Decided on clean, high-contrast dark aesthetic with glowing purple/cyan accents rather than flat vectors.

### Milestone 2: Background Evolution
- **The Problem**: Initial solid gradients felt flat and static behind moving UI elements.
- **The Solution**: 
  - Integrated the user's custom animated gradient overlay technique (`wiggle(1, 50)` on circular shape emitters, combined with `Gaussian Blur 600`, `Glow`, and monochromatic noise).
  - Merged ribbon assets from `Radiant BACKGROUND.aep` using `Screen` blending mode, harmonized with purple/cyan brand ramps.
  - Resolved blur edge clipping by explicitly enabling `Repeat Edge Pixels: true`.

### Milestone 3: Eliminating SFX Pop Fatigue
- Early cut overused the generic UI bubble pop, causing auditory monotony.
- Restructured audio with an 18-piece tactile sound palette:
  - Text inputs tied to mechanical keyboard clicks and typing sequences.
  - Quick card transitions tied to fast paper rustles.
  - Buttons and switches tied to tactile mouse clicks.
  - Outro payoff tied to a deep, warm sub-bass boom.

### Milestone 4: Outro Lockup & Safe Zone Polishing
- Re-centered the PG Pro Archives brand mark using dynamic anchor point calculations (`sourceRectAtTime`).
- Removed solid black box bounding artifacts by switching blend modes and applying opacity masks.
- Verified all text and CTAs safely sat inside the mobile active viewing area (`Y: 270px - 1536px`).

---

## 3. Key Takeaways for Future Videos

1. **Keep Background Motion Continuous**: Even during static UI pauses, background gradients or wave ribbons should subtly breathe to keep viewer engagement high.
2. **Audio Pre-Roll**: High-frequency whooshes hit hardest when they precede visual contact by 2 to 4 frames.
3. **Keep Scenes Modular**: Structuring each scene as an isolated pre-comp allows rapid client revision without breaking timeline downstream keyframes.
