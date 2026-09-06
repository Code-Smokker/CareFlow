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

    s3_endpoint: str = Field(default="http://localhost:9000", alias="S3_ENDPOINT")
    s3_access_key: str = Field(default="careflow", alias="S3_ACCESS_KEY")
    s3_secret_key: str = Field(default="careflow123", alias="S3_SECRET_KEY")
    s3_bucket: str = Field(default="careflow-documents", alias="S3_BUCKET")

    # Gateway owns the Socket.IO server (docs/01-architecture.md) — this worker can't emit a WS
    # event itself, so it calls back here when a job finishes and the gateway emits
    # document.processed on its behalf.
    gateway_callback_url: str = Field(
        default="http://localhost:4000/v1/internal/documents/callback", alias="GATEWAY_CALLBACK_URL"
    )

    # docs/06-document-ai.md's "OCR reality check" — hosted (vision model via the LLM adapter)
    # -> local (PaddleOCR-VL, unexercised on this machine — see that doc) -> stub (always on).
    ocr_provider: str = Field(default="stub", alias="OCR_PROVIDER")

    llm_provider: str = Field(default="sarvam", alias="LLM_PROVIDER")
    llm_api_key: str = Field(default="", alias="LLM_API_KEY")
    llm_base_url: str = Field(default="", alias="LLM_BASE_URL")


settings = Settings()
