import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET() {
  const payload = await getPayload({ config })

  try {
    const [categories, committees, countries] = await Promise.all([
      payload.find({ collection: 'committee-categories', limit: 0, sort: 'name' }),
      payload.find({ collection: 'committees', limit: 0, sort: 'title', depth: 2 }),
      payload.find({
        collection: 'countries',
        limit: 0,
        sort: 'name',
        where: { active: { equals: true } },
      }),
    ])

    return NextResponse.json({
      categories: categories.docs,
      committees: committees.docs,
      countries: countries.docs,
    })
  } catch (error) {
    console.error('Error fetching assignment options:', error)
    return NextResponse.json({ message: 'Failed to fetch assignment options' }, { status: 500 })
  }
}
