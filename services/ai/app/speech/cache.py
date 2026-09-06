"""Disk cache for synthesised audio, keyed on (text, language, voice) — the prompt set is
finite (docs/15-ai-stack.md: "a few hundred prompts across five modules and every language"),
so after the first run almost all playback is instant and free, which is also how the 1.2s
turn budget gets hit.
"""

from __future__ import annotations

import hashlib
from pathlib import Path

from app.config import settings
from app.speech.base import SynthesisResult


def cache_path(text: str, language: str, voice: str | None) -> Path:
    key = f"{language}\x1f{voice or ''}\x1f{text}"
    digest = hashlib.sha256(key.encode("utf-8")).hexdigest()
    return Path(settings.tts_cache_dir) / f"{digest}.wav"


def get(text: str, language: str, voice: str | None) -> SynthesisResult | None:
    path = cache_path(text, language, voice)
    if not path.exists():
        return None
    return SynthesisResult(audio_bytes=path.read_bytes(), content_type="audio/wav")


def put(text: str, language: str, voice: str | None, result: SynthesisResult) -> Path:
    path = cache_path(text, language, voice)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(result.audio_bytes)
    return path
