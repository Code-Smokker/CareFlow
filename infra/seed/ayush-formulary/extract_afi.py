#!/usr/bin/env python3
"""First-pass extraction of formulation names from AFI's OCR'd text (afi-part1-ocr.txt,
afi-part2-ocr.txt — Internet Archive's own djvu OCR of afi-part1.pdf/afi-part2.pdf in this same
directory). Regenerates afi-formulations.csv.

Pattern observed: '<category_no> : <formulation_no> <NAME IN CAPS>' marks each monograph's
start, e.g. '1 : 2 AMRTARISTA'. This is OCR of a scanned government publication, not a
structured data source — treat every row as a first-pass extract that needs human review
before being used as authoritative, same PLACEHOLDER discipline as every other unverified code
in this repo (docs/07-ayush-terminology.md). `needs_review=True` flags rows this script itself
is least confident about (multi-word or short-fragment names); the rest still isn't verified,
just less immediately suspect.

Usage: python3 extract_afi.py afi-formulations.csv
"""

import csv
import re
import sys
from pathlib import Path

HERE = Path(__file__).parent

HEADER_RE = re.compile(r"(?:^|\s)(\d{1,2})\s*[:;]\s*(\d{1,3})\s+([A-Z][A-Z](?:[A-Z\s]*[A-Z])?)\b")

# Known category header tokens from the AFI Part I contents list, used to track which
# dosage-form section a formulation number belongs to as we scan sequentially.
CATEGORY_HEADERS = [
    "ASAVA AND ARISTA", "ARKA", "AVALEHA AND PAKA", "KVATHA", "GUGGULU", "GHRTA", "CURNA",
    "TAILA", "DRAVAKA", "LAVANA KSARA", "LEPA", "VATI AND GUTIKA",
    "VARTTI-NETRABINDU AND ANJANA", "SATTVA", "KUPIPAKVA RASAYANA", "PARPATI", "PISTI",
    "BHASMA", "MANDURA", "RASAYOGA", "LAUHA",
]


def clean_name(raw: str) -> str:
    name = re.sub(r"\s+", " ", raw).strip()
    # OCR sometimes splits one word into two with a spurious space (DAS AMULARISTA) — can't
    # reliably undo that automatically; leave it, flag for review via the needs_review column.
    return name


def looks_suspect(name: str) -> bool:
    words = name.split()
    # A single very short "word" fragment, or more than 3 words, is more likely OCR noise than
    # a real formulation name (most AFI names are one or two words).
    return len(words) > 3 or any(len(w) <= 2 for w in words)


def extract(path: Path, source: str) -> list[dict]:
    rows = []
    current_category = ""
    with path.open(encoding="utf-8") as f:
        for lineno, line in enumerate(f, start=1):
            stripped = line.strip()
            if stripped in CATEGORY_HEADERS:
                current_category = stripped
                continue
            for m in HEADER_RE.finditer(line):
                cat_no, formulation_no, raw_name = m.groups()
                name = clean_name(raw_name)
                if not name or name in ("PL", "RZ", "ST", "BK"):  # plant-part abbreviations, not names
                    continue
                rows.append(
                    {
                        "source": source,
                        "category_section": current_category,
                        "category_no": cat_no,
                        "formulation_no": formulation_no,
                        "name": name,
                        "needs_review": looks_suspect(name),
                        "source_line": lineno,
                    }
                )
    return rows


def main():
    if len(sys.argv) != 2:
        print(f"usage: {sys.argv[0]} <output.csv>", file=sys.stderr)
        sys.exit(1)

    all_rows = []
    all_rows += extract(HERE / "afi-part1-ocr.txt", "afi-part1")
    all_rows += extract(HERE / "afi-part2-ocr.txt", "afi-part2")

    with open(sys.argv[1], "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(
            f,
            fieldnames=["source", "category_section", "category_no", "formulation_no", "name", "needs_review", "source_line"],
        )
        writer.writeheader()
        writer.writerows(all_rows)

    print(f"Extracted {len(all_rows)} candidate formulation entries -> {sys.argv[1]}")
    flagged = sum(1 for r in all_rows if r["needs_review"])
    print(f"{flagged} flagged needs_review (multi-word or short-fragment names)")


if __name__ == "__main__":
    main()
