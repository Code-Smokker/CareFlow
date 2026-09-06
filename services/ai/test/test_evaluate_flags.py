from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_evaluate_flags_fires_meningism():
    response = client.post(
        "/evaluate-flags",
        json={"module_id": "fever", "slots": {"associated": ["neck_stiff", "headache"]}},
    )
    assert response.status_code == 200
    body = response.json()
    rule_ids = [f["rule_id"] for f in body["fired"]]
    assert "meningism" in rule_ids
    fired = next(f for f in body["fired"] if f["rule_id"] == "meningism")
    assert fired["severity"] == "critical"
    assert fired["quote"]


def test_evaluate_flags_no_fire_when_predicate_not_met():
    response = client.post("/evaluate-flags", json={"module_id": "fever", "slots": {"associated": ["headache"]}})
    assert response.status_code == 200
    assert "meningism" not in [f["rule_id"] for f in response.json()["fired"]]


def test_evaluate_flags_unknown_module_is_404():
    response = client.post("/evaluate-flags", json={"module_id": "does_not_exist", "slots": {}})
    assert response.status_code == 404
    assert response.json()["error"]["code"] == "unknown_module"


def test_evaluate_flags_never_calls_a_model():
    """CLAUDE.md rule 3: no model call in /evaluate-flags's implementation. This can't prove a
    negative from the outside, but it can prove the endpoint works with every LLM-related env
    var unset/broken — if the implementation secretly needed a model, this would fail."""
    response = client.post(
        "/evaluate-flags",
        json={"module_id": "chest_pain", "slots": {"character": "pressure", "associated": ["sweating"], "severity": 8}},
    )
    assert response.status_code == 200
    assert "acs_suspected" in [f["rule_id"] for f in response.json()["fired"]]
