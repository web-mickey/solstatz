import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.bullx.io",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/mev/summary",
        permanent: true, // Set to false if this is temporary
      },
    ];
  },
};

export default nextConfig;
