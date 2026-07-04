import 'dotenv/config'
import { Pool } from 'pg'

// Single Supabase Postgres connection pool, shared by auth and the app data layer.
// DATABASE_URL is the Supabase connection string:
// Project Settings -> Database -> Connection string -> "Session pooler".
const connectionString = process.env.DATABASE_URL

// `next build` imports this module while collecting page data but never runs a
// query (all DB routes are dynamic), so only enforce the env var at runtime.
const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build'

if (!connectionString && !isBuildPhase) {
  throw new Error(
    'DATABASE_URL is not set. Add your Supabase connection string to .env (see .env.example).',
  )
}

export const pool = new Pool({ connectionString })
