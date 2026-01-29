import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FaFacebookF, FaInstagram, FaXTwitter, FaLinkedinIn } from 'react-icons/fa6'

export default function Footer() {
  return (
    <footer className="relative bg-white rounded-t-3xl -mt-7 z-30 overflow-hidden">
      {/* Decorative Top Border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-[#104179]/20 to-transparent"></div>

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
                src="/logos/bluelogo.png"
                alt="GLUNS Logo"
                width={500}
                height={500}
                className="w-40 md:w-44 hover:scale-105 transition-transform duration-300"
              />
            </Link>

            <p className="text-gray-600 text-base 2xl:text-2xl leading-relaxed max-w-sm">
              Empowering the next generation of global leaders through diplomacy, collaboration, and
              world-class Model UN experiences.
            </p>

            {/* Newsletter Signup */}
            <div className="space-y-3">
              <h4 className="text-[#104179] font-semibold text-sm 2xl:text-2xl">Stay Updated</h4>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2.5 text-sm 2xl:text-2xl border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#104179]/20 focus:border-[#104179]"
                />
                <button className="px-5 py-2.5 bg-[#104179] text-white font-medium text-sm 2xl:text-2xl rounded-lg hover:bg-[#104179]/90 transition-colors duration-300">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {/* Quick Links */}
            <div>
              <h3 className="text-[#104179] font-bold text-base 2xl:text-2xl mb-5 flex items-center gap-2">
                <span className="w-1 h-4 bg-[#104179] rounded-full"></span>
                Quick Links
              </h3>
              <ul className="space-y-3">
                {[
                  { name: 'About Us', href: '/about' },
                  { name: 'Committees', href: '/committees' },
                  { name: 'Events', href: '/events' },
                  { name: 'Contact', href: '/contact' },
                ].map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-600 hover:text-[#104179] transition-colors duration-200 text-sm 2xl:text-2xl flex items-center gap-2 group"
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
              <h3 className="text-[#104179] font-bold text-base 2xl:text-2xl mb-5 flex items-center gap-2">
                <span className="w-1 h-4 bg-[#104179] rounded-full"></span>
                Resources
              </h3>
              <ul className="space-y-3">
                {[
                  { name: 'Register', href: '/authentication' },
                  { name: 'Guidelines', href: '/guidelines' },
                  { name: 'FAQs', href: '/faqs' },
                  { name: 'Sponsorship', href: '/sponsors' },
                ].map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-600 hover:text-[#104179] transition-colors duration-200 text-sm 2xl:text-2xl flex items-center gap-2 group"
                    >
                      <span className="w-0 h-px bg-[#104179] group-hover:w-4 transition-all duration-300"></span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h3 className="text-[#104179] font-bold text-base 2xl:text-2xl mb-5 flex items-center gap-2">
                <span className="w-1 h-4 bg-[#104179] rounded-full"></span>
                Connect
              </h3>

              <p className="text-gray-600 text-sm 2xl:text-2xl mb-5 leading-relaxed">
                Join our community and stay connected with global leaders
              </p>

              <div className="flex gap-3 2xl:gap-8">
                {/* Facebook */}
                <Link
                  href="#"
                  aria-label="Facebook"
                  className="w-11 h-11 2xl:w-16 2xl:h-16 flex items-center justify-center rounded-xl bg-gray-100 text-gray-600 
    hover:bg-[#104179] hover:text-white hover:scale-110 transition-all duration-300 shadow-sm"
                >
                  <FaFacebookF size={18} className="w-6 h-6 2xl:w-9 2xl:h-9" />
                </Link>

                {/* Instagram */}
                <Link
                  href="#"
                  aria-label="Instagram"
                  className="w-11 h-11 2xl:w-16 2xl:h-16 flex items-center justify-center rounded-xl bg-gray-100 text-gray-600 
    hover:bg-[#104179] hover:text-white hover:scale-110 transition-all duration-300 shadow-sm"
                >
                  <FaInstagram size={18} className="w-6 h-6 2xl:w-9 2xl:h-9" />
                </Link>

                {/* X (Twitter) */}
                <Link
                  href="#"
                  aria-label="Twitter / X"
                  className="w-11 h-11 2xl:w-16 2xl:h-16 flex items-center justify-center rounded-xl bg-gray-100 text-gray-600 
    hover:bg-[#104179] hover:text-white hover:scale-110 transition-all duration-300 shadow-sm"
                >
                  <FaXTwitter size={18} className="w-6 h-6 2xl:w-9 2xl:h-9" />
                </Link>

                {/* LinkedIn */}
                <Link
                  href="#"
                  aria-label="LinkedIn"
                  className="w-11 h-11 2xl:w-16 2xl:h-16 flex items-center justify-center rounded-xl bg-gray-100 text-gray-600 
    hover:bg-[#104179] hover:text-white hover:scale-110 transition-all duration-300 shadow-sm"
                >
                  <FaLinkedinIn size={18} className="w-6 h-6 2xl:w-9 2xl:h-9" />
                </Link>
              </div>
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
