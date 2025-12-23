/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * GET: Return all faculty advisors for the authenticated teacher
 */
export async function GET(req: Request) {
  const payload = await getPayload({ config })

  const { user } = await payload.auth({
    headers: req.headers,
  })

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const result = await payload.find({
      collection: 'faculty-advisors',
      where: {
        teacher: {
          equals: user.id,
        },
      },
      sort: 'createdAt',
    })

    return NextResponse.json({
      facultyAdvisors: result.docs,
      total: result.totalDocs,
    })
  } catch (error) {
    console.error('Error fetching faculty advisors:', error)
    return NextResponse.json({ message: 'Failed to fetch faculty advisors' }, { status: 500 })
  }
}

/**
 * POST: Create a faculty advisor (up to delegation limit)
 */
export async function POST(req: Request) {
  const payload = await getPayload({ config })

  const { user } = await payload.auth({
    headers: req.headers,
  })

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  if (user.roles !== 'teacher') {
    return NextResponse.json(
      { message: 'Only teachers can create faculty advisors' },
      { status: 403 },
    )
  }

  try {
    const body = await req.json()

    /**
     * 1. Fetch approved delegation
     */
    const delegation = await payload.find({
      collection: 'delegation-applications',
      where: {
        user: {
          equals: user.id,
        },
        status: {
          equals: 'approved',
        },
      },
      limit: 1,
    })

    if (!delegation.docs.length) {
      return NextResponse.json(
        { message: 'No approved delegation application found' },
        { status: 400 },
      )
    }

    const maxAdvisors = delegation.docs[0].numberOfFacultyAdvisors

    /**
     * 2. Count existing advisors
     */
    const existingAdvisors = await payload.find({
      collection: 'faculty-advisors',
      where: {
        teacher: {
          equals: user.id,
        },
      },
    })

    if (existingAdvisors.totalDocs >= maxAdvisors) {
      return NextResponse.json(
        {
          message: `You can only add ${maxAdvisors} faculty advisor(s).`,
        },
        { status: 400 },
      )
    }

    /**
     * 3. Create advisor
     */
    const facultyAdvisor = await payload.create({
      collection: 'faculty-advisors',
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phoneNumber: body.phoneNumber,
        teacher: user.id,
      },
    })

    return NextResponse.json(facultyAdvisor, { status: 201 })
  } catch (error: any) {
    console.error('Error creating faculty advisor:', error)

    return NextResponse.json(
      { message: error.message || 'Failed to create faculty advisor' },
      { status: 400 },
    )
  }
}
