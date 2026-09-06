"""GET /fhir/CodeSystem/:id — a plain-dict FHIR R4 CodeSystem assembled from `concept` rows.
This is a Python service; packages/fhir (TS, Zod-typed) is used on the gateway side, not here —
see docs/03-api-contracts.md's note that this endpoint's shape is "typed via packages/fhir, not
here" (that refers to how the *gateway* validates a Coding it embeds elsewhere, not this
resource itself).
"""

from __future__ import annotations

from typing import Any

from app.fhir.systems import SYSTEM_URIS


def build_codesystem(system: str, concepts: list[dict[str, Any]]) -> dict[str, Any]:
    return {
        "resourceType": "CodeSystem",
        "id": system,
        "url": SYSTEM_URIS.get(system, f"urn:careflow:system:{system}"),
        "status": "active",
        "content": "complete",
        "count": len(concepts),
        "concept": [
            {
                "code": c["code"],
                "display": c["display"],
                **({"definition": c["definition"]} if c.get("definition") else {}),
            }
            for c in concepts
        ],
    }
