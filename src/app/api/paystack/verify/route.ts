export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { randomUUID } from 'node:crypto'
import { getPayload } from 'payload'
import config from '@payload-config'
import { uploadReceiptPdf } from '@/lib/receipts/uploadReceiptPdf'

type RelationshipValue = string | number | { id: string | number } | null | undefined

function getRelationshipId(value: RelationshipValue): string | number | undefined {
  if (value == null) return undefined
  return typeof value === 'object' ? value.id : value
}

function getNumericRelationshipId(value: RelationshipValue, fieldName: string): number {
  const id = getRelationshipId(value)
  const numericId = typeof id === 'number' ? id : Number(id)

  if (id == null || !Number.isSafeInteger(numericId) || numericId <= 0) {
    throw new Error(`Invalid numeric relationship ID: ${fieldName}`)
  }

  return numericId
}

function generateReceiptNumber(): string {
  const year = new Date().getFullYear()
  const suffix = randomUUID().replace(/-/g, '').slice(0, 12).toUpperCase()

  return `GLUNS-RCT-${year}-${suffix}`
}

function redirectTo(appUrl: string, path: string) {
  return NextResponse.redirect(new URL(path, appUrl))
}

export async function GET(req: Request) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL
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

  let currentStep = 'initialization'

  try {
    const payload = await getPayload({ config })

    currentStep = 'verify Paystack transaction'

    // 1. Verify the transaction with Paystack.
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
        cache: 'no-store',
      },
    )

    if (!response.ok) {
      console.error('Paystack verification request failed:', response.status)
      return redirectTo(appUrl, '/payments/failed')
    }

    const result = await response.json()
    const data = result?.data

    if (result?.status !== true || !data) {
      console.error('Paystack verification failed:', result?.message)
      return redirectTo(appUrl, '/payments/failed')
    }

    if (data.status !== 'success') {
      return redirectTo(appUrl, '/payments/failed')
    }

    // 2. Find the local payment record.
    currentStep = 'find local payment'

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

    if (!payment) {
      console.error('No payment found for reference:', reference)
      return redirectTo(appUrl, '/payments/failed')
    }

    const registrationId = getRelationshipId(payment.registration)
    const invoiceId = getRelationshipId(payment.invoice)

    if (registrationId == null || invoiceId == null) {
      throw new Error('Payment is missing its registration or invoice')
    }

    // 3. Validate reference, amount and currency.
    // Assumes local amounts are stored in major currency units.
    currentStep = 'validate payment'

    const expectedAmount = Math.round(Number(payment.amount) * 100)
    const expectedCurrency = String(payment.currency).toUpperCase()

    if (
      data.reference !== reference ||
      !Number.isFinite(expectedAmount) ||
      expectedAmount <= 0 ||
      Number(data.amount) !== expectedAmount ||
      String(data.currency).toUpperCase() !== expectedCurrency
    ) {
      console.error('Paystack payment mismatch:', {
        reference,
        returnedReference: data.reference,
        expectedAmount,
        returnedAmount: data.amount,
        expectedCurrency,
        returnedCurrency: data.currency,
      })

      return redirectTo(appUrl, '/payments/failed')
    }

    // 4. Load the registration and invoice.
    currentStep = 'load registration and invoice'

    const [registration, invoice] = await Promise.all([
      payload.findByID({
        collection: 'registrations',
        id: registrationId,
        depth: 0,
        overrideAccess: true,
      }),
      payload.findByID({
        collection: 'invoices',
        id: invoiceId,
        depth: 0,
        overrideAccess: true,
      }),
    ])

    if (String(getRelationshipId(invoice.registration)) !== String(registrationId)) {
      throw new Error('Invoice does not belong to this registration')
    }

    if (String(invoice.currency).toUpperCase() !== expectedCurrency) {
      throw new Error('Payment currency does not match invoice currency')
    }

    if (['cancelled', 'void'].includes(invoice.invoiceState)) {
      throw new Error('Cannot finalize payment against a cancelled or void invoice')
    }

    const recipientId = getRelationshipId(registration.registeredBy)

    if (recipientId == null) {
      throw new Error('Registration has no registeredBy user')
    }

    const batchId = getRelationshipId(invoice.batch)

    // 5. Mark the payment successful.
    // Do not return early if it was already successful:
    // a previous callback may have failed to create its receipt.
    currentStep = 'update payment and invoice'

    if (payment.paymentState !== 'successful') {
      await payload.update({
        collection: 'payments',
        id: payment.id,
        data: {
          paymentState: 'successful',
          providerResponse: data,
          paidAt: data.paid_at || new Date().toISOString(),
        },
        overrideAccess: true,
      })
    }

    // 6. Recalculate invoice totals from successful payments.

    const successfulPayments = await payload.find({
      collection: 'payments',
      where: {
        and: [{ invoice: { equals: invoiceId } }, { paymentState: { equals: 'successful' } }],
      },
      limit: 0,
      depth: 0,
      overrideAccess: true,
    })

    const amountPaid = Number(
      successfulPayments.docs
        .filter((item) => String(item.currency).toUpperCase() === expectedCurrency)
        .reduce((sum, item) => sum + Number(item.amount), 0)
        .toFixed(2),
    )

    const invoiceTotal = Number(invoice.total)

    if (!Number.isFinite(invoiceTotal) || invoiceTotal < 0 || !Number.isFinite(amountPaid)) {
      throw new Error('Invoice contains invalid monetary values')
    }

    // Do not silently over-allocate payment to an invoice.
    if (amountPaid > invoiceTotal + 0.001) {
      throw new Error('Successful payments exceed the invoice total')
    }

    const balanceDue = Number(Math.max(invoiceTotal - amountPaid, 0).toFixed(2))

    const invoiceState = balanceDue === 0 ? 'paid' : amountPaid > 0 ? 'partially_paid' : 'issued'

    await payload.update({
      collection: 'invoices',
      id: invoiceId,
      data: {
        invoiceState,
        amountPaid,
        balanceDue,
      },
      overrideAccess: true,
    })

    // 7. Mark only the invoice's batch as paid.
    if (batchId != null && invoiceState === 'paid') {
      await payload.update({
        collection: 'registration-batches',
        id: batchId,
        data: {
          batchState: 'paid',
        },
        overrideAccess: true,
      })

      // Confirm only delegates in the paid batch.
      await payload.update({
        collection: 'delegates',
        where: {
          and: [{ registration: { equals: registrationId } }, { batch: { equals: batchId } }],
        },
        data: {
          delegateState: 'confirmed',
        },
        overrideAccess: true,
      })
    }

    // 8. Complete the registration only when all active invoices
    // are paid. Ignore cancelled and void invoices.
    const registrationInvoices = await payload.find({
      collection: 'invoices',
      where: {
        registration: { equals: registrationId },
      },
      limit: 0,
      depth: 0,
      overrideAccess: true,
    })

    const activeInvoices = registrationInvoices.docs.filter(
      (item) => !['cancelled', 'void'].includes(item.invoiceState),
    )

    const allInvoicesPaid =
      activeInvoices.length > 0 && activeInvoices.every((item) => item.invoiceState === 'paid')

    if (allInvoicesPaid) {
      await payload.update({
        collection: 'registrations',
        id: registrationId,
        data: {
          registrationState: 'completed',
        },
        overrideAccess: true,
      })

      // Ensure delegates are confirmed even if they belong to
      // a registration without batch-specific invoices.
      await payload.update({
        collection: 'delegates',
        where: {
          registration: { equals: registrationId },
        },
        data: {
          delegateState: 'confirmed',
        },
        overrideAccess: true,
      })
    }

    // 9. Create one receipt per successful payment.

    // 9. Find or create one receipt per successful payment.
    currentStep = 'create receipt'

    const existingReceipts = await payload.find({
      collection: 'receipts',
      where: {
        payment: { equals: payment.id },
      },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })

    let receipt = existingReceipts.docs[0]

    const numericRegistrationId = getNumericRelationshipId(registrationId, 'registration')

    const numericInvoiceId = getNumericRelationshipId(invoiceId, 'invoice')

    const numericRecipientId = getNumericRelationshipId(recipientId, 'recipient')

    if (!receipt) {
      try {
        receipt = await payload.create({
          collection: 'receipts',
          data: {
            receiptNumber: generateReceiptNumber(),
            payment: payment.id,
            invoice: numericInvoiceId,
            registration: numericRegistrationId,
            recipient: numericRecipientId,
            amount: Number(payment.amount),
            currency: payment.currency,
            paymentMethod: 'Paystack',
            transactionReference: reference,
            issuedAt: new Date().toISOString(),
            receiptState: 'issued',
          },
          overrideAccess: true,
        })
      } catch (error) {
        // A concurrent callback may have created the receipt.
        const receiptsAfterError = await payload.find({
          collection: 'receipts',
          where: {
            payment: { equals: payment.id },
          },
          limit: 1,
          depth: 0,
          overrideAccess: true,
        })

        receipt = receiptsAfterError.docs[0]

        if (!receipt) {
          throw error
        }
      }
    }

    // 10. Generate the PDF if the receipt does not have one.
    currentStep = 'generate receipt PDF'

    const receiptPdfId =
      typeof receipt.pdf === 'object' && receipt.pdf !== null ? receipt.pdf.id : receipt.pdf

    if (!receiptPdfId) {
      const recipient = await payload.findByID({
        collection: 'users',
        id: recipientId,
        depth: 0,
        overrideAccess: true,
      })

      await uploadReceiptPdf(payload, receipt.id, {
        receiptNumber: receipt.receiptNumber,
        payerName: recipient.fullName || recipient.email || 'GLUNS registrant',
        registrationNumber: String(registration.registrationNumber),
        invoiceNumber: String(invoice.invoiceNumber),
        amount: Number(payment.amount),
        currency: payment.currency,
        paymentMethod: 'Paystack',
        transactionReference: reference,
        paidAt: String(payment.paidAt || new Date().toISOString()),
        issuedAt: String(receipt.issuedAt),
      })
    }

    return redirectTo(appUrl, `/payments/success?reference=${encodeURIComponent(reference)}`)
  } catch (error) {
    console.error(`[Payment callback] Failed during: ${currentStep}`)
    console.error('[Payment callback] Error details:', error)

    return redirectTo(appUrl, '/payments/error')
  }
}
