from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Query

from app.db import get_pool
from app.errors import AppError
from app.fhir.codesystem import build_codesystem
from app.fhir.conceptmap import build_translate_parameters
from app.mapping import lookup

router = APIRouter()

_VALID_SYSTEMS = {"namaste", "icd11-tm2", "icd11-bio"}


@router.get("/fhir/CodeSystem/{id}")
async def get_fhir_codesystem(id: str) -> dict[str, Any]:
    if id not in _VALID_SYSTEMS:
        raise AppError(422, "invalid_system", f"system must be one of {sorted(_VALID_SYSTEMS)}")
    pool = await get_pool()
    rows = await pool.fetch(
        "SELECT code, display, definition FROM concept WHERE system = $1 ORDER BY code", id
    )
    concepts = [{"code": r["code"], "display": r["display"], "definition": r["definition"]} for r in rows]
    return build_codesystem(id, concepts)


@router.get("/fhir/ConceptMap/{id}/$translate")
async def fhir_translate(
    id: str,
    code: str = Query(...),
    system: str = Query(...),
    target: str = Query(...),
) -> dict[str, Any]:
    result = await lookup.translate(system, code, target)
    if result is None:
        return build_translate_parameters(matched=False)
    return build_translate_parameters(
        matched=True,
        target_system=target,
        target_code=result["target_code"],
        target_display=result["target_display"],
        equivalence=result["equivalence"],
    )
