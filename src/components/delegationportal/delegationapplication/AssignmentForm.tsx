'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { apiFetch } from '@/app/utils/apiFetch'
import { CommitteeAssignment } from '@/app/types/types'
import { Upload, X, FileText, AlertCircle, CheckCircle2, Paperclip } from 'lucide-react'

interface Props {
  assignment: CommitteeAssignment
  onClose: () => void
  onSaved: (updated: CommitteeAssignment) => void
}

export default function AssignmentFormModal({ assignment, onClose, onSaved }: Props) {
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const primaryDelegate = assignment.delegates[0]
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError(null)
      // Auto-populate title if empty
      if (!title) {
        const fileName = selectedFile.name.replace(/\.[^/.]+$/, '') // Remove extension
        setTitle(fileName)
      }
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload')
      return
    }

    if (!title.trim()) {
      setError('Please provide a title for the position paper')
      return
    }

    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append(
        'alt',
        title || `Position Paper for ${primaryDelegate.firstName} ${primaryDelegate.lastName}`,
      )

      const uploadRes = await fetch('/api/documents', {
        method: 'POST',
        body: formData,
      })

      if (!uploadRes.ok) throw new Error('Failed to upload file')

      const uploadedDoc = await uploadRes.json()
      const docId = uploadedDoc?.doc?.id ?? uploadedDoc?.id

      if (!docId) {
        throw new Error('Upload succeeded but document ID was missing')
      }

      const patchRes = await apiFetch('/api/comm/committee-assignments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          assignmentId: assignment.id,
          positionPaper: docId,
        }),
      })

      if (!patchRes.ok) {
        const errorData = await patchRes.json()
        throw new Error(errorData.message || 'Failed to save position paper')
      }
      const updated = await patchRes.json()
      setSuccess(true)

      // Show success briefly before closing
      setTimeout(() => {
        onSaved(updated.assignment)
      }, 1000)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to upload position paper')
    } finally {
      setUploading(false)
    }
  }

  const removeFile = () => {
    setFile(null)
    setTitle('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border-2 border-[#104179]/20 animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="bg-[#104179] px-6 py-5 border-b-4 border-[#85c226] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#85c226] rounded-xl flex items-center justify-center">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Upload Position Paper</h3>
              <p className="text-white/70 text-sm">
                {assignment.committee.title} - {assignment.country.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={uploading}
            className="w-10 h-10 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors disabled:opacity-50"
          >
            <X className="w-6 h-6 text-white" />
          </button>
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

          {/* Success Alert */}
          {success && (
            <div className="bg-[#85c226]/10 border-2 border-[#85c226]/30 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#85c226] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#104179] text-sm">Success!</p>
                  <p className="text-sm text-[#104179]/80">Position paper uploaded successfully</p>
                </div>
              </div>
            </div>
          )}

          {/* Title Input */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-[#104179]">
              <FileText className="w-4 h-4 text-[#85c226]" />
              Document Title
            </label>
            <Input
              type="text"
              placeholder="e.g., Climate Change Position Paper"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={uploading}
              className="border-2 border-[#104179]/20 focus:border-[#85c226] h-12 rounded-xl text-[#104179] placeholder:text-[#104179]/40"
            />
            <p className="text-xs text-[#104179]/60">
              Provide a descriptive title for your position paper
            </p>
          </div>

          {/* File Upload Area */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-[#104179]">
              <Paperclip className="w-4 h-4 text-[#85c226]" />
              Upload File
            </label>

            {!file ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#104179]/30 rounded-xl p-8 text-center hover:border-[#85c226] hover:bg-[#104179]/5 transition-all cursor-pointer group"
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 bg-[#104179]/10 group-hover:bg-[#85c226]/10 rounded-full flex items-center justify-center transition-colors">
                    <Upload className="w-8 h-8 text-[#104179] group-hover:text-[#85c226] transition-colors" />
                  </div>
                  <div>
                    <p className="text-[#104179] font-semibold mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-[#104179]/60">PDF, DOC, or DOCX (max 10MB)</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border-2 border-[#85c226] bg-[#85c226]/5 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#85c226] rounded-lg flex items-center justify-center shrink-0">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-[#104179] truncate">{file.name}</p>
                      <p className="text-sm text-[#104179]/60">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={removeFile}
                    disabled={uploading}
                    className="w-10 h-10 rounded-lg hover:bg-red-100 flex items-center justify-center transition-colors disabled:opacity-50 shrink-0"
                  >
                    <X className="w-5 h-5 text-red-600" />
                  </button>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
              disabled={uploading}
            />

            <p className="text-xs text-[#104179]/60">
              Accepted formats: PDF, DOC, DOCX. Maximum file size: 10MB
            </p>
          </div>

          {/* Upload Instructions */}
          <div className="bg-[#104179]/5 rounded-xl p-4">
            <h5 className="font-bold text-[#104179] text-sm mb-2">Upload Guidelines:</h5>
            <ul className="space-y-1 text-sm text-[#104179]/70">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#85c226] shrink-0 mt-0.5" />
                Ensure your position paper is in PDF, DOC, or DOCX format
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#85c226] shrink-0 mt-0.5" />
                Double delegations should submit one paper for both delegates
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#85c226] shrink-0 mt-0.5" />
                Ad-Hoc Committees do not require position papers
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#104179]/5 px-6 py-4 flex items-center justify-end gap-3 border-t-2 border-[#104179]/10">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={uploading}
            className="border-2 border-[#104179]/20 text-[#104179] hover:bg-[#104179]/5 rounded-xl h-11 px-6 font-semibold"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!file || !title.trim() || uploading}
            className="bg-[#85c226] hover:bg-[#104179] text-white rounded-xl h-11 px-6 font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Uploading...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Upload Paper
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
