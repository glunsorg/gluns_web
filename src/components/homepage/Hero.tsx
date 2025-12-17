import React from 'react'
import Link from 'next/link'
import { IoIosArrowForward } from "react-icons/io";
import { SiUnitednations } from "react-icons/si";


export default function Hero() {
  return (
    <section className="relative bg-[#051220] md:min-h-[60vh] lg:min-h-screen 2xl:min-h-[120vh] flex px-6 md:px-8 2xl:px-16 items-center overflow-hidden">
      {/* gradient overlay */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920')] bg-cover bg-center" />

      <div className="absolute inset-0 bg-linear-to-br from-[#051220]/95 via-[#051220]/85 to-transparent" />

      <div className="relative z-10 w-full md:max-w-2xl lg:max-w-3xl 2xl:max-w-5xl py-20">
        <h3 className="text-[#ffffff] font-semibold text-xl 2xl:text-3xl flex items-center">
            <span>
                <SiUnitednations className="inline-block mr-2 text-3xl 2xl:text-4xl mb-1" />
            </span>Welcome to GLUNS</h3>
        <h1 className="text-5xl md:text-6xl lg:text-7xl 2xl:text-[8rem] font-bold text-white text-left z-10">
          Empowering the Next Generation of <span className="text-[#ffffff]">Global Leaders</span>
        </h1>
        <p className="mt-4 text-lg md:text-xl 2xl:text-4xl text-white text-left z-10">
          At the Global Leaders United Nations Symposium (GLUNS), high school delegates step into
          the world of diplomacy, leadership, and international affairs - learning to debate global
          issues, negotiate solutions, and build a better tomorrow.{' '}
        </p>

        {/* stats */}
        <div className="grid grid-cols-3 gap-6 md:gap-12 pt-8 max-w-2xl">
          <div className="space-y-2">
            <div className="text-4xl md:text-5xl font-bold text-white">500+</div>
            <div className="text-sm md:text-base 2xl:text-xl text-white/70">Delegates</div>
          </div>
          <div className="space-y-2">
            <div className="text-4xl md:text-5xl font-bold text-white">50+</div>
            <div className="text-sm md:text-base 2xl:text-xl text-white/70">Schools</div>
          </div>
          <div className="space-y-2">
            <div className="text-4xl md:text-5xl font-bold text-white">20+</div>
            <div className="text-sm md:text-base 2xl:text-xl text-white/70">Committees</div>
          </div>
        </div>

        {/* cta buttons */}
        <div className='flex items-center gap-8'>
          <Link
            href="/registration"
            className="mt-8 inline-block relative overflow-hidden border border-[#ffffff] text-[#ffffff] px-6 md:px-8 py-3 font-semibold rounded-md transition-colors duration-300 before:absolute before:inset-0 before:bg-[#ffffff] before:translate-y-full before:transition-transform before:duration-300 hover:before:translate-y-0 hover:text-[#104179]">
            <span className="relative z-10 text-lg md:text-xl 2xl:text-2xl">Register Now</span>
          </Link>

          <Link
            href="/about"
            className='text-white inline-block mt-8 font-semibold border-b-2 border-white pb-1 hover:scale-105 transition-all duration-300'>
            <span className="relative z-10 text-lg md:text-xl 2xl:text-2xl">Learn More</span>
            <IoIosArrowForward className="inline-block ml-2 relative z-10 text-lg md:text-xl" />
          </Link>
        </div>
      </div>
    </section>
  )
}
