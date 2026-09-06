"""Orchestrates the three-tier speech adapters behind one interface (docs/15-ai-stack.md).
`ASR_PROVIDER`/`TTS_PROVIDER` picks the *starting* tier — sarvam, bhashini or local — and from
there this always falls through the remaining tiers on failure, in the fixed order
sarvam -> bhashini -> local. Setting the provider to `local` deliberately skips the network
tiers entirely (that's the "rehearse the demo with the network physically off" mode); setting
it to `sarvam` (the default) still degrades automatically if Sarvam or Bhashini are down.

Why /transcribe is a batch REST call, not the live streaming WebSocket: this endpoint's
contract (packages/contracts/openapi/ai.yaml) takes one `audio_ref` and returns one complete
transcript — that's a batch shape. The streaming WS variant (partial transcripts via VAD
events, for the live turn-by-turn interview) is a lower-latency path the gateway would hold
open directly per session; wiring that is Day 2 voice-in-the-browser work, not this endpoint.
"""

from __future__ import annotations

from app.cascade import cascade
from app.config import settings
from app.speech import bhashini, local, sarvam
from app.speech.base import SynthesisResult, TranscriptResult
from app.speech.cache import get as cache_get
from app.speech.cache import put as cache_put

_CANONICAL_ORDER = ["sarvam", "bhashini", "local"]

_ASR_ADAPTERS = {"sarvam": sarvam.transcribe, "bhashini": bhashini.transcribe, "local": local.transcribe}
_TTS_ADAPTERS = {"sarvam": sarvam.synthesise, "bhashini": bhashini.synthesise, "local": local.synthesise}


def _tiers_from(provider: str) -> list[str]:
    if provider not in _CANONICAL_ORDER:
        raise ValueError(f"Unknown provider '{provider}', expected one of {_CANONICAL_ORDER}")
    start = _CANONICAL_ORDER.index(provider)
    return _CANONICAL_ORDER[start:]


async def transcribe(audio_bytes: bytes, language: str) -> TranscriptResult:
    tiers = [(name, lambda name=name: _ASR_ADAPTERS[name](audio_bytes, language)) for name in _tiers_from(settings.asr_provider)]
    return await cascade(tiers)


async def synthesise(text: str, language: str, voice: str | None = None) -> SynthesisResult:
    cached = cache_get(text, language, voice)
    if cached is not None:
        return cached

    tiers = [(name, lambda name=name: _TTS_ADAPTERS[name](text, language, voice)) for name in _tiers_from(settings.tts_provider)]
    result = await cascade(tiers)
    cache_put(text, language, voice, result)
    return result
