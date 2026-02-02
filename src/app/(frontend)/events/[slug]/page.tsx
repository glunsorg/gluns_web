export const dynamic = 'force-dynamic'

import React from 'react'
import config from '@/payload.config'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { SlashIcon, Calendar, MapPin } from 'lucide-react'
import { FaMoneyBillTransfer } from 'react-icons/fa6'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import Link from 'next/link'
import type { Metadata } from 'next'

import { fetchEvents } from '@/data/eventFetch'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params

  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const { docs } = await payload.find({
    collection: 'event',
    where: {
      slug: { equals: slug },
    },
    depth: 2,
  })

  const event = docs[0]

  if (!event) {
    return {
      title: 'Event Not Found | GLUNS',
      description:
        'This GLUNS event could not be found. Explore our upcoming Model United Nations conferences and global youth leadership events.',
    }
  }

  const title = `${event.title} | GLUNS Model United Nations`
  const description =
    event.subtitle ||
    `Join ${event.title}, a GLUNS Model United Nations event bringing together students for diplomacy, debate, and leadership in Kenya, Africa, and internationally.`

  const imageUrl =
    typeof event?.banner === 'object' && event.banner?.url ? event.banner.url : '/seo/events.jpg'

  const url = `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/events/${slug}`

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
          alt: event.title,
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

      // Core
      'Model United Nations',
      'Model UN',
      'MUN',

      // Event-specific
      'Model United Nations conference',
      'MUN conference',
      'Student diplomacy conference',

      // Geography
      'Model United Nations Kenya',
      'MUN Kenya',
      'Model United Nations Africa',
      'MUN Africa',
      'International Model United Nations',

      // Audience
      'High school MUN',
      'Youth leadership conference',
      'Global youth diplomacy',
    ],
  }
}

export default async function CommitteePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const { docs } = await payload.find({
    collection: 'event',
    where: {
      slug: {
        equals: slug,
      },
    },
    depth: 2,
  })

  const events = docs[0]
  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }

  if (!events) {
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
                    href="/events"
                    className="text-white/90 hover:text-[#85c226] transition-all duration-300 font-medium"
                  >
                    Events
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <SlashIcon className="text-[#85c226]" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage className="text-[#85c226] font-semibold">
                  {events.title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Committee Hero */}
      <div className="relative h-[500px] w-full overflow-hidden">
        {typeof events.banner === 'object' && events.banner ? (
          <Image
            src={events.banner.url || ''}
            alt={events.title}
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
        <div className="absolute inset-0 bg-[#104179]/60"></div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-32 h-32 border-t-8 border-l-8 border-[#85c226]"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 border-b-8 border-r-8 border-[#85c226]"></div>

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-8 md:px-4">
          <div className="max-w-4xl w-full text-center space-y-6">
            <div className="inline-block">
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-normal md:tracking-tight mb-4">
                {events.title}
              </h1>
              <div className="h-2 bg-[#85c226] w-3/4 mx-auto"></div>
            </div>
            {events.subtitle && (
              <p className="text-xl md:text-2xl text-white/90 font-medium max-w-3xl mx-auto">
                {events.subtitle}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Event Details Card */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10 mb-12">
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 border-t-8 border-[#85c226]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Date */}
            {events.date && (
              <div className="flex items-center space-x-4 p-4 border-2 border-[#104179]/20 rounded-xl hover:border-[#85c226] transition-all duration-300">
                <div className="shrink-0 w-14 h-14 bg-[#104179] rounded-lg flex items-center justify-center">
                  <Calendar className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Date</p>
                  <p className="text-lg font-bold text-[#104179]">
                    {new Date(events.date).toLocaleDateString('en-US', dateOptions)}
                  </p>
                </div>
              </div>
            )}

            {/* Location */}
            {events.location && (
              <div className="flex items-center space-x-4 p-4 border-2 border-[#104179]/20 rounded-xl hover:border-[#85c226] transition-all duration-300">
                <div className="shrink-0 w-14 h-14 bg-[#104179] rounded-lg flex items-center justify-center">
                  <MapPin className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Location</p>
                  <p className="text-lg font-bold text-[#104179]">{events.location}</p>
                </div>
              </div>
            )}

            {/* Cost */}
            {events.cost && (
              <div className="flex items-center space-x-4 p-4 border-2 border-[#104179]/20 rounded-xl hover:border-[#85c226] transition-all duration-300">
                <div className="shrink-0 w-14 h-14 bg-[#85c226] rounded-lg flex items-center justify-center">
                  <FaMoneyBillTransfer className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Registration Fee</p>
                  <p className="text-lg font-bold text-[#104179]">
                    {events.currency === 'USD'
                      ? '$'
                      : events.currency === 'KES'
                        ? 'KSh '
                        : events.currency === 'EUR'
                          ? '€'
                          : ''}
                    {events.cost}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Committee Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Summary Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 lg:p-16 mb-16 border-t-8 border-[#104179]">
          <div className="flex items-center justify-center mb-8 md:mb-12">
            <div className="flex items-center space-x-4">
              <div className="h-1 w-16 bg-[#85c226]"></div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#104179] tracking-tight">
                Event Overview
              </h2>
              <div className="h-1 w-16 bg-[#85c226]"></div>
            </div>
          </div>

          <article className="prose prose-xl px-8 md:px-24 max-w-none prose-headings:text-[#104179] prose-headings:font-bold prose-a:text-[#104179] prose-a:no-underline hover:prose-a:text-[#85c226] prose-a:transition-colors prose-img:rounded-xl prose-img:shadow-lg prose-p:text-gray-700 prose-p:leading-relaxed">
            <RichText data={events.description} className="richtext" />
          </article>
        </div>
      </div>
    </div>
  )
}

export async function generateStaticParams() {
  try {
    const allEvents = await fetchEvents()
    return allEvents.events.map((event) => ({
      slug: event.slug,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}
