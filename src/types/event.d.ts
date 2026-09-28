/* eslint-disable @typescript-eslint/no-explicit-any */
interface Event {
  id: number
  title: string
  slug: string
  subtitle?: string | null
  description?: any
  venue: string
  startDate: string
  endDate: string
  cost?: number | null
  currency?: string | null
  eventType?: string | null
  registrationOpenDate?: string | null
  registrationCloseDate?: string | null
  allowInstitutionksRegistration?: boolean | null
}

export type { Event }
