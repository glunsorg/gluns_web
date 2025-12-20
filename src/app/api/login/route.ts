import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()

  const payloadRes = await fetch(`${process.env.PAYLOAD_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  })

  const data = await payloadRes.json()

  if (!payloadRes.ok) {
    return NextResponse.json(data, { status: 401 })
  }

  return NextResponse.json(data)
}
