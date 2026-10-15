import config from '@/payload.config'
import { getPayload } from 'payload'

export async function fetchCommittee() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const result = await payload.find({
    collection: 'committees', // required
    depth: 2,
    pagination: false,
  })

  return {
    committee: result.docs.map((committee) => ({
      id: committee.id,
      name: committee.name,
      slug: committee.slug,
      photo: committee.committee_photo,
      description: committee.description,
      code: committee.committee_code,
      summary: committee.summary,
    })),
  }
}
