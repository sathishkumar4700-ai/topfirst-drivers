from __future__ import annotations

import logging
from pathlib import Path

from app.config import get_settings
from app.providers.tts.edge_tts_provider import EdgeTtsProvider

logger = logging.getLogger(__name__)


def get_tts_provider():
    settings = get_settings()
    if settings.tts_provider == "edge":
        return EdgeTtsProvider()
    if settings.tts_provider in ("elevenlabs", "openai"):
        logger.warning("%s TTS not configured; using edge-tts", settings.tts_provider)
    return EdgeTtsProvider()


def synthesize_speech(text: str, output_path: Path) -> Path:
    return get_tts_provider().synthesize(text, output_path)
