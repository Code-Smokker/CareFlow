"""Sarvam rejects a bare language code with a 400 — which, before this mapping, meant voice never worked at all."""

import pytest

from app.speech.sarvam import sarvam_language


@pytest.mark.parametrize(
    ("given", "expected"),
    [
        ("hi", "hi-IN"),
        ("en", "en-IN"),
        ("ta", "ta-IN"),
        ("HI", "hi-IN"),
        ("hi-IN", "hi-IN"),  # already qualified: untouched
        ("or", "od-IN"),  # ISO 639-1 "or" is Sarvam's "od"
        ("xx", "unknown"),  # unrecognised: let Sarvam detect the language
        ("", "unknown"),
        (None, "unknown"),
    ],
)
def test_bare_codes_become_bcp47(given: str | None, expected: str) -> None:
    assert sarvam_language(given) == expected
