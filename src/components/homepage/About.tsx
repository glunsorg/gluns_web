import React from 'react'
import Image from 'next/image'
import { VscActivateBreakpoints } from 'react-icons/vsc'

export default function About() {
  return (
    <section className="relative bg-white min-h-[70vh] md:min-h-[55vh] lg:min-h-[70vh] 2xl:min-h-[80vh]  rounded-t-3xl -mt-7 z-20 overflow-hidden border-t border-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
        {/* IMAGE WITH OVERLAY */}
        <div className="relative h-[50vh] 2xl:h-[80vh] md:h-auto order-2 md:order-1 lg:order-1">
          <div className="absolute inset-0">
            <Image
              fill
              src="/images/aboutus.jpg"
              alt="About GLUNS"
              className="object-cover object-bottom lg:rounded-tr-none lg:rounded-tl-3xl"
              priority
            />

            {/* Enhanced Gradient Overlay */}
            <div className="absolute inset-0 bg-linear-to-b lg:bg-linear-to-r from-black/70 via-black/40 to-transparent lg:rounded-tr-none lg:rounded-tl-3xl"></div>
          </div>

          {/* Enhanced Floating Highlight Card */}
          <div className="absolute bottom-14 md:bottom-12 left-6 right-6 md:left-8 md:right-8 lg:left-8 lg:right-auto lg:max-w-sm bg-white/95 backdrop-blur-lg p-6 md:p-8 rounded-2xl shadow-2xl transform transition-all duration-300 hover:shadow-[0_20px_60px_rgba(16,65,121,0.3)] hover:scale-[1.02]">
            <div className="flex items-start gap-3">
              <div className="shrink-0 w-1 h-full bg-[#104179] rounded-full"></div>
              <div>
                <p className="text-[#104179] font-semibold text-base md:text-lg 2xl:text-2xl leading-relaxed">
                  &quot;Shaping tomorrow{"'"}s diplomats through real-world global dialogue.&quot;
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <div className="h-px flex-1 bg-lineaer-to-r from-[#104179]/30 to-transparent"></div>
                  <span className="text-xs 2xl:text-lg text-[#104179]/60 font-medium">GLUNS 2025</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TEXT SECTION */}
        <div className="order-1 md:order-2 lg:order-2 px-6 md:px-10 2xl:px-16 py-12 md:py-16 flex flex-col justify-center space-y-8">
          {/* Header with decorative element */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
               <h3 className="text-[#104179] text-xs 2xl:text-lg tracking-widest border border-[#104179] rounded-xl px-4 py-1">
          Who We Are
        </h3>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#104179] leading-tight">
              About GLUNS
            </h2>
          </div>

          <p className="text-base md:text-lg 2xl:text-2xl text-gray-700 leading-relaxed">
            The Global Leaders United Nations Symposium (GLUNS) is a platform created to empower
            high school students with the skills and confidence to engage in meaningful global
            conversations. Through structured debates, policy discussions, and leadership-based
            workshops, we nurture the next generation of thinkers, innovators, and peacebuilders.
          </p>

          {/* Enhanced Info Cards */}
          <div className="space-y-6">
            {/* Focus Areas Card */}
            <div className="group bg-[#104179] p-6 rounded-xl border border-gray-100 hover:border-[#104179]/30 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-10 h-10 bg-[#104179]/10 rounded-lg flex items-center justify-center group-hover:bg-[#104179]/20 transition-colors duration-300">
                  <svg
                    className="w-5 h-5 2xl:w-8 2xl:h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl 2xl:text-3xl font-semibold text-white mb-3">
                    Our Focus Areas
                  </h3>
                  <ul className="space-y-2">
                    {[
                      'Leadership & Diplomacy Training',
                      'Model UN Committee Simulations',
                      'Collaborative Problem-Solving Workshops',
                      'Cross-Cultural Dialogue & Exposure',
                    ].map((item, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-white/80 text-sm md:text-base 2xl:text-2xl"
                      >
                        <VscActivateBreakpoints size={20} className="text-[#85c226]" />{' '}
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
