from __future__ import annotations

import os
from functools import lru_cache
from pathlib import Path
from typing import Any, Literal

import yaml
from pydantic import Field, field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

from app.operation_phase import apply_phase_defaults

ROOT_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT_DIR / "data"
OUTPUT_DIR = DATA_DIR / "output"
SECRETS_DIR = DATA_DIR / "secrets"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=ROOT_DIR / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_env: str = "development"
    database_url: str = f"sqlite:///{DATA_DIR / 'tn_news.db'}"
    timezone: str = "Asia/Kolkata"
    # 1 = safe pilot (manual runs, RSS-only, no upload). 4 = scheduled daily automation.
    operation_phase: int = 1

    @field_validator("operation_phase", mode="before")
    @classmethod
    def _coerce_operation_phase(cls, value: object) -> object:
        if isinstance(value, str) and value.strip().isdigit():
            return int(value.strip())
        return value

    @field_validator("operation_phase")
    @classmethod
    def _validate_operation_phase(cls, value: int) -> int:
        if value not in (1, 4):
            raise ValueError("operation_phase must be 1 or 4")
        return value
    scheduler_enabled: bool = True
    publish_mode: Literal["review", "auto"] = "review"
    run_mode: Literal["test", "production"] = "test"

    dashboard_username: str = "admin"
    dashboard_password: str = "change-me"
    dashboard_secret: str = "change-me-session"

    min_story_confidence: float = 0.55
    max_stories_per_day: int = 2

    daily_budget_usd: float = 15.0
    monthly_budget_usd: float = 300.0

    newsapi_key: str = ""
    newsdata_api_key: str = ""

    youtube_client_secrets_file: Path = SECRETS_DIR / "client_secrets.json"
    youtube_token_file: Path = SECRETS_DIR / "youtube_token.json"
    youtube_api_key: str = ""
    # Uploads are rejected unless OAuth matches this Google account (when set).
    youtube_expected_email: str = ""
    # Optional extra guard: exact channel ID from YouTube Studio → Settings → Advanced.
    youtube_expected_channel_id: str = ""
    youtube_playlist_id: str = ""

    openai_api_key: str = ""
    openai_model: str = "gpt-4o-mini"
    script_provider: Literal["auto", "openai", "rules"] = "auto"

    tts_provider: Literal["edge", "elevenlabs", "openai"] = "edge"
    edge_tts_voice: str = "ta-IN-PallaviNeural"
    elevenlabs_api_key: str = ""
    elevenlabs_voice_id: str = ""

    image_provider: Literal["pillow", "openai"] = "pillow"
    openai_image_model: str = "dall-e-3"

    smtp_host: str = ""
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_password: str = ""
    smtp_from: str = ""
    notify_email_to: str = ""

    telegram_bot_token: str = ""
    telegram_chat_id: str = ""

    channel_logo_path: Path = ROOT_DIR / "assets" / "branding" / "logo.png"
    intro_video_path: Path = ROOT_DIR / "assets" / "branding" / "intro.mp4"
    outro_video_path: Path = ROOT_DIR / "assets" / "branding" / "outro.mp4"
    background_music_path: Path = ROOT_DIR / "assets" / "audio" / "background.mp3"

    yaml_config_path: Path = ROOT_DIR / "config" / "settings.yaml"

    @model_validator(mode="after")
    def _phase_defaults(self) -> "Settings":
        return apply_phase_defaults(self)

    @property
    def is_sqlite(self) -> bool:
        return self.database_url.startswith("sqlite")

    def load_yaml(self) -> dict[str, Any]:
        if not self.yaml_config_path.exists():
            return {}
        with open(self.yaml_config_path, encoding="utf-8") as f:
            return yaml.safe_load(f) or {}


@lru_cache
def get_settings() -> Settings:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    SECRETS_DIR.mkdir(parents=True, exist_ok=True)
    return Settings()
