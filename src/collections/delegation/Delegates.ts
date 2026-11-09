import type { CollectionConfig } from 'payload'
import { delegateAccess } from '@/lib/access'

export const Delegates: CollectionConfig = {
  slug: 'delegates',

  admin: {
    useAsTitle: 'fullName',
    defaultColumns: [
      'fullName',
      'institution',
      'institutionName',
      'registration',
      'batch',
      'delegateState',
    ],
  },
  access: delegateAccess,

  fields: [
    {
      name: 'fullName',
      type: 'text',
      required: true,
    },

    {
      name: 'email',
      type: 'email',
    },

    {
      name: 'phone',
      type: 'text',
    },

    {
      name: 'gender',
      type: 'select',
      required: true,
      defaultValue: 'male',
      options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
        { label: 'Not specified', value: 'not-specified' },
      ],
    },
    {
      name: 'gradeLevel',
      type: 'text',
      required: true,
      defaultValue: 'Grade 12',
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
      required: true,
    },

    {
      name: 'institution',
      type: 'relationship',
      relationTo: 'institutions',
    },

    {
      name: 'institutionName',
      type: 'text',
      admin: {
        description: 'Institution name captured for the delegate.',
      },
    },

    {
      name: 'organ',
      type: 'relationship',
      relationTo: 'organs',
      required: false,
    },

    {
      name: 'committee',
      type: 'relationship',
      relationTo: 'committees',
      required: false,
    },

    {
      name: 'delegateState',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },
  ],

  indexes: [
    {
      fields: ['registration'],
    },
    {
      fields: ['batch'],
    },
  ],
}
