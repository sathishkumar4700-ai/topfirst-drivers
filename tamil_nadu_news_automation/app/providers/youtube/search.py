from __future__ import annotations

import logging
from datetime import datetime, timedelta, timezone

import httpx

from app.config import get_settings
from app.providers.base import YouTubeDataProvider
from app.schemas.news import YouTubeSignal

logger = logging.getLogger(__name__)


class YouTubeSearchProvider(YouTubeDataProvider):
    name = "youtube_search"

    def __init__(self, config: dict):
        self.config = config

    def search_tamil_nadu_signals(self) -> list[YouTubeSignal]:
        settings = get_settings()
        api_key = settings.youtube_api_key
        if not api_key:
            logger.info("YOUTUBE_API_KEY not set; skipping YouTube trend signals")
            return []
        q = "Tamil Nadu news"
        published_after = (
            datetime.now(timezone.utc)
            - timedelta(hours=int(self.config.get("published_within_hours", 48)))
        ).isoformat().replace("+00:00", "Z")
        params = {
            "part": "snippet",
            "q": q,
            "type": "video",
            "order": "viewCount",
            "maxResults": int(self.config.get("max_results", 25)),
            "regionCode": self.config.get("region_code", "IN"),
            "relevanceLanguage": self.config.get("relevance_language", "ta"),
            "publishedAfter": published_after,
            "key": api_key,
        }
        try:
            with httpx.Client(timeout=30.0) as client:
                search_resp = client.get(
                    "https://www.googleapis.com/youtube/v3/search", params=params
                )
                search_resp.raise_for_status()
                search_data = search_resp.json()
        except Exception as exc:
            logger.warning("YouTube search failed: %s", exc)
            return []
        video_ids = [
            item["id"]["videoId"]
            for item in search_data.get("items", [])
            if item.get("id", {}).get("videoId")
        ]
        if not video_ids:
            return []
        stats_params = {
            "part": "statistics,snippet",
            "id": ",".join(video_ids[:25]),
            "key": api_key,
        }
        try:
            with httpx.Client(timeout=30.0) as client:
                stats_resp = client.get(
                    "https://www.googleapis.com/youtube/v3/videos", params=stats_params
                )
                stats_resp.raise_for_status()
                stats_data = stats_resp.json()
        except Exception as exc:
            logger.warning("YouTube stats failed: %s", exc)
            return []
        signals: list[YouTubeSignal] = []
        for item in stats_data.get("items", []):
            snippet = item.get("snippet", {})
            stats = item.get("statistics", {})
            published_at = None
            if snippet.get("publishedAt"):
                try:
                    published_at = datetime.fromisoformat(
                        snippet["publishedAt"].replace("Z", "+00:00")
                    )
                except ValueError:
                    published_at = None
            views = int(stats.get("viewCount", 0))
            likes = int(stats.get("likeCount", 0))
            comments = int(stats.get("commentCount", 0))
            engagement = (likes + comments * 2) / max(views, 1)
            signals.append(
                YouTubeSignal(
                    video_id=item["id"],
                    title=snippet.get("title", ""),
                    channel=snippet.get("channelTitle", ""),
                    published_at=published_at,
                    view_count=views,
                    like_count=likes,
                    comment_count=comments,
                    relevance=min(1.0, engagement * 50),
                )
            )
        return signals
