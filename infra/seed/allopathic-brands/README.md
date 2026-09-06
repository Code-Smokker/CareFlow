# infra/seed/allopathic-brands

Source data for the allopathic side of the docai dictionary (docs/06-document-ai.md stage 4).
Deliberately not RxNorm — RxNorm doesn't carry Indian market brand names (it has no concept
for "Dolo 650" or "Shelcal"), which is exactly the vocabulary an OCR'd Indian prescription
needs matched against.

```
indian_medicine_data.csv   253,973 rows: brand name, price, manufacturer, dosage form,
                            up to two active-ingredient compositions
```

## Provenance

[junioralive/Indian-Medicine-Dataset](https://github.com/junioralive/Indian-Medicine-Dataset),
MIT licence. Fetched 2026-09-06 from the repo's `DATA/indian_medicine_data.csv` (the JSON
mirror in the same repo and `updated_indian_medicine_data.csv` were not fetched — one file is
enough to seed from, and re-fetching either later is a `curl`, not a repo-state change).

## What's actually in it, and isn't

Checked directly, not assumed: `Dolo 650 Tablet` is in this dataset (row seeds an `allopathic`
dictionary_entry with `Paracetamol` and the stripped form `Dolo 650` as synonyms — see
`services/docai/scripts/seed_dictionaries.py`). **`Shelcal` is not** — grepped the raw file,
zero matches, under several spelling variants. This snapshot's own coverage gap, not a seeding
bug; reported here rather than silently claimed complete. If Shelcal specifically is needed for
a demo, it needs adding by hand or a different/newer source snapshot.

All 253,973 rows are `type: allopathy` — no ayurvedic/homeopathic entries to filter out.
