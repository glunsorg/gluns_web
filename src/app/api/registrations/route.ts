import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { createRegistration } from '@/services/registration/createRegistration'

export async function GET(req: Request) {
  const payload = await getPayload({ config })

  const url = new URL(req.url)
  const registeredByEquals = url.searchParams.get('where[registeredBy][equals]')

  try {
    const findOptions: any = { collection: 'registrations', limit: 0, depth: 1 }
    if (registeredByEquals) {
      const maybeNumber = Number(registeredByEquals)
      findOptions.where = {
        registeredBy: { equals: !Number.isNaN(maybeNumber) ? maybeNumber : registeredByEquals },
      }
    }

    const registrations = await payload.find(findOptions)
    return NextResponse.json({ docs: registrations.docs })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ message: 'Failed to fetch registrations' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const payload = await getPayload({ config })

  try {
    const body = await req.json()

    // Require an authenticated user.
    const { user } = await payload.auth({ headers: req.headers }).catch(() => ({ user: null }))

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized. Please sign in.' }, { status: 401 })
    }

    const eventId = body?.event?.id ?? body?.event

    if (!eventId) {
      return NextResponse.json({ message: 'Event is required.' }, { status: 400 })
    }

    // Determine registration type on the server.

    const registration = await createRegistration({
      payload,
      eventId: String(eventId),
      userId: String(user.id),
    })

    return NextResponse.json(
      {
        id: registration.id,
        registrationNumber: registration.registrationNumber,
        event: registration.event,
        registrationType: registration.registrationType,
        registeredBy: registration.registeredBy,
        registrationState: registration.registrationState,
        notes: registration.notes,
        createdAt: registration.createdAt,
        updatedAt: registration.updatedAt,
      },
      { status: 201 },
    )
  } catch (err) {
    console.error('Registrations POST error:', err)

    return NextResponse.json({ message: 'Failed to create registration.' }, { status: 500 })
  }
}
