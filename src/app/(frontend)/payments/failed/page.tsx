import React from 'react'

export default function page() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Payment Failed</h1>
      <p className="text-lg text-red-700 mb-6">
        Unfortunately, your payment could not be processed. Please try again or contact support if
        the issue persists.
      </p>
      <a
        href="/delegation-portal/payment"
        className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
      >
        Retry Payment
      </a>
    </div>
  )
}
