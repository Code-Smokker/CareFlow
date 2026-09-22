#!/usr/bin/env node
// Serves the patient app (userwebapp/) and gives a phone exactly ONE origin:
//   /api/v1/*       → the gateway            (so the page never makes a cross-origin call)
//   /api/fill-slot  → the ai service         (fits a spoken transcript into the slot being asked)
//   /s/<id>?token=  → the screen the token-slip QR opens
// One origin is what lets `make tunnel` put the whole patient app behind a single HTTPS URL —
// a microphone only works on HTTPS or localhost. No dependencies; nothing here reads or logs a request body.
import { createServer, request as httpRequest } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { dirname, extname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../userwebapp");
const PORT = Number(process.env.PATIENT_PORT ?? 3030);
const GATEWAY = new URL(process.env.GATEWAY_URL ?? "http://localhost:4000");
const AI = new URL(process.env.AI_SERVICE_URL ?? "http://localhost:8001");
const ENTRY = "/careflow_qr_welcome_landing/code.html";

const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg",
  ".svg": "image/svg+xml", ".woff2": "font/woff2", ".ico": "image/x-icon", ".webmanifest": "application/manifest+json",
};

function proxy(req, res, target, path) {
  const upstream = httpRequest(
    { host: target.hostname, port: target.port, method: req.method, path, headers: { ...req.headers, host: target.host } },
    (up) => {
      res.writeHead(up.statusCode ?? 502, up.headers);
      up.pipe(res);
    },
  );
  upstream.on("error", () => {
    res.writeHead(502, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: { code: "upstream_unavailable", message: "The service is not answering. Please ask a nurse for help." } }));
  });
  req.pipe(upstream);
}

createServer((req, res) => {
  const url = new URL(req.url ?? "/", "http://x");
  const path = url.pathname;

  if (path === "/health") return void res.end("ok");
  if (path.startsWith("/api/v1/")) return proxy(req, res, GATEWAY, path.slice(4) + url.search);
  if (path === "/api/fill-slot") return proxy(req, res, AI, "/fill-slot");

  const slip = path.match(/^\/s\/([0-9a-f-]{36})\/?$/i);
  if (slip) {
    res.writeHead(302, { Location: `${ENTRY}?s=${slip[1]}&token=${encodeURIComponent(url.searchParams.get("token") ?? "")}` });
    return void res.end();
  }

  let file = normalize(join(ROOT, decodeURIComponent(path)));
  const inside = file === ROOT || file.startsWith(ROOT + sep);
  const hidden = file.slice(ROOT.length).split(sep).some((p) => p.startsWith("."));
  if (!inside || hidden) {
    res.writeHead(403);
    return void res.end("forbidden");
  }
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, existsSync(join(file, "code.html")) ? "code.html" : "index.html");
  if (!existsSync(file)) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    return void res.end("not found");
  }
  // The 4 MB icon font and the screen images never change under a running session; code does, so it is never cached.
  const heavy = [".woff2", ".png", ".jpg", ".svg"].includes(extname(file));
  res.writeHead(200, { "Content-Type": TYPES[extname(file)] ?? "application/octet-stream", "Cache-Control": heavy ? "public, max-age=86400" : "no-store" });
  createReadStream(file).pipe(res);
}).listen(PORT, () => console.log(`patient app  http://localhost:${PORT}   (gateway ${GATEWAY.origin}, ai ${AI.origin})`));
