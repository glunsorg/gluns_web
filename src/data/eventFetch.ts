import config from '@/payload.config'
import { getPayload } from 'payload'

export async function fetchEvents() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const result = await payload.find({
    collection: 'events', // required
    depth: 2,
    pagination: false,
    sort: 'startDate',
  })

  return {
    events: result.docs.map((event) => ({
      id: event.id,
      title: event.title,
      subtitle: event.subtitle,
      slug: event.slug,
      description: event.description,
      eventType: event.eventType,
      registrationType: event.registrationState,
      venue: event.venue,
      startDate: event.startDate,
      endDate: event.endDate,
      cost: event.cost,
      currency: event.currency,
      registrationOpenDate: event.registrationOpen,
      registrationCloseDate: event.registrationClose,
      allowInstitutionksRegistration: event.allowInstitutionRegistration,
    })),
  }
}
