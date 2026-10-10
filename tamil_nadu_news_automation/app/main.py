from __future__ import annotations

import logging

from fastapi import FastAPI

from app.api.routes import router
from app.db.session import init_db
from app.services.scheduler import start_scheduler

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")

app = FastAPI(title="Tamil Nadu News Automation", version="1.0.0")
app.include_router(router)


@app.on_event("startup")
def on_startup() -> None:
    init_db()
    start_scheduler()


@app.get("/health")
def health():
    return {"status": "ok"}
