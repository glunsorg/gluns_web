import React from 'react'
import Image from 'next/image'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function CommitteeMembers({ members }: { members: any[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {members.map((member, index) => (
        <div
          key={member.id}
          className="group relative"
          style={{
            animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
          }}
        >
          {/* Card Container */}
          <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20 shadow-2xl transition-all duration-500 hover:scale-105 hover:shadow-[#104179]">
            {/* Gradient Overlay */}

            {/* Shine Effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-[#104179]"></div>

            {/* Content */}
            <div className="relative p-6">
              {/* Image Container */}
              <div className="relative w-60 h-60 mx-auto mb-6">
                {/* Image Wrapper */}
                <div className="absolute inset-0 rounded-lg overflow-hidden border-4 border-slate-900 bg-slate-800">
                  <Image
                    src={
                      typeof member.photo === 'object' && member.photo.url
                        ? member.photo.url
                        : '/default-profile.png'
                    }
                    alt={member.name}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Text Content */}
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-black tracking-tight transition-colors duration-300 group-hover:text-[#104179]">
                  {member.name}
                </h3>
                <div className="h-px w-16 bg-[#104179] mx-auto"></div>
                <p className="text-black font-medium text-sm uppercase tracking-wider">
                  {member.position}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
