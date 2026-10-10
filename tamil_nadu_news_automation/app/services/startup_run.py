from __future__ import annotations

import logging
import threading

import pytz
from datetime import datetime
from sqlalchemy import select
from sqlalchemy.orm import Session, sessionmaker

from app.config import get_settings
from app.db.session import get_engine, init_db
from app.models.entities import DailyRun, RunStatus
from app.services.pipeline import DailyPipeline
from app.services.system_control import is_pipeline_allowed

logger = logging.getLogger(__name__)

_startup_thread_started = False


def _today_key() -> str:
    settings = get_settings()
    tz = pytz.timezone(settings.timezone)
    return datetime.now(tz).strftime("%Y-%m-%d")


def should_run_today(db: Session) -> tuple[bool, str]:
    """Return whether to auto-run pipeline on app startup (once per calendar day)."""
    settings = get_settings()
    if settings.force_daily_run:
        return True, "FORCE_DAILY_RUN is enabled"

    today = _today_key()
    runs = db.scalars(
        select(DailyRun)
        .where(DailyRun.run_date == today)
        .order_by(DailyRun.id.desc())
    ).all()
    if not runs:
        return True, "No run recorded for today"

    latest = runs[0]
    if latest.status == RunStatus.running:
        return False, "A run is already in progress"
    if settings.skip_if_ran_today and latest.status in (RunStatus.completed, RunStatus.partial):
        return False, f"Today's run already finished ({latest.status.value})"
    if latest.status == RunStatus.failed:
        return True, "Retrying after failed run today"
    return True, "Continuing today's pipeline"


def _run_in_background() -> None:
    init_db()
    Session = sessionmaker(bind=get_engine())
    db = Session()
    try:
        allowed, reason = is_pipeline_allowed(db)
        if not allowed:
            logger.info("Startup pipeline skipped: %s", reason)
            return

        ok, why = should_run_today(db)
        if not ok:
            logger.info("Startup pipeline skipped: %s", why)
            return

        logger.info("Startup pipeline starting: %s", why)
        DailyPipeline(db).run()
        logger.info("Startup pipeline finished")
    except Exception:
        logger.exception("Startup pipeline failed")
    finally:
        db.close()


def trigger_startup_pipeline_async() -> None:
    """Fire today's pipeline in a daemon thread (non-blocking for the web server)."""
    global _startup_thread_started
    if _startup_thread_started:
        return
    _startup_thread_started = True
    thread = threading.Thread(target=_run_in_background, name="tn-news-startup-run", daemon=True)
    thread.start()
    logger.info("Startup pipeline thread launched")
