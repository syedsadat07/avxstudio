import { create } from 'zustand'

export type PageId = 'home' | 'lookbook' | 'packages' | 'calculator' | 'booking' | 'slot-booking' | 'blog' | 'about' | 'contact' | 'admin-login' | 'admin-dashboard'

interface NavigationState {
  currentPage: PageId
  navigate: (page: PageId) => void
}

export const useNavigation = create<NavigationState>((set) => ({
  currentPage: 'home',
  navigate: (page) => {
    set({ currentPage: page })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  },
}))
