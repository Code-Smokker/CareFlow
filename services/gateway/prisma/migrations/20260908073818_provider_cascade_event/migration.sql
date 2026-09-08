-- CreateEnum
CREATE TYPE "CascadeOutcome" AS ENUM ('success', 'failure');

-- CreateTable
CREATE TABLE "provider_cascade_event" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "service" TEXT NOT NULL,
    "capability" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "outcome" "CascadeOutcome" NOT NULL,
    "latency_ms" INTEGER NOT NULL,
    "error" TEXT,
    "at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "provider_cascade_event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "provider_cascade_event_at_idx" ON "provider_cascade_event"("at");
