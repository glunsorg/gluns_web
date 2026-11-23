/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import {
  createRegistration,
  RegistrationAvailabilityError,
} from '@/services/registration/createRegistration'
import { getRouteUser, isAdminUser } from '@/lib/routeAuth'

export async function GET(req: Request) {
  const payload = await getPayload({ config })

  const user = await getRouteUser(payload, req)
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const url = new URL(req.url)
  const registeredByEquals = url.searchParams.get('where[registeredBy][equals]')

  try {
    const findOptions: any = { collection: 'registrations', limit: 0, depth: 1 }

    if (isAdminUser(user)) {
      // Admins may look at anyone's registrations, or all of them.
      if (registeredByEquals) {
        const maybeNumber = Number(registeredByEquals)
        findOptions.where = {
          registeredBy: { equals: !Number.isNaN(maybeNumber) ? maybeNumber : registeredByEquals },
        }
      }
    } else {
      // Everyone else only ever sees their OWN registrations, whatever ID
      // the request asks for.
      findOptions.where = { registeredBy: { equals: user.id } }
    }

    const registrations = await payload.find(findOptions)

    // The dashboard reads `paymentStatus` to decide whether to show the
    // "Start payment" button, but it is not a stored field. Derive it from
    // the registrations' paid invoices.
    const ids = registrations.docs.map((r: any) => r.id)
    const paidRegistrationIds = new Set<string>()

    if (ids.length > 0) {
      const paidInvoices = await payload.find({
        collection: 'invoices',
        where: {
          and: [{ registration: { in: ids } }, { invoiceState: { equals: 'paid' } }],
        },
        limit: 0,
        depth: 0,
        overrideAccess: true,
      })

      for (const invoice of paidInvoices.docs as any[]) {
        const regId =
          typeof invoice.registration === 'object' ? invoice.registration?.id : invoice.registration
        paidRegistrationIds.add(String(regId))
      }
    }

    const docs = registrations.docs.map((r: any) => ({
      ...r,
      paymentStatus:
        r.registrationState === 'completed' || paidRegistrationIds.has(String(r.id))
          ? 'success'
          : 'pending',
    }))

    return NextResponse.json({ docs })
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

    if (err instanceof RegistrationAvailabilityError) {
      return NextResponse.json({ message: err.message }, { status: 400 })
    }

    return NextResponse.json({ message: 'Failed to create registration.' }, { status: 500 })
  }
}
