import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { fetchEvents } from '@/data/eventFetch'
import type { Event } from '@/types/event'

export default async function EventsList() {
  const { events }: { events: Event[] } = await fetchEvents()
  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }

  if (events.length === 0) {
    return (
      <section className="relative bg-[#0d0d0d] min-h-auto z-30 px-6 md:px-12 2xl:px-18 py-12 overflow-hidden">
        {/* Empty State */}
        <div className="flex flex-col items-center justify-center max-w-full mx-auto">
          {/* icon */}
          <div className="w-80 h-80 mb-6">
            <Image
              src="/icons/nolist.png"
              alt="No Events"
              width={800}
              height={800}
              className="object-contain"
            />
          </div>

          {/* Text Content */}
          <h3 className="text-4xl md:text-6xl font-bold text-white mb-3 uppercase">
            No Events Scheduled Yet
          </h3>
          <p className="text-white/70 text-center text-base md:text-xl mb-8 px-4">
            We{"'"}re currently planning exciting new Model UN events. Check back soon for updates
            on upcoming conferences and workshops!
          </p>

          {/* Call to Action */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Link
              href="/contact"
              className="border-2 border-[#104179] text-white px-6 py-3 font-semibold hover:bg-[#104179] hover:text-white transition-all duration-300 hover:scale-105"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative bg-[#0d0d0d] min-h-screen md:min-h-[60vh] lg:min-h-screen z-30 px-6 md:px-12 2xl:px-18 py-6 overflow-hidden">
      {/* Events Grid */}
      <div className="">
        {events.map((event, index) => (
          <div key={index} className="border-b border-[#85c226] py-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-6">
              <div className="flex flex-col md:flex-col justify-between items-start gap-4">
                <Link href={`/events/${event.slug}`} className="flex items-center gap-2">
                  <h3 className="text-2xl md:text-3xl lg:text-4xl 2xl:text-5xl font-semibold text-white uppercase lg:w-2xl">
                    {event.title}
                  </h3>
                </Link>
                <span>
                  <span className="text-white/65 text-lg md:text-xl 2xl:text-3xl ml-1">
                    {event.venue}
                  </span>
                </span>
              </div>

              <div className="flex flex-col md:flex-row justify-center items-center gap-4">
                {/* start date and date */}
                <div className="flex flex-col md:flex-row justify-center items-center gap-4">
                  <div className="flex flex-col md:flex-row justify-center items-center gap-2">
                    <span className="text-white/65 text-lg md:text-xl 2xl:text-3xl ml-1">
                      {new Date(event.startDate).toLocaleDateString('en-US', dateOptions)}
                    </span>
                    <span className="text-white/65 text-lg md:text-xl 2xl:text-3xl ml-1">-</span>
                    <span className="text-white/65 text-lg md:text-xl 2xl:text-3xl ml-1">
                      {new Date(event.endDate).toLocaleDateString('en-US', dateOptions)}
                    </span>
                  </div>
                </div>

                {/* vertical divider */}
                <div className="hidden md:block w-1 h-8 bg-[#85c226]"></div>

                {event.cost && (
                  <div>
                    <p className="text-4xl font-bold text-[#85c226]">
                      {event.currency === 'USD'
                        ? '$'
                        : event.currency === 'KES'
                          ? 'KSh '
                          : event.currency === 'EUR'
                            ? '€'
                            : ''}
                      {/* separate values in comma */}
                      {event.cost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
