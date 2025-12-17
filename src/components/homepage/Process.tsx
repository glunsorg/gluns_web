import React from 'react'

export default function Process() {
  const events = [
    {
      number: '01',
      title: 'Opening Ceremony',
      desc: "Grand kick-off with keynote speakers, cultural performances, and unveiling GLUNS' global vision.",
      time: 'Day 1',
    },
    {
      number: '02',
      title: 'Committee Sessions',
      desc: 'Structured debates, draft resolutions, and collaborate on innovative policy solutions.',
      time: 'Day 1-3',
    },
    {
      number: '03',
      title: 'Workshops & Training',
      desc: 'Skill-building on diplomacy, leadership, research, and global communication.',
      time: 'Day 2',
    },
    {
      number: '04',
      title: 'Cultural Night',
      desc: 'Celebration of diversity through music, fashion, food, and world performances.',
      time: 'Day 2',
    },
    {
      number: '05',
      title: 'Networking Mixer',
      desc: 'Connect with delegates, mentors, and diplomats in a professional environment.',
      time: 'Day 3',
    },
    {
      number: '06',
      title: 'Closing Awards',
      desc: 'Honoring outstanding delegates and celebrating symposium success.',
      time: 'Day 3',
    },
  ]

  return (
    <section className="relative bg-[#104179] rounded-t-3xl -mt-7 z-30 px-6 md:px-12 2xl:px-18 py-20 overflow-hidden border-t border-white">
      {/* Header */}
      <div className="flex flex-col justify-center items-center text-center mb-16 md:mb-4 max-w-3xl mx-auto">
        <h3 className="text-white text-xs 2xl:text-lg tracking-widest border border-white rounded-xl px-4 py-1">
          How We Do It
        </h3>
        <h2 className="text-white text-4xl md:text-5xl font-bold mt-4 leading-tight">
          Experience the GLUNS Journey
        </h2>
        <p className="text-gray-200 mt-4 text-base 2xl:text-2xl">
          A vibrant mix of debates, cultural activities, workshops, and global collaborations.
        </p>
      </div>

      {/* Horizontal Timeline */}
      <div className="max-w-7xl 2xl:max-w-full mx-auto">
        {/* Desktop View - Horizontal */}
        <div className="hidden lg:block relative">
          {/* Horizontal Line */}
          <div className="absolute top-12 left-0 right-0 h-0.5 bg-linear-to-r from-white/20 via-white/50 to-white/20"></div>

          {/* Events */}
          <div className="grid grid-cols-6 gap-4">
            {events.map((event, index) => (
              <div key={index} className="relative">
                {/* Dot */}
                <div className="absolute top-12 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full border-4 border-[#104179] z-10 shadow-lg">
                  <div className="absolute inset-0 rounded-full bg-white animate-pulse opacity-30"></div>
                </div>

                {/* Content */}
                <div
                  className={`pt-24 ${index % 2 === 0 ? '' : 'pb-24 md:pb-4 pt-0 flex flex-col-reverse'}`}
                >
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5 hover:bg-white/15 transition-all duration-300">
                    {/* Number */}
                    <div className="text-3xl font-bold text-white/30 mb-2">{event.number}</div>

                    {/* Title */}
                    <h3 className="text-white text-3xl font-bold mb-2 leading-tight">
                      {event.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-200 text-sm 2xl:text-base leading-relaxed mb-3">{event.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile/Tablet View - Vertical */}
        <div className="lg:hidden relative">
          {/* Vertical Line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-linear-to-b from-white/20 via-white/50 to-white/20"></div>

          {/* Events */}
          <div className="space-y-8">
            {events.map((event, index) => (
              <div key={index} className="relative flex gap-6">
                {/* Dot */}
                <div className="relative shrink-0">
                  <div className="w-12 h-12 bg-white rounded-full border-4 border-[#104179] flex items-center justify-center shadow-lg z-10">
                    <span className="text-[#104179] text-sm font-bold">{event.number}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 pb-4">
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300">
                    {/* Title */}
                    <h3 className="text-white text-2xl font-bold mb-2">{event.title}</h3>

                    {/* Description */}
                    <p className="text-gray-200 text-base leading-relaxed mb-3">{event.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 -left-20 w-60 h-60 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-20 -right-20 w-60 h-60 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
    </section>
  )
}
