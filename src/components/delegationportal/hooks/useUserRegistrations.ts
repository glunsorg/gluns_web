// src/hooks/useUserRegistrations.ts
import { useState, useEffect, useCallback } from 'react'

export function useUserRegistrations(userId?: string) {
  const [userRegistrations, setUserRegistrations] = useState<any[]>([])
  const [activeRegistrationId, setActiveRegistrationId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchRegistrations = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    try {
      const res = await fetch(`/api/registrations?where[registeredBy][equals]=${userId}&depth=1`)
      const data = await res.json()
      setUserRegistrations(data.docs || [])

      // Auto-select the first registration if none selected
      if (data.docs?.length > 0 && !activeRegistrationId) {
        setActiveRegistrationId(data.docs[0].id)
      }
    } catch (err) {
      console.error('Failed to fetch user registrations', err)
    } finally {
      setLoading(false)
    }
  }, [userId, activeRegistrationId])

  useEffect(() => {
    fetchRegistrations()
  }, [fetchRegistrations])

  return {
    // backward compatible keys
    userRegistrations,
    activeRegistrationId,
    setActiveRegistrationId,
    refetchRegistrations: fetchRegistrations,
    loadingRegistrations: loading,
    // friendly keys used by components
    registrations: userRegistrations,
    loading: loading,
    refetch: fetchRegistrations,
  }
}
