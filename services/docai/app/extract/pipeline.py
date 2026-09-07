"""C2's real extraction pipeline, replacing app/extract/stub.py in app/tasks.py: GLiNER two-pass
-> LLM remainder for what GLiNER missed -> dictionary fuzzy-match shortlist (docs/15-ai-stack.md).
One ExtractedField per entity (not per OCR region, unlike the stub) — bounding_box and
needs_confirmation are still inherited from the source region, since GLiNER/the LLM only see
that region's text, not its geometry.

If GLiNER can't run at all (not installed, or fails to load its weights) AND the LLM remainder
pass is also unavailable, there is nothing honest to extract beyond raw text — this falls back
to app.extract.stub's per-region raw_text fields rather than raising and failing the whole
Celery job (CLAUDE.md rule 9 / docs/06: "if it fails entirely, the summary is still complete").

For a medication-like span, GLiNER's label is not trusted for which dictionary to search — and
is no longer trusted at all as a fallback once dictionary lookup comes up empty. It labels a
span "a drug" or "an AYUSH formulation" based on which zero-shot label set fits best, not on
which dictionary the name actually lives in, and its allopathic pass routinely wins that contest
on real AYUSH formulations, at high confidence (0.96-0.97 seen on real prescriptions), because
the AYUSH label set simply never got a chance to compete for spans it should have won. The fix:
the DICTIONARY decides `system`, never the model. `_resolve_medication` always checks the AFI
(Ayurvedic Formulary of India) dictionary first and only falls back to allopathic if AFI has no
match — so a real classical formulation can never lose to an allopathic false-positive the way
it used to. If nothing matches anywhere, the span is reported as `system = "unknown"` at
capped-low confidence rather than trusting GLiNER's guess (CLAUDE.md rule 4: never silently
guess a stored fact's identity).

Deliberately out of scope here: the separate `ayush_plant` dictionary (single herbs/dravyas,
not classical formulations) is not queried by this precedence chain. A span GLiNER calls
"ayush_plant" still goes through _resolve_medication like any other medication-shaped span —
AFI, then allopathic, then unknown — so a plant name with no AFI or allopathic entry correctly
comes back "unknown" rather than silently matching on the plant dictionary. Wiring plant lookup
in as its own tier is future work if it turns out real prescriptions need it.
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

_LOW_CONFIDENCE_THRESHOLD = 0.4  # below this, GLiNER "found" the region but weakly enough to
# also run the LLM remainder pass over it, rather than skip that pass entirely.

# Labels (from either GLiNER pass or the LLM remainder pass) that name a medication and so need
# a dictionary lookup at all. Everything else (dose, frequency, diagnosis, analyte, dosha, ...)
# is passed through untouched. GLiNER's own choice among these three is never trusted past this
# point — it only marks a span as medication-shaped enough to bother looking up.
_MEDICATION_LABELS = {"drug", "ayush_formulation", "ayush_plant"}

# Precedence order: AFI first, then allopathic — checked in that order, first dictionary to
# clear _MATCH_THRESHOLD wins outright. Not a score comparison across dictionaries (that was the
# previous, more permissive design): a real AFI hit is never outweighed by a stronger-looking
# allopathic one, because in this domain that allopathic "hit" is exactly the false positive this
# fix exists to stop trusting.
_AFI_SYSTEM = "ayush_formulation"
_ALLOPATHIC_SYSTEM = "allopathic"
_UNKNOWN_FIELD = "unknown"
_UNKNOWN_CONFIDENCE_CAP = 0.2  # a medication span no dictionary recognised is never reported as
# confident, however confident GLiNER/OCR were — CLAUDE.md rule 4, never silently guess.

_MATCH_THRESHOLD = 0.3  # a dictionary "hit" below this trigram score is noise, not evidence —
# same bar as GLiNER's own _MIN_CONFIDENCE (app/extract/gliner_ner.py).


async def _resolve_medication(text: str) -> tuple[str, list[str], str | None]:
    """Returns (field, dictionary_matches, matched_dictionary). GLiNER gives us the span; the
    DICTIONARY gives us the identity and always gets first and final say, in strict precedence
    order (AFI -> allopathic -> unknown) — never a cross-dictionary score comparison, and
    GLiNER's own label plays no part in the outcome at all."""
    afi_results = await dictionary_search.search(text, _AFI_SYSTEM, limit=3)
    if afi_results and afi_results[0]["score"] >= _MATCH_THRESHOLD:
        return "ayurveda", [r["canonical_name"] for r in afi_results], _AFI_SYSTEM
    results = await dictionary_search.search(text, _ALLOPATHIC_SYSTEM, limit=3)
    if results and results[0]["score"] >= _MATCH_THRESHOLD:
        return "drug", [r["canonical_name"] for r in results], _ALLOPATHIC_SYSTEM
    return _UNKNOWN_FIELD, [], None


async def _resolve_field(label: str, text: str) -> tuple[str, list[str], str | None, float | None]:
    """Returns (field, dictionary_matches, matched_dictionary, confidence_cap). Only
    medication-like labels go through dictionary resolution; everything else passes through
    with no confidence cap and no dictionary provenance (there is none to report)."""
    if label not in _MEDICATION_LABELS:
        return label, [], None, None
    field, matches, matched_dictionary = await _resolve_medication(text)
    confidence_cap = _UNKNOWN_CONFIDENCE_CAP if field == _UNKNOWN_FIELD else None
    return field, matches, matched_dictionary, confidence_cap


def _bbox(region: OcrRegion) -> dict[str, float]:
    return {
        "x": region.bbox.x,
        "y": region.bbox.y,
        "width": region.bbox.width,
        "height": region.bbox.height,
    }


async def _build_field(region: OcrRegion, text: str, label: str, raw_confidence: float) -> dict[str, Any]:
    field_label, matches, matched_dictionary, confidence_cap = await _resolve_field(label, text)
    confidence = raw_confidence if confidence_cap is None else min(raw_confidence, confidence_cap)
    return {
        "field": field_label,
        "value": text,
        "confidence": confidence,
        "bounding_box": _bbox(region),
        "needs_confirmation": region.is_handwritten,
        "dictionary_matches": matches,
        "matched_dictionary": matched_dictionary,
    }


async def _extract_region(region: OcrRegion) -> list[dict[str, Any]]:
    try:
        gliner_entities = gliner_ner.extract_two_pass(region.text)
    except ProviderUnavailable as exc:
        log.warning("gliner unavailable for region, falling back to LLM-only", error=str(exc))
        gliner_entities = []

    fields: list[dict[str, Any]] = []
    covered_high_confidence = False
    for entity in gliner_entities:
        # Combine OCR-region confidence and NER-entity confidence: either being wrong should
        # pull the combined score down, so the product (not e.g. min) is used as the raw value —
        # _build_field then caps it further if the span matched no dictionary at all.
        fields.append(await _build_field(region, entity.text, entity.label, region.confidence * entity.score))
        if entity.score >= _LOW_CONFIDENCE_THRESHOLD:
            covered_high_confidence = True

    if not covered_high_confidence:
        remainder = await llm_remainder.extract_remainder(region.text)
        for entity in remainder:
            fields.append(
                await _build_field(region, entity.text, entity.label, region.confidence * entity.confidence)
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
