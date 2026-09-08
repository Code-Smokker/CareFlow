import { NextResponse } from "next/server";
import { createGatewayClient } from "@careflow/api-client";

export async function GET() {
  const gateway = createGatewayClient();
  const { data, error, response } = await gateway.GET("/v1/visits/queue");

  if (error) {
    return NextResponse.json(error, { status: response.status });
  }
  return NextResponse.json(data);
}
