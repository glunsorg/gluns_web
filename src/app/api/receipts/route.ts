import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(req: Request) {
  try {
    const payload = await getPayload({ config })
    const { user } = await payload.auth({
      headers: req.headers,
    })

    if (!user || user.collection !== 'users') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(req.url)
    const registrationId = url.searchParams.get('registrationId')

    const where: Record<string, any> = {
      recipient: { equals: user.id },
      receiptState: { equals: 'issued' },
    }

    if (registrationId) {
      where.registration = { equals: registrationId }
    }

    const result = await payload.find({
      collection: 'receipts',
      where,
      sort: '-issuedAt',
      limit: 100,
      depth: 2,
    })

    const receipts = await Promise.all(
      result.docs.map(async (receipt) => {
        const registration = receipt.registration
        const registrationId =
          typeof registration === 'object' && registration !== null ? registration.id : registration

        const delegates = await payload.find({
          collection: 'delegates',
          where: {
            registration: { equals: registrationId },
          },
          sort: 'fullName',
          limit: 500,
          depth: 0,
        })

        const event =
          typeof registration === 'object' && registration !== null ? registration.event : null

        const pdf = typeof receipt.pdf === 'object' && receipt.pdf !== null ? receipt.pdf : null

        return {
          id: receipt.id,
          receiptNumber: receipt.receiptNumber,
          amount: receipt.amount,
          currency: receipt.currency,
          paymentMethod: receipt.paymentMethod,
          transactionReference: receipt.transactionReference,
          issuedAt: receipt.issuedAt,
          receiptState: receipt.receiptState,
          registration:
            typeof registration === 'object' && registration !== null
              ? {
                  id: registration.id,
                  registrationNumber: registration.registrationNumber,
                  event:
                    typeof event === 'object' && event !== null
                      ? {
                          id: event.id,
                          name: 'name' in event ? event.name : null,
                          title: 'title' in event ? event.title : null,
                        }
                      : null,
                }
              : null,
          delegates: delegates.docs.map((delegate) => ({
            id: delegate.id,
            fullName: delegate.fullName,
            email: delegate.email,
            delegateState: delegate.delegateState,
          })),
          pdfUrl: pdf?.url ?? null,
        }
      }),
    )

    return NextResponse.json({
      docs: receipts,
      totalDocs: result.totalDocs,
    })
  } catch (error) {
    console.error('Error fetching payment history:', error)

    return NextResponse.json({ message: 'Unable to fetch payment history' }, { status: 500 })
  }
}
