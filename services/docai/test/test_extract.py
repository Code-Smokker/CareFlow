"""Tests the parts of C2 that don't need GLiNER weights or a live Postgres: the two-pass merge
logic (app.extract.gliner_ner.merge_passes), timeline assembly's approximate-marking rule
(app.timeline.assemble.assemble), and app.extract.pipeline's medication system resolution.
Model inference and *live* dictionary search are exercised manually (see the docai README's
reality-check section) — mocking those here would just test the mock. The resolution tests
below are different: they test OUR branching logic (which system wins, when to fall back to
GLiNER's label), with a fake dictionary standing in for Postgres so that logic can't silently
regress even when nobody happens to run the manual check before a demo.
"""

from __future__ import annotations

import app.extract.pipeline as pipeline
from app.extract.gliner_ner import GlinerEntity, merge_passes
from app.timeline.assemble import assemble


def _entity(label: str, text: str, score: float, start: int, end: int) -> GlinerEntity:
    return GlinerEntity(label=label, text=text, score=score, start=start, end=end)


def test_merge_keeps_non_overlapping_entities_from_both_passes():
    allopathic = [_entity("drug", "Dolo 650", 0.9, 0, 8)]
    ayush = [_entity("ayush_formulation", "Yograj Guggulu", 0.8, 20, 34)]
    merged = merge_passes(allopathic, ayush)
    assert {e.text for e in merged} == {"Dolo 650", "Yograj Guggulu"}


def test_merge_keeps_higher_confidence_entity_on_overlap():
    allopathic = [_entity("drug", "Ashwagandha", 0.4, 0, 11)]
    ayush = [_entity("ayush_plant", "Ashwagandha", 0.85, 0, 11)]
    merged = merge_passes(allopathic, ayush)
    assert len(merged) == 1
    assert merged[0].label == "ayush_plant"
    assert merged[0].score == 0.85


def test_merge_discards_lower_confidence_overlapping_candidate():
    allopathic = [_entity("drug", "Ashwagandha", 0.9, 0, 11)]
    ayush = [_entity("ayush_plant", "Ashwagandha", 0.3, 0, 11)]
    merged = merge_passes(allopathic, ayush)
    assert len(merged) == 1
    assert merged[0].label == "drug"


def test_timeline_uses_explicit_date_when_a_date_entity_parses():
    extractions = [
        {"field": "date", "value": "12/03/2024", "confidence": 0.9},
        {"field": "diagnosis", "value": "fever with joint pain", "confidence": 0.95},
    ]
    events = assemble("doc-1", "prescription", extractions)
    assert len(events) == 1
    assert events[0]["approximate"] is False
    assert events[0]["occurred_at"].startswith("2024-03-12")
    assert events[0]["kind"] == "prescription"


def test_timeline_marks_approximate_when_no_date_entity_present():
    extractions = [{"field": "drug", "value": "Dolo 650", "confidence": 0.9}]
    events = assemble("doc-2", "prescription", extractions)
    assert len(events) == 1
    assert events[0]["approximate"] is True


def test_timeline_never_invents_a_precise_date_for_an_unparseable_value():
    extractions = [{"field": "date", "value": "not a date at all", "confidence": 0.9}]
    events = assemble("doc-3", "lab_report", extractions)
    assert events[0]["approximate"] is True
    assert events[0]["kind"] == "lab_report"


def test_timeline_falls_back_to_visit_kind_for_unknown_doc_type():
    events = assemble("doc-4", None, [])
    assert events[0]["kind"] == "visit"
    assert events[0]["approximate"] is True


