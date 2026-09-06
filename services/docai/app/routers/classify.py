"""POST /classify — stub for now (this task's explicit "no model work yet"). Real classification
is C2 work; this returns a fixed low-confidence guess so callers can build against the real
contract shape before a model exists, same discipline as app/extract/stub.py.
"""

from __future__ import annotations

from pydantic import BaseModel

from fastapi import APIRouter

router = APIRouter()


class ClassifyRequest(BaseModel):
    image_ref: str


class ClassifyResponse(BaseModel):
    doc_type: str
    confidence: float


@router.post("/classify", response_model=ClassifyResponse)
async def classify(body: ClassifyRequest) -> ClassifyResponse:
    return ClassifyResponse(doc_type="other", confidence=0.25)
