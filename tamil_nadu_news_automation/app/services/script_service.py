from __future__ import annotations

import logging

from app.config import get_settings
from app.operation_phase import get_phase_context
from app.providers.script.openai_provider import OpenAIScriptProvider
from app.providers.script.rules import RulesScriptProvider
from app.schemas.news import TamilScript, VerifiedStory

logger = logging.getLogger(__name__)


class ScriptService:
    def generate(self, story: VerifiedStory) -> TamilScript:
        settings = get_settings()
        phase = get_phase_context(settings)
        provider = settings.script_provider
        if phase.force_rule_scripts:
            return RulesScriptProvider().generate(story)
        if provider == "auto":
            provider = "openai" if settings.openai_api_key else "rules"
        if provider == "openai":
            try:
                return OpenAIScriptProvider().generate(story)
            except Exception as exc:
                logger.warning("OpenAI script failed, falling back to rules: %s", exc)
        return RulesScriptProvider().generate(story)
