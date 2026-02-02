export const dynamic = 'force-dynamic'

import React from 'react'
import config from '@/payload.config'
import { getPayload } from 'payload'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { fetchAllPosts } from '@/data/blogFetch'
import { SlashIcon, Calendar } from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params

  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const { docs } = await payload.find({
    collection: 'blog',
    where: {
      slug: { equals: slug },
    },
    depth: 2,
  })

  const post = docs[0]

  if (!post) {
    return {
      title: 'Publication Not Found | GLUNS',
      description:
        'This GLUNS publication could not be found. Explore our Model United Nations articles, insights, and global diplomacy resources.',
    }
  }

  const title = `${post.title} | GLUNS Publications`
  const description =
    post.snippet ||
    'Read insights from GLUNS on Model United Nations, diplomacy, youth leadership, and global affairs across Kenya, Africa, and internationally.'

  const imageUrl =
    typeof post?.coverImage === 'object' && post.coverImage?.url
      ? post.coverImage.url
      : '/light.png'
  const url = `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/blog/${slug}`

  return {
    title,
    description,
    metadataBase: new URL(`${process.env.NEXT_PUBLIC_PAYLOAD_URL}`),

    openGraph: {
      title: `${title} | GLUNS`,
      description: description,
      url: url,
      siteName: 'GLUNS',
      images: [
        {
          url: imageUrl,
          secureUrl: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'article',
      locale: 'en_US',
    },

    alternates: {
      canonical: url,
    },

    keywords: [
      // Brand
      'GLUNS',
      'Global Leaders United Nations Symposium',

      // Core Topic
      'Model United Nations',
      'Model UN',
      'MUN',

      // Geography
      'Model United Nations Kenya',
      'MUN Kenya',
      'Model United Nations Africa',
      'MUN Africa',
      'International Model United Nations',

      // Content
      'Youth diplomacy',
      'Global affairs',
      'International relations',
      'Student leadership',
    ],
  }
}

export default async function PublicationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const { docs } = await payload.find({
    collection: 'blog',
    where: {
      slug: {
        equals: slug,
      },
    },
    depth: 2,
  })

  const post = docs[0]
  if (!post) {
    notFound()
  }

  // Format the published date
  const publishedDate = new Date(post.createdAt)
  const publishedDateFormatted = publishedDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="min-h-screen">
      {/* Top Navigation Bar */}
      <div className="bg-[#104179] border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/" className="text-white hover:text-[#85c226] transition-colors">
                    Home
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <SlashIcon className="text-gray-400" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    href="/blog"
                    className="text-white/80 hover:text-[#85c226] transition-colors"
                  >
                    Blog
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <SlashIcon className="text-gray-400" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage className="text-gray-400 font-medium">{post.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-2 md:py-16 lg:pt-8 lg:pb-2">
          <div className="max-w-4xl mx-auto">
            {/* Meta Information */}
            <div className="flex flex-col items-start gap-4 mb-2">
              <div className="flex flex-col gap-2">
                <div className="w-32 h-4 bg-[#104179] rounded-full"></div>
                <div className="w-24 h-4 bg-[#85c226] rounded-full"></div>
              </div>

              <div className="flex items-center text-gray-600 text-sm">
                <Calendar className="w-4 h-4 mr-2" />
                <time dateTime={post.createdAt}>{publishedDateFormatted}</time>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-8">
              {post.title}
            </h1>

            {/* Featured Image */}
            {post.coverImage && (
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg border border-gray-200">
                <Image
                  src={
                    typeof post.coverImage === 'object' && post.coverImage.url
                      ? post.coverImage.url
                      : '/bg.jpg'
                  }
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto pb-12">
        {/* Content Area */}
        <div className="p-6 md:p-8 lg:p-10">
          <article className="prose prose-lg text-lg max-w-none prose-headings:text-[#13589e] prose-headings:font-bold prose-a:text-[#13589e] prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl">
            <RichText data={post.content} className="richtext" />
          </article>
        </div>
      </div>
    </div>
  )
}

export async function generateStaticParams() {
  try {
    const allPosts = await fetchAllPosts(1, 100)
    return allPosts.posts.map((post) => ({
      slug: post.slug,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}
