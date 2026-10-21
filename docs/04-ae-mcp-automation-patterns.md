# 04 — After Effects ExtendScript & Automation Patterns ⚙️💻

This document details battle-tested patterns for automating Adobe After Effects via ExtendScript, batch execution, and headless automation.

---

## 1. Batch Execution & Architecture

When automating composition assembly or keyframing programmatically:
- **Wrap Operations in an Undo Group**:
  ```javascript
  app.beginUndoGroup("Batch Scene Build");
  try {
      // Scene generation logic
  } catch(e) {
      alert("Error: " + e.toString());
  } finally {
      app.endUndoGroup();
  }
  ```
- **Null Controller Architecture**:
  Never animate positional drift directly on complex shape groups or pre-comp layers if they need secondary motion.
  - Create a 2D or 3D Null Layer (`Master_Cam_Null` or `Hero_Anchor`).
  - Parent the visual components (`Card_BG`, `Card_Text`, `Card_Icon`) to the Null.
  - Apply the master camera push / rotation drift to the Null while keeping individual layer entrance easing isolated.

---

## 2. Eliminating Black Vignette Borders on Blur Effects

When applying `Fast Blur` or `Gaussian Blur` to adjustment layers or background solids, After Effects by default fades to transparent black at the composition boundaries, causing an ugly dark vignette.

### The Fix:
Always enable **Repeat Edge Pixels**:
```javascript
var blurEffect = layer.property("ADBE Effect Parade").addProperty("ADBE Gaussian Blur 2");
blurEffect.property("ADBE Gaussian Blur 2-0001").setValue(600); // Blurriness
blurEffect.property("ADBE Gaussian Blur 2-0003").setValue(1);   // Repeat Edge Pixels = true
```

---

## 3. Shape Groups vs Bounding Box Centering

Importing SVGs or creating multi-path vector shapes often results in offset anchor points:
```javascript
// Function to center layer anchor point dynamically using sourceRectAtTime
function centerLayerAnchor(layer) {
    var rect = layer.sourceRectAtTime(0, false);
    var newAnchor = [rect.left + rect.width / 2, rect.top + rect.height / 2];
    layer.property("ADBE Transform Group").property("ADBE Anchor Point").setValue(newAnchor);
}
```

---

## 4. Cubic Bezier Easing via ExtendScript

Default After Effects keyframes have linear interpolation. To achieve professional spring and snap curves:
```javascript
function applySnappyEase(prop, keyIndexIn, keyIndexOut) {
    // Fast acceleration (in: 0.1, out: 0.9)
    var easeIn = new KeyframeEase(0, 85);   // 85% influence
    var easeOut = new KeyframeEase(0, 85);  // 85% influence
    
    prop.setInterpolationTypeAtKey(keyIndexIn, KeyframeInterpolationType.BEZIER);
    prop.setTemporalEaseAtKey(keyIndexIn, [easeIn]);
    prop.setTemporalEaseAtKey(keyIndexOut, [easeOut]);
}
```

---

## 5. Clean Scene Layer Stacking & Blending

When composing complex multi-layered scenes:
1. **Background Elements**: Bottom-most layer stack. Use `Screen` or `Add` blend mode for glowing wave ribbons.
2. **Ambient Particles**: Low opacity (`15%–30%`), random drift expressions.
3. **Hero UI Element**: Solid cards, high contrast, clean drop shadow.
4. **Accent Badges**: Offset entrance timing by `+4` to `+8` frames with elastic pop overshoot.
5. **Foreground Text**: Crisp typography with clean tracking and contrast overlays.
