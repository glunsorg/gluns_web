import React from 'react'
import Image from 'next/image'

export default function Process() {
  const events = [
    {
      title: 'Opening Ceremony',
      desc: "A grand kick-off featuring keynote speakers, cultural performances, and the unveiling of GLUNS' global vision.",
      img: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1200&q=80',
      link: '#opening-ceremony',
    },
    {
      title: 'Committee Sessions',
      desc: 'Engage in structured debates, draft resolutions, and collaborate on innovative policy solutions.',
      img: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
      link: '#committee-sessions',
    },
    {
      title: 'Workshops & Training',
      desc: 'Skill-building workshops on diplomacy, leadership, research, and global communication.',
      img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
      link: '#workshops',
    },
    {
      title: 'Cultural Night',
      desc: 'A celebration of diversity through music, fashion, food, and performances from around the world.',
      img: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
      link: '#cultural-night',
    },
    {
      title: 'Networking Mixer',
      desc: 'Connect with delegates, mentors, and diplomats in a relaxed, professional environment.',
      img: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1200&q=80',
      link: '#networking',
    },
    {
      title: 'Closing Awards',
      desc: 'Honoring outstanding delegates and celebrating the success of the symposium.',
      img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
      link: '#closing-awards',
    },
  ]

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

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {events.map((event, index) => (
          <div
            key={index}
            className="group block bg-white border border-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform"
          >
            {/* Image Container */}
            <div className="relative h-56 overflow-hidden">
              <Image
                fill
                src={event.img}
                alt={event.title}
                className="w-full h-full object-cover transition-transform duration-700"
              />
              {/* Decorative corner accent */}
              <div
                className="absolute top-0 right-0 w-20 h-20 bg-[#104179] transition-opacity duration-300"
                style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 0)' }}
              ></div>
            </div>

            {/* Content */}
            <div className="p-6 bg-white">
              {/* Title with accent line */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-1 h-8 bg-[#85c226] transition-all duration-300"></div>
                <h3 className="text-[#104179] text-xl font-semibold transition-colors duration-300">
                  {event.title}
                </h3>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-base leading-relaxed mb-4">{event.desc}</p>
            </div>

            {/* Bottom accent bar */}
            <div className="h-1 bg-[#104179] w-0 group-hover:w-full transition-all duration-500"></div>
          </div>
        ))}
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-40 right-10 w-40 h-40 border-4 border-white opacity-5 rounded-full pointer-events-none"></div>
    </section>
  )
}
