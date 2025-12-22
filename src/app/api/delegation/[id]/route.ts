// app/api/delegation/[id]/route.ts
import { NextResponse } from 'next/server'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: number }> }) {
  const { id } = await params
  const body = await req.json()

  if (!id) return NextResponse.json({ message: 'Delegation ID is required' }, { status: 400 })

  const res = await fetch(`${process.env.PAYLOAD_URL}/api/delegation-applications/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${process.env.PAYLOAD_SECRET}`, // admin token
    },
    body: JSON.stringify(body),
  })

  const data = await res.json()

  if (!res.ok) {
    return NextResponse.json(
      { message: data.message || 'Failed to update delegation' },
      { status: 400 },
    )
  }

  return NextResponse.json(data)
}
