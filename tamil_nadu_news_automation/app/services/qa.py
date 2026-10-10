from __future__ import annotations

import json
import logging
import subprocess
from pathlib import Path

from app.config import get_settings

logger = logging.getLogger(__name__)


class QualityAssuranceService:
    def __init__(self):
        self.settings = get_settings()
        self.video_cfg = self.settings.load_yaml().get("video", {})

    def check(
        self,
        video_path: Path,
        thumbnail_path: Path,
        title: str,
        headline: str,
        tamil_script: str,
        source_urls: list[str],
        youtube_video_id: str | None = None,
    ) -> dict:
        results: dict = {"passed": True, "checks": []}

        def add(name: str, ok: bool, detail: str = ""):
            results["checks"].append({"name": name, "ok": ok, "detail": detail})
            if not ok:
                results["passed"] = False

        if not video_path.exists():
            add("file_exists", False, "missing video")
            return results
        probe = subprocess.run(
            [
                "ffprobe",
                "-v",
                "error",
                "-select_streams",
                "v:0",
                "-show_entries",
                "stream=width,height",
                "-of",
                "json",
                str(video_path),
            ],
            capture_output=True,
            text=True,
        )
        if probe.returncode != 0:
            add("ffprobe", False, probe.stderr)
        else:
            data = json.loads(probe.stdout)
            streams = data.get("streams", [])
            if streams:
                w = int(streams[0].get("width", 0))
                h = int(streams[0].get("height", 0))
                exp_w = int(self.video_cfg.get("width", 1920))
                exp_h = int(self.video_cfg.get("height", 1080))
                add("resolution", w == exp_w and h == exp_h, f"{w}x{h}")
            else:
                add("resolution", False, "no video stream")

        audio_probe = subprocess.run(
            [
                "ffprobe",
                "-v",
                "error",
                "-select_streams",
                "a:0",
                "-show_entries",
                "stream=codec_type",
                "-of",
                "csv=p=0",
                str(video_path),
            ],
            capture_output=True,
            text=True,
        )
        add("audio", audio_probe.stdout.strip() == "audio", audio_probe.stdout.strip())

        add("tamil_script", len(tamil_script.strip()) > 50, f"len={len(tamil_script)}")
        add("thumbnail", thumbnail_path.exists() and thumbnail_path.stat().st_size > 1000, str(thumbnail_path))
        add("sources", len(source_urls) >= 1, f"{len(source_urls)} urls")
        title_match = headline[:30].lower() in title.lower() or title[:30].lower() in headline.lower()
        add("title_match", title_match, f"title={title[:40]}")
        add("duplicate_upload", youtube_video_id is None, "already uploaded" if youtube_video_id else "ok")
        return results
