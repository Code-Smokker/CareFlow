"""Multilingual sentence embeddings — the one piece pg_trgm genuinely cannot do.
docs/07-ayush-terminology.md: search must resolve "amavata", "āmavāta", "aam vaat" and
"आमवात" to the same concept. Lowercased trigram comparison (the fix already applied in
services/docai/app/dictionary/search.py and mirrored in app/search/concepts.py) closes the
case-sensitivity gap within one script, but Devanagari and Latin text share zero trigrams no
matter how you normalise case — they're different Unicode ranges. Only a model that embeds
semantically-equivalent text across scripts close together in vector space can bridge that.

Lazy-loaded inside embed(), exactly like services/docai/app/ocr/local.py's local OCR tier and
services/ai/app/speech/local.py's local ASR tier — a missing/failed install only disables this
re-ranking signal; trigram search still runs. See services/terminology/README.md for whether
this has actually been verified to load on this machine.
"""

from __future__ import annotations

from app.config import settings
from app.logging import get_logger

log = get_logger(component="embeddings")

_model = None
_load_failed = False


def _get_model():
    global _model, _load_failed
    if _model is not None or _load_failed:
        return _model
    try:
        from sentence_transformers import SentenceTransformer

        _model = SentenceTransformer(settings.embedding_model)
    except Exception as exc:  # noqa: BLE001 — any failure here just disables the signal
        log.warning("embedding model failed to load, cross-script search disabled", error=str(exc))
        _load_failed = True
        _model = None
    return _model


def embed(text: str) -> list[float] | None:
    """Returns a unit-ish embedding vector for `text`, or None if the model isn't available.
    Callers must treat None as "skip the vector signal", never as an error."""
    model = _get_model()
    if model is None:
        return None
    try:
        vector = model.encode(text, normalize_embeddings=True)
        return vector.tolist()
    except Exception as exc:  # noqa: BLE001
        log.warning("embedding inference failed", error=str(exc))
        return None
