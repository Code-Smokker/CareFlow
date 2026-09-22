import tempfile
from pathlib import Path
from unittest.mock import patch

from fastapi.testclient import TestClient

from app.main import app
from app.speech.base import TranscriptResult

client = TestClient(app)

_FAKE_RESULT = TranscriptResult(text="fever for three days", confidence=0.9, segments=[])


def _write_wav(tmp_path: Path) -> Path:
    audio_path = tmp_path / "answer.wav"
    audio_path.write_bytes(b"RIFF....WAVEfmt ")
    return audio_path


@patch("app.routers.transcribe.transcribe_impl")
def test_raw_audio_deleted_after_transcription_by_default(mock_transcribe):
    """docs/09-security-dpdp.md: raw audio deleted after transcription unless the patient
    opted into provenance playback. Default (no retain_audio) must delete the source file.
    The actual ASR provider cascade (Sarvam/Bhashini/local) is mocked out here — none of them
    are exercisable in this environment (real key rejected, others unconfigured/uninstalled),
    which is a pre-existing, separate gap from the deletion behaviour under test."""
    mock_transcribe.return_value = _FAKE_RESULT
    with tempfile.TemporaryDirectory() as tmp:
        audio_path = _write_wav(Path(tmp))
        response = client.post(
            "/transcribe",
            json={"audio_ref": str(audio_path), "language": "hi", "streaming": False},
        )
        assert response.status_code == 200
        assert not audio_path.exists()


@patch("app.routers.transcribe.transcribe_impl")
def test_raw_audio_retained_when_patient_opted_in(mock_transcribe):
    mock_transcribe.return_value = _FAKE_RESULT
    with tempfile.TemporaryDirectory() as tmp:
        audio_path = _write_wav(Path(tmp))
        response = client.post(
            "/transcribe",
            json={"audio_ref": str(audio_path), "language": "hi", "streaming": False, "retain_audio": True},
        )
        assert response.status_code == 200
        assert audio_path.exists()


def test_transcribe_accepts_inline_base64_audio_and_writes_nothing_to_disk(monkeypatch, tmp_path):
    """The gateway sends the bytes inline. No audio_ref, no file: nothing to delete, nothing left behind."""
    import base64

    from fastapi.testclient import TestClient

    from app.main import app
    from app.routers import transcribe as router

    seen: dict[str, object] = {}

    async def fake_transcribe(audio_bytes: bytes, language: str):
        seen["bytes"], seen["language"] = audio_bytes, language

        class R:
            text, confidence, segments = "मुझे बुखार है", 0.91, []

        return R()

    monkeypatch.setattr(router, "transcribe_impl", fake_transcribe)
    client = TestClient(app)
    ok = client.post("/transcribe", json={"audio_base64": base64.b64encode(b"RIFFfakewav").decode(), "language": "hi-IN", "streaming": False})
    assert ok.status_code == 200 and ok.json()["text"] == "मुझे बुखार है"
    assert seen == {"bytes": b"RIFFfakewav", "language": "hi-IN"}

    for bad in ({"language": "hi"}, {"audio_ref": "/x", "audio_base64": "QQ==", "language": "hi"}, {"audio_base64": "!!notbase64!!", "language": "hi"}):
        assert client.post("/transcribe", json={**bad, "streaming": False}).status_code == 400
