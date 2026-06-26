import { create } from 'zustand'
import { supabaseBrowser } from '@/lib/supabase-browser'

export interface AuthUser {
  id: string
  email: string
  name: string
  role: 'admin' | 'customer'
  phone?: string | null
  provider?: 'supabase' | 'jwt' // how the user authenticated
}

interface AuthState {
  user: AuthUser | null
  loading: boolean
  setuser: (user: AuthUser | null) => void
  setLoading: (loading: boolean) => void
  logout: () => Promise<void>
  fetchSession: () => Promise<void>
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setuser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),

  logout: async () => {
    const { user } = useAuth.getState()
    // If Supabase customer, sign out from Supabase
    if (user?.provider === 'supabase') {
      try {
        await supabaseBrowser.auth.signOut()
      } catch {
        // ignore
      }
    }
    // If JWT admin, call logout API to clear cookie
    if (user?.provider === 'jwt') {
      try {
        await fetch('/api/auth/logout', { method: 'POST' })
      } catch {
        // ignore
      }
    }
    set({ user: null })
  },

  fetchSession: async () => {
    // ─── 1. Check Supabase session (customer) ───
    try {
      const { data: { session } } = await supabaseBrowser.auth.getSession()
      if (session?.user) {
        const supaUser = session.user
        const name =
          supaUser.user_metadata?.full_name ||
          supaUser.user_metadata?.name ||
          supaUser.email?.split('@')[0] ||
          'Customer'
        set({
          user: {
            id: supaUser.id,
            email: supaUser.email || '',
            name,
            role: 'customer',
            phone: supaUser.user_metadata?.phone || null,
            provider: 'supabase',
          },
          loading: false,
        })
        // Listen for Supabase auth changes
        supabaseBrowser.auth.onAuthStateChange((_event, sbSession) => {
          if (!sbSession?.user) {
            // Only clear if current user was a Supabase user
            const current = useAuth.getState().user
            if (current?.provider === 'supabase') {
              set({ user: null })
            }
          }
        })
        return
      }
    } catch {
      // Supabase not configured or error — continue to JWT check
    }

    // ─── 2. Check JWT session (admin) ───
    try {
      const res = await fetch('/api/auth/session')
      const data = await res.json()
      if (data.user) {
        set({
          user: {
            ...data.user,
            provider: 'jwt',
          },
          loading: false,
        })
        return
      }
    } catch {
      // ignore
    }

    // ─── 3. Not logged in ───
    set({ user: null, loading: false })
  },
}))
