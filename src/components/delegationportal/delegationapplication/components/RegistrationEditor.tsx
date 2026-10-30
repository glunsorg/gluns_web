/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import { EventOption, InstitutionOption } from './DelegationFormStep'
import DelegationFormStep from './DelegationFormStep'
import { EMPTY_REGISTRATION } from '@/lib/registration'
import { apiFetch } from '@/app/utils/apiFetch'

interface Props {
  registrationId?: string | number | null
  events: EventOption[]
  institutions: InstitutionOption[]
  isDelegateAccount?: boolean
  registeredBy: string
  registrationType: 'individual' | 'institution'
  onSaved: (reg: any) => void
}

export default function RegistrationEditor({
  registrationId,
  events,
  institutions,
  registeredBy,
  isDelegateAccount,
  registrationType,
  onSaved,
}: Props) {
  const [registration, setRegistration] = useState<any>(EMPTY_REGISTRATION)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!registrationId) return
    setLoading(true)
    apiFetch(`/api/registrations/${registrationId}`)
      .then((res) => res.json())
      .then((data) => setRegistration(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [registrationId])

  const handleSave = async () => {
    try {
      const res = await apiFetch(
        `/api/registrations${registrationId ? `/${registrationId}` : ''}`,
        {
          method: registrationId ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(registration),
        },
      )
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || 'Failed to save')
      }

      const data = await res.json()
      // update local registration state with returned record
      setRegistration(data)
      onSaved(data)
      alert('Saved')
    } catch (err) {
      console.error(err)
      alert('Failed to save registration')
    }
  }

  return (
    <div className="space-y-6">
      <DelegationFormStep
        formData={registration}
        setFormData={setRegistration}
        handleSave={handleSave}
        saving={false}
        events={events}
        institutions={institutions}
        selectedEventId={String(registration?.event || '')}
        selectedInstitutionId={String(registration?.institution || '')}
        isDelegateAccount={isDelegateAccount}
        registeredBy={registeredBy}
        registrationType={registrationType}
        onEventChange={(id) => setRegistration((r: any) => ({ ...r, event: id }))}
      />
    </div>
  )
}
