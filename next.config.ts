import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Don't advertise the framework.
  poweredByHeader: false,
  // gzip/brotli responses (also handled by the host, harmless to keep on).
  compress: true,
  // Modern, smaller image formats when images are added later.
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
