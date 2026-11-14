import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(request: Request) {
  const payload = await getPayload({ config })
  const searchParams = new URL(request.url).searchParams
  const organId = searchParams.get('organId')
  const registrationId = searchParams.get('registrationId')

  try {
    const organs = await payload.find({
      collection: 'organs',
      where: { active: { equals: true } },
      sort: 'name',
      limit: 0,
      depth: 0,
    })

    const committees = organId
      ? await payload.find({
          collection: 'committees',
          where: {
            and: [
              { active: { equals: true } },
              { organ: { equals: organId } },
            ],
          },
          sort: 'name',
          limit: 0,
          depth: 0,
        })
      : { docs: [] }

    const capacities = new Map<number, number | null>()
    const availability = new Map<number, boolean>()
    if (registrationId) {
      const registration = await payload.findByID({
        collection: 'registrations',
        id: Number(registrationId),
        depth: 0,
      })
      const eventId =
        typeof registration.event === 'object' ? registration.event.id : registration.event

      if (eventId) {
        const eventCommittees = await payload.find({
          collection: 'event-committees',
          where: { event: { equals: eventId } },
          limit: 0,
          depth: 0,
        })

        for (const eventCommittee of eventCommittees.docs) {
          const committeeId =
            typeof eventCommittee.committee === 'object'
              ? eventCommittee.committee.id
              : eventCommittee.committee
          capacities.set(Number(committeeId), eventCommittee.capacity ?? null)
          availability.set(Number(committeeId), eventCommittee.available !== false)
        }
      }
    }

    return NextResponse.json({
      organs: organs.docs,
      committees: committees.docs.map((committee) => ({
        ...committee,
        maxCapacity: capacities.get(Number(committee.id)) ?? null,
        eventAvailable: availability.get(Number(committee.id)) ?? false,
      })),
    })
  } catch (error) {
    console.error('Failed to fetch delegate options:', error)
    return NextResponse.json({ message: 'Failed to load organ and committee options.' }, { status: 500 })
  }
}
