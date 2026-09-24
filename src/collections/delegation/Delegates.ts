import type { CollectionConfig } from 'payload'

export const Delegates: CollectionConfig = {
  slug: 'delegates',

  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'registration', 'batch', 'delegateState'],
  },

  fields: [
    {
      name: 'fullName',
      type: 'text',
      required: true,
    },

    {
      name: 'firstName',
      type: 'text',
      required: true,
    },

    {
      name: 'lastName',
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
      options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
        { label: 'Other', value: 'other' },
        { label: 'Prefer not to say', value: 'prefer_not_to_say' },
      ],
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
