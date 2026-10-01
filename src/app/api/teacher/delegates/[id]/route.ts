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

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: req.headers })

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()

    const fullName =
      body?.fullName ?? [body?.firstName, body?.lastName].filter(Boolean).join(' ').trim()

    if (!fullName) {
      return NextResponse.json({ message: 'Full Name is required' }, { status: 400 })
    }

    const data = {
      fullName,
      email: body?.email,
      phone: body?.phone ?? body?.phoneNumber,
      gender: body?.gender,
      registration: toRelationshipId(body?.registration),
      batch: toRelationshipId(body?.batch),
      institution: toRelationshipId(body?.institution),
      delegateState: body?.delegateState,
    }

    const updated = await payload.update({
      collection: 'delegates',
      id: params.id,
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
