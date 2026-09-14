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
    const url = new URL(req.url)
    const delegationId = url.searchParams.get('delegationId')

    const where: Record<string, any> = {
      teacher: {
        equals: user.id,
      },
    }

    if (delegationId) {
      where.delegation = {
        equals: Number(delegationId),
      }
    }

    const result = await payload.find({
      collection: 'faculty-advisors',
      where,
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
 * POST: Create a faculty advisor for the selected delegation application
 */
export async function POST(req: Request) {
  const payload = await getPayload({ config })

  const { user } = await payload.auth({
    headers: req.headers,
  })

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  if (!('roles' in user) || !user.roles.includes('teacher')) {
    return NextResponse.json(
      { message: 'Only teachers can create faculty advisors' },
      { status: 403 },
    )
  }

  try {
    const body = await req.json()

    const delegationId = Number(body.delegationId)

    if (!delegationId || Number.isNaN(delegationId)) {
      return NextResponse.json({ message: 'Delegation ID is required' }, { status: 400 })
    }

    const delegation = await payload.find({
      collection: 'delegation-applications',
      where: {
        id: {
          equals: delegationId,
        },
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

    const facultyAdvisor = await payload.create({
      collection: 'faculty-advisors',
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phoneNumber: body.phoneNumber,
        teacher: user.id,
        delegation: delegationId,
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
