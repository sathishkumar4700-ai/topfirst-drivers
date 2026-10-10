from app.schemas.news import ScoredStory
from app.services.verification import VerificationService


def test_verification_requires_sources_in_production(monkeypatch):
    monkeypatch.setenv("OPERATION_PHASE", "4")
    monkeypatch.setenv("RUN_MODE", "production")
    from app.config import get_settings

    get_settings.cache_clear()
    story = ScoredStory(
        headline="Test",
        summary="Summary",
        category="public_viral",
        source_urls=["https://a.com"],
        published_at=None,
        recency_score=0.8,
        trend_score=0.8,
        importance_score=0.8,
        corroboration_score=0.4,
        audience_score=0.7,
        penalty=0.0,
        final_score=0.7,
        confidence=0.7,
        reasoning="test",
        facts={"sources": ["A"]},
        cluster_key="test",
    )
    v = VerificationService().verify(story)
    assert v.verified is False
