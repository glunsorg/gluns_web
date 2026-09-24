export async function addDelegates({ payload, registrationId, delegates }) {
  const delegatesResult = await payload.update({
    collection: 'registrations',
    id: registrationId,
    data: {
      delegates,
    },
  })

  return delegatesResult
}
