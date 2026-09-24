// src/types/modelun.ts

export type UserRole = 'admin' | 'teacher' | 'delegate'

export type RegistrationType = 'individual' | 'institution'

export type RegistrationState = 'draft' | 'active' | 'completed' | 'cancelled'

export type BatchState = 'draft' | 'pending_payment' | 'partially_paid' | 'paid' | 'cancelled'

export type InvoiceState =
  | 'draft'
  | 'issued'
  | 'partially_paid'
  | 'paid'
  | 'overdue'
  | 'cancelled'
  | 'void'

export type PaymentState = 'pending' | 'successful' | 'failed' | 'cancelled' | 'refunded'

export type ReceiptState = 'issued' | 'void'
