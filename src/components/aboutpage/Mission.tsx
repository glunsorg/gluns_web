import React from 'react'

export default function Mission() {
  return (
    <section className="relative bg-[#ffffff] w-full min-h-screen md:min-h-[60vh] rounded-t-3xl -mt-7 z-30 px-6 md:px-16 2xl:px-18 py-12 overflow-hidden">
      <div className="grid grid-cols-12 gap-4 md:gap-0">
        <div className="col-span-1 md:col-span-4">
          <h2 className="text-5xl md:text-7xl text-[#104179]">Inside GLUNS</h2>
        </div>
        <div className="col-span-1 md:col-span-8 flex flex-col justify-end items-end gap-8 text-[#104179]">
          <div className="w-[600px] h-[0.5px] bg-[#104179]"></div>
          <div className="mission flex flex-col md:flex-row md:gap-16 md:justify-end">
            <h4>01</h4>
            <h3 className="text-3xl">Our Mission</h3>
            <p className="w-full md:w-1/2 text-left">
              To cultivate a generation of future leaders equipped with the knowledge, skills, and
              character required to influence positive change in their communities, countries, and
              the global arena.
            </p>
          </div>

          <div className="w-[600px] h-[0.5px] bg-[#104179]"></div>

          <div className="vision flex flex-col md:flex-row md:gap-16 md:justify-end">
            <h4>02</h4>
            <h3 className="text-3xl">Our Vision</h3>
            <p className="md:w-1/2 text-left">
              A world where young people confidently take their place as drivers of global
              progress-grounded in diplomacy, empathy, and informed decision-making.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
