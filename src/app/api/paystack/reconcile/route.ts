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

  return NextResponse.json({ checked: registrationIds.length, fixed })
}
