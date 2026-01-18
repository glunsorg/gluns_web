'use client'
import React, { useState } from 'react'
import { Mail, ArrowUpRight, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface SecretariatMember {
  name: string
  role: string
  photo: string
  email: string
  bio: string
}

export default function SecList() {
  const [selectedMember, setSelectedMember] = useState<SecretariatMember | null>(null)

  const seclist = [
    {
      name: 'Amina K. Mwangi',
      role: 'Secretary-General',
      photo: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39',
      email: 'aminamwangi@gluns.org',
      bio: `Amina K. Mwangi serves as the Secretary-General of the Global Leaders United Nations Symposium, providing overall strategic leadership and direction for the conference. She oversees all Secretariat departments, ensuring that academic programming, operations, and delegate engagement align with the core mission and values of GLUNS. Her role involves long-term planning, institutional coordination, and representing the conference in official capacities.

With a strong background in leadership development and international affairs, Amina is committed to creating an intellectually rigorous and inclusive environment for delegates. She works closely with faculty advisors, committee leadership, and partner institutions to ensure that GLUNS remains a high-impact platform for emerging global leaders.`,
    },
    {
      name: 'Joseph T. Odhiambo',
      role: 'Director-General',
      photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
      email: 'josephodhiambo@gluns.org',
      bio: `Joseph T. Odhiambo serves as the Director-General of GLUNS, overseeing the operational and administrative execution of the conference. He is responsible for translating the Secretariat's strategic vision into actionable plans, managing timelines, workflows, and interdepartmental coordination throughout the conference cycle.

Joseph plays a critical role in ensuring that all logistical and organizational elements function cohesively. His work supports both the academic and delegate-facing aspects of GLUNS, allowing the Secretariat to deliver a seamless and professionally managed conference experience.`,
    },
    {
      name: 'Sophia Njeri',
      role: 'Under-Secretary-General for Academic Affairs',
      photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
      email: 'sophianjeri@gluns.org',
      bio: `Sophia Njeri leads the Academic Affairs department, where she is responsible for the development and oversight of all academic content at GLUNS. This includes committee background guides, academic resources, and standards for debate and research. She works closely with committee chairs to ensure consistency, depth, and scholarly integrity across all committees.

Her focus is on fostering critical thinking, substantive debate, and meaningful engagement with global issues. Through careful academic planning and mentorship of committee staff, Sophia helps ensure that delegates are challenged intellectually and supported throughout the conference.`,
    },
    {
      name: 'Daniel M. Kimani',
      role: 'Under-Secretary-General for Logistics',
      photo: 'https://images.unsplash.com/photo-1552058544-f2b08422138a',
      email: 'danielkimani@gluns.org',
      bio: `Daniel M. Kimani oversees the Logistics department, managing the operational infrastructure that supports the GLUNS conference. His responsibilities include venue coordination, room assignments, scheduling, and on-site operational planning to ensure that all sessions run efficiently and on schedule.

Daniel's work ensures that delegates, chairs, and advisors can focus fully on the academic experience without disruption. Through careful planning and real-time problem solving, he plays a key role in maintaining a professional and well-organized conference environment.`,
    },
    {
      name: 'Fatima A. Hassan',
      role: 'Under-Secretary-General for Delegate Services',
      photo: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c',
      email: 'fatimahassan@gluns.org',
      bio: `Fatima A. Hassan leads Delegate Services, serving as the primary point of coordination for delegate support and engagement. She oversees onboarding processes, communications, and delegate inquiries, ensuring that participants are well-informed and supported before and during the conference.

Fatima is dedicated to enhancing the overall delegate experience by fostering clear communication, accessibility, and responsiveness. Her work helps create an inclusive and welcoming environment where delegates can fully engage with the academic and leadership opportunities offered by GLUNS.`,
    },
    {
      name: 'Michael O. Otieno',
      role: 'Under-Secretary-General for Outreach & Engagement',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
      email: 'michaelotieno@gluns.org',
      bio: `Michael O. Otieno heads Outreach and Engagement, managing GLUNS's external relations and institutional partnerships. He works with schools, educators, and community partners to expand participation and strengthen the conference's visibility and impact.

Through strategic outreach initiatives and sustained engagement with partner institutions, Michael helps position GLUNS as a leading platform for youth leadership and global dialogue. His work ensures that the conference continues to grow while remaining aligned with its educational mission.`,
    },
  ]

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
              } ${index === 3 ? 'lg:col-span-2' : ''}`}
            >
              <div className="relative h-full min-h-[400px] overflow-hidden">
                {/* Image Container */}
                <div className="absolute inset-0">
                  <Image
                    width={400}
                    height={200}
                    src={sec.photo}
                    alt={sec.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
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

              <Image
                width={400}
                height={200}
                src={selectedMember.photo}
                alt={selectedMember.name}
                className="w-44 h-44 md:w-72 md:h-72 object-cover object-center absolute left-4 top-4 md:right-28 md:bottom-8 rounded-3xl border border-white"
              />

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
