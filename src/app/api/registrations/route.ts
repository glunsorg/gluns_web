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
  const body = await req.json()

  // authenticate user if possible
  const { user } = await payload.auth({ headers: req.headers }).catch(() => ({ user: null }))

  // allow creation when either an authenticated user exists, or caller provided registeredBy in body
  if (!user && !body?.registeredBy) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Sanitize incoming body to avoid circular references or deep objects
    const eventId = body?.event?.id ?? body?.event
    const registrationType = body?.registrationType ?? 'institution'
    const institutionId = body?.institution?.id ?? body?.institution

    if (!eventId) {
      return NextResponse.json({ message: 'Event is required' }, { status: 400 })
    }

    // Use the service helper to create a safe registration record
    const registration = await createRegistration({
      payload,
      eventId: String(eventId),
      registrationType,
      institutionId: institutionId ? String(institutionId) : undefined,
      userId: String(user?.id ?? body.registeredBy),
    })

    const safeRegistration = {
      id: registration?.id,
      registrationNumber: registration?.registrationNumber,
      event: registration?.event,
      registrationType: registration?.registrationType,
      registeredBy: registration?.registeredBy,
      institution: registration?.institution,
      registrationState: registration?.registrationState,
      notes: registration?.notes,
      createdAt: registration?.createdAt,
      updatedAt: registration?.updatedAt,
    }

    return NextResponse.json(safeRegistration, { status: 201 })
  } catch (err: any) {
    console.error('Registrations POST error:', err?.stack || err)
    return NextResponse.json(
      { message: 'Failed to create registration', error: String(err) },
      { status: 500 },
    )
  }
}
