import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getOwnedRegistration, getRouteUser } from '@/lib/routeAuth'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const payload = await getPayload({ config })

  const user = await getRouteUser(payload, req)
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params

    const registration = await getOwnedRegistration(payload, user, id)
    if (!registration) {
      return NextResponse.json({ message: 'Registration not found' }, { status: 404 })
    }

    const delegates = await payload.find({
      collection: 'delegates',
      where: { registration: { equals: registration.id } },
      limit: 0,
      depth: 0,
      overrideAccess: true,
    })

    return NextResponse.json({ delegates: delegates.docs })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ message: 'Failed to fetch delegates' }, { status: 500 })
  }
}
