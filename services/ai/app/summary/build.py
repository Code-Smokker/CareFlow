"""Saar (essence) — the summary generator. Structured object first, English and local-language
prose rendered *from* that object, never the other way round (CLAUDE.md rule 2, docs/14-features.md
section 5: "Structured object generated first; prose rendered from it, never the reverse.").

Nothing in this file decides what to ask or evaluates a red flag — it only re-describes answers
that have already been collected, so it needs no model call either. A real LLM-backed
summariser (structuring free text, cross-referencing document extractions) is future work; this
is the honest version of what exists today: chief complaint + HPI from packages/ontology
answers, everything upstream of HPI genuinely empty because nothing populates it yet.
"""

from __future__ import annotations

from typing import Any

from app.ontology.loader import UnknownModuleError, get_module
from app.ontology.schemas import OntologyModule, Slot
from app.summary.schemas import LOW_CONFIDENCE_THRESHOLD, SummaryField

CHIEF_COMPLAINT_SLOT_ID = "chief_complaint"

# Sections not yet populated by anything upstream (docs/05-interview-engine.md phases 5-9 —
# past history, drugs & allergy, family, personal, ROS — have no ontology module yet). Listed
# explicitly, and always present in `structured`, so the shape is stable even though the
# content is honestly empty rather than fabricated.
_EMPTY_SECTIONS = [
    "past_history",
    "drugs_and_allergy",
    "family_history",
    "personal_history",
    "review_of_systems",
]

_NOT_CAPTURED_EN = "Not captured in this version."
_NOT_CAPTURED_LOCAL = {
    "hi": "इस संस्करण में दर्ज नहीं किया गया।",
}


def _effective_confidence(input_mode: str, confidence: float | None) -> float:
    if confidence is not None:
        return confidence
    # Tap/chip/bodymap answers are unambiguous by construction — no ASR uncertainty to reflect.
    # Voice/OCR answers with no confidence reported are treated conservatively.
    return 1.0 if input_mode in ("tap", "bodymap", "proxy") else 0.5


def _ref(input_mode: str, slot_id: str, audio_offset_ms: int | None) -> str:
    if input_mode == "voice" and audio_offset_ms is not None:
        return str(audio_offset_ms)
    return slot_id


def _to_summary_field(
    *, label: str, value: Any, input_mode: str, confidence: float | None, slot_id: str, audio_offset_ms: int | None
) -> SummaryField:
    effective = _effective_confidence(input_mode, confidence)
    return SummaryField(
        label=label,
        value=value,
        source=input_mode,  # type: ignore[arg-type]
        confidence=effective,
        ref=_ref(input_mode, slot_id, audio_offset_ms),
        low_confidence=effective < LOW_CONFIDENCE_THRESHOLD,
    )


def _slot_label(module: OntologyModule | None, slot_id: str, language: str) -> str:
    if module is None:
        return slot_id
    slot = next((s for s in module.slots if s.id == slot_id), None)
    if slot is None:
        return slot_id
    return slot.prompt.get(language) or slot.prompt.get("en", slot_id)


def _localise_value(slot: Slot | None, value: Any, language: str) -> Any:
    """For enum/enum_multi slots, render the option's label in `language` instead of its raw
    code — "continuous" becomes "पूरे दिन", not itself. Every other type has no fixed option
    set to translate against, so the raw value is what there is."""
    if slot is None or not slot.options:
        return value
    labels = {o.value: (o.label.get(language) or o.label.get("en", o.value)) for o in slot.options}
    if isinstance(value, list):
        return [labels.get(v, v) for v in value]
    return labels.get(value, value)


