from __future__ import annotations

from app.schemas.news import TamilScript, VerifiedStory


class RulesScriptProvider:
    """Original Tamil script from verified facts (no LLM). Suitable for test mode."""

    def generate(self, story: VerifiedStory) -> TamilScript:
        title = story.headline[:90]
        sources_text = "\n".join(f"- {u}" for u in story.source_urls[:5])
        tamil = f"""வணக்கம்! இன்றைய தமிழ்நாடு செய்தி அப்டேட்.

தலைப்பு: {story.headline}

சுருக்கம்:
{story.summary[:600]}

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
        desc = (
            f"{story.headline}\n\n"
            f"தமிழ்நாடு தினசரி செய்தி விளக்கம்.\n\n"
            f"மூலங்கள்:\n{sources_text}\n\n"
            f"#TamilNadu #TamilNews #செய்திகள்"
        )
        tags = [
            "Tamil Nadu news",
            "Tamil news",
            "Chennai news",
            story.category,
            "தமிழ்நாடு செய்திகள்",
        ]
        hashtags = ["#TamilNadu", "#TamilNews", "#செய்திகள்"]
        return TamilScript(
            tamil_script=tamil,
            english_summary=story.english_summary,
            title_ta=title,
            description_ta=desc,
            tags=tags,
            hashtags=hashtags,
        )
