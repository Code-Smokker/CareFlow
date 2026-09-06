from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def _fever_answers():
    return [
        {"slot_id": "chief_complaint", "value": "fever", "input_mode": "tap", "confidence": None},
        {"slot_id": "duration", "value": "2_days", "input_mode": "tap", "confidence": None},
        {"slot_id": "pattern", "value": "continuous", "input_mode": "tap", "confidence": None},
        {
            "slot_id": "associated",
            "value": ["neck_stiff", "headache"],
            "input_mode": "voice",
            "confidence": 0.42,
            "audio_offset_ms": 15300,
        },
    ]


def test_summarise_structured_object_has_chief_complaint_and_hpi():
    response = client.post("/summarise", json={"answers": _fever_answers(), "extractions": []})
    assert response.status_code == 200
    body = response.json()
    structured = body["structured"]

    assert structured["chief_complaint"]["value"] == "Fever"
    assert structured["chief_complaint"]["source"] == "tap"

    hpi = structured["history_of_present_illness"]
    assert hpi["duration"]["value"] == "2_days"
    assert hpi["pattern"]["value"] == "continuous"
    assert set(hpi.keys()) == {"duration", "pattern", "associated"}


def test_summarise_never_drops_low_confidence_field_but_marks_it():
    response = client.post("/summarise", json={"answers": _fever_answers(), "extractions": []})
    hpi = response.json()["structured"]["history_of_present_illness"]
    associated = hpi["associated"]
    assert associated["value"] == ["neck_stiff", "headache"]  # present, not dropped
    assert associated["confidence"] == 0.42
    assert associated["low_confidence"] is True
    assert associated["ref"] == "15300"  # audio offset, not the slot id, for a voice answer


def test_summarise_tap_answer_ref_is_slot_id():
    response = client.post("/summarise", json={"answers": _fever_answers(), "extractions": []})
    hpi = response.json()["structured"]["history_of_present_illness"]
    assert hpi["duration"]["ref"] == "duration"
    assert hpi["duration"]["low_confidence"] is False  # tap with no reported confidence defaults to 1.0


def test_summarise_empty_sections_are_null_not_fabricated():
    response = client.post("/summarise", json={"answers": _fever_answers(), "extractions": []})
    structured = response.json()["structured"]
    for section in ["past_history", "drugs_and_allergy", "family_history", "personal_history", "review_of_systems"]:
        assert structured[section] is None


def test_summarise_renders_structured_object_not_prose_first():
    response = client.post("/summarise", json={"answers": _fever_answers(), "extractions": [], "language": "hi"})
    body = response.json()
    assert "Fever" in body["rendered_en"]
    assert "पूरे दिन" in body["rendered_local"]  # localised option label for 'continuous'


def test_summarise_prior_investigations_from_extractions():
    extractions = [{"field": "hemoglobin", "value": "9.2 g/dL", "confidence": 0.8}]
    response = client.post("/summarise", json={"answers": _fever_answers(), "extractions": extractions})
    investigations = response.json()["structured"]["prior_investigations"]
    assert investigations[0]["label"] == "hemoglobin"
    assert investigations[0]["source"] == "ocr"
