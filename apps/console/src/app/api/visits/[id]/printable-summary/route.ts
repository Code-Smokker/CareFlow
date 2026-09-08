import { createGatewayClient } from "@careflow/api-client";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const baseUrl = process.env.GATEWAY_URL ?? "http://localhost:4000";
  const res = await fetch(`${baseUrl}/v1/visits/${encodeURIComponent(id)}/printable-summary`);
  const html = await res.text();
  return new Response(html, {
    status: res.status,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
