import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // Allow trailing slash for Capacitor static hosting
  trailingSlash: true,
};

export default nextConfig;
