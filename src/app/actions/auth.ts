import { redirect } from 'next/navigation'
import { SignUpFormSchema, SignInFormSchema, FormState } from '@/lib/definitions'

export async function signUp(
  _state: FormState | undefined,
  formData: FormData,
): Promise<FormState | never> {
  const validatedFields = SignUpFormSchema.safeParse({
    fullName: formData.get('fullName'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
    roles: formData.getAll('roles').map(String),
    institutionName: String(formData.get('institutionName') ?? '').trim(),
  })

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.issues[0]?.message ?? 'Please check your details.',
    }
  }

  const { fullName, email, password, roles, institutionName } = validatedFields.data

  if (roles.length !== 1 || !['teacher', 'delegate'].includes(roles[0])) {
    return { message: 'Please select a valid signup role.' }
  }

  if (roles[0] === 'teacher' && !institutionName) {
    return { message: 'Institution name is required for teachers.' }
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

  if (!baseUrl) {
    console.error('NEXT_PUBLIC_BASE_URL is not configured.')
    return { message: 'Signup is temporarily unavailable. Please try again later.' }
  }

  try {
    const response = await fetch(`${baseUrl}/api/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName,
        email,
        password,
        roles,
        institutionName,
      }),
      cache: 'no-store',
    })

    const result = await response.json().catch(() => ({}))

    if (!response.ok) {
      return {
        message: result.message ?? 'Signup failed. Please try again.',
      }
    }

    if (result.loginRequired) {
      return {
        message: result.message,
      }
    }
  } catch (error) {
    console.error('Signup request failed:', error)
    return { message: 'Unable to complete signup. Please try again.' }
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
