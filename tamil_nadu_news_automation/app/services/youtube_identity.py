from __future__ import annotations

import logging

from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

from app.config import get_settings

logger = logging.getLogger(__name__)


class YouTubeChannelMismatchError(RuntimeError):
    pass


def fetch_connected_channel(creds: Credentials) -> dict:
    """Return Google account email and default YouTube channel for these credentials."""
    oauth2 = build("oauth2", "v2", credentials=creds)
    user = oauth2.userinfo().get().execute()
    email = (user.get("email") or "").strip().lower()

    youtube = build("youtube", "v3", credentials=creds)
    response = youtube.channels().list(part="snippet,id", mine=True).execute()
    items = response.get("items") or []
    if not items:
        raise RuntimeError("No YouTube channel found for this Google account.")
    channel = items[0]
    channel_id = channel["id"]
    title = channel.get("snippet", {}).get("title", "")
    return {
        "email": email,
        "channel_id": channel_id,
        "channel_title": title,
        "channel_url": f"https://www.youtube.com/channel/{channel_id}",
    }


def assert_expected_channel(creds: Credentials) -> dict:
    """Block upload if OAuth is not the configured owner account/channel."""
    settings = get_settings()
    identity = fetch_connected_channel(creds)

    expected_email = settings.youtube_expected_email.strip().lower()
    if expected_email and identity["email"] != expected_email:
        raise YouTubeChannelMismatchError(
            f"Signed in as {identity['email']}, but YOUTUBE_EXPECTED_EMAIL is {expected_email}. "
            f"Re-run: python -m app.cli youtube-auth and choose {expected_email}."
        )

    expected_channel = settings.youtube_expected_channel_id.strip()
    if expected_channel and identity["channel_id"] != expected_channel:
        raise YouTubeChannelMismatchError(
            f"Channel ID {identity['channel_id']} ({identity['channel_title']}) does not match "
            f"YOUTUBE_EXPECTED_CHANNEL_ID={expected_channel}."
        )

    logger.info(
        "YouTube upload target verified: %s (%s)",
        identity["channel_title"],
        identity["email"],
    )
    return identity
