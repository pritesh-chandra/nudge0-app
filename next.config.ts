import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Native/node-API packages used by the auth layer must stay unbundled
  serverExternalPackages: ['better-sqlite3', 'pg'],
}

export default nextConfig
