import React from 'react'
import { Delegation } from '@/app/types/types'
import { ChevronRight, Save, CalendarDays, Building2, Globe } from 'lucide-react'

type EventOption = {
  id: number | string
  title: string
  date?: string
  location?: string
  cost?: number | string | null
  currency?: string
}

export default function DelegationFormStep({
  currentStep,
  formData,
  handleChange,
  nextStep,
  prevStep,
  handleSave,
  saving,
  stepsLength,
  isDelegateAccount,
  events,
  selectedEventId,
  onEventChange,
}: {
  currentStep: number
  formData: Delegation
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleChange: (e: React.ChangeEvent<any>) => void
  nextStep: () => void
  prevStep: () => void
  handleSave: () => void
  saving: boolean
  stepsLength: number
  isDelegateAccount?: boolean
  events: EventOption[]
  selectedEventId: string
  onEventChange: (eventId: string) => void
}) {
  const selectedEvent = events.find((event) => String(event.id) === String(selectedEventId))

  return (
    <div className="rounded-3xl border border-white/10 bg-white/95 p-6 shadow-[0_20px_50px_rgba(7,19,31,0.18)] sm:p-8">
      {currentStep === 0 && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col gap-4 rounded-3xl bg-[#0d0d0d] p-5 text-white sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-white/45">Registration</p>
              <h2 className="mt-2 text-2xl font-black sm:text-3xl">
                {isDelegateAccount ? 'Individual delegate registration' : 'Delegation registration'}
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-white/70">
                Choose your event first, then complete the information needed for your portal
                record, payment, and later delegate allocation.
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
                  value={selectedEventId}
                  onChange={(e) => onEventChange(e.target.value)}
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
              This is an individual delegate registration. The same payment and account flow is
              used, but the portal keeps the wording focused on a single student.
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Delegation Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {isDelegateAccount ? 'Delegate Full Name' : 'Delegation Name'}{' '}
                <span className="text-red-500">*</span>
              </label>
              <input
                name="delegationName"
                value={formData.delegationName}
                onChange={handleChange}
                placeholder={
                  isDelegateAccount ? 'Enter your full name' : 'Enter your delegation name'
                }
                className="w-full rounded-2xl border border-[#104179]/15 px-4 py-3 transition focus:border-[#85c226] focus:ring-2 focus:ring-[#85c226]/20"
              />
            </div>

            {/* Country of Origin */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {isDelegateAccount ? 'Country of Residence' : 'Country of Origin'}{' '}
                <span className="text-red-500">*</span>
              </label>
              <input
                name="countryOfOrigin"
                value={formData.countryOfOrigin}
                onChange={handleChange}
                placeholder={
                  isDelegateAccount ? 'Enter your country of residence' : 'Enter your country'
                }
                className="w-full rounded-2xl border border-[#104179]/15 px-4 py-3 transition focus:border-[#85c226] focus:ring-2 focus:ring-[#85c226]/20"
              />
            </div>

            {!isDelegateAccount ? (
              <>
                {/* Number of Delegates */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Number of Delegates <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="numberOfDelegates"
                    value={formData.numberOfDelegates}
                    placeholder="Enter the number of delegates"
                    onChange={handleChange}
                    min={1}
                    className="w-full rounded-2xl border border-[#104179]/15 px-4 py-3 transition focus:border-[#85c226] focus:ring-2 focus:ring-[#85c226]/20"
                  />
                </div>

                {/* Number of Faculty Advisors */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Number of Faculty Advisors <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="numberOfFacultyAdvisors"
                    placeholder="Enter the number of faculty advisors"
                    value={formData.numberOfFacultyAdvisors}
                    onChange={handleChange}
                    min={0}
                    className="w-full rounded-2xl border border-[#104179]/15 px-4 py-3 transition focus:border-[#85c226] focus:ring-2 focus:ring-[#85c226]/20"
                  />
                </div>
              </>
            ) : (
              <div className="md:col-span-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-[#104179]/15 bg-[#104179]/5 px-4 py-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Delegate Count
                  </p>
                  <p className="text-lg font-semibold text-gray-900">1 delegate</p>
                </div>
                <div className="rounded-2xl border border-[#104179]/15 bg-[#104179]/5 px-4 py-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Faculty Advisors
                  </p>
                  <p className="text-lg font-semibold text-gray-900">0 advisors</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {currentStep === 1 && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h2 className="mb-6 text-2xl font-bold text-[#104179]">
              {isDelegateAccount ? 'Delegate Background' : 'Experience & Background'}
            </h2>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {isDelegateAccount ? 'Previous MUN / Debate Experience' : 'Previous MUN Experience'}{' '}
              <span className="text-red-500">*</span>
            </label>
            <p className="mb-2 text-sm text-[#104179]/70">
              {isDelegateAccount
                ? 'Tell us about your Model United Nations, debate, public speaking, or leadership experience.'
                : "Describe your delegation's previous experiences with Model United Nations. If you don't have any MUN experience, please describe other relevant experiences such as debate, public speaking, or mock trial."}
            </p>
            <textarea
              name="previousExperience"
              value={formData.previousExperience}
              onChange={handleChange}
              rows={5}
              placeholder="Tell us about your experience..."
              className="w-full resize-none rounded-2xl border border-[#104179]/15 px-4 py-3 transition focus:border-[#85c226] focus:ring-2 focus:ring-[#85c226]/20"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {isDelegateAccount ? 'Grade / Year Level' : 'GLUNS Experience'}{' '}
              <span className="text-red-500">*</span>
            </label>
            <p className="mb-2 text-sm text-[#104179]/70">
              {isDelegateAccount
                ? 'Tell us your current grade or year level.'
                : 'Has your delegation participated in GLUNS before? If so, how many years?'}
            </p>
            <input
              name="hmunExperience"
              value={formData.hmunExperience}
              onChange={handleChange}
              placeholder="e.g., First time, 2 years, etc."
              className="w-full rounded-2xl border border-[#104179]/15 px-4 py-3 transition focus:border-[#85c226] focus:ring-2 focus:ring-[#85c226]/20"
            />
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h2 className="mb-6 text-2xl font-bold text-[#104179]">
              {isDelegateAccount ? 'Delegate Preferences' : 'Committee Preferences'}
            </h2>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {isDelegateAccount ? 'Preferred Committees / Tracks' : 'Preferred Regions'}
            </label>
            <p className="mb-2 text-sm text-[#104179]/70">
              {isDelegateAccount
                ? 'Tell us which committees or conference tracks you would like to join.'
                : 'Is there a type of country or region of the world in which your delegation is particularly interested? (max 255 characters)'}
            </p>
            <input
              name="preferredRegions"
              value={formData.preferredRegions}
              onChange={handleChange}
              maxLength={255}
              placeholder="e.g., Latin America, Southeast Asia, etc."
              className="w-full rounded-2xl border border-[#104179]/15 px-4 py-3 transition focus:border-[#85c226] focus:ring-2 focus:ring-[#85c226]/20"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {isDelegateAccount ? 'Single Delegate Registration' : 'Double Delegations'}{' '}
              <span className="text-red-500">*</span>
            </label>
            <p className="mb-2 text-sm text-[#104179]/70">
              {isDelegateAccount
                ? 'This account is registered as a single delegate, so the portal will keep this set to no.'
                : 'Does your delegation prefer double delegations (e.g., DISEC, SOCHUM, SPECPOL, Legal Committee, UNSC)?'}
            </p>
            <select
              name="prefersDoubleDelegations"
              value={formData.prefersDoubleDelegations}
              onChange={handleChange}
              title="Select whether your delegation prefers double delegations"
              className="w-full rounded-2xl border border-[#104179]/15 bg-white px-4 py-3 transition focus:border-[#85c226] focus:ring-2 focus:ring-[#85c226]/20"
            >
              <option value="yes" disabled={isDelegateAccount}>
                Yes, we prefer double delegations
              </option>
              <option value="no">No, we prefer single delegations</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {isDelegateAccount ? 'Special Requests' : 'Crisis Committee Requests'}
            </label>
            <p className="mb-2 text-sm text-[#104179]/70">
              {isDelegateAccount
                ? 'Share any accessibility, scheduling, or committee preferences here. (max 255 characters)'
                : 'How many allocations in our Crisis Committees would your delegation like? Which specific committees? (max 255 characters) Note: Allocations are limited.'}
            </p>
            <textarea
              name="crisisCommitteeRequests"
              value={formData.crisisCommitteeRequests}
              onChange={handleChange}
              maxLength={255}
              rows={3}
              placeholder="Specify your crisis committee preferences..."
              className="w-full resize-none rounded-2xl border border-[#104179]/15 px-4 py-3 transition focus:border-[#85c226] focus:ring-2 focus:ring-[#85c226]/20"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {isDelegateAccount ? 'Committee Interest' : 'Committee Interests'}{' '}
              <span className="text-red-500">*</span>
            </label>
            <p className="mb-2 text-sm text-[#104179]/70">
              {isDelegateAccount
                ? 'Select the type of committee you would like to join.'
                : 'Select your interest in specialized committees. We recommend experienced delegates for advanced committees and require limited/no crisis experience for novice committees.'}
            </p>
            <select
              name="committeeInterests"
              value={formData.committeeInterests}
              onChange={handleChange}
              title="Select your committee interest"
              className="w-full rounded-2xl border border-[#104179]/15 bg-white px-4 py-3 transition focus:border-[#85c226] focus:ring-2 focus:ring-[#85c226]/20"
            >
              <option value="advanced">Advanced Committees (AHCSG, AHCDG, UNSC)</option>
              <option value="press">Press Corps Committee</option>
              <option value="novice">Novice Committee (Limited/No Experience)</option>
              <option value="spanish">Bilingual Spanish Committee</option>
            </select>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-8 flex flex-col gap-3 border-t border-[#104179]/10 pt-6 sm:flex-row">
        <div className="flex gap-3 flex-1">
          {currentStep > 0 && (
            <button
              type="button"
              onClick={prevStep}
              className="flex-1 rounded-2xl bg-[#104179]/5 px-6 py-3 font-medium text-[#104179] transition-colors hover:bg-[#104179]/10 sm:flex-none"
            >
              Previous
            </button>
          )}
        </div>
        <div className="flex gap-3">
          {currentStep < stepsLength - 1 ? (
            <button
              type="button"
              onClick={nextStep}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#104179] px-6 py-3 font-medium text-white shadow-md transition-colors hover:bg-[#0d3a66] hover:shadow-lg sm:flex-none"
            >
              Next Step
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#85c226] px-6 py-3 font-medium text-white shadow-md transition-colors hover:bg-[#104179] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Delegation'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
