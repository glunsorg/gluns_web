'use client'
export const dynamic = 'force-dynamic'

import React, { useState } from 'react'
import { Mail, ArrowUpRight, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { SecretariatMember } from '@/app/types/types'

export default function SecList({ secretariat }: { secretariat: SecretariatMember[] }) {
  const [selectedMember, setSelectedMember] = useState<SecretariatMember | null>(null)
  const seclist = secretariat

  return (
    <section className="relative bg-white pt-2 pb-12 px-6 md:px-8 2xl:px-16 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute top-20 left-10 w-72 h-72 rounded-full"
          style={{ backgroundColor: '#104179' }}
        ></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 rounded-full"
          style={{ backgroundColor: '#104179' }}
        ></div>
        <div
          className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full"
          style={{ backgroundColor: '#104179' }}
        ></div>
      </div>

      <div className="mx-auto relative z-10">
        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {seclist.map((sec, index) => (
            <div
              key={index}
              onClick={() => setSelectedMember(sec)}
              className={`relative cursor-pointer group ${
                index === 0 ? 'md:col-span-2 md:row-span-2' : ''
              } }`}
            >
              <div className="relative h-full min-h-[400px] overflow-hidden">
                {/* Image Container */}
                <div className="absolute inset-0">
                  {sec.photoUrl && (
                    <Image
                      width={1024}
                      height={1024}
                      src={sec.photoUrl}
                      alt={sec.name}
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                    />
                  )}
                  {/* Dark Overlay */}
                  <div className="absolute inset-0 bg-black opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 p-8 flex flex-col justify-between">
                  {/* Top Corner Accent */}
                  <div className="flex justify-end">
                    <div
                      className="w-16 h-16 flex items-center justify-center transform rotate-45 opacity-90"
                      style={{ backgroundColor: '#104179' }}
                    >
                      <ArrowUpRight className="w-6 h-6 text-white transform -rotate-45" />
                    </div>
                  </div>

                  {/* Bottom Content */}
                  <div className="text-white">
                    <div className="mb-4">
                      <div className="w-12 h-1 bg-white mb-4"></div>
                      <h3 className="text-3xl font-bold mb-2 leading-tight">{sec.name}</h3>
                      <p className="text-lg font-medium opacity-90 mb-4">{sec.role}</p>
                    </div>

                    {/* Hover Actions */}
                    <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Link
                        href={`mailto:${sec.email}`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-2 text-sm hover:underline"
                      >
                        <Mail className="w-4 h-4" />
                        <span>Contact</span>
                      </Link>
                      <span className="text-sm font-semibold">View Profile →</span>
                    </div>
                  </div>
                </div>

                {/* Number Badge */}
                <div className="absolute top-8 left-8">
                  <div
                    className="w-12 h-12 flex items-center justify-center text-white font-black text-xl"
                    style={{ backgroundColor: '#104179' }}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedMember && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-6"
          onClick={() => setSelectedMember(null)}
        >
          <div
            className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedMember(null)}
              className="absolute top-6 right-6 z-10 w-12 h-12 cursor-pointer flex items-center justify-center bg-white hover:bg-gray-100 transition-colors"
              style={{ color: '#104179' }}
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Header with Image */}
            <div className="relative h-80">
              <div className="absolute inset-0 bg-[#104179]"></div>

              {selectedMember.photoUrl && (
                <Image
                  width={400}
                  height={200}
                  src={selectedMember.photoUrl}
                  alt={selectedMember.name}
                  className="w-44 h-44 md:w-72 md:h-72 object-cover object-top absolute left-4 top-4 md:right-28 md:bottom-8 rounded-3xl border border-white"
                />
              )}

              <div className="absolute -bottom-8 md:bottom-0 -left-6 md:left-80 p-12 text-white">
                <h3 className="text-4xl md:text-5xl font-black md:mb-3 tracking-wider">
                  {selectedMember.name}
                </h3>
                <p className="text-2xl font-medium">{selectedMember.role}</p>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-12">
              <div
                className="flex items-center gap-4 mb-8 pb-8 border-b-2"
                style={{ borderColor: '#104179' }}
              >
                <Link
                  href={`mailto:${selectedMember.email}`}
                  className="flex items-center gap-2 hover:opacity-70 transition-opacity"
                  style={{ color: '#104179' }}
                >
                  <Mail className="w-5 h-5" />
                  <span className="font-semibold">{selectedMember.email}</span>
                </Link>
              </div>

              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                  {selectedMember.bio}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
