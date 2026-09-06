from typing import Any

from fastapi import APIRouter
from pydantic import BaseModel

from app.llm.fill_slot import fill_slot as fill_slot_impl
from app.logging import get_logger

router = APIRouter()
log = get_logger(router="fill_slot")


class FillSlotRequest(BaseModel):
    slot_schema: dict[str, Any]
    utterance: str
    context: dict[str, Any] = {}


class FillSlotResponse(BaseModel):
    value: Any
    confidence: float
    needs_clarification: bool


@router.post("/fill-slot", response_model=FillSlotResponse)
async def fill_slot(body: FillSlotRequest) -> FillSlotResponse:
    result = await fill_slot_impl(body.slot_schema, body.utterance, body.context)
    log.info(
        "slot filled",
        confidence=result.confidence,
        needs_clarification=result.needs_clarification,
    )
    return FillSlotResponse(
        value=result.value,
        confidence=result.confidence,
        needs_clarification=result.needs_clarification,
    )
