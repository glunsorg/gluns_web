import type { CollectionConfig } from 'payload'

export const Payments: CollectionConfig = {
  slug: 'payments',

  admin: {
    useAsTitle: 'paymentNumber',
    defaultColumns: [
      'paymentNumber',
      'invoice',
      'amount',
      'currency',
      'paymentState',
      'transactionReference',
      'paidAt',
    ],
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
      name: 'transactionReference',
      type: 'text',
      unique: true,
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
        description: 'Raw Paystack response for audit/debugging.',
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
      unique: true,
    },
    {
      fields: ['invoice'],
    },
  ],
}
