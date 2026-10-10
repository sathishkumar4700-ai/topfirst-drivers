from __future__ import annotations

from app.config import get_settings
from app.schemas.news import TamilScript, VerifiedStory
from app.services.catchy_metadata import (
    trim_script_for_max_duration,
    youtube_description,
    youtube_title,
)


class RulesScriptProvider:
    """Original Tamil script from verified facts (no LLM). Suitable for test mode."""

    def generate(self, story: VerifiedStory) -> TamilScript:
        settings = get_settings()
        yaml_cfg = settings.load_yaml()
        video_cfg = yaml_cfg.get("video", {})
        max_chars = int(video_cfg.get("max_speech_chars", 1400))

        title = youtube_title(story)
        hashtags = ["#TamilNadu", "#TamilNews", "#TrendingNews", "#செய்திகள்", "#தமிழ்நாடு"]
        sources_text = "\n".join(f"- {u}" for u in story.source_urls[:5])
        tamil = f"""வணக்கம்! இன்றைய தமிழ்நாடு டிரெண்டிங் செய்தி.

{story.headline}

சுருக்கம்:
{story.summary[:500]}

இந்த செய்தி தமிழ்நாடு மக்களுக்கு எப்படி பாதிக்கும்?
அதிகாரப்பூர்வ அறிவிப்புகள் மற்றும் நம்பகமான செய்தி மூலங்களின் அடிப்படையில் இந்த விவரங்கள் தொகுக்கப்பட்டுள்ளன.
உறுதிப்படுத்தப்படாத தகவல்கள் அல்லது சமூக ஊடக கோரிக்கைகள் உறுதிப்படுத்தப்பட்ட உண்மைகளாக சொல்லப்படவில்லை.

பின்னணி:
{story.category.replace('_', ' ')} பிரிவில் இந்த செய்தி முக்கியத்துவம் பெறுகிறது.

முடிவு:
மேலும் விவரங்கள் அதிகாரப்பூர்வ மூலங்களில் வெளியாகும்போது புதுப்பிக்கப்படும்.

எங்கள் சேனலை சப்ஸ்கிரைப் செய்து, தமிழ்நாடு தினசரி செய்திகளை தொடர்ந்து பாருங்கள். நன்றி!

மூலங்கள்:
{sources_text}
"""
        tamil = trim_script_for_max_duration(tamil, max_chars)
        desc = youtube_description(story, hashtags)
        tags = [
            "Tamil Nadu trending",
            "Tamil news today",
            "Chennai news",
            story.category,
            "தமிழ்நாடு டிரெண்டிங்",
        ]
        return TamilScript(
            tamil_script=tamil,
            english_summary=story.english_summary,
            title_ta=title,
            description_ta=desc,
            tags=tags,
            hashtags=hashtags,
        )
