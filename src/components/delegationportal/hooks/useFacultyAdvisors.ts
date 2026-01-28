import { useEffect, useState } from 'react'
import { FacultyAdvisor } from '@/app/types/types'
import { apiFetch } from '@/app/utils/apiFetch'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useFacultyAdvisors(user: any | null, delegation: any | null) {
  const [facultyAdvisors, setFacultyAdvisors] = useState<FacultyAdvisor[]>([])
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    if (!user || !delegation?.id) {
      setFacultyAdvisors([])
      setFetching(false)
      return
    }

    const fetchFacultyAdvisors = async () => {
      setFetching(true)
      try {
        const res = await apiFetch('/api/faculty-advisors')
        const data = await res.json()

        if (Array.isArray(data.facultyAdvisors)) {
          setFacultyAdvisors(data.facultyAdvisors)
        }
      } catch (error) {
        console.error('Failed to fetch faculty advisors', error)
      } finally {
        setFetching(false)
      }
    }

    fetchFacultyAdvisors()
  }, [user, delegation?.id])

  return { facultyAdvisors, setFacultyAdvisors, fetching }
}
