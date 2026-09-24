export async function createRegistration({ payload, eventId, registrationType, userId }) {
  const registration = await payload.create({
    collection: 'registrations',
    data: {
      event: eventId,
      registrationType,
      registeredBy: userId,
      registrationState: 'draft',
    },
  })

  return registration
}
