import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export const runtime = 'nodejs'

export async function GET(req: Request) {
  const reference = new URL(req.url).searchParams.get('reference')

  if (!reference) {
    return NextResponse.json({ message: 'Payment reference is required' }, { status: 400 })
  }

  try {
    const payload = await getPayload({ config })

    const payments = await payload.find({
      collection: 'payments',
      where: {
        transactionReference: { equals: reference },
      },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })

    const payment = payments.docs[0]

    if (!payment || payment.paymentState !== 'successful') {
      return NextResponse.json({ message: 'Successful payment not found' }, { status: 404 })
    }

    const receipts = await payload.find({
      collection: 'receipts',
      where: {
        payment: { equals: payment.id },
      },
      limit: 1,
      depth: 1,
      overrideAccess: true,
    })

    const receipt = receipts.docs[0]

    if (!receipt) {
      return NextResponse.json({ message: 'Receipt has not been created yet' }, { status: 404 })
    }

    const pdf = typeof receipt.pdf === 'object' && receipt.pdf !== null ? receipt.pdf : null

    if (!pdf?.url) {
      return NextResponse.json({ message: 'Receipt PDF is not available yet' }, { status: 404 })
    }

    return NextResponse.json({
      receiptNumber: receipt.receiptNumber,
      pdfUrl: pdf.url,
    })
  } catch (error) {
    console.error('Receipt lookup error:', error)

    return NextResponse.json({ message: 'Unable to retrieve receipt' }, { status: 500 })
  }
}
