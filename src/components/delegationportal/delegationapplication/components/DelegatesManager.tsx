import React, { useState } from 'react'
import DelegateForm from '../DelegateForm'
import { Button } from '@/components/ui/button'
import { useDelegates } from '../../hooks/useDelegates'
import { DelegateData } from '@/types/registrationTypes'

interface DelegatesManagerProps {
  registrationId?: string | number
}

export default function DelegatesManager({ registrationId }: DelegatesManagerProps) {
  const { delegates = [], loadingDelegates, refetchDelegates } = useDelegates(registrationId)

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<DelegateData | null>(null)

  function normalizeDelegate(
    delegate: Partial<DelegateData> & { id?: string | number },
  ): DelegateData {
    return {
      ...delegate,
      id: delegate.id ?? '',
      fullName: delegate?.fullName ?? '',
      gender: delegate?.gender ?? '',
      gradeLevel: delegate?.gradeLevel ?? '',
      email: delegate?.email ?? '',
      phoneNumber: delegate?.phoneNumber ?? '',
    } as DelegateData
  }

  const handleClose = () => {
    setOpen(false)
    setEditing(null)
  }

  const handleSaved = () => {
    refetchDelegates()
    handleClose()
  }

  return (
    <div>
      <div className="space-y-2">
        {loadingDelegates ? (
          <div className="p-4 text-sm text-white/70">Loading delegates...</div>
        ) : delegates.length === 0 ? (
          <div className="rounded-xl border border-white/15 bg-white/5 p-4 text-sm text-white/70">
            No delegates added yet. Click Add delegate to register your first delegate.
          </div>
        ) : (
          delegates.map((d, index) => (
            <div key={d.id ?? index} className="flex items-center justify-between p-2">
              <div>
                <div className="text-sm text-white">{d.fullName}</div>
                <div className="text-xs text-white/70">
                  {[d.gradeLevel, d.email, d.phoneNumber].filter(Boolean).join(' • ')}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setEditing(normalizeDelegate(d))
                    setOpen(true)
                  }}
                >
                  Edit
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-3">
        <Button
          onClick={() => {
            setEditing(null)
            setOpen(true)
          }}
        >
          Add delegate
        </Button>
      </div>

      <DelegateForm
        open={open}
        delegate={editing}
        onClose={handleClose}
        onSaved={handleSaved}
        registrationId={registrationId}
      />
    </div>
  )
}
