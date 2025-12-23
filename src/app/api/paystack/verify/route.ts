import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(req: Request) {
  const payload = await getPayload({ config })
  const url = new URL(req.url)
  const ref = url.searchParams.get('reference') || url.searchParams.get('trxref')

  if (!ref) return NextResponse.json({ message: 'No reference provided' }, { status: 400 })

  try {
    // Verify transaction with Paystack
    const res = await fetch(`https://api.paystack.co/transaction/verify/${ref}`, {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
    })

    const result = await res.json()

    if (!result.status) throw new Error(result.message)

    const { data } = result

    if (data.status !== 'success') {
      return NextResponse.redirect(new URL('/payments/failed', req.url))
    }

    const metadata = data.metadata

    // Check for duplicate payment
    const existing = await payload.find({
      collection: 'payments',
      where: { reference: { equals: ref } },
    })

    if (!existing.totalDocs) {
      // Validate teacher and delegation exist
      const teacherDoc = await payload.findByID({
        collection: 'users',
        id: metadata.teacherId,
      })

      const delegationDoc = await payload.findByID({
        collection: 'delegations',
        id: metadata.delegationId,
      })

      if (!teacherDoc || !delegationDoc) {
        console.error('Invalid teacher or delegation ID', metadata)
        return NextResponse.redirect(new URL('/payments/error', req.url))
      }

      // Create payment record
      await payload.create({
        collection: 'payments',
        data: {
          teacher: teacherDoc.id,
          delegation: delegationDoc.id,
          delegateSlotsPurchased: metadata.delegateSlotsPurchased,
          amount: data.amount / 100,
          status: 'paid',
          reference: ref,
        },
      })
    }

    return NextResponse.redirect(new URL('/payments/success', req.url))
  } catch (err) {
    console.error('Paystack verify error', err)
    return NextResponse.redirect(new URL('/payments/error', req.url))
  }
}
