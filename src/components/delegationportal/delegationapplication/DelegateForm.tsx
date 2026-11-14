/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/app/store/authStore'
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  UserPlus,
  Save,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react'
import { DelegateData } from '@/types/registrationTypes'

type Props = {
  open: boolean
  delegate: DelegateData | null
  onClose: () => void
  onSaved: (delegate: DelegateData) => void
  registrationId?: string | number | null
  batchId?: string | number | null
  isIndividual?: boolean
}

type Option = {
  id: string | number
  name: string
  maxCapacity?: number | null
  remainingCapacity?: number | null
}

function relationshipId(value: unknown): string {
  if (typeof value === 'object' && value !== null && 'id' in value) {
    return String(value.id)
  }

  return value == null ? '' : String(value)
}

export default function DelegateForm({
  open,
  delegate,
  onClose,
  onSaved,
  registrationId,
  batchId, // 1. Fixed: destructure batchId from props
}: Props) {
  const { setUser } = useAuthStore()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    fullName: '',
    gender: '',
    gradeLevel: '',
    email: '',
    phoneNumber: '',
    organ: '',
    committee: '',
  })
  const [organs, setOrgans] = useState<Option[]>([])
  const [committees, setCommittees] = useState<Option[]>([])
  const [loadingOptions, setLoadingOptions] = useState(false)

  const gradeOptions = Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`)

  useEffect(() => {
    if (open) {
      if (delegate) {
        setFormData({
          fullName: delegate.fullName ?? '',
          gender: delegate.gender ?? '',
          gradeLevel: delegate.gradeLevel ?? '',
          email: delegate.email ?? '',
          phoneNumber: delegate.phoneNumber ?? (delegate as any).phone ?? '',
          organ: relationshipId(delegate.organ),
          committee: relationshipId(delegate.committee),
        })
      } else {
        setFormData({
          fullName: '',
          gender: '',
          gradeLevel: '',
          email: '',
          phoneNumber: '',
          organ: '',
          committee: '',
        })
      }
      setError(null)
    }
  }, [delegate, open, registrationId])

  useEffect(() => {
    if (!open) return

    const loadOrgans = async () => {
      setLoadingOptions(true)
      try {
        const organId = relationshipId(delegate?.organ)
        const response = await fetch(
          organId
            ? `/api/delegate-options?organId=${encodeURIComponent(organId)}&registrationId=${encodeURIComponent(String(registrationId ?? ''))}&delegateId=${encodeURIComponent(String(delegate?.id ?? ''))}`
            : `/api/delegate-options?registrationId=${encodeURIComponent(String(registrationId ?? ''))}&delegateId=${encodeURIComponent(String(delegate?.id ?? ''))}`,
          { cache: 'no-store' },
        )
        const data = await response.json()
        if (!response.ok) throw new Error(data.message || 'Failed to load organ options')
        setOrgans(data.organs ?? [])
        setCommittees(data.committees ?? [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load organ options')
      } finally {
        setLoadingOptions(false)
      }
    }

    loadOrgans()
  }, [delegate, open, registrationId])

  const loadCommittees = async (organId: string) => {
    if (!organId) {
      setCommittees([])
      return
    }

    try {
      const response = await fetch(
        `/api/delegate-options?organId=${encodeURIComponent(organId)}&registrationId=${encodeURIComponent(String(registrationId ?? ''))}&delegateId=${encodeURIComponent(String(delegate?.id ?? ''))}`,
        { cache: 'no-store' },
      )
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Failed to load committees')
      setCommittees(data.committees ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load committees')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
    setError(null)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.organ) {
      setError('Please select an organ before choosing a committee.')
      return
    }

    if (committees.length > 0 && !formData.committee) {
      setError('Please select a committee.')
      return
    }

    setSaving(true)

    try {
      const method = delegate?.id ? 'PATCH' : 'POST'

      const url = delegate?.id ? `/api/teacher/delegates/${delegate.id}` : '/api/teacher/delegates'

      if (!delegate?.id && registrationId == null) {
        throw new Error('Registration ID is missing')
      }

      const bodyToSend = {
        ...formData,

        ...(registrationId != null ? { registration: Number(registrationId) } : {}),

        ...(batchId != null ? { batch: Number(batchId) } : {}),
        ...(formData.organ ? { organ: Number(formData.organ) } : { organ: null }),
        ...(formData.committee ? { committee: Number(formData.committee) } : { committee: null }),
      }

      console.log('Creating delegate with:', bodyToSend)

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyToSend),
      })

      if (res.status === 401) {
        setUser(null)
        return
      }

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Failed to save delegate')
      }

      onSaved(data)
    } catch (err: any) {
      setError(err.message || 'Failed to save delegate')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] p-0 gap-0 border-2 border-[#104179]/20 overflow-hidden">
        <form onSubmit={handleSave}>
          {/* Header */}
          <div className="bg-[#07131f] px-6 py-5 border-b-4 border-[#85c226]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#85c226] rounded-sm flex items-center justify-center">
                  {delegate ? (
                    <User className="w-6 h-6 text-white" />
                  ) : (
                    <UserPlus className="w-6 h-6 text-white" />
                  )}
                </div>
                <div>
                  <DialogTitle className="text-xl font-semibold text-white">
                    {delegate ? 'Edit Delegate' : 'Add New Delegate'}
                  </DialogTitle>
                  <DialogDescription className="text-white/70 text-sm">
                    {delegate
                      ? "Update your delegate's information below"
                      : 'Fill in the details to add a new delegate'}
                  </DialogDescription>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 overflow-y-auto flex-1">
            {/* Error Alert */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-900 text-sm">Error</p>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div className="space-y-2">
                <Label
                  htmlFor="firstName"
                  className="flex items-center gap-2 text-sm font-bold text-[#104179]"
                >
                  <User className="w-4 h-4 text-[#85c226]" />
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName} // Using fullName for the input
                  onChange={handleChange}
                  placeholder="Enter the delegate's full name"
                  required
                  disabled={saving}
                  className="border-2 border-[#104179]/20 focus:border-[#85c226] h-12 rounded-xl text-[#104179] placeholder:text-[#104179]/40"
                />
              </div>

              {/* gender */}
              <div className="space-y-2">
                <Label
                  htmlFor="gender"
                  className="flex items-center gap-2 text-sm font-bold text-[#104179]"
                >
                  <User className="w-4 h-4 text-[#85c226]" />
                  Gender
                </Label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  title="Select gender"
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, gender: e.target.value }))
                    setError(null)
                  }}
                  required
                  disabled={saving}
                  className="w-full border-2 border-[#104179]/20 focus:border-[#85c226] focus:outline-none h-12 rounded-xl text-[#104179] px-4 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="" disabled>
                    Select gender
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="flex items-center gap-2 text-sm font-bold text-[#104179]"
                >
                  <Mail className="w-4 h-4 text-[#85c226]" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter the delegate's email"
                  required
                  disabled={saving}
                  className="border-2 border-[#104179]/20 focus:border-[#85c226] h-12 rounded-xl text-[#104179] placeholder:text-[#104179]/40"
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label
                  htmlFor="phoneNumber"
                  className="flex items-center gap-2 text-sm font-bold text-[#104179]"
                >
                  <Phone className="w-4 h-4 text-[#85c226]" />
                  Phone Number
                </Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter the delegate's phone number"
                  required
                  disabled={saving}
                  className="border-2 border-[#104179]/20 focus:border-[#85c226] h-12 rounded-xl text-[#104179] placeholder:text-[#104179]/40"
                />
              </div>

              {/* Grade Level */}
              <div className="space-y-2 md:col-span-2">
                <Label
                  htmlFor="gradeLevel"
                  className="flex items-center gap-2 text-sm font-bold text-[#104179]"
                >
                  <GraduationCap className="w-4 h-4 text-[#85c226]" />
                  Grade Level
                </Label>
                <select
                  id="gradeLevel"
                  name="gradeLevel"
                  value={formData.gradeLevel}
                  title="Select grade level"
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, gradeLevel: e.target.value }))
                    setError(null)
                  }}
                  required
                  disabled={saving}
                  className="w-full border-2 border-[#104179]/20 focus:border-[#85c226] focus:outline-none h-12 rounded-xl text-[#104179] px-4 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="" disabled>
                    Select grade level
                  </option>
                  {gradeOptions.map((grade) => (
                    <option key={grade} value={grade}>
                      {grade}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="organ" className="text-sm font-bold text-[#104179]">
                  Organ <span className="text-red-500">*</span>
                </Label>
                <select
                  id="organ"
                  value={formData.organ}
                  onChange={(e) => {
                    const organ = e.target.value
                    setFormData((prev) => ({ ...prev, organ, committee: '' }))
                    setCommittees([])
                    setError(null)
                    void loadCommittees(organ)
                  }}
                  disabled={saving || loadingOptions}
                  required
                  className="w-full border-2 border-[#104179]/20 focus:border-[#85c226] focus:outline-none h-12 rounded-xl text-[#104179] px-4 bg-white disabled:opacity-50"
                >
                  <option value="">Select an organ</option>
                  {organs.map((organ) => (
                    <option key={organ.id} value={organ.id}>
                      {organ.name}
                    </option>
                  ))}
                </select>
              </div>

              {formData.organ && committees.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="committee" className="text-sm font-bold text-[#104179]">
                    Committee <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="committee"
                    value={formData.committee}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, committee: e.target.value }))
                      setError(null)
                    }}
                    disabled={saving || loadingOptions}
                    required
                    className="w-full border-2 border-[#104179]/20 focus:border-[#85c226] focus:outline-none h-12 rounded-xl text-[#104179] px-4 bg-white disabled:opacity-50"
                  >
                    <option value="">Select a committee</option>
                    {committees.map((committee) => (
                      <option key={committee.id} value={committee.id}>
                        {committee.name}
                        {committee.maxCapacity != null
                          ? ` (${committee.remainingCapacity} of ${committee.maxCapacity} places left)`
                          : ' (no capacity limit)'}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {formData.organ && committees.length === 0 && !loadingOptions && (
              <p className="text-sm text-[#104179]/70">
                This organ does not currently have committees available for selection.
              </p>
            )}

            {formData.organ && committees.some((committee) => committee.maxCapacity) && (
              <p className="text-sm text-[#104179]/70">
                Capacity limits are set for this event. The maximum shown beside a committee is
                the number of delegates GLUNS can place in that committee.
              </p>
            )}

            {/* Info Box */}
            <div className="bg-[#104179]/5 border-2 border-[#104179]/20 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#85c226] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#104179] text-sm mb-1">Required Information</p>
                  <p className="text-xs text-[#104179]/70">
                    All fields are required to complete the delegate registration. Ensure all
                    information is accurate before saving.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <DialogFooter className="bg-[#104179]/5 px-6 py-4 border-t-2 border-[#104179]/10 flex-row justify-end gap-3 sm:gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={saving}
              className="border-2 border-[#104179]/20 text-[#104179] hover:bg-[#104179]/5 rounded-xl h-11 px-6 font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="bg-[#85c226] hover:bg-[#104179] text-white rounded-xl h-11 px-6 font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Saving...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  {delegate ? 'Update Delegate' : 'Add Delegate'}
                </span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
