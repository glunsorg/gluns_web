'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setLoading(true)
    setMessage('')
    setError('')

    try {
      const response = await fetch('/api/users/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
        }),
      })

      if (!response.ok) {
        throw new Error('Unable to process your request. Please try again.')
      }

      setMessage(
        'If an account exists for that email address, a password reset link has been sent. Please check your inbox.',
      )

      setEmail('')
    } catch {
      setError('Something went wrong. Please try again in a moment.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-[#051220] px-4 py-10 sm:px-6 sm:py-16">
      <div className="w-full max-w-md">
        <div className="overflow-hidden bg-white shadow-2xl shadow-black/40 ring-1 ring-[#85c226]/60">
          <div className="h-1.5 w-full bg-[#85c226]" aria-hidden="true" />

          <div className="px-6 pb-8 pt-8 sm:px-10 sm:pb-10 sm:pt-10">
            {/* Header */}
            <div className="flex flex-col items-center text-center">
              <h1 className="mt-5 text-2xl font-bold tracking-tight text-[#104179] sm:text-3xl uppercase">
                Forgot password?
              </h1>

              <p className="mt-2 max-w-sm text-sm leading-relaxed text-gray-600 sm:text-base">
                Enter the email address linked to your account and we will send you a link to reset
                your password.
              </p>
            </div>

            {/* Feedback */}
            {message && (
              <div
                role="status"
                className="mt-6 flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-3.5 text-sm text-green-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mt-0.5 h-5 w-5 shrink-0 text-green-600"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="m8.5 12.5 2.5 2.5 4.5-5" />
                </svg>
                <p>{message}</p>
              </div>
            )}

            {error && (
              <div
                role="alert"
                className="mt-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3.5 text-sm text-red-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mt-0.5 h-5 w-5 shrink-0 text-red-600"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 8v4.5" />
                  <path d="M12 16h.01" />
                </svg>
                <p>{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-gray-800">
                  Email address
                </label>

                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                      aria-hidden="true"
                    >
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path d="m3.5 7 8.5 6 8.5-6" />
                    </svg>
                  </span>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 py-3 pl-11 pr-4 text-base text-gray-900 placeholder:text-gray-400 outline-none hover:border-gray-400 focus:border-[#104179] focus:bg-white focus:ring-4 focus:ring-[#104179]/15 sm:text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full cursor-pointer bg-[#104179] px-4 py-3 text-base font-semibold text-white shadow-sm hover:bg-[#85c226] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#85c226]/50 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-[#104179] sm:text-sm"
              >
                {loading ? 'Sending reset link...' : 'Send reset link'}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 border-t border-gray-200 pt-6 text-center">
              <Link
                href="/signin"
                className="inline-flex items-center gap-1.5 rounded text-sm font-semibold text-[#104179] hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#104179]/20"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path d="m15 6-6 6 6 6" />
                </svg>
                Back to sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
