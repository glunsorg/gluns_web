'use client'

import * as React from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Loading from '@/app/(frontend)/loading'
import { Lock, Mail, User, Shield, CheckCircle2, AlertCircle } from 'lucide-react'

export function AccountSettings() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = React.useState<any>(null)
  const [loadingUser, setLoadingUser] = React.useState(true)

  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')

  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState<string | null>(null)
  const [saving, setSaving] = React.useState(false)

  const [confirmOpen, setConfirmOpen] = React.useState(false)

  React.useEffect(() => {
    fetch('/api/users/me', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoadingUser(false))
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!user?.id) {
      setError('Not authenticated.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setConfirmOpen(true)
  }

  async function handleConfirmChange() {
    setConfirmOpen(false)
    setSaving(true)

    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password,
          passwordConfirm: confirmPassword,
        }),
      })

      if (!res.ok) {
        const json = await res.json()
        throw new Error(json?.errors?.[0]?.message || 'Update failed')
      }

      setSuccess('Password updated successfully.')
      setPassword('')
      setConfirmPassword('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  if (loadingUser) return <Loading />
  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-[#104179]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-10 h-10 text-[#104179]" />
          </div>
          <p className="text-[#104179] text-xl font-semibold">You must be logged in.</p>
        </div>
      </div>
    )

  return (
    <>
      <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Profile Information Card */}
            <div className="bg-white border-2 border-[#104179]/20 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="bg-[#104179] px-6 py-4 border-b-4 border-[#85c226]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#85c226] rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Profile Information</h2>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Email Display */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-[#104179]">
                    <Mail className="w-4 h-4 text-[#85c226]" />
                    Email Address
                  </label>
                  <div className="relative">
                    <Input
                      disabled
                      value={user.email}
                      className="bg-[#104179]/5 border-2 border-[#104179]/20 text-[#104179] font-medium h-12 pl-4 rounded-xl cursor-not-allowed"
                    />
                  </div>
                  <p className="text-xs text-[#104179]/60">Your email address cannot be changed</p>
                </div>

                {/* User Name if available */}
                {user.name && (
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-[#104179]">
                      <User className="w-4 h-4 text-[#85c226]" />
                      Full Name
                    </label>
                    <div className="relative">
                      <Input
                        disabled
                        value={user.name}
                        className="bg-[#104179]/5 border-2 border-[#104179]/20 text-[#104179] font-medium h-12 pl-4 rounded-xl cursor-not-allowed"
                      />
                    </div>
                  </div>
                )}

                {/* Account Status */}
                <div className="bg-[#85c226]/10 border-2 border-[#85c226]/30 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#85c226]" />
                    <div>
                      <p className="font-semibold text-[#104179] text-sm">Account Active</p>
                      <p className="text-xs text-[#104179]/70">Your account is in good standing</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Change Password Card */}
            <div className="bg-white border-2 border-[#104179]/20 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="bg-[#104179] px-6 py-4 border-b-4 border-[#85c226]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#85c226] rounded-lg flex items-center justify-center">
                    <Lock className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Change Password</h2>
                </div>
              </div>

              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Error Alert */}
                  {error && (
                    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-red-900 text-sm">Error</p>
                          <p className="text-sm text-red-700">{error}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Success Alert */}
                  {success && (
                    <div className="bg-[#85c226]/10 border-2 border-[#85c226]/30 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#85c226] shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-[#104179] text-sm">Success</p>
                          <p className="text-sm text-[#104179]/80">{success}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* New Password */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-[#104179]">
                      <Lock className="w-4 h-4 text-[#85c226]" />
                      New Password
                    </label>
                    <Input
                      type="password"
                      placeholder="Enter a new GLUNS account password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="border-2 border-[#104179]/20 focus:border-[#85c226] h-12 rounded-xl text-[#104179] placeholder:text-[#104179]/40"
                    />
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-[#104179]">
                      <Lock className="w-4 h-4 text-[#85c226]" />
                      Confirm New Password
                    </label>
                    <Input
                      type="password"
                      placeholder="Confirm the new GLUNS account password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="border-2 border-[#104179]/20 focus:border-[#85c226] h-12 rounded-xl text-[#104179] placeholder:text-[#104179]/40"
                    />
                  </div>

                  {/* Password Requirements */}
                  <div className="bg-[#104179]/5 rounded-xl p-4 space-y-2">
                    <p className="text-xs font-semibold text-[#104179] mb-2">
                      Password Requirements:
                    </p>
                    <ul className="space-y-1 text-xs text-[#104179]/70">
                      <li className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-[#85c226] rounded-full"></div>
                        At least 8 characters long
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-[#85c226] rounded-full"></div>
                        Include uppercase and lowercase letters
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-[#85c226] rounded-full"></div>
                        Include at least one number
                      </li>
                    </ul>
                  </div>

                  {/* Submit Button */}
                  <Button
                    disabled={saving}
                    type="submit"
                    className="w-full h-12 bg-[#85c226] hover:bg-[#104179] text-white font-bold text-base rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    {saving ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Saving...
                      </span>
                    ) : (
                      'Change Password'
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>

          {/* Security Tips */}
          <div className="mt-8 bg-[#104179]/5 border-2 border-[#104179]/20 rounded-2xl p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#85c226] rounded-xl flex items-center justify-center shrink-0">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#104179] mb-2">Security Tips</h3>
                <ul className="space-y-2 text-sm text-[#104179]/70">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#85c226] shrink-0 mt-0.5" />
                    Use a strong, unique password for your account
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#85c226] shrink-0 mt-0.5" />
                    Never share your password with anyone
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#85c226] shrink-0 mt-0.5" />
                    Change your password regularly to maintain security
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="rounded-2xl border-2 border-[#104179]/20">
          <AlertDialogHeader>
            <div className="w-14 h-14 bg-[#85c226]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-7 h-7 text-[#85c226]" />
            </div>
            <AlertDialogTitle className="text-2xl text-[#104179] text-center">
              Confirm Password Change
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[#104179]/70 text-center text-base">
              Are you sure you want to change your password? This will immediately update your
              credentials and may log you out of other sessions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-3">
            <AlertDialogCancel
              disabled={saving}
              className="w-full sm:w-auto border-2 border-[#104179]/20 text-[#104179] hover:bg-[#104179]/5 rounded-xl h-11"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmChange}
              disabled={saving}
              className="w-full sm:w-auto bg-[#85c226] hover:bg-[#104179] text-white rounded-xl h-11"
            >
              {saving ? 'Processing...' : 'Yes, Change Password'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
