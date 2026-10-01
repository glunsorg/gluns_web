// src/app/portal/components/RegistrationSelector.tsx
import React from 'react'
import { Plus, Calendar, CheckCircle } from 'lucide-react'

interface RegistrationSelectorProps {
  registrations: any[]
  activeRegistrationId: string | null
  onSelectRegistration: (id: string | null) => void
  onStartNewRegistration: () => void
}

export function RegistrationSelector({
  registrations,
  activeRegistrationId,
  onSelectRegistration,
  onStartNewRegistration,
}: RegistrationSelectorProps) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-white/50">
          Your Events:
        </span>
        {registrations.map((reg) => {
          const isSelected = reg.id === activeRegistrationId
          const eventTitle = typeof reg.event === 'object' ? reg.event.title : 'Event'

          return (
            <button
              key={reg.id}
              onClick={() => onSelectRegistration(reg.id)}
              className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition ${
                isSelected
                  ? 'bg-[#85c226] text-[#07131f] font-bold shadow-md'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>{eventTitle}</span>
              {isSelected && <CheckCircle className="h-3.5 w-3.5 ml-1" />}
            </button>
          )
        })}
      </div>

      <button
        onClick={onStartNewRegistration}
        className="flex items-center gap-2 rounded-xl border border-[#85c226]/40 bg-[#85c226]/10 px-3 py-2 text-xs font-semibold text-[#85c226] transition hover:bg-[#85c226] hover:text-[#07131f]"
      >
        <Plus className="h-4 w-4" />
        Register for New Event
      </button>
    </div>
  )
}
