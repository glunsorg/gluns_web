import React from 'react'
import { FiArrowRight } from 'react-icons/fi'
import { IoLocationSharp } from "react-icons/io5";
import Image from 'next/image'
import Link from 'next/link';
import { GrLinkNext } from 'react-icons/gr';

export default function Events() {
  const events = [
    {
      title: 'GLUNS Leadership Summit',
      country:'Kenya',
      date: 'Mar 18, 2025',
      desc: 'A high-energy summit where students explore global diplomacy through expert-led workshops.',
      img: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Global Policy Debate',
      country:'Kenya',
      date: 'Apr 05, 2025',
      desc: 'Interactive debate sessions focusing on current global conflicts and international cooperation.',
      img: 'https://images.unsplash.com/photo-1551836022-1655a2ddc8c6?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Cultural Exchange Night',
      country:'Kenya',
      date: 'Jun 12, 2025',
      desc: 'A celebration of global diversity through music, art, dance, and collaborative performances.',
      img: 'https://images.unsplash.com/photo-1515165562835-c4c7b5de7f77?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Diplomacy Masterclass',
      country:'Kenya',
      date: 'Jul 22, 2025',
      desc: 'A professional masterclass led by international relations experts and former UN delegates.',
      img: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Resolution Writing Workshop',
      country:'Kenya',
      date: 'Aug 09, 2025',
      desc: 'Learn the art of drafting compelling and effective UN-style resolutions.',
      img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Closing Awards Ceremony',
      country:'Kenya',
      date: 'Nov 21, 2025',
      desc: 'Honoring outstanding young diplomats and celebrating GLUNS achievements.',
      img: 'https://images.unsplash.com/photo-1485217988980-11786ced9454?auto=format&fit=crop&w=1200&q=80',
    },
  ]

  return (
    <section className="relative bg-[#ffffff] min-h-screen md:min-h-[60vh] lg:min-h-screen rounded-t-3xl -mt-7 z-30 px-6 md:px-12 2xl:px-18 py-12 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col justify-center items-center text-center mb-16">
        <h3 className="text-[#104179] text-xs tracking-widest border border-[#104179] rounded-xl px-4 py-1">
          Events
        </h3>
        <h2 className="text-[#104179] text-4xl md:text-5xl font-bold mt-3">Upcoming Events</h2>
        <p className="text-[#104179] max-w-2xl mx-auto mt-4 text-lg">
          Join hundreds of young delegates in a dynamic, interactive, professionally organized Model
          UN experience.
        </p>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
        {events.map((event, index) => (
          <div
            key={index}
            className="rounded-3xl overflow-hidden shadow-md bg-[#104179]/5 border border-[#85c226] hover:shadow-xl transition-all duration-300"
          >
            {/* Image */}
            <div className="h-64 w-full overflow-hidden rounded-b-3xl shadow-lg shadow-[#000000]/20 border-b-2 border-[#85c226]">
              <Image
                width={500}
                height={500}
                src={event.img}
                alt={event.title}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              />
            </div>

            {/* Content */}
            <div className="p-6 flex justify-center items-center gap-3">
              {/* Date + Title */}
              <div className="flex items-center justify-between">
                <span className="text-[#104179] font-semibold text-xl">{event.date}</span>
              </div>

              <div className='w-0.5 h-14 bg-[#85c226]'></div>

              <div>
                <h2 className='flex items-center gap-1 text-[#104179]'><span><IoLocationSharp className='text-[#85c226]' /></span>{event.country}</h2>
                <h3 className="text-xl font-semibold text-[#104179]">{event.title}</h3>
                <p className='text-sm'>{event.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* links */}
      <div className='flex justify-center items-center mt-12'>
        <Link
          href="#"
          className="flex items-center justify-center gap-2 border border-[#104179] text-[#104179] text-xl rounded-xl px-4 py-2 hover:scale-105 transition-transform delay-200"
        >
         Explore All Events
          <GrLinkNext className="-rotate-45" />
        </Link>
      </div>
    </section>
  )
}
