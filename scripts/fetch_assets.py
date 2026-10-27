#!/usr/bin/env python3
"""
fetch_assets.py — Headless Asset & Icon Fetcher for After Effects Motion Workflows
Authored for After Effects Motion Workflows by Amin Sassi.

A zero-dependency CLI and Python module to search, fetch, and download:
- Vector Icons (Iconify: Lucide, Tabler, Phosphor, Material, etc.)
- Brand & Tech Logos (Simple Icons via Iconify: Apple, Stripe, Figma, GitHub, etc.)
- Avatars & Personas (DiceBear v9 & UI-Avatars: Lorelei, Micah, Bottts, Notionists, etc.)
- High-Res Stock Backgrounds & Textures (Picsum Photos: 9:16 vertical & 16:9 plates)
- Documentary & Archival Imagery (Wikimedia Commons API)
- Scannable QR Codes (QR Server API: SVG and high-res PNG)
- Batch Asset Manifests for automated scene assembly.

Usage examples:
  python fetch_assets.py search-icons "security"
  python fetch_assets.py icon "lucide/shield-check" -o ./assets/shield.svg --color 00E5FF
  python fetch_assets.py logo "figma" -o ./assets/figma.svg
  python fetch_assets.py avatar "Alex Rivera" --style lorelei --format png --size 512 -o ./assets/avatar.png
  python fetch_assets.py photo --seed tech916 --width 1080 --height 1920 -o ./assets/bg_reel.jpg
  python fetch_assets.py qr "https://getiliner.com" -o ./assets/qr_cta.svg
  python fetch_assets.py batch ./manifest.json
"""

import sys
import os
import json
import argparse
import urllib.request
import urllib.parse
from pathlib import Path

USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 MotionWorkflowsBot/1.0"


def make_request(url: str) -> bytes:
    """Perform HTTP GET request with appropriate browser user agent."""
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=15) as response:
        return response.read()


def save_bytes(data: bytes, output_path: str) -> Path:
    """Save raw bytes to a file, creating parent directories if necessary."""
    p = Path(output_path).resolve()
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_bytes(data)
    print(f"Saved: {p} ({len(data):,} bytes)")
    return p


# ---------------------------------------------------------------------------
# 1. ICONIFY: VECTOR ICONS & TECH LOGOS
# ---------------------------------------------------------------------------

def search_icons(query: str, limit: int = 20, prefix: str = None) -> list:
    """Search over 200,000 vector icons on Iconify."""
    params = {"query": query, "limit": limit}
    if prefix:
        params["prefix"] = prefix
    url = f"https://api.iconify.design/search?{urllib.parse.urlencode(params)}"
    data = json.loads(make_request(url).decode("utf-8"))
    icons = data.get("icons", [])
    return icons


def fetch_icon(icon_id: str, output_path: str = None, color: str = None, size: int = None) -> Path:
    """
    Fetch an SVG icon from Iconify.
    icon_id can be in 'prefix:name' or 'prefix/name' format (e.g. 'lucide:bell' or 'simple-icons/apple').
    """
    normalized_id = icon_id.replace(":", "/")
    if "/" not in normalized_id:
        # Default to Lucide if prefix omitted
        normalized_id = f"lucide/{normalized_id}"

    params = {}
    if color:
        # Hex color: ensure clean format without '#'
        clean_color = color.lstrip("#")
        params["color"] = f"#{clean_color}"
    if size:
        params["width"] = size
        params["height"] = size

    query_str = f"?{urllib.parse.urlencode(params)}" if params else ""
    url = f"https://api.iconify.design/{normalized_id}.svg{query_str}"

    if not output_path:
        safe_name = normalized_id.replace("/", "_")
        output_path = f"./assets/icons/{safe_name}.svg"

    svg_data = make_request(url)
    return save_bytes(svg_data, output_path)


def fetch_logo(brand: str, output_path: str = None, color: str = None) -> Path:
    """Fetch an official brand / tech vector logo from Simple Icons via Iconify."""
    clean_brand = brand.lower().strip().replace(" ", "-")
    icon_id = f"simple-icons/{clean_brand}"
    if not output_path:
        output_path = f"./assets/logos/{clean_brand}.svg"
    return fetch_icon(icon_id, output_path=output_path, color=color)


# ---------------------------------------------------------------------------
# 2. DICEBEAR & UI-AVATARS: AVATARS & PERSONAS
# ---------------------------------------------------------------------------

DICEBEAR_STYLES = [
    "lorelei",
    "lorelei-neutral",
    "micah",
    "notionists",
    "notionists-neutral",
    "bottts",
    "bottts-neutral",
    "avataaars",
    "avataaars-neutral",
    "adventurer",
    "adventurer-neutral",
    "open-peeps",
    "personas",
    "big-smile",
    "shapes",
    "thumbs"
]

