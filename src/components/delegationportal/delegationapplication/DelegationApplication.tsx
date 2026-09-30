'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

import DelegationHeader from './DelegationHeader'
import DelegationFormStep from './components/DelegationFormStep'
import Loading from '@/app/(frontend)/loading'

// hooks
import { useAuthGate } from '../hooks/useAuthGate'
import { useEvents } from '../hooks/useEvents'
import { useInstitutions } from '../hooks/useInstitutions'

// utils

// components import
import { Sidebar } from './Sidebar'
import DashboardSection from './components/DashboardSection'
import { useDelegationForm } from '../hooks/useDelegationForm'

export default function DelegationPortal() {
  const router = useRouter()

  // states
  const { user, checkingAuth, loggingOut, handleLogout } = useAuthGate()
  const { events, selectedEventId, setSelectedEventId } = useEvents()
  const { institutions, selectedInstitutionId, setSelectedInstitutionId } = useInstitutions()
  const [activeSection, setActiveSection] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const isDelegateAccount = !!user?.roles?.includes('delegate')
  const { formData, setFormData, saving, handleSave } = useDelegationForm(user?.id)

  useEffect(() => {
    if (!checkingAuth && !user) {
      router.replace('/registration')
    }
  }, [checkingAuth, user, router])

  if (checkingAuth) {
    return <Loading />
  }

  if (!user) {
    return <Loading />
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <div className="flex min-h-screen bg-[#07131f]">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          isDelegateAccount={isDelegateAccount}
          userName={user?.fullName || user?.email || 'User'}
        />

        <div className="flex-1 overflow-x-hidden px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
          <div className="mx-auto max-w-7xl">
            <DelegationHeader
              activeSection={activeSection}
              loggingOut={loggingOut}
              onLogout={handleLogout}
              onOpenSidebar={() => setSidebarOpen(true)}
              isDelegateAccount={isDelegateAccount}
            />

            {activeSection === 'dashboard' && (
              <DashboardSection
                isDelegateAccount={isDelegateAccount}
                onSectionChange={setActiveSection}
              />
            )}

            {/* registration form */}
            {activeSection === 'register' && (
              <div className="space-y-6">
                <DelegationFormStep
                  formData={formData}
                  setFormData={setFormData}
                  handleSave={handleSave}
                  saving={saving}
                  isDelegateAccount={isDelegateAccount}
                  events={events}
                  institutions={institutions}
                  selectedInstitutionId={selectedInstitutionId}
                  selectedEventId={selectedEventId}
                  registeredBy={user?.id || ''}
                  onEventChange={setSelectedEventId}
                  onInstitutionChange={setSelectedInstitutionId}
                />
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-white/70 backdrop-blur">
                  <span className="font-semibold text-white">Need help?</span>{' '}
                  {isDelegateAccount
                    ? 'This path is optimized for a single delegate. Save your progress, then continue to delegations once your account is ready.'
                    : 'Institutional registrations can return later to add multiple delegates, assign committees, and handle payment.'}
                </div>
              </div>
            )}

            {/* delegation registration */}
          </div>
        </div>
      </div>
    </div>
  )
}
