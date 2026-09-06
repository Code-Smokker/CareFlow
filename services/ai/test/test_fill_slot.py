from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_fill_slot_returns_unclear_when_no_llm_provider_configured():
    """No SARVAM_API_KEY in this test environment — CLAUDE.md/docs/05-interview-engine.md:
    an unreachable model means an honest "unclear", never a fabricated value."""
    response = client.post(
        "/fill-slot",
        json={
            "slot_schema": {"type": "string", "enum": ["sudden", "gradual"]},
            "utterance": "it started suddenly",
            "context": {},
        },
    )
    assert response.status_code == 200
    body = response.json()
    assert body["value"] is None
    assert body["confidence"] == 0.0
    assert body["needs_clarification"] is True
