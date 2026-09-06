"""Offline tier — what runs when the venue network dies (docs/01-architecture.md
"Degradation"). Heavy: needs `transformers`, `torch`, `torchaudio` (ASR) and `soundfile`
(TTS) installed — none of those are in requirements.txt's default install (see the comment
there); this module only imports them inside the function body, so a service without them
installed still starts fine and simply can't serve this one tier.

ASR: ai4bharat/indic-conformer-600m-multilingual — MIT, 600M params, hybrid CTC+RNNT, per its
model card (huggingface.co/ai4bharat/indic-conformer-600m-multilingual).

TTS: ai4bharat/IndicF5 — voice-cloning style: needs a reference prompt (audio + its transcript)
per language, not a simple voice picker. Reference prompts are expected at
`<LOCAL_TTS_REF_AUDIO_DIR>/<language>.wav` + `<language>.txt`; this repo doesn't ship any yet
(see infra/seed/), so this tier raises a clear ProviderUnavailable until they're added.
"""

from __future__ import annotations

import io
from pathlib import Path

from app.cascade import ProviderUnavailable
from app.config import settings
from app.speech.base import SynthesisResult, TranscriptResult

_asr_model = None
_tts_model = None


def _load_asr_model():
    global _asr_model
    if _asr_model is not None:
        return _asr_model
    if not settings.local_asr_enabled:
        raise ProviderUnavailable("LOCAL_ASR_ENABLED=false")
    try:
        from transformers import AutoModel
    except ImportError as exc:
        raise ProviderUnavailable(f"transformers/torch not installed for local ASR: {exc}") from exc
    try:
        _asr_model = AutoModel.from_pretrained(settings.local_asr_model, trust_remote_code=True)
    except Exception as exc:  # noqa: BLE001 - model download/load can fail in many ways
        raise ProviderUnavailable(f"Failed to load local ASR model: {exc}") from exc
    return _asr_model


async def transcribe(audio_bytes: bytes, language: str) -> TranscriptResult:
    model = _load_asr_model()
    try:
        import torch
        import torchaudio
    except ImportError as exc:
        raise ProviderUnavailable(f"torch/torchaudio not installed: {exc}") from exc

    try:
        wav, sr = torchaudio.load(io.BytesIO(audio_bytes))
        wav = torch.mean(wav, dim=0, keepdim=True)
        if sr != 16000:
            wav = torchaudio.transforms.Resample(orig_freq=sr, new_freq=16000)(wav)
        lang_code = (language or "hi").split("-")[0]
        text = model(wav, lang_code, "rnnt")
    except Exception as exc:  # noqa: BLE001
        raise ProviderUnavailable(f"Local ASR inference failed: {exc}") from exc

    return TranscriptResult(text=str(text), confidence=1.0, segments=[])


def _load_tts_model():
    global _tts_model
    if _tts_model is not None:
        return _tts_model
    try:
        from transformers import AutoModel
    except ImportError as exc:
        raise ProviderUnavailable(f"transformers/torch not installed for local TTS: {exc}") from exc
    try:
        _tts_model = AutoModel.from_pretrained(settings.local_tts_model, trust_remote_code=True)
    except Exception as exc:  # noqa: BLE001
        raise ProviderUnavailable(f"Failed to load local TTS model: {exc}") from exc
    return _tts_model


async def synthesise(text: str, language: str, voice: str | None) -> SynthesisResult:
    ref_dir = Path(settings.tts_cache_dir).parent / "tts-ref-prompts"
    lang_code = (language or "hi").split("-")[0]
    ref_wav = ref_dir / f"{lang_code}.wav"
    ref_txt = ref_dir / f"{lang_code}.txt"
    if not (ref_wav.exists() and ref_txt.exists()):
        raise ProviderUnavailable(
            f"No local TTS reference prompt for language '{lang_code}' at {ref_dir} "
            "(IndicF5 needs a reference audio + transcript per language — see infra/seed/)"
        )

    model = _load_tts_model()
    try:
        import numpy as np
        import soundfile as sf
    except ImportError as exc:
        raise ProviderUnavailable(f"numpy/soundfile not installed: {exc}") from exc

    try:
        audio = model(text, ref_audio_path=str(ref_wav), ref_text=ref_txt.read_text(encoding="utf-8"))
        if audio.dtype == np.int16:
            audio = audio.astype(np.float32) / 32768.0
        buffer = io.BytesIO()
        sf.write(buffer, np.asarray(audio, dtype=np.float32), samplerate=24000, format="WAV")
    except Exception as exc:  # noqa: BLE001
        raise ProviderUnavailable(f"Local TTS inference failed: {exc}") from exc

    return SynthesisResult(audio_bytes=buffer.getvalue(), content_type="audio/wav")
