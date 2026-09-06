-- Also created by infra/postgres/init.sql on first container boot, but Prisma's shadow
-- database (spun up fresh for `migrate dev`'s diff check) never runs that script — these need
-- to be idempotent and present here too, or the shadow DB fails on the vector column/gin index
-- below with "type vector does not exist".
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "vector";

-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('male', 'female', 'other', 'unknown');

-- CreateEnum
CREATE TYPE "VisitStatus" AS ENUM ('waiting', 'in_intake', 'ready', 'consulting', 'closed');

-- CreateEnum
CREATE TYPE "VisitPriority" AS ENUM ('routine', 'priority', 'urgent');

-- CreateEnum
CREATE TYPE "IntakeMode" AS ENUM ('kiosk', 'phone', 'assisted', 'proxy');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('created', 'in_progress', 'completed', 'withdrawn');

-- CreateEnum
CREATE TYPE "AnswerInputMode" AS ENUM ('voice', 'tap', 'bodymap', 'facescale', 'proxy');

-- CreateEnum
CREATE TYPE "AnswerSource" AS ENUM ('voice', 'tap', 'bodymap', 'proxy', 'ocr');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('prescription', 'lab', 'discharge', 'imaging', 'unknown');

-- CreateEnum
CREATE TYPE "OcrStatus" AS ENUM ('queued', 'processing', 'done', 'failed');

-- CreateEnum
CREATE TYPE "ExtractionEntityType" AS ENUM ('condition', 'medication', 'observation', 'procedure');

-- CreateEnum
CREATE TYPE "SummaryStatus" AS ENUM ('draft', 'signed');

-- CreateEnum
CREATE TYPE "ConceptEquivalence" AS ENUM ('equivalent', 'wider', 'narrower', 'related');

-- CreateTable
CREATE TABLE "patient" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "abha_number" TEXT,
    "abha_address" TEXT,
    "name" TEXT,
    "dob" DATE,
    "sex" "Sex",
    "phone" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visit" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "patient_id" UUID NOT NULL,
    "department" TEXT,
    "token_no" TEXT,
    "priority" "VisitPriority" NOT NULL DEFAULT 'routine',
    "status" "VisitStatus" NOT NULL DEFAULT 'waiting',
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closed_at" TIMESTAMP(3),

    CONSTRAINT "visit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "intake_session" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "visit_id" UUID NOT NULL,
    "mode" "IntakeMode" NOT NULL DEFAULT 'kiosk',
    "language" TEXT,
    "device_id" TEXT,
    "resume_token_hash" TEXT NOT NULL,
    "status" "SessionStatus" NOT NULL DEFAULT 'created',
    "state" JSONB NOT NULL DEFAULT '{}',
    "progress" JSONB,
    "resumed_count" INTEGER NOT NULL DEFAULT 0,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "intake_session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "answer" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "session_id" UUID NOT NULL,
    "slot_id" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "input_mode" "AnswerInputMode" NOT NULL,
    "source" "AnswerSource" NOT NULL,
    "confidence" DOUBLE PRECISION,
    "audio_uri" TEXT,
    "audio_offset_ms" INTEGER,
    "started_at" TIMESTAMP(3),
    "answered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idempotency_key" TEXT,

    CONSTRAINT "answer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "session_id" UUID NOT NULL,
    "type" "DocumentType" NOT NULL,
    "storage_uri" TEXT NOT NULL,
    "page_count" INTEGER,
    "quality_score" DOUBLE PRECISION,
    "ocr_status" "OcrStatus" NOT NULL DEFAULT 'queued',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "extraction" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "document_id" UUID NOT NULL,
    "entity_type" "ExtractionEntityType" NOT NULL,
    "payload" JSONB NOT NULL,
    "bbox" JSONB,
    "page" INTEGER,
    "confidence" DOUBLE PRECISION,
    "confirmed_by" TEXT,
    "confirmed_at" TIMESTAMP(3),

    CONSTRAINT "extraction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "red_flag" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "session_id" UUID NOT NULL,
    "rule_id" TEXT NOT NULL,
    "severity" INTEGER NOT NULL,
    "quote" TEXT,
    "payload" JSONB,
    "fired_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acknowledged_by" TEXT,
    "acknowledged_at" TIMESTAMP(3),

    CONSTRAINT "red_flag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "summary" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "visit_id" UUID NOT NULL,
    "structured" JSONB NOT NULL,
    "rendered_en" TEXT,
    "rendered_local" TEXT,
    "fhir_bundle" JSONB,
    "status" "SummaryStatus" NOT NULL DEFAULT 'draft',
    "signed_by" TEXT,
    "signed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "summary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consent" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "patient_id" UUID NOT NULL,
    "session_id" UUID NOT NULL,
    "scopes" TEXT[],
    "audio_uri" TEXT,
    "granted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revoked_at" TIMESTAMP(3),

    CONSTRAINT "consent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_log" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "actor_id" TEXT,
    "actor_role" TEXT,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "resource_id" TEXT,
    "reason" TEXT,
    "at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "concept" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "system" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "display" TEXT NOT NULL,
    "synonyms" TEXT[],
    "embedding" vector,

    CONSTRAINT "concept_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "concept_map" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "source_concept" UUID NOT NULL,
    "target_concept" UUID NOT NULL,
    "equivalence" "ConceptEquivalence" NOT NULL,
    "reviewed_by" TEXT,

    CONSTRAINT "concept_map_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "visit_department_priority_token_no_idx" ON "visit"("department", "priority" DESC, "token_no");

-- CreateIndex
CREATE INDEX "answer_session_id_slot_id_idx" ON "answer"("session_id", "slot_id");

-- CreateIndex
CREATE UNIQUE INDEX "answer_session_id_idempotency_key_key" ON "answer"("session_id", "idempotency_key");

-- CreateIndex
CREATE UNIQUE INDEX "red_flag_session_id_rule_id_key" ON "red_flag"("session_id", "rule_id");

-- CreateIndex
CREATE UNIQUE INDEX "concept_system_code_key" ON "concept"("system", "code");

-- AddForeignKey
ALTER TABLE "visit" ADD CONSTRAINT "visit_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "intake_session" ADD CONSTRAINT "intake_session_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "visit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answer" ADD CONSTRAINT "answer_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "intake_session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document" ADD CONSTRAINT "document_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "intake_session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "extraction" ADD CONSTRAINT "extraction_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "red_flag" ADD CONSTRAINT "red_flag_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "intake_session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "summary" ADD CONSTRAINT "summary_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "visit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consent" ADD CONSTRAINT "consent_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consent" ADD CONSTRAINT "consent_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "intake_session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "concept_map" ADD CONSTRAINT "concept_map_source_concept_fkey" FOREIGN KEY ("source_concept") REFERENCES "concept"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "concept_map" ADD CONSTRAINT "concept_map_target_concept_fkey" FOREIGN KEY ("target_concept") REFERENCES "concept"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Indexes Prisma's schema DSL cannot express (partial index, GIN with an operator class) —
-- docs/04-data-model.md "Indexes worth having from the start".

-- Partial: only unacknowledged red flags need to be scanned fast (the nurse/triage board query).
CREATE INDEX "red_flag_unacknowledged_idx" ON "red_flag" ("session_id") WHERE "acknowledged_at" IS NULL;

-- Trigram search over concept.display so "amavata" / "āmavāta" / "aam vaat" resolve to one
-- concept (docs/07-ayush-terminology.md). No ivfflat index on concept.embedding yet, on
-- purpose: docs/04-data-model.md says add it only once there is real data in the table.
CREATE INDEX "concept_display_trgm_idx" ON "concept" USING gin ("display" gin_trgm_ops);
CREATE INDEX "concept_synonyms_idx" ON "concept" USING gin ("synonyms");

-- audit_log is APPEND ONLY — enforced here, not just by convention (docs/04-data-model.md,
-- CLAUDE.md). No application code path ever needs to UPDATE or DELETE a row; this trigger is
-- what makes that a guarantee instead of a hope.
CREATE FUNCTION audit_log_append_only() RETURNS trigger AS $$
BEGIN
  RAISE EXCEPTION 'audit_log is append-only: % is not permitted', TG_OP;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_log_no_update
  BEFORE UPDATE ON "audit_log"
  FOR EACH ROW EXECUTE FUNCTION audit_log_append_only();

CREATE TRIGGER audit_log_no_delete
  BEFORE DELETE ON "audit_log"
  FOR EACH ROW EXECUTE FUNCTION audit_log_append_only();
