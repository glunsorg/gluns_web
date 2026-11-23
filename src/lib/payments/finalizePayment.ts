/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Shared "a Paystack payment succeeded" logic.
 *
 * Used by BOTH:
 *   - /api/paystack/verify   (the browser coming back from Paystack)
 *   - /api/paystack/webhook  (Paystack calling the server directly)
 *
 * Keeping it in one place means the two paths can never disagree. It is safe
 * to run more than once for the same payment (idempotent).
 */
import { randomUUID } from 'node:crypto'
import type { Payload } from 'payload'
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

export class PaymentFinalizeError extends Error {
  step: string

  constructor(step: string, cause: unknown) {
    super(cause instanceof Error ? cause.message : String(cause))
    this.name = 'PaymentFinalizeError'
    this.step = step
  }
}

export type FinalizeResult =
  | { status: 'success' }
  | { status: 'not_found' } // no local payment has this reference
  | { status: 'mismatch' } // amount / currency / reference do not match

/**
 * Asks Paystack whether a transaction really succeeded.
 * Returns the transaction data only when Paystack says it was successful.
 */
export async function verifyWithPaystack(
  reference: string,
  secretKey: string,
): Promise<{ ok: true; data: any } | { ok: false; reason: string }> {
  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    {
      method: 'GET',
      headers: { Authorization: `Bearer ${secretKey}` },
      cache: 'no-store',
    },
  )

  if (!response.ok) {
    return { ok: false, reason: `Paystack verification request failed (${response.status})` }
  }

  const result = await response.json()
  const data = result?.data

  if (result?.status !== true || !data) {
    return { ok: false, reason: result?.message || 'Paystack verification failed' }
  }

  if (data.status !== 'success') {
    return { ok: false, reason: `Transaction status is "${data.status}"` }
  }

  return { ok: true, data }
}

// If the browser callback and the webhook arrive at the same moment, make the
// second one wait for the first instead of running the same work twice.
const inFlight = new Map<string, Promise<FinalizeResult>>()

export function finalizeSuccessfulPayment(
  payload: Payload,
  reference: string,
  data: any,
): Promise<FinalizeResult> {
  const existing = inFlight.get(reference)
  if (existing) return existing

  const run = runFinalize(payload, reference, data).finally(() => {
    inFlight.delete(reference)
  })

  inFlight.set(reference, run)
  return run
}

async function runFinalize(
  payload: Payload,
  reference: string,
  data: any,
): Promise<FinalizeResult> {
  let currentStep = 'initialization'

  try {
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
      return { status: 'not_found' }
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

      return { status: 'mismatch' }
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
          and: [
            { registration: { equals: registrationId } },
            { batch: { equals: batchId } },
            { delegateState: { equals: 'pending' } },
          ],
        },
        data: {
          delegateState: 'confirmed',
        },
        overrideAccess: true,
      })
    }

    // 8. Complete the registration once every invoice that matters is paid.
    //
    // Every click on "Start payment" creates a new invoice. If the user
    // abandons Paystack (closes the tab, goes back, card declined), that
    // invoice stays "issued" with nothing paid against it forever. Those
    // abandoned attempts must NOT block completion, otherwise a registration
    // that has attempted payment more than once (typical for teachers) never
    // leaves "draft". An invoice only counts if it is the one just paid, or
    // if money has actually been received against it.
    currentStep = 'complete registration'

    const registrationInvoices = await payload.find({
      collection: 'invoices',
      where: {
        registration: { equals: registrationId },
      },
      limit: 0,
      depth: 0,
      overrideAccess: true,
    })

    const relevantInvoices = registrationInvoices.docs.filter((item) => {
      if (['cancelled', 'void'].includes(item.invoiceState)) return false
      if (String(item.id) === String(invoiceId)) return true
      return Number(item.amountPaid || 0) > 0
    })

    const allInvoicesPaid =
      relevantInvoices.length > 0 && relevantInvoices.every((item) => item.invoiceState === 'paid')

    if (allInvoicesPaid) {
      await payload.update({
        collection: 'registrations',
        id: registrationId,
        data: {
          registrationState: 'completed',
        },
        overrideAccess: true,
      })

      // Invoices with a batch already confirmed their own delegates in
      // step 7. For an invoice without a batch (older data), confirm the
      // delegates still waiting for payment. Never touch cancelled ones.
      if (batchId == null) {
        const confirmed = await payload.update({
          collection: 'delegates',
          where: {
            and: [
              { registration: { equals: registrationId } },
              { delegateState: { equals: 'pending' } },
            ],
          },
          data: {
            delegateState: 'confirmed',
          },
          overrideAccess: true,
        })

        if (confirmed.errors?.length) {
          console.error(
            '[Payment callback] Some delegates could not be confirmed:',
            confirmed.errors,
          )
        }
      }

      // Tidy up: void the abandoned, never-paid invoices so they stop
      // cluttering the admin panel and can never block anything later.
      for (const item of registrationInvoices.docs) {
        const abandoned =
          String(item.id) !== String(invoiceId) &&
          !['paid', 'partially_paid', 'cancelled', 'void'].includes(item.invoiceState) &&
          Number(item.amountPaid || 0) === 0

        if (abandoned) {
          await payload.update({
            collection: 'invoices',
            id: item.id,
            data: { invoiceState: 'void' },
            overrideAccess: true,
          })
        }
      }
    }

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
    //
    // By this point the money is received, the registration is completed and
    // the receipt record exists. A failure while drawing or uploading the PDF
    // must NOT make the payment look failed (the customer would be sent to
    // the failed page, and Paystack would keep retrying the webhook). So we
    // log it and carry on; the receipt can be regenerated later.
    currentStep = 'generate receipt PDF'

    const receiptPdfId =
      typeof receipt.pdf === 'object' && receipt.pdf !== null ? receipt.pdf.id : receipt.pdf

    if (!receiptPdfId) {
      try {
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
      } catch (pdfError) {
        console.error(
          `[Payment] Receipt ${receipt.receiptNumber} was created but its PDF could not be generated. ` +
            'Run POST /api/paystack/reconcile to retry.',
          pdfError,
        )
      }
    }

    return { status: 'success' }
  } catch (error) {
    throw new PaymentFinalizeError(currentStep, error)
  }
}
