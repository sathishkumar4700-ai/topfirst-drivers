from datetime import datetime, timezone

from app.schemas.news import NewsArticle
from app.services.scoring import ScoringService


def test_scoring_orders_recent_story_higher():
    svc = ScoringService()
    now = datetime.now(timezone.utc)
    articles = [
        NewsArticle(
            headline="Chennai metro extension announced by Tamil Nadu government",
            summary="State government announced Chennai metro phase details.",
            url="https://example.com/1",
            source_name="Source A",
            published_at=now,
            category="transport_infrastructure",
            credibility=0.9,
        ),
        NewsArticle(
            headline="Chennai metro extension announced by TN govt officials",
            summary="Corroborating report on metro expansion in Chennai.",
            url="https://example.com/2",
            source_name="Source B",
            published_at=now,
            category="transport_infrastructure",
            credibility=0.85,
        ),
        NewsArticle(
            headline="Old story from unrelated region",
            summary="Something outside Tamil Nadu",
            url="https://example.com/3",
            source_name="Source C",
            published_at=now,
            category="public_viral",
            credibility=0.5,
        ),
    ]
    # Third article wouldn't pass RSS TN filter normally; include for penalty test
    articles[2].headline = "Madurai district health camp update Tamil Nadu"
    articles[2].summary = "Health department camp in Madurai Tamil Nadu"
    scored = svc.score_all(articles, [], [])
    assert scored[0].final_score >= scored[-1].final_score
    assert scored[0].corroboration_score >= 0.5
