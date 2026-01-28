'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { apiFetch } from '@/app/utils/apiFetch'
import { CommitteeAssignment } from '@/app/types/types'

interface Props {
  assignment: CommitteeAssignment
  onClose: () => void
  onSaved: (updated: CommitteeAssignment) => void
}

export default function AssignmentFormModal({ assignment, onClose, onSaved }: Props) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  const primaryDelegate = assignment.delegates[0]

  const handleUpload = async () => {
    if (!file) return
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append(
        'alt',
        `Position Paper for ${primaryDelegate.firstName} ${primaryDelegate.lastName}`,
      )

      const uploadRes = await fetch('/api/documents', {
        method: 'POST',
        body: formData,
      })

      if (!uploadRes.ok) throw new Error('Failed to upload file')
      const uploadedDoc = await uploadRes.json()

      const patchRes = await apiFetch('/api/comm/committee-assignments', {
        method: 'PATCH',
        body: JSON.stringify({
          assignmentId: assignment.id,
          positionPaper: uploadedDoc.id,
        }),
      })

      if (!patchRes.ok) throw new Error('Failed to save position paper')

      const updated = await patchRes.json()
      onSaved(updated.assignment)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err)
      alert(err.message || 'Failed to upload position paper')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">Upload Position Paper</h3>

        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={uploading}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={!file || uploading} className="cursor-pointer">
            {uploading ? 'Uploading…' : 'Upload'}
          </Button>
        </div>
      </div>
    </div>
  )
}
