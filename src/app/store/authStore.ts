import { create } from 'zustand'
import { logoutAction } from '../api/logout/logout'

interface User {
  id: string
  email: string
  roles: Array<'admin' | 'secretariat' | 'editor' | 'teacher' | 'delegate'>
  delegationName?: string
  fullName?: string
}

interface AuthState {
  user: User | null
  loading: boolean
  setUser: (user: User | null) => void
  checkAuth: () => Promise<void>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  setUser: (user) => set({ user, loading: false }),

  checkAuth: async () => {
    try {
      const res = await fetch('/api/users/me', {
        credentials: 'include',
        cache: 'no-store',
      })

      if (!res.ok) {
        set({ user: null, loading: false })
        return
      }

      const data = await res.json()
      set({ user: data.user, loading: false })
    } catch {
      set({ user: null, loading: false })
    }
  },

  logout: async () => {
    logoutAction()
    set({ user: null })
  },
}))
