import { NextResponse } from 'next/server'
import { getPayload, Payload } from 'payload'
import config from '@payload-config'

export async function GET(req: Request) {
  const payload: Payload = await getPayload({ config })

  try {
    const institutions = await payload.find({
      collection: 'institutions',
      limit: 0,
      sort: '-createdAt',
      depth: 0,
    })

    return NextResponse.json({ institutions: institutions.docs })
  } catch (error) {
    console.error('Error fetching institutions:', error)
    return NextResponse.json({ message: 'Failed to fetch institutions' }, { status: 500 })
  }
}
