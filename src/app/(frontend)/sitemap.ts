export const dynamic = 'force-dynamic'

import type { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/utils'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl()
  const apiUrl = (process.env.PAYLOAD_API_URL || siteUrl).replace(/\/$/, '')
  const payloadApiUrl = apiUrl.endsWith('/api') ? apiUrl : `${apiUrl}/api`

  // Fetch multiple collections in parallel
  const [committeesRes, eventsRes] = await Promise.all([
    fetch(`${payloadApiUrl}/organs?limit=1000`, { next: { revalidate: 3600 } }),
    fetch(`${payloadApiUrl}/events?limit=1000`, { next: { revalidate: 3600 } }),
  ])

  if (!committeesRes.ok) throw new Error(`Failed to fetch committees: ${committeesRes.statusText}`)
  if (!eventsRes.ok) throw new Error(`Failed to fetch events: ${eventsRes.statusText}`)
  const committeesData = await committeesRes.json()
  const committees: { slug: string }[] = committeesData.docs ?? []

  const eventsData = await eventsRes.json()
  const events: { slug: string }[] = eventsData.docs ?? []

  const committeeEntries: MetadataRoute.Sitemap = committees.map((c) => ({
    url: `${siteUrl}/organs/${c.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const eventEntries: MetadataRoute.Sitemap = events.map((e) => ({
    url: `${siteUrl}/events/${e.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/events`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/organs`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${siteUrl}/the-secretariat`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/registration`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${siteUrl}/sponsors`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    { url: `${siteUrl}/faqs`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ]

  return [...staticPages, ...committeeEntries, ...eventEntries]
}
