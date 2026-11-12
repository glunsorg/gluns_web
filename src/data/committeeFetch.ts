import config from '@/payload.config'
import { getPayload } from 'payload'

export async function fetchOrgans() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const result = await payload.find({
    collection: 'organs', // required
    depth: 2,
    pagination: false,
  })

  return {
    organs: result.docs.map((organ) => ({
      id: organ.id,
      name: organ.name,
      slug: organ.slug,
      description: organ.description,
      image: organ.image,
      organType: organ.organType,
      code: organ.code,
    })),
  }
}

export async function fetchCommittee() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const result = await payload.find({
    collection: 'committees',
    depth: 0,
    pagination: false,
    where: {
      active: {
        equals: true,
      },
    },
  })

  return {
    committee: result.docs.map((committee) => ({
      id: committee.id,
      name: committee.name,
      slug: committee.slug,
      description: committee.description,
      code: committee.committee_code,
    })),
  }
}
