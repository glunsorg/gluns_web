'use client'

import React, { useState } from 'react'
import SignInForm from './forms/SignInForm'
import SignUpForm from './forms/SignUpForm'

type AuthView = 'signin' | 'signup'

export default function RegistrationForms() {
  const [activeView, setActiveView] = useState<AuthView>('signin')

  return (
    <main className="bg-[#f8fbff] px-4 pb-12 pt-6 sm:px-6 lg:px-8 lg:pb-16">
      <div className="mx-auto mb-8 flex w-full max-w-3xl items-center justify-between gap-4 border border-[#104179]/10 bg-white p-2 shadow-[0_16px_40px_rgba(16,65,121,0.08)]">
        <div className="grid flex-1 grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setActiveView('signin')}
            className={`px-4 py-3 text-sm uppercase font-semibold transition ${
              activeView === 'signin'
                ? 'bg-[#104179] text-white shadow-lg shadow-[#104179]/20'
                : 'bg-[#104179]/5 text-[#104179] hover:bg-[#104179]/10'
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => setActiveView('signup')}
            className={`px-4 py-3 text-sm uppercase font-semibold transition ${
              activeView === 'signup'
                ? 'bg-[#85c226] text-[#104179] shadow-lg shadow-[#85c226]/20'
                : 'bg-[#104179]/5 text-[#104179] hover:bg-[#85c226]/10'
            }`}
          >
            Sign up
          </button>
        </div>
      </div>

      {activeView === 'signin' ? (
        <SignInForm onSwitchToSignUp={() => setActiveView('signup')} />
      ) : (
        <SignUpForm onSwitchToSignIn={() => setActiveView('signin')} />
      )}
    </main>
  )
}
