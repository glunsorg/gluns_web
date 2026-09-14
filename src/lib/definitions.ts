import * as z from 'zod'

export const SignUpFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  confirmPassword: z.string().min(8, 'Confirm Password must be at least 8 characters long'),
  roles: z.array(z.enum(['teacher', 'delegate'])).nonempty('Please select at least one role'),
})

export type SignUpFormData = z.infer<typeof SignUpFormSchema>

export const SignInFormSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
})

export type SignInFormData = z.infer<typeof SignInFormSchema>

export type FormState =
  | {
      errors?: {
        name?: string[]
        email?: string[]
        password?: string[]
        confirmPassword?: string[]
        roles?: string[]
      }
      message?: string
    }
  | undefined
