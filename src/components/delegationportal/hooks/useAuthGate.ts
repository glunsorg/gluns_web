import { useEffect, useState } from 'react'
import { useAuthStore } from '@/app/store/authStore'

export function useAuthGate() {
  const { user, logout, setUser } = useAuthStore()
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    let mounted = true

    const hydrate = async () => {
      try {
        const res = await fetch('/api/users/me', { cache: 'no-store' })

        if (!res.ok) {
          if (mounted) setUser(null)
          return
        }

        const data = await res.json()
        if (mounted) setUser(data.user)
      } finally {
        if (mounted) setCheckingAuth(false)
      }
    }

    hydrate()

    return () => {
      mounted = false
    }
  }, [setUser])

  return {
    user,
    checkingAuth,
    logout,
  }
}
