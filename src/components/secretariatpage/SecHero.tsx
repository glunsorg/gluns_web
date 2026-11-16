import React from 'react'

export default function SecHero() {
  return (
    <section className="relative bg-[#0d0d0d] min-h-auto flex px-6 md:px-8 2xl:px-16 py-18 md:py-20 items-center z-20 overflow-hidden">
      <div className="max-w-7xl 2xl:max-w-full mx-auto pt-8 md:pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Content */}
          <div className="lg:col-span-7 space-y-8">
            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl font-semibold leading-[1.1] text-white">
              THE <br />
              <span className="relative inline-block text-[#85c226]">SECRETARIAT.</span>
            </h1>
          </div>

          {/* Right Visual Element */}
          <div className="lg:col-span-5 relative">
            <p className="text-white/65 lg:text-2xl">
              GLUNS is entirely student-run. Our secretariat is elected each academic year and is
              responsible for every aspect of conference planning, committee management, and
              delegate experience.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
