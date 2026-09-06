"""Hosted tier — a vision-capable model through the same LLM adapter shape services/ai uses
(OpenAI-compatible chat completions, image content block). **Unverified against a live
provider**: this repo has confirmed Sarvam's chat completions API for text (services/ai/app/llm/
sarvam.py), not for vision input — whether `sarvam-30b`/`105b` accept an `image_url` content
block hasn't been checked (no SARVAM_API_KEY in this environment, and docs/15-ai-stack.md
doesn't cover vision). Written against the widely-standardised OpenAI vision message format so
it's a small, contained fix if the real provider needs a different shape — same ASSUMED
discipline as docs/08-abdm-fhir.md's mock ABDM shapes.
"""

from __future__ import annotations

import base64

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
    if not settings.llm_base_url:
        raise ProviderUnavailable("LLM_BASE_URL is not set for the hosted OCR tier")

    try:
        with open(image_ref, "rb") as f:
            image_b64 = base64.b64encode(f.read()).decode("ascii")
    except OSError as exc:
        raise ProviderUnavailable(f"Could not read image_ref '{image_ref}': {exc}") from exc

    headers = {"Content-Type": "application/json"}
    if settings.llm_api_key:
        headers["Authorization"] = f"Bearer {settings.llm_api_key}"

    payload = {
        "model": "sarvam-30b",
        "messages": [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": _OCR_PROMPT},
                    {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{image_b64}"}},
                ],
            }
        ],
        "temperature": 0.0,
    }

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(f"{settings.llm_base_url.rstrip('/')}/chat/completions", json=payload, headers=headers)
            response.raise_for_status()
            data = response.json()
        text = data["choices"][0]["message"]["content"]
    except (httpx.HTTPError, KeyError, IndexError, ValueError) as exc:
        raise ProviderUnavailable(f"Hosted OCR call failed: {exc}") from exc

    return OcrResult(regions=[OcrRegion(text=text, bbox=_WHOLE_PAGE_BBOX, confidence=1.0, is_handwritten=False)])
