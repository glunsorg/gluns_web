import React from 'react'
import { Save, CalendarDays, Building2, Globe } from 'lucide-react'
import { Registration } from '@/types/registrationTypes'

export type EventOption = {
  id: number | string
  title: string
  date?: string
  location?: string
  cost?: number | string | null
  currency?: string
}

export type InstitutionOption = {
  id: number | string
  name: string
}

interface DelegationFormStepProps {
  formData: Registration
  setFormData: React.Dispatch<React.SetStateAction<Registration>>
  handleSave: () => void
  saving: boolean
  isDelegateAccount?: boolean
  events: EventOption[]
  institutions: InstitutionOption[]
  selectedInstitutionId: string
  selectedEventId: string
  registeredBy: string
  onEventChange: (eventId: string) => void
  onInstitutionChange: (institutionId: string) => void
}

export default function DelegationFormStep({
  formData,
  setFormData,
  handleSave,
  saving,
  isDelegateAccount,
  events,
  institutions,
  selectedEventId,
  selectedInstitutionId,
  registeredBy,
  onEventChange,
  onInstitutionChange,
}: DelegationFormStepProps) {
  const selectedEvent = events.find((event) => String(event.id) === String(selectedEventId))

  // Update formData when event changes
  const handleEventSelect = (eventId: string) => {
    onEventChange(eventId)
    setFormData((prev) => ({
      ...prev,
      event: eventId,
      registeredBy: registeredBy, // using registeredBy here
    }))
  }

  // Update formData when institution changes
  const handleInstitutionSelect = (institutionId: string) => {
    onInstitutionChange(institutionId)
    setFormData((prev) => ({
      ...prev,
      institution: institutionId,
      registeredBy: registeredBy, // using registeredBy here
    }))
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/95 p-6 shadow-[0_20px_50px_rgba(7,19,31,0.18)] sm:p-8">
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col gap-4 rounded-3xl bg-[#0d0d0d] p-5 text-white sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-white/45">Registration</p>
            <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">
              {isDelegateAccount ? 'Individual delegate registration' : 'Delegation registration'}
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-white/70">
              Choose your event first, then complete the information needed for your portal record,
              payment, and later delegate allocation.
            </p>
          </div>
          <div className="grid gap-2" style={{ minWidth: '240px' }}>
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
              <Building2 className="h-4 w-4 text-[#85c226]" />
              {isDelegateAccount ? 'Single delegate journey' : 'Institution / school journey'}
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
              <Globe className="h-4 w-4 text-[#85c226]" />
              Event and delegation details in one place
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-[#104179]/15 bg-[#104179]/5 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#104179] text-white">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#104179]/60">
                Step 1
              </p>
              <h3 className="text-xl font-bold text-[#104179]">Choose a specific event</h3>
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#104179]">
                Event selection <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.event || selectedEventId} // read directly from formData
                onChange={(e) => handleEventSelect(e.target.value)}
                className="w-full rounded-2xl border-2 border-[#104179]/15 bg-white px-4 py-3 text-[#104179] outline-none transition focus:border-[#85c226]"
                title="Select an event"
              >
                <option value="">Select an event</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.title}
                  </option>
                ))}
              </select>
              <p className="text-xs text-[#104179]/60">
                You can only register one portal record per event and return later to manage
                delegates.
              </p>
            </div>

            <div className="rounded-2xl border border-[#104179]/15 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#104179]/50">
                Event preview
              </p>
              {selectedEvent ? (
                <div className="mt-3 space-y-2">
                  <p className="text-lg font-bold text-[#104179]">{selectedEvent.title}</p>
                  <p className="text-sm text-[#104179]/70">
                    {selectedEvent.location || 'Location to be announced'}
                  </p>
                  <p className="text-sm text-[#104179]/70">
                    {selectedEvent.date
                      ? new Date(selectedEvent.date).toLocaleDateString()
                      : 'Date pending'}
                  </p>
                  <p className="text-sm font-semibold text-[#85c226]">
                    {selectedEvent.cost != null
                      ? `${selectedEvent.currency || 'KES'} ${selectedEvent.cost}`
                      : 'Registration cost available on the event page'}
                  </p>
                </div>
              ) : (
                <p className="mt-3 text-sm text-[#104179]/60">
                  Select an event to see the quick summary here.
                </p>
              )}
            </div>
          </div>
        </div>

        {isDelegateAccount && (
          <div className="rounded-2xl border border-[#85c226]/20 bg-[#85c226]/10 p-4 text-sm text-[#104179]">
            This is an individual delegate registration. The same payment and account flow is used,
            but the portal keeps the wording focused on a single student.
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Institution <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.institution || selectedInstitutionId} // read directly from formData
              onChange={(e) => handleInstitutionSelect(e.target.value)}
              className="w-full rounded-2xl border text-black border-[#104179]/15 px-4 py-3 transition focus:border-[#85c226] focus:ring-2 focus:ring-[#85c226]/20"
              title="Select an institution"
            >
              <option value="">Select an institution</option>
              {institutions.map((school) => (
                <option key={school.id} value={school.id}>
                  {school.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 border-t border-[#104179]/10 pt-6 sm:flex-row">
        <div className="flex gap-3 flex-1 justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex flex-1 items-center justify-center gap-2 bg-[#85c226] px-6 py-3 font-medium text-white shadow-md transition-colors hover:bg-[#104179] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save & Continue'}
          </button>
        </div>
      </div>
    </div>
  )
}
