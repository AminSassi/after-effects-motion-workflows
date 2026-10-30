import os
from PIL import Image, ImageDraw, ImageFont

OUT_DIR = r"C:\Users\PC\Desktop\i-FIX_Duo_Project"
os.makedirs(OUT_DIR, exist_ok=True)

def load_font(size, bold=False):
    candidates = [
        r"C:\Windows\Fonts\arialbd.ttf" if bold else r"C:\Windows\Fonts\arial.ttf",
        r"C:\Windows\Fonts\segoeuib.ttf" if bold else r"C:\Windows\Fonts\segoeui.ttf",
    ]
    for c in candidates:
        if os.path.exists(c):
            return ImageFont.truetype(c, size)
    return ImageFont.load_default()

def make_vertical_text_img(text, font, fill):
    dummy = Image.new("RGBA", (10, 10), (0, 0, 0, 0))
    d0 = ImageDraw.Draw(dummy)
    bbox = d0.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0] + 16
    th = bbox[3] - bbox[1] + 16
    txt_img = Image.new("RGBA", (tw, th), (0, 0, 0, 0))
    d = ImageDraw.Draw(txt_img)
    d.text((8 - bbox[0], 8 - bbox[1]), text, font=font, fill=fill)
    return txt_img.rotate(-90, expand=True)

def draw_vertical_text_top_to_bottom(base_img, x, y, text, font, fill, bottom_align_y=None):
    rot_img = make_vertical_text_img(text, font, fill)
    if bottom_align_y is not None:
        y = bottom_align_y - rot_img.size[1]
    base_img.alpha_composite(rot_img, (int(x), int(y)))
    return rot_img.size

def make_ifix_logo_vertical_img(scale=1.0, color=(255, 255, 255, 255), sub_text="Automix"):
    w_canvas = int(920 * scale)
    h_canvas = int(280 * scale)
    canvas = Image.new("RGBA", (w_canvas, h_canvas), (0, 0, 0, 0))
    d = ImageDraw.Draw(canvas)

    lw = max(4, int(5 * scale))
    # Top square dot of 'i'
    d.rectangle([int(22*scale), int(25*scale), int(48*scale), int(48*scale)], outline=color, width=lw)
    # Stem of 'i'
    d.polygon([
        (int(18*scale), int(62*scale)),
        (int(48*scale), int(62*scale)),
        (int(48*scale), int(120*scale)),
        (int(55*scale), int(120*scale)),
        (int(55*scale), int(135*scale)),
        (int(15*scale), int(135*scale)),
        (int(15*scale), int(120*scale)),
        (int(22*scale), int(120*scale)),
        (int(22*scale), int(76*scale)),
        (int(18*scale), int(76*scale)),
    ], outline=color, width=lw)

    font_main = load_font(int(128 * scale), bold=True)
    font_reg = load_font(int(52 * scale), bold=True)
    font_duo = load_font(int(124 * scale), bold=True)
    font_sub = load_font(int(54 * scale), bold=False)

    d.text((int(62*scale), int(10*scale)), "-FIX", font=font_main, fill=color)
    bbox_fix = d.textbbox((int(62*scale), int(10*scale)), "-FIX", font=font_main)
    x_after_fix = bbox_fix[2] + int(6*scale)

    d.text((x_after_fix, int(18*scale)), "®", font=font_reg, fill=color)
    bbox_reg = d.textbbox((x_after_fix, int(18*scale)), "®", font=font_reg)
    x_duo = bbox_reg[2] + int(8*scale)

    d.text((x_duo, int(12*scale)), "Duo", font=font_duo, fill=color)
    bbox_duo = d.textbbox((x_duo, int(12*scale)), "Duo", font=font_duo)

    exact_w = bbox_duo[2] + int(16 * scale)
    if sub_text:
        bbox_sub = d.textbbox((0, 0), sub_text, font=font_sub)
        sub_w = bbox_sub[2] - bbox_sub[0]
        x_sub = bbox_duo[2] - sub_w
        d.text((x_sub, int(148*scale)), sub_text, font=font_sub, fill=color)
        exact_h = int(225 * scale)
    else:
        exact_h = int(155 * scale)

    cropped = canvas.crop((0, 0, exact_w, exact_h))
    return cropped.rotate(-90, expand=True)

def draw_ifix_logo_vertical(base_img, x, y, scale=1.0, color=(255, 255, 255, 255), sub_text="Automix", bottom_align_y=None):
    rot = make_ifix_logo_vertical_img(scale=scale, color=color, sub_text=sub_text)
    if bottom_align_y is not None:
        y = bottom_align_y - rot.size[1]
    base_img.alpha_composite(rot, (int(x), int(y)))
    return rot.size

