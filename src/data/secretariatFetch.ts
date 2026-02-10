import config from '@/payload.config'
import { getPayload } from 'payload'
import type { Portrait } from '@/payload-types'

export async function fetchSecretariat() {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'secretariat',
    depth: 2,
    pagination: false,
    sort: 'createdAt',
  })

  const secretariat = result.docs.map((doc) => {
    const photo =
      typeof doc.photo === 'object' && doc.photo !== null ? (doc.photo as Portrait) : null

    return {
      id: doc.id,
      name: doc.full_name,
      role: doc.role,
      email: doc.email,
      bio: doc.bio,
      photoUrl: photo?.url ?? '',
      photoAlt: photo?.alt,
    }
  })

  return { secretariat }
}
