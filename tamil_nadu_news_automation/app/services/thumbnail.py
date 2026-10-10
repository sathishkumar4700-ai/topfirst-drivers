from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

from app.config import get_settings


def generate_thumbnail(title: str, output_path: Path, category: str = "") -> Path:
    settings = get_settings()
    w, h = 1280, 720
    img = Image.new("RGB", (w, h), color=(12, 45, 92))
    draw = ImageDraw.Draw(img)
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 48)
        small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 28)
    except OSError:
        font = ImageFont.load_default()
        small = font

    draw.rectangle([(0, 0), (w, 120)], fill=(200, 30, 45))
    draw.text((40, 35), "தமிழ்நாடு தினசரி செய்தி", fill="white", font=small)

    wrapped = title[:120]
    draw.multiline_text((40, 180), wrapped, fill="white", font=font, spacing=8)
    if category:
        draw.text((40, h - 60), category.replace("_", " ").upper(), fill=(180, 220, 255), font=small)

    if settings.channel_logo_path.exists():
        logo = Image.open(settings.channel_logo_path).convert("RGBA")
        logo.thumbnail((140, 140))
        img.paste(logo, (w - 160, h - 160), logo)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    img.save(output_path, "JPEG", quality=92)
    return output_path
