import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// ─── Supabase Auth Callback ─────────────────────────────────────────────────
// This route handles the email confirmation redirect from Supabase.
// When a user clicks the confirmation link in their email, Supabase redirects
// them here with the auth code in the URL. We exchange it for a session
// and redirect to the homepage.

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://pkeedywjhdiyrviwuiyg.supabase.co'

const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'sb_publishable_10RZORFavaDu8voYLToKiw_9tVxMaiB'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')

  // Handle error from Supabase
  if (error) {
    return NextResponse.redirect(
      `${requestUrl.origin}/?auth_error=${encodeURIComponent(errorDescription || error)}`
    )
  }

  if (code) {
    try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: { persistSession: false },
      })
      await supabase.auth.exchangeCodeForSession(code)
    } catch {
      // Even if exchange fails on server, the client will detect the session
    }
  }

  // Redirect to homepage — the client-side Supabase will pick up the session
  return NextResponse.redirect(requestUrl.origin)
}
