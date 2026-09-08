import { NextResponse } from "next/server";
import { createTerminologyClient } from "@careflow/api-client";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q");
  const system = (url.searchParams.get("system") ?? "namaste") as "namaste" | "icd11-tm2" | "icd11-bio";
  if (!q) {
    return NextResponse.json({ error: { code: "missing_query", message: "q is required" } }, { status: 400 });
  }

  const terminology = createTerminologyClient();
  const { data, error, response } = await terminology.GET("/search", {
    params: { query: { q, system } },
  });

  if (error) {
    return NextResponse.json(error, { status: response.status });
  }
  return NextResponse.json(data);
}
