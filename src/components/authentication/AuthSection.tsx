'use client'
import React, { useState } from 'react'
import Image from 'next/image'

export default function AuthSection() {
  const [isLogin, setIsLogin] = useState(true)

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    console.log(isLogin ? 'Login submitted' : 'Signup submitted')
  }

  return (
    <section className="h-[90vh] md:min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <div className="grid grid-cols-1 lg:grid-cols-2 md:min-h-screen">
        {/* Left side - Logo and branding */}
        <div className="relative hidden lg:flex flex-col justify-center items-center p-8 bg-[url('/images/hero.jpg')] bg-bottom bg-cover">
          <div className="absolute inset-0 bg-linear-to-b from-white to-white/40"></div>
          <div className="z-30">
            <div className="w-24 h-24 flex items-center justify-center">
              <Image src="/logos/2.png" alt="GLUNS logo" width={500} height={500} />
            </div>
          </div>
          <div className="text-center max-w-lg z-30">
            <h2 className="text-5xl font-bold text-[#104179] mb-4">Welcome to GLUNS</h2>
            <p className="text-[#104179] text-lg">
              GLUNS is your gateway to international diplomacy and academic collaboration. Our
              platform empowers delegations to organize, communicate, and participate in global
              conferences with clarity, efficiency, and confidence.{' '}
            </p>
          </div>
        </div>

        {/* Right side - Auth form */}
        <div className="bg-[#104179] relative md:min-h-screen flex flex-col justify-center items-center py-12 sm:p-8 lg:p-12">
          <div className="w-full max-w-md">
            {/* Toggle buttons */}
            <div className="flex gap-2 mb-8 bg-white/10 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 px-6 rounded-md font-semibold transition-all ${
                  isLogin ? 'bg-white text-[#104179] shadow-lg' : 'text-white/70 hover:text-white'
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 px-6 rounded-md font-semibold transition-all ${
                  !isLogin ? 'bg-white text-[#104179] shadow-lg' : 'text-white/70 hover:text-white'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Form header */}
            <h4 className="text-white font-semibold text-3xl sm:text-4xl lg:text-5xl mb-4 text-center">
              {isLogin ? 'Delegation Login' : 'Create Account'}
            </h4>
            <p className="text-center text-white/65 mb-8 text-sm sm:text-base">
              {isLogin
                ? 'Enter your email and password to access your delegation account.'
                : 'Submit an application to register your delegation and join upcoming conferences.'}
            </p>

            {/* Form */}
            <div className="flex flex-col gap-4">
              {!isLogin && (
                <div>
                  <label htmlFor="delegation-name" className="text-white/80 text-sm mb-1 block">
                    Delegation Name
                  </label>
                  <input
                    id="delegation-name"
                    type="text"
                    placeholder="Enter delegation name"
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 transition"
                  />
                </div>
              )}

              <div>
                <label htmlFor="email" className="text-white/80 text-sm mb-1 block">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 transition"
                />
              </div>

              <div>
                <label htmlFor="password" className="text-white/80 text-sm mb-1 block">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 transition"
                />
              </div>

              {!isLogin && (
                <div>
                  <label htmlFor="confirm-password" className="text-white/80 text-sm mb-1 block">
                    Confirm Password
                  </label>
                  <input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm your password"
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 transition"
                  />
                </div>
              )}

              {isLogin && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-white/70 hover:text-white text-sm transition"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                onClick={handleSubmit}
                className="w-full mt-4 py-3 px-6 rounded-lg bg-white text-[#104179] font-semibold hover:bg-gray-100 transition-colors shadow-lg"
              >
                {isLogin ? 'Login' : 'Create Account'}
              </button>
            </div>

            {/* Additional info */}
            <p className="text-center text-white/50 text-sm mt-6">
              {isLogin ? (
                <>
                  Don{"'"}t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setIsLogin(false)}
                    className="text-white hover:underline font-medium"
                  >
                    Sign up here
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setIsLogin(true)}
                    className="text-white hover:underline font-medium"
                  >
                    Login here
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
