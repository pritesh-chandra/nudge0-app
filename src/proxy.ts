import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Serves fan-facing event pages from subdomains: <slug>.<root> -> /[slug].
// The apex (root), www, app, and api subdomains keep serving marketing +
// dashboard + API. When NEXT_PUBLIC_ROOT_DOMAIN is unset, everything is
// path-based and this is a no-op.
const ROOT = process.env.NEXT_PUBLIC_ROOT_DOMAIN
const NON_TENANT = new Set(['www', 'app', 'api'])

export function proxy(request: NextRequest) {
  if (!ROOT) return NextResponse.next()

  const host = (request.headers.get('host') ?? '').split(':')[0].toLowerCase()

  // Apex / www serve the normal app
  if (host === ROOT || host === `www.${ROOT}`) return NextResponse.next()

  // <slug>.<root> -> rewrite to the /[slug] route, preserving query (?ref=...)
  if (host.endsWith(`.${ROOT}`)) {
    const sub = host.slice(0, host.length - ROOT.length - 1)
    if (sub && !NON_TENANT.has(sub) && !sub.includes('.')) {
      const url = request.nextUrl.clone()
      url.pathname = `/${sub}`
      return NextResponse.rewrite(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon|.*\\..*).*)'],
}
