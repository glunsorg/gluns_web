import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(req: Request) {
  const payload = await getPayload({ config })

  const { user } = await payload.auth({ headers: req.headers })
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  try {
    const payments = await payload.find({
      collection: 'payments',
      where: { teacher: { equals: user.id }, status: { equals: 'paid' } },
      limit: 0,
    })

    const totalPaidSlots = payments.docs.reduce(
      (acc, p) => acc + (p.delegateSlotsPurchased || 0),
      0,
    )

    return NextResponse.json({ totalPaidSlots })
  } catch (error) {
    console.error('Error fetching payments:', error)
    return NextResponse.json({ message: 'Failed to fetch payments' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const payload = await getPayload({ config })

  const { user } = await payload.auth({ headers: req.headers })
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  try {
    const payments = await payload.find({
      collection: 'payments',
      where: { teacher: { equals: user.id } },
      limit: 0,
    })

    return NextResponse.json({ payments: payments.docs })
  } catch (error) {
    console.error('Error fetching payments:', error)
    return NextResponse.json({ message: 'Failed to fetch payments' }, { status: 500 })
  }
}
