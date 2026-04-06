import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  // Note: if you are deploying to a domain like https://username.github.io/slashdot-website-2026/
  // you may need to uncomment and set the basePath below:
  // basePath: '/slashdot-website-2026',
};

export default nextConfig;
