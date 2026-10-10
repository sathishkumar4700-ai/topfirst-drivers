from __future__ import annotations

import re
import textwrap

from app.schemas.news import VerifiedStory

CATEGORY_TA = {
    "state_politics": "அரசியல்",
    "chennai_districts": "சென்னை & மாவட்டம்",
    "crime_safety": "பாதுகாப்பு",
    "business_economy": "பொருளாதாரம்",
    "education_jobs": "கல்வி & வேலை",
    "technology_science": "தொழில்நுட்பம்",
    "cinema_kollywood": "கோலிவுட்",
    "sports": "விளையாட்டு",
    "weather_disasters": "வானிலை",
    "transport_infrastructure": "போக்குவரத்து",
    "public_viral": "பிரபல செய்தி",
    "health_agri_env": "சுகாதாரம்",
}


def _clean_headline(headline: str) -> str:
    h = re.sub(r"\s+", " ", headline).strip()
    return h[:100]


def youtube_title(story: VerifiedStory) -> str:
    """Catchy but factual YouTube title (≤ 100 chars)."""
    cat = CATEGORY_TA.get(story.category, "தமிழ்நாடு")
    core = _clean_headline(story.headline)
    title = f"{cat} டிரெண்ட் | {core} | தமிழ்நாடு செய்தி"
    return title[:100]


def thumbnail_hook(story: VerifiedStory) -> str:
    core = _clean_headline(story.headline)
    if len(core) > 70:
        core = core[:67] + "..."
    return core


def youtube_description(story: VerifiedStory, hashtags: list[str]) -> str:
    hook = _clean_headline(story.headline)
    summary = textwrap.shorten(story.summary.replace("\n", " "), width=400, placeholder="…")
    tags_line = " ".join(hashtags[:6])
    sources = "\n".join(f"• {u}" for u in story.source_urls[:5])
    return (
        f"🔥 இன்றைய தமிழ்நாடு டிரெண்டிங் செய்தி\n\n"
        f"{hook}\n\n"
        f"{summary}\n\n"
        f"👉 சப்ஸ்கிரைப் செய்து தினசரி அப்டேட் பெறுங்கள்!\n\n"
        f"{tags_line}\n\n"
        f"மூலங்கள்:\n{sources}\n\n"
        f"AI-assisted voice & visuals. Facts from listed sources."
    )


def trim_script_for_max_duration(text: str, max_chars: int) -> str:
    text = text.strip()
    if len(text) <= max_chars:
        return text
    return text[: max_chars - 1].rsplit(" ", 1)[0] + "…"
