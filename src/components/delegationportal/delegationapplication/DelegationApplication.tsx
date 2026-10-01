'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

import DelegationHeader from './DelegationHeader'
import RegistrationsList from './components/RegistrationsList'
import RegistrationEditor from './components/RegistrationEditor'
import DelegatesManager from './components/DelegatesManager'
import Loading from '@/app/(frontend)/loading'
import { Button } from '@/components/ui/button'
import { apiFetch } from '@/app/utils/apiFetch'

// hooks
import { useAuthGate } from '../hooks/useAuthGate'
import { useEvents } from '../hooks/useEvents'
import { useInstitutions } from '../hooks/useInstitutions'
import { useDelegates } from '../hooks/useDelegates'

// utils

// components import
import { Sidebar } from './Sidebar'
import DashboardSection from './components/DashboardSection'
import { useUserRegistrations } from '../hooks/useUserRegistrations'

type UserRegistration = {
  id: string | number
  registrationNumber?: string
  batch?:
    | string
    | number
    | {
        id?: string | number
      }
  event?: {
    title?: string
  }
}

export default function DelegationPortal() {
  const router = useRouter()

  // states
  const { user, checkingAuth, loggingOut, handleLogout } = useAuthGate()
  const { events } = useEvents()
  const { institutions } = useInstitutions()
  const { registrations, loading: regsLoading, refetch } = useUserRegistrations(user?.id)

  const [activeDelegationRegistrationId, setActiveDelegationRegistrationId] = useState<
    string | number | null
  >(null)

  const activeRegistration = (registrations as UserRegistration[]).find(
    (reg) => String(reg.id) === String(activeDelegationRegistrationId),
  )

  const { delegates, loadingDelegates } = useDelegates(activeDelegationRegistrationId ?? undefined)

  const [activeSection, setActiveSection] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const isDelegateAccount = !!user?.roles?.includes('delegate')
  const [editingRegistrationId, setEditingRegistrationId] = useState<string | number | null>(null)

  const startPaymentForRegistration = async () => {
    try {
      if (!activeDelegationRegistrationId) {
        alert('Select a registration before starting payment')
        return
      }

      const registrationId = Number(activeDelegationRegistrationId)

      if (!Number.isInteger(registrationId) || registrationId <= 0) {
        alert('Invalid registration selected for payment')
        return
      }

      if (delegates.length <= 0) {
        alert('Add at least one delegate before starting payment')
        return
      }

      const res = await apiFetch('/api/paystack/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          registrationId,
          delegateCount: delegates.length,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        console.error('Payment initiation failed:', data)
        throw new Error(data?.message || 'Failed to start payment')
      }

      if (data?.authorization_url) {
        window.open(data.authorization_url, '_blank')
      }
    } catch (err) {
      console.error('Payment initiation error:', err)
      alert(err instanceof Error ? err.message : 'Failed to start payment')
    }
  }

  useEffect(() => {
    if (!checkingAuth && !user) {
      router.replace('/registration')
    }
  }, [checkingAuth, user, router])

  useEffect(() => {
    if (activeSection !== 'delegations') return
    if (activeDelegationRegistrationId) return

    const availableRegistrations = registrations as UserRegistration[]

    if (availableRegistrations.length > 0) {
      setActiveDelegationRegistrationId(availableRegistrations[0].id)
    }
  }, [activeSection, activeDelegationRegistrationId, registrations])

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
              <div>
                <DashboardSection
                  isDelegateAccount={isDelegateAccount}
                  onSectionChange={setActiveSection}
                />

                <div className="mt-6">
                  <h3 className="text-lg font-semibold">Your registrations</h3>
                  <div className="mt-4">
                    <RegistrationsList
                      registrations={registrations}
                      onEdit={(id) => {
                        setEditingRegistrationId(id)
                        setActiveSection('register')
                      }}
                      onCreate={() => {
                        setEditingRegistrationId(null)
                        setActiveSection('register')
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* registration form */}
            {activeSection === 'register' && (
              <div className="space-y-6">
                <RegistrationEditor
                  registrationId={editingRegistrationId}
                  events={events}
                  institutions={institutions}
                  registeredBy={user?.id || ''}
                  showDelegateManagement={false}
                  onSaved={() => {
                    refetch()
                    setActiveSection('dashboard')
                  }}
                />
              </div>
            )}

            {activeSection === 'delegations' && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <h3 className="text-lg font-semibold text-white">Delegation Management</h3>
                  <p className="mt-1 text-sm text-white/70">
                    Select a registration, then add delegates and continue to payment.
                  </p>
                </div>

                {regsLoading ? (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
                    Loading registrations...
                  </div>
                ) : registrations.length === 0 ? (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
                    No registrations found. Create one first in Register.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {(registrations as UserRegistration[]).map((reg) => {
                      const isActive = String(activeDelegationRegistrationId) === String(reg.id)

                      return (
                        <button
                          key={reg.id}
                          type="button"
                          onClick={() => setActiveDelegationRegistrationId(reg.id)}
                          className={`w-full cursor-pointer rounded-2xl border p-4 text-left transition ${
                            isActive
                              ? 'border-[#85c226]/70 bg-[#85c226]/10'
                              : 'border-white/10 bg-white/5 hover:border-white/20'
                          }`}
                        >
                          <p className="text-sm font-semibold text-white">
                            {reg.registrationNumber || `#${reg.id}`}
                          </p>

                          <p className="text-xs text-white/70">{reg.event?.title || 'Event'}</p>
                        </button>
                      )
                    })}
                  </div>
                )}

                {activeDelegationRegistrationId && (
                  <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-semibold text-white">Delegates</h4>

                        <p className="mt-1 text-sm text-white/70">
                          {loadingDelegates
                            ? 'Loading delegates...'
                            : `${delegates.length} delegate${delegates.length === 1 ? '' : 's'}`}
                        </p>
                      </div>

                      <Button
                        onClick={startPaymentForRegistration}
                        disabled={loadingDelegates || delegates.length === 0}
                      >
                        Start payment
                      </Button>
                    </div>

                    <DelegatesManager registrationId={activeDelegationRegistrationId} />
                  </div>
                )}
              </div>
            )}

            {/* delegation registration */}
          </div>
        </div>
      </div>
    </div>
  )
}
