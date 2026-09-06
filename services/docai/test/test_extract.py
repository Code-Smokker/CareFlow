"""Tests the parts of C2 that don't need GLiNER weights or a live Postgres: the two-pass merge
logic (app.extract.gliner_ner.merge_passes) and timeline assembly's approximate-marking rule
(app.timeline.assemble.assemble). Model inference and dictionary lookups are exercised manually
(see the docai README's reality-check section) — mocking them here would just test the mock.
"""

from __future__ import annotations

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
