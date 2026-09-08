import { NextResponse } from "next/server";
import { createGatewayClient } from "@careflow/api-client";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const gateway = createGatewayClient();
  const { data, error, response } = await gateway.GET("/v1/visits/{id}/summary", {
    params: { path: { id } },
  });

  if (error) {
    return NextResponse.json(error, { status: response.status });
  }
  return NextResponse.json(data);
}
