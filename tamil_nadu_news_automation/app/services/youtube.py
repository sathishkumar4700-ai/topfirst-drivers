from __future__ import annotations

import logging
from pathlib import Path

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from googleapiclient.http import MediaFileUpload

from app.config import get_settings

logger = logging.getLogger(__name__)

SCOPES = [
    "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtube",
]


class YouTubeUploadService:
    def __init__(self):
        self.settings = get_settings()

    def _get_credentials(self) -> Credentials | None:
        token_file = self.settings.youtube_token_file
        secrets = self.settings.youtube_client_secrets_file
        creds = None
        if token_file.exists():
            creds = Credentials.from_authorized_user_file(str(token_file), SCOPES)
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
            token_file.write_text(creds.to_json())
        if creds and creds.valid:
            return creds
        if not secrets.exists():
            logger.warning("YouTube client secrets not found at %s", secrets)
            return None
        flow = InstalledAppFlow.from_client_secrets_file(str(secrets), SCOPES)
        creds = flow.run_local_server(port=0)
        token_file.parent.mkdir(parents=True, exist_ok=True)
        token_file.write_text(creds.to_json())
        return creds

    def is_configured(self) -> bool:
        return self.settings.youtube_client_secrets_file.exists() or self.settings.youtube_token_file.exists()

    def upload(
        self,
        video_path: Path,
        thumbnail_path: Path,
        title: str,
        description: str,
        tags: list[str],
        playlist_id: str | None = None,
        retries: int = 3,
    ) -> dict:
        creds = self._get_credentials()
        if creds is None:
            raise RuntimeError("YouTube OAuth not configured. Run: tn-news youtube-auth")
        youtube = build("youtube", "v3", credentials=creds)
        body = {
            "snippet": {
                "title": title[:100],
                "description": description[:5000],
                "tags": tags[:30],
                "categoryId": "25",
                "defaultLanguage": "ta",
            },
            "status": {
                "privacyStatus": "private" if self.settings.run_mode == "test" else "public",
                "selfDeclaredMadeForKids": False,
            },
        }
        media = MediaFileUpload(str(video_path), chunksize=1024 * 1024, resumable=True)
        request = youtube.videos().insert(part="snippet,status", body=body, media_body=media)
        response = None
        last_err = None
        for attempt in range(retries):
            try:
                response = None
                while response is None:
                    status, response = request.next_chunk()
                    if status:
                        logger.info("Upload %d%%", int(status.progress() * 100))
                break
            except HttpError as exc:
                last_err = exc
                logger.warning("YouTube upload attempt %d failed: %s", attempt + 1, exc)
        if response is None:
            raise RuntimeError(f"YouTube upload failed: {last_err}")
        video_id = response["id"]
        if thumbnail_path.exists():
            try:
                youtube.thumbnails().set(
                    videoId=video_id,
                    media_body=MediaFileUpload(str(thumbnail_path)),
                ).execute()
            except HttpError as exc:
                logger.warning("Thumbnail upload failed: %s", exc)
        if playlist_id:
            try:
                youtube.playlistItems().insert(
                    part="snippet",
                    body={
                        "snippet": {
                            "playlistId": playlist_id,
                            "resourceId": {"kind": "youtube#video", "videoId": video_id},
                        }
                    },
                ).execute()
            except HttpError as exc:
                logger.warning("Playlist insert failed: %s", exc)
        url = f"https://www.youtube.com/watch?v={video_id}"
        return {"video_id": video_id, "url": url}
