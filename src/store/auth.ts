import { create } from 'zustand'

export interface AuthUser {
  id: string
  email: string
  name: string
  role: 'admin' | 'customer'
  phone?: string | null
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
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch {
      // ignore
    }
    set({ user: null })
  },
  fetchSession: async () => {
    try {
      const res = await fetch('/api/auth/session')
      const data = await res.json()
      set({ user: data.user || null, loading: false })
    } catch {
      set({ user: null, loading: false })
    }
  },
}))
