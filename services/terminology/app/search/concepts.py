"""GET /search and GET /concept/:system/:code. Trigram + embedding ranking over `concept`
(docs/07-ayush-terminology.md step 4) — see app/search/embeddings.py for why both signals are
needed and app/db.py for why this queries the table Prisma migrates, not one this service owns.

Everything compares lower(text) on the trigram side, same fix services/docai/app/dictionary/
search.py already made and the same reason: pg_trgm's trigrams are byte-for-byte, so a
lowercase query against a Title-Cased `display` would otherwise share fewer trigrams than the
same-case comparison and could rank a worse match higher. The `concept_display_lower_trgm_idx`
migration backs this with a matching lower(display) GIN index.
"""

from __future__ import annotations

from typing import Any

from app.db import get_pool
from app.logging import get_logger
from app.search import embeddings

log = get_logger(component="search")

_TRGM_QUERY = """
SELECT
    system,
    code,
    display,
    GREATEST(
        similarity(lower(display), $1),
        COALESCE((SELECT MAX(similarity(lower(syn), $1)) FROM unnest(synonyms) AS syn), 0)
    ) AS score
FROM concept
WHERE system = $2
  AND (
    lower(display) % $1
    OR EXISTS (SELECT 1 FROM unnest(synonyms) AS syn WHERE lower(syn) % $1)
  )
ORDER BY score DESC
LIMIT $3
"""

# Cosine distance via pgvector's `<=>` operator; embedding passed as a text literal
# ("[0.1,0.2,...]") and cast in SQL — asyncpg has no built-in vector codec, and registering one
# is not worth it for a single query shape. Only concepts with a stored embedding are eligible
# (NAMASTE/ICD-11 rows only get one once the embedding model actually ran over them at load
# time — see the loaders in app/namaste and app/icd11).
_VECTOR_QUERY = """
SELECT system, code, display, 1 - (embedding <=> $1::vector) AS score
FROM concept
WHERE system = $2 AND embedding IS NOT NULL
ORDER BY embedding <=> $1::vector
LIMIT $3
"""

_CONCEPT_QUERY = """
SELECT system, code, display, synonyms, definition
FROM concept
WHERE system = $1 AND code = $2
"""


def vector_literal(vector: list[float]) -> str:
    """pgvector text literal (e.g. "[0.1,0.2,...]") for a `$n::vector` cast — asyncpg has no
    built-in vector codec, shared by every module that writes or queries `concept.embedding`."""
    return "[" + ",".join(repr(float(v)) for v in vector) + "]"


async def search(q: str, system: str, limit: int = 10) -> list[dict[str, Any]]:
    pool = await get_pool()
    trgm_rows = await pool.fetch(_TRGM_QUERY, q.lower(), system, limit)

    best: dict[tuple[str, str], dict[str, Any]] = {}
    for r in trgm_rows:
        best[(r["system"], r["code"])] = {
            "system": r["system"],
            "code": r["code"],
            "display": r["display"],
            "score": float(r["score"]),
        }

    query_vector = embeddings.embed(q)
    if query_vector is not None:
        vector_rows = await pool.fetch(_VECTOR_QUERY, vector_literal(query_vector), system, limit)
        for r in vector_rows:
            key = (r["system"], r["code"])
            score = float(r["score"])
            existing = best.get(key)
            if existing is None or score > existing["score"]:
                best[key] = {
                    "system": r["system"],
                    "code": r["code"],
                    "display": r["display"],
                    "score": score,
                }

    ranked = sorted(best.values(), key=lambda row: row["score"], reverse=True)
    return ranked[:limit]


async def get_concept(system: str, code: str) -> dict[str, Any] | None:
    pool = await get_pool()
    row = await pool.fetchrow(_CONCEPT_QUERY, system, code)
    if row is None:
        return None
    return {
        "system": row["system"],
        "code": row["code"],
        "display": row["display"],
        "synonyms": list(row["synonyms"] or []),
        "definition": row["definition"],
    }
