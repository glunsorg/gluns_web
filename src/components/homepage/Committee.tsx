'use client'
import React from 'react'
import { GiAfrica } from 'react-icons/gi'
import { MdHealthAndSafety } from 'react-icons/md'
import { GiEarthAfricaEurope } from 'react-icons/gi'
import { FaBalanceScale } from 'react-icons/fa'
import { MdCrisisAlert } from 'react-icons/md'
import { FaChild } from 'react-icons/fa'
import { GrLinkNext } from 'react-icons/gr'
import Link from 'next/link'

export default function Committee() {
  const committees = [
    {
      name: 'United Nations Security Council (UNSC)',
      icon: <FaBalanceScale size={32} className="text-[#104179]" />,
    },
    {
      name: 'World Health Organization (WHO)',
      icon: <MdHealthAndSafety size={32} className="text-[#104179]" />,
    },
    {
      name: 'United Nations Environment Programme (UNEP)',
      icon: <GiEarthAfricaEurope size={32} className="text-[#104179]" />,
    },
    {
      name: "United Nations Children's Fund (UNICEF)",
      icon: <FaChild size={32} className="text-[#104179]" />,
    },
    {
      name: 'African Union (AU)',
      icon: <GiAfrica size={32} className="text-[#104179]" />,
    },
    {
      name: 'Crisis Committee',
      icon: <MdCrisisAlert size={32} className="text-[#104179]" />,
    },
  ]

  return (
    <section className="relative bg-[#ffffff] min-h-screen md:min-h-[60vh] lg:min-h-screen 2xl:min-h-auto rounded-t-3xl -mt-7 z-30 px-6 md:px-12 2xl:px-16 py-20 overflow-hidden">
      {/* Section Header */}
      <div className="flex flex-col justify-center items-center text-center mb-16">
        <h3 className="text-[#104179] text-xs tracking-widest border border-[#104179] rounded-xl px-4 py-1">
          Committees
        </h3>
        <h2 className="text-4xl md:text-5xl text-[#104179] mt-2 font-semibold">
          Explore Our Specialized Committees
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mt-4 text-lg 2xl:text-2xl leading-relaxed">
          GLUNS provides diverse committees that challenge students to debate, negotiate, and solve
          real-world issues from a global perspective.
        </p>
      </div>

      {/* Committees Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
        {committees.map((com, index) => (
          <div
            key={index}
            className="group bg-white rounded-2xl p-8 shadow-md border border-[#104179] hover:shadow-xl 
            transition-all duration-300 relative overflow-hidden"
          >
            {/* Animated Gradient Glow */}

            <div className="relative z-10 flex flex-col justify-center items-start md:items-center gap-4">
              <div className="flex justify-center items-center gap-4">
                <div className="p-3 bg-[#104179]/10 rounded-xl">{com.icon}</div>

                <h3 className="text-xl 2xl:text-2xl font-semibold text-[#104179] leading-tight">{com.name}</h3>
              </div>

              <div className="mt-2 h-[3px] w-32 group-hover:w-full bg-[#85c226] transition-all duration-500"></div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center items-center mt-8">
        <Link
          href="#"
          className="flex items-center justify-center gap-4 border border-[#104179] text-[#104179] text-xl 2xl:text-2xl rounded-xl px-4 py-2 hover:scale-105 transition-transform delay-200"
        >
          Explore Committees
          <GrLinkNext className="-rotate-45" />
        </Link>
      </div>

      {/* Bottom Glow / Decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-[#104179]/10 to-transparent pointer-events-none"></div>
    </section>
  )
}
