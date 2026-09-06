from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

REPO_ROOT = Path(__file__).resolve().parents[3]


class Settings(BaseSettings):
    """Only the variables this service reads. See .env.example / docs/07-ayush-terminology.md."""

    model_config = SettingsConfigDict(
        env_file=REPO_ROOT / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    log_level: str = Field(default="info", alias="LOG_LEVEL")
    terminology_service_url: str = Field(
        default="http://localhost:8003", alias="TERMINOLOGY_SERVICE_URL"
    )

    database_url: str = Field(alias="DATABASE_URL")

    # docs/07-ayush-terminology.md: NAMASTE export path, once obtained. Empty by default —
    # infra/seed/namaste/ has no file in this environment (docs/API_KEYS.md: "not obtained").
    namaste_export_path: str = Field(default="", alias="NAMASTE_EXPORT_PATH")

    # WHO ICD-11 API — OAuth2 client_credentials. Both empty in this environment (not obtained);
    # app/icd11/client.py's hosted tier raises ProviderUnavailable and the cascade falls back
    # to the cached-in-Postgres snapshot, which is also empty until a live pull succeeds once.
    icd_client_id: str = Field(default="", alias="ICD_CLIENT_ID")
    icd_client_secret: str = Field(default="", alias="ICD_CLIENT_SECRET")
    icd_token_url: str = Field(
        default="https://icdaccessmanagement.who.int/connect/token", alias="ICD_TOKEN_URL"
    )
    icd_api_url: str = Field(default="https://id.who.int", alias="ICD_API_URL")

    # Lazy-loaded inside app/search/embeddings.py, same pattern as docai's local OCR tier and
    # services/ai's local ASR/TTS tiers — a missing/failed install only disables the
    # cross-script re-ranking signal, trigram search still works.
    embedding_model: str = Field(
        default="sentence-transformers/LaBSE", alias="EMBEDDING_MODEL"
    )


settings = Settings()
