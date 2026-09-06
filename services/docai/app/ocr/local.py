"""Offline tier — what runs when the venue network dies. **Unexercised on this development
machine** — see docs/06-document-ai.md's "OCR reality check": paddlepaddle has no wheel for
this machine's Python 3.14 (works on 3.9-3.13, verified), and disk was at 100% capacity when
checked (PaddleOCR-VL-1.6's weights alone are ~1.8GB). Written correctly against the model's
own documented `transformers` usage (huggingface.co/docs/transformers/main/en/model_doc/paddleocr_vl),
same "correct but unexercised" status as services/ai/app/speech/local.py's offline ASR.

transformers/torch aren't in requirements.txt's default install (see the comment there) — this
module only imports them inside the function body, so a service without them installed still
starts fine and simply can't serve this one tier.
"""

from __future__ import annotations

import io

from app.cascade import ProviderUnavailable
from app.config import settings
from app.ocr.base import BoundingBox, OcrRegion, OcrResult

_pipe = None

# PaddleOCR-VL doesn't emit bounding boxes through the simple `pipeline("image-text-to-text")`
# API used here (that needs the full PaddleOCR-VL *pipeline*, not just the VLM component — see
# the model card's own warning that the two aren't equivalent). Flat page-level OCR at a single
# whole-page bbox is what's honest to claim from this call; per-region boxes need the fuller
# pipeline, which is real follow-up work, not something to fake here.
_WHOLE_PAGE_BBOX = BoundingBox(x=0.0, y=0.0, width=1.0, height=1.0)


def _load_pipeline():
    global _pipe
    if _pipe is not None:
        return _pipe
    try:
        from transformers import pipeline
    except ImportError as exc:
        raise ProviderUnavailable(f"transformers/torch not installed for local OCR: {exc}") from exc
    try:
        _pipe = pipeline("image-text-to-text", model="PaddlePaddle/PaddleOCR-VL", dtype="bfloat16")
    except Exception as exc:  # noqa: BLE001 - model download/load can fail in many ways
        raise ProviderUnavailable(f"Failed to load PaddleOCR-VL: {exc}") from exc
    return _pipe


async def read(image_ref: str) -> OcrResult:
    pipe = _load_pipeline()
    try:
        from PIL import Image
    except ImportError as exc:
        raise ProviderUnavailable(f"Pillow not installed: {exc}") from exc

    try:
        with open(image_ref, "rb") as f:
            image = Image.open(io.BytesIO(f.read()))
        messages = [{"role": "user", "content": [{"type": "image", "image": image}, {"type": "text", "text": "OCR:"}]}]
        result = pipe(text=messages)
        text = result[0]["generated_text"]
    except Exception as exc:  # noqa: BLE001
        raise ProviderUnavailable(f"Local OCR inference failed: {exc}") from exc

    return OcrResult(regions=[OcrRegion(text=text, bbox=_WHOLE_PAGE_BBOX, confidence=1.0, is_handwritten=False)])
