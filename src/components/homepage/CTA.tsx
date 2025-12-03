import React from 'react'
import Link from 'next/link'

export default function CTA() {
  return (
    <section className="relative bg-[#104179] rounded-t-3xl -mt-7 z-30 overflow-hidden">

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-white/30 to-transparent"></div>
      <div className="absolute -top-24 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Content */}
      <div className="relative px-6 md:px-8 2xl:px-24 py-12 md:py-16 2xl:py-24">
        <div className="max-w-6xl 2xl:max-w-full mx-auto grid md:grid-cols-2 gap-12 items-center">

          {/* LEFT COLUMN */}
          <div className="space-y-6">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="text-white text-xs font-medium tracking-wide">JOIN THE MOVEMENT</span>
            </div>

            {/* Heading */}
            <h2 className="text-white text-5xl md:text-6xl font-bold leading-tight">
              Ready to Shape Tomorrow&apos;s Global Leaders?
            </h2>

            {/* Description */}
            <p className="text-gray-200 text-lg leading-relaxed max-w-lg">
              Be part of a transformative experience that empowers young minds to lead, influence, 
              and impact the world through diplomacy and collaboration.
            </p>

            {/* Stats */}
            <div className="flex gap-10 pt-4">
              <div>
                <p className="text-3xl font-bold text-white">500+</p>
                <p className="text-sm text-gray-300">Delegates</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">15+</p>
                <p className="text-sm text-gray-300">Countries</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">100%</p>
                <p className="text-sm text-gray-300">Impact</p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN – CTA CARD */}
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl space-y-6">

              {/* Card Header */}
              <div className="space-y-2">
                <h3 className="text-white text-2xl font-bold">Start Your Journey</h3>
                <p className="text-gray-200 text-sm">
                  Secure your spot in the next generation of global changemakers.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Link
                  href="/registration"
                  className="block w-full px-6 py-4 bg-white text-[#104179] font-bold text-center rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                >
                  Register Now →
                </Link>

                <Link
                  href="/about"
                  className="block w-full px-6 py-4 border-2 border-white text-white font-semibold text-center rounded-xl hover:bg-white hover:text-[#104179] transition-all duration-300"
                >
                  Learn More
                </Link>
              </div>

              {/* Footer Note */}
              <div className="pt-4 border-t border-white/20">
                <p className="text-gray-300 text-xs text-center">
                  Limited spots available for 2025 conference
                </p>
              </div>

              {/* Accent Glow */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
            </div>
          </div>

        </div>
      </div>
      
    </section>
  )
}
