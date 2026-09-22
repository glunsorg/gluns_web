'use client'

import React, { useEffect, useState } from 'react'
import {
  Globe,
  Pencil,
  FileText,
  Users,
  CheckCircle2,
  XCircle,
  Plus,
  ShieldAlert,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Loading from '@/app/(frontend)/loading'
import AssignmentFormModal from './AssignmentForm'
import { apiFetch } from '@/app/utils/apiFetch'
import { CommitteeAssignment } from '@/app/types/types'
import ViewPaperModal from './components/ViewPaperModal'

interface Props {
  delegationId: number
  delegates: Array<{
    id: number
    firstName: string
    lastName: string
  }>
  paymentStatus: string | null
}

type AssignmentOption = {
  id: number
  title?: string
  name?: string
  committee_category?: { id?: number; name?: string } | number
}

type CountryOption = {
  id: number
  name: string
  code?: string
}

export default function CountryAssignmentsForm({ delegationId, delegates, paymentStatus }: Props) {
  const [assignments, setAssignments] = useState<CommitteeAssignment[]>([])
  const [categories, setCategories] = useState<Array<{ id: number; name: string }>>([])
  const [committees, setCommittees] = useState<AssignmentOption[]>([])
  const [countries, setCountries] = useState<CountryOption[]>([])
  const [loading, setLoading] = useState(true)
  const [editingAssignment, setEditingAssignment] = useState<CommitteeAssignment | null>(null)
  const [viewingPaper, setViewingPaper] = useState<{
    url: string
    title?: string
  } | null>(null)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [selectedCommitteeId, setSelectedCommitteeId] = useState('')
  const [selectedCountryId, setSelectedCountryId] = useState('')
  const [selectedDelegateIds, setSelectedDelegateIds] = useState<string[]>(['', ''])

  const fetchAssignments = async () => {
    setLoading(true)
    try {
      const [assignmentRes, optionsRes] = await Promise.all([
        apiFetch(`/api/comm/committee-assignments?delegationId=${delegationId}`),
        apiFetch('/api/comm/assignment-options'),
      ])

      if (!assignmentRes.ok) throw new Error('Failed to fetch assignments')
      if (!optionsRes.ok) throw new Error('Failed to fetch assignment options')

      const assignmentData = await assignmentRes.json()
      const optionsData = await optionsRes.json()

      setAssignments(assignmentData.assignments)
      setCategories(optionsData.categories || [])
      setCommittees(optionsData.committees || [])
      setCountries(optionsData.countries || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAssignments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delegationId])

  const usedCountryIds = new Set(assignments.map((assignment) => String(assignment.country.id)))
  const usedDelegateIds = new Set(
    assignments.flatMap((assignment) =>
      assignment.delegates.map((delegate) => String(delegate.id)),
    ),
  )

  const availableDelegates = delegates.filter(
    (delegate) => !usedDelegateIds.has(String(delegate.id)),
  )

  const selectedCategory = categories.find((category) => String(category.id) === selectedCategoryId)
  const isGeneralAssembly =
    !!selectedCategory && /general assembly|\bga\b/i.test(selectedCategory.name.trim())

  const filteredCommittees = committees.filter((committee) => {
    const categoryId =
      typeof committee.committee_category === 'object'
        ? committee.committee_category?.id
        : committee.committee_category
    return String(categoryId) === selectedCategoryId
  })

  const filteredCountries = countries.filter(
    (country) =>
      !usedCountryIds.has(String(country.id)) || String(country.id) === selectedCountryId,
  )

  const resetCommitteeAndCountry = () => {
    setSelectedCommitteeId('')
    setSelectedCountryId('')
  }

  const createAssignment = async () => {
    setFormError(null)

    const delegatesForAssignment = selectedDelegateIds.filter(Boolean)

    if (!selectedCategoryId || !selectedCommitteeId) {
      setFormError('Choose an organ and committee before creating an assignment.')
      return
    }

    if (!delegatesForAssignment.length) {
      setFormError('Select at least one delegate for this assignment.')
      return
    }

    if (!isGeneralAssembly) {
      setFormError('Countries can only be selected for General Assembly assignments.')
      return
    }

    if (!selectedCountryId) {
      setFormError('Select a country for this GA assignment.')
      return
    }

    setSaving(true)
    try {
      const res = await apiFetch('/api/comm/committee-assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          delegation: delegationId,
          delegates: delegatesForAssignment.map(Number),
          committee: Number(selectedCommitteeId),
          country: Number(selectedCountryId),
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message || 'Failed to create assignment')
      }

      const data = await res.json()
      setAssignments((prev) => [data.assignment, ...prev])
      setSelectedDelegateIds(['', ''])
      resetCommitteeAndCountry()
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Failed to create assignment')
    } finally {
      setSaving(false)
    }
  }

  const handleSaved = (updated: CommitteeAssignment) => {
    setAssignments((prev) => prev.map((a) => (a.id === updated.id ? updated : a)))
    setEditingAssignment(null)
  }

  useEffect(() => {
    if (editingAssignment) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [editingAssignment])

  if (loading) return <Loading />

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-white/10 bg-[#07131f] p-6 text-white shadow-[0_18px_60px_rgba(0,0,0,0.24)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.35em] text-white/45">Assignments</p>
            <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">Build committee assignments</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/70 sm:text-base">
              Choose an organ, select a committee, and assign delegates. General Assembly is the
              only path where countries are selected directly in the portal.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[420px]">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.3em] text-white/40">Payment</p>
              <p className="mt-1 text-sm font-semibold text-white">
                {paymentStatus === 'paid' ? 'Paid' : 'Pending'}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.3em] text-white/40">Delegates</p>
              <p className="mt-1 text-sm font-semibold text-white">{availableDelegates.length}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.3em] text-white/40">Assignments</p>
              <p className="mt-1 text-sm font-semibold text-white">{assignments.length}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-[#104179]/15 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#104179]/50">
                Create assignment
              </p>
              <h3 className="mt-1 text-2xl font-bold text-[#104179]">
                Organ, committee, and country
              </h3>
            </div>
            <div className="rounded-2xl bg-[#104179]/5 px-4 py-2 text-sm font-semibold text-[#104179]">
              {isGeneralAssembly ? 'GA country selection enabled' : 'Country locked by secretariat'}
            </div>
          </div>

          {paymentStatus !== 'paid' && (
            <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              Assignments should be created after payment is complete.
            </div>
          )}

          {formError && (
            <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              {formError}
            </div>
          )}

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#104179]">Organ</label>
              <select
                value={selectedCategoryId}
                onChange={(e) => {
                  setSelectedCategoryId(e.target.value)
                  resetCommitteeAndCountry()
                }}
                className="w-full rounded-2xl border border-[#104179]/15 px-4 py-3 text-[#104179] outline-none transition focus:border-[#85c226]"
                title="Select organ"
              >
                <option value="">Select organ</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#104179]">Committee</label>
              <select
                value={selectedCommitteeId}
                onChange={(e) => setSelectedCommitteeId(e.target.value)}
                className="w-full rounded-2xl border border-[#104179]/15 px-4 py-3 text-[#104179] outline-none transition focus:border-[#85c226]"
                title="Select committee"
                disabled={!selectedCategoryId}
              >
                <option value="">Select committee</option>
                {filteredCommittees.map((committee) => (
                  <option key={committee.id} value={committee.id}>
                    {(committee.title || committee.name) ?? 'Committee'}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-[#104179]">Delegate 1</label>
              <select
                value={selectedDelegateIds[0]}
                onChange={(e) => setSelectedDelegateIds((prev) => [e.target.value, prev[1] || ''])}
                className="w-full rounded-2xl border border-[#104179]/15 px-4 py-3 text-[#104179] outline-none transition focus:border-[#85c226]"
                title="Select delegate 1"
                disabled={!availableDelegates.length}
              >
                <option value="">Select delegate</option>
                {availableDelegates.map((delegate) => (
                  <option key={delegate.id} value={delegate.id}>
                    {delegate.firstName} {delegate.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-[#104179]">Delegate 2</label>
              <select
                value={selectedDelegateIds[1]}
                onChange={(e) => setSelectedDelegateIds((prev) => [prev[0] || '', e.target.value])}
                className="w-full rounded-2xl border border-[#104179]/15 px-4 py-3 text-[#104179] outline-none transition focus:border-[#85c226]"
                title="Select delegate 2"
                disabled={availableDelegates.length < 2}
              >
                <option value="">Optional second delegate</option>
                {availableDelegates.map((delegate) => (
                  <option key={delegate.id} value={delegate.id}>
                    {delegate.firstName} {delegate.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2 rounded-2xl border border-[#104179]/15 bg-[#104179]/5 p-4">
              <div className="flex items-start gap-3">
                <ShieldAlert className="mt-0.5 h-5 w-5 text-[#85c226]" />
                <div className="space-y-2 text-sm text-[#104179]/75">
                  <p>
                    {isGeneralAssembly
                      ? 'General Assembly lets the portal assign a country directly. Countries are shown once and removed from the available list after use.'
                      : 'ICJ and ILC do not allow country selection here. The country is handled by the secretariat after committee approval.'}
                  </p>
                </div>
              </div>
            </div>

            {isGeneralAssembly && (
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-[#104179]">Country</label>
                <select
                  value={selectedCountryId}
                  onChange={(e) => setSelectedCountryId(e.target.value)}
                  className="w-full rounded-2xl border border-[#104179]/15 px-4 py-3 text-[#104179] outline-none transition focus:border-[#85c226]"
                  title="Select country"
                  disabled={!filteredCountries.length}
                >
                  <option value="">Select country</option>
                  {filteredCountries.map((country) => (
                    <option key={country.id} value={country.id}>
                      {country.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-[#104179]/60">
                  Each country is used once per delegation unless you edit it later.
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              onClick={createAssignment}
              disabled={
                saving ||
                paymentStatus !== 'paid' ||
                !availableDelegates.length ||
                !isGeneralAssembly
              }
              className="inline-flex items-center gap-2 rounded-2xl bg-[#85c226] px-5 py-3 font-semibold text-white transition hover:bg-[#104179] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              {saving ? 'Creating...' : 'Create assignment'}
            </Button>
            {!isGeneralAssembly && (
              <div className="flex items-center rounded-2xl border border-[#104179]/15 bg-[#104179]/5 px-4 py-3 text-sm text-[#104179]/75">
                Select GA to unlock country choice and assignment creation.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-[#104179]/15 bg-[#104179]/5 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#104179] text-white">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#104179]">Assignment rules</h3>
              <p className="text-sm text-[#104179]/70">
                Designed for individual and group registration
              </p>
            </div>
          </div>

          <ul className="mt-5 space-y-3 text-sm text-[#104179]/75">
            <li className="flex gap-3">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#85c226]" /> GA supports country
              selection inside the portal.
            </li>
            <li className="flex gap-3">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#85c226]" /> ICJ and ILC stay
              country-locked until the secretariat assigns them.
            </li>
            <li className="flex gap-3">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#85c226]" /> Countries are removed from
              the available list after they are used in this delegation.
            </li>
            <li className="flex gap-3">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#85c226]" /> Use one delegate for solo
              registration or two for a double delegation.
            </li>
          </ul>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-2xl border-2 border-[#104179]/20 bg-[#104179]/5 p-6">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#85c226]">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-bold text-[#104179]">Position Papers</h3>
          </div>
          <p className="text-sm text-[#104179]/70">
            Upload your position papers for each committee assignment
          </p>
        </div>
        <div className="rounded-2xl border-2 border-[#104179]/20 bg-[#104179]/5 p-6">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#85c226]">
              <Users className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-bold text-[#104179]">Delegations</h3>
          </div>
          <p className="text-sm text-[#104179]/70">Manage single or double delegate assignments</p>
        </div>
        <div className="rounded-2xl border-2 border-[#104179]/20 bg-[#104179]/5 p-6">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#85c226]">
              <Globe className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-bold text-[#104179]">Countries</h3>
          </div>
          <p className="text-sm text-[#104179]/70">
            View your assigned countries for each committee
          </p>
        </div>
      </section>

      <section className="hidden overflow-hidden rounded-3xl border border-[#104179]/15 bg-white shadow-lg lg:block">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#104179]/20">
            <thead className="bg-[#104179]">
              <tr>
                <th className="border-r border-white/20 px-6 py-4 text-left text-sm font-bold text-white">
                  Committee
                </th>
                <th className="border-r border-white/20 px-6 py-4 text-left text-sm font-bold text-white">
                  Delegate 1
                </th>
                <th className="border-r border-white/20 px-6 py-4 text-left text-sm font-bold text-white">
                  Delegate 2
                </th>
                <th className="border-r border-white/20 px-6 py-4 text-left text-sm font-bold text-white">
                  Double Delegation
                </th>
                <th className="border-r border-white/20 px-6 py-4 text-left text-sm font-bold text-white">
                  Country
                </th>
                <th className="border-r border-white/20 px-6 py-4 text-left text-sm font-bold text-white">
                  Position Paper
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-white">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#104179]/10">
              {assignments.length ? (
                assignments.map((assignment) => {
                  const paper = assignment.positionPaper
                  return (
                    <tr key={assignment.id} className="hover:bg-[#104179]/5 transition-colors">
                      <td className="border-r border-[#104179]/10 px-6 py-4 font-semibold text-[#104179]">
                        {assignment.committee.title}
                      </td>
                      <td className="border-r border-[#104179]/10 px-6 py-4 text-[#104179]">
                        {assignment.delegates[0]
                          ? `${assignment.delegates[0].firstName} ${assignment.delegates[0].lastName}`
                          : '—'}
                      </td>
                      <td className="border-r border-[#104179]/10 px-6 py-4 text-[#104179]">
                        {assignment.delegates[1]
                          ? `${assignment.delegates[1].firstName} ${assignment.delegates[1].lastName}`
                          : '—'}
                      </td>
                      <td className="border-r border-[#104179]/10 px-6 py-4">
                        {assignment.seatType === 'double' ? (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-[#85c226]/10 px-3 py-1 text-sm font-semibold text-[#85c226]">
                            <CheckCircle2 className="h-4 w-4" />
                            Yes
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-[#104179]/10 px-3 py-1 text-sm font-semibold text-[#104179]">
                            <XCircle className="h-4 w-4" />
                            No
                          </span>
                        )}
                      </td>
                      <td className="border-r border-[#104179]/10 px-6 py-4 font-medium text-[#104179]">
                        {assignment.country.name}
                      </td>
                      <td className="border-r border-[#104179]/10 px-6 py-4">
                        {paper ? (
                          <button
                            onClick={() =>
                              setViewingPaper({
                                url: paper.url,
                                title: paper.filename ?? 'Position Paper',
                              })
                            }
                            className="inline-flex items-center gap-2 font-semibold text-[#85c226] hover:text-[#104179]"
                          >
                            <FileText className="h-4 w-4" />
                            View Paper
                          </button>
                        ) : (
                          <span className="text-sm text-[#104179]/50">Not Uploaded</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Button
                          onClick={() => setEditingAssignment(assignment)}
                          className="inline-flex items-center gap-2 rounded-lg bg-[#85c226] px-4 py-2 font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-[#104179]"
                        >
                          <Pencil className="h-4 w-4" />
                          Edit
                        </Button>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#104179]/10">
                        <Globe className="h-8 w-8 text-[#104179]/50" />
                      </div>
                      <p className="text-lg text-[#104179]/70">No committee assignments found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4 lg:hidden">
        {assignments.length ? (
          assignments.map((assignment) => {
            const paper = assignment.positionPaper
            return (
              <div
                key={assignment.id}
                className="overflow-hidden rounded-2xl border-2 border-[#104179]/20 bg-white shadow-lg"
              >
                <div className="border-b-4 border-[#85c226] bg-[#104179] px-6 py-4">
                  <h3 className="text-lg font-bold text-white">{assignment.committee.title}</h3>
                </div>
                <div className="space-y-4 p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#85c226]/10 shrink-0">
                      <Globe className="h-5 w-5 text-[#85c226]" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#104179]/60">Country</p>
                      <p className="font-bold text-[#104179]">{assignment.country.name}</p>
                    </div>
                  </div>
                  <div className="rounded-xl bg-[#104179]/5 p-4">
                    <p className="mb-3 text-sm font-bold text-[#104179]">Delegates</p>
                    <div className="space-y-2 text-sm text-[#104179]">
                      <p>
                        {assignment.delegates[0]
                          ? `${assignment.delegates[0].firstName} ${assignment.delegates[0].lastName}`
                          : 'Not Assigned'}
                      </p>
                      <p>
                        {assignment.delegates[1]
                          ? `${assignment.delegates[1].firstName} ${assignment.delegates[1].lastName}`
                          : 'Not Assigned'}
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 border-t-2 border-[#104179]/10">
                    <p className="mb-2 text-sm font-semibold text-[#104179]/70">Position Paper</p>
                    {paper ? (
                      <button
                        onClick={() =>
                          setViewingPaper({
                            url: paper.url,
                            title: paper.filename ?? 'Position Paper',
                          })
                        }
                        className="inline-flex items-center gap-2 font-semibold text-[#85c226] hover:text-[#104179]"
                      >
                        <FileText className="h-4 w-4" />
                        View Paper
                      </button>
                    ) : (
                      <span className="text-sm text-[#104179]/50">Not Uploaded</span>
                    )}
                  </div>
                  <Button
                    onClick={() => setEditingAssignment(assignment)}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#85c226] py-3 font-bold text-white transition-all duration-300 hover:scale-105 hover:bg-[#104179]"
                  >
                    <Pencil className="h-5 w-5" />
                    Edit Assignment
                  </Button>
                </div>
              </div>
            )
          })
        ) : (
          <div className="rounded-2xl border-2 border-[#104179]/20 bg-white p-12 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#104179]/10">
              <Globe className="h-10 w-10 text-[#104179]/50" />
            </div>
            <p className="text-lg text-[#104179]/70">No committee assignments found.</p>
          </div>
        )}
      </section>

      {viewingPaper ? (
        <ViewPaperModal
          url={viewingPaper.url}
          title={viewingPaper.title}
          onClose={() => setViewingPaper(null)}
        />
      ) : null}

      {editingAssignment ? (
        <AssignmentFormModal
          assignment={editingAssignment}
          onClose={() => setEditingAssignment(null)}
          onSaved={handleSaved}
        />
      ) : null}
    </div>
  )
}
