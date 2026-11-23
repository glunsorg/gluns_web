import type { Payload } from 'payload'

export async function getRouteUser(payload: Payload, req: Request): Promise<any | null> {
  try {
    const { user } = await payload.auth({ headers: req.headers })

    if (!user || user.collection !== 'users') return null

    return user
  } catch {
    return null
  }
}

export function isAdminUser(user: any): boolean {
  return Array.isArray(user?.roles) && user.roles.includes('admin')
}

export function relationId(value: unknown): string | number | undefined {
  if (value == null) return undefined

  if (typeof value === 'object') {
    return relationId((value as { id?: unknown }).id)
  }

  return typeof value === 'string' || typeof value === 'number' ? value : undefined
}

/**
 * Loads a registration and checks that `user` owns it (admins always pass).
 * Returns the registration, or null when it does not exist or is not theirs.
 * Callers should answer "not found" for null so we never confirm whether
 * somebody else's registration exists.
 */
export async function getOwnedRegistration(
  payload: Payload,
  user: any,
  registrationId: string | number,
): Promise<any | null> {
  try {
    const id = /^\d+$/.test(String(registrationId)) ? Number(registrationId) : registrationId

    const registration = await payload.findByID({
      collection: 'registrations',
      id,
      depth: 0,
      overrideAccess: true,
    })

    if (!registration) return null

    if (isAdminUser(user)) return registration

    return String(relationId(registration.registeredBy)) === String(user.id) ? registration : null
  } catch {
    return null
  }
}
