import React from 'react'

export default function CommitteeHero() {
  return (
    <section className="relative bg-[#0d0d0d] min-h-auto flex px-6 md:px-8 2xl:px-16 py-20 items-center z-20 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-7xl 2xl:max-w-full mx-auto pt-20">
        <h2 className="text-white text-7xl md:text-8xl col-auto lg:col-span-6 leading-[1.1] uppercase">
          Our <span className="text-[#85c226]">Organs.</span>
        </h2>
        <p className="text-white text-base lg:text-2xl 2xl:text-3xl lg:col-span-6">
          Discover the various organs that make up our organization and their unique roles in
          driving our mission forward.
        </p>
      </div>
    </section>
  )
}
