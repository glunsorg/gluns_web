import { NextResponse } from 'next/server'
import { getSiteUrl } from '@/lib/utils'

export async function GET() {
  const base = getSiteUrl()
  const sitemap = `${base}/sitemap.xml`

  const lines = [
    'User-agent: *',
    'Disallow: /api/',
    'Disallow: /admin/',
    'Disallow: /delegation-portal',
    'Disallow: /payments/',
    'Disallow: /forgot-password',
    'Disallow: /reset-password',

    'Allow: /',
    '',
    `Sitemap: ${sitemap}`,
  ]

  return new NextResponse(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}
