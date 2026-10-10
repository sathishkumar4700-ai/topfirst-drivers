from __future__ import annotations

import textwrap
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

from app.config import get_settings
from app.services.catchy_metadata import thumbnail_hook
from app.schemas.news import VerifiedStory


def _gradient_background(w: int, h: int) -> Image.Image:
    img = Image.new("RGB", (w, h))
    pixels = img.load()
    for y in range(h):
        r = int(8 + (y / h) * 40)
        g = int(20 + (y / h) * 30)
        b = int(60 + (y / h) * 80)
        for x in range(w):
            pixels[x, y] = (r, g, b)
    return img


def generate_thumbnail(
    title: str,
    output_path: Path,
    category: str = "",
    story: VerifiedStory | None = None,
) -> Path:
    settings = get_settings()
    w, h = 1280, 720
    img = _gradient_background(w, h)
    draw = ImageDraw.Draw(img)
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 52)
        small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 32)
        badge = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 36)
    except OSError:
        font = ImageFont.load_default()
        small = font
        badge = font

    draw.rectangle([(0, 0), (w, 100)], fill=(220, 38, 38))
    draw.rectangle([(0, 100), (w, 108)], fill=(255, 200, 50))
    draw.text((36, 28), "ட்ரெண்டிங் | தமிழ்நாடு", fill="white", font=badge)

    hook = thumbnail_hook(story) if story else title
    wrapped = textwrap.fill(hook, width=28)
    draw.multiline_text((36, 150), wrapped, fill="white", font=font, spacing=6)

    if category:
        label = category.replace("_", " ").upper()[:24]
        draw.rounded_rectangle((36, h - 72, 36 + 280, h - 24), radius=12, fill=(255, 200, 50))
        draw.text((52, h - 62), label, fill=(20, 20, 20), font=small)

    if settings.channel_logo_path.exists():
        logo = Image.open(settings.channel_logo_path).convert("RGBA")
        logo.thumbnail((120, 120))
        img.paste(logo, (w - 140, h - 140), logo)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    img.save(output_path, "JPEG", quality=93)
    return output_path
