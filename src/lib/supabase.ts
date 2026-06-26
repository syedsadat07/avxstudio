import { createClient } from '@supabase/supabase-js'

// ─── Supabase configuration ───────────────────────────────────────────────
// Reads from environment variables for security.
// Copy .env.example → .env and fill in your values.
//
// Project ID: pkeedywjhdiyrviwuiyg
// URL format: https://{project_id}.supabase.co
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://pkeedywjhdiyrviwuiyg.supabase.co'

const SUPABASE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'sb_publishable_10RZORFavaDu8voYLToKiw_9tVxMaiB'

// Server-side Supabase client (uses publishable/anon key).
// This client respects Row Level Security (RLS) policies.
// For booking inserts, ensure your Supabase table has an RLS policy
// that allows INSERT for the anon role (or authenticated).
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})

// Helper to check if Supabase is configured
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY)
