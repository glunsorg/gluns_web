'use client'

import React, { useEffect, useState } from 'react'
import { Globe, Pencil, FileText, Users, CheckCircle2, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Loading from '@/app/(frontend)/loading'
import AssignmentFormModal from './AssignmentForm'
import { apiFetch } from '@/app/utils/apiFetch'
import { CommitteeAssignment } from '@/app/types/types'
import ViewPaperModal from './components/ViewPaperModal'

interface Props {
  delegationId: number
}

export default function CountryAssignmentsForm({ delegationId }: Props) {
  const [assignments, setAssignments] = useState<CommitteeAssignment[]>([])
  const [loading, setLoading] = useState(true)
  const [editingAssignment, setEditingAssignment] = useState<CommitteeAssignment | null>(null)
  const [viewingPaper, setViewingPaper] = useState<{
    url: string
    title?: string
  } | null>(null)

  const fetchAssignments = async () => {
    setLoading(true)
    try {
      const res = await apiFetch(`/api/comm/committee-assignments?delegationId=${delegationId}`)
      if (!res.ok) throw new Error('Failed to fetch assignments')
      const data = await res.json()
      setAssignments(data.assignments)
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
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="h-1 w-32 bg-[#85c226] mx-auto mb-6"></div>
          <p className="text-[#104179]/70 text-lg max-w-3xl mx-auto leading-relaxed">
            Click <span className="font-semibold text-[#104179]">Edit</span> to upload or replace a
            position paper. Ad-Hoc Committees do not require papers. Double delegations should
            submit one paper for both delegates.
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#104179]/5 border-2 border-[#104179]/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-[#85c226] rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-[#104179]">Position Papers</h3>
            </div>
            <p className="text-sm text-[#104179]/70">
              Upload your position papers for each committee assignment
            </p>
          </div>

          <div className="bg-[#104179]/5 border-2 border-[#104179]/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-[#85c226] rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-[#104179]">Delegations</h3>
            </div>
            <p className="text-sm text-[#104179]/70">
              Manage single or double delegate assignments
            </p>
          </div>

          <div className="bg-[#104179]/5 border-2 border-[#104179]/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-[#85c226] rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-[#104179]">Countries</h3>
            </div>
            <p className="text-sm text-[#104179]/70">
              View your assigned countries for each committee
            </p>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block bg-white border-2 border-[#104179]/20 rounded-2xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#104179]/20">
              <thead className="bg-[#104179]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white border-r border-white/20">
                    Committee
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white border-r border-white/20">
                    Delegate 1
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white border-r border-white/20">
                    Delegate 2
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white border-r border-white/20">
                    Double Delegation
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white border-r border-white/20">
                    Country
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white border-r border-white/20">
                    Position Paper
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#104179]/10">
                {assignments.length ? (
                  assignments.map((a) => {
                    const paper = a.positionPaper
                    return (
                      <tr key={a.id} className="hover:bg-[#104179]/5 transition-colors">
                        <td className="px-6 py-4 text-[#104179] font-semibold border-r border-[#104179]/10">
                          {a.committee.title}
                        </td>
                        <td className="px-6 py-4 text-[#104179] border-r border-[#104179]/10">
                          {a.delegates[0]
                            ? `${a.delegates[0].firstName} ${a.delegates[0].lastName}`
                            : '—'}
                        </td>
                        <td className="px-6 py-4 text-[#104179] border-r border-[#104179]/10">
                          {a.delegates[1]
                            ? `${a.delegates[1].firstName} ${a.delegates[1].lastName}`
                            : '—'}
                        </td>
                        <td className="px-6 py-4 border-r border-[#104179]/10">
                          {a.seatType === 'double' ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#85c226]/10 text-[#85c226] rounded-lg text-sm font-semibold">
                              <CheckCircle2 className="w-4 h-4" />
                              Yes
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#104179]/10 text-[#104179] rounded-lg text-sm font-semibold">
                              <XCircle className="w-4 h-4" />
                              No
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-[#104179] font-medium border-r border-[#104179]/10">
                          {a.country.name}
                        </td>
                        <td className="px-6 py-4 border-r border-[#104179]/10">
                          {paper ? (
                            <button
                              onClick={() =>
                                setViewingPaper({
                                  url: paper.url,
                                  title: paper.filename ?? 'Position Paper',
                                })
                              }
                              className="inline-flex items-center gap-2 cursor-pointer text-[#85c226] hover:text-[#104179] font-semibold"
                            >
                              <FileText className="w-4 h-4" />
                              View Paper
                            </button>
                          ) : (
                            <span className="text-[#104179]/50 text-sm">Not Uploaded</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <Button
                            onClick={() => setEditingAssignment(a)}
                            className="inline-flex items-center gap-2 bg-[#85c226] hover:bg-[#104179] text-white font-semibold px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105"
                          >
                            <Pencil className="w-4 h-4" />
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
                        <div className="w-16 h-16 bg-[#104179]/10 rounded-full flex items-center justify-center">
                          <Globe className="w-8 h-8 text-[#104179]/50" />
                        </div>
                        <p className="text-[#104179]/70 text-lg">No committee assignments found.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4">
          {assignments.length ? (
            assignments.map((a) => {
              const paper = a.positionPaper
              return (
                <div
                  key={a.id}
                  className="bg-white border-2 border-[#104179]/20 rounded-2xl overflow-hidden shadow-lg"
                >
                  {/* Card Header */}
                  <div className="bg-[#104179] px-6 py-4 border-b-4 border-[#85c226]">
                    <h3 className="text-lg font-bold text-white">{a.committee.title}</h3>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 space-y-4">
                    {/* Country */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#85c226]/10 rounded-lg flex items-center justify-center shrink-0">
                        <Globe className="w-5 h-5 text-[#85c226]" />
                      </div>
                      <div>
                        <p className="text-xs text-[#104179]/60 font-semibold">Country</p>
                        <p className="text-[#104179] font-bold">{a.country.name}</p>
                      </div>
                    </div>

                    {/* Delegates */}
                    <div className="bg-[#104179]/5 rounded-xl p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#85c226]" />
                        <p className="text-sm font-bold text-[#104179]">Delegates</p>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-[#104179]/60">Delegate 1</p>
                          <p className="text-sm text-[#104179] font-medium">
                            {a.delegates[0]
                              ? `${a.delegates[0].firstName} ${a.delegates[0].lastName}`
                              : 'Not Assigned'}
                          </p>
                        </div>
                        {a.seatType === 'double' && (
                          <div>
                            <p className="text-xs text-[#104179]/60">Delegate 2</p>
                            <p className="text-sm text-[#104179] font-medium">
                              {a.delegates[1]
                                ? `${a.delegates[1].firstName} ${a.delegates[1].lastName}`
                                : 'Not Assigned'}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Double Delegation Badge */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#104179]/70 font-semibold">
                        Double Delegation
                      </span>
                      {a.seatType === 'double' ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#85c226]/10 text-[#85c226] rounded-lg text-sm font-bold">
                          <CheckCircle2 className="w-4 h-4" />
                          Yes
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#104179]/10 text-[#104179] rounded-lg text-sm font-bold">
                          <XCircle className="w-4 h-4" />
                          No
                        </span>
                      )}
                    </div>

                    {/* Position Paper */}
                    <div className="pt-4 border-t-2 border-[#104179]/10">
                      <p className="text-sm text-[#104179]/70 font-semibold mb-2">Position Paper</p>
                      {paper ? (
                        <button
                          onClick={() =>
                            setViewingPaper({
                              url: paper.url,
                              title: paper.filename ?? 'Position Paper',
                            })
                          }
                          className="inline-flex items-center cursor-pointer gap-2 text-[#85c226] hover:text-[#104179] font-semibold"
                        >
                          <FileText className="w-4 h-4" />
                          View Paper
                        </button>
                      ) : (
                        <span className="text-[#104179]/50 text-sm">Not Uploaded</span>
                      )}
                    </div>

                    {/* Edit Button */}
                    <Button
                      onClick={() => setEditingAssignment(a)}
                      className="w-full inline-flex items-center justify-center gap-2 bg-[#85c226] hover:bg-[#104179] text-white font-bold py-3 rounded-xl transition-all duration-300 hover:scale-105"
                    >
                      <Pencil className="w-5 h-5" />
                      Edit Assignment
                    </Button>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="bg-white border-2 border-[#104179]/20 rounded-2xl p-12 text-center">
              <div className="w-20 h-20 bg-[#104179]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-10 h-10 text-[#104179]/50" />
              </div>
              <p className="text-[#104179]/70 text-lg">No committee assignments found.</p>
            </div>
          )}
        </div>
      </div>

      {viewingPaper && (
        <ViewPaperModal
          url={viewingPaper.url}
          title={viewingPaper.title}
          onClose={() => setViewingPaper(null)}
        />
      )}

      {/* Modal */}
      {editingAssignment && (
        <AssignmentFormModal
          assignment={editingAssignment}
          onClose={() => setEditingAssignment(null)}
          onSaved={handleSaved}
        />
      )}
    </div>
  )
}
