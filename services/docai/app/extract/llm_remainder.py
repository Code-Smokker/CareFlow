"""LLM structured-output pass for the "messy remainder" — regions GLiNER found nothing in, or
only low-confidence entities (docs/15-ai-stack.md: "GLiNER for the structured pass -> LLM
structured output for the messy remainder"). Never fabricates an entity to fill a gap — same
never-guess discipline as services/ai/app/llm/fill_slot.py's system prompt. A region with truly
nothing extractable comes back with an empty entity list, not an invented one.
"""

from __future__ import annotations

from dataclasses import dataclass

from app.config import settings
from app.llm import openai_compatible
from app.llm.base import ProviderUnavailable
from app.logging import get_logger

log = get_logger(component="llm_remainder")

_SYSTEM_PROMPT = (
    "You extract clinical entities (drug names, doses, frequencies, durations, diagnoses, "
    "lab analytes with values and units, procedures, dates, AYUSH formulations, AYUSH plant "
    "names) from OCR'd text from an Indian medical document. Use only what the text actually "
    "states — never infer, assume or guess a value. If nothing extractable is present, return "
    "an empty list. Never invent an entity to fill a gap."
)

_TOOL_NAME = "record_entities"
_TOOL_DESCRIPTION = "Record the clinical entities found in this text region, if any."

_PARAMETERS_SCHEMA = {
    "type": "object",
    "properties": {
        "entities": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "label": {"type": "string"},
                    "text": {"type": "string"},
                    "confidence": {"type": "number", "minimum": 0, "maximum": 1},
                },
                "required": ["label", "text", "confidence"],
            },
        }
    },
    "required": ["entities"],
}


@dataclass
class RemainderEntity:
    label: str
    text: str
    confidence: float


async def extract_remainder(region_text: str) -> list[RemainderEntity]:
    try:
        args = await openai_compatible.call_tool(
            model=settings.llm_provider,
            system_prompt=_SYSTEM_PROMPT,
            user_prompt=f'Text region: "{region_text}"',
            tool_name=_TOOL_NAME,
            tool_description=_TOOL_DESCRIPTION,
            parameters_schema=_PARAMETERS_SCHEMA,
        )
    except ProviderUnavailable as exc:
        # Optional pass — GLiNER already ran. Log and return nothing extra, never fabricate.
        log.warning("llm remainder pass unavailable, skipping", error=str(exc))
        return []

    return [
        RemainderEntity(
            label=str(e.get("label", "")),
            text=str(e.get("text", "")),
            confidence=float(e.get("confidence", 0.0)),
        )
        for e in args.get("entities", [])
        if e.get("text")
    ]
