from __future__ import annotations

import logging
import re
from datetime import datetime, timezone

from app.config import get_settings
from app.schemas.news import NewsArticle, ScoredStory, TrendSignal, YouTubeSignal
from app.services.dedupe import cluster_articles, cluster_key

logger = logging.getLogger(__name__)

CLICKBAIT = re.compile(
    r"\b(shocking|you won't believe|viral video|exposed|leaked|must watch)\b", re.I
)

DISTRICT_BOOST = re.compile(
    r"\b(chennai|coimbatore|madurai|tiruchirappalli|salem|tirunelveli|erode|vellore)\b",
    re.I,
)


class ScoringService:
    def __init__(self):
        self.settings = get_settings()
        self.yaml = self.settings.load_yaml()
        self.weights = self.yaml.get("scoring_weights", {})
        self.penalties = self.yaml.get("penalties", {})

    def _recency_score(self, published_at: datetime | None) -> float:
        if not published_at:
            return 0.35
        now = datetime.now(timezone.utc)
        if published_at.tzinfo is None:
            published_at = published_at.replace(tzinfo=timezone.utc)
        hours = (now - published_at).total_seconds() / 3600
        stale_hours = float(self.penalties.get("stale_hours", 72))
        if hours <= 6:
            return 1.0
        if hours >= stale_hours:
            return 0.1
        return max(0.1, 1.0 - (hours / stale_hours) * 0.9)

    def _trend_score(self, headline: str, trends: list[TrendSignal], yt: list[YouTubeSignal]) -> float:
        hl = headline.lower()
        trend_part = 0.0
        for t in trends:
            if t.keyword.lower().split()[0] in hl or any(w in hl for w in t.keyword.lower().split()):
                trend_part = max(trend_part, t.interest_score)
        yt_part = 0.0
        for v in yt:
            if similarity_token(hl, v.title.lower()) > 0.25:
                yt_part = max(yt_part, v.relevance)
        if not trends and not yt:
            trend_part = 0.45
        return min(1.0, 0.6 * trend_part + 0.4 * yt_part + 0.2)

    def _importance_score(self, article: NewsArticle, cluster_size: int) -> float:
        base = 0.5
        if article.category in ("state_politics", "weather_disasters", "crime_safety"):
            base += 0.2
        if DISTRICT_BOOST.search(article.headline):
            base += 0.1
        base += min(0.2, cluster_size * 0.05)
        return min(1.0, base)

    def _corroboration_score(self, cluster: list[NewsArticle]) -> float:
        sources = {a.source_name for a in cluster if a.source_name}
        if len(sources) >= 3:
            return 1.0
        if len(sources) == 2:
            return 0.75
        if len(sources) == 1:
            return 0.4
        return 0.2

    def _audience_score(self, article: NewsArticle) -> float:
        mapping = {
            "cinema_kollywood": 0.85,
            "sports": 0.8,
            "public_viral": 0.75,
            "technology_science": 0.7,
            "education_jobs": 0.72,
        }
        return mapping.get(article.category, 0.65)

    def _penalties(self, article: NewsArticle, cluster: list[NewsArticle], seen_keys: set[str]) -> float:
        p = 0.0
        key = cluster_key(article.headline)
        if key in seen_keys:
            p += float(self.penalties.get("duplicate", 0.35))
        if len({a.source_name for a in cluster}) < 2:
            p += float(self.penalties.get("single_source", 0.15))
        if CLICKBAIT.search(article.headline):
            p += float(self.penalties.get("clickbait_keywords", 0.20))
        published_at = article.published_at
        if published_at:
            if published_at.tzinfo is None:
                published_at = published_at.replace(tzinfo=timezone.utc)
            hours = (datetime.now(timezone.utc) - published_at).total_seconds() / 3600
            if hours > float(self.penalties.get("stale_hours", 72)):
                p += float(self.penalties.get("stale_penalty", 0.25))
        return min(0.9, p)

    def score_all(
        self,
        articles: list[NewsArticle],
        trends: list[TrendSignal],
        yt_signals: list[YouTubeSignal],
    ) -> list[ScoredStory]:
        w_r = float(self.weights.get("recency", 0.25))
        w_t = float(self.weights.get("trend_momentum", 0.25))
        w_i = float(self.weights.get("tn_importance", 0.25))
        w_c = float(self.weights.get("corroboration", 0.15))
        w_a = float(self.weights.get("audience_relevance", 0.10))
        weight_sum = w_r + w_t + w_i + w_c + w_a
        if weight_sum <= 0:
            weight_sum = 1.0

        clusters = cluster_articles(articles)
        scored: list[ScoredStory] = []
        seen_keys: set[str] = set()

        for cluster in clusters:
            lead = max(cluster, key=lambda a: (a.credibility, a.published_at or datetime.min.replace(tzinfo=timezone.utc)))
            recency = self._recency_score(lead.published_at)
            trend = self._trend_score(lead.headline, trends, yt_signals)
            importance = self._importance_score(lead, len(cluster))
            corroboration = self._corroboration_score(cluster)
            audience = self._audience_score(lead)
            penalty = self._penalties(lead, cluster, seen_keys)
            key = cluster_key(lead.headline)
            seen_keys.add(key)

            components = [
                w_r * recency,
                w_t * trend,
                w_i * importance,
                w_c * corroboration,
                w_a * audience,
            ]
            raw = sum(components) / weight_sum
            final = max(0.0, min(1.0, raw - penalty))
            confidence = final * (0.5 + 0.5 * corroboration)

            urls = [a.url for a in cluster if a.url]
            reasoning = (
                f"recency={recency:.2f}, trend={trend:.2f}, importance={importance:.2f}, "
                f"corroboration={corroboration:.2f} ({len(set(a.source_name for a in cluster))} sources), "
                f"audience={audience:.2f}, penalty={penalty:.2f}"
            )
            scored.append(
                ScoredStory(
                    headline=lead.headline,
                    summary=lead.summary,
                    category=lead.category,
                    source_urls=urls,
                    published_at=lead.published_at,
                    recency_score=recency,
                    trend_score=trend,
                    importance_score=importance,
                    corroboration_score=corroboration,
                    audience_score=audience,
                    penalty=penalty,
                    final_score=final,
                    confidence=confidence,
                    reasoning=reasoning,
                    facts={
                        "sources": [a.source_name for a in cluster],
                        "cluster_size": len(cluster),
                    },
                    cluster_key=key,
                )
            )
        scored.sort(key=lambda s: s.final_score, reverse=True)
        return scored


def similarity_token(a: str, b: str) -> float:
    sa, sb = set(a.split()), set(b.split())
    if not sa or not sb:
        return 0.0
    return len(sa & sb) / len(sa | sb)
