from app.config import Settings
from app.operation_phase import apply_phase_defaults, get_phase_context


def test_phase1_forces_safe_defaults(tmp_path):
    s = Settings(
        database_url=f"sqlite:///{tmp_path / 't.db'}",
        operation_phase=1,
        publish_mode="auto",
        run_mode="production",
        script_provider="openai",
    )
    s = apply_phase_defaults(s)
    assert s.publish_mode == "review"
    assert s.run_mode == "test"
    assert s.script_provider == "rules"
    ctx = get_phase_context(s)
    assert ctx.rss_only is True
    assert ctx.youtube_upload_allowed is False
    assert ctx.scheduler_enabled is True


def test_phase4_enables_scheduler_by_default(tmp_path):
    s = Settings(database_url=f"sqlite:///{tmp_path / 't.db'}", operation_phase=4)
    ctx = get_phase_context(s)
    assert ctx.scheduler_enabled is True
    assert ctx.auto_publish_allowed is True
    assert ctx.youtube_upload_allowed is True
