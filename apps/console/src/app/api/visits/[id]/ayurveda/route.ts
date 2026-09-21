import { NextResponse } from "next/server";
import { createGatewayClient } from "@careflow/api-client";

/** Browser → console → gateway, same pattern as /api/visits/[id]/sign: the browser never talks
 * to the gateway directly, and the request shape is the generated PUT /v1/visits/{id}/ayurveda. */
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = (await req.json()) as { recorded_by: string; fields: { field_id: string; value: unknown }[] };
  const gateway = createGatewayClient();
  const { data, error, response } = await gateway.PUT("/v1/visits/{id}/ayurveda", {
    params: { path: { id } },
    body,
  });
  if (error) return NextResponse.json(error, { status: response.status });
  return NextResponse.json(data);
}
