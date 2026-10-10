from __future__ import annotations

import logging
import re
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime

import feedparser
import httpx

from app.providers.base import NewsProvider
from app.schemas.news import NewsArticle

logger = logging.getLogger(__name__)

TN_KEYWORDS = re.compile(
    r"\b(tamil\s*nadu|chennai|coimbatore|madurai|tiruchirappalli|trichy|salem|"
    r"tirunelveli|erode|vellore|tn\s*govt|kollywood)\b",
    re.I,
)

CATEGORY_RULES: list[tuple[str, re.Pattern[str]]] = [
    ("state_politics", re.compile(r"\b(cm|minister|assembly|dmk|aiadmk|government|cabinet)\b", re.I)),
    ("crime_safety", re.compile(r"\b(police|arrest|crime|murder|theft|court)\b", re.I)),
    ("weather_disasters", re.compile(r"\b(rain|flood|cyclone|weather|monsoon)\b", re.I)),
    ("sports", re.compile(r"\b(cricket|ipl|hockey|athlete|sports)\b", re.I)),
    ("cinema_kollywood", re.compile(r"\b(kollywood|actor|actress|film|movie|cinema)\b", re.I)),
    ("business_economy", re.compile(r"\b(business|economy|investment|employment|job)\b", re.I)),
    ("education_jobs", re.compile(r"\b(exam|school|college|university|recruitment)\b", re.I)),
    ("technology_science", re.compile(r"\b(technology|ai|science|startup)\b", re.I)),
    ("transport_infrastructure", re.compile(r"\b(metro|traffic|transport|road|highway)\b", re.I)),
    ("health_agri_env", re.compile(r"\b(health|hospital|agriculture|environment)\b", re.I)),
    ("chennai_districts", re.compile(r"\b(chennai|district|corporation)\b", re.I)),
]


def classify(text: str) -> str:
    for cat, pattern in CATEGORY_RULES:
        if pattern.search(text):
            return cat
    return "public_viral"


def is_tamil_nadu_relevant(headline: str, summary: str) -> bool:
    blob = f"{headline} {summary}"
    return bool(TN_KEYWORDS.search(blob))


class RssNewsProvider(NewsProvider):
    name = "rss"

    def __init__(self, feeds: list[dict]):
        self.feeds = feeds

    def fetch(self) -> list[NewsArticle]:
        articles: list[NewsArticle] = []
        for feed in self.feeds:
            url = feed["url"]
            credibility = float(feed.get("credibility", 0.7))
            source_name = feed.get("name", url)
            try:
                with httpx.Client(timeout=30.0, follow_redirects=True) as client:
                    resp = client.get(url)
                    resp.raise_for_status()
                    parsed = feedparser.parse(resp.text)
            except Exception as exc:
                logger.warning("RSS fetch failed for %s: %s", url, exc)
                continue
            for entry in parsed.entries[:40]:
                headline = (entry.get("title") or "").strip()
                summary = (entry.get("summary") or entry.get("description") or "").strip()
                if not headline:
                    continue
                if not is_tamil_nadu_relevant(headline, summary):
                    continue
                link = entry.get("link") or ""
                published_at = None
                if entry.get("published"):
                    try:
                        published_at = parsedate_to_datetime(entry.published)
                        if published_at.tzinfo is None:
                            published_at = published_at.replace(tzinfo=timezone.utc)
                    except (TypeError, ValueError):
                        published_at = None
                articles.append(
                    NewsArticle(
                        headline=headline,
                        summary=summary[:2000],
                        url=link,
                        source_name=source_name,
                        published_at=published_at,
                        category=classify(f"{headline} {summary}"),
                        language=feed.get("language", "en"),
                        credibility=credibility,
                    )
                )
        return articles
