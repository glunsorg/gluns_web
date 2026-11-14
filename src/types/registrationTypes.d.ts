export interface InvoiceData {
  invoiceNo: string
  date: string
  registrantName: string
  email: string
  phone: string
  eventName: string
  eventDetail: string
  lineItems: { desc: string; qty: number; unit: number; total: number }[]
  totalAmt: number
  priceKnown: boolean
  currency: string // add this
}

export interface DelegateData {
  id: string
  fullName: string
  email: string
  phoneNumber: string
  gender: string
  gradeLevel: string
  registration: string
  batch: string
  institution?: string | number | { id?: string | number; name?: string }
  institutionName?: string
  organ?: string | number | { id?: string | number; name?: string }
  committee?: string | number | { id?: string | number; name?: string }
  delegateState: string
}

export interface Registration {
  id: string
  registrationNumber: string
  event: string
  registrationType: 'individual' | 'institution'
  registeredBy: string
  registrationState: 'draft' | 'submitted' | 'approved' | 'rejected'
}

export interface EventOption {
  id: number | string
  title: string
  subtitle?: string
  venue?: string
  date?: string
  cost?: number | string | null
  currency?: string
  registrationState?: 'draft' | 'open' | 'closed'
  registrationOpen?: string
  registrationClose?: string
  allowIndividualRegistration?: boolean
  allowInstitutionRegistration?: boolean
}
