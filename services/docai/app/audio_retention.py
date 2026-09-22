"""Deletes patient voice notes — the retention half of the consent-gated voice-note feature.

A voice note exists so the doctor can hear the patient's own words before signing. It is deleted:
  * when the visit is signed (the gateway does it immediately at sign — this sweep is the safety net), or
  * 24 hours after it was recorded, whichever comes first, and
  * any object in the bucket that no answer references (an upload whose answer never followed) once it is
    older than the retention window.
Every deletion writes a row to the append-only audit_log. Runs from Celery beat (see celery_app.py).
Returns counts; never raises for one bad object — a failure on one clip must not stop the rest being deleted.
"""

from __future__ import annotations

import re
from datetime import datetime, timedelta, timezone
from typing import Any

import asyncpg
from botocore.exceptions import ClientError

from app.config import settings
from app.logging import get_logger
from app.storage import s3_client

log = get_logger()

ACTOR = "celery.audio_retention"
_S3_URI = re.compile(r"^s3://([^/]+)/(.+)$")


def _dsn() -> str:
    return re.sub(r"\?.*$", "", settings.database_url.replace("postgresql://", "postgres://"))


def _delete_object(client: Any, uri: str) -> bool:
    m = _S3_URI.match(uri)
    if not m:
        return False
    try:
        client.delete_object(Bucket=m.group(1), Key=m.group(2))  # idempotent: a missing key is not an error
        return True
    except ClientError as exc:
        log.warning("audio delete failed", uri=uri, error=str(exc))
        return False


async def purge_expired_audio(retention_hours: float | None = None) -> dict[str, int]:
    hours = retention_hours if retention_hours is not None else settings.audio_retention_hours
    cutoff = datetime.now(timezone.utc) - timedelta(hours=hours)  # aware: compared with S3's LastModified
    cutoff_sql = cutoff.replace(tzinfo=None)  # answer.answered_at is Prisma's timezone-less UTC timestamp
    client = s3_client()
    counts = {"expired": 0, "after_signing": 0, "orphaned": 0, "failed": 0}

    conn = await asyncpg.connect(_dsn(), statement_cache_size=0)
    try:
        rows = await conn.fetch(
            """
            SELECT a.id, a.audio_uri, (a.answered_at < $1) AS expired
            FROM answer a
            JOIN intake_session s ON s.id = a.session_id
            WHERE a.audio_uri IS NOT NULL
              AND (a.answered_at < $1 OR EXISTS (SELECT 1 FROM summary m WHERE m.visit_id = s.visit_id AND m.status = 'signed'))
            """,
            cutoff_sql,
        )
        for r in rows:
            if not _delete_object(client, r["audio_uri"]):
                counts["failed"] += 1
                continue
            reason = f"voice note older than {hours:g} h" if r["expired"] else "visit signed (retention sweep)"
            async with conn.transaction():
                await conn.execute("UPDATE answer SET audio_uri = NULL WHERE id = $1", r["id"])
                await conn.execute(
                    "INSERT INTO audit_log (actor_id, actor_role, action, resource, resource_id, reason) VALUES ($1, 'system', 'audio.delete', 'answer', $2, $3)",
                    ACTOR, str(r["id"]), reason,
                )
            counts["expired" if r["expired"] else "after_signing"] += 1

        # Objects nothing references (the answer that should have followed the upload never arrived).
        referenced = {r["audio_uri"] for r in await conn.fetch("SELECT audio_uri FROM answer WHERE audio_uri IS NOT NULL")}
        bucket = settings.s3_bucket_audio
        token: str | None = None
        while True:
            page = client.list_objects_v2(Bucket=bucket, **({"ContinuationToken": token} if token else {}))
            for obj in page.get("Contents", []):
                uri = f"s3://{bucket}/{obj['Key']}"
                if obj["LastModified"] < cutoff and uri not in referenced and _delete_object(client, uri):
                    await conn.execute(
                        "INSERT INTO audit_log (actor_id, actor_role, action, resource, reason) VALUES ($1, 'system', 'audio.delete', 'storage_object', $2)",
                        ACTOR, f"orphaned upload {obj['Key']} older than {hours:g} h",
                    )
                    counts["orphaned"] += 1
            if not page.get("IsTruncated"):
                break
            token = page.get("NextContinuationToken")
    finally:
        await conn.close()

    log.info("audio retention sweep", **counts, retention_hours=hours)
    return counts
