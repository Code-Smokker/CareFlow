"""POST /evaluate-flags — CLAUDE.md rule 3: deterministic rules only, evaluated over filled
slots. No model call in this file, and none is permitted — if it ever gains one, that is a bug
against CLAUDE.md rule 3 and against packages/contracts/openapi/ai.yaml's own description of
this endpoint."""

from typing import Any, Literal

from fastapi import APIRouter
from pydantic import BaseModel

from app.errors import AppError
from app.logging import get_logger
from app.ontology.expression import evaluate_expression
from app.ontology.loader import UnknownModuleError, get_module

router = APIRouter()
log = get_logger(router="evaluate_flags")

Severity = Literal["info", "warning", "critical"]

_SEVERITY_MAP: dict[int, Severity] = {1: "critical", 2: "warning", 3: "info"}


class EvaluateFlagsRequest(BaseModel):
    module_id: str
    slots: dict[str, Any]


class RedFlagFinding(BaseModel):
    rule_id: str
    severity: Severity
    quote: str


class EvaluateFlagsResponse(BaseModel):
    fired: list[RedFlagFinding]


@router.post("/evaluate-flags", response_model=EvaluateFlagsResponse)
def evaluate_flags(body: EvaluateFlagsRequest) -> EvaluateFlagsResponse:
    try:
        module = get_module(body.module_id)
    except UnknownModuleError as exc:
        raise AppError(404, "unknown_module", str(exc)) from exc

    fired = [
        RedFlagFinding(
            rule_id=rule.id,
            severity=_SEVERITY_MAP[rule.severity],
            # No ASR transcript to quote verbatim yet (Day 2) — the rule's own clinical
            # rationale is the best available justification until voice lands.
            quote=rule.rationale or rule.id,
        )
        for rule in module.red_flags or []
        if evaluate_expression(rule.when, body.slots)
    ]
    log.info("flags evaluated", module_id=body.module_id, fired=[f.rule_id for f in fired])
    return EvaluateFlagsResponse(fired=fired)
