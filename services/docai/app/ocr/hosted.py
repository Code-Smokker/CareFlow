"""Hosted tier — Gemini (Google AI Studio), not the Sarvam-shaped LLM_* adapter services/ai
uses. Verified live 2026-09-07: Sarvam's chat completions API rejects an OpenAI-style
`image_url` content block outright ("body.messages.0.user.content: Input should be a valid
string") — it's a text-only endpoint, not a config gap this repo can just point elsewhere.
Gemini's `generateContent` REST API (inline base64 image data, not a data: URL) is what's
actually wired here, confirmed against a real prescription photo (see the README's OCR reality
check for the timing/output).

OCR_MODEL is picked by calling `GET {OCR_BASE_URL}/models` with the real key and choosing from
what's actually returned — see docs/API_KEYS.md and .env's OCR_MODEL comment for the specific
model and why. Never hardcode a guessed model name here; Gemini's lineup changes.
"""

from __future__ import annotations

import base64
import mimetypes

import httpx

from app.cascade import ProviderUnavailable
from app.config import settings
from app.ocr.base import BoundingBox, OcrRegion, OcrResult

_WHOLE_PAGE_BBOX = BoundingBox(x=0.0, y=0.0, width=1.0, height=1.0)
_OCR_PROMPT = (
    "Transcribe every line of text in this image exactly as written, including handwritten "
    "text. Output only the transcribed text, nothing else."
)


async def read(image_ref: str) -> OcrResult:
    if not settings.ocr_api_key:
        raise ProviderUnavailable("OCR_API_KEY is not set for the hosted OCR tier")
    if not settings.ocr_model:
        raise ProviderUnavailable(
            "OCR_MODEL is not set — pick one from GET {OCR_BASE_URL}/models against the real "
            "key rather than guessing a name here (see .env's OCR_MODEL comment)"
        )

    try:
        with open(image_ref, "rb") as f:
            image_bytes = f.read()
    except OSError as exc:
        raise ProviderUnavailable(f"Could not read image_ref '{image_ref}': {exc}") from exc

    mime_type = mimetypes.guess_type(image_ref)[0] or "image/jpeg"
    image_b64 = base64.b64encode(image_bytes).decode("ascii")

    payload = {
        "contents": [
            {
                "parts": [
                    {"text": _OCR_PROMPT},
                    {"inline_data": {"mime_type": mime_type, "data": image_b64}},
                ]
            }
        ]
    }
    url = f"{settings.ocr_base_url.rstrip('/')}/models/{settings.ocr_model}:generateContent"

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(url, params={"key": settings.ocr_api_key}, json=payload)
            response.raise_for_status()
            data = response.json()
        text = data["candidates"][0]["content"]["parts"][0]["text"]
    except (httpx.HTTPError, KeyError, IndexError, ValueError) as exc:
        raise ProviderUnavailable(f"Hosted OCR call failed: {exc}") from exc

    return OcrResult(regions=[OcrRegion(text=text, bbox=_WHOLE_PAGE_BBOX, confidence=1.0, is_handwritten=False)])
