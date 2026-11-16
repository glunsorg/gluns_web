import React from 'react'

export default function Functions() {
  const events = [
    {
      number: '01',
      title: 'Model UN Debates',
      desc: 'Students immerse themselves in realistic UN simulations, representing nations, analyzing issues, drafting resolutions, and negotiating outcomes.',
    },
    {
      number: '02',
      title: 'Leadership & Personal Growth Workshops',
      desc: 'We develop essential leadership skills such as public speaking, critical thinking, emotional intelligence, and strategic communication.',
    },
    {
      number: '03',
      title: 'International Collaboration',
      desc: 'Delegates work alongside peers from diverse backgrounds, giving them the opportunity to understand new perspectives and build global networks.',
    },
    {
      number: '04',
      title: 'Policy, Governance & Diplomacy Training',
      desc: 'Participants gain awareness of global governance, sustainable development goals, and the complexities of international relations.',
    },
    {
      number: '05',
      title: 'Cultural and Social Experiences',
      desc: 'We celebrate diversity through cultural showcases, networking sessions, and team-building activities that enrich the GLUNS experience.',
    },
  ]

  return (
    <section className="relative bg-[#0d1a0d] rounded-t-3xl -mt-7 z-30 px-6 md:px-12 py-12 md:py-20 overflow-hidden border-t border-white">
      {/* Header */}
      <div className="flex flex-col justify-center items-center md:text-center mb-16 md:mb-4 mx-auto">
        <h2 className="text-white text-4xl md:text-6xl lg:text-7xl 2xl:text-8xl font-bold mt-4 leading-tight uppercase">
          A Complete GLUNS Experience{' '}
        </h2>
        <p className="text-gray-200 mt-4 text-lg lg:text-xl">
          A Journey That Builds Skills, Perspective, and Purpose{' '}
        </p>
      </div>

      {/* Horizontal Timeline */}
      <div className="max-w-7xl 2xl:max-w-full mx-auto">
        {/* Desktop View - Horizontal */}
        <div className="hidden lg:block relative">
          {/* Horizontal Line */}

          {/* Events */}
          <div className="grid grid-cols-3 gap-4">
            {events.map((event, index) => (
              <div key={index} className="relative">
                {/* Content */}
                <div
                  className={`pt-4 ${index % 2 === 0 ? '' : 'pb-2 md:pb-4 pt-0 flex flex-col-reverse'}`}
                >
                  <div className="border-l border-white/20 pl-6 md:pl-8 lg:pl-10 2xl:pl-12">
                    {/* Number */}
                    <div className="text-3xl font-bold text-[#85c226] mb-2">{event.number}</div>

                    {/* Title */}
                    <h3 className="text-white text-3xl font-bold mb-2 leading-tight uppercase">
                      {event.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-200 text-sm md:text-base 2xl:text-base leading-relaxed mb-3">
                      {event.desc}
                    </p>
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
