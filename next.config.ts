import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Node-API packages used by the data layer must stay unbundled
  serverExternalPackages: ['pg'],
}

export default nextConfig
