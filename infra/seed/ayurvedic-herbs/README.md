# infra/seed/ayurvedic-herbs

Source data for the Ayurvedic-plant side of the docai dictionary (docs/06-document-ai.md
stage 4) — so a prescription's raw material name (not just the classical formulation it's
compounded into) resolves to one concept regardless of spelling or script.

```
herb.json   360 Ayurvedic medicinal plants: name, botanical binomial, family, English name,
            Sanskrit synonyms, part used, main indications, rasa/guna/virya/vipaka/prabhava
```

## Provenance

[sciencewithsaucee-sudo/herb-database](https://github.com/sciencewithsaucee-sudo/herb-database)
("Amidha Ayurveda Herb Database"), CC-BY-4.0. Fetched 2026-09-06 from the repo's `herb.json`.

## What's actually in it, and isn't

The dataset's Sanskrit synonyms are Latin-transliterated only — **no Devanagari script**.
`services/docai/scripts/seed_dictionaries.py` adds exactly one hand-curated Devanagari synonym
(अश्वगंधा, for Ashwagandha) as the specific worked example this project's document-AI design
names (ashwagandha / aswagandha / अश्वगंधा / Withania somnifera resolving to one concept). It is
**not** done for the other 359 plants — generating Devanagari transliterations this script can't
verify would be exactly the kind of unverified, silently-asserted data CLAUDE.md's
DOCUMENTED-vs-ASSUMED discipline exists to prevent. A real Devanagari column is future work,
ideally sourced rather than machine-transliterated.
