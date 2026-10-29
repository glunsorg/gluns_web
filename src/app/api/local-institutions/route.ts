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

export async function POST(req: Request) {
  const payload = await getPayload({ config })

  try {
    const data = await req.json()

    if (!data.name || typeof data.name !== 'string') {
      return NextResponse.json({ message: 'Institution name is required' }, { status: 400 })
    }

    const normalizedName = data.name
      .toLowerCase()
      .trim()
      .replace(/\b(high\s*school|highschool|schools?|school)\b/g, '')
      .replace(/[^\p{L}\p{N}\s]/gu, '')
      .replace(/\s+/g, ' ')
      .trim()

    if (!normalizedName) {
      return NextResponse.json({ message: 'Invalid institution name' }, { status: 400 })
    }

    const existingInstitution = await payload.find({
      collection: 'institutions',
      where: {
        normalizedName: {
          equals: normalizedName,
        },
      },
      limit: 1,
      depth: 0,
    })

    if (existingInstitution.docs.length > 0) {
      return NextResponse.json(
        {
          message: 'Institution already exists',
          code: 'INSTITUTION_ALREADY_EXISTS',
        },
        { status: 409 },
      )
    }

    const newInstitution = await payload.create({
      collection: 'institutions',
      data,
    })

    return NextResponse.json({ institution: newInstitution }, { status: 201 })
  } catch (error) {
    console.error('Error creating institution:', error)

    return NextResponse.json({ message: 'Failed to create institution' }, { status: 500 })
  }
}
