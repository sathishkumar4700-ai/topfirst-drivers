# Troubleshooting

## No stories selected

- Lower `MIN_STORY_CONFIDENCE` slightly (e.g. 0.45) for sparse news days.
- Add RSS feeds in `config/settings.yaml`.
- Set `NEWSAPI_KEY` for additional sources.

## FFmpeg / ffprobe errors

Ensure `ffmpeg` and `ffprobe` are installed and on PATH. Subtitle burn-in may fail on some fonts; video still renders without burn-in.

## edge-tts failures

Check outbound network. Try another voice: `EDGE_TTS_VOICE=ta-IN-ValluvarNeural`.

## YouTube upload 403 / quota

Verify API enabled, OAuth token fresh, and quota remaining. Re-run `youtube-auth` if token revoked.

## Dashboard 401

Use credentials from `DASHBOARD_USERNAME` / `DASHBOARD_PASSWORD`.

## Emergency stop

Dashboard → **Emergency stop** or set `system_control.emergency_stop` in DB. Resume by clearing flag via DB or adding a resume API extension.

## Duplicate daily runs

Avoid overlapping manual **Run now** with scheduled jobs; use pause during maintenance.
