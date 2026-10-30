# 21 — 3D Clinical Dental Interventions, IFU Compliance & Hybrid 3D/Flat Reels

Proven on **i-FIX® Duo Automix (i-dental / Syphax Medico Dentaire)** — a dual-curing adhesive resin cement commercial delivered as both a **63.5 s narrated Master Reel** (`i-FIX_Duo_Master_Reel_Ad_9x16`) and an **18.0 s high-retention Instagram Reel cut** (`i-FIX_Duo_Reel_Short_18s_9x16`).

Reference files:
- Dual-comp AE builder → [`projects/ifix-duo-dental-ad/build_ifix_duo.jsx`](../projects/ifix-duo-dental-ad/build_ifix_duo.jsx)
- IFU 3D clinical scene generator → [`projects/ifix-duo-dental-ad/blender/rebuild_clinical_sc11_sc12_ifu.py`](../projects/ifix-duo-dental-ad/blender/rebuild_clinical_sc11_sc12_ifu.py)
- 3D product & packaging builder → [`projects/ifix-duo-dental-ad/blender/rebuild_conforme_product.py`](../projects/ifix-duo-dental-ad/blender/rebuild_conforme_product.py)
- 7 standalone 9:16 scenes (collision-free unboxing) → [`projects/ifix-duo-dental-ad/blender/setup_7_clean_scenes.py`](../projects/ifix-duo-dental-ad/blender/setup_7_clean_scenes.py)

---

## 1. Medical Device IFU Compliance Rule (Critical Before Modeling or Scripting)

For regulated dental and medical devices (Class IIa/IIb cements, liners, composites, bonding agents), **every 3D clinical animation step and on-screen callout must match the manufacturer's official Instructions For Use (IFU)**:

| Clinical Aspect | Common Pitfall / Assumption | Official IFU Rule (`i-dental i-FIX® Duo`) |
| :--- | :--- | :--- |
| **Cement Application Site** | Dispensing cement directly onto the prepared tooth stump in the mouth | Dispense mixed cement from the **Automix syringe tip directly into the internal surface (`intrados`) of the restoration** (crown/inlay/onlay/bridge) extra-orally, then seat onto the prepared tooth |
| **Excess Cement Removal & Curing** | Showing an unverified "2-second LED tack-cure flash" before scraping excess cement | Unless the manufacturer's IFU explicitly specifies a tack-cure window, **do not invent a 2-second tack-cure step** (or clearly label it as a clinical technique tip if distributor-approved). Show **firm seating + immediate marginal excess removal with a dental scaler**, followed by the official IFU light-curing time |
| **Light-Curing Duration** | Generic "10s cure" without surface context | State the exact IFU curing window: **`Light cure 10–30 s` (`20–30 s par face selon notice IFU`)** + **`Self cure 3–4 min`** for deep/opaque zones |

---

## 2. Collision-Free 3D Packaging Extraction (Why Syringes Clip Through Boxes)

### The Problem
When animating a syringe or bottle emerging from a vertical cardboard box (`Scene_02_Unboxing_Syringe_Reveal`), animating `Z` (upward) and `-Y` (forward toward the camera) simultaneously causes the syringe barrel and plunger flanges to **clip straight through the front wall of the box**.

### The 2-Stage Clearance Rule (`setup_7_clean_scenes.py`)
Never translate a product forward (`-Y`) or rotate it until its lowest point (the plunger base) has cleared the top collar of the box (`Z > Z_box_top`):

1. **Stage 1 — Vertical Axial Slide (`f201–f265`)**:
   - Rotate the top box lid open (`Rx` from `0°` to `-115°`).
   - Slide the inner cyan/white cardboard insert tray (`Tray_Insert`) partially up along `+Z` while keeping `X = 0, Y = 0`.
   - Slide the syringe straight up along `+Z` inside the tray channel until the plunger tips clear the box opening.
2. **Stage 2 — Forward Presentation & Hero Turn (`f265–f350`)**:
   - While the box and tray gently descend (`-Z`) into the lower third of the frame, bring the syringe forward (`-Y`) and rotate it into its hero presentation angle.

---

## 3. Three High-Impact Macro Shots for Dental Syringe Ads (`85mm–100mm` Lens)

Adding 2–3 close-up cinematic macro shots between the hook and technical claims dramatically increases perceived production value:

1. **`Scene_08` — Macro Barrel Branding Glide (`85mm`, shallow DoF)**:
   - Camera glides parallel to the dual-barrel syringe body (`Base` + `Catalyst` chambers), racking focus across the crisp 4K printed typography (`i-FIX® Duo Automix`) and the 3-square teal geometric logo.
