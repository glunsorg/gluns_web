import React from 'react'
import Image from 'next/image'

export default function CommitteeHero() {
  return (
    <section
      id="about-hero"
      className="py-12 md:py-16 px-8 md:px-12 bg-[#104179] dark:border-t dark:border-white relative z-30 shadow-2xl overflow-hidden flex flex-col items-center justify-center gap-12 md:gap-8"
    >
      <div className="w-full h-full flex flex-col md:flex-row justify-center md:items-center">
        {/* left */}
        <div className="w-full flex flex-col mx-auto justify-center items-start md:w-[60%]">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-4">
            <div className="w-2 h-2 bg-[#85c226] rounded-full animate-pulse"></div>
            <span className="text-white text-xs font-semibold tracking-wider uppercase">
              Our Committees{' '}
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <h1 className="text-5xl lg:text-6xl font-semibold text-white leading-tight">
             Explore the Councils, Where Delegates Shape Solutions
            </h1>

            <p className="text-white leading-relaxed text-xl md:text-2xl">
              GLUNS hosts a diverse range of committees designed to challenge students, deepen
              global awareness, and develop real diplomatic skills. Each committee tackles critical
              global issues, encouraging delegates to think creatively, collaborate meaningfully,
              and lead with purpose.
            </p>
          </div>
        </div>

        {/* right */}
        <div className="flex mt-12 md:mt-0 items-center justify-center relative z-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl hover:scale-105 transition-transform duration-500">
          <Image src="/logos/6.png" width={500} height={500} alt="GLUNS Logo" className="w-72" />
        </div>
      </div>

      <div className="absolute top-20 -left-20 w-60 h-60 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-20 -right-20 w-60 h-60 bg-white/1 rounded-full blur-3xl pointer-events-none"></div>
    </section>
  )
}
