import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // @ts-expect-error Next.js local extension not yet reflected in current NextConfig typings.
  allowedDevOrigins: ['192.168.1.5', 'localhost:3000'],
};

export default nextConfig;
