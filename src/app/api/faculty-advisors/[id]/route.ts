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

    // Verify the faculty advisor exists
    const existing = await payload.findByID({
      collection: 'faculty-advisors',
      id,
    })

    if (!existing) {
      return NextResponse.json({ message: 'Faculty advisor not found' }, { status: 404 })
    }

    // Extract teacher ID (handle both populated and non-populated relationship)
    const teacherId = typeof existing.teacher === 'object' ? existing.teacher?.id : existing.teacher

    // Check authorization: admin or owner
    if (user.roles !== 'admin' && teacherId !== user.id) {
      return NextResponse.json(
        { message: 'Forbidden: You can only update your own faculty advisor' },
        { status: 403 },
      )
    }

    // Update the faculty advisor
    const updated = await payload.update({
      collection: 'faculty-advisors',
      id,
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phoneNumber: body.phoneNumber,
        // teacher field is NOT updated (enforced server-side)
      },
    })

    return NextResponse.json(updated)
  } catch (error: any) {
    console.error('Error updating faculty advisor:', error)
    return NextResponse.json(
      { message: error.message || 'Failed to update faculty advisor' },
      { status: 400 },
    )
  }
}

// DELETE /api/faculty-advisors/[id] (delete specific faculty advisor)
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
      collection: 'faculty-advisors',
      id,
    })

    if (!existing) {
      return NextResponse.json({ message: 'Faculty advisor not found' }, { status: 404 })
    }

    const teacherId = typeof existing.teacher === 'object' ? existing.teacher?.id : existing.teacher

    if (user.roles !== 'admin' && teacherId !== user.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
    }

    await payload.delete({
      collection: 'faculty-advisors',
      id,
    })

    return NextResponse.json({
      message: 'Faculty advisor deleted successfully',
    })
  } catch (error: any) {
    console.error('Error deleting faculty advisor:', error)
    return NextResponse.json(
      { message: error.message || 'Failed to delete faculty advisor' },
      { status: 400 },
    )
  }
}
