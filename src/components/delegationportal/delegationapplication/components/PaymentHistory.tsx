'use client'

import { useEffect, useState } from 'react'
import { Download, FileText, Users, X, CalendarDays } from 'lucide-react'

type Delegate = {
  id: string
  fullName: string
  email?: string | null
  delegateState: string
}

type Receipt = {
  id: string
  receiptNumber: string
  amount: number
  currency: string
  paymentMethod: string
  transactionReference?: string | null
  issuedAt: string
  registration: {
    id: string
    registrationNumber: string
    event: {
      id: string
      name?: string | null
      title?: string | null
    } | null
  } | null
  delegates: Delegate[]
  pdfUrl: string | null
}

export default function PaymentHistory() {
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function loadReceipts() {
      try {
        const response = await fetch('/api/receipts', {
          credentials: 'include',
          cache: 'no-store',
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(
            response.status === 401
              ? 'Please sign in to view your payment history.'
              : 'Unable to load payment history.',
          )
        }

        const data = await response.json()
        setReceipts(data.docs ?? [])
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return
        }

        setError(err instanceof Error ? err.message : 'Something went wrong.')
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    void loadReceipts()

    return () => controller.abort()
  }, [])

  // Close the modal with Escape.
  useEffect(() => {
    if (!selectedReceipt) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setSelectedReceipt(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedReceipt])

  function formatAmount(receipt: Receipt) {
    try {
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: receipt.currency,
      }).format(receipt.amount)
    } catch {
      return `${receipt.currency} ${receipt.amount.toFixed(2)}`
    }
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString(undefined, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  function getEventName(receipt: Receipt) {
    return receipt.registration?.event?.title || receipt.registration?.event?.name || 'Event'
  }

  if (loading) {
    return <div className="p-10 text-center text-gray-500">Loading payment history...</div>
  }

  if (error) {
    return (
      <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
        {error}
      </div>
    )
  }

  return (
    <section className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Payment History</h1>
          <p className="mt-2 text-sm text-gray-600 sm:text-base">
            View your transactions, download receipts, and manage your registered delegates.
          </p>
        </div>

        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total issued receipts</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{receipts.length}</p>
        </div>

        {receipts.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white px-6 py-14 text-center">
            <FileText className="mx-auto mb-4 h-10 w-10 text-gray-400" />

            <h2 className="text-lg font-semibold text-gray-900">No payment receipts yet</h2>

            <p className="mt-2 text-sm text-gray-500">
              Issued receipts will appear here after your payments have been processed.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {receipts.map((receipt) => (
              <article
                key={receipt.id}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
              >
                <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-lg font-bold text-gray-900">{receipt.receiptNumber}</h2>

                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                        Issued
                      </span>
                    </div>

                    <p className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                      <CalendarDays className="h-4 w-4 shrink-0" />
                      {formatDate(receipt.issuedAt)}
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <p className="text-2xl font-bold text-gray-900">{formatAmount(receipt)}</p>
                    <p className="mt-1 text-sm text-gray-500">{receipt.paymentMethod}</p>
                  </div>
                </div>

                <div className="space-y-4 p-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Event
                    </p>
                    <p className="mt-1 font-semibold text-gray-900">{getEventName(receipt)}</p>
                    <p className="mt-1 text-sm text-gray-500">
                      Registration: {receipt.registration?.registrationNumber || '—'}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
                    <button
                      type="button"
                      onClick={() => setSelectedReceipt(receipt)}
                      className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-800 transition hover:bg-gray-50"
                    >
                      <Users className="h-4 w-4" />
                      View Delegates ({receipt.delegates.length})
                    </button>

                    {receipt.pdfUrl ? (
                      <a
                        href={`/api/receipts/${encodeURIComponent(receipt.id)}/download`}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#104179] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0d3159]"
                      >
                        <Download className="h-4 w-4" />
                        Download Receipt PDF
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-2 text-sm text-gray-500">
                        <FileText className="h-4 w-4" />
                        PDF not available
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Delegates modal */}
      {selectedReceipt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedReceipt(null)
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delegates-modal-title"
            className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between border-b border-gray-100 p-5">
              <div className="min-w-0 pr-4">
                <h2 id="delegates-modal-title" className="text-xl font-bold text-gray-900">
                  Registered Delegates
                </h2>

                <p className="mt-1 text-sm text-gray-500">{getEventName(selectedReceipt)}</p>

                <p className="mt-1 text-xs text-gray-500">
                  Receipt: {selectedReceipt.receiptNumber}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                aria-label="Close delegates modal"
                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-5">
              <div className="mb-4 flex items-center gap-3 rounded-lg bg-blue-50 p-4">
                <div className="rounded-full bg-blue-100 p-2 text-[#104179]">
                  <Users className="h-5 w-5" />
                </div>

                <div>
                  <p className="font-semibold text-gray-900">
                    {selectedReceipt.delegates.length}{' '}
                    {selectedReceipt.delegates.length === 1 ? 'Delegate' : 'Delegates'}
                  </p>
                  <p className="text-xs text-gray-600">Linked to this registration</p>
                </div>
              </div>

              {selectedReceipt.delegates.length === 0 ? (
                <p className="py-8 text-center text-sm text-gray-500">
                  No delegates were found for this registration.
                </p>
              ) : (
                <div className="space-y-3">
                  {selectedReceipt.delegates.map((delegate, index) => (
                    <div
                      key={delegate.id}
                      className="flex items-start gap-3 rounded-lg border border-gray-200 p-4"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-700">
                        {index + 1}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-900">{delegate.fullName}</p>

                        {delegate.email && (
                          <p className="mt-1 break-all text-sm text-gray-500">{delegate.email}</p>
                        )}

                        <span
                          className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                            delegate.delegateState === 'confirmed'
                              ? 'bg-green-100 text-green-800'
                              : delegate.delegateState === 'cancelled'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {delegate.delegateState}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-gray-100 p-5">
              <div className="flex flex-col gap-3 sm:flex-row">
                {selectedReceipt.pdfUrl && (
                  <a
                    href={`/api/receipts/${encodeURIComponent(selectedReceipt.id)}/download`}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#104179] px-4 py-3 text-sm font-semibold text-white hover:bg-[#0d3159]"
                  >
                    <Download className="h-4 w-4" />
                    Download Receipt
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedReceipt(null)}
                  className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
