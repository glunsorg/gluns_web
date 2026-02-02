export const dynamic = 'force-dynamic'

import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_PAYLOAD_URL
  const apiUrl = process.env.NEXT_PUBLIC_PAYLOAD_API_URL

  // Fetch multiple collections in parallel
  const [committeesRes, blogsRes] = await Promise.all([
    fetch(`${apiUrl}/committees`, { next: { revalidate: 3600 } }),
    fetch(`${apiUrl}/blog`, { next: { revalidate: 3600 } }),
  ])

  if (!committeesRes.ok) throw new Error(`Failed to fetch committees: ${committeesRes.statusText}`)
  if (!blogsRes.ok) throw new Error(`Failed to fetch blogs: ${blogsRes.statusText}`)

  const committeesData = await committeesRes.json()
  const committees: { slug: string }[] = committeesData.docs ?? []

  const blogsData = await blogsRes.json()
  const blogs: { slug: string }[] = blogsData.docs ?? []

  const committeeEntries: MetadataRoute.Sitemap = committees.map((c) => ({
    url: `${siteUrl}/committees/${c.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const blogEntries: MetadataRoute.Sitemap = blogs.map((b) => ({
    url: `${siteUrl}/blog/${b.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: 'https://www.gluns.org',
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
      url: `${siteUrl}/committees`,
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
      url: `${siteUrl}/delegation-portal`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/the-secretariat`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/authentication`,
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
    { url: `${siteUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  ]

  return [...staticPages, ...committeeEntries, ...blogEntries]
}
