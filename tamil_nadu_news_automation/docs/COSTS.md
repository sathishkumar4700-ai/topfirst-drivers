# Cost estimates (indicative)

| Component | Typical daily (2 videos) | Notes |
|-----------|--------------------------|-------|
| edge-tts | ~$0 | Free; network only |
| OpenAI script (gpt-4o-mini) | $0.05–0.20 | Optional |
| OpenAI images | $0.08–0.40/image | Optional |
| ElevenLabs TTS | $0.10–0.50 | Optional |
| YouTube API | Quota-based | Upload ~1600 units each |
| VPS (2 vCPU) | $10–25/month | Docker host |

Configure caps in `.env`:

- `DAILY_BUDGET_USD`
- `MONTHLY_BUDGET_USD`

The pipeline calls `CostControlService.assert_can_spend()` before rendering.
