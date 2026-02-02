export const dynamic = 'force-dynamic'

import React from 'react'
import config from '@/payload.config'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { SlashIcon } from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import Link from 'next/link'

import { fetchCommittee } from '@/data/committeeFetch'
import { fetchCommitteeTeam } from '@/data/committeeFetch'
import CommitteeMembers from '@/components/committeepage/CommitteeMembers'

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
    collection: 'committees',
    where: {
      slug: { equals: slug },
    },
    depth: 2,
  })

  const committee = docs[0]

  if (!committee) {
    return {
      title: 'Committee Not Found | GLUNS',
      description:
        'This GLUNS committee could not be found. Explore our Model United Nations committees and leadership simulations in Kenya, Africa, and internationally.',
    }
  }

  const title = `${committee.title} | GLUNS Committee`
  const description =
    committee.description ||
    `Discover the ${committee.title} committee at GLUNS, a Model United Nations simulation empowering students in Kenya, Africa, and around the world.`

  const imageUrl =
    typeof committee?.committee_photo === 'object' && committee.committee_photo?.url
      ? committee.committee_photo.url
      : '/seo/committee.jpg'

  const url = `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/committee/${slug}`

  return {
    title,
    description,
    metadataBase: new URL(`${process.env.NEXT_PUBLIC_PAYLOAD_URL}`),

    openGraph: {
      title,
      description,
      url,
      siteName: 'GLUNS',
      images: [
        {
          url: imageUrl,
          secureUrl: imageUrl,
          width: 1200,
          height: 630,
          alt: committee.title,
        },
      ],
      type: 'article',
      locale: 'en_KE',
    },

    alternates: {
      canonical: url,
    },

    keywords: [
      // Brand
      'GLUNS',
      'Global Leaders United Nations Symposium',

      // Committee / Core
      'Model United Nations committee',
      'MUN committee',
      'Student diplomacy committee',
      'High school MUN committee',

      // Geography
      'Model United Nations Kenya',
      'MUN Kenya',
      'Model United Nations Africa',
      'MUN Africa',
      'International Model United Nations',

      // Leadership / Education
      'Youth leadership programs',
      'Student leadership simulation',
      'Diplomacy education',
      'Global affairs education',
    ],
  }
}

export default async function CommitteePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const { docs } = await payload.find({
    collection: 'committees',
    where: {
      slug: {
        equals: slug,
      },
    },
    depth: 2,
  })

  const committee = docs[0]
  const members = await fetchCommitteeTeam(committee.id)
  if (!committee) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="bg-[#104179] border-b-4 border-[#85c226] shadow-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    href="/"
                    className="text-white hover:text-[#85c226] transition-all duration-300 font-medium"
                  >
                    Home
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <SlashIcon className="text-[#85c226]" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    href="/committees"
                    className="text-white/90 hover:text-[#85c226] transition-all duration-300 font-medium"
                  >
                    Committees
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <SlashIcon className="text-[#85c226]" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage className="text-[#85c226] font-semibold">
                  {committee.title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Committee Hero */}
      <div className="relative h-[500px] w-full overflow-hidden">
        {typeof committee.committee_photo === 'object' && committee.committee_photo ? (
          <Image
            src={committee.committee_photo.url || ''}
            alt={committee.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex items-center justify-center h-full w-full bg-[#104179]">
            <span className="text-white text-xl font-medium">No Image Available</span>
          </div>
        )}

        {/* Overlay with Pattern */}
        <div className="absolute inset-0 bg-[#104179]/80"></div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-32 h-32 border-t-8 border-l-8 border-[#85c226]"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 border-b-8 border-r-8 border-[#85c226]"></div>

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
          <div className="max-w-4xl w-full text-center space-y-6">
            <div className="inline-block">
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-4">
                {committee.title}
              </h1>
              <div className="h-2 bg-[#85c226] w-3/4 mx-auto"></div>
            </div>
            <p className="text-white text-xl md:text-2xl font-light max-w-3xl mx-auto leading-relaxed">
              {committee.description}
            </p>
          </div>
        </div>
      </div>

      {/* Committee Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        {/* Summary Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 lg:p-16 mb-16 border-t-8 border-[#104179]">
          <div className="flex items-center justify-center mb-12">
            <div className="flex items-center space-x-4">
              <div className="h-1 w-16 bg-[#85c226]"></div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#104179] tracking-tight">
                Committee Summary
              </h2>
              <div className="h-1 w-16 bg-[#85c226]"></div>
            </div>
          </div>

          <article className="prose prose-xl max-w-none prose-headings:text-[#104179] prose-headings:font-bold prose-a:text-[#104179] prose-a:no-underline hover:prose-a:text-[#85c226] prose-a:transition-colors prose-img:rounded-xl prose-img:shadow-lg prose-p:text-gray-700 prose-p:leading-relaxed">
            <RichText data={committee.summary} className="richtext" />
          </article>
        </div>

        {/* Committee Members Section */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 lg:p-16 mb-16 border-t-8 border-[#85c226]">
          <div className="flex items-center justify-center mb-12">
            <div className="flex items-center space-x-4">
              <div className="h-1 w-16 bg-[#104179]"></div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#104179] tracking-tight">
                Committee Dais
              </h2>
              <div className="h-1 w-16 bg-[#104179]"></div>
            </div>
          </div>

          <CommitteeMembers members={members} />
        </div>
      </div>

      {/* Bottom Spacer */}
      <div className="h-16"></div>
    </div>
  )
}

export async function generateStaticParams() {
  try {
    const allCommittees = await fetchCommittee()
    return allCommittees.committee.map((committee) => ({
      slug: committee.slug,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}
