from fastapi.testclient import TestClient

import app.llm.fill_slot as fill_slot_module
from app.cascade import ProviderUnavailable
from app.config import settings
from app.llm.fill_slot import fill_slot
from app.main import app

client = TestClient(app)

_SCHEMA = {"type": "string", "enum": ["sudden", "gradual"]}


def test_fill_slot_returns_unclear_when_all_llm_tiers_are_unavailable(monkeypatch):
    """CLAUDE.md/docs/05-interview-engine.md "Always honest": every provider unreachable means
    an honest "unclear", never a fabricated value. Simulated directly (both adapters raise)
    rather than relying on the ambient environment having no API keys configured — this repo's
    .env now carries real keys for the live E2E demo (docs/13-demo-script.md), so "no key
    present" is no longer a state the test environment is actually in."""

    async def _unavailable(**kwargs):
        raise ProviderUnavailable("simulated: provider down")

    monkeypatch.setitem(fill_slot_module._ADAPTERS, "sarvam", _unavailable)
    monkeypatch.setitem(fill_slot_module._ADAPTERS, "local", _unavailable)
    monkeypatch.setattr(settings, "llm_provider", "sarvam")

    response = client.post(
        "/fill-slot",
        json={"slot_schema": _SCHEMA, "utterance": "it started suddenly", "context": {}},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["value"] is None
    assert body["confidence"] == 0.0
    assert body["needs_clarification"] is True


async def test_fill_slot_falls_through_to_local_when_sarvam_is_unavailable(monkeypatch):
    """The actual bug this guards against: /fill-slot used to be a plain if/elif on
    LLM_PROVIDER, so a down/unreachable Sarvam returned "unclear" immediately instead of
    falling through to the local tier — CLAUDE.md rule 9 (every external dependency has a local
    fallback) was violated for every call, not just LLM_PROVIDER=local ones."""
    calls: list[str] = []

    async def _sarvam_down(**kwargs):
        calls.append("sarvam")
        raise ProviderUnavailable("simulated: sarvam down")

    async def _local_ok(**kwargs):
        calls.append("local")
        return {"value": "sudden", "confidence": 0.9, "needs_clarification": False}

    monkeypatch.setitem(fill_slot_module._ADAPTERS, "sarvam", _sarvam_down)
    monkeypatch.setitem(fill_slot_module._ADAPTERS, "local", _local_ok)
    monkeypatch.setattr(settings, "llm_provider", "sarvam")

    result = await fill_slot(_SCHEMA, "it started suddenly", {})
    assert calls == ["sarvam", "local"]
    assert result.value == "sudden"
    assert result.needs_clarification is False


async def test_fill_slot_does_not_try_local_once_sarvam_succeeds(monkeypatch):
    calls: list[str] = []

    async def _sarvam_ok(**kwargs):
        calls.append("sarvam")
        return {"value": "gradual", "confidence": 0.8, "needs_clarification": False}

    async def _local_should_not_run(**kwargs):
        calls.append("local")
        return {"value": "sudden", "confidence": 0.9, "needs_clarification": False}

    monkeypatch.setitem(fill_slot_module._ADAPTERS, "sarvam", _sarvam_ok)
    monkeypatch.setitem(fill_slot_module._ADAPTERS, "local", _local_should_not_run)
    monkeypatch.setattr(settings, "llm_provider", "sarvam")

    result = await fill_slot(_SCHEMA, "it started gradually", {})
    assert calls == ["sarvam"]
    assert result.value == "gradual"
