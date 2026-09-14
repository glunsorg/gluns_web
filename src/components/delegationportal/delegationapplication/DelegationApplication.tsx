/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Sparkles,
  UserCircle,
} from 'lucide-react'
import { Sidebar } from './Sidebar'
import DelegateForm from './DelegateForm'
import DelegationHeader from './DelegationHeader'
import DelegationSteps from './components/DelegationSteps'
import DelegationFormStep from './components/DelegationFormStep'
import CountryAssignmentsForm from './CountryAssignmentsForm'
import { Delegate, Delegation } from '@/app/types/types'
import PaymentForm from '../payment/PaymentForm'
import { Button } from '@/components/ui/button'
import Loading from '@/app/(frontend)/loading'
import { useAuthGate } from '../hooks/useAuthGate'
import { apiFetch } from '@/app/utils/apiFetch'
import { usePaymentAndDelegate } from '../hooks/usePaymentAndDelegate'
import { AccountSettings } from './AccountSettings'

type EventOption = {
  id: number | string
  title: string
  subtitle?: string
  location?: string
  date?: string
  cost?: number | string | null
  currency?: string
}

const EMPTY_DELEGATION: Delegation = {
  delegationName: '',
  countryOfOrigin: '',
  numberOfDelegates: 1,
  numberOfFacultyAdvisors: 0,
  previousExperience: '',
  hmunExperience: '',
  preferredRegions: '',
  prefersDoubleDelegations: 'no',
  crisisCommitteeRequests: '',
  committeeInterests: 'novice',
  status: 'pending',
  country: '',
  school: '',
  delegates: [],
  facultyAdvisors: [],
}

