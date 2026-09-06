import { randomUUID } from "node:crypto";
import { Injectable } from "@nestjs/common";
import type { Summary } from "@prisma/client";
import type { SummaryLeaf, SummariseStructured } from "../ai/ai-service.client";
import { AppException } from "../common/app-exception";
import { PrismaService } from "../prisma/prisma.service";

interface SummaryFieldPayload {
  field_path: string;
  value: unknown;
  source: string;
  confidence: number;
  audio_offset_ms: number | null;
  bounding_box: null;
  physician_edited: boolean;
  low_confidence: boolean;
}

@Injectable()
export class VisitsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary(visitId: string) {
    const summary = await this.findLatestSummaryOrThrow(visitId);
    return this.toVisitSummaryPayload(visitId, summary);
  }

  async editSummaryField(visitId: string, fieldPath: string, value: unknown) {
    const summary = await this.findLatestSummaryOrThrow(visitId);
    const structured = summary.structured as unknown as SummariseStructured;

    const found = setLeafAtPath(structured, fieldPath, (leaf) => {
      leaf.value = value;
      leaf.confidence = 1;
      leaf.physician_edited = true;
      leaf.low_confidence = false; // physician-confirmed — no longer a value to demote
    });
    if (!found) {
      throw new AppException(404, "field_not_found", `No summary field at path '${fieldPath}'.`, { field_path: fieldPath });
    }

    const updated = await this.prisma.summary.update({
      where: { id: summary.id },
      data: { structured: structured as never },
    });
    return this.toVisitSummaryPayload(visitId, updated);
  }

  async sign(visitId: string, signedBy: string) {
    const summary = await this.findLatestSummaryOrThrow(visitId);
    await this.prisma.summary.update({
      where: { id: summary.id },
      data: { status: "signed", signedBy, signedAt: new Date() },
    });
    return {
      // Not a real assembled FHIR bundle — fhir-bridge doesn't exist yet (Day 4). A stable
      // opaque id now is what lets the *shape* of this response be right today; docs/06 and
      // ADR 0006 already establish the mock-first, say-so-honestly pattern this follows.
      fhir_bundle_id: randomUUID(),
      abdm_status: "mocked" as const,
    };
  }

  // ---------------------------------------------------------------------------------------

  private async findLatestSummaryOrThrow(visitId: string): Promise<Summary> {
    const summary = await this.prisma.summary.findFirst({
      where: { visitId },
      orderBy: { createdAt: "desc" },
    });
    if (!summary) {
      throw new AppException(404, "summary_not_found", `No summary for visit '${visitId}'. Has intake been completed?`);
    }
    return summary;
  }

  private async toVisitSummaryPayload(visitId: string, summary: Summary) {
    const session = await this.prisma.intakeSession.findFirst({
      where: { visitId },
      orderBy: { createdAt: "desc" },
      select: { id: true },
    });
    return {
      visit_id: visitId,
      session_id: session?.id ?? null,
      fields: flattenStructured(summary.structured as unknown as SummariseStructured),
      signed: summary.status === "signed",
    };
  }
}

function flattenStructured(structured: SummariseStructured): SummaryFieldPayload[] {
  const fields: SummaryFieldPayload[] = [];
  const push = (fieldPath: string, leaf: SummaryLeaf) => {
    fields.push({
      field_path: fieldPath,
      value: leaf.value,
      source: leaf.source,
      confidence: leaf.confidence,
      audio_offset_ms: /^\d+$/.test(leaf.ref) ? Number(leaf.ref) : null,
      bounding_box: null,
      physician_edited: leaf.physician_edited ?? false,
      low_confidence: leaf.low_confidence,
    });
  };

  if (structured.chief_complaint) push("chief_complaint", structured.chief_complaint);
  for (const [slotId, leaf] of Object.entries(structured.history_of_present_illness ?? {})) {
    push(`history_of_present_illness.${slotId}`, leaf);
  }
  (structured.prior_investigations ?? []).forEach((leaf, i) => push(`prior_investigations.${i}`, leaf));

  return fields;
}

/** Navigates a dot-separated path (object keys and array indices alike — `arr["0"]` works the
 * same as `arr[0]` in JS) to the second-to-last segment, then mutates the leaf found at the
 * last one in place. Returns false if any segment along the way doesn't resolve. */
function setLeafAtPath(root: unknown, fieldPath: string, mutate: (leaf: SummaryLeaf) => void): boolean {
  const parts = fieldPath.split(".");
  let node: Record<string, unknown> | undefined = root as Record<string, unknown>;
  for (let i = 0; i < parts.length - 1; i++) {
    node = node?.[parts[i]] as Record<string, unknown> | undefined;
    if (node == null) return false;
  }
  const last = parts[parts.length - 1];
  const leaf = node?.[last];
  if (leaf == null || typeof leaf !== "object") return false;
  mutate(leaf as SummaryLeaf);
  return true;
}
