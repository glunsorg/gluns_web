import React from 'react'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative bg-[#051220] min-h-[70vh] md:min-h-[50vh] lg:min-h-[70vh] 2xl:min-h-[70vh] flex px-6 md:px-8 2xl:px-16 items-center z-20 overflow-hidden">
      {/* gradient overlay */}
      <div className="absolute inset-0 bg-[url(/images/heroweb.jpg)] bg-cover bg-top" />

      <div className="absolute inset-0 bg-linear-to-tr from-[#051220]/90 via-[#051220]/75 to-[#051220]/45" />

      <div className="relative z-10 w-full pt-32 pb-20 justify-center items-center flex flex-col gap-4 md:gap-0 2xl:gap-0">
        <h1 className="text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl font-bold text-white text-center z-10">
          SIMULATE. DEBATE.
        </h1>
        <span className="text-[45px] md:text-6xl lg:text-7xl 2xl:text-8xl font-bold text-[#85C226] -mt-4 md:mt-0 text-center z-10">
          CHANGE THE WORLD.
        </span>

        <p className="md:mt-4 text-lg md:text-xl 2xl:text-3xl text-white text-center md:w-1/2 z-10">
          GLUNS curates rigorous Model UN conferences and solution-focused competitions for students
          who want to engage with the world{"'"}s hardest problems.
        </p>

        {/* cta buttons */}
        <div className="flex items-center gap-8">
          <Link
            href="/events"
            className="mt-8 inline-block relative overflow-hidden border border-[#ffffff] text-[#ffffff] px-6 md:px-8 py-3 font-semibold transition-colors duration-300 before:absolute before:inset-0 before:bg-[#ffffff] before:translate-y-full before:transition-transform before:duration-300 hover:before:translate-y-0 hover:text-[#104179]"
          >
            <span className="relative z-10 text-lg md:text-xl 2xl:text-2xl">VIEW EVENTS</span>
          </Link>

          <Link
            href="/registration"
            className="mt-8 inline-block relative overflow-hidden bg-[#85c226] text-white px-6 md:px-8 py-3 font-semibold transition-colors duration-300"
          >
            <span className="relative z-10 text-lg md:text-xl 2xl:text-2xl">REGISTER NOW</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
