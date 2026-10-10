# Deployment

## Docker Compose (recommended)

```bash
cp .env.example .env
# Set DATABASE_URL for postgres service (see docker-compose.yml)
docker compose up -d --build
```

Persist `data/` volume for SQLite tokens, outputs, and secrets.

## systemd example (Linux VPS)

`/etc/systemd/system/tn-news.service`:

```ini
[Unit]
Description=TN News Automation API
After=network.target

[Service]
Type=simple
User=tnnews
WorkingDirectory=/opt/tamil_nadu_news_automation
EnvironmentFile=/opt/tamil_nadu_news_automation/.env
ExecStart=/opt/tamil_nadu_news_automation/.venv/bin/python -m app.cli serve
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable --now tn-news
```

## Health check

`GET /health` → `{"status":"ok"}`

## Timezone

Set `TIMEZONE=Asia/Kolkata`. APScheduler uses this zone (no DST adjustments needed for India).

## Secrets

Mount `data/secrets` from a secure volume or secrets manager; never bake credentials into images.