2. **`Scene_09` — Macro Helical Static Mixer Close-Up (`100mm` macro)**:
   - Extreme close-up of the brown bayonet locking collar and translucent tapered nozzle revealing the **14-stage internal helical mixer** (`Automix 1:1`), paired with storyboard beat `04: THE AUTOMIX`.
3. **`Scene_10` — Macro 45° Kit & Tips Sweep (`85mm`)**:
   - Smooth overhead crane/dolly sweep across the complete kit layout (`8g Syringe` + `10× Automix Tips` + `10× Intra-Oral Tips`), paired with storyboard beat `07: KIT CONTENTS`.

---

## 4. Step-by-Step 3D Clinical Dental Intervention Pipeline in Blender 5.x

Instead of showing only static packaging renders, a high-converting dental product commercial shows **how the product is used clinically step-by-step on teeth** (`rebuild_clinical_sc11_sc12_ifu.py`):

### Anatomical Scene Rig
- **`Gingiva_Arch`**: Smooth sub-d pink gingival ridge (`Base Color #E38C96`, `Subsurface Weight 0.45`, `Roughness 0.28`).
- **`Tooth_Prep_Stump`**: Central molar prepared with a `1.2 mm` circumferential shoulder/chamfer margin and rounded axial walls (`Dentin A2 #EAE0C8`, `Roughness 0.22`).
- **`Tooth_Mesial` & `Tooth_Distal`**: Adjacent anatomical molars framing the intervention site (`Enamel A1 #F7F5F0`, `Coat Weight 0.6`, `Roughness 0.12`).
- **`Ceramic_Crown`**: Translucent zirconia/lithium-disilicate crown with a hollowed internal intaglio (`intrados`) cavity so cement loading is visible when inverted.

### The 3 IFU Clinical Scenes
1. **Step 1 — Extra-Oral Crown Intrados Loading (`Scene_11_v2`, `f2001–f2150`)**:
   - `f2001–f2088`: The ceramic crown is held **inverted (`Rx = 180°`)** in the upper-middle frame so the viewer looks directly into its `intrados` cavity. The Automix syringe + brown mixing tip enters at a `28°` clinical angle and dispenses a creamy A2 resin cement meniscus (`Cement_Pool` scales smoothly from `0.01` to `1.0` inside the intaglio).
   - `f2088–f2112`: The Automix syringe retracts cleanly upward-left.
   - `f2102–f2150`: The cement-loaded crown flips `180°` upright (`Rx: 180° → 0°`) and positions itself directly above the prepared tooth stump.
2. **Step 2 — Firm Crown Seating & Marginal Excess Removal (`Scene_12_v3`, `f2201–f2350`)**:
   - `f2201–f2238`: The crown descends smoothly onto the prepared tooth stump (`Z` translation) under steady occlusal seating pressure.
   - `f2228–f2245`: As the crown reaches full seating, a thin bead of excess cement (`Marginal_Excess_Bead`) expresses around the cervical margin.
   - `f2248–f2335`: A stainless-steel sickle scaler (`Curette_Scaler`) enters from the right, traces the cervical margin from mesial to distal, and cleanly peels away the excess cement ribbon (no 2-second LED flash).
3. **Step 3 — Dual-Cure Polymerization (`Scene_13`, `f2401–f2550`)**:
   - `470 nm` LED curing handpiece (`Dental_Curing_Light`) + volumetric blue light cone (`Dental_Curing_Light_Beam`) sweeps across the buccal, occlusal, and lingual surfaces (`Light cure 10–30 s / 20–30 s par face selon notice IFU`) while an internal cyan/teal polymerization glow (`Self cure 3–4 min`) confirms chemical curing in deep zones beneath the opaque restoration.

---

## 5. Harmonizing 3D Clinical Renders with Flat Minimal Editorial Motion

When combining 3D renders rendered against a studio backdrop (`.mp4`) with flat, minimal editorial UI (`#F9FAFB` background, `Montserrat` typography, white pop-up cards), raw 3D renders can show subtle rectangular borders or tonal contrast clashes.

### The 3-Layer Harmonization Recipe (`build_ifix_duo.jsx`)
1. **Tone & Highlight Harmonization (`harmonize3DLayer`)**:
   - Add `ADBE Brightness & Contrast 2` (`Brightness: +14`, `Contrast: -6`) to lift the 3D studio grey background into the `#F9FAFB` flat background range.
