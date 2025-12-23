import React from 'react'
import PaymentSuccessPage from '@/components/delegationportal/payment/PaymentSuccess'
import { Suspense } from 'react'
import loading from '../../loading'

export default function page() {
  return (
    <Suspense fallback={loading()}>
      <PaymentSuccessPage />
    </Suspense>
  )
}
