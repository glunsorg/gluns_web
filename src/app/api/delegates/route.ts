/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

// delegates collection
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
      collection: 'delegates',
      where: {
        user: {
          equals: user.id,
        },
      },
      sort: 'createdAt',
    })

    return NextResponse.json({
      delegates: result.docs,
      total: result.totalDocs,
    })
  } catch (error) {
    console.error('Error fetching faculty advisors:', error)

    return NextResponse.json({ message: 'Failed to fetch delegates' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const payload = await getPayload({ config })

  const { user } = await payload.auth({
    headers: req.headers,
  })

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  if (user.roles !== 'teacher') {
    return NextResponse.json({ message: 'Only teachers can add delegates' }, { status: 403 })
  }

  try {
    const body = await req.json()

    /**
     * 1. Fetch approved delegation
     */
    const delegation = await payload.find({
      collection: 'delegation-applications',
      where: {
        user: { equals: user.id },
        status: { equals: 'approved' },
      },
      limit: 1,
    })

    if (!delegation.docs.length) {
      return NextResponse.json(
        { message: 'No approved delegation application found' },
        { status: 400 },
      )
    }

    /**
     * 2. Count existing delegates
     */
    const existingAdvisors = await payload.find({
      collection: 'delegates',
      where: { teacher: { equals: user.id } },
    })

    if (existingAdvisors.totalDocs >= delegation.docs[0].numberOfDelegates) {
      return NextResponse.json(
        { message: `You can only add ${delegation.docs[0].numberOfDelegates} delegate(s).` },
        { status: 400 },
      )
    }

    // ---- INSERT PAID SLOTS CHECK HERE ----

    const payments = await payload.find({
      collection: 'payments',
      where: { teacher: { equals: user.id }, status: { equals: 'paid' } },
      limit: 0,
    })

    const totalPaidSlots = payments.docs.reduce(
      (acc, p) => acc + (p.delegateSlotsPurchased || 0),
      0,
    )

    if (existingAdvisors.totalDocs >= totalPaidSlots) {
      return NextResponse.json(
        { message: `You can only add ${totalPaidSlots} delegate(s).` },
        { status: 400 },
      )
    }

    // ---- THEN CREATE DELEGATE ----
    const delegate = await payload.create({
      collection: 'delegates',
      data: {
        ...body,
        user: user.id, // enforced server-side
      },
    })

    return NextResponse.json(delegate)
  } catch (error: any) {
    console.error('Error creating delegate:', error)
    return NextResponse.json(
      { message: error.message || 'Failed to create delegate' },
      { status: 400 },
    )
  }
}