2. **Elliptical Feathered Vignette Mask (`180 px` feather)**:
   - Apply an elliptical mask covering `[70, 190]` to `[W - 70, H - 190]` with `[180, 180]` mask feather on every 3D scene layer so the 3D render's edges dissolve invisibly into the flat `#F9FAFB` canvas.
3. **Top & Bottom Studio Editorial Fades (`addFeatheredSolid`)**:
   - Place two feathered `#F9FAFB` solids at the top (`y = 210, h = 420, feather = 160 px`) and bottom (`y = H - 210, h = 420, feather = 160 px`) right above the 3D footage stack and below the UI stack. This guarantees that top headlines (`y = 148–300`) and bottom word-synced captions (`y = 1525`) always sit over pure, high-contrast studio off-white.

---

## 6. Dual-Format Reel Strategy: `63.5 s Master` + `18.0 s Instagram Short`

A 60+ second narrated commercial is ideal for product pages, distributor presentations, and Facebook/LinkedIn feeds, but **15 to 20 seconds** performs significantly better as an Instagram/TikTok Reel hook.

Always build **both cuts inside the same After Effects project** (`00_COMPS`) from a single `BUILD()` call:
- **`i-FIX_Duo_Master_Reel_Ad_9x16` (`63.5 s`)**: Full 14-scene narrated commercial with complete technical claims (`115.4 MPa`, `8.8 µm` film thickness, indications, conditioning, and Syphax CTA).
- **`i-FIX_Duo_Reel_Short_18s_9x16` (`18.0 s`)**: 6× 3.0-second high-impact beats:
  1. `0.0–3.0 s`: **Hook & Unboxing** (`Two parts. One bond. / i-FIX® Duo`)
  2. `3.0–6.0 s`: **Automix 1:1** (`Base + Catalyst · Hélice 14 étages / Automix 1:1`)
  3. `6.0–9.0 s`: **IFU Step 1 — Intrados** (`Injection directe dans la couronne`)
  4. `9.0–12.0 s`: **IFU Step 2 — Strong bond.** (`Assise ferme & retrait des excès au scaler`)
  5. `12.0–15.0 s`: **IFU Step 3 — Dual Cure** (`Light cure 20–30 s` + `Self cure 3–4 min`)
  6. `15.0–18.0 s`: **Kit & End Card** (`8g Syringe · ×10 Automix · ×10 Intra-Oral` + `Syphax Medico Dentaire`)

---

## 7. New ExtendScript & Blender 5.x Gotchas Learned

1. **ExtendScript `Object is invalid` When Adding Multiple Vector Groups to a Shape Layer**:
   - In After Effects 2025/2026, calling `addEllipse(dot, "core", ...)` on `dot.property("ADBE Root Vectors Group")` **invalidates any previously held `PropertyGroup` reference** (`var ring`) on that same root vector group!
   - **Fix**: Always set expressions (`ADBE Vector Scale`, `ADBE Vector Group Opacity`) on `ring` **before** calling `addEllipse(dot, "core", ...)`.
2. **ExtendScript Locked Layer Removal Error (`Can not call method "remove" on Layer "BG_gradient" because the Layer is locked`)**:
   - Because `bg.locked = true` is set at the end of a build, clearing layers in-place with `comp.layer(1).remove()` throws an exception when it reaches `BG_gradient`.
   - **Fix**: Always run `comp.layer(1).locked = false; comp.layer(1).remove();` when clearing a composition.
3. **Unicode Checkmarks (`"✓"`) Missing in `Montserrat-Bold`**:
   - `Montserrat-Bold` does not contain the Unicode `"✓"` (`U+2713`) glyph, rendering an empty missing-glyph box `□` in After Effects.
   - **Fix**: Use numbered clinical badges (`"01"`, `"02"`, `"03"`, `"04"`) highlighted in `ACC` (`hl: ["01"]`) or draw a native AE vector shape path checkmark.
4. **Blender 5.x `RuntimeError: Error: Keyframe not in F-Curve`**:
   - Calling `fc.keyframe_points.remove(kp)` inside `for kp in list(fc.keyframe_points):` fails in Blender 5.2 because removing a keyframe reallocates the underlying C array and invalidates the remaining Python `Keyframe` wrappers.
   - **Fix**: Either call `fc.keyframe_points.clear()` on the F-Curve, or iterate across the frame range `for f in range(start, end + 1):` and call `obj.keyframe_insert(data_path=..., frame=f)`, which cleanly overwrites existing keyframes in-place.