# --- app.extract.pipeline: medication system resolution -------------------------------------
# The bug this guards against: GLiNER's allopathic pass mislabels real AYUSH formulations
# "drug" at 0.96-0.97 confidence (it has no better-fitting label in its own set), and the
# pipeline used to trust that label to pick which single dictionary to search — so every one of
# these hit the allopathic dictionary, matched nothing, and came back with an empty shortlist.
# The fix inverts that: the AFI dictionary is always checked first, regardless of what GLiNER
# said the span was; allopathic is only consulted if AFI misses; "drug" is passed in below
# deliberately, to reproduce the actual mislabel rather than the label the fix is supposed to
# stop trusting.
#
# These are the four medication spans off the real scanned AYUSH prescription
# (eval/real-inputs/image.png). Three have a real AFI match (scores are the real trigram scores
# from a manual run against the seeded dictionary); "Guduchi Satva" names a single herb, not a
# classical formulation, so it has no AFI entry and — since this precedence chain deliberately
# does not fall through to the separate plant dictionary — correctly resolves "unknown" rather
# than a guess.
_FAKE_DICTIONARY: dict[tuple[str, str], list[dict]] = {
    ("allopathic", "dolo 650"): [
        {"id": "1", "system": "allopathic", "canonical_name": "Dolo 650 Tablet", "synonyms": [], "metadata": None, "score": 0.91},
    ],
    ("ayush_formulation", "avipattikar churna"): [
        {"id": "2", "system": "ayush_formulation", "canonical_name": "AVIPATTIKARA CURNA", "synonyms": [], "metadata": None, "score": 0.652},
    ],
    ("ayush_formulation", "hingvastak churna"): [
        {"id": "4", "system": "ayush_formulation", "canonical_name": "HINGVASTAKA CURNA", "synonyms": [], "metadata": None, "score": 0.636},
    ],
    ("ayush_formulation", "arogyavardhini vati"): [
        {"id": "5", "system": "ayush_formulation", "canonical_name": "AROGYAVARDHINI GUTIKA", "synonyms": [], "metadata": None, "score": 0.556},
    ],
    # Synthetic: allopathic has a real, higher-scoring hit here — the fix must still prefer AFI,
    # since AFI is checked (and wins outright on any hit above threshold) before allopathic is
    # even queried.
    ("ayush_formulation", "xyz churna"): [
        {"id": "8", "system": "ayush_formulation", "canonical_name": "XYZ CURNA", "synonyms": [], "metadata": None, "score": 0.35},
    ],
    ("allopathic", "xyz churna"): [
        {"id": "7", "system": "allopathic", "canonical_name": "XYZ Syrup", "synonyms": [], "metadata": None, "score": 0.80},
    ],
}


async def _fake_search(q: str, system: str | None, limit: int = 3) -> list[dict]:
    return _FAKE_DICTIONARY.get((system, q.lower()), [])


def _patch_dictionary(monkeypatch):
    monkeypatch.setattr(pipeline.dictionary_search, "search", _fake_search)


async def test_resolve_field_the_three_afi_formulations_resolve_to_ayurveda(monkeypatch):
    _patch_dictionary(monkeypatch)
    cases = [
        ("Avipattikar Churna", "AVIPATTIKARA CURNA"),
        ("Hingvastak Churna", "HINGVASTAKA CURNA"),
        ("Arogyavardhini Vati", "AROGYAVARDHINI GUTIKA"),
    ]
    for text, expected_top_match in cases:
        field, matches, matched_dictionary, confidence_cap = await pipeline._resolve_field("drug", text)
        assert field == "ayurveda", text
        assert matches[0] == expected_top_match, text
        assert matched_dictionary == "ayush_formulation", text
        assert confidence_cap is None, text


async def test_resolve_field_the_fourth_formulation_has_no_afi_entry_and_is_unknown(monkeypatch):
    _patch_dictionary(monkeypatch)
    field, matches, matched_dictionary, confidence_cap = await pipeline._resolve_field("drug", "Guduchi Satva")
    assert field == "unknown"
    assert matches == []
    assert matched_dictionary is None
    assert confidence_cap == pipeline._UNKNOWN_CONFIDENCE_CAP


async def test_resolve_field_keeps_a_real_allopathic_drug_as_drug(monkeypatch):
    _patch_dictionary(monkeypatch)
    field, matches, matched_dictionary, confidence_cap = await pipeline._resolve_field("drug", "Dolo 650")
    assert field == "drug"
    assert matches == ["Dolo 650 Tablet"]
    assert matched_dictionary == "allopathic"
    assert confidence_cap is None


async def test_resolve_field_reports_unknown_with_no_dictionary_match_anywhere(monkeypatch):
    _patch_dictionary(monkeypatch)
    field, matches, matched_dictionary, confidence_cap = await pipeline._resolve_field(
        "drug", "Not In Any Dictionary"
    )
    assert field == "unknown"
    assert matches == []
    assert matched_dictionary is None
    assert confidence_cap == pipeline._UNKNOWN_CONFIDENCE_CAP


async def test_resolve_field_afi_wins_even_when_allopathic_scores_higher(monkeypatch):
    _patch_dictionary(monkeypatch)
    field, matches, matched_dictionary, confidence_cap = await pipeline._resolve_field("drug", "XYZ Churna")
    assert field == "ayurveda"
    assert matches == ["XYZ CURNA"]
    assert matched_dictionary == "ayush_formulation"


async def test_resolve_field_passes_through_non_medication_labels():
    field, matches, matched_dictionary, confidence_cap = await pipeline._resolve_field(
        "diagnosis", "fever with joint pain"
    )
    assert field == "diagnosis"
    assert matches == []
    assert matched_dictionary is None
    assert confidence_cap is None
