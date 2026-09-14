import { redirect } from 'next/navigation'
import { SignUpFormSchema, SignInFormSchema, FormState } from '@/lib/definitions'

export async function signUp(state: FormState, formData: FormData) {
  const validatedFields = SignUpFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
    roles: formData.getAll('roles') as string[],
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { name, email, password, confirmPassword, roles } = validatedFields.data

  if (password !== confirmPassword) {
    return {
      errors: {
        confirmPassword: ['Passwords do not match'],
      },
    }
  }

  //   use the signup API route to create a new user and log them in
  const response = await fetch('/api/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, roles }),
  })

  if (!response.ok) {
    const data = await response.json()
    return {
      message: data.message || 'Signup failed',
    }
  }

  redirect('/delegation-portal')
}

export async function signIn(state: FormState, formData: FormData) {
  const validatedFields = SignInFormSchema.pick({ email: true, password: true }).safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { email, password } = validatedFields.data

  const response = await fetch('/api/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    const data = await response.json()
    return {
      message: data.message || 'Login failed',
    }
  }

  redirect('/delegation-portal')
}
