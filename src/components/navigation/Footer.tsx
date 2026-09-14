import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTiktok } from 'react-icons/fa6'

export default function Footer() {
  return (
    <footer className="relative bg-[#0d0d0d] rounded-t-3xl -mt-7 z-30 overflow-hidden border-t-6 border-[#85c226]">
      {/* Decorative Background Elements */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-[#104179]/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#104179]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-7xl 2xl:max-w-full mx-auto px-6 md:px-12 2xl:px-18 py-16">
        {/* Main Content Grid */}
        <div className="grid md:grid-cols-12 gap-12 mb-12">
          {/* Brand Column - Larger */}
          <div className="md:col-span-4 space-y-6">
            <Link href="/" className="inline-block">
              <Image
                src="/logos/white.png"
                alt="GLUNS Logo"
                width={500}
                height={500}
                className="w-40 md:w-44 hover:scale-105 transition-transform duration-300"
              />
            </Link>

            <p className="text-gray-600 text-lg md:text-xl 2xl:text-3xl leading-relaxed max-w-sm">
              Empowering the next generation of global leaders through diplomacy, collaboration, and
              world-class Model UN experiences.
            </p>
          </div>

          {/* Navigation Columns */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {/* Quick Links */}
            <div>
              <h3 className="text-white font-bold text-base 2xl:text-2xl mb-5 flex items-center gap-2">
                <span className="w-1 h-4 bg-[#104179] rounded-full"></span>
                Quick Links
              </h3>
              <ul className="space-y-3">
                {[
                  { name: 'About Us', href: '/about' },
                  { name: 'Organs', href: '/organs' },
                  { name: 'Events', href: '/events' },
                  { name: 'Contact', href: '/contact' },
                ].map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-600 hover:text-[#104179] transition-colors duration-200 text-lg md:text-xl 2xl:text-2xl flex items-center gap-2 group"
                    >
                      <span className="w-0 h-px bg-[#104179] group-hover:w-4 transition-all duration-300"></span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-white font-bold text-base 2xl:text-2xl mb-5 flex items-center gap-2">
                <span className="w-1 h-4 bg-[#104179] rounded-full"></span>
                Resources
              </h3>
              <ul className="space-y-3">
                {[
                  { name: 'Register', href: '/registration' },
                  { name: 'Sponsorship', href: '/sponsors' },
                  { name: 'FAQs', href: '/faqs' },
                ].map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-600 hover:text-[#104179] transition-colors duration-200 text-lg md:text-xl 2xl:text-2xl flex items-center gap-2 group"
                    >
                      <span className="w-0 h-px bg-[#104179] group-hover:w-4 transition-all duration-300"></span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-white font-bold text-base 2xl:text-2xl mb-5 flex items-center gap-2">
                <span className="w-1 h-4 bg-[#104179] rounded-full"></span>
                Contact
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="mailto:info@gluns.org"
                    className="text-gray-600 hover:text-[#104179] transition-colors duration-200 text-lg md:text-xl 2xl:text-2xl flex items-center gap-2 group"
                  >
                    <span className="w-0 h-px bg-[#104179] group-hover:w-4 transition-all duration-300"></span>
                    info@gluns.org
                  </Link>
                </li>
                <li>
                  <Link
                    href="mailto:admin@gluns.org"
                    className="text-gray-600 hover:text-[#104179] transition-colors duration-200 text-lg md:text-xl 2xl:text-2xl flex items-center gap-2 group"
                  >
                    <span className="w-0 h-px bg-[#104179] group-hover:w-4 transition-all duration-300"></span>
                    admin@gluns.org
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-600 hover:text-[#104179] transition-colors duration-200 text-lg md:text-xl 2xl:text-2xl flex items-center gap-2 group"
                  >
                    <span className="w-0 h-px bg-[#104179] group-hover:w-4 transition-all duration-300"></span>
                    Luther Plaza, NBO{' '}
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-600 hover:text-[#104179] transition-colors duration-200 text-lg md:text-xl 2xl:text-2xl flex items-center gap-2 group"
                  >
                    <span className="w-0 h-px bg-[#104179] group-hover:w-4 transition-all duration-300"></span>
                    Kenya{' '}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-center items-center">
            <p className="text-gray-500 text-sm 2xl:text-2xl">
              © {new Date().getFullYear()} GLUNS. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
