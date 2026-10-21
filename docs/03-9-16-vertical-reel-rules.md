# 03 — 9:16 Vertical Reel Guidelines & Safe Zones 📱📐

Creating motion design specifically for vertical platforms (Instagram Reels, TikTok, YouTube Shorts) requires strict attention to mobile user interfaces and ergonomic viewing habits.

---

## 1. Frame Dimensions & Aspect Ratio

- **Standard Dimensions**: `1080 x 1920 px`
- **Aspect Ratio**: `9:16`
- **Frame Rate**: `60.0 fps` (smooth UI transitions, high temporal resolution)
- **Pixel Aspect Ratio**: Square Pixels (`1.0`)

---

## 2. The Danger Zones (Instagram / TikTok UI Overlays)

Vertical platforms place native interactive elements over your video. Content placed in these areas will be covered by icons, usernames, captions, and system bars:

```
┌─────────────────────────────────────────┐
│        TOP SAFE ZONE (0 - 270px)        │  <- 14% Buffer (Profile info, camera, status bar)
│                                         │
├─────────────────────────────────────────┤
│                                         │
│                                         │
│                                         │
│            ACTIVE SAFE ZONE             │
│            (270px - 1536px)             │
│                                         │
│       All headlines, key UI mockups,    │
│       logos, and critical visual cues   │
│            MUST live inside here.       │
│                                         │
│                                         │
├───────────────────────────────┬─────────┤
│                               │  RIGHT  │  <- 12% Buffer (130px)
│   BOTTOM SAFE ZONE            │  BAR    │     (Like, comment, share, sound disc)
│   (1536px - 1920px)           │         │
│   (Captions, sound title,     │         │
│    username, CTA pill)        │         │
└───────────────────────────────┴─────────┘
```

### Exact Safe Zone Bounds:
- **Top Safe Margin**: Minimum **270 px** (14%) from the top edge.
- **Bottom Safe Margin**: Minimum **384 px** (20%) from the bottom edge.
- **Right Margin**: Minimum **130 px** (12%) from the right edge for interactive action icons.
- **Left Margin**: Minimum **60 px** from the left edge.

---

## 3. Centering & Visual Anchoring

- **The Dead-Center Trap**: While the geometric center of the canvas is `(540, 960)`, the **optical center** for mobile phone viewers sits slightly higher, around `Y = 880 to 920 px`, because the thumb and bottom overlay draw user attention upward.
- **`sourceRectAtTime()` Expression for True Centering**:
  When centering text or logos dynamically in After Effects, use an Anchor Point expression to account for font descenders and variable text length:
  ```javascript
  // Apply to Layer Anchor Point
  var rect = thisLayer.sourceRectAtTime(time, false);
  [rect.left + rect.width / 2, rect.top + rect.height / 2];
  ```
  Then set the layer Position to:
  ```javascript
  [thisComp.width / 2, thisComp.height / 2];
  ```

---

## 4. Mobile Readability Checklist (The 360px Inspection)

1. **Scale Down Test**: Zoom out the After Effects composition viewer to **25%** or preview on a real mobile device at 360px logical width.
2. **Contrast Ratio**: White text (`#FFFFFF`) against dark background gradients must have a contrast ratio of at least **4.5:1**.
3. **Drop Shadows**: Avoid heavy, dirty black drop shadows. Use subtle, soft ambient occlusion shadows:
   - Shadow Color: `rgba(0, 0, 0, 0.35)`
   - Blur / Size: `40 - 60 px`
   - Distance: `10 - 20 px`
   - Angle: `90°` (straight down)
