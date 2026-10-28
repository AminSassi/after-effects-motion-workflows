"""Contact sheets for fast visual review.

1) Footage overview (what does every clip look like?):
    python scripts/review_contact_sheet.py clips <videos_dir> <out.jpg> [--at 1.5]
   Grabs one frame per .mov with ffmpeg, tiles 10 per row with filenames.
   (Alpha .mov renders show black bg here – that's expected.)

2) Render review (QA of AE stills from render.frame):
    python scripts/review_contact_sheet.py frames <frames_dir> <out.jpg>
   Tiles f_<time>.png files sorted by time, 4 per row.

Note: the gyan.dev Windows ffmpeg build has no `-pattern_type glob`, hence PIL tiling.
"""
import glob, os, subprocess, sys, tempfile
from PIL import Image, ImageDraw

mode, src, out = sys.argv[1], sys.argv[2], sys.argv[3]
at = sys.argv[sys.argv.index("--at") + 1] if "--at" in sys.argv else "1.5"

if mode == "clips":
    tmp = tempfile.mkdtemp()
    files = sorted(glob.glob(os.path.join(src, "*.mov")))
    for f in files:
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", at, "-i", f, "-frames:v", "1", "-vf", "scale=180:-1",
                        os.path.join(tmp, os.path.basename(f) + ".jpg")])
    fs = [os.path.join(tmp, os.path.basename(f) + ".jpg") for f in files]
    W, H, cols = 180, 320, 10
else:
    fs = sorted(glob.glob(os.path.join(src, "f_*.png")), key=lambda f: float(os.path.basename(f)[2:-4]))
    W, H, cols = 360, 640, 4

fs = [f for f in fs if os.path.exists(f)]
rows = (len(fs) + cols - 1) // cols
sheet = Image.new("RGB", (cols * W, rows * (H + 22)), "white"); d = ImageDraw.Draw(sheet)
for i, f in enumerate(fs):
    x, y = (i % cols) * W, (i // cols) * (H + 22)
    sheet.paste(Image.open(f).convert("RGB").resize((W, H)), (x, y))
    d.text((x + 3, y + H + 4), os.path.basename(f)[:30], fill="black")
sheet.save(out, quality=88)
print(f"{len(fs)} tiles -> {out}")
