import type { CollectionConfig } from 'payload'

export const Registrations: CollectionConfig = {
  slug: 'registrations',

  admin: {
    useAsTitle: 'registrationNumber',
    defaultColumns: [
      'registrationNumber',
      'event',
      'registrationType',
      'registrationState',
      'createdAt',
    ],
  },

  fields: [
    {
      name: 'registrationNumber',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        readOnly: true,
      },
    },

    {
      name: 'event',
      type: 'relationship',
      relationTo: 'events',
      required: true,
    },

    {
      name: 'registrationType',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Individual',
          value: 'individual',
        },
        {
          label: 'Institution',
          value: 'institution',
        },
      ],
    },

    {
      name: 'registeredBy',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },

    {
      name: 'institution',
      type: 'relationship',
      relationTo: 'institutions',
    },

    {
      name: 'registrationState',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Active', value: 'active' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },

    {
      name: 'currency',
      type: 'text',
      required: true,
      defaultValue: 'KES',
    },

    {
      name: 'notes',
      type: 'textarea',
    },
  ],

  indexes: [
    {
      fields: ['registrationNumber'],
      unique: true,
    },
    {
      fields: ['event', 'registeredBy'],
    },
    {
      fields: ['event', 'institution'],
    },
  ],
}
