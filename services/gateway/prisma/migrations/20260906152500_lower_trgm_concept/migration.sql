-- Same fix as 20260906140329_lower_trgm_dictionary, applied to concept: pg_trgm's `%`/
-- similarity() compare trigrams byte-for-byte, so a lowercase search query ("amavata") against
-- a Title-Cased display ("Amavata") shares fewer trigrams than the same-case comparison would
-- and can score lower than a genuinely worse match. services/terminology's search compares
-- lower(display) against lower($1); the index has to be on the same expression to actually get
-- used instead of falling back to a seq scan.
--
-- NOTE: `prisma migrate diff` will want to re-add concept_display_trgm_idx (the non-lower
-- version this drops) if this migration is ever regenerated — don't let it.
DROP INDEX "concept_display_trgm_idx";

CREATE INDEX "concept_display_lower_trgm_idx" ON "concept" USING gin (lower("display") gin_trgm_ops);