def fetch_avatar(
    seed: str,
    style: str = "lorelei",
    output_format: str = "svg",
    size: int = 512,
    radius: int = 50,
    bg_color: str = None,
    output_path: str = None
) -> Path:
    """
    Fetch a procedural persona or avatar badge from DiceBear v9 HTTP API.
    Deterministic: the same seed always generates the exact same visual identity.
    """
    params = {
        "seed": seed,
        "radius": radius,
        "size": size
    }
    if bg_color:
        params["backgroundColor"] = bg_color.lstrip("#")

    query_str = urllib.parse.urlencode(params)
    url = f"https://api.dicebear.com/9.x/{style}/{output_format}?{query_str}"

    if not output_path:
        safe_seed = "".join(c for c in seed if c.isalnum() or c in "-_")
        output_path = f"./assets/avatars/{style}_{safe_seed}.{output_format}"

    img_data = make_request(url)
    return save_bytes(img_data, output_path)


def fetch_ui_avatar(name: str, bg_color: str = "0D8ABC", text_color: str = "FFFFFF", size: int = 512, output_path: str = None) -> Path:
    """Fetch a clean typographic initials monogram avatar."""
    params = {
        "name": name,
        "background": bg_color.lstrip("#"),
        "color": text_color.lstrip("#"),
        "size": size,
        "font-size": 0.45,
        "bold": "true"
    }
    url = f"https://ui-avatars.com/api/?{urllib.parse.urlencode(params)}"
    if not output_path:
        safe_name = "".join(c for c in name if c.isalnum() or c in "-_")
        output_path = f"./assets/avatars/monogram_{safe_name}.png"
    img_data = make_request(url)
    return save_bytes(img_data, output_path)


# ---------------------------------------------------------------------------
# 3. PICSUM: BACKGROUND TEXTURES & HIGH-RES STOCK
# ---------------------------------------------------------------------------

def fetch_photo(
    width: int = 1080,
    height: int = 1920,
    seed: str = None,
    grayscale: bool = False,
    blur: int = None,
    output_path: str = None
) -> Path:
    """
    Fetch a high-resolution photograph or vertical texture from Picsum Photos.
    Ideal for 9:16 vertical motion backgrounds (1080x1920) or 16:9 plates (1920x1080).
    """
    if seed:
        base_url = f"https://picsum.photos/seed/{seed}/{width}/{height}"
    else:
        base_url = f"https://picsum.photos/{width}/{height}"

    params = []
    if grayscale:
        params.append("grayscale")
    if blur:
        params.append(f"blur={blur}")

    url = f"{base_url}?{'&'.join(params)}" if params else base_url

    if not output_path:
        prefix = f"seed_{seed}" if seed else "random"
        output_path = f"./assets/photos/plate_{prefix}_{width}x{height}.jpg"

    photo_data = make_request(url)
    return save_bytes(photo_data, output_path)


# ---------------------------------------------------------------------------
# 4. WIKIMEDIA COMMONS: DOCUMENTARY & ARCHIVAL ASSETS
# ---------------------------------------------------------------------------

def search_wikimedia(query: str, limit: int = 3, output_dir: str = "./assets/documentary") -> list:
    """
    Search and download public domain archival / documentary imagery from Wikimedia Commons.
    Ideal for Vox-style / documentary motion graphics parallax scenes.
    """
    params = {
        "action": "query",
        "generator": "search",
        "gsrsearch": query,
        "gsrlimit": limit,
        "prop": "imageinfo",
        "iiprop": "url|size|mime",
        "format": "json"
    }
    url = f"https://commons.wikimedia.org/w/api.php?{urllib.parse.urlencode(params)}"
    data = json.loads(make_request(url).decode("utf-8"))

    pages = data.get("query", {}).get("pages", {})
    downloaded_files = []

    for page_id, info in pages.items():
        title = info.get("title", f"wiki_{page_id}")
        imageinfo = info.get("imageinfo", [{}])[0]
        file_url = imageinfo.get("url")
        if not file_url:
            continue

        ext = file_url.split(".")[-1].lower()
        if ext not in ["jpg", "jpeg", "png", "svg", "webp"]:
            continue

        clean_title = "".join(c for c in title if c.isalnum() or c in "-_ ").strip().replace(" ", "_")
        target_path = Path(output_dir) / f"{clean_title}.{ext}"

        try:
            img_bytes = make_request(file_url)
            saved = save_bytes(img_bytes, str(target_path))
            downloaded_files.append(saved)
        except Exception as e:
            print(f"Warning: Failed downloading {file_url}: {e}")

    return downloaded_files


