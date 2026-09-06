"""Always available — this is what makes the skeleton walk before any model exists
(docs/06-document-ai.md, this task's explicit "no model work yet"). Returns the same fixed
regions regardless of input, deliberately."""

from __future__ import annotations

from app.ocr.base import BoundingBox, OcrRegion, OcrResult


async def read(image_ref: str) -> OcrResult:
    return OcrResult(
        regions=[
            OcrRegion(
                text="Dolo 650",
                bbox=BoundingBox(x=0.1, y=0.2, width=0.3, height=0.05),
                confidence=0.5,
                is_handwritten=True,  # exercises the "never auto-accepted" path even in stub mode
            ),
            OcrRegion(
                text="Fever",
                bbox=BoundingBox(x=0.1, y=0.1, width=0.2, height=0.04),
                confidence=0.95,
                is_handwritten=False,
            ),
        ]
    )
