import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function GET(req: Request, { params }: RouteContext) {
  try {
    const { id } = await params

    const payload = await getPayload({ config })

    const { user } = await payload.auth({
      headers: req.headers,
    })

    if (!user || user.collection !== 'users') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Find the receipt belonging to this authenticated user.
    const result = await payload.find({
      collection: 'receipts',
      where: {
        and: [
          { id: { equals: id } },
          { recipient: { equals: user.id } },
          { receiptState: { equals: 'issued' } },
        ],
      },
      limit: 1,
      depth: 1,
      overrideAccess: false,
      user,
    })

    const receipt = result.docs[0]

    if (!receipt) {
      return NextResponse.json({ message: 'Receipt not found' }, { status: 404 })
    }

    const media = typeof receipt.pdf === 'object' && receipt.pdf !== null ? receipt.pdf : null

    if (!media) {
      return NextResponse.json({ message: 'Receipt PDF is not available' }, { status: 404 })
    }

    // Use the media ID to retrieve the uploaded file.
    const mediaId = media.id

    const mediaResult = await payload.find({
      collection: 'media',
      where: {
        id: { equals: mediaId },
      },
      limit: 1,
      overrideAccess: false,
      user,
    })

    if (!mediaResult.docs.length) {
      return NextResponse.json({ message: 'Receipt PDF not found' }, { status: 404 })
    }

    const fileUrl = media.url

    if (!fileUrl) {
      return NextResponse.json({ message: 'Receipt PDF file is unavailable' }, { status: 404 })
    }

    // This implementation assumes Payload serves media from
    // a trusted, publicly readable URL. For private storage,
    // retrieve the file through your storage adapter instead.
    const baseUrl = new URL(req.url).origin
    const resolvedUrl = new URL(fileUrl, baseUrl)

    // Do not allow this endpoint to fetch arbitrary external URLs.
    if (resolvedUrl.origin !== baseUrl) {
      return NextResponse.json(
        { message: 'Unsupported file storage configuration' },
        { status: 500 },
      )
    }

    const fileResponse = await fetch(resolvedUrl, {
      cache: 'no-store',
    })

    if (!fileResponse.ok || !fileResponse.body) {
      return NextResponse.json({ message: 'Unable to retrieve receipt PDF' }, { status: 502 })
    }

    const safeReceiptNumber = receipt.receiptNumber.replace(/[^a-zA-Z0-9_-]/g, '_')

    return new Response(fileResponse.body, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${safeReceiptNumber}.pdf"`,
        'Cache-Control': 'private, no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch (error) {
    console.error('Receipt download failed:', error)

    return NextResponse.json({ message: 'Unable to download receipt' }, { status: 500 })
  }
}
