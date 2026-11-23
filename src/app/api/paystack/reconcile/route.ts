/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * ONE-OFF REPAIR (admin only).
 *
 * Finds registrations that already have a paid invoice but are still not
 * "completed" (the teacher bug), completes them and confirms their delegates.
 *
 * Call once while logged in as an admin:
 *   POST /api/paystack/reconcile
 * Delete this file afterwards if you don't want to keep it.
 */
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { uploadReceiptPdf } from '@/lib/receipts/uploadReceiptPdf'

export async function POST(req: Request) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: req.headers })

  if (!user || !Array.isArray(user.roles) || !user.roles.includes('admin')) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
  }

  const paidInvoices = await payload.find({
    collection: 'invoices',
    where: { invoiceState: { equals: 'paid' } },
    limit: 0,
    depth: 0,
    overrideAccess: true,
  })

  const registrationIds = Array.from(
    new Set(
      paidInvoices.docs.map((i) =>
        typeof i.registration === 'object' ? i.registration.id : i.registration,
      ),
    ),
  )

  const fixed: Array<string | number> = []

  for (const registrationId of registrationIds) {
    const registration = await payload.findByID({
      collection: 'registrations',
      id: registrationId,
      depth: 0,
      overrideAccess: true,
    })

    if (registration.registrationState === 'completed') continue

    await payload.update({
      collection: 'registrations',
      id: registrationId,
      data: { registrationState: 'completed' },
      overrideAccess: true,
    })

    // Only confirm delegates that existed when the latest paid invoice was
    // issued. Delegates added afterwards have not been paid for.
    const latestPaidIssueDate = paidInvoices.docs
      .filter(
        (i) =>
          String(typeof i.registration === 'object' ? i.registration.id : i.registration) ===
          String(registrationId),
      )
      .map((i) => String(i.issueDate))
      .sort()
      .pop()

    await payload.update({
      collection: 'delegates',
      where: {
        and: [
          { registration: { equals: registrationId } },
          { delegateState: { equals: 'pending' } },
          ...(latestPaidIssueDate ? [{ createdAt: { less_than_equal: latestPaidIssueDate } }] : []),
        ],
      },
      data: { delegateState: 'confirmed' },
      overrideAccess: true,
    })

    fixed.push(registrationId)
  }

  // Retry receipts that were issued but never got their PDF (for example,
  // when PDF generation failed on the server).
  const receiptsWithoutPdf = await payload.find({
    collection: 'receipts',
    where: { pdf: { exists: false } },
    limit: 0,
    depth: 1,
    overrideAccess: true,
  })

  const pdfRegenerated: Array<string | number> = []
  const pdfFailed: Array<string | number> = []

  for (const receipt of receiptsWithoutPdf.docs as any[]) {
    try {
      const recipient = typeof receipt.recipient === 'object' ? receipt.recipient : null
      const registration = typeof receipt.registration === 'object' ? receipt.registration : null
      const invoice = typeof receipt.invoice === 'object' ? receipt.invoice : null
      const paymentDoc = typeof receipt.payment === 'object' ? receipt.payment : null

      await uploadReceiptPdf(payload, receipt.id, {
        receiptNumber: receipt.receiptNumber,
        payerName: recipient?.fullName || recipient?.email || 'GLUNS registrant',
        registrationNumber: String(registration?.registrationNumber ?? ''),
        invoiceNumber: String(invoice?.invoiceNumber ?? ''),
        amount: Number(receipt.amount),
        currency: receipt.currency,
        paymentMethod: receipt.paymentMethod || 'Paystack',
        transactionReference: String(
          receipt.transactionReference ?? paymentDoc?.transactionReference ?? '',
        ),
        paidAt: String(paymentDoc?.paidAt || receipt.issuedAt),
        issuedAt: String(receipt.issuedAt),
      })

      pdfRegenerated.push(receipt.id)
    } catch (err) {
      console.error(`Could not regenerate PDF for receipt ${receipt.id}:`, err)
      pdfFailed.push(receipt.id)
    }
  }

  return NextResponse.json({
    checked: registrationIds.length,
    fixed,
    receiptPdfsRegenerated: pdfRegenerated,
    receiptPdfsStillFailing: pdfFailed,
  })
}
