// src/collections/InvoiceItems.ts

import type { CollectionConfig } from 'payload'

export const InvoiceItems: CollectionConfig = {
  slug: 'invoice-items',

  admin: {
    useAsTitle: 'description',
    defaultColumns: ['invoice', 'description', 'quantity', 'unitPrice', 'amount'],
  },

  fields: [
    {
      name: 'invoice',
      type: 'relationship',
      relationTo: 'invoices',
      required: true,
    },

    {
      name: 'description',
      type: 'text',
      required: true,
    },

    {
      name: 'quantity',
      type: 'number',
      required: true,
      min: 1,
    },

    {
      name: 'unitPrice',
      type: 'number',
      required: true,
      min: 0,
    },

    {
      name: 'amount',
      type: 'number',
      required: true,
      min: 0,
    },

    {
      name: 'delegate',
      type: 'relationship',
      relationTo: 'delegates',
    },
  ],

  indexes: [
    {
      fields: ['invoice'],
    },
  ],
}
