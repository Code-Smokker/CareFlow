"""Stub extractor — this task's explicit "no model work yet". Returns fixed ExtractedField
entries matching packages/contracts/openapi/docai.yaml's ProcessResult shape regardless of
what the OCR tier actually read, so the rest of the pipeline (persistence, WS delivery,
gateway UI) can be built and proven before any real entity extraction exists. C2 replaces
this with the two-pass allopathic+Ayurveda merge.
"""

from __future__ import annotations

from typing import Any

from app.ocr.base import OcrResult


def extract(ocr_result: OcrResult) -> list[dict[str, Any]]:
    """One ExtractedField per OCR region, carrying that region's own bbox/confidence/
    handwritten flag through untouched (CLAUDE.md rule 5 — handwritten stays needs_confirmation)."""
    return [
        {
            "field": "raw_text",
            "value": region.text,
            "confidence": region.confidence,
            "bounding_box": {
                "x": region.bbox.x,
                "y": region.bbox.y,
                "width": region.bbox.width,
                "height": region.bbox.height,
            },
            "needs_confirmation": region.is_handwritten,
            "dictionary_matches": [],
        }
        for region in ocr_result.regions
    ]
