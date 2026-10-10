from __future__ import annotations

import logging

from app.config import get_settings
from app.operation_phase import get_phase_context
from app.providers.news.newsapi import NewsApiProvider
from app.providers.news.rss import RssNewsProvider
from app.providers.trends.pytrends_provider import PyTrendsProvider
from app.providers.youtube.search import YouTubeSearchProvider
from app.schemas.news import NewsArticle, TrendSignal, YouTubeSignal

logger = logging.getLogger(__name__)


class DiscoveryService:
    def collect(self) -> tuple[list[NewsArticle], list[TrendSignal], list[YouTubeSignal]]:
        settings = get_settings()
        phase = get_phase_context(settings)
        yaml_cfg = settings.load_yaml()
        articles: list[NewsArticle] = []
        feeds = yaml_cfg.get("rss_feeds", [])
        articles.extend(RssNewsProvider(feeds).fetch())
        if not phase.rss_only:
            articles.extend(NewsApiProvider().fetch())
        else:
            logger.info("Phase %d: RSS-only discovery (skipping NewsAPI)", phase.phase)
        logger.info("Collected %d raw TN articles", len(articles))

        trends: list[TrendSignal] = []
        yt_signals: list[YouTubeSignal] = []
        if phase.skip_trend_signals:
            logger.info("Phase %d: skipping Google Trends signals", phase.phase)
        else:
            trends_cfg = yaml_cfg.get("google_trends", {})
            trends = PyTrendsProvider(
                geo=trends_cfg.get("geo", "IN-TN"),
                timeframe=trends_cfg.get("timeframe", "now 1-d"),
            ).fetch(trends_cfg.get("keywords_seed", []))

        if phase.skip_youtube_signals:
            logger.info("Phase %d: skipping YouTube engagement signals", phase.phase)
        else:
            yt_cfg = yaml_cfg.get("youtube_signals", {})
            yt_signals = YouTubeSearchProvider(yt_cfg).search_tamil_nadu_signals()
        return articles, trends, yt_signals
