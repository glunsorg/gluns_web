/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import { apiFetch } from '@/app/utils/apiFetch'
import { EventOption } from '@/types/registrationTypes'

export function useEvents() {
  const [events, setEvents] = useState<EventOption[]>([])
  const [selectedEventId, setSelectedEventId] = useState<string>('')
  const [eventsLoading, setEventsLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await apiFetch('/api/local-events', { cache: 'no-store' })
        if (!res.ok) throw new Error('Failed to fetch events')

        const data = await res.json()
        const eventOptions: EventOption[] = (data.events || []).map((event: any) => ({
          id: event.id,
          title: event.title,
          subtitle: event.subtitle,
          venue: event.venue,
          date: event.startDate,
          cost: event.cost,
          currency: event.currency,
          registrationState: event.registrationState,
          registrationOpen: event.registrationOpen,
          registrationClose: event.registrationClose,
          allowIndividualRegistration: event.allowIndividualRegistration,
          allowInstitutionRegistration: event.allowInstitutionRegistration,
        }))

        setEvents(eventOptions)
        if (eventOptions.length > 0) {
          setSelectedEventId(String(eventOptions[0].id))
        }
      } catch (error) {
        console.error('Failed to fetch events:', error)
      } finally {
        setEventsLoading(false)
      }
    }

    fetchEvents()
  }, []) // Run once on mount

  return { events, selectedEventId, setSelectedEventId, eventsLoading }
}
