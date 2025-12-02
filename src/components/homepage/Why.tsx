'use client'
import React from 'react'
// icons
import { VscActivateBreakpoints } from 'react-icons/vsc'

export default function Why() {
  const WhyUsList = [
    {
      text: 'Think critically about global issues',
    },
    {
      text: 'Negotiate solutions through diplomacy',
    },
    {
      text: 'Lead with confidence, empathy & purpose',
    },
    {
      text: 'Collaborate across cultures & perspectives',
    },
    {
      text: 'Engage in real-world policy simulations',
    },
  ]

  return (
    <section className="relative bg-[#104179] min-h-screen rounded-t-3xl -mt-7 z-30 px-6 md:px-8 py-4 overflow-hidden border-t border-white">
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-12 w-full">
        {/* LEFT SIDE */}
        <div className="py-12 flex flex-col gap-2">
          <div className="border border-white rounded-3xl px-2 w-24 flex items-center text-center justify-center">
            <h3 className="text-white">Why GLUNS</h3>
          </div>

          <h2 className="mt-4 text-5xl md:text-6xl text-white leading-tight font-light">
            Our symposium nurtures young minds with the skills they need to thrive in an
            increasingly interconnected world.
          </h2>

          <p className="mt-4 text-white/80 text-lg leading-relaxed">
            At GLUNS, students don{"'"}t just participate—they transform. Through immersive debates,
            real-world policy simulations, and collaborative diplomacy, participants learn to think
            critically, negotiate with purpose, and lead with empathy. GLUNS equips young people
            with the confidence, global awareness, and personal empowerment needed to shape
            tomorrow’s world.
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="md:py-24 flex flex-col md:justify-between gap-6 md:gap-8">
          {WhyUsList.map((item, index) => (
            <div key={index} className="flex items-end gap-4">
              <VscActivateBreakpoints size={30} className="text-[#85c226]" />{' '}
              <div className="flex-1">
                <p className="text-white text-3xl md:text-4xl font-extralight">
                  {item.text}
                </p>
                <div className="w-full md:w-1/2 h-0.5 bg-white/20 mt-3"></div>
              </div>
            </div>
          ))}
        </div>       
      </div>
    </section>
  )
}
