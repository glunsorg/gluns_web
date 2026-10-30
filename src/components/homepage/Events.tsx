import React from 'react'
import Link from 'next/link'
import { GrLinkNext } from 'react-icons/gr'
import { fetchEvents } from '@/data/eventFetch'

export default async function Events() {
  const { events } = await fetchEvents()

  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }

  if (events.length === 0) {
    return (
      <section className="relative bg-[#0d0d0d] min-h-[40vh] md:min-h-[40vh] lg:min-h-[60vh] rounded-t-3xl -mt-7 z-30 px-6 md:px-12 2xl:px-18 py-12 overflow-hidden">
        {/* Header */}
        <div className="flex flex-col justify-center items-center text-center mb-8">
          <h2 className="text-white text-3xl md:text-5xl font-bold mt-3">EVENTS & COMPETITIONS</h2>
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
          </div>

          {/* Text Content */}
          <h3 className="text-2xl md:text-3xl font-bold uppercase text-white mb-3">
            No Events Scheduled Yet
          </h3>
          <p className="text-white/70 text-center text-base md:text-lg mb-8 px-4">
            We{"'"}re currently planning exciting new Model UN events. Check back soon for updates
            on upcoming conferences and workshops!
          </p>

          {/* Call to Action */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Link
              href="/contact"
              className="border-2 border-white/65 text-white/65 px-6 py-3 font-semibold hover:bg-[#104179] hover:text-white transition-all duration-300 hover:scale-105"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative bg-[#0d0d0d] min-h-screen md:min-h-[60vh] lg:min-h-auto rounded-t-3xl -mt-7 z-30 px-6 md:px-12 2xl:px-18 py-16 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col justify-center items-center text-center mb-8">
        <h2 className="text-white text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl font-bold mt-3">
          {' '}
          EVENTS & COMPETITIONS
        </h2>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
        {events.slice(0, 4).map((event, index) => (
          <div
            key={index}
            className="overflow-hidden border-b-2 border-white/65 hover:shadow-xl transition-all duration-300"
          >
            {/* Content */}
            <div className="p-6 flex justify-center items-center gap-3">
              <div>
                <div className="flex items-center justify-between mb-4">
                  {' '}
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
                <Link href={`/events/${event.slug}`} target="_blank" rel="noopener noreferrer">
                  <h3 className="text-2xl lg:text-4xl 2xl:text-4xl font-bold text-white mb-2 uppercase">
                    {event.title}
                  </h3>
                </Link>
                <h2 className="flex items-center gap-1 text-[#85c226] text-sm 2xl:text-2xl">
                  {event.venue}
                </h2>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* links */}
      <div className="flex justify-center items-center mt-12">
        <Link
          href="/events"
          className="flex items-center justify-center gap-2 border border-white/65 text-white/65 text-xl px-6 py-4 hover:scale-105 transition-transform delay-200"
        >
          Explore All Events
          <GrLinkNext className="-rotate-45" />
        </Link>
      </div>
    </section>
  )
}
