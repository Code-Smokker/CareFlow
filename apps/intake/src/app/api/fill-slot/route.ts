/** Relays to services/ai's POST /fill-slot — same non-CORS-enabled service as /transcribe, same
 * reason this goes through this app's own server rather than the browser calling ai:8001
 * directly. */
export async function POST(req: Request) {
  const body = await req.json();
  const aiServiceUrl = process.env.AI_SERVICE_URL ?? "http://localhost:8001";
  const res = await fetch(`${aiServiceUrl}/fill-slot`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const result = await res.json();
  return Response.json(result, { status: res.status });
}
