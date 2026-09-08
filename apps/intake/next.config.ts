import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@careflow/ui", "@careflow/api-client", "@careflow/contracts"],
};

export default nextConfig;
