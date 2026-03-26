import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Production-optimized config */
  compress: true,
  poweredByHeader: false,
  
  // Output optimization
  output: 'standalone',
  
  // Image optimization
  images: {
    unoptimized: true, // Set to false if you need Next.js image optimization
  },
};

export default nextConfig;
