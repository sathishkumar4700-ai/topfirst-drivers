# Tamil Nadu Daily Trending News AI Video Automation — Architecture

## Overview

End-to-end daily pipeline: **discover → score → verify → script → produce → QA → publish**, with full audit logging, cost controls, and operator dashboard.

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐     ┌──────────────┐
│  Scheduler  │────▶│  Discovery   │────▶│   Scoring   │────▶│ Verification │
│ (APScheduler│     │ RSS/API/     │     │ Weighted    │     │ Multi-source │
│  Asia/Kolkata)    │ YouTube/Trends│     │ normalize   │     │ corroboration│
└─────────────┘     └──────────────┘     └─────────────┘     └──────┬───────┘
                                                                      │
┌─────────────┐     ┌──────────────┐     ┌─────────────┐              ▼
│  YouTube    │◀────│  QA + Mode   │◀────│   Render    │◀────┌──────────────┐
│  OAuth v3   │     │ A/B publish  │     │ FFmpeg+TTS  │     │ Script + TTS │
└─────────────┘     └──────────────┘     └─────────────┘     │ + Visuals    │
       ▲                    ▲                                  └──────────────┘
       │                    │
┌──────┴──────┐     ┌───────┴──────┐
│ PostgreSQL  │     │  FastAPI     │
│ / SQLite    │     │  Dashboard   │
└─────────────┘     └──────────────┘
```

## Modules

| Module | Responsibility |
|--------|----------------|
| `providers/news` | Pluggable RSS, NewsAPI, custom feeds |
| `providers/trends` | Google Trends (pytrends), optional third-party |
| `providers/youtube_data` | Search recent TN videos for engagement signals |
| `services/discovery` | Aggregate candidates, dedupe, categorize |
| `services/scoring` | Weighted normalized scores + penalties |
| `services/verification` | Source clustering, fact extraction, confidence |
| `services/script` | Tamil script + English audit summary (LLM or rules) |
| `providers/tts` | edge-tts (default), ElevenLabs, OpenAI |
| `providers/images` | Pillow templates, optional DALL·E/Stable Diffusion |
| `services/render` | Scene list, subtitles (SRT), FFmpeg mux |
| `services/thumbnail` | Branded 1280×720 Tamil text overlay |
| `services/qa` | ffprobe checks, metadata consistency |
| `services/youtube` | Resumable upload, thumbnail, playlists |
| `services/scheduler` | Cron-style jobs per `config/settings.yaml` |
| `services/cost` | Pre-flight estimates, daily/monthly caps |
| `services/notifications` | Email (SMTP), Telegram |
| `api` | Admin dashboard, pause/resume, previews |

## Modes

- **TEST**: No paid APIs required; uses RSS + rule-based scripts + edge-tts + local render; YouTube upload skipped unless credentials present.
- **REVIEW (Mode A)**: Videos rendered to `data/output/`; status `pending_approval` until dashboard approve.
- **AUTO (Mode B)**: Publish when QA + verification confidence ≥ threshold.

## Data model (core entities)

- `DailyRun` — one row per scheduled execution
- `StoryCandidate` — all ranked candidates with scores and sources
- `SelectedStory` — top stories chosen for production
- `VideoProduction` — paths, costs, QA results, YouTube IDs
- `SystemState` — emergency stop, pause flags

## Security

- Secrets via environment variables only (`.env` not committed).
- Dashboard HTTP Basic or bearer token (`DASHBOARD_SECRET`).
- OAuth tokens stored under `data/secrets/youtube_token.json` (gitignored).

## Deployment

- `docker-compose.yml`: `app`, `postgres`, optional `redis` (future queue).
- Systemd unit example in `docs/DEPLOYMENT.md` for VPS cron alternative.
