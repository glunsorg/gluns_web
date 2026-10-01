// profile section
import { useInstitutions } from '../../hooks/useInstitutions'
import { useAuthGate } from '../../hooks/useAuthGate'
import { useUserProfile } from '../../hooks/userProfile'
import { useState } from 'react'

export default function ProfileSection() {
  const { user } = useAuthGate()
  const { userProfile, refetchUserProfile, loadingUserProfile } = useUserProfile(user?.id)
  const { institutions } = useInstitutions()
  const [editing, setEditing] = useState(false)
  const [institutionId, setInstitutionId] = useState<string | undefined>(
    String(userProfile?.institution?.id || '') || undefined,
  )

  if (loadingUserProfile) return <p>Loading...</p>

  const handleSaveInstitution = async () => {
    try {
      await fetch(`/api/profile/${userProfile?.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ institution: institutionId || null }),
      })
      await refetchUserProfile()
      setEditing(false)
    } catch (err) {
      console.error('Failed to update institution', err)
      alert('Failed to update institution')
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-3xl border border-white/10 bg-[#07131f]/90 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.22)] backdrop-blur">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-white/40">Profile</p>
              <h2 className="mt-2 text-3xl font-semibold">Your profile details</h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70">
                Update your profile information to ensure accurate registration and communication.
              </p>
            </div>
            <div>
              <button
                type="button"
                onClick={() => setEditing((s) => !s)}
                className="rounded-md bg-white/5 px-3 py-2 text-sm text-white/80"
              >
                {editing ? 'Cancel' : 'Edit'}
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-white/70">Full Name</p>
              <p className="text-sm text-white">
                {userProfile?.user?.fullName || userProfile?.user?.email || 'N/A'}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-white/70">Email</p>
              <p className="text-sm text-white">{userProfile?.user?.email || 'N/A'}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-white/70">Phone Number</p>
              <p className="text-sm text-white">{userProfile?.phoneNumber || 'N/A'}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-white/70">Country</p>
              <p className="text-sm text-white">{userProfile?.country || 'N/A'}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-white/70">Institution</p>
              {!editing ? (
                <p className="text-sm text-white">{userProfile?.institution?.name || 'N/A'}</p>
              ) : (
                <select
                  value={institutionId || ''}
                  onChange={(e) => setInstitutionId(e.target.value)}
                  className="w-full rounded-2xl border text-black border-[#104179]/15 px-4 py-3 transition focus:border-[#85c226] focus:ring-2 focus:ring-[#85c226]/20"
                >
                  <option value="">Select institution</option>
                  {institutions.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-white/70">Position</p>
              <p className="text-sm text-white">{userProfile?.position || 'N/A'}</p>
            </div>
          </div>

          {editing && (
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveInstitution}
                className="rounded-2xl bg-[#85c226] px-4 py-2 text-sm font-semibold text-white"
              >
                Save institution
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
