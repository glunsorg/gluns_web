// hooks/useAuthGate.ts
import { useEffect, useState } from 'react'
import { useAuthStore } from '@/app/store/authStore'
import { useRouter } from 'next/navigation'

export function useAuthGate() {
  const { user, logout, setUser } = useAuthStore()
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [loggingOut, setLoggingOut] = useState(false)
  const router = useRouter()

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
      } catch (error) {
        console.error('Failed to hydrate user state:', error)
      } finally {
        if (mounted) setCheckingAuth(false)
      }
    }

    hydrate()

    return () => {
      mounted = false
    }
  }, [setUser])

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await logout()
      router.replace('/registration')
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setLoggingOut(false)
    }
  }

  return {
    user,
    checkingAuth,
    loggingOut,
    handleLogout,
  }
}
