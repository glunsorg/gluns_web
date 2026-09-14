import React from 'react'
import Link from 'next/link'

export default function CTA() {
  return (
    <section className="relative bg-[#104179] rounded-t-3xl -mt-7 z-30 overflow-hidden border-t border-white">
      {/* Main Content */}
      <div className="relative px-6 md:px-8 2xl:px-24 py-12 md:py-16 2xl:py-24">
        <div className="max-w-6xl 2xl:max-w-full mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            {/* Heading */}
            <h2 className="text-white text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl font-bold leading-tighter tracking-tight uppercase">
              Ready to Shape Tomorrow&apos;s Global Leaders?
            </h2>

            {/* Description */}
            <p className="text-gray-200 text-lg 2xl:text-2xl leading-relaxed max-w-lg">
              Be part of a transformative experience that empowers young minds to lead, influence,
              and impact the world through diplomacy and collaboration.
            </p>

            {/* Stats */}
            <div className="flex gap-10 pt-4">
              <div>
                <p className="text-3xl font-bold text-white">500+</p>
                <p className="text-sm 2xl:text-lg text-gray-300">Delegates</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">15+</p>
                <p className="text-sm 2xl:text-lg text-gray-300">Countries</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">100%</p>
                <p className="text-sm 2xl:text-lg text-gray-300">Impact</p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN – CTA CARD */}
          <div className="relative">
            <div className="bg-[#0d1a0d]/30 backdrop-blur-md border border-white/20 p-8 shadow-2xl space-y-6">
              {/* Card Header */}
              <div className="space-y-2">
                <h3 className="text-white text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl font-bold uppercase">
                  Start Your Journey
                </h3>
                <p className="text-gray-200 text-sm 2xl:text-2xl">
                  Secure your spot in the next generation of global changemakers.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Link
                  href="/registration"
                  className="block w-full px-6 py-4 bg-[#85c226] text-[#104179] font-bold text-center 2xl:text-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                >
                  Register Now →
                </Link>

                <Link
                  href="/about"
                  className="block w-full px-6 py-4 border-2 border-white text-white font-semibold text-center 2xl:text-2xl hover:bg-white hover:text-[#104179] transition-all duration-300"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
