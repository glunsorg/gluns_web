import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

function toRelationshipId(value: unknown) {
  if (value && typeof value === 'object') {
    const maybeId = (value as { id?: unknown }).id
    return maybeId ?? value
  }

  return value
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const payload = await getPayload({ config })

  try {
    const reg = await payload.findByID({ collection: 'registrations', id: params.id, depth: 2 })
    return NextResponse.json(reg)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ message: 'Failed to fetch registration' }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const payload = await getPayload({ config })
  const body = await req.json()

  const data = {
    ...body,
    event: toRelationshipId(body?.event),
    institution: toRelationshipId(body?.institution),
  }

  try {
    const updated = await payload.update({ collection: 'registrations', id: params.id, data })
    return NextResponse.json(updated)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ message: 'Failed to update registration' }, { status: 500 })
  }
}
