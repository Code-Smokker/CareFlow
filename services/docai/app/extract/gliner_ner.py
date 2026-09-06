"""GLiNER-BioMed zero-shot NER — the structured pass in docs/15-ai-stack.md's extraction
pipeline. Two label sets run over the same region text and are merged, because a single
zero-shot label set biases toward whichever vocabulary the prompt lists first (this is the
"two-pass allopathic+Ayurveda merge" the docai README promises): one pass tuned to allopathic
prescriptions/lab reports, one to AYUSH formulations. Labels for the AYUSH pass are named to
match `DictionarySystem` (services/gateway/prisma/schema.prisma) so extracted entities can be
fuzzy-matched against the right dictionary partition in app/dictionary/search.py.

Unexercised-until-verified, same status as ocr/local.py's PaddleOCR-VL: lazy-imported, raises
ProviderUnavailable rather than crashing the Celery task if the package or weights aren't
available on this machine (see the docai README's reality-check section for the actual result).
"""

from __future__ import annotations

from dataclasses import dataclass

from app.cascade import ProviderUnavailable
from app.config import settings

ALLOPATHIC_LABELS = [
    "drug",
    "dose",
    "frequency",
    "duration",
    "diagnosis",
    "procedure",
    "analyte",
    "value",
    "unit",
    "date",
]

AYUSH_LABELS = [
    "ayush_formulation",
    "ayush_plant",
    "dosha",
]

_MIN_CONFIDENCE = 0.3  # below this, treat as "GLiNER found nothing useful" for this span


@dataclass
class GlinerEntity:
    label: str
    text: str
    score: float
    start: int
    end: int


_model = None


def _load_model():
    global _model
    if _model is not None:
        return _model
    try:
        from gliner import GLiNER
    except ImportError as exc:
        raise ProviderUnavailable(f"gliner not installed: {exc}") from exc
    try:
        _model = GLiNER.from_pretrained(settings.ner_model)
    except Exception as exc:  # noqa: BLE001 - model download/load can fail in many ways
        raise ProviderUnavailable(f"Failed to load {settings.ner_model}: {exc}") from exc
    return _model


def _predict(text: str, labels: list[str]) -> list[GlinerEntity]:
    model = _load_model()
    try:
        raw = model.predict_entities(text, labels, threshold=_MIN_CONFIDENCE)
    except Exception as exc:  # noqa: BLE001
        raise ProviderUnavailable(f"GLiNER inference failed: {exc}") from exc
    return [
        GlinerEntity(label=e["label"], text=e["text"], score=float(e["score"]), start=e["start"], end=e["end"])
        for e in raw
    ]


def extract_two_pass(text: str) -> list[GlinerEntity]:
    """Runs both label sets and merges overlapping spans, keeping the higher-confidence label.
    Raises ProviderUnavailable (not caught here) if the model can't run at all — the caller
    decides the fallback, this function never silently returns an empty result for a load
    failure (that would look identical to "genuinely no entities found")."""
    allopathic = _predict(text, ALLOPATHIC_LABELS)
    ayush = _predict(text, AYUSH_LABELS)
    return merge_passes(allopathic, ayush)


def _spans_overlap(a: GlinerEntity, b: GlinerEntity) -> bool:
    return a.start < b.end and b.start < a.end


def merge_passes(allopathic: list[GlinerEntity], ayush: list[GlinerEntity]) -> list[GlinerEntity]:
    """Pure merge logic, independent of the model — unit-testable without GLiNER installed.
    Where the two passes' spans overlap, keep the higher-confidence entity; non-overlapping
    entities from both passes survive untouched."""
    merged: list[GlinerEntity] = list(allopathic)
    for candidate in ayush:
        overlapping_idx = [i for i, kept in enumerate(merged) if _spans_overlap(kept, candidate)]
        if not overlapping_idx:
            merged.append(candidate)
            continue
        # Keep whichever of the overlapping kept-entities has the higher score; only replace
        # if this ayush candidate beats ALL of them (rare to overlap more than one, but be safe).
        best_overlap_score = max(merged[i].score for i in overlapping_idx)
        if candidate.score > best_overlap_score:
            for i in sorted(overlapping_idx, reverse=True):
                del merged[i]
            merged.append(candidate)
    return merged
