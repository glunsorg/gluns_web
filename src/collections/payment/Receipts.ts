// src/collections/Receipts.ts

import type { CollectionConfig } from 'payload'

export const Receipts: CollectionConfig = {
  slug: 'receipts',

  admin: {
    useAsTitle: 'receiptNumber',
    defaultColumns: ['receiptNumber', 'payment', 'amount', 'issuedAt'],
  },

  fields: [
    {
      name: 'receiptNumber',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        readOnly: true,
      },
    },

    {
      name: 'payment',
      type: 'relationship',
      relationTo: 'payments',
      required: true,
      unique: true,
    },

    {
      name: 'invoice',
      type: 'relationship',
      relationTo: 'invoices',
      required: true,
    },

    {
      name: 'registration',
      type: 'relationship',
      relationTo: 'registrations',
      required: true,
    },

    {
      name: 'amount',
      type: 'number',
      required: true,
    },

    {
      name: 'currency',
      type: 'text',
      required: true,
    },

    {
      name: 'paymentMethod',
      type: 'text',
      required: true,
    },

    {
      name: 'transactionReference',
      type: 'text',
    },

    {
      name: 'recipientName',
      type: 'text',
      required: true,
    },

    {
      name: 'recipientEmail',
      type: 'email',
    },

    {
      name: 'issuedAt',
      type: 'date',
      required: true,
    },

    {
      name: 'receiptState',
      type: 'select',
      required: true,
      defaultValue: 'issued',
      options: [
        { label: 'Issued', value: 'issued' },
        { label: 'Void', value: 'void' },
      ],
    },

    {
      name: 'pdf',
      type: 'upload',
      relationTo: 'media',
    },
  ],

  indexes: [
    {
      fields: ['receiptNumber'],
      unique: true,
    },
    {
      fields: ['payment'],
      unique: true,
    },
  ],
}
