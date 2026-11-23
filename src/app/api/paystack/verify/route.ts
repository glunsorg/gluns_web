export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import {
  finalizeSuccessfulPayment,
  PaymentFinalizeError,
  verifyWithPaystack,
} from '@/lib/payments/finalizePayment'

function redirectTo(appUrl: string, path: string) {
  return NextResponse.redirect(new URL(path, appUrl))
}

// The browser lands here after paying on Paystack.
// The webhook (/api/paystack/webhook) runs the same logic as a safety net.
export async function GET(req: Request) {
  const appUrl = process.env.PAYLOAD_URL
  const secretKey = process.env.PAYSTACK_SECRET_KEY

  if (!appUrl) {
    return NextResponse.json({ message: 'Application URL is not configured' }, { status: 500 })
  }

  if (!secretKey) {
    return NextResponse.json({ message: 'Paystack secret key is missing' }, { status: 500 })
  }

  const url = new URL(req.url)
  const reference = url.searchParams.get('reference') || url.searchParams.get('trxref')

  if (!reference) {
    return redirectTo(appUrl, '/payments/failed')
  }

  try {
    const verified = await verifyWithPaystack(reference, secretKey)

    if (!verified.ok) {
      console.error('Paystack verification did not succeed:', verified.reason)
      return redirectTo(appUrl, '/payments/failed')
    }

    const payload = await getPayload({ config })
    const result = await finalizeSuccessfulPayment(payload, reference, verified.data)

    if (result.status !== 'success') {
      return redirectTo(appUrl, '/payments/failed')
    }

    return redirectTo(appUrl, `/payments/success?reference=${encodeURIComponent(reference)}`)
  } catch (error) {
    const step = error instanceof PaymentFinalizeError ? error.step : 'unknown'
    console.error(`[Payment callback] Failed during: ${step}`)
    console.error('[Payment callback] Error details:', error)

    return redirectTo(appUrl, '/payments/failed')
  }
}
