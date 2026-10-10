from __future__ import annotations

import logging

from fastapi import FastAPI

from app.api.routes import router
from app.config import get_settings
from app.db.session import init_db
from app.operation_phase import get_phase_context, validate_phase4_readiness
from app.services.scheduler import start_scheduler

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")

app = FastAPI(title="Tamil Nadu News Automation", version="1.0.0")
app.include_router(router)


@app.on_event("startup")
def on_startup() -> None:
    init_db()
    settings = get_settings()
    ctx = get_phase_context(settings)
    logger = logging.getLogger(__name__)
    logger.info("%s — %s", ctx.label, ctx.operator_summary)
    if ctx.phase == 4:
        for w in validate_phase4_readiness(settings):
            logger.warning(w)
    start_scheduler()


@app.get("/health")
def health():
    settings = get_settings()
    ctx = get_phase_context(settings)
    return {
        "status": "ok",
        "operation_phase": ctx.phase,
        "scheduler_enabled": ctx.scheduler_enabled,
        "publish_mode": settings.publish_mode,
        "run_mode": settings.run_mode,
    }
