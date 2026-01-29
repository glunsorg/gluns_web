import React from 'react'
import { IoLocationSharp } from 'react-icons/io5'
import Image from 'next/image'
import Link from 'next/link'
import { GrLinkNext } from 'react-icons/gr'
import { fetchEvents } from '@/data/eventFetch'
import { HiArrowRight } from 'react-icons/hi2'

export default async function Events() {
  const { events } = await fetchEvents()

  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }

  if (events.length === 0) {
    return (
      <section className="relative bg-[#ffffff] min-h-screen md:min-h-[60vh] lg:min-h-screen rounded-t-3xl -mt-7 z-30 px-6 md:px-12 2xl:px-18 py-12 overflow-hidden">
        {/* Header */}
        <div className="flex flex-col justify-center items-center text-center mb-8">
          <h3 className="text-[#104179] text-xs 2xl:text-lg tracking-widest border border-[#104179] rounded-xl px-4 py-1">
            Events
          </h3>
          <h2 className="text-[#104179] text-4xl md:text-5xl font-bold mt-3">Upcoming Events</h2>
          <p className="text-[#104179] max-w-2xl mx-auto mt-4 text-lg">
            Join hundreds of young delegates in a dynamic, interactive, professionally organized
            Model UN experience.
          </p>
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center max-w-2xl mx-auto py-8">
          {/* Icon/Illustration */}
          <div className="relative mb-8">
            <div className="w-32 h-32 md:w-40 md:h-40 bg-linear-to-br from-[#104179]/10 to-[#85c226]/10 rounded-full flex items-center justify-center">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full flex items-center justify-center shadow-lg">
                <svg
                  className="w-12 h-12 md:w-16 md:h-16 text-[#85c226]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
            {/* Decorative dots */}
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-[#85c226] rounded-full animate-pulse"></div>
            <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-[#104179] rounded-full animate-pulse delay-300"></div>
          </div>

          {/* Text Content */}
          <h3 className="text-2xl md:text-3xl font-bold text-[#104179] mb-3">
            No Events Scheduled Yet
          </h3>
          <p className="text-[#104179]/70 text-center text-base md:text-lg mb-8 px-4">
            We{"'"}re currently planning exciting new Model UN events. Check back soon for updates
            on upcoming conferences and workshops!
          </p>

          {/* Call to Action */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Link
              href="/contact"
              className="border-2 border-[#104179] text-[#104179] px-6 py-3 rounded-xl font-semibold hover:bg-[#104179] hover:text-white transition-all duration-300 hover:scale-105"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative bg-[#ffffff] min-h-screen md:min-h-[60vh] lg:min-h-screen rounded-t-3xl -mt-7 z-30 px-6 md:px-12 2xl:px-18 py-12 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col justify-center items-center text-center mb-16">
        <h3 className="text-[#104179] text-xs 2xl:text-lg tracking-widest border border-[#104179] rounded-xl px-4 py-1">
          Events
        </h3>
        <h2 className="text-[#104179] text-4xl md:text-5xl font-bold mt-3">Upcoming Events</h2>
        <p className="text-[#104179] max-w-2xl mx-auto mt-4 text-lg">
          Join hundreds of young delegates in a dynamic, interactive, professionally organized Model
          UN experience.
        </p>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
        {events.slice(0, 3).map((event, index) => (
          <div
            key={index}
            className="rounded-3xl overflow-hidden shadow-md bg-[#104179]/5 border border-[#85c226] hover:shadow-xl transition-all duration-300"
          >
            {/* Image */}
            <div className="h-64 w-full overflow-hidden rounded-b-3xl shadow-lg shadow-[#000000]/20 border-b-2 border-[#85c226]">
              {typeof event.banner === 'object' && event.banner?.url ? (
                <Image
                  width={500}
                  height={500}
                  src={event.banner?.url || '/images/event-placeholder.jpg'}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              ) : (
                <div className="flex items-center justify-center h-full w-full bg-gray-300">
                  <span className="text-gray-500">No Image Available</span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6 flex justify-center items-center gap-3">
              <div>
                <div className="flex items-center justify-between mb-4">
                  {' '}
                  <h2 className="flex items-center gap-1 text-[#104179] 2xl:text-2xl">
                    <span>
                      <IoLocationSharp className="text-[#85c226]" />
                    </span>
                    {event.location}
                  </h2>
                  <span className="text-[#104179] font-semibold text-sm 2xl:text-3xl bg-white border border-[#104179] px-3 py-1 rounded-lg">
                    {event.date
                      ? new Date(event.date).toLocaleDateString('en-US', dateOptions)
                      : ''}
                  </span>
                </div>

                <div className="w-full h-0.5 bg-[#85c226] mb-2"></div>

                <h3 className="text-2xl 2xl:text-3xl font-bold text-[#104179] mb-2">
                  {event.title}
                </h3>
                <p className="text-sm 2xl:text-xl">{event.subtitle}</p>

                <Link
                  href={`/events/${event.slug}`}
                  className="flex items-center justify-end gap-4 mt-4 text-[#104179] font-semibold hover:text-[#85c226] transition-colors duration-300"
                >
                  View Details
                  <HiArrowRight className="text-xl group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* links */}
      <div className="flex justify-center items-center mt-12">
        <Link
          href="/events"
          className="flex items-center justify-center gap-2 border border-[#104179] text-[#104179] text-xl rounded-xl px-4 py-2 hover:scale-105 transition-transform delay-200"
        >
          Explore All Events
          <GrLinkNext className="-rotate-45" />
        </Link>
      </div>
    </section>
  )
}
