import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // The project has no ESLint setup; TypeScript errors still fail the build.
  eslint: { ignoreDuringBuilds: true },
}

export default nextConfig
