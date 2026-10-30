import { useState, useEffect, useCallback } from 'react'
import { DelegateData } from '@/types/registrationTypes'

export function useDelegates(registrationId?: string | number) {
  const [delegates, setDelegates] = useState<DelegateData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchDelegates = useCallback(async () => {
    if (registrationId == null) {
      setDelegates([])
      setLoading(false)
      setError(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch(
        `/api/registrations/${encodeURIComponent(String(registrationId))}/delegates`,
      )

      if (!res.ok) {
        throw new Error('Failed to fetch delegates')
      }

      const data = await res.json()

      setDelegates(data.delegates ?? [])
    } catch (err) {
      console.error('Failed to fetch delegates:', err)

      setError(err instanceof Error ? err.message : 'Failed to fetch delegates')
    } finally {
      setLoading(false)
    }
  }, [registrationId])

  useEffect(() => {
    setDelegates([])
    fetchDelegates()
  }, [fetchDelegates])

  return {
    delegates,
    loadingDelegates: loading,
    refetchDelegates: fetchDelegates,
    error,
  }
}
