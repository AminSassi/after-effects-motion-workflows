# i-FIX® Duo Automix — IFU-Compliant 9:16 Master (`63.5 s`) & Instagram Reel (`18.0 s`)

**Client:** Syphax Medico Dentaire · **Brand:** i-dental · **Product:** i-FIX® Duo Automix (dual-curing adhesive resin cement, Shade A2)
**Deliverables (`00_COMPS`):**
- `i-FIX_Duo_Master_Reel_Ad_9x16` (`63.5 s`, `1080×1920`, `30 fps`, `245 layers`) — Full French narrated commercial
- `i-FIX_Duo_Reel_Short_18s_9x16` (`18.0 s`, `1080×1920`, `30 fps`, `89 layers`) — High-retention 6-beat Instagram Reel cut

---

## 1. One-Command Rebuild in After Effects MCP

```js
// ae_do eval.run
$.evalFile(new File("C:/Users/PC/.gemini/antigravity/scratch/after-effects-motion-workflows/projects/ifix-duo-dental-ad/build_ifix_duo.jsx"));
return BUILD(); // Builds BOTH 63.5s Master and 18.0s Short Reel in 00_COMPS
```

---

## 2. Project Contents

| File | Purpose |
| :--- | :--- |
| [`build_ifix_duo.jsx`](build_ifix_duo.jsx) | Dual-composition After Effects builder (`BUILD_MASTER_63S` + `BUILD_SHORT_REEL_18S`) with `harmonize3DLayer`, feathered top/bottom studio fades, `popup`, `headline`, and word-timed `caption` pills |
| [`vo_ifix.json`](vo_ifix.json) | `faster-whisper` word-level timestamps extracted from the French voiceover |
| [`blender/build_conforme_textures.py`](blender/build_conforme_textures.py) | Procedural 4K texture generator for the i-FIX® Duo box (`ifix_box_4k_conforme.png`) and dual-barrel syringe label (`ifix_syringe_label_4k_conforme.png`) |
| [`blender/rebuild_conforme_product.py`](blender/rebuild_conforme_product.py) | Blender 5.2 generator for the 8g dual-barrel Automix syringe, 14-stage helical mixer,intra-oral tip, box, and inner insert tray |
| [`blender/setup_7_clean_scenes.py`](blender/setup_7_clean_scenes.py) | 7 standalone `1080×1920` product scenes, including the collision-free 2-stage box extraction in `Scene_02` |
| [`blender/rebuild_clinical_sc11_sc12_ifu.py`](blender/rebuild_clinical_sc11_sc12_ifu.py) | IFU-compliant 3D clinical dental intervention generator (`Scene_11_v2` extra-oral crown intaglio loading & `Scene_12_v3` crown seating + scaler marginal excess removal without unverified tack-cure flash) |

---

## 3. Master Reel Timeline (`63.5 s`)

