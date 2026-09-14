'use client'

import React from 'react'
import { useActionState } from 'react'
import { signIn } from '@/app/actions/auth'

type SignInFormProps = {
  onSwitchToSignUp: () => void
}

function Field({
  name,
  label,
  type,
  placeholder,
  autoComplete,
}: {
  name: string
  label: string
  type: string
  placeholder: string
  autoComplete?: string
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-[#104179]">{label}</label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full border border-[#104179]/15 bg-white px-4 py-3.5 text-[#104179] placeholder:text-[#104179]/35 shadow-sm outline-none transition duration-300 focus:border-[#85c226] focus:ring-4 focus:ring-[#85c226]/15"
      />
    </div>
  )
}

export default function SignInForm({ onSwitchToSignUp }: SignInFormProps) {
  const [state, action] = useActionState(signIn, undefined)
  return (
    <section id="signin" className="relative overflow-hidden px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="relative overflow-hidden border border-white/70 bg-[#104179] px-6 py-8 text-white sm:px-8 sm:py-10">
          <div className="relative space-y-6">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/70">
                Welcome back
              </p>
              <h1 className="max-w-xl text-4xl font-bold leading-tight text-white sm:text-5xl">
                Sign in to continue your GLUNS journey.
              </h1>
              <p className="max-w-xl text-base leading-7 text-white/78 sm:text-lg">
                Return to your delegation tools, registration details, and event updates in a calm
                interface built with the project&apos;s core blue and green palette.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {['Fast access', 'Secure portal', 'Conference updates'].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-sm font-medium text-white/90 backdrop-blur"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative border border-[#104179]/70 bg-white p-5 sm:p-8">
          <div className="mb-8 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#85c226]">
                Sign in
              </p>
              <h2 className="mt-2 text-3xl font-bold text-[#104179]">Access your account</h2>
            </div>

            <button
              type="button"
              onClick={onSwitchToSignUp}
              className="inline-flex items-center border border-[#104179]/15 bg-[#104179]/5 px-4 py-2 text-sm font-semibold text-[#104179] transition hover:border-[#85c226] hover:bg-[#85c226]/10"
            >
              Switch to sign up
            </button>
          </div>

          <div className="mb-6 grid grid-cols-2 bg-[#104179]/5 p-1.5 text-sm font-semibold text-[#104179]">
            <div className="bg-white px-4 py-3 text-center shadow-sm">Sign in</div>
            <button
              type="button"
              onClick={onSwitchToSignUp}
              className="px-4 py-3 text-center text-[#104179]/60 transition hover:text-[#104179]"
            >
              Sign up
            </button>
          </div>

          <form className="space-y-5" action={action}>
            <Field
              name="email"
              label="Email address"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
            />
            {state?.errors?.email && (
              <div>
                <p>Email must:</p>
                <ul>
                  {state.errors.email.map((error) => (
                    <li key={error}>- {error}</li>
                  ))}
                </ul>
              </div>
            )}

            <Field
              name="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
            />
            {state?.errors?.password && (
              <div>
                <p>Password must:</p>
                <ul>
                  {state.errors.password.map((error) => (
                    <li key={error}>- {error}</li>
                  ))}
                </ul>
              </div>
            )}

            {state?.message && (
              <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {state.message}
              </p>
            )}

            <div className="flex items-center justify-between gap-4 text-sm">
              <a href="#" className="font-semibold text-[#104179] transition hover:text-[#85c226]">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-2xl bg-[#104179] px-5 py-3.5 text-base font-semibold text-white shadow-lg shadow-[#104179]/20 transition duration-300 hover:-translate-y-0.5 hover:bg-[#0a2f58]"
            >
              Sign in
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#104179]/70">
            Don&apos;t have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToSignUp}
              className="font-semibold text-[#104179] hover:text-[#85c226]"
            >
              Create one here
            </button>
          </p>
        </div>
      </div>
    </section>
  )
}
