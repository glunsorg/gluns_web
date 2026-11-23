// import { NextResponse } from 'next/server'
// import { getPayload, Payload } from 'payload'
// import config from '@payload-config'

// export async function GET(req: Request) {
//   const payload = await getPayload({ config })
//   const { user } = await payload.auth({ headers: req.headers })

//   if (!user) {
//     return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
//   }

//   if (user.collection !== 'users') {
//     return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
//   }

//   const url = new URL(req.url)
//   const registrationId = url.searchParams.get('registrationId')

//   if (!registrationId) {
//     return NextResponse.json({ paymentStatus: 'pending' })
//   }

//   const payments = await payload.find({
//     collection: 'payments',
//     where: {
//       user: { equals: user.id },
//       delegation: { equals: registrationId },
//       status: { equals: 'successful' },
//     },
//     limit: 1,
//   })

//   return NextResponse.json({
//     paymentStatus: payments.docs.length > 0 ? 'successful' : 'pending',
//   })
// }

// export async function POST(req: Request) {
//   const payload: Payload = await getPayload({ config })

//   // Authenticate user
//   const { user } = await payload.auth({ headers: req.headers })
//   if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

//   try {
//     // Fetch all payments for this user (any status)
//     const payments = await payload.find({
//       collection: 'payments',
//       where: { user: { equals: user.id } },
//       limit: 0,
//     })

//     return NextResponse.json({ payments: payments.docs })
//   } catch (error) {
//     console.error('Error fetching payments:', error)
//     return NextResponse.json({ message: 'Failed to fetch payments' }, { status: 500 })
//   }
// }

import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(req: Request) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: req.headers })

  if (!user || user.collection !== 'users') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const url = new URL(req.url)
  const registrationId = url.searchParams.get('registrationId')

  if (!registrationId) {
    return NextResponse.json({ paymentStatus: 'pending', payments: [] }, { status: 200 })
  }

  const registration = await payload
    .findByID({
      collection: 'registrations',
      id: registrationId,
      depth: 0,
    })
    .catch(() => null)

  if (!registration) {
    return NextResponse.json({ message: 'Registration not found' }, { status: 404 })
  }

  const registeredBy =
    typeof registration.registeredBy === 'object'
      ? registration.registeredBy.id
      : registration.registeredBy

  if (String(registeredBy) !== String(user.id)) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
  }

  const payments = await payload.find({
    collection: 'payments',
    where: {
      and: [
        { registration: { equals: registrationId } },
        { paymentState: { equals: 'successful' } },
      ],
    },
    limit: 0,
    depth: 1,
  })

  return NextResponse.json({
    paymentStatus: payments.docs.length > 0 ? 'successful' : 'pending',
    payments: payments.docs,
  })
}
