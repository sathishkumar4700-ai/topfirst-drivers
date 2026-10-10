# Operation phases

The project supports two built-in rollout profiles controlled by **`OPERATION_PHASE`**.

## Phase 1 — Safe pilot (default)

```env
OPERATION_PHASE=1
```

| Behavior | Setting |
|----------|---------|
| News sources | **RSS only** (no NewsAPI spend) |
| Trends / YouTube signals | **Off** |
| Scripts | **Rule-based** Tamil (facts from articles) |
| Run / upload mode | Forced **`RUN_MODE=test`**, **`PUBLISH_MODE=review`** |
| YouTube upload | **Blocked** (dashboard + API) |
| Scheduler | **Off** unless `SCHEDULER_ENABLED=true` |

**Daily workflow**

```bash
python -m app.cli run
```

Review videos under `data/output/` and in the dashboard. Tune `MIN_STORY_CONFIDENCE` and `config/settings.yaml` feeds.

Optional: `python -m app.cli serve` for the dashboard without starting the scheduler.

---

## Phase 4 — Daily automation

```env
OPERATION_PHASE=4
SCHEDULER_ENABLED=true
PUBLISH_MODE=auto          # or review for human gate before upload
RUN_MODE=production        # public YouTube; use test for private uploads
```

| Behavior | Setting |
|----------|---------|
| News | RSS + NewsAPI (if keyed) |
| Trends / YouTube | On (keys optional but recommended) |
| Scripts | `SCRIPT_PROVIDER=auto` or `openai` when keyed |
| Scheduler | **On** by default at **07:15** `Asia/Kolkata` (`config/settings.yaml` → `schedule.publish`) |
| Upload | Allowed when OAuth configured; auto when `PUBLISH_MODE=auto` |
| Alerts | Configure **Telegram** or **SMTP** (warned at startup if missing) |
| Budget | `DAILY_BUDGET_USD` / `MONTHLY_BUDGET_USD` enforced before render |

**Deploy**

```bash
cp .env.phase4.example .env
# edit secrets, then:
docker compose up -d --build
```

Or VPS: `python -m app.cli serve` under systemd ([DEPLOYMENT.md](DEPLOYMENT.md)).

---

## Graduating 1 → 4

1. Run Phase 1 daily for ~2 weeks; confirm story quality and videos.
2. Complete YouTube OAuth (`docs/YOUTUBE.md`).
3. Copy `.env.phase4.example` → merge into `.env`.
4. Start with `PUBLISH_MODE=review` in Phase 4; switch to `auto` when confident.
5. Use dashboard **Pause** during maintenance.

`GET /health` returns current `operation_phase`, scheduler flag, and publish/run modes.
