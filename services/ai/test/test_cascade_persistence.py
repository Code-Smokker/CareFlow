"""Real Postgres, not a mock — this is the thing docs/19-frontend-status.md's /integrations
screen reads, so the test that matters is "does a row actually land," not "was execute() called."
"""

import uuid

import pytest

from app.cascade import ProviderUnavailable, cascade
from app.db import get_pool


@pytest.fixture
async def pool():
    p = await get_pool()
    yield p


async def test_a_failed_tier_then_a_successful_one_both_get_recorded(pool):
    capability = f"test.cascade_persistence.{uuid.uuid4()}"

    async def tier_a():
        raise ProviderUnavailable("a is down")

    async def tier_b():
        return "b-result"

    result = await cascade([("sarvam", tier_a), ("local", tier_b)], capability=capability)
    assert result == "b-result"

    rows = await pool.fetch(
        "SELECT provider, outcome, latency_ms FROM provider_cascade_event WHERE capability = $1 ORDER BY at",
        capability,
    )
    assert len(rows) == 2
    assert rows[0]["provider"] == "sarvam"
    assert rows[0]["outcome"] == "failure"
    assert rows[0]["latency_ms"] >= 0
    assert rows[1]["provider"] == "local"
    assert rows[1]["outcome"] == "success"

    await pool.execute("DELETE FROM provider_cascade_event WHERE capability = $1", capability)


async def test_service_column_is_always_ai_from_this_service(pool):
    capability = f"test.cascade_persistence.{uuid.uuid4()}"

    async def tier_a():
        return "ok"

    await cascade([("sarvam", tier_a)], capability=capability)

    row = await pool.fetchrow(
        "SELECT service FROM provider_cascade_event WHERE capability = $1", capability
    )
    assert row["service"] == "ai"

    await pool.execute("DELETE FROM provider_cascade_event WHERE capability = $1", capability)
