import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(req: Request) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: req.headers })
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  if (!process.env.PAYSTACK_SECRET_KEY) {
    return NextResponse.json({ message: 'Paystack key missing' }, { status: 500 })
  }

  try {
    const { delegateSlotsPurchased, delegationId } = await req.json()

    if (!delegateSlotsPurchased || delegateSlotsPurchased <= 0)
      return NextResponse.json({ message: 'Invalid slots' }, { status: 400 })
    if (!delegationId)
      return NextResponse.json({ message: 'Delegation ID required' }, { status: 400 })

    const PRICE_PER_DELEGATE_NGN = 10

    const res = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: user.email,
        amount: delegateSlotsPurchased * PRICE_PER_DELEGATE_NGN * 100, // in kobo
        callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/paystack/verify`,
        metadata: {
          teacherId: user.id,
          delegationId: delegationId, // Must be the Payload 'delegations' ID
          delegateSlotsPurchased,
        },
      }),
    })

    const data = await res.json()
    console.log('Paystack init response:', data)

    if (!data.status) {
      return NextResponse.json({ message: data.message }, { status: 400 })
    }

    return NextResponse.json(data.data)
  } catch (err: any) {
    console.error('Paystack initiate error:', err)
    return NextResponse.json({ message: 'Init failed' }, { status: 500 })
  }
}
