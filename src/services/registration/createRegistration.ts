/* eslint-disable @typescript-eslint/no-explicit-any */

async function generateRegistrationNumber(payload: any) {
  const lastRegistration = await payload.find({
    collection: 'registrations',
    sort: '-createdAt',
    limit: 1,
    depth: 0,
  })

  const lastNumber = lastRegistration.docs[0]?.registrationNumber ?? 'GLUNSREG-0000'

  const lastNumericPart = parseInt(String(lastNumber).split('-')[1] ?? '0', 10)

  return `GLUNSREG-${String(lastNumericPart + 1).padStart(4, '0')}`
}

const normalizeId = (id: string | number) => {
  const value = String(id)

  return /^\d+$/.test(value) ? Number(value) : value
}

export async function createRegistration({
  payload,
  eventId,
  registrationType,
  institutionId,
  userId,
}: {
  payload: any
  eventId: string
  registrationType: 'individual' | 'institution'
  institutionId?: string
  userId: string
}) {
  const event = await payload.findByID({
    collection: 'events',
    id: normalizeId(eventId),
    depth: 0,
  })

  const user = await payload.findByID({
    collection: 'users',
    id: normalizeId(userId),
    depth: 0,
  })

  if (!event) {
    throw new Error(`Event ${eventId} not found`)
  }

  if (!user) {
    throw new Error(`User ${userId} not found`)
  }

  let institution

  if (registrationType === 'institution') {
    if (!institutionId) {
      throw new Error('Institution is required for institution registration')
    }

    institution = await payload.findByID({
      collection: 'institutions',
      id: normalizeId(institutionId),
      depth: 0,
    })

    if (!institution) {
      throw new Error(`Institution ${institutionId} not found`)
    }
  }

  const registrationNumber = await generateRegistrationNumber(payload)

  const data: any = {
    registrationNumber,
    event: normalizeId(eventId),
    registrationType,
    registeredBy: normalizeId(userId),
    registrationState: 'draft',
  }

  if (registrationType === 'institution' && institutionId) {
    data.institution = normalizeId(institutionId)
  }

  console.log('FINAL CREATE DATA:', data)

  return payload.create({
    collection: 'registrations',
    depth: 0,
    data,
  })
}
