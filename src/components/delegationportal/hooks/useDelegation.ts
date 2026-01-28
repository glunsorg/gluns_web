/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useDelegation.ts
import { useEffect, useState } from 'react'
import { EMPTY_DELEGATION, Delegation } from '../constant'

export function useDelegation(user: any, setUser: any) {
  const [delegation, setDelegation] = useState<Delegation | null>(null)
  const [formData, setFormData] = useState<Delegation>(EMPTY_DELEGATION)
  const [fetching, setFetching] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!user) {
      setFetching(false)
      return
    }

    const fetchDelegation = async () => {
      try {
        const res = await fetch('/api/delegation')
        if (res.status === 401) {
          setUser(null)
          return
        }

        const data = await res.json()
        setDelegation(data.delegation ?? null)
        setFormData(data.delegation ?? EMPTY_DELEGATION)
      } finally {
        setFetching(false)
      }
    }

    fetchDelegation()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const saveDelegation = async () => {
    setSaving(true)
    try {
      const method = delegation?.id ? 'PATCH' : 'POST'
      const url = delegation?.id ? `/api/delegation/${delegation.id}` : '/api/delegation'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error('Save failed')
      const data = await res.json()
      setDelegation(data)
      setFormData(data)
    } finally {
      setSaving(false)
    }
  }

  return {
    delegation,
    formData,
    setFormData,
    fetching,
    saving,
    saveDelegation,
  }
}
