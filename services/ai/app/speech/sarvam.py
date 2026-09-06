"""Sarvam Saaras v3 (STT, batch REST — see the module docstring in app/speech/service.py for
why batch rather than the streaming WS variant for this endpoint) and Bulbul v2 (TTS), via the
official `sarvamai` SDK. docs/15-ai-stack.md.
"""

from __future__ import annotations

import base64

from app.cascade import ProviderUnavailable
from app.config import settings
from app.speech.base import SynthesisResult, TranscriptResult, TranscriptSegment


def _client():
    if not settings.sarvam_api_key:
        raise ProviderUnavailable("SARVAM_API_KEY is not set")
    try:
        from sarvamai import AsyncSarvamAI
    except ImportError as exc:  # pragma: no cover - dependency always listed, defensive only
        raise ProviderUnavailable(f"sarvamai SDK not installed: {exc}") from exc
    return AsyncSarvamAI(api_subscription_key=settings.sarvam_api_key)


async def transcribe(audio_bytes: bytes, language: str) -> TranscriptResult:
    client = _client()
    try:
        response = await client.speech_to_text.transcribe(
            file=("audio.wav", audio_bytes, "audio/wav"),
            model=settings.sarvam_stt_model,
            mode=settings.sarvam_stt_mode,
            language_code=language or "unknown",
            with_timestamps=True,
        )
    except Exception as exc:  # noqa: BLE001 - any transport/API failure means "try the next tier"
        raise ProviderUnavailable(f"Sarvam STT failed: {exc}") from exc

    segments: list[TranscriptSegment] = []
    if response.timestamps:
        t = response.timestamps
        for text, start_s, end_s in zip(t.words, t.start_time_seconds, t.end_time_seconds):
            segments.append(
                TranscriptSegment(text=text, start_ms=int(start_s * 1000), end_ms=int(end_s * 1000), confidence=1.0)
            )
    confidence = response.language_probability if response.language_probability is not None else 1.0
    return TranscriptResult(text=response.transcript, confidence=confidence, segments=segments)


async def synthesise(text: str, language: str, voice: str | None) -> SynthesisResult:
    client = _client()
    try:
        response = await client.text_to_speech.convert(
            text=text,
            language_code=language,
            model=settings.sarvam_tts_model,
            speaker=voice or settings.sarvam_tts_speaker or None,
        )
    except Exception as exc:  # noqa: BLE001
        raise ProviderUnavailable(f"Sarvam TTS failed: {exc}") from exc

    if not response.audios:
        raise ProviderUnavailable("Sarvam TTS returned no audio")
    return SynthesisResult(audio_bytes=base64.b64decode(response.audios[0]), content_type="audio/wav")
