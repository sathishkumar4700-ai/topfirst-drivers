from __future__ import annotations

from pathlib import Path


def _format_srt_time(seconds: float) -> str:
    ms = int(seconds * 1000)
    h, ms = divmod(ms, 3600_000)
    m, ms = divmod(ms, 60_000)
    s, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


def write_simple_srt(text: str, output_path: Path, total_duration: float) -> Path:
    """Single-block SRT for full narration (burn-in uses same text)."""
    lines = [ln.strip() for ln in text.splitlines() if ln.strip()]
    chunk = " ".join(lines)[:500]
    content = (
        f"1\n{_format_srt_time(0)} --> {_format_srt_time(total_duration)}\n{chunk}\n"
    )
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(content, encoding="utf-8")
    return output_path
