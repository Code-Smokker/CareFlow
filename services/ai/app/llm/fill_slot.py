"""One slot per call, structured output against the Pydantic/JSON schema for that slot only —
CLAUDE.md rule 1: this parses an answer into a typed slot, it never decides what to ask.
`slot_schema` is a plain JSON Schema fragment describing the target slot's value (e.g.
`{"type": "string", "enum": [...]}` for an `enum` slot, straight from packages/ontology) — the
caller (the gateway) builds it from the slot definition, this endpoint doesn't know about
ontology modules at all.
"""

from __future__ import annotations

from typing import Any

from app.cascade import AllProvidersUnavailable, cascade
from app.config import settings
from app.llm import openai_compatible, sarvam
from app.logging import get_logger

log = get_logger(component="fill_slot")

# Same two real tiers as app/ocr/service.py's hosted -> local (that module's own docstring notes
# OCR has no documented second-cloud option either) — docs/15-ai-stack.md's LLM table is
# "Sarvam-30B (API) -> same weights self-hosted", not three distinct providers. Before this, a
# plain if/elif on LLM_PROVIDER meant a down/unreachable Sarvam returned "unclear" straight
# away instead of falling through to local — CLAUDE.md rule 9 (every external dependency has a
# local fallback) was violated for every fill-slot call, not just ones on LLM_PROVIDER=local.
_CANONICAL_ORDER = ["sarvam", "local"]
_ADAPTERS = {"sarvam": sarvam.call_tool, "local": openai_compatible.call_tool}


def _tiers_from(provider: str) -> list[str]:
    if provider not in _CANONICAL_ORDER:
        raise ValueError(f"Unknown LLM_PROVIDER '{provider}', expected one of {_CANONICAL_ORDER}")
    start = _CANONICAL_ORDER.index(provider)
    return _CANONICAL_ORDER[start:]


_SYSTEM_PROMPT = (
    "You extract exactly one clinical intake slot's value from a patient's utterance. "
    "Use only what the utterance actually states — never infer, assume or guess. "
    "If the utterance does not clearly answer this slot, set needs_clarification to true "
    "and value to null. Never fabricate a value to fill the field."
)

_TOOL_NAME = "set_slot_value"
_TOOL_DESCRIPTION = "Record the parsed value for this one slot, with a confidence score."


def _wrapped_schema(slot_schema: dict[str, Any]) -> dict[str, Any]:
    return {
        "type": "object",
        "properties": {
            "value": slot_schema,
            "confidence": {
                "type": "number",
                "minimum": 0,
                "maximum": 1,
                "description": "How confident you are that `value` is correct, 0-1.",
            },
            "needs_clarification": {
                "type": "boolean",
                "description": "True if the utterance did not clearly answer this slot.",
            },
        },
        "required": ["value", "confidence", "needs_clarification"],
    }


def _user_prompt(slot_schema: dict[str, Any], utterance: str, context: dict[str, Any]) -> str:
    lines = [f"Slot schema: {slot_schema}", f'Patient said: "{utterance}"']
    if context:
        lines.append(f"Context (already-known answers this turn): {context}")
    return "\n".join(lines)


def _coerce_bool(value: Any) -> bool:
    """Some local/quantized models' tool-calling templates emit JSON string literals
    ("true"/"false") for boolean parameters instead of native JSON booleans — confirmed live
    against llama3.2:3b via Ollama's OpenAI-compatible endpoint 2026-09-07. Python's bare
    bool("false") is True (any non-empty string is truthy), which would silently invert this
    field for every local-tier call on such a model. Never trust bool() directly on a value
    that might be a string."""
    if isinstance(value, str):
        return value.strip().lower() in ("true", "1", "yes")
    return bool(value)


def _coerce_value(value: Any, slot_schema: dict[str, Any]) -> Any:
    """Same local-model quirk, different shapes — confirmed live against llama3.2:3b via
    Ollama: an array-typed slot's value sometimes comes back as a bare string ("sweating")
    instead of a single-item list (["sweating"]), and a number-typed slot's value sometimes
    comes back as a numeric string ("7") instead of a JSON number (7). The content is right,
    only the shape is wrong. Reshape, don't guess: anything that isn't cleanly convertible
    passes through unchanged rather than raising, so a genuinely wrong/non-numeric value still
    surfaces as a visible mismatch instead of a silent 500."""
    schema_type = slot_schema.get("type")
    if schema_type == "array" and isinstance(value, str):
        return [value]
    if schema_type in ("number", "integer") and isinstance(value, str):
        try:
            number = float(value)
            return int(number) if schema_type == "integer" or number.is_integer() else number
        except ValueError:
            return value
    return value


class FillSlotResult:
    def __init__(self, value: Any, confidence: float, needs_clarification: bool):
        self.value = value
        self.confidence = confidence
        self.needs_clarification = needs_clarification


async def fill_slot(slot_schema: dict[str, Any], utterance: str, context: dict[str, Any]) -> FillSlotResult:
    parameters_schema = _wrapped_schema(slot_schema)
    user_prompt = _user_prompt(slot_schema, utterance, context)

    def _call(name: str):
        # local has its own model name (LLM_LOCAL_SLOT_MODEL) — sarvam and a self-hosted Ollama
        # server are different providers with different model catalogues, so llm_slot_model
        # (sarvam's) can't just be reused for local too (see config.py's comment on this field).
        model = settings.llm_local_slot_model if name == "local" else settings.llm_slot_model
        return _ADAPTERS[name](
            model=model,
            system_prompt=_SYSTEM_PROMPT,
            user_prompt=user_prompt,
            tool_name=_TOOL_NAME,
            tool_description=_TOOL_DESCRIPTION,
            parameters_schema=parameters_schema,
        )

    tiers = [(name, lambda name=name: _call(name)) for name in _tiers_from(settings.llm_provider)]
    try:
        args = await cascade(tiers)
    except AllProvidersUnavailable as exc:
        # Never guess (docs/05-interview-engine.md "Always honest") — every tier unreachable
        # means an honest "unclear", not a fabricated value.
        log.warning("fill_slot: all LLM providers unavailable, returning unclear", error=str(exc))
        return FillSlotResult(value=None, confidence=0.0, needs_clarification=True)

    value = _coerce_value(args.get("value"), slot_schema)
    confidence = float(args.get("confidence", 0.0))
    needs_clarification = _coerce_bool(args.get("needs_clarification", False))
    return FillSlotResult(value=value, confidence=confidence, needs_clarification=needs_clarification)
