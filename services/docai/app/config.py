from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

REPO_ROOT = Path(__file__).resolve().parents[3]


class Settings(BaseSettings):
    """Only the variables this service reads. See .env.example / docs/06-document-ai.md."""

    model_config = SettingsConfigDict(
        env_file=REPO_ROOT / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    log_level: str = Field(default="info", alias="LOG_LEVEL")
    docai_service_url: str = Field(default="http://localhost:8002", alias="DOCAI_SERVICE_URL")

    database_url: str = Field(alias="DATABASE_URL")
    redis_url: str = Field(default="redis://localhost:6379", alias="REDIS_URL")

    # Object storage: Supabase Storage (S3 protocol) or local MinIO — the same code path, only the endpoint,
    # region and keys differ (rule 9). The two `*_id` / `*_secret_access_key` names are canonical; the older
    # S3_ACCESS_KEY / S3_SECRET_KEY are still read as a fallback so an existing .env keeps working.
    s3_endpoint: str = Field(default="http://localhost:9000", alias="S3_ENDPOINT")
    s3_region: str = Field(default="us-east-1", alias="S3_REGION")
    s3_access_key_id: str | None = Field(default=None, alias="S3_ACCESS_KEY_ID")
    s3_secret_access_key: str | None = Field(default=None, alias="S3_SECRET_ACCESS_KEY")
    s3_access_key: str | None = Field(default=None, alias="S3_ACCESS_KEY")
    s3_secret_key: str | None = Field(default=None, alias="S3_SECRET_KEY")
    s3_bucket_documents: str = Field(default="intake-documents", alias="S3_BUCKET_DOCUMENTS")
    s3_bucket_audio: str = Field(default="intake-audio", alias="S3_BUCKET_AUDIO")
    # Voice notes are kept only with consent, and never longer than this (or until the visit is signed).
    audio_retention_hours: float = Field(default=24, alias="AUDIO_RETENTION_HOURS")

    @property
    def resolved_s3_access_key_id(self) -> str:
        return self.s3_access_key_id or self.s3_access_key or "careflow"

    @property
    def resolved_s3_secret_access_key(self) -> str:
        return self.s3_secret_access_key or self.s3_secret_key or "careflow123"

    # Gateway owns the Socket.IO server (docs/01-architecture.md) — this worker can't emit a WS
    # event itself, so it calls back here when a job finishes and the gateway emits
    # document.processed on its behalf.
    gateway_callback_url: str = Field(
        default="http://localhost:4000/v1/internal/documents/callback", alias="GATEWAY_CALLBACK_URL"
    )

    # docs/06-document-ai.md's "OCR reality check" — hosted -> local (PaddleOCR-VL) -> stub
    # (always on). hosted is Gemini (Google AI Studio), not the LLM_* adapter above — Sarvam
    # (the LLM_PROVIDER default) has no vision-capable chat completions endpoint, confirmed live
    # 2026-09-07 (see app/ocr/hosted.py's module docstring).
    ocr_provider: str = Field(default="stub", alias="OCR_PROVIDER")
    ocr_api_key: str = Field(default="", alias="OCR_API_KEY")
    ocr_model: str = Field(default="", alias="OCR_MODEL")
    ocr_base_url: str = Field(
        default="https://generativelanguage.googleapis.com/v1beta", alias="OCR_BASE_URL"
    )

    llm_provider: str = Field(default="sarvam", alias="LLM_PROVIDER")
    llm_api_key: str = Field(default="", alias="LLM_API_KEY")
    llm_base_url: str = Field(default="", alias="LLM_BASE_URL")

    # C2 — GLiNER-BioMed zero-shot NER for the structured extraction pass (docs/15-ai-stack.md
    # "Medical entity extraction"). Lazy-loaded in app/extract/gliner_ner.py, same pattern as
    # ocr/local.py's PaddleOCR-VL — absence of the package/weights degrades, never crashes.
    ner_model: str = Field(default="Ihor/gliner-biomed-base-v1.0", alias="NER_MODEL")


settings = Settings()
