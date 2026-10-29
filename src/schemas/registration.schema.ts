import { z } from 'zod'

export const SchoolRegistrationSchema = z.object({
  registrationType: z.literal('school'),
  contactPerson: z.string(),
  email: z.email(),
  phoneNumber: z.string(),
  numOfStudents: z.number(),
  eventId: z.string().min(1, 'Please select an event'),
})

export const IndividualRegistrationSchema = z.object({
  registrationType: z.literal('individual'),

  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.email(),
  phoneNumber: z.string(),
  grade: z.number(),
  eventId: z.string().min(1, 'Please select an event'),
})

export const RegistrationSchema = z.discriminatedUnion('registrationType', [
  SchoolRegistrationSchema,
  IndividualRegistrationSchema,
])

export type RegistrationFormData = z.infer<typeof RegistrationSchema>
