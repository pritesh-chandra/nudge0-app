import 'dotenv/config'
import { betterAuth } from 'better-auth'
import { Pool } from 'pg'
import Database from 'better-sqlite3'

// Supabase Postgres in production (set DATABASE_URL), local SQLite for dev
const database = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : new Database('./dev.db')

export const auth = betterAuth({
  database,
  baseURL: process.env.BETTER_AUTH_URL ?? 'http://localhost:4650',
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  session: {
    // Refresh-token equivalent: DB-backed session token, 30-day life,
    // silently renewed (sliding window) once per day of activity.
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
    // Access-token equivalent: short-lived signed cookie so most requests
    // skip the DB; re-validated against the session token every 5 minutes.
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },
  trustedOrigins: ['http://localhost:4650'],
})

export type Session = typeof auth.$Infer.Session
