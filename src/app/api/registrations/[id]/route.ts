import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const payload = await getPayload({ config })

  try {
    const { id } = await params
    const reg = await payload.findByID({ collection: 'registrations', id: id, depth: 2 })
    return NextResponse.json(reg)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ message: 'Failed to fetch registration' }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const payload = await getPayload({ config })
  const body = await req.json()

  const data = {
    ...body,
    event: body?.event.id,
  }

  try {
    const { id } = await params
    const updated = await payload.update({ collection: 'registrations', id: id, data })
    return NextResponse.json(updated)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ message: 'Failed to update registration' }, { status: 500 })
  }
}
