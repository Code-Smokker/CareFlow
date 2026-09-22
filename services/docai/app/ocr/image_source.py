"""Resolves an `image_ref` (a local filesystem path, or an `s3://{bucket}/{key}` URI as minted
by services/gateway/src/common/s3.client.ts's `putObject`) to raw image bytes. Every real upload
goes through MinIO, so `s3://` is the ref every OCR tier actually receives outside of tests —
`open(image_ref, "rb")` alone (the bug this module fixes) only ever passed because test fixtures
happened to sit on local disk.

Shared by app/ocr/hosted.py and app/ocr/local.py — both tiers read an image the same way; only
what they do with the bytes afterwards differs.
"""

from __future__ import annotations

import asyncio
from urllib.parse import urlsplit


from app.cascade import ProviderUnavailable
from app.config import settings
from app.storage import s3_client

_S3_SCHEME = "s3://"


def _s3_client():
    return s3_client()


def _fetch_s3_sync(bucket: str, key: str) -> bytes:
    response = _s3_client().get_object(Bucket=bucket, Key=key)
    return response["Body"].read()


async def read_bytes(image_ref: str) -> bytes:
    if image_ref.startswith(_S3_SCHEME):
        parsed = urlsplit(image_ref)
        bucket, key = parsed.netloc, parsed.path.lstrip("/")
        try:
            return await asyncio.to_thread(_fetch_s3_sync, bucket, key)
        except Exception as exc:  # noqa: BLE001 - boto3 raises its own ClientError hierarchy
            raise ProviderUnavailable(f"Could not fetch '{image_ref}' from S3: {exc}") from exc

    try:
        with open(image_ref, "rb") as f:
            return f.read()
    except OSError as exc:
        raise ProviderUnavailable(f"Could not read image_ref '{image_ref}': {exc}") from exc
