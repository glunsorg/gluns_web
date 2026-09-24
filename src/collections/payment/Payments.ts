// src/collections/Payments.ts

import type { CollectionConfig } from 'payload'

export const Payments: CollectionConfig = {
  slug: 'payments',

  admin: {
    useAsTitle: 'paymentNumber',
    defaultColumns: ['paymentNumber', 'invoice', 'amount', 'paymentState', 'provider'],
  },

  fields: [
    {
      name: 'paymentNumber',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        readOnly: true,
      },
    },

    {
      name: 'registration',
      type: 'relationship',
      relationTo: 'registrations',
      required: true,
    },

    {
      name: 'invoice',
      type: 'relationship',
      relationTo: 'invoices',
      required: true,
    },

    {
      name: 'amount',
      type: 'number',
      required: true,
      min: 0,
    },

    {
      name: 'currency',
      type: 'text',
      required: true,
    },

    {
      name: 'provider',
      type: 'select',
      required: true,
      options: [
        { label: 'M-Pesa', value: 'mpesa' },
        { label: 'Stripe', value: 'stripe' },
        { label: 'Flutterwave', value: 'flutterwave' },
        { label: 'Bank Transfer', value: 'bank_transfer' },
        { label: 'Cash', value: 'cash' },
        { label: 'Other', value: 'other' },
      ],
    },

    {
      name: 'transactionReference',
      type: 'text',
    },

    {
      name: 'paymentState',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Successful', value: 'successful' },
        { label: 'Failed', value: 'failed' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Refunded', value: 'refunded' },
      ],
    },

    {
      name: 'initiatedAt',
      type: 'date',
    },

    {
      name: 'paidAt',
      type: 'date',
    },

    {
      name: 'providerResponse',
      type: 'json',
      admin: {
        description: 'Raw provider response for audit/debugging.',
      },
    },
  ],

  indexes: [
    {
      fields: ['paymentNumber'],
      unique: true,
    },
    {
      fields: ['transactionReference'],
    },
    {
      fields: ['invoice'],
    },
  ],
}
