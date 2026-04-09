import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: '/slashdot-website-2026',
  assetPrefix: '/slashdot-website-2026/',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
