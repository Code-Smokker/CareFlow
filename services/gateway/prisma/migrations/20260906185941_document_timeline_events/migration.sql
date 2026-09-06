-- DropIndex
DROP INDEX "concept_synonyms_idx";

-- DropIndex
DROP INDEX "dictionary_entry_synonyms_idx";

-- AlterTable
ALTER TABLE "document" ADD COLUMN     "timeline_events" JSONB;
