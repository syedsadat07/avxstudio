import { createClient } from '@supabase/supabase-js'

// ─── Browser-side Supabase client (for authentication) ──────────────────────
// This client is used in the browser for Supabase Auth (email login/signup).
// It persists the session in localStorage and handles auth state changes.
//
// Env vars MUST use NEXT_PUBLIC_ prefix to be available client-side.
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://pkeedywjhdiyrviwuiyg.supabase.co'

const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'sb_publishable_10RZORFavaDu8voYLToKiw_9tVxMaiB'

export const supabaseBrowser = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})
