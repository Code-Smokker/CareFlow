import { NextResponse } from "next/server";
import { getVisitDocuments } from "@/lib/visit-documents";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getVisitDocuments(id);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  return NextResponse.json({ documents: result.data });
}
