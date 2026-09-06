"""Candidate mapping generator — docs/07-ayush-terminology.md step 4: "Generate candidate
mappings by lexical match — exact code, exact English title, then fuzzy. Every one gets
reviewed_by: null and provenance: 'lexical'." Nothing here is presented as clinically
validated; a human sets `reviewed_by` later through a review flow that doesn't exist yet.

Deliberately writes no row at all when nothing matches, rather than an "unmatched" placeholder
row — `concept_map.target_concept` is a NOT NULL foreign key (schema.prisma), so there is
nothing honest to point it at. "No mapping exists" is the absence of a row.
"""

from __future__ import annotations

from typing import Any

from app.db import get_pool
from app.logging import get_logger

log = get_logger(component="mapping_generate")

_FUZZY_QUERY = """
SELECT id, code, display, similarity(lower(display), $1) AS score
FROM concept
WHERE system = $2 AND lower(display) % $1
ORDER BY score DESC
LIMIT 1
"""

_UPSERT_MAPPING = """
INSERT INTO concept_map (source_concept, target_concept, equivalence, reviewed_by, provenance)
VALUES ($1, $2, $3::"ConceptEquivalence", NULL, 'lexical')
ON CONFLICT (source_concept, target_concept)
DO UPDATE SET equivalence = EXCLUDED.equivalence, provenance = 'lexical'
WHERE concept_map.reviewed_by IS NULL
"""


async def generate_candidate_mappings(source_system: str, target_system: str) -> dict[str, Any]:
    pool = await get_pool()
    source_rows = await pool.fetch(
        "SELECT id, code, display FROM concept WHERE system = $1", source_system
    )
    target_rows = await pool.fetch(
        "SELECT id, code, display FROM concept WHERE system = $1", target_system
    )
    by_code = {r["code"]: r for r in target_rows}
    by_title = {r["display"].strip().lower(): r for r in target_rows}

    exact = 0
    fuzzy = 0
    unmatched = 0

    for src in source_rows:
        target = by_code.get(src["code"]) or by_title.get(src["display"].strip().lower())
        equivalence = "equivalent"

        if target is None:
            candidates = await pool.fetch(_FUZZY_QUERY, src["display"].lower(), target_system)
            if candidates:
                target = candidates[0]
                equivalence = "inexact"

        if target is None:
            unmatched += 1
            log.info(
                "no candidate mapping found",
                source_system=source_system,
                source_code=src["code"],
                target_system=target_system,
            )
            continue

        await pool.execute(_UPSERT_MAPPING, src["id"], target["id"], equivalence)
        if equivalence == "equivalent":
            exact += 1
        else:
            fuzzy += 1

    return {
        "source_system": source_system,
        "target_system": target_system,
        "source_concepts": len(source_rows),
        "exact": exact,
        "fuzzy": fuzzy,
        "unmatched": unmatched,
        "reviewed": 0,  # every row this generator writes has reviewed_by NULL, by construction
    }
