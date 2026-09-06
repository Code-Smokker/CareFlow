from __future__ import annotations

from dataclasses import dataclass, field


@dataclass
class BoundingBox:
    x: float
    y: float
    width: float
    height: float


@dataclass
class OcrRegion:
    text: str
    bbox: BoundingBox
    confidence: float
    is_handwritten: bool  # drives needs_confirmation downstream — CLAUDE.md rule 5


@dataclass
class OcrResult:
    regions: list[OcrRegion] = field(default_factory=list)
