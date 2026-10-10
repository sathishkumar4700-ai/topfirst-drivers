# Setup (Windows, macOS, Linux)

## Prerequisites

- Python 3.12+
- FFmpeg (`ffmpeg` / `ffprobe` on PATH)
- 4 GB+ RAM recommended for rendering

### Install FFmpeg

- **Ubuntu/Debian**: `sudo apt install ffmpeg fonts-dejavu-core`
- **macOS**: `brew install ffmpeg`
- **Windows**: Download from https://ffmpeg.org and add to PATH

## Install

```bash
git clone <your-repo>
cd tamil_nadu_news_automation
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
pip install -e .
cp .env.example .env
```

Edit `.env` with dashboard password, optional API keys, and `PUBLISH_MODE=review` initially.

## Database

**SQLite (dev):**

```bash
python -m app.cli init-db
```

**PostgreSQL (prod):** set `DATABASE_URL` and run migrations:

```bash
alembic upgrade head
```

## First pipeline run (test)

```bash
RUN_MODE=test python -m app.cli run
```

Inspect `data/output/` and the dashboard.

## Scheduler

The API server starts APScheduler on boot (`python -m app.cli serve`). Default full pipeline runs at `07:15` Asia/Kolkata (see `config/settings.yaml`).

For VPS without Docker, use systemd (see [DEPLOYMENT.md](DEPLOYMENT.md)).
