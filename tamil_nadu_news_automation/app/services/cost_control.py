from __future__ import annotations

import logging
from datetime import datetime

import pytz
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.config import get_settings
from app.models.entities import CostLedger

logger = logging.getLogger(__name__)


class BudgetExceeded(Exception):
    pass


class CostControlService:
    def __init__(self, db: Session):
        self.db = db
        self.settings = get_settings()
        tz = pytz.timezone(self.settings.timezone)
        self.today = datetime.now(tz).strftime("%Y-%m-%d")
        self.month = datetime.now(tz).strftime("%Y-%m")

    def spent_today(self) -> float:
        val = self.db.scalar(
            select(func.coalesce(func.sum(CostLedger.estimated_usd), 0.0)).where(
                CostLedger.run_date == self.today
            )
        )
        return float(val or 0.0)

    def spent_month(self) -> float:
        val = self.db.scalar(
            select(func.coalesce(func.sum(CostLedger.estimated_usd), 0.0)).where(
                CostLedger.run_date.startswith(self.month)
            )
        )
        return float(val or 0.0)

    def record(self, operation: str, estimated_usd: float) -> None:
        self.db.add(
            CostLedger(run_date=self.today, operation=operation, estimated_usd=estimated_usd)
        )
        self.db.commit()

    def assert_can_spend(self, additional_usd: float) -> None:
        daily = self.spent_today() + additional_usd
        monthly = self.spent_month() + additional_usd
        if daily > self.settings.daily_budget_usd:
            raise BudgetExceeded(f"Daily budget exceeded: {daily:.2f} USD")
        if monthly > self.settings.monthly_budget_usd:
            raise BudgetExceeded(f"Monthly budget exceeded: {monthly:.2f} USD")
