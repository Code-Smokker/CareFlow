from __future__ import annotations

from dataclasses import dataclass, field


@dataclass
class TranscriptSegment:
    text: str
    start_ms: int
    end_ms: int
    confidence: float


@dataclass
class TranscriptResult:
    text: str
    confidence: float
    segments: list[TranscriptSegment] = field(default_factory=list)


@dataclass
class SynthesisResult:
    audio_bytes: bytes
    content_type: str = "audio/wav"
