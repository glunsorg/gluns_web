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

async function validateOrganCommittee(
  payload: any,
  organId: number | undefined,
  committeeId: number | undefined,
) {
  if (committeeId == null) return

  if (organId == null) {
    throw new Error('Select an organ before choosing a committee.')
  }

  const committee = await payload.findByID({
    collection: 'committees',
    id: committeeId,
    depth: 0,
  })

  const committeeOrganId = toRelationshipId(committee.organ)
  if (String(committeeOrganId) !== String(organId)) {
    throw new Error('The selected committee does not belong to the selected organ.')
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: req.headers })

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const body = await req.json()

    const fullName =
      body?.fullName ?? [body?.firstName, body?.lastName].filter(Boolean).join(' ').trim()

    if (!fullName) {
      return NextResponse.json({ message: 'Full Name is required' }, { status: 400 })
    }

    const existing = await payload.findByID({
      collection: 'delegates',
      id,
      depth: 1,
    })
    const delegateRegistrationId = toRelationshipId(body?.registration) ?? toRelationshipId(existing.registration)
    const registration = delegateRegistrationId
      ? await payload.findByID({
          collection: 'registrations',
          id: delegateRegistrationId,
          depth: 0,
        })
      : null
    const registeredById = registration ? toRelationshipId(registration.registeredBy) : undefined
    const registeredBy = registeredById
      ? await payload.findByID({ collection: 'users', id: registeredById, depth: 1 })
      : null
    const institution = toRelationshipId(registeredBy?.institution)
      ?? toRelationshipId(user?.institution)
      ?? toRelationshipId(existing.institution)
    const institutionName =
      typeof registeredBy?.institution === 'object' && registeredBy.institution
        ? String(registeredBy.institution.name || '')
        : String(
            registeredBy?.institutionName ||
              user?.institutionName ||
              existing.institutionName ||
              '',
          )

    const data = {
      fullName,
      email: body?.email,
      phone: body?.phone ?? body?.phoneNumber,
      gender: body?.gender,
      registration: delegateRegistrationId,
      batch: toRelationshipId(body?.batch),
      institution,
      institutionName: institutionName || undefined,
      organ: toRelationshipId(body?.organ),
      committee: toRelationshipId(body?.committee),
      delegateState: body?.delegateState,
    }

    await validateOrganCommittee(payload, data.organ, data.committee)

    const updated = await payload.update({
      collection: 'delegates',
      id: id,
      depth: 0,
      data,
    })

    return NextResponse.json(updated)
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
      {
        message: details || err?.message || 'Failed to update delegate',
      },
      { status },
    )
  }
}
