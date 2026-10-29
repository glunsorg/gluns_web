/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

function toRelationshipId(value: unknown): number | undefined {
  if (value == null) return undefined

  if (typeof value === 'object') {
    const maybeId = (value as { id?: unknown }).id

    if (typeof maybeId === 'number') {
      return maybeId
    }

    if (typeof maybeId === 'string' && maybeId.trim() !== '') {
      const id = Number(maybeId)
      return Number.isNaN(id) ? undefined : id
    }

    return undefined
  }

  if (typeof value === 'number') {
    return value
  }

  if (typeof value === 'string' && value.trim() !== '') {
    const id = Number(value)
    return Number.isNaN(id) ? undefined : id
  }

  return undefined
}

async function resolveBatchId(payload: any, registrationId: number | string) {
  const existingBatch = await payload.find({
    collection: 'registration-batches',
    where: { registration: { equals: registrationId } },
    sort: '-sequence',
    limit: 1,
    depth: 0,
  })

  const batch = existingBatch?.docs?.[0]
  if (batch?.id) {
    return batch.id
  }

  const createdBatch = await payload.create({
    collection: 'registration-batches',
    depth: 0,
    data: {
      registration: registrationId,
      sequence: 1,
      batchState: 'draft',
      batchNumber: `BATCH-${registrationId}-${Date.now()}`,
    },
  })

  return createdBatch.id
}

export async function GET(req: Request) {
  const payload = await getPayload({ config })
  const url = new URL(req.url)
  const registrationId =
    url.searchParams.get('registrationId') ?? url.searchParams.get('delegationId')

  try {
    const findOpts: any = { collection: 'delegates', limit: 0, depth: 0 }
    if (registrationId) {
      const maybeNumber = Number(registrationId)
      findOpts.where = {
        registration: { equals: Number.isNaN(maybeNumber) ? registrationId : maybeNumber },
      }
    }

    const delegates = await payload.find(findOpts)
    return NextResponse.json({ delegates: delegates.docs })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ message: 'Failed to fetch delegates' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: req.headers })
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()

    const registration =
      toRelationshipId(body?.registration) ?? body?.registrationId ?? body?.delegationId

    if (registration == null || registration === '') {
      return NextResponse.json({ message: 'Registration is required' }, { status: 400 })
    }

    const registrationId = Number(registration)

    if (!Number.isInteger(registrationId) || registrationId <= 0) {
      return NextResponse.json({ message: 'Invalid registration ID' }, { status: 400 })
    }

    const normalizedRegistration = registrationId

    // Load the registration from the database.
    const registrationRecord = await payload.findByID({
      collection: 'registrations',
      id: registrationId,
      depth: 0,
    })

    const registeredById = toRelationshipId(registrationRecord.registeredBy)

    if (registrationRecord.registrationType === 'individual') {
      // Confirm the individual registration belongs to the logged-in user.
      if (String(registeredById) !== String(user.id)) {
        return NextResponse.json(
          { message: 'You can only register yourself under your own registration.' },
          { status: 403 },
        )
      }

      // ensure the delegate's full name matches the logged-in user's full name.
      const accountFullName = user.fullName?.trim().toLowerCase()
      const delegateFullName = String(body?.fullName ?? '')
        .trim()
        .toLowerCase()

      if (!accountFullName || delegateFullName !== accountFullName) {
        return NextResponse.json(
          { message: 'Please use the full name associated with your account.' },
          { status: 403 },
        )
      }

      // Ensure the delegate's email matches the logged-in user's email.
      const accountEmail = user.email?.trim().toLowerCase()
      const delegateEmail = String(body?.email ?? '')
        .trim()
        .toLowerCase()

      if (!accountEmail || delegateEmail !== accountEmail) {
        return NextResponse.json(
          { message: 'Please use the email address associated with your account.' },
          { status: 403 },
        )
      }

      // Check whether this individual registration already has a delegate.
      const existingDelegates = await payload.find({
        collection: 'delegates',
        where: {
          registration: {
            equals: registrationId,
          },
        },
        limit: 1,
        depth: 0,
      })

      if (existingDelegates.totalDocs > 0) {
        return NextResponse.json(
          { message: 'Individual registration allows only one delegate.' },
          { status: 409 },
        )
      }
    }

    const incomingBatch = toRelationshipId(body?.batch)
    const batch = incomingBatch ?? (await resolveBatchId(payload, normalizedRegistration))

    const delegateData = {
      fullName: body?.fullName,
      email: body?.email,
      phone: body?.phone ?? body?.phoneNumber,
      gender: typeof body?.gender === 'string' ? body.gender.trim().toLowerCase() : undefined,
      gradeLevel: body?.gradeLevel,
      registration: normalizedRegistration,
      batch,
      institution: toRelationshipId(body?.user?.institution),
      delegateState: body?.delegateState ?? 'pending',
    }

    const created = await payload.create({
      collection: 'delegates',
      depth: 0,
      data: delegateData,
    })

    return NextResponse.json(created, { status: 201 })
  } catch (err: any) {
    console.error(err)

    const status = typeof err?.status === 'number' ? err.status : 500
    const details = Array.isArray(err?.data?.errors)
      ? err.data.errors
          .map((item: { message?: string }) => item?.message)
          .filter(Boolean)
          .join('; ')
      : undefined

    return NextResponse.json(
      { message: details || err?.message || 'Failed to create delegate' },
      { status },
    )
  }
}
