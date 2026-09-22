import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// ─── Browser-side Supabase client (for authentication) ──────────────────────
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://pkeedywjhdiyrviwuiyg.supabase.co'

const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'sb_publishable_10RZORFavaDu8voYLToKiw_9tVxMaiB'

// Create client with error handling
let supabaseBrowser: SupabaseClient

try {
  supabaseBrowser = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })
} catch (e) {
  console.error('Failed to create Supabase client:', e)
  // Create a dummy client that won't crash the app
  supabaseBrowser = {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      signInWithPassword: async () => ({ data: { user: null, session: null }, error: { message: 'Auth not available' } }),
      signUp: async () => ({ data: { user: null, session: null }, error: { message: 'Auth not available' } }),
      signInWithOAuth: async () => ({ data: null, error: { message: 'Auth not available' } }),
      signOut: async () => ({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    from: () => ({
      select: async () => ({ data: [], error: null }),
      insert: async () => ({ data: null, error: null }),
    }),
  } as unknown as SupabaseClient
}

export { supabaseBrowser }