def build_summary(
    *,
    answers: list[dict[str, Any]],
    extractions: list[dict[str, Any]],
    module_id: str | None,
    language: str,
) -> dict[str, Any]:
    chief_complaint_answer = next((a for a in answers if a["slot_id"] == CHIEF_COMPLAINT_SLOT_ID), None)
    resolved_module_id = module_id or (str(chief_complaint_answer["value"]) if chief_complaint_answer else None)

    module: OntologyModule | None = None
    if resolved_module_id:
        try:
            module = get_module(resolved_module_id)
        except UnknownModuleError:
            module = None  # render with slot_ids as labels rather than failing the whole summary

    chief_complaint = None
    if chief_complaint_answer:
        chief_complaint = _to_summary_field(
            label="Chief complaint",
            value=module.label if module else chief_complaint_answer["value"],
            input_mode=chief_complaint_answer["input_mode"],
            confidence=chief_complaint_answer.get("confidence"),
            slot_id=CHIEF_COMPLAINT_SLOT_ID,
            audio_offset_ms=chief_complaint_answer.get("audio_offset_ms"),
        )

    # HPI answers in the module's declared slot order where the module is known (that order
    # *is* the clinical framework — SOCRATES/OLDCARTS/DASHAVIDHA), else in request order.
    hpi_answers = [a for a in answers if a["slot_id"] != CHIEF_COMPLAINT_SLOT_ID]
    if module:
        order = {s.id: i for i, s in enumerate(module.slots)}
        hpi_answers.sort(key=lambda a: order.get(a["slot_id"], len(order)))

    history_of_present_illness = {
        a["slot_id"]: _to_summary_field(
            label=_slot_label(module, a["slot_id"], "en"),
            value=a["value"],
            input_mode=a["input_mode"],
            confidence=a.get("confidence"),
            slot_id=a["slot_id"],
            audio_offset_ms=a.get("audio_offset_ms"),
        )
        for a in hpi_answers
    }

    prior_investigations = [
        _to_summary_field(
            label=str(e.get("field", e.get("entity_type", "document finding"))),
            value=e.get("payload", e.get("value", e)),
            input_mode="ocr",
            confidence=e.get("confidence"),
            slot_id=str(e.get("field", "extraction")),
            audio_offset_ms=None,
        )
        for e in extractions
    ]

    structured: dict[str, Any] = {
        "chief_complaint": chief_complaint.model_dump() if chief_complaint else None,
        "history_of_present_illness": {k: v.model_dump() for k, v in history_of_present_illness.items()},
        "prior_investigations": [f.model_dump() for f in prior_investigations],
    }
    for section in _EMPTY_SECTIONS:
        structured[section] = None

    rendered_en = _render(structured, module, hpi_answers, language="en")
    rendered_local = _render(structured, module, hpi_answers, language=language)
    return {"structured": structured, "rendered_en": rendered_en, "rendered_local": rendered_local}


def _render(structured: dict[str, Any], module: OntologyModule | None, hpi_answers: list[dict[str, Any]], language: str) -> str:
    lines: list[str] = []
    not_captured = _NOT_CAPTURED_LOCAL.get(language, _NOT_CAPTURED_EN) if language != "en" else _NOT_CAPTURED_EN

    cc = structured["chief_complaint"]
    cc_label = "Chief complaint" if language == "en" else "मुख्य शिकायत" if language == "hi" else "Chief complaint"
    if cc:
        lines.append(f"{cc_label}: {cc['value']}")
    else:
        lines.append(f"{cc_label}: {not_captured}")

    hpi_label = "History of present illness" if language == "en" else "वर्तमान बीमारी का विवरण" if language == "hi" else "History of present illness"
    lines.append(f"{hpi_label}:")
    if hpi_answers:
        for answer in hpi_answers:
            slot = next((s for s in module.slots if s.id == answer["slot_id"]), None) if module else None
            label = _slot_label(module, answer["slot_id"], language)
            value = _localise_value(slot, answer["value"], language)
            field = structured["history_of_present_illness"][answer["slot_id"]]
            marker = " (?)" if field["low_confidence"] else ""
            lines.append(f"  - {label}: {value}{marker}")
    else:
        lines.append(f"  {not_captured}")

    section_labels_en = {
        "past_history": "Past history",
        "drugs_and_allergy": "Drugs and allergy",
        "family_history": "Family history",
        "personal_history": "Personal history",
        "review_of_systems": "Review of systems",
        "prior_investigations": "Prior investigations",
    }
    for key, en_label in section_labels_en.items():
        value = structured[key]
        if key == "prior_investigations":
            if value:
                lines.append(f"{en_label}:")
                lines.extend(f"  - {f['label']}: {f['value']}" for f in value)
            else:
                lines.append(f"{en_label}: {not_captured}")
        else:
            lines.append(f"{en_label}: {not_captured}")

    return "\n".join(lines)