# ---------------------------------------------------------------------------
# 5. QR CODES: INTERACTIVE CTAS
# ---------------------------------------------------------------------------

def fetch_qr_code(data: str, size: int = 800, output_format: str = "svg", output_path: str = None) -> Path:
    """Generate and download a high-res vector or raster QR Code."""
    params = {
        "data": data,
        "size": f"{size}x{size}",
        "format": output_format
    }
    url = f"https://api.qrserver.com/v1/create-qr-code/?{urllib.parse.urlencode(params)}"
    if not output_path:
        output_path = f"./assets/qr/qr_cta.{output_format}"
    qr_data = make_request(url)
    return save_bytes(qr_data, output_path)


# ---------------------------------------------------------------------------
# 6. BATCH MANIFEST PROCESSOR
# ---------------------------------------------------------------------------

def process_batch(manifest_path: str):
    """
    Download an entire list of assets declared in a JSON manifest file.
    Example manifest:
    {
      "assets": [
        {"type": "icon", "id": "lucide/shield-check", "color": "00E5FF", "output": "./assets/shield.svg"},
        {"type": "logo", "brand": "stripe", "output": "./assets/stripe.svg"},
        {"type": "avatar", "seed": "Dr_Sarah", "style": "lorelei", "format": "png", "output": "./assets/avatar1.png"},
        {"type": "photo", "seed": "dental_clinic", "width": 1080, "height": 1920, "output": "./assets/bg.jpg"},
        {"type": "qr", "data": "https://example.com", "output": "./assets/qr.svg"}
      ]
    }
    """
    with open(manifest_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    assets = data.get("assets", [])
    print(f"\nProcessing {len(assets)} assets from {manifest_path}...\n" + "=" * 50)

    for item in assets:
        asset_type = item.get("type", "icon")
        out = item.get("output")
        try:
            if asset_type == "icon":
                fetch_icon(item["id"], output_path=out, color=item.get("color"), size=item.get("size"))
            elif asset_type == "logo":
                fetch_logo(item["brand"], output_path=out, color=item.get("color"))
            elif asset_type == "avatar":
                fetch_avatar(
                    seed=item.get("seed", "User"),
                    style=item.get("style", "lorelei"),
                    output_format=item.get("format", "svg"),
                    size=item.get("size", 512),
                    radius=item.get("radius", 50),
                    bg_color=item.get("bg_color"),
                    output_path=out
                )
            elif asset_type == "monogram":
                fetch_ui_avatar(
                    name=item.get("name", "User"),
                    bg_color=item.get("bg_color", "0D8ABC"),
                    text_color=item.get("text_color", "FFFFFF"),
                    size=item.get("size", 512),
                    output_path=out
                )
            elif asset_type == "photo":
                fetch_photo(
                    width=item.get("width", 1080),
                    height=item.get("height", 1920),
                    seed=item.get("seed"),
                    grayscale=item.get("grayscale", False),
                    blur=item.get("blur"),
                    output_path=out
                )
            elif asset_type == "qr":
                fetch_qr_code(
                    data=item["data"],
                    size=item.get("size", 800),
                    output_format=item.get("format", "svg"),
                    output_path=out
                )
            elif asset_type == "wikimedia":
                search_wikimedia(query=item["query"], limit=item.get("limit", 2), output_dir=out or "./assets/documentary")
            else:
                print(f"Skipping unknown asset type: {asset_type}")
        except Exception as e:
            print(f"Error processing asset {item}: {e}")

    print("=" * 50 + "\nBatch download complete!\n")


# ---------------------------------------------------------------------------
# CLI ENTRYPOINT
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="Headless Asset & Icon Fetcher for After Effects Motion Workflows"
    )
    subparsers = parser.add_subparsers(dest="command", help="Asset command")

    # search-icons
    p_search = subparsers.add_parser("search-icons", help="Search Iconify for vector icons")
    p_search.add_argument("query", help="Search term (e.g. 'bell', 'wallet', 'security')")
    p_search.add_argument("--limit", type=int, default=15, help="Max results (default: 15)")
    p_search.add_argument("--prefix", help="Filter by icon set (e.g. 'lucide', 'tabler', 'solar')")

    # icon
    p_icon = subparsers.add_parser("icon", help="Download vector icon as SVG")
    p_icon.add_argument("id", help="Icon identifier (e.g. 'lucide/bell' or 'solar:shield-check-bold')")
    p_icon.add_argument("-o", "--output", help="Target output file path")
    p_icon.add_argument("--color", help="Hex color code (e.g. '00E5FF')")
    p_icon.add_argument("--size", type=int, help="Width and height in px")

    # logo
    p_logo = subparsers.add_parser("logo", help="Download official tech/brand vector logo")
    p_logo.add_argument("brand", help="Brand name (e.g. 'apple', 'figma', 'stripe', 'notion')")
    p_logo.add_argument("-o", "--output", help="Target output file path")
    p_logo.add_argument("--color", help="Hex color code")

    # avatar
    p_avatar = subparsers.add_parser("avatar", help="Download procedural avatar from DiceBear")
    p_avatar.add_argument("seed", help="Unique deterministic seed string")
    p_avatar.add_argument("--style", default="lorelei", choices=DICEBEAR_STYLES, help="DiceBear style")
    p_avatar.add_argument("--format", default="svg", choices=["svg", "png", "webp", "jpg"], help="Image format")
    p_avatar.add_argument("--size", type=int, default=512, help="Pixel size")
    p_avatar.add_argument("--radius", type=int, default=50, help="Border radius percentage (50 = circular)")
    p_avatar.add_argument("--bg", help="Background hex color without #")
    p_avatar.add_argument("-o", "--output", help="Target output file path")

    # monogram
    p_mono = subparsers.add_parser("monogram", help="Download clean typographic monogram avatar")
    p_mono.add_argument("name", help="User full name (e.g. 'Amin Sassi')")
    p_mono.add_argument("--bg", default="0D8ABC", help="Background hex color")
    p_mono.add_argument("--color", default="FFFFFF", help="Text hex color")
    p_mono.add_argument("--size", type=int, default=512, help="Pixel size")
    p_mono.add_argument("-o", "--output", help="Target output file path")

    # photo
    p_photo = subparsers.add_parser("photo", help="Download high-res stock photo / background plate")
    p_photo.add_argument("--seed", help="Deterministic photo seed")
    p_photo.add_argument("--width", type=int, default=1080, help="Width in px (default 1080)")
    p_photo.add_argument("--height", type=int, default=1920, help="Height in px (default 1920)")
    p_photo.add_argument("--grayscale", action="store_true", help="Convert to grayscale")
    p_photo.add_argument("--blur", type=int, help="Blur level (1-10)")
    p_photo.add_argument("-o", "--output", help="Target output file path")

    # qr
    p_qr = subparsers.add_parser("qr", help="Download high-res vector/raster QR code")
    p_qr.add_argument("data", help="URL or text string to encode")
    p_qr.add_argument("--size", type=int, default=800, help="Size in px")
    p_qr.add_argument("--format", default="svg", choices=["svg", "png"], help="Output format")
    p_qr.add_argument("-o", "--output", help="Target output file path")

    # wikimedia
    p_wiki = subparsers.add_parser("wikimedia", help="Search and download documentary images from Wikimedia")
    p_wiki.add_argument("query", help="Search query (e.g. 'Apollo 11', 'Nikola Tesla')")
    p_wiki.add_argument("--limit", type=int, default=3, help="Max images to download")
    p_wiki.add_argument("-o", "--output-dir", default="./assets/documentary", help="Target directory")

    # batch
    p_batch = subparsers.add_parser("batch", help="Batch download assets from a JSON manifest")
    p_batch.add_argument("manifest", help="Path to JSON manifest file")

    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        sys.exit(0)

    if args.command == "search-icons":
        results = search_icons(args.query, limit=args.limit, prefix=args.prefix)
        print(f"\nFound {len(results)} icons matching '{args.query}':")
        for icon in results:
            prefix, name = icon.split(":", 1) if ":" in icon else ("", icon)
            print(f"  * {icon:<35} -> https://api.iconify.design/{prefix}/{name}.svg")
        print()

    elif args.command == "icon":
        fetch_icon(args.id, output_path=args.output, color=args.color, size=args.size)

    elif args.command == "logo":
        fetch_logo(args.brand, output_path=args.output, color=args.color)

    elif args.command == "avatar":
        fetch_avatar(
            seed=args.seed,
            style=args.style,
            output_format=args.format,
            size=args.size,
            radius=args.radius,
            bg_color=args.bg,
            output_path=args.output
        )

    elif args.command == "monogram":
        fetch_ui_avatar(
            name=args.name,
            bg_color=args.bg,
            text_color=args.color,
            size=args.size,
            output_path=args.output
        )

    elif args.command == "photo":
        fetch_photo(
            width=args.width,
            height=args.height,
            seed=args.seed,
            grayscale=args.grayscale,
            blur=args.blur,
            output_path=args.output
        )

    elif args.command == "qr":
        fetch_qr_code(args.data, size=args.size, output_format=args.format, output_path=args.output)

    elif args.command == "wikimedia":
        search_wikimedia(args.query, limit=args.limit, output_dir=args.output_dir)

    elif args.command == "batch":
        process_batch(args.manifest)


if __name__ == "__main__":
    main()
