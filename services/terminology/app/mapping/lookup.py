"""Looks up an existing ConceptMap row for /translate and /fhir/ConceptMap/:id/$translate.
Read-only — generation lives in app/mapping/generate.py. Returns None when no mapping exists;
callers render that as `matched: false`, never a fabricated target."""

from __future__ import annotations

from typing import Any

from app.db import get_pool

_QUERY = """
SELECT cm.equivalence, cm.reviewed_by, cm.provenance,
       tc.code AS target_code, tc.display AS target_display
FROM concept_map cm
JOIN concept sc ON sc.id = cm.source_concept
JOIN concept tc ON tc.id = cm.target_concept
WHERE sc.system = $1 AND sc.code = $2 AND tc.system = $3
LIMIT 1
"""


async def translate(system: str, code: str, target: str) -> dict[str, Any] | None:
    pool = await get_pool()
    row = await pool.fetchrow(_QUERY, system, code, target)
    if row is None:
        return None
    return {
        "equivalence": row["equivalence"],
        "reviewed_by": row["reviewed_by"],
        "provenance": row["provenance"],
        "target_code": row["target_code"],
        "target_display": row["target_display"],
    }
