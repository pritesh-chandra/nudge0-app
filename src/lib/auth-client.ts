import { createAuthClient } from 'better-auth/react'
import { emailOTPClient } from 'better-auth/client/plugins'

// Same-origin: /api/auth is served by the Next.js route handler.
export const authClient = createAuthClient({
  plugins: [emailOTPClient()],
})

export const { signIn, signUp, signOut, useSession } = authClient
