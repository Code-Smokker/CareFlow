"""GET /fhir/ConceptMap/:id/$translate — a plain-dict FHIR R4 Parameters resource, the
standard $translate response shape (`result` + `match[]`, each with `equivalence` and
`concept`)."""

from __future__ import annotations

from typing import Any

from app.fhir.systems import SYSTEM_URIS


def build_translate_parameters(
    matched: bool,
    target_system: str | None = None,
    target_code: str | None = None,
    target_display: str | None = None,
    equivalence: str | None = None,
) -> dict[str, Any]:
    if not matched or target_system is None:
        return {
            "resourceType": "Parameters",
            "parameter": [{"name": "result", "valueBoolean": False}],
        }

    return {
        "resourceType": "Parameters",
        "parameter": [
            {"name": "result", "valueBoolean": True},
            {
                "name": "match",
                "part": [
                    {"name": "equivalence", "valueCode": equivalence},
                    {
                        "name": "concept",
                        "valueCoding": {
                            "system": SYSTEM_URIS.get(target_system, f"urn:careflow:system:{target_system}"),
                            "code": target_code,
                            "display": target_display,
                        },
                    },
                ],
            },
        ],
    }
