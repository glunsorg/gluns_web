import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()

  const res = await fetch(`${process.env.PAYLOAD_URL}/api/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(body),
  })

  const data = await res.json()
  console.log('Signup response data:', data)

  if (!res.ok) {
    return NextResponse.json(
      { message: data.errors?.[0]?.message || 'Signup failed' },
      { status: 400 },
    )
  }

  return NextResponse.json(data)
}
