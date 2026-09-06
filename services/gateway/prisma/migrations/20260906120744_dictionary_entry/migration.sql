-- CreateEnum
CREATE TYPE "DictionarySystem" AS ENUM ('allopathic', 'ayush_formulation', 'ayush_plant');

-- NOTE: prisma migrate diff wanted to also DROP INDEX concept_display_trgm_idx and
-- concept_synonyms_idx here (same drift as the answer_input_mode_add_ocr migration) —
-- deliberately not dropping them; strip those two lines again if this migration is ever
-- regenerated with `prisma migrate diff`.

-- CreateTable
CREATE TABLE "dictionary_entry" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "system" "DictionarySystem" NOT NULL,
    "canonical_name" TEXT NOT NULL,
    "synonyms" TEXT[],
    "metadata" JSONB,

    CONSTRAINT "dictionary_entry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "dictionary_entry_system_canonical_name_key" ON "dictionary_entry"("system", "canonical_name");

-- Trigram + array GIN indexes, same pattern as concept.display/synonyms (Prisma's schema DSL
-- can't express operator classes) — docs/06-document-ai.md stage 4's fuzzy matching.
CREATE INDEX "dictionary_entry_canonical_name_trgm_idx" ON "dictionary_entry" USING gin ("canonical_name" gin_trgm_ops);
CREATE INDEX "dictionary_entry_synonyms_idx" ON "dictionary_entry" USING gin ("synonyms");
