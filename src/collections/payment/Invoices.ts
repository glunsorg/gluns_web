// src/collections/Invoices.ts

import type { CollectionConfig } from 'payload'

export const Invoices: CollectionConfig = {
  slug: 'invoices',

  admin: {
    useAsTitle: 'invoiceNumber',
    defaultColumns: ['invoiceNumber', 'registration', 'invoiceState', 'total', 'balanceDue'],
  },

  fields: [
    {
      name: 'invoiceNumber',
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
      name: 'batch',
      type: 'relationship',
      relationTo: 'registration-batches',
    },

    {
      name: 'invoiceState',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Issued', value: 'issued' },
        { label: 'Partially Paid', value: 'partially_paid' },
        { label: 'Paid', value: 'paid' },
        { label: 'Overdue', value: 'overdue' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Void', value: 'void' },
      ],
    },

    {
      name: 'issueDate',
      type: 'date',
      required: true,
    },

    {
      name: 'dueDate',
      type: 'date',
    },

    {
      name: 'currency',
      type: 'text',
      required: true,
      defaultValue: 'KES',
    },

    {
      name: 'subtotal',
      type: 'number',
      required: true,
      min: 0,
    },

    {
      name: 'discount',
      type: 'number',
      defaultValue: 0,
      min: 0,
    },

    {
      name: 'tax',
      type: 'number',
      defaultValue: 0,
      min: 0,
    },

    {
      name: 'total',
      type: 'number',
      required: true,
      min: 0,
    },

    {
      name: 'amountPaid',
      type: 'number',
      defaultValue: 0,
      min: 0,
    },

    {
      name: 'balanceDue',
      type: 'number',
      required: true,
      min: 0,
    },

    {
      name: 'pdf',
      type: 'upload',
      relationTo: 'media',
    },

    {
      name: 'notes',
      type: 'textarea',
    },
  ],

  indexes: [
    {
      fields: ['invoiceNumber'],
      unique: true,
    },
    {
      fields: ['registration'],
    },
    {
      fields: ['invoiceState'],
    },
  ],
}