def draw_idental_horizontal(base_img, x, y, scale=1.0, color=(255, 255, 255, 255)):
    d = ImageDraw.Draw(base_img)
    lw = max(2, int(3 * scale))
    d.rectangle([int(x + 4*scale), int(y + 6*scale), int(x + 16*scale), int(y + 17*scale)], outline=color, width=lw)
    d.rectangle([int(x + 4*scale), int(y + 24*scale), int(x + 16*scale), int(y + 62*scale)], outline=color, width=lw)
    font_main = load_font(int(64 * scale), bold=True)
    font_reg = load_font(int(30 * scale), bold=True)
    d.text((int(x + 22*scale), int(y)), "-dental", font=font_main, fill=color)
    bbox = d.textbbox((int(x + 22*scale), int(y)), "-dental", font=font_main)
    d.text((bbox[2] + int(3*scale), int(y + 4*scale)), "®", font=font_reg, fill=color)


def build_box_texture():
    W, H = 4096, 4096
    img = Image.new("RGBA", (W, H), (246, 247, 249, 255))
    d = ImageDraw.Draw(img)

    y_teal_top = int(0.235 * H)
    y_teal_bot = int(0.825 * H)

    TEAL = (0, 130, 148, 255)
    WHITE = (255, 255, 255, 255)
    DARK = (22, 25, 28, 255)

    d.rectangle([0, y_teal_top, W, y_teal_bot], fill=TEAL)

    # Crisp physical seam shadow line at the top edge of the teal sleeve
    d.rectangle([0, y_teal_top - 10, W, y_teal_top], fill=(165, 172, 176, 255))
    d.rectangle([0, y_teal_top, W, y_teal_top + 6], fill=(0, 95, 110, 255))

    xL0, xL1 = 0, 737
    wL = xL1 - xL0
    xF0, xF1 = 737, 2048
    wF = xF1 - xF0
    xR0, xR1 = 2048, 2785
    wR = xR1 - xR0
    xB0, xB1 = 2785, 4096
    wB = xB1 - xB0

    # STRIP 2: FRONT FACE
    font_top_info = load_font(44, bold=True)
    draw_vertical_text_top_to_bottom(img, xF0 + int(0.185 * wF), int(0.032 * H), "for professional", font_top_info, DARK)
    draw_vertical_text_top_to_bottom(img, xF0 + int(0.132 * wF), int(0.032 * H), "use in dentistry only", font_top_info, DARK)
    draw_vertical_text_top_to_bottom(img, xF0 + int(0.080 * wF), int(0.032 * H), "Store in a refrigerator +2°C ÷ +8°C", font_top_info, DARK)

    font_dual = load_font(58, bold=False)
    draw_vertical_text_top_to_bottom(img, xF0 + int(0.21 * wF), y_teal_top + int(0.025 * H), "Dual Curing Adhesive", font_dual, WHITE)
    draw_vertical_text_top_to_bottom(img, xF0 + int(0.14 * wF), y_teal_top + int(0.025 * H), "Resin Cement", font_dual, WHITE)

    sq1_x0 = xF0 + int(0.70 * wF)
    sq1_y0 = int(0.445 * H)
    sq1_x1 = xF0 + int(0.87 * wF)
    sq1_y1 = sq1_y0 + (sq1_x1 - sq1_x0)

    sq2_x0 = xF0 + int(0.84 * wF)
    sq2_y0 = int(0.482 * H)
    sq2_x1 = xF1 - 4
    sq2_y1 = sq2_y0 + (sq1_x1 - sq1_x0)

    d.rectangle([sq2_x0, sq2_y0, sq2_x1, sq2_y1], fill=(5, 152, 170, 255), outline=(215, 232, 236, 255), width=7)
    d.rectangle([sq1_x0, sq1_y0, sq1_x1, sq1_y1], fill=(14, 172, 190, 255), outline=(225, 240, 244, 255), width=7)

    draw_ifix_logo_vertical(img, xF0 + int(0.65 * wF), int(0.565 * H), scale=1.05, color=WHITE, sub_text="Automix")

    bar_h = int(0.032 * H)
    bar_y0 = y_teal_bot - bar_h
    bar_y1 = y_teal_bot
    bar_x_start = xF0 + int(0.20 * wF)
    step_w = int(0.092 * wF)
    grad_colors = [
        (124, 224, 236, 255),
        (76, 203, 219, 255),
        (36, 184, 202, 255),
        (12, 164, 184, 255),
        (4, 146, 165, 255),
    ]
    for i, gc in enumerate(grad_colors):
        sx0 = bar_x_start + i * step_w
        d.rectangle([sx0, bar_y0, sx0 + step_w + 1, bar_y1], fill=gc)

    draw_idental_horizontal(img, xF0 + int(0.70 * wF), bar_y0 + 26, scale=1.0, color=WHITE)

    # STRIP 1: LEFT SIDE FACE
    font_lith = load_font(40, bold=True)
    draw_vertical_text_top_to_bottom(img, xL0 + int(0.14 * wL), int(0.04 * H), "made in Lithuania", font_lith, DARK)

    font_side_logo = load_font(58, bold=True)
    d.text((xL0 + int(0.14 * wL), y_teal_top + int(0.025 * H)), "i-FIX", font=font_side_logo, fill=WHITE)
    font_side_reg = load_font(28, bold=True)
    d.text((xL0 + int(0.35 * wL), y_teal_top + int(0.025 * H)), "®", font=font_side_reg, fill=WHITE)
    d.text((xL0 + int(0.41 * wL), y_teal_top + int(0.025 * H)), "Duo", font=font_side_logo, fill=WHITE)

    d.rectangle([xL0 + 6, int(0.44 * H), xL0 + int(0.32 * wL), int(0.50 * H)], fill=(10, 160, 178, 255), outline=(215, 232, 236, 255), width=6)
    d.rectangle([xL0 + 6, int(0.51 * H), xL0 + int(0.32 * wL), int(0.57 * H)], fill=(5, 145, 162, 255), outline=(215, 232, 236, 255), width=6)

    font_side_dual = load_font(42, bold=False)
    draw_vertical_text_top_to_bottom(img, xL0 + int(0.72 * wL), int(0.59 * H), "Dual Curing Adhesive", font_side_dual, WHITE)
    draw_vertical_text_top_to_bottom(img, xL0 + int(0.60 * wL), int(0.59 * H), "Resin Cement", font_side_dual, WHITE)

    # STRIP 3 & 4: RIGHT SIDE & BACK FACE
    draw_vertical_text_top_to_bottom(img, xR0 + int(0.25 * wR), y_teal_top + int(0.03 * H), "Dual Curing Adhesive", font_side_dual, WHITE)
    draw_vertical_text_top_to_bottom(img, xR0 + int(0.14 * wR), y_teal_top + int(0.03 * H), "Resin Cement", font_side_dual, WHITE)
    draw_ifix_logo_vertical(img, xB0 + int(0.55 * wB), int(0.32 * H), scale=0.95, color=WHITE, sub_text="Automix")

    out_path = os.path.join(OUT_DIR, "ifix_box_4k_conforme.png")
    img.convert("RGB").save(out_path, "PNG", optimize=False)


