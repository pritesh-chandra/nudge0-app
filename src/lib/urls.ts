// Builds public URLs for event pages as subdomains: <slug>.<root>.
//
// NEXT_PUBLIC_ROOT_DOMAIN is the apex the app runs on:
//   dev:  "localhost"   -> http://<slug>.localhost:8080
//   prod: "nudgeo.app"  -> https://<slug>.nudgeo.app
// If unset, we fall back to a path-based URL so nothing breaks.

const DEV_PORT = '8080'

export function rootDomain(): string | null {
  return process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? null
}

/** Absolute URL to a fan-facing event page. */
export function publicEventUrl(slug: string): string {
  const root = rootDomain()
  if (!root) return `/${slug}`
  if (root === 'localhost') return `http://${slug}.localhost:${DEV_PORT}`
  return `https://${slug}.${root}`
}

/** Just the host label shown in the UI, e.g. "heavy-driver.nudgeo.app". */
export function publicEventHost(slug: string): string {
  const root = rootDomain()
  if (!root) return `nudgeo.app/${slug}`
  if (root === 'localhost') return `${slug}.localhost:${DEV_PORT}`
  return `${slug}.${root}`
}

/** Absolute URL to the apex (marketing/dashboard) site. */
export function appUrl(path = '/'): string {
  const root = rootDomain()
  if (!root) return path
  if (root === 'localhost') return `http://localhost:${DEV_PORT}${path}`
  return `https://${root}${path}`
}
