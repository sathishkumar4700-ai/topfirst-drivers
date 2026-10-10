from __future__ import annotations

import logging
from datetime import datetime, timezone

import httpx

from app.config import get_settings
from app.providers.base import NewsProvider
from app.providers.news.rss import classify, is_tamil_nadu_relevant
from app.schemas.news import NewsArticle

logger = logging.getLogger(__name__)


class NewsApiProvider(NewsProvider):
    name = "newsapi"

    def fetch(self) -> list[NewsArticle]:
        settings = get_settings()
        if not settings.newsapi_key:
            logger.info("NEWSAPI_KEY not set; skipping NewsAPI provider")
            return []
        q = "Tamil Nadu OR Chennai"
        url = "https://newsapi.org/v2/everything"
        params = {
            "q": q,
            "language": "en",
            "sortBy": "publishedAt",
            "pageSize": 30,
            "apiKey": settings.newsapi_key,
        }
        try:
            with httpx.Client(timeout=30.0) as client:
                resp = client.get(url, params=params)
                resp.raise_for_status()
                data = resp.json()
        except Exception as exc:
            logger.warning("NewsAPI fetch failed: %s", exc)
            return []
        articles: list[NewsArticle] = []
        for item in data.get("articles", []):
            headline = (item.get("title") or "").strip()
            summary = (item.get("description") or "").strip()
            if not headline or not is_tamil_nadu_relevant(headline, summary):
                continue
            published_at = None
            if item.get("publishedAt"):
                try:
                    published_at = datetime.fromisoformat(item["publishedAt"].replace("Z", "+00:00"))
                except ValueError:
                    published_at = None
            articles.append(
                NewsArticle(
                    headline=headline,
                    summary=summary,
                    url=item.get("url") or "",
                    source_name=(item.get("source") or {}).get("name", "NewsAPI"),
                    published_at=published_at,
                    category=classify(f"{headline} {summary}"),
                    credibility=0.8,
                )
            )
        return articles
