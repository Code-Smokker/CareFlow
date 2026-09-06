-- AlterEnum
ALTER TYPE "AnswerInputMode" ADD VALUE 'ocr';

-- NOTE: prisma migrate diff wanted to also DROP INDEX concept_display_trgm_idx and
-- concept_synonyms_idx here. Those are the hand-written GIN(gin_trgm_ops)/GIN indexes added in
-- the init migration that Prisma's schema DSL can't express (see that migration's comment) —
-- Prisma sees them as drift because they're not in schema.prisma. Deliberately not dropping
-- them; if you regenerate this migration with `prisma migrate diff`, strip those two lines
-- again rather than applying them.
