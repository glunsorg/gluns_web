import { NextResponse } from 'next/server'
import config from '@/payload.config'
import { getPayload } from 'payload'

export const runtime = 'nodejs'

type SignupRole = 'teacher' | 'delegate'

function normalizeInstitutionName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\b(high\s*school|highschool|schools?|school)\b/g, '')
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function errorResponse(message: string, status: number) {
  return NextResponse.json({ message }, { status })
}

export async function POST(req: Request) {
  let createdInstitutionId: number | string | undefined
  let payload: Awaited<ReturnType<typeof getPayload>> | undefined

  try {
    const body: unknown = await req.json().catch(() => null)

    if (!body || typeof body !== 'object') {
      return errorResponse('Invalid signup request.', 400)
    }

    const data = body as Record<string, unknown>

    const fullName = typeof data.fullName === 'string' ? data.fullName.trim() : ''
    const email = typeof data.email === 'string' ? data.email.trim().toLowerCase() : ''
    const password = typeof data.password === 'string' ? data.password : ''
    const institutionName =
      typeof data.institutionName === 'string' ? data.institutionName.trim() : ''

    const incomingRoles = Array.isArray(data.roles) ? data.roles : [data.roles]

    if (
      incomingRoles.length !== 1 ||
      (incomingRoles[0] !== 'teacher' && incomingRoles[0] !== 'delegate')
    ) {
      return errorResponse('Please select a valid signup role.', 400)
    }

    const role = incomingRoles[0] as SignupRole

    if (!fullName || !email || !password) {
      return errorResponse('Name, email, and password are required.', 400)
    }

    // Keep this consistent with your existing password policy.
    if (password.length < 8) {
      return errorResponse('Password must be at least 8 characters long.', 400)
    }

    if (role === 'teacher' && !institutionName) {
      return errorResponse('Institution name is required for teachers.', 400)
    }

    payload = await getPayload({ config: await config })

    let institutionId: number | undefined

    if (role === 'teacher') {
      const normalizedName = normalizeInstitutionName(institutionName)

      if (!normalizedName) {
        return errorResponse('Please enter a valid institution name.', 400)
      }

      const existingInstitution = await payload.find({
        collection: 'institutions',
        where: {
          normalizedName: { equals: normalizedName },
        },
        limit: 1,
        overrideAccess: true,
      })

      if (existingInstitution.docs.length > 0) {
        return errorResponse(
          'This institution is already registered. Please contact the secretariat for assistance.',
          409,
        )
      }

      const institution = await payload.create({
        collection: 'institutions',
        data: {
          name: institutionName,
          normalizedName,
        },
        draft: false,
        overrideAccess: true,
      })

      institutionId = institution.id
      createdInstitutionId = institution.id
    }

    // Never accept an institution relationship ID from the client.
    await payload.create({
      collection: 'users',
      data: {
        fullName,
        email,
        password,
        roles: [role],
        ...(role === 'teacher'
          ? { institution: institutionId! }
          : institutionName
            ? { institutionName }
            : {}),
      },
      overrideAccess: true,
    })

    // The user now exists, so do not delete the institution if login fails.
    createdInstitutionId = undefined

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

    if (!baseUrl) {
      console.error('NEXT_PUBLIC_BASE_URL is not configured.')

      return NextResponse.json(
        {
          loginRequired: true,
          message:
            'Your account was created, but automatic login is unavailable. Please sign in manually.',
        },
        { status: 200 },
      )
    }

    const loginRes = await fetch(`${baseUrl}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      cache: 'no-store',
    })

    const loginData = await loginRes.json().catch(() => ({}))

    if (!loginRes.ok) {
      return NextResponse.json(
        {
          message: 'Your account was created, but automatic login failed. Please sign in manually.',
        },
        { status: 201 },
      )
    }

    const response = NextResponse.json(loginData)

    // Forward the Payload session cookie to the browser.
    const cookie = loginRes.headers.get('set-cookie')
    if (cookie) {
      response.headers.set('set-cookie', cookie)
    }

    return response
  } catch (error) {
    // If user creation failed after creating a new institution,
    // attempt to clean up that institution.
    if (payload && createdInstitutionId !== undefined) {
      try {
        await payload.delete({
          collection: 'institutions',
          id: createdInstitutionId,
          overrideAccess: true,
        })
      } catch (cleanupError) {
        console.error('Institution cleanup failed:', cleanupError)
      }
    }

    const errorText = error instanceof Error ? error.message.toLowerCase() : ''

    // The unique database index is the final protection against
    // two simultaneous requests registering the same institution.
    if (errorText.includes('unique constraint') || errorText.includes('duplicate key')) {
      return errorResponse(
        'This email or institution may already be registered. Please check your details or contact the secretariat.',
        409,
      )
    }

    console.error('Signup failed.')
    return errorResponse('Signup failed. Please try again.', 500)
  }
}
