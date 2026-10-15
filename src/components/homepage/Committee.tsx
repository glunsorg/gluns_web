export const dynamic = 'force-dynamic'

import React from 'react'
import { GrLinkNext } from 'react-icons/gr'
import Link from 'next/link'
import { fetchCommittee } from '@/data/committeeFetch'
import { HiArrowRight } from 'react-icons/hi2'

export default async function Committee() {
  const { committee } = await fetchCommittee()

  if (!committee || committee.length === 0) {
    return (
      <section className="relative bg-[#0D1A0D] min-h-screen md:min-h-[60vh] lg:min-h-auto 2xl:min-h-auto rounded-t-3xl -mt-7 z-30 px-6 md:px-12 2xl:px-16 py-20 overflow-hidden">
        <div className="flex flex-col justify-center items-center text-center mb-16">
          <h2 className="text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl text-white mt-2 font-semibold uppercase">
            Explore the Structure of GLUNS
          </h2>
          <p className="text-white/65 max-w-5xl mx-auto mt-4 text-lg md:text-xl 2xl:text-3xl leading-relaxed">
            GLUNS is organized into three main organs: the General Assembly, the International Court
            of Justice, and the International Law Commission—each offering a distinct approach to
            global governance, diplomacy, and law.
          </p>
        </div>

        <div className="flex justify-center items-center mt-8">
          <Link
            href="/organs"
            className="flex items-center justify-center gap-4 border border-white/65 text-white/65 text-lg md:text-xl 2xl:text-2xl px-6 py-4 hover:scale-105 transition-transform delay-200"
          >
            Explore Organs
            <GrLinkNext className="-rotate-45" />
          </Link>
        </div>

        {/* Bottom Glow / Decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-[#104179]/10 to-transparent pointer-events-none"></div>
      </section>
    )
  }

  return (
    <section className="relative bg-[#0D1A0D] min-h-screen md:min-h-[60vh] lg:min-h-auto 2xl:min-h-auto rounded-t-3xl -mt-7 z-30 px-6 md:px-12 2xl:px-16 py-20 overflow-hidden">
      {/* Section Header */}
      <div className="flex flex-col justify-center items-center text-center mb-16">
        <h2 className="text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl text-white mt-2 font-semibold uppercase">
          Explore the Structure of GLUNS
        </h2>
        <p className="text-white/65 max-w-5xl mx-auto mt-4 text-lg md:text-xl 2xl:text-3xl leading-relaxed">
          GLUNS is organized into three main organs: the General Assembly, the International Court
          of Justice, and the International Law Commission—each offering a distinct approach to
          global governance, diplomacy, and law.
        </p>
      </div>

      {/* Organs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
        {committee
          .slice(0, 3)
          .reverse()
          .map((committee, index) => (
            <div
              key={committee.id}
              className="group relative transition-all duration-500 overflow-hidden border-l border-gray-100"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Content */}
              <div className="p-6 md:p-8 flex flex-col gap-4">
                <h3 className="text-2xl md:text-3xl font-bold text-[#85c226] leading-tight uppercase">
                  {committee.name}
                </h3>

                <p className="text-white/65 text-sm md:text-base leading-relaxed line-clamp-3">
                  {committee.description}
                </p>

                {/* CTA Link */}
                <Link
                  href={`/organs/${committee.slug}`}
                  className="inline-flex items-center gap-2 text-white font-semibold mt-2 group-hover:gap-4 transition-all duration-300"
                >
                  <span>Learn More</span>
                  <HiArrowRight className="text-xl group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            </div>
          ))}
      </div>

      <div className="flex justify-center items-center mt-8">
        <Link
          href="/organs"
          className="flex items-center justify-center gap-4 border border-white/65 text-white/65 text-lg md:text-xl 2xl:text-2xl px-6 py-4 hover:scale-105 transition-transform delay-200"
        >
          Explore Organs
          <GrLinkNext className="-rotate-45" />
        </Link>
      </div>

      {/* Bottom Glow / Decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-[#104179]/10 to-transparent pointer-events-none"></div>
    </section>
  )
}
