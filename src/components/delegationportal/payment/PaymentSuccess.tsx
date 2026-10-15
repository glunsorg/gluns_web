'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Download, FileText } from 'lucide-react'
import { useAuthStore } from '@/app/store/authStore'

type ReceiptResponse = {
  receiptNumber: string
  pdfUrl: string
}

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const { user } = useAuthStore()

  const reference = searchParams.get('reference') || searchParams.get('trxref')

  const [receipt, setReceipt] = useState<ReceiptResponse | null>(null)
  const [receiptMessage, setReceiptMessage] = useState('Preparing your receipt...')

  useEffect(() => {
    if (!reference) {
      setReceiptMessage('No payment reference was provided.')
      return
    }

    let cancelled = false
    let attempts = 0
    let timer: ReturnType<typeof setTimeout>

    async function loadReceipt() {
      try {
        const response = await fetch(
          `/api/receipts/by-reference?reference=${encodeURIComponent(reference!)}`,
          { cache: 'no-store' },
        )

        const result = await response.json()

        if (cancelled) return

        if (response.ok && result.pdfUrl) {
          setReceipt({
            receiptNumber: result.receiptNumber,
            pdfUrl: result.pdfUrl,
          })
          setReceiptMessage('')
          return
        }

        attempts += 1

        if (attempts < 6) {
          timer = setTimeout(loadReceipt, 2000)
        } else {
          setReceiptMessage(
            'Your payment was successful, but the receipt PDF is not available yet. Please check again shortly.',
          )
        }
      } catch {
        if (cancelled) return

        attempts += 1

        if (attempts < 6) {
          timer = setTimeout(loadReceipt, 2000)
        } else {
          setReceiptMessage('Unable to retrieve your receipt right now.')
        }
      }
    }

    void loadReceipt()

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [reference])

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex flex-col justify-center items-center px-4 py-12 space-y-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="w-16 h-16 text-green-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>

        <p className="text-gray-600 mb-6">
          Thank you for your payment. Your transaction has been confirmed.
        </p>

        <div className="bg-gray-50 rounded-md p-4 mb-6 text-left">
          <h2 className="text-lg font-medium text-gray-800 mb-3">Payment Summary</h2>

          <div className="flex justify-between gap-3 text-gray-600 mb-2">
            <span>Payment Reference:</span>
            <span className="font-medium break-all text-right">{reference || 'Unavailable'}</span>
          </div>

          <div className="text-gray-600">Confirmation email:</div>

          <div className="text-gray-800 font-medium mt-1 wrap-break-words">
            {user?.email || 'Your registered email'}
          </div>
        </div>

        <div className="space-y-3">
          {receipt ? (
            <a
              href={receipt.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-[#104179] hover:bg-[#0d3159] text-white font-medium rounded-md transition"
            >
              <Download className="w-5 h-5" />
              Download Receipt PDF
            </a>
          ) : (
            <div className="text-sm text-gray-600 flex items-center justify-center gap-2">
              <FileText className="w-4 h-4" />
              {receiptMessage}
            </div>
          )}

          {receipt && (
            <p className="text-sm text-gray-600">Receipt number: {receipt.receiptNumber}</p>
          )}

          <Link
            href="/delegation-portal"
            className="block w-full py-3 px-4 bg-[#104179] hover:bg-[#0d3159] text-white font-medium rounded-md transition"
          >
            Continue to Delegation Portal
          </Link>
        </div>
      </div>
    </div>
  )
}
