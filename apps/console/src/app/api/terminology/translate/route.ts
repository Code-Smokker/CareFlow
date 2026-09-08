import { NextResponse } from "next/server";
import { createTerminologyClient } from "@careflow/api-client";

export async function POST(req: Request) {
  const body = (await req.json()) as {
    system: "namaste" | "icd11-tm2" | "icd11-bio";
    code: string;
    target: "namaste" | "icd11-tm2" | "icd11-bio";
  };

  const terminology = createTerminologyClient();
  const { data, error, response } = await terminology.POST("/translate", { body });

  if (error) {
    return NextResponse.json(error, { status: response.status });
  }
  return NextResponse.json(data);
}
