"""One slot per call, structured output against the Pydantic/JSON schema for that slot only —
CLAUDE.md rule 1: this parses an answer into a typed slot, it never decides what to ask.
`slot_schema` is a plain JSON Schema fragment describing the target slot's value (e.g.
`{"type": "string", "enum": [...]}` for an `enum` slot, straight from packages/ontology) — the
caller (the gateway) builds it from the slot definition, this endpoint doesn't know about
ontology modules at all.
"""

from __future__ import annotations

from typing import Any

from app.config import settings
from app.llm import openai_compatible, sarvam
from app.llm.base import ProviderUnavailable
from app.logging import get_logger

log = get_logger(component="fill_slot")

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


class FillSlotResult:
    def __init__(self, value: Any, confidence: float, needs_clarification: bool):
        self.value = value
        self.confidence = confidence
        self.needs_clarification = needs_clarification


async def fill_slot(slot_schema: dict[str, Any], utterance: str, context: dict[str, Any]) -> FillSlotResult:
    parameters_schema = _wrapped_schema(slot_schema)
    user_prompt = _user_prompt(slot_schema, utterance, context)

    try:
        if settings.llm_provider == "sarvam":
            args = await sarvam.call_tool(
                model=settings.llm_slot_model,
                system_prompt=_SYSTEM_PROMPT,
                user_prompt=user_prompt,
                tool_name=_TOOL_NAME,
                tool_description=_TOOL_DESCRIPTION,
                parameters_schema=parameters_schema,
            )
        elif settings.llm_provider == "local":
            args = await openai_compatible.call_tool(
                model=settings.llm_slot_model,
                system_prompt=_SYSTEM_PROMPT,
                user_prompt=user_prompt,
                tool_name=_TOOL_NAME,
                tool_description=_TOOL_DESCRIPTION,
                parameters_schema=parameters_schema,
            )
        else:
            raise ProviderUnavailable(f"LLM_PROVIDER={settings.llm_provider!r} is not implemented yet")
    except ProviderUnavailable as exc:
        # Never guess (docs/05-interview-engine.md "Always honest") — an unreachable model
        # means an honest "unclear", not a fabricated value.
        log.warning("fill_slot provider unavailable, returning unclear", error=str(exc))
        return FillSlotResult(value=None, confidence=0.0, needs_clarification=True)

    value = args.get("value")
    confidence = float(args.get("confidence", 0.0))
    needs_clarification = bool(args.get("needs_clarification", False))
    return FillSlotResult(value=value, confidence=confidence, needs_clarification=needs_clarification)
