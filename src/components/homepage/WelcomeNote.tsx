import React from 'react'
import Image from 'next/image'

export default function WelcomeNote() {
  return (
    <section className="relative bg-[#104179] min-h-[70vh] md:min-h-[55vh] lg:min-h-[70vh] 2xl:min-h-[80vh] rounded-t-3xl -mt-7 z-30 overflow-hidden">
      {/* Decorative pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-20 h-20 border-2 border-[#104179] rounded-lg rotate-12"></div>
        <div className="absolute bottom-40 right-20 w-16 h-16 border-2 border-[#104179] rounded-full"></div>
        <div className="absolute top-1/3 right-1/4 w-12 h-12 border-2 border-[#104179] rotate-45"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-24 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 md:mb-20">
            <div className="inline-flex items-center gap-2 mb-6 px-6 py-2.5 bg-white text-[#104179] text-sm font-semibold rounded-full shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              Message from Leadership
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              A Word from the{' '}
              <span className="text-white relative inline-block">
                Secretary General
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-white opacity-20 rounded-full"></div>
              </span>
            </h2>
            <p className="text-white text-lg max-w-2xl mx-auto">
              Leading with vision, unity, and purpose for a better tomorrow
            </p>
          </div>

          {/* Content Card */}
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start">
            {/* Image Section */}
            <div className="lg:col-span-2 flex justify-center lg:sticky lg:top-24">
              <div className="relative group w-full max-w-md">
                {/* Decorative corner accents */}
                <div className="absolute -top-3 -left-3 w-24 h-24 border-t-4 border-l-4 border-[#104179] rounded-tl-2xl opacity-50"></div>
                <div className="absolute -bottom-3 -right-3 w-24 h-24 border-b-4 border-r-4 border-[#104179] rounded-br-2xl opacity-50"></div>

                <div className="relative">
                  <div className="absolute inset-0 bg-[#104179] rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>

                  <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-100">
                    {/* Image Container */}
                    <div className="relative aspect-5/5 overflow-hidden bg-linear-to-br from-gray-50 to-gray-100">
                      <Image
                        width={600}
                        height={750}
                        src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&h=750&fit=crop"
                        alt="Secretary General"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-[#104179] via-transparent to-transparent opacity-60"></div>

                      {/* Badge overlay */}
                      <div className="absolute top-4 right-4 bg-[#104179]/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                        <p className="text-white font-bold text-sm">GLUNS 2025</p>
                      </div>
                    </div>

                    {/* Info Card */}
                    <div className="p-6 bg-white">
                      <h3 className="text-2xl font-bold text-[#104179] mb-2">James Mitchell</h3>
                      <p className="text-[#104179] font-semibold mb-1">Secretary General</p>
                      <p className="text-gray-500 text-sm mb-4">
                        Global Leaders United Nations Symposium
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Message Section */}
            <div className="lg:col-span-3 space-y-8">
              <div className="relative bg-linear-to-br from-gray-50 to-white rounded-2xl p-8 md:p-10 shadow-xl border border-gray-100">
                {/* Quote icon */}
                <div className="absolute -top-4 left-8 w-12 h-12 bg-[#104179] rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>

                <div className="space-y-6 text-gray-700 leading-relaxed mt-4">
                  <p className="text-lg md:text-xl font-light">
                    Welcome to the{' '}
                    <span className="font-bold text-[#104179]">
                      Global Leaders United Nations Symposium
                    </span>
                    . It is my profound honor to invite you to this extraordinary gathering of
                    minds, leaders, and visionaries from across the globe.
                  </p>
                  <p className="text-base md:text-lg">
                    In an era of unprecedented challenges and opportunities, GLUNS stands as a
                    beacon of collaboration, innovation, and collective action. Together, we will
                    explore solutions to our world{"'"}s most pressing issues and forge partnerships
                    that transcend borders.
                  </p>
                  <p className="text-base md:text-lg">
                    Your participation enriches our dialogue and strengthens our shared commitment
                    to building a more sustainable, equitable, and peaceful future for all nations
                    and peoples.
                  </p>
                </div>
              </div>

              {/* Signature Card */}
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border-l-4 border-[#104179]">
                <div className="flex items-center justify-between flex-wrap gap-6">
                  <div className="space-y-2">
                    <div
                      className="text-3xl md:text-4xl font-bold text-[#104179] italic"
                      style={{ fontFamily: 'Georgia, serif' }}
                    >
                      Dr. James Mitchell
                    </div>
                    <p className="text-sm text-gray-600 font-medium">Secretary General</p>
                    <p className="text-xs text-gray-500">Global Leaders United Nations Symposium</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right mr-4">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Dated</p>
                      <p className="text-sm font-semibold text-gray-700">December 2025</p>
                    </div>
                    <div className="w-20 h-20 border-2 border-[#104179] rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Image src="/logos/2.png" alt="GLUNS Logo" width={60} height={60} />
                      </div>
                    </div>
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
