from typing import Any

from fastapi import APIRouter
from pydantic import BaseModel

from app.logging import get_logger
from app.summary.build import build_summary

router = APIRouter()
log = get_logger(router="summarise")


class SummariseAnswer(BaseModel):
    slot_id: str
    value: Any
    input_mode: str
    confidence: float | None = None
    audio_uri: str | None = None
    audio_offset_ms: int | None = None


class SummariseRequest(BaseModel):
    module_id: str | None = None
    language: str = "en"
    answers: list[SummariseAnswer]
    extractions: list[dict[str, Any]] = []


class SummariseResponse(BaseModel):
    structured: dict[str, Any]
    rendered_en: str
    rendered_local: str


@router.post("/summarise", response_model=SummariseResponse)
def summarise(body: SummariseRequest) -> SummariseResponse:
    result = build_summary(
        answers=[a.model_dump() for a in body.answers],
        extractions=body.extractions,
        module_id=body.module_id,
        language=body.language,
    )
    log.info("summarised", module_id=body.module_id, slot_count=len(body.answers))
    return SummariseResponse(**result)
