from __future__ import annotations

import logging
from datetime import datetime

import pytz
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger

from app.config import get_settings
from app.operation_phase import get_phase_context, validate_phase4_readiness
from app.db.session import get_engine, init_db
from app.services.pipeline import DailyPipeline
from sqlalchemy.orm import sessionmaker

logger = logging.getLogger(__name__)

_scheduler: BackgroundScheduler | None = None


def _parse_hm(value: str) -> tuple[int, int]:
    parts = value.strip().split(":")
    return int(parts[0]), int(parts[1])


def _run_pipeline(stage: str = "full") -> None:
    init_db()
    Session = sessionmaker(bind=get_engine())
    db = Session()
    try:
        DailyPipeline(db).run(stage=stage)
    finally:
        db.close()


def start_scheduler() -> BackgroundScheduler | None:
    global _scheduler
    if _scheduler is not None:
        return _scheduler
    settings = get_settings()
    phase = get_phase_context(settings)
    if not phase.scheduler_enabled:
        logger.info(
            "Scheduler disabled (Phase %d). Run pipeline manually: python -m app.cli run",
            phase.phase,
        )
        return None
    for warning in validate_phase4_readiness(settings):
        logger.warning("Phase 4 readiness: %s", warning)
    yaml_cfg = settings.load_yaml()
    schedule = yaml_cfg.get("schedule", {})
    tz = pytz.timezone(settings.timezone)

    _scheduler = BackgroundScheduler(timezone=tz)

    # Primary daily execution at publish time (full pipeline includes collect→publish).
    publish_time = schedule.get("publish", "07:15")
    hour, minute = _parse_hm(publish_time)
    _scheduler.add_job(
        _run_pipeline,
        CronTrigger(hour=hour, minute=minute, timezone=tz),
        id="tn_news_daily_full",
        kwargs={"stage": "full"},
        replace_existing=True,
        misfire_grace_time=3600,
        coalesce=True,
    )
    logger.info("Scheduled daily full pipeline at %02d:%02d %s", hour, minute, settings.timezone)

    # Optional early news collection (re-run uses same day run — operators typically rely on publish job).
    if schedule.get("collect_news"):
        h, m = _parse_hm(schedule["collect_news"])
        _scheduler.add_job(
            _run_pipeline,
            CronTrigger(hour=h, minute=m, timezone=tz),
            id="tn_news_early_collect",
            kwargs={"stage": "collect"},
            replace_existing=True,
            misfire_grace_time=3600,
            coalesce=True,
        )

    _scheduler.start()
    return _scheduler
