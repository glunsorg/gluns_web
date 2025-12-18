import React from 'react'
import Link from 'next/link'

export default function SecHero() {
  return (
    <section className="w-full px-8 2xl:px-16 min-h-screen">
      <div className="relative bg-[url(/images/darkbg.jpg)] bg-cover bg-center h-[40vh] md:h-[60vh] rounded-3xl flex flex-col justify-center">
        <div className="absolute inset-0 bg-linear-to-br rounded-3xl from-[#104179]/95 via-[#051220]/85 to-transparent" />
        <div className="flex relative flex-col justify-center items-center gap-6 px-4 md:px-20">
          <h3 className="text-white text-4xl md:text-6xl text-center">
            The leadership team behind the Global Leaders United Nations Symposium.{' '}
          </h3>
          <p className="text-white text-base md:text-2xl text-center md:w-[80%]">
            The GLUNS Secretariat coordinates conference planning, operations, and delegate
            experience, ensuring a rigorous, inclusive, and impactful platform for emerging global
            leaders.
          </p>
        </div>

        <div className="flex justify-center items-center mt-6 z-30 gap-6 md:gap-12">
          <Link href="#" className="bg-white rounded-xl px-6 py-2">
            Committees
          </Link>
          <Link href="#" className="border text-white border-white rounded-xl px-6 py-2">
            Talk To Us
          </Link>
        </div>
      </div>
    </section>
  )
}
