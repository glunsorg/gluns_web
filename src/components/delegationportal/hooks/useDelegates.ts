import { useState, useEffect, useCallback } from 'react'
import { DelegateData } from '@/types/registrationTypes'

export function useDelegates(registrationId?: string | number) {
  const [delegates, setDelegates] = useState<DelegateData[]>([])
  const [loading, setLoading] = useState(false)

  const fetchDelegates = useCallback(async () => {
    if (registrationId == null) {
      setDelegates([])
      setLoading(false)
      return
    }

    setLoading(true)

    try {
      const res = await fetch(
        `/api/delegates?where[registration][equals]=${registrationId}&depth=1`,
      )

      if (!res.ok) {
        throw new Error('Failed to fetch delegates')
      }

      const data = await res.json()
      setDelegates(data.docs || [])
    } catch (err) {
      console.error('Failed to fetch delegates', err)
      setDelegates([])
    } finally {
      setLoading(false)
    }
  }, [registrationId])

  useEffect(() => {
    fetchDelegates()
  }, [fetchDelegates])

  return {
    delegates,
    loadingDelegates: loading,
    refetchDelegates: fetchDelegates,
  }
}
