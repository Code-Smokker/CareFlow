"""DB-backed tests connect to the real DATABASE_URL and clean up their own rows (system
prefixed 'test-' so they can never collide with or be mistaken for real NAMASTE/ICD-11 rows).
Skipped automatically if no database is reachable — pure-logic tests never depend on this."""

from __future__ import annotations

# --- tests must never touch the Supabase project (see docai/test/conftest.py) ---
import os

_LOCAL_DB = "postgresql://careflow:careflow@localhost:5433/careflow"
_url = os.environ.get("TEST_DATABASE_URL", _LOCAL_DB)
if "supabase." in _url and os.environ.get("ALLOW_TESTS_ON_REMOTE_DB") != "1":
    raise RuntimeError("Refusing to run tests against a Supabase database. Unset TEST_DATABASE_URL to use local Docker Postgres.")
os.environ["DATABASE_URL"] = _url
os.environ["DIRECT_URL"] = os.environ.get("TEST_DIRECT_URL", _url)
if not os.environ.get("TEST_S3_ENDPOINT"):
    os.environ.update(S3_ENDPOINT="http://localhost:9000", S3_REGION="us-east-1", S3_ACCESS_KEY_ID="careflow", S3_SECRET_ACCESS_KEY="careflow123")
    os.environ.pop("S3_ACCESS_KEY", None)
    os.environ.pop("S3_SECRET_KEY", None)
else:
    os.environ["S3_ENDPOINT"] = os.environ["TEST_S3_ENDPOINT"]


import asyncpg
import pytest
import pytest_asyncio

import app.db as db_module
from app.config import settings

TEST_SYSTEM_A = "test-namaste"
TEST_SYSTEM_B = "test-icd11"


@pytest_asyncio.fixture
async def pool():
    """One pool per test, bound to that test's own event loop — and installed as app.db's
    module-level singleton so code under test (app.mapping.generate, app.search.concepts, ...)
    that calls `get_pool()` internally gets this same pool/loop instead of a stale one left
    over from a previous test's already-closed loop (pytest-asyncio's function-scoped default
    gives every test its own loop)."""
    try:
        p = await asyncpg.create_pool(settings.database_url, min_size=1, max_size=2)
    except OSError as exc:
        pytest.skip(f"no database reachable at DATABASE_URL: {exc}")
    db_module._pool = p
    yield p
    await p.execute("DELETE FROM concept_map WHERE source_concept IN (SELECT id FROM concept WHERE system LIKE 'test-%')")
    await p.execute("DELETE FROM concept WHERE system LIKE 'test-%'")
    await p.close()
    db_module._pool = None
