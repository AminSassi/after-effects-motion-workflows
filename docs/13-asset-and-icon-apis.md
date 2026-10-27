# 13 — Asset & Icon APIs for Automated Motion Workflows 🌐📦

A comprehensive guide and reference architecture for integrating free, zero-authentication HTTP APIs into After Effects motion design pipelines. This enables autonomous agents, ExtendScript tools, and motion designers to dynamically discover, fetch, style, and import vector icons, avatars, brand logos, stock textures, and archival imagery without leaving the terminal or editor.

---

## 1. The Core Philosophy: Headless Asset Ingestion

Traditional motion design workflows require tedious manual friction: opening browser tabs, browsing stock websites, downloading files to miscellaneous folders, converting formats, and dragging items into After Effects.

```
┌────────────────────────────────────────────────────────────────────────┐
│                   HEADLESS ASSET PIPELINE MATRIX                       │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Zero API-Key Friction    │ Instant REST endpoints, no signups.      │
│ 2. Deterministic Reproduce  │ Seeded avatars & repeatable photo IDs.   │
│ 3. Native Vector SVGs       │ Infinitely scalable, Collapse Transform. │
│ 4. Single-Command Batch     │ Download 20 scene assets from 1 manifest.│
│ 5. Automated AE Placement   │ ExtendScript auto-centers and safe-fits. │
└────────────────────────────────────────────────────────────────────────┘
```

By decoupling asset acquisition from manual browser operations, scripts and AI agents can build end-to-end motion scenes programmatically from storyboard manifests.

---

## 2. Free API Directory for Motion Designers

The following APIs require **zero registration**, **zero API keys**, and return production-ready vector or high-resolution raster files:

