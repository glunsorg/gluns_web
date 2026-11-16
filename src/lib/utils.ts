import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_PAYLOAD_URL ||
    process.env.PAYLOAD_URL ||
    'https://www.gluns.org'
  ).replace(/\/$/, '')
}
