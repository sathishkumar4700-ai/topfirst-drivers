from __future__ import annotations

import logging

from app.providers.base import TrendsProvider
from app.schemas.news import TrendSignal

logger = logging.getLogger(__name__)


class PyTrendsProvider(TrendsProvider):
    name = "pytrends"

    def __init__(self, geo: str = "IN-TN", timeframe: str = "now 1-d"):
        self.geo = geo
        self.timeframe = timeframe

    def fetch(self, seeds: list[str]) -> list[TrendSignal]:
        try:
            from pytrends.request import TrendReq
        except ImportError:
            logger.warning("pytrends not installed; trend signals disabled")
            return []
        signals: list[TrendSignal] = []
        try:
            pytrends = TrendReq(hl="en-IN", tz=330)
            keywords = seeds[:5] if seeds else ["Tamil Nadu news"]
            pytrends.build_payload(keywords, timeframe=self.timeframe, geo=self.geo)
            df = pytrends.interest_over_time()
            if df is None or df.empty:
                return []
            for kw in keywords:
                if kw not in df.columns:
                    continue
                series = df[kw]
                score = float(series.iloc[-1]) / 100.0 if len(series) else 0.0
                signals.append(TrendSignal(keyword=kw, interest_score=score, metadata={"geo": self.geo}))
        except Exception as exc:
            logger.warning("Google Trends fetch failed: %s", exc)
        return signals
