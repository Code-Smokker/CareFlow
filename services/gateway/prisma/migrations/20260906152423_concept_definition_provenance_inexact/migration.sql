-- NOTE: `prisma migrate diff` wanted to also DROP INDEX concept_display_trgm_idx,
-- concept_synonyms_idx and dictionary_entry_synonyms_idx here (same drift as every other
-- hand-added-index migration in this repo, e.g. 20260906140329_lower_trgm_dictionary's own
-- note) — deliberately not dropping those; strip those lines again if this migration is ever
-- regenerated with `prisma migrate diff`.

-- AlterEnum
-- Postgres requires ADD VALUE to run outside the transaction that later uses the value, but
-- this migration file only adds it — nothing here reads it — so a single-transaction migration
-- is safe.
ALTER TYPE "ConceptEquivalence" ADD VALUE 'inexact';

-- AlterTable
ALTER TABLE "concept" ADD COLUMN     "definition" TEXT;

-- AlterTable
ALTER TABLE "concept_map" ADD COLUMN     "provenance" TEXT NOT NULL DEFAULT 'lexical';
