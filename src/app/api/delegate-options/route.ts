import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

function relationshipId(value: unknown): string | number | undefined {
  if (value == null) return undefined
  if (typeof value === 'object' && 'id' in value) {
    return relationshipId((value as { id?: unknown }).id)
  }
  return typeof value === 'string' || typeof value === 'number' ? value : undefined
}

export async function GET(request: Request) {
  const payload = await getPayload({ config })
  const searchParams = new URL(request.url).searchParams
  const organId = searchParams.get('organId')
  const registrationId = searchParams.get('registrationId')
  const delegateId = searchParams.get('delegateId')

  try {
    const organs = await payload.find({
      collection: 'organs',
      where: { active: { equals: true } },
      sort: 'name',
      limit: 0,
      depth: 0,
    })

    if (!registrationId) {
      return NextResponse.json({ message: 'Registration is required.' }, { status: 400 })
    }

    const registration = await payload.findByID({
      collection: 'registrations',
      id: Number(registrationId),
      depth: 0,
    })
    const eventId = typeof registration.event === 'object' ? registration.event.id : registration.event

    if (!eventId) {
      return NextResponse.json({ message: 'The registration has no event.' }, { status: 400 })
    }

    const eventCommittees = await payload.find({
      collection: 'event-committees',
      where: {
        and: [
          { event: { equals: eventId } },
          { available: { equals: true } },
        ],
      },
      limit: 0,
      depth: 1,
    })

    const registrationRecords = await payload.find({
      collection: 'registrations',
      where: { event: { equals: eventId } },
      limit: 0,
      depth: 0,
    })
    const eventRegistrationIds = registrationRecords.docs.map((record) => record.id)

    const availableCommittees = []
    for (const eventCommittee of eventCommittees.docs) {
      const committee =
        typeof eventCommittee.committee === 'object'
          ? eventCommittee.committee
          : await payload.findByID({
              collection: 'committees',
              id: eventCommittee.committee,
              depth: 0,
            })

      if (!committee || committee.active === false) continue
      if (organId && String(relationshipId(committee.organ)) !== String(organId)) continue

      const assignedDelegates = await payload.find({
        collection: 'delegates',
        where: {
          and: [
            { committee: { equals: committee.id } },
            { registration: { in: eventRegistrationIds } },
            { delegateState: { not_equals: 'cancelled' } },
            ...(delegateId ? [{ id: { not_equals: delegateId } }] : []),
          ],
        },
        limit: 0,
        depth: 0,
      })

      const capacity = eventCommittee.capacity ?? null
      const remainingCapacity =
        capacity == null ? null : Math.max(capacity - assignedDelegates.totalDocs, 0)

      if (remainingCapacity !== null && remainingCapacity === 0) continue

      availableCommittees.push({
        ...committee,
        maxCapacity: capacity,
        remainingCapacity,
        eventCommitteeId: eventCommittee.id,
      })
    }

    const eventOrganIds = new Set(
      availableCommittees.map((committee) => String(relationshipId(committee.organ))),
    )

    return NextResponse.json({
      organs: organs.docs.filter((organ) => eventOrganIds.has(String(organ.id))),
      committees: availableCommittees.sort((a, b) => a.name.localeCompare(b.name)),
    })
  } catch (error) {
    console.error('Failed to fetch delegate options:', error)
    return NextResponse.json({ message: 'Failed to load organ and committee options.' }, { status: 500 })
  }
}
