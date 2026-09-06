from typing import Any, Literal

from pydantic import BaseModel

# Below this, a field is marked low_confidence — never dropped, never guessed
# (docs/05-interview-engine.md "Always honest").
LOW_CONFIDENCE_THRESHOLD = 0.6

InputMode = Literal["voice", "tap", "bodymap", "proxy", "ocr"]


class SummaryField(BaseModel):
    """Every stored fact carries provenance and confidence (CLAUDE.md rule 4). `ref` is the
    audio offset in ms for a voice answer, or the slot_id otherwise — there's no transcript
    position to point to for a tapped answer."""

    label: str
    value: Any
    source: InputMode
    confidence: float
    ref: str
    low_confidence: bool
