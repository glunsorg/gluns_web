import { Registration } from '@/types/registrationTypes'

export const EMPTY_REGISTRATION: Registration = {
  id: '',
  registrationNumber: '',
  event: '',
  registrationType: 'individual',
  registeredBy: '',
  institution: undefined,
  registrationState: 'draft',
}

export type DelegationSection =
  | 'dashboard'
  | 'register'
  | 'delegations'
  | 'assignments'
  | 'profile'
  | 'account'