| Provider | Asset Category | Output Formats | Primary Use Case in Motion Graphics |
| :--- | :--- | :--- | :--- |
| **[Iconify](https://iconify.design)** | 200,000+ Vector Icons & Tech Logos | SVG | UI action icons, status badges, tech stack logos |
| **[DiceBear](https://dicebear.com)** | Procedural Avatars & Characters | SVG, PNG, WebP | Customer testimonials, user cards, chat bubbles |
| **[UI-Avatars](https://ui-avatars.com)** | Typographic Monogram Avatars | PNG, SVG | Enterprise SaaS team cards, minimalist profile chips |
| **[Picsum Photos](https://picsum.photos)** | High-Res Stock Photography | JPG, WebP | 9:16 vertical backplates, textures, blurred depth plates |
| **[Wikimedia Commons](https://commons.wikimedia.org)** | Archival & Documentary Imagery | JPG, PNG, SVG | Vox-style documentary cutouts, historical 3D parallax |
| **[QR Server](https://goqr.me/api/)** | Dynamic Vector QR Codes | SVG, PNG | App install CTAs, website links, scannable reel badges |
| **[DummyJSON](https://dummyjson.com)** | Mock Data & Product PNGs | PNG, JSON | E-commerce cards, phone mockups, pricing tier data |

---

## 3. Deep Dive: API Endpoints & Query Syntax

### 3.1. Iconify API (Vector Icons & Brand Logos)
Iconify provides access to 150+ icon libraries (including Lucide, Tabler, Phosphor, Material Symbols, Solar, Remix, and Simple Icons).

- **Search Endpoint**:
  ```http
  GET https://api.iconify.design/search?query=notification&limit=10&prefix=solar
  ```
- **Direct SVG Download**:
  ```http
  GET https://api.iconify.design/{prefix}/{name}.svg?color={hex}&width={px}&height={px}
  ```
- **Examples**:
  - Lucide Shield in Cyan: `https://api.iconify.design/lucide/shield-check.svg?color=%2300E5FF`
  - Solar Bold Bell: `https://api.iconify.design/solar/bell-bold.svg?color=%23FFFFFF`
  - Apple Logo (Simple Icons): `https://api.iconify.design/simple-icons/apple.svg`
  - Stripe Logo (Simple Icons): `https://api.iconify.design/simple-icons/stripe.svg?color=%23635BFF`
  - Figma Logo (Simple Icons): `https://api.iconify.design/simple-icons/figma.svg`

> [!TIP]
> When requesting Iconify endpoints programmatically in Python or Node.js, always pass a standard `User-Agent` header (`Mozilla/5.0 ...`) to prevent Cloudflare bot challenges.

---

### 3.2. DiceBear v9 API (Procedural Avatars & Personas)
DiceBear generates deterministic, consistent avatars based on a `seed` string. The same seed will always produce the identical character design.

- **Endpoint Syntax**:
  ```http
  GET https://api.dicebear.com/9.x/{style}/{format}?seed={seed}&size={px}&radius={0-50}&backgroundColor={hex}
  ```
- **Top Styles for Motion Reels**:
  - `lorelei`: Modern, high-end editorial illustrated portraits (ideal for SaaS client reels).
  - `micah`: Minimalist vector faces with modern pastel aesthetics.
  - `notionists`: Hand-drawn monochrome portraits matching the Notion design aesthetic.
  - `bottts`: Modular robot avatars for AI/automation workflows.
  - `avataaars`: Classic colorful UI persona illustrations.
  - `adventurer`: Stylized illustrated game/creative characters.

- **Key Query Parameters**:
  - `radius=50`: Automatically clips the avatar into a circular badge (ready for UI pill layers).
  - `size=512`: Delivers crisp 512x512 PNG or infinitely scalable SVG.
  - `backgroundColor=b6e3f4`: Sets a solid brand pastel backdrop.

- **Examples**:
  - Editorial SVG Avatar: `https://api.dicebear.com/9.x/lorelei/svg?seed=Alex&radius=50`
  - Tech Robot 512px PNG: `https://api.dicebear.com/9.x/bottts/png?seed=AI_Bot_7&size=512&radius=50`

---

### 3.3. Picsum Photos (9:16 Vertical Stock & Blurred Plates)
Picsum provides high-resolution photography with exact pixel dimension scaling and seed determinism.

- **Exact 9:16 Vertical Video Canvas (1080x1920)**:
  ```http
  GET https://picsum.photos/seed/{seed}/1080/1920
  ```
- **Instant Blurred Depth Plate (No GPU render overhead in AE)**:
  ```http
  GET https://picsum.photos/seed/{seed}/1080/1920?blur=3
  ```
- **Monochrome Archival Base**:
  ```http
  GET https://picsum.photos/seed/{seed}/1080/1920?grayscale
  ```

---

### 3.4. Wikimedia Commons (Vox-Style Archival Assets)
For documentary storytelling, 3D parallax cutouts, and historical explainer reels:
- **Search Endpoint**:
  ```http
  GET https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={query}&gsrlimit=5&prop=imageinfo&iiprop=url|size&format=json
  ```
Returns direct URLs to original high-resolution public domain and Creative Commons photographs.

---

### 3.5. QR Server API (Dynamic App CTAs)
For app release reels or conversion outro screens:
- **Vector SVG QR Code**:
  ```http
  GET https://api.qrserver.com/v1/create-qr-code/?data=https://yourbrand.com&size=800x800&format=svg
  ```

---

## 4. The `fetch_assets.py` Automation Tool

This repository includes a standalone, zero-dependency Python utility located at `scripts/fetch_assets.py`.

### 4.1. Quick CLI Commands

```bash
# 1. Search for icons across 200,000+ vector assets
python scripts/fetch_assets.py search-icons "analytics" --limit 10

# 2. Download an icon as SVG with custom brand color
python scripts/fetch_assets.py icon "solar/shield-check-bold" -o ./assets/shield.svg --color 00E5FF

# 3. Download a tech logo (Figma, Apple, Stripe, GitHub, etc.)
python scripts/fetch_assets.py logo "figma" -o ./assets/figma.svg

# 4. Generate a 512px circular avatar PNG for customer testimonial cards
python scripts/fetch_assets.py avatar "Dr_Elena" --style lorelei --format png --radius 50 -o ./assets/avatar.png

# 5. Fetch a 9:16 vertical background plate (1080x1920)
python scripts/fetch_assets.py photo --seed saas_hero --width 1080 --height 1920 -o ./assets/hero_bg.jpg

# 6. Generate a vector QR code for scene outro CTA
python scripts/fetch_assets.py qr "https://github.com/AminSassi" -o ./assets/qr_cta.svg

# 7. Search and download archival imagery for documentary reels
python scripts/fetch_assets.py wikimedia "Nikola Tesla" --limit 2 -o ./assets/documentary
```

---

## 5. Automated Scene Manifests (Batch Downloading)

When assembling a complete motion reel, define your assets inside a JSON manifest alongside your scene breakdown.

### Example Manifest (`reel-assets.json`):
```json
{
  "project": "saas-launch-reel",
  "assets": [
    {
      "type": "icon",
      "id": "lucide/shield-check",
      "color": "00E5FF",
      "output": "./assets/scene_01_security.svg"
    },
    {
      "type": "logo",
      "brand": "stripe",
      "output": "./assets/scene_02_stripe.svg"
    },
    {
      "type": "avatar",
      "seed": "Sarah_Marketing",
      "style": "lorelei",
      "format": "png",
      "size": 512,
      "radius": 50,
      "output": "./assets/scene_03_testimonial_avatar.png"
    },
    {
      "type": "photo",
      "seed": "clean_desk_tech",
      "width": 1080,
      "height": 1920,
      "blur": 2,
      "output": "./assets/scene_01_bg_plate.jpg"
    },
    {
      "type": "qr",
      "data": "https://getiliner.com",
      "output": "./assets/scene_06_cta_qr.svg"
    }
  ]
}
```

### Run Batch Download:
```bash
python scripts/fetch_assets.py batch ./reel-assets.json
```
All assets are downloaded concurrently with validated directory paths in seconds.

---

## 6. After Effects Import & Layout Automation

Once assets are fetched to disk, use `scripts/import_and_layout_asset.jsx` to import and position them into After Effects automatically.

### ExtendScript Automation Recipe:
```javascript
// Include or evaluate the layout utility
#include "scripts/import_and_layout_asset.jsx";

// Import downloaded vector icon and fit to 380px max bounds at optical center
var iconLayer = importAndLayoutAsset("C:/project/assets/shield.svg", 380);

// Keyframe snappy entrance with spring overshoot
iconLayer.property("Transform").property("Scale").setValueAtTime(0.0, [0, 0, 100]);
iconLayer.property("Transform").property("Scale").setValueAtTime(0.5, [100, 100, 100]);
```

### Essential Vector Handling Rule:
When importing SVGs into After Effects 2024+, always ensure **Continuously Rasterize** (Collapse Transformations) is activated:
```javascript
layer.collapseTransformation = true;
```
This guarantees that when hero icons pop, zoom, or scale up to 300% during camera pushes, edges remain razor-sharp without pixelation.

---

## 7. Licensing & Commercial Distribution Hygiene

| Asset Source | License Type | Commercial Use Allowed | Attribution Required |
| :--- | :--- | :--- | :--- |
| **Lucide / Tabler / Phosphor (Iconify)** | ISC / MIT | ✅ Yes | ❌ No |
| **Simple Icons (Iconify)** | CC0 1.0 Universal | ✅ Yes (Check individual brand guidelines) | ❌ No |
| **DiceBear Avatars** | CC0 1.0 Universal / MIT (Style dependent) | ✅ Yes | ❌ No for CC0 styles (`lorelei`, `bottts`, `shapes`) |
| **Picsum Photos** | Unsplash / Public Domain | ✅ Yes | ❌ No |
| **Wikimedia Commons** | Public Domain / CC-BY-SA | ✅ Yes (Filter by Public Domain) | Check license metadata |
| **QR Server API** | Free Public Service | ✅ Yes | ❌ No |
