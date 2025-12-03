import React from 'react'

export default function CTA() {
  return (
     <section className="relative bg-[#104179] min-h-screen rounded-t-3xl -mt-7 z-30 px-6 md:px-12 pt-20 pb-24 overflow-hidden border-t border-white">
          {/* Header */}
          <div className="flex flex-col justify-center items-center text-center mb-16">
            <h3 className="text-[#ffffff] text-xs tracking-widest border border-[#ffffff] rounded-xl px-4 py-1">
              How We Do It
            </h3>{' '}
            <h2 className="text-white text-4xl md:text-5xl font-bold mt-2">
              Experience the GLUNS Journey
            </h2>
            <p className="text-gray-200 max-w-2xl mx-auto mt-4 text-lg">
              A vibrant mix of debates, cultural activities, workshops, and global collaborations
              designed to inspire every delegate.
            </p>
          </div>
    
         
    
          {/* Decorative elements */}
          <div className="absolute bottom-40 right-10 w-40 h-40 border-4 border-white opacity-5 rounded-full pointer-events-none"></div>
        </section>
  )
}
