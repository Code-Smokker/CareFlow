-- CreateEnum
CREATE TYPE "ExamSource" AS ENUM ('clinician');

-- CreateEnum
CREATE TYPE "ExamDisposition" AS ENUM ('entered', 'confirmed', 'overridden');

-- CreateTable
CREATE TABLE "ayurveda_exam_field" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "visit_id" UUID NOT NULL,
    "field_id" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "source" "ExamSource" NOT NULL DEFAULT 'clinician',
    "disposition" "ExamDisposition" NOT NULL,
    "recorded_by" TEXT NOT NULL,
    "recorded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "original_slot_id" TEXT,
    "original_value" JSONB,
    "original_source" "AnswerSource",
    "original_confidence" DOUBLE PRECISION,

    CONSTRAINT "ayurveda_exam_field_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ayurveda_exam_field_visit_id_field_id_key" ON "ayurveda_exam_field"("visit_id", "field_id");

-- AddForeignKey
ALTER TABLE "ayurveda_exam_field" ADD CONSTRAINT "ayurveda_exam_field_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "visit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
