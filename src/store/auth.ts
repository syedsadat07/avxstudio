import { create } from 'zustand'
import { supabaseBrowser } from '@/lib/supabase-browser'

export interface AuthUser {
  id: string
  email: string
  name: string
  role: 'admin' | 'customer'
  phone?: string | null
  provider?: 'supabase' | 'jwt'
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
  loading: false,
  setuser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),

  logout: async () => {
    const { user } = useAuth.getState()
    if (user?.provider === 'supabase') {
      try { await supabaseBrowser.auth.signOut() } catch { /* ignore */ }
    }
    if (user?.provider === 'jwt') {
      try { await fetch('/api/auth/logout', { method: 'POST' }) } catch { /* ignore */ }
    }
    set({ user: null })
  },

  fetchSession: async () => {
    // Check Supabase session
    try {
      const { data: { session } } = await supabaseBrowser.auth.getSession()
      if (session?.user) {
        const supaUser = session.user
        const name = supaUser.user_metadata?.full_name || supaUser.user_metadata?.name || supaUser.email?.split('@')[0] || 'Customer'
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
        return
      }
    } catch { /* Supabase not available */ }

    // Check JWT session
    try {
      const res = await fetch('/api/auth/session')
      const data = await res.json()
      if (data.user) {
        set({ user: { ...data.user, provider: 'jwt' }, loading: false })
        return
      }
    } catch { /* JWT not available */ }

    set({ user: null, loading: false })
  },
}))
