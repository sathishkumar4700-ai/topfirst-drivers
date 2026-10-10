from app.schemas.news import VerifiedStory
from app.services.catchy_metadata import youtube_description, youtube_title


def test_youtube_title_length():
    story = VerifiedStory(
        headline="PM Modi to launch Chennai Metro Rail Phase 2 in Tamil Nadu",
        summary="Test",
        category="transport_infrastructure",
        source_urls=["https://example.com"],
        published_at=None,
        recency_score=1,
        trend_score=1,
        importance_score=1,
        corroboration_score=1,
        audience_score=1,
        penalty=0,
        final_score=1,
        confidence=1,
        reasoning="",
        verified=True,
        verification_notes="",
        english_summary="",
    )
    title = youtube_title(story)
    assert len(title) <= 100
    assert "டிரெண்ட்" in title
    desc = youtube_description(story, ["#TamilNadu"])
    assert "டிரெண்டிங்" in desc
