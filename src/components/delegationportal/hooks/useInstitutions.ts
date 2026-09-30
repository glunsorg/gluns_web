import { useState, useEffect } from 'react'
import { apiFetch } from '@/app/utils/apiFetch'

export interface InstitutionOption {
  id: string
  name: string
}

export function useInstitutions() {
  const [institutions, setInstitutions] = useState<InstitutionOption[]>([])
  const [selectedInstitutionId, setSelectedInstitutionId] = useState<string>('')
  const [institutionsLoading, setInstitutionsLoading] = useState(true)

  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        const res = await apiFetch('/api/local-institutions', { cache: 'no-store' })
        if (!res.ok) throw new Error('Failed to fetch institutions')

        const data = await res.json()
        const institutionOptions = (data.institutions || []).map((school: any) => ({
          id: school.id,
          name: school.name,
        }))

        setInstitutions(institutionOptions)
        if (institutionOptions.length > 0) {
          setSelectedInstitutionId(String(institutionOptions[0].id))
        }
      } catch (error) {
        console.error('Failed to fetch institutions:', error)
      } finally {
        setInstitutionsLoading(false)
      }
    }

    fetchInstitutions()
  }, []) // Run once on mount

  return { institutions, selectedInstitutionId, setSelectedInstitutionId, institutionsLoading }
}
