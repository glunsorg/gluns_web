import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const payload = await getPayload({ config })

  const { user } = await payload.auth({
    headers: req.headers,
  })

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const url = new URL(req.url)
  const eventId = url.searchParams.get('eventId')

  const where: Record<string, any> = {
    user: { equals: user.id },
  }

  if (eventId) {
    where.event = { equals: Number(eventId) }
  }

  const result = await payload.find({
    collection: 'delegation-applications',
    where,
    sort: '-updatedAt',
    limit: 1,
  })

  return NextResponse.json({
    delegation: result.docs[0] || null,
  })
}

export async function POST(req: Request) {
  const payload = await getPayload({ config })

  const { user } = await payload.auth({
    headers: req.headers,
  })

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()

  if (!body.event) {
    return NextResponse.json({ message: 'Event is required' }, { status: 400 })
  }

  const eventId = Number(body.event)
  if (Number.isNaN(eventId)) {
    return NextResponse.json({ message: 'Invalid event ID' }, { status: 400 })
  }

  const existing = await payload.find({
    collection: 'delegation-applications',
    where: {
      user: { equals: user.id },
      event: { equals: eventId },
    },
    limit: 1,
  })

  if (existing.docs[0]) {
    const updated = await payload.update({
      collection: 'delegation-applications',
      id: existing.docs[0].id,
      data: {
        ...body,
        event: eventId,
        user: user.id,
      },
    })

    return NextResponse.json(updated)
  }

  const delegation = await payload.create({
    collection: 'delegation-applications',
    data: {
      ...body,
      event: eventId,
      user: user.id, // enforced server-side
    },
  })

  return NextResponse.json(delegation)
}
