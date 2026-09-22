import base64
import binascii
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


MAX_INLINE_AUDIO_BYTES = 10 * 1024 * 1024  # matches the intake-audio bucket's limit


class TranscribeRequest(BaseModel):
    # Exactly one of these. `audio_base64` is what the gateway sends: the bytes travel in the request,
    # so no shared filesystem is needed and the audio never touches this service's disk.
    audio_ref: str | None = None
    audio_base64: str | None = None
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


def _inline_audio(audio_base64: str) -> bytes:
    try:
        data = base64.b64decode(audio_base64, validate=True)
    except (binascii.Error, ValueError) as exc:
        raise AppError(400, "invalid_audio", "audio_base64 is not valid base64") from exc
    if not data:
        raise AppError(400, "invalid_audio", "audio is empty")
    if len(data) > MAX_INLINE_AUDIO_BYTES:
        raise AppError(413, "audio_too_large", "audio is larger than 10 MB")
    return data


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
    if (body.audio_ref is None) == (body.audio_base64 is None):
        raise AppError(400, "invalid_audio", "send exactly one of audio_ref or audio_base64")
    audio_path: Path | None = None
    if body.audio_base64 is not None:
        audio_bytes = _inline_audio(body.audio_base64)
    else:
        audio_path, audio_bytes = _resolve_audio_ref(body.audio_ref)  # type: ignore[arg-type]
    try:
        result = await transcribe_impl(audio_bytes, body.language)
    except AllProvidersUnavailable as exc:
        raise AppError(503, "asr_unavailable", "No speech-to-text provider could serve this request.", {"tiers": exc.tier_errors}) from exc

    if audio_path is not None and not body.retain_audio:
        _delete_audio(audio_path)

    log.info("transcribed", language=body.language, confidence=result.confidence, audio_retained=body.retain_audio and audio_path is not None)
    return TranscribeResponse(
        text=result.text,
        confidence=result.confidence,
        segments=[TranscriptSegmentModel(**vars(s)) for s in result.segments],
    )
