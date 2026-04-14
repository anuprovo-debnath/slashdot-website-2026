/** @type {import('next').NextConfig} */
const nextConfig = {
  // In Next.js 16+, this is usually a top-level property
  allowedDevOrigins: ['10.20.94.57'], 
  
  /* If the above doesn't work, some minor versions still use:
  experimental: {
    allowedDevOrigins: ['10.20.94.57'],
  }, 
  */
};

export default nextConfig;