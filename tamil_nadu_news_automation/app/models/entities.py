from __future__ import annotations

import enum
from datetime import datetime

from sqlalchemy import (
    JSON,
    Boolean,
    DateTime,
    Enum,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class RunStatus(str, enum.Enum):
    pending = "pending"
    running = "running"
    completed = "completed"
    failed = "failed"
    partial = "partial"


class VideoStatus(str, enum.Enum):
    draft = "draft"
    rendering = "rendering"
    qa_pending = "qa_pending"
    pending_approval = "pending_approval"
    approved = "approved"
    uploaded = "uploaded"
    failed = "failed"


class SystemControl(Base):
    __tablename__ = "system_control"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    paused: Mapped[bool] = mapped_column(Boolean, default=False)
    emergency_stop: Mapped[bool] = mapped_column(Boolean, default=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class DailyRun(Base):
    __tablename__ = "daily_runs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    run_date: Mapped[str] = mapped_column(String(10), index=True)
    status: Mapped[RunStatus] = mapped_column(Enum(RunStatus), default=RunStatus.pending)
    started_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    finished_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    error_log: Mapped[str | None] = mapped_column(Text)
    metadata_json: Mapped[dict | None] = mapped_column(JSON)

    candidates: Mapped[list["StoryCandidate"]] = relationship(back_populates="daily_run")
    productions: Mapped[list["VideoProduction"]] = relationship(back_populates="daily_run")


class StoryCandidate(Base):
    __tablename__ = "story_candidates"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    daily_run_id: Mapped[int] = mapped_column(ForeignKey("daily_runs.id"), index=True)
    headline: Mapped[str] = mapped_column(String(512))
    summary: Mapped[str] = mapped_column(Text)
    category: Mapped[str] = mapped_column(String(64))
    source_urls: Mapped[list] = mapped_column(JSON)
    published_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    recency_score: Mapped[float] = mapped_column(Float, default=0.0)
    trend_score: Mapped[float] = mapped_column(Float, default=0.0)
    importance_score: Mapped[float] = mapped_column(Float, default=0.0)
    corroboration_score: Mapped[float] = mapped_column(Float, default=0.0)
    audience_score: Mapped[float] = mapped_column(Float, default=0.0)
    penalty: Mapped[float] = mapped_column(Float, default=0.0)
    final_score: Mapped[float] = mapped_column(Float, default=0.0)
    confidence: Mapped[float] = mapped_column(Float, default=0.0)
    selected: Mapped[bool] = mapped_column(Boolean, default=False)
    reasoning: Mapped[str | None] = mapped_column(Text)
    facts_json: Mapped[dict | None] = mapped_column(JSON)

    daily_run: Mapped["DailyRun"] = relationship(back_populates="candidates")
    production: Mapped["VideoProduction | None"] = relationship(back_populates="story", uselist=False)


class VideoProduction(Base):
    __tablename__ = "video_productions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    daily_run_id: Mapped[int] = mapped_column(ForeignKey("daily_runs.id"), index=True)
    story_id: Mapped[int] = mapped_column(ForeignKey("story_candidates.id"), unique=True)
    status: Mapped[VideoStatus] = mapped_column(Enum(VideoStatus), default=VideoStatus.draft)
    tamil_script: Mapped[str | None] = mapped_column(Text)
    english_summary: Mapped[str | None] = mapped_column(Text)
    video_path: Mapped[str | None] = mapped_column(String(1024))
    thumbnail_path: Mapped[str | None] = mapped_column(String(1024))
    subtitle_ta_path: Mapped[str | None] = mapped_column(String(1024))
    subtitle_en_path: Mapped[str | None] = mapped_column(String(1024))
    youtube_video_id: Mapped[str | None] = mapped_column(String(32))
    youtube_url: Mapped[str | None] = mapped_column(String(512))
    title_ta: Mapped[str | None] = mapped_column(String(256))
    description_ta: Mapped[str | None] = mapped_column(Text)
    tags_json: Mapped[list | None] = mapped_column(JSON)
    estimated_cost_usd: Mapped[float] = mapped_column(Float, default=0.0)
    qa_results_json: Mapped[dict | None] = mapped_column(JSON)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    daily_run: Mapped["DailyRun"] = relationship(back_populates="productions")
    story: Mapped["StoryCandidate"] = relationship(back_populates="production")


class CostLedger(Base):
    __tablename__ = "cost_ledger"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    run_date: Mapped[str] = mapped_column(String(10), index=True)
    operation: Mapped[str] = mapped_column(String(128))
    estimated_usd: Mapped[float] = mapped_column(Float, default=0.0)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
