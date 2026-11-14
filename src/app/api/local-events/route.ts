// fetch events

import { NextResponse } from 'next/server'
import { getPayload, Payload } from 'payload'
import config from '@payload-config'

export async function GET() {
  const payload: Payload = await getPayload({ config })

  try {
    const now = new Date().toISOString()
    const events = await payload.find({
      collection: 'events',
      limit: 0,
      where: {
        and: [
          { eventType: { equals: 'local' } },
          { registrationState: { equals: 'open' } },
          { registrationOpen: { less_than_equal: now } },
          { registrationClose: { greater_than_equal: now } },
        ],
      },
      sort: '-startDate',
      depth: 0,
    })

    return NextResponse.json({ events: events.docs })
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json({ message: 'Failed to fetch events' }, { status: 500 })
  }
}
