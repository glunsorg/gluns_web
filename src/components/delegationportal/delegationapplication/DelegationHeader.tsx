import React from 'react'
import { Delegation } from '@/app/types/types'
import { LogOut, CheckCircle, Clock, Menu, ArrowRight } from 'lucide-react'

export default function DelegationHeader({
  activeSection,
  formData,
  loggingOut,
  onLogout,
  onOpenSidebar,
  isDelegateAccount,
}: {
  activeSection: string
  formData: Delegation
  loggingOut: boolean
  onLogout: () => void
  onOpenSidebar: () => void
  isDelegateAccount?: boolean
}) {
  const titleMap: Record<string, string> = {
    dashboard: 'Portal Dashboard',
    register: 'Register for an Event',
    delegations: 'Delegation Management',
    assignments: 'Country Assignments',
    profile: 'Profile',
    account: 'Account Settings',
  }

  const descriptionMap: Record<string, string> = {
    dashboard: 'Track progress, event choice, and next actions at a glance',
    register: 'Choose your event and complete the registration form',
    delegations: 'Add delegates, manage payment, and prepare the team',
    assignments: 'Assign organs, committees, and countries for your delegates',
    profile: 'Review your account and registration details',
    account: 'Manage password and account security',
  }

  return (
    <div className="mb-6 rounded-3xl border border-white/10 bg-[#07131f]/80 p-6 text-white shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-start gap-4">
          <button
            onClick={onOpenSidebar}
            aria-label="Open navigation menu"
            title="Open navigation menu"
            className="lg:hidden rounded-2xl border border-white/10 bg-white/5 p-2 transition-colors hover:bg-white/10"
          >
            <Menu className="w-6 h-6 text-white" />
          </button>
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full border border-[#85c226]/20 bg-[#85c226]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#85c226]">
                Delegation portal
              </span>
              <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/70">
                {isDelegateAccount ? 'Individual' : 'Institution'}
              </span>
            </div>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              {titleMap[activeSection] || 'Portal Dashboard'}
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
              {descriptionMap[activeSection] || 'Manage your event registration from one place.'}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2">
            {formData.status === 'pending' ? (
              <Clock className="w-4 h-4 text-[#85c226]" />
            ) : (
              <CheckCircle className="w-4 h-4 text-[#85c226]" />
            )}
            <span className="text-sm font-semibold capitalize text-white">{formData.status}</span>
          </div>
          <button
            onClick={onLogout}
            disabled={loggingOut}
            className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10 disabled:opacity-50"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">{loggingOut ? 'Logging out...' : 'Logout'}</span>
          </button>
          <div className="hidden xl:flex items-center gap-2 rounded-2xl border border-[#85c226]/20 bg-[#85c226]/10 px-4 py-2 text-sm font-semibold text-[#85c226]">
            <ArrowRight className="h-4 w-4" />
            Keep moving through the portal
          </div>
        </div>
      </div>
    </div>
  )
}
