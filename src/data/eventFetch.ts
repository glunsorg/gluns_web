import config from '@/payload.config'
import { getPayload } from 'payload'

export async function fetchEvents() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const result = await payload.find({
    collection: 'event', // required
    depth: 2,
    pagination: false,
  })

  return {
    events: result.docs.map((committee) => ({
      id: committee.id,
      title: committee.title,
      subtitle: committee.subtitle,
      slug: committee.slug,
      description: committee.description,
      banner: committee.banner,
      location: committee.location,
      date: committee.date,
      cost: committee.cost,
      currency: committee.currency,
    })),
  }
}
