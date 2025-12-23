'use client'

import React, { useEffect, useState } from 'react'

interface PaymentFormProps {
  numberOfDelegates: number
  teacherId: number | string
  delegationId?: number | string
  onPaymentSuccess: (totalPaidSlots: number) => void
}

export default function PaymentForm({
  numberOfDelegates,
  teacherId,
  delegationId,
  onPaymentSuccess,
}: PaymentFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalPaidSlots, setTotalPaidSlots] = useState(0)

  const remainingSlots = Math.max(numberOfDelegates - totalPaidSlots, 0)

  useEffect(() => {
    const fetchPaidSlots = async () => {
      try {
        const res = await fetch('/api/payments', {
          credentials: 'include',
        })
        if (!res.ok) throw new Error('Failed to fetch payments')
        const data = await res.json()
        const total = data.totalPaidSlots || 0
        setTotalPaidSlots(total)
        onPaymentSuccess(total)
      } catch (err) {
        console.error(err)
      }
    }
    fetchPaidSlots()
  }, [onPaymentSuccess])

  const handlePayment = async () => {
    if (!delegationId || remainingSlots <= 0) return

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/paystack/initiate', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          delegateSlotsPurchased: remainingSlots,
          teacherId,
          delegationId,
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.authorization_url) {
        throw new Error(data.message || 'Failed to initialize payment')
      }

      window.location.href = data.authorization_url
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Payment initialization failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md space-y-3">
      <p>
        Paid slots: <strong>{totalPaidSlots}</strong> / {numberOfDelegates}
      </p>

      {remainingSlots === 0 && (
        <p className="text-green-600 font-medium">All delegate slots have been paid for.</p>
      )}

      {error && <p className="text-red-600">{error}</p>}

      <button
        onClick={handlePayment}
        disabled={loading || remainingSlots === 0}
        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
      >
        {loading ? 'Processing...' : `Pay for ${remainingSlots} remaining slot(s)`}
      </button>
    </div>
  )
}
