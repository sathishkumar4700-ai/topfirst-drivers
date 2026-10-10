from __future__ import annotations

import logging
from dataclasses import dataclass
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.config import Settings

logger = logging.getLogger(__name__)


@dataclass(frozen=True)
class PhaseContext:
    """Runtime behavior for Phase 1 (pilot) vs Phase 4 (production automation)."""

    phase: int
    label: str
    rss_only: bool
    scheduler_enabled: bool
    youtube_upload_allowed: bool
    force_rule_scripts: bool
    skip_trend_signals: bool
    skip_youtube_signals: bool
    auto_publish_allowed: bool
    operator_summary: str


def get_phase_context(settings: Settings) -> PhaseContext:
    phase = int(getattr(settings, "operation_phase", 1) or 1)
    scheduler = settings.scheduler_enabled

    if phase == 1:
        return PhaseContext(
            phase=1,
            label="Phase 1 — Safe pilot",
            rss_only=True,
            scheduler_enabled=scheduler,
            youtube_upload_allowed=False,
            force_rule_scripts=True,
            skip_trend_signals=True,
            skip_youtube_signals=True,
            auto_publish_allowed=False,
            operator_summary=(
                "Daily pipeline at configured time when app is running (python -m app.cli serve). "
                "RSS only, rule-based Tamil scripts, review queue, no YouTube upload. "
                "Manual run: python -m app.cli run"
            ),
        )

    if phase == 4:
        return PhaseContext(
            phase=4,
            label="Phase 4 — Daily automation",
            rss_only=False,
            scheduler_enabled=scheduler,
            youtube_upload_allowed=True,
            force_rule_scripts=False,
            skip_trend_signals=False,
            skip_youtube_signals=False,
            auto_publish_allowed=True,
            operator_summary=(
                "Scheduled daily pipeline (default 07:15 Asia/Kolkata), optional paid signals, "
                "budget caps, email/Telegram alerts. Set PUBLISH_MODE=auto and RUN_MODE=production "
                "when ready for hands-off public publishing."
            ),
        )

    raise ValueError(f"Unsupported OPERATION_PHASE={phase}; use 1 or 4")


def apply_phase_defaults(settings: Settings) -> Settings:
    """Enforce non-negotiable safety defaults per phase (called after Settings load)."""
    ctx = get_phase_context(settings)
    if ctx.phase == 1:
        if settings.publish_mode != "review":
            logger.warning("Phase 1: forcing PUBLISH_MODE=review (was %s)", settings.publish_mode)
            settings.publish_mode = "review"
        if settings.run_mode != "test":
            logger.warning("Phase 1: forcing RUN_MODE=test (was %s)", settings.run_mode)
            settings.run_mode = "test"
        if settings.script_provider in ("auto", "openai"):
            settings.script_provider = "rules"
    return settings


def notifications_configured(settings: Settings) -> bool:
    email_ok = bool(settings.smtp_host and settings.notify_email_to)
    telegram_ok = bool(settings.telegram_bot_token and settings.telegram_chat_id)
    return email_ok or telegram_ok


def validate_phase4_readiness(settings: Settings) -> list[str]:
    """Warnings when Phase 4 is active but production safeguards are missing."""
    warnings: list[str] = []
    if not notifications_configured(settings):
        warnings.append("Configure SMTP or Telegram for daily run summaries (recommended for Phase 4).")
    if settings.publish_mode == "auto" and settings.run_mode != "production":
        warnings.append("PUBLISH_MODE=auto with RUN_MODE=test uploads as private only; use production for public.")
    if settings.publish_mode == "auto" and not settings.youtube_token_file.exists():
        warnings.append("YouTube OAuth token missing; auto-publish will skip uploads until youtube-auth completes.")
    return warnings
