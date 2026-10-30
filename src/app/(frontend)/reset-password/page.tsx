'use client'

import { Suspense, useState, type FormEvent, type ReactNode } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

/* Shared page shell: navy background with a static dot grid, white card, green brand stripe */
function Shell({ children }: { children: ReactNode }) {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-[#051220] px-4 py-10 sm:px-6 sm:py-16">
      <div className="w-full max-w-md">
        <div className="overflow-hidden bg-white shadow-2xl shadow-black/40 ring-1 ring-[#85c226]/60">
          <div className="h-1.5 w-full bg-[#85c226]" aria-hidden="true" />
          <div className="px-6 pb-8 pt-8 sm:px-10 sm:pb-10 sm:pt-10">{children}</div>
        </div>
      </div>
    </main>
  )
}

function Icon({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

const inputClasses =
  'w-full rounded-lg border border-gray-300 bg-gray-50 py-3 pl-11 pr-12 text-base text-gray-900 placeholder:text-gray-400 outline-none hover:border-gray-400 focus:border-[#104179] focus:bg-white focus:ring-4 focus:ring-[#104179]/15 sm:text-sm'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPasswords, setShowPasswords] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setMessage('')
    setError('')

    if (!token) {
      setError('Your password reset link is invalid or missing. Please request a new one.')
      return
    }

    if (password.length < 8) {
      setError('Your password must be at least 8 characters long.')
      return
    }

    if (password !== confirmPassword) {
      setError('Your passwords do not match.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/users/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password,
        }),
      })

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(
          data?.errors?.[0]?.message ||
            data?.message ||
            'Unable to reset your password. The link may have expired.',
        )
      }

      setMessage('Your password has been reset successfully. Redirecting to sign in...')

      setPassword('')
      setConfirmPassword('')

      setTimeout(() => {
        router.push('/registration')
      }, 2000)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please request a new reset link.',
      )
    } finally {
      setLoading(false)
    }
  }

  const passwordType = showPasswords ? 'text' : 'password'

  return (
    <Shell>
      {/* Header */}
      <div className="flex flex-col items-center text-center">
        <h1 className="mt-5 text-2xl font-bold uppercase tracking-tight text-[#104179] sm:text-3xl">
          Reset your password
        </h1>

        <p className="mt-2 max-w-sm text-sm leading-relaxed text-gray-600 sm:text-base">
          Enter your new password below. Use at least 8 characters.
        </p>
      </div>

      {/* Feedback */}
      {message && (
        <div
          role="status"
          className="mt-6 flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-3.5 text-sm text-green-800"
        >
          <Icon className="mt-0.5 h-5 w-5 shrink-0 text-green-600">
            <circle cx="12" cy="12" r="9" />
            <path d="m8.5 12.5 2.5 2.5 4.5-5" />
          </Icon>
          <p>{message}</p>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="mt-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3.5 text-sm text-red-800"
        >
          <Icon className="mt-0.5 h-5 w-5 shrink-0 text-red-600">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v4.5" />
            <path d="M12 16h.01" />
          </Icon>
          <p>{error}</p>
        </div>
      )}

      {/* Body */}
      {!token ? (
        <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-5 text-center">
          <p className="text-sm leading-relaxed text-gray-600">
            The reset token is missing. Please request a new password reset link.
          </p>

          <Link
            href="/forgot-password"
            className="mt-4 inline-block w-full rounded-lg bg-[#104179] px-4 py-3 text-base font-semibold text-white shadow-sm hover:bg-[#85c226] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#85c226]/50 sm:text-sm"
          >
            Request a new reset link
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-gray-800">
              New password
            </label>

            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                <Icon className="h-5 w-5">
                  <rect x="4" y="10.5" width="16" height="10" rx="2" />
                  <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
                </Icon>
              </span>

              <input
                id="password"
                name="password"
                type={passwordType}
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 8 characters"
                className={inputClasses}
              />

              <button
                type="button"
                onClick={() => setShowPasswords((value) => !value)}
                aria-label={showPasswords ? 'Hide passwords' : 'Show passwords'}
                aria-pressed={showPasswords}
                className="absolute inset-y-0 right-0 flex cursor-pointer items-center rounded-r-lg px-3.5 text-gray-400 hover:text-[#104179] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#104179]/20"
              >
                {showPasswords ? (
                  <Icon className="h-5 w-5">
                    <path d="M3 3l18 18" />
                    <path d="M10.6 6.1A9.8 9.8 0 0 1 12 6c5 0 8.5 4.2 9.5 6-.5.9-1.5 2.3-3 3.6" />
                    <path d="M6.6 7.7C4.5 9.1 3.1 11 2.5 12c1 1.8 4.5 6 9.5 6 1.5 0 2.8-.4 4-.9" />
                    <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
                  </Icon>
                ) : (
                  <Icon className="h-5 w-5">
                    <path d="M2.5 12C3.5 10.2 7 6 12 6s8.5 4.2 9.5 6c-1 1.8-4.5 6-9.5 6s-8.5-4.2-9.5-6Z" />
                    <circle cx="12" cy="12" r="3" />
                  </Icon>
                )}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1.5 block text-sm font-semibold text-gray-800"
            >
              Confirm new password
            </label>

            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                <Icon className="h-5 w-5">
                  <rect x="4" y="10.5" width="16" height="10" rx="2" />
                  <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
                  <path d="m9.5 15.5 1.8 1.8 3.2-3.6" />
                </Icon>
              </span>

              <input
                id="confirmPassword"
                name="confirmPassword"
                type={passwordType}
                autoComplete="new-password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Re-enter your password"
                className={inputClasses}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer bg-[#104179] px-4 py-3 text-base font-semibold text-white shadow-sm hover:bg-[#85c226] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#85c226]/50 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-[#104179] sm:text-sm"
          >
            {loading ? 'Resetting password...' : 'Reset password'}
          </button>
        </form>
      )}

      {/* Footer */}
      <div className="mt-8 border-t border-gray-200 pt-6 text-center">
        <Link
          href="/registration"
          className="inline-flex items-center gap-1.5 rounded text-sm font-semibold text-[#104179] hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#104179]/20"
        >
          <Icon className="h-4 w-4">
            <path d="m15 6-6 6 6 6" />
          </Icon>
          Back to sign in
        </Link>
      </div>
    </Shell>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#051220] px-4">
          <p className="text-sm text-gray-300">Loading...</p>
        </main>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  )
}
