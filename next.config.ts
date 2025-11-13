import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Performance optimizations
  experimental: {
    optimizePackageImports: ['recharts', 'framer-motion'],
  },
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
  
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Bundle analyzer (optional - can be enabled for debugging)
  // bundlePagesRouterDependencies: true,
  
  // Reduce bundle size - removed problematic modularizeImports for lucide-react
  // The lucide-react package already has tree-shaking built-in
};

export default nextConfig;
