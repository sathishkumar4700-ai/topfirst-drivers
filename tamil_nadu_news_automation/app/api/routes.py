from __future__ import annotations

from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy import select
from starlette.requests import Request

from app.api.deps import get_database, verify_dashboard
from app.config import get_settings
from app.operation_phase import get_phase_context
from app.models.entities import DailyRun, StoryCandidate, SystemControl, VideoProduction, VideoStatus
from app.services.pipeline import DailyPipeline
from app.services.system_control import get_control
from app.services.youtube import YouTubeUploadService

router = APIRouter()
templates = Jinja2Templates(directory=str(Path(__file__).resolve().parents[1] / "templates"))


@router.get("/", response_class=HTMLResponse)
def dashboard(request: Request, db=Depends(get_database), _user: str = Depends(verify_dashboard)):
    runs = db.scalars(select(DailyRun).order_by(DailyRun.id.desc()).limit(14)).all()
    today_run = runs[0] if runs else None
    candidates = []
    productions = []
    if today_run:
        candidates = db.scalars(
            select(StoryCandidate).where(StoryCandidate.daily_run_id == today_run.id)
        ).all()
        productions = db.scalars(
            select(VideoProduction).where(VideoProduction.daily_run_id == today_run.id)
        ).all()
    ctrl = get_control(db)
    phase = get_phase_context(get_settings())
    return templates.TemplateResponse(
        "dashboard.html",
        {
            "request": request,
            "runs": runs,
            "today_run": today_run,
            "candidates": candidates,
            "productions": productions,
            "control": ctrl,
            "phase": phase,
        },
    )


@router.post("/api/run-now")
def run_now(db=Depends(get_database), _user: str = Depends(verify_dashboard)):
    run = DailyPipeline(db).run()
    return {"run_id": run.id, "status": run.status.value}


@router.post("/api/control/pause")
def pause(db=Depends(get_database), _user: str = Depends(verify_dashboard)):
    ctrl = get_control(db)
    ctrl.paused = True
    db.commit()
    return {"paused": True}


@router.post("/api/control/resume")
def resume(db=Depends(get_database), _user: str = Depends(verify_dashboard)):
    ctrl = get_control(db)
    ctrl.paused = False
    db.commit()
    return {"paused": False}


@router.post("/api/control/emergency-stop")
def emergency_stop(db=Depends(get_database), _user: str = Depends(verify_dashboard)):
    ctrl = get_control(db)
    ctrl.emergency_stop = True
    db.commit()
    return {"emergency_stop": True}


@router.post("/api/videos/{production_id}/approve")
def approve_video(production_id: int, db=Depends(get_database), _user: str = Depends(verify_dashboard)):
    prod = db.get(VideoProduction, production_id)
    if not prod:
        raise HTTPException(404, "Not found")
    prod.status = VideoStatus.approved
    db.commit()
    return {"status": prod.status.value}


@router.post("/api/videos/{production_id}/upload")
def upload_video(production_id: int, db=Depends(get_database), _user: str = Depends(verify_dashboard)):
    prod = db.get(VideoProduction, production_id)
    if not prod:
        raise HTTPException(404, "Not found")
    if prod.status not in (VideoStatus.approved, VideoStatus.pending_approval):
        raise HTTPException(400, "Video not approved for upload")
    phase = get_phase_context(get_settings())
    if not phase.youtube_upload_allowed:
        raise HTTPException(
            403,
            "YouTube upload is disabled in Phase 1. Set OPERATION_PHASE=4 when ready to publish.",
        )
    svc = YouTubeUploadService()
    result = svc.upload(
        Path(prod.video_path),
        Path(prod.thumbnail_path),
        prod.title_ta or "Tamil Nadu News",
        prod.description_ta or "",
        prod.tags_json or [],
    )
    prod.youtube_video_id = result["video_id"]
    prod.youtube_url = result["url"]
    prod.status = VideoStatus.uploaded
    db.commit()
    return result


@router.get("/media/{path:path}")
def media(path: str, _user: str = Depends(verify_dashboard)):
    file_path = Path(path)
    if not file_path.is_absolute():
        file_path = Path.cwd() / path
    if not file_path.exists():
        raise HTTPException(404)
    return FileResponse(file_path)