def build_syringe_label_texture():
    W, H = 2048, 4096
    img = Image.new("RGBA", (W, H), (249, 250, 252, 255))
    d = ImageDraw.Draw(img)

    xF0, xF1 = 512, 1536

    TEAL_LIGHT = (0, 152, 170, 255)
    TEAL_DARK = (0, 114, 130, 255)
    TEAL_TEXT = (0, 125, 142, 255)
    DARK = (25, 28, 32, 255)

    # 1. Top of Front Face: 4 staggered geometric teal squares
    d.rectangle([xF0 + 30, 180, xF0 + 360, 550], fill=TEAL_LIGHT)
    d.rectangle([xF0 + 510, 120, xF0 + 920, 550], fill=TEAL_LIGHT)
    d.rectangle([xF0 + 230, 410, xF0 + 640, 820], fill=TEAL_DARK)
    d.rectangle([xF0 + 520, 680, xF0 + 920, 1100], fill=TEAL_LIGHT)

    font_small = load_font(52, bold=True)
    draw_vertical_text_top_to_bottom(img, xF0 + 38, 860, "Content:", font_small, DARK)

    # 2. Lower Half of Front Face: Larger, bolder, high-contrast vertical text matching reference photo!
    y_bot = 3720
    draw_ifix_logo_vertical(img, xF0 + 560, 0, scale=2.15, color=TEAL_TEXT, sub_text=None, bottom_align_y=y_bot)

    font_med = load_font(102, bold=True)
    draw_vertical_text_top_to_bottom(img, xF0 + 405, 0, "Dual Curing", font_med, TEAL_TEXT, bottom_align_y=y_bot)
    draw_vertical_text_top_to_bottom(img, xF0 + 255, 0, "Adhesive Resin Cement", font_med, TEAL_TEXT, bottom_align_y=y_bot)

    # 3. Back/Side Face Info
    font_back = load_font(44, bold=False)
    draw_vertical_text_top_to_bottom(img, 1650, 400, 'UAB "Medicinos linija"  i-dental®', font_back, DARK)
    draw_vertical_text_top_to_bottom(img, 1580, 400, 'for professional use in dentistry only', font_back, DARK)
    draw_vertical_text_top_to_bottom(img, 220, 2200, '8g double syringe (4g Base / 4g Catalyst)', font_back, DARK)

    out_path = os.path.join(OUT_DIR, "ifix_syringe_label_4k_conforme.png")
    img.convert("RGB").save(out_path, "PNG", optimize=False)


if __name__ == "__main__":
    build_box_texture()
    build_syringe_label_texture()
    print("Updated 4K textures!")
