"""Real Postgres, not a mock — same as services/ai/test/test_cascade_persistence.py. Confirms
docai's cascade() writes to the same provider_cascade_event table the gateway's
/v1/integration-events reads, tagged service="docai"."""

import uuid

import pytest

from app.cascade import ProviderUnavailable, cascade
from app.dictionary.db import get_pool


@pytest.fixture
async def pool():
    p = await get_pool()
    yield p


async def test_ocr_cascade_records_events_tagged_docai(pool):
    capability = f"test.cascade_persistence.{uuid.uuid4()}"

    async def hosted():
        raise ProviderUnavailable("hosted OCR down")

    async def local():
        return "local-ocr-result"

    result = await cascade([("hosted", hosted), ("local", local)], capability=capability)
    assert result == "local-ocr-result"

    rows = await pool.fetch(
        "SELECT service, provider, outcome FROM provider_cascade_event WHERE capability = $1 ORDER BY at",
        capability,
    )
    assert len(rows) == 2
    assert all(r["service"] == "docai" for r in rows)
    assert rows[0]["provider"] == "hosted"
    assert rows[0]["outcome"] == "failure"
    assert rows[1]["provider"] == "local"
    assert rows[1]["outcome"] == "success"

    await pool.execute("DELETE FROM provider_cascade_event WHERE capability = $1", capability)
