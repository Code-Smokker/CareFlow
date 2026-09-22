-- CreateEnum
CREATE TYPE "PrescriptionStatus" AS ENUM ('draft', 'saved', 'completed');

-- CreateTable
CREATE TABLE "vitals" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "visit_id" UUID NOT NULL,
    "bp" TEXT,
    "pulse_bpm" INTEGER,
    "temperature_c" DOUBLE PRECISION,
    "respiratory_rate" INTEGER,
    "spo2" INTEGER,
    "height_cm" DOUBLE PRECISION,
    "weight_kg" DOUBLE PRECISION,
    "pain_score" INTEGER,
    "pain_location" TEXT,
    "mobility" TEXT,
    "recorded_by" TEXT,
    "recorded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vitals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prescription" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "visit_id" UUID NOT NULL,
    "status" "PrescriptionStatus" NOT NULL DEFAULT 'draft',
    "chief_complaints" TEXT,
    "complaint_duration_days" INTEGER,
    "gpe_findings" TEXT,
    "chikitsa_notes" TEXT,
    "pathya" TEXT,
    "apathya" TEXT,
    "procedures" JSONB,
    "sent_to_lab" BOOLEAN NOT NULL DEFAULT false,
    "follow_up_date" TIMESTAMP(3),
    "follow_up_interval_days" INTEGER,
    "follow_up_instructions" TEXT,
    "recorded_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prescription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prescription_item" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "prescription_id" UUID NOT NULL,
    "dictionary_entry_id" UUID,
    "formulation_name" TEXT NOT NULL,
    "dosage_form" TEXT,
    "strength" TEXT,
    "dose" TEXT,
    "frequency" TEXT,
    "timing" TEXT,
    "duration" TEXT,
    "route" TEXT,
    "anupana" TEXT,
    "instructions" TEXT,
    "quantity" TEXT,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "prescription_item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "vitals_visit_id_key" ON "vitals"("visit_id");

-- CreateIndex
CREATE UNIQUE INDEX "prescription_visit_id_key" ON "prescription"("visit_id");

-- CreateIndex
CREATE INDEX "prescription_item_prescription_id_sort_order_idx" ON "prescription_item"("prescription_id", "sort_order");

-- AddForeignKey
ALTER TABLE "vitals" ADD CONSTRAINT "vitals_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "visit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescription" ADD CONSTRAINT "prescription_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "visit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescription_item" ADD CONSTRAINT "prescription_item_prescription_id_fkey" FOREIGN KEY ("prescription_id") REFERENCES "prescription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Row-level security: every table in `public` must have RLS enabled with no policies, so the
-- Supabase anon/authenticated roles (whose key ships to browsers) can read nothing — the gateway
-- reaches Postgres as the table owner, bypassing RLS (see 20260922000000_lock_down_data_api).
-- New tables don't inherit that migration's blanket lockdown, so each one needs this here.
ALTER TABLE "vitals" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "prescription" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "prescription_item" ENABLE ROW LEVEL SECURITY;
