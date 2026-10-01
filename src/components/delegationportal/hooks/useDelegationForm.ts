// hooks/useDelegationForm.ts
import { useState } from 'react'
import { apiFetch } from '@/app/utils/apiFetch'
import { Registration } from '@/types/registrationTypes'
import { EMPTY_REGISTRATION } from '@/lib/registration'

export function useDelegationForm(userId?: string) {
  const [formData, setFormData] = useState<Registration>(EMPTY_REGISTRATION)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!formData.institution || !formData.registrationType || !formData.event) {
      alert('Please fill in all required fields')
      return
    }

    setSaving(true)
    try {
      // If this registration already has an id, PATCH it; otherwise POST to create
      const isExisting = !!formData.id
      const url = isExisting ? `/api/registrations/${formData.id}` : '/api/registrations'
      const method = isExisting ? 'PATCH' : 'POST'

      // ensure registeredBy is set to current user if provided
      const payloadBody = { ...formData, registeredBy: formData.registeredBy || userId }

      const res = await apiFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadBody),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message || 'Failed to save delegation')
      }

      const data = await res.json()
      setFormData(data)
      alert('Delegation saved successfully')
      return data
    } catch (error: any) {
      alert(error.message)
      throw error
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
