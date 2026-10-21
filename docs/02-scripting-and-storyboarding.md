# 02 — Scripting & Storyboarding 📝🎨

Effective motion reels start with a bulletproof script and a dynamic storyboard. Here are the principles and techniques refined across our production projects.

---

## 1. The 4-Beat Pacing Formula

For 45-to-60 second tech reels:

| Beat | Duration | Goal | Visual Language |
| :--- | :--- | :--- | :--- |
| **1. Hook** | 0s – 4s | Disrupt scrolling; introduce pain or intrigue. | High-contrast kinetic typography, clean hero product teaser, sound punch. |
| **2. Problem** | 4s – 16s | Agitate pain points, show chaos/disorganization. | Red alert tags, messy spreadsheets, slow manual processes, floating chaos cards. |
| **3. Solution** | 16s – 40s | Present the product as the effortless antidote. | Seamless UI walk-through, auto-sorting cards, glowing search bars, instant success badges. |
| **4. Payoff & CTA**| 40s – 55s | Celebrate results, reinforce brand identity, invite action. | Centered brand logo lockup, glowing badges, clear website URL / direct bio link prompt. |

---

## 2. Bilingual Dialect Scripting (e.g., Tunisian Arabic + French Tech Jargon)

When writing for multilingual or regional audiences:
- **Natural Conversational Flow**: Avoid overly formal phrasing that sounds like a dry commercial. Use real spoken rhythm (e.g. Derja mixed with tech terms like *Plateforme, Dashboard, Notifications, Suivi en temps réel*).
- **Phonetic & Timing Alignment**: Technical English or French words spoken in Arabic sentences often take slightly longer or shorter to enunciate. Always record or test scratch voiceover before timing AE keyframes.
- **The 1.5-Second Reading Rule**: Every text overlay or card on screen must remain legible for at least `(Word Count / 3) + 1.2` seconds. For mobile reels, never flash a key headline for less than 1.5 seconds.

---

## 3. Storyboard Execution Guidelines

- **Storyboard as a Blueprint, Not a Prison**:
  - The storyboard sets the narrative arc, visual assets, and message hierarchy.
  - Motion designers must introduce secondary micro-animations (subtle particle drifts, floating physics, optical glow pulses) to elevate the static frames into cinematic moments.
- **Scene Numbering Standard**:
  - Name scenes consistently: `s01_hook`, `s02_problem_chaos`, `s03_manual_bottleneck`, etc.
  - Maintain an explicit layer map for each scene:
    1. `Background` (Animated gradient / Radiant loop)
    2. `Atmosphere` (Glow particles, grid, subtle noise)
    3. `Hero Asset / UI Card` (Parented to Hero Null)
    4. `Floating Badges & Tags` (Secondary stagger delay: +4 to +8 frames)
    5. `Kinetic Text` (Primary title + secondary subtitle)
    6. `Master Scene Camera / Push Null`
