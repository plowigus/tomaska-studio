import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "http",
        hostname: "tomaskastudio.pl",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;