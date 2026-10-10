from __future__ import annotations

import logging

from app.config import get_settings
from app.schemas.news import ScoredStory, VerifiedStory

logger = logging.getLogger(__name__)


class VerificationService:
    """Lightweight verification using corroboration scores and source metadata."""

    def verify(self, story: ScoredStory) -> VerifiedStory:
        settings = get_settings()
        min_sources = 2 if settings.run_mode == "production" else 1
        unique_urls = list(dict.fromkeys(story.source_urls))
        source_count = len(story.facts.get("sources", [])) if story.facts else 0
        verified = story.corroboration_score >= 0.5 and len(unique_urls) >= min_sources
        notes = []
        if len(unique_urls) < min_sources:
            notes.append(f"Only {len(unique_urls)} URL(s); prefer {min_sources}+ independent sources.")
        if story.corroboration_score < 0.5:
            notes.append("Corroboration below threshold.")
        if not verified and settings.run_mode == "test":
            verified = story.confidence >= settings.min_story_confidence * 0.85
            notes.append("Test mode: relaxed verification with confidence gate.")

        english = (
            f"Headline: {story.headline}\n"
            f"Category: {story.category}\n"
            f"Summary: {story.summary[:500]}\n"
            f"Sources: {', '.join(unique_urls[:5])}\n"
            f"Confidence: {story.confidence:.2f}"
        )
        return VerifiedStory(
            **story.model_dump(),
            verified=verified,
            verification_notes="; ".join(notes) if notes else "Passed basic verification.",
            english_summary=english,
        )

    def select_top_stories(self, stories: list[VerifiedStory]) -> list[VerifiedStory]:
        settings = get_settings()
        threshold = settings.min_story_confidence
        selected: list[VerifiedStory] = []
        used_keys: set[str] = set()
        for story in sorted(stories, key=lambda s: s.final_score, reverse=True):
            if not story.verified:
                continue
            if story.confidence < threshold:
                continue
            if story.cluster_key in used_keys:
                continue
            used_keys.add(story.cluster_key)
            selected.append(story)
            if len(selected) >= settings.max_stories_per_day:
                break
        return selected
