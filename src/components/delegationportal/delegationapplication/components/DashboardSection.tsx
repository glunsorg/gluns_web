'use client'

import { ArrowRight } from 'lucide-react'
import { DelegationSection } from '@/lib/registration'
import Image from 'next/image'
import { RegistrationSelector } from '../components/RegistrationSelector'

interface DashboardSectionProps {
  isDelegateAccount: boolean
  onSectionChange: (section: DelegationSection) => void
}

export default function DashboardSection({
  isDelegateAccount,
  onSectionChange,
}: DashboardSectionProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-3xl border border-white/10 bg-[#07131f]/90 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.22)] backdrop-blur">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-white/40">Overview</p>
              <h2 className="mt-2 text-3xl font-semibold">Welcome to the delegation portal</h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70">
                Use the sidebar to move from event registration to delegation management, country
                assignments, profile details, and account settings.
              </p>
            </div>
            <div className="rounded-2xl border border-[#85c226]/20 bg-[#85c226]/10 px-4 py-3 text-sm font-semibold text-[#85c226]">
              {isDelegateAccount ? 'Individual delegate' : 'Institution delegation'}
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => onSectionChange('register')}
              className="group rounded-2xl border border-white/10 bg-white/5 p-5 text-left transition hover:border-[#85c226]/40 hover:bg-white/10"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-lg font-bold text-white">Start registration</p>
                  <p className="mt-1 text-sm text-white/65">
                    Choose a specific event and save your details.
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-[#85c226] transition group-hover:translate-x-1" />
              </div>
            </button>

            <button
              type="button"
              onClick={() => onSectionChange('delegations')}
              className="group rounded-2xl border border-white/10 bg-white/5 p-5 text-left transition hover:border-[#85c226]/40 hover:bg-white/10"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-lg font-bold text-white">Manage delegates</p>
                  <p className="mt-1 text-sm text-white/65">
                    Add members, then complete payment and assignments.
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-[#85c226] transition group-hover:translate-x-1" />
              </div>
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-[#104179]/15 bg-white p-6 text-[#104179] shadow-[0_16px_48px_rgba(7,19,31,0.18)]">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#104179]/50">
            Next steps
          </p>
          <div className="mt-4 space-y-4 text-sm">
            <div className="rounded-2xl bg-[#104179]/5 p-4">
              <p className="font-semibold">1. Choose an event</p>
              <p className="mt-1 text-[#104179]/70">
                Pick the conference before saving registration details.
              </p>
            </div>
            <div className="rounded-2xl bg-[#104179]/5 p-4">
              <p className="font-semibold">2. Add delegates and pay</p>
              <p className="mt-1 text-[#104179]/70">
                Payment unlocks the delegate list for institutional registrations.
              </p>
            </div>
            <div className="rounded-2xl bg-[#104179]/5 p-4">
              <p className="font-semibold">3. Build assignments</p>
              <p className="mt-1 text-[#104179]/70">
                GA country selection is self-service; ICJ and ILC stay secretariat-managed.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-3xl border border-white/10 bg-[#07131f]/90 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.22)] backdrop-blur">
        <p className="text-xs uppercase tracking-[0.35em] text-white/40">Your registrations</p>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70">
          You can return later to add delegates, assign committees, and handle payment.
        </p>

        <RegistrationSelector
          registrations={[]}
          activeRegistrationId={null}
          onSelectRegistration={(id) => {
            console.log('Selected registration ID:', id)
            // Handle registration selection logic here
          }}
          onStartNewRegistration={() => {
            console.log('Starting new registration')
            onSectionChange('register')
          }}
        />
      </div>
    </div>
  )
}
