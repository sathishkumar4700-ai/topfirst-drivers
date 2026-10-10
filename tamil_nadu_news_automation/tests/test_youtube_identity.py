import pytest

from app.services.youtube_identity import YouTubeChannelMismatchError, assert_expected_channel


class _FakeOauth:
    def userinfo(self):
        return self

    def get(self):
        return self

    def execute(self):
        return {"email": "other@gmail.com"}


class _FakeYoutube:
    def channels(self):
        return self

    def list(self, **kwargs):
        return self

    def execute(self):
        return {"items": [{"id": "UC_test", "snippet": {"title": "Test Channel"}}]}


def test_assert_expected_email_mismatch(monkeypatch):
    from app.config import Settings, get_settings

    get_settings.cache_clear()
    monkeypatch.setenv("YOUTUBE_EXPECTED_EMAIL", "toptrend71@gmail.com")

    def fake_build(service, version, credentials=None):
        if service == "oauth2":
            return _FakeOauth()
        return _FakeYoutube()

    monkeypatch.setattr("app.services.youtube_identity.build", fake_build)
    creds = object()
    with pytest.raises(YouTubeChannelMismatchError, match="toptrend71"):
        assert_expected_channel(creds)  # type: ignore[arg-type]
