import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const payload = await getPayload({ config })

  try {
    const numericId = Number(params.id)
    const registrationEquals = Number.isNaN(numericId) ? params.id : numericId

    const delegates = await payload.find({
      collection: 'delegates',
      where: { registration: { equals: registrationEquals } },
      limit: 0,
      depth: 0,
    })

    return NextResponse.json({ delegates: delegates.docs })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ message: 'Failed to fetch delegates' }, { status: 500 })
  }
}
