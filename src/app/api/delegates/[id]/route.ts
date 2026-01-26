/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

// PATCH /api/faculty-advisors/[id] (update specific faculty advisor)
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const payload = await getPayload({ config })

  const { user } = await payload.auth({
    headers: req.headers,
  })

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const body = await req.json()

    // Verify the delegate exists
    const existing = await payload.findByID({
      collection: 'delegates',
      id,
    })

    if (!existing) {
      return NextResponse.json({ message: 'Delegate not found' }, { status: 404 })
    }

    // Extract teacher ID (handle both populated and non-populated relationship)
    const teacherId = typeof existing.teacher === 'object' ? existing.teacher?.id : existing.teacher

    // Check authorization: admin or owner
    if (user.roles !== 'admin' && teacherId !== user.id) {
      return NextResponse.json(
        { message: 'Forbidden: You can only update your own delegate' },
        { status: 403 },
      )
    }

    // Update the delegate
    const updated = await payload.update({
      collection: 'delegates',
      id,
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phoneNumber: body.phoneNumber,
        committee: body.committee,
        country: body.country,
      },
    })

    return NextResponse.json(updated)
  } catch (error: any) {
    console.error('Error updating delegate:', error)
    return NextResponse.json(
      { message: error.message || 'Failed to update delegate' },
      { status: 400 },
    )
  }
}

// DELETE /api/delegates/[id] (delete specific delegate)
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const payload = await getPayload({ config })

  const { user } = await payload.auth({
    headers: req.headers,
  })

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params

    const existing = await payload.findByID({
      collection: 'delegates',
      id,
    })

    if (!existing) {
      return NextResponse.json({ message: 'Delegate not found' }, { status: 404 })
    }

    const teacherId = typeof existing.teacher === 'object' ? existing.teacher?.id : existing.teacher

    if (user.roles !== 'admin' && teacherId !== user.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
    }

    await payload.delete({
      collection: 'delegates',
      id,
    })

    return NextResponse.json({
      message: 'Delegate deleted successfully',
    })
  } catch (error: any) {
    console.error('Error deleting delegate:', error)
    return NextResponse.json(
      { message: error.message || 'Failed to delete delegate' },
      { status: 400 },
    )
  }
}
