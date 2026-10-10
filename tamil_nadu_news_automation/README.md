# Tamil Nadu Daily Trending News AI Video Automation

Production-oriented Python automation that discovers Tamil Nadu news, ranks and verifies stories, generates original Tamil AI news videos, and publishes to YouTube with safeguards, logging, and an admin dashboard.

## Operation phases

- **Phase 1 (default):** RSS-only discovery, rule-based scripts, review queue, **no YouTube upload**; **scheduler on by default** when you run `python -m app.cli serve`.
- **Phase 4:** Daily scheduler, optional paid signals, notifications, auto-publish when configured.

Full guide: [docs/PHASES.md](docs/PHASES.md). Production template: `.env.phase4.example`.

**New to this?** Follow [docs/BEGINNER_SETUP.md](docs/BEGINNER_SETUP.md) (plain language, step by step).

**Auto-run when laptop turns on:** [docs/AUTO_START_LAPTOP.md](docs/AUTO_START_LAPTOP.md) (one-time Windows/Mac install).

## Quick start (Phase 1 pilot)

```bash
cd tamil_nadu_news_automation
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
pip install -e .
cp .env.example .env
# OPERATION_PHASE=1 is already the default
python -m app.cli init-db
python -m app.cli run
```

Outputs land in `data/output/run_<id>/`. Dashboard:

```bash
python -m app.cli serve
# http://localhost:8080  (Basic auth from .env)
```

## Modes

| Setting | Values | Meaning |
|---------|--------|---------|
| `OPERATION_PHASE` | `1` / `4` | Pilot vs daily automation profile |
| `RUN_MODE` | `test` / `production` | Test relaxes verification; uploads default to private when test |
| `PUBLISH_MODE` | `review` / `auto` | Review waits for dashboard approval before upload |

## Architecture

See [ARCHITECTURE.md](ARCHITECTURE.md).

## Configuration

- **Environment**: `.env` (copy from `.env.example`)
- **Schedule & feeds**: `config/settings.yaml` (Asia/Kolkata cron times, RSS feeds, scoring weights)

## YouTube channel (toptrend71@gmail.com)

Automatic public uploads: copy `.env.toptrend71.example` → `.env`, complete OAuth as **toptrend71@gmail.com**, then `python -m app.cli youtube-whoami`. See [docs/YOUTUBE.md](docs/YOUTUBE.md).

## YouTube OAuth 2.0

1. Create a Google Cloud project → enable **YouTube Data API v3**.
2. Create OAuth client (Desktop or Web) → download JSON to `data/secrets/client_secrets.json`.
3. Run `python -m app.cli youtube-auth` and complete browser consent.
4. Token saved to `data/secrets/youtube_token.json` (never commit).

Optional: set `YOUTUBE_API_KEY` for read-only trend/search signals (not used for upload).

## Providers

| Capability | Default (no paid keys) | Optional |
|------------|------------------------|----------|
| News | RSS feeds in `settings.yaml` | `NEWSAPI_KEY` |
| Trends | pytrends (may rate-limit) | — |
| Script | Rule-based Tamil | `OPENAI_API_KEY` + `SCRIPT_PROVIDER=openai` |
| TTS | edge-tts (`ta-IN-PallaviNeural`) | ElevenLabs / OpenAI interfaces |
| Visuals | Pillow slides + FFmpeg | OpenAI images |
| Upload | OAuth (manual auth step) | — |

## Docker

```bash
docker compose up --build
```

## Tests

```bash
pytest -q
```

## Documentation

- [docs/SETUP.md](docs/SETUP.md) — Windows / macOS / Linux setup
- [docs/YOUTUBE.md](docs/YOUTUBE.md) — OAuth scopes, quotas, playlists
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) — VPS, systemd, restarts
- [docs/COSTS.md](docs/COSTS.md) — cost estimates
- [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)

## Limitations

- Without API keys, trend and YouTube engagement signals are partial; ranking leans on RSS recency and corroboration.
- Rule-based scripts are factual but less conversational than LLM scripts.
- Video style is explainer slides + narration (not generative deepfake footage).
- **Never publish** until you configure OAuth, review Mode A outputs, and confirm source citations.
