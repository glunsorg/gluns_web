export const dynamic = 'force-dynamic'

import React from 'react'
import config from '@/payload.config'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { Calendar, MapPin } from 'lucide-react'
import { FaMoneyBillTransfer } from 'react-icons/fa6'
import Link from 'next/link'
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
    collection: 'events',
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

  const url = `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/events/${slug}`

  return {
    title,
    description,
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_PAYLOAD_URL || process.env.PAYLOAD_URL || 'http://localhost:3000',
    ),

    openGraph: {
      title,
      description,
      url,
      siteName: 'GLUNS',

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
    collection: 'events',
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
    <div className="min-h-screen bg-[#0d0d0d] px-6 md:px-8 2xl:px-16 pb-12 lg:pb-20 relative z-10">
      {/* Committee Hero */}
      <div className="relative h-[80vh] lg:h-[600px] w-full overflow-hidden">
        {/* Overlay with Pattern */}
        <div className="absolute inset-0 bg-[#0d0d0d]"></div>

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-8 md:px-4">
          <div className="max-w-4xl w-full text-left lg:text-center space-y-6">
            <div className="inline-block">
              <h1 className="text-4xl md:text-7xl font-bold uppercase text-white tracking-normal md:tracking-tight mb-4">
                {events.title}
              </h1>
              <div className="h-2 bg-[#85c226] w-3/4 lg:mx-auto"></div>
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
            {events.startDate && (
              <div className="flex items-center space-x-4 p-4 border-2 border-[#104179]/20 hover:border-[#85c226] transition-all duration-300">
                <div className="shrink-0 w-14 h-14 bg-[#85c226] rounded-lg flex items-center justify-center">
                  <Calendar className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Date</p>
                  <p className="text-lg font-bold text-[#104179]">
                    {new Date(events.startDate).toLocaleDateString('en-US', dateOptions)}
                    {events.endDate &&
                      ` - ${new Date(events.endDate).toLocaleDateString('en-US', dateOptions)}`}
                  </p>
                </div>
              </div>
            )}

            {/* Location */}
            {events.venue && (
              <div className="flex items-center space-x-4 p-4 border-2 border-[#104179]/20 hover:border-[#85c226] transition-all duration-300">
                <div className="shrink-0 w-14 h-14 bg-[#104179] rounded-lg flex items-center justify-center">
                  <MapPin className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Location</p>
                  <p className="text-lg font-bold text-[#104179]">{events.venue}</p>
                </div>
              </div>
            )}

            {/* Cost */}
            {events.cost && (
              <div className="flex items-center space-x-4 p-4 border-2 border-[#104179]/20 hover:border-[#85c226] transition-all duration-300">
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
                    {/* separate values in comma */}
                    {events.cost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-center mt-8 md:mt-12">
            <Link
              href="/registration"
              className="bg-[#104179] text-[#fffff6] px-6 py-2 text-lg font-semibold hover:bg-[#85c226] hover:text-white transition-all duration-300"
            >
              Register Now
            </Link>
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

          <article className="prose prose-xl px-2 max-w-none prose-headings:text-[#104179] prose-headings:font-bold prose-a:text-[#104179] prose-a:no-underline hover:prose-a:text-[#85c226] prose-a:transition-colors prose-img:rounded-xl prose-img:shadow-lg prose-p:text-gray-700 prose-p:leading-relaxed">
            <RichText data={events.description} className="richtext" />
          </article>
        </div>
      </div>
    </div>
  )
}
