import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: ["*.use.devtunnels.ms", "*.shares.zrok.io"],
};

export default nextConfig;