| Time (`s`) | Storyboard / Clinical Beat | 3D Footage (`1080×1920`) | Headline & Pop-Up Callouts |
| :--- | :--- | :--- | :--- |
| `0.0 – 3.5` | **01: THE HOOK & 02: THE PRODUCT** | `Scene_02_Unboxing_Syringe_Reveal_9x16.mp4` | `TWO PARTS. ONE BOND. / i-FIX® Duo` · `Double polymérisation` |
| `3.5 – 7.2` | **03: THE SYRINGE** | `Scene_08_Macro_Syringe_Branding_Glide_9x16.mp4` | `BASE + CATALYST / Seringue Automix` · `Scellement définitif` |
| `7.2 – 11.2` | **01: THE HOOK (INDICATIONS)** | `Scene_01_Hero_Lineup_Reference_9x16.mp4` | `INDICATIONS PROTHÉTIQUES / Inlays · Couronnes` · `Inlays & Onlays` · `Couronnes & Bridges` |
| `11.2 – 16.0` | **IFU STEP 1 — INTRADOS LOADING** | `Scene_11_v2_Clinical_Step1_Loading_Crown_Automix_9x16.mp4` | `PROTOCOLE IFU · ÉTAPE 1 / Intrados` · `01 Intrados couronne` · `02 Moignon préparé` |
| `15.5 – 20.5` | **IFU STEP 2 — SEATING & EXCESS REMOVAL** | `Scene_12_v3_Clinical_Step2_IFU_Seating_And_Excess_Removal_9x16.mp4` | `PROTOCOLE IFU · ÉTAPE 2 / Insertion` · `03 Mise en place` · `04 Retrait des excès` |
| `20.0 – 25.5` | **05: DUAL CURE (IFU STEP 3)** | `Scene_13_Clinical_Step3_Full_Dual_Cure_Polymerization_9x16.mp4` | `ÉTAPE 3 · DOUBLE POLYMÉRISATION / Dual Cure` · `Light cure 10–30 s (20–30 s/face)` · `Self cure 3–4 min` |
| `25.0 – 29.8` | **06: THE BOND** | `Scene_05_Syringe_360_Showcase_9x16.mp4` | `ADHÉSION UNIVERSELLE / Strong bond.` · `01 Dentine & Émail` · `02 Intrados prothétique` |
| `29.8 – 34.5` | **MECHANICAL STRENGTH** | `Scene_08_Macro_Syringe_Branding_Glide_9x16.mp4` | `RÉSISTANCE À LA FLEXION / 115,4 MPa` · `115,4 MPa` |
| `34.5 – 39.2` | **PRECISION FILM THICKNESS** | `Scene_03_Tip_Locking_Assembly_9x16.mp4` | `PRÉCISION D'ASSISE / Film 8,8 µm` · `Épaisseur 8,8 µm` |
| `39.2 – 43.2` | **RADIOPACITY & SHADE A2** | `Scene_01_Hero_Lineup_Reference_9x16.mp4` | `CONTRÔLE CLINIQUE / Radio-opaque` · `Radio-opacité` · `Teinte universelle A2` |
| `43.2 – 48.2` | **04: THE AUTOMIX 1:1** | `Scene_09_Macro_Helical_Mixer_CloseUp_9x16.mp4` | `SYSTÈME AUTOMIX 1:1 / Automix. 1:1.` · `Mélange homogène` |
| `48.2 – 52.8` | **EXTRUSION MACRO** | `Scene_04_Automix_Dispensing_Macro_9x16.mp4` | `APPLICATION DIRECTE / Zéro bulle` · `Application directe` |
| `52.8 – 57.5` | **07: KIT CONTENTS** | `Scene_10_Macro_Packaging_And_Tips_Sweep_9x16.mp4` | `CONDITIONNEMENT COMPLET / Kit Automix` · `1 Seringue 8 g` · `×10 Embouts Automix` · `×10 Embouts Intra-oraux` |
| `57.5 – 63.5` | **08: END CARD (SYPHAX CTA)** | `Scene_07_Full_Kit_Outro_9x16.mp4` + `syphax_logo_crisp.png` | `i-FIX® Duo Automix` · `DISPONIBLE CHEZ Syphax Medico Dentaire` |

---

## 4. Short Instagram Reel Timeline (`18.0 s`)

| Beat | Time (`s`) | 3D Footage | Headline & Pop-Up Callouts |
| :--- | :--- | :--- | :--- |
| **01 — Hook** | `0.0 – 3.0` | `Scene_02_Unboxing_Syringe_Reveal_9x16.mp4` | `TWO PARTS. ONE BOND. / i-FIX® Duo` · `Double polymérisation` |
| **02 — Automix 1:1** | `3.0 – 6.0` | `Scene_09_Macro_Helical_Mixer_CloseUp_9x16.mp4` | `BASE + CATALYST · HÉLICE 14 ÉTAGES / Automix 1:1` · `Mélange homogène 1:1` |
| **03 — IFU Step 1** | `6.0 – 9.0` | `Scene_11_v2_Clinical_Step1_Loading_Crown_Automix_9x16.mp4` | `PROTOCOLE IFU · ÉTAPE 1 / Intrados` · `01 Enduction intrados` |
| **04 — IFU Step 2** | `9.0 – 12.0` | `Scene_12_v3_Clinical_Step2_IFU_Seating_And_Excess_Removal_9x16.mp4` | `PROTOCOLE IFU · ÉTAPE 2 / Strong bond.` · `02 Retrait des excès` |
| **05 — IFU Step 3** | `12.0 – 15.0` | `Scene_13_Clinical_Step3_Full_Dual_Cure_Polymerization_9x16.mp4` | `PROTOCOLE IFU · ÉTAPE 3 / Dual Cure` · `Light cure 20–30 s` · `Self cure 3–4 min` |
| **06 — End Card** | `15.0 – 18.0` | `Scene_07_Full_Kit_Outro_9x16.mp4` + `syphax_logo_crisp.png` | `i-FIX® Duo / Reliable care inside.` · `DISPONIBLE CHEZ Syphax Medico Dentaire` |

---

## 5. Key Lessons Learned
See [`docs/21-clinical-dental-3d-and-ifu-compliance.md`](../../docs/21-clinical-dental-3d-and-ifu-compliance.md) for the full technical post-mortem.
