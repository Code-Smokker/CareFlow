import type { NextConfig } from "next";

// Server-side only (never NEXT_PUBLIC_): where the gateway lives from THIS server's point of view.
const GATEWAY_URL = process.env.GATEWAY_URL ?? "http://localhost:4000";

const nextConfig: NextConfig = {
  // `make tunnel` serves this app on *.trycloudflare.com; without this Next's dev server refuses the tunnel origin's
  // dev-resource requests.
  allowedDevOrigins: ["*.trycloudflare.com"],
  transpilePackages: ["@careflow/ui", "@careflow/api-client", "@careflow/contracts"],
  async rewrites() {
    return [
      // The phone needs exactly one origin. `/api/fill-slot` (a real route handler in this app) is matched by
      // the filesystem first; only the gateway's versioned paths are proxied.
      { source: "/api/v1/:path*", destination: `${GATEWAY_URL}/v1/:path*` },
    ];
  },
};

export default nextConfig;
