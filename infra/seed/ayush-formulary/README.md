# infra/seed/ayush-formulary

Source data for the AYUSH document-extraction path (docs/06-document-ai.md — the extraction
pass that has to recognise a churna or a vati, not just a tablet) and the terminology
crosswalk's classical-formulation vocabulary (docs/07-ayush-terminology.md).

```
afi-part1.pdf         The Ayurvedic Formulary of India, Part I (2nd rev. English ed.)
afi-part2.pdf         The Ayurvedic Formulary of India, Part II (1st English ed.)
afi-part1-ocr.txt     Internet Archive's own OCR (djvu text) of afi-part1.pdf
afi-part2-ocr.txt     Internet Archive's own OCR (djvu text) of afi-part2.pdf
extract_afi.py        Regenerates afi-formulations.csv from the two *-ocr.txt files
afi-formulations.csv  569 candidate formulation names extracted from both parts
```

## Provenance

Both PDFs are Government of India publications — Ministry of Health & Family Welfare,
Department of Indian Systems of Medicine & Homoeopathy (now AYUSH) — hosted on Internet
Archive:

- Part I: <https://archive.org/details/b32232184>
- Part II: <https://archive.org/details/b32232172>

The `*-ocr.txt` files are Internet Archive's own OCR derivative of each PDF (the `_djvu.txt`
file each archive.org item publishes), fetched alongside the PDF so `extract_afi.py` is
reproducible from what's committed here without re-hitting archive.org.

## What `afi-formulations.csv` actually is, and isn't

**A first-pass OCR extraction, not a verified formulary.** `extract_afi.py` recognises AFI's
own numbering convention — a formulation's monograph starts with a line like `1 : 2 AMRTARISTA`
(category number `:` formulation number, then the name in capitals) — and pulls out
(category, number, name, source line). That's it. It does not:

- correct OCR errors (e.g. row `1:18` reads `DAS AMULARISTA` — almost certainly
  `DASAMULARISTA` with a spurious OCR space; left as-is rather than silently "fixed" by a
  guess)
- deduplicate the 8 names that appear twice (likely genuine — a formulation cross-referenced
  in an index section as well as its main monograph — but not confirmed)
- resolve category numbers to category names beyond what's tracked from the contents-page
  header tokens (`category_section` is often correct but not verified per-row)

`needs_review=True` on a row means the script itself flagged that name as an unusually-shaped
extraction (more than 3 words, or a very short fragment) — **the absence of that flag is not a
verification**, it just means that particular row didn't trip the one heuristic this script
checks. Every row is PLACEHOLDER-grade until a human with Ayurvedic training has read it against
the source PDF — the same discipline docs/07-ayush-terminology.md already applies to NAMASTE
and ICD-11 TM2 codes.

## Licence

Government of India publications; treated here as public-domain government works, same as the
NAMASTE export and WHO ICD-API snapshot elsewhere in this repo. Not redistributed for any
purpose beyond this project's own AYUSH-terminology and document-extraction work.
