from pathlib import Path

from fastapi import APIRouter
from pydantic import BaseModel

from app.cascade import AllProvidersUnavailable
from app.config import settings
from app.errors import AppError
from app.logging import get_logger
from app.speech.cache import cache_path
from app.speech.service import synthesise as synthesise_impl

router = APIRouter()
log = get_logger(router="synthesise")


class SynthesiseRequest(BaseModel):
    text: str
    language: str


class SynthesiseResponse(BaseModel):
    audio_url: str


@router.post("/synthesise", response_model=SynthesiseResponse)
async def synthesise(body: SynthesiseRequest) -> SynthesiseResponse:
    try:
        await synthesise_impl(body.text, body.language, voice=None)
    except AllProvidersUnavailable as exc:
        raise AppError(503, "tts_unavailable", "No text-to-speech provider could serve this request.", {"tiers": exc.tier_errors}) from exc

    # The cached file is what /audio/{filename} serves (see app/main.py's StaticFiles mount) —
    # recomputing the path here (rather than having synthesise_impl return it) keeps the cache
    # module the single place that knows the on-disk naming scheme.
    path: Path = cache_path(body.text, body.language, None)
    log.info("synthesised", language=body.language)
    return SynthesiseResponse(audio_url=f"{settings.ai_service_url.rstrip('/')}/audio/{path.name}")
