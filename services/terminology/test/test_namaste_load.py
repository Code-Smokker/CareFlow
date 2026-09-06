"""Proves the pandas/openpyxl read path and column-detection logic work — the one piece of
app/namaste/load.py that's testable without the real export (infra/seed/namaste/ is empty in
this environment). Never touches the database or the real 'namaste' system."""

from __future__ import annotations

from pathlib import Path

import pytest

from app.namaste.load import (
    NamasteColumnError,
    detect_columns,
    read_export,
    rows_from_dataframe,
)

FIXTURE = Path(__file__).parent / "fixtures" / "test_namaste_export.csv"


def test_read_export_reads_the_csv_without_mangling_codes():
    df = read_export(FIXTURE)
    # The exact failure mode this loader exists to avoid: a spreadsheet app reinterprets
    # "TEST-AAA-2.1"-shaped codes as a date. pandas' dtype=str keeps it a literal string.
    assert df["NAMC_CODE"].iloc[0] == "TEST-AAA-2.1"


def test_detect_columns_finds_code_english_devanagari_diacritical_description():
    df = read_export(FIXTURE)
    columns = detect_columns(df)
    assert columns.code == "NAMC_CODE"
    assert columns.english == "NAMC_term"
    assert columns.devanagari == "NAMC_term_DEVANAGARI"
    assert columns.diacritical == "NAMC_term_diacritical"
    assert columns.description == "Short_definition"


def test_detect_columns_fails_loudly_with_the_real_column_list_when_layout_is_unrecognised():
    import pandas as pd

    df = pd.DataFrame({"totally_unexpected_column": ["x"]})
    with pytest.raises(NamasteColumnError) as exc_info:
        detect_columns(df)
    assert "totally_unexpected_column" in str(exc_info.value)


def test_rows_from_dataframe_collects_every_spelling_as_a_synonym():
    df = read_export(FIXTURE)
    columns = detect_columns(df)
    rows = rows_from_dataframe(df, columns)

    assert len(rows) == 2
    amavata = next(r for r in rows if r["code"] == "TEST-AAA-2.1")
    assert amavata["display"] == "Amavata"
    assert set(amavata["synonyms"]) == {"Amavata", "āmavāta", "आमवात"}
    assert amavata["definition"].startswith("Joint pain")


def test_read_export_raises_a_clear_error_for_a_missing_file():
    with pytest.raises(FileNotFoundError):
        read_export("/nonexistent/path.csv")
