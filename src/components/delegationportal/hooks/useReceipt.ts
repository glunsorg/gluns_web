/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { apiFetch } from '@/app/utils/apiFetch'

export function useReceipt(user: any | null, delegation: any | null) {
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null)
  const [delegates, setDelegates] = useState<any[]>([])
  const [fetching, setFetching] = useState(true)
  const [receiptData, setReceiptData] = useState<any | null>(null)

  useEffect(() => {
    if (!user || !delegation?.id) {
      setPaymentStatus(null)
      setDelegates([])
      setFetching(false)
      return
    }

    const fetchData = async () => {
      setFetching(true)
    }

    fetchData()
  }, [user, delegation?.id])

  return { paymentStatus, delegates, setDelegates, fetching, setPaymentStatus }
}
