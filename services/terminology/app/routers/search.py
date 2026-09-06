from __future__ import annotations

from fastapi import APIRouter, Query

from app.errors import AppError
from app.search import concepts

router = APIRouter()

_VALID_SYSTEMS = {"namaste", "icd11-tm2", "icd11-bio"}


@router.get("/search")
async def search_concepts(
    q: str = Query(..., min_length=1),
    system: str = Query(...),
):
    if system not in _VALID_SYSTEMS:
        raise AppError(422, "invalid_system", f"system must be one of {sorted(_VALID_SYSTEMS)}")
    return await concepts.search(q, system)
