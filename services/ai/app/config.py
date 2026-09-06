from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

REPO_ROOT = Path(__file__).resolve().parents[3]


class Settings(BaseSettings):
    """Only the variables this service reads. See .env.example / docs/15-ai-stack.md for why
    each provider was chosen and what its fallback is."""

    model_config = SettingsConfigDict(
        env_file=REPO_ROOT / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    log_level: str = Field(default="info", alias="LOG_LEVEL")
    ai_service_url: str = Field(default="http://localhost:8001", alias="AI_SERVICE_URL")

    # ---- speech ----
    asr_provider: str = Field(default="sarvam", alias="ASR_PROVIDER")
    tts_provider: str = Field(default="sarvam", alias="TTS_PROVIDER")
    tts_cache_dir: Path = Field(default=Path("./.cache/tts"), alias="TTS_CACHE_DIR")

    sarvam_api_key: str = Field(default="", alias="SARVAM_API_KEY")
    sarvam_stt_model: str = Field(default="saaras:v3", alias="SARVAM_STT_MODEL")
    sarvam_stt_mode: str = Field(default="codemix", alias="SARVAM_STT_MODE")
    sarvam_sample_rate: int = Field(default=16000, alias="SARVAM_SAMPLE_RATE")
    sarvam_tts_model: str = Field(default="bulbul:v2", alias="SARVAM_TTS_MODEL")
    sarvam_tts_speaker: str = Field(default="", alias="SARVAM_TTS_SPEAKER")

    bhashini_user_id: str = Field(default="", alias="BHASHINI_USER_ID")
    bhashini_ulca_api_key: str = Field(default="", alias="BHASHINI_ULCA_API_KEY")
    bhashini_inference_api_key: str = Field(default="", alias="BHASHINI_INFERENCE_API_KEY")
    bhashini_pipeline_id: str = Field(default="", alias="BHASHINI_PIPELINE_ID")
    bhashini_config_url: str = Field(
        default="https://meity-auth.ulcacontrib.org/ulca/apis/v0/model/getModelsPipeline",
        alias="BHASHINI_CONFIG_URL",
    )

    local_asr_model: str = Field(
        default="ai4bharat/indic-conformer-600m-multilingual", alias="LOCAL_ASR_MODEL"
    )
    local_asr_enabled: bool = Field(default=True, alias="LOCAL_ASR_ENABLED")
    local_tts_model: str = Field(default="ai4bharat/IndicF5", alias="LOCAL_TTS_MODEL")

    # ---- LLM ----
    llm_provider: str = Field(default="sarvam", alias="LLM_PROVIDER")
    llm_api_key: str = Field(default="", alias="LLM_API_KEY")
    llm_slot_model: str = Field(default="sarvam-30b", alias="LLM_SLOT_MODEL")
    llm_summary_model: str = Field(default="sarvam-105b", alias="LLM_SUMMARY_MODEL")
    llm_base_url: str = Field(default="", alias="LLM_BASE_URL")

    # ---- ontology ----
    ontology_modules_path: Path = Field(
        default=REPO_ROOT / "packages" / "ontology" / "modules",
        alias="ONTOLOGY_MODULES_PATH",
    )


settings = Settings()
