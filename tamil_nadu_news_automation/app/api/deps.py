from __future__ import annotations

import secrets

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials

from app.config import get_settings
from app.db.session import get_db

security = HTTPBasic()


def verify_dashboard(credentials: HTTPBasicCredentials = Depends(security)) -> str:
    settings = get_settings()
    ok_user = secrets.compare_digest(credentials.username, settings.dashboard_username)
    ok_pass = secrets.compare_digest(credentials.password, settings.dashboard_password)
    if not (ok_user and ok_pass):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Basic"},
        )
    return credentials.username


def get_database(db=Depends(get_db)):
    return db
