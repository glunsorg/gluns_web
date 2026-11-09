import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Handshake, Mail, FileText } from 'lucide-react'
import { fetchSponsor } from '@/data/sponsorFetch'

export default async function Sponsorship() {
  const { sponsors } = await fetchSponsor()

  return (
    <section className="relative bg-white min-h-screen py-16 px-6 md:px-12 lg:px-24">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-16">
        <div className="flex flex-col items-center text-center">
          <h3 className="text-[#104179] text-xs md:text-sm 2xl:text-lg tracking-widest border-2 border-[#104179] rounded-xl px-6 py-2 font-semibold mb-4">
            PARTNERSHIP
          </h3>
          <h2 className="text-[#104179] text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Our Sponsors & Partners
          </h2>
          <div className="h-1 w-32 bg-[#85c226] mb-6"></div>
          <p className="text-[#104179]/70 text-lg md:text-xl max-w-3xl">
            We are grateful to our sponsors and partners who make GLUNS possible and help empower
            the next generation of global leaders.
          </p>
        </div>
      </div>

      {/* Sponsors Grid */}
      {sponsors.length > 0 && (
        <div className="max-w-7xl mx-auto mb-24">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 md:gap-8">
            {sponsors.map((sponsor, index) => (
              <div
                key={index}
                className="bg-white border-2 border-[#104179]/20 rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center hover:border-[#85c226] hover:shadow-xl transition-all duration-300 hover:scale-105 aspect-square"
              >
                <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                  <div className="relative w-full h-20 md:h-24 flex items-center justify-center">
                    <Image
                      src={sponsor.photoUrl}
                      alt={sponsor.name}
                      width={150}
                      height={80}
                      className="object-contain max-h-full w-auto"
                    />
                  </div>
                  <p className="text-[#104179] font-semibold text-center text-xs md:text-lg">
                    {sponsor.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Become a Sponsor Section */}
      <div className="max-w-6xl mx-auto mt-24">
        <div className="bg-[#104179] rounded-3xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Left Side - Content */}
            <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
              <div className="flex items-center space-x-3 mb-6">
                <Handshake className="w-10 h-10 md:w-12 md:h-12 text-[#85c226]" />
                <h3 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold">
                  Become a Sponsor
                </h3>
              </div>
              <p className="text-white/90 text-lg md:text-xl leading-relaxed mb-8">
                Partner with GLUNS to support youth leadership and diplomacy education. Join us in
                shaping the next generation of global leaders and make a lasting impact.
              </p>

              {/* Benefits List */}
              <div className="space-y-4 mb-8">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#85c226] rounded-full mt-2 shrink-0"></div>
                  <p className="text-white/90 text-base md:text-lg">
                    Brand visibility to international youth audience
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#85c226] rounded-full mt-2 shrink-0"></div>
                  <p className="text-white/90 text-base md:text-lg">
                    Recognition across all conference materials
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#85c226] rounded-full mt-2 shrink-0"></div>
                  <p className="text-white/90 text-base md:text-lg">
                    Networking opportunities with delegates and educators
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#85c226] rounded-full mt-2 shrink-0"></div>
                  <p className="text-white/90 text-base md:text-lg">
                    Corporate social responsibility impact
                  </p>
                </div>
              </div>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center space-x-2 bg-[#85c226] text-white font-bold px-8 py-4 rounded-xl hover:bg-white hover:text-[#104179] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 w-full sm:w-auto"
              >
                <span>Contact Us</span>
                <Mail className="w-5 h-5" />
              </Link>
            </div>

            {/* Right Side - Contact Info */}
            <div className="bg-[#85c226] p-8 md:p-12 lg:p-16 flex flex-col justify-center">
              <h4 className="text-white text-2xl md:text-3xl font-bold mb-8">Get in Touch</h4>

              {/* Contact Cards */}
              <div className="space-y-6">
                <div className="bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0">
                      <Mail className="w-6 h-6 text-[#104179]" />
                    </div>
                    <h5 className="text-white font-bold text-lg">Email Us</h5>
                  </div>
                  <a
                    href="mailto:info@gluns.org"
                    className="text-white/90 hover:text-white text-base md:text-lg transition-colors"
                  >
                    info@gluns.org
                  </a>
                </div>

                <div className="bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0">
                      <Mail className="w-6 h-6 text-[#104179]" />
                    </div>
                    <h5 className="text-white font-bold text-lg">Partnership enquiries</h5>
                  </div>
                  <a
                    href="mailto:info@gluns.org"
                    className="text-white/90 hover:text-white text-base md:text-lg transition-colors"
                  >
                    info@gluns.org
                  </a>
                </div>
              </div>

              {/* Download Brochure */}
              <div className="mt-8 pt-8 border-t-2 border-white/30">
                <button className="w-full bg-white text-[#104179] font-bold px-6 py-4 rounded-xl hover:bg-[#104179] hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Download Sponsorship Brochure</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Thank You Message */}
      <div className="max-w-4xl mx-auto mt-16 text-center">
        <div className="border-2 border-[#104179]/20 rounded-2xl p-8 md:p-12">
          <h3 className="text-[#104179] text-2xl md:text-3xl font-bold mb-4">
            Thank You to Our Sponsors
          </h3>
          <p className="text-[#104179]/70 text-lg leading-relaxed">
            Your generous support enables us to provide an exceptional experience for young
            delegates from around the world. Together, we are building a community of informed,
            engaged global citizens ready to tackle tomorrow{"'"}s challenges.
          </p>
        </div>
      </div>
    </section>
  )
}
