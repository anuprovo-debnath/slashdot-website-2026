import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: '/slashdot-website-2026',
  assetPrefix: '/slashdot-website-2026/',
  images: {
    unoptimized: true,
  },
  // Dev origin for specific local network access
  allowedDevOrigins: ['10.20.94.57'],
};

export default nextConfig;
