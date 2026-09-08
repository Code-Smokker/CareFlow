"""Orchestrates the OCR tiers behind one interface. `OCR_PROVIDER` picks the *starting* tier —
hosted, local or stub — and from there this falls through the remaining tiers on failure, in
the fixed order hosted -> local -> stub. Same shape as services/ai/app/speech/service.py, minus
a second cloud tier (OCR has no documented Bhashini-equivalent second option)."""

from __future__ import annotations

from app.cascade import cascade
from app.config import settings
from app.ocr import hosted, local, stub
from app.ocr.base import OcrResult

_CANONICAL_ORDER = ["hosted", "local", "stub"]
_ADAPTERS = {"hosted": hosted.read, "local": local.read, "stub": stub.read}


def _tiers_from(provider: str) -> list[str]:
    if provider not in _CANONICAL_ORDER:
        raise ValueError(f"Unknown OCR_PROVIDER '{provider}', expected one of {_CANONICAL_ORDER}")
    start = _CANONICAL_ORDER.index(provider)
    return _CANONICAL_ORDER[start:]


async def read(image_ref: str) -> OcrResult:
    tiers = [(name, lambda name=name: _ADAPTERS[name](image_ref)) for name in _tiers_from(settings.ocr_provider)]
    return await cascade(tiers, capability="docai.ocr")
