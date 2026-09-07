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


# --- loosely-typed local-model tool-call output ------------------------------------------
# confirmed live against llama3.2:3b via Ollama's OpenAI-compatible endpoint 2026-09-07: its
# tool-call arguments are sometimes JSON string literals ("true"/"7") where the schema calls
# for a native bool/array/number. Python's bare bool("false") is True (any non-empty string is
# truthy) — silently inverting the field — and a bare "sweating" fails an array-typed
# comparison outright. These guard the fix (_coerce_bool / _coerce_value in fill_slot.py).


def test_coerce_bool_handles_string_true_false_and_native_bool():
    from app.llm.fill_slot import _coerce_bool

    assert _coerce_bool("true") is True
    assert _coerce_bool("false") is False
    assert _coerce_bool("True") is True
    assert _coerce_bool(True) is True
    assert _coerce_bool(False) is False


def test_coerce_value_wraps_a_bare_string_into_a_list_for_array_schema():
    from app.llm.fill_slot import _coerce_value

    array_schema = {"type": "array", "items": {"type": "string"}}
    assert _coerce_value("sweating", array_schema) == ["sweating"]
    assert _coerce_value(["sweating"], array_schema) == ["sweating"]
    assert _coerce_value(None, array_schema) is None


def test_coerce_value_converts_numeric_string_for_number_schema():
    from app.llm.fill_slot import _coerce_value

    number_schema = {"type": "number", "minimum": 0, "maximum": 10}
    assert _coerce_value("7", number_schema) == 7
    assert _coerce_value(7, number_schema) == 7
    assert _coerce_value("not a number", number_schema) == "not a number"


async def test_fill_slot_passes_the_local_specific_model_name_to_the_local_tier(monkeypatch):
    """The actual bug this guards: fill_slot used to pass settings.llm_slot_model (sarvam's
    model name, e.g. "sarvam-105b") to whichever adapter the cascade tried, including local —
    a self-hosted Ollama server asked for a model literally named "sarvam-105b" would 404. Never
    exercised before because LLM_BASE_URL was always empty until the local tier was wired up."""
    seen_models: dict[str, str] = {}

    async def _sarvam_down(**kwargs):
        seen_models["sarvam"] = kwargs["model"]
        raise ProviderUnavailable("simulated: sarvam down")

    async def _local_ok(**kwargs):
        seen_models["local"] = kwargs["model"]
        return {"value": "sudden", "confidence": 0.9, "needs_clarification": False}

    monkeypatch.setitem(fill_slot_module._ADAPTERS, "sarvam", _sarvam_down)
    monkeypatch.setitem(fill_slot_module._ADAPTERS, "local", _local_ok)
    monkeypatch.setattr(settings, "llm_provider", "sarvam")
    monkeypatch.setattr(settings, "llm_slot_model", "sarvam-105b")
    monkeypatch.setattr(settings, "llm_local_slot_model", "llama3.2:3b")

    await fill_slot(_SCHEMA, "it started suddenly", {})
    assert seen_models == {"sarvam": "sarvam-105b", "local": "llama3.2:3b"}


async def test_fill_slot_end_to_end_with_stringly_typed_local_model_output(monkeypatch):
    """The actual regression this guards: a local model (llama3.2:3b) returning
    needs_clarification as the string "false" and an array value as a bare string used to make
    a CORRECTLY extracted answer look wrong — bool("false") is True, and "sweating" != ["sweating"]."""

    async def _local_stringly_typed(**kwargs):
        return {"value": "sweating", "confidence": "1", "needs_clarification": "false"}

    monkeypatch.setitem(fill_slot_module._ADAPTERS, "sarvam", _local_stringly_typed)
    monkeypatch.setattr(settings, "llm_provider", "sarvam")

    array_schema = {"type": "array", "items": {"type": "string", "enum": ["sweating", "nausea"]}}
    result = await fill_slot(array_schema, "पसीना भी आता है", {})
    assert result.value == ["sweating"]
    assert result.confidence == 1.0
    assert result.needs_clarification is False
