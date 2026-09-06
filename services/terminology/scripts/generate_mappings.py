"""Generates candidate NAMASTE -> ICD-11 TM2/MMS mappings by lexical match (docs/07-
ayush-terminology.md step 4) once concepts exist for both systems. Run after scripts/
load_namaste.py and a successful ICD-11 pull (services/terminology's ICD-11 client currently
has no live credentials — ICD_CLIENT_ID/SECRET empty — so icd11-tm2/icd11-bio concepts won't
exist yet either; this script will report source_concepts=0, exact=0, fuzzy=0 until both exist,
which is the honest state, not a bug):

    .venv/bin/python scripts/generate_mappings.py

Every mapping this writes has reviewed_by=NULL and provenance='lexical' — never presented as
clinically validated (ADR 0005).
"""

from __future__ import annotations

import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from app.mapping.generate import generate_candidate_mappings  # noqa: E402


async def main() -> None:
    for target in ("icd11-tm2", "icd11-bio"):
        result = await generate_candidate_mappings("namaste", target)
        print(f"namaste -> {target}: {result}")


if __name__ == "__main__":
    asyncio.run(main())
