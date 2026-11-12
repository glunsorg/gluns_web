'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { SignUpFormSchema, SignInFormSchema, FormState } from '@/lib/definitions'

async function setSessionCookie(response: Response) {
  const setCookieHeader = response.headers.get('set-cookie')

  if (!setCookieHeader) {
    return
  }

  const [cookiePair] = setCookieHeader.split(';')
  const separatorIndex = cookiePair.indexOf('=')

  if (separatorIndex === -1) {
    return
  }

  const name = cookiePair.slice(0, separatorIndex).trim()
  const value = cookiePair.slice(separatorIndex + 1).trim()

  if (!name) {
    return
  }

  const cookieStore = await cookies()
  cookieStore.set(name, value, {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })
}

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

  const baseUrl = process.env.PAYLOAD_URL

  if (!baseUrl) {
    console.error('PAYLOAD_URL is not configured.')
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

    await setSessionCookie(response)
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
  const baseUrl = process.env.PAYLOAD_URL || process.env.NEXT_PUBLIC_PAYLOAD_URL

  if (!baseUrl) {
    console.error('PAYLOAD_URL or NEXT_PUBLIC_PAYLOAD_URL is not configured.')
    return { message: 'Login is temporarily unavailable. Please try again later.' }
  }

  try {
    const response = await fetch(`${baseUrl}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      cache: 'no-store',
    })

    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      return {
        message: data.message || 'Login failed',
      }
    }

    await setSessionCookie(response)
  } catch (error) {
    console.error('Login request failed:', error)
    return { message: 'Unable to complete login. Please try again.' }
  }

  redirect('/delegation-portal')
}
