import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FaUsers } from 'react-icons/fa6'
import { HiArrowRight } from "react-icons/hi2";

const committees = [
  {
    id: 1,
    name: 'Security Council',
    description:
      'Oversees international peace and security, addressing conflicts, sanctions, and resolutions to maintain global stability.',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&q=80',
    link: '/committees/security-council',
    color: 'from-blue-600 to-blue-400',
  },
  {
    id: 2,
    name: 'Economic and Social Council',
    description:
      'Focuses on economic development, social progress, and global partnerships to improve living standards worldwide.',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80',
    link: '/committees/ecosoc',
    color: 'from-emerald-600 to-emerald-400',
  },
  {
    id: 3,
    name: 'Human Rights Council',
    description:
      'Works to protect and promote human rights globally, addressing violations and setting international standards.',
    image: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800&q=80',
    link: '/committees/hrc',
    color: 'from-purple-600 to-purple-400',
  },
  {
    id: 4,
    name: 'General Assembly',
    description:
      'Provides a platform for all member states to discuss global issues, pass resolutions, and collaborate on international policy.',
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80',
    link: '/committees/general-assembly',
    color: 'from-amber-600 to-amber-400',
  },
  {
    id: 5,
    name: 'Environmental Committee',
    description:
      'Addresses climate change, sustainability, and global environmental policies to create a greener, more sustainable future.',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&q=80',
    link: '/committees/environment',
    color: 'from-green-600 to-green-400',
  },
];

export default function CommitteeList() {
  return (
    <section className="relative bg-white min-h-screen rounded-t-3xl -mt-7 z-30 px-6 md:px-12 lg:px-16 py-8 md:py-12 overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#104179]/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Cards Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {committees.map((committee, index) => (
          <div
            key={committee.id}
            className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Image Container with Overlay */}
            <div className="relative w-full h-56 overflow-hidden">
              <Image 
                src={committee.image} 
                alt={committee.name} 
                fill 
                className="object-cover group-hover:scale-110 transition-transform duration-700" 
              />
              
              {/* Icon Badge */}
              <div className="absolute top-4 right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <FaUsers className="text-[#104179] text-xl" />
              </div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8 flex flex-col gap-4">
              <h3 className="text-2xl md:text-3xl font-bold text-[#104179] leading-tight">
                {committee.name}
              </h3>
              
              <p className="text-gray-600 text-sm md:text-base leading-relaxed line-clamp-3">
                {committee.description}
              </p>

              {/* CTA Link */}
              <Link
                href={committee.link}
                className="inline-flex items-center gap-2 text-[#104179] font-semibold mt-2 group-hover:gap-4 transition-all duration-300"
              >
                <span>Learn More</span>
                <HiArrowRight className="text-xl group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>

          </div>
        ))}
      </div>

      {/* Call to Action Section */}
      <div className="max-w-4xl mx-auto mt-20 text-center bg-[#104179] rounded-3xl p-10 md:p-16 shadow-2xl relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Join a Committee?
          </h3>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Take the first step towards becoming a global leader. Register for our upcoming conference and choose your committee.
          </p>
          <Link 
            href="/register" 
            className="inline-flex items-center gap-3 bg-white text-[#104179] px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-xl"
          >
            Register Now
            <HiArrowRight className="text-xl" />
          </Link>
        </div>
      </div>
    </section>
  )
}