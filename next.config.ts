import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
  reactCompiler: true,
};

if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
  console.warn("⚠️  WARNING: NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is missing. The build will likely fail.");
  console.warn("👉  Please add this variable to your GitHub repository Settings > Secrets and variables > Actions.");
}

export default nextConfig;
