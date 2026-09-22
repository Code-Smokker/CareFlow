"""The 24-hour / after-signing deletion of voice notes, against the REAL database and REAL object storage
(the same Supabase Postgres + Storage the gateway uses). Rows this test inserts are removed afterwards; the
audit rows it causes cannot be (audit_log is append-only) and are tagged with actor `celery.audio_retention`."""

from __future__ import annotations

import re
import uuid

import asyncpg
import pytest

from app.audio_retention import _dsn, purge_expired_audio
from app.config import settings
from app.storage import s3_client


async def _make_answer(conn: asyncpg.Connection, *, audio_age_hours: float, signed: bool) -> dict:
    patient = await conn.fetchval("INSERT INTO patient DEFAULT VALUES RETURNING id")
    visit = await conn.fetchval("INSERT INTO visit (patient_id) VALUES ($1) RETURNING id", patient)
    session = await conn.fetchval(
        "INSERT INTO intake_session (visit_id, resume_token_hash, expires_at, updated_at) VALUES ($1, $2, now() + interval '1 day', now()) RETURNING id",
        visit, uuid.uuid4().hex,
    )
    key = f"{visit}/{uuid.uuid4()}.webm"
    s3_client().put_object(Bucket=settings.s3_bucket_audio, Key=key, Body=b"\x1aE\xdf\xa3fake-webm", ContentType="audio/webm")
    uri = f"s3://{settings.s3_bucket_audio}/{key}"
    answer = await conn.fetchval(
        """INSERT INTO answer (session_id, slot_id, value, input_mode, source, audio_uri, answered_at)
           VALUES ($1, 'duration', '"2_days"'::jsonb, 'voice', 'voice', $2, now() - make_interval(hours => $3)) RETURNING id""",
        session, uri, audio_age_hours,
    )
    if signed:
        await conn.execute("INSERT INTO summary (visit_id, structured, status) VALUES ($1, '{}'::jsonb, 'signed')", visit)
    return {"patient": patient, "visit": visit, "session": session, "answer": answer, "key": key, "uri": uri}


def _exists(key: str) -> bool:
    try:
        s3_client().head_object(Bucket=settings.s3_bucket_audio, Key=key)
        return True
    except Exception:
        return False


class _Db:
    def __init__(self, c: asyncpg.Connection) -> None:
        self.c = c
        self.made: list[dict] = []


@pytest.fixture
async def db():
    c = await asyncpg.connect(_dsn(), statement_cache_size=0)
    h = _Db(c)
    yield h
    for m in h.made:
        s3_client().delete_object(Bucket=settings.s3_bucket_audio, Key=m["key"])
        await c.execute("DELETE FROM answer WHERE id=$1", m["answer"])
        await c.execute("DELETE FROM summary WHERE visit_id=$1", m["visit"])
        await c.execute("DELETE FROM intake_session WHERE id=$1", m["session"])
        await c.execute("DELETE FROM visit WHERE id=$1", m["visit"])
        await c.execute("DELETE FROM patient WHERE id=$1", m["patient"])
    await c.close()


async def _audit(conn: asyncpg.Connection, answer_id) -> list[asyncpg.Record]:
    return await conn.fetch("SELECT actor_id, action, reason FROM audit_log WHERE resource='answer' AND resource_id=$1 AND action='audio.delete'", str(answer_id))


async def test_a_voice_note_older_than_24h_is_deleted_and_the_deletion_is_audited(db):
    old = await _make_answer(db.c, audio_age_hours=25, signed=False)
    db.made.append(old)
    assert _exists(old["key"])

    counts = await purge_expired_audio(retention_hours=24)

    assert counts["expired"] >= 1
    assert not _exists(old["key"])
    assert await db.c.fetchval("SELECT audio_uri FROM answer WHERE id=$1", old["answer"]) is None
    rows = await _audit(db.c, old["answer"])
    assert len(rows) == 1 and rows[0]["actor_id"] == "celery.audio_retention" and "24" in rows[0]["reason"]


async def test_a_recent_voice_note_of_an_unsigned_visit_is_kept(db):
    fresh = await _make_answer(db.c, audio_age_hours=1, signed=False)
    db.made.append(fresh)
    await purge_expired_audio(retention_hours=24)
    assert _exists(fresh["key"])
    assert await db.c.fetchval("SELECT audio_uri FROM answer WHERE id=$1", fresh["answer"]) == fresh["uri"]


async def test_a_voice_note_of_a_signed_visit_is_deleted_even_when_recent(db):
    signed = await _make_answer(db.c, audio_age_hours=1, signed=True)
    db.made.append(signed)
    counts = await purge_expired_audio(retention_hours=24)
    assert counts["after_signing"] >= 1
    assert not _exists(signed["key"])
    assert "signed" in (await _audit(db.c, signed["answer"]))[0]["reason"]


async def test_an_old_orphaned_upload_no_answer_references_is_swept(db):
    key = f"orphan-test/{uuid.uuid4()}.webm"
    s3_client().put_object(Bucket=settings.s3_bucket_audio, Key=key, Body=b"orphan", ContentType="audio/webm")
    try:
        # A negative retention puts the cutoff in the future, so a just-uploaded orphan is "old enough" even if the
        # object store's clock runs a few ms ahead of this host's (the flake a retention of 0 had).
        counts = await purge_expired_audio(retention_hours=-1)
        assert counts["orphaned"] >= 1 and not _exists(key)
    finally:
        s3_client().delete_object(Bucket=settings.s3_bucket_audio, Key=key)
