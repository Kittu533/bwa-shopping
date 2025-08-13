import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "riopytllzxlcljwcdkxg.supabase.co",

      },
    ],
    // Atau, alternatif sederhana:
    // domains: ["riopytllzxlcljwcdkxg.supabase.co"],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;
