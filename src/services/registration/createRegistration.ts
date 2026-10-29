/* eslint-disable @typescript-eslint/no-explicit-any */

async function generateRegistrationNumber(payload: any) {
  const lastRegistration = await payload.find({
    collection: 'registrations',
    sort: '-createdAt',
    limit: 1,
    depth: 0,
    overrideAccess: true,
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
  userId,
}: {
  payload: any
  eventId: string
  userId: string
}) {
  // Find event
  const event = await payload.findByID({
    collection: 'events',
    id: normalizeId(eventId),
    depth: 0,
    overrideAccess: true,
  })

  if (!event) {
    throw new Error(`Event ${eventId} not found`)
  }

  // Find registering user
  const user = await payload.findByID({
    collection: 'users',
    id: normalizeId(userId),
    depth: 0,
    overrideAccess: true,
  })

  if (!user) {
    throw new Error(`User ${userId} not found`)
  }

  // Determine registration type from the user's institution relationship.
  const registrationType = user.institution ? 'institution' : 'individual'

  const institutionId = user.institution
    ? typeof user.institution === 'object'
      ? user.institution.id
      : user.institution
    : undefined

  // Validate institution for institutional registration.
  if (registrationType === 'institution' && !institutionId) {
    throw new Error('Institution is required for institution registration')
  }

  const registrationNumber = await generateRegistrationNumber(payload)

  const data: any = {
    registrationNumber,
    event: normalizeId(eventId),
    registrationType,
    registeredBy: normalizeId(userId),
    registrationState: 'draft',
  }

  // Link institution when registering institutionally.
  if (registrationType === 'institution' && institutionId) {
    data.institution = normalizeId(institutionId)
  }

  console.log('FINAL CREATE DATA:', data)

  return payload.create({
    collection: 'registrations',
    depth: 0,
    data,
    overrideAccess: true,
  })
}
