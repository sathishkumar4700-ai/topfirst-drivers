from __future__ import annotations

import re
from difflib import SequenceMatcher

from app.schemas.news import NewsArticle

STOP = re.compile(r"[^\w\s]", re.UNICODE)


def normalize_headline(text: str) -> str:
    t = STOP.sub(" ", text.lower())
    return " ".join(t.split())


def similarity(a: str, b: str) -> float:
    return SequenceMatcher(None, normalize_headline(a), normalize_headline(b)).ratio()


def cluster_articles(articles: list[NewsArticle], threshold: float = 0.72) -> list[list[NewsArticle]]:
    clusters: list[list[NewsArticle]] = []
    for article in articles:
        placed = False
        for cluster in clusters:
            if similarity(article.headline, cluster[0].headline) >= threshold:
                cluster.append(article)
                placed = True
                break
        if not placed:
            clusters.append([article])
    return clusters


def cluster_key(headline: str) -> str:
    words = normalize_headline(headline).split()
    return " ".join(sorted(set(words))[:8])
