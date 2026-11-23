/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getOwnedRegistration, getRouteUser, isAdminUser, relationId } from '@/lib/routeAuth'

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(req: Request, { params }: RouteContext) {
  const payload = await getPayload({ config })

  const user = await getRouteUser(payload, req)
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params

    const owned = await getOwnedRegistration(payload, user, id)
    if (!owned) {
      return NextResponse.json({ message: 'Registration not found' }, { status: 404 })
    }

    const reg = await payload.findByID({
      collection: 'registrations',
      id: owned.id,
      depth: 2,
      overrideAccess: true,
    })

    return NextResponse.json(reg)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ message: 'Failed to fetch registration' }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: RouteContext) {
  const payload = await getPayload({ config })

  const user = await getRouteUser(payload, req)
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params

    const registration = await getOwnedRegistration(payload, user, id)
    if (!registration) {
      return NextResponse.json({ message: 'Registration not found' }, { status: 404 })
    }

    const body = await req.json().catch(() => null)
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ message: 'Invalid request body' }, { status: 400 })
    }

    // Only these fields can be changed from the browser. Everything else
    // (registrationState, registeredBy, registrationType, registrationNumber)
    // is controlled by the server, the payment flow, or an admin.
    const data: Record<string, unknown> = {}

    if ('notes' in body) {
      data.notes = typeof body.notes === 'string' ? body.notes : ''
    }

    const requestedEventId = relationId(body.event)
    const currentEventId = relationId(registration.event)

    if (requestedEventId != null && String(requestedEventId) !== String(currentEventId)) {
      const isAdmin = isAdminUser(user)

      if (!isAdmin) {
        // Switching event is only safe before any delegates or payments exist.
        if (registration.registrationState !== 'draft') {
          return NextResponse.json(
            { message: 'The event can no longer be changed for this registration.' },
            { status: 400 },
          )
        }

        const delegates = await payload.find({
          collection: 'delegates',
          where: { registration: { equals: registration.id } },
          limit: 1,
          depth: 0,
          overrideAccess: true,
        })

        if (delegates.totalDocs > 0) {
          return NextResponse.json(
            { message: 'Remove the delegates before changing the event.' },
            { status: 400 },
          )
        }

        const event = await payload.findByID({
          collection: 'events',
          id: Number(requestedEventId),
          depth: 0,
          overrideAccess: true,
        })

        const now = Date.now()
        const open = Date.parse(event.registrationOpen)
        const close = Date.parse(event.registrationClose)

        if (
          event.registrationState !== 'open' ||
          Number.isNaN(open) ||
          Number.isNaN(close) ||
          now < open ||
          now > close
        ) {
          return NextResponse.json(
            { message: 'Registration is not open for that event.' },
            { status: 400 },
          )
        }

        if (
          (registration.registrationType === 'institution' &&
            event.allowInstitutionRegistration === false) ||
          (registration.registrationType === 'individual' &&
            event.allowIndividualRegistration === false)
        ) {
          return NextResponse.json(
            { message: `That event does not allow ${registration.registrationType} registration.` },
            { status: 400 },
          )
        }
      }

      data.event = Number(requestedEventId)
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(registration)
    }

    const updated = await payload.update({
      collection: 'registrations',
      id: registration.id,
      data,
      overrideAccess: true,
    })

    return NextResponse.json(updated)
  } catch (err: any) {
    console.error(err)

    const text = String(err?.message || '').toLowerCase()
    if (text.includes('unique') || text.includes('duplicate')) {
      return NextResponse.json(
        { message: 'You already have a registration for that event.' },
        { status: 409 },
      )
    }

    return NextResponse.json({ message: 'Failed to update registration' }, { status: 500 })
  }
}