export default function DelegationPortal() {
  const router = useRouter()

  const [fetching, setFetching] = useState(true)
  const [eventsLoading, setEventsLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('dashboard')
  const [selectedEventId, setSelectedEventId] = useState('')
  const [events, setEvents] = useState<EventOption[]>([])

  const [delegation, setDelegation] = useState<Delegation | null>(null)
  const [formData, setFormData] = useState<Delegation>(EMPTY_DELEGATION)
  const [editingDelegate, setEditingDelegate] = useState<Delegate | null>(null)
  const [showDelegateForm, setShowDelegateForm] = useState(false)

  const { user, checkingAuth, logout: authLogout } = useAuthGate()
  console.log('user details:', user)
  const isDelegateAccount = !!user?.roles?.includes('delegate')

  const steps = [
    { title: 'Event', icon: CalendarDays },
    { title: 'Profile', icon: UserCircle },
    { title: 'Preferences', icon: Sparkles },
  ]

  useEffect(() => {
    if (!checkingAuth && !user) {
      router.replace('/registration')
    }
  }, [checkingAuth, user, router])

  useEffect(() => {
    if (!user) return

    const fetchDelegation = async () => {
      try {
        const res = await apiFetch('/api/delegation')
        const data = await res.json()

        if (data.delegation) {
          setDelegation(data.delegation)
          setFormData(data.delegation)
        } else {
          setDelegation(null)
          setFormData(EMPTY_DELEGATION)
        }
      } catch (error) {
        console.error('Failed to fetch delegation', error)
      } finally {
        setFetching(false)
      }
    }

    fetchDelegation()
  }, [user])

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/events', { cache: 'no-store' })
        if (!res.ok) throw new Error('Failed to fetch events')

        const data = await res.json()
        const eventOptions = (data.events || []).map((event: any) => ({
          id: event.id,
          title: event.title,
          subtitle: event.subtitle,
          location: event.location,
          date: event.date,
          cost: event.cost,
          currency: event.currency,
        }))

        setEvents(eventOptions)

        if (!selectedEventId && eventOptions.length > 0) {
          setSelectedEventId(String(eventOptions[0].id))
        }
      } catch (error) {
        console.error('Failed to fetch events', error)
      } finally {
        setEventsLoading(false)
      }
    }

    fetchEvents()
  }, [selectedEventId])

  const {
    paymentStatus,
    delegates,
    setDelegates,
    setPaymentStatus,
    fetching: fetchingDelegates,
  } = usePaymentAndDelegate(user, delegation)

  const selectedEvent = useMemo(
    () => events.find((event) => String(event.id) === String(selectedEventId)),
    [events, selectedEventId],
  )

  const loading = fetching || fetchingDelegates || eventsLoading

  useEffect(() => {
    if (activeSection !== 'register') {
      setCurrentStep(0)
    }
  }, [activeSection])

  const refreshPaidData = async (delegationId: string | number) => {
    const paymentRes = await apiFetch(`/api/payments?delegationId=${delegationId}`)
    const paymentData = await paymentRes.json()
    setPaymentStatus(paymentData.paymentStatus)

    if (paymentData.paymentStatus === 'paid') {
      const delegatesRes = await apiFetch(`/api/teacher/delegates?delegationId=${delegationId}`)
      const delegatesData = await delegatesRes.json()
      setDelegates(delegatesData.delegates || [])
    }
  }

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await authLogout()
      router.replace('/registration')
    } finally {
      setLoggingOut(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    if (
      !formData.delegationName ||
      !formData.countryOfOrigin ||
      !formData.previousExperience ||
      !formData.hmunExperience
    ) {
      alert('Please fill in all required fields')
      return
    }

    setSaving(true)
    try {
      const method = delegation?.id ? 'PATCH' : 'POST'
      const url = delegation?.id ? `/api/delegation/${delegation.id}` : '/api/delegation'

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
      setDelegation(data)
      setFormData(data)
      alert('Delegation saved successfully')
    } catch (error: any) {
      alert(error.message)
    } finally {
      setSaving(false)
    }
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1)
  }

  if (checkingAuth || loading) {
    return <Loading />
  }

  if (!user) {
    return null
  }

  if (fetching) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0d0d0d] p-4 text-white">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-[#85c226]" />
          <p className="text-lg text-white/75">Loading your delegation...</p>
        </div>
      </div>
    )
  }

  const dashboardCards = [
    {
      title: 'Selected event',
      value: selectedEvent?.title || 'Choose an event',
      helper: selectedEvent?.location || 'Portal registration starts here',
    },
    {
      title: 'Delegates',
      value: String(delegates.length || formData.numberOfDelegates || 0),
      helper: paymentStatus === 'paid' ? 'Slots unlocked' : 'Complete payment to add delegates',
    },
    {
      title: 'Payment',
      value: paymentStatus === 'paid' ? 'Paid' : 'Pending',
      helper:
        paymentStatus === 'paid'
          ? 'Ready for delegation work'
          : 'Pay once registration is complete',
    },
  ]

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <div className="flex min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(16,65,121,0.45),transparent_38%),radial-gradient(circle_at_top_right,rgba(133,194,38,0.18),transparent_28%),linear-gradient(180deg,#0d0d0d_0%,#07131f_100%)]">
        <Sidebar
          status={formData.status}
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
              formData={formData}
              loggingOut={loggingOut}
              onLogout={handleLogout}
              onOpenSidebar={() => setSidebarOpen(true)}
              isDelegateAccount={isDelegateAccount}
            />

            {activeSection === 'dashboard' && (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  {dashboardCards.map((card) => (
                    <div
                      key={card.title}
                      className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.18)] backdrop-blur"
                    >
                      <p className="text-xs uppercase tracking-[0.35em] text-white/45">
                        {card.title}
                      </p>
                      <p className="mt-3 text-2xl font-black text-white">{card.value}</p>
                      <p className="mt-2 text-sm leading-relaxed text-white/65">{card.helper}</p>
                    </div>
                  ))}
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                  <div className="rounded-3xl border border-white/10 bg-[#07131f]/90 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.22)] backdrop-blur">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.35em] text-white/40">
                          Overview
                        </p>
                        <h2 className="mt-2 text-3xl font-black">
                          Welcome to the delegation portal
                        </h2>
                        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70">
                          Use the sidebar to move from event registration to delegation management,
                          country assignments, profile details, and account settings.
                        </p>
                      </div>
                      <div className="rounded-2xl border border-[#85c226]/20 bg-[#85c226]/10 px-4 py-3 text-sm font-semibold text-[#85c226]">
                        {isDelegateAccount ? 'Individual delegate' : 'Institution delegation'}
                      </div>
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => setActiveSection('register')}
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
                        onClick={() => setActiveSection('delegations')}
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
                          GA country selection is self-service; ICJ and ILC stay
                          secretariat-managed.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'register' && (
              <div className="space-y-6">
                <DelegationSteps steps={steps} currentStep={currentStep} />
                <DelegationFormStep
                  currentStep={currentStep}
                  formData={formData}
                  handleChange={handleChange}
                  handleSave={handleSave}
                  saving={saving}
                  stepsLength={steps.length}
                  nextStep={nextStep}
                  prevStep={prevStep}
                  isDelegateAccount={isDelegateAccount}
                  events={events}
                  selectedEventId={selectedEventId}
                  onEventChange={setSelectedEventId}
                />
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-white/70 backdrop-blur">
                  <span className="font-semibold text-white">Need help?</span>{' '}
                  {isDelegateAccount
                    ? 'This path is optimized for a single delegate. Save your progress, then continue to delegations once your account is ready.'
                    : 'Institutional registrations can return later to add multiple delegates, assign committees, and handle payment.'}
                </div>
              </div>
            )}

            {activeSection === 'delegations' && (
              <div className="space-y-6">
                <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                  <div className="rounded-3xl border border-white/10 bg-white/95 p-6 text-[#104179] shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#104179] text-white">
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">Delegation payment</h3>
                        <p className="text-sm text-[#104179]/70">
                          Payment is completed once your delegation setup is ready.
                        </p>
                      </div>
                    </div>

                    {!delegation?.id ? (
                      <div className="mt-5 rounded-2xl border border-[#104179]/15 bg-[#104179]/5 p-4 text-sm text-[#104179]/75">
                        Complete the registration tab first to create your delegation record.
                      </div>
                    ) : paymentStatus !== 'paid' ? (
                      <div className="mt-5">
                        <PaymentForm
                          numberOfDelegates={formData.numberOfDelegates}
                          teacherId={user.id}
                          delegationId={delegation.id}
                          onPaymentSuccess={async () => {
                            await refreshPaidData(delegation.id!)
                          }}
                        />
                      </div>
                    ) : (
                      <div className="mt-5 rounded-2xl border border-[#85c226]/25 bg-[#85c226]/10 p-4 text-sm text-[#104179]">
                        Payment complete. You can now manage delegates below.
                      </div>
                    )}
                  </div>

                  <div className="rounded-3xl border border-[#104179]/15 bg-[#104179]/5 p-6 text-[#104179]">
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#104179]/50">
                      Portal notes
                    </p>
                    <ul className="mt-4 space-y-3 text-sm text-[#104179]/75">
                      <li className="flex gap-3">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#85c226]" />
                        Individual delegates keep the same payment and profile flow.
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#85c226]" />
                        Institutions can add more delegates after payment is confirmed.
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#85c226]" />
                        The country assignment tab remains linked to this delegation record.
                      </li>
                    </ul>
                  </div>
                </div>

                {delegation?.id && paymentStatus === 'paid' && (
                  <div className="rounded-3xl border border-white/10 bg-[#07131f]/90 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.22)] backdrop-blur">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.35em] text-white/40">
                          Delegates
                        </p>
                        <h3 className="mt-2 text-2xl font-bold text-white">Registered delegates</h3>
                        <p className="mt-2 text-sm text-white/65">
                          Add and edit delegate profiles after payment is complete.
                        </p>
                      </div>
                      {!showDelegateForm && delegates.length < formData.numberOfDelegates && (
                        <Button
                          onClick={() => {
                            setEditingDelegate({} as Delegate)
                            setShowDelegateForm(true)
                          }}
                          className="rounded-2xl bg-[#85c226] px-5 py-3 font-semibold text-white transition hover:bg-[#104179]"
                        >
                          Add delegate
                        </Button>
                      )}
                    </div>

                    <div className="mt-6">
                      {showDelegateForm && (
                        <DelegateForm
                          open={showDelegateForm}
                          delegate={editingDelegate}
                          onClose={() => {
                            setEditingDelegate(null)
                            setShowDelegateForm(false)
                          }}
                          onSaved={(updatedDelegate) => {
                            setDelegates((prev) => {
                              const exists = prev.find((d) => d.id === updatedDelegate.id)
                              if (exists) {
                                return prev.map((d) =>
                                  d.id === updatedDelegate.id ? updatedDelegate : d,
                                )
                              }
                              return [...prev, updatedDelegate]
                            })
                            setEditingDelegate(null)
                            setShowDelegateForm(false)
                          }}
                        />
                      )}

                      {delegates.length > 0 ? (
                        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                          {delegates.map((delegate, index) => (
                            <div
                              key={delegate.id}
                              className="rounded-3xl border border-white/10 bg-white/5 p-5 text-white shadow-[0_12px_36px_rgba(0,0,0,0.18)]"
                            >
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#104179] font-bold text-white">
                                  {index + 1}
                                </div>
                                <div className="h-2.5 w-2.5 rounded-full bg-[#85c226]" />
                              </div>
                              <p className="mt-4 text-lg font-bold">
                                {delegate.firstName} {delegate.lastName}
                              </p>
                              <p className="mt-1 text-sm text-white/65">{delegate.email}</p>
                              <div className="mt-4 flex gap-2">
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setEditingDelegate(delegate)
                                    setShowDelegateForm(true)
                                  }}
                                  className="rounded-2xl border-white/20 bg-white/5 text-white hover:bg-white/10"
                                >
                                  Edit
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="mt-6 rounded-3xl border border-dashed border-white/20 bg-white/5 p-8 text-center text-white/70">
                          No delegates have been added yet.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeSection === 'assignments' && delegation?.id && (
              <CountryAssignmentsForm
                delegationId={Number(delegation.id)}
                delegates={delegates as any}
                paymentStatus={paymentStatus}
              />
            )}

            {activeSection === 'profile' && (
              <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
                <div className="rounded-3xl border border-white/10 bg-[#07131f]/90 p-6 text-white shadow-[0_18px_50px_rgba(0,0,0,0.22)] backdrop-blur">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#104179] text-[#85c226]">
                      <UserCircle className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-white/40">Profile</p>
                      <h3 className="mt-1 text-3xl font-black">Your portal profile</h3>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-white/40">Account</p>
                      <p className="mt-2 text-sm font-semibold text-white">{user.email}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-white/40">Type</p>
                      <p className="mt-2 text-sm font-semibold text-white">
                        {isDelegateAccount ? 'Individual delegate' : 'Institution account'}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-white/40">Status</p>
                      <p className="mt-2 text-sm font-semibold text-white capitalize">
                        {formData.status}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-white/40">Event</p>
                      <p className="mt-2 text-sm font-semibold text-white">
                        {selectedEvent?.title || 'No event selected yet'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-[#104179]/15 bg-white p-6 text-[#104179] shadow-[0_18px_50px_rgba(7,19,31,0.18)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#104179]/50">
                    Registration summary
                  </p>
                  <div className="mt-4 space-y-4 text-sm text-[#104179]/75">
                    <div className="rounded-2xl bg-[#104179]/5 p-4">
                      <p className="font-semibold">Delegation / school</p>
                      <p className="mt-1">{formData.delegationName || 'Not saved yet'}</p>
                    </div>
                    <div className="rounded-2xl bg-[#104179]/5 p-4">
                      <p className="font-semibold">Country of origin</p>
                      <p className="mt-1">{formData.countryOfOrigin || 'Not saved yet'}</p>
                    </div>
                    <div className="rounded-2xl bg-[#104179]/5 p-4">
                      <p className="font-semibold">Delegates requested</p>
                      <p className="mt-1">{formData.numberOfDelegates}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'account' && <AccountSettings />}
          </div>
        </div>
      </div>
    </div>
  )
}
