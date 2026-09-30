/* eslint-disable @typescript-eslint/no-explicit-any */
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
  const registration = await payload.create({
    collection: 'registrations',
    data: {
      event: eventId,
      registrationType,
      registeredBy: userId,
      institution: institutionId,
      registrationState: 'draft',
    },
  })

  return registration
}
