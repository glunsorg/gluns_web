import { useAuthStore } from '@/app/store/authStore'

export async function apiFetch(input: RequestInfo, init?: RequestInit) {
  const res = await fetch(input, init)

  if (res.status === 401) {
    try {
      // Optional: clear auth store if needed
      const authStore = useAuthStore.getState()
      authStore.setUser(null)
    } catch (err) {
      console.error('Failed to clear auth store', err)
    }

    // Redirect to signup/login page
    if (typeof window !== 'undefined') {
      window.location.href = '/authentication'
    }

    throw new Error('Unauthorized')
  }

  return res
}
