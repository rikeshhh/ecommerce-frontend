import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "c6hcsoourpmi8p32.public.blob.vercel-storage.com",
        pathname: "/**",
      },
    ],
  },
};
export default nextConfig;
