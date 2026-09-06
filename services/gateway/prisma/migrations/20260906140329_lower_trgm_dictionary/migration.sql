-- NOTE: prisma migrate diff wanted to also DROP INDEX concept_display_trgm_idx,
-- concept_synonyms_idx and dictionary_entry_synonyms_idx here (same drift as every other
-- hand-added-index migration in this repo) — deliberately not dropping those; strip those
-- lines again if this migration is ever regenerated with `prisma migrate diff`.
--
-- What this migration actually does: pg_trgm's `%`/similarity() compare trigrams byte-for-byte,
-- so a lowercase OCR/search query ("yograj guggul") against an ALL-CAPS canonical_name
-- ("YOGARAJA GUGGULU") shares almost no trigrams and would score near zero. app/dictionary/
-- search.py compares lower(canonical_name) against lower($1) to fix this; the index has to be
-- on the same expression to actually get used instead of falling back to a seq scan.
DROP INDEX "dictionary_entry_canonical_name_trgm_idx";

CREATE INDEX "dictionary_entry_canonical_name_lower_trgm_idx" ON "dictionary_entry" USING gin (lower("canonical_name") gin_trgm_ops);
