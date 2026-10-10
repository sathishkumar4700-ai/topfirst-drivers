from __future__ import annotations

import logging
import traceback
from datetime import datetime
from pathlib import Path

import pytz
from sqlalchemy.orm import Session

from app.config import get_settings
from app.models.entities import DailyRun, RunStatus, StoryCandidate, VideoProduction, VideoStatus
from app.services.cost_control import BudgetExceeded, CostControlService
from app.operation_phase import get_phase_context
from app.services.discovery import DiscoveryService
from app.services.notifications import NotificationService
from app.services.qa import QualityAssuranceService
from app.services.render import VideoRenderService
from app.services.scoring import ScoringService
from app.services.script_service import ScriptService
from app.services.system_control import is_pipeline_allowed
from app.services.verification import VerificationService
from app.services.youtube import YouTubeUploadService

logger = logging.getLogger(__name__)


class DailyPipeline:
    def __init__(self, db: Session):
        self.db = db
        self.settings = get_settings()
        self.tz = pytz.timezone(self.settings.timezone)

    def _today(self) -> str:
        return datetime.now(self.tz).strftime("%Y-%m-%d")

    def run(self, stage: str = "full") -> DailyRun:
        allowed, reason = is_pipeline_allowed(self.db)
        if not allowed:
            raise RuntimeError(reason)

        run_date = self._today()
        run = DailyRun(run_date=run_date, status=RunStatus.running, started_at=datetime.now(self.tz))
        self.db.add(run)
        self.db.commit()
        self.db.refresh(run)

        cost = CostControlService(self.db)
        notify = NotificationService()
        errors: list[str] = []

        try:
            articles, trends, yt = DiscoveryService().collect()
            run.metadata_json = {
                "articles": len(articles),
                "trends": len(trends),
                "youtube_signals": len(yt),
            }
            self.db.commit()
            if stage == "collect":
                run.status = RunStatus.completed
                run.finished_at = datetime.now(self.tz)
                self.db.commit()
                return run

            scored = ScoringService().score_all(articles, trends, yt)
            verifier = VerificationService()
            verified = [verifier.verify(s) for s in scored]
            selected = verifier.select_top_stories(verified)

            for story in scored:
                cand = StoryCandidate(
                    daily_run_id=run.id,
                    headline=story.headline,
                    summary=story.summary,
                    category=story.category,
                    source_urls=story.source_urls,
                    published_at=story.published_at,
                    recency_score=story.recency_score,
                    trend_score=story.trend_score,
                    importance_score=story.importance_score,
                    corroboration_score=story.corroboration_score,
                    audience_score=story.audience_score,
                    penalty=story.penalty,
                    final_score=story.final_score,
                    confidence=story.confidence,
                    selected=False,
                    reasoning=story.reasoning,
                    facts_json=story.facts,
                )
                self.db.add(cand)
            self.db.commit()

            candidates = self.db.query(StoryCandidate).filter(StoryCandidate.daily_run_id == run.id).all()
            for s in selected:
                for c in candidates:
                    if c.headline == s.headline:
                        c.selected = True

            self.db.commit()

            if not selected:
                run.status = RunStatus.completed
                run.finished_at = datetime.now(self.tz)
                run.error_log = "No stories met confidence threshold; no videos produced."
                self.db.commit()
                notify.send_daily_summary(
                    f"TN News Automation — {run_date}",
                    "No stories met verification/confidence threshold today.",
                )
                return run

            productions: list[VideoProduction] = []
            script_svc = ScriptService()
            render_svc = VideoRenderService()
            qa_svc = QualityAssuranceService()
            yt_svc = YouTubeUploadService()

            for s in selected:
                cand = next((c for c in candidates if c.headline == s.headline), None)
                if not cand:
                    continue
                script = script_svc.generate(s)
                cost.assert_can_spend(0.05)
                render_out = render_svc.render(s, script, run.id, cand.id)
                cost.record(f"render_story_{cand.id}", render_out["estimated_cost_usd"])

                prod = VideoProduction(
                    daily_run_id=run.id,
                    story_id=cand.id,
                    status=VideoStatus.qa_pending,
                    tamil_script=script.tamil_script,
                    english_summary=script.english_summary,
                    video_path=render_out["video_path"],
                    thumbnail_path=render_out["thumbnail_path"],
                    subtitle_ta_path=render_out["subtitle_ta_path"],
                    subtitle_en_path=render_out.get("subtitle_en_path"),
                    title_ta=script.title_ta,
                    description_ta=script.description_ta + "\n\nAI-assisted narration and visuals disclosure.",
                    tags_json=script.tags,
                    estimated_cost_usd=render_out["estimated_cost_usd"],
                )
                self.db.add(prod)
                self.db.commit()
                self.db.refresh(prod)

                qa = qa_svc.check(
                    video_path=Path(prod.video_path),
                    thumbnail_path=Path(prod.thumbnail_path),
                    title=prod.title_ta or "",
                    headline=s.headline,
                    tamil_script=prod.tamil_script or "",
                    source_urls=s.source_urls,
                )
                prod.qa_results_json = qa
                if not qa["passed"]:
                    prod.status = VideoStatus.failed
                    errors.append(f"QA failed for {s.headline}")
                elif self.settings.publish_mode == "review":
                    prod.status = VideoStatus.pending_approval
                else:
                    prod.status = VideoStatus.approved
                self.db.commit()
                productions.append(prod)

            uploaded_links: list[str] = []
            phase = get_phase_context(self.settings)
            if self.settings.publish_mode == "auto" and phase.auto_publish_allowed:
                for prod in productions:
                    if prod.status != VideoStatus.approved:
                        continue
                    if not yt_svc.is_configured():
                        logger.info("Skipping YouTube upload (OAuth not configured)")
                        continue
                    try:
                        result = yt_svc.upload(
                            Path(prod.video_path),
                            Path(prod.thumbnail_path),
                            prod.title_ta or "Tamil Nadu News",
                            prod.description_ta or "",
                            prod.tags_json or [],
                        )
                        prod.youtube_video_id = result["video_id"]
                        prod.youtube_url = result["url"]
                        prod.status = VideoStatus.uploaded
                        uploaded_links.append(result["url"])
                        self.db.commit()
                    except Exception as exc:
                        prod.status = VideoStatus.failed
                        errors.append(f"Upload failed: {exc}")
                        self.db.commit()

            run.status = RunStatus.completed if not errors else RunStatus.partial
            run.finished_at = datetime.now(self.tz)
            if errors:
                run.error_log = "\n".join(errors)
            self.db.commit()

            lines = [f"Daily run {run_date}", f"Selected: {len(selected)} stories"]
            for s in selected:
                lines.append(f"- {s.headline} (confidence {s.confidence:.2f})")
            for link in uploaded_links:
                lines.append(f"Published: {link}")
            if errors:
                lines.append("Errors: " + "; ".join(errors))
            notify.send_daily_summary(f"TN News Automation — {run_date}", "\n".join(lines))
            return run

        except BudgetExceeded as exc:
            run.status = RunStatus.failed
            run.error_log = str(exc)
            run.finished_at = datetime.now(self.tz)
            self.db.commit()
            notify.send_daily_summary("TN News — budget stop", str(exc))
            raise
        except Exception as exc:
            run.status = RunStatus.failed
            run.error_log = traceback.format_exc()
            run.finished_at = datetime.now(self.tz)
            self.db.commit()
            logger.exception("Pipeline failed")
            raise
