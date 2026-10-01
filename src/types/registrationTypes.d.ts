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
  institution: string
  delegateState: string
}

export interface Registration {
  id: string
  registrationNumber: string
  event: string
  registrationType: 'individual' | 'institution'
  registeredBy: string
  institution?: string
  registrationState: 'draft' | 'submitted' | 'approved' | 'rejected'
}

export interface EventOption {
  id: number | string
  title: string
  subtitle?: string
  location?: string
  date?: string
  cost?: number | string | null
  currency?: string
}
