/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/app/store/authStore'
import {
  ChevronRight,
  LogOut,
  Save,
  CheckCircle,
  Clock,
  Users,
  Globe,
  FileText,
  UserPlus,
  Briefcase,
  Upload,
  Menu,
  Pencil,
  Trash2,
} from 'lucide-react'
import { Sidebar } from './Sidebar'
import DelegateForm from './DelegateForm'
import FacultyForm from './FacultyForm'
import { FacultyAdvisor } from '@/app/types/types'

type Delegation = {
  id?: string
  delegationName: string
  countryOfOrigin: string
  numberOfDelegates: number
  numberOfFacultyAdvisors: number
  previousExperience: string
  hmunExperience: string
  preferredRegions?: string
  prefersDoubleDelegations: 'yes' | 'no'
  crisisCommitteeRequests?: string
  committeeInterests: string
  status: string
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
}

export default function DelegationPortal() {
  const router = useRouter()
  const { user, logout, setUser } = useAuthStore()

  const [fetching, setFetching] = useState(true)
  const [saving, setSaving] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('application')
  const [authReady, setAuthReady] = useState(false)

  const [editingAdvisor, setEditingAdvisor] = useState<FacultyAdvisor | null>(null)
  const [showFacultyForm, setShowFacultyForm] = useState(false)

  const [delegation, setDelegation] = useState<Delegation | null>(null)
  const [formData, setFormData] = useState<Delegation>(EMPTY_DELEGATION)
  const [facultyAdvisors, setFacultyAdvisors] = useState<FacultyAdvisor[]>([])
  const maxAdvisors = formData.numberOfFacultyAdvisors
  const advisorCount = facultyAdvisors.length
  const canAddAdvisor = advisorCount < maxAdvisors

  const steps = [
    { title: 'Basic Info', icon: Users },
    { title: 'Experience', icon: FileText },
    { title: 'Preferences', icon: Globe },
  ]

  useEffect(() => {
    const hydrate = async () => {
      try {
        const res = await fetch('/api/me', { cache: 'no-store' })
        if (!res.ok) {
          setUser(null)
          return
        }
        const { user } = await res.json()
        setUser(user)
      } finally {
        setAuthReady(true)
      }
    }

    hydrate()
  }, [])

  useEffect(() => {
    if (authReady && !user) {
      router.replace('/signup')
    }
  }, [authReady, user])

  useEffect(() => {
    if (!user) {
      setFetching(false)
      return
    }

    const fetchDelegation = async () => {
      try {
        const res = await fetch('/api/delegation')

        if (res.status === 401) {
          return
        }

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
  }, [user, setUser])

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await logout()
      setDelegation(null)
      setFormData(EMPTY_DELEGATION)
      router.replace('/signup')
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

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.status === 401) {
        setUser(null)
        return
      }

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Failed to save delegation')
      }

      setDelegation(data)
      setFormData(data)
      alert('Delegation saved successfully')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (advisorId: string) => {
    try {
      const res = await fetch(`/api/faculty-advisors/${advisorId}`, {
        method: 'DELETE',
      })

      if (res.status === 200) {
        // Remove the deleted advisor from the state
        setFacultyAdvisors((prevAdvisors) =>
          prevAdvisors.filter((advisor) => advisor.id?.toString() !== advisorId),
        )
      } else if (res.status === 401) {
        console.error('Unauthorized to delete faculty advisor')
      } else {
        console.error('Failed to delete faculty advisor')
      }
    } catch (error) {
      console.error('Error deleting faculty advisor:', error)
    }
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  // get faculty advisors list from delegation id

  useEffect(() => {
    if (!user || !delegation?.id) {
      setFacultyAdvisors([])
      return
    }

    const fetchFacultyAdvisors = async () => {
      try {
        const res = await fetch('/api/faculty-advisors')

        if (res.status === 401) {
          setUser(null)
          return
        }

        const data = await res.json()

        if (Array.isArray(data.facultyAdvisors)) {
          setFacultyAdvisors(data.facultyAdvisors)
        }
      } catch (error) {
        console.error('Failed to fetch faculty advisors', error)
      }
    }

    fetchFacultyAdvisors()
  }, [user, delegation?.id, setUser])

  if (fetching) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#104179] mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your delegation...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex">
      {/* Sidebar */}
      <Sidebar
        status={formData.status}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      {/* Main Content */}
      <div className="flex-1 py-6 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Menu className="w-6 h-6 text-gray-700" />
                </button>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                    {activeSection === 'application' && 'Delegation Portal'}
                    {activeSection === 'delegates' && 'Add Delegates'}
                    {activeSection === 'advisors' && 'Faculty Advisors'}
                    {activeSection === 'assignments' && 'Country Assignments'}
                    {activeSection === 'papers' && 'Position Papers'}
                  </h1>
                  <p className="text-gray-600">
                    {activeSection === 'application' && 'Complete your delegation application'}
                    {activeSection === 'delegates' && 'Register your delegation members'}
                    {activeSection === 'advisors' && 'Add faculty advisor information'}
                    {activeSection === 'assignments' && 'View your country assignments'}
                    {activeSection === 'papers' && 'Upload your position papers'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
                  {formData.status === 'pending' ? (
                    <Clock className="w-4 h-4 text-yellow-600" />
                  ) : (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  )}
                  <span className="text-sm font-medium capitalize">{formData.status}</span>
                </div>
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    {loggingOut ? 'Logging out...' : 'Logout'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Application Section */}
          {activeSection === 'application' && (
            <>
              {/* Progress Steps */}
              <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                <div className="flex items-center justify-between">
                  {steps.map((step, index) => {
                    const Icon = step.icon
                    const isActive = currentStep === index
                    const isCompleted = currentStep > index

                    return (
                      <React.Fragment key={index}>
                        <div className="flex flex-col items-center flex-1">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                              isActive
                                ? 'bg-[#104179] text-white shadow-lg scale-110'
                                : isCompleted
                                  ? 'bg-green-600 text-white'
                                  : 'bg-gray-200 text-gray-500'
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle className="w-6 h-6" />
                            ) : (
                              <Icon className="w-6 h-6" />
                            )}
                          </div>
                          <span
                            className={`text-xs sm:text-sm font-medium text-center ${
                              isActive
                                ? 'text-[#104179]'
                                : isCompleted
                                  ? 'text-green-600'
                                  : 'text-gray-500'
                            }`}
                          >
                            {step.title}
                          </span>
                        </div>
                        {index < steps.length - 1 && (
                          <div className="flex-1 h-1 mx-2 mb-8">
                            <div
                              className={`h-full rounded transition-colors ${
                                currentStep > index ? 'bg-green-600' : 'bg-gray-200'
                              }`}
                            ></div>
                          </div>
                        )}
                      </React.Fragment>
                    )
                  })}
                </div>
              </div>

              {/* Form Content */}
              <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
                {currentStep === 0 && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Information</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Delegation Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          name="delegationName"
                          value={formData.delegationName}
                          onChange={handleChange}
                          placeholder="Enter your delegation name"
                          className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Country of Origin <span className="text-red-500">*</span>
                        </label>
                        <input
                          name="countryOfOrigin"
                          value={formData.countryOfOrigin}
                          onChange={handleChange}
                          placeholder="Enter your country"
                          className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Number of Delegates <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="numberOfDelegates"
                          value={formData.numberOfDelegates}
                          onChange={handleChange}
                          min={1}
                          className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Number of Faculty Advisors <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="numberOfFacultyAdvisors"
                          value={formData.numberOfFacultyAdvisors}
                          onChange={handleChange}
                          min={0}
                          className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Experience & Background
                      </h2>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Previous MUN Experience <span className="text-red-500">*</span>
                      </label>
                      <p className="text-sm text-gray-600 mb-2">
                        Describe your delegation{"'"}s previous experiences with Model United
                        Nations. If you don{"'"}t have any MUN experience, please describe other
                        relevant experiences such as debate, public speaking, or mock trial.
                      </p>
                      <textarea
                        name="previousExperience"
                        value={formData.previousExperience}
                        onChange={handleChange}
                        rows={5}
                        placeholder="Tell us about your experience..."
                        className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        GLUNS Experience <span className="text-red-500">*</span>
                      </label>
                      <p className="text-sm text-gray-600 mb-2">
                        Has your delegation participated in GLUNS before? If so, how many years?
                      </p>
                      <input
                        name="hmunExperience"
                        value={formData.hmunExperience}
                        onChange={handleChange}
                        placeholder="e.g., First time, 2 years, etc."
                        className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                      />
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Committee Preferences
                      </h2>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Preferred Regions
                      </label>
                      <p className="text-sm text-gray-600 mb-2">
                        Is there a type of country or region of the world in which your delegation
                        is particularly interested? (max 255 characters)
                      </p>
                      <input
                        name="preferredRegions"
                        value={formData.preferredRegions}
                        onChange={handleChange}
                        maxLength={255}
                        placeholder="e.g., Latin America, Southeast Asia, etc."
                        className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Double Delegations <span className="text-red-500">*</span>
                      </label>
                      <p className="text-sm text-gray-600 mb-2">
                        Does your delegation prefer double delegations (e.g., DISEC, SOCHUM,
                        SPECPOL, Legal Committee, UNSC)?
                      </p>
                      <select
                        name="prefersDoubleDelegations"
                        value={formData.prefersDoubleDelegations}
                        onChange={handleChange}
                        className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow bg-white"
                      >
                        <option value="yes">Yes, we prefer double delegations</option>
                        <option value="no">No, we prefer single delegations</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Crisis Committee Requests
                      </label>
                      <p className="text-sm text-gray-600 mb-2">
                        How many allocations in our Crisis Committees would your delegation like?
                        Which specific committees? (max 255 characters) Note: Allocations are
                        limited.
                      </p>
                      <textarea
                        name="crisisCommitteeRequests"
                        value={formData.crisisCommitteeRequests}
                        onChange={handleChange}
                        maxLength={255}
                        rows={3}
                        placeholder="Specify your crisis committee preferences..."
                        className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Committee Interests <span className="text-red-500">*</span>
                      </label>
                      <p className="text-sm text-gray-600 mb-2">
                        Select your interest in specialized committees. We recommend experienced
                        delegates for advanced committees and require limited/no crisis experience
                        for novice committees.
                      </p>
                      <select
                        name="committeeInterests"
                        value={formData.committeeInterests}
                        onChange={handleChange}
                        className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow bg-white"
                      >
                        <option value="advanced">Advanced Committees (AHCSG, AHCDG, UNSC)</option>
                        <option value="press">Press Corps Committee</option>
                        <option value="novice">Novice Committee (Limited/No Experience)</option>
                        <option value="spanish">Bilingual Spanish Committee</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-200">
                  <div className="flex gap-3 flex-1">
                    {currentStep > 0 && (
                      <button
                        type="button"
                        onClick={prevStep}
                        className="flex-1 sm:flex-none px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                      >
                        Previous
                      </button>
                    )}
                  </div>
                  <div className="flex gap-3">
                    {currentStep < steps.length - 1 ? (
                      <button
                        type="button"
                        onClick={nextStep}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-[#104179] text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md hover:shadow-lg"
                      >
                        Next Step
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-[#104179] text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Save className="w-4 h-4" />
                        {saving ? 'Saving...' : 'Save Delegation'}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Help Text */}
              <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-100">
                <p className="text-sm text-blue-900">
                  <span className="font-semibold">Need help?</span> All fields marked with{' '}
                  <span className="text-red-500">*</span> are required. You can save your progress
                  at any time and return later to complete your application.
                </p>
              </div>
            </>
          )}

          {/* Delegates Section */}
          {activeSection === 'delegates' && (
            <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
              <div className="text-center py-12">
                <UserPlus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Add Delegates</h3>
                <p className="text-gray-600 mb-6">
                  Register your delegation members here once your application is approved.
                </p>
                <DelegateForm />
              </div>
            </div>
          )}

          {/* Advisors Section */}
          {activeSection === 'advisors' && (
            <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
              <div className="text-center py-12">
                <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Faculty Advisors</h3>
                {/* list of faculty advisors  */}
                {facultyAdvisors.length > 0 ? (
                  <div className="mb-6">
                    <p className="text-gray-600 mb-4">
                      You have added the following faculty advisors:
                    </p>
                    <ul className="divide-y">
                      {facultyAdvisors.map((advisor) => (
                        <li
                          key={advisor.id}
                          className="flex items-center justify-between px-4 py-3 text-sm"
                        >
                          {/* Left side: info in one line */}
                          <div className="flex items-center gap-6 min-w-0">
                            <span className="font-medium text-lg text-gray-900 whitespace-nowrap">
                              {advisor.firstName} {advisor.lastName}
                            </span>

                            <span className="text-gray-600 text-lg truncate max-w-[220px]">
                              {advisor.email}
                            </span>

                            <span className="text-gray-600 text-lg whitespace-nowrap">
                              {advisor.phoneNumber}
                            </span>
                          </div>

                          {/* Right side: actions */}
                          <div className="flex gap-2 shrink-0">
                            <button
                              onClick={() => {
                                setEditingAdvisor(advisor)
                                setShowFacultyForm(true)
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                              aria-label="Edit advisor"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleDelete(advisor.id!.toString())}
                              className="p-2 text-red-600 hover:bg-red-50 rounded"
                              aria-label="Delete advisor"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-gray-600 mb-6">You have not added any faculty advisors yet.</p>
                )}
                {showFacultyForm && (
                  <FacultyForm
                    advisor={editingAdvisor}
                    onClose={() => {
                      setEditingAdvisor(null)
                      setShowFacultyForm(false)
                    }}
                    open={showFacultyForm}
                    onSaved={(updatedAdvisor) => {
                      setFacultyAdvisors((prev) => {
                        const exists = prev.find((a) => a.id === updatedAdvisor.id)

                        if (exists) {
                          // EDIT
                          return prev.map((a) => (a.id === updatedAdvisor.id ? updatedAdvisor : a))
                        }

                        // CREATE
                        return [...prev, updatedAdvisor]
                      })

                      setEditingAdvisor(null)
                      setShowFacultyForm(false)
                    }}
                  />
                )}

                {!showFacultyForm && canAddAdvisor && (
                  <button
                    onClick={() => {
                      setEditingAdvisor(null)
                      setShowFacultyForm(true)
                    }}
                    className="mt-4 px-4 py-2 bg-[#104179] text-white rounded-lg"
                  >
                    Add Faculty Advisor
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Assignments Section */}
          {activeSection === 'assignments' && (
            <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
              <div className="text-center py-12">
                <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Country Assignments</h3>
                <p className="text-gray-600">
                  Your country assignments will appear here once they are finalized by the
                  organizers.
                </p>
              </div>
            </div>
          )}

          {/* Papers Section */}
          {activeSection === 'papers' && (
            <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
              <div className="text-center py-12">
                <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Position Papers</h3>
                <p className="text-gray-600 mb-6">
                  Upload your position papers for your assigned countries and committees.
                </p>
                <button className="px-6 py-3 bg-[#104179] text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  Upload Position Paper
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
