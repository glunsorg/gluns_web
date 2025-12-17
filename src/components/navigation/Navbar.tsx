'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { HiMenuAlt2 } from 'react-icons/hi'
import { RiCloseLargeLine } from 'react-icons/ri'

// Social Icons
import { IoLogoTiktok, IoLogoInstagram, IoLogoWhatsapp } from 'react-icons/io5'
import { FaFacebookF } from 'react-icons/fa6'

export default function Navbar() {
  const [isMenuOpen, setMenuOpen] = useState(false)

  const toggleMenu = () => setMenuOpen(!isMenuOpen)

  const menuItems = [
    { name: 'Home', link: '/' },
    { name: 'About', link: '/about' },
    { name: 'The Secretariat', link: '/the-secretariat' },
    { name: 'Events', link: '/events' },
    { name: 'Committees', link: '/committees' },
    { name: 'Resources', link: '/resources' },
    { name: 'Contact', link: '/contact' },
  ]

  return (
    <>
      {/* Main Navbar */}
      <nav className="bg-[#ffffff] px-4 md:px-8 2xl:px-16 py-4 md:py-6 lg:py-4 2xl:py-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/">
            <Image
              src="/logos/bluelogo.png"
              alt="GLUNS Logo"
              width={500}
              height={500}
              className="w-32 md:w-32 2xl:w-40"
            />
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex mx-4 gap-6 2xl:gap-24 items-center">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.link}
                className="mx-2 font-semibold text-[#104179] tracking-wide text-lg 2xl:text-2xl hover:text-[#85c226] transition-colors duration-300"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex gap-2 items-center">
            <Link
              href="/registration"
              className="hidden md:flex 
    relative overflow-hidden 
    border border-[#104179] text-[#104179]
    px-6 md:px-4 py-2 md:py-1 lg:py-2 font-semibold ml-4 rounded-md 
    transition-colors duration-300
    before:absolute before:inset-0 before:bg-[#104179]
    before:translate-y-full before:transition-transform before:duration-300
    hover:before:translate-y-0
    hover:text-[#fffff6]
  "
            >
              <span className="relative z-10 2xl:text-2xl">Registration</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="ml-2 md:hidden cursor-pointer hover:scale-105 transition-transform"
              onClick={toggleMenu}
            >
              <HiMenuAlt2 size={40} className="text-[#104179]" />
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="fixed inset-0 z-50 md:hidden transition-all duration-300 animate-in fade-in">
              {/* Backdrop */}
              <div className="absolute inset-0 bg-[#104179]/40 backdrop-blur-sm" />

              {/* Drawer */}
              <div className="absolute top-0 left-0 h-screen w-[60%] bg-[#ffffff] flex flex-col p-4 space-y-6 shadow-lg">
                {/* Close Button */}
                <div className="flex justify-end">
                  <button
                    onClick={toggleMenu}
                    className="cursor-pointer hover:scale-105 transition-transform"
                  >
                    <RiCloseLargeLine size={30} className="text-[#104179]" />
                  </button>
                </div>

                {/* Links */}
                <div className="flex flex-col gap-8 mt-4">
                  {menuItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.link}
                      onClick={() => setMenuOpen(false)}
                      className="text-[#104179] font-semibold border-b-2 pb-2 border-[#104179] hover:scale-105 transition-all duration-300"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>

                {/* Social Links */}
                <div className="flex flex-col items-center mt-auto gap-4 p-4">
                  <h4 className="font-semibold text-lg text-[#104179]">Follow Us</h4>

                  <div className="grid grid-cols-2 gap-12">
                    <Link href="/" className="text-[#104179]">
                      <IoLogoTiktok size={30} />
                    </Link>
                    <Link href="/" className="text-[#104179]">
                      <FaFacebookF size={30} />
                    </Link>
                    <Link href="/" className="text-[#104179]">
                      <IoLogoInstagram size={30} />
                    </Link>
                    <Link href="/" className="text-[#104179]">
                      <IoLogoWhatsapp size={30} />
                    </Link>
                  </div>
                </div>

                {/* Copyright */}
                <div className="flex justify-center items-center mt-auto mb-4">
                  <h4 className="text-sm text-[#104179]">
                    © {new Date().getFullYear()} Global Leaders UN Symposium
                  </h4>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  )
}
