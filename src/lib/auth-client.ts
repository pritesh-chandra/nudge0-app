import { createAuthClient } from 'better-auth/react'

// Same-origin: /api/auth is proxied to the auth server by Vite (dev)
// or your host's rewrite rules (production).
export const authClient = createAuthClient()

export const { signIn, signUp, signOut, useSession } = authClient
