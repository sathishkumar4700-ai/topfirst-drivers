# YouTube Integration

## Target channel (toptrend71@gmail.com)

YouTube does **not** accept an email address in the upload API. Videos go to whichever channel is tied to the Google account you use during OAuth.

1. Set in `.env`:

   ```env
   YOUTUBE_EXPECTED_EMAIL=toptrend71@gmail.com
   OPERATION_PHASE=4
   PUBLISH_MODE=auto
   RUN_MODE=production
   ```

2. Run `python -m app.cli youtube-auth` and sign in as **toptrend71@gmail.com** (pick the correct Brand Channel if prompted).
3. Confirm: `python -m app.cli youtube-whoami`

If the wrong account was used, delete `data/secrets/youtube_token.json` and run `youtube-auth` again.

Optional: set `YOUTUBE_EXPECTED_CHANNEL_ID` if the Google account manages multiple channels.

Template: `.env.toptrend71.example`

## Scopes

- `youtube.upload` — resumable video upload
- `youtube` — thumbnail and playlist items
- `userinfo.email` — verify `YOUTUBE_EXPECTED_EMAIL`

## Authorization

1. Place OAuth client JSON at `data/secrets/client_secrets.json`.
2. `python -m app.cli youtube-auth`
3. Confirm token at `data/secrets/youtube_token.json`.

## Upload behavior

- **Resumable** chunked upload via `google-api-python-client`
- Thumbnail upload after video insert
- `RUN_MODE=test` → `privacyStatus=private`
- `RUN_MODE=production` → `privacyStatus=public` (change in code if you prefer unlisted)
- Description includes source links + AI disclosure line

## Quotas

YouTube Data API has daily quota units. Upload costs ~1600 units per video. Monitor Google Cloud Console → APIs → YouTube Data API v3 → Quotas.

## Playlists

Pass `playlist_id` in upload service call (extend dashboard/API when you add `YOUTUBE_PLAYLIST_ID` to settings).

## Review Mode (recommended)

Set `PUBLISH_MODE=review`. Approve each video in the dashboard, then click **Upload YouTube**.
