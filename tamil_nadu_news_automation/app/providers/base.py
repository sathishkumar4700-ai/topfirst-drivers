from __future__ import annotations

from abc import ABC, abstractmethod

from app.schemas.news import NewsArticle, TrendSignal, YouTubeSignal


class NewsProvider(ABC):
    name: str = "base"

    @abstractmethod
    def fetch(self) -> list[NewsArticle]:
        ...


class TrendsProvider(ABC):
    name: str = "base"

    @abstractmethod
    def fetch(self, seeds: list[str]) -> list[TrendSignal]:
        ...


class YouTubeDataProvider(ABC):
    name: str = "base"

    @abstractmethod
    def search_tamil_nadu_signals(self) -> list[YouTubeSignal]:
        ...
