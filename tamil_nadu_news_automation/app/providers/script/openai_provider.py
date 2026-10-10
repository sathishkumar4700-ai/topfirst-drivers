from __future__ import annotations

import json
import logging

from app.config import get_settings
from app.schemas.news import TamilScript, VerifiedStory

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are a Tamil news editor. Write original Tamil news scripts.
Never fabricate quotes, stats, or events. Distinguish confirmed facts from allegations.
Output JSON with keys: tamil_script, english_summary, title_ta, description_ta, tags (list), hashtags (list).
"""


class OpenAIScriptProvider:
    def generate(self, story: VerifiedStory) -> TamilScript:
        settings = get_settings()
        if not settings.openai_api_key:
            raise RuntimeError("OPENAI_API_KEY required for OpenAI script provider")
        try:
            from openai import OpenAI
        except ImportError:
            raise RuntimeError("openai package not installed") from None

        client = OpenAI(api_key=settings.openai_api_key)
        user = {
            "headline": story.headline,
            "summary": story.summary,
            "category": story.category,
            "sources": story.source_urls,
            "verification_notes": story.verification_notes,
        }
        resp = client.chat.completions.create(
            model=settings.openai_model,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": json.dumps(user, ensure_ascii=False)},
            ],
            response_format={"type": "json_object"},
        )
        content = resp.choices[0].message.content or "{}"
        data = json.loads(content)
        return TamilScript(
            tamil_script=data.get("tamil_script", ""),
            english_summary=data.get("english_summary", story.english_summary),
            title_ta=data.get("title_ta", story.headline[:90]),
            description_ta=data.get("description_ta", ""),
            tags=data.get("tags", []),
            hashtags=data.get("hashtags", []),
        )
