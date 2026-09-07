"""Offline tier — what runs when the venue network dies. **Exercised live, still broken** — not
for the reason this docstring used to claim (transformers/torch DO have Python 3.14 wheels;
that part was wrong). The real blocker, diagnosed two levels deep as of 2026-09-07: PaddleOCR-VL's
remote modeling code doesn't register its config class into transformers' AutoModelForImageTextToText
mapping, so the pipeline() call below fails on every transformers version tried. Loading the
model's own class directly (bypassing pipeline()) was tried as the suspected real fix and hits
a *second*, unrelated incompatibility instead — a RoPE init function KeyError, since transformers
5.13.1 removed the 'default' rope_type this vendor's code still expects. See
docs/06-document-ai.md's "OCR reality check" for the full diagnosis (both errors, exact
versions) — kept there, not duplicated here, so there's one place to update instead of two
drifting copies. Separately (and already fixed here): the pipeline() call is missing
trust_remote_code=True — a straight bug, not a version issue — which made this hang forever on
an interactive y/N confirmation prompt in any non-interactive process instead of raising
ProviderUnavailable like every other tier failure.

transformers/torch aren't in requirements.txt's default install (see the comment there) — this
module only imports them inside the function body, so a service without them installed still
starts fine and simply can't serve this one tier.
"""

from __future__ import annotations

import io

from app.cascade import ProviderUnavailable
from app.config import settings
from app.ocr.base import BoundingBox, OcrRegion, OcrResult
from app.ocr.image_source import read_bytes

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
        # trust_remote_code=True is required, not optional — PaddleOCR-VL ships custom modeling
        # code, and without this flag transformers blocks on an interactive y/N confirmation
        # prompt at load time. In any non-interactive process (this service under uvicorn, a
        # container, CI) that prompt never gets an answer: the call hangs forever rather than
        # raising ProviderUnavailable, silently breaking the tier's whole "never crashes, always
        # fails over" cascade contract. Verified live 2026-09-07 — this hung indefinitely
        # (~0% CPU, no output) until the flag was added.
        _pipe = pipeline(
            "image-text-to-text", model="PaddlePaddle/PaddleOCR-VL", dtype="bfloat16", trust_remote_code=True
        )
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
        image_bytes = await read_bytes(image_ref)
        image = Image.open(io.BytesIO(image_bytes))
        messages = [{"role": "user", "content": [{"type": "image", "image": image}, {"type": "text", "text": "OCR:"}]}]
        result = pipe(text=messages)
        text = result[0]["generated_text"]
    except Exception as exc:  # noqa: BLE001
        raise ProviderUnavailable(f"Local OCR inference failed: {exc}") from exc

    return OcrResult(regions=[OcrRegion(text=text, bbox=_WHOLE_PAGE_BBOX, confidence=1.0, is_handwritten=False)])
