/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, CalendarDays, ClipboardList, Info, Plus } from 'lucide-react'

type Reg = {
  id: string | number
  registrationNumber?: string
  event?: any
  registrationState?: string
}

interface Props {
  registrations: Reg[]
  onCreate: () => void
}

const isDraft = (state?: string) => !state || state.toLowerCase() === 'draft'

const formatState = (state?: string) => {
  const s = state || 'draft'
  return s.charAt(0).toUpperCase() + s.slice(1).replace(/[_-]/g, ' ')
}

export default function RegistrationsList({ registrations, onCreate }: Props) {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-white">Your registrations</h2>
          <p className="text-xs text-white/60">
            {registrations.length === 0
              ? 'Nothing here yet'
              : `${registrations.length} registration${registrations.length === 1 ? '' : 's'}`}
          </p>
        </div>
        {registrations.length > 0 && (
          <Button onClick={onCreate} size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" aria-hidden="true" />
            New
          </Button>
        )}
      </div>

      {/* Empty state */}
      {registrations.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/10 bg-white/5 px-6 py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5">
            <ClipboardList className="h-6 w-6 text-white/70" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-white">No registrations yet</p>
            <p className="max-w-xs text-xs text-white/70">
              Start a new registration to begin signing up for an event.
            </p>
          </div>
          <Button onClick={onCreate} className="mt-1 gap-1.5">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Start new registration
          </Button>
        </div>
      ) : (
        <ul className="space-y-3">
          {registrations.map((r) => {
            const draft = isDraft(r.registrationState)

            return (
              <li
                key={r.id}
                className="group rounded-2xl border border-white/10 bg-white/5 p-4 transition-all duration-200 hover:border-white/20 hover:bg-white/10"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                      <CalendarDays className="h-5 w-5 text-white/70" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-white">
                        {r.event?.title || 'Event'}
                      </div>
                      <div className="mt-0.5 truncate text-xs text-white/70">
                        {r.registrationNumber || `#${r.id}`}
                      </div>
                    </div>
                  </div>

                  <span
                    className={
                      'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ' +
                      (draft
                        ? 'border-dashed border-white/30 bg-white/5 text-white/80'
                        : 'border-white/10 bg-white/10 text-white')
                    }
                  >
                    <span
                      className={'h-1.5 w-1.5 rounded-full ' + (draft ? 'bg-white/50' : 'bg-white')}
                      aria-hidden="true"
                    />
                    {formatState(r.registrationState)}
                  </span>
                </div>

                {/* Draft guidance */}
                {draft && (
                  <div
                    role="note"
                    className="mt-4 flex items-start gap-2.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5"
                  >
                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-white/70" aria-hidden="true" />
                    <p className="text-xs leading-relaxed text-white/70">
                      This registration is in draft. Go to the{' '}
                      <span className="inline-flex items-center gap-1 font-semibold text-white">
                        Delegations
                        <ArrowRight className="h-3 w-3" aria-hidden="true" />{' '}
                      </span>{' '}
                      tab to complete your registration.
                    </p>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
