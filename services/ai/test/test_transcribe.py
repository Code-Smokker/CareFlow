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
