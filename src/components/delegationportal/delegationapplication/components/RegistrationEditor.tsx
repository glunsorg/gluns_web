import React, { useEffect, useState } from 'react'
import { EventOption, InstitutionOption } from './DelegationFormStep'
import DelegationFormStep from './DelegationFormStep'
import DelegatesManager from './DelegatesManager'
import { EMPTY_REGISTRATION } from '@/lib/registration'
import { apiFetch } from '@/app/utils/apiFetch'
import { Button } from '@/components/ui/button'

interface Props {
  registrationId?: string | number | null
  events: EventOption[]
  institutions: InstitutionOption[]
  registeredBy: string
  showDelegateManagement?: boolean
  onSaved: (reg: any) => void
}

export default function RegistrationEditor({
  registrationId,
  events,
  institutions,
  registeredBy,
  showDelegateManagement = true,
  onSaved,
}: Props) {
  const [registration, setRegistration] = useState<any>(EMPTY_REGISTRATION)
  const [loading, setLoading] = useState(false)
  const [editingDelegates, setEditingDelegates] = useState(false)

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

  const startPayment = async () => {
    try {
      if (!registration?.id) {
        alert('Save the registration before starting payment')
        return
      }

      const res = await apiFetch('/api/paystack/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delegateSlotsPurchased: 1, delegationId: Number(registration.id) }),
      })

      const data = await res.json()
      if (data?.authorization_url) window.open(data.authorization_url, '_blank')
    } catch (err) {
      console.error(err)
      alert('Failed to start payment')
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
        isDelegateAccount={false}
        registeredBy={registeredBy}
        onEventChange={(id) => setRegistration((r: any) => ({ ...r, event: id }))}
        onInstitutionChange={(id) => setRegistration((r: any) => ({ ...r, institution: id }))}
      />

      {showDelegateManagement && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-semibold text-white">Delegates</p>
              <p className="text-xs text-white/70">Add delegates for this registration</p>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => setEditingDelegates((s) => !s)}>Manage delegates</Button>
              <Button onClick={startPayment}>Start payment</Button>
            </div>
          </div>

          {editingDelegates && (
            <div className="mt-4">
              <DelegatesManager registrationId={registration?.id} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
