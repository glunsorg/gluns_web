// src/collections/RegistrationBatches.ts

import type { CollectionConfig } from 'payload'

export const RegistrationBatches: CollectionConfig = {
  slug: 'registration-batches',

  admin: {
    useAsTitle: 'batchNumber',
    defaultColumns: ['batchNumber', 'registration', 'batchState', 'createdAt'],
  },

  fields: [
    {
      name: 'batchNumber',
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
      name: 'batchState',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Pending Payment', value: 'pending_payment' },
        { label: 'Partially Paid', value: 'partially_paid' },
        { label: 'Paid', value: 'paid' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },

    {
      name: 'sequence',
      type: 'number',
      required: true,
      min: 1,
    },
  ],

  indexes: [
    {
      fields: ['registration', 'sequence'],
      unique: true,
    },
  ],
}
