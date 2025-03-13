import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ecommerce-backend-ouo6.onrender.com",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
