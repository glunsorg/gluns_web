import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import crypto from 'crypto'

export async function POST(req: Request) {
  const payload = await getPayload({ config })

  const { user } = await payload.auth({
    headers: req.headers,
  })

  if (!user || user.collection !== 'users') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  if (!user.email) {
    return NextResponse.json({ message: 'User email missing' }, { status: 400 })
  }

  let body: {
    registrationId?: number | string
    delegateCount?: number | string
  }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 })
  }

  const registrationId = Number(body.registrationId)
  const delegateCount = Number(body.delegateCount)

  if (!Number.isInteger(registrationId) || registrationId <= 0) {
    return NextResponse.json({ message: 'Invalid registration ID' }, { status: 400 })
  }

  if (!Number.isInteger(delegateCount) || delegateCount <= 0) {
    return NextResponse.json({ message: 'Invalid delegate count' }, { status: 400 })
  }

  if (!process.env.PAYSTACK_SECRET_KEY) {
    return NextResponse.json({ message: 'Paystack key missing' }, { status: 500 })
  }

  try {
    /**
     * 1. Find registration
     */
    const registration = await payload.findByID({
      collection: 'registrations',
      id: registrationId,
      depth: 1,
    })

    if (!registration) {
      return NextResponse.json({ message: 'Registration not found' }, { status: 404 })
    }

    /**
     * 2. Make sure the authenticated user owns
     *    the registration.
     */
    const registeredBy =
      typeof registration.registeredBy === 'object'
        ? registration.registeredBy.id
        : registration.registeredBy

    if (String(registeredBy) !== String(user.id)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
    }

    /**
     * 3. Get event
     */
    const event =
      typeof registration.event === 'object'
        ? registration.event
        : await payload.findByID({
            collection: 'events',
            id: registration.event,
            depth: 0,
          })

    if (!event) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 })
    }

    /**
     * 4. Get event price
     */
    const pricePerDelegate = Number(event.cost)

    if (!Number.isFinite(pricePerDelegate) || pricePerDelegate <= 0) {
      return NextResponse.json({ message: 'Event has an invalid price' }, { status: 400 })
    }

    const currency = event.currency || 'KES'

    /**
     * 5. Calculate invoice
     *
     * Example:
     * 1500 × 5 = 7500
     */
    const subtotal = pricePerDelegate * delegateCount
    const discount = 0
    const tax = 0
    const total = subtotal - discount + tax

    if (total <= 0) {
      return NextResponse.json({ message: 'Invalid invoice total' }, { status: 400 })
    }

    /**
     * 6. Generate invoice number
     */
    const invoiceNumber = `GLUNSINV-${crypto.randomUUID()}`

    /**
     * 7. Create invoice
     */
    const invoice = await payload.create({
      collection: 'invoices',
      data: {
        invoiceNumber,
        registration: registration.id,
        invoiceState: 'issued',
        issueDate: new Date().toISOString(),
        currency,
        subtotal,
        discount,
        tax,
        total,
        amountPaid: 0,
        balanceDue: total,
      },
    })

    /**
     * 8. Generate payment number/reference
     */
    const paymentNumber = `GLUNSPAY-${crypto.randomUUID()}`
    const transactionReference = `REG-${registration.id}-${crypto.randomUUID()}`

    /**
     * 9. Create pending payment
     */
    const payment = await payload.create({
      collection: 'payments',
      data: {
        paymentNumber,
        registration: registration.id,
        invoice: invoice.id,
        amount: total,
        currency,
        transactionReference,
        paymentState: 'pending',
        initiatedAt: new Date().toISOString(),
      },
    })

    /**
     * 10. Convert KES to smallest currency unit
     */
    const amountInSubunit = Math.round(total * 100)

    /**
     * 11. Initialize Paystack
     */
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: user.email,
        amount: amountInSubunit,
        currency,
        reference: transactionReference,

        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/callback`,

        metadata: {
          paymentId: payment.id,
          invoiceId: invoice.id,
          registrationId: registration.id,
        },
      }),
    })

    const data = await response.json()

    console.log('Paystack response:', {
      status: response.status,
      ok: response.ok,
      data,
    })

    if (!response.ok || !data?.status) {
      await payload.update({
        collection: 'payments',
        id: payment.id,
        data: {
          paymentState: 'failed',
          providerResponse: data,
        },
      })

      return NextResponse.json(
        {
          message: data?.message || 'Paystack initialization failed',
          paystackResponse: data,
        },
        { status: 400 },
      )
    }

    /**
     * 13. Save Paystack response for auditing
     */
    await payload.update({
      collection: 'payments',
      id: payment.id,
      data: {
        providerResponse: data.data,
      },
    })

    /**
     * 14. Return authorization URL
     */
    return NextResponse.json({
      authorization_url: data.data.authorization_url,
      access_code: data.data.access_code,
      reference: transactionReference,
      paymentId: payment.id,
      invoiceId: invoice.id,
      amount: total,
      currency,
    })
  } catch (error) {
    console.error('Paystack initialization error:', error)

    return NextResponse.json({ message: 'Payment initialization failed' }, { status: 500 })
  }
}
