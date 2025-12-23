'use client'

import React, { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { useAuthStore } from '@/app/store/authStore'

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useAuthStore()

  const reference = searchParams.get('reference')

  useEffect(() => {
    // Redirect after 6 seconds
    const timer = setTimeout(() => {
      router.push('/delegation-portal')
      setTimeout(() => window.location.reload(), 500)
    }, 6000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 py-12 space-y-6">
      {/* Prominent redirect message */}
      <div className="text-center text-xl md:text-2xl font-semibold text-gray-700">
        You will be redirected to your delegation portal shortly...
      </div>

      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="w-16 h-16 text-[#2b0909]" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order has been confirmed.
        </p>

        <div className="bg-gray-50 rounded-md p-4 mb-6">
          <h2 className="text-lg font-medium text-gray-800 mb-2">Order Summary</h2>
          <div className="flex justify-between text-gray-600 mb-1">
            <span>Order Reference:</span>
            <span className="font-medium">{reference}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>A confirmation email has been sent to:</span>
          </div>
          <div className="text-gray-800 font-medium mt-1">{user?.email || 'your email'}</div>
        </div>

        <div className="space-y-3">
          <Link
            href="/my_account/orders"
            className="block w-full py-2 px-4 bg-[#104179] hover:bg-[#082648] text-white font-medium rounded-md transition duration-200"
          >
            View Order Details
          </Link>
        </div>
      </div>
    </div>
  )
}
