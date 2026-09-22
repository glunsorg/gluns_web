export const dynamic = 'force-dynamic'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FaUsers } from 'react-icons/fa6'
import { HiArrowRight } from 'react-icons/hi2'
import { fetchCommittee } from '@/data/committeeFetch'

export default async function CommitteeList() {
  const { committee } = await fetchCommittee()

  return (
    <section className="relative bg-white min-h-screen rounded-t-3xl -mt-7 z-30 px-6 md:px-12 lg:px-16 py-8 md:py-12 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#104179]/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Cards Grid */}
      <div className="max-w-7xl 2xl:max-w-full mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {committee.reverse().map((committee, index) => (
          <div
            key={committee.id}
            className="group relative bg-white transition-all border border-[#104179] duration-500 overflow-hidden"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Image Container with Overlay */}
            <div className="relative w-full h-56 overflow-hidden">
              {typeof committee.photo === 'object' && committee.photo ? (
                <Image
                  src={committee.photo?.url || '/images/committee-placeholder.jpg'}
                  alt={committee.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
              ) : (
                <div className="flex items-center justify-center h-full w-full bg-gray-300">
                  <span className="text-gray-500">No Image Available</span>
                </div>
              )}

              {/* Icon Badge */}
              <div className="absolute top-4 right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <FaUsers className="text-[#104179] text-xl" />
              </div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8 flex flex-col gap-4">
              <Link href={`/organs/${committee.slug}`}>
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#104179] leading-tight uppercase">
                  {committee.name}
                </h3>
              </Link>

              <p className="text-gray-600 text-lg md:text-xl lg:text-2xl leading-relaxed line-clamp-3">
                {committee.description}
              </p>

              {/* CTA Link */}
              <Link
                href={`/organs/${committee.slug}`}
                className="inline-flex items-center gap-2 text-[#104179] font-semibold mt-2 group-hover:gap-4 transition-all duration-300"
              >
                <span>Learn More</span>
                <HiArrowRight className="text-xl group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action Section */}
      <div className="max-w-4xl mx-auto mt-20 text-center bg-[#104179] rounded-3xl p-10 md:p-16 shadow-2xl relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <h3 className="text-4xl md:text-5xl lg:text-6xl 2xl:text-7xl font-semibold text-white mb-4 uppercase">
            Ready to Join an Organ?
          </h3>
          <p className="text-white/90 text-lg lg:text-xl mb-8 max-w-2xl mx-auto">
            Take the first step towards becoming a global leader. Register for our upcoming
            conference and choose your organ.
          </p>
          <Link
            href="/registration"
            className="inline-flex items-center gap-3 bg-white text-[#104179] text-lg lg:text-xl px-8 py-4 font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-xl"
          >
            Register Now
            <HiArrowRight className="text-xl" />
          </Link>
        </div>
      </div>
    </section>
  )
}
