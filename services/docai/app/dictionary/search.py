"""GET /dictionary/search — trigram fuzzy match against dictionary_entry, same pg_trgm
approach docs/07-ayush-terminology.md describes for the terminology service's concept table.
Scores the best of (canonical_name similarity, best synonym similarity) so a synonym-only match
still ranks sensibly.

Everything compares lower(text): pg_trgm's trigrams are byte-for-byte, so a lowercase query
("yograj guggul") against an ALL-CAPS canonical_name ("YOGARAJA GUGGULU") would otherwise share
almost no trigrams and score near zero. The canonical_name side is backed by a matching
lower(canonical_name) GIN index (see the lower_trgm_dictionary migration); the synonyms side
still unnests per row — there's no equivalently cheap index for trigram-matching inside a
text[] element-wise, and 250k allopathic rows is small enough that this is a skeleton-stage
tradeoff, not a bug.
"""

from __future__ import annotations

from typing import Any

from app.dictionary.db import get_pool

_QUERY = """
SELECT
    id,
    system,
    canonical_name,
    synonyms,
    metadata,
    GREATEST(
        similarity(lower(canonical_name), $1),
        COALESCE((SELECT MAX(similarity(lower(syn), $1)) FROM unnest(synonyms) AS syn), 0)
    ) AS score
FROM dictionary_entry
WHERE ($2::text IS NULL OR system = $2::"DictionarySystem")
  AND (
    lower(canonical_name) % $1
    OR EXISTS (SELECT 1 FROM unnest(synonyms) AS syn WHERE lower(syn) % $1)
  )
ORDER BY score DESC
LIMIT $3
"""


async def search(q: str, system: str | None, limit: int = 10) -> list[dict[str, Any]]:
    pool = await get_pool()
    rows = await pool.fetch(_QUERY, q.lower(), system, limit)
    return [
        {
            "id": str(r["id"]),
            "system": r["system"],
            "canonical_name": r["canonical_name"],
            "synonyms": r["synonyms"],
            "metadata": r["metadata"],
            "score": float(r["score"]),
        }
        for r in rows
    ]
