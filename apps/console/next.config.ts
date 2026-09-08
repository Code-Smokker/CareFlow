import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@careflow/ui", "@careflow/api-client", "@careflow/contracts"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
