import React from 'react'

// This page shows that the page is not yet developed and is coming soon.
export default function BlankPage() {
  return (
    <section className="relative flex min-h-auto py-16 items-center justify-center px-6">
      <div className="relative w-full max-w-xl border px-10 py-14 sm:px-14 sm:py-16 bg-[#0d0d0d]">
        <div className="flex flex-col items-center text-center">
          <h1 className="mb-4 text-5xl leading-[1.15] text-white">
            This page is still under construction.
          </h1>

          <p className="max-w-sm text-[0.95rem] leading-relaxed" style={{ color: '#7e93a8' }}>
            We{"'"}re sketching out the details behind this one. Come back once the lines are inked
            in.
          </p>
        </div>
      </div>
    </section>
  )
}
