import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Prefer /card/ → card/index.html for static hosts (Gitee/GitHub Pages).
  trailingSlash: true,
  images: {
    // Required for `output: "export"` (no Image Optimization server).
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },
  reactStrictMode: true,
};

export default nextConfig;
