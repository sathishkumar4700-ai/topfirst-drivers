from __future__ import annotations

import json
import logging
import subprocess
import textwrap
from pathlib import Path

from app.config import OUTPUT_DIR, get_settings
from app.providers.tts.factory import synthesize_speech
from app.schemas.news import TamilScript, VerifiedStory
from app.services.subtitles import write_simple_srt
from app.services.catchy_metadata import trim_script_for_max_duration
from app.services.thumbnail import generate_thumbnail

logger = logging.getLogger(__name__)


def _ffprobe_duration(path: Path) -> float:
    cmd = [
        "ffprobe",
        "-v",
        "error",
        "-show_entries",
        "format=duration",
        "-of",
        "json",
        str(path),
    ]
    result = subprocess.run(cmd, capture_output=True, text=True, check=True)
    data = json.loads(result.stdout)
    return float(data["format"]["duration"])


def _create_slide_image(text: str, path: Path, width: int, height: int) -> None:
    from PIL import Image, ImageDraw, ImageFont

    img = Image.new("RGB", (width, height), (18, 32, 58))
    draw = ImageDraw.Draw(img)
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 36)
    except OSError:
        font = ImageFont.load_default()
    wrapped = textwrap.fill(text, width=42)
    draw.multiline_text((80, 200), wrapped, fill=(240, 240, 240), font=font, spacing=10)
    draw.text((80, 80), "தமிழ்நாடு செய்தி", fill=(255, 180, 80), font=font)
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path)


def _escape_sub_path(path: Path) -> str:
    return str(path).replace("\\", "/").replace(":", "\\:")


class VideoRenderService:
    def __init__(self):
        self.settings = get_settings()
        self.video_cfg = self.settings.load_yaml().get("video", {})
        self.w = int(self.video_cfg.get("width", 1920))
        self.h = int(self.video_cfg.get("height", 1080))
        self.fps = int(self.video_cfg.get("fps", 30))

    def render(
        self,
        story: VerifiedStory,
        script: TamilScript,
        run_id: int,
        story_id: int,
    ) -> dict:
        base = OUTPUT_DIR / f"run_{run_id}" / f"story_{story_id}"
        base.mkdir(parents=True, exist_ok=True)
        max_chars = int(self.video_cfg.get("max_speech_chars", 1400))
        narration_text = trim_script_for_max_duration(script.tamil_script, max_chars)
        audio_path = base / "narration.mp3"
        synthesize_speech(narration_text, audio_path)
        duration = _ffprobe_duration(audio_path)
        max_d = float(self.video_cfg.get("max_duration_sec", 180))
        min_d = float(self.video_cfg.get("min_duration_sec", 30))
        pad_to_min = bool(self.video_cfg.get("pad_to_min_duration", False))
        if duration > max_d:
            trimmed = base / "narration_trimmed.mp3"
            subprocess.run(
                ["ffmpeg", "-y", "-i", str(audio_path), "-t", str(max_d), "-c", "copy", str(trimmed)],
                check=True,
                capture_output=True,
            )
            audio_path = trimmed
            duration = max_d
        elif pad_to_min and duration < min_d:
            pad = base / "silence.mp3"
            subprocess.run(
                [
                    "ffmpeg",
                    "-y",
                    "-f",
                    "lavfi",
                    "-i",
                    "anullsrc=r=44100:cl=mono",
                    "-t",
                    str(min_d - duration),
                    str(pad),
                ],
                check=True,
                capture_output=True,
            )
            merged = base / "narration_padded.mp3"
            subprocess.run(
                [
                    "ffmpeg",
                    "-y",
                    "-i",
                    str(audio_path),
                    "-i",
                    str(pad),
                    "-filter_complex",
                    "[0:a][1:a]concat=n=2:v=0:a=1",
                    str(merged),
                ],
                check=True,
                capture_output=True,
            )
            audio_path = merged
            duration = _ffprobe_duration(audio_path)

        slide = base / "slide.png"
        _create_slide_image(story.headline, slide, self.w, self.h)
        video_raw = base / "video_raw.mp4"
        subprocess.run(
            [
                "ffmpeg",
                "-y",
                "-loop",
                "1",
                "-i",
                str(slide),
                "-i",
                str(audio_path),
                "-c:v",
                "libx264",
                "-tune",
                "stillimage",
                "-c:a",
                "aac",
                "-b:a",
                "192k",
                "-pix_fmt",
                "yuv420p",
                "-shortest",
                "-t",
                str(duration),
                "-r",
                str(self.fps),
                str(video_raw),
            ],
            check=True,
            capture_output=True,
        )

        srt_ta = base / "subtitles_ta.srt"
        write_simple_srt(script.tamil_script, srt_ta, duration)
        video_out = base / "final.mp4"
        sub_filter = f"subtitles={_escape_sub_path(srt_ta)}"
        cmd = ["ffmpeg", "-y", "-i", str(video_raw), "-vf", sub_filter, "-c:a", "copy", str(video_out)]
        try:
            subprocess.run(cmd, check=True, capture_output=True)
        except subprocess.CalledProcessError:
            logger.warning("Subtitle burn-in failed; using video without burn-in")
            video_out = video_raw

        if self.settings.background_music_path.exists():
            mixed = base / "final_with_bgm.mp4"
            subprocess.run(
                [
                    "ffmpeg",
                    "-y",
                    "-i",
                    str(video_out),
                    "-stream_loop",
                    "-1",
                    "-i",
                    str(self.settings.background_music_path),
                    "-filter_complex",
                    "[1:a]volume=0.12[bg];[0:a][bg]amix=inputs=2:duration=first",
                    "-c:v",
                    "copy",
                    str(mixed),
                ],
                check=True,
                capture_output=True,
            )
            video_out = mixed

        thumb = generate_thumbnail(
            script.title_ta,
            base / "thumbnail.jpg",
            story.category,
            story=story,
        )
        cost = 0.02 if self.settings.tts_provider == "edge" else 0.15
        return {
            "video_path": str(video_out),
            "thumbnail_path": str(thumb),
            "subtitle_ta_path": str(srt_ta),
            "subtitle_en_path": None,
            "duration": duration,
            "estimated_cost_usd": cost,
        }
