import { useState, useEffect, useCallback } from 'react'

export function useUserProfile(userId?: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [userProfile, setUserProfile] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUserProfile = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    try {
      const res = await fetch(`/api/profile?where[user][equals]=${userId}&depth=1`)
      const data = await res.json()
      setUserProfile(data.docs?.[0] || null)
    } catch (err) {
      console.error('Failed to fetch user profile', err)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchUserProfile()
  }, [fetchUserProfile])

  return {
    userProfile,
    refetchUserProfile: fetchUserProfile,
    loadingUserProfile: loading,
  }
}
