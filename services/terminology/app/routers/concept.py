from __future__ import annotations

from fastapi import APIRouter

from app.errors import AppError
from app.search import concepts

router = APIRouter()

_VALID_SYSTEMS = {"namaste", "icd11-tm2", "icd11-bio"}


@router.get("/concept/{system}/{code}")
async def get_concept(system: str, code: str):
    if system not in _VALID_SYSTEMS:
        raise AppError(422, "invalid_system", f"system must be one of {sorted(_VALID_SYSTEMS)}")
    concept = await concepts.get_concept(system, code)
    if concept is None:
        raise AppError(404, "concept_not_found", f"No concept {system}/{code}")
    return concept
