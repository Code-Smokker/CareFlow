"""DB-integration test against the real schema (test/conftest.py's `pool` fixture) — proves the
exact-code / exact-title / fuzzy cascade and the reviewed_by/provenance discipline, using
concepts under system='test-namaste'/'test-icd11' so it can never touch real data."""

from __future__ import annotations

from app.mapping.generate import generate_candidate_mappings
from test.conftest import TEST_SYSTEM_A, TEST_SYSTEM_B

_INSERT = "INSERT INTO concept (system, code, display) VALUES ($1, $2, $3)"


async def test_exact_code_match(pool):
    await pool.execute(_INSERT, TEST_SYSTEM_A, "SAME-CODE", "Amavata")
    await pool.execute(_INSERT, TEST_SYSTEM_B, "SAME-CODE", "Some Other Title")

    result = await generate_candidate_mappings(TEST_SYSTEM_A, TEST_SYSTEM_B)
    assert result == {
        "source_system": TEST_SYSTEM_A,
        "target_system": TEST_SYSTEM_B,
        "source_concepts": 1,
        "exact": 1,
        "fuzzy": 0,
        "unmatched": 0,
        "reviewed": 0,
    }

    row = await pool.fetchrow(
        "SELECT equivalence, reviewed_by, provenance FROM concept_map cm "
        "JOIN concept sc ON sc.id = cm.source_concept WHERE sc.system = $1",
        TEST_SYSTEM_A,
    )
    assert row["equivalence"] == "equivalent"
    assert row["reviewed_by"] is None
    assert row["provenance"] == "lexical"


async def test_exact_title_match_when_codes_differ(pool):
    await pool.execute(_INSERT, TEST_SYSTEM_A, "SRC-1", "Amavata")
    await pool.execute(_INSERT, TEST_SYSTEM_B, "TGT-9", "Amavata")

    result = await generate_candidate_mappings(TEST_SYSTEM_A, TEST_SYSTEM_B)
    assert result["exact"] == 1
    assert result["fuzzy"] == 0


async def test_fuzzy_match_when_neither_code_nor_title_match_exactly(pool):
    await pool.execute(_INSERT, TEST_SYSTEM_A, "SRC-1", "Amavata")
    await pool.execute(_INSERT, TEST_SYSTEM_B, "TGT-9", "Amavat")  # one character off

    result = await generate_candidate_mappings(TEST_SYSTEM_A, TEST_SYSTEM_B)
    assert result["fuzzy"] == 1
    assert result["exact"] == 0

    row = await pool.fetchrow(
        "SELECT equivalence FROM concept_map cm "
        "JOIN concept sc ON sc.id = cm.source_concept WHERE sc.system = $1",
        TEST_SYSTEM_A,
    )
    assert row["equivalence"] == "inexact"


async def test_no_row_written_when_nothing_matches_at_all(pool):
    await pool.execute(_INSERT, TEST_SYSTEM_A, "SRC-1", "Completely Unrelated Concept Name")
    await pool.execute(_INSERT, TEST_SYSTEM_B, "TGT-9", "Nothing Like It")

    result = await generate_candidate_mappings(TEST_SYSTEM_A, TEST_SYSTEM_B)
    assert result["unmatched"] == 1
    assert result["exact"] == 0
    assert result["fuzzy"] == 0

    count = await pool.fetchval("SELECT count(*) FROM concept_map cm JOIN concept sc ON sc.id = cm.source_concept WHERE sc.system = $1", TEST_SYSTEM_A)
    assert count == 0


async def test_rerunning_does_not_overwrite_a_reviewed_mapping(pool):
    src = await pool.fetchrow(f"{_INSERT} RETURNING id", TEST_SYSTEM_A, "SAME-CODE", "Amavata")
    tgt = await pool.fetchrow(f"{_INSERT} RETURNING id", TEST_SYSTEM_B, "SAME-CODE", "Something Else Entirely")
    await pool.execute(
        "INSERT INTO concept_map (source_concept, target_concept, equivalence, reviewed_by, provenance) "
        "VALUES ($1, $2, 'equivalent', 'dr_test', 'manual')",
        src["id"],
        tgt["id"],
    )

    await generate_candidate_mappings(TEST_SYSTEM_A, TEST_SYSTEM_B)

    row = await pool.fetchrow(
        "SELECT reviewed_by, provenance FROM concept_map WHERE source_concept = $1", src["id"]
    )
    assert row["reviewed_by"] == "dr_test"
    assert row["provenance"] == "manual"
