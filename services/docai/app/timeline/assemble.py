"""Timeline assembly — docs/06-document-ai.md's three-tier date normalization: (1) prefer an
explicit date extracted from the document, (2) fall back to a patient-stated date [not available
at this layer — docai only sees the scanned image, not the interview; the gateway is where a
patient-stated date would eventually merge in], (3) fall back to relative ordering, marked
`approximate: true`. Never invents a precise date to avoid tier 3 (contracts change: TimelineEvent
now requires `approximate`, packages/contracts/openapi/docai.yaml).
"""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Any
from uuid import uuid4

from dateutil import parser as date_parser

from app.logging import get_logger

log = get_logger(component="timeline")

_KIND_BY_DOC_TYPE = {
    "prescription": "prescription",
    "lab_report": "lab_report",
    "discharge_summary": "visit",
    "other": "visit",
}


def _parse_date_entities(extractions: list[dict[str, Any]]) -> datetime | None:
    """Picks the highest-confidence parseable `date`-labelled entity. Multiple candidate dates
    on one document are common (issue date, follow-up date); confidence, not position, breaks
    the tie, since a low-confidence OCR misread of a date is worse than no date at all."""
    candidates = sorted(
        (e for e in extractions if e.get("field") == "date"),
        key=lambda e: e.get("confidence", 0.0),
        reverse=True,
    )
    for candidate in candidates:
        try:
            return date_parser.parse(str(candidate["value"]), fuzzy=True, dayfirst=True)
        except (ValueError, OverflowError):
            continue
    return None


def assemble(document_id: str, doc_type: str | None, extractions: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """One TimelineEvent per document — docai processes one document per job (app/tasks.py),
    cross-document ordering/merging is the gateway's job once multiple documents exist for a
    session."""
    kind = _KIND_BY_DOC_TYPE.get(doc_type or "other", "visit")
    explicit_date = _parse_date_entities(extractions)

    if explicit_date is not None:
        occurred_at = explicit_date.replace(tzinfo=explicit_date.tzinfo or timezone.utc)
        approximate = False
    else:
        log.info("no parseable date entity for document, using relative placeholder", document_id=document_id)
        occurred_at = datetime.now(timezone.utc)
        approximate = True

    summary_field = next((e for e in extractions if e.get("field") in ("diagnosis", "drug")), None)
    summary = f"{kind.replace('_', ' ').title()}: {summary_field['value']}" if summary_field else kind.replace("_", " ").title()

    return [
        {
            "event_id": str(uuid4()),
            "occurred_at": occurred_at.isoformat(),
            "kind": kind,
            "summary": summary,
            "approximate": approximate,
        }
    ]
