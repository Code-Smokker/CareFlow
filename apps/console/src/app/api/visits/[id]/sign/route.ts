import { NextResponse } from "next/server";
import { createGatewayClient } from "@careflow/api-client";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = (await req.json()) as { signed_by: string };
  const gateway = createGatewayClient();
  const { data, error, response } = await gateway.POST("/v1/visits/{id}/sign", {
    params: { path: { id } },
    body,
  });

  if (error) {
    return NextResponse.json(error, { status: response.status });
  }
  return NextResponse.json(data);
}
