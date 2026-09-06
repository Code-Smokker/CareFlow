"""C2's real extraction pipeline, replacing app/extract/stub.py in app/tasks.py: GLiNER two-pass
-> LLM remainder for what GLiNER missed -> dictionary fuzzy-match shortlist (docs/15-ai-stack.md).
One ExtractedField per entity (not per OCR region, unlike the stub) — bounding_box and
needs_confirmation are still inherited from the source region, since GLiNER/the LLM only see
that region's text, not its geometry.

If GLiNER can't run at all (not installed, or fails to load its weights) AND the LLM remainder
pass is also unavailable, there is nothing honest to extract beyond raw text — this falls back
to app.extract.stub's per-region raw_text fields rather than raising and failing the whole
Celery job (CLAUDE.md rule 9 / docs/06: "if it fails entirely, the summary is still complete").
"""

from __future__ import annotations

from typing import Any

from app.cascade import ProviderUnavailable
from app.dictionary import search as dictionary_search
from app.extract import gliner_ner, llm_remainder
from app.extract import stub as stub_extractor
from app.logging import get_logger
from app.ocr.base import OcrResult, OcrRegion

log = get_logger(component="extract_pipeline")

_DICTIONARY_SYSTEM_BY_LABEL = {
    "drug": "allopathic",
    "ayush_formulation": "ayush_formulation",
    "ayush_plant": "ayush_plant",
}
_LOW_CONFIDENCE_THRESHOLD = 0.4  # below this, GLiNER "found" the region but weakly enough to
# also run the LLM remainder pass over it, rather than skip that pass entirely.


async def _dictionary_matches(label: str, text: str) -> list[str]:
    system = _DICTIONARY_SYSTEM_BY_LABEL.get(label)
    if system is None:
        return []
    results = await dictionary_search.search(text, system, limit=3)
    return [r["canonical_name"] for r in results]


async def _extract_region(region: OcrRegion) -> list[dict[str, Any]]:
    try:
        gliner_entities = gliner_ner.extract_two_pass(region.text)
    except ProviderUnavailable as exc:
        log.warning("gliner unavailable for region, falling back to LLM-only", error=str(exc))
        gliner_entities = []

    fields: list[dict[str, Any]] = []
    covered_high_confidence = False
    for entity in gliner_entities:
        matches = await _dictionary_matches(entity.label, entity.text)
        fields.append(
            {
                "field": entity.label,
                "value": entity.text,
                # Combine OCR-region confidence and NER-entity confidence: either being wrong
                # should pull the combined score down, so the product (not e.g. min) is used.
                "confidence": region.confidence * entity.score,
                "bounding_box": {
                    "x": region.bbox.x,
                    "y": region.bbox.y,
                    "width": region.bbox.width,
                    "height": region.bbox.height,
                },
                "needs_confirmation": region.is_handwritten,
                "dictionary_matches": matches,
            }
        )
        if entity.score >= _LOW_CONFIDENCE_THRESHOLD:
            covered_high_confidence = True

    if not covered_high_confidence:
        remainder = await llm_remainder.extract_remainder(region.text)
        for entity in remainder:
            matches = await _dictionary_matches(entity.label, entity.text)
            fields.append(
                {
                    "field": entity.label,
                    "value": entity.text,
                    "confidence": region.confidence * entity.confidence,
                    "bounding_box": {
                        "x": region.bbox.x,
                        "y": region.bbox.y,
                        "width": region.bbox.width,
                        "height": region.bbox.height,
                    },
                    "needs_confirmation": region.is_handwritten,
                    "dictionary_matches": matches,
                }
            )

    return fields


async def extract(ocr_result: OcrResult) -> list[dict[str, Any]]:
    all_fields: list[dict[str, Any]] = []
    any_entity_found = False
    for region in ocr_result.regions:
        region_fields = await _extract_region(region)
        if region_fields:
            any_entity_found = True
        all_fields.extend(region_fields)

    if not any_entity_found and ocr_result.regions:
        # Neither GLiNER nor the LLM remainder pass produced anything for any region — most
        # likely both are unavailable in this environment. Fall back to the stub's raw-text
        # fields so the job still produces something rather than an empty, misleadingly "clean"
        # result (docs/06: a partial/degraded result beats a silent failure).
        log.warning("no entities extracted by any tier, falling back to stub raw-text fields")
        return stub_extractor.extract(ocr_result)

    return all_fields
