"""Loads the official NAMASTE export (namaste.ayush.gov.in — National Ayurveda Morbidity
Codes) into `concept` rows with `system='namaste'`, per docs/07-ayush-terminology.md.

Read the ORIGINAL file with pandas/openpyxl — never re-saved through a spreadsheet app first.
Excel's own date auto-detection mangles codes like `AAA-2.1` into a date the moment a human
opens and re-saves the file; pandas reading the untouched original avoids that entirely.

The real export's column names are not known in this environment — `infra/seed/namaste/` is
empty (docs/API_KEYS.md: NAMASTE export "not obtained" as of this commit). This module
introspects whatever columns the file actually has and fails loudly with the real column list
if it can't find what it needs, rather than guessing a layout and silently loading garbage.
"""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Any

import pandas as pd

from app.db import get_pool
from app.logging import get_logger
from app.search import embeddings
from app.search.concepts import vector_literal

log = get_logger(component="namaste_load")


class NamasteColumnError(Exception):
    """Raised when the export doesn't have the columns this loader needs. The message always
    carries the actual column list — report it, don't guess past it."""


@dataclass
class NamasteColumns:
    code: str
    english: str
    devanagari: str | None
    diacritical: str | None
    description: str | None


def _find_column(columns: list[str], keywords: list[str], exclude: tuple[str, ...] = ()) -> str | None:
    for col in columns:
        lower = col.lower()
        if any(k in lower for k in keywords) and not any(e in lower for e in exclude):
            return col
    return None


def read_export(path: str | Path) -> pd.DataFrame:
    path = Path(path)
    if not path.exists():
        raise FileNotFoundError(
            f"NAMASTE export not found at {path}. Set NAMASTE_EXPORT_PATH once the file from "
            "namaste.ayush.gov.in is obtained (docs/API_KEYS.md priority 4) — do not point "
            "this at anything re-saved through a spreadsheet app."
        )
    if path.suffix.lower() in (".xlsx", ".xls"):
        return pd.read_excel(path, engine="openpyxl", dtype=str)
    return pd.read_csv(path, dtype=str)


def detect_columns(df: pd.DataFrame) -> NamasteColumns:
    columns = list(df.columns)
    code = _find_column(columns, ["code"])
    devanagari = _find_column(columns, ["devanagari"])
    diacritical = _find_column(columns, ["diacritical", "iast"])
    english = _find_column(columns, ["english"]) or _find_column(
        columns, ["term", "name"], exclude=("devanagari", "diacritical")
    )
    description = _find_column(columns, ["definition", "description"])

    if not code or not english:
        raise NamasteColumnError(
            f"Could not find required NAMASTE columns (need something matching 'code' and "
            f"'english'/'term'/'name'). Actual columns in this export: {columns!r}"
        )
    return NamasteColumns(
        code=code, english=english, devanagari=devanagari, diacritical=diacritical, description=description
    )


def rows_from_dataframe(df: pd.DataFrame, columns: NamasteColumns) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    for _, r in df.iterrows():
        code = str(r[columns.code]).strip() if pd.notna(r[columns.code]) else ""
        english = str(r[columns.english]).strip() if pd.notna(r[columns.english]) else ""
        if not code or not english:
            continue

        synonyms = {english}
        for col in (columns.devanagari, columns.diacritical):
            if col is None:
                continue
            value = r.get(col)
            if pd.notna(value) and str(value).strip():
                synonyms.add(str(value).strip())

        description = None
        if columns.description is not None:
            value = r.get(columns.description)
            if pd.notna(value) and str(value).strip():
                description = str(value).strip()

        rows.append({"code": code, "display": english, "synonyms": sorted(synonyms), "definition": description})
    return rows


_UPSERT = """
INSERT INTO concept (system, code, display, synonyms, definition)
VALUES ('namaste', $1, $2, $3, $4)
ON CONFLICT (system, code)
DO UPDATE SET display = EXCLUDED.display, synonyms = EXCLUDED.synonyms, definition = EXCLUDED.definition
"""

_EMBED_UPDATE = "UPDATE concept SET embedding = $1::vector WHERE system = 'namaste' AND code = $2"


async def upsert_concepts(pool: Any, rows: list[dict[str, Any]]) -> int:
    records = [(r["code"], r["display"], r["synonyms"], r["definition"]) for r in rows]
    if records:
        await pool.executemany(_UPSERT, records)

    # Embedding is best-effort — a load with no embedding model available still loads every
    # concept, just without the cross-script search signal (app/search/embeddings.py).
    embedded = 0
    for r in rows:
        text = " ".join([r["display"], *r["synonyms"]])
        vector = embeddings.embed(text)
        if vector is not None:
            await pool.execute(_EMBED_UPDATE, vector_literal(vector), r["code"])
            embedded += 1
    if embedded < len(rows):
        log.warning(
            "namaste load: embeddings missing for some concepts, cross-script search degraded for those",
            embedded=embedded,
            total=len(rows),
        )
    return len(records)


async def load_namaste(path: str | Path) -> dict[str, Any]:
    df = read_export(path)
    log.info("namaste export read", columns=list(df.columns), row_count=len(df))
    columns = detect_columns(df)
    rows = rows_from_dataframe(df, columns)
    pool = await get_pool()
    loaded = await upsert_concepts(pool, rows)
    return {
        "columns": list(df.columns),
        "row_count": len(df),
        "loaded": loaded,
        "skipped": len(df) - loaded,
    }
