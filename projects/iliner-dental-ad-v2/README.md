# i-LINER Dental Ad v2 — Clean Minimal 9:16 (Oct 2026)

**Client:** Syphax Medico Dentaire · **Brand:** i-dental · **Product:** i-LINER (light-curing compomer liner)
**Deliverable:** `iLINER_Ad_Final_9x16.mp4` — 58 s, 1080×1920, 60 fps, H.264 15 Mbps + AAC VO
**Built with:** After Effects 2026 (26.3) via AE MCP `eval.run` + [`dental_product_ad_builder.jsx`](../../scripts/dental_product_ad_builder.jsx)

Supersedes `projects/iliner-dental-reel-9-16` (v1, 6-scene reel).

## Rebuild

```js
// ae_do eval.run
var R = 'C:/path/to/after-effects-motion-workflows/';
$.evalFile(new File(R + 'scripts/dental_product_ad_builder.jsx'));
$.evalFile(new File(R + 'projects/iliner-dental-ad-v2/ad_config.jsx'));
IMPORT_ASSETS(CFG);
return BUILD_AD(CFG);
```

## Contents

| File | Purpose |
|---|---|
| `ad_config.jsx` | 14 scenes, 3 headlines, 14 pop-up cards, 34 caption chunks, end card |

## Timeline

| Time | Beat | Shot | Graphics |
|---|---|---|---|
| 0.0–3.3 | Identity | v3_01 box hero | "i-LINER" headline |
| 3.3–13.9 | What it is | label macro, tray slide, top-down | Photopolymérisable · Type compomère · Durabilité |
| 13.9–20.2 | Formulation | syringe hero, barrel | Résines composites + Verre ionomère |
| 20.2–27.3 | Properties | syringe orbit, exploded tooth | "Spécifiques" · Radio-opacité · Dentine |
| 27.3–28.9 | Question | — (type only) | "Indications ?" |
| 28.9–39.8 | Indications | application, 12a/b/c teeth | 01 Composites · 02 Amalgame · 03 Porcelaine |
| 39.8–51.2 | Usage modes | liner floor, full coat | 1 Liner classique · 2 Revêtement complet · Répartition des contraintes |
| 51.2–58.0 | CTA | box turntable (held) | Disponible chez · Syphax logo · phones |

## Lessons from this build
See [docs/19-dental-product-ad-workflow.md §5](../../docs/19-dental-product-ad-workflow.md#5-lessons--gotchas-read-before-the-next-product).
Key ones: no drop shadow on translucent teeth, brighten old tooth renders, keep headlines off syringe shots,
Whisper for timings only (brand names mis-heard), `applicator_tip_reference.jpg` in the client folder is corrupt.

## Open items flagged to client
- Phone numbers taken from the shop banner photo — confirm.
- "Visible en radiographie" subtitle under Radio-opacité is our wording (not in the VO script).
