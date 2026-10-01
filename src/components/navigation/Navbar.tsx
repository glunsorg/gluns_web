'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { HiMenuAlt2 } from 'react-icons/hi'
import { RiCloseLargeLine } from 'react-icons/ri'
import { useAuthStore } from '@/app/store/authStore'

// Social Icons
import { IoLogoTiktok, IoLogoInstagram, IoLogoWhatsapp } from 'react-icons/io5'
import { FaFacebookF } from 'react-icons/fa6'

export default function Navbar() {
  const [isMenuOpen, setMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { user, loading, checkAuth } = useAuthStore()

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen)
  }

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const menuItems = [
    { name: 'Home', link: '/' },
    { name: 'About', link: '/about' },
    { name: 'The Secretariat', link: '/the-secretariat' },
    { name: 'Events', link: '/events' },
    { name: 'Organs', link: '/organs' },
    { name: 'Contact', link: '/contact' },
  ]

  return (
    <>
      {/* Main Navbar */}
      <nav
        className={`top-0 left-0 w-full z-40 px-4 md:px-8 2xl:px-16 py-4 md:py-6 lg:py-4 2xl:py-6 transition-colors duration-300 ${
          isScrolled ? 'fixed bg-black' : 'absolute bg-transparent'
        }`}
      >
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/">
            <Image
              src="/logos/white.png"
              alt="GLUNS Logo"
              width={500}
              height={500}
              priority
              className="w-32 md:w-32 2xl:w-36"
            />
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex mx-4 gap-6 2xl:gap-8 items-center">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.link}
                className="mx-2 font-semibold text-white tracking-wide text-lg 2xl:text-xl hover:text-[#85c226] transition-colors duration-300 uppercase"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex gap-2 items-center">
            {!loading && !user ? (
              <Link
                href="/registration"
                className="hidden lg:flex relative overflow-hidden border border-white/65 text-white/65 p-2 text-center items-center font-semibold transition-colors duration-300 before:absolute before:inset-0 before:bg-[#104179] before:translate-y-full before:transition-transform before:duration-300 hover:before:translate-y-0 hover:text-[#fffff6]"
              >
                <span className="relative z-10 text-base 2xl:text-xl text-center uppercase">
                  Register Now{' '}
                </span>
              </Link>
            ) : (
              <Link
                href="/delegation-portal"
                className="hidden lg:flex relative overflow-hidden border border-white/65 text-white/65 p-2 text-center items-center font-semibold transition-colors duration-300 before:absolute before:inset-0 before:bg-[#104179] before:translate-y-full before:transition-transform before:duration-300 hover:before:translate-y-0 hover:text-[#fffff6]"
              >
                <span className="relative z-10 text-base 2xl:text-xl text-center uppercase">
                  Delegation Portal{' '}
                </span>
              </Link>
            )}
            {/* Mobile Menu Button */}
            <button
              className="ml-2 lg:hidden cursor-pointer hover:scale-105 transition-transform"
              title={isMenuOpen ? 'Close Menu' : 'Open Menu'}
              aria-label={isMenuOpen ? 'Close Menu' : 'Open Menu'}
              onClick={toggleMenu}
            >
              <HiMenuAlt2 size={40} className="text-white" />
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="fixed inset-0 z-50 lg:hidden transition-all duration-300 animate-in fade-in">
              {/* Backdrop */}
              <div className="absolute inset-0 bg-[#104179]/40 backdrop-blur-sm" />

              {/* Drawer */}
              <div className="absolute top-0 left-0 h-screen w-[60%] bg-[#000000]/50 flex flex-col p-4 space-y-6 shadow-lg">
                {/* Close Button */}
                <div className="flex justify-end">
                  <button
                    onClick={toggleMenu}
                    title="Close Menu"
                    aria-label="Close Menu"
                    className="cursor-pointer hover:scale-105 transition-transform"
                  >
                    <RiCloseLargeLine size={30} className="text-white" />
                  </button>
                </div>

                {/* Links */}
                <div className="flex flex-col gap-8 mt-4">
                  {menuItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.link}
                      onClick={() => setMenuOpen(false)}
                      className="text-white font-semibold border-b-2 pb-2 border-white hover:scale-105 transition-all duration-300 uppercase"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>

                {/* Social Links */}
                <div className="flex flex-col items-center mt-auto gap-4 p-4">
                  <h4 className="font-semibold text-lg text-white">Follow Us</h4>

                  <div className="grid grid-cols-4 gap-4">
                    <Link href="/" className="text-white">
                      <IoLogoTiktok size={30} />
                    </Link>
                    <Link href="/" className="text-white">
                      <FaFacebookF size={30} />
                    </Link>
                    <Link href="/" className="text-white">
                      <IoLogoInstagram size={30} />
                    </Link>
                    <Link href="/" className="text-white">
                      <IoLogoWhatsapp size={30} />
                    </Link>
                  </div>
                </div>

                {/* Copyright */}
                <div className="flex justify-center items-center mt-auto mb-4">
                  <h4 className="text-sm text-white">
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
