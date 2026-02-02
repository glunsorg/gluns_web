export const dynamic = 'force-dynamic'

import React from 'react'
import BlogHero from '@/components/blogpage/BlogHero'
import BlogList from '@/components/blogpage/BlogList'
import PaginationComponent from '@/components/navigation/PaginationComponent'
import { fetchAllPosts } from '@/data/blogFetch'

type Props = {
  searchParams?: Promise<{
    page?: string
  }>
}

export const metadata = {
  title: 'Publications & Blog | GLUNS – Model United Nations Kenya, Africa & Worldwide',
  description:
    'Explore GLUNS publications and blog articles covering Model United Nations, global affairs, diplomacy, youth leadership, and international relations in Kenya, across Africa, and worldwide.',
  metadataBase: new URL(`${process.env.NEXT_PUBLIC_PAYLOAD_URL}`),

  openGraph: {
    title: 'GLUNS Publications & Blog – Global MUN Insights',
    description:
      'Read expert insights from GLUNS on Model United Nations, international diplomacy, global leadership, and youth engagement across Kenya, Africa, and the world.',
    url: `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/publications`,
    images: [
      {
        url: '/seo/publications.jpg',
        width: 1200,
        height: 630,
        alt: 'GLUNS Publications and Blog',
      },
    ],
    type: 'website',
    locale: 'en_KE',
  },

  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/blog`,
  },

  keywords: [
    // Brand
    'GLUNS',
    'Global Leaders United Nations Symposium',

    // Content Focus
    'Model United Nations blog',
    'MUN publications',
    'Model UN articles',

    // Geography
    'Model United Nations Kenya',
    'MUN Kenya',
    'Model United Nations Africa',
    'MUN Africa',
    'International Model United Nations',

    // Thought Leadership
    'Global affairs analysis',
    'Youth diplomacy',
    'International relations',
    'Student leadership articles',
    'Global education insights',
  ],
}

export default async function BlogPage({ searchParams }: Props) {
  const resolvedParams = await searchParams

  const currentPage = Number(resolvedParams?.page) || 1
  const { posts, pagination } = await fetchAllPosts(currentPage)

  return (
    <>
      <BlogHero />
      <section className="py-12 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogList key={post.id} post={post} />
          ))}
        </div>

        <PaginationComponent totalPages={pagination.totalPages} />
      </section>
    </>
  )
}
