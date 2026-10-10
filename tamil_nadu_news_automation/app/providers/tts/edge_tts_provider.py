from __future__ import annotations

import asyncio
import logging
from pathlib import Path

from app.config import get_settings

logger = logging.getLogger(__name__)


class EdgeTtsProvider:
    async def _synthesize(self, text: str, output_path: Path, voice: str) -> None:
        import edge_tts

        communicate = edge_tts.Communicate(text, voice)
        await communicate.save(str(output_path))

    def synthesize(self, text: str, output_path: Path) -> Path:
        settings = get_settings()
        voice = settings.edge_tts_voice
        output_path.parent.mkdir(parents=True, exist_ok=True)
        try:
            asyncio.run(self._synthesize(text, output_path, voice))
        except Exception as exc:
            logger.error("edge-tts failed: %s", exc)
            raise
        return output_path
