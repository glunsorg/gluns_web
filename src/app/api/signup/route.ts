import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()
  const payloadBaseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const allowedRoles = new Set(['teacher', 'delegate'])
  const incomingRole = Array.isArray(body.roles)
    ? body.roles.find((role: string) => allowedRoles.has(role))
    : allowedRoles.has(body.roles)
      ? body.roles
      : undefined

  const role = incomingRole || 'teacher'

  // Create user
  const signupRes = await fetch(`${payloadBaseUrl}/api/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: body.email,
      password: body.password,
      roles: [role],
    }),
  })

  const signupData = await signupRes.json()

  if (!signupRes.ok) {
    return NextResponse.json(
      { message: signupData.errors?.[0]?.message || signupData.message || 'Signup failed' },
      { status: signupRes.status },
    )
  }

  // Log in the new user to get the HTTP-only cookie
  const loginRes = await fetch(`${payloadBaseUrl}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email: body.email, password: body.password }),
  })

  const loginData = await loginRes.json()

  if (!loginRes.ok) {
    return NextResponse.json(
      {
        message: loginData.errors?.[0]?.message || loginData.message || 'Login after signup failed',
      },
      { status: loginRes.status },
    )
  }

  // Grab the HTTP-only cookie from Payload CMS response
  const cookie = loginRes.headers.get('set-cookie')
  const response = NextResponse.json(loginData)
  if (cookie) response.headers.set('set-cookie', cookie)

  return response
}
