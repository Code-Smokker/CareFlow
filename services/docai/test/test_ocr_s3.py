"""Regression test for the bug fixed in app.ocr.image_source: hosted OCR (and local OCR) used
to call `open(image_ref, "rb")` directly, which only ever worked because test fixtures happened
to sit on local disk — every real upload gets an `s3://{bucket}/{key}` ref from
services/gateway/src/common/s3.client.ts, and that path was never exercised by a test. This
pushes a real object to the configured object store (Supabase Storage's S3 endpoint by default, or the
local MinIO container when STORAGE_PROVIDER=minio) and reads it back through an s3:// ref, the same way a real upload would.
"""

from __future__ import annotations

import base64
import uuid

import pytest

from app.config import settings
from app.ocr import hosted
from app.ocr.image_source import read_bytes
from app.storage import s3_client

# A real, minimal, valid 1x1 white-pixel JPEG (~125 bytes) — needs to actually decode as an
# image for the live-Gemini test below to exercise a real API round trip rather than an
# API-level rejection of malformed image data.
_FAKE_JPEG_BYTES = base64.b64decode(
    "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4n"
    "ICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIy"
    "MjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAA"
    "AAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEA"
    "AAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
)


def _s3_client():
    return s3_client()


@pytest.fixture
def uploaded_s3_ref():
    """Puts a real object in the real MinIO container and returns its s3:// ref, cleaning up
    after — mirrors exactly what S3StorageClient.putObject hands docai in production."""
    client = _s3_client()
    key = f"test/{uuid.uuid4()}.jpg"
    client.put_object(Bucket=settings.s3_bucket_documents, Key=key, Body=_FAKE_JPEG_BYTES, ContentType="image/jpeg")
    yield f"s3://{settings.s3_bucket_documents}/{key}"
    client.delete_object(Bucket=settings.s3_bucket_documents, Key=key)


async def test_read_bytes_fetches_from_real_minio_via_s3_ref(uploaded_s3_ref):
    result = await read_bytes(uploaded_s3_ref)
    assert result == _FAKE_JPEG_BYTES


async def test_read_bytes_still_reads_a_local_path(tmp_path):
    local_file = tmp_path / "prescription.jpg"
    local_file.write_bytes(_FAKE_JPEG_BYTES)
    result = await read_bytes(str(local_file))
    assert result == _FAKE_JPEG_BYTES


@pytest.mark.skipif(not settings.ocr_api_key, reason="OCR_API_KEY not set — no live Gemini credentials")
async def test_hosted_ocr_reads_a_real_minio_upload_via_s3_ref(uploaded_s3_ref):
    """The actual bug this task fixes, end to end: hosted.read() used to fail with
    FileNotFoundError on every real upload regardless of API key, because it never got past
    open(s3://...). This asserts it now reaches Gemini and gets back a real response for an
    object that only exists in MinIO, never touching local disk."""
    result = await hosted.read(uploaded_s3_ref)
    assert result.regions
    assert isinstance(result.regions[0].text, str)
