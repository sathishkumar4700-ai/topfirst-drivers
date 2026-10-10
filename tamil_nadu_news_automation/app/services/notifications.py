from __future__ import annotations

import logging
import smtplib
from email.mime.text import MIMEText

import httpx

from app.config import get_settings

logger = logging.getLogger(__name__)


class NotificationService:
    def __init__(self):
        self.settings = get_settings()

    def send_daily_summary(self, subject: str, body: str) -> None:
        self._send_email(subject, body)
        self._send_telegram(body)

    def _send_email(self, subject: str, body: str) -> None:
        if not self.settings.smtp_host or not self.settings.notify_email_to:
            logger.info("Email notification skipped (SMTP not configured)")
            return
        msg = MIMEText(body, "plain", "utf-8")
        msg["Subject"] = subject
        msg["From"] = self.settings.smtp_from or self.settings.smtp_user
        msg["To"] = self.settings.notify_email_to
        try:
            with smtplib.SMTP(self.settings.smtp_host, self.settings.smtp_port) as server:
                server.starttls()
                if self.settings.smtp_user:
                    server.login(self.settings.smtp_user, self.settings.smtp_password)
                server.send_message(msg)
        except Exception as exc:
            logger.warning("Email send failed: %s", exc)

    def _send_telegram(self, body: str) -> None:
        token = self.settings.telegram_bot_token
        chat_id = self.settings.telegram_chat_id
        if not token or not chat_id:
            logger.info("Telegram notification skipped (not configured)")
            return
        url = f"https://api.telegram.org/bot{token}/sendMessage"
        try:
            httpx.post(url, json={"chat_id": chat_id, "text": body[:4000]}, timeout=30.0)
        except Exception as exc:
            logger.warning("Telegram send failed: %s", exc)
