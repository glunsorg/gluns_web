import React from 'react'
import { ArrowRight, Users, MessageCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function SecHero() {
  return (
    <section className="w-full px-6 md:px-8 2xl:px-16 pt-4 pb-12 md:pt-8 md:pb-16">
      <div className="max-w-7xl 2xl:max-w-full mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Content */}
          <div className="lg:col-span-7 space-y-8">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 border-2 rounded-full"
              style={{ borderColor: '#104179' }}
            >
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#104179' }}></div>
              <span className="text-sm font-bold tracking-wider" style={{ color: '#104179' }}>
                SECRETARIAT 2025
              </span>
            </div>

            {/* Main Heading */}
            <h1
              className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1]"
              style={{ color: '#104179' }}
            >
              Leadership That Drives
              <br />
              <span className="relative inline-block">
                Excellence
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  height="12"
                  viewBox="0 0 300 12"
                  fill="none"
                >
                  <path
                    d="M2 10C50 4 100 2 150 6C200 10 250 8 298 4"
                    stroke="#104179"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-2xl">
              The GLUNS Secretariat coordinates conference planning, operations, and delegate
              experience, ensuring a rigorous, inclusive, and impactful platform for emerging global
              leaders.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="/committees"
                className="group flex items-center gap-3 px-8 py-4 text-white rounded-xl font-bold text-lg transition-all duration-300 hover:shadow-2xl hover:translate-y-0.5"
                style={{ backgroundColor: '#104179' }}
              >
                <Users className="w-5 h-5" />
                <span>View Committees</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/contact"
                className="group flex items-center gap-3 px-8 py-4 bg-white border-2 rounded-xl font-bold text-lg transition-all duration-300 hover:shadow-xl hover:translate-y-0.5"
                style={{ borderColor: '#104179', color: '#104179' }}
              >
                <MessageCircle className="w-5 h-5" />
                <span>Talk To Us</span>
              </Link>
            </div>
          </div>

          {/* Right Visual Element */}
          <div className="lg:col-span-5 relative">
            <div className="relative">
              {/* Main Image Container */}
              <div className="relative overflow-hidden">
                <Image
                  width={400}
                  height={200}
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800"
                  alt="GLUNS Leadership"
                  className="w-full h-[500px] object-cover rounded-xl"
                />

                {/* Overlay Box */}
                <div className="absolute inset-0 bg-black opacity-40 rounded-xl"></div>
              </div>

              {/* Floating Card */}
              <div className="absolute -bottom-8 -left-8 bg-white p-6 shadow-2xl max-w-xs rounded-xl">
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 flex items-center justify-center shrink-0"
                    style={{ backgroundColor: '#104179' }}
                  >
                    <span className="text-white font-black text-xl">★</span>
                  </div>
                  <div>
                    <div className="text-2xl font-black mb-1" style={{ color: '#104179' }}>
                      2025
                    </div>
                    <p className="text-sm text-gray-700 font-medium leading-snug">
                      Building the next generation of global leaders
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
