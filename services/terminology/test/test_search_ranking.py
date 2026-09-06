"""DB-integration tests against the real schema. The cross-script case is the actual point of
docs/07-ayush-terminology.md's verification checklist ("amavata"/"āmavāta"/"aam vaat"/"आमवात"
all resolve to one concept) — it's skipped, not faked, when the embedding model isn't available
in this environment (app/search/embeddings.py degrades gracefully; see README.md for whether
it actually loaded here)."""

from __future__ import annotations

import pytest

from app.search import concepts, embeddings
from app.search.concepts import vector_literal
from test.conftest import TEST_SYSTEM_A

_INSERT = "INSERT INTO concept (system, code, display) VALUES ($1, $2, $3)"
_INSERT_WITH_EMBEDDING = "INSERT INTO concept (system, code, display, embedding) VALUES ($1, $2, $3, $4::vector)"


async def test_trigram_matches_case_insensitively_against_the_lower_index(pool):
    await pool.execute(_INSERT, TEST_SYSTEM_A, "T1", "Amavata")
    results = await concepts.search("amavata", TEST_SYSTEM_A)
    assert any(r["code"] == "T1" for r in results)


async def test_trigram_alone_does_not_bridge_devanagari_to_latin(pool):
    await pool.execute(_INSERT, TEST_SYSTEM_A, "T1", "Amavata")
    results = await concepts.search("आमवात", TEST_SYSTEM_A)
    assert not any(r["code"] == "T1" for r in results)


async def test_embedding_bridges_devanagari_to_latin_when_the_model_is_available(pool):
    vector = embeddings.embed("आमवात")
    if vector is None:
        pytest.skip("embedding model not available in this environment — see README.md")

    concept_vector = embeddings.embed("Amavata आमवात āmavāta aam vaat")
    await pool.execute(_INSERT_WITH_EMBEDDING, TEST_SYSTEM_A, "T2", "Amavata", vector_literal(concept_vector))

    results = await concepts.search("आमवात", TEST_SYSTEM_A)
    assert any(r["code"] == "T2" for r in results)
