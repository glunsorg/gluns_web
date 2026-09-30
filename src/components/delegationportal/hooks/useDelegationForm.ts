// hooks/useDelegationForm.ts
import { useState } from 'react'
import { apiFetch } from '@/app/utils/apiFetch'
import { Registration } from '@/types/registrationTypes'
import { EMPTY_REGISTRATION } from '@/lib/registration'

export function useDelegationForm(userId?: string) {
  const [formData, setFormData] = useState<Registration>(EMPTY_REGISTRATION)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (
      !formData.institution ||
      !formData.registrationType ||
      !formData.event ||
      !formData.registeredBy
    ) {
      alert('Please fill in all required fields')
      return
    }

    setSaving(true)
    try {
      const method = userId ? 'PATCH' : 'POST'
      const url = userId ? `/api/registrations/${userId}` : '/api/registrations'

      const res = await apiFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message || 'Failed to save delegation')
      }

      const data = await res.json()
      setFormData(data)
      alert('Delegation saved successfully')
    } catch (error: any) {
      alert(error.message)
    } finally {
      setSaving(false)
    }
  }

  return {
    formData,
    setFormData,
    saving,
    handleSave,
  }
}
