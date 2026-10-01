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

    if (!registration) {
      return NextResponse.json({ message: 'Registration is required' }, { status: 400 })
    }

  

    const registrationId = Number(registration)
    const normalizedRegistration = Number.isNaN(registrationId) ? registration : registrationId
    const incomingBatch = toRelationshipId(body?.batch)
    const batch = incomingBatch ?? (await resolveBatchId(payload, normalizedRegistration))

    const delegateData = {
      fullName: body?.fullName,
      email: body?.email,
      phone: body?.phone ?? body?.phoneNumber,
      gender: body?.gender,
      registration: normalizedRegistration,
      batch,
      institution: toRelationshipId(body?.institution),
      delegateState: body?.delegateState ?? 'pending',
    }

    const created = await payload.create({ collection: 'delegates', depth: 0, data: delegateData })
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
