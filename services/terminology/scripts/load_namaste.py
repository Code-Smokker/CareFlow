"""Loads the NAMASTE export into `concept` (system='namaste') and reports what it found. Run
once NAMASTE_EXPORT_PATH points at the real file (infra/seed/namaste/<export> — not obtained as
of this commit, see docs/API_KEYS.md priority 4):

    .venv/bin/python scripts/load_namaste.py

Reports the actual columns found and the row count — verify these against the official export
before trusting anything downstream (docs/07-ayush-terminology.md's verification checklist).
"""

from __future__ import annotations

import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from app.config import settings
from app.namaste.load import load_namaste


async def main() -> None:
    if not settings.namaste_export_path:
        print(
            "NAMASTE_EXPORT_PATH is not set. Point it at the real export from "
            "namaste.ayush.gov.in (the ORIGINAL file — never one re-saved through a "
            "spreadsheet app first) before running this."
        )
        return

    result = await load_namaste(settings.namaste_export_path)
    print(f"Columns found: {result['columns']}")
    print(f"Rows in file:  {result['row_count']}")
    print(f"Loaded:        {result['loaded']}")
    print(f"Skipped:       {result['skipped']} (missing code or English term)")


if __name__ == "__main__":
    asyncio.run(main())
