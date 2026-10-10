from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.entities import SystemControl


def get_control(db: Session) -> SystemControl:
    row = db.scalar(select(SystemControl).limit(1))
    if row is None:
        row = SystemControl(paused=False, emergency_stop=False)
        db.add(row)
        db.commit()
        db.refresh(row)
    return row


def is_pipeline_allowed(db: Session) -> tuple[bool, str]:
    ctrl = get_control(db)
    if ctrl.emergency_stop:
        return False, "Emergency stop is active"
    if ctrl.paused:
        return False, "Pipeline is paused"
    return True, "ok"
