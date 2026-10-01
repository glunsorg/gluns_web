import React from 'react'
import { Button } from '@/components/ui/button'

type Reg = {
  id: string | number
  registrationNumber?: string
  event?: any
  registrationState?: string
}

interface Props {
  registrations: Reg[]
  onEdit: (id: string | number) => void
  onCreate: () => void
}

export default function RegistrationsList({ registrations, onEdit, onCreate }: Props) {
  return (
    <div className="space-y-4">
      {registrations.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white/70">
          No registrations yet. Start a new registration to begin.
        </div>
      ) : (
        registrations.map((r) => (
          <div
            key={r.id}
            className="rounded-2xl border border-white/10 bg-white/5 p-4 flex items-center justify-between"
          >
            <div>
              <div className="text-sm font-semibold text-white">
                {r.registrationNumber || `#${r.id}`}
              </div>
              <div className="text-xs text-white/70">{r.event?.title || 'Event'}</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-xs text-white/60">{r.registrationState || 'draft'}</div>
              <Button variant="secondary" onClick={() => onEdit(r.id)}>
                Edit
              </Button>
            </div>
          </div>
        ))
      )}

      <div className="pt-2">
        <Button onClick={onCreate}>Start new registration</Button>
      </div>
    </div>
  )
}
