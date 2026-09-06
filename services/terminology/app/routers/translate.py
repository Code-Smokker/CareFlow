from __future__ import annotations

from typing import Any

from fastapi import APIRouter
from pydantic import BaseModel

from app.mapping import lookup

router = APIRouter()

_VALID_SYSTEMS = {"namaste", "icd11-tm2", "icd11-bio"}


class TranslateRequest(BaseModel):
    system: str
    code: str
    target: str


@router.post("/translate")
async def translate_concept(body: TranslateRequest) -> dict[str, Any]:
    result = await lookup.translate(body.system, body.code, body.target)
    if result is None:
        return {"matched": False, "equivalence": None, "reviewed_by": None, "provenance": None}
    return {
        "matched": True,
        "equivalence": result["equivalence"],
        "target_system": body.target,
        "target_code": result["target_code"],
        "target_display": result["target_display"],
        "reviewed_by": result["reviewed_by"],
        "provenance": result["provenance"],
    }
