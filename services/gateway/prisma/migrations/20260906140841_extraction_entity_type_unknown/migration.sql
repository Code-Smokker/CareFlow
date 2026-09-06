-- NOTE: prisma migrate diff wanted to also DROP INDEX concept_display_trgm_idx,
-- concept_synonyms_idx and dictionary_entry_synonyms_idx here (same recurring drift as every
-- other hand-added-index migration in this repo) — deliberately not dropping those; strip
-- those lines again if this migration is ever regenerated with `prisma migrate diff`.
ALTER TYPE "ExtractionEntityType" ADD VALUE 'unknown';
