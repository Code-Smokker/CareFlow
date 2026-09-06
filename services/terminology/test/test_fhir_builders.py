from __future__ import annotations

from app.fhir.codesystem import build_codesystem
from app.fhir.conceptmap import build_translate_parameters


def test_build_codesystem_omits_definition_when_absent():
    cs = build_codesystem("namaste", [{"code": "TEST-1", "display": "Amavata", "definition": None}])
    assert cs["resourceType"] == "CodeSystem"
    assert cs["url"] == "http://terminology.ayush.gov.in/namaste"
    assert cs["concept"] == [{"code": "TEST-1", "display": "Amavata"}]


def test_build_codesystem_includes_definition_when_present():
    cs = build_codesystem("namaste", [{"code": "TEST-1", "display": "Amavata", "definition": "Joint pain"}])
    assert cs["concept"][0]["definition"] == "Joint pain"


def test_translate_parameters_unmatched_carries_no_fabricated_code():
    params = build_translate_parameters(matched=False)
    assert params == {"resourceType": "Parameters", "parameter": [{"name": "result", "valueBoolean": False}]}


def test_translate_parameters_matched_shape():
    params = build_translate_parameters(
        matched=True,
        target_system="icd11-tm2",
        target_code="TM2-1",
        target_display="Amavata pattern",
        equivalence="inexact",
    )
    match = params["parameter"][1]
    assert match["name"] == "match"
    parts = {p["name"]: p for p in match["part"]}
    assert parts["equivalence"]["valueCode"] == "inexact"
    assert parts["concept"]["valueCoding"] == {
        "system": "http://id.who.int/icd/release/11/mms",
        "code": "TM2-1",
        "display": "Amavata pattern",
    }
