from datetime import datetime

import pytz
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.config import Settings
from app.models.entities import DailyRun, RunStatus
from app.services.startup_run import should_run_today


def test_skip_after_completed_today(tmp_path):
    db_url = f"sqlite:///{tmp_path / 's.db'}"
    engine = create_engine(db_url)
    from app.db.base import Base
    from app.models import entities  # noqa: F401

    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    db = Session()
    tz = pytz.timezone("Asia/Kolkata")
    today = datetime.now(tz).strftime("%Y-%m-%d")
    db.add(DailyRun(run_date=today, status=RunStatus.completed))
    db.commit()

    settings = Settings(database_url=db_url, skip_if_ran_today=True, force_daily_run=False)
    from app.config import get_settings

    get_settings.cache_clear()
    # Patch via env is heavy; call logic with settings injected by monkeypatching get_settings
    import app.services.startup_run as mod

    original = mod.get_settings
    mod.get_settings = lambda: settings
    try:
        ok, _ = should_run_today(db)
        assert ok is False
    finally:
        mod.get_settings = original
        get_settings.cache_clear()
