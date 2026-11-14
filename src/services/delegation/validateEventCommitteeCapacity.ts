/* eslint-disable @typescript-eslint/no-explicit-any */

function relationshipId(value: unknown): string | number | undefined {
  if (value == null) return undefined

  if (typeof value === 'object' && 'id' in value) {
    return relationshipId((value as { id?: unknown }).id)
  }

  if (typeof value === 'string' || typeof value === 'number') return value

  return undefined
}

export async function validateEventCommitteeCapacity({
  payload,
  eventId,
  committeeId,
  delegateId,
}: {
  payload: any
  eventId: string | number
  committeeId: string | number
  delegateId?: string | number
}) {
  const eventCommitteeResult = await payload.find({
    collection: 'event-committees',
    where: {
      and: [
        { event: { equals: eventId } },
        { committee: { equals: committeeId } },
      ],
    },
    limit: 1,
    depth: 0,
  })

  const eventCommittee = eventCommitteeResult.docs[0]
  if (!eventCommittee) {
    throw new Error('This committee is not configured for the selected event.')
  }

  if (eventCommittee.available === false) {
    throw new Error('This committee is not available for the selected event.')
  }

  if (eventCommittee.capacity == null) return

  const registrations = await payload.find({
    collection: 'registrations',
    where: { event: { equals: eventId } },
    limit: 0,
    depth: 0,
  })
  const registrationIds = registrations.docs.map((registration: any) => registration.id)

  if (registrationIds.length === 0) return

  const delegates = await payload.find({
    collection: 'delegates',
    where: {
      and: [
        { committee: { equals: committeeId } },
        { registration: { in: registrationIds } },
        { delegateState: { not_equals: 'cancelled' } },
      ],
    },
    limit: 0,
    depth: 0,
  })

  const currentDelegateId = relationshipId(delegateId)
  const assignedCount = delegates.docs.filter(
    (delegate: any) => String(delegate.id) !== String(currentDelegateId),
  ).length

  if (assignedCount >= eventCommittee.capacity) {
    throw new Error('This committee has reached its capacity for the selected event.')
  }
}
