from pathlib import Path

from fastapi import APIRouter
from pydantic import BaseModel

from app.cascade import AllProvidersUnavailable
from app.errors import AppError
from app.logging import get_logger
from app.speech.service import transcribe as transcribe_impl

router = APIRouter()
log = get_logger(router="transcribe")


class TranscriptSegmentModel(BaseModel):
    text: str
    start_ms: int
    end_ms: int
    confidence: float


class TranscribeRequest(BaseModel):
    audio_ref: str
    language: str
    streaming: bool = False
    # docs/09-security-dpdp.md: raw audio deleted after transcription unless the patient opted
    # into provenance playback. No UI/session field feeds this yet (that opt-in flow doesn't
    # exist) — the honest default is "delete", not "keep everything just in case".
    retain_audio: bool = False


class TranscribeResponse(BaseModel):
    text: str
    confidence: float
    segments: list[TranscriptSegmentModel]


def _resolve_audio_ref(audio_ref: str) -> tuple[Path, bytes]:
    """`audio_ref` is a local file path for now — MinIO/S3 fetch isn't wired into this service
    yet (docker-compose's `minio` service exists but no client here); this is the seam to swap
    in when documents/audio actually flow through object storage."""
    path = Path(audio_ref)
    if not path.is_file():
        raise AppError(400, "unsupported_audio_ref", f"audio_ref '{audio_ref}' is not a readable local file")
    return path, path.read_bytes()


def _delete_audio(path: Path) -> None:
    """CLAUDE.md/docs/09: raw audio deleted after transcription by default. Best-effort — a
    failure to delete must not fail a transcription that already succeeded; it's logged so the
    gap is visible, not silently swallowed."""
    try:
        path.unlink()
    except OSError as exc:
        log.warning("failed to delete raw audio after transcription", audio_ref=str(path), error=str(exc))


@router.post("/transcribe", response_model=TranscribeResponse)
async def transcribe(body: TranscribeRequest) -> TranscribeResponse:
    audio_path, audio_bytes = _resolve_audio_ref(body.audio_ref)
    try:
        result = await transcribe_impl(audio_bytes, body.language)
    except AllProvidersUnavailable as exc:
        raise AppError(503, "asr_unavailable", "No speech-to-text provider could serve this request.", {"tiers": exc.tier_errors}) from exc

    if not body.retain_audio:
        _delete_audio(audio_path)

    log.info("transcribed", language=body.language, confidence=result.confidence, audio_retained=body.retain_audio)
    return TranscribeResponse(
        text=result.text,
        confidence=result.confidence,
        segments=[TranscriptSegmentModel(**vars(s)) for s in result.segments],
    )
