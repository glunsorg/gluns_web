'use client'
import React from 'react'

export default function AboutHero() {
  return (
    <section className="relative bg-[#051220] min-h-auto md:min-h-[50vh] lg:min-h-[50vh] flex px-6 md:px-8 2xl:px-16 items-center z-20 overflow-hidden">
      {/* gradient overlay */}
      <div className="absolute inset-0 bg-[url(/images/abouthero.jpg)] bg-cover bg-top" />

      <div className="absolute inset-0 bg-linear-to-tr from-[#051220]/90 via-[#051220]/75 to-[#051220]/45" />

      <div className="relative z-10 w-full pt-32 pb-20 justify-center items-center flex flex-col gap-4 md:gap-0 2xl:gap-0">
        <h1 className="text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl font-bold text-white md:text-center z-10 lg:max-w-2xl 2xl:max-w-4xl">
          EMPOWERING FUTURE GLOBAL LEADERS{' '}
        </h1>
      </div>
    </section>
  )
}
