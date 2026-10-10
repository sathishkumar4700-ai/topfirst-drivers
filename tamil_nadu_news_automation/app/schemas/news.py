from __future__ import annotations

from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field, HttpUrl


class NewsArticle(BaseModel):
    headline: str
    summary: str
    url: str
    source_name: str
    published_at: datetime | None = None
    category: str = "public_viral"
    language: str = "en"
    credibility: float = 0.7


class TrendSignal(BaseModel):
    keyword: str
    interest_score: float = 0.0
    metadata: dict[str, Any] = Field(default_factory=dict)


class YouTubeSignal(BaseModel):
    video_id: str
    title: str
    channel: str
    published_at: datetime | None
    view_count: int = 0
    like_count: int = 0
    comment_count: int = 0
    relevance: float = 0.0


class ScoredStory(BaseModel):
    headline: str
    summary: str
    category: str
    source_urls: list[str]
    published_at: datetime | None
    recency_score: float
    trend_score: float
    importance_score: float
    corroboration_score: float
    audience_score: float
    penalty: float
    final_score: float
    confidence: float
    reasoning: str
    facts: dict[str, Any] = Field(default_factory=dict)
    cluster_key: str = ""


class VerifiedStory(ScoredStory):
    verified: bool = False
    verification_notes: str = ""
    english_summary: str = ""


class TamilScript(BaseModel):
    tamil_script: str
    english_summary: str
    title_ta: str
    description_ta: str
    tags: list[str]
    hashtags: list[str]
