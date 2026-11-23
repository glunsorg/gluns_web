/* eslint-disable @typescript-eslint/no-explicit-any */
export const runtime = 'nodejs'

/**
 * Paystack webhook.
 *
 * Paystack calls this URL directly from its servers when a payment succeeds,
 * even if the customer closed the browser before being redirected back. That
 * makes sure a payment that really happened is always recorded.
 *
 * Set this URL in your Paystack dashboard (Settings > API Keys & Webhooks):
 *   https://YOUR-DOMAIN/api/paystack/webhook
 */
import crypto from 'node:crypto'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import {
  finalizeSuccessfulPayment,
  PaymentFinalizeError,
  verifyWithPaystack,
} from '@/lib/payments/finalizePayment'

function signatureIsValid(rawBody: string, signature: string, secretKey: string): boolean {
  const expected = crypto.createHmac('sha512', secretKey).update(rawBody).digest('hex')

  const expectedBuffer = Buffer.from(expected, 'utf8')
  const receivedBuffer = Buffer.from(signature, 'utf8')

  // timingSafeEqual throws if the lengths differ.
  if (expectedBuffer.length !== receivedBuffer.length) return false

  return crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
}

export async function POST(req: Request) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY

  if (!secretKey) {
    console.error('[Paystack webhook] PAYSTACK_SECRET_KEY is missing')
    return NextResponse.json({ message: 'Server is not configured' }, { status: 500 })
  }

  // The signature is calculated over the exact raw body, so read it as text.
  const rawBody = await req.text()
  const signature = req.headers.get('x-paystack-signature') ?? ''

  if (!signature || !signatureIsValid(rawBody, signature, secretKey)) {
    return NextResponse.json({ message: 'Invalid signature' }, { status: 401 })
  }

  let event: any

  try {
    event = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 })
  }

  // We only care about successful charges. Acknowledge everything else so
  // Paystack does not keep retrying.
  if (event?.event !== 'charge.success') {
    return NextResponse.json({ received: true })
  }

  const reference = event?.data?.reference

  if (typeof reference !== 'string' || !reference) {
    return NextResponse.json({ received: true })
  }

  try {
    // Never trust the webhook body alone: ask Paystack directly.
    const verified = await verifyWithPaystack(reference, secretKey)

    if (!verified.ok) {
      console.error('[Paystack webhook] Verification did not succeed:', verified.reason)
      return NextResponse.json({ received: true })
    }

    const payload = await getPayload({ config })
    const result = await finalizeSuccessfulPayment(payload, reference, verified.data)

    if (result.status !== 'success') {
      // Unknown reference or amount mismatch: retrying will not help.
      console.error(`[Paystack webhook] Payment ${reference} not applied: ${result.status}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    const step = error instanceof PaymentFinalizeError ? error.step : 'unknown'
    console.error(`[Paystack webhook] Failed during: ${step}`, error)

    // A real failure: return 500 so Paystack retries later.
    return NextResponse.json({ message: 'Processing failed' }, { status: 500 })
  }
}
